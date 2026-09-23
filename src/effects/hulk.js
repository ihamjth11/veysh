const shockwaves = [];
const debris = [];
const gammaParticles = [];
const groundCracks = [];
let frameCount = 0;
let screenShake = { x: 0, y: 0, intensity: 0 };
let smashCharge = 0;
let lastSmash = 0;

class Shockwave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.maxRadius = 350;
    this.life = 1.0;
    this.decay = 0.015;
    this.speed = 10;
  }

  update() {
    this.radius += this.speed;
    this.life -= this.decay;
    this.speed *= 0.97;
  }

  draw(ctx) {
    for (let r = 0; r < 4; r++) {
      const rr = this.radius - r * 18;
      if (rr < 0) continue;

      const alpha = this.life * (1 - r * 0.2);

      ctx.beginPath();
      ctx.arc(this.x, this.y, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r < 2 ? "100, 255, 80" : "50, 200, 50"}, ${alpha})`;
      ctx.lineWidth = 4 - r * 0.5;
      ctx.shadowColor = "rgba(0, 255, 50, 0.8)";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Inner fill glow
    const ig = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 0.6
    );
    ig.addColorStop(0, `rgba(150, 255, 100, ${this.life * 0.25})`);
    ig.addColorStop(1, "rgba(0, 200, 0, 0)");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = ig;
    ctx.fill();
  }
}

class DebrisChunk {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 25;
    this.vy = -Math.random() * 20 - 8;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.3;
    this.w = Math.random() * 30 + 8;
    this.h = Math.random() * 20 + 5;
    this.life = 1.0;
    this.decay = Math.random() * 0.012 + 0.006;
    this.hue = Math.random() * 40 + 80;
    this.gamma = Math.random() > 0.4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.6;
    this.vx *= 0.98;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life;

    if (this.gamma) {
      ctx.fillStyle = `hsla(${this.hue}, 80%, 40%, ${this.life})`;
      ctx.shadowColor = "rgba(0, 255, 50, 0.6)";
      ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = `hsla(30, 40%, 35%, ${this.life})`;
    }

    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.shadowBlur = 0;
    ctx.restore();
    ctx.globalAlpha = 1.0;
  }
}

class GroundCrack {
  constructor(x, y, canvas) {
    this.life = 1.0;
    this.decay = 0.004;
    this.arms = [];
    const armCount = Math.floor(Math.random() * 4 + 5);

    for (let a = 0; a < armCount; a++) {
      const angle = (a * Math.PI * 2) / armCount + (Math.random() - 0.5) * 0.5;
      const pts = [{ x, y }];
      let cx = x, cy = y;
      const segCount = Math.floor(Math.random() * 8 + 6);

      for (let s = 0; s < segCount; s++) {
        cx += Math.cos(angle + (Math.random() - 0.5) * 0.8) * (Math.random() * 50 + 20);
        cy += Math.sin(angle + (Math.random() - 0.5) * 0.8) * (Math.random() * 30 + 10);
        cx = Math.max(0, Math.min(canvas.width, cx));
        cy = Math.max(0, Math.min(canvas.height, cy));
        pts.push({ x: cx, y: cy });
      }

      // Sub-cracks
      const subCracks = [];
      for (let sc = 0; sc < 2; sc++) {
        const scIdx = Math.floor(Math.random() * pts.length);
        const scPts = [{ x: pts[scIdx].x, y: pts[scIdx].y }];
        let scx = pts[scIdx].x, scy = pts[scIdx].y;
        for (let ss = 0; ss < 4; ss++) {
          scx += (Math.random() - 0.5) * 40;
          scy += Math.random() * 30;
          scPts.push({ x: scx, y: scy });
        }
        subCracks.push(scPts);
      }

      this.arms.push({ pts, subCracks });
    }
  }

  draw(ctx) {
    this.arms.forEach(({ pts, subCracks }) => {
      // Main crack
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(80, 255, 80, ${this.life * 0.7})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(0, 255, 50, 0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(200, 255, 200, ${this.life * 0.4})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();

      // Sub cracks
      subCracks.forEach((sc) => {
        ctx.beginPath();
        ctx.moveTo(sc[0].x, sc[0].y);
        sc.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = `rgba(50, 200, 50, ${this.life * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });
    this.life -= this.decay;
  }
}

export function applyHulkEffect(ctx, video, canvas, handLandmarks) {
  frameCount++;

  // Screen shake
  if (screenShake.intensity > 0) {
    screenShake.x = (Math.random() - 0.5) * screenShake.intensity * 18;
    screenShake.y = (Math.random() - 0.5) * screenShake.intensity * 18;
    ctx.save();
    ctx.translate(screenShake.x, screenShake.y);
    screenShake.intensity -= 0.05;
    if (screenShake.intensity < 0) screenShake.intensity = 0;
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (screenShake.intensity >= 0) ctx.restore();

  // Gamma radiation green tint
  ctx.fillStyle = `rgba(0, 40, 0, 0.12)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Vignette
  const vig = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.height * 0.25,
    canvas.width / 2, canvas.height / 2, canvas.height * 0.85
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0, 20, 0, 0.35)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";

  if (handLandmarks && handLandmarks.length > 0) {
    smashCharge = Math.min(smashCharge + 0.02, 1.0);

    handLandmarks.forEach((hand, hi) => {
      const fist = hand[9];
      const fistX = (1 - fist.x) * canvas.width;
      const fistY = fist.y * canvas.height;

      // HULK SMASH every 22 frames
      if (frameCount % 22 === 0 && frameCount - lastSmash > 15) {
        lastSmash = frameCount;
        shockwaves.push(new Shockwave(fistX, fistY));
        groundCracks.push(new GroundCrack(fistX, canvas.height * 0.75, canvas));
        screenShake.intensity = 1.2;

        // Massive debris burst
        for (let i = 0; i < 22; i++) {
          debris.push(new DebrisChunk(fistX, fistY));
        }

        // Gamma burst
        for (let i = 0; i < 45; i++) {
          gammaParticles.push({
            x: fistX,
            y: fistY,
            vx: (Math.random() - 0.5) * 25,
            vy: (Math.random() - 0.5) * 25,
            life: Math.random() * 0.9 + 0.3,
            size: Math.random() * 14 + 4,
            type: Math.random() > 0.5 ? "gamma" : "rock",
          });
        }
      }

      // Fist energy — gamma radiation
      const chargeSize = 65 + smashCharge * 45 + Math.sin(frameCount * 0.15) * 8;

      const fistGrad = ctx.createRadialGradient(
        fistX, fistY, 0,
        fistX, fistY, chargeSize
      );
      fistGrad.addColorStop(0, `rgba(220, 255, 150, ${smashCharge * 0.95})`);
      fistGrad.addColorStop(0.25, `rgba(50, 255, 50, ${smashCharge * 0.7})`);
      fistGrad.addColorStop(0.55, `rgba(0, 200, 0, ${smashCharge * 0.4})`);
      fistGrad.addColorStop(0.8, `rgba(0, 120, 0, ${smashCharge * 0.15})`);
      fistGrad.addColorStop(1, "rgba(0, 80, 0, 0)");

      ctx.beginPath();
      ctx.arc(fistX, fistY, chargeSize, 0, Math.PI * 2);
      ctx.fillStyle = fistGrad;
      ctx.fill();

      // Pulsing gamma rings
      for (let r = 0; r < 3; r++) {
        const rSize = chargeSize * (0.45 + r * 0.28) + Math.sin(frameCount * 0.12 + r) * 6;
        ctx.beginPath();
        ctx.arc(fistX, fistY, rSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 60, ${(0.9 - r * 0.25) * smashCharge})`;
        ctx.lineWidth = 3 - r * 0.5;
        ctx.shadowColor = "rgba(0, 255, 0, 0.9)";
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Knuckle energy dots
      [5, 6, 7, 8, 9, 10, 11, 12].forEach((idx) => {
        const kn = hand[idx];
        if (!kn) return;
        const kx = (1 - kn.x) * canvas.width;
        const ky = kn.y * canvas.height;
        const kg = ctx.createRadialGradient(kx, ky, 0, kx, ky, 8);
        kg.addColorStop(0, `rgba(200, 255, 150, ${smashCharge * 0.8})`);
        kg.addColorStop(1, "rgba(0, 200, 0, 0)");
        ctx.beginPath();
        ctx.arc(kx, ky, 8, 0, Math.PI * 2);
        ctx.fillStyle = kg;
        ctx.fill();
      });

      // Both fists — extra power beam
      if (handLandmarks.length === 2 && hi === 0) {
        const h2 = handLandmarks[1];
        const f2 = h2[9];
        const f2x = (1 - f2.x) * canvas.width;
        const f2y = f2.y * canvas.height;

        // Power beam between fists
        const beamGrad = ctx.createLinearGradient(fistX, fistY, f2x, f2y);
        beamGrad.addColorStop(0, `rgba(100, 255, 50, ${smashCharge * 0.5})`);
        beamGrad.addColorStop(0.5, `rgba(200, 255, 100, ${smashCharge * 0.7})`);
        beamGrad.addColorStop(1, `rgba(100, 255, 50, ${smashCharge * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(fistX, fistY);
        ctx.lineTo(f2x, f2y);
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 4;
        ctx.shadowColor = "rgba(0, 255, 0, 0.8)";
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });
  } else {
    smashCharge = Math.max(0, smashCharge - 0.02);
  }

  // Shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].update();
    shockwaves[i].draw(ctx);
    if (shockwaves[i].radius > shockwaves[i].maxRadius || shockwaves[i].life <= 0) {
      shockwaves.splice(i, 1);
    }
  }

  // Gamma particles
  for (let i = gammaParticles.length - 1; i >= 0; i--) {
    const p = gammaParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.4;
    p.vx *= 0.97;
    p.life -= 0.025;
    if (p.life <= 0) { gammaParticles.splice(i, 1); continue; }

    if (p.type === "gamma") {
      const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      pg.addColorStop(0, `rgba(200, 255, 100, ${p.life})`);
      pg.addColorStop(0.5, `rgba(0, 220, 50, ${p.life * 0.5})`);
      pg.addColorStop(1, "rgba(0, 150, 0, 0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 5);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = `hsl(100, 50%, 35%)`;
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      ctx.restore();
      ctx.globalAlpha = 1.0;
    }
  }

  ctx.globalCompositeOperation = "source-over";

  // Debris (drawn after composite reset)
  for (let i = debris.length - 1; i >= 0; i--) {
    debris[i].update();
    debris[i].draw(ctx);
    if (debris[i].life <= 0) debris.splice(i, 1);
  }

  // Ground cracks
  for (let i = groundCracks.length - 1; i >= 0; i--) {
    groundCracks[i].draw(ctx);
    if (groundCracks[i].life <= 0) groundCracks.splice(i, 1);
  }

  // Hulk HUD
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(0, 15, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

  ctx.fillStyle = "#44ff66";
  ctx.font = "bold 13px monospace";
  ctx.fillText("HULK // GAMMA RADIATION: CRITICAL", 20, 26);
  ctx.fillStyle = "#88ff99";
  ctx.font = "11px monospace";
  ctx.fillText(`💪 SMASH: ${Math.floor(smashCharge * 100)}%`, canvas.width - 160, 26);
  ctx.fillText("BRUCE BANNER: SUPPRESSED", 20, canvas.height - 18);
  ctx.fillText("RAGE LEVEL: ∞", canvas.width - 160, canvas.height - 18);
  ctx.globalAlpha = 1.0;
}

export function resetHulk() {
  shockwaves.length = 0;
  debris.length = 0;
  gammaParticles.length = 0;
  groundCracks.length = 0;
  frameCount = 0;
  screenShake = { x: 0, y: 0, intensity: 0 };
  smashCharge = 0;
  lastSmash = 0;
}