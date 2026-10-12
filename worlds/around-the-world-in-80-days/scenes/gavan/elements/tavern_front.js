// The tavern's front over its terrace: dark boards, wide doors below and a row of windows above, cut out — its room is
// seen through them (tavern_inside); its sign hung by the middle door: in Hong Kong a long red board with gold marks, in
// Yokohama an indigo cloth over the door.
const L = e.lib;
const T = L.plan.tavern;
const yoko = L.portOf(e.state) === 'yokohama';
g.beginPath();
g.rect(-T.half, -T.wall, 2 * T.half, T.wall + 1.6);
for (const [x, sill, w, h] of L.plan.openings) g.rect(x - w / 2, -sill - h, w, h);
g.fillStyle = '#5a4634';
g.fill('evenodd');
g.fillStyle = 'rgba(0,0,0,0.16)';
g.fillRect(-T.half, -T.floor - 0.25, 2 * T.half, 0.25);
for (let x = -T.half + 0.25; x < T.half; x += 0.25) {
  if (L.plan.openings.some(([ox, sill, w]) => Math.abs(x - ox) < w / 2 && sill < 1)) continue;
  g.fillRect(x, -T.floor, 0.015, T.floor + 1.6);
}
// the window lattices
g.fillStyle = '#3a2c20';
for (const [x, sill, w, h] of L.plan.openings) {
  if (sill < 1) continue;
  for (let k = 1; k < 4; k++) g.fillRect(x - w / 2 + (w * k) / 4 - 0.02, -sill - h, 0.04, h);
  g.fillRect(x - w / 2, -sill - h / 2 - 0.02, w, 0.04);
}
// its sign
if (yoko) {
  g.fillStyle = '#2c3a5a';
  g.fillRect(-1.4, -2.7, 2.8, 0.9);
  g.fillStyle = 'rgba(255,255,255,0.7)';
  g.fillRect(-0.02, -2.7, 0.04, 0.9);
  g.beginPath();
  g.arc(-0.7, -2.25, 0.18, 0, Math.PI * 2);
  g.arc(0.7, -2.25, 0.18, 0, Math.PI * 2);
  g.fill();
} else {
  g.fillStyle = '#9a2a20';
  g.fillRect(2.0, -6.1, 0.7, 3.3);
  g.fillStyle = '#d8a848';
  for (let k = 0; k < 4; k++) {
    const y = -5.8 + k * 0.78;
    g.fillRect(2.2, y, 0.3, 0.06);
    g.fillRect(2.33, y - 0.06, 0.05, 0.42);
    g.fillRect(2.18, y + 0.24, 0.34, 0.05);
  }
}
e.at(0, -1.4, 'door');
