// The bed's top seen from above (metres, y toward the viewer): the pale coverlet, soft folds, a lace edge.
g.fillStyle = '#ebe5d8'; g.fillRect(-1.0, -0.5, 2.0, 1.0);
g.strokeStyle = 'rgba(150,135,115,0.25)'; g.lineWidth = 0.03;
for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-1.0 + i * 0.35, -0.5); g.bezierCurveTo(-0.9 + i * 0.35, -0.1, -1.05 + i * 0.36, 0.2, -0.95 + i * 0.35, 0.5); g.stroke(); }
g.fillStyle = '#f6f2ea'; g.fillRect(-1.0, 0.44, 2.0, 0.06);
