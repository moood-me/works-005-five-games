g.fillStyle = '#4c5b84';
g.fillRect(-2000, -500, 4000, 1000);
for (let i = 0; i < 1200; i++) {
  const t = e.rnd();
  const y = -500 + 500 * Math.pow(t, 0.35);
  const near = (y + 500) / 500;
  const x = (e.rnd() - 0.5) * 4000;
  const len = 8 + e.rnd() * 60 * (0.3 + near);
  g.strokeStyle = e.rnd() < 0.5 ? 'rgba(205,208,232,0.4)' : 'rgba(40,52,88,0.4)';
  g.lineWidth = 0.6 + near * 3;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + len, y);
  g.stroke();
}
