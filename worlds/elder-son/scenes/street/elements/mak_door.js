// Makarskaya's door: painted planks, faded green; from its hinge (x 0) to its free edge (0.9).
g.fillStyle = '#3f5048';
g.fillRect(0, -1.95, 0.9, 1.95);
g.strokeStyle = 'rgba(20,26,22,0.6)';
g.lineWidth = 0.02;
for (let x = 0.15; x < 0.9; x += 0.15) {
  g.beginPath();
  g.moveTo(x, -1.95);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = '#2a2420';
g.fillRect(0.74, -1.02, 0.05, 0.14);
