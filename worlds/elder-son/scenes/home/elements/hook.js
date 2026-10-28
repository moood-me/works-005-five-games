// The hooks by the door (a board on the wall); Busygin's long grey coat hangs on one when `coat_b` is hook, Nina's
// coat with its fur collar beside it when she is at home (`nina_coat`). Its point: coat. Metres.
g.fillStyle = '#4a3a2c';
g.fillRect(-0.18, -1.82, 0.36, 0.06);
g.fillStyle = '#2a2420';
for (const x of [-0.1, 0.1]) g.fillRect(x - 0.012, -1.78, 0.024, 0.08);
const coat = (x, body, collar, long) => {
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(x - 0.08, -1.72);
  g.lineTo(x + 0.08, -1.72);
  g.quadraticCurveTo(x + 0.18, -1.3, x + 0.16, long);
  g.lineTo(x - 0.15, long);
  g.quadraticCurveTo(x - 0.18, -1.3, x - 0.08, -1.72);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(0,0,0,0.18)';
  g.fillRect(x - 0.01, -1.6, 0.02, 1.6 + long);
  g.fillStyle = collar;
  g.beginPath();
  g.ellipse(x, -1.66, 0.1, 0.06, 0, 0, Math.PI * 2);
  g.fill();
};
if (e.state.nina_coat) coat(-0.1, '#5a4a3e', '#3a2c24', -0.62);
if (e.state.coat_b === 'hook') coat(0.1, '#4f525a', '#ddd6c6', -0.42);
e.at(0.1, -1.4, 'coat');
