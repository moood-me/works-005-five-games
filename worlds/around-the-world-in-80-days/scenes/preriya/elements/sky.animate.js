// the dawn and the night as far as they are come; the moon and the stars in the night; the clouds drifting slowly, and
// faster back along the plain while the train or the sledge runs (wrapping round the sky's width)
const a = e.anim, c = a.clamp, st = e.state;
const night = c(st.night ?? 0, 0, 1), dawn = c(st.dawn ?? 0, 0, 1);
e.layer('dawn').alpha = dawn * (1 - night * 0.6);
e.layer('night').alpha = night;
e.layer('moon').alpha = night;
e.glow('moon', night);
const run = c(st.speed ?? 0, 0, 1) + c(st.sl_speed ?? 0, 0, 1) * 0.8;
const m = e.mem;
m.x = ((m.x ?? 0) + (0.004 + 0.012 * run) * e.dt) % (e.aspect + 0.6);
const cl = e.layer('clouds');
cl.x = -m.x;
cl.alpha = 1 - 0.6 * night;
