// The track (a plane, seen from above; metres, y toward the viewer): grey-brown ballast, dark sleepers, two rails —
// the far one at y −0.76, the near one at +0.76 (1.52 m apart, the Russian gauge). 640 m long.
const W = 320, D = 1.8, rnd = e.rnd;
g.fillStyle = '#6e665e';
g.fillRect(-W, -D, 2 * W, 2 * D);
g.fillStyle = 'rgba(150,140,128,0.35)';
for (let i = 0; i < 500; i++) { const x = -W + rnd() * 2 * W, y = -D + rnd() * 2 * D; g.fillRect(x, y, 0.1 + rnd() * 0.4, 0.05 + rnd() * 0.12); }
g.fillStyle = '#4a3c32';
for (let x = -W; x < W; x += 0.78) g.fillRect(x, -1.35, 0.22, 2.7);
for (const y of [-0.76, 0.76]) {
  g.fillStyle = '#3c3a38'; g.fillRect(-W, y - 0.05, 2 * W, 0.1);
  g.fillStyle = '#b9b6b2'; g.fillRect(-W, y - 0.02, 2 * W, 0.035);
}
