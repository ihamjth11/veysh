let segmenter = null;
let isInitialized = false;
let backgroundCanvas = null;
let backgroundCtx = null;
let outputCanvas = null;
let outputCtx = null;
let frameCount = 0;
let invisibilityLevel = 0;
let isInvisible = false;

async function initSegmenter() {
  if (isInitialized) return;

  const { SelfieSegmentation } = await import("@mediapipe/selfie_segmentation");

  segmenter = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  segmenter.setOptions({
    modelSelection: 1, // 1 = landscape model — better quality
  });

  isInitialized = true;
}

export function setInvisible(value) {
  isInvisible = value;
  if (value) {
    invisibilityLevel = 0;
  }
}

export function applyGhostEffect(ctx, video, canvas) {
  frameCount++;

  // Initialize segmenter
  if (!isInitialized) {
    initSegmenter();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Loading message
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
    ctx.fillStyle = "#aa44ff";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("👻 Initializing Ghost Mode...", canvas.width / 2, canvas.height / 2 + 7);
    ctx.textAlign = "left";
    return;
  }

  if (!isInvisible) {
    // Normal view — not invisible
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show hint
    ctx.fillStyle = "rgba(170, 68, 255, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(canvas.width / 2 - 180, canvas.height - 70, 360, 50);
    ctx.fillStyle = "#cc88ff";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("👋 WAVE to become INVISIBLE", canvas.width / 2, canvas.height - 38);
    ctx.textAlign = "left";

    // HUD
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "rgba(20, 0, 40, 0.4)";
    ctx.fillRect(0, 0, canvas.width, 42);
    ctx.fillStyle = "#aa44ff";
    ctx.font = "bold 13px monospace";
    ctx.fillText("GHOST MODE // STANDBY", 20, 26);
    ctx.globalAlpha = 1.0;
    return;
  }

  // Invisibility active — use canvas pixel manipulation
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Ramp up invisibility
  invisibilityLevel = Math.min(invisibilityLevel + 0.08, 1.0);

  // Apply invisibility — make person semi-transparent
  // Simple skin detection + general transparency
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to HSV-like
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = max / 255;
    const saturation = max === 0 ? 0 : (max - min) / max;

    // Make everything semi-transparent based on invisibility level
    data[i + 3] = Math.floor(255 * (1 - invisibilityLevel * 0.92));
  }

  ctx.putImageData(imageData, 0, 0);

  // Invisibility shimmer effect
  ctx.globalCompositeOperation = "screen";

  // Edge shimmer
  const shimmerGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  shimmerGrad.addColorStop(0, `rgba(170, 68, 255, ${0.05 * invisibilityLevel})`);
  shimmerGrad.addColorStop(0.5, `rgba(200, 150, 255, ${0.08 * invisibilityLevel})`);
  shimmerGrad.addColorStop(1, `rgba(170, 68, 255, ${0.05 * invisibilityLevel})`);
  ctx.fillStyle = shimmerGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Distortion waves
  if (frameCount % 3 === 0) {
    const waveY = (frameCount * 2) % canvas.height;
    ctx.fillStyle = `rgba(200, 150, 255, ${0.04 * invisibilityLevel})`;
    ctx.fillRect(0, waveY, canvas.width, 2);
  }

  ctx.globalCompositeOperation = "source-over";

  // HUD
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "rgba(20, 0, 40, 0.4)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillStyle = "#aa44ff";
  ctx.font = "bold 13px monospace";
  ctx.fillText("GHOST MODE // INVISIBLE: ACTIVE", 20, 26);
  ctx.fillStyle = "#cc88ff";
  ctx.font = "11px monospace";
  ctx.fillText(`👻 ${Math.floor(invisibilityLevel * 100)}% INVISIBLE`, canvas.width - 180, 26);
  ctx.globalAlpha = 1.0;
}

export function resetCalibration() {
  isInvisible = false;
  invisibilityLevel = 0;
  frameCount = 0;
}

export function getCalibrationStatus() {
  return isInvisible;
}

export function calibrateBackground(video, canvas) {
  // Not needed anymore
}