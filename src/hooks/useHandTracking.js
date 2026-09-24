import { useEffect, useRef, useState } from "react";

export function useHandTracking(videoRef, canvasRef, isReady) {
  const [gesture, setGesture] = useState("none");
  const [landmarks, setLandmarks] = useState([]);
  const handsRef = useRef(null);
  const animationRef = useRef(null);
  const gestureHistoryRef = useRef([]);
  const HISTORY_SIZE = 8;

  useEffect(() => {
    if (!isReady) return;

    async function initHandTracking() {
      const { HandLandmarker, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      handsRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      detectHands();
    }

    function detectHands() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !handsRef.current) return;

      const ctx = canvas.getContext("2d");
      const now = performance.now();

      try {
        const results = handsRef.current.detectForVideo(video, now);

        if (results.landmarks && results.landmarks.length > 0) {
          setLandmarks(results.landmarks);
          drawHandSkeleton(ctx, results.landmarks, canvas);

          const raw = detectHeroGesture(results.landmarks);

          // Gesture history — stable detection
          gestureHistoryRef.current.push(raw);
          if (gestureHistoryRef.current.length > HISTORY_SIZE) {
            gestureHistoryRef.current.shift();
          }

          // Only trigger if same gesture appears 6/8 times
          const counts = {};
          gestureHistoryRef.current.forEach((g) => {
            counts[g] = (counts[g] || 0) + 1;
          });

          let stableGesture = "none";
          Object.entries(counts).forEach(([g, count]) => {
            if (count >= 6 && g !== "none") stableGesture = g;
          });

          setGesture(stableGesture);
        } else {
          setLandmarks([]);
          setGesture("none");
          gestureHistoryRef.current = [];
        }
      } catch (e) {}

      animationRef.current = requestAnimationFrame(detectHands);
    }

    initHandTracking();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isReady]);

  return { gesture, landmarks };
}

// ============ DRAW SKELETON ============
function drawHandSkeleton(ctx, landmarksArray, canvas) {
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [5, 9], [9, 13], [13, 17],
  ];

  landmarksArray.forEach((landmarks) => {
    // Lines
    connections.forEach(([s, e]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[s].x * canvas.width, landmarks[s].y * canvas.height);
      ctx.lineTo(landmarks[e].x * canvas.width, landmarks[e].y * canvas.height);
      ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Points
    landmarks.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x * canvas.width, pt.y * canvas.height, i === 0 ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#ff0066" : "#00ffff";
      ctx.fill();
    });
  });
}

// ============ HERO GESTURE DETECTION ============
function detectHeroGesture(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) return "none";

  const hand1 = landmarksArray[0];
  const hand2 = landmarksArray.length > 1 ? landmarksArray[1] : null;

  const f1 = getFingerState(hand1);

  // ============ SPIDER-MAN ============
  // Index UP + Pinky UP + Middle DOWN + Ring DOWN + Thumb tucked
  if (
    !f1.thumb &&
    f1.index &&
    !f1.middle &&
    !f1.ring &&
    f1.pinky
  ) return "spiderman";

  // ============ IRON MAN ============
  // All 5 fingers UP + spread wide
  if (f1.thumb && f1.index && f1.middle && f1.ring && f1.pinky) {
    const spread = getSpread(hand1);
    if (spread > 0.07) return "ironman";
  }

  // ============ THOR ============
  // All fingers DOWN (tight fist)
  if (!f1.index && !f1.middle && !f1.ring && !f1.pinky) {
    return "thor";
  }

  // ============ DR. STRANGE ============
  // Thumb + Index form circle (OK sign)
  // Middle + Ring + Pinky UP
  // ============ DR. STRANGE ============
// Thumb + Index pinch close — middle, ring, pinky UP
if (f1.middle && f1.ring && f1.pinky) {
  const pinchDist = getPinchDistance(hand1);
  if (pinchDist < 0.08) return "strange";
}
  // ============ HULK ============
  // Both hands — both fists closed
  if (hand2) {
    const f2 = getFingerState(hand2);
    if (
      !f1.index && !f1.middle && !f1.ring && !f1.pinky &&
      !f2.index && !f2.middle && !f2.ring && !f2.pinky
    ) return "hulk";
  }

  // ============ CAPTAIN AMERICA ============
  // Index + Middle UP, Ring + Pinky + Thumb DOWN (peace sign)
  if (
    !f1.thumb &&
    f1.index &&
    f1.middle &&
    !f1.ring &&
    !f1.pinky
  ) return "captain";

  // ============ DOOMSDAY ============
  // Both hands — all fingers UP and spread
  if (hand2) {
    const f2 = getFingerState(hand2);
    const spread1 = getSpread(hand1);
    const spread2 = getSpread(hand2);
    if (
      f1.index && f1.middle && f1.ring && f1.pinky &&
      f2.index && f2.middle && f2.ring && f2.pinky &&
      spread1 > 0.05 && spread2 > 0.05
    ) return "doomsday";
  }

  // ============ GHOST ============
  // Wave — all fingers up, single hand, low spread
  if (f1.thumb && f1.index && f1.middle && f1.ring && f1.pinky && !hand2) {
    const spread = getSpread(hand1);
    if (spread <= 0.07) return "wave";
  }

  return "none";
}

// ============ HELPER FUNCTIONS ============

function getFingerState(hand) {
  // Finger tip and pip (middle joint) indices
  const tips = [4, 8, 12, 16, 20];
  const pips = [3, 6, 10, 14, 18];
  const mcps = [2, 5, 9, 13, 17];

  return {
    // Thumb — x axis comparison
    thumb: hand[tips[0]].x < hand[pips[0]].x,

    // Index — y axis: tip above pip
    index: hand[tips[1]].y < hand[pips[1]].y - 0.02,

    // Middle
    middle: hand[tips[2]].y < hand[pips[2]].y - 0.02,

    // Ring
    ring: hand[tips[3]].y < hand[pips[3]].y - 0.02,

    // Pinky
    pinky: hand[tips[4]].y < hand[pips[4]].y - 0.02,
  };
}

function getPinchDistance(hand) {
  const thumb = hand[4];
  const index = hand[8];
  return Math.sqrt(
    Math.pow(thumb.x - index.x, 2) +
    Math.pow(thumb.y - index.y, 2)
  );
}

function getSpread(hand) {
  const tips = [hand[4], hand[8], hand[12], hand[16], hand[20]];
  let total = 0;
  for (let i = 0; i < tips.length - 1; i++) {
    total += Math.abs(tips[i].x - tips[i + 1].x);
  }
  return total / (tips.length - 1);
}