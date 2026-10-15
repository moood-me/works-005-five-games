// the low ceiling seen from below, smoke-darkened over the projectors; in 1988 a hole with a lath showing
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4a443c' : '#4a4036'; g.fillRect(-2.1, -3.65, 4.2, 3.7);
g.fillStyle = 'rgba(20,16,12,0.14)'; for (const x of [-0.75, 0.75]) { g.beginPath(); g.ellipse(x, -0.6, 0.6, 0.5, 0, 0, Math.PI * 2); g.fill(); }
g.fillStyle = '#3a3128'; g.fillRect(-2.1, -1.9, 4.2, 0.12);
if (ruin) { g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(-0.9, -2.4, 0.35, 0.22, 0.3, 0, Math.PI * 2); g.fill(); }
