// the lamps' beam: on by `headlights`, thicker in the rain
if (e.state.car !== 'old' && e.state.car !== 'new') return;
const h = Math.max(0, Math.min(1, e.state.headlights || 0)), r = Math.max(0, Math.min(1, e.state.rain || 0));
e.kit.cinema.beamMove(e, h * (0.04 + 0.12 * r));
e.glow('tip', h); // (the pool on the road as bright as the lamps, rain or not)
