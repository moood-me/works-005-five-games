# The prairie (`prairie`) — engine 3

Chapter III whole (rpg docs/vokrug-sveta/scenes.md, the prairie; game.md §3 III and §7 «The coupling», «The sail»). The
winter plain of the West under a big blue sky: the Union Pacific line across it; on the left the gorge and the timber
trestle of Medicine Bow, in the middle the open plain, on the right the station by Fort Kearney (the fort beyond the
line on the left of it). People are the world's cast `cast`, the film is beats of the module `beats`, light the module
`light`'s helpers. All painted once, moving on the graphics card.

## How it is made

- **The spec** is written by `tools/prairie_scene.py` (`python tools/prairie_scene.py scenes/prairie/scene.json`) —
  edit it there, not in the JSON. The plan's numbers (lib.js `plan`) and the generator's are the same numbers.
- **The place along the line** (`across` along it, the train runs to +across — east; `distance` away from the viewer;
  the rails' middle at 22). The gorge across the line at −260 (rim ±30, 30 m deep; it closes far out on the plain, 160…240
  m away — the relief, lib.js `ground`), the trestle −292…−228 (its middle span −271…−249 falls), the platform 196…256
  on the near side, the depot at 186, the water tank at 166, the fort at 150 / 75 m away (its gate at 160). The panorama
  spans −440…480.
- **The train** stands on an unseen `line` (not on the land: over the gorge it stays level). The engine (`loco`, its
  anchor the tender's back end, the engine ahead to +20.6) by `train_x`, the three cars (`cars`, their front end, back to
  −48.1) by `cars_x` — coupled `cars_x` = `train_x` − 0.6, the beats move both together (lib.js `drive`). Side cards
  (`loco_side`, `cars_side` near; `loco_far`, `cars_far` far — seen only under the boiler, through the cab, under the
  cars), the front (`loco_front`), the last car's end (`cars_rear`), the lit panes (`cars_lit`, glows by `lamps`), the
  coupling (`coupling` — the tender's drawhead and its pin; the link and the chains are `chain`'s, on the cars' middle).
  Who stands in the cab or on the rear platform is `on` points of unseen planes: `cab_floor#driver`, `cab_floor#pp`,
  `rear_floor#fogg`, `rear_floor#pp`.
- **Running «on the spot»** (`speed` — the train, `sl_speed` — the sledge): what stands runs back along the line by
  the metres gone (lib.js `advance`, each running thing's own `e.mem`): the ties (`track_w`, `track_e`: a layer, blurred
  into streaks at speed), the near snow's streaks (`rush`), the poles and the sagebrush (copies whose one layer runs
  back by their spacing), the far bluffs (`far`), the clouds (`sky`); the wheels and the rods turn (also by `train_x` /
  `cars_x` moving: the train going along the line); snow flies from under the wheels and the runners. The running places
  — the middle of the plain — have nothing on the ground that would show it standing.
- **The bridge** — two faces of a timber trestle (`bridge`, `bridge_far`, on the unseen `bridge_site` at deck level):
  bents to the slope, X-bracing, girts with snow, the deck, stone abutments; the crack on the middle span (point
  `bridge#bridge`). Its parts are layers: `shake` trembles them, `bridge_down` drops and turns the middle span into the
  gorge; `bridge_splash` 1 bursts spray and snow dust there. People walk on the unseen `bridge_deck`.
- **The riders** (`riders`, `riders_b` on it 9 m along and 4.5 m farther): six Sioux on ponies at a gallop toward +x,
  four strides each, each a layer (lib.js `rider`, `stride`); on the near side of the train (beyond it the cars would
  hide them), `riders_x`, `riders_d`. While `riders` and `firing`, the script puffs a rifle's smoke now and then
  (`shots1…3` → particles at `riders#gun1`, `riders#gun2`, `riders_b#gun1`) — the attack told by smoke, the riders, the
  faces at the windows (`faces`), the driver falling; nobody is shown hit.
- **Under the cars** (`under`): the camera low (`camera_h` −1.3) on the near side, 7 m from the line, 3 m ahead of him
  (the next chain in the middle 4:3); Passepartout lies on his back (`lie_limp`) `on` `chain#pp`, his hands reach `chain#hand_r`,
  `chain#hand_l` (the chain's animate moves all three by `pp_car`: hand over hand). The script leads the sway while he is
  there (`swing_at` 0 → 1 every 1.4 s; the chains sag and swing, the bodies rock — 0.5 together) and moves `camera_x`
  with him (lib.js `underCam`); at `pp_car` 3 it tells `under:coupling`; `uncouple` lifts the pin out of the drawhead
  (`coupling#pin`, marked by animate), the link drops, and under way the engine runs on ahead (`train_x` +260) while the
  cars slow (`speed` → 0.5).
- **The station and the fort**: the platform (a walk plane) and its front, the depot (its name by `town`: Fort Kearney
  or Omaha; its window lit by `lamps`), its east end and roof, the lamp (`lamp#flame`, by `lamps`), the water tank; the
  fort (`town` kearney: stockade, blockhouses, barracks' roofs, the flag in the wind, the gate's two leaves by `gate`;
  `town` omaha — the same element paints Omaha's houses and church). Smoke over them (`fort#chimney`).
- **The sledge** (`sledge` unseen by `sl_x`, `sl_d`; on it the deck — a walk plane, Mudge stands at `sledge_deck#mudge`
  —, the near and far sides on their runners, the mast with its pennant, the sail, the sheet). The sail turns on the
  mast by `sail_face` (the script: lib.js `sailFace` of `sheet` and `wind` — to leeward, 75° out let go, 12° hauled in)
  and comes down onto its boom by `sail_up`; the sheet (`sheet_rope`) is laid each frame from `sail#sheet` to the hands
  of whoever holds it (`with: ['sheet']` — Fogg, or Passepartout alone). Passengers sit on it (`on` points in the
  sledge's frame, `sit_calm`) by `sl_fogg`, `sl_aouda`, `sl_pp`, `sl_fix`. `wind` −1 is from the sledge's left (the far
  side, north), 0 from astern, 1 from its right: the pennant streams by the wind and the sledge's own running; the looks
  `wind_l`, `wind_r` turn the air. The snow ridge (`ridge`, nearer than the sledge: it is gone round) rises out of the snow
  `6 + 10 × (1 − drift)` m ahead as `drift` grows (`ridge_h`) and, as `drift` falls back to 0, passes behind with the
  plain, then sinks; the
  wolves (`wolves`: four, three strides each) come up from behind along the line's far side (`wolves_x` by `wolves`);
  Omaha's smoke rises over the horizon as `sledge` passes 0.6 (`omaha_near`).
- **Aouda** wears her travelling dress by `aouda_dress` (the cast's `wears.aouda_dress`); `snow_on_aouda` whitens her
  colours in four steps (lib.js `aoudaWear`; the script and the beats set `aouda_wear`). **Fix**'s bruise by
  `fix_bruise`. `with_aouda`, `with_fix` — whether they are there (the beats read them as they begin).
- **Light**: a low winter sun behind the viewer's left (so the near sides are lit), looks `snowing`, `dawn`, `night`
  (the moon from `sky#moon`, a blue ambient — light, not dark), `speed` (the air streaming back), `wind_l`, `wind_r`.
  Lights: the platform lamp, the depot window, the headlamp, the cars' windows — all by `lamps`.

- **No turned shots.** Looking ahead (a panorama) the sky is a backdrop carried with the camera's yaw, and only its
  stage and 0.3 margins are painted: a yaw past ~10° shows past its edge. Every shot looks straight ahead
  (`camera_pitch` up from the river under the bridge is fine). The bridge's fall is seen from the gorge's bed.

## The beats (lib.js `film`; the game's order)

| Beat | What | Moments |
| --- | --- | --- |
| `bridge_stop` | wide: the train before the bridge, the gorge; then a two-shot — the driver and Passepartout argue at the engine (Fogg, Aouda, Fix by the first car). Ends on the two-shot: the choice `driver#head` · `passepartout#head` | `bridge_stop:argue` |
| `bridge_run` | Passepartout in the cab, scared; the train gathers speed; from the river under it, looking up, it crosses, the bridge shaking; behind the last car the middle span falls into the gorge | `bridge_run:down` |
| `bridge_walk` | snow falling; they walk over the bridge, the empty train creeping after; from the east rim they come off it; Fogg looks back | `bridge_walk:over` |
| `attack` | wide: the train at full speed, the riders galloping alongside, smoke, faces at the windows; the cab — the driver falls; Passepartout on the rear platform, his arm toward the fort ahead, then his eyes down to the coupling | `attack:driver` |
| `under` | under the cars, low; the minigame «The coupling» plays it (`pp_car`, `swing_at`, `uncouple`) | `under:coupling` (script: at `pp_car` 3) |
| `stop` | the cars roll in and stand by the platform (`stop_at` — 0 by it, 1 130 m on); the fort's gate opens, soldiers run out; the riders gallop off; no Passepartout | `stop:still` |
| `fort` | the platform: Fogg, Aouda, Fix, the captain, soldiers about; the captain turns to Fogg. The choice `fogg#head` · `captain#head` | `fort:captain` |
| `column` | snow; Fogg and the soldiers go off over the line into the white; Aouda and Fix at the platform's end | `column:gone` |
| `night_wait` | night, the lamp; Aouda under it, the snow settling on her (`snow_on_aouda`); Fix stamping | `night_wait:snow` |
| `return` | dawn; out of the snow Passepartout, Fogg (`fogg_went`), the soldiers; nearer: Passepartout comes up to the platform, Aouda turns to him | `return:pp` |
| `train_leaves` | the train pulls out: `fogg_on_train` 1 — Fogg on its rear platform looking back; 0 — they on the platform watch it go | `train_leaves:gone` |
| `sledge` | Mudge's sledge by the platform, who rides seated (`sl_*`), the first speaker framed (Fix, or Passepartout alone); the sail goes up, the camera on Mudge | `sledge:sail` |
| `sail` | the sledge in the middle of the plain under sail, side-on, the way ahead on the right; the minigame «The sail» plays it | — |
| `omaha` | Omaha (`town` omaha), the train at the station. Passepartout alone (`sl_fogg` 0): `omaha_train` 1 — he runs to the last car, Fogg gives him his hand, the train pulls out with him; 0 — it pulls out before he is there. All in the sledge: at the last car Fogg hands Aouda up | `omaha:hand` |

Every beat has `from` (the game may open the scene on any of them); none follows another without a cut (`after`: none) —
the game's way through them is the table's order, and where it branches (`bridge_run` / `bridge_walk`, `column` /
`train_leaves`) it names the next in `beat_next`. The showcase (SHOWCASE) plays them all, with its own `company` (Aouda
and Fix with them), `under_show` and `sail_show` (the minigames played a little).

## Differences from scenes.md

- `stop_at` (the game's, before `stop`): 0 — the cars by the platform, 1 — 130 m further.
- The minigames' keys are at rest in the `from` of `under` and `sail`: the game sets its own after `beat`.
- `snow_on_aouda` whitens her colours in four steps (the cast has no part of its own for snow on the shoulders).
- The sway is the scene's (`swing_at` led by the script, `swing` its size, 0.6).
- The riders ride on the near side (beyond it the cars hide them), not as far silhouettes; the shots are puffs of smoke.
- `night_wait` and `return`: the cars still stand by the platform; the train leaves in `train_leaves`.
- `omaha` with everyone in the sledge (`sl_fogg` 1): they are at the last car, Fogg hands Aouda up (`omaha:hand`).

## Contract for the check

```json
{"beats": {
  "bridge_stop": {"after": [], "tells": ["bridge_stop:argue"], "seconds": 9, "show": false},
  "bridge_run": {"after": [], "tells": ["bridge_run:down"], "seconds": 13, "show": false},
  "bridge_walk": {"after": [], "tells": ["bridge_walk:over"], "seconds": 13, "show": false},
  "attack": {"after": [], "tells": ["attack:driver"], "seconds": 10, "show": false},
  "under": {"after": [], "tells": ["under:coupling"], "seconds": 2, "show": false},
  "stop": {"after": [], "tells": ["stop:still"], "seconds": 10, "show": false},
  "fort": {"after": [], "tells": ["fort:captain"], "seconds": 5, "show": false},
  "column": {"after": [], "tells": ["column:gone"], "seconds": 10, "show": false},
  "night_wait": {"after": [], "tells": ["night_wait:snow"], "seconds": 17, "show": false},
  "return": {"after": [], "tells": ["return:pp"], "seconds": 10, "show": false},
  "train_leaves": {"after": [], "tells": ["train_leaves:gone"], "seconds": 13, "show": false},
  "sledge": {"after": [], "tells": ["sledge:sail"], "seconds": 8, "show": false},
  "sail": {"after": [], "tells": [], "seconds": 2, "show": false},
  "omaha": {"after": [], "tells": ["omaha:hand"], "seconds": 11, "show": false}
},
"points": ["bridge#bridge", "coupling#pin", "chain#c0", "chain#c1", "chain#c2", "chain#c3", "chain#hand_r", "chain#hand_l", "chain#pp",
  "sail#sheet", "sail#peak", "loco_side#chimney", "loco_side#cab", "cars_side#middle", "cars_side#rear", "fort#gate", "lamp#flame",
  "fogg", "passepartout", "aouda", "fix", "driver", "captain", "mudge"],
"offers": ["driver#head", "passepartout#head", "fogg#head", "captain#head"],
"party": {"with_aouda": 0, "with_fix": 0, "aouda_dress": 0, "fix_bruise": 0},
"acts": {}}
```
