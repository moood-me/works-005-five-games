const L = e.state.lights;
for (let i = 0; i < 3; i++) e.glow('l' + i, Math.max(0, Math.min(1, L - i)));
