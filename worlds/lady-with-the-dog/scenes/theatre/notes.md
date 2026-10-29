# The theatre in S.

IV.2 of “The Lady with the Dog” (scenes.md «Театр в С.», the 4th edition): the first night of “The Geisha” in a
provincial theatre. The hall from the balcony, the six ladies, her lorgnette; the husband who bows at every step; the
interval; the corridor; the landing of the stairs, the schoolboys smoking above. Modules: `cast`, `beats` (an interior:
no sky).

## How it is made

- **The camera** `picture`; the shots are the camera's keys (`lib.js` `CAM`): `BACK` (behind Gurov at the left column
  under the balcony: the hall, the curtain, the chandelier), `HALL` (from the balcony's front, 4.5 m up, pitched −29°:
  row 3 in the middle of the frame, a seated lady ≈ 0.19 of it — “Find her” and the husband), `FACE` (from the middle
  aisle by row 1 back at her: her face three-quarter, lifted to him, he standing in the aisle), `CORRIDOR`, `STAIRS`
  (the landing), `TWO` (the two in profile under the lamp, 1.9 m), `TURN` (her at the turn of the stairs, her face back
  to him). scenes.md asked for `roam`; `picture` — the shots are all the scene's own, the viewer only leans.
- **The hall** (metres in `lib.js` `G`): walls x ±7, the stage's front z 18, ceiling 9; the balcony over the back of
  the parterre (front z 7.6, 3 m up) on two columns (forms); ten rows of dull green seats (one painting, copies), a
  middle aisle; boxes in two tiers painted on the side walls; the proscenium, the curtain (two halves gathered by
  `curtain` in `animate`), the painted scenery of “The Geisha” (white blossom, pale lanterns — no red anywhere).
- **The painted audience**: each row two cards back to back — `crowd_b*` (backs of heads, facing the start) and
  `crowd_f*` (faces, facing the stage, painted mirrored), so the shots from behind and from the stage both see people;
  rows 1 and 5…10 are copies (every other mirrored), rows 2, 3, 4 have their own paintings with the people's seats
  left empty (and in row 2 the two seats by the aisle on the right — `FACE` looks through them). Each painting has two
  layers: those who stay in the interval and those who go out — `crowd` (the hall filling) and `leave` (the interval)
  move them in `animate`.
- **The six ladies**: `lady1` −2.85 (row 3), `lady2` −1.75 (row 2), `lady3` −0.65 (row 3), `anna` +1.20 (row 3),
  `lady4` +3.40 (row 3), `lady5` +2.30 (row 4); the husband's seat +0.65 on her left by the aisle. Neighbours are a
  seat apart or in the next row: ≥ 0.15 of the 4:3 window apart in `HALL`. `enter` (the game's) — the script leads each
  next one from under the balcony down the middle aisle and along her row; she sits (`sit_down`, `seated`); Anna then
  raises her lorgnette toward a box on the left (a `reach` of her right hand before her eyes, `look` at the box) — the
  glint is the light `glint_l` at `anna#lorgnette`, its strength `glint`.
- **Light**: the chandelier and the sconces (`on`: `hall_light`), the footlights and the batten (`on`: `stage`), the
  haze glowing round them; the corridor's two lamps; the landing's hanging lamp over the two (it lights their faces).
- **The corridor** (x 7.2…9.4) beside the hall's right wall, through the side door (z 13.6) and the other door
  (z 16.4). **The landing** stands apart (x 20.6…26, z 17…27): the door from the corridor at the back (its leaf turns
  by `door`), the gallery above on the right with its flight and banister where the schoolboys lean (`lean_rail`, a
  cigarette's smoke at `schoolboy1#hand_r` by `smoke`), the opening on the left where the stairs turn down — the
  element `stairs`, its point `stairs#down`.
- **People** (`cast`): `gurov` (`gurov_indoor` with a dark frock coat given by the element's `look.colors`), `anna`
  (`anna_theatre`, the part `lorgnette`), `diderits` (gait `bow_walk`, `bow` by her seat, `sit_down`, `rise`),
  `lady1…lady5`, `schoolboy1`, `schoolboy2`. At most nine at once.
- **The film** — `lib.js` `film(scene)`, played by `beats`. The cuts inside beats are said ahead (`s.shot`).

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `hall` | — | 12 | `BACK`: the hall fills (`crowd` 0.35 → 1); Gurov at the column from behind, looking over the rows |
| `hall_find` | — | 2 | a cut to `HALL`: the ladies not in yet — under “Find her” (`enter` 1…6, `glint`) |
| `husband_in` | hall_find | 12 | (noticed 1) lady2 turns back to the column; the husband comes in bowing at every step, bows, sits by her, puts her shawl right (`husband_in:sat`); the lights down to 0.3, the curtain up |
| `interval_out` | husband_in | 10 | the interval: lights up, curtain down, half the audience go out; the husband gets up and goes out; she stays |
| `interval_stay` | husband_in | 10 | the same; he stays and looks round the hall; she gets up and goes out alone by the side door |
| `approach` | interval_out | 8 | Gurov comes down the aisle to her row (`approach:at`); a cut to `FACE` — her face, afraid; she rises |
| `corridor` | — | 8 | a cut: she comes toward us from the side door; he steps out of the other door (`corridor:meet`), she steps back |
| `stairs` | — | 16 | a cut: the landing; she comes in (anna_life 0 fast); he after her; `stairs:landing`; `TWO` — the two in profile, afraid, then sad; they hold each other; back to `STAIRS` — under the choice (`anna`, `stairs#down`) |
| `promise_go` | stairs | 8 | she presses his hand, goes to the turn; `TURN` — her face back to him (`promise_go:back`); back; she is gone |
| `away_go` | stairs | 8 | she goes down without looking back |
| `bell` | promise_go, away_go | 6 | Gurov alone; the schoolboys go up and away |

`hall_find` and `corridor` are cuts the module `beats` makes from their `from` (scenes.md has them “after” the beat
before): a cut of the beat itself is made ready ahead by the game's `g.next`, one inside the beat before could not be
(a shot dies with its sequence).

Keys: `hall_light`, `curtain`, `stage`, `crowd`, `leave`, `glint`, `noticed`, `enter`, `door` (`door_f` the scene's),
`smoke`, `beat`, `beat_next`; of the play — `anna_life`.

## What is not here / what to know

- From the balcony only the ladies' heads show over the seat backs (the trial frame, 2026-10-29): Anna stands out by
  her fair hair and the raised lorgnette with its glint, not by her light dress, which the seats hide. The rim/toned
  trial: no difference worth a change here — the world's `toned` stays.
- The hall's light reaches the corridor a little (lights pass walls).
- Nobody walks on the stairs (scenes.md): the cut is to the landing; she goes out of sight behind the wall at the turn.

## Contract for the check

```json
{"beats": {"hall": {"after": [], "tells": [], "seconds": 12, "show": false},
           "hall_find": {"after": [], "tells": [], "seconds": 2, "show": false},
           "husband_in": {"after": ["hall_find"], "tells": ["husband_in:sat"], "seconds": 13, "show": false},
           "interval_out": {"after": ["husband_in"], "tells": [], "seconds": 11, "show": false},
           "interval_stay": {"after": ["husband_in"], "tells": [], "seconds": 10, "show": false},
           "approach": {"after": ["interval_out"], "tells": ["approach:at"], "seconds": 10, "show": false},
           "corridor": {"after": [], "tells": ["corridor:meet"], "seconds": 8, "show": false},
           "stairs": {"after": [], "tells": ["stairs:landing"], "seconds": 18, "show": false},
           "promise_go": {"after": ["stairs"], "tells": ["promise_go:back"], "seconds": 10, "show": false},
           "away_go": {"after": ["stairs"], "tells": [], "seconds": 7, "show": false},
           "bell": {"after": ["promise_go", "away_go"], "tells": [], "seconds": 6, "show": false}},
 "points": ["lady1#head", "lady2#head", "lady3#head", "lady4#head", "lady5#head", "anna#head", "anna#lorgnette", "anna", "stairs#down"],
 "offers": ["anna", "stairs#down"],
 "party": {"anna_life": 0}}
```
