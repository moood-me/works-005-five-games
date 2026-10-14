g.fillStyle = '#8a765f';
g.fillRect(-1, -0.25, 2, 0.5);
g.strokeStyle = '#6a5848';
g.lineWidth = 0.02;
for (const y of [-0.08, 0.09]) {
  g.beginPath();
  g.moveTo(-1, y);
  g.lineTo(1, y);
  g.stroke();
}
