// The front door from inside: boards padded with old brown oilcloth under a lattice of studded strips; its handle and
// a hook. From its hinge (x 0) to its free edge (0.9); it turns by `door_f`.
g.fillStyle = '#4f3a2c';
g.fillRect(0, -2.0, 0.9, 2.0);
g.fillStyle = '#6a4a38';
g.fillRect(0.05, -1.95, 0.8, 1.9);
g.save();
g.beginPath();
g.rect(0.05, -1.95, 0.8, 1.9);
g.clip();
g.strokeStyle = '#a58d6c';
g.lineWidth = 0.012;
g.beginPath();
for (let k = -10; k <= 5; k++) {
  g.moveTo(0.05 + k * 0.2, -1.95);
  g.lineTo(0.05 + k * 0.2 + 1.9, -0.05);
  g.moveTo(0.85 - k * 0.2, -1.95);
  g.lineTo(0.85 - k * 0.2 - 1.9, -0.05);
}
g.stroke();
g.restore();
g.fillStyle = '#c2ad86';
for (let y = -1.85; y < 0; y += 0.2) for (let x = 0.15; x < 0.85; x += 0.2) {
  g.beginPath();
  g.arc(x, y, 0.012, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#2a2420';
g.fillRect(0.76, -1.08, 0.04, 0.16);
g.fillRect(0.74, -1.3, 0.06, 0.02);
