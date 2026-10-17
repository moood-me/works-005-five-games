// the curtain's rod and rings over the side door (hall side); gone in 1988
if (e.state.era === 'ruin') return;
const W = 2.0, H = 2.62;
g.fillStyle = '#7a5a3a'; g.fillRect(-0.05, -H - 0.04, W + 0.1, 0.05);   // the rod
for (let x = 0; x <= W; x += 0.25) { g.fillStyle = '#b08848'; g.beginPath(); g.arc(x, -H - 0.015, 0.025, 0, Math.PI * 2); g.fill(); }
