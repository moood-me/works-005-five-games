// which frame shows — a cut, or romance into romance_kiss over 3 s; everything by `beam_on`; in 1988 only in the
// memory (`past`)
const s = e.state, m = e.mem, names = ['romance', 'romance_kiss', 'comedy', 'white'];
m.w ??= names.map(n => (n === s.screen_film ? 1 : 0));
const whole = s.era === 'ruin' ? Math.max(0, Math.min(1, s.past)) : 1, on = Math.max(0, Math.min(1, s.beam_on ?? 1));
for (let i = 0; i < 4; i++) {
  const want = names[i] === s.screen_film ? 1 : 0;
  const slow = names[i] === 'romance_kiss' || (names[i] === 'romance' && s.screen_film === 'romance_kiss');
  const rate = slow ? 1 / 3 : 30;
  m.w[i] += Math.max(-rate * e.dt, Math.min(rate * e.dt, want - m.w[i]));
  if (e.cut < 0.05) m.w[i] = want;
  e.layer('f_' + names[i]).alpha = m.w[i] * whole * (0.25 + 0.75 * on);
}
