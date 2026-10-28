// The steppe beyond the line (a plane, seen from above; metres, y toward the viewer — its near edge y +400 is by the
// track): dry olive and straw grass in long streaks, greener weeds along the bank.
const W = 750, D = 400, rnd = e.rnd;
g.fillStyle = '#8b8460';
g.fillRect(-W, -D, 2 * W, 2 * D);
for (let i = 0; i < 700; i++) {
  const x = -W + rnd() * 2 * W, y = -D + rnd() ** 0.6 * 2 * D;
  const near = (y + D) / (2 * D);
  g.fillStyle = ['rgba(150,140,92,0.45)', 'rgba(110,108,70,0.4)', 'rgba(178,158,104,0.4)', 'rgba(126,122,92,0.35)'][i % 4];
  g.beginPath(); g.ellipse(x, y, (4 + rnd() * 26) * (1.2 - near), 0.4 + rnd() * 2.5 * (1.2 - near), 0, 0, Math.PI * 2); g.fill();
}
// weeds and late flowers along the bank, near the track
for (let i = 0; i < 400; i++) {
  const x = -W + rnd() * 2 * W, y = D - rnd() * 6;
  g.fillStyle = rnd() < 0.85 ? 'rgba(96,104,64,0.6)' : 'rgba(220,210,170,0.7)';
  g.beginPath(); g.ellipse(x, y, 0.15 + rnd() * 0.5, 0.08 + rnd() * 0.25, 0, 0, Math.PI * 2); g.fill();
}
