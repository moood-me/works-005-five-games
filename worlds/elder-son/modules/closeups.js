// The world's close-ups of hands and things: five shots for the inserts of “The Elder Son”'s scenes — `stove` (two
// frozen hands at the open stove door, the fire in it), `tea` (two faceted glasses in holders under the lamp, the
// kettle in a young hand over them), `box` (the silver snuffbox between an old hand and a young one on the oilcloth),
// `strap` (the rucksack's canvas strap: a thin hand pulling it up, a fist below holding on, the lit carriage door
// behind), `shawl` (from behind: Nina's shoulders in her knitted shawl, a coat held over them by its collar). No
// faces. The hand is “Scarlet Sails v3”'s (fingers, back and palm, a sleeve with its cuff) — here three of them: the
// young Busygin's, the old Sarafanov's (drier, darker, a knitted cardigan's sleeve), the thin Vasenka's (a quilted
// sleeve). Their light is painted: warm from the stove, the lamp, a window; cold from the snow.
//   paint(g, e, shot) is an insert's code: the shot painted once, each thing that moves a layer. live(e, shot, now) is
// its animate: `now` — what moves — only sets the layers' numbers and marks the points that move. The painting reads
// nothing of `now` (the shot `box` reads the key `box_mode`). closeups.md says how a scene uses it.
//   A shot's own units: the frame's height, the origin in the frame's middle (y down); the background is painted
// out to ±1.3 of the frame's height (21:9 whole), the hands, the things and the points within the middle 4:3.
const { clamp, span, ease, noise } = anim;
const TAU = 2 * Math.PI;
const clamp01 = (v) => clamp(Number(v) || 0, 0, 1);

// (colours: a module stands by itself — the same lamplight and scarlet as the world's nebo, the skins of its cast)
const rgbOf = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const blend = (a, b, u) => `#${rgbOf(a).map((v, i) => Math.round(v + (rgbOf(b)[i] - v) * u).toString(16).padStart(2, "0")).join("")}`;
const rgba = (c, a) => `rgba(${rgbOf(c).join(",")},${a})`;
const WARM = "#e8963a", LAMP = "#f1c587", FIRE = "#f08a32", NIGHT = "#1b2233", SNOW = "#e8eef5";
// the skins: Busygin's young (and cold: blue-red), Sarafanov's old, Vasenka's thin and pale
const SKIN = { bus: "#d9a789", cold: "#9a7886", sar: "#b98a6c", vas: "#dcb59c" };
const SILVER = { dark: "#5d5f63", mid: "#a9abaf", light: "#eef0f2" };
// the sleeves: Busygin's dark sweater, his coat; Sarafanov's knitted cardigan; Vasenka's quilted jacket
const SLEEVE = {
  sweater: { colour: "#323846", from: 0.22, cuff: "#3b4252", knit: true },
  coat: { colour: "#4f525a", from: 0.24 },
  cardigan: { colour: "#6e4f37", from: 0.2, cuff: "#7a5940", knit: true },
  quilted: { colour: "#3e4438", from: 0.22, quilt: true },
};

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
//   hands behind the wrist, cuff: a colour } or none: a bare arm; w — its width (a thin hand narrower); old — an old hand's veins;
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
  const [dx, dy] = turned([x * o.L, y * o.L * o.side * (o.w ?? 1)], o.angle);
  return [o.at[0] + dx, o.at[1] + dy];
};
// the middle of its palm; a finger's knuckle; a point along a finger (u of its length as it lies)
const palmOf = (o) => handPoint(o, [0.3, 0]);
const knuckleOf = (o, i) => handPoint(o, FINGERS[i].at);
const alongFinger = (o, i, u) => {
  const F = FINGERS[i], J = joints(F, o.curl[i], o.spread), end = J[3];
  return handPoint(o, [F.at[0] + (end[0] - F.at[0]) * u, F.at[1] + (end[1] - F.at[1]) * u]);
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
    // the back of the hand: its bones toward the knuckles, faintly; an old hand's veins and its dry skin
    for (const F of FINGERS) line(g, 0.2, F.at[1] * 0.45, F.at[0] - 0.08, F.at[1], 0.012, rgba(T.shade, o.old ? 0.3 : 0.16));
    if (o.old) {
      g.strokeStyle = rgba("#6f7f96", 0.28);
      g.lineWidth = 0.014;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(-0.02, 0.02); g.quadraticCurveTo(0.18, -0.02, 0.32, -0.1);
      g.moveTo(0.06, 0.05); g.quadraticCurveTo(0.22, 0.06, 0.36, 0.12);
      g.stroke();
      for (let i = 0; i < 9; i++) line(g, 0.08 + 0.04 * i, -0.18 + 0.03 * (i % 4), 0.1 + 0.04 * i, -0.15 + 0.03 * (i % 4), 0.005, rgba(T.edge, 0.25));
    }
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
  // a knitted sleeve: its ribs along the arm; a quilted one: its stitched rings round it, each pad catching the light
  if (s.knit) for (let k = -3; k <= 3; k++) line(g, -o.arm, k * 0.09, -s.from - 0.08, k * 0.07, 0.014, rgba("#000000", 0.13));
  if (s.quilt) {
    for (let x = -s.from - 0.18; x > -o.arm; x -= 0.2) {
      const w = 0.25 + (0.33 - 0.25) * Math.min(1, (-x - s.from) / (o.arm - s.from));
      line(g, x, -w, x, w, 0.012, rgba("#10120e", 0.5));
      line(g, x - 0.04, -w * 0.9, x - 0.04, w * 0.9, 0.05, rgba("#ffffff", 0.05));
    }
  }
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
  g.scale(o.L, o.L * o.side * (o.w ?? 1));
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

// ── a shot's frame and its pieces ──
// A shot is painted in its own units: the frame's height, the origin in the frame's middle, y down — x ±0.89 on
// 16:9, ±0.667 the middle 4:3. Its background runs out to ±W (21:9 is ±1.17) and ±H.
const W = 1.3, H = 0.62;
const BASE = ["arm", "palm", "thumb"], FOUR = [0, 1, 2, 3];
const add2 = (p, q) => [p[0] + q[0], p[1] + q[1]];
// the box round some points, a margin about them
function around(pts, m) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) + m, Math.max(...ys) + m];
}
// a finger's joints in the shot, its tip; a hand placed so that a point of it (its own units) — or a finger's tip —
// is at a target
const fingerPts = (o, i) => joints(FINGERS[i], o.curl[i], o.spread).map(([x, y]) => handPoint(o, [x, y]));
const tipOf = (o, i) => fingerPts(o, i)[3];
const placed = (o, p, target) => { const q = handPoint({ ...o, at: [0, 0] }, p); return { ...o, at: [target[0] - q[0], target[1] - q[1]] }; };
const aimed = (o, i, target) => { const q = tipOf({ ...o, at: [0, 0] }, i); return { ...o, at: [target[0] - q[0], target[1] - q[1]] }; };
// the box a hand's parts are painted in (its arm the whole of its length: out of the frame)
function handBox(o, parts = WHOLE) {
  const pts = [];
  if (parts.some((p) => BASE.includes(p))) pts.push(...[[-o.arm, -0.36], [-o.arm, 0.36], [0.6, -0.3], [0.6, 0.3], [0.52, -0.62], [-0.1, -0.5], [0.52, 0.62], [-0.1, 0.5]].map((p) => handPoint(o, p)));
  for (const i of FOUR) if (parts.includes(`f${i}`)) pts.push(...fingerPts(o, i));
  return around(pts, 0.035);
}
// a rounded rectangle's path
function rounded(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
// rime: white needles of frost about a point (a knuckle, a fingertip)
function rime(g, rnd, x, y, r, n) {
  g.lineCap = "round";
  for (let k = 0; k < n; k++) {
    const a = rnd() * TAU, d = r * Math.sqrt(rnd()), px = x + d * Math.cos(a), py = y + d * Math.sin(a);
    const s = r * (0.14 + 0.22 * rnd()), b = rnd() * TAU;
    g.strokeStyle = `rgba(232,242,255,${(0.55 + 0.4 * rnd()).toFixed(2)})`;
    g.lineWidth = s * 0.28;
    g.beginPath();
    for (let j = 0; j < 3; j++) {
      const c = b + (j * Math.PI) / 3;
      g.moveTo(px - s * Math.cos(c), py - s * Math.sin(c));
      g.lineTo(px + s * Math.cos(c), py + s * Math.sin(c));
    }
    g.stroke();
  }
}
// flakes of snow for a layer that drifts over the whole frame (its box ±W, ±H): a flake crossing an edge is painted
// again a box's width or height away, as the layer wraps round its box
function flakes(g, rnd, n, [r0, r1], alpha) {
  const BW = 2 * W, BH = 2 * H;
  for (let k = 0; k < n; k++) {
    const x = -W + BW * rnd(), y = -H + BH * rnd(), r = r0 + (r1 - r0) * rnd() ** 2;
    g.fillStyle = `rgba(240,245,252,${(alpha * (0.5 + 0.5 * rnd())).toFixed(2)})`;
    const xs = [0], ys = [0];
    if (x - r < -W) xs.push(BW); else if (x + r > W) xs.push(-BW);
    if (y - r < -H) ys.push(BH); else if (y + r > H) ys.push(-BH);
    for (const dx of xs) for (const dy of ys) {
      g.beginPath();
      g.arc(x + dx, y + dy, r, 0, TAU);
      g.fill();
    }
  }
}
// the oilcloth on the table under the lamp: a pale ground, a faded check of red and green. `far` — the table's far
// edge (the room's dark above it), `vp` — the height its lines run away to (none: seen from above); the lamp's pool on
// it, the dark beyond the pool
function oilcloth(g, { lamp, far = -H, vp = null }) {
  g.fillStyle = "#1b1511";
  g.fillRect(-W, -H, 2 * W, 2 * H);
  g.fillStyle = "#ddd3ba";
  g.fillRect(-W, far, 2 * W, H - far);
  // (a point of the cloth at (u, v) — u across, v away: 1 at the frame's foot — is seen at (u / v, y(v)); from above,
  // at (u, H + 1 − v))
  const y = (v) => (vp == null ? H + 1 - v : vp + (H - vp) / v), x = (u, v) => (vp == null ? u : u / v);
  const vFar = vp == null ? 1 + H - far : (H - vp) / (far - vp), step = vp == null ? 0.17 : 0.09;
  const CHECK = [[-0.012, "rgba(176,82,70,0.42)", 0.006], [0.012, "rgba(176,82,70,0.42)", 0.006], [0.085, "rgba(96,128,90,0.32)", 0.004]];
  for (let k = -14; k <= 14; k++) for (const [d, colour, w] of CHECK) line(g, x(k * 0.17 + d, 1), y(1), x(k * 0.17 + d, vFar), y(vFar), w, colour);
  for (let v = 1; v < vFar; v += step) {
    for (const [d, colour, w] of CHECK) {
      const vv = v + (d * step) / 0.17;
      if (vv < vFar) line(g, -W, y(vv), W, y(vv), vp == null ? w : w / vv, colour);
    }
  }
  // its far edge: the cloth over it catching the lamp
  if (far > -H) {
    g.fillStyle = "rgba(255,236,200,0.35)";
    g.fillRect(-W, far, 2 * W, 0.006);
  }
  pool(g, lamp[0], lamp[1], 1.05, "#ffd08a", 0.38);
  const dark = g.createRadialGradient(lamp[0], lamp[1], 0.45, lamp[0], lamp[1], 1.75);
  dark.addColorStop(0, "rgba(14,9,6,0)");
  dark.addColorStop(1, "rgba(14,9,6,0.72)");
  g.fillStyle = dark;
  g.fillRect(-W, -H, 2 * W, 2 * H);
}

// ── stove ── the kitchen's night: the stove's whitewashed face, its firebox open, the fire in it; Busygin's two hands
// held up to it, the right crossed over the left's back — blue-red with the cold, the fingers curled, frost on the
// knuckles. Its keys: thaw (the frost melts, the skin warms, the fingers straighten), rub (the right slides over the
// left, up and down). Point hands#hands — where they cross.
const STOVE = (() => {
  const light = { dir: [0.1, -1], colour: "#ffc27a" };
  const mouth = { l: -0.3, r: 0.3, t: -0.47, b: -0.06 };
  const base = { ...HAND, L: 0.56, skin: SKIN.bus, sleeve: SLEEVE.coat, fine: true, spread: 0.35, curl: [0.12, 0.1, 0.12, 0.16], thumb: { angle: -0.6, curl: 0.25 } };
  const hands = {
    l: { ...base, at: [-0.13, 0.44], angle: -Math.PI / 2 + 0.22, side: -1 },
    r: { ...base, at: [0.06, 0.47], angle: -Math.PI / 2 - 0.42, side: 1 },
  };
  // (where their axes cross: over the knuckles)
  return { light, mouth, hands, cross: [-0.07, 0.18], rub: 0.05 };
})();
// tongues of fire over the logs in the firebox's mouth (two sets, `k` which: they breathe against each other)
function flames(g, rnd, M, k) {
  for (let i = 0; i < 7; i++) {
    const x = M.l + 0.05 + ((M.r - M.l - 0.1) * (i + 0.5 * k + 0.25 * rnd())) / 7, foot = M.b - 0.075;
    const h = 0.12 + 0.2 * rnd() * (i % 3 ? 1 : 0.7), w = 0.035 + 0.03 * rnd(), lean = (rnd() - 0.5) * 0.06;
    const gr = g.createLinearGradient(0, foot, 0, foot - h);
    gr.addColorStop(0, "rgba(255,236,170,0.95)");
    gr.addColorStop(0.35, "rgba(255,170,60,0.85)");
    gr.addColorStop(0.75, "rgba(230,90,30,0.5)");
    gr.addColorStop(1, "rgba(200,50,20,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(x - w, foot);
    g.quadraticCurveTo(x - w * 0.9, foot - h * 0.45, x + lean, foot - h);
    g.quadraticCurveTo(x + w * 0.9, foot - h * 0.45, x + w, foot);
    g.closePath();
    g.fill();
  }
}
function paintStove(g, C) {
  const P = STOVE, M = P.mouth, rnd = C.e.rnd;
  // the kitchen past the stove's corners: dark logs
  g.fillStyle = "#1c1410";
  g.fillRect(-W, -H, 2 * W, 2 * H);
  for (let y = -H; y < H; y += 0.13) line(g, -W, y, W, y, 0.008, "rgba(0,0,0,0.35)");
  // the stove's whitewashed face, warmed near its mouth, going dark toward its corners; cracks in the whitewash
  const face = g.createRadialGradient(0, -0.26, 0.08, 0, -0.26, 1.2);
  face.addColorStop(0, "#f4d6aa");
  face.addColorStop(0.3, "#d2bb98");
  face.addColorStop(0.7, "#7c6c5a");
  face.addColorStop(1, "#3e352d");
  g.fillStyle = face;
  g.fillRect(-1.02, -H, 2.04, 2 * H);
  for (const x of [-1.02, 1.02]) line(g, x, -H, x, H, 0.012, "rgba(20,14,10,0.6)");
  g.strokeStyle = "rgba(80,62,48,0.35)";
  g.lineWidth = 0.003;
  for (let i = 0; i < 16; i++) {
    let x = -0.95 + 1.9 * rnd(), y = -0.58 + 1.1 * rnd();
    if (x > M.l - 0.12 && x < M.r + 0.12 && y < M.b + 0.08) continue;
    g.beginPath();
    g.moveTo(x, y);
    for (let j = 0; j < 4; j++) { x += (rnd() - 0.5) * 0.06; y += 0.02 + 0.03 * rnd(); g.lineTo(x, y); }
    g.stroke();
  }
  // the iron frame of the mouth; the firebox inside, its back bricks glowing; the coals; two birch logs on them
  g.fillStyle = "#2b2420";
  g.fillRect(M.l - 0.05, M.t - 0.05, M.r - M.l + 0.1, M.b - M.t + 0.1);
  const inside = g.createLinearGradient(0, M.t, 0, M.b);
  inside.addColorStop(0, "#2a0f07");
  inside.addColorStop(0.6, "#6e260c");
  inside.addColorStop(1, "#b5501a");
  g.fillStyle = inside;
  g.fillRect(M.l, M.t, M.r - M.l, M.b - M.t);
  for (let y = M.t + 0.05; y < M.b - 0.08; y += 0.06) line(g, M.l, y, M.r, y, 0.004, "rgba(20,6,2,0.35)");
  oval(g, 0, M.b - 0.03, (M.r - M.l) * 0.48, 0.035, 0, "#ff9a3c");
  for (let i = 0; i < 14; i++) oval(g, M.l + 0.03 + (M.r - M.l - 0.06) * rnd(), M.b - 0.02 - 0.03 * rnd(), 0.012 + 0.01 * rnd(), 0.008, 0, rnd() < 0.5 ? "#ffd27a" : "#e2601c");
  for (const [y, a] of [[M.b - 0.075, -0.06], [M.b - 0.12, 0.08]]) {
    g.save();
    g.translate(0, y);
    g.rotate(a);
    g.fillStyle = "#e9e2d2";
    g.fillRect(-0.26, -0.026, 0.52, 0.052);
    g.fillStyle = "rgba(30,26,24,0.8)";
    for (let i = 0; i < 9; i++) g.fillRect(-0.24 + 0.055 * i + 0.02 * rnd(), -0.026 + 0.03 * rnd(), 0.018, 0.008);
    g.fillStyle = "rgba(40,16,8,0.75)";
    g.fillRect(-0.26, 0.004, 0.52, 0.022);
    g.restore();
  }
  // the hearth's iron plate under the mouth
  g.fillStyle = "#3a322c";
  g.fillRect(M.l - 0.12, M.b + 0.05, M.r - M.l + 0.24, 0.03);
  g.fillStyle = "rgba(255,180,110,0.4)";
  g.fillRect(M.l - 0.12, M.b + 0.05, M.r - M.l + 0.24, 0.005);
  // the door swung open on the left, its inside to the fire's light
  g.fillStyle = "#26201c";
  g.beginPath();
  g.moveTo(M.l - 0.05, M.t - 0.05);
  g.lineTo(M.l - 0.33, M.t - 0.1);
  g.lineTo(M.l - 0.33, M.b + 0.1);
  g.lineTo(M.l - 0.05, M.b + 0.05);
  g.closePath();
  g.fill();
  const lit = g.createLinearGradient(M.l - 0.05, 0, M.l - 0.33, 0);
  lit.addColorStop(0, "rgba(255,160,80,0.45)");
  lit.addColorStop(1, "rgba(255,160,80,0.05)");
  g.fillStyle = lit;
  g.fill();
  oval(g, M.l - 0.29, (M.t + M.b) / 2, 0.018, 0.03, 0, "#5a4c40");
  // the fire: its tongues, its light on the stove's face and on the hands
  C.layer("flames", [0, M.b], [M.l, M.t, M.r, M.b], (f) => flames(f, rnd, M, 0), { blend: "add", flicker: 0.35 });
  C.layer("flames2", [0, M.b], [M.l, M.t, M.r, M.b], (f) => flames(f, rnd, M, 1), { blend: "add", flicker: 0.35, shimmer: 0.3 });
  C.layer("glow", [0, -0.25], [-1.0, -H, 1.0, H], (f) => pool(f, 0, -0.22, 0.95, "#ff9a40", 0.3), { blend: "add" });
  // the hands: each part warm, and over it the same part cold and rimed, which the thaw fades away
  for (const s of ["l", "r"]) {
    const o = P.hands[s], cold = { ...o, skin: SKIN.cold };
    C.layer(`${s}_hand`, o.at, handBox(o, BASE), (l) => hand(l, { ...o, parts: BASE }, P.light));
    C.layer(`${s}_cold`, o.at, handBox(o, BASE), (l) => {
      hand(l, { ...cold, parts: BASE }, P.light);
      for (const i of FOUR) rime(l, rnd, ...knuckleOf(o, i), 0.025, 7);
      rime(l, rnd, ...handPoint(o, [0.28, 0]), 0.06, 8);
    });
    for (const i of FOUR) {
      const k = knuckleOf(o, i), box = handBox(o, [`f${i}`]);
      C.layer(`${s}_f${i}`, k, box, (l) => hand(l, { ...o, parts: [`f${i}`] }, P.light));
      C.layer(`${s}_fc${i}`, k, box, (l) => {
        hand(l, { ...cold, parts: [`f${i}`] }, P.light);
        for (const u of [0.42, 0.72, 0.97]) rime(l, rnd, ...alongFinger(o, i, u), 0.02, 4);
      });
    }
  }
}
function liveStove(L, now) {
  const P = STOVE, e = L.e, t = e.t, m = e.mem;
  const thaw = clamp01(now.thaw), rub = clamp(Number(now.rub) || 0, -1, 1);
  // (the right hand goes the way the finger goes, and settles as it stops)
  m.rub = (m.rub ?? 0) + (rub - (m.rub ?? 0)) * Math.min(1, e.dt * 10);
  const shrink = 0.66 + 0.34 * ease.inOut(thaw), cold = 1 - ease.inOut(span(thaw, 0, 0.9)), shiver = 0.0035 * cold;
  for (const s of ["l", "r"]) {
    const o = P.hands[s], k = s === "l" ? 1 : 3, slide = s === "r" ? P.rub * m.rub : 0;
    const x = slide * Math.cos(o.angle) + shiver * noise(t * 7, k) + 0.002 * noise(t * 0.5, k + 10);
    const y = slide * Math.sin(o.angle) + shiver * noise(t * 6, k + 1) + 0.002 * noise(t * 0.4, k + 11);
    L.set(`${s}_hand`, { x, y });
    L.set(`${s}_cold`, { x, y, alpha: cold });
    for (const i of FOUR) {
      L.set(`${s}_f${i}`, { x, y, sy: shrink });
      L.set(`${s}_fc${i}`, { x, y, sy: shrink, alpha: cold });
    }
  }
  L.set("flames", { alpha: 0.75 + 0.25 * noise(t * 1.7, 5) });
  L.set("flames2", { alpha: 0.6 + 0.4 * noise(t * 2.3, 6), sy: 1 + 0.06 * noise(t * 1.3, 7) });
  L.set("glow", { alpha: 0.85 + 0.15 * noise(t * 1.1, 8) });
  const half = 0.5 * P.rub * m.rub, a = P.hands.r.angle, at = [P.cross[0] + half * Math.cos(a), P.cross[1] + half * Math.sin(a)];
  L.at(...at, "hands");
  L.at(...at);
}

// ── tea ── the oilcloth under the lamp, the room's dark beyond the table; two faceted glasses in nickel holders; above
// them the enamel kettle in Busygin's hand (the sweater's sleeve), tipped, its spout over the first glass. Its keys:
// which (the spout over the first → over the second), pour (the stream), glass1, glass2 (the tea's level), spill (tea
// over the brim of the glass the spout is over, a puddle on the oilcloth), shake (the spout trembles, the stream
// wavers). Points tea#glass1, tea#glass2 — the glasses' brims; tea — the spout.
const TEA = (() => {
  const light = { dir: [0.15, -1], colour: LAMP };
  const G = { xs: [-0.24, 0.24], top: -0.06, bottom: 0.25, rt: 0.088, rb: 0.074, band: 0.034 };
  // the spout's tip over the first glass; the kettle tipped to pour, the spout's tip in its own upright units
  const S = [-0.222, -0.2], tilt = -0.45, T = [-0.27, -0.07];
  const grip = placed({ ...HAND, L: 0.34, skin: SKIN.bus, sleeve: SLEEVE.sweater, fine: true, view: "back", side: -1, angle: Math.PI - 0.15, curl: [0.95, 1.0, 1.0, 0.95], spread: 0.1, thumb: { angle: -0.4, curl: 0.5 } }, [0.55, 0], [0.215, -0.01]);
  return { light, lamp: [0.05, -0.42], far: -0.3, vp: -1.6, G, S, tilt, T, grip, travel: 0.48 };
})();
// a point of the kettle (its upright units) where it is painted, tipped, its spout over the first glass
const kettleAt = (p) => { const [x, y] = turned([p[0] - TEA.T[0], p[1] - TEA.T[1]], TEA.tilt); return [TEA.S[0] + x, TEA.S[1] + y]; };
// the kettle in its own units: the body's middle at (0, 0), upright, the spout to the left, the handle to the right
function kettle(g, rnd) {
  const BLUE = "#2c3a5c";
  g.lineCap = "round";
  g.strokeStyle = BLUE;
  g.lineWidth = 0.028;
  g.beginPath();
  g.moveTo(0.1, -0.085);
  g.bezierCurveTo(0.27, -0.12, 0.28, 0.06, 0.15, 0.055);
  g.stroke();
  // the spout
  g.beginPath();
  g.moveTo(-0.11, 0);
  g.quadraticCurveTo(-0.2, -0.02, -0.268, -0.086);
  g.lineTo(-0.274, -0.056);
  g.quadraticCurveTo(-0.2, 0.025, -0.12, 0.062);
  g.closePath();
  g.fillStyle = "#ddd6c6";
  g.fill();
  g.strokeStyle = "#5d5446";
  g.lineWidth = 0.004;
  g.stroke();
  oval(g, -0.271, -0.071, 0.008, 0.016, -0.6, BLUE);
  // the body: a low pear of off-white enamel, lit from above
  g.beginPath();
  g.moveTo(-0.075, -0.1);
  g.bezierCurveTo(-0.16, -0.08, -0.18, 0.03, -0.15, 0.085);
  g.lineTo(0.15, 0.085);
  g.bezierCurveTo(0.18, 0.03, 0.16, -0.08, 0.075, -0.1);
  g.closePath();
  const gr = g.createLinearGradient(-0.12, -0.12, 0.14, 0.1);
  gr.addColorStop(0, "#f5f0e4");
  gr.addColorStop(0.5, "#d3cab6");
  gr.addColorStop(1, "#8a806f");
  g.fillStyle = gr;
  g.fill();
  g.stroke();
  // its blue foot, its lid with the knob
  rounded(g, -0.152, 0.06, 0.304, 0.026, 0.01);
  g.fillStyle = BLUE;
  g.fill();
  oval(g, 0, -0.1, 0.08, 0.02, 0, "#e8e2d4");
  g.strokeStyle = BLUE;
  g.lineWidth = 0.006;
  g.beginPath();
  g.ellipse(0, -0.1, 0.08, 0.02, 0, 0, TAU);
  g.stroke();
  oval(g, 0, -0.123, 0.022, 0.015, 0, BLUE);
  // a painted rose on its side, the enamel chipped
  for (let i = 0; i < 5; i++) oval(g, -0.03 + 0.016 * Math.cos((i * TAU) / 5), 0.015 + 0.016 * Math.sin((i * TAU) / 5), 0.014, 0.009, (i * TAU) / 5, "#b8432c");
  oval(g, -0.03, 0.015, 0.009, 0.009, 0, "#e0a03a");
  oval(g, -0.065, 0.035, 0.016, 0.006, 0.5, "#5f7d4c");
  oval(g, 0.005, 0.04, 0.016, 0.006, -0.5, "#5f7d4c");
  for (let i = 0; i < 4; i++) oval(g, -0.12 + 0.24 * rnd(), -0.06 + 0.12 * rnd(), 0.006 + 0.005 * rnd(), 0.004, rnd() * 3, "rgba(40,30,25,0.7)");
  // the lamp on its shoulder
  oval(g, -0.05, -0.065, 0.05, 0.017, -0.35, "rgba(255,250,235,0.6)");
}
// the tea in a glass, full to the brim (the layer's height is its level)
function teaIn(g, x) {
  const G = TEA.G, t = G.top + 0.008, b = G.bottom - 0.016, rt = G.rt - 0.009, rb = G.rb - 0.009;
  g.beginPath();
  g.moveTo(x - rt, t);
  g.lineTo(x + rt, t);
  g.lineTo(x + rb, b);
  g.lineTo(x - rb, b);
  g.closePath();
  const gr = g.createLinearGradient(x - rt, 0, x + rt, 0);
  gr.addColorStop(0, "#d9862e");
  gr.addColorStop(0.35, "#a8521a");
  gr.addColorStop(1, "#5e2a0c");
  g.fillStyle = gr;
  g.fill();
  oval(g, x, t, rt, 0.013, 0, "#c8783a");
  oval(g, x - rt * 0.35, t - 0.002, rt * 0.4, 0.005, 0, "rgba(255,230,190,0.5)");
}
// a faceted glass: its faint body, the facets, the smooth band at its brim, its thick foot
function glassOf(g, x) {
  const { top: t, bottom: b, rt, rb, band } = TEA.G, at = (u, y) => x + u * (rt + ((rb - rt) * (y - t)) / (b - t));
  g.beginPath();
  g.moveTo(x - rt, t);
  g.lineTo(x + rt, t);
  g.lineTo(x + rb, b);
  g.lineTo(x - rb, b);
  g.closePath();
  g.fillStyle = "rgba(235,240,245,0.08)";
  g.fill();
  for (let k = 0; k <= 8; k++) {
    const u = -1 + k / 4, lit = k === 2 ? 0.5 : k === 0 || k === 8 ? 0.55 : 0.16;
    line(g, at(u, t + band), t + band, at(u, b), b, k % 8 ? 0.003 : 0.004, `rgba(245,248,252,${lit})`);
  }
  line(g, x - rt, t, x - rt + 0.001, t + band, 0.004, "rgba(245,248,252,0.55)");
  line(g, x + rt, t, x + rt - 0.001, t + band, 0.004, "rgba(245,248,252,0.45)");
  line(g, at(-1, t + band), t + band, at(1, t + band), t + band, 0.003, "rgba(245,248,252,0.3)");
  g.strokeStyle = "rgba(250,250,255,0.7)";
  g.lineWidth = 0.004;
  g.beginPath();
  g.ellipse(x, t, rt, 0.016, 0, 0, TAU);
  g.stroke();
  oval(g, x, b, rb, 0.012, 0, "rgba(220,230,235,0.35)");
}
// a nickel holder round the glass's lower part: its bands, its struts — the glass and the tea seen between them —,
// its foot, its handle on the glass's outer side (side −1, 1)
function holderOf(g, x, side) {
  const { top, bottom, rt, rb } = TEA.G, r = (y) => rt + ((rb - rt) * (y - top)) / (bottom - top) + 0.012;
  const t = 0.045, b = 0.262, foot = 0.29;
  const metal = (y0, y1) => { const gr = g.createLinearGradient(x - r(y0), 0, x + r(y0), 0); gr.addColorStop(0, "#5c5f64"); gr.addColorStop(0.25, "#eceef0"); gr.addColorStop(0.55, "#9fa2a7"); gr.addColorStop(1, "#3f4145"); return gr; };
  // the handle
  g.strokeStyle = "#8e9196";
  g.lineWidth = 0.016;
  g.beginPath();
  g.moveTo(x + side * r(t + 0.02), t + 0.02);
  g.bezierCurveTo(x + side * (r(t) + 0.09), t + 0.02, x + side * (r(b) + 0.09), b - 0.07, x + side * r(b - 0.05), b - 0.05);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.45)";
  g.lineWidth = 0.004;
  g.stroke();
  // the struts, a thin lattice between them
  for (const u of [-1, -0.36, 0.36, 1]) {
    g.beginPath();
    g.moveTo(x + u * r(t) - 0.011, t);
    g.lineTo(x + u * r(t) + 0.011, t);
    g.lineTo(x + u * r(b) + 0.011, b);
    g.lineTo(x + u * r(b) - 0.011, b);
    g.closePath();
    g.fillStyle = metal(t, b);
    g.fill();
  }
  g.strokeStyle = "rgba(190,193,198,0.75)";
  g.lineWidth = 0.003;
  for (const [u0, u1] of [[-1, -0.36], [-0.36, 0.36], [0.36, 1]]) {
    const m = (u0 + u1) / 2, ym = (t + b) / 2;
    g.beginPath();
    g.moveTo(x + m * r(t), t + 0.03);
    g.lineTo(x + u1 * r(ym) - 0.012, ym);
    g.lineTo(x + m * r(b), b - 0.045);
    g.lineTo(x + u0 * r(ym) + 0.012, ym);
    g.closePath();
    g.stroke();
  }
  // the bands, their pattern; the foot
  for (const [y0, y1] of [[t, t + 0.03], [b - 0.045, b]]) {
    g.beginPath();
    g.moveTo(x - r(y0), y0);
    g.lineTo(x + r(y0), y0);
    g.lineTo(x + r(y1), y1);
    g.lineTo(x - r(y1), y1);
    g.closePath();
    g.fillStyle = metal(y0, y1);
    g.fill();
    for (let k = -4; k <= 4; k++) oval(g, x + (k / 4.6) * r(y0), (y0 + y1) / 2, 0.006, 0.004, 0, "rgba(50,52,56,0.45)");
  }
  g.beginPath();
  g.moveTo(x - r(b), b);
  g.lineTo(x + r(b), b);
  g.lineTo(x + r(b) + 0.018, foot);
  g.lineTo(x - r(b) - 0.018, foot);
  g.closePath();
  g.fillStyle = metal(b, foot);
  g.fill();
  oval(g, x, foot + 0.006, r(b) + 0.03, 0.01, 0, "rgba(30,18,10,0.35)");
}
// tea run over the brim and down the glass and its holder; the puddle it makes on the oilcloth
function runOf(g, x) {
  const { top, rt } = TEA.G;
  g.strokeStyle = "rgba(150,72,22,0.85)";
  g.lineCap = "round";
  for (const [u, w, end] of [[-0.55, 0.008, 0.28], [-0.1, 0.006, 0.2], [0.35, 0.007, 0.25]]) {
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(x + u * rt, top + 0.004);
    for (let y = top + 0.03; y <= end; y += 0.03) g.lineTo(x + u * rt * (1.02 + 0.06 * Math.sin(y * 60 + u * 9)), y);
    g.stroke();
    oval(g, x + u * rt * 1.02, end + 0.004, w * 0.9, w * 1.2, 0, "rgba(150,72,22,0.9)");
  }
}
function puddleOf(g, [x, y]) {
  oval(g, x, y, 0.17, 0.042, 0, "rgba(140,66,20,0.85)");
  oval(g, x + 0.06, y + 0.012, 0.06, 0.018, 0.1, "rgba(140,66,20,0.85)");
  oval(g, x - 0.04, y - 0.01, 0.07, 0.009, 0, "rgba(255,226,180,0.4)");
}
// the stream from the spout down into the glass
function streamOf(g, [x, y], to) {
  const gr = g.createLinearGradient(0, y, 0, to);
  gr.addColorStop(0, "rgba(196,112,40,0.95)");
  gr.addColorStop(1, "rgba(160,80,26,0.7)");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x - 0.009, y);
  g.quadraticCurveTo(x - 0.01, y + 0.05, x - 0.004, to);
  g.lineTo(x + 0.004, to);
  g.quadraticCurveTo(x + 0.008, y + 0.05, x + 0.008, y);
  g.closePath();
  g.fill();
  line(g, x - 0.003, y + 0.01, x - 0.001, to - 0.02, 0.002, "rgba(255,230,190,0.6)");
}
function paintTea(g, C) {
  const P = TEA, G = P.G, rnd = C.e.rnd;
  oilcloth(g, { lamp: P.lamp, far: P.far, vp: P.vp });
  G.xs.forEach((x, i) => C.at(x, G.top, `glass${i + 1}`));
  // the puddles under the glasses (spread as the tea runs over), the tea in them, the stream
  G.xs.forEach((x, i) => {
    const c = [x + (i ? 0.05 : -0.05), 0.31];
    C.layer(`puddle${i + 1}`, c, [c[0] - 0.2, c[1] - 0.06, c[0] + 0.2, c[1] + 0.06], (l) => puddleOf(l, c));
    C.layer(`tea${i + 1}`, [x, G.bottom - 0.016], [x - G.rt, G.top - 0.02, x + G.rt, G.bottom], (l) => teaIn(l, x));
  });
  C.layer("stream", P.S, [P.S[0] - 0.03, P.S[1] - 0.01, P.S[0] + 0.03, G.bottom - 0.02], (l) => streamOf(l, P.S, G.bottom - 0.03));
  // the glasses in their holders; the tea run over them
  C.layer("glasses", [0, 0.1], [-W, G.top - 0.03, W, 0.32], (l) => G.xs.forEach((x, i) => { glassOf(l, x); holderOf(l, x, i ? 1 : -1); }));
  G.xs.forEach((x, i) => C.layer(`run${i + 1}`, [x, 0.1], [x - G.rt - 0.03, G.top - 0.01, x + G.rt + 0.03, 0.3], (l) => runOf(l, x)));
  // the kettle in his hand, the spout its point
  const lit = { ...P.light, dir: turned(P.light.dir, -P.tilt) };
  const box = around([[-0.3, -0.16], [0.3, -0.16], [0.3, 0.1], [-0.3, 0.1], ...(([l, t, r, b]) => [[l, t], [r, t], [r, b], [l, b]])(handBox(P.grip))].map(kettleAt), 0.03);
  C.layer("kettle", P.S, box, (l) => {
    l.save();
    l.translate(...P.S);
    l.rotate(P.tilt);
    l.translate(-P.T[0], -P.T[1]);
    kettle(l, rnd);
    hand(l, P.grip, lit);
    l.restore();
    C.at(...P.S);
  });
}
function liveTea(L, now) {
  const P = TEA, e = L.e, t = e.t, m = e.mem, k = Math.min(1, e.dt * 7);
  const which = clamp01(now.which);
  m.pour = (m.pour ?? 0) + (clamp01(now.pour) - (m.pour ?? 0)) * k;
  m.shake = (m.shake ?? 0) + (clamp01(now.shake) - (m.shake ?? 0)) * k;
  // the kettle carried from glass to glass, lifted a little between; tipped further while it pours; trembling
  const x = P.travel * which + 0.008 * m.shake * noise(t * 11, 2), y = -0.06 * Math.sin(Math.PI * which) + 0.002 * noise(t * 0.5, 4);
  const tremble = 0.04 * m.shake * noise(t * 13, 1);
  L.set("kettle", { x, y, rotate: -0.07 * m.pour + tremble });
  L.set("stream", { x, y, rotate: 0.6 * tremble + 0.05 * m.shake * noise(t * 9, 3), sy: Math.max(0.02, m.pour), alpha: Math.min(1, 1.5 * m.pour) });
  // the levels; tea over the brim of the glass the kettle is over while `spill` is on: it runs down, the puddle spreads
  const spill = clamp01(now.spill) >= 0.5;
  m.wet ??= [0, 0];
  [now.glass1, now.glass2].forEach((v, i) => {
    const level = clamp01(v);
    L.set(`tea${i + 1}`, { sy: Math.max(0.001, level), alpha: level > 0.003 ? 1 : 0 });
    if (!spill) m.wet[i] = 0;
    else if (m.wet[i] > 0 || (level >= 0.99 && Math.abs(which - i) < 0.5)) m.wet[i] = Math.min(1, m.wet[i] + Math.max(e.dt, 1e-3) / 3.5);
    L.set(`run${i + 1}`, { alpha: Math.min(1, 4 * m.wet[i]) });
    L.set(`puddle${i + 1}`, { scale: 0.2 + 0.8 * ease.out(m.wet[i]), alpha: Math.min(1, 5 * m.wet[i]) });
  });
}

// ── box ── the oilcloth under the lamp, seen from above; the silver snuffbox with its worn pattern between Sarafanov's
// old hand (the cardigan's sleeve) and Busygin's young one (the sweater's). By the key box_mode (painting):
// take — the young palm up from the right, the snuffbox on it, the old hand from above still on its lid; keys finger
// [4] (the young fingers close on it, each drawn in and bent over), old (1 → 0: the old hand goes, up out of the shot).
// give — the young hand palm down on the right, its fingertips at the snuffbox; the old palm up on the left; keys push
// (the snuffbox slides over the oilcloth to the old palm), old_close (the old fingers close on it).
// Points box#finger1…4 — the young fingertips, the forefinger first (top to bottom); box#box — the snuffbox (moves
// with push); box#old — the old palm (moves with old).
const BOX = (() => {
  const light = { dir: [0.25, -1], colour: LAMP };
  const young = { ...HAND, L: 0.72, skin: SKIN.bus, sleeve: SLEEVE.sweater, fine: true, view: "palm", side: -1, at: [0.66, 0.08], angle: Math.PI + 0.1, spread: 1.65, curl: [0.06, 0.05, 0.07, 0.1], thumb: { angle: -0.95, curl: 0.15 } };
  const closed = { ...young, curl: [1.25, 1.3, 1.3, 1.22], spread: 0.3 };
  const box = palmOf(young);
  const oldTake = aimed({ ...HAND, L: 0.56, skin: SKIN.sar, sleeve: SLEEVE.cardigan, old: true, fine: true, view: "back", side: 1, angle: Math.PI / 2 - 0.3, curl: [0.3, 0.25, 0.3, 0.38], spread: 0.35, thumb: { angle: -0.7, curl: 0.2 } }, 1, [box[0] + 0.01, box[1] - 0.04]);
  const youngGive = { ...HAND, L: 0.52, skin: SKIN.bus, sleeve: SLEEVE.sweater, fine: true, view: "back", side: 1, at: [0.8, 0.12], angle: Math.PI + 0.06, spread: 0.4, curl: [0.25, 0.2, 0.25, 0.3], thumb: { angle: -0.7, curl: 0.2 } };
  const oldGive = { ...HAND, L: 0.56, skin: SKIN.sar, sleeve: SLEEVE.cardigan, old: true, fine: true, view: "palm", side: 1, at: [-0.66, 0.06], angle: -0.08, spread: 0.5, curl: [0.12, 0.1, 0.12, 0.16], thumb: { angle: -0.8, curl: 0.2 } };
  const oldClosed = { ...oldGive, curl: [1.2, 1.25, 1.25, 1.2], spread: 0.25 };
  const from = add2(tipOf(youngGive, 1), [-0.13, -0.005]), to = palmOf(oldGive);
  return { light, lamp: [-0.1, -0.5], size: [0.23, 0.155], young, closed, box, oldTake, youngGive, oldGive, oldClosed, from, to };
})();
// the snuffbox at (x, y), turned: its shadow, its side, its lid — the engraving rubbed away in the middle — and its hinge
function snuffbox(g, [x, y], turn, [w, h]) {
  g.save();
  g.translate(x, y);
  g.rotate(turn);
  oval(g, 0.014, 0.028, w * 0.56, h * 0.62, 0, "rgba(28,16,8,0.4)");
  rounded(g, -w / 2, -h / 2 + 0.014, w, h, 0.04);
  g.fillStyle = SILVER.dark;
  g.fill();
  rounded(g, -w / 2, -h / 2, w, h, 0.04);
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  gr.addColorStop(0, SILVER.light);
  gr.addColorStop(0.45, SILVER.mid);
  gr.addColorStop(1, "#6d6f74");
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = "rgba(50,50,55,0.6)";
  g.lineWidth = 0.003;
  g.stroke();
  rounded(g, -w / 2 + 0.014, -h / 2 + 0.014, w - 0.028, h - 0.028, 0.028);
  g.strokeStyle = "rgba(60,60,66,0.4)";
  g.lineWidth = 0.0025;
  g.stroke();
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    g.beginPath();
    g.arc(sx * (w / 2 - 0.04), sy * (h / 2 - 0.035), 0.016, 0, 4.5);
    g.stroke();
  }
  for (let i = 0; i < 8; i++) oval(g, 0.026 * Math.cos((i * TAU) / 8), 0.026 * Math.sin((i * TAU) / 8), 0.016, 0.006, (i * TAU) / 8, "rgba(70,70,76,0.22)");
  oval(g, 0, 0, 0.036, 0.026, 0, "rgba(255,255,255,0.16)");
  line(g, -w * 0.32, -h / 2 + 0.006, w * 0.32, -h / 2 + 0.006, 0.004, "rgba(40,40,44,0.55)");
  glint(g, -w * 0.28, -h * 0.26, 0.022, "#fff6e0");
  g.restore();
}
function paintBox(g, C) {
  const P = BOX, give = C.e.state.box_mode === "give";
  oilcloth(g, { lamp: P.lamp });
  // a hand's shadow on the oilcloth: its shape in one dark colour (the layer's alpha makes it a shadow)
  const shadow = (name, o, parts, d) => { const s = { ...o, at: add2(o.at, d), parts, flat: "#24160e" }; C.layer(name, o.at, handBox(s, parts), (l) => hand(l, s, P.light)); };
  const fingers = (name, o, i, more) => C.layer(name, knuckleOf(o, i), handBox(o, [`f${i}`]), (l) => { hand(l, { ...o, parts: [`f${i}`] }, P.light); more?.(l); });
  const theBox = (at) => C.layer("box", at, around([at], 0.17), (l) => { snuffbox(l, at, -0.12, P.size); C.at(...at, "box"); C.at(...at); });
  if (!give) {
    shadow("young_sh", P.young, BASE, [0.012, 0.02]);
    C.layer("young", P.young.at, handBox(P.young, BASE), (l) => hand(l, { ...P.young, parts: BASE }, P.light));
    for (const i of FOUR) fingers(`young_f${i + 1}`, P.young, i, () => C.at(...tipOf(P.young, i), `finger${i + 1}`));
    theBox(P.box);
    for (const i of FOUR) fingers(`young_c${i + 1}`, P.closed, i);
    shadow("old_sh", P.oldTake, WHOLE, [0.035, 0.05]);
    C.layer("old", P.oldTake.at, handBox(P.oldTake), (l) => { hand(l, P.oldTake, P.light); C.at(...palmOf(P.oldTake), "old"); });
  } else {
    shadow("old_sh", P.oldGive, BASE, [0.012, 0.02]);
    C.layer("old", P.oldGive.at, handBox(P.oldGive, BASE), (l) => { hand(l, { ...P.oldGive, parts: BASE }, P.light); C.at(...P.to, "old"); });
    for (const i of FOUR) fingers(`old_f${i + 1}`, P.oldGive, i);
    shadow("young_sh", P.youngGive, WHOLE, [0.012, 0.02]);
    C.layer("young", P.youngGive.at, handBox(P.youngGive), (l) => { hand(l, P.youngGive, P.light); for (const i of FOUR) C.at(...tipOf(P.youngGive, i), `finger${i + 1}`); });
    theBox(P.from);
    for (const i of FOUR) fingers(`old_c${i + 1}`, P.oldClosed, i);
  }
}
function liveBox(L, now) {
  const P = BOX, e = L.e, t = e.t;
  // a finger closing: the straight one drawn in toward its knuckle and gone, the bent one come over the palm
  const close = (open, shut, v) => {
    L.set(open, { sx: 1 - 0.6 * ease.inOut(span(v, 0, 0.6)), alpha: 1 - span(v, 0.35, 0.65) });
    L.set(shut, { sx: 0.45 + 0.55 * ease.out(span(v, 0.35, 1)), alpha: span(v, 0.35, 0.65) });
  };
  if (e.state.box_mode !== "give") {
    const f = Array.isArray(now.finger) ? now.finger : [];
    for (const i of FOUR) close(`young_f${i + 1}`, `young_c${i + 1}`, clamp01(f[i]));
    const u = ease.inOut(1 - clamp01(now.old ?? 1)), x = -0.32 * u + 0.003 * noise(t * 0.5, 1), y = -0.72 * u + 0.003 * noise(t * 0.4, 2);
    L.set("old", { x, y, rotate: -0.15 * u });
    L.set("old_sh", { x, y, rotate: -0.15 * u, alpha: 0.3 });
    L.set("young_sh", { alpha: 0.3 });
  } else {
    const push = clamp01(now.push), d = [P.to[0] - P.from[0], P.to[1] - P.from[1]], k = Math.min(push, 0.3);
    L.set("box", { x: d[0] * push, y: d[1] * push, rotate: 0.1 * push });
    L.set("young", { x: d[0] * k, y: d[1] * k });
    L.set("young_sh", { x: d[0] * k, y: d[1] * k, alpha: 0.3 });
    L.set("old_sh", { alpha: 0.3 });
    const c = clamp01(now.old_close);
    for (const i of FOUR) close(`old_f${i + 1}`, `old_c${i + 1}`, span(c, 0.1 * i, 0.6 + 0.1 * i));
  }
}

// ── strap ── night at the platform: the carriage's green side, its door open, the vestibule lit behind; snow. The
// rucksack's canvas strap runs down the shot: Vasenka's thin hand (the quilted sleeve) pulls it up from the left,
// lower Busygin's fist (the coat's sleeve) holds it. Its keys: pull (the strap creeps up out of the fist: at 1 its
// end is out of it), grip (1 the fist clenched, 0 open), door_bg (the door's leaves slide shut behind them, the
// doorway's light goes). Point strap#grip — the fist.
const STRAP = (() => {
  const light = { dir: [-0.45, -0.9], colour: "#f4e4c4" };
  const door = { l: -0.52, r: 0.02, t: -0.7, b: 0.36 };
  const top = [0.02, -0.95], end = [0.085, 0.4];
  // the strap's middle at the height y
  const on = (y) => [top[0] + ((end[0] - top[0]) * (y - top[1])) / (end[1] - top[1]), y];
  const fist = placed({ ...HAND, L: 0.46, skin: SKIN.bus, sleeve: SLEEVE.coat, fine: true, view: "back", side: 1, angle: Math.PI + 0.3, curl: [1.05, 1.1, 1.1, 1.05], spread: 0.08, thumb: { angle: -0.35, curl: 0.7 } }, [0.5, 0], on(0.14));
  const open = { ...fist, curl: [0.35, 0.3, 0.35, 0.42], spread: 0.25 };
  const vas = placed({ ...HAND, L: 0.42, w: 0.82, skin: SKIN.vas, sleeve: SLEEVE.quilted, fine: true, view: "back", side: -1, angle: 0.25, curl: [1.0, 1.05, 1.05, 1.0], spread: 0.06, thumb: { angle: -0.3, curl: 0.6 } }, [0.5, 0], on(-0.25));
  return { light, door, top, end, width: 0.078, rise: 0.44, fist, open, vas, grip: handPoint(fist, [0.32, 0]) };
})();
// the canvas strap from its top (out of the shot) down to its end: its weave, its stitched edges, its steel tip
function strapOf(g, P) {
  const [x0, y0] = P.top, [x1, y1] = P.end, len = Math.hypot(x1 - x0, y1 - y0), w = P.width;
  g.save();
  g.translate(x0, y0);
  g.rotate(Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  gr.addColorStop(0, "#9a9270");
  gr.addColorStop(0.5, "#7b7454");
  gr.addColorStop(1, "#4f4a35");
  g.fillStyle = gr;
  g.fillRect(-w / 2, 0, w, len);
  g.strokeStyle = "rgba(40,36,24,0.18)";
  g.lineWidth = 0.002;
  g.beginPath();
  for (let y = 0.006; y < len; y += 0.012) { g.moveTo(-w / 2, y); g.lineTo(w / 2, y); }
  g.stroke();
  g.fillStyle = "rgba(220,210,170,0.55)";
  for (let y = 0.01; y < len - 0.04; y += 0.022) for (const x of [-w * 0.37, w * 0.37]) g.fillRect(x - 0.002, y, 0.004, 0.012);
  g.fillStyle = "#8d9096";
  g.fillRect(-w / 2 - 0.003, len - 0.03, w + 0.006, 0.03);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-w / 2 - 0.003, len - 0.03, w + 0.006, 0.005);
  g.restore();
}
// a leaf of the carriage's door, from its hinge-less edge at x0: green steel, its window lit from inside
function doorLeaf(g, D, x0) {
  g.fillStyle = "#33503f";
  g.fillRect(x0, D.t, 0.27, D.b - D.t);
  g.fillStyle = "#1d2a22";
  g.fillRect(x0 + 0.045, D.t + 0.1, 0.18, 0.34);
  g.fillStyle = "#e8cf9a";
  g.fillRect(x0 + 0.055, D.t + 0.11, 0.16, 0.32);
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.fillRect(x0 + 0.055, D.t + 0.11, 0.05, 0.32);
  line(g, x0, D.t, x0, D.b, 0.008, "rgba(10,14,12,0.7)");
  line(g, x0 + 0.27, D.t, x0 + 0.27, D.b, 0.008, "rgba(10,14,12,0.7)");
}
function paintStrap(g, C) {
  const P = STRAP, D = P.door, rnd = C.e.rnd;
  // the night; the platform's snow below the carriage
  g.fillStyle = "#0e131c";
  g.fillRect(-W, -H, 2 * W, 2 * H);
  const snow = g.createLinearGradient(0, D.b + 0.06, 0, H);
  snow.addColorStop(0, "#9aa3b2");
  snow.addColorStop(1, "#cfd6e0");
  g.fillStyle = snow;
  g.fillRect(-W, D.b + 0.06, 2 * W, H - D.b);
  // the vestibule lit behind the open door: its lamp, its handrails, its ribbed floor
  const inside = g.createLinearGradient(0, D.t, 0, D.b);
  inside.addColorStop(0, "#f7ead0");
  inside.addColorStop(0.6, "#dcc496");
  inside.addColorStop(1, "#8e7652");
  g.fillStyle = inside;
  g.fillRect(D.l, D.t, D.r - D.l, D.b - D.t);
  g.fillStyle = "rgba(120,100,70,0.35)";
  g.fillRect((D.l + D.r) / 2 - 0.11, D.t, 0.22, D.b - D.t - 0.1);
  pool(g, (D.l + D.r) / 2, D.t + 0.12, 0.42, "#fff6de", 0.7);
  for (const x of [D.l + 0.05, D.r - 0.05]) { line(g, x, D.t, x, D.b - 0.08, 0.016, "#8f8a80"); line(g, x - 0.004, D.t, x - 0.004, D.b - 0.08, 0.004, "rgba(255,255,255,0.5)"); }
  g.fillStyle = "#6a5c4a";
  g.fillRect(D.l, D.b - 0.08, D.r - D.l, 0.08);
  for (let x = D.l + 0.02; x < D.r; x += 0.03) line(g, x, D.b - 0.075, x, D.b - 0.005, 0.006, "rgba(30,24,18,0.5)");
  // the door's leaves, open: in their pockets inside the wall; shut, over the doorway
  C.layer("leaf_l", [D.l - 0.135, 0], [D.l - 0.29, D.t - 0.01, D.l + 0.02, D.b + 0.01], (l) => doorLeaf(l, D, D.l - 0.27));
  C.layer("leaf_r", [D.r + 0.135, 0], [D.r - 0.02, D.t - 0.01, D.r + 0.29, D.b + 0.01], (l) => doorLeaf(l, D, D.r));
  // the carriage's side round the doorway: green steel, its lit windows on the right, the step under the door
  C.layer("wall", [0, 0], [-W, -H, W, D.b + 0.07], (l) => {
    l.beginPath();
    l.rect(-W, -H, 2 * W, D.b + 0.06 + H);
    l.rect(D.l, D.t, D.r - D.l, D.b - D.t);
    const gr = l.createLinearGradient(-W, 0, W, 0);
    gr.addColorStop(0, "#1f3329");
    gr.addColorStop(0.4, "#3b5a49");
    gr.addColorStop(1, "#1c2e25");
    l.fillStyle = gr;
    l.fill("evenodd");
    for (const y of [-0.58, 0.28]) line(l, -W, y, W, y, 0.006, "rgba(0,0,0,0.35)");
    for (let x = -W + 0.05; x < W; x += 0.09) if (x < D.l - 0.05 || x > D.r + 0.05) oval(l, x, 0.3, 0.004, 0.004, 0, "rgba(0,0,0,0.4)");
    l.strokeStyle = "#162219";
    l.lineWidth = 0.016;
    l.strokeRect(D.l - 0.008, D.t - 0.008, D.r - D.l + 0.016, D.b - D.t + 0.016);
    for (const x0 of [0.3, 0.86]) {
      l.fillStyle = "#121b16";
      l.fillRect(x0 - 0.01, -0.6, 0.42, 0.36);
      l.fillStyle = "#e6cb92";
      l.fillRect(x0, -0.59, 0.4, 0.34);
      l.fillStyle = "rgba(255,255,255,0.14)";
      l.fillRect(x0, -0.59, 0.12, 0.34);
      line(l, x0, -0.42, x0 + 0.4, -0.42, 0.01, "#121b16");
    }
    l.fillStyle = "#2a2d30";
    l.fillRect(D.l - 0.02, D.b, D.r - D.l + 0.04, 0.05);
    l.fillStyle = "rgba(230,236,244,0.85)";
    l.fillRect(D.l - 0.02, D.b, D.r - D.l + 0.04, 0.01);
    l.fillStyle = "#06080b";
    l.fillRect(-W, D.b + 0.05, 2 * W, 0.012);
  });
  // the doorway's light out over the snow and the air before it
  C.layer("spill", [(D.l + D.r) / 2, D.b], [-1.0, -H, 0.8, H], (l) => pool(l, (D.l + D.r) / 2, D.b + 0.02, 0.78, "#ffe2a8", 0.3), { blend: "add" });
  C.layer("snow_far", [0, 0], [-W, -H, W, H], (l) => flakes(l, rnd, 140, [0.002, 0.005], 0.55), { drift: [0.012, 0.05] });
  // the strap and the hands on it
  C.layer("strap", P.end, around([P.top, P.end], 0.06), (l) => strapOf(l, P));
  C.layer("vas", P.vas.at, handBox(P.vas), (l) => hand(l, P.vas, P.light));
  C.layer("fist", P.fist.at, handBox(P.fist, BASE), (l) => hand(l, { ...P.fist, parts: BASE }, P.light));
  C.layer("fist_c", P.fist.at, handBox(P.fist, ["f0", "f1", "f2", "f3"]), (l) => hand(l, { ...P.fist, parts: ["f0", "f1", "f2", "f3"] }, P.light));
  C.layer("fist_o", P.fist.at, handBox(P.open, ["f0", "f1", "f2", "f3"]), (l) => hand(l, { ...P.open, parts: ["f0", "f1", "f2", "f3"] }, P.light));
  C.layer("snow", [0, 0], [-W, -H, W, H], (l) => flakes(l, rnd, 70, [0.004, 0.011], 0.8), { drift: [0.025, 0.11] });
  C.at(...P.grip, "grip");
  C.at(...P.grip);
}
function liveStrap(L, now) {
  const P = STRAP, e = L.e, t = e.t, m = e.mem;
  const pull = clamp01(now.pull), door = ease.inOut(clamp01(now.door_bg)), grip = now.grip == null ? 1 : clamp01(now.grip);
  // (the fist closes and opens fast, but not in no time)
  m.grip = (m.grip ?? grip) + (grip - (m.grip ?? grip)) * Math.min(1, e.dt * 14);
  const up = -P.rise * pull + 0.004 * noise(t * 5, 1), dim = 1 - 0.3 * door, strain = 0.002 * m.grip * noise(t * 6, 3);
  L.set("strap", { y: up, brightness: dim });
  L.set("vas", { x: 0.003 * noise(t * 3, 2), y: up, brightness: dim });
  L.set("fist", { x: strain, brightness: dim });
  L.set("fist_c", { x: strain, alpha: m.grip, brightness: dim });
  L.set("fist_o", { x: strain, alpha: 1 - m.grip, brightness: dim });
  L.set("leaf_l", { x: 0.27 * door });
  L.set("leaf_r", { x: -0.27 * door });
  L.set("spill", { alpha: 1 - 0.85 * door });
}

// ── shawl ── night, from behind: Nina on the bench under the kitchen window — her hair, the plait, her shoulders in a
// knitted shawl, snow; the window up on the right, its warm light over her. Busygin's hands (the sweater's sleeves)
// hold his coat up by its collar. Its key: lay (the coat comes down onto her shoulders; from 0.8 it lies there and
// the hands let go). Points shawl#coat — the collar (moves with lay), shawl#shoulders — her shoulders, where it comes
// to lie.
const SHAWL = (() => {
  const light = { dir: [0.7, -0.7], colour: WARM };
  const neck = [0.02, -0.1], held = [-0.54, -0.3];
  const hand0 = { ...HAND, L: 0.3, skin: SKIN.bus, sleeve: SLEEVE.sweater, fine: true, view: "back", curl: [0.8, 0.85, 0.85, 0.8], spread: 0.15, thumb: { angle: -0.5, curl: 0.4 } };
  const hands = [
    placed({ ...hand0, side: -1, angle: -Math.PI / 2 + 0.25 }, [0.62, 0], add2(neck, [-0.21, 0.035])),
    placed({ ...hand0, side: 1, angle: -Math.PI / 2 - 0.25 }, [0.62, 0], add2(neck, [0.21, 0.035])),
  ];
  return { light, neck, held, hands };
})();
// Nina from behind, her neck's base at (x, y): the shawl over her shoulders, her hair drawn back into the plait
function nina(g, rnd, [x, y]) {
  g.beginPath();
  g.moveTo(x - 0.07, y - 0.04);
  g.quadraticCurveTo(x - 0.3, y - 0.02, x - 0.42, y + 0.1);
  g.lineTo(x - 0.47, y + 0.75);
  g.lineTo(x + 0.47, y + 0.75);
  g.lineTo(x + 0.42, y + 0.1);
  g.quadraticCurveTo(x + 0.3, y - 0.02, x + 0.07, y - 0.04);
  g.closePath();
  const wool = g.createLinearGradient(x + 0.4, y - 0.1, x - 0.4, y + 0.6);
  wool.addColorStop(0, "#f1e9db");
  wool.addColorStop(0.45, "#c3b9a9");
  wool.addColorStop(1, "#7a7166");
  g.fillStyle = wool;
  g.fill();
  // the knit: rows of small stitches, a band of red-brown diamonds; the fringe at its sides
  g.strokeStyle = "rgba(90,80,70,0.25)";
  g.lineWidth = 0.003;
  for (let yy = y + 0.01; yy < y + 0.72; yy += 0.028) {
    g.beginPath();
    for (let xx = x - 0.45; xx < x + 0.45; xx += 0.026) { g.moveTo(xx, yy); g.lineTo(xx + 0.013, yy + 0.012); g.lineTo(xx + 0.026, yy); }
    g.stroke();
  }
  g.strokeStyle = "#8a5a48";
  g.lineWidth = 0.008;
  g.beginPath();
  for (let xx = x - 0.44, k = 0; xx < x + 0.45; xx += 0.04, k++) g.lineTo(xx, y + 0.24 + (k % 2 ? 0.025 : -0.025));
  g.stroke();
  for (const s of [-1, 1]) for (let yy = y + 0.14; yy < y + 0.62; yy += 0.018) line(g, x + s * 0.45, yy, x + s * (0.47 + 0.02 * rnd()), yy + 0.02, 0.003, "rgba(200,190,175,0.8)");
  // the nape under the hair; the hair from behind, combed down to the plait, the window's light on its right
  oval(g, x, y - 0.065, 0.048, 0.05, 0, "#c99c80");
  const hair = g.createLinearGradient(x + 0.1, y - 0.32, x - 0.1, y - 0.1);
  hair.addColorStop(0, "#b48c5c");
  hair.addColorStop(0.5, "#7d5f3e");
  hair.addColorStop(1, "#4a3424");
  oval(g, x, y - 0.205, 0.105, 0.125, 0, "#4a3424");
  oval(g, x, y - 0.205, 0.1, 0.12, 0, hair);
  g.strokeStyle = "rgba(40,26,16,0.35)";
  g.lineWidth = 0.003;
  g.beginPath();
  for (let k = -5; k <= 5; k++) { g.moveTo(x + k * 0.012, y - 0.322); g.quadraticCurveTo(x + k * 0.022, y - 0.22, x + k * 0.004, y - 0.1); }
  g.stroke();
  // the plait down her back over the shawl, a ribbon at its end
  for (let i = 0; i < 14; i++) {
    const s = i % 2 ? 1 : -1;
    oval(g, x + 0.012 * s, y - 0.08 + 0.035 * i, 0.031, 0.022, 0.5 * s, "#4a3424");
    oval(g, x + 0.012 * s, y - 0.082 + 0.035 * i, 0.027, 0.018, 0.5 * s, i < 5 ? "#866443" : "#73553a");
  }
  oval(g, x - 0.02, y + 0.42, 0.025, 0.012, 0.4, "#8c2a2a");
  oval(g, x + 0.02, y + 0.42, 0.025, 0.012, -0.4, "#8c2a2a");
  // snow caught in her hair and on the shawl
  for (let i = 0; i < 46; i++) {
    const head = i < 14, px = head ? x + (rnd() - 0.5) * 0.18 : x + (rnd() - 0.5) * 0.8, py = head ? y - 0.3 + 0.18 * rnd() : y + 0.02 + 0.12 * rnd();
    oval(g, px, py, 0.004 + 0.004 * rnd(), 0.004, 0, "rgba(245,248,252,0.85)");
  }
}
// his coat laid over her shoulders, its collar's middle at (x, y): grey-brown wool, its back seam and half-belt, the
// collar turned down round her neck
function coat(g, rnd, [x, y]) {
  g.beginPath();
  g.moveTo(x - 0.16, y - 0.03);
  g.quadraticCurveTo(x - 0.36, y - 0.02, x - 0.47, y + 0.1);
  g.lineTo(x - 0.53, y + 1.0);
  g.lineTo(x + 0.53, y + 1.0);
  g.lineTo(x + 0.47, y + 0.1);
  g.quadraticCurveTo(x + 0.36, y - 0.02, x + 0.16, y - 0.03);
  g.closePath();
  const wool = g.createLinearGradient(x + 0.45, y - 0.05, x - 0.45, y + 0.8);
  wool.addColorStop(0, "#6a625a");
  wool.addColorStop(0.45, "#46403b");
  wool.addColorStop(1, "#262220");
  g.fillStyle = wool;
  g.fill();
  for (let i = 0; i < 140; i++) {
    g.fillStyle = rnd() < 0.5 ? "rgba(255,240,220,0.06)" : "rgba(0,0,0,0.12)";
    g.fillRect(x + (rnd() - 0.5) * 0.95, y + 0.02 + 0.95 * rnd(), 0.006, 0.004);
  }
  line(g, x, y + 0.04, x, y + 1.0, 0.004, "rgba(0,0,0,0.4)");
  for (const s of [-1, 1]) line(g, x + s * 0.17, y - 0.02, x + s * 0.43, y + 0.1, 0.003, "rgba(0,0,0,0.35)");
  rounded(g, x - 0.17, y + 0.5, 0.34, 0.05, 0.012);
  g.fillStyle = "#4a443e";
  g.fill();
  for (const s of [-1, 1]) oval(g, x + s * 0.145, y + 0.525, 0.012, 0.012, 0, "#1a1715");
  g.beginPath();
  g.moveTo(x - 0.18, y - 0.02);
  g.quadraticCurveTo(x, y - 0.1, x + 0.18, y - 0.02);
  g.lineTo(x + 0.2, y + 0.045);
  g.quadraticCurveTo(x, y + 0.0, x - 0.2, y + 0.045);
  g.closePath();
  g.fillStyle = "#38322e";
  g.fill();
  g.strokeStyle = "rgba(190,160,120,0.45)";
  g.lineWidth = 0.004;
  g.beginPath();
  g.moveTo(x - 0.18, y - 0.02);
  g.quadraticCurveTo(x, y - 0.1, x + 0.18, y - 0.02);
  g.stroke();
}
function paintShawl(g, C) {
  const P = SHAWL, rnd = C.e.rnd;
  // the house's log wall in the night
  g.fillStyle = "#141419";
  g.fillRect(-W, -H, 2 * W, 2 * H);
  for (let y = -H; y < H; y += 0.12) {
    const gr = g.createLinearGradient(0, y, 0, y + 0.11);
    gr.addColorStop(0, "#2a221d");
    gr.addColorStop(0.5, "#3a2f27");
    gr.addColorStop(1, "#1d1714");
    g.fillStyle = gr;
    g.fillRect(-W, y + 0.005, 2 * W, 0.11);
    g.fillStyle = "rgba(220,228,240,0.18)";
    g.fillRect(-W, y + 0.005, 2 * W, 0.006);
  }
  // the kitchen window up on the right: warm, frost in its corners; snow on its sill; its light falling over her
  g.fillStyle = "#4e3c2b";
  g.fillRect(0.4, -0.74, 0.64, 0.64);
  const glass = g.createLinearGradient(0, -0.72, 0, -0.14);
  glass.addColorStop(0, "#f8d394");
  glass.addColorStop(1, "#e3913e");
  g.fillStyle = glass;
  g.fillRect(0.43, -0.72, 0.58, 0.58);
  for (const [cx, cy] of [[0.43, -0.14], [1.01, -0.14]]) pool(g, cx, cy, 0.2, "#eef3fa", 0.55);
  g.fillStyle = "#4e3c2b";
  g.fillRect(0.705, -0.72, 0.03, 0.58);
  g.fillRect(0.43, -0.45, 0.58, 0.025);
  g.fillStyle = "#5a4634";
  g.fillRect(0.37, -0.14, 0.7, 0.035);
  g.fillStyle = "rgba(240,244,250,0.9)";
  g.fillRect(0.37, -0.15, 0.7, 0.014);
  pool(g, 0.7, -0.3, 1.1, WARM, 0.3);
  nina(g, rnd, P.neck);
  // the dark round the edges
  const dark = g.createRadialGradient(0.15, -0.2, 0.5, 0.15, -0.2, 1.5);
  dark.addColorStop(0, "rgba(8,8,12,0)");
  dark.addColorStop(1, "rgba(8,8,12,0.6)");
  g.fillStyle = dark;
  g.fillRect(-W, -H, 2 * W, 2 * H);
  C.at(...P.neck, "shoulders");
  C.at(...P.neck);
  // the coat, painted where it comes to lie (lay 1); the hands at its collar's ends; the snow before them
  const [x, y] = P.neck;
  C.layer("coat", P.neck, [x - 0.56, y - 0.12, x + 0.56, y + 1.02], (l) => { coat(l, rnd, P.neck); C.at(...P.neck, "coat"); });
  C.layer("hands", P.neck, around(P.hands.flatMap((o) => { const [a, b, c, d] = handBox(o); return [[a, b], [c, d]]; }), 0), (l) => { for (const o of P.hands) hand(l, o, P.light); });
  C.layer("snow", [0, 0], [-W, -H, W, H], (l) => flakes(l, rnd, 110, [0.003, 0.009], 0.75), { drift: [0.02, 0.08] });
}
function liveShawl(L, now) {
  const P = SHAWL, t = L.e.t, lay = clamp01(now.lay), back = 1 - lay;
  // the coat brought over from where he holds it up, a little lifted on the way; held, it sways
  const sway = 0.004 * back * noise(t * 0.8, 1);
  const x = (P.held[0] - P.neck[0]) * back + sway, y = (P.held[1] - P.neck[1]) * back - 0.05 * Math.sin(Math.PI * lay) + 0.003 * back * noise(t * 0.6, 2);
  L.set("coat", { x, y, rotate: -0.12 * back });
  // from 0.8 it lies there: his hands let go and go
  const go = ease.inOut(span(lay, 0.8, 1));
  L.set("hands", { x: x - 0.06 * go, y: y + 0.28 * go, rotate: -0.12 * back, alpha: 1 - go });
}

// ── the shots ──
// each: its painting, its life, and a layer it always has (while that one is not there, nothing is painted yet)
const SHOTS = {
  stove: { paint: paintStove, live: liveStove, first: "l_hand" },
  tea: { paint: paintTea, live: liveTea, first: "kettle" },
  box: { paint: paintBox, live: liveBox, first: "box" },
  strap: { paint: paintStrap, live: liveStrap, first: "strap" },
  shawl: { paint: paintShawl, live: liveShawl, first: "coat" },
};
// where a shot stands on the stage (stage heights): the whole frame, its middle at the frame's
function frameOf(e) {
  const ax = e.aspect / 2, ay = 0.5;
  return { ax, ay, to: (x, y) => [ax + x, ay + y] };
}

// paint(g, e, shot) — an insert's code. shot — "stove" | "tea" | "box" | "strap" | "shawl". The painting reads no key
// of the scene but `box_mode` in "box"
function paint(g, e, shot) {
  const S = SHOTS[shot];
  if (!S) { e.warn(`closeups: no shot "${shot}"`); return; }
  const { ax, ay, to } = frameOf(e);
  const C = {
    e,
    // a layer of the shot, painted in the shot's units: what it turns and scales about, the box its paint fits in, the
    // engine's own motion of it (flicker, shimmer, blend, drift)
    layer(name, pivot, box, fn, opts) {
      e.layer(name, { ...opts, pivot: to(...pivot), box: [...to(box[0], box[1]), ...to(box[2], box[3])] }, (g2) => {
        g2.translate(ax, ay);
        fn(g2);
      });
    },
    // the canvas transform of the moment already maps shot units to the stage: pass them as they are
    at: (x, y, name) => e.at(x, y, name),
  };
  g.save();
  g.translate(ax, ay);
  S.paint(g, C);
  g.restore();
}

// live(e, shot, now) — an insert's animate: nothing painted, the layers moved and the moving points marked. now (a
// field missing — its default): stove { thaw, rub }, tea { which, pour, glass1, glass2, spill, shake }, box { finger:
// [four], old, push, old_close } (and the key box_mode, read here), strap { pull, grip, door_bg }, shawl { lay }
function live(e, shot, now) {
  const S = SHOTS[shot];
  // (nothing of it to move while it is not painted — closed, or its layers not there yet)
  if (!S || !e.layer(S.first).scaleX) return;
  const { to } = frameOf(e);
  S.live({
    e,
    // a layer moved (the shot's units), turned about its pivot (radians, clockwise), scaled about it, shown, dimmed
    set(name, { x = 0, y = 0, rotate = 0, scale = 1, sx = scale, sy = scale, alpha = 1, brightness = 1 }) {
      const h = e.layer(name);
      h.x = x;
      h.y = y;
      h.rotate = rotate;
      h.scaleX = sx;
      h.scaleY = sy;
      h.alpha = alpha;
      h.brightness = brightness;
    },
    at: (x, y, name) => e.at(...to(x, y), name),
  }, now ?? {});
}

return { paint, live };
