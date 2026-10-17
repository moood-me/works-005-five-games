// The bench seen from behind: the seat's edge and its two stone supports. Metres, origin at the middle of its foot.
g.fillStyle = '#8c7c66';
g.fillRect(-1.05, -0.45, 2.1, 0.06);                 // the seat's edge, toward us
g.fillStyle = '#a7a196';
for (const x of [-0.82, 0.62]) g.fillRect(x, -0.39, 0.2, 0.39);
g.fillStyle = '#8f897e';
for (const x of [-0.82, 0.62]) g.fillRect(x, -0.04, 0.2, 0.04);
