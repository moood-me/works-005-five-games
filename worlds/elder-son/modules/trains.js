// trains — the world's trains, painted side-on in daylight colours (the scene's light makes the night).
// Every painting is in metres, its anchor on the rail head under the middle, y down; +x toward the train's tail.
//   car(g, e, kind, len) — a freight car: 'tank' (a tank car), 'box' (a boxcar), 'gondola' (an open car under snow),
//     'flat' (a flatcar with logs); len — buffer to buffer
//   loco(g, e, len) — the diesel's side; its headlight is the point `#light` at the nose (e.at, e.light)
//   nose(g, e) — the diesel's front face (a card turned to look ahead), its lamp unlit: the glow is loco's
// Box for a car: [-len/2 - 0.4, -4.9, len/2 + 0.4, 0.2].
// The electric train (ER2-like: four cars, green with a red band), its +x toward its HEAD. Each car (k: 0 — the head …
// 3 — the tail) is painted in ELECTRIC.segs segments along it (j), each two cards on the train's place, their boxes
// ELECTRIC.box(k, j): a card beside the eye is drawn as one passing it, and a long one beside the eye came behind what
// its windows show.
//   electric_train(g, e, k, j) — the car's side: its body with its windows and doorways cut through, the roof, the
//     pantograph (the second and the fourth car), the bogies, the cab at either end of the train; the sliding doors'
//     leaves — layers `leaf_l`, `leaf_r` (doorsLive); frost on the glass — layer `frost` (frostLive); the head lamp's
//     glow `head` (k 0), the tail's red lamps' `tail` (k 3)
//   electric_inside(g, e, k, j) — what the car's windows and doorways show (a card that `glows`, ELECTRIC.inside m
//     behind the side), in depth: the car's far side on an opaque sheet 2.35 m beyond — its wall, windows and doors,
//     the ceiling's lamps, the saloon's end walls, the benches with a few passengers; a glow and a light at each window
//     and doorway, `w<k><n>`, `d<k><n>`; Silva's figure in the second car's front vestibule — layer `silva` (k 1)
//     (silvaLive)
//   electric_points(e) — for an unseen card on the train's place: `#tail`, `#head`, the second car's doorways at
//     chest height `#door` (its front one), `#back_door`
//   ELECTRIC — its numbers (cars, doors, windows along x, heights): what a scene stands its people and camera by
//   train_window(g, e, o) — a car's inner wall round one window, seen from inside (a card facing into the car): o.w,
//     o.h — the glass, o.sill — over the floor, o.wall — [from, to] along x, o.tall; the frost on the glass — layer
//     `frost` (a hole is rubbed in it by the scene's shader); the glass's middle — `#pane`; the ceiling lamp's glow —
//     `lamp`. partition(g, e, o) — the saloon's end wall seen from inside, its door's glass: o.w across, o.tall
// far_train(g, e, o) — a train far off at night, in the painting's own units: a dark band o.len long, o.h high, its
//   windows a chain of warm points (o.cars cars), a lamp at its head (−x)

const SNOW = '#e4eaf2';
const IRON = '#26272a';

function bogie(g, x) {
  g.fillStyle = IRON;
  g.fillRect(x - 1.35, -0.95, 2.7, 0.45);
  for (const dx of [-0.9, 0.9]) {
    g.beginPath();
    g.arc(x + dx, -0.47, 0.47, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = '#3a3b3f';
  g.fillRect(x - 0.25, -0.85, 0.5, 0.5);
}
function frame(g, len) {
  const h = len / 2;
  g.fillStyle = '#2d2c2b';
  g.fillRect(-h + 0.35, -1.32, len - 0.7, 0.3);
  // buffers
  g.fillStyle = IRON;
  for (const x of [-h, h - 0.35]) g.fillRect(x, -1.22, 0.35, 0.16);
  bogie(g, -h + 2.3);
  bogie(g, h - 2.3);
}
// a cap of snow along a top edge, a little ragged
function snowTop(g, x0, x1, y, depth, e) {
  g.fillStyle = SNOW;
  g.beginPath();
  g.moveTo(x0, y + 0.04);
  const n = Math.max(4, Math.round((x1 - x0) / 0.7));
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    g.lineTo(x, y - depth * (0.55 + 0.45 * e.rnd()));
  }
  g.lineTo(x1, y + 0.04);
  g.closePath();
  g.fill();
}

const KINDS = {
  tank(g, e, len) {
    const h = len / 2 - 0.5, top = -4.05, bot = -1.4, r = (bot - top) / 2, cy = (top + bot) / 2;
    g.fillStyle = '#3a3b3e';
    g.beginPath();
    g.moveTo(-h + r * 0.55, top);
    g.lineTo(h - r * 0.55, top);
    g.ellipse(h - r * 0.55, cy, r * 0.55, r, 0, -Math.PI / 2, Math.PI / 2);
    g.lineTo(-h + r * 0.55, bot);
    g.ellipse(-h + r * 0.55, cy, r * 0.55, r, 0, Math.PI / 2, (Math.PI * 3) / 2);
    g.fill();
    // a lighter band of the barrel's top, rivet seams
    g.fillStyle = '#3b3c3f';
    g.fillRect(-h + 0.6, top + 0.15, 2 * h - 1.2, 0.5);
    g.strokeStyle = '#1f2022';
    g.lineWidth = 0.04;
    for (const x of [-h * 0.5, 0, h * 0.5]) {
      g.beginPath();
      g.moveTo(x, top + 0.05);
      g.lineTo(x, bot - 0.05);
      g.stroke();
    }
    // the dome and its ladder
    g.fillStyle = '#3a3b3e';
    g.fillRect(-0.55, top - 0.45, 1.1, 0.5);
    g.strokeStyle = '#4a4b4e';
    g.lineWidth = 0.05;
    for (let y = bot; y > top - 0.3; y -= 0.35) {
      g.beginPath();
      g.moveTo(0.75, y);
      g.lineTo(1.25, y);
      g.stroke();
    }
    snowTop(g, -h + 0.9, h - 0.9, top + 0.02, 0.14, e);
    snowTop(g, -0.5, 0.5, top - 0.43, 0.1, e);
    frame(g, len);
  },
  box(g, e, len) {
    const h = len / 2 - 0.35, top = -4.25, bot = -1.32;
    g.fillStyle = '#6e4436';
    g.fillRect(-h, top, 2 * h, bot - top);
    g.strokeStyle = '#4a2d25';
    g.lineWidth = 0.07;
    for (let x = -h + 0.6; x < h; x += 0.95) {
      g.beginPath();
      g.moveTo(x, top + 0.1);
      g.lineTo(x, bot);
      g.stroke();
    }
    // the sliding door, its frame and rail
    g.fillStyle = '#563529';
    g.fillRect(-1.0, top + 0.25, 2.0, bot - top - 0.3);
    g.strokeStyle = '#3c241d';
    g.lineWidth = 0.06;
    g.strokeRect(-1.0, top + 0.25, 2.0, bot - top - 0.3);
    g.beginPath();
    g.moveTo(-1.0, top + 1.4);
    g.lineTo(1.0, top + 1.4);
    g.moveTo(-1.6, top + 0.2);
    g.lineTo(1.6, top + 0.2);
    g.stroke();
    // a white stencil plate
    g.fillStyle = '#b9b1a3';
    g.fillRect(-h + 1.2, top + 0.7, 1.4, 0.35);
    // the roof's curve and its snow
    g.fillStyle = '#4a3a33';
    g.beginPath();
    g.moveTo(-h, top);
    g.quadraticCurveTo(0, top - 0.42, h, top);
    g.closePath();
    g.fill();
    snowTop(g, -h + 0.2, h - 0.2, top - 0.2, 0.16, e);
    frame(g, len);
  },
  gondola(g, e, len) {
    const h = len / 2 - 0.35, top = -3.35, bot = -1.32;
    g.fillStyle = '#54473e';
    g.fillRect(-h, top, 2 * h, bot - top);
    g.strokeStyle = '#342c27';
    g.lineWidth = 0.08;
    for (let x = -h + 0.45; x < h; x += 1.25) {
      g.beginPath();
      g.moveTo(x, top);
      g.lineTo(x, bot);
      g.stroke();
    }
    // its load heaped under snow
    g.fillStyle = SNOW;
    g.beginPath();
    g.moveTo(-h + 0.1, top + 0.02);
    g.quadraticCurveTo(-h * 0.5, top - 0.9, 0, top - 0.75);
    g.quadraticCurveTo(h * 0.5, top - 0.6, h - 0.1, top + 0.02);
    g.closePath();
    g.fill();
    frame(g, len);
  },
  flat(g, e, len) {
    const h = len / 2 - 0.35, deck = -1.55;
    g.fillStyle = '#3a3330';
    g.fillRect(-h, deck, 2 * h, 0.25);
    // logs, side-on: long bands with darker seams, stakes holding them
    const logs = ['#6b5a48', '#5d4d3e', '#705f4c', '#62513f'];
    for (let i = 0; i < 4; i++) {
      g.fillStyle = logs[i];
      g.fillRect(-h + 0.3, deck - 0.4 * (i + 1), 2 * h - 0.6 - 0.4 * (i % 2), 0.38);
    }
    g.fillStyle = '#2b2725';
    for (const x of [-h + 0.4, -h * 0.33, h * 0.33, h - 0.55]) g.fillRect(x, deck - 1.95, 0.14, 1.95);
    snowTop(g, -h + 0.3, h - 0.6, deck - 1.6, 0.14, e);
    frame(g, len);
  },
};

function car(g, e, kind, len) {
  (KINDS[kind] || KINDS.box)(g, e, len);
}

// the diesel (a 2TE-like section): long hood, the cab at the nose (−x), a dark green body, a pale stripe
function loco(g, e, len) {
  const h = len / 2 - 0.3, top = -4.2, bot = -1.35;
  g.fillStyle = '#2c3a33';
  g.beginPath();
  g.moveTo(-h + 1.1, top);
  g.lineTo(h - 0.2, top);
  g.lineTo(h, top + 0.35);
  g.lineTo(h, bot);
  g.lineTo(-h, bot);
  g.lineTo(-h, top + 1.4);
  g.quadraticCurveTo(-h + 0.1, top + 0.1, -h + 1.1, top);
  g.fill();
  // the stripe
  g.fillStyle = '#9a8f6a';
  g.fillRect(-h, -2.25, 2 * h, 0.16);
  // the cab's windows (dark glass), the side door
  g.fillStyle = '#121518';
  g.fillRect(-h + 0.6, top + 0.55, 1.25, 0.9);
  g.fillRect(-h + 2.2, top + 0.55, 0.9, 0.9);
  g.strokeStyle = '#1d2621';
  g.lineWidth = 0.06;
  g.strokeRect(-h + 3.4, top + 0.45, 0.85, 2.3);
  // the hood's louvres
  g.strokeStyle = '#24302a';
  g.lineWidth = 0.05;
  for (let x = -h + 5; x < h - 1; x += 0.32) {
    g.beginPath();
    g.moveTo(x, top + 0.5);
    g.lineTo(x, top + 1.2);
    g.stroke();
  }
  snowTop(g, -h + 1.2, h - 0.4, top + 0.02, 0.1, e);
  // its frame and three-axle bogies
  g.fillStyle = '#232625';
  g.fillRect(-h, bot, 2 * h, 0.3);
  for (const x of [-h + 3.4, h - 3.4]) {
    g.fillStyle = IRON;
    g.fillRect(x - 2.0, -1.0, 4.0, 0.5);
    for (const dx of [-1.4, 0, 1.4]) {
      g.beginPath();
      g.arc(x + dx, -0.53, 0.53, 0, Math.PI * 2);
      g.fill();
    }
  }
  // the headlight at the nose, high: the train's point for the game, and a glow and a light of its own
  g.fillStyle = '#d8d4c4';
  g.beginPath();
  g.arc(-h + 0.05, top + 0.25, 0.16, 0, Math.PI * 2);
  g.fill();
  e.at(-h, top + 0.25, 'light');
  e.light(-h, top + 0.25, 2, '#fff1d2', 3.2, 'light');
}

// the front face, 3.2 m wide: the cab's two windows over the nose, the lamp (unlit: loco's glow is there), the plough
function nose(g, e) {
  const w = 1.6, top = -4.2;
  g.fillStyle = '#2c3a33';
  g.beginPath();
  g.moveTo(-w, -1.35);
  g.lineTo(-w, top + 1.0);
  g.quadraticCurveTo(-w, top, -w + 0.9, top);
  g.lineTo(w - 0.9, top);
  g.quadraticCurveTo(w, top, w, top + 1.0);
  g.lineTo(w, -1.35);
  g.fill();
  g.fillStyle = '#121518';
  g.fillRect(-1.3, top + 0.55, 1.15, 0.85);
  g.fillRect(0.15, top + 0.55, 1.15, 0.85);
  g.fillStyle = '#9a8f6a';
  g.fillRect(-w, -2.25, 2 * w, 0.16);
  g.fillStyle = '#d8d4c4';
  g.beginPath();
  g.arc(0, top + 0.25, 0.18, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#5a1f1a';
  for (const x of [-1.15, 1.15]) {
    g.beginPath();
    g.arc(x, -1.75, 0.1, 0, Math.PI * 2);
    g.fill();
  }
  // the plough, snow caught on it
  g.fillStyle = IRON;
  g.beginPath();
  g.moveTo(-w, -1.35);
  g.lineTo(w, -1.35);
  g.lineTo(w * 0.8, -0.15);
  g.lineTo(-w * 0.8, -0.15);
  g.fill();
  g.fillStyle = SNOW;
  g.fillRect(-w * 0.8, -0.35, w * 1.6, 0.2);
  snowTop(g, -w + 0.6, w - 0.6, top + 0.02, 0.1, e);
}

// ---- the electric train ----
// Four cars of 20 m, the head car at +x. y down from the rail head; the floor at the platform's height (1.15 m).
const EL = {
  cars: 4, len: 20, floor: -1.15, skirt: -0.95, eave: -4.05, crown: -4.45,
  sill: -2.05, top: -3.0, winW: 1.1,                  // the windows
  doorTop: -3.2, doorW: 1.3,                           // the doorways (two leaves of doorW / 2)
  cab: 2.8,                                            // the cab at either end of the train
  inside: 0.3,                                         // how far behind the side electric_inside stands (its depths beyond)
  green: '#3f6f4c', greenDark: '#30573b', red: '#a3302a', roof: '#80858a', under: '#28292b',
};
EL.half = (EL.cars * EL.len) / 2;
// car k (0 — the head, 3 — the tail): its rear end's x (its front one is x0 + len)
EL.x0 = k => EL.half - (k + 1) * EL.len;
// its two doorways' middles: two metres in from either end, or behind a cab
EL.doors = k => {
  const x0 = EL.x0(k);
  return [x0 + (k === EL.cars - 1 ? EL.cab + 1.0 : 2.0), x0 + EL.len - (k === 0 ? EL.cab + 1.0 : 2.0)];
};
// its windows' middles, evenly between its vestibules (clear of the leaves' pockets)
EL.windows = k => {
  const [d0, d1] = EL.doors(k), a = d0 + 2.0, b = d1 - 2.0, n = Math.round((b - a) / 1.5), p = (b - a) / n;
  return Array.from({ length: n }, (_, i) => a + p * (i + 0.5));
};

function rrect(g, x, y, w, h, r) {
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y);
  g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
}
const winRect = x => [x - EL.winW / 2, EL.top, EL.winW, EL.sill - EL.top];
const doorRect = x => [x - EL.doorW / 2, EL.doorTop, EL.doorW, EL.floor - EL.doorTop];

// a car's body outline (its ends rounded at the top where it is a cab)
function bodyPath(g, k) {
  const x0 = EL.x0(k), x1 = x0 + EL.len, tail = k === EL.cars - 1, head = k === 0;
  const a = x0 + 0.15, b = x1 - 0.15;
  g.moveTo(a + (tail ? 0.7 : 0), EL.eave);
  g.lineTo(b - (head ? 0.7 : 0), EL.eave);
  if (head) g.quadraticCurveTo(b, EL.eave, b, EL.eave + 0.9);
  g.lineTo(b, EL.skirt);
  g.lineTo(a, EL.skirt);
  if (tail) { g.lineTo(a, EL.eave + 0.9); g.quadraticCurveTo(a, EL.eave, a + 0.7, EL.eave); }
  g.closePath();
}

// one car of the train's side (k: 0 — the head … 3 — the tail): its body with its windows and doorways cut through,
// the roof, the bogies; the head car's cab and head lamp, the tail car's red lamps; its doors' leaves and frost layers
function electric_train(g, e, k, j) {
  const x0 = EL.x0(k), head = k === 0, tail = k === EL.cars - 1, [s0, s1] = EL.segment(k, j);
  const within = c => { c.beginPath(); c.rect(s0, -7, s1 - s0, 8); c.clip(); };
  g.save();
  within(g);
  // the gangways' halves at its ends, the under-frame, the bogies
  g.fillStyle = '#1d1e20';
  if (!head) g.fillRect(x0 + EL.len - 0.2, -3.6, 0.2, 2.5);
  if (!tail) g.fillRect(x0, -3.6, 0.2, 2.5);
  g.fillStyle = EL.under;
  g.fillRect(x0 + 4, -1.0, EL.len - 8, 0.55);
  g.fillStyle = '#353639';
  for (let x = x0 + 4.6; x < x0 + EL.len - 4.6; x += 2.3) g.fillRect(x, -0.92, 1.6, 0.4);
  for (const bx of [x0 + 2.6, x0 + EL.len - 2.6]) {
    g.fillStyle = IRON;
    g.fillRect(bx - 1.45, -0.9, 2.9, 0.42);
    for (const dx of [-1.05, 1.05]) {
      g.beginPath();
      g.arc(bx + dx, -0.5, 0.5, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = '#3c3d40';
    g.fillRect(bx - 0.3, -0.85, 0.6, 0.5);
  }
  // the body, its windows and doorways cut through (what is inside shows: electric_inside)
  g.beginPath();
  bodyPath(g, k);
  for (const x of EL.windows(k)) rrect(g, ...winRect(x), 0.12);
  for (const x of EL.doors(k)) g.rect(...doorRect(x));
  g.fillStyle = EL.green;
  g.fill('evenodd');
  g.save();
  g.clip('evenodd');
  // the lower panel darker, the red band under the windows, the gutter over them
  g.fillStyle = EL.greenDark;
  g.fillRect(x0, -1.45, EL.len, 0.5);
  g.fillStyle = EL.red;
  g.fillRect(x0, -1.78, EL.len, 0.2);
  g.fillStyle = '#284a32';
  g.fillRect(x0, -3.38, EL.len, 0.05);
  g.fillRect(x0, EL.eave + 0.02, EL.len, 0.08);
  g.restore();
  // the windows' rubber, the doorways' frames
  g.strokeStyle = '#1e2420';
  g.lineWidth = 0.06;
  for (const x of EL.windows(k)) {
    g.beginPath();
    rrect(g, ...winRect(x), 0.12);
    g.stroke();
  }
  g.lineWidth = 0.08;
  for (const x of EL.doors(k)) g.strokeRect(...doorRect(x));
  // the roof: a grey crown, the vents, a pantograph on the second and the fourth car
  const a = x0 + 0.15 + (tail ? 0.8 : 0), b = x0 + EL.len - 0.15 - (head ? 0.8 : 0);
  g.fillStyle = EL.roof;
  g.beginPath();
  g.moveTo(a, EL.eave);
  g.quadraticCurveTo(a + 0.3, EL.crown, a + 1.2, EL.crown);
  g.lineTo(b - 1.2, EL.crown);
  g.quadraticCurveTo(b - 0.3, EL.crown, b, EL.eave);
  g.closePath();
  g.fill();
  g.fillStyle = '#5d6166';
  for (let x = x0 + 3; x < x0 + EL.len - 3; x += 3.2) g.fillRect(x, EL.crown - 0.18, 0.9, 0.2);
  snowTop(g, a + 1.2, b - 1.2, EL.crown + 0.02, 0.07, e);
  if (k % 2 === 1) {
    const m = x0 + EL.len / 2;
    g.strokeStyle = '#2e3033';
    g.lineWidth = 0.06;
    g.beginPath();
    g.moveTo(m - 1.2, EL.crown - 0.1);
    g.lineTo(m - 0.25, -5.35);
    g.lineTo(m + 0.6, -6.15);
    g.moveTo(m + 1.2, EL.crown - 0.1);
    g.lineTo(m + 0.25, -5.35);
    g.lineTo(m - 0.6, -6.15);
    g.stroke();
    g.fillStyle = '#2e3033';
    g.fillRect(m - 0.9, -6.25, 1.8, 0.1);
    g.fillRect(m - 1.4, EL.crown - 0.16, 2.8, 0.14);
  }
  // a cab: its side window (dark: no one lit in it), its door, its lamp over the front; the head lamp lit at the head,
  // the red lamps at the tail
  const H = EL.half - 0.15;
  if (head || tail) {
    g.fillStyle = '#16191b';
    g.beginPath();
    rrect(g, head ? H - 1.9 : -H + 0.65, -3.2, 1.25, 0.85, 0.15);
    g.fill();
    g.strokeStyle = '#2a4a33';
    g.lineWidth = 0.05;
    g.strokeRect(head ? H - 2.55 : -H + 1.93, -3.25, 0.62, 2.05);
    g.fillStyle = '#dcd6c4';
    g.beginPath();
    g.arc((head ? 1 : -1) * (H - 0.05), EL.eave + 0.05, 0.17, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  if (head && H > s0 && H <= s1) e.light(H, EL.eave + 0.05, 1.6, '#fff3d8', 3.0, 'head');
  if (tail && -H >= s0 && -H < s1) {
    for (const y of [-1.85, -3.6]) {
      g.fillStyle = '#c83a28';
      g.beginPath();
      g.arc(-H + 0.06, y, 0.12, 0, Math.PI * 2);
      g.fill();
      e.light(-H, y, y < -2 ? 0.3 : 0.45, '#ff3b22', y < -2 ? 1.4 : 2.2, y < -2 ? 'tail_top' : 'tail');
    }
  }
  // the sliding leaves: each slides into its pocket behind the side (doorsLive)
  for (const side of ['l', 'r']) {
    e.layer(`leaf_${side}`, {}, c => {
      within(c);
      for (const x of EL.doors(k)) {
        const w = EL.doorW / 2, xl = side === 'l' ? x - w : x;
        c.beginPath();
        c.rect(xl, EL.doorTop, w, EL.floor - EL.doorTop);
        rrect(c, xl + 0.1, -2.95, w - 0.2, 0.75, 0.08);
        c.fillStyle = EL.green;
        c.fill('evenodd');
        c.fillStyle = EL.red;
        c.fillRect(xl, -1.78, w, 0.2);
        c.strokeStyle = '#1e2420';
        c.lineWidth = 0.05;
        c.beginPath();
        rrect(c, xl + 0.1, -2.95, w - 0.2, 0.75, 0.08);
        c.stroke();
        c.fillStyle = '#1a1b1c';
        c.fillRect(side === 'l' ? xl + w - 0.04 : xl, EL.doorTop, 0.04, EL.floor - EL.doorTop);
      }
    });
  }
  // frost over the glass, from the corners in (frostLive)
  e.layer('frost', {}, c => {
    within(c);
    const pane = (x, y, w, h) => {
      c.fillStyle = 'rgba(214,226,238,0.55)';
      c.fillRect(x, y, w, h);
      for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
        const r = Math.min(w, h) * (0.55 + 0.25 * e.rnd());
        const f = c.createRadialGradient(cx, cy, 0, cx, cy, r);
        f.addColorStop(0, 'rgba(240,246,252,0.9)');
        f.addColorStop(1, 'rgba(240,246,252,0)');
        c.fillStyle = f;
        c.fillRect(x, y, w, h);
      }
    };
    for (const x of EL.windows(k)) pane(...winRect(x));
    for (const x of EL.doors(k)) for (const s of [-1, 1]) pane(x + (s < 0 ? -EL.doorW / 2 + 0.1 : 0.1), -2.95, EL.doorW / 2 - 0.2, 0.75);
  });
}
// a car is painted in EL.segs cards along it (above): segment j's x range, its box round the train's anchor
EL.segs = 4;
EL.segment = (k, j) => [EL.x0(k) + (j * EL.len) / EL.segs, EL.x0(k) + ((j + 1) * EL.len) / EL.segs];
EL.box = (k, j) => [EL.segment(k, j)[0], -6.4, EL.segment(k, j)[1], 0.2];

// the train's points, painted by an unseen card on its place (the cars are cards of their own on it): the tail's red
// lamps `#tail`, the head lamp `#head`, the second car's doorways at a grown man's chest — `#door` (its front one),
// `#back_door`
function electric_points(e) {
  const H = EL.half - 0.15, [back, front] = EL.doors(1);
  e.at(-H, -1.85, 'tail');
  e.at(H, EL.eave + 0.05, 'head');
  e.at(front, EL.floor - 1.3, 'door');
  e.at(back, EL.floor - 1.3, 'back_door');
}

// what one car's windows and doorways show (k as electric_train): the saloon in depth — its far side painted on one
// opaque sheet 2.35 m beyond this card (e.part), so that it moves behind the windows as a room does as one walks by:
// the far wall with its dark windows and the far doors, the ceiling's lamps, the benches back to back and whoever
// sits on them. (One opaque sheet, not several see-through ones: those are drawn in order of their elements' depth, and
// beside the eye a long car's sheets came over its side.)
function electric_inside(g, e, k, j) {
  const [d0, d1] = EL.doors(k), x0 = EL.x0(k), W = EL.windows(k), [s0, s1] = EL.segment(k, j), box = [s0, -3.7, s1, -1.0];
  const has = x => x >= s0 && x < s1;
  const a = d0 + EL.doorW / 2 + 0.35, b = d1 - EL.doorW / 2 - 0.35;   // the saloon between its end walls
  const piers = [a, ...W.slice(1).map((x, i) => (W[i] + x) / 2), b];   // a pair of benches back to back at each
  // a bench seen from its end: its back (by the pier) and its seat toward the bay (dir ±1)
  const bench = (c, p, dir) => {
    c.fillStyle = '#8f5f35';
    c.fillRect(p + (dir > 0 ? 0.04 : -0.16), -2.15, 0.12, 1.0);
    c.fillStyle = '#a36d3d';
    c.fillRect(p + (dir > 0 ? 0.04 : -0.6), -1.62, 0.56, 0.1);
    c.fillStyle = '#5a4030';
    c.fillRect(p + (dir > 0 ? 0.42 : -0.5), -1.52, 0.06, 0.37);
  };
  // someone sitting on a bench (facing dir), seen side-on: legs, body, head, a cap or a scarf
  const sitter = (c, x, dir, n) => {
    const col = ['#3b3632', '#4a3b33', '#2f3236', '#55463a'][n % 4];
    c.fillStyle = col;
    c.fillRect(x - 0.17, -2.27, 0.32, 0.72);
    c.fillRect(x - 0.17 + (dir > 0 ? 0.12 : -0.3), -1.62, 0.35, 0.14);
    c.fillRect(x + (dir > 0 ? 0.33 : -0.47), -1.6, 0.12, 0.45);
    c.fillStyle = '#c9a383';
    c.beginPath();
    c.ellipse(x, -2.42, 0.1, 0.12, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = n % 3 ? '#2a2624' : '#6b5a48';
    c.beginPath();
    c.ellipse(x - dir * 0.02, -2.5, 0.12, 0.07, 0, Math.PI, 0);
    c.fill();
  };
  const row = (c, seed) => {
    piers.forEach((p, i) => {
      if (i > 0) bench(c, p, -1);
      if (i < piers.length - 1) bench(c, p, 1);
    });
    piers.forEach((p, i) => {
      if (i > 0 && e.rnd() < 0.22) sitter(c, p - 0.3, 1, seed + i);
      if (i < piers.length - 1 && e.rnd() < 0.22) sitter(c, p + 0.3, -1, seed + i + 1);
    });
  };
  // the far side, 2.35 m on: its wall, its windows (the night beyond, a lamp's reflection), the far doors, the floor,
  // the ceiling's lamps and the saloon's end walls, the benches and who sits there
  e.part(0, 2.35, c => {
    c.beginPath();
    c.rect(s0, -3.7, s1 - s0, 2.7);
    c.clip();
    c.fillStyle = '#d9cba3';
    c.fillRect(s0, -3.7, s1 - s0, 2.7);
    c.fillStyle = '#b8aa86';
    c.fillRect(x0, -1.6, EL.len, 0.45);
    for (const x of W) {
      c.fillStyle = '#2c3746';
      c.fillRect(x - 0.5, -3.0, 1.0, 0.92);
      c.fillStyle = 'rgba(255,240,200,0.16)';
      c.fillRect(x - 0.46, -2.96, 0.28, 0.84);
    }
    for (const x of [d0, d1]) {
      c.fillStyle = '#35503d';
      c.fillRect(x - 0.62, -3.2, 1.24, 2.05);
      c.fillStyle = '#22303a';
      c.fillRect(x - 0.52, -2.95, 0.42, 0.72);
      c.fillRect(x + 0.1, -2.95, 0.42, 0.72);
    }
    c.fillStyle = '#8f8064';
    c.fillRect(x0, -1.25, EL.len, 0.1);
    c.fillStyle = '#efe6cc';
    c.fillRect(x0, -3.62, EL.len, 0.1);
    for (let x = a + 0.6; x < b - 0.3; x += 1.5) {
      c.fillStyle = '#fff7df';
      c.fillRect(x - 0.3, -3.52, 0.6, 0.07);
    }
    for (const [x, s] of [[a, -1], [b, 1]]) {
      c.fillStyle = '#cfc19b';
      c.fillRect(s < 0 ? x - 0.14 : x, -3.55, 0.14, 2.4);
      c.fillStyle = 'rgba(40,40,36,0.25)';
      c.fillRect(s < 0 ? x - 0.02 : x, -3.55, 0.02, 2.4);
    }
    row(c, k * 7);
  }, box);
  // the light at each window and doorway: the glow, and a patch on whatever stands outside
  W.forEach((x, i) => { if (has(x)) e.light(x, -2.55, 0.75, '#ffe4ac', 0.75, `w${k}${i}`); });
  [d0, d1].forEach((x, i) => { if (has(x)) e.light(x, -2.3, 0.85, '#ffe4ac', 0.8, `d${k}${i}`); });
  // Silva, in the second car's front vestibule by the left jamb: a figure in a hat, dark against the light (silvaLive)
  const x = EL.doors(1)[1] - 0.32;
  if (k !== 1 || !has(x)) return;
  e.layer('silva', {}, c => {
    c.fillStyle = '#2b2622';
    c.beginPath();
    c.moveTo(x - 0.3, -1.15);
    c.lineTo(x - 0.27, -2.45);
    c.quadraticCurveTo(x - 0.25, -2.65, x - 0.1, -2.68);
    c.lineTo(x + 0.1, -2.68);
    c.quadraticCurveTo(x + 0.25, -2.65, x + 0.27, -2.45);
    c.lineTo(x + 0.3, -1.15);
    c.closePath();
    c.fill();
    c.beginPath();
    c.ellipse(x, -2.82, 0.11, 0.14, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(x + 0.02, -2.93, 0.2, 0.04, -0.15, 0, Math.PI * 2);
    c.fill();
    c.fillRect(x - 0.08, -3.07, 0.18, 0.13);
  });
}

// the doors' leaves by doors 0 (shut) … 1 (open); the frost on the glass, 0…1; Silva in the vestibule, 0…1
function doorsLive(e, doors) {
  const d = Math.max(0, Math.min(1, Number(doors) || 0)) * (EL.doorW / 2 - 0.02);
  e.layer('leaf_l').x = -d;
  e.layer('leaf_r').x = d;
}
function frostLive(e, frost) {
  e.layer('frost').alpha = Math.max(0, Math.min(1, Number(frost) || 0));
}
function silvaLive(e, silva) {
  e.layer('silva').alpha = Math.max(0, Math.min(1, Number(silva) || 0));
}

// a car's inner wall round one window, seen from inside; the card's foot on the floor, x along the wall
function train_window(g, e, o) {
  const w = o.w, h = o.h, sill = o.sill, tall = o.tall, [from, to] = o.wall;
  const top = -(sill + h);
  g.beginPath();
  g.rect(from, -tall, to - from, tall);
  rrect(g, -w / 2, top, w, h, 0.1);
  g.fillStyle = '#b9c2b2';
  g.fill('evenodd');
  g.save();
  g.clip('evenodd');
  // the wall's light: brighter up toward the ceiling's lamps, darker down by the floor
  const shade = g.createLinearGradient(0, -tall, 0, 0);
  shade.addColorStop(0, 'rgba(255,248,226,0.25)');
  shade.addColorStop(0.55, 'rgba(255,248,226,0)');
  shade.addColorStop(1, 'rgba(40,44,38,0.35)');
  g.fillStyle = shade;
  g.fillRect(from, -tall, to - from, tall);
  // the panels' joints, the panels under the window, the heater's grille, the ceiling's edge
  g.fillStyle = 'rgba(70,76,66,0.45)';
  for (let x = Math.ceil(from / 1.5) * 1.5 - 0.75; x < to; x += 1.5) if (Math.abs(x) > w / 2 + 0.05) g.fillRect(x - 0.01, -tall, 0.02, tall);
  g.fillStyle = '#9fa999';
  g.fillRect(from, -0.75, to - from, 0.75);
  g.fillStyle = '#7d8679';
  for (let x = from + 0.1; x < to; x += 0.09) g.fillRect(x, -0.42, 0.035, 0.28);
  g.fillStyle = '#e8e4d6';
  g.fillRect(from, -tall, to - from, 0.18);
  // the luggage rack over the window: its bracket, its slats, its rail, the shadow under it
  g.fillStyle = 'rgba(30,30,28,0.25)';
  g.fillRect(from, top - 0.3, to - from, 0.12);
  g.fillStyle = '#9a9c98';
  g.fillRect(from, top - 0.42, to - from, 0.04);
  g.fillStyle = '#c9cdc9';
  g.fillRect(from, top - 0.5, to - from, 0.03);
  g.fillStyle = '#6e5a42';
  for (let x = from; x < to; x += 0.12) g.fillRect(x, top - 0.47, 0.07, 0.05);
  // a framed notice on the pier beside the window: its paper, its lines
  const nx = w / 2 + 0.22;
  if (nx + 0.22 < to) {
    g.fillStyle = '#7d6a4e';
    g.fillRect(nx, top + 0.1, 0.22, 0.3);
    g.fillStyle = '#ece6d4';
    g.fillRect(nx + 0.02, top + 0.12, 0.18, 0.26);
    g.fillStyle = '#8a8478';
    for (let y = top + 0.16; y < top + 0.36; y += 0.035) g.fillRect(nx + 0.04, y, 0.14 * (0.6 + 0.4 * e.rnd()), 0.01);
  }
  g.restore();
  // the window's aluminium frame, its sill
  g.strokeStyle = '#c9cdc9';
  g.lineWidth = 0.05;
  g.beginPath();
  rrect(g, -w / 2, top, w, h, 0.1);
  g.stroke();
  g.strokeStyle = '#3b3f3c';
  g.lineWidth = 0.02;
  g.beginPath();
  rrect(g, -w / 2 - 0.035, top - 0.035, w + 0.07, h + 0.07, 0.12);
  g.stroke();
  g.fillStyle = '#8e7756';
  g.fillRect(-w / 2 - 0.08, -sill, w + 0.16, 0.06);
  g.fillStyle = '#c9cdc9';
  g.fillRect(-0.015, top, 0.03, h * 0.45);
  g.fillRect(-w / 2, top + h * 0.45, w, 0.03);
  e.at(0, top + h / 2, 'pane');
  e.light(0.2, -tall + 0.1, 0.5, '#fff2d2', 1.1, 'lamp');
  // the frost on the glass: thin in the middle, thick and feathered at the corners (the scene's shader wipes it)
  e.layer('frost', {}, c => {
    c.fillStyle = 'rgba(206,220,234,0.62)';
    c.fillRect(-w / 2, top, w, h);
    for (const [cx, cy] of [[-w / 2, top], [w / 2, top], [-w / 2, -sill], [w / 2, -sill]]) {
      const f = c.createRadialGradient(cx, cy, 0, cx, cy, h * 0.75);
      f.addColorStop(0, 'rgba(242,247,252,0.95)');
      f.addColorStop(1, 'rgba(242,247,252,0)');
      c.fillStyle = f;
      c.fillRect(-w / 2, top, w, h);
    }
    // the fern of the frost: feathered strokes from the edges
    c.strokeStyle = 'rgba(250,252,255,0.55)';
    c.lineWidth = 0.006;
    for (let i = 0; i < 40; i++) {
      const edge = i % 4, t = e.rnd();
      let x = edge < 2 ? -w / 2 + t * w : edge === 2 ? -w / 2 : w / 2, y = edge === 0 ? top : edge === 1 ? -sill : top + t * h;
      let a = edge === 0 ? Math.PI / 2 : edge === 1 ? -Math.PI / 2 : edge === 2 ? 0 : Math.PI;
      a += (e.rnd() - 0.5) * 1.2;
      c.beginPath();
      c.moveTo(x, y);
      for (let s = 0; s < 6; s++) {
        const len = 0.02 + e.rnd() * 0.035;
        x += Math.cos(a) * len;
        y += Math.sin(a) * len;
        c.lineTo(x, y);
        c.lineTo(x + Math.cos(a + 0.9) * len * 0.6, y + Math.sin(a + 0.9) * len * 0.6);
        c.moveTo(x, y);
        c.lineTo(x + Math.cos(a - 0.9) * len * 0.6, y + Math.sin(a - 0.9) * len * 0.6);
        c.moveTo(x, y);
        a += (e.rnd() - 0.5) * 0.5;
      }
      c.stroke();
    }
  });
}

// the saloon's end wall from inside: its door, the door's glass showing the lit vestibule
function partition(g, e, o) {
  const w = o.w, tall = o.tall, dw = 0.8, dh = 1.95;
  g.fillStyle = '#efe2bd';
  g.fillRect(-dw / 2 + 0.1, -dh + 0.1, dw - 0.2, 0.9);
  g.beginPath();
  g.rect(-w / 2, -tall, w, tall);
  g.rect(-dw / 2 + 0.1, -dh + 0.1, dw - 0.2, 0.9);
  g.fillStyle = '#b3bcad';
  g.fill('evenodd');
  g.strokeStyle = '#7f8779';
  g.lineWidth = 0.04;
  g.strokeRect(-dw / 2, -dh, dw, dh);
  g.fillStyle = '#e8e4d6';
  g.fillRect(-w / 2, -tall, w, 0.18);
  g.fillStyle = '#c9cdc9';
  g.fillRect(dw / 2 - 0.12, -1.05, 0.05, 0.16);
}

// ---- the far train: a chain of warm windows in the dark, a lamp at its head (−x) ----
function far_train(g, e, o) {
  const len = o.len, h = o.h, cars = o.cars || 6, cl = len / cars;
  g.fillStyle = '#16181d';
  g.fillRect(0, -h, len, h);
  for (let k = 0; k < cars; k++) {
    const x0 = k * cl, n = 8;
    for (let i = 0; i < n; i++) {
      if (e.rnd() < 0.18) continue;
      g.fillStyle = e.rnd() < 0.3 ? '#f7d590' : '#f0bf6a';
      g.fillRect(x0 + cl * (0.1 + (0.8 * i) / n), -h * 0.72, cl * 0.055, h * 0.32);
    }
    e.light(x0 + cl / 2, -h * 0.55, cl * 0.35, '#f2c27a', 0.35);
  }
  e.light(0, -h * 0.6, h * 1.6, '#fff1d0', 1.6, 'head');
}

return {
  car, loco, nose, KINDS: Object.keys(KINDS),
  electric_train, electric_inside, electric_points, doorsLive, frostLive, silvaLive, ELECTRIC: EL, train_window, partition, far_train,
};
