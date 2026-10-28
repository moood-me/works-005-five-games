// The flight down from the platform, from above: concrete steps, snow trodden on their middle. Laid as a slope
// (rotation 90, tilt): x across the flight, y down it toward its foot.
const W = 2.5, D = 5.6, n = 18;
g.fillStyle = '#b3b7be';
g.fillRect(-W / 2, -D / 2, W, D);
for (let i = 0; i <= n; i++) {
  const y = -D / 2 + (i * D) / n;
  g.fillStyle = '#80848c';
  g.fillRect(-W / 2, y, W, 0.05);
  g.fillStyle = 'rgba(236,241,248,0.85)';
  g.fillRect(-W / 2, y + 0.06, 0.45, 0.12);
  g.fillRect(W / 2 - 0.45, y + 0.06, 0.45, 0.12);
}
