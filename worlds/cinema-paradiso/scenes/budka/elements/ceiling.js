// the low ceiling seen from below, smoke-darkened over the projectors; in 1988 a hole with a lath showing
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4a443c' : '#4a4036'; g.fillRect(-2.1, -3.65, 4.2, 3.7);
if (!ruin) { const sm = g.createRadialGradient(0, -0.6, 0.2, 0, -0.6, 1.4); sm.addColorStop(0, 'rgba(20,16,12,0.22)'); sm.addColorStop(1, 'rgba(20,16,12,0)'); g.fillStyle = sm; g.fillRect(-2.1, -2.0, 4.2, 2.0); }
g.fillStyle = '#3a3128'; g.fillRect(-2.1, -1.9, 4.2, 0.12);
if (ruin) { g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(-0.9, -2.4, 0.35, 0.22, 0.3, 0, Math.PI * 2); g.fill(); }
