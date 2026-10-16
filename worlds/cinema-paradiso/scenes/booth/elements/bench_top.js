const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5a4e40' : '#5e4632'; g.fillRect(-0.25, -0.5, 0.5, 1.0);
g.fillStyle = 'rgba(30,20,12,0.25)'; for (let i = 0; i < 6; i++) g.fillRect(-0.25, -0.5 + i * 0.17, 0.5, 0.01);
if (!ruin) { g.fillStyle = '#a8a088'; g.fillRect(-0.15, 0.32, 0.03, 0.12); }
