return [
  { name: 'summer', run: async s => { s.set('beat', 'summer'); await s.wait(20); } },
  { name: 'covered', run: async s => { s.set('beat', 'covered'); await s.wait(7); } },
  { name: 'headlights', run: async s => { s.set('beat', 'headlights'); await s.wait(14); } },
  { name: 'found', run: async s => { s.set('beat', 'found'); await s.wait(14); } },
  { name: 'alone', run: async s => { s.set('beat', 'alone'); await s.wait(9); } },
];
