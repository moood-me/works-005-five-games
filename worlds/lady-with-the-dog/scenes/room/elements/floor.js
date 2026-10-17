// The floor: worn boards running away from us, a small faded rug before the bed (a plane from above; metres, y toward
// the viewer; the back wall at y −3.15).
const rnd = e.rnd;
g.fillStyle = '#7d6148'; g.fillRect(-2.7, -3.15, 5.4, 6.3);
for (let x = -2.7; x < 2.7; x += 0.16) {
  g.fillStyle = `rgba(${90 + (rnd() * 30) | 0},${68 + (rnd() * 20) | 0},${48 + (rnd() * 14) | 0},0.6)`;
  g.fillRect(x, -3.15, 0.15, 6.3);
  g.fillStyle = 'rgba(40,28,20,0.5)'; g.fillRect(x + 0.15, -3.15, 0.01, 6.3);
  for (let y = -3.15 + rnd() * 2; y < 3.15; y += 1.5 + rnd() * 1.5) g.fillRect(x, y, 0.15, 0.01);
}
// the rug before the bed: muted blue-grey with a pale border
g.fillStyle = '#8b8fa0'; g.fillRect(-2.4, -1.25, 1.9, 1.0);
g.strokeStyle = '#c9c2b0'; g.lineWidth = 0.05; g.strokeRect(-2.32, -1.17, 1.74, 0.84);
g.strokeStyle = 'rgba(80,70,90,0.5)'; g.lineWidth = 0.02; g.strokeRect(-2.2, -1.05, 1.5, 0.6);
