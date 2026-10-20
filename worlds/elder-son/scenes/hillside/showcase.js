// Outside the game: along the road at dusk to the fence; the funeral up on the slope and the march; the mourners and
// the brass go off over the crest, he lays the clarinet in its case and stands at the head of the icy path; she
// steps behind the birch and he goes up to his father. Then the foot of the path: he fell on the ice (snow on his
// coat), takes the case and goes to the club; and from the head of the path again the other way — they hide by the gate,
// the old man comes down alone, and the two follow him along the road to the club, where he all but sees them.
const FILM = scene.lib.film(scene);
return [
  { name: tr('he fell on the ice, he almost saw them'), run: async s => { s.set('snowy', 1); s.set('seen', 1); } },
  ...scene.kit.beats.showcase(scene, FILM, ['road', 'march', 'alone', 'meet', 'bottom', 'hide', 'club']),
];
