const n = e.state.lights;
e.glow('l1', Math.min(1, Math.max(0, n)));
e.glow('l2', Math.min(1, Math.max(0, n - 1)));
e.glow('l3', Math.min(1, Math.max(0, n - 2)));
