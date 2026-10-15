// The porch's landing from above: grey boards, snow swept to its sides. Metres; 1.6 × 1.05.
g.fillStyle = '#7a6a58';
g.fillRect(-0.8, -0.53, 1.6, 1.06);
g.strokeStyle = 'rgba(40,30,22,0.5)';
g.lineWidth = 0.02;
for (let x = -0.8; x < 0.8; x += 0.16) {
  g.beginPath();
  g.moveTo(x, -0.53);
  g.lineTo(x, 0.53);
  g.stroke();
}
g.fillStyle = '#e6ecf4';
g.fillRect(-0.8, -0.53, 0.25, 1.06);
g.fillRect(0.6, -0.53, 0.2, 1.06);
