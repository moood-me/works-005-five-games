// as high as the waves run; gone once it has passed under her (wave past 0.55)
const st = e.state, h = 0.45 + 0.75 * e.lib.clamp01(st.wave_h), seen = e.lib.clamp01(st.wave) < 0.55 ? 1 : 0;
for (const n of ['body', 'drift']) { const l = e.layer(n); l.scaleY = h; l.alpha = seen; }
