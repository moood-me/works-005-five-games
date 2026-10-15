// Moscow outside the window on a winter evening, in stage heights: a low grey-blue sky, snowy roofs across the street
// with chimneys, a church's domes beyond, a few lit windows; in a thaw (`spring` 1) the roofs dark and wet, the sky
// greyer. Only the window shows it.
const A = e.aspect, H = 0.42, thaw = Number(e.state.spring) > 0.5;
const X0 = -0.3, X1 = A + 0.3, W = X1 - X0;
const rnd = (() => { let s = 17; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
function vgrad(y0, y1, stops) { const gr = g.createLinearGradient(0, y0, 0, y1); for (const [k, c] of stops) gr.addColorStop(k, c); return gr; }
g.fillStyle = vgrad(-0.35, 0.6, thaw ? [[0, '#4a5068'], [0.7, '#7d8296'], [1, '#9a9aa6']] : [[0, '#3d4672'], [0.6, '#7380a6'], [1, '#a7aec4']]);
g.fillRect(X0, -0.35, W, 1.6);
// far: the domes and a bell tower, faint in the snow-haze
g.fillStyle = thaw ? '#6f7386' : '#7c84a2';
const cx = A * 0.68;
g.fillRect(cx - 0.05, 0.25, 0.1, 0.2);
for (const [x, r] of [[cx, 0.04], [cx - 0.08, 0.025], [cx + 0.08, 0.025]]) {
  g.beginPath(); g.moveTo(x - r, 0.3 - (x === cx ? 0.05 : 0)); g.quadraticCurveTo(x - r, 0.22 - r, x, 0.2 - r * 1.6 - (x === cx ? 0.03 : 0)); g.quadraticCurveTo(x + r, 0.22 - r, x + r, 0.3 - (x === cx ? 0.05 : 0)); g.closePath(); g.fill();
}
g.fillRect(cx + 0.14, 0.18, 0.03, 0.27);
// the roofs across the street: a row of houses, their walls, their roofs white with snow (or dark and wet)
const roofs = [];
for (let x = X0; x < X1; ) { const w = 0.12 + rnd() * 0.16; roofs.push([x, w, 0.36 + rnd() * 0.06]); x += w; }
for (const [x, w, top] of roofs) {
  g.fillStyle = ['#8a7f78', '#9a8e80', '#7e7a80', '#a39886'][(x * 37 | 0) & 3];
  g.fillRect(x, top + 0.035, w, 1.25 - top);
  g.fillStyle = thaw ? '#3b3b44' : '#e8ecf4';
  g.beginPath(); g.moveTo(x - 0.005, top + 0.04); g.lineTo(x + w * 0.15, top); g.lineTo(x + w * 0.85, top); g.lineTo(x + w + 0.005, top + 0.04); g.closePath(); g.fill();
  g.fillStyle = thaw ? '#2f2f36' : '#d8dde8';
  g.fillRect(x + w * 0.6, top - 0.03, 0.012, 0.03);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
    const lit = rnd() < 0.18;
    g.fillStyle = lit ? '#e9c58c' : '#4a4c5a';
    g.fillRect(x + 0.015 + i * (w - 0.03) / 3, top + 0.07 + j * 0.07, 0.016, 0.03);
  }
}
