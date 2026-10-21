// At the stem, seen from aft: the stem head, the bowsprit running out (end on), and the little signal gun on its slide
// (its breech toward us; points bowsprit#breech — where Bunsby fires it — and bowsprit#muzzle — the flash, the smoke).
const L = e.lib;
L.rect(g, -0.18, -1.3, 0.36, 1.3, L.C.rail);
L.rect(g, -0.12, -1.5, 0.24, 0.24, L.shade(L.C.mast, 0.2));
// the gun: its slide, the barrel end on, the breech
L.rect(g, -0.55, -0.25, 1.1, 0.25, '#5a4632');
g.fillStyle = L.C.iron;
g.beginPath();
g.arc(0.1, -0.55, 0.26, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#1a1a1c';
g.beginPath();
g.arc(0.1, -0.55, 0.1, 0, Math.PI * 2);
g.fill();
e.at(0.1, -0.5, 'breech');
e.at(0.1, -0.6, 'muzzle');
// the flash at a shot (its light the scene's gun_light; the animate lights it by `gun_flash`)
e.light(0.1, -0.6, 0.35, '#ffc070', 1, 'muzzle');
