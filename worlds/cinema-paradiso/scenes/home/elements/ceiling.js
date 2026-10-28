// The ceiling, laid from the north wall toward the start: plaster between dark beams. Painted once.
const R = e.lib.G.ROOM;
g.fillStyle = '#a89c88'; g.fillRect(R.x0 - 0.05, -R.z1 - 0.05, R.x1 - R.x0 + 0.1, R.z1 + 0.1);
g.fillStyle = '#4a3a2c';
for (let k = 0; k < 6; k++) g.fillRect(R.x0 - 0.05, -R.z1 + 0.3 + k * 0.85, R.x1 - R.x0 + 0.1, 0.14);
