# nebo — the sky of Giancaldo

One sky for every scene of the world (the coordinator's decision of 2026-10-15: the sky of the pier's opus version raised
into a module of the world in place of the sky of Scarlet Sails v3 — that one has no cool lilac 1988 beside the warm
night of the past). Painted once a tone, the stars a layer; the world's shader makes them twinkle.

```js
// the scene's lib.js
const SKY = { horizon: 0.55, round: true, moon: 7, coast: [[28, 112, 0.045, 3], [48, 140, 0.026, 7]], villages: [40, 100, 9], glow: -50 };
// elements/sky.js
e.kit.nebo.sky(g, e, e.lib.SKY);
```
`node tools/nebo-sky.js <the scene's folder>` — writes `elements/sky.wgsl` (from `tools/nebo-sky.wgsl`). The shader is
edited in `tools/` only.

**The tone** — from the scene's `hour` and `era` (`nebo.tone(hour, era)`): the past — `night` (hour ≥ 0.84 or < 0.22:
the warm Sicilian night, stars, the moon over the sea), `dusk` (0.6…0.84: the afterglow in the north-west), `dawn`
(0.22…0.6: pale gold in the east); the present (`era` `now`) — `evening` (1988's cool lilac evening), `morning` (a grey
steel morning, no stars). The sky is painted anew only when its tone changes.

`SKY`: `horizon` — the eye's line (as the scene's `"horizon"`); `round` — the sky all round (`roam`, `around`: straight
ahead — `e.aspect/2`), `false` — the scene's own sky; `moon` — the moon's azimuth in degrees from "straight ahead"
(`null` — none); `coast` — far shores `[from°, to°, height, seed]`; `villages` — `[from°, to°, n]` lights on the shore at
night; `glow` — the afterglow's azimuth at dusk (dawn — opposite).

Points: `sky#disc` (the moon; the scene's light `{"id": "moon", "from": "sky#disc"}`). `nebo.pane(g, x0, y0, x1, y1,
hour, era, anim)` — the same sky as a flat picture in a room's window (the booth's port, the carriage window).
`nebo.tone`, `nebo.PAL` — for the glow and the scene's `looks`.

The hour's light — the scene's own `light.looks` (each its own: night, dusk, `now`).
