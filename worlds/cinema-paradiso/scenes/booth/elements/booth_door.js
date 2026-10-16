// The door's leaf, painted from its hinge (z 0.1, at x 0) along the wall: planks, a brace, a latch; it opens into
// the room and at door 1 lies along the opposite wall — over the calendar (door_f, the script's)
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#7a6c5c' : '#8a6a4a'; g.fillRect(-0.9, -2.0, 0.9, 2.0);
for (let x = -0.9, k = 0; x < 0; x += 0.15, k++) { g.fillStyle = ruin ? (k % 2 ? '#827462' : '#766856') : k % 2 ? '#93734f' : '#866647'; g.fillRect(x, -2.0, 0.14, 2.0); }
g.fillStyle = ruin ? '#5e5244' : '#6a4c32'; g.fillRect(-0.87, -1.7, 0.84, 0.1); g.fillRect(-0.87, -0.45, 0.84, 0.1);
g.save(); g.translate(-0.45, -1.07); g.rotate(1.2); g.fillRect(-0.62, -0.05, 1.24, 0.1); g.restore();
g.fillStyle = '#2a2724'; g.fillRect(-0.84, -1.05, 0.08, 0.04);
e.at(-0.82, -1.03, 'edge');
