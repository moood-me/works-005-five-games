// The iron canopy over the Gurovs' door (seen from the lane): its edge with a cut fringe, two brackets to the wall; the
// snow lying on it
const season = e.lib.seasonOf(e.state.season);
g.fillStyle = '#3c4246';
g.fillRect(-1.0, -0.12, 2.0, 0.12);
for (let x = -0.98; x < 1.0; x += 0.1) {
  g.beginPath();
  g.moveTo(x, 0);
  g.lineTo(x + 0.1, 0);
  g.lineTo(x + 0.05, 0.08);
  g.closePath();
  g.fill();
}
g.strokeStyle = '#3c4246';
g.lineWidth = 0.03;
for (const x of [-0.9, 0.9]) {
  g.beginPath();
  g.moveTo(x, 0);
  g.quadraticCurveTo(x, 0.5, x * 0.98, 0.7);
  g.stroke();
}
e.lib.PAINT.snowLedge(g, season, -1.02, 1.02, -0.12, season === 'thaw' ? 0.04 : 0.16, () => e.rnd());
