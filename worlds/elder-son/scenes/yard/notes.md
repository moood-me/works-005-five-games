# The Yard

The game's own scene (The Elder Son; the play's map): a night station, the background the game draws its map over.
The game's trees — the chapters as the cars of one train on the near track, their windows the choices — are its own
HTML (`bespoke/map.js`, in `bespoke.underlay`), laid at this scene's chapter points. Engine 3, camera `panorama`, span
[0, 35] — 8 places (seven chapters and the finale) 5 m apart, 10 m from the viewer; the view goes to a chapter by
`camera_x`, which the scene leads itself by `shown` (script.js: at once on opening, over a second on a change); the
player drags it, the wheel and a pinch come nearer. The background is a sky (frame heights): it stands as the view
moves, the points move over it. Made after “The Strip” of Cinema Paradiso.

- `shown` — the chapter the player is at; `camera_x` — chapter i at i·5 m. `come` — each new value brings the view
  back to the chapter shown (the game sets it when that chapter is pressed again after the player dragged away).
- `yard` — painted once: low overcast lit from below; the yard's far tracks toward the horizon, lamps on their masts,
  a far train standing with its lit windows (the world's `trains.far_train`); the near track across the whole frame —
  its far rail at 0.615, the near one at 0.632 of the frame's height (the game's cars, 0.2…0.62, stand on it, their
  wheels to ≈ 0.63); snow before it. `snowfall` — light snow.
- `c0`…`c7` — the chapters' unseen points (`c7` the finale's; across i·5, at 0.3 of the frame's height — where the
  game's car has its roof lamp, its knot); `author` — the author's sign (across −3.2, at 0.3).

## Contract for the check

```json
{"beats": {},
 "points": ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "author"],
 "offers": [],
 "party": {},
 "keys": {"shown": 0, "come": 0}}
```
