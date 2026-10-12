// Из окна поезда — its mechanics: the train runs (the camera is the train: camera_x along the line, the carriage riding
// on it), at the speed `speed` says; it stays in the land `land` names; the herd crosses where the train stands; who is
// in the carriage follows the game's with_*. And the film in beats (lib.js film, the world's module beats) for the game.
const L = scene.lib, P = L.plan;
const num = (key, or = 0) => { const v = scene.get(key); return typeof v === 'number' ? v : or; };

// ── the train ──
// It runs at `speed` × pace: camera_x moved on at that speed, half a second's way at a time, the next given before the
// last ends (every quarter of a second, and every frame while `speed` itself moves) — so it never stops between, and
// its speed is the state's. Its land is the same every period: past its stretch's end the train is cut back a period —
// to the same view (the frame before and after the same) — the cut made ready ahead.
const AHEAD = 0.5, TICK = 0.25, READY = 3;
let running = false, ready = null;
function run() {
  const v = num('speed') * P.pace, x = num('camera_x'), end = L.centre(L.landAt(x)) + P.period / 2;
  if (x >= end) {
    ready?.cancel();
    ready = null;
    // (the cut: run() again, from a period back)
    scene.cut({ camera_x: x - P.period });
    return;
  }
  if (!(v > 0)) {
    // (standing: what moved it stops where it is)
    if (running) scene.set('camera_x', x);
    running = false;
    return;
  }
  running = true;
  scene.move('camera_x', x + v * AHEAD, { over: AHEAD, ease: 'linear' });
  if (!ready && x + v * READY >= end) ready = scene.prepare({ camera_x: x + v * READY - P.period }, READY);
}
scene.every(TICK, run);
scene.on('change', 'speed', run);
scene.on('move', 'speed', run);
scene.on('cut', run);

// ── the land ──
// `land` names the land out of the window: the train is cut to its stretch (as far along it as it was along the one
// it leaves), its air with it — England's December fog (`fog` 1), the others' clear; the game may set `fog` otherwise.
scene.on('change', 'land', land => {
  const x = num('camera_x'), was = L.landAt(x);
  if (was !== land && P.lands.includes(land)) scene.cut({ camera_x: L.centre(land) + (x - L.centre(was)), fog: land === 'england' ? 1 : 0 });
});

// ── the herd ──
// the buffalo cross the line where the train stands as they come (`herd` leaving 0)
scene.on('change', 'herd', (v, old) => {
  if ((old ?? 0) <= 0 && v > 0) scene.set('herd_x', num('camera_x'));
});

// ── who is in the carriage: the game's with_* (Fogg always) ──
for (const [id, k] of Object.entries(L.WITH)) scene.on('change', k, v => scene.set(`${id}_here`, !!v));

run();
scene.kit.beats.play(scene, L.film(scene));
