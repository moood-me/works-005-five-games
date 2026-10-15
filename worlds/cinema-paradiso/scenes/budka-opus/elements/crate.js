
// the boy's crate: a wooden box stencilled with a film company's name
g.fillStyle = '#6b5236'; g.fillRect(-0.25, -0.4, 0.5, 0.4);
g.strokeStyle = '#4a3824'; g.lineWidth = 0.015; for (let y = -0.4; y < 0; y += 0.1) { g.beginPath(); g.moveTo(-0.25, y); g.lineTo(0.25, y); g.stroke(); }
g.save(); g.scale(0.01, 0.01); g.fillStyle = 'rgba(30,24,20,0.6)'; g.font = '700 5px sans-serif'; g.textAlign = 'center'; g.fillText('TITANUS', 0, -17); g.restore();
