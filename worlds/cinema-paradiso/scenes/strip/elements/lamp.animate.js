// the lamp's glow and its beam breathing (the layers' alpha only: nothing repainted)
const breath = 0.85 + 0.15 * Math.sin(e.t * 1.6) + 0.05 * e.anim.noise(e.t * 3, 2);
e.layer('halo').alpha = breath;
e.layer('beam').alpha = 0.9 + 0.1 * breath;
e.glow('lens', breath);
