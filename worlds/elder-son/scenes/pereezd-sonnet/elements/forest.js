// The far forest: a dark ragged band of firs where the rails bend away.
g.fillStyle = '#0b1122';
g.beginPath();
g.moveTo(-80, 1);
for (let x = -80; x <= 80; x += 2.4) {
  const h = 9 + 7 * e.rnd() + 4 * Math.sin(x * 0.07);
  g.lineTo(x - 1.1, -h * 0.55); g.lineTo(x, -h); g.lineTo(x + 1.1, -h * 0.55);
}
g.lineTo(80, 1);
g.closePath(); g.fill();
