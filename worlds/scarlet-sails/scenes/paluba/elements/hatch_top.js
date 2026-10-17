// The main hatch seen from above: its grating, a frame round it
const c = e.lib.colours(e.state);
g.fillStyle = c.rail;
g.fillRect(-1.3, -1.5, 2.6, 3);
g.fillStyle = c.seam;
for (let x = -1.15; x < 1.2; x += 0.2) for (let y = -1.35; y < 1.4; y += 0.2) g.fillRect(x, y, 0.1, 0.1);
