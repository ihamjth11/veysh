const mandalaSparks = [];
const portalParticles = [];
const magicTrails = [];
let frameCount = 0;
let portalAngle = 0;
let sparkAngle = 0;
let chargeLevel = 0;

class MagicSpark {
  constructor(centerX, centerY, radius, speed, color) {
    this.angle = Math.random() * Math.PI * 2;
    this.radius = radius + (Math.random() - 0.5) * 20;
    this.centerX = centerX;
    this.centerY = centerY;
    this.speed = speed * (Math.random() > 0.5 ? 1 : -1);
    this.life = Math.random() * 0.9 + 0.3;
    this.decay = Math.random() * 0.008 + 0.004;
    this.size = Math.random() * 5 + 2;
    this.color = color;
    this.trail = [];
  }

  update() {
    const x = this.centerX + Math.cos(this.angle) * this.radius;
    const y = this.centerY + Math.sin(this.angle) * this.radius;
    this.trail.push({ x, y });
    if (this.trail.length > 12) this.trail.shift();
    this.angle += this.speed;
    this.life -= this.decay;
  }

  draw(ctx) {
    const x = this.centerX + Math.cos(this.angle) * this.radius;
    const y = this.centerY + Math.sin(this.angle) * this.radius;

    // Trail
    this.trail.forEach((t, i) => {
      const a = (i / this.trail.length) * this.life * 0.4;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.size * (i / this.trail.length) * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${a})`;
      ctx.fill();
    });

    // Spark head
    const g = ctx.createRadialGradient(x, y, 0, x, y, this.size * 2.5);
    g.addColorStop(0, `rgba(255, 255, 200, ${this.life})`);
    g.addColorStop(0.4, `rgba(${this.color}, ${this.life * 0.7})`);
    g.addColorStop(1, `rgba(${this.color}, 0)`);
    ctx.beginPath();
    ctx.arc(x, y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

function drawMandalaCircle(ctx, cx, cy, radius, segments, angle, color, alpha, lineWidth = 1.5) {
  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = `rgba(${color}, 0.6)`;
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Segment lines
  for (let i = 0; i < segments; i++) {
    const a = (i * Math.PI * 2) / segments + angle;
    const innerR = radius * 0.6;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.lineTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.6})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Inner decorative ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.5})`;
  ctx.lineWidth = lineWidth * 0.5;
  ctx.stroke();
}

function drawStarPolygon(ctx, cx, cy, outerR, innerR, points, angle, color, alpha) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points + angle;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = `rgba(${color}, 0.5)`;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function applyStrangeEffect(ctx, video, canvas, handLandmarks) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  frameCount++;
  portalAngle += 0.018;
  sparkAngle += 0.025;

  // Mystical dark ambient
  const ambient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
    canvas.width / 2, canvas.height / 2, canvas.height * 0.8
  );
  ambient.addColorStop(0, "rgba(0,0,0,0)");
  ambient.addColorStop(1, "rgba(20, 5, 0, 0.25)");
  ctx.fillStyle = ambient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";

  if (handLandmarks && handLandmarks.length > 0) {
    chargeLevel = Math.min(chargeLevel + 0.015, 1.0);

    handLandmarks.forEach((hand, handIdx) => {
      const palm = hand[9];
      const palmX = (1 - palm.x) * canvas.width;
      const palmY = palm.y * canvas.height;

      const thumbTip = hand[4];
      const indexTip = hand[8];
      const thumbX = (1 - thumbTip.x) * canvas.width;
      const thumbY = thumbTip.y * canvas.height;
      const indexX = (1 - indexTip.x) * canvas.width;
      const indexY = indexTip.y * canvas.height;

      const baseRadius = 80 + chargeLevel * 40;
      const dir = handIdx % 2 === 0 ? 1 : -1;

      // === MANDALA RINGS ===
      // Ring 1 — outer rotating
      drawMandalaCircle(
        ctx, palmX, palmY, baseRadius,
        12, portalAngle * dir,
        "255, 140, 0", chargeLevel * 0.8, 2
      );

      // Ring 2 — counter rotating
      drawMandalaCircle(
        ctx, palmX, palmY, baseRadius * 0.72,
        8, -portalAngle * 1.5 * dir,
        "255, 180, 50", chargeLevel * 0.7, 1.5
      );

      // Ring 3 — inner fast
      drawMandalaCircle(
        ctx, palmX, palmY, baseRadius * 0.48,
        6, portalAngle * 2 * dir,
        "255, 220, 100", chargeLevel * 0.9, 1
      );

      // Star polygon
      drawStarPolygon(
        ctx, palmX, palmY,
        baseRadius * 0.62, baseRadius * 0.32,
        6, -portalAngle * dir,
        "255, 160, 20", chargeLevel * 0.6
      );

      // Inner star
      drawStarPolygon(
        ctx, palmX, palmY,
        baseRadius * 0.38, baseRadius * 0.18,
        5, portalAngle * 1.8 * dir,
        "255, 200, 80", chargeLevel * 0.7
      );

      // === ROTATING SPARK POINTS ===
      const sparkCount = 16;
      for (let i = 0; i < sparkCount; i++) {
        const a = (i * Math.PI * 2) / sparkCount + sparkAngle * dir;
        const sx = palmX + Math.cos(a) * baseRadius;
        const sy = palmY + Math.sin(a) * baseRadius;

        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 7);
        sg.addColorStop(0, `rgba(255, 255, 200, ${chargeLevel})`);
        sg.addColorStop(0.5, `rgba(255, 160, 20, ${chargeLevel * 0.6})`);
        sg.addColorStop(1, "rgba(255, 100, 0, 0)");
        ctx.beginPath();
        ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      }

      // === CENTER PALM GLOW ===
      const centerGrad = ctx.createRadialGradient(
        palmX, palmY, 0,
        palmX, palmY, baseRadius * 0.35
      );
      centerGrad.addColorStop(0, `rgba(255, 220, 100, ${chargeLevel * 0.9})`);
      centerGrad.addColorStop(0.4, `rgba(255, 120, 0, ${chargeLevel * 0.5})`);
      centerGrad.addColorStop(1, "rgba(200, 60, 0, 0)");
      ctx.beginPath();
      ctx.arc(palmX, palmY, baseRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = centerGrad;
      ctx.fill();

      // Outer glow
      const outerGrad = ctx.createRadialGradient(
        palmX, palmY, baseRadius * 0.8,
        palmX, palmY, baseRadius * 1.6
      );
      outerGrad.addColorStop(0, `rgba(255, 100, 0, ${chargeLevel * 0.2})`);
      outerGrad.addColorStop(1, "rgba(200, 50, 0, 0)");
      ctx.beginPath();
      ctx.arc(palmX, palmY, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // === THUMB-INDEX CONNECTION (OK sign energy) ===
      const midX = (thumbX + indexX) / 2;
      const midY = (thumbY + indexY) / 2;

      ctx.beginPath();
      ctx.moveTo(thumbX, thumbY);
      ctx.quadraticCurveTo(midX, midY - 20, indexX, indexY);
      ctx.strokeStyle = `rgba(255, 180, 50, ${chargeLevel * 0.9})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(255, 150, 0, 0.8)";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Thumb + Index glow dots
      [{ x: thumbX, y: thumbY }, { x: indexX, y: indexY }].forEach((pt) => {
        const dg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 15);
        dg.addColorStop(0, `rgba(255, 255, 200, ${chargeLevel})`);
        dg.addColorStop(1, "rgba(255, 150, 0, 0)");
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = dg;
        ctx.fill();
      });

      // Spawn sparks
      if (frameCount % 3 === 0) {
        for (let r = 0; r < 3; r++) {
          mandalaSparks.push(new MagicSpark(
            palmX, palmY,
            baseRadius * (0.45 + r * 0.28),
            0.04 + r * 0.01,
            "255, 150, 20"
          ));
        }
      }

      // === TWO HAND PORTAL ===
      if (handLandmarks.length === 2 && handIdx === 0) {
        const h2 = handLandmarks[1];
        const p2 = h2[9];
        const p2x = (1 - p2.x) * canvas.width;
        const p2y = p2.y * canvas.height;

        // Energy beam between hands
        const steps = 20;
        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          const bx = palmX + (p2x - palmX) * t + Math.sin(frameCount * 0.1 + s) * 20;
          const by = palmY + (p2y - palmY) * t + Math.cos(frameCount * 0.1 + s) * 20;

          ctx.beginPath();
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 180, 50, ${0.6 * chargeLevel})`;
          ctx.fill();
        }

        // Beam line
        ctx.beginPath();
        ctx.moveTo(palmX, palmY);
        ctx.lineTo(p2x, p2y);
        ctx.strokeStyle = `rgba(255, 140, 0, ${chargeLevel * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  } else {
    chargeLevel = Math.max(0, chargeLevel - 0.02);
  }

  // Update sparks
  for (let i = mandalaSparks.length - 1; i >= 0; i--) {
    mandalaSparks[i].update();
    mandalaSparks[i].draw(ctx);
    if (mandalaSparks[i].life <= 0) mandalaSparks.splice(i, 1);
  }

  ctx.globalCompositeOperation = "source-over";

  // Dr. Strange HUD
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(20, 8, 0, 0.45)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillStyle = "#ffaa33";
  ctx.font = "bold 13px monospace";
  ctx.fillText("DR. STRANGE // SLING RING: CHANNELING", 20, 26);
  ctx.fillStyle = "#ffcc66";
  ctx.font = "11px monospace";
  ctx.fillText(`✨ MYSTIC: ${Math.floor(chargeLevel * 100)}%`, canvas.width - 160, 26);
  ctx.globalAlpha = 1.0;
}

export function resetStrange() {
  mandalaSparks.length = 0;
  portalParticles.length = 0;
  magicTrails.length = 0;
  frameCount = 0;
  portalAngle = 0;
  sparkAngle = 0;
  chargeLevel = 0;
}