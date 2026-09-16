// ============================================================
// AMBIENT FX - starfield menu background + victory fireworks
// ============================================================

// ---------- STARFIELD (menu) ----------
let starAnim = null, starCanvas = null, starCtx = null, stars = [], comet = null;

function initStarfield() {
  starCanvas = document.getElementById('stars-canvas');
  if (!starCanvas) return;
  starCtx = starCanvas.getContext('2d');
  sizeStarCanvas();
  if (!stars.length) {
    const n = Math.round((window.innerWidth * window.innerHeight) / 3200);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.4 + .3,
        baseA: Math.random() * .5 + .3,
        speed: Math.random() * .02 + .008,
        phase: Math.random() * Math.PI * 2,
        color: pick(['#fff', '#cdeaff', '#ffe9cd', '#ffd6f2'])
      });
    }
  }
  if (starAnim) cancelAnimationFrame(starAnim);
  const loop = (t) => {
    drawStarfield(t);
    starAnim = requestAnimationFrame(loop);
  };
  starAnim = requestAnimationFrame(loop);
}

function sizeStarCanvas() {
  if (!starCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  starCanvas.width = window.innerWidth * dpr;
  starCanvas.height = window.innerHeight * dpr;
  starCanvas.style.width = window.innerWidth + 'px';
  starCanvas.style.height = window.innerHeight + 'px';
  starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', sizeStarCanvas);

function drawStarfield(t) {
  const w = window.innerWidth, h = window.innerHeight;
  starCtx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const tw = Math.sin(t * s.speed + s.phase) * .5 + .5;
    const a = s.baseA * (.5 + tw * .5);
    starCtx.globalAlpha = a;
    starCtx.fillStyle = s.color;
    starCtx.beginPath();
    starCtx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    starCtx.fill();
  }
  starCtx.globalAlpha = 1;

  // occasional shooting star / comet
  if (!comet && Math.random() < .0025) {
    comet = { x: Math.random() * w * .6 + w * .2, y: -20, vx: -3 - Math.random() * 2, vy: 3 + Math.random() * 2, life: 0 };
  }
  if (comet) {
    comet.x += comet.vx; comet.y += comet.vy; comet.life++;
    const grad = starCtx.createLinearGradient(comet.x, comet.y, comet.x - comet.vx * 12, comet.y - comet.vy * 12);
    grad.addColorStop(0, 'rgba(255,255,255,.9)');
    grad.addColorStop(1, 'rgba(150,200,255,0)');
    starCtx.strokeStyle = grad;
    starCtx.lineWidth = 2;
    starCtx.beginPath();
    starCtx.moveTo(comet.x, comet.y);
    starCtx.lineTo(comet.x - comet.vx * 12, comet.y - comet.vy * 12);
    starCtx.stroke();
    if (comet.x < -40 || comet.y > h + 40 || comet.life > 200) comet = null;
  }
}

function stopStarfield() {
  if (starAnim) cancelAnimationFrame(starAnim);
  starAnim = null;
}

// ---------- FIREWORKS (results screen) ----------
let fwAnim = null, fwCanvas = null, fwCtx = null, fwParticles = [];

function initFireworksCanvas() {
  fwCanvas = document.getElementById('fireworks-canvas');
  if (!fwCanvas) return;
  fwCtx = fwCanvas.getContext('2d');
  sizeFwCanvas();
}

function sizeFwCanvas() {
  if (!fwCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  fwCanvas.width = window.innerWidth * dpr;
  fwCanvas.height = window.innerHeight * dpr;
  fwCanvas.style.width = window.innerWidth + 'px';
  fwCanvas.style.height = window.innerHeight + 'px';
  fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', sizeFwCanvas);

function launchFirework(x, y) {
  const C = ["#ff66aa", "#66ccff", "#ffcc33", "#aa66ff", "#44ff88", "#ff8844", "#fff"];
  const color = pick(C);
  for (let i = 0; i < 60; i++) {
    const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4;
    fwParticles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      r: 1.5 + Math.random() * 2, color, life: 50 + Math.random() * 30, age: 0, g: .04
    });
  }
}

function startFireworks(rounds = 6) {
  fwParticles = [];
  initFireworksCanvas();
  let launched = 0;
  const launchIv = setInterval(() => {
    const w = window.innerWidth, h = window.innerHeight;
    launchFirework(w * (.2 + Math.random() * .6), h * (.15 + Math.random() * .35));
    if (++launched >= rounds) clearInterval(launchIv);
  }, 450);

  if (fwAnim) cancelAnimationFrame(fwAnim);
  (function loop() {
    const w = window.innerWidth, h = window.innerHeight;
    fwCtx.clearRect(0, 0, w, h);
    for (const p of fwParticles) {
      p.age++;
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .98;
      const pr = p.age / p.life;
      fwCtx.globalAlpha = 1 - pr;
      fwCtx.fillStyle = p.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fwCtx.fill();
    }
    fwCtx.globalAlpha = 1;
    fwParticles = fwParticles.filter(p => p.age < p.life);
    fwAnim = requestAnimationFrame(loop);
  })();
}

function stopFireworks() {
  if (fwAnim) cancelAnimationFrame(fwAnim);
  fwAnim = null;
  fwParticles = [];
  if (fwCtx) fwCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}
