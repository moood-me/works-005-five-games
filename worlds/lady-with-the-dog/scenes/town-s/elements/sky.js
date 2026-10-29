// The sky over S. and the far land under it, in stage heights — painted wide, all the way round (the shots turn): a
// grey winter day (flat white-grey, low soft clouds), a winter or autumn dusk (blue-violet, a warm band low in the
// west — ahead and to the right of the street's view, toward the station), a morning (pale and cold). On the horizon
// the far roofs of the town and its church, poplars, the low line of the fields. Painted for the state (the season and
// the hour change only at a cut); the clouds drift as a layer.
const A = e.aspect, H = 0.5, s = e.state;
const TURN = 6.88, X0 = A / 2 - TURN / 2, X1 = A / 2 + TURN / 2, W = X1 - X0, DEG = TURN / 360;   // a whole turn
const west = A / 2 + 40 * DEG;                                         // the sunset's bearing
const hour = Number(s.hour) || 0.5, dusk = hour > 0.7, morning = hour < 0.42, autumn = s.season === 'autumn';
const rnd = (() => { let k = 5; return () => ((k = (k * 16807) % 2147483647) / 2147483647); })();
const vgrad = (y0, y1, stops) => { const gr = g.createLinearGradient(0, y0, 0, y1); for (const [k, c] of stops) gr.addColorStop(k, c); return gr; };
const glow = (x, y, rx, ry, c, a) => { g.save(); g.translate(x, y); g.scale(rx, ry); const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = a; g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, Math.PI * 2); g.fill(); g.restore(); };
if (dusk) {
  g.fillStyle = vgrad(-0.6, H, autumn ? [[0, '#2c3058'], [0.45, '#4e5482'], [0.78, '#8a7e9a'], [0.93, '#c99a86'], [1, '#e2b48a']]
                                      : [[0, '#283252'], [0.45, '#46557e'], [0.78, '#7c84a6'], [0.93, '#b49aa8'], [1, '#d6b2a0']]);
  g.fillRect(X0, -0.6, W, H + 0.6);
  for (const dx of [-TURN, 0, TURN]) { glow(west + dx, H, 1.2, 0.22, autumn ? '#ffbf86' : '#f4c4a4', 0.6); glow(west + dx, H, 0.35, 0.05, '#fff0d4', 0.6); }
} else if (morning) {
  g.fillStyle = vgrad(-0.6, H, [[0, '#8fa2c0'], [0.55, '#bccadc'], [0.9, '#e2e2e8'], [1, '#efe2dc']]);
  g.fillRect(X0, -0.6, W, H + 0.6);
} else {
  g.fillStyle = vgrad(-0.6, H, [[0, '#a8adb8'], [0.6, '#c6c9d0'], [1, '#dcdde2']]);
  g.fillRect(X0, -0.6, W, H + 0.6);
}
// the far land below the horizon: snow or the autumn's dark fields, the edge hazed
const land = autumn ? ['#7a7068', '#5e5650'] : dusk ? ['#8a8ca4', '#6e7088'] : ['#d4d6de', '#bcc0ca'];
g.fillStyle = vgrad(H, 1.25, [[0, land[0]], [1, land[1]]]);
g.fillRect(X0, H, W, 1.25 - H);
// the far town on the horizon (straight ahead and to the left, behind the street's houses): roofs, a church, poplars
const far = autumn ? '#5a566a' : dusk ? '#565a78' : morning ? '#9ea4b8' : '#9a9ea8';
g.fillStyle = far;
for (let i = 0; i < 70; i++) {
  const x = X0 + rnd() * W, w = 0.01 + rnd() * 0.035, h = 0.004 + rnd() * 0.012;
  g.fillRect(x, H - h, w, h + 0.002);
  g.beginPath(); g.moveTo(x - 0.002, H - h); g.lineTo(x + w / 2, H - h - w * 0.35); g.lineTo(x + w + 0.002, H - h); g.fill();
}
for (const cx of [A * 0.28]) {
  g.fillRect(cx - 0.006, H - 0.035, 0.012, 0.035);
  g.beginPath(); g.ellipse(cx, H - 0.036, 0.009, 0.011, 0, Math.PI, 0); g.fill();
  g.fillRect(cx - 0.0006, H - 0.058, 0.0012, 0.012);
}
for (let i = 0; i < 40; i++) {
  const x = X0 + rnd() * W, h = 0.012 + rnd() * 0.02;
  g.beginPath(); g.ellipse(x, H - h / 2, 0.003 + rnd() * 0.003, h / 2, 0, 0, Math.PI * 2); g.fill();
}
g.fillRect(X0, H - 0.0015, W, 0.003);
// low clouds drifting
e.layer('clouds', { box: [X0, -0.3, X1, H], drift: [0.003, 0] }, gc => {
  for (let i = 0; i < 30; i++) {
    const x = X0 + rnd() * W, y = 0.1 + rnd() * 0.3, len = 0.2 + rnd() * 0.5, th = 0.01 + rnd() * 0.025;
    gc.fillStyle = dusk ? (autumn ? 'rgba(90,80,110,0.45)' : 'rgba(80,88,120,0.45)') : morning ? 'rgba(236,232,236,0.4)' : 'rgba(176,180,190,0.5)';
    for (const dx of [-W, 0, W]) { gc.beginPath(); gc.ellipse(x + dx, y, len / 2, th, 0, 0, Math.PI * 2); gc.fill(); }
    if (dusk) { gc.fillStyle = autumn ? 'rgba(240,180,130,0.35)' : 'rgba(230,180,160,0.3)'; for (const dx of [-W, 0, W]) { gc.beginPath(); gc.ellipse(x + dx, y + th * 0.5, len * 0.42, th * 0.4, 0, 0, Math.PI * 2); gc.fill(); } }
  }
});
if (dusk) e.layer('star', {}, gs => { gs.fillStyle = '#f2f0ff'; gs.beginPath(); gs.arc(A * 0.66, 0.08, 0.002, 0, Math.PI * 2); gs.fill(); });
