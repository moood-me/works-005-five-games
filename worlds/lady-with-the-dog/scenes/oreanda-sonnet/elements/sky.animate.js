const d = e.state.dawn;
e.layer('day').alpha = d;
e.layer('glow').alpha = d;
e.layer('stars').alpha = Math.max(0, 1 - d * 1.6) * 0.8;
e.layer('sun').y = -0.09 * d;
e.layer('sun').alpha = Math.min(1, d * 3);
