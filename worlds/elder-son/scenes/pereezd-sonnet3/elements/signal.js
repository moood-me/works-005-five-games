g.fillStyle = '#9aa3b8'; g.fillRect(-0.07, -3.7, 0.14, 3.7);
for (let i = -1; i <= 1; i += 2) {
  g.save(); g.translate(0, -2.35); g.rotate(i * 0.62);
  g.fillStyle = '#e6eaf3'; g.fillRect(-0.7, -0.07, 1.4, 0.14);
  g.restore();
}
g.fillStyle = '#272c3b'; g.fillRect(-0.55, -3.65, 1.1, 0.55);
g.fillStyle = '#5a1f25';
g.beginPath(); g.arc(-0.24, -3.38, 0.15, 0, 6.2832); g.fill();
g.beginPath(); g.arc(0.24, -3.38, 0.15, 0, 6.2832); g.fill();
e.light(-0.24, -3.38, 0.45, '#ff4538', 1.0, 'a');
e.light(0.24, -3.38, 0.45, '#ff4538', 1.0, 'b');
