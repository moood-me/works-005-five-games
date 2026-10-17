// The study behind the wide window over the balcony: dark green walls, the books in exact rows, a regulator
// clock; the desk with its shaded lamp stands out in the room (a part) — the lamp lights it, `win_study`; the shade's
// glowing rim is the layer 'lit', standing as far out in the room as the desk.
const L = e.lib;
const [y0, y1] = [L.plan.floors[1], L.plan.floors[2]];
L.room(g, -3.6, 3.6, y0, y1, '#5d6f64');
// the bookcases: shelves and the spines on them, in order
for (const [x0, x1] of [[-2.9, -0.4], [0.4, 2.9]]) {
  g.fillStyle = '#3b3128';
  g.fillRect(x0, -y0 - 2.6, x1 - x0, 2.6);
  for (let s = 0; s < 5; s++) {
    const y = -y0 - 0.25 - s * 0.48;
    for (let x = x0 + 0.06, i = 0; x < x1 - 0.08; i++) {
      const w = 0.035 + 0.02 * e.anim.hash(i + s * 40, x0 * 7);
      g.fillStyle = L.rgba(L.mixc('#5a4436', '#7a6a50', e.anim.hash(i + s * 40, 3)));
      g.fillRect(x, y - 0.3, w, 0.3);
      x += w + 0.004;
    }
  }
}
L.clock(g, 0, -y0 - 2.0, 0.17, 7.83);
// the desk out in the room, its lamp under a green shade
e.part(0.5, -1.3, g => {
  g.translate(0, -y0);
  g.fillStyle = '#2e2620';
  g.fillRect(-0.7, -0.76, 1.4, 0.06);
  g.fillRect(-0.66, -0.7, 0.05, 0.7);
  g.fillRect(0.61, -0.7, 0.05, 0.7);
  g.fillRect(0.2, -0.7, 0.4, 0.45);
  g.fillStyle = '#8a6e44';
  g.fillRect(-0.33, -1.06, 0.02, 0.3);
  g.fillStyle = '#2f5a3a';
  g.beginPath();
  g.moveTo(-0.46, -1.0);
  g.lineTo(-0.18, -1.0);
  g.lineTo(-0.24, -1.12);
  g.lineTo(-0.4, -1.12);
  g.closePath();
  g.fill();
  g.fillStyle = '#6a665c';
  g.fillRect(-0.44, -1.0, 0.24, 0.02);
  e.light(-0.32, -0.95, 0.3, '#ffd9a0', 0.9, 'lamp');
}, [-0.8, -y0 - 1.3, 0.8, -y0 + 0.05]);
e.at(L.plan.windows.win_study[0], -6.1);
e.layer('lit', { depth: 1.3 }, g => {
  g.fillStyle = '#fff0cc';
  g.fillRect(0.06, -y0 - 1.0, 0.24, 0.02);
});
