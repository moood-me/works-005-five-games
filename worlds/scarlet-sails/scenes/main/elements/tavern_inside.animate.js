const on = e.anim.clamp(e.state.tavern_lamp ?? 0, 0, 1);
e.layer("lit").alpha = on;
e.glow("room", on);
