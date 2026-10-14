# Пристань (opus)

The pier of «Новый кинотеатр „Парадизо“» (scenes.md «Пристань»), chapters IV and V. Engine 3, camera `roam`.

## The place (metres; x across, z north toward the sea; the start on the quay at the mole's root)

All numbers live in `lib.js` (`G`). The quay z < 4 (flags, the cobbled road z −4…0, the houses at z −16); the mole
x −3.5…3.5, z 4…50; its head x −7…7, z 50…64; the warehouse on its jetty at the root, its long wall at x −5.5 (face
east), the bench along it, the arched door at z ≈ 10.6. Deck at 0, the sea's plane at −0.6, the bed at −1.2
(`relief.js` → `lib.landAt`). Stone faces are cards from the bed to the deck (`onLand: false`).

Summer only (`screen_up`): the projector on its table at (−3, 9.5), Elena's crate, the beam (24.4 m, a glowing
wedge in the vertical plane lens → screen), the screen on masts at z 34, seven rows of chairs (copies), the painted
audience (two kinds, copies, a layer fading by `crowd`), three boats of spectators (layers moved out by
`boats_out`). The lantern at the head's corner (5.5, 62.5), bollards (copies; Toto's at (2.5, 59.6)), a street
lamp on the quay.

The car: an unseen anchor `car` moved by the script (`car_a`, `car_d`, `car_f` from `car_arrive`, `car_go` along
`lib.ROADS`), its faces on it (two sides, front, back, roof, bonnet, boot) and the headlights' wedge `car_beam`.
`old` — the banker's black saloon, comes along the quay from the east and stops by the mole's root, leaves west;
`new` — Elena's car on the head looking at the sea, turns round the head and goes down the mole.

Light: one moon (`sky#disc`), the lantern, the street lamp; warm only the cinema (`screen_light`, `proj_lamp` by
`beam_on`) and the headlights. Looks: `dusk_k` (from `hour` < 0.84), `now_k` (from `era`), `rain`.
The sky (`sky.js`, `sky.wgsl`) is painted per `hour`/`era`: the warm night, the dusk with its afterglow north-west
over the sea, the cool lilac 1988; stars twinkle in the shader. Haze is 0 at night on purpose: with any haze the
engine fogs the sky below a kinked line (the air's volume edge), which read as a grey or black wall.

Прожектора-конуса в движке нет; луч и фары — светящийся клин со светом на кончике (screen_light у экрана,
car_pool там, где фары ложатся на дорогу).

## Beats (`script.js`)

The game sets `beat`; a beat cuts to its `from` unless it follows (`after`) the beat that last ended (`beat_last`,
a key of the scene's own) — then it goes on, with a cut to its own camera (`open`) when it has one. At its end it
says `beat:<name>` and makes ready the opening shot of the next (`beat_next`, else the first whose `after` has it).

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| summer | — | wide: the beam, the screen, the boats, the moon; at 12 s the rain; c1…c4 get up and run into the warehouse; cut to the close shot at the projector | summer:screen (3), summer:rain (12) | 19 |
| covered | summer | Toto draws the tarp over the projector (hands on `projector#tarp`); the beam goes; Elena gets up and stands by him | covered:done (5) | 6 |
| headlights | covered | over Toto's shoulder: the black car comes along the quay, headlights in the rain; the father comes round the car (far); Elena walks to the car; reverse shot at the car: she turns back; she gets in (behind the car), the car leaves | headlights:father (3), headlights:turn (≈8) | 16 |
| found | — | Toto on the bollard by the lantern, from behind; Elena runs down the mole past the camera, which follows; he gets up; they hold each other (reach nape/back) in profile against the sea | found:run (3), found:hug (≈11) | 19 |
| alone | — | Toto alone on the bollard, the moon's path; the camera comes slowly nearer | alone:sea (6) | 10 |
| back | — | dusk; blind Alfredo on the bench, hands on his cane; Toto comes and sits beside him; Alfredo turns his head to him (≈ 14 s). Choice pose `stay`: both ≈ 0.3 of the frame | back:sat (≈6) | 20 |
| rise_go | back | Toto gets up, his hand on Alfredo's shoulder, walks away to the road | rise_go:gone | 9 |
| car | — | 1988: the car on the head, lights on the sea; Elena by it, her back to us; the daughter walks away past the camera; Salvatore comes up the mole and stops ten paces off | — (beat:car) | 13 |
| meet | car | side shot from the water: Elena turns to him, he comes two steps nearer; both ≈ 1/4 | meet:turned (≈1) | 9 |
| ask | meet | he steps to her, she comes a step, her hand on his chest, then back to the car | ask:hand (≈2) | 8 |
| bye | meet | he steps back (sliding — no motion for a step back), she nods (looks down, up), back to the car | bye:nod (≈1) | 6 |
| parting | ask, bye | she goes round the back of the car and in; the car turns round the head and goes down the mole | parting:gone (≈9) | 11 |

Seconds are estimates from the code (walks at the gait's pace); the render matched within ~15 %.

## People

From the world's cast (`modules/cast.js` — characters added here as the cast's first ones: `toto_teen`,
`salvatore`, `alfredo_blind`, `elena`, `elena_grown`, `daughter`, `banker`, `villager_m`, `villager_w`, `old_m`,
`old_w`; style `graphic`, faces none). `toto_wear: "salvatore"` and `elena_wear: "elena_grown"` in 1988.
Motions (put into `modules/cast.data.json`, made earlier by the model, reused — no new ones): `seated` (still on a
chair), `seated_hunched` (on a low step, elbows on knees — Toto on the bollard), `sit_down` (onto a low bench),
`rise` (up from a low bench), `run`.

## What is not here / wanted

- Alfredo's dark glasses and a cane in his hand: no cast part yet; the cane is a scene element standing by the bench
  (`cane#grip`, his hands reach it). He has no `cane_walk` here (he never walks in this scene).
- `pull_cover` (a motion): Toto draws the tarp by `reach` to `projector#tarp`, which the tarp's edge carries.
- Elena «gets into the car»: she goes behind it and is gone (`here: false`) where the car hides her.
- The kino/nebo/beats modules of the plan do not exist in this world yet: the beam, the screen, the film frame and
  the sky are this scene's own (lib.js, elements); the beats machinery is in script.js.
- The default state is the first pose of `summer` (screen up, beam on), not scenes.md's rest values; every beat's
  `from` sets all keys it needs.

## Контракт для проверки

```json
{"beats": {
  "summer": {"after": [], "tells": ["summer:screen", "summer:rain"], "seconds": 19, "show": false},
  "covered": {"after": ["summer"], "tells": ["covered:done"], "seconds": 6, "show": false},
  "headlights": {"after": ["covered"], "tells": ["headlights:father", "headlights:turn"], "seconds": 16, "show": false},
  "found": {"after": [], "tells": ["found:run", "found:hug"], "seconds": 19, "show": false},
  "alone": {"after": [], "tells": ["alone:sea"], "seconds": 10, "show": false},
  "back": {"after": [], "tells": ["back:sat"], "seconds": 20, "show": false},
  "rise_go": {"after": ["back"], "tells": ["rise_go:gone"], "seconds": 9, "show": false},
  "car": {"after": [], "tells": [], "seconds": 13, "show": false},
  "meet": {"after": ["car"], "tells": ["meet:turned"], "seconds": 9, "show": false},
  "ask": {"after": ["meet"], "tells": ["ask:hand"], "seconds": 8, "show": false},
  "bye": {"after": ["meet"], "tells": ["bye:nod"], "seconds": 6, "show": false},
  "parting": {"after": ["ask", "bye"], "tells": ["parting:gone"], "seconds": 11, "show": false}
},
"points": ["projector", "projector#lens", "projector#tarp", "beam#beam", "screen#screen", "toto", "elena", "daughter", "alfredo", "banker", "c1", "c2", "c3", "c4", "cane#grip", "warehouse#door", "lantern#lamp", "sky#disc"],
"offers": ["projector", "toto", "elena"],
"party": {},
"keys": {"era": "past", "hour": 0.9, "rain": 0, "screen_up": 0, "screen_film": "romance", "beam_on": 0, "cover": 0, "car": "none", "headlights": 0, "car_go": 0, "beat_next": ""}}
```
