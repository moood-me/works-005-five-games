// the bulb's glow with the lamp, a faint unsteadiness of old wiring
const k = Math.max(0, Math.min(1, e.state.lamp ?? 1));
e.glow('bulb', k * (0.95 + 0.05 * e.anim.noise(e.t * 2.3, 4)));
