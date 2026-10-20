// the club's porch landing from above: grey boards, snow swept to its sides
g.fillStyle = '#7a6a58';
g.fillRect(-1.2, -0.6, 2.4, 1.2);
g.strokeStyle = 'rgba(40,30,22,0.5)';
g.lineWidth = 0.02;
for (let x = -1.2; x < 1.2; x += 0.16) {
  g.beginPath();
  g.moveTo(x, -0.6);
  g.lineTo(x, 0.6);
  g.stroke();
}
