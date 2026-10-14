// Пристань: куски играет сцена; игра ставит ключ `beat`.
const IDS = ['toto', 'elena', 'daughter', 'alfredo', 'banker', 'c1', 'c2', 'c3', 'c4'];
const SEAT_E = [0.2, 5.5, 0.42];        // ящик Елены
const BOLLARD = [2.4, 25.2, 0.72];      // тумба у фонаря
const WALL = { c1: [-4.2, 5.9], c2: [-4.3, 6.7], c3: [-4.1, 7.3], c4: [-3.9, 7.9] };
const CROWD = { c1: [-1.6, 8.9], c2: [-0.5, 9.1], c3: [0.7, 8.9], c4: [1.8, 8.7] };

function put(o, id, v) { for (const k in v) o[id + '_' + k] = v[k]; }
function base() {
  const o = { rain: 0, screen_up: 0, screen_film: 'romance', beam_on: 0, cover: 0, car: 'none', headlights: 0, car_go: 0,
    car_a: 3.6, car_z: -8, hour: 0.9, era: 'past', camera_x: 0, camera_z: 0, camera_yaw: 0 };
  for (const id of IDS) put(o, id, { here: false, do: 'stand', on: null, look: null, reach: null, gait: null, wear: null, turn: 0 });
  return o;
}
function fin(o) {
  o.dusk_k = Math.max(0, Math.min(1, (0.9 - o.hour) / 0.12));
  o.now_k = o.era === 'now' ? 1 : 0;
  return o;
}
function stand(o, id, a, d, turn) { put(o, id, { here: true, a, d, turn }); }
function summerBase(o) {
  o.screen_up = 1; o.beam_on = 1;
  stand(o, 'toto', -0.9, 5.3, 270);
  stand(o, 'elena', SEAT_E[0], SEAT_E[1], 340);
  put(o, 'elena', { do: 'seated', on: SEAT_E });
}
function underEave(o) { for (const id in WALL) { stand(o, id, WALL[id][0], WALL[id][1], 90); } }
function crowdBack(o) { for (const id in CROWD) stand(o, id, CROWD[id][0], CROWD[id][1], 0); }
function nightEnd(o) { o.camera_x = 1.3; o.camera_z = 17; stand(o, 'toto', BOLLARD[0], BOLLARD[1], 0); put(o, 'toto', { do: 'seated', on: BOLLARD }); }
function meetBase(o) {
  o.era = 'now'; o.car = 'new'; o.car_a = 3.6; o.car_z = 6.5; o.headlights = 1; o.camera_x = 0.5; o.camera_z = -2;
  stand(o, 'elena', 2.2, 8.4, 0); put(o, 'elena', { wear: 'elena_grown' });
  put(o, 'toto', { wear: 'salvatore' });
}

let last = null;
const BEATS = {
  summer: {
    after: [],
    from() { const o = base(); summerBase(o); crowdBack(o); scene.cut(fin(o)); },
    async run(s) {
      const toto = s.person('toto');
      s.set('beam_on', 1);
      await s.wait(1.5);
      toto.look('screen#screen');
      await s.wait(1.5);
      s.tell('summer:screen');
      await s.wait(9);
      s.tell('summer:rain');
      s.move('rain', 1, { over: 3 });
      const runs = Object.keys(WALL).map((id, i) => s.sequence(async q => {
        await q.wait(s.random() * 0.7 + i * 0.1);
        const p = q.person(id);
        await p.walk([WALL[id]], { gait: 'run' });
        await p.turn(90);
      }));
      toto.look(null);
      await s.wait(4.5);
    }
  },
  covered: {
    after: ['summer'],
    from() { const o = base(); summerBase(o); underEave(o); o.rain = 1; scene.cut(fin(o)); },
    async run(s) {
      const toto = s.person('toto'), elena = s.person('elena');
      toto.reach({ r: 'projector', l: 'projector' });
      s.move('cover', 1, { over: 2.5 });
      s.move('beam_on', 0, { over: 0.8 });
      await s.wait(1.2);
      s.set('elena_on', null);
      await elena.do('rise');
      s.tell('covered:done');
      await s.wait(0.5);
    }
  },
  headlights: {
    after: ['covered'],
    from() {
      const o = base(); summerBase(o); underEave(o); o.rain = 1; o.beam_on = 0; o.cover = 1;
      put(o, 'elena', { do: 'stand', on: null }); put(o, 'toto', { reach: { r: 'projector', l: 'projector' } });
      o.car = 'old'; o.car_z = 1.0; o.car_a = 3.6; o.headlights = 1;
      scene.cut(fin(o));
    },
    async run(s) {
      const elena = s.person('elena');
      s.set('headlights', 1);
      await s.move('car_z', 6.5, { over: 2.0 });
      s.set('banker_here', true);
      await s.wait(1.0);
      s.tell('headlights:father');
      await elena.walk([[1.9, 7.3]]);
      await elena.turn(233);
      await s.wait(0.6);
      s.tell('headlights:turn');
      await s.wait(1.4);
      s.set('elena_here', false);
      s.set('banker_here', false);
      s.set('car_go', 0);
      await s.move('car_go', 1, { over: 5 });
    }
  },
  found: {
    after: [],
    from() {
      const o = base(); nightEnd(o);
      stand(o, 'elena', -1.5, 12.5, 0);
      scene.cut(fin(o));
    },
    async run(s) {
      const toto = s.person('toto'), elena = s.person('elena');
      await s.wait(0.5);
      await elena.walk([[2.3, 24.4]], { gait: 'run' });
      s.tell('found:run');
      s.set('toto_turn', 180);
      s.set('toto_on', null);
      await toto.do('rise');
      s.set('toto_reach', { r: 'elena#back', l: 'elena#back' });
      s.set('elena_reach', { r: 'toto#nape', l: 'toto#nape' });
      await s.wait(1.5);
      s.tell('found:hug');
      await s.wait(5);
    }
  },
  alone: {
    after: [],
    from() { const o = base(); nightEnd(o); scene.cut(fin(o)); },
    async run(s) {
      await s.wait(7);
      s.tell('alone:sea');
      await s.wait(2);
    }
  },
  back: {
    after: [],
    from() {
      const o = base(); o.hour = 0.78; o.camera_x = 0.6; o.camera_z = 2; o.camera_yaw = -32;
      stand(o, 'alfredo', -4.15, 10.2, 0); put(o, 'alfredo', { do: 'seated', on: [-4.15, 10.2, 0.46] });
      stand(o, 'toto', -4.15, 9.0, 0); put(o, 'toto', { do: 'seated', on: [-4.15, 9.0, 0.46] });
      scene.cut(fin(o));
    },
    async run(s) {
      await s.wait(4);
      s.tell('back:sat');
      await s.wait(8);
      s.person('alfredo').look('toto');
      await s.wait(6);
    }
  },
  rise_go: {
    after: ['back'],
    from() {
      const o = base(); o.hour = 0.78; o.camera_x = 0.6; o.camera_z = 2; o.camera_yaw = -32;
      stand(o, 'alfredo', -4.15, 10.2, 0); put(o, 'alfredo', { do: 'seated', on: [-4.15, 10.2, 0.46] });
      stand(o, 'toto', -4.15, 9.0, 0); put(o, 'toto', { do: 'seated', on: [-4.15, 9.0, 0.46] });
      scene.cut(fin(o));
    },
    async run(s) {
      const toto = s.person('toto');
      s.set('toto_on', null);
      await toto.do('rise');
      await toto.walk([[-3.5, 10.2]]);
      await toto.turn(270);
      toto.reach({ r: 'alfredo#shoulder_r' });
      await s.wait(1.5);
      toto.reach(null);
      await toto.walk([[0, 6], [0.5, -3]]);
      s.set('toto_here', false);
      s.tell('rise_go:gone');
    }
  },
  car: {
    after: [],
    from() {
      const o = base(); meetBase(o);
      stand(o, 'daughter', 1.4, 8.6, 90);
      stand(o, 'toto', -2.8, -3.0, 0); put(o, 'toto', { wear: 'salvatore' });
      scene.cut(fin(o));
    },
    async run(s) {
      const d = s.person('daughter'), t = s.person('toto');
      s.sequence(async q => { await q.wait(1.5); await q.person('daughter').walk([[0.8, 6], [0.3, -4]]); s.set('daughter_here', false); });
      await t.walk([[-2.4, 3.4]]);
      await s.wait(1);
    }
  },
  meet: {
    after: ['car'],
    from() { const o = base(); meetBase(o); stand(o, 'toto', -2.4, 3.4, 0); put(o, 'toto', { wear: 'salvatore' }); scene.cut(fin(o)); },
    async run(s) {
      const e = s.person('elena'), t = s.person('toto');
      await e.turn(230);
      s.tell('meet:turned');
      await s.wait(1.0);
      await t.walk([[-0.6, 5.6]]);
      await t.turn(41);
      await s.wait(1.5);
    }
  },
  ask: {
    after: ['meet'],
    from() { const o = base(); meetBase(o); stand(o, 'toto', -0.6, 5.6, 41); put(o, 'toto', { wear: 'salvatore' }); put(o, 'elena', { turn: 230 }); scene.cut(fin(o)); },
    async run(s) {
      const e = s.person('elena'), t = s.person('toto');
      await t.walk([[0.8, 7.0]]);
      await e.walk([[1.6, 7.5]]);
      await e.turn(250);
      e.reach({ r: 'toto#chest' });
      await s.wait(1.2);
      s.tell('ask:hand');
      await s.wait(2);
      e.reach(null);
      await e.walk([[2.7, 7.6]]);
    }
  },
  bye: {
    after: ['meet'],
    from() { const o = base(); meetBase(o); stand(o, 'toto', -0.6, 5.6, 41); put(o, 'toto', { wear: 'salvatore' }); put(o, 'elena', { turn: 230 }); scene.cut(fin(o)); },
    async run(s) {
      const e = s.person('elena'), t = s.person('toto');
      await t.walk([[-1.2, 4.8]]);
      await t.turn(41);
      e.look([2.0, 7.0, 0.4]);
      await s.wait(0.8);
      s.tell('bye:nod');
      e.look('toto');
      await s.wait(1.2);
      e.look(null);
      await e.walk([[2.7, 7.6]]);
    }
  },
  parting: {
    after: ['ask', 'bye'],
    from() { const o = base(); meetBase(o); stand(o, 'toto', 0.8, 7.0, 41); put(o, 'toto', { wear: 'salvatore' }); stand(o, 'elena', 2.7, 7.6, 90); put(o, 'elena', { wear: 'elena_grown' }); scene.cut(fin(o)); },
    async run(s) {
      const e = s.person('elena');
      await s.wait(0.8);
      s.set('elena_here', false);
      s.set('car_go', 0);
      await s.wait(0.4);
      await s.move('car_go', 1, { over: 6 });
      s.tell('parting:gone');
      await s.wait(2);
    }
  }
};

function derive() {
  scene.set('dusk_k', Math.max(0, Math.min(1, (0.9 - scene.get('hour')) / 0.12)));
  scene.set('now_k', scene.get('era') === 'now' ? 1 : 0);
}
function drive() { scene.set('car_z', 6.5 + scene.get('car_go') * 16); }
scene.on('change', 'hour', derive);
scene.on('change', 'era', derive);
scene.on('change', 'car_go', drive);
scene.on('move', 'car_go', drive);

function start(name) {
  const b = BEATS[name];
  if (!b) return;
  if (!(last && b.after && b.after.indexOf(last) >= 0)) b.from();
  last = name;
  scene.sequence(async s => { await b.run(s); s.tell('beat:' + name); }, { name: 'beat' });
}
scene.on('change', 'beat', v => start(v));
derive();
start(scene.get('beat'));
