// the beam with the projector, a little dimmer than a cinema's; tilted down to the square
const on = Math.max(0, Math.min(1, e.state.projector_on || 0)) * (0.55 + 0.08 * e.anim.noise(e.t * 7, 3));
e.kit.cinema.beamMove(e, on, 1, e.lib.G.BEAM.tilt, e.lib.G.BEAM.len);
