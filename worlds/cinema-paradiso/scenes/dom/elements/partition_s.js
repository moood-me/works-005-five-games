// The partition's side to the room: whitewash, the dado, a calendar of saints on a nail. Painted once.
const C = e.lib.G.CORNER, w = (C.x1 - C.x0) / 2, h = e.lib.G.ROOM.h;
g.fillStyle = '#cdc1a9'; g.fillRect(-w - 0.02, -h - 0.02, 2 * w + 0.04, h + 0.04);
g.fillStyle = '#7b6a56'; g.fillRect(-w - 0.02, -0.95, 2 * w + 0.04, 0.95);
g.fillStyle = '#4b3e31'; g.fillRect(-w - 0.02, -0.12, 2 * w + 0.04, 0.12);
g.fillStyle = '#e2d8c2'; g.fillRect(-0.15, -1.85, 0.3, 0.4);
g.fillStyle = '#9a3a2c'; g.fillRect(-0.13, -1.83, 0.26, 0.15);
g.fillStyle = 'rgba(40,30,20,0.5)';
for (let i = 0; i < 5; i++) g.fillRect(-0.12, -1.64 + i * 0.035, 0.24, 0.01);
