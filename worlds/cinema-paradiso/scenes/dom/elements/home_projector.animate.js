// the lens alight while it runs, unsteady as a small lamp
const on = Math.max(0, Math.min(1, e.state.projector_on || 0));
if (e.state.reel8) e.glow('lens', on * (0.85 + 0.15 * e.anim.noise(e.t * 9, 2)));
