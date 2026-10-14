const b = e.state.barrier || 0, r = -(1 - b) * 1.25;
e.layer('arm').rotate = r;
e.at(2.2 * Math.cos(r), -1.25 + 2.2 * Math.sin(r));
e.glow('tip', (e.state.bell || 0) * (Math.sin(e.t * 5.6) > 0 ? 1 : 0.15));
