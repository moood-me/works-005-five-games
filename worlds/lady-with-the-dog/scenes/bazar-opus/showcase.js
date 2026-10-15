// Outside the game: the finale. He comes in; she stays at the window; his hands on her shoulders, the grey temple in
// the mirror; tea; she weeps at the window; together at the window, they turn to each other — the window, the door,
// the table; the camera draws back. Then, as another party has it: the thaw, the spitz on the armchair, and she comes
// to meet him at the door.
const beat = name => async s => {
  s.set('beat', name);
  await s.until(() => s.state.beat_end === name);
};
return [
  { name: 'bazar_in', run: beat('bazar_in') },
  { name: 'shoulders', run: beat('shoulders') },
  { name: 'tea', run: async s => {
    await beat('tea')(s);
    s.set('tap', 1);
    await s.move('fill', 0.9, { over: 4 });
    s.set('tap', 0);
    await s.wait(1);
  } },
  { name: 'weep', run: beat('weep') },
  { name: 'cages', run: beat('cages') },
  { name: 'sovet', run: async s => {
    await beat('sovet')(s);
    for (const t of ['window', 'door', 'table']) { s.set('think', t); await s.wait(2.5); }
  } },
  { name: 'bazar_end', run: beat('bazar_end') },
  { name: 'another party', run: async s => {
    s.set('spring', 1);
    s.set('dog_here', 1);
    s.set('anna_life', 1);
    await beat('bazar_in')(s);
  } },
];
