// the projector table: plank on trestles, the projector, a tarpaulin layer
g.fillStyle = '#3d342e'; g.fillRect(-0.9, -0.95, 1.8, 0.07);
g.fillStyle = '#2c2622'; g.fillRect(-0.8, -0.88, 0.07, 0.88); g.fillRect(0.73, -0.88, 0.07, 0.88);
g.fillStyle = '#26262e'; g.fillRect(-0.45, -1.42, 0.8, 0.47);
g.fillStyle = '#1b1b22'; g.fillRect(-0.4, -1.78, 0.28, 0.36); g.fillRect(0.0, -1.78, 0.28, 0.36);
g.fillStyle = '#3b3b46'; g.beginPath(); g.arc(-0.26, -1.6, 0.15, 0, 7); g.fill(); g.beginPath(); g.arc(0.14, -1.6, 0.15, 0, 7); g.fill();
g.fillStyle = '#4a4a56'; g.fillRect(0.35, -1.3, 0.28, 0.2);
g.fillStyle = '#c9a56a'; g.beginPath(); g.arc(0.63, -1.2, 0.07, 0, 7); g.fill();
e.at(-0.05, -1.35, 'projector');
e.layer('cover', { box: [-0.9, -2.2, 0.9, 0.2] }, h => {
  h.fillStyle = '#6a6e62'; h.beginPath(); h.moveTo(-0.65, -0.95); h.quadraticCurveTo(-0.6, -1.95, 0.1, -1.9); h.quadraticCurveTo(0.7, -1.9, 0.75, -0.95); h.closePath(); h.fill();
  h.strokeStyle = '#4a4d43'; h.lineWidth = 0.03; h.beginPath(); h.moveTo(-0.2, -1.9); h.lineTo(-0.1, -0.95); h.moveTo(0.3, -1.88); h.lineTo(0.35, -0.95); h.stroke();
});
