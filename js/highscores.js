// ============================================================
// HIGHSCORE SYSTEM (localStorage)
// ============================================================
const HS_KEY = 'aa-highscores';
const HS_MAX = 10;

function getHighscores(setKey) {
  const all = JSON.parse(localStorage.getItem(HS_KEY) || '{}');
  return (all[setKey] || []).sort((a, b) => b.score - a.score).slice(0, HS_MAX);
}

function addHighscore(setKey, name, score, streak) {
  const all = JSON.parse(localStorage.getItem(HS_KEY) || '{}');
  if (!all[setKey]) all[setKey] = [];
  all[setKey].push({ name, score, streak, date: Date.now() });
  all[setKey].sort((a, b) => b.score - a.score);
  all[setKey] = all[setKey].slice(0, HS_MAX);
  localStorage.setItem(HS_KEY, JSON.stringify(all));
  return all[setKey];
}

function isHighscore(setKey, score) {
  const scores = getHighscores(setKey);
  return scores.length < HS_MAX || score > (scores[scores.length - 1]?.score || 0);
}

function getSetKey(dataset) {
  return dataset.label.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function renderHighscoreTable(setKey, highlightScore) {
  const scores = getHighscores(setKey);
  const t = T();
  if (!scores.length) return `<div style="color:#aabbcc66;font-size:12px;margin:12px 0">${t.noScores}</div>`;

  let html = '<table class="hs-table"><tr><th>#</th><th>NAME</th><th>SCORE</th><th>STREAK</th></tr>';
  scores.forEach((s, i) => {
    const medal = i === 0 ? 'hs-gold' : i === 1 ? 'hs-silver' : i === 2 ? 'hs-bronze' : '';
    const you = s.score === highlightScore ? 'hs-you' : '';
    html += `<tr class="${medal} ${you}"><td class="hs-rank">${i + 1}</td><td class="hs-name">${escHtml(s.name)}</td><td class="hs-score">${s.score}</td><td>${s.streak}x</td></tr>`;
  });
  html += '</table>';
  return html;
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
