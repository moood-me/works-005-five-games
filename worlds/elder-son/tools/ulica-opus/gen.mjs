// Writes scenes/ulica-opus/scene.json and the houses' element files from the scene's lib (where everything stands).
// node tools/ulica-opus/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/ulica-opus';
mkdirSync(`${DIR}/elements`, { recursive: true });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const W = L.END.walk();   // the first pose a viewer sees: the end of `walk`
const r2 = v => Math.round(v * 100) / 100;
const file = (id, text) => writeFileSync(`${DIR}/elements/${id}.js`, text);

const objects = [];
const add = o => (objects.push(o), o);

add({ id: 'sky', name: 'Небо', sky: true });
add({ id: 'ground', name: 'Улица', plane: true, drape: true, across: 0, distance: 20, elevation: 0, width: 150, depth: 90 });
add({ id: 'far', name: 'Дальние дворы', across: 4, distance: 32, height: 13, box: [-75, -13, 75, 0.5] });

// the houses: an unseen anchor each, its long wall, its roof's near slope, its two ends; their panes
const PANES = [];
for (const h of L.HOUSES) {
  add({ id: h.id, name: 'Дом', unseen: true, across: h.a, distance: h.d, facing: 180 });
  const wallTop = L.PLINTH + L.WALL_H;
  add({ id: `${h.id}_wall`, name: h.id === 'sar' ? 'Дом Сарафановых' : h.id === 'mak' ? 'Дом Макарской' : 'Дом', on: h.id, facing: 180,
    height: wallTop, box: [-h.w / 2 - 0.5, -wallTop - 0.5, h.w / 2 + 0.5, 0.15] });
  file(`${h.id}_wall`, `// the house's long wall on the street, its openings cut through (panes, the kitchen, the door behind them)\n` +
    `e.kit.izby.wall(g, e, ${JSON.stringify({ w: h.w, h: L.WALL_H, plinth: L.PLINTH, color: h.color, windows: h.windows.map(({ x, w, h: wh, sill }) => ({ x, w, h: wh, sill })), door: h.door || null })});\n`);
  const run = h.deep / 2 + 0.45, slope = Math.hypot(run, L.RISE), tilt = (Math.atan2(L.RISE, run) * 180) / Math.PI;
  add({ id: `${h.id}_roof`, name: 'Крыша', plane: true, on: h.id, across: 0, distance: r2(run / 2 - 0.45), elevation: r2(wallTop + L.RISE / 2),
    width: h.w + 1.0, depth: r2(slope), tilt: r2(tilt) });
  file(`${h.id}_roof`, `e.kit.izby.roof(g, e, { w: ${h.w + 1.0}, d: ${r2(slope)}${h.id === 'sar' ? ', chimney: -1.6' : ''} });\n`);
  for (const side of [-1, 1]) {
    const id = `${h.id}_end${side < 0 ? 'l' : 'r'}`;
    add({ id, name: 'Дом', on: h.id, across: (side * h.w) / 2, distance: h.deep / 2, facing: side < 0 ? 270 : 90,
      height: wallTop + L.RISE, box: [-h.deep / 2 - 0.6, -wallTop - L.RISE - 0.4, h.deep / 2 + 0.6, 0.15] });
    file(id, `e.kit.izby.gable(g, e, { d: ${h.deep}, h: ${L.WALL_H}, plinth: ${L.PLINTH}, rise: ${L.RISE}, color: '${h.color}' });\n`);
  }
  for (const w of h.windows) if (w.pane) PANES.push({ house: h, w });
}
// (the panes the game lights by their keys; the others stay dark)
const KEYED = ['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'];
for (const { house, w } of PANES) {
  const keyed = KEYED.includes(w.pane);
  add({ id: w.pane, name: 'Окно', on: house.id, across: w.x, distance: 0.05, elevation: w.sill, facing: 180, glows: keyed,
    height: w.h, box: [-w.w / 2 - 0.06, -w.h - 0.06, w.w / 2 + 0.06, 0.06] });
  file(w.pane, `e.kit.izby.pane(g, e, { w: ${w.w}, h: ${w.h}${keyed ? '' : ', dark: true'} });\n`);
  if (keyed) writeFileSync(`${DIR}/elements/${w.pane}.animate.js`, `e.lib.paneLive(e);\n`);
}

// Сарафановы: the kitchen behind its window (a 3 × 3 m room, its floor as high as the plinth), the hall behind the door
const S = L.HOUSES.find(h => h.id === 'sar');
const K = L.KITCHEN, KW = L.KITCHEN_WIN;
add({ id: 'kitchen', name: 'Окно кухни', on: 'sar', across: r2(KW.a - S.a), distance: 0.04, elevation: KW.sill, facing: 180, glows: true,
  height: KW.h, box: [-KW.w / 2 - 0.08, -KW.h - 0.08, KW.w / 2 + 0.08, 0.08] });
add({ id: 'k_floor', name: 'Пол', plane: true, unseen: true, walk: true, across: r2((K.a0 + 26.0) / 2), distance: (K.d0 + K.d1) / 2,
  elevation: L.PLINTH, width: r2(26.0 - K.a0), depth: K.d1 - K.d0 });
add({ id: 'k_back', name: 'Кухня', inside: true, across: r2((K.a0 + K.a1) / 2), distance: K.d1, elevation: L.PLINTH, facing: 180,
  height: 2.5, box: [-1.6, -2.6, 1.6, 0.05] });
add({ id: 'k_left', name: 'Кухня', inside: true, across: K.a0, distance: (K.d0 + K.d1) / 2, elevation: L.PLINTH, facing: 90,
  height: 2.5, box: [-1.6, -2.6, 1.6, 0.05] });
add({ id: 'k_right', name: 'Кухня', inside: true, across: K.a1, distance: (K.d0 + K.d1) / 2, elevation: L.PLINTH, facing: 270,
  height: 2.5, box: [-1.6, -2.6, 1.6, 0.05] });
add({ id: 'stove', name: 'Печь', inside: true, across: r2(L.STOVE.a + 0.02), distance: L.STOVE.d, elevation: L.PLINTH, facing: 90,
  height: 2.1, box: [-0.75, -2.15, 0.75, 0.05] });
add({ id: 'table', name: 'Стол', inside: true, across: L.TABLE.a, distance: r2(L.TABLE.d - L.TABLE.depth / 2), elevation: L.PLINTH, facing: 180,
  height: 0.78, box: [-0.75, -0.8, 0.75, 0.05] });
add({ id: 'table_top', name: 'Стол', plane: true, inside: true, across: L.TABLE.a, distance: L.TABLE.d, elevation: r2(L.PLINTH + 0.76),
  width: L.TABLE.w, depth: L.TABLE.depth, shadow: { light: 'lamp', onto: [] } });
add({ id: 'abajur', name: 'Абажур', inside: true, glows: true, across: L.LAMP[0], distance: L.LAMP[1], elevation: L.LAMP[2], height: 0.5, box: [-0.4, -0.9, 0.4, 0.12] });
add({ id: 'hall', name: 'Сени', inside: true, glows: true, across: L.DOOR.a, distance: 13.4, elevation: L.PLINTH, facing: 180, height: 2.4, box: [-1.3, -2.45, 1.3, 0.05] });
add({ id: 'door', name: 'Дверь', on: 'sar', across: r2(L.DOOR.a - S.a - L.DOOR.w / 2), distance: 0.03, elevation: L.PLINTH, facing: 180,
  place: { facing: 'door_f' }, height: L.DOOR.h, box: [-0.05, -L.DOOR.h - 0.05, L.DOOR.w + 0.05, 0.05], shadow: true });
add({ id: 'porch', name: 'Крыльцо', across: L.DOOR.a, distance: L.PORCH.d0, facing: 180, height: 3.3, box: [-1.0, -3.4, 1.0, 0.1] });
add({ id: 'porch_floor', name: 'Крыльцо', plane: true, walk: true, across: L.DOOR.a, distance: r2((L.PORCH.d0 + L.PORCH.d1) / 2), elevation: L.PLINTH,
  width: r2(L.PORCH.a1 - L.PORCH.a0), depth: r2(L.PORCH.d1 - L.PORCH.d0) });
{
  const run = L.PORCH.d0 - L.PORCH.steps;
  add({ id: 'porch_steps', name: 'Ступени', plane: true, walk: true, across: L.DOOR.a, distance: r2((L.PORCH.d0 + L.PORCH.steps) / 2), elevation: r2(L.PLINTH / 2),
    width: 1.2, depth: r2(Math.hypot(run, L.PLINTH)), tilt: r2((Math.atan2(L.PLINTH, run) * 180) / Math.PI) });
}
add({ id: 'porch_bulb', name: 'Лампочка над крыльцом', glows: true, across: L.DOOR.a, distance: 11.9, elevation: 2.62, height: 0.3, box: [-0.15, -0.3, 0.15, 0.05] });

// Макарская: her door's leaf, the dark behind it
const M = L.HOUSES.find(h => h.id === 'mak');
add({ id: 'mak_hall', name: 'Сени', inside: true, glows: true, across: L.MAK_DOOR.a, distance: 13.6, elevation: L.PLINTH, facing: 180, height: 2.4, box: [-1.0, -2.45, 1.0, 0.05] });
add({ id: 'mak_door', name: 'Дверь Макарской', on: 'mak', across: r2(L.MAK_DOOR.a - M.a - L.MAK_DOOR.w / 2), distance: 0.03, elevation: L.PLINTH, facing: 180,
  place: { facing: 'mak_door_f' }, height: L.MAK_DOOR.h, box: [-0.05, -L.MAK_DOOR.h - 0.05, L.MAK_DOOR.w + 0.05, 0.05] });

// the neighbours' door (h3): its leaf, the dim hall behind it
const H3 = L.HOUSES.find(h => h.id === 'h3');
add({ id: 'nb_hall', name: 'Сени', inside: true, glows: true, across: L.NB_DOOR.a, distance: 14.6, elevation: L.PLINTH, facing: 180, height: 2.4, box: [-1.0, -2.45, 1.0, 0.05] });
add({ id: 'nb_door', name: 'Дверь соседей', on: 'h3', across: r2(L.NB_DOOR.a - H3.a - L.NB_DOOR.w / 2), distance: 0.03, elevation: L.PLINTH, facing: 180,
  place: { facing: 'nb_door_f' }, height: L.NB_DOOR.h, box: [-0.05, -L.NB_DOOR.h - 0.05, L.NB_DOOR.w + 0.05, 0.05] });

// fences, the shed, the barrel, the bench, the woodpile, the lamps, birches
const SF = L.SAR_FENCE, SD = L.SIDE_FENCE;
add({ id: 'sar_fence', name: 'Палисадник', across: SF.a, distance: SF.d, facing: 180, height: 1.2, box: [-0.1, -1.4, SF.len + 0.1, 0.2] });
file('sar_fence', `e.kit.izby.fence(g, e, ${SF.len}, 1.15, { gaps: [${JSON.stringify(SF.gate)}] });\n`);
add({ id: 'side_fence', name: 'Забор', across: SD.a, distance: SD.d, facing: 90, height: 1.2, box: [-0.1, -1.4, SD.len + 0.1, 0.2] });
file('side_fence', `e.kit.izby.fence(g, e, ${SD.len}, 1.1, { gaps: [${JSON.stringify(SD.gate)}] });\n`);
// short runs of fence between the far houses: one 2.2 m painting, its copies side by side
add({ id: 'fences', name: 'Забор', across: -21.9, distance: 14, facing: 180, height: 1.2, box: [-0.1, -1.4, 2.3, 0.2], copies: [
  { across: -21.9, distance: 14 }, { across: -19.7, distance: 14 }, { across: -17.5, distance: 14 }, { across: 5.1, distance: 14.05 },
  { across: 14.05, distance: 13.9 }, { across: 38.6, distance: 13.1 }, { across: 40.8, distance: 13.1 },
] });
file('fences', `e.kit.izby.fence(g, e, 2.2, 1.15);
`);
add({ id: 'near_fence', name: 'Забор', across: -34, distance: -7.9, facing: 180, height: 1.1, box: [-0.1, -1.3, 12.1, 0.2], copies: [
  { across: -34, distance: -7.9 }, { across: -22, distance: -7.8 }, { across: -10, distance: -7.9 }, { across: 2, distance: -7.8 },
  { across: 14, distance: -7.9 }, { across: 26, distance: -7.8 }, { across: 38, distance: -7.9 },
] });
file('near_fence', `e.kit.izby.fence(g, e, 12, 1.0);\n`);
add({ id: 'shed', name: 'Сарай', across: L.SHED.a, distance: L.SHED.d, facing: 180, height: L.SHED.h, box: [-L.SHED.w / 2 - 0.35, -L.SHED.h - 1.3, L.SHED.w / 2 + 0.35, 0.15], shadow: true, flicker: 0.5 });
file('shed', `// Макарская's shed: its fire by \`fire\` (layers: the window's glow, the tongues under the eaves — shedLive); after the
// fire by \`shed_left\` (the game sets it before \`after_fire\`): 1 — scorched, its roof whole; 0 — black walls, no roof.
// Before the fire — whole.
e.kit.izby.shed(g, e, { w: ${L.SHED.w}, h: ${L.SHED.h}, fire: true, burnt: e.state.shed_burnt ? (e.state.shed_left === 0 ? 2 : 1) : 0 });\n`);
writeFileSync(`${DIR}/elements/shed.animate.js`, `e.lib.shedLive(e);\n`);
add({ id: 'shed_side', name: 'Сарай', across: r2(L.SHED.a + L.SHED.w / 2), distance: r2(L.SHED.d + L.SHED.deep / 2), facing: 90, height: L.SHED.h, box: [-1.1, -L.SHED.h - 0.3, 1.1, 0.15] });
add({ id: 'barrel', name: 'Бочка', across: L.BARREL[0], distance: L.BARREL[1], height: 0.95, box: [-0.5, -1.0, 0.5, 0.1] });
file('barrel', `e.kit.izby.barrel(g, e);\ne.at(0, -0.6);\n`);
add({ id: 'bench', name: 'Лавка', across: L.BENCH[0], distance: L.BENCH[1], facing: 180, height: 0.5, box: [-0.85, -0.55, 0.85, 0.05] });
file('bench', `e.kit.izby.bench(g, e);\n`);
add({ id: 'woodpile', name: 'Поленница', across: L.WOODPILE[0], distance: L.WOODPILE[1], facing: 180, height: 1.3, box: [-0.95, -1.4, 0.95, 0.1] });
file('woodpile', `e.kit.izby.woodpile(g, e, 1.7);\n`);
// the suitcase by the kitchen window, on a stool, in the light (the epilogue's \`suitcase\` ending; a party key)
add({ id: 'suitcase', name: 'Чемодан', inside: true, across: 22.75, distance: 12.4, elevation: r2(L.PLINTH + 0.5), facing: 180, height: 0.5, box: [-0.4, -0.5, 0.4, 0.55] });
add({ id: 'gate_lamp', name: 'Фонарь у калитки', across: L.GATE_LAMP[0], distance: L.GATE_LAMP[1], height: 2.9, box: [-0.2, -3.0, 0.8, 0.05] });
file('gate_lamp', `e.kit.izby.lamp(g, e, 2.6);\n`);
add({ id: 'street_lamp', name: 'Фонарь', across: L.STREET_LAMP[0], distance: L.STREET_LAMP[1], height: 3.9, box: [-0.2, -4.0, 0.8, 0.05] });
file('street_lamp', `e.kit.izby.lamp(g, e, 3.6);\n`);
add({ id: 'birches', name: 'Берёзы', across: -19.5, distance: 16, height: 11, box: [-4.5, -13.6, 4.5, 0.3], copies: [
  { across: -19.5, distance: 16.5 }, { across: 6.1, distance: 17, scale: 0.85, flip: true }, { across: 15.2, distance: 15.5, scale: 1.1 },
  { across: 41, distance: 15, flip: true }, { across: -28, distance: 13 , scale: 0.8 }, { across: -15, distance: -6.5, scale: 1.15, flip: true },
  { across: 30, distance: 16.5, scale: 0.9 },
] });
file('birches', `e.kit.izby.birch(g, e, 10.5, { lean: 0.4 });\n`);

// the people
const person = (id, name, who, a, d, turn, extra = {}) => add({ id, name, person: { cast: 'cast', who, turn }, across: a, distance: d,
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true, ...extra });
const AWAY = { busygin: L.INSIDE, silva: L.INSIDE, sarafanov: L.INSIDE, vasenka: [29.9, 14.1], nina: L.INSIDE, kudimov: [2, 6.4],
  makarskaya: [35.9, 13.8], neighbor1: [11.9, 14.8], neighbor2: [11.9, 14.8] };
const PEOPLE = [['busygin', 'Бусыгин', 'busygin'], ['silva', 'Сильва', 'silva'], ['sarafanov', 'Сарафанов', 'sarafanov'], ['vasenka', 'Васенька', 'vasenka'],
  ['nina', 'Нина', 'nina'], ['kudimov', 'Кудимов', 'kudimov'], ['makarskaya', 'Макарская', 'makarskaya'], ['neighbor1', 'Сосед', 'neighbor1'], ['neighbor2', 'Соседка', 'neighbor2']];
for (const [id, name, who] of PEOPLE) person(id, name, who, W[`${id}_a`] ?? AWAY[id][0], W[`${id}_d`] ?? AWAY[id][1], W[`${id}_turn`] ?? 180);
// in the kitchen behind its window (their looks by the beat: `k*_wear`)
person('k1', 'В окне кухни', 'silva', L.SEATS.k1[0], L.SEATS.k1[1], L.SEATS.k1[2], { inside: true });
person('k2', 'В окне кухни', 'busygin', L.K2_STOVE[0], L.K2_STOVE[1], L.K2_STOVE[2], { inside: true });
person('k3', 'В окне кухни', 'vasenka', L.SEATS.k3[0], L.SEATS.k3[1], L.SEATS.k3[2], { inside: true });
person('k4', 'В окне кухни', 'busygin_shirt', L.K.end_e[0], L.K.end_e[1], L.K.end_e[2], { inside: true });

// the insert: his coat laid on her shoulders (the world's closeups, frame `shawl`; its points shawl#coat, shawl#shoulders)
add({ id: 'shawl', name: 'Пальто на плечи', insert: 'shawl' });
file('shawl', `// His coat laid on Нина's shoulders, close (the world's closeups, frame "shawl"): from behind, her shoulders in the knitted
// shawl, snow, the window's warm light from above; his hands holding the coat by its collar. Points shawl#coat, shawl#shoulders.
e.kit.closeups.paint(g, e, "shawl");\n`);
writeFileSync(`${DIR}/elements/shawl.animate.js`, `e.kit.closeups.live(e, "shawl", { lay: e.state.lay });\n`);

add({ id: 'snowfall', name: 'Снег', particles: { kind: 'snow', amount: 'snow', count: 9000, reach: 36 } });
add({ id: 'chimney_smoke', name: 'Дым', particles: { kind: 'smoke', at: [19.9, 15.6, 6.0], rate: 2.5, size: [0.3, 1.8], life: [5, 9], opacity: 0.3 } });
// the shed on fire (`fire`): tongues under its eaves, embers, thick smoke; the steam after (`steam`); Сильва's smoking
// sleeve (`silva_smoke`); the water thrown on it (`splash`: each change a burst)
const S_ = L.SHED;
add({ id: 'shed_flames', name: 'Огонь', particles: { kind: 'fire', amount: 'fire', at: [r2(S_.a + 0.3), r2(S_.d - 0.05), r2(S_.h - 0.1)], source: [2.2, 0.3, 0.3], rate: 40, size: [0.5, 0.12] } });
add({ id: 'shed_embers', name: 'Искры', particles: { kind: 'embers', amount: 'fire', at: [S_.a, r2(S_.d + 0.5), r2(S_.h + 0.2)], source: [2.0, 1.5, 0.3], rate: 12 } });
add({ id: 'shed_smoke', name: 'Дым', particles: { kind: 'smoke', amount: 'fire', at: [S_.a, r2(S_.d + 0.8), r2(S_.h + 0.3)], source: [2.0, 1.2, 0.3], rate: 7, size: [0.6, 3.2], life: [4, 8], opacity: 0.5, shadow: 0.4 } });
add({ id: 'steam', name: 'Пар', particles: { kind: 'smoke', amount: 'steam', at: [S_.a, r2(S_.d + 0.6), r2(S_.h - 0.4)], source: [2.2, 1.4, 0.6], rate: 5, size: [0.4, 2.4], life: [4, 7], opacity: 0.35, color: '#d9dee8', gravity: -0.5 } });
add({ id: 'sleeve_smoke', name: 'Дым от рукава', particles: { kind: 'smoke', amount: 'silva_smoke', at: 'silva#hand_l', rate: 6, size: [0.06, 0.5], life: [1.5, 3], opacity: 0.35 } });
add({ id: 'splash', name: 'Вода', particles: { kind: 'splashes', at: [r2(S_.a + 0.1), r2(S_.d - 0.2), 1.3], burst: { on: 'splash', count: 70 }, color: '#cfd8e6' } });

// the state: the end of `walk` — the two in the street under the lamp, the five windows lit (what a viewer sees first)
const KEYED_W = ['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'];
const state = {
  late: 0, beat: null, beat_next: null, knock: 0, vyodra: 'none', run: 0, run_at: 0, look_back: 0, splash: 0, lay: 0, shed_left: 1, shed_burnt: 0,
  ...Object.fromEntries(KEYED_W.flatMap(w => [[`${w}_lit`, W[w] > 0 ? 1 : 0], [`${w}_who`, 0]])),
  door_f: 180, mak_door_f: 180, nb_door_f: 180,
  // the play's keys (scenes.md): their defaults
  warm: 0.36, frost: 0.25, nina_is: 'none', secret: 0, silva_door: 1, ending: 'late', nina_end: 'gone', nina_for: 0, knocked: '',
  ...Object.fromEntries(['k1', 'k2', 'k3'].flatMap(k => [[`${k}_a`, L.SEATS[k] ? L.SEATS[k][0] : L.K2_STOVE[0]], [`${k}_d`, L.SEATS[k] ? L.SEATS[k][1] : L.K2_STOVE[1]]])),
  k2_a: L.K2_STOVE[0], k2_d: L.K2_STOVE[1], k4_a: L.K.end_e[0], k4_d: L.K.end_e[1],
  ...Object.fromEntries(Object.entries(AWAY).flatMap(([id, p]) => [[`${id}_a`, p[0]], [`${id}_d`, p[1]]])),
  ...W,
};
const num = means => ({ type: 'number', means });
const BEATS = ['walk', 'knock_ready', 'last_window', 'neighbor', 'porch', 'shut', 'in', 'return', 'gate', 'evening', 'fire', 'after_fire', 'blame', 'own_up', 'porch_night', 'shawl', 'porch_after', 'run_out', 'night_window'];
const WHO = { busygin: 'Бусыгин', silva: 'Сильва', sarafanov: 'Сарафанов', vasenka: 'Васенька', nina: 'Нина', kudimov: 'Кудимов', makarskaya: 'Макарская', neighbor1: 'сосед', neighbor2: 'соседка', k1: 'первый в окне кухни', k2: 'второй в окне кухни', k3: 'третий в окне кухни', k4: 'четвёртый в окне кухни' };
const states = {
  hour: { range: [0, 1], smooth: true, means: 'время ночи: 0.9 ночь … 0.95 поздняя ночь (скрипт ставит late)' },
  late: { range: [0, 1], smooth: true, means: 'вес образа «поздняя ночь» — ставит скрипт по hour' },
  snow: { range: [0, 1], smooth: true, means: 'сила снегопада' },
  beat: { values: [null, ...BEATS], means: 'кусок фильма: игра ставит имя — кусок играется с начала (модуль beats)' },
  beat_next: { values: [null, ...BEATS], means: 'какой кусок будет следующим: сцена готовит его первый кадр, склейка идёт по готовому' },
  knock: { values: [0, 1, 2, 3, 4, 5], means: '«Окна»: N — Бусыгин идёт к окну winN и стучит (knock:hit, knock:done); 0 — возвращается к Сильве' },
  vyodra: { values: ['none', 'fill', 'throw'], means: '«Вёдра»: fill — к бочке, полное ведро (vyodra:full); throw — несёт к сараю, выплёскивает (vyodra:splash); none — ставит ведро' },
  run: { range: [0, 1], means: '«Бегом»: куда бежать Бусыгину, от калитки (0) до тропы на платформу (1), ≈ 65 м' },
  run_at: { range: [0, 1], means: '«Бегом»: где он сейчас (ставит сцена, 10 раз в секунду)' },
  look_back: { values: [0, 1], means: '«Бегом»: 1 — стоит и оглядывается на окно кухни' },
  splash: num('вода на сарай: каждое изменение — брызги (ставит сцена)'),
  ...Object.fromEntries([1, 2, 3, 4, 5].map(n => [`win${n}`, { values: [0, 1, 2], means: `окно ${n}: 0 тёмное · 1 горит · 2 горит, в нём силуэт` }])),
  mak_window: { values: [0, 1, 2], means: 'окно Макарской: 0 тёмное · 1 горит · 2 горит, в нём силуэт' },
  ...Object.fromEntries(KEYED_W.flatMap(w => [
    [`${w}_lit`, { range: [0, 1], smooth: true, means: `свет окна ${w} — ставит скрипт по ${w}` }],
    [`${w}_who`, { range: [0, 1], smooth: true, means: `силуэт в окне ${w} — ставит скрипт по ${w}` }]])),
  porch_light: { range: [0, 1], smooth: true, means: 'лампочка над крыльцом Сарафановых' },
  door: { range: [0, 1], smooth: true, means: 'дверь Сарафановых: 0 закрыта … 1 открыта внутрь' },
  door_f: num('поворот двери Сарафановых, градусы — ставит скрипт по door'),
  mak_door: { range: [0, 1], smooth: true, means: 'дверь Макарской: 0 закрыта … 1 открыта' },
  mak_door_f: num('поворот двери Макарской — ставит скрипт по mak_door'),
  nb_door: { range: [0, 1], smooth: true, means: 'дверь соседей (дом у Сарафановых): 0 закрыта … 1 открыта' },
  nb_door_f: num('поворот двери соседей — ставит скрипт по nb_door'),
  fire: { range: [0, 1], smooth: true, means: 'огонь в сарае: свет в окошке, языки под крышей, дым, оранжевый свет на снегу (двигает игра в «Вёдрах»)' },
  steam: { range: [0, 1], smooth: true, means: 'пар над потушенным сараем' },
  shed_burnt: { values: [0, 1], means: 'сарай после пожара (ставит кусок after_fire): 1 — обгорел/выгорел по shed_left' },
  shed_left: { values: [0, 1], means: 'сарай после пожара: 1 — устоял (крыша цела), 0 — выгорел (чёрные стены без крыши); ставит игра перед after_fire' },
  silva_smoke: { range: [0, 1], smooth: true, means: 'дым от рукава Сильвы (кусок fire ставит, гасит за 30 с)' },
  shawl: { range: [0, 1], means: 'вставка «Пальто» (closeups, кадр shawl): 0 закрыта, 1 открыта' },
  lay: { range: [0, 1], means: '«Пальто»: пальто опускается ей на плечи (двигает игра; читает только animate вставки)' },
  warm: { range: [0, 1], means: 'ключ партии: свет окна кухни и пятно на снегу (0.55 + 0.45·warm)' },
  frost: { range: [0, 1], means: 'ключ партии: иней на окне кухни, от углов к середине' },
  nina_is: { values: ['none', 'knows', 'sister'], means: 'ключ партии: Нина знает правду / как сестра / нет — porch_night, porch_after' },
  secret: { values: [0, 1], means: 'ключ партии: тайна об оркестре (Р115 на крыльце — говорит игра)' },
  silva_door: { values: [0, 1], means: 'ключ партии: Сильва выбегает впереди в run_out' },
  ending: { values: ['late', 'saturday', 'anyway', 'suitcase'], means: 'ключ партии: кто в окне кухни в night_window' },
  nina_end: { values: ['home', 'gone'], means: 'ключ партии: Нина в окне в night_window или её нет' },
  nina_for: { values: [0, 1], means: 'ключ партии: Нина одна стоит у окна в night_window (при saturday/suitcase)' },
  knocked: { type: 'string', means: 'ключ партии: номера окон, в которые он стучал в I (\'\'…\'12345\'): в evening они тёмные' },
  ...Object.fromEntries(Object.entries(WHO).flatMap(([p, n]) => [[`${p}_here`, { type: 'boolean', means: `${n} в сцене (ставит кусок)` }], [`${p}_a`, num(`где ${n}: метры вправо`)], [`${p}_d`, num(`где ${n}: метры вперёд`)]])),
};

const scene = {
  engine: 3,
  title: 'Улица',
  caption: 'Ночная улица пригорода. Снег.',
  horizon: 0.5,
  // roam, not panorama: some shots turn far aside (the corner, under the window), and a roaming camera's sky goes all
  // round — a panorama's ends about 65° aside, black past it
  camera: { mode: 'roam', area: [-45, 45, -9, 12] },
  modules: ['cast', 'beats', 'closeups', 'izby'],
  light: {
    tint: '#6f80b8', tintStrength: 0.12, vignette: 0.5, grain: 0.22,
    haze: 0.12, hazeColor: '#323b5c', hazeGlow: 0.9, shafts: 0,
    brightness: 1.1, saturation: 0.85, ambient: 0.5, ambientColor: '#8796c8', bounce: 0.5, inside: 0.2,
    wind: [0.6, 0.2, 0.35],
    looks: {
      late: { ambient: 0.4, ambientColor: '#7686bc', hazeColor: '#262e4a', tintStrength: 0.15 },
    },
  },
  lights: [
    { id: 'night_sky', from: [-25, 40], color: '#a9b8e0', strength: 0.4 },
    { id: 'street_lamp_l', of: 'street_lamp#lamp', color: '#f3dcae', strength: 1.6, reach: 10, glow: 1.2 },
    { id: 'gate_lamp_l', of: 'gate_lamp#lamp', color: '#f3dcae', strength: 1.4, reach: 8, glow: 1.0 },
    ...['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'].map(w => ({ id: `${w}_l`, of: `${w}#pane`, color: '#eda055', strength: 1.1, reach: w === 'mak_window' ? 8 : 6, on: `${w}_lit` })),
    { id: 'fire_l', of: 'shed#fire', color: '#ff8a3a', strength: 3.2, reach: 15, on: 'fire', flicker: 0.5, glow: 2 },
    { id: 'mak_hall_l', across: L.MAK_DOOR.a, distance: 13.5, elevation: L.PLINTH + 2.0, color: '#f0b56e', strength: 1.2, reach: 3.5, on: 'mak_door' },
    { id: 'nb_hall_l', across: L.NB_DOOR.a, distance: 14.5, elevation: L.PLINTH + 2.0, color: '#f0b56e', strength: 1.0, reach: 3.5, on: 'nb_door' },
    { id: 'kitchen_l', of: 'kitchen#glow', color: '#e8963a', reach: 6.5 },
    { id: 'lamp', of: 'abajur#lamp', color: '#e8963a', strength: 2.2, reach: 2.6 },
    { id: 'stove_l', of: 'stove#fire', color: '#e07a35', strength: 0.8, reach: 1.6, flicker: 0.4 },
    { id: 'hall_l', across: L.DOOR.a, distance: 13.0, elevation: L.PLINTH + 2.0, color: '#f0b56e', strength: 1.5, reach: 4.5, on: 'door' },
    { id: 'porch_l', of: 'porch_bulb#bulb', color: '#f2c27e', strength: 1.3, reach: 5, on: 'porch_light' },
  ],
  state,
  states,
  objects,
  music: {
    scale: 'A_FLAT_MAJOR_F_MINOR',
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
