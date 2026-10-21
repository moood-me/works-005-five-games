// The low dusk sky over the cemetery's slope: heavy grey-violet cloud, a long reddish band low in the west (left)
// where the sun has gone; going darker by `dusk` (a layer, animate). Screen heights, all round (e.aspect = 2π, the
// roaming camera's); the horizon at 0.56, the slope's crest hides the lowest of it.
const A = e.aspect, x0 = 0, w = A, west = A * 0.5 - 1.05;
const gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, '#262a44');
gr.addColorStop(0.35, '#3e3f5e');
gr.addColorStop(0.7, '#6d6680');
gr.addColorStop(0.9, '#9a8090');
gr.addColorStop(1, '#a58a92');
g.fillStyle = gr;
g.fillRect(x0, -1.2, w, 2.5);
// the red band, strongest in the west, along the low sky
for (let k = -1; k <= 1; k++) {
  const cx = west + k * Math.PI * 2;
  const r = g.createRadialGradient(cx, 0.5 / 0.22, 0, cx, 0.5 / 0.22, 1.6);
  r.addColorStop(0, 'rgba(214,128,104,0.6)');
  r.addColorStop(0.4, 'rgba(190,120,118,0.3)');
  r.addColorStop(1, 'rgba(160,110,130,0)');
  g.save();
  g.scale(1, 0.22);
  g.fillStyle = r;
  g.fillRect(cx - 1.6, 0.5 / 0.22 - 1.6, 3.2, 3.2);
  g.restore();
}
// long low cloud banks
for (let i = 0; i < 16; i++) {
  const cx = e.rnd() * A, cy = 0.05 + e.rnd() * 0.35, rx = 0.3 + e.rnd() * 0.6, k = 0.08 + e.rnd() * 0.08;
  const c = g.createRadialGradient(cx, cy / k, 0, cx, cy / k, rx);
  c.addColorStop(0, 'rgba(52,52,76,0.55)');
  c.addColorStop(1, 'rgba(52,52,76,0)');
  for (const wrap of [-A, 0, A]) {
    g.save();
    g.scale(1, k);
    g.fillStyle = c;
    g.translate(wrap, 0);
    g.fillRect(cx - rx, cy / k - rx, rx * 2, rx * 2);
    g.restore();
  }
}
e.layer('dark', { box: [0, -0.35, A, 1.25] }, n => {
  const d = n.createLinearGradient(0, -0.35, 0, 0.6);
  d.addColorStop(0, '#12152a');
  d.addColorStop(0.7, '#2c2c48');
  d.addColorStop(1, '#5a4c62');
  n.fillStyle = d;
  n.fillRect(x0, -0.35, w, 1.6);
});
