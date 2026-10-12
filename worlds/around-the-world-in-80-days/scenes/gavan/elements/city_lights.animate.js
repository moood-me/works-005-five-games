// the shore lit as the lanterns are
const lit = e.lib.clamp01(e.state.lanterns);
e.layer('lit').alpha = lit;
e.glow('shore', lit);
