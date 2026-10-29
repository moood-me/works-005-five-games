// Outside the game: the evening of “The Geisha”. The hall fills behind Gurov; from the balcony the ladies come in one
// by one (as “Find her” brings them) and her lorgnette glints; her husband comes in bowing; the interval — he stays and
// looks round, she goes out by the side door; the corridor; the landing, the two under the lamp, she promises and goes
// down; the bell. Then as another play has it: he took another for her, the husband goes out, Gurov comes to her row;
// on the landing she sends him away.
const F = scene.lib.film(scene);
const order = ['hall', 'hall_find', 'husband_in', 'interval_stay', 'corridor', 'stairs', 'promise_go', 'bell'];
const beats = scene.kit.beats.showcase(scene, F, order);
const after = {
  hall_find: async s => {
    for (let n = 1; n <= 6; n++) { s.set('enter', n); await s.wait(3); }
    await s.wait(3);
    await s.move('glint', 1, { over: 1 });
    await s.wait(1.5);
    s.set('glint', 0);
  },
};
const other = scene.kit.beats.showcase(scene, F, ['husband_in', 'interval_out', 'approach', 'stairs', 'away_go', 'bell']);
return [
  ...beats.map(b => after[b.name] ? { name: b.name, run: async s => { await b.run(s); await after[b.name](s); } } : b),
  { name: 'another play', run: async s => { s.set('noticed', 1); s.set('anna_life', 1); s.set('enter', 6); await s.wait(0.1); } },
  ...other.map(b => ({ name: `${b.name} (another)`, run: b.run })),
];
