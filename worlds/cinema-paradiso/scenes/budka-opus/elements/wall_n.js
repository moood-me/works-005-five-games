
// The north wall, toward the hall: plaster gone brown with smoke, the two ports (holes, the hall beyond them) in front
// of the projectors and between them the look port with its frame; the clock is its own element.
const P = e.lib, G = P.G, H = G.CEIL;
const holes = [[G.P1[0], G.PORT_H, G.PORT_W, 0.22], [G.P2[0], G.PORT_H, G.PORT_W, 0.22], [G.LOOK[0], G.LOOK[2], 0.4, 0.3]];
g.save(); g.beginPath(); g.rect(-2.05, -H - 0.05, 4.1, H + 0.05);
for (const [x, y, w, h] of holes) g.rect(x - w / 2, -y - h / 2, w, h);
g.clip('evenodd');
P.plaster(g, -2.05, -H - 0.05, 4.1, H + 0.05, '#7a6650', 31);
g.fillStyle = '#3e3024'; g.fillRect(-2.05, -0.12, 4.1, 0.12);
g.restore();
for (const [x, y, w, h] of holes) {                              // the frames of the ports, iron, with shutters lifted
  g.strokeStyle = '#2c2824'; g.lineWidth = 0.035; g.strokeRect(x - w / 2 - 0.02, -y - h / 2 - 0.02, w + 0.04, h + 0.04);
  g.fillStyle = '#3a3530'; g.fillRect(x - w / 2 - 0.03, -y - h / 2 - 0.12, w + 0.06, 0.08);
}
g.save(); g.scale(0.01, 0.01); g.font = '600 5px serif'; g.fillStyle = '#2a2420'; g.textAlign = 'center';
g.fillText('1', G.P1[0] * 100, -162); g.fillText('2', G.P2[0] * 100, -162); g.restore();
e.at(G.LOOK[0], -G.LOOK[2], 'look');
