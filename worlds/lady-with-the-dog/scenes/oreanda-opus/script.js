// Oreanda: the scene's mechanics. Its film in beats (lib.js film(scene), played by the world's module beats); the
// steamer goes where the dawn says (one function); his hand follows `hand`.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

function steamer() {
  const [a, d] = L.steamerAt(scene.get('dawn'));
  scene.set('steamer_a', a);
  scene.set('steamer_d', d);
}
scene.on('change', 'dawn', steamer);
scene.on('move', 'dawn', steamer);
steamer();

// his hand over hers on the bench
function hand() {
  scene.set('gurov_reach', Number(scene.get('hand')) > 0.5 ? { l: 'anna#hand_r' } : null);
}
scene.on('change', 'hand', hand);
