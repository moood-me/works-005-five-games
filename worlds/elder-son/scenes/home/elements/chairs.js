// A bentwood chair seen from its side (the six places at the table): its back on the left (flipped for the far side),
// the round seat, the splayed legs and the ring between them. Metres; the seat's middle at x 0.
g.strokeStyle = '#3e2c20';
g.lineCap = 'round';
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(-0.2, 0);
g.lineTo(-0.17, -0.46);
g.quadraticCurveTo(-0.24, -0.74, -0.2, -0.95);
g.moveTo(0.2, 0);
g.lineTo(0.16, -0.46);
g.moveTo(-0.06, 0);
g.lineTo(-0.05, -0.46);
g.moveTo(0.09, 0);
g.lineTo(0.07, -0.46);
g.stroke();
g.lineWidth = 0.018;
g.beginPath();
g.moveTo(-0.18, -0.18);
g.lineTo(0.18, -0.18);
g.moveTo(-0.2, -0.95);
g.quadraticCurveTo(-0.26, -0.82, -0.18, -0.62);
g.stroke();
g.fillStyle = '#5a3f2c';
g.fillRect(-0.21, -0.49, 0.42, 0.045);
