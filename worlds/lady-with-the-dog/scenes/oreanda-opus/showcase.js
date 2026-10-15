// Outside the game: the whole of II.2 and the epilogue in a row — the bench before dawn, the sea (the dawn comes, the
// steamer's lights go out, his hand on hers — what the game moves, moved here by hand), the watchman, the dew, the
// empty bench.
const F = scene.lib.film(scene);
const beats = scene.kit.beats.showcase(scene, F, ['bench', 'still', 'watchman', 'dew', 'bench_end']);
const sea = async s => {
  const dawn = s.move('dawn', 0.85, { over: 14 });
  await s.wait(3);
  s.set('cicada', 0);
  await s.wait(2);
  s.move('lights', 0, { over: 6 });
  await s.wait(4);
  s.set('hand', 1);
  await dawn;
};
return beats.map(b => b.name === 'still' ? { name: b.name, run: async s => { await b.run(s); await sea(s); } } : b);
