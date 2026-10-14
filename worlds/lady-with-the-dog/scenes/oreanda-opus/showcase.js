// Outside the game: the whole of II.2 and the epilogue in a row — the bench before dawn, the sea (the dawn comes,
// the steamer's lights go out, his hand on hers), the watchman, the dew, the empty bench.
const beat = name => async s => {
  s.set('beat', name);
  await s.until(() => s.state.beat_end === name);
};
return [
  { name: 'bench', run: beat('bench') },
  { name: 'still', run: async s => {
    await beat('still')(s);
    const dawn = s.move('dawn', 1, { over: 16 });
    await s.wait(3);
    s.set('cicada', 0);
    await s.wait(2);
    s.move('lights', 0, { over: 6 });
    await s.wait(4);
    s.set('hand', 1);
    await dawn;
  } },
  { name: 'watchman', run: beat('watchman') },
  { name: 'dew', run: beat('dew') },
  { name: 'bench_end', run: beat('bench_end') },
];
