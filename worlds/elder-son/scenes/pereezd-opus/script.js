// The scene's mechanics: the train's cars set along the track by `freight`; the night's look by `hour`;
// the film's beats run by `beat` (the game's key), one at a time (a new one replaces the one playing).
const L = scene.lib;

function placeTrain() {
  const f = scene.get('freight');
  for (const p of L.places(f)) {
    scene.set(`${p.id}_a`, p.a);
    scene.set(`${p.id}_d`, p.d);
    scene.set(`${p.id}_f`, p.f);
  }
  scene.set('freight_x', L.noseOf(f));
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

function play(name) {
  const run = L.film[name];
  if (!run) {
    scene.warn(`«Переезд» has no beat "${name}"`);
    return;
  }
  scene.sequence(async s => {
    await run(s);
  }, { name: 'film' });
}
scene.on('change', 'beat', name => {
  if (name) play(name);
});
