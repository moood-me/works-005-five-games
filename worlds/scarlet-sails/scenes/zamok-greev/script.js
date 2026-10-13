// The hall's own mechanics.
const { plan, placed, film, PULL } = scene.lib;

// The hour's light: the world's (`nebo` keeps day, dawn, dusk, night — the weights of the scene's looks — and
// sun_light, moon_light from `hour`; the sun and the moon themselves are the sky's layers).
scene.kit.nebo.follow(scene);

// The ladder stands where `ladder` says (0 its corner by the windows … 1 under the crucifixion); the mother's door —
// hinged at its far edge — turns into her room as `door` goes 0…1. Followed as those keys move.
const put = () => {
  const k = placed(scene.state);
  scene.set('ladder_across', k.ladder_across);
  scene.set('door_facing', k.door_facing);
};
for (const key of ['ladder', 'door']) {
  scene.on('change', key, put);
  scene.on('move', key, put);
}
put();

// While the boy pulls the ladder (`grey_pulls`), it goes with him: `ladder` by where he is (he holds its right rail,
// lib.js PULL).
const pulled = () => {
  if (!scene.get('grey_pulls')) return;
  const [a0, a1] = plan.ladder;
  scene.set('ladder', scene.anim.clamp((scene.get('gr_a') - PULL - a0) / (a1 - a0), 0, 1));
};
scene.on('change', 'gr_a', pulled);
scene.on('move', 'gr_a', pulled);

// The film for the game: `beat` names the beat to play (the world's module beats; the beats — lib.js film, notes.md).
scene.kit.beats.play(scene, film(scene));
