// A steamer far off on the horizon ahead to starboard, her smoke: broadside, going away (layer `side`), then turned toward
// the boat — bow on, her smoke straight up behind her (layer `bow`); the animate shows her by `steamer` and turns
// her by `steamer_turn`. Point steamer#ship.
const L = e.lib;
e.layer('side', {}, g => {
  g.scale(1.6, 1.6);
  L.poly(g, [[-30, 0], [34, 0], [28, -6], [-26, -6]], '#2e3034');
  L.rect(g, -18, -10, 30, 4, '#d8d2c2');
  L.rect(g, -3, -22, 5, 12, '#2a2a2c');
  L.rect(g, -24, -30, 0.9, 24, '#3a3c40');
  L.rect(g, 20, -28, 0.9, 22, '#3a3c40');
  g.fillStyle = 'rgba(70,70,72,0.6)';
  for (let i = 0; i < 14; i++) { const u = i / 13; g.beginPath(); g.ellipse(-0.5 + u * 70, -24 - 20 * Math.pow(u, 0.7), 4 + 10 * u, 2.5 + 5 * u, 0, 0, Math.PI * 2); g.fill(); }
});
e.layer('bow', {}, g => {
  g.scale(1.6, 1.6);
  L.poly(g, [[-6, 0], [6, 0], [4.5, -7], [-4.5, -7]], '#2e3034');
  L.rect(g, -5, -11, 10, 4, '#d8d2c2');
  L.rect(g, -2.4, -23, 4.8, 12, '#2a2a2c');
  L.rect(g, -0.45, -32, 0.9, 25, '#3a3c40');
  g.fillStyle = 'rgba(70,70,72,0.6)';
  for (let i = 0; i < 12; i++) { const u = i / 11; g.beginPath(); g.ellipse(4 * u, -25 - 55 * u, 3 + 9 * u, 3 + 6 * u, 0, 0, Math.PI * 2); g.fill(); }
});
e.at(0, -19, 'ship');
