// Outside the game: the prologue — the last train leaves, the two under the lamp; chapter IV — Vasenka on the bench,
// the train, the strap close (pulled, held), back on the bench; chapter V — the last train: the family comes up the
// stairs, he stays; again — his father alone, the snuffbox at the door, he gets on: the frosted window, rubbed, the
// platform going away; the epilogue — dawn, Vasenka leaves by the first train.
const FILM = scene.lib.film(scene), B = scene.kit.beats;
const play = (name, keys) => ({ name, run: async s => { for (const k in keys) s.set(k, keys[k]); } });
return [
  ...B.showcase(scene, FILM, ['gone', 'wave', 'stand', 'bench', 'strap']),
  { name: tr('The strap pulled'), run: async s => {
    await s.move('pull', 0.7, { over: 3, ease: 'inOut' });
    s.set('grip', 0);
    await s.wait(0.8);
    s.set('grip', 1);
    await s.move('pull', 0.2, { over: 2.5 });
    await s.move('door_bg', 1, { over: 1.5 });
  } },
  ...B.showcase(scene, FILM, ['bench_back']),
  play(tr('The whole family comes'), { father_came: 1, nina_came: 1, vasya_came: 1, nina_is: 'knows', late_run: 0 }),
  ...B.showcase(scene, FILM, ['last', 'stays']),
  play(tr('His father alone'), { father_came: 1, nina_came: 0, vasya_came: 0, nina_is: 'none', box_hand: 1, late_run: 1 }),
  ...B.showcase(scene, FILM, ['last', 'boards', 'glass']),
  { name: tr('The glass rubbed'), run: async s => { await s.move('wipe', 0.8, { over: 3, ease: 'out' }); } },
  ...B.showcase(scene, FILM, ['away', 'dawn']),
];
