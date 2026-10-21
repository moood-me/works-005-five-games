// The sky over the China Sea: a grey squally day — pale, low cloud; the typhoon's slate over it as far as `storm`
// says (a layer), its torn scud racing low (a layer drifting fast), a pale gleam low on the horizon where the storm
// will break (seen as it dies away). Painted in its own light.
const L = e.lib, w = e.aspect;
const band = stops => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.45);
  stops.forEach(([o, c]) => gr.addColorStop(o, c));
  return gr;
};
const fill = (g, gr) => { g.fillStyle = gr; g.fillRect(-0.3, -0.35, w + 0.6, 1.6); };
fill(g, band([[0, '#7f8f9c'], [0.6, '#a9b6bc'], [0.95, '#d2d8d6'], [1, '#dcdfd8']]));
// low cloud of the squally day, drifting
e.layer('cloud', { drift: [-0.006, 0], box: [-0.3, -0.35, w + 0.3, 0.44] }, g => {
  for (let i = 0; i < 12; i++) {
    const x = -0.2 + ((w + 0.4) * i) / 12 + 0.06 * e.rnd(), y = 0.02 + 0.3 * e.rnd(), s = 0.06 + 0.08 * e.rnd();
    g.fillStyle = L.rgba(L.mixc('#c4ccd0', '#8e9aa2', e.rnd()), 0.8);
    g.beginPath();
    g.ellipse(x, y, s * 3.4, s * 0.7, 0, 0, Math.PI * 2);
    g.ellipse(x + s * 1.4, y - s * 0.2, s * 1.8, s * 0.8, 0, 0, Math.PI * 2);
    g.fill();
  }
});
// the typhoon's slate
e.layer('slate', {}, g => fill(g, band([[0, '#3e4a54'], [0.55, '#59666e'], [0.92, '#7e8a8c'], [1, '#929c9a']])));
// the scud racing under it
e.layer('scud', { drift: [-0.045, 0.004], box: [-0.3, -0.35, w + 0.3, 0.44] }, g => {
  for (let i = 0; i < 16; i++) {
    const x = -0.2 + ((w + 0.4) * i) / 16 + 0.05 * e.rnd(), y = -0.25 + 0.6 * e.rnd(), s = 0.05 + 0.07 * e.rnd();
    g.fillStyle = L.rgba(L.mixc('#4a565e', '#6e7a80', e.rnd()), 0.75);
    g.beginPath();
    g.ellipse(x, y, s * 4.5, s * 0.5, -0.08, 0, Math.PI * 2);
    g.fill();
  }
});
// a pale gleam low on the horizon (the storm breaking)
e.layer('gleam', {}, g => L.glow(g, w * 0.4, 0.43, 0.9, '#f2ecd8', 0.55, 0.12));
