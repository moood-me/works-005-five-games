// A telegraph pole along the line: a weathered post, its crossarm with white insulators, a cap of snow. Metres.
g.fillStyle = '#4a3e34';
g.beginPath();
g.moveTo(-0.13, 0.1);
g.lineTo(-0.09, -7.6);
g.lineTo(0.09, -7.6);
g.lineTo(0.13, 0.1);
g.closePath();
g.fill();
g.fillRect(-0.85, -7.1, 1.7, 0.13);
g.fillRect(-0.6, -6.4, 1.2, 0.1);
g.fillStyle = '#e2e0da';
for (const x of [-0.75, -0.3, 0.3, 0.75]) g.fillRect(x - 0.04, -7.28, 0.08, 0.18);
for (const x of [-0.5, 0.5]) g.fillRect(x - 0.04, -6.56, 0.08, 0.16);
g.fillStyle = '#e8eef5';
g.fillRect(-0.86, -7.14, 1.72, 0.05);
g.fillRect(-0.1, -7.66, 0.2, 0.07);
