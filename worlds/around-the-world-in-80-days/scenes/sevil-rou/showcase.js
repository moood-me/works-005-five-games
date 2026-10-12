// «Сэвил-Роу»'s own little film, outside games: the street at dusk, the lamps lit as the night comes down; 2 October —
// Fogg home, Passepartout's «Around… the world?», the two out with the bag into the fog; the last evening — Fix under the
// lamp, the runner out and back; down the street to the club; the Monday morning's coda. Every beat of lib.js film in
// its order (SHOWCASE), each cut made ready ahead; the lines the game says are said here.
const L = scene.lib, F = L.film(scene);
const film = {
  ...F,
  news: { ...F.news, run: async s => { await F.news.run(s); await s.person('passepartout').say('Вокруг… света?'); } },
  pp_returns: { ...F.pp_returns, run: async s => { await F.pp_returns.run(s); await s.person('passepartout').say('По Лондону — минута в минуту.'); } },
};
return scene.kit.beats.showcase(scene, film, L.SHOWCASE);
