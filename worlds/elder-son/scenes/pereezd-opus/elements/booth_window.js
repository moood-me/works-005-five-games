// The hut's lit window: the one warm light out here. A pane under a lamp, its bars, half a curtain. Metres.
const pane = g.createRadialGradient(0.1, -0.55, 0.05, 0.1, -0.55, 0.7);
pane.addColorStop(0, '#ffd9a0');
pane.addColorStop(0.6, '#f2a95c');
pane.addColorStop(1, '#d9843a');
g.fillStyle = pane;
g.fillRect(-0.39, -0.98, 0.78, 0.98);
// a curtain hanging on the left half
g.fillStyle = '#c96f3a';
g.beginPath();
g.moveTo(-0.39, -0.98);
g.lineTo(-0.05, -0.98);
g.quadraticCurveTo(-0.2, -0.5, -0.3, 0);
g.lineTo(-0.39, 0);
g.closePath();
g.fill();
// the bars
g.fillStyle = '#3a2e25';
g.fillRect(-0.03, -0.98, 0.06, 0.98);
g.fillRect(-0.39, -0.62, 0.78, 0.05);
e.light(0.1, -0.5, 0.7, '#e8963a', 1.5, 'pane');
