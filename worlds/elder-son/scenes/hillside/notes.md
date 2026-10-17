# The Hillside (opus)

Chapter III, “The March”: the suburban cemetery on its slope, dusk. Engine 3, the camera `roam` (the sky all round: the
meeting's shot is turned by 41°, and `panorama` paints no sky beyond ≈ 65°), set by the keys `camera_x/z/yaw/h`; the
camera has no tilt (`camera_pitch`) — the eye line lower in the frame (`horizon` 0.62). Modules: `cast`, `houses`.
`scene.json` and the crosses, the grave railings, the birches are written by the generator `tools/hillside/gen.mjs`
from `lib.js`.

## How it is made

- **The ground** (`lib.height`, `relief.js`): level by the road; beyond the fence the slope up to the crest (≈ 6.2 m at
  31–34 m), beyond it down to a level field by 56 m. Further — the flat field `beyond`, the far forest `forest` (165 m);
  across the road — the field `behind` and the settlement `suburb` (105 m back: roofs, lit windows, a water tower, the
  station's lamp).
- The road along distance 4.8; a picket fence along 7 (6-metre spans as copies), **the gate** `gate` at across 8 —
  brick posts; a thick **birch** `birch` by the fence (−3.2), Nina hides behind it; 34 crosses, 16 grave railings, 9
  obelisks, birches — copies on the slope (their places — the generator's, clear of the path and the grave).
- **The grave** `grave` (−1, 26.6): a mound, a temporary obelisk, wreaths. **The path** zigzags from the grave to the
  gate (`lib.PATH`), three strips of ice at 0.3, 0.55, 0.8 of the way — painted on the ground.
- **The funeral**: the mourners `mourner1…4` at the grave, the three brass `band1…3` (trumpet, tuba, drum) in a row on
  the right, Sarafanov (`sarafanov_funeral`: a black coat, a hat, a long light scarf, a clarinet in his lowered hands)
  at the row's end, by the grave; all with their backs to us. The case lies on the snow before him (`case_snow`,
  `case_down`).
- The light: a dusk sky (low, lilac-grey, a red band in the west), the sunset light `sunset` low on the left,
  `sky_light` from above; `hour` → the look `dusk` (it grows dark).

## Beats

- `road` (≈ 15 s, by a cut): along the road from the left Nina and Busygin, the camera beside them (as far as he walks);
  the group seen up the slope; by the fence at the birch they stop — `road:fence`.
- `march` (≈ 24 s, after `road`): the camera behind their backs (both ≈ 0.3 of the frame), the funeral up the slope
  (≈ 0.06–0.07); at the end the mourners turn and go over the crest — `march:end`.
- `alone` (≈ 25 s, after `march`): the brass go after them (hidden by the crest); the camera slowly to the fence; he
  puts the clarinet in its case (`put_down`), picks the case up (`pick_up`) — `alone:case`; he stands at the top of
  the path. The pose for the choice: `sarafanov` (x ≈ 0.54) and `nina` (≈ 0.33) in the middle 4:3.
- `meet` (≈ 18 s, after `alone`): Nina behind the birch; Busygin through the gate up the path; the camera through the
  gate up the slope (`scene.path`) to where both are in profile a step apart (≈ 0.33 of the frame); the father puts the
  case behind his back (`hide_back` — hands behind the back) — `meet:talk`; Busygin takes the case (`reach`, then the
  case is his) — `meet:ready`.
- `hide` (≈ 26 s, after `alone`): the two step back into the shadow of the gate's left post; he comes down the path by
  himself (in an ordinary gait — there is no `careful`), out onto the road and to the right — `hide:ready`. The aim of
  8 s cannot be met: 25 m of path on foot.

## What is missing / open

- The beats `bottom`, `club`, the mini-games “Arm in Arm” (`down`, `catch`, `fall`, `falter`) and “Following” (`follow`,
  `sar_go`, `hold`, `duck`), the railwaymen's club on the right — not done.
- No motions `careful`, `take`, `look_back`, `falter`, `fall_sit`, `crouch`; `hide_back` — a ready motion, “hands behind
  the back”: the case in the right hand ends up behind the back.

## Contract for the check

```json
{"beats": {"road": {"after": [], "tells": ["road:fence"], "seconds": 15, "show": false},
 "march": {"after": ["road"], "tells": ["march:end"], "seconds": 24, "show": false},
 "alone": {"after": ["march"], "tells": ["alone:case"], "seconds": 25, "show": false},
 "meet": {"after": ["alone"], "tells": ["meet:talk", "meet:ready"], "seconds": 18, "show": false},
 "hide": {"after": ["alone"], "tells": ["hide:ready"], "seconds": 26, "show": false}},
 "points": ["sarafanov", "nina", "busygin", "gate"],
 "offers": ["sarafanov", "nina"],
 "party": {},
 "acts": {}}
```
