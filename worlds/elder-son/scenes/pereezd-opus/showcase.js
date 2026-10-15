// Outside the game: they come to the crossing at dusk and the barrier comes down; the truth said under the roar of
// the freight; then again from the barrier — «Брат», her hand in his, over the tracks together.
const L = scene.lib;
return [
  { name: 'wait', run: async s => { await L.film.wait(s); } },
  { name: 'roar', run: async s => { await L.film.roar(s); } },
  { name: 'brother', run: async s => { await L.film.brother(s); } },
];
