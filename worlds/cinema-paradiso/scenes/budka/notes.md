# Будка

The projection booth of the «Парадизо» from inside (scenes.md «Будка», 4th edition) — chapters I–V: one room, in the
old and the new cinema alike (rebuilt the same after the fire), and its ruin in 1988. Engine 3, camera `roam`, the
film in beats (modules/beats.js). Mood: a small warm room in smoke — one lamp over the bench, the lamp houses' vents
glowing while a projector throws its beam, the hall's screen in the look port; cool only the window on the square
(only sky in it) and the stair's bulb. 1988: rust, no reels, pigeons' down, the cold evening from the window, no lamp.

The scene's spec is generated: `build.js` beside the world clone (not in the repository) writes scene.json and every
element's file from one table; lib.js, script.js, showcase.js and this file are written by hand.

## The place (metres; lib.js `G`)

x across, left to right facing the ports; z from the opposite wall (0) to the ports' wall (3.5); the start (camera 0,
0) at the opposite wall. Room x −2…2, ceiling 2.6.

- Ports' wall (z 3.5, `wall_n`): ports at x ±0.75, 1.5 m up (0.3 × 0.22, holes — the hall's dark and its screen far
  beyond: `hall_dark`, `hall_screen`); the look port between (x 0, 1.4…1.7, 0.45 wide) — `look_port`, a picture of the
  hall's screen in front of the wall, its cue (`cue`: kino.cue, and the whole port blinks — a bright rim and glow); the
  clock over it (2.1 m; hands are layers by `clock`).
- Projectors: an unseen anchor each (`p1` at x −0.75, `p2` at 0.75; z 3.0) carrying the body — **a form** (`projector`,
  `projector2`: an iron box 0.5 × 0.8 × 0.8 at 0.9…1.7 m; its points lie on it in 3D: `#lever` at the back's middle
  1.0 m up, `#motor` on the inner side's middle 1.1 m up, `#gate` near the front, `#lens`, `#side` the outer side), a
  lathe-form pedestal (`p1_ped`), the side card through the middle (`p1_side`: the reels — layers turning by
  `motor1`/`motor2`, none in 1988 —, their arms, the chimney, the lens barrel; its point `#reel`), the vents' glow
  (`p1_vents`, light `p1_lamp` by `p1_on`), the motor's crank (`p1_crank`, turning while `crank`; its handle seen from
  behind: `p1_knob`). The beams into the hall are behind the ports' wall from anywhere in the booth, so there are none
  (cheaper: the view's pages): what shows a projector throwing its beam is its lamp house's glow, the look port's
  picture and the hall's screen through the ports; only projector 1 has a short beam (`beam`: kino.beam, the world's
  shader; on by `beam_on` × `active`), seen when it is turned out through the window on the square. `turned` turns `p1` (−140° about
  its middle: the lens to the window on the square) — everything on it goes with it.
- Crate (`crate`, walk plane `crate_top`) behind projector 1 (x −0.75, z 2.2); in the fire it lies thrown by the window
  (`crate_a`, `crate_d`). A low box of film cans (`box`) — the boy's seat in `deal`, else in the corner by the bench.
- Stool (x 0.9, z 1.4, seat 0.5), bench along the right wall (x 1.5…2, z 1.4…2.4, 0.85 high: `bench`, `bench_top`,
  `press`, `tin`, `clips`, the pencil `bench#pencil`), the lamp over it (`lamp`, light `lamp_light` by `lamp`), a shelf
  of cans and a poster on the wall.
- Left wall: the window on the square (z 1.2…1.8, 1.0…1.7 m): `square_window` shows only the sky of the hour (the
  world's nebo as a picture — no square, no houses), raindrops on it by `rain_window`; its light `window_light`.
- Right wall: the door (z 0.1…1.0; `booth_door` hinged at z 0.1, `door` 0…1 → `door_f`: it opens into the room and at 1
  lies along the opposite wall), the stair landing beyond with its bulb (`stair`); the slate on its nail (z 1.2, 1.6 m,
  1988 only: `slate_nail`, its letters crooked as `slate_letters` says).
- Opposite wall: the calendar (`wall_calendar`, x 1.6 — scenes.md says 1.4: at 1.4 the open leaf, 8 cm before the wall, left its edge seen from DOOR; 1.5 m) — behind the open door's leaf; `month` `none` (only the
  nail; chapters I–III), 8, 9 (August turned over the top, its pencil edge showing), 12.
- Floor: points `floor#path0` (−0.6, 2.3) and `floor#path1` (0.6, 1.4) — «Вытащить».
- Fire (`fire`, `fire_lens`, `fire_reel`, `embers` at the turned projector by `fire`; light `fire_light`), smoke
  (`smoke_gate`; the look `smoke` hazes the room), motes, pigeons' down (`feathers`, a burst on `pigeons`).

Light: lamp, lamp houses, stair bulb, window, fire. `inside` 0.3. Looks by keys the script derives: `night_k`, `eve_k`,
`dawn_k` (from `hour`), `ruin_k` (from `era`), and `smoke`.

## Shots (lib.js `CAM`, scenes.md «Кадры»)

`PORTS` (0, 0.4, eye 1.5, yaw 0) — the four handles in the middle 4:3, the look port 3.1 m ahead, Toto at his place
by projector 1 (x −1.3, z 2.8). `OPER` (1.6, 0.5; −40) — the boy on the crate, Alfredo behind; `projector#motor` on
the axis, `projector2#lever` +18°. `BENCH` (−1.8, 0.3; 62), `BENCH2` (the same, 74: the stool and the box). `DOOR`
(−1.8, 1.2; 98) — stool −12°, door +2°, calendar +13°. `CLOSE` (0.2, 2.6, eye 1.2; 140). `SQUARE` (1.6, 0.6; −60) —
the window −16°, projector 1. `FLOOR` (1.5, 0.3, eye 1.2; −40, pitch −19) — the way from projector 1 down to the
door. `CAL` (1.25, 0.95; 172) — close at the calendar (`note_close`).

## Beats (lib.js `film(scene)`; a beat's `from` reads the play's `alfredo_here`)

| beat | after | what | tells |
| --- | --- | --- | --- |
| cutting | — | BENCH, night: Alfredo at the bench; the door ajar, the boy in the gap; he comes in, stands by Alfredo (both turned to us) | cutting:door, cutting:bench |
| splice_in | cutting | the splice insert opens | splice_in:close |
| frames | — | the insert shut: the clippings into the tin, the faces (the boy surprised, Alfredo smiling); Alfredo goes to projector 2, his back to the bench — choice: `tin`, `toto` | frames:tin |
| tin_shut | frames | Alfredo back, shuts the tin, into his waistcoat's pocket (`tin_pocket`) | tin_shut:pocket |
| pocket | frames | the boy takes a frame (`frame_hand`), into his pocket; Alfredo back, pockets the tin | pocket:hidden, pocket:tin |
| deal | — | BENCH2: Alfredo on the stool with the primer, the boy on the box; the slate before him | deal:primer |
| slate_in | deal | the slate insert opens | slate_in:close |
| slate_out | — | Alfredo lifts the slate (`slate_held`; hands to face height by reach), laughing | slate_out:up |
| lesson | — | OPER, evening: the boy (9) on the crate at projector 1, Alfredo's hand on his shoulder; the thread insert opens | lesson:crate |
| motor | — | the insert shut: Alfredo turns the crank, the beam, the port lights; `stutter` 1 — the frame trembles (`jitter`) till his palm on the gate; the boy to projector 2's lever, Alfredo's hand there too | motor:beam, motor:lever |
| window | — | SQUARE, night: Alfredo at the window, smiling; he turns projector 1 to the window (`turned` 0 → 1) | window:hands |
| jam | — | turned; the boy runs down; fire in the gate and on the reel; Alfredo reaches, recoils (the first second of `fall_back`, which in the engine never reaches the floor) and collapses into `sleep` | jam:flame |
| smoke_in | — | FLOOR: smoke, fire; Alfredo lying on his side, the boy runs to him, kneels at his shoulders, hands at his nape | — |
| story_booth | — | DOOR: blind Alfredo on the stool (`cane_sit`, `tell_hand`) facing the window, his face to us; Toto (17) on the bench's edge facing him and us | story_booth:start, :99, :why |
| reels | — | DOOR: Toto at the bench changing reels (Alfredo on the stool if `alfredo_here`); the door: Elena; the hug in the door, her face over his shoulder; the tail flaps (the hall's screen white) | reels:door, reels:hug, reels:tail |
| six | — | PORTS, evening, `month` 8, clock 6: Toto at his place turns toward the door | six:clock |
| changeover | six | he looks at the look port | — |
| alfredo_comes | — | DOOR, clock 10: `alfredo_here` 0 — Alfredo comes in with his cane and sits; 1 — he turns his head on the stool; Toto goes out | alfredo_comes:turned, alfredo_comes:gone |
| knock | — | DOOR: Alfredo on the stool, projector 2 running; the door: Elena in the stair's light (choice: `elena`, `alfredo`) | knock:in |
| runs | knock | she runs, the door slams; his palm on projector 2 | runs:gone |
| note | knock | she stands; half-shuts the door, takes the pencil, writes on August; goes; he rises, finds the sheet by touch, turns it up (`month` 9) | note:writing, note:gone, note:turned |
| note_close | note | CAL: September, the pencilled edge of August over the top; the stair's light goes | — |
| morning | — | CLOSE, dawn, `month` 9: Alfredo dozing on the stool wakes, his face to us in the dark glasses; Toto in the door | morning:in |
| autumn | — | DOOR, rain at the window, `month` 12, the door open: Toto (18) on the stool as Alfredo sat; Alfredo in the doorway | autumn:door |
| ruins | — | 1988, DOOR: Salvatore with the tin, the slate on its nail; the operator takes him to projector 2 (medium), his hand on its rusty side, face in the window's light; pigeons | ruins:in |
| calendar | ruins | back to the door (camera to DOOR); he shuts it — the calendar on December; its insert opens | calendar:close |
| window_strip | ruins, calendar | a cut (made ready) to SQUARE: at the window; the strip insert opens | window_strip:close |
| strip_end | — | the insert shut: at the window, the strip hanging from his hands to the floor, his face in the window's light | strip_end:held |

## The people

`alfredo` (cast `alfredo`; `_wear` the cast's `alfredo_blind` object from chapter II.5 on), `toto` (`toto_boy`;
`_wear` `toto_teen`, `salvatore`), `elena` (`elena`). Faces `simple`, `<id>_mood` per beat. **`alfredo_here` is both
the play's key (scenes.md, game.md `carry`) and the engine's «Alfredo is in the scene»**: they mean the same here; the
beats where he is always present set it themselves in their `from` (`knock`, `story_booth` …), the ones that depend on
the play read it there (`reels`, `six`, `alfredo_comes`).

Motions: `bench_work`, `seated`, `cane_sit`, `tell_hand`, `doze`, `cane_walk` (gait), `sit_down`, `rise`, `run`,
`paint`, `push_turn`, `fall_back`, `sleep` (lying on the side), `kneel_down`, `drag` (gait, «Вытащить»), `cough_stand`, `lift_show`.
Looks (`_look`) far behind a person twist the body round: those who should face the camera look ahead or at what is before them.

## «Вытащить» (script.js)

The game moves `drag` (0 — Alfredo at `floor#path0`, 1 — at `floor#path1`); he comes heavily (at most 0.3 of the way a
second): the boy backs along the way (gait `drag`) 0.8 m ahead of Alfredo's hips, his hands at Alfredo's nape;
Alfredo lying slides with no steps. `drag_at` — where he is now, set ten times a second. `cough` 1 — `cough_stand`,
a second without pulling.

## What is not as scenes.md says (and why)

- No beams drawn into the hall (scenes.md: «Луч из port1 (или port2, по active) уходит в зал»): never seen from inside.

- `story_booth`: Toto on the bench's edge, but Alfredo faces the window, not Toto (blind, telling into the air) — so
  both faces are to the camera from DOOR; his head turns toward Toto only partly.
- `deal`: the camera is BENCH turned to 74° (BENCH2) so the stool and the boy's box are both in the middle 4:3.
- `smoke_in`: about 5 s — Alfredo already lying unconscious on his side (`sleep`, a loop: a motion done once does not play from a cut, and `lay_down` of the AP cast is «puts a thing on the table», not lying), the boy runs in and drops to his knees at his shoulders.
- `FLOOR` looks down at −26° (scenes.md −19°): at −19° `floor#path1` is at the frame's bottom edge (−0.5 of the frame, not −0.36 as scenes.md counted); at −26° the way runs from +0.08 to −0.36 of the frame, the fire is above the frame (its light and smoke fill the room).
- The crate is moved by the beats: by the window in `window` (the boy on it beside Alfredo, not hiding him), thrown aside under the window in `jam` and `smoke_in` (it stood where Alfredo falls).
- In 1988 the camera comes to Salvatore at projector 2 by its own keys (a glide to a medium shot), not by the operator: `camera_target` adds the DOOR shot's offsets on top of its framing and ends inside the projector.
- `knock`: Alfredo's face is turned to Elena, away from the camera (his profile from behind); Elena's face is the shot's.
- The calendar exists from chapter IV (`month` 'none' before).

## Контракт для проверки

```json
{"beats":{"cutting":{"after":[],"tells":["cutting:door","cutting:bench"],"seconds":12,"show":false},
"splice_in":{"after":["cutting"],"tells":["splice_in:close"],"seconds":2,"show":false},
"frames":{"after":[],"tells":["frames:tin"],"seconds":9,"show":false},
"tin_shut":{"after":["frames"],"tells":["tin_shut:pocket"],"seconds":6,"show":false},
"pocket":{"after":["frames"],"tells":["pocket:hidden","pocket:tin"],"seconds":8,"show":false},
"deal":{"after":[],"tells":["deal:primer"],"seconds":17,"show":false},
"slate_in":{"after":["deal"],"tells":["slate_in:close"],"seconds":2,"show":false},
"slate_out":{"after":[],"tells":["slate_out:up"],"seconds":5,"show":false},
"lesson":{"after":[],"tells":["lesson:crate"],"seconds":10,"show":false},
"motor":{"after":[],"tells":["motor:beam","motor:lever"],"seconds":13,"show":false},
"window":{"after":[],"tells":["window:hands"],"seconds":9,"show":false},
"jam":{"after":[],"tells":["jam:flame"],"seconds":9,"show":false},
"smoke_in":{"after":[],"tells":[],"seconds":5,"show":false},
"story_booth":{"after":[],"tells":["story_booth:start","story_booth:99","story_booth:why"],"seconds":26,"show":false},
"reels":{"after":[],"tells":["reels:door","reels:hug","reels:tail"],"seconds":15,"show":false},
"six":{"after":[],"tells":["six:clock"],"seconds":7,"show":false},
"changeover":{"after":["six"],"tells":[],"seconds":2,"show":false},
"alfredo_comes":{"after":[],"tells":["alfredo_comes:turned","alfredo_comes:gone"],"seconds":12,"show":false},
"knock":{"after":[],"tells":["knock:in"],"seconds":9,"show":false},
"runs":{"after":["knock"],"tells":["runs:gone"],"seconds":6,"show":false},
"note":{"after":["knock"],"tells":["note:writing","note:gone","note:turned"],"seconds":24,"show":false},
"note_close":{"after":["note"],"tells":[],"seconds":4,"show":false},
"morning":{"after":[],"tells":["morning:in"],"seconds":8,"show":false},
"autumn":{"after":[],"tells":["autumn:door"],"seconds":16,"show":false},
"ruins":{"after":[],"tells":["ruins:in"],"seconds":13,"show":false},
"calendar":{"after":["ruins"],"tells":["calendar:close"],"seconds":5,"show":false},
"window_strip":{"after":["ruins","calendar"],"tells":["window_strip:close"],"seconds":3,"show":false},
"strip_end":{"after":[],"tells":["strip_end:held"],"seconds":7,"show":false}},
"points":["tin","toto","alfredo","elena","projector","projector#motor","projector#lever","projector#gate","projector#lens","projector#side","projector#top","projector2","projector2#motor","projector2#lever","projector2#gate","projector2#lens","projector2#side","projector2#top","floor#path0","floor#path1","toto#hand_r","wall_calendar#page","booth_door#edge","bench#pencil","press#press","lamp","look_port","clock#face","square_window","slate_nail","p1_side#reel","splice#cut1","splice#cut2","splice#cut3","splice#cut1_end","splice#cut2_end","splice#cut3_end","splice#glue1","splice#glue2","splice#glue3","slate#start","slate#end","thread#p0","thread#p1","thread#p2","thread#p3","thread#p4","thread#p5","calendar#fold","strip#hand_l","strip#hand_r"],"offers":["tin","toto","elena","alfredo"],"party":{"alfredo_here":0,"jumps":0,"slate_letters":"00000000"},
"keys":{"beat_next":"","cue":0,"motor1":1,"motor2":0,"active":1,"white":0,"clock":6,"drag":0,"cough":0,"stutter":0,"cut1":0,"cut2":0,"cut3":0,"glue1":0,"glue2":0,"glue3":0,"bent1":0,"bent2":0,"bent3":0,"boy_reach":0,"chalk_x":0,"letters":0,"crooked":"00000000","wobble":0,"threaded":0,"pull":0,"loop":0,"pages":0,"fold":0,"dust":1,"strip_x":0,"splice":0,"slate":0,"thread":0,"calendar":0,"strip":0}}
```
