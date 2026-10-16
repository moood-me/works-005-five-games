// the frame of the reel (`reel` — its place in it) while `screen_film` is kisses, white at its end, none — dark; the
// first `jumps` of the three cut in chapter I tremble at their crooked splice (a hop of the frame every 0.9 s)
const s = e.state, m = e.mem, R = e.lib.REEL, on = Math.max(0, Math.min(1, s.beam_on || 0));
const now = s.screen_film === 'white' ? 'white' : s.screen_film === 'kisses' ? R[Math.max(0, Math.min(R.length - 1, Math.round(s.reel || 0)))] : null;
m.a ??= {};
const jumps = Math.max(0, Math.min(3, Math.round(s.jumps || 0)));
for (const name of [...R, 'white']) {
  const want = name === now ? 1 : 0, a = m.a[name] ?? want;
  m.a[name] = e.cut < 0.05 ? want : a + Math.max(-e.dt / 0.12, Math.min(e.dt / 0.12, want - a));
  const l = e.layer('f_' + name);
  l.alpha = m.a[name] * on;
  const k = R.indexOf(name), crooked = k >= 0 && k < jumps;
  const ph = (e.t % 0.9) / 0.9;
  l.y = crooked && want ? (ph < 0.08 ? -0.09 : ph < 0.14 ? 0.05 : 0) : 0;
}
