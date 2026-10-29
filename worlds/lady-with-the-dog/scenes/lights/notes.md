# Lights

The play's map of “The Lady with the Dog” (engine 3) — the game's own scene, as moood's games have it now
(moood-me/moood:docs/games/games.md §2; the model — Cinema Paradiso's “The Strip” in this repository). The docs'
«Огни» (scenes.md: a service scene between chapters that painted the chapter's title and its choices as lamps by the
water, a spitz on the parapet) is not built: the game draws the chapters' trees over this background in its own HTML.

The night sea of Yalta from the quay — a background (a sky element, in the frame's heights: as the view moves it
stands, the chapters' points move). Camera `panorama`, span [0, 35] — 8 places 5 m apart, 10 m from the viewer; the view
goes to a chapter by `camera_x`, which the scene leads itself by `shown` (script.js: at once on opening, over a second
on a change); the player drags it left and right, the wheel and a pinch come nearer.

- `sea` — painted once a season: the sky with the moon high on the left, the far arc of the bay with its quay's lamps
  and the town's windows on the hills, the sea down to the parapet at the frame's foot, the moon's road on it. Its
  shader (elements/sea.wgsl) twinkles the stars, trembles the lamps' reflections, drifts the clouds and lays the glints
  on the water (thickest in the moon's road). The sea between the knots and the frame's middle is calm and even: the
  trees' words over it are to be light (the night).
- `season` (`summer` · `autumn` · `winter` · `thaw`) — of the whole view, set by the game per chapter (optional):
  summer — a warm haze over the shore; autumn — torn clouds going over; winter — snow on the hills and the parapet, snow
  falling; the thaw — wet stone, a mist on the water, a fine drizzle. Repainted once on a change; `snowing`, `drizzle`
  are the script's.
- `shown` — the chapter the player is at (0 the prologue, 1–5 the chapters, 6 the epilogue, 7 the finale); `camera_x`
  — chapter i at i·5 m. `come` — each new value brings the view back to the chapter shown.
- `c0`…`c7` — the chapters' unseen points (across i·5, distance 10, elevation 1.1: at 0.4 of the frame's height, just
  under the far shore — where the game's tree has its knot; the trees hang down over the sea to the frame's middle);
  `author` — the author's sign (across −3.2, at the same height).

## Contract for the check

```json
{
  "beats": {},
  "points": ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "author"],
  "offers": [],
  "party": {},
  "keys": { "shown": 0, "come": 0, "season": "summer" }
}
```
