// The deckhouse's roof — the bridge — from above (its far edge forward): planks across, the funnel's casing where it
// comes through, the binnacle, a rail along the sides.
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => {
  L.rect(g, -2.3, -4.1, 4.6, 8.2, L.tint(c.deck, 0.04));
  g.fillStyle = L.shade(c.deck, 0.3);
  for (let y = -4.1; y < 4.1; y += 0.15) g.fillRect(-2.3, y, 4.6, 0.015);
  g.fillStyle = L.shade(c.funnel, 0.1);
  g.beginPath();
  g.arc(0, -0.5, 1.25, 0, Math.PI * 2);
  g.fill();
  L.rect(g, -0.2, 2.7, 0.4, 0.4, '#b08a48');
  L.rect(g, -2.3, -4.1, 0.08, 8.2, c.cap);
  L.rect(g, 2.22, -4.1, 0.08, 8.2, c.cap);
});
