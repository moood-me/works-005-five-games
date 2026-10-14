g.fillStyle = '#2c2218';
g.beginPath(); g.moveTo(-2.1, -0.55); g.quadraticCurveTo(-1.8, 0.0, -1.0, 0.02); g.lineTo(1.2, 0.02); g.quadraticCurveTo(2.0, -0.1, 2.3, -0.62); g.quadraticCurveTo(0, -0.42, -2.1, -0.55); g.closePath(); g.fill();
g.fillStyle = '#8a7a60'; g.fillRect(-1.9, -0.5, 4.0, 0.05);
g.fillStyle = '#4a3a28'; g.fillRect(1.5, -1.5, 0.05, 1.0);
g.fillStyle = '#ffd890'; g.beginPath(); g.arc(1.52, -1.55, 0.07, 0, 6.28); g.fill();
e.light(1.52, -1.55, 1.3, '#ffb25e', 0.6, 'lamp');
e.layer('viewers', { box: [-2.2, -1.6, 2.4, 0.1] }, g => {
  g.fillStyle = '#1e2238';
  for (const x of [-0.9, -0.2, 0.55]) {
    g.beginPath(); g.ellipse(x, -0.5, 0.27, 0.3, 0, Math.PI, 0); g.fill();
    g.beginPath(); g.arc(x, -0.88, 0.13, 0, 6.28); g.fill();
  }
});
