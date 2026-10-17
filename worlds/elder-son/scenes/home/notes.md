> **UNFINISHED — the work stopped halfway (the branch ss/dom, 2026-10-15); merged into env/malay/three and env/dev as it is, paused.**
> Done: `lib.js` rewritten to the plan of scenes.md (the plan's x/z, across = x − 2; the table end-on to the window, six places, the camp bed,
> the sofa, Sarafanov's door ajar and his lamp, the way of “On Tiptoe”, the far train and the figure beyond the window — keys), the shots
> of all the beats in numbers (`CAM`), `film(scene)` — the beats module's table with all 33 beats (from/after/run), the looks from
> `kit.cast.characters`, the parts in the hands together with the looks' parts (`hold`/`WITH`). `tools/home/gen.mjs` rewritten
> (new elements, keys, states, the inserts hands/tea/box, the modules cast/beats/closeups), but **not run yet**:
> `scene.json` is the old one, `script.js` calls the old API — the scene is broken on this branch. Not done: `script.js` (beats.play,
> door_f, sar_door_f = 270 − 90·sar_door, far_train_x, sneak/sneak_at/stir), `showcase.js`, the paintings of the new elements (window with the WGSL hole hole, window_frame, sar_door,
> sar_room, table/table_end/table_side, cot, cot_top, cot_chair, case_chair, coat_chair, rucksack_door, far_train,
> father_far; changes to stove/hook/clock/cupboard/k_back/r_right for the new plan), the run in node, a render, the contract's block.
> Below — a description of the version before; it no longer equals the code.

# The Sarafanovs' Home (opus)

Chapters I–II: the kitchen under an orange lampshade and the room beyond the doorway, night. Engine 3, the camera `roam`
(`area` over the kitchen and the room), the shots — by the keys `camera_x/z/yaw/h`. The module `cast` (`houses` and
`trains` not needed: the view from the window is a card of its own, `outside`). `scene.json` is written by the generator
`tools/home/gen.mjs` from `lib.js`.

## How it is made

- **The plan** (across = x − 2 of the plan of scenes.md, distance = z): the kitchen across −2…2, distance 0…4; the room
  2…6. The walls — cards facing inward (`k_back` with the window cut through, `k_left`, the near one — three pieces round
  the door, the right — two pieces and a lintel round the doorway; the room's `r_*`), the floor (walked on), the ceiling
  (a plane facing down). The walls' paint — the shared `lib.kitchenWall` (green oil paint up to 1.2 m, whitewash) and
  `lib.roomWall` (wallpaper).
- **The window** `window` (frost by `frost`, the frame, a curtain; the points `window`, `window#pane`), beyond it the
  vegetable plots, the platform with its lamps (`outside`, `yard`) and the sky. **The door** `door` on its hinge
  (`door_f` = 80·`door`), behind it the dark passage.
- **The stove** `stove` by the left wall: its door — a layer, opening by `stove_door`, the fire — the light `fire` (`on:
  stove_door`); the point `stove#door`. **The table** with its oilcloth: a bread bin, two glasses, the snuffbox when
  `box_at` is table; the points `table#bread`, `table#glass`, `table#box`. The lampshade: its glass orange (it glows),
  the light `lamp` warm white, `on: lamp` (= 0.6 + 0.4·`warm`, the script). The chairs at the table's ends — the places
  `SEAT.l`, `SEAT.r`. The wall clock (its pendulum — a layer). The hooks `hook` (the coat when `coat_b` is hook; the
  point `hook#coat`), a stool by the door (the hat — `hat_on_stool`), **the cupboard** `cupboard` in the room beyond the
  doorway (the snuffbox on its shelf when `box_at` is shelf; the points `cupboard#box`, `cupboard#shelf`), the sofa,
  Vasenka's rucksack by his chair (`rucksack`).
- A look by the beat — `<id>_wear: {who: …}` (Busygin in his shirt, Sarafanov with his hat in his hand, Sarafanov at
  home).

## Beats

- `kitchen` (≈ 16 s, by a cut): the door; Vasenka, Silva, Busygin come in; Vasenka sits down (the rucksack by his
  chair), Silva sits down and reaches for the bread bin, Busygin goes to the stove, opens its door (`reach`), hands to
  the fire (`warm_hands`) — `kitchen:stove`. No insert `hands`.
- `warm_up` (≈ 6 s, after `kitchen`): he turns to the table — `warm_up:turn`.
- `enter` (≈ 20 s, by a cut): the door, Sarafanov with his hat in his hand — `enter:in`; Silva gets up; the hat onto the
  stool (`reach_put`); he goes to Busygin; a cut (made ready ahead) to a close shot of the two in profile against the
  lampshade — `enter:near`.
- `embrace` (≈ 8 s, after `enter`): a step close, `hug` and his hands to `busygin#back`, Busygin's hands to
  `sarafanov#back` — `embrace:held`; Silva sits down.
- `box_out` (≈ 20 s, by a cut): at the table (the camera from the near side, at a slant); he gets up, goes into the room
  to the cupboard, takes the snuffbox (`box_at` none, the part `box_held`), sits down, puts it on the oilcloth (`box_at`
  table) — `box_out:down`. The pose for the choice: `table#box` (x ≈ 0.42) and `sarafanov` (≈ 0.60).
- `box_take`, `box_give` (≈ 3 s, after `box_out`): a hand to the snuffbox — `box_take:close` / `box_give:close`; next
  there should be the insert `box` of the module `closeups` — the world does not have it.
- `box_kept` (≈ 7 s, after `box_take`): no snuffbox, a hand to his chest — `box_kept:back`.
- `box_back` (≈ 15 s, after `box_give`): the snuffbox in his hand, to the cupboard, onto the shelf — `box_back:shelf`,
  he stands with his back turned.

## What is missing / open

- The inserts (`hands`, `tea`, `box`) — there is no module `closeups`. The beats `nina_in`, `supper`, `supper_after`,
  `talk`, `talk_back`, `galya_*`, `wall`, `wake`, `sneak`, `caught`, `window_watch`, `morning`, `table`, `toast`,
  `let_go`, `ask_stay`, `for_me`, `pack`, `confess`, `exposed`, `go_out`, `home_late`, `home_anyway`; the camp bed,
  `sar_door`, `sar_light`, `far_train`, `hole`, `sneak`, `stir`; `coat_b` cot/arm/chair — not done.
- No motions `take_shelf`, `put_shelf` — a hand to the shelf (`reach`).
- The way into the kitchen is shot from the corner by the door: those coming in pass close to the lens (the first
  seconds — a big dark silhouette).

## Contract for the check

```json
{"beats": {"kitchen": {"after": [], "tells": ["kitchen:stove"], "seconds": 16, "show": false},
 "warm_up": {"after": ["kitchen"], "tells": ["warm_up:turn"], "seconds": 6, "show": false},
 "enter": {"after": [], "tells": ["enter:in", "enter:near"], "seconds": 20, "show": false},
 "embrace": {"after": ["enter"], "tells": ["embrace:held"], "seconds": 8, "show": false},
 "box_out": {"after": [], "tells": ["box_out:down"], "seconds": 20, "show": false},
 "box_take": {"after": ["box_out"], "tells": ["box_take:close"], "seconds": 3, "show": false},
 "box_give": {"after": ["box_out"], "tells": ["box_give:close"], "seconds": 3, "show": false},
 "box_kept": {"after": ["box_take"], "tells": ["box_kept:back"], "seconds": 7, "show": false},
 "box_back": {"after": ["box_give"], "tells": ["box_back:shelf"], "seconds": 15, "show": false}},
 "points": ["table#box", "table#glass", "table#bread", "sarafanov", "busygin", "window", "window#pane", "stove#door", "hook#coat", "cupboard#box"],
 "offers": ["table#box", "sarafanov"],
 "party": {"warm": 0.36, "frost": 0.25},
 "acts": {}}
```
