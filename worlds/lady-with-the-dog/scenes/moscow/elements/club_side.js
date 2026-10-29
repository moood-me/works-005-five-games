// The club steps' side, a picture of the land: the profile rising from the road (x +0.7) to the portico (−0.7);
// `club_side2` is the far side (the profile mirrored)
const season = e.lib.seasonOf(e.state.season);
const flip = e.id === 'club_side2' ? -1 : 1;
g.save();
g.scale(flip, 1);
g.fillStyle = '#d4cec2';
g.beginPath();
g.moveTo(0.7, 0);
for (let k = 0; k < 3; k++) {
  g.lineTo(0.7 - k * 0.233, -(k + 1) * 0.2);
  g.lineTo(0.7 - (k + 1) * 0.233, -(k + 1) * 0.2);
}
g.lineTo(-0.7, -0.6);
g.lineTo(-0.7, 0);
g.closePath();
g.fill();
if (season !== 'thaw') e.lib.PAINT.snowLedge(g, season, -0.7, 0, -0.6, 0.06, () => e.rnd());
g.restore();
