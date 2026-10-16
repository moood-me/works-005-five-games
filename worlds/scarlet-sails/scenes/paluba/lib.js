// «The Deck» — the ship seen from her own deck, her voyage, and the scene's film (film(scene): the world's module beats).
// Metres. The deck is laid round the unseen `ship` as a scene is laid round its start (the camera rides on it): across
// to starboard, distance toward her bow, elevation up from the poop deck; the viewer stands on the poop to the right
// of the wheel, the keel runs 2.4 m to the left (KEEL). `ship` stands on `hull` (her roll: its tilt is `heel`), `hull`
// on `course` — where she is in the world and how she is turned (ship_x, ship_d, ship_f). The world lies where it is:
// Kaperna ahead in the west, Liss's quay far astern, the sea under all of it; she sails over it at her own speed.
// Everything is painted once, in daylight colours (notes.md).
const { clamp, mix, ease, span, hash } = anim;
const N = kit.nebo;
const K = kit.korabli;
const DEG = Math.PI / 180;

// ── her plan ──
const KEEL = -2.4;           // the keel's line, across
const WAIST = -1.4;          // the main deck under the poop's (0)
const SEA = -3.8;            // the water
// along her (distance): the taffrail, the wheel, the mizzen, the poop's break, the mainmast, the foremast, the stem
const AT = { taffrail: -3, wheel: 2.6, mizzen: 5.2, brk: 6, main: 14, fore: 23, stem: 32 };

// her colours in daylight (korabli.SHIPS) — paintings read `ship` alone (it changes at a cut)
const shipOf = s => (s.ship === 'anselm' ? 'anselm' : 'secret');
const colours = s => K.SHIPS[shipOf(s)];

// ── the sails ──
// Each is painted once, fully set, white (korabli's cloth); the world's cloth shader (tools/korabl-cloth.wgsl) sets it
// as far as it is set, makes it scarlet, runs the wind over it and shakes it when it luffs. Heights are metres over the
// main deck.
// The square sails: each hangs from its yard (hoisted: `high`) to its foot, `w0` half as wide at the yard, `w1` at the
// foot; a course drops from its yard, which stays; a topsail goes up from its foot with its yard (`rise`); a
// topgallant's foot is just over the topsail's yard (`under`) and goes up with it. `order` — its turn as the sails
// are set (korabli.setOf). "Secret": three on the fore and the main mast; "Anselm": her fore topsail only.
const SQUARE = {
  secret: {
    fore_course: { high: 10.4, foot: 3.9, w0: 6.8, w1: 7.2, rise: 0, order: 0, seed: 1 },
    fore_top: { high: 17, foot: 10.9, w0: 5.3, w1: 6.4, rise: 1, order: 2, seed: 2 },
    fore_tg: { high: 21.8, foot: 17.4, under: 'fore_top', w0: 3.8, w1: 5.1, rise: 1, order: 4, seed: 3 },
    main_course: { high: 11.4, foot: 3.9, w0: 7.4, w1: 7.8, rise: 0, order: 1, seed: 4 },
    main_top: { high: 18.6, foot: 11.9, w0: 5.8, w1: 7.0, rise: 1, order: 3, seed: 5 },
    main_tg: { high: 23.9, foot: 19, under: 'main_top', w0: 4.1, w1: 5.6, rise: 1, order: 5, seed: 6 },
  },
  anselm: { fore_top: { high: 16.2, foot: 11.8, w0: 4.3, w1: 5.2, rise: 1, order: 2, seed: 7 } },
};
const squareOf = (s, name) => SQUARE[shipOf(s)][name];
// how far the cloth shader shows a sail set (it keeps a furled one a roll: a twentieth of its height)
const shown = u => Math.max(u, 0.05);
// where a sail's foot and its yard are now
function footNow(s, name) {
  const q = squareOf(s, name);
  return q.under ? yardNow(s, q.under) + 0.4 : q.foot;
}
function yardNow(s, name) {
  const q = squareOf(s, name);
  return q.rise ? footNow(s, name) + (q.high - q.foot) * shown(K.setOf(s.sails_set, q.order)) : q.high;
}
// A half's card (side −1: the half to port, left of the mast; 1: to starboard) hangs at "Secret"'s yard hoisted — a
// topgallant's at its yard as it would be hoisted over its foot now (its `place`: fore_tg_e, main_tg_e — rigOf). Its
// cloth in the card (y down): its head and foot
const HUNG = Object.fromEntries(Object.entries(SQUARE.secret).map(([n, q]) => [n, q.high]));
const headIn = (q, name) => (q.under ? 0 : HUNG[name] - q.high);
const footIn = (q, name) => headIn(q, name) + q.high - q.foot;
// (past the mast a half goes on a little under the other, so the wind's waves open no gap between them)
const LAP = 0.6;
// a half's painting: the sail fully set (korabli.squareSail), its half
function squareHalf(g, e, name, side) {
  const s = e.state, q = squareOf(s, name);
  if (!q) return;
  const top = headIn(q, name), bottom = footIn(q, name), w = q.w1 + 0.4;
  g.save();
  g.beginPath();
  g.rect(side < 0 ? -w : -LAP, top - 0.2, w + LAP, bottom - top + 0.4);
  g.clip();
  K.squareSail(g, colours(s), { yard: -top, foot: -bottom, w0: q.w0, w1: q.w1 }, q.seed);
  g.restore();
}
// the wind on the cloth: the storm blows harder
const windOf = s => 1 + 1.5 * clamp(s.storm ?? 0, 0, 1);
// "Secret"'s cloth turns scarlet; "Anselm"'s grey stays
const scarletOf = s => (shipOf(s) === 'anselm' ? 0 : clamp(s.sails ?? 0, 0, 1));
// a half each frame (its animate): the cloth shader's numbers
function sailMotion(e, name) {
  const s = e.state, q = squareOf(s, name);
  if (!q) return;
  e.uniform('head', headIn(q, name));
  e.uniform('foot', footIn(q, name));
  e.uniform('set', K.setOf(s.sails_set, q.order));
  e.uniform('scarlet', scarletOf(s));
  e.uniform('luff', clamp(s.luff ?? 0, 0, 1));
  e.uniform('wind', windOf(s));
}
// What the rig takes from the sails' keys (the script keeps these; a cut gives them with its sails): the square sails'
// halves turned back from the mast and their feet forward as the wind fills them — a curve the light reads —, and
// where the topgallants hang (the poop deck's metres)
const AS_SECRET = { ship: 'secret', sails_set: 0 };
function rigOf(v) {
  const f = ease.inOut(clamp(v.sails_set ?? 0, 0, 1)) * (1 - clamp(v.luff ?? 0, 0, 1));
  AS_SECRET.sails_set = v.sails_set;
  const hang = name => footNow(AS_SECRET, name) + SQUARE.secret[name].high - SQUARE.secret[name].foot + WAIST;
  return { belly_l: 180 - 14 * f, belly_r: 180 + 14 * f, belly_tilt: -12 * f, fore_tg_e: hang('fore_tg'), main_tg_e: hang('main_tg') };
}

// "Anselm"'s gaff sails along the keel (x 0 at the mast, aft negative; y up from the main deck, negative): the boom at
// `boom` metres over the deck, `length` long, the gaff from its `throat` on the mast to its `peak`; set, it goes up
// from its boom with its gaff
const GAFF = {
  mainsail: { boom: 3.2, throat: 15, peak: 19, length: 9.6, order: 0, seed: 12 },
  foresail: { boom: 2.2, throat: 11.2, peak: 14.2, length: 7.6, order: 1, seed: 13 },
};
function gaffSail(g, e, name) {
  const s = e.state;
  if (shipOf(s) !== 'anselm') return;
  const q = GAFF[name];
  K.alongSail(g, colours(s), [[0, q.throat], [0, q.boom], [-q.length, q.boom], [-0.85 * q.length, q.peak]], q.seed);
}
function gaffMotion(e, name) {
  const s = e.state;
  if (shipOf(s) !== 'anselm') return;
  e.uniform('set', K.setOf(s.sails_set, GAFF[name].order));
  e.uniform('luff', clamp(s.luff ?? 0, 0, 1));
  e.uniform('wind', windOf(s));
}
// its spars (their own card over the sail's): the boom; the gaff — a layer, painted hoisted, its animate lays it down
// toward the boom as the sail comes down (its throat and peak where the cloth's corners are)
function gaffSpars(g, e, name) {
  const s = e.state;
  if (shipOf(s) !== 'anselm') return;
  const q = GAFF[name], c = colours(s);
  g.strokeStyle = c.spar;
  g.lineCap = 'round';
  g.lineWidth = 0.2;
  g.beginPath();
  g.moveTo(0.1, -q.boom);
  g.lineTo(-q.length - 0.3, -q.boom);
  g.stroke();
  e.layer('gaff', { pivot: [0.1, -q.throat], box: [-0.85 * q.length - 0.7, -q.peak - 0.6, 0.5, -q.boom + 0.3] }, g => {
    g.strokeStyle = c.spar;
    g.lineCap = 'round';
    g.lineWidth = 0.15;
    g.beginPath();
    g.moveTo(0.1, -q.throat);
    g.lineTo(-0.85 * q.length - 0.3, -q.peak - 0.2);
    g.stroke();
  });
}
function gaffSparsMotion(e, name) {
  const s = e.state;
  if (shipOf(s) !== 'anselm') return;
  const q = GAFF[name], u = shown(K.setOf(s.sails_set, q.order));
  const dx = -0.85 * q.length - 0.4, up1 = q.peak + 0.2 - q.throat, up = up1 * u, l = e.layer('gaff');
  l.y = (q.throat - q.boom) * (1 - u);
  l.rotate = Math.atan2(-up, dx) - Math.atan2(-up1, dx);
  l.scale = Math.hypot(dx, up) / Math.hypot(dx, up1);
}

// "Secret"'s spanker, brailed up: running before the wind she carries it gathered to the mizzen and its gaff (x 0 at
// the mast, aft negative; y up from the poop deck) — the bundled cloth hanging in folds under the gaff along the mast
const SPANKER = [-5.7, -14.3, 0.2, -3.2];
function spanker(g, e) {
  const s = e.state;
  if (shipOf(s) !== 'secret') return;
  g.beginPath();
  g.moveTo(0.1, -12.6);
  g.lineTo(-5.6, -14.2);
  g.quadraticCurveTo(-3.2, -12.4, -0.9, -9.5);
  g.quadraticCurveTo(-0.35, -6.5, -0.2, -3.2);
  g.lineTo(0.15, -3.2);
  g.closePath();
  K.cloth(g, colours(s), SPANKER, { seams: 'across', seed: 9 });
}
function spankerMotion(e) {
  e.uniform('scarlet', scarletOf(e.state));
  e.uniform('wind', windOf(e.state));
}

// A mast from the deck up to `height` (card units, y up negative), tapering from `base` across
function mast(g, c, height, base = 0.4) {
  g.fillStyle = c.spar;
  g.beginPath();
  g.moveTo(-base / 2, 0);
  g.lineTo(base / 2, 0);
  g.lineTo(base * 0.3, -height);
  g.lineTo(-base * 0.3, -height);
  g.closePath();
  g.fill();
}
// A mast's yards (card units over the main deck): each a layer painted where it is hoisted — its animate (yardsMotion)
// has it where its sail's head is now
function yards(g, e, names) {
  const s = e.state, c = colours(s);
  for (const name of names) {
    const q = squareOf(s, name);
    if (!q) continue;
    e.layer(`yard_${name}`, { depth: 0.1, box: [-q.w0 - 0.5, -q.high - 0.3, q.w0 + 0.5, -lowest(shipOf(s), name) + 0.3] }, g => {
      g.fillStyle = c.spar;
      g.fillRect(-q.w0 - 0.35, -q.high - 0.13, 2 * q.w0 + 0.7, 0.26);
    });
  }
}
// (how low a yard lies with nothing set)
const lowest = (ship, name) => {
  const q = SQUARE[ship][name];
  return q.rise ? (q.under ? lowest(ship, q.under) + 0.4 : q.foot) + (q.high - q.foot) * shown(0) : q.high;
};
function yardsMotion(e, names) {
  const s = e.state;
  for (const name of names) {
    const q = squareOf(s, name);
    if (q) e.layer(`yard_${name}`).y = q.high - yardNow(s, name);
  }
}

// A deck lantern: a brass frame round its glass — dark, and lit (a layer: korabli.lantern, its animate shows it as
// `lanterns` says); its flame glows and is a light of the scene ("of" it: <id>#flame)
function lantern(g, e) {
  g.fillStyle = '#4a3f30';
  g.fillRect(-0.1, -0.36, 0.2, 0.04);
  g.fillRect(-0.09, -0.02, 0.18, 0.03);
  g.fillStyle = N.rgba('#9aa0a4', 0.85);
  g.fillRect(-0.08, -0.32, 0.16, 0.3);
  g.fillStyle = '#4a3f30';
  g.fillRect(-0.01, -0.32, 0.02, 0.3);
  e.layer('lit', {}, g => K.lantern(g, e, 'flame'));
}
function lanternMotion(e) {
  const on = clamp(e.state.lanterns ?? 0, 0, 1);
  e.layer('lit').alpha = on;
  e.glow('flame', on);
}

// The scarlet silk on the waist about the mainmast's lantern (silk 0…1 — bolt by bolt): bolts of it lying across the
// deck, stacked two and three, the ends of the rolls turned to the side. Each stack is an element where it lies
// ([across, distance, how many]; the first is `silk`, then `silk_1`…), each bolt a layer its animate lays down in turn.
const STACKS = [[-5.0, 11.6, 3], [-0.2, 13.4, 2], [-4.7, 15.2, 2], [-1.0, 16.4, 3], [-2.8, 12.4, 1]];
const FIRST_BOLT = STACKS.map((_, i) => STACKS.slice(0, i).reduce((n, st) => n + st[2], 0));
function silkStack(g, e, i) {
  const SILK = N.sail(1);
  for (let j = 0; j < STACKS[i][2]; j++) {
    e.layer(`bolt_${j}`, {}, p => {
      const len = 1.5 - 0.15 * j, r = 0.16, x = -len / 2 + 0.1 * (j % 2), y = -r - 2 * r * j;
      p.fillStyle = SILK;
      p.beginPath();
      p.roundRect(x, y - r, len, 2 * r, r);
      p.fill();
      p.fillStyle = 'rgba(255,240,240,0.14)';
      p.fillRect(x + r, y - r * 0.75, len - 2 * r, r * 0.35);
      p.fillStyle = 'rgba(70,0,16,0.35)';
      p.beginPath();
      p.ellipse(x + len - r * 0.4, y, r * 0.35, r, 0, 0, 7);
      p.fill();
      p.strokeStyle = 'rgba(70,0,16,0.4)';
      p.lineWidth = 0.012;
      p.beginPath();
      p.arc(x + len - r * 0.4, y, r * 0.55, 0, 5);
      p.stroke();
    });
  }
}
function silkMotion(e, i) {
  const silk = clamp(e.state.silk ?? 0, 0, 1), n0 = FIRST_BOLT[i];
  for (let j = 0; j < STACKS[i][2]; j++) {
    const u = clamp(silk * 12 - (n0 + j), 0, 1), l = e.layer(`bolt_${j}`);
    l.alpha = u;
    l.y = -(1 - u) * 0.6;
  }
}
// The silk run out along the waist to be cut and sewn (a plane, seen from above: x to starboard, y back toward the
// stern): two long lengths of it, their folds, the seam where two widths are joined — each a layer its animate rolls
// out from its end as the work goes on (silk 0.3…1)
const RUNS = [[-1.2, 0.9], [0.9, 1.0]], RUN_FROM = 2.6, RUN_LEN = 5;
function silkRun(g, e) {
  const SILK = N.sail(1);
  RUNS.forEach(([x, w], i) => {
    e.layer(`run_${i}`, { pivot: [x, RUN_FROM] }, g => {
      g.fillStyle = SILK;
      g.beginPath();
      g.moveTo(x - w / 2, RUN_FROM);
      g.lineTo(x + w / 2, RUN_FROM);
      g.lineTo(x + w / 2 + 0.08 * Math.sin(i * 3), RUN_FROM - RUN_LEN);
      g.lineTo(x - w / 2, RUN_FROM - RUN_LEN + 0.25);
      g.closePath();
      g.fill();
      g.strokeStyle = 'rgba(70,0,16,0.3)';
      g.lineWidth = 0.015;
      for (let k = 0; k < 7; k++) {
        const yy = RUN_FROM - RUN_LEN * hash(k, i + 2);
        g.beginPath();
        g.moveTo(x - w / 2, yy);
        g.quadraticCurveTo(x, yy - 0.15, x + w / 2, yy + 0.05);
        g.stroke();
      }
      g.fillStyle = 'rgba(255,236,236,0.18)';
      g.fillRect(x - 0.02, RUN_FROM - RUN_LEN, 0.04, RUN_LEN);
    });
  });
}
function silkRunMotion(e) {
  const u = clamp(((e.state.silk ?? 0) - 0.3) / 0.7, 0, 1);
  RUNS.forEach((r, i) => {
    const k = ease.out(clamp(u * 1.4 - i * 0.4, 0, 1)), l = e.layer(`run_${i}`);
    l.scaleY = Math.max(0.01, k);
    l.alpha = k > 0 ? 1 : 0;
  });
}

// Liss in depth (x along each row): 0 — the long warehouses on the quay, tall doors under steep roofs; 1 — the town's
// houses behind them, narrower and taller; 2 — the town across the basin ahead, on its rise, and its one tower. Plain
// pale shapes a tone apart; `lit` — only their windows that burn at night, warm (their own elements, `glows`).
const TOWN = [
  { n: 9, step: 20, w: [15, 4], h: [7, 5], roof: 0.32, tone: ['#c9c3b8', '#b8b2a6', '#d6d1c6', '#a9a49a'] },
  { n: 14, step: 13, w: [8, 3], h: [9, 6], roof: 0.45, tone: ['#bdb7ac', '#cfc9be', '#aea89e'] },
  { n: 12, step: 16, w: [9, 4], h: [8, 6], roof: 0.5, tone: ['#b3ada3', '#c3bdb2'] },
];
function town(g, row, lit) {
  const r = TOWN[row];
  if (lit) g.fillStyle = N.WARM;
  for (let i = 0; i < r.n; i++) {
    const x = -95 + i * r.step + 4 * hash(i, row + 5);
    const w = r.w[0] + r.w[1] * hash(i, row + 1);
    const h = r.h[0] + r.h[1] * hash(i, row + 2) + (row === 2 ? 6 * Math.sin(i * 0.4) : 0);
    if (lit) {
      [0.25, 0.75].forEach((q, j) => {
        if (hash(i * 2 + j, 7 + row) < 0.5) g.fillRect(x + w * q - 0.4, -h + 1.4, 0.8, 1.6);
      });
      continue;
    }
    g.fillStyle = r.tone[i % r.tone.length];
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, -h);
    g.lineTo(x + w / 2, -h - w * r.roof);
    g.lineTo(x + w, -h);
    g.lineTo(x + w, 0);
    g.closePath();
    g.fill();
    g.fillStyle = 'rgba(50,48,46,0.5)';
    if (row === 0) g.fillRect(x + w / 2 - 1.4, -4.2, 2.8, 4.2);
    for (const q of [0.25, 0.75]) g.fillRect(x + w * q - 0.4, -h + 1.4, 0.8, 1.6);
  }
  if (row === 2 && !lit) {
    g.fillStyle = '#c8c2b6';
    g.fillRect(18, -26, 3.2, 26);
    g.beginPath();
    g.moveTo(17.6, -26);
    g.lineTo(19.6, -30);
    g.lineTo(21.6, -26);
    g.fill();
  }
}
// how much of the town is lit: as the night comes
const townLit = s => clamp((s.night ?? 0) * 1.4 + (s.dusk ?? 0) * 0.5, 0, 1);

// Her starboard side from outside, the bulwarks' other face (a card along it, x aft, from the water up): the hull over
// each run [from, to, how high] — up to the deck there —, the wale under the deck's edge, a dark line along the water
function sideOutside(g, e, runs) {
  const c = colours(e.state);
  for (const [x0, x1, h] of runs) {
    g.fillStyle = c.hull;
    g.fillRect(x0, -h, x1 - x0, h);
    g.fillStyle = c.rail;
    g.fillRect(x0, -h, x1 - x0, 0.14);
    g.fillStyle = 'rgba(40,36,30,0.45)';
    g.fillRect(x0, -0.3, x1 - x0, 0.3);
  }
}
// how far over the water her boat hangs under the rail before it is lowered (its gunwale under the waist's caprail)
const SKIFF_HUNG = 2.8;

// ── the voyage: the world where it is ──
// Kaperna lies ahead in the west; Liss's quay 30 km astern; the open sea between and round them.
const KAPERNA = 6000, LISSE = -30000;
// how far off Kaperna she is at `shore`: 0 — 6 km (the hill on the horizon), 1 — 600 m; below 0, farther out in the
// open sea (−1: 15 km — no land in sight)
const offShore = shore => (shore < 0 ? 6000 + 9000 * clamp(-shore, 0, 1) : Math.exp(mix(Math.log(6000), Math.log(600), ease.inOut(clamp(shore, 0, 1)))));
// where the game's keys put her: alongside Liss's quay (port), else on her course to Kaperna as far as `shore` says
// (ship_at: which `port` and `shore` put her there — the script puts her anew when they say another place)
const placedBy = ({ port = 0, shore = 0 }) => `${port >= 0.5 ? 1 : 0}:${shore}`;
const placeOf = v => ({ ship_x: 0, ship_d: (v.port ?? 0) >= 0.5 ? LISSE : Math.round((KAPERNA - offShore(v.shore ?? 0)) * 100) / 100, ship_at: placedBy(v) });
// her way a second: up to 4 m under full sail, less as they luff; none in port, nor once she lies to off Kaperna
const HOVE_TO = 450;
function speedOf(s) {
  if ((s.port ?? 0) >= 0.5) return 0;
  if (Math.hypot(s.ship_x ?? 0, KAPERNA - (s.ship_d ?? 0)) <= HOVE_TO) return 0;
  return 4 * clamp(s.sails_set ?? 0, 0, 1) * (1 - 0.7 * clamp(s.luff ?? 0, 0, 1));
}
// her bow from the course to Kaperna, degrees to starboard (heading −1…1)
const turnOf = s => 25 * clamp(s.heading ?? 0, -1, 1);
// The mail steamer: going the same way at her own pace; `steamer` u (0…1] puts her that far ahead of the ship as she
// is now — 420 m and 50 m to starboard, to 70 m and 24 m — and both sail on; 0 — she is not here (far to the south)
const STEAMER_SPEED = 2.6;
function steamerAt(u, ship) {
  if (!(u > 0)) return { steamer_x: 15000, steamer_d: (ship.ship_d ?? 0), steamer_smoke: 0, steamer_at: 0 };
  const k = ease.inOut(clamp(u, 0, 1));
  return { steamer_x: (ship.ship_x ?? 0) + mix(50, 24, k), steamer_d: (ship.ship_d ?? 0) + mix(420, 70, k), steamer_smoke: 1, steamer_at: u };
}

// ── the film ──
// Places on her decks (across, distance): behind the wheel, an arm's bend from its rim; at the starboard rail of the
// poop, and beside; at the poop's rail over the waist; round the silk on the waist; the cask amidships on the poop and
// the two beyond it, seen between the two at the rail from over the side; the «Anselm»'s mainmast and before her shrouds,
// under them where a hand takes them; the companionway aft, where Panten comes up; by the «Secret»'s mainmast and its
// lantern; on her forecastle
const AT_WHEEL = [KEEL, 2.28], RAIL = [1.32, 3.8], RAIL_2 = [1.32, 5.1], BREAK = [-3.5, 5.6], BY_GREY = [-4.3, 5.2],
  SILK = [[-4.6, 10.2], [-0.7, 11.4], [-0.4, 9.4]], CASK_AT = [-0.09, 3.94], CASK = [[-0.98, 4.05], [-0.7, 3.27]], MAST = [-3.7, 13.0], SHROUDS = [-2.2, 13.6],
  UNDER_SHROUDS = [1.15, 13.9], AFT = [-4.4, -0.6], WATCH = [0.2, 5.2], SILK_AT = [-2.3, 10.6], BY_MAINMAST = [-1.2, 13.2],
  BOW = [[-2.4, 27], [-3.4, 26.5], [-1.4, 26.5]];
// seats (in her frame — across, distance, the seat's top over the poop deck): the «Anselm»'s crosstrees, to starboard of
// her mast (shrouds#top); along the after coaming of the main hatch, facing aft
const CROSSTREES = [KEEL + 0.9, 14.4, WAIST + 10.45];
const HATCH = [-3.4, -2.75, -2.05, -1.4].map(a => [a, 9.2, WAIST + 0.45]);
const seat = p => ({ on: 'ship', at: p });
// points that go with her: far ahead over her bow, out over the sea to starboard
const AHEAD = { on: 'ship', at: [KEEL, 3000, 30] }, STARBOARD_SEA = { on: 'ship', at: [400, 60, 0] }, TO_KAPERNA = 'kaperna#kaperna';
const PLACE = { grey: 'gr', assol: 'as', gop: 'go', panten: 'pa', letika: 'le', sailor: 'sa', crew2: 'cr', sailor3: 's3', sailor4: 's4',
  zimmer: 'zi', musician1: 'm1', musician2: 'm2', longren: 'lo' };
const WHO = Object.keys(PLACE);
const loop = motion => ({ motion, loop: true });
// the deck under a place: the poop aft of its break, the waist before it
const deckAt = d => (d < AT.brk ? 0 : WAIST);
// where one at `from` faces to look at `to` (degrees: 0 her bow, 90 starboard, 180 aft, 270 port)
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) / DEG) + 360) % 360;
// someone at a place on her decks, facing, doing — their keys for a beat's `from`
const at = (id, [a, d], turn, does = 'stand', more = {}) => {
  const p = PLACE[id];
  return { [`${p}_a`]: a, [`${p}_d`]: d, [`${p}_e`]: deckAt(d), [`${id}_here`]: true, [`${id}_turn`]: turn, [`${id}_do`]: does,
    ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) };
};
// someone sat on a seat of hers, facing, in a seated loop
const sat = (id, p, turn, does, more = {}) => at(id, p, turn, loop(does), { on: seat(p), ...more });
const NOBODY = Object.assign({}, ...WHO.map(id => ({ [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_look`]: null, [`${id}_reach`]: null,
  [`${id}_with`]: null, [`${id}_on`]: null, [`${id}_gait`]: null, [`${id}_wear`]: null })));
// the camera on her deck, as the scene's; no close shot open
const CAM0 = { camera_on: null, camera_target: null, camera_shot: null, camera_frame: null, camera_glide: 0, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, camera_pitch: 0, fade: 0,
  ropes: 0 };
// the operator on someone (shot: their height in frame heights; frame: where their head goes)
const on = (target, shot, frame = null, more = {}) => ({ camera_target: target, camera_shot: shot, camera_frame: frame, ...more });
// the operator off her decks — the camera rides an unseen place of the scene (its start is there, the operator comes
// from it toward its target): cam_rail — over the sea off the starboard rail of the poop, before the two who stand at
// it; cam_boat — low over the water off her starboard side, abaft her boat; cam_steamer — on the mail steamer's deck,
// inboard of Longren and before him
const off = (place, target, shot, frame) => ({ camera_on: place, ...on(target, shot, frame) });
// her and the world at a beat's start: at sea under scarlet sails, or alongside in Liss, her sails furled
// (a cut carries what the script would set after it: her place, the steamer's, the hour's light, her rig)
const voyage = v => ({ ...v, ...placeOf(v), ...steamerAt(v.steamer ?? 0, placeOf(v)), ship_f: 180 + turnOf(v), ...N.keys(v.hour),
  harbour_lit: townLit(N.keys(v.hour)), ...rigOf(v) });
const AT_SEA = v => voyage({ ship: 'secret', storm: 0, roll: 0, sails: 1, sails_set: 1, luff: 0, helm: 0, heading: 0, shore: 0, port: 0, lanterns: 0, silk: 0, cask: 0, steamer: 0,
  skiff_down: 0, ...v });
const IN_PORT = v => AT_SEA({ port: 1, sails: 0, sails_set: 0, ...v });
// off Kaperna, 30 m short of where she lies to (`shore` 1 names the place; the cut gives her place itself)
const OFF_KAPERNA = v => ({ ...AT_SEA({ shore: 1, ...v }), ship_d: KAPERNA - HOVE_TO - 30, ship_at: placedBy({ shore: 1 }) });
const hands = { r: 'wheel#rim_r', l: 'wheel#rim_l' };
// the «Anselm» far out in a swell, nobody on her yet
const ANSELM = v => ({ ...NOBODY, ...CAM0, ...AT_SEA({ hour: 0.45, ship: 'anselm', sails: 0, roll: 0.25, storm: 0.25, shore: -1, ...v }) });
// Gray as her ship's boy, fifteen
const BOY = { wear: kit.cast.characters.grey_teen };
// Zimmer and his two musicians, their instruments with them: sat in a row on the hatch, Zimmer between the two;
// standing on the forecastle, swaying, the instruments lowered
const BAND = [['zimmer', 'violin'], ['musician1', 'violin'], ['musician2', 'cello']];
const bandSat = () => Object.assign({}, ...BAND.map(([id, part], i) => sat(id, HATCH[[1, 0, 2][i]], 180, 'seated', { with: [part] })));
const bandOnBow = () => Object.assign({}, ...BAND.map(([id, part], i) => at(id, BOW[i], 180, loop('sway'), { with: [part] })));
// Longren, a sailor of the mail steamer, on her deck (in her frame: metres toward her stern from her middle, in from
// her port side, over the water) at her port rail by her stern, clear of her house and her mast, his pipe in his hand,
// turned to the «Secret» coming up on her quarter
const STEAMER_DECK = 3;
const LONGREN = { lo_a: 19, lo_d: 0.45, lo_e: STEAMER_DECK, longren_here: true, longren_turn: 135, longren_do: loop('pipe'), longren_with: ['pipe'],
  longren_look: 'mainmast#mainmast' };

// film(scene) — the beats. A beat's `from` reads what the game's play has decided — the play's keys (the scene's
// `states`: leg, sun, wine, ring, ring_kind), which no `from` sets
function film(scene) {
  const sun = () => { const v = scene.get('sun'); return typeof v === 'number' ? v : 0.26; };
  const leg = () => { const v = scene.get('leg'); return typeof v === 'number' ? v : 0; };
  const wine = () => (scene.get('wine') ?? 0) >= 0.5;
  // the ring Assol has come aboard with (as on the shore, in the skiff): on her hand while `ring` is "finger" — his
  // mother's, thin, with a stone (the cast's part `ring`), or his own old wide one (`ring_old`), as `ring_kind` says; on
  // its cord over her dress while it is "cord" (`ring_cord`); else none
  const ringOn = () => {
    const ring = scene.get('ring');
    return ring === 'finger' ? [scene.get('ring_kind') === 'mother' ? 'ring' : 'ring_old'] : ring === 'cord' ? ['ring_cord'] : null;
  };
  // the boy up on the crosstrees, small against the sky, the camera looking up at him; Gop under the mast, his head
  // thrown back
  const TOP = () => ({ ...ANSELM({ roll: 0 }), ...on('grey', 0.12, [0.5, 0.22]),
    ...sat('grey', CROSSTREES, 0, 'seated', { ...BOY, look: AHEAD }),
    ...at('gop', MAST, toward(MAST, CROSSTREES), loop('hands_behind'), { look: 'grey#head' }) });
  return {
    // anselm — the «Anselm» in a swell, far out: Gop by the mainmast, his hands behind him, glancing at the boy; the
    // ship's boy Gray (fifteen) before the shrouds, looking up them
    anselm: {
      from: () => ({ ...ANSELM(), ...on('by_mast', 0.42, [0.5, 0.62]),
        ...at('gop', MAST, 200, loop('hands_behind')), ...at('grey', SHROUDS, 0, 'stand', BOY) }),
      run: async s => {
        const gop = s.person('gop'), grey = s.person('grey');
        await s.wait(1);
        grey.look('shrouds#top');
        s.tell('anselm:looks-up');
        await s.wait(1);
        gop.look('grey#head');
        await s.wait(2);
        gop.look('shrouds#top');
        await s.wait(1.6);
        gop.look('grey#head');
        await s.wait(2.4);
      },
    },
    // shrouds — the boy goes over to the shrouds and takes them, his hands up on the ropes; the cut into his hands
    // close (the insert `ropes`: both closed on the shrouds, down by the deck) — the game's «Shrouds» goes on from here
    // (climb, hand_l, hand_r, slip, roll)
    shrouds: {
      after: 'anselm',
      from: () => ({ ...ANSELM(), ...on('by_mast', 0.42, [0.5, 0.62]),
        ...at('gop', MAST, 200, loop('hands_behind'), { look: 'grey#head' }), ...at('grey', SHROUDS, 0, 'stand', { ...BOY, look: 'shrouds#top' }) }),
      run: async s => {
        const grey = s.person('grey');
        const close = s.shot({ ropes: 1, climb: 0, hand_l: 1, hand_r: 1, slip: 0 });
        s.camera({ target: 'grey', shot: 0.5, frame: [0.5, 0.4], glide: 1.5 });
        grey.look('shrouds#hold_r');
        await grey.walk([UNDER_SHROUDS]);
        await grey.turn(0);
        grey.reach({ r: 'shrouds#hold_r', l: 'shrouds#hold_l' });
        grey.look('shrouds#top');
        await s.wait(0.8);
        await s.until(() => close.ready);
        close.cut();
        s.tell('shrouds:close');
        await s.wait(1);
      },
    },
    // top — the cut back to the deck, the camera looking up: high on the crosstrees a small figure sits against the
    // sky; then Gop under the mast, his head thrown back (under his line)
    top: {
      after: 'shrouds',
      from: TOP,
      run: async s => {
        s.cut(TOP());
        const below = s.shot(on('gop', 0.5, [0.42, 0.36]));
        await s.wait(3);
        await s.until(() => below.ready);
        below.cut();
        s.tell('top:up');
        await s.wait(4);
      },
    },
    // letter — the «Anselm» in Liss, a calm noon: Gray (twenty) at her rail reading a letter (under the game's choice)
    letter: {
      from: () => ({ ...NOBODY, ...CAM0, ...IN_PORT({ hour: 0.5, ship: 'anselm' }), ...on('grey', 0.9, [0.42, 0.3]),
        ...at('grey', RAIL, 90, loop('read_stand'), { with: ['letter'], look: 'grey#letter' }) }),
      run: async s => {
        await s.wait(1);
        s.tell('letter:reading');
        await s.wait(2);
      },
    },
    // gop_bye — the «Anselm» in Liss, her sails furled: Gop at the rail, his hands behind him; Gray (twenty) in his
    // frock coat, his bundle in his hand, come to say goodbye; Gop turns to him (under his line)
    gop_bye: {
      from: () => ({ ...NOBODY, ...CAM0, ...IN_PORT({ hour: 0.5, ship: 'anselm' }), ...on('by_rail', 0.7, [0.5, 0.56]),
        ...at('gop', RAIL_2, 90, loop('hands_behind')), ...at('grey', RAIL, toward(RAIL, RAIL_2), 'stand', { with: ['bundle'], look: 'gop#head' }) }),
      run: async s => {
        const gop = s.person('gop');
        await s.wait(1.6);
        gop.look('grey#head');
        await gop.turn(toward(RAIL_2, RAIL));
        s.tell('gop_bye:turns');
        await s.wait(4);
      },
    },
    // secret — the «Secret» in Liss, her sails furled: Gray at the wheel lays his hand on its rim, looks ahead
    secret: {
      from: () => ({ ...NOBODY, ...CAM0, ...IN_PORT({ hour: 0.6 }), ...on('grey', 0.9, [0.4, 0.3]), ...at('grey', AT_WHEEL, 0) }),
      run: async s => {
        const grey = s.person('grey');
        await s.wait(1);
        grey.look('wheel#wheel');
        await s.wait(0.8);
        grey.reach({ r: 'wheel#rim_r' });
        s.tell('secret:hand-on-wheel');
        await s.wait(3.6);
        grey.look(AHEAD);
        await s.wait(2.6);
      },
    },
    // sew — night in port, the lanterns: the crew cut and sew the scarlet silk on the waist, Zimmer and his two
    // musicians sat on the hatch among them, their instruments on their knees; Gray watching from the poop's rail;
    // Panten comes up to him (under his line)
    sew: {
      from: () => ({ ...NOBODY, ...CAM0, ...IN_PORT({ hour: 0.95, lanterns: 1, silk: 1 }), ...on('crew2', 0.5, [0.5, 0.5]),
        ...at('grey', BREAK, 0, 'stand', { look: 'silk#silk' }), ...at('panten', AFT, 0, loop('hands_behind')),
        ...SILK.map((p, i) => at(['letika', 'sailor', 'crew2'][i], p, toward(p, SILK_AT), loop('sew'), { look: 'silk#silk' })).reduce((a, b) => ({ ...a, ...b })),
        ...bandSat() }),
      run: async s => {
        const grey = s.person('grey'), panten = s.person('panten');
        // (the cut to Gray at the rail, made ready while the crew sews)
        const next = s.shot({ ...on('grey', 0.75, [0.72, 0.3]), camera_pitch: -6 });
        await s.wait(3.4);
        next.cut();
        await s.wait(0.8);
        await panten.walk([[-4.4, 3.5], BY_GREY]);
        await panten.turn(toward(BY_GREY, BREAK));
        panten.look('grey#head');
        s.tell('sew:panten');
        await s.wait(0.6);
        grey.look('panten#head');
        await grey.turn(toward(BREAK, BY_GREY));
        await s.wait(4);
      },
    },
    // rail — before dawn, at sea under white sails half set: Gray at the rail turns his eyes to where Kaperna lies
    rail: {
      from: () => ({ ...NOBODY, ...CAM0, ...AT_SEA({ hour: 0.21, sails: 0, sails_set: 0.15 }), ...on('grey', 0.8, [0.36, 0.3]),
        ...at('grey', RAIL, 60, loop('hands_behind'), { look: AHEAD }) }),
      run: async s => {
        await s.wait(3);
        s.person('grey').look(TO_KAPERNA);
        s.tell('rail:looks');
        await s.wait(5);
      },
    },
    // raise — dawn (the play's `sun` is the hour): the scarlet sails go up one after another and fill; Gray at the wheel
    // looks up at them, Letika by the rail, the musicians far on the forecastle; the camera lifts its eyes with the sails
    raise: {
      from: () => ({ ...NOBODY, ...CAM0, ...AT_SEA({ hour: sun(), sails_set: 0 }), ...on('grey', 0.62, [0.26, 0.5]),
        ...at('grey', AT_WHEEL, 0, loop('helm'), { reach: hands }), ...at('letika', WATCH, 20, 'stand'), ...bandOnBow() }),
      run: async s => {
        const grey = s.person('grey'), letika = s.person('letika');
        await s.wait(1);
        const up = s.move('sails_set', 1, { over: 12, ease: 'inOut' });
        s.move('camera_pitch', 9, { over: 11, ease: 'inOut' });
        s.tell('raise:going-up');
        grey.look('mainmast#mainmast');
        await s.wait(5);
        letika.look('foremast#foremast');
        await s.wait(3);
        grey.look(AHEAD);
        await up;
        s.tell('raise:full');
        await s.wait(2);
      },
    },
    // helm — Gray at the wheel, steering for Kaperna; far on the forecastle the musicians stand swaying, their
    // instruments lowered (under the game's «Course»: helm, heading, luff). After `raise` it goes on where she is; the
    // scene opened on it, the play's keys place it: `leg` — how far along her way she is (as `shore`), `sun` — the hour
    helm: {
      after: 'raise',
      from: () => ({ ...NOBODY, ...CAM0, ...AT_SEA({ hour: sun(), shore: leg() }), ...on('grey', 0.62, [0.26, 0.5]), camera_pitch: 9,
        ...at('grey', AT_WHEEL, 0, loop('helm'), { reach: hands, look: AHEAD }), ...at('letika', WATCH, 20, 'stand', { look: 'foremast#foremast' }),
        ...bandOnBow() }),
      run: async s => {
        s.person('grey').look(TO_KAPERNA);
        s.move('camera_pitch', 3, { over: 2, ease: 'inOut' });
        await s.wait(2);
        s.tell('helm:ready');
      },
    },
    // arrive — Kaperna close (the play's `sun` is the hour): the hill, the houses, the cape; Gray and Letika at the rail
    // look at the shore as she stands in, shakes the wind out of her sails and lies to; the cut over her side, seen from
    // the water — her boat goes down from under the rail to the water (skiff_down), the two at the rail over it
    arrive: {
      from: () => ({ ...NOBODY, ...CAM0, ...OFF_KAPERNA({ hour: sun() }), ...on('by_rail', 0.7, [0.34, 0.56]),
        ...at('grey', RAIL, 40, 'stand'), ...at('letika', RAIL_2, 30, 'stand') }),
      run: async s => {
        const boat = s.shot(off('cam_boat', 'skiff#skiff', 0.53, [0.5, 0.62]));
        await s.wait(2);
        s.person('grey').look(TO_KAPERNA);
        s.move('luff', 0.7, { over: 5, ease: 'inOut' });
        await s.wait(1);
        s.person('letika').look('kaperna#longren_house');
        s.tell('arrive:shore');
        await s.wait(3.5);
        await s.until(() => boat.ready);
        boat.cut();
        await s.move('skiff_down', 1, { over: 3, ease: 'inOut' });
        s.tell('arrive:boat');
        await s.wait(2.5);
      },
    },
    // steamer — the epilogue, dawn: the «Secret» comes up with the mail steamer, the two at the rail seen from the poop,
    // the steamer ahead; the cut to Assol from over the side, close (the ring with her, as the play has it): she waves,
    // Gray beside her; the cut onto the steamer, from behind: Longren at her rail with his pipe, the scarlet sails
    // beyond him — he lifts his hand
    steamer: {
      from: () => ({ ...NOBODY, ...CAM0, ...AT_SEA({ hour: 0.27, shore: -0.5, steamer: 0.97 }), ...on('by_rail', 0.7, [0.3, 0.56]),
        ...at('assol', RAIL_2, 70, 'stand', { with: ringOn() }), ...at('grey', RAIL, 70, loop('hands_behind')), ...LONGREN }),
      run: async s => {
        const assol = s.person('assol'), grey = s.person('grey'), longren = s.person('longren');
        const close = s.shot(off('cam_rail', 'assol', 0.85, [0.64, 0.3]));
        const across = s.shot(off('cam_steamer', 'longren', 0.7, [0.3, 0.42]));
        await s.wait(1);
        assol.look('steamer#steamer');
        await s.wait(0.4);
        grey.look('steamer#steamer');
        await s.wait(1.6);
        await s.until(() => close.ready);
        close.cut();
        await assol.do('wave');
        s.tell('steamer:waved');
        assol.do('wave');
        await s.until(() => across.ready);
        across.cut();
        await s.wait(1.2);
        await longren.do('wave');
        s.tell('steamer:longren');
        longren.do('pipe', { loop: true });
        await s.wait(2);
      },
    },
    // night_end — the epilogue, night at sea under the scarlet sails, the lanterns: on the waist Zimmer stands by the
    // mainmast, swaying, his fiddle lowered; the cut to Assol and Gray at the rail, their faces to us (from over the
    // side). The play's `wine` (0 unless the game says 1): 1 — the old cask of the Grays and its mugs, two sailors
    // beyond it, seen between the two at the rail; 0 — no cask: four sailors sit on the hatch and sing (sitting still:
    // the song is the game's sound) — the beat opens on them from the poop's break, Zimmer standing behind them
    night_end: {
      from: () => ({ ...NOBODY, ...CAM0, ...AT_SEA({ hour: 0.97, shore: -1, lanterns: 1, cask: wine() ? 1 : 0 }),
        ...(wine() ? on('zimmer', 0.3, [0.6, 0.36]) : on('crew2', 0.49, [0.56, 0.66])),
        ...at('zimmer', BY_MAINMAST, 180, loop('sway'), { with: ['violin'] }),
        ...at('assol', RAIL_2, 80, 'stand', { look: STARBOARD_SEA, with: ringOn() }), ...at('grey', RAIL, 90, 'stand', { look: STARBOARD_SEA }),
        ...(wine() ? { ...at('sailor', CASK[0], toward(CASK[0], CASK_AT), 'stand'), ...at('crew2', CASK[1], toward(CASK[1], CASK_AT), 'stand') }
          : Object.assign({}, ...['sailor', 'sailor3', 'crew2', 'sailor4'].map((id, i) => sat(id, HATCH[i], 180, 'seated')))) }),
      run: async s => {
        const assol = s.person('assol'), grey = s.person('grey'), sailor = s.person('sailor'), crew2 = s.person('crew2');
        const cask = wine();
        const rail = s.shot(off('cam_rail', 'by_rail', 0.9, [0.5, 0.56]));
        await s.wait(4);
        await s.until(() => rail.ready);
        rail.cut();
        await s.wait(1);
        if (cask) sailor.look('crew2#head');
        await s.wait(0.6);
        if (cask) crew2.look('sailor#head');
        await s.wait(0.4);
        assol.look('grey#head');
        await s.wait(0.6);
        grey.look('assol#head');
        s.tell('night_end:look');
        await s.wait(3.4);
        assol.look(STARBOARD_SEA);
        await s.wait(1);
        grey.look(STARBOARD_SEA);
        await s.wait(2);
        if (cask) sailor.look('assol#head');
        await s.wait(1);
        if (cask) crew2.look('cask#cask');
        await s.wait(4);
      },
    },
  };
}
const SHOWCASE = ['anselm', 'shrouds', 'top', 'letter', 'gop_bye', 'secret', 'sew', 'rail', 'raise', 'helm', 'arrive', 'steamer', 'night_end'];

// ── the sky: nebo's, seen all round from her deck; straight ahead (the bow on her course) is the west ──
const HORIZON = 0.56;
const SKY = {
  horizon: HORIZON,
  round: true,
  // the sun rises astern over the sea, crosses the south (to port) and sets ahead; the moon the same way round
  sun: (u, height, state, out) => N.onRound(180 * clamp(u, 0, 1) - 180, 55 * height - (u < 0 || u > 1 ? 4 : 0), HORIZON, out),
  moon: (u, height, state, out) => N.onRound(180 * clamp(u, 0, 1) - 180, 40 * height - (u < 0 || u > 1 ? 4 : 0), HORIZON, out),
  clouds: [[2.4, 0.2, 1.2, 0.02], [3.3, 0.31, 0.9, 0.014], [3.9, 0.12, 1.4, 0.022], [5.4, 0.25, 1.0, 0.014], [0.6, 0.18, 1.2, 0.018]],
  storm: 'storm',
};

return { KEEL, WAIST, SEA, AT, colours, shipOf, SQUARE, squareOf, squareHalf, sailMotion, rigOf, GAFF, gaffSail, gaffMotion, gaffSpars, gaffSparsMotion,
  SPANKER, spanker, spankerMotion, STACKS, silkStack, silkMotion, silkRun, silkRunMotion, mast, yards, yardsMotion, lantern, lanternMotion, town, townLit,
  KAPERNA, LISSE, offShore, placeOf, placedBy, speedOf, turnOf, STEAMER_SPEED, steamerAt, film, SHOWCASE, SKY, HORIZON, sideOutside, SKIFF_HUNG };
