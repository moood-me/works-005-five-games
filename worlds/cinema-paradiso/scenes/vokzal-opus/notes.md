# Вокзал (opus)

The small station (scenes.md «Вокзал»), chapters IV and V: the farewell at dawn, the train going, Salvatore's return.
Engine 3, camera `roam`. Mood: a pale, still dawn, light sadness; the people in profile against the green carriage
and the black engine; 1988 — the same platform, cool, empty, one window lit.

## The place (metres; x east, z north; the start on the platform)

All numbers in `lib.js` (`G`). The platform x −60…60, z −4…4.5 (stone flags, a white line at its edge); the station's
front at z −4 (GIANCALDO, the clock over the middle door, benches), a lamp post at (4.2, 2.6). The track's bed 0.9 m
lower north of the edge (`relief.js`), the line at z 5.6; beyond it a field, olive trees (copies), low hills; dry
ground round the station and past the platform's ends.

The train: an unseen anchor `train` on the line, its `across` the scene's `train_x` (= 150 m × `train`). It faces
west, so that in its frame (laid out as if it faced the start) `distance` runs east and `across` south — the cards on
it: the engine's south side (its driving wheels three layers turning by the way gone), carriage 1 (Toto's) and 2 —
their south sides with window holes, their insides behind, the last carriage's end; car 1's floor (a plane, walk)
marks `car1_floor#win`, the spot behind Toto's window where he stands carried (`toto_on`, no steps). Steam and smoke
are particles on the train (`steam`).

Light: dawn — the sun low in the east-south-east behind the camera (`sun`, `dawn_k`), the sky's apricot glow there,
haze; 1988 — `now_k`: cool lilac, the dusk's light from the west, one warm window in the station (`window_light`),
the platform lamp (always lit).

## Shots (`script.js` CAM)

`platform` — across the platform to car 1's door: the mother, Toto, Alfredo in profile, the engine behind (≈ 0.4 of
the frame). `window` — from the platform under Toto's window; it tracks along with the starting train (camera_x moved
with `train`) and stops with it. `away` — along the platform east: the mother and Alfredo, the train going down the
line. `back` — riding the train (`camera_on`: train), leaning out of Toto's window, back at the platform. `arrive` —
1988, from the carriage's step: Salvatore's back, the station's front and clock.

## Beats

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| platform | — | dawn, the train standing, steam; the mother holds Toto (both `stand`, hands `reach` back/nape); she steps back; Alfredo comes with his cane and holds him (choice pose: `alfredo`) | platform:hug (5) | 16 |
| boarding | platform | Toto takes the suitcase, goes to the door, in; cut: he is at his window; the train starts (`train` → 0.08), the camera tracks with it; `alfredo_stays` 0 — Alfredo turns and goes off west tapping his cane, 1 — he goes to the platform's edge (end: the window with Toto in frame) | boarding:window (≈1.2 after the cut) | 11 |
| away | boarding | `away`: the train goes (`train` → 1, 12 s), Toto at his window facing ahead (profile); the mother waves twice; Alfredo as chosen | away:gone | 13 |
| back_look | boarding | `back`: from the train, the platform going away; the mother waves; Alfredo — going off with his cane, or standing with his hand up (`wave`) | back_look:far (≈8) | 13 |
| arrival | — | 1988, evening: the train standing, no steam; Salvatore (coat, scarf, a small suitcase) walks three steps from the carriage and stops in the empty platform, his back to us; he looks up at the clock | arrival:stand (≈5) | 12 |

## People

`toto` (`toto_teen`; in 1988 `toto_wear` = the cast's `salvatore` look object), `maria` (`maria`: widow's black,
a shawl), `alfredo` (`alfredo_blind`, `alfredo_with` ['cane'] — the cast's part `cane`), far passengers `c1`, `c2`.
Motions (cast_opus, ready motions put in): `wave` (raises the right hand high, waves slowly), `cane_walk` (walks
slowly and carefully, looking down: his gait), `carry_walk` (walks with a heavy bag in the right hand: Toto with
the suitcase, the cast's part `suitcase`), `stand`, `walk`.

## What is not here / found

- The insert `wallet` (the old frame in his fingers) — not made (`wallet`, `open` keys absent).
- In 1988 the same steam train stands at the platform (steam off).
- No coupling rods on the wheels; the engine is one side card (its north side and front are never in a shot).
- Seen on the renders: Toto's outline (his legs below the window, inside the carriage) shows through the carriage's
  side — the figure's lines drawn where the figure is hidden by an opaque card before it (as in «Зал (opus)»): an
  engine matter.
- A person carried on a point of a moving element walked (a warning: "moved faster than its gait") until
  `toto_steps` false was set with `toto_on` — people.md says a carriage at speed walks no one.

## Контракт для проверки

```json
{"beats": {
  "platform": {"after": [], "tells": ["platform:hug"], "seconds": 16, "show": false},
  "boarding": {"after": ["platform"], "tells": ["boarding:window"], "seconds": 11, "show": false},
  "away": {"after": ["boarding"], "tells": ["away:gone"], "seconds": 13, "show": false},
  "back_look": {"after": ["boarding"], "tells": ["back_look:far"], "seconds": 13, "show": false},
  "arrival": {"after": [], "tells": ["arrival:stand"], "seconds": 12, "show": false}
},
"points": ["toto", "alfredo", "maria", "car1#window", "car1#door", "car1_floor#win", "suitcase", "clock#face", "loco#chimney"],
"offers": ["alfredo", "toto"],
"party": {},
"keys": {"era": "past", "train": 0, "steam": 1, "alfredo_stays": 1, "beat_next": ""}}
```
