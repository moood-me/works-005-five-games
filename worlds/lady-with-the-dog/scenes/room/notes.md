# A room in Yalta

II.1 of “The Lady with the Dog” (scenes.md, the room in Yalta, the 4th edition). Her room at night: the camera
`picture` from the wall opposite the balcony. On the left, along the wall, the bed with a light bedspread; she sits on its
edge, her hair down, her head bowed; on the right a small table, a candle at its left end — between them; at its right
end his bentwood chair, its back to the wall (sitting, he faces her); the plate with the watermelon and the knife before
him; at the back the open balcony door (its leaves open inward, the tulle stirring), the night sea, the moon and its
path. Awkwardness and tenderness: the warm candle in the middle, the cold moon from the door.

## How it is made

- **The room** — cards of the walls (the back one with the doorway as a hole, the left, the right, the front — seen
  only from the shot “from the balcony”), the ceiling — a card with `tilt` 90, the floor, the tops of the bed and the
  table — planes. All `inside`.
- **Light**: the candle (`candle_l` — the point `candle#flame`, flickering; it burns down by `candle`), the moon
  through the doorway (`moon`), the cold night light from the door (`night_in`). The sky is its own (the night for the
  door); the module `sky` is not needed.
- **The plate** (`watermelon`) — an element in the place `melon_a/d/e`; the script sets the place by `plate` (`table` ·
  `held` · `bed`); in his hands — the cast's part `plate`, the element hidden. After `slice` 1 a red slice on the plate.
- **Inserts** — the module `closeups`: `melon` and `hands`.
- **People**: `anna_hairdown`, `gurov_indoor` (the cast `cast`); `seated_bowed`, `seated`, `sit_down`, `rise`,
  `eat_slow`. They sit by `<id>_on`; on the chair he turns by the key `_turn`. Faces — `anna_mood` / `gurov_mood`.
- **The film** — `lib.js` `film(scene)`, played by the module `beats` (`beat`, `beat_next`). The cuts inside the beats
  are said ahead (`s.shot`). Shots (`CAM`): `ROOM` (the whole room), `EAT` (drawn back: she at the left edge of the 4:3
  window, he at the right, the candle between), `FACE` (her face by the candle, 1.4 m, three-quarter), `BED` (the two on
  the bed, 1.4 m, faces three-quarter), `BALCONY` (from the balcony back into the room: she facing the candle, he in
  profile).

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `room` | — | 12 | out of the dark; she sits, her head bowed; he stands at the table, his back to her |
| `room_hold` | room | 3 | faces: a cut — she by the candle in a medium shot raises her head (`sad`), looks at him; a cut back — he turns to her |
| `melon` | room_hold | 4 | he sits down at the table (facing her); the insert `melon` open |
| `melon_hold` | melon | 3 | the insert closed: a red slice before him, the candle lower — under the choice |
| `melon_eat` | melon_hold | 12 | he eats (`eat_slow`), not looking at her; the camera draws back: they at the edges of the 4:3 window, the candle between |
| `beside` | melon_hold | 9 | he rises with the plate, puts it on the bed, sits down beside her; the insert `hands` open |
| `beside_hold` | beside | 6 | a cut closer (`BED`): `apart` 0 — his hand behind her back, she leans her head to his shoulder; 1 — she a hand's breadth further off, looking at him |
| `confession_table` | melon_eat | 18 | faces: he turns on his chair; a cut to her (`FACE`): she raises her head, her hands to her face, lowers them (`confession_table:speaks`) |
| `confession_bed` | beside_hold | 17 | faces: a cut to `BALCONY` — she straightens, facing the candle, her hands to her face (`confession_bed:speaks`); his hand on her back, he in profile |

Keys: `hour`, `candle`, `melon`, `cut`, `slice`, `ragged`, `hands`, `hand_at`, `pull`, `palm`, `apart`, `plate`,
`beat`, `beat_next`. No keys of the play.

## What is not here / what to know

- The table is set otherwise than in the earlier scene: the candle at the table's left end, his chair at the right,
  facing her (so the candle is between them in `melon_eat` and lights both faces).
- On the bed he sits on her left (toward the headboard): so in the shot “from the balcony” she is nearer and her face
  is not hidden by him.
- `ragged` is read by the insert `melon` (the module `closeups`); the plate in the wide shot paints its slice even.
- `hour` is described, but the light is always the night's.

## Contract for the check

```json
{"beats": {"room": {"after": [], "tells": [], "seconds": 12, "show": false},
           "room_hold": {"after": ["room"], "tells": [], "seconds": 3, "show": false},
           "melon": {"after": ["room_hold"], "tells": [], "seconds": 4, "show": false},
           "melon_hold": {"after": ["melon"], "tells": [], "seconds": 3, "show": false},
           "melon_eat": {"after": ["melon_hold"], "tells": [], "seconds": 12, "show": false},
           "beside": {"after": ["melon_hold"], "tells": [], "seconds": 9, "show": false},
           "beside_hold": {"after": ["beside"], "tells": [], "seconds": 6, "show": false},
           "confession_table": {"after": ["melon_eat"], "tells": ["confession_table:speaks"], "seconds": 18, "show": false},
           "confession_bed": {"after": ["beside_hold"], "tells": ["confession_bed:speaks"], "seconds": 17, "show": false}},
 "points": ["watermelon", "anna", "melon#knife", "melon#from", "melon#to", "hands#his", "hands#her"],
 "offers": ["watermelon", "anna"],
 "party": {}}
```
