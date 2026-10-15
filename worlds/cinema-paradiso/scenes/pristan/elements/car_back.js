// The car's back: the boot, the bumper, two small red lamps.
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
const old = t === 'old';
g.fillStyle = old ? '#17181d' : '#4b5363';
g.beginPath();
if (old) { g.moveTo(-0.85, -0.3); g.lineTo(-0.86, -0.82); g.quadraticCurveTo(-0.4, -1.42, 0, -1.45); g.quadraticCurveTo(0.4, -1.42, 0.86, -0.82); g.lineTo(0.85, -0.3); }
else { g.moveTo(-0.86, -0.3); g.lineTo(-0.87, -0.9); g.lineTo(-0.6, -0.95); g.lineTo(-0.55, -1.36); g.lineTo(0.55, -1.36); g.lineTo(0.6, -0.95); g.lineTo(0.87, -0.9); g.lineTo(0.86, -0.3); }
g.closePath(); g.fill();
g.fillStyle = '#1d2738'; g.fillRect(-0.4, -1.3, 0.8, 0.26);
g.fillStyle = old ? '#b9b6ad' : '#7e8490'; g.fillRect(-0.9, -0.38, 1.8, 0.08);
g.fillStyle = '#b8231e'; for (const x of [-0.66, 0.66]) g.fillRect(x - 0.07, -0.78, 0.14, old ? 0.1 : 0.16);
e.light(-0.66, -0.72, 0.06, '#ff3a2a', 0.7, 'tail_l');
e.light(0.66, -0.72, 0.06, '#ff3a2a', 0.7, 'tail_r');
