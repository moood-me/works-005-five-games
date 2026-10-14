const white = '#f4f1ea', shade = '#d9d3c6';
e.layer('lie', { box: [-0.8, -0.5, 0.9, 0.05] }, g => {
  g.fillStyle = white; g.beginPath(); g.ellipse(0, -0.17, 0.26, 0.17, 0, 0, 7); g.fill();
  g.fillStyle = shade; g.beginPath(); g.ellipse(0.04, -0.07, 0.2, 0.07, 0, 0, 7); g.fill();
  g.fillStyle = white; g.beginPath(); g.ellipse(-0.24, -0.26, 0.11, 0.1, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-0.3, -0.3); g.lineTo(-0.28, -0.4); g.lineTo(-0.22, -0.32); g.fill();
  g.beginPath(); g.ellipse(0.22, -0.3, 0.1, 0.09, 0, 0, 7); g.fill();
  g.strokeStyle = '#a8322c'; g.lineWidth = 0.03; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-0.17, -0.2); g.quadraticCurveTo(-0.5, -0.05, -0.75, -0.02); g.stroke();
});
e.layer('stand', { box: [-0.8, -0.5, 0.9, 0.05] }, g => {
  g.fillStyle = white; g.beginPath(); g.ellipse(0, -0.26, 0.25, 0.17, 0, 0, 7); g.fill();
  g.fillRect(-0.15, -0.14, 0.06, 0.14); g.fillRect(0.1, -0.14, 0.06, 0.14);
  g.beginPath(); g.ellipse(-0.25, -0.38, 0.1, 0.09, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-0.3, -0.43); g.lineTo(-0.28, -0.52); g.lineTo(-0.21, -0.45); g.fill();
  g.beginPath(); g.ellipse(0.23, -0.4, 0.1, 0.09, 0, 0, 7); g.fill();
  g.strokeStyle = '#a8322c'; g.lineWidth = 0.03; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-0.18, -0.32); g.quadraticCurveTo(-0.5, -0.1, -0.75, -0.02); g.stroke();
});
e.at(-0.26, -0.3, 'spitz'); e.at(-0.18, -0.2, 'collar');
