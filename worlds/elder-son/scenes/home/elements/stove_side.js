// The stove's near side: whitewash, a niche with firewood.
g.fillStyle = '#ddd6c7';
g.fillRect(-0.375, -2.0, 0.75, 2.02);
g.fillStyle = '#4a3a2e';
g.fillRect(-0.25, -0.45, 0.5, 0.35);
g.fillStyle = '#8a6a4c';
for (const [x, y] of [[-0.15, -0.18], [0, -0.18], [0.15, -0.18], [-0.08, -0.3], [0.08, -0.3]]) {
  g.beginPath();
  g.arc(x, y, 0.06, 0, Math.PI * 2);
  g.fill();
}
