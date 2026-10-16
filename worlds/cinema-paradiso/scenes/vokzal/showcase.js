// Outside the game: the dawn of 1959 — the farewell, boarding, the train going (Alfredo stays); again with the look
// back from the train (he goes off); and the evening of 1988 — Salvatore on the same platform, the frame in his wallet.
const FILM = scene.lib.film(scene), B = scene.kit.beats;
const stays = v => ({ name: v ? tr('Alfredo stays') : tr('Alfredo goes'), run: async s => { s.set('alfredo_stays', v); } });
return [stays(1), ...B.showcase(scene, FILM, ['platform', 'boarding', 'away']), stays(0),
  ...B.showcase(scene, FILM, ['platform', 'boarding', 'back_look', 'arrival', 'wallet'])];
