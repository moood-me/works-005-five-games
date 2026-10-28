// Outside the game: the street's beats in the order the game plays them (I: down to the windows, the knocks, the last
// window, Sarafanov at Makarskaya's, the porch, the door shut and opened again, in; Sarafanov home under his window.
// II: Nina and the cadet at the gate. IV: the second evening, the fire, the buckets, who did it — both ways. V: the
// bench, the coat, after it; out of the door, the run. The epilogue's window). The mini-games' moves are the
// showcase's own beats: a knock at the middle window, a bucket filled and thrown, a run with a look back.
const L = scene.lib;
const F = {
  ...L.film(scene),
  windows: { after: ['knock_ready'], run: async s => {
    s.set('knock', 3);
    await s.wait(5.5);
    s.set('win3', 2);
    await s.wait(2.2);
    s.set('win3', 0);
    await s.wait(1.2);
    s.set('knock', 0);
    for (const w of ['win1', 'win5', 'win2', 'win4']) {
      await s.wait(1.1);
      s.set(w, 0);
    }
    await s.move('snow', 0.7, { over: 2 });
  } },
  splash: { after: ['fire'], run: async s => {
    s.set('buckets', 'fill');
    await s.wait(3.5);
    s.set('buckets', 'throw');
    await s.wait(1.5);
    s.move('fire', 0.4, { over: 4 });
    await s.wait(6);
    s.set('buckets', 'none');
    await s.move('fire', 0, { over: 3 });
  } },
  run: { after: ['run_out'], run: async s => {
    s.set('run', 0.3);
    await s.wait(6);
    s.set('look_back', 1);
    await s.wait(3);
    s.set('look_back', 0);
    s.set('run', 0.55);
    await s.wait(6);
  } },
};
return scene.kit.beats.showcase(scene, F, ['walk', 'knock_ready', 'windows', 'last_window', 'neighbor', 'porch', 'shut', 'in',
  'return', 'gate', 'evening', 'fire', 'splash', 'after_fire', 'blame', 'after_fire', 'own_up', 'porch_night', 'shawl',
  'porch_after', 'run_out', 'run', 'night_window']);
