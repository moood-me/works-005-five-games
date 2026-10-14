e.layer('glow').alpha = 1 - 0.55 * (e.state.night || 0);
e.layer('stars').alpha = 0.45 + 0.55 * (e.state.night || 0);
