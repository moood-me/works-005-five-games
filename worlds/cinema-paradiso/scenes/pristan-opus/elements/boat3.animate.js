const o = Math.max(0, Math.min(1, e.state.boats_out)), l = e.layer('b'), k = 3 * 1.7;
l.x = 1 * o * 11;
l.y = Math.sin(e.t * 0.9 + k) * 0.05;
l.rotate = Math.sin(e.t * 0.7 + k * 1.3) * 0.025;
l.alpha = 1 - 0.85 * o;
