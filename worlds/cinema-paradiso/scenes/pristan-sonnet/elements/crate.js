g.fillStyle = '#8a6b45'; g.fillRect(-0.28, -0.42, 0.56, 0.42);
g.strokeStyle = '#5a4429'; g.lineWidth = 0.03;
g.strokeRect(-0.28, -0.42, 0.56, 0.42);
for (const y of [-0.28, -0.14]) { g.beginPath(); g.moveTo(-0.28, y); g.lineTo(0.28, y); g.stroke(); }
g.beginPath(); g.moveTo(-0.28, -0.42); g.lineTo(0.28, 0); g.stroke();
