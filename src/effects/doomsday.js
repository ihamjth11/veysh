const darkBolts = [];
const voidParticles = [];
const screenCracks = [];
const runeSymbols = [];
let frameCount = 0;
let apocalypseLevel = 0;
let screenFlash = 0;
let screenShake = { x: 0, y: 0, intensity: 0 };

class DarkBolt {
  constructor(x1, y1, x2, y2, isMajor = false) {
    this.points = this.generate(x1, y1, x2, y2, isMajor ? 18 : 10);
    this.life = 1.0;
    this.decay = isMajor ? 0.03 : 0.08;
    this.width = isMajor ? 5 : 2;
    this.isMajor = isMajor;
    this.branches = [];
    this.color = Math.random() > 0.5 ? "255, 0, 50" : "180, 0, 120";

    if (isMajor) {
      for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * this.points.length);
        const p = this.points[idx];
        if (p) {
          this.branches.push({
            points: this.generate(
              p.x, p.y,
              p.x + (Math.random() - 0.5) * 250,
              p.y + (Math.random() - 0.5) * 250,
              8
            ),
            life: 1.0,
          });
        }
      }
    }
  }

  generate(x1, y1, x2, y2, segs) {
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      pts.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 120,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 120,
      });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  draw(ctx) {
    const stroke = (pts, w, color, alpha, blur = 0) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = w;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.shadowBlur = blur;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    if (this.isMajor) {
      stroke(this.points, this.width * 10, this.color, this.life * 0.1, 40);
      stroke(this.points, this.width * 5, this.color, this.life * 0.25, 20);
      stroke(this.points, this.width * 2.5, this.color, this.life * 0.5, 10);
    }
    stroke(this.points, this.width, this.color, this.life * 0.8, 5);
    stroke(this.points, this.width * 0.4, "255, 200, 200", this.life, 0);

    this.branches.forEach((b) => {
      b.life -= 0.06;
      if (b.life > 0) {
        stroke(b.points, 2, this.color, b.life * 0.5, 8);
        stroke(b.points, 0.8, "255, 150, 150", b.life, 0);
      }
    });
  }

  update() { this.life -= this.decay; }
}

class ScreenCrack {
  constructor(canvas) {
    const side = Math.floor(Math.random() * 4);
    let sx, sy;
    if (side === 0) { sx = Math.random() * canvas.width; sy = 0; }
    else if (side === 1) { sx = canvas.width; sy = Math.random() * canvas.height; }
    else if (side === 2) { sx = Math.random() * canvas.width; sy = canvas.height; }
    else { sx = 0; sy = Math.random() * canvas.height; }

    this.arms = [];
    const armCount = Math.floor(Math.random() * 5 + 4);

    for (let a = 0; a < armCount; a++) {
      const angle = Math.random() * Math.PI * 2;
      const pts = [{ x: sx, y: sy }];
      let cx = sx, cy = sy;
      const segs = Math.floor(Math.random() * 10 + 8);

      for (let s = 0; s < segs; s++) {
        cx += Math.cos(angle + (Math.random() - 0.5) * 1.2) * (Math.random() * 60 + 20);
        cy += Math.sin(angle + (Math.random() - 0.5) * 1.2) * (Math.random() * 60 + 20);
        cx = Math.max(0, Math.min(canvas.width, cx));
        cy = Math.max(0, Math.min(canvas.height, cy));
        pts.push({ x: cx, y: cy });
      }
      this.arms.push(pts);
    }

    this.life = 1.0;
    this.decay = 0.003;
    this.glowColor = Math.random() > 0.5 ? "255, 0, 50" : "180, 0, 150";
  }

  draw(ctx) {
    this.arms.forEach((pts) => {
      if (pts.length < 2) return;

      // Glow
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(${this.glowColor}, ${this.life * 0.3})`;
      ctx.lineWidth = 6;
      ctx.shadowColor = `rgba(${this.glowColor}, 0.6)`;
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(255, 100, 100, ${this.life * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
      ctx.stroke();
    });
    this.life -= this.decay;
  }
}

class RuneSymbol {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 1.0;
    this.decay = 0.008;
    this.size = Math.random() * 30 + 15;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;
    this.type = Math.floor(Math.random() * 4);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life * 0.7;
    ctx.strokeStyle = `rgba(255, 50, 50, ${this.life})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "rgba(255, 0, 50, 0.8)";
    ctx.shadowBlur = 10;

    switch (this.type) {
      case 0: // Triangle
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.866, this.size * 0.5);
        ctx.lineTo(-this.size * 0.866, this.size * 0.5);
        ctx.closePath();
        ctx.stroke();
        break;
      case 1: // X cross
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.moveTo(this.size, -this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.stroke();
        break;
      case 2: // Circle with lines
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * this.size * 0.4, Math.sin(a) * this.size * 0.4);
          ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
          ctx.stroke();
        }
        break;
      case 3: // Diamond
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.6, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.6, 0);
        ctx.closePath();
        ctx.stroke();
        break;
    }

    ctx.shadowBlur = 0;
    ctx.restore();
    ctx.globalAlpha = 1.0;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
  }
}

export function applyDoomsdayEffect(ctx, video, canvas, handLandmarks) {
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

  // Apocalypse atmosphere — dark red overlay
  apocalypseLevel = Math.min(apocalypseLevel + 0.008, 1.0);
  ctx.fillStyle = `rgba(25, 0, 0, ${0.15 + apocalypseLevel * 0.18})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Screen flash
  if (screenFlash > 0) {
    ctx.fillStyle = `rgba(150, 0, 0, ${screenFlash * 0.4})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    screenFlash -= 0.06;
  }

  // Dark vignette
  const vig = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
    canvas.width / 2, canvas.height / 2, canvas.height * 0.9
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, `rgba(40, 0, 0, ${0.4 + apocalypseLevel * 0.3})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";

  if (handLandmarks && handLandmarks.length > 0) {
    handLandmarks.forEach((hand, handIdx) => {
      const palm = hand[9];
      const palmX = (1 - palm.x) * canvas.width;
      const palmY = palm.y * canvas.height;

      // Major dark bolt from sky every 15 frames
      if (frameCount % 15 === 0) {
        darkBolts.push(new DarkBolt(
          palmX + (Math.random() - 0.5) * 100, 0,
          palmX, palmY, true
        ));
        screenFlash = 1.0;
        screenShake.intensity = 0.8;

        // Screen crack
        screenCracks.push(new ScreenCrack(canvas));

        // Rune symbols
        for (let r = 0; r < 4; r++) {
          runeSymbols.push(new RuneSymbol(
            palmX + (Math.random() - 0.5) * 200,
            palmY + (Math.random() - 0.5) * 200
          ));
        }

        // Massive void burst
        for (let i = 0; i < 50; i++) {
          voidParticles.push({
            x: palmX,
            y: palmY,
            vx: (Math.random() - 0.5) * 22,
            vy: (Math.random() - 0.5) * 22,
            life: Math.random() * 0.9 + 0.3,
            size: Math.random() * 12 + 3,
            type: Math.floor(Math.random() * 3),
          });
        }
      }

      // Continuous random bolts from fingertips
      const fingertips = [4, 8, 12, 16, 20];
      fingertips.forEach((tipIdx) => {
        const tip = hand[tipIdx];
        const tipX = (1 - tip.x) * canvas.width;
        const tipY = tip.y * canvas.height;

        if (frameCount % 6 === 0) {
          const endX = tipX + (Math.random() - 0.5) * 280;
          const endY = tipY + (Math.random() - 0.5) * 280;
          darkBolts.push(new DarkBolt(tipX, tipY, endX, endY, false));
        }

        // Fingertip dark energy
        const tg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18);
        tg.addColorStop(0, `rgba(255, 100, 50, ${apocalypseLevel * 0.9})`);
        tg.addColorStop(0.5, `rgba(180, 0, 50, ${apocalypseLevel * 0.5})`);
        tg.addColorStop(1, "rgba(100, 0, 0, 0)");
        ctx.beginPath();
        ctx.arc(tipX, tipY, 18, 0, Math.PI * 2);
        ctx.fillStyle = tg;
        ctx.fill();
      });

      // Palm dark energy core
      const palmSize = 75 + apocalypseLevel * 35 + Math.sin(frameCount * 0.12) * 10;
      const palmGrad = ctx.createRadialGradient(palmX, palmY, 0, palmX, palmY, palmSize);
      palmGrad.addColorStop(0, `rgba(255, 150, 50, ${apocalypseLevel * 0.9})`);
      palmGrad.addColorStop(0.2, `rgba(220, 0, 50, ${apocalypseLevel * 0.7})`);
      palmGrad.addColorStop(0.5, `rgba(150, 0, 100, ${apocalypseLevel * 0.4})`);
      palmGrad.addColorStop(0.8, `rgba(80, 0, 50, ${apocalypseLevel * 0.15})`);
      palmGrad.addColorStop(1, "rgba(50, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(palmX, palmY, palmSize, 0, Math.PI * 2);
      ctx.fillStyle = palmGrad;
      ctx.fill();

      // Dark pulsing rings
      for (let r = 0; r < 3; r++) {
        const rSize = palmSize * (0.4 + r * 0.3) + Math.sin(frameCount * 0.1 + r * 2) * 8;
        ctx.beginPath();
        ctx.arc(palmX, palmY, rSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, ${50 - r * 15}, ${50 - r * 10}, ${(0.9 - r * 0.25) * apocalypseLevel})`;
        ctx.lineWidth = 3 - r * 0.5;
        ctx.shadowColor = "rgba(255, 0, 50, 1)";
        ctx.shadowBlur = 25;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Both hands — apocalypse beam
      if (handLandmarks.length === 2 && handIdx === 0) {
        const h2 = handLandmarks[1];
        const p2 = h2[9];
        const p2x = (1 - p2.x) * canvas.width;
        const p2y = p2.y * canvas.height;

        // Major bolt between hands
        if (frameCount % 5 === 0) {
          darkBolts.push(new DarkBolt(palmX, palmY, p2x, p2y, true));
        }

        // Beam
        const beamGrad = ctx.createLinearGradient(palmX, palmY, p2x, p2y);
        beamGrad.addColorStop(0, `rgba(255, 50, 0, ${apocalypseLevel * 0.6})`);
        beamGrad.addColorStop(0.5, `rgba(255, 0, 100, ${apocalypseLevel * 0.8})`);
        beamGrad.addColorStop(1, `rgba(255, 50, 0, ${apocalypseLevel * 0.6})`);

        ctx.beginPath();
        ctx.moveTo(palmX, palmY);
        ctx.lineTo(p2x, p2y);
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 5;
        ctx.shadowColor = "rgba(255, 0, 50, 0.9)";
        ctx.shadowBlur = 25;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });
  } else {
    apocalypseLevel = Math.max(0, apocalypseLevel - 0.01);
  }

  // Dark bolts
  for (let i = darkBolts.length - 1; i >= 0; i--) {
    darkBolts[i].update();
    darkBolts[i].draw(ctx);
    if (darkBolts[i].life <= 0) darkBolts.splice(i, 1);
  }

  // Void particles
  for (let i = voidParticles.length - 1; i >= 0; i--) {
    const p = voidParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.vy += 0.2;
    p.life -= 0.025;
    if (p.life <= 0) { voidParticles.splice(i, 1); continue; }

    if (p.type === 0) {
      const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      pg.addColorStop(0, `rgba(255, 100, 50, ${p.life})`);
      pg.addColorStop(0.5, `rgba(200, 0, 50, ${p.life * 0.5})`);
      pg.addColorStop(1, "rgba(100, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
    } else if (p.type === 1) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 3);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = `rgba(150, 0, 50, ${p.life})`;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      ctx.globalAlpha = 1.0;
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 50, 50, ${p.life * 0.8})`;
      ctx.shadowColor = "rgba(255, 0, 0, 0.6)";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  ctx.globalCompositeOperation = "source-over";

  // Screen cracks
  for (let i = screenCracks.length - 1; i >= 0; i--) {
    screenCracks[i].draw(ctx);
    if (screenCracks[i].life <= 0) screenCracks.splice(i, 1);
  }

  // Rune symbols
  for (let i = runeSymbols.length - 1; i >= 0; i--) {
    runeSymbols[i].draw(ctx);
    if (runeSymbols[i].life <= 0) runeSymbols.splice(i, 1);
  }

  // Doomsday HUD
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = "rgba(25, 0, 0, 0.55)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

  ctx.fillStyle = "#ff2200";
  ctx.font = "bold 13px monospace";
  ctx.fillText("DOOMSDAY // APOCALYPSE PROTOCOL: ENGAGED", 20, 26);
  ctx.fillStyle = "#ff6644";
  ctx.font = "11px monospace";
  ctx.fillText(`☠️ DESTRUCTION: ${Math.floor(apocalypseLevel * 100)}%`, canvas.width - 200, 26);
  ctx.fillText("END OF DAYS IMMINENT", 20, canvas.height - 18);
  ctx.fillText("RESISTANCE: FUTILE", canvas.width - 190, canvas.height - 18);
  ctx.globalAlpha = 1.0;
}

export function resetDoomsday() {
  darkBolts.length = 0;
  voidParticles.length = 0;
  screenCracks.length = 0;
  runeSymbols.length = 0;
  frameCount = 0;
  apocalypseLevel = 0;
  screenFlash = 0;
  screenShake = { x: 0, y: 0, intensity: 0 };
}