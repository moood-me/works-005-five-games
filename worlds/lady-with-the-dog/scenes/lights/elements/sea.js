// The night sea of Yalta from the quay, painted once a season: the sky with the moon high on the left, the far arc of
// the bay with its quay's lamps and the town's windows on the hills, the sea down to the parapet at the foot, the
// moon's road on it. The season: summer — a warm haze over the shore; autumn — torn clouds going over; winter — snow
// on the hills and the parapet, colder; the thaw — wet stone, a mist on the water. The stars' twinkle, the glints on
// the water and the lamps' trembling reflections are its shader's (sea.wgsl); its layers — the stars, the reflections,
// the clouds (always painted, in that order: the shader reads them as 1, 2, 3).
const A = e.aspect;
const L = e.lib;
const H = L.HORIZON;
const FOOT = L.FOOT;
const season = L.seasonOf(e.state.season);
const X0 = -0.3;
const X1 = A + 0.3;
const W = X1 - X0;
const Y0 = -0.35;
const Y1 = 1.25;
const MX = L.moonX(A);
const MY = L.MOON_Y;
const cold = season === 'winter' || season === 'thaw';

function vgrad(y0, y1, stops) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  for (const [k, c] of stops) gr.addColorStop(k, c);
  return gr;
}
function glow(gc, x, y, rx, ry, colour, a) {
  gc.save();
  gc.translate(x, y);
  gc.scale(rx, ry);
  const gr = gc.createRadialGradient(0, 0, 0, 0, 0, 1);
  gr.addColorStop(0, colour);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  gc.globalAlpha = a;
  gc.fillStyle = gr;
  gc.beginPath();
  gc.arc(0, 0, 1, 0, Math.PI * 2);
  gc.fill();
  gc.restore();
}

// ── the sky: deep blue above, lighter and a little lilac down to the shore (never black)
const skyStops = cold
  ? [[0, '#16213b'], [0.45, '#22314f'], [0.85, '#3a4a68'], [1, '#56607a']]
  : [[0, '#18223e'], [0.45, '#26345a'], [0.85, '#46507a'], [1, '#6c6682']];
g.fillStyle = vgrad(Y0, H, skyStops);
g.fillRect(X0, Y0, W, H - Y0);
// the moon's light in the air round it
glow(g, MX, MY, 0.42, 0.36, cold ? '#8d9cba' : '#9aa2c4', 0.45);
// the haze over the town's lamps along the shore (warmer in summer)
glow(g, A / 2, H, A * 0.75, 0.06, season === 'summer' ? '#b58f78' : '#7d7a8c', season === 'summer' ? 0.5 : 0.3);

// the moon: a disc, its glow the engine's
g.fillStyle = '#f1efe4';
g.beginPath();
g.arc(MX, MY, 0.026, 0, Math.PI * 2);
g.fill();
g.fillStyle = 'rgba(200,196,182,0.35)';
g.beginPath();
g.arc(MX + 0.007, MY - 0.004, 0.008, 0, Math.PI * 2);
g.arc(MX - 0.009, MY + 0.007, 0.006, 0, Math.PI * 2);
g.fill();
e.light(MX, MY, 0.07, '#dfe4f0', 0.6, 'moon');
e.at(MX, MY, 'moon');

// ── the far shore: the hills behind the town, the cape on the right; snow on their tops in winter
const hill = x => {
  const u = (x - X0) / W;
  return H - 0.006 - 0.05 * Math.pow(Math.sin(u * 2.4 + 0.5), 2) * (1 - 0.6 * u) - 0.008 * Math.sin(u * 19) - 0.012 * Math.exp(-Math.pow((u - 0.82) / 0.05, 2));
};
g.fillStyle = cold ? '#2a3550' : '#273049';
g.beginPath();
g.moveTo(X0, H + 0.004);
for (let i = 0; i <= 160; i++) {
  const x = X0 + (W * i) / 160;
  g.lineTo(x, hill(x));
}
g.lineTo(X1, H + 0.004);
g.closePath();
g.fill();
if (season === 'winter') {
  g.fillStyle = 'rgba(214,222,236,0.55)';
  for (let i = 0; i < 160; i++) {
    const x = X0 + (W * i) / 160;
    const y = hill(x);
    if (y < H - 0.03) g.fillRect(x, y, W / 160 + 0.001, 0.006 + 0.01 * e.rnd());
  }
}
// the town's windows on the slopes: small warm points, few
for (let i = 0; i < 90; i++) {
  const x = X0 + 0.15 + (W - 0.3) * e.rnd();
  const top = hill(x);
  const y = top + (H - top) * (0.35 + 0.6 * e.rnd());
  g.fillStyle = e.rnd() < 0.7 ? 'rgba(255,214,150,0.75)' : 'rgba(230,226,210,0.55)';
  g.fillRect(x, y, 0.0022, 0.0018);
}

// ── the sea: lighter at the shore, deeper toward the parapet; long thin strokes, short and dense at the horizon
g.fillStyle = vgrad(H, FOOT, cold
  ? [[0, '#45526e'], [0.08, '#33435f'], [0.5, '#25344f'], [1, '#1d2b45']]
  : [[0, '#585a76'], [0.08, '#3a4664'], [0.5, '#283654'], [1, '#1f2c48']]);
g.fillRect(X0, H, W, FOOT - H);
// the moon's road: a soft pale column under the moon, wider toward the viewer
g.save();
g.beginPath();
g.moveTo(MX - 0.01, H);
g.lineTo(MX + 0.01, H);
g.lineTo(MX + 0.16, FOOT);
g.lineTo(MX - 0.16, FOOT);
g.closePath();
g.clip();
for (let k = 0; k < 14; k++) {
  const y = H + (FOOT - H) * (k + 0.5) / 14;
  glow(g, MX, y, 0.03 + 0.15 * ((y - H) / (FOOT - H)), 0.04, '#a9b4cc', 0.35);
}
g.restore();
for (let i = 0; i < 700; i++) {
  const u = Math.pow(e.rnd(), 1.7);
  const y = H + 0.003 + u * (FOOT - H - 0.006);
  const len = 0.008 + u * 0.14 * (0.5 + e.rnd());
  g.globalAlpha = 0.12 + 0.2 * e.rnd();
  g.fillStyle = e.rnd() < 0.5 ? '#8e9cba' : '#16203a';
  g.fillRect(X0 + e.rnd() * W, y, len, 0.0006 + u * 0.003);
}
g.globalAlpha = 1;
// the thaw's mist lying on the water by the shore
if (season === 'thaw') glow(g, A / 2, H + 0.02, A * 0.9, 0.05, '#8f97ac', 0.45);

// ── the quay's arc: the lamps along the bay — a line bowing toward the viewer in the middle — and the town above
const arc = x => H - 0.004 + 0.016 * Math.exp(-Math.pow((x - A * 0.55) / (A * 0.38), 2));
g.strokeStyle = cold ? 'rgba(150,158,180,0.5)' : 'rgba(150,150,170,0.45)';
g.lineWidth = 0.0015;
g.beginPath();
for (let i = 0; i <= 120; i++) {
  const x = X0 + (W * i) / 120;
  if (i) g.lineTo(x, arc(x) + 0.002);
  else g.moveTo(x, arc(x) + 0.002);
}
g.stroke();
const LAMPS = [];
for (let x = X0 + 0.02; x < X1; x += 0.034 + 0.01 * e.rnd()) LAMPS.push([x, arc(x) - 0.006]);
for (const [x, y] of LAMPS) {
  glow(g, x, y, 0.012, 0.012, '#ffcf8a', 0.55);
  g.fillStyle = '#ffe2ae';
  g.fillRect(x - 0.0014, y - 0.0014, 0.0028, 0.0028);
}

// ── the parapet at the foot: the coping's light top, its face a shade darker, the joints; the season on it
const stone = season === 'thaw' ? '#6f6e6f' : '#8c877f';
g.fillStyle = stone;
g.fillRect(X0, FOOT, W, 0.035);
g.fillStyle = season === 'thaw' ? '#4a4b52' : '#5f5c5a';
g.fillRect(X0, FOOT + 0.035, W, Y1 - FOOT - 0.035);
g.fillStyle = 'rgba(30,30,36,0.35)';
for (let x = X0 + 0.1; x < X1; x += 0.36 + 0.06 * e.rnd()) g.fillRect(x, FOOT, 0.003, Y1 - FOOT);
g.fillStyle = 'rgba(255,255,255,0.12)';
g.fillRect(X0, FOOT, W, 0.003);
if (season === 'winter') {
  // snow on the coping, uneven, a little over its edge
  g.fillStyle = '#e4e8ef';
  g.beginPath();
  g.moveTo(X0, FOOT + 0.012);
  for (let i = 0; i <= 200; i++) {
    const x = X0 + (W * i) / 200;
    g.lineTo(x, FOOT - 0.006 - 0.006 * e.rnd());
  }
  g.lineTo(X1, FOOT + 0.012);
  for (let i = 200; i >= 0; i--) {
    const x = X0 + (W * i) / 200;
    g.lineTo(x, FOOT + 0.01 + 0.012 * e.rnd() * (e.rnd() < 0.3 ? 1 : 0));
  }
  g.closePath();
  g.fill();
}
if (season === 'thaw') {
  // wet: the moon's light lying along the coping, puddles on it
  g.fillStyle = 'rgba(190,200,220,0.25)';
  g.fillRect(X0, FOOT + 0.002, W, 0.006);
  for (let i = 0; i < 30; i++) glow(g, X0 + e.rnd() * W, FOOT + 0.016, 0.05 + 0.04 * e.rnd(), 0.006, '#b8c2d8', 0.35);
}

// ── the stars (layer 1): many small, a few brighter; fewer near the moon and the shore's haze
e.layer('stars', { box: [X0, Y0, X1, H] }, gs => {
  for (let i = 0; i < 520; i++) {
    const x = X0 + e.rnd() * W;
    const y = Y0 + Math.pow(e.rnd(), 1.3) * (H - 0.04 - Y0);
    const near = Math.hypot(x - MX, (y - MY) * 1.2);
    if (near < 0.12 && e.rnd() < 0.8) continue;
    const r = e.rnd() < 0.06 ? 0.0024 : 0.0011 + 0.0008 * e.rnd();
    gs.fillStyle = e.rnd() < 0.25 ? 'rgba(255,236,206,0.9)' : 'rgba(226,232,250,0.85)';
    gs.beginPath();
    gs.arc(x, y, r, 0, Math.PI * 2);
    gs.fill();
  }
});
// ── the lamps' reflections (layer 2): a broken warm streak under each, down into the water
e.layer('reflections', { box: [X0, H - 0.01, X1, H + 0.12] }, gs => {
  for (const [x, y] of LAMPS) {
    const len = 0.03 + 0.05 * e.rnd();
    for (let k = 0; k < 7; k++) {
      const yy = y + 0.012 + (len * k) / 7;
      gs.fillStyle = `rgba(255,200,130,${0.55 * (1 - k / 7)})`;
      gs.fillRect(x - 0.0016 - 0.001 * e.rnd(), yy, 0.0032 + 0.002 * e.rnd(), len / 10);
    }
  }
});
// ── the clouds (layer 3), drifting: torn and plain in autumn; thin bands of mist in the other seasons
e.layer('clouds', { box: [X0, Y0, X1, H], drift: [season === 'autumn' ? 0.006 : 0.002, 0] }, gs => {
  const n = season === 'autumn' ? 14 : 5;
  for (let i = 0; i < n; i++) {
    const x = X0 + e.rnd() * W;
    const y = 0.02 + e.rnd() * (H - 0.1);
    const torn = season === 'autumn';
    for (let j = 0; j < (torn ? 5 : 2); j++) {
      glow(gs, x + (e.rnd() - 0.5) * 0.25, y + (e.rnd() - 0.5) * 0.03, 0.08 + 0.16 * e.rnd(), 0.012 + (torn ? 0.02 : 0.006) * e.rnd(),
        torn ? '#4a5878' : '#5a6684', torn ? 0.75 : 0.3);
    }
  }
});
