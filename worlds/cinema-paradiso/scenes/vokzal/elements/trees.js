
// an olive tree, grey-green, crooked (copies along the field)
const now = e.state.era === 'now';
g.fillStyle = now ? '#3a3632' : '#5a4a3a'; g.beginPath(); g.moveTo(-0.15, 0); g.quadraticCurveTo(-0.3, -1.0, 0.05, -1.6); g.lineTo(0.2, -1.6); g.quadraticCurveTo(0.0, -1.0, 0.18, 0); g.fill();
g.fillStyle = now ? '#4a5048' : '#7a8a6a';
for (const [x, y, r] of [[-0.8, -2.2, 0.9], [0.5, -2.4, 1.0], [-0.1, -3.0, 0.9], [0.9, -1.9, 0.6]]) { g.beginPath(); g.ellipse(x, y, r, r * 0.65, 0, 0, Math.PI * 2); g.fill(); }
