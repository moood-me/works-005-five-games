// The ticket booth, shut for the night: green boards, a little dark window with its sign, a door, snow on the roof.
const w = 2.6, h = 2.7;
g.fillStyle = '#3f5a48';
g.fillRect(-w / 2, -h, w, h);
g.strokeStyle = '#30463a';
g.lineWidth = 0.03;
for (let x = -w / 2 + 0.15; x < w / 2; x += 0.15) {
  g.beginPath();
  g.moveTo(x, -h);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = '#1b2026';
g.fillRect(-1.0, -1.75, 0.8, 0.6);
g.fillStyle = '#c9c3b0';
g.fillRect(-1.05, -1.2, 0.9, 0.06);
g.fillStyle = '#2c3d32';
g.fillRect(0.25, -2.05, 0.8, 2.05);
g.fillStyle = '#d8d4c4';
g.fillRect(-1.05, -2.2, 0.9, 0.3);
g.save();
g.translate(-0.6, -2.0);
g.scale(0.01, 0.01);
g.fillStyle = '#2a2a2a';
g.font = 'bold 17px sans-serif';
g.textAlign = 'center';
g.textBaseline = 'middle';
g.fillText(tr('TICKETS'), 0, 0);
g.restore();
g.fillStyle = '#5a5048';
g.fillRect(-w / 2 - 0.15, -h - 0.15, w + 0.3, 0.18);
g.fillStyle = '#e6ecf4';
g.fillRect(-w / 2 - 0.15, -h - 0.28, w + 0.3, 0.14);
