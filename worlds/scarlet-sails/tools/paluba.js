// «The Deck» — the scene's generator: `node tools/paluba.js` (from the world's root) writes scenes/paluba/scene.json — the
// whole spec, laid out here — and the files that repeat or are the world's: each square sail's two halves (their
// painting and animate: a line of the scene's lib), every sail's shader — the world's cloth (tools/korabl-cloth.wgsl,
// its uniforms: korabli.clothUniforms) —, the sky's shader and uniforms (tools/nebo-sky.wgsl, nebo.UNIFORMS).
// Everything else of the scene is written by hand beside it (lib.js, script.js, showcase.js, elements/*, notes.md).
// Run again whenever this, the cloth shader or the sky's shader changes.
const fs = require('fs'), path = require('path');
const { load, writeElement, wgsl } = require('./lib');
const K = load('korabli'), N = load('nebo');
const DIR = path.join(__dirname, '..', 'scenes', 'paluba'), SRC = path.join(__dirname, 'paluba');
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const cloth = (id, head, foot, rise, seed) => { writeElement('paluba', id, 'wgsl', wgsl('korabl-cloth')); return K.clothUniforms([0, head, 0, foot], rise, seed); };

// ── her plan (as lib.js has it) ──
const KEEL = -2.4, WAIST = -1.4, SEA = -3.8, KAPERNA = 6000, LISSE = -30000, STEAMER_DECK = 3;
const DECKS = ['main_deck', 'poop_deck'];
const shadow = (more = {}) => ({ onto: DECKS, strength: 0.5, soft: 0.2, ...more });
const on = (id, name, across, distance, elevation, more) => ({ id, name, on: 'ship', across, distance, elevation, ...more });

// ── the square sails (lib.js SQUARE: "Secret"'s): [name, the element's name, the mast's distance, the yard hoisted and the
// foot over the main deck, half its width at the foot, rise, seed, how far down its box goes] — each two halves
// hinged at the mast, hung at the yard hoisted (a topgallant's by its key: it goes up with the topsail's yard) ──
const SAILS = [
  ['fore_course', 'Fore course', 23.45, 10.4, 3.9, 7.2, 0, 1, 7.1], ['fore_top', 'Fore topsail', 23.45, 17, 10.9, 6.4, 1, 2, 6.7], ['fore_tg', 'Fore topgallant', 23.45, 21.8, 17.4, 5.1, 1, 3, 5],
  ['main_course', 'Main course', 14.45, 11.4, 3.9, 7.8, 0, 4, 8.1], ['main_top', 'Main topsail', 14.45, 18.6, 11.9, 7.0, 1, 5, 7.3], ['main_tg', 'Main topgallant', 14.45, 23.9, 19, 5.6, 1, 6, 5.5],
];
const sails = [];
for (const [name, label, distance, high, foot, w1, rise, seed, down] of SAILS) {
  for (const side of [-1, 1]) {
    const id = `${name}_${side < 0 ? 'l' : 'r'}`, w = w1 + 0.9, tg = name.endsWith('_tg');
    sails.push(on(id, `${label}, ${side < 0 ? 'left' : 'right'} half`, KEEL, distance, +(high + WAIST).toFixed(2), {
      facing: 180, height: down, box: side < 0 ? [-w, -0.5, 0.7, down] : [-0.7, -0.5, w, down],
      place: { facing: side < 0 ? 'belly_l' : 'belly_r', tilt: 'belly_tilt', ...(tg ? { elevation: `${name}_e` } : {}) },
      shadow: shadow({ light: 'sun', soft: 0.4 }), translucent: 0.55,
      uniforms: cloth(id, 0, +(high - foot).toFixed(2), rise, seed),
    }));
    const half = side < 0 ? 'port' : 'starboard';
    writeElement('paluba', id, 'js', `// The ${name.replace('_', ' ')}'s ${half} half, painted once, fully set (\`e.lib.squareHalf\`); the world's cloth shader sets it\ne.lib.squareHalf(g, e, "${name}", ${side});`);
    writeElement('paluba', id, 'animate.js', `// how far it is set, its colour, the wind on it (\`e.lib.sailMotion\`)\ne.lib.sailMotion(e, "${name}");`);
  }
}
// "Anselm"'s gaff sails (lib.js GAFF: boom, peak), "Secret"'s spanker brailed up (lib.js SPANKER)
const gaff = (id, boom, peak, seed) => ({ ...cloth(id, -peak, -boom, 1, seed) });

// ── the people: [id, name, the cast's character, their place's keys, where they stand as the scene opens, facing] ──
const PEOPLE = [
  ['grey', 'Gray', 'grey', 'gr', [KEEL, 2.28, 0], 0], ['assol', 'Assol', 'assol', 'as', [1.32, 5.1, 0], 90], ['gop', 'Gop', 'gop', 'go', [-3.7, 13, WAIST], 200],
  ['panten', 'Panten', 'panten', 'pa', [-4.4, -0.6, 0], 0], ['letika', 'Letika', 'letika', 'le', [0.2, 5.2, 0], 20],
  ['sailor', 'Sailor', 'sailor', 'sa', [-0.98, 4.05, 0], 97], ['crew2', 'Sailor', 'sailor', 'cr', [-0.7, 3.27, 0], 42],
  ['sailor3', 'Sailor', 'sailor', 's3', [-3.4, 9.2, WAIST], 180], ['sailor4', 'Sailor', 'sailor', 's4', [-1.4, 9.2, WAIST], 180],
  ['zimmer', 'Zimmer', 'zimmer', 'zi', [-1.2, 13.2, WAIST], 180], ['musician1', 'Violinist', 'musician', 'm1', [-3.4, 26.5, WAIST], 180],
  ['musician2', 'Cellist', 'cellist', 'm2', [-1.4, 26.5, WAIST], 180],
];
const people = PEOPLE.map(([id, name, who, k, [a, d, e], turn]) => on(id, name, a, d, e, {
  person: { cast: 'cast', who, turn }, place: { across: `${k}_a`, distance: `${k}_d`, elevation: `${k}_e` }, shadow: { onto: DECKS, soft: 0.2 },
}));
// Longren, a sailor of the mail steamer: on her deck (lib.js LONGREN), by her stern, at her port rail
const LONGREN = [19, 0.45, STEAMER_DECK];
people.push({ id: 'longren', name: 'Longren', on: 'steamer', across: LONGREN[0], distance: LONGREN[1], elevation: LONGREN[2],
  person: { cast: 'cast', who: 'longren', turn: 135 }, place: { across: 'lo_a', distance: 'lo_d', elevation: 'lo_e' }, shadow: { onto: ['steamer_deck'], soft: 0.2 } });

// the silk's stacks (lib.js STACKS)
const STACKS = [[-5.0, 11.6], [-0.2, 13.4], [-4.7, 15.2], [-1.0, 16.4], [-2.8, 12.4]];

const objects = [
  { id: 'sky', name: 'Sky', sky: true, uniforms: { ...N.UNIFORMS } },
  { id: 'sea', name: 'Sea', plane: true, across: 0, distance: -15000, elevation: SEA, width: 40000, depth: 60000,
    reflect: { strength: 0.75, fade: 0, blur: 0.012, rough: 0.5, ripple: 0.4 }, uniforms: { storm: 0 } },
  { id: 'kaperna', name: 'Kaperna', across: 0, distance: KAPERNA, elevation: SEA, height: 60, box: [-620, -70, 520, 2] },
  { id: 'steamer', name: 'Mail steamer', across: 15000, distance: 0, elevation: SEA, facing: 270, height: 22, box: [-26, -23, 26, 1],
    place: { across: 'steamer_x', distance: 'steamer_d' } },
  // her deck behind her painted side (3 m over the water, her bulwark a metre over it): Longren stands on it, the film's
  // camera rides her there
  { id: 'steamer_deck', name: 'Steamer\'s deck', plane: true, on: 'steamer', across: 0, distance: 3, elevation: STEAMER_DECK, width: 44, depth: 6, lit: true },
  { id: 'smoke', name: 'Steamer\'s smoke', particles: { ...K.SMOKE, at: 'steamer#funnel', amount: 'steamer_smoke' } },
  // Liss: the quay alongside to starboard where she lies in port, the town behind it and across the basin
  { id: 'harbour', name: 'Liss quay', unseen: true, across: 3.35, distance: LISSE + 1 },
  { id: 'quay', name: 'Quay', on: 'harbour', distance: 9, elevation: -5, facing: 270, height: 4.6, box: [-70, -4.6, 70, 0] },
  { id: 'quay_top', name: 'Quay paving', plane: true, on: 'harbour', across: 16, distance: 9, elevation: -1.2, width: 32, depth: 140, lit: true },
  { id: 'lisse', name: 'Liss warehouses', on: 'harbour', across: 30, distance: 25, elevation: -1.2, facing: 270, height: 20, box: [-100, -20, 100, 0] },
  { id: 'lisse_town', name: 'Liss', on: 'harbour', across: 60, distance: 25, elevation: -1.2, facing: 270, height: 22, box: [-100, -22, 100, 0] },
  { id: 'lisse_upper', name: 'Liss beyond the harbour', on: 'harbour', across: -70, distance: 260, elevation: 2, facing: 180, height: 30, box: [-100, -31, 100, 0] },
  { id: 'quay_lamps', name: 'Quay lamps', on: 'harbour', across: 1.2, distance: 9, elevation: -1.2, facing: 270, height: 3.6, box: [-70, -3.8, 70, 0.02], glows: true },
  { id: 'lisse_windows', name: 'Warehouse windows', on: 'harbour', across: 29.9, distance: 25, elevation: -1.2, facing: 270, height: 20, box: [-100, -20, 100, 0], glows: true },
  { id: 'lisse_town_windows', name: 'Liss windows', on: 'harbour', across: 59.9, distance: 25, elevation: -1.2, facing: 270, height: 22, box: [-100, -22, 100, 0], glows: true },
  { id: 'lisse_upper_windows', name: 'Windows of Liss beyond the harbour', on: 'harbour', across: -70, distance: 259.9, elevation: 2, facing: 180, height: 30, box: [-100, -31, 100, 0], glows: true },
  // the ship: where she is and how she is turned (course), her roll about the keel (hull), her decks' frame (ship:
  // back at the viewer's place on the poop, 2.4 m to starboard of the keel, the poop deck's height)
  { id: 'course', name: 'Ship at sea', unseen: true, across: 0, distance: 0, facing: 180, place: { across: 'ship_x', distance: 'ship_d', facing: 'ship_f' } },
  { id: 'hull', name: 'Keel', unseen: true, on: 'course', across: KEEL, elevation: -2.5, facing: 90, place: { tilt: 'heel' } },
  { id: 'ship', name: 'Ship', unseen: true, on: 'hull', distance: KEEL, elevation: 2.5, facing: 270 },
  { id: 'poop_deck', name: 'Poop', plane: true, on: 'ship', across: KEEL, distance: 1.5, elevation: 0, width: 8.2, depth: 9, lit: true, reflect: { strength: 0.14, fade: 3, blur: 0.12 } },
  { id: 'main_deck', name: 'Waist', plane: true, on: 'ship', across: KEEL, distance: 19, elevation: WAIST, width: 8.6, depth: 26, lit: true, reflect: { strength: 0.14, fade: 3, blur: 0.12 } },
  { id: 'hatch_top', name: 'Hatch', plane: true, on: 'ship', across: KEEL, distance: 10.5, elevation: WAIST + 0.45, width: 2.6, depth: 3 },
  on('hatch', 'Hatch coaming', KEEL, 9, WAIST, { facing: 180, height: 0.45, box: [-1.35, -0.47, 1.35, 0.01], shadow: shadow() }),
  on('bulwark_starboard', 'Starboard bulwark', KEEL + 4.25, 7.5, WAIST, { facing: 270, height: 2.4, box: [-10.6, -2.5, 10.6, 0.01], shadow: shadow() }),
  on('bulwark_port', 'Port bulwark', KEEL - 4.25, 7.5, WAIST, { facing: 90, height: 2.4, box: [-10.6, -2.5, 10.6, 0.01], shadow: shadow() }),
  on('bow_starboard', 'Starboard bulwark at the bow', KEEL + 2.3, 25, WAIST, { facing: 255, height: 1.7, box: [-7.4, -1.8, 7.4, 0.01] }),
  // her starboard side from outside, the bulwarks' other face down to the water (seen from the steamer, from her boat)
  on('side_starboard', 'Starboard side, outside', KEEL + 4.25, 7.5, SEA, { facing: 270, height: 3.8, box: [-10.6, -3.85, 10.6, 0.01] }),
  on('side_bow_starboard', 'Starboard side at the bow, outside', KEEL + 2.3, 25, SEA, { facing: 255, height: 2.4, box: [-7.4, -2.45, 7.4, 0.01] }),
  // her boat at the starboard side by the poop's break: hung under the rail, lowered to the water (skiff_down)
  on('skiff', 'Skiff', KEEL + 5.4, 8, SEA, { facing: 270, height: 3.7, box: [-2.6, -3.75, 2.6, 0.25] }),
  on('bow_port', 'Port bulwark at the bow', KEEL - 2.3, 25, WAIST, { facing: 105, height: 1.7, box: [-7.4, -1.8, 7.4, 0.01] }),
  on('taffrail', 'Taffrail', KEEL, -3, 0, { facing: 0, height: 1.05, box: [-4.2, -1.1, 4.2, 0.01] }),
  on('break_rail', 'Poop rail', KEEL, 6, 0, { facing: 180, height: 1.05, box: [-4.2, -1.1, 4.2, 0.01], shadow: shadow({ strength: 0.45 }) }),
  on('wheel', 'Wheel', KEEL, 2.6, 0, { facing: 180, height: 1.95, box: [-0.85, -2, 0.85, 0.01], shadow: shadow({ soft: 0.15 }) }),
  on('mizzen', 'Mizzenmast', KEEL, 5.2, 0, { facing: 180, height: 19, box: [-3.2, -19.2, 3.2, 0.01], shadow: shadow({ strength: 0.45 }) }),
  on('spanker', 'Spanker', KEEL, 5.2, 0, { facing: 110, height: 14.5, box: [-6.3, -14.8, 0.8, -2.7], shadow: shadow({ strength: 0.4, soft: 0.3 }), translucent: 0.45, uniforms: cloth('spanker', -14.3, -3.2, 0, 9) }),
  on('spanker_gaff', 'Spanker gaff', KEEL, 5.2, 0, { facing: 110, height: 14.5, box: [-6.3, -14.6, 0.4, -12.3], inFront: ['spanker'] }),
  on('mainmast', 'Mainmast', KEEL, 14, WAIST, { facing: 180, height: 27, box: [-8.4, -27.3, 8.4, 0.01], shadow: shadow({ strength: 0.45, soft: 0.3 }) }),
  on('shrouds', 'Shrouds', KEEL, 14.4, WAIST, { facing: 180, height: 18, box: [-4.5, -18.2, 4.5, 0.01] }),
  on('mainsail', 'Schooner\'s mainsail', KEEL, 14, WAIST, { facing: 125, height: 20, box: [-10.6, -20, 0.8, -2.4], shadow: shadow({ strength: 0.4, soft: 0.3 }), translucent: 0.45, uniforms: gaff('mainsail', 3.2, 19, 12) }),
  on('mainsail_spars', 'Main boom and gaff', KEEL, 14, WAIST, { facing: 125, height: 20, box: [-10.6, -20, 0.6, -2.8], inFront: ['mainsail'] }),
  on('foremast', 'Foremast', KEEL, 23, WAIST, { facing: 180, height: 24, box: [-7.8, -24.3, 7.8, 0.01], shadow: shadow({ strength: 0.45, soft: 0.3 }) }),
  on('foresail', 'Schooner\'s foresail', KEEL, 23, WAIST, { facing: 125, height: 15.2, box: [-8.6, -15.2, 0.8, -1.4], translucent: 0.45, uniforms: gaff('foresail', 2.2, 14.2, 13) }),
  on('foresail_spars', 'Fore boom and gaff', KEEL, 23, WAIST, { facing: 125, height: 15.2, box: [-8.6, -15.2, 0.6, -1.8], inFront: ['foresail'] }),
  ...sails,
  on('lantern_port', 'Lantern to port', KEEL - 3.95, 6, 1.05, { height: 0.36, box: [-0.14, -0.4, 0.14, 0.02], glows: true }),
  on('lantern_starboard', 'Lantern to starboard', KEEL + 3.95, 6, 1.05, { height: 0.36, box: [-0.14, -0.4, 0.14, 0.02], glows: true }),
  on('lantern_main', 'Lantern on the mainmast', KEEL, 13.75, 1.0, { height: 0.36, box: [-0.14, -0.4, 0.14, 0.02], glows: true }),
  { id: 'silk_run', name: 'Silk rolled out on the deck', plane: true, on: 'ship', across: KEEL, distance: 10.4, elevation: WAIST + 0.015, width: 5, depth: 5.5, lit: true },
  ...STACKS.map(([a, d], i) => on(i ? `silk_${i}` : 'silk', i ? `Scarlet silk, bolts ${i + 1}` : 'Scarlet silk', a, d, WAIST, { height: 0.8, box: [-0.9, -1.7, 0.9, 0.05] })),
  on('cask', 'The Grays\' cask', -0.09, 3.94, 0, { facing: 250, height: 0.9, box: [-0.5, -1.05, 0.5, 0.02], shadow: shadow({ soft: 0.15 }) }),
  ...people,
  // what the operator frames when two stand together: at the starboard rail of the poop; by the «Anselm»'s mainmast
  on('by_rail', 'By the starboard rail', 1.32, 4.45, 0, { unseen: true, height: 1.76 }),
  on('by_mast', 'By the mainmast', -2.95, 13.3, WAIST, { unseen: true, height: 1.76 }),
  // where the operator stands off her decks (the film's camera_on: its start is there, it comes from there toward its
  // target; turned as what carries them): over the sea off the poop's starboard rail, before the two at it and a little
  // ahead of them, chest high; low over the water off her starboard side, abaft her boat; on the steamer's deck, inboard
  // of Longren and before him — the «Secret» coming up beyond him
  on('cam_rail', 'Camera over the side by the poop', 4.33, 5.54, -0.45, { unseen: true, facing: 180, height: 1.7 }),
  on('cam_boat', 'Camera on the water by the starboard side', 10.25, 4.62, SEA + 0.3, { unseen: true, facing: 180, height: 1.7 }),
  { id: 'cam_steamer', name: 'Camera on the steamer\'s deck', on: 'steamer', across: 16.05, distance: 0.97, elevation: STEAMER_DECK, unseen: true, facing: 180, height: 1.7 },
  // the hands on the shrouds, close (the world's closeups: its frame `ropes`) — an insert over the whole frame
  { id: 'ropes', name: 'Hands on the shrouds', insert: 'ropes' },
];

// ── the state ──
const smooth = (range, means) => ({ range, smooth: true, means });
const own = means => ({ type: 'number', means: `internal: ${means}` });
const state = {
  beat: null, hour: 0.27, ship: 'secret', storm: 0, roll: 0, sails: 0, sails_set: 1, luff: 0, helm: 0, heading: 0, shore: 0, port: 0,
  lanterns: 0, silk: 0, cask: 0, steamer: 0, skiff_down: 0, ropes: 0, climb: 0, hand_l: 1, hand_r: 1, slip: 0,
  leg: null, sun: 0.26, wine: 0, ring: 'none', ring_kind: 'own',
  day: 0, dawn: 1, dusk: 0, night: 0, sun_light: 0.4, moon_light: 0, harbour_lit: 0, heel: 0,
  ship_x: 0, ship_d: 0, ship_f: 180, ship_at: '0:0', steamer_x: 15000, steamer_d: 0, steamer_smoke: 0, steamer_at: 0, belly_l: 166, belly_r: 194, belly_tilt: -12, fore_tg_e: 20.4, main_tg_e: 22.5,
};
const states = {
  beat: { type: 'string', means: 'the film\'s beat (the beats module): anselm, shrouds, top, letter, gop_bye, secret, sew, rail, raise, helm, arrive, steamer, night_end; null — nothing plays' },
  hour: smooth([0, 1], 'the hour, round the clock, as in the whole world: 0 midnight, 0.25 dawn, 0.5 noon, 0.75 sunset; the ship sails west, to Kaperna: the dawn astern, the sunset ahead'),
  ship: { values: ['secret', 'anselm'], means: 'whose deck: secret — the white galliot Secret (three masts, square sails on the fore- and mainmast, the spanker furled), anselm — the dark, worn schooner Anselm (two masts, patched fore-and-aft sails, a topsail on the foremast); changed by a cut' },
  storm: smooth([0, 1], 'foul weather: 0 calm, 1 storm — the sky clouded, the light grey, the rolling stronger, whitecaps on the sea, the wind tearing at the sails'),
  roll: smooth([-1, 1], 'heel: −1 to port, 0 even, 1 to starboard (up to 12°); the rolling goes on top'),
  sails: smooth([0, 1], 'the Secret\'s sails: 0 white, 1 scarlet'),
  sails_set: smooth([0, 1], 'the sails: 0 furled (rolled up on the yards, the upper yards lowered), 1 set and full; they go up one after another — the courses, the topsails, the topgallants (the Anselm\'s — mainsail, foresail, topsail); with them the ship gets under way: up to 4 m/s'),
  luff: smooth([0, 1], 'the sails luff: 0 full of wind, 1 slack and flapping (and the way falls off)'),
  helm: smooth([-1, 1], 'the wheel: −1 hard over to the left, 1 to the right (three quarters of a turn)'),
  heading: smooth([-1, 1], 'where the bow points: 0 — west, straight at Kaperna, −1 25° to the left, 1 25° to the right; the ship turns and sails where it points'),
  shore: smooth([-1, 1], 'the ship\'s place on the way to Kaperna (puts her there; from there she goes on under her own way): 0 — 6 km off (a hill on the horizon), 1 — 600 m off (the houses, Longren\'s house at the top, the cape with the lighthouse); below 0 — further out at sea (−1: 15 km, no land in sight)'),
  port: { values: [0, 1], means: 'the port of Liss: 1 — the ship lies at the quay (the quay to starboard, the warehouses and the town beyond it), 0 — at sea (where — shore)' },
  lanterns: smooth([0, 1], 'the lanterns: by the ladder from the poop on both sides and on the mainmast'),
  silk: smooth([0, 1], 'scarlet silk in the waist by the lanterns: 0 none, 1 heaps and lengths over the whole deck (they grow one by one)'),
  cask: smooth([0, 1], 'the Grays\' cask of wine with mugs amid the poop: 0 none, 1 stands there'),
  steamer: smooth([0, 1], 'the mail steamer: 0 — none; a greater value puts her ahead to starboard of the ship (towards 0 — 420 m, 1 — 70 m ahead and 24 m to starboard), then both go under their own way: the Secret under sail overtakes her'),
  skiff_down: smooth([0, 1], 'the skiff by the starboard side: 0 — hanging under the rail, 1 — lowered onto the water'),
  ropes: { range: [0, 1], means: 'a close-up of the ship\'s boy\'s hands on the shrouds (an insert, the closeups module\'s shot ropes): 1 — open; on it the points ropes#left, ropes#right' },
  climb: smooth([0, 1], 'the ropes insert: how high the boy has climbed — the ratlines go down (0 — by the deck, 1 — by the crosstrees); moved by the game'),
  hand_l: { values: [0, 1], means: 'the ropes insert: the left hand — 1 closed on the rope, 0 raised and open; moved by the game' },
  hand_r: { values: [0, 1], means: 'the ropes insert: the right hand — 1 closed on the rope, 0 raised and open; moved by the game' },
  slip: smooth([0, 1], 'the ropes insert: a slip — the hands slide down the rope (an impulse: 1 and back to 0); moved by the game'),
  leg: { range: [0, 1], means: 'the play\'s key: the stage of the way to Kaperna at which the scene is opened with the beat helm (puts the ship as shore does); none (null) — helm comes after raise, from where the ship is' },
  sun: { range: [0.26, 0.36], means: 'the play\'s key: the morning\'s hour in the beats raise, helm, arrive (as hour)' },
  wine: { values: [0, 1], means: 'the play\'s key: in the beat night_end 1 — the Grays\' cask and two sailors by it, 0 — no cask, four sailors sit on the hatch and sing' },
  ring: { values: ['none', 'finger', 'cord'], means: 'the play\'s key: Assol\'s ring on the deck (the beats steamer, night_end) — none, on her finger (a part of the cast by ring_kind), on a cord over the dress (the part ring_cord); none by default' },
  ring_kind: { values: ['mother', 'own'], means: 'the play\'s key: which ring — mother — his mother\'s (the part ring), own — his old one (the part ring_old); own by default' },
  day: smooth([0, 1], 'internal: the weight of daylight (nebo.follow by hour)'),
  dawn: smooth([0, 1], 'internal: the weight of dawn (nebo.follow by hour)'),
  dusk: smooth([0, 1], 'internal: the weight of sunset (nebo.follow by hour)'),
  night: smooth([0, 1], 'internal: the weight of night (nebo.follow by hour)'),
  sun_light: smooth([0, 1], 'internal: how much the sun shines (nebo.follow by hour)'),
  moon_light: smooth([0, 1], 'internal: how much the moon shines (nebo.follow by hour)'),
  harbour_lit: smooth([0, 1], 'internal: how brightly the Liss quay lamps burn; the script sets it by the night'),
  heel: own('the ship\'s tilt, degrees (+ to port): the heel roll and the rolling; the script leads it itself'),
  ship_x: own('where the ship is in the world across the course to Kaperna, m (to the right, northwards); the script leads her under her own way, shore and port set it'),
  ship_d: own('where the ship is in the world along the course west, m: 0 — 6 km from Kaperna, Liss at −30000; the script leads her under her own way, shore and port set it'),
  ship_f: own('the ship\'s turn, degrees (180 — bow to the west); the script sets it by heading'),
  ship_at: { type: 'string', means: 'internal: which port and shore put the ship where she is (“port:shore”); the script puts the ship anew when they name another place' },
  steamer_at: own('which value of steamer put the steamer where she is'),
  steamer_x: own('where the steamer is in the world across, m; the script sets it by steamer and leads it'),
  steamer_d: own('where the steamer is in the world along the course, m; the script sets it by steamer and leads it'),
  steamer_smoke: own('whether the steamer smokes (1 while she is here)'),
  belly_l: own('the turn of the square sails\' left halves, degrees (180 — flat): the edges aft when the wind fills them; the script sets it by sails_set and luff'),
  belly_r: own('the turn of the square sails\' right halves, degrees; the script sets it by sails_set and luff'),
  belly_tilt: own('the tilt of the square sails, degrees (−: the foot forward under the wind); the script sets it by sails_set and luff'),
  fore_tg_e: own('where the fore topgallant hangs — the height of its yard, raised above the foot, over the poop, m: it goes up with the topsail yard; the script sets it by sails_set'),
  main_tg_e: own('where the main topgallant hangs, the same; the script sets it by sails_set'),
};
Object.assign(state, { lo_a: LONGREN[0], lo_d: LONGREN[1], lo_e: LONGREN[2], longren_here: false });
states.lo_a = own('where Longren is — along the steamer, m from her middle (aft); set by the beats');
states.lo_d = own('where Longren is — across the steamer, m from her port side inwards; set by the beats');
states.lo_e = own('the height of the steamer\'s deck under Longren above the water, m');
for (const [id, name, , k, [a, d, e]] of PEOPLE) {
  Object.assign(state, { [`${k}_a`]: a, [`${k}_d`]: d, [`${k}_e`]: e, [`${id}_here`]: id === 'grey' });
  states[`${k}_a`] = own(`where ${name} is — across the ship, m from the viewer's place on the poop (to the right, to starboard; the keel at ${KEEL}); set by the beats`);
  states[`${k}_d`] = own(`where ${name} is — along the ship, m from the viewer's place (towards the bow: the wheel 2.6, the edge of the poop 6, the mainmast 14); set by the beats`);
  states[`${k}_e`] = own(`which deck ${name} stands on — its height above the poop (the poop 0, the waist ${WAIST})`);
}
Object.assign(state, { grey_do: { motion: 'helm', loop: true }, grey_reach: { r: 'wheel#rim_r', l: 'wheel#rim_l' } });

const spec = {
  engine: 2,
  title: 'The Deck',
  caption: 'Course — straight ahead.',
  horizon: 0.56,
  // the camera rides on the ship; the film and the viewer may go over the poop and out over the waist to the mainmast
  camera: { mode: 'roam', on: 'ship', area: [4.2, 1.4, 2.6, 11.5] },
  light: {
    vignette: 0.3, grain: 0.1, ambient: 0.9, ambientColor: '#eef0f2', bounce: 0.5, haze: 0.03, hazeColor: '#cdd6de', hazeGlow: 0.45, shafts: 0.1,
    wind: [0, 1, 0.6],
    looks: {
      dawn: { ambient: 0.75, ambientColor: '#ece6ea', haze: 0.04, hazeColor: '#e2ddd8', tint: '#f3dccb', tintStrength: 0.06, shafts: 0.3 },
      dusk: { ambient: 0.68, ambientColor: '#d6cfe0', haze: 0.05, hazeColor: '#aca7b5', tint: '#e9bba3', tintStrength: 0.07, shafts: 0.35 },
      night: { ambient: 0.7, ambientColor: '#a9bbe6', haze: 0.05, hazeColor: '#1d2839', saturation: 0.8, shafts: 0.2 },
      storm: { ambient: 0.92, ambientColor: '#b9c2cc', haze: 0.25, hazeColor: '#8e98a2', saturation: 0.7, wind: [0, 1, 1.6], lights: { sun: 0.2 } },
    },
  },
  lights: [
    { id: 'sun', from: 'sky#sun', color: '#ffeedd', strength: 1.0, on: 'sun_light', size: 0.5 },
    { id: 'moon', from: 'sky#moon', color: '#c4d2f0', strength: 0.9, on: 'moon_light', size: 0.5 },
    { id: 'lantern_port_light', of: 'lantern_port#flame', reach: 9, strength: 2.2, flicker: 0.15, on: 'lanterns' },
    { id: 'lantern_starboard_light', of: 'lantern_starboard#flame', reach: 9, strength: 2.2, flicker: 0.15, on: 'lanterns' },
    { id: 'lantern_main_light', of: 'lantern_main#flame', reach: 11, strength: 2.2, flicker: 0.15, on: 'lanterns' },
    ...[0, 1, 2, 3].map(i => ({ id: `quay_light_${i}`, of: `quay_lamps#lamp${i}`, reach: 10, on: 'harbour_lit' })),
  ],
  modules: ['nebo', 'korabli', 'cast', 'beats', 'closeups'],
  state, states,
  music: JSON.parse(read('music.json')),
  objects,
};
writeElement('paluba', 'sky', 'wgsl', wgsl('nebo-sky'));
const file = path.join(DIR, 'scene.json');
fs.writeFileSync(file, JSON.stringify(spec, null, 1) + '\n');
console.log(`scenes/paluba/scene.json: ${objects.length} elements`);
