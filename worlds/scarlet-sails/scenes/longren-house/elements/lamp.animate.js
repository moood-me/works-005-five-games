const k = e.anim.clamp(e.state.lamp, 0, 1);
e.layer("cold").alpha = 1 - k;
e.layer("warm").alpha = k;
