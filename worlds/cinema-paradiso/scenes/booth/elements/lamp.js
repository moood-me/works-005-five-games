// the lamp over the bench: a cord from the ceiling, an enamel shade, its bulb (the scene's light lamp_light); in 1988
// a bare socket, the shade cracked
const ruin = e.state.era === 'ruin';
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.012; g.beginPath(); g.moveTo(0, -0.98); g.lineTo(0, -0.12); g.stroke();
g.fillStyle = ruin ? '#3a4038' : '#2a3a32'; g.beginPath(); g.moveTo(-0.16, 0); g.lineTo(-0.06, -0.12); g.lineTo(0.06, -0.12); g.lineTo(0.16, 0); g.closePath(); g.fill();
g.fillStyle = ruin ? '#8a8478' : '#d8d0b8'; g.beginPath(); g.ellipse(0, 0, 0.16, 0.025, 0, 0, Math.PI * 2); g.fill();
if (!ruin) e.light(0, 0.0, 0.06, '#ffd09a', 1, 'bulb');
e.at(0, -0.05);
