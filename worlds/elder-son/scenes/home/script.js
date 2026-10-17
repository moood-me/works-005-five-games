// The scene's mechanics: the lamp by `warm`; the door turned by `door`; the film's beats by `beat` (one at a time — a
// new one replaces the one playing), the next one's opening made ready by `beat_next`.
const L = scene.lib;
function lamp() {
  scene.set('lamp', 0.6 + 0.4 * scene.get('warm'));
}
scene.on('change', 'warm', lamp);
function door() {
  scene.set('door_f', 80 * scene.get('door'));
}
scene.on('change', 'door', door);
scene.on('move', 'door', door);
scene.on('load', () => { lamp(); door(); });
lamp();
door();

let ready = null;
scene.on('change', 'beat_next', name => {
  if (ready) ready.shot.cancel();
  ready = name && L.FROM[name] && !L.AFTER[name] ? { name, shot: scene.shot({ ...L.FROM[name] }) } : null;
});
function play(name) {
  const run = L.film[name];
  if (!run) {
    scene.warn(`“The Sarafanovs' Home” has no beat "${name}"`);
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
