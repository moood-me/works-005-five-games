// The car's left side (its front toward +x here: the profile mirrored).
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
g.scale(-1, 1); e.lib.carSide(g, t);
