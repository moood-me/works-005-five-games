// The car's roof from above.
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
g.fillStyle = t === 'old' ? '#1c1d22' : '#525a6a';
g.beginPath(); g.roundRect(-0.68, -0.95, 1.36, 1.9, t === 'old' ? 0.45 : 0.12); g.fill();
