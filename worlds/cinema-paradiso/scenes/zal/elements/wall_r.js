// The right wall from the hall (x from the screen wall back to the back wall, 20.5 m): as the left one, no door.
const P = e.lib, G = P.G, ruin = e.state.era === 'ruin', H = G.CEIL, L = G.FRONT_Z - G.BACK_Z;
P.plaster(g, 0, -H - 0.05, L, H + 0.05, ruin ? '#8f887c' : '#6f5a44', 13, ruin);
g.fillStyle = ruin ? '#4d4339' : '#3a2619'; g.fillRect(0, -1.25, L, 1.25);
g.fillStyle = ruin ? '#5c5144' : '#4b3322'; for (let x = 0.3; x < L; x += 1.1) g.fillRect(x, -1.15, 0.9, 1.0);
g.fillStyle = ruin ? '#6a6052' : '#6b5032'; g.fillRect(0, -1.3, L, 0.06);
for (let x = 1.7; x < L - 0.5; x += 3.2) {
  g.fillStyle = ruin ? '#9b9486' : '#7c664c'; g.fillRect(x - 0.3, -H + 0.6, 0.6, H - 1.9);
  g.fillStyle = ruin ? '#867e72' : '#6a553e'; g.fillRect(x - 0.4, -H + 0.45, 0.8, 0.25); g.fillRect(x - 0.36, -1.36, 0.72, 0.1);
}
g.fillStyle = ruin ? '#7f786c' : '#675340'; g.fillRect(0, -H + 0.3, L, 0.18);
if (ruin) { g.fillStyle = 'rgba(40,36,34,0.5)'; g.fillRect(3.2, -H, 0.08, 4.6); g.fillRect(9.8, -H, 0.06, 3.2); }    // rain's streaks
