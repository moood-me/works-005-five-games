THE STRIP (Cinema Paradiso; the play's map), engine 3. The game's own scene: the dark of the booth, the projector's
lamp.

The play's map — a background: the chapters' trees (number, title, knot, forks, threads) the game draws over it, in its
own HTML (its `map.js`), at this scene's chapter points. Camera panorama, span [0, 30] — 7 places (one a chapter) 5 m
apart, 10 m from the viewer; the view goes to a chapter by the key camera_x, which the scene leads itself by shown
(script.js: at once on opening, over a second on a change); the player drags the view left and right, the wheel and a
pinch come nearer (the points nearer — their depth less). The background is a sky (in the frame's heights): as the
view moves it stands, the chapters' points move.

- `shown` — the chapter the player is at; `camera_x` — where the view is: chapter i — i·5 m.
- `dark` — the dark of the booth, the warm air by the lamp, painted once; `lamp` — the projector's lamp low on the right
  (`lib.js` lampAt), the lens's light breathes (lamp.animate.js).
- `c0`…`c6` — the chapters' unseen points (unseen; across i·5, at 0.2 of the frame's height — where the game's tree
  has its knot); `author` — the unseen point of the author's sign (across −3.2, left of the first chapter, at 0.3 of the
  frame's height).

## Contract for the check

```json
{
  "beats": {},
  "points": ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "author"],
  "offers": [],
  "party": {},
  "keys": { "shown": 0 }
}
```
