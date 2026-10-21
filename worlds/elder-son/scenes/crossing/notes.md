# The Crossing

Chapter III of “The Elder Son”: the level crossing beyond the settlement, growing dark. Engine 3, the camera `picture`
(still: the shots are its dolly along the view and aside, `camera_x`, `camera_z`). Modules: `cast` (Nina, Busygin), `beats`,
`trains` (the freight). `scene.json` and `elements/freight.js`, `car1…car15.js` are written by the generator
`tools/crossing/gen.mjs` from `lib.js` (the track, the train): change `lib.js` and run it.

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
  the crossing, 1 — gone to the left. The beats move `freight` at a steady 27 m/s (the start from the headlight — `in`,
  30 % longer).
- **The keeper's booth** on the right (`booth` — an unseen anchor, `booth_front`, `booth_side`, the warm window
  `booth_window` — the only warm light, `booth_lamp`), smoke from its chimney.
- **The signal** `signal`: two red lights blink in turn at `bell` 1 (animate, `e.glow`), their light `red1`, `red2` on
  the snow. **The barrier** `barrier`: the layer `arm` turns by the key `barrier` in animate; its point (the arm's
  middle) — there too.
- The sky: dusk, the night — a layer over it by `night` (the script sets `night` by `hour`), stars. The far forest, the
  spruce wood, the settlement's lights on the left beyond the field, poles along the line, weeds by the road (the wind),
  snow.
- **The people** — Nina and Busygin of the world's cast, the face `simple`, the expression `<id>_mood`. They stand at the
  barrier, clear of its pivot and counterweight (they sweep behind them as the arm rises), turned to the right and a little toward us (`SPOT`, `TURN`): the booth's window and the signal's red on their
  faces, the headlight ahead of them; Nina's face at three quarters, Busygin's turned to her in profile.
- **The shots** (`CAM`): wide (the start: the road, the barrier, the booth, the light on the curve), medium (`camera_z` 1.9:
  both ≈ 0.55 of the frame, the pose of the choice — `nina`, `freight#light`, `barrier` in the middle 4:3), close on Nina
  (`camera_z` 3.15, in `truth` when she turns to him), both (`CAM.both`, the last shot of `brother`). They are the camera's moves over seconds, not cuts. The headlight far on the curve has its own halo light `headlight_far` (the key `light_far`, the script puts it out as the freight comes).

## Beats (`lib.film()`, played by the world's `beats`)

- `wait` (≈ 19 s, from a cut to the wide shot): the dusk darkens (`hour` 0.78 → 0.82); they come along the road from
  beyond the lower left edge; the bell, the lights, the barrier comes down; they stop and turn to the right, the camera
  comes to the medium shot (Nina `thinking`, Busygin `afraid`); out of the spruce wood the headlight comes and stops on the
  curve — `wait:light`; Busygin looks at her, then she turns to him, her face straight to him.
- `truth` (≈ 33 s, after `wait`): he turns to her — `truth:said`; the freight comes up; she turns away to the cars (**her
  back — a named device**); the tail has passed, the lights are out, the barrier has gone up — `truth:passed`; she turns to him
  (the close shot, Nina `sad`); she crosses the tracks first, he after her.
- `roar` (≈ 27 s, after `wait`): the freight comes up; the cars before them — `roar:loud` — he turns to her; she steps to him
  and leans (`lean`; Nina `surprised`, Busygin `sad`), a nod (`look` down and back); the tail has passed, the barrier has gone
  up — `roar:passed`; they cross side by side.
- `brother` (≈ 34 s, after `wait`): he turns to her; she takes his hand — her right to his left (`reach`; their backs to
  us, both to the cars) — `brother:arm`; the freight goes by; the barrier has gone up — `brother:passed`; they turn to us
  hand in hand, the camera on both (Nina `smile`, Busygin `tired`, her left to his right; held 3 s), then cross the tracks.
- A beat after `wait` opened not after `wait` begins with a cut to the end of `wait` (`WAIT_END`).
- The freight's passing alone is ≈ 20 s (480 m at 27 m/s) and the barrier's rise: `truth` and `brother` come out a little
  over 30 s.

## What is not as wanted

- `lean` is a weak motion (a lean with a hand at the head). The brief's “Nina leans to him” is that.

## Contract for the check

```json
{"beats": {"wait": {"after": [], "tells": ["wait:light"], "seconds": 19, "show": false},
 "truth": {"after": ["wait"], "tells": ["truth:said", "truth:passed"], "seconds": 33, "show": false},
 "roar": {"after": ["wait"], "tells": ["roar:loud", "roar:passed"], "seconds": 27, "show": false},
 "brother": {"after": ["wait"], "tells": ["brother:arm", "brother:passed"], "seconds": 34, "show": false}},
 "points": ["nina", "busygin", "freight#light", "barrier"],
 "offers": ["nina", "freight#light", "barrier"],
 "party": {},
 "acts": {}}
```
