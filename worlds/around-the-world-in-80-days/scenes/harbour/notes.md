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
| `pp_walk` | **changed:** where the game sends Passepartout along his way (0…1) — he walks there at his own pace (`stagger_walk`, ~0.9 m/s), the camera with him; it was where he is (people now walk at a real speed) | 0 |
| `pp_walk_at` | **new:** where he is on his way now, in units of `pp_walk` (set by the scene) | 0 |
| `pp_stumble` | a rise to 1 — he stumbles and walks on | 0 |
| `aouda_dress`, `with_aouda`, `with_fix` | as they were | |

Led by the scene (the game is not to touch them): `steamer_x/_d/_facing`, `boat_x/_d/_facing` (by `carnatic_present`,
`tankadere_out`), `steamer_roll`, `boat_roll` (rolling), `steamer_smoke` (smokes while `carnatic_present` > 0),
`aouda_wear` (by `aouda_dress`). `camera_roll` = 4 × `daze`: the scene sets it itself when `daze` is set at once;
whoever moves `daze` over time (`move`) moves `camera_roll` beside it — the same seconds, the same curve, to 4 × the
value (a camera key set at once is a new shot: it is not set frame by frame).

## Beats (`lib.film`; at its end the scene says `beat:<name>`)

| Beat | after | What |
| --- | --- | --- |
| `quay` | — | Hong Kong, day: Aouda at the parapet, Passepartout beside her; Fogg comes along the quay (`fogg_walk`), Passepartout turns round, she does as he comes up; he looks at her |
| `cousin` | quay | the camera to Aouda; she looks at the water and at him again; a pose for the choice |
| `tavern` | — | evening: Passepartout and Fix at a table by the railing; Fix reaches for the bottle, pours more |
| `badge` | tavern | Fix shows his badge (`badge`, Passepartout looks at `fix#badge`), Passepartout gets up (`rise_table`) |
| `pipe` | — | opium: `daze` up to 0.6, `pp_walk` → 0.16, he stumbles once |
| `pipe_on` | pipe | `pp_walk` → 0.32 (towards the pier), he stumbles once more |
| `carnatic` | — | night: the steamer casts off, turns and moves off (`carnatic_present` 1 → 0.45 in 26 s; after that — the game, as far as it likes) |
| `morning` | — | morning, the jetty empty: Fogg (and Aouda, `with_aouda`) by the pier; a cut closer; the watch (`watch_look`, a glance at the hand) |
| `cast_off` | — | day: the Tankadere sets her sails and leaves the pontoon (`tankadere_out` → 0.3); no people — they will come with `stay_behind`, `cast_off` |

The showcase (`showcase.js`, `lib.SHOWCASE`): quay, cousin, `evening` (showcase only: day → evening, the lanterns lit),
tavern, badge, pipe, pipe_on, carnatic, morning, cast_off, `yokohama` (showcase only: Yokohama at night, the camera
from the booth along the quay). Each beat ≤ 30 s.

The scene tells the game the beats' moments (`scene.tell`), besides `beat:<name>`: `quay:met` (Fogg came up and looks
at her), `cousin:looks-back`, `tavern:poured`, `badge:shown`, `badge:up`, `carnatic:cast-off`, `morning:watch`,
`cast_off:sails-up`; Passepartout's way in the opium — the key `pp_walk_at`.

## Points and elements for a choice

`tankadere`; points: `tables#table`, `tavern_front#door`, `parapet#parapet`, `steps#steps`, `steamer_hull#gangway`,
`steamer_hull`, `steamer_rig#masthead`, `steamer_funnel#funnel`, `stage_front`, `far#peak` / `far#pagoda`, `sky#sun`,
`sky#moon`.

## The people

`fogg`, `aouda`, `passepartout`, `fix` (the cast `cast`); the keys `<id>_a`, `_d`, `_do`, `_turn` (0 — to the water,
180 — to us), `_look`, `_reach`, `_with`, `_wear`, `_gait`, `_here` (by default there is no one). The quay, the
terrace, the pier, the jetty — on the ground (0).

## Next

- The other beats: `stay_behind`, `carnatic` with Passepartout on deck (`on` the steamer), `bunsby`, the people of
  `cast_off`, Yokohama (`show`, `pyramid`, `see`, `collapse`, `finish`, `reunion`).
- The pontoon (`landing`) lies below the ground (−1.3): people on it and on the booth's stage will need a ground of
  their own (`walk`, relief) — when Yokohama's beats come.

## The light after the tone curve was changed (2026-10-11)

By sheets against v1: the day more transparent and more colourful — `haze` 0.12 → 0.04, `saturation` 0.9 → 1,
`shafts` 0.15 → 0.1; the evening — `shafts` 0.5 → 0.3 (the hill behind the steamer seen); the night lighter than in
v1 (there the people on the pier sank in the dark) — `ambient` 0.32 → 0.55, the moon `moon` `strength` 0.8 → 1.3.

## Where the work stands (2026-10-15, stopped at the owner's request)

Of scenes.md («ADD / CHANGE») nothing is done here yet: `pipe`/`pipe_on` with the boatman and `message`,
`carnatic:aboard`, `bunsby`, the people in `cast_off`, `stay_behind`, Yokohama (`show`, `pyramid`, `see`, `collapse`,
`finish`, `reunion`), the people `bunsby`, `boatman`, `batulcar`, `nose`. The scene — as it was.
