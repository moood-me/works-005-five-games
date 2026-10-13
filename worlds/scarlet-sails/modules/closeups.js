// The world's close-ups of hands and things: five shots for the inserts of its scenes — `scrap` (the scarlet
// scrap on Longren's bench, a child's fingers), `hold` (the ring on the boy's palm, his mother's four fingers over his
// hand), `cellar` (the bottom of the old cask, the boy's hand wiping the dust off its words), `ropes` (the ship's boy's
// two hands on the tarred shrouds, the sky and the horizon behind), `boat` (Grey's hand out of the skiff, Assol's hand
// on its way to it, the ring). No faces. One hand for all of them, flat, in the manner of the hand in the shot `rig`
// of «Дом Лонгрена»; `hold` and `boat` are painted with care (the light on every finger, nails, creases, the ring's
// glint), the other three plainly.
//   paint(g, e, shot) is an insert's code: the shot painted once, each thing that moves a layer. live(e, shot, now) is
// its animate: `now` — what moves — only sets the layers' numbers and marks the points that move. The painting reads
// nothing of `now`. closeups.md says how a scene uses it.
//   A shot's own units: the frame's height, the origin in the frame's middle (x −0.89…0.89, y −0.5…0.5, y down).
const { clamp, span, ease, noise } = anim;
const TAU = 2 * Math.PI;
const clamp01 = (v) => clamp(Number(v) || 0, 0, 1);

// (colours: a module stands by itself — the same lamplight and scarlet as the world's nebo, the skins of its cast)
const rgbOf = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const blend = (a, b, u) => `#${rgbOf(a).map((v, i) => Math.round(v + (rgbOf(b)[i] - v) * u).toString(16).padStart(2, "0")).join("")}`;
const rgba = (c, a) => `rgba(${rgbOf(c).join(",")},${a})`;
const WARM = "#f4a85c", SCARLET = "#d4283a", SCARLET_LIGHT = "#ec4a52", SCARLET_DEEP = "#a8182c";
const SKIN = { child: "#c4936f", assol: "#cf9f7c", grey: "#c39a7a", teen: "#c9a080", boy: "#e2bd9d", lilian: "#e3cdbb" };
const GOLD = { dark: "#8a651c", mid: "#c9992f", light: "#f6dc8a" };

// ── shapes ──
// a round-ended shape from one circle to another (a finger's joint to the next)
function capsule(g, x0, y0, r0, x1, y1, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  g.beginPath();
  g.arc(x0, y0, r0, a + Math.PI / 2, a - Math.PI / 2);
  g.arc(x1, y1, r1, a - Math.PI / 2, a + Math.PI / 2);
  g.closePath();
}
// a closed smooth shape through the middles of its points' sides
function blob(g, pts) {
  const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  g.beginPath();
  g.moveTo(...mid(pts[n - 1], pts[0]));
  for (let i = 0; i < n; i++) g.quadraticCurveTo(...pts[i], ...mid(pts[i], pts[(i + 1) % n]));
  g.closePath();
}
function oval(g, x, y, rx, ry, turn, colour) {
  g.fillStyle = colour;
  g.beginPath();
  g.ellipse(x, y, rx, ry, turn, 0, TAU);
  g.fill();
}
function line(g, x0, y0, x1, y1, w, colour) {
  g.strokeStyle = colour;
  g.lineWidth = w;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
  g.stroke();
}
// a soft pool of light (or of shade): a colour fading out from a point
function pool(g, x, y, r, colour, strength) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, rgba(colour, strength));
  gr.addColorStop(1, rgba(colour, 0));
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
const turned = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
// where a point is, carried by a layer turned `a` about `pivot` and moved by `off`
const carried = (p, pivot, a, off) => {
  const [x, y] = turned([p[0] - pivot[0], p[1] - pivot[1]], a);
  return [pivot[0] + x + off[0], pivot[1] + y + off[1]];
};

// ── the hand ──
// One hand for every shot. Its own units are its length (the wrist to the middle finger's tip, laid flat): the wrist at
// (0, 0), the fingers toward +x, the thumb on the −y side. A spec places and poses it:
//   at — the wrist in the shot; angle — where the fingers point (radians, 0 to the right, + clockwise); L — its length;
//   side — 1, or −1: mirrored (the thumb on the other side); view — "back" or "palm" (which face is to the eye);
//   curl — each finger's, index first, 0 straight … 1 a fist (seen flat a curling finger shortens; past a right angle
//   its end is behind the hand — not painted from the back, laid over the palm from the palm's side); spread — 0…1, how
//   fanned; thumb — { angle: where it points, in the hand's units; curl };
//   skin; arm — the forearm's length, in hands (it runs out of the frame); sleeve — { colour, from: where it ends, in
//   hands behind the wrist, cuff: a colour } or none: a bare arm; ring — { finger, kind: "own" | "mother" };
//   fine — painted with care (below); flat — a colour: its plain silhouette (a shadow);
//   parts — which of "arm", "palm", "thumb", "f0"…"f3" are painted (a finger a layer of its own).
const FINGERS = [
  { at: [0.5, -0.165], len: 0.44, w: 0.105, fan: -0.17 },
  { at: [0.53, -0.055], len: 0.5, w: 0.11, fan: -0.04 },
  { at: [0.51, 0.055], len: 0.46, w: 0.105, fan: 0.08 },
  { at: [0.46, 0.155], len: 0.36, w: 0.092, fan: 0.22 },
];
const PHALANX = [0.46, 0.3, 0.24], BEND = [0.9, 1.5, 1.1], TAPER = [0.94, 0.86, 0.76];
const PALM = [[0, -0.15], [0.2, -0.235], [0.46, -0.23], [0.56, -0.1], [0.56, 0.06], [0.5, 0.2], [0.3, 0.235], [0.06, 0.19], [-0.02, 0]];
const THUMB = { root: [0.13, -0.13], len: [0.3, 0.21], r: [0.085, 0.068, 0.056] };
const WHOLE = ["arm", "palm", "thumb", "f0", "f1", "f2", "f3"];
// a finger's joints as it is curled and fanned: [x, y, radius, behind the hand]
function joints(F, curl, spread) {
  const a = F.fan * spread, pts = [[F.at[0], F.at[1], F.w / 2, false]];
  let x = F.at[0], y = F.at[1], bend = 0;
  for (let k = 0; k < 3; k++) {
    bend += BEND[k] * curl;
    const l = F.len * PHALANX[k] * Math.cos(bend);
    x += l * Math.cos(a);
    y += l * Math.sin(a);
    pts.push([x, y, (F.w / 2) * TAPER[k], bend > Math.PI / 2]);
  }
  return pts;
}
// a point of a hand (its own units) in the shot
const handPoint = (o, [x, y]) => {
  const [dx, dy] = turned([x * o.L, y * o.L * o.side], o.angle);
  return [o.at[0] + dx, o.at[1] + dy];
};
// the middle of its palm; a finger's knuckle; a point along a finger (u of its length as it lies)
const palmOf = (o) => handPoint(o, [0.3, 0]);
const knuckleOf = (o, i) => handPoint(o, FINGERS[i].at);
const alongFinger = (o, i, u) => {
  const F = FINGERS[i], J = joints(F, o.curl[i], o.spread), end = J[3];
  return handPoint(o, [F.at[0] + (end[0] - F.at[0]) * u, F.at[1] + (end[1] - F.at[1]) * u]);
};
// where a ring on a finger is: the middle of the finger's first joint
const ringOf = (o, i) => {
  const J = joints(FINGERS[i], o.curl[i], o.spread);
  return handPoint(o, [(J[0][0] + J[1][0]) / 2, (J[0][1] + J[1][1]) / 2]);
};
const thumbRootOf = (o) => handPoint(o, THUMB.root);

// the colours a hand is painted in under a light: its edge (so the fingers read apart), its skin, its lit and its
// shaded side — warm both ways; `lit` — the way to the light in the hand's own units
function tones(o, light) {
  if (o.flat) return { edge: o.flat, skin: o.flat, fine: false, bare: true };
  const [lx, ly] = turned(light.dir, -o.angle);
  return {
    edge: blend(o.skin, "#55281a", o.fine ? 0.5 : 0.3),
    skin: o.skin,
    light: blend(blend(o.skin, "#ffffff", 0.22), light.colour, 0.3),
    shade: blend(o.skin, "#7a3d2a", 0.5),
    lit: [lx, ly * o.side],
    fine: !!o.fine,
    bare: false,
  };
}
// one joint of a limb. Plainly: its edge and its skin. With care: rounded by the light — lit on the side turned to it,
// shaded on the other
function limb(g, T, x0, y0, r0, x1, y1, r1) {
  const rim = T.fine ? 0.008 : 0.011;
  capsule(g, x0, y0, r0 + rim, x1, y1, r1 + rim);
  g.fillStyle = T.edge;
  g.fill();
  capsule(g, x0, y0, r0, x1, y1, r1);
  if (T.fine) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), d = nx * T.lit[0] + ny * T.lit[1];
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, r = Math.max(r0, r1) * (d < 0 ? -1 : 1), w = Math.abs(d);
    const gr = g.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
    gr.addColorStop(0, blend(T.skin, T.light, 0.3 + 0.7 * w));
    gr.addColorStop(0.42, T.skin);
    gr.addColorStop(1, blend(T.skin, T.shade, 0.3 + 0.7 * w));
    g.fillStyle = gr;
  } else g.fillStyle = T.skin;
  g.fill();
}
// a ring on a finger, seen from the hand's back: a band across the finger's first joint — the young captain's own
// (old, wide, engraved) or his mother's (thin, a small stone)
function band(g, J, kind) {
  const [x0, y0, r0] = J[0], [x1, y1] = J[1], cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), h = r0 + 0.004, t = kind === "own" ? 0.075 : 0.04;
  const across = (w, colour) => {
    g.strokeStyle = colour;
    g.lineWidth = w;
    g.lineCap = "butt";
    g.beginPath();
    g.moveTo(cx - nx * h, cy - ny * h);
    g.lineTo(cx + nx * h, cy + ny * h);
    g.stroke();
  };
  across(t + 0.014, GOLD.dark);
  const gr = g.createLinearGradient(cx - nx * h, cy - ny * h, cx + nx * h, cy + ny * h);
  gr.addColorStop(0, GOLD.mid);
  gr.addColorStop(0.45, GOLD.light);
  gr.addColorStop(1, GOLD.mid);
  across(t, gr);
  if (kind === "own") across(0.012, rgba(GOLD.dark, 0.7));
  else {
    oval(g, cx, cy, 0.026, 0.026, 0, GOLD.dark);
    oval(g, cx, cy, 0.018, 0.018, 0, "#f2f8ff");
  }
}
function finger(g, T, o, i) {
  const F = FINGERS[i], J = joints(F, o.curl[i], o.spread), back = o.view === "back";
  const a = F.fan * o.spread, nx = -Math.sin(a), ny = Math.cos(a);
  const joint = (k) => limb(g, T, J[k][0], J[k][1], J[k][2], J[k + 1][0], J[k + 1][1], J[k + 1][2]);
  // from the back: its end first, what is nearer the eye over it — and nothing of what is curled behind; from the
  // palm: its end last, over the palm
  if (back) { for (let k = 2; k >= 0; k--) if (!J[k + 1][3]) joint(k); } else for (let k = 0; k < 3; k++) joint(k);
  if (T.bare) return;
  if (T.fine) {
    // the creases of its joints
    for (let k = back ? 1 : 0; k < 3; k++) {
      if (back && J[k + 1][3]) continue;
      const h = J[k][2] * 0.72;
      line(g, J[k][0] - nx * h, J[k][1] - ny * h, J[k][0] + nx * h, J[k][1] + ny * h, 0.008, rgba(T.edge, 0.3));
    }
    if (back) {
      // the knuckle catching the light; the nail
      oval(g, J[0][0] + T.lit[0] * 0.012, J[0][1] + T.lit[1] * 0.012, F.w * 0.4, F.w * 0.34, a, rgba(T.light, 0.4));
      const flat = (J[3][0] - J[2][0]) * Math.cos(a) + (J[3][1] - J[2][1]) * Math.sin(a);
      if (!J[3][3] && flat > F.len * PHALANX[2] * 0.5) {
        const u = 0.55, x = J[2][0] + (J[3][0] - J[2][0]) * u, y = J[2][1] + (J[3][1] - J[2][1]) * u;
        oval(g, x, y, F.w * 0.36, F.w * 0.3, a, rgba(blend(T.skin, "#fff3e8", 0.55), 0.85));
      }
    }
  }
  if (back && o.ring && o.ring.finger === i) band(g, J, o.ring.kind);
}
function thumb(g, T, o) {
  const { root, len, r } = THUMB, a = o.thumb.angle, b = a + o.thumb.curl * 1.1;
  const jx = root[0] + len[0] * Math.cos(a), jy = root[1] + len[0] * Math.sin(a);
  const tx = jx + len[1] * Math.cos(b), ty = jy + len[1] * Math.sin(b);
  limb(g, T, root[0], root[1], r[0], jx, jy, r[1]);
  limb(g, T, jx, jy, r[1], tx, ty, r[2]);
  if (T.fine && o.view === "back") oval(g, jx + (tx - jx) * 0.6, jy + (ty - jy) * 0.6, 0.05, 0.04, b, rgba(blend(T.skin, "#fff3e8", 0.55), 0.85));
}
function palm(g, T, o) {
  blob(g, PALM);
  g.strokeStyle = T.edge;
  g.lineWidth = T.fine ? 0.016 : 0.022;
  g.lineJoin = "round";
  g.stroke();
  if (T.fine) {
    const gr = g.createLinearGradient(0.28 + T.lit[0] * 0.3, T.lit[1] * 0.3, 0.28 - T.lit[0] * 0.3, -T.lit[1] * 0.3);
    gr.addColorStop(0, blend(T.skin, T.light, 0.8));
    gr.addColorStop(0.45, T.skin);
    gr.addColorStop(1, blend(T.skin, T.shade, 0.75));
    g.fillStyle = gr;
  } else g.fillStyle = T.skin;
  g.fill();
  if (!T.fine) return;
  if (o.view === "palm") {
    // the palm's hollow, the ball of the thumb, its two lines
    oval(g, 0.31, 0.02, 0.14, 0.1, 0, rgba(T.shade, 0.22));
    oval(g, 0.17, -0.1, 0.12, 0.075, -0.5, rgba(T.light, 0.32));
    g.strokeStyle = rgba(T.edge, 0.38);
    g.lineWidth = 0.01;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0.4, -0.2);
    g.quadraticCurveTo(0.26, -0.04, 0.1, 0.03);
    g.moveTo(0.48, 0.17);
    g.quadraticCurveTo(0.36, 0.03, 0.47, -0.12);
    g.stroke();
  } else {
    // the back of the hand: its bones toward the knuckles, faintly
    for (const F of FINGERS) line(g, 0.2, F.at[1] * 0.45, F.at[0] - 0.08, F.at[1], 0.012, rgba(T.shade, 0.16));
  }
}
function arm(g, T, o) {
  limb(g, T, -o.arm, 0, 0.2, 0.06, 0, 0.15);
  if (!o.sleeve || T.bare) return;
  const s = o.sleeve, up = T.fine && T.lit[1] > 0 ? 1 : -1;
  // the sleeve: lit along the side turned to the light, when painted with care
  g.beginPath();
  g.moveTo(-o.arm, -0.33);
  g.lineTo(-s.from, -0.25);
  g.lineTo(-s.from, 0.25);
  g.lineTo(-o.arm, 0.33);
  g.closePath();
  if (T.fine) {
    const gr = g.createLinearGradient(0, 0.3 * up, 0, -0.3 * up);
    gr.addColorStop(0, blend(s.colour, "#ffe6c4", 0.3));
    gr.addColorStop(0.35, s.colour);
    gr.addColorStop(1, blend(s.colour, "#20141a", 0.4));
    g.fillStyle = gr;
  } else g.fillStyle = s.colour;
  g.fill();
  if (s.cuff) {
    g.fillStyle = blend(s.cuff, "#6a5a50", 0.35);
    g.fillRect(-s.from - 0.085, -0.265, 0.1, 0.53);
    g.fillStyle = s.cuff;
    g.fillRect(-s.from - 0.075, -0.255, 0.08, 0.51);
  }
}
function hand(g, o, light) {
  const T = tones(o, light), has = (part) => o.parts.includes(part), back = o.view === "back";
  g.save();
  g.translate(o.at[0], o.at[1]);
  g.rotate(o.angle);
  g.scale(o.L, o.L * o.side);
  if (has("arm")) arm(g, T, o);
  if (back && has("thumb")) thumb(g, T, o);
  if (has("palm")) palm(g, T, o);
  for (let i = 0; i < 4; i++) if (has(`f${i}`)) finger(g, T, o, i);
  if (!back && has("thumb")) thumb(g, T, o);
  g.restore();
}
const HAND = { side: 1, view: "back", curl: [0, 0, 0, 0], spread: 0.4, thumb: { angle: -0.75, curl: 0 }, arm: 3, parts: WHOLE };

// a glint: a small four-pointed star of light (a layer added over the picture)
function glint(g, x, y, r, colour) {
  pool(g, x, y, r * 1.6, colour, 0.55);
  g.fillStyle = "#ffffff";
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * TAU) / 8, d = i % 2 ? r * 0.18 : r;
    g.lineTo(x + d * Math.cos(a), y + d * Math.sin(a));
  }
  g.closePath();
  g.fill();
}
const font = (size) => `italic ${Math.round(size * 1000)}px Georgia, "Times New Roman", serif`;
function words(g, text, x, y, size, colour) {
  g.save();
  g.translate(x, y);
  g.scale(0.001, 0.001);
  g.font = font(size);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = colour;
  g.fillText(text, 0, 0);
  g.restore();
}

// ── scrap: the scarlet scrap on Longren's bench by the lamp, a child's fingers beside it ──
const SCRAP = (() => {
  const light = { dir: [0.8, -0.6], colour: "#ffd9a0" };
  const open = {
    ...HAND, at: [0.12, 0.56], angle: -1.72, L: 0.34, skin: SKIN.child, curl: [0.08, 0.05, 0.08, 0.12], spread: 0.6,
    thumb: { angle: -0.7, curl: 0.1 },
  };
  return {
    light, open,
    closed: { ...open, curl: [0.7, 0.75, 0.75, 0.7], spread: 0.1, thumb: { angle: -0.3, curl: 0.8 } },
    at: [0, -0.02], // the scrap's middle
    cloth: [[-0.27, -0.13], [-0.06, -0.19], [0.2, -0.15], [0.3, -0.05], [0.24, 0.1], [0.05, 0.13], [-0.2, 0.11], [-0.31, 0]],
    onto: [-0.01, -0.3], // the hand's way onto it
    box: [-0.4, -0.5, 0.7, 1.7],
  };
})();
function paintScrap(g, C) {
  const P = SCRAP, [sx, sy] = P.at;
  // the bench's top, lit by the lamp on the right
  const wood = g.createLinearGradient(-1.3, 0, 1.3, 0);
  wood.addColorStop(0, "#6d5a45");
  wood.addColorStop(0.55, "#a8845a");
  wood.addColorStop(1, "#dcb476");
  g.fillStyle = wood;
  g.fillRect(-1.3, -0.9, 2.6, 1.8);
  for (let i = 0; i < 26; i++) {
    const x = -1.3 + 2.4 * C.e.rnd(), y = -0.85 + 1.7 * C.e.rnd();
    line(g, x, y, x + 0.12 + 0.3 * C.e.rnd(), y + 0.006 * (C.e.rnd() - 0.5), 0.003, "rgba(60,44,30,0.16)");
  }
  for (const y of [-0.29, 0.05, 0.36]) {
    g.fillStyle = "rgba(48,36,26,0.34)";
    g.fillRect(-1.3, y, 2.6, 0.005);
    g.fillStyle = "rgba(255,236,200,0.2)";
    g.fillRect(-1.3, y + 0.005, 2.6, 0.003);
  }
  C.layer("lamp", [1.0, -0.4], null, (g) => {
    pool(g, 1.0, -0.4, 1.4, "#ffe2aa", 0.6);
    C.light(0.98, -0.44, 0.5, WARM, 0.7, "lamp");
  }, { flicker: 0.06 });
  // the scrap: its shadow on the wood, the silk with its folds, its frayed edge
  C.layer("scrap", P.at, null, (g) => {
    g.save();
    g.translate(-0.022, 0.02);
    g.fillStyle = "rgba(40,22,16,0.3)";
    g.beginPath();
    for (const p of P.cloth) g.lineTo(...p);
    g.closePath();
    g.fill();
    g.restore();
    const silk = g.createLinearGradient(-0.3, 0.05, 0.3, -0.1);
    silk.addColorStop(0, SCARLET_DEEP);
    silk.addColorStop(0.5, SCARLET);
    silk.addColorStop(1, SCARLET_LIGHT);
    g.fillStyle = silk;
    g.beginPath();
    for (const p of P.cloth) g.lineTo(...p);
    g.closePath();
    g.fill();
    g.fillStyle = rgba(SCARLET_DEEP, 0.55);
    g.beginPath();
    g.moveTo(-0.06, -0.19);
    g.lineTo(0.02, sy);
    g.lineTo(-0.2, 0.11);
    g.lineTo(-0.12, sy - 0.02);
    g.closePath();
    g.fill();
    g.fillStyle = rgba("#ff8f86", 0.4);
    g.beginPath();
    g.moveTo(0.2, -0.15);
    g.lineTo(0.3, -0.05);
    g.lineTo(0.12, sy + 0.01);
    g.closePath();
    g.fill();
    line(g, -0.06, -0.19, 0.02, sy, 0.004, rgba("#ffb0a6", 0.55));
    for (const [x, y, dx, dy] of [[-0.31, 0, -0.035, 0.012], [-0.29, -0.04, -0.03, -0.01], [0.3, -0.05, 0.03, 0.006], [0.27, 0.03, 0.032, 0.014], [0.05, 0.13, 0.008, 0.03]]) {
      line(g, x, y, x + dx, y + dy, 0.004, SCARLET);
    }
  });
  C.layer("open", P.open.at, P.box, (g) => hand(g, P.open, P.light));
  C.layer("closed", P.open.at, P.box, (g) => hand(g, P.closed, P.light));
  C.at(sx, sy, "scrap");
  C.at(sx, sy);
}
function liveScrap(L, now) {
  const P = SCRAP, t = L.e.t, taken = clamp01(now.taken);
  // the fingers come onto the scrap, then close on it: the silk gathers under them
  const on = ease.inOut(span(taken, 0, 0.6)), shut = ease.inOut(span(taken, 0.55, 1));
  const x = P.onto[0] * on, y = P.onto[1] * on, rotate = 0.012 * noise(t * 0.6, 3);
  L.set("open", { x, y, rotate, alpha: 1 - span(shut, 0.5, 1) });
  L.set("closed", { x, y, rotate, alpha: span(shut, 0, 0.5) });
  L.set("scrap", { y: 0.02 * shut, scale: 1 - 0.12 * shut });
}

// ── cellar: the bottom of the old cask by a candle, its words under the dust, the boy's hand wiping it off ──
const CELLAR = (() => {
  const light = { dir: [-0.94, 0.34], colour: "#ffcf8a" };
  const head = [0.06, 0], R = 0.6, rows = [-0.13, 0, 0.13], left = -0.42, right = 0.54, wide = 0.135;
  const angle = -2.0, L = 0.36, lies = 0.05, dir = turned([1, 0], angle);
  // the hand is painted with its palm at the first row's start, a little under the row
  const from = [left - wide / 2, rows[0] + lies];
  return {
    light, head, R, rows, left, right, wide, lies, from,
    lines: ["Меня выпьет Грей,", "когда будет", "в раю"],
    hand: {
      ...HAND, at: [from[0] - 0.3 * L * dir[0], from[1] - 0.3 * L * dir[1]], angle, L, skin: SKIN.boy, curl: [0.1, 0.06, 0.08, 0.14], spread: 0.5,
      thumb: { angle: -0.8, curl: 0.1 }, sleeve: { colour: "#5b2f3d", from: 0.16, cuff: "#e9e4da" },
    },
    box: [-0.9, -0.6, 0.5, 1.3],
    candle: [-0.6, 0.3],
  };
})();
function paintCellar(g, C) {
  const P = CELLAR, [hx, hy] = P.head, R = P.R, [cx, cy] = P.candle;
  // the cellar's dark behind the cask — brown, not black
  const dark = g.createLinearGradient(-1.3, 0, 1.3, 0);
  dark.addColorStop(0, "#5a4636");
  dark.addColorStop(1, "#33291f");
  g.fillStyle = dark;
  g.fillRect(-1.3, -0.9, 2.6, 1.8);
  // the cask's bottom: its staves' ends and its iron hoop round the oak boards
  oval(g, hx, hy, R + 0.1, R + 0.1, 0, "#4d4a48");
  g.strokeStyle = "rgba(205,180,140,0.5)";
  g.lineWidth = 0.008;
  g.beginPath();
  g.arc(hx, hy, R + 0.09, 2.2, 4.2);
  g.stroke();
  oval(g, hx, hy, R + 0.055, R + 0.055, 0, "#6b4d34");
  g.save();
  g.beginPath();
  g.arc(hx, hy, R, 0, TAU);
  g.clip();
  const oak = g.createLinearGradient(hx - R, 0, hx + R, 0);
  oak.addColorStop(0, "#cfa268");
  oak.addColorStop(0.6, "#a57c50");
  oak.addColorStop(1, "#7c5c3e");
  g.fillStyle = oak;
  g.fillRect(hx - R, hy - R, 2 * R, 2 * R);
  for (let i = 0; i < 40; i++) {
    const x = hx - R + 2 * R * C.e.rnd(), y = hy - R + 2 * R * C.e.rnd();
    line(g, x, y, x + 0.004 * (C.e.rnd() - 0.5), y + 0.1 + 0.25 * C.e.rnd(), 0.003, "rgba(70,46,28,0.2)");
  }
  for (let x = hx - R + 0.17; x < hx + R; x += 0.17) {
    g.fillStyle = "rgba(52,34,22,0.5)";
    g.fillRect(x, hy - R, 0.006, 2 * R);
    g.fillStyle = "rgba(255,226,180,0.18)";
    g.fillRect(x + 0.006, hy - R, 0.003, 2 * R);
  }
  // the dust that stays on it; the words burnt into the oak
  g.fillStyle = "rgba(179,165,144,0.22)";
  g.fillRect(hx - R, hy - R, 2 * R, 2 * R);
  P.lines.forEach((text, i) => words(g, text, hx, P.rows[i], 0.09, "#2a1b13"));
  g.restore();
  pool(g, cx, cy - 0.14, 1.2, "#ffd696", 0.4);
  // the dust over each line of the words: a swath the hand takes off, from one end to the other
  P.rows.forEach((y, i) => {
    const pivot = [i % 2 ? P.left - P.wide / 2 : P.right + P.wide / 2, y];
    C.layer(`dust${i}`, pivot, null, (g) => {
      line(g, P.left, y, P.right, y, P.wide, "#b3a590");
      for (let k = 0; k < 60; k++) {
        const x = P.left + (P.right - P.left) * C.e.rnd(), dy = (C.e.rnd() - 0.5) * P.wide * 0.8;
        oval(g, x, y + dy, 0.004 + 0.006 * C.e.rnd(), 0.003, 0, k % 2 ? "rgba(205,194,176,0.7)" : "rgba(140,126,108,0.5)");
      }
    });
  });
  C.layer("hand", P.hand.at, P.box, (g) => hand(g, P.hand, P.light));
  // the candle before the cask, on the left
  g.fillStyle = "#cdbf9f";
  g.fillRect(cx - 0.035, cy, 0.07, 0.6);
  g.fillStyle = "#efe4c8";
  g.fillRect(cx - 0.035, cy, 0.028, 0.6);
  line(g, cx, cy, cx, cy - 0.03, 0.005, "#3a2e26");
  C.layer("flame", [cx, cy - 0.02], null, (g) => {
    oval(g, cx, cy - 0.085, 0.024, 0.065, 0, "#ffc46a");
    oval(g, cx, cy - 0.07, 0.012, 0.038, 0, "#fff6dc");
    C.light(cx, cy - 0.08, 0.45, WARM, 0.8, "flame");
  }, { flicker: 0.1 });
  C.at(hx, hy, "barrel");
  C.at(hx, hy);
}
function liveCellar(L, now) {
  const P = CELLAR, t = L.e.t, whole = P.right - P.left + P.wide;
  // the dust goes row by row (three sweeps: there, back, there); the hand is at the edge of what is left
  const v = (1 - clamp01(now.dust)) * 3, row = Math.min(2, Math.floor(v)), p = ease.inOut(clamp(v - row, 0, 1));
  P.rows.forEach((y, i) => {
    const left = i < row ? 0 : i > row ? 1 : 1 - p;
    L.set(`dust${i}`, { sx: Math.max(0.001, left), alpha: left > 0.001 ? 1 : 0 });
  });
  const x = row % 2 ? P.right + P.wide / 2 - whole * p : P.left - P.wide / 2 + whole * p;
  const y = P.rows[row] + P.lies + (row < 2 ? (P.rows[row + 1] - P.rows[row]) * span(p, 0.8, 1) : 0);
  L.set("hand", { x: x - P.from[0], y: y - P.from[1], rotate: 0.02 * noise(t * 0.7, 4) + 0.05 * Math.sin(p * Math.PI) * (row % 2 ? -1 : 1) });
  L.set("flame", { sy: 1 + 0.1 * noise(t * 1.9, 1) });
}

// ── ropes: the ship's boy's two hands on the tarred shrouds, the sky and the horizon behind ──
const ROPES = (() => {
  const light = { dir: [0.5, -0.86], colour: "#fff1d6" };
  const sleeve = { colour: "#b6ab92", from: 0.5 };
  const gripped = { curl: [0.82, 0.85, 0.85, 0.8], spread: 0, thumb: { angle: -0.2, curl: 0.9 } };
  const opened = { curl: [0.06, 0.04, 0.06, 0.1], spread: 1, thumb: { angle: -0.95, curl: 0 } };
  const left = { ...HAND, at: [-0.55, 0.2], angle: -0.9, L: 0.4, side: -1, skin: SKIN.teen, sleeve };
  const right = { ...HAND, at: [0.55, 0.1], angle: -Math.PI + 0.9, L: 0.4, side: 1, skin: SKIN.teen, sleeve };
  return {
    light,
    step: 0.26, // from one ratline to the next
    shrouds: [-0.42, 0, 0.42],
    horizon: 0.14,
    hands: {
      left: { grip: { ...left, ...gripped }, open: { ...left, ...opened }, box: [-1.7, -0.45, 0, 1.5], out: -1 },
      right: { grip: { ...right, ...gripped }, open: { ...right, ...opened }, box: [0, -0.55, 1.7, 1.4], out: 1 },
    },
    raised: 0.16, slid: 0.2,
  };
})();
function paintRopes(g, C) {
  const P = ROPES, H = P.horizon;
  g.fillStyle = "#bfd6e6";
  g.fillRect(-1.3, -0.9, 2.6, 1.8);
  // the sky and the sea: one layer, heeled about the horizon's middle
  C.layer("horizon", [0, H], [-1.9, -1.6, 1.9, 1.6], (g) => {
    const sky = g.createLinearGradient(0, -0.9, 0, H);
    sky.addColorStop(0, "#8fb5d6");
    sky.addColorStop(1, "#e8eeea");
    g.fillStyle = sky;
    g.fillRect(-1.9, -1.6, 3.8, 1.6 + H);
    for (const [x, y, rx] of [[-0.9, -0.02, 0.3], [-0.2, 0.05, 0.36], [0.7, 0, 0.42], [1.3, 0.06, 0.3]]) oval(g, x, y, rx, 0.05, 0, "rgba(255,255,255,0.6)");
    const sea = g.createLinearGradient(0, H, 0, 0.9);
    sea.addColorStop(0, "#4f8098");
    sea.addColorStop(1, "#2f5876");
    g.fillStyle = sea;
    g.fillRect(-1.9, H, 3.8, 1.6 - H);
    g.fillStyle = "rgba(240,246,244,0.7)";
    g.fillRect(-1.9, H, 3.8, 0.004);
    for (let i = 0; i < 46; i++) {
      const d = C.e.rnd(), y = H + 0.012 + 0.8 * d * d, x = -1.8 + 3.5 * C.e.rnd();
      line(g, x, y, x + 0.03 + 0.14 * d, y, 0.003 + 0.004 * d, "rgba(220,236,240,0.4)");
    }
  });
  // the shrouds and their ratlines: the same from one ratline to the next, so they go down past the hands endlessly
  C.layer("rigging", [0, 0], [-0.6, -1.15, 0.6, 1.15], (g) => {
    const [x0, , x2] = P.shrouds;
    for (let n = -4; n <= 3; n++) {
      const y = n * P.step;
      for (const [w, colour, dy] of [[0.02, "#3a322b", 0], [0.005, "#85735e", -0.005]]) {
        g.strokeStyle = colour;
        g.lineWidth = w;
        g.lineCap = "butt";
        g.beginPath();
        g.moveTo(x0, y + dy);
        g.quadraticCurveTo(x0 / 2, y + dy + 0.02, 0, y + dy);
        g.quadraticCurveTo(x2 / 2, y + dy + 0.02, x2, y + dy);
        g.stroke();
      }
    }
    for (const x of P.shrouds) {
      g.fillStyle = "#2b2622";
      g.fillRect(x - 0.026, -1.15, 0.052, 2.3);
      for (let y = -1.17; y < 1.15; y += P.step / 4) line(g, x - 0.02, y + 0.03, x + 0.02, y, 0.006, "#5d4f41");
      g.fillStyle = "rgba(176,152,120,0.45)";
      g.fillRect(x + 0.01, -1.15, 0.007, 2.3);
      g.fillStyle = "#211d1a";
      for (let n = -4; n <= 3; n++) g.fillRect(x - 0.033, n * P.step - 0.024, 0.066, 0.048);
    }
  });
  for (const side of ["left", "right"]) {
    const S = P.hands[side];
    C.layer(`${side}_grip`, S.grip.at, S.box, (g) => hand(g, S.grip, P.light));
    C.layer(`${side}_open`, S.open.at, S.box, (g) => hand(g, S.open, P.light));
  }
  C.at(0, 0);
}
function liveRopes(L, now) {
  const P = ROPES, e = L.e, t = e.t, m = e.mem, k = 1 - Math.exp(-16 * e.dt), slip = clamp01(now.slip);
  // the ship heels: the horizon tips; a hand over hand up the shrouds: the ratlines go down
  L.set("horizon", { rotate: 0.14 * clamp(Number(now.roll) || 0, -1, 1) + 0.006 * noise(t * 0.4, 2) });
  L.set("rigging", { y: ((clamp01(now.climb) * 12) % 1) * P.step });
  for (const side of ["left", "right"]) {
    // a hand let go is lifted and opened; shut again it comes back onto the shroud (the key jumps: the hand goes after
    // it); a slip — both slide down, shaking
    const S = P.hands[side], to = 1 - clamp01(now[side]);
    if (m[side] == null || e.cut < 0.05) m[side] = to;
    m[side] += (to - m[side]) * k;
    const up = ease.inOut(m[side]), off = [S.out * 0.03 * up, -P.raised * up + P.slid * slip + 0.005 * slip * noise(t * 17, S.out + 4)];
    const rotate = S.out * 0.1 * up + 0.008 * noise(t * 0.8, S.out + 7);
    L.set(`${side}_grip`, { x: off[0], y: off[1], rotate, alpha: 1 - span(up, 0.5, 0.85) });
    L.set(`${side}_open`, { x: off[0], y: off[1], rotate, alpha: span(up, 0.15, 0.5) });
    L.at(...carried(palmOf(S.grip), S.grip.at, rotate, off), side);
  }
}

// ── hold: the ring on the boy's open palm, his mother's four fingers over his hand; a candle at the side ──
const HOLD = (() => {
  const light = { dir: [-0.93, -0.36], colour: "#ffc98a" };
  const his = {
    ...HAND, at: [-0.5, 0.2], angle: -0.12, L: 0.66, view: "palm", skin: SKIN.teen, curl: [0.22, 0.2, 0.24, 0.3], spread: 0.3,
    thumb: { angle: -0.85, curl: 0.2 }, sleeve: { colour: "#b6ab92", from: 0.22 }, fine: true,
  };
  // hers, come from above: her fingers across his, the index the nearest to his palm (the leftmost: finger1)
  const angle = 1.75, L = 0.66, dir = turned([1, 0], angle), across = [-0.02, -0.01];
  const her = {
    ...HAND, at: [across[0] - 0.515 * L * dir[0], across[1] - 0.515 * L * dir[1]], angle, L, side: -1, skin: SKIN.lilian, curl: [0.34, 0.32, 0.34, 0.38], spread: 0.25,
    sleeve: { colour: "#3b3442", from: 0.2, cuff: "#e2ddd2" }, fine: true,
  };
  const free = { ...her, curl: [0.05, 0.03, 0.05, 0.08] };
  const ring = handPoint(his, [0.31, 0.02]);
  return {
    light, his, her, free, dir, ring,
    shade: [-light.dir[0], -light.dir[1]], // the way her fingers' shadows fall
    fan: [-0.07, -0.02, 0.03, 0.08], // how each finger turns as it lets go
    knuckles: [0, 1, 2, 3].map((i) => knuckleOf(her, i)),
    points: [0, 1, 2, 3].map((i) => alongFinger(her, i, 0.55)),
    glint: [ring[0] - 0.036, ring[1] - 0.016],
  };
})();
function paintHold(g, C) {
  const P = HOLD, [rx, ry] = P.ring;
  // the dusk of the doorway, warm from the candle on the left
  const dusk = g.createRadialGradient(-1.0, -0.2, 0.1, -0.6, 0, 1.9);
  dusk.addColorStop(0, "#c08a56");
  dusk.addColorStop(0.5, "#7c5238");
  dusk.addColorStop(1, "#4a3229");
  g.fillStyle = dusk;
  g.fillRect(-1.3, -0.9, 2.6, 1.8);
  C.layer("glow", [-1.0, -0.2], null, (g) => {
    pool(g, -1.0, -0.2, 1.3, "#ffd08c", 0.5);
    C.light(-0.96, -0.2, 0.55, WARM, 0.8, "candle");
  }, { flicker: 0.1 });
  // his hand, palm up
  C.layer("his", P.his.at, [-2.7, -0.4, 0.4, 0.8], (g) => hand(g, P.his, P.light));
  // the ring lying in his palm: its shadow, the gold band, the dark of the palm seen through it
  C.layer("ring", P.ring, null, (g) => {
    g.save();
    g.translate(rx, ry);
    g.rotate(-0.25);
    oval(g, 0.012, 0.008, 0.052, 0.036, 0, "rgba(70,30,16,0.42)");
    const gold = g.createLinearGradient(-0.05, -0.03, 0.05, 0.03);
    gold.addColorStop(0, GOLD.light);
    gold.addColorStop(0.5, GOLD.mid);
    gold.addColorStop(1, GOLD.dark);
    oval(g, 0, 0, 0.052, 0.036, 0, GOLD.dark);
    oval(g, 0, 0, 0.048, 0.032, 0, gold);
    oval(g, 0.002, 0.003, 0.03, 0.018, 0, blend(SKIN.teen, "#6a3626", 0.55));
    g.strokeStyle = rgba(GOLD.light, 0.9);
    g.lineWidth = 0.005;
    g.beginPath();
    g.ellipse(0, 0, 0.041, 0.026, 0, 2.6, 4.6);
    g.stroke();
    g.restore();
  });
  C.layer("glint", P.glint, null, (g) => glint(g, P.glint[0], P.glint[1], 0.028, "#ffe9b8"), { blend: "add" });
  // her hand: each finger's shadow on his hand, the back of her hand and her sleeve, each finger as it holds — and as
  // it lies let go (shown instead as it opens)
  const parted = (name, spec, i) => C.layer(name, P.knuckles[i], null, (g) => hand(g, { ...spec, parts: [`f${i}`] }, P.light));
  for (let i = 0; i < 4; i++) parted(`shadow${i + 1}`, { ...P.free, flat: "#3c1a0e" }, i);
  C.layer("her", P.her.at, [-0.5, -2.4, 0.8, 0.3], (g) => hand(g, { ...P.her, parts: ["arm", "palm"] }, P.light));
  for (let i = 0; i < 4; i++) {
    parted(`finger${i + 1}`, P.her, i);
    parted(`finger${i + 1}_open`, P.free, i);
  }
  C.at(rx, ry);
}
function liveHold(L, now) {
  const P = HOLD, t = L.e.t, loose = [0, 1, 2, 3].map((i) => ease.inOut(1 - clamp01(now.grip?.[i] ?? 0))), all = (loose[0] + loose[1] + loose[2] + loose[3]) / 4;
  // his hand breathes, the ring with it; its glint lives with the flame
  const bx = 0.003 * noise(t * 0.35, 3), by = 0.003 * noise(t * 0.3, 4);
  L.set("his", { x: bx, y: by });
  L.set("ring", { x: bx, y: by });
  L.set("glint", { x: bx, y: by, alpha: 0.7 + 0.3 * noise(t * 2.3, 8), scale: 1 + 0.12 * noise(t * 3.1, 9) });
  // her hand draws back a little as her fingers let go; a finger let go lifts off his hand: it straightens, comes
  // nearer the eye, its shadow falls farther from it and fainter
  const hx = -P.dir[0] * 0.03 * all + 0.002 * noise(t * 0.4, 5), hy = -P.dir[1] * 0.03 * all + 0.002 * noise(t * 0.33, 6);
  L.set("her", { x: hx, y: hy });
  for (let i = 0; i < 4; i++) {
    const u = loose[i], x = hx - P.dir[0] * 0.035 * u, y = hy - P.dir[1] * 0.035 * u, rotate = P.fan[i] * u, scale = 1 + 0.06 * u, far = 0.012 + 0.05 * u;
    L.set(`shadow${i + 1}`, { x: x + P.shade[0] * far, y: y + P.shade[1] * far, rotate, scale, alpha: 0.42 - 0.22 * u });
    L.set(`finger${i + 1}`, { x, y, rotate, scale, alpha: 1 - span(u, 0.5, 1) });
    L.set(`finger${i + 1}_open`, { x, y, rotate, scale, alpha: span(u, 0, 0.5) });
    L.at(...carried(P.points[i], P.knuckles[i], rotate, [x, y]), `finger${i + 1}`);
  }
}

// ── boat: Grey's hand out of the skiff, Assol's hand on its way to it; the low sun behind, the sails' scarlet on the
// water between them; the ring on her finger ──
const BOAT = (() => {
  const light = { dir: [0.35, -0.94], colour: "#ffe0b0" };
  const his = {
    ...HAND, at: [-0.52, 0.08], angle: 0.06, L: 0.56, view: "palm", skin: SKIN.grey, curl: [0.25, 0.22, 0.26, 0.32], spread: 0.35,
    thumb: { angle: -1.05, curl: 0.15 }, sleeve: { colour: "#1f2b46", from: 0.2, cuff: "#e6e1d6" }, fine: true,
  };
  const her = {
    ...HAND, at: [0.74, -0.14], angle: Math.PI - 0.12, L: 0.46, skin: SKIN.assol, curl: [0.16, 0.13, 0.15, 0.2], spread: 0.3,
    thumb: { angle: -0.6, curl: 0.25 }, arm: 3.2, sleeve: { colour: "#d9d3c7", from: 1.25 }, fine: true,
  };
  // what of her hand comes to lie in his palm: the roots of her fingers
  const hers = handPoint(her, [0.55, 0]), palm = palmOf(his);
  return {
    light, his, her, hers, palm,
    travel: [palm[0] - hers[0], palm[1] - hers[1]],
    finger: 2, // the finger her ring is on
    ring: ringOf(her, 2),
    thumb: thumbRootOf(his),
    horizon: -0.26,
    sun: [0.25, -0.36],
    gunwale: { at: [-1.3, -0.02], turn: 0.415 },
  };
})();
function paintBoat(g, C) {
  const P = BOAT, H = P.horizon, [sx, sy] = P.sun, rnd = C.e.rnd, S = C.e.state;
  // the morning sky, the low sun behind the hands; the water under it, light
  const sky = g.createLinearGradient(0, -0.9, 0, H);
  sky.addColorStop(0, "#efc08c");
  sky.addColorStop(1, "#ffeccb");
  g.fillStyle = sky;
  g.fillRect(-1.3, -0.9, 2.6, 0.9 + H);
  const water = g.createLinearGradient(0, H, 0, 0.9);
  water.addColorStop(0, "#f0d2a6");
  water.addColorStop(0.3, "#9fb8b6");
  water.addColorStop(1, "#4f8194");
  g.fillStyle = water;
  g.fillRect(-1.3, H, 2.6, 0.9 - H);
  pool(g, sx, sy, 0.8, "#fff6dc", 0.95);
  C.light(sx, sy, 0.5, "#ffe2b0", 0.7, "sun");
  for (let i = 0; i < 40; i++) {
    const d = rnd(), y = H + 0.01 + 0.7 * d, w = 0.02 + 0.09 * d;
    oval(g, sx + (rnd() - 0.5) * (0.12 + 0.7 * d), y, w, 0.004 + 0.007 * d, 0, `rgba(255,244,214,${0.65 - 0.35 * d})`);
  }
  for (let i = 0; i < 30; i++) {
    const d = rnd(), y = H + 0.03 + 0.75 * d, x = -1.2 + 2.4 * rnd();
    line(g, x, y, x + 0.04 + 0.16 * d, y, 0.003 + 0.004 * d, "rgba(52,96,112,0.3)");
  }
  // the scarlet of the sails on the water, between the hands
  C.layer("scarlet", [0.08, 0.1], [-0.4, H, 0.56, 0.62], (g) => {
    for (let i = 0; i < 34; i++) {
      const d = rnd(), y = H + 0.02 + 0.56 * d, w = 0.035 + 0.11 * d;
      oval(g, 0.08 + (rnd() - 0.5) * (0.1 + 0.3 * d), y, w, 0.006 + 0.008 * d, 0, rgba(i % 3 ? SCARLET : SCARLET_LIGHT, 0.85 - 0.3 * d));
    }
  }, { shimmer: 0.5 });
  // the skiff's side, low on the left: its rail lit along the top by the sun behind
  g.save();
  g.translate(...P.gunwale.at);
  g.rotate(P.gunwale.turn);
  g.fillStyle = "#6b4a33";
  g.fillRect(0, 0.05, 2.0, 1.3);
  for (const y of [0.24, 0.45, 0.68]) {
    g.fillStyle = "rgba(40,26,18,0.4)";
    g.fillRect(0, y, 2.0, 0.006);
  }
  g.fillStyle = "#a87a4e";
  g.fillRect(0, 0, 2.0, 0.055);
  g.fillStyle = "rgba(255,230,184,0.85)";
  g.fillRect(0, 0, 2.0, 0.008);
  g.fillStyle = "rgba(40,26,18,0.35)";
  g.fillRect(0, 0.055, 2.0, 0.02);
  g.restore();
  // his hand held out, palm up; hers above it; his thumb, which closes over her fingers, over both
  C.layer("his", P.his.at, [-2.4, -0.4, 0.2, 0.6], (g) => hand(g, { ...P.his, parts: ["arm", "palm", "f0", "f1", "f2", "f3"] }, P.light));
  // (the ring is the scene's: its keys `ring` — on her finger or not —, `ring_kind`)
  const ringed = S.ring === "finger";
  C.layer("her", P.her.at, [0, -0.7, 2.4, 0.5], (g) => hand(g, ringed ? { ...P.her, ring: { finger: P.finger, kind: S.ring_kind } } : P.her, P.light));
  if (ringed) C.layer("glint", P.ring, null, (g) => glint(g, P.ring[0], P.ring[1], 0.03, "#fff0c8"), { blend: "add" });
  C.layer("his_thumb", P.thumb, null, (g) => hand(g, { ...P.his, parts: ["thumb"] }, P.light));
  C.at(...P.palm, "his");
  C.at((P.palm[0] + P.hers[0]) / 2, (P.palm[1] + P.hers[1]) / 2);
}
function liveBoat(L, now) {
  const P = BOAT, t = L.e.t, reach = clamp01(now.reach), far = 1 - reach, over = Math.sin(Math.PI * reach);
  // her hand goes to his along a low arc, unsure while it is far; come, it lies in his palm and his thumb closes on it
  const off = [P.travel[0] * reach + 0.004 * far * noise(t * 0.9, 2), P.travel[1] * reach - 0.045 * over + 0.004 * far * noise(t * 0.8, 3)];
  const rotate = -0.05 * over + 0.01 * far * noise(t * 0.6, 5);
  L.set("her", { x: off[0], y: off[1], rotate });
  if (L.e.state.ring === "finger") {
    const at = carried(P.ring, P.her.at, rotate, off);
    L.set("glint", { x: at[0] - P.ring[0], y: at[1] - P.ring[1], alpha: 0.7 + 0.3 * noise(t * 2.1, 8), scale: 1 + 0.15 * noise(t * 2.9, 9) });
  }
  L.set("his_thumb", { rotate: 0.8 * ease.inOut(span(reach, 0.8, 1)) });
  L.set("scarlet", { alpha: 0.88 + 0.12 * noise(t * 0.7, 6) });
  L.at(...carried(P.hers, P.her.at, rotate, off), "her");
}

// ── the shots ──
// each: its painting, its life, and a layer it always has (while that one is not there, nothing is painted yet)
const SHOTS = {
  scrap: { paint: paintScrap, live: liveScrap, first: "scrap" },
  hold: { paint: paintHold, live: liveHold, first: "his" },
  cellar: { paint: paintCellar, live: liveCellar, first: "hand" },
  ropes: { paint: paintRopes, live: liveRopes, first: "rigging" },
  boat: { paint: paintBoat, live: liveBoat, first: "his" },
};
// where a shot stands on the stage (stage heights). `frame` — { at: its middle, scale: its height }: a shot seen small
// through an iris in a corner; without it the shot is the whole frame
function frameOf(e, frame) {
  const k = frame ? frame.scale : 1, [ax, ay] = frame ? frame.at : [e.aspect / 2, 0.5];
  return { k, ax, ay, to: (x, y) => [ax + x * k, ay + y * k] };
}

// paint(g, e, shot, frame) — an insert's code. shot — its name: "scrap" | "hold" | "cellar" | "ropes" | "boat"; frame —
// only for a shot seen small (frameOf). The painting reads no key of the scene but `ring`, `ring_kind` in "boat"
function paint(g, e, shot, frame) {
  const S = SHOTS[shot];
  if (!S) { e.warn(`closeups: no shot "${shot}"`); return; }
  const { k, ax, ay, to } = frameOf(e, frame);
  const C = {
    e,
    // a layer of the shot, painted in the shot's units: what it turns about, the box its paint fits in (none: the
    // frame's), the engine's own motion of it (flicker, shimmer, blend)
    layer(name, pivot, box, fn, opts) {
      e.layer(name, { ...opts, pivot: to(...pivot), ...(box && { box: [...to(box[0], box[1]), ...to(box[2], box[3])] }) }, (g2) => {
        g2.translate(ax, ay);
        g2.scale(k, k);
        fn(g2);
      });
    },
    // the canvas transform of the moment (translate, scale) already maps shot units to the stage: pass them as they are
    at: (x, y, name) => e.at(x, y, name),
    light: (x, y, r, colour, strength, name) => e.light(x, y, r, colour, strength, name),
  };
  g.save();
  g.translate(ax, ay);
  g.scale(k, k);
  S.paint(g, C);
  g.restore();
}

// live(e, shot, now, frame) — an insert's animate: nothing painted, the layers moved and the moving points marked. now:
// scrap { taken }, hold { grip: [four] }, cellar { dust }, ropes { climb, left, right, roll, slip }, boat { reach }
function live(e, shot, now, frame) {
  const S = SHOTS[shot];
  // (nothing of it to move while it is not painted — closed, or its layers not there yet)
  if (!S || !e.layer(S.first).scaleX) return;
  const { k, to } = frameOf(e, frame);
  S.live({
    e,
    // a layer moved (the shot's units), turned about its pivot (radians, clockwise), scaled about it, shown
    set(name, { x = 0, y = 0, rotate = 0, scale = 1, sx = scale, sy = scale, alpha = 1 }) {
      const h = e.layer(name);
      h.x = x * k;
      h.y = y * k;
      h.rotate = rotate;
      h.scaleX = sx;
      h.scaleY = sy;
      h.alpha = alpha;
    },
    at: (x, y, name) => e.at(...to(x, y), name),
  }, now);
}

return { paint, live };
