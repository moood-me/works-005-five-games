// Outside the game: the night in her room — the bowed head, her face at the candle, the watermelon cut in the
// close-up; he brings her the slice and his hand comes to hers; she turns to the candle and speaks. Then the other way:
// he eats at the table, turns to her on his chair, and she speaks. (What the game moves — the knife, the hands — is
// moved here by hand.)
const F = scene.lib.film(scene);
const beats = scene.kit.beats.showcase(scene, F, ['room', 'room_hold', 'melon', 'melon_hold', 'beside', 'beside_hold',
  'confession_bed', 'melon_hold', 'melon_eat', 'confession_table']);
const after = {
  melon: async s => {
    await s.move('cut', 1, { over: 3.5, ease: 'inOut' });
    s.set('slice', 1);
    await s.wait(1.2);
  },
  beside: async s => {
    await s.move('hand_at', 1, { over: 3.5, ease: 'inOut' });
    await s.wait(0.6);
    s.set('palm', 1);
    await s.wait(1.4);
  },
};
return beats.map(b => after[b.name] ? { name: b.name, run: async s => { await b.run(s); await after[b.name](s); } } : b);
