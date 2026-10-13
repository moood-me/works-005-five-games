// «Палуба» — its mechanics. The hour's light (nebo.follow). The ship in the world: `course` is where she is and how
// she is turned — she sails on at her own speed the way her bow points (ship_x, ship_d moved on; `heading` turns her:
// ship_f); `shore` and `port` put her at a place of her voyage, `steamer` puts the mail steamer ahead of her, and the
// steamer goes on at hers. Her roll (`heel`): `roll` and the swell under her, more in a storm. Her rig as
// her sails are set (lib.rigOf: belly_l, belly_r, belly_tilt, fore_tg_e, main_tg_e). Lisse's lamps at night. The film in beats for the game (lib.film).
const L = scene.lib, A = scene.anim;
const num = (key, or = 0) => { const v = scene.get(key); return typeof v === 'number' ? v : or; };
// a key's followers: set from it as it changes and each frame it moves
const follow = (keys, put) => {
  for (const key of keys) { scene.on('change', key, put); scene.on('move', key, put); }
  put();
};

scene.kit.nebo.follow(scene);
follow(['night', 'dusk'], () => scene.set('harbour_lit', L.townLit(scene.state)));

// ── her rig: how her square sails belly, where her topgallants hang (lib.rigOf) ──
follow(['sails_set', 'luff'], () => {
  const r = L.rigOf(scene.state);
  for (const k in r) scene.set(k, r[k]);
});

// ── her roll: from one side to the other and back on the swell, never quite the same; a storm rolls her deep, the
// harbour's water hardly ──
const SWELL = 3.2;
let side = 1;
const swing = () => {
  const storm = A.clamp(num('storm'), 0, 1), calm = num('port') >= 0.5 ? 0.3 : 1;
  side = -side;
  scene.move('heel', -12 * A.clamp(num('roll'), -1, 1) + side * A.mix(1.2, 7, storm) * calm * (0.7 + 0.3 * scene.random()), { over: SWELL, ease: 'inOut' });
};
swing();
scene.every(SWELL, swing);

// ── her voyage ──
// her bow as `heading` says
follow(['heading'], () => scene.set('ship_f', 180 + L.turnOf(scene.state)));
// She runs at her speed the way she points: her place moved on half a second's way at a time, the next given before the
// last ends (every quarter of a second, and as what drives her changes) — she never stops between, and her speed is the
// state's. The steamer, while she is here, the same at hers, due west.
const AHEAD = 0.5, TICK = 0.25;
let running = false, steaming = false;
function run() {
  const v = L.speedOf(scene.state), x = num('ship_x'), d = num('ship_d'), turn = (L.turnOf(scene.state) * Math.PI) / 180;
  if (v > 0) {
    scene.move('ship_x', x + v * Math.sin(turn) * AHEAD, { over: AHEAD, ease: 'linear' });
    scene.move('ship_d', d + v * Math.cos(turn) * AHEAD, { over: AHEAD, ease: 'linear' });
  } else if (running) { scene.set('ship_x', x); scene.set('ship_d', d); }
  running = v > 0;
  if (num('steamer') > 0) scene.move('steamer_d', num('steamer_d') + L.STEAMER_SPEED * AHEAD, { over: AHEAD, ease: 'linear' });
  else if (steaming) scene.set('steamer_d', num('steamer_d'));
  steaming = num('steamer') > 0;
}
scene.every(TICK, run);
for (const key of ['sails_set', 'luff', 'heading']) scene.on('change', key, run);
scene.on('cut', run);
// the game's places: `port`, `shore` put her there (a cut gives her place itself — lib.placeOf — so its shot is made
// ready where she will be); `steamer` puts the steamer ahead of her as she is now
// (ship_at, steamer_at say what put them where they are: the scene opened with other `port`, `shore`, `steamer` than
// those — a game's own start — puts them there; restored in the middle of a run, it goes on from where they were)
const place = () => {
  if (scene.get('ship_at') === L.placedBy(scene.state)) return;
  const p = L.placeOf(scene.state);
  for (const k in p) scene.set(k, p[k]);
  run();
};
for (const key of ['shore', 'port']) { scene.on('change', key, place); scene.on('move', key, place); }
const meet = () => {
  const p = L.steamerAt(num('steamer'), scene.state);
  for (const k in p) scene.set(k, p[k]);
  run();
};
scene.on('change', 'steamer', meet);
scene.on('move', 'steamer', meet);
if (scene.get('ship_at') !== L.placedBy(scene.state)) place();
if (num('steamer_at') !== num('steamer')) meet();

run();
scene.kit.beats.play(scene, L.film(scene));
