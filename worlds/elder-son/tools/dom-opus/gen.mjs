// Writes scenes/dom-opus/scene.json from the scene's lib (the rooms' plan, the furniture, the seats).
// node tools/dom-opus/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/dom-opus';
mkdirSync(`${DIR}/elements`, { recursive: true });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const objects = [];
const add = o => (objects.push(o), o);
const H = L.H;
const wallBox = w => [-w / 2 - 0.02, -H - 0.02, w / 2 + 0.02, 0.02];

add({ id: 'sky', name: 'Небо', sky: true });
// outside the window: the gardens under snow, the far platform's lights
add({ id: 'outside', name: 'Огороды', across: L.WINDOW.a, distance: 30, facing: 180, height: 9, box: [-40, -9, 40, 0.3] });
add({ id: 'yard', name: 'Снег', plane: true, across: 0, distance: 18, elevation: 0, width: 80, depth: 27 });

// the rooms: the floor, the ceiling, the walls (cards facing in), the doorway between
add({ id: 'floor', name: 'Пол', plane: true, walk: true, inside: true, across: 2, distance: 2, elevation: 0, width: 8, depth: 4 });
add({ id: 'ceiling', name: 'Потолок', plane: true, inside: true, across: 2, distance: 2, elevation: H, width: 8, depth: 4, tilt: 180 });
add({ id: 'k_back', name: 'Кухня', inside: true, across: 0, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'k_left', name: 'Кухня', inside: true, across: -2, distance: 2, facing: 90, height: H, box: wallBox(4) });
// the near wall in three pieces round the door (no painting has to know which way a card facing in runs)
{
  const d0 = L.DOOR.a - L.DOOR.w / 2, d1 = L.DOOR.a + L.DOOR.w / 2;
  add({ id: 'k_near_a', name: 'Кухня', inside: true, across: (d0 - 2) / 2, distance: 0, facing: 0, height: H, box: wallBox(d0 + 2) });
  add({ id: 'k_near_b', name: 'Кухня', inside: true, across: (d1 + 2) / 2, distance: 0, facing: 0, height: H, box: wallBox(2 - d1) });
  add({ id: 'k_near_top', name: 'Кухня', inside: true, across: L.DOOR.a, distance: 0, elevation: L.DOOR.h, facing: 0, height: H - L.DOOR.h,
    box: [-L.DOOR.w / 2 - 0.02, -(H - L.DOOR.h) - 0.02, L.DOOR.w / 2 + 0.02, 0.02] });
}
add({ id: 'k_right_a', name: 'Кухня', inside: true, across: 2, distance: L.DOORWAY.d0 / 2, facing: 270, height: H, box: wallBox(L.DOORWAY.d0) });
add({ id: 'k_right_b', name: 'Кухня', inside: true, across: 2, distance: (L.DOORWAY.d1 + 4) / 2, facing: 270, height: H, box: wallBox(4 - L.DOORWAY.d1) });
add({ id: 'k_lintel', name: 'Кухня', inside: true, across: 2, distance: (L.DOORWAY.d0 + L.DOORWAY.d1) / 2, elevation: L.DOORWAY.h, facing: 270, height: H - L.DOORWAY.h, box: [-0.52, -(H - L.DOORWAY.h) - 0.02, 0.52, 0.02] });
add({ id: 'r_back', name: 'Комната', inside: true, across: 4, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'r_right', name: 'Комната', inside: true, across: 6, distance: 2, facing: 270, height: H, box: wallBox(4) });
add({ id: 'r_near', name: 'Комната', inside: true, across: 4, distance: 0, facing: 0, height: H, box: wallBox(4) });
add({ id: 'hall', name: 'Сени', inside: true, across: L.DOOR.a, distance: -1.6, facing: 0, height: 2.4, box: [-1.4, -2.45, 1.4, 0.05] });

// the window (its frost), the door, the stove, the table, the lamp, the chairs, the clock, the hook, the stool,
// the cupboard, the rucksack
add({ id: 'window', name: 'Окно', inside: true, across: L.WINDOW.a, distance: 3.985, elevation: L.WINDOW.sill, facing: 180, height: L.WINDOW.h,
  box: [-L.WINDOW.w / 2 - 0.2, -L.WINDOW.h - 0.25, L.WINDOW.w / 2 + 0.2, 0.12] });
add({ id: 'door', name: 'Дверь', inside: true, across: L.DOOR.a + L.DOOR.w / 2, distance: 0.03, facing: 0, place: { facing: 'door_f' },
  height: L.DOOR.h, box: [-0.05, -L.DOOR.h - 0.05, L.DOOR.w + 0.05, 0.05] });
add({ id: 'stove', name: 'Печь', inside: true, across: L.STOVE.front, distance: (L.STOVE.d0 + L.STOVE.d1) / 2, facing: 90, height: L.STOVE.h,
  box: [-0.62, -L.STOVE.h - 0.05, 0.62, 0.03] });
add({ id: 'stove_side', name: 'Печь', inside: true, across: (L.STOVE.front - 2) / 2, distance: L.STOVE.d0, facing: 180, height: L.STOVE.h,
  box: [-0.4, -L.STOVE.h - 0.05, 0.4, 0.03] });
add({ id: 'table', name: 'Стол', inside: true, across: L.TABLE.a, distance: L.TABLE.d - L.TABLE.depth / 2, facing: 180, height: L.TABLE.h,
  box: [-L.TABLE.w / 2 - 0.05, -L.TABLE.h - 0.03, L.TABLE.w / 2 + 0.05, 0.03] });
add({ id: 'table_top', name: 'Стол', plane: true, inside: true, across: L.TABLE.a, distance: L.TABLE.d, elevation: L.TABLE.h,
  width: L.TABLE.w, depth: L.TABLE.depth, shadow: { light: 'lamp', onto: [] } });
add({ id: 'abajur', name: 'Абажур', inside: true, glows: true, across: L.LAMP[0], distance: L.LAMP[1], elevation: L.LAMP[2], height: 0.5, box: [-0.4, -0.55, 0.4, 0.12] });
add({ id: 'chairs', name: 'Стул', inside: true, across: L.SEAT.l[0] - 0.12, distance: L.SEAT.l[1], facing: 180, height: 0.95, box: [-0.3, -1.0, 0.3, 0.03],
  copies: [{ across: L.SEAT.l[0] - 0.12, distance: L.SEAT.l[1] + 0.02 }, { across: L.SEAT.r[0] + 0.12, distance: L.SEAT.r[1] + 0.02, flip: true }] });
add({ id: 'clock', name: 'Часы', inside: true, across: -1.35, distance: 3.97, elevation: 1.55, facing: 180, height: 0.9, box: [-0.2, -0.9, 0.2, 0.05] });
add({ id: 'hook', name: 'Вешалка', inside: true, across: L.HOOK[0], distance: L.HOOK[1], elevation: 0, facing: 0, height: 1.9, box: [-0.4, -1.95, 0.4, 0.03] });
add({ id: 'stool', name: 'Табурет', inside: true, across: L.STOOL[0], distance: L.STOOL[1], facing: 180, height: 0.7, box: [-0.3, -0.75, 0.3, 0.03] });
add({ id: 'cupboard', name: 'Буфет', inside: true, across: L.CUPBOARD.a, distance: L.CUPBOARD.d, facing: 180, height: L.CUPBOARD.h,
  box: [-L.CUPBOARD.w / 2 - 0.05, -L.CUPBOARD.h - 0.05, L.CUPBOARD.w / 2 + 0.05, 0.03] });
add({ id: 'sofa', name: 'Диван', inside: true, across: 4.7, distance: 3.55, facing: 180, height: 0.9, box: [-1.0, -0.95, 1.0, 0.03] });
add({ id: 'rucksack', name: 'Рюкзак', inside: true, across: L.SEAT.r[0] + 0.45, distance: L.SEAT.r[1] - 0.25, facing: 180, height: 0.6, box: [-0.3, -0.65, 0.3, 0.03] });

// the people
const person = (id, name, who, a, d, turn) => add({ id, name, inside: true, person: { cast: 'cast', who, turn }, across: a, distance: d,
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
const E = L.END.enter;
person('busygin', 'Бусыгин', 'busygin', E.busygin_a, E.busygin_d, E.busygin_turn);
person('silva', 'Сильва', 'silva', E.silva_a, E.silva_d, E.silva_turn);
person('vasenka', 'Васенька', 'vasenka', E.vasenka_a, E.vasenka_d, E.vasenka_turn);
person('sarafanov', 'Сарафанов', 'sarafanov', E.sarafanov_a, E.sarafanov_d, E.sarafanov_turn);

// the state: the end of `enter` — the old man a step from his «son» at the stove (the first sight)
const state = { hour: 0.9, beat: null, beat_next: null, warm: 0.36, frost: 0.25, lamp: 0.74, door: 0, door_f: 0, stove_door: 1,
  box_at: 'shelf', coat_b: 'none', rucksack: 'chair', hat_on_stool: 1, ...L.CAM.two };
for (const id of ['busygin', 'silva', 'vasenka', 'sarafanov']) {
  for (const k of ['a', 'd', 'turn', 'do', 'look', 'wear', 'with']) if (E[`${id}_${k}`] !== undefined) state[`${id}_${k}`] = E[`${id}_${k}`];
}
const num = means => ({ type: 'number', means });
const states = {
  hour: { range: [0, 1], means: 'время за окном: 0.9 ночь' },
  beat: { values: [null, 'kitchen', 'warm_up', 'enter', 'embrace', 'box_out', 'box_take', 'box_give', 'box_kept', 'box_back'], means: 'кусок фильма: игра ставит имя — кусок играется с начала' },
  beat_next: { type: 'string', means: 'какой кусок будет следующим: сцена готовит его первый кадр' },
  warm: { range: [0, 1], means: 'ключ партии: лампа под абажуром — 0.6 + 0.4·warm (скрипт ставит lamp)' },
  frost: { range: [0, 1], means: 'ключ партии: иней на окне, от углов к середине' },
  lamp: { range: [0, 1], smooth: true, means: 'лампа под абажуром — ставит скрипт по warm' },
  door: { range: [0, 1], smooth: true, means: 'входная дверь: 0 закрыта … 1 открыта внутрь' },
  door_f: num('поворот двери, градусы — ставит скрипт по door'),
  stove_door: { range: [0, 1], smooth: true, means: 'печная дверца: 0 закрыта … 1 открыта, огонь виден' },
  box_at: { values: ['shelf', 'none', 'table'], means: 'табакерка: на полке буфета · ни там ни там (в руке) · на клеёнке' },
  coat_b: { values: ['none', 'hook'], means: 'пальто Бусыгина: на нём · на крючке у двери (cot, arm, chair этой версии сцены нет)' },
  rucksack: { values: ['none', 'chair', 'door'], means: 'рюкзак Васеньки: нет · у его стула (door — у двери: в этой версии как chair нет)' },
  hat_on_stool: { values: [0, 1], means: 'шапка Сарафанова на табурете у двери (ставит кусок)' },
  ...Object.fromEntries(['busygin', 'silva', 'vasenka', 'sarafanov'].flatMap(p => [[`${p}_a`, num(`где ${p}: метры вправо`)], [`${p}_d`, num(`где ${p}: метры вглубь`)]])),
};

const scene = {
  engine: 3,
  title: 'Дом Сарафановых (Opus)',
  caption: 'Кухня под оранжевым абажуром. Ночь.',
  horizon: 0.52,
  camera: { mode: 'roam', area: [-1.9, 5.9, 0.1, 3.9] },
  modules: ['cast'],
  light: {
    tint: '#8a8fb0', tintStrength: 0.05, vignette: 0.5, grain: 0.2,
    haze: 0.03, hazeColor: '#3a3036', hazeGlow: 0.5, shafts: 0,
    brightness: 1.05, saturation: 0.82, ambient: 0.5, ambientColor: '#8a90b2', bounce: 0.4, inside: 0.3,
  },
  lights: [
    // the lamp's light a warm yellow-white; the orange is the shade's own (it glows)
    { id: 'lamp', of: 'abajur#lamp', color: '#f1c587', strength: 1.7, reach: 4.2, on: 'lamp' },
    { id: 'fire', of: 'stove#fire', color: '#e47a32', strength: 1.4, reach: 2.4, flicker: 0.5, on: 'stove_door' },
    { id: 'snow_light', of: 'window', daylight: 0.8 },
    // the room beyond the doorway: a little light from Сарафанов's door and the street, so the cupboard is seen
    { id: 'room_light', across: 4.6, distance: 1.6, elevation: 2.0, color: '#c9b79a', strength: 0.5, reach: 3.4 },
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
  },
};
writeFileSync(`${DIR}/scene.json`, `${JSON.stringify(scene, null, 2)}\n`);
console.log('objects', objects.length);
