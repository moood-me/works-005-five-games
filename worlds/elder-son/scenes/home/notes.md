# The Sarafanovs' Home

Chapters I, II, IV, V and the epilogue: the kitchen under an orange lampshade and the room beyond its doorway, two
nights and a grey dawn. Engine 3, the camera `roam` (`area` over both rooms), every shot set by the keys
`camera_x/z/yaw/h/look` (lib `CAM`). Modules: `cast` (the people), `beats` (the film), `closeups` (the inserts `hands`,
`tea`, `box`). `scene.json` is written by `node tools/home/gen.mjs` from `lib.js`; the paintings are `elements/*`.
`node tools/home/check.mjs [beat …] [--party '{…}']` plays every beat in node on a virtual clock and prints where the
people and the game's points stand in the frame at each moment told (and each beat's length).

## The plan

Metres of scenes.md's plan: x to the right, z in from the kitchen's near wall; the scene's `across` = x − 2,
`distance` = z (lib `A`, `W`, `P3`).

- **Kitchen** x 0…4, z 0…4, 2.6 high. Near wall: the front door (x 3.2, on its spring, `door` → `door_f` = 80·door,
  the passage `hall` behind it), the hooks (x 3.8: Busygin's coat `coat_b` hook, Nina's coat `nina_coat`; the point
  `hook#coat`), the stool (the hat, `hat_on_stool`), a calendar, a radio. Left wall: the stove (z 1…2.2, its front at
  x 0.75 — the iron plate with the kettle `kettle_at` stove, the fire door opening by `stove_door` with its flickering
  fire and the light `fire`; points `stove#door`, `stove#fire`), the wall clock (z 0.6, `clock#face`, the pendulum a
  layer), a washstand. Back wall: the window (x 1.2…2.4, sill 1.0: `window` — the frost by `frost`, the hole by `hole`
  in its shader `window.wgsl`, the point `window#pane` in the lower right pane; `window_frame` — casing, bars, curtains,
  a geranium; `sill`). The table end-on to the window (x 1.4…2.2, z 1.8…3.6): its top a plane (`table` — the oilcloth
  or the white cloth `table_set`; the snuffbox `box_at` table · near, `puddle`, `sheet_on`; its points `table#box`,
  `table#glass`, `#glass_s`, `#bread`, `#kettle`, `#sheet`), its ends and sides (`table_end`, `table_side`); standing
  on it `glass_b`, `glass_s`, `kettle` (table · pushed), `bread`, `bottle` and the six `set_glass` (laid). Six places
  (lib `SEATS`): L1 Sarafanov, R1 Busygin, L2/R2 the middle, L3/R3 by the window; IV's places as scenes.md. The
  lampshade — a form turned on a lathe (`lampshade`, it glows), its cord; the light `lamp` (0.6 + 0.4·`warm`, set by
  each beat's `from`) under it. Right wall: the doorway into the room (z 2.5…3.5).
- **Room** x 4…8, beyond the doorway (its face of the wall `r_left_*`). The camp bed along the wall (`cot`, `cot_end`,
  `cot_top` with the point `cot_top#bed`; the offer `cot`), the chair by its head with the coat at night (`cot_chair`,
  `coat_b` cot, `cot_chair#coat`), the sofa against the back wall (`sofa`, `sofa_front`, `sofa_arm`, `sofa_top` with
  `sofa_top#bed`) under a wall rug, the sideboard by the near wall (`cupboard`, the snuffbox on its shelf `box_at`
  shelf; `cupboard#box`, `#shelf`), a chair with the clarinet case (`case_chair`, `case_on`), Sarafanov's door in the
  right wall (`sar_door`, z 3.1…3.9, hinged at 3.1, always ajar: `sar_door` 0.08 → `sar_door_f` = 270 − 90·sar_door),
  his room beyond it (`sar_room`).
- **Beyond the window** the gardens under snow (`outside`, `yard`), birches, a neighbour's lit window, far right the
  platform's lamps; the sky by `hour`; snow falling beyond the glass; the electric train (`far_train` 0…1 →
  `far_train_x`); in the morning Sarafanov's small figure crossing them (`father_on`, `father_x`).

## Light

`hour` is the light's look (0.25 grey dawn … 0.9 night; at 0 the state is the dawn). The lamp's light under the shade,
the stove's fire, the window's daylight (`snow_light`), a dim light in the room (stronger at dawn), the night sky's
far light. **His lamp** (`sar_light`; `stir` sets it in On Tiptoe) is a light standing in the room before his door's
gap: a door ajar 0.08 leaves too narrow a gap for the lamp's shadow to cut a wedge, so the light comes from the gap —
on the sofa's right end (Silva's head in `wall`) and through the doorway onto the kitchen floor (the kitchen's right
wall casts its shadow).

## Lying

`lie` (on the back) faces its feet the person's turn; `lie_side` turns from the back onto the side and ends with the
head at turn − 22° (seen on the sheets). On the cot the head is by the doorway (turn 180; on the side 22 — facing the
room: the motion turns onto that side only), on the sofa at its right end (270; on the side 112). The hips go onto the
bed's point (`<id>_on`: `cot_top#bed`, `sofa_top#bed`) — their floor there. Off the cot: a cut sits him on its edge
facing the room, then `rise`.

## Beats

All 33 of scenes.md (lib `film(scene)`, in its order); the moments and the faces as scenes.md says. Its seconds below
are the node run's (`check.mjs`: walks at 1.25 m/s, the motions' own lengths).

- `kitchen`: the kitchen wide from the window's corner (`CAM.win`): the three come in; the stove door opens; `hands`
  opens and holds a moment.
- `warm_up` (a cut, made ready: `hands` closes): he turns from the stove to the table (Vasenka, the stove).
- `enter`: the door, Sarafanov with his hat; the hat onto the stool; the two at the stove (Busygin in profile, the old
  man in three quarters). `embrace`: over the old man's shoulder — Busygin's face, sad.
- `nina_in`: Nina in the door, close in three quarters; through the kitchen into the room.
- `supper`/`supper_after`: the toast, the old man in three quarters; the glass point `table#glass`; the sheet of music.
- `talk` (Silva to the sofa; the kettle; `tea` opens and holds), `talk_back` (a cut, made ready: the two face to face
  along the table, the puddle), `galya_*`.
- `box_out`: he gets up and steps away; a cut — at the sideboard he takes it; a cut — back in his place; the snuffbox on the oilcloth (a
  little card of its own on the table, `snuffbox`); `box_take`/`box_give` open `box` (`box_mode` set before);
  `box_kept`, `box_back` (a cut to the sideboard: his back at the shelf — the device). No walk there and back: the
  silent stretch before a moment the game waits for is kept within ~8 s.
- `wall`: the room dark, his lamp; Silva close in its light; Busygin turns on his side.
- `wake`: dawn; close on the cot's head (`CAM.wake`): Silva's hand on his shoulder, both faces; a cut to the room: he
  sits on the cot's edge, Silva a step off — the choice (the coat on the chair at the cot's foot, the cot). `sneak`: up
  off the edge, the coat, both tiptoe into the kitchen to the stove. `caught`: the old man in the doorway (`heard`); the
  coat on the hook (`CAM.door`); he goes out.
- `window_watch`: Silva lies down again; Busygin at the window. `morning` (a cut, made ready): the two by the table,
  the old man stops — L47, L48 —, goes; at his shoulder the rubbed hole close (`CAM.hole`): the figure with the case
  crosses the gardens (12 m off, in the hole).
- `table`/`toast`/`let_go`/`ask_stay`/`for_me`: IV, the six places, the high shot along the table (`CAM.toast`).
- `pack`: the old man close in the doorway as he speaks (`CAM.packSar`), then the room from the far corner for the
  choice; `confess`/`exposed`: the two by the doorway in profile; the old man at the window with his back (`CAM.window`);
  with `hurt` 0 both sit down face to face and he reaches for Busygin's hand. `go_out`.
- `home_late`: whoever came comes in with him, each in a sequence of their own; the old man sits facing him (L105) —
  or is at the table already —, gets up to fetch the snuffbox off the shelf — a cut to the sideboard, a cut to the kitchen wide as he brings it — (or slides it over), goes to his room;
  Nina at home comes to the table; beside him (`nina_for`) — the two from the stove's corner (`CAM.pair`).
  `home_anyway`: the old man at the window (or comes in first and goes to it); the kettle to the stove; he sits.

The cuts: a beat that begins with a new shot begins by its `from` (the beats module makes it ready); a cut inside a
beat is a shot made ready ahead (`s.shot`), waited for (`s.until(() => shot.ready)`) where it cannot be made earlier.
What goes on beside a beat's main line (someone walking off, sitting down) is a sequence of its own inside it
(`s.sequence`), so that it stops with the beat.

## What is not so / open

- The way “On Tiptoe” is ≈ 3.7 m (the kitchen gives no 6 m); the script walks them there at the gait `tiptoe`, Silva
  0.7 m behind, `sneak_at` every 0.1 s.
- No wedge of light cut by the door's gap (above): a light at the gap.
- Motions are the cast's: `lie_side` begins already on the side (no turning over), `sit_up` sits up only halfway,
  `take_shelf`/`put_shelf` are reaches. The insert `box`'s mode is the key `box_mode`.
- Getting up at the table: `rise_back` (pushing the chair back, 0.24 m behind the seat); off the cot `rise` (room before
  it): a cut sits him on its edge first.
- The old man's way to the room from his place goes round behind the table past the window (lib `ROUND`): across the
  near end it would pass before the lens of the shots along the table. In `home_late` he goes the short way, the
  kitchen wide (`CAM.win`) as he goes.
- The far train is this scene's own card (`far_train`), not the module `trains`.
- `home_late` with the snuffbox fetched is ≈ 30 s — at the limit.

## Contract for the check

```json
{"beats": {
  "kitchen": {"after": [], "tells": ["kitchen:stove"], "seconds": 12, "show": false},
  "warm_up": {"after": [], "tells": ["warm_up:turn"], "seconds": 7, "show": false},
  "enter": {"after": [], "tells": ["enter:in", "enter:near"], "seconds": 22, "show": false},
  "embrace": {"after": ["enter"], "tells": ["embrace:held"], "seconds": 7, "show": false},
  "nina_in": {"after": [], "tells": ["nina_in:door", "nina_in:gone"], "seconds": 20, "show": false},
  "supper": {"after": [], "tells": ["supper:toast"], "seconds": 11, "show": false},
  "supper_after": {"after": ["supper"], "tells": ["supper_after:sheet"], "seconds": 11, "show": false},
  "talk": {"after": [], "tells": ["talk:kettle"], "seconds": 11, "show": false},
  "talk_back": {"after": [], "tells": ["talk_back:ready"], "seconds": 3, "show": false},
  "galya_yes": {"after": ["talk_back"], "tells": ["galya_yes:hand"], "seconds": 7, "show": false},
  "galya_no": {"after": ["talk_back"], "tells": ["galya_no:glass"], "seconds": 4, "show": false},
  "box_out": {"after": [], "tells": ["box_out:down"], "seconds": 10, "show": false},
  "box_take": {"after": ["box_out"], "tells": ["box_take:close"], "seconds": 3, "show": false},
  "box_give": {"after": ["box_out"], "tells": ["box_give:close"], "seconds": 3, "show": false},
  "box_kept": {"after": ["box_take"], "tells": ["box_kept:back"], "seconds": 7, "show": false},
  "box_back": {"after": ["box_give"], "tells": ["box_back:shelf"], "seconds": 10, "show": false},
  "wall": {"after": [], "tells": ["wall:dark", "wall:turn"], "seconds": 19, "show": false},
  "wake": {"after": [], "tells": ["wake:up"], "seconds": 6, "show": false},
  "sneak": {"after": ["wake"], "tells": ["sneak:ready"], "seconds": 21, "show": false},
  "caught": {"after": [], "tells": ["caught:face", "caught:hook", "caught:out"], "seconds": 25, "show": false},
  "window_watch": {"after": ["wake"], "tells": ["window_watch:pane"], "seconds": 9, "show": false},
  "morning": {"after": [], "tells": ["morning:in", "morning:out"], "seconds": 21, "show": false},
  "table": {"after": [], "tells": ["table:nine", "table:in", "table:sat"], "seconds": 23, "show": false},
  "toast": {"after": ["table"], "tells": ["toast:news", "toast:turn"], "seconds": 21, "show": false},
  "let_go": {"after": ["toast"], "tells": ["let_go:glass"], "seconds": 8, "show": false},
  "ask_stay": {"after": ["toast"], "tells": ["ask_stay:stand"], "seconds": 14, "show": false},
  "for_me": {"after": ["toast"], "tells": ["for_me:stand"], "seconds": 12, "show": false},
  "pack": {"after": [], "tells": ["pack:case", "pack:silva"], "seconds": 16, "show": false},
  "confess": {"after": ["pack"], "tells": ["confess:said", "confess:sarafanov"], "seconds": 19, "show": false},
  "exposed": {"after": ["pack"], "tells": ["exposed:said", "exposed:window"], "seconds": 15, "show": false},
  "go_out": {"after": ["confess", "exposed"], "tells": ["go_out:gone"], "seconds": 12, "show": false},
  "home_late": {"after": [], "tells": ["home_late:sat", "home_late:box", "home_late:room"], "seconds": 21, "show": false},
  "home_anyway": {"after": [], "tells": ["home_anyway:turn"], "seconds": 25, "show": false}
},
"points": ["table#box", "table#glass", "sarafanov", "busygin", "silva", "nina", "kudimov", "cot", "cot_chair#coat", "clock#face", "window#pane",
  "hook#coat", "stove#door", "cupboard#box", "hands#hands", "tea#glass1", "tea#glass2", "box#finger1", "box#finger2", "box#finger3", "box#finger4",
  "box#box", "box#old"],
"offers": ["table#glass", "sarafanov", "table#box", "cot_chair#coat", "cot", "kudimov", "nina", "silva"],
"party": {"warm": 0.36, "frost": 0.25, "box_where": "cupboard", "vasenka_by": 0, "silva_door": 1, "father_came": 1, "nina_came": 0, "vasya_came": 0,
  "nina_end": "gone", "nina_for": 0, "vasya_end": "taiga"},
"acts": {}}
```
