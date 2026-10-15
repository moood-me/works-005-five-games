// the corridor behind the side door, from above: bare stone flags
g.fillStyle = '#3b3530'; g.fillRect(-1.2, -3.5, 2.4, 7);
g.strokeStyle = '#2e2925'; g.lineWidth = 0.02;
for (let y = -3.5; y < 3.5; y += 0.5) { g.beginPath(); g.moveTo(-1.2, y); g.lineTo(1.2, y); g.stroke(); }
