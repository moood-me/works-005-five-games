# The harbour (`harbour`) — on engine 3

Chapter II (docs/vokrug-sveta/scenes.md): Hong Kong and Yokohama — one panorama along the quay of a Far Eastern port,
the town is the key `port`. The people are the engine's (the world's cast `cast`), the film is in beats (`beats`:
`lib.film(scene)`), the colours — `light`. What matters most is the water and the reflections: lights, lanterns, the
moon and the low sun as paths on the water; haze; a steamer that leaves.

All is painted once, in daylight colours. No painting reads a key that moves: the evening, the night, the lanterns,
the opium, the sails, the rolling — layers, `animate`, the scene's light, particles. The paintings read only `port`
(changed on a cut).

## The frame

Camera `panorama` (`span` [34, 40]), horizon 0.52. The viewer stands on the quay (`quay`, wet granite — a weak
mirror), the water 1.6 m below. The plan — `lib.plan`, by `across` left to right: the tavern (−36) on piles with a
terrace, tables, railings and three rows of lanterns; the water and a long pier (`pier`) to the jetty (`jetty`), the
steamer at the jetty; steps down to the water (`steps`), the parapet, bollards; a pontoon (38) with a gangway — by it
the Tankadere (Hong Kong) or Batulcar's booth (Yokohama).

The water (`water`: 3 km × 2 km) — the engine's mirror plane (`rough` 0.35, `ripple` 0.3): the sky, the shore, the
ships, the lanterns, the people are reflected by the engine; the paths of the sun, the moon and the lights too (the
sky and the lights have `e.light`). The shore (`far`, 800 m, the profile `lib.shore`, the houses `lib.houses`) is
painted clean — the scene's haze takes it away. The shore's lights (`city_lights`, glows) — the layer `lit` and the
glows `shore`, shown by the `animate` by `lanterns`.

## What became what (v1 → v2)

| v1 | v2 |
| --- | --- |
| the sky mixed day, evening and night in its painting | three layers (`evening`, `night` over the day), the sun — the layers `sun_day`/`sun_eve`, their `animate` lowers it to the water by `evening`; the moon — the layer `moon`; `e.at` (`sky#sun`, `sky#moon`) in the layers — the light of the sun and the moon comes from where they are now |
| the haze `mist` — 16 parts, the wreaths moved by `e.t` | four elements at their own depths (`mist_near` 50 m, `mist` 100, `mist_mid` 180, `mist_far` 320), two layers each with `drift` in different directions; the paint is daylight — the evening and the night are the scene's light (not glows) |
| `boats` — 11 parts, went and rocked by `e.t` | `boat_0` … `boat_10` — an element of its own each (layers need an element of their own): the layer `boat` rocks and sways, the moving ones go by their own `animate` (the box covers the whole way ±400 m; `lib.BOATS`) |
| lanterns — parts of rows, swung by noise, `lit` mixed the colour | the rows are elements (`lanterns` — the near one over the terrace, `lanterns_back`, `lanterns_eaves`, `lanterns_stage`), each lantern a layer with `wind` from its hook; the light — `e.light` at full strength, the `animate` gives `e.glow('lamp', lanterns)`, the middle ones — the scene's lights `terrace_1` (`lanterns#t1`), `terrace_2` (`lanterns_back#t2`, was `lanterns#t2`) with `on: lanterns` |
| `daze` swelled and doubled the halos in the painting | the look `daze` (`hazeGlow`, haze, saturation — the halos swell) + doubles: a layer `ghost` in each row and boat — the glows `ghost`, the `animate` moves it aside and lets it burn at `lanterns × daze`; `camera_roll` = 4° × `daze` (set at once — script.js; moving — with it, `lib.film`) |
| smoke — `beforeFrame`'s memory, the wreaths were painted | the particles `smoke` (`at: steamer_funnel#funnel`, `amount: steamer_smoke`): the wreaths are born where the funnel is now — the steamer leaves, the trail stays over the harbour |
| the Tankadere's sails were painted by `sail` | `tankadere_sails` (translucent, `translucent`): furled — layers, set — layers the `animate` raises from the booms (`scaleY`), the jib the same; the masts — `tankadere_rig` |
| the gangway at the side by `carnatic_present > 0.97` in the painting | the layer `gangway`, its alpha |
| portholes, the deckhouse windows, the footlights — colour by `lanterns` | the layer `lit`, its alpha; the glows — `e.glow` |
| `banners` swung by a shift by noise | the cloths — layers with `wind` from the crossbar |
| — | rolling: the anchors `steamer`, `boat` got a `tilt` by the keys `steamer_roll`, `boat_roll` (script.js: `scene.every` — to and fro, out of step) |
| — | gulls: the particles `gulls` (the element's sprite — three positions of the wings) |
| the film — lines by the seconds (`film`) | the director's beats (`beats`, `lib.film(scene)`): people walk at their own pace, motions take as long as they take |

## The light

`light` — day in a light haze (ambient 1.0, haze 0.12, hazeGlow 0.7, the wind `[-1, 0, 0.8]` — to the left: smoke,
lanterns, cloths). Looks: `evening` (warm, ambient 0.6, shafts 0.5 — a low sun in the haze), `night` over it (ambient
0.24, blue; the sun goes out: `lights.sun` 0), `daze`. The light inside the tavern — `inside` 0.5. The sources — `sun`
(`sky#sun`), `moon` (`sky#moon`, `on: night`), `tavern`, `tavern_upstairs`, `terrace_1`, `terrace_2`, `steamer_deck`,
`ramp` — all the lamps with `on: lanterns`.

## Keys

| Key | What | By default |
| --- | --- | --- |
| `port` | `hongkong` · `yokohama` — the shore, the boats, the steamer, the signs, the lanterns, the Tankadere or the booth | `hongkong` |
| `evening` | 0…1: day in haze → evening, a low red sun | 0.9 |
| `night` | 0…1: night over the evening, the moon | 0.25 |
| `lanterns` | 0…1: lanterns, windows, the lights of steamers, boats and the shore, the footlights | 1 |
| `carnatic_present` | 1 — the steamer at the jetty, towards 0 — casts off and leaves the harbour, 0 — the jetty empty | 1 |
| `tankadere_out` | 0 — the Tankadere at the pontoon, towards 1 — leaves the harbour | 0 |
| `sail` | 0…1: the Tankadere's sails furled → set | 0 |
| `daze` | 0…1: opium — the halos swell and double, the horizon tilts | 0 |
| `pp_walk` | «Stay awake»: where the game sends Passepartout along his way (0 — up from the tavern's table, 1 — the top of the steps down to the water; the boatman at 0.97): he walks there at his own reeling pace (`stagger_walk`), the camera with him | 0 |
| `pp_walk_at` | where he is on his way now, in units of `pp_walk` (set by the scene) | 0 |
| `pp_sway` | «Stay awake»: −1…1 — he lurches aside as he walks: the end of each walk the game sends him on is that far toward the town (−) or the water (+), up to 0.9 m | 0 |
| `pp_stumble` | a rise to 1 — he stumbles and walks on | 0 |
| `boatman` | 1 — the boatman waits on the quay by the head of the steps, his lantern lit (the light `boatman_lamp`), his sampan below | 0 |
| `message` | a rise to 1 — he goes down into the sampan (`sampan#stand`) and pushes off with the news: it and its lantern go away over the water toward the town (`sampan_x/_d/_facing`, led by the scene) | 0 |
| `pyramid` | «The pyramid»: 0…1 — the Long Noses' tiers go up on the shoulders (from 0.2, 0.26, 0.42 — `lib.TIERS`), come down (a stumble) when it sinks below; the top man's arms out from 0.75 | 0 |
| `tilt` | «The pyramid»: −1…1 — it sways: its mat (`pyr`, `pyr_x` led by the scene) and so its foot and all on it aside, 0.35 m at ±1 | 0 |
| `fogg_present` | «The pyramid»: 1 — Fogg (and Aouda, `with_aouda`) come along the landing and sit in the front row, his watch in his hand — then `pyramid:fogg`; 0 — the seats empty | 0 |
| `pp_wings` | the game's mark: the Long Noses' wings over his livery (Hong Kong); in Yokohama the beats dress him in their whole costume (`kit.cast.characters.passepartout_nose`) | 0 |
| `aouda_dress`, `with_aouda`, `with_fix` | her travelling dress; whether she, Fix are with Fogg (the morning, the Tankadere, the front row, the quay at Yokohama) | 0 |

Led by the scene (the game is not to touch them): `steamer_x/_d/_facing`, `boat_x/_d/_facing` (by `carnatic_present`,
`tankadere_out`), `steamer_roll`, `boat_roll` (rolling), `steamer_smoke`, `sampan_x/_d/_facing`, `pyr_x`, `pipe_smoke`,
`aouda_wear` (by `aouda_dress`). `camera_roll` = 4 × `daze`: the scene sets it itself when `daze` is set at once;
whoever moves `daze` over time (`move`) moves `camera_roll` beside it — the same seconds, the same curve, to 4 × the
value (a camera key set at once is a new shot: it is not set frame by frame).

## The pontoon, the stage

The landing (`landing`) floats 1.3 m below the quay: the `relief` lowers the land under it (and slopes it down the ramp)
so that people stand on it — Bunsby and the Tankadere's people, Batulcar's audience (the front row's bench and the crowd at d ≈ 10, before the stage: seen over their heads from the quay). Cards there stand on the lowered
land (`stage_back`, `stage_front`, `banners`, `lanterns_stage`, `bench`, `audience`: elevation 0); planes keep their
own elevation (absolute: `landing` −1.3, `ramp`, `stage` 1.2 — its boards, `walk`). The stage's plane is a floor in
Hong Kong too (unpainted): nobody's places there lie within its boards (x 33…43, d 12…16). The cameras stay on the
quay or high (an eye down on the landing looks up under the stage).

## Beats (`lib.film(scene)`; at its end the scene says `beat:<name>`)

| Beat | after | What |
| --- | --- | --- |
| `quay` | — | Hong Kong, day: Aouda at the parapet, Passepartout beside her; Fogg comes along the quay, Passepartout turns round, she does as he comes up. `quay:met` |
| `cousin` | quay | the camera to Aouda; she looks at the water and at him again; holds, under the choice. `cousin:looks-back` |
| `tavern` | — | evening: Passepartout and Fix at a table by the railing; Fix pours. `tavern:poured` |
| `badge` | tavern | Fix shows his badge, Passepartout gets up. `badge:shown`, `badge:up` |
| `pipe` | badge | He sits down again; the pipe at his lips, its smoke; `daze` to 0.3; he rises — then «Stay awake» (the script leads him). The boatman waits at the steps. `pipe:up` |
| `carnatic` | — | Night: Passepartout reels along the jetty to the steamer's gangway and stumbles — a cut: lying on her deck (`steamer_deck#aboard`, `carnatic:aboard`); she casts off (`carnatic:cast-off`, `carnatic_present` → 0.5 in 8 s), the camera drawing back down the pier |
| `morning` | — | morning, the jetty empty: Fogg (and Aouda) by the pier; a cut closer; the watch. `morning:watch` |
| `bunsby` | — | day, the landing: Bunsby by the Tankadere, Fogg (and Aouda) before him; Fix comes down the ramp and up to them (`bunsby:fix`); holds under the choice — `fix#head`, `bunsby#head` |
| `cast_off` | — | her people on her deck (`tankadere_crew#helm/#fogg/#aouda/#fix`): Bunsby at the tiller, Fogg, Aouda (`with_aouda`), Fix (`with_fix`); sails up (`cast_off:sails-up`), out off the landing |
| `stay_behind` | — | (Holland) Aouda in her travelling dress on the quay's edge, her hand up, waving; the Tankadere going out. `stay_behind:wave` |
| `show` | — | Yokohama, night: the Long Noses in a row on the stage, Passepartout among them (the whole costume); Batulcar announces (`spread_hands`). `show:announce` |
| `pyramid` | show | The three at the foot on the mat (Passepartout in the middle, braced), the climbers behind; then «The pyramid» (the script). `pyramid:fogg` — when Fogg has sat down |
| `see` | pyramid | A cut close on Passepartout under the noses, his eyes to the front row; a cut from the stage (`see_cam`): Fogg in the front row, watch in hand (and Aouda), the footlights in their faces |
| `collapse` | see | (dropped) A cut back: he steps out, the pyramid comes down softly and absurdly (`knocked_down`: they sit up on the boards), Batulcar throws up his hands (`collapse:batulcar`); Passepartout at the footlights, his arms out to his master |
| `finish` | pyramid | (held) The top man's arms out — the bow (`finish:bow`; the applause is the game's); Fogg (and Aouda) rise and go; the tiers come down; Passepartout runs off after him in his wings |
| `reunion` | — | Yokohama's quay at night: Passepartout in wings and nose runs up to his master; they face each other (`reunion:face`); Fogg nods |
| `evening`, `stay_awake_show`, `yokohama`, `pyramid_show` | | the showcase's own: day → evening; «Stay awake» to the boatman and his going; Yokohama by night; «The pyramid» built, Fogg sitting down |

The cuts inside beats are made ready (shots). Each beat ends in a living pose. The camera never frames the people
held on a thing or on another (Passepartout at the pyramid's foot, aboard): `camera_target` on them frames their own
place keys (set beside them where it matters); those shots are set by the camera's keys.

## Points and elements for a choice

`tankadere`; points: `tables#table`, `tavern_front#door`, `parapet#parapet`, `steps#steps`, `steamer_hull#gangway`,
`steamer_hull`, `steamer_rig#masthead`, `steamer_funnel#funnel`, `stage_front`, `far#peak` / `far#pagoda`, `sky#sun`,
`sky#moon`, `sampan#stand`, `steamer_deck#aboard`, `tankadere_crew#helm`, `pyr#b0…b2`, `boatman#flame` (his lantern);
the people's heads (`fogg#head`, `aouda#head`, `fix#head`, `bunsby#head`, `passepartout#head`).

## The people

`fogg`, `aouda`, `passepartout`, `fix`, `bunsby`, `boatman`, `batulcar`, the Long Noses `n1…n5` (the cast `cast`; each
nose its own colours — `person.look.colors`); the keys `<id>_a`, `_d`, `_do`, `_turn` (0 — to the water, 180 — to us),
`_look`, `_reach`, `_with`, `_wear`, `_gait`, `_on`, `_here`, `_mood` (by default there is no one). The pyramid: those
at the foot stand `on` the mat's points (`pyr#b0…b2`, `storm_brace`), the tiers `on` a shoulder of those under them
(`{at: 'n1#shoulder_l', up: 0.95}`), their feet reaching for the two shoulders under them.

## Known

- Night in Hong Kong is dark round the steamer: Passepartout on the jetty and on her deck reads small.
- A climber goes up onto the shoulders at once (there is no climbing motion): the tier stands there the next moment.
- The opium pipe is his hand at his lips and the smoke there (the cast has no pipe in the hand).

## The light after the tone curve was changed (2026-10-11)

By sheets against v1: the day more transparent and more colourful — `haze` 0.12 → 0.04, `saturation` 0.9 → 1,
`shafts` 0.15 → 0.1; the evening — `shafts` 0.5 → 0.3 (the hill behind the steamer seen); the night lighter than in
v1 (there the people on the pier sank in the dark) — `ambient` 0.32 → 0.55, the moon `moon` `strength` 0.8 → 1.3.


Shortened silences (2026-10-21, the browser play): `quay` — Fogg comes from nearer (`quay:met` at about 3.7 s), the tail 1 s; `cousin` — `cousin:looks-back` at about 2.4 s.

After the second browser play (2026-10-21): `cousin` framed on the three (the operator on Passepartout between them, 0.55) — Aouda and Fogg both in the frame's middle 4:3; `carnatic` — she casts off and swings her bow out in 8 s (`carnatic_present` → 0.5; was 0.45 in 26 s), the camera drawing back with her. The cut aboard staged again: her deck about the gangway's head is a plane now (`steamer_planks`), the camera on it by the rail, a little above him — he lies on the planks under the lantern; at `carnatic:cast-off` a cut (made ready) to the pier, the camera drawing back down it as she goes.

2026-10-23: the night lighter (look `night`: ambient 0.8 `#7487b4`, haze `#364058`); the night jetty (`NIGHT`) seen from farther back along it — the black hull against the moonlit sky, Passepartout on the lit planks, not the hull's black filling the frame.

## Contract for the check

```json
{"beats": {
  "quay": {"after": [], "tells": ["quay:met"], "seconds": 5, "show": false},
  "cousin": {"after": ["quay"], "tells": ["cousin:looks-back"], "seconds": 4, "show": false},
  "tavern": {"after": [], "tells": ["tavern:poured"], "seconds": 9, "show": false},
  "badge": {"after": ["tavern"], "tells": ["badge:shown", "badge:up"], "seconds": 8, "show": false},
  "pipe": {"after": ["badge"], "tells": ["pipe:up"], "seconds": 11, "show": false},
  "carnatic": {"after": [], "tells": ["carnatic:aboard", "carnatic:cast-off"], "seconds": 18, "show": false},
  "morning": {"after": [], "tells": ["morning:watch"], "seconds": 9, "show": false},
  "bunsby": {"after": [], "tells": ["bunsby:fix"], "seconds": 13, "show": false},
  "cast_off": {"after": [], "tells": ["cast_off:sails-up"], "seconds": 25, "show": false},
  "stay_behind": {"after": [], "tells": ["stay_behind:wave"], "seconds": 9, "show": false},
  "show": {"after": [], "tells": ["show:announce"], "seconds": 4, "show": false},
  "pyramid": {"after": ["show"], "tells": ["pyramid:fogg"], "seconds": 3, "show": false},
  "see": {"after": ["pyramid", "pyramid_show"], "tells": [], "seconds": 6, "show": false},
  "collapse": {"after": ["see"], "tells": ["collapse:batulcar"], "seconds": 5, "show": false},
  "finish": {"after": ["pyramid", "pyramid_show"], "tells": ["finish:bow"], "seconds": 10, "show": false},
  "reunion": {"after": [], "tells": ["reunion:face"], "seconds": 9, "show": false},
  "evening": {"after": [], "tells": [], "seconds": 20, "show": true},
  "stay_awake_show": {"after": [], "tells": [], "seconds": 15, "show": true},
  "yokohama": {"after": [], "tells": [], "seconds": 17, "show": true},
  "pyramid_show": {"after": [], "tells": [], "seconds": 20, "show": true}
},
"points": ["tankadere", "tables#table", "tavern_front#door", "parapet#parapet", "steps#steps", "steamer_hull#gangway", "steamer_hull",
  "steamer_rig#masthead", "steamer_funnel#funnel", "stage_front", "far#peak", "far#pagoda", "sky#sun", "sky#moon", "sampan#stand",
  "steamer_deck#aboard", "tankadere_crew#helm", "pyr#b0", "pyr#b1", "pyr#b2", "boatman", "boatman#flame",
  "fogg", "fogg#head", "aouda", "aouda#head", "fix", "fix#head", "fix#badge", "bunsby", "bunsby#head", "passepartout", "passepartout#head", "batulcar"],
"offers": ["fogg#head", "aouda#head", "fix#head", "bunsby#head"],
"party": {"with_aouda": 0, "with_fix": 0, "aouda_dress": 0},
"acts": {}}
```
