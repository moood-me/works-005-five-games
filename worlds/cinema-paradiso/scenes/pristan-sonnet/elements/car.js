const k = e.state.car;
if (k === 'old') {
  g.fillStyle = '#17171b';
  g.beginPath(); g.moveTo(-0.95, 0); g.lineTo(-0.95, -0.7); g.quadraticCurveTo(-0.9, -1.0, -0.6, -1.12); g.quadraticCurveTo(0, -1.45, 0.6, -1.12); g.quadraticCurveTo(0.9, -1.0, 0.95, -0.7); g.lineTo(0.95, 0); g.closePath(); g.fill();
  g.fillStyle = '#2c3140'; g.beginPath(); g.moveTo(-0.5, -1.0); g.quadraticCurveTo(0, -1.28, 0.5, -1.0); g.lineTo(0.42, -0.78); g.lineTo(-0.42, -0.78); g.closePath(); g.fill();
  g.fillStyle = '#9ea4a8'; g.fillRect(-1.0, -0.28, 2.0, 0.08);
  g.fillStyle = '#c4322d';
  for (const sx of [-0.75, 0.75]) { g.beginPath(); g.ellipse(sx, -0.55, 0.1, 0.07, 0, 0, 6.28); g.fill(); }
  e.light(-0.75, -0.55, 0.9, '#ff3a2a', 0.5, 'tail'); e.light(0.75, -0.55, 0.9, '#ff3a2a', 0.5, 'tail2');
} else if (k === 'new') {
  g.fillStyle = '#8e939b';
  g.beginPath(); g.moveTo(-0.92, 0); g.lineTo(-0.92, -0.85); g.lineTo(-0.7, -1.2); g.lineTo(0.7, -1.2); g.lineTo(0.92, -0.85); g.lineTo(0.92, 0); g.closePath(); g.fill();
  g.fillStyle = '#242a34'; g.fillRect(-0.62, -1.12, 1.24, 0.42);
  g.fillStyle = '#3a3d44'; g.fillRect(-0.95, -0.26, 1.9, 0.12);
  g.fillStyle = '#d02a24';
  g.fillRect(-0.9, -0.7, 0.35, 0.14); g.fillRect(0.55, -0.7, 0.35, 0.14);
  e.light(-0.72, -0.63, 0.9, '#ff3a2a', 0.5, 'tail'); e.light(0.72, -0.63, 0.9, '#ff3a2a', 0.5, 'tail2');
}
e.at(0, -0.9, 'car');
