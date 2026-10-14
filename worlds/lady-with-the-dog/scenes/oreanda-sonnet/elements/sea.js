g.fillStyle = '#4c5b84';
g.fillRect(-6000, -20000, 12000, 20800);
for (let i = 0; i < 900; i++) {
  const t = e.rnd();
  const y = -20000 * t * t * t + 600 * (1 - t);
  const sc = 1 + Math.abs(y) / 40;
  const x = (e.rnd() - 0.5) * 1800 * Math.min(8, sc / 3 + 1);
  const len = (10 + e.rnd() * 50) * Math.min(sc, 30);
  g.strokeStyle = e.rnd() < 0.5 ? 'rgba(200,205,230,0.35)' : 'rgba(40,52,88,0.4)';
  g.lineWidth = 0.8 * Math.min(sc, 12);
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + len, y);
  g.stroke();
}
