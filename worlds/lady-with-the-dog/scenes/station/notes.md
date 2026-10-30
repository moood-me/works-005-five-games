# The station

II.4 of “The Lady with the Dog” (scenes.md, the station, the 4th edition). A small station in the dusk of late summer: a
wooden platform with lamps, the station house with its bell, the train (the engine, three carriages and Anna's carriage —
the last one), beyond the tracks the steppe, telegraph poles, wires, poplars. A light sadness, “there was already a scent
of autumn”: a warm afterglow on the left, a cold lilac on the right, where the train goes; the warm windows of the
carriages and the lamps; red — only the tail lights.

## How it is made

- **The camera** `panorama`, `span` [−20, 40]; shots — by the camera's keys (`lib.js` `CAM`): `PLATFORM` (along the
  platform at an angle), `FACE` (under a lamp over his shoulder: her face to him, 3 m, three-quarter, the lamp before
  her face), `WINDOW` (from the platform up at her window, 2.4 m: her face behind the glass, the curtain), `END` (the end
  of the platform along the tracks), `HOUSE` (toward the station house), `LAMP` (his face under the lamp by the house). The long cards stand with `facing` 180 (the
  turned shots).
- **The sky** — a sky element of its own (wide enough for the turned shots); the module `sky` is not needed.
- **The train**: an invisible anchor `train` at `train_a`; on it `carriage` (Anna's carriage: the window a hole, the
  points `glass`, `sill`, `curtain`), `car_inside` (the compartment), `drape` (the curtain by `curtain`),
  `carriage_end` (the red lights), `cars`, `train_lit`, `loco`. Meaning → metres by one function `L.placeTrain`
  (`train_a`, `tail_a`, `tail_on`, `winlamp_a`).
- **The light on her face at the window** — the scene's light `winlamp` (the compartment's lamp by the window, before
  her), travelling with the train by `winlamp_a`. On the platform her face is lit by the lamp `lamp2` (above her).
- **Anna** stands `on: "carriage"` the whole scene (in the carriage's frame): on the platform (the floor 0.6 above the
  rail) and at the window (the floor 1.2). The Pomeranian in her arms — the cast's part `spitz_held` (the motion
  `hold_dog`); the element `spitz` (the module `spitz`) is there but hidden (`spitz_here` 0).
- **The lamps** — copies of one painting; their light — sources of their own `lamp0…lamp4`.
- **The film** — `lib.js` `film(scene)`, played by the module `beats`. The cuts inside the beats are said ahead.

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `platform` | — | 14 | a wide shot 3 s, then faces: a cut to `FACE` — she to him (L37, `sad`), past him along the train (L36), to him again; the conductor with a lantern far off; at the end `platform:bell` |
| `board` | platform | 6 | faces: a cut to `WINDOW` — she in the carriage at the window, her hand on the frame, her face behind the glass by the lamp, looking at us; the curtain in the shot — under the choice |
| `look_back` | board | 15 | her hand on the glass; the train moves off; a cut to `END`: the window goes away and grows smaller, the tail light |
| `curtain` | board | 17 | she draws the curtain; the train moves off; a cut to `END`: a light curtained square goes away |
| `alone_far` | — | 21 | the empty platform: he walks to the last lamp, stands (`alone_far:stands`), the red light melts away (`far` → 1) |
| `alone_turn` | — | 22 | by the station house: he stands under a lamp; a cut to `LAMP` — his face, tired (`alone_turn:door`: his thought, the face holds through it); back to `HOUSE`, he goes to the station's doors |

Keys: `hour`, `train`, `far`, `curtain`, the keys of `spitz`, `beat`, `beat_next`. No keys of the play.

## What is not here / what to know

- `platform` begins with a wide shot (3 s: the train, the station, the conductor), the faces — after the cut.
- L36/L37 (game.md §8, the lines' numbers): the scene does not know which line will be said; in `FACE` she first looks
  at him, then past him, then at him again — the pose fits both.
- The motion `hold_dog` (she holds the Pomeranian to her breast) is not from scenes.md's list of motions; the cast must
  keep it.
- The bell does not swing (its stroke is the game's sound). `hour` is described, but the light is always the evening's.

## Contract for the check

```json
{"beats": {"platform": {"after": [], "tells": ["platform:bell"], "seconds": 14, "show": false},
           "board": {"after": ["platform"], "tells": [], "seconds": 6, "show": false},
           "look_back": {"after": ["board"], "tells": [], "seconds": 15, "show": false},
           "curtain": {"after": ["board"], "tells": [], "seconds": 17, "show": false},
           "alone_far": {"after": [], "tells": ["alone_far:stands"], "seconds": 21, "show": false},
           "alone_turn": {"after": [], "tells": ["alone_turn:door"], "seconds": 22, "show": false}},
 "points": ["anna", "carriage#curtain", "carriage#glass", "carriage#sill"],
 "offers": ["anna", "carriage#curtain"],
 "party": {}}
```
