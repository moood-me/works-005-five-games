// The land seen from above, draped on the relief: snow everywhere; beyond the tracks a field up to the wood; before
// the platform the slope down to the settlement — its gardens' darker beds under snow, the trodden path from the
// stairs' foot down to the houses. Metres; centre (0, 20); y toward the viewer.
const D0 = 20;
const Y = d => D0 - d;
g.fillStyle = '#e6ecf4';
g.fillRect(-180, -110, 360, 220);
// drifts, a little bluer or whiter
for (let i = 0; i < 260; i++) {
  const a = -170 + e.rnd() * 340, d = -80 + e.rnd() * 200;
  g.fillStyle = i % 3 ? 'rgba(252,253,255,0.6)' : 'rgba(200,212,230,0.5)';
  g.beginPath();
  g.ellipse(a, Y(d), 1 + e.rnd() * 4, 0.3 + e.rnd() * 1.0, (e.rnd() - 0.5) * 0.4, 0, Math.PI * 2);
  g.fill();
}
// the gardens on the slope: beds in rows, the snow over them uneven
for (let i = 0; i < 26; i++) {
  const a = -10 + e.rnd() * 110, d = -50 + e.rnd() * 44, w = 6 + e.rnd() * 8, h = 4 + e.rnd() * 6;
  g.fillStyle = 'rgba(176,184,198,0.35)';
  for (let r = 0; r < h; r += 0.9) g.fillRect(a, Y(d) + r, w, 0.35);
}
// the trodden path from the stairs' foot down the slope to the houses
g.strokeStyle = 'rgba(184,190,200,0.85)';
g.lineCap = 'round';
g.lineWidth = 1.0;
g.beginPath();
g.moveTo(21, Y(6.8));
g.bezierCurveTo(28, Y(4), 32, Y(-4), 40, Y(-10));
g.bezierCurveTo(48, Y(-16), 54, Y(-17), 62, Y(-19));
g.stroke();
// a path along the foot of the platform's bank, to the left
g.lineWidth = 0.7;
g.beginPath();
g.moveTo(21, Y(6.4));
g.bezierCurveTo(16, Y(1), 0, Y(-3), -40, Y(-4));
g.stroke();
