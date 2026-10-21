// The forecastle at the bow, seen from aft: its break across the ship (a low wall with two ladders and a door), its
// head above — the bow's bulwarks closing in to the stem (their inner faces seen aslant), the capstan, the jackstaff
// at the stem with the red ensign.
const L = e.lib, c = L.colours(e.state), H = 1.5, wood = L.shipOf(e.state) === 'henrietta';
// the bow's bulwarks: from either side, closing in to the stem, rising with the sheer
L.poly(g, [[-5.45, -H], [-5.45, -H - 1.25], [-0.25, -H - 1.75], [-0.25, -H - 0.9]], L.shade(c.bulwark, 0.12));
L.poly(g, [[5.45, -H], [5.45, -H - 1.25], [0.25, -H - 1.75], [0.25, -H - 0.9]], L.shade(c.bulwark, 0.04));
L.line(g, [[-5.5, -H - 1.3], [0, -H - 1.82], [5.5, -H - 1.3]], c.cap, 0.14);
// the stem, the jackstaff and its flag
L.rect(g, -0.25, -H - 1.95, 0.5, 1.1, c.cap);
L.rect(g, -0.04, -H - 4.2, 0.08, 2.4, c.mast);
L.poly(g, [[0.04, -H - 4.15], [1.1, -H - 3.9], [0.04, -H - 3.6]], '#a8302a');
// the capstan on the forecastle head
L.rect(g, -0.45, -H - 0.75, 0.9, 0.75, c.iron);
L.rect(g, -0.6, -H - 0.85, 1.2, 0.14, L.shade(c.iron, 0.3));
// the break of the forecastle: a low wall, its ladders, a door
if (wood) L.planked(g, -5.45, 5.45, -H, 0, c.house, 0.2);
else L.rect(g, -5.45, -H, 10.9, H, c.bulwark);
L.rect(g, -5.45, -H - 0.1, 10.9, 0.12, c.cap);
for (const x of [-3.2, 3.2]) {
  L.rect(g, x - 0.35, -H - 0.1, 0.06, H + 0.1, c.cap);
  L.rect(g, x + 0.29, -H - 0.1, 0.06, H + 0.1, c.cap);
  for (let y = -0.3; y > -H; y -= 0.3) L.rect(g, x - 0.33, y, 0.66, 0.05, c.cap);
}
L.door(g, -0.4, 0.8, 1.35, L.shade(c.house, 0.1));
