// ============================================================
// SET EDITOR
// ============================================================
let editorLocs = [];

function showEditor() {
  editorLocs = [];
  document.getElementById('ed-name').value = 'Mijn Set';
  ['ed-loc-name', 'ed-loc-lat', 'ed-loc-lng', 'ed-loc-of', 'ed-loc-fact'].forEach(id => document.getElementById(id).value = '');
  renderEdList(); showScreen('editor');
}

function editorAddLoc() {
  const n = document.getElementById('ed-loc-name').value.trim(),
    la = document.getElementById('ed-loc-lat').value,
    ln = document.getElementById('ed-loc-lng').value,
    tp = document.getElementById('ed-loc-type').value,
    of_ = document.getElementById('ed-loc-of').value.trim(),
    fact = document.getElementById('ed-loc-fact').value.trim();
  if (!n || !la || !ln) return;
  const tags = { type: tp }; if (of_) tags.capitalOf = of_; if (fact) tags.fact = fact;
  editorLocs.push(mkLoc(n, la, ln, tags));
  ['ed-loc-name', 'ed-loc-lat', 'ed-loc-lng', 'ed-loc-of', 'ed-loc-fact'].forEach(id => document.getElementById(id).value = '');
  soundClick();
  renderEdList();
}

function renderEdList() {
  const list = document.getElementById('ed-list');
  document.getElementById('ed-count').textContent = editorLocs.length;
  list.innerHTML = '';
  if (!editorLocs.length) list.innerHTML = '<div style="color:#ffffff33;font-size:12px;padding:12px;text-align:center">Voeg locaties toe of importeer JSON</div>';
  for (const l of editorLocs) {
    const d = document.createElement('div'); d.className = 'loc-item';
    const ts = Object.entries(l.tags).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(' · ');
    d.innerHTML = `<span class="loc-name">${l.name}</span><span class="loc-tags">${ts}</span>`;
    const btn = document.createElement('button'); btn.className = 'loc-del'; btn.textContent = '✕';
    btn.onclick = () => { editorLocs = editorLocs.filter(x => x.id !== l.id); renderEdList() };
    d.appendChild(btn); list.appendChild(d);
  }
  const sb = document.getElementById('ed-save'); sb.disabled = editorLocs.length < 3;
  sb.textContent = `💾 ${T().save} (${editorLocs.length})`;
  document.getElementById('ed-warn').style.display = (editorLocs.length > 0 && editorLocs.length < 3) ? 'block' : 'none';
}

function toggleJsonImport() { const el = document.getElementById('json-import'); el.style.display = el.style.display === 'none' ? 'block' : 'none' }

function editorImportJson() {
  try {
    const data = JSON.parse(document.getElementById('ed-json').value);
    const arr = (Array.isArray(data) ? data : data.locations || []);
    if (!arr.length) throw new Error('Geen locaties gevonden');
    for (const d of arr) editorLocs.push(mkLoc(d.name, d.lat, d.lng, d.tags || {}));
    document.getElementById('json-import').style.display = 'none';
    document.getElementById('ed-json').value = '';
    document.getElementById('json-err').style.display = 'none';
    renderEdList();
  } catch (e) { document.getElementById('json-err').textContent = e.message; document.getElementById('json-err').style.display = 'block' }
}

function editorSave() {
  if (editorLocs.length < 3) return;
  const label = document.getElementById('ed-name').value.trim() || 'Mijn Set';
  customSets.push({ label, description: `${editorLocs.length} ${T().locations}`, locations: [...editorLocs] });
  saveCustomSets();
  soundClick();
  showScreen('menu');
}
