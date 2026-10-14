const play = name => async s => {
  s.set('beat', '');
  await s.wait(0.05);
  s.set('beat', name);
  await s.event('beat:' + name);
};
return [
  { name: 'ожидание', run: play('wait') },
  { name: 'правда', run: play('truth') },
  { name: 'грохот', run: async s => { await play('wait')(s); await play('roar')(s); } },
  { name: 'брат', run: async s => { await play('wait')(s); await play('brother')(s); } },
];
