g.fillStyle = '#56655d';
g.fillRect(-30, -6, 60, 12);
g.fillStyle = '#6c7168';
g.beginPath();
g.moveTo(-2.4, -6);
g.lineTo(-1.2, -6);
g.lineTo(0.6, 1.2);
g.lineTo(-1.0, 6);
g.lineTo(-2.4, 6);
g.closePath();
g.fill();
for (let i = 0; i < 700; i++) {
  const x = (e.rnd() - 0.5) * 40;
  const y = (e.rnd() - 0.5) * 12;
  g.strokeStyle = e.rnd() < 0.5 ? '#3f4d46' : '#7b8c7f';
  g.lineWidth = 0.03;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + (e.rnd() - 0.5) * 0.15, y - 0.12 - e.rnd() * 0.15);
  g.stroke();
}
