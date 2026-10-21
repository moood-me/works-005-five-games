// The cabin's roof from above: planks across, a skylight, a rail round it (Speedy salutes from here at Queenstown).
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => {
  L.rect(g, -1.55, -1.85, 3.1, 3.7, L.tint(c.deck, 0.05));
  g.fillStyle = L.shade(c.deck, 0.3);
  for (let y = -1.85; y < 1.85; y += 0.15) g.fillRect(-1.55, y, 3.1, 0.015);
  L.rect(g, -0.5, -0.6, 1.0, 0.9, c.trim);
  L.rect(g, -0.42, -0.52, 0.84, 0.74, '#3c4a52');
  L.rect(g, -1.55, -1.85, 3.1, 0.08, c.cap);
  L.rect(g, -1.55, -1.85, 0.08, 3.7, c.cap);
  L.rect(g, 1.47, -1.85, 0.08, 3.7, c.cap);
});
