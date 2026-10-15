// The left wall, seen from the hall (x along it from the back wall to the screen wall, 20.5 m): ochre plaster over a
// dark wooden wainscot, pilasters, the side door — an opening 2 m wide and 2.6 m high (its curtain is its own
// element) two rows behind the priest's row. 1988: the plaster grey and flaking, the wainscot split.
const P = e.lib, G = P.G, ruin = e.state.era === 'ruin', H = G.CEIL, L = G.FRONT_Z - G.BACK_Z;
const d0 = G.DOOR[0] - G.BACK_Z, d1 = G.DOOR[1] - G.BACK_Z;
g.save();
g.beginPath(); g.rect(0, -H - 0.05, L, H + 0.05); g.rect(d0, -2.6, d1 - d0, 2.6); g.clip('evenodd');
P.plaster(g, 0, -H - 0.05, L, H + 0.05, ruin ? '#8f887c' : '#6f5a44', 11, ruin);
g.fillStyle = ruin ? '#4d4339' : '#3a2619'; g.fillRect(0, -1.25, L, 1.25);
g.fillStyle = ruin ? '#5c5144' : '#4b3322'; for (let x = 0.3; x < L; x += 1.1) g.fillRect(x, -1.15, 0.9, 1.0);
g.fillStyle = ruin ? '#6a6052' : '#6b5032'; g.fillRect(0, -1.3, L, 0.06);
for (let x = 1.5; x < L - 0.5; x += 3.2) {                       // the pilasters with their capitals
  if (x + 0.5 > d0 - 0.2 && x - 0.5 < d1 + 0.2) continue;
  g.fillStyle = ruin ? '#9b9486' : '#7c664c'; g.fillRect(x - 0.3, -H + 0.6, 0.6, H - 1.9);
  g.fillStyle = ruin ? '#867e72' : '#6a553e'; g.fillRect(x - 0.4, -H + 0.45, 0.8, 0.25); g.fillRect(x - 0.36, -1.36, 0.72, 0.1);
}
g.fillStyle = ruin ? '#7f786c' : '#675340'; g.fillRect(0, -H + 0.3, L, 0.18);   // the cornice
g.restore();
g.fillStyle = ruin ? '#3a332c' : '#2e1f15';                  // the door's frame
g.fillRect(d0 - 0.14, -2.75, 0.14, 2.75); g.fillRect(d1, -2.75, 0.14, 2.75); g.fillRect(d0 - 0.14, -2.75, d1 - d0 + 0.28, 0.15);
e.at((d0 + d1) / 2, -2.2, 'door');
