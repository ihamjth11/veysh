const shields = [];
const starTrails = [];
const impactParticles = [];
let frameCount = 0;
let shieldAngle = 0;
let chargeLevel = 0;

class Shield {
  constructor(x, y, dirX, dirY) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.speed = 14;
    this.radius = 50;
    this.angle = 0;
    this.rotSpeed = 0.18;
    this.life = 1.0;
    this.decay = 0.006;
    this.bounces = 0;
    this.maxBounces = 4;
    this.trail = [];
    this.glowPulse = 0;
  }

  update(canvas) {
    this.glowPulse += 0.12;
    this.trail.push({ x: this.x, y: this.y, angle: this.angle });
    if (this.trail.length > 25) this.trail.shift();

    this.x += this.dirX * this.speed;
    this.y += this.dirY * this.speed;
    this.angle += this.rotSpeed;
    this.life -= this.decay;

    // Star trail particles
    if (Math.random() < 0.4) {
      starTrails.push({
        x: this.x + (Math.random() - 0.5) * 20,
        y: this.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: Math.random() * 0.6 + 0.2,
        size: Math.random() * 5 + 2,
        isStar: Math.random() > 0.6,
      });
    }

    // Bounce off walls
    let bounced = false;
    if (this.x - this.radius < 0) {
      this.dirX = Math.abs(this.dirX);
      bounced = true;
    } else if (this.x + this.radius > canvas.width) {
      this.dirX = -Math.abs(this.dirX);
      bounced = true;
    }
    if (this.y - this.radius < 0) {
      this.dirY = Math.abs(this.dirY);
      bounced = true;
    } else if (this.y + this.radius > canvas.height) {
      this.dirY = -Math.abs(this.dirY);
      bounced = true;
    }

    if (bounced) {
      this.bounces++;
      this.rotSpeed *= 1.2;

      // Impact burst
      for (let i = 0; i < 20; i++) {
        impactParticles.push({
          x: this.x,
          y: this.y,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          life: Math.random() * 0.7 + 0.3,
          size: Math.random() * 8 + 2,
          color: Math.random() > 0.5 ? "255, 50, 50" : "50, 100, 255",
        });
      }

      if (this.bounces >= this.maxBounces) this.decay = 0.05;
    }
  }

  drawShieldShape(ctx, cx, cy, radius, angle, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;

    // Shadow/depth
    ctx.beginPath();
    ctx.arc(3, 3, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();

    // Ring 1 — outer red
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#cc1111";
    ctx.shadowColor = "rgba(255, 0, 0, 0.6)";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ring 2 — white
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
    ctx.fillStyle = "#dddddd";
    ctx.fill();

    // Ring 3 — blue
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
    ctx.fillStyle = "#1133cc";
    ctx.shadowColor = "rgba(0, 100, 255, 0.6)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Center red dot
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#cc1111";
    ctx.fill();

    // Star
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerA = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const innerA = outerA + Math.PI / 5;
      const outerR = radius * 0.38;
      const innerR = radius * 0.155;
      if (i === 0) {
        ctx.moveTo(Math.cos(outerA) * outerR, Math.sin(outerA) * outerR);
      } else {
        ctx.lineTo(Math.cos(outerA) * outerR, Math.sin(outerA) * outerR);
      }
      ctx.lineTo(Math.cos(innerA) * innerR, Math.sin(innerA) * innerR);
    }
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Rim highlight
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 220, 220, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  draw(ctx) {
    // Trail shields (faded)
    this.trail.forEach((t, i) => {
      const a = (i / this.trail.length) * this.life * 0.25;
      const r = this.radius * (i / this.trail.length) * 0.7;
      if (r > 5) this.drawShieldShape(ctx, t.x, t.y, r, t.angle, a);
    });

    // Glow ring
    const pulse = Math.sin(this.glowPulse) * 0.2 + 0.8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100, 150, 255, ${this.life * pulse * 0.5})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(50, 100, 255, 0.8)";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Main shield
    this.drawShieldShape(ctx, this.x, this.y, this.radius, this.angle, this.life);
  }
}

function drawStar(ctx, cx, cy, outerR, innerR, points, color, alpha) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.shadowColor = `rgba(${color}, 0.8)`;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
}

export function applyCaptainEffect(ctx, video, canvas, handLandmarks) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  frameCount++;
  shieldAngle += 0.03;

  // Patriotic atmosphere
  ctx.fillStyle = "rgba(0, 0, 20, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";

  if (handLandmarks && handLandmarks.length > 0) {
    chargeLevel = Math.min(chargeLevel + 0.02, 1.0);

    handLandmarks.forEach((hand) => {
      const indexTip = hand[8];
      const middleTip = hand[12];
      const palm = hand[9];
      const wrist = hand[0];

      const indexX = (1 - indexTip.x) * canvas.width;
      const indexY = indexTip.y * canvas.height;
      const middleX = (1 - middleTip.x) * canvas.width;
      const middleY = middleTip.y * canvas.height;
      const palmX = (1 - palm.x) * canvas.width;
      const palmY = palm.y * canvas.height;
      const wristX = (1 - wrist.x) * canvas.width;
      const wristY = wrist.y * canvas.height;

      // Throw direction
      const dx = middleX - wristX;
      const dy = middleY - wristY;
      const dist = Math.hypot(dx, dy) || 1;
      const dirX = dx / dist;
      const dirY = dy / dist;

      // Throw shield
      if (frameCount % 28 === 0) {
        shields.push(new Shield(palmX, palmY, dirX, dirY));
      }

      // Palm shield display
      ctx.save();
      ctx.translate(palmX, palmY);
      ctx.rotate(shieldAngle);

      // Vibranium glow
      const vGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
      vGrad.addColorStop(0, `rgba(100, 150, 255, ${chargeLevel * 0.4})`);
      vGrad.addColorStop(1, "rgba(0, 50, 255, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fillStyle = vGrad;
      ctx.fill();
      ctx.restore();

      // Mini shield on palm
      ctx.save();
      ctx.translate(palmX, palmY);
      ctx.rotate(shieldAngle);

      // Red outer
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 20, 20, ${chargeLevel * 0.9})`;
      ctx.shadowColor = "rgba(255, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fill();

      // White ring
      ctx.beginPath();
      ctx.arc(0, 0, 29, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 200, ${chargeLevel * 0.9})`;
      ctx.fill();

      // Blue center
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20, 50, 200, ${chargeLevel * 0.9})`;
      ctx.shadowColor = "rgba(0, 100, 255, 0.6)";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Mini star
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const ia = a + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
        else ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12);
        ctx.lineTo(Math.cos(ia) * 5, Math.sin(ia) * 5);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${chargeLevel})`;
      ctx.fill();

      ctx.restore();

      // Peace sign finger tips glow
      [{ x: indexX, y: indexY }, { x: middleX, y: middleY }].forEach((tip) => {
        const tg = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 15);
        tg.addColorStop(0, `rgba(200, 220, 255, ${chargeLevel})`);
        tg.addColorStop(0.5, `rgba(50, 100, 255, ${chargeLevel * 0.5})`);
        tg.addColorStop(1, "rgba(0, 50, 200, 0)");
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = tg;
        ctx.fill();

        // Star at fingertip
        drawStar(ctx, tip.x, tip.y, 8, 3, 5, "200, 220, 255", chargeLevel * 0.7);
      });

      // Energy between fingers
      ctx.beginPath();
      ctx.moveTo(indexX, indexY);
      ctx.lineTo(middleX, middleY);
      ctx.strokeStyle = `rgba(150, 180, 255, ${chargeLevel * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  } else {
    chargeLevel = Math.max(0, chargeLevel - 0.015);
  }

  // Shields
  for (let i = shields.length - 1; i >= 0; i--) {
    shields[i].update(canvas);
    shields[i].draw(ctx);
    if (shields[i].life <= 0) shields.splice(i, 1);
  }

  // Star trails
  for (let i = starTrails.length - 1; i >= 0; i--) {
    const s = starTrails[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.035;
    if (s.life <= 0) { starTrails.splice(i, 1); continue; }

    if (s.isStar) {
      drawStar(ctx, s.x, s.y, s.size, s.size * 0.4, 5, "200, 220, 255", s.life * 0.8);
    } else {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 180, 255, ${s.life * 0.6})`;
      ctx.fill();
    }
  }

  // Impact particles
  for (let i = impactParticles.length - 1; i >= 0; i--) {
    const p = impactParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.vx *= 0.96;
    p.life -= 0.03;
    if (p.life <= 0) { impactParticles.splice(i, 1); continue; }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";

  // Captain America HUD
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(0, 0, 20, 0.5)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

  ctx.fillStyle = "#4488ff";
  ctx.font = "bold 13px monospace";
  ctx.fillText("CAPTAIN AMERICA // VIBRANIUM SHIELD: ACTIVE", 20, 26);
  ctx.fillStyle = "#88aaff";
  ctx.font = "11px monospace";
  ctx.fillText(`🛡️ SHIELDS: ${shields.length}`, canvas.width - 150, 26);
  ctx.fillText("AVENGERS ASSEMBLE", 20, canvas.height - 18);
  ctx.fillText(`BOUNCES: ${shields.reduce((a, s) => a + s.bounces, 0)}`, canvas.width - 130, canvas.height - 18);
  ctx.globalAlpha = 1.0;
}

export function resetCaptain() {
  shields.length = 0;
  starTrails.length = 0;
  impactParticles.length = 0;
  frameCount = 0;
  shieldAngle = 0;
  chargeLevel = 0;
}