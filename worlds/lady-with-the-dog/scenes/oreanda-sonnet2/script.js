const SEAT_G = [0.45, 3.7, 0.46], SEAT_A = [-0.4, 3.7, 0.46];
const SEATED = { motion: 'seated', loop: true };

function base(dawn, mist, lights) {
  scene.set('hour', 0.18);
  scene.set('dawn', dawn); scene.set('mist', mist); scene.set('lights', lights);
  scene.set('camera_z', 0.9);
  scene.set('gurov_here', true); scene.set('anna_here', true);
  scene.set('gurov_a', 0.45); scene.set('gurov_d', 3.7); scene.set('anna_a', -0.4); scene.set('anna_d', 3.7);
  scene.set('gurov_on', SEAT_G); scene.set('anna_on', SEAT_A);
  scene.set('gurov_turn', 0); scene.set('anna_turn', 0);
  scene.set('gurov_do', SEATED); scene.set('anna_do', SEATED);
  scene.set('spitz_here', 1); scene.set('spitz_do', 'lie');
  scene.set('watchman_here', false);
}

const BEATS = {
  bench: async s => {
    base(0, 1, 3);
    scene.set('hand', 0); scene.set('gurov_reach', null); scene.set('gurov_look', null); scene.set('anna_look', null);
    scene.set('fade', 1); scene.move('fade', 0, { over: 1.5 });
    await s.wait(6);
    scene.tell('bench:sat');
    await s.wait(4);
    scene.tell('beat:bench');
  },
  still: async s => {
    if (scene.get('watchman_here') || scene.get('spitz_do') !== 'lie') base(scene.get('dawn'), scene.get('mist'), scene.get('lights'));
    await s.wait(2);
    scene.tell('beat:still');
  },
  watchman: async s => {
    base(Math.max(0.25, scene.get('dawn')), 1, 3);
    scene.set('watchman_a', 6.5); scene.set('watchman_d', 2.7); scene.set('watchman_turn', 270);
    scene.set('watchman_here', true);
    s.move('dawn', 1, { over: 12 });
    const w = s.person('watchman');
    await w.walk([[2.0, 2.7]]);
    scene.set('gurov_look', 'watchman'); scene.set('anna_look', 'watchman');
    await w.turn(0);
    scene.tell('watchman:looks');
    await s.wait(2.2);
    scene.set('gurov_look', null); scene.set('anna_look', null);
    await w.walk([[-4.5, 2.7]]);
    scene.set('watchman_here', false);
    scene.tell('watchman:gone');
    await s.wait(1);
    scene.tell('beat:watchman');
  },
  dew: async s => {
    base(1, 0.7, 3);
    scene.set('gurov_reach', null);
    s.move('lights', 0, { over: 3 });
    await s.wait(2);
    scene.set('anna_look', 'steamer');
    await s.wait(2.5);
    scene.set('hand', 0); scene.set('gurov_reach', null);
    scene.set('gurov_on', null); scene.set('anna_on', null);
    scene.set('spitz_do', 'stand');
    s.person('gurov').do('rise');
    await s.person('anna').do('rise');
    scene.tell('beat:dew');
  },
  bench_end: async s => {
    base(1, 0.8, 0);
    scene.set('gurov_here', false); scene.set('anna_here', false); scene.set('spitz_here', 0);
    scene.set('dawn', 1);
    s.move('mist', 0.2, { over: 12 });
    s.move('camera_z', 1.7, { over: 12, ease: 'inOut' });
    await s.wait(12);
    scene.tell('beat:bench_end');
  },
};

function run(name) { const f = BEATS[name]; if (f) scene.sequence(f, { name: 'beat' }); }
scene.on('change', 'beat', v => run(v));
scene.on('change', 'hand', v => {
  if (v) { scene.set('gurov_reach', { l: 'anna#hand_r' }); } else { scene.set('gurov_reach', null); }
});
run(scene.get('beat'));
