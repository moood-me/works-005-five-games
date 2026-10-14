// Outside games: the crossing as it waits, then the freight goes by and the two cross the rails.
return [
  { name: 'wait', run: async s => { s.set('beat', 'wait'); await s.wait(20); } },
  { name: 'truth', run: async s => { s.set('beat', null); s.set('beat', 'truth'); await s.wait(28); } },
];
