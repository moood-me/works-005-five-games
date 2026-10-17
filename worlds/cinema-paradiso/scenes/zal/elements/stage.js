// The front of the low stage under the screen: dark panelled wood, a brass rail; in 1988 the panels split.
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4a4038' : '#3a2619'; g.fillRect(-6.5, -0.8, 13, 0.8);
for (let x = -6.2; x < 6.2; x += 1.3) { g.strokeStyle = ruin ? '#3a322b' : '#2a1a10'; g.lineWidth = 0.03; g.strokeRect(x + 0.08, -0.7, 1.12, 0.58); }
g.fillStyle = ruin ? '#6a6052' : '#8a6a3a'; g.fillRect(-6.5, -0.82, 13, 0.04);
if (ruin) { g.fillStyle = '#1e1a17'; g.beginPath(); g.moveTo(1.2, -0.7); g.lineTo(2.4, -0.2); g.lineTo(1.6, -0.1); g.closePath(); g.fill(); }
