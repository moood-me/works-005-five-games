# beats — a scene's film in beats: for the game and for showing

For scenes with `"engine": 3` (in the v1 world on the old engine — the module `film`, lines by seconds; the key `beat` and `beat:<name>` are the same). A beat is a
director's sequence (`s`): people walk as long as they walk, keys move, the camera films; time — only where
it really is (a pause). The beats are written once (usually in the scene's `lib.js`) and played two ways:

```js
// the scene's lib.js
const FILM = {
  arrive: { from: () => ({ ...DUSK, fade: 1 }), run: async s => { await s.move('fade', 0, { over: 3 }); … } },
  look: { after: 'arrive', from: () => ({ ...DUSK }), run: async s => { await s.move('camera_z', 0.8, { over: 3 }); } },
  walk_out: { from: () => ({ ...DAY }), run: async s => { await s.person('narrator').walk([[0.3, 70]]); … } },
};
// script.js — for the game
scene.kit.beats.play(scene, scene.lib.FILM);
// showcase.js — showing outside games
return scene.kit.beats.showcase(scene, scene.lib.FILM, ['arrive', 'look', 'walk_out']);
```

- **The key `beat`.** The game sets a beat's name — it plays from the beginning (the beat going on stops). When the beat has ended,
  the scene says `scene.tell('beat:<name>')`; of an unknown name — at once `beat-unknown:<name>`. The same beat once more — first
  `null`. A scene opened (or restored) with a name in `beat` plays that beat from the beginning.
- **`from`** — a function giving the values the beat begins with: all that it does not set itself (the light, the people — where they stand and
  whether they are seen, the camera). A cut (`s.cut`): set at once, shown whole. Not set if the beat comes after one of its
  `after` (that one still going or the last to have ended): then it goes on from what there is.
- **The game's cut is made ready ahead.** When a beat has begun, the module makes ready (`scene.shot`) the beginning of the beat most
  likely to come next: the one the game named in the key `beat_next` (the module's own key; a game that knows its way sets
  it), else the next in the film's table — if it begins with a cut. The cut to it comes at once and whole; to
  another beat or with other values — an ordinary one.
- **Showing** (`showcase`) — the beats in order; the cut to the next is made ready ahead (`scene.shot`) as soon as the
  one before has begun, and shown whole at its moment. A jump along the showing's scale lands on a beat's beginning.
- A beat ends in a living pose: after it the values hold, the people breathe.
