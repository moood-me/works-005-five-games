// The sofa's seat from above: the plush in three cushions, a small pillow at its right end. Its point: bed (where one
// lying on it has the hips — `sofa_top#bed`). Metres; 2.0 × 0.62, x = the plan's x − 6.6, y = 3.61 − the plan's z.
g.fillStyle = '#5b463a';
g.fillRect(-1.0, -0.31, 2.0, 0.62);
g.strokeStyle = '#43342b';
g.lineWidth = 0.02;
for (const x of [-0.33, 0.33]) {
  g.beginPath();
  g.moveTo(x, -0.3);
  g.lineTo(x, 0.3);
  g.stroke();
}
g.fillStyle = '#c9b892';
g.beginPath();
g.ellipse(0.82, -0.02, 0.13, 0.2, 0, 0, Math.PI * 2);
g.fill();
const [x, z] = e.lib.LIE_AT.sofa.at;
e.at(x - 6.6, 3.61 - z, 'bed');
