const h = e.state.spitz_here ? 1 : 0;
e.layer('body').scaleY = 1 + Math.sin(e.t * 1.7) * 0.012;
e.layer('body').alpha = h;
e.layer('leash').alpha = h;
