// The tavern's left end wall (x toward the quay): boards up into the gable.
const T = e.lib.plan.tavern;
g.fillStyle = '#4e3c2c';
g.beginPath();
g.moveTo(-T.deep, 1.6);
g.lineTo(-T.deep, -T.wall);
g.lineTo(-T.deep / 2, -T.ridge);
g.lineTo(0, -T.wall);
g.lineTo(0, 1.6);
g.closePath();
g.fill();
