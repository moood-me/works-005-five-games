// The cliff top seen from above: dry summer grass, worn paths, stones. A level plane 44 × 30 m,
// its centre 15 m ahead: x = across, y = 15 − distance (toward the viewer). Painted only where the land is.
const edge = e.lib.edge, rnd = e.rnd;
const Y = d => 15 - d;
// the land's outline: everything nearer than the cliff's edge
g.beginPath();
g.moveTo(-22, 15);
for (let a = -22; a <= 22; a += 0.5) g.lineTo(a, Y(edge(a) - 0.06 - 0.12 * Math.sin(a * 1.7) ** 2));
g.lineTo(22, 15);
g.closePath();
g.save();
g.clip();
g.fillStyle = '#9d9a7f';
g.fillRect(-22, -15, 44, 30);
// patches of greyer and paler grass
const tones = ['#918f78', '#aaa488', '#878b74', '#a39e84'];
for (let i = 0; i < 420; i++) {
  const a = -22 + rnd() * 44, d = rnd() * 24, r = 0.3 + rnd() * 1.4;
  g.globalAlpha = 0.35 + 0.3 * rnd();
  g.fillStyle = tones[i % 4];
  g.beginPath(); g.ellipse(a, Y(d), r, r * (0.5 + rnd() * 0.5), rnd() * 3, 0, Math.PI * 2); g.fill();
}
g.globalAlpha = 1;
// the paths: along the edge (from the church round to the east), and from the bench toward it
g.strokeStyle = '#c6ba9b'; g.lineCap = 'round'; g.lineJoin = 'round';
g.lineWidth = 0.75;
g.beginPath();
g.moveTo(8.5, Y(19)); g.bezierCurveTo(6.2, Y(14.5), 3.6, Y(9.4), 1.5, Y(7.4));
g.bezierCurveTo(-4, Y(7.0), -12, Y(7.2), -22, Y(6.9));
g.stroke();
g.lineWidth = 0.5;
g.beginPath(); g.moveTo(0.1, Y(4.2)); g.bezierCurveTo(0.3, Y(5.5), 1.0, Y(6.6), 1.5, Y(7.4)); g.stroke();
g.lineWidth = 0.9; g.globalAlpha = 0.6;
g.beginPath(); g.moveTo(-1.6, Y(3.0)); g.bezierCurveTo(-0.6, Y(3.2), 0.6, Y(3.2), 1.6, Y(3.0)); g.stroke();   // trodden before the bench
g.globalAlpha = 1;
// stones
for (let i = 0; i < 90; i++) {
  const a = -14 + rnd() * 26, d = 2 + rnd() * 9, r = 0.05 + rnd() ** 2 * 0.3;
  g.fillStyle = i % 3 ? '#b7b0a1' : '#9a9488';
  g.beginPath(); g.ellipse(a, Y(d), r, r * 0.7, rnd() * 3, 0, Math.PI * 2); g.fill();
}
// blades of grass near the eye
g.lineWidth = 0.018;
for (let i = 0; i < 1600; i++) {
  const a = -7 + rnd() * 14, d = 2.2 + rnd() ** 1.5 * 5.5, l = 0.07 + rnd() * 0.14, t = rnd() * Math.PI;
  g.strokeStyle = i % 3 ? '#b8b092' : '#7a7a62';
  g.beginPath(); g.moveTo(a, Y(d)); g.lineTo(a + Math.cos(t) * l, Y(d) + Math.sin(t) * l * 0.6); g.stroke();
}
g.restore();
