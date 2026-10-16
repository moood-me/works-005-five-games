// The headlamps' beam ahead of the car (cinema.beam): a wedge from the lamps (the anchor, 0.62 m up) falling to the road
// 16 m ahead and spreading; it glows, and shows most in the rain. On its tip the light of the lamps lays a pool on the
// road (or the sea): the scene's `car_pool` light is it.
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
e.kit.cinema.beam(e, { len: 16, top: -1.1, bot: 0.6, mouth: 0.1, dust: 90, drift: 0.4, tipRadius: 2.5, tipStrength: 2.2 });
