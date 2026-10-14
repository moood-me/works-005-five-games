// the stone mole seen from above: courses of big blocks, weathered
g.fillStyle = '#3b4259'; g.fillRect(-3, -22, 6, 44);
for (let r = -22; r < 22; r += 1.2) {
  g.fillStyle = 'rgba(20,26,44,0.5)'; g.fillRect(-3, r, 6, 0.05);
  const off = (Math.round(r) % 2) * 0.8;
  for (let c = -3 + off; c < 3; c += 1.9) { g.fillRect(c, r, 0.05, 1.2); }
}
for (let i = 0; i < 160; i++) {
  g.globalAlpha = 0.12; g.fillStyle = e.rnd() < 0.5 ? '#2a3350' : '#9aa3bb';
  g.fillRect(-3 + e.rnd() * 6, -22 + e.rnd() * 44, 0.1 + e.rnd() * 0.5, 0.05 + e.rnd() * 0.2);
}
g.globalAlpha = 1;
g.fillStyle = '#505a74'; g.fillRect(-3, -22, 0.25, 44); g.fillRect(2.75, -22, 0.25, 44);
