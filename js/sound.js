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

// Small explosion (wrong answer)
function soundSmallBoom() {
  if (!soundEnabled) return;
  initAudio();
  playNoise(0.6, 0.4, 600);
  playTone(80, 0.4, 'sine', 0.3);
  playTone(50, 0.6, 'sine', 0.2);
}

// MEGA explosion (correct answer) - deep bass + layered noise
function soundMegaBoom() {
  if (!soundEnabled) return;
  initAudio();
  // deep bass rumble
  playTone(30, 1.5, 'sine', 0.5);
  playTone(55, 1.0, 'sine', 0.4);
  // impact noise
  playNoise(1.2, 0.6, 1200);
  // delayed secondary boom
  setTimeout(() => {
    playNoise(0.8, 0.3, 500);
    playTone(40, 0.8, 'sine', 0.3);
  }, 200);
  // crackle
  setTimeout(() => playNoise(0.5, 0.15, 2000), 400);
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
