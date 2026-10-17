// closeups — the hands and things of Giancaldo close up (closeups.md): seven inserts — `splice` (Alfredo cuts the
// kisses out at the bench, the boy's hand at the edge), `slate` (the big hand with the chalk, the small one on it,
// «ALFREDO»), `thread` (the boy's fingers lead the film from tooth to tooth), `viewfinder` (the square at dusk through
// an 8 mm camera), `calendar` (the old 1958 calendar behind the booth's door, its months folded over the top), `strip`
// (the spliced kisses held against the booth's window), `wallet` (an old frame of film against a station lamp).
// One hand for all of them (a boy's, Alfredo's, a youth's, a grown man's: size, skin and sleeve).
//   In a scene: an element { "id": <name>, "insert": <name>, "code": "e.kit.closeups.<name>(g, e);",
// "animate": "e.kit.closeups.<name>Move(e);" } — the painting reads only the keys that change at most once a second
// (bent1…3, letters, crooked, threaded, loop, pages, jumps); everything that moves is a layer moved by its animate.
//   A shot's own units: the frame's height, the origin in the frame's middle, y down (x −0.89…0.89 on 16:9; painted
// to ±1.3 for 21:9). The middle 4:3 — |x| ≤ 0.667; its points within |x| ≤ 0.58, y −0.36…0.33 (the plate above, the
// speech below). Each insert carries its own painted light: the scene's light does not fall on it.
const { clamp, span, ease, noise } = anim;
const TAU = 2 * Math.PI;
const c01 = v => clamp(Number(v) || 0, 0, 1);
const rgbOf = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const blend = (a, b, u) => `#${rgbOf(a).map((v, i) => Math.round(v + (rgbOf(b)[i] - v) * u).toString(16).padStart(2, '0')).join('')}`;
const rgba = (c, a) => `rgba(${rgbOf(c).join(',')},${a})`;
const W = 1.3; // half the painted width (21:9 and its margin)

// ── shapes ──
function capsule(g, x0, y0, r0, x1, y1, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  g.beginPath(); g.arc(x0, y0, r0, a + Math.PI / 2, a - Math.PI / 2); g.arc(x1, y1, r1, a - Math.PI / 2, a + Math.PI / 2); g.closePath();
}
function blob(g, pts) {
  const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  g.beginPath(); g.moveTo(...mid(pts[n - 1], pts[0]));
  for (let i = 0; i < n; i++) g.quadraticCurveTo(...pts[i], ...mid(pts[i], pts[(i + 1) % n]));
  g.closePath();
}
function oval(g, x, y, rx, ry, turn, colour) { g.fillStyle = colour; g.beginPath(); g.ellipse(x, y, rx, ry, turn, 0, TAU); g.fill(); }
function line(g, x0, y0, x1, y1, w, colour) {
  g.strokeStyle = colour; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
}
function pool(g, x, y, r, colour, strength) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, rgba(colour, strength)); gr.addColorStop(1, rgba(colour, 0));
  g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
const turned = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
const font = (size, style = 'bold') => `${style} ${Math.round(size * 1000)}px Georgia, "Times New Roman", serif`;
function words(g, text, x, y, size, colour, { style = 'bold', align = 'center' } = {}) {
  g.save(); g.translate(x, y); g.scale(0.001, 0.001);
  g.font = font(size, style); g.textAlign = align; g.textBaseline = 'middle'; g.fillStyle = colour; g.fillText(text, 0, 0);
  g.restore();
}

// ── the hand ── one for every shot (the shape of Scarlet Sails'): its own units its length, the wrist at (0, 0), the
// fingers toward +x, the thumb on −y. at, angle, L, side (−1 mirrored), view 'back' | 'palm', curl [4] 0…1, spread,
// thumb {angle, curl}, skin, arm (forearm, in hands), sleeve {colour, from, cuff}, fine, flat (a silhouette colour),
// parts (which of arm, palm, thumb, f0…f3)
const FINGERS = [
  { at: [0.5, -0.165], len: 0.44, w: 0.105, fan: -0.17 },
  { at: [0.53, -0.055], len: 0.5, w: 0.11, fan: -0.04 },
  { at: [0.51, 0.055], len: 0.46, w: 0.105, fan: 0.08 },
  { at: [0.46, 0.155], len: 0.36, w: 0.092, fan: 0.22 },
];
const PHALANX = [0.46, 0.3, 0.24], BEND = [0.9, 1.5, 1.1], TAPER = [0.94, 0.86, 0.76];
const PALM = [[0, -0.15], [0.2, -0.235], [0.46, -0.23], [0.56, -0.1], [0.56, 0.06], [0.5, 0.2], [0.3, 0.235], [0.06, 0.19], [-0.02, 0]];
const THUMB = { root: [0.13, -0.13], len: [0.3, 0.21], r: [0.085, 0.068, 0.056] };
const WHOLE = ['arm', 'palm', 'thumb', 'f0', 'f1', 'f2', 'f3'];
function joints(F, curl, spread) {
  const a = F.fan * spread, pts = [[F.at[0], F.at[1], F.w / 2, false]];
  let x = F.at[0], y = F.at[1], bend = 0;
  for (let k = 0; k < 3; k++) {
    bend += BEND[k] * curl;
    const l = F.len * PHALANX[k] * Math.cos(bend);
    x += l * Math.cos(a); y += l * Math.sin(a);
    pts.push([x, y, (F.w / 2) * TAPER[k], bend > Math.PI / 2]);
  }
  return pts;
}
const handPoint = (o, [x, y]) => { const [dx, dy] = turned([x * o.L, y * o.L * o.side], o.angle); return [o.at[0] + dx, o.at[1] + dy]; };
const tipOf = (o, i) => { const J = joints(FINGERS[i], o.curl[i], o.spread); return handPoint(o, [J[3][0], J[3][1]]); };
function tones(o, light) {
  if (o.flat) return { edge: o.flat, skin: o.flat, fine: false, bare: true };
  const [lx, ly] = turned(light.dir, -o.angle);
  return { edge: blend(o.skin, '#55281a', o.fine ? 0.5 : 0.3), skin: o.skin, light: blend(blend(o.skin, '#ffffff', 0.22), light.colour, 0.3),
    shade: blend(o.skin, '#5a3020', 0.5), lit: [lx, ly * o.side], fine: !!o.fine, bare: false };
}
function limb(g, T, x0, y0, r0, x1, y1, r1) {
  const rim = T.fine ? 0.008 : 0.011;
  capsule(g, x0, y0, r0 + rim, x1, y1, r1 + rim); g.fillStyle = T.edge; g.fill();
  capsule(g, x0, y0, r0, x1, y1, r1);
  if (T.fine) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), d = nx * T.lit[0] + ny * T.lit[1];
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, r = Math.max(r0, r1) * (d < 0 ? -1 : 1), w = Math.abs(d);
    const gr = g.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
    gr.addColorStop(0, blend(T.skin, T.light, 0.3 + 0.7 * w)); gr.addColorStop(0.42, T.skin); gr.addColorStop(1, blend(T.skin, T.shade, 0.3 + 0.7 * w));
    g.fillStyle = gr;
  } else g.fillStyle = T.skin;
  g.fill();
}
function finger(g, T, o, i) {
  const F = FINGERS[i], J = joints(F, o.curl[i], o.spread), back = o.view === 'back', a = F.fan * o.spread, nx = -Math.sin(a), ny = Math.cos(a);
  const joint = k => limb(g, T, J[k][0], J[k][1], J[k][2], J[k + 1][0], J[k + 1][1], J[k + 1][2]);
  if (back) { for (let k = 2; k >= 0; k--) if (!J[k + 1][3]) joint(k); } else for (let k = 0; k < 3; k++) joint(k);
  if (T.bare || !T.fine) return;
  for (let k = back ? 1 : 0; k < 3; k++) {
    if (back && J[k + 1][3]) continue;
    const h = J[k][2] * 0.72;
    line(g, J[k][0] - nx * h, J[k][1] - ny * h, J[k][0] + nx * h, J[k][1] + ny * h, 0.008, rgba(T.edge, 0.3));
  }
  if (back) {
    oval(g, J[0][0] + T.lit[0] * 0.012, J[0][1] + T.lit[1] * 0.012, F.w * 0.4, F.w * 0.34, a, rgba(T.light, 0.4));
    const flat = (J[3][0] - J[2][0]) * Math.cos(a) + (J[3][1] - J[2][1]) * Math.sin(a);
    if (!J[3][3] && flat > F.len * PHALANX[2] * 0.5) {
      const x = J[2][0] + (J[3][0] - J[2][0]) * 0.55, y = J[2][1] + (J[3][1] - J[2][1]) * 0.55;
      oval(g, x, y, F.w * 0.36, F.w * 0.3, a, rgba(blend(T.skin, '#fff3e8', 0.55), 0.85));
    }
  }
}
function thumb(g, T, o) {
  const { root, len, r } = THUMB, a = o.thumb.angle, b = a + o.thumb.curl * 1.1;
  const jx = root[0] + len[0] * Math.cos(a), jy = root[1] + len[0] * Math.sin(a), tx = jx + len[1] * Math.cos(b), ty = jy + len[1] * Math.sin(b);
  limb(g, T, root[0], root[1], r[0], jx, jy, r[1]); limb(g, T, jx, jy, r[1], tx, ty, r[2]);
  if (T.fine && o.view === 'back') oval(g, jx + (tx - jx) * 0.6, jy + (ty - jy) * 0.6, 0.05, 0.04, b, rgba(blend(T.skin, '#fff3e8', 0.55), 0.85));
}
function palm(g, T, o) {
  blob(g, PALM); g.strokeStyle = T.edge; g.lineWidth = T.fine ? 0.016 : 0.022; g.lineJoin = 'round'; g.stroke();
  if (T.fine) {
    const gr = g.createLinearGradient(0.28 + T.lit[0] * 0.3, T.lit[1] * 0.3, 0.28 - T.lit[0] * 0.3, -T.lit[1] * 0.3);
    gr.addColorStop(0, blend(T.skin, T.light, 0.8)); gr.addColorStop(0.45, T.skin); gr.addColorStop(1, blend(T.skin, T.shade, 0.75));
    g.fillStyle = gr;
  } else g.fillStyle = T.skin;
  g.fill();
  if (!T.fine) return;
  if (o.view === 'palm') {
    oval(g, 0.31, 0.02, 0.14, 0.1, 0, rgba(T.shade, 0.22)); oval(g, 0.17, -0.1, 0.12, 0.075, -0.5, rgba(T.light, 0.32));
  } else for (const F of FINGERS) line(g, 0.2, F.at[1] * 0.45, F.at[0] - 0.08, F.at[1], 0.012, rgba(T.shade, 0.16));
}
function arm(g, T, o) {
  limb(g, T, -o.arm, 0, 0.2, 0.06, 0, 0.15);
  if (!o.sleeve || T.bare) return;
  const s = o.sleeve, up = T.fine && T.lit[1] > 0 ? 1 : -1;
  g.beginPath(); g.moveTo(-o.arm, -0.33); g.lineTo(-s.from, -0.25); g.lineTo(-s.from, 0.25); g.lineTo(-o.arm, 0.33); g.closePath();
  if (T.fine) {
    const gr = g.createLinearGradient(0, 0.3 * up, 0, -0.3 * up);
    gr.addColorStop(0, blend(s.colour, '#ffe6c4', 0.25)); gr.addColorStop(0.35, s.colour); gr.addColorStop(1, blend(s.colour, '#20141a', 0.4));
    g.fillStyle = gr;
  } else g.fillStyle = s.colour;
  g.fill();
  if (s.cuff) { g.fillStyle = blend(s.cuff, '#6a5a50', 0.35); g.fillRect(-s.from - 0.085, -0.265, 0.1, 0.53); g.fillStyle = s.cuff; g.fillRect(-s.from - 0.075, -0.255, 0.08, 0.51); }
}
function hand(g, o, light) {
  const T = tones(o, light), has = p => o.parts.includes(p), back = o.view === 'back';
  g.save(); g.translate(o.at[0], o.at[1]); g.rotate(o.angle); g.scale(o.L, o.L * o.side);
  if (has('arm')) arm(g, T, o);
  if (back && has('thumb')) thumb(g, T, o);
  if (has('palm')) palm(g, T, o);
  for (let i = 0; i < 4; i++) if (has(`f${i}`)) finger(g, T, o, i);
  if (!back && has('thumb')) thumb(g, T, o);
  g.restore();
}
const HAND = { side: 1, view: 'back', curl: [0, 0, 0, 0], spread: 0.4, thumb: { angle: -0.75, curl: 0 }, arm: 3, parts: WHOLE };
// whose hand: the boy's (8–10), Alfredo's (big, the collarless shirt's sleeve rolled), the youth's (17), the grown
// man's (Salvatore: a dark coat, a pale shirt's cuff)
const WHO = {
  boy: { skin: '#cfa27e', L: 0.2, sleeve: { colour: '#e6dfcd', from: 0.45 } },
  alfredo: { skin: '#c08f6c', L: 0.36, sleeve: { colour: '#d6ccb2', from: 0.85 } },
  youth: { skin: '#c99d7a', L: 0.3, sleeve: { colour: '#ece6d6', from: 0.7 } },
  grown: { skin: '#c49a7a', L: 0.34, sleeve: { colour: '#2d2c33', from: 0.24, cuff: '#e5dfd2' } },
};
const handOf = (who, more) => ({ ...HAND, ...WHO[who], ...more });
// the hand placed so that finger i's tip is at `target` (0 the index, 1 the middle…)
const aim = (o, i, target) => { const t = tipOf({ ...o, at: [0, 0] }, i); return { ...o, at: [target[0] - t[0], target[1] - t[1]] }; };

// ── the frame of a shot: units → the stage ──
function frameOf(e) { const ax = e.aspect / 2, ay = 0.5; return { ax, ay, to: (x, y) => [ax + x, ay + y] }; }
function painter(g, e) {
  const { ax, ay, to } = frameOf(e);
  return {
    e, cinema: e.kit.cinema, rnd: e.rnd,
    // a layer in the shot's units: its pivot, its box (none: the frame's), the engine's own motion of it
    layer(name, pivot, box, fn, opts) {
      e.layer(name, { ...opts, pivot: to(...pivot), ...(box && { box: [...to(box[0], box[1]), ...to(box[2], box[3])] }) }, g2 => { g2.translate(ax, ay); fn(g2); });
    },
    at: (x, y, name) => e.at(x, y, name),
    light: (x, y, r, colour, strength, name) => e.light(x, y, r, colour, strength, name),
    begin() { g.save(); g.translate(ax, ay); },
    end() { g.restore(); },
  };
}
function mover(e) {
  const { to } = frameOf(e);
  return {
    e, t: e.t, s: e.state,
    set(name, { x = 0, y = 0, rotate = 0, scale = 1, sx = scale, sy = scale, alpha = 1 }) {
      const h = e.layer(name); h.x = x; h.y = y; h.rotate = rotate; h.scaleX = sx; h.scaleY = sy; h.alpha = alpha;
    },
    at: (x, y, name) => e.at(...to(x, y), name),
  };
}
const ready = (e, first) => !!e.layer(first)?.scaleX;

// a wooden bench top under a lamp: the grain, the boards, the lamp's pool
function bench(g, C, lamp, tone = '#6b5038') {
  const wood = g.createLinearGradient(-W, 0, W, 0);
  wood.addColorStop(0, blend(tone, '#1c140e', 0.55)); wood.addColorStop(0.55, tone); wood.addColorStop(1, blend(tone, '#2a1c12', 0.35));
  g.fillStyle = wood; g.fillRect(-W, -0.6, 2 * W, 1.2);
  for (let i = 0; i < 60; i++) {
    const x = -W + 2 * W * C.rnd(), y = -0.58 + 1.16 * C.rnd();
    line(g, x, y, x + 0.12 + 0.35 * C.rnd(), y + 0.004 * (C.rnd() - 0.5), 0.003, 'rgba(36,24,14,0.18)');
  }
  for (const y of [-0.33, 0.07, 0.42]) { g.fillStyle = 'rgba(30,20,12,0.4)'; g.fillRect(-W, y, 2 * W, 0.006); g.fillStyle = 'rgba(255,226,180,0.1)'; g.fillRect(-W, y + 0.006, 2 * W, 0.003); }
  pool(g, lamp[0], lamp[1], 1.25, '#ffd79a', 0.55);
  const dark = g.createRadialGradient(lamp[0], lamp[1], 0.4, lamp[0], lamp[1], 1.9);
  dark.addColorStop(0, 'rgba(10,6,4,0)'); dark.addColorStop(1, 'rgba(10,6,4,0.6)');
  g.fillStyle = dark; g.fillRect(-W, -0.6, 2 * W, 1.2);
}

// ── splice ── the bench under the lamp; a strip of film across it with three paper slips sticking up where the bell
// rang (kiss_cut1…3); Alfredo's left hand holds the film, his right the scissors; the press for the splice; the boy's
// small hand at the right edge, reaching for the cut pieces
const SPLICE = (() => {
  const h = 0.27, y = -0.03, k = h * 0.72, fw = k * 1.33, gap = h * 0.06, step = fw + gap, x0 = -2 * step;
  const names = ['romance', 'romance', 'kiss_cut1', 'romance', 'kiss_cut2', 'romance', 'kiss_cut3', 'romance', 'romance'];
  const cuts = [0, 2, 4].map(i => x0 + i * step); // the cut line: at the kiss frame's left edge
  const top = y - h / 2, bot = y + h / 2;
  return {
    h, y, step, x0, names, cuts, top, bot, fw,
    light: { dir: [0.7, -0.7], colour: '#ffd9a0' },
    lamp: [0.75, -0.62],
    pile: [[0.86, 0.38], [0.98, 0.33], [0.92, 0.46]],
    left: aim(handOf('alfredo', { angle: -0.42, curl: [0.18, 0.14, 0.2, 0.3], spread: 0.2, thumb: { angle: -0.5, curl: 0.2 }, fine: true }), 1, [-0.92, y + h / 2 - 0.03]),
    right: handOf('alfredo', { angle: Math.PI / 2 + 0.18, curl: [0.62, 0.66, 0.7, 0.72], spread: 0.12, thumb: { angle: -0.5, curl: 0.5 }, fine: true }),
    boy: aim(handOf('boy', { angle: Math.PI + 0.55, side: -1, curl: [0.14, 0.12, 0.16, 0.22], spread: 0.4, thumb: { angle: -0.6, curl: 0.15 }, fine: true }), 1, [1.0, 0.36]),
  };
})();
function scissors(g, open) {
  // drawn about the pivot at (0, 0): the blades down (+y), the bows up; open — radians apart
  g.save(); g.scale(1.35, 1.35);
  for (const s of [-1, 1]) {
    g.save(); g.rotate(s * open / 2);
    g.fillStyle = '#9a9ca0'; g.beginPath(); g.moveTo(-0.008, 0); g.lineTo(0.012 * s, 0.17); g.lineTo(0.004 * s, 0.17); g.lineTo(0.008, -0.02); g.closePath(); g.fill();
    g.strokeStyle = '#d6d8da'; g.lineWidth = 0.003; g.beginPath(); g.moveTo(0, 0.01); g.lineTo(0.008 * s, 0.165); g.stroke();
    g.strokeStyle = '#2a2a2c'; g.lineWidth = 0.012; g.beginPath(); g.ellipse(-0.03 * s, -0.08, 0.024, 0.036, s * 0.3, 0, TAU); g.stroke();
    g.fillStyle = '#3a3a3e'; g.fillRect(-0.006, -0.05, 0.012, 0.05);
    g.restore();
  }
  oval(g, 0, 0, 0.009, 0.009, 0, '#c8c8cc');
  g.restore();
}
function splice(g, e) {
  const C = painter(g, e), P = SPLICE, S = e.state, k = C.cinema;
  C.begin();
  bench(g, C, P.lamp);
  // the strip's shadow, the strip with its ordinary frames (under the kisses: what is left once they are out)
  g.fillStyle = 'rgba(12,8,4,0.45)'; g.fillRect(-W, P.y - P.h / 2 + 0.02, 2 * W, P.h);
  k.strip(g, P.x0 - 4 * P.step, P.y, P.h, ['romance', 'romance', 'romance', 'romance', 'romance', 'romance', ...P.names.map(n => (n.startsWith('kiss') ? 'romance' : n)), 'romance', 'romance']);
  // a gloss along the film where the lamp catches it
  const gl = g.createLinearGradient(-W, 0, W, 0);
  gl.addColorStop(0, 'rgba(255,230,190,0)'); gl.addColorStop(0.7, 'rgba(255,230,190,0.12)'); gl.addColorStop(1, 'rgba(255,230,190,0)');
  g.fillStyle = gl; g.fillRect(-W, P.top + 0.01, 2 * W, 0.015);
  // the splicing press: a heavy block by the strip, its lid over each joint is a layer
  P.cuts.forEach((xc, n) => {
    const N = n + 1, bent = !!S[`bent${N}`];
    // the joint once cut: a straight or a slanted line, and the clear tape once pressed
    C.layer(`joint${N}`, [xc, P.y], [xc - 0.08, P.top - 0.02, xc + 0.08, P.bot + 0.02], j => {
      j.strokeStyle = 'rgba(245,238,220,0.85)'; j.lineWidth = 0.004;
      j.beginPath(); j.moveTo(xc + (bent ? -0.025 : 0), P.top); j.lineTo(xc + (bent ? 0.03 : 0), P.bot); j.stroke();
    });
    C.layer(`tape${N}`, [xc, P.y], [xc - 0.08, P.top - 0.02, xc + 0.08, P.bot + 0.02], t => {
      t.fillStyle = 'rgba(230,236,240,0.32)'; t.fillRect(xc - 0.045, P.top + 0.005, 0.09, P.h - 0.01);
      t.strokeStyle = 'rgba(255,255,255,0.5)'; t.lineWidth = 0.002; t.strokeRect(xc - 0.045, P.top + 0.005, 0.09, P.h - 0.01);
    });
  });
  // the three kisses with their paper slips: each a layer, lifted off to the pile as it is cut
  P.cuts.forEach((xc, n) => {
    const N = n + 1, x = xc, w = P.step;
    C.layer(`piece${N}`, [x + w / 2, P.y], [x - 0.1, P.top - 0.2, x + w + 0.1, P.bot + 0.05], p => {
      p.fillStyle = '#2a211b'; p.fillRect(x, P.top, w, P.h);
      p.fillStyle = '#d9cfb8';
      for (let px = x + P.h * 0.04; px < x + w - 0.01; px += P.h * 0.14) { p.fillRect(px, P.top + P.h * 0.04, P.h * 0.07, P.h * 0.06); p.fillRect(px, P.bot - P.h * 0.1, P.h * 0.07, P.h * 0.06); }
      k.frame(p, P.names[2 + 2 * n], x + P.h * 0.03, P.y - P.h * 0.36, P.fw, P.h * 0.72);
      // the paper slip: tucked under the film, sticking up past its top edge, a little crooked
      p.save(); p.translate(x + w * 0.5, P.top); p.rotate(-0.1 + 0.08 * n);
      p.fillStyle = 'rgba(0,0,0,0.3)'; p.fillRect(-0.018, -0.15, 0.04, 0.17);
      p.fillStyle = '#efe9da'; p.fillRect(-0.022, -0.16, 0.042, 0.17);
      p.strokeStyle = 'rgba(120,100,80,0.5)'; p.lineWidth = 0.002; p.beginPath(); p.moveTo(-0.012, -0.13); p.lineTo(0.01, -0.13); p.moveTo(-0.012, -0.11); p.lineTo(0.006, -0.11); p.stroke();
      p.restore();
    });
  });
  // the press's lid, its hand on it (one layer per joint: it comes down as it is pressed)
  P.cuts.forEach((xc, n) => {
    C.layer(`press${n + 1}`, [xc, P.y], [xc - 0.15, P.top - 0.1, xc + 1.6, P.bot + 0.7], q => {
      // the splicer's lid seen from above: a steel plate the width of the film, its hinge pins, a knob — its shadow
      q.fillStyle = 'rgba(8,5,3,0.45)'; q.fillRect(xc - 0.085, P.top - 0.005, 0.19, P.h + 0.04);
      const gr = q.createLinearGradient(xc - 0.09, 0, xc + 0.09, 0); gr.addColorStop(0, '#3e3f44'); gr.addColorStop(0.45, '#9a9ba2'); gr.addColorStop(0.55, '#b4b5bc'); gr.addColorStop(1, '#3a3b40');
      q.fillStyle = gr; q.fillRect(xc - 0.09, P.top - 0.02, 0.18, P.h + 0.04);
      q.fillStyle = 'rgba(255,240,210,0.25)'; q.fillRect(xc - 0.09, P.top - 0.02, 0.18, 0.006);
      for (const yy of [P.top + 0.02, P.bot - 0.02]) for (const xx of [xc - 0.06, xc + 0.06]) oval(q, xx, yy, 0.008, 0.008, 0, '#2a2a2e');
      oval(q, xc, P.y, 0.035, 0.035, 0, '#2e2a26'); oval(q, xc - 0.008, P.y - 0.008, 0.02, 0.02, 0, '#5a4a3a');
      hand(q, aim({ ...P.right, view: 'back', side: -1, angle: Math.PI - 0.35, curl: [0.25, 0.3, 0.35, 0.4], spread: 0.2, thumb: { angle: -0.6, curl: 0.3 } }, 1, [xc + 0.015, P.y + 0.01]), P.light);
    });
  });
  // the scissors in his right hand: painted at the first cut's top; moved to the cut going on
  const [sx, sy] = [P.cuts[0], P.top - 0.02];
  C.layer('scissors', [sx, sy], [sx - 0.5, sy - 0.75, sx + 0.25, sy + 0.25], s => {
    s.save(); s.translate(sx, sy); scissors(s, 0.5); s.restore();
    hand(s, aim(P.right, 1, [sx + 0.012, sy - 0.1]), P.light);
  });
  C.layer('scissors_shut', [sx, sy], [sx - 0.5, sy - 0.75, sx + 0.25, sy + 0.25], s => {
    s.save(); s.translate(sx, sy); scissors(s, 0.04); s.restore();
    hand(s, aim({ ...P.right, curl: [0.72, 0.74, 0.76, 0.78] }, 1, [sx + 0.012, sy - 0.1]), P.light);
  });
  // his left hand holds the film down at the left; the boy's small hand comes in at the right
  C.layer('left', P.left.at, [-W, -0.2, -0.1, 0.6], l => hand(l, P.left, P.light));
  C.layer('boy', P.boy.at, [0.4, 0.1, W + 0.4, 0.8], b => hand(b, P.boy, P.light));
  // the lamp itself, top right: its warm light on all of it
  C.layer('lamp', P.lamp, null, l => { pool(l, P.lamp[0], P.lamp[1], 0.35, '#fff0c8', 0.5); }, { flicker: 0.04, blend: 'add' });
  P.cuts.forEach((xc, n) => {
    C.at(xc, P.top - 0.012, `cut${n + 1}`);
    C.at(xc, P.bot + 0.012, `cut${n + 1}_end`);
    C.at(xc, P.y, `glue${n + 1}`);
  });
  C.at(0, P.y);
  C.end();
}
function spliceMove(e) {
  if (!ready(e, 'piece1')) return;
  const L = mover(e), P = SPLICE, S = e.state, t = e.t, m = e.mem;
  const cut = [1, 2, 3].map(N => c01(S[`cut${N}`])), glue = [1, 2, 3].map(N => c01(S[`glue${N}`]));
  m.pressed ??= [null, null, null];
  P.cuts.forEach((xc, n) => {
    const N = n + 1, u = ease.inOut(cut[n]), to = P.pile[n], from = [xc + P.step / 2, P.y];
    // the piece: lifted off the strip, carried toward the boy, turned, a little smaller
    L.set(`piece${N}`, { x: (to[0] - from[0]) * u, y: (to[1] - from[1]) * u - 0.08 * Math.sin(Math.PI * u), rotate: (0.5 - 0.25 * n) * u, scale: 1 - 0.25 * u });
    L.set(`joint${N}`, { alpha: cut[n] >= 1 ? 1 : 0 });
    L.set(`tape${N}`, { alpha: glue[n] });
    // the press: over the joint once it is cut; down as it is pressed; lifted off 0.6 s after
    if (glue[n] >= 1 && m.pressed[n] == null) m.pressed[n] = t;
    if (glue[n] < 1) m.pressed[n] = null;
    const off = m.pressed[n] == null ? 0 : c01((t - m.pressed[n] - 0.4) / 0.6);
    L.set(`press${N}`, { y: -0.12 * (1 - glue[n]) - 0.3 * off, alpha: cut[n] >= 1 ? 1 - off : 0 });
  });
  // the scissors: at the cut going on, opened (snapping shut as it is cut); laid aside while a joint is pressed and
  // when all three are done
  const n = [0, 1, 2].find(i => cut[i] < 1 || glue[i] < 1), cutting = n != null && cut[n] < 1;
  const at = cutting ? [P.cuts[n], P.top - 0.02] : [-0.95, 0.42], base = [P.cuts[0], P.top - 0.02];
  m.sx ??= at[0]; m.sy ??= at[1];
  m.sx += (at[0] - m.sx) * Math.min(1, e.dt * 5); m.sy += (at[1] - m.sy) * Math.min(1, e.dt * 5);
  const shut = !cutting || cut[n] > 0.05, breathe = 0.004 * noise(t * 0.7, 2);
  L.set('scissors', { x: m.sx - base[0], y: m.sy - base[1] + breathe, alpha: shut ? 0 : 1 });
  L.set('scissors_shut', { x: m.sx - base[0], y: m.sy - base[1] + breathe, rotate: cutting ? 0 : -0.6, alpha: shut ? 1 : 0 });
  L.set('left', { x: 0.004 * noise(t * 0.4, 5), y: 0.003 * noise(t * 0.5, 6) });
  const r = c01(S.boy_reach);
  L.set('boy', { x: -0.3 * ease.inOut(r) + 0.004 * noise(t * 0.8, 7), y: -0.06 * r + 0.003 * noise(t * 0.9, 8) });
  L.set('lamp', { alpha: 0.9 + 0.1 * noise(t * 1.3, 9) });
}

// ── slate ── the slate on the bench under the lamp, «ALFREDO» dotted on it (in the world's Italian letters, like its signs); the big hand with the chalk, the small
// hand over it, going along the letters as chalk_x goes
const SLATE = {
  letters: ['A', 'L', 'F', 'R', 'E', 'D', 'O'], x0: -0.5, x1: 0.5, y: 0.0, size: 0.17,
  start: [-0.56, 0.0], end: [0.56, 0.0],
  light: { dir: [0.4, -0.9], colour: '#ffd9a0' },
};
SLATE.big = handOf('alfredo', { angle: -2.25, curl: [0.42, 0.62, 0.72, 0.78], spread: 0.12, thumb: { angle: -0.25, curl: 0.55 }, fine: true });
SLATE.small = handOf('boy', { angle: -2.3, curl: [0.2, 0.25, 0.3, 0.35], spread: 0.3, thumb: { angle: -0.6, curl: 0.25 }, fine: true });
const letterX = i => SLATE.x0 + (SLATE.x1 - SLATE.x0) * (i + 0.5) / SLATE.letters.length;
function slate(g, e) {
  const C = painter(g, e), P = SLATE, S = e.state, crooked = String(S.crooked ?? '');
  C.begin();
  bench(g, C, [0.1, -0.75], '#5e4632');
  // the slate in its wooden frame
  g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(-0.7, -0.27, 1.44, 0.6);
  g.fillStyle = '#7a5636'; g.fillRect(-0.72, -0.3, 1.44, 0.6);
  const sl = g.createLinearGradient(0, -0.26, 0, 0.26); sl.addColorStop(0, '#3a4040'); sl.addColorStop(1, '#262a2a');
  g.fillStyle = sl; g.fillRect(-0.67, -0.25, 1.34, 0.5);
  for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(200,200,190,0.05)'; oval(g, -0.6 + 1.2 * C.rnd(), -0.2 + 0.4 * C.rnd(), 0.06 + 0.1 * C.rnd(), 0.01 + 0.02 * C.rnd(), C.rnd(), 'rgba(200,200,190,0.05)'); }
  // the dotted letters to go over (the boy's)
  g.save(); g.setLineDash([0.01, 0.012]);
  P.letters.forEach((ch, i) => {
    g.save(); g.translate(letterX(i), P.y); g.scale(0.001, 0.001);
    g.font = font(P.size, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.strokeStyle = 'rgba(220,220,210,0.55)'; g.lineWidth = 3; g.setLineDash([9, 11]); g.strokeText(ch, 0, 0);
    g.restore();
  });
  g.restore();
  // the chalk letters, each its own layer (shown as the chalk passes); a crooked one written askew
  P.letters.forEach((ch, i) => {
    const bad = crooked[i] === '1';
    C.layer(`l${i}`, [letterX(i), P.y], [letterX(i) - 0.08, P.y - 0.14, letterX(i) + 0.08, P.y + 0.14], l => {
      l.save(); l.translate(letterX(i) + (bad ? 0.012 : 0), P.y + (bad ? -0.012 : 0)); l.rotate(bad ? 0.28 : 0); l.scale(0.001 * (bad ? 1.08 : 1), 0.001 * (bad ? 0.86 : 1));
      l.font = font(P.size, 'bold'); l.textAlign = 'center'; l.textBaseline = 'middle';
      l.strokeStyle = 'rgba(238,236,226,0.95)'; l.lineWidth = 11; l.lineJoin = 'round'; l.strokeText(ch, 0, 0);
      l.restore();
    });
  });
  // the two hands with the chalk: painted with the chalk at the first letter; carried along
  const [hx, hy] = P.start;
  C.layer('hands', [hx, hy], [hx - 0.25, hy - 0.1, hx + 0.9, hy + 0.9], h => {
    // the chalk: a short white stick from the slate up into the big hand's pinch, its point on the letter
    const grip = [hx + 0.05, hy + 0.055];
    const big = aim(P.big, 0, grip);
    hand(h, big, P.light);
    line(h, hx, hy, grip[0] + 0.012, grip[1] + 0.014, 0.022, '#f2f0e8');
    line(h, hx + 0.004, hy - 0.002, grip[0] + 0.008, grip[1] + 0.004, 0.006, 'rgba(255,255,255,0.8)');
    oval(h, hx, hy, 0.012, 0.009, 0.7, '#ffffff');
    // the boy's hand lies on the back of Alfredo's, its fingertips on his knuckles — the chalk free
    hand(h, aim(P.small, 1, handPoint(big, [0.5, 0.02])), P.light);
  });
  C.layer('lamp', [0.1, -0.75], null, l => pool(l, 0.1, -0.75, 0.6, '#fff0c8', 0.35), { blend: 'add', flicker: 0.04 });
  C.at(...P.start, 'start'); C.at(...P.end, 'end');
  P.letters.forEach((ch, i) => C.at(letterX(i), P.y, `l${i}`));
  C.at(0, P.y);
  C.end();
}
function slateMove(e) {
  if (!ready(e, 'hands')) return;
  const L = mover(e), P = SLATE, S = e.state, t = e.t, n = P.letters.length, u = Math.max(c01(S.chalk_x), c01((Number(S.letters) || 0) / n));
  for (let i = 0; i < n; i++) L.set(`l${i}`, { alpha: c01(u * n - i) });
  const w = c01(S.wobble), x = (P.end[0] - P.start[0]) * u;
  L.set('hands', { x, y: 0.004 * noise(t * 0.6, 1) + w * 0.02 * Math.sin(t * 47), rotate: w * 0.06 * Math.sin(t * 31) });
}

// ── thread ── the open film path of the projector: the feed reel above left, the top sprocket, the loop, the gate
// (its window bright with the lamp behind), the bottom sprocket, the take-up reel; the film led from point to point
const THREAD = {
  p: [[-0.5, -0.3], [-0.24, -0.2], [-0.1, 0.02], [0.1, 0.16], [0.32, 0.26], [0.52, 0.06]],
  gate: [0.0, 0.09], feed: [-0.85, -0.55], take: [0.78, 0.2],
  light: { dir: [-0.3, -0.95], colour: '#ffe4b0' },
};
THREAD.fingers = handOf('boy', { angle: -2.5, curl: [0.4, 0.55, 0.65, 0.7], spread: 0.15, thumb: { angle: -0.25, curl: 0.55 }, fine: true });
function film(g, a, b, w = 0.03) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  g.save(); g.translate(a[0], a[1]); g.rotate(ang);
  g.fillStyle = '#2e241c'; g.fillRect(0, -w / 2, len, w);
  g.fillStyle = 'rgba(214,200,170,0.6)';
  for (let x = 0.006; x < len - 0.006; x += 0.018) { g.fillRect(x, -w / 2 + 0.003, 0.008, 0.005); g.fillRect(x, w / 2 - 0.008, 0.008, 0.005); }
  g.fillStyle = 'rgba(255,230,190,0.15)'; g.fillRect(0, -w / 2, len, 0.004);
  g.restore();
}
function loopFilm(g, a, b) {
  // a loop bulging out to the left before the gate
  const steps = 14; let prev = a;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps, p = lerp(a, b, u), bulge = Math.sin(Math.PI * u) * 0.09;
    const q = [p[0] - bulge, p[1] + bulge * 0.2]; film(g, prev, q); prev = q;
  }
}
function drum(g, c, r, teeth) {
  oval(g, c[0], c[1], r + 0.01, r + 0.01, 0, '#1c1c1e'); oval(g, c[0], c[1], r, r, 0, '#6a6a70');
  for (let i = 0; i < teeth; i++) { const a = i * TAU / teeth; oval(g, c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, 0.007, 0.007, 0, '#2a2a2e'); }
  oval(g, c[0], c[1], r * 0.35, r * 0.35, 0, '#a8a8ae'); oval(g, c[0], c[1], r * 0.12, r * 0.12, 0, '#3a3a3e');
}
function thread(g, e) {
  const C = painter(g, e), P = THREAD, S = e.state, done = clamp(Math.round(Number(S.threaded) || 0), 0, 5), loop = !!S.loop;
  C.begin();
  // the projector's open side: black enamel, worn steel, the lamp's warm light at the gate
  const plate = g.createLinearGradient(-W, -0.6, W, 0.6); plate.addColorStop(0, '#16161a'); plate.addColorStop(0.5, '#26262b'); plate.addColorStop(1, '#141417');
  g.fillStyle = plate; g.fillRect(-W, -0.6, 2 * W, 1.2);
  for (const [x, y] of [[-1.1, -0.45], [1.1, -0.45], [-1.1, 0.45], [1.1, 0.45], [0.2, -0.45]]) { oval(g, x, y, 0.02, 0.02, 0, '#3a3a40'); oval(g, x, y, 0.008, 0.008, 0, '#121214'); }
  pool(g, P.gate[0] + 0.05, P.gate[1], 0.7, '#ffcf8a', 0.35);
  // the feed reel (top left, cut by the frame) and the take-up reel
  for (const [c, r] of [[P.feed, 0.42], [P.take, 0.3]]) {
    oval(g, c[0], c[1], r, r, 0, '#4a4b50'); oval(g, c[0], c[1], r * 0.72, r * 0.72, 0, '#2a2420');
    for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.4; oval(g, c[0] + Math.cos(a) * r * 0.45, c[1] + Math.sin(a) * r * 0.45, r * 0.15, r * 0.15, 0, '#6d6f75'); }
    oval(g, c[0], c[1], r * 0.1, r * 0.1, 0, '#a5a7ad');
  }
  drum(g, P.p[1], 0.06, 16); drum(g, P.p[4], 0.06, 16);
  // the gate: a steel plate with its little bright window
  g.fillStyle = '#4a4a50'; g.fillRect(P.gate[0] - 0.07, P.gate[1] - 0.1, 0.14, 0.2);
  g.fillStyle = '#ffe6b8'; g.fillRect(P.gate[0] - 0.025, P.gate[1] - 0.02, 0.05, 0.04);
  C.light(P.gate[0], P.gate[1], 0.06, '#ffd090', 0.7, 'gate');
  // the guide rollers by each point
  for (const p of [P.p[2], P.p[3], P.p[5]]) oval(g, p[0] + 0.02, p[1] + 0.02, 0.018, 0.018, 0, '#55555c');
  // the film: from the feed reel to p0 always; each segment threaded already
  film(g, [P.feed[0] + 0.3, P.feed[1] + 0.28], P.p[0]);
  for (let k = 0; k < done; k++) { if (k === 2) (loop ? loopFilm(g, P.p[2], P.p[3]) : film(g, P.p[2], P.p[3])); else film(g, P.p[k], P.p[k + 1]); }
  // the segment going on, in pieces shown as it is pulled; the end of the film and the boy's fingers holding it
  if (done < 5) {
    const a = P.p[done], b = P.p[done + 1];
    for (let j = 0; j < 6; j++) C.layer(`seg${j}`, a, [Math.min(a[0], b[0]) - 0.05, Math.min(a[1], b[1]) - 0.05, Math.max(a[0], b[0]) + 0.05, Math.max(a[1], b[1]) + 0.05], s => film(s, lerp(a, b, j / 6), lerp(a, b, (j + 1) / 6)));
    C.layer('tip', a, [a[0] - 0.2, a[1] - 0.12, a[0] + 0.45, a[1] + 0.45], s => {
      film(s, [a[0] - 0.03, a[1]], [a[0] + 0.012, a[1]]);
      hand(s, aim(P.fingers, 0, [a[0] + 0.012, a[1] + 0.008]), P.light);
    });
  } else C.layer('tip', [0, 0], [-0.1, -0.1, 0.1, 0.1], () => {});
  P.p.forEach((p, i) => C.at(p[0], p[1], `p${i}`));
  C.at(...P.gate);
  C.end();
}
function threadMove(e) {
  if (!ready(e, 'tip')) return;
  const L = mover(e), P = THREAD, S = e.state, done = clamp(Math.round(Number(S.threaded) || 0), 0, 5), u = c01(S.pull);
  if (done >= 5) { L.set('tip', { alpha: 0 }); return; }
  for (let j = 0; j < 6; j++) L.set(`seg${j}`, { alpha: c01(u * 6 - j) });
  const a = P.p[done], b = P.p[done + 1];
  L.set('tip', { x: (b[0] - a[0]) * u, y: (b[1] - a[1]) * u + 0.003 * noise(e.t * 0.9, 3) });
}

// ── viewfinder ── the square at dusk through the 8 mm camera: the panorama moves under the crosshair (pan), the girl
// walks across it (elena_x), the madman runs through (madman_x); the rounded frame, the counter, a red point while it
// runs (rec)
const VF = { k: 0.55, open: [-0.66, -0.4, 0.66, 0.36], r: 0.08 };
function figure(g, x, y, h, body, hair, dress) {
  g.fillStyle = body; g.beginPath(); g.moveTo(x - h * 0.08, y); g.lineTo(x - h * 0.05, y - h * 0.55); g.lineTo(x + h * 0.05, y - h * 0.55); g.lineTo(x + h * 0.09, y); g.fill();
  if (dress) { g.fillStyle = dress; g.beginPath(); g.moveTo(x - h * 0.12, y - h * 0.08); g.lineTo(x - h * 0.05, y - h * 0.55); g.lineTo(x + h * 0.05, y - h * 0.55); g.lineTo(x + h * 0.12, y - h * 0.08); g.fill(); }
  oval(g, x, y - h * 0.62, h * 0.07, h * 0.085, 0, '#c99d7a'); oval(g, x + h * 0.01, y - h * 0.67, h * 0.075, h * 0.06, 0, hair);
}
function viewfinder(g, e) {
  const C = painter(g, e), P = VF;
  C.begin();
  // the square at dusk, wider than the eye (pan moves it): the church steps, the fountain, the bank and its door
  C.layer('square', [0, 0], [-2.4, -0.7, 2.4, 0.7], s => {
    const sky = s.createLinearGradient(0, -0.7, 0, 0); sky.addColorStop(0, '#3e4a78'); sky.addColorStop(0.6, '#8a7f9c'); sky.addColorStop(1, '#d9a98c');
    s.fillStyle = sky; s.fillRect(-2.4, -0.7, 4.8, 0.7);
    const stone = s.createLinearGradient(0, 0, 0, 0.7); stone.addColorStop(0, '#9a8676'); stone.addColorStop(1, '#5c4c42');
    s.fillStyle = stone; s.fillRect(-2.4, 0, 4.8, 0.7);
    for (let i = 0; i < 26; i++) line(s, -2.4, 0.03 + i * 0.026, 2.4, 0.03 + i * 0.026, 0.002, 'rgba(60,44,36,0.25)');
    // houses all round, their windows warm
    const house = (x0, x1, top, col) => { s.fillStyle = col; s.fillRect(x0, top, x1 - x0, -top + 0.001); for (let x = x0 + 0.06; x < x1 - 0.06; x += 0.14) { s.fillStyle = C.rnd() < 0.45 ? '#e9b46a' : '#3a3240'; s.fillRect(x, top + 0.06, 0.05, 0.08); } };
    house(-2.4, -1.5, -0.42, '#b29a86'); house(-1.5, -0.7, -0.5, '#c4ab92'); house(0.9, 1.6, -0.46, '#bda48e'); house(1.6, 2.4, -0.38, '#a8927e');
    // the church and its steps (left of the middle)
    s.fillStyle = '#d6c4ac'; s.fillRect(-0.7, -0.62, 0.62, 0.62); s.beginPath(); s.moveTo(-0.72, -0.62); s.lineTo(-0.39, -0.74); s.lineTo(-0.06, -0.62); s.fill();
    s.fillStyle = '#4a3a34'; s.fillRect(-0.45, -0.3, 0.12, 0.3);
    for (let i = 0; i < 4; i++) { s.fillStyle = i % 2 ? '#b8a690' : '#c8b6a0'; s.fillRect(-0.75 + i * 0.01, -0.005 - i * 0.012 + 0.04, 0.72 - i * 0.02, 0.014); }
    // the bank, its door, the balcony over it (right)
    s.fillStyle = '#cbbba4'; s.fillRect(0.0, -0.58, 0.9, 0.58);
    s.fillStyle = '#3a3036'; s.fillRect(0.38, -0.26, 0.12, 0.26);
    s.fillStyle = '#2c2630'; s.fillRect(0.34, -0.36, 0.2, 0.02); for (let i = 0; i < 7; i++) s.fillRect(0.35 + i * 0.03, -0.36, 0.006, 0.07);
    s.fillStyle = '#e9b46a'; s.fillRect(0.4, -0.5, 0.08, 0.1);
    // the fountain in the middle of the square
    oval(s, 0.0, 0.18, 0.3, 0.06, 0, '#7a6a5e'); oval(s, 0.0, 0.16, 0.27, 0.045, 0, '#5a6a7a');
    s.fillStyle = '#8a786a'; s.fillRect(-0.03, 0.02, 0.06, 0.14); oval(s, 0, 0.02, 0.1, 0.025, 0, '#8a786a');
    // a bus far right at the stop
    s.fillStyle = '#6a7a6a'; s.fillRect(1.75, -0.12, 0.5, 0.14); s.fillStyle = '#2a3238'; for (let i = 0; i < 5; i++) s.fillRect(1.8 + i * 0.09, -0.1, 0.06, 0.05);
    // passers-by, small
    for (const [x, c] of [[-1.2, '#4a4040'], [-0.95, '#5a4a3a'], [0.75, '#3a3a44'], [1.3, '#5a4448']]) figure(s, x, 0.12 + 0.05 * C.rnd(), 0.18, c, '#2a2020');
  });
  C.layer('girl', [0, 0.26], [-0.2, -0.1, 0.2, 0.32], s => figure(s, 0, 0.3, 0.42, '#d6c8b2', '#2a1b14', '#ece2cc'));
  C.layer('madman', [0, 0.3], [-0.25, -0.15, 0.25, 0.35], s => {
    figure(s, 0, 0.32, 0.46, '#5a4e3a', '#2a211a', '#6a5c44');
    line(s, -0.01, 0.07, -0.13, 0.02, 0.025, '#5a4e3a'); line(s, 0.01, 0.07, 0.13, 0.03, 0.025, '#5a4e3a');
  });
  // the faded colour of the reversal film, a little warm, a little grainy
  C.layer('tone', [0, 0], [-W, -0.6, W, 0.6], s => { s.fillStyle = 'rgba(190,130,80,0.12)'; s.fillRect(-W, -0.6, 2 * W, 1.2); }, { flicker: 0.05 });
  // the viewfinder: black all round, a rounded window, a crosshair, the footage counter, the red point
  C.layer('mask', [0, 0], [-W, -0.6, W, 0.6], m => {
    const [x0, y0, x1, y1] = P.open, r = P.r;
    m.fillStyle = '#060606'; m.beginPath(); m.rect(-W, -0.6, 2 * W, 1.2);
    m.moveTo(x0 + r, y0); m.lineTo(x1 - r, y0); m.quadraticCurveTo(x1, y0, x1, y0 + r); m.lineTo(x1, y1 - r); m.quadraticCurveTo(x1, y1, x1 - r, y1);
    m.lineTo(x0 + r, y1); m.quadraticCurveTo(x0, y1, x0, y1 - r); m.lineTo(x0, y0 + r); m.quadraticCurveTo(x0, y0, x0 + r, y0);
    m.fill('evenodd');
    const v = m.createRadialGradient(0, 0, 0.35, 0, 0, 0.85); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)');
    m.fillStyle = v; m.fillRect(x0, y0, x1 - x0, y1 - y0);
    m.strokeStyle = 'rgba(240,236,226,0.7)'; m.lineWidth = 0.004;
    m.beginPath(); m.moveTo(-0.06, 0); m.lineTo(-0.015, 0); m.moveTo(0.015, 0); m.lineTo(0.06, 0); m.moveTo(0, -0.06); m.lineTo(0, -0.015); m.moveTo(0, 0.015); m.lineTo(0, 0.06); m.stroke();
    m.strokeRect(-0.22, -0.16, 0.44, 0.32);
    words(m, '17', x1 - 0.1, y1 - 0.05, 0.035, 'rgba(240,236,226,0.75)', { style: 'normal' });
    words(m, 'FT', x1 - 0.045, y1 - 0.05, 0.022, 'rgba(240,236,226,0.6)', { style: 'normal' });
  });
  C.layer('rec', [P.open[0] + 0.06, P.open[1] + 0.06], null, m => { oval(m, P.open[0] + 0.06, P.open[1] + 0.06, 0.013, 0.013, 0, '#d8312a'); pool(m, P.open[0] + 0.06, P.open[1] + 0.06, 0.04, '#ff5040', 0.5); });
  C.at(0, 0);
  C.end();
}
function viewfinderMove(e) {
  if (!ready(e, 'square')) return;
  const L = mover(e), S = e.state, t = e.t, k = VF.k, pan = clamp(Number(S.pan) || 0, -1, 1);
  const shake = [0.003 * noise(t * 2.1, 1), 0.003 * noise(t * 1.7, 2)];
  L.set('square', { x: -pan * k + shake[0], y: shake[1] });
  const ex = clamp(Number(S.elena_x ?? 0) || 0, -1, 1), mx = Number(S.madman_x ?? -1) || 0;
  // her steps: a little bob as she walks
  L.set('girl', { x: (ex - pan) * k + shake[0], y: shake[1] + 0.004 * Math.abs(Math.sin(t * 5)) });
  L.set('madman', { x: (clamp(mx, -1.6, 1.6) - pan) * k * 1.4 + shake[0], y: shake[1] + 0.008 * Math.abs(Math.sin(t * 9)), alpha: Math.abs(mx) < 0.97 ? 1 : 0 });
  L.set('rec', { alpha: c01(S.rec) * (0.6 + 0.4 * (Math.sin(t * 6) > 0 ? 1 : 0.3)) });
}

// ── calendar ── the wall behind the booth's door: an old calendar of 1958 open on December, dusty; the months before
// folded over its top (their edges show over it); a grown man's hand brings them down one by one
const CAL = { x0: -0.3, x1: 0.3, top: -0.27, bot: 0.3, months: ['DICEMBRE', 'NOVEMBRE', 'OTTOBRE', 'SETTEMBRE', 'AGOSTO'], starts: [1, 6, 3, 1, 5], days: [31, 30, 31, 30, 31] };
CAL.hand = handOf('grown', { angle: Math.PI + 0.2, side: -1, L: 0.27, curl: [0.4, 0.5, 0.55, 0.6], spread: 0.15, thumb: { angle: -0.3, curl: 0.45 }, fine: true });
function sheet(g, m, pencil) {
  const P = CAL, w = P.x1 - P.x0;
  g.fillStyle = blend('#e9dfc4', '#b8a888', 0.15 * m); g.fillRect(P.x0, P.top, w, P.bot - P.top);
  g.strokeStyle = 'rgba(80,60,40,0.4)'; g.lineWidth = 0.002; g.strokeRect(P.x0, P.top, w, P.bot - P.top);
  // the picture at the top: a little print of a saint, faded
  g.fillStyle = '#b89a78'; g.fillRect(P.x0 + 0.04, P.top + 0.03, w - 0.08, 0.15);
  g.fillStyle = '#8a6a50'; oval(g, 0, P.top + 0.1, 0.03, 0.04, 0, '#7a5a42'); g.fillRect(-0.04, P.top + 0.12, 0.08, 0.06);
  words(g, P.months[m], 0, P.top + 0.215, 0.03, '#7a2a20');
  words(g, '1958', 0, P.top + 0.245, 0.018, '#5a4a3a', { style: 'normal' });
  // the grid of days
  const cw = (w - 0.06) / 7;
  for (let d = 0; d < P.days[m]; d++) {
    const cell = d + P.starts[m] - 1, cx = P.x0 + 0.03 + cw * (cell % 7) + cw / 2, cy = P.top + 0.29 + Math.floor(cell / 7) * 0.05 * 0.9;
    words(g, String(d + 1), cx, cy, 0.017, cell % 7 === 6 ? '#8a2a20' : '#3a3028', { style: 'normal' });
  }
  if (pencil) {
    // her pencil over the days: four lines, slanting, not to be read
    g.strokeStyle = 'rgba(40,36,40,0.82)'; g.lineWidth = 0.0035; g.lineCap = 'round';
    for (let r = 0; r < 4; r++) {
      const y = P.top + 0.3 + r * 0.055, len = r === 3 ? 0.2 : 0.46;
      g.beginPath(); g.moveTo(P.x0 + 0.05, y);
      for (let x = 0; x < len; x += 0.012) g.lineTo(P.x0 + 0.05 + x, y - 0.012 * Math.abs(Math.sin(x * 160 + r)) + 0.004 * Math.sin(x * 47));
      g.stroke();
    }
    g.beginPath(); g.moveTo(P.x0 + 0.33, P.top + 0.48); g.quadraticCurveTo(P.x0 + 0.4, P.top + 0.45, P.x0 + 0.47, P.top + 0.5); g.stroke();
  }
}
function calendar(g, e) {
  const C = painter(g, e), P = CAL, S = e.state, pages = clamp(Math.round(Number(S.pages) || 0), 0, 4);
  C.begin();
  // the booth's plaster wall, cold light from the window on the left; the door's leaf at the right edge
  const wall = g.createLinearGradient(-W, 0, W, 0); wall.addColorStop(0, '#8e8478'); wall.addColorStop(0.5, '#6f665c'); wall.addColorStop(1, '#3c3631');
  g.fillStyle = wall; g.fillRect(-W, -0.6, 2 * W, 1.2);
  for (let i = 0; i < 40; i++) oval(g, -W + 2 * W * C.rnd(), -0.6 + 1.2 * C.rnd(), 0.05 + 0.12 * C.rnd(), 0.04 + 0.08 * C.rnd(), C.rnd() * 3, 'rgba(70,58,44,0.06)');
  // cracks in the plaster, a water stain under the ceiling
  for (const [x, y] of [[-0.9, -0.4], [0.62, 0.2], [-0.55, 0.35]]) { g.strokeStyle = 'rgba(40,32,26,0.35)'; g.lineWidth = 0.0025; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 0.05, y + 0.06); g.lineTo(x + 0.03, y + 0.12); g.lineTo(x + 0.08, y + 0.17); g.stroke(); }
  const stain = g.createLinearGradient(0, -0.6, 0, -0.35); stain.addColorStop(0, 'rgba(70,56,40,0.3)'); stain.addColorStop(1, 'rgba(70,56,40,0)');
  g.fillStyle = stain; g.fillRect(-W, -0.6, 2 * W, 0.25);
  g.fillStyle = '#3a2c22'; g.fillRect(0.95, -0.6, W - 0.95, 1.2); g.fillStyle = '#2a1e16'; g.fillRect(0.95, -0.6, 0.03, 1.2);
  pool(g, -1.2, -0.3, 1.5, '#a9b4cc', 0.2);
  // the nail, the string
  oval(g, 0, P.top - 0.12, 0.008, 0.008, 0, '#2a2a2a'); line(g, -0.12, P.top - 0.01, 0, P.top - 0.12, 0.002, '#3a3030'); line(g, 0.12, P.top - 0.01, 0, P.top - 0.12, 0.002, '#3a3030');
  // the sheet on view (pages brought down: November … August over December), its shadow
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(P.x0 + 0.012, P.top + 0.015, P.x1 - P.x0, P.bot - P.top);
  sheet(g, pages, pages === 4);
  // the months still folded over the top: their edges, a roll over the top
  for (let i = 0; i < 4 - pages; i++) {
    g.fillStyle = blend('#d8cdb0', '#9a8a6a', i * 0.15); g.fillRect(P.x0 - 0.004, P.top - 0.03 - i * 0.008, P.x1 - P.x0 + 0.008, 0.03);
    g.strokeStyle = 'rgba(60,44,30,0.4)'; g.lineWidth = 0.002; g.strokeRect(P.x0 - 0.004, P.top - 0.03 - i * 0.008, P.x1 - P.x0 + 0.008, 0.03);
  }
  // the next sheet coming down over the top (unrolled by fold), the hand at its edge
  if (pages < 4) {
    C.layer('fold', [0, P.top], [P.x0 - 0.02, P.top - 0.01, P.x1 + 0.02, P.bot + 0.02], f => { sheet(f, pages + 1, pages + 1 === 4); f.fillStyle = 'rgba(0,0,0,0.12)'; f.fillRect(P.x0, P.bot - 0.02, P.x1 - P.x0, 0.02); });
    C.layer('hand', [0, P.top - 0.03], [-0.1, P.top - 0.25, W, P.top + 0.4], f => hand(f, aim(P.hand, 0, [P.x1 - 0.05, P.top - 0.012]), { dir: [-0.9, -0.3], colour: '#c4cce0' }));
  } else {
    C.layer('fold', [0, 0], [-0.1, -0.1, 0.1, 0.1], () => {});
    C.layer('hand', [0, 0], [-0.1, -0.1, 0.1, 0.1], () => {});
  }
  // the dust of thirty years over it
  C.layer('dust', [0, 0], [P.x0 - 0.08, P.top - 0.2, P.x1 + 0.05, P.bot + 0.05], d => {
    // a grey film of dust over the paper, thicker toward the top where it settles, a dusty rim along the roll
    const film = d.createLinearGradient(0, P.top - 0.06, 0, P.bot);
    film.addColorStop(0, 'rgba(128,118,104,0.62)'); film.addColorStop(0.35, 'rgba(128,118,104,0.42)'); film.addColorStop(1, 'rgba(128,118,104,0.3)');
    d.fillStyle = film; d.fillRect(P.x0, P.top - 0.06, P.x1 - P.x0, P.bot - P.top + 0.06);
    d.fillStyle = 'rgba(110,100,88,0.5)'; d.fillRect(P.x0 - 0.004, P.top - 0.065, P.x1 - P.x0 + 0.008, 0.02);
    for (let i = 0; i < 70; i++) oval(d, P.x0 + (P.x1 - P.x0) * C.rnd(), P.top - 0.05 + (P.bot - P.top + 0.05) * C.rnd(), 0.0015 + 0.002 * C.rnd(), 0.0015 + 0.0015 * C.rnd(), 0, 'rgba(84,76,66,0.45)');
    // a few cobweb threads from the nail
    d.strokeStyle = 'rgba(200,196,186,0.35)'; d.lineWidth = 0.0015;
    d.beginPath(); d.moveTo(P.x0, P.top - 0.06); d.quadraticCurveTo(P.x0 - 0.04, P.top - 0.12, P.x0 + 0.05, P.top - 0.16); d.stroke();
  });
  C.at(0, P.top - 0.03 - Math.max(0, 3 - pages) * 0.008, 'fold');
  C.at(0, (P.top + P.bot) / 2);
  C.end();
}
function calendarMove(e) {
  if (!ready(e, 'fold')) return;
  const L = mover(e), P = CAL, S = e.state, f = c01(S.fold), pages = clamp(Math.round(Number(S.pages) || 0), 0, 4);
  if (pages < 4) {
    L.set('fold', { sy: Math.max(0.001, f), alpha: f > 0.01 ? 1 : 0 });
    L.set('hand', { y: (P.bot - P.top) * f + 0.003 * noise(e.t * 0.8, 1), alpha: 1 });
  } else { L.set('fold', { alpha: 0 }); L.set('hand', { alpha: 0 }); }
  L.set('dust', { alpha: c01(S.dust ?? 1) });
}

// ── strip ── the booth's window at a cool evening (only the sky in it); the spliced tape held across it in a grown
// man's two hands; the frame in the middle of the window warm with the light behind it. strip_x moves the tape right
// to left; the first `jumps` of the three cut in chapter I jump at their splice as they pass the light
const STRIP = (() => {
  const h = 0.3, k = h * 0.72, fw = k * 1.33, gap = h * 0.06, step = fw + gap;
  const names = ['kiss_cut1', 'kiss_cut2', 'kiss_cut3', 'kiss1', 'kiss2', 'kiss3', 'kiss4', 'kiss5', 'kiss6', 'kiss7', 'kiss8'];
  return { h, k, fw, step, names, y: -0.02, win: [-0.46, -0.34, 0.46, 0.27], travel: (names.length - 1) * step,
    light: { dir: [0, -1], colour: '#e6dcef' },
    left: aim(handOf('grown', { angle: -1.2, curl: [0.5, 0.62, 0.7, 0.74], spread: 0.12, thumb: { angle: -0.15, curl: 0.4 }, fine: true }), 0, [-0.52, -0.02 + h / 2 - 0.02]),
    right: aim(handOf('grown', { angle: -Math.PI + 1.2, side: -1, curl: [0.5, 0.62, 0.7, 0.74], spread: 0.12, thumb: { angle: -0.15, curl: 0.4 }, fine: true }), 0, [0.52, -0.02 + h / 2 - 0.02]),
  };
})();
function strip(g, e) {
  const C = painter(g, e), P = STRIP, k = C.cinema, S = e.state, [wx0, wy0, wx1, wy1] = P.win;
  C.begin();
  // the booth's wall round the window, dark; the window: only the cool evening sky, a last warmth low
  g.fillStyle = '#1a1716'; g.fillRect(-W, -0.6, 2 * W, 1.2);
  for (let i = 0; i < 70; i++) oval(g, -W + 2 * W * C.rnd(), -0.6 + 1.2 * C.rnd(), 0.04 + 0.1 * C.rnd(), 0.02 + 0.05 * C.rnd(), C.rnd() * 3, 'rgba(70,60,56,0.08)');
  const sky = g.createLinearGradient(0, wy0, 0, wy1); sky.addColorStop(0, '#2a3050'); sky.addColorStop(0.55, '#6a6688'); sky.addColorStop(1, '#c4a2a0');
  g.fillStyle = sky; g.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
  for (let i = 0; i < 14; i++) oval(g, wx0 + (wx1 - wx0) * C.rnd(), wy0 + 0.2 * (wy1 - wy0) * C.rnd(), 0.0025, 0.0025, 0, 'rgba(255,255,255,0.7)');
  // the broken pane's edge, the frame of the window, the sill
  g.strokeStyle = 'rgba(220,226,240,0.25)'; g.lineWidth = 0.003; g.beginPath(); g.moveTo(wx1 - 0.2, wy0); g.lineTo(wx1 - 0.12, wy0 + 0.12); g.lineTo(wx1, wy0 + 0.1); g.stroke();
  g.fillStyle = '#2e2622'; g.fillRect(wx0 - 0.04, wy0 - 0.04, wx1 - wx0 + 0.08, 0.04); g.fillRect(wx0 - 0.04, wy1, wx1 - wx0 + 0.08, 0.05);
  g.fillRect(wx0 - 0.04, wy0, 0.04, wy1 - wy0); g.fillRect(wx1, wy0, 0.04, wy1 - wy0); g.fillRect(-0.012, wy0, 0.024, wy1 - wy0);
  // the cool light of the window on the wall round it
  pool(g, 0, 0, 1.2, '#9aa2c0', 0.18);
  // the tape (its base, long) and each frame a layer of its own, moved together; the first in the window's middle
  const x0 = -P.step / 2, len = P.names.length * P.step;
  C.layer('tape', [0, P.y], [x0 - 1.6, P.y - P.h / 2 - 0.02, x0 + len + 1.6, P.y + P.h / 2 + 0.02], t => {
    t.fillStyle = '#2a211b'; t.fillRect(x0 - 1.6, P.y - P.h / 2, len + 3.2, P.h);
    t.fillStyle = '#c9bfa8';
    for (let x = x0 - 1.55; x < x0 + len + 1.55; x += P.h * 0.14) { t.fillRect(x, P.y - P.h / 2 + P.h * 0.04, P.h * 0.07, P.h * 0.06); t.fillRect(x, P.y + P.h / 2 - P.h * 0.1, P.h * 0.07, P.h * 0.06); }
    // the leader before the first frame and after the last: dark, blank
  });
  P.names.forEach((name, i) => {
    const cx = i * P.step;
    C.layer(`f${i}`, [cx, P.y], [cx - P.fw / 2 - 0.01, P.y - P.k / 2 - 0.01, cx + P.fw / 2 + 0.01, P.y + P.k / 2 + 0.01], f => {
      k.frame(f, name, cx - P.fw / 2, P.y - P.k / 2, P.fw, P.k);
      if (i < 3) { f.strokeStyle = 'rgba(240,232,214,0.6)'; f.lineWidth = 0.003; f.beginPath(); f.moveTo(cx - P.fw / 2 - 0.004, P.y - P.h / 2); f.lineTo(cx - P.fw / 2 - 0.004, P.y + P.h / 2); f.stroke(); }
    });
  });
  // off the window the tape is in the room's dark; in it, the light comes through
  C.layer('dim', [0, 0], [-W, -0.6, W, 0.6], d => {
    d.fillStyle = 'rgba(28,24,30,0.72)'; d.beginPath(); d.rect(-W, P.y - P.h / 2 - 0.01, 2 * W, P.h + 0.02); d.rect(wx0, wy0, wx1 - wx0, wy1 - wy0); d.fill('evenodd');
  }, { blend: 'multiply' });
  C.layer('warm', [0, P.y], [wx0, wy0, wx1, wy1], w => {
    const gr = w.createRadialGradient(0, P.y, 0.02, 0, P.y, 0.32); gr.addColorStop(0, 'rgba(255,196,120,0.55)'); gr.addColorStop(0.6, 'rgba(255,170,100,0.18)'); gr.addColorStop(1, 'rgba(255,170,100,0)');
    w.fillStyle = gr; w.fillRect(-0.32, P.y - P.h / 2, 0.64, P.h);
    C.light(0, P.y, 0.18, '#ffc890', 0.5, 'warm');
  }, { blend: 'add', flicker: 0.03 });
  // his two hands holding the tape at the window's sides
  C.layer('left', P.left.at, [-W, -0.3, -0.2, 0.6], l => hand(l, P.left, P.light));
  C.layer('right', P.right.at, [0.2, -0.3, W, 0.6], l => hand(l, P.right, P.light));
  C.at(-0.52, P.y + 0.02, 'hand_l'); C.at(0.52, P.y + 0.02, 'hand_r');
  C.at(0, P.y);
  C.end();
}
function stripMove(e) {
  if (!ready(e, 'tape')) return;
  const L = mover(e), P = STRIP, S = e.state, t = e.t, u = c01(S.strip_x), jumps = clamp(Math.round(Number(S.jumps) || 0), 0, 3);
  const dx = -u * P.travel;
  L.set('tape', { x: dx });
  P.names.forEach((_, i) => {
    const cx = i * P.step + dx, inLight = Math.abs(cx) < P.fw * 0.6;
    // a crooked splice: in the light the frame jumps — a jerk up and back, again and again
    const jerk = i < jumps && inLight ? (Math.sin(t * 13 + i) > 0.55 ? -0.018 : 0) + 0.006 * Math.sin(t * 61) : 0;
    L.set(`f${i}`, { x: dx, y: jerk });
  });
  L.set('left', { x: 0.004 * noise(t * 0.5, 1), y: 0.004 * noise(t * 0.45, 2) });
  L.set('right', { x: 0.004 * noise(t * 0.5, 3), y: 0.004 * noise(t * 0.42, 4) });
  L.set('warm', { alpha: 0.85 + 0.15 * noise(t * 0.9, 5) });
}

// ── wallet ── at the station in the cool evening: his hands open an old wallet; from it, between the fingers of the
// right, one frame of film (kiss_cut2) rises against the station's lamp
const WALLET = {
  lamp: [-0.42, -0.36],
  left: aim(handOf('grown', { angle: -0.1, curl: [0.62, 0.66, 0.7, 0.74], spread: 0.08, thumb: { angle: -1.3, curl: 0.15 }, fine: true }), 1, [-0.31, 0.25]),
  right: aim(handOf('grown', { angle: -Math.PI / 2 - 0.35, side: -1, curl: [0.5, 0.78, 0.84, 0.88], spread: 0.08, thumb: { angle: -0.05, curl: 0.55 }, fine: true }), 0, [0.135, 0.035]),
  light: { dir: [0.3, -0.95], colour: '#f2e6c8' },
};
function wallet(g, e) {
  const C = painter(g, e), P = WALLET, k = C.cinema;
  C.begin();
  // the evening over the platform: lilac steel, the lamp's pale glow
  const sky = g.createLinearGradient(0, -0.6, 0, 0.6); sky.addColorStop(0, '#20243a'); sky.addColorStop(0.6, '#4a4660'); sky.addColorStop(1, '#2a2832');
  g.fillStyle = sky; g.fillRect(-W, -0.6, 2 * W, 1.2);
  g.fillStyle = '#1c1a20'; g.fillRect(P.lamp[0] - 0.008, P.lamp[1], 0.016, 1.0);
  g.fillStyle = '#2a2830'; g.fillRect(P.lamp[0] - 0.05, P.lamp[1] - 0.03, 0.1, 0.03);
  C.layer('lamp', P.lamp, null, l => { pool(l, P.lamp[0], P.lamp[1] + 0.02, 0.6, '#f6ead0', 0.55); oval(l, P.lamp[0], P.lamp[1] + 0.02, 0.03, 0.025, 0, '#fff6e0'); C.light(P.lamp[0], P.lamp[1] + 0.02, 0.1, '#f6ead0', 0.8, 'lamp'); }, { flicker: 0.03, blend: 'add' });
  // the wallet, worn leather: its body; its flap a layer that opens
  C.layer('body', [0, 0.32], [-0.5, 0.05, 0.5, 0.6], w => {
    w.fillStyle = '#3a2418'; w.beginPath(); w.moveTo(-0.34, 0.18); w.lineTo(0.34, 0.18); w.lineTo(0.32, 0.46); w.lineTo(-0.32, 0.46); w.closePath(); w.fill();
    w.strokeStyle = 'rgba(200,150,110,0.35)'; w.lineWidth = 0.003; w.setLineDash([0.012, 0.01]); w.strokeRect(-0.31, 0.2, 0.62, 0.24); w.setLineDash([]);
    w.fillStyle = '#2a180f'; w.fillRect(-0.3, 0.2, 0.6, 0.05);
    w.fillStyle = '#d8cfbe'; w.fillRect(-0.22, 0.19, 0.2, 0.03);
  });
  C.layer('flap', [0, 0.18], [-0.5, -0.2, 0.5, 0.25], w => {
    w.fillStyle = '#4a2e1e'; w.beginPath(); w.moveTo(-0.34, 0.18); w.lineTo(0.34, 0.18); w.lineTo(0.3, -0.06); w.lineTo(-0.3, -0.06); w.closePath(); w.fill();
    w.strokeStyle = 'rgba(200,150,110,0.3)'; w.lineWidth = 0.003; w.strokeRect(-0.28, -0.04, 0.56, 0.2);
  });
  // the frame: rising from the wallet between his fingers, against the lamp (it is light behind it)
  C.layer('frame', [0.12, -0.05], [-0.1, -0.3, 0.35, 0.3], f => {
    f.fillStyle = '#2a211b'; f.fillRect(0.02, -0.17, 0.2, 0.2);
    f.fillStyle = '#d9cfb8'; for (let y = -0.16; y < 0.02; y += 0.03) { f.fillRect(0.026, y, 0.012, 0.016); f.fillRect(0.202, y, 0.012, 0.016); }
    k.frame(f, 'kiss_cut2', 0.045, -0.155, 0.15, 0.17);
    pool(f, 0.12, -0.07, 0.14, '#fff2d8', 0.25);
  });
  C.layer('left', P.left.at, [-W, -0.1, 0.1, 0.7], l => hand(l, P.left, P.light));
  C.layer('right', P.right.at, [-0.1, -0.2, W, 0.8], l => hand(l, P.right, P.light));
  C.at(0.12, -0.07);
  C.end();
}
function walletMove(e) {
  if (!ready(e, 'flap')) return;
  const L = mover(e), S = e.state, t = e.t, o = ease.inOut(c01(S.open));
  L.set('flap', { sy: 1 - 1.8 * span(o, 0, 0.6), y: 0, alpha: 1 });
  const rise = span(o, 0.4, 1);
  L.set('frame', { y: 0.35 * (1 - rise), alpha: span(o, 0.35, 0.55), rotate: -0.08 + 0.05 * noise(t * 0.5, 1) });
  L.set('right', { x: 0.1 * (1 - rise), y: 0.3 * (1 - rise) + 0.003 * noise(t * 0.6, 2) });
  L.set('left', { y: 0.003 * noise(t * 0.5, 3) });
  L.set('lamp', { alpha: 0.9 + 0.1 * noise(t * 2, 4) });
}

return { splice, spliceMove, slate, slateMove, thread, threadMove, viewfinder, viewfinderMove, calendar, calendarMove,
  strip, stripMove, wallet, walletMove, hand, handOf, WHO };
