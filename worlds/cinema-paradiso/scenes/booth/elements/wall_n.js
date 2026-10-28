// The wall toward the hall: plaster gone brown with smoke; the two ports (holes, the hall beyond) before the
// projectors, between them the look port (its picture is the element look_port) — in 1988 their glass broken.
const L = e.lib, G = L.G, H = G.CEIL, ruin = e.state.era === 'ruin';
const holes = [[G.P1[0], G.PORT_H, G.PORT_W, G.PORT_HH], [G.P2[0], G.PORT_H, G.PORT_W, G.PORT_HH], [G.LOOK[0], (G.LOOK[1] + G.LOOK[2]) / 2, G.LOOK[3], G.LOOK[2] - G.LOOK[1]]];
g.save(); g.beginPath(); g.rect(-2.1, -H - 0.1, 4.2, H + 0.15);
for (const [x, y, w, h] of holes) g.rect(x - w / 2, -y - h / 2, w, h);
g.clip('evenodd');
L.plaster(g, -2.1, -H - 0.1, 4.2, H + 0.15, ruin ? '#7e7468' : '#7a6650', 31, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-2.1, -0.12, 4.2, 0.12);
g.restore();
for (const [x, y, w, h] of holes) {
  g.strokeStyle = ruin ? '#4a3a2e' : '#2c2824'; g.lineWidth = 0.035; g.strokeRect(x - w / 2 - 0.02, -y - h / 2 - 0.02, w + 0.04, h + 0.04);
  g.fillStyle = ruin ? '#5a4a3c' : '#3a3530'; g.fillRect(x - w / 2 - 0.03, -y - h / 2 - 0.12, w + 0.06, 0.08);
  if (ruin) { g.strokeStyle = 'rgba(200,210,215,0.5)'; g.lineWidth = 0.004; g.beginPath(); g.moveTo(x - w / 2, -y - h / 2); g.lineTo(x - w * 0.1, -y + h * 0.1); g.lineTo(x - w / 2, -y + h / 2); g.stroke(); }
}
g.save(); g.scale(0.01, 0.01); g.font = '600 5px serif'; g.fillStyle = '#2a2420'; g.textAlign = 'center';
g.fillText('1', G.P1[0] * 100, -176); g.fillText('2', G.P2[0] * 100, -176); g.restore();
