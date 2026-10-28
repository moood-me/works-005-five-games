// in at once as it comes over, draining away over two seconds
const m = e.mem, v = e.lib.clamp01(e.state.green_water);
m.g = Math.max(v, (m.g ?? 0) - e.dt * 0.5);
const l = e.layer('sheet');
l.alpha = m.g;
l.scaleY = 0.4 + 0.6 * m.g;
