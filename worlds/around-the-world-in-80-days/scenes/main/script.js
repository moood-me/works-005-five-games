// The club's clock goes: `second` runs on smoothly, a second each second; at sixty it starts again and the minute turns.
// Whatever sets the time (the game, a beat) sets these two; the clock goes on from there. (Only the clock's animate reads
// them: its hands and pendulum are layers — nothing is painted again.)
scene.every(1, () => {
  let s = Math.round(scene.get('second') ?? 0);
  if (s >= 60) {
    scene.set('second', 0);
    scene.set('minute', ((scene.get('minute') ?? 0) + 1) % 1440);
    s = 0;
  }
  scene.set('second', s + 1, 1, 'linear');
});
// The door's leaves turn as `door` goes 0…1: from shut (facing the room, 180°) to open 100° into it — the left leaf's
// free edge comes toward the room one way, the right one's the other. Following `door` as it moves, or at once when it is
// set so.
const leaves = v => {
  scene.set('leaf_l', 180 + 100 * v);
  scene.set('leaf_r', 180 - 100 * v);
};
scene.on('change', 'door', v => scene.get('door') === v && leaves(v));
scene.on('move', 'door', leaves);
leaves(scene.get('door') ?? 0);

// The game's keys, turned into who is here: `gentlemen` — how many of the five (Stuart first), `fogg_present`,
// `fogg_seated` (Fogg at the whist table in his place, his paper open — a cut: he is there).
const { MEN, FAR_SEAT, loop } = scene.lib;
scene.on('change', 'gentlemen', v => MEN.forEach((id, i) => scene.set(`${id}_here`, i < v)));
scene.on('change', 'fogg_present', v => scene.set('fogg_here', !!v));
scene.on('change', 'fogg_seated', v => {
  if (!v) return;
  scene.cut({ fogg_a: FAR_SEAT[0], fogg_d: FAR_SEAT[1], fogg_turn: 180, fogg_do: loop('paper_seated'), fogg_with: ['newspaper'],
    fogg_wear: null, fogg_look: null, fogg_here: true });
});

// The film for the game: `beat` names the beat to play (the world's module beats; lib.js film, notes.md lists them).
scene.kit.beats.play(scene, scene.lib.film(scene));
