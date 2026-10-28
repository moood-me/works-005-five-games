# cast — the people of “The Elder Son”

Figures of shapes in the world's style `winter`: from `shadow` (a slender body, hands with fingers), but the head bigger
(×1.3), the neck shorter, the arms and legs fuller — the face reads in a medium shot. The paint `toned`: the light of a
lamp, a window, a street lamp falls on the face and chest, on the dark side a shadow; **not a silhouette**. No lines.
Everyone's face is `simple` (eyes, brows, nose, mouth), the expression — the key `<id>_mood` (`neutral`, `smile`,
`laugh`, `sad`, `angry`, `surprised`, `afraid`, `disgusted`, `thinking`, `tired`). Each has something of their own:
Sarafanov — lines at the eyes, grey brows (`f_sarafanov`); Nina — straight brows (`f_nina`); Vasenka — tufts down on
the forehead (the hair `tufts`); Silva — a thin moustache (`f_silva`); Kudimov — a square chin (`f_kudimov`); the old
woman in the sheepskin — lines (`f_old`).

In a scene: `"modules": ["cast"]`, on a person `"person": {"cast": "cast", "who": "nina"}`. A look for a while — the
key `<id>_wear` = the look's **object** (`scene.kit.cast.characters.sarafanov_home`), not its name. A part in the
hands — `<id>_with: ["bucket"]` (the look's own parts are replaced by this list: `sarafanov` has `long_scarf` — with a
bucket write `["long_scarf", "bucket"]`); `null` — the look's parts.

## Looks (27)

| id | who | how |
| --- | --- | --- |
| `busygin` | Busygin | tall (1.83 m), a long dark grey coat, a light scarf, no hat |
| `busygin_shirt` | he, at home | a dark sweater, a shirt's light collar |
| `silva` | Silva | stocky, a brown coat with check stripes, a hat tipped aside, a gaudy (ginger) scarf, a thin moustache |
| `silva_shirt` | he, at home | a jacket, a light collar, no hat |
| `silva_burnt` | he, after the fire | `silva` + a scorched left sleeve (`burnt_sleeve`) |
| `sarafanov` | Sarafanov | small (1.62 m), thin, an old dark coat, a long light scarf (`long_scarf`), a fur hat |
| `sarafanov_hat` | he, coming in | no hat, the hat in his right hand (`hat_hand`) |
| `sarafanov_nohat` | he, on the platform | the coat open over a brown cardigan, no hat, the scarf |
| `sarafanov_home` | he, at home | a brown knitted cardigan, a shirt's collar, grey-haired |
| `sarafanov_best` | he, in his best | a dark jacket, a white shirt, a tie (`tie`) |
| `sarafanov_funeral` | he, at the funeral | a black coat, a hat, a light scarf, a clarinet in his lowered hands (`clarinet_low`) |
| `nina` | Nina | a coat with a fur collar (`fur_collar`), no hat, a plait |
| `nina_home` | she, at home | a dark dress; a shawl on the porch — `_with: ["shawl"]` |
| `vasenka` | Vasenka | lanky, thin, a quilted jacket open (the sweater seen), tufts |
| `vasenka_home` | he, at home | a grey sweater |
| `kudimov` | Kudimov | a greatcoat with two rows of buttons, an ushanka with a star, broad shoulders |
| `kudimov_in` | he, in the house | a tunic, a belt with a buckle (`belt`), no hat |
| `makarskaya` | Makarskaya | a red-brown coat, a light headscarf, dark boots |
| `neighbor1` | the neighbour | a quilted jacket, an ushanka |
| `neighbor2` | the neighbour woman | a sheepskin coat, a headscarf |
| `band1`, `band2`, `band3` | the brass | black coats, hats; trumpet / tuba / drum |
| `mourner1…mourner4` | the mourners | dark coats, headscarves; `mourner2` — an old woman in a sheepskin |

## Parts (`<id>_with`), their points

A part's point — `"<id>#<point>"` (for `look`, `reach`, the light, the camera).

| part | what | point |
| --- | --- | --- |
| `case` | the clarinet case in the right hand | `case` |
| `case_l` | the same case in the left hand | `case` |
| `hat_hand` | the hat in the right hand | — |
| `clarinet_low` | the clarinet in both lowered hands | `clarinet` |
| `trumpet`, `tuba`, `drum` | the brass | — |
| `rucksack` | a canvas rucksack on the back, the straps over the shoulders | `rucksack` |
| `rucksack_lap` | the rucksack on the lap of one seated, between the arms | `rucksack` |
| `rucksack_lap_torn` | the same after `torn` — a knot on the strap (instead of `rucksack_lap`) | `rucksack` |
| `bucket` | an empty bucket in the right hand | `bucket` |
| `bucket_full` | a full bucket (water below the rim) — instead of `bucket` | `bucket` |
| `matches` | a matchbox in the right fist | `matches` |
| `suitcase` | a fibreboard suitcase in the **left** hand | `suitcase` |
| `coat_arm` | a coat over the left forearm | `coat` |
| `coat_over` | Busygin's coat on her shoulders (on Nina) | `coat` (on the back) |
| `shawl` | a knitted shawl on the shoulders | `shawl` (on the back) |
| `glass_held` | a faceted glass of tea in a holder, the right hand | `glass` |
| `box_held` | the snuffbox in the fingers of the right hand | `box` |
| `kettle` | a kettle in the right hand | `kettle` |
| `sheet` | a sheet of music in the right hand | `sheet` |
| `burnt_sleeve` | a scorched left sleeve | — |
| `snow_back` | snow on the back and the skirts | — |
| `long_scarf`, `fur_collar`, `collar`, `tie`, `belt` | parts of looks | — |

## Motions (`cast.data.json`, `motions`)

Put by `put_motion`. There were: `sit_down`, `seated` (sits at the table, hands on the table), `rise`, `pick_up`,
`put_down`, `hide_back`, `reach_put`, `hug`, `warm_hands` (rubs the hands at the chest), `knock`.

Added 2026-10-15 (the branch `ss/people-motions`, not yet checked by the scenes; the work stopped): `run`, `tiptoe`,
`careful`, `march_walk`, `carry_walk`, `seated_bag`, `stand_bag`, `lie`, `lie_side`, `sit_up`, `bend_reach`, `cold`,
`wave`, `toast`, `look_watch`, `take_shelf`, `put_shelf`, `turn_glass`, `put_heavy`, `point`, `lean`, `look_back`,
`falter`, `fall_sit`, `crouch`, `crouch_rise`, `dip`, `throw_bucket`, `give`, `take` (`give`, `take`, `cold`,
`carry_walk` — ready ones, taken again).

- Missing: `rise_ground` — made by the model, not put (key `97f8cf866e44ebbb5a265ee1f4ff99cedf634047`: gets up from
  the ground, at the end bent forward).
- Weak doubles: `lie_side` — already on its side, no turn; `throw_bucket` — the splash not seen; `put_heavy` — ends low
  in a bend; `sit_up` — sits up halfway; `lean` — a lean with a hand at the head; `march_walk` — an ordinary quick
  step; `carry_walk` — a gait with a suitcase; `tiptoe` — creeps crouching; `run` — a 2 s loop with a jump at the join.
- Where they end: `wave` — the arm still raised; `bend_reach`, `look_back` — still bent / turned round; `falter` begins
  already bent.
