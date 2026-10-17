// Outside the game: the summer night (the rain, the car), the night she found him, the dusk on the bench (her letter
// in his hands), and 1988 on the head of the mole — the path through «ask».
const FILM = scene.lib.film(scene);
return [
  { name: 'письмо в руках', run: async s => { s.set('letter_in_hand', 1); } },
  ...scene.kit.beats.showcase(scene, FILM, ['summer', 'covered', 'headlights', 'found', 'alone', 'back', 'rise_go', 'car', 'meet', 'ask', 'parting']),
];
