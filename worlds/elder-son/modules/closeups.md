# closeups — hands and things close (engine 3)

> **State (2026-10-15, stopped by the owner's order):** this file is the agreed API, there are no shots yet.
> `closeups.js` on the branch `ss/people` holds only the hand function of “Scarlet Sails v3” (with the arm's thickness
> `w`, a knitted and a quilted sleeve, the old hand's veins); the five shots, `paint` and `live` are not in it — the
> module does not work for a scene yet. Merged into `env/malay/three` and `env/dev` as it is, paused.

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
| `box` | `box` | the oilcloth under the lamp; on the left Sarafanov's old hand (the cardigan's sleeve), on the right Busygin's young palm up; a silver snuffbox with a worn pattern | the mode — **the key `box_mode`** (`take` · `give`, by default `take`), the painting reads it. `take`: `finger` [4] 0…1 (0) — the young hand's fingers close on the snuffbox (the forefinger first); `old` 1…0 (1) — the old hand goes off to the left out of the shot. `give`: `push` 0…1 (0) — the snuffbox slides over the oilcloth from the young hand to the old; `old_close` 0…1 (0) — the old fingers close on it | `box#finger1…finger4` — the young hand's fingertips (left to right); `box#box` — the snuffbox (moves with `push`); `box#old` — the old palm (moves with `old`) |
| `strap` | `strap` | the rucksack's canvas strap from below up: above, Vasenka's thin hand pulls (the padded jacket's sleeve), lower Busygin's fist holds it (the coat's sleeve); behind them — the lit open door of the carriage, snow | `pull` 0…1 (0) — the strap creeps up out of the fist (towards 1 — the strap's end comes out of the fist); `grip` 0…1 (1) — the fist clenched (0 — open); `door_bg` 0…1 (0) — the carriage door behind them shuts (the light in the doorway narrows) | `strap#grip` — Busygin's fist |
| `shawl` | `shawl` | from behind: Nina's shoulders in a knitted shawl, the plait, snow flying; up on the right — the warm light of a window; Busygin's hands hold his coat by the collar over her shoulders | `lay` 0…1 (0) — the coat comes down on her shoulders (from 0.8 — it lies there, the hands let go) | `shawl#coat` — the coat's collar (moves with `lay`); `shawl#shoulders` — her shoulders |

The insert's name with no point (`hands`, `tea`, `box`, `strap`, `shawl`) — the main thing in the shot: between the
palms, the spout, the snuffbox, the fist, her shoulders.

## Where the points stand

Numbers — in frame heights from the top left corner of 16:9 (x 0…1.78); on 4:3 and 21:9 all is moved to the middle
the same way (the shot is painted from the middle). All — in the middle 4:3 (x 0.22…1.56), not above y 0.15 and not
below 0.82. The exact numbers — below, once the shots are painted.

## Layers (what `live` moves)

The layers and the motions — inside the module; the scene need not know of them. A shot is painted once (`box` —
again at a change of `box_mode`), while it is open the code does not paint it anew.
