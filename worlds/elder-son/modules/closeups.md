# closeups — hands and things close (engine 3)

Five shots for the inserts (`insert`) of the world's scenes — scenes.md “Close-ups”: `stove`, `tea`, `box` (the Home),
`strap` (the Platform), `shawl` (the Street). No faces. The hand — the hand function of “Scarlet Sails v3” (fingers,
back and palm, a sleeve with its cuff), three hands of its own: **Busygin** — young, warm skin, the sleeve of a dark
sweater / coat; **Sarafanov** — old, drier and darker, the sleeve of a brown knitted cardigan (the knit seen);
**Vasenka** — thin, long fingers, the sleeve of a padded jacket (the quilting seen). The light in the shots is painted:
warm — from the stove, the lamp, the window; cold — from the snow. The scene's light does not fall on an insert.

## How a scene shows an insert

In the scene's `modules` — `closeups` (and `cast`). The insert's element — its id exactly as in the table below, the
insert's key — the same id:

```json
{ "id": "tea", "name": "Tea", "insert": "tea" }
```

`elements/tea.js` (code, the painting — once):

```js
e.kit.closeups.paint(g, e, "tea");
```

`elements/tea.animate.js` (every frame — moves the layers and the points):

```js
const S = e.state;
e.kit.closeups.live(e, "tea", { which: S.which, pour: S.pour, glass1: S.glass1, glass2: S.glass2, spill: S.spill, shake: S.shake });
```

- **`paint(g, e, shot)`** — the insert's `code`. `shot` — `"stove"`, `"tea"`, `"box"`, `"strap"`, `"shawl"`. The
  painting reads none of the scene's keys — **but `box_mode`** in the shot `box` (it changes before the insert opens).
- **`live(e, shot, now)`** — the insert's `animate`. `now` — a plain object, its fields as in the table (numbered keys —
  as an array: `finger` ← `[finger1, finger2, finger3, finger4]`). A field missing — the default from the table. All
  the game moves every frame only it reads.
- Opened by the insert's key 0 → 1 (a beat sets it at its end; the engine makes the closed insert ready itself — it is
  no cut, it is not made ready ahead), closed by the key 0 at the beginning of the next beat. No `iris`: from the
  middle onto the whole frame.
- All the insert's keys — in the scene's `states` (the defaults — from the table).
- The background is painted along x from −0.3 to `e.aspect` + 0.3 (21:9 full); the hands, the thing and all the points —
  in the middle 4:3.

## Shots

| insert (id = key) | `shot` | what is in the shot | `now` (default) | points |
| --- | --- | --- | --- | --- |
| `hands` | `stove` | the kitchen's night; the open stove door, the fire in it; Busygin's two hands, palms to the fire, the fingers curled, frost on the knuckles | `thaw` 0…1 (0) — the frost melts, the skin from blue-red to warm, the fingers straighten; `rub` −1…1 (0) — the palms slide over each other (the right up and down over the left) | `hands#hands` — between the palms (moves with `rub`) |
| `tea` | `tea` | the oilcloth under the lampshade, two faceted glasses in holders, above — a kettle in Busygin's hand (the sweater's sleeve) | `which` 0…1 (0) — the spout over the first → over the second; `pour` 0/1 (0) — the stream (on/off, smoothly); `glass1`, `glass2` 0…1 (0) — the tea's level (1 — to the brim); `spill` 0/1 (0) — tea over the first glass's brim, a puddle on the oilcloth grows; `shake` 0/1 (0) — the spout trembles, the stream wavers | `tea#glass1`, `tea#glass2` — the top of each glass; `tea` — the spout |
| `box` | `box` | the oilcloth under the lamp; on the left Sarafanov's old hand (the cardigan's sleeve), on the right Busygin's young palm up; a silver snuffbox with a worn pattern | the mode — **the key `box_mode`** (`take` · `give`, by default `take`), the painting reads it. `take`: `finger` [4] 0…1 (0) — the young hand's fingers close on the snuffbox; `old` 1…0 (1) — the old hand goes off to the left out of the shot. `give`: `push` 0…1 (0) — the snuffbox slides over the oilcloth from the young hand to the old; `old_close` 0…1 (0) — the old fingers close on it | `box#finger1…finger4` — the young hand's fingertips, the forefinger first (top to bottom); `box#box` — the snuffbox (moves with `push`); `box#old` — the old palm (moves with `old`) |
| `strap` | `strap` | the rucksack's canvas strap from below up: above, Vasenka's thin hand pulls (the padded jacket's sleeve), lower Busygin's fist holds it (the coat's sleeve); behind them — the lit open door of the carriage, snow | `pull` 0…1 (0) — the strap creeps up out of the fist (towards 1 — the strap's end comes out of the fist); `grip` 0…1 (1) — the fist clenched (0 — open); `door_bg` 0…1 (0) — the carriage door behind them shuts (the light in the doorway narrows) | `strap#grip` — Busygin's fist |
| `shawl` | `shawl` | from behind: Nina's shoulders in a knitted shawl, the plait, snow flying; up on the right — the warm light of a window; Busygin's hands hold his coat by the collar over her shoulders | `lay` 0…1 (0) — the coat comes down on her shoulders (from 0.8 — it lies there, the hands let go) | `shawl#coat` — the coat's collar (moves with `lay`); `shawl#shoulders` — her shoulders |

The insert's name with no point (`hands`, `tea`, `box`, `strap`, `shawl`) — the main thing in the shot: between the
palms, the spout, the snuffbox, the fist, her shoulders.

## Where the points stand

In the shot's units: the frame's height, the origin in the frame's middle, y down (16:9 — x ±0.89; the middle 4:3 —
±0.667). On 4:3 and 21:9 all is the same about the middle. Every point — within |x| ≤ 0.58, y −0.35…0.32 (not under
the plate, not in the band of speech); points marked together — at least 0.15 apart.

| point | where (when it moves: from → to) |
| --- | --- |
| `hands#hands` (= `hands`) | (−0.07, 0.18), ±0.025 along the right hand with `rub` |
| `tea#glass1`, `tea#glass2` | (−0.24, −0.06), (0.24, −0.06) |
| `tea` (the spout) | (−0.22, −0.2) → (0.26, −0.2) with `which` |
| `box#finger1…4` (`take`) | (0.02, −0.19), (−0.07, −0.06), (−0.04, 0.09), (0.08, 0.22) |
| `box#box` (= `box`) | `take`: (0.45, 0.06); `give`: (0.16, 0.12) → (−0.49, 0.05) with `push` |
| `box#old` | `take`: (0.31, −0.32), up out of the shot with `old` → 0; `give`: (−0.49, 0.05) |
| `strap#grip` (= `strap`) | (0.15, 0.16) |
| `shawl#coat` | (−0.54, −0.3) → (0.02, −0.1) with `lay` |
| `shawl#shoulders` (= `shawl`) | (0.02, −0.1) |

## Layers (what `live` moves)

The layers and the motions are inside the module; the scene need not know of them. A shot is painted once (`box` —
again at a change of `box_mode`); while it is open nothing is painted anew.

- `stove`: each hand's palm and each finger twice — warm, and over it cold and rimed (its alpha 1 − `thaw`); the
  fingers scale along themselves from their knuckles (curled short → straight); the right hand slides with `rub`;
  the flames (two layers, `add`, flicker) and the fire's glow.
- `tea`: `kettle` (with the hand; moved by `which`, tipped by `pour`, trembling by `shake`), `stream`, `tea1`, `tea2`
  (scaled from the glass's foot by the level), `run1`, `run2`, `puddle1`, `puddle2` (tea over the brim of the glass the
  kettle is over while `spill` is on: it runs down, the puddle spreads over ≈ 3.5 s; `spill` 0 — gone).
- `box`: each finger twice — straight, and bent over the palm; closing, the straight one is drawn in to its knuckle
  and the bent one comes. `take`: `young`, `young_f1…4`, `box`, `young_c1…4`, `old` (+ shadows); `give`: `old`,
  `old_f1…4`, `young`, `box`, `old_c1…4` (+ shadows); the young hand follows the snuffbox the first 0.3 of `push`.
- `strap`: `strap` and `vas` rise with `pull` (0.44 of the frame's height: at 1 the strap's end is out of the fist);
  `fist` and its closed and open fingers (cross-faded by `grip`, ≈ 0.1 s); the door's `leaf_l`, `leaf_r` slide shut
  out of the wall with `door_bg`, the doorway's light on the snow (`spill`) goes, the hands and the strap dim; snow
  (drifting layers).
- `shawl`: `coat` (painted where it lies; held up and turned to the left at `lay` 0), `hands` (with the coat; from
  `lay` 0.8 they let go — down and gone), snow.

## Checked

A trial spec with the five inserts (`sheets/closeups/closeups-trial.json` beside the world's clones, not a scene of
the world), rendered on the GPU: each insert at the start and at the end of its keys, 16:9, and at 21:9 — the
backgrounds full to the edges, the points where the hands and the things are.
