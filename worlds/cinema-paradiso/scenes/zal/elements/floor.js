// The hall's floor from above (x across, y toward the start): worn boards, a red runner down each side aisle and
// across the back; in 1988 the boards grey with plaster dust, the runner gone to rags, rubble under the hole.
const P = e.lib, G = P.G, an = e.anim, ruin = e.state.era === 'ruin';
const W = 6.5, D = 10.25;                    // half sizes: x −6.5…6.5, y −10.25…10.25 (z 19 … −1.5)
g.fillStyle = ruin ? '#6e655a' : '#4a3626'; g.fillRect(-W, -D, 2 * W, 2 * D);
for (let k = 0, x = -W; x < W; x += 0.16, k++) {
  g.fillStyle = ruin ? (k % 2 ? '#746a5e' : '#6a6156') : (k % 2 ? '#523c2a' : '#4a3524');
  g.fillRect(x, -D, 0.15, 2 * D);
}
const zy = z => (G.FRONT_Z + G.BACK_Z) / 2 - z;       // world z → this plane's y
const runner = (x0, x1, y0, y1) => {
  g.fillStyle = ruin ? 'rgba(96,58,52,0.55)' : '#5a1f22'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  if (!ruin) { g.fillStyle = '#3a1416'; g.fillRect(x0, y0, 0.05, y1 - y0); g.fillRect(x1 - 0.05, y0, 0.05, y1 - y0); }
};
runner(-6.2, -5.2, zy(G.STAGE_Z), zy(G.BACK_Z));
runner(5.2, 6.2, zy(G.STAGE_Z), zy(G.BACK_Z));
runner(-6.2, 6.2, zy(3.6), zy(G.BACK_Z));
if (ruin) {
  for (let i = 0; i < 160; i++) {                     // rubble and laths fallen from the hole, plaster dust
    const x = -4.6 + an.hash(i, 7) * 3.6, y = zy(10.6) + an.hash(i, 8) * 4, r = 0.04 + an.hash(i, 9) * 0.14;
    g.fillStyle = i % 4 ? '#8e8478' : '#5d4636';
    g.beginPath(); g.ellipse(x, y, r, r * 0.6, an.hash(i, 10) * 3, 0, Math.PI * 2); g.fill();
  }
  g.strokeStyle = '#4a3a2c'; g.lineWidth = 0.05;
  for (let i = 0; i < 12; i++) { const x = -4.4 + an.hash(i, 11) * 3, y = zy(9.6) + an.hash(i, 12) * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 0.6, y + (an.hash(i, 13) - 0.5) * 0.8); g.stroke(); }
  for (let i = 0; i < 30; i++) {                       // pigeons' droppings, feathers
    g.fillStyle = 'rgba(230,226,215,0.6)'; g.beginPath(); g.arc(-5 + an.hash(i, 14) * 10, -D + an.hash(i, 15) * 2 * D, 0.03, 0, Math.PI * 2); g.fill();
  }
}
