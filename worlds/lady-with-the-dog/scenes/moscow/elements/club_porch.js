// The club's portico (z 21.8…25.2): four columns on its platform (0.6), the entablature, a low pediment; two lanterns on
// the outer columns (their light — `club_l`, `club_r`, by `lamps`); the snow on the cornice
const season = e.lib.seasonOf(e.state.season);
const P = e.lib.PAINT;
for (const x of [-1.5, -0.5, 0.5, 1.5]) {
  g.fillStyle = '#ece7dc';
  g.beginPath();
  g.moveTo(x - 0.17, -0.6);
  g.lineTo(x + 0.17, -0.6);
  g.lineTo(x + 0.14, -4.5);
  g.lineTo(x - 0.14, -4.5);
  g.closePath();
  g.fill();
  P.fillRect(g, '#ddd6c8', x - 0.24, -0.72, x + 0.24, -0.6);
  P.fillRect(g, '#ddd6c8', x - 0.22, -4.62, x + 0.22, -4.5);
  g.fillStyle = 'rgba(120,110,100,0.18)';
  g.fillRect(x + 0.05, -4.5, 0.07, 3.9);
}
P.fillRect(g, '#e8e3d8', -1.75, -5.15, 1.75, -4.62);
P.fillRect(g, 'rgba(0,0,0,0.12)', -1.75, -4.7, 1.75, -4.62);
g.fillStyle = '#e8e3d8';
g.beginPath();
g.moveTo(-1.85, -5.15);
g.lineTo(0, -5.95);
g.lineTo(1.85, -5.15);
g.closePath();
g.fill();
P.snowLedge(g, season, -1.85, 1.85, -5.15, 0.12, () => e.rnd());
// the lanterns
for (const [x, name] of [[-1.5, 'lamp_l'], [1.5, 'lamp_r']]) {
  g.fillStyle = '#2d3036';
  g.fillRect(x - 0.02, -3.1, 0.04, 0.25);
  g.fillStyle = '#ece0c4';
  g.fillRect(x - 0.1, -2.85, 0.2, 0.3);
  e.light(x, -2.7, 0.14, '#ffd49a', 1, name);
}
