// The scene's mechanics: the windows' light and figures eased by their keys; the doors turned by theirs; the late
// look by `hour`; the knock of «Окна» by `knock`; the film's beats by `beat` (one at a time — a new one replaces the
// one playing), the next one's opening made ready by `beat_next`.
const L = scene.lib;

const PANES = ['win1', 'win2', 'win3', 'win4', 'win5', 'mak_window'];
function pane(w, now) {
  const v = scene.get(w);
  const lit = v > 0 ? 1 : 0, who = v === 2 ? 1 : 0;
  if (now) {
    scene.set(`${w}_lit`, lit);
    scene.set(`${w}_who`, who);
  } else {
    scene.move(`${w}_lit`, lit, { over: lit ? 0.35 : 0.9, ease: 'out' });
    scene.move(`${w}_who`, who, { over: 0.5 });
  }
}
for (const w of PANES) scene.on('change', w, () => pane(w, false));

function doors() {
  scene.set('door_f', 180 - 84 * scene.get('door'));
  scene.set('mak_door_f', 180 - 80 * scene.get('mak_door'));
}
for (const k of ['door', 'mak_door']) {
  scene.on('change', k, doors);
  scene.on('move', k, doors);
}

function late() {
  scene.set('late', L.lateOf(scene.get('hour')));
}
scene.on('change', 'hour', late);
scene.on('move', 'hour', late);

function settle() {
  for (const w of PANES) pane(w, true);
  doors();
  late();
}
scene.on('load', settle);
settle();

// the next beat's opening, made ready ahead (a beat that opens with a cut)
let ready = null;
scene.on('change', 'beat_next', name => {
  if (ready) ready.shot.cancel();
  ready = name && L.FROM[name] && !L.AFTER[name] ? { name, shot: scene.shot({ ...L.FROM[name] }) } : null;
});

function play(name) {
  const run = L.film[name];
  if (!run) {
    scene.warn(`«Улица» has no beat "${name}"`);
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

scene.on('change', 'knock', n => {
  scene.sequence(async s => {
    await L.knock(s, n);
  }, { name: 'knock' });
});
