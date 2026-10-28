// The station's front: board-and-batten painted ochre, brown trim, a door under the station's name (Fort Kearney or
// Omaha, by `town`), four windows (one lit at night: `window`), snow on the sills.
const L = e.lib, { R } = L, omaha = e.state.town === 'omaha';
R(g, -5.4, -4.4, 5.4, 0.05, '#b48a52');
g.strokeStyle = '#9a7442';
g.lineWidth = 0.05;
g.beginPath();
for (let x = -5.2; x < 5.4; x += 0.4) { g.moveTo(x, -4.4); g.lineTo(x, 0); }
g.stroke();
R(g, -5.5, -4.5, 5.5, -4.32, '#5a3e28');
R(g, -5.4, -0.35, 5.4, 0.05, '#5a3e28');
for (const x of [-5.4, 5.25]) R(g, x, -4.4, x + 0.15, 0.05, '#5a3e28');
// the door
R(g, -0.62, -2.5, 0.62, 0.0, '#5a3e28');
R(g, -0.52, -2.42, 0.52, 0.0, '#4a3324');
R(g, -0.4, -2.25, 0.4, -1.5, '#3a4656');
// the windows, their sills under snow
for (const x of [-3.7, -2.2, 2.2, 3.7]) {
  R(g, x - 0.48, -3.0, x + 0.48, -1.2, '#5a3e28');
  R(g, x - 0.4, -2.92, x + 0.4, -1.3, '#3a4656');
  R(g, x - 0.03, -2.92, x + 0.03, -1.3, '#e8dcbc');
  R(g, x - 0.4, -2.14, x + 0.4, -2.08, '#e8dcbc');
  R(g, x - 0.55, -1.22, x + 0.55, -1.12, '#eef2f6');
}
// the name over the door
R(g, -2.7, -3.85, 2.7, -3.15, '#e8dcbc');
g.strokeStyle = '#5a3e28';
g.lineWidth = 0.05;
g.strokeRect(-2.7, -3.85, 5.4, 0.7);
L.text(g, (omaha ? tr('Omaha') : tr('Fort Kearney')).toUpperCase(), 0, -3.48, 0.42, '#3a2a1e', '700');
e.light(3.7, -2.1, 0.6, '#ffc884', 0.8, 'window');
e.at(0, -2.4);
