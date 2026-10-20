# The Platform

The world's main scene: a suburban platform at night, the first snow; the prologue, chapter IV (the rucksack), V (the
last train), the epilogue's dawn. Engine 3, camera `roam` (not `panorama`: the shots turn far aside — back along the
platform, down to the settlement, out of the car's window — and a roaming camera's sky goes all round). Modules: `cast`,
`beats`, `closeups` (the insert `strap`), `trains` (the electric train, the carriage window), `houses` (the lamps, the
fences, the birches). `scene.json` is written by `tools/platform/gen.mjs` from `lib.js` (change `lib.js` or the
generator and run it); the paintings are `elements/*.js`; `node tools/platform/check.mjs [beat … | plays | all]` runs
the beats in node and prints where the people and the points stand in the frame.

## The place (`lib.js` `G`; metres: across — along the platform, right +; distance — away from the start)

- The platform's concrete: across −45…15.5, distance 3.5…10.26, its top 0.05 over the ground (0). Its edge over the
  tracks (`edge`) at 10.26; the bed 1.25 m lower (`relief.js` → `G.ground`), two tracks (11.5, 15.6), catenary masts
  every 60 m and the overhead line; the field and the wood beyond.
- The lamp (`lamp_post`, its light `lamp`, reach 12) at (−0.3, 5.5); the bench (`bench`, its seat `bench_seat` at 0.5,
  facing the near side) at (−1.5, 8.0); the dark ticket booth (`booth`) at (−8.5, 4.4).
- The stairs: the platform's own end is their top (13.5…15.5 × 5.5…8); the flight (`stairs`, a slope, and its two
  sides `stairs_side`) goes down to the right to across 20, 3.2 m lower; the lamp over it (`stair_lamp`, `lamp2`,
  reach 8). Who comes, comes up it from below.
- Before the platform and beyond the stairs the land falls to the settlement, 8 m lower at distance −20: houses
  (`village`, copies, a few windows lit), gardens' fences, birches, the trodden path; the Sarafanovs' window
  (`far_window`, “The Sarafanovs' window”, glows, brighter by `warm`) at (60, −20.05) — seen in the shot “B” of `last`
  and from the car in `away`.
- The electric train (`trains`): `train` — its place (unseen, by `train_x`; the script: `G.trainX(train)`: −1 → 100 m
  left, 0 — standing, its anchor at −8, the second car's front doorway at 10, its rear one at −6; 1 → 250 m right),
  facing the platform, its rail head at −1.1; it marks the points `train#tail`, `train#door`, `train#back_door`,
  `train#head`. On it: `car0`…`car3` — the cars' sides (each a card of its own: one 80 m painting was not drawn whole
  close up), `in0`…`in3` — what their windows show (glow, 1.3 m behind the side; Silva's painted figure in `in1` by
  `silva_window`), `floor` (unseen) — the cars' floor, Silva stands on `floor#vest`, carried; inside the second car
  `train_window` (its wall round the window by the front vestibule; the frost a layer, rubbed off by `wipe` in
  `train_window.wgsl`) and `partition` (the saloon's end wall) — these two painted only while the camera rides the
  train (from the platform they showed through the side). The doors slide by `doors`; frost on the train's glass at
  dawn by the play's `frost`.
- The camera in the car: `camera_on: 'train'`, its place in the train's frame (`EYE`: 0.75 m in from the side, a
  little behind the window, looking back at the platform slantwise through it, yaw 122): whoever came stands on the
  stairs' top in the glass, left of its middle.
- Light: the snowy night (the sky — `sky`, all round), its looks by `hour` (the script sets `dusk_k`, `late_k`,
  `dawn_k`): dusk 0.84, night 0.9, late night 0.93, dawn 0.25. The lamps, the train's windows (a light each, reach 5),
  its head lamp, the far window.

## Beats (`lib.js` `film`, the world's `beats`)

| beat | after | ≈ s | what |
| --- | --- | --- | --- |
| gone | — | 12 | from the dark; the two run up the stairs (`gone:run`), the camera turns with them from the stairs to under the lamp; the train moves off at 0.3 m/s and crawls on; they stop (`gone:stop`). Choice pose: `train#tail` x ≈ −0.36 |
| wave | gone | 12 | he steps to the edge and waves; the train gathers way; its tail out of the frame — `wave:dark` |
| stand | wave | 12 | the camera comes to a medium shot in three quarters under the lamp: Silva's hand to his nape, smiling; Busygin hugging himself (`cold`), tired — `stand:cold` |
| bench | — | 22 | late dusk; Vasenka on the bench, the rucksack on his knees, angry; Busygin up the stairs, along, sits by him — `bench:sit`; both in three quarters under the lamp |
| strap | bench | 15 | the train comes up and opens (`strap:open`); they get up, he reaches for the rucksack; the insert `strap` opens |
| bench_back | strap | 17 | the insert shut, the doors shut, the train goes; they sit again (`torn` 1: the part with the knot) — `bench_back:sat`; after L71 they get up and go to the stairs |
| last | — | 22 (16 with `late_run` 1) | night; he runs up and stands by the second car's front doorway; the train comes up and opens (`late_run` 0) or stands open — `last:open`; Silva in the vestibule (`silva_door`) turns to him; who came comes up the stairs — the father (`father_came`), Nina (`nina_came`: ahead of him when `nina_is` knows, first when he did not come), Vasenka (`vasya_came`: without his rucksack when `vasya_end` home, first when no one else came) — `last:came` with the cut to the first one's face (a medium shot, three quarters) and back; he turns to them. No one: the camera goes along the platform (shot “B”) to the window far below — `last:came`. Choice pose: `train#door` x −0.35, the first who came x ≈ 0.4 (or `far_window`) |
| stays | last | 21 | the doors shut (Silva's figure in its window: `silva_window`), the train goes — `stays:gone`; they come to meet him; no one — he goes to the stairs' top, looking at the window far below |
| boards | last | 13 (5 without the snuffbox) | `box_hand` 1 and the father came: the father at the door gives him the snuffbox (`give` / `take`, part `box_held`) — `boards:box`; he goes in, the doors shut — `boards:in` |
| glass | — | 3 | the camera in the car at the frosted window (`wipe` 0): the lamp over the stairs and who came through it — `glass:ready` |
| away | glass | 16 | the train moves off; the platform goes away to the right of the frame; the father waves (`away:wave`); the window far below in the middle of the frame (`away:window`) |
| dawn | — | 24 (17 with `vasya_end` home) | grey dawn, snow on the bench; taiga — Vasenka on the bench, the first train comes (`dawn:pass`), opens (`dawn:open`), he gets on at the door before the bench, it shuts (`dawn:shut`) and goes; home — the platform empty, the train goes by (`dawn:pass`) |

## What is not as scenes.md says

- The camera `roam`, not `panorama` (above). The shots are numbers (camera_x, camera_z, camera_yaw), the face shot in
  `last` too (1.5 m from the one who calls, three quarters), not `camera_target`: what is in the frame is known here.
- `came` is gone: the game carries `father_came`, `nina_came`, `vasya_came` (game.md after the honest line's finale).
- `strap` tells `strap:open` only (no `strap:close`: nothing waits for it).
- The car's window is the last one before the second car's front vestibule (the doorway itself has the vestibule).
- Busygin on the bench sits with `seated`, Vasenka with `seated_bag`; in `bench_back` with `torn` the knot is the part
  `rucksack_lap_torn` — no motion of tying it.

## Contract for the check

```json
{"beats": {
  "gone": {"after": [], "tells": ["gone:run", "gone:stop"], "seconds": 12, "show": false},
  "wave": {"after": ["gone"], "tells": ["wave:dark"], "seconds": 12, "show": false},
  "stand": {"after": ["wave"], "tells": ["stand:cold"], "seconds": 12, "show": false},
  "bench": {"after": [], "tells": ["bench:sit"], "seconds": 22, "show": false},
  "strap": {"after": ["bench"], "tells": ["strap:open"], "seconds": 15, "show": false},
  "bench_back": {"after": ["strap"], "tells": ["bench_back:sat"], "seconds": 17, "show": false},
  "last": {"after": [], "tells": ["last:open", "last:came"], "seconds": 22, "show": false},
  "stays": {"after": ["last"], "tells": ["stays:gone"], "seconds": 21, "show": false},
  "boards": {"after": ["last"], "tells": ["boards:box", "boards:in"], "seconds": 13, "show": false},
  "glass": {"after": [], "tells": ["glass:ready"], "seconds": 3, "show": false},
  "away": {"after": ["glass"], "tells": ["away:wave", "away:window"], "seconds": 16, "show": false},
  "dawn": {"after": [], "tells": ["dawn:pass", "dawn:open", "dawn:shut"], "seconds": 24, "show": false}
},
"points": ["strap#grip", "train_window#pane", "busygin", "silva", "sarafanov", "nina", "vasenka"],
"offers": ["train#tail", "train#door", "sarafanov", "nina", "vasenka", "far_window"],
"party": {"father_came": 1, "nina_came": 0, "vasya_came": 0, "silva_door": 1, "nina_is": "none", "suitcase": 0, "box_hand": 1,
  "warm": 0.36, "frost": 0.25, "vasya_end": "taiga", "late_run": 0},
"acts": {}}
```
