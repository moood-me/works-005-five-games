// the lamp's glow breathing, brighter or dimmer by `lamp`
const k = e.anim.clamp(e.state.lamp == null ? 1 : +e.state.lamp || 0, 0, 1);
const breath = 0.85 + 0.15 * Math.sin(e.t * 1.6) + 0.05 * e.anim.noise(e.t * 3, 2);
e.layer('halo').alpha = k * breath;
e.layer('lens').brightness = 0.35 + 0.65 * k;
e.glow('lens', k * breath);
