// Outside the game: the farewell at the station — the platform, the window, she watches the train take her away,
// he alone at the last lamp; then again the window, this time the curtain drawn, and he goes to the door.
const beat = name => async s => {
  s.set('beat', name);
  await s.until(() => s.state.beat_end === name);
};
return [
  { name: 'platform', run: beat('platform') },
  { name: 'board', run: beat('board') },
  { name: 'look_back', run: beat('look_back') },
  { name: 'alone_far', run: beat('alone_far') },
  { name: 'board again', run: async s => { s.set('beat', 'platform'); await s.until(() => s.state.beat_end === 'platform'); await beat('board')(s); } },
  { name: 'curtain', run: beat('curtain') },
  { name: 'alone_turn', run: beat('alone_turn') },
];
