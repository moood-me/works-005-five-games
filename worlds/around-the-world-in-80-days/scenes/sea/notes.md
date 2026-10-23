# The sea (`sea`)

The «Tankadere» in the typhoon, chapter II (docs/vokrug-sveta/scenes.md, «Море»): the squall, «The typhoon», Aouda in
the spray, the storm dying away, the gun and the steamer. Engine 3, the camera `walk` riding the boat's stern, low.
Modules: `light` (colours), `cast` (the people), `beats` (the film). `scene.json` is written by `tools/sea_scene.py`
(`python tools/sea_scene.py scenes/sea/scene.json`) — edit the spec there, not in the JSON.

## How it is made

- **The boat** — the pilot schooner of the harbour scene (dark green, a gold line, two gaff sails, her number 43) —
  is built on three unseen anchors: `boat` (in the world, her middle 7.5 m ahead of the start; its `facing` — the bow's
  yaw `bow_f`, its `tilt` — the pitch `pitch`), `hull` (on it, turned 90°: its `tilt` — the heel `roll`), `frame` (on
  that, turned back: her own frame — `across` to starboard, `distance` forward from her middle, the stern −7.5, the stem
  8). Everything of hers stands on `frame`, every card with an explicit `facing` (so it heels with her); the people
  stand on her deck (a walk plane) `on` the frame. The camera rides `stern` (`camera.on`), 1.15 m over the deck
  (`camera_h` −0.55): she pitches and heels in the frame, the horizon stays level.
- **Her parts**: the deck (her outline narrowing to the stem, the hold's hatch), the bulwarks (`side_p`, `side_s`,
  `bow_p`, `bow_s`: `lib.bulwark`), the companion, two masts (`lib.mast`; on the mainmast the flag at half-mast — the
  red ensign upside down, low on the mast so that it is seen from the stern — by `flag`), the mainsail and the foresail aslant, their booms out to starboard (`lib.gaffSail`;
  shortened from the boom up by `reef`), the tiller (a plane: its bar put over by `helm`; the point `tiller#tiller` at
  its end — Bunsby's hands hold it), the rudder head, the stem with the bowsprit and the little signal gun
  (`bowsprit#breech`, `bowsprit#muzzle`: the flash `gun_light`, the smoke `gun_smoke`, at each new `gun`).
- **The pose** (`lib.pose`, the script sets it whenever its keys change or move): the pitch — the bow lifts as the crest
  comes under her (`wave` ≈ 0.42) and drops into the trough after it (≈ 0.66), as high as `wave_h`; the heel — `heel`
  (+1: down to starboard, 22°); the yaw — `helm` (+1: the bow 20° to starboard); and the swell's own rocking (`rock`,
  `rise`: the script moves them to and fro all the time, each at its own pace), as strong as the storm.
- **The crest** (`crest`) — a long wall of grey-green water with a breaking top and spindrift, standing in the world:
  `wave` 0 — 110 m ahead, 0.5 — under her bow, where it sinks under her as she rides it, past 0.55 — gone (behind her);
  its height by `wave_h`; its slant and the side it comes in from by `wave_from` (−1 the port bow … +1 the starboard
  bow; the game's «The typhoon» does not send it yet — 0, dead ahead).
- **The water over the bow** (`green_water` rising to 1): a sheet of sea over the port bow (`green`, draining away over
  two seconds) and a burst of spray (`green_splash`); the spray at the stem (`spray`) and the rain (`rain`) by `storm`.
- **The sea** — a plane kilometres wide, a weak rough mirror; its swells run at the boat and foam by its shader
  (`sea.wgsl`: `phase` from the animate, faster with the storm). **The sky** — a grey squally day; the typhoon's slate
  and racing scud by `storm`; a pale gleam on the horizon as it dies away with the steamer in sight. The look `storm`
  — the haze, the wind, the sun dimmed: the people stay readable.
- **The steamer** ahead to starboard, 480 m off (`steamer`): broadside, her smoke lying back; turning toward the boat — bow on — by
  `steamer_turn`. Point `steamer#ship`.
- **The people** (standing, holding on — the cast's `storm_brace` reads as sitting on air here, so it is not used):
  Bunsby at the tiller, both hands on it; Fogg aft by the port rail, turned aft from the spray, a hand on the rail and,
  with her aboard, Aouda's hand in the other; Aouda beside him, nearer (`with_aouda`); Fix by the starboard rail, a
  hand on it, afraid (`with_fix`). Their wear by
  the game's keys (`aouda_dress`, `fix_bruise`).

## Beats (`lib.film()`, played by the world's `beats`)

- `squall` (≈ 8 s): the camera's gaze a little up (the sails in sight); the pale blue squally sky goes to slate, the
  wind and the sea get up (`storm` 0 → 0.6); the sails are reefed (`reef` → 1: shorter, the cloth bundled on the booms)
  — `squall:reef`; Bunsby looks to Fogg (his line).
- `typhoon` (after `squall`, ≈ 3 s): the storm at its height (`storm` 0.9) — the game's «The typhoon» drives `wave`,
  `wave_h`, `helm`, `heel`, `green_water` over it.
- `aouda_storm` (after `typhoon`, ≈ 6 s): close on Aouda in the spray, calm, her eyes on the sea astern; the shot opens again.
- `shanghai` (after `typhoon` or `aouda_storm`, ≈ 16 s): the storm dies away (`storm` → 0.2); the steamer ahead; the
  flag at half-mast; Bunsby goes forward to the gun, the camera with him (`gun_view`: him, the gun, the steamer beyond);
  the shot — `shanghai:gun` (the flash, the smoke); the steamer turns toward them — `shanghai:turns`.
- The showcase's own (not the game's): `typhoon_show` — three crests met bow on, the green water once.

## What is not as wished

- The crest cannot show the side it comes from unless the game sends `wave_from`: «The typhoon» keeps `dir` to itself
  (the zone's place). Asked of the game (the coordinator).

2026-10-23: the storm's look lighter (ambient 0.92 `#c4ced2`, haze 0.36 `#8a989e`, saturation 0.7) — the people on deck clear in the typhoon.

## Contract for the check

```json
{"beats": {"squall": {"after": [], "tells": ["squall:reef"], "seconds": 8, "show": false},
 "typhoon": {"after": ["squall"], "tells": [], "seconds": 3, "show": false},
 "aouda_storm": {"after": ["typhoon"], "tells": [], "seconds": 6, "show": false},
 "shanghai": {"after": ["typhoon", "aouda_storm"], "tells": ["shanghai:gun", "shanghai:turns"], "seconds": 16, "show": false},
 "typhoon_show": {"after": ["typhoon"], "tells": [], "seconds": 16, "show": true}},
 "points": ["fogg", "aouda", "fix", "bunsby", "tiller#tiller", "bowsprit#muzzle", "steamer#ship", "crest#crest"],
 "offers": [],
 "party": {"with_aouda": 0, "with_fix": 0, "aouda_dress": 0, "fix_bruise": 0},
 "acts": {}}
```
