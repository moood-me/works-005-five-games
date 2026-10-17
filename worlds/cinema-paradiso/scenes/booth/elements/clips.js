// the cut kisses lying on the bench (while `clips`)
if (!e.state.clips) return;
for (let i = 0; i < 3; i++) { g.save(); g.translate(-0.12 + i * 0.1, -0.012); g.rotate(-0.3 + i * 0.25); g.fillStyle = '#2a211b'; g.fillRect(-0.04, -0.01, 0.08, 0.02); g.fillStyle = '#e8e0c8'; g.fillRect(-0.01, -0.03, 0.012, 0.025); g.restore(); }
