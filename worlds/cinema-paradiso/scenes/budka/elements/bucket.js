// a red fire bucket of sand on the floor by the rack, and its hook
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5a2a22' : '#8a2a22'; g.beginPath(); g.moveTo(-0.13, -0.32); g.lineTo(0.13, -0.32); g.lineTo(0.1, 0); g.lineTo(-0.1, 0); g.closePath(); g.fill();
g.fillStyle = ruin ? '#7a7062' : '#c8b48a'; g.fillRect(-0.13, -0.33, 0.26, 0.03);
g.strokeStyle = '#2a2420'; g.lineWidth = 0.01; g.beginPath(); g.arc(0, -0.32, 0.12, Math.PI, 0); g.stroke();
g.fillStyle = '#2a2420'; g.fillRect(-0.02, -0.72, 0.04, 0.03);
