// The porch's side (a picture of the land: it stands as drawn): the stair's profile rising from the pavement to the porch's
// top, plastered stone; `porch_side2` is the far side (turned the other way: the profile mirrored)
const season = e.lib.seasonOf(e.state.season);
const flip = e.id === 'porch_side2' ? -1 : 1;
g.save();
g.scale(flip, 1);
g.fillStyle = '#cfc6b4';
g.beginPath();
g.moveTo(-0.83, 0);
for (let k = 0; k < 4; k++) {
  g.lineTo(-0.83 + k * 0.2125, -(k + 1) * 0.1875);
  g.lineTo(-0.83 + (k + 1) * 0.2125, -(k + 1) * 0.1875);
}
g.lineTo(0.83, -0.75);
g.lineTo(0.83, 0);
g.closePath();
g.fill();
g.fillStyle = 'rgba(80,70,60,0.25)';
g.fillRect(-0.83, -0.12, 1.66, 0.12);
if (season !== 'thaw') e.lib.PAINT.snowLedge(g, season, 0, 0.83, -0.75, 0.06, () => e.rnd());
g.restore();
