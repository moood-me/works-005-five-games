// The floor from above (x across, y toward the start): a dark carpet, a runner down each side
g.fillStyle = '#2a1e1c'; g.fillRect(-3.6, -5.5, 7.2, 11);
g.fillStyle = '#3a2224'; g.fillRect(-3.5, -5.5, 0.7, 11); g.fillRect(2.8, -5.5, 0.7, 11);
for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,240,220,0.02)'; g.fillRect(-3.6 + e.anim.hash(i, 3) * 7, -5.5 + e.anim.hash(i, 4) * 11, 0.4, 0.4); }
