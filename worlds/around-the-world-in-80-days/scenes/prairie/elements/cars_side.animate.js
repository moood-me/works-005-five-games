// the wheels turn by the way the cars go — «on the spot» (speed) or along the line (cars_x moving); the bodies sway
// (swing, at the phase swing_at); the faces at the windows show as `faces` says
const L = e.lib, m = e.mem, c = e.anim.clamp, st = e.state;
L.advance(e);
m.dist = ((m.dist ?? 0) + (m.v + Math.abs(e.speed('cars_x') || 0)) * e.dt) % 10000;
for (let i = 0; i < 12; i++) e.layer(`w${i}`).rotate = m.dist / 0.42;
L.sway(e, c(st.swing ?? 0, 0, 1), st.swing_at ?? 0);
e.layer('faces').alpha = c(st.faces ?? 0, 0, 1);
