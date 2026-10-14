// The far edge of the field: a low line of woods all along the horizon. Metres, 2200 wide.
g.fillStyle = '#2b3836';
g.beginPath();
g.moveTo(-1100, 0.4);
let x = -1100;
while (x < 1100) {
  const h = 8 + e.rnd() * 10 + 6 * Math.max(0, Math.sin(x * 0.004 + 1));
  g.lineTo(x, -h * 0.7);
  g.lineTo(x + 2.5, -h);
  g.lineTo(x + 5, -h * 0.7);
  x += 5 + e.rnd() * 9;
}
g.lineTo(1100, 0.4);
g.closePath();
g.fill();
