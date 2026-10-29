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
  // the slice fallen away: red flesh toward the light, black seeds, the rind's green edge. `ragged` (the game's, once):
  // cut unevenly — the flesh's edge stepped, a tooth of it standing out where the knife caught
  const ragged = Number(e.state.ragged) > 0.5;
  const flesh = (gs, rx, ry, dy) => {
    gs.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2, top = Math.sin(a) < 0;
      let k = 1;
      if (ragged && top) {
        const u = (Math.cos(a) + 1) / 2;                       // 0 the left end … 1 the right along the top edge
        k = 1 + 0.12 * Math.sin(u * 23) * (0.4 + u) + (u > 0.55 && u < 0.66 ? 0.55 : 0);   // steps, and the tooth
      }
      const x = cx + 0.02 + Math.cos(a) * rx, y = 0.6 + dy + Math.sin(a) * ry * k;
      if (!i) gs.moveTo(x, y); else gs.lineTo(x, y);
    }
    gs.closePath(); gs.fill();
  };
  e.layer('slice', {}, gs => {
    gs.fillStyle = '#2f5a35';
    flesh(gs, 0.27, 0.075, 0);
    gs.fillStyle = '#e8e2c8';
    flesh(gs, 0.255, 0.065, -0.005);
    gs.fillStyle = '#c4383a';
    flesh(gs, 0.24, 0.056, -0.01);
    gs.fillStyle = radial(gs, cx + 0.1, 0.57, 0.25, [[0, 'rgba(255,190,150,0.45)'], [1, 'rgba(0,0,0,0)']]);
    flesh(gs, 0.24, 0.056, -0.01);
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

// The glass in its holder on its saucer: under the tap at glass_at 1, off to the left on the cloth at 0 — every layer
// of it moved by `glass_at` (live); the tap, its key and his hand stand.
const GLASS = { top: 0.6, bot: 0.86, w: 0.075, mid: 0.73 };
const GLASS_FROM = -0.46;                     // the glass at glass_at 0: this far left of its place under the tap
const GLASS_LAYERS = ['glass_back', 'tea', 'spill', 'holder', 'steam'];

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
  e.at(cx, GLASS.mid, 'under');               // where the glass goes: under the tap
  // his right hand at the tap's key, from the right
  hand(g, cx + 0.42, 0.33, 0.24, Math.PI + 0.25, { side: 1, sleeve: '#34353d' });
  // the husband's envelope by the samovar (husband_knows 0 — the party's, read once): “To Anna. For the professor” in
  // his hand — a cool white rectangle askew on the cloth, a few lines of writing, a grey seal
  if (!(Number(e.state.husband_knows) > 0.5)) {
    g.save();
    g.translate(cx + 0.47, 0.83); g.rotate(-0.13);
    g.fillStyle = 'rgba(70,55,40,0.28)'; g.fillRect(-0.15, -0.075, 0.31, 0.17);          // its shadow on the cloth
    g.fillStyle = '#e3e6ec'; g.fillRect(-0.16, -0.09, 0.31, 0.17);
    g.strokeStyle = 'rgba(120,120,135,0.6)'; g.lineWidth = 0.003; g.strokeRect(-0.16, -0.09, 0.31, 0.17);
    g.strokeStyle = 'rgba(55,55,80,0.85)'; g.lineWidth = 0.0035; g.lineCap = 'round';
    for (const [x0, x1, y, k] of [[-0.12, 0.02, -0.04, 1], [-0.09, 0.1, 0.0, 1.3], [-0.04, 0.07, 0.04, 0.8]]) {
      g.beginPath(); g.moveTo(x0, y);
      for (let x = x0; x <= x1; x += 0.004) g.lineTo(x, y + Math.sin(x * 190 * k) * 0.006 * (0.6 + 0.4 * Math.sin(x * 37)));
      g.stroke();
    }
    g.fillStyle = '#6d6a78'; g.beginPath(); g.arc(0.11, 0.05, 0.016, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  const G = GLASS;
  // the saucer and the glass's back
  e.layer('glass_back', { box: [cx - 0.2, G.top - 0.03, cx + 0.2, 0.93] }, gb => {
    gb.fillStyle = 'rgba(60,45,30,0.25)';
    gb.beginPath(); gb.ellipse(cx + 0.015, 0.89, 0.17, 0.035, 0, 0, Math.PI * 2); gb.fill();
    gb.fillStyle = '#efe9dc';
    gb.beginPath(); gb.ellipse(cx, 0.88, 0.17, 0.04, 0, 0, Math.PI * 2); gb.fill();
    gb.fillStyle = 'rgba(200,210,215,0.22)';
    gb.beginPath(); gb.moveTo(cx - G.w, G.top); gb.lineTo(cx - G.w * 0.86, G.bot); gb.lineTo(cx + G.w * 0.86, G.bot); gb.lineTo(cx + G.w, G.top); gb.closePath(); gb.fill();
  });
  // the tea in the glass, risen by `fill` (scaled from the glass's bottom)
  e.layer('tea', { pivot: [cx, G.bot], box: [cx - 0.09, G.top, cx + 0.09, G.bot + 0.01] }, gt => {
    gt.fillStyle = linear(gt, 0, G.top, 0, G.bot, [[0, '#c27a2c'], [1, '#7a3c14']]);
    gt.beginPath(); gt.moveTo(cx - G.w * 0.95, G.top + 0.01); gt.lineTo(cx - G.w * 0.83, G.bot - 0.004); gt.lineTo(cx + G.w * 0.83, G.bot - 0.004); gt.lineTo(cx + G.w * 0.95, G.top + 0.01); gt.closePath(); gt.fill();
  });
  // the stream from the tap (it stands: the glass comes under it)
  e.layer('stream', { box: [cx - 0.02, 0.47, cx + 0.02, G.bot + 0.01] }, gs => {
    gs.fillStyle = 'rgba(190,110,40,0.85)';
    gs.fillRect(cx - 0.006, 0.48, 0.012, G.bot - 0.48);
  });
  // a little puddle on the saucer: spilt
  e.layer('spill', { box: [cx + 0.02, 0.86, cx + 0.18, 0.91] }, gp => {
    gp.fillStyle = 'rgba(150,80,30,0.7)';
    gp.beginPath(); gp.ellipse(cx + 0.1, 0.885, 0.06, 0.014, 0, 0, Math.PI * 2); gp.fill();
  });
  // the glass's front: the silver holder and its handle, the glints of the glass
  e.layer('holder', { box: [cx - 0.1, G.top - 0.02, cx + 0.17, G.bot + 0.02] }, gh => {
    gh.strokeStyle = 'rgba(240,248,255,0.55)'; gh.lineWidth = 0.004;
    gh.beginPath(); gh.moveTo(cx - G.w, G.top); gh.lineTo(cx - G.w * 0.86, G.bot); gh.moveTo(cx + G.w, G.top); gh.lineTo(cx + G.w * 0.86, G.bot); gh.stroke();
    gh.beginPath(); gh.ellipse(cx, G.top, G.w, 0.012, 0, 0, Math.PI * 2); gh.stroke();
    gh.fillStyle = linear(gh, cx - G.w, 0, cx + G.w, 0, [[0, '#7d8085'], [0.4, '#d9dce0'], [1, '#6c6f74']]);
    gh.beginPath(); gh.moveTo(cx - G.w * 0.98, G.top + 0.12); gh.lineTo(cx + G.w * 0.98, G.top + 0.12); gh.lineTo(cx + G.w * 0.9, G.bot + 0.005); gh.lineTo(cx - G.w * 0.9, G.bot + 0.005); gh.closePath(); gh.fill();
    gh.strokeStyle = '#8f9297'; gh.lineWidth = 0.012;
    gh.beginPath(); gh.moveTo(cx + G.w * 0.95, G.top + 0.14); gh.bezierCurveTo(cx + G.w + 0.07, G.top + 0.14, cx + G.w + 0.07, G.top + 0.24, cx + G.w * 0.92, G.top + 0.24); gh.stroke();
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
  // in the glass: her grey shoulder and the back of her fair head on the right; on the left his face, three-quarters,
  // turned to her, lit by the lamp; the temple going grey; his hand on her shoulder; the lamp's glow behind them
  const gx = cx - 0.62, gy = 0.1;
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
  // his shoulders in the dark frock coat, the white collar, the neck
  const hx = cx - 0.3, hy = 0.34;            // the middle of his head
  g.fillStyle = '#26262c';
  g.beginPath(); g.moveTo(gx, 1.06); g.lineTo(gx, 0.66); g.bezierCurveTo(hx - 0.2, 0.58, hx - 0.08, 0.56, hx + 0.02, 0.58);
  g.bezierCurveTo(hx + 0.12, 0.6, hx + 0.2, 0.66, hx + 0.24, 0.74); g.lineTo(hx + 0.1, 1.06); g.closePath(); g.fill();
  g.fillStyle = '#d8d4cc';
  g.beginPath(); g.moveTo(hx - 0.05, 0.56); g.lineTo(hx + 0.1, 0.56); g.lineTo(hx + 0.12, 0.6); g.lineTo(hx - 0.04, 0.6); g.closePath(); g.fill();
  g.fillStyle = '#c9a487';
  g.beginPath(); g.moveTo(hx - 0.045, 0.44); g.lineTo(hx + 0.07, 0.46); g.lineTo(hx + 0.09, 0.565); g.lineTo(hx - 0.04, 0.565); g.closePath(); g.fill();
  // his head: the back of it dark-grey hair, greying; the face three-quarters to the right — brow, nose, moustache, chin
  g.fillStyle = '#5c5751';
  g.beginPath(); g.ellipse(hx - 0.025, hy - 0.02, 0.125, 0.15, -0.05, 0, Math.PI * 2); g.fill();
  const face = new Path2D();
  face.moveTo(hx + 0.01, hy - 0.125);
  face.bezierCurveTo(hx + 0.07, hy - 0.12, hx + 0.1, hy - 0.08, hx + 0.105, hy - 0.04);   // the forehead to the brow
  face.quadraticCurveTo(hx + 0.098, hy - 0.022, hx + 0.103, hy - 0.012);                  // the bridge of the nose
  face.lineTo(hx + 0.14, hy + 0.035);                                                      // the nose's tip
  face.quadraticCurveTo(hx + 0.125, hy + 0.05, hx + 0.105, hy + 0.05);                     // under the nose
  face.lineTo(hx + 0.108, hy + 0.08);                                                      // the upper lip
  face.lineTo(hx + 0.1, hy + 0.092);                                                       // the mouth
  face.quadraticCurveTo(hx + 0.11, hy + 0.11, hx + 0.1, hy + 0.13);                        // the chin
  face.quadraticCurveTo(hx + 0.07, hy + 0.165, hx + 0.02, hy + 0.15);                      // under the chin
  face.quadraticCurveTo(hx - 0.04, hy + 0.13, hx - 0.06, hy + 0.06);                       // the jaw back to the ear
  face.lineTo(hx - 0.045, hy - 0.04);                                                      // up the cheek to the temple
  face.quadraticCurveTo(hx - 0.03, hy - 0.11, hx + 0.01, hy - 0.125);
  face.closePath();
  g.fillStyle = '#d6b096';
  g.fill(face);
  // the lamp's light on it, from the right; the far side of the face in shade
  g.save();
  g.clip(face);
  g.fillStyle = linear(g, hx - 0.06, 0, hx + 0.14, 0, [[0, 'rgba(70,40,30,0.3)'], [0.45, 'rgba(0,0,0,0)'], [1, 'rgba(255,214,160,0.45)']]);
  g.fillRect(hx - 0.1, hy - 0.2, 0.3, 0.4);
  g.restore();
  // the hair over the forehead and the temple — grey at the temple
  g.fillStyle = '#5c5751';
  g.beginPath(); g.moveTo(hx - 0.15, hy + 0.02); g.bezierCurveTo(hx - 0.15, hy - 0.15, hx - 0.02, hy - 0.19, hx + 0.07, hy - 0.115);
  g.quadraticCurveTo(hx + 0.02, hy - 0.11, hx - 0.0, hy - 0.08); g.quadraticCurveTo(hx - 0.03, hy - 0.05, hx - 0.04, hy - 0.0); g.lineTo(hx - 0.09, hy + 0.04); g.closePath(); g.fill();
  g.fillStyle = '#bdb8b0';
  g.beginPath(); g.moveTo(hx - 0.0, hy - 0.085); g.quadraticCurveTo(hx - 0.035, hy - 0.05, hx - 0.042, hy + 0.0); g.lineTo(hx - 0.07, hy - 0.01); g.quadraticCurveTo(hx - 0.06, hy - 0.07, hx - 0.02, hy - 0.1); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(225,222,215,0.75)'; g.lineWidth = 0.003;
  for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(hx - 0.12 + i * 0.012, hy - 0.12 + i * 0.008); g.quadraticCurveTo(hx - 0.07 + i * 0.008, hy - 0.09, hx - 0.06 + i * 0.004, hy - 0.02); g.stroke(); }
  // the ear
  g.fillStyle = '#c99d84';
  g.beginPath(); g.ellipse(hx - 0.06, hy + 0.01, 0.022, 0.038, 0.1, 0, Math.PI * 2); g.fill();
  // the brows, the eyes (the near one, a glimpse of the far one past the nose), the moustache, the mouth
  g.strokeStyle = '#4e4842'; g.lineWidth = 0.006; g.lineCap = 'round';
  g.beginPath(); g.moveTo(hx + 0.025, hy - 0.05); g.quadraticCurveTo(hx + 0.055, hy - 0.06, hx + 0.085, hy - 0.048); g.stroke();
  g.fillStyle = '#2c2522';
  g.beginPath(); g.ellipse(hx + 0.058, hy - 0.022, 0.011, 0.006, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(hx + 0.112, hy - 0.024, 0.004, 0.005, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(80,55,45,0.6)'; g.lineWidth = 0.003;
  g.beginPath(); g.moveTo(hx + 0.045, hy - 0.006); g.quadraticCurveTo(hx + 0.06, hy + 0.0, hx + 0.075, hy - 0.006); g.stroke();
  g.fillStyle = '#6a625a';
  g.beginPath(); g.moveTo(hx + 0.06, hy + 0.06); g.quadraticCurveTo(hx + 0.1, hy + 0.045, hx + 0.13, hy + 0.058);
  g.quadraticCurveTo(hx + 0.12, hy + 0.075, hx + 0.1, hy + 0.072); g.quadraticCurveTo(hx + 0.08, hy + 0.08, hx + 0.055, hy + 0.075); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(110,60,55,0.7)'; g.lineWidth = 0.004;
  g.beginPath(); g.moveTo(hx + 0.07, hy + 0.09); g.lineTo(hx + 0.103, hy + 0.088); g.stroke();
  // his hand on her shoulder, the dark sleeve from the left
  hand(g, cx - 0.12, 0.7, 0.24, -0.18, { side: 1, sleeve: '#2c2c33', light: 0.3 });
  // the old glass: a little dim and green
  g.fillStyle = 'rgba(70,90,80,0.12)'; g.fillRect(gx, gy, A, 1);
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
  // the lamp in the mirror, trembling a little; its warmth on his face trembles with it
  e.layer('lamp', { flicker: 0.25, blend: 'add', box: [hx - 0.1, 0.0, A + 0.3, 0.75] }, gl => {
    gl.fillStyle = radial(gl, cx + 0.62, 0.22, 0.3, [[0, 'rgba(255,200,130,0.35)'], [1, 'rgba(0,0,0,0)']]);
    gl.fillRect(cx + 0.2, 0.0, 0.8, 0.6);
    gl.fillStyle = radial(gl, hx + 0.12, hy, 0.14, [[0, 'rgba(255,190,120,0.12)'], [1, 'rgba(0,0,0,0)']]);
    gl.fillRect(hx - 0.05, hy - 0.16, 0.32, 0.32);
  });
}

// The town of S.: the grey soldier's cloth of the hotel table and the dusty inkwell on it — a horseman, his hand
// raised with a hat in it, his head broken off. A grey light from the window on the left. Nothing moves but a few
// motes in the light.
function inkwell(g, e) {
  const A = e.aspect, cx = A / 2;
  // the cloth: grey, coarse, the weave in fine lines; the window's light from the upper left
  g.fillStyle = linear(g, 0, 0, 0, 1, [[0, '#6f716d'], [1, '#5d5f5c']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  g.strokeStyle = 'rgba(40,42,40,0.16)'; g.lineWidth = 0.0025;
  for (let i = 0; i < 90; i++) { const y = -0.05 + i * 0.0125; g.beginPath(); g.moveTo(-0.3, y); g.lineTo(A + 0.3, y + 0.004 * Math.sin(i * 1.7)); g.stroke(); }
  g.strokeStyle = 'rgba(150,152,148,0.1)';
  for (let i = 0; i < 160; i++) { const x = -0.3 + i * 0.0145; g.beginPath(); g.moveTo(x, -0.05); g.lineTo(x + 0.003 * Math.sin(i), 1.05); g.stroke(); }
  g.fillStyle = radial(g, cx - 0.95, -0.15, 1.6, [[0, 'rgba(225,230,235,0.42)'], [0.55, 'rgba(200,205,210,0.12)'], [1, 'rgba(20,22,25,0.3)']]);
  g.fillRect(-0.3, -0.05, A + 0.6, 1.1);
  // a few crumbs and a stain on the cloth
  g.fillStyle = 'rgba(30,30,35,0.25)';
  g.beginPath(); g.ellipse(cx + 0.55, 0.86, 0.06, 0.02, 0.3, 0, Math.PI * 2); g.fill();
  const bronze = '#4d4335', bronzeL = '#7d725f', dust = 'rgba(178,174,164,0.5)';
  // its shadow on the cloth, away from the window
  g.fillStyle = 'rgba(25,25,28,0.35)';
  g.beginPath(); g.moveTo(cx - 0.3, 0.83); g.lineTo(cx + 0.38, 0.83); g.lineTo(cx + 0.5, 0.88); g.lineTo(cx - 0.18, 0.88); g.closePath(); g.fill();
  // the plinth, with two ink pots on it, their lids
  g.fillStyle = bronze; g.fillRect(cx - 0.34, 0.72, 0.68, 0.11);
  g.fillStyle = bronzeL; g.fillRect(cx - 0.34, 0.72, 0.68, 0.018);
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(cx - 0.34, 0.81, 0.68, 0.02);
  for (const x of [cx - 0.25, cx + 0.25]) {
    g.fillStyle = bronze; g.fillRect(x - 0.055, 0.64, 0.11, 0.085);
    g.fillStyle = bronzeL; g.beginPath(); g.ellipse(x, 0.64, 0.062, 0.016, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = bronze; g.beginPath(); g.arc(x, 0.625, 0.016, Math.PI, 0); g.fill();
  }
  // the horse, standing, its head to the right and up; the tail to the left
  g.fillStyle = bronze;
  g.beginPath(); g.ellipse(cx - 0.01, 0.53, 0.15, 0.06, 0, 0, Math.PI * 2); g.fill();          // the barrel
  for (const [x, lean] of [[-0.12, -0.01], [-0.07, 0.01], [0.07, 0.0], [0.11, 0.02]]) {
    g.beginPath(); g.moveTo(cx + x - 0.012, 0.55); g.lineTo(cx + x + lean - 0.009, 0.72); g.lineTo(cx + x + lean + 0.009, 0.72); g.lineTo(cx + x + 0.012, 0.55); g.closePath(); g.fill();
  }
  g.beginPath(); g.moveTo(cx + 0.08, 0.5); g.quadraticCurveTo(cx + 0.14, 0.44, cx + 0.15, 0.38); g.lineTo(cx + 0.2, 0.37);   // the neck
  g.quadraticCurveTo(cx + 0.24, 0.39, cx + 0.235, 0.42); g.lineTo(cx + 0.19, 0.43); g.quadraticCurveTo(cx + 0.17, 0.5, cx + 0.13, 0.54); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(cx + 0.16, 0.38); g.lineTo(cx + 0.165, 0.355); g.lineTo(cx + 0.175, 0.375); g.closePath(); g.fill();  // an ear
  g.beginPath(); g.moveTo(cx - 0.15, 0.51); g.quadraticCurveTo(cx - 0.22, 0.55, cx - 0.2, 0.66); g.lineTo(cx - 0.18, 0.66); g.quadraticCurveTo(cx - 0.19, 0.57, cx - 0.14, 0.53); g.closePath(); g.fill();  // the tail
  // the rider: his body on the saddle, the right arm raised high with the hat in the hand — and no head: a broken stump
  g.beginPath(); g.moveTo(cx - 0.055, 0.5); g.lineTo(cx - 0.045, 0.37); g.lineTo(cx + 0.03, 0.37); g.lineTo(cx + 0.035, 0.5); g.closePath(); g.fill();   // the body
  g.beginPath(); g.moveTo(cx - 0.03, 0.5); g.lineTo(cx + 0.0, 0.585); g.lineTo(cx + 0.022, 0.58); g.lineTo(cx + 0.02, 0.5); g.closePath(); g.fill();      // the leg down the horse's side
  g.lineCap = 'round'; g.strokeStyle = bronze; g.lineWidth = 0.022;
  g.beginPath(); g.moveTo(cx + 0.02, 0.385); g.lineTo(cx + 0.07, 0.29); g.lineTo(cx + 0.085, 0.2); g.stroke();      // the raised arm
  g.lineWidth = 0.018;
  g.beginPath(); g.moveTo(cx - 0.04, 0.39); g.lineTo(cx - 0.07, 0.45); g.lineTo(cx - 0.03, 0.47); g.stroke();       // the other arm on the reins
  g.fillStyle = bronze;
  g.beginPath(); g.moveTo(cx + 0.045, 0.2); g.quadraticCurveTo(cx + 0.085, 0.15, cx + 0.135, 0.19); g.lineTo(cx + 0.12, 0.2); g.quadraticCurveTo(cx + 0.09, 0.185, cx + 0.06, 0.205); g.closePath(); g.fill();  // the hat
  g.beginPath(); g.ellipse(cx + 0.09, 0.185, 0.03, 0.018, -0.2, 0, Math.PI * 2); g.fill();
  // the neck's stump, jagged and brighter where it broke
  g.beginPath(); g.moveTo(cx - 0.03, 0.375); g.lineTo(cx - 0.025, 0.345); g.lineTo(cx - 0.012, 0.36); g.lineTo(cx - 0.002, 0.338); g.lineTo(cx + 0.01, 0.357); g.lineTo(cx + 0.018, 0.348); g.lineTo(cx + 0.02, 0.375); g.closePath(); g.fill();
  g.fillStyle = '#a89a7c';
  g.beginPath(); g.moveTo(cx - 0.025, 0.347); g.lineTo(cx - 0.012, 0.362); g.lineTo(cx - 0.002, 0.34); g.lineTo(cx + 0.01, 0.358); g.lineTo(cx + 0.018, 0.35); g.lineTo(cx + 0.012, 0.364); g.lineTo(cx - 0.02, 0.364); g.closePath(); g.fill();
  // the light from the window on its left edges; the dust lying on every top
  g.strokeStyle = 'rgba(200,205,205,0.45)'; g.lineWidth = 0.004;
  g.beginPath(); g.moveTo(cx - 0.055, 0.5); g.lineTo(cx - 0.045, 0.37); g.moveTo(cx - 0.16, 0.53); g.quadraticCurveTo(cx - 0.12, 0.47, cx, 0.468); g.moveTo(cx - 0.34, 0.83); g.lineTo(cx - 0.34, 0.72); g.stroke();
  g.fillStyle = dust;
  for (let i = 0; i < 260; i++) {
    const x = cx - 0.34 + anim.hash(i, 3) * 0.68, top = anim.hash(i, 4) < 0.6;
    const y = top ? 0.72 + anim.hash(i, 5) * 0.012 : 0.47 + anim.hash(i, 6) * 0.06;
    if (!top && Math.abs(x - cx) > 0.15) continue;
    g.fillRect(x, y, 0.002 + anim.hash(i, 7) * 0.003, 0.0015);
  }
  // a few motes in the window's light, drifting
  e.layer('motes', { drift: [0.006, -0.004], box: [-0.3, -0.05, A * 0.6, 0.7] }, gm => {
    gm.fillStyle = 'rgba(230,232,235,0.35)';
    for (let i = 0; i < 40; i++) {
      const x = -0.3 + anim.hash(i, 21) * (A * 0.6 + 0.3), y = -0.05 + anim.hash(i, 22) * 0.75;
      gm.beginPath(); gm.arc(x, y, 0.0015 + anim.hash(i, 23) * 0.002, 0, Math.PI * 2); gm.fill();
    }
  });
}

const FRAMES = { melon, hands, tea, mirror, inkwell };

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
    const fill = clamp01(s.fill), dx = GLASS_FROM * (1 - clamp01(s.glass_at));
    for (const n of GLASS_LAYERS) e.layer(n).x = dx;
    e.layer('tea').scaleY = Math.max(0.001, fill);
    e.layer('tea').alpha = fill > 0.002 ? 1 : 0;
    e.layer('stream').alpha = Number(s.tap) > 0.5 ? 1 : 0;
    e.layer('spill').alpha = clamp01(s.spill);
    e.layer('steam').alpha = 0.3 + 0.7 * fill;
    e.at(A / 2 + dx, GLASS.mid, 'glass');
  }
}

return { paint, live, hand };
