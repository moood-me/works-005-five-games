// the lamp's glow breathing
const breath = 0.85 + 0.15 * Math.sin(e.t * 1.6) + 0.05 * e.anim.noise(e.t * 3, 2);
e.layer('halo').alpha = breath;
e.glow('lens', breath);
