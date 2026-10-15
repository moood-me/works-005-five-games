
// the booth's floor from above: worn boards, dark at the projectors' feet, a scrap of film by the bench
g.fillStyle = '#4b3a2a'; g.fillRect(-2, -1.75, 4, 3.5);
for (let k = 0, x = -2; x < 2; x += 0.14, k++) { g.fillStyle = k % 2 ? '#523f2d' : '#473624'; g.fillRect(x, -1.75, 0.13, 3.5); }
g.fillStyle = 'rgba(20,14,10,0.35)';
for (const x of [-1.12, 0.12]) { g.beginPath(); g.ellipse(x, -0.8, 0.45, 0.35, 0, 0, Math.PI * 2); g.fill(); }
g.strokeStyle = '#2a2622'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(1.1, -0.9); g.quadraticCurveTo(1.3, -0.6, 1.0, -0.4); g.stroke();
