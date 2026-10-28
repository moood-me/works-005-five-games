// The water tank for the engines: a wooden tub hooped with iron on a trestle of posts, a conical roof under snow, the
// spout folded up beside it.
const { R, P } = e.lib;
for (const x of [-2.6, -0.9, 0.9, 2.6]) R(g, x - 0.15, -4.7, x + 0.15, 0.05, '#5e4c3a');
g.strokeStyle = '#4e3e2e';
g.lineWidth = 0.12;
g.beginPath();
g.moveTo(-2.6, -0.4); g.lineTo(-0.9, -4.4); g.moveTo(-0.9, -0.4); g.lineTo(-2.6, -4.4);
g.moveTo(0.9, -0.4); g.lineTo(2.6, -4.4); g.moveTo(2.6, -0.4); g.lineTo(0.9, -4.4);
g.stroke();
R(g, -3.1, -4.85, 3.1, -4.6, '#4e3e2e');
R(g, -3.0, -9.0, 3.0, -4.85, '#6e4e36');
g.strokeStyle = '#4e4a46';
g.lineWidth = 0.07;
g.beginPath();
for (const y of [-8.4, -7.4, -6.4, -5.4]) { g.moveTo(-3.0, y); g.lineTo(3.0, y); }
g.stroke();
g.strokeStyle = '#5e4232';
g.lineWidth = 0.03;
g.beginPath();
for (let x = -2.8; x < 3; x += 0.32) { g.moveTo(x, -9.0); g.lineTo(x, -4.85); }
g.stroke();
P(g, [-3.25, -9.0, 0, -9.6, 3.25, -9.0], '#5a524a');
P(g, [-3.25, -9.0, 0, -9.6, 3.25, -9.0, 2.2, -9.05, 0, -9.42, -2.2, -9.05], '#eef2f6');
R(g, 3.0, -6.2, 3.55, -5.95, '#4e3e2e');
R(g, 3.35, -8.6, 3.55, -5.95, '#4e3e2e');
