// The far shore across the harbour: Hong Kong's island — its peak over the town along the water, its houses thick by
// the water in the middle and thinning out up the hill and along the shore; or Yokohama — low bluffs, the town flat
// along the water, a few houses on the bluffs, a pagoda on the hill. Painted clear by day: the haze, the evening and the
// night are the scene's. Where the houses are is lib.houses — the shore's lights are lit in them (city_lights).
const L = e.lib;
const port = L.portOf(e.state);
g.fillStyle = port === 'yokohama' ? '#7c8676' : '#6f7e78';
g.beginPath();
g.moveTo(-1500, 2);
for (let x = -1500; x <= 1500; x += 10) g.lineTo(x, -L.shore(port, x));
g.lineTo(1500, 2);
g.closePath();
g.fill();
for (const [x, y, w, h, tone] of L.houses(port)) {
  g.fillStyle = L.rgba(L.mixc('#c2bdb0', '#e0dacc', tone));
  g.fillRect(x, -y - h, w, h);
  g.fillStyle = 'rgba(60,60,60,0.25)';
  g.fillRect(x, -y - h, w, Math.min(1.2, h * 0.2));
}
if (port === 'yokohama') {
  // the pagoda on the hill: five roofs, a spire
  const px = -380;
  const base = L.shore(port, px) - 2;
  g.fillStyle = '#4a4440';
  for (let k = 0; k < 5; k++) {
    const y = base + k * 7;
    const r = 9 - k * 1.2;
    g.fillRect(px - r * 0.45, -y - 6, r * 0.9, 6);
    g.beginPath();
    g.moveTo(px - r, -y - 5.4);
    g.quadraticCurveTo(px - r * 0.4, -y - 6.6, px, -y - 7.2);
    g.quadraticCurveTo(px + r * 0.4, -y - 6.6, px + r, -y - 5.4);
    g.lineTo(px, -y - 6.2);
    g.closePath();
    g.fill();
  }
  g.fillRect(px - 0.4, -base - 46, 0.8, 11);
  e.at(px, -base - 40, 'pagoda');
} else e.at(-160, -L.shore(port, -160), 'peak');
