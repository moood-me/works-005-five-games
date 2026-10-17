// «Saville Row»'s own little film, outside games: the street at dusk, the lamps lit as the night comes down; 2 October —
// Fogg home, Passepartout's «Round… the world?», the two out with the bag into the fog; the last evening — Fix under the
// lamp, the runner out and back; down the street to the club; the Monday morning's coda. Every beat of lib.js film in
// its order (SHOWCASE), each cut made ready ahead; the lines the game says are said here (Passepartout's voice: a young French manservant,
// quick and bright — written whole in each line, so that its voice is made before it is heard).
const L = scene.lib, F = L.film(scene);
const film = {
  ...F,
  news: { ...F.news, run: async s => { await F.news.run(s); await s.person('passepartout').say('Round… the world?', { voice: 'Puck', who: 'Passepartout, a young French manservant', how: 'startled, a little incredulous' }); } },
  pp_returns: { ...F.pp_returns, run: async s => { await F.pp_returns.run(s); await s.person('passepartout').say('By London time — to the minute.', { voice: 'Puck', who: 'Passepartout, a young French manservant', how: 'brightly, with quiet pride' }); } },
};
return scene.kit.beats.showcase(scene, film, L.SHOWCASE);
