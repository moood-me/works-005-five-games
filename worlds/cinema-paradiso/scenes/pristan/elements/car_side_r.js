// The car's right side (its front toward −x here). Nothing while there is no car.
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
e.lib.carSide(g, t);
