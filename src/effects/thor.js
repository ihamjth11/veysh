const lightningBolts = [];
const thunderSparks = [];
const groundCracks = [];
let frameCount = 0;
let screenFlash = 0;
let screenShake = { x: 0, y: 0, intensity: 0 };
let mjolnirCharge = 0;

class MassiveLightning {
  constructor(targetX, targetY, fromTop = true) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.startX = targetX + (Math.random() - 0.5) * 150;
    this.startY = fromTop ? 0 : Math.random() * 100;
    this.points = this.generate(this.startX, this.startY, targetX, targetY, 20);
    this.life = 1.0;
    this.decay = 0.04;
    this.width = Math.random() * 4 + 3;
    this.branches = [];
    this.color = Math.random() > 0.3 ? "#88aaff" : "#ffffff";

    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * this.points.length);
      const p = this.points[idx];
      if (p) {
        const endX = p.x + (Math.random() - 0.5) * 250;
        const endY = p.y + (Math.random()) * 200;
        this.branches.push({
          points: this.generate(p.x, p.y, endX, endY, 10),
          life: 1.0,
          width: Math.random() * 2 + 1,
        });
      }
    }
  }

  generate(x1, y1, x2, y2, segs = 16) {
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      pts.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 140,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 80,
      });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  draw(ctx) {
    const drawPath = (pts, w, color, alpha, blur = 0) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = color.replace("{a}", String(alpha));
      ctx.lineWidth = w;
      ctx.shadowBlur = blur;
      ctx.shadowColor = "#6688ff";
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Massive outer glow
    drawPath(this.points, this.width * 8, `rgba(50, 80, 255, {a})`, this.life * 0.15, 30);
    drawPath(this.points, this.width * 4, `rgba(100, 150, 255, {a})`, this.life * 0.3, 15);
    drawPath(this.points, this.width * 2, `rgba(180, 200, 255, {a})`, this.life * 0.6, 8);
    drawPath(this.points, this.width, `rgba(255, 255, 255, {a})`, this.life, 0);

    // Branches
    this.branches.forEach((b) => {
      b.life -= 0.06;
      if (b.life > 0) {
        drawPath(b.points, b.width * 2, `rgba(100, 150, 255, {a})`, b.life * 0.4);
        drawPath(b.points, b.width * 0.8, `rgba(220, 230, 255, {a})`, b.life * 0.8);
      }
    });
  }

  update() { this.life -= this.decay; }
}

class GroundCrack {
  constructor(x, y, canvas) {
    this.points = [{ x, y }];
    this.life = 1.0;
    this.decay = 0.005;
    let cx = x, cy = y;
    for (let i = 0; i < 12; i++) {
      cx += (Math.random() - 0.5) * 100;
      cy += Math.random() * 60;
      if (cy > canvas.height) cy = canvas.height;
      this.points.push({ x: cx, y: cy });
    }
    this.branches = [];
    for (let b = 0; b < 3; b++) {
      const idx = Math.floor(Math.random() * this.points.length);
      const p = this.points[idx];
      if (p) {
        const bpts = [{ x: p.x, y: p.y }];
        let bx = p.x, by = p.y;
        for (let i = 0; i < 6; i++) {
          bx += (Math.random() - 0.5) * 60;
          by += Math.random() * 40;
          bpts.push({ x: bx, y: by });
        }
        this.branches.push({ points: bpts, life: 1.0 });
      }
    }
  }

  draw(ctx) {
    const drawCrack = (pts, w, alpha) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`;
      ctx.lineWidth = w;
      ctx.shadowColor = "rgba(80, 120, 255, 0.8)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    drawCrack(this.points, 3, this.life * 0.8);
    drawCrack(this.points, 1, this.life);
    this.branches.forEach((b) => {
      b.life -= 0.004;
      if (b.life > 0) drawCrack(b.points, 1, b.life * 0.6);
    });
    this.life -= this.decay;
  }
}

export function applyThorEffect(ctx, video, canvas, handLandmarks) {
  frameCount++;

  // Screen shake
  if (screenShake.intensity > 0) {
    screenShake.x = (Math.random() - 0.5) * screenShake.intensity * 15;
    screenShake.y = (Math.random() - 0.5) * screenShake.intensity * 15;
    ctx.save();
    ctx.translate(screenShake.x, screenShake.y);
    screenShake.intensity -= 0.04;
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (screenShake.intensity > 0) ctx.restore();

  // Screen flash
  if (screenFlash > 0) {
    ctx.fillStyle = `rgba(180, 200, 255, ${screenFlash * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    screenFlash -= 0.06;
  }

  // Dark storm atmosphere
  const stormGrad = ctx.createRadialGradient(
    canvas.width / 2, 0, 0,
    canvas.width / 2, 0, canvas.height
  );
  stormGrad.addColorStop(0, "rgba(0, 0, 30, 0.3)");
  stormGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = stormGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";

  if (handLandmarks && handLandmarks.length > 0) {
    handLandmarks.forEach((hand) => {
      const fist = hand[9];
      const fistX = (1 - fist.x) * canvas.width;
      const fistY = fist.y * canvas.height;

      mjolnirCharge = Math.min(mjolnirCharge + 0.02, 1.0);

      // Major lightning strike from sky
      if (frameCount % 18 === 0) {
        lightningBolts.push(new MassiveLightning(fistX, fistY, true));
        screenFlash = 1.0;
        screenShake.intensity = 1.0;

        // Ground cracks
        groundCracks.push(new GroundCrack(fistX, canvas.height * 0.7, canvas));

        // Massive spark burst
        for (let i = 0; i < 40; i++) {
          thunderSparks.push({
            x: fistX,
            y: fistY,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            life: Math.random() * 0.9 + 0.3,
            size: Math.random() * 5 + 2,
            color: Math.random() > 0.5 ? "#88aaff" : "#ffffff",
          });
        }
      }

      // Continuous small random bolts
      if (frameCount % 4 === 0) {
        const endX = fistX + (Math.random() - 0.5) * 300;
        const endY = fistY + (Math.random() - 0.5) * 300;
        lightningBolts.push({
          points: generateSimpleLightning(fistX, fistY, endX, endY),
          life: 1.0,
          decay: 0.15,
          width: 1.5,
          draw(ctx) {
            if (this.points.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            this.points.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = `rgba(150, 180, 255, ${this.life * 0.8})`;
            ctx.lineWidth = this.width;
            ctx.stroke();
          },
          update() { this.life -= this.decay; }
        });
      }

      // Mjolnir fist — massive energy
      const chargeSize = 60 + mjolnirCharge * 40;
      const mjGrad = ctx.createRadialGradient(fistX, fistY, 0, fistX, fistY, chargeSize);
      mjGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * mjolnirCharge})`);
      mjGrad.addColorStop(0.2, `rgba(150, 180, 255, ${0.7 * mjolnirCharge})`);
      mjGrad.addColorStop(0.5, `rgba(80, 100, 255, ${0.4 * mjolnirCharge})`);
      mjGrad.addColorStop(1, "rgba(0, 0, 200, 0)");
      ctx.beginPath();
      ctx.arc(fistX, fistY, chargeSize, 0, Math.PI * 2);
      ctx.fillStyle = mjGrad;
      ctx.fill();

      // Electric ring
      ctx.beginPath();
      ctx.arc(fistX, fistY, 50 + Math.sin(frameCount * 0.2) * 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(150, 180, 255, 0.9)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#8888ff";
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Lightning tendrils from fist
      for (let i = 0; i < 3; i++) {
        const angle = (frameCount * 0.05 + i * Math.PI * 0.66);
        const tx = fistX + Math.cos(angle) * 80;
        const ty = fistY + Math.sin(angle) * 80;
        ctx.beginPath();
        ctx.moveTo(fistX, fistY);
        ctx.lineTo(tx + (Math.random() - 0.5) * 30, ty + (Math.random() - 0.5) * 30);
        ctx.strokeStyle = `rgba(200, 220, 255, 0.7)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  // Draw lightning bolts
  for (let i = lightningBolts.length - 1; i >= 0; i--) {
    lightningBolts[i].update();
    lightningBolts[i].draw(ctx);
    if (lightningBolts[i].life <= 0) lightningBolts.splice(i, 1);
  }

  // Draw sparks
  for (let i = thunderSparks.length - 1; i >= 0; i--) {
    const s = thunderSparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.4;
    s.vx *= 0.97;
    s.life -= 0.025;
    if (s.life <= 0) { thunderSparks.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = s.color.includes("#") ?
      `rgba(150, 180, 255, ${s.life})` :
      `rgba(255, 255, 255, ${s.life})`;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";

  // Ground cracks
  groundCracks.forEach((c, i) => {
    c.draw(ctx);
    if (c.life <= 0) groundCracks.splice(i, 1);
  });

  // Thor HUD
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(5, 5, 25, 0.5)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillStyle = "#aabbff";
  ctx.font = "bold 13px monospace";
  ctx.fillText("THOR ODINSON // MJOLNIR CHARGED", 20, 26);
  ctx.fillStyle = "#8899ff";
  ctx.font = "11px monospace";
  ctx.fillText(`⚡ POWER: ${Math.floor(mjolnirCharge * 100)}%`, canvas.width - 160, 26);
  ctx.globalAlpha = 1.0;
}

function generateSimpleLightning(x1, y1, x2, y2) {
  const pts = [{ x: x1, y: y1 }];
  for (let i = 1; i < 8; i++) {
    const t = i / 8;
    pts.push({
      x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 80,
      y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 60,
    });
  }
  pts.push({ x: x2, y: y2 });
  return pts;
}

export function resetThor() {
  lightningBolts.length = 0;
  thunderSparks.length = 0;
  groundCracks.length = 0;
  frameCount = 0;
  screenFlash = 0;
  screenShake = { x: 0, y: 0, intensity: 0 };
  mjolnirCharge = 0;
}