// The cell's door, painted from its hinge (x 0) to its free edge: heavy planks, iron straps, the lock; it swings into
// the cell by its place (door_f, which the scene leads by `door`).
const L = e.lib;
L.planked(g, 0, 1.1, -2.2, 0, '#6a5038', 0.2);
g.fillStyle = '#3a3634';
for (const y of [-1.9, -0.4]) g.fillRect(0, y, 1.0, 0.08);
L.rect(g, 0.88, -1.15, 0.12, 0.2, '#2a2826');
