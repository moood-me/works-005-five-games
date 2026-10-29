// The Gurovs' house front (z 7.6…18.4, the card's x running toward the viewer: 13 − z): two floors over a raised ground
// floor; the door's hole at 0 and the window upstairs' hole at −2.4 cut; the porch lamp on its bracket by the door (its
// light — `porch`, by `porch_lamp`); the chimney's point for its smoke.
const L = e.lib;
const P = L.PAINT;
const season = L.seasonOf(e.state.season);
P.facade(g, e, { ...P.FRONTS.house, season });
// the door's surround
P.fillRect(g, '#efe8da', -0.75, -3.45, 0.75, -3.15);
P.fillRect(g, '#efe8da', -0.75, -3.15, -0.55, -0.75);
P.fillRect(g, '#efe8da', 0.55, -3.15, 0.75, -0.75);
// the porch lamp: a bracket from the wall, a lantern
g.strokeStyle = '#2d3036';
g.lineWidth = 0.035;
g.beginPath();
g.moveTo(1.0, -3.55);
g.lineTo(0.85, -3.55);
g.lineTo(0.85, -3.4);
g.stroke();
g.fillStyle = '#ece0c4';
g.fillRect(0.75, -3.4, 0.2, 0.32);
g.strokeStyle = '#2d3036';
g.lineWidth = 0.02;
g.strokeRect(0.75, -3.4, 0.2, 0.32);
g.fillStyle = '#2d3036';
g.beginPath();
g.moveTo(0.7, -3.4);
g.lineTo(1.0, -3.4);
g.lineTo(0.85, -3.52);
g.closePath();
g.fill();
e.light(0.85, -3.24, 0.12, '#ffd59a', 1, 'lamp');
