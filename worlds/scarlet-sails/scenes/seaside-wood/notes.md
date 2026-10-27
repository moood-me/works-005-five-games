# The Wood by the Sea (engine 2)

A light wood by Kaperna. A stream runs over stones from pool to pool to the sea and comes out onto the sand; to the right above the mouth — a cape:
from the wood the land rises in a gentle slope to its top and falls in a sheer cliff of pale stone into the bay and the sea; on
the top a glade with knee-high grass at the edge, the sea below. The world's language: a pearly palette, light, reflections, mist, much
air, clean forms. The wood is minimal: tall thin white birch trunks and a few pines, light crowns high above,
the sky through them. The only scarlet is the sails of the toy yacht (`ships.toy`). The people are the engine's people (the world's cast, the module `cast`),
the film in beats — `beats`, the sky and the hour — `sky`. The game's chapter I is by the stream and at its mouth, chapter III — on the cape's glade.

Moved over from the old engine (the world `pavel/alye-parusa`); what became what — at the end and in
docs/history/2026-10-11-alye-parusa-v2-les-u-morya.md (rpg).

## The space

Metres: X to the right, Z forward (east, to the sea), the height from the wood's floor at the start. The camera `walk` (the horizon 0.45): the viewer
stands in the wood on the stream's left bank and looks down the stream at the mouth and the sea; may walk forward up to 40 m, 4 m to the left and
6 m to the right (`area`).

`relief.js` — `lib.ground(across, distance)` (all of it in `lib.js`):

- the wood's floor goes down in steps together with the stream: 0, −0.7 and −1.55 m (ledges at Z 8–10, 18–20), rising a little to the left; at
  Z 26–32 it goes down to the sand; the sand goes under the water, the sea's shore about Z 40; the sea at −3 m;
- the stream (`COURSE`, `halfWidth`): comes out of the wood behind the viewer (Z −46), winds, wider in the pools, narrower at the rapids;
  three pools (`POOLS`: −0.35, −1.05, −1.9 m) and rapids between them (`FALLS`), the last — from the ledge onto the sand (Z 26.4–32);
  below it the water is the sea's already (−3 m): it comes up the bed onto the sand; the bed (`bed`) is below the water;
- the cape (`HEAD`, `headland`) — in the relief itself, in its own axes (as the unseen element `headland` on the
  top turns it): `a` along the edge (+ towards the start), `b` into the cape from the edge. The edge — `b` = `edge`: sheer from the cape's end in the sea to
  the end of the beach (`a` = `rise`); further towards the wood the edge becomes a steep wooded bank (`side`, `bank`°). The top is level,
  10 m (`TOP`) from `a` −9 to 9 (the glade); towards the sea it falls at 14° to the water, towards the wood — a gentle slope of 16° to the wood's floor.

The eye goes above the ground by itself (1.7 m over the relief where `camera_x`, `camera_z` put it); `camera_h` — on top of that.
**Before:** `camera_x/z` did not raise the eye by the relief, the height was given by `camera_h` (the glade — 10). **Now:** on the glade
`camera_h` is 0.

| Place | Camera | What is in the frame |
| --- | --- | --- |
| the stream | `camera_z` 3…6, `camera_x` −0.5 | the stream at the feet, the pools and the rapids down to the mouth, the cape on the right |
| where the yacht is let down | `camera_z` ~−19, `camera_x` 0 | the stream in the wood behind the viewer (Z −16.5): the first pool, birches |
| the mouth | `camera_z` ~28, `camera_x` −2 | the sand, the bay, the cape's cliff on the right and its reflection, the sea |
| the glade | `camera_z` ~34, `camera_x` 24 | knee-high grass to the edge, the fire by the cliff on the left, the sea below to the horizon |

## The elements

Everything is painted once, in the day's colours; no painting reads the keys that move. What stands one by one
(the crowns, the glade's grass, the undergrowth, the mist, the spray) is written into `scene.json` by the world's generator
`node tools/seaside-wood.js` — by the lists of `lib.js` (`TREES`, `GRASS`, `UNDER`, `MIST`, `SPRAY`); it also places the snags
(`SNAG_AT`) and the yacht (`toyAt`); after a change to the lists, their boxes or the path along the bank, run it again. The sky: `node tools/sky.js seaside-wood` (the world's shader and its uniforms).

| Element | What |
| --- | --- |
| `sky` | the world's sky (`sky`): the hour is led by its animate and shader; the sun rises over the sea ahead and goes off to the right, at night the moon low over the sea (`lib.SKY`) |
| `sea` | the sea to the horizon: a mirror (`rough` 0.45 — the paths of the sun and the moon, `ripple` 0.2); on it too the stream's light water, spread over the sand below the last rapids |
| `mist_0…6` | mist: banks at their own depth — among the trees, over the lower pools, over the bay and the sea (on the ground there or on the water); the layer drifts along the shore (`drift`), animate makes it as thick and high as `mist` says |
| `land` | the land — one plane `drape` over the relief (140 × 145 m, from Z −45): the wood's floor with patches of moss, moss and light pebbles along the stream, sand to the water; on the cape a meadow, towards the wood — the wood's floor, towards its end in the sea — bare stone (`lib.landPainting`) |
| `headland` | an unseen support on the cape's top: its `facing` — where the cliff faces; the cape's axes in `lib.js` are its own |
| `cliff_face` | the cliff — one card on the support right at the relief's edge: the top edge is the relief's height at the edge, the bottom under the water. Pale stone: blocks, cracks, layers and two ledges, streaks, a fringe of turf, a wet band at the water |
| `glade`, `cliff` | unseen points on the cape: the middle of the glade and the cliff's edge by the fire |
| `trees` | the wood's trunks — parts (`e.part`), each on the relief where it stands: birches and pines; shadows on the ground. A tree is one of a few shapes of its kind (`lib` `SHAPES`: 16 birches, 8 pines — the height and the painting's seed): trees of one shape paint the same in the same boxes, and the engine keeps such a painting once. **Before:** every tree was its own (298 heights and seeds) — the engine's virtual texture's page table (8.4 million entries; a birch's crown — about 33 thousand) overflowed, and some of the paintings (the land, the sky, the yacht) were not shown |
| `crown_<i>` | the crown of the tree `TREES[i]` — an element of its own at its foot: layers the wind bends (a birch's two sides apart, a pine's tiers together); the leaves are translucent (`translucent`), their shadow is lighter |
| `tuft_<i>` | the undergrowth at the start and along the stream — tufts of grass and ferns, bending from the foot |
| `pool_1…3` | the stream's pools — mirror planes at their own levels (`rough` 0.15, `ripple` 0.5: the water runs) |
| `fall`, `spray_<i>` | the rapids: the water's crest on the ledge (parts) and the white water over it — particles |
| `stones` | stones in the stream and along its banks, boulders on the ledges — only their tops above the water; the point `stream` |
| `snag`, `snag2` | two snags across Assol's path along the left bank — fallen birches (`lib.snag`), at 0.4 and 0.7 of the path (Z 2.6 and 16.9: `lib.SNAGS`, `SNAG_AT`); the point `snag` at each. **Before:** one `snag` at Z 17 — now `snag2` is there, and `snag` is the first on the path |
| `toy` | Assol's yacht on the stream: the layer `toy` (`ships.toy`; animate shows it while `toy_water` = 1, and rocks it — harder when it is stuck) and the layer `reeds` (`ships.reeds`: reeds before it, seen at `reeds` = 1). It stands where `toy` says (the script sets `toy_a/d/e` — `lib.toyAt`); the point `toy` |
| `reeds` | reeds by the right bank above the last rapids — in tufts, the wind stirs them |
| `bushes` | bushes at the wood's edge to the left of the mouth — each bush a layer with wind |
| `drift` | a bleached log on the sand by the mouth; the point `mouth` |
| `grass_<i>` | the glade's grass (on `headland`, in its axes): cards of 2.5 m of knee-high panicles, in tufts as layers with wind |
| `fire_pit`, `fire`, `flame`, `embers` | Gray's fire by the cliff's edge: a ring of stones and branches (while `fire` > 0), the point and the glow `fire` (the scene's light `fire_light`), the flames and the sparks — particles by `fire` |
| `assol`, `grey`, `letika`, `egl` | the engine's people: Assol (17; in chapter I — a girl: `assol_wear` = `cast.characters.assol_child`), Gray, Letika, Egle; without the film they are not there (`<id>_here` false) |

## Keys (described in `states`)

- `hour` 0…1 — as in the whole world; 0.5 by default. The sea ahead is the east: the sun rises over it, goes off to the right (the south) and
  behind; at night the moon low over the sea. `script.js` keeps by `hour`: `day`, `dawn`, `dusk`, `night` (the weights of `light.looks`;
  the light's base is the day), `sun_light`, `moon_light`, `sun_bearing`, `sun_height`, `moon_bearing`, `moon_height` (where
  the sources `sun`, `moon` shine from). A cut to another hour — together with them: `lib.hourKeys(hour)`.
- `mist` 0…1 — mist: the banks and the haze of the distance (the look `mist`); a misty dawn — `hour` 0.26, `mist` 0.75.
- `fire` 0…1 — the fire on the glade by the cliff's edge.
- `ring` — where the ring is: `none`, `grey` (in Gray's fingers), `finger` (on Assol's finger), `cord` (on a cord under her dress). Whoever
  has it has the cast's part (the script keeps `<id>_with`): `ring` or `ring_old` — by the play's key `ring_kind`.
- `ring_kind` — **the play's key** (`mother` · `own`; `own` by default): which ring. The game sets it on opening the
  scene, no `from` sets it; it is read by the `from` of the beats `ring_on`, `leave`, `wake`, `wake_hold`, `wear`, `hide` and
  by the script (`lib.ringPart`): `mother` — the part `ring`, `own` — `ring_old`.
- `ring_at` 0…1 — “The ring”: while `ring` = `grey`, Gray's hand with the ring on its way to her finger: from 0.4 the hand reaches for her hand
  (the scene tells `ring:reach`), 1 — the ring is on her (`ring` → `finger`, `ring:on`). `stir` 0…1 — she stirs in her sleep (from
  0.5 her head turns to him).
- “After the little ship” — all of it 0…1 along the stream: 0 — where the yacht was let down, 1 — the mouth (Assol's path along the left bank — `lib.BANK`):
  - `run` (the game) — how far she is to run: the script leads her along the path at a run (the gait `run`, at her own pace), no further than `run` and no
    further than the nearest snag she was not let past: before it (`lib.STOPS`, 0.8 m short of the snag) she stops from her run
    (`halt`; if the stop is already nearer than the run-up of `halt` itself, she just runs up to it and stops), the scene tells
    `chase:snag`. Let go and held again (`run` fell to `run_at` and grew again) — she runs
    on, across the snag. She sets off when there are at least a couple of steps ahead (`lib.NEAR`) or what is left to the snag
    or the end;
  - `run_at` (the scene, at once, every frame while she goes) — where she is now (by her Z: `lib.runAt`);
  - `jump` (the game: 1, after 0.3 s 0) — a press in time: if the stop before a snag is no more than `lib.WINDOW` (4 m) away
    or she is already standing at it, Assol runs across the snag without breaking her run, `lib.PAST` (1.5 m) beyond it, whatever
    `run` says. **There is no jump**: the model gave no such motion, we do not fake the body — the snag is low, she
    runs over it. Elsewhere on the path a press does nothing;
  - `toy` (the game) — where the yacht is: in the middle of the bed opposite the path's point, at the end — 3.2 m further, into the mouth's water; at
    the rapids it goes over the stones (there are no water mirrors there). The yacht stands exactly where the key says: the smoothness is of whoever
    moves it;
  - `reeds` (the game, 0/1) — the yacht is stuck: reed stems before it (the layer `reeds`), it stands and rocks.

  Internal: `toy_water` (the yacht on the water), `toy_out` (from the bank into the current — the beat `launch`), `toy_a/d/e`. The mechanics
  work while `toy_water` = 1 and Assol's gait is `run` (as the beat `chase` leaves it).
- `beat` — the film's beat; `as_a/as_d`, `gr_a/gr_d`, `le_a/le_d`, `eg_a/eg_d` — where the people are; `<id>_do`, `_turn`, `_look`,
  `_reach`, `_with`, `_wear`, `_on`, `_gait`, `_here` — the engine's people's; `camera_*` — the engine's.

Points for the game: `egl` (Egle's head — a choice after `egl_hold`), `assol#ring` (the ring on her hand — a choice after
`wake_hold`); there are also `toy#toy`, `stones#stream`, `snag#snag`, `snag2#snag`, `reeds#reeds`, `bushes#bushes`,
`drift#mouth` (where the stream comes out to the sea), `fire#fire`; `glade` and `cliff` — unseen elements on the top; the people have
the cast's points (`grey#ring`, `assol#hand_r`, `egl#yacht`…).

## The film (lib.js `film(scene)`, the module `beats`)

The game sets `beat` — the beat plays from its start; at its end the scene tells `beat:<name>`. Outside games — the showcase (`showcase.js`):
two beats of its own — `stream` (day, the camera goes down the stream to the mouth) and `hours` (at the mouth the day goes into sunset and night, on
the cliff the fire is lit), then the film's beats in the order of `lib.SHOWCASE`; after `chase` — a beat of its own, `chase_alone`:
the chase without the game (the yacht goes down the stream, Assol runs; she runs over the first snag with a press in time, before the second she stops
and runs on when she is led again; the yacht gets stuck in the reeds once). Each beat ≤ 30 s, people go at their own pace, time only in the pauses. `from` — the whole state: the scene can be
opened at any beat. The film is a function of the scene (`film(scene)`): `from` reads the play's key `ring_kind`.

| Beat | after | What | Moments (`scene.tell`) |
| --- | --- | --- | --- |
| `launch` | — | Chapter I, before noon (`hour` 0.4 — no earlier than the shop in Liss: the sun over the sea ahead to the right). By the stream in the wood Assol (8) with the yacht in her hands crouches by the water and lets it down (`crouch_put`; from there the yacht is the element `toy`); the current carries it to the middle; Assol gets up, looks at it. The shot from over her left shoulder | `launch:afloat` (the yacht on the water) |
| `chase` | launch | The camera behind her along the bank (the operator); she stands, looks at the yacht, the gait — a run. Then the game's “After the little ship” | `chase:ready`; in the game — `chase:snag` (she stopped before a snag) |
| `mouth` | — | The mouth, by a cut, the shot from the sea on the wood: in the shallow water stands a tall old man and, bent, turns the yacht about in his hands (`turn_toy`); Assol runs out from behind the bushes and stops at the water (`halt`); he raises his eyes to her | `mouth:seen` |
| `egl` | mouth | From over the girl's shoulder, from below: Egle, tall against the sea, the yacht in his right hand (`yacht_r`). He speaks; turns to the sea, side-on to her (310°, `lib` `SEAWARD`: the raised arm is seen at its full length, not hidden by his back) and slowly raises the hand with the yacht forward, towards the horizon (`tell_sea`: the right arm forward to the shoulder, held, lowered), the camera goes after the hand to the left onto the empty sea (the cliff leaves the frame); the hand comes down, he turns to her | `egl:tale`, `egl:sail` (turns to the sea), `egl:boat` (looks at her again) |
| `assol_close` | egl | Close, from behind and below: the back of her head tilted up to him, her hands pressed to her breast (`reach` to `assol#chest`), above her Egle against the sea | — |
| `egl_hold` | egl, assol_close | A wide shot from the wood's side: both at the water, the sea behind them; Egle holds the yacht. Under a choice (the point `egl`); the camera still | `egl_hold:ready` |
| `egl_when` | egl_hold | “When?”: Egle turns away to the sea and looks at the horizon, she too; the camera turns there too — light on the water | `egl_when:sea` (he turned away) |
| `egl_how` | egl_hold | “How will I know him?”: the shot from the side, near both; Egle comes up and goes down on one knee before her (`kneel_down`) — they are of a height | `egl_how:down` |
| `egl_goes` | egl_when, egl_how | He gets up from his knee (`kneel_rise`), else comes up to her; a wide shot; he holds out the yacht in both hands (`give`), she takes it and presses it to her breast; he goes off along the water's edge to the cape, she runs off into the wood | `egl_goes:given`, `egl_goes:gone` |
| `fire` | — | Night: a fire by the cliff's edge; Gray and Letika sit on the edge with fishing rods, below the sea under the moon; Letika turns to Gray, Gray to him; both look at the bay again | `fire:letika` (he turned — the line), `fire:sea` |
| `dawn_walk` | — | A misty dawn: Gray walks carefully over the glade (`careful`), the camera behind him; he notices her, stops over her | `dawn_walk:seen`, `dawn_walk:found` |
| `sleeping` | dawn_walk | Close, over the grass, from the glade's side towards the cliff's edge and the bay: she is all in the grass — her hair, her shoulder, her hands; he is a dark figure over her. **Before:** low in the grass from the sea's side (the eye at 0.75 m, the knee-high grass hid her, she was seen from the feet and small) — now the eye at 1.1 m, to the side of her, 1.8 m off | — |
| `ring` | dawn_walk, sleeping | The camera from her head: he carefully kneels beside her, the ring in his fingers (`ring` = `grey`; the part by `ring_kind`), looks at her hand. Then the game's “The ring” (`ring_at`, `stir`) or `ring_on` | `ring:kneeling` |
| `ring_on` | ring | The same without the game: `ring_at` → 1 over 4 s | `ring:reach`, `ring:on` |
| `leave` | ring, ring_on | He gets up, walks away over the glade (the camera behind him), looks back once; a cut — she sleeps with the ring, he goes off into the mist beyond her | `leave:back`, `leave:gone` |
| `wake` | — | Morning: the glade, she in the grass; she sits up (the shot before her), raises her hand to her face, looks: a ring (a shot close by) | `wake:up`, `wake:ring` |
| `wake_hold` | wake | She lowers her hand beside her (the hand with the ring in the frame: `reach` to `lib` `RING_REST`), turns to the sea and sits, looking (the shot from behind her, she whole in the frame, the sea before her). Under a choice (the point `assol#ring`) | `wake_hold:sea` |
| `wear` | wake, wake_hold | She presses the ring with her other hand and gets up, looks at the sea (the shot before her) | `wear:up` |
| `hide` | wake, wake_hold | She gets up, takes the ring off, hangs it on a cord under her dress (close by: the hands at the breast); `ring` → `cord` | `hide:hidden` |

No fades of the scene's own: night → dawn → morning are cuts (the black between, if any, is the game's). A change of shot is a cut made ready ahead
(`lib` `cutTo`); a camera that has been set turns to another shot — `lib` `pan` (it gives its moves; to wait for them — `s.all(pan(…))`).
The shots are `lib.SHOTS`: those that look forward (east) are filmed by the operator (`camera_target`, the size by a person's height);
those that look the other way (at the wood, along the cliff) are set by keys (`camera_x/z/h/yaw/pitch`) — the operator
of the camera `walk` looks only forward.

The places are in `lib.js`: the cliff's edge where they sit (`GREY_EDGE`, `LETIKA_EDGE`: `b` = −7.75, the seat is the ground itself at the edge),
the sleeping girl on the glade (`SLEEP`), where he stands over her (`OVER_HER`), where he kneels (`KNEEL`). The points of a gaze and a hand —
`[across, distance, height above the ground there]` (`lib` `point` converts from the height above the wood's floor).

Chapter I's places are in `lib.js` too. Assol's path (`BANK`): the left bank 2 m from the stream's middle, from Z −16.5 (in the wood behind
the viewer) to Z 31 (the top of the way down to the sand). Its length is 48 m: `RUN_SECONDS` 24 s of her run (`RUN_PACE` 2.0 m/s —
the cast's run of 2.8 m/s on the legs of a girl of height 0.72; **not measured in the scene**: if the engine gives another pace, correct
`RUN_PACE` and run the generator — the path's start and the snags will fall into place by themselves). Where the yacht is let down — `LAUNCH`, `PUT` (the water's
edge opposite the path's start). The mouth: Egle in the shallow water (`EGL_AT`), Assol at the edge (`HALT`), from behind the bushes — `BEHIND`
(from the path's end in `mouth` she is moved by a cut 5 m to the left, behind the bushes), a step before her — `BEFORE_HER`.

What there is not: at the rapids there is no water mirror under the yacht.

## Light

The light's base is a pearly day (`ambient`, diffuse light, a soft sun); `looks`: `dawn` (a warm haze, the sun's rays in
the mist — `shafts`), `dusk` (lilac), `night` (blue), `mist` (the haze of the distance). The sun and the moon are far sources
(`from` [bearing, height] by the hour's keys), the fire — `fire_light` (`of: fire`, `reach` 14 m, flickering), its glow in
the air — `hazeGlow`. The relief's slopes and the cliff are lit by their slope; the trees and the crowns cast shadows on the ground.

## What became what (v1 → engine 2)

- The sky by `hour` in a painting → the world's sky `sky` (painted once, animate and a shader).
- The wood — parts of one element, still → trunks as parts, the crowns elements of their own with layers in the wind. Not layers with
  `depth` in one element: such layers (and the whole wood) turn round the element's anchor when the film's camera looks
  aside (`camera_yaw`), and the film on the glade looks both at the wood and along the cliff.
- The glade's grass, the undergrowth — parts → elements of their own, tufts as layers with wind. The reeds (they swayed by `e.t`), the bushes — layers with wind.
- The mist — parts that drifted by `e.t` and were painted anew by `mist` → elements of their own: a layer with `drift`, the thickness and the height —
  animate. The banks over the sea lie on the water (in v1 they stood on the bottom, under the water, and were not seen).
- The rapids — spray in a painting by `e.t` → the crest as parts, the white water — particles.
- The fire — flames in a painting by `e.t` → the particles `fire`, `embers`; the fire pit — a layer (animate hides it with no fire).
- The stones: in v1 the element stood 2 m to the right of its own parts (the stones lay on the right bank) — now in the stream and along its banks,
  as meant; the point `stream` — at the near bank. The rapids' crests are on their ledges (they were shifted by 0.4 m).
- The mouth — a separate mirror 5 cm above the sea → the sea's water (the engine keeps four mirrors in the frame: the sea and three pools).
- The land, the stream and the wood go on back behind the start (to Z −45): from the glade, looking at the wood, there is no more edge of the land behind the trees.
- The film — lines by seconds (`film`) → the director's beats (`beats`); `ring` split into `ring` and `ring_on`; `leave`
  ends on the shot of the sleeping girl; `beat` by default `null` (the montage — the showcase).

## Contract for the check

```json
{
  "beats": {
    "launch": {"after": [], "tells": ["launch:afloat"], "seconds": 7},
    "chase": {"after": ["launch"], "tells": ["chase:ready", "chase:snag"], "seconds": 2},
    "mouth": {"after": [], "tells": ["mouth:seen"], "seconds": 8},
    "egl": {"after": ["mouth"], "tells": ["egl:tale", "egl:sail", "egl:boat"], "seconds": 25},
    "assol_close": {"after": ["egl"], "tells": [], "seconds": 5},
    "egl_hold": {"after": ["egl", "assol_close"], "tells": ["egl_hold:ready"], "seconds": 3},
    "egl_when": {"after": ["egl_hold"], "tells": ["egl_when:sea"], "seconds": 7},
    "egl_how": {"after": ["egl_hold"], "tells": ["egl_how:down"], "seconds": 7},
    "egl_goes": {"after": ["egl_when", "egl_how"], "tells": ["egl_goes:given", "egl_goes:gone"], "seconds": 11},
    "fire": {"after": [], "tells": ["fire:letika", "fire:sea"], "seconds": 10},
    "dawn_walk": {"after": [], "tells": ["dawn_walk:seen", "dawn_walk:found"], "seconds": 10},
    "sleeping": {"after": ["dawn_walk"], "tells": [], "seconds": 6},
    "ring": {"after": ["dawn_walk", "sleeping"], "tells": ["ring:kneeling", "ring:reach", "ring:on"], "seconds": 5},
    "ring_on": {"after": ["ring"], "tells": ["ring:reach", "ring:on"], "seconds": 5.5},
    "leave": {"after": ["ring", "ring_on"], "tells": ["leave:back", "leave:gone"], "seconds": 10},
    "wake": {"after": [], "tells": ["wake:up", "wake:ring"], "seconds": 10},
    "wake_hold": {"after": ["wake"], "tells": ["wake_hold:sea"], "seconds": 5},
    "wear": {"after": ["wake", "wake_hold"], "tells": ["wear:up"], "seconds": 6},
    "hide": {"after": ["wake", "wake_hold"], "tells": ["hide:hidden"], "seconds": 8}
  },
  "points": ["assol", "egl", "letika", "assol#ring", "toy#toy", "snag#snag", "snag2#snag", "grey#ring"],
  "offers": ["egl", "assol#ring"],
  "party": {"ring_kind": "own"},
  "snags": [0.4, 0.7]
}
```
