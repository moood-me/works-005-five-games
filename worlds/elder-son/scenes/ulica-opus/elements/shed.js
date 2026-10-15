// Макарская's shed: its fire by `fire` (layers: the window's glow, the tongues under the eaves — shedLive); after the
// fire by `shed_left` (the game sets it before `after_fire`): 1 — scorched, its roof whole; 0 — black walls, no roof.
// Before the fire — whole.
e.kit.izby.shed(g, e, { w: 2.6, h: 2.4, fire: true, burnt: e.state.shed_burnt ? (e.state.shed_left === 0 ? 2 : 1) : 0 });
