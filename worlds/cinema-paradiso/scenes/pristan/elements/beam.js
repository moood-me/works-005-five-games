// The projector's beam over the chairs to the screen (kino.beam): a wedge of warm light in the vertical plane from the
// lens (the anchor) 24.4 m to the screen's span; dust and smoke in it (the world's shader). It glows; it lights nothing
// but the soft spot at its tip (the screen's own light is the scene's `screen_light`).
e.kit.kino.beam(e, { len: 24.4, top: -4.05, bot: -0.05, mouth: 0.05, dust: 420, drift: 1.1, tipStrength: 0.35 });
