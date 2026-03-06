// ============================================================
// APP - Screen management, menu rendering, init
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'menu') renderMenu();
}

function renderMenu() {
  const t = T();
  document.getElementById('menu-subtitle').textContent = t.subtitle;
  document.getElementById('menu-title1').textContent = t.title1;
  document.getElementById('menu-title2').textContent = t.title2;
  document.getElementById('menu-desc').textContent = t.desc;
  document.getElementById('label-hw').textContent = t.hwSets;
  document.getElementById('label-extra').textContent = t.extraSets;
  document.getElementById('label-custom').textContent = t.customSets;
  document.getElementById('btn-new-set').textContent = t.newSet;
  document.getElementById('btn-sound').textContent = soundEnabled ? ('🔊 ' + t.soundOn) : ('🔇 ' + t.soundOff);
  document.getElementById('btn-sound').classList.toggle('active', soundEnabled);
  document.getElementById('btn-lang').textContent = currentLang === 'nl' ? '🇳🇱 NL → 🇬🇧 EN' : '🇬🇧 EN → 🇳🇱 NL';

  const h = document.getElementById('hw-sets'), e = document.getElementById('extra-sets'), c = document.getElementById('custom-sets');
  h.innerHTML = ''; e.innerHTML = ''; c.innerHTML = '';
  for (const [k, s] of Object.entries(HOMEWORK)) h.appendChild(mkCard(s, () => startGame(s)));
  for (const [k, s] of Object.entries(EXTRAS)) e.appendChild(mkCard(s, () => startGame(s)));
  if (!customSets.length) c.innerHTML = `<div style="color:#ffffff33;font-size:11px;margin-bottom:10px">${t.noCustom}</div>`;
  customSets.forEach((s, i) => c.appendChild(mkCard(s, () => startGame(s))));
}

function mkCard(set, onPlay) {
  const t = T();
  const d = document.createElement('div'); d.className = 'set-card';
  d.innerHTML = `<div class="info"><div class="name">${set.hw ? '📚 ' : ''}${set.label}</div><div class="meta">${set.description} · ${set.locations.length} ${t.locations}</div></div><button class="play-btn">▶</button>`;
  d.querySelector('.play-btn').onclick = e => { e.stopPropagation(); soundClick(); onPlay() };
  d.onclick = () => { soundClick(); onPlay() };
  return d;
}

function onToggleSound() {
  toggleSound();
  renderMenu();
  if (soundEnabled) soundClick();
}

function onToggleLang() {
  toggleLanguage();
  renderMenu();
  soundClick();
}

// Init
updateHudLayout();
renderMenu();
