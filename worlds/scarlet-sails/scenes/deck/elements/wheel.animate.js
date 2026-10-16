// `helm` turns it: three quarters of a turn each way
e.layer("wheel").rotate = e.anim.clamp(e.state.helm ?? 0, -1, 1) * 1.5 * Math.PI;
