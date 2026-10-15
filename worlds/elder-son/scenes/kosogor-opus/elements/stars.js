// A painted iron obelisk over a grave, a little red star on its top, a rail round its foot.
g.fillStyle = '#7d8a8c';
g.beginPath();
g.moveTo(-0.16, 0);
g.lineTo(-0.1, -1.25);
g.lineTo(0, -1.38);
g.lineTo(0.1, -1.25);
g.lineTo(0.16, 0);
g.closePath();
g.fill();
g.fillStyle = '#a3302a';
g.beginPath();
for (let i = 0; i < 10; i++) {
  const r = i % 2 ? 0.035 : 0.085, a = -Math.PI / 2 + (i * Math.PI) / 5;
  const x = Math.cos(a) * r, y = -1.47 + Math.sin(a) * r;
  if (i) g.lineTo(x, y);
  else g.moveTo(x, y);
}
g.closePath();
g.fill();
g.fillStyle = '#e6ebf3';
g.fillRect(-0.12, -1.27, 0.24, 0.025);
e.kit.izby.drift(g, e, -0.3, 0.3, 0.2);
