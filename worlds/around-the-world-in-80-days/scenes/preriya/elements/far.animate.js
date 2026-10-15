// the bluffs run back along the line as fast as the train or the sledge runs (metres for metres: they are far, so they
// creep), wrapping every period
const c = e.anim.clamp, st = e.state, L = e.lib;
const v = c(st.speed ?? 0, 0, 1) * L.plan.pace + c(st.sl_speed ?? 0, 0, 1) * L.plan.sailPace;
const m = e.mem;
m.x = ((m.x ?? 0) + v * e.dt) % 2000;
e.layer('hills').x = -m.x;
