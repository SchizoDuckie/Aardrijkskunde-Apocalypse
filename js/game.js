// ============================================================
// GAME ENGINE
// ============================================================
let map = null, GS = null, markers = {}, boomAnim = null, boomCanvas, boomCtx, msgTimeout = null;
let isMobile = window.innerWidth < 640;
window.addEventListener('resize', () => { isMobile = window.innerWidth < 640; updateHudLayout() });

function startGame(dataset) {
  showScreen('game');
  GS = {
    locs: dataset.locations, totalQ: dataset.locations.length,
    round: 0, score: 0, streak: 0, best: 0, used: new Set(),
    question: null, busy: false, retrying: false, lastDataset: dataset
  };

  const mapEl = document.getElementById('map');
  if (map) { map.remove(); map = null }
  map = L.map(mapEl, {
    zoomControl: false, attributionControl: true, dragging: true,
    touchZoom: true, scrollWheelZoom: true, doubleClickZoom: false, boxZoom: false
  });

  L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png?key=cb1_3nxu_1_37aa0b0a1afa1e7250a65dc6', {
    attribution: '&copy;OSM &copy;CARTO', maxZoom: 10, minZoom: 3
  }).addTo(map);
  L.rectangle([[-90, -180], [90, 180]], { fillColor: '#66ccff', fillOpacity: 0.03, stroke: false, interactive: false }).addTo(map);

  GS.defaultBounds = L.latLngBounds(GS.locs.map(l => [l.lat, l.lng])).pad(0.15);
  map.fitBounds(GS.defaultBounds);
  glowLayers = [];
  loadCountryShapes();

  markers = {};
  for (const loc of GS.locs) {
    const type = loc.tags.type || 'city';
    // Build dot inner content based on type (matching textbook icons)
    let dotInner = '';
    if (type === 'gebied') dotInner = '<span class="flag-pole"></span><span class="flag-banner"></span>';
    else if (type === 'water') dotInner = '<span class="wave-icon">\u2248</span>';
    else if (type === 'bijzonderheid') dotInner = '<span class="star-icon">\u2605</span>';
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

// ============================================================
// COUNTRY OUTLINE GLOW
// ============================================================
let countryShapes = null, glowLayers = [];

// Natural Earth 1:50m borders, fetched once and indexed by name
function loadCountryShapes() {
  if (!countryShapes) {
    countryShapes = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json')
      .then(r => r.json())
      .then(topo => {
        const byName = {};
        for (const f of topojson.feature(topo, topo.objects.countries).features) byName[f.properties.name] = f;
        return byName;
      })
      .catch(() => ({}));
  }
  return countryShapes;
}

function clearGlow() {
  for (const l of glowLayers) l.remove();
  glowLayers = [];
}

// kind: 'correct' (green) or 'wrong' (red); only for locations of type land
function glowCountry(loc, kind) {
  clearGlow();
  const name = loc.tags.type === 'land' && COUNTRY_OUTLINES[loc.name];
  if (!name) return;
  const q = GS.question;
  loadCountryShapes().then(shapes => {
    if (!map || !GS || GS.question !== q || !shapes[name]) return;
    clearGlow();
    const color = kind === 'wrong' ? '#ff4400' : '#44ff88';
    // wide faint stroke underneath fakes the glow; SVG filters are too slow on big polygons
    glowLayers.push(L.geoJSON(shapes[name], {
      interactive: false, className: 'country-glow',
      style: { color, weight: 12, opacity: .3, fill: false }
    }).addTo(map));
    glowLayers.push(L.geoJSON(shapes[name], {
      interactive: false,
      style: { color, weight: 2.5, opacity: 1, fillColor: color, fillOpacity: .12 }
    }).addTo(map));
  });
}

function resetMarkers() {
  for (const loc of GS.locs) {
    const el = document.querySelector(`.nuke-marker[data-id="${loc.id}"]`);
    if (el) { el.classList.remove('nuked', 'highlight'); const lbl = el.querySelector('.label'); if (lbl) lbl.remove() }
  }
}

function nextQ() {
  if (GS.round >= GS.totalQ) { endGame(); return }
  resetMarkers(); clearGlow();
  map.flyToBounds(GS.defaultBounds, { duration: .5, padding: [20, 20] });
  const q = genQ(GS.locs, GS.used);
  if (!q) { endGame(); return }
  GS.question = q; GS.busy = false; GS.retrying = false;
  updateHUD(); hideToast();
}

function handleClick(loc) {
  if (!GS || GS.busy || !GS.question) return;

  const food = T().fx === 'food';

  // during retry, only accept the correct answer
  if (GS.retrying) {
    if (!GS.question.ids.has(loc.id)) return;
    GS.busy = true;
    const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
    const wrap = document.getElementById('map-wrap');
    launchMissile(pt.x, pt.y, wrap, () => {
      if (food) {
        spawnFoodParty(pt.x, pt.y, wrap.clientWidth, wrap.clientHeight, loc.tags.emoji);
        soundDelivered(); doShake();
      } else {
        spawnMegaBoom(pt.x, pt.y, wrap.clientWidth, wrap.clientHeight);
        soundMegaBoom();
        doFlash(); doMegaShake();
      }
    });
    soundMissileIncoming();
    const el = document.querySelector(`.nuke-marker[data-id="${loc.id}"]`);
    if (el) {
      el.classList.remove('highlight'); el.classList.add('nuked');
      if (food) { el.classList.add('food'); el.dataset.emoji = loc.tags.emoji || '📦' }
      const lbl = document.createElement('div'); lbl.className = 'label'; lbl.textContent = loc.name;
      el.insertBefore(lbl, el.firstChild);
    }
    showToast(`${T().retryCorrect(loc)}`, food ? factOf(loc) : null, 'correct');
    GS.used.add(GS.question.tid); GS.round++; updateHUD();
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => nextQ(), 4000);
    return;
  }

  GS.busy = true;
  const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
  const correct = GS.question.ids.has(loc.id);
  const correctLoc = GS.locs.find(l => GS.question.ids.has(l.id));
  const wrap = document.getElementById('map-wrap');
  // the dish that was ordered lands wherever was clicked
  const emoji = correctLoc?.tags.emoji || '📦';

  if (correct && food) {
    launchMissile(pt.x, pt.y, wrap, () => {
      spawnFoodParty(pt.x, pt.y, wrap.clientWidth, wrap.clientHeight, emoji);
      soundDelivered(); doShake();
    });
    soundMissileIncoming();
  } else if (correct) {
    // MEGA EXPLOSION with missile from space!
    launchMissile(pt.x, pt.y, wrap, () => {
      spawnMegaBoom(pt.x, pt.y, wrap.clientWidth, wrap.clientHeight);
      soundMegaBoom();
      doFlash(); doMegaShake();
    });
    soundMissileIncoming();
  } else if (food) {
    // dropped the order on the wrong doorstep + fart
    spawnSplat(pt.x, pt.y, isMobile ? .9 : 1.2, emoji);
    soundSplat();
    setTimeout(() => soundFart(), 300);
    doShake();
  } else {
    // Small boom for wrong + fart
    spawnBoom(pt.x, pt.y, isMobile ? .9 : 1.2);
    soundSmallBoom();
    setTimeout(() => soundFart(), 300);
    doFlash(); doShake();
  }

  // nuked visual
  const el = document.querySelector(`.nuke-marker[data-id="${loc.id}"]`);
  if (el) {
    el.classList.add('nuked');
    if (food) { el.classList.add('food'); el.dataset.emoji = emoji }
    const lbl = document.createElement('div'); lbl.className = 'label'; lbl.textContent = loc.name;
    el.insertBefore(lbl, el.firstChild);
  }

  glowCountry(loc, correct ? 'correct' : 'wrong');

  if (correct) {
    GS.score += 100 + GS.streak * 25; GS.streak++;
    if (GS.streak > GS.best) GS.best = GS.streak;
    if (GS.streak > 1) soundStreak(GS.streak);
    showToast(pick(T().right)(loc), factOf(loc), 'correct');
    GS.used.add(GS.question.tid); GS.round++; updateHUD();
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => nextQ(), 5000);
  } else {
    GS.streak = 0;
    const fact = correctLoc ? factOf(correctLoc) : null;
    showToast(pick(T().wrong)(loc, correctLoc || loc), fact, 'wrong');
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
      glowCountry(correctLoc, 'correct');
      showToast(`👆 ${T().retryHint(correctLoc)}`, fact, 'correct');
      GS.retrying = true; GS.busy = false;
    }, 6000);
  }
}

// Fact for the toast; themed sets with dishes also explain what the dish is
function factOf(loc) {
  const fact = loc.tags.fact || '';
  if (T().fx !== 'food') return fact || null;
  const info = currentLang === 'en' ? loc.tags.dishInfoEn : loc.tags.dishInfo;
  if (!info) return fact || null;
  return (fact ? fact + '<br>' : '') + `${loc.tags.emoji || '🍽'} ${info}`;
}

// ============================================================
// MISSILE FROM SPACE
// ============================================================
function launchMissile(targetX, targetY, wrap, onImpact) {
  const layer = document.getElementById('missile-layer');
  const missile = document.createElement('div');
  missile.className = 'missile' + (T().fx === 'food' ? ' drone' : '');
  missile.textContent = T().projectile || '🚀';
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
  if (T().fx === 'food') trail.style.display = 'none';
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
  document.getElementById('hud-round').textContent = `${T().roundIcon || '☢'} ${Math.min(GS.round + 1, GS.totalQ)}/${GS.totalQ}`;
  document.getElementById('hud-score').textContent = GS.score;
  const streakEl = document.getElementById('hud-streak');
  streakEl.textContent = GS.streak > 1 ? GS.streak + 'x' : '';
  streakEl.classList.toggle('fire', GS.streak >= 3);
  const t = GS.question ? `${T().qIcon || '💣'} ${GS.question.text}` : '...';
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
  if (pct >= 70) startFireworks(pct >= 90 ? 10 : 6);
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
