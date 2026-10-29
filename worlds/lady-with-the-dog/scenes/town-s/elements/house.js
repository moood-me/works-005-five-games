// Von Diderits' house behind the fence: two storeys of grey-painted boarding, white window frames, the roof (snow on
// it in winter, wet and dark in the thaw, bare in autumn), the chimneys; the front door over the porch (x 2.9 − 3 =
// −0.1 here). Her window upstairs is the element `window`; the others are dark.
const S = e.lib.SEASONS[e.state.season] || e.lib.SEASONS.winter, season = e.state.season;
g.fillStyle = '#8f9196'; g.fillRect(-6, -6.6, 12, 6.6);
g.fillStyle = 'rgba(60,62,70,0.18)'; for (let y = -6.6; y < 0; y += 0.22) g.fillRect(-6, y, 12, 0.02);
g.fillStyle = '#e4e2dc'; g.fillRect(-6, -3.25, 12, 0.12); g.fillRect(-6, -6.7, 12, 0.14);
g.fillStyle = season === 'winter' ? '#e8eaf0' : season === 'thaw' ? '#55565c' : '#5e5048';
g.beginPath(); g.moveTo(-6.4, -6.6); g.lineTo(-4.2, -9.0); g.lineTo(4.2, -9.0); g.lineTo(6.4, -6.6); g.fill();
if (season === 'thaw') { g.fillStyle = 'rgba(230,232,238,0.6)'; for (let x = -5.6; x < 6; x += 0.7) g.fillRect(x, -7.2 + Math.sin(x) * 0.2, 0.4, 0.15); }
g.fillStyle = '#6a5a52'; g.fillRect(-3.0, -9.6, 0.5, 1.2); g.fillRect(2.6, -9.6, 0.5, 1.2);
const win = (x, y, w, h) => {
  g.fillStyle = '#e4e2dc'; g.fillRect(x - w / 2 - 0.08, y - 0.08, w + 0.16, h + 0.16);
  g.fillStyle = '#2e3038'; g.fillRect(x - w / 2, y, w, h);
  g.fillStyle = '#e4e2dc'; g.fillRect(x - 0.025, y, 0.05, h); g.fillRect(x - w / 2, y + h * 0.4, w, 0.04);
};
for (const x of [-4.2, 0.5, 2.6, 4.6]) win(x, -4.6, 1.0, 1.2);   // upstairs (hers is at x −1.85: the element `window`)
for (const x of [-4.6, -2.4, 2.4, 4.6]) win(x, -2.6, 1.0, 1.3);
g.fillStyle = '#4a3e36'; g.fillRect(-0.6, -2.4, 1.0, 2.4);      // the front door
g.fillStyle = '#e4e2dc'; g.fillRect(-0.68, -2.48, 1.16, 0.08);
if (S.snow) for (const x of [-4.2, 0.5, 2.6, 4.6]) { g.fillStyle = S.snow; g.fillRect(x - 0.6, -3.46, 1.2, 0.06); }
