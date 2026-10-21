// Writes scenes/street/scene.json and the houses' element files from the scene's lib (where everything stands).
// node tools/street/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/street';
mkdirSync(`${DIR}/elements`, { recursive: true });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const W = L.END.walk();   // the first pose a viewer sees: the end of `walk`
const r2 = v => Math.round(v * 100) / 100;
const file = (id, text) => writeFileSync(`${DIR}/elements/${id}.js`, text);

const objects = [];
const add = o => (objects.push(o), o);

add({ id: 'sky', name: 'Sky', sky: true });
add({ id: 'ground', name: 'The Street', plane: true, drape: true, across: 0, distance: 20, elevation: 0, width: 150, depth: 90 });
add({ id: 'far', name: 'Far yards', across: 4, distance: 32, facing: 180, height: 13, box: [-75, -13, 75, 0.5] });

// the houses: an unseen anchor each, its long wall, its roof's near slope, its two ends; their panes
const PANES = [];
for (const h of L.HOUSES) {
  add({ id: h.id, name: 'House', unseen: true, across: h.a, distance: h.d, facing: 180 });
  const wallTop = L.PLINTH + L.WALL_H;
  add({ id: `${h.id}_wall`, name: h.id === 'sar' ? 'The Sarafanovs\' house' : h.id === 'mak' ? 'Makarskaya\'s house' : 'House', on: h.id, facing: 180,
    height: wallTop, box: [-h.w / 2 - 0.5, -wallTop - 0.5, h.w / 2 + 0.5, 0.15] });
  file(`${h.id}_wall`, `// the house's long wall on the street, its openings cut through (panes, the kitchen, the door behind them)\n` +
    `e.kit.houses.wall(g, e, ${JSON.stringify({ w: h.w, h: L.WALL_H, plinth: L.PLINTH, color: h.color, windows: h.windows.map(({ x, w, h: wh, sill }) => ({ x, w, h: wh, sill })), door: h.door || null })});\n`);
  const run = h.deep / 2 + 0.45, slope = Math.hypot(run, L.RISE), tilt = (Math.atan2(L.RISE, run) * 180) / Math.PI;
  add({ id: `${h.id}_roof`, name: 'Roof', plane: true, on: h.id, across: 0, distance: r2(run / 2 - 0.45), elevation: r2(wallTop + L.RISE / 2),
    width: h.w + 1.0, depth: r2(slope), tilt: r2(tilt) });
  file(`${h.id}_roof`, `e.kit.houses.roof(g, e, { w: ${h.w + 1.0}, d: ${r2(slope)}${h.id === 'sar' ? ', chimney: -1.6' : ''} });\n`);
  for (const side of [-1, 1]) {
    const id = `${h.id}_end${side < 0 ? 'l' : 'r'}`;
    add({ id, name: 'House', on: h.id, across: (side * h.w) / 2, distance: h.deep / 2, facing: side < 0 ? 270 : 90,
      height: wallTop + L.RISE, box: [-h.deep / 2 - 0.6, -wallTop - L.RISE - 0.4, h.deep / 2 + 0.6, 0.15] });
    file(id, `e.kit.houses.gable(g, e, { d: ${h.deep}, h: ${L.WALL_H}, plinth: ${L.PLINTH}, rise: ${L.RISE}, color: '${h.color}' });\n`);
  }
  for (const w of h.windows) if (w.pane) PANES.push({ house: h, w });
}
// (the panes the game lights by their keys; the others stay dark)
const KEYED = ['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'];
for (const { house, w } of PANES) {
  const keyed = KEYED.includes(w.pane);
  add({ id: w.pane, name: 'Window', on: house.id, across: w.x, distance: 0.05, elevation: w.sill, facing: 180, glows: keyed,
    height: w.h, box: [-w.w / 2 - 0.06, -w.h - 0.06, w.w / 2 + 0.06, 0.06] });
  file(w.pane, `e.kit.houses.pane(g, e, { w: ${w.w}, h: ${w.h}${keyed ? '' : ', dark: true'} });\n`);
  if (keyed) writeFileSync(`${DIR}/elements/${w.pane}.animate.js`, `e.lib.paneLive(e);\n`);
}

// the Sarafanovs': the kitchen behind its window (a 3 × 3 m room, its floor as high as the plinth), the hall behind the door
const S = L.HOUSES.find(h => h.id === 'sar');
const K = L.KITCHEN, KW = L.KITCHEN_WIN;
add({ id: 'kitchen', name: 'Kitchen window', on: 'sar', across: r2(KW.a - S.a), distance: 0.04, elevation: KW.sill, facing: 180, glows: true,
  height: KW.h, box: [-KW.w / 2 - 0.08, -KW.h - 0.08, KW.w / 2 + 0.08, 0.08] });
add({ id: 'k_floor', name: 'Floor', plane: true, unseen: true, walk: true, across: r2((K.a0 + 26.0) / 2), distance: (K.d0 + K.d1) / 2,
  elevation: L.PLINTH, width: r2(26.0 - K.a0), depth: K.d1 - K.d0 });
add({ id: 'k_back', name: 'Kitchen', inside: true, across: r2((K.a0 + K.a1) / 2), distance: K.d1, elevation: L.PLINTH, facing: 180,
  height: 2.5, box: [-1.6, -2.6, 1.6, 0.05] });
add({ id: 'k_left', name: 'Kitchen', inside: true, across: K.a0, distance: (K.d0 + K.d1) / 2, elevation: L.PLINTH, facing: 90,
  height: 2.5, box: [-1.6, -2.6, 1.6, 0.05] });
add({ id: 'k_right', name: 'Kitchen', inside: true, across: K.a1, distance: (K.d0 + K.d1) / 2, elevation: L.PLINTH, facing: 270,
  height: 2.5, box: [-1.6, -2.6, 1.6, 0.05] });
add({ id: 'stove', name: 'Stove', inside: true, across: L.STOVE.a, distance: L.STOVE.d, elevation: L.PLINTH, facing: 180,
  height: 2.1, box: [-0.75, -2.15, 0.75, 0.05] });
add({ id: 'table', name: 'Table', inside: true, across: L.TABLE.a, distance: r2(L.TABLE.d - L.TABLE.depth / 2), elevation: L.PLINTH, facing: 180,
  height: 0.78, box: [-0.75, -0.8, 0.75, 0.05] });
add({ id: 'table_top', name: 'Table', plane: true, inside: true, across: L.TABLE.a, distance: L.TABLE.d, elevation: r2(L.PLINTH + 0.76),
  width: L.TABLE.w, depth: L.TABLE.depth, shadow: { light: 'lamp', onto: [] } });
add({ id: 'lampshade', name: 'Lampshade', inside: true, glows: true, across: L.LAMP[0], distance: L.LAMP[1], elevation: L.LAMP[2], height: 0.5, box: [-0.4, -0.9, 0.4, 0.12] });
add({ id: 'hall', name: 'Passage', inside: true, glows: true, across: L.DOOR.a, distance: 13.4, elevation: L.PLINTH, facing: 180, height: 2.4, box: [-1.3, -2.45, 1.3, 0.05] });
add({ id: 'door', name: 'Door', on: 'sar', across: r2(L.DOOR.a - S.a - L.DOOR.w / 2), distance: 0.03, elevation: L.PLINTH, facing: 180,
  place: { facing: 'door_f' }, height: L.DOOR.h, box: [-0.05, -L.DOOR.h - 0.05, L.DOOR.w + 0.05, 0.05], shadow: true });
add({ id: 'porch', name: 'Porch', across: L.DOOR.a, distance: L.PORCH.d0, facing: 180, height: 3.3, box: [-1.0, -3.4, 1.0, 0.1] });
add({ id: 'porch_floor', name: 'Porch', plane: true, walk: true, across: L.DOOR.a, distance: r2((L.PORCH.d0 + L.PORCH.d1) / 2), elevation: L.PLINTH,
  width: r2(L.PORCH.a1 - L.PORCH.a0), depth: r2(L.PORCH.d1 - L.PORCH.d0) });
{
  const run = L.PORCH.d0 - L.PORCH.steps;
  add({ id: 'porch_steps', name: 'Steps', plane: true, walk: true, across: L.DOOR.a, distance: r2((L.PORCH.d0 + L.PORCH.steps) / 2), elevation: r2(L.PLINTH / 2),
    width: 1.2, depth: r2(Math.hypot(run, L.PLINTH)), tilt: r2((Math.atan2(L.PLINTH, run) * 180) / Math.PI) });
}
add({ id: 'porch_bulb', name: 'Bulb over the porch', glows: true, across: L.DOOR.a, distance: 11.9, elevation: 2.62, height: 0.3, box: [-0.15, -0.3, 0.15, 0.05] });

// Makarskaya: her door's leaf, the dark behind it
const M = L.HOUSES.find(h => h.id === 'mak');
add({ id: 'mak_hall', name: 'Passage', inside: true, glows: true, across: L.MAK_DOOR.a, distance: 13.6, elevation: L.PLINTH, facing: 180, height: 2.4, box: [-1.0, -2.45, 1.0, 0.05] });
add({ id: 'mak_door', name: 'Makarskaya\'s door', on: 'mak', across: r2(L.MAK_DOOR.a - M.a - L.MAK_DOOR.w / 2), distance: 0.03, elevation: L.PLINTH, facing: 180,
  place: { facing: 'mak_door_f' }, height: L.MAK_DOOR.h, box: [-0.05, -L.MAK_DOOR.h - 0.05, L.MAK_DOOR.w + 0.05, 0.05] });

// the neighbours' door (h3): its leaf, the dim hall behind it
const H3 = L.HOUSES.find(h => h.id === 'h3');
add({ id: 'nb_hall', name: 'Passage', inside: true, glows: true, across: L.NB_DOOR.a, distance: 14.6, elevation: L.PLINTH, facing: 180, height: 2.4, box: [-1.0, -2.45, 1.0, 0.05] });
add({ id: 'nb_door', name: 'Neighbours\' door', on: 'h3', across: r2(L.NB_DOOR.a - H3.a - L.NB_DOOR.w / 2), distance: 0.03, elevation: L.PLINTH, facing: 180,
  place: { facing: 'nb_door_f' }, height: L.NB_DOOR.h, box: [-0.05, -L.NB_DOOR.h - 0.05, L.NB_DOOR.w + 0.05, 0.05] });

// fences, the shed, the barrel, the bench, the woodpile, the lamps, birches
const SF = L.SAR_FENCE, SD = L.SIDE_FENCE;
add({ id: 'sar_fence', name: 'Front garden', across: SF.a, distance: SF.d, facing: 180, height: 1.2, box: [-0.1, -1.4, SF.len + 0.1, 0.2] });
file('sar_fence', `e.kit.houses.fence(g, e, ${SF.len}, 1.15, { gaps: [${JSON.stringify(SF.gate)}] });\n`);
add({ id: 'side_fence', name: 'Fence', across: SD.a, distance: SD.d, facing: 90, height: 1.2, box: [-0.1, -1.4, SD.len + 0.1, 0.2] });
file('side_fence', `e.kit.houses.fence(g, e, ${SD.len}, 1.1, { gaps: ${JSON.stringify(SD.gates)} });\n`);
// short runs of fence between the far houses: one 2.2 m painting, its copies side by side
add({ id: 'fences', name: 'Fence', across: -21.9, distance: 14, facing: 180, height: 1.2, box: [-0.1, -1.4, 2.3, 0.2], copies: [
  { across: -21.9, distance: 14 }, { across: -19.7, distance: 14 }, { across: -17.5, distance: 14 }, { across: 5.1, distance: 14.05 },
  { across: 14.05, distance: 13.9 }, { across: 38.6, distance: 13.1 }, { across: 40.8, distance: 13.1 },
] });
file('fences', `e.kit.houses.fence(g, e, 2.2, 1.15);
`);
add({ id: 'near_fence', name: 'Fence', across: -34, distance: -7.9, facing: 180, height: 1.1, box: [-0.1, -1.3, 12.1, 0.2], copies: [
  { across: -34, distance: -7.9 }, { across: -22, distance: -7.8 }, { across: -10, distance: -7.9 }, { across: 2, distance: -7.8 },
  { across: 14, distance: -7.9 }, { across: 26, distance: -7.8 }, { across: 38, distance: -7.9 },
] });
file('near_fence', `e.kit.houses.fence(g, e, 12, 1.0);\n`);
add({ id: 'shed', name: 'Shed', across: L.SHED.a, distance: L.SHED.d, facing: 180, height: L.SHED.h, box: [-L.SHED.w / 2 - 0.35, -L.SHED.h - 1.3, L.SHED.w / 2 + 0.35, 0.15], shadow: true, flicker: 0.5 });
file('shed', `// Makarskaya's shed: its fire by \`fire\` (layers: the window's glow, the tongues under the eaves — shedLive); after the
// fire by \`shed_left\` (the game sets it before \`after_fire\`): 1 — scorched, its roof whole; 0 — black walls, no roof.
// Before the fire — whole.
e.kit.houses.shed(g, e, { w: ${L.SHED.w}, h: ${L.SHED.h}, fire: true, burnt: e.state.shed_burnt ? (e.state.shed_left === 0 ? 2 : 1) : 0 });
`);
writeFileSync(`${DIR}/elements/shed.animate.js`, `e.lib.shedLive(e);\n`);
add({ id: 'shed_side', name: 'Shed', across: r2(L.SHED.a + L.SHED.w / 2), distance: r2(L.SHED.d + L.SHED.deep / 2), facing: 90, height: L.SHED.h, box: [-1.1, -L.SHED.h - 0.3, 1.1, 0.15] });
add({ id: 'barrel', name: 'Barrel', across: L.BARREL[0], distance: L.BARREL[1], height: 0.95, box: [-0.5, -1.0, 0.5, 0.1] });
file('barrel', `e.kit.houses.barrel(g, e);\ne.at(0, -0.6);\n`);
add({ id: 'bench', name: 'Bench', across: L.BENCH[0], distance: L.BENCH[1], facing: 180, height: 0.5, box: [-0.85, -0.55, 0.85, 0.05] });
file('bench', `e.kit.houses.bench(g, e);\n`);
add({ id: 'woodpile', name: 'Woodpile', across: L.WOODPILE[0], distance: L.WOODPILE[1], facing: 180, height: 1.3, box: [-0.95, -1.4, 0.95, 0.1] });
file('woodpile', `e.kit.houses.woodpile(g, e, 1.7);\n`);
// the suitcase by the kitchen window, on a stool, in the light (the epilogue's \`suitcase\` ending; a party key)
add({ id: 'suitcase', name: 'Suitcase', inside: true, across: 22.75, distance: 12.4, elevation: r2(L.PLINTH + 0.5), facing: 180, height: 0.5, box: [-0.4, -0.5, 0.4, 0.55] });
add({ id: 'gate_lamp', name: 'Lamp by the gate', across: L.GATE_LAMP[0], distance: L.GATE_LAMP[1], height: 2.9, box: [-0.2, -3.0, 0.8, 0.05] });
file('gate_lamp', `e.kit.houses.lamp(g, e, 2.6);\n`);
add({ id: 'street_lamp', name: 'Street lamp', across: L.STREET_LAMP[0], distance: L.STREET_LAMP[1], height: 3.9, box: [-0.2, -4.0, 0.8, 0.05] });
file('street_lamp', `e.kit.houses.lamp(g, e, 3.6);\n`);
add({ id: 'birches', name: 'Birches', across: -19.5, distance: 16, height: 11, box: [-4.5, -13.6, 4.5, 0.3], copies: [
  { across: -19.5, distance: 16.5 }, { across: 6.1, distance: 17, scale: 0.85, flip: true }, { across: 15.2, distance: 15.5, scale: 1.1 },
  { across: 41, distance: 15, flip: true }, { across: -28, distance: 13 , scale: 0.8 }, { across: -15, distance: -6.5, scale: 1.15, flip: true },
  { across: 30, distance: 16.5, scale: 0.9 },
] });
file('birches', `e.kit.houses.birch(g, e, 10.5, { lean: 0.4 });\n`);

// the people
const person = (id, name, who, a, d, turn, extra = {}) => add({ id, name, person: { cast: 'cast', who, turn }, across: a, distance: d,
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true, ...extra });
const AWAY = { busygin: L.INSIDE, silva: L.INSIDE, sarafanov: L.INSIDE, vasenka: [29.9, 14.1], nina: L.INSIDE, kudimov: [2, 6.4],
  makarskaya: [35.9, 13.8], neighbor1: [11.9, 14.8], neighbor2: [11.9, 14.8] };
const PEOPLE = [['busygin', 'Busygin', 'busygin'], ['silva', 'Silva', 'silva'], ['sarafanov', 'Sarafanov', 'sarafanov'], ['vasenka', 'Vasenka', 'vasenka'],
  ['nina', 'Nina', 'nina'], ['kudimov', 'Kudimov', 'kudimov'], ['makarskaya', 'Makarskaya', 'makarskaya'], ['neighbor1', 'Neighbour', 'neighbor1'], ['neighbor2', 'Neighbour woman', 'neighbor2']];
for (const [id, name, who] of PEOPLE) person(id, name, who, W[`${id}_a`] ?? AWAY[id][0], W[`${id}_d`] ?? AWAY[id][1], W[`${id}_turn`] ?? 180);
// in the kitchen behind its window (their looks by the beat: `k*_wear`)
const KIN = { k1: ['silva', L.K.far_r], k2: ['busygin', L.K.stove], k3: ['vasenka', L.K.far_l], k4: ['busygin_shirt', L.K.end_w] };
for (const [id, [who, p]] of Object.entries(KIN)) person(id, 'In the kitchen window', who, p[0], p[1], p[2], { inside: true });

// the insert: his coat laid on her shoulders (the world's closeups, frame `shawl`; its points shawl#coat, shawl#shoulders)
add({ id: 'shawl', name: 'Coat on the shoulders', insert: 'shawl' });
file('shawl', '// His coat laid on Nina\'s shoulders, close (the world\'s closeups, frame "shawl"): from behind, her shoulders in the knitted\n// shawl, snow, the window\'s warm light from above; his hands holding the coat by its collar. Points shawl#coat, shawl#shoulders.\ne.kit.closeups.paint(g, e, "shawl");\n');
writeFileSync(`${DIR}/elements/shawl.animate.js`, `e.kit.closeups.live(e, "shawl", { lay: e.state.lay });\n`);

add({ id: 'snowfall', name: 'Snow', particles: { kind: 'snow', amount: 'snow', count: 9000, reach: 36 } });
add({ id: 'chimney_smoke', name: 'Smoke', particles: { kind: 'smoke', at: [19.9, 15.6, 6.0], rate: 2.5, size: [0.3, 1.8], life: [5, 9], opacity: 0.3 } });
// the shed on fire (`fire`): tongues under its eaves, embers, thick smoke; the steam after (`steam`); Silva's smoking
// sleeve (`silva_smoke`); the water thrown on it (`splash`: each change a burst)
const S_ = L.SHED;
add({ id: 'shed_flames', name: 'Fire', particles: { kind: 'fire', amount: 'fire', at: [r2(S_.a + 0.3), r2(S_.d - 0.05), r2(S_.h - 0.1)], source: [2.2, 0.3, 0.3], rate: 40, size: [0.5, 0.12] } });
add({ id: 'shed_embers', name: 'Sparks', particles: { kind: 'embers', amount: 'fire', at: [S_.a, r2(S_.d + 0.5), r2(S_.h + 0.2)], source: [2.0, 1.5, 0.3], rate: 12 } });
add({ id: 'shed_smoke', name: 'Smoke', particles: { kind: 'smoke', amount: 'fire', at: [S_.a, r2(S_.d + 0.8), r2(S_.h + 0.3)], source: [2.0, 1.2, 0.3], rate: 7, size: [0.6, 3.2], life: [4, 8], opacity: 0.5, shadow: 0.4 } });
add({ id: 'steam', name: 'Steam', particles: { kind: 'smoke', amount: 'steam', at: [S_.a, r2(S_.d + 0.6), r2(S_.h - 0.4)], source: [2.2, 1.4, 0.6], rate: 5, size: [0.4, 2.4], life: [4, 7], opacity: 0.35, color: '#d9dee8', gravity: -0.5 } });
add({ id: 'sleeve_smoke', name: 'Smoke from the sleeve', particles: { kind: 'smoke', amount: 'silva_smoke', at: 'silva#hand_l', rate: 6, size: [0.06, 0.5], life: [1.5, 3], opacity: 0.35 } });
add({ id: 'splash', name: 'Water', particles: { kind: 'splashes', at: [r2(S_.a + 0.1), r2(S_.d - 0.2), 1.3], burst: { on: 'splash', count: 70 }, color: '#cfd8e6' } });

// the state: the end of `walk` — the two in the street under the lamp, the five windows lit (what a viewer sees first)
const KEYED_W = ['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'];
const state = {
  late: 0, embers: 0, crowd: 0, beat: null, beat_next: null, knock: 0, buckets: 'none', run: 0, run_at: 0, look_back: 0, splash: 0, lay: 0, shed_left: 1, shed_burnt: 0,
  ...Object.fromEntries(KEYED_W.flatMap(w => [[`${w}_lit`, W[w] > 0 ? 1 : 0], [`${w}_who`, 0]])),
  door_f: 180, mak_door_f: 180, nb_door_f: 180,
  // the play's keys (scenes.md): their defaults
  warm: 0.36, frost: 0.25, nina_is: 'none', secret: 0, silva_door: 1, ending: 'late', nina_end: 'gone', nina_for: 0, knocked: '',
  ...Object.fromEntries(Object.entries(KIN).flatMap(([k, [, p]]) => [[`${k}_a`, p[0]], [`${k}_d`, p[1]]])),
  ...Object.fromEntries(Object.entries(AWAY).flatMap(([id, p]) => [[`${id}_a`, p[0]], [`${id}_d`, p[1]]])),
  ...W,
};
const num = means => ({ type: 'number', means });
const BEATS = ['walk', 'knock_ready', 'last_window', 'neighbor', 'porch', 'shut', 'in', 'return', 'gate', 'evening', 'fire', 'after_fire', 'blame', 'own_up', 'porch_night', 'shawl', 'porch_after', 'run_out', 'night_window'];
const WHO = { busygin: 'Busygin', silva: 'Silva', sarafanov: 'Sarafanov', vasenka: 'Vasenka', nina: 'Nina', kudimov: 'Kudimov', makarskaya: 'Makarskaya', neighbor1: 'the neighbour', neighbor2: 'the neighbour woman', k1: 'the first in the kitchen window', k2: 'the second in the kitchen window', k3: 'the third in the kitchen window', k4: 'the fourth in the kitchen window' };
const states = {
  hour: { range: [0, 1], smooth: true, means: 'the time of night: 0.9 night … 0.95 late night (the script sets late)' },
  late: { range: [0, 1], smooth: true, means: 'the weight of the look “late night” — the script sets it by hour' },
  snow: { range: [0, 1], smooth: true, means: 'how hard it snows' },
  beat: { values: [null, ...BEATS], means: 'the film\'s beat: the game sets a name — the beat plays from its beginning (the module beats)' },
  beat_next: { values: [null, ...BEATS], means: 'which beat comes next: the scene makes its first frame ready, the cut goes to the ready one' },
  knock: { values: [0, 1, 2, 3, 4, 5], means: '“Windows”: N — Busygin goes to the window winN and knocks (knock:hit, knock:done); 0 — goes back to Silva' },
  buckets: { values: ['none', 'fill', 'throw'], means: '“Buckets”: fill — to the barrel, a full bucket (buckets:full); throw — carries it to the shed, throws the water (buckets:splash); none — puts the bucket down' },
  run: { range: [0, 1], means: '“Running”: where Busygin is to run, from the gate (0) to the path to the platform (1), ≈ 65 m' },
  run_at: { range: [0, 1], means: '“Running”: where he is now (the scene sets it, 10 times a second)' },
  look_back: { values: [0, 1], means: '“Running”: 1 — he stands and looks back at the kitchen window' },
  splash: num('water on the shed: each change — a splash (the scene sets it)'),
  ...Object.fromEntries([1, 2, 3, 4, 5].map(n => [`win${n}`, { values: [0, 1, 2], means: `window ${n}: 0 dark · 1 lit · 2 lit, a silhouette in it` }])),
  mak_window: { values: [0, 1, 2], means: 'Makarskaya\'s window: 0 dark · 1 lit · 2 lit, a silhouette in it' },
  ...Object.fromEntries(KEYED_W.flatMap(w => [
    [`${w}_lit`, { range: [0, 1], smooth: true, means: `the light of the window ${w} — the script sets it by ${w}` }],
    [`${w}_who`, { range: [0, 1], smooth: true, means: `the silhouette in the window ${w} — the script sets it by ${w}` }]])),
  porch_light: { range: [0, 1], smooth: true, means: 'the bulb over the Sarafanovs\' porch' },
  door: { range: [0, 1], smooth: true, means: 'the Sarafanovs\' door: 0 shut … 1 open inward' },
  door_f: num('the turn of the Sarafanovs\' door, degrees — the script sets it by door'),
  mak_door: { range: [0, 1], smooth: true, means: 'Makarskaya\'s door: 0 shut … 1 open' },
  mak_door_f: num('the turn of Makarskaya\'s door — the script sets it by mak_door'),
  nb_door: { range: [0, 1], smooth: true, means: 'the neighbours\' door (the house next to the Sarafanovs\'): 0 shut … 1 open' },
  nb_door_f: num('the turn of the neighbours\' door — the script sets it by nb_door'),
  fire: { range: [0, 1], smooth: true, means: 'the fire in the shed: light in its little window, tongues under the roof, smoke, orange light on the snow (the game moves it in “Buckets”)' },
  crowd: { values: [0, 1], means: 'the neighbours throw water at the burning shed by themselves while the fire burns (the beat fire sets it; the script throws)' },
  embers: { range: [0, 1], smooth: true, means: 'the shed smouldering after the fire: the glow in its window and a dim orange light, no flames' },
  steam: { range: [0, 1], smooth: true, means: 'steam over the shed put out' },
  shed_burnt: { values: [0, 1], means: 'the shed after the fire (the beat after_fire sets it): 1 — scorched/burnt out by shed_left' },
  shed_left: { values: [0, 1], means: 'the shed after the fire: 1 — it stood (the roof whole), 0 — burnt out (black walls with no roof); the game sets it before after_fire' },
  silva_smoke: { range: [0, 1], smooth: true, means: 'smoke from Silva\'s sleeve (the beat fire sets it, puts it out over 30 s)' },
  shawl: { range: [0, 1], means: 'the insert “The Coat” (closeups, the shot shawl): 0 shut, 1 open' },
  lay: { range: [0, 1], means: '“The Coat”: the coat comes down on her shoulders (the game moves it; only the insert\'s animate reads it)' },
  warm: { range: [0, 1], means: 'a key of the play: the kitchen window\'s light and the patch on the snow (0.55 + 0.45·warm)' },
  frost: { range: [0, 1], means: 'a key of the play: frost on the kitchen window, from the corners to the middle' },
  nina_is: { values: ['none', 'knows', 'sister'], means: 'a key of the play: Nina knows the truth / as a sister / no — porch_night, porch_after' },
  secret: { values: [0, 1], means: 'a key of the play: the secret of the orchestra (L115 on the porch — the game says it)' },
  silva_door: { values: [0, 1], means: 'a key of the play: Silva runs out ahead in run_out' },
  ending: { values: ['late', 'saturday', 'anyway', 'suitcase'], means: 'a key of the play: who is in the kitchen window in night_window' },
  nina_end: { values: ['home', 'gone'], means: 'a key of the play: Nina in the window in night_window, or she is not' },
  nina_for: { values: [0, 1], means: 'a key of the play: Nina alone stands at the window in night_window (at saturday/suitcase)' },
  knocked: { type: 'string', means: 'a key of the play: the numbers of the windows he knocked at in I (\'\'…\'12345\'): in evening they are dark' },
  ...Object.fromEntries(Object.entries(WHO).flatMap(([p, n]) => [[`${p}_here`, { type: 'boolean', means: `${n} in the scene (the beat sets it)` }], [`${p}_a`, num(`where ${n} is: metres to the right`)], [`${p}_d`, num(`where ${n} is: metres forward`)]])),
};

const scene = {
  engine: 3,
  title: 'The Street',
  caption: 'A suburb\'s street at night. Snow.',
  horizon: 0.5,
  // roam, not panorama: some shots turn far aside (the corner, under the window), and a roaming camera's sky goes all
  // round — a panorama's ends about 65° aside, black past it
  camera: { mode: 'roam', area: [-45, 45, -9, 12] },
  modules: ['cast', 'beats', 'closeups', 'houses'],
  light: {
    tint: '#6f80b8', tintStrength: 0.12, vignette: 0.5, grain: 0.22,
    haze: 0.12, hazeColor: '#323b5c', hazeGlow: 0.9, shafts: 0,
    brightness: 1.15, saturation: 0.85, ambient: 0.62, ambientColor: '#8f9ece', bounce: 0.55, inside: 0.2,
    wind: [0.6, 0.2, 0.35],
    looks: {
      late: { ambient: 0.52, ambientColor: '#7f8fc4', hazeColor: '#262e4a', tintStrength: 0.15 },
    },
  },
  lights: [
    { id: 'night_sky', from: [-25, 40], color: '#a9b8e0', strength: 0.4 },
    { id: 'street_lamp_l', of: 'street_lamp#lamp', color: '#f3dcae', strength: 1.6, reach: 10, glow: 1.2 },
    { id: 'gate_lamp_l', of: 'gate_lamp#lamp', color: '#f3dcae', strength: 1.4, reach: 8, glow: 1.0 },
    ...['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'].map(w => ({ id: `${w}_l`, of: `${w}#pane`, color: '#eda055', strength: 1.1, reach: w === 'mak_window' ? 8 : 6, on: `${w}_lit` })),
    { id: 'fire_l', of: 'shed#fire', color: '#ff8a3a', strength: 3.2, reach: 15, on: 'fire', flicker: 0.5, glow: 2 },
    { id: 'embers_l', of: 'shed#fire', color: '#ff7a30', strength: 1.8, reach: 7, on: 'embers', flicker: 0.4 },
    { id: 'mak_hall_l', across: L.MAK_DOOR.a, distance: 13.5, elevation: L.PLINTH + 2.0, color: '#f0b56e', strength: 1.2, reach: 3.5, on: 'mak_door' },
    { id: 'nb_hall_l', across: L.NB_DOOR.a, distance: 14.5, elevation: L.PLINTH + 2.0, color: '#f0b56e', strength: 1.0, reach: 3.5, on: 'nb_door' },
    { id: 'kitchen_l', of: 'kitchen#glow', color: '#e8963a', reach: 6.5 },
    { id: 'lamp', of: 'lampshade#lamp', color: '#e8963a', strength: 2.2, reach: 2.6 },
    { id: 'stove_l', of: 'stove#fire', color: '#e07a35', strength: 0.8, reach: 1.6, flicker: 0.4 },
    { id: 'hall_l', across: L.DOOR.a, distance: 13.0, elevation: L.PLINTH + 2.0, color: '#f0b56e', strength: 1.5, reach: 4.5, on: 'door' },
    { id: 'porch_l', of: 'porch_bulb#bulb', color: '#f2c27e', strength: 1.3, reach: 5, on: 'porch_light' },
  ],
  state,
  states,
  objects,
  music: {
    prompts: [
      { text: 'Very quiet low drone of wind along an empty village street at night, sparse, cold', weight: 1.2 },
      { text: 'Soft sustained string pad, almost still, tender and aching, winter night, minor key', weight: 0.7 },
      { text: 'Distant dogs and snow hush rendered as soft ambient noise, no melody', weight: 0 },
      { text: 'Slow solo piano, few notes, lots of silence, Soviet film score, melancholic', weight: 0 },
      { text: 'Glassy high harmonics like frost on a window, shimmering, very slow', weight: 0.3 },
      { text: 'Warm low organ hum like a lit window in the cold, very soft', weight: 0 },
      { text: 'Muted felt piano lullaby, warm and sad, 1970s Russian chamber music', weight: 0 },
      { text: 'Cello long notes, quiet, breathing, intimate, late night', weight: 0 },
      { text: 'Gentle accordion far away behind a wall, provincial suburb, nostalgic', weight: 0 },
      { text: 'Minimal ambient with soft bell-like tones, cold and still', weight: 0 },
      { text: 'Slow guitar arpeggios, sparse, lonely road at night, restrained', weight: 0 },
      { text: 'Celesta and strings, a winter tale but sad, very slow', weight: 0 },
      { text: 'Soft brushed snare and double bass, slow night jazz muffled by snow', weight: 0 },
      { text: 'Solemn wordless choir hum, far away, cold air', weight: 0 },
      { text: 'Tense quiet pulse, someone waiting outside a door', weight: 0 },
      { text: 'Faint ticking texture and warm chord, a kitchen seen from the street', weight: 0 },
    ],
    bpm: 60, density: 0.15, brightness: 0.25, scale: 'A_FLAT_MAJOR_F_MINOR',
  },
};
writeFileSync(`${DIR}/scene.json`, `${JSON.stringify(scene, null, 2)}\n`);
console.log('objects', objects.length, 'state keys', Object.keys(state).length);
