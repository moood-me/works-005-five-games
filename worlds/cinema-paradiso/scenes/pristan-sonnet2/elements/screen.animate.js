const k = e.state.beam_on;
e.glow('glow', k * (0.9 + 0.1 * Math.sin(e.t * 17.0) * Math.sin(e.t * 5.3)));
e.layer('film').alpha = k;
