// A telegraph pole: grey weathered wood, two cross-arms with white insulators (metres, origin at its foot).
g.fillStyle = '#5a524b';
g.beginPath(); g.moveTo(-0.13, 0); g.lineTo(-0.09, -7.5); g.lineTo(0.09, -7.5); g.lineTo(0.13, 0); g.closePath(); g.fill();
g.fillStyle = '#4c4640';
g.fillRect(-0.75, -7.12, 1.5, 0.12);
g.fillRect(-0.55, -6.52, 1.1, 0.12);
g.fillStyle = '#e3e0d8';
for (const x of [-0.65, -0.25, 0.25, 0.65]) { g.beginPath(); g.ellipse(x, -7.2, 0.05, 0.08, 0, 0, Math.PI * 2); g.fill(); }
for (const x of [-0.45, 0.45]) { g.beginPath(); g.ellipse(x, -6.6, 0.05, 0.08, 0, 0, Math.PI * 2); g.fill(); }
