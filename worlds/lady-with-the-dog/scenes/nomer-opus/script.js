// Номер в Ялте: the scene's mechanics. Its film in beats (lib.js film(scene), played by the world's module beats: the
// game sets `beat`, the scene tells `beat:<name>`); the plate stands where `plate` says (one function).
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

function plate() {
  const [a, d, h] = scene.get('plate') === 'bed' ? L.PLATE_BED : L.PLATE_TABLE;
  scene.set('melon_a', a); scene.set('melon_d', d); scene.set('melon_e', h);
}
scene.on('change', 'plate', plate);
plate();
