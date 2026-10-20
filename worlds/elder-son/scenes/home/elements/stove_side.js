// The stove's sides (near and far): whitewash over brick, a niche with firewood low down. Metres; 0.75 wide.
g.fillStyle = '#e1dacb';
g.fillRect(-0.375, -2.0, 0.75, 2.02);
g.strokeStyle = 'rgba(150,138,118,0.25)';
g.lineWidth = 0.008;
for (let y = -0.075; y > -2; y -= 0.075) {
  g.beginPath();
  g.moveTo(-0.375, y);
  g.lineTo(0.375, y);
  g.stroke();
}
g.fillStyle = '#d6cdbb';
g.fillRect(-0.375, -2.04, 0.75, 0.06);
g.fillStyle = '#3e3028';
g.fillRect(-0.25, -0.45, 0.5, 0.35);
g.fillStyle = '#8a6a4c';
for (const [x, y] of [[-0.15, -0.17], [0, -0.17], [0.15, -0.17], [-0.08, -0.29], [0.08, -0.29], [0, -0.4]]) {
  g.beginPath();
  g.arc(x, y, 0.055, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#c9b294';
for (const [x, y] of [[-0.15, -0.17], [0, -0.17], [0.15, -0.17], [-0.08, -0.29], [0.08, -0.29], [0, -0.4]]) {
  g.beginPath();
  g.arc(x, y, 0.03, 0, Math.PI * 2);
  g.fill();
}
