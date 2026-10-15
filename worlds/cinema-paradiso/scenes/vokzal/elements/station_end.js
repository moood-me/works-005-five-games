// The station's east end wall (its face east): the same lime-washed stone, one shuttered window, the gutter's pipe —
// seen along the platform it makes the station a house, not a sheet.
const now = e.state.era === 'now', W = 6, H = 7.2;
g.fillStyle = now ? '#9d9585' : '#c6b18d'; g.fillRect(-W / 2, -H, W, H);
g.fillStyle = now ? '#8a8476' : '#b49e7a'; g.fillRect(-W / 2, -H, W, 0.4); g.fillRect(-W / 2, -3.6, W, 0.18); g.fillRect(-W / 2, -0.6, W, 0.6);
g.fillStyle = now ? '#3a3e40' : '#3c3a36'; g.fillRect(-0.55, -6.3, 1.1, 1.8);
g.fillStyle = now ? '#506058' : '#5e7a5a'; g.fillRect(-1.0, -6.3, 0.42, 1.8); g.fillRect(0.58, -6.3, 0.42, 1.8);
g.fillStyle = '#4a4a46'; g.fillRect(W / 2 - 0.3, -H + 0.4, 0.08, H - 0.4);
