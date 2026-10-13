// The world's ships. "Secret" seen from outside is built in the scene of elements standing on an unseen
// anchor at her waterline (tools/korabl.js writes them — assembly() says which): her hull's plates, her decks (people
// stand and walk on them, carried with her), a card along her keel (masts, bowsprit, stays, pennant, lamp), a card
// across her at each mast (the mast and its yards) and her sails — each its own card, painted once, moved by the
// world's cloth shader (tools/korabl-cloth.wgsl): set and furled, white and scarlet, filled and luffing, the wind going
// over the cloth. She rolls by her anchor's tilt. Everything is painted in daylight colours; the hour is the scene's
// light, and the light comes through her sails (translucent). korabli.md says how a scene uses it.
//   Her frame (the anchor's, as "on" places things): `across` forward along the keel (bow +), `distance` to port,
// `elevation` up from the water. Paintings of what lies along her are in X (metres forward) and height over the water.
const { clamp, mix, ease } = anim;
// (colours: a module stands by itself — the same mixing, lamplight and scarlet as the world's nebo)
const rgbOf = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const N = {
  mix: (a, b, u) => `#${rgbOf(a).map((v, i) => Math.round(v + (rgbOf(b)[i] - v) * u).toString(16).padStart(2, "0")).join("")}`,
  rgba: (c, a) => `rgba(${rgbOf(c).join(",")},${clamp(a, 0, 1)})`,
  WARM: "#f4a85c",
  SCARLET: "#d4283a",
  SCARLET_LIGHT: "#ec4a52",
};
const TAU = 2 * Math.PI;

// The two ships of the story, in daylight colours, the same seen from their own decks and from afar: "Secret" — a
// white galliot, pale scrubbed decks, varnished rails, white sails (scarlet by the cloth shader); "Anselm" — a dark
// worn schooner, tarred planks, grey sails patched with other greys.
const SHIPS = {
  secret: { hull: "#eceeed", deck: "#957f66", seam: "#5a4c3e", bulwark: "#e6e4de", rail: "#7c6b58", spar: "#80705f", rig: "#3a3632", cloth: "#f2f1ec", patch: null },
  anselm: { hull: "#3e3c38", deck: "#6f665a", seam: "#3d3830", bulwark: "#4a4640", rail: "#4c4238", spar: "#564a3e", rig: "#26231f", cloth: "#a39e92", patch: ["#8f8a7e", "#b2ad9f", "#979184"] },
};

// "Secret", a three-masted galliot, metres: where she ends, how wide she is (half her beam) and where her sides run
// straight; her decks over the water (the waist, the poop aft of its break), her bulwark; her masts (X, top).
const SECRET = {
  stem: 17, stern: -16.5, beam: 3.7, straight: [-8, 7], transom: 2.4,
  deck: 2.4, poop: 3.8, break: -8.5, bulwark: 1,
  masts: { fore: { x: 8.3, top: 26 }, main: { x: -0.7, top: 29 }, mizzen: { x: -9.4, top: 21 } },
};
const GALLIOT = { length: 34, height: 29 };
// Her sails. Square ones (each on its mast's card: x across her, heights over the water): its yard hoisted (`yard`;
// lowered `low` — a course's yard stays), its foot, half its width at the yard and at the foot; `rise` — set, it goes
// up from its foot with its yard (else it drops from the yard); `order` — its turn as the sails are set. Those along
// the keel (in X and height): head, tack, clew (and a gaff sail's peak).
const SAILS = {
  fore_course: { mast: "fore", yard: 12.8, foot: 6.3, w0: 6.8, w1: 7.2, rise: 0, order: 0 },
  main_course: { mast: "main", yard: 13.8, foot: 6.3, w0: 7.4, w1: 7.8, rise: 0, order: 1 },
  fore_top: { mast: "fore", yard: 19.4, low: 13.6, foot: 13.3, w0: 5.3, w1: 6.4, rise: 1, order: 2 },
  main_top: { mast: "main", yard: 21, low: 14.6, foot: 14.3, w0: 5.8, w1: 7, rise: 1, order: 3 },
  fore_tg: { mast: "fore", yard: 24.2, low: 20.1, foot: 19.8, w0: 3.8, w1: 5.1, rise: 1, order: 4 },
  main_tg: { mast: "main", yard: 26.3, low: 21.7, foot: 21.4, w0: 4.1, w1: 5.6, rise: 1, order: 5 },
  jib: { along: [[8.5, 18.6], [17.2, 4.4], [9.6, 5]], rise: 1, order: 0 },
  jib_outer: { along: [[8.4, 24.6], [25.6, 7], [17.5, 5.2]], rise: 1, order: 0 },
  spanker: { along: [[-9.7, 15.2], [-9.7, 6.2], [-17.6, 6.4], [-15.6, 19.8]], rise: 1, order: 1 },
};
const SQUARE = Object.keys(SAILS).filter((n) => SAILS[n].mast);
// how far a sail is set as `sails_set` (0…1) says: one after another, in their order
const setOf = (sailsSet, order) => ease.inOut(clamp(((sailsSet ?? 1) - order * 0.07) / 0.55, 0, 1));
// where a square sail's yard is now (over the water)
const yardAt = (q, u) => (q.low == null ? q.yard : mix(q.low, q.yard, u));
// a sail's painting: [left, top, right, bottom] of its cloth (its card's metres, y down) — what the cloth shader is
// told (head, foot) and its box
function clothRect(name) {
  const q = SAILS[name];
  if (q.mast) return [-Math.max(q.w0, q.w1) - 0.3, -q.yard, Math.max(q.w0, q.w1) + 0.3, -q.foot];
  const xs = q.along.map((p) => p[0]);
  const ys = q.along.map((p) => p[1]);
  return [Math.min(...xs), -Math.max(...ys), Math.max(...xs), -Math.min(...ys)];
}

// ── Cloth ── Sailcloth laid over the path already traced in g: its body, lighter where it bellies (round cx, cy),
// shaded under its head, its cloths' seams (every 0.9 m: down it, or across it), "Anselm"'s patches. Painted white
// (or the ship's grey): the cloth shader makes it scarlet by its lights and darks. `whole` — the whole sail's rect when
// [l, t, r, b] is only a part of it (a half): the two parts then join as one cloth.
function cloth(g, c, rect, { seams = "down", seed = 1, whole = rect } = {}) {
  const [fl, ft, fr, fb] = rect;
  const [l, t, r, b] = whole;
  const w = r - l;
  const h = b - t;
  g.save();
  g.clip();
  // (what is filled: `rect` — a part of the sail, a half; the light, the shade and the seams lie as of the whole)
  g.beginPath();
  g.rect(fl, ft, fr - fl, fb - ft);
  g.clip();
  g.fillStyle = N.mix(c.cloth, "#000000", 0.05);
  g.fillRect(l, t, w, h);
  // the belly: where it stands out into the light
  g.save();
  g.translate((l + r) / 2, t + h * 0.58);
  g.scale(w * 0.5, h * 0.5);
  const belly = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  belly.addColorStop(0, N.rgba("#ffffff", 0.55));
  belly.addColorStop(0.6, N.rgba("#ffffff", 0.2));
  belly.addColorStop(1, N.rgba("#ffffff", 0));
  g.fillStyle = belly;
  g.fillRect(-1, -1.16, 2, 2);
  g.restore();
  // the shade under its head and along its edges, where it turns away
  const shade = g.createLinearGradient(0, t, 0, b);
  shade.addColorStop(0, "rgba(52,48,66,0.3)");
  shade.addColorStop(0.22, "rgba(52,48,66,0.06)");
  shade.addColorStop(0.8, "rgba(52,48,66,0)");
  shade.addColorStop(1, "rgba(52,48,66,0.14)");
  g.fillStyle = shade;
  g.fillRect(l, t, w, h);
  const edge = g.createLinearGradient(l, 0, r, 0);
  edge.addColorStop(0, "rgba(52,48,66,0.2)");
  edge.addColorStop(0.16, "rgba(52,48,66,0)");
  edge.addColorStop(0.84, "rgba(52,48,66,0)");
  edge.addColorStop(1, "rgba(52,48,66,0.2)");
  g.fillStyle = edge;
  g.fillRect(l, t, w, h);
  if (c.patch) {
    for (let i = 0; i < 5; i++) {
      g.fillStyle = c.patch[i % c.patch.length];
      const pw = w * (0.12 + 0.1 * anim.hash(i, seed));
      const ph = h * (0.1 + 0.1 * anim.hash(i, seed + 1));
      g.fillRect(l + (w - pw) * anim.hash(i, seed + 2), t + (h - ph) * anim.hash(i, seed + 3), pw, ph);
    }
  }
  g.fillStyle = "rgba(40,36,44,0.1)";
  if (seams === "down") for (let x = l + 0.9 - ((w / 2) % 0.9); x < r; x += 0.9) g.fillRect(x - 0.015, t, 0.03, h);
  else for (let y = t + 0.9; y < b; y += 0.9) g.fillRect(l, y - 0.015, w, 0.03);
  g.restore();
}
// A square sail fully set, hanging from its yard at height `yard` to its foot (card metres, the mast at x 0): the
// leeches bowed out a little, the foot arched; a reef band across it. q: { yard, foot, w0, w1 }. `side` −1 | 1 — only
// that half of it (a half hinged at the mast, its own card): from `lap` metres past the mast (under the other half:
// the cloth's waves open no gap) out to its leech, the cloth laid as of the whole sail.
function squareSail(g, c, q, seed = 1, side = 0, lap = 0.6) {
  const top = -q.yard;
  const foot = -q.foot;
  const tall = foot - top;
  const out = Math.max(q.w0, q.w1) + 0.25;
  const whole = [-out, top, out, foot];
  const rect = side < 0 ? [-out, top, lap, foot] : side > 0 ? [-lap, top, out, foot] : whole;
  g.beginPath();
  g.moveTo(-q.w0, top);
  g.lineTo(q.w0, top);
  g.quadraticCurveTo(q.w1 + 0.25, (top + foot) / 2, q.w1, foot);
  g.quadraticCurveTo(0, foot - tall * 0.1, -q.w1, foot);
  g.quadraticCurveTo(-q.w1 - 0.25, (top + foot) / 2, -q.w0, top);
  g.closePath();
  cloth(g, c, rect, { seed, whole });
  g.fillStyle = "rgba(40,36,44,0.1)";
  g.fillRect(Math.max(rect[0], -q.w0 - 0.2), top + tall * 0.26, Math.min(rect[2], q.w0 + 0.2) - Math.max(rect[0], -q.w0 - 0.2), 0.05);
}
// A sail along the keel fully set (X forward, heights over the water): a jib — head, tack, clew — or a gaff sail —
// throat, tack, clew, peak; its leech hollowed a little
function alongSail(g, c, pts, seed = 1) {
  const P = pts.map(([x, h]) => [x, -h]);
  g.beginPath();
  g.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]);
  g.closePath();
  const xs = P.map((p) => p[0]);
  const ys = P.map((p) => p[1]);
  cloth(g, c, [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], { seams: "across", seed });
}
// A sail's element: its code — the sail of `ship` named `name` (SAILS), painted fully set
function sail(g, e, name, ship = "secret") {
  const q = SAILS[name];
  if (q.mast) squareSail(g, SHIPS[ship], q, name.length);
  else alongSail(g, SHIPS[ship], q.along, name.length);
}
// … and its animate: the cloth shader's uniforms from the scene's keys — `sails_set` (0 furled … 1 set: each sail in
// its turn), `sails` (0 white … 1 scarlet), `luff` (0 full … 1 shaking); none of a key — set, white, full.
function sailMotion(e, name) {
  const s = e.state;
  e.uniform("set", setOf(s.sails_set, SAILS[name].order));
  e.uniform("scarlet", clamp(s.sails ?? 0, 0, 1));
  e.uniform("luff", clamp(s.luff ?? 0, 0, 1));
}
// the cloth shader's uniforms for a sail painted in the rect [l, t, r, b] (y down): what its element starts with
const clothUniforms = (rect, rise, seed) => ({ head: rect[1], foot: rect[3], rise: rise ? 1 : 0, seed, set: 1, scarlet: 0, luff: 0, wind: 1 });

// ── Her hull ── a plate of it, seen from outside: `part` — side, bow, quarter (her starboard's; side_port, bow_port,
// quarter_port: her port's, mirrored) or transom. Its top is her sheer: the bulwark along the waist rising to the bow,
// the poop's higher bulwark and its open rail aft.
const S = SECRET;
const BOW = Math.hypot(S.stem - S.straight[1], S.beam);
const QUARTER = Math.hypot(S.straight[0] - S.stern, S.beam - S.transom);
const sheer = (X) => (X < S.break ? S.poop + 0.7 : S.deck + S.bulwark + 1.3 * Math.max(0, (X - 3) / 14) ** 2);
// a plate's run: [from x, to x] of its card and X (along the keel) at a point x of it
const PLATES = {
  side: { run: [S.straight[0], S.straight[1]], X: (x) => x },
  side_port: { run: [-S.straight[1], -S.straight[0]], X: (x) => -x },
  bow: { run: [0, BOW], X: (x) => S.straight[1] + (x * (S.stem - S.straight[1])) / BOW },
  bow_port: { run: [-BOW, 0], X: (x) => S.straight[1] - (x * (S.stem - S.straight[1])) / BOW },
  quarter: { run: [-QUARTER, 0], X: (x) => S.straight[0] + (x * (S.straight[0] - S.stern)) / QUARTER },
  quarter_port: { run: [0, QUARTER], X: (x) => S.straight[0] - (x * (S.straight[0] - S.stern)) / QUARTER },
};
const GLASS = "#47525d";
// the stern windows: dark glass in the painting, lit in the layer `lit` (the animate shows it as the lanterns burn)
function windows(g, e, panes, name) {
  g.fillStyle = GLASS;
  for (const [x, y, w, h] of panes) g.fillRect(x - w / 2, y - h / 2, w, h);
  e.layer("lit", {}, (g) => {
    g.fillStyle = N.WARM;
    for (const [x, y, w, h] of panes) {
      g.fillRect(x - w / 2, y - h / 2, w, h);
      e.light(x, y, 0.5, N.WARM, 0.8, name);
    }
  });
}
function hull(g, e, part, ship = "secret") {
  const c = SHIPS[ship];
  if (part === "transom") {
    const top = -(S.poop + 0.7);
    g.fillStyle = c.hull;
    g.beginPath();
    g.moveTo(-S.transom, top);
    g.lineTo(S.transom, top);
    g.lineTo(S.transom - 0.5, 0.5);
    g.lineTo(-S.transom + 0.5, 0.5);
    g.closePath();
    g.fill();
    g.fillStyle = "#4a525c";
    g.fillRect(-S.transom + 0.45, -0.5, 2 * S.transom - 0.9, 0.55);
    windows(g, e, [[-1.3, -3, 0.7, 0.8], [0, -3, 0.7, 0.8], [1.3, -3, 0.7, 0.8]], "cabin");
    g.strokeStyle = c.rail;
    g.lineWidth = 0.06;
    g.strokeRect(-S.transom, top - 0.4, 2 * S.transom, 0.4);
    // the stern lantern on its post over the taffrail
    g.fillStyle = c.rail;
    g.fillRect(-0.03, top - 1.3, 0.06, 1.3);
    g.fillStyle = "#b9b6ac";
    g.fillRect(-0.13, top - 1.72, 0.26, 0.42);
    e.light(0, top - 1.5, 0.45, N.WARM, 0.9, "stern_lamp");
    e.at(0, top, "stern");
    return;
  }
  const { run, X } = PLATES[part];
  const [x0, x1] = run;
  const n = 24;
  const at = (i) => x0 + ((x1 - x0) * i) / n;
  // (a bow plate's end at the stem is raked: its foot stands back from its head)
  const rake = part === "bow" ? [0, -1.7] : part === "bow_port" ? [1.7, 0] : [0, 0];
  g.fillStyle = c.hull;
  g.beginPath();
  g.moveTo(x0 + rake[0], 0.5);
  for (let i = 0; i <= n; i++) g.lineTo(at(i), -sheer(X(at(i))));
  g.lineTo(x1 + rake[1], 0.5);
  g.closePath();
  g.fill();
  g.save();
  g.clip();
  // the boot-top at the water, the wale under the sheer
  g.fillStyle = "#4a525c";
  g.fillRect(x0, -0.55, x1 - x0, 0.6);
  g.restore();
  g.strokeStyle = "rgba(74,82,92,0.3)";
  g.lineWidth = 0.07;
  g.beginPath();
  for (let i = 0; i <= n; i++) g.lineTo(at(i), -sheer(X(at(i))) + 1.05);
  g.stroke();
  g.strokeStyle = c.rail;
  g.lineWidth = 0.08;
  g.beginPath();
  for (let i = 0; i <= n; i++) g.lineTo(at(i), -sheer(X(at(i))));
  g.stroke();
  // the poop's open rail on its stanchions
  g.fillStyle = c.rail;
  for (let i = 0; i <= n; i++) {
    const x = at(i);
    if (X(x) >= S.break) continue;
    g.fillRect(x - 0.03, -(S.poop + 1.15), 0.06, 0.45);
    if (i < n && X(at(i + 1)) < S.break) g.fillRect(x, -(S.poop + 1.15), (x1 - x0) / n, 0.06);
  }
  if (part.startsWith("quarter")) windows(g, e, [-0.72, -0.4].map((u) => [x0 + (x1 - x0) * (part === "quarter" ? 1 + u : -u), -3, 0.6, 0.7]), "cabin");
  if (part.startsWith("side")) e.at(X(2) === 2 ? 2 : -2, -0.3, "ladder");
}
// a plate with stern windows, the transom's lantern: lit as the scene's `lanterns` (0…1) says
function hullMotion(e) {
  const lit = clamp(e.state.lanterns ?? 0, 0, 1);
  e.layer("lit").alpha = lit;
  e.glow("cabin", lit);
  if (e.id.endsWith("_transom")) e.glow("stern_lamp", lit);
}

// ── Her decks ── seen from above (a plane on the anchor: x forward from its middle, y to starboard): `part` — deck
// (her whole plan, at the waist's height) or poop (aft of the break, higher). Planks along her, a hatch in the waist.
const PLAN = [[S.stern, S.transom], [S.straight[0], S.beam], [S.straight[1], S.beam], [S.stem, 0], [S.straight[1], -S.beam], [S.straight[0], -S.beam], [S.stern, -S.transom]];
const DECKS = { deck: { from: S.stern, to: S.stem, height: S.deck }, poop: { from: S.stern, to: S.break, height: S.poop } };
function deck(g, e, part = "deck", ship = "secret") {
  const c = SHIPS[ship];
  const d = DECKS[part];
  const mid = (d.from + d.to) / 2;
  g.save();
  g.translate(-mid, 0);
  g.beginPath();
  PLAN.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.clip();
  g.fillStyle = c.deck;
  g.fillRect(d.from, -S.beam, d.to - d.from, 2 * S.beam);
  g.fillStyle = N.rgba(c.seam, 0.45);
  for (let y = -S.beam + 0.2; y < S.beam; y += 0.22) g.fillRect(d.from, y - 0.01, d.to - d.from, 0.02);
  if (part === "deck") {
    g.fillStyle = N.mix(c.deck, c.seam, 0.6);
    g.fillRect(-5.5, -1.2, 3, 2.4);
    g.fillStyle = c.bulwark;
    g.fillRect(-5.6, -1.3, 3.2, 0.12);
    g.fillRect(-5.6, 1.18, 3.2, 0.12);
  }
  g.restore();
}
// the poop's front over the waist (a card across her at the break, facing forward): a white bulkhead, its door, the
// ladder up
function breakFront(g, e, ship = "secret") {
  const c = SHIPS[ship];
  const tall = S.poop - S.deck;
  g.fillStyle = c.bulwark;
  g.fillRect(-S.beam, -tall, 2 * S.beam, tall);
  g.fillStyle = N.mix(c.bulwark, c.seam, 0.5);
  g.fillRect(-1.9, -tall + 0.15, 0.8, tall - 0.15);
  g.fillStyle = c.rail;
  for (let i = 1; i <= 4; i++) g.fillRect(0.9, -(tall * i) / 5, 1, 0.05);
  g.fillRect(-S.beam, -tall - 0.04, 2 * S.beam, 0.08);
}

// ── Her rig ── the card along her keel: the three masts, the bowsprit, the stays and shrouds, the spanker's boom and
// gaff, the pennant at the main truck (a layer in the scene's wind), her riding lamp on the forestay (a glow, lit as
// `lanterns`), and far off the spark of her sails (glows the animate lights with distance). Her points: ship (her
// middle, half way up), masthead, bow, stern, deck (the waist), wheel (the poop), ladder (at the water, amidships).
const spar = (g, x0, y0, x1, y1, w0, w1) => {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  g.beginPath();
  g.moveTo(x0 + (nx * w0) / 2, y0 + (ny * w0) / 2);
  g.lineTo(x1 + (nx * w1) / 2, y1 + (ny * w1) / 2);
  g.lineTo(x1 - (nx * w1) / 2, y1 - (ny * w1) / 2);
  g.lineTo(x0 - (nx * w0) / 2, y0 - (ny * w0) / 2);
  g.closePath();
  g.fill();
};
const SPRIT = [[15.2, -4], [26.2, -7.4]];
const LAMP = [14.6, -9.2];
function rig(g, e, ship = "secret") {
  const c = SHIPS[ship];
  const M = S.masts;
  g.fillStyle = c.spar;
  spar(g, M.fore.x, -S.deck, M.fore.x, -M.fore.top, 0.42, 0.16);
  spar(g, M.main.x, -S.deck, M.main.x, -M.main.top, 0.46, 0.16);
  spar(g, M.mizzen.x, -S.poop, M.mizzen.x, -M.mizzen.top, 0.36, 0.14);
  spar(g, SPRIT[0][0], SPRIT[0][1], SPRIT[1][0], SPRIT[1][1], 0.34, 0.14);
  // the spanker's boom and gaff
  const [throat, tack, clew, peak] = SAILS.spanker.along;
  spar(g, tack[0] + 0.3, -tack[1] + 0.1, clew[0] - 0.4, -clew[1] + 0.1, 0.2, 0.14);
  spar(g, throat[0] + 0.3, -throat[1] - 0.1, peak[0] - 0.4, -peak[1] - 0.15, 0.16, 0.1);
  // stays (forward of each mast, down to the bowsprit and the next mast's foot), backstays, shrouds
  g.strokeStyle = N.rgba(c.rig, 0.75);
  g.lineWidth = 0.035;
  g.beginPath();
  const line = (x0, y0, x1, y1) => {
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
  };
  line(M.fore.x, -M.fore.top + 1, SPRIT[1][0], SPRIT[1][1]);
  line(M.fore.x, -19, 17.4, -4.6);
  line(M.main.x, -M.main.top + 1, M.fore.x, -13.4);
  line(M.main.x, -21.4, M.fore.x, -S.deck - 1);
  line(M.mizzen.x, -M.mizzen.top + 1, M.main.x, -14.4);
  line(M.main.x, -M.main.top + 1, M.mizzen.x - 4.5, -S.poop - 0.9);
  line(M.mizzen.x, -M.mizzen.top + 0.6, peak[0], -peak[1]);
  for (const [m, deckAt] of [[M.fore, S.deck], [M.main, S.deck], [M.mizzen, S.poop]]) {
    for (const k of [-1, 1]) {
      line(m.x, -m.top * 0.62, m.x + k * 1.1, -deckAt - 0.9);
      line(m.x, -m.top * 0.62, m.x + k * 1.8, -deckAt - 0.9);
    }
  }
  line(SPRIT[1][0], SPRIT[1][1], S.stem - 0.4, -1.2);
  g.stroke();
  // her riding lamp
  g.fillStyle = "#b9b6ac";
  g.fillRect(LAMP[0] - 0.11, LAMP[1] - 0.18, 0.22, 0.36);
  e.light(LAMP[0], LAMP[1], 0.5, N.WARM, 0.9, "lamp");
  // the pennant, long and narrow, streaming aft from the main truck
  const truck = [M.main.x, -M.main.top - 0.2];
  e.layer("pennant", { box: [truck[0] - 5.5, truck[1] - 2.5, truck[0] + 5.5, truck[1] + 2.5], pivot: truck, wind: { strength: 0.9, gust: 0.7 } }, (g) => {
    g.fillStyle = "#8fa2b6";
    g.beginPath();
    g.moveTo(truck[0], truck[1] - 0.22);
    g.quadraticCurveTo(truck[0] - 2.2, truck[1] - 0.05, truck[0] - 4.6, truck[1] + 0.25);
    g.quadraticCurveTo(truck[0] - 2.2, truck[1] + 0.2, truck[0], truck[1] + 0.22);
    g.closePath();
    g.fill();
  });
  // far off she is a spark on the horizon: white, or scarlet
  e.light(0, -15, 70, "#fbf7ee", 5, "spark_white");
  e.light(0, -15, 70, N.SCARLET_LIGHT, 6, "spark_scarlet");
  e.at(0, -15, "ship");
  e.at(M.main.x, -M.main.top, "masthead");
  e.at(S.stem, -4.6, "bow");
  e.at(S.stern, -4.6, "stern");
  e.at(3, -S.deck - 1, "deck");
  e.at(-12, -S.poop - 1, "wheel");
  e.at(2, -0.3, "ladder");
}
// its animate: the lamp as `lanterns`; the spark as far as she is (the farther the brighter — it shines through the
// air; none nearer than a mile; `<anchor id>_spark` 0…1
// kindles it — none of that key: lit), white or scarlet as `sails`
function rigMotion(e) {
  const s = e.state;
  e.glow("lamp", clamp(s.lanterns ?? 0, 0, 1));
  // (how far she is: her anchor's place in the world — the card's own spot is its place on her)
  const m = e.mem;
  m.anchor ??= e.id.replace(/_rig$/, "");
  m.spark ??= `${m.anchor}_spark`;
  const at = e.where(m.anchor);
  const off = at ? Math.hypot(at.across, at.distance) : 0;
  const far = clamp((off - 1800) / 1700, 0, 1) * clamp(off / 9000, 0.15, 1) * clamp(s[m.spark] ?? 1, 0, 1) * (s.sails_set == null ? 1 : clamp(s.sails_set * 3, 0, 1));
  const red = clamp(s.sails ?? 0, 0, 1);
  e.glow("spark_white", far * (1 - red));
  e.glow("spark_scarlet", far * red);
}
// ── A mast's card across her ── `which` fore | main: the mast and its top, and the yards of its square sails — each a
// layer the animate carries up the mast as its sail is set.
const yardsOf = (which) => SQUARE.filter((n) => SAILS[n].mast === which);
function mast(g, e, which, ship = "secret") {
  const c = SHIPS[ship];
  const m = S.masts[which];
  g.fillStyle = c.spar;
  spar(g, 0, -S.deck, 0, -m.top, which === "main" ? 0.46 : 0.42, 0.16);
  g.fillRect(-0.9, -m.top * 0.62 - 0.08, 1.8, 0.16);
  for (const name of yardsOf(which)) {
    const q = SAILS[name];
    e.layer(name, { box: [-q.w0 - 0.6, -q.yard - 0.4, q.w0 + 0.6, -(q.low ?? q.yard) + 0.4], depth: 0.15 }, (g) => {
      g.fillStyle = c.spar;
      spar(g, -q.w0 - 0.4, -q.yard, 0, -q.yard, 0.14, 0.26);
      spar(g, 0, -q.yard, q.w0 + 0.4, -q.yard, 0.26, 0.14);
    });
  }
}
function mastMotion(e, which) {
  for (const name of yardsOf(which)) {
    const q = SAILS[name];
    if (q.low != null) e.layer(name).y = q.yard - yardAt(q, setOf(e.state.sails_set, q.order));
  }
}

// The swell rolling a ship: its anchor's tilt key moved one way and back, slowly, never quite the same (degrees; on
// the scene's clock) — in the scene's script: korabli.swell(scene, 'ship_roll', 4.2, 1.6)
function swell(scene, key, every, most) {
  let side = 1;
  const roll = () => {
    side = -side;
    scene.move(key, side * most * (0.6 + 0.4 * scene.random()), { over: every, ease: "inOut" });
  };
  roll();
  scene.every(every, roll);
}

// What tools/korabl.js writes into a scene for "Secret" on the anchor `id`: her elements (the anchor itself is the
// scene's own — its place, its facing, its tilt), each with its code and animate (one line of this module), the sails
// with the cloth shader and its uniforms. `brace` — how far her yards are braced round (degrees from square).
function assembly(id, { ship = "secret", brace = 35 } = {}) {
  const K = "e.kit.korabli";
  const a = (deg) => Math.round(deg * 100) / 100;
  const bowTurn = (Math.atan2(S.beam, S.stem - S.straight[1]) * 180) / Math.PI;
  const quarterTurn = (Math.atan2(S.beam - S.transom, S.straight[0] - S.stern) * 180) / Math.PI;
  const top = -(S.poop + 1.3);
  const plate = (part, name, where, facing, extra = {}) => {
    const [x0, x1] = PLATES[part].run;
    return { id: `${id}_${part}`, name, on: id, ...where, facing: a(facing), box: [a(x0 - 0.1), -6.2, a(x1 + 0.1), 0.6], code: `${K}.hull(g, e, '${part}', '${ship}');`, ...extra };
  };
  const lit = { animate: `${K}.hullMotion(e);` };
  const out = [
    plate("side", "«Секрет»: правый борт", { distance: -S.beam }, 180),
    plate("side_port", "«Секрет»: левый борт", { distance: S.beam }, 0),
    plate("bow", "«Секрет»: скула правого борта", { across: S.straight[1], distance: -S.beam }, 180 - bowTurn),
    plate("bow_port", "«Секрет»: скула левого борта", { across: S.straight[1], distance: S.beam }, bowTurn),
    plate("quarter", "«Секрет»: раковина правого борта", { across: S.straight[0], distance: -S.beam }, 180 + quarterTurn, lit),
    plate("quarter_port", "«Секрет»: раковина левого борта", { across: S.straight[0], distance: S.beam }, 360 - quarterTurn, lit),
    { id: `${id}_transom`, name: "«Секрет»: корма", on: id, across: S.stern, facing: 270, box: [a(-S.transom - 0.3), a(top - 1.2), a(S.transom + 0.3), 0.6], code: `${K}.hull(g, e, 'transom', '${ship}');`, ...lit },
    { id: `${id}_deck`, name: "«Секрет»: палуба", plane: true, walk: true, on: id, across: (S.stern + S.stem) / 2, elevation: S.deck, width: S.stem - S.stern, depth: 2 * S.beam, code: `${K}.deck(g, e, 'deck', '${ship}');` },
    { id: `${id}_poop`, name: "«Секрет»: ют", plane: true, walk: true, on: id, across: (S.stern + S.break) / 2, elevation: S.poop, width: S.break - S.stern, depth: 2 * S.beam, code: `${K}.deck(g, e, 'poop', '${ship}');` },
    { id: `${id}_break`, name: "«Секрет»: срез юта", on: id, across: S.break, elevation: S.deck, facing: 90, box: [-S.beam, -(S.poop - S.deck) - 0.1, S.beam, 0], code: `${K}.breakFront(g, e, '${ship}');` },
    { id: `${id}_rig`, name: "«Секрет»: мачты и такелаж", on: id, facing: 180, box: [-22, -32, 27, 0], code: `${K}.rig(g, e, '${ship}');`, animate: `${K}.rigMotion(e);` },
  ];
  const sailOf = (name, title, where, seed) => {
    const rect = clothRect(name);
    return { id: `${id}_${name}`, name: `«Секрет»: ${title}`, ...where, facing: 180, translucent: 0.55, box: [a(rect[0] - 0.5), a(rect[1] - 0.5), a(rect[2] + 0.5), a(rect[3] + 0.5)],
      uniforms: clothUniforms(rect, SAILS[name].rise, seed), code: `${K}.sail(g, e, '${name}', '${ship}');`, animate: `${K}.sailMotion(e, '${name}');`, wgsl: "cloth" };
  };
  const titles = { course: "нижний парус", top: "марсель", tg: "брамсель" };
  ["fore", "main"].forEach((which, k) => {
    const m = S.masts[which];
    const mastName = which === "fore" ? "фок-мачта" : "грот-мачта";
    out.push({ id: `${id}_${which}`, name: `«Секрет»: ${mastName} и реи`, on: id, across: m.x, facing: 90 - brace, box: [-8.6, -m.top - 0.5, 8.6, -S.deck + 0.1],
      code: `${K}.mast(g, e, '${which}', '${ship}');`, animate: `${K}.mastMotion(e, '${which}');` });
    yardsOf(which).forEach((name, i) => out.push(sailOf(name, `${titles[name.split("_")[1]]}, ${mastName}`, { on: `${id}_${which}`, distance: -0.3 }, 1 + k * 3 + i)));
  });
  out.push(sailOf("jib", "стаксель", { on: id, distance: 0.1 }, 7));
  out.push(sailOf("jib_outer", "кливер", { on: id, distance: -0.1 }, 8));
  out.push(sailOf("spanker", "бизань", { on: id, distance: -0.1 }, 9));
  return out;
}

// ── Other craft ──
// A ship's boat from her side, bow to the left, at the waterline (metres; 4.6 m long): a dark-planked hull with a
// pale wale and gunwale, a raked stem, a square stern. Painted once; people sit in it ("on": "skiff"). Points:
// `skiff` (her middle, at the water), `bow`, `seat1` (aft thwart), `seat2` (forward thwart) — at the thwarts' height.
function skiff(g, e) {
  const sheer = (x) => 0.62 + 0.2 * Math.max(0, -x / 2.3) ** 2;
  const at = (i) => -2.3 + (4.6 * i) / 12;
  g.fillStyle = "#6b5440";
  g.beginPath();
  g.moveTo(-2.3, -sheer(-2.3));
  for (let i = 1; i <= 12; i++) g.lineTo(at(i), -sheer(at(i)));
  g.lineTo(2.1, 0.05);
  g.quadraticCurveTo(0.4, 0.2, -1.9, 0.05);
  g.closePath();
  g.fill();
  g.strokeStyle = "#cfc6b4";
  g.lineWidth = 0.07;
  g.beginPath();
  for (let i = 0; i <= 12; i++) g.lineTo(at(i), -sheer(at(i)) + 0.02);
  g.stroke();
  g.lineWidth = 0.04;
  g.beginPath();
  for (let i = 0; i <= 12; i++) g.lineTo(at(i), -sheer(at(i)) + 0.2);
  g.stroke();
  e.at(0, 0, "skiff");
  e.at(-2.3, -sheer(-2.3), "bow");
  e.at(0.9, -0.5, "seat1");
  e.at(-0.5, -0.5, "seat2");
}
// A fishing boat far off, bow to the left, at the waterline (metres; 6 m long): a low dark hull, a mast, a furled sail
// along the boom, and a lantern at the masthead — a glow `light` at full strength (the scene's animate lights it:
// e.glow("light", k))
function far(g, e) {
  g.fillStyle = "#2f2a26";
  g.beginPath();
  g.moveTo(-3, -0.9);
  g.lineTo(3, -0.8);
  g.lineTo(2.4, 0);
  g.lineTo(-2.3, 0);
  g.closePath();
  g.fill();
  g.fillStyle = "#4a3f30";
  g.fillRect(-0.05, -4.4, 0.1, 3.6);
  g.fillRect(-1.6, -1.6, 2.8, 0.12);
  g.fillStyle = "#b9b6ac";
  g.fillRect(-0.12, -4.75, 0.24, 0.35);
  e.light(0, -4.57, 1.2, N.WARM, 1, "light");
}
// Assol's toy yacht standing on water or a shelf (its keel at y 0, 0.34 m long): a white hull, a mast, two scarlet
// sails; its point `toy`. It makes no layers (a scene calls it inside its own)
function toy(g, e) {
  g.fillStyle = "#ece9e2";
  g.beginPath();
  g.moveTo(-0.17, -0.06);
  g.lineTo(0.17, -0.07);
  g.quadraticCurveTo(0.12, 0, -0.1, 0);
  g.closePath();
  g.fill();
  g.fillStyle = "#5d5a55";
  g.fillRect(-0.004, -0.42, 0.008, 0.36);
  g.fillStyle = N.SCARLET;
  g.beginPath();
  g.moveTo(-0.012, -0.4);
  g.lineTo(-0.012, -0.09);
  g.lineTo(-0.13, -0.09);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(0.012, -0.36);
  g.lineTo(0.012, -0.1);
  g.lineTo(0.13, -0.1);
  g.closePath();
  g.fill();
  e.at(0, -0.2, "toy");
}
// Stems of reed standing out of the water in front of Assol's yacht (as when she is stuck), nine, at the keel's y 0
// (metres, around the yacht's x 0). It makes no layer: the scene paints it in a layer of its own and drives that
// layer's alpha — e.layer("reeds", {box: [-0.24, -0.34, 0.24, 0.02]}, (g) => kit.korabli.reeds(g, e))
function reeds(g, e) {
  for (let i = 0; i < 9; i++) {
    const x = -0.22 + i * 0.055 + 0.012 * anim.hash(i, 1);
    const h = 0.2 + 0.12 * anim.hash(i, 2);
    const lean = 0.03 * (anim.hash(i, 3) - 0.5);
    g.strokeStyle = i % 2 ? "#6f7d45" : "#8a8f52";
    g.lineWidth = 0.008;
    g.beginPath();
    g.moveTo(x, 0.01);
    g.quadraticCurveTo(x + lean, -h * 0.5, x + lean * 1.8, -h);
    g.stroke();
    g.fillStyle = "#7b5f3c";
    g.fillRect(x + lean * 1.8 - 0.006, -h - 0.03, 0.012, 0.05);
  }
}
// The mail steamer from her side, bow to the left, at her waterline (metres): a long black hull, a white deckhouse,
// one tall funnel, two light masts. Painted once; her smoke is the scene's — particles at her point `funnel`
// (SMOKE); her point `steamer`. c: { hull, house, funnel, rig } — none given: her own.
const STEAMER = { length: 50, height: 22, funnel: [0, -15.5] };
function steamer(g, e, c = {}) {
  g.fillStyle = c.hull ?? "#2e2f31";
  g.beginPath();
  g.moveTo(-25, -4.2);
  g.lineTo(-23.5, 0);
  g.lineTo(22, 0);
  g.quadraticCurveTo(24.5, -0.8, 24.8, -3.8);
  g.closePath();
  g.fill();
  g.fillStyle = c.house ?? "#e4e2da";
  g.fillRect(-10, -6.6, 22, 2.6);
  g.fillRect(-5, -8.4, 9, 1.9);
  g.fillStyle = c.funnel ?? "#3b3734";
  g.fillRect(-1.3, -15.5, 2.6, 7.2);
  g.fillStyle = c.rig ?? "#2a2826";
  g.fillRect(-15.2, -17, 0.25, 13);
  g.fillRect(15.3, -15, 0.22, 11);
  g.fillRect(-1.3, -14.4, 2.6, 0.5);
  // her masthead light, on the main mast (full strength: the scene's animate lights it, e.glow("light", k))
  e.light(-15.08, -17.3, 3, N.WARM, 1, "light");
  e.at(STEAMER.funnel[0], STEAMER.funnel[1], "funnel");
  e.at(-2, -9, "steamer");
}
// her smoke: the fields of a particles element — { "id": "steamer_smoke", "particles": { ...SMOKE, "at": "steamer#funnel" } }
const SMOKE = { kind: "smoke", rate: 3, life: [26, 36], source: [0.6, 0.6, 0], speed: [1.4, 2.2], spread: 12, gravity: -0.1, drag: 0.35, wind: 1, gust: 0.5, turbulence: 2, swirl: 7, size: [1.6, 18], color: "#9a9a96", opacity: 0.55, sheer: 0.3, fade: [0.02, 0.55], soft: 3 };
// A ship's lantern, its foot at (0, 0): a brass frame round its glass; its flame a glow of the element named `name`,
// at full strength (the element's animate lights it: e.glow(name, k)) — a scene's light may take it ("of")
function lantern(g, e, name = "lamp") {
  g.fillStyle = "#4a3f30";
  g.fillRect(-0.1, -0.36, 0.2, 0.04);
  g.fillRect(-0.09, -0.02, 0.18, 0.03);
  g.fillStyle = "rgba(222,206,170,0.85)";
  g.fillRect(-0.08, -0.32, 0.16, 0.3);
  g.fillStyle = "#4a3f30";
  g.fillRect(-0.01, -0.32, 0.02, 0.3);
  e.light(0, -0.17, 0.3, N.WARM, 1, name);
}

return {
  SHIPS, SECRET, GALLIOT, SAILS, setOf, yardAt, clothRect, clothUniforms, cloth, squareSail, alongSail, sail, sailMotion,
  hull, hullMotion, deck, breakFront, rig, rigMotion, mast, mastMotion, swell, assembly, skiff, far, toy, reeds, steamer, STEAMER, SMOKE, lantern,
};
