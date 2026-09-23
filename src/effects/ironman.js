const repulsorBlasts = [];
const energyParticles = [];
const targetReticles = [];
let frameCount = 0;
let hudAngle = 0;
let powerLevel = 0;

class RepulsorBlast {
  constructor(x, y, dirX, dirY) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.speed = 18;
    this.size = 25;
    this.life = 1.0;
    this.decay = 0.018;
    this.trail = [];
    this.impacted = false;
  }

  update(canvas) {
    this.trail.push({ x: this.x, y: this.y, size: this.size });
    if (this.trail.length > 20) this.trail.shift();

    this.x += this.dirX * this.speed;
    this.y += this.dirY * this.speed;
    this.life -= this.decay;

    // Spawn energy particles along trail
    if (Math.random() < 0.4) {
      energyParticles.push({
        x: this.x + (Math.random() - 0.5) * 15,
        y: this.y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: Math.random() * 0.5 + 0.2,
        size: Math.random() * 8 + 2,
      });
    }

    // Impact on edges
    if (
      (this.x < 0 || this.x > canvas.width ||
       this.y < 0 || this.y > canvas.height) &&
      !this.impacted
    ) {
      this.impacted = true;
      // Explosion particles
      for (let i = 0; i < 25; i++) {
        energyParticles.push({
          x: this.x,
          y: this.y,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          life: Math.random() * 0.7 + 0.3,
          size: Math.random() * 12 + 4,
        });
      }
      this.life = 0;
    }
  }

  draw(ctx) {
    // Trail
    this.trail.forEach((t, i) => {
      const a = (i / this.trail.length) * this.life;
      const r = t.size * (i / this.trail.length) * 0.8;

      const tg = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r + 10);
      tg.addColorStop(0, `rgba(150, 220, 255, ${a * 0.6})`);
      tg.addColorStop(0.5, `rgba(0, 150, 255, ${a * 0.3})`);
      tg.addColorStop(1, "rgba(0, 50, 255, 0)");
      ctx.beginPath();
      ctx.arc(t.x, t.y, r + 10, 0, Math.PI * 2);
      ctx.fillStyle = tg;
      ctx.fill();
    });

    // Main blast core
    const bg = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 2.5
    );
    bg.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
    bg.addColorStop(0.2, `rgba(180, 230, 255, ${this.life * 0.9})`);
    bg.addColorStop(0.5, `rgba(0, 150, 255, ${this.life * 0.6})`);
    bg.addColorStop(0.8, `rgba(0, 80, 255, ${this.life * 0.3})`);
    bg.addColorStop(1, "rgba(0, 0, 200, 0)");

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();

    // Bright core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
    ctx.fill();

    // Ring
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100, 200, 255, ${this.life * 0.8})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0, 150, 255, 0.9)";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

export function applyIronmanEffect(ctx, video, canvas, handLandmarks) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  frameCount++;
  hudAngle += 0.025;
  powerLevel = Math.min(powerLevel + 0.015, 1.0);

  // Subtle blue tech overlay
  ctx.fillStyle = "rgba(0, 10, 30, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";

  if (handLandmarks && handLandmarks.length > 0) {
    handLandmarks.forEach((hand) => {
      const palm = hand[9];
      const wrist = hand[0];
      const middleTip = hand[12];

      const palmX = (1 - palm.x) * canvas.width;
      const palmY = palm.y * canvas.height;
      const wristX = (1 - wrist.x) * canvas.width;
      const wristY = wrist.y * canvas.height;
      const midX = (1 - middleTip.x) * canvas.width;
      const midY = middleTip.y * canvas.height;

      // Blast direction — palm outward
      const dx = palmX - wristX;
      const dy = palmY - wristY;
      const dist = Math.hypot(dx, dy) || 1;
      const dirX = dx / dist;
      const dirY = dy / dist;

      // Fire repulsor blast
      if (frameCount % 20 === 0) {
        repulsorBlasts.push(new RepulsorBlast(palmX, palmY, dirX, dirY));

        // Add target reticle at blast start
        targetReticles.push({
          x: palmX + dirX * 100,
          y: palmY + dirY * 100,
          life: 1.0,
          size: 40,
        });
      }

      // === ARC REACTOR ON PALM ===
      // Outer ring system
      for (let r = 0; r < 4; r++) {
        const rSize = 30 + r * 12;
        const rSpeed = hudAngle * (r % 2 === 0 ? 1 : -1.3);
        const rAlpha = (0.9 - r * 0.15) * powerLevel;

        ctx.beginPath();
        ctx.arc(palmX, palmY, rSize, rSpeed, rSpeed + Math.PI * 1.6);
        ctx.strokeStyle = `rgba(0, ${150 + r * 20}, 255, ${rAlpha})`;
        ctx.lineWidth = 2.5 - r * 0.3;
        ctx.shadowColor = "rgba(0, 150, 255, 0.6)";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Arc reactor center glow
      const arcGrad = ctx.createRadialGradient(
        palmX, palmY, 0,
        palmX, palmY, 55
      );
      arcGrad.addColorStop(0, `rgba(255, 255, 255, ${powerLevel * 0.95})`);
      arcGrad.addColorStop(0.15, `rgba(150, 220, 255, ${powerLevel * 0.85})`);
      arcGrad.addColorStop(0.4, `rgba(0, 150, 255, ${powerLevel * 0.5})`);
      arcGrad.addColorStop(0.7, `rgba(0, 80, 200, ${powerLevel * 0.2})`);
      arcGrad.addColorStop(1, "rgba(0, 0, 150, 0)");

      ctx.beginPath();
      ctx.arc(palmX, palmY, 55, 0, Math.PI * 2);
      ctx.fillStyle = arcGrad;
      ctx.fill();

      // Energy lines from palm — repulsor rays
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + hudAngle;
        const innerR = 20;
        const outerR = 55 + Math.sin(frameCount * 0.1 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(
          palmX + Math.cos(angle) * innerR,
          palmY + Math.sin(angle) * innerR
        );
        ctx.lineTo(
          palmX + Math.cos(angle) * outerR,
          palmY + Math.sin(angle) * outerR
        );
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.5 * powerLevel})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Fingertip energy dots
      [4, 8, 12, 16, 20].forEach((tipIdx) => {
        const tip = hand[tipIdx];
        const tx = (1 - tip.x) * canvas.width;
        const ty = tip.y * canvas.height;

        const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 10);
        tg.addColorStop(0, `rgba(200, 240, 255, ${powerLevel * 0.9})`);
        tg.addColorStop(1, "rgba(0, 150, 255, 0)");
        ctx.beginPath();
        ctx.arc(tx, ty, 10, 0, Math.PI * 2);
        ctx.fillStyle = tg;
        ctx.fill();
      });

      // Targeting beam in blast direction
      ctx.beginPath();
      ctx.moveTo(palmX, palmY);
      ctx.lineTo(
        palmX + dirX * canvas.width,
        palmY + dirY * canvas.height
      );
      ctx.strokeStyle = `rgba(0, 200, 255, ${0.1 * powerLevel})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 20]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  } else {
    powerLevel = Math.max(0, powerLevel - 0.01);
  }

  // Update repulsor blasts
  for (let i = repulsorBlasts.length - 1; i >= 0; i--) {
    repulsorBlasts[i].update(canvas);
    repulsorBlasts[i].draw(ctx);
    if (repulsorBlasts[i].life <= 0) repulsorBlasts.splice(i, 1);
  }

  // Update energy particles
  for (let i = energyParticles.length - 1; i >= 0; i--) {
    const p = energyParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.life -= 0.03;
    if (p.life <= 0) { energyParticles.splice(i, 1); continue; }

    const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    pg.addColorStop(0, `rgba(200, 240, 255, ${p.life})`);
    pg.addColorStop(0.5, `rgba(0, 150, 255, ${p.life * 0.5})`);
    pg.addColorStop(1, "rgba(0, 80, 255, 0)");
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = pg;
    ctx.fill();
  }

  // Target reticles
  for (let i = targetReticles.length - 1; i >= 0; i--) {
    const t = targetReticles[i];
    t.life -= 0.04;
    t.size += 1;
    if (t.life <= 0) { targetReticles.splice(i, 1); continue; }

    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${t.life * 0.6})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Crosshair
    ctx.beginPath();
    ctx.moveTo(t.x - t.size * 0.4, t.y);
    ctx.lineTo(t.x - t.size * 0.2, t.y);
    ctx.moveTo(t.x + t.size * 0.2, t.y);
    ctx.lineTo(t.x + t.size * 0.4, t.y);
    ctx.moveTo(t.x, t.y - t.size * 0.4);
    ctx.lineTo(t.x, t.y - t.size * 0.2);
    ctx.moveTo(t.x, t.y + t.size * 0.2);
    ctx.lineTo(t.x, t.y + t.size * 0.4);
    ctx.strokeStyle = `rgba(0, 255, 255, ${t.life})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";

  // Iron Man HUD
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(0, 10, 30, 0.5)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

  ctx.fillStyle = "#00ccff";
  ctx.font = "bold 13px monospace";
  ctx.fillText("STARK INDUSTRIES // MARK L — REPULSOR ACTIVE", 20, 26);
  ctx.fillStyle = "#66ddff";
  ctx.font = "11px monospace";
  ctx.fillText(`⚡ POWER: ${Math.floor(powerLevel * 100)}%`, canvas.width - 160, 26);
  ctx.fillText("J.A.R.V.I.S: ONLINE", 20, canvas.height - 18);
  ctx.fillText(`TARGETS: ${repulsorBlasts.length}`, canvas.width - 130, canvas.height - 18);
  ctx.globalAlpha = 1.0;
}

export function resetIronman() {
  repulsorBlasts.length = 0;
  energyParticles.length = 0;
  targetReticles.length = 0;
  frameCount = 0;
  hudAngle = 0;
  powerLevel = 0;
}