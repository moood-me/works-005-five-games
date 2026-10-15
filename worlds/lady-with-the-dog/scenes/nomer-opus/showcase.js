// Outside the game: the night in her room — the bowed head, the watermelon cut in the close-up, half an hour of
// silence; then he brings her the slice and his hand comes to hers; she turns away and speaks. Then the other way:
// he eats at the table and turns to her on his chair.
const beat = name => async s => {
  s.set('beat', name);
  await s.until(() => s.state.beat_end === name);
};
return [
  { name: 'room', run: beat('room') },
  { name: 'room_hold', run: beat('room_hold') },
  { name: 'melon', run: async s => {
    await beat('melon')(s);
    await s.move('cut', 1, { over: 4, ease: 'inOut' });
    s.set('slice', 1);
    await s.wait(1.2);
    s.move('candle', 0.4, { over: 2 });
  } },
  { name: 'melon_hold', run: beat('melon_hold') },
  { name: 'beside', run: async s => {
    await beat('beside')(s);
    await s.move('hand_at', 1, { over: 4, ease: 'inOut' });
    await s.wait(0.8);
    s.set('palm', 1);
    await s.wait(1.5);
  } },
  { name: 'beside_hold', run: beat('beside_hold') },
  { name: 'confession_bed', run: beat('confession_bed') },
  { name: 'at the table', run: async s => { s.set('beat', 'melon_hold'); await s.until(() => s.state.beat_end === 'melon_hold'); } },
  { name: 'melon_eat', run: beat('melon_eat') },
  { name: 'confession_table', run: beat('confession_table') },
];
