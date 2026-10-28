// The station's east end (a card across the line; its x runs away from the viewer): the same ochre boards up to the
// gable under the roof's two slopes, a small window, a stovepipe over the ridge.
const { R, P } = e.lib;
P(g, [0, 0.05, 0, -4.4, 2.8, -6.25, 5.6, -4.4, 5.6, 0.05], '#a9824c');
g.strokeStyle = '#94703f';
g.lineWidth = 0.05;
g.beginPath();
for (let x = 0.2; x < 5.6; x += 0.4) { g.moveTo(x, 0); g.lineTo(x, -4.4 - 1.85 * (1 - Math.abs(x - 2.8) / 2.8)); }
g.stroke();
P(g, [-0.2, -4.3, 2.8, -6.35, 5.8, -4.3, 5.8, -4.12, 2.8, -6.17, -0.2, -4.12], '#5a3e28');
R(g, 0, -0.35, 5.6, 0.05, '#5a3e28');
R(g, 2.3, -3.0, 3.3, -1.4, '#5a3e28');
R(g, 2.4, -2.92, 3.2, -1.5, '#3a4656');
R(g, 2.6, -7.1, 2.85, -6.1, '#2a2826');
