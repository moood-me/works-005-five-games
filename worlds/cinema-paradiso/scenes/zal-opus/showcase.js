// Outside the game: the beats one after another, as the game would set them, and «Подглядывать» played by itself
// between peek and bell_end (the boy leans out, the priest rings, looks round, the boy hides).
const play = name => ({ name, run: async s => { s.set('beat', name); await s.until(() => s.get('beat_last') === name); } });
const peeking = { name: 'подглядывать', run: async s => {
  await s.move('peek', 1, { over: 1.2 });
  await s.wait(1.5); s.set('bell', 1);
  await s.wait(3.2); s.set('bell', 0); s.move('turn', 1, { over: 0.6 });
  await s.wait(0.4); await s.move('peek', 0, { over: 0.5 });
  await s.wait(1.4); s.move('turn', 0, { over: 0.6 });
  await s.wait(1);
} };
return [play('priest'), play('peek'), peeking, ...['bell_end', 'full_hall', 'first_kiss', 'whistle', 'ruin_hall', 'memory'].map(play)];
