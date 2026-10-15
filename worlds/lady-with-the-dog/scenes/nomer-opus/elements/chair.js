// A bentwood chair seen from its side, its back on the right against the wall (he sits facing left, to her).
g.scale(-1, 1);
g.strokeStyle = '#3a2a20'; g.lineWidth = 0.035; g.lineCap = 'round';
g.beginPath();
g.moveTo(-0.2, 0); g.lineTo(-0.17, -0.46); g.moveTo(0.2, 0); g.lineTo(0.17, -0.46);
g.moveTo(-0.17, -0.46); g.bezierCurveTo(-0.24, -0.7, -0.26, -0.85, -0.2, -0.98);
g.moveTo(-0.2, -0.98); g.quadraticCurveTo(-0.12, -1.0, -0.14, -0.7);
g.stroke();
g.fillStyle = '#4a3428'; g.fillRect(-0.21, -0.48, 0.42, 0.05);
g.beginPath(); g.ellipse(0, -0.2, 0.18, 0.02, 0, 0, Math.PI * 2); g.lineWidth = 0.02; g.stroke();
