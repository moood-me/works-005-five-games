// each insert opened in turn, its keys moved as a mini-game would
const open = (n, fn) => ({ name: n, run: async s => { s.set(n, 1); await s.wait(0.6); await fn(s); await s.wait(0.8); s.set(n, 0); } });
return [
  open('splice', async s => {
    s.set('bent2', 1);
    for (const N of [1, 2, 3]) { await s.wait(0.8); await s.move(`cut${N}`, 1, { over: 0.4 }); s.move('boy_reach', N / 3, { over: 1 }); await s.wait(0.6); await s.move(`glue${N}`, 1, { over: 1.2 }); await s.wait(0.6); }
  }),
  open('slate', async s => { s.set('crooked', '01000100'); await s.move('chalk_x', 1, { over: 5, ease: 'linear' }); s.set('letters', 8); }),
  open('thread', async s => {
    for (let k = 0; k < 5; k++) { await s.move('pull', 1, { over: 1, ease: 'linear' }); if (k === 2) s.set('loop', 1); s.set('threaded', k + 1); s.set('pull', 0); await s.wait(0.4); }
  }),
  open('viewfinder', async s => { s.set('rec', 1); s.move('elena_x', 0, { over: 6, ease: 'linear' }); s.move('pan', -0.3, { over: 5 }); await s.wait(2); s.set('madman_x', -0.96); await s.move('madman_x', 0.96, { over: 2, ease: 'linear' }); await s.wait(2); }),
  open('calendar', async s => { for (let p = 0; p < 4; p++) { await s.move('fold', 1, { over: 0.8 }); s.set('pages', p + 1); s.set('fold', 0); if (!p) s.move('dust', 0, { over: 1 }); await s.wait(0.5); } await s.wait(1.5); }),
  open('strip', async s => { s.set('jumps', 2); await s.move('strip_x', 1, { over: 10, ease: 'linear' }); }),
  open('wallet', async s => { await s.move('open', 1, { over: 2.5 }); await s.wait(1.5); }),
];
