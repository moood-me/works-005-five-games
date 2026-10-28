// The partition wall nearer you, its free end standing in the room (partition_end): dark plaster, a skirting — and the
// fireplace's opening cut through it (its recess behind: hearth). The fire beside the clock lights it.
const P = e.lib.plan, H = P.hearth, x0 = P.corner;
const hole = p => p.rect(P.fireplace - H.w / 2, -H.h, H.w, H.h);
g.beginPath();
g.rect(x0, -12, 16, 12);
hole(g);
g.fillStyle = '#3a3032';
g.fill('evenodd');
// the skirting, broken by the opening
g.beginPath();
g.rect(x0, -0.22, 16, 0.22);
hole(g);
g.fillStyle = '#231c1c';
g.fill('evenodd');
