// The bentwood chairs' backs seen across them: the bent hoop over the seat, its inner curl, the back legs. Metres.
g.strokeStyle = '#3e2c20';
g.lineCap = 'round';
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(-0.17, 0);
g.lineTo(-0.16, -0.46);
g.moveTo(0.17, 0);
g.lineTo(0.16, -0.46);
g.moveTo(-0.16, -0.46);
g.bezierCurveTo(-0.2, -0.8, -0.14, -0.97, 0, -0.97);
g.bezierCurveTo(0.14, -0.97, 0.2, -0.8, 0.16, -0.46);
g.stroke();
g.lineWidth = 0.018;
g.beginPath();
g.ellipse(0, -0.72, 0.08, 0.14, 0, 0, Math.PI * 2);
g.stroke();
g.fillStyle = '#5a3f2c';
g.fillRect(-0.2, -0.49, 0.4, 0.045);
