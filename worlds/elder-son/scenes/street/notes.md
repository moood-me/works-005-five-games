# The Street

> **Stopped halfway (2026-10-15, the owner's order — the game is paused).** The branch `ss/ulica`; merged into `env/malay/three` and `env/dev` as it is, paused.
> Done in the code, but **not rendered and not finished**: `lib.js` rewritten for the module `beats` (`film(scene)` → all 19
> beats with `from`/`after`/`run`; the actions `knock`, `buckets`; `runPoint/runAt/runWay` for “Running”), the generator
> `tools/street/gen.mjs` completed (the title “The Street”, the modules `cast, beats, closeups, houses`, `scale`, the neighbours' door
> `nb_door`, Makarskaya's passage with its light, the shed with fire/ashes by `fire`/`shed_burnt`/`shed_left`, the particles of fire, smoke,
> steam, splashes, Silva's sleeve, the people `nina, kudimov, makarskaya, neighbor1, neighbor2, k4`, the suitcase, the insert `shawl` through
> `closeups`), `houses.shed` got `o.burnt`, `o.fire` (the Hillside's old call does not change), a check in node
> `tools/street/check.mjs` (a stub director, the shots' projections) — all the beats pass with no errors of the code.
> **Not done:** `script.js` and `showcase.js` are still the old ones (they call `L.film.walk(s, null)` — **the scene does not play
> as it is**: the script must go over to `scene.kit.beats.play(scene, L.film(scene))`, add `buckets`, `run`/`run_at`/
> `look_back`, `nb_door_f`, `splash`); not all the shots' numbers are put right (see below); the module `closeups` is
> not in `env/malay/three` yet; the block “Contract for the check” below is the old one, not equal to the code.
> The shots' numbers still wrong (by `check.mjs`): `walk` — CAM.stop looks past them (yaw 112 → ≈67) and the beat is 31 s;
> `last_window` — they stand with their backs to the camera (turn to the door, ≈250); `neighbor` — 58 s, Sarafanov 0.23 of the frame
> (move the corner to (28.6, 9.1), the camera panning from the door to the window), Sarafanov's leaving shortened; `porch` — Silva
> covers the kitchen window (the camera ≈ (28.1, 9.4) yaw −72); `in`/`return` — the people in the kitchen not seen in the window from these points,
> `return:door` out of the frame (the camera after him); `evening`'s 3rd shot (CAM.ev3) is wrong, the kitchen behind; `after_fire`/`blame` —
> Vasenka out of the frame in CAM.ring/CAM.blame; `own_up` — Silva and the neighbour cover the pair; `gate` 28 s;
> `porch_night`…`night_window` not looked through by the numbers.


Chapter I, “Strangers' Windows”: a suburb's street at night, snow. Engine 3, the camera `roam` (not `panorama` as in
scenes.md: a panorama's sky ends about 65° from the straight look, black beyond, and the shots of the corner and of the
kitchen window are turned by 26–64°; `roam`'s sky goes all round). The camera is set by the keys `camera_x`, `camera_z`,
`camera_yaw`, `camera_h` at each beat. Modules: `cast`, `houses`. `scene.json` and the houses' walls/windows are written
by the generator `tools/street/gen.mjs` from `lib.js` (where everything stands): change `lib.js` and run it.

## How it is made

- **Where things are** (metres: across to the right along the street, distance inward): the road along distance
  2.5…7.5; the far side — three houses with five windows (`win1…win5`, across −14, −8, −2, 4, 10; distance 14), a
  street lamp between the first two; the Sarafanovs' house (across 16.5…26.5, its front at 12): the room's dark window,
  **the kitchen window** `kitchen` (across 22), the door `door` (25.2) with its porch, the bulb `porch_bulb` and the
  passage `hall`; the front garden with its gate and lamp `gate_lamp`, the barrel `barrel`, a bench; a fence between the
  yards with a gate; the shed `shed`; Makarskaya's house (30.5…38.5, its front at 13) with the window `mak_window` and
  the door `mak_door`; a woodpile the two hide by (34.6…35.5, 10). The near fence — behind the camera of the wide shot.
  On the left an embankment up to the platform (`relief.js`).
- **A house** — an unseen anchor, a long log wall with the windows and the door cut through (`houses.wall`), the roof's
  slope (a plane), two end walls. A window — glass behind an opening (`houses.pane`): the layers `lit` (the light,
  curtains), `figure` (a silhouette), `bars`; their visibility and glow — by `<window>_lit`, `<window>_who`, which the
  script sets smoothly by `win1…5`, `mak_window` (0/1/2). A window's light on the snow — the scene's light `of` the
  window, `on` — `<window>_lit`.
- **The kitchen behind the window** — a real room 3 × 3 m (`k_back`, `k_left`, `k_right`, the floor at the plinth's
  height 0.45), the stove by the left wall (its fire — the light `stove_l`), the table with its oilcloth, the lampshade
  (the light `lamp`, reach 2.6), the people in it `k1` (Silva), `k2` (Busygin), `k3` (Vasenka). The frost on the glass —
  `kitchen` (by `frost`, translucent, warm from the lamp), its glow onto the snow — 0.55 + 0.45·`warm`.
- The Sarafanovs' door — a card on its hinge (`door_f` = 180 − 84·`door`, the script sets it); behind it the lit
  passage and the light `hall_l` (`on: door`). People go into the house and come out of it through a point in the
  passage left of the door (`INSIDE`), unseen from the street — nobody appears or vanishes in the frame.
- The night — the lights `night_sky` and `ambient`; `hour` → the look `late` (the script). Snow — particles by `snow`.

## Beats (`lib.js`, `film`; the script plays them by `beat`, the showcase — `showcase.js`)

- `walk` (≈ 27 s, by a cut): from the embankment along the street to the five windows; the camera goes beside them as
  long as Busygin walks (the length of his step is learnt at the beginning — `follow`); they stop with their backs to
  us — `walk:stop`.
- `knock_ready` (2 s, after `walk`): a cut to the near fence — the five windows in the middle 4:3 (x 0.18…0.82).
- `last_window` (≈ 24 s, by a cut): the windows dark; the two go to Makarskaya's woodpile — `last_window:corner`.
- `neighbor` (≈ 45 s — longer than 30: Sarafanov's and Vasenka's ways on foot): from behind the two; the door,
  Sarafanov comes out, goes to Makarskaya's window (≈ 0.25 of the frame), knocks — `neighbor:knock`; a silhouette in the
  window — `neighbor:answer`; the window goes dark, he goes off along the houses to the right, 2 m in front of them —
  `neighbor:gone`; from behind the shed Vasenka, through the gate to the porch, into the house — `neighbor:vasya`.
- `porch` (≈ 16 s, after `neighbor`): the camera moves over to the porch; Silva on the porch knocks — `porch:knock`; the
  door, the light over the porch, Vasenka in the bright doorway — `porch:open`. The pose for the choice: `vasenka`
  (x ≈ 0.60) and `kitchen` (≈ 0.37).
- `shut` (≈ 14 s, after `porch`): he goes, the door shuts, the bulb goes out — `shut:closed`; Busygin rubs his hands
  (`warm_hands` for `cold`); Silva knocks — `shut:knock`; the light, the door — `shut:again`.
- `in` (≈ 12 s, after `porch`/`shut`): all into the house, the door, the light goes out; in the kitchen window the three
  go to their places — `in:inside`.
- `return` (≈ 25 s, by a cut): later, snow; Sarafanov from the left along the street, through the front garden's gate up
  under his own window — `return:window` (he ≈ 0.3 of the frame on the left, the window on the right, behind the frost
  strangers at his table); he stands 4 s, goes to the porch, opens — `return:door`.
- The action by the key `knock` (1…5 / 0): to window N, a knock — `knock:hit` (0.6 s from the start of the move),
  `knock:done`; 0 — back to Silva. The window itself (the silhouette, going dark) the game sets by the key `winN`.

## What is missing / open

- The beats of IV–V and of the epilogue (`gate`, `evening`, `fire`, `after_fire`, `blame`, `own_up`, `porch_night`,
  `shawl`, `porch_after`, `run_out`, `night_window`), the keys `fire`, `run`, `look_back`, `buckets`, `k4`, the `k*`
  looks by the beat, the insert `shawl` (the world has no module `closeups`) — not done.
- `cold` (arms round himself) — no such motion; `warm_hands` taken.
- The keys `mak_door`, `k4_here` are described, but the beats do not move them.

## Contract for the check

```json
{"beats": {"walk": {"after": [], "tells": ["walk:stop"], "seconds": 27, "show": false},
 "knock_ready": {"after": ["walk"], "tells": [], "seconds": 2, "show": false},
 "last_window": {"after": [], "tells": ["last_window:corner"], "seconds": 24, "show": false},
 "neighbor": {"after": [], "tells": ["neighbor:knock", "neighbor:answer", "neighbor:gone", "neighbor:vasya"], "seconds": 45, "show": false},
 "porch": {"after": ["neighbor"], "tells": ["porch:knock", "porch:open"], "seconds": 16, "show": false},
 "shut": {"after": ["porch"], "tells": ["shut:closed", "shut:knock", "shut:again"], "seconds": 14, "show": false},
 "in": {"after": ["porch", "shut"], "tells": ["in:inside"], "seconds": 12, "show": false},
 "return": {"after": [], "tells": ["return:window", "return:door"], "seconds": 25, "show": false}},
 "points": ["win1", "win2", "win3", "win4", "win5", "kitchen", "vasenka", "busygin", "silva", "sarafanov", "mak_window", "barrel", "shed"],
 "offers": ["win1", "win2", "win3", "win4", "win5", "vasenka", "kitchen"],
 "party": {"warm": 0.36, "frost": 0.25},
 "acts": {"knock": {"values": [0, 1, 2, 3, 4, 5], "tells": ["knock:hit", "knock:done"]}}}
```
