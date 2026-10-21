// The engine seen from ahead (a card across the line at the smokebox's front; its x runs away from the viewer): the
// smokebox's round door, the funnel stack over it, the box headlamp's glass, the cylinders either side, the red beam and
// the pilot's V, the wheels edge-on on the rails.
const { R, P, C } = e.lib;
// the wheels and the frame, edge-on
for (const s of [-1, 1]) {
  R(g, s * 0.72 - 0.07, -1.62, s * 0.72 + 0.07, 0, '#2a2622');
  R(g, s * 0.98 - 0.22, -1.65, s * 0.98 + 0.22, -0.95, '#45556a');
}
R(g, -1.4, -1.95, 1.4, -1.85, '#3a3836');
// the smokebox and its door
C(g, 0, -2.75, 0.8, '#25272b');
C(g, 0, -2.75, 0.62, '#2f3237');
g.strokeStyle = '#4a4e55';
g.lineWidth = 0.05;
g.beginPath();
g.arc(0, -2.75, 0.62, 0, Math.PI * 2);
g.stroke();
C(g, 0, -2.75, 0.07, '#c9a24a');
R(g, -0.45, -2.78, 0.45, -2.72, '#4a4e55');
// the stack
P(g, [-0.22, -3.55, -0.22, -4.05, -0.6, -4.8, 0.6, -4.8, 0.22, -4.05, 0.22, -3.55], '#1f2125');
R(g, -0.65, -4.95, 0.65, -4.78, '#2c2f34');
// the headlamp, its glass
R(g, -0.38, -4.45, 0.38, -3.75, '#2f3a2c');
C(g, 0, -4.1, 0.27, '#f4e4b8');
C(g, 0, -4.1, 0.16, '#fff4d8');
g.strokeStyle = '#c9a24a';
g.lineWidth = 0.04;
g.strokeRect(-0.36, -4.43, 0.72, 0.66);
// the beam and the pilot
R(g, -1.3, -1.5, 1.3, -1.15, '#a3302a');
P(g, [-1.25, -1.15, 1.25, -1.15, 0.15, -0.06, -0.15, -0.06], '#a3302a');
g.strokeStyle = '#6e1f1a';
g.lineWidth = 0.04;
g.beginPath();
for (let x = -1.1; x <= 1.1; x += 0.22) { g.moveTo(x, -1.15); g.lineTo(x * 0.12, -0.06); }
g.stroke();
