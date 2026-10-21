// the panes glow as the lamps are lit
e.layer('lit').alpha = e.anim.clamp(e.state.lamps ?? 0, 0, 1);
