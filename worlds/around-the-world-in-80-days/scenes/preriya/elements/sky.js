// The great winter sky over the plain, painted once at its three moments, each a layer over the one before: by day a
// deep clear blue paling to a white rim at the horizon, a warm haze low on the left where the low sun stands (behind the
// viewer's left shoulder); at dawn rose and gold rising on the right, the east; at night deep blue with the moon high on
// the right and stars. A few long thin clouds drift (a layer). Its animate shows the dawn and the night as far as they
// are come, and runs the clouds along with the plain when the train or the sledge runs.
const { glow } = e.kit.svet, w = e.aspect;
const band = (stops) => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.62);
  stops.forEach(([o, c]) => gr.addColorStop(o, c));
  return gr;
};
const fill = (g, gr) => { g.fillStyle = gr; g.fillRect(-0.3, -0.35, w + 0.6, 1.6); };
fill(g, band([[0, '#2f68b4'], [0.45, '#5f95d0'], [0.8, '#a9c9e8'], [0.97, '#e8eef4'], [1, '#f2f4f6']]));
// (the low sun's warmth, off the frame on the left)
glow(g, -0.25, 0.58, 0.9, '#fff0d8', 0.55, 0.45);
e.layer('dawn', {}, g => {
  fill(g, band([[0, '#47629e'], [0.45, '#9a8fbc'], [0.8, '#f0b49a'], [0.97, '#ffd8b0'], [1, '#ffe4c4']]));
  glow(g, w + 0.25, 0.6, 1.0, '#ffc890', 0.7, 0.4);
});
e.layer('night', {}, g => {
  fill(g, band([[0, '#0c1630'], [0.5, '#1d2d55'], [0.85, '#3a4d7c'], [1, '#56679a']]));
  // stars: small and many, fewer toward the horizon
  g.fillStyle = '#e8eefc';
  for (let i = 0; i < 260; i++) {
    const x = -0.3 + e.anim.hash(i, 3) * (w + 0.6), y = -0.35 + Math.pow(e.anim.hash(i, 7), 1.6) * 0.85;
    const r = 0.0011 + 0.0017 * e.anim.hash(i, 11);
    g.globalAlpha = 0.45 + 0.55 * e.anim.hash(i, 13);
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  g.globalAlpha = 1;
});
const MX = w * 0.8, MY = 0.13;
e.layer('moon', {}, g => {
  glow(g, MX, MY, 0.16, '#c8d4ec', 0.3);
  g.fillStyle = '#f2f2ee';
  g.beginPath();
  g.arc(MX, MY, 0.022, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = 'rgba(160,170,190,0.35)';
  g.beginPath();
  g.arc(MX + 0.006, MY - 0.004, 0.006, 0, Math.PI * 2);
  g.arc(MX - 0.007, MY + 0.006, 0.004, 0, Math.PI * 2);
  g.fill();
  e.light(MX, MY, 0.03, '#c8d4ec', 0.9, 'moon');
  e.at(MX, MY, 'moon');
});
// long thin clouds, low and high, their ends meeting (the layer drifts by its animate along with the running)
e.layer('clouds', { box: [-0.3, -0.35, w + 0.3, 0.6] }, g => {
  const W = w + 0.6;
  for (let i = 0; i < 9; i++) {
    const y = 0.05 + 0.42 * e.anim.hash(i, 21), x = -0.3 + W * e.anim.hash(i, 23), len = 0.25 + 0.5 * e.anim.hash(i, 29);
    for (const dx of [0, -W, W]) {
      const gr = g.createLinearGradient(x + dx - len, 0, x + dx + len, 0);
      gr.addColorStop(0, 'rgba(255,255,255,0)');
      gr.addColorStop(0.5, `rgba(255,255,255,${0.35 + 0.3 * e.anim.hash(i, 31)})`);
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(x + dx, y, len, 0.006 + 0.012 * e.anim.hash(i, 37), 0, 0, Math.PI * 2);
      g.fill();
    }
  }
});
