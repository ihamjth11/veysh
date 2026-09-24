import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "../hooks/useCamera";
import { useHandTracking } from "../hooks/useHandTracking";
import {
  applyGhostEffect,
  resetCalibration,
  setInvisible,
} from "../effects/ghost";
import { applySpidermanEffect, resetSpiderman } from "../effects/spiderman";
import { applyIronmanEffect, resetIronman } from "../effects/ironman";
import { applyThorEffect, resetThor } from "../effects/thor";
import { applyStrangeEffect, resetStrange } from "../effects/strange";
import { applyHulkEffect, resetHulk } from "../effects/hulk";
import { applyCaptainEffect, resetCaptain } from "../effects/captain";
import { applyDoomsdayEffect, resetDoomsday } from "../effects/doomsday";

const HEROES = [
  {
    id: "spiderman",
    name: "Spider-Man",
    gesture: "🤘 Rock sign",
    colors: { bg: "#8B0000", accent: "#1a1aff", text: "#ff4444" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#8B0000" />
        <path d="M20 8 C20 8 12 14 10 20 C12 26 20 32 20 32 C20 32 28 26 30 20 C28 14 20 8 20 8Z" fill="#cc0000" />
        <ellipse cx="15" cy="16" rx="4" ry="3" fill="white" transform="rotate(-15 15 16)" />
        <ellipse cx="25" cy="16" rx="4" ry="3" fill="white" transform="rotate(15 25 16)" />
        <path d="M10 20 Q20 18 30 20" stroke="white" strokeWidth="1" fill="none" />
        <path d="M11 24 Q20 21 29 24" stroke="white" strokeWidth="0.8" fill="none" />
        <path d="M20 8 L10 18 M20 8 L30 18 M20 8 L20 32 M10 20 L30 20" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "ironman",
    name: "Iron Man",
    gesture: "✋ Open palm",
    colors: { bg: "#8B0000", accent: "#FFD700", text: "#FFD700" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#8B0000" />
        <path d="M14 10 L26 10 L30 18 L26 22 L20 24 L14 22 L10 18 Z" fill="#cc0000" stroke="#FFD700" strokeWidth="1" />
        <ellipse cx="16" cy="17" rx="3" ry="2.5" fill="#FFD700" opacity="0.9" />
        <ellipse cx="24" cy="17" rx="3" ry="2.5" fill="#FFD700" opacity="0.9" />
        <rect x="16" y="20" width="8" height="2" rx="1" fill="#FFD700" opacity="0.7" />
        <circle cx="20" cy="27" r="3" fill="#00aaff" opacity="0.9" />
        <circle cx="20" cy="27" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    id: "thor",
    name: "Thor",
    gesture: "✊ Fist up",
    colors: { bg: "#1a1a4e", accent: "#aaaaff", text: "#aaaaff" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#1a1a4e" />
        <rect x="15" y="18" width="10" height="14" rx="2" fill="#888" stroke="#aaa" strokeWidth="1" />
        <rect x="10" y="20" width="20" height="5" rx="2" fill="#aaa" stroke="#ddd" strokeWidth="1" />
        <rect x="18" y="8" width="4" height="12" rx="1" fill="#888" stroke="#aaa" strokeWidth="0.5" />
        <line x1="8" y1="12" x2="20" y2="18" stroke="#aaaaff" strokeWidth="2" opacity="0.8" />
        <line x1="32" y1="12" x2="20" y2="18" stroke="#aaaaff" strokeWidth="2" opacity="0.8" />
        <line x1="20" y1="8" x2="20" y2="4" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <circle cx="20" cy="4" r="2" fill="#ffffff" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "strange",
    name: "Dr. Strange",
    gesture: "🤌 OK sign",
    colors: { bg: "#2d1a00", accent: "#FF8C00", text: "#FF8C00" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#2d1a00" />
        <circle cx="20" cy="20" r="12" fill="none" stroke="#FF8C00" strokeWidth="1.5" strokeDasharray="4 2" />
        <circle cx="20" cy="20" r="8" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="20" cy="20" r="4" fill="none" stroke="#FF8C00" strokeWidth="1.5" />
        <line x1="20" y1="8" x2="20" y2="32" stroke="#FF8C00" strokeWidth="0.5" opacity="0.5" />
        <line x1="8" y1="20" x2="32" y2="20" stroke="#FF8C00" strokeWidth="0.5" opacity="0.5" />
        <line x1="11" y1="11" x2="29" y2="29" stroke="#FF8C00" strokeWidth="0.5" opacity="0.5" />
        <line x1="29" y1="11" x2="11" y2="29" stroke="#FF8C00" strokeWidth="0.5" opacity="0.5" />
        <circle cx="20" cy="20" r="2" fill="#FFD700" />
      </svg>
    ),
  },
  {
    id: "hulk",
    name: "Hulk",
    gesture: "✊✊ Both fists",
    colors: { bg: "#004400", accent: "#00ff44", text: "#00ff44" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#004400" />
        <ellipse cx="20" cy="18" rx="10" ry="9" fill="#00aa00" />
        <ellipse cx="15" cy="15" rx="3" ry="3.5" fill="#00cc00" />
        <ellipse cx="25" cy="15" rx="3" ry="3.5" fill="#00cc00" />
        <ellipse cx="15" cy="15" rx="1.5" ry="1.5" fill="#003300" />
        <ellipse cx="25" cy="15" rx="1.5" ry="1.5" fill="#003300" />
        <path d="M15 22 Q20 25 25 22" stroke="#003300" strokeWidth="1.5" fill="none" />
        <path d="M10 18 Q8 15 10 12 L14 14" fill="#00aa00" />
        <path d="M30 18 Q32 15 30 12 L26 14" fill="#00aa00" />
        <circle cx="20" cy="20" r="18" fill="none" stroke="#00ff44" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "captain",
    name: "Cap. America",
    gesture: "✌️ Peace sign",
    colors: { bg: "#000033", accent: "#4488ff", text: "#4488ff" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#000033" />
        <circle cx="20" cy="20" r="14" fill="#cc0000" />
        <circle cx="20" cy="20" r="10" fill="white" />
        <circle cx="20" cy="20" r="6" fill="#0033cc" />
        <polygon points="20,14 21.5,18.5 26,18.5 22.5,21 24,25.5 20,23 16,25.5 17.5,21 14,18.5 18.5,18.5" fill="white" />
      </svg>
    ),
  },
  {
    id: "doomsday",
    name: "Doomsday",
    gesture: "🙌 Both hands spread",
    colors: { bg: "#1a0000", accent: "#ff2200", text: "#ff2200" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#1a0000" />
        <polygon points="20,6 23,16 33,16 25,22 28,32 20,26 12,32 15,22 7,16 17,16" fill="#ff2200" opacity="0.9" />
        <polygon points="20,10 22,17 29,17 23,21 25,28 20,24 15,28 17,21 11,17 18,17" fill="#660000" />
        <circle cx="20" cy="20" r="4" fill="#ff4400" />
        <circle cx="20" cy="20" r="2" fill="#ff0000" />
        <circle cx="20" cy="20" r="18" fill="none" stroke="#ff2200" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "ghost",
    name: "Ghost",
    gesture: "🤚 Wave",
    colors: { bg: "#1a0033", accent: "#aa44ff", text: "#aa44ff" },
    symbol: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#1a0033" />
        <path d="M12 28 L12 18 Q12 10 20 10 Q28 10 28 18 L28 28 L25 25 L22 28 L19 25 L16 28 L13 25 Z" fill="#aa44ff" opacity="0.9" />
        <ellipse cx="17" cy="18" rx="2.5" ry="3" fill="white" />
        <ellipse cx="23" cy="18" rx="2.5" ry="3" fill="white" />
        <ellipse cx="17" cy="19" rx="1.2" ry="1.5" fill="#1a0033" />
        <ellipse cx="23" cy="19" rx="1.2" ry="1.5" fill="#1a0033" />
      </svg>
    ),
  },
];

const GESTURE_MAP = {
  spiderman: "spiderman",
  ironman: "ironman",
  thor: "thor",
  strange: "strange",
  hulk: "hulk",
  captain: "captain",
  doomsday: "doomsday",
  wave: "ghost",
};

function resetAllEffects() {
  resetCalibration();
  resetSpiderman();
  resetIronman();
  resetThor();
  resetStrange();
  resetHulk();
  resetCaptain();
  resetDoomsday();
}

function CameraApp() {
  const { videoRef, isReady, error } = useCamera();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeEffect, setActiveEffect] = useState("spiderman");
  const [gestureLabel, setGestureLabel] = useState("");
  const lastGestureRef = useRef("none");
  const landmarksRef = useRef([]);
  const activeEffectRef = useRef("spiderman");

  const { gesture, landmarks } = useHandTracking(videoRef, canvasRef, isReady);

  useEffect(() => {
    landmarksRef.current = landmarks;
  }, [landmarks]);

  useEffect(() => {
    activeEffectRef.current = activeEffect;
  }, [activeEffect]);

  // Auto switch effect based on gesture
  useEffect(() => {
    if (gesture === "none" || gesture === lastGestureRef.current) return;
    lastGestureRef.current = gesture;

    const newEffect = GESTURE_MAP[gesture];

    if (newEffect && newEffect !== activeEffectRef.current) {
      resetAllEffects();
      setInvisible(false);
      setActiveEffect(newEffect);
      activeEffectRef.current = newEffect;

      const hero = HEROES.find((h) => h.id === newEffect);
      if (hero) {
        setGestureLabel(`${hero.gesture} → ${hero.name}!`);
        setTimeout(() => setGestureLabel(""), 2500);
      }
    }

    // Ghost invisibility toggle
    if (activeEffectRef.current === "ghost") {
      if (gesture === "wave") {
        setInvisible(true);
        setGestureLabel("👻 INVISIBLE ACTIVATED!");
        setTimeout(() => setGestureLabel(""), 2000);
      } else if (gesture === "ironman") {
        // Open palm = visible again
        setInvisible(false);
        setGestureLabel("👁️ VISIBLE AGAIN");
        setTimeout(() => setGestureLabel(""), 2000);
      }
    }
  }, [gesture]);

  // Manual effect switch
  const handleEffectChange = (effectId) => {
    resetAllEffects();
    setInvisible(false);
    setActiveEffect(effectId);
    activeEffectRef.current = effectId;
  };

  // Render loop
  useEffect(() => {
    if (!isReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    const render = () => {
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const lm = landmarksRef.current;

      switch (activeEffectRef.current) {
        case "ghost":
          applyGhostEffect(ctx, video, canvas);
          break;
        case "spiderman":
          applySpidermanEffect(ctx, video, canvas, lm);
          break;
        case "ironman":
          applyIronmanEffect(ctx, video, canvas, lm);
          break;
        case "thor":
          applyThorEffect(ctx, video, canvas, lm);
          break;
        case "strange":
          applyStrangeEffect(ctx, video, canvas, lm);
          break;
        case "hulk":
          applyHulkEffect(ctx, video, canvas, lm);
          break;
        case "captain":
          applyCaptainEffect(ctx, video, canvas, lm);
          break;
        case "doomsday":
          applyDoomsdayEffect(ctx, video, canvas, lm);
          break;
        default:
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isReady]);

  const activeHero = HEROES.find((h) => h.id === activeEffect);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center"
      >
        <h1 className="text-2xl font-black tracking-widest">
          <span className="text-white">VEY</span>
          <span className="text-red-500">SH</span>
        </h1>
        {activeHero && (
          <p
            className="text-sm mt-1 font-bold tracking-wider"
            style={{ color: activeHero.colors.text }}
          >
            {activeHero.name} Mode — {activeHero.gesture}
          </p>
        )}
      </motion.div>

      {/* Camera Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden w-full"
        style={{
          maxWidth: "900px",
          boxShadow: activeHero
            ? `0 0 50px ${activeHero.colors.accent}44`
            : "0 0 40px rgba(255, 50, 0, 0.3)",
          border: `2px solid ${activeHero ? activeHero.colors.accent + "44" : "#ff220044"}`,
        }}
      >
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ transform: "scaleX(-1)", minHeight: "400px" }}
        />

        {/* Gesture popup */}
        <AnimatePresence>
          {gestureLabel && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 backdrop-blur-md text-white px-8 py-3 rounded-full text-sm font-black tracking-wider"
              style={{
                background: activeHero
                  ? `${activeHero.colors.bg}dd`
                  : "#1a000088",
                border: `1px solid ${activeHero ? activeHero.colors.accent : "#ff2200"}`,
              }}
            >
              {gestureLabel}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hand detected */}
        {landmarks.length > 0 && (
          <div
            className="absolute top-4 right-4 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: activeHero ? `${activeHero.colors.bg}99` : "#00000099",
              border: `1px solid ${activeHero ? activeHero.colors.accent + "60" : "#ff220060"}`,
              color: activeHero ? activeHero.colors.text : "#ff4400",
            }}
          >
            ✋ {landmarks.length} hand{landmarks.length > 1 ? "s" : ""}
          </div>
        )}

        {/* Ghost tip */}
        {activeEffect === "ghost" && (
          <div className="absolute bottom-6 left-4 bg-black/60 backdrop-blur-md border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-300">
            <p>👋 <b>Wave</b> → Invisible</p>
            <p>✋ <b>Open palm</b> → Visible</p>
          </div>
        )}

        {/* Loading */}
        {!isReady && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Starting camera...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Hero Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-2 mt-4"
      >
        {HEROES.map((hero) => (
          <motion.button
            key={hero.id}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEffectChange(hero.id)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-200"
            style={{
              background:
                activeEffect === hero.id
                  ? `${hero.colors.bg}cc`
                  : "rgba(0,0,0,0.5)",
              borderColor:
                activeEffect === hero.id
                  ? hero.colors.accent
                  : "rgba(100,50,50,0.3)",
              boxShadow:
                activeEffect === hero.id
                  ? `0 0 20px ${hero.colors.accent}44`
                  : "none",
            }}
          >
            {hero.symbol}
            <span
              className="text-xs font-bold tracking-wide"
              style={{
                color: activeEffect === hero.id ? hero.colors.text : "#555",
              }}
            >
              {hero.name}
            </span>
            <span className="text-xs opacity-40">{hero.gesture}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => window.history.back()}
        className="mt-4 text-gray-600 hover:text-red-400 text-sm transition-colors tracking-wider"
      >
        ← BACK TO HOME
      </motion.button>
    </div>
  );
}

export default CameraApp;