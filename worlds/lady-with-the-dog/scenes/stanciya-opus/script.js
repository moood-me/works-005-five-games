// The station: the scene's mechanics. Its film in beats (lib.js film(scene), played by the world's module beats); the
// train goes where `train` and `far` say (one function: L.placeTrain) — the carriages, the far tail light, the lamp
// by her window.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

function place() {
  const v = L.placeTrain({ train: scene.get('train'), far: scene.get('far') });
  for (const k of ['train_a', 'tail_a', 'tail_on', 'winlamp_a']) scene.set(k, v[k]);
}
for (const k of ['train', 'far']) { scene.on('change', k, place); scene.on('move', k, place); }
place();
