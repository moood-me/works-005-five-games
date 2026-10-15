
g.fillStyle = '#5a5248'; g.fillRect(-0.6, -1.2, 1.2, 2.4);
g.strokeStyle = '#4a4238'; g.lineWidth = 0.02; for (let y = -1.2; y < 1.2; y += 0.3) { g.beginPath(); g.moveTo(-0.6, y); g.lineTo(0.6, y); g.stroke(); }
