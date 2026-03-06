// ============================================================
// QUESTION ENGINE
// ============================================================
function genQ(locs, used) {
  const av = locs.filter(l => !used.has(l.id));
  if (!av.length) return null;

  const templates = T().qTemplates;
  const pool = [];

  for (const l of av) {
    for (const t of templates) {
      let canUse = false;
      if (t.type === 'any') canUse = true;
      else if (t.type === 'capital') canUse = l.tags.type === 'capital' && l.tags.capitalOf;
      else if (t.type === 'land') canUse = l.tags.type === 'land';
      else if (t.type === 'water') canUse = l.tags.type === 'water';
      else if (t.type === 'gebied') canUse = l.tags.type === 'gebied';
      else if (t.type === 'capitalReverse') canUse = l.tags.type === 'land' && locs.some(x => x.tags.capitalOf === l.name);

      if (canUse) {
        for (let i = 0; i < t.w; i++) pool.push({ l, t });
      }
    }
  }

  if (!pool.length) {
    const l = pick(av);
    return { text: templates[0].text(l), ids: new Set([l.id]), tid: l.id };
  }

  for (let i = 0; i < 30; i++) {
    const { l, t } = pick(pool);
    if (t.type === 'capitalReverse') {
      const c = locs.find(x => x.tags.capitalOf === l.name);
      if (c) return { text: t.text(l), ids: new Set([c.id]), tid: l.id };
    } else {
      return { text: t.text(l), ids: new Set([l.id]), tid: l.id };
    }
  }

  const l = pick(av);
  return { text: templates[0].text(l), ids: new Set([l.id]), tid: l.id };
}
