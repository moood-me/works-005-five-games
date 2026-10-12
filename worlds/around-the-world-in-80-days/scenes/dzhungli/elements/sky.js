// The sky over the forest, painted once in its three lights — the night (deep blue, the stars, the moon), the pale humid
// blue of the day (a layer), the saffron of the dawn low over the river (a layer) — and the sun (a layer its animate
// carries from low over the river at dawn to high in the day). Its shader mixes them as `day` and `dawn` are now and
// twinkles the stars; the moon and the sun are marked (e.at): the scene's moonlight and sunlight shine from them.
const w = e.aspect, L = e.lib, ALL = [-0.3, -0.35, w + 0.3, 1.25];
// one light of the sky: from its top colour down to its colour at the horizon (the land and the forest hide what is under)
const sky = (g, top, low, a = 1) => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.6);
  gr.addColorStop(0, L.rgba(top, a));
  gr.addColorStop(0.75, L.rgba(L.mixc(top, low, 0.65), a));
  gr.addColorStop(1, L.rgba(low, a));
  g.fillStyle = gr;
  g.fillRect(-0.3, -0.35, w + 0.6, 1.6);
};
// the night
sky(g, '#162544', '#5a6d94');
// the day
e.layer('day', { box: ALL }, gl => sky(gl, '#6f9bbf', '#d8e4dc'));
// the dawn: the top of the sky going violet, the saffron low over the forest, deepest over the river on the right
e.layer('dawn', { box: ALL }, gl => {
  const gr = gl.createLinearGradient(0, -0.35, 0, 0.6);
  gr.addColorStop(0, L.rgba('#7a6f9a', 0.5));
  gr.addColorStop(0.75, L.rgba('#d89070', 0.65));
  gr.addColorStop(1, L.rgba('#f4a860', 0.85));
  gl.fillStyle = gr;
  gl.fillRect(-0.3, -0.35, w + 0.6, 1.6);
  L.glow(gl, w * 0.78, 0.36, 0.7, '#ffb878', 0.35, 0.45);
});
// the stars, the higher the more
e.layer('stars', { box: ALL }, gl => {
  for (let i = 0; i < 160; i++) {
    const x = -0.3 + (w + 0.6) * e.anim.hash(i, 1), y = -0.35 + 0.8 * Math.pow(e.anim.hash(i, 2), 1.5);
    gl.fillStyle = `rgba(230,236,255,${0.2 + 0.6 * e.anim.hash(i, 4)})`;
    gl.beginPath();
    gl.arc(x, y, 0.0008 + 0.001 * e.anim.hash(i, 3), 0, Math.PI * 2);
    gl.fill();
  }
});
// the moon, high over the left of the forest: its disc, its grey seas
const mx = w * 0.3, my = 0.12;
e.layer('moon', { box: [mx - 0.05, my - 0.05, mx + 0.05, my + 0.05] }, gl => {
  gl.fillStyle = '#eceef0';
  gl.beginPath();
  gl.arc(mx, my, 0.016, 0, Math.PI * 2);
  gl.fill();
  gl.fillStyle = 'rgba(150,158,170,0.35)';
  for (const [dx, dy, r] of [[-0.005, -0.004, 0.005], [0.004, 0.002, 0.004], [-0.002, 0.006, 0.003]]) {
    gl.beginPath();
    gl.arc(mx + dx, my + dy, r, 0, Math.PI * 2);
    gl.fill();
  }
  e.light(mx, my, 0.12, '#c9d6ea', 0.7, 'moon');
  e.at(mx, my, 'moon');
});
// the sun, painted where it stands at dawn (low over the river); its animate carries it up into the day
const sx = w * 0.78, sy = 0.3;
e.layer('sun', { box: [sx - 0.06, sy - 0.06, sx + 0.06, sy + 0.06] }, gl => {
  gl.fillStyle = '#fff4dc';
  gl.beginPath();
  gl.arc(sx, sy, 0.02, 0, Math.PI * 2);
  gl.fill();
  e.light(sx, sy, 0.22, '#ffe6b8', 0.9, 'sun');
  e.at(sx, sy, 'sun');
});
