// Writes scenes/dom-opus/scene.json from the scene's lib (the plan, the furniture, the seats, the keys).
// node tools/dom-opus/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/dom-opus';
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
add({ id: 'sky', name: 'Небо', sky: true });
add({ id: 'outside', name: 'Огороды', across: A(L.WINDOW.x), distance: 30, facing: 180, height: 9, box: [-40, -9, 40, 0.3] });
add({ id: 'yard', name: 'Снег', plane: true, across: A(L.WINDOW.x), distance: 18, elevation: 0, width: 80, depth: 27 });
add({ id: 'far_train', name: 'Электричка', glows: true, across: L.FAR_TRAIN.from, distance: L.FAR_TRAIN.z, facing: 180, place: { across: 'far_train_x' },
  height: 1.2, box: [-7.2, -1.5, 7.2, 0.1] });
add({ id: 'father_far', name: 'Сарафанов вдали', across: L.FATHER_FAR.from, distance: L.FATHER_FAR.z, facing: 180, place: { across: 'father_x' },
  height: 1.7, box: [-0.6, -1.8, 0.6, 0.05] });

// ── the rooms: the floor, the ceiling, the walls (cards facing in), the doorway between ──
add({ id: 'floor', name: 'Пол', plane: true, walk: true, inside: true, across: 2, distance: 2, elevation: 0, width: 8, depth: 4 });
add({ id: 'ceiling', name: 'Потолок', plane: true, inside: true, across: 2, distance: 2, elevation: H, width: 8, depth: 4, tilt: 180 });
add({ id: 'k_back', name: 'Кухня', inside: true, across: 0, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'k_left', name: 'Кухня', inside: true, across: -2, distance: 2, facing: 90, height: H, box: wallBox(4) });
{
  const a = A(L.DOOR.x), d0 = a - L.DOOR.w / 2, d1 = a + L.DOOR.w / 2;
  add({ id: 'k_near_a', name: 'Кухня', inside: true, across: (d0 - 2) / 2, distance: 0, facing: 0, height: H, box: wallBox(d0 + 2) });
  add({ id: 'k_near_b', name: 'Кухня', inside: true, across: (d1 + 2) / 2, distance: 0, facing: 0, height: H, box: wallBox(2 - d1) });
  add({ id: 'k_near_top', name: 'Кухня', inside: true, across: a, distance: 0, elevation: L.DOOR.h, facing: 0, height: H - L.DOOR.h,
    box: [-L.DOOR.w / 2 - 0.02, -(H - L.DOOR.h) - 0.02, L.DOOR.w / 2 + 0.02, 0.02] });
}
add({ id: 'k_right_a', name: 'Кухня', inside: true, ...SAR, across: 2, distance: L.DOORWAY.z0 / 2, facing: 270, height: H, box: wallBox(L.DOORWAY.z0) });
add({ id: 'k_right_b', name: 'Кухня', inside: true, ...SAR, across: 2, distance: (L.DOORWAY.z1 + 4) / 2, facing: 270, height: H, box: wallBox(4 - L.DOORWAY.z1) });
add({ id: 'k_lintel', name: 'Кухня', inside: true, ...SAR, across: 2, distance: (L.DOORWAY.z0 + L.DOORWAY.z1) / 2, elevation: L.DOORWAY.h, facing: 270,
  height: H - L.DOORWAY.h, box: [-0.52, -(H - L.DOORWAY.h) - 0.02, 0.52, 0.02] });
add({ id: 'r_back', name: 'Комната', inside: true, across: 4, distance: 4, facing: 180, height: H, box: wallBox(4) });
add({ id: 'r_right', name: 'Комната', inside: true, ...SAR, across: 6, distance: 2, facing: 270, height: H, box: wallBox(4) });
add({ id: 'r_near', name: 'Комната', inside: true, across: 4, distance: 0, facing: 0, height: H, box: wallBox(4) });
add({ id: 'hall', name: 'Сени', inside: true, across: A(L.DOOR.x), distance: -1.6, facing: 0, height: 2.4, box: [-1.4, -2.45, 1.4, 0.05] });
// beyond Сарафанов's door: his room, dim, his lamp (the wedge's light)
add({ id: 'sar_room', name: 'Комната Сарафанова', inside: true, across: 6.7, distance: 3.5, facing: 270, height: 2.4, box: [-0.85, -2.45, 0.85, 0.05] });

// ── the window, the doors ──
add({ id: 'window', name: 'Окно', inside: true, translucent: 0.6, across: A(L.WINDOW.x), distance: 3.975, elevation: L.WINDOW.sill, facing: 180,
  height: L.WINDOW.h, box: [-L.WINDOW.w / 2 - 0.02, -L.WINDOW.h - 0.02, L.WINDOW.w / 2 + 0.02, 0.02], uniforms: { hole: 0 } });
add({ id: 'window_frame', name: 'Окно', inside: true, across: A(L.WINDOW.x), distance: 3.96, elevation: L.WINDOW.sill, facing: 180, height: L.WINDOW.h,
  box: [-L.WINDOW.w / 2 - 0.2, -L.WINDOW.h - 0.15, L.WINDOW.w / 2 + 0.2, 0.12] });
add({ id: 'door', name: 'Дверь', inside: true, across: A(L.DOOR.x) + L.DOOR.w / 2, distance: 0.03, facing: 0, place: { facing: 'door_f' },
  height: L.DOOR.h, box: [-0.05, -L.DOOR.h - 0.05, L.DOOR.w + 0.05, 0.05] });
add({ id: 'sar_door', name: 'Дверь Сарафанова', inside: true, ...SAR, across: 6 - 0.03, distance: L.SAR_DOOR.z0, facing: 270, place: { facing: 'sar_door_f' },
  height: 2.0, box: [-(L.SAR_DOOR.z1 - L.SAR_DOOR.z0) - 0.05, -2.05, 0.05, 0.05] });

// ── the kitchen's things ──
add({ id: 'stove', name: 'Печь', inside: true, across: A(L.STOVE.front), distance: (L.STOVE.z0 + L.STOVE.z1) / 2, facing: 90, height: L.STOVE.h,
  box: [-0.62, -L.STOVE.h - 0.05, 0.62, 0.03] });
add({ id: 'stove_side', name: 'Печь', inside: true, across: (A(L.STOVE.front) - 2) / 2, distance: L.STOVE.z0, facing: 180, height: L.STOVE.h,
  box: [-0.4, -L.STOVE.h - 0.05, 0.4, 0.03] });
{
  const T = L.TABLE, cx = A((T.x0 + T.x1) / 2), cz = (T.z0 + T.z1) / 2, w = T.x1 - T.x0, d = T.z1 - T.z0;
  add({ id: 'table', name: 'Стол', plane: true, inside: true, across: cx, distance: cz, elevation: T.h, width: w, depth: d, shadow: { light: 'lamp', onto: [] } });
  add({ id: 'table_end', name: 'Стол', inside: true, across: cx, distance: T.z0, facing: 180, height: T.h, box: [-w / 2 - 0.04, -T.h - 0.03, w / 2 + 0.04, 0.03],
    copies: [{ across: cx, distance: T.z0, facing: 180 }, { across: cx, distance: T.z1, facing: 0 }] });
  add({ id: 'table_side', name: 'Стол', inside: true, across: A(T.x0), distance: cz, facing: 270, height: T.h, box: [-d / 2 - 0.04, -T.h - 0.03, d / 2 + 0.04, 0.03],
    copies: [{ across: A(T.x0), distance: cz, facing: 270 }, { across: A(T.x1), distance: cz, facing: 90 }] });
}
add({ id: 'abajur', name: 'Абажур', inside: true, glows: true, across: A(L.LAMP[0]), distance: L.LAMP[1], elevation: L.LAMP[2], height: 0.5, box: [-0.4, -0.55, 0.4, 0.12] });
add({ id: 'chairs', name: 'Стул', inside: true, across: A(L.SEATS.L1[0]), distance: L.SEATS.L1[1], facing: 180, height: 0.95, box: [-0.3, -1.0, 0.3, 0.03],
  copies: Object.values(L.SEATS).map(([x, z, turn]) => ({ across: A(x), distance: z, facing: 180, flip: turn === 270 })) });
add({ id: 'clock', name: 'Часы', inside: true, across: -2 + 0.03, distance: L.CLOCK.z, elevation: L.CLOCK.face - 0.74, facing: 90, height: 0.9, box: [-0.2, -0.95, 0.2, 0.05] });
add({ id: 'hook', name: 'Вешалка', inside: true, across: A(L.HOOK[0]), distance: L.HOOK[1], elevation: 0, facing: 0, height: 1.9, box: [-0.3, -1.95, 0.3, 0.03] });
add({ id: 'stool', name: 'Табурет', inside: true, across: A(L.STOOL[0]), distance: L.STOOL[1], facing: 180, height: 0.7, box: [-0.3, -0.75, 0.3, 0.03] });
add({ id: 'rucksack', name: 'Рюкзак', inside: true, across: A(0.62), distance: 2.42, facing: 180, height: 0.6, box: [-0.3, -0.7, 0.3, 0.03] });
add({ id: 'rucksack_door', name: 'Рюкзак', inside: true, across: A(2.5), distance: 0.3, facing: 180, height: 0.6, box: [-0.3, -0.7, 0.3, 0.03] });
add({ id: 'coat_chair', name: 'Пальто', inside: true, across: A(L.SEATS.R1[0] + 0.22), distance: L.SEATS.R1[1], facing: 180, height: 1.0, box: [-0.3, -1.05, 0.3, 0.03] });

// ── the room's things ──
add({ id: 'cupboard', name: 'Буфет', inside: true, across: A(L.CUPBOARD.x), distance: L.CUPBOARD.z, facing: 0, height: L.CUPBOARD.h,
  box: [-L.CUPBOARD.w / 2 - 0.05, -L.CUPBOARD.h - 0.05, L.CUPBOARD.w / 2 + 0.05, 0.03] });
add({ id: 'sofa', name: 'Диван', inside: true, across: A((L.SOFA.x0 + L.SOFA.x1) / 2), distance: L.SOFA.z + 0.1, facing: 180, height: 0.9, box: [-1.05, -0.95, 1.05, 0.03] });
add({ id: 'cot', name: 'Раскладушка', inside: true, across: A(L.COT.x + L.COT.w / 2), distance: (L.COT.z0 + L.COT.z1) / 2, facing: 90, height: 0.5,
  box: [-(L.COT.z1 - L.COT.z0) / 2 - 0.05, -0.6, (L.COT.z1 - L.COT.z0) / 2 + 0.05, 0.03] });
add({ id: 'cot_top', name: 'Раскладушка', plane: true, inside: true, across: A(L.COT.x), distance: (L.COT.z0 + L.COT.z1) / 2, elevation: L.COT.top,
  width: L.COT.w, depth: L.COT.z1 - L.COT.z0 });
add({ id: 'cot_chair', name: 'Пальто', inside: true, across: A(L.COT_CHAIR[0]), distance: L.COT_CHAIR[1], facing: 90, height: 1.0, box: [-0.35, -1.05, 0.35, 0.03] });
add({ id: 'case_chair', name: 'Футляр', inside: true, across: A(L.CASE_CHAIR[0]), distance: L.CASE_CHAIR[1], facing: 270, height: 1.0, box: [-0.35, -1.05, 0.35, 0.03] });

// ── the people ──
for (const id of L.PEOPLE) {
  add({ id, name: L.NAMES[id], inside: true, person: { cast: 'cast', who: id, turn: 90 }, across: A(L.SPOT.hall[0]), distance: L.SPOT.hall[1],
    place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
}

// ── the close-ups (modules/closeups): the hands at the stove, the tea, the snuffbox ──
add({ id: 'hands', name: 'Руки', insert: 'hands' });
add({ id: 'tea', name: 'Чай', insert: 'tea' });
add({ id: 'box', name: 'Табакерка', insert: 'box' });

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
  hour: { range: [0, 1], means: 'вес ночи (образ света hour): 0.25 серый рассвет … 0.9 ночь' },
  beat: { values: [null, ...BEATS], means: 'кусок фильма: игра ставит имя — кусок играется с начала (modules/beats)' },
  beat_next: { values: [null, ...BEATS], means: 'какой кусок склейкой будет следующим: сцена готовит его первый кадр' },
  warm: { range: [0, 1], means: 'ключ партии: тепло дома — лампа под абажуром 0.6 + 0.4·warm (ставит кусок)' },
  frost: { range: [0, 1], means: 'ключ партии: иней на окне, от углов к середине (полупрозрачный)' },
  box_where: { values: ['cupboard', 'busygin'], means: 'ключ партии: где табакерка после II.4 — в буфете · у Бусыгина' },
  vasenka_by: { values: [0, 1], means: 'ключ партии: в pack Васенька проходит и встаёт рядом с Бусыгиным' },
  silva_door: { values: [0, 1], means: 'ключ партии: в go_out Сильва открывает дверь и ждёт (1) · выходит первым, дверь хлопает (0)' },
  came: { values: ['none', 'father', 'family'], means: 'ключ партии: кто был с ним на платформе (home_late, home_anyway)' },
  nina_end: { values: ['home', 'gone'], means: 'ключ партии: Нина в концовке дома · уехала (стул пуст, пальто на крючке нет)' },
  nina_came: { values: [0, 1], means: 'ключ партии: Нина пришла с ним с платформы и садится рядом' },
  vasya_end: { values: ['home', 'taiga'], means: 'ключ партии: рюкзак Васеньки — нет · собран у двери' },
  hurt: { values: [0, 1], means: 'как Сарафанов примет правду в confess: сядет и протянет руку (0) · к окну спиной (1); ставит игра перед куском' },
  heard: { values: [0, 1], means: 'Сарафанов слышал скрип: в caught он уже стоит в проёме (1); ставит игра перед куском' },
  lamp: { range: [0, 1], smooth: true, means: 'лампа под абажуром (ставит кусок: 0.6 + 0.4·warm; 0 — погашена)' },
  stove_door: { range: [0, 1], smooth: true, means: 'печная дверца: 0 закрыта … 1 открыта, огонь виден' },
  door: { range: [0, 1], smooth: true, means: 'входная дверь: 0 закрыта … 1 открыта внутрь (на пружине)' },
  door_f: num('поворот входной двери, градусы — ставит скрипт по door'),
  sar_door: { range: [0, 1], smooth: true, means: 'дверь в комнату Сарафанова: 0.08 — всегда чуть приоткрыта … 1 открыта' },
  sar_door_f: num('поворот двери Сарафанова, градусы — ставит скрипт по sar_door'),
  sar_light: { range: [0, 1], smooth: true, means: 'его лампа за приоткрытой дверью: клин света через комнату, полоса на полу кухни у проёма' },
  stir: { range: [0, 1], smooth: true, means: 'Сарафанов просыпается («На цыпочках»): его лампа = stir' },
  box_at: { values: ['shelf', 'none', 'table', 'near'], means: 'табакерка: на полке буфета · нигде (в руке, в кармане) · на клеёнке между ними · на клеёнке перед Бусыгиным' },
  coat_b: { values: ['none', 'hook', 'cot', 'arm', 'chair'], means: 'пальто Бусыгина: на нём · на крючке · на стуле у раскладушки · через руку · на спинке его стула' },
  rucksack: { values: ['none', 'chair', 'door'], means: 'рюкзак Васеньки: нет · у его стула · собран у двери' },
  table_set: { values: [0, 1], means: 'стол накрыт (IV): тарелки, стаканы на шестерых, бутылка' },
  puddle: { values: [0, 1], means: 'лужица чая на клеёнке (след «Чая»)' },
  sheet_on: { values: [0, 1], means: 'исписанный нотный лист на клеёнке' },
  kettle_at: { values: ['stove', 'table', 'pushed', 'none'], means: 'чайник: на плите · на столе у Сарафанова · пододвинут к Бусыгину · в руке' },
  glass_b: { values: ['none', 'table', 'hand'], means: 'стакан Бусыгина: нет · на клеёнке (точка table#glass) · в руке' },
  glass_s: { values: ['none', 'table', 'hand'], means: 'стакан Сарафанова: нет · на клеёнке · в руке' },
  hat_on_stool: { values: [0, 1], means: 'шапка Сарафанова на табурете у двери' },
  case_on: { values: [0, 1], means: 'футляр кларнета на стуле в комнате' },
  nina_coat: { values: [0, 1], means: 'пальто Нины на крючке (она дома)' },
  far_train: { range: [0, 1], smooth: true, means: 'огни электрички проходят за окном слева направо (двигает игра в «Инее»)' },
  far_train_x: num('где дальний поезд вдоль огородов, метры — ставит скрипт по far_train'),
  father_x: num('где маленькая фигура Сарафанова с футляром за окном (morning), метры'),
  father_on: { values: [0, 1], means: 'фигура Сарафанова за окном видна' },
  hole: { range: [0, 1], smooth: true, means: 'протёртая дыра в инее (круг в середине стекла; двигает игра в «Инее»; читает шейдер)' },
  sneak: { range: [0, 1], smooth: true, means: 'куда крадутся: путь через кухню от печи (0) до входной двери (1), походка tiptoe (ставит игра)' },
  sneak_at: { range: [0, 1], means: 'где они сейчас на этом пути (ставит сцена 10 раз в секунду)' },
  hands: { range: [0, 1], means: 'вставка «Руки» (кадр stove модуля closeups): 0 закрыта · 1 открыта' },
  thaw: { range: [0, 1], smooth: true, means: 'вставка «Руки»: иней тает, пальцы распрямляются' },
  rub: { range: [-1, 1], smooth: true, means: 'вставка «Руки»: ладони скользят друг по другу' },
  tea: { range: [0, 1], means: 'вставка «Чай» (кадр tea)' },
  which: { range: [0, 1], smooth: true, means: 'вставка «Чай»: чайник над первым → над вторым стаканом' },
  pour: { values: [0, 1], means: 'вставка «Чай»: струя' },
  glass1: { range: [0, 1], smooth: true, means: 'вставка «Чай»: уровень в первом стакане' },
  glass2: { range: [0, 1], smooth: true, means: 'вставка «Чай»: уровень во втором стакане' },
  spill: { values: [0, 1], means: 'вставка «Чай»: чай бежит через край' },
  shake: { values: [0, 1], means: 'вставка «Чай»: носик дрожит' },
  box: { range: [0, 1], means: 'вставка «Табакерка» (кадр box)' },
  box_mode: { values: ['take', 'give'], means: 'вставка «Табакерка»: взять · вернуть' },
  ...Object.fromEntries([1, 2, 3, 4].map(i => [`finger${i}`, { range: [0, 1], smooth: true, means: `вставка «Табакерка» (take): палец ${i} молодой руки сжимается` }])),
  old: { range: [0, 1], smooth: true, means: 'вставка «Табакерка» (take): старая рука уходит 1 → 0' },
  push: { range: [0, 1], smooth: true, means: 'вставка «Табакерка» (give): табакерка едет к старой руке' },
  old_close: { range: [0, 1], smooth: true, means: 'вставка «Табакерка» (give): старые пальцы смыкаются на ней' },
  ...Object.fromEntries(L.PEOPLE.flatMap(p => [[`${p}_a`, num(`где ${L.NAMES[p]}: метры вправо`)], [`${p}_d`, num(`где ${L.NAMES[p]}: метры вглубь`)]])),
};

const scene = {
  engine: 3,
  title: 'Дом Сарафановых',
  caption: 'Кухня под оранжевым абажуром.',
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
    { id: 'lamp', of: 'abajur#lamp', color: '#f1c587', strength: 1.7, reach: 4.2, on: 'lamp' },
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
