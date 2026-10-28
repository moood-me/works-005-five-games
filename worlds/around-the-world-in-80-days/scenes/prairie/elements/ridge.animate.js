// the ridge rises out of the snow (ridge_h), its spindrift with its crest
const k = e.anim.clamp(e.state.ridge_h ?? 0, 0, 1), d = e.layer('drift'), s = e.layer('spindrift');
d.scaleY = 0.04 + 0.96 * k;
d.alpha = k > 0.01 ? 1 : 0;
s.y = 2.0 * (1 - (0.04 + 0.96 * k));
s.alpha = k;
