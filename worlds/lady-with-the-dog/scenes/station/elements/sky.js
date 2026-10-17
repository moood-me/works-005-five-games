// The evening sky over the steppe at the end of summer, in stage heights: warm low in the west (left, behind the
// station), cooling to lilac and blue in the east where the line runs; long thin clouds lit from below; the first
// star. The far steppe's edge and a line of trees on it. Painted once; the clouds drift as a layer.
const A = e.aspect, H = 0.56;
// painted wide: the shots turn the camera (camera_yaw −55…65), and the sky must be there on both sides
const X0 = -1.2 * A, X1 = 2.2 * A, W = X1 - X0;
const rnd = (() => { let s = 11; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
function vgrad(y0, y1, stops, gc = g) {
  const gr = gc.createLinearGradient(0, y0, 0, y1);
  for (const [k, c] of stops) gr.addColorStop(k, c);
  return gr;
}
function glow(gc, x, y, rx, ry, color, alpha) {
  gc.save();
  gc.translate(x, y); gc.scale(rx, ry);
  const gr = gc.createRadialGradient(0, 0, 0, 0, 0, 1);
  gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
  gc.globalAlpha = alpha; gc.fillStyle = gr;
  gc.beginPath(); gc.arc(0, 0, 1, 0, Math.PI * 2); gc.fill();
  gc.restore();
}
// the sky itself: painted over the stage (the painting) and, the same, wider (a layer: the turned shots see past the
// stage on both sides)
const base = gb => {
// the sky: blue-violet above, lilac, and a warm band at the horizon
gb.fillStyle = vgrad(-0.35, H, [[0, '#34406c'], [0.3, '#4f5b8c'], [0.6, '#8c8ab0'], [0.82, '#c9a9b6'], [0.94, '#e8bf9e'], [1, '#f1d3a8']], gb);
gb.fillRect(X0, -0.35, W, H + 0.35);
// the afterglow, low on the left (the west), fading toward the right
glow(gb, A * 0.12, H, 1.4, 0.3, '#ffcf98', 0.55);
glow(gb, A * 0.12, H, 0.5, 0.08, '#fff0d0', 0.55);
// cooler toward the east
gb.fillStyle = 'rgba(70,82,140,0.18)';
gb.fillRect(A * 0.75, -0.35, X1 - A * 0.75, H + 0.35);
// the land beyond the steppe's painted edge: a dim band under the horizon
gb.fillStyle = vgrad(H, 1.25, [[0, '#8b7f86'], [0.04, '#6f6a6c'], [1, '#4e4a48']], gb);
gb.fillRect(X0, H, W, 1.25 - H);
// far trees along the horizon: low clumps, bluish in the haze
gb.fillStyle = '#6e6880';
for (let i = 0; i < 60; i++) {
  const x = X0 + rnd() * W, w = 0.02 + rnd() * 0.07, h = 0.006 + rnd() * 0.014;
  gb.beginPath(); gb.ellipse(x, H, w, h, 0, Math.PI, 0); gb.fill();
}
gb.fillRect(X0, H - 0.002, W, 0.004);
};
base(g);
e.layer('base', { box: [X0, -0.35, X1, 1.25] }, base);
// the first star, high and to the right
e.layer('stars', {}, gs => {
  gs.fillStyle = '#f6f2ff';
  gs.beginPath(); gs.arc(A * 0.78, 0.1, 0.0022, 0, Math.PI * 2); gs.fill();
  e.light(A * 0.78, 0.1, 0.012, '#fff6e6', 0.7, 'star');
  for (let i = 0; i < 12; i++) { gs.globalAlpha = 0.3 + 0.4 * rnd(); gs.beginPath(); gs.arc(A * 0.55 + rnd() * A * 0.6, -0.3 + rnd() * 0.3, 0.0009, 0, Math.PI * 2); gs.fill(); }
  gs.globalAlpha = 1;
});
// long thin clouds, their undersides lit warm (they drift slowly)
const clouds = [];
for (let i = 0; i < 24; i++) clouds.push([X0 + rnd() * W, 0.2 + rnd() * 0.26, 0.3 + rnd() * 0.6, 0.004 + rnd() * 0.008]);
e.layer('clouds', { box: [X0, 0.12, X1, 0.5], drift: [0.002, 0] }, gc => {
  for (const [x, y, len, th] of clouds) {
    for (const dx of [-W, 0, W]) {
      gc.fillStyle = '#6a6890'; gc.globalAlpha = 0.6;
      gc.beginPath(); gc.ellipse(x + dx, y, len / 2, th, 0, 0, Math.PI * 2); gc.fill();
      gc.fillStyle = (x + dx) < A * 0.6 ? '#f2b98e' : '#c6a3b5'; gc.globalAlpha = 0.7;
      gc.beginPath(); gc.ellipse(x + dx, y + th * 0.5, len * 0.44, th * 0.45, 0, 0, Math.PI * 2); gc.fill();
    }
  }
  gc.globalAlpha = 1;
});
