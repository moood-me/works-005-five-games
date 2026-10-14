g.fillStyle = '#9a9486'; g.fillRect(-5, -15.5, 10, 31);
for (let r = 0; r < 20; r++) {
  const y = -15.5 + r * 1.6, off = (r % 2) * 0.75;
  for (let c = -1; c < 7; c++) {
    const x = -5 + off + c * 1.5;
    const k = e.rnd();
    g.fillStyle = k < 0.3 ? '#8a8476' : k < 0.6 ? '#a49e8e' : '#9a9486';
    g.fillRect(x, y, 1.5, 1.6);
  }
}
g.strokeStyle = '#847e70'; g.lineWidth = 0.035;
for (let r = 0; r <= 20; r++) { g.beginPath(); g.moveTo(-5, -15.5 + r * 1.6); g.lineTo(5, -15.5 + r * 1.6); g.stroke(); }
for (let r = 0; r < 20; r++) { const off = (r % 2) * 0.75; for (let c = -1; c < 8; c++) { const x = -5 + off + c * 1.5; g.beginPath(); g.moveTo(x, -15.5 + r * 1.6); g.lineTo(x, -15.5 + (r + 1) * 1.6); g.stroke(); } }
g.fillStyle = '#b9b3a2'; g.fillRect(-5, -15.5, 0.45, 31); g.fillRect(4.55, -15.5, 0.45, 31);
g.fillStyle = '#5a564c'; g.fillRect(-4.55, -15.5, 0.06, 31); g.fillRect(4.49, -15.5, 0.06, 31);
g.fillStyle = 'rgba(40,50,70,0.25)';
for (let i = 0; i < 12; i++) { g.beginPath(); g.ellipse((e.rnd() - 0.5) * 8, (e.rnd() - 0.5) * 30, 0.5 + e.rnd() * 1.2, 0.3 + e.rnd() * 0.6, 0, 0, 6.28); g.fill(); }
