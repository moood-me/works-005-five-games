// The last car's rear end (a card across the line; its x runs toward the viewer): the end wall with its door and window
// under the roof's curve, the platform with its railing across, the steps either side, the truck under it.
const { R, P } = e.lib;
R(g, -1.1, -0.92, 1.1, -0.66, '#2a2622');
for (const s of [-1, 1]) R(g, s * 0.72 - 0.07, -0.84, s * 0.72 + 0.07, 0, '#2a2622');
R(g, -1.5, -1.2, 1.5, -1.05, '#2a2622');
// the end wall, the door with its window, the roof's curve with snow on it
R(g, -1.42, -3.45, 1.42, -1.2, '#8b3a2b');
R(g, -0.42, -3.05, 0.42, -1.2, '#6e2c22');
R(g, -0.3, -2.9, 0.3, -2.2, '#33404f');
g.strokeStyle = '#e8dcbc';
g.lineWidth = 0.05;
g.strokeRect(-0.3, -2.9, 0.6, 0.7);
P(g, [-1.55, -3.45, -1.2, -3.78, -0.5, -3.88, -0.5, -4.15, 0.5, -4.15, 0.5, -3.88, 1.2, -3.78, 1.55, -3.45], '#4a443f');
P(g, [-0.5, -4.15, 0.5, -4.15, 0.5, -4.22, -0.5, -4.22], '#eef2f6');
// the railing across the platform, the steps
R(g, -1.5, -2.2, 1.5, -2.12, '#2a2622');
R(g, -1.5, -1.75, 1.5, -1.7, '#2a2622');
for (const x of [-1.45, -0.75, 0.75, 1.45]) R(g, x - 0.03, -2.15, x + 0.03, -1.15, '#2a2622');
for (const s of [-1, 1]) for (const y of [-0.85, -0.5]) R(g, s * 1.15 - 0.3, y - 0.05, s * 1.15 + 0.3, y, '#2a2622');
