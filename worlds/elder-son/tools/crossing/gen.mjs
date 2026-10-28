// Writes scenes/crossing/scene.json and the train's element files from the scene's lib (its track, its train).
// node tools/crossing/gen.mjs   (from the world's root)
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'scenes/crossing';
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const r2 = v => Math.round(v * 100) / 100;

const F0 = 0.04;
const start = L.places(F0);
const state = {
  hour: 0.82, night: L.nightOf(0.82), beat: null, beat_next: null, light_far: 1,
  barrier: 1, bell: 1, freight: F0, freight_x: r2(L.noseOf(F0)), snow: 0.4,
  camera_x: L.CAM.med.camera_x, camera_z: L.CAM.med.camera_z,
  nina_a: L.SPOT.nina[0], nina_d: L.SPOT.nina[1], busygin_a: L.SPOT.busygin[0], busygin_d: L.SPOT.busygin[1],
  nina_turn: 98, busygin_turn: L.TURN.busygin, nina_look: 'busygin', busygin_look: 'nina', nina_mood: 'thinking', busygin_mood: 'afraid',
};
const states = {
  hour: { range: [0, 1], smooth: true, means: 'the time of day — the weight of the light\'s looks: 0.78 dusk … 0.82 almost night (the script sets night)' },
  night: { range: [0, 1], smooth: true, means: 'the weight of the look “night” — the script sets it by hour' },
  beat: { values: [null, 'wait', 'truth', 'roar', 'brother'], means: 'the film\'s beat: the game sets a name — the beat plays from its beginning' },
  beat_next: { type: 'string', means: 'which beat comes next : the scene makes its first frame ready' },
  barrier: { range: [0, 1], smooth: true, means: 'the barrier: 0 up, 1 down across the road' },
  bell: { range: [0, 1], means: '1 — the bell: two red lights blink in turn; 0 — dark' },
  freight: { range: [0, 1], smooth: true, means: 'the freight: 0 in the wood; 0.04 — the headlight on the far curve (≈ 200 m), standing; 0.1…0.9 — going before them from right to left; 1 — gone to the left' },
  light_far: { range: [0, 1], means: 'the far headlight\'s halo (the headlight seen from 200 m is a bright star): 1 while the freight stands on the curve, 0 as it comes — the script sets it by freight' },
  freight_x: { type: 'number', means: 'the freight\'s nose, metres along the track from the wood — the script sets it by freight' },
  snow: { range: [0, 1], smooth: true, means: 'how hard it snows' },
  nina_a: { type: 'number', means: 'where Nina is: metres to the right' }, nina_d: { type: 'number', means: 'where Nina is: metres forward' },
  busygin_a: { type: 'number', means: 'where Busygin is: metres to the right' }, busygin_d: { type: 'number', means: 'where Busygin is: metres forward' },
};
for (const p of start) {
  state[`${p.id}_a`] = r2(p.a);
  state[`${p.id}_d`] = r2(p.d);
  state[`${p.id}_f`] = r2(p.f);
  for (const k of ['a', 'd', 'f']) states[`${p.id}_${k}`] = { type: 'number', means: 'the script sets it' };
}

const objects = [];
objects.push({ id: 'sky', name: 'Sky', sky: true });
objects.push({ id: 'ground', name: 'Field and tracks', plane: true, across: 50, distance: 680, elevation: 0, width: 1900, depth: 1440 });
objects.push({ id: 'treeline', name: 'Far forest', across: 0, distance: 1100, height: 18, box: [-1100, -20, 1100, 0.5] });
objects.push({ id: 'forest', name: 'Spruce wood', across: 190, distance: 392, height: 30, box: [-112, -30, 112, 0.6] });
objects.push({ id: 'village', name: 'Settlement', across: -125, distance: 330, height: 15, box: [-112, -15, 112, 0.5] });

// telegraph poles beyond the track, every 48 m
const poles = [];
for (let s = 30; s < L.PATH.length - 10; s += 48) {
  const p = L.at(s), nA = -p.dd, nD = p.da;
  // the side away from the start
  const sign = nA * -p.a + nD * -p.d > 0 ? -1 : 1;
  const a = p.a + sign * nA * 7, d = p.d + sign * nD * 7;
  if (d < 6) continue;
  poles.push({ across: r2(a), distance: r2(d), scale: r2(0.92 + ((s * 7) % 13) / 60), flip: s % 96 === 30 });
}
objects.push({ id: 'poles', name: 'Poles', across: poles[0].across, distance: poles[0].distance, height: 7.8, box: [-1, -7.8, 1, 0.15], copies: poles });

objects.push({ id: 'booth', name: 'Keeper\'s booth', unseen: true, across: 6.3, distance: 7.9, facing: 205 });
objects.push({ id: 'booth_front', name: 'Keeper\'s booth', on: 'booth', facing: 180, height: 4.3, box: [-1.7, -4.35, 1.7, 0.1], shadow: true });
objects.push({ id: 'booth_window', name: 'Booth window', on: 'booth', across: 0.45, distance: -0.04, elevation: 0.97, facing: 180, glows: true, height: 1, box: [-0.42, -1.0, 0.42, 0.02] });
objects.push({ id: 'booth_side', name: 'Keeper\'s booth', on: 'booth', across: -1.35, distance: 1.15, facing: 270, height: 3.1, box: [-1.5, -3.3, 1.5, 0.1], shadow: true });
objects.push({ id: 'chimney_smoke', name: 'Smoke from the chimney', particles: { kind: 'smoke', at: { on: 'booth', at: [0.73, 0.5, 4.25] }, rate: 3, size: [0.25, 1.6], life: [5, 8], opacity: 0.35 } });

objects.push({ id: 'signal', name: 'Crossing signal', across: 2.55, distance: 8.9, height: 3.3, box: [-0.75, -3.3, 0.75, 0.1], shadow: true });
objects.push({ id: 'barrier', name: 'Barrier', across: -3.25, distance: 7.75, facing: 197.5, height: 6.7, box: [-1.6, -6.7, 5.8, 0.2], shadow: true });

objects.push({ id: 'weeds', name: 'Weeds', across: -1.9, distance: 2.3, height: 0.8, box: [-0.5, -0.9, 0.5, 0.1], copies: [
  { across: -1.9, distance: 2.3 }, { across: 1.75, distance: 2.6, flip: true, scale: 1.2 }, { across: 2.7, distance: 3.6, scale: 0.9 },
  { across: -3.4, distance: 4.3, scale: 1.1 }, { across: 3.9, distance: 5.2, flip: true }, { across: -4.6, distance: 6.6, scale: 0.8 },
  { across: 4.9, distance: 9.6, scale: 1.2 }, { across: -7.5, distance: 11.5, flip: true, scale: 1.3 },
] });

// the train
for (const [i, c] of L.TRAIN.entries()) {
  const p = start[i];
  const half = c.len / 2 + 0.4;
  objects.push({
    id: c.id, name: c.kind === 'loco' ? 'Freight' : 'Car', across: r2(p.a), distance: r2(p.d), facing: r2(p.f),
    height: 4.9, box: [-half, -4.9, half, 0.2], place: { across: `${c.id}_a`, distance: `${c.id}_d`, facing: `${c.id}_f` },
  });
  const code = c.kind === 'loco'
    ? `// the diesel's side; its headlight — the point "freight#light"\ne.kit.trains.loco(g, e, ${c.len});\n`
    : `e.kit.trains.car(g, e, '${c.kind}', ${c.len});\n`;
  writeFileSync(`${DIR}/elements/${c.id}.js`, code);
}
objects.push({ id: 'freight_nose', name: 'Freight', on: 'freight', across: -L.TRAIN[0].len / 2, distance: 0, facing: 270, height: 4.4, box: [-1.75, -4.4, 1.75, 0.1] });

objects.push({ id: 'nina', name: 'Nina', person: { cast: 'cast', who: 'nina', turn: 98 }, across: L.SPOT.nina[0], distance: L.SPOT.nina[1], place: { across: 'nina_a', distance: 'nina_d' }, shadow: true });
objects.push({ id: 'busygin', name: 'Busygin', person: { cast: 'cast', who: 'busygin', turn: L.TURN.busygin }, across: L.SPOT.busygin[0], distance: L.SPOT.busygin[1], place: { across: 'busygin_a', distance: 'busygin_d' }, shadow: true });

objects.push({ id: 'snowfall', name: 'Snow', particles: { kind: 'snow', amount: 'snow', count: 7000, reach: 40 } });

const scene = {
  engine: 3,
  title: 'The Crossing',
  caption: 'The level crossing beyond the settlement. Growing dark.',
  horizon: 0.45,
  camera: { mode: 'picture' },
  modules: ['cast', 'beats', 'trains'],
  light: {
    tint: '#7d8cc0', tintStrength: 0.1, vignette: 0.45, grain: 0.22,
    haze: 0.1, hazeColor: '#56618a', hazeGlow: 0.7, shafts: 0,
    brightness: 1.08, saturation: 0.88, ambient: 0.66, ambientColor: '#a6b4d8', bounce: 0.5,
    wind: [-1, 0.3, 0.35],
    looks: {
      night: { ambient: 0.44, ambientColor: '#7d90c8', hazeColor: '#2d3756', saturation: 0.78, tintStrength: 0.14, lights: { dusk_sky: 0.55 } },
    },
  },
  lights: [
    { id: 'dusk_sky', from: [-35, 7], color: '#b8c3e2', strength: 0.6 },
    { id: 'booth_lamp', of: 'booth_window#pane', color: '#e8963a', strength: 2.4, reach: 12 },
    { id: 'red1', of: 'signal#l1', color: '#ff3018', strength: 0.7, reach: 6 },
    { id: 'red2', of: 'signal#l2', color: '#ff3018', strength: 0.7, reach: 6 },
    { id: 'headlight', of: 'freight#light', color: '#fff0d0', strength: 1.1, reach: 40, glow: 2 },
    { id: 'headlight_far', across: r2(L.at(L.S_LIGHT).a), distance: r2(L.at(L.S_LIGHT).d), elevation: 2.2, color: '#fff0d0', strength: 5, reach: 8, glow: 34, on: 'light_far' },
  ],
  state,
  states,
  objects,
  music: {
    scale: 'A_FLAT_MAJOR_F_MINOR',
    prompts: [
      { text: 'Very quiet low drone of wind over an empty snowfield at night, sparse, cold, distant', weight: 1.2 },
      { text: 'Soft sustained string pad in a minor key, almost still, tender and aching, winter night', weight: 0.8 },
      { text: 'Slow solo piano, few notes, lots of silence between them, Soviet film score, melancholic', weight: 0 },
      { text: 'Distant freight train rumble like a low bowed bass, ambient, slow swell', weight: 0 },
      { text: 'Glassy high harmonics like frost, shimmering, very slow, cold', weight: 0 },
      { text: 'Muted felt piano lullaby, warm and sad, 1970s Russian chamber music', weight: 0 },
      { text: 'Cello long notes, quiet, breathing, intimate, late evening', weight: 0 },
      { text: 'Ambient field recording mood, snow creaking, empty country railway crossing', weight: 0 },
      { text: 'Gentle accordion chords far away, provincial village, dusk, nostalgic', weight: 0 },
      { text: 'Minimal ambient with soft bell-like tones, cold and still, night', weight: 0 },
      { text: 'Warm low organ hum like a lit window in the cold, very soft', weight: 0 },
      { text: 'Slow guitar arpeggios, sparse, lonely road at night, restrained', weight: 0 },
      { text: 'Dark cinematic tension pad, quiet, a decision about to be spoken', weight: 0 },
      { text: 'Celesta and strings, winter fairy tale but sad, very slow', weight: 0 },
      { text: 'Soft brushed snare and double bass, slow night jazz, distant, muffled by snow', weight: 0 },
      { text: 'Solemn choir hum without words, far away, cold air', weight: 0 },
    ],
    bpm: 60, density: 0.15, brightness: 0.25,
  },
};
writeFileSync(`${DIR}/scene.json`, `${JSON.stringify(scene, null, 2)}\n`);
console.log('objects', objects.length, 'poles', poles.length, 'state keys', Object.keys(state).length);
