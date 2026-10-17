// the Sarafanovs' door: planks under old padded oilcloth, studded, a handle; painted from its hinge (x 0) to its free
// edge (0.9). Turned open by `door` (its place's facing, door_f).
g.fillStyle = '#4f3a2c';
g.fillRect(0, -1.95, 0.9, 1.95);
g.fillStyle = '#5e463a';
g.fillRect(0.06, -1.88, 0.78, 1.82);
g.fillStyle = '#9a8a70';
for (let y = -1.8; y < -0.1; y += 0.28) for (let x = 0.12; x < 0.85; x += 0.22) {
  g.beginPath();
  g.arc(x, y, 0.012, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#2a2420';
g.fillRect(0.74, -1.02, 0.05, 0.14);
