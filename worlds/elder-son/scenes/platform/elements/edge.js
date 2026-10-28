// The platform's face over the tracks' bed: grey concrete slabs, snow caught on their ledge, from the bed (y 0) up to
// the platform's top (y −1.3).
const len = e.lib.G.PLAT.a1 - e.lib.G.PLAT.a0;
g.fillStyle = '#8d9097';
g.fillRect(-len / 2, -1.3, len, 1.3);
g.fillStyle = '#6f7279';
for (let x = -len / 2; x < len / 2; x += 3) g.fillRect(x, -1.3, 0.05, 1.3);
g.fillStyle = '#a3a6ad';
g.fillRect(-len / 2, -1.3, len, 0.12);
g.fillStyle = '#e4eaf2';
g.fillRect(-len / 2, -0.12, len, 0.12);
