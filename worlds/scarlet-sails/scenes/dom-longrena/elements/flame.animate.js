const L = e.layer("flame"), n = e.anim.noise;
L.alpha = e.anim.clamp(e.state.lamp, 0, 1);
L.scaleY = 1 + 0.1 * n(e.t * 1.9, 1);
L.rotate = 0.06 * n(e.t * 1.3, 2);
