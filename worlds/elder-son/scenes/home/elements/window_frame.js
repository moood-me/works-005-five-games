// The window's frame from inside, before the glass: the white-painted casing, the two leaves' bars, the transom, the
// upper lights; a geranium in a pot on the sill's left; two short chintz curtains drawn aside on a string. Metres; the
// opening 1.2 × 1.0 over the sill (y 0), x = across − the window's middle.
const W = e.lib.WINDOW, w = W.w, h = W.h, bar = -h + e.lib.TRANSOM;
g.fillStyle = '#e6dfd2';
g.fillRect(-w / 2 - 0.12, -h - 0.12, 0.12, h + 0.12);
g.fillRect(w / 2, -h - 0.12, 0.12, h + 0.12);
g.fillRect(-w / 2 - 0.12, -h - 0.12, w + 0.24, 0.12);
g.fillStyle = '#d9d1c2';
g.fillRect(-0.035, -h, 0.07, h);
g.fillRect(-w / 2, bar - 0.03, w, 0.06);
g.fillRect(-w / 2, -h, 0.04, h);
g.fillRect(w / 2 - 0.04, -h, 0.04, h);
g.fillRect(-w / 2, -0.04, w, 0.04);
g.fillStyle = '#bfb6a6';
g.fillRect(-0.02, -h, 0.008, h);
g.fillRect(-w / 2, bar + 0.02, w, 0.006);
// the latch
g.fillStyle = '#8f8676';
g.fillRect(0.04, bar + 0.25, 0.03, 0.08);
// the geranium on the sill
g.fillStyle = '#9a4f32';
g.beginPath();
g.moveTo(-0.46, 0);
g.lineTo(-0.3, 0);
g.lineTo(-0.28, -0.13);
g.lineTo(-0.48, -0.13);
g.closePath();
g.fill();
g.fillStyle = '#3f5e34';
for (let i = 0; i < 9; i++) {
  g.beginPath();
  g.ellipse(-0.38 + (e.rnd() - 0.5) * 0.22, -0.2 - e.rnd() * 0.14, 0.05, 0.035, e.rnd() * 3, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#c4423a';
for (let i = 0; i < 4; i++) {
  g.beginPath();
  g.arc(-0.4 + (e.rnd() - 0.5) * 0.14, -0.33 - e.rnd() * 0.05, 0.025, 0, Math.PI * 2);
  g.fill();
}
// the curtains on their string, drawn aside: they hang over the casing and a little over the glass
g.strokeStyle = '#6a5a48';
g.lineWidth = 0.008;
g.beginPath();
g.moveTo(-w / 2 - 0.28, -h - 0.08);
g.lineTo(w / 2 + 0.28, -h - 0.08);
g.stroke();
for (const s of [-1, 1]) {
  const x0 = s * (w / 2 + 0.26), x1 = s * (w / 2 - 0.1);
  g.fillStyle = '#d8c8a4';
  g.beginPath();
  g.moveTo(x0, -h - 0.08);
  g.lineTo(x1, -h - 0.08);
  g.quadraticCurveTo(s * (w / 2 - 0.02), -h * 0.55, s * (w / 2 + 0.06), -0.02);
  g.lineTo(x0, -0.02);
  g.closePath();
  g.fill();
  g.strokeStyle = 'rgba(150,80,60,0.55)';
  g.lineWidth = 0.012;
  for (let k = 0; k < 5; k++) {
    const x = x0 + (x1 - x0) * (k + 0.5) / 5.5;
    g.beginPath();
    g.moveTo(x, -h - 0.06);
    g.lineTo(x + s * 0.03, -0.04);
    g.stroke();
  }
}
