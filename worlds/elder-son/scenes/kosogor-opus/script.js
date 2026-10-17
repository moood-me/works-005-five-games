// The scene's mechanics: the dusk going down by `hour`; the film's beats by `beat` (one at a time — a new one
// replaces the one playing), the next one's opening made ready by `beat_next`.
const L = scene.lib;

function dusk() {
  scene.set('dusk', L.duskOf(scene.get('hour')));
}
scene.on('change', 'hour', dusk);
scene.on('move', 'hour', dusk);
scene.on('load', dusk);
dusk();

let ready = null;
scene.on('change', 'beat_next', name => {
  if (ready) ready.shot.cancel();
  ready = name && L.FROM[name] && !L.AFTER[name] ? { name, shot: scene.shot({ ...L.FROM[name] }) } : null;
});

function play(name) {
  const run = L.film[name];
  if (!run) {
    scene.warn(`“The Hillside” has no beat "${name}"`);
    return;
  }
  const shot = ready && ready.name === name ? ready.shot : null;
  ready = null;
  scene.sequence(async s => {
    await run(s, shot);
  }, { name: 'film' });
}
scene.on('change', 'beat', name => {
  if (name) play(name);
});
