// The club's great clock on the partition: a round dial on a long glazed case, the pendulum inside. Painted once: the
// case (its glass an opening onto its dark inside — "inside"), the pendulum hung from its pivot ("pendulum"), the dial,
// and its three hands, each a layer turning about the dial's middle ("hour", "minute", "second", painted at twelve) —
// clock.animate.js sets them from `minute` and `second`.
const caseCol = '#1c1614';
const cy = -4.55;
const R = 0.58;
const r = 0.48;
// the glass in the trunk, the pendulum behind it
const gx = -0.17, gy = cy + 0.62, gw = 0.34, gh = -1.86 - gy;
e.layer('inside', { depth: -0.06 }, c => {
  c.fillStyle = '#2c2019';
  c.fillRect(gx - 0.02, gy - 0.02, gw + 0.04, gh + 0.04);
});
const len = 2.15;
e.layer('pendulum', { depth: -0.03, pivot: [0, cy] }, c => {
  c.strokeStyle = '#a8844e';
  c.lineWidth = 0.018;
  c.beginPath();
  c.moveTo(0, cy + 0.5);
  c.lineTo(0, cy + len);
  c.stroke();
  // the bob: a brass disc, rounded
  const by = cy + len;
  const bob = c.createRadialGradient(0.035, by - 0.035, 0, 0, by, 0.115);
  bob.addColorStop(0, '#f0d49a');
  bob.addColorStop(0.55, '#b88a4a');
  bob.addColorStop(1, '#604222');
  c.fillStyle = bob;
  c.beginPath();
  c.arc(0, by, 0.115, 0, Math.PI * 2);
  c.fill();
});
// the case: a long trunk under the dial, its glass an opening, a small foot
g.fillStyle = caseCol;
g.beginPath();
g.rect(-0.27, cy, 0.54, -cy - 1.62);
g.rect(gx, gy, gw, gh);
g.fill('evenodd');
g.fillRect(-0.33, -1.72, 0.66, 0.12);
// the bezel
g.beginPath();
g.arc(0, cy, R, 0, Math.PI * 2);
g.fill();
// the dial: ivory, quiet batons
g.fillStyle = '#e6dcc8';
g.beginPath();
g.arc(0, cy, r, 0, Math.PI * 2);
g.fill();
g.strokeStyle = 'rgba(36,27,22,0.9)';
g.lineCap = 'butt';
for (let i = 0; i < 60; i++) {
  const q = (i / 60) * Math.PI * 2;
  const hourMark = i % 5 === 0;
  const main = i % 15 === 0;
  g.lineWidth = main ? 0.032 : hourMark ? 0.018 : 0.006;
  const r0 = r * (main ? 0.7 : hourMark ? 0.76 : 0.86);
  g.beginPath();
  g.moveTo(Math.sin(q) * r0, cy - Math.cos(q) * r0);
  g.lineTo(Math.sin(q) * r * 0.9, cy - Math.cos(q) * r * 0.9);
  g.stroke();
}
// the hands, at twelve, each turning about the dial's middle
const hand = (name, length, width, col, depth) => e.layer(name, { pivot: [0, cy], depth }, c => {
  c.strokeStyle = col;
  c.lineWidth = width;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, cy + length * 0.16);
  c.lineTo(0, cy - length);
  c.stroke();
  if (name === 'second') {
    c.fillStyle = '#1a1310';
    c.beginPath();
    c.arc(0, cy, 0.026, 0, Math.PI * 2);
    c.fill();
  }
});
hand('hour', r * 0.5, 0.036, '#1a1310', 0.004);
hand('minute', r * 0.8, 0.022, '#1a1310', 0.008);
hand('second', r * 0.84, 0.008, '#a33a2b', 0.012);
e.at(0, cy, 'dial');
