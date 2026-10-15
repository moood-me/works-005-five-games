// The square shows while the projector runs (it comes up in half a second). The girl walks across it at a steady
// pace from the moment it lights: with all of her caught (`share` 1) she crosses the whole frame over the reel's 14 s;
// with less, she starts further on — near the right edge — and is gone out of it sooner: the square left almost empty.
const on = Math.max(0, Math.min(1, e.state.projector_on || 0)), m = e.mem, W = e.lib.G.SCREEN_W;
m.k ??= on;
m.k += Math.max(-e.dt * 2, Math.min(e.dt * 2, on - m.k));
m.t = on > 0.5 ? (m.t ?? 0) + e.dt : 0;
const share = Math.max(0, Math.min(1, e.state.share ?? 1));
const t = Math.min(m.t, 14), x = 0.26 * W / 0.52 * (1 - 1.62 * share) + 0.03 * t * (W / 0.52);
const film = e.layer('film'), girl = e.layer('girl');
film.alpha = m.k;
girl.x = x;
const edge = W / 2 - 0.035;
girl.alpha = m.k * Math.max(0, Math.min(1, (edge - x) / 0.04));
