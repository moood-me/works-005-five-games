// «Палуба» — the scene's generator: `node tools/paluba.js` (from the world's root) writes scenes/paluba/scene.json — the
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

// ── the square sails (lib.js SQUARE: "Secret"'s): [name, Russian name, the mast's distance, the yard hoisted and the
// foot over the main deck, half its width at the foot, rise, seed, how far down its box goes] — each two halves
// hinged at the mast, hung at the yard hoisted (a topgallant's by its key: it goes up with the topsail's yard) ──
const SAILS = [
  ['fore_course', 'Фок-нижний', 23.45, 10.4, 3.9, 7.2, 0, 1, 7.1], ['fore_top', 'Фок-марсель', 23.45, 17, 10.9, 6.4, 1, 2, 6.7], ['fore_tg', 'Фок-брамсель', 23.45, 21.8, 17.4, 5.1, 1, 3, 5],
  ['main_course', 'Грот-нижний', 14.45, 11.4, 3.9, 7.8, 0, 4, 8.1], ['main_top', 'Грот-марсель', 14.45, 18.6, 11.9, 7.0, 1, 5, 7.3], ['main_tg', 'Грот-брамсель', 14.45, 23.9, 19, 5.6, 1, 6, 5.5],
];
const sails = [];
for (const [name, ru, distance, high, foot, w1, rise, seed, down] of SAILS) {
  for (const side of [-1, 1]) {
    const id = `${name}_${side < 0 ? 'l' : 'r'}`, w = w1 + 0.9, tg = name.endsWith('_tg');
    sails.push(on(id, `${ru}, ${side < 0 ? 'левая' : 'правая'} половина`, KEEL, distance, +(high + WAIST).toFixed(2), {
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
  ['grey', 'Грей', 'grey', 'gr', [KEEL, 2.28, 0], 0], ['assol', 'Ассоль', 'assol', 'as', [1.32, 5.1, 0], 90], ['gop', 'Гоп', 'gop', 'go', [-3.7, 13, WAIST], 200],
  ['panten', 'Пантен', 'panten', 'pa', [-4.4, -0.6, 0], 0], ['letika', 'Летика', 'letika', 'le', [0.2, 5.2, 0], 20],
  ['sailor', 'Матрос', 'sailor', 'sa', [-0.98, 4.05, 0], 97], ['crew2', 'Матрос', 'sailor', 'cr', [-0.7, 3.27, 0], 42],
  ['sailor3', 'Матрос', 'sailor', 's3', [-3.4, 9.2, WAIST], 180], ['sailor4', 'Матрос', 'sailor', 's4', [-1.4, 9.2, WAIST], 180],
  ['zimmer', 'Циммер', 'zimmer', 'zi', [-1.2, 13.2, WAIST], 180], ['musician1', 'Скрипач', 'musician', 'm1', [-3.4, 26.5, WAIST], 180],
  ['musician2', 'Виолончелист', 'cellist', 'm2', [-1.4, 26.5, WAIST], 180],
];
const people = PEOPLE.map(([id, name, who, k, [a, d, e], turn]) => on(id, name, a, d, e, {
  person: { cast: 'cast', who, turn }, place: { across: `${k}_a`, distance: `${k}_d`, elevation: `${k}_e` }, shadow: { onto: DECKS, soft: 0.2 },
}));
// Longren, a sailor of the mail steamer: on her deck (lib.js LONGREN), by her stern, at her port rail
const LONGREN = [19, 0.45, STEAMER_DECK];
people.push({ id: 'longren', name: 'Лонгрен', on: 'steamer', across: LONGREN[0], distance: LONGREN[1], elevation: LONGREN[2],
  person: { cast: 'cast', who: 'longren', turn: 135 }, place: { across: 'lo_a', distance: 'lo_d', elevation: 'lo_e' }, shadow: { onto: ['steamer_deck'], soft: 0.2 } });

// the silk's stacks (lib.js STACKS)
const STACKS = [[-5.0, 11.6], [-0.2, 13.4], [-4.7, 15.2], [-1.0, 16.4], [-2.8, 12.4]];

const objects = [
  { id: 'sky', name: 'Небо', sky: true, uniforms: { ...N.UNIFORMS } },
  { id: 'sea', name: 'Море', plane: true, across: 0, distance: -15000, elevation: SEA, width: 40000, depth: 60000,
    reflect: { strength: 0.75, fade: 0, blur: 0.012, rough: 0.5, ripple: 0.4 }, uniforms: { storm: 0 } },
  { id: 'kaperna', name: 'Каперна', across: 0, distance: KAPERNA, elevation: SEA, height: 60, box: [-620, -70, 520, 2] },
  { id: 'steamer', name: 'Почтовый пароход', across: 15000, distance: 0, elevation: SEA, facing: 270, height: 22, box: [-26, -23, 26, 1],
    place: { across: 'steamer_x', distance: 'steamer_d' } },
  // her deck behind her painted side (3 m over the water, her bulwark a metre over it): Longren stands on it, the film's
  // camera rides her there
  { id: 'steamer_deck', name: 'Палуба парохода', plane: true, on: 'steamer', across: 0, distance: 3, elevation: STEAMER_DECK, width: 44, depth: 6, lit: true },
  { id: 'smoke', name: 'Дым парохода', particles: { ...K.SMOKE, at: 'steamer#funnel', amount: 'steamer_smoke' } },
  // Lisse: the quay alongside to starboard where she lies in port, the town behind it and across the basin
  { id: 'harbour', name: 'Причал Лисса', unseen: true, across: 3.35, distance: LISSE + 1 },
  { id: 'quay', name: 'Причал', on: 'harbour', distance: 9, elevation: -5, facing: 270, height: 4.6, box: [-70, -4.6, 70, 0] },
  { id: 'quay_top', name: 'Мостовая причала', plane: true, on: 'harbour', across: 16, distance: 9, elevation: -1.2, width: 32, depth: 140, lit: true },
  { id: 'lisse', name: 'Склады Лисса', on: 'harbour', across: 30, distance: 25, elevation: -1.2, facing: 270, height: 20, box: [-100, -20, 100, 0] },
  { id: 'lisse_town', name: 'Лисс', on: 'harbour', across: 60, distance: 25, elevation: -1.2, facing: 270, height: 22, box: [-100, -22, 100, 0] },
  { id: 'lisse_upper', name: 'Лисс за гаванью', on: 'harbour', across: -70, distance: 260, elevation: 2, facing: 180, height: 30, box: [-100, -31, 100, 0] },
  { id: 'quay_lamps', name: 'Фонари причала', on: 'harbour', across: 1.2, distance: 9, elevation: -1.2, facing: 270, height: 3.6, box: [-70, -3.8, 70, 0.02], glows: true },
  { id: 'lisse_windows', name: 'Окна складов', on: 'harbour', across: 29.9, distance: 25, elevation: -1.2, facing: 270, height: 20, box: [-100, -20, 100, 0], glows: true },
  { id: 'lisse_town_windows', name: 'Окна Лисса', on: 'harbour', across: 59.9, distance: 25, elevation: -1.2, facing: 270, height: 22, box: [-100, -22, 100, 0], glows: true },
  { id: 'lisse_upper_windows', name: 'Окна Лисса за гаванью', on: 'harbour', across: -70, distance: 259.9, elevation: 2, facing: 180, height: 30, box: [-100, -31, 100, 0], glows: true },
  // the ship: where she is and how she is turned (course), her roll about the keel (hull), her decks' frame (ship:
  // back at the viewer's place on the poop, 2.4 m to starboard of the keel, the poop deck's height)
  { id: 'course', name: 'Корабль в море', unseen: true, across: 0, distance: 0, facing: 180, place: { across: 'ship_x', distance: 'ship_d', facing: 'ship_f' } },
  { id: 'hull', name: 'Киль', unseen: true, on: 'course', across: KEEL, elevation: -2.5, facing: 90, place: { tilt: 'heel' } },
  { id: 'ship', name: 'Корабль', unseen: true, on: 'hull', distance: KEEL, elevation: 2.5, facing: 270 },
  { id: 'poop_deck', name: 'Ют', plane: true, on: 'ship', across: KEEL, distance: 1.5, elevation: 0, width: 8.2, depth: 9, lit: true, reflect: { strength: 0.14, fade: 3, blur: 0.12 } },
  { id: 'main_deck', name: 'Шкафут', plane: true, on: 'ship', across: KEEL, distance: 19, elevation: WAIST, width: 8.6, depth: 26, lit: true, reflect: { strength: 0.14, fade: 3, blur: 0.12 } },
  { id: 'hatch_top', name: 'Люк', plane: true, on: 'ship', across: KEEL, distance: 10.5, elevation: WAIST + 0.45, width: 2.6, depth: 3 },
  on('hatch', 'Комингс люка', KEEL, 9, WAIST, { facing: 180, height: 0.45, box: [-1.35, -0.47, 1.35, 0.01], shadow: shadow() }),
  on('bulwark_starboard', 'Правый борт', KEEL + 4.25, 7.5, WAIST, { facing: 270, height: 2.4, box: [-10.6, -2.5, 10.6, 0.01], shadow: shadow() }),
  on('bulwark_port', 'Левый борт', KEEL - 4.25, 7.5, WAIST, { facing: 90, height: 2.4, box: [-10.6, -2.5, 10.6, 0.01], shadow: shadow() }),
  on('bow_starboard', 'Правый борт у носа', KEEL + 2.3, 25, WAIST, { facing: 255, height: 1.7, box: [-7.4, -1.8, 7.4, 0.01] }),
  // her starboard side from outside, the bulwarks' other face down to the water (seen from the steamer, from her boat)
  on('side_starboard', 'Правый борт снаружи', KEEL + 4.25, 7.5, SEA, { facing: 270, height: 3.8, box: [-10.6, -3.85, 10.6, 0.01] }),
  on('side_bow_starboard', 'Правый борт у носа снаружи', KEEL + 2.3, 25, SEA, { facing: 255, height: 2.4, box: [-7.4, -2.45, 7.4, 0.01] }),
  // her boat at the starboard side by the poop's break: hung under the rail, lowered to the water (skiff_down)
  on('skiff', 'Шлюпка', KEEL + 5.4, 8, SEA, { facing: 270, height: 3.7, box: [-2.6, -3.75, 2.6, 0.25] }),
  on('bow_port', 'Левый борт у носа', KEEL - 2.3, 25, WAIST, { facing: 105, height: 1.7, box: [-7.4, -1.8, 7.4, 0.01] }),
  on('taffrail', 'Гакаборт', KEEL, -3, 0, { facing: 0, height: 1.05, box: [-4.2, -1.1, 4.2, 0.01] }),
  on('break_rail', 'Поручни юта', KEEL, 6, 0, { facing: 180, height: 1.05, box: [-4.2, -1.1, 4.2, 0.01], shadow: shadow({ strength: 0.45 }) }),
  on('wheel', 'Штурвал', KEEL, 2.6, 0, { facing: 180, height: 1.95, box: [-0.85, -2, 0.85, 0.01], shadow: shadow({ soft: 0.15 }) }),
  on('mizzen', 'Бизань-мачта', KEEL, 5.2, 0, { facing: 180, height: 19, box: [-3.2, -19.2, 3.2, 0.01], shadow: shadow({ strength: 0.45 }) }),
  on('spanker', 'Бизань', KEEL, 5.2, 0, { facing: 110, height: 14.5, box: [-6.3, -14.8, 0.8, -2.7], shadow: shadow({ strength: 0.4, soft: 0.3 }), translucent: 0.45, uniforms: cloth('spanker', -14.3, -3.2, 0, 9) }),
  on('spanker_gaff', 'Гафель бизани', KEEL, 5.2, 0, { facing: 110, height: 14.5, box: [-6.3, -14.6, 0.4, -12.3], inFront: ['spanker'] }),
  on('mainmast', 'Грот-мачта', KEEL, 14, WAIST, { facing: 180, height: 27, box: [-8.4, -27.3, 8.4, 0.01], shadow: shadow({ strength: 0.45, soft: 0.3 }) }),
  on('shrouds', 'Ванты', KEEL, 14.4, WAIST, { facing: 180, height: 18, box: [-4.5, -18.2, 4.5, 0.01] }),
  on('mainsail', 'Грот шхуны', KEEL, 14, WAIST, { facing: 125, height: 20, box: [-10.6, -20, 0.8, -2.4], shadow: shadow({ strength: 0.4, soft: 0.3 }), translucent: 0.45, uniforms: gaff('mainsail', 3.2, 19, 12) }),
  on('mainsail_spars', 'Гик и гафель грота', KEEL, 14, WAIST, { facing: 125, height: 20, box: [-10.6, -20, 0.6, -2.8], inFront: ['mainsail'] }),
  on('foremast', 'Фок-мачта', KEEL, 23, WAIST, { facing: 180, height: 24, box: [-7.8, -24.3, 7.8, 0.01], shadow: shadow({ strength: 0.45, soft: 0.3 }) }),
  on('foresail', 'Фок шхуны', KEEL, 23, WAIST, { facing: 125, height: 15.2, box: [-8.6, -15.2, 0.8, -1.4], translucent: 0.45, uniforms: gaff('foresail', 2.2, 14.2, 13) }),
  on('foresail_spars', 'Гик и гафель фока', KEEL, 23, WAIST, { facing: 125, height: 15.2, box: [-8.6, -15.2, 0.6, -1.8], inFront: ['foresail'] }),
  ...sails,
  on('lantern_port', 'Фонарь слева', KEEL - 3.95, 6, 1.05, { height: 0.36, box: [-0.14, -0.4, 0.14, 0.02], glows: true }),
  on('lantern_starboard', 'Фонарь справа', KEEL + 3.95, 6, 1.05, { height: 0.36, box: [-0.14, -0.4, 0.14, 0.02], glows: true }),
  on('lantern_main', 'Фонарь на грот-мачте', KEEL, 13.75, 1.0, { height: 0.36, box: [-0.14, -0.4, 0.14, 0.02], glows: true }),
  { id: 'silk_run', name: 'Шёлк, раскатанный по палубе', plane: true, on: 'ship', across: KEEL, distance: 10.4, elevation: WAIST + 0.015, width: 5, depth: 5.5, lit: true },
  ...STACKS.map(([a, d], i) => on(i ? `silk_${i}` : 'silk', i ? `Алый шёлк, штуки ${i + 1}` : 'Алый шёлк', a, d, WAIST, { height: 0.8, box: [-0.9, -1.7, 0.9, 0.05] })),
  on('cask', 'Бочка Греев', -0.09, 3.94, 0, { facing: 250, height: 0.9, box: [-0.5, -1.05, 0.5, 0.02], shadow: shadow({ soft: 0.15 }) }),
  ...people,
  // what the operator frames when two stand together: at the starboard rail of the poop; by the «Anselm»'s mainmast
  on('by_rail', 'У правого борта', 1.32, 4.45, 0, { unseen: true, height: 1.76 }),
  on('by_mast', 'У грот-мачты', -2.95, 13.3, WAIST, { unseen: true, height: 1.76 }),
  // where the operator stands off her decks (the film's camera_on: its start is there, it comes from there toward its
  // target; turned as what carries them): over the sea off the poop's starboard rail, before the two at it and a little
  // ahead of them, chest high; low over the water off her starboard side, abaft her boat; on the steamer's deck, inboard
  // of Longren and before him — the «Secret» coming up beyond him
  on('cam_rail', 'Оператор за бортом у юта', 4.33, 5.54, -0.45, { unseen: true, facing: 180, height: 1.7 }),
  on('cam_boat', 'Оператор на воде у правого борта', 10.25, 4.62, SEA + 0.3, { unseen: true, facing: 180, height: 1.7 }),
  { id: 'cam_steamer', name: 'Оператор на палубе парохода', on: 'steamer', across: 16.05, distance: 0.97, elevation: STEAMER_DECK, unseen: true, facing: 180, height: 1.7 },
  // the hands on the shrouds, close (the world's closeups: its frame `ropes`) — an insert over the whole frame
  { id: 'ropes', name: 'Руки на вантах', insert: 'ropes' },
];

// ── the state ──
const smooth = (range, means) => ({ range, smooth: true, means });
const own = means => ({ type: 'number', means: `служебный: ${means}` });
const state = {
  beat: null, hour: 0.27, ship: 'secret', storm: 0, roll: 0, sails: 0, sails_set: 1, luff: 0, helm: 0, heading: 0, shore: 0, port: 0,
  lanterns: 0, silk: 0, cask: 0, steamer: 0, skiff_down: 0, ropes: 0, climb: 0, hand_l: 1, hand_r: 1, slip: 0,
  leg: null, sun: 0.26, wine: 0, ring: 'none', ring_kind: 'own',
  day: 0, dawn: 1, dusk: 0, night: 0, sun_light: 0.4, moon_light: 0, harbour_lit: 0, heel: 0,
  ship_x: 0, ship_d: 0, ship_f: 180, ship_at: '0:0', steamer_x: 15000, steamer_d: 0, steamer_smoke: 0, steamer_at: 0, belly_l: 166, belly_r: 194, belly_tilt: -12, fore_tg_e: 20.4, main_tg_e: 22.5,
};
const states = {
  beat: { type: 'string', means: 'кусок фильма (модуль beats): anselm, shrouds, top, letter, gop_bye, secret, sew, rail, raise, helm, arrive, steamer, night_end; null — ничего не играет' },
  hour: smooth([0, 1], 'время суток по кругу, как во всём мире: 0 полночь, 0.25 рассвет, 0.5 полдень, 0.75 закат; корабль идёт на запад, к Каперне: рассвет за кормой, закат впереди'),
  ship: { values: ['secret', 'anselm'], means: 'чья палуба: secret — белый галиот «Секрет» (три мачты, прямые паруса на фок- и грот-мачте, бизань подобрана), anselm — тёмная потёртая шхуна «Ансельм» (две мачты, косые латаные паруса, марсель на фок-мачте); меняется склейкой' },
  storm: smooth([0, 1], 'непогода: 0 тихо, 1 шторм — небо в тучах, свет серый, качка сильнее, на море барашки, ветер треплет паруса'),
  roll: smooth([-1, 1], 'крен: −1 на левый борт, 0 ровно, 1 на правый (до 12°); качка идёт поверх'),
  sails: smooth([0, 1], 'паруса «Секрета»: 0 белые, 1 алые'),
  sails_set: smooth([0, 1], 'паруса: 0 убраны (свёрнуты на реях, верхние реи спущены), 1 подняты и полны; поднимаются один за другим — нижние, марсели, брамсели (у «Ансельма» — грот, фок, марсель); с ними корабль идёт: до 4 м/с'),
  luff: smooth([0, 1], 'паруса заполаскивают: 0 полны ветром, 1 обвисли и бьются (и ход падает)'),
  helm: smooth([-1, 1], 'штурвал: −1 до упора влево, 1 вправо (три четверти оборота)'),
  heading: smooth([-1, 1], 'куда смотрит нос: 0 — на запад, прямо на Каперну, −1 на 25° левее, 1 на 25° правее; корабль поворачивается и идёт туда, куда смотрит'),
  shore: smooth([-1, 1], 'место корабля на пути к Каперне (ставит его туда; дальше он идёт сам своим ходом): 0 — в 6 км (холм на горизонте), 1 — в 600 м (дома, дом Лонгрена наверху, мыс с маяком); ниже 0 — дальше в открытом море (−1: 15 км, земли не видно)'),
  port: { values: [0, 1], means: 'порт Лисс: 1 — корабль стоит у причала (причал по правому борту, склады и город за ним), 0 — в море (где — shore)' },
  lanterns: smooth([0, 1], 'фонари: у трапа с юта по обоим бортам и на грот-мачте'),
  silk: smooth([0, 1], 'алый шёлк на шкафуте у фонарей: 0 нет, 1 груды и полотнища на всей палубе (растут по одной)'),
  cask: smooth([0, 1], 'бочка вина Греев с кружками посреди юта: 0 нет, 1 стоит'),
  steamer: smooth([0, 1], 'почтовый пароход: 0 — его нет; значение больше ставит его впереди справа от корабля (к 0 — в 420 м, 1 — в 70 м впереди и 24 м правее), дальше оба идут своим ходом: «Секрет» под парусами его обгоняет'),
  skiff_down: smooth([0, 1], 'шлюпка у правого борта: 0 — висит под поручнем, 1 — спущена на воду'),
  ropes: { range: [0, 1], means: 'крупный план рук юнги на вантах (вставка, кадр ropes модуля closeups): 1 — открыт; на нём точки ropes#left, ropes#right' },
  climb: smooth([0, 1], 'вставка ropes: как высоко поднялся юнга — выбленки уходят вниз (0 — у палубы, 1 — у салинга); двигает игра'),
  hand_l: { values: [0, 1], means: 'вставка ropes: левая рука — 1 сжата на канате, 0 поднята и раскрыта; двигает игра' },
  hand_r: { values: [0, 1], means: 'вставка ropes: правая рука — 1 сжата на канате, 0 поднята и раскрыта; двигает игра' },
  slip: smooth([0, 1], 'вставка ropes: срыв — руки съезжают по канату (импульс: 1 и обратно к 0); двигает игра'),
  leg: { range: [0, 1], means: 'ключ партии: этап пути к Каперне, на котором сцену открывают куском helm (ставит корабль как shore); нет (null) — helm идёт после raise, с того места, где корабль есть' },
  sun: { range: [0.26, 0.36], means: 'ключ партии: час утра в кусках raise, helm, arrive (как hour)' },
  wine: { values: [0, 1], means: 'ключ партии: в куске night_end 1 — бочка Греев и два матроса у неё, 0 — бочки нет, четверо матросов сидят на люке и поют' },
  ring: { values: ['none', 'finger', 'cord'], means: 'ключ партии: кольцо у Ассоль на палубе (куски steamer, night_end) — нет, на пальце (часть каста по ring_kind), на шнурке поверх платья (часть ring_cord); по умолчанию none' },
  ring_kind: { values: ['mother', 'own'], means: 'ключ партии: какое кольцо — mother — материнское (часть ring), own — его старинное (часть ring_old); по умолчанию own' },
  day: smooth([0, 1], 'служебный: вес дневного света (nebo.follow по hour)'),
  dawn: smooth([0, 1], 'служебный: вес рассвета (nebo.follow по hour)'),
  dusk: smooth([0, 1], 'служебный: вес заката (nebo.follow по hour)'),
  night: smooth([0, 1], 'служебный: вес ночи (nebo.follow по hour)'),
  sun_light: smooth([0, 1], 'служебный: сколько светит солнце (nebo.follow по hour)'),
  moon_light: smooth([0, 1], 'служебный: сколько светит луна (nebo.follow по hour)'),
  harbour_lit: smooth([0, 1], 'служебный: насколько горят фонари причала Лисса; скрипт ставит по ночи'),
  heel: own('наклон корабля, градусы (+ на левый борт): крен roll и качка; скрипт ведёт его сам'),
  ship_x: own('где корабль в мире поперёк курса на Каперну, м (вправо, к северу); скрипт ведёт его своим ходом, shore и port ставят'),
  ship_d: own('где корабль в мире вдоль курса на запад, м: 0 — в 6 км от Каперны, Лисс на −30000; скрипт ведёт его своим ходом, shore и port ставят'),
  ship_f: own('поворот корабля, градусы (180 — носом на запад); скрипт ставит по heading'),
  ship_at: { type: 'string', means: 'служебный: какие port и shore поставили корабль туда, где он есть («порт:берег»); скрипт ставит корабль заново, когда они называют другое место' },
  steamer_at: own('какое значение steamer поставило пароход туда, где он есть'),
  steamer_x: own('где пароход в мире поперёк, м; скрипт ставит по steamer и ведёт'),
  steamer_d: own('где пароход в мире вдоль курса, м; скрипт ставит по steamer и ведёт'),
  steamer_smoke: own('дымит ли пароход (1, пока он здесь)'),
  belly_l: own('поворот левых половин прямых парусов, градусы (180 — плоско): кромки к корме, когда ветер их наполняет; скрипт ставит по sails_set и luff'),
  belly_r: own('поворот правых половин прямых парусов, градусы; скрипт ставит по sails_set и luff'),
  belly_tilt: own('наклон прямых парусов, градусы (−: нижняя шкаторина вперёд под ветром); скрипт ставит по sails_set и luff'),
  fore_tg_e: own('где висит фор-брамсель — высота его рея, поднятого над нижней шкаториной, над ютом, м: идёт вверх с реем марселя; скрипт ставит по sails_set'),
  main_tg_e: own('где висит грот-брамсель, так же; скрипт ставит по sails_set'),
};
Object.assign(state, { lo_a: LONGREN[0], lo_d: LONGREN[1], lo_e: LONGREN[2], longren_here: false });
states.lo_a = own('где Лонгрен — вдоль парохода, м от его середины (к корме); ставят куски');
states.lo_d = own('где Лонгрен — поперёк парохода, м от левого борта внутрь; ставят куски');
states.lo_e = own('высота палубы парохода под Лонгреном над водой, м');
for (const [id, name, , k, [a, d, e]] of PEOPLE) {
  Object.assign(state, { [`${k}_a`]: a, [`${k}_d`]: d, [`${k}_e`]: e, [`${id}_here`]: id === 'grey' });
  states[`${k}_a`] = own(`где ${name} — поперёк корабля, м от места зрителя на юте (вправо, к правому борту; киль на ${KEEL}); ставят куски`);
  states[`${k}_d`] = own(`где ${name} — вдоль корабля, м от места зрителя (к носу: штурвал 2.6, край юта 6, грот-мачта 14); ставят куски`);
  states[`${k}_e`] = own(`на какой палубе стоит ${name} — её высота над ютом (ют 0, шкафут ${WAIST})`);
}
Object.assign(state, { grey_do: { motion: 'helm', loop: true }, grey_reach: { r: 'wheel#rim_r', l: 'wheel#rim_l' } });

const spec = {
  engine: 2,
  title: 'Палуба',
  caption: 'Курс — прямо.',
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
