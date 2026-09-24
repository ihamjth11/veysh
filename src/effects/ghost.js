let backgroundFrame = null;
let isCalibrated = false;
let frameCount = 0;

export function calibrateBackground(video, canvas) {
  const ctx = canvas.getContext("2d");
  // Capture multiple frames for better background
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  backgroundFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  isCalibrated = true;
}

export function applyGhostEffect(ctx, video, canvas) {
  frameCount++;

  // Draw current frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (!isCalibrated || !backgroundFrame) {
    // Show instruction
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
    ctx.fillStyle = "rgba(170, 68, 255, 0.9)";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("👻 Step away and click Calibrate!", canvas.width / 2, canvas.height / 2 + 7);
    ctx.textAlign = "left";
    return;
  }

  // Get current frame pixels
  const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const current = currentFrame.data;
  const bg = backgroundFrame.data;

  // Better pixel comparison
  for (let i = 0; i < current.length; i += 4) {
    const rDiff = Math.abs(current[i] - bg[i]);
    const gDiff = Math.abs(current[i + 1] - bg[i + 1]);
    const bDiff = Math.abs(current[i + 2] - bg[i + 2]);
    const diff = (rDiff + gDiff + bDiff) / 3;

    if (diff < 35) {
      // Background pixel — show background fully
      current[i] = bg[i];
      current[i + 1] = bg[i + 1];
      current[i + 2] = bg[i + 2];
      current[i + 3] = 255;
    } else {
      // Person pixel — make transparent
      current[i + 3] = 20;
    }
  }

  // Draw background first
  ctx.putImageData(backgroundFrame, 0, 0);

  // Draw person with transparency
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.putImageData(currentFrame, 0, 0);

  ctx.drawImage(tempCanvas, 0, 0);

  // Ghost glow overlay
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "rgba(170, 68, 255, 0.03)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  // HUD
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "rgba(20, 0, 40, 0.4)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillStyle = "#aa44ff";
  ctx.font = "bold 13px monospace";
  ctx.fillText("GHOST MODE // INVISIBILITY: ACTIVE", 20, 26);
  ctx.fillStyle = "#cc88ff";
  ctx.font = "11px monospace";
  ctx.fillText("👻 YOU ARE INVISIBLE", canvas.width - 180, 26);
  ctx.globalAlpha = 1.0;
}

export function resetCalibration() {
  backgroundFrame = null;
  isCalibrated = false;
  frameCount = 0;
}

export function calibrateBackground(video, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  backgroundFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  isCalibrated = true;
}

export function getCalibrationStatus() {
  return isCalibrated;
}