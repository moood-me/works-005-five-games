// The stokehold's hatch: its coaming seen from aft (iron, rivets), its lid thrown back forward; the opening's fire is
// the plane hatch_glow on top of it. Its point hatch#fire — the open hatch, where the parts go into the furnaces.
const L = e.lib, c = L.colours(e.state), H = L.plan.hatch;
L.rect(g, -0.85, -H.h, 1.7, H.h, c.iron);
L.rect(g, -0.9, -H.h - 0.06, 1.8, 0.08, L.shade(c.iron, 0.35));
g.fillStyle = L.tint(c.iron, 0.2);
for (let x = -0.75; x < 0.8; x += 0.2) g.fillRect(x, -H.h + 0.1, 0.03, 0.03);
// the lid, standing up at the far side
L.rect(g, -0.8, -H.h - 0.75, 1.6, 0.7, L.shade(c.iron, 0.15));
L.rect(g, -0.8, -H.h - 0.75, 1.6, 0.06, L.shade(c.iron, 0.4));
e.at(0, -H.h - 0.05, 'fire');
