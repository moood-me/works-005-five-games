// The pennant streams the way the air goes past the mast: the wind (−1 from the far side … 0 from astern … 1 from the
// near side: it blows along +x by cos, across by sin) and the sledge's own running (from ahead). Seen side-on, only its
// run along the sledge shows: out to that side, drooping as it comes round toward us or away.
const c = e.anim.clamp, st = e.state, w = c(st.wind ?? 0, -1, 1);
const along = Math.cos((w * Math.PI) / 2) - 1.4 * c(st.sl_speed ?? 0, 0, 1);
const p = e.layer('pennant');
p.scaleX = Math.sign(along || 1) * (0.25 + 0.75 * Math.min(1, Math.abs(along)));
