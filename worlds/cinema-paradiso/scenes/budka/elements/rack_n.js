// by the ports, right of projector 2: a shelf with spare reels and a lens case, a fuse box with its lever, a cable down
// the wall, the switch of the hall's lights
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4e4438' : '#4a3424'; g.fillRect(-0.42, -1.95, 0.84, 0.04);
if (!ruin) {
  for (const x of [-0.3, -0.05]) { g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(x, -2.13, 0.16, 0, Math.PI * 2); g.fill(); g.fillStyle = '#26272b'; g.beginPath(); g.arc(x, -2.13, 0.11, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#2a2520'; g.fillRect(0.12, -2.08, 0.26, 0.13);
}
g.fillStyle = ruin ? '#5a5248' : '#3a3a3e'; g.fillRect(-0.2, -1.6, 0.4, 0.5);
g.fillStyle = ruin ? '#3a3632' : '#4a4a50'; g.fillRect(-0.17, -1.57, 0.34, 0.44);
g.fillStyle = ruin ? '#6a3a26' : '#8a3a28'; g.fillRect(0.12, -1.45, 0.03, 0.16);
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.015; g.beginPath(); g.moveTo(0, -1.1); g.lineTo(0, -0.1); g.stroke();
g.fillStyle = ruin ? '#7a7266' : '#c8bca4'; g.fillRect(-0.06, -0.95, 0.12, 0.16); g.fillStyle = '#2a2420'; g.fillRect(-0.015, -0.92, 0.03, 0.08);
