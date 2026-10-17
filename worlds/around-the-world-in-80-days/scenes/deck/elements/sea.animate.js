// the water runs aft past the ship as fast as `speed` says (7 m/s at 1): its phase, metres, added up frame by frame
const m = e.mem, v = e.lib.clamp01(e.state.speed);
m.p = ((m.p ?? 0) + v * 7 * e.dt) % 20000;
e.uniform('phase', m.p);
e.uniform('caps', 0.35 + 0.65 * v);
