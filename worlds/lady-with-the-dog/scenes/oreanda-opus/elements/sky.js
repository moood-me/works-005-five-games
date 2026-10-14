// The sky and the far sea below the cliff, in stage heights. Painted once: the hour before sunrise (the painting
// itself) and the dawn (a layer over it) — animate cross-fades them by `dawn`; stars, clouds, the glints on the sea
// and the mist below are layers of their own.
const A = e.aspect, H = 0.45;               // the sea's horizon: the scene's eye level
const X0 = -0.3, X1 = A + 0.3, W = X1 - X0;
const SUN = 0.56;                            // where the sun will rise (east: to the left of the middle)
const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();

function vgrad(y0, y1, stops) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
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
// the far coast: hills on the left running to a cape, a low cape far on the right
const coastL = [], coastR = [];
for (let i = 0; i <= 60; i++) {
  const x = X0 + (1.25 - X0) * i / 60, u = i / 60;
  coastL.push([x, H - (0.012 + 0.036 * Math.sin(u * 2.6 + 0.4) ** 2 * (1 - u) + 0.006 * Math.sin(u * 23)) * (1 - 0.85 * u ** 3)]);
}
for (let i = 0; i <= 30; i++) {
  const u = i / 30, x = 1.45 + 0.75 * u;
  coastR.push([x, H - 0.014 * Math.sin(u * Math.PI) ** 0.6 - 0.003 * Math.sin(u * 17)]);
}
function coast(gc, color) {
  gc.fillStyle = color;
  for (const pts of [coastL, coastR]) {
    gc.beginPath(); gc.moveTo(pts[0][0], H + 0.002);
    for (const [x, y] of pts) gc.lineTo(x, y);
    gc.lineTo(pts[pts.length - 1][0], H + 0.002); gc.closePath(); gc.fill();
  }
}
// the sea: a gradient, then thin horizontal strokes — short and dense at the horizon, long and sparse nearer
const strokes = [];
for (let i = 0; i < 900; i++) {
  const u = rnd() ** 1.7, y = H + 0.003 + u * 0.8;
  strokes.push([X0 + rnd() * W, y, 0.008 + u * 0.16 * (0.5 + rnd()), 0.0005 + u * 0.004, rnd()]);
}
function sea(gc, top, mid, low, light, dark) {
  gc.fillStyle = vgrad(H, 1.25, [[0, top], [0.12, mid], [1, low]]);
  gc.fillRect(X0, H, W, 1.25 - H);
  for (const [x, y, len, th, k] of strokes) {
    gc.globalAlpha = 0.22 + 0.25 * k;
    gc.fillStyle = k > 0.45 ? light : dark;
    gc.fillRect(x, y, len, th);
  }
  gc.globalAlpha = 1;
}

// ── before dawn (the painting itself)
g.fillStyle = vgrad(-0.35, H, [[0, '#262c5a'], [0.42, '#3e457c'], [0.74, '#6e6c9e'], [0.92, '#a898b8'], [1, '#c8afbd']]);
g.fillRect(X0, -0.35, W, H + 0.35);
glow(g, SUN, H, 0.9, 0.22, '#e6bcb4', 0.45);
sea(g, '#9a91b8', '#7a78a8', '#3c4474', '#aaa3c8', '#4a4f82');
coast(g, '#5b5a84');

// ── the dawn: the whole picture in the colours of the hour the sun comes
e.layer('dawn', {}, gd => {
  gd.fillStyle = vgrad(-0.35, H, [[0, '#5d76ab'], [0.45, '#91a6cc'], [0.75, '#d6c9d6'], [0.92, '#f3d6c6'], [1, '#ffe4c2']]);
  gd.fillRect(X0, -0.35, W, H + 0.35);
  glow(gd, SUN, H, 0.75, 0.2, '#fff0d2', 0.85);
  glow(gd, SUN, H, 0.22, 0.05, '#fff8e6', 0.9);
  sea(gd, '#ecdcd2', '#c4bfd4', '#6d78a6', '#f2e6e0', '#8a90b8');
  coast(gd, '#9389b0');
});

// ── stars: only before dawn; the morning star low in the east
e.layer('stars', {}, gs => {
  gs.fillStyle = '#eef0ff';
  for (let i = 0; i < 170; i++) {
    const x = X0 + rnd() * W, y = -0.35 + rnd() ** 1.3 * 0.62, r = 0.0006 + rnd() ** 3 * 0.0016;
    gs.globalAlpha = 0.35 + 0.65 * rnd() * (1 - Math.max(0, y - 0.05) * 2.4);
    gs.beginPath(); gs.arc(x, y, r, 0, Math.PI * 2); gs.fill();
  }
  gs.globalAlpha = 1;
  gs.beginPath(); gs.arc(SUN - 0.32, 0.16, 0.0026, 0, Math.PI * 2); gs.fill();
  e.light(SUN - 0.32, 0.16, 0.014, '#fff6e0', 0.9, 'venus');
});

// ── thin strata of cloud low over the sea: lilac before dawn, lit from below at dawn (both drift together)
const clouds = [];
for (let i = 0; i < 9; i++) clouds.push([X0 + rnd() * W, 0.26 + rnd() * 0.15, 0.25 + rnd() * 0.5, 0.004 + rnd() * 0.007]);
function strata(gc, body, lit) {
  for (const [x, y, len, th] of clouds) {
    for (const dx of [-W, 0, W]) {
      gc.fillStyle = body; gc.globalAlpha = 0.55;
      gc.beginPath(); gc.ellipse(x + dx, y, len / 2, th, 0, 0, Math.PI * 2); gc.fill();
      if (lit) { gc.fillStyle = lit; gc.globalAlpha = 0.75; gc.beginPath(); gc.ellipse(x + dx, y + th * 0.45, len * 0.45, th * 0.45, 0, 0, Math.PI * 2); gc.fill(); }
    }
  }
  gc.globalAlpha = 1;
}
const CLOUDS = { box: [X0, 0.2, X1, 0.45], drift: [0.0025, 0] };
e.layer('clouds_n', CLOUDS, gc => strata(gc, '#55548a', null));
e.layer('clouds_d', CLOUDS, gc => strata(gc, '#b9a3c2', '#ffd9c0'));

// ── the path of light on the sea under the dawn: dabs, widening toward the eye
e.layer('glints', { shimmer: 0.6, box: [SUN - 0.6, H, SUN + 0.6, 0.75] }, gg => {
  gg.fillStyle = '#fff4dc';
  for (let i = 0; i < 420; i++) {
    const u = rnd() ** 1.4, y = H + 0.002 + u * 0.28, half = 0.02 + u * 0.22;
    const x = SUN + (rnd() - 0.5) * 2 * half * (0.4 + 0.6 * rnd());
    gg.globalAlpha = (0.35 + 0.6 * rnd()) * (1 - u * 0.6);
    gg.fillRect(x, y, 0.004 + u * 0.03 * rnd(), 0.0007 + u * 0.002);
  }
  gg.globalAlpha = 1;
});

// ── mist lying on the sea at the cliff's foot
e.layer('mist', { box: [X0, H, X1, 0.72], drift: [0.004, 0] }, gm => {
  for (let i = 0; i < 26; i++) {
    const x = X0 + rnd() * W, y = H + 0.06 + rnd() * 0.14, rx = 0.12 + rnd() * 0.3, ry = 0.012 + rnd() * 0.02;
    for (const dx of [-W, 0, W]) glow(gm, x + dx, y, rx, ry, '#ddd6ea', 0.55);
  }
});
