// a row of folding chairs with the audience's backs: dark shapes, a few pale shirts
const cols = ['#1d2236', '#262b40', '#1a1e30', '#2d2a38', '#1f2a3a'];
for (let i = 0; i < 12; i++) {
  const x = -4.4 + i * 0.8 + (e.rnd() - 0.5) * 0.2, s = 0.9 + e.rnd() * 0.25;
  g.fillStyle = '#3a342d'; g.fillRect(x - 0.3, -0.95, 0.6, 0.06); g.fillRect(x - 0.28, -0.95, 0.05, 0.95); g.fillRect(x + 0.23, -0.95, 0.05, 0.95);
  g.fillStyle = e.rnd() < 0.18 ? '#a9a99e' : cols[i % cols.length];
  g.beginPath(); g.moveTo(x - 0.32, -0.8); g.quadraticCurveTo(x - 0.34, -1.35 * s, x, -1.38 * s); g.quadraticCurveTo(x + 0.34, -1.35 * s, x + 0.32, -0.8); g.closePath(); g.fill();
  g.fillStyle = '#17120f'; g.beginPath(); g.arc(x, -1.52 * s, 0.17, 0, 7); g.fill();
}
