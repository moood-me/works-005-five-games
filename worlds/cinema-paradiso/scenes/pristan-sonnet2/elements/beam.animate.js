const k = e.state.beam_on;
e.layer('wedge').alpha = k * (0.8 + 0.12 * Math.sin(e.t * 9.0));
e.glow('mouth', k);
