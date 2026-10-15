// Writes scenes/kosogor-opus/scene.json and the repeated element files from the scene's lib (the land, the path, the
// funeral's places). node tools/kosogor-opus/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/kosogor-opus';
mkdirSync(`${DIR}/elements`, { recursive: true });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const r2 = v => Math.round(v * 100) / 100;
const file = (id, text) => writeFileSync(`${DIR}/elements/${id}.js`, text);
const objects = [];
const add = o => (objects.push(o), o);

// a steady random for the graves' places
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const nearPath = (a, d) => {
  for (let u = 0; u <= 1; u += 0.02) { const p = L.pathAt(u); if (Math.hypot(p[0] - a, p[1] - d) < 1.6) return true; }
  return false;
};
const free = (a, d) => !nearPath(a, d) && Math.hypot(a - L.GRAVE[0], d - L.GRAVE[1]) > 6.5 && Math.hypot(a - L.BIRCH[0], d - L.BIRCH[1]) > 2;

add({ id: 'sky', name: 'Небо', sky: true });
add({ id: 'ground', name: 'Косогор', plane: true, drape: true, across: 10, distance: 25, elevation: 0, width: 130, depth: 70 });
// the land beyond: the fields falling away past the crest to a far forest; behind the road the fields to the suburb
add({ id: 'beyond', name: 'Поле за косогором', plane: true, across: 10, distance: 120, elevation: 0, width: 420, depth: 120 });
add({ id: 'behind', name: 'Поле до посёлка', plane: true, across: 10, distance: -60, elevation: 0, width: 420, depth: 100 });
add({ id: 'forest', name: 'Дальний лес', across: 10, distance: 165, height: 22, box: [-210, -22, 210, 0.5] });
add({ id: 'suburb', name: 'Посёлок', across: -10, distance: -105, facing: 0, height: 24, box: [-160, -24, 160, 0.5] });

// the cemetery's fence: one 6 m run of pickets, its copies along the road; the gate's brick pillars between two runs
const runs = [];
for (let a = L.GATE - 7.2; a > -26; a -= 6) runs.push({ across: r2(a), distance: L.FENCE_D });
for (let a = L.GATE + 1.2; a < 42; a += 6) runs.push({ across: r2(a), distance: L.FENCE_D });
add({ id: 'fence', name: 'Ограда', across: runs[0].across, distance: L.FENCE_D, facing: 180, height: 1.3, box: [-0.1, -1.5, 6.1, 0.2], copies: runs });
file('fence', `e.kit.izby.fence(g, e, 6, 1.25);\n`);
add({ id: 'gate', name: 'Ворота', across: L.GATE, distance: L.FENCE_D, facing: 180, height: 2.6, box: [-1.6, -2.75, 1.6, 0.2], shadow: true });

// the thick birch by the fence (Нина hides behind it); birches on the slope
add({ id: 'birch', name: 'Берёза', across: L.BIRCH[0], distance: L.BIRCH[1], height: 15, box: [-6.5, -18.5, 6.5, 0.3], shadow: true });
file('birch', `// the thick old birch by the fence, a crown of hanging twigs\ne.kit.izby.birch(g, e, 15, { lean: 0.8, thick: 1.9 });\n`);
const birches = [];
for (const [a, d, s] of [[-14, 12, 1], [-8, 21, 0.9], [9.5, 17, 1.1], [15, 24, 0.85], [-17, 27, 1.0], [21, 13, 0.95], [5.5, 30, 0.8], [-24, 18, 1.1], [28, 22, 1.0]]) birches.push({ across: a, distance: d, scale: s, flip: birches.length % 2 === 1 });
add({ id: 'birches', name: 'Берёзы', across: birches[0].across, distance: birches[0].distance, height: 11, box: [-4.5, -13.6, 4.5, 0.3], copies: birches });
file('birches', `e.kit.izby.birch(g, e, 10.5, { lean: 0.5 });\n`);

// the graves: wooden crosses, little iron rails, a few painted obelisks with stars
const crosses = [], rails = [], stars = [];
while (crosses.length < 34) {
  const a = -24 + rnd() * 56, d = 9.5 + rnd() * 22;
  if (!free(a, d)) continue;
  crosses.push({ across: r2(a), distance: r2(d), scale: r2(0.8 + rnd() * 0.45), flip: rnd() < 0.5, facing: r2(170 + rnd() * 20) });
  if (rnd() < 0.4) rails.push({ across: r2(a), distance: r2(d - 0.9), scale: r2(0.9 + rnd() * 0.3), facing: 180 });
}
while (stars.length < 9) {
  const a = -20 + rnd() * 48, d = 10 + rnd() * 20;
  if (!free(a, d)) continue;
  stars.push({ across: r2(a), distance: r2(d), scale: r2(0.85 + rnd() * 0.3), facing: 180 });
}
add({ id: 'crosses', name: 'Кресты', across: crosses[0].across, distance: crosses[0].distance, height: 1.7, box: [-0.5, -1.8, 0.5, 0.2], copies: crosses });
file('crosses', `e.kit.izby.cross(g, e, 1.6);\n`);
add({ id: 'rails', name: 'Оградки', across: rails[0].across, distance: rails[0].distance, height: 0.8, box: [-1.05, -0.85, 1.05, 0.2], copies: rails });
file('rails', `e.kit.izby.rail(g, e, 2);\n`);
add({ id: 'stars', name: 'Памятники', across: stars[0].across, distance: stars[0].distance, height: 1.5, box: [-0.4, -1.6, 0.4, 0.2], copies: stars });

// the fresh grave, the case lying on the snow by it
add({ id: 'grave', name: 'Могила', across: L.GRAVE[0], distance: L.GRAVE[1], facing: 180, height: 1.6, box: [-1.5, -1.7, 1.5, 0.2] });
add({ id: 'case_snow', name: 'Футляр', across: L.SPOT.caseAt[0], distance: L.SPOT.caseAt[1], facing: 160, height: 0.15, box: [-0.4, -0.2, 0.4, 0.05] });

// the people: the two by the fence, the funeral
const person = (id, name, who, a, d, turn) => add({ id, name, person: { cast: 'cast', who, turn }, across: a, distance: d,
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
person('nina', 'Нина', 'nina', L.SPOT.nina[0], L.SPOT.nina[1], 0);
person('busygin', 'Бусыгин', 'busygin', L.SPOT.busygin[0], L.SPOT.busygin[1], 8);
const F = L.FUNERAL;
person('sarafanov', 'Сарафанов', 'sarafanov_funeral', F.sarafanov[0], F.sarafanov[1], F.sarafanov[2]);
for (const id of ['band1', 'band2', 'band3', 'mourner1', 'mourner2', 'mourner3', 'mourner4']) person(id, { band1: 'Трубач', band2: 'Тубист', band3: 'Барабанщик' }[id] || 'Провожающий', id, F[id][0], F[id][1], F[id][2]);

// the state: the end of `road` — they stand at the fence, the funeral up on the slope (the first sight)
const E = L.END.road;
const state = { hour: 0.74, dusk: 0, beat: null, beat_next: null, case_down: 1, camera_x: E.camera_x, camera_z: E.camera_z, camera_yaw: E.camera_yaw, camera_h: E.camera_h };
for (const id of ['nina', 'busygin', 'sarafanov', 'band1', 'band2', 'band3', 'mourner1', 'mourner2', 'mourner3', 'mourner4']) {
  state[`${id}_a`] = E[`${id}_a`];
  state[`${id}_d`] = E[`${id}_d`];
  state[`${id}_turn`] = E[`${id}_turn`];
}
state.nina_look = 'sarafanov';
state.busygin_look = 'band2';
const num = means => ({ type: 'number', means });
const states = {
  hour: { range: [0, 1], smooth: true, means: 'время: 0.74 сумерки … 0.8 почти темно (скрипт ставит dusk)' },
  dusk: { range: [0, 1], smooth: true, means: 'вес образа «темнеет» — ставит скрипт по hour' },
  beat: { values: [null, 'road', 'march', 'alone', 'meet', 'hide'], means: 'кусок фильма: игра ставит имя — кусок играется с начала' },
  beat_next: { type: 'string', means: 'какой кусок будет следующим: сцена готовит его первый кадр' },
  case_down: { values: [0, 1], means: 'футляр кларнета лежит на снегу у могилы (1) или у Сарафанова в руке (0) — ставит кусок' },
  ...Object.fromEntries(['nina', 'busygin', 'sarafanov', 'band1', 'band2', 'band3', 'mourner1', 'mourner2', 'mourner3', 'mourner4']
    .flatMap(p => [[`${p}_a`, num(`где ${p}: метры вправо`)], [`${p}_d`, num(`где ${p}: метры вверх по склону`)]])),
};

const scene = {
  engine: 3,
  title: 'Косогор (Opus)',
  caption: 'Кладбище на косогоре за посёлком. Сумерки.',
  horizon: 0.62,
  // roam: some shots turn aside and look up the slope; a roaming camera's sky goes all round
  camera: { mode: 'roam', area: [-30, 40, -4, 30] },
  modules: ['cast', 'izby'],
  light: {
    tint: '#8f86b0', tintStrength: 0.1, vignette: 0.45, grain: 0.2,
    haze: 0.16, hazeColor: '#6f6886', hazeGlow: 0.5, shafts: 0,
    brightness: 1.08, saturation: 0.86, ambient: 0.62, ambientColor: '#aaa6c6', bounce: 0.5,
    wind: [1, 0.2, 0.3],
    looks: {
      dusk: { ambient: 0.46, ambientColor: '#8c8ab8', hazeColor: '#4e4a68', tintStrength: 0.14, lights: { sunset: 0.5 } },
    },
  },
  lights: [
    { id: 'sunset', from: [-62, 4], color: '#e6a487', strength: 0.75 },
    { id: 'sky_light', from: [10, 50], color: '#a8b0d6', strength: 0.35 },
  ],
  state,
  states,
  objects,
  music: {
    prompts: [
      { text: 'Very quiet cold wind over a snowy hillside at dusk, sparse, no melody', weight: 1.2 },
      { text: 'Soft low string pad, minor, still, a funeral heard from far away', weight: 0.5 },
      { text: 'Distant muffled brass funeral march, slightly out of tune, far up a hill', weight: 0 },
      { text: 'Slow solo piano, few notes, Soviet film score, melancholic and dry', weight: 0 },
      { text: 'Glassy high harmonics, frost, very slow', weight: 0 },
      { text: 'Muted felt piano lullaby, warm and sad, 1970s Russian chamber music', weight: 0 },
      { text: 'Cello long notes, quiet, breathing, intimate', weight: 0 },
      { text: 'Solemn wordless choir hum, far away, cold air', weight: 0 },
      { text: 'Minimal ambient bells, cold and still, evening', weight: 0 },
      { text: 'Slow clarinet-free woodwind chords, tender, restrained', weight: 0 },
      { text: 'Faint accordion through a wall far away, a dance hall, nostalgic', weight: 0 },
      { text: 'Dark quiet pulse, a secret kept', weight: 0 },
      { text: 'Celesta and strings, a sad winter tale, very slow', weight: 0 },
      { text: 'Low bowed double bass drone, dusk, open space', weight: 0 },
      { text: 'Distant crows and wind as soft texture', weight: 0 },
    ],
    bpm: 60, density: 0.12, brightness: 0.25,
  },
};
writeFileSync(`${DIR}/scene.json`, `${JSON.stringify(scene, null, 2)}\n`);
console.log('objects', objects.length, 'crosses', crosses.length, 'rails', rails.length, 'stars', stars.length);
