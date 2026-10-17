const c = e.lib.clamp01(e.state.curtain);
e.layer('cloth').scaleX = 0.16 + 0.84 * c;
