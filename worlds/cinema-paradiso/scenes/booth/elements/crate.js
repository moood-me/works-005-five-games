// the boy's crate (a form: a box of planks 0.5 × 0.35 × 0.4, its anchor at its front face): stencilled with a film
// company's name on its front and back
g.fillStyle = '#6b5236'; g.fillRect(-0.85, -0.4, 1.7, 0.4);
g.strokeStyle = '#4a3824'; g.lineWidth = 0.015; for (let y = -0.4; y < 0; y += 0.1) { g.beginPath(); g.moveTo(-0.85, y); g.lineTo(0.85, y); g.stroke(); }
g.fillStyle = '#4a3824'; for (const x of [-0.85, -0.35, 0, 0.5]) g.fillRect(x, -0.4, 0.025, 0.4);
g.save(); g.scale(0.01, 0.01); g.fillStyle = 'rgba(30,24,20,0.6)'; g.font = '700 5px sans-serif'; g.textAlign = 'center'; g.fillText('TITANUS', -60, -17); g.fillText('TITANUS', 25, -17); g.restore();
e.form(e.lib.boxForm(0.5, 0.35, 0.4, 0), { closed: 'u' });
