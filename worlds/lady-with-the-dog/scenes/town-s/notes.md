# The town of S.

III.2, IV and the epilogue of “The Lady with the Dog” (scenes.md «Город С.», the 4th edition): Old Gontcharny Street,
the long grey fence with nails along its top, the gate, von Diderits' house behind it with her window upstairs, the
road at the fence's end out into the fields toward the station. Late autumn at dusk, a grey winter day, a winter dusk,
the morning she goes (snow or thaw), the epilogue's evening. Modules: `cast`, `spitz`, `closeups`, `beats`.

## How it is made

- **The camera** `panorama`, `span` [−8, 20]; the shots are the camera's keys (`lib.js` `CAM`): `FENCE` (straight at
  the fence: Gurov 0.29 of the frame, the five places in the 4:3 window), `GATE` (a little back and left: the corner
  and the gate both in the window — the choice), `WALK` (along the fence toward its end: “The leash”), `ROAD`,
  `ROAD_FACE`, `GATE_TWO`, `FENCE_FACE`, `DUSK_WIDE`, `DUSK_FACE`, `LEAVE`, `LEAVE_TWO`, `ANNA_FACE`, `HIS_FACE`, `YARD`,
  `PORCH`, `HER_GATE` (her face beside her husband, 1.1 m, she looking up at him — under her choice), `END_GATE` (the
  epilogue at the gate, a little nearer than `FENCE`), `POSTER` (over Gurov's right shoulder: “The Geisha” under the
  lantern — under the line about the poster); and `gateTwo(under)` — Gurov (three-quarter) and the maid with
  the spitz at their feet, medium, from the street — under “call / step round the corner”. Each shot also turns the spitz's card to its camera (`spitz_face` = yaw + 180, spitz.md).
- **The place** (metres in `lib.js`): the fence's face at z 7.0, 2.4 m, from its corner x −5.0 (it turns back along a
  lane) to its end x +14; the near stretch is its own element `fence` (x −5…6.5: the gate's opening at 2.4…3.4, the
  posts, all its points), the rest copies (`fence_far`, also the neighbours' fence left of the lane; `fence_side` along
  the lane and at the end). The gate's leaf (`gate` → `gate_f`) opens into the yard; the lantern on its right post; the
  poster (“The Geisha”, `tr`) under it at x 4.4. The house at z 14.5 with her window over x 1.15 (`window`: lit or
  dark, its light `window_l`); the porch (2.9, 13.9); bare trees; the near side of the street (palings at z −1.6) for
  the shots looking back; the road from x 16.6 into the fields; the railway bank at z 120 and a lit train along it
  (`far_train` → `far_train_a`, a red tail light, smoke).
- **The season** — `season` (`autumn` · `winter` · `thaw`), set at a cut: the ground, the street (the thaw's and the
  autumn's wet street mirrors by `wet_k`, puddles painted on it), the fence's top and foot, the roofs, the trees. The
  hour — `hour` with the looks `dusk`, `morning` and the low sun `sunset` (ahead-right, toward the station); the sky is
  the scene's own element, painted for its state all the way round. Falling snow `snow`; autumn leaves blowing `wind`; in the thaw drops fall from the house's eaves (`drip`: particles `drops` born along a line under the eave, `on` the house, splashing on the ground).
- **The keys of the mini-games** are walked by the script: `anna_to` (“The leash”: Anna goes along the fence — toward
  its end with `pulled_walk`, back toward the gate at her own pace; only while the beat is `autumn_walk`), `walk_to`
  (“By the fence”: Gurov to a place; only while the beat is `fence_wait`); their places are told back at once —
  `anna_at` (0 the gate … 1 the fence's end, x 2.9 … 13.5) and `gurov_at` (0 … 1 ↔ x −4.37 … +4.83 at z 6.3; the
  places p1…p5 at 0.1, 0.3, 0.5, 0.6, 0.85; her window over 0.6). The marks of the places are on the fence low
  (0.45 m), p4 high (1.95 m): with all five and his head inside the 4:3 window, p3 and p4 would otherwise be nearer
  than 0.15 of the window.
- **The spitz** (module `spitz`) follows whoever leads it (`dog_follow`, `dog_lead`): the script keeps it 1.1 m ahead
  of them and a little to the street's side as they walk; it faces the way it goes and steps by its own speed (the
  module); the beats move it themselves where it runs (`scene.path`). Old (`spitz_old` 1) in winter.
- **People** (`cast`): `anna` (`anna_autumn` / `anna_winter` by `anna_wear` in each beat's `from`), `gurov`
  (`gurov_winter`), `diderits` (`diderits_coat`; the parts `coat_carried` → her `coat_over`, `envelope`), `maid`,
  `cabman`. The close-up `inkwell` — the module `closeups`.
- **The film** — `lib.js` `film(scene)`, played by `beats`; the cuts inside beats said ahead (`s.shot`).

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `autumn_walk` | — | 12 | late autumn at dusk, `WALK`; she comes out of the gate with the spitz and walks along the fence to `anna_at` 0.3 — under L47 and “The leash” |
| `road_end` | — | 10 | a cut: the road beyond the fence's end, she stands, the spitz sits; a train far off on the bank (`road_end:train`); `ROAD_FACE` — her profile |
| `gate_home` | autumn_walk | 13 | she goes back to the gate from where she is (after `road_end` — a cut, she by the gate); he comes out with his coat; `GATE_TWO` — he puts it on her shoulders (`gate_home:coat`), his kind face, hers past him; they go in |
| `inkwell` | — | 6 | the close-up of the inkstand — under L59 |
| `fence` | — | 13 | a grey winter day; Gurov comes along the fence to p1, looks at it (`fence:stops`); `FENCE_FACE` — tired; back to `FENCE` |
| `fence_wait` | fence | 2 | he stands at p1 facing the fence, her window lit — under “By the fence” |
| `gate_open` | — | 9 | a cut, `GATE`: Gurov under her window (`under` 1) or by the far end; the maid comes out with the old spitz — by him (1) or a few steps toward the corner (0); he turns to her; `gateTwo` — the spitz sniffs — the choice (`spitz`, `gurov`) |
| `call_run` | gate_open | 11 | he stoops and beckons; the spitz runs to him dragging the maid two steps, paws on his knees; a medium shot of the maid looking long at him |
| `call_bark` | gate_open | 10 | it barks and backs away; the maid looks at him and leads it in at the gate |
| `corner_hide` | gate_open | 12 | (a cut back to `GATE`: the corner) he steps round the corner into the lane; they come by; the spitz sniffs at the corner — (`dog_pat` 1) strains to it, up on its hind legs, pulled away; they go on |
| `fence_dusk` | — | 12 | dusk, `DUSK_WIDE`: he walks to the poster under the lantern; `POSTER` (`fence_dusk:poster`) — under L64; `DUSK_FACE`, sad — under L65 |
| `gate_leave` | — | 8 | a morning (`spring`: snow / thaw), `LEAVE`: she with her bag at the gate, he in it; the maid and the spitz by the porch through the gate; the cabman at his horse with his back to them; `LEAVE_TWO` — the two in three-quarter (`gate_leave:asks`), she looks up at him; `HER_GATE` — her face — the choice (`anna`) |
| `leave_lie` | gate_leave | 20 | (a cut back to `LEAVE_TWO`) the envelope (`leave_lie:envelope`), he kisses her hand; `ANNA_FACE`; `YARD` — she strokes the sitting spitz; `PORCH` — she goes to the cab (`leave_lie:goes`); (talk 1) he looks after her at the gate, (0) goes into the house |
| `leave_truth` | gate_leave | 22 | (a cut back to `LEAVE_TWO`) she comes close (`leave_truth:close`); `HIS_FACE` — still (talk 1: `leave_truth:still`), he answers looking down and away (`leave_truth:answer`); `PORCH` — he takes the leash from the maid himself; the spitz strains after her up on its hind legs (`leave_truth:pulls`); she goes |
| `fence_end` | — | 12 | the epilogue's evening, the lantern; (husband_knows 0) he walks the old spitz along the fence; (1, `END_GATE`) stands at the gate with it, looks down at it, then turns his back to us and looks up at her window, dark |

Keys: `hour`, `season`, `dusk`, `morning`, `sunset`, `lamp`, `window`, `snow`, `wet_k`, `wind`, `gate` (`gate_f`),
`far_train` (`far_train_a`), `drip`, `inkwell`, `cab`, `dog_follow`, `dog_lead`, `anna_to`, `anna_at`, `walk_to`, `gurov_at`,
`under`, the spitz's keys, `beat`, `beat_next`; of the play — below.

## Differences from scenes.md, and what to know

- “The leash” is in `WALK` (from across the street toward the fence's end), not `FENCE`: `FENCE` does not hold her
  from the gate to the end. She is 0.27 of the frame by the gate, 0.12 at the end (the end of the game is there).
- The places' marks are on the fence (p4 high), not on his walking line.
- The morning she goes, Anna's winter look is given a grey-blue travelling coat (`travelCoat()` in `lib.js`, over
  `anna_winter`; the cap stays white): in the pale grey one she vanished against the snow and the white street behind
  her face (a playthrough, 2026-10-30).
- The cabman stands by the sledge (x 10.15), not at the horse's head: there he hid the horse's head and chest, and
  from `LEAVE` the cab read as a sledge without a horse (2026-10-30).
- `gate_open` is cut with Gurov already where `under` puts him (the game sets `under` after “By the fence”).

## Contract for the check

```json
{"beats": {"autumn_walk": {"after": [], "tells": [], "seconds": 12, "show": false},
           "road_end": {"after": [], "tells": ["road_end:train"], "seconds": 10, "show": false},
           "gate_home": {"after": ["autumn_walk"], "tells": ["gate_home:coat"], "seconds": 13, "show": false},
           "inkwell": {"after": [], "tells": [], "seconds": 6, "show": false},
           "fence": {"after": [], "tells": ["fence:stops"], "seconds": 13, "show": false},
           "fence_wait": {"after": ["fence"], "tells": [], "seconds": 2, "show": false},
           "gate_open": {"after": [], "tells": [], "seconds": 9, "show": false},
           "call_run": {"after": ["gate_open"], "tells": [], "seconds": 11, "show": false},
           "call_bark": {"after": ["gate_open"], "tells": [], "seconds": 10, "show": false},
           "corner_hide": {"after": ["gate_open"], "tells": [], "seconds": 12, "show": false},
           "fence_dusk": {"after": [], "tells": ["fence_dusk:poster"], "seconds": 10, "show": false},
           "gate_leave": {"after": [], "tells": ["gate_leave:asks"], "seconds": 8, "show": false},
           "leave_lie": {"after": ["gate_leave"], "tells": ["leave_lie:envelope", "leave_lie:goes"], "seconds": 20, "show": false},
           "leave_truth": {"after": ["gate_leave"], "tells": ["leave_truth:close", "leave_truth:still", "leave_truth:answer", "leave_truth:pulls"], "seconds": 22, "show": false},
           "fence_end": {"after": [], "tells": [], "seconds": 12, "show": false}},
 "points": ["anna#hand_l", "gurov#head", "fence#p1", "fence#p2", "fence#p3", "fence#p4", "fence#p5", "fence#left", "fence#right", "fence#corner", "fence#poster", "spitz", "diderits"],
 "offers": ["spitz", "gurov", "anna"],
 "party": {"spring": 0, "talk": 0, "husband_knows": 0, "dog_pat": 0}}
```
