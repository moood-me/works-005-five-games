// The town of S.: the scene's mechanics. Its film in beats (lib.js film(scene), played by the world's module beats);
// the gate's leaf turns by `gate`; the far train goes along the bank by `far_train`; the game's keys of the
// mini-games are walked here — `anna_to` (“The leash”: Anna along the fence, pulled toward its end or holding back to
// the gate) and `walk_to` (“By the fence”: Gurov to a place along it); where they are is told back at once
// (`anna_at`, `gurov_at`); the spitz keeps ahead of whoever leads it.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));
const num = k => Number(scene.get(k)) || 0;

function gate() { scene.set('gate_f', 180 - 88 * L.clamp01(scene.get('gate'))); }
scene.on('change', 'gate', gate);
scene.on('move', 'gate', gate);
gate();
function train() { scene.set('far_train_a', L.farTrainX(scene.get('far_train'))); }
scene.on('change', 'far_train', train);
scene.on('move', 'far_train', train);
train();

// “The leash”: she walks where the leash draws her — to the fence's end pulled along, back toward the gate at her own pace
scene.on('change', 'anna_to', v => {
  if (scene.get('beat') !== 'autumn_walk') return;
  const x = L.annaX(L.clamp01(v)), anna = scene.person('anna');
  anna.gait(x > num('anna_a') ? 'pulled_walk' : null);
  anna.walk([[x, L.ANNA_Z]]);
});
const annaAt = () => scene.set('anna_at', L.annaAt(num('anna_a')));
scene.on('move', 'anna_a', annaAt);
scene.on('change', 'anna_a', annaAt);
// “By the fence”: he walks to the place the player chose, at his own pace
scene.on('change', 'walk_to', v => {
  if (scene.get('beat') !== 'fence_wait') return;
  scene.person('gurov').walk([[L.gurovX(L.clamp01(v)), L.GUROV_Z]]);
});
const gurovAt = () => scene.set('gurov_at', L.gurovAt(num('gurov_a')));
scene.on('move', 'gurov_a', gurovAt);
scene.on('change', 'gurov_a', gurovAt);

// the spitz ahead of whoever leads it, a little to the street's side, as they walk (its legs step by its own speed,
// it faces the way it goes — the module's)
const last = {};
function follow(who) {
  if (num('dog_follow') < 0.5 || scene.get('dog_lead') !== who) return;
  const a = num(`${who}_a`), d = num(`${who}_d`), p = last[who];
  last[who] = [a, d];
  if (!p) return;
  const dx = a - p[0], dd = d - p[1], len = Math.hypot(dx, dd);
  if (len < 1e-4) return;
  const ux = dx / len, ud = dd / len;
  let px = ud * 0.3, pd = -ux * 0.3;
  if (pd > 0) { px = -px; pd = -pd; }
  scene.set('spitz_a', a + ux * 1.1 + px);
  scene.set('spitz_d', d + ud * 1.1 + pd);
  if (scene.get('spitz_do') === 'sniff' || scene.get('spitz_do') === 'sit') scene.set('spitz_do', 'stand');
}
for (const who of ['anna', 'maid', 'diderits']) {
  scene.on('move', `${who}_a`, () => follow(who));
  scene.on('move', `${who}_d`, () => follow(who));
}
scene.on('arrived', ev => { delete last[ev.who]; });
