// Дом Ди Вита — the scene's mechanics: its film (the game sets `beat`: modules/beats), and the keys of the light that
// follow `hour` and `era` (night_k, now_k: the looks; lamp off and the mother's hand lamp in 1988).
const L = scene.lib;
scene.kit.beats.play(scene, L.FILM);
const follow = () => {
  const l = L.light(scene.get('hour'), scene.get('era'));
  if (scene.get('night_k') !== l.night_k) scene.set('night_k', l.night_k);
  if (scene.get('now_k') !== l.now_k) scene.set('now_k', l.now_k);
};
scene.on('change', 'hour', follow);
scene.on('change', 'era', follow);
follow();
