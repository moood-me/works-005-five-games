g.fillStyle = '#2b2f33'; g.fillRect(-0.35, -0.46, 0.65, 0.46);
g.fillStyle = '#46505a'; g.fillRect(-0.35, -0.46, 0.65, 0.05);
g.fillStyle = '#1d1f22'; g.fillRect(0.3, -0.34, 0.2, 0.15);
g.fillStyle = '#cfe0ff'; g.fillRect(0.47, -0.32, 0.04, 0.11);
for (const rx of [-0.1, 0.16]) {
  g.fillStyle = '#3a4048'; g.beginPath(); g.arc(rx, -0.64, 0.17, 0, 6.28); g.fill();
  g.fillStyle = '#16181a'; g.beginPath(); g.arc(rx, -0.64, 0.06, 0, 6.28); g.fill();
  g.strokeStyle = '#16181a'; g.lineWidth = 0.025;
  for (let k = 0; k < 3; k++) { const a = k * 2.094; g.beginPath(); g.moveTo(rx, -0.64); g.lineTo(rx + Math.cos(a) * 0.15, -0.64 + Math.sin(a) * 0.15); g.stroke(); }
}
e.layer('tarp', { box: [-0.7, -1.2, 0.8, 0.1], pivot: [0, 0] }, g => {
  g.fillStyle = '#4e4d3d';
  g.beginPath(); g.moveTo(-0.48, 0); g.bezierCurveTo(-0.5, -0.5, -0.4, -0.95, 0.02, -0.92); g.bezierCurveTo(0.4, -0.9, 0.5, -0.5, 0.56, 0); g.closePath(); g.fill();
  g.strokeStyle = '#34332a'; g.lineWidth = 0.025;
  for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-0.3 + i * 0.18, -0.85 + (i % 2) * 0.04); g.lineTo(-0.38 + i * 0.2, 0); g.stroke(); }
});
e.at(0, -0.5);
e.at(0.5, -0.27, 'lens');
