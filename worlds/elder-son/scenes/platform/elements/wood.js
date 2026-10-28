// The wood beyond the field: dark spruces, their tops ragged against the sky, snow on the near ones' lower boughs.
const len = 600;
g.fillStyle = '#1c2324';
g.beginPath();
g.moveTo(-len / 2, 0.3);
for (let x = -len / 2; x <= len / 2; x += 2.2) {
  const h = 5.5 + 3.5 * e.rnd() + 1.5 * Math.sin(x * 0.02);
  g.lineTo(x - 1.0, -h * 0.55);
  g.lineTo(x, -h);
  g.lineTo(x + 1.0, -h * 0.55);
}
g.lineTo(len / 2, 0.3);
g.closePath();
g.fill();
g.fillStyle = 'rgba(214,222,232,0.35)';
for (let i = 0; i < 300; i++) g.fillRect(-len / 2 + e.rnd() * len, -e.rnd() * 6, 0.9, 0.12);
