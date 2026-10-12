// Passepartout's room under the roof, behind the dormer: bare plaster, the clock set to his master's, the day's notice
// pinned by it — and the gas jet (`gas`): left burning, it burns the whole way round the world.
const L = e.lib;
const y0 = L.plan.floors[3];
L.room(g, -2.4, 2.4, y0, 13.6, '#c4bba8');
L.clock(g, -0.35, -12.75, 0.13, 7.83);
g.fillStyle = '#e8e2d2';
g.fillRect(-0.2, -12.95, 0.26, 0.34);
L.bracket(e, g, 0.55, -12.55, 'gas');
e.at(L.plan.windows.attic[0], -12.72);
