// The side street's right wall: the end of the next block and the houses after it (x: metres along it,
// negative — away from the corner).
const L = e.lib;
g.fillStyle = '#9a958b';
g.fillRect(-12, -L.plan.parapet, 12, L.plan.parapet);
L.brick(g, -129, -12, L.plan.parapet, 7);
