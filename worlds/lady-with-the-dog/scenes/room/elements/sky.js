// The night outside the balcony door, in stage heights: a deep blue sky, the moon high over the sea a little right of
// the door's middle, the sea dark with the moon's path on it, the far coast low on the left with a few lights.
// Only the door shows it (the room's walls stand before it).
const A = e.aspect, H = 0.42;
const X0 = -0.3, X1 = A + 0.3, W = X1 - X0;
const MX = A * 0.585, MY = 0.31;
const rnd = (() => { let s = 5; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
function vgrad(y0, y1, stops) { const gr = g.createLinearGradient(0, y0, 0, y1); for (const [k, c] of stops) gr.addColorStop(k, c); return gr; }
function glow(gc, x, y, rx, ry, color, alpha) {
  gc.save(); gc.translate(x, y); gc.scale(rx, ry);
  const gr = gc.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
  gc.globalAlpha = alpha; gc.fillStyle = gr; gc.beginPath(); gc.arc(0, 0, 1, 0, Math.PI * 2); gc.fill(); gc.restore();
}
g.fillStyle = vgrad(-0.35, H, [[0, '#161c3c'], [0.6, '#27305a'], [1, '#3f4a7a']]);
g.fillRect(X0, -0.35, W, H + 0.35);
glow(g, MX, MY, 0.28, 0.24, '#8f9fd8', 0.45);
// stars, few (the moon is bright)
g.fillStyle = '#e8ecff';
for (let i = 0; i < 90; i++) { g.globalAlpha = 0.3 + 0.5 * rnd(); g.beginPath(); g.arc(X0 + rnd() * W, -0.35 + rnd() * 0.7, 0.0008 + rnd() * 0.001, 0, Math.PI * 2); g.fill(); }
g.globalAlpha = 1;
// the moon
g.fillStyle = '#f4f1e2';
g.beginPath(); g.arc(MX, MY, 0.022, 0, Math.PI * 2); g.fill();
g.fillStyle = 'rgba(200,196,180,0.5)';
g.beginPath(); g.arc(MX - 0.006, MY - 0.004, 0.006, 0, Math.PI * 2); g.fill();
g.beginPath(); g.arc(MX + 0.007, MY + 0.006, 0.004, 0, Math.PI * 2); g.fill();
e.light(MX, MY, 0.05, '#fff8e0', 1.2, 'disc');
e.at(MX, MY, 'moon');
// the sea: dark, a little lighter toward the horizon; thin strokes
g.fillStyle = vgrad(H, 1.25, [[0, '#2e3866'], [0.15, '#1f2750'], [1, '#121834']]);
g.fillRect(X0, H, W, 1.25 - H);
g.fillStyle = '#3d4a80';
for (let i = 0; i < 400; i++) { const u = rnd() ** 1.6, y = H + 0.002 + u * 0.8; g.globalAlpha = 0.3; g.fillRect(X0 + rnd() * W, y, 0.01 + u * 0.12, 0.0006 + u * 0.003); }
g.globalAlpha = 1;
// the far coast and its few lights
g.fillStyle = '#1b2042';
g.beginPath(); g.moveTo(X0, H + 0.002);
for (let i = 0; i <= 40; i++) { const x = X0 + (A * 0.45 - X0) * i / 40; g.lineTo(x, H - 0.02 * Math.sin(i / 40 * Math.PI) ** 0.7 - 0.004 * Math.sin(i * 1.7)); }
g.lineTo(A * 0.45, H + 0.002); g.closePath(); g.fill();
for (let i = 0; i < 9; i++) e.light(A * (0.05 + 0.04 * i + 0.01 * rnd()), H - 0.004 - 0.008 * rnd(), 0.004, '#ffd7a0', 0.6, 'town' + i);
// the moon's path on the sea: dabs, widening toward the eye; they tremble
e.layer('path', { shimmer: 0.7, box: [MX - 0.4, H, MX + 0.4, 0.9] }, gp => {
  gp.fillStyle = '#e9e8f6';
  for (let i = 0; i < 360; i++) {
    const u = rnd() ** 1.3, y = H + 0.002 + u * 0.4, half = 0.012 + u * 0.18;
    gp.globalAlpha = (0.35 + 0.55 * rnd()) * (1 - u * 0.5);
    gp.fillRect(MX + (rnd() - 0.5) * 2 * half * (0.3 + 0.7 * rnd()), y, 0.003 + u * 0.03 * rnd(), 0.0007 + u * 0.0025);
  }
  gp.globalAlpha = 1;
});
