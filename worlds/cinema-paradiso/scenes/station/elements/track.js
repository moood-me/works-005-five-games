
// the track's bed from above: ballast, sleepers, the two rails (the line's middle — z 5.6 — at the plane's y 1.4)
const now = e.state.era === 'now';
g.fillStyle = now ? '#5c5852' : '#8a8274'; g.fillRect(-200, -2.5, 400, 5);
const y0 = 1.4;
g.fillStyle = now ? '#3a3430' : '#5a4636'; for (let x = -200; x < 200; x += 0.65) g.fillRect(x, y0 - 1.25, 0.22, 2.5);
g.fillStyle = now ? '#7a7a80' : '#9a9aa0'; g.fillRect(-200, y0 - 0.75, 400, 0.07); g.fillRect(-200, y0 + 0.68, 400, 0.07);
