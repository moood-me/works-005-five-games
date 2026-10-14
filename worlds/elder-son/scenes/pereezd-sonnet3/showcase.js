
return [
  { name: 'wait', run: async s => { s.set('beat', 'wait'); await s.until(() => s.get('beat_done') === 'wait'); } },
  { name: 'truth', run: async s => { s.set('beat', 'truth'); await s.until(() => s.get('beat_done') === 'truth'); } },
];
