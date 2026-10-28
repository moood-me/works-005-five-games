// the streaks run back with the plain, and show as fast as it runs
const L = e.lib, run = L.advance(e), l = e.layer('streaks');
l.x = -L.mod(run, 40);
l.alpha = e.anim.clamp(e.mem.v / 14, 0, 1);
