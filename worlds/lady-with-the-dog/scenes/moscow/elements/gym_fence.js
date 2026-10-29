// The girls' school's railings along the right pavement (z −8…7.6; the card's x runs toward the viewer: −z): plastered
// posts, iron bars with spear tips, the gate (z 4.6…5.8: x −5.8…−4.6) standing open; the snow on the posts' caps. The
// point `gate` — where she runs in.
const L = e.lib;
const P = L.PAINT;
const season = L.seasonOf(e.state.season);
const rnd = () => e.rnd();
const GATE = [-5.8, -4.6];
const posts = [-7.6, GATE[0], GATE[1], -2.2, 0.4, 3.0, 5.6, 8.0];
g.strokeStyle = '#2b2e33';
g.fillStyle = '#2b2e33';
for (let x = -7.6; x <= 8.0; x += 0.14) {
  if (x > GATE[0] - 0.05 && x < GATE[1] + 0.05) continue;
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(x, -0.35);
  g.lineTo(x, -2.0);
  g.stroke();
  g.beginPath();
  g.moveTo(x - 0.03, -2.0);
  g.lineTo(x + 0.03, -2.0);
  g.lineTo(x, -2.12);
  g.closePath();
  g.fill();
}
g.lineWidth = 0.04;
for (const yy of [-0.5, -1.85]) {
  g.beginPath();
  g.moveTo(-7.6, yy);
  g.lineTo(GATE[0], yy);
  g.moveTo(GATE[1], yy);
  g.lineTo(8.0, yy);
  g.stroke();
}
// the plinth under the bars
P.fillRect(g, '#9b958b', -7.6, -0.35, GATE[0], 0);
P.fillRect(g, '#9b958b', GATE[1], -0.35, 8.0, 0);
for (const x of posts) {
  const tall = x === GATE[0] || x === GATE[1];
  const h = tall ? 2.9 : 2.3;
  P.fillRect(g, '#e2dccd', x - 0.2, -h, x + 0.2, 0);
  P.fillRect(g, '#cfc8b8', x - 0.26, -h - 0.1, x + 0.26, -h + 0.05);
  P.snowLedge(g, season, x - 0.26, x + 0.26, -h - 0.1, 0.14, rnd);
}
if (season !== 'thaw') {
  P.snowLedge(g, season, -7.6, GATE[0], -0.35, 0.1, rnd);
  P.snowLedge(g, season, GATE[1], 8.0, -0.35, 0.1, rnd);
}
// the ironwork arch over the gate
g.lineWidth = 0.04;
g.beginPath();
g.moveTo(GATE[0] + 0.2, -2.85);
g.quadraticCurveTo((GATE[0] + GATE[1]) / 2, -3.5, GATE[1] - 0.2, -2.85);
g.stroke();
for (let k = 1; k < 6; k++) {
  const x = GATE[0] + 0.2 + ((GATE[1] - GATE[0] - 0.4) * k) / 6;
  g.beginPath();
  g.arc(x, -3.0, 0.07, 0, Math.PI * 2);
  g.stroke();
}
e.at((GATE[0] + GATE[1]) / 2, -1.1, 'gate');
