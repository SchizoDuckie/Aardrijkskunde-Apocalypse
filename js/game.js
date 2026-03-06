// ============================================================
// GAME ENGINE
// ============================================================
let map = null, GS = null, markers = {}, boomAnim = null, boomCanvas, boomCtx, msgTimeout = null;
let isMobile = window.innerWidth < 640;
window.addEventListener('resize', () => { isMobile = window.innerWidth < 640; updateHudLayout() });

function startGame(dataset) {
  showScreen('game');
  GS = {
    locs: dataset.locations, totalQ: Math.min(dataset.locations.length, 15),
    round: 0, score: 0, streak: 0, best: 0, used: new Set(),
    question: null, busy: false, retrying: false, lastDataset: dataset
  };

  const mapEl = document.getElementById('map');
  if (map) { map.remove(); map = null }
  map = L.map(mapEl, {
    zoomControl: false, attributionControl: true, dragging: true,
    touchZoom: true, scrollWheelZoom: true, doubleClickZoom: false, boxZoom: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy;OSM &copy;CARTO', subdomains: 'abcd', maxZoom: 10, minZoom: 3
  }).addTo(map);
  L.rectangle([[-90, -180], [90, 180]], { fillColor: '#66ccff', fillOpacity: 0.03, stroke: false, interactive: false }).addTo(map);

  GS.defaultBounds = L.latLngBounds(GS.locs.map(l => [l.lat, l.lng])).pad(0.15);
  map.fitBounds(GS.defaultBounds);

  markers = {};
  for (const loc of GS.locs) {
    const type = loc.tags.type || 'city';
    // Build dot inner content based on type (matching textbook icons)
    let dotInner = '';
    if (type === 'gebied') dotInner = '<div class="flag"></div>';
    const icon = L.divIcon({
      className: '', iconSize: [0, 0], iconAnchor: [0, 0],
      html: `<div class="nuke-marker ${type}" data-id="${loc.id}"><div class="dot">${dotInner}</div></div>`
    });
    const m = L.marker([loc.lat, loc.lng], { icon, interactive: true }).addTo(map);
    m.on('click', () => handleClick(loc));
    markers[loc.id] = m;
  }

  // canvas
  boomCanvas = document.getElementById('boom-canvas');
  const wrap = document.getElementById('map-wrap');
  setupCanvas(wrap);
  const ro = new ResizeObserver(() => setupCanvas(wrap));
  ro.observe(wrap); GS._ro = ro;

  if (boomAnim) cancelAnimationFrame(boomAnim);
  particles = [];
  (function loop() { tickDraw(boomCtx, wrap.clientWidth, wrap.clientHeight); boomAnim = requestAnimationFrame(loop) })();

  initAudio();
  nextQ();
}

function setupCanvas(wrap) {
  const dpr = window.devicePixelRatio || 1;
  boomCanvas.width = wrap.clientWidth * dpr;
  boomCanvas.height = wrap.clientHeight * dpr;
  boomCanvas.style.width = wrap.clientWidth + 'px';
  boomCanvas.style.height = wrap.clientHeight + 'px';
  boomCtx = boomCanvas.getContext('2d');
  boomCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resetMarkers() {
  for (const loc of GS.locs) {
    const el = document.querySelector(`.nuke-marker[data-id="${loc.id}"]`);
    if (el) { el.classList.remove('nuked', 'highlight'); const lbl = el.querySelector('.label'); if (lbl) lbl.remove() }
  }
}

function nextQ() {
  if (GS.round >= GS.totalQ) { endGame(); return }
  resetMarkers();
  map.flyToBounds(GS.defaultBounds, { duration: .5, padding: [20, 20] });
  const q = genQ(GS.locs, GS.used);
  if (!q) { endGame(); return }
  GS.question = q; GS.busy = false; GS.retrying = false;
  updateHUD(); hideToast();
}

function handleClick(loc) {
  if (!GS || GS.busy || !GS.question) return;

  // during retry, only accept the correct answer
  if (GS.retrying) {
    if (!GS.question.ids.has(loc.id)) return;
    GS.busy = true;
    const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
    const wrap = document.getElementById('map-wrap');
    launchMissile(pt.x, pt.y, wrap, () => {
      spawnMegaBoom(pt.x, pt.y, wrap.clientWidth, wrap.clientHeight);
      soundMegaBoom();
      doFlash(); doMegaShake();
    });
    soundMissileIncoming();
    const el = document.querySelector(`.nuke-marker[data-id="${loc.id}"]`);
    if (el) {
      el.classList.remove('highlight'); el.classList.add('nuked');
      const lbl = document.createElement('div'); lbl.className = 'label'; lbl.textContent = loc.name;
      el.insertBefore(lbl, el.firstChild);
    }
    showToast(`${T().retryCorrect(loc)}`, null, 'correct');
    GS.used.add(GS.question.tid); GS.round++; updateHUD();
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => nextQ(), 2500);
    return;
  }

  GS.busy = true;
  const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
  const correct = GS.question.ids.has(loc.id);
  const wrap = document.getElementById('map-wrap');

  if (correct) {
    // MEGA EXPLOSION with missile from space!
    launchMissile(pt.x, pt.y, wrap, () => {
      spawnMegaBoom(pt.x, pt.y, wrap.clientWidth, wrap.clientHeight);
      soundMegaBoom();
      doFlash(); doMegaShake();
    });
    soundMissileIncoming();
  } else {
    // Small boom for wrong
    spawnBoom(pt.x, pt.y, isMobile ? .9 : 1.2);
    soundSmallBoom();
    doFlash(); doShake();
  }

  // nuked visual
  const el = document.querySelector(`.nuke-marker[data-id="${loc.id}"]`);
  if (el) {
    el.classList.add('nuked');
    const lbl = document.createElement('div'); lbl.className = 'label'; lbl.textContent = loc.name;
    el.insertBefore(lbl, el.firstChild);
  }

  if (correct) {
    GS.score += 100 + GS.streak * 25; GS.streak++;
    if (GS.streak > GS.best) GS.best = GS.streak;
    if (GS.streak > 1) soundStreak(GS.streak);
    const fact = loc.tags.fact;
    showToast(pick(T().right)(loc), fact, 'correct');
    GS.used.add(GS.question.tid); GS.round++; updateHUD();
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => nextQ(), 3500);
  } else {
    GS.streak = 0;
    const correctLoc = GS.locs.find(l => GS.question.ids.has(l.id));
    const fact = correctLoc ? correctLoc.tags.fact : null;
    showToast(pick(T().wrong)(loc), fact, 'wrong');
    updateHUD();
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => {
      if (!GS || !correctLoc) return;
      const correctEl = document.querySelector(`.nuke-marker[data-id="${correctLoc.id}"]`);
      if (correctEl) {
        correctEl.classList.add('highlight');
        const lbl = document.createElement('div'); lbl.className = 'label'; lbl.textContent = correctLoc.name;
        correctEl.insertBefore(lbl, correctEl.firstChild);
      }
      map.flyTo([correctLoc.lat, correctLoc.lng], 6, { duration: .8 });
      showToast(`👆 ${T().retryHint(correctLoc)}`, fact, 'correct');
      GS.retrying = true; GS.busy = false;
    }, 8000);
  }
}

// ============================================================
// MISSILE FROM SPACE
// ============================================================
function launchMissile(targetX, targetY, wrap, onImpact) {
  const layer = document.getElementById('missile-layer');
  const missile = document.createElement('div');
  missile.className = 'missile';
  missile.textContent = '🚀';
  const startX = targetX + (Math.random() - 0.5) * 100;
  const startY = -80;
  missile.style.left = startX + 'px';
  missile.style.top = startY + 'px';
  layer.appendChild(missile);

  // trail
  const trail = document.createElement('div');
  trail.className = 'missile-trail';
  trail.style.left = (startX + 28) + 'px';
  trail.style.top = '-200px';
  trail.style.height = '200px';
  layer.appendChild(trail);

  const duration = 600;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const p = Math.min(elapsed / duration, 1);
    const eased = p * p; // accelerate
    const cx = startX + (targetX - startX - 30) * eased;
    const cy = startY + (targetY - startY) * eased;
    missile.style.left = cx + 'px';
    missile.style.top = cy + 'px';
    trail.style.left = (cx + 28) + 'px';
    trail.style.top = (cy - 200) + 'px';
    // grow missile as it gets closer
    const scale = 1 + eased * 1.5;
    missile.style.fontSize = (60 * scale) + 'px';

    if (p < 1) {
      requestAnimationFrame(animate);
    } else {
      missile.remove();
      trail.remove();
      if (onImpact) onImpact();
    }
  }
  requestAnimationFrame(animate);
}

// ============================================================
// EFFECTS
// ============================================================
function doFlash() {
  const f = document.getElementById('flash-overlay');
  f.style.display = 'block'; f.style.opacity = '0.7';
  setTimeout(() => { f.style.opacity = '0.3' }, 60);
  setTimeout(() => f.style.display = 'none', 180);
}

function doShake() {
  const el = document.getElementById('map-wrap'); let c = 0;
  const iv = setInterval(() => {
    const intensity = 8 * (1 - c / 10);
    el.style.transform = `translate(${(Math.random() - .5) * intensity}px,${(Math.random() - .5) * intensity}px)`;
    if (++c > 10) { clearInterval(iv); el.style.transform = '' }
  }, 40);
}

function doMegaShake() {
  const el = document.getElementById('map-wrap'); let c = 0;
  const iv = setInterval(() => {
    const intensity = 20 * (1 - c / 20);
    el.style.transform = `translate(${(Math.random() - .5) * intensity}px,${(Math.random() - .5) * intensity}px)`;
    if (++c > 20) { clearInterval(iv); el.style.transform = '' }
  }, 35);
}

// ============================================================
// HUD & UI
// ============================================================
function updateHUD() {
  if (!GS) return;
  document.getElementById('hud-round').textContent = `☢ ${Math.min(GS.round + 1, GS.totalQ)}/${GS.totalQ}`;
  document.getElementById('hud-score').textContent = GS.score;
  document.getElementById('hud-streak').textContent = GS.streak > 1 ? GS.streak + 'x' : '';
  const t = GS.question ? `💣 ${GS.question.text}` : '...';
  document.getElementById('hud-qm').textContent = t;
  document.getElementById('hud-qd').textContent = t;
}

function showToast(msg, fact, type) {
  const t = document.getElementById('toast');
  t.innerHTML = msg + (fact ? `<span class="fact">💡 ${fact}</span>` : '');
  t.className = type; t.style.display = 'block';
  t.style.animation = 'none'; t.offsetHeight; t.style.animation = 'pop .3s ease-out';
}

function hideToast() { document.getElementById('toast').style.display = 'none' }

function updateHudLayout() {
  const m = window.innerWidth < 640;
  document.getElementById('hud-qm').style.display = m ? 'block' : 'none';
  document.getElementById('hud-qd').style.display = m ? 'none' : 'block';
}

// ============================================================
// END GAME & RESULTS
// ============================================================
function endGame() {
  if (boomAnim) cancelAnimationFrame(boomAnim);
  if (GS?._ro) GS._ro.disconnect();
  if (map) { map.remove(); map = null }

  const s = GS;
  const mx = s.totalQ * 100 + (s.totalQ * (s.totalQ - 1) / 2) * 25;
  const pct = Math.round((s.score / mx) * 100);
  const t = T();
  const rankThresholds = Object.entries(t.ranks).sort((a, b) => b[0] - a[0]);
  let grade = rankThresholds[rankThresholds.length - 1][1];
  for (const [threshold, name] of rankThresholds) {
    if (pct >= +threshold) { grade = name; break }
  }
  const gc = pct >= 70 ? '#44ff88' : pct >= 40 ? '#ffcc33' : '#ff4400';

  soundGameOver(pct >= 50);

  document.getElementById('res-mission').textContent = t.missionComplete;
  document.getElementById('res-title').textContent = t.debriefing;
  document.getElementById('res-score-label').textContent = t.score;
  document.getElementById('res-streak-label').textContent = t.bestStreak;
  document.getElementById('res-rank-label').textContent = t.rank;
  document.getElementById('res-score').textContent = s.score;
  document.getElementById('res-streak').textContent = s.best + 'x';
  document.getElementById('res-rank').textContent = grade;
  document.getElementById('res-rank').style.color = gc;
  const rb = document.getElementById('res-rank-box'); rb.style.border = `2px solid ${gc}`; rb.style.background = gc + '11';

  document.getElementById('btn-restart').textContent = '🔄 ' + t.restart;
  document.getElementById('btn-menu').textContent = '⬅ ' + t.menu;

  // Highscore
  const setKey = getSetKey(s.lastDataset);
  const hsArea = document.getElementById('hs-area');

  if (isHighscore(setKey, s.score) && s.score > 0) {
    const savedName = localStorage.getItem('aa-player-name') || '';
    hsArea.innerHTML = `
      <div style="margin:16px 0 8px;color:var(--accent3);font-family:var(--d);font-size:14px">🏆 ${t.highscores}!</div>
      <div style="font-size:11px;color:#ccc;margin-bottom:6px">${t.enterName}</div>
      <input class="hs-input" id="hs-name" maxlength="20" value="${escHtml(savedName)}" placeholder="...">
      <div><button class="btn sm" id="hs-submit" onclick="submitHighscore()">${t.submit}</button></div>
      <div id="hs-table-wrap">${renderHighscoreTable(setKey, s.score)}</div>
    `;
  } else {
    hsArea.innerHTML = `
      <div style="margin:16px 0 8px;color:var(--accent4);font-family:var(--d);font-size:13px">${t.highscores}</div>
      <div id="hs-table-wrap">${renderHighscoreTable(setKey)}</div>
    `;
  }

  showScreen('results');
}

function submitHighscore() {
  if (!GS) return;
  const nameInput = document.getElementById('hs-name');
  const name = (nameInput?.value || '').trim() || 'Anonymous';
  localStorage.setItem('aa-player-name', name);
  const setKey = getSetKey(GS.lastDataset);
  addHighscore(setKey, name, GS.score, GS.best);
  document.getElementById('hs-submit').disabled = true;
  document.getElementById('hs-submit').textContent = '✓';
  nameInput.disabled = true;
  document.getElementById('hs-table-wrap').innerHTML = renderHighscoreTable(setKey, GS.score);
  soundClick();
}

function exitGame() {
  clearTimeout(msgTimeout);
  if (boomAnim) cancelAnimationFrame(boomAnim);
  if (GS?._ro) GS._ro.disconnect();
  if (map) { map.remove(); map = null }
  GS = null; showScreen('menu');
}

function restartGame() {
  if (!GS) { showScreen('menu'); return }
  startGame(GS.lastDataset);
}
