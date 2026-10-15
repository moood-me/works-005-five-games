
// The east wall (x from the north wall south): over the bench a shelf of cans and the spools, the door's opening
// (2 m high; the leaf is its own element) and the calendar's place behind where the leaf opens.
const P = e.lib, G = P.G, H = G.CEIL, N = G.N;
const d0 = N - G.DOOR[1], d1 = N - G.DOOR[0];
g.save(); g.beginPath(); g.rect(-0.05, -H - 0.05, 3.6, H + 0.05); g.rect(d0, -G.DOOR_H, d1 - d0, G.DOOR_H); g.clip('evenodd');
P.plaster(g, -0.05, -H - 0.05, 3.6, H + 0.05, '#7c6852', 37);
g.fillStyle = '#3e3024'; g.fillRect(-0.05, -0.12, 3.6, 0.12);
g.restore();
g.fillStyle = '#3a2c20'; g.fillRect(d0 - 0.07, -G.DOOR_H - 0.07, 0.07, G.DOOR_H + 0.07); g.fillRect(d1, -G.DOOR_H - 0.07, 0.07, G.DOOR_H + 0.07); g.fillRect(d0 - 0.07, -G.DOOR_H - 0.07, d1 - d0 + 0.14, 0.07);
P.cans(g, 0.1, -1.75, 1.05, 7);
g.strokeStyle = '#3a2c20'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(0.1, -1.75); g.lineTo(0.2, -1.62); g.moveTo(1.15, -1.75); g.lineTo(1.05, -1.62); g.stroke();
