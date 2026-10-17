# poezd

Trains painted from the side in daylight colours (the scene's light makes the night). Metres; the anchor — on the
rail's head under the middle, y down; +x — toward the train's tail. A car's box: `[-len/2 - 0.4, -4.9, len/2 + 0.4, 0.2]`.

- `car(g, e, kind, len)` — a freight car: `tank` (a tank car), `box` (a boxcar), `gondola` (an open car under snow),
  `flat` (a flatcar with logs); `len` — buffer to buffer.
- `loco(g, e, len)` — a diesel locomotive's side; the headlight at the nose (−x) — the point `#light` (`e.at`) and the
  glow `e.light(..., 'light')`.
- `nose(g, e)` — the locomotive's front (a card turned forward, `on` the locomotive, `facing` 270), its lamp unlit — the
  light is `loco`'s.

The scene itself sets the cars along the track (each a card with its `place` by the keys, “The Crossing (opus)”:
`lib.js`, `places`). The electric train (`elektrichka`, `train_window`) and the far train (`dalny`) of scenes.md are not
here yet.
