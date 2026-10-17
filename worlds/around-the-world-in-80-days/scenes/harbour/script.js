// «The harbour» — its mechanics. The ships go where their keys say: `carnatic_present` (1 → 0) takes the steamer off the
// jetty and out of the harbour, `tankadere_out` (0 → 1) the pilot boat — their places (steamer_x, _d, _facing; boat_x,
// _d, _facing) follow along lib.steamerAt and lib.boatAt as the keys move, or at once when they are set so; the
// steamer smokes while she is in the harbour (`steamer_smoke`). Both roll on the swell (`steamer_roll`, `boat_roll`).
// `daze` tips the horizon (camera_roll: set with it when it is set at once; what moves `daze` moves camera_roll beside
// it — the same seconds, the same ease, to 4 × it: lib.film's pipe). `pp_walk` sends Passepartout along his way in the
// opium, `pp_stumble` trips him. The film is in beats (lib.film, the world's module beats; notes.md lists them).
const L = scene.lib;
const follow = (key, at, keys) => {
  const put = v => at(v).forEach((n, i) => scene.set(keys[i], n));
  scene.on('change', key, v => scene.get(key) === v && put(v));
  scene.on('move', key, put);
  put(scene.get(key));
};
follow('carnatic_present', L.steamerAt, ['steamer_x', 'steamer_d', 'steamer_facing']);
follow('tankadere_out', L.boatAt, ['boat_x', 'boat_d', 'boat_facing']);
const tip = v => scene.get('daze') === v && scene.set('camera_roll', 4 * L.clamp01(v));
scene.on('change', 'daze', tip);
tip(scene.get('daze'));
// (her smoke: while she is in the harbour at all)
const smoking = () => {
  const on = (scene.get('carnatic_present') ?? 1) > 0 ? 1 : 0;
  if (scene.get('steamer_smoke') !== on) scene.set('steamer_smoke', on);
};
scene.on('change', 'carnatic_present', smoking);
scene.on('move', 'carnatic_present', smoking);
smoking();

// The swell: each ship rolls one way and back, slowly, never quite the same — the big steamer hardly, the pilot boat
// more (degrees; on the scene's clock)
const swell = (key, every, most) => {
  let side = 1;
  const roll = () => {
    side = -side;
    scene.move(key, side * most * (0.6 + 0.4 * scene.random()), { over: every, ease: 'inOut' });
  };
  roll();
  scene.every(every, roll);
};
swell('steamer_roll', 4.6, 0.6);
swell('boat_roll', 2.7, 2.2);

// Aouda in her travelling dress (`aouda_dress`)
const dress = () => scene.set('aouda_wear', (scene.get('aouda_dress') ?? 0) > 0.5 ? { garment: 'dress', colors: { garment: '#3c4a5a', top: '#3c4a5a', accent: '#c9b98f' } } : null);
scene.on('change', 'aouda_dress', dress);
if ((scene.get('aouda_dress') ?? 0) > 0.5) dress();

// ── Passepartout in the opium (the game's «Stay awake»): `pp_walk` — where he is sent along his way (0 the tavern's terrace,
// 1 the pier by the steamer): he goes there at his own reeling pace, the camera with him; `pp_walk_at` — where he is now.
// Each `pp_stumble` that rises to 1 — he stumbles, and goes on. ──
const P = () => scene.person('passepartout');
let going = null;
const at = () => L.wayOf(scene.get('passepartout_a') ?? 0, scene.get('passepartout_d') ?? 0);
const send = () => {
  const w = L.clamp01(scene.get('pp_walk'));
  if (scene.get('passepartout_here') === false) return;
  const here = scene.get('pp_walk_at') ?? at();
  if (w <= here + 0.002) {
    going?.cancel();
    going = null;
    return;
  }
  going = P().walk(L.wayBetween(here, w), { gait: 'stagger_walk' });
  if (scene.get('camera_target') !== 'passepartout') scene.camera({ target: 'passepartout', shot: 'wide', frame: [0.45, 0.62], glide: 1.5 });
};
scene.on('change', 'pp_walk', send);
const where = () => { if (scene.get('passepartout_here') !== false) scene.set('pp_walk_at', at()); };
for (const k of ['passepartout_a', 'passepartout_d']) {
  scene.on('change', k, where);
  scene.on('move', k, where);
}
scene.on('arrived', 'passepartout', where);
scene.on('change', 'pp_stumble', async v => {
  if (!(v >= 1)) return;
  going?.cancel();
  going = null;
  const fell = await P().do('stumble');
  if (fell === 'done') send();
});

scene.kit.beats.play(scene, L.film(scene));
