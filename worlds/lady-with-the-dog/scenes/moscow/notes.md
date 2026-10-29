# Moscow

III, V and the epilogue of “The Lady with the Dog” (scenes.md, «Москва», the 4th edition — the docs are advice; this is
the truth). A quiet Moscow lane in winter: the first snow; an evening with gas lamps when every woman looks like her;
the window where his wife laughs at “the part of a lady-killer”; the doctors' club and “the sturgeon”; the departure
before dawn; home late, his wife in the doorway; to school by the hand, “three degrees above freezing”; the note brought
by the man in the red cap; the porch at night. Or the thaw instead of the snow, if Anna held out till the spring.

## How it is made

- **The lane** is laid along the distance (lib.js, the numbers in metres): the road across −3.4…1.4, the right pavement
  to the house fronts at 3.6, the left one to the fronts at −5.4. Right, from the viewer: the girls' school behind its
  railings (`gym_fence`, the gate at distance 4.6…5.8, its point `gym_fence#gate`; `gym` behind), the Gurovs' house
  (`house`, 7.6…18.4: the door at 13 on a porch, the window upstairs at 15.4), the neighbour's (`neighbour`, with a
  gateway arch at 20.6 and the yard behind it, `arch`). Left: a long low house (`low`), the baker's (`shop`, its lit
  window `shop_glow`, its door with the shop behind, `shop_in`), the doctors' club (`club`, its portico `club_porch`
  with two lanterns, its door at 23.5 with the lit vestibule behind, `club_hall`). A cross street at 30…38; the lane goes
  on (`row_far_r`, `row_far_l`), a church at its end (`far`). The ground — one plane (`street`), a mirror by `puddles`
  (the thaw). The fronts are cards with `facing` (270 on the right, 90 on the left) and holes cut where the doors and
  the window upstairs open; one painter for all of them (lib.js `PAINT.facade`, `FRONTS`), their lit windows elements
  that glow, faded by keys (`home_windows` by `home`; `windows_r`, `windows_l` by `windows`).
- **The porches**: the land rises under them (relief.js: the Gurovs' steps from the pavement to 0.75; the club's from
  the road to 0.6); a draped plane paints the treads (`porch_steps`, `club_steps`), cards the sides (`porch_side*`,
  `club_side*`, pictures of the land). Behind the doors the floors are unseen planes (`hall_floor` 0.75, `club_floor`
  0.6); upstairs — `upper_floor` (3.9) behind the window upstairs, where the wife stands at it.
- **The window upstairs**: its frame and faint glass (`window_up` — its point is the game's: the wife's voice from the
  window), the curtain (`curtain`, thin: the room's lamp lights it through; `curtain` 1 drawn, 0 open; on it the
  painted shadows of two at a table, `shadows`), the room behind (`room_up`, its lamp — the light `room`, by
  `window_up`).
- **The door**: `door` 0…1 → its leaf's facing `door_f` (one function, `doorFacing`; the script follows the key); the
  hall's lamp (`hall_l`) lights as it opens.
- **The sledges**: each an unseen base turned by its facing with its sides, back and horse on it (the cards stand along
  the base's length: from the lane's slanting shots both sides and the back are seen). Gurov's (`sledge`, `sledge_far`,
  `sledge_back`, `horse` on `sledge_base`) by `sledge_at`: `house` — by the porch, `club` — at the club's kerb, `none`
  — out of the lane (60 m behind the near end); his cabman (a person) on the box. The official's (`sledge2…` on
  `sledge2_base`, its driver painted on the box) by `sledge2_at`: `street` — at the kerb by the baker's, `club` — by
  the portico. Where they are, where one sits and which way — lib.js (`SLEDGE`, `onSledge`, `seatOf`); the script sets
  the base's keys when the `…_at` keys change; the beats' `from` give them too. The horses' breath — particles at
  `horse#nose`.
- **Light**: the world's sky (module `sky`, `follow` in script.js, `keys(hour)` in every `from`); the grey cover of a
  snowy day — its `storm`, the key `overcast`. The gas lamps (copies; each its own light by `lamps`), `lamp2` — the far
  lamp up the lane on the right (its own element: the choice's mark). The porch lamp (`porch`, by `porch_lamp`) lights
  the face of whoever stands in the doorway; the club's lanterns light the faces on its steps. The night look keeps
  ambient 0.5 (blue): with the white snow and the lamps people read at night.
- **The season**: `season` (`winter` · `thaw`) is painted once per change — snow on cornices, sills, roofs, posts,
  limes, the road's trodden snow; or wet iron, brown slush, puddles, grey snow by the walls. The script derives
  `puddles` (the road's mirror) and `drip` (drops from the Gurovs' eaves) from it. `snow` — snow falling; `wet` — wet
  heavy flakes (“three degrees above freezing, and yet it is snowing”, in the thaw too). The beats that read the play's
  `spring` set `season` from it.
- **People**: `gurov` (`gurov_winter`), `wife` (`wife`; in `porch_go` her look `wife_shawl` by `wife_wear`),
  `daughter` (satchel), `official`, `yardman` (the valise, gait `carry_walk`), `redcap` (the note), `shade1…4`, `cabman`.
  Motions from the cast: `stroll`, `walk_child`, `run`, `sit_down`, `seated`, `laugh_stand`, `stand_cold`,
  `give_small`, `take_small`, `carry_walk`. No new motion was needed.

## Shots (lib.js `CAM`)

`STREET` — down the lane at a slant from its near end (the school's gate ≈ 5 m, the official's sledge by the baker's
≈ 7, the Gurovs' porch ≈ 13, the cross street ≈ 30): “The shadow”, “By the hand”. `PORCH` — the Gurovs' house from the
road, a little below (door, window upstairs, the sledge). `CLUB` — the portico ≈ 5–6 m, the sledges along the kerb
beyond it, the far lamp up the lane. Faces: `TWO` — the official in his sledge turned back to Gurov on the bottom step,
both in profile (worked out from where they are: `twoShot`); `DOOR` — the wife on the threshold and Gurov a step below,
from along the house front, the porch lamp before their faces; `WIFE` — her face close, three-quarter; `GATE` — Gurov at
the school's gate, three-quarter, the girl at the gate; `NEAR` — the gate end of the lane, the messenger crossing it.

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `first_snow` | — | 13 | morning, the first snow; `PORCH`; he comes out, lifts his face to the snow (profile) — `first_snow:out` —, goes down to his sledge and gets in |
| `evening_walk` | — | 4 | evening, lamps, snow; `STREET`; he at the lane's far end — under “The shadow” |
| `table_window` | — | 19 | `PORCH`: he comes up the steps; `look_back` 1 — turns on the top step and looks up the lane (profile, under the porch lamp); goes in (`table_window:lit`); the window upstairs lit, the shadows of two on its curtain |
| `club` | — | 10 | night; `CLUB`; he and the official come out onto the portico (`club:out`); he turns to the official |
| `say` | club | 13 | the official sits down in his sledge, turns back; a cut to `TWO` (`say:turns`): faces under L51–L53, Gurov thinking; back to `CLUB` — under the choice |
| `laugh_sit` | say | 11 | he laughs, goes to his sledge and gets in |
| `say_walk` | say | 10 | he walks away past his sledge toward the far lamp (`say_walk:off`); the cabman turns after him |
| `porch_go` | — | 15 | before dawn; the yard porter carries the valise to the sledge; the wife in her shawl in the lit doorway; a cut to `DOOR` (`porch_go:turns`) — faces; back to `PORCH`, he gets into the sledge |
| `home_late` | — | 12 | night, snow or the thaw; he comes up the steps; the door opens (`home_late:door`), the wife in it; a cut to `DOOR` — under L84 and the choice |
| `wife_lie` | home_late | 8 | her face level; she steps back; `PORCH`; he goes in (`wife_lie:in`); the door shuts; the window upstairs goes dark |
| `wife_truth` | home_late | 16 | a cut to `WIFE`: her face, sad, still (L86, L87); she steps back; `PORCH`: he goes in; she in the door looks out at the snow, shuts it (`wife_truth:door`); the window upstairs stays lit |
| `school` | — | 7 | morning, wet snow (the thaw: puddles); `PORCH`; he and the daughter come out; `wife_knows` 1 — the wife at the lit window upstairs, watching them; 0 — its curtain drawn |
| `walk_hand` | school | 2 | a cut to `STREET`: the two at the porch's foot, hand in hand, toward us — under “By the hand” |
| `gate_school` | walk_hand | 8 | (they come up to the gate if they have not); a cut to `GATE`: she lets go; `wave` 0 — runs in without looking back; 1 — turns at the gate, waves, runs in; he stands, his face |
| `red_cap` | gate_school | 16 | a cut to `NEAR`: the messenger in the red cap crosses to him, gives the note (`red_cap:note`), goes |
| `porch_end` | — | 10 | the epilogue: night, snow or the thaw; `PORCH`; `wife_knows` 1 — the wife at the lit window upstairs; 0 — the house dark but the porch lamp |

Between the beats (script.js), what the game's minigames move:
- **“The shadow”** (after `evening_walk`): `walk_on` N (1…4) — Gurov strolls to stop N (lib.js `STOPS`: 22, 17, 10,
  7.8 m along the right pavement) and the scene tells `evening_walk:stopN`; `shadeN` 1 — a woman comes out ahead of
  his stop (from the arch under the lamp, the baker's door by its lit window, behind the official's sledge, the
  school's gate) and stands with her back to us (`stand_cold`); 2 — she turns: a stranger's face in profile, and goes;
  0 — gone. Her head — `shadeN#head` — is in the 4:3 window while she stands (worked out for `STREET`: −0.08, −0.50,
  −0.49, +0.32 of the frame's height across).
- **“By the hand”** (after `walk_hand`): `go` 1 — they walk on to the gate (he at her pace, `walk_child`, hand in
  hand); 0 — they stand, she lifts her face to him; `walked` (0 at the porch's foot … 1 at the gate) — set at once as
  the daughter's place moves. The mark's point: `daughter#hand_r`.

Keys: `hour`, `overcast`, `season`, `snow`, `wet`, `lamps`, `porch_lamp`, `windows`, `home`, `door`, `window_up`,
`curtain`, `shadows`, `sledge_at`, `sledge2_at`, `walk_on`, `shade1…4`, `gurov_look`, `look_back`, `go`, `walked`,
`wave`, `beat`, `beat_next` (the rest are internal — `states` says which); the play's — below.

## What is not here / what to know

- The lane is laid for its own shots, not as scenes.md's sideways panorama: the camera is `panorama` (span −4…4) but
  every shot is set by the camera's keys.
- The club is on the same lane, up from the Gurovs' house on the other side; the official's sledge waits by the baker's
  in the evening walk (the “second sledge” of scenes.md) and by the portico at night.
- `sledge_at` has a third value, `none` (scenes.md has `house` and `club`): in the evening walk and the morning to school
  his sledge is not in the lane.
- Not the docs' `PORCH_CAM` from the pavement: from the road (the pavement is too narrow to see the window upstairs from
  it). The faces at the door are a shot of their own (`DOOR`), not the operator's `camera_target`: two people in one
  frame, both lit by the porch lamp.
- The shadows on the curtain are painted (a layer that stirs a little), not people.
- `table_window`, `say`, `red_cap` are longer than the docs' estimates (the steps, the walk to the sledge, the walk
  away): the contract says the truth.
- The lit windows are separate cards that glow (their alpha by a key); a wall's painting is never repainted for them.

## Contract for the check

```json
{"beats": {"first_snow": {"after": [], "tells": ["first_snow:out"], "seconds": 13, "show": false},
           "evening_walk": {"after": [], "tells": ["evening_walk:stop1", "evening_walk:stop2", "evening_walk:stop3", "evening_walk:stop4"], "seconds": 4, "show": false},
           "table_window": {"after": [], "tells": ["table_window:lit"], "seconds": 19, "show": false},
           "club": {"after": [], "tells": ["club:out"], "seconds": 10, "show": false},
           "say": {"after": ["club"], "tells": ["say:turns"], "seconds": 13, "show": false},
           "laugh_sit": {"after": ["say"], "tells": [], "seconds": 11, "show": false},
           "say_walk": {"after": ["say"], "tells": ["say_walk:off"], "seconds": 10, "show": false},
           "porch_go": {"after": [], "tells": ["porch_go:turns"], "seconds": 15, "show": false},
           "home_late": {"after": [], "tells": ["home_late:door"], "seconds": 12, "show": false},
           "wife_lie": {"after": ["home_late"], "tells": ["wife_lie:in"], "seconds": 8, "show": false},
           "wife_truth": {"after": ["home_late"], "tells": ["wife_truth:door"], "seconds": 16, "show": false},
           "school": {"after": [], "tells": [], "seconds": 7, "show": false},
           "walk_hand": {"after": ["school"], "tells": [], "seconds": 2, "show": false},
           "gate_school": {"after": ["walk_hand"], "tells": [], "seconds": 8, "show": false},
           "red_cap": {"after": ["gate_school"], "tells": ["red_cap:note"], "seconds": 16, "show": false},
           "porch_end": {"after": [], "tells": [], "seconds": 10, "show": false}},
 "points": ["gurov", "wife", "official", "window_up", "sledge", "lamp2", "shade1#head", "shade2#head", "shade3#head", "shade4#head", "daughter#hand_r", "gym_fence#gate"],
 "offers": ["sledge", "lamp2", "wife"],
 "party": {"wife_knows": 0, "spring": 0}}
```
(`evening_walk:stopN` are told after the beat, as “The shadow” moves `walk_on`.)
