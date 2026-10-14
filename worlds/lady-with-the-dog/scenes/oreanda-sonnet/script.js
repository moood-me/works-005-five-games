// «Ореанда»: pieces of the film, driven by the key `beat`. A piece waits for events, not seconds.
const SEATS = { anna: [-0.95, 4.7], gurov: [-0.25, 4.7] };

const sitDown = s => {
  for (const id of ['anna', 'gurov']) {
    s.set(id + '_a', SEATS[id][0]);
    s.set(id + '_d', SEATS[id][1]);
    s.set(id + '_turn', 0);
    s.set(id + '_here', true);
    s.person(id).look(null);
    s.person(id).do('seated', { loop: true });
  }
};

const PIECES = {
  bench: {
    after: [],
    from(s) {
      s.set('dawn', 0);
      s.set('hour', 0.18);
      s.set('mist', 1);
      s.set('lights', 3);
      s.set('fade', 1);
      s.set('hand', 0);
      s.set('steamer_d', 520);
      s.set('camera_z', 0);
      s.set('watchman_here', false);
      s.set('spitz_here', 1);
      s.set('spitz_view', 'back');
      s.set('spitz_do', 'lie');
      s.set('spitz_a', -0.6);
      s.set('spitz_d', 5.0);
      s.set('spitz_e', 0);
      s.set('leash', 'anna#hand_r');
      sitDown(s);
    },
    async run(s) {
      await s.move('fade', 0, { over: 1.5 });
      s.tell('bench:sat');
      await s.wait(9);
    },
  },
  still: {
    after: ['bench'],
    from(s) {
      PIECES.bench.from(s);
      s.set('fade', 0);
    },
    async run(s) {
      await s.wait(2);
    },
  },
  watchman: {
    after: ['still'],
    from(s) {
      PIECES.still.from(s);
      s.set('dawn', 0.5);
    },
    async run(s) {
      s.move('dawn', 1, { over: 9 });
      const w = s.person('watchman');
      s.set('watchman_a', 4.4);
      s.set('watchman_d', 8.7);
      s.set('watchman_turn', 180);
      s.set('watchman_here', true);
      w.with(['stick']);
      await w.walk([[2.6, 8.3], [1.4, 6.8]]);
      await w.turn(180);
      w.look('gurov#head');
      s.tell('watchman:looks');
      await s.wait(2.5);
      w.look(null);
      await w.turn(0);
      await w.walk([[2.6, 8.3], [4.4, 8.7]]);
      s.set('watchman_here', false);
      s.tell('watchman:gone');
    },
  },
  dew: {
    after: ['watchman'],
    from(s) {
      PIECES.still.from(s);
      s.set('dawn', 1);
      s.set('mist', 0.6);
      s.set('lights', 0);
    },
    async run(s) {
      s.move('lights', 0, { over: 2 });
      s.move('steamer_d', 400, { over: 8, ease: 'linear' });
      const a = s.person('anna');
      const g = s.person('gurov');
      a.look('gurov#head');
      await s.wait(2.5);
      s.set('spitz_view', 'side');
      s.set('spitz_do', 'stand');
      s.set('leash', 'none');
      s.all(g.do('rise', { loop: false }), a.do('rise', { loop: false }));
      await s.wait(0.8);
      await s.move('spitz_e', 0.25, { over: 0.25, ease: 'out' });
      await s.move('spitz_e', 0, { over: 0.3, ease: 'in' });
      await s.wait(2.5);
    },
  },
  bench_end: {
    after: [],
    from(s) {
      s.set('dawn', 1);
      s.set('hour', 0.28);
      s.set('mist', 0.6);
      s.set('lights', 0);
      s.set('fade', 0);
      s.set('hand', 0);
      s.set('steamer_d', 400);
      s.set('camera_z', 0);
      s.set('anna_here', false);
      s.set('gurov_here', false);
      s.set('watchman_here', false);
      s.set('spitz_here', 0);
    },
    async run(s) {
      s.move('mist', 0.15, { over: 12 });
      await s.move('camera_z', 0.9, { over: 12, ease: 'inOut' });
    },
  },
};

const start = name => {
  const p = PIECES[name];
  if (!p) return;
  scene.sequence(async s => {
    if (!p.after.includes(scene.get('last'))) p.from(s);
    await p.run(s);
    s.set('last', name);
    s.tell('beat:' + name);
  }, { name: 'beat' });
};

// a key of meaning to its place: dawn moves the hour and the hand covers hers
const follow = () => scene.set('hour', 0.18 + 0.1 * scene.get('dawn'));
scene.on('move', 'dawn', follow);
scene.on('change', 'dawn', follow);
const handTo = v => scene.person('gurov').reach(v ? { l: 'anna#hand_r' } : { l: null });
scene.on('change', 'hand', handTo);
scene.on('change', 'beat', v => start(v));

handTo(scene.get('hand'));
if (scene.get('beat')) start(scene.get('beat'));
