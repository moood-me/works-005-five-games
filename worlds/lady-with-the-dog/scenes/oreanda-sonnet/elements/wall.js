g.fillStyle = '#ebe8ee';
g.fillRect(-2.5, -3.2, 5, 3.2);
g.fillStyle = '#b9b6c6';
g.fillRect(-2.5, -0.5, 5, 0.5);
g.fillStyle = '#d6d1dc';
g.fillRect(-2.55, -3.35, 5.1, 0.2);
g.fillStyle = '#dedbe6';
g.fillRect(2.2, -3.2, 0.3, 3.2);
for (const x of [-1.3, 0.9]) {
  g.fillStyle = '#434d70';
  g.beginPath();
  g.moveTo(x - 0.35, -1.1);
  g.lineTo(x - 0.35, -2.2);
  g.arc(x, -2.2, 0.35, Math.PI, 0);
  g.lineTo(x + 0.35, -1.1);
  g.closePath();
  g.fill();
  g.strokeStyle = '#f5f2f4';
  g.lineWidth = 0.07;
  g.stroke();
}
for (let i = 0; i < 60; i++) {
  g.fillStyle = 'rgba(150,146,170,0.12)';
  g.fillRect(-2.5 + e.rnd() * 5, -3.2 + e.rnd() * 2.7, 0.2 + e.rnd() * 0.5, 0.03);
}
