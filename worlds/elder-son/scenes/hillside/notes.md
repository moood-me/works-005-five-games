# The Hillside

Chapter III, “The March”: the suburban cemetery on its slope, dusk; at its foot the road to the railwaymen's club. Engine 3,
the camera `roam` (the sky all round: the meeting's shot is turned by 41°, and `panorama` paints no sky beyond ≈ 65°), set by
the keys `camera_x/z/yaw/h`; the eye line lower in the frame (`horizon` 0.62); `camera_pitch` is used only in the cut to the two by the birch (it looks down on them, `march`).
Modules: `cast`, `beats`, `houses`. `scene.json`, the crosses, the grave railings, the birches are written by the generator
`tools/hillside/gen.mjs` from `lib.js` (the club's own parts are hand-written `elements/club_*.js`).

## How it is made

- **The ground** (`lib.height`, `relief.js`): level by the road; beyond the fence the slope up to the crest (≈ 6.2 m at
  31–34 m), beyond it down to a level field by 56 m. Further — the flat field `beyond`, the far forest `forest` (165 m);
  across the road — the field `behind` and the settlement `suburb` (105 m back: roofs, lit windows, a water tower, the
  station's lamp).
- The road along distance 4.8; a picket fence along 7 (6-metre spans as copies), **the gate** `gate` at across 8 —
  brick posts, a lamp by it (`gate_lamp`: the light on the faces at the gate); a thick **birch** `birch` by the fence (−3.2),
  Nina hides behind it; 34 crosses, 16 grave railings, 9 obelisks, birches — copies on the slope.
- **The grave** `grave` (−1, 26.6): a mound, a temporary obelisk, wreaths. **The path** zigzags from the grave to the
  gate (`lib.PATH`), three strips of ice at 0.3, 0.55, 0.8 of the way — painted on the ground.
- **The funeral**: the mourners `mourner1…4` at the grave, the three brass `band1…3` (trumpet, tuba, drum) in a row on
  the right, Sarafanov (`sarafanov_funeral`: a black coat, a hat, a long light scarf, a clarinet in his lowered hands)
  at the row's end, by the grave; all with their backs to us. The case lies on the snow before him (`case_snow`,
  `case_down`).
- **The club** `club` (anchor; across 55.5, its front on distance 9): a log house — wall, roof, two gables, three lit
  windows `club_win1…3` (their light), the door `club_door` (the leaf turned by `club_door` → `club_door_f`, the script
  sets it), the hall `club_hall` behind it, the sign `club_sign`, the steps `club_steps` and the landing `club_landing`
  (planes people walk on), the lamp `club_lamp`. The light `club_spill` (by `club_door`) pours out on the snow when the door
  is open. The road ends at the steps (`lib.ROAD_A1` 53.5).
- The light: a dusk sky (low, lilac-grey, a red band in the west), the sunset light `sunset` low on the left,
  `sky_light` from above; `hour` → the look `dusk` (it grows dark).
- **Faces.** Everybody has the face `simple`; the expression — `<id>_mood`, set by each beat. The moments of faces: `road`
  (Nina `tired`, Busygin `thinking`, the camera at the side, both in profile), `march` (the cut to the two by the birch from
  the slope beyond the fence, a little above it — three quarters, looking up, Nina `sad`, Busygin `surprised`, and back), `meet` (the cut to the head of the path, the father `afraid` →
  `smile`, both ≈ 0.45 of the frame, the camera `CAM.meet` centred on the two), `hide` (the two behind the fence, their faces over its pickets, `afraid`/`thinking`, the father coming down past the lens), `bottom` (face to face in profile at the gate, the father
  `smile`/`laugh`), `club` (the two in profile, Nina `smile`, Busygin `sad`, in the door's light). The father among the
  brass: his light scarf and his small height; the camera comes up in `alone`.

## Beats (`lib.film(scene)`, played by the world's `beats`)

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| `road` | — | along the road from the left Nina and Busygin, the camera beside them (as far as he walks); the group seen up the slope; they stop at the fence by the birch | `road:fence` | 14 |
| `march` | `road` | the camera behind their backs (both ≈ 0.3 of the frame); at 3 s the cut to the two, their faces, and back at 13 s; at the end the mourners turn and go over the crest | `march:end` | 24 |
| `alone` | `march` | the brass go after them (hidden by the crest); the camera slowly to the fence; he puts the clarinet in its case (`put_down`), picks the case up (`pick_up`); he stands at the top of the path. The pose for the choice: `sarafanov` (x ≈ 0.54) and `nina` (≈ 0.33) in the middle 4:3 | `alone:case` | 18 |
| `meet` | `alone` | Nina behind the birch; Busygin through the gate up the path (the cut at 4 s to the head of the path, where the father stands: the son comes up to him) until both are in profile a step apart; the father puts the case behind his back (`hide_back`); Busygin takes the case | `meet:talk`, `meet:ready` | 27 |
| `bottom` | — | at the gate's foot on the road, face to face; with `snowy` 1 snow on his coat (`snow_back`), his back to us he brushes it (reach to his own `#back`) and laughs; he takes the case (`take`), goes off right along the road; Nina walks from the birch along the fence to Busygin (seen from the first seconds) | `bottom:gone` | 13 |
| `hide` | `alone` | the cut to the slope: the two stand in the lee of the gate's left post, looking up; he comes down the path by himself, onto the road, and stands turned right (`sar_at` ≈ 0.03). Under “Following” | `hide:ready` | 19 |
| `club` | — | the cut before the club (`from`: `sar_go` 0, `sar_at` 1, `follow`/`follow_at` where Busygin stands, `hold` 0, `duck` 0); he climbs the steps; with `seen` 1 he turns on the landing and looks down the road for long (`look_back`); the door opens (`club_door` 1: the light `club_spill` falls on the road and on the two), he goes in, it shuts. Both in the middle 4:3 | `club:in` | 12 |

`hide` cannot be 8 s: 25 m of path on foot, in his gait (≈ 19 s). Seconds are measured on the showcase.

## The mini-games' keys (script.js)

- **“Arm in Arm”.** `down` — where the game wants the pair on the path (0 the grave, 1 the gate), `down_at` — where they are
  (the scene sets it ten times a second from the father's place on the path, `lib.pathU`). While `down` is ahead of
  `down_at` the two walk (the gait `careful`; the father on the path, Busygin at his left, his right hand reaching
  `sarafanov#shoulder_l`), the camera goes with them (`lib.downCam`); when it is not they stand. They are stopped at each of
  the three ice strips: the father slips (`falter`, `down:slip` as it begins) and holds the pose. `catch` 1 — Busygin's hands
  on him (`#shoulder_l`, `#back`); `fall` 1 — he sits in the snow (`fall_sit`), `fall` 0 — he gets up (`rise`: there is no
  `rise_ground`). Only then does the game move `down` on again. The path is done at the gate (the script ignores `down` below
  the road's edge).
- **“Following”.** `sar_go` 1 — the father walks the road from the gate to the steps (`lib.roadAt`: `sar_at` 0…1, across
  6.2…53.5), the camera along the road (`lib.trailCam`); at `sar_at` 0.25, 0.5, 0.75 he stops and looks back (`look_back`;
  `sar_go:look` as his head begins to turn); 0.6 s on, if `hold` is 1, he stands looking 2 s more; `sar_go:on`, he goes on;
  at the steps `sar_go:club`. `follow` ahead of `follow_at` (Busygin's place on the road) — Nina and Busygin walk;
  `duck` 1 — they crouch (`crouch`), 0 — `crouch_rise`.
- `snowy` and `seen` are set by the game before `bottom` and `club`; the beats read them.

## What is not as wanted

- The motion `careful` leans both bodies far to one side — as it was made; `rise_ground` is not put (`rise` — from a chair —
  gets him up from the snow); `take`, `look_back`, `falter`, `fall_sit`, `crouch`, `crouch_rise` are used as they are in
  `cast.data.json`.
- The father's face in the black funeral coat and a hat is dark in `bottom` and `meet`: lit only by the sky and the lamp.

## Contract for the check

```json
{"beats": {"road": {"after": [], "tells": ["road:fence"], "seconds": 14, "show": false},
 "march": {"after": ["road"], "tells": ["march:end"], "seconds": 24, "show": false},
 "alone": {"after": ["march"], "tells": ["alone:case"], "seconds": 18, "show": false},
 "meet": {"after": ["alone"], "tells": ["meet:talk", "meet:ready"], "seconds": 27, "show": false},
 "bottom": {"after": [], "tells": ["bottom:gone"], "seconds": 13, "show": false},
 "hide": {"after": ["alone"], "tells": ["hide:ready"], "seconds": 19, "show": false},
 "club": {"after": [], "tells": ["club:in"], "seconds": 12, "show": false}},
 "points": ["sarafanov", "nina", "busygin", "gate", "sarafanov#shoulder_l"],
 "offers": ["sarafanov", "nina"],
 "party": {},
 "acts": {"down": {"values": [], "tells": ["down:slip"]},
  "sar_go": {"values": [0, 1], "tells": ["sar_go:look", "sar_go:on", "sar_go:club"]}}}
```
