// the canvas goes up the mast as the sail is raised, and comes down onto the boom as it is furled
e.layer('canvas').scaleY = 0.06 + 0.94 * e.anim.clamp(e.state.sail_up ?? 0, 0, 1);
