// The neighbours' door: boarded, painted brown long ago; from its hinge (x 0) to its free edge (0.9).
g.fillStyle = '#5a4433';
g.fillRect(0, -1.95, 0.9, 1.95);
g.strokeStyle = 'rgba(25,18,12,0.55)';
g.lineWidth = 0.02;
for (const y of [-1.6, -1.0, -0.4]) {
  g.beginPath();
  g.moveTo(0.05, y);
  g.lineTo(0.85, y + 0.3);
  g.stroke();
}
g.fillStyle = '#2a2420';
g.fillRect(0.74, -1.02, 0.05, 0.14);
