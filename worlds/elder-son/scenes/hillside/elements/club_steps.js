// the club's steps from above: trodden boards, snow on their edges
g.fillStyle = '#7a6a58';
g.fillRect(-0.75, -0.7, 1.5, 1.4);
g.strokeStyle = 'rgba(40,30,22,0.5)';
g.lineWidth = 0.03;
for (let y = -0.7; y < 0.7; y += 0.35) {
  g.beginPath();
  g.moveTo(-0.75, y);
  g.lineTo(0.75, y);
  g.stroke();
}
