// Outside the game: the Moscow of chapters III and V and the epilogue in a row — the first snow; the evening lane and two
// of the women he takes for her (what the game's “The shadow” moves, moved here by hand); the window upstairs; the club
// and “the sturgeon”, and he walks away; the departure before dawn; home late in the thaw, and the truth at the door; to school
// by the hand (“By the hand”, by hand), she waves at the gate, the note; the porch at night, his wife at the
// window.
const F = scene.lib.film(scene);
const order = ['first_snow', 'evening_walk', 'table_window', 'club', 'say', 'say_walk', 'porch_go', 'home_late', 'wife_truth',
  'school', 'walk_hand', 'gate_school', 'red_cap', 'porch_end'];
const beats = scene.kit.beats.showcase(scene, F, order);
const after = {
  evening_walk: async s => {
    for (const [stop, shade] of [[1, 'shade1'], [3, 'shade3']]) {
      const [a, d] = scene.lib.STOPS[stop - 1];
      s.set('walk_on', stop);
      await s.until(() => Math.hypot(scene.get('gurov_a') - a, scene.get('gurov_d') - d) < 0.1);
      s.set(shade, 1);
      await s.wait(2.5);
      s.set('gurov_look', shade);
      await s.wait(1);
      s.set(shade, 2);
      await s.wait(2.5);
      s.set('gurov_look', null);
    }
    s.set('look_back', 1);
  },
  walk_hand: async s => {
    s.set('go', 1);
    await s.until(() => scene.get('walked') >= 0.6);
    s.set('go', 0);
    await s.wait(1.5);
    s.set('go', 1);
    await s.until(() => scene.get('walked') >= 0.999);
    s.set('go', 0);
    s.set('wave', 1);
  },
  // the other party from here on (before the next beats' cuts are made ready): his wife knows, and Anna held out till the
  // spring — the thaw
  say_walk: async s => { s.set('wife_knows', 1); s.set('spring', 1); },
};
return [
  { name: 'winter', run: async s => { s.set('spring', 0); s.set('wife_knows', 0); s.set('wave', 0); s.set('look_back', 0); } },
  ...beats.map(b => after[b.name] ? { name: b.name, run: async s => { await b.run(s); await after[b.name](s); } } : b),
];
