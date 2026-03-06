// ============================================================
// SOUND EFFECTS (Web Audio API - no external files needed)
// ============================================================
let audioCtx = null;
let soundEnabled = localStorage.getItem('aa-sound') !== 'off';

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('aa-sound', soundEnabled ? 'on' : 'off');
  if (soundEnabled) initAudio();
  return soundEnabled;
}

function playNoise(duration, volume, filterFreq) {
  if (!soundEnabled || !audioCtx) return;
  const bufSize = audioCtx.sampleRate * duration;
  const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq || 800, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + duration);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume || 0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  src.start();
  src.stop(audioCtx.currentTime + duration);
}

function playTone(freq, duration, type, volume) {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume || 0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Sound file pools - preload for caching, play as fresh instances to avoid overlap
const fartFiles = ['sfx/fart1.mp3', 'sfx/fart2.mp3', 'sfx/fart3.mp3'];
const boomFiles = ['sfx/boom1.mp3', 'sfx/boom2.mp3', 'sfx/boom3.mp3'];
// Preload all files into browser cache
fartFiles.concat(boomFiles).forEach(f => { const a = new Audio(f); a.preload = 'auto'; });

// Track last played index to avoid repeats
let lastFart = -1, lastBoom = -1;

function pickRandom(files, lastIdx) {
  if (files.length <= 1) return 0;
  let idx;
  do { idx = Math.floor(Math.random() * files.length); } while (idx === lastIdx);
  return idx;
}

function playFile(file, volume) {
  const a = new Audio(file);
  a.volume = volume;
  a.play().catch(() => {});
}

function soundFart() {
  if (!soundEnabled) return;
  lastFart = pickRandom(fartFiles, lastFart);
  playFile(fartFiles[lastFart], 0.6);
}

// Small explosion (wrong answer)
function soundSmallBoom() {
  if (!soundEnabled) return;
  lastBoom = pickRandom(boomFiles, lastBoom);
  playFile(boomFiles[lastBoom], 0.4);
}

// MEGA explosion (correct answer) - play loud + synth bass rumble for extra oomph
function soundMegaBoom() {
  if (!soundEnabled) return;
  initAudio();
  lastBoom = pickRandom(boomFiles, lastBoom);
  playFile(boomFiles[lastBoom], 0.8);
  // extra synth bass for that chest-thumping feel
  playTone(30, 1.5, 'sine', 0.4);
  playTone(55, 1.0, 'sine', 0.3);
  playNoise(0.8, 0.3, 800);
}

// Missile incoming whoosh
function soundMissileIncoming() {
  if (!soundEnabled || !audioCtx) return;
  initAudio();
  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.6);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.7);
}

// Streak ding
function soundStreak(count) {
  if (!soundEnabled) return;
  initAudio();
  const baseFreq = 400 + Math.min(count, 10) * 60;
  playTone(baseFreq, 0.15, 'sine', 0.15);
  setTimeout(() => playTone(baseFreq * 1.5, 0.15, 'sine', 0.12), 80);
}

// UI click
function soundClick() {
  if (!soundEnabled) return;
  initAudio();
  playTone(800, 0.05, 'sine', 0.08);
}

// Game over fanfare
function soundGameOver(good) {
  if (!soundEnabled) return;
  initAudio();
  if (good) {
    [440, 554, 659, 880].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.15), i * 150);
    });
  } else {
    [330, 294, 262, 196].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.4, 'sawtooth', 0.1), i * 200);
    });
  }
}
