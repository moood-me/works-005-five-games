// The chimney stacks on the party walls, over the ridge: brick, a row of pots on each; the middle pot of each is a point
// (chimneys#s0 …, left to right) — where the coal smoke comes out.
const L = e.lib;
const P = L.plan;
L.stacks.forEach(([x, top], i) => {
  const m = x - P.row;
  g.fillStyle = '#6b6258';
  g.fillRect(m - 0.6, -top, 1.2, top - P.ridge + 0.2);
  g.fillStyle = 'rgba(0,0,0,0.25)';
  g.fillRect(m - 0.66, -top, 1.32, 0.12);
  g.fillStyle = '#7a5444';
  for (const dx of [-0.36, 0, 0.36]) g.fillRect(m + dx - 0.08, -top - 0.38, 0.16, 0.38);
  e.at(m, -top - 0.4, `s${i}`);
});
