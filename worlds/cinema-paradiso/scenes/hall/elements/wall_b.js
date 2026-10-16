// The back wall from the hall (facing north: its x runs to the world's left): plaster, the wainscot, the two doors
// out at the bottom, a cornice, the plaster frame round the lion (the head is its own element, right of the middle).
const P = e.lib, G = P.G, ruin = e.state.era === 'ruin', H = G.CEIL;
P.plaster(g, -6.5, -H - 0.05, 13, H + 0.05, ruin ? '#8a8378' : '#6a5640', 17, ruin);
g.fillStyle = ruin ? '#4d4339' : '#3a2619'; g.fillRect(-6.5, -1.25, 13, 1.25);
g.fillStyle = ruin ? '#6a6052' : '#6b5032'; g.fillRect(-6.5, -1.3, 13, 0.06);
for (const x of [5.2, -5.2]) {
  g.fillStyle = ruin ? '#2e2823' : '#2a1a10'; g.fillRect(x - 0.75, -2.5, 1.5, 2.5);
  g.fillStyle = ruin ? '#3e362e' : '#3e2818'; g.fillRect(x - 0.68, -2.42, 0.64, 2.42); g.fillRect(x + 0.04, -2.42, 0.64, 2.42);
  if (ruin) { g.fillStyle = '#6a5a44'; g.fillRect(x - 0.8, -1.7, 1.6, 0.14); g.fillRect(x - 0.8, -0.9, 1.6, 0.14); }   // boarded
}
g.fillStyle = ruin ? '#7f786c' : '#675340'; g.fillRect(-6.5, -H + 0.3, 13, 0.18);
g.fillStyle = ruin ? '#958e82' : '#7c664c';
const lx = -G.LION[0];                                         // (this card's x runs to the world's left)
g.fillRect(lx - 1.6, -6.3, 3.2, 0.12); g.fillRect(lx - 1.6, -3.05, 3.2, 0.12); g.fillRect(lx - 1.6, -6.3, 0.12, 3.37); g.fillRect(lx + 1.48, -6.3, 0.12, 3.37);
