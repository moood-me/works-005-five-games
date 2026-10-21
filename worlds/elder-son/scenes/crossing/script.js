// The scene's mechanics: the train's cars set along the track by `freight`; the night's look by `hour`; the film's beats
// by `beat` (the world's `beats`: one at a time, the next one's opening made ready by `beat_next`).
const L = scene.lib;
scene.kit.beats.play(scene, L.film());

function placeTrain() {
  const f = scene.get('freight');
  for (const p of L.places(f)) {
    scene.set(`${p.id}_a`, p.a);
    scene.set(`${p.id}_d`, p.d);
    scene.set(`${p.id}_f`, p.f);
  }
  scene.set('freight_x', L.noseOf(f));
  scene.set('light_far', 1 - L.span(f, 0.05, 0.1));
}
scene.on('change', 'freight', placeTrain);
scene.on('move', 'freight', placeTrain);
placeTrain();

function night() {
  scene.set('night', L.nightOf(scene.get('hour')));
}
scene.on('change', 'hour', night);
scene.on('move', 'hour', night);
night();
