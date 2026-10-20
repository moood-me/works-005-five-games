// Writes scenes/home/scene.json from the scene's lib (the plan, the furniture, the seats, the keys) — the elements' code
// is in scenes/home/elements/<id>.js (.animate.js, .wgsl).
// node tools/home/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'scenes/home';
const cast = new Function('data', 'anim', 'kit', 'MooodShapes', readFileSync('modules/cast.js', 'utf8'))({ motions: {} }, {}, {}, { V: {} });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, { cast });
const { A, H } = L;
const objects = [];
const add = o => (objects.push(o), o);
const wallBox = w => [-w / 2 - 0.02, -H - 0.02, w / 2 + 0.02, 0.02];
const SAR = { shadow: { light: 'sar_light' } };   // the kitchen's right wall: its doorway shapes his lamp's light on the kitchen floor
const ROOM_SIDE = 2.02;                           // the room's face of the kitchen's right wall (across)

// ── outside the window: the night (or the dawn) over the gardens under snow, the far platform, the far train, the
// old man going off across them in the morning; snow falling beyond the glass ──
add({ id: 'sky', name: 'Sky', sky: true });
add({ id: 'outside', name: 'Vegetable plots', across: A(L.WINDOW.x), distance: 30, facing: 180, height: 9, box: [-40, -9, 40, 0.3] });
add({ id: 'yard', name: 'Snow', plane: true, across: A(L.WINDOW.x), distance: 18, elevation: 0, width: 80, depth: 27 });
add({ id: 'far_train', name: 'Electric train', glows: true, across: L.FAR_TRAIN.from, distance: L.FAR_TRAIN.z, facing: 180, place: { across: 'far_train_x' },
  height: 1.4, box: [-7.3, -1.5, 7.3, 0.1] });
add({ id: 'father_far', name: 'Sarafanov far off', across: L.FATHER_FAR.from, distance: L.FATHER_FAR.z, facing: 180, place: { across: 'father_x' },
  height: 1.7, box: [-0.5, -1.75, 0.6, 0.05] });
add({ id: 'snow', name: 'Snow falling', particles: { kind: 'snow', count: 1500, area: [-30, 34, 4.4, 40] } });

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
{
  const D = L.DOORWAY, top = [-(D.z1 - D.z0) / 2 - 0.02, -(H - D.h) - 0.02, (D.z1 - D.z0) / 2 + 0.02, 0.02];
  add({ id: 'k_right_a', name: 'Kitchen', inside: true, ...SAR, across: 2, distance: D.z0 / 2, facing: 270, height: H, box: wallBox(D.z0) });
  add({ id: 'k_right_b', name: 'Kitchen', inside: true, ...SAR, across: 2, distance: (D.z1 + 4) / 2, facing: 270, height: H, box: wallBox(4 - D.z1) });
  add({ id: 'k_lintel', name: 'Kitchen', inside: true, ...SAR, across: 2, distance: (D.z0 + D.z1) / 2, elevation: D.h, facing: 270, height: H - D.h, box: top });
  // the same wall from the room: wallpaper
  add({ id: 'r_left_a', name: 'Room', inside: true, across: ROOM_SIDE, distance: D.z0 / 2, facing: 90, height: H, box: wallBox(D.z0) });
  add({ id: 'r_left_b', name: 'Room', inside: true, across: ROOM_SIDE, distance: (D.z1 + 4) / 2, facing: 90, height: H, box: wallBox(4 - D.z1) });
  add({ id: 'r_lintel', name: 'Room', inside: true, across: ROOM_SIDE, distance: (D.z0 + D.z1) / 2, elevation: D.h, facing: 90, height: H - D.h, box: top });
}
add({ id: 'r_back', name: 'Room', inside: true, across: 4, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'r_right', name: 'Room', inside: true, across: 6, distance: 2, facing: 270, height: H, box: wallBox(4) });
add({ id: 'r_near', name: 'Room', inside: true, across: 4, distance: 0, facing: 0, height: H, box: wallBox(4) });
add({ id: 'hall', name: 'Passage', inside: true, across: A(L.DOOR.x), distance: -1.6, facing: 0, height: 2.4, box: [-1.45, -2.45, 1.45, 0.05] });
// beyond Sarafanov's door: his room, dim (lit by his lamp's light when it burns)
add({ id: 'sar_room', name: 'Sarafanov\'s room', inside: true, across: 6.7, distance: 3.5, facing: 270, height: 2.4,
  box: [-0.9, -2.45, 0.9, 0.05] });

// ── the window, the doors ──
{
  const W = L.WINDOW;
  add({ id: 'window', name: 'Window', inside: true, translucent: 0.6, across: A(W.x), distance: 3.985, elevation: W.sill, facing: 180,
    height: W.h, box: [-W.w / 2 - 0.01, -W.h - 0.01, W.w / 2 + 0.01, 0.01], uniforms: { hole: 0 } });
  add({ id: 'window_frame', name: 'Window', inside: true, across: A(W.x), distance: 3.96, elevation: W.sill, facing: 180, height: W.h,
    box: [-W.w / 2 - 0.3, -W.h - 0.2, W.w / 2 + 0.3, 0.04] });
  add({ id: 'sill', name: 'Window sill', plane: true, inside: true, across: A(W.x), distance: 3.88, elevation: W.sill, width: W.w + 0.3, depth: 0.24 });
}
add({ id: 'door', name: 'Door', inside: true, across: A(L.DOOR.x) + L.DOOR.w / 2, distance: 0.03, facing: 0, place: { facing: 'door_f' },
  height: L.DOOR.h, box: [-0.05, -L.DOOR.h - 0.05, L.DOOR.w + 0.05, 0.05] });
add({ id: 'sar_door', name: 'Sarafanov\'s door', inside: true, across: 6 - 0.03, distance: L.SAR_DOOR.z0, facing: 270, place: { facing: 'sar_door_f' },
  height: 2.0, box: [-(L.SAR_DOOR.z1 - L.SAR_DOOR.z0) - 0.05, -2.05, 0.05, 0.05] });

// ── the kitchen's things ──
add({ id: 'stove', name: 'Stove', inside: true, across: A(L.STOVE.front), distance: (L.STOVE.z0 + L.STOVE.z1) / 2, facing: 90, height: L.STOVE.h,
  box: [-0.62, -H - 0.02, 0.62, 0.03] });
{
  const a = (A(L.STOVE.front) - 2) / 2;
  add({ id: 'stove_side', name: 'Stove', inside: true, across: a, distance: L.STOVE.z0, facing: 180, height: L.STOVE.h, box: [-0.4, -L.STOVE.h - 0.05, 0.4, 0.03],
    copies: [{ across: a, distance: L.STOVE.z0, facing: 180 }, { across: a, distance: L.STOVE.z1, facing: 0, flip: true }] });
}
{
  const T = L.TABLE, cx = A((T.x0 + T.x1) / 2), cz = (T.z0 + T.z1) / 2, w = T.x1 - T.x0, d = T.z1 - T.z0, top = L.TOP;
  add({ id: 'table', name: 'Table', plane: true, inside: true, across: cx, distance: cz, elevation: T.h, width: w, depth: d, shadow: { light: 'lamp', onto: [] } });
  add({ id: 'table_end', name: 'Table', inside: true, across: cx, distance: T.z0, facing: 180, height: T.h, box: [-w / 2 - 0.04, -T.h - 0.03, w / 2 + 0.04, 0.03],
    copies: [{ across: cx, distance: T.z0, facing: 180 }, { across: cx, distance: T.z1, facing: 0 }] });
  add({ id: 'table_side', name: 'Table', inside: true, across: A(T.x0), distance: cz, facing: 270, height: T.h, box: [-d / 2 - 0.04, -T.h - 0.03, d / 2 + 0.04, 0.03],
    copies: [{ across: A(T.x0), distance: cz, facing: 270 }, { across: A(T.x1), distance: cz, facing: 90 }] });
  // what stands on the oilcloth (each where its key puts it; the flat things are the table's own painting)
  const on = ([x, z], o) => add({ inside: true, across: A(x), distance: z, elevation: top, ...o });
  on(L.ON.glass_b, { id: 'glass_b', name: 'Glass', height: 0.12, box: [-0.07, -0.13, 0.07, 0.01] });
  on(L.ON.glass_s, { id: 'glass_s', name: 'Glass', height: 0.12, box: [-0.07, -0.13, 0.07, 0.01] });
  on([(L.ON.kettle[0] + L.ON.kettle_pushed[0]) / 2, (L.ON.kettle[1] + L.ON.kettle_pushed[1]) / 2], { id: 'kettle', name: 'Kettle', height: 0.24,
    box: [-0.3, -0.28, 0.4, 0.01] });
  on(L.ON.bread, { id: 'bread', name: 'Bread bin', height: 0.18, box: [-0.2, -0.2, 0.2, 0.01] });
  on(L.ON.bottle, { id: 'bottle', name: 'Bottle', height: 0.32, box: [-0.16, -0.34, 0.16, 0.01] });
  add({ id: 'set_glass', name: 'Glass', inside: true, across: A(L.SET_GLASS[0][0]), distance: L.SET_GLASS[0][1], elevation: top, height: 0.12,
    box: [-0.05, -0.13, 0.05, 0.01], copies: L.SET_GLASS.map(([x, z]) => ({ across: A(x), distance: z, elevation: top })) });
}
// the orange lampshade: a dome turned on a lathe (a form, seen from below and from every side); its cord to the ceiling
add({ id: 'lampshade', name: 'Lampshade', inside: true, glows: true, across: A(L.LAMP[0]), distance: L.LAMP[1], elevation: L.SHADE, height: 0.34,
  box: [-0.8, -0.46, 0.8, 0] });
add({ id: 'lamp_cord', name: 'Lampshade', inside: true, across: A(L.LAMP[0]), distance: L.LAMP[1], elevation: L.SHADE + 0.3, height: H - L.SHADE - 0.3,
  box: [-0.03, -(H - L.SHADE - 0.3) - 0.02, 0.03, 0.02] });
add({ id: 'chairs', name: 'Chair', inside: true, across: A(L.SEATS.L1[0]), distance: L.SEATS.L1[1], facing: 180, height: 0.95, box: [-0.3, -1.0, 0.3, 0.03],
  copies: Object.values(L.SEATS).map(([x, z, turn]) => ({ across: A(x), distance: z, facing: 180, flip: turn === 270 })) });
add({ id: 'chair_backs', name: 'Chair', inside: true, across: A(L.SEATS.L1[0] - L.CHAIR_BACK), distance: L.SEATS.L1[1], facing: 90, height: 0.95,
  box: [-0.24, -1.0, 0.24, 0.03],
  copies: Object.values(L.SEATS).map(([x, z, turn]) => ({ across: A(turn === 90 ? x - L.CHAIR_BACK : x + L.CHAIR_BACK), distance: z, facing: turn === 90 ? 90 : 270 })) });
add({ id: 'clock', name: 'Clock', inside: true, across: -2 + 0.03, distance: L.CLOCK.z, elevation: L.CLOCK.face - 0.74, facing: 90, height: 0.9, box: [-0.2, -0.95, 0.2, 0.05] });
add({ id: 'hook', name: 'Hooks', inside: true, across: A(L.HOOK[0]), distance: L.HOOK[1], elevation: 0, facing: 0, height: 1.9, box: [-0.3, -1.9, 0.3, 0.03] });
add({ id: 'stool', name: 'Stool', inside: true, across: A(L.STOOL[0]), distance: L.STOOL[1], facing: 180, height: 0.7, box: [-0.25, -0.7, 0.25, 0.03] });
add({ id: 'rucksack', name: 'Rucksack', inside: true, across: A(L.RUCKSACK.chair[0]), distance: L.RUCKSACK.chair[1], facing: 180, height: 0.6, box: [-0.3, -0.7, 0.3, 0.03] });
add({ id: 'rucksack_door', name: 'Rucksack', inside: true, across: A(L.RUCKSACK.door[0]), distance: L.RUCKSACK.door[1], facing: 180, height: 0.6, box: [-0.3, -0.7, 0.3, 0.03] });
add({ id: 'coat_chair', name: 'Coat', inside: true, across: A(L.SEATS.R1[0] + L.CHAIR_BACK), distance: L.SEATS.R1[1], facing: 180, height: 1.0, box: [-0.3, -1.05, 0.3, 0.03] });

// ── the room's things ──
add({ id: 'cupboard', name: 'Cupboard', inside: true, across: A(L.CUPBOARD.x), distance: L.CUPBOARD.z, facing: 0, height: L.CUPBOARD.h,
  box: [-L.CUPBOARD.w / 2 - 0.05, -L.CUPBOARD.h - 0.05, L.CUPBOARD.w / 2 + 0.05, 0.03] });
{
  const S = L.SOFA, cx = A((S.x0 + S.x1) / 2), w = S.x1 - S.x0;
  add({ id: 'sofa', name: 'Sofa', inside: true, across: cx, distance: S.back, facing: 180, height: 0.95, box: [-w / 2 - 0.05, -0.98, w / 2 + 0.05, 0.03] });
  add({ id: 'sofa_front', name: 'Sofa', inside: true, across: cx, distance: S.front, facing: 180, height: S.top, box: [-w / 2 - 0.05, -S.top - 0.03, w / 2 + 0.05, 0.03] });
  add({ id: 'sofa_arm', name: 'Sofa', inside: true, across: A(S.x0), distance: (S.front + S.back) / 2, facing: 270, height: 0.62,
    box: [-(S.back - S.front) / 2 - 0.04, -0.66, (S.back - S.front) / 2 + 0.04, 0.03],
    copies: [{ across: A(S.x0), distance: (S.front + S.back) / 2, facing: 270 }, { across: A(S.x1), distance: (S.front + S.back) / 2, facing: 90 }] });
  add({ id: 'sofa_top', name: 'Sofa', plane: true, inside: true, across: cx, distance: (S.front + S.back) / 2, elevation: S.top, width: w, depth: S.back - S.front });
}
{
  const C = L.COT, cz = (C.z0 + C.z1) / 2, len = C.z1 - C.z0;
  add({ id: 'cot', name: 'Camp bed', inside: true, across: A(C.x + C.w / 2), distance: cz, facing: 90, height: 0.5, box: [-len / 2 - 0.05, -0.6, len / 2 + 0.05, 0.03] });
  add({ id: 'cot_end', name: 'Camp bed', inside: true, across: A(C.x), distance: C.z0, facing: 180, height: 0.5, box: [-C.w / 2 - 0.04, -0.55, C.w / 2 + 0.04, 0.03],
    copies: [{ across: A(C.x), distance: C.z0, facing: 180 }, { across: A(C.x), distance: C.z1, facing: 0 }] });
  add({ id: 'cot_top', name: 'Camp bed', plane: true, inside: true, across: A(C.x), distance: cz, elevation: C.top, width: C.w, depth: len });
}
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
const party = { warm: 4 / 11, frost: 0.25, box_where: 'cupboard', vasenka_by: 0, silva_door: 1, father_came: 1, nina_came: 0, vasya_came: 0, nina_end: 'gone', nina_for: 0, vasya_end: 'taiga' };
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
  father_came: { values: [0, 1], means: 'a key of the play: Sarafanov came to the platform and comes home with him (home_late, home_anyway)' },
  vasya_came: { values: [0, 1], means: 'a key of the play: Vasenka came to the platform and comes home with him (home_late, home_anyway)' },
  nina_end: { values: ['home', 'gone'], means: 'a key of the play: Nina at home in the ending · gone (the chair empty, her coat not on the hook)' },
  nina_came: { values: [0, 1], means: 'a key of the play: Nina came to the platform — with him home if she stays (nina_end home), else her chair empty' },
  nina_for: { values: [0, 1], means: 'a key of the play: Nina stays for him (“Not for Father’s sake”): she sits down beside him at the end' },
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
  hole: { range: [0, 1], smooth: true, means: 'the hole rubbed in the frost (a circle in the glass\'s lower right pane; the game moves it in “Frost”; the shader reads it)' },
  sneak: { range: [0, 1], smooth: true, means: 'where they creep to: the way through the kitchen from the stove (0) to the front door (1), the gait tiptoe (the game sets it)' },
  sneak_at: { range: [0, 1], means: 'where Busygin is on this way now (the scene sets it as he goes)' },
  hands: { range: [0, 1], means: 'the insert “Hands” (the shot stove of the module closeups): 0 shut · 1 open' },
  thaw: { range: [0, 1], smooth: true, means: 'the insert “Hands”: the frost melts, the fingers straighten' },
  rub: { range: [-1, 1], smooth: true, means: 'the insert “Hands”: the palms slide over each other' },
  tea: { range: [0, 1], means: 'the insert “Tea” (the shot tea)' },
  which: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the kettle over the first → over the second glass' },
  pour: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the stream' },
  glass1: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the level in the first glass' },
  glass2: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the level in the second glass' },
  spill: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the tea runs over the brim' },
  shake: { range: [0, 1], smooth: true, means: 'the insert “Tea”: the spout trembles' },
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
  title: 'The Sarafanovs\' Home',
  caption: 'The kitchen under an orange lampshade.',
  horizon: 0.52,
  camera: { mode: 'roam', area: [-1.9, 5.9, 0.1, 3.9] },
  modules: ['cast', 'beats', 'closeups'],
  light: {
    tint: '#8a8fb0', tintStrength: 0.04, vignette: 0.4, grain: 0.18,
    haze: 0.03, hazeColor: '#3a3036', hazeGlow: 0.45, shafts: 0,
    // the state with no night in it (hour 0) is the grey dawn; `hour` turns it to the night
    brightness: 1.1, saturation: 0.8, ambient: 0.64, ambientColor: '#b4b8c4', bounce: 0.5, inside: 0.3,
    looks: { hour: { ambient: 0.54, ambientColor: '#9198b8', saturation: 0.84, lights: { night: 0.55, room_light: 0.7 } } },
  },
  lights: [
    // the lamp's light a warm yellow-white under the shade; the orange is the shade's own (it glows)
    { id: 'lamp', across: A(L.LAMP[0]), distance: L.LAMP[1], elevation: L.LAMP[2], color: '#f1c587', strength: 1.7, reach: 4.2, on: 'lamp', glow: 0.3 },
    { id: 'fire', of: 'stove#fire', color: '#e47a32', strength: 1.4, reach: 2.4, flicker: 0.5, on: 'stove_door' },
    { id: 'snow_light', of: 'window', daylight: 0.9 },
    // his lamp beyond his door ajar, its light come through the gap: the sofa's right end, through the doorway onto the kitchen's floor
    { id: 'sar_light', across: A(L.SAR_LAMP[0]), distance: L.SAR_LAMP[1], elevation: L.SAR_LAMP[2], color: '#efb877', strength: 1.5, reach: 5.5, on: 'sar_light', glow: 0.2 },
    // a little light in the room (from the street, at dawn the grey morning), so the cupboard, the cot, the sofa are seen
    { id: 'room_light', across: A(4.7), distance: 1.6, elevation: 2.0, color: '#c3bcae', strength: 0.65, reach: 3.8 },
    { id: 'night', from: [0, 30], color: '#9aa6c8', strength: 0.6 },
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
