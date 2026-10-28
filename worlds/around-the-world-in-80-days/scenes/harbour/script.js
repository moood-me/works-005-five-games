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

// ── Passepartout in the opium (the game's «Stay awake»): `pp_walk` — where he is sent along his way (0 up from the
// tavern's table, 1 the top of the steps down to the water, where the boatman waits): he goes there at his own reeling
// pace, the camera with him, as far aside as `pp_sway` lurches him; `pp_walk_at` — where he is now. Each `pp_stumble`
// that rises to 1 — he stumbles, and goes on. ──
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
  going = P().walk(L.wayBetween(here, w, +scene.get('pp_sway') || 0), { gait: 'stagger_walk' });
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

// the boatman (`boatman` 1) waiting on the quay by the head of the steps, his lantern lit, his sampan below; `message`
// rising to 1 — he goes down into it and pushes off with the news: his lantern goes away over the water to the town
const lamp = () => {
  const on = (+scene.get('boatman') || 0) > 0.5;
  scene.set('boatman_here', on);
  if (!on) return;
  if ((+scene.get('message') || 0) > 0) return;
  scene.set('boatman_on', null);
  scene.set('boatman_a', L.BOATMAN_AT[0]);
  scene.set('boatman_d', L.BOATMAN_AT[1]);
  scene.set('boatman_turn', 270);
  scene.set('boatman_with', ['lantern']);
  if (!((+scene.get('message') || 0) > 0)) { scene.set('sampan_x', L.SAMPAN[0]); scene.set('sampan_d', L.SAMPAN[1]); scene.set('sampan_facing', L.SAMPAN[2]); }
};
scene.on('change', 'boatman', lamp);
scene.on('change', 'message', v => {
  if (!(v >= 1)) return;
  scene.sequence(async s => {
    s.set('boatman_look', 'passepartout#head');
    await s.wait(0.8);
    s.set('boatman_look', [-60, 200, 2]);
    s.set('boatman_on', 'sampan#stand');
    s.set('boatman_turn', 0);
    await s.wait(0.6);
    await s.path(['sampan_x', 'sampan_d', 'sampan_facing'], L.SAMPAN_OFF, { speed: 2.6 });
  }, { name: 'message' });
});
// Passepartout's wings (`pp_wings`, the game's mark): over his livery — in Hong Kong; in Yokohama the beats dress him
// in the Long Noses' whole costume
scene.on('change', 'pp_wings', v => { if (L.portOf(scene.state) !== 'yokohama') scene.set('passepartout_wear', v > 0.5 ? scene.kit.cast.wears.pp_wings : null); });

// ── «The pyramid» ──
// `pyramid` 0…1: the tiers go up on the shoulders as it grows (each from its share: TIERS), and come down when it sinks
// below; at 0.75 the top man's arms go out
const isUp = id => scene.get(`${id}_on`) != null;
const tiers = v => {
  for (const [id, on, feet, from] of L.TIERS) {
    if (!scene.get(`${id}_here`)) continue;
    if (v >= from && !isUp(id)) {
      scene.set(`${id}_turn`, 0);
      scene.set(`${id}_on`, { at: on, up: 0.95 });
      scene.set(`${id}_reach`, { foot_r: feet[0], foot_l: feet[1] });
      scene.set(`${id}_do`, 'stand');
      scene.set(`${id}_look`, null);
    } else if (v < from - 0.03 && isUp(id)) {
      scene.set(`${id}_a`, L.WAIT[id][0]);
      scene.set(`${id}_d`, L.WAIT[id][1]);
      scene.set(`${id}_reach`, null);
      scene.set(`${id}_on`, null);
      scene.person(id).do('stumble');
    }
  }
  const [top, , feet] = L.TIERS[2];
  if (isUp(top)) scene.set(`${top}_reach`, v >= 0.75 ? { foot_r: feet[0], foot_l: feet[1], r: [L.PYR_X + 1.2, 13.4, 6.6], l: [L.PYR_X - 1.2, 13.4, 6.6] } : { foot_r: feet[0], foot_l: feet[1] });
};
scene.on('change', 'pyramid', v => { if (scene.get('pyramid') === v) tiers(v); });
scene.on('move', 'pyramid', () => tiers(scene.get('pyramid')));
// `tilt` −1…1: the pyramid sways — its foot (the mat it stands on) aside, as much as 0.35 m
const sway = () => scene.set('pyr_x', L.PYR_X + 0.35 * scene.anim.clamp(+scene.get('tilt') || 0, -1, 1));
scene.on('change', 'tilt', v => { if (scene.get('tilt') === v) sway(); });
scene.on('move', 'tilt', sway);
// `fogg_present` 1: Fogg (and Aouda, with_aouda) come along the quay's edge and sit down in the front row, his watch
// in his hand — then `pyramid:fogg`; 0 — the seats empty
let seating = null;
scene.on('change', 'fogg_present', v => {
  const who = ['fogg', ...((scene.get('with_aouda') ?? 0) > 0.5 ? ['aouda'] : [])];
  seating?.cancel();
  seating = null;
  // (already in their seats — a cut to the built pyramid)
  const seated = id => scene.get(`${id}_here`) && Math.hypot(scene.get(`${id}_a`) - L.SEAT[id][0], scene.get(`${id}_d`) - L.SEAT[id][1]) < 0.3;
  if (v > 0.5 && seated('fogg')) return;
  // (0: the seats empty — only those sat in them go: a cut elsewhere leaves its own people as they are)
  if (!(v > 0.5)) { for (const id of ['fogg', 'aouda']) if (seated(id)) scene.set(`${id}_here`, false); return; }
  seating = scene.sequence(async s => {
    const sat = who.map(id => s.sequence(async q => {
      q.set(`${id}_a`, L.TO_SEAT[id][0]); q.set(`${id}_d`, L.TO_SEAT[id][1]); q.set(`${id}_on`, null); q.set(`${id}_here`, true);
      q.set(`${id}_look`, 'passepartout#head');
      if (id === 'fogg') q.set('fogg_wear', { hat: 'tophat' });
      await q.person(id).go('sit_down', { to: L.SEAT[id], turn: 0 });
      q.person(id).do('sit_calm', { loop: true });
    }));
    await s.all(...sat);
    s.set('fogg_with', ['watch']);
    s.set('fogg_reach', { r: [L.SEAT.fogg[0] + 0.1, L.SEAT.fogg[1] + 0.35, 1.0] });
    s.tell('pyramid:fogg');
  }, { name: 'front_row' });
});

scene.kit.beats.play(scene, L.film(scene));
