const boat = e.layer("boat"), A = e.anim;
boat.alpha = A.clamp(e.state.storm ?? 0, 0, 1);
boat.rotate = 0.16 * A.noise(e.t * 0.8, 5);
boat.y = 0.12 * A.noise(e.t * 0.6, 6);
