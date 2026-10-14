// generator of scene.json (run: node gen.mjs). Kept next to the scene.
import fs from 'fs';
const P = (id, name, who, a, d, turn, extra = {}) => ({
  id, name, person: { cast: 'cast', who, turn }, across: a, distance: d,
  place: { across: id + '_a', distance: id + '_d' }, shadow: true, ...extra
});
const boatsR = [[7, 6], [9, 11], [6.6, 15], [11, 19], [9.4, 24], [15, 9], [14, 16]].map(([a, d]) => ({ across: a, distance: d, facing: 140, scale: 0.9 + ((a * d) % 3) * 0.1 }));
const boatsL = [[-7, 15], [-11, 18], [-8.5, 23], [-14, 13], [-17, 8], [-6.5, 28]].map(([a, d]) => ({ across: a, distance: d, facing: 220, flip: true }));
const people = {
  toto: [-0.9, 5.3, 270, true], elena: [0.2, 5.5, 340, true], daughter: [3.0, 8.0, 0, false], alfredo: [-4.15, 10.2, 0, false],
  banker: [2.3, 8.2, 235, false], c1: [-1.6, 8.9, 0, false], c2: [-0.5, 9.1, 0, false], c3: [0.7, 8.9, 0, false], c4: [1.8, 8.7, 0, false]
};
const state = {
  beat: 'summer', beat_next: '', hour: 0.9, era: 'past', rain: 0, screen_up: 1, screen_film: 'romance', beam_on: 1, cover: 0,
  car: 'none', headlights: 0, car_go: 0, car_a: 3.6, car_z: -8, dusk_k: 0, now_k: 0
};
const states = {
  beat: { type: 'string', means: 'какой кусок играется (summer, covered, headlights, found, alone, back, rise_go, car, meet, ask, bye, parting)' },
  beat_next: { type: 'string', means: 'какой кусок идёт следом на ветке (для снимка)' },
  hour: { range: [0, 1], means: '0.78 сумерки, 0.9 ночь' },
  era: { values: ['past', 'now'], means: 'past — тёплая ночь 1958; now — прохладно, 1988' },
  rain: { range: [0, 1], smooth: true, means: 'ливень' },
  screen_up: { range: [0, 1], means: '1 — экран, шесты, стулья, лодки со зрителями летнего вечера; 0 — пустой мол' },
  screen_film: { values: ['romance', 'white', 'none'], means: 'что на экране' },
  beam_on: { range: [0, 1], smooth: true, means: 'луч проектора' },
  cover: { range: [0, 1], smooth: true, means: 'брезент на проекторе' },
  car: { values: ['none', 'old', 'new'], means: 'машина на молу' },
  headlights: { range: [0, 1], means: 'фары (клин света вперёд по молу)' },
  car_go: { range: [0, 1], smooth: true, means: '0 — машина стоит, 1 — ушла по молу в темноту' },
  car_a: { range: [-5, 5], means: 'где машина поперёк мола (внутренний)' },
  car_z: { range: [-10, 40], means: 'где машина вдоль мола (внутренний, считает сцена)' },
  dusk_k: { range: [0, 1], means: 'сумеречность (считает сцена из hour)' },
  now_k: { range: [0, 1], means: '1 — настоящее (считает сцена из era)' }
};
const objects = [
  { id: 'sky', name: 'Небо', sky: true },
  { id: 'sea', name: 'Море', plane: true, across: 0, distance: 401, elevation: -1.2, width: 1600, depth: 800, reflect: { strength: 0.55, fade: 10, rough: 0.5, ripple: 0.5 } },
  { id: 'mole', name: 'Мол', plane: true, across: 0, distance: 11.5, elevation: 0, width: 10, depth: 31, walk: true },
  { id: 'warehouse', name: 'Склад', across: -5, distance: 2.4, facing: 90, height: 5, box: [-0.2, -5.6, 10.2, 0.8] },
  { id: 'bench', name: 'Скамья', across: -4.6, distance: 8.4, facing: 90, box: [-0.1, -1.1, 2.9, 0.1] },
  { id: 'table', name: 'Стол', across: -2.1, distance: 5.3, facing: 180, box: [-0.9, -1.0, 0.9, 0.1] },
  { id: 'projector', name: 'Проектор', across: -2.1, distance: 5.28, elevation: 0.9, facing: 180, box: [-0.8, -1.3, 0.9, 0.1] },
  { id: 'crate', name: 'Ящик', across: 0.2, distance: 5.5, facing: 180, box: [-0.4, -0.6, 0.4, 0.1], copies: [{ across: 0.2, distance: 5.5 }, { across: -4.1, distance: 3.7, scale: 1.3 }, { across: 4.0, distance: 9.5 }] },
  { id: 'bollard', name: 'Тумба', across: 4.7, distance: 3, facing: 180, box: [-0.4, -0.7, 0.4, 0.1], copies: [3, 9, 15, 21, 26].map(d => ({ across: 4.7, distance: d })).concat([{ across: -4.7, distance: 15 }, { across: -4.7, distance: 21 }, { across: -4.7, distance: 26 }, { across: 2.4, distance: 25.2, scale: 1.2 }]) },
  { id: 'beam', name: 'Луч', across: -1.6, distance: 5.4, elevation: 1.12, facing: 82.4, glows: true, box: [-0.2, -3.4, 13.1, 0.4] },
  { id: 'screen', name: 'Экран', across: 0, distance: 18, elevation: 1.4, facing: 180, glows: true, box: [-2.4, -2.8, 2.4, 0.2] },
  { id: 'poles', name: 'Шесты', across: 0, distance: 18.1, facing: 180, box: [-3.5, -4.9, 3.5, 0.1] },
  { id: 'audience', name: 'Зрители', across: 0, distance: 10.5, facing: 180, box: [-2.6, -1.4, 2.6, 0.1],
    copies: [{ across: 0, distance: 10.5 }, { across: 0.1, distance: 12.2, flip: true }, { across: 0.2, distance: 13.9 }, { across: -0.15, distance: 15.6, flip: true }] },
  { id: 'boats', name: 'Лодки', across: 7, distance: 6, facing: 140, box: [-2.4, -1.7, 2.5, 0.2], elevation: 0, copies: boatsR.concat(boatsL) },
  { id: 'lantern', name: 'Фонарь', across: 4.0, distance: 25.8, facing: 180, box: [-0.4, -4.2, 0.4, 0.1] },
  { id: 'car', name: 'Машина', across: 3.6, distance: -8, facing: 180, box: [-1.1, -1.6, 1.1, 0.1], place: { across: 'car_a', distance: 'car_z' } },
  { id: 'wedge', name: 'Свет фар', plane: true, on: 'car', distance: 6.5, elevation: 0.75, width: 5, depth: 12.4, glows: true },
  { id: 'rain_fall', name: 'Дождь', particles: { kind: 'rain', amount: 'rain', count: 7000, reach: 22, speed: 10, color: '#aebddc', opacity: 0.55, ground: 'splash' } },
  P('toto', 'Тото', 'toto_teen', -0.9, 5.3, 270),
  P('elena', 'Елена', 'elena', 0.2, 5.5, 340),
  P('daughter', 'Дочь', 'daughter', 3.0, 8.0, 0),
  P('alfredo', 'Альфредо', 'alfredo_blind', -4.15, 10.2, 0),
  P('banker', 'Отец Елены', 'banker', 2.3, 8.2, 235),
  P('c1', 'Зритель', 'villager_m', -1.6, 8.9, 0), P('c2', 'Зрительница', 'villager_w', -0.5, 9.1, 0),
  P('c3', 'Старик', 'old_m', 0.7, 8.9, 0), P('c4', 'Мальчик', 'kid', 1.8, 8.7, 0)
];
for (const [id, [a, d, t, here]] of Object.entries(people)) {
  Object.assign(state, { [id + '_a']: a, [id + '_d']: d, [id + '_turn']: t, [id + '_do']: id === 'elena' ? 'seated' : 'stand', [id + '_here']: here, [id + '_on']: id === 'elena' ? [0.2, 5.5, 0.42] : null, [id + '_look']: null, [id + '_reach']: null, [id + '_gait']: null, [id + '_wear']: null });
  Object.assign(states, { [id + '_a']: { range: [-20, 20], means: id + ': где стоит поперёк' }, [id + '_d']: { range: [-20, 40], means: id + ': где стоит вдоль' } });
}
const spec = {
  engine: 3, title: 'Пристань (sonnet)', caption: 'Летом кино крутили на пристани.', horizon: 0.5,
  camera: { mode: 'roam', area: [-8, 8, -8, 22] },
  modules: ['cast'],
  light: {
    tint: '#10204a', tintStrength: 0.12, vignette: 0.5, grain: 0.35, haze: 0.16, hazeColor: '#2a4a86', hazeGlow: 0.7, shafts: 0.4,
    brightness: 1.2, saturation: 1.0, ambient: 0.42, ambientColor: '#7088c8', bounce: 0.5, wind: [1, 0, 0.5],
    looks: {
      dusk_k: { ambient: 0.62, ambientColor: '#a094bc', tint: '#ff9a60', tintStrength: 0.12, haze: 0.18, hazeColor: '#8a6a8a' },
      now_k: { saturation: 0.5, tint: '#8c8cc0', tintStrength: 0.18, ambientColor: '#8a96b8' },
      rain: { ambient: 0.3, saturation: 0.8, haze: 0.3, hazeColor: '#243050', brightness: 1.05 }
    }
  },
  lights: [
    { id: 'moon', from: 'sky#disc', color: '#9db4f0', strength: 0.9 },
    { id: 'fill', across: 1.5, distance: 1, elevation: 4, color: '#a8b8e8', strength: 0.7, reach: 16 }
  ],
  objects, state, states,
  music: { prompts: [
    { text: 'warm Sicilian summer night, cicadas and distant sea, soft waves against stone', weight: 1.2 },
    { text: 'quiet old film projector hum, far away', weight: 0.6 },
    { text: 'sparse celesta and soft strings, tender and nostalgic, no melody', weight: 0.5 },
    { text: 'rain on a harbour at night, water slapping hulls', weight: 0.4 },
    { text: 'low drone, slow ambient pad, bittersweet', weight: 0.3 }
  ], bpm: 60, density: 0.2, brightness: 0.3 }
};
fs.writeFileSync(new URL('../scenes/pristan-sonnet/scene.json', import.meta.url), JSON.stringify(spec, null, 1));
