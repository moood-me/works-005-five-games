// The top of the temple's plinth, seen from above: paving, its joints.
const [w, d] = e.lib.plan.temple.plinth;
g.fillStyle = '#b8a484';
g.fillRect(-w, -d, 2 * w, 2 * d);
g.fillStyle = 'rgba(90,70,48,0.25)';
for (let x = -w + 0.9; x < w; x += 0.9) g.fillRect(x, -d, 0.03, 2 * d);
for (let y = -d + 0.9; y < d; y += 0.9) g.fillRect(-w, y, 2 * w, 0.03);
