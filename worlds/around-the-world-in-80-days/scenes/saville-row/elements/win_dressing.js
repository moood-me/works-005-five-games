// The dressing room, second floor, right: the tall wardrobe, a long glass, the gas bracket (`win_dressing`).
const L = e.lib;
const [y0, y1] = [L.plan.floors[2], L.plan.floors[3]];
L.room(g, 0, 3.6, y0, y1, '#b3aca0');
g.fillStyle = '#4a3a2e';
g.fillRect(2.1, -y0 - 2.5, 1.1, 2.5);
g.fillStyle = 'rgba(0,0,0,0.25)';
g.fillRect(2.64, -y0 - 2.4, 0.02, 2.3);
g.fillStyle = '#8c9296';
g.fillRect(1.15, -y0 - 2.1, 0.5, 1.6);
L.bracket(e, g, 0.7, -y0 - 1.9, 'lamp');
e.at(L.plan.windows.win_dressing[0], -9.45);
