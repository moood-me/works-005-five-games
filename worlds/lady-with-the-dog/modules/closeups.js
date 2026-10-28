// Close-ups — inserts of hands and things, one manner for all (closeups.md): flat hands of one model, a soft
// light painted in the shot. paint(g, e, shot) in the insert's code; live(e, shot) in its animate.
// Stage heights: x 0..e.aspect, y 0..1 down; what matters stays in the middle 4:3 (x 0.125..0.875 of the width).

const SKIN = '#e2bfa3', SKIN_D = '#c79a7e', SKIN_L = '#f1d6c0';
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));

function radial(g, x, y, r, stops) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  for (const [k, c] of stops) gr.addColorStop(k, c);
  return gr;
}
function linear(g, x0, y0, x1, y1, stops) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  for (const [k, c] of stops) gr.addColorStop(k, c);
  return gr;
}
function capsulePath(p, x0, y0, x1, y1, r) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  p.moveTo(x0 + Math.cos(a + Math.PI / 2) * r, y0 + Math.sin(a + Math.PI / 2) * r);
  p.arc(x0, y0, r, a + Math.PI / 2, a - Math.PI / 2);
  p.arc(x1, y1, r * 0.92, a - Math.PI / 2, a + Math.PI / 2);
  p.closePath();
}
function capsule(g, x0, y0, x1, y1, r) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  g.beginPath();
  g.arc(x0, y0, r, a + Math.PI / 2, a - Math.PI / 2);
  g.arc(x1, y1, r * 0.92, a - Math.PI / 2, a + Math.PI / 2);
  g.closePath();
  g.fill();
}

// The one hand: the wrist at (x, y), the fingers along `rot` (radians, 0 → to the right), `s` its length (stage
// heights, wrist to finger tips). palm: 'down' (the back of the hand seen), 'up' (the palm seen, fingers a little
// curled). side: 1 a right hand, −1 a left one (the thumb on the side it is). sleeve: the cuff's colour.
function hand(g, x, y, s, rot, { palm = 'down', side = 1, sleeve = '#d8d0bb', light = 0.35 } = {}) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  const w = s * 0.42, flip = palm === 'up' ? -side : side;
  // the cuff
  g.fillStyle = sleeve;
  g.beginPath(); g.moveTo(-s * 0.55, -w * 0.62); g.lineTo(0.02 * s, -w * 0.55); g.lineTo(0.02 * s, w * 0.55); g.lineTo(-s * 0.55, w * 0.62); g.closePath(); g.fill();
  g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(-0.02 * s, -w * 0.55, 0.04 * s, w * 1.1);
  // the thumb (on the side the hand has it)
  const base = palm === 'up' ? SKIN_L : SKIN;
  g.fillStyle = SKIN;
  capsule(g, 0.12 * s, flip * w * 0.42, 0.42 * s, flip * w * 0.78, s * 0.075);
  // the palm
  g.fillStyle = base;
  g.beginPath();
  g.moveTo(0, -w * 0.5);
  g.bezierCurveTo(0.2 * s, -w * 0.58, 0.48 * s, -w * 0.56, 0.56 * s, -w * 0.46);
  g.lineTo(0.56 * s, w * 0.46);
  g.bezierCurveTo(0.48 * s, w * 0.56, 0.2 * s, w * 0.58, 0, w * 0.5);
  g.closePath(); g.fill();
  // four fingers, the middle ones longest; curled a little when the palm is up
  const len = palm === 'up' ? [0.3, 0.36, 0.34, 0.26] : [0.34, 0.42, 0.4, 0.3];
  for (let i = 0; i < 4; i++) {
    const fy = (-0.36 + i * 0.24) * w * 1.05 * -flip;
    g.fillStyle = i % 2 ? base : SKIN;
    capsule(g, 0.5 * s, fy, (0.5 + len[i]) * s, fy * 1.06, s * 0.052);
  }
  // the light painted on it: one side lighter, the other in shade — over the hand alone (clipped to its outline)
  const skin = new Path2D();
  skin.moveTo(0, -w * 0.5);
  skin.bezierCurveTo(0.2 * s, -w * 0.58, 0.48 * s, -w * 0.56, 0.56 * s, -w * 0.46);
  skin.lineTo(0.56 * s, w * 0.46);
  skin.bezierCurveTo(0.48 * s, w * 0.56, 0.2 * s, w * 0.58, 0, w * 0.5);
  skin.closePath();
  capsulePath(skin, 0.12 * s, flip * w * 0.42, 0.42 * s, flip * w * 0.78, s * 0.075);
  for (let i = 0; i < 4; i++) { const fy = (-0.36 + i * 0.24) * w * 1.05 * -flip; capsulePath(skin, 0.5 * s, fy, (0.5 + len[i]) * s, fy * 1.06, s * 0.052); }
  g.save();
  g.clip(skin, 'nonzero');
  g.fillStyle = linear(g, 0, -w, 0, w, [[0, `rgba(255,236,210,${light})`], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(60,30,20,0.28)']]);
  g.fillRect(-s * 0.6, -w * 1.2, s * 1.7, w * 2.4);
  g.restore();
  // knuckles on the back of the hand; a crease on the palm
  g.strokeStyle = palm === 'up' ? 'rgba(150,100,80,0.35)' : 'rgba(150,100,80,0.28)';
  g.lineWidth = s * 0.012;
  g.beginPath();
  if (palm === 'up') { g.moveTo(0.12 * s, -w * 0.2 * flip); g.quadraticCurveTo(0.3 * s, w * 0.1 * flip, 0.5 * s, -w * 0.3 * flip); }
  else for (let i = 0; i < 4; i++) { const fy = (-0.36 + i * 0.24) * w * 1.05 * -flip; g.moveTo(0.5 * s, fy - s * 0.02); g.lineTo(0.52 * s, fy + s * 0.02); }
  g.stroke();
  g.restore();
}

// ── the frames ─────────────────────────────────────────────────────────────────────────────────────────────────

const MELON = A => ({ from: [A / 2 - 0.25, 0.52], to: [A / 2 + 0.23, 0.52] });

function melon(g, e) {
  const A = e.aspect, cx = A / 2, M = MELON(A);
  // the table at night, the candle off to the upper right
  g.fillStyle = linear(g, 0, 0, 0, 1, [[0, '#2c2119'], [1, '#3b2b20']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  g.fillStyle = radial(g, cx + 0.62, 0.05, 1.0, [[0, 'rgba(255,196,120,0.55)'], [0.5, 'rgba(255,170,90,0.16)'], [1, 'rgba(0,0,0,0)']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 0.003;
  for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(-0.3, 0.05 + i * 0.075); g.bezierCurveTo(A * 0.3, 0.07 + i * 0.075, A * 0.6, 0.03 + i * 0.075, A + 0.3, 0.06 + i * 0.075); g.stroke(); }
  // the plate
  g.fillStyle = 'rgba(0,0,0,0.35)';
  g.beginPath(); g.ellipse(cx + 0.03, 0.66, 0.4, 0.15, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#efe9dc';
  g.beginPath(); g.ellipse(cx, 0.62, 0.4, 0.16, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#ddd5c3';
  g.beginPath(); g.ellipse(cx, 0.625, 0.3, 0.11, 0, 0, Math.PI * 2); g.fill();
  // the watermelon: dark green, its pale stripes running round it
  g.save();
  g.beginPath(); g.ellipse(cx, 0.5, 0.29, 0.16, 0, 0, Math.PI * 2); g.clip();
  g.fillStyle = '#2f5a35'; g.fillRect(cx - 0.3, 0.33, 0.6, 0.34);
  g.strokeStyle = '#6f9a5c'; g.lineWidth = 0.022;
  for (let k = -5; k <= 5; k++) {
    g.beginPath();
    for (let i = 0; i <= 20; i++) { const u = i / 20, y = 0.33 + u * 0.34, x = cx + k * 0.06 * Math.sin(Math.PI * (0.15 + u * 0.7)) + 0.01 * Math.sin(u * 19 + k); if (!i) g.moveTo(x, y); else g.lineTo(x, y); }
    g.stroke();
  }
  g.fillStyle = radial(g, cx + 0.12, 0.4, 0.32, [[0, 'rgba(255,220,160,0.35)'], [1, 'rgba(0,0,0,0.25)']]);
  g.fillRect(cx - 0.3, 0.33, 0.6, 0.34);
  g.restore();
  // his left hand holding it from the left, the fingers over its top
  hand(g, cx - 0.5, 0.36, 0.24, 0.32, { side: -1, sleeve: '#d8d0bb' });
  e.at(...M.from, 'from');
  e.at(...M.to, 'to');
  // the cut: a dark-red line from `from`, grown along by `cut`
  e.layer('cutline', { pivot: M.from }, gl => {
    gl.strokeStyle = '#7a1e22'; gl.lineWidth = 0.007; gl.lineCap = 'round';
    gl.beginPath(); gl.moveTo(...M.from); gl.lineTo(M.to[0], M.to[1]); gl.stroke();
  });
  // the slice fallen away: red flesh toward the light, black seeds, the rind's green edge
  e.layer('slice', {}, gs => {
    gs.fillStyle = '#2f5a35';
    gs.beginPath(); gs.ellipse(cx + 0.02, 0.6, 0.27, 0.075, 0.03, 0, Math.PI * 2); gs.fill();
    gs.fillStyle = '#e8e2c8';
    gs.beginPath(); gs.ellipse(cx + 0.02, 0.595, 0.255, 0.065, 0.03, 0, Math.PI * 2); gs.fill();
    gs.fillStyle = '#c4383a';
    gs.beginPath(); gs.ellipse(cx + 0.02, 0.59, 0.24, 0.056, 0.03, 0, Math.PI * 2); gs.fill();
    gs.fillStyle = radial(gs, cx + 0.1, 0.57, 0.25, [[0, 'rgba(255,190,150,0.45)'], [1, 'rgba(0,0,0,0)']]);
    gs.beginPath(); gs.ellipse(cx + 0.02, 0.59, 0.24, 0.056, 0.03, 0, Math.PI * 2); gs.fill();
    gs.fillStyle = '#1d1512';
    for (let i = 0; i < 16; i++) { const a = i * 2.39, r = 0.04 + (i % 4) * 0.045; gs.beginPath(); gs.ellipse(cx + 0.02 + Math.cos(a) * r, 0.59 + Math.sin(a) * r * 0.2, 0.008, 0.004, a, 0, Math.PI * 2); gs.fill(); }
  });
  // the knife and the right hand on its handle: they travel along the cut by `cut`
  e.layer('knife', { box: [M.from[0] - 0.1, 0.05, M.to[0] + 0.65, 0.75] }, gk => {
    const [kx, ky] = M.from;
    // the blade, its edge in the cut, going up to the handle on the right
    gk.fillStyle = '#c9ccd2';
    gk.beginPath(); gk.moveTo(kx - 0.02, ky); gk.lineTo(kx + 0.17, ky - 0.2); gk.lineTo(kx + 0.2, ky - 0.18); gk.lineTo(kx + 0.02, ky + 0.005); gk.closePath(); gk.fill();
    gk.fillStyle = 'rgba(255,240,220,0.6)';
    gk.beginPath(); gk.moveTo(kx - 0.01, ky - 0.004); gk.lineTo(kx + 0.17, ky - 0.198); gk.lineTo(kx + 0.175, ky - 0.193); gk.closePath(); gk.fill();
    gk.fillStyle = '#4a3222';
    capsule(gk, kx + 0.19, ky - 0.2, kx + 0.27, ky - 0.29, 0.018);
    hand(gk, kx + 0.27, ky - 0.33, 0.22, Math.PI - 0.6, { side: 1, sleeve: '#d8d0bb' });   // its fingers round the handle
  });
  // the candle's warmth, trembling
  e.layer('warm', { flicker: 0.35, blend: 'add' }, gw => {
    gw.fillStyle = radial(gw, cx + 0.62, 0.0, 0.7, [[0, 'rgba(255,170,90,0.22)'], [1, 'rgba(0,0,0,0)']]);
    gw.fillRect(cx - 0.2, -0.05, A, 0.8);
  });
}

function hands(g, e) {
  const A = e.aspect, cx = A / 2;
  // the pale coverlet in candlelight: soft folds, the light from the left
  g.fillStyle = linear(g, 0, 0, A, 1, [[0, '#efe3cf'], [0.6, '#d9ccb8'], [1, '#a99d8f']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  for (let i = 0; i < 9; i++) {
    const y = 0.08 + i * 0.11;
    g.strokeStyle = 'rgba(120,100,85,0.16)'; g.lineWidth = 0.02;
    g.beginPath(); g.moveTo(-0.3, y); g.bezierCurveTo(A * 0.25, y + 0.05 * Math.sin(i), A * 0.6, y - 0.05, A + 0.3, y + 0.03 * Math.cos(i * 1.7)); g.stroke();
    g.strokeStyle = 'rgba(255,248,235,0.35)'; g.lineWidth = 0.008;
    g.beginPath(); g.moveTo(-0.3, y - 0.015); g.bezierCurveTo(A * 0.25, y - 0.015 + 0.05 * Math.sin(i), A * 0.6, y - 0.065, A + 0.3, y - 0.015 + 0.03 * Math.cos(i * 1.7)); g.stroke();
  }
  g.fillStyle = radial(g, cx - 0.7, 0.2, 1.3, [[0, 'rgba(255,200,130,0.28)'], [1, 'rgba(40,30,40,0.25)']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  // her right hand on the coverlet, the fingers to the left: palm down, and (another layer) turned palm up
  const her = [cx + 0.4, 0.58];
  e.layer('her', {}, gh => hand(gh, her[0], her[1], 0.26, Math.PI - 0.12, { side: 1, sleeve: '#f1eef2', palm: 'down' }));
  e.layer('her_up', {}, gh => hand(gh, her[0], her[1], 0.26, Math.PI - 0.12, { side: 1, sleeve: '#f1eef2', palm: 'up' }));
  // his hand, from the left, coming to hers by `hand_at`
  e.layer('his', { box: [-0.3, 0.2, A + 0.3, 1.0] }, gh => hand(gh, cx - 0.62, 0.66, 0.28, -0.08, { side: 1, sleeve: '#d8d0bb' }));
  e.layer('warm', { flicker: 0.3, blend: 'add' }, gw => {
    gw.fillStyle = radial(gw, cx - 0.8, 0.1, 0.9, [[0, 'rgba(255,170,90,0.16)'], [1, 'rgba(0,0,0,0)']]);
    gw.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  });
}
const HIS_FROM = A => A / 2 - 0.62 + 0.28 * 0.9;        // where his finger tips are at `hand_at` 0
const HIS_TO = A => A / 2 + 0.4 - 0.26 * 0.95 - 0.03;     // … and at 1: just short of her finger tips

function tea(g, e) {
  const A = e.aspect, cx = A / 2;
  // the dark wall, the white cloth below; the lamp off to the left
  g.fillStyle = linear(g, 0, 0, 0, 0.62, [[0, '#2f3330'], [1, '#3c3f39']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 0.7);
  g.fillStyle = linear(g, 0, 0.62, 0, 1, [[0, '#e8e2d6'], [1, '#cfc7b8']]);
  g.fillRect(-0.3, 0.62, A + 0.6, 0.45);
  g.fillStyle = radial(g, cx - 0.75, 0.2, 1.1, [[0, 'rgba(255,205,140,0.4)'], [1, 'rgba(0,0,0,0.1)']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  // the samovar's brass belly above, its tap coming out toward us
  g.fillStyle = linear(g, cx - 0.4, 0, cx + 0.4, 0, [[0, '#6e5226'], [0.35, '#d8b26a'], [0.55, '#f1d899'], [1, '#7a5a2a']]);
  g.beginPath(); g.moveTo(cx - 0.42, -0.05); g.bezierCurveTo(cx - 0.46, 0.2, cx - 0.36, 0.36, cx - 0.2, 0.4); g.lineTo(cx + 0.2, 0.4); g.bezierCurveTo(cx + 0.36, 0.36, cx + 0.46, 0.2, cx + 0.42, -0.05); g.closePath(); g.fill();
  g.fillStyle = '#8a6a34'; g.fillRect(cx - 0.2, 0.39, 0.4, 0.025);
  // the tap: a spout and its key
  g.fillStyle = linear(g, 0, 0.36, 0, 0.47, [[0, '#f0d38f'], [1, '#8a6a34']]);
  g.beginPath(); g.moveTo(cx - 0.035, 0.36); g.lineTo(cx + 0.035, 0.36); g.lineTo(cx + 0.03, 0.45); g.quadraticCurveTo(cx + 0.03, 0.48, cx + 0.005, 0.48); g.lineTo(cx - 0.005, 0.48); g.quadraticCurveTo(cx - 0.03, 0.48, cx - 0.03, 0.45); g.closePath(); g.fill();
  g.fillStyle = '#c9a45e';
  g.beginPath(); g.ellipse(cx + 0.075, 0.385, 0.05, 0.018, -0.2, 0, Math.PI * 2); g.fill();
  e.at(cx + 0.08, 0.385, 'tap');
  // his right hand at the tap's key, from the right
  hand(g, cx + 0.42, 0.33, 0.24, Math.PI + 0.25, { side: 1, sleeve: '#34353d' });
  // the saucer and the glass's back
  const G = { x: cx, top: 0.6, bot: 0.86, w: 0.075 };
  g.fillStyle = '#efe9dc';
  g.beginPath(); g.ellipse(cx, 0.88, 0.17, 0.04, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(200,210,215,0.22)';
  g.beginPath(); g.moveTo(G.x - G.w, G.top); g.lineTo(G.x - G.w * 0.86, G.bot); g.lineTo(G.x + G.w * 0.86, G.bot); g.lineTo(G.x + G.w, G.top); g.closePath(); g.fill();
  // the tea in the glass, risen by `fill` (scaled from the glass's bottom)
  e.layer('tea', { pivot: [cx, G.bot] }, gt => {
    gt.fillStyle = linear(gt, 0, G.top, 0, G.bot, [[0, '#c27a2c'], [1, '#7a3c14']]);
    gt.beginPath(); gt.moveTo(G.x - G.w * 0.95, G.top + 0.01); gt.lineTo(G.x - G.w * 0.83, G.bot - 0.004); gt.lineTo(G.x + G.w * 0.83, G.bot - 0.004); gt.lineTo(G.x + G.w * 0.95, G.top + 0.01); gt.closePath(); gt.fill();
  });
  // the stream from the tap into the glass
  e.layer('stream', {}, gs => {
    gs.fillStyle = 'rgba(190,110,40,0.85)';
    gs.fillRect(cx - 0.006, 0.48, 0.012, G.bot - 0.48);
  });
  // a little puddle on the saucer: spilt
  e.layer('spill', {}, gp => {
    gp.fillStyle = 'rgba(150,80,30,0.7)';
    gp.beginPath(); gp.ellipse(cx + 0.1, 0.885, 0.06, 0.014, 0, 0, Math.PI * 2); gp.fill();
  });
  // the glass's front: the silver holder and its handle, the glints of the glass
  e.layer('holder', {}, gh => {
    gh.strokeStyle = 'rgba(240,248,255,0.55)'; gh.lineWidth = 0.004;
    gh.beginPath(); gh.moveTo(G.x - G.w, G.top); gh.lineTo(G.x - G.w * 0.86, G.bot); gh.moveTo(G.x + G.w, G.top); gh.lineTo(G.x + G.w * 0.86, G.bot); gh.stroke();
    gh.beginPath(); gh.ellipse(G.x, G.top, G.w, 0.012, 0, 0, Math.PI * 2); gh.stroke();
    gh.fillStyle = linear(gh, G.x - G.w, 0, G.x + G.w, 0, [[0, '#7d8085'], [0.4, '#d9dce0'], [1, '#6c6f74']]);
    gh.beginPath(); gh.moveTo(G.x - G.w * 0.98, G.top + 0.12); gh.lineTo(G.x + G.w * 0.98, G.top + 0.12); gh.lineTo(G.x + G.w * 0.9, G.bot + 0.005); gh.lineTo(G.x - G.w * 0.9, G.bot + 0.005); gh.closePath(); gh.fill();
    gh.strokeStyle = '#8f9297'; gh.lineWidth = 0.012;
    gh.beginPath(); gh.moveTo(G.x + G.w * 0.95, G.top + 0.14); gh.bezierCurveTo(G.x + G.w + 0.07, G.top + 0.14, G.x + G.w + 0.07, G.top + 0.24, G.x + G.w * 0.92, G.top + 0.24); gh.stroke();
  });
  // steam over the glass
  e.layer('steam', { drift: [0, -0.03], box: [cx - 0.15, 0.3, cx + 0.15, 0.6] }, gv => {
    for (let i = 0; i < 6; i++) {
      const x = cx - 0.06 + i * 0.024, y = 0.3 + (i % 3) * 0.1;
      gv.fillStyle = radial(gv, x, y + 0.05, 0.05, [[0, 'rgba(240,240,235,0.16)'], [1, 'rgba(240,240,235,0)']]);
      gv.fillRect(x - 0.06, y - 0.01, 0.12, 0.12);
    }
  });
}

function mirror(g, e) {
  const A = e.aspect, cx = A / 2;
  // the wall about the mirror
  g.fillStyle = '#2d2b2a'; g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  // in the glass, seen from behind and a little to the side: her grey shoulder and the back of her fair head, his
  // hand on that shoulder, his own head beside — the ear, the temple going grey; the lamp's glow behind them
  const gx = cx - 0.55, gy = 0.12;
  g.save();
  g.beginPath(); g.rect(gx, gy, A + 0.3 - gx, 1.05 - gy); g.clip();
  g.fillStyle = linear(g, 0, gy, 0, 1, [[0, '#3a3836'], [1, '#4a443e']]);
  g.fillRect(gx, gy, A, 1);
  g.fillStyle = radial(g, cx + 0.62, 0.22, 0.45, [[0, 'rgba(255,205,140,0.6)'], [1, 'rgba(0,0,0,0)']]);
  g.fillRect(gx, gy, A, 1);
  // her: the grey dress over the shoulder and down to the right, the neck, the back of her head with its bun
  g.fillStyle = '#a19fa6';
  g.beginPath(); g.moveTo(cx - 0.3, 1.06); g.bezierCurveTo(cx - 0.22, 0.8, cx - 0.05, 0.64, cx + 0.16, 0.6);
  g.bezierCurveTo(cx + 0.24, 0.58, cx + 0.3, 0.56, cx + 0.36, 0.56); g.bezierCurveTo(cx + 0.5, 0.58, cx + 0.62, 0.66, cx + 0.7, 0.8);
  g.lineTo(cx + 0.74, 1.06); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,225,190,0.22)';
  g.beginPath(); g.moveTo(cx - 0.18, 0.86); g.bezierCurveTo(cx - 0.1, 0.72, cx + 0.04, 0.64, cx + 0.2, 0.62); g.lineTo(cx + 0.2, 0.66); g.bezierCurveTo(cx + 0.04, 0.68, cx - 0.06, 0.76, cx - 0.12, 0.9); g.closePath(); g.fill();
  g.fillStyle = '#d9b9a0';
  g.beginPath(); g.moveTo(cx + 0.22, 0.58); g.quadraticCurveTo(cx + 0.24, 0.46, cx + 0.26, 0.42); g.lineTo(cx + 0.38, 0.42); g.quadraticCurveTo(cx + 0.38, 0.5, cx + 0.4, 0.57); g.closePath(); g.fill();
  g.fillStyle = '#c8ab72';
  g.beginPath(); g.ellipse(cx + 0.32, 0.33, 0.1, 0.12, 0.1, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#b89a62';
  g.beginPath(); g.ellipse(cx + 0.34, 0.24, 0.055, 0.045, 0.2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(240,220,170,0.5)'; g.lineWidth = 0.004;
  for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(cx + 0.25 + i * 0.02, 0.43); g.quadraticCurveTo(cx + 0.27 + i * 0.015, 0.33, cx + 0.31 + i * 0.008, 0.25); g.stroke(); }
  // his head beside hers, from behind: the hair going grey, greyest at the temple; the ear; the dark collar
  g.fillStyle = '#26262c';
  g.beginPath(); g.moveTo(gx, 1.06); g.lineTo(gx, 0.55); g.bezierCurveTo(cx - 0.42, 0.5, cx - 0.32, 0.5, cx - 0.22, 0.56); g.lineTo(cx - 0.1, 0.7); g.lineTo(cx - 0.3, 1.06); g.closePath(); g.fill();
  g.fillStyle = '#d2b199';
  g.beginPath(); g.moveTo(cx - 0.4, 0.52); g.lineTo(cx - 0.38, 0.42); g.lineTo(cx - 0.26, 0.42); g.lineTo(cx - 0.25, 0.53); g.closePath(); g.fill();
  g.fillStyle = '#7d766e';
  g.beginPath(); g.ellipse(cx - 0.33, 0.31, 0.12, 0.14, -0.1, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#b9b4ab';
  g.beginPath(); g.ellipse(cx - 0.24, 0.3, 0.05, 0.1, -0.15, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(230,228,222,0.8)'; g.lineWidth = 0.004;
  for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(cx - 0.29 + i * 0.008, 0.2 + i * 0.006); g.quadraticCurveTo(cx - 0.24 + i * 0.004, 0.27, cx - 0.23 + i * 0.002, 0.37); g.stroke(); }
  g.fillStyle = '#d6b39a';
  g.beginPath(); g.ellipse(cx - 0.215, 0.335, 0.022, 0.04, 0.1, 0, Math.PI * 2); g.fill();
  // his hand on her shoulder, the dark sleeve from the left
  hand(g, cx - 0.2, 0.68, 0.24, -0.18, { side: 1, sleeve: '#2c2c33', light: 0.3 });
  // the old glass: a little dim and green
  g.fillStyle = 'rgba(70,90,80,0.14)'; g.fillRect(gx, gy, A, 1);
  g.restore();
  // the gilt frame: its corner, carved
  g.fillStyle = linear(g, gx - 0.12, 0, gx + 0.02, 0, [[0, '#6e5524'], [0.5, '#d9b86a'], [1, '#8a6a30']]);
  g.fillRect(gx - 0.12, gy - 0.12, 0.13, 1.2);
  g.fillStyle = linear(g, 0, gy - 0.12, 0, gy + 0.01, [[0, '#6e5524'], [0.5, '#e2c27a'], [1, '#8a6a30']]);
  g.fillRect(gx - 0.12, gy - 0.12, A + 0.5 - gx, 0.13);
  g.fillStyle = '#f0d690';
  for (let i = 0; i < 26; i++) { g.beginPath(); g.arc(gx - 0.055, gy + 0.05 + i * 0.045, 0.012, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(gx + 0.05 + i * 0.07, gy - 0.055, 0.012, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#e9cc84';
  g.beginPath(); g.arc(gx - 0.055, gy - 0.055, 0.05, 0, Math.PI * 2); g.fill();
  // the lamp in the mirror, trembling a little
  e.layer('lamp', { flicker: 0.25, blend: 'add' }, gl => {
    gl.fillStyle = radial(gl, cx + 0.62, 0.22, 0.3, [[0, 'rgba(255,200,130,0.35)'], [1, 'rgba(0,0,0,0)']]);
    gl.fillRect(cx + 0.2, 0.0, 0.8, 0.6);
  });
}

const FRAMES = { melon, hands, tea, mirror };

function paint(g, e, shot) {
  const f = FRAMES[shot];
  if (!f) { e.warn(`closeups: no frame "${shot}"`); return; }
  f(g, e);
}

function live(e, shot) {
  const s = e.state, A = e.aspect;
  if (shot === 'melon') {
    const M = MELON(A), cut = clamp01(s.cut), L = M.to[0] - M.from[0];
    e.layer('cutline').scaleX = Math.max(0.001, cut);
    e.layer('cutline').alpha = cut > 0.002 && !(Number(s.slice) > 0.5) ? 1 : 0;
    e.layer('knife').x = cut * L;
    e.layer('slice').alpha = Number(s.slice) > 0.5 ? 1 : 0;
    e.at(M.from[0] + cut * L + 0.23, M.from[1] - 0.245, 'knife');
  } else if (shot === 'hands') {
    const m = e.mem, at = clamp01(s.hand_at), pull = clamp01(s.pull);
    const up = Number(s.palm) > 0.5 ? 1 : 0;
    m.up ??= up;
    const step = Math.min(0.1, e.dt) / 0.6;                 // the hand turns over in about 0.6 s
    m.up += Math.max(-step, Math.min(step, up - m.up));
    const dx = (HIS_TO(A) - HIS_FROM(A)) * at;
    e.layer('his').x = dx;
    e.layer('her').x = e.layer('her_up').x = pull * 0.2;
    e.layer('her').alpha = 1 - m.up;
    e.layer('her_up').alpha = m.up;
    e.at(HIS_FROM(A) + dx, 0.66 - 0.02, 'his');
    e.at(A / 2 + 0.4 - 0.12 + pull * 0.2, 0.58, 'her');
  } else if (shot === 'tea') {
    const fill = clamp01(s.fill);
    e.layer('tea').scaleY = Math.max(0.001, fill);
    e.layer('tea').alpha = fill > 0.002 ? 1 : 0;
    e.layer('stream').alpha = Number(s.tap) > 0.5 ? 1 : 0;
    e.layer('spill').alpha = clamp01(s.spill);
    e.layer('steam').alpha = 0.3 + 0.7 * fill;
  }
}

return { paint, live, hand };
