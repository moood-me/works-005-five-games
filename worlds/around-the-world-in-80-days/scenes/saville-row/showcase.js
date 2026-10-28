// «Saville Row»'s own little film, outside games: the street at dusk, the lamps lit as the night comes down; 2 October —
// Fogg home, Passepartout's «Round… the world?», the ten minutes' packing, the two out with the bag into the fog; the last
// evening — the proposal on the steps, the runner out and back, Fix under the lamp, the cab racing to the club; the
// endings — the lamp lit on the steps, the attic's gas out, the Sunday's laugh; the Monday morning's coda. Every beat of lib.js film in
// its order (SHOWCASE), each cut made ready ahead; the lines the game says are said here (Passepartout's voice: a young French manservant,
// quick and bright — written whole in each line, so that its voice is made before it is heard).
const L = scene.lib, F = L.film(scene);
const film = {
  ...F,
  news: { ...F.news, run: async s => { await F.news.run(s); await s.person('passepartout').say('Round… the world?', { voice: 'Puck', how: 'a young French manservant — startled, a little incredulous' }); } },
  // (what the game's minigames do, done here by themselves: Passepartout packing — from room to room, the things thrown
  // into the bag; the cab urged on to the club)
  pack: { ...F.pack, run: async s => {
    await F.pack.run(s);
    const throws = [['dressing', 'shirt'], ['dressing', 'shirt'], ['bedroom', 'stockings'], ['bedroom', 'stockings'], ['bedroom', 'stockings'], ['study', 'bradshaw'], ['hall', 'coat']];
    let packed = 0;
    for (const [room, what] of throws) {
      if (s.get('pp_in') !== room) { s.set('pp_in', 'none'); await s.wait(0.6); s.set('pp_in', room); await s.wait(0.6); }
      s.set('fly_what', what);
      s.set('fly', 1);
      s.set('bag', 0.15 + (0.8 * ++packed) / throws.length);
      await s.wait(0.5);
      s.set('fly', 0);
      await s.wait(0.2);
    }
    s.set('pp_in', 'attic');
    await s.wait(1.6);
    s.set('pp_in', 'none');
    await s.wait(1);
  } },
  cab: { ...F.cab, run: async s => {
    const urged = s.sequence(async q => { for (let i = 1; i <= 40; i++) { q.set('cab_pace', 0.8); q.set('cab_to', i / 40); await q.wait(0.45); } });
    await s.all(urged, F.cab.run(s));
  } },
  pp_returns: { ...F.pp_returns, run: async s => { await F.pp_returns.run(s); await s.person('passepartout').say('By London time — to the minute.', { voice: 'Puck', how: 'a young French manservant — brightly, with quiet pride' }); } },
};
return scene.kit.beats.showcase(scene, film, L.SHOWCASE);
