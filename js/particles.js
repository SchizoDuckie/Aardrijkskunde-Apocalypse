// ============================================================
// PARTICLE SYSTEM
// ============================================================
let particles = [];

function spawnBoom(x, y, s = 1) {
  // Triple flash
  particles.push({ t: 'flash', x, y, r: 15 * s, mr: 250 * s, a: 1, life: 18, age: 0 });
  particles.push({ t: 'flash', x, y, r: 5 * s, mr: 180 * s, a: .8, life: 25, age: 3 });
  // Shockwave rings
  particles.push({ t: 'ring', x, y, r: 8 * s, mr: 200 * s, a: 1, lw: 5 * s, life: 35, age: 0 });
  particles.push({ t: 'ring', x, y, r: 3 * s, mr: 150 * s, a: .7, lw: 3 * s, life: 45, age: 4 });
  particles.push({ t: 'ring', x, y, r: 2 * s, mr: 120 * s, a: .5, lw: 2 * s, life: 55, age: 8 });
  // Sparks
  const C = ["#ff4400", "#ff6600", "#ff9900", "#ffcc00", "#fff", "#ff2200", "#ffff00", "#ff8800"];
  for (let i = 0; i < 120; i++) {
    const a = Math.random() * Math.PI * 2, sp = (1 + Math.random() * 7) * s;
    particles.push({
      t: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 2 * s,
      r: (1 + Math.random() * 3) * s, a: 1, color: pick(C), life: 30 + Math.random() * 60, age: 0,
      g: (.015 + Math.random() * .03) * s
    });
  }
  // Fireballs
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * Math.PI * 2, sp = (.3 + Math.random() * 2) * s;
    particles.push({
      t: 'cloud', x: x + Math.cos(a) * 8 * s, y: y + Math.sin(a) * 8 * s,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 2 * s,
      r: (6 + Math.random() * 16) * s, a: .8,
      color: `hsl(${Math.random() * 30},${80 + Math.random() * 20}%,${35 + Math.random() * 35}%)`,
      life: 40 + Math.random() * 50, age: 0
    });
  }
  // Mushroom stem
  for (let i = 0; i < 15; i++) {
    particles.push({
      t: 'cloud', x: x + (Math.random() - .5) * 6 * s, y,
      vx: (Math.random() - .5) * .15 * s, vy: (-2 - Math.random() * 3) * s,
      r: (8 + Math.random() * 12) * s, a: .6,
      color: `hsl(${10 + Math.random() * 15},${70 + Math.random() * 20}%,${30 + Math.random() * 25}%)`,
      life: 60 + Math.random() * 40, age: Math.random() * 10 | 0
    });
  }
  // Mushroom cap
  for (let i = 0; i < 20; i++) {
    const spread = (Math.random() - .5) * 40 * s;
    particles.push({
      t: 'cloud', x: x + spread, y: y - 60 * s + (Math.random() - .5) * 20 * s,
      vx: (Math.random() - .5) * .5 * s, vy: (-.5 - Math.random() * .5) * s,
      r: (10 + Math.random() * 20) * s, a: .5,
      color: `hsl(${5 + Math.random() * 20},${60 + Math.random() * 30}%,${40 + Math.random() * 30}%)`,
      life: 70 + Math.random() * 50, age: 10 + Math.random() * 10 | 0
    });
  }
  // Hot debris
  for (let i = 0; i < 25; i++) {
    const a = Math.random() * Math.PI * 2, sp = (2 + Math.random() * 5) * s;
    particles.push({
      t: 'debris', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 4 * s,
      r: (2 + Math.random() * 3) * s, a: 1, life: 50 + Math.random() * 40, age: 0,
      g: (.04 + Math.random() * .03) * s
    });
  }
  // Smoke
  for (let i = 0; i < 18; i++) {
    particles.push({
      t: 'smoke', x: x + (Math.random() - .5) * 10 * s, y,
      vx: (Math.random() - .5) * .3 * s, vy: (-.4 - Math.random() * 1) * s,
      r: (10 + Math.random() * 18) * s, a: .3, life: 90 + Math.random() * 50, age: Math.random() * 15 | 0
    });
  }
  // Ground scorch
  particles.push({ t: 'scorch', x, y, r: 5 * s, mr: 80 * s, a: .4, life: 100, age: 0 });
}

// ============================================================
// MEGA BOOM - half the screen, for correct answers!
// ============================================================
function spawnMegaBoom(x, y, canvasW, canvasH) {
  const s = Math.max(canvasW, canvasH) / 400; // scale relative to screen size

  // MASSIVE flash covering half the screen
  particles.push({ t: 'flash', x, y, r: 20 * s, mr: canvasW * 0.5, a: 1, life: 25, age: 0 });
  particles.push({ t: 'flash', x, y, r: 10 * s, mr: canvasW * 0.35, a: .9, life: 35, age: 2 });
  particles.push({ t: 'flash', x, y, r: 5 * s, mr: canvasW * 0.25, a: .7, life: 45, age: 5 });

  // Multiple huge shockwave rings
  for (let i = 0; i < 5; i++) {
    particles.push({
      t: 'ring', x, y, r: 5 * s, mr: canvasW * (0.3 + i * 0.1),
      a: 1 - i * 0.15, lw: (8 - i) * s, life: 40 + i * 12, age: i * 3
    });
  }

  // HUGE spark shower - 300 sparks
  const C = ["#ff4400", "#ff6600", "#ff9900", "#ffcc00", "#fff", "#ff2200", "#ffff00", "#ff8800",
    "#ff66aa", "#66ccff", "#aa66ff", "#44ff88"];
  for (let i = 0; i < 300; i++) {
    const a = Math.random() * Math.PI * 2, sp = (2 + Math.random() * 14) * s;
    particles.push({
      t: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 4 * s,
      r: (1.5 + Math.random() * 5) * s, a: 1, color: pick(C),
      life: 40 + Math.random() * 80, age: 0, g: (.01 + Math.random() * .025) * s
    });
  }

  // Massive fireballs
  for (let i = 0; i < 80; i++) {
    const a = Math.random() * Math.PI * 2, sp = (.5 + Math.random() * 4) * s;
    particles.push({
      t: 'cloud', x: x + Math.cos(a) * 15 * s, y: y + Math.sin(a) * 15 * s,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 3 * s,
      r: (12 + Math.random() * 30) * s, a: .9,
      color: `hsl(${Math.random() * 40},${80 + Math.random() * 20}%,${35 + Math.random() * 40}%)`,
      life: 50 + Math.random() * 60, age: 0
    });
  }

  // Giant mushroom stem
  for (let i = 0; i < 25; i++) {
    particles.push({
      t: 'cloud', x: x + (Math.random() - .5) * 10 * s, y,
      vx: (Math.random() - .5) * .2 * s, vy: (-3 - Math.random() * 5) * s,
      r: (15 + Math.random() * 25) * s, a: .7,
      color: `hsl(${10 + Math.random() * 20},${70 + Math.random() * 20}%,${30 + Math.random() * 30}%)`,
      life: 80 + Math.random() * 50, age: Math.random() * 8 | 0
    });
  }

  // Giant mushroom cap
  for (let i = 0; i < 40; i++) {
    const spread = (Math.random() - .5) * 80 * s;
    particles.push({
      t: 'cloud', x: x + spread, y: y - 100 * s + (Math.random() - .5) * 40 * s,
      vx: (Math.random() - .5) * .8 * s, vy: (-.8 - Math.random() * .8) * s,
      r: (18 + Math.random() * 35) * s, a: .6,
      color: `hsl(${5 + Math.random() * 25},${60 + Math.random() * 30}%,${35 + Math.random() * 35}%)`,
      life: 90 + Math.random() * 60, age: 8 + Math.random() * 12 | 0
    });
  }

  // Tons of debris flying everywhere
  for (let i = 0; i < 50; i++) {
    const a = Math.random() * Math.PI * 2, sp = (3 + Math.random() * 10) * s;
    particles.push({
      t: 'debris', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 6 * s,
      r: (3 + Math.random() * 5) * s, a: 1, life: 60 + Math.random() * 50, age: 0,
      g: (.03 + Math.random() * .04) * s
    });
  }

  // Massive smoke column
  for (let i = 0; i < 30; i++) {
    particles.push({
      t: 'smoke', x: x + (Math.random() - .5) * 20 * s, y,
      vx: (Math.random() - .5) * .5 * s, vy: (-.6 - Math.random() * 1.5) * s,
      r: (15 + Math.random() * 30) * s, a: .35, life: 110 + Math.random() * 60,
      age: Math.random() * 20 | 0
    });
  }

  // Big ground scorch
  particles.push({ t: 'scorch', x, y, r: 8 * s, mr: 150 * s, a: .5, life: 120, age: 0 });

  // Extra: colorful victory sparks that go way up
  for (let i = 0; i < 60; i++) {
    const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 0.8;
    const sp = (5 + Math.random() * 12) * s;
    particles.push({
      t: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      r: (2 + Math.random() * 4) * s, a: 1,
      color: pick(["#ff66aa", "#66ccff", "#ffcc33", "#aa66ff", "#44ff88", "#fff"]),
      life: 60 + Math.random() * 60, age: Math.random() * 10 | 0,
      g: (.02 + Math.random() * .02) * s
    });
  }
}

function tickDraw(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    p.age++;
    if (p.delay && p.age < p.delay) continue;
    const pr = p.age / p.life;
    if (p.t === 'flash') {
      const r = p.r + (p.mr - p.r) * Math.pow(pr, .5), a = p.a * (1 - pr);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(.2, `rgba(255,220,100,${a * .8})`);
      g.addColorStop(.5, `rgba(255,120,20,${a * .4})`);
      g.addColorStop(1, 'rgba(255,50,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
    } else if (p.t === 'ring') {
      const r = p.r + (p.mr - p.r) * pr, a = p.a * (1 - pr);
      ctx.strokeStyle = `rgba(255,${180 + pr * 75 | 0},${pr * 150 | 0},${a})`;
      ctx.lineWidth = p.lw * (1 - pr * .7);
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
    } else if (p.t === 'spark') {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .985;
      const a = p.a * (1 - pr);
      ctx.globalAlpha = a; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - pr * .6), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = a * .3;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
      ctx.strokeStyle = p.color; ctx.lineWidth = p.r * (1 - pr * .6) * .5; ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (p.t === 'debris') {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .97;
      ctx.globalAlpha = p.a * (1 - pr);
      ctx.fillStyle = pr < .3 ? '#ffcc00' : pr < .6 ? '#ff6600' : '#884422';
      ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
      ctx.globalAlpha = 1;
    } else if (p.t === 'cloud') {
      p.x += p.vx; p.y += p.vy; p.vx *= .99; p.vy *= .98;
      ctx.globalAlpha = p.a * (1 - Math.pow(pr, .7));
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (.4 + pr * .8), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    } else if (p.t === 'smoke') {
      p.x += p.vx; p.y += p.vy;
      ctx.globalAlpha = p.a * (1 - pr);
      ctx.fillStyle = 'rgba(60,40,30,1)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (.5 + pr * .8), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    } else if (p.t === 'scorch') {
      const r = p.r + (p.mr - p.r) * Math.min(pr * 3, 1);
      ctx.globalAlpha = p.a * (1 - pr);
      ctx.fillStyle = 'rgba(40,20,0,1)';
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  particles = particles.filter(p => p.age < p.life);
}
