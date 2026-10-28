// The room's right wall: the doorway into Sarafanov's own room cut through it (his door is `sar_door`), its casing.
// Metres; 4 wide, x = 2 − the plan's z.
const D = e.lib.SAR_DOOR, x0 = 2 - D.z1, x1 = 2 - D.z0;
e.lib.roomWall(g, e, 4);
g.fillStyle = '#5a4434';
g.fillRect(x0 - 0.08, -2.08, x1 - x0 + 0.16, 2.1);
g.globalCompositeOperation = 'destination-out';
g.fillRect(x0, -2.0, x1 - x0, 2.02);
g.globalCompositeOperation = 'source-over';
