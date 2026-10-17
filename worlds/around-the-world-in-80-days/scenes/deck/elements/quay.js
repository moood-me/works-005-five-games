// The quay alongside to starboard (Suez's mole, a New York pier, a Liverpool dock), seen from above: stone or planks,
// the edge by the ship, bollards; empty for a port without one (the sea shows through).
const L = e.lib, port = L.portOf(e.state);
if (L.quayed(port)) {
  const stone = port === 'new_york' ? '#8a7a64' : port === 'suez' ? '#cbb48e' : '#7c7670';
  L.rect(g, -24, -80, 48, 160, stone);
  g.strokeStyle = L.shade(stone, 0.18);
  g.lineWidth = 0.06;
  if (port === 'new_york') for (let x = -24; x <= 24; x += 0.3) { g.beginPath(); g.moveTo(x, -80); g.lineTo(x, 80); g.stroke(); }
  else for (let y = -80; y <= 80; y += 1.2) { g.beginPath(); g.moveTo(-24, y); g.lineTo(24, y); g.stroke(); }
  // the edge by the ship, its kerb and the bollards
  L.rect(g, -24, -80, 0.6, 160, L.shade(stone, 0.3));
  g.fillStyle = '#2a2a2c';
  for (let y = -70; y <= 70; y += 14) { g.beginPath(); g.arc(-22.8, y, 0.3, 0, Math.PI * 2); g.fill(); }
  // rails for the cranes (Liverpool), crates and bales
  if (port === 'liverpool') { L.rect(g, -14, -80, 0.15, 160, '#4a4644'); L.rect(g, -11, -80, 0.15, 160, '#4a4644'); }
  for (let i = 0; i < 14; i++) { const x = -18 + 30 * e.rnd(), y = -70 + 140 * e.rnd(); L.rect(g, x, y, 1.2 + e.rnd(), 1 + e.rnd(), port === 'suez' ? '#a8865a' : '#6a5440'); }
}
