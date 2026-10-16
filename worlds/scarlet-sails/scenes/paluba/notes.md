# The Deck (`paluba`) — on engine 2

On a ship's poop, to the right of the wheel, facing the bow: the wheel to the side at the frame's edge, the deck leads the eye forward, the main mass is
the sails, the sky behind them, to starboard the sea. The world's language: light, fine, minimal; space, the contrast of the sails against
the sky, the sails' shadows on the deck, wet teak with a faint reflection, a mirror of a sea. `ship` changes the ship: the Secret —
a white galliot, the Anselm — a dark worn schooner, patched grey sails. The only scarlet is the Secret's sails and silk.

Everything is painted once, in the day's colours. No painting reads a key that moves: the paintings read only
`ship` (it changes by a cut). The hour is the scene's light and the world's sky (`nebo`), the sails — the world's sailcloth shader (`korabli`), the rest
— layers and `animate`.

## The world lies where it lies, the ship sails over it

Ahead, in the west, is Kaperna (`kaperna`, 6 km from the start of the way); the port of Liss — 30 km astern (`harbour` and all on it);
the sea — one mirror plane 40 × 60 km under everything; the mail steamer — an element with its own place and way. The ship stands in
the world where the keys `ship_x`, `ship_d` hold her (metres across and along the course west) and is turned as `ship_f` says;
the script leads her under her own way — up to 4 m/s by `sails_set` (less when the sails luff; 0 in port and when she has hove
to 450 m off Kaperna) — where her bow points (`heading` turns the ship by ±25°). Kaperna, the sun, the steamer
move aside by themselves — because the ship has turned.

The camera rides on the ship: `"camera": {"mode": "roam", "on": "ship", "area": […]}` — the start, the viewer's steps, the operator's
room and his shots are reckoned in the ship's axes. `area` — the poop and the waist up to the mainmast (the operator needs shots by the mast).

Three unseen supports, one on another:

| Support | What |
| --- | --- |
| `course` | the ship's place and turn in the world (`ship_x`, `ship_d`, `ship_f`); level |
| `hull` | the keel: the heel (`tilt` — `heel`) about the axis along the keel, 2.5 m below the poop |
| `ship` | the decks' frame: its origin is the viewer's place on the poop (2.4 m to the right of the keel), `across` — to starboard, `distance` — to the bow, `elevation` — up from the poop (the waist −1.4, the sea −3.8). All that is the ship's, the people and the camera — `on: ship` |

The ship lengthwise (`distance`): the taffrail −3, the wheel 2.6, the mizzen 5.2 (the Secret only), the edge of the poop 6, the hatch 9…12, the mainmast 14,
the foremast 23, the bow 32. The keel — `across` −2.4.

## What became what (v1 → v2)

| v1 | v2 |
| --- | --- |
| the ship stood, the world moved: the sea went under the stern (`travel`: `sailed`), Kaperna came near by `shore` (6 km → 600 m in 10 s), the steamer — by `steamer`, the Liss quay came in from the side by `port`; the script moved Kaperna, the steamer and the sun by `heading` | the world lies in its place, the ship sails and turns (above); `shore`, `port`, `steamer` are **places**: they put the ship (the steamer) there, from there all go under their own way |
| the camera stood at the world's origin | the camera on the ship (`camera.on`) — it was needed in the engine (`engine2-camera-on`) |
| the square sails — halves on a hinge at the mast, the painting read `sails`, `sails_set`, `luff` (repainted every frame while they moved) | the same halves (the wind turns them: `belly_l`, `belly_r`, `belly_tilt` — the light falls by the turn), the painting is the whole sail set, white (`korabli.squareSail`, a half), the rest is the world's sailcloth shader `tools/korabl-cloth.wgsl`: set as far as `set` says (the courses fall from the yard, the topsails and the topgallants grow from the foot with the yard), scarlet by `scarlet`, the wind's folds, the luffing |
| the yards were painted where they are now | the yards are the mast's layers, `animate` leads them after the head (`lib.yardsMotion`); the topgallant hangs on a height key (`fore_tg_e`, `main_tg_e`): it goes up with the topsail yard |
| the Anselm's fore-and-aft sails were painted by `sails_set` | painted once (`korabli.alongSail`) + the sailcloth shader (they grow from the boom); the boom and the gaff are an element of their own (`mainsail_spars`, `foresail_spars`), the gaff a layer, `animate` lays it to the boom |
| the Secret's spanker changed colour in the painting | the sailcloth shader (`scarlet`, the wind); the gaff is an element of its own, `spanker_gaff` |
| the sails against the sun were dark | `translucent`: they let the light through, the sail's shadow is scarlet light |
| the sky was painted by `hour`, the sun and the moon were set by the script (`sun_…`, `moon_…`) | the world's sky `nebo` (a shader, all round); the sun and the moon are its layers, the light — `from: "sky#sun"`, `"sky#moon"`; `storm` — the sky's uniform |
| the sea: a painting by `e.area`, the crests rode with `sailed` | a plane 40 × 60 km, the colour and the swell's crests are its shader `sea.wgsl` (they lie in the world, three sizes, `storm`), the mirror is the engine's |
| the wheel was painted anew by `helm` | the rim is a layer, `animate` turns it |
| the lanterns: the glass's colour and the light by `lanterns` in the painting | dark glass + the layer `lit`, the glow `flame` — `e.glow`; the scene's light `of: "lantern_…#flame"` |
| the silk: the bolts were parts of one element, grew in the painting by `silk` | each heap is an element (`silk`, `silk_1…4`), each bolt a layer, `animate` lays them in turn; the lengths (`silk_run`) are layers, unrolled by `scaleY` |
| the cask — `globalAlpha` by `cask` | a layer, its alpha |
| the windows of Liss and the quay lamps — an alpha by the night in the painting | the layer `lit` + `e.glow`, `animate` by `night`, `dusk`; the lamps' light — `on: harbour_lit` |
| the steamer's smoke was painted by `e.t` | the particles `smoke` from `steamer#funnel` (`korabli.SMOKE`), while the steamer is here |
| the film — lines of seconds (`film`), the people were set by keys by time | the director's beats (`beats`, `lib.film(scene)`): people walk at their own pace, the cuts are made ready ahead, the shots on people are the operator's |

## Keys

Described in the scene's `states`.

| Key | What | By default |
| --- | --- | --- |
| `hour` | 0…1, as in the whole world; the ship sails west: the dawn astern, the sunset ahead | 0.27 |
| `ship` | `secret` · `anselm` (by a cut) | `secret` |
| `sails` | 0…1: the Secret's sails white → scarlet | 0 |
| `sails_set` | 0…1: furled → set, one by one — the courses, the topsails, the topgallants (the Anselm's — mainsail, foresail, topsail); the way comes from it | 1 |
| `luff` | 0…1: the sails luff (and the way falls off) | 0 |
| `roll` | −1…1: a heel up to 12°; the rolling — on top, stronger in a storm, weaker in port | 0 |
| `storm` | 0…1: the sky, the light, the sea, the wind in the sails, the rolling | 0 |
| `helm` | −1…1: the wheel, three quarters of a turn | 0 |
| `heading` | −1…1: the bow 25° to the left … to the right of the course to Kaperna; the ship sails there | 0 |
| `shore` | **changed:** the place on the way to Kaperna where the ship is put (0 — 6 km, 1 — 600 m; below 0 — further out at sea, −1 — 15 km); from there she goes by herself. In v1 the value was moved and the shore came near — now the shore is reached under the ship's way, and the stages of the way are cuts | 0 |
| `port` | **changed:** 0 · 1 — the ship at the Liss quay (by a cut; there are no values in between) | 0 |
| `steamer` | **changed:** 0 — no steamer; a value puts her ahead to starboard of the ship (towards 0 — 420 m, 1 — 70 m), from there the steamer goes under her own way (2.6 m/s), the Secret overtakes her | 0 |
| `lanterns`, `silk`, `cask` | 0…1, as they were | 0 |
| `skiff_down` | 0…1: the skiff by the starboard side — hanging under the rail → lowered onto the water | 0 |
| `ropes` | 0 · 1 — an insert: the ship's boy's hands on the shrouds close up (the shot `ropes` of the module `closeups`), filling the frame | 0 |
| `climb` | the insert: 0…1 — how high he has climbed (the ratlines go down); moved by “Shrouds” | 0 |
| `hand_l`, `hand_r` | the insert: 1 — the hand closed on the rope, 0 — raised and open; moved by “Shrouds” | 1 |
| `slip` | the insert: 0…1 — a slip, the hands slide (an impulse); moved by “Shrouds” | 0 |
| `beat` | the film's beat | null |

**The play's keys** — the game sets them on opening the scene; no `from` sets them, the beats read them (`scene.get`):

| Key | What | By default |
| --- | --- | --- |
| `leg` | 0…1 — the stage of the way when the scene is opened on `helm`: puts the ship as `shore` does | none (null): `helm` after `raise` goes on from where she is |
| `sun` | 0.26…0.36 — the hour in `raise`, `helm`, `arrive` | 0.26 |
| `wine` | 0 · 1 — in `night_end`: 1 — the Grays' cask and two sailors, 0 — no cask, four sing on the hatch | 0 |
| `ring` | `none` · `finger` · `cord` — Assol's ring on the deck (`steamer`, `night_end`), as on the shore in the skiff: `finger` — a part of the cast by `ring_kind`, `cord` — on a cord over her dress (the part `ring_cord`) | `none` |
| `ring_kind` | `mother` — his mother's, thin, with a stone (the part `ring`) · `own` — his old one, broad (the part `ring_old`) | `own` |

“Shrouds” leads `roll` too: it heels the ship (under the insert) and the insert's horizon. “Course” moves `helm`, `heading`, `luff`.
The keys a mini-game moves every frame are read only by `animate` and the script.

Led by the scene (the game is not to touch them): `day`, `dawn`, `dusk`, `night`, `sun_light`, `moon_light` (`nebo.follow` by `hour`),
`harbour_lit`, `heel`, `ship_x`, `ship_d`, `ship_f`, `ship_at`, `steamer_x`, `steamer_d`, `steamer_smoke`, `steamer_at`, `belly_l`, `belly_r`,
`belly_tilt`, `fore_tg_e`, `main_tg_e`. A cut that changes the hour, the sails or the place carries them with it (`lib.js`:
`voyage` — `placeOf`, `steamerAt`, `nebo.keys`, `rigOf`): else a shot made ready ahead would have the old ones.

Removed: `sailed` (the sea lies in the world), `sun_bearing`, `sun_height`, `moon_bearing`, `moon_height`, `kaperna_…`,
`harbour_across` (nothing is moved about).

**Where the people are — changed:** `gr_`, `as_`, `go_`, `pa_`, `le_`, `sa_`, `cr_`, `s3_`, `s4_`, `zi_`, `m1_`, `m2_` with `a` — metres to **starboard** from the viewer's
place, `d` — metres to **the bow** from it (in v1: `a` — forward from the ship's middle, `d` — to port), `e` — the height
of the deck above the poop (the poop 0, the waist −1.4; in v1 — 2.5 and 1.1). The ship's frame has become an ordinary scene frame, so `<id>_turn`
has kept its sense: 0 — to the bow, 90 — to starboard, 180 — to the stern, 270 — to port. They sit (`<id>_on`) at a place in the ship's frame:
`{on: "ship", at: [across, along, the seat's top above the poop]}` — the Anselm's crosstrees, the hatch's back coaming. Longren stands on
the steamer (`"on": "steamer"`): `lo_a` — metres aft from her middle, `lo_d` — inwards from her port side, `lo_e` — the deck above
the water (3 m; the plane `steamer_deck` behind the painted side).

## Points and elements for the game

`wheel#wheel` (the hub), `wheel#rim_l`, `wheel#rim_r` (where the helmsman's hands lie — new), `shrouds#shrouds`,
`shrouds#top` (the crosstrees), `shrouds#hold_l`, `shrouds#hold_r` (where the hands take hold of the shrouds from the deck), `mainmast#mainmast`, `foremast#foremast`, `bulwark_starboard#rail`, `bulwark_port#rail_port`,
`hatch#hatch`, `silk#silk`, `cask#cask`, `kaperna#kaperna`, `kaperna#longren_house`, `steamer#steamer`,
`steamer#funnel`, `skiff#skiff`, `skiff#bow`, `skiff#seat1`, `skiff#seat2` (they go with the skiff), `ropes#left`, `ropes#right` (the hands on the insert — the points of “Shrouds”), `quay#quay`, `lisse#lisse`, `quay_lamps#lamp0…3`, `sky#sun`, `sky#moon`; `<id>#letter` — a letter in
the hands. For a choice: `shrouds`, `wheel`. Unseen targets for the camera: `by_rail` (the two by the poop's starboard rail), `by_mast` (the two by
the mainmast).

The operator's unseen places off the decks (a beat's `camera_on`: the camera starts there and goes from there to the target; the room `area`
is reckoned from them too): `cam_rail` — over the sea beyond the poop's starboard side, before those standing at the rail, at chest height
(the faces, the hands between the lifeline and the gunwale); `cam_boat` — low over the water by the starboard side, behind the skiff (at 25° to the side:
straight from the side the masts and the square sails are cards edge-on); `cam_steamer` — on the steamer's deck, inwards and forward of Longren.
From the deck the skiff is not seen (it is under the gunwale, over the side), and those standing at the rail have their backs to us.

## Light

`light` — day (ambient 0.9, a light haze: Kaperna 6 km off is seen); the looks `dawn`, `dusk`, `night` by the hour's weights, `storm`
(a grey light, haze, a stronger wind). The night and the storm are light enough for the people to read: the night — ambient 0.7, blue, the moon 0.9, the lanterns 2.2. The sun and the moon are far sources from the sky; the lanterns — the light of their own glows
(`on: lanterns`), the quay lamps — `on: harbour_lit`. The sails, the masts, the sides, the rails, the wheel, the cask, the people cast shadows
on the poop and the waist. The decks are a faint mirror, the sea a mirror (`rough`, `ripple`).

## The people and the film

The people are the engine's, the world's cast: `grey` (as a ship's boy on the Anselm — `grey_wear: cast.characters.grey_teen`), `assol`, `gop`,
`panten`, `letika`, `sailor`, `crew2`, `sailor3`, `sailor4`; the musicians — `zimmer` (Zimmer), `musician1` (the look `musician`),
`musician2` (`cellist`), the instruments are the cast's parts, the beat gives them (`<id>_with`: `violin`, `violin`, `cello`). They stand on
the ship (`on: ship`): they go with her, in the rolling they stay upright. `longren` — on the steamer (`on: steamer`), with his pipe (`pipe`). By
default only Gray is on the deck, at the wheel.

What the model does not do: climb the shrouds — instead the insert `ropes` (only the hands and the sky), then a small sitting
figure on the crosstrees; play the violin — the musicians stand with their instruments lowered and sway (`sway`), in `sew` they sit
with them on their knees; the game's sound plays.

The beats (`lib.film(scene)`; at the end — `beat:<name>`), each with a `from` that is a cut: the ship, the hour, who is where. `after` — the beat
goes on with no `from`.

| Beat | ≈ s | What | Moment (`scene.tell`) |
| --- | --- | --- | --- |
| `anselm` | 8 | the Anselm in a swell far out at sea: Gop by the mainmast, hands behind his back; the ship's boy Gray before the shrouds looks up | `anselm:looks-up` |
| `shrouds` (after `anselm`) | 5 | the boy goes under the starboard shrouds and takes hold of them (the hands on `shrouds#hold_l`, `hold_r`); a cut into the insert `ropes`: both hands closed, by the deck — under “Shrouds” | `shrouds:close` |
| `top` (after `shrouds`) | 7 | a cut to the deck (the insert closed), the camera looks up: on the crosstrees a small figure sits against the sky; a cut to Gop under the mast — his head thrown back | `top:up` |
| `letter` | 3 | the Anselm at Liss, noon (`ship: anselm`, as `gop_bye` after it: the Secret is not bought yet): Gray at the rail reads a letter (under a choice) | `letter:reading` |
| `gop_bye` | 7 | the Anselm at Liss: Gop at the rail, hands behind his back; Gray (20) in a frock coat, with a bundle; Gop turns to him | `gop_bye:turns` |
| `secret` | 8 | the Secret at Liss, the sails furled: Gray at the wheel lays his hand on the rim, looks ahead | `secret:hand-on-wheel` |
| `sew` | 12 | night in port, the lanterns: the crew sews the scarlet silk in the waist, on the hatch sit Zimmer and two musicians, the instruments on their knees; a cut to Gray at the rail; Panten comes up to him | `sew:panten` |
| `rail` | 8 | before dawn, at sea: Gray at the rail turns his eyes to where Kaperna is | `rail:looks` |
| `raise` | 15 | dawn (the hour — `sun`): the scarlet sails go up one after another and fill (12 s); Gray at the wheel, Letika at the starboard rail; the camera raises its eyes after them; the musicians already on the forecastle | `raise:going-up`, `raise:full` |
| `helm` (after `raise`) | 2 | Gray at the wheel looks at Kaperna; Letika at the starboard rail (as in `raise`); on the forecastle the musicians stand, swaying (far silhouettes) — under “Course”. Opened by itself: `heading` 0, the place — `shore` = `leg`, the hour — `sun` | `helm:ready` |
| `arrive` | 12 | Kaperna near (480 m — the cut carries both `ship_d` and `ship_at`, the script does not put the ship anew; the hour — `sun`): Gray and Letika at the rail; the sails luff (`luff` 0.7), the ship comes to 450 m and heaves to; a cut over the side, from the water (`camera_on: "cam_boat"`): the starboard side, the skiff goes from under the gunwale onto the water (`skiff_down` 0 → 1), the two at the rail above it | `arrive:shore`, `arrive:boat` |
| `steamer` | 12 | the epilogue, dawn: the Secret overtakes the steamer: the two at the rail from the poop, the steamer ahead; a cut to Assol from over the side, larger (`camera_on: "cam_rail"`; the ring on her — by `ring`, `ring_kind`): she waves, Gray beside her; a cut to the steamer (`camera_on: "cam_steamer"`): from behind, Longren at the rail by the stern with his pipe, the scarlet sails behind him; he raises his hand | `steamer:waved`, `steamer:longren` |
| `night_end` | 18 | the epilogue, night under the scarlet sails, the lanterns: Zimmer by the mainmast sways, the violin lowered; a cut to Assol (the ring on her — by `ring`, `ring_kind`) and Gray at the rail — facing us, from over the side (`camera_on: "cam_rail"`). `wine` 1 — the cask amid the poop and two sailors behind it, seen between the two at the rail; 0 — no cask, four sailors sit on the hatch and sing (they sit at rest, `seated`: the song is carried by the game's sound) — the beat opens on them from the poop's edge, Zimmer stands behind them | `night_end:look` |

The showcase (`showcase.js`) — all thirteen in order (`lib.SHOWCASE`), each shorter than 30 s.

For the game: the stages of the way to Kaperna are cuts (`shore`; in chapter V — `leg` on opening on `helm`), between them the ship sails by herself
(4 m/s: 6 km — 25 minutes); where she is — `ship_x`, `ship_d` (Kaperna at `ship_d` 6000). Pressed: `grey#letter` (after
`letter`).

From outside, the ship in this scene is only the starboard side (`side_starboard`, `side_bow_starboard`: it is seen from the steamer and from
the skiff); there is no port side.

## The generator

`node tools/paluba.js` (from the world's root) writes the whole `scene.json` and what repeats or belongs to the world: the files
of the square sails' halves, the sailcloth shader for each sail (`tools/korabl-cloth.wgsl` + `korabli.clothUniforms`), the sky's shader and
uniforms (`tools/nebo-sky.wgsl`, `nebo.UNIFORMS`). After a change to the world's shaders or the module — run it again.
`scene.json` is not to be edited by hand.

## What must not be broken

- The paintings read only `ship`. Nothing may be painted by `sails`, `sails_set`, `luff`, `hour`, `lanterns`, `silk`, `helm`.
- A layer that rides (the yards, the gaff) has a `box` for its whole way.
- The sails' numbers are in two places: `lib.js` (`SQUARE`, `GAFF`, `SPANKER`) and `tools/paluba.js` (`SAILS`, the calls of `cloth`):
  change them together.
- A cut with another hour, other sails or another place — through `lib.js` `AT_SEA` / `IN_PORT`.
- The play's keys (`leg`, `sun`, `wine`, `ring`, `ring_kind`) are set by no `from`; `climb`, `hand_l`, `hand_r`, `slip`, `skiff_down` are read
  only by `animate`.
- Every `from` closes the insert (`CAM0`: `ropes: 0`) and brings the camera back onto the ship (`camera_on: null`).
- The operator takes the height himself: up to “full length” (`camera_shot` ≤ 0.8) — the eyes above what the camera rides on, nearer — the height
  of the target's point. So a camera off the decks is set by a place (`cam_…`: its height is the deck under the operator), not by `camera_h`.
- Gray at the wheel stands 32 cm from it (`AT_WHEEL`), his hands on `wheel#rim_l`, `rim_r` at shoulder height: further off the hand
  does not reach and hangs straight beside the rim.

## Further

A ladder from the poop to the waist (now the people in the waist are placed by a cut), an anchor, the port side from outside. Close-ups of faces are not the engine's
people.

## Contract for the check

```json
{
  "beats": {
    "anselm": { "after": [], "tells": ["anselm:looks-up"], "seconds": 8 },
    "shrouds": { "after": ["anselm"], "tells": ["shrouds:close"], "seconds": 5 },
    "top": { "after": ["shrouds"], "tells": ["top:up"], "seconds": 7 },
    "letter": { "after": [], "tells": ["letter:reading"], "seconds": 3 },
    "gop_bye": { "after": [], "tells": ["gop_bye:turns"], "seconds": 7 },
    "secret": { "after": [], "tells": ["secret:hand-on-wheel"], "seconds": 8 },
    "sew": { "after": [], "tells": ["sew:panten"], "seconds": 12 },
    "rail": { "after": [], "tells": ["rail:looks"], "seconds": 8 },
    "raise": { "after": [], "tells": ["raise:going-up", "raise:full"], "seconds": 15 },
    "helm": { "after": ["raise"], "tells": ["helm:ready"], "seconds": 2 },
    "arrive": { "after": [], "tells": ["arrive:shore", "arrive:boat"], "seconds": 12 },
    "steamer": { "after": [], "tells": ["steamer:waved", "steamer:longren"], "seconds": 12 },
    "night_end": { "after": [], "tells": ["night_end:look"], "seconds": 18 }
  },
  "points": ["gop", "grey", "panten", "ropes#left", "ropes#right"],
  "offers": ["grey#letter"],
  "party": { "leg": null, "sun": 0.26, "wine": 0, "ring": "none", "ring_kind": "own" }
}
```
