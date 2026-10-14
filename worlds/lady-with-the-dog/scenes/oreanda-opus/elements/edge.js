// The lip of the cliff straight across before them: a ragged line of rock, low bushes and dry grass against the
// sea far below. A long card (x −17…13.5 m about its anchor), its foot on the land; the grass sways.
const rnd = e.rnd;
// rock and earth of the lip
g.fillStyle = '#8f8a78';
g.beginPath();
g.moveTo(-17, 0.35);
for (let x = -17; x <= 13.5; x += 0.35) g.lineTo(x, -0.12 - 0.22 * rnd() - 0.12 * Math.sin(x * 0.9) ** 2);
g.lineTo(13.5, 0.35);
g.closePath();
g.fill();
g.fillStyle = '#b2ab98';
for (let i = 0; i < 70; i++) {
  const x = -17 + rnd() * 30.5, r = 0.08 + rnd() * 0.22;
  g.beginPath(); g.ellipse(x, -0.08 - rnd() * 0.12, r, r * 0.6, 0, 0, Math.PI * 2); g.fill();
}
// low bushes (juniper, wild pistachio): rounded clumps of dull green
const greens = ['#5f6750', '#6c7259', '#56604c', '#737a60'];
for (let i = 0; i < 34; i++) {
  const x = -17 + rnd() * 30.5, h = 0.25 + rnd() ** 1.5 * 0.75, w = h * (1 + rnd());
  g.fillStyle = greens[i % 4];
  for (let k = 0; k < 5; k++) {
    g.beginPath();
    g.ellipse(x + (rnd() - 0.5) * w, -h * (0.35 + 0.5 * rnd()), w * (0.3 + 0.25 * rnd()), h * (0.35 + 0.2 * rnd()), 0, 0, Math.PI * 2);
    g.fill();
  }
}
// dry grass on the lip, in the wind
e.layer('grass', { wind: { strength: 0.25, gust: 0.4, scale: 4 }, pivot: [0, -0.1] }, gg => {
  gg.lineCap = 'round';
  for (let i = 0; i < 520; i++) {
    const x = -17 + rnd() * 30.5, l = 0.12 + rnd() * 0.4, b = (rnd() - 0.5) * 0.25;
    gg.strokeStyle = i % 3 ? '#c5b98f' : '#9c9473';
    gg.lineWidth = 0.012 + rnd() * 0.012;
    gg.beginPath(); gg.moveTo(x, -0.1); gg.quadraticCurveTo(x + b * 0.4, -0.1 - l * 0.6, x + b, -0.1 - l); gg.stroke();
  }
});
