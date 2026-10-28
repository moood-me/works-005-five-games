// Outside the game: the finale. He comes in; she stays at the window; his hands on her shoulders, the grey temple in
// the mirror; tea (poured by hand here, as the game would); she weeps at the window; the two at the window, in profile
// in the lamp's light; the window, the door, the glasses; the camera draws back and he looks at his watch. Then, as
// another party has it: the thaw, and she comes to meet him at the door.
const F = scene.lib.film(scene);
const beats = scene.kit.beats.showcase(scene, F, ['bazaar_in', 'shoulders', 'tea', 'weep', 'cages', 'counsel', 'bazaar_end']);
const after = {
  tea: async s => {
    await s.move('glass_at', 1, { over: 1.5, ease: 'inOut' });
    s.set('tap', 1);
    await s.move('fill', 0.95, { over: 3.5 });
    s.set('tap', 0);
    await s.wait(0.8);
  },
  counsel: async s => { for (const t of ['window', 'door', 'table']) { s.set('think', t); await s.wait(2.2); } },
};
return [
  ...beats.map(b => after[b.name] ? { name: b.name, run: async s => { await b.run(s); await after[b.name](s); } } : b),
  { name: 'another party', run: async s => {
    s.set('spring', 1); s.set('anna_life', 1); s.set('husband_knows', 1);
    s.cut(F.bazaar_in.from());
    await F.bazaar_in.run(s);
  } },
];
