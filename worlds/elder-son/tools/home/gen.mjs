// Writes scenes/home/scene.json from the scene's lib (the plan, the furniture, the seats, the keys).
// node tools/home/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/home';
mkdirSync(`${DIR}/elements`, { recursive: true });
const cast = new Function('data', 'anim', 'kit', 'MooodShapes', readFileSync('modules/cast.js', 'utf8'))({ motions: {} }, {}, {}, { V: {} });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, { cast });
const { A, H } = L;
const objects = [];
const add = o => (objects.push(o), o);
const wallBox = w => [-w / 2 - 0.02, -H - 0.02, w / 2 + 0.02, 0.02];
const SAR = { shadow: { light: 'sar_light' } };

// ── outside the window: the night (or the dawn) over the gardens under snow, the far platform, the far train, the
// old man going off across them in the morning ──
add({ id: 'sky', name: 'Sky', sky: true });
add({ id: 'outside', name: 'Vegetable plots', across: A(L.WINDOW.x), distance: 30, facing: 180, height: 9, box: [-40, -9, 40, 0.3] });
add({ id: 'yard', name: 'Snow', plane: true, across: A(L.WINDOW.x), distance: 18, elevation: 0, width: 80, depth: 27 });
add({ id: 'far_train', name: 'Electric train', glows: true, across: L.FAR_TRAIN.from, distance: L.FAR_TRAIN.z, facing: 180, place: { across: 'far_train_x' },
  height: 1.2, box: [-7.2, -1.5, 7.2, 0.1] });
add({ id: 'father_far', name: 'Sarafanov far off', across: L.FATHER_FAR.from, distance: L.FATHER_FAR.z, facing: 180, place: { across: 'father_x' },
  height: 1.7, box: [-0.6, -1.8, 0.6, 0.05] });

// ── the rooms: the floor, the ceiling, the walls (cards facing in), the doorway between ──
add({ id: 'floor', name: 'Floor', plane: true, walk: true, inside: true, across: 2, distance: 2, elevation: 0, width: 8, depth: 4 });
add({ id: 'ceiling', name: 'Ceiling', plane: true, inside: true, across: 2, distance: 2, elevation: H, width: 8, depth: 4, tilt: 180 });
add({ id: 'k_back', name: 'Kitchen', inside: true, across: 0, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'k_left', name: 'Kitchen', inside: true, across: -2, distance: 2, facing: 90, height: H, box: wallBox(4) });
{
  const a = A(L.DOOR.x), d0 = a - L.DOOR.w / 2, d1 = a + L.DOOR.w / 2;
  add({ id: 'k_near_a', name: 'Kitchen', inside: true, across: (d0 - 2) / 2, distance: 0, facing: 0, height: H, box: wallBox(d0 + 2) });
  add({ id: 'k_near_b', name: 'Kitchen', inside: true, across: (d1 + 2) / 2, distance: 0, facing: 0, height: H, box: wallBox(2 - d1) });
  add({ id: 'k_near_top', name: 'Kitchen', inside: true, across: a, distance: 0, elevation: L.DOOR.h, facing: 0, height: H - L.DOOR.h,
    box: [-L.DOOR.w / 2 - 0.02, -(H - L.DOOR.h) - 0.02, L.DOOR.w / 2 + 0.02, 0.02] });
}
add({ id: 'k_right_a', name: 'Kitchen', inside: true, ...SAR, across: 2, distance: L.DOORWAY.z0 / 2, facing: 270, height: H, box: wallBox(L.DOORWAY.z0) });
add({ id: 'k_right_b', name: 'Kitchen', inside: true, ...SAR, across: 2, distance: (L.DOORWAY.z1 + 4) / 2, facing: 270, height: H, box: wallBox(4 - L.DOORWAY.z1) });
add({ id: 'k_lintel', name: 'Kitchen', inside: true, ...SAR, across: 2, distance: (L.DOORWAY.z0 + L.DOORWAY.z1) / 2, elevation: L.DOORWAY.h, facing: 270,
  height: H - L.DOORWAY.h, box: [-0.52, -(H - L.DOORWAY.h) - 0.02, 0.52, 0.02] });
add({ id: 'r_back', name: 'Room', inside: true, across: 4, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'r_right', name: 'Room', inside: true, ...SAR, across: 6, distance: 2, facing: 270, height: H, box: wallBox(4) });
add({ id: 'r_near', name: 'Room', inside: true, across: 4, distance: 0, facing: 0, height: H, box: wallBox(4) });
add({ id: 'hall', name: 'Passage', inside: true, across: A(L.DOOR.x), distance: -1.6, facing: 0, height: 2.4, box: [-1.4, -2.45, 1.4, 0.05] });
// beyond Sarafanov's door: his room, dim, his lamp (the wedge's light)
add({ id: 'sar_room', name: 'Sarafanov\'s room', inside: true, across: 6.7, distance: 3.5, facing: 270, height: 2.4, box: [-0.85, -2.45, 0.85, 0.05] });

// ── the window, the doors ──
add({ id: 'window', name: 'Window', inside: true, translucent: 0.6, across: A(L.WINDOW.x), distance: 3.975, elevation: L.WINDOW.sill, facing: 180,
  height: L.WINDOW.h, box: [-L.WINDOW.w / 2 - 0.02, -L.WINDOW.h - 0.02, L.WINDOW.w / 2 + 0.02, 0.02], uniforms: { hole: 0 } });
add({ id: 'window_frame', name: 'Window', inside: true, across: A(L.WINDOW.x), distance: 3.96, elevation: L.WINDOW.sill, facing: 180, height: L.WINDOW.h,
  box: [-L.WINDOW.w / 2 - 0.2, -L.WINDOW.h - 0.15, L.WINDOW.w / 2 + 0.2, 0.12] });
add({ id: 'door', name: 'Door', inside: true, across: A(L.DOOR.x) + L.DOOR.w / 2, distance: 0.03, facing: 0, place: { facing: 'door_f' },
  height: L.DOOR.h, box: [-0.05, -L.DOOR.h - 0.05, L.DOOR.w + 0.05, 0.05] });
add({ id: 'sar_door', name: 'Sarafanov\'s door', inside: true, ...SAR, across: 6 - 0.03, distance: L.SAR_DOOR.z0, facing: 270, place: { facing: 'sar_door_f' },
  height: 2.0, box: [-(L.SAR_DOOR.z1 - L.SAR_DOOR.z0) - 0.05, -2.05, 0.05, 0.05] });

// ── the kitchen's things ──
add({ id: 'stove', name: 'Stove', inside: true, across: A(L.STOVE.front), distance: (L.STOVE.z0 + L.STOVE.z1) / 2, facing: 90, height: L.STOVE.h,
  box: [-0.62, -L.STOVE.h - 0.05, 0.62, 0.03] });
add({ id: 'stove_side', name: 'Stove', inside: true, across: (A(L.STOVE.front) - 2) / 2, distance: L.STOVE.z0, facing: 180, height: L.STOVE.h,
  box: [-0.4, -L.STOVE.h - 0.05, 0.4, 0.03] });
{
  const T = L.TABLE, cx = A((T.x0 + T.x1) / 2), cz = (T.z0 + T.z1) / 2, w = T.x1 - T.x0, d = T.z1 - T.z0;
  add({ id: 'table', name: 'Table', plane: true, inside: true, across: cx, distance: cz, elevation: T.h, width: w, depth: d, shadow: { light: 'lamp', onto: [] } });
  add({ id: 'table_end', name: 'Table', inside: true, across: cx, distance: T.z0, facing: 180, height: T.h, box: [-w / 2 - 0.04, -T.h - 0.03, w / 2 + 0.04, 0.03],
    copies: [{ across: cx, distance: T.z0, facing: 180 }, { across: cx, distance: T.z1, facing: 0 }] });
  add({ id: 'table_side', name: 'Table', inside: true, across: A(T.x0), distance: cz, facing: 270, height: T.h, box: [-d / 2 - 0.04, -T.h - 0.03, d / 2 + 0.04, 0.03],
    copies: [{ across: A(T.x0), distance: cz, facing: 270 }, { across: A(T.x1), distance: cz, facing: 90 }] });
}
add({ id: 'lampshade', name: 'Lampshade', inside: true, glows: true, across: A(L.LAMP[0]), distance: L.LAMP[1], elevation: L.LAMP[2], height: 0.5, box: [-0.4, -0.55, 0.4, 0.12] });
add({ id: 'chairs', name: 'Chair', inside: true, across: A(L.SEATS.L1[0]), distance: L.SEATS.L1[1], facing: 180, height: 0.95, box: [-0.3, -1.0, 0.3, 0.03],
  copies: Object.values(L.SEATS).map(([x, z, turn]) => ({ across: A(x), distance: z, facing: 180, flip: turn === 270 })) });
add({ id: 'clock', name: 'Clock', inside: true, across: -2 + 0.03, distance: L.CLOCK.z, elevation: L.CLOCK.face - 0.74, facing: 90, height: 0.9, box: [-0.2, -0.95, 0.2, 0.05] });
add({ id: 'hook', name: 'Hooks', inside: true, across: A(L.HOOK[0]), distance: L.HOOK[1], elevation: 0, facing: 0, height: 1.9, box: [-0.3, -1.95, 0.3, 0.03] });
add({ id: 'stool', name: 'Stool', inside: true, across: A(L.STOOL[0]), distance: L.STOOL[1], facing: 180, height: 0.7, box: [-0.3, -0.75, 0.3, 0.03] });
add({ id: 'rucksack', name: 'Rucksack', inside: true, across: A(0.62), distance: 2.42, facing: 180, height: 0.6, box: [-0.3, -0.7, 0.3, 0.03] });
add({ id: 'rucksack_door', name: 'Rucksack', inside: true, across: A(2.5), distance: 0.3, facing: 180, height: 0.6, box: [-0.3, -0.7, 0.3, 0.03] });
add({ id: 'coat_chair', name: 'Coat', inside: true, across: A(L.SEATS.R1[0] + 0.22), distance: L.SEATS.R1[1], facing: 180, height: 1.0, box: [-0.3, -1.05, 0.3, 0.03] });

// ── the room's things ──
add({ id: 'cupboard', name: 'Cupboard', inside: true, across: A(L.CUPBOARD.x), distance: L.CUPBOARD.z, facing: 0, height: L.CUPBOARD.h,
  box: [-L.CUPBOARD.w / 2 - 0.05, -L.CUPBOARD.h - 0.05, L.CUPBOARD.w / 2 + 0.05, 0.03] });
add({ id: 'sofa', name: 'Sofa', inside: true, across: A((L.SOFA.x0 + L.SOFA.x1) / 2), distance: L.SOFA.z + 0.1, facing: 180, height: 0.9, box: [-1.05, -0.95, 1.05, 0.03] });
add({ id: 'cot', name: 'Camp bed', inside: true, across: A(L.COT.x + L.COT.w / 2), distance: (L.COT.z0 + L.COT.z1) / 2, facing: 90, height: 0.5,
  box: [-(L.COT.z1 - L.COT.z0) / 2 - 0.05, -0.6, (L.COT.z1 - L.COT.z0) / 2 + 0.05, 0.03] });
add({ id: 'cot_top', name: 'Camp bed', plane: true, inside: true, across: A(L.COT.x), distance: (L.COT.z0 + L.COT.z1) / 2, elevation: L.COT.top,
  width: L.COT.w, depth: L.COT.z1 - L.COT.z0 });
add({ id: 'cot_chair', name: 'Coat', inside: true, across: A(L.COT_CHAIR[0]), distance: L.COT_CHAIR[1], facing: 90, height: 1.0, box: [-0.35, -1.05, 0.35, 0.03] });
add({ id: 'case_chair', name: 'Case', inside: true, across: A(L.CASE_CHAIR[0]), distance: L.CASE_CHAIR[1], facing: 270, height: 1.0, box: [-0.35, -1.05, 0.35, 0.03] });

// ── the people ──
for (const id of L.PEOPLE) {
  add({ id, name: L.NAMES[id], inside: true, person: { cast: 'cast', who: id, turn: 90 }, across: A(L.SPOT.hall[0]), distance: L.SPOT.hall[1],
    place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
}

// ── the close-ups (modules/closeups): the hands at the stove, the tea, the snuffbox ──
add({ id: 'hands', name: 'Hands', insert: 'hands' });
add({ id: 'tea', name: 'Tea', insert: 'tea' });
add({ id: 'box', name: 'Snuffbox', insert: 'box' });

// ── the state: what the player sees first — the same night at the table, the two face to face under the lamp ──
const party = { warm: 0.36, frost: 0.25, box_where: 'cupboard', vasenka_by: 0, silva_door: 1, came: 'father', nina_end: 'gone', nina_came: 0, vasya_end: 'taiga' };
const fake = { get: k => (k in party ? party[k] : null), kit: { cast }, warn: t => { throw new Error(t); } };
const F = L.film(fake);
const state = { ...party, beat: null, beat_next: null, hurt: 0, heard: 0, far_train: 0, far_train_x: L.FAR_TRAIN.from, hole: 0,
  thaw: 0, rub: 0, which: 0, pour: 0, glass1: 0, glass2: 0, spill: 0, shake: 0, box_mode: 'take', finger1: 0, finger2: 0, finger3: 0, finger4: 0,
  old: 1, push: 0, old_close: 0, ...F.box_out.from() };
const num = means => ({ type: 'number', means });
const BEATS = Object.keys(F);
const states = {
  hour: { range: [0, 1], means: 'the weight of the night (the light\'s look hour): 0.25 grey dawn … 0.9 night' },
  beat: { values: [null, ...BEATS], means: 'the film\'s beat: the game sets a name — the beat plays from its beginning (modules/beats)' },
  beat_next: { values: [null, ...BEATS], means: 'which beat comes next by a cut: the scene makes its first frame ready' },
  warm: { range: [0, 1], means: 'a key of the play: the house\'s warmth — the lamp under the lampshade 0.6 + 0.4·warm (a beat sets it)' },
  frost: { range: [0, 1], means: 'a key of the play: frost on the window, from the corners to the middle (translucent)' },
  box_where: { values: ['cupboard', 'busygin'], means: 'a key of the play: where the snuffbox is after II.4 — in the cupboard · with Busygin' },
  vasenka_by: { values: [0, 1], means: 'a key of the play: in pack Vasenka comes through and stands next to Busygin' },
  silva_door: { values: [0, 1], means: 'a key of the play: in go_out Silva opens the door and waits (1) · goes out first, the door bangs (0)' },
  came: { values: ['none', 'father', 'family'], means: 'a key of the play: who was with him on the platform (home_late, home_anyway)' },
  nina_end: { values: ['home', 'gone'], means: 'a key of the play: Nina at home in the ending · gone (the chair empty, her coat not on the hook)' },
  nina_came: { values: [0, 1], means: 'a key of the play: Nina came with him from the platform and sits down beside him' },
  vasya_end: { values: ['home', 'taiga'], means: 'a key of the play: Vasenka\'s rucksack — none · packed by the door' },
  hurt: { values: [0, 1], means: 'how Sarafanov takes the truth in confess: sits down and holds out his hand (0) · his back to the window (1); the game sets it before the beat' },
  heard: { values: [0, 1], means: 'Sarafanov heard the creak: in caught he already stands in the doorway (1); the game sets it before the beat' },
  lamp: { range: [0, 1], smooth: true, means: 'the lamp under the lampshade (a beat sets it: 0.6 + 0.4·warm; 0 — out)' },
  stove_door: { range: [0, 1], smooth: true, means: 'the stove door: 0 shut … 1 open, the fire seen' },
  door: { range: [0, 1], smooth: true, means: 'the front door: 0 shut … 1 open inward (on a spring)' },
  door_f: num('the turn of the front door, degrees — the script sets it by door'),
  sar_door: { range: [0, 1], smooth: true, means: 'the door to Sarafanov\'s room: 0.08 — always a little ajar … 1 open' },
  sar_door_f: num('the turn of Sarafanov\'s door, degrees — the script sets it by sar_door'),
  sar_light: { range: [0, 1], smooth: true, means: 'his lamp behind the door ajar: a wedge of light across the room, a strip on the kitchen floor by the doorway' },
  stir: { range: [0, 1], smooth: true, means: 'Sarafanov wakes (“On Tiptoe”): his lamp = stir' },
  box_at: { values: ['shelf', 'none', 'table', 'near'], means: 'the snuffbox: on the cupboard\'s shelf · nowhere (in a hand, a pocket) · on the oilcloth between them · on the oilcloth before Busygin' },
  coat_b: { values: ['none', 'hook', 'cot', 'arm', 'chair'], means: 'Busygin\'s coat: on him · on the hook · on the chair by the camp bed · over his arm · on the back of his chair' },
  rucksack: { values: ['none', 'chair', 'door'], means: 'Vasenka\'s rucksack: none · by his chair · packed by the door' },
  table_set: { values: [0, 1], means: 'the table laid (IV): plates, glasses for six, a bottle' },
  puddle: { values: [0, 1], means: 'a puddle of tea on the oilcloth (the trace of “Tea”)' },
  sheet_on: { values: [0, 1], means: 'a sheet of music written over, on the oilcloth' },
  kettle_at: { values: ['stove', 'table', 'pushed', 'none'], means: 'the kettle: on the stove · on the table by Sarafanov · pushed over to Busygin · in a hand' },
  glass_b: { values: ['none', 'table', 'hand'], means: 'Busygin\'s glass: none · on the oilcloth (the point table#glass) · in his hand' },
  glass_s: { values: ['none', 'table', 'hand'], means: 'Sarafanov\'s glass: none · on the oilcloth · in his hand' },
  hat_on_stool: { values: [0, 1], means: 'Sarafanov\'s hat on the stool by the door' },
  case_on: { values: [0, 1], means: 'the clarinet case on a chair in the room' },
  nina_coat: { values: [0, 1], means: 'Nina\'s coat on the hook (she is at home)' },
  far_train: { range: [0, 1], smooth: true, means: 'the electric train\'s lights go past beyond the window from left to right (the game moves it in “Frost”)' },
  far_train_x: num('where the far train is along the vegetable plots, metres — the script sets it by far_train'),
  father_x: num('where Sarafanov\'s small figure with the case is beyond the window (morning), metres'),
  father_on: { values: [0, 1], means: 'Sarafanov\'s figure beyond the window seen' },
  hole: { range: [0, 1], smooth: true, means: 'the hole rubbed in the frost (a circle in the glass\'s middle; the game moves it in “Frost”; the shader reads it)' },
  sneak: { range: [0, 1], smooth: true, means: 'where they creep to: the way through the kitchen from the stove (0) to the front door (1), the gait tiptoe (the game sets it)' },
  sneak_at: { range: [0, 1], means: 'where they are on this way now (the scene sets it 10 times a second)' },
  hands: { range: [0, 1], means: 'the insert “Hands” (the shot stove of the module closeups): 0 shut · 1 open' },
  thaw: { range: [0, 1], smooth: true, means: 'the insert “Hands”: the frost melts, the fingers straighten' },
  rub: { range: [-1, 1], smooth: true, means: 'the insert “Hands”: the palms slide over each other' },
  tea: { range: [0, 1], means: 'the insert “Tea” (the shot tea)' },
  which: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the kettle over the first → over the second glass' },
  pour: { values: [0, 1], means: 'the insert “Tea”: the stream' },
  glass1: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the level in the first glass' },
  glass2: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the level in the second glass' },
  spill: { values: [0, 1], means: 'the insert “Tea”: the tea runs over the brim' },
  shake: { values: [0, 1], means: 'the insert “Tea”: the spout trembles' },
  box: { range: [0, 1], means: 'the insert “The Snuffbox” (the shot box)' },
  box_mode: { values: ['take', 'give'], means: 'the insert “The Snuffbox”: take · give back' },
  ...Object.fromEntries([1, 2, 3, 4].map(i => [`finger${i}`, { range: [0, 1], smooth: true, means: `the insert “The Snuffbox” (take): the young hand's finger ${i} closes` }])),
  old: { range: [0, 1], smooth: true, means: 'the insert “The Snuffbox” (take): the old hand goes 1 → 0' },
  push: { range: [0, 1], smooth: true, means: 'the insert “The Snuffbox” (give): the snuffbox slides to the old hand' },
  old_close: { range: [0, 1], smooth: true, means: 'the insert “The Snuffbox” (give): the old fingers close on it' },
  ...Object.fromEntries(L.PEOPLE.flatMap(p => [[`${p}_a`, num(`where ${L.NAMES[p]} is: metres to the right`)], [`${p}_d`, num(`where ${L.NAMES[p]} is: metres inward`)]])),
};

const scene = {
  engine: 3,
  title: 'The Sarafanovs\' house',
  caption: 'The kitchen under an orange lampshade.',
  horizon: 0.52,
  camera: { mode: 'roam', area: [-1.9, 5.9, 0.1, 3.9] },
  modules: ['cast', 'beats', 'closeups'],
  light: {
    tint: '#8a8fb0', tintStrength: 0.04, vignette: 0.45, grain: 0.2,
    haze: 0.03, hazeColor: '#3a3036', hazeGlow: 0.45, shafts: 0,
    brightness: 1.08, saturation: 0.78, ambient: 0.62, ambientColor: '#a9afc2', bounce: 0.45, inside: 0.3,
    looks: { hour: { ambient: 0.5, ambientColor: '#8b93b8', saturation: 0.84 } },
  },
  lights: [
    // the lamp's light a warm yellow-white; the orange is the shade's own (it glows)
    { id: 'lamp', of: 'lampshade#lamp', color: '#f1c587', strength: 1.7, reach: 4.2, on: 'lamp' },
    { id: 'fire', of: 'stove#fire', color: '#e47a32', strength: 1.4, reach: 2.4, flicker: 0.5, on: 'stove_door' },
    { id: 'snow_light', of: 'window', daylight: 0.9 },
    // his lamp beyond his door ajar: the wedge across the room, on through the doorway onto the kitchen's floor
    { id: 'sar_light', of: 'sar_room#lamp', color: '#efb877', strength: 1.6, reach: 7, on: 'sar_light' },
    // a little light in the room from the street, so the cupboard, the cot, the sofa are seen
    { id: 'room_light', across: 4.6, distance: 1.6, elevation: 2.0, color: '#c3b8a4', strength: 0.45, reach: 3.6 },
    { id: 'night', from: [0, 30], color: '#8d9cc8', strength: 0.35 },
  ],
  state,
  states,
  objects,
  music: {
    prompts: [
      { text: 'Very quiet warm room tone, a clock ticking softly, a stove crackling, no melody', weight: 1.2 },
      { text: 'Soft low string pad, tender and uneasy, late night in a small kitchen', weight: 0.5 },
      { text: 'Slow solo piano, few notes, Soviet film score, warm and sad', weight: 0 },
      { text: 'Muted felt piano lullaby, 1970s Russian chamber music', weight: 0 },
      { text: 'Cello long notes, quiet, intimate, a father and a son', weight: 0 },
      { text: 'Warm low organ hum like lamplight, very soft', weight: 0 },
      { text: 'Glassy harmonics like frost on a window, very slow', weight: 0 },
      { text: 'Distant train passing far away, low rumble as texture', weight: 0 },
      { text: 'Faint accordion through the wall, nostalgic', weight: 0 },
      { text: 'Minimal ambient with soft bells, still', weight: 0 },
      { text: 'Celesta and strings, a winter tale, very slow', weight: 0 },
      { text: 'Gentle guitar arpeggios, sparse, restrained', weight: 0 },
      { text: 'Quiet tension pulse, a secret at the table', weight: 0 },
      { text: 'Wordless hum, far away, cold outside, warm inside', weight: 0 },
      { text: 'Soft brushed snare and double bass, slow night jazz, muffled', weight: 0 },
    ],
    bpm: 60, density: 0.12, brightness: 0.3,
    scale: 'A_FLAT_MAJOR_F_MINOR',
  },
};
writeFileSync(`${DIR}/scene.json`, `${JSON.stringify(scene, null, 2)}\n`);
console.log('objects', objects.length, 'beats', BEATS.length);
