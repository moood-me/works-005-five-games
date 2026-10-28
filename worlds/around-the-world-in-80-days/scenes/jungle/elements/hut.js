// The hut by the line, its front: walls of split bamboo, a dark doorway.
const H = e.lib.plan.hut;
g.fillStyle = '#a08a60';
g.fillRect(-H.w, -H.wall, 2 * H.w, H.wall);
g.fillStyle = 'rgba(60,45,30,0.35)';
for (let x = -H.w + 0.1; x < H.w; x += 0.22) g.fillRect(x, -H.wall, 0.03, H.wall);
g.fillStyle = '#1c1812';
g.fillRect(-0.45, -1.6, 0.9, 1.6);
e.at(0, -1.5, 'hut');
