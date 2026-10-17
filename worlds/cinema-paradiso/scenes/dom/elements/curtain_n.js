// One length of the curtain closing Toto's corner (curtain_n toward the north wall, curtain_s toward the partition),
// on its rod along x 1.2, its x running south: faded cotton with a small printed flower, gathered in folds. Painted
// solid to its box's edges (a see-through card would let what stands behind it show its lines). Painted once.
const w = e.id === 'curtain_n' ? e.lib.G.ROOM.z1 - e.lib.G.CORNER.gap1 : e.lib.G.CORNER.gap0 - e.lib.G.CORNER.z0;
const gr = g.createLinearGradient(0, 0, w, 0);
const n = Math.max(3, Math.round(w / 0.12));
for (let i = 0; i <= n; i++) gr.addColorStop(i / n, i % 2 ? '#8a7258' : '#a48b6c');
g.fillStyle = gr; g.fillRect(0, -2.32, w, 2.32);
for (let y = -2.15, r = 0; y < -0.1; y += 0.16, r++) for (let x = 0.05 + (r % 2) * 0.07; x < w - 0.03; x += 0.14) {
  g.fillStyle = '#9a5a46'; g.beginPath(); g.arc(x, y, 0.022, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#6e7a56'; g.fillRect(x + 0.015, y + 0.01, 0.03, 0.01);
}
g.fillStyle = '#2a221a'; g.fillRect(0, -2.32, w, 0.03);
