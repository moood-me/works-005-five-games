// The car's front: grille, bumper, the two headlamps (their glow follows `headlights`, in animate).
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
const old = t === 'old', body = old ? '#17181d' : '#4b5363';
g.fillStyle = body;
g.beginPath();
if (old) { g.moveTo(-0.85, -0.3); g.lineTo(-0.86, -0.9); g.quadraticCurveTo(-0.6, -1.0, -0.42, -1.0); g.quadraticCurveTo(-0.3, -1.42, 0, -1.45); g.quadraticCurveTo(0.3, -1.42, 0.42, -1.0); g.quadraticCurveTo(0.6, -1.0, 0.86, -0.9); g.lineTo(0.85, -0.3); }
else { g.moveTo(-0.86, -0.3); g.lineTo(-0.87, -0.86); g.lineTo(-0.66, -0.9); g.lineTo(-0.58, -1.36); g.lineTo(0.58, -1.36); g.lineTo(0.66, -0.9); g.lineTo(0.87, -0.86); g.lineTo(0.86, -0.3); }
g.closePath(); g.fill();
g.fillStyle = '#1d2738'; g.fillRect(old ? -0.36 : -0.55, old ? -1.34 : -1.3, old ? 0.72 : 1.1, 0.33);
g.fillStyle = old ? '#b9b6ad' : '#7e8490';
if (old) { g.beginPath(); g.ellipse(0, -0.62, 0.22, 0.2, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2a2a2c'; for (let x = -0.16; x <= 0.16; x += 0.05) g.fillRect(x, -0.78, 0.015, 0.32); g.fillStyle = '#b9b6ad'; }
else { g.fillRect(-0.32, -0.74, 0.64, 0.2); g.fillStyle = '#2a2a2c'; for (let y = -0.72; y < -0.55; y += 0.04) g.fillRect(-0.3, y, 0.6, 0.012); g.fillStyle = '#7e8490'; }
g.fillRect(-0.9, -0.38, 1.8, 0.08);
g.fillStyle = '#f6efd8';
for (const x of [-0.6, 0.6]) {
  if (old) { g.beginPath(); g.arc(x, -0.72, 0.1, 0, Math.PI * 2); g.fill(); }
  else g.fillRect(x - 0.17, -0.74, 0.34, 0.13);
}
e.light(-0.6, -0.7, 0.14, '#ffefcc', 1, 'hl_l');
e.light(0.6, -0.7, 0.14, '#ffefcc', 1, 'hl_r');
