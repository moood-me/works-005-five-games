const c = e.state.cover, l = e.layer('tarp');
l.alpha = Math.min(1, c * 4);
l.y = -(1 - c) * 0.3;
