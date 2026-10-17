// The dormers' fronts, one to each house, standing out of the mansards: white timber round a small sash —
// Fogg's attic window's panes cut out (Passepartout's room behind), the neighbours' dark.
const L = e.lib;
const P = L.plan;
const y0 = P.parapet;
for (const h of L.houses) {
  const win = L.dormerOf(h);
  const m = win[0] - P.row;
  const panes = L.panes([m, win[1] - y0, win[2], win[3]]);
  g.beginPath();
  g.rect(m - P.dormer.half, -(P.dormer.top - y0), 2 * P.dormer.half, P.dormer.top - y0);
  if (h.fogg) for (const [x, y, w, hh] of panes) g.rect(x, y, w, hh);
  g.fillStyle = '#5a5e64';
  g.fill('evenodd');
  g.beginPath();
  g.rect(m - win[2] / 2, -(win[1] - y0) - win[3], win[2], win[3]);
  for (const [x, y, w, hh] of panes) g.rect(x, y, w, hh);
  g.fillStyle = '#e4e2dc';
  g.fill('evenodd');
  if (!h.fogg) {
    g.fillStyle = '#26282c';
    for (const [x, y, w, hh] of panes) g.fillRect(x, y, w, hh);
  }
}
