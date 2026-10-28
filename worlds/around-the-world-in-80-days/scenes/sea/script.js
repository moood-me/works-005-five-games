// «The sea» — its mechanics. The boat's pose and the crest's place follow the game's keys (`wave`, `wave_h`, `helm`,
// `heel`, `wave_from`) and the swell's own rocking (`rock`, `rise`: the scene moves them to and fro all the time, as
// strong as the storm) — lib.pose → the anchors' keys bow_f, pitch, roll and the crest's crest_a/_d/_e/_f. A shot of
// the gun (`gun`, a new number) flashes (`gun_flash`). The film is in beats (lib.film, the world's module beats).
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

function place() {
  const p = L.pose(scene.state);
  scene.set('bow_f', p.bow);
  scene.set('pitch', p.pitch);
  scene.set('roll', p.roll);
  scene.set('crest_a', p.crest.a);
  scene.set('crest_d', p.crest.d);
  scene.set('crest_e', p.crest.e);
  scene.set('crest_f', p.crest.f);
}
for (const key of ['wave', 'wave_h', 'helm', 'heel', 'wave_from', 'storm', 'rock', 'rise']) {
  scene.on('change', key, place);
  scene.on('move', key, place);
}
place();

// the swell: rocking side to side and lifting the bow, each at its own pace, never in step
let side = 1, lift = 1;
scene.every(2.9, () => { side = -side; scene.move('rock', side * (0.6 + 0.4 * scene.random()), { over: 2.9, ease: 'inOut' }); });
scene.every(3.7, () => { lift = -lift; scene.move('rise', lift * (0.5 + 0.5 * scene.random()), { over: 3.7, ease: 'inOut' }); });

// the gun: a flash at each shot
scene.on('change', 'gun', () => {
  scene.set('gun_flash', 1);
  scene.move('gun_flash', 0, { over: 0.8, ease: 'out' });
});
