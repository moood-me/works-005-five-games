// The door to the hall: planks padded with old oilcloth, studded; from its hinge (x 0) to its free edge (0.9).
g.fillStyle = '#4f3a2c';
g.fillRect(0, -2.0, 0.9, 2.0);
g.fillStyle = '#5e463a';
g.fillRect(0.06, -1.93, 0.78, 1.86);
g.fillStyle = '#9a8a70';
for (let y = -1.85; y < -0.1; y += 0.28) for (let x = 0.12; x < 0.85; x += 0.22) {
  g.beginPath();
  g.arc(x, y, 0.012, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#2a2420';
g.fillRect(0.74, -1.05, 0.05, 0.14);
