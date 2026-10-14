
const L = scene.lib;
const NCARS = L.cars.length;
const ST = { nina: [-1.6, 5.5], busygin: [-0.6, 5.5] };   // where they stand at the barrier
const ACROSS = { nina: [-1.2, 20], busygin: [-0.2, 20.5] };  // over the track and on

function placeCars() {
  const D = scene.get('freight_x');
  const Tf = L.total - D;
  for (let i = 0; i < NCARS; i++) {
    const p = L.at(Tf + L.cars[i].off);
    scene.set('c' + i + '_a', p[0]);
    scene.set('c' + i + '_d', p[1]);
    scene.set('c' + i + '_f', 180 - (p[2] * 180) / Math.PI);
  }
}
function onFreight() {
  scene.set('freight_x', L.freightToX(scene.get('freight')));
  placeCars();
}
function onHour() {
  const h = scene.get('hour');
  scene.set('night', Math.min(1, Math.max(0, (h - 0.7) / 0.2)));
}
scene.on('change', 'freight', onFreight);
scene.on('move', 'freight', onFreight);
scene.on('change', 'hour', onHour);
scene.on('move', 'hour', onHour);
scene.on('load', () => { onFreight(); onHour(); });

// the stand at the barrier, at once: the scene may be opened on any piece
function atBarrier(s) {
  s.set('nina_a', ST.nina[0]); s.set('nina_d', ST.nina[1]);
  s.set('busygin_a', ST.busygin[0]); s.set('busygin_d', ST.busygin[1]);
  s.set('nina_turn', 0); s.set('busygin_turn', 0);
  s.set('nina_look', null); s.set('busygin_look', null);
  s.set('nina_reach', null); s.set('busygin_reach', null);
  s.set('barrier', 1); s.set('bell', 1);
  s.set('freight', L.FAR); s.set('freight_lamp', 1);
  s.set('hour', 0.82);
  s.set('at_barrier', true);
}
function trainTime() { return (L.total + L.trainLen) / L.SPEED; }
// seconds the train needs from the far end to the moment the front is at metre D
function untilFront(s, T) {
  // the front is at T metres of the way from the near-left end
  return s.until(() => scene.get('freight_x') >= L.total - T);
}
function untilTail(s, T) {
  return s.until(() => scene.get('freight_x') >= L.total - T + L.trainLen);
}
function startTrain(s) {
  const from = scene.get('freight');
  const left = (1 - from) / (1 - L.FAR) * trainTime();
  s.move('freight', 1, { over: left, ease: 'linear' });
}
async function cross(s, together) {
  const n = s.person('nina'), b = s.person('busygin');
  s.set('bell', 0);
  await s.all(
    n.walk([[-1.2, 12.4], [ACROSS.nina[0], ACROSS.nina[1]]]),
    (async () => { await s.wait(0.9); await b.walk([[-0.4, 12.4], [ACROSS.busygin[0], ACROSS.busygin[1]]]); })(),
  );
  s.set('at_barrier', false);
}

const BEATS = {
  wait: async s => {
    const n = s.person('nina'), b = s.person('busygin');
    s.set('nina_a', -4.6); s.set('nina_d', 2.6); s.set('busygin_a', -5.4); s.set('busygin_d', 2.1);
    s.set('nina_turn', 0); s.set('busygin_turn', 0);
    s.set('nina_look', null); s.set('busygin_look', null); s.set('nina_reach', null); s.set('busygin_reach', null);
    s.set('barrier', 0); s.set('bell', 0); s.set('freight', L.FAR); s.set('freight_lamp', 0);
    s.set('hour', 0.78); s.set('at_barrier', false);
    s.move('hour', 0.82, { over: 20, ease: 'linear' });
    const walk = s.all(
      n.walk([[-3.0, 4.0], [ST.nina[0], ST.nina[1]]]),
      (async () => { await s.wait(0.5); await b.walk([[-3.8, 3.5], [-2.0, 4.6], [ST.busygin[0], ST.busygin[1]]]); })(),
    );
    await s.wait(3.0);
    s.set('bell', 1);
    s.move('barrier', 1, { over: 5, ease: 'inOut' });
    await walk;
    n.turn(10);
    n.look('barrier');
    await s.until(() => scene.get('barrier') >= 0.5);
    b.look('freight#light');
    s.move('freight_lamp', 1, { over: 1.6 });
    await s.wait(0.8);
    s.tell('wait:light');
    await s.until(() => scene.get('barrier') >= 1);
    await s.until(() => scene.get('hour') >= 0.82);
    s.set('at_barrier', true);
    s.set('beat_done', 'wait');
    s.tell('beat:wait');
  },
  truth: async s => {
    if (!s.get('at_barrier')) atBarrier(s);
    const n = s.person('nina'), b = s.person('busygin');
    startTrain(s);
    await s.wait(1.0);
    await b.turn(270);
    s.tell('truth:said');
    await s.wait(0.6);
    n.look('busygin#head');
    await n.turn(70);
    await untilFront(s, 22);
    n.look('freight');
    await n.turn(0);
    await untilTail(s, 22);
    s.move('barrier', 0, { over: 3 });
    s.set('bell', 0);
    s.tell('truth:passed');
    n.look('busygin#head');
    await n.turn(70);
    await s.wait(0.6);
    await cross(s);
    s.set('beat_done', 'truth');
    s.tell('beat:truth');
  },
  roar: async s => {
    if (!s.get('at_barrier')) atBarrier(s);
    const n = s.person('nina'), b = s.person('busygin');
    startTrain(s);
    await untilFront(s, 8);
    s.tell('roar:loud');
    await b.turn(270);
    await s.wait(0.4);
    n.look('busygin#head');
    await n.turn(70);
    await s.wait(1.6);
    n.look([ST.busygin[0] - 0.4, ST.busygin[1], 0.4]);
    await s.wait(0.9);
    n.look('busygin#head');
    await untilTail(s, 22);
    s.move('barrier', 0, { over: 3 });
    s.set('bell', 0);
    s.tell('roar:passed');
    await s.wait(0.5);
    await cross(s);
    s.set('beat_done', 'roar');
    s.tell('beat:roar');
  },
  brother: async s => {
    if (!s.get('at_barrier')) atBarrier(s);
    const n = s.person('nina'), b = s.person('busygin');
    startTrain(s);
    await s.wait(1.0);
    await n.turn(60);
    s.set('nina_reach', { r: 'busygin#hand_l' });
    s.set('busygin_reach', { l: 'nina#hand_r' });
    await s.wait(1.2);
    s.tell('brother:arm');
    await n.turn(0);
    await untilTail(s, 22);
    s.move('barrier', 0, { over: 3 });
    s.set('bell', 0);
    s.tell('brother:passed');
    await s.wait(0.5);
    await cross(s, true);
    s.set('nina_reach', null); s.set('busygin_reach', null);
    s.set('beat_done', 'brother');
    s.tell('beat:brother');
  },
};

function start(name) {
  const f = BEATS[name];
  if (f) scene.sequence(f, { name: 'film' });
}
scene.on('change', 'beat', v => start(v));
scene.on('load', () => { const b = scene.get('beat'); if (b) start(b); });
