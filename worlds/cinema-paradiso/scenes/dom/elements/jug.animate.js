if (e.state.era === 'now' || !e.state.table_set) return;
// held: the jug goes up into her hands (between them) and tips a little over the glass; let go — back on the table
const m = e.mem, held = e.state.jug_held ? 1 : 0;
m.u ??= held;
m.u += Math.max(-e.dt * 2.5, Math.min(e.dt * 2.5, held - m.u));
const u = e.anim.ease.smooth(m.u), l = e.layer('jug');
const a = e.point('maria#hand_r'), b = e.point('maria#hand_l');
const hx = a && b ? (a[0] + b[0]) / 2 : 0, hy = a && b ? (a[1] + b[1]) / 2 + 0.12 : 0;
l.x = hx * u; l.y = hy * u; l.rotate = 0.55 * u;
e.at(-0.12 + l.x, -0.11 + l.y, 'handle');
e.at(0.07 + l.x, -0.2 + l.y, 'spout');
