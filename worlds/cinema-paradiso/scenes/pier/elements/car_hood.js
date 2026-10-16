// The car's bonnet from above.
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
g.fillStyle = t === 'old' ? '#1a1b20' : '#4f5767';
g.beginPath(); g.roundRect(-0.82, -0.6, 1.64, 1.2, t === 'old' ? 0.35 : 0.06); g.fill();
