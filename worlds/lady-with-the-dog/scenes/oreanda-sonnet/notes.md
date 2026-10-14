# Ореанда (sonnet)

Mood: покой, вечность, светлая грусть, море, которому всё равно; выцветшее (белое, серо-голубое, сиреневое), один тёплый
свет — рассвет за морем; красное — только поводок.

Build: camera `picture`, horizon 0.42. The cliff is a ground plane ending at 9.6 m; the sea is a plane 70 m lower
(reflecting, rough) seen over the edge; sky is layers (night, stars, day, glow, sun) mixed by `dawn` in animate (no
repaint). Light is the engine's: `sun` far light at bearing 8°, `on: dawn`; a look `dawn` turns tint and ambient.
People (cast module, style `dama` = soft + rim) sit on the bench seen from behind; Anna left (her right hand lies on the
bench between them), Gurov right. The spitz (module `shpic`) lies at their feet; the leash is a layer with emission.
The watchman is a far figure walking out from behind the church facade.

Pieces (`beat`): bench, still, watchman, dew, bench_end — see script.js; each ends with `beat:<name>`.

What is not there: no cicada sound (game's); watchman is not as far as «дальняя» wants (about 0.2 of frame): the camera
is behind the bench, so the path "behind the bench" is on the sea side. Pressing `steamer#lights`, `cypress#cicada`,
`anna#hand_r` — points exist; `anna#hand_r` is a person point.

## Контракт для проверки

```json
{"beats": {"bench": {"after": [], "tells": ["bench:sat"], "seconds": 11, "show": false},
 "still": {"after": ["bench"], "tells": [], "seconds": 2, "show": false},
 "watchman": {"after": ["still"], "tells": ["watchman:looks", "watchman:gone"], "seconds": 12, "show": false},
 "dew": {"after": ["watchman"], "tells": [], "seconds": 8, "show": false},
 "bench_end": {"after": [], "tells": [], "seconds": 12, "show": false}},
 "points": ["steamer#lights", "cypress#cicada", "anna#hand_r", "spitz"],
 "offers": ["steamer#lights", "cypress#cicada", "anna#hand_r"],
 "party": {"hour": 0.18, "dawn": 0, "mist": 1, "lights": 3, "cicada": 1, "hand": 0}}
```
