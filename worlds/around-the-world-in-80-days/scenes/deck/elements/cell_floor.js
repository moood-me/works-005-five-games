// The cell's floor from above: worn flagstones.
const L = e.lib;
L.rect(g, -3.6, -3.2, 7.2, 6.4, '#9a9284');
g.fillStyle = '#857d70';
for (let x = -3.6; x < 3.6; x += 0.6) g.fillRect(x, -3.2, 0.03, 6.4);
for (let y = -3.2; y < 3.2; y += 0.6) g.fillRect(-3.6, y, 7.2, 0.03);
