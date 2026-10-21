# The deck (`deck`)

The steamers' deck of chapters I–IV (docs/vokrug-sveta/scenes.md, «Палуба»): Suez and Bombay on the «Mongolia», the
night on the «Rangoon», Fix and the calendar on the «General Grant», the «Henrietta» — New York, the mutiny, no coal,
«The boilers», Queenstown, under sail —, Liverpool, the custom-house cell and the release. Engine 3, the camera `walk`.
Modules: `light` (colours), `cast` (the people), `beats` (the film). `scene.json` is written by
`tools/deck_scene.py` (`python tools/deck_scene.py scenes/deck/scene.json`) — edit the spec there, not in the JSON.

## How it is made

- **The ship stands in the world**; her way through the water is the sea's: the plane `sea` (a mirror, `rough` 0.55,
  `ripple` 0.35) with its own shader `sea.wgsl` (whitecaps and foam streaks running aft by `speed`: the animate's
  phase). The engine takes the mirror and the shader together (no warning, rendered). Metres are the ship's:
  `distance` forward along the keel (stern −5, stem 47), `across` to starboard; the deck is the land (0), the sea −5.5,
  a quay to starboard −2.6 (`relief`; across > 300 — the cell — is 0 again).
- **The camera** stands on the deck at the poop looking forward. In `walk` the operator only slides (it never turns):
  every shot looks forward, so whoever speaks is staged turned aft toward the camera or in profile (`lib.SPOT`).
  Two-shots frame unseen points (`suez_two`, `fix_consul`, `night_two`, `two_pacific`, `calendar_three`, `ny_two`,
  `coal_three`, `bridge_two`, `lv_two`: each 2 m tall, its box round its anchor — a shot of 1 frames 2 m there). A
  target high above the deck (the bridge) is framed at `medium` or closer, so the camera rises to it (a lower shot
  looks up steeply, past what the sky paints).
- **One set of elements for four ships** (`ship`: `mongolia`, `rangoon`, `general_grant`, `henrietta`; colours —
  `lib.COLOURS`): the deck, the bulwarks (`lib.bulwarkSide`; the starboard ones open at the gangway when a quay is
  alongside), the iron sheer strake under them (`gunwale*`, what is left when the bulwarks burn), the forecastle at the
  bow, the captain's cabin on the poop (`speedy_cabin`, its side with Speedy's porthole, its roof — a walk plane:
  Speedy salutes from it), the deckhouse (aft face, both sides, the bridge on its roof with the wheel and rail, the
  calendar on its face), the funnel (`funnel#top`: smoke and sparks), two masts with shrouds and ratlines
  (`lib.mast`), their yards with the sails furled (`lib.yardsOf`; the «Henrietta»'s sails let fall by `sails`), the
  stokehold hatch (`hatch#fire`) and its glow (`hatch_glow`, by `fire`), the bunks, two boats on chocks across the
  deck, the night lantern on the main shrouds (`lantern#lamp`, lit by `night`). The «General Grant» only: the
  paddle-boxes (copies, both sides), the walking-beam (rocking by `speed`), Fogg's deck chair.
- **The port** (`port`) — a skyline 1.5 km off on the starboard bow (`port_far`, `lib.skyline`); Suez, New York and
  Liverpool also a quay, sheds and a gangway (a walk plane: the constables come up it). New York — the «China»'s smoke
  on the horizon (`china#smoke`).
- **The light**: day (`sun_day`), `dawn` (a low sun on the starboard bow, `sky#sun`), `night` (the moon to starboard,
  its path on the sea; the lantern), `fog` (Liverpool); the hatch's fire `fire_light` and the flare `flare_light`.
- **«The boilers»** (`burn`): from high on the poop (`lib.BURN_VIEW`), all the parts in sight. The parts — `PARTS` in
  lib.js: `deckhouse` (its face, sides, bridge, rail, calendar), `boats` (`boats`, `boats_s`), `bunks`, `yards`
  (`yards` — the foremast's, `yards_main`), `mast_fore`, `mast_main`, `bulwarks` (both sides), `speedy_cabin` (face,
  side, roof). Each on its anchor, placed by the script from `drag_<part>` (`lib.partAt`: keys `at_<part>_a/_d/_e`); its
  elements' animates shrink it on the way, hide it at 0, dim it while `locked_<part>` (`lib.partAnimate`). A mast is
  lowered down through the deck as it is dragged (out of sight under the planks); its yards go down with it and are
  gone once it is burnt (their own part's ring is then where nothing is seen — the game is asked to burn the yards
  before their masts). A part
  going to 0 flares in the hatch (the script: `flare` +1 — a sheaf of sparks, `flare_glow` — a flash). `fire` — flames
  from the hatch, its glow and light, sparks from the funnel. `speedy_grief`: from 0.4 his hands to his head, angry;
  from 0.8 grief (the script).
- **The inserts**: `porthole` — Speedy roaring at his porthole, close (painted; his face shaking — the animate);
  `cell_close` — the cell's bench from above: Fogg's knees and hands, his watch open (its hands go 11:40 → 14:33 with
  `cell_time`), the bars' shadow sliding across.
- **The cell** — a room far to starboard (`cell` at across 400): floor, three walls, the barred window (`cell_window`),
  the bench, the door (`cell_door`, swung by `door`: the script's `door_f`). The beats there frame `cell_two` (the
  operator goes there).

## Beats (`lib.film()`, played by the world's `beats`)

- `suez` (≈ 14 s): Passepartout and Fix face to face by the gangway's head (profiles, smiling); the cigar offered —
  `suez:chat`; Fix walks forward to the consul, the two face to face (profiles), he whispers — `suez:whisper`;
  Passepartout looks at the town.
- `bombay` (≈ 6 s): dawn, Bombay to starboard; Fogg at the rail with his notebook, turned to the camera; he looks up
  over the sea and back — `bombay:book`.
- `rail_night` (≈ 7 s): night on the «Rangoon», the moon's path; she at the rail, he a step aft inboard; she turns to
  him — `rail_night:turns`; he to her. `plaid` (after it, ≈ 8 s): he steps round before her (his face to us) and lays
  the plaid over her shoulders (`plaid_shoulders`, seen on her back). `writes` (after either, ≈ 7 s): he gives her the
  notebook, she turns to the lantern and writes, her face to us (`write_note`) — `writes:done`; he looks at the sea.
- `pacific` (≈ 6 s): the «General Grant»; Passepartout at the rail (wings by `pp_wings`); Fix comes aft from the
  deckhouse and stands before him; face to face (profiles) — `pacific:fix`. `punch` (after it, ≈ 10 s): the blow —
  `punch:down` (a wider, lower shot: the fall to the deck in it); Fix falls, sits up, sets his hat right. `shake` (after it, ≈ 5 s): hands.
- `calendar` (≈ 9 s): close on the calendar; the sailor turns the leaf — Wednesday, 20 November, again —
  `calendar:leaf`; the shot opens on the three; Passepartout turns to Fogg in his chair and laughs — `calendar:laugh`.
- `new_york` (≈ 13 s): the «Henrietta» at the quay; Fogg and his party at the gangway's head, the «China»'s smoke —
  `new_york:smoke`; Fogg goes forward under the bridge; Speedy on it, close — `new_york:speedy`.
- `mutiny` (≈ 7 s): Fogg on the bridge; the porthole insert opens — `mutiny:porthole` — and closes.
- `coal` (≈ 9 s): the smoke thins; the stoker, come up from the hatch, spreads his hands — `coal:stoker`; meanwhile
  Speedy is brought aft out of the deckhouse by a sailor, walking toward us, and stands before Fogg — `coal:speedy`.
- `burn` (1 s): the cut to the boilers' view; the game plays «The boilers» on it.
- `queenstown` (≈ 9 s): dawn, the parts as the game left them; Speedy salutes from his cabin's roof if it is left.
- `sails_only` (≈ 8 s): from the starboard quarter, low, the sails let fall aslant; the camera rises to the bridge; Speedy laughs by
  Fogg — `sails_only:laugh`.
- `liverpool` (≈ 10 s): fog; the constables come up the gangway; Fix comes aft, his hand on Fogg's shoulder —
  `liverpool:hand`.
- `cell` (1 s): the insert `cell_close` opens; the game moves `cell_time`.
- `release` (after `cell`, ≈ 6 s): the insert closes on the cell; the door flies open, Fix runs in, the camera comes in
  on the two — `release:in`; they hold, face to face (the game's choice is offered there, on `fix#head`).
- `fix_down` / `fix_hand` (after `release`, ≈ 7 s / ≈ 6 s): Fogg rises — the blow, Fix down; or he holds out his hand,
  Fix takes it.
- The showcase's own (not the game's): `burn_show` (four parts dragged into the hatch), `cell_show` (the hours in the
  cell).

## Contract for the check

```json
{"beats": {"suez": {"after": [], "tells": ["suez:chat", "suez:whisper"], "seconds": 14, "show": false},
 "bombay": {"after": [], "tells": ["bombay:book"], "seconds": 6, "show": false},
 "rail_night": {"after": [], "tells": ["rail_night:turns"], "seconds": 7, "show": false},
 "plaid": {"after": ["rail_night"], "tells": [], "seconds": 8, "show": false},
 "writes": {"after": ["rail_night", "plaid"], "tells": ["writes:done"], "seconds": 7, "show": false},
 "pacific": {"after": [], "tells": ["pacific:fix"], "seconds": 6, "show": false},
 "punch": {"after": ["pacific"], "tells": ["punch:down"], "seconds": 10, "show": false},
 "shake": {"after": ["pacific"], "tells": [], "seconds": 5, "show": false},
 "calendar": {"after": [], "tells": ["calendar:leaf", "calendar:laugh"], "seconds": 9, "show": false},
 "new_york": {"after": [], "tells": ["new_york:smoke", "new_york:speedy"], "seconds": 13, "show": false},
 "mutiny": {"after": [], "tells": ["mutiny:porthole"], "seconds": 7, "show": false},
 "coal": {"after": [], "tells": ["coal:stoker", "coal:speedy"], "seconds": 9, "show": false},
 "burn": {"after": [], "tells": [], "seconds": 1, "show": false},
 "queenstown": {"after": [], "tells": [], "seconds": 9, "show": false},
 "sails_only": {"after": [], "tells": ["sails_only:laugh"], "seconds": 8, "show": false},
 "liverpool": {"after": [], "tells": ["liverpool:hand"], "seconds": 10, "show": false},
 "cell": {"after": [], "tells": [], "seconds": 1, "show": false},
 "release": {"after": ["cell"], "tells": ["release:in"], "seconds": 6, "show": false},
 "fix_down": {"after": ["release"], "tells": [], "seconds": 7, "show": false},
 "fix_hand": {"after": ["release"], "tells": [], "seconds": 6, "show": false},
 "burn_show": {"after": [], "tells": [], "seconds": 16, "show": true},
 "cell_show": {"after": [], "tells": [], "seconds": 9, "show": true}},
 "points": ["fogg", "passepartout", "aouda", "fix", "speedy", "stoker", "sailor", "consul", "policeman",
  "hatch#fire", "deckhouse#part", "boats#part", "bunks#part", "yards#part", "mast_fore#part", "mast_main#part",
  "bulwarks#part", "speedy_cabin#part", "calendar#leaf", "funnel#top", "china#smoke", "lantern#lamp"],
 "offers": ["fogg#head", "aouda#head", "passepartout#head", "fix#head", "speedy#head",
  "deckhouse#part", "boats#part", "bunks#part", "yards#part", "mast_fore#part", "mast_main#part", "bulwarks#part",
  "speedy_cabin#part"],
 "party": {"with_aouda": 0, "with_pp": 1, "with_fix": 0, "aouda_dress": 0, "pp_wings": 0, "fix_bruise": 0},
 "acts": {}}
```
