return [
  { name: 'bench', run: async s => { s.set('beat', 'bench'); await s.wait(10.5); } },
  { name: 'still', run: async s => { s.set('beat', 'still'); await s.wait(2.5); } },
  { name: 'watchman', run: async s => { s.set('beat', 'watchman'); await s.wait(14); } },
  { name: 'dew', run: async s => { s.set('beat', 'dew'); await s.wait(9); } },
  { name: 'bench_end', run: async s => { s.set('beat', 'bench_end'); await s.wait(12.5); } },
];
