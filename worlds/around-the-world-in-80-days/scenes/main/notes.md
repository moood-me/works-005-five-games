# The Reform Club (`main`) — engine 3

The world's main scene: the club's saloon on Pall Mall, the prologue and the epilogue (docs/vokrug-sveta/scenes.md).
Moved from v1 (the world `pavel/vokrug-sveta`) as it stood: the same elements, keys, points, beats. The world's
language: modern and fine, clean planes and silhouettes, a large dark space, exact light, long reflections in a
polished floor; the warm (the fire, the lamp, the gas) against the cold (the fog behind the glass). The focus — the big
clock.

## The frame

Camera `picture`, horizon 0.55. The layers by depth: the street in fog (40 m), the wall with the windows (18 m), the
table under the lamp (7 m), nearest of all — the partition with the clock and the fireplace (8 m, on the right). What
is turned is turned by the engine (`facing`, planes): the window jambs (`jamb…` 90°, `sill…`, `soffit…`), the
partition's end, the door's leaves. The floor — a mirror plane (`reflect` strength 0.5, fade 5, rough 0.15), `lit`; the
felt (`felt`) — a plane at 0.76 m.

The fireplace is now a real opening: the partition (`partition`) cuts it out (`evenodd`), behind it a recess —
`hearth` (a sooty back wall 0.55 m behind the wall's face, `behind: partition`, wider than the opening — seen
slantwise) and its floor (`hearth_floor`). The fire — the particles `flames` (`fire`, `amount: fire`) and `embers` in
the recess, 0.3 m behind the wall's face: above the opening the wall hides them. The fire's glow on the back — the
layer `glow`, lit by the shader (`hearth.wgsl`: `emission`, the fire's breath — `u_time`, the strength — `fire`). The
mantelpiece and the fire's light — `fireplace` (as in v1: its point `fireplace#fire`, the light `fire_light`).

## The light

The saloon is painted in its own colours, as by day; the night is the scene's light. `ambient` 0.8 of a grey day, the
look `day` (0 day → 1 night) — towards night. The sources: `lamp_light` (the lamp, `lamp#bulb`), `fire_light`
(`fireplace#fire`, `on: fire`, flickers), `hall_light` (`hall#light`, `on: door`), three cold ones at the windows, and
the gas in the street — `gas1…3` (`lamps#lamp1…3`): `lamps.animate.js` puts them out by the hour (`e.glow`, the module
`light`, `gas`). `hazeGlow` — the halos of the lamp, the fire, the street lamps in the air (we no longer paint them).
Shadows: the table, the felt, Fogg's chair, the armchair — on the floor; the clock — on the partition. The people cast
their own.

The street is outside, lit by the scene's light (not `glows`): the houses (`street`), the crowd (`crowd`), the street
lamps (`lamps`), the fog (`mist`) are painted in daylight colours; the look `day` gives them the night, the lamps shine
on the crowd and the roadway (`pavement` — a plane behind the windows, 0.5 m below the floor). The fog glows by
itself — with the town's light, in the hour's colours (`light.london`): the scene's light does not darken it. What the
light does not do:
- the sky (`sky`) — the fog is painted once, the hour's colours (`light.london(day)`) are given to the shader by
  `sky.animate.js`;
- the windows of the houses opposite — the layer `windows`, lit by the shader `street.wgsl` by the gas (`gas` from
  `street.animate.js`);
- the fog over the houses — the street's layer `fog`: a share of fog, its colour the hour's, given by `street.wgsl` as
  its own light (`emission`), the houses under it fading by its share;
- the fog at the windows (`mist`, `glows`) — a painted density (in white), two layers of banks drift in `mist.wgsl`
  (`u_time`, wrapping across the box's width), the colour — the hour and the gas (`mist.animate.js`);
- the crowd — six groups as layers (`lib.js CROWD`): `crowd_outside` shows them in turn (`alpha`), each sways in its
  own time; the crowd's lanterns — the glows `l0…l25` with their group (`e.glow`).

## The clock

The case, the dial — painted once. The hands (`hour`, `minute`, `second`) and the pendulum (`pendulum`) are layers,
set by `clock.animate.js` from `minute` and `second`: the pendulum `cos(π·second)` (at its far point on every whole
second, its point `clock#pendulum` moves), the second hand steps on the whole ones. The case's glass — an opening in
the painting, behind it `inside`. `script.js` leads `second` smoothly (once a second to the next whole one; at 60 —
zero and `minute` + 1).

## Keys

| Key | What | By default |
| --- | --- | --- |
| `minute` | minutes from midnight (20:44 = 1244): the hands | 1244 |
| `second` | 0…60, smoothly: the pendulum, the second hand | 0 |
| `fire` | 0…1 the fire: embers → flame; particles, the recess's glow, the light | 0.75 |
| `door` | 0…1 the door: the leaves into the saloon, the hall's light | 0 |
| `crowd_outside` | 0…1 the crowd behind the windows (in groups) | 0 |
| `day` | 0…1 the hour: 0 a grey day, 0.5 dusk (the gas is lit), 1 night | 1 |
| `leaf_l`, `leaf_r` | the leaves' turn, led by `script.js` by `door` | 180 |
| `chair_back` | 0…0.4 m: Fogg's chair pushed back (`fogg_chair` stands `on: table`, `place.distance`) | 0 |
| `fogg_hat`, `cards_down` | the hat on the stand; Fogg's cards on the felt | 1, 0 |
| `beat` | a beat (below); `null` — none | null |
| `gentlemen`, `fogg_present`, `fogg_seated`, `with_aouda`, `with_pp` | the game's keys (as in v1) | |
| `with_fix` | 0/1: Fix comes in with `door` last, stands behind by the door (`IN.fix`) | 0 |
| `fix_bruise` | 0/1: Fix's bruise (the cast's `wears.fix_bruise`), set as he comes in | 0 |

Points: `clock#dial`, `clock#pendulum`, `door#door`, `door#handle`, `fireplace#fire`, `table#table`, `lamp#lamp`,
`papers#papers`, `armchair#armchair`, `hatstand#hat`, `wall#window1…3` — as in v1; new — `lamps#lamp1…3`, the cast's
parts (`stuart#watch`, `fogg#paper`…).

## The people and the beats

The people — the world's cast (`cast`), the keys `<id>_a`, `_d`, `_do`, `_turn`, `_look`, `_reach`, `_with`, `_wear`,
`_gait`, `_here`. The beats — `lib.js film(scene)` (the module `beats`): the director's sequences; the people walk at
their own pace (Fogg — `fogg_walk`, the gentlemen on the Friday — `run`), the «once» motions take as long as they take;
seconds only where time goes (the clock's countdown, the pause of a look). Each beat's `from` is the whole state; where
a beat goes on from the one before (`after`), it goes on from what there is. Where the people are after a «once» motion
(Stuart has risen, Fogg has laid his cards down) — the motion's `startOf` (`ended` in lib.js). The game: `beat` = the
name, the end — `beat:<name>`. Outside the game — the showcase (`showcase.js`, the order `lib.js ORDER`): countdown,
whist, wager, wager_down, leave, wait, door, no_door, friday, friday_in (about 110 s).

The camera — in two ways (`lib.js`). A shot on a person — the operator (`on(who, size, where the head is in the
frame)`: `camera_target`, `camera_shot` — the person's height in frame heights, `camera_frame`), v1's numbers: Stuart
and the dial over five backs 0.4 (a push-in over 5 s — `frame`), the whist across the table on Fogg 0.55, the wager
0.7 → 0.8 across the table, a little from above (`camera_x` −0.4, `camera_h` 0.55: Fogg's face seen), Fogg come in
0.7, Stuart in `no_door` 0.6, Fogg at the table on Friday 0.5. A shot of the room — the scene's picture shifted by the keys
(`view`: `camera_x`, `camera_z`, `camera_h`, `camera_look`): the door and the hat-stand from behind the partition's end
(z 9.6), the wide shot. In `leave`, once Fogg has risen, the operator draws back to the wide shot (`frame(s, WIDE, 3)`),
the cut to the door — when he has reached it. A cut waits for its shot (`s.until(() => shot.ready)`).

The scene tells the game the beats' moments (`scene.tell`), besides `beat:<name>`: `countdown:handle` (the door's
handle, :57), `whist:stuart-talks`, `wager:ready` (a living pause: Fogg holds his cards, his face to us, steady — the
player lays them down: the game waits for a touch on `fogg#hands`, then sets `wager_down`), `wager_down:cards-down`,
`wager_down:stuart-up`, `leave:up`, `leave:hat-on`, `leave:gone`, `door:fogg-in` (Fogg has stopped before them — for
«Here I am, gentlemen»), `no_door:watch-shut`, `friday:porter` (the porter at the table), `friday_in:round-him`, `countdown:fifty-five` (:55, about the 8th second).

| Beat | What |
| --- | --- |
| `countdown` | 20:44:47 → :57 (ten seconds of the clock). Stuart under the clock, his face to us over his watch (`with: watch`), the four round him turned to him (their faces in profile), their eyes from his watch to the dial; the clock over them, then in on Stuart; at :55 `countdown:fifty-five` (the game's count), at :56 a cut to the door (made ready ahead), at :57 the door gives |
| `whist` | 2 October, 19:10. Whist; Stuart folds his paper, speaks, looking at Fogg |
| `wager` | Fogg close with his cards, all eyes on him; the beat stops in a living pose (`wager:ready`) |
| `wager_down` | (after `wager`) Fogg lays his cards down (`lay_cards`, `cards_down`), looks at Stuart; Stuart rises (`rise_chair`) |
| `leave` | 19:25. Fogg rises (`rise_table`, `chair_back`), goes to the hat-stand (a cut to the door while he goes), puts on his hat, leaves; the door shuts |
| `wait` | 21 December, 20:43:10. Five at the clock, the crowd behind the windows |
| `door` | 20:44:57. The door flies open: Fogg comes in (behind him Aouda, Passepartout and last of all Fix — by the door — if `with_aouda`, `with_pp`, `with_fix`); the gentlemen turn round; a cut to Fogg once he has stopped |
| `no_door` | 20:45:00. Stuart shuts his watch, turns to the others |
| `friday` | Friday: Fogg at the whist table in his own place, his face to us over his paper; day — night — evening behind the windows, the fire higher and lower; a cut nearer: the porter comes up to the table and stands back by the wall |
| `friday_in` | (after `friday`) 20:45: the door wide open, the five run in (`run`) and stand round the table, round him |

Changed 2026-10-15: `wager` split into `wager` (before the cards, a living pause) and `wager_down`; Fix may come in
with `door`. Changed 2026-10-21: `countdown` begins at 20:44:47, not :37 (twenty seconds without a word were too
long: now ten, the handle at about the 10th second); the night's look a little lighter (`day`: ambient 0.9, its colour
`#bcc4dc` — `countdown` and `leave` were darkish). After the review (2026-10-21): the five round Stuart, their faces
to us; the room brighter (`brightness` 1.12; `fill` — a warm light over the room on our side, off the frame, on their
faces); no mantel shelf (its line at shoulder height read as arms); the floor's mirror only low things (`fade` 1);
Fogg on Friday at the whist table, his face to us (`fogg_seated` too), not in the armchair with his back to us; the
operator with Fogg as he leaves; the wager's close shot higher (his hands, `fogg#hands`, clear of the bottom). Looked at on the GPU (sheets/atw/london/main-*.png): the men before the
clock, the door, the wager across the table (Fogg's face lit under the lamp), the hat-stand and the door read.

Changed against v1: the beat `friday` split into `friday` and `friday_in` (at his own pace it went on for 35 s);
`beat` by default `null` (v1: `film`; the montage for the viewer is the showcase); `with_aouda`, `with_pp` — the game's
only (the beats do not set them); in `door` the shot is at the door at once (after `countdown` — the same cut), on Fogg
— once he has stopped, not at the 6th second; in `friday` the porter goes out of the door before the gentlemen run in
(in v1 he went to meet them). The people wait in the hall (`OUT`), not put there by a cut in the middle of a beat.

## What must not be broken

- The positions in `lib.plan` are shared (the windows, the street lamps, the partition, the fireplace's opening, the
  places). Move them there.
- The paintings do not read what moves: `day`, `fire`, `second`, `crowd_outside`, `chair_back` — only `animate`,
  shaders, `place`. A new element on `day` — its `animate`, not its painting.
- Do not paint light: halos — `hazeGlow`, patches on the floor — `lit`.
- Layers that move (the fog, the crowd) — wholly within the element's box.

## Waiting for the engine

- v1: the underside of a plane in the floor's mirror (the felt green from below) — check on engine 3.

Shortened silences (2026-10-21, the browser play): `whist` — Stuart speaks at 0.6 s; `wager` — `wager:ready` at about 1.3 s; `friday` — the days go by in 4 s, then a cut (made ready) nearer on Fogg, the porter a few steps off: `friday:porter` at about 6 s; the porter stands back by the wall (no walk out); `friday_in` — the operator draws back to the round shot.

## Contract for the check

```json
{"beats": {
  "countdown": {"after": [], "tells": ["countdown:fifty-five", "countdown:handle"], "seconds": 11, "show": false},
  "whist": {"after": [], "tells": ["whist:stuart-talks"], "seconds": 8, "show": false},
  "wager": {"after": ["whist"], "tells": ["wager:ready"], "seconds": 2, "show": false},
  "wager_down": {"after": ["wager"], "tells": ["wager_down:cards-down", "wager_down:stuart-up"], "seconds": 8, "show": false},
  "leave": {"after": ["wager_down"], "tells": ["leave:up", "leave:hat-on", "leave:gone"], "seconds": 18, "show": false},
  "wait": {"after": [], "tells": [], "seconds": 8, "show": false},
  "door": {"after": ["wait", "countdown"], "tells": ["door:fogg-in"], "seconds": 11, "show": false},
  "no_door": {"after": ["wait", "countdown"], "tells": ["no_door:watch-shut"], "seconds": 7, "show": false},
  "friday": {"after": [], "tells": ["friday:porter"], "seconds": 10, "show": false},
  "friday_in": {"after": ["friday"], "tells": ["friday_in:round-him"], "seconds": 9, "show": false}
},
"points": ["clock#dial", "clock#pendulum", "door#door", "door#handle", "fireplace#fire", "table#table", "lamp#lamp", "papers#papers",
  "armchair#armchair", "hatstand#hat", "wall#window1", "wall#window2", "wall#window3", "lamps#lamp1", "lamps#lamp2", "lamps#lamp3",
  "fogg", "fogg#hands", "stuart", "stuart#watch", "flanagan", "fallentin", "sullivan", "ralph", "porter", "aouda", "passepartout", "fix"],
"offers": ["fogg#hands"],
"party": {"with_aouda": 0, "with_pp": 1, "with_fix": 0},
"acts": {}}
```
