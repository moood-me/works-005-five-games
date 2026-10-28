# The square (`main`)

The square of Giancaldo: the prologue, chapters I, II, III, V, the epilogue (scenes.md "The square"). Engine 3, camera
`roam`, the shots — the keys `camera_*` (the constants `CAM` in `lib.js`). Modules: `cast`, `cinema`, `closeups`, `beats`,
`sky`.

**The scene is built by `tools/main.js`** (`node tools/main.js`): `scene.json` and all of `elements/` come out of it —
edit it (and the hand-written `lib.js`, `script.js`, `showcase.js`, `notes.md`), not `scene.json` or `elements/`.

The mood: the warm night of the past — honey stone, blue shadows, the amber beam, the booth's port, one or two warm
windows; the cool lilac 1988 — grey lime, the boarded-up Paradiso, warm only the mother's window; the grey morning of
the funeral and the demolition.

## The place (metres: x — across, east +; z — from the square's south edge, north +; the start (0, 0), looking north)

All in `lib.js` (`G`, `FRONTS`, `PAR`, `BANK`). The square x −12…12, z 0…26; the street to the bus to the south
(x −5…5, to z −34; at its end — the stop); the street to the sea in the north-east corner (x 9…12, to the north), at
its end a card of the sea with the moon's path (z 80, its top at the eye's level). West: Alfredo's house
(`alfredo_door`, z 0…6, the door z 3, the chair `alfredo_chair` with `paradiso_state` `new`), the Paradiso
(`paradiso`, z 6…20: the doors z 12, the booth's port z 16 at 6 m, the posters, the canopy `canopy` with its sign
`canopy_front`), a house z 20…26. North: the house with the arch and the mother's window (`f_n1`; the window cut through,
behind it `mother_window` — a room with a lamp, Maria standing in it on an unseen floor at 4.05 m), the white blind wall
(`wall`, x −5…5.5; the film — `screen`, x −1…5, 2.5…6.5 m), the chapel (`church`, x 5.5…9.1) and the steps `step1…4`
+ `steps` (x 3…8, z 23…26, 0.25 m each). East: the bank (`bank`, z 8…22, the door z 13), the balcony over the door
(`balcony` — the shutters as layers, `balcony_room` — the warm room behind them, `balcony_rail`, `balcony_slab`), the
chalk wall (`chalk_wall`, by the chair), Totò's chair (`chair`, x 11.3, z 15.6, the key `chair_on`), the garland
(`garland`). The fountain (`fountain`, `fountain_col` — forms, `fountain_water`, `fountain_spout`) at (0, 13), its rim
1.4 m. The street lamps `lamppost` (copies) and their light — points in `lights`.

The windows that can be lit — each front has a twin `<id>_win` (`glows`): each window's light is an `e.light`, lit
0.3 + 0.6·`warm` at night (0.65 of that at dusk), in 1988 — not; in `rewind` they light up one by one with `past`.

## The beam

`beam_anchor` (an unseen anchor in the booth's port) is turned in plan by `beam_turn` and tilted by `beam_pitch` —
`script.js` sets them from `beam_aim` (the function `beamOf`): the beam's end goes over the stone and the heads from
the spot under the port (0) to the white wall (1). The beam itself (`beam`, `cinema.beam` + the world's shader
`tools/cinema-beam.wgsl`) is a glowing wedge 18 m long on the anchor; what is longer than the way is hidden by the stone or
the wall. The spot at the end — the scene's light `beam_tip`, going by `tip_x/tip_z/tip_y`. The engine has no cone
spotlight; the beam and the headlights are a glowing wedge with a light at the tip. The layers of the frame on the wall
(`screen`): `blur` / `sharp` by `beam_focus`, `white`, `burn` by `wall_burn`; the wall's light — `wall_light` by
`wall_lit` (the scene sets it when there is a film on the wall and the beam is on). In the prologue (`beam_sky` 1) the
beam goes up over the square.

## The time and the light

`era` / `hour` — the look of the light: the keys `dusk_k`, `now_k`, `morning_k` (the beat's `from` sets them through
`LIGHT`), `rain`, `wind_k`, `cold_k` (from `night_kind`, the script), `dust` (the demolition's dust — a look of the light
too), `flash` (a flash: the fireworks, the end of the way back into the past). The sky — the world's module `sky`
(the moon over the sea at 15° from north). `past` — the way back into the past, by layers only (the boards fall from
the doors, the sign lights up, the windows one by one, the painted crowd comes through): the beats of the present hold
`past` 0, those of the past — 1; at the end of `rewind` a flash — a cut into the night of the past with the people
`c1…c9`. `collapse` — the Paradiso's front (`charged`) is painted as four pieces in layers, they sink; the booth's
port falls last; behind it — the back wall of the house next door (`par_back`).

## The people

`toto` (the looks `toto_boy`, `toto_teen`, `salvatore` — `toto_wear` as the cast's object), `alfredo` (`alfredo`,
`alfredo_blind`), `maria` (`maria`, `maria_old`), `elena`, `daughter`, `madman` (`madman`, `madman_old`), `anna`,
`bearer1`, `bearer2`, the crowd `c1…c10`. The painted crowds — `crowd_far` (standing) and `crowd_sit` (on the stones):
one card for three rows, its place — `crowd_x/z/f`, seen whole (`crowd_k` 0 or 1; only `rewind` brings it through).
The procession: `cart` moves the anchor `hearse_anchor` (on it `hearse` — the back with the handles
`#handle_l`/`#handle_r`, `#rail`, the sides, the top with the coffin); with `follow` 1 the script keeps the bearers,
Anna and the old people in their places behind the cart (they walk at its pace — `walk_slow`, 0.6 m/s), with `sal_rail`
1 — Salvatore too, at its side.

Beat by beat — `FILM` in `lib.js`: each `from` sets everything but the party's keys (`warm`, `place`, `with_mother` —
the game sets them); `demolition` reads `place` and `with_mother` in its `run` (`with_mother` 1 by default: till the
play has chosen the cinema he is with people — his mother there at the demolition).

## The faces

The key minutes end in a medium shot or a close-up of a face at 3/4 (`faceCam`, `aim` in `lib.js`; a cut — the shot
made ready ahead, `cutTo`; or the camera moves, `glide`): the mother and the boy at the doors (`after_show`), Alfredo's
palm with the coins and the three at the doors for the choice (`alfredo_down`), Alfredo waves (`coins_taken`), the
mother's face before the slap (`slap`), the mother with the paper and the boy at the poster (`paper`), Alfredo on the
fountain's rim with his face to us (`outside`), Alfredo looks after him (`go_alone`), Elena and Totò at the fountain
(`hello`), "Why?" — "I don't know" (`story_door`), her face over his shoulder (`midnight`, `midnight_close`), the girl's
face by the street to the sea (`girl`, then back to `GIRL` for the choice), Salvatore at the boarded door (`let`),
Salvatore with the tin (`widow`), Anna's face over his shoulder (`widow_late`). A choice is always in a wide or a
medium shot. The light on the faces: `porch_fill`, the lamp on the Paradiso's front (`par_lamp`), the square's lamps.

## Who comes into a beat that follows

A beat with `after` does not set its `from`: the people stand where the beat before left them. Whoever was not in the
beat before, its `run` puts in place itself (`bring` in `lib.js`: all their keys, then `_here`) — else they appear where
they stood by default (0, −40), and their steps to their place take a minute. So it was with Alfredo in `alfredo_down`
after `after_show` (the moment `alfredo_down:coins` came after ~60 s) and with Elena in `midnight` after `eve`.

## What is not there and what is weak

- Broad bodies (Alfredo's jacket a "box") — the cast's, not the scene's.
- `pour`, `give_coins`, `phone_ear`, `cane_sit` — the cast's weak motions: the hands propped up by `reach` (the coins
  forward, the receiver at the head).
- The fireworks — particle sparks over the southern houses and the light `flash`; in the shot `BALCONY` they are seen
  over the roofs.
- The points to press stand by scenes.md's shots; the shot `FOUNTAIN` is moved back (−2.2, 9.3), so that the
  fountain's rim is at 2.9 m, as it says (from (−1.5, 10.5) the rim was 1.6 m away). `EVE` — (−1, −8), yaw 3.6 (from
  (0, −10) the booth's port hides a house of the street; so the port and the balcony are both in the middle 4:3).
  `WIDE` — yaw −8 (the booth's port further from the 4:3's edge). `RUIN` — (6, 8), yaw −85 (the fountain not in front
  of the front). `BALCONY` — looking up 12°, so that the balcony is in the shot. `stay_door` ends when the procession
  leaves the middle of the shot (`cart` 0.57); `widow_late` begins with a cut — the square already empty. `FUNERAL` —
  (−5, 18), yaw −150: the procession comes from the south toward the lens along the west side, the Paradiso on the
  right; in `walk_behind` / `stay_door` the camera turns after it.

## Contract for the check

```json
{"beats": {
  "now_open": {"after":[],"tells":["now_open:window"],"seconds":10,"show":false},
  "rewind": {"after":["now_open"],"tells":["rewind:beam","rewind:past"],"seconds":13,"show":false},
  "after_show": {"after":[],"tells":["after_show:caught"],"seconds":13,"show":false},
  "alfredo_down": {"after":["after_show"],"tells":["alfredo_down:coins"],"seconds":9,"show":false},
  "coins_taken": {"after":["alfredo_down"],"tells":["coins_taken:take","coins_taken:gone"],"seconds":10,"show":false},
  "slap": {"after":["alfredo_down"],"tells":["slap:cut"],"seconds":7,"show":false},
  "paper": {"after":[],"tells":["paper:hand"],"seconds":24,"show":false},
  "crowd": {"after":[],"tells":["crowd:madman","crowd:shout"],"seconds":11,"show":false},
  "beam_out": {"after":[],"tells":["beam_out:ready"],"seconds":3,"show":false},
  "wall_film": {"after":["beam_out"],"tells":["wall_film:sit"],"seconds":17,"show":false},
  "smoke": {"after":[],"tells":["smoke:fire"],"seconds":8,"show":false},
  "outside": {"after":[],"tells":["outside:sat"],"seconds":13,"show":false},
  "new_sign": {"after":[],"tells":["new_sign:lit"],"seconds":12,"show":false},
  "door": {"after":[],"tells":["door:asked"],"seconds":8,"show":false},
  "go_together": {"after":["door"],"tells":["go_together:in"],"seconds":12,"show":false},
  "go_alone": {"after":["door"],"tells":["go_alone:in"],"seconds":10,"show":false},
  "dusk": {"after":[],"tells":["dusk:aim"],"seconds":8,"show":false},
  "seen": {"after":[],"tells":["seen:turned"],"seconds":3,"show":false},
  "film_on": {"after":["seen"],"tells":["film_on:door"],"seconds":10,"show":false},
  "hello": {"after":["seen"],"tells":["hello:met"],"seconds":16,"show":false},
  "story_door": {"after":[],"tells":["story_door:start","story_door:99","story_door:why"],"seconds":26,"show":false},
  "chair": {"after":[],"tells":["chair:sat"],"seconds":9,"show":false},
  "nights": {"after":["chair"],"tells":[],"seconds":3,"show":false},
  "eve": {"after":[],"tells":["eve:ready"],"seconds":9,"show":false},
  "midnight": {"after":["eve"],"tells":["midnight:open","midnight:hug"],"seconds":20,"show":false},
  "midnight_close": {"after":["midnight"],"tells":[],"seconds":5,"show":false},
  "girl": {"after":[],"tells":["girl:seen"],"seconds":17,"show":false},
  "follow": {"after":["girl"],"tells":["follow:gone"],"seconds":10,"show":false},
  "let": {"after":["girl"],"tells":["let:hand"],"seconds":10,"show":false},
  "funeral": {"after":[],"tells":["funeral:passing"],"seconds":18,"show":false},
  "walk_behind": {"after":["funeral"],"tells":["walk_behind:hand"],"seconds":15,"show":false},
  "widow": {"after":["walk_behind"],"tells":["widow:tin"],"seconds":10,"show":false},
  "stay_door": {"after":["funeral"],"tells":["stay_door:passed"],"seconds":13,"show":false},
  "widow_late": {"after":["stay_door"],"tells":["widow_late:tin"],"seconds":15,"show":false},
  "demolition": {"after":[],"tells":["demolition:whistle","demolition:blast"],"seconds":26,"show":false},
  "dust": {"after":["demolition"],"tells":["dust:madman"],"seconds":16,"show":false}
},
"points":["paradiso","paradiso#door","paradiso#booth_window","paradiso#poster","wall#screen","mother_window","balcony","bank#door","chalk_wall#chalk","hearse","hearse#handle_l","hearse#handle_r","hearse#rail","alfredo_door#door","canopy_front#marquee","toto","alfredo","maria","elena","daughter","madman","anna","bearer1","bearer2","c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","alfredo#hand_r","alfredo#pocket","toto#hand_l","toto#hand_r","toto#shoulder_r","toto#nape","elena#back","maria#hand_l","maria#hand_r","paradiso#lamp"],"offers":["paradiso#booth_window","alfredo#hand_r","toto","alfredo","elena","balcony","daughter","hearse","chalk_wall#chalk","wall#screen"],"party":{"warm":0.5,"place":"crowd","with_mother":1},"keys":{"beat_next":"","beam_aim":0,"beam_focus":0,"wall_film":"none","beam_on":0,"chalk":0,"mark_chalk":0,"night_kind":"clear","elena_window":0,"poster":0,"full_sign":0,"viewfinder":0,"pan":0,"elena_x":1,"madman_x":-1,"rec":0}}
```
