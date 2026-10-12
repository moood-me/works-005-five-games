// the evening and the night as far as they are come; the sun going down toward the water as the evening comes (red as
// it is low), gone in the night; the moon rising into the night
const { clamp01 } = e.lib, ease = e.anim.ease, span = e.anim.span;
const E = clamp01(e.state.evening), N = clamp01(e.state.night);
e.layer('evening').alpha = E;
e.layer('night').alpha = N;
const sun = 1 - ease.smooth(span(N, 0, 0.45));
for (const n of ['sun_day', 'sun_eve']) {
  const l = e.layer(n);
  l.x = e.aspect * 0.26 * E;
  l.y = 0.2 * E;
}
e.layer('sun_day').alpha = sun;
e.layer('sun_eve').alpha = sun * E;
e.glow('sun_day', sun * (1 - E));
e.glow('sun_eve', sun * E);
const moon = ease.smooth(span(N, 0.35, 0.8));
e.layer('moon').alpha = moon;
e.glow('moon', moon);
