# The station

The small station (scenes.md "The station"), chapters IV and V: the farewell at dawn, the train going, Salvatore's return,
the frame in his wallet. Engine 3, camera `roam`. Begun as the station's opus version, brought to the 4th edition: the world's
modules (sky, beats, cast, closeups), faces, the farewell in a medium shot, the wallet insert. Mood: a pale, still
dawn, light sadness; the green carriage and the black engine; 1988 — the same platform, cool, empty, one window lit.

## The place (metres; x east, z north; the start on the platform)

All numbers in `lib.js` (`G`, `P`). The platform x −60…60, z −4…4.5 (stone flags, a white line at its edge); the
station's front at z −4 (GIANCALDO, the clock over the middle door, benches) with its east end wall (`station_end`:
along the platform it is a house, not a sheet), a lamp post at (4.2, 2.6). The track's bed
0.9 m lower north of the edge (`relief.js`), the line at z 5.6; beyond it a field, olive trees (copies), low hills.

The train: an unseen anchor `train` on the line, its `across` the scene's `train_x` (= 150 m × `train`). It faces west,
so that in its frame (laid out as if it faced the start) `distance` runs east and `across` south — the cards on it: the
engine's south side (its driving wheels three layers turning by the way gone), carriage 1 (Toto's) and 2 — their south
sides with window holes, their insides behind, the last carriage's end; car 1's floor (a plane, walk) marks
`car1_floor#win`, the spot behind Toto's window where he stands carried (`toto_on`, no steps). Steam and smoke are
particles on the train (`steam`).

Light: dawn — the sun low in the east-south-east behind the camera (`sun`, `dawn_k`); 1988 — `now_k`: cool lilac, the
dusk's light from the west, one warm window in the station (`window_light`), the platform lamp (always lit). The sky is
the world's (`sky`, `lib.SKY`: dawn gold low east-south-east, a pale moon in the west; the evening's afterglow
west-north-west).

## Shots (`lib.film` CAM)

`platform` — medium, a little from the south-west: Toto and Alfredo ≈ 1/2 of the frame, their faces 3/4, the mother a
step behind; the carriage behind them going off in depth. `window` — from the platform: Toto at his window; as the train
starts the camera pans after it (`camera_yaw` 11 → 64), and Alfredo — at the edge or going — comes into the same frame. `away` — along the platform east: the
mother and Alfredo, the train going down the line. `back` — riding the train (`camera_on`: train), leaning out of Toto's
window, back at the platform. `arrive` — 1988, from the carriage's step: Salvatore's back, the station's front and
clock.

## Beats (`lib.film(scene)`, played by the world's `beats`)

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| platform | — | dawn, the train standing, steam; the mother holds Toto (both `stand`, hands `reach` back/nape; her face `sad`); she steps back; Alfredo comes with his cane and holds him. Choice pose `station`: `alfredo` (sad), Toto (thinking), medium | platform:hug (5) | 16 |
| boarding | platform | Toto takes the suitcase, goes to the door, in; the cut: he is at his window (`"on"` the train); the train starts (`train` → 0.08), the camera tracks with it; `alfredo_stays` 0 — Alfredo turns and goes off west tapping his cane, 1 — he goes to the platform's edge. Choice pose `look`: the window with Toto in it (`toto`) | boarding:window (≈5) | 10 |
| away | boarding | `away`: the train goes (`train` → 1, 12 s), Toto at his window facing ahead (profile); the mother waves twice; Alfredo as chosen | away:gone | 13 |
| back_look | boarding | `back`: from the train, the platform going away; the mother waves; Alfredo — going off with his cane, or standing with his hand up (`wave`) | back_look:far (≈8) | 13 |
| arrival | — | 1988, evening: the train standing, no steam; Salvatore (coat, scarf, a small suitcase), already on the platform, walks three steps from the carriage and stops in the empty platform, his back to us; he looks up at the clock | arrival:stand (≈5) | 11 |
| wallet | arrival | the insert `wallet` opens (`wallet` 1); his hands open the old wallet, the frame of a kiss (`kiss_cut2`) between his fingers against the station's lamp (`open` 0 → 1) | — | 5 |

## People

`toto` (`toto_teen`; in 1988 `toto_wear` = the cast's `salvatore` look object), `maria` (`maria`), `alfredo`
(`alfredo_blind`: glasses and cane the look's parts), far passengers `c1`, `c2`. Faces `simple`, `<id>_mood` per beat.
Motions: `wave`, `cane_walk` (his gait), `carry_walk` (Toto with the suitcase, the cast's part `suitcase`), `stand`,
`walk`.

## What is not here / found

- In 1988 the same steam train stands at the platform (steam off).
- No coupling rods on the wheels; the engine is one side card (its north side and front are never in a shot).
- Toto's outline (his legs below the window, inside the carriage) shows through the carriage's side — the figure's
  lines drawn where an opaque card hides the figure: an engine matter.
- Only two far passengers (`c1`, `c2`); scenes.md allows three.

## Contract for the check

```json
{"beats": {
  "platform": {"after": [], "tells": ["platform:hug"], "seconds": 16, "show": false},
  "boarding": {"after": ["platform"], "tells": ["boarding:window"], "seconds": 10, "show": false},
  "away": {"after": ["boarding"], "tells": ["away:gone"], "seconds": 13, "show": false},
  "back_look": {"after": ["boarding"], "tells": ["back_look:far"], "seconds": 13, "show": false},
  "arrival": {"after": [], "tells": ["arrival:stand"], "seconds": 11, "show": false},
  "wallet": {"after": ["arrival"], "tells": [], "seconds": 5, "show": false}
},
"points": ["toto", "alfredo", "maria", "car1#window", "car1#door", "car1_floor#win", "suitcase", "clock#face", "loco#chimney"],
"offers": ["alfredo", "toto"],
"party": {},
"keys": {"alfredo_stays": 1, "beat_next": ""}}
```
