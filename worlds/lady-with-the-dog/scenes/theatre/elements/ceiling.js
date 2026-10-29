// The ceiling (seen from below): a painted sky-blue oval with a rosette round the chandelier's hook, a gilt border.
g.fillStyle = '#d2c6ae'; g.fillRect(-7, -24.1, 14, 24.15);
g.fillStyle = '#9fb0bc'; g.beginPath(); g.ellipse(0, -12.5, 5.6, 7.5, 0, 0, Math.PI * 2); g.fill();
g.strokeStyle = '#c4a463'; g.lineWidth = 0.18; g.stroke();
g.fillStyle = '#c4a463'; g.beginPath(); g.arc(0, -12.5, 0.9, 0, Math.PI * 2); g.fill();
g.fillStyle = '#e8dcc0';
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; g.beginPath(); g.ellipse(Math.cos(a) * 1.5, -12.5 + Math.sin(a) * 1.5, 0.45, 0.16, a, 0, Math.PI * 2); g.fill(); }
