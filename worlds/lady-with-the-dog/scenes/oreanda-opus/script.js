// Ореанда: the scene's mechanics. The steamer goes where the dawn says; his hand follows `hand`; the beats are
// films in pieces, started by the game setting `beat` (each ends saying `beat:<name>` and setting `beat_end`).
const L = scene.lib;

// the steamer: one meaning key (dawn) → its place in metres, set at once whenever the dawn moves
function steamer() {
  const [a, d] = L.steamerAt(scene.get('dawn'));
  scene.set('steamer_a', a);
  scene.set('steamer_d', d);
}
scene.on('change', 'dawn', steamer);
scene.on('move', 'dawn', steamer);
steamer();

// his hand over hers on the bench
function hand() {
  scene.set('gurov_reach', Number(scene.get('hand')) > 0.5 ? { l: 'anna#hand_r' } : null);
}
scene.on('change', 'hand', hand);

// where every beat may begin from: the two on the bench before dawn, the dog at her feet, nobody else
function base(extra) {
  const [sa, sd] = L.steamerAt(extra.dawn ?? 0);
  return {
    fade: 0, dawn: 0, mist: 1, lights: 3, cicada: 1, hand: 0, camera_z: 0,
    anna_a: L.ANNA_SEAT[0], anna_d: L.ANNA_SEAT[1], gurov_a: L.GUROV_SEAT[0], gurov_d: L.GUROV_SEAT[1],
    anna_here: true, anna_on: L.ANNA_SEAT, anna_do: 'seated', anna_turn: 0, anna_look: null, anna_reach: { r: L.HAND_SPOT },
    gurov_here: true, gurov_on: L.GUROV_SEAT, gurov_do: 'seated', gurov_turn: 0, gurov_look: null, gurov_reach: null,
    watchman_here: false, watchman_a: L.WATCH_FROM[0], watchman_d: L.WATCH_FROM[1], watchman_look: null,
    spitz_here: 1, spitz_a: L.SPITZ[0], spitz_d: L.SPITZ[1], spitz_e: 0, spitz_do: 'lie', spitz_view: 'side', spitz_dir: 1,
    spitz_look: null, leash: 'anna#hand_l',
    steamer_a: sa, steamer_d: sd,
    ...extra,
  };
}

const BEATS = {
  // from darkness: the hour before dawn, the two on the bench, far out the steamer's lights
  bench: {
    after: [], from: () => base({ fade: 1 }),
    run: async s => {
      s.move('fade', 0, { over: 1.5, ease: 'out' });
      await s.wait(2.5);
      s.tell('bench:sat');
      await s.wait(3);
      s.person('anna').look('steamer#lights');
      await s.wait(3.5);
      s.person('gurov').look([-120, 700, -2]);
      await s.wait(3);
    },
  },
  // the same: the game's «Море» plays over it
  still: { after: ['bench'], from: () => base({}), run: async s => { await s.wait(2); } },
  // light; the watchman comes along the path, looks at them, goes
  watchman: {
    after: ['still'], from: () => base({ dawn: 0.85, lights: 0, cicada: 0 }),
    run: async s => {
      s.move('dawn', 1, { over: 6 });
      const w = s.person('watchman');
      s.set('watchman_a', L.WATCH_FROM[0]);
      s.set('watchman_d', L.WATCH_FROM[1]);
      w.here(true);
      await w.walk([L.WATCH_STOP]);
      await w.turn(207);
      w.look('gurov');
      s.tell('watchman:looks');
      await s.wait(0.6);
      s.person('gurov').look('watchman');
      await s.wait(2.6);
      w.look(null);
      await w.walk(L.WATCH_OFF);
      w.here(false);
      s.person('gurov').look(null);
      s.tell('watchman:gone');
    },
  },
  // the steamer under the coast, its lights out; she turns her head to him; they rise; the dog jumps up
  dew: {
    after: ['watchman'], from: () => base({ dawn: 1, lights: 0, cicada: 0 }),
    run: async s => {
      const anna = s.person('anna'), gurov = s.person('gurov');
      anna.look('gurov');
      await s.wait(2.2);
      gurov.look('anna');
      await s.wait(1.6);
      s.set('gurov_reach', null);
      s.set('anna_reach', null);
      s.set('spitz_do', 'stand');
      s.set('spitz_look', 'anna');
      s.set('anna_a', L.ANNA_STAND[0]); s.set('anna_d', L.ANNA_STAND[1]);
      s.set('gurov_a', L.GUROV_STAND[0]); s.set('gurov_d', L.GUROV_STAND[1]);
      anna.on(null);
      const up = anna.do('rise');
      await s.wait(0.4);
      gurov.on(null);
      await s.all(up, gurov.do('rise'));
      anna.look(null);
      await s.wait(1);
    },
  },
  // the epilogue: the empty bench at dawn, the sea below, the mist going; the camera comes slowly closer
  bench_end: {
    after: [], from: () => base({ dawn: 1, lights: 0, cicada: 0, anna_here: false, gurov_here: false, spitz_here: 0 }),
    run: async s => {
      s.move('mist', 0.15, { over: 12 });
      await s.move('camera_z', 0.7, { over: 12, ease: 'inOut' });
    },
  },
};

scene.on('change', 'beat', (name, old) => {
  const b = BEATS[name];
  if (!b) return;
  scene.sequence(async s => {
    if (!b.after.includes(old)) {
      const next = s.shot(b.from());
      await s.until(() => next.ready);
      next.cut();
    }
    await b.run(s);
    s.set('beat_end', name);
    s.tell('beat:' + name);
  }, { name: 'beat' });
});
