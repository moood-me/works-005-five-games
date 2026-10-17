// The bedroom, second floor, left: pale walls, the clock by which the house keeps its hours, the gas bracket
// (`win_bedroom`).
const L = e.lib;
const [y0, y1] = [L.plan.floors[2], L.plan.floors[3]];
L.room(g, -3.6, 0, y0, y1, '#aab2ba');
L.clock(g, -1.8, -y0 - 2.15, 0.2, 7.83);
g.fillStyle = '#4a4038';
g.fillRect(-3.0, -y0 - 1.1, 1.0, 1.1);
L.bracket(e, g, -0.7, -y0 - 1.9, 'lamp');
e.at(L.plan.windows.win_bedroom[0], -9.45);
