let backgroundFrame = null;
let isCalibrated = false;
let calibrationTimer = null;

export function calibrateBackground(video, canvas) {
  const ctx = canvas.getContext("2d");
  backgroundFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  isCalibrated = true;
}

export function applyGhostEffect(ctx, video, canvas) {
  // Draw current frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (!isCalibrated || !backgroundFrame) {
    // Not calibrated yet — show countdown text
    ctx.fillStyle = "rgba(124, 58, 237, 0.8)";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Step away from camera for 3 seconds...",
      canvas.width / 2,
      canvas.height / 2
    );
    return;
  }

  // Get current frame
  const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const current = currentFrame.data;
  const background = backgroundFrame.data;

  // Pixel by pixel — compare current vs background
  for (let i = 0; i < current.length; i += 4) {
    const rDiff = Math.abs(current[i] - background[i]);
    const gDiff = Math.abs(current[i + 1] - background[i + 1]);
    const bDiff = Math.abs(current[i + 2] - background[i + 2]);

    const diff = (rDiff + gDiff + bDiff) / 3;

    // If pixel is similar to background — make it more transparent
    if (diff < 30) {
      current[i + 3] = 255; // Keep background
    } else {
      // Person detected — make transparent
      current[i + 3] = 40;
    }
  }

  // Draw background first
  ctx.putImageData(backgroundFrame, 0, 0);
  // Draw modified frame on top
  ctx.putImageData(currentFrame, 0, 0);
}

export function resetCalibration() {
  backgroundFrame = null;
  isCalibrated = false;
}

export function getCalibrationStatus() {
  return isCalibrated;
}