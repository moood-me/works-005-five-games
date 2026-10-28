# Saville Row (`saville-row`) — engine 3

The prologue and the epilogue (rpg docs/vokrug-sveta/scenes.md). A London street at night in fog, a panorama along
it. The people are the engine's (the world's cast `cast`), the film is in beats (`beats`), the colours and the gas —
`light`. The world's language: modern, fine, minimal. Fogg's house — exact and cold, a row of identical fronts, order;
the main contrast — the dark wet street and the warm windows, the gas in the fog, the reflections in the roadway.
Inside the house — clocks.

## How it is made (engine 3)

- **Nothing is painted again over time.** The paintings read neither time nor the scene's keys: all painted once, in
  daylight colours. What moves — layers, `animate`, shaders, particles.
- **The hour is the scene's light.** The base `light` — a grey London day; `looks`: `night` (the ambient light blue and
  dim, `inside` 1 — at night the rooms are no darker than the street), `fog` (haze 0.8, `hazeGlow` — the gas's halos in
  the fog), `sunday` (morning: the fog thinner, a warm tint, `shafts` — a low sun `sun` behind on the right shines in
  the haze).
- **The sky** (`sky`) — the shader `sky.wgsl`: fog from top to bottom in the colours of London's hour
  (`light.london(night)`; on the Sunday morning paler and warmer), slowly drifting thickenings of fog, a warm patch of
  sun on the right. The colours are given by `lib.skyMotion` as uniforms (worked out only when `night`/`sunday`
  change).
- **The gas.** The street lamps — `light.gasLamp` in parts (`lamps`, `near_lamps`), each its own `e.light`; `lights`
  give them `reach` 8. Their animate (`lib.lampsMotion`) gives each `e.glow(name, light.gas(night))` — the glow and the
  light go out together. The halo in the fog — `hazeGlow`, not painted.
- **The windows of Fogg's house.** The rooms — cards `inside` behind the front; each has a gas bracket
  (`lib.bracket`): the glass tulip painted dim, the burning one — the layer `lit`, its transparency the window's key
  (`lib.roomMotion`); the room's light — `lights` `of` the bracket with `on` = the window's key (puts out the glow too).
  The lamp on the desk in the study is part of the room; its burning edge — the layer `lit` with `depth` 1.3 (where the
  desk is).
- **The club** (`club_rooms`, glows) — the shader `club_rooms.wgsl`: the saloons painted dark and (layer 1) lit, the
  chandeliers — layer 2; shown lit as the gas burns (the uniform `gas` from the animate), the warm light — `emission`.
  Its `hall` and `saloon` — `e.glow` by the gas.
- **The fog** — the particles `mist` (the preset `smoke`: big soft wreaths over the whole street, drifting slowly,
  see-through — the gas shines through them), how much — `fog`; `droplets` — drizzle in the air (the preset `dust`:
  seen only in the lamps' light); coal smoke from four chimneys (`smoke1…4`, from the points `chimneys#s5, s7, s9,
  s12`).
- **The roadway** — the plane `road` (wet cobbles, `reflect` with `rough` 0.4 — the lamps and windows stretch along
  it), `pavement` (flags, a weaker mirror), `side_street`, `pavement_near`; the kerb `kerb`. The street — from −100 to
  110 m (`plan.street`): further than where the cabs come out from.
- **The carpet-bag** (`bag`) — painted full (the layer `bag`) and its clasp (the layer `clasp`); the animate grows it
  by `bag` (scaleY from a half), shows the clasp at 1, sets the point `bag#bag` at its mouth.
- **The cheeks of the steps and the dormers** — now at every house: a card at Fogg's house (`cheeks_l` 270, `cheeks_r`
  90, `dormer_l`, `dormer_r`) and a part at each neighbour's (the parts of a turned card lie in its plane: `dz` —
  along the street).

## The street lives (`traffic`)

- **The cabs** `cab` (the far lane, going right, to the club; a bay) and `cab2` (the near lane, going left — London
  keeps to the left; a grey). A cab is one card side on (`lib.cab`): the cab, the cabman up behind, the shafts, the
  horse. The wheel, the body, the head, the tail and eight pieces of legs are layers; `lib.cabMotion` rolls the wheel
  and leads the trot by the ground gone (`<id>_across`): the legs go as fast as the cab goes — they never slide; the cab
  stands — the horse stands (the legs' swing by the speed, with a run-up). The diagonal pairs together, the knees bend
  on the carry, the body sways twice a step. The cab's lamp — `e.light` `lamp`, burning by the gas; `lights`
  `cab_lamp`, `cab2_lamp`.
- **The passers-by** `walker1` (a top hat), `walker2` (a lady), `walker3` (a bowler) — the engine's people (the cast
  `cast`, a `look` of their own), walking along the far pavement by the kerb (Fogg and the others — nearer the houses)
  from one end of the street to the other at their own pace.
- `script.js`, once a second: whoever stands at an end (a cab — at the end of its lane, a passer-by — at the end of
  the street) is free; with a probability by `traffic` he is sent to the other end (a cab — `path` at 3.6–3.8 m/s; a
  passer-by — `walk`). A free passer-by is not seen (`_here` false). All by the state: a restored scene goes on.
- The beats set `traffic` in their `from` (`lib` `STREET`): where the camera stands on the far pavement close to a
  person — 0 and the passers-by taken away (else a passer-by goes between the camera and the hero); the wide shots
  (`dusk` 1, `to_club` 0.6) — the street lives.

## Keys

| Key | What | By default |
| --- | --- | --- |
| `night` | 0…1: 0 — a grey day, 0.5 — dusk, the gas is lit, 1 — night | 1 |
| `fog` | 0…1: how thick the fog is | 1 |
| `sunday` | 0…1: the Sunday morning (with `night` 0): the fog thinner, a low sun | 0 |
| `win_hall`, `win_study`, `win_bedroom`, `win_dressing` | 0…1: the light in the hall, the study, the bedroom, the dressing-room | 1, 1, 0, 0 |
| `gas` | 0…1: the gas-burner in Passepartout's attic (the window `attic`) | 0 |
| `door` | 0…1: the door swings open into the hall (`door_leaf` — the leaf's degrees, led by `script.js`) | 0 |
| `bag` | 0…1: the carpet-bag on the top step: 0 — none, then stuffed so far, 1 — clasped | 0 |
| `traffic` | 0…1: the street's life — cabs and passers-by | 0.5 |
| `cab_across`, `cab2_across` | where the cabs are (metres along the street) | at the ends |
| `beat` | a beat of the film | null |
| `runner` | who runs in `run_out` / `run_back`: `passepartout` or `fogg` | passepartout |
| `fix_present` | Fix under the lamp by the door (sets `fix_here`) | 0 |
| `with_pp`, `with_aouda`, `with_fix` | the companions (for the game; `lost`, `sunday`) | 1, 0, 0 |
| `packing` | 1 — «Ten minutes» (`pack` sets it, the other beats put it back): what follows works only then | 0 |
| `pp_in` | `none` · `hall` · `study` · `bedroom` · `dressing` · `attic`: the room Passepartout is in — his shadow in its window, its light on, the other rooms' out (0.3 s; script.js) | none |
| `fly`, `fly_what` | each rise of `fly` past a half: a thing (`shirt` · `stockings` · `coat` · `bradshaw`) flies out of his window into the bag (`thing_a/d/e`, `thing_on` — led by script.js) | 0, shirt |
| `door_lamp` | 0…1: the lamp by Fogg's door lit (with the gas); `lost` lights it | 1 |
| `cab_to` | «The cab»: how far along the way to the club (0…1) the game urges the cab — it goes there (script.js), the camera with it | 0 |
| `cab_at` | where the cab is on that way (the scene sets it); 0.98 — at the club | 0 |
| `cab_pace` | how hard the cab is urged: its horse throws its head the more | 0 |
| `beat_next` | the beat the game names next (the module beats makes its opening ready) | — |

## Points and elements for a choice

`win_hall`, `win_study`, `win_bedroom`, `win_dressing`, `attic`, `door` (the middle of the leaf; `door#handle`),
`bag#bag`, `club` (the club's entrance), `lamps#door` (under the lamp by the door — Fix's place), `lamps#door_flame`
(its globe), `cab` (the cab; `cab#horse` — the horse's head), `chimneys#s0…s14` (the chimneys left to right).

## The people and the film

The people — `fogg`, `passepartout`, `aouda` (in her travelling dress: the cast's `wears.aouda_dress`), `fix` (the
cast `cast`) and the passers-by. Passepartout packing is no person: his flat shadow in a window (`pp_hall` …
`pp_attic`, lib.js `ppFigure`, `glows` — dark against the lit room whatever its light), rushing to and fro
(`ppMotion`). Each one's keys — `<id>_a`,
`<id>_d`, `_do`, `_turn`, `_look`, `_reach`, `_with`, `_wear`, `_gait`, `_here`. The ground for the people —
`relief.js`: the roadway 0, the pavements a kerb higher (0.14), Fogg's steps — one slope (0.14 → 0.84), beyond the
door — the hall's floor (0.84).

The beats — `lib.film(scene)` (the module `beats`): `script.js` plays them for the game (`beat`, at its end
`beat:<name>`), `showcase.js` — the showcase (the order `SHOWCASE`, the game's lines said there). The people walk at
their own pace, the motions take as long as they take; the moments by events (got there, stepped over the threshold),
a pause only where a person hesitates or reaches for the bell. `from` — a cut, if the beat does not come after its
`after`.

| Beat | What | after |
| --- | --- | --- |
| `home` | Fogg along the far pavement, to the steps, up, to the door, opens it, goes in; the hall, then the study light up | — |
| `news` | Passepartout on the threshold (closer), the hall's light behind him, spreads his hands (`surprised`) | home |
| `pack` | «Ten minutes»: the whole front from across the street (a little nearer, higher, turned up: `PACK_VIEW`) — every window and the bag on the top step in the middle 4:3, the attic's gas lit, the street living; the beat only brings the frame (`packing` 1) — the shadow, the lights and the things then follow the game's keys | — |
| `out` | Fogg comes out, Passepartout after him — takes the carpet-bag from the top step; Fogg waits for him below; both go right, into the fog | — |
| `proposal` | the evening: Fogg out onto the top step, Aouda after him; she looks at him (`proposal:asks`), he turns to her (`proposal:answers`), their hands (`proposal:hands`); the two in three-quarters, Fogg 0.75 of the frame | — |
| `run_out` | the door flies open: the runner, hatless, down and to the left, at a run | — |
| `run_back` | the runner out of the fog at a run up the steps into the open door | run_out |
| `fix_paper` | Fix under the lamp with a newspaper hesitates, looks at the door, at the street, makes up his mind, goes up and rings | — |
| `sunday` | Sunday morning: Fogg on the top step reading his paper, lowers it (`sunday:date`), laughs, his head back (`laugh_up`, `sunday:laugh`); with `with_pp` Passepartout comes out and laughs with him | — |
| `cab` | «The cab»: the cab in the fog, the camera with it; it goes where `cab_to` sends it (script.js), `cab_at` says where; at 0.98 `cab:arrived`, Fogg jumps out and runs up the club's steps (`club_steps` is walked on), `cab:in` at its door | — |
| `to_club` | a cab at a trot along the street to the Reform Club, the camera with it (`camera_x` → 50) | — |
| `lost` | the evening, on the steps — Fogg, Aouda, Fix (by `with_*`); the lamp by the door dark; Passepartout (else Fogg) goes down to it, his arm up to its globe, it lights (`lost:lamp`) | — |
| `pp_returns` | morning: Passepartout with a bundle, at the steps looks at his watch (`watch_look`), goes up, rings | — |
| `gas_off` | the attic's window close (the operator on `attic`); the gas goes out (`gas_off:out`), ~4 s | — |
| `dusk` | dusk on 2 October: the night comes down (`night` 0.2 → 0.8), the gas is lit, the light comes on in the study; cabs and passers-by (the showcase's) | — |

The scene tells the game the beats' moments (`scene.tell`), besides `beat:<name>`: `home:door` (his hand on the
handle), `home:in`, `news:at-door` (Passepartout has stopped on the threshold — for his line), `out:bag`, `out:away`,
`run_out:out` (over the threshold), `run_out:away`, `fix_paper:rings`, `run_back:in`, `to_club:arrived`,
`pp_returns:watch`, `pp_returns:rings`, `proposal:asks`, `proposal:answers`, `proposal:hands`, `sunday:date`,
`sunday:laugh`, `lost:lamp`, `gas_off:out`, `cab:arrived`, `cab:in`. Not made of scenes.md: the key `cab_out` (no one
reads it: `cab:arrived` and `cab:in` say the same).

The shots on people — the operator (`camera_target`, `camera_shot` — the person's height in frame heights). People
walk along the houses at `WALK_D` 18.8 m: the operator's camera (0.7–0.8 — 2.4 m in front of the person) stands then
between them and the lamps by the kerb (15.9 m), no post passes before the lens. The lamp by the door (`lamps#door`)
stays at the side of the frame when a person is at the steps. The gas shines for 10 m (`reach`): between the lamps
the street does not fall into darkness.

## What there is not

- **People in the windows of the upper floors** — none (a floor for people would be needed on the storey above the
  hall): the proposal, the lamp and the Sunday are on the steps; packing, Passepartout is a flat shadow in the windows.
- **A cab at Fogg's house** (`home`, `out` by scenes.md) — there are cabs, but Fogg does not get in or out: the motions
  «get into a cab» / «get out» are needed (Kimodo). Fogg comes and they leave on foot, as in v1.
- Close-ups (`news`, `proposal`) — the world has no module `closeups`: the operator's medium shots.

## The light after the tone curve was changed (2026-10-11)

The night and the fog — as they were (lighter than v1: the passers-by and the house read). The morning `sunday`:
`ambient` 0.5 → 0.65.

Shortened silence (2026-10-21, the browser play): `cab` — Fogg out of the cab and off; a cut (made ready during the race) near the club's steps, him half-way: `cab:in` about 3.8 s after `cab:arrived` (was 7.4).

## Contract for the check

```json
{"beats": {
  "home": {"after": [], "tells": ["home:door", "home:in"], "seconds": 14, "show": false},
  "news": {"after": ["home"], "tells": ["news:at-door"], "seconds": 5, "show": false},
  "pack": {"after": [], "tells": [], "seconds": 1, "show": false},
  "out": {"after": [], "tells": ["out:bag", "out:away"], "seconds": 14, "show": false},
  "proposal": {"after": [], "tells": ["proposal:asks", "proposal:answers", "proposal:hands"], "seconds": 13, "show": false},
  "run_out": {"after": [], "tells": ["run_out:out", "run_out:away"], "seconds": 7, "show": false},
  "run_back": {"after": ["run_out"], "tells": ["run_back:in"], "seconds": 7, "show": false},
  "fix_paper": {"after": [], "tells": ["fix_paper:rings"], "seconds": 9, "show": false},
  "sunday": {"after": [], "tells": ["sunday:date", "sunday:laugh"], "seconds": 10, "show": false},
  "cab": {"after": [], "tells": ["cab:arrived", "cab:in"], "seconds": 5, "show": false},
  "to_club": {"after": [], "tells": ["to_club:arrived"], "seconds": 26, "show": true},
  "lost": {"after": [], "tells": ["lost:lamp"], "seconds": 10, "show": false},
  "pp_returns": {"after": [], "tells": ["pp_returns:watch", "pp_returns:rings"], "seconds": 14, "show": false},
  "gas_off": {"after": [], "tells": ["gas_off:out"], "seconds": 4, "show": false},
  "dusk": {"after": [], "tells": [], "seconds": 24, "show": true}
},
"points": ["win_hall", "win_study", "win_bedroom", "win_dressing", "attic", "door", "door#handle", "bag#bag", "club", "lamps#door",
  "lamps#door_flame", "cab", "cab#horse", "fogg", "passepartout", "aouda", "fix"],
"offers": [],
"party": {"with_aouda": 0, "with_pp": 1, "gas": 0},
"acts": {}}
```
