# The pier

The pier of Cinema Paradiso (scenes.md "The pier"), chapters IV and V. Engine 3, camera `roam`. Begun as
the pier's opus version, brought to the 4th edition: the world's modules (sky, cinema, beats, cast), faces, the letter.
Mood: a warm summer night with the cinema on the pier, the rain, the farewell at dusk; the cool lilac 1988.

## The place (metres; x across, z north toward the sea; the start on the quay at the mole's root)

All numbers live in `lib.js` (`G`, `P`). The quay z < 4 (flags, the road z −4…0, the houses at z −16); the mole
x −3.5…3.5, z 4…50; its head x −7…7, z 50…64; the warehouse on its jetty at the root, its long wall at x −5.5 (face
east): the bench along it, the arched door at z ≈ 10.6, a small harbour lamp over the bench (`wall_lamp`, its light
`bench_light`: the faces on the bench at dusk, Elena by the car at night). Deck at 0, the sea's plane at −0.6, the bed
at −1.2 (`relief.js` → `lib.landAt`). Stone faces are cards from the bed to the deck (`onLand: false`). A street lamp on
the quay at the mole's root (−2.6, 3.2). The lantern at the head's corner (5.5, 62.5), bollards (copies; Toto's at
(2.5, 59.6)).

Summer only (`screen_up`): the projector on its table at (−3, 9.5) under its tarp (`cover`, a layer; `projector#tarp` —
its leading edge, where Toto's hands go), Elena's crate, the beam (`cinema.beam`, 24.4 m), the screen on masts at z 34
(`cinema.frame` painted on it, its shader shines it with the beam), seven rows of chairs, the painted audience, three
boats of spectators (layers moved out by `boats_out`).

The car: an unseen anchor `car` moved by the script (`car_a`, `car_d`, `car_f` from `car_arrive`, `car_go` along
`lib.ROADS`), its faces on it and the headlamps' wedge `car_beam` (`cinema.beam`: thin, it shows in the rain; the light
on its tip is the scene's `car_pool` — the pool on the road or the sea). `old` — the banker's black saloon, along the
quay from the east, stops by the mole's root, leaves west; `new` — Elena's car on the head looking at the sea, turns
round the head and goes down the mole.

Light: the moon (`sky#disc`), the lantern, the street lamp, the wall lamp; warm only the cinema (`screen_light`,
`proj_lamp` by `beam_on`) and the headlamps. Looks: `dusk_k` (from `hour` < 0.84), `now_k` (from `era`), `rain`. The
sky is the world's (`sky`, `lib.SKY`: the moon over the sea a little right of the mole, the capes, the villages).

The engine has no cone spotlight; the beam and the headlamps are a glowing wedge with a light at its tip (`cinema.beam`;
at the screen — the scene's light `screen_light`, at the headlamps — `car_pool` at the wedge's tip).

## Beats (`lib.film(scene)`, played by the world's `beats`)

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| summer | — | wide: the beam, the screen, the boats, the moon; at 12 s the rain; c1…c4 get up and run into the warehouse; the cut to the close shot at the projector: Toto behind it, Elena on her crate (`projector` — under the touch, in the middle) | summer:screen (3), summer:rain (12) | 19 |
| covered | summer | Toto draws the tarp over the projector (`pull_cover`, hands on `projector#tarp`); the beam goes; Elena gets up and stands by him on his far side, in the rain | covered:done (≈5) | 7 |
| headlights | covered | the cut over Toto's shoulder: the black car comes along the quay, headlamps in the rain; the father (far); Elena walks to the car; the reverse at the car: she turns back (face, the street lamp on it); she gets in (behind the car), the car leaves | headlights:father (≈3), headlights:turn (≈9) | 20 |
| found | — | down the mole: Toto on the bollard by the lantern, his back; Elena runs past the camera; he gets up, turns; the cut to the side by the lantern: they hold each other (reach nape/back), her face over his shoulder, faces in its light | found:run (3), found:hug (≈12) | 17 |
| alone | — | Toto alone on the bollard, his back; the moon's path; the camera comes slowly nearer | alone:sea (6) | 10 |
| back | — | dusk; blind Alfredo on the bench (`cane_sit`, the cane the look's part), Toto (18) comes and sits beside him — with `letter_in_hand` 1 her letter on his knees (`letter_sheet`) all along; at ≈ 12 s Alfredo turns his head to him. Medium, 3/4: both ≈ 1/2 of the frame, faces lit by the wall lamp. Choice pose `stay` (`toto`) | back:sat (≈4) | 21 |
| rise_go | back | Toto gets up (the letter into his pocket: `toto_with` null), his hand on Alfredo's shoulder, walks away to the road | rise_go:gone (≈7) | 12 |
| car | — | 1988, night: the car on the head, its lamps on the sea; Elena by its left lamp, her back to us; the daughter talks to her and walks away past the camera; Salvatore comes up the mole and stops ten paces off (`elena` — under the touch) | — | 15 |
| meet | car | the camera glides round to the side (3 s); Elena turns to him, he comes nearer; side on, both ≈ 1/2, faces in the lamps' glow. Choice pose `ask` (`elena`, `toto`) | meet:turned (≈1.5) | 11 |
| ask | meet | he steps to her, her palm on his chest (`reach` `toto#chest`) held, then she goes back to the car's corner | ask:hand (≈2) | 7 |
| bye | meet | he steps back (sliding: no motion for a step back), she nods (looks down, up), goes back to the car's corner | bye:nod (≈1.5) | 7 |
| parting | ask, bye | she goes round the car's front and in; the car turns round the head and goes down the mole; the camera glides to him alone, the lantern beyond | parting:gone (≈13) | 15 |

Seconds are estimates from the code (walks at the gait's pace).

## People

From the world's cast: `toto` (`toto_teen`; in 1988 `toto_wear` = the cast's `salvatore` look object), `elena`
(`elena`; in 1988 `elena_wear` = `elena_grown`), `daughter`, `alfredo` (`alfredo_blind`: glasses and cane are the
look's parts), `banker`, `c1…c4`. Faces `simple`; `<id>_mood` set by each beat (`cast()` in lib.js). Motions: `seated`,
`cane_sit`, `sit_down`, `rise`, `run`, `pull_cover`, `walk`, `stand`.

## What is not here / found

- Elena "gets into the car": she goes behind it and is gone (`here: false`) where the car hides her.
- The new car's front and back cards are only its body (no cabin): seen side on the cabin is the sides' and the
  roof's. Seen from right behind it the cabin's rear window is missing.
- `pull_cover` is a weak take (passable): the hands' `reach` to the tarp's edge carries the action.
- `ask`'s "a step to her" and `bye`'s "steps back" — a walk of half a metre / a slide back (no step-back motion).
- Through-the-card figure lines (engine) were not seen here.

## Contract for the check

```json
{"beats": {
  "summer": {"after": [], "tells": ["summer:screen", "summer:rain"], "seconds": 19, "show": false},
  "covered": {"after": ["summer"], "tells": ["covered:done"], "seconds": 7, "show": false},
  "headlights": {"after": ["covered"], "tells": ["headlights:father", "headlights:turn"], "seconds": 20, "show": false},
  "found": {"after": [], "tells": ["found:run", "found:hug"], "seconds": 17, "show": false},
  "alone": {"after": [], "tells": ["alone:sea"], "seconds": 10, "show": false},
  "back": {"after": [], "tells": ["back:sat"], "seconds": 21, "show": false},
  "rise_go": {"after": ["back"], "tells": ["rise_go:gone"], "seconds": 12, "show": false},
  "car": {"after": [], "tells": [], "seconds": 15, "show": false},
  "meet": {"after": ["car"], "tells": ["meet:turned"], "seconds": 11, "show": false},
  "ask": {"after": ["meet"], "tells": ["ask:hand"], "seconds": 7, "show": false},
  "bye": {"after": ["meet"], "tells": ["bye:nod"], "seconds": 7, "show": false},
  "parting": {"after": ["ask", "bye"], "tells": ["parting:gone"], "seconds": 15, "show": false}
},
"points": ["projector", "toto", "elena", "alfredo", "daughter", "banker", "projector#tarp", "projector#lens", "screen#screen", "beam#tip", "car_beam#tip", "sky#disc"],
"offers": ["projector", "toto", "elena"],
"party": {"letter_in_hand": 0},
"keys": {"beat_next": ""}}
```
