// The fog itself, drifting past the windows in slow banks — two sheets of them, each at its own pace — and lying thickest
// low over the street. Painted once, as how thick it is (white): the fog is lit by the city, not by the evening — its
// colour is the hour's, warmed by the gas, and its banks drift (mist.glsl, the hour by mist.animate.js). Each bank is
// painted again a box's width over where it runs past an edge: the shader wraps them round the box.
const L = e.lib, svet = e.kit.svet, h = e.anim.hash;
const [left, right] = [-56, 18], W = right - left;
const sheet = (from, to, seed) => w => {
  for (let i = from; i < to; i++) {
    const x = left + W * h(i, seed + 1);
    const y = -1.5 - 7 * h(i, seed + 3);
    const r = 4 + 5 * h(i, seed + 4);
    for (const dx of [-W, 0, W]) if (x + dx + r > left && x + dx - r < right) svet.glow(w, x + dx, y, r, '#ffffff', 0.1 + 0.1 * h(i, seed + 5), 0.32 + 0.2 * h(i, seed + 6));
  }
};
e.layer('banks_slow', {}, sheet(0, 5, 0));
e.layer('banks_fast', {}, sheet(5, 10, 10));
// low over the street the fog lies thickest (down to the street, half a metre below the club's floor)
const base = -L.plan.street;
const gr = g.createLinearGradient(0, base - 3.5, 0, base);
gr.addColorStop(0, 'rgba(255,255,255,0)');
gr.addColorStop(1, 'rgba(255,255,255,0.35)');
g.fillStyle = gr;
g.fillRect(-36, base - 3.5, 44, 3.5);
