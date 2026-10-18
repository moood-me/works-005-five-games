THE STRIP (Cinema Paradiso; the play's map), engine 3. The game's own scene: the dark of the booth, the projector's
lamp.

The play's map — a background: the chapters' trees (number, title, knot, forks, threads) the game draws over it, in
its own HTML (its `map.js`), at this scene's chapter points. Camera panorama, span [0, 35] — 8 places (one a chapter,
the last the finale) 5 m apart, 10 m from the viewer; the view goes to a chapter by the key camera_x, which the scene
leads itself by shown (script.js: at once on opening, over a second on a change); the player drags the view left and
right, the wheel and a pinch come nearer (the points nearer — their depth less). The background is a sky (in the
frame's heights): as the view moves it stands, the chapters' points move.

- `shown` — the chapter the player is at; `camera_x` — where the view is: chapter i — i·5 m.
- `come` — each new value brings the view back to the chapter shown (the game sets it when that chapter is
  pressed again after the player dragged away).
- `dark` — the booth, painted once: its plastered wall in the warm dark (lighter toward the lamp), the panelling's
  boards low down, a big reel low on the left, the strip's band across the middle
  a little warmer. `lamp` — the projector low on the right (`lib.js` lampAt): its beam thrown up to the left across the
  whole booth, through the strip's band, dust hanging in it; the lamp house, the lens glowing. The beam and the glow
  breathe — their layers' alpha only (lamp.animate.js).
- `c0`…`c7` — the chapters' unseen points and the finale's (`c7`, after the epilogue; unseen; across i·5, at 0.29 of
  the frame's height — where the game's tree has its knot: the strip of frames runs across the middle, in the beam);
  `author` — the unseen point of the author's sign (across −3.2, left of the first chapter, at 0.33 of the frame's
  height).

## Contract for the check

```json
{
  "beats": {},
  "points": ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "author"],
  "offers": [],
  "party": {},
  "keys": { "shown": 0, "come": 0 }
}
```
