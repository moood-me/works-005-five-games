// The bridge's rail along its aft edge (on the deckhouse's roof), the ship's wheel behind it on the port side (clear of
// whoever stands at the middle), its spokes.
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => {
  L.rect(g, -2.3, -1.05, 4.6, 0.08, c.cap);
  L.rect(g, -2.3, -0.55, 4.6, 0.04, c.cap);
  for (let x = -2.3; x <= 2.31; x += 0.58) L.rect(g, x - 0.03, -1.05, 0.06, 1.05, c.cap);
  // the wheel
  g.strokeStyle = L.shade(c.cap, 0.1);
  g.lineWidth = 0.06;
  g.beginPath();
  g.arc(-1.4, -1.1, 0.42, 0, Math.PI * 2);
  g.stroke();
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; L.line(g, [[-1.4, -1.1], [-1.4 + Math.cos(a) * 0.55, -1.1 + Math.sin(a) * 0.55]], L.shade(c.cap, 0.1), 0.04); }
  L.rect(g, -1.46, -1.1, 0.12, 1.1, L.shade(c.cap, 0.2));
});
