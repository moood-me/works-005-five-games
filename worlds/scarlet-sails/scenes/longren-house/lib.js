// Longren's House — what the room's elements share (the window's leaves, the shelves' toys, where the chest, the door and
// the ship are as their keys say, the sky's bodies) and its film in beats (film(scene), at the end: the world's module
// beats — notes.md lists them).
const N = kit.sky;
const num = (v) => +v || 0;
const has = (list, name) => Array.isArray(list) && list.includes(name);

// ── the sky: all round the house (roam), the horizon at 0.42; the window looks east — the sun rises straight ahead
// in it and goes round by the south (the right), the moon the same way by night ──
const HORIZON = 0.42;
const body = (top) => (u, height, state, out) => N.onRound(180 * anim.clamp(u, 0, 1), u < 0 || u > 1 ? -3.4 : (height * top * 180) / Math.PI, HORIZON, out);
const SKY = {
  horizon: HORIZON,
  round: true,
  sun: body(0.9),
  moon: body(0.75),
  clouds: [[3.0, 0.14, 1.1, 0.02], [3.6, 0.27, 0.8, 0.012], [2.7, 0.33, 0.7, 0.01], [5.2, 0.2, 1.2, 0.02], [0.8, 0.25, 1, 0.015]],
};

// ── the window's two leaves (casements), each painted from its hinge: side 1 — hinged on the left of the opening, the
// leaf to its right (x 0 → 0.75); side −1 — hinged on the right, the leaf to its left. Metres from the floor: H
// 0.8…2.05. Its two panes are glass (`glass_left`, `glass_right`). The right leaf laps over the left one by 2 cm where
// they meet (its astragal): shut, no gap ──
const LEAF = 0.75;
const span = (side, a, b) => (side > 0 ? [a, b - a] : [-b, b - a]);
function panes(side) {
  const [x, w] = span(side, 0.05, LEAF - 0.05);
  return [[x, -2, w, 0.56], [x, -1.4, w, 0.55]];
}
function leaf(g, side) {
  const [x, w] = span(side, 0, LEAF + (side < 0 ? 0.02 : 0));
  g.fillStyle = "#b8bab8";
  g.beginPath();
  g.rect(x, -2.05, w, 1.25);
  for (const p of panes(side)) g.rect(...p);
  g.fill("evenodd");
}
function glass(g, side) {
  g.fillStyle = "#9fb0bf";
  for (const p of panes(side)) g.fillRect(...p);
}

// ── the shelves' toys: [kind, x on the card, the board's height, length, the hull's colour]; `toys` 0…1 empties the
// shelves toy by toy — each gone by its own value of it (GONE) ──
const TOYS = [
  ["sloop", -0.4, 1.35, 0.28, "#9b8a74"],
  ["launch", -0.02, 1.35, 0.26, "#6f7f8f"],
  ["schooner", 0.36, 1.35, 0.32, "#e6e3dc"],
  ["schooner", -0.36, 1.75, 0.32, "#9b8a74"],
  ["sloop", 0.02, 1.75, 0.24, "#e6e3dc"],
  ["launch", 0.38, 1.75, 0.26, "#9b8a74"],
  ["sloop", -0.4, 2.15, 0.22, "#6f7f8f"],
  ["launch", -0.05, 2.15, 0.24, "#e6e3dc"],
  ["sloop", 0.35, 2.15, 0.22, "#7a6a58"],
  ["sloop", 1.05, 2.2, 0.24, "#9b8a74"],
  ["sloop", 1.6, 2.2, 0.22, "#e6e3dc"],
];
const TOY_LAYERS = TOYS.map((_, i) => `toy${i}`);
const GONE = TOYS.map((_, i) => 0.03 + 0.94 * anim.hash(i, 3));
// where Assol's yacht stands on the board over the window (the element `toy`), on the shelves' card
const YACHT = [2.15, 2.2];
// a toy standing on its board at (x, h): its two little stands, the hull, and masts and sails by its kind
function toy(g, kind, x, h, size, hull, sail) {
  const len = size, hh = size * 0.16, y = -h;
  g.fillStyle = "#5b5a57";
  g.fillRect(x - len * 0.25, y - 0.04, 0.012, 0.04);
  g.fillRect(x + len * 0.22, y - 0.04, 0.012, 0.04);
  const base = y - 0.035;
  g.fillStyle = hull;
  g.beginPath();
  g.moveTo(x - len / 2, base - hh);
  g.lineTo(x + len / 2, base - hh * 1.15);
  g.quadraticCurveTo(x + len * 0.35, base, x - len * 0.25, base);
  g.quadraticCurveTo(x - len * 0.45, base - hh * 0.3, x - len / 2, base - hh);
  g.fill();
  const deck = base - hh;
  g.fillStyle = sail;
  if (kind === "launch") {
    g.fillRect(x - len * 0.2, deck - hh * 1.1, len * 0.35, hh * 1.1);
    g.fillStyle = "#3f3f3f";
    g.fillRect(x + len * 0.02, deck - hh * 2.2, len * 0.06, hh * 1.2);
    return;
  }
  const masts = kind === "schooner" ? [-0.12, 0.12] : [0.02];
  for (const m of masts) {
    const mx = x + m * len, mh = len * (kind === "schooner" ? 0.85 : 1.05);
    g.fillStyle = "#5b5a57";
    g.fillRect(mx - 0.005, deck - mh, 0.01, mh);
    g.fillStyle = sail;
    g.beginPath();
    g.moveTo(mx - 0.012, deck - mh * 0.95);
    g.lineTo(mx - 0.012, deck - hh * 0.6);
    g.lineTo(mx - len * 0.36, deck - hh * 0.6);
    g.closePath();
    g.fill();
  }
  // the jib, from the foremast to the bow
  const fx = x + masts[masts.length - 1] * len;
  g.beginPath();
  g.moveTo(fx + 0.012, deck - len * 0.8);
  g.lineTo(fx + 0.012, deck - hh * 0.6);
  g.lineTo(x + len * 0.46, deck - hh * 0.8);
  g.closePath();
  g.fill();
}
// the box a toy is painted in (its layer's)
const toyBox = (x, h, size) => [x - size / 2 - 0.02, -h - size * 1.2 - 0.06, x + size / 2 + 0.02, -h + 0.005];

// ── the yacht Longren makes: on the bench as its hull while it is being made — till someone has it in their hands or
// it stands on its board; his knife on the bench while it is not in his hand ──
// (years on — the shelves emptying — it was made long ago, wherever it is now)
const yachtMade = (S) => has(S.assol_with, "yacht") || has(S.assol_with, "yacht_r") || has(S.longren_with, "yacht_r") || num(S.toy_on_shelf) > 0.5 || num(S.toys) > 0;
const knifeLaid = (S) => !has(S.longren_with, "knife");
// she has the book in her hands
const reading = (S) => has(S.assol_with, "book");
// the ring on her hand (the party's keys: ring — none | finger | cord, ring_kind — mother | own): the cast's part she
// wears — the mother's, the plain `ring`, or his own old, wider one, `ring_old`; none, when it is not on her finger
const ringPart = (ring, kind) => (ring === "finger" ? (kind === "mother" ? "ring" : "ring_old") : null);

// ── what the keys move (metres, degrees): the chest from its corner out into the room (chest 0…1), the ship from
// beyond the window's edge to the middle of it (sails_window), the door (hinged on the right) and the window's leaves
// turning into the room. The scene's script keeps these as the keys move; a cut gives them with its values ──
const CHEST = { across: -1, distance: 4.65, out: [0.7, -0.8] };
// (away: past every line of sight out of the room, the open door's too; she comes on fast out of sight and slowly into
// the window)
const SHIP = { away: 520, shown: 75, slowing: 2.5 };
const placed = (S) => {
  const c = num(S.chest), w = 80 * num(S.window_open);
  return {
    chest_across: CHEST.across + CHEST.out[0] * c,
    chest_distance: CHEST.distance + CHEST.out[1] * c,
    ship_across: SHIP.shown + (SHIP.away - SHIP.shown) * (1 - anim.clamp(num(S.sails_window), 0, 1)) ** SHIP.slowing,
    door_facing: 180 - 82 * num(S.door),
    window_left_facing: 180 + w,
    window_right_facing: 180 - w,
  };
};
// how far the chest is out, by where the one dragging it stands (his place: [across, distance]) — he a step before its
// front, on the line it is pulled along
const PULL = Math.hypot(...CHEST.out);
const STEP = 0.47;
const pulling = (c) => [CHEST.across + CHEST.out[0] * c, CHEST.distance + CHEST.out[1] * c - STEP];
const pulled = (across, distance) => anim.clamp(((across - CHEST.across) * CHEST.out[0] + (distance - (CHEST.distance - STEP)) * CHEST.out[1]) / (PULL * PULL), 0, 1);

// ── the close-ups: the insert `closeup` (opened by its key), `closeup_shot` says which — "rig": the bench with the
// yacht being rigged (the game's «Rigging»: rig1…rig4, guide); "page": the page of her book with the beetle on it
// (beetle). Painted once a shot, in stage heights (x 0…e.aspect, y 0…1); all that moves in them is layers moved by
// closeupMotion. Their own light is painted: an insert is a picture of its own ──
const clamp01 = (v) => anim.clamp(num(v), 0, 1);
// a round-ended bar from one point to another
function bar(g, x0, y0, x1, y1, w, colour) {
  g.strokeStyle = colour;
  g.lineWidth = w;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
  g.stroke();
}
// A hand in the world's plain shapes, seen from its back: the wrist at (0, 0), the fingers toward +x, the thumb on the
// −y side; L — its length. `fingers`: where each fingertip is ([x, y] in lengths of the hand), index first; `thumb`:
// its tip. Each finger its own shape, edged a little darker so they read apart.
function hand(g, L, skin, edge, fingers, thumb) {
  const limb = (x0, y0, x1, y1, w) => {
    bar(g, x0 * L, y0 * L, x1 * L, y1 * L, w * L, edge);
    bar(g, x0 * L, y0 * L, x1 * L, y1 * L, (w - 0.022) * L, skin);
  };
  limb(0.2, -0.24, thumb[0], thumb[1], 0.135);
  limb(0.16, 0, 0.3, 0, 0.46);
  fingers.forEach(([x, y], i) => limb(0.46, -0.18 + 0.12 * i, x, y, 0.118));
}
// the fingers of a hand laid flat, a little fanned; of one pinching a thread between the index and the thumb
const GRASP = { fingers: [[0.9, -0.17], [0.96, -0.06], [0.93, 0.055], [0.83, 0.16]], thumb: [0.52, -0.36] };
const PINCH = { fingers: [[0.62, -0.5], [0.62, -0.1], [0.6, 0.03], [0.56, 0.15]], thumb: [0.6, -0.5], tip: [0.62, -0.52] };

// the yacht on the bench, bow to the right (x from the frame's middle): where its parts are
const RIG = (() => {
  const deck = 0.6, mast = 0.03;
  return {
    keel: [0, 0.665], // what it rocks about, on its cradle
    stern: -0.31, bow: 0.33, deck,
    mast, top: 0.1,
    tack: [mast - 0.012, deck - 0.085], head: [mast - 0.012, 0.125], clew: [-0.29, deck - 0.085], // the mainsail (and its boom)
    cleat: [-0.285, deck - 0.006], // where the mainsheet is made fast, on the stern
    jibTack: [0.315, deck - 0.012], jibHead: [mast + 0.014, 0.16], jibClew: [mast + 0.05, deck - 0.075],
    jibCleat: [mast + 0.1, deck - 0.004],
    furled: 0.07, swung: 0.74, small: 0.12, slack: 0.85, // the sails before they are set
  };
})();
const turned = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
// where the parts are as rig1…rig4 have them (x from the frame's middle): the sails' scales, the sheets' turns, where
// her fingers hold each fastening (holds) and the one she makes now (at)
function rigged(S) {
  const r1 = clamp01(S.rig1), r2 = clamp01(S.rig2), r3 = clamp01(S.rig3), r4 = clamp01(S.rig4), R = RIG;
  const up = R.furled + (1 - R.furled) * r1, aft = R.swung + (1 - R.swung) * r2;
  const jib = R.small + (1 - R.small) * r3, flat = jib * (R.slack + (1 - R.slack) * r4);
  const end = [R.tack[0] + (R.clew[0] - R.tack[0]) * aft, R.clew[1]]; // the boom's end
  const clew = [R.jibTack[0] + (R.jibClew[0] - R.jibTack[0]) * flat, R.jibTack[1] + (R.jibClew[1] - R.jibTack[1]) * jib];
  const mainTurn = -0.785 * (1 - r2), jibTurn = 0.873 * (1 - r4);
  const sheet = turned([R.cleat[0] - R.clew[0], R.cleat[1] - R.clew[1]], mainTurn), jibSheet = turned([R.jibCleat[0] - R.jibClew[0], R.jibCleat[1] - R.jibClew[1]], jibTurn);
  const holds = [
    [R.head[0], R.tack[1] + (R.head[1] - R.tack[1]) * up],
    [end[0] + sheet[0], end[1] + sheet[1]],
    [R.jibTack[0] + (R.jibHead[0] - R.jibTack[0]) * flat, R.jibTack[1] + (R.jibHead[1] - R.jibTack[1]) * jib],
    [clew[0] + jibSheet[0], clew[1] + jibSheet[1]],
  ];
  const now = [r1, r2, r3, r4].findIndex((r) => r < 0.999), at = now < 0 ? null : holds[now];
  return { up, aft, jib, flat, end, clew, mainTurn, jibTurn, holds, at, busy: [r1, r2, r3, r4].some((r) => r > 0.001 && r < 0.999) };
}
const SKIN = { longren: ["#b4886a", "#8f6a50"], child: ["#c4936f", "#9d7354"], assol: ["#cf9f7c", "#a87c5d"] };
// her hand: where its pinch is painted (the layer goes from there to what she holds), how it is turned, how long it is
const HER = { at: [0, 0.4], turn: Math.PI + 0.42, L: 0.24 };
// his hand come from the left to steady the hull, laid round its stern: its wrist, its turn, its length; away — that
// much off, back the way it comes
const HIS = { wrist: [-0.52, 0.67], turn: -0.1, L: 0.36, away: [-1.1, 0.1] };
// the bench by the lamp on the right, half in the frame: the wall, the bench's top, the lamp and its flame (a layer) —
// what the shots `rig` and `match` stand on
function paintBench(g, e) {
  const W = e.aspect;
  // the wall and the bench's top, lit by the lamp on the right
  const wall = g.createLinearGradient(0, 0, W, 0);
  wall.addColorStop(0, "#55504f");
  wall.addColorStop(0.55, "#9c8a73");
  wall.addColorStop(1, "#e2c08e");
  g.fillStyle = wall;
  g.fillRect(-0.3, -0.35, W + 0.6, 1.1);
  const top = g.createLinearGradient(0, 0, W, 0);
  top.addColorStop(0, "#3f3a35");
  top.addColorStop(0.6, "#7a6a55");
  top.addColorStop(1, "#b8935f");
  g.fillStyle = top;
  g.fillRect(-0.3, 0.7, W + 0.6, 0.6);
  g.fillStyle = "rgba(255,244,222,0.35)";
  g.fillRect(-0.3, 0.7, W + 0.6, 0.006);
  g.fillStyle = "rgba(40,36,32,0.22)";
  for (const y of [0.79, 0.93]) g.fillRect(-0.3, y, W + 0.6, 0.004);
  // the lamp, half in the frame: its brass foot, its glass
  const lx = W - 0.13;
  g.fillStyle = "#504636";
  g.beginPath();
  g.moveTo(lx - 0.1, 0.74);
  g.lineTo(lx + 0.1, 0.74);
  g.lineTo(lx + 0.06, 0.67);
  g.lineTo(lx - 0.06, 0.67);
  g.fill();
  g.fillRect(lx - 0.08, 0.6, 0.16, 0.075);
  g.fillStyle = N.rgba("#fff2dc", 0.5);
  g.strokeStyle = N.rgba("#fff6e4", 0.7);
  g.lineWidth = 0.004;
  g.beginPath();
  g.ellipse(lx, 0.47, 0.07, 0.125, 0, 0, 7);
  g.fill();
  g.stroke();
  g.fillRect(lx - 0.034, 0.1, 0.068, 0.26);
  g.strokeRect(lx - 0.034, 0.1, 0.068, 0.26);
  e.layer("flame", { pivot: [lx, 0.53], flicker: 0.1 }, (g) => {
    g.fillStyle = "#ffc46a";
    g.beginPath();
    g.ellipse(lx, 0.482, 0.026, 0.06, 0, 0, 7);
    g.fill();
    g.fillStyle = "#fff6dc";
    g.beginPath();
    g.ellipse(lx, 0.492, 0.014, 0.036, 0, 0, 7);
    g.fill();
    e.light(lx, 0.48, 0.5, N.WARM, 0.8, "flame");
  });
}
function paintRig(g, e) {
  const W = e.aspect, cx = W / 2, R = RIG, scarlet = N.sail(1);
  paintBench(g, e);
  // what is left of the scarlet silk, the reel of thread
  g.fillStyle = N.mix(scarlet, "#40242a", 0.25);
  g.beginPath();
  g.moveTo(cx + 0.42, 0.78);
  g.quadraticCurveTo(cx + 0.5, 0.74, cx + 0.6, 0.775);
  g.lineTo(cx + 0.63, 0.83);
  g.quadraticCurveTo(cx + 0.52, 0.86, cx + 0.44, 0.835);
  g.closePath();
  g.fill();
  g.fillStyle = scarlet;
  g.beginPath();
  g.moveTo(cx + 0.44, 0.775);
  g.quadraticCurveTo(cx + 0.5, 0.75, cx + 0.59, 0.775);
  g.lineTo(cx + 0.55, 0.815);
  g.quadraticCurveTo(cx + 0.5, 0.8, cx + 0.45, 0.82);
  g.closePath();
  g.fill();
  g.fillStyle = "#d9d0bd";
  g.fillRect(cx + 0.7, 0.8, 0.05, 0.05);
  g.fillStyle = "#54463a";
  g.fillRect(cx + 0.69, 0.79, 0.07, 0.012);
  g.fillRect(cx + 0.69, 0.848, 0.07, 0.012);
  // the cradle the hull stands in, and its shadow on the bench
  g.fillStyle = "rgba(30,26,22,0.25)";
  g.beginPath();
  g.ellipse(cx - 0.04, 0.725, 0.36, 0.022, 0, 0, 7);
  g.fill();
  g.fillStyle = "#5f5a52";
  for (const x of [-0.2, 0.17]) {
    g.beginPath();
    g.moveTo(cx + x - 0.035, 0.72);
    g.lineTo(cx + x + 0.035, 0.72);
    g.lineTo(cx + x + 0.02, 0.64);
    g.lineTo(cx + x - 0.02, 0.64);
    g.fill();
  }
  // the yacht, each part a layer (what rocks, what is hoisted, what is hauled in)
  const part = (name, pivot, paint) => e.layer(name, { pivot: [cx + pivot[0], pivot[1]] }, (g) => { g.translate(cx, 0); paint(g); });
  part("mast", R.keel, (g) => {
    g.fillStyle = "#6b5a48";
    g.fillRect(R.mast - 0.006, R.top, 0.012, R.deck - R.top);
    // (the forestay)
    bar(g, R.mast, R.top + 0.03, R.jibTack[0], R.jibTack[1], 0.002, "rgba(60,54,48,0.7)");
  });
  part("boom", R.tack, (g) => bar(g, R.tack[0], R.tack[1] + 0.006, R.clew[0], R.clew[1] + 0.006, 0.008, "#6b5a48"));
  part("main", R.tack, (g) => {
    const cloth = g.createLinearGradient(R.clew[0], 0, R.tack[0], 0);
    cloth.addColorStop(0, N.mix(scarlet, "#40242a", 0.22));
    cloth.addColorStop(1, N.mix(scarlet, "#ffd9b0", 0.12));
    g.fillStyle = cloth;
    g.beginPath();
    g.moveTo(...R.tack);
    g.lineTo(...R.head);
    g.quadraticCurveTo(R.clew[0] * 0.42, 0.33, ...R.clew);
    g.closePath();
    g.fill();
  });
  part("jib", R.jibTack, (g) => {
    const cloth = g.createLinearGradient(R.jibHead[0], 0, R.jibTack[0], 0);
    cloth.addColorStop(0, N.mix(scarlet, "#40242a", 0.12));
    cloth.addColorStop(1, N.mix(scarlet, "#ffd9b0", 0.2));
    g.fillStyle = cloth;
    g.beginPath();
    g.moveTo(...R.jibHead);
    g.lineTo(...R.jibTack);
    g.quadraticCurveTo(0.17, R.deck - 0.07, ...R.jibClew);
    g.closePath();
    g.fill();
  });
  part("hull", R.keel, (g) => {
    const side = g.createLinearGradient(R.stern, R.deck, R.bow, R.keel[1]);
    side.addColorStop(0, "#b3aca3");
    side.addColorStop(0.55, "#e4ddd0");
    side.addColorStop(1, "#f7efde");
    g.fillStyle = side;
    g.beginPath();
    g.moveTo(R.stern, R.deck - 0.012);
    g.quadraticCurveTo(0, R.deck + 0.006, R.bow, R.deck - 0.02);
    g.quadraticCurveTo(R.bow - 0.05, R.keel[1] - 0.012, R.bow - 0.16, R.keel[1]);
    g.lineTo(R.stern + 0.1, R.keel[1]);
    g.quadraticCurveTo(R.stern + 0.01, R.keel[1] - 0.01, R.stern, R.deck - 0.012);
    g.fill();
    g.strokeStyle = "#8d8577";
    g.lineWidth = 0.004;
    g.beginPath();
    g.moveTo(R.stern, R.deck - 0.012);
    g.quadraticCurveTo(0, R.deck + 0.006, R.bow, R.deck - 0.02);
    g.stroke();
    g.fillStyle = "#4a443c";
    for (const c of [R.cleat, R.jibCleat]) g.fillRect(c[0] - 0.008, c[1] - 0.006, 0.016, 0.008);
  });
  part("sheet", R.clew, (g) => bar(g, R.clew[0], R.clew[1], R.cleat[0], R.cleat[1], 0.003, "#ece5d6"));
  part("jib_sheet", R.jibClew, (g) => bar(g, R.jibClew[0], R.jibClew[1], R.jibCleat[0], R.jibCleat[1], 0.003, "#ece5d6"));
  // his hand, come from the left: its fingers laid round the hull's stern, the thumb over the deck's edge
  e.layer("his", { pivot: [cx + HIS.wrist[0], HIS.wrist[1]], box: [cx - 2.7, 0.3, cx, 1.15] }, (g) => {
    g.translate(cx + HIS.wrist[0], HIS.wrist[1]);
    g.rotate(HIS.turn);
    bar(g, -1.4, 0, -0.07, 0, 0.27, "#3e4a58");
    bar(g, -0.07, 0, -0.03, 0, 0.2, "#bdb4a4");
    hand(g, HIS.L, ...SKIN.longren, GRASP.fingers, GRASP.thumb);
  });
  // her hand, from the right, at what she rigs
  e.layer("her", { pivot: [cx + HER.at[0], HER.at[1]], box: [cx - 0.6, -0.2, cx + 3.2, 2.2] }, (g) => {
    g.translate(cx + HER.at[0], HER.at[1]);
    g.rotate(HER.turn);
    g.scale(1, -1);
    g.translate(-PINCH.tip[0] * HER.L, -PINCH.tip[1] * HER.L);
    bar(g, -1.6, 0, -0.42, 0, 0.1, SKIN.child[0]);
    bar(g, -0.42, 0, -0.02, 0, 0.1, SKIN.child[1]);
    bar(g, -0.42, 0, -0.03, 0, 0.082, SKIN.child[0]);
    hand(g, HER.L, ...SKIN.child, PINCH.fingers, PINCH.thumb);
  });
  // what the game marks: where her fingers take each fastening as it begins (those before it made, it and those after
  // not yet) — where her hand comes to then
  for (let n = 1; n <= 4; n++) {
    const [x, y] = rigged({ rig1: n > 1 ? 1 : 0, rig2: n > 2 ? 1 : 0, rig3: n > 3 ? 1 : 0, rig4: 0 }).holds[n - 1];
    e.at(cx + x, y, `rig${n}`);
  }
  e.at(cx, 0.4);
}
// a layer of the yacht rocked `a` about its keel together with the rest: turned `own` about its own pivot (x from the
// frame's middle), moved `by` with what carries it
function rock(layer, pivot, a, own = 0, by = [0, 0]) {
  const gx = pivot[0] + by[0] - RIG.keel[0], gy = pivot[1] + by[1] - RIG.keel[1], c = Math.cos(a) - 1, s = Math.sin(a);
  layer.rotate = own + a;
  layer.x = by[0] + c * gx - s * gy;
  layer.y = by[1] + s * gx + c * gy;
}
function liveRig(e) {
  const S = e.state, m = e.mem, R = RIG, at = rigged(S), held = anim.ease.inOut(clamp01(S.guide));
  // unsteadied, the yacht rocks on its cradle under her fingers
  const a = (1 - held) * (at.busy ? 0.022 : 0.006) * anim.noise(e.t * (at.busy ? 2.6 : 0.9), 5);
  rock(e.layer("hull"), R.keel, a);
  rock(e.layer("mast"), R.keel, a);
  const boom = e.layer("boom"), main = e.layer("main"), jib = e.layer("jib");
  rock(boom, R.tack, a);
  boom.scaleX = at.aft;
  rock(main, R.tack, a);
  main.scaleX = at.aft;
  main.scaleY = at.up;
  rock(jib, R.jibTack, a);
  jib.scaleX = at.flat;
  jib.scaleY = at.jib;
  rock(e.layer("sheet"), R.clew, a, at.mainTurn, [at.end[0] - R.clew[0], at.end[1] - R.clew[1]]);
  rock(e.layer("jib_sheet"), R.jibClew, a, at.jibTurn, [at.clew[0] - R.jibClew[0], at.clew[1] - R.jibClew[1]]);
  const his = e.layer("his");
  his.x = HIS.away[0] * (1 - held);
  his.y = HIS.away[1] * (1 - held);
  his.rotate = 0.01 * anim.noise(e.t * 0.7, 9);
  // her fingers go to what she rigs now (all done: away to the right), a little late
  const to = at.at ?? [1.5, 1.1];
  if (m.x == null || e.cut < 0.05) { m.x = to[0]; m.y = to[1]; }
  const k = 1 - Math.exp(-9 * e.dt);
  m.x += (to[0] - m.x) * k;
  m.y += (to[1] - m.y) * k;
  const her = e.layer("her");
  her.x = m.x - HER.at[0];
  her.y = m.y - HER.at[1];
  her.rotate = 0.04 * anim.noise(e.t * 1.1, 3);
  e.layer("flame").scaleY = 1 + 0.1 * anim.noise(e.t * 1.9, 1);
}

// the page: where its lines are, the word, the beetle's way to it (x from the frame's middle)
const PAGE = (() => {
  const lines = 13, top = 0.1, step = 0.066, left = -0.6, right = 0.66, row = 7;
  const word = [0.04, top + step * row];
  return {
    lines, top, step, left, right, row, word, size: 0.052, lean: -0.05,
    way: [[-1.0, -0.1], [-0.5, 0.16], [-0.22, 0.2], [-0.02, 0.33], [-0.2, 0.44], [-0.1, 0.56], [word[0] + 0.05, word[1] + 0.052]],
    beetle: 0.075,
  };
})();
// a point of the beetle's way (u 0…1), smooth through its points, and the way it heads there (radians, 0 up the page)
function crawl(u) {
  const P = PAGE.way, n = P.length - 1, at = (t) => {
    const f = anim.clamp(t, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
    const c = (a, b, c2, d) => 0.5 * (2 * b + (c2 - a) * k + (2 * a - 5 * b + 4 * c2 - d) * k * k + (3 * b - a - 3 * c2 + d) * k * k * k);
    return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
  };
  const v = Math.min(0.99, Math.max(0.01, u)), p = at(u), q = at(v + 0.01), b = at(v - 0.01);
  return { x: p[0], y: p[1], heading: Math.atan2(q[0] - b[0], -(q[1] - b[1])), run: u * n };
}
const font = (size) => `italic ${Math.round(size * 1000)}px Georgia, "Times New Roman", serif`;
const BEETLE = ["legs_a", "legs_b", "beetle"];
function paintPage(g, e) {
  const W = e.aspect, cx = W / 2, P = PAGE;
  // her lap under the book
  g.fillStyle = "#cfc8bb";
  g.fillRect(-0.3, -0.35, W + 0.6, 1.6);
  g.save();
  g.translate(cx, 0.5);
  g.rotate(P.lean);
  g.translate(0, -0.5);
  // the page, lit from the window on the left; the other page falling away past the gutter
  const paper = g.createLinearGradient(-0.75, 0, 0.85, 0.6);
  paper.addColorStop(0, "#f4eee0");
  paper.addColorStop(1, "#e3dccb");
  g.fillStyle = "#d8d0bf";
  g.fillRect(-1.5, -0.3, 0.76, 1.75);
  g.fillStyle = paper;
  g.fillRect(-0.74, -0.3, 1.58, 1.75);
  const gutter = g.createLinearGradient(-0.74, 0, -0.56, 0);
  gutter.addColorStop(0, "rgba(60,52,44,0.42)");
  gutter.addColorStop(1, "rgba(60,52,44,0)");
  g.fillStyle = gutter;
  g.fillRect(-0.74, -0.3, 0.18, 1.75);
  const fold = g.createLinearGradient(-0.9, 0, -0.74, 0);
  fold.addColorStop(0, "rgba(60,52,44,0)");
  fold.addColorStop(1, "rgba(60,52,44,0.35)");
  g.fillStyle = fold;
  g.fillRect(-0.9, -0.3, 0.16, 1.75);
  g.fillStyle = "rgba(70,60,50,0.28)";
  g.fillRect(0.84, -0.3, 0.012, 1.75);
  // the window's bar lying across it, soft
  const shade = g.createLinearGradient(0, 0.7, 0.12, 0.86);
  shade.addColorStop(0, "rgba(70,74,84,0)");
  shade.addColorStop(0.5, "rgba(70,74,84,0.1)");
  shade.addColorStop(1, "rgba(70,74,84,0)");
  g.fillStyle = shade;
  g.fillRect(-0.74, 0.5, 1.58, 0.6);
  // the lines: words as plain strokes — and the one word that reads
  g.save();
  g.scale(0.001, 0.001);
  g.font = font(P.size);
  const wide = g.measureText(tr('Look')).width / 1000;
  g.restore();
  const ink = "rgba(74,66,58,0.5)";
  for (let k = 0; k < P.lines; k++) {
    const y = P.top + P.step * k, last = k === 4 || k === 12;
    let x = P.left + (k === 0 || k === 5 ? 0.07 : 0);
    const end = last ? P.right - 0.2 - 0.3 * e.rnd() : P.right;
    while (x < end - 0.03) {
      if (k === P.row && x > P.word[0] - wide / 2 - 0.09 && x < P.word[0] + wide / 2) { x = P.word[0] + wide / 2 + 0.03; continue; }
      const cap = k === P.row && x < P.word[0] ? P.word[0] - wide / 2 - 0.03 : end;
      const w = Math.min(0.035 + 0.11 * e.rnd(), cap - x);
      if (w > 0.012) bar(g, x + 0.006, y, x + w - 0.006, y, 0.012, ink);
      x += w + 0.022;
    }
  }
  g.save();
  g.translate(P.word[0], P.word[1]);
  g.scale(0.001, 0.001);
  g.font = font(P.size);
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  g.fillStyle = "#2b2622";
  g.fillText(tr('Look'), 0, 14);
  g.restore();
  g.restore();
  // her thumb on the page's edge, from below on the right
  e.layer("thumb", { pivot: [cx + 0.78, 1.2] }, (g) => {
    bar(g, cx + 0.86, 1.3, cx + 0.7, 0.9, 0.125, SKIN.assol[1]);
    bar(g, cx + 0.86, 1.3, cx + 0.7, 0.9, 0.105, SKIN.assol[0]);
    g.fillStyle = "rgba(255,240,225,0.5)";
    g.beginPath();
    g.ellipse(cx + 0.706, 0.9, 0.03, 0.04, -0.38, 0, 7);
    g.fill();
    // her ring on the finger that holds the page: a thin gold band (her mother's) or a wide dark one (his old one)
    const part = ringPart(e.state.ring, e.state.ring_kind);
    if (part) {
      const [rx, ry] = [cx + 0.812, 1.18], old = part === "ring_old";
      bar(g, rx - 0.058, ry + 0.023, rx + 0.058, ry - 0.023, old ? 0.034 : 0.016, old ? "#a98238" : "#d9b45a");
      bar(g, rx - 0.012, ry + 0.005, rx + 0.03, ry - 0.011, 0.006, "rgba(255,244,205,0.85)");
    }
  });
  // the beetle, painted heading up the page at the start of its way; its legs in their two strides (two layers). Its
  // layers reach as far as its way goes
  const [bx, by] = [cx + P.way[0][0], P.way[0][1]], s = P.beetle, reach = [cx - 1.3, -0.4, cx + 1.2, 1.3];
  const legs = (name, swing) => e.layer(name, { pivot: [bx, by], box: reach }, (g) => {
    g.translate(bx, by);
    g.strokeStyle = "#1f2622";
    g.lineWidth = 0.035 * s;
    g.lineCap = "round";
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
      const y = (-0.22 + 0.24 * i) * s, a = swing * (i % 2 ? -1 : 1) * side * 0.35, ky = y + Math.sin(a) * 0.12 * s;
      g.beginPath();
      g.moveTo(side * 0.2 * s, y);
      g.lineTo(side * 0.42 * s, ky - 0.06 * s);
      g.lineTo(side * 0.6 * s, ky + (0.1 + 0.12 * (i - 1)) * s);
      g.stroke();
    }
  });
  legs("legs_a", 1);
  legs("legs_b", -1);
  e.layer("beetle", { pivot: [bx, by], box: reach }, (g) => {
    g.translate(bx, by);
    g.strokeStyle = "#1f2622";
    g.lineWidth = 0.025 * s;
    g.lineCap = "round";
    for (const side of [-1, 1]) {
      g.beginPath();
      g.moveTo(side * 0.06 * s, -0.5 * s);
      g.quadraticCurveTo(side * 0.16 * s, -0.7 * s, side * 0.3 * s, -0.72 * s);
      g.stroke();
    }
    g.fillStyle = "#1f2622";
    g.beginPath();
    g.ellipse(0, -0.46 * s, 0.11 * s, 0.09 * s, 0, 0, 7);
    g.fill();
    g.fillStyle = "#2a3a33";
    g.beginPath();
    g.ellipse(0, -0.3 * s, 0.2 * s, 0.13 * s, 0, 0, 7);
    g.fill();
    g.fillStyle = "#30463c";
    g.beginPath();
    g.ellipse(0, 0.06 * s, 0.26 * s, 0.36 * s, 0, 0, 7);
    g.fill();
    g.strokeStyle = "#1c2924";
    g.lineWidth = 0.018 * s;
    g.beginPath();
    g.moveTo(0, -0.24 * s);
    g.lineTo(0, 0.4 * s);
    g.stroke();
    g.strokeStyle = "rgba(170,205,185,0.55)";
    g.lineWidth = 0.035 * s;
    g.beginPath();
    g.moveTo(-0.12 * s, -0.14 * s);
    g.quadraticCurveTo(-0.17 * s, 0.05 * s, -0.12 * s, 0.22 * s);
    g.stroke();
  });
  // (the word as the page leans: for the game)
  const [wx, wy] = turned([P.word[0], P.word[1] - 0.5], P.lean);
  e.at(cx + wx, 0.5 + wy, "word");
  e.at(cx, 0.5);
}
function livePage(e) {
  const P = PAGE, cx = e.aspect / 2, c = crawl(clamp01(e.state.beetle));
  const [x, y] = turned([c.x, c.y - 0.5], P.lean), going = Math.abs(e.speed("beetle")) > 0.002;
  // (its feet: a stride every ninth of a leg of its way; its body swaying with them as it goes)
  const stride = (c.run * 9) % 1, sway = going ? 0.09 * Math.sin(stride * 2 * Math.PI) : 0;
  for (let i = 0; i < BEETLE.length; i++) {
    const L = e.layer(BEETLE[i]);
    L.x = x - P.way[0][0];
    L.y = 0.5 + y - P.way[0][1];
    L.rotate = c.heading + P.lean + sway;
  }
  e.layer("legs_a").alpha = stride < 0.5 ? 1 : 0;
  e.layer("legs_b").alpha = stride < 0.5 ? 0 : 1;
  e.at(cx + x, 0.5 + y, "beetle");
  e.layer("thumb").rotate = 0.012 * anim.noise(e.t * 0.5, 7);
}

// the match: the cut from the prologue. The dawn sea and sky in the prologue's colours (hour 0.25), and on the sea a toy
// yacht under white sails, as small and where the prologue's ship is (the party's keys: match_x, match_y — where its sails
// are on the frame, in frame heights from its middle, x to the right, y down —, match_s — its height in frame heights;
// they are the game's, read by the animate only). `match` 0 → 1: it grows to its place on the bench, the sea goes
// (a layer's alpha), the bench, the lamp and Longren's big hands setting it down come out
const MATCH = { high: 0.5, bench: 0.76, k: 0.5 / 0.42, horizon: 0.46, wrist: 0.56, wristY: 0.7, hand: 0.42 };
// Assol's yacht as it is made — Longren's work: the hull, the mast, two white sails (ships.toy's are scarlet); its
// keel at 0, 0.34 m long, the mast 0.42 m high
function whiteToy(g) {
  g.fillStyle = "#d9d3c6";
  g.beginPath();
  g.moveTo(-0.17, -0.06);
  g.lineTo(0.17, -0.07);
  g.quadraticCurveTo(0.12, 0, -0.1, 0);
  g.closePath();
  g.fill();
  g.fillStyle = "#6b5a48";
  g.fillRect(-0.004, -0.42, 0.008, 0.36);
  g.fillStyle = N.WHITE;
  g.strokeStyle = "rgba(110,100,92,0.55)";
  g.lineWidth = 0.004;
  for (const sail of [[[-0.012, -0.4], [-0.012, -0.09], [-0.13, -0.09]], [[0.012, -0.36], [0.012, -0.1], [0.13, -0.1]]]) {
    g.beginPath();
    g.moveTo(...sail[0]);
    g.lineTo(...sail[1]);
    g.lineTo(...sail[2]);
    g.closePath();
    g.fill();
    g.stroke();
  }
}
function paintMatch(g, e) {
  const W = e.aspect, cx = W / 2, M = MATCH, hy = M.horizon, dawn = N.palette(0.25);
  // the bench under it all, and the shadow the yacht will cast on it
  paintBench(g, e);
  g.fillStyle = "rgba(30,26,22,0.28)";
  g.beginPath();
  g.ellipse(cx - 0.02, M.bench + 0.005, 0.24, 0.02, 0, 0, 7);
  g.fill();
  // the sea and the sky over the bench (a layer: it goes), the glow low over the water
  e.layer("sea", { pivot: [cx, 0.5], box: [-0.3, -0.35, W + 0.3, 1.35] }, (g) => {
    const sky = g.createLinearGradient(0, -0.35, 0, hy);
    sky.addColorStop(0, dawn.top);
    sky.addColorStop(0.5, dawn.mid);
    sky.addColorStop(0.88, dawn.low);
    sky.addColorStop(1, dawn.glow);
    g.fillStyle = sky;
    g.fillRect(-0.3, -0.35, W + 0.6, hy + 0.35);
    const sea = g.createLinearGradient(0, hy, 0, 1.35);
    sea.addColorStop(0, N.mix(dawn.sea, dawn.glow, 0.55));
    sea.addColorStop(1, dawn.sea);
    g.fillStyle = sea;
    g.fillRect(-0.3, hy, W + 0.6, 1.35 - hy);
    for (let i = 0; i < 16; i++) {
      const y = hy + 0.02 + 0.5 * (i / 16) ** 1.6, half = 0.04 + 0.2 * (y - hy) + 0.05 * e.rnd();
      bar(g, cx - half + 0.3 * (e.rnd() - 0.5), y, cx + half + 0.3 * (e.rnd() - 0.5), y, 0.004 + 0.004 * (y - hy), N.rgba(dawn.glow, 0.5));
    }
  });
  // the yacht, on its keel (a layer: it grows from the spark to the size on the bench, about its middle)
  e.layer("yacht", { pivot: [cx, M.bench - M.high / 2], box: [cx - 0.5, M.bench - M.high - 0.05, cx + 0.5, M.bench + 0.05] }, (g) => {
    g.translate(cx, M.bench);
    g.scale(M.k, M.k);
    whiteToy(g);
  });
  // Longren's big hands, a sleeve each, come from the sides to the hull (a layer apiece)
  for (const side of [-1, 1]) {
    const wrist = [cx + side * M.wrist, M.wristY];
    e.layer(side < 0 ? "hand_l" : "hand_r", { pivot: wrist, box: side < 0 ? [cx - 2.8, 0.2, cx, 1.4] : [cx, 0.2, cx + 2.8, 1.4] }, (g) => {
      g.translate(...wrist);
      g.scale(-side, 1);
      bar(g, -1.4, 0, -0.07, 0, 0.3, "#3e4a58");
      bar(g, -0.07, 0, -0.03, 0, 0.22, "#bdb4a4");
      hand(g, M.hand, ...SKIN.longren, GRASP.fingers, GRASP.thumb);
    });
  }
}
const smooth = (v, from, to) => anim.ease.inOut(anim.clamp((v - from) / (to - from), 0, 1));
function liveMatch(e) {
  const S = e.state, M = MATCH, cx = e.aspect / 2, u = clamp01(S.match), grow = anim.ease.inOut(u), end = [cx, M.bench - M.high / 2];
  const yacht = e.layer("yacht"), spark = anim.clamp(num(S.match_s), 0.0005, M.high) / M.high;
  yacht.scaleX = yacht.scaleY = spark ** (1 - grow);
  yacht.x = cx + num(S.match_x) + (end[0] - cx - num(S.match_x)) * grow - end[0];
  yacht.y = 0.5 + num(S.match_y) + (end[1] - 0.5 - num(S.match_y)) * grow - end[1];
  yacht.rotate = (1 - grow) * 0.05 * anim.noise(e.t * 0.7, 2);
  const sea = 1 - smooth(u, 0.3, 0.8), come = smooth(u, 0.55, 1);
  e.layer("sea").alpha = sea;
  e.layer("flame").alpha = 1 - sea;
  e.layer("flame").scaleY = 1 + 0.1 * anim.noise(e.t * 1.9, 1);
  // (a hand is off the frame, then comes to the hull)
  for (const [name, side] of [["hand_l", -1], ["hand_r", 1]]) {
    const arm = e.layer(name);
    arm.alpha = Math.min(1, 4 * come);
    arm.x = side * 0.8 * (1 - come);
    arm.y = 0.45 * (1 - come);
  }
}
function closeup(g, e) {
  const shot = e.state.closeup_shot;
  if (shot === "rig") paintRig(g, e);
  else if (shot === "page") paintPage(g, e);
  else if (shot === "match") paintMatch(g, e);
}
function closeupMotion(e) {
  // (nothing of it to move while it is not painted — closed, or its shot's layers not there yet)
  const shot = e.state.closeup_shot;
  if (shot === "rig" && e.layer("hull").scaleX) liveRig(e);
  else if (shot === "page" && e.layer("thumb").scaleX) livePage(e);
  else if (shot === "match" && e.layer("yacht").scaleX) liveMatch(e);
}

// ── the film ──
// where things are (metres: across, distance, elevation)
const AT_WORK = [-0.58, 2.5], // where Longren stands at the bench, before his work (facing it: 270)
  SEAT = [-0.68, 3.6, 0.6], // the stool's seat
  ON_BENCH = [-0.93, 3.5, 0.88], // the bench's edge by the stool, where her hand lies
  LAMP = [-1.3, 3.2, 1.05],
  TO_LAMP = [-0.86, 3.3, 1.22], // the yacht held up to the lamp's light, before her face
  BEFORE = [-0.12, 3.6], // (Longren on the stool, turned to the room: she stands before his knees) here, facing him (270)
  KNEES = [[-0.3, 3.5, 0.52], [-0.3, 3.72, 0.52]], // his knees then: her hands on them
  AT_SHELF = [1.35, 4.42], // under the board over the window, where her yacht goes (facing it: 0)
  AT_WINDOW = [1.25, 4.4], // Longren at the window, beside the chair (facing out: 0)
  DOOR_OUT = [2.42, 6.3], DOOR_IN = [2.42, 4.75], BY_DOOR = [2.0, 4.25], // the yard, the doorway, by the door inside
  BY_HER = [1.62, 4.12], // …and Longren come up to her there
  AT_CHEST = pulling(0), CHEST_OUT = pulling(1), // before the chest in its corner (facing it: 0) — and pulled out
  CHAIR = [0.75, 4.6, 0.46], // the chair's seat (she sits turned toward the door, the window on her left: 75)
  BEHIND = [0.28, 4.35], // Longren by her chair, on the room's side of it, his hand on her shoulder
  ASIDE = [1.6, 4.9, 1.2], // toward the door, where the shout comes from
  WINDOW = [0.75, 5.6, 1.5], SEA = [0, 60, 1.2],
  ON_PAGE = [1.09, 4.69, 0.78], // the page of the book in her hands, as she sits on the chair
  SAILS_AT = "ship_rig#ship", // the ship's sails
  STREET = [[4.6, 6.3], [1.3, 6.3], [-2.4, 6.3]], // the collier's way past the window, on the grass outside
  BOOK = [1.12, 4.25], // where her book falls
  GIRL_OUT = [2.55, 8.4], // the girl in the yard, far from the door (she runs in from there)
  GIRL_AT = [1.3, 4.2]; // …and where she stops: by Assol's knees on the room's side of them, off her way from the chair to the door
// the way from one place to another, degrees (0 away from us, 90 to the right)
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
// where he stands to push the chest back with his foot, the chest `c` out: half a metre before its front, on its way
const kicking = (c) => [CHEST.across + CHEST.out[0] * c + (CHEST.out[0] / PULL) * 0.5, CHEST.distance + CHEST.out[1] * c + (CHEST.out[1] / PULL) * 0.5];
const TO_CORNER = toward(kicking(1), kicking(0));
// into a motion: when its hand lets go of what it puts down, its foot meets what it pushes (seconds from its start)
const LAID = 1.2, SET_DOWN = 0.8, SHELVED = 1.6, KICKED = 1.0;

// the shots (the camera's keys over the scene's own: metres right, metres ahead, degrees to the right)
const shot = (x, z, yaw) => ({ camera_x: x, camera_z: z, camera_yaw: yaw });
const WIDE = shot(1.1, 0.1, -22), // the room from its right, the bench and the lamp on the left, the window ahead
  BENCH = shot(1.4, 2.2, -62), // from beside the father, across the bench: her and the lamp
  KNEELS = shot(0.6, 1.2, -22),
  SHELF = shot(0.3, 0.4, 4),
  YEARS_ON = shot(0.5, 0.3, 10),
  STAYS = shot(0.6, 0.3, -24),
  BACK = shot(0.5, 0.2, -8),
  MORNING = shot(1.3, 2.2, -12),
  OVER_PAGE = shot(0.3, 2.4, 12),
  SAILS = shot(0.2, 1.8, 22),
  CRY = shot(0.6, 0.8, 6),
  // (close, from over the bench, on the line from her face through the yacht she holds up — the sails before her face;
  // the lens raised and lowered onto her: she sits lower than the eye)
  GLOW_NEAR = { ...shot(-1.09, 2.68, 22), camera_h: 0.15, camera_pitch: -26 },
  DECIDE_VIEW = shot(2.4, 1.3, -27), // (from the room's right: the chest in its corner clear of the stool and the bench, he at the window, she by the door — all in the middle of the frame)
  LOOK_VIEW = shot(1.65, 3.0, -26), // (near her, the window behind her; Longren at the bench out of the frame)
  GIRL_VIEW = shot(1.5, 2.0, 2), // (the door, the chair, the girl by it — whole, the lens lowered as in `look`)
  // (from behind her, the lens lowered: she on her chair whole, the back of her head a little left of the middle, the
  // window, the sails in its upper right pane over her shoulder, the floor by the chair where the book falls)
  BEHIND_HER = { ...shot(0.6, 2.3, 6), camera_pitch: -16 },
  DAWN = shot(0.9, 1.0, -2); // (the rising sun in the window's right pane, beside her head)
// «Look»: the camera is lowered to the page with her eyes (degrees; the beat `look` leaves it so), and `gaze` 0…1
// lifts it level again as her eyes go from the page to the window (the script: gazed, camera_look)
const PAGE_PITCH = -12;
const gazed = (gaze) => ON_PAGE.map((p, i) => p + (WINDOW[i] - p) * anim.clamp(num(gaze), 0, 1));
// (a sequence of the beat's: stopped with it, whether the beat has come to await it or not)
const cam = (s, to, over) => s.sequence((q) => q.all(Object.keys(to).map((k) => q.move(k, to[k], { over, ease: "inOut" }))));
const ORDER = ["match", "evening", "scrap", "rig", "glow", "glow_close", "tell", "why", "shelf", "years", "decide", "chest_out", "stay", "unpack", "read", "beetle", "cry", "look", "girl_in", "sails_window", "sails_close", "wake", "out"];

// film(scene) — the scene its people are measured on (where a motion done once begins: startOf)
function film(scene) {
  const off = (id, motion, turn) => scene.startOf(id, motion, turn) ?? { across: 0, distance: 0, turn };
  const loop = (motion) => ({ motion, loop: true });
  // (held in a motion's last pose, as after it was done)
  const done = (motion) => ({ motion, loop: false, from: 99 });
  // where a motion done once, begun on a seat and ending facing `turn`, leaves them
  const landed = (id, motion, seat, turn) => { const o = off(id, motion, turn); return [seat[0] - o.across, seat[1] - o.distance]; };
  // all a shot's values: what its keys move, the hour's light
  const whole = (v) => ({ ...v, ...placed(v), ...N.keys(v.hour) });
  const walkTo = (s, id, points, turn, gait) => s.sequence(async (q) => {
    await q.person(id).walk(points, gait ? { gait } : undefined);
    if (turn != null) await q.person(id).turn(turn);
  });
  // off a seat into a motion done once (down off the stool, up off the chair): let go and set where it lands in the
  // same moment — the motion goes from where they sat to there
  const offSeat = (s, id, [ka, kd], motion, seat, turn) => {
    const [a, d] = landed(id, motion, seat, turn);
    s.set(ka, a); s.set(kd, d);
    s.person(id).on(null);
    return s.person(id).do(motion);
  };

  // ── what the game carries in (the party's keys — ring, ring_kind, longren, girl_toy, sun: no beat's `from` sets them;
  // the scene's states have their defaults) ──
  // the parts she wears: the ring, if it is on her finger, whatever else she takes or gives
  const worn = (...parts) => {
    const all = [...parts, ringPart(scene.get("ring"), scene.get("ring_kind"))].filter(Boolean);
    return all.length ? all : null;
  };
  const atSea = () => scene.get("longren") === "sea";
  // the hour of the morning's beats: the play's `sun` (the game keeps the hour of its last chapter going forward
  // through its scenes), or, when no game gives one, the beat's own
  const hourOr = (own) => { const v = scene.get("sun"); return typeof v === "number" ? v : own; };
  // the girl has had the yacht from her: the board over the window is empty
  const yachtGiven = () => scene.get("girl_toy") > 0.5;

  // ── the states the beats begin at ──
  const room = {
    fade: 0, camera_target: null, camera_h: 0, camera_pitch: 0, camera_look: 0, lamp: 1, toys: 0, toy_on_shelf: 0, chest: 0, door: 0, window_open: 0,
    sails_window: 0, basket: 0, book_down: 0, guide: 0, gaze: 0, closeup: 0, closeup_shot: null, rig1: 0, rig2: 0, rig3: 0, rig4: 0, beetle: 0,
    match: 0, scrap: 0, scrap_taken: 0, chest_here: 1, yacht_glow: 0, sails_light: 0,
  };
  // the close shots: the match on the bench; the scrap of scarlet silk; the bench with the yacht to rig; the page, the
  // beetle at the start of its way
  const MATCH_SHOT = { closeup: 1, closeup_shot: "match", match: 0 };
  const SCRAP_SHOT = { scrap: 1, scrap_taken: 0 };
  const RIG_SHOT = { closeup: 1, closeup_shot: "rig", rig1: 0, rig2: 0, rig3: 0, rig4: 0, guide: 0 };
  const PAGE_SHOT = { closeup: 1, closeup_shot: "page", beetle: 0 };
  // back from a close shot (an insert) to the room
  const back = (s) => { if (s.get("closeup") || s.get("scrap")) s.cut({ closeup: 0, scrap: 0 }); };
  const later = { toys: 0.5, toy_on_shelf: 1 };
  // Longren at the bench, whittling; Assol (eight) on the stool beside it, her arm on the bench, watching his hands;
  // the collier nowhere yet
  const longren = {
    longren_here: true, lo_a: AT_WORK[0], lo_d: AT_WORK[1], longren_do: loop("carve"), longren_turn: 270, longren_look: "work", longren_reach: null,
    longren_with: ["knife"], longren_on: null, longren_gait: null,
  };
  const assol = {
    assol_here: true, as_a: SEAT[0], as_d: SEAT[1], assol_do: loop("seated"), assol_turn: 200, assol_look: "work", assol_reach: { r: ON_BENCH },
    assol_with: null, assol_on: SEAT, assol_wear: null, assol_gait: null,
  };
  const grown = () => ({ ...assol, assol_wear: kit.cast.characters.assol, assol_on: null, assol_reach: null, assol_look: null, assol_with: worn() });
  const gone = { assol_here: false, assol_on: null, assol_reach: null, assol_with: null };
  const filipp = { filipp_here: false, fi_a: STREET[0][0], fi_d: STREET[0][1], filipp_do: "stand", filipp_turn: 270, filipp_look: null, filipp_with: ["baskets"] };
  // the little girl, in the yard far from the door, the yacht in her hands, not here yet
  const girl = { girl_here: false, gi_a: GIRL_OUT[0], gi_d: GIRL_OUT[1], girl_do: "stand", girl_turn: 180, girl_look: null, girl_reach: null, girl_with: ["yacht"], girl_gait: null };

  const EVENING = { ...room, ...WIDE, hour: 0.78, ...longren, ...assol, ...filipp, ...girl };
  const RIGGED = { ...EVENING, ...BENCH, longren_do: "stand", longren_with: null, assol_reach: { r: "work", l: "work" } };
  const GLOWS = { ...RIGGED, assol_with: ["yacht"], assol_reach: { r: TO_LAMP, l: TO_LAMP }, assol_look: TO_LAMP, longren_look: "assol" };
  const told = () => {
    const [a, d] = landed("assol", "hop_down", SEAT, 150);
    return {
      ...GLOWS, ...WIDE, window_open: 1, assol_on: null, as_a: a, as_d: d, assol_turn: toward([a, d], AT_WORK), assol_do: done("tell"), assol_reach: null,
      assol_with: ["yacht_r"], assol_look: "longren", longren_turn: toward(AT_WORK, [a, d]),
    };
  };
  // night, later: she is asleep; he under the board over the window, her yacht in his hand
  const NIGHT = {
    ...room, ...SHELF, hour: 0.93, ...longren, lo_a: AT_SHELF[0], lo_d: AT_SHELF[1], longren_turn: 0, longren_do: "stand", longren_look: "shelves#yacht",
    longren_with: ["yacht_r"], ...assol, ...gone, ...filipp, ...girl,
  };
  // nine years on: day, the shelves half empty, her yacht on its board; he at the window with his pipe; she in the
  // yard with the basket, the door shut
  const YEARS = () => ({
    ...room, ...later, ...YEARS_ON, hour: 0.42, lamp: 0, ...longren, lo_a: AT_WINDOW[0], lo_d: AT_WINDOW[1], longren_turn: 0, longren_do: loop("pipe"),
    longren_look: SEA, longren_with: ["pipe"], ...grown(), as_a: DOOR_OUT[0], as_d: DOOR_OUT[1], assol_turn: 180, assol_do: "stand", assol_with: worn("basket"),
    ...filipp, ...girl,
  });
  const CAME = () => ({ ...YEARS(), door: 1, as_a: BY_DOOR[0], as_d: BY_DOOR[1], assol_turn: 210, assol_do: done("put_basket"), assol_with: worn(), basket: 1, assol_look: "longren" });
  const DECIDES = () => ({ ...CAME(), ...DECIDE_VIEW, longren_turn: 115, longren_look: "assol", longren_do: "stand" });
  // a night after: the lamp, the chest out in the room, the door shut; he outside it, back from the shore
  const RETURNS = {
    ...room, ...later, ...BACK, hour: 0.92, chest: 1, ...longren, lo_a: DOOR_OUT[0], lo_d: DOOR_OUT[1], longren_turn: 180, longren_do: "stand",
    longren_look: null, longren_with: null, ...assol, ...gone, ...filipp, ...girl,
  };
  // a morning: she on the chair by the window, turned toward the door (the window on her left), reading. Longren, as the
  // game has it: at home (or knowing) — seated at the bench, empty now, the knife in his hands; at sea — nowhere, and
  // the chest with him. The board over the window: her yacht, unless the girl has it. The hour: the play's `sun`, else 0.31
  const READS = () => ({
    ...room, ...later, toy_on_shelf: yachtGiven() ? 0 : 1, ...MORNING, hour: hourOr(0.31), lamp: 0, ...longren,
    ...(atSea()
      ? { longren_here: false, longren_do: "stand", longren_look: null, longren_with: null, chest_here: 0 }
      : { lo_a: SEAT[0], lo_d: SEAT[1], longren_on: SEAT, longren_turn: 200, longren_do: loop("seated"), longren_look: null }),
    ...grown(), as_a: CHAIR[0], as_d: CHAIR[1], assol_on: CHAIR, assol_turn: 75, assol_do: loop("read"), assol_look: "assol#hands", assol_with: worn("book"),
    ...filipp, ...girl,
  });
  // the dawn after the night of waiting: asleep on the chair, the book in her lap; he by the chair, looking at her (at
  // sea: nobody). The hour: the play's `sun`, else 0.245
  const DAWNS = () => ({
    ...READS(), ...DAWN, hour: hourOr(0.245), assol_do: loop("doze"),
    ...(atSea() ? {} : { lo_a: BEHIND[0], lo_d: BEHIND[1], longren_on: null, longren_turn: toward(BEHIND, CHAIR), longren_do: "stand", longren_with: null, longren_look: "assol" }),
  });
  const WOKEN = () => ({ ...DAWNS(), longren_reach: { r: "assol#shoulder_r" }, assol_do: loop("read"), assol_look: "longren" });

  // Each beat: `from` — all it does not set itself (cut to when it does not follow one of `after`); `run` — what
  // happens, as long as its people take; what a game waits for in it, the scene tells ('<beat>:<moment>').
  return {
    // match — the cut from the prologue: the dawn sea of its last frame and on it a speck, the white sails of a toy yacht
    // where the prologue's ship is; it grows into the yacht on Longren's bench (the lamp, his big hands setting it down)
    match: {
      from: () => whole({ ...EVENING, ...MATCH_SHOT }),
      run: async (s) => {
        await s.move("match", 1, { over: 4, ease: "inOut" });
        s.tell("match:near");
        await s.wait(2);
      },
    },
    // evening — the lamp lit. Longren at the bench whittles the hull of a yacht; Assol on the stool beside it, her arm
    // on the bench, watches his hands (a glance at the lamp, and back)
    evening: {
      from: () => whole(EVENING),
      run: async (s) => {
        const as = s.person("assol");
        await s.wait(3.2);
        as.look(LAMP);
        await s.wait(1.4);
        as.look("work");
        await s.wait(3.4);
      },
    },
    // scrap — a cut into the insert `scrap`: the scrap of scarlet silk on the bench by the lamp, her fingers beside it; the
    // game waits for a touch — she takes it (`scrap_taken`, the game's)
    scrap: {
      after: "evening",
      from: () => whole(EVENING),
      run: async (s) => {
        const close = s.shot(SCRAP_SHOT);
        await s.until(() => close.ready);
        close.cut();
        s.tell("scrap:close");
        await s.wait(2.5);
      },
    },
    // rig — he lays the knife down, her hands at the hull; close — the bench: the hull, the mast, the scarlet silk (the
    // game's «Rigging»: rig1…rig4 — the sails and their sheets made fast, `guide` — his hand steadying it)
    rig: {
      after: ["evening", "scrap"],
      from: () => whole(EVENING),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol");
        const close = s.shot(RIG_SHOT);
        back(s);
        const near = cam(s, BENCH, 2.5);
        const lay = lo.do("lay_down");
        await s.wait(0.3);
        as.reach({ r: "work", l: "work" });
        await s.wait(LAID - 0.3);
        lo.with(null);
        await s.all(lay, near);
        lo.do("stand", { loop: true });
        lo.look("work");
        await s.until(() => close.ready);
        close.cut();
        s.tell("rig:close");
        await s.wait(1.5);
      },
    },
    // glow — the yacht done: she holds it up to the lamp; he looks at her
    glow: {
      after: "rig",
      from: () => whole(RIGGED),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol");
        back(s);
        as.with(["yacht"]);
        as.reach({ r: TO_LAMP, l: TO_LAMP });
        as.look(TO_LAMP);
        lo.reach(null);
        await s.wait(0.8);
        lo.look("assol");
        s.tell("glow:up");
        await s.wait(5.2);
      },
    },
    // glow_close — (close, by the camera) the yacht held up before her face against the lamp, its sails covering it; the
    // scarlet of them on her hands and her hair: a small light of the scene at the yacht
    glow_close: {
      after: "glow",
      from: () => whole(GLOWS),
      run: async (s) => {
        const near = cam(s, GLOW_NEAR, 1.6);
        s.move("yacht_glow", 1, { over: 1.6, ease: "inOut" });
        await s.all(near, s.wait(5));
      },
    },
    // tell — the window open. She slides off the stool and shows him the ship with her arms: so big, there; he turns
    // to her and listens. Outside the open window the collier with his baskets passes, stops a moment, looks in
    tell: {
      after: ["glow", "glow_close"],
      from: () => whole(GLOWS),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol"), fi = s.person("filipp");
        s.move("yacht_glow", 0, { over: 1.2, ease: "inOut" });
        s.move("window_open", 1, { over: 2.5, ease: "inOut" });
        const wide = cam(s, { ...WIDE, camera_h: 0, camera_pitch: 0 }, 2.5);
        as.reach(null);
        as.with(["yacht_r"]);
        as.look("longren");
        const passes = s.sequence(async (q) => {
          await q.wait(2);
          fi.here(true);
          await fi.walk([STREET[1]]);
          fi.look("assol");
          q.tell("tell:collier");
          await q.wait(1.6);
          const on = fi.walk([STREET[2]]);
          await q.wait(1.2);
          fi.look(null);
          await on;
          fi.here(false);
        });
        await as.turn(150);
        await offSeat(s, "assol", ["as_a", "as_d"], "hop_down", SEAT, 150);
        s.tell("tell:down");
        lo.look("assol");
        const here = [s.get("as_a"), s.get("as_d")];
        lo.turn(toward(AT_WORK, here));
        await as.turn(toward(here, AT_WORK));
        await s.all(as.do("tell"), passes, wide);
      },
    },
    // why — "Why won't they play with us?" He sits on the stool, turned to the room; she stands at his knees, her
    // hands on them, looking up; his hand on her head
    why: {
      after: "tell",
      from: () => whole(told()),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol");
        s.move("window_open", 0, { over: 2.5, ease: "inOut" });
        const near = cam(s, KNEELS, 3);
        // (she steps out of his way first, to where she will stand before him)
        const steps = walkTo(s, "assol", [BEFORE], 270);
        await s.wait(0.5);
        await lo.go("sit_down", { to: [SEAT[0], SEAT[1]], turn: 90 });
        lo.on(SEAT);
        lo.do("seated", { loop: true });
        await steps;
        as.look("longren");
        as.reach({ r: KNEES[0], l: KNEES[1] });
        lo.look("assol");
        s.tell("why:knees");
        await s.wait(0.8);
        lo.reach({ r: "assol#head" });
        await s.all(near, s.wait(3.6));
      },
    },
    // shelf — night, later: Assol asleep. He sets her yacht up on the board over the window, without a word
    shelf: {
      from: () => whole({ ...NIGHT, fade: 1 }),
      run: async (s) => {
        const lo = s.person("longren");
        s.move("fade", 0, { over: 1.2, ease: "out" });
        await s.wait(0.6);
        const up = lo.do("shelve");
        await s.wait(0.6);
        lo.reach({ r: "shelves#yacht", l: "shelves#yacht" });
        await s.wait(SHELVED - 0.6);
        s.set("toy_on_shelf", 1);
        lo.with(null);
        s.tell("shelf:placed");
        await s.wait(0.4);
        lo.reach(null);
        await up;
        await s.wait(0.6);
      },
    },
    // years — nine years later, day: the shelves half empty. Longren at the window, his pipe. The door opens: Assol,
    // seventeen, comes in with a basket full of the toys and sets it down by the door
    years: {
      from: () => whole({ ...YEARS(), fade: 1 }),
      run: async (s) => {
        const as = s.person("assol");
        s.move("fade", 0, { over: 1.2, ease: "out" });
        await s.wait(0.6);
        s.move("door", 1, { over: 1.6, ease: "inOut" });
        await s.wait(0.5);
        await walkTo(s, "assol", [DOOR_IN, BY_DOOR], 210);
        const down = as.do("put_basket");
        await s.wait(SET_DOWN);
        as.with(worn());
        s.set("basket", 1);
        s.tell("years:basket");
        await down;
        as.look("longren");
        await s.wait(0.8);
      },
    },
    // decide — he turns from the window to her (the game's choice: let him go to sea or not); the camera has gone to
    // the room's right for it, so that he at the window and the chest in its corner, clear of the stool and the bench,
    // both stand in the middle of the frame at the end (the game points at both)
    decide: {
      after: "years",
      from: () => whole({ ...CAME(), ...DECIDE_VIEW }),
      run: async (s) => {
        const lo = s.person("longren");
        const view = cam(s, DECIDE_VIEW, 1.6);
        lo.look("assol");
        await lo.turn(115);
        lo.do("stand", { loop: true });
        await view;
        s.tell("decide:turned");
      },
    },
    // chest_out — (she let him go) he pulls the sea chest out of its corner, backing, his hands on its lid's edge (the
    // script keeps the chest with him), and sweeps the dust off the lid with his hand
    chest_out: {
      after: "decide",
      from: () => whole(DECIDES()),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol");
        lo.with(null);
        lo.look("chest");
        // (round the chair)
        await walkTo(s, "longren", [[0.75, 3.9], AT_CHEST], 0);
        lo.reach({ r: "chest#grip_r", l: "chest#grip_l" });
        await s.wait(0.6);
        const pull = lo.walk([CHEST_OUT], { gait: "drag" });
        // (backing: he faces the chest all the way, and after)
        s.set("longren_turn", toward(CHEST_OUT, AT_CHEST));
        await pull;
        s.set("chest", 1);
        lo.gait(null);
        lo.reach(null);
        s.tell("chest_out:out");
        as.look("longren");
        await s.wait(0.3);
        lo.look("chest#grip_r");
        for (const grip of ["chest#grip_l", "chest#grip_r", "chest#grip_l"]) {
          lo.reach({ r: grip });
          await s.wait(0.8);
        }
        lo.reach(null);
        await s.wait(0.6);
      },
    },
    // stay — (she asked him to stay) his palm on her head; he sits down by the bench, empty now, and turns the knife
    // over in his hands
    stay: {
      after: "decide",
      from: () => whole(DECIDES()),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol");
        lo.with(null);
        as.look("longren");
        await walkTo(s, "longren", [BY_HER], toward(BY_HER, BY_DOOR));
        lo.reach({ r: "assol#head" });
        s.tell("stay:palm");
        await s.wait(2);
        lo.reach(null);
        await s.wait(0.3);
        const view = cam(s, STAYS, 4);
        await lo.go("sit_down", { to: [SEAT[0], SEAT[1]], turn: 200 });
        lo.on(SEAT);
        lo.with(["knife"]);
        as.look("longren#hands");
        await s.all(lo.do("turn_knife"), view);
        lo.do("seated", { loop: true });
      },
    },
    // unpack — night, the lamp: he comes back from the shore, pushes the chest back into its corner with his foot — two
    // shoves — and lights his pipe
    unpack: {
      from: () => whole({ ...RETURNS, fade: 1 }),
      run: async (s) => {
        const lo = s.person("longren");
        s.move("fade", 0, { over: 1.2, ease: "out" });
        await s.wait(0.2);
        s.move("door", 1, { over: 1.4, ease: "inOut" });
        await s.wait(0.6);
        await lo.walk([DOOR_IN, [0.9, 3.9]]);
        s.move("door", 0, { over: 1.6, ease: "inOut" });
        lo.look("chest");
        for (const c of [1, 0.5]) {
          await walkTo(s, "longren", [kicking(c)], TO_CORNER);
          const push = lo.do("push_foot");
          await s.wait(KICKED);
          s.move("chest", c - 0.5, { over: 0.7, ease: "out" });
          await push;
        }
        s.tell("unpack:pushed");
        lo.with(["pipe"]);
        lo.look(null);
        await lo.do("light_pipe");
        lo.do("pipe", { loop: true });
      },
    },
    // read — morning: Assol (seventeen) on the chair by the window with a book. The beat is entered by a cut (from the
    // chapter before, not from darkness); Longren as the game has him (READS)
    read: {
      from: () => whole(READS()),
      run: async (s) => {
        await s.wait(3);
      },
    },
    // beetle — nearer, then close: the page — a beetle crawls over it and stops at the word «Look»
    beetle: {
      after: "read",
      from: () => whole(READS()),
      run: async (s) => {
        const close = s.shot(PAGE_SHOT);
        await cam(s, OVER_PAGE, 2.5);
        await s.until(() => close.ready);
        close.cut();
        await s.wait(0.4);
        await s.move("beetle", 1, { over: 5, ease: "inOut" });
        s.tell("beetle:word");
        await s.wait(1.2);
      },
    },
    // cry — a shout outside; she doesn't lift her eyes from the page; again — a glance toward the door, and back
    cry: {
      after: ["read", "beetle"],
      from: () => whole(READS()),
      run: async (s) => {
        const as = s.person("assol");
        back(s);
        as.look("assol#hands");
        s.set("gaze", 0);
        const view = cam(s, CRY, 3);
        await s.wait(3.4);
        as.look(ASIDE);
        s.tell("cry:glance");
        await s.wait(1);
        as.look("assol#hands");
        await s.all(view, s.wait(3.6));
      },
    },
    // look — she sits with the book, her eyes on the page, and the camera comes down to the page with them: the game's
    // «Look» is asked here (`gaze` 0…1: her eyes from the page up to the window, the camera rising with them — the
    // script)
    look: {
      after: ["read", "beetle", "cry", "girl_in"],
      from: () => whole({ ...READS(), ...LOOK_VIEW, camera_pitch: PAGE_PITCH }),
      run: async (s) => {
        back(s);
        s.person("assol").look("assol#hands");
        s.set("gaze", 0);
        const view = cam(s, { ...LOOK_VIEW, camera_pitch: PAGE_PITCH }, 1.6);
        await s.wait(1.2);
        s.tell("look:ready");
        await s.all(view, s.wait(0.8));
      },
    },
    // girl_in — the door flung open; the little girl runs in with the yacht over her head (the cast's gait run_high), stops
    // by the chair and tugs at Assol's sleeve (her hand reaches for it); Assol lifts her eyes from the book to her. The
    // camera lowered as in `look` (the girl is small: whole in the frame so) — «Look» lifts it from here too
    girl_in: {
      after: ["look", "cry"],
      from: () => whole({ ...READS(), ...GIRL_VIEW, camera_pitch: PAGE_PITCH }),
      run: async (s) => {
        const as = s.person("assol"), girl = s.person("girl");
        back(s);
        const view = cam(s, { ...GIRL_VIEW, camera_pitch: PAGE_PITCH }, 1.4);
        s.move("door", 1, { over: 0.5, ease: "out" });
        girl.here(true);
        girl.look("assol#head");
        await s.wait(0.3);
        as.look(ASIDE);
        await girl.walk([DOOR_OUT, DOOR_IN, GIRL_AT], { gait: "run_high" });
        girl.gait(null);
        await girl.turn(toward(GIRL_AT, CHAIR));
        // (the yacht into her right hand; the left one free for the sleeve)
        girl.with(["yacht_r"]);
        girl.reach({ l: "assol#hand_r" });
        as.look("girl");
        s.tell("girl_in:tugs");
        await s.all(view, s.wait(2.2));
      },
    },
    // sails_window — in the window, scarlet sails over the sea: the ship comes into it from the right; she lifts her
    // eyes to it (the camera level, whatever `gaze` had left of its way up)
    sails_window: {
      after: ["read", "beetle", "cry", "look", "girl_in"],
      from: () => whole(READS()),
      run: async (s) => {
        back(s);
        const ship = s.move("sails_window", 1, { over: 5, ease: "out" });
        const view = cam(s, { ...SAILS, camera_pitch: 0 }, 2);
        await s.wait(2);
        s.person("assol").look(SAILS_AT);
        s.tell("sails_window:seen");
        await s.all(ship, view);
        await s.wait(1);
      },
    },
    // sails_close — (close, by the camera) from behind her: the back of her head, the window and the sails in it; their
    // scarlet light lies on her and the room (a light of the scene), the book slips from her knees to the floor
    sails_close: {
      after: "sails_window",
      from: () => whole({ ...READS(), sails_window: 1, assol_look: SAILS_AT }),
      run: async (s) => {
        const as = s.person("assol");
        const view = cam(s, BEHIND_HER, 1.4);
        s.move("sails_light", 1, { over: 2.4, ease: "inOut" });
        await s.wait(1.8);
        as.with(worn());
        s.set("book_down", 1);
        as.do("seated", { loop: true });
        await s.all(view, s.wait(3.2));
      },
    },
    // wake — dawn, half dark: she has fallen asleep over the book on her chair; Longren beside it, his hand on her
    // shoulder (at sea he is nowhere: she lifts her head by herself); she lifts her head. The beat is entered by a cut
    wake: {
      from: () => whole(DAWNS()),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol");
        await s.wait(1.6);
        lo.reach({ r: "assol#shoulder_r" });
        await s.wait(1.6);
        as.do("read", { loop: true });
        as.look(s.get("longren_here") ? "longren" : ASIDE);
        s.tell("wake:touched");
        await s.wait(2.8);
      },
    },
    // out — she is up and out of the door, running to the sea; the book falls on the floor; he looks after her (the
    // girl, if she is here, lets go of her sleeve and looks after her too). The camera has the door in the frame: level
    // (after girl_in it is still down at the page), and, the ship in the window (after sails_close it stands behind
    // her, the door out of the frame), back where sails_window had it
    out: {
      after: ["wake", "sails_window", "sails_close", "girl_in"],
      from: () => whole(WOKEN()),
      run: async (s) => {
        const lo = s.person("longren"), as = s.person("assol"), girl = s.person("girl");
        cam(s, { ...(s.get("sails_window") > 0.5 ? SAILS : {}), camera_pitch: 0 }, 1.2);
        girl.reach(null);
        girl.look(DOOR_OUT.concat(1.2));
        lo.reach(null);
        s.move("door", 1, { over: 1, ease: "inOut" });
        as.look(null);
        as.with(worn());
        s.set("book_down", 1);
        await offSeat(s, "assol", ["as_a", "as_d"], "wake_up", CHAIR, 75);
        lo.look("assol");
        lo.turn(toward([s.get("lo_a"), s.get("lo_d")], DOOR_IN));
        await as.walk([[2.4, 4.5], DOOR_OUT, [2.6, 8.4]], { gait: "run" });
        as.here(false);
        as.gait(null);
        s.tell("out:gone");
        lo.look(DOOR_OUT.concat(1.2));
        await s.wait(0.8);
      },
    },
  };
}

return { SKY, leaf, glass, TOYS, TOY_LAYERS, GONE, YACHT, toy, toyBox, yachtMade, knifeLaid, reading, placed, pulled, closeup, closeupMotion, AT_WORK, WINDOW, BOOK, gazed, film, ORDER };
