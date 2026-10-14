// огни посёлка далеко слева за путями: тёмные избы и несколько тёплых окон
let x = -64;
const wins = [];
while (x < 60) {
  const w = 4 + e.rnd() * 5, h = 2.2 + e.rnd() * 1.6, y = -(e.rnd() * 1.2);
  g.fillStyle = '#121b2c'; g.fillRect(x, y - h, w, h + 1);
  g.beginPath(); g.moveTo(x - 0.3, y - h); g.lineTo(x + w / 2, y - h - 1.5 - e.rnd()); g.lineTo(x + w + 0.3, y - h); g.closePath(); g.fill();
  g.fillStyle = '#c9d6ea'; g.fillRect(x - 0.1, y - h - 0.05, w + 0.2, 0.18);  // снег на крыше
  if (e.rnd() < 0.4) wins.push([x + w * (0.25 + 0.5 * e.rnd()), y - h * 0.5]);
  x += w + 1.5 + e.rnd() * 5;
}
for (const [wx, wy] of wins) {
  g.fillStyle = '#e8963a'; g.fillRect(wx - 0.3, wy - 0.25, 0.6, 0.5);
  e.light(wx, wy, 1.4, '#e8963a', 0.8);
}
