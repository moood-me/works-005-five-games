// The Sarafanovs' home — the scene's mechanics: its film (the game sets `beat`: modules/beats); the doors turned by
// `door` and `sar_door`; the far train placed by `far_train`; his lamp by `stir` (On Tiptoe); and “On Tiptoe” itself —
// the game sets where they creep to (`sneak` 0…1 of the way from the stove to the front door), they tiptoe there,
// Silva a step behind, and the scene says where Busygin is on the way (`sneak_at`) as he goes.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

const door = () => scene.set('door_f', 80 * scene.get('door'));
const sarDoor = () => scene.set('sar_door_f', 270 - 90 * scene.get('sar_door'));
const train = () => scene.set('far_train_x', L.FAR_TRAIN.from + (L.FAR_TRAIN.to - L.FAR_TRAIN.from) * scene.get('far_train'));
const stir = () => scene.set('sar_light', scene.get('stir'));
for (const [key, fn] of [['door', door], ['sar_door', sarDoor], ['far_train', train], ['stir', stir]]) {
  scene.on('change', key, fn);
  scene.on('move', key, fn);
}

// On Tiptoe: each new `sneak` sends them on along the way from where Busygin is; a new beat ends it
let creeping = null;
const metresAt = () => L.sneakOf(scene.get('busygin_a') + 2, scene.get('busygin_d'));
function creep() {
  const to = L.clamp(Number(scene.get('sneak')) || 0, 0, 1) * L.SNEAK_LEN, from = metresAt();
  if (creeping) for (const a of creeping) a.cancel();
  creeping = [
    scene.person('busygin').walk(L.sneakWay(from, to), { gait: 'tiptoe' }),
    // (Silva onto the way first, where he should be behind him)
    scene.person('silva').walk([L.W(...L.sneakAt(Math.max(0, from - L.SNEAK_BEHIND))), ...L.sneakWay(Math.max(0, from - L.SNEAK_BEHIND), Math.max(0, to - L.SNEAK_BEHIND))], { gait: 'tiptoe' }),
  ];
}
scene.on('change', 'sneak', () => { if (scene.get('beat') === 'sneak') creep(); });
const where = () => { if (creeping) scene.set('sneak_at', metresAt() / L.SNEAK_LEN); };
scene.every(0.1, where);
scene.on('change', 'beat', () => {
  if (creeping) for (const a of creeping) a.cancel();
  creeping = null;
});
