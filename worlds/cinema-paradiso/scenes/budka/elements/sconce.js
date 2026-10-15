// a small enamel wall lamp over the rack: its bulb a second warm light in the booth (out in 1988)
const ruin = e.state.era === 'ruin';
g.fillStyle = '#2a2420'; g.fillRect(-0.02, -0.18, 0.04, 0.1);
g.fillStyle = ruin ? '#5a5650' : '#2a3a32'; g.beginPath(); g.moveTo(-0.09, 0); g.lineTo(-0.04, -0.09); g.lineTo(0.04, -0.09); g.lineTo(0.09, 0); g.closePath(); g.fill();
if (!ruin) e.light(0, 0.01, 0.05, '#ffd09a', 0.9, 'bulb');
