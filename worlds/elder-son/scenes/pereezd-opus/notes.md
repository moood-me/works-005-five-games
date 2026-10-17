# The Crossing (opus)

Chapter III of “The Elder Son”: the level crossing beyond the settlement, growing dark. Engine 3, the camera `picture`
(still — no cuts, `beat_next` is taken and changes nothing). Modules: `cast` (Nina, Busygin), `poezd` (the freight).
`scene.json` and `elements/freight.js`, `car1…car15.js` are written by the generator `tools/pereezd-opus/gen.mjs` from
`lib.js` (the track, the train): change `lib.js` and run it.

## How it is made

- **The track** (`lib.js`, `CONTROL`): a Catmull-Rom from the spruce wood on the right (≈ 400 m) in a curve to the
  crossing and slantwise before the people from right to left, past the left edge. `at(s)` — the point and the
  direction `s` metres from the wood. The ground (`ground`, a plane 1900 × 1440 m) paints the embankment along it, the
  sleepers (the near 120 m up to the crossing and beyond), the rails and the crossing's planking; the road — along
  `ROAD`.
- **The freight**: the locomotive `freight` (its side; the headlight — the point `freight#light`, the glow and the light
  `headlight`) with its front `freight_nose` (`on: freight`) and 15 cars `car1…car15` (tank cars, boxcars, open cars
  under snow, a flatcar with logs). Each is a card along the track, its place and turn — the keys `<id>_a/_d/_f`; the
  script sets them by `freight` (`places(f)`), every frame while `freight` moves. `freight` → the nose: 0 — in the wood,
  0.04 — the headlight on the curve at 200 m (x ≈ 0.72 of the frame), 0.1 — the nose on the crossing, 0.9 — the tail on
  the crossing, 1 — gone to the left. The beats move `freight` at a steady 23 m/s (the start from the headlight — `in`,
  30 % longer).
- **The keeper's booth** on the right (`booth` — an unseen anchor, `booth_front`, `booth_side`, the warm window
  `booth_window` — the only warm light, `booth_lamp`), smoke from its chimney.
- **The signal** `signal`: two red lights blink in turn at `bell` 1 (animate, `e.glow`), their light `red1`, `red2` on
  the snow. **The barrier** `barrier`: the layer `arm` turns by the key `barrier` in animate; its point (the arm's
  middle) — there too.
- The sky: dusk, the night — a layer over it by `night` (the script sets `night` by `hour`), stars. The far forest, the
  spruce wood, the settlement's lights on the left beyond the field, poles along the line, weeds by the road (the wind),
  snow.
- The people — figures in the style `zima` (from `shadow`, `rim`, no faces): Busygin — tall, a long grey coat, a light
  scarf, no hat; Nina — a coat with a fur collar, a plait. They stand by the barrier at ≈ 5 m, seen from behind: ≈ 0.36
  of the frame's height.

## Beats (`lib.js`, `film`; the script plays them by the key `beat`, the showcase — `showcase.js`)

- `wait` (≈ 22 s, from a cut): the dusk darkens (`hour` 0.78 → 0.82); they come along the road from beyond the lower
  left edge; the bell, the lights, the barrier comes down; they stop; out of the spruce wood comes the headlight and
  stops on the curve — `wait:light`; Nina looks at the headlight, Busygin then at her. The pose for the choice: `nina`,
  `freight#light`, `barrier` in the middle 4:3.
- `truth` (≈ 30 s, after `wait`): he turns to her — `truth:said`; the freight comes up; when the cars are before them
  she turns away to them; the tail has passed, the lights are out, the barrier has gone up — `truth:passed`; she turns
  to him; she crosses the tracks first, he after her.
- `roar` (≈ 30 s, after `wait`): the freight comes up; the cars before them — `roar:loud` — he turns to her; she steps
  to him (no lean: there is no motion `lean` — a step and a turn of the head), a nod (`look` down and back); the tail
  has passed, the barrier has gone up — `roar:passed`; they cross side by side.
- `brother` (≈ 32 s, after `wait`): he turns to her; she takes his hand — her right to his left (`reach`; she stands on
  his left, so not `hand_r` as in scenes.md) — `brother:arm`; the freight goes by; the barrier has gone up —
  `brother:passed`; they cross hand in hand.
- A beat after `wait` opened not after `wait` begins with a cut to the end of `wait` (`WAIT_END`).

## What is wrong / open

- No lean of Nina's (`lean`) — no such motion; three motions from the model were not made.
- The module `beats` of “Around the World v3” is not taken: the film is `lib.js`'s functions, the script plays a beat by
  `beat`. No cuts — one camera.

## Contract for the check

```json
{"beats": {"wait": {"after": [], "tells": ["wait:light"], "seconds": 22, "show": false},
 "truth": {"after": ["wait"], "tells": ["truth:said", "truth:passed"], "seconds": 30, "show": false},
 "roar": {"after": ["wait"], "tells": ["roar:loud", "roar:passed"], "seconds": 30, "show": false},
 "brother": {"after": ["wait"], "tells": ["brother:arm", "brother:passed"], "seconds": 32, "show": false}},
 "points": ["nina", "busygin", "freight#light", "barrier"],
 "offers": ["nina", "freight#light", "barrier"],
 "party": {},
 "acts": {}}
```
