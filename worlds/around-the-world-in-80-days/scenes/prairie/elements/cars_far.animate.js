// the far wheels turn with the near ones, the bodies sway with them
const L = e.lib, m = e.mem, st = e.state;
L.advance(e);
m.dist = ((m.dist ?? 0) + (m.v + Math.abs(e.speed('cars_x') || 0)) * e.dt) % 10000;
for (let i = 0; i < 12; i++) e.layer(`w${i}`).rotate = m.dist / 0.42;
L.sway(e, e.anim.clamp(st.swing ?? 0, 0, 1), st.swing_at ?? 0);
