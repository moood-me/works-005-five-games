// Through the baker's door: the counter, the shelves, warm
g.fillStyle = '#e2b77c';
g.fillRect(-1.0, -2.6, 2.0, 2.6);
g.fillStyle = '#7a5a3a';
g.fillRect(-1.0, -1.0, 2.0, 1.0);
g.fillStyle = 'rgba(140,90,40,0.6)';
for (const y of [-2.2, -1.7]) for (let x = -0.9; x < 0.9; x += 0.3) {
  g.beginPath();
  g.ellipse(x + 0.12, y, 0.12, 0.07, 0, 0, Math.PI * 2);
  g.fill();
}
