# The Street

Chapters I (the windows, Makarskaya's window, the porch, the return), II (the gate), IV (the fire), V (the bench, the
run) and the epilogue: a suburb's street at night, snow. Engine 3, the camera `roam` (not `panorama` as in scenes.md:
a panorama's sky ends about 65° from the straight look, black beyond, and the shots of the corner and of the kitchen
window are turned far aside; `roam`'s sky goes all round). The camera is set by the keys `camera_x`, `camera_z`,
`camera_yaw`, `camera_h` at each beat (`lib.js` `CAM`). Modules: `cast`, `beats`, `closeups`, `houses`. `scene.json`
and the houses' walls/windows are written by the generator `tools/street/gen.mjs` from `lib.js` (where everything
stands): change `lib.js` and run it. `node tools/street/check.mjs [beat …]` plays every beat and the actions by key in
node with a stub director and prints, at each moment told, where the camera is and where each person stands in the
frame (x from the middle in frame heights — the 4:3 edges ±0.667; size; `f` — the face from the camera: 0 full face,
90 profile, 180 the back; for those in the kitchen — whether the eye sees them through the window).

## How it is made

- **Where things are** (metres: across to the right along the street, distance inward): the road along distance
  2.5…7.5; the far side — three houses with five windows (`win1…win5`, across −14, −8, −2, 4, 10; distance 14), a
  street lamp between the first two; the neighbours' door `nb_door` (across 12.8); the Sarafanovs' house (across
  16.5…26.5, its front at 12): the room's dark window, **the kitchen window** `kitchen` (across 22), the door `door`
  (25.2) with its porch, the bulb `porch_bulb` and the hall; the front garden with its gate and lamp `gate_lamp`, the
  barrel `barrel`, a bench under the kitchen window; the fence between the yards (across 27.4) with two wickets — by
  the street (distance 10.2…11) and at the back, behind the shed (12.4…13.2); Makarskaya's shed `shed` (27.6…30.2, its
  front at 11.2); Makarskaya's house (30.5…38.5, its front at 13) with the window `mak_window` (32) and the door
  `mak_door` (36.9); a woodpile. The near fence — behind the camera of the wide shot. On the left the bank up to the
  platform (`relief.js`).
- **A house** — an unseen anchor, a long log wall with the windows and the door cut through (`houses.wall`), the roof's
  slope (a plane), two end walls. A window — glass behind an opening (`houses.pane`): the layers `lit`, `figure` (a
  silhouette), `bars`; their visibility and glow by `<window>_lit`, `<window>_who`, which the script eases by `win1…5`,
  `mak_window` (0/1/2). A window's light on the snow — the scene's light `of` the window, `on` — `<window>_lit`.
- **The kitchen behind the window** — a real room 3 × 3 m (`k_back`, `k_left`, `k_right`, the floor at the plinth's
  height 0.45): the table under the lampshade (the light `lamp`, reach 2.6) with its far side to the back wall, the stove
  against the back wall right of it (its fire — `stove_l`), the people in it `k1…k4` (their looks by the beat). Its
  places (`K`) stand where the street sees them through the 1.2 m window from before it (across 21.4…22.8): the far
  side of the table (`far_l`, `far_r`, facing the window), its east end (`end_e`, in profile), the stove (`stove`, the
  back to the window); `end_w` is seen only from the right (the fire's wide shot). The frost on the glass — `kitchen`
  (by `frost`, see-through), its glow on the snow — 0.55 + 0.45·`warm`.
- The doors — cards on their hinges (`door_f`, `mak_door_f`, `nb_door_f` = 180 − 80…84·key, the script sets them);
  behind each a lit hall and its light (`on` the door's key). People go in and come out through points in the halls
  out of sight (`INSIDE`, `MAK_INSIDE`), or stand in the hall right behind the door as it opens (`HALL`) — nobody appears
  or vanishes in the frame.
- The far yards beyond the houses (`far`) — one card 150 m wide, turned to the street (`facing` 180): a card not
  turned faces the eye, and from the bank its near end swung across the frame.
- The cuts inside a beat are made ready ahead (`s.shot` at the beat's start, `s.until(() => shot.ready)` before the
  cut).
- The night — the lights `night_sky` and `ambient`; `hour` → the look `late` (the script). Snow — particles by `snow`.
  The fire — `fire` (the shed's layers by `shedLive`, flames, embers, smoke, the light `fire_l`); `steam`; Silva's
  smoking sleeve (`silva_smoke`); the water thrown (`splash`: each change a burst).
- The insert `shawl` (his coat on Nina's shoulders) — the world's `closeups`, the shot `shawl`; its key `lay`.

## Beats (`lib.js`, `film(scene)`; the script plays them by `beat` through `beats`, the showcase — `showcase.js`)

Seconds — as `check.mjs` plays them (the gait 1.3 m/s; the real gaits may differ a little).

- `walk` (≈ 11 s): down the bank from the platform's path (the camera turning with them, ≈ 3.5 s: the beginning of the
  way); a cut — along the street beside them as they come to the windows (≈ 4.5 s); a cut to the side medium under the
  street lamp, faces in its light: Silva `smile`, Busygin `tired` — `walk:stop` (≈ 9 s in).
- `knock_ready` (2 s): a cut to the near fence (made ready while `walk` plays) — the five windows in the middle 4:3 (x −0.56…0.57).
- `last_window` (≈ 9 s, by a cut): the windows dark, the snow thicker; they set off along the street (the camera
  following, ≈ 3.5 s); a cut to the side of the corner before the shed as they come to it from the left edge: both in
  profile toward her lit window, the kitchen window on the left (x −0.4), hers on the right (0.4) —
  `last_window:corner` (≈ 6 s in).
- `neighbor` (≈ 24 s): from just behind the two (their backs in the foreground — the device). The door opens,
  Sarafanov in the hall comes out, down his porch toward them; a cut near him as he comes to her window: he stands
  right of it turned to the glass (profile, ≈ 0.6 of the frame, in her window's light), knocks — `neighbor:knock`
  (≈ 6 s in); a silhouette — `neighbor:answer` (≈ 8 s; L09 near him: `sad`, a guilty `smile`); a cut back behind the
  two as she says L10, her window still lit (dark ≈ 3 s later): he goes back past the two (two metres before them, not
  turning his head) through the wicket into his garden — `neighbor:gone`; the camera back to the door, Vasenka from
  behind the shed through the back wicket to the porch, behind his father's back; the door — `neighbor:vasya`; the
  beat ends when the father is off the frame's left edge at his gate.
- `porch` (≈ 14 s, after `neighbor`): Vasenka goes in; the two to the porch (L11, L12 on the way), the camera to the
  porch's side; Silva knocks — `porch:knock`; the light, the door, Vasenka in the doorway — `porch:open`. Faces: Silva
  `smile`, Busygin `thinking` in three quarters. The pose for the choice: `vasenka` (x 0.52) and `kitchen` (0.09).
- `shut` (≈ 16 s, after `porch`): he goes in, the door shuts, the bulb goes out — `shut:closed`; a cut into the front
  garden, the gate's lamp behind the camera: both faces to it, Busygin `sad` hugging himself (`cold`), Silva `smile`; a cut back to the
  porch's side; Silva knocks — `shut:knock`; the light, the door — `shut:again`.
- `in` (≈ 12 s, after `porch`/`shut`): all into the house, the door, the light out; the camera before the kitchen
  window: the three come in and take their places — Silva and Vasenka at the table, Busygin at the stove — `in:inside`.
- `return` (≈ 11 s, by a cut): later, snow; Sarafanov from the left along the street to his gate (the gate's shot,
  ≈ 2 s); a cut under his window as he comes to it — `return:window` (≈ 3.5 s in): his back to us (the device; ≈ 0.35
  of the frame on the left), in the window on the right the three strangers at his table; he stands 3.5 s; a cut to the
  porch's side: he comes to the door in three quarters, the door — `return:door`.
- `gate` (≈ 15 s): Nina and Kudimov under the gate's lamp, in profile (`tired`, `neutral`); his watch — `gate:watch`
  (L26, L27); he marches off left, out of the frame — `gate:gone`; she goes toward the porch, off the frame's right
  edge (the house's `nina_in` brings her in at the door).
- `evening` (≈ 9 s): the second night, three shots — the street from the near fence (1.5 s: the windows dark where he
  knocked, by `knocked`); a cut (made ready) to the yard from across the street: Silva (come out of the Sarafanovs'
  door — the walk along the yard left out) at Makarskaya's, knocks, she lets him in, Vasenka on the dark porch; a cut
  (made ready) to Vasenka close (`sad`) as he goes in, her door shutting off the frame — `evening:in` (≈ 8.8 s). With
  `fire` up to `fire:cry` (≈ 2.7 s) the silent stretch before the cry is ≈ 12 s (was ≈ 30).
- `fire` (≈ 12 s): later — a cut to the wide yard (made ready while `evening` plays); the shed burns (`fire` → 0.6 over 1.5 s); Makarskaya runs out
  — `fire:cry`; Silva with his smoking sleeve; the neighbours with buckets out of their door; Busygin out of the
  window and the door to the barrel — `fire:ready`: the pose for “Buckets” (`barrel` x −0.49, `shed` 0.07). The
  neighbours throw by themselves as long as `fire` > 0.03 (`crowd`: the script, a throw at a time; a beat's start stops them).
- `after_fire` (≈ 10 s, by a cut): the shed smouldering (`fire` 0.2), steam, by `shed_left`; the half-ring; Silva turns
  on them — `after_fire:who` (L84, `angry`); a cut to Vasenka close, full face, in the shed's glow (`afraid`, the matchbox); back —
  the pose for the choice: `vasenka` (x −0.21) and `makarskaya` (0.31).
- `blame` (≈ 10 s, after `after_fire`): Busygin two steps forward — `blame:step`; Silva comes at him (`surprised` →
  `angry`, full face), points; Vasenka's fist into his pocket, not looking at his brother (`sad`, profile).
- `own_up` (≈ 19 s, after `after_fire`): his hand on the boy's shoulder; through the wicket to Makarskaya; both in
  profile, medium — `own_up:said` (L87, two seconds, L88); she goes home; Sarafanov runs out onto his porch (`afraid`)
  — `own_up:gone`.
- `porch_night` (≈ 14 s): the third night; Nina on the bench under the window in her shawl (`thinking`, `sad` when she
  knows); he comes out with his coat over his arm, sits by her — `porch_night:sat`.
- `shawl` (≈ 3 s, after `porch_night`): opens the insert `shawl` — `shawl:close`.
- `porch_after` (≈ 6 s, after `shawl`): the insert shut, the coat on her shoulders; by `nina_is`: her hands round his
  and a `smile` (the camera nearer), the coat given back, or apart — `porch_after:lean`.
- `run_out` (≈ 6 s): the door flung open; Silva ahead (by `silva_door`), Busygin to the gate facing left —
  `run_out:ready` (the pose for “Running”).
- `night_window` (≈ 19 s): the epilogue: from far up the street the camera comes to ≈ 13 m before the kitchen window;
  who is in it — by `ending`, `nina_end`, `nina_for` — `night_window:held`.

The actions by key (the script):

- `knock` (1…5 / 0): Busygin to window N (more than 4 m off — at a run, `run`, the last step walked), a knock —
  `knock:hit` (0.6 s into it; ≈ 3 s after the press for the next window, ≈ 8.5 s for the far end), `knock:done`; 0 —
  back to Silva. The
  window itself (the silhouette, going dark) the game sets by `winN`.
- `buckets` (`fill` · `throw` · `none`): back to the barrel at a run, a full bucket — `buckets:full`; carried to the
  shed (`carry_walk`, 4.7 m), thrown — `buckets:splash` (the splash burst); a round ≈ 11 s; `none` — the bucket put down.
- `run` / `run_at` / `look_back`: he runs along the street (the gait `run`, at its own pace) while `run` is ahead of
  where he is, and stops when it is not; `run_at` (0…1, ten times a second) — where he is; Silva, if he came out, runs
  on ahead by himself at the first step and is gone up the path; `look_back` 1 — he stands turned to the kitchen
  window (in profile to the camera). The camera goes along beside him on the near side, moving ahead of him once he
  is under way.

## Departures from scenes.md

- Makarskaya's window is right of the shed (across 32): from behind the two at the corner, Sarafanov there is seen in
  profile only standing right of the window turned to its glass; the shed would hide the window from the corner
  scenes.md gives (28, 8) — the corner is before the shed (29.3…30, 8.3…9.1).
- In `neighbor` he goes off through his own garden (out of the frame at once), not along the road past the two —
  that way he would come within a metre of them; Vasenka slips in behind him through the back wicket. His way to her
  window is cut (the porch, then he is at the window), not followed whole: an action without words stays short.
- In the kitchen the stove stands at the back wall (scenes.md: “opposite the window”), the table's far side to it —
  so the people are seen through the window.
- `cold` and the other motions — the cast's (`cold`, `knock`, `look_watch`, `march_walk`, `carry_walk`, `dip`,
  `throw_bucket`, `put_down`, `point`, `give`, `take`, `sit_down`, `seated`, `warm_hands`, `run`).

## Contract for the check

```json
{"beats": {"walk": {"after": [], "tells": ["walk:stop"], "seconds": 11, "show": false},
 "knock_ready": {"after": [], "tells": [], "seconds": 2, "show": false},
 "last_window": {"after": [], "tells": ["last_window:corner"], "seconds": 9, "show": false},
 "neighbor": {"after": [], "tells": ["neighbor:knock", "neighbor:answer", "neighbor:gone", "neighbor:vasya"], "seconds": 24, "show": false},
 "porch": {"after": ["neighbor"], "tells": ["porch:knock", "porch:open"], "seconds": 14, "show": false},
 "shut": {"after": ["porch"], "tells": ["shut:closed", "shut:knock", "shut:again"], "seconds": 16, "show": false},
 "in": {"after": ["porch", "shut"], "tells": ["in:inside"], "seconds": 12, "show": false},
 "return": {"after": [], "tells": ["return:window", "return:door"], "seconds": 11, "show": false},
 "gate": {"after": [], "tells": ["gate:watch", "gate:gone"], "seconds": 15, "show": false},
 "evening": {"after": [], "tells": ["evening:in"], "seconds": 9, "show": false},
 "fire": {"after": [], "tells": ["fire:cry", "fire:ready"], "seconds": 12, "show": false},
 "after_fire": {"after": [], "tells": ["after_fire:who"], "seconds": 10, "show": false},
 "blame": {"after": ["after_fire"], "tells": ["blame:step"], "seconds": 10, "show": false},
 "own_up": {"after": ["after_fire"], "tells": ["own_up:said", "own_up:gone"], "seconds": 19, "show": false},
 "porch_night": {"after": [], "tells": ["porch_night:sat"], "seconds": 14, "show": false},
 "shawl": {"after": ["porch_night"], "tells": ["shawl:close"], "seconds": 3, "show": false},
 "porch_after": {"after": ["shawl"], "tells": ["porch_after:lean"], "seconds": 6, "show": false},
 "run_out": {"after": [], "tells": ["run_out:ready"], "seconds": 6, "show": false},
 "night_window": {"after": [], "tells": ["night_window:held"], "seconds": 19, "show": false}},
 "points": ["win1", "win2", "win3", "win4", "win5", "kitchen", "vasenka", "busygin", "silva", "sarafanov", "nina", "kudimov", "makarskaya", "mak_window", "barrel", "shed", "shawl", "shawl#coat", "shawl#shoulders", "vasenka#chest", "makarskaya#chest", "nina#chest", "sarafanov#chest"],
 "offers": ["win1", "win2", "win3", "win4", "win5", "vasenka#chest", "kitchen", "makarskaya#chest"],
 "party": {"warm": 0.36, "frost": 0.25, "nina_is": "none", "secret": 0, "silva_door": 1, "ending": "late", "nina_end": "gone", "nina_for": 0, "knocked": ""},
 "acts": {"knock": {"values": [0, 1, 2, 3, 4, 5], "tells": ["knock:hit", "knock:done"]},
  "buckets": {"values": ["none", "fill", "throw"], "tells": ["buckets:full", "buckets:splash"]},
  "run": {"values": [], "tells": []},
  "look_back": {"values": [0, 1], "tells": []}}}
```
