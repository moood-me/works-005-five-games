// Writes scenes/hillside/scene.json and the repeated element files from the scene's lib (the land, the path, the
// funeral's places). node tools/hillside/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DIR = 'scenes/hillside';
mkdirSync(`${DIR}/elements`, { recursive: true });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const C = L.CLUB;
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

add({ id: 'sky', name: 'Sky', sky: true });
add({ id: 'ground', name: 'Hillside', plane: true, drape: true, across: 10, distance: 25, elevation: 0, width: 130, depth: 70 });
// the land beyond: the fields falling away past the crest to a far forest; behind the road the fields to the suburb
add({ id: 'beyond', name: 'Field beyond the hillside', plane: true, across: 10, distance: 120, elevation: 0, width: 420, depth: 120 });
add({ id: 'behind', name: 'Field before the settlement', plane: true, across: 10, distance: -60, elevation: 0, width: 420, depth: 100 });
add({ id: 'forest', name: 'Far forest', across: 10, distance: 165, height: 22, box: [-210, -22, 210, 0.5] });
add({ id: 'suburb', name: 'Settlement', across: -10, distance: -105, facing: 0, height: 24, box: [-160, -24, 160, 0.5] });

// the cemetery's fence: one 6 m run of pickets, its copies along the road; the gate's brick pillars between two runs
const runs = [];
for (let a = L.GATE - 7.2; a > -26; a -= 6) runs.push({ across: r2(a), distance: L.FENCE_D });
for (let a = L.GATE + 1.2; a < 42; a += 6) runs.push({ across: r2(a), distance: L.FENCE_D });
add({ id: 'fence', name: 'Fence', across: runs[0].across, distance: L.FENCE_D, facing: 180, height: 1.3, box: [-0.1, -1.5, 6.1, 0.2], copies: runs });
file('fence', `e.kit.houses.fence(g, e, 6, 1.25);\n`);
add({ id: 'gate_lamp', name: 'Gate lamp', across: 10.2, distance: 6.2, height: 3.3, box: [-0.4, -3.5, 1.0, 0.1] });
add({ id: 'gate', name: 'Gate', across: L.GATE, distance: L.FENCE_D, facing: 180, height: 2.6, box: [-1.6, -2.75, 1.6, 0.2], shadow: true });

// the thick birch by the fence (Nina hides behind it); birches on the slope
add({ id: 'birch', name: 'Birch', across: L.BIRCH[0], distance: L.BIRCH[1], height: 15, box: [-6.5, -18.5, 6.5, 0.3], shadow: true });
file('birch', `// the thick old birch by the fence, a crown of hanging twigs\ne.kit.houses.birch(g, e, 15, { lean: 0.8, thick: 1.9 });\n`);
const birches = [];
for (const [a, d, s] of [[-14, 12, 1], [-8, 21, 0.9], [9.5, 17, 1.1], [15, 24, 0.85], [-17, 27, 1.0], [21, 13, 0.95], [5.5, 30, 0.8], [-24, 18, 1.1], [28, 22, 1.0]]) birches.push({ across: a, distance: d, scale: s, flip: birches.length % 2 === 1 });
add({ id: 'birches', name: 'Birches', across: birches[0].across, distance: birches[0].distance, height: 11, box: [-4.5, -13.6, 4.5, 0.3], copies: birches });
file('birches', `e.kit.houses.birch(g, e, 10.5, { lean: 0.5 });\n`);

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
add({ id: 'crosses', name: 'Crosses', across: crosses[0].across, distance: crosses[0].distance, height: 1.7, box: [-0.5, -1.8, 0.5, 0.2], copies: crosses });
file('crosses', `e.kit.houses.cross(g, e, 1.6);\n`);
add({ id: 'rails', name: 'Grave railings', across: rails[0].across, distance: rails[0].distance, height: 0.8, box: [-1.05, -0.85, 1.05, 0.2], copies: rails });
file('rails', `e.kit.houses.rail(g, e, 2);\n`);
add({ id: 'stars', name: 'Monuments', across: stars[0].across, distance: stars[0].distance, height: 1.5, box: [-0.4, -1.6, 0.4, 0.2], copies: stars });

// the fresh grave, the case lying on the snow by it
add({ id: 'grave', name: 'Grave', across: L.GRAVE[0], distance: L.GRAVE[1], facing: 180, height: 1.6, box: [-1.5, -1.7, 1.5, 0.2] });
add({ id: 'case_snow', name: 'Case', across: L.SPOT.caseAt[0], distance: L.SPOT.caseAt[1], facing: 160, height: 0.15, box: [-0.4, -0.2, 0.4, 0.05] });

// the railwaymen's club by the road, at the end of the way of “Following”: a log house, its windows lit, the porch with a
// lamp, a door that opens (`club_door`) on a warm hall, a sign over it (its parts: elements/club_*.js)
const PL = 0.45, WALL = 2.7, RISE = 2, DEEP = 6, WALL_TOP = PL + WALL;
const doorX = C.door - C.a;
add({ id: 'club', name: 'Club', unseen: true, across: C.a, distance: C.d, facing: 180 });
add({ id: 'club_wall', name: "The railwaymen's club", on: 'club', facing: 180, height: WALL_TOP, box: [-C.w / 2 - 0.5, -WALL_TOP - 0.5, C.w / 2 + 0.5, 0.15] });
add({ id: 'club_roof', name: 'Roof', plane: true, on: 'club', across: 0, distance: 1.28, elevation: 4.15, width: C.w + 1, depth: 3.99, tilt: 30.1 });
for (const side of [-1, 1]) {
  add({ id: `club_end${side < 0 ? 'l' : 'r'}`, name: 'Club', on: 'club', across: (side * C.w) / 2, distance: DEEP / 2, facing: side < 0 ? 270 : 90, height: WALL_TOP + RISE, box: [-DEEP / 2 - 0.6, -WALL_TOP - RISE - 0.4, DEEP / 2 + 0.6, 0.15] });
}
for (const [i, x] of [-4.3, 0.7, 3.1].entries()) {
  add({ id: `club_win${i + 1}`, name: 'Club window', on: 'club', across: x, distance: 0.05, elevation: 1.1, facing: 180, glows: true, height: 1.2, box: [-0.61, -1.26, 0.61, 0.06] });
}
add({ id: 'club_door', name: 'Club door', on: 'club', across: doorX - 0.55, distance: 0.03, elevation: PL, facing: 180, place: { facing: 'club_door_f' }, height: 2.1, box: [-0.05, -2.15, 1.15, 0.05], shadow: true });
add({ id: 'club_hall', name: 'Club hall', on: 'club', across: doorX, distance: 0.9, elevation: PL, facing: 180, glows: true, height: 2.4, box: [-1.3, -2.45, 1.3, 0.05] });
add({ id: 'club_sign', name: 'Sign', on: 'club', across: doorX, distance: 0.04, elevation: PL + 2.1 + 0.25, facing: 180, height: 0.5, box: [-2, -1.3, 2, 0.1] });
// the porch: steps up from the road (their foot is the end of the road's way), the landing before the door, a lamp
add({ id: 'club_steps', name: 'Steps', plane: true, walk: true, across: C.door, distance: 6.95, elevation: 0.225, width: 1.5, depth: 1.95, tilt: 13.3 });
add({ id: 'club_landing', name: 'Porch', plane: true, walk: true, across: C.door, distance: 8.45, elevation: PL, width: 2.4, depth: 1.1 });
add({ id: 'club_lamp', name: 'Club lamp', across: C.door + 1.5, distance: 7.8, elevation: PL, height: 3.2, box: [-0.4, -3.4, 1.0, 0.1] });

// the people: the two by the fence, the funeral
const person = (id, name, who, a, d, turn) => add({ id, name, person: { cast: 'cast', who, turn }, across: a, distance: d,
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
person('nina', 'Nina', 'nina', L.SPOT.nina[0], L.SPOT.nina[1], 0);
person('busygin', 'Busygin', 'busygin', L.SPOT.busygin[0], L.SPOT.busygin[1], 8);
const F = L.FUNERAL;
person('sarafanov', 'Sarafanov', 'sarafanov_funeral', F.sarafanov[0], F.sarafanov[1], F.sarafanov[2]);
for (const id of ['band1', 'band2', 'band3', 'mourner1', 'mourner2', 'mourner3', 'mourner4']) person(id, { band1: 'Trumpeter', band2: 'Tuba player', band3: 'Drummer' }[id] || 'Mourner', id, F[id][0], F[id][1], F[id][2]);

// the state: the end of `road` — they stand at the fence, the funeral up on the slope (the first sight)
const E = L.END.road();
const state = { hour: 0.74, dusk: 0, beat: null, beat_next: null, case_down: 1, camera_x: E.camera_x, camera_z: E.camera_z, camera_yaw: E.camera_yaw, camera_h: E.camera_h,
  down: 0, down_at: 0, catch: 0, fall: 0, sar_go: 0, sar_at: 0, follow: 0, follow_at: 0, hold: 0, duck: 0, club_door: 0, club_door_f: 180, case_light: 0, snowy: 0, seen: 0 };
for (const id of L.PEOPLE) {
  state[`${id}_a`] = E[`${id}_a`];
  state[`${id}_d`] = E[`${id}_d`];
  state[`${id}_turn`] = E[`${id}_turn`];
  if (E[`${id}_look`]) state[`${id}_look`] = E[`${id}_look`];
  if (E[`${id}_mood`]) state[`${id}_mood`] = E[`${id}_mood`];
}
const num = means => ({ type: 'number', means });
const states = {
  hour: { range: [0, 1], smooth: true, means: 'time: 0.74 dusk … 0.8 almost dark (the script sets dusk)' },
  dusk: { range: [0, 1], smooth: true, means: 'the weight of the look “darkening” — the script sets it by hour' },
  beat: { values: [null, 'road', 'march', 'alone', 'meet', 'bottom', 'hide', 'club'], means: 'the film\'s beat: the game sets a name — the beat plays from its beginning' },
  beat_next: { type: 'string', means: 'which beat comes next: the scene makes its first frame ready' },
  case_down: { values: [0, 1], means: 'the clarinet case lies on the snow by the grave (1) or is in Sarafanov\'s hand (0) — a beat sets it' },
  down: { range: [0, 1], means: '“Arm in Arm”: where the game wants the pair on the iced path (0 the grave, 1 the gate); they go while it is ahead of down_at' },
  down_at: { range: [0, 1], means: 'where the pair are on the path now — the scene sets it, ten times a second' },
  catch: { values: [0, 1], means: '1 — Busygin caught his father on the ice: both hands on him' },
  fall: { values: [0, 1], means: '1 — the old man sat down in the snow; 0 — he gets up' },
  sar_go: { values: [0, 1], means: '1 — the old man walks along the road to the club by himself, looking back at 0.25, 0.5, 0.75' },
  sar_at: { range: [0, 1], means: "where the old man is along the road (0 the gate, 1 the club's steps) — the scene sets it" },
  follow: { range: [0, 1], means: '“Following”: where the game wants Nina and Busygin on the road; they go while it is ahead of follow_at' },
  follow_at: { range: [0, 1], means: 'where Nina and Busygin are on the road now — the scene sets it' },
  hold: { values: [0, 1], means: '1 — the two are walking just now (the game sets it; the old man looks back at it)' },
  duck: { values: [0, 1], means: '1 — Nina and Busygin crouch; 0 — they stand up' },
  club_door: { range: [0, 1], smooth: true, means: "the club's door: 0 shut, 1 open on the warm hall" },
  case_light: { range: [0, 1], smooth: true, means: "the sunset off the snow on the old man's face by the grave (the close cut of `alone`): 1 on, 0 off" },
  club_door_f: { type: 'number', means: "the door leaf's facing — the script sets it by club_door" },
  snowy: { values: [0, 1], means: "1 — snow on the old man's coat: he fell on the ice (the game sets it before bottom)" },
  seen: { values: [0, 1], means: '1 — he all but saw them on the road (the game sets it before `club`)' },
  ...Object.fromEntries(L.PEOPLE
    .flatMap(p => [[`${p}_a`, num(`where ${p} is: metres to the right`)], [`${p}_d`, num(`where ${p} is: metres up the slope`)]])),
};

const scene = {
  engine: 3,
  title: 'The Hillside',
  caption: 'The cemetery on the hillside beyond the settlement. Dusk.',
  horizon: 0.62,
  // roam: some shots turn aside and look up the slope; a roaming camera's sky goes all round
  camera: { mode: 'roam', area: [-30, 70, -4, 30] },
  modules: ['cast', 'beats', 'houses'],
  light: {
    tint: '#8f86b0', tintStrength: 0.1, vignette: 0.45, grain: 0.2,
    haze: 0.16, hazeColor: '#6f6886', hazeGlow: 0.5, shafts: 0,
    brightness: 1.16, saturation: 0.86, ambient: 0.7, ambientColor: '#aaa6c6', bounce: 0.5,
    wind: [1, 0.2, 0.3],
    looks: {
      dusk: { ambient: 0.56, ambientColor: '#8c8ab8', hazeColor: '#4e4a68', tintStrength: 0.14, lights: { sunset: 0.5 } },
    },
  },
  lights: [
    { id: 'sunset', from: [-62, 4], color: '#e6a487', strength: 0.75 },
    { id: 'sky_light', from: [10, 50], color: '#a8b0d6', strength: 0.35 },
    // the sunset given back by the snow before him, on his face and the case at his feet: only in the close cut of `alone`
    { id: 'case_fill', across: -0.2, distance: 25.4, elevation: 1.1, color: '#f0c8b4', strength: 1.6, reach: 4.5, on: 'case_light' },
    { id: 'club_spill', across: C.door - 1, distance: 6.8, elevation: 1.4, color: '#e8963a', strength: 2.4, reach: 14, on: 'club_door' },
  ],
  state,
  states,
  objects,
  music: {
    scale: 'A_FLAT_MAJOR_F_MINOR',
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
