# The Grays' Castle — engine 2

The library hall of the castle where Gray was born “and everything was ordained for ever”. The world's language: modern, fine, minimal,
clean forms; here — dark gold. A tall dark hall, the polished floor reflects the windows, the fire, the lamps. On the left two
tall windows in deep reveals (beyond them the park and, far off, the sea): after noon the sun lays long slanting
strips through them on the floor, dust hangs in the beams. The fireplace is one slab of light stone with a dark firebox. On the wall two large pictures under
their lamps: a crucifixion and a ship on the crest of a wave. On the right books from the floor to the ceiling, in their thickness — the door to the mother's
rooms. The father's armchair by the fire, the table by the windows. No scarlet.

Moved over from v1 (the world `pavel/alye-parusa`) in place: the same elements, keys, points, beats. The game plays the beats one at a time
(the key `beat` = a name; once it has ended the scene tells `beat:<name>`; the world's module `beats`); outside the game — its own showcase
(`showcase.js`): all the beats in the order of `lib.js ORDER`.

## The space

Metres: across (to the right of the start), in depth, up from the floor. The hall: across −4…4.5, in depth −1.5…9, the ceiling 6 m. The camera
`roam` (the horizon 0.44): one may look round and walk 0.8 m aside, 0.6 m back, 2.5 m forward (`area`). The hall faces
north-north-west (bearing 340): the windows on the left — to the west-south-west.

| Element | What |
| --- | --- |
| `sky` | the world's sky all round (the module `sky`): painted once, the hour is its shader; the sun and the moon are layers where the hall's hour puts them (`lib.js SKY`) |
| `sea`, `park`, `trees` | beyond the windows: the sea far below (a mirror), the park 1.2 m below the floor — a lawn, paths, a hedge above the cliff; the trees are parts (`e.part`), their shadows on the lawn |
| `wall_left`, `wall_back`, `wall_right`, `wall_front` | the walls (`facing` 90, 180, 270, 0): the windows, the firebox and the door are cut out `evenodd` |
| `floor`, `ceiling` | dark polished oak (`reflect`, `lit`), the ceiling with beams (a plane facing down) |
| `jamb1`, `jamb2`, `jamb1n`, `jamb2n`, `sills`, `soffits` | the windows' deep reveals: the far and the near sides, the sills, the tops of the openings |
| `glass1`, `glass2`, `windows` | the panes (`glass`: at night the hall is in them; the sun and the moon come in through them — `through`; the window's daylight — `window_light1/2`) and thin bronze frames at the wall's outer face (their shadow in the sun's patches on the floor) |
| `hearth`, `mantel`, `hearth_floor` | the fireplace: a slab of light stone with an opening, the shelf, the slab of floor before it |
| `firebox`, `firebox_left`, `firebox_right`, `firebox_floor` | the firebox — a volume behind the opening; on its back wall the fire's glow (a layer, lit by the shader by `fire`) |
| `fire`, `flames`, `fire_embers` | the logs and the embers under them (a layer, lit by the shader by `fire`); the flames and the sparks are particles in the firebox (`amount: fire`), above the opening the wall hides them; the light `fire_light` comes only out of the opening — the fireplace casts its shadow |
| `crucifix`, `lamp_cross` | a large picture (the painting — `lib.js crucifixion`); the fresh paint over the nails is layers, growing by `nail1…3` (`lib.js dabs`, `dabsNow`); a brass lamp over it |
| `ship_painting`, `lamp_ship` | a picture: a ship on the crest of a wave. The frame and the sky are a painting, the far sea, the big wave, the ship — layers; `painting_alive` — a shader (`ship_painting.wgsl`): the swell runs, the wave breathes, the crest curls, the ship rocks on the crest |
| `ladder` | a library ladder by the wall: from the corner by the window (`ladder` 0) to the crucifixion (1); a shadow from the lamp over the picture |
| `armchair` (an unseen support), `chair_back`, `chair_side`, `chair_side_l`, `chair_seat`, `coat` | the father's armchair — a volume on the support, turned to the fire (`facing` 313); Gray's frock coat on its back — a layer, it comes down by `coat_on_chair` |
| `floor_lamp` | a floor lamp by the armchair: the shade glows by `lamps` (a layer, a shader) |
| `table_top`, `table_edge`, `table_end`, `table_leg`, `table_leg_far` | a long walnut table by the windows: the top as a plane, its edge and end, two supports |
| `table`, `note` | Gray's bundle (a layer, seen by `bundle`) and the points of the bundle and the note; the note is a plane of its own on the top (a layer, seen by `note`) |
| `candlesticks`, `candles` | two candlesticks; the candles' flames are a layer, burning and swaying in the shader by `candles`; each has its own light |
| `chair_near`, `chair_far` (+ `_seat`, `_legs`) | chairs at the table's ends: the back, the seat as a plane, the front legs |
| `shelves`, `shelves_side`, `shelves_lintel` | the wall of books on the right, over the door — from 3 m; the shelves' end by the door, the bottom of the shelves over the door |
| `mother_door` | the mother's door on its hinges at the far edge, a finger short of the floor; `door` opens it to her |
| `mother_floor`, `mother_wall`, `mother_wall_far`, `mother_ceiling` | her room behind the door; there is `mother_light` |
| `dust` | the dust in the hall's air — seen in the sun's beams |
| `canvas` | a close-up of the canvas with the crucifixion — an insert (`insert`, the key `canvas`): the nails, the boy's hand with the brush goes to the nail being painted over |
| `hands` | a close-up of the hands — an insert of the shot `hold` of the module `closeups` (the key `hands`): the ring on Gray's palm, over it his mother's four fingers; the fingers are opened by `grip1…grip4` |
| `card` | a close-up of an old cask's bottom — an insert of the shot `cellar` of the module `closeups` (the key `card`): words under the dust, the boy's hand wipes the dust off (`dust`) |

## Keys

Described in the scene's `states`.

- `hour` 0…1 — as in the whole world; 0.6 by default, after noon. The hour's light — the looks `day`, `dawn`, `dusk`, `night`
  and `sun_light`, `moon_light`: they are kept by `sky.follow` in `script.js`. No painting reads the hour.
- `fire`, `lamps` (the lamps over the pictures and the floor lamp), `candles` — 0…1.
- `ladder` 0…1 — the ladder from the corner to the crucifixion. `nail1`, `nail2`, `nail3` 0…1 — a dab of fresh paint grows along the arm
  (along the feet), then down along a drip, till the nail is not seen; nothing is painted anew.
- `painting_alive` 0…1 — the waves on the canvas move, the ship rocks on the crest.
- `door` 0…1 — the mother's door open to her; `door_light` 0…1 — her light is lit.
- `bundle`, `note`, `coat_on_chair` 0…1.
- `lilian_candle` 0…1 — the candle in the mother's hand is lit (the scene's light `candle_hand` at the flame, `lilian#flame`); `letter` —
  the epilogue: the letter in her hands (1) or the candle (0) — the game's key, read by the beat `window_end`.
- `canvas` 0/1 — the close-up of the canvas open.
- `hands` 0/1 — the close-up of the hands (the shot `hold`) open; `grip1…grip4` 1…0 smoothly — the mother's finger holds → let go (moved by
  the game, read only by the insert's `animate`).
- `card` 0/1 — the close-up of the cask's bottom (the shot `cellar`) open; `dust` 1…0 — the dust wiped off (read only by `animate`).
- `pried` 0/1 — set by the game before `let_go`: 1 — the player opened her fingers (she stays with her empty hand held out), 0 —
  she let go herself (she raises the candle).
- The play's keys (set by the game on opening the scene; no `from` sets them): `letter` (0), `home` 0…1 (0.5) — the warmth
  of the house: `fire` and `lamps` in `return`, `stays`, `spring`, `one_evening`, `window_end` = 0.35 + 0.65·`home`; `leave` (`farewell` ·
  `note`; `farewell`) — how Gray left, read by `return` and `stays`.
- `beat` — the film's beat; `camera_*` — the engine's; `gr_a/gr_d/gr_e`, `li_a/li_d` — where the people are (gr_e — the height:
  a rung of the ladder); the keys of the engine's people — `grey_*`, `lilian_*` (people.md).
- Internal (kept by `script.js`): `ladder_across`, `door_facing` (from `ladder`, `door`); `grey_pulls` — while 1,
  the ladder follows the boy (`ladder` by `gr_a`).

Points for the game (`e.at`): `wall_left#window1`, `wall_left#window2`, `hearth#fireplace`, `fire#fire`,
`crucifix#crucifix`, `crucifix#nail1…3`, `ship_painting#ship`, `ladder#ladder` (and `ladder#rail_hi`, `rail_lo` — where
the boy's hands are), `chair_back#armchair`, `coat#coat`, `floor_lamp#floor_lamp`, `table#bundle`, `table#note`,
`candles#candles`, `shelves#shelves`, `mother_door#mother_door`; on the close-ups — `canvas#nail1…3`, `hands#finger1…finger4`
(the mother's fingers), `card#barrel` (points of the screen while the insert is open; the last two are set by the module `closeups`). For a choice: `mother_door`, `table`, `lilian`.

## Light

Everything is painted once, in the day's colours; the light is the engine's. The hall is inside (`inside`, `light.inside`). The sun and the moon are
far sources from the sky's layers (`from: "sky#sun"`, `"sky#moon"`), they come in only through the two panes (`through`): strips
on the floor, long in the evening; beams in the air (`shafts`), dust in them (`dust`); the frames cast their shadow into the patches.
`window_light1/2` (`daylight`, `of` the panes) — the windows' diffuse light. The fire (`fire_light`, `of: fire`) comes out of
the opening: the fireplace casts its shadow. The lamps over the pictures (`cross_light`, `ship_light`) and the floor lamp (`reading_light`) — by
`lamps`. The candles — the light of the flames themselves (`candle_left`, `candle_right`). `mother_light` — in her room: the wall with the door and
the door itself cast its shadow, it comes into the hall only through the open doorway and the gap under the door.

## The people and the beats

The people are the world's cast (`cast`). Gray is one element `grey`: a boy (`grey_boy`), at fifteen and at twenty — the looks
`grey_teen`, `grey` (`grey_wear`), without the frock coat — `grey_shirt`; the mother — `lilian` (in mourning — `lilian_black`). The beats are
`lib.js film(scene)`: the director's sequences; people walk at their gait's pace, the “once” motions last as long as they
last; seconds — only the pauses of a gaze. Each beat's `from` is the whole state (the game may begin with any); where a beat
goes on from the one before (`after`), it goes on from what there is. No fades of the scene's own (time passing between beats — a cut;
the black between, if any, is the game's); the cuts are made ready ahead (`s.shot`).

The camera — two ways (`lib.js`): the hall's composed shots — by the keys `camera_x/z/yaw/pitch` (v1's numbers: across the table
at Gray at night, the mother's door, Gray coming in, the window; its own: the corner with the ladder along the far wall, the supper — across the table
from the side, the embrace by the ladder from over her shoulder, her door from the depth of the hall with his way to the exit, the window across the hall); the shots on the boy on the ladder — the operator (`camera_target: grey`, his height in frame heights). The operator in `roam`
stands on the straight line from the start to the target: where there is furniture on it (the chair at the table before the corner with the ladder) — the shot is composed by keys.

| Beat | after | What is seen | The scene tells |
| --- | --- | --- | --- |
| `boy` | — | Day. The boy, backing, drags the ladder along the wall under the crucifixion (the gait `drag`, his hands on the rail), looks at the picture, takes the paints and the brush from the floor | `boy:ladder` (the ladder in place), `boy:paints` (the paints in his hands) |
| `brush` | — | Nearer: on the ladder he paints on the canvas; a cut into the close-up of the canvas (`canvas`) — under “Brush” (`nail1…3`) | `brush:canvas` (the close-up open) |
| `paint_over` | brush | For showing only (in the game it is “Brush”): the nails are painted over one after another | |
| `mother_in` | brush, paint_over | A cut to her door: the door opens, the mother comes in and stops, looks at him; a cut to the ladder: he looks round, she comes up and embraces him on the ladder | `mother_in:stops` (she stopped — under “Arthur…”), `mother_in:holds` |
| `mother_close` (close up) | mother_in | From over her shoulder, from the side and behind and near (the camera by keys at the table's edge, moving in a little; straight from behind, she hid him with herself): her arms round him, his hand with the brush lowered, behind them the picture with the nails painted over. One line takes it out of the chapter | |
| `ship_painting` | — | Evening, the lamps, the fire: the boy before the picture with the ship, the camera moves in, the waves on the canvas come alive | `ship_painting:alive` |
| `cellar` | ship_painting | The camera stays at the living picture while the insert is made ready (1 s); a cut into the insert `card`: the boy's hand wipes the dust off the cask's bottom (`dust` 1 → 0 over 4 s), the words can be read; it holds for 3 s | `cellar:read` |
| `night` | — | Years later: Gray at fifteen at the table with a bundle, the candles; a strip of light under the mother's door. Under a choice | |
| `farewell` | night | He goes to the door, the camera after him; the door opens — the mother with a candle (she holds it before her: `lib.js CANDLE`); she looks at the ring, holds out her hand, the ring is in his palm; a cut into the insert `hands` (the shot `hold`, `grip1…grip4` = 1) — under “Let go” | `farewell:at-door` (he stopped at the door — the knock), `farewell:open` (she is in the doorway — the lines), `farewell:ring`, `farewell:hands` (the insert open) |
| `let_go` | farewell | A cut into the hall, the shot from the depth of the hall (`lib.js LEAVING`): on the left she is a dark silhouette in the light doorway, he with his bundle goes from her to the exit, towards the camera and to the right, looks back and stops in the frame. `pried` 0 — she raises the candle higher; 1 — her empty hand stays held out after him | `let_go:looks-back` |
| `note` | night | At the table: he lays down the note, takes the bundle | `note:laid` |
| `note_goes` | note | A cut to the mother's door: he goes to the exit, passes by, having looked back at it, goes; the light under the door is lit | `note_goes:passes`, `note_goes:gone` |
| `return` | — | Day: Gray at twenty comes in in a frock coat; the mother in black by the father's armchair turns. `leave` = `farewell` — she takes a step towards him; `note` — she stays by the armchair, his note in her hands before her (the part `letter`, the stance `read_stand` holds it), looks at him | `return:turns` |
| `stays` | return | He goes behind the armchair's back, takes off the frock coat and hangs it on it (`coat_on_chair`); if she has his note in her hands (`leave` = `note`), she meanwhile looks at it and puts it away in her dress (the hand to the hip, the part `letter` taken off, the stance `sad_stand` again); a step to his mother — she takes his hand. `from` — as after `return`: the house's warmth by `home`, the note by `leave` | `stays:coat`, `stays:hand` |
| `spring` | — | A spring day (`hour` 0.45): the shot across the hall onto the near window (`lib.js SPRING_VIEW`): the mother at the window, Gray beside her in his frock coat, both with their backs to us; she turns to him — in profile, he looks at her | `spring:turns` |
| `one_evening` | — | A supper for two by candlelight: they sit at the table's ends, eat; he looks at the window, at her, at the window again | `one_evening:window` |
| `window_end` | — | The epilogue, night: the mother at the window — with a letter in her hands before her (`letter` 1; the stance `read_stand`) or alone with a candle | |

## Changed against v1

- `beat` by default `null` (v1: `film` — the montage for the viewer is now the showcase); the module `film` → `beats`.
- There are no internal `sun_bearing/height`, `moon_bearing/height`: the sun and the moon are the sky's layers, the light comes from them.
- The element `reveals` → `jamb1`, `jamb2` (and the near `jamb1n`, `jamb2n`); `glass` → `glass1`, `glass2`; new: the parts
  of the chairs and the armchair, `table_end`, `note`, `shelves_lintel`, `flames`, `fire_embers`, `dust`, `canvas`.
- The points `table#bundle`, `table#note` are always marked (in v1 — only while the thing lay there).
- `brush` ends on the close-up of the canvas (the insert `canvas`); `mother_in` begins with a cut to the door.
- In `stays` Gray first comes up to the armchair's back and hangs the frock coat with his hand (in v1 the coat appeared on the armchair a metre and a half
  away from him), then takes a step to his mother — their hands meet.
- In `farewell` the mother holds out the ring with her left hand (the candle in her right).
- The fades at the start of every beat are removed.
- The shots: `boy` — from the depth of the hall along the wall (the boy a third of the frame; in v1 a wide shot from the start), `one_evening` — across
  the table from the side: he on the left, she on the right, the candles between them, the windows behind them (in v1 from the start: the mother behind the candles was a dot).
- The light is linear: `ambient` by day 0.8, at night 0.78 of a cold `#a9b9dc` (v1: 0.4 and 0.3), `inside` 0.7. The night is lighter than v1's
  on purpose: the people and the action read in every shot, the night is in the colour and the contrast (a cold hall, warm fires): the moon
  through the panes 1.5, the candles 1.4 at 6 m (stronger — the wall by the table burned out to ginger at supper), the mother's candle 2.4, the fire 3.0 at 10 m, the light in the mother's room 2.6. The air (`haze`) — as in v1.
- The close-ups `cellar` and `hold` are the inserts `card` and `hands` by the shots of the world's module `closeups` (the painting and the points are its;
  the scene names the shot and the keys). The mother's face is not done close up: there is no head to the camera (the owner's decision), it is carried
  by `mother_close` from behind.
- The play's steps: `home`, `leave` are read by the beats `return`, `spring`, `one_evening`, `window_end`; the music: the hint “four
  rising notes” — weight 0 (the game plays the motif).

## Waiting for the engine

- **The sun's beams in the hall's air.** `shafts` scatters the light in the scene's haze, and there is one haze for everything: at `haze` 0.14 (the park and
  the sea beyond the windows are seen) a beam 3 m long scatters almost nothing, with a thick haze the whole hall goes grey and the view beyond the window goes white. For now
  the beams read by the motes in them (`dust`) and by the patches on the floor. A haze “inside”, or beams only beyond the panes, is needed.
- **The trees' reflection in the sea** (a mirror plane 60 m below) — in steps along the edge.

## What must not be broken

- The paintings do not read what moves: `hour`, `fire`, `lamps`, `candles`, `nail1…3`, `painting_alive`, `bundle`,
  `note`, `coat_on_chair`, `grip1…grip4`, `dust` — only `animate`, shaders, particles, `place`.
- Light is not painted: the patches on the floor are light through the panes, the haloes — `hazeGlow`.
- `sky.wgsl` and the sky's `uniforms` are written by `node tools/sky.js gray-castle` (the module `sky`).

## Contract for the check

Read by the check of the game's branches; equal to the scene's code (`lib.js film`, `scene.json`). `seconds` — the beat's target length.

```json
{
  "beats": {
    "boy": {
      "after": [],
      "tells": [
        "boy:ladder",
        "boy:paints"
      ],
      "seconds": 12
    },
    "brush": {
      "after": [],
      "tells": [
        "brush:canvas"
      ],
      "seconds": 4.5
    },
    "paint_over": {
      "after": [
        "brush"
      ],
      "tells": [],
      "seconds": 7,
      "show": false
    },
    "mother_in": {
      "after": [
        "brush",
        "paint_over"
      ],
      "tells": [
        "mother_in:stops",
        "mother_in:holds"
      ],
      "seconds": 14
    },
    "mother_close": {
      "after": [
        "mother_in"
      ],
      "tells": [],
      "seconds": 5
    },
    "ship_painting": {
      "after": [],
      "tells": [
        "ship_painting:alive"
      ],
      "seconds": 12
    },
    "cellar": {
      "after": [
        "ship_painting"
      ],
      "tells": [
        "cellar:read"
      ],
      "seconds": 8
    },
    "night": {
      "after": [],
      "tells": [],
      "seconds": 3
    },
    "farewell": {
      "after": [
        "night"
      ],
      "tells": [
        "farewell:at-door",
        "farewell:open",
        "farewell:ring",
        "farewell:hands"
      ],
      "seconds": 14
    },
    "let_go": {
      "after": [
        "farewell"
      ],
      "tells": [
        "let_go:looks-back"
      ],
      "seconds": 10
    },
    "note": {
      "after": [
        "night"
      ],
      "tells": [
        "note:laid"
      ],
      "seconds": 5
    },
    "note_goes": {
      "after": [
        "note"
      ],
      "tells": [
        "note_goes:passes",
        "note_goes:gone"
      ],
      "seconds": 6
    },
    "return": {
      "after": [],
      "tells": [
        "return:turns"
      ],
      "seconds": 8
    },
    "stays": {
      "after": [
        "return"
      ],
      "tells": [
        "stays:coat",
        "stays:hand"
      ],
      "seconds": 8
    },
    "spring": {
      "after": [],
      "tells": [
        "spring:turns"
      ],
      "seconds": 6
    },
    "one_evening": {
      "after": [],
      "tells": [
        "one_evening:window"
      ],
      "seconds": 8.5
    },
    "window_end": {
      "after": [],
      "tells": [],
      "seconds": 10
    }
  },
  "points": [
    "canvas#nail1",
    "canvas#nail2",
    "canvas#nail3",
    "hands#finger1",
    "hands#finger2",
    "hands#finger3",
    "hands#finger4"
  ],
  "offers": [
    "mother_door#mother_door",
    "table#bundle"
  ],
  "party": {
    "letter": 0,
    "home": 0.5,
    "leave": "farewell"
  }
}
```
