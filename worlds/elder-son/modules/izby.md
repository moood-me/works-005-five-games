# izby

The settlement of “The Elder Son” — in daylight colours (the scene's light makes the evening and the night), metres,
y down, the anchor at the ground:

- `wall(g, e, {w, h, plinth, color, windows: [{x, w, h, sill}], door: {x, w, h}})` — a house's long log wall onto
  the street; the windows and the door cut right through (behind them the glass `pane`, a room, a passage seen), carved
  window frames.
- `gable(g, e, {d, h, plinth, rise, color})` — an end wall with its gable; `roof(g, e, {w, d, chimney})` — the roof's
  slope from above (a plane) under snow.
- `pane(g, e, {w, h, dark})` — the glass behind an opening: the layers `lit` (the light, curtains), `figure` (a
  silhouette), `bars`, the glow `pane` (e.light); the scene shows them by its animate, by its own keys. `dark: true` — a
  window that is not lit.
- `fence(g, e, len, h, {gaps})` — a picket fence from x 0 to len; `shed`, `barrel`, `bench`, `woodpile(g, e, w)`,
  `lamp(g, e, h)` (the light `lamp`), `birch(g, e, h, {lean, thick})`, `cross(g, e, h)`, `rail(g, e, w)`, `drift`.

Used by: “The Street (opus)”, “The Hillside (opus)”.
