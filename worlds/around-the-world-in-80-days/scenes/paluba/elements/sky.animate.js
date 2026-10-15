// the dawn, the night, the fog as far as they are come; the sun with the dawn, the moon with the night; clouds hidden
// in the night and the fog
const { clamp01 } = e.lib, ease = e.anim.ease;
const D = clamp01(e.state.dawn), N = clamp01(e.state.night), F = clamp01(e.state.fog);
e.layer('dawn').alpha = D;
e.layer('night').alpha = N;
e.layer('fog').alpha = F;
e.layer('clouds').alpha = (1 - N) * (1 - F) * (1 - 0.4 * D);
e.layer('sun').alpha = D * (1 - F);
e.glow('sun', D * (1 - F));
const m = ease.smooth(N);
e.layer('moon').alpha = m;
e.glow('moon', m);
