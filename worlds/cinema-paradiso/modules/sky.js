// sky — the one sky of Giancaldo, for every scene of the world (sky.md). Painted once per tone (the hour and the
// era read as one of five), the stars a layer its shader makes twinkle (tools/sky.wgsl, copied into a scene by
// tools/sky.js). In a scene:
//   elements/sky.js:   e.kit.sky.sky(g, e, e.lib.SKY)        — SKY: { horizon, round, moon, coast, villages }
//   elements/sky.wgsl: the world's (node tools/sky.js <folder>)
// The tone: 'night' (the past, hour ≥ 0.84 or < 0.22: the warm Sicilian night, stars, the moon over the sea), 'dusk'
// (the past, 0.6 ≤ hour < 0.84: afterglow in the north-west), 'dawn' (the past, 0.22 ≤ hour < 0.6: pale gold low in the
// east), 'evening' (now, hour ≥ 0.6 or < 0.22: the cool lilac evening of 1988), 'morning' (now, 0.22 ≤ hour < 0.6: a
// grey steel morning, no stars). Warm is the past's; the present is cool.
const TAU = 2 * Math.PI;
const tone = (hour = 0.9, era = 'past') => {
  const h = ((hour % 1) + 1) % 1, day = h >= 0.22 && h < 0.6, eve = h >= 0.6 && h < 0.84;
  if (era === 'now') return day ? 'morning' : 'evening';
  return day ? 'dawn' : eve ? 'dusk' : 'night';
};
// top, middle, low (at the horizon), the band of haze, the sea under the horizon
const PAL = {
  night: { top: '#0b1534', mid: '#18295a', low: '#2e4a7c', haze: 'rgba(80,110,160,0.45)', sea: '#1b2a48', stars: 620, moon: 0.27 },
  dusk: { top: '#243362', mid: '#53608f', low: '#c49a95', haze: 'rgba(220,180,170,0.45)', sea: '#2a3352', stars: 160, moon: 0.33 },
  dawn: { top: '#3a4a74', mid: '#8a90ac', low: '#e8c9a0', haze: 'rgba(236,206,170,0.5)', sea: '#47506a', stars: 40, moon: 0.4 },
  evening: { top: '#141a2e', mid: '#2c3050', low: '#5e5a78', haze: 'rgba(120,116,140,0.5)', sea: '#2a2c40', stars: 260, moon: 0.23 },
  morning: { top: '#59606f', mid: '#8a8e9a', low: '#b7b6b8', haze: 'rgba(190,188,192,0.55)', sea: '#5e6270', stars: 0, moon: null },
};
// the ridges' colours by tone: far land along the horizon
const LAND = { night: ['#1c2a4a', '#17233f'], dusk: ['#5a5070', '#4a4260'], dawn: ['#6a6a84', '#5a5c76'],
  evening: ['#34324a', '#2c2b3e'], morning: ['#7a7c86', '#6c6e78'] };

// o: { horizon: 0.55 — the eye's line (the scene's "horizon"); round: true — a sky all round (roam, around: x 0…2π,
// straight ahead at e.aspect/2) else the stage (x 0…e.aspect); moon: bearing in degrees from straight ahead (right +)
// — where the moon stands over the sea (null: none); coast: [[from°, to°, height, seed], …] — far land along the
// horizon; villages: [from°, to°, n] — a few lights on the far coast at night; glow: bearing° of the afterglow at dusk
// (−50: north-west when the scene looks north) }
function sky(g, e, o = {}) {
  const S = e.state, A = e.aspect, H = o.horizon ?? 0.55, an = e.anim;
  const t = tone(S.hour, S.era), P = PAL[t], round = o.round !== false;
  const bearing = deg => (round ? A / 2 + deg * Math.PI / 180 : A / 2 + deg / 90 * (A / 2));
  const x0 = -0.3, W = A + 0.6;
  const gr = g.createLinearGradient(0, -0.35, 0, H);
  gr.addColorStop(0, P.top); gr.addColorStop(0.62, P.mid); gr.addColorStop(1, P.low);
  g.fillStyle = gr; g.fillRect(x0, -0.35, W, H + 0.352);
  g.fillStyle = P.sea; g.fillRect(x0, H, W, 1.25 - H);
  // a soft glow low on the horizon round a bearing (seen round the circle's seam too)
  const glow = (deg, width, color, height, alpha) => {
    const xc = bearing(deg), n = 90;
    for (let i = 0; i < n; i++) {
      const xa = x0 + W * i / n, w = W / n + 0.002;
      let d = Math.abs(xa + w / 2 - xc);
      if (round) d = Math.min(d, Math.abs(d - A), Math.abs(d + A));
      const k = Math.exp(-(d / width) * (d / width)) * alpha;
      if (k < 0.01) continue;
      const vg = g.createLinearGradient(0, H - height, 0, H);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, color);
      g.globalAlpha = k; g.fillStyle = vg; g.fillRect(xa, H - height, w, height);
    }
    g.globalAlpha = 1;
  };
  const gd = o.glow ?? -50;
  if (t === 'dusk') { glow(gd, 0.9, '#f0b183', 0.3, 0.85); glow(gd, 0.35, '#ffd0a0', 0.08, 0.6); }
  else if (t === 'evening') glow(gd, 0.9, '#9a7d90', 0.26, 0.7);
  else if (t === 'dawn') { glow(gd + 180, 1.0, '#f2c89a', 0.28, 0.8); glow(gd + 180, 0.4, '#ffe2b8', 0.07, 0.6); }
  else if (t === 'night') glow(180, 1.2, '#3a4a78', 0.2, 0.5);
  const hz = g.createLinearGradient(0, H - 0.04, 0, H);
  hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(1, P.haze);
  g.fillStyle = hz; g.fillRect(x0, H - 0.04, W, 0.04);
  // the moon over the sea
  let mx = null, my = null;
  if (o.moon != null && P.moon != null) {
    mx = bearing(o.moon); my = H - P.moon;
    const mr = 0.022, pale = t !== 'night' && t !== 'evening';
    const halo = g.createRadialGradient(mx, my, mr, mx, my, mr * 4);
    halo.addColorStop(0, pale ? 'rgba(230,230,240,0.1)' : 'rgba(200,214,255,0.13)'); halo.addColorStop(1, 'rgba(200,214,255,0)');
    g.fillStyle = halo; g.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
    const md = g.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
    md.addColorStop(0, pale ? '#f4efe4' : '#fffbef'); md.addColorStop(1, pale ? '#d9d2c4' : '#e9e3d0');
    g.globalAlpha = t === 'dawn' ? 0.55 : 1;
    g.fillStyle = md; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill();
    g.fillStyle = 'rgba(150,150,140,0.25)';
    for (const [dx, dy, r] of [[-0.3, -0.2, 0.28], [0.25, 0.1, 0.22], [-0.05, 0.35, 0.18]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, TAU); g.fill(); }
    g.globalAlpha = 1;
    e.at(mx, my, 'disc');
    e.light(mx, my, 0.012, '#dfe6ff', t === 'night' ? 0.4 : 0.25, 'halo');
  } else e.at(bearing(o.moon ?? 0), H - 0.3, 'disc');
  // far land along the horizon
  const [c1, c2] = LAND[t];
  (o.coast ?? []).forEach(([d0, d1, h, seed], i) => {
    g.fillStyle = i % 2 ? c2 : c1; g.beginPath(); g.moveTo(bearing(d0), H + 0.004);
    for (let d = d0; d <= d1; d += 1) {
      const u = (d - d0) / (d1 - d0), env = Math.sin(Math.PI * Math.min(1, u * 1.6)) * (1 - 0.6 * u);
      g.lineTo(bearing(d), H - h * env * (0.65 + 0.35 * (an.noise(d * 0.09, seed) * 0.5 + 0.5)));
    }
    g.lineTo(bearing(d1), H + 0.004); g.closePath(); g.fill();
  });
  if (o.villages && (t === 'night' || t === 'evening')) {
    const [d0, d1, n] = o.villages;
    for (let i = 0; i < n; i++) {
      const d = d0 + (d1 - d0) * (i + an.hash(i, 4) * 0.7) / n, y = H - 0.004 - an.hash(i, 5) * 0.012;
      e.light(bearing(d), y, 0.0035, t === 'evening' ? '#e8e0c8' : '#ffe2a8', 0.55, 'village' + i);
    }
  }
  // the stars — layer 1, twinkling in the shader (none on a grey morning: the layer stays empty)
  e.layer('stars', {}, s => {
    for (let i = 0; i < P.stars; i++) {
      const x = x0 + an.hash(i, 21) * W, y = -0.35 + Math.pow(an.hash(i, 22), 1.4) * (H - 0.06 + 0.35);
      if (mx != null && Math.hypot(x - mx, y - my) < 0.09) continue;
      const r = 0.0007 + Math.pow(an.hash(i, 23), 3) * 0.0022;
      s.fillStyle = an.hash(i, 24) < 0.2 ? '#ffe9cf' : an.hash(i, 24) < 0.5 ? '#dbe6ff' : '#ffffff';
      s.globalAlpha = 0.45 + an.hash(i, 25) * 0.55 - (y > H - 0.15 ? 0.3 : 0);
      s.beginPath(); s.arc(x, y, r, 0, TAU); s.fill();
    }
  });
}
// the window of a room: the same sky as a flat picture in its own units (a pane's painting: x0..x1, y0..y1 metres,
// y down), the tone's gradient and a few stars — for the booth's window on the square, a train's window
function pane(g, x0, y0, x1, y1, hour, era, an) {
  const P = PAL[tone(hour, era)], gr = g.createLinearGradient(0, y0, 0, y1);
  gr.addColorStop(0, P.top); gr.addColorStop(0.7, P.mid); gr.addColorStop(1, P.low);
  g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.fillStyle = '#ffffff';
  for (let i = 0; i < Math.round(P.stars / 40); i++) {
    g.globalAlpha = 0.4 + 0.5 * an.hash(i, 3);
    g.beginPath(); g.arc(x0 + (x1 - x0) * an.hash(i, 1), y0 + (y1 - y0) * 0.7 * an.hash(i, 2), 0.004, 0, TAU); g.fill();
  }
  g.globalAlpha = 1;
}
return { sky, pane, tone, PAL };
