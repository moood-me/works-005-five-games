// the stage's boards from above
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5e554a' : '#3e2a1c'; g.fillRect(-6.5, -0.9, 13, 1.8);
g.strokeStyle = ruin ? '#4c443b' : '#33231a'; g.lineWidth = 0.02;
for (let y = -0.9; y < 0.9; y += 0.18) { g.beginPath(); g.moveTo(-6.5, y); g.lineTo(6.5, y); g.stroke(); }
