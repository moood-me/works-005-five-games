g.fillStyle = '#66766b';
g.fillRect(-30, -6, 60, 12);
g.fillStyle = '#8a8a80';
g.beginPath();
g.moveTo(-2.4, -6);
g.lineTo(-1.2, -6);
g.lineTo(0.6, 1.2);
g.lineTo(-1.0, 6);
g.lineTo(-2.4, 6);
g.closePath();
g.fill();
for (let i = 0; i < 450; i++) {
  const x = (e.rnd() - 0.5) * 40;
  const y = (e.rnd() - 0.5) * 12;
  g.strokeStyle = e.rnd() < 0.5 ? '#54655a' : '#8a9b8c';
  g.lineWidth = 0.02;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + (e.rnd() - 0.5) * 0.15, y - 0.06 - e.rnd() * 0.08);
  g.stroke();
}
