# The deck (`paluba`) — NOT READY (stopped 2026-10-15 as the game was paused)

A new scene of chapters I–IV (docs/vokrug-sveta/scenes.md, the deck). The work stopped halfway: there is the design,
the plan, `scene.json` (all the elements, keys, light, music), `lib.js` (the ship's plan, the colours, the Henrietta's
parts, the film's beats), and the paintings of the sky, the sea, the port, the China's smoke, the quay, the warehouses,
the gangway. **Never once rendered or checked** (not even by a run in node). Do not open the scene on the stand as a
finished one yet.

## The design (decided)

- The ship stands in the world; the way she makes is the sea (the shader `sea.wgsl` drives the whitecaps back by
  `speed`, the phase — `sea.animate.js`). The ship's metres: `distance` — forward along the keel (the bow ~+46),
  `across` — to the starboard side. The deck is the ground (0), the sea −5.5, the quay −2.6 on the right (`relief`).
  The camera `walk` stands at the poop and looks forward; the operator frames the people (`camera_target` on the
  people or on unseen points between them: `night_two`, `fix_consul`, `two_pacific`, `calendar_three`, `coal_three`,
  `bridge_two`).
- One set of elements for four ships (`ship`): the paintings read `ship` and `port` (changed only on a cut).
- The port (`port`) — a far silhouette on the starboard bow (`port_far`, `lib.skyline`), for suez / new_york /
  liverpool also a quay (`quay`), warehouses (`sheds`) and a gangway (`gangway`, a walk plane: the constables come up
  it).
- The light: day (the sun behind on the right, `sun_day`), `dawn` (a low sun on the starboard bow, `sky#sun`), `night`
  (the moon on the right, `sky#moon`, the moon's path — the sea's mirror; the lantern `lantern` by the people at the
  rail), `fog` (Liverpool); the hatch's fire `fire_light`, the flare `flare_light`.
- «The boilers» (`burn`): a view from high on the poop (`lib.BURN_VIEW`), all the parts seen. The parts — `PARTS` in
  lib.js: each on its own anchor with the place keys `at_<part>_a/_d/_e`; by `drag_<part>` the script is to place them
  (`lib.partAt`), the animate to shrink them (`lib.partAnimate`), a mast falls on its side (`lib.fallOf`), `locked_*` —
  dimmer, 0 — gone, a flare (`flare` — the flare's number, `flare_glow`).
- The cell (`cell`) — a small room far on the right (across 400, outside the deck's frames), a cut of `camera_x` there;
  `cell` — the insert `cell_close`, `release` — Fix runs in (real people).

## What there is

| File | Where it stands |
| --- | --- |
| `scene.json` | all the elements, the people (10: fogg, passepartout, aouda, fix, consul, sailor, speedy, stoker, policeman, policeman_2), the keys and `states`, the light and looks, the music (`A_FLAT_MAJOR_F_MINOR`). Made by a script (outside the repository) — from now on edit the JSON itself |
| `lib.js` | the plan, the ships' colours, the parts and their motion, the ports' silhouettes, **all the beats** (`film`): suez, bombay, rail_night, plaid, writes, pacific, punch, shake, calendar, new_york, mutiny, coal, burn, queenstown, sails_only, liverpool, cell, release, fix_down, fix_hand — written, not checked |
| `elements/` | `sky` (+animate), `sea` (+animate, wgsl), `port_far`, `china`, `quay`, `sheds`, `gangway` |

## What there is not

- The paintings of the other elements (they are in `scene.json`, with no code — empty): `deck`, `bulwarks`,
  `bulwarks_s`, `gunwale`, `gunwale_s`, `bow`, `speedy_cabin`, `speedy_cabin_side`, `cabin_roof`, `deckhouse`,
  `deckhouse_side`, `house_roof`, `bridge_rail`, `calendar` (the leaf `leaf`, «WEDNESDAY», the point `calendar#leaf`),
  `funnel` (the point `funnel#top`), `mast_main`, `mast_fore`, `yards`, `yards_fore` (the sails by `sails`), `hatch`
  (the point `hatch#fire`), `hatch_glow`, `bunks`, `boats`, `paddle_box`, `walking_beam`, `lantern` (the point
  `lantern#lamp`), `deckchair`, the inserts `porthole` (Speedy roaring at a porthole) and `cell_close` (the bench, the
  watch, the bars' shadow by `cell_time`), the cell's walls `cell_*` and its door (`door`). The points `<part>#part` for
  «The boilers» are set in these paintings — there are none yet.
- `script.js` (placing the parts by `drag_*`, a flare at 0, `speedy_grief` → hands to the head, wear by the game's
  keys, `scene.kit.beats.play`), `showcase.js` (in lib.js `SHOWCASE` refers to `burn_show`, `cell_show` not yet
  written — there are none), the elements' animates.
- The cast's people `consul`, `sailor`, `speedy`, `stoker`, `policeman`, the things `notebook`, `plaid`,
  `plaid_shoulders` (the plaid on Aouda's shoulders — needed in the cast), Passepartout's wings and Fix's bruise
  (`kit.cast.wear.pp_wings / fix_bruise` — so `lib.film` expects them; correct it once the cast gives them).
- The cast's motions the beats call: `punch`, `knocked_down`, `laugh`, `spread_hands`, `salute`, `whisper`,
  `write_note`, `shovel` — ordered from make_motion (the keys below), not looked at and not put into `cast.data.json`.
  make_motion: punch `e6b110bc218b67577df72748d77fe35b6f915ef7`, knocked_down
  `5af08d051c5ecd83b593cb144898b33966ce1478`, laugh `79e4aeec4cdf5103283bd995822222b41275b7ff`, spread_hands
  `48183812c681a3f431b2bc18618899b4e5448291`, salute `cda91ec955dd11586b69a038c36efe32bbaf0da7`, whisper
  `fbfe74190364ac4498c7d9857265aa29da37eefa`, write_note `ffc97b4e9a43fa76229ba49f923f41d5e2f67a30`, shovel
  `ad0cb24c55f82a7ec8641a0f281ba8b9f76c0f00`.

## Differences from scenes.md (intended)

- The cell insert's key is `cell_close` (the key `cell` is a beat's name); `release` is a beat, plus the beats
  `fix_down`, `fix_hand`; if `release` (the key) is set before the beat, the beat plays the outcome out itself.
- The boats — on chocks across the deck between the hatch and the deckhouse (on davits they are not seen from the
  poop).
- Keys added: `flare`, `flare_glow`, `door`, `leaf`, `at_<part>_a/_d/_e` (led by the scene).
- The moments — as in scenes.md; none of its own added.

## Doubtful

- A sea plane with `reflect` and a shader of its own at once — not checked that the engine takes both.
- The gangway's `rotation` direction (270) and its slope — by eye, not checked.
- The people's places in the beats (`lib.SPOT`) are calculated, not seen; Liverpool — Fogg stands with his back to the
  camera, move him.
