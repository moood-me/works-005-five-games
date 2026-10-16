// The summer screen at the far end of the chairs: a sheet on two masts with stays, the film on it (`screen_film`,
// a frame of an old black-and-white film). Only while `screen_up`. The shader makes it shine and flicker with the beam.
if (!e.state.screen_up) return;
const P = e.lib, W = e.lib.G.SCREEN_HALF;
g.strokeStyle = '#3b3027'; g.lineWidth = 0.03;
g.beginPath(); g.moveTo(-3.85, -6.0); g.lineTo(-5.6, 0); g.moveTo(3.85, -6.0); g.lineTo(5.6, 0); g.stroke();
g.fillStyle = '#4a3a2c'; g.fillRect(-3.95, -6.1, 0.17, 6.1); g.fillRect(3.78, -6.1, 0.17, 6.1);
g.fillRect(-3.95, -5.62, 7.9, 0.1);
g.fillStyle = '#e9e5da'; g.fillRect(-W, -5.4, 2 * W, 4.0);
g.fillStyle = '#1c1b1a'; g.fillRect(-W, -5.4, 2 * W, 0.06); g.fillRect(-W, -1.46, 2 * W, 0.06);
const f = e.state.screen_film || 'romance';
if (f !== 'none') e.kit.cinema.frame(g, f, -W + 0.12, -5.3, 2 * W - 0.24, 3.8);
e.at(0, -3.4, 'screen');
