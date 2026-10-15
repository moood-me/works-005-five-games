// The world's close-ups of hands and things: five shots for the inserts of «Старший сын»'s scenes — `stove` (two
// frozen hands at the open stove door, the fire in it), `tea` (two faceted glasses in holders under the lamp, the
// kettle in a young hand over them), `box` (the silver snuffbox between an old hand and a young one on the oilcloth),
// `strap` (the rucksack's canvas strap: a thin hand pulling it up, a fist below holding on, the lit carriage door
// behind), `shawl` (from behind: Nina's shoulders in her knitted shawl, a coat held over them by its collar). No
// faces. The hand is «Алые паруса v3»'s (fingers, back and palm, a sleeve with its cuff) — here three of them: the
// young Бусыгин's, the old Сарафанов's (drier, darker, a knitted cardigan's sleeve), the thin Васенька's (a quilted
// sleeve). Their light is painted: warm from the stove, the lamp, a window; cold from the snow.
//   paint(g, e, shot) is an insert's code: the shot painted once, each thing that moves a layer. live(e, shot, now) is
// its animate: `now` — what moves — only sets the layers' numbers and marks the points that move. The painting reads
// nothing of `now` (the shot `box` reads the key `box_mode`). closeups.md says how a scene uses it.
//   A shot's own units: the frame's height, the origin in the frame's middle (y down); the background is painted
// from −e.aspect/2 − 0.3 to e.aspect/2 + 0.3 (21:9 whole), the hands, the things and the points within the middle 4:3.
const { clamp, span, ease, noise } = anim;
const TAU = 2 * Math.PI;
const clamp01 = (v) => clamp(Number(v) || 0, 0, 1);

// (colours: a module stands by itself — the same lamplight and scarlet as the world's nebo, the skins of its cast)
const rgbOf = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const blend = (a, b, u) => `#${rgbOf(a).map((v, i) => Math.round(v + (rgbOf(b)[i] - v) * u).toString(16).padStart(2, "0")).join("")}`;
const rgba = (c, a) => `rgba(${rgbOf(c).join(",")},${a})`;
const WARM = "#e8963a", LAMP = "#f1c587", FIRE = "#f08a32", NIGHT = "#1b2233", SNOW = "#e8eef5";
// the skins: Бусыгин's young (and cold: blue-red), Сарафанов's old, Васенька's thin and pale
const SKIN = { bus: "#d9a789", cold: "#b07d80", sar: "#b98a6c", vas: "#dcb59c" };
const SILVER = { dark: "#5d5f63", mid: "#a9abaf", light: "#eef0f2" };
// the sleeves: Бусыгин's dark sweater, his coat; Сарафанов's knitted cardigan; Васенька's quilted jacket
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
