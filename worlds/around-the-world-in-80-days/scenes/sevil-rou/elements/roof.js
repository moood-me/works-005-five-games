// The mansards behind the parapet, a slate slope over each house (seen from above, y toward the street), cut
// where its dormer stands out of it.
const L = e.lib;
const P = L.plan;
const half = 0.957; // half the slope's length
const up = (half * 2 * (P.dormer.top - P.parapet)) / (P.ridge - P.parapet);
g.beginPath();
for (const h of L.houses) {
  g.rect(h.x0 - P.row, -half, h.x1 - h.x0, 2 * half);
  g.rect((h.x0 + h.x1) / 2 - P.row - P.dormer.half, half - up, 2 * P.dormer.half, up);
}
g.fillStyle = '#4c5057';
g.fill('evenodd');
g.fillStyle = 'rgba(0,0,0,0.22)';
for (const h of L.houses) for (let y = -half + 0.22; y < half; y += 0.22) g.fillRect(h.x0 - P.row, y, h.x1 - h.x0, 0.02);
