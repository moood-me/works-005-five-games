// the wheels turn by the way the engine goes — «on the spot» (speed) or along the line (train_x moving) — and the rods
// with the drivers
const L = e.lib, m = e.mem;
L.advance(e);
m.dist = ((m.dist ?? 0) + (m.v + Math.abs(e.speed('train_x') || 0)) * e.dt) % 10000;
const W = L.LOCO.radii;
for (let i = 0; i < W.length; i++) e.layer(`w${i}`).rotate = m.dist / W[i];
L.rods(e, m.dist / L.LOCO.drivers[0][1]);
