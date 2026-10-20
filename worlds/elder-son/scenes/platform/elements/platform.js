// The platform's concrete from above: snow trodden grey along the middle, cleaner at the sides, the white line along
// its edge over the tracks, the slabs' joints showing through. Metres, centre at its middle; y toward the viewer.
const P = e.lib.G.PLAT, W = P.a1 - P.a0, D = P.d1 - P.d0;
g.fillStyle = '#c8ccd2';
g.fillRect(-W / 2, -D / 2, W, D);
g.fillStyle = '#e9eef5';
for (let i = 0; i < 140; i++) {
  const x = -W / 2 + e.rnd() * W, y = -D / 2 + e.rnd() * D;
  g.globalAlpha = 0.35 + 0.4 * e.rnd();
  g.beginPath();
  g.ellipse(x, y, 0.8 + e.rnd() * 2.5, 0.25 + e.rnd() * 0.6, 0, 0, Math.PI * 2);
  g.fill();
}
g.globalAlpha = 1;
g.strokeStyle = 'rgba(120,124,132,0.35)';
g.lineWidth = 0.03;
for (let x = -W / 2; x < W / 2; x += 3) {
  g.beginPath();
  g.moveTo(x, -D / 2);
  g.lineTo(x, D / 2);
  g.stroke();
}
// the edge: the white line, the lip's dark joint
g.fillStyle = '#f2f2ec';
g.fillRect(-W / 2, -D / 2 + 0.25, W, 0.15);
g.fillStyle = '#7c7f86';
g.fillRect(-W / 2, -D / 2, W, 0.05);
