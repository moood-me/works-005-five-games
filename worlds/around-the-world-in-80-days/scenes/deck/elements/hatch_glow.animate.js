// the glow as strong as the fire is (a little even when it is low: the furnaces are lit), trembling
const f = e.lib.clamp01(e.state.fire), l = e.layer('glow');
l.alpha = 0.25 + 0.75 * f;
l.brightness = 0.85 + 0.15 * e.anim.noise(e.t * 3, 1) + 0.4 * e.lib.clamp01(e.state.flare_glow);
