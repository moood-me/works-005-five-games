// The hall, seen through the window beside the door (and through the door when it opens): grey-green walls,
// the stair going up at the back, the long-case clock, the gas bracket — lit as `win_hall` says.
const L = e.lib;
const [y0, y1] = [L.plan.floors[0], L.plan.floors[1]];
L.room(g, -3.6, 3.6, y0, y1, '#8e968f');
// the stair's string rising along the back wall, in walnut, the door to the back rooms under it
g.fillStyle = '#3a2c22';
g.beginPath();
g.moveTo(-3.6, -y0 - 0.3);
g.lineTo(0.2, -y1 + 0.2);
g.lineTo(0.2, -y1 + 0.42);
g.lineTo(-3.6, -y0 - 0.08);
g.closePath();
g.fill();
// its handrail and a few balusters
g.strokeStyle = '#3a2c22';
g.lineWidth = 0.05;
g.beginPath();
g.moveTo(-3.6, -y0 - 1.2);
g.lineTo(0.2, -y1 + 1.1);
g.stroke();
g.lineWidth = 0.025;
for (let k = 1; k < 9; k++) {
  const x = -3.6 + 3.8 * k / 9, yb = -y0 - 0.3 + (-(y1 - 0.2) + y0 + 0.3) * k / 9, yt = -y0 - 1.2 + (-(y1 - 1.1) + y0 + 1.2) * k / 9;
  g.beginPath();
  g.moveTo(x, yb);
  g.lineTo(x, yt);
  g.stroke();
}
g.fillStyle = '#3a342e';
g.fillRect(-2.9, -y0 - 2.2, 0.9, 2.2);
// the long-case clock
g.fillStyle = '#3a2a20';
g.fillRect(2.0, -y0 - 2.25, 0.42, 2.25);
L.clock(g, 2.21, -y0 - 1.95, 0.16, 7.83);
L.bracket(e, g, 0.8, -y0 - 2.1, 'lamp');
e.at(L.plan.windows.win_hall[0], -2.75);
