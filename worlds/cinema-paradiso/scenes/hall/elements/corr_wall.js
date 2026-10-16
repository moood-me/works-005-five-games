// the corridor's far wall (it faces the door): limewash gone dim, a stair's banister going up to the booth
g.fillStyle = '#5e5650'; g.fillRect(-3.5, -3.2, 7, 3.2);
g.fillStyle = '#3e3832'; g.fillRect(-3.5, -1.0, 7, 1.0);
g.strokeStyle = '#2c2621'; g.lineWidth = 0.05;
g.beginPath(); g.moveTo(-2.5, -1.0); g.lineTo(1.2, -3.0); g.stroke();
for (let k = 0; k < 9; k++) { const x = -2.3 + k * 0.42, y = -1.0 - (x + 2.5) * 0.54; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 0.9); g.stroke(); }
