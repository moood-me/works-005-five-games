// Beyond the houses: the roofs of the next row, black spruces against the low sky, a couple of small lit windows
// far off. Metres, 150 wide, seen from 30 m and more — a dark band with its snow.
g.fillStyle = '#1a1f2c';
for (let x = -74; x < 74; x += 2 + e.rnd() * 3) {
  const h = 5 + e.rnd() * 7;
  g.beginPath();
  g.moveTo(x - 1.6, 0);
  g.lineTo(x, -h);
  g.lineTo(x + 1.6, 0);
  g.closePath();
  g.fill();
}
let lit = 0;
for (let x = -72; x < 72; x += 9 + e.rnd() * 8) {
  const w = 6 + e.rnd() * 4, h = 3 + e.rnd() * 0.8, r = 1.8 + e.rnd() * 0.6;
  g.fillStyle = '#3a3030';
  g.fillRect(x, -h, w, h);
  g.fillStyle = '#cdd5e2';
  g.beginPath();
  g.moveTo(x - 0.4, -h);
  g.lineTo(x + w / 2, -h - r);
  g.lineTo(x + w + 0.4, -h);
  g.closePath();
  g.fill();
  if (e.rnd() < 0.25) {
    g.fillStyle = '#e9a45a';
    g.fillRect(x + w * 0.3, -h * 0.6, 0.7, 0.7);
    e.light(x + w * 0.3 + 0.35, -h * 0.6 + 0.35, 0.9, '#e8963a', 1.2, `w${lit++}`);
  }
}
g.fillStyle = '#dfe6ef';
g.fillRect(-75, -0.4, 150, 0.9);
