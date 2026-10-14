// Переезд — куски фильма: wait · truth · roar · brother. Игра ставит ключ beat; сцена играет кусок и говорит beat:<имя>.
const L = scene.lib, A = scene.anim, N = L.N_WAGONS;

// ---- свет: hour (вес образов) → night / dusk / dawn
function looks() {
  const h = scene.get('hour');
  const n = A.span(h, 0.6, 0.9), dawn = A.span(h, 0.93, 1.0);
  scene.set('night', n * (1 - dawn));
  scene.set('dusk', 1 - n);
  scene.set('dawn', dawn);
}
scene.on('change', 'hour', looks);
scene.on('move', 'hour', looks);
scene.on('load', looks);

// ---- товарный: freight (смысл 0…1) → freight_x (метры по пути) → место тепловоза и вагонов
function train() {
  const f = scene.get('freight');
  const sx = f < 0.04 ? -L.TAIL - 40 : (f - 0.04) / 0.96 * L.S_END;
  scene.set('freight_x', sx);
  for (let k = 0; k <= N; k++) {
    const c = L.carAt(sx, k), id = k === 0 ? 'freight' : 'fw' + k;
    scene.set(id + '_a', c.a); scene.set(id + '_d', c.d); scene.set(id + '_f', c.f);
  }
}
scene.on('change', 'freight', train);
scene.on('move', 'freight', train);
scene.on('load', train);

// ---- огни светофора мигают по bell, по очереди
scene.every(0.5, () => {
  if (scene.get('bell')) {
    const on = Math.floor(scene.time / 0.5) % 2 === 0;
    scene.set('sig_a', on ? 1 : 0); scene.set('sig_b', on ? 0 : 1);
  } else if (scene.get('sig_a') || scene.get('sig_b')) {
    scene.set('sig_a', 0); scene.set('sig_b', 0);
  }
});

// ---- где что в начале каждого куска
const START = {
  hour: 0.78, bell: 0, barrier: 0, freight: 0, freight_lamp: 0, sig_a: 0, sig_b: 0, pos: 'start',
  nina_a: -6.2, nina_d: 4.0, nina_turn: 70, nina_look: null, nina_reach: null,
  busygin_a: -7.4, busygin_d: 3.6, busygin_turn: 70, busygin_look: null, busygin_reach: null,
};
const READY = {   // конец wait: поза под выбор
  hour: 0.82, bell: 1, barrier: 1, freight: 0.04, freight_lamp: 1, pos: 'waited',
  nina_a: -0.9, nina_d: 5.4, nina_turn: 12, nina_look: 'freight#light', nina_reach: null,
  busygin_a: 0.1, busygin_d: 5.2, busygin_turn: 352, busygin_look: 'freight#light', busygin_reach: null,
};
async function ready(s) {   // кусок после wait — без склейки; открытый на любом куске — склейка в позу wait
  if (scene.get('pos') !== 'waited') { s.cut(READY); train(); looks(); }
}
const run = s => s.move('freight', 1, { over: L.S_END / L.SPEED, ease: 'linear' });
const tailPassed = s => s.until(() => scene.get('freight_x') >= L.S_TAIL);

const beats = {};

beats.wait = async s => {
  s.cut(START); train(); looks();
  const nina = s.person('nina'), bus = s.person('busygin');
  s.move('hour', 0.82, { over: 16, ease: 'linear' });
  const wn = nina.walk([[-3.4, 4.4], [-0.9, 5.4]]);
  const wb = bus.walk([[-4.6, 4.0], [-2.6, 4.9], [0.1, 5.2]]);
  await s.wait(1.2);
  s.set('bell', 1);
  s.move('barrier', 1, { over: 4.5, ease: 'inOut' });
  await s.all(wn, wb);
  await s.all(nina.turn(12), bus.turn(352));
  s.set('freight', 0.04);                       // на дуге вдали — фара
  await s.move('freight_lamp', 1, { over: 1.4, ease: 'out' });
  s.set('nina_look', 'freight#light'); s.set('busygin_look', 'freight#light');
  scene.tell('wait:light');
  await s.wait(1.2);
  s.set('pos', 'waited');
};

beats.truth = async s => {
  await ready(s);
  const nina = s.person('nina'), bus = s.person('busygin');
  run(s);
  s.set('busygin_look', 'nina');
  await bus.turn(292);                          // он поворачивается к ней
  s.set('nina_look', 'busygin');
  scene.tell('truth:said');                     // Р62
  await s.until(() => scene.get('freight_x') >= L.S_PEOPLE - 8);
  s.set('nina_look', [-0.9, 10.5, 2.0]);        // она отворачивается к вагонам
  await nina.turn(2);
  await tailPassed(s);
  s.set('bell', 0);
  s.move('barrier', 0, { over: 3.2, ease: 'inOut' });
  scene.tell('truth:passed');
  s.set('nina_look', 'busygin');
  await nina.turn(80);                          // она поворачивается к нему — Р63
  await s.until(() => scene.get('barrier') < 0.2);
  s.set('nina_look', null);
  const wn = nina.walk([[-0.7, 9.0], [-0.5, 12.4], [-1.5, 15.2]]);   // идёт через пути первая
  await s.wait(0.9);
  s.set('busygin_look', null);
  const wb = bus.walk([[0.0, 9.2], [0.2, 12.4], [-0.8, 15.6]]);      // он за ней
  await s.all(wn, wb);
  s.set('pos', 'crossed');
};

beats.roar = async s => {
  await ready(s);
  const nina = s.person('nina'), bus = s.person('busygin');
  run(s);
  await s.until(() => scene.get('freight_x') >= L.S_LOUD);
  scene.tell('roar:loud');                      // Р64 — под грохот
  s.set('busygin_look', 'nina');
  await bus.turn(292);
  s.set('nina_look', 'busygin');
  nina.turn(60);
  await nina.walk([[-0.45, 5.35]]);             // наклоняется к нему (Р65)
  await s.wait(2.0);                            // Р66
  s.set('nina_look', [-0.45, 5.4, 0.3]);        // кивает: вниз и обратно
  await s.wait(0.7);
  s.set('nina_look', 'busygin');
  await tailPassed(s);
  s.set('bell', 0);
  s.move('barrier', 0, { over: 3.2, ease: 'inOut' });
  scene.tell('roar:passed');
  await s.until(() => scene.get('barrier') < 0.2);
  s.set('nina_look', null); s.set('busygin_look', null);
  const wn = nina.walk([[-0.4, 9.2], [-0.4, 12.4], [-1.4, 15.2]]);   // переходят рядом
  const wb = bus.walk([[0.6, 9.2], [0.6, 12.4], [-0.4, 15.4]]);
  await s.all(wn, wb);
  s.set('pos', 'crossed');
};

beats.brother = async s => {
  await ready(s);
  const nina = s.person('nina'), bus = s.person('busygin');
  run(s);
  s.set('busygin_look', 'nina');
  await bus.turn(300);                          // Р67
  s.set('nina_look', 'busygin');
  await nina.turn(60);
  s.set('nina_reach', { r: 'busygin#hand_l' }); // она берёт его за руку, он — её
  s.set('busygin_reach', { l: 'nina#hand_r' });
  await s.wait(1.4);
  scene.tell('brother:arm');
  await nina.turn(14);
  await bus.turn(350);
  s.set('nina_look', 'freight#light'); s.set('busygin_look', 'freight#light');
  await tailPassed(s);
  s.set('bell', 0);
  s.move('barrier', 0, { over: 3.2, ease: 'inOut' });
  scene.tell('brother:passed');                 // Р68
  await s.until(() => scene.get('barrier') < 0.2);
  s.set('nina_look', null); s.set('busygin_look', null);
  const wn = nina.walk([[-0.4, 9.2], [-0.4, 12.4], [-1.4, 15.2]]);   // переходят пути вместе, рука в руке
  const wb = bus.walk([[0.6, 9.2], [0.6, 12.4], [-0.4, 15.4]]);
  await s.all(wn, wb);
  s.set('pos', 'crossed');
};

function start(name) {
  const f = beats[name];
  if (!f) return;
  scene.sequence(async s => {
    await f(s);
    scene.tell('beat:' + name);
    scene.signal('beat:' + name);
  }, { name: 'film' });
}
scene.on('change', 'beat', v => { if (v) start(v); });
