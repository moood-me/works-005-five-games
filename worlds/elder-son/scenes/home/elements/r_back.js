// The room's back wall: faded wallpaper; over the sofa a dark red wall rug, left of it a photograph in a frame.
// Metres; 4 wide, x = the plan's x − 6.
e.lib.roomWall(g, e, 4);
g.fillStyle = '#6a2b27';
g.fillRect(-0.3, -1.9, 1.75, 0.95);
g.strokeStyle = '#b48a52';
g.lineWidth = 0.035;
g.strokeRect(-0.24, -1.84, 1.63, 0.83);
g.strokeStyle = 'rgba(200,170,110,0.5)';
g.lineWidth = 0.02;
for (let i = 0; i < 5; i++) {
  g.beginPath();
  g.ellipse(0.575, -1.425, 0.15 + i * 0.12, 0.08 + i * 0.065, 0, 0, Math.PI * 2);
  g.stroke();
}
g.fillStyle = '#3a2c22';
g.fillRect(-1.25, -1.95, 0.42, 0.52);
g.fillStyle = '#b8ab94';
g.fillRect(-1.2, -1.9, 0.32, 0.42);
g.fillStyle = '#6d6252';
g.beginPath();
g.ellipse(-1.04, -1.74, 0.07, 0.09, 0, 0, Math.PI * 2);
g.fill();
g.fillRect(-1.12, -1.66, 0.16, 0.18);
