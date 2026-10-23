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
  the snow. **The barrier** `barrier`: the layer `arm` turns by the key `barrier` in animate; its point — there too, on the
  arm's red tip (past the people standing at the arm: the choice “Brother” is on the barrier, not between them).
- The sky: dusk, the night — a layer over it by `night` (the script sets `night` by `hour`), stars. The far forest, the
  spruce wood, the settlement's lights on the left beyond the field, poles along the line, weeds by the road (the wind),
  snow.
- **The people** — Nina and Busygin of the world's cast, the face `simple`, the expression `<id>_mood`. They stand at the
  barrier, clear of its pivot and counterweight (they sweep behind them as the arm rises), turned to the right and a little toward us (`SPOT`, `TURN`): the booth's window and the signal's red on their
  faces, the headlight ahead of them. At the end of `wait` (the choice) they turn face to face (`FACE`): Nina's face in
  three quarters, Busygin's in profile — both faces seen.
- **The shots** (`CAM`): wide (the start: the road, the barrier, the booth, the light on the curve), medium (`camera_z` 1.9:
  both ≈ 0.55 of the frame, the pose of the choice — `nina`, `freight#light`, `barrier` in the middle 4:3), close on Nina
  (`camera_z` 3.15, in `truth` when she turns to him), both (`CAM.both`, the last shot of `brother`). They are the camera's moves over seconds, not cuts. The headlight far on the curve has its own halo light `headlight_far` (the key `light_far`, the script puts it out as the freight comes).

## Beats (`lib.film()`, played by the world's `beats`)

- `wait` (≈ 11 s, from a cut to the wide shot): the dusk darkens (`hour` 0.78 → 0.82); they come up the road from the
  lower left; the bell, the lights, the barrier comes down; meanwhile the headlight comes out of the spruce wood and stops
  on the curve (6 s); they stop and turn to the right, the camera comes to the medium shot (Nina `thinking`, Busygin
  `afraid`) — `wait:light` at ≈ 6.5 s; Busygin looks at her, she looks at him, they turn face to face.
- `truth` (≈ 24 s, after `wait`): he turns to her — `truth:said`; the freight comes up; she turns away to the cars (**her
  back — a named device**); 3 s into the cars a cut (made ready, `trainAt`) to the close shot of her back, the freight near
  its tail (the most of it left out); the tail has passed, the lights go out, the barrier rises — `truth:passed` (≈ 14 s);
  she turns to him (Nina `sad`); she crosses the tracks first, he after her.
- `roar` (≈ 26 s, after `wait`): the freight comes up; the cars before them — `roar:loud` (≈ 9 s) — he turns to her; she
  steps to him and leans (`lean`; Nina `surprised`, Busygin `sad`), a nod (`look` down and back); the tail has passed, the
  barrier rises — `roar:passed`; they cross side by side.
- `brother` (≈ 23 s, after `wait`): the freight sets off from the curve at once; he turns to her; she takes his hand — her
  right to his left (`reach`; their backs to us, both to the cars) — `brother:arm`; the freight comes and goes by (3 s into
  the cars a cut, made ready, to the two-shot `CAM.both`, the freight near its tail); the lights go out, the barrier rises —
  `brother:passed` (≈ 13 s); they turn to us hand in hand (Nina `smile`, Busygin `tired`, her left to his right; held 3 s),
  then cross the tracks.
- A beat after `wait` opened not after `wait` begins with a cut to the end of `wait` (`WAIT_END`).
- The freight comes from the curve at its steady 27 m/s (≈ 7.4 s to the crossing); its cars take ≈ 8 s to pass whole —
  `roar` lets them (its lines are said over them), `truth` and `brother` leave the most of them out by a cut. No beat has
  more than ≈ 10 s of silent action before a moment the game waits for. Seconds by `node tools/beatscheck.mjs crossing`
  (a node run of every beat on a virtual clock).

## What is not as wanted

- `lean` is a weak motion (a lean with a hand at the head). The brief's “Nina leans to him” is that.

## Contract for the check

```json
{"beats": {"wait": {"after": [], "tells": ["wait:light"], "seconds": 11, "show": false},
 "truth": {"after": ["wait"], "tells": ["truth:said", "truth:passed"], "seconds": 24, "show": false},
 "roar": {"after": ["wait"], "tells": ["roar:loud", "roar:passed"], "seconds": 26, "show": false},
 "brother": {"after": ["wait"], "tells": ["brother:arm", "brother:passed"], "seconds": 23, "show": false}},
 "points": ["nina", "busygin", "freight#light", "barrier", "nina#chest"],
 "offers": ["nina#chest", "freight#light", "barrier"],
 "party": {},
 "acts": {}}
```
