// Outside the game: the beats one after another as the game would play them, and «Подглядывать» played by itself
// after `peek` (the boy leans out, the priest rings, looks round, the boy hides).
const B = scene.kit.beats.showcase(scene, scene.lib.FILM, ['priest', 'peek', 'bell_end', 'full_hall', 'first_kiss', 'whistle', 'ruin_hall', 'memory']);
const peeking = { name: 'подглядывать', run: async s => {
  await s.move('peek', 1, { over: 1.2 });
  await s.wait(1.5); s.set('bell', 1);
  await s.wait(3.2); s.set('bell', 0); s.move('turn', 1, { over: 0.4 });
  await s.wait(0.4); await s.move('peek', 0, { over: 0.4 });
  await s.wait(1.6); s.move('turn', 0, { over: 0.4 });
  await s.wait(1);
} };
return [B[0], B[1], peeking, ...B.slice(2)];
