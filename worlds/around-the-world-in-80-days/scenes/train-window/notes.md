# From the train window (`train-window`) — engine 3

The links of every chapter (docs/vokrug-sveta/scenes.md). A first-class compartment; the people are the engine's (the
world's cast `cast`), the film is in beats of the module `beats`. A warm compartment (walnut, red velvet, lamps)
against the world behind the glass, each land with a light of its own. All painted once, moving on the graphics card.

## How it is made

- **The world lies along the line, the train goes along it.** `across` — along the line (the train goes towards
  +across), `distance` — away from the line, out of the window. The camera is the train: `camera_x` — where it is; an
  unseen `train` stands at `camera_x`, on it the `carriage` (the compartment; its `carriage_x` — the plan's offset
  sideways: the camera 0.4 m right of the compartment's middle — `carriage_x` −0.4), the whole compartment and the
  people are `on` the compartment. Hence an honest parallax, shadows, light and fog; nothing scrolls.
- **Five lands — five stretches of the world** (lib.js `plan`): the middle of land k — k × 30 km (europe 0, india
  30 km, prairie 60, snow 90, england 120). A change of `land` — a cut of the train to a stretch of that land
  (script.js; the beats make it ready ahead with their `from`) — no painting is painted again.
- **The stretch repeats every 8 km** (`period`): everything along the line stands at a step that divides the period,
  its look — `hash(j)` of its number in the period; the hills — a periodic noise (`pnoise`). The train goes through its
  stretch (a period about the middle), at the end the script cuts it a period back — the frame before and after is
  one and the same (the same place in the repeat, the same light, the people on the compartment as they were), the cut
  made ready ahead (`scene.shot` 3 s before the end of the stretch — for the very place of the cut: the train goes
  exactly to the end and is cut there). Why not one long road: in the game `ride` may last as long as it likes; 8 km
  is 6.7 min at full speed, the showcase never gets that far. The pictures are painted over the period plus as much as
  is seen out of the window to the side (`reach` × distance: the widest shot — the eye 1.1 m to the side and 1.2 m
  nearer the window).
- **The train runs** (script.js): `camera_x` moves half a second of the way ahead at `speed` × 20 m/s, the next move is
  given before the last one ends (every 0.25 s and every frame while `speed` itself moves) — no stops, the speed is a
  state. A cut (a beat, a land, a repeat) goes on from the new place.
- **The ground** — a `relief` (lib.js): at the line level with the compartment's floor, the embankment goes down to the
  ground 1.3 m lower by 7.5 m; in India the bed of the Ganges. On it one `drape` plane `ground` 150 × 4 km: each land
  its own colours by distance, fields in strips from the line (furrows), lanes across, dry grass through the snow of the
  prairie, snow ridges, the Ganges' muddy banks.
- **The Ganges** — a mirror plane `river` over its bed (India), `reflect` with no fade, `rough` 0.3, `ripple` 0.3.
- **The layers outside the window** — cards at their own distances, each along all the lands: `near` 14 m (poles every
  50 m, wires, grass, palms, snowdrifts; casts shadows on the ground), `herd` 60 m, `mid` 120 m, `far_bank` 330 m
  (India), `distant` 400 m, `far` 3 km.
- **The lights** — the windows of villages and of London, gas lamps (`distant`), the windows of brick houses (`mid`),
  the lamps of the ghats (`far_bank`): the windows are the layer `lights`, the shader (`distant.wgsl` and so on) adds it
  as light (`emission`) as much as the gas burns (`lit`, animate: lib `litMotion`), the glows `e.light` go out the same
  way (`e.glow`).
- **The sky** — the shader `sky.wgsl`: the colours (the land, night, dawn) are uniforms from the animate (lib
  `skyMotion`), a moonlit haze at the horizon and a warm sky by a low sun; the layers — stars (twinkling each at its own
  phase), the moon, the sun (rising with `dawn`). The light of the moon and the sun — `from: "sky#moon"`, `"sky#sun"`.
- **The buffalo** — `herd.js` paints one buffalo in 12 phases of its step (the layer `atlas`, outside its frame);
  `herd.wgsl` makes a herd of it: 6 rows, a buffalo every 7 m in each, its own size and length of step (3.2…3.8 m), the
  pose by the way gone. The herd crosses the line where the train stands (`herd_x`).
- **The compartment** — the wall with the window (`window`), the glass `glass` (at night the compartment shows faintly
  in it), the sill, the table, the lamp, the sofas and their armrests. The window's light — `window_light` (`daylight`,
  `of: "glass"`: it comes in through the whole opening, only into the compartment). The lamps — `sconce_l`, `sconce_r`
  (`window#…`), `table_lamp` (`lamp#bulb`), `on: night`; their glass from inside — the layer `lights`, added as light.
  How much light there is in the compartment — below («The compartment's light»).

## Keys

| Key | What | By default |
| --- | --- | --- |
| `land` | `europe` · `india` · `prairie` · `snow` · `england` — the land outside the window (a cut to its stretch) | `europe` |
| `speed` | 0…1: 0 — the train stands; 1 — 20 m/s | 1 |
| `night` | 0…1: day → a moonlit night; with the night the compartment's lamps, the villages' windows, London's gas are lit | 1 |
| `dawn` | 0…1: a low warm sun at the horizon | 0 |
| `herd` | 0…1: the buffalo on `prairie` — how much of the herd has gone by | 0 |
| `fog` | 0…1: fog; set on a cut together with `land` (`england` → 1, the others → 0), the game may set it otherwise | 0 |
| `with_pp`, `with_aouda`, `with_fix` | who is in the compartment (Fogg always) | 1 |
| `aouda_dress`, `pp_wings`, `fix_bruise` | 0/1: the marks of the journey — Aouda's travelling dress, Passepartout's wings, Fix's bruise (script.js sets `<id>_wear` to the cast's `wears.<key>`) | 0 |
| `book_shut` | 0/1: Fogg is late — at the end of `special` he shuts his notebook on his knees (`fogg_with` `book_shut`, `sit_calm`, his eyes on it), the moment `special:shut`; the game sets it as it opens the beat | 0 |
| `beat` | a beat of the film | null |
| `watch_close` | 0…1: a close-up — Fogg's watch in his palm (an insert over the compartment); set by the beat `special` on a cut | 0 |

Set by the script: `camera_x` (the train), `herd_x`, `<id>_here` by `with_*`. The beats set `carriage_x`, `camera_z`,
`camera_h` (the shots).

**Changed against v1:** there is no `way` any more — `camera_x` took its place (the train goes through the world, not
the world under the window); `fog` on a change of `land` is set at once on a cut (a change of land is a cut), not over
3 s; the beat `brake` begins in India with its own cut (in v1 it came after `ride` and stayed in Europe, though the
notes said «India»); a new beat `snow`. The points of the looks and the palms are points of the compartment, riding
with it (`{"on": "carriage", "at": [across, distance, elevation]}`, lib.js `LOOK`, `PALM`), instead of v1's points of
the world; the glass under the palms — `window#pane_r`, `window#pane_l`. The light: `moon` and `sun` — from the sky
(`sky#moon`, `sky#sun`), not from fixed directions.

Points: `window#window`, `table#table`, `lamp#lamp`, `sky#moon`, `sky#sun`. For a choice in the game: `window`,
`fogg`, `passepartout`, `aouda`, `fix`.

## The film

`lib.js` `film(scene)` → beats of the module `beats` (script.js — by the key `beat`; showcase.js — the showcase
`SHOWCASE`).

| Beat | What | After |
| --- | --- | --- |
| `depart` | Europe, night: the train gathers speed; Passepartout at the window, looking ahead at the lights; Fogg opens his notebook | — |
| `gas` | Passepartout jumps up (`gas_up`), a cut closer, turns to his master; Fogg looks up | depart |
| `watch` | Passepartout sits down (`sit_down`), a cut tighter; the silver watch in his palm, he looks at it | gas |
| `ride` | night, all four: Fogg reads, Aouda at the window, Fix behind his paper, Passepartout asleep | — |
| `brake` | India, dawn: the train stops (`speed` → 0 in 6 s); they wake, look out | — |
| `ganges` | the train goes quietly along the Ganges; Aouda turns her head — a profile against the river | — |
| `buffalo` | the prairie, the train stands, the herd goes by of itself (24 s — the beat ends with it); Passepartout gets up, to the glass, his palms on it; a cut to Fogg in his seat (over his shoulder, the herd beyond): he takes out his watch and looks at it | — |
| `snow` | snow, a clear day; they ride | — |
| `special` | England, fog: the special at full speed; Fogg takes out his watch — a cut to the close-up (the insert `watch_close`) — a cut back into the compartment: all look at the watch; he puts it away and opens his notebook on his knees; with `book_shut` 1 he shuts it (`special:shut`) | — |

The scene tells the game the beats' moments (`scene.tell`), besides `beat:<name>`: `depart:book`, `gas:up` (jumped
up), `watch:out` (the watch in his palm), `brake:stopped`, `ganges:profile`, `buffalo:at-glass`, `buffalo:watch` (Fogg looks at his watch, ~6 s after
`at-glass`), `special:watch` (the cut to Fogg's watch close up), `special:eyes` (the cut back into the compartment: all
look), `special:shut` (with `book_shut` 1: he shuts his notebook).

The compartment's light. By day the compartment is full of the light from the window: `light.inside` 1 (all that is
seen — the people's backs, the wall with the window — faces away from the window and is lit by the light around), the
window's light `window_light` — up to 4.5 m (the people's sides, shoulders and heads, the carpet, the table); dawn —
`ambientColor` softer than in v1 (the light is linear: the old colour darkened the compartment). At night — as it was:
`inside` 0.75, the lamps (`sconce_l`, `sconce_r`, `table_lamp`) — strength 2, up to 3 m. The gas and the windows burn
by the world's hour (`light.gas`). Dark paints (walls, frock-coats) are darker and more saturated on the screen than
painted, in any light — that is the engine's tone curve (its black subtracted), not the scene's light: do not correct
it with the scene's light.

Fogg's watch close up — the insert `watch_close` (elements/watch_close.js, its place and size — lib.js `CLOSE`): a
view from above, from his knees, along the right forearm — the sleeve, the cuff, the palm with its fingers, the open
watch, its dial to us (Roman numerals, the hands at 8:17, the seconds dial), the lid at the side, the chain to the
waistcoat; the lamp's light from the upper right. Painted once in the world's manner (flat shapes, each with one lit
or shaded face); the animate rocks the hand with the carriage and the breath, the second hand ticks. The scene's camera
cannot take this shot: `camera_pitch` is a shift of the lens (a circle in the palm is seen as an oval), and the cast's
people have no fingers. The point `watch_close#dial`. The cast's watch (`watch`) in the hand — for the wide shots.

## What must not be broken

- What is painted reads no moving keys: `land` — only the sky, through the animate; the night, dawn, the gas, the herd
  — uniforms and `e.glow`. Never paint by `camera_x`, `night`, `dawn`, `herd`.
- Everything along the line — at a step that divides `period`, its look by its number in the period (`along`,
  `pnoise`): else the repeat's cut would show.
- The cards and planes — by `reachOf(D)` about the land's middle; the frames (`box`) in scene.json cover it.
- The lands are 30 km apart: from the window of one the other is not seen (the farthest seen is `far`: ±(4 + 5.1) km).

## Contract for the check

```json
{"beats": {
  "depart": {"after": [], "tells": ["depart:book"], "seconds": 8, "show": false},
  "gas": {"after": ["depart"], "tells": ["gas:up"], "seconds": 5, "show": false},
  "watch": {"after": ["gas"], "tells": ["watch:out"], "seconds": 6, "show": false},
  "ride": {"after": [], "tells": [], "seconds": 10, "show": false},
  "brake": {"after": [], "tells": ["brake:stopped"], "seconds": 8, "show": false},
  "ganges": {"after": [], "tells": ["ganges:profile"], "seconds": 8, "show": false},
  "buffalo": {"after": [], "tells": ["buffalo:at-glass", "buffalo:watch"], "seconds": 24, "show": false},
  "snow": {"after": [], "tells": [], "seconds": 10, "show": false},
  "special": {"after": [], "tells": ["special:watch", "special:eyes", "special:shut"], "seconds": 15, "show": false}
},
"points": ["window#window", "window#pane_l", "window#pane_r", "table#table", "lamp#lamp", "sky#moon", "sky#sun", "watch_close#dial",
  "window", "fogg", "fogg#watch", "fogg#book", "passepartout", "passepartout#watch", "aouda", "fix"],
"offers": [],
"party": {"with_aouda": 0, "with_pp": 1, "with_fix": 0, "aouda_dress": 0, "pp_wings": 0, "fix_bruise": 0},
"acts": {}}
```
