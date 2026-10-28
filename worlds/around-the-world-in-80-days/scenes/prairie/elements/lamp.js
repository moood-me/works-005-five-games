// The lamp on the platform: an iron post, a bracket, a square lantern with its four panes, its flame (`flame`: the
// platform's light, lit by `lamps`), snow on its cap.
const { R, P } = e.lib;
R(g, -0.06, -3.0, 0.06, 0.02, '#2a2a2c');
R(g, -0.14, -0.25, 0.14, 0.02, '#2a2a2c');
R(g, -0.2, -3.05, 0.2, -2.98, '#2a2a2c');
R(g, -0.22, -3.55, 0.22, -3.05, '#2a2a2c');
R(g, -0.17, -3.5, 0.17, -3.1, '#f2e2b0');
R(g, -0.015, -3.5, 0.015, -3.1, '#2a2a2c');
P(g, [-0.3, -3.55, 0, -3.8, 0.3, -3.55], '#2a2a2c');
P(g, [-0.24, -3.6, 0, -3.8, 0.24, -3.6, 0, -3.72], '#eef2f6');
e.light(0, -3.3, 0.3, '#ffc27a', 1.0, 'flame');
