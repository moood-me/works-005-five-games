// The platform (a plane, seen from above; metres, y toward the viewer — its far edge, the track's side, at y −6.8):
// grey boards running along it, worn paler where people walk, a few fallen yellow leaves; a pale stone kerb.
const W = 26, D = 6.8, rnd = e.rnd;
g.fillStyle = '#9b938a';
g.fillRect(-W, -D, 2 * W, 2 * D);
for (let y = -D; y < D; y += 0.22) {
  g.fillStyle = `rgba(${110 + (rnd() * 30) | 0},${102 + (rnd() * 26) | 0},${92 + (rnd() * 22) | 0},0.45)`;
  g.fillRect(-W, y, 2 * W, 0.2);
  g.fillStyle = 'rgba(60,54,50,0.35)'; g.fillRect(-W, y + 0.2, 2 * W, 0.02);
  for (let x = -W + rnd() * 3; x < W; x += 2.5 + rnd() * 3) { g.fillRect(x, y, 0.02, 0.2); }
}
g.fillStyle = 'rgba(205,196,180,0.25)';
g.fillRect(-W, -3.6, 2 * W, 2.2);
g.fillStyle = '#c9c0ae'; g.fillRect(-W, -D, 2 * W, 0.35);
g.fillStyle = 'rgba(80,72,64,0.4)'; g.fillRect(-W, -D + 0.35, 2 * W, 0.03);
for (let i = 0; i < 70; i++) {
  const x = -W + rnd() * 2 * W, y = -D + 0.4 + rnd() * 2 * D * 0.6;
  g.fillStyle = ['#c9a14a', '#b8873a', '#d6b65e'][i % 3];
  g.beginPath(); g.ellipse(x, y, 0.07, 0.04, rnd() * 3, 0, Math.PI * 2); g.fill();
}
