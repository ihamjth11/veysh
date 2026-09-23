const webStrands = [];
const webNodes = [];
const webGlows = [];
let frameCount = 0;
let wristGlowPulse = 0;

class WebStrand {
  constructor(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    // Shoot in random upward direction
    const angle = (Math.random() * Math.PI * 0.8) - Math.PI * 0.9;
    const speed = Math.random() * 15 + 10;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.points = [{ x: startX, y: startY }];
    this.life = 1.0;
    this.decay = 0.004;
    this.thickness = Math.random() * 1.5 + 0.5;
    this.maxLength = Math.floor(Math.random() * 20 + 15);
    this.stuck = false;
    this.stuckX = 0;
    this.stuckY = 0;
    this.branches = [];
    this.branchSpawned = false;
    this.gravity = 0.3;
  }

  update(canvas) {
    if (this.stuck) {
      this.life -= this.decay;
      return;
    }

    // Add physics
    this.vy += this.gravity;
    const lastPt = this.points[this.points.length - 1];
    const newX = lastPt.x + this.vx;
    const newY = lastPt.y + this.vy;

    this.points.push({ x: newX, y: newY });

    // Stick to walls or ceiling
    if (
      newX <= 5 || newX >= canvas.width - 5 ||
      newY <= 5 || newY >= canvas.height - 5 ||
      this.points.length >= this.maxLength
    ) {
      this.stuck = true;
      this.stuckX = newX;
      this.stuckY = newY;

      // Spawn web spread at stuck point
      for (let i = 0; i < 5; i++) {
        webNodes.push(new WebNode(newX, newY));
      }

      // Spawn branches
      if (!this.branchSpawned) {
        this.branchSpawned = true;
        for (let b = 0; b < 3; b++) {
          const midIdx = Math.floor(this.points.length * 0.4 + Math.random() * this.points.length * 0.4);
          if (this.points[midIdx]) {
            webStrands.push(new WebBranch(
              this.points[midIdx].x,
              this.points[midIdx].y
            ));
          }
        }
      }
    }

    this.life -= this.decay * 0.3;
  }

  draw(ctx) {
    if (this.points.length < 2) return;

    // Outer glow
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = `rgba(200, 220, 255, ${this.life * 0.3})`;
    ctx.lineWidth = this.thickness + 3;
    ctx.shadowColor = "rgba(150, 180, 255, 0.6)";
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Main strand
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = `rgba(230, 235, 255, ${this.life * 0.9})`;
    ctx.lineWidth = this.thickness;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Shine highlight
    ctx.beginPath();
    ctx.moveTo(this.points[0].x - 0.5, this.points[0].y);
    this.points.forEach((p) => ctx.lineTo(p.x - 0.5, p.y));
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.4})`;
    ctx.lineWidth = this.thickness * 0.3;
    ctx.stroke();
  }
}

class WebBranch {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.points = [{ x, y }];
    this.life = 0.7;
    this.decay = 0.006;
    this.thickness = 0.5;
    this.maxLength = Math.floor(Math.random() * 10 + 5);
    this.gravity = 0.15;
  }

  update() {
    if (this.points.length >= this.maxLength) {
      this.life -= this.decay;
      return;
    }
    this.vy += this.gravity;
    const last = this.points[this.points.length - 1];
    this.points.push({ x: last.x + this.vx, y: last.y + this.vy });
    this.life -= this.decay * 0.2;
  }

  draw(ctx) {
    if (this.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = `rgba(210, 220, 255, ${this.life * 0.6})`;
    ctx.lineWidth = this.thickness;
    ctx.stroke();
  }
}

class WebNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 1;
    this.life = Math.random() * 0.8 + 0.2;
    this.decay = 0.008;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 230, 255, ${this.life})`;
    ctx.shadowColor = "rgba(150, 180, 255, 0.8)";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export function applySpidermanEffect(ctx, video, canvas, handLandmarks) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  frameCount++;
  wristGlowPulse += 0.08;

  if (handLandmarks && handLandmarks.length > 0) {
    handLandmarks.forEach((hand) => {
      const wrist = hand[0];
      const wristX = (1 - wrist.x) * canvas.width;
      const wristY = wrist.y * canvas.height;

      const indexTip = hand[8];
      const pinkyTip = hand[20];
      const indexX = (1 - indexTip.x) * canvas.width;
      const indexY = indexTip.y * canvas.height;
      const pinkyX = (1 - pinkyTip.x) * canvas.width;
      const pinkyY = pinkyTip.y * canvas.height;

      // Shoot web every 12 frames
      if (frameCount % 12 === 0) {
        webStrands.push(new WebStrand(wristX, wristY));
      }

      // Wrist shooter glow — pulsing
      const pulse = Math.sin(wristGlowPulse) * 0.3 + 0.7;

      // Outer red glow
      const outerGrad = ctx.createRadialGradient(
        wristX, wristY, 0,
        wristX, wristY, 45
      );
      outerGrad.addColorStop(0, `rgba(255, 30, 30, ${pulse * 0.8})`);
      outerGrad.addColorStop(0.4, `rgba(180, 0, 0, ${pulse * 0.4})`);
      outerGrad.addColorStop(1, "rgba(100, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(wristX, wristY, 45, 0, Math.PI * 2);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Inner web shooter blue-white
      const innerGrad = ctx.createRadialGradient(
        wristX, wristY, 0,
        wristX, wristY, 18
      );
      innerGrad.addColorStop(0, `rgba(255, 255, 255, ${pulse})`);
      innerGrad.addColorStop(0.4, `rgba(150, 200, 255, ${pulse * 0.8})`);
      innerGrad.addColorStop(1, "rgba(50, 100, 255, 0)");
      ctx.beginPath();
      ctx.arc(wristX, wristY, 18, 0, Math.PI * 2);
      ctx.fillStyle = innerGrad;
      ctx.fill();

      // Web shooter ring
      ctx.beginPath();
      ctx.arc(wristX, wristY, 22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 50, 50, ${pulse * 0.9})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(255, 0, 0, 0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Index + Pinky fingertip glow — Spider-Man sign
      [{ x: indexX, y: indexY }, { x: pinkyX, y: pinkyY }].forEach((tip) => {
        const tipGrad = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 12);
        tipGrad.addColorStop(0, `rgba(255, 255, 255, ${pulse})`);
        tipGrad.addColorStop(0.5, `rgba(200, 50, 50, ${pulse * 0.6})`);
        tipGrad.addColorStop(1, "rgba(150, 0, 0, 0)");
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = tipGrad;
        ctx.fill();
      });

      // Energy line between index and pinky
      ctx.beginPath();
      ctx.moveTo(indexX, indexY);
      ctx.lineTo(pinkyX, pinkyY);
      ctx.strokeStyle = `rgba(255, 100, 100, ${pulse * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // Draw all web elements
  ctx.globalCompositeOperation = "screen";

  // Update + draw web nodes
  for (let i = webNodes.length - 1; i >= 0; i--) {
    webNodes[i].update();
    webNodes[i].draw(ctx);
    if (webNodes[i].life <= 0) webNodes.splice(i, 1);
  }

  // Update + draw web strands
  for (let i = webStrands.length - 1; i >= 0; i--) {
    if (webStrands[i] instanceof WebBranch) {
      webStrands[i].update();
      webStrands[i].draw(ctx);
    } else {
      webStrands[i].update(canvas);
      webStrands[i].draw(ctx);
    }
    if (webStrands[i].life <= 0) webStrands.splice(i, 1);
  }

  ctx.globalCompositeOperation = "source-over";

  // Spider-Man HUD
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(80, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, 42);

  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 13px monospace";
  ctx.fillText("SPIDER-MAN // WEB-SHOOTER: ACTIVE", 20, 26);

  ctx.fillStyle = "#ff8888";
  ctx.font = "11px monospace";
  ctx.fillText(`WEB FLUID: ${Math.max(0, 100 - webStrands.length)}%`, canvas.width - 160, 26);
  ctx.globalAlpha = 1.0;
}

export function resetSpiderman() {
  webStrands.length = 0;
  webNodes.length = 0;
  webGlows.length = 0;
  frameCount = 0;
  wristGlowPulse = 0;
}