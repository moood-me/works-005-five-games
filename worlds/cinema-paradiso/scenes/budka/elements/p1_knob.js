// the crank's wooden handle sticking out of the inner side, seen from behind: it rises and falls as the crank turns
e.layer('k', {}, l => {
  l.fillStyle = '#2a2622'; l.fillRect(-0.035, -0.012, 0.03, 0.024);
  l.fillStyle = e.state.era === 'ruin' ? '#5a3a26' : '#9a6a3e'; l.beginPath(); l.ellipse(0.012 * 1, 0, 0.026, 0.036, 0, 0, Math.PI * 2); l.fill();
  l.fillStyle = 'rgba(255,230,190,0.35)'; l.beginPath(); l.ellipse(0.004 * 1, -0.012, 0.01, 0.012, 0, 0, Math.PI * 2); l.fill();
});
