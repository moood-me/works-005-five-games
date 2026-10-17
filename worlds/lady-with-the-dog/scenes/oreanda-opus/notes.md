# Oreanda

II.2 and the epilogue of “The Lady with the Dog” (scenes.md, Oreanda, the 4th edition). A cliff over the sea before dawn:
a backless seat on dry grass, the two seen from behind, the Pomeranian at her feet on a red leash; on the right a white
church on the headland and cypresses, the nearest cypress with a cicada; below, 90 m down, the sea to the horizon, the
far shore on the left, mist at the cliff's foot; far off on the left the steamer from Theodosia with three lights. The
camera `picture` behind the seat, a little above; the horizon 0.45.

## How it is made

- **The sky and the sea — one sky element** (`sky`, its own; `nebo` is not needed): the blue hour, the layer `dawn` —
  the dawn over it; stars with the morning star, clouds, the path of light, the mist (`mist`). The sea is painted in the
  sky: far below.
- **Light**: two far lights from the east (on the left, bearing −19°): `pre` — pale blue, `sunrise` — warm, by `dawn`;
  the look `dawn` raises `ambient`. Night is a colour, not darkness.
- **The ground** — the plane `cliff` to the cliff's edge (`lib.edge`), the cliff's lip — the card `edge`.
- **The steamer** (`steamer`) stands on the sea (`elevation` −90), its place a function of the dawn
  `lib.steamerAt(dawn)`; its lights go out one by one by `lights`; the point `steamer#lights`.
- **People**: `anna_summer`, `gurov_summer`, `watchman` with a stick (the part `stick`). They sit on the seat by
  `<id>_on`, `seated`; rise by `rise`. Her right hand lies on the seat (`anna_reach.r`); `hand` 1 — his left to
  `anna#hand_r`.
- **The Pomeranian** — the module `shpic`, lying at her feet, the leash to `anna#hand_l`.
- **The film** — `lib.js` `film(scene)`, played by the module `beats`. Shots: `BENCH` (from behind, their backs and the
  sea), `SIDE` (from the side in front of the seat, low, back at them: 2.1–2.6 m, faces three-quarter; the dawn from the
  east — on their faces; she turns her face to him — to us; the Pomeranian in the shot).

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `bench` | — | 12 | out of the dark (1.5 s); before dawn; from behind the two sit, the Pomeranian lies; `bench:sat`; she looks at the lights, he — down |
| `still` | bench | 2 | the same — under “The sea” (the game moves `dawn`, `lights`, `cicada`, `hand`) |
| `watchman` | still | 14 | `dawn` to 1; the keeper with a stick comes out from behind a cypress, stops, looks (`watchman:looks`), goes (`watchman:gone`) |
| `dew` | watchman | 8 | faces: a cut to `SIDE`; she turns her face to him (`sad`); he to her; they rise; the Pomeranian jumps up |
| `bench_end` | — | 12 | the epilogue: the empty seat, the dawn, the mist going, the camera slowly moving in (`camera_z` → 0.7) |

Keys: `hour`, `dawn`, `mist`, `lights`, `cicada`, `hand`, the keys of `shpic`, `beat`, `beat_next`. No keys of the play.

## What is not here / what to know

- In `dew` the steamer by the shore is out of the shot: the side shot looks back at them (so the dawn is on their faces,
  not behind them). The steamer without its lights is seen in `watchman` and in the wide shot.
- `hour` is described, but the light is led by `dawn` (the scene is always in the hour before dawn).
- The move in of `bench_end` is short (0.7 m): further, the seat goes under the bottom edge.

## Contract for the check

```json
{"beats": {"bench": {"after": [], "tells": ["bench:sat"], "seconds": 12, "show": false},
           "still": {"after": ["bench"], "tells": [], "seconds": 2, "show": false},
           "watchman": {"after": ["still"], "tells": ["watchman:looks", "watchman:gone"], "seconds": 14, "show": false},
           "dew": {"after": ["watchman"], "tells": [], "seconds": 8, "show": false},
           "bench_end": {"after": [], "tells": [], "seconds": 12, "show": false}},
 "points": ["steamer#lights", "cypress#cicada", "anna#hand_r"],
 "offers": ["steamer#lights", "cypress#cicada", "anna#hand_r"],
 "party": {}}
```
