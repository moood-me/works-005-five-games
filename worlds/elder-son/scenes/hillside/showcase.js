// Outside the game: along the road at dusk to the fence; the funeral up on the slope and the march; the mourners and
// the brass go off over the crest, he lays the clarinet in its case and stands at the head of the icy path; she
// steps behind the birch and he goes up to his father. Then, from the head of the path again: they hide by the gate
// and the old man comes down alone and goes off along the road.
const L = scene.lib;
return [
  { name: 'road', run: async s => { await L.film.road(s, null); } },
  { name: 'march', run: async s => { await L.film.march(s); } },
  { name: 'alone', run: async s => { await L.film.alone(s); } },
  { name: 'meet', run: async s => { await L.film.meet(s); } },
  { name: 'hide', run: async s => { s.cut({ ...L.END.alone }); await L.film.hide(s); } },
];
