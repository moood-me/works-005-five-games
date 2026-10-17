// The wires from pole to pole, sagging between them (metres, origin under the middle pole of the line's run: the
// poles stand at x = −292.5 + 45 k). Swallows sit on them in a few spans near the station — autumn is coming.
const rnd = e.rnd, P0 = -292.5, STEP = 45, N = 13;
const ys = [-7.27, -7.25, -6.67];
const offs = [-0.65, 0.25, -0.45];
g.strokeStyle = '#2e2c33'; g.lineWidth = 0.022;
for (let k = 0; k < N; k++) {
  const a = P0 + k * STEP, b = a + STEP;
  for (let j = 0; j < ys.length; j++) {
    g.beginPath(); g.moveTo(a + offs[j], ys[j]); g.quadraticCurveTo((a + b) / 2, ys[j] + 0.75, b + offs[j], ys[j]); g.stroke();
  }
}
// swallows: small dark birds sitting on the top wire, in the spans the platform sees
g.fillStyle = '#26242a';
for (let k = 0; k < 3; k++) {
  const a = P0 + k * STEP;
  for (let i = 0; i < 9; i++) {
    const u = 0.15 + rnd() * 0.7, x = a + u * STEP, y = -7.27 + 4 * u * (1 - u) * 0.375 - 0.06;
    g.beginPath(); g.ellipse(x, y, 0.06, 0.08, 0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(x - 0.02, y + 0.05); g.lineTo(x + 0.05, y + 0.17); g.lineTo(x + 0.03, y + 0.04); g.closePath(); g.fill();
  }
}
