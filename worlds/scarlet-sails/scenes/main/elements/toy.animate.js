const toy = e.layer("toy");
toy.alpha = e.anim.clamp(e.state.toy_water ?? 0, 0, 1);
toy.rotate = 0.04 * e.anim.noise(e.t * 0.5, 3);
