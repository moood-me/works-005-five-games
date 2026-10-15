
// The wall calendar of 1958, open at August: a printed picture above (a bay with boats), the month's grid below; the
// lines Elena writes in pencil are four layers shown one after another by `written`.
g.fillStyle = '#d8cfb8'; g.fillRect(-0.22, -0.7, 0.44, 0.68);
g.fillStyle = '#6a8ca0'; g.fillRect(-0.19, -0.67, 0.38, 0.22);
g.fillStyle = '#c9b48a'; g.beginPath(); g.moveTo(-0.19, -0.5); g.quadraticCurveTo(0, -0.56, 0.19, -0.48); g.lineTo(0.19, -0.45); g.lineTo(-0.19, -0.45); g.fill();
g.fillStyle = '#3a3a40'; g.fillRect(-0.06, -0.53, 0.05, 0.015); g.fillRect(0.05, -0.51, 0.04, 0.012);
g.save(); g.scale(0.01, 0.01); g.fillStyle = '#7a2a22'; g.font = '700 3.5px serif'; g.textAlign = 'center'; g.fillText('AGOSTO 1958', 0, -40); g.restore();
g.strokeStyle = 'rgba(60,50,40,0.5)'; g.lineWidth = 0.002;
for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) g.strokeRect(-0.19 + c * 0.054, -0.37 + r * 0.055, 0.054, 0.055);
g.fillStyle = '#4a4440'; g.fillRect(-0.01, -0.73, 0.02, 0.03);
for (let k = 0; k < 4; k++) e.layer('line' + k, {}, l => {
  l.strokeStyle = 'rgba(50,46,48,0.85)'; l.lineWidth = 0.004;
  const y = -0.33 + k * 0.06; l.beginPath(); l.moveTo(-0.17, y);
  for (let x = -0.17; x < 0.15 - (k === 3 ? 0.12 : 0); x += 0.012) l.lineTo(x + 0.006, y + Math.sin(x * 180 + k) * 0.006);
  l.stroke();
});
e.at(0, -0.35, 'page');
