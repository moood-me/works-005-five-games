// the far wheels turn with the near ones
const L = e.lib, m = e.mem;
L.advance(e);
m.dist = ((m.dist ?? 0) + (m.v + Math.abs(e.speed('train_x') || 0)) * e.dt) % 10000;
const W = L.LOCO.radii;
for (let i = 0; i < W.length; i++) e.layer(`w${i}`).rotate = m.dist / W[i];
