// The balcony's stone floor (a plane from above; metres, y toward the viewer).
g.fillStyle = '#8c8a92'; g.fillRect(-1.7, -0.55, 3.4, 1.1);
g.strokeStyle = 'rgba(40,40,50,0.35)'; g.lineWidth = 0.015;
for (let x = -1.7; x < 1.7; x += 0.4) { g.beginPath(); g.moveTo(x, -0.55); g.lineTo(x, 0.55); g.stroke(); }
