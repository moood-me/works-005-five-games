// the swells run at the boat as fast as the storm drives them (metres, added up frame by frame)
const m = e.mem, s = e.lib.clamp01(e.state.storm);
m.p = ((m.p ?? 0) + (4 + 9 * s) * e.dt) % 20000;
e.uniform('phase', m.p);
e.uniform('storm', s);
