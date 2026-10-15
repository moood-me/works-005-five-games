
// which frame shows (a cut, or the 3 s dissolve into the kiss), the sheet's shine by the beam, the ruin by `past`
const s = e.state, m = e.mem, names = ['romance', 'romance_kiss', 'comedy', 'white'];
m.w ??= names.map(n => (n === s.screen_film ? 1 : 0));
for (let i = 0; i < 4; i++) {
  const want = names[i] === s.screen_film ? 1 : 0;
  const rate = (names[i] === 'romance_kiss' || (names[i] === 'romance' && s.screen_film === 'romance_kiss')) ? 1 / 3 : 30;
  m.w[i] += Math.max(-rate * e.dt, Math.min(rate * e.dt, want - m.w[i]));
  if (e.cut < 0.05) m.w[i] = want;
  e.uniform('f' + i, m.w[i]);
}
e.uniform('on', Math.max(0, Math.min(1, s.beam_on || 0)));
e.uniform('whole', s.era === 'ruin' ? Math.max(0, Math.min(1, s.past)) : 1);
