// Writes scenes/platform/scene.json from the scene's lib (where everything stands) and the world's trains module (the
// train's numbers). The elements' paintings are scenes/platform/elements/*.js.
//   node tools/platform/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync } from 'node:fs';

const file = (name, text) => writeFileSync(`scenes/platform/elements/${name}.js`, text);

const DIR = 'scenes/platform';
const mod = name => new Function('anim', 'kit', readFileSync(`modules/${name}.js`, 'utf8'))({}, {});
const trains = mod('trains');
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, { trains });
const { G, EL, EYE, WIN, IDS } = L;
const r2 = v => Math.round(v * 100) / 100;

const objects = [];
const add = o => (objects.push(o), o);
const P = G.PLAT;

add({ id: 'sky', name: 'Sky', sky: true });
add({ id: 'ground', name: 'Snow', plane: true, drape: true, across: 0, distance: 20, elevation: 0, width: 360, depth: 220 });
add({ id: 'wood', name: 'Wood', across: 0, distance: 75, height: 15, box: [-301, -16, 301, 0.4] });
add({ id: 'track', name: 'Tracks', plane: true, across: 0, distance: 13.55, elevation: r2(G.BED + 0.02), width: 400, depth: 6.6 });
add({ id: 'masts', name: 'Mast', across: 0, distance: 13.55, onLand: false, elevation: G.BED, height: 8.6, box: [-2.7, -8.7, 2.7, 0.05],
  copies: [-170, -110, -50, 10, 70, 130, 190].map(a => ({ across: a, distance: 13.55, elevation: G.BED })) });
add({ id: 'wires', name: 'Overhead line', across: 0, distance: G.TRACK, onLand: false, elevation: G.BED, facing: 180, height: 1.3, box: [-201, -7.9, 201, -6.2] });
add({ id: 'platform', name: 'Platform', plane: true, walk: true, across: (P.a0 + P.a1) / 2, distance: r2((P.d0 + G.EDGE + 0.06) / 2), elevation: 0.05,
  width: P.a1 - P.a0, depth: r2(G.EDGE + 0.06 - P.d0) });
add({ id: 'edge', name: 'Platform edge', across: (P.a0 + P.a1) / 2, distance: r2(G.EDGE + 0.06), onLand: false, elevation: G.BED, facing: 180,
  height: 1.3, box: [-(P.a1 - P.a0) / 2 - 0.05, -1.35, (P.a1 - P.a0) / 2 + 0.05, 0.05] });
add({ id: 'lamp_post', name: 'Lamp', across: G.LAMP[0], distance: G.LAMP[1], height: G.LAMP[2] + 0.3, box: [-0.2, -G.LAMP[2] - 0.4, 0.8, 0.05], shadow: true });
add({ id: 'stair_lamp', name: 'Lamp over the stairs', across: G.STAIR_LAMP[0], distance: G.STAIR_LAMP[1], height: G.STAIR_LAMP[2] + 0.3,
  box: [-0.2, -G.STAIR_LAMP[2] - 0.4, 0.8, 0.05], shadow: true });
add({ id: 'bench', name: 'Bench', across: G.BENCH[0], distance: r2(G.BENCH[1] + 0.3), elevation: 0.05, facing: 180, height: 1.0, box: [-1.25, -1.05, 1.25, 0.05] });
add({ id: 'bench_seat', name: 'Bench', plane: true, across: G.BENCH[0], distance: G.BENCH[1] + 0.05, elevation: 0.5, width: 2.3, depth: 0.45 });
add({ id: 'booth', name: 'Ticket booth', across: G.BOOTH[0], distance: G.BOOTH[1], elevation: 0.05, facing: 180, height: 2.9, box: [-1.5, -3.0, 1.5, 0.05], shadow: true });
// the stairs: the flight down to the right (a slope), its two sides (copies)
{
  const L0 = G.LANDING, run = G.FOOT.a - L0.a1, mid = (L0.a1 + G.FOOT.a) / 2;
  add({ id: 'stairs', name: 'Stairs', plane: true, walk: true, across: mid, distance: (L0.d0 + L0.d1) / 2, elevation: r2(G.FOOT.low / 2),
    width: L0.d1 - L0.d0, depth: r2(Math.hypot(run, -G.FOOT.low)), rotation: 90, tilt: r2((-Math.atan2(-G.FOOT.low, run) * 180) / Math.PI) });
  add({ id: 'stairs_side', name: 'Stairs', across: mid, distance: L0.d0 - 0.05, onLand: false, elevation: G.FOOT.low, facing: 180, height: 4.3,
    box: [-4.4, -4.3, 2.4, 0.15], copies: [{ across: mid, distance: L0.d0 - 0.05, elevation: G.FOOT.low }, { across: mid, distance: L0.d1 + 0.05, elevation: G.FOOT.low }] });
}
// the settlement below the platform (behind the start: its fronts face back up the slope, facing 0): houses (a few
// windows lit), gardens' fences, birches; the Sarafanovs' window before its house's front
const FW = G.FAR_WINDOW;
// [across, distance, its window lit, mirrored]
const HOUSES = [[22, -12, 1, 0], [31, -16, 0, 1], [40, -24, 1, 0], [45, -8, 0, 0], [FW[0] + 1.95, FW[1] - 0.2, 0, 0], [70, -27, 1, 1], [79, -18, 0, 0],
  [88, -30, 0, 1], [10, -20, 0, 0], [0, -26, 1, 1], [-12, -18, 0, 0], [-24, -24, 0, 1], [30, -36, 1, 0], [55, -40, 0, 1], [-36, -14, 1, 0]];
add({ id: 'village', name: 'House', across: HOUSES[0][0], distance: HOUSES[0][1], facing: 0, height: 5.5, box: [-4.2, -5.8, 4.2, 0.15],
  copies: HOUSES.map(([a, d, lit, flip], i) => ({ across: a, distance: d, facing: 0, glow: lit, flip: !!flip, scale: 0.9 + 0.08 * (i % 3) })) });
add({ id: 'gardens', name: 'Fence', across: 18, distance: -8, facing: 0, height: 1.2, box: [-0.1, -1.3, 10.1, 0.2],
  copies: [[18, -8], [26, -9.5], [36, -18], [44, -10], [52, -16], [66, -22], [-6, -14], [-20, -20]].map(([a, d]) => ({ across: a, distance: d, facing: 0 })) });
add({ id: 'birches', name: 'Birch', across: 24, distance: 2, height: 9, box: [-3.6, -11.6, 3.6, 0.3],
  copies: [[24, 2, 1, false], [27, -3, 0.85, true], [-30, -2, 1.1, false], [12, -6, 0.9, true], [46, -6, 1, false]].map(([a, d, s, f]) => ({ across: a, distance: d, scale: s, flip: f })) });
add({ id: 'far_window', name: 'The Sarafanovs\' window', glows: true, across: FW[0], distance: r2(FW[1] + 0.05), elevation: FW[2], facing: 0,
  height: 1.0, box: [-0.6, -1.05, 0.6, 0.08] });
add({ id: 'snowfall', name: 'Snow', particles: { kind: 'snow', amount: 'snow', count: 9000, reach: 36 } });

// the train: its side (places by train_x), what its windows show (a card that glows, ELECTRIC.inside behind the
// side), its floor (unseen: Silva stands on it, carried), inside the second car its wall round the window by the
// front vestibule (the camera in the car looks through it) and the saloon's end wall
add({ id: 'train', name: 'Electric train', unseen: true, across: G.trainX(0), distance: G.SIDE, onLand: false, elevation: -1.1, facing: 180,
  place: { across: 'train_x' }, height: 6.4, box: [-EL.half - 0.6, -6.4, EL.half + 0.6, 0.2] });
for (let k = 0; k < EL.cars; k++) {
  const which = ['head', 'second', 'third', 'tail'][k];
  add({ id: `car${k}`, name: 'Electric train', on: 'train', across: 0, distance: 0, elevation: 0, facing: 180, height: 6.4, box: EL.box(k), shadow: true });
  file(`car${k}`, `// the train's ${which} car, its side (the world's trains)\ne.kit.trains.electric_train(g, e, ${k});\n`);
  file(`car${k}.animate`, "// the doors slide by `doors`; frost on the glass at dawn by the play's `frost`\nconst S = e.state;\n" +
    'e.kit.trains.doorsLive(e, S.doors);\ne.kit.trains.frostLive(e, (Number(S.frost) || 0) * (Number(S.dawn_k) || 0));\n');
  add({ id: `in${k}`, name: 'Electric train', on: 'train', across: 0, distance: EL.inside, elevation: 0, facing: 180, glows: true,
    height: 3.5, box: [EL.x0(k), -3.6, EL.x0(k) + EL.len, -1.0] });
  file(`in${k}`, `// what the ${which} car's windows and doorways show, lit (the world's trains)${k === 1 ? "; Silva's figure in its front vestibule (silva_window)" : ''}\ne.kit.trains.electric_inside(g, e, ${k});\n`);
  if (k === 1) file('in1.animate', 'e.kit.trains.silvaLive(e, e.state.silva_window);\n');
}
add({ id: 'floor', name: 'Floor', plane: true, unseen: true, walk: true, on: 'train', across: 0, distance: 1.45, elevation: -EL.floor, width: EL.half * 2 - 0.4, depth: 2.9 });
add({ id: 'train_window', name: 'Carriage window', on: 'train', across: WIN, distance: 0.07, elevation: -EL.floor, facing: 0, inside: true,
  height: 3.0, box: [-1.35, -3.05, 4.55, 0.05], uniforms: { wipe: 0, cy: -1.375 } });
add({ id: 'partition', name: 'Carriage', on: 'train', across: r2(WIN + 1.25), distance: 1.45, elevation: -EL.floor, facing: 270, inside: true,
  height: 3.2, box: [-1.5, -3.25, 1.5, 0.05] });
// the insert: the rucksack's strap (closeups' shot "strap")
add({ id: 'strap', name: 'Rucksack strap', insert: 'strap' });

// the people
const NAMES = { busygin: 'Busygin', silva: 'Silva', sarafanov: 'Sarafanov', nina: 'Nina', vasenka: 'Vasenka' };
const WHO = { busygin: 'busygin', silva: 'silva', sarafanov: 'sarafanov_nohat', nina: 'nina', vasenka: 'vasenka' };
const stub = { get: () => undefined, tell() {}, warn() {} };
const START = L.film(stub).gone.from();
for (const id of IDS) add({ id, name: NAMES[id], person: { cast: 'cast', who: WHO[id] }, across: START[`${id}_a`], distance: START[`${id}_d`],
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });

// the light: the snowy night; its looks by the hour (the script sets their weights)
const lights = [
  { id: 'night_sky', from: [-20, 40], color: '#a9b8e0', strength: 0.35 },
  { id: 'dawn_sky', from: [-30, 18], color: '#cdd0da', strength: 0.9, on: 'dawn_k' },
  { id: 'lamp', of: 'lamp_post#lamp', color: '#f3dcae', strength: 1.9, reach: 12, glow: 1.2 },
  { id: 'lamp2', of: 'stair_lamp#lamp', color: '#f3dcae', strength: 1.6, reach: 8, glow: 1.0 },
  { id: 'head', of: 'car0#head', color: '#fff3d8', strength: 2.2, reach: 30 },
  { id: 'tail', of: 'car3#tail', color: '#ff3b22', strength: 0.8, reach: 4 },
  ...[0, 1, 2, 3].flatMap(k => [...EL.windows(k).map((_, i) => `w${k}${i}`), `d${k}0`, `d${k}1`]
    .map(n => ({ id: `train_${n}`, of: `in${n[1]}#${n}`, color: '#ffe2a8', strength: 0.55, reach: 5 }))),
  { id: 'car_lamp', of: 'train_window#lamp', color: '#fff2d2', strength: 1.0, reach: 3 },
  { id: 'far', of: 'far_window#glow', color: '#eda055', strength: 1.0, reach: 5, on: 'warm' },
];

const state = {
  beat: null, beat_next: null, late_run: 0, torn: 0, dusk_k: 0, late_k: 0, dawn_k: 0, train_x: G.trainX(0),
  // the play's keys (scenes.md; the game's carry): their defaults — what a play with nothing chosen yet carries
  father_came: 1, nina_came: 0, vasya_came: 0, silva_door: 1, nina_is: 'none', suitcase: 0, box_hand: 1, warm: 0.36, frost: 0.25, vasya_end: 'taiga',
  ...START,
};
const num = means => ({ type: 'number', means });
const BEATS = Object.keys(L.film(stub));
const states = {
  beat: { values: [null, ...BEATS], means: 'the film\'s beat: the game sets a name — it plays from its beginning (the module beats)' },
  beat_next: { values: [null, ...BEATS], means: 'which beat comes next: its opening is made ready, the cut goes to the ready one' },
  fade: { range: [0, 1], smooth: true, means: 'the frame from the dark: 1 black … 0 seen' },
  hour: { range: [0, 1], smooth: true, means: 'the time: 0.25 grey dawn, 0.84 late dusk, 0.9 night, 0.93 late night' },
  dusk_k: { range: [0, 1], smooth: true, means: 'the look “dusk” — the script sets it by hour' },
  late_k: { range: [0, 1], smooth: true, means: 'the look “late night” — the script sets it by hour' },
  dawn_k: { range: [0, 1], smooth: true, means: 'the look “dawn” — the script sets it by hour' },
  snow: { range: [0, 1], smooth: true, means: 'how hard it snows' },
  train: { range: [-1, 1], smooth: true, means: 'the electric train: −1 far left, coming; 0 standing at the platform (always at one place); 1 gone right' },
  train_x: num('where the train is, metres (the script sets it by train)'),
  doors: { range: [0, 1], smooth: true, means: 'the train\'s doors: 0 shut … 1 open' },
  wipe: { range: [0, 1], smooth: true, means: '“The Glass”: the frost rubbed off the carriage window, round from its middle (1 — all of it)' },
  silva_window: { range: [0, 1], smooth: true, means: 'Silva\'s figure in the second car\'s front vestibule, painted (when he is in the train, its doors shut)' },
  strap: { range: [0, 1], means: 'the insert “The Rucksack” (closeups, the shot strap): 0 shut, 1 open' },
  pull: { range: [0, 1], means: '“The Rucksack”: the strap creeps up out of the fist (the game moves it; only the insert reads it)' },
  grip: { range: [0, 1], means: '“The Rucksack”: the fist clenched (1) or open (0)' },
  door_bg: { range: [0, 1], means: '“The Rucksack”: the carriage door behind them shuts (1)' },
  bench_snow: { values: [0, 1], means: 'snow on the bench (dawn): the beat\'s cut sets it' },
  torn: { values: [0, 1], means: 'the play\'s: the strap torn in “The Rucksack” — knotted in bench_back (the game sets it before that beat)' },
  late_run: { values: [0, 1], means: 'the play\'s: he looked back while running — in last the train stands open already (the game opens the scene with it)' },
  father_came: { values: [0, 1], means: 'a key of the play: Sarafanov comes up to the platform in last' },
  nina_came: { values: [0, 1], means: 'a key of the play: Nina comes up — ahead of her father if she knows the truth (nina_is), first if he did not come' },
  vasya_came: { values: [0, 1], means: 'a key of the play: Vasenka comes up — without his rucksack if he stays (vasya_end home); first if no one else came' },
  silva_door: { values: [0, 1], means: 'a key of the play: Silva waits in the second car\'s doorway' },
  nina_is: { values: ['none', 'knows', 'sister'], means: 'a key of the play: knows — Nina knows the truth from him, ahead of her father' },
  suitcase: { values: [0, 1], means: 'a key of the play: Sarafanov carries a suitcase' },
  box_hand: { values: [0, 1], means: 'a key of the play: Sarafanov gives him the snuffbox at the carriage door (boards)' },
  warm: { range: [0, 1], means: 'a key of the play: how bright the Sarafanovs\' window far below is' },
  frost: { range: [0, 1], means: 'a key of the play: frost on the train\'s windows at dawn' },
  vasya_end: { values: ['home', 'taiga'], means: 'a key of the play: dawn — Vasenka leaves by the first train (taiga) or the platform is empty (home)' },
  ...Object.fromEntries(IDS.flatMap(id => [[`${id}_here`, { type: 'boolean', means: `${NAMES[id]} in the scene` }],
    [`${id}_a`, num(`where ${NAMES[id]} is: metres along the platform`)], [`${id}_d`, num(`where ${NAMES[id]} is: metres away`)]])),
};

const scene = {
  engine: 3,
  title: 'The Platform',
  caption: 'A suburban platform at night. The first snow.',
  horizon: 0.5,
  // roam, not panorama: the shots turn far aside (back along the platform, down to the settlement, from the car's
  // window), and a roaming camera's sky goes all round
  camera: { mode: 'roam', area: [-12, 20, -1, 9.5] },
  modules: ['cast', 'beats', 'closeups', 'trains', 'houses'],
  light: {
    tint: '#6f80b8', tintStrength: 0.12, vignette: 0.45, grain: 0.2,
    haze: 0.14, hazeColor: '#323b5c', hazeGlow: 0.9, shafts: 0,
    brightness: 1.12, saturation: 0.85, ambient: 0.5, ambientColor: '#8796c8', bounce: 0.5, inside: 0.25,
    wind: [0.6, 0.2, 0.35],
    looks: {
      dusk_k: { ambient: 0.58, ambientColor: '#8f90c4', hazeColor: '#3f4468', tintStrength: 0.1 },
      late_k: { ambient: 0.42, ambientColor: '#7686bc', hazeColor: '#262e4a', tintStrength: 0.15 },
      dawn_k: { ambient: 0.85, ambientColor: '#b8bccb', hazeColor: '#9aa0b2', haze: 0.22, tint: '#b0b4c8', tintStrength: 0.06, saturation: 0.7, brightness: 1.05 },
    },
  },
  lights,
  state,
  states,
  objects,
  music: {
    prompts: [
      { text: 'Very quiet wind over an empty suburban railway platform at night, snow falling, sparse, cold', weight: 1.2 },
      { text: 'Soft sustained string pad, almost still, tender and aching, winter night, minor key', weight: 0.6 },
      { text: 'Glassy high harmonics like frost on a carriage window, shimmering, very slow', weight: 0.3 },
      { text: 'Distant rails humming, a far train fading, low drone, no melody', weight: 0 },
      { text: 'Slow solo piano, few notes, lots of silence, Soviet film score, melancholic', weight: 0 },
      { text: 'Warm low organ hum like a lit window far off in the cold, very soft', weight: 0 },
      { text: 'Muted felt piano, warm and sad, 1970s Russian chamber music', weight: 0 },
      { text: 'Cello long notes, quiet, breathing, intimate, late night', weight: 0 },
      { text: 'Minimal ambient with soft bell-like tones, cold and still', weight: 0 },
      { text: 'Grey dawn, a thin cold light, a single sustained chord slowly brightening', weight: 0 },
      { text: 'Tense quiet pulse, someone waiting for a train that is late', weight: 0 },
      { text: 'Celesta and strings, a winter tale but sad, very slow', weight: 0 },
      { text: 'Solemn wordless choir hum, far away, cold air', weight: 0 },
      { text: 'Soft brushed snare and double bass, slow night jazz muffled by snow', weight: 0 },
      { text: 'Lonely harmonica far away, a station at night, restrained', weight: 0 },
    ],
    bpm: 60, density: 0.15, brightness: 0.25, scale: 'A_FLAT_MAJOR_F_MINOR',
  },
};
writeFileSync(`${DIR}/scene.json`, `${JSON.stringify(scene, null, 2)}\n`);
console.log('objects', objects.length, 'lights', lights.length, 'state keys', Object.keys(state).length);
