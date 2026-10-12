// The temple's sanctum, its front behind the porch: a dark arched door, a small lamp burning inside.
const [w, h] = e.lib.plan.temple.cella;
e.lib.stone(g, -w, w, -h);
g.fillStyle = '#1c1612';
g.beginPath();
g.moveTo(-0.5, 0);
g.lineTo(-0.5, -1.7);
g.quadraticCurveTo(0, -2.1, 0.5, -1.7);
g.lineTo(0.5, 0);
g.closePath();
g.fill();
e.light(0, -0.5, 0.4, '#ffb060', 0.6, 'lamp');
e.at(0, -1.2, 'pagoda');
