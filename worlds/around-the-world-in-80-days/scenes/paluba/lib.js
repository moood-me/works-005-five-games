// The deck — what the scene's elements, script and film share: the ship's plan (one deck, four ships told apart by
// their details), the ports on the horizon, the colours, the parts of the «Henrietta» that go into her furnaces and how
// they go (burn), and the film in beats (film(scene), for the world's module beats).
//   Metres, the ship's own: `distance` forward along her keel (the bow at +46), `across` to starboard (her right, the
// side of the ports and the moon); the main deck is the land (0), the sea 5.5 m below it, a quay 2.6 m below it to
// starboard. The ship lies still in the world; her way through the water is the sea's (its shader runs by `speed`).
// The camera stands on the deck by her poop looking forward; the operator frames the people.
const { mixc, css, rgba, glow } = kit.svet;
const clamp01 = v => anim.clamp(typeof v === 'number' ? v : 0, 0, 1);

const SHIPS = ['mongolia', 'rangoon', 'general_grant', 'henrietta'];
const PORTS = ['suez', 'bombay', 'new_york', 'queenstown', 'liverpool', 'none'];
const shipOf = st => (SHIPS.includes(st.ship) ? st.ship : 'mongolia');
const portOf = st => (PORTS.includes(st.port) ? st.port : 'none');
// a quay alongside to starboard (and the gangway down to it)
const quayed = p => p === 'suez' || p === 'new_york' || p === 'liverpool';

const plan = {
  sea: -5.5,
  quay: -2.6,
  // the bulwarks' inner face either side; the rail's height
  beam: 5.4,
  rail: 1.1,
  // the deck from the stern to the bow's root; the bow
  stern: -5,
  bowAt: 42,
  bow: 49,
  // the captain's cabin (on the «Henrietta»; the others' after skylight), its aft face, its starboard side
  cabin: { a: -3, d: 7, w: 3, deep: 3.6, h: 2.3 },
  mastMain: { a: 0, d: 11, h: 25 },
  mastFore: { a: 0, d: 34, h: 23 },
  // the stokehold's hatch (open: the furnaces' glow), and the bunks stacked by it
  hatch: { a: 1.4, d: 14.6, s: 1.6 },
  bunks: { a: 3.4, d: 12.4 },
  // the deckhouse: its aft face, how far forward it runs; the bridge on its roof; the funnel through it
  house: { a: 0, d: 18, deep: 8, w: 4.4, h: 2.4 },
  funnel: { a: 0, d: 22.5, r: 1.05, top: 11 },
  // the boats on chocks across the deck between the hatch and the deckhouse: the port one (the part's point) and,
  // a part of the same element, the starboard one beside it
  boats: { a: -2.6, d: 15.8, next: [6.2, 1.2] },
  // the gangway's head at the starboard rail
  gangway: { d: 9.5 },
  // the night lamp hung in the starboard shrouds by the people at the rail
  lamp: [4.2, 9.6, 2.5],
  // the calendar on the deckhouse's aft face
  calendar: [-1.2, 1.55],
  // Fogg's deck chair
  chair: [-2.6, 13.2],
  // the custom house's cell (release), far off to starboard where no deck shot sees it
  cell: [400, 0],
};

// The ships' colours: deck, bulwark (inside), rail cap, house, funnel, its band, masts, boats, sea
const COLOURS = {
  mongolia: { deck: '#cdb894', bulwark: '#ece6d8', cap: '#8a5c36', house: '#a8744a', trim: '#ece6d8', funnel: '#1e1e20', band: '#1e1e20', mast: '#c4a06a', boat: '#f2efe8', sea: '#2f8098', iron: '#2e2f33' },
  rangoon: { deck: '#cdb894', bulwark: '#ece6d8', cap: '#8a5c36', house: '#a8744a', trim: '#ece6d8', funnel: '#1e1e20', band: '#1e1e20', mast: '#c4a06a', boat: '#f2efe8', sea: '#2c6a86', iron: '#2e2f33' },
  general_grant: { deck: '#d4c19c', bulwark: '#f4f2ec', cap: '#6e4a30', house: '#f4f1ea', trim: '#3e6a4e', funnel: '#b23a28', band: '#1c1c1e', mast: '#c8a874', boat: '#f4f2ec', sea: '#2b72a6', iron: '#2e2f33' },
  henrietta: { deck: '#b9a07a', bulwark: '#8e6c48', cap: '#5c4030', house: '#93683f', trim: '#5c4030', funnel: '#2c2926', band: '#a33628', mast: '#9e7c52', boat: '#dcd4c0', sea: '#4f7a76', iron: '#3a3b3e' },
};
const colours = st => COLOURS[shipOf(st)];

// ── the «Henrietta»'s parts that burn (the game's «The boilers») ──
// Each: its key (1 aboard, 0 burnt), its element (or the anchor its cards stand on), where it is and the point the
// player takes it by (`<part>#part`, its element's), and how it goes: dragged to the hatch (`drag_<part>` 0…1), a mast
// falling first (its animate tips it over sideways, the first 0.35 of the drag). The script places them (keys
// at_<part>_a, _d, _e: where the anchor is); each element's animate shrinks it as it goes and hides it at 0, dims it
// while `locked_<part>`. `home` — the anchor's own place; `mid` — where the part's middle is (what goes to the hatch).
const PARTS = {
  deckhouse: { anchor: 'house', home: [0, 18], mid: [0, 22] },
  boats: { anchor: 'boats', home: [plan.boats.a, plan.boats.d], mid: [plan.boats.a + 3.1, plan.boats.d] },
  bunks: { anchor: 'bunks', home: [plan.bunks.a, plan.bunks.d] },
  yards: { anchor: 'yards_at', home: [0, 11], mid: [0, 22], drop: -7 },
  mast_fore: { anchor: 'mast_fore', home: [0, plan.mastFore.d], falls: true },
  mast_main: { anchor: 'mast_main', home: [0, plan.mastMain.d], falls: true },
  bulwarks: { anchor: 'bulwarks_at', home: [0, 0], mid: [0, 20] },
  speedy_cabin: { anchor: 'cabin', home: [plan.cabin.a, plan.cabin.d], mid: [plan.cabin.a, plan.cabin.d + plan.cabin.deep / 2] },
};
const PART_NAMES = Object.keys(PARTS);
// where a part's anchor is, dragged `v` of the way: [across, distance, elevation] — its middle along the deck to the
// hatch's side, lowered as it goes (a mast slides only once it is down)
function partAt(name, v) {
  const p = PARTS[name], u = clamp01(v), H = plan.hatch, mid = p.mid ?? p.home;
  const to = [H.a - 1.5, H.d + 0.9];
  const slide = anim.ease.inOut(p.falls ? anim.span(u, 0.35, 1) : u);
  return [p.home[0] + (to[0] - mid[0]) * slide, p.home[1] + (to[1] - mid[1]) * slide, (p.drop ?? 0) * slide];
}
// a mast's fall (radians, its layer turned about its foot: over to port)
const fallOf = v => -1.36 * anim.ease.inOut(anim.span(clamp01(v), 0, 0.35));
// how a part looks as it goes: its scale, its alpha (0 — gone), its brightness (locked: as not yours)
function partLook(st, name) {
  if (shipOf(st) !== 'henrietta') return { scale: 1, alpha: 1, bright: 1 };
  const here = (st[name] ?? 1) > 0.5, d = clamp01(st[`drag_${name}`]);
  return { scale: anim.mix(1, 0.32, anim.ease.in(d)), alpha: here ? 1 : 0, bright: (st[`locked_${name}`] ?? 0) > 0.5 ? 0.5 : 1 };
}
// an animate's lines for a part: its layers (all its painting) shrunk about `pivot`, hidden, dimmed
function partAnimate(e, name, layers, pivot) {
  const k = partLook(e.state, name);
  for (const n of layers) {
    const l = e.layer(n);
    l.scale = k.scale;
    l.x = pivot[0] * (1 - k.scale);
    l.y = pivot[1] * (1 - k.scale);
    l.alpha = k.alpha;
    l.brightness = k.bright;
  }
  return k;
}

// ── painting helpers ──
const poly = (g, pts, fill) => {
  g.fillStyle = fill;
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.fill();
};
const rect = (g, x, y, w, h, fill) => {
  g.fillStyle = fill;
  g.fillRect(x, y, w, h);
};
const shade = (c, k) => rgba(mixc(c, '#000000', k));
const tint = (c, k) => rgba(mixc(c, '#ffffff', k));
// a ship's boat seen from aft-inboard, hanging in its davits: hull, its gunwale, the cover, the two davits curving over
function boat(g, c, x, y, len, flip) {
  const w = 1.7, s = flip ? -1 : 1;
  // davits from the deck (y 0 at the rail's foot) curving out over the boat
  g.strokeStyle = '#3a3b3e';
  g.lineWidth = 0.14;
  for (const dx of [-len * 0.36, len * 0.36]) {
    g.beginPath();
    g.moveTo(x + dx - s * 0.6, 0);
    g.quadraticCurveTo(x + dx - s * 0.6, y - 2.0, x + dx + s * 0.1, y - 1.9);
    g.stroke();
  }
  poly(g, [[x - len / 2, y - 0.7], [x + len / 2, y - 0.7], [x + len / 2 - 0.5, y + 0.15], [x - len / 2 + 0.5, y + 0.15]], c.boat);
  rect(g, x - len / 2, y - 0.8, len, 0.14, c.cap);
  poly(g, [[x - len / 2 + 0.2, y - 0.8], [x, y - 1.15], [x + len / 2 - 0.2, y - 0.8]], '#c8c0a8');
  void w;
}

// The ports on the horizon: a skyline of each, x across (metres about its middle), its foot at 0, toward −y up
function skyline(g, port, rnd) {
  const bump = (x, c, w, h) => h * Math.exp(-(((x - c) / w) ** 2));
  if (port === 'suez') {
    // low desert hills, a white town, two minarets, palms, the mole
    poly(g, [[-900, 0], ...Array.from({ length: 37 }, (_, i) => { const x = -900 + i * 50; return [x, -8 - bump(x, -500, 260, 40) - bump(x, 300, 300, 26)]; }), [900, 0]], '#d8c29a');
    for (let i = 0; i < 46; i++) { const x = -380 + i * 17 + rnd() * 6, h = 6 + rnd() * 9; rect(g, x, -h, 12 + rnd() * 6, h, rnd() < 0.5 ? '#efe6d4' : '#e2d4b8'); }
    for (const x of [-140, 110]) { rect(g, x, -46, 4, 46, '#f2ead8'); poly(g, [[x - 1, -46], [x + 2, -54], [x + 5, -46]], '#f2ead8'); rect(g, x - 1.5, -38, 7, 2, '#e0d2b8'); }
    poly(g, [[-30, -16], [-10, -27], [10, -16]], '#e8dcc4');
    for (let i = 0; i < 9; i++) { const x = -420 + i * 95 + rnd() * 30; g.strokeStyle = '#6a5a3a'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 3, -12, x + 1, -22); g.stroke(); g.fillStyle = '#4e6a3a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + 1 + Math.cos(k) * 5, -22 + Math.sin(k) * 1.5, 7, 1.8, k * 0.5, 0, Math.PI * 2); g.fill(); } }
    rect(g, -600, -3, 520, 3, '#b8a888');
  } else if (port === 'bombay') {
    // the island's low hills, the town along the shore: domes, a clock tower, ships' masts
    poly(g, [[-1000, 0], ...Array.from({ length: 41 }, (_, i) => { const x = -1000 + i * 50; return [x, -6 - bump(x, -350, 220, 34) - bump(x, 420, 280, 46)]; }), [1000, 0]], '#8a8a7c');
    for (let i = 0; i < 70; i++) { const x = -560 + i * 16 + rnd() * 6, h = 6 + rnd() * 14; rect(g, x, -h, 11 + rnd() * 6, h, rnd() < 0.5 ? '#d8c8b0' : '#c4b49a'); }
    for (const x of [-220, 60, 260]) { rect(g, x, -22, 20, 22, '#e2d6c0'); g.fillStyle = '#e2d6c0'; g.beginPath(); g.arc(x + 10, -22, 10, Math.PI, 0); g.fill(); }
    rect(g, -40, -58, 9, 58, '#d4c4a6');
    poly(g, [[-42, -58], [-35.5, -70], [-29, -58]], '#a87a5a');
    g.strokeStyle = '#5a4e40';
    g.lineWidth = 0.8;
    for (let i = 0; i < 14; i++) { const x = -640 + i * 50 + rnd() * 20; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -28 - rnd() * 10); g.stroke(); }
  } else if (port === 'new_york') {
    // the city along the water: blocks, warehouses, spires, Trinity Church's tall one
    for (let i = 0; i < 90; i++) { const x = -800 + i * 18 + rnd() * 6, h = 10 + rnd() * 22; rect(g, x, -h, 14 + rnd() * 8, h, rnd() < 0.5 ? '#a89a8a' : '#8e8478'); }
    for (const [x, h] of [[-300, 86], [-60, 70], [180, 62], [420, 74]]) { rect(g, x, -h * 0.55, 10, h * 0.55, '#7a7068'); poly(g, [[x, -h * 0.55], [x + 5, -h], [x + 10, -h * 0.55]], '#6e645c'); }
    g.strokeStyle = '#4e4640';
    g.lineWidth = 0.8;
    for (let i = 0; i < 24; i++) { const x = -760 + i * 64 + rnd() * 20; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -34 - rnd() * 14); g.stroke(); }
  } else if (port === 'queenstown') {
    // green hills of Ireland round the harbour, the town climbing, the cathedral's spire
    poly(g, [[-1000, 0], ...Array.from({ length: 41 }, (_, i) => { const x = -1000 + i * 50; return [x, -10 - bump(x, -400, 300, 60) - bump(x, 200, 260, 80) - bump(x, 700, 240, 40)]; }), [1000, 0]], '#7f9a6c');
    poly(g, [[-1000, 0], ...Array.from({ length: 41 }, (_, i) => { const x = -1000 + i * 50; return [x, -6 - bump(x, -150, 380, 30) - bump(x, 520, 200, 20)]; }), [1000, 0]], '#6c8a5c');
    for (let i = 0; i < 40; i++) { const x = -300 + i * 14 + rnd() * 5, y = -bump(x, 120, 200, 40) * 0.8; rect(g, x, y - 7, 10, 7 + 4, rnd() < 0.5 ? '#e6e0d2' : '#cfc6b4'); }
    rect(g, 120, -64, 12, 30, '#8c8478');
    poly(g, [[119, -64], [126, -96], [133, -64]], '#7a7268');
  } else if (port === 'liverpool') {
    // docks: warehouses of brick, chimneys, cranes, a forest of masts
    for (let i = 0; i < 60; i++) { const x = -900 + i * 30 + rnd() * 6, h = 14 + rnd() * 16; rect(g, x, -h, 26, h, rnd() < 0.5 ? '#8a5040' : '#764438'); }
    for (let i = 0; i < 12; i++) { const x = -800 + i * 140 + rnd() * 40; rect(g, x, -60 - rnd() * 20, 4, 80, '#5a3a32'); }
    g.strokeStyle = '#3e3a36';
    g.lineWidth = 0.9;
    for (let i = 0; i < 40; i++) { const x = -860 + i * 44 + rnd() * 14; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -36 - rnd() * 18); g.stroke(); }
  }
}

// ── The film ──
const WHO = ['fogg', 'passepartout', 'aouda', 'fix', 'consul', 'sailor', 'speedy', 'stoker', 'policeman', 'policeman_2'];
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const OFF = id => ({ [`${id}_a`]: -2, [`${id}_d`]: -3, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 0,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_on`]: null, [`${id}_mood`]: null });
const NOBODY = () => Object.assign({}, ...WHO.map(OFF));
const loop = (motion, from = 0) => ({ motion, loop: true, from });
// someone standing at [a, d], turned `turn`, and whatever else
const at = (id, [a, d], turn, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_here`]: true, [`${id}_turn`]: turn,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const CAM = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0, camera_on: null };
// the parts all aboard and nothing burning
const WHOLE = () => Object.assign({ fire: 0, flare: 0, speedy_grief: 0, sails: 0 },
  ...PART_NAMES.map(n => ({ [n]: 1, [`drag_${n}`]: 0, [`locked_${n}`]: 0 })));
// the light and the ship at the film's moments
const SEA = (ship, port, more = {}) => ({ ship, port, night: 0, dawn: 0, fog: 0, smoke: 1, speed: port === 'none' || port === 'bombay' || port === 'queenstown' ? 0.8 : 0, porthole: 0, cell_close: 0, leaf: 0, ...WHOLE(), ...more });
// the burn's view: from the poop, high, the whole deck laid out (every part's point in the middle of a 4:3 frame)
const BURN_VIEW = { ...CAM, camera_z: -4.5, camera_h: 3.2, camera_look: 0.06 };
// where people stand
const RAIL = 4.75;
const SPOT = {
  // Suez, by the gangway's head
  pp_suez: [3.9, 8.2], fix_suez: [2.7, 9.0], consul: [4.3, 12.4], fix_whisper: [3.55, 12.15],
  // the night: she forward, he aft, both at the rail
  aouda_rail: [RAIL - 0.2, 10.3], fogg_rail: [RAIL - 0.15, 8.9],
  // the Pacific
  pp_rail: [RAIL - 0.1, 10.2], fix_from: [-1.5, 3.5], fix_pp: [3.75, 9.1],
  // the calendar: the sailor at the deckhouse, Passepartout by him, Fogg in his chair
  sailor_cal: [-2.0, 17.2], pp_cal: [0.9, 15.6],
  // the gangway's head (New York, Liverpool); on the bridge
  gang: [3.6, 9.8], gang_2: [2.6, 9.2], gang_3: [3.0, 8.4],
  bridge_speedy: [1.1, 18.9], bridge_fogg: [-0.9, 18.9],
  // the hatch: the stoker, Passepartout; the cabin's door
  stoker: [2.6, 15.6], pp_hatch: [0.2, 14.0], cabin_door: [-1.3, 7.2], speedy_deck: [-0.6, 9.4], sailor_by: [-1.6, 8.8],
  // Liverpool: the constables come up the gangway
  quay_up: [8.6, 9.6], pol_1: [4.2, 10.6], pol_2: [4.4, 8.7], fix_lv: [2.3, 10.4],
};
const TRAVEL = { garment: 'dress', colors: { garment: '#3c4a5a', top: '#3c4a5a', accent: '#c9b98f' } };

function film(scene) {
  const get = (k, or = 0) => { const v = scene.get(k); return v == null ? or : v; };
  const withIt = k => get(k, 1) > 0.5;
  // the people's looks from the game's keys: Fogg's hat out of doors; Aouda's dress from Hong Kong on; Passepartout in
  // the «Long Noses»' wings; Fix's bruise — as the cast gives them (kit.cast.wear, when it has them)
  const W = scene.kit.cast?.wear ?? {};
  const wear = {
    fogg: () => ({ hat: 'tophat' }),
    aouda: () => (get('aouda_dress') > 0.5 ? TRAVEL : null),
    passepartout: () => (get('pp_wings') > 0.5 && W.pp_wings ? W.pp_wings : null),
    fix: () => (get('fix_bruise') > 0.5 && W.fix_bruise ? W.fix_bruise : null),
  };
  const WEAR = () => Object.fromEntries(Object.entries(wear).map(([id, f]) => [`${id}_wear`, f()]));
  const P = (id, spot, turn, more) => ({ ...at(id, spot, turn, more), [`${id}_wear`]: wear[id] ? wear[id]() : null });

  // ── the shots ──
  const SUEZ = () => ({ ...SEA('mongolia', 'suez'), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'passepartout', camera_shot: 1.35, camera_frame: [0.62, 0.42],
    ...P('passepartout', SPOT.pp_suez, toward(SPOT.pp_suez, SPOT.fix_suez), { look: 'fix#head' }),
    ...P('fix', SPOT.fix_suez, toward(SPOT.fix_suez, SPOT.pp_suez), { look: 'passepartout#head' }),
    ...P('consul', SPOT.consul, 200, { do: loop('hands_behind'), look: [30, 400, 10] }) });
  const BOMBAY = () => ({ ...SEA('mongolia', 'bombay', { dawn: 1 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'fogg', camera_shot: 'medium', camera_frame: [0.36, 0.45],
    ...P('fogg', [RAIL - 0.2, 9.6], 215, { with: ['notebook'], look: 'fogg#book' }) });
  const NIGHT = () => ({ ...SEA('rangoon', 'none', { night: 1, speed: 0.6 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'night_two', camera_shot: 1.5, camera_frame: [0.55, 0.42],
    ...P('aouda', SPOT.aouda_rail, 80, { look: [60, 300, -4] }),
    ...P('fogg', SPOT.fogg_rail, 75, { with: ['plaid'], look: [40, 300, -4] }) });
  // (as rail_night leaves them: turned to each other)
  const NIGHT_TURNED = () => ({ ...NIGHT(), aouda_turn: 200, aouda_look: 'fogg#head', fogg_turn: 20, fogg_look: 'aouda#head' });
  const PACIFIC = () => ({ ...SEA('general_grant', 'none', { speed: 0.8 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'passepartout', camera_shot: 1.6, camera_frame: [0.6, 0.42],
    ...P('passepartout', SPOT.pp_rail, 90, { look: [80, 400, -5] }),
    ...P('fix', SPOT.fix_from, toward(SPOT.fix_from, SPOT.fix_pp)) });
  const MET = () => ({ ...PACIFIC(), fix_a: SPOT.fix_pp[0], fix_d: SPOT.fix_pp[1], fix_turn: toward(SPOT.fix_pp, SPOT.pp_rail), fix_look: 'passepartout#head',
    passepartout_turn: toward(SPOT.pp_rail, SPOT.fix_pp), passepartout_look: 'fix#head', camera_target: 'two_pacific', camera_shot: 1.25, camera_frame: [0.5, 0.42] });
  const CALENDAR = () => ({ ...SEA('general_grant', 'none', { speed: 0.8 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'calendar', camera_shot: 4.2, camera_frame: [0.42, 0.45],
    ...P('sailor', SPOT.sailor_cal, 160, { look: 'calendar#leaf' }),
    ...P('passepartout', SPOT.pp_cal, 300, { look: 'calendar#leaf' }),
    ...P('fogg', plan.chair, 30, { on: [plan.chair[0], plan.chair[1] + 0.05, 0.42], do: loop('read_book'), with: ['notebook'], look: 'fogg#book', wear: null }) });
  const NEW_YORK = () => {
    const v = { ...SEA('henrietta', 'new_york'), ...CAM, ...NOBODY(), ...WEAR(),
      camera_target: 'fogg', camera_shot: 1.7, camera_frame: [0.42, 0.42],
      ...P('fogg', SPOT.gang, 300, { look: 'speedy#head' }),
      ...P('speedy', SPOT.bridge_speedy, 190, { do: loop('arms_folded'), look: 'fogg#head' }) };
    if (withIt('with_aouda')) Object.assign(v, P('aouda', SPOT.gang_2, 320, { look: 'speedy#head' }));
    if (withIt('with_pp')) Object.assign(v, P('passepartout', SPOT.gang_3, 330, { look: 'speedy#head' }));
    if (withIt('with_fix')) Object.assign(v, P('fix', [4.3, 7.6], 330, { look: 'fogg#head' }));
    return v;
  };
  const MUTINY = () => ({ ...SEA('henrietta', 'none', { speed: 0.85 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'fogg', camera_shot: 1.9, camera_frame: [0.45, 0.4],
    ...P('fogg', SPOT.bridge_fogg, 10, { look: [0, 300, 3] }) });
  const COAL = () => ({ ...SEA('henrietta', 'none', { speed: 0.6, smoke: 0.2 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'stoker', camera_shot: 2.2, camera_frame: [0.55, 0.42],
    ...P('stoker', SPOT.stoker, 225, { look: 'fogg#head' }),
    ...P('fogg', [0.6, 12.4], 40, { look: 'stoker#head' }),
    ...(withIt('with_pp') ? P('passepartout', [-0.4, 13.6], 60, { look: 'stoker#head' }) : {}) });
  const BURN = () => {
    const pp = withIt('with_pp');
    return { ...SEA('henrietta', 'none', { speed: 0.6, smoke: 0.6, fire: 0.5 }), ...BURN_VIEW, ...NOBODY(), ...WEAR(),
      ...P('stoker', SPOT.stoker, 215, { do: loop('shovel'), look: 'hatch#fire' }),
      ...(pp ? P('passepartout', SPOT.pp_hatch, 60, { look: 'hatch#fire' }) : {}),
      ...P('fogg', pp ? SPOT.bridge_fogg : SPOT.pp_hatch, pp ? 180 : 60, pp ? { look: 'hatch#fire' } : { look: 'hatch#fire', wear: { hat: 'none' } }),
      ...P('speedy', SPOT.speedy_deck, 30, { look: 'hatch#fire' }) };
  };
  // the parts as the game left them (the burn's): kept — the cut sets only the light and the people
  const QUEENSTOWN = () => {
    const cabin = get('speedy_cabin', 1) > 0.5;
    return { ship: 'henrietta', port: 'queenstown', night: 0, dawn: 1, fog: 0, smoke: 0.5, speed: 0.5, fire: 0.3, porthole: 0, cell_close: 0,
      ...BURN_VIEW, camera_z: -4.5, camera_h: 2.2, camera_look: 0.02, ...NOBODY(), ...WEAR(),
      ...(cabin ? P('speedy', [plan.cabin.a, plan.cabin.d + 1.6], 20, { look: [60, 600, 10] }) : {}),
      ...P('fogg', [1.4, 9.6], 30, { look: [120, 900, 10] }) };
  };
  const SAILS = () => ({ ...SEA('henrietta', 'none', { speed: 0.3, smoke: 0, sails: 0 }), ...CAM, camera_z: -3, camera_h: 0.8, camera_look: -0.08, ...NOBODY(), ...WEAR(),
    ...P('speedy', SPOT.bridge_speedy, 200, { look: [0, 30, 20] }),
    ...P('fogg', SPOT.bridge_fogg, 160, { look: 'speedy#head' }) });
  const LIVERPOOL = () => {
    const v = { ...SEA('henrietta', 'liverpool', { fog: 1, smoke: 0.3 }), ...CAM, ...NOBODY(), ...WEAR(),
      camera_target: 'fogg', camera_shot: 2.6, camera_frame: [0.45, 0.42],
      ...P('fogg', [1.4, 7.2], 45, { look: [9, 30, 0] }),
      ...P('fix', [0.2, 6.6], 45, { look: 'fogg#head' }),
      ...P('policeman', SPOT.quay_up, 270), ...P('policeman_2', [9.4, 8.2], 270) };
    if (withIt('with_aouda')) Object.assign(v, P('aouda', [0.6, 5.6], 40, { look: [9, 30, 0] }));
    if (withIt('with_pp')) Object.assign(v, P('passepartout', [2.4, 6.0], 50, { look: [9, 30, 0] }));
    return v;
  };
  const CELL = () => ({ ...SEA('henrietta', 'liverpool', { fog: 1, speed: 0 }), ...CAM, camera_x: plan.cell[0], camera_z: plan.cell[1] - 0.6, camera_h: -0.25, ...NOBODY(),
    ...P('fogg', [plan.cell[0] - 0.2, plan.cell[1] + 4.7], 180, { on: [plan.cell[0] - 0.2, plan.cell[1] + 4.75, 0.46], do: loop('sit_calm'), wear: null, look: [plan.cell[0] + 1.6, plan.cell[1] + 2, 1.6] }),
    ...P('fix', [plan.cell[0] - 3.4, plan.cell[1] + 2.6], 90, { here: false }) });

  // ── the beats ──
  const B = {
    // ---- Suez, day: by the gangway's head Passepartout chats with Fix, who offers him a cigar; Fix goes over to the
    // consul at the head of the gangway and whispers to him; Passepartout looks at the town.
    suez: {
      from: SUEZ,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix'), consul = s.person('consul');
        await s.wait(0.6);
        fix.reach({ r: 'passepartout#hand_r' });
        await s.wait(0.4);
        pp.reach({ r: 'fix#hand_r' });
        await s.wait(1.1);
        fix.reach(null);
        pp.reach(null);
        s.tell('suez:chat');
        await s.wait(4.5);
        // Fix goes; Passepartout's eyes go to the town over the rail
        pp.look([300, 900, 30]);
        await s.wait(0.2);
        pp.turn(70);
        s.camera({ target: 'fix_consul', shot: 1.5, frame: [0.55, 0.42], glide: 2.2 });
        await fix.walk([SPOT.fix_whisper]);
        await fix.turn(toward(SPOT.fix_whisper, SPOT.consul));
        consul.look('fix#head');
        fix.look('consul#head');
        await fix.do('whisper');
        s.tell('suez:whisper');
        consul.look('passepartout#head');
        await s.wait(2.4);
      },
    },
    // ---- Bombay at dawn on the horizon: Fogg at the rail with his notebook; he looks up at the town, and back.
    bombay: {
      from: BOMBAY,
      run: async s => {
        const fogg = s.person('fogg');
        await s.wait(1.6);
        fogg.look([300, 900, 20]);
        await s.wait(1.8);
        fogg.look('fogg#book');
        s.tell('bombay:book');
        await s.wait(2.6);
      },
    },
    // ---- The «Rangoon» at night, the moon's path on the sea: Fogg and Aouda at the rail, a step apart; she turns to
    // him (her line), he to her; held under the choice.
    rail_night: {
      from: NIGHT,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        await s.wait(3.2);
        aouda.look('fogg#head');
        await s.wait(0.4);
        await aouda.turn(200);
        s.tell('rail_night:turns');
        await s.wait(0.8);
        fogg.look('aouda#head');
        await fogg.turn(20);
        await s.wait(2);
      },
    },
    // ---- He takes the plaid off his arm and lays it over her shoulders; her hand comes up to its edge.
    plaid: {
      after: 'rail_night',
      from: NIGHT_TURNED,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        s.camera({ target: 'aouda', shot: 1.2, frame: [0.55, 0.42], glide: 1.8 });
        fogg.reach({ r: 'aouda#shoulder_l', l: 'aouda#shoulder_r' });
        await s.wait(1.4);
        fogg.with(null);
        aouda.with(['plaid_shoulders']);
        await s.wait(0.5);
        fogg.reach(null);
        await s.wait(0.6);
        aouda.reach({ l: 'aouda#shoulder_r' });
        aouda.look('fogg#head');
        await s.wait(2.6);
      },
    },
    // ---- She asks for his notebook and writes a line in it, the pencil in her hand; he looks out at the sea.
    writes: {
      after: ['rail_night', 'plaid'],
      from: NIGHT_TURNED,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        s.camera({ target: 'aouda', shot: 1.15, frame: [0.55, 0.42], glide: 1.8 });
        const was = scene.get('aouda_with');
        fogg.with(['notebook']);
        fogg.reach({ r: 'aouda#hands' });
        await s.wait(1.2);
        fogg.with(null);
        fogg.reach(null);
        aouda.with([...(Array.isArray(was) ? was.filter(x => x !== 'notebook') : []), 'notebook']);
        aouda.look('aouda#book');
        fogg.look([60, 300, -4]);
        await fogg.turn(80);
        await aouda.do('write_note');
        s.tell('writes:done');
        aouda.look('fogg#head');
        await s.wait(2);
      },
    },
    // ---- The «General Grant» on the Pacific, sun: Passepartout at the rail (in his wings, if he wore them); Fix
    // comes up to him; they look at each other — under the choice.
    pacific: {
      from: PACIFIC,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        await s.wait(1.2);
        s.camera({ target: 'two_pacific', shot: 1.25, frame: [0.5, 0.42], glide: 3 });
        await fix.walk([SPOT.fix_pp]);
        await fix.turn(toward(SPOT.fix_pp, SPOT.pp_rail));
        fix.look('passepartout#head');
        await s.wait(0.6);
        pp.look('fix#head');
        await pp.turn(toward(SPOT.pp_rail, SPOT.fix_pp));
        s.tell('pacific:fix');
        await s.wait(2);
      },
    },
    // ---- Passepartout hits him; Fix sits down on the deck and sets his hat right.
    punch: {
      after: 'pacific',
      from: MET,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        pp.mood('angry');
        const hit = pp.do('punch');
        await s.wait(0.55);
        fix.mood('surprised');
        await fix.do('knocked_down');
        s.tell('punch:down');
        pp.mood(null);
        pp.look('fix#head');
        await hit;
        await s.wait(1.8);
      },
    },
    // ---- Passepartout, after a moment, holds out his hand; they shake.
    shake: {
      after: 'pacific',
      from: MET,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        await s.wait(1.4);
        pp.reach({ r: 'fix#hand_r' });
        await s.wait(0.8);
        fix.reach({ r: 'passepartout#hand_r' });
        fix.mood('smile');
        await s.wait(2.4);
        pp.reach(null);
        fix.reach(null);
        await s.wait(1);
      },
    },
    // ---- A sailor by the deckhouse turns the calendar's leaf: Wednesday again (the leaf read close); Passepartout
    // roars with laughter; Fogg in his deck chair with his notebook doesn't look up.
    calendar: {
      from: CALENDAR,
      run: async s => {
        const pp = s.person('passepartout'), sailor = s.person('sailor');
        await s.wait(0.8);
        sailor.reach({ r: 'calendar#leaf' });
        await s.wait(0.6);
        await s.move('leaf', 1, { over: 1.1, ease: 'inOut' });
        sailor.reach(null);
        s.tell('calendar:leaf');
        await s.wait(2.6);
        s.camera({ target: 'calendar_three', shot: 3.2, frame: [0.5, 0.45], glide: 2 });
        await s.wait(1.2);
        pp.mood('laugh');
        s.tell('calendar:laugh');
        await pp.do('laugh');
        await s.wait(1.6);
      },
    },
    // ---- New York, the «Henrietta» at the quay: Fogg (and whoever is with him) at the gangway's head; the «China»'s
    // smoke far off on the horizon; Speedy on his bridge — under the lines.
    new_york: {
      from: () => ({ ...NEW_YORK(), camera_target: 'china#smoke', camera_shot: 'wide', camera_frame: [0.5, 0.4] }),
      run: async s => {
        const fogg = s.person('fogg');
        fogg.look('china#smoke');
        await s.wait(1.4);
        s.tell('new_york:smoke');
        await s.wait(3.2);
        s.camera({ target: 'fogg', shot: 1.7, frame: [0.42, 0.42], glide: 2.4 });
        await s.wait(1.2);
        fogg.look('speedy#head');
        await fogg.turn(300);
        s.camera({ target: 'speedy', shot: 2.2, frame: [0.5, 0.36], glide: 2 });
        s.tell('new_york:speedy');
        await s.wait(2.4);
      },
    },
    // ---- At sea under steam: Fogg on the bridge; close — Speedy in his cabin's porthole, his red beard, roaring.
    mutiny: {
      from: MUTINY,
      run: async s => {
        await s.wait(2.4);
        await s.move('porthole', 1, { over: 0.5 });
        s.tell('mutiny:porthole');
        await s.wait(3.2);
      },
    },
    // ---- The smoke thins; the stoker at the hatch spreads his hands; Speedy is brought out on deck — under the choice.
    coal: {
      from: () => ({ ...COAL(), smoke: 1 }),
      run: async s => {
        const stoker = s.person('stoker'), fogg = s.person('fogg');
        s.move('smoke', 0.2, { over: 3 });
        await s.wait(1.2);
        await stoker.do('spread_hands');
        s.tell('coal:stoker');
        await s.wait(0.6);
        const speedy = s.person('speedy'), sailor = s.person('sailor');
        speedy.here(true);
        sailor.here(true);
        s.camera({ target: 'coal_three', shot: 2.4, frame: [0.48, 0.42], glide: 2.4 });
        speedy.mood('angry');
        await s.all(speedy.walk([SPOT.speedy_deck, [0.0, 11.0]]), sailor.walk([SPOT.sailor_by, [-0.9, 10.2]]));
        await speedy.turn(toward([0.0, 11.0], [0.6, 12.4]));
        speedy.look('fogg#head');
        fogg.look('speedy#head');
        await fogg.turn(toward([0.6, 12.4], [0.0, 11.0]));
        s.tell('coal:speedy');
        await s.wait(2);
      },
    },
    // ---- «The boilers»: the deck from the poop; the game drags the parts to the hatch (its keys); the beat only cuts here.
    burn: { from: BURN, run: async s => { await s.wait(1); } },
    // ---- Dawn, from the stern: the bare iron hull, Queenstown on the horizon; Speedy saluting from his cabin's roof
    // if it is left him.
    queenstown: {
      from: QUEENSTOWN,
      run: async s => {
        await s.wait(2.4);
        if (get('speedy_cabin', 1) > 0.5) {
          s.camera({ target: 'speedy', shot: 3, frame: [0.4, 0.42], glide: 2.6 });
          await s.wait(1.6);
          await s.person('speedy').do('salute');
        }
        await s.wait(1.6);
      },
    },
    // ---- The «Henrietta» under all her sails, slow; Speedy roaring with laughter on the bridge by Fogg.
    sails_only: {
      from: SAILS,
      run: async s => {
        await s.move('sails', 1, { over: 5, ease: 'inOut' });
        s.camera({ target: 'bridge_two', shot: 2.3, frame: [0.5, 0.4], glide: 2.6 });
        await s.wait(2.4);
        const speedy = s.person('speedy');
        speedy.mood('laugh');
        s.tell('sails_only:laugh');
        await speedy.do('laugh');
        await s.wait(1.4);
      },
    },
    // ---- Liverpool, 11:40, fog: the constables come up the gangway; Fix steps forward, his hand on Fogg's shoulder.
    liverpool: {
      from: LIVERPOOL,
      run: async s => {
        const fogg = s.person('fogg'), fix = s.person('fix'), p1 = s.person('policeman'), p2 = s.person('policeman_2');
        await s.wait(0.6);
        await s.all(p1.walk([[6.4, 9.8], SPOT.pol_1]), (async () => { await s.wait(0.9); await p2.walk([[6.4, 8.6], SPOT.pol_2]); })());
        p1.turn(toward(SPOT.pol_1, [1.4, 7.2]));
        p2.turn(toward(SPOT.pol_2, [1.4, 7.2]));
        p1.look('fogg#head');
        p2.look('fogg#head');
        fogg.look('policeman#head');
        await fix.walk([[1.0, 7.9]]);
        await fix.turn(toward([1.0, 7.9], [1.4, 7.2]) - 30);
        fix.reach({ l: 'fogg#shoulder_l' });
        fogg.look('fix#head');
        s.camera({ target: 'fix', shot: 1.5, frame: [0.5, 0.42], glide: 1.6 });
        s.tell('liverpool:hand');
        await s.wait(2.6);
      },
    },
    // ---- The cell, close: the bench, Fogg's watch open on it, his hands on his knees; the bars' shadow creeps over the
    // floor as the game moves `cell_time`.
    cell: {
      from: () => ({ ...CELL(), cell_close: 1 }),
      run: async s => { await s.wait(1); },
    },
    // ---- Fix bursts into the cell, out of breath (then, if the game has set `release`, what follows).
    release: {
      from: CELL,
      run: async s => {
        const fix = s.person('fix'), fogg = s.person('fogg');
        await s.move('door', 1, { over: 0.5, ease: 'out' });
        fix.here(true);
        fix.mood('afraid');
        await fix.walk([[plan.cell[0] - 1.0, plan.cell[1] + 3.3]], { gait: 'run' });
        await fix.turn(toward([plan.cell[0] - 1.0, plan.cell[1] + 3.3], [plan.cell[0] - 0.2, plan.cell[1] + 4.75]));
        fix.look('fogg#head');
        fogg.look('fix#head');
        s.tell('release:in');
        await s.wait(2.2);
        const how = scene.get('release');
        if (how === 'down' || how === 'hand') await B[how === 'down' ? 'fix_down' : 'fix_hand'].run(s);
      },
    },
    // ---- Fogg rises and strikes him; Fix goes down.
    fix_down: {
      after: 'release',
      from: () => ({ ...CELL(), door: 1, ...P('fix', [plan.cell[0] - 1.0, plan.cell[1] + 3.3], 60, { look: 'fogg#head' }) }),
      run: async s => {
        const fix = s.person('fix'), fogg = s.person('fogg');
        await fogg.on(null);
        await fogg.do('rise_chair');
        const hit = fogg.do('punch');
        await s.wait(0.55);
        await fix.do('knocked_down');
        await hit;
        await s.wait(1.6);
      },
    },
    // ---- Fogg rises and holds out his hand; Fix takes it.
    fix_hand: {
      after: 'release',
      from: () => ({ ...CELL(), door: 1, ...P('fix', [plan.cell[0] - 1.0, plan.cell[1] + 3.3], 60, { look: 'fogg#head' }) }),
      run: async s => {
        const fix = s.person('fix'), fogg = s.person('fogg');
        await fogg.on(null);
        await fogg.do('rise_chair');
        fogg.reach({ r: 'fix#hand_r' });
        await s.wait(0.9);
        fix.reach({ r: 'fogg#hand_r' });
        fix.mood('sad');
        await s.wait(2.6);
      },
    },
  };
  return B;
}
const SHOWCASE = ['suez', 'bombay', 'rail_night', 'plaid', 'writes', 'pacific', 'punch', 'calendar', 'new_york', 'mutiny', 'coal', 'burn_show', 'queenstown', 'sails_only', 'liverpool', 'cell_show', 'release'];

return {
  plan, SHIPS, PORTS, shipOf, portOf, quayed, COLOURS, colours, PARTS, PART_NAMES, partAt, fallOf, partLook, partAnimate,
  poly, rect, shade, tint, boat, skyline, film, SHOWCASE, SPOT, toward, clamp01, mixc, css, rgba, glow, BURN_VIEW,
};
