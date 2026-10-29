// Outside the game: late autumn — she walks the spitz along the fence, it pulls her to the fence's end (as “The leash”
// would), the road, a train far off; her husband with the coat. Winter: the inkstand; Gurov by the grey fence, under
// her window (as “By the fence” would); the gate, the old maid with the old spitz, he calls it and it runs to him; the
// poster at dusk. The morning she goes: the lie, then (as another play has it, in the thaw) the truth; the epilogue.
const F = scene.lib.film(scene);
const order = ['autumn_walk', 'road_end', 'gate_home', 'inkwell', 'fence', 'fence_wait', 'gate_open', 'call_run', 'fence_dusk', 'gate_leave', 'leave_lie'];
const beats = scene.kit.beats.showcase(scene, F, order);
const after = {
  autumn_walk: async s => { s.set('anna_to', 0.7); await s.wait(5); },
  fence_wait: async s => { s.set('walk_to', 0.6); await s.wait(7); s.set('under', 1); },
};
const other = scene.kit.beats.showcase(scene, F, ['gate_leave', 'leave_truth', 'fence_end']);
return [
  ...beats.map(b => after[b.name] ? { name: b.name, run: async s => { await b.run(s); await after[b.name](s); } } : b),
  { name: 'another play', run: async s => { s.set('spring', 1); s.set('talk', 1); s.set('husband_knows', 1); await s.wait(0.1); } },
  ...other.map(b => ({ name: `${b.name} (another)`, run: b.run })),
];
