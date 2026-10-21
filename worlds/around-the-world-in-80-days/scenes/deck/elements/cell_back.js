// The cell's back wall: whitewashed stone, a dado darker below, the small barred window high up (the day's light
// comes in at it: the light cell_window).
const L = e.lib;
L.rect(g, -3.7, -5.4, 7.4, 5.4, '#d8d2c2');
L.rect(g, -3.7, -1.2, 7.4, 1.2, '#a89e8a');
L.rect(g, 0.15, -4.4, 1.0, 0.9, '#e8f0f2');
g.fillStyle = '#3a3634';
for (let x = 0.3; x < 1.15; x += 0.22) g.fillRect(x, -4.4, 0.05, 0.9);
L.rect(g, 0.1, -4.45, 1.1, 0.06, '#7a7264');
L.rect(g, 0.1, -3.52, 1.1, 0.08, '#7a7264');
