const n = e.state.night || 0;
e.layer('night').alpha = Math.min(1, n * 1.15);
e.layer('clouds').alpha = 0.55 + 0.25 * (1 - n);
