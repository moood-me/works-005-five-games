// The hotel room's floor: parquet in a herringbone, a worn dark carpet in the middle (a plane from above; metres,
// y toward the viewer; the back wall at y −3.4).
const rnd = e.rnd;
g.fillStyle = '#6d5440'; g.fillRect(-2.7, -3.4, 5.4, 6.8);
g.strokeStyle = 'rgba(40,28,20,0.45)'; g.lineWidth = 0.012;
for (let y = -3.4; y < 3.4; y += 0.3) for (let x = -2.7; x < 2.7; x += 0.3) {
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + 0.15, y + 0.15); g.lineTo(x + 0.3, y); g.stroke();
}
g.fillStyle = '#5a5866'; g.fillRect(-2.0, -2.2, 3.6, 3.2);
g.strokeStyle = '#8e8a84'; g.lineWidth = 0.06; g.strokeRect(-1.9, -2.1, 3.4, 3.0);
g.strokeStyle = 'rgba(160,150,130,0.35)'; g.lineWidth = 0.03; g.strokeRect(-1.7, -1.9, 3.0, 2.6);
