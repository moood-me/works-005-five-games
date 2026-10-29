// The corridor's outer wall (its x runs from the corridor's near end, z 20.5, back): plaster, a brown dado, playbills
// in frames, a row of coat hooks; two lamps' brackets (their light — the scene's corridor lamps).
g.fillStyle = '#d2c3a2'; g.fillRect(0, -3.55, 14.5, 3.55);
g.fillStyle = '#5a4634'; g.fillRect(0, -1.0, 14.5, 1.0);
g.fillStyle = '#7a6046'; g.fillRect(0, -1.04, 14.5, 0.05);
for (const [x, w, h] of [[2.0, 0.7, 0.95], [6.4, 0.6, 0.85], [8.2, 0.7, 0.95], [12.4, 0.6, 0.85]]) {
  g.fillStyle = '#4a3a2c'; g.fillRect(x - w / 2 - 0.04, -2.24, w + 0.08, h + 0.08);
  g.fillStyle = '#e8e0cc'; g.fillRect(x - w / 2, -2.2, w, h);
  g.fillStyle = 'rgba(60,50,40,0.6)';
  for (let i = 0; i < 6; i++) g.fillRect(x - w / 2 + 0.08, -2.1 + i * 0.13, (w - 0.16) * (i === 0 ? 1 : 0.5 + anim.hash(i + x * 7, 3) * 0.5), i === 0 ? 0.07 : 0.03);
}
g.fillStyle = '#3a2e24'; g.fillRect(3.4, -1.75, 2.4, 0.06);
for (let x = 3.6; x < 5.8; x += 0.4) g.fillRect(x, -1.75, 0.03, 0.14);
g.fillStyle = '#3a3638'; g.beginPath(); g.ellipse(4.0, -1.35, 0.22, 0.42, 0, 0, Math.PI * 2); g.fill();
for (const x of [9.5, 3.7]) {
  g.fillStyle = '#8a7046'; g.fillRect(x - 0.02, -2.4, 0.04, 0.25);
  g.fillStyle = '#f2e6c4'; g.beginPath(); g.ellipse(x, -2.48, 0.09, 0.11, 0, 0, Math.PI * 2); g.fill();
}
