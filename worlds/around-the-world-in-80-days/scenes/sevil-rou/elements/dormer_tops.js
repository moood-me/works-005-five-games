// The dormers' flat lead tops (a plane, seen from below and from afar).
const L = e.lib;
g.fillStyle = '#55595f';
for (const h of L.houses) g.fillRect((h.x0 + h.x1) / 2 - L.plan.row - L.plan.dormer.half - 0.05, -0.3, 2 * L.plan.dormer.half + 0.1, 0.6);
