# The jungle (`dzhungli`) — on engine 3

The chapter «The jungle» (rpg docs/vokrug-sveta/scenes.md). An Indian forest, a panorama along the trail. The people are
the engine's (the world's cast `cast`), the film is in beats (`beats`: lib.js `FILM`), the colours — `svet`; the
elephant Kiouni is there (below), his beats are not yet. Dark silhouettes of thicket in front,
the lit forest beyond the trail, the far canopy in haze; on the right the forest opens out to the river. The morning
saffron, the day green, the night light, with the moon, fireflies and torches.

## The frame

Camera `panorama` (`span` [75, 80]), horizon 0.42. The viewer stands in the thicket before the trail. The plan —
`lib.plan`, the shapes — `lib.trail(across)` (the trail winds over ~10 m), `lib.stream(d)` (a stream from the viewer's
feet slantwise under the footbridge), `lib.bank(across)` (the river bank). By `across`, left to right: the end of the
rails (−65…−28: the train `train` on its embankment, the front of the engine `train_front`, the shed `shed`, the sign
`sign`, the hut `hut`); the forest (the opening frame, about 0: the trail, the stream, the footbridge `bridge`); the
clearing by the river (22…85: the pyre `pyre` 40 / 14 m, the pagoda 56 / 22 m under a fig tree, palms over the water,
the river `river`). The frame with the pyre — `camera_x` ≈ 42.

The ground is one `relief` (`lib.ground`): the embankment, the stream's bed, the bank down to the river; the plane
`ground` covers it (`drape`). The water — mirror planes (`stream`, `river`), their shape where the ground is below the
water level (`lib.shoreline` by the relief). The buildings — volumes of cards and planes on unseen sites
(`pagoda_site`, `hut_site`, `shed_site`), as in v1.

## Plants — painted once, the wind moves them

Where each plant stands `lib` chooses once (`TREES`, `PALMS`, `BAMBOO`, `LOW`, `SHORE`, `NEAR_TRUNKS`, `NEAR_LOW`,
`LIANAS`); the elements paint their share:
- `forest` (anchor 12 m) — the trees: the trunks of the tall trees, the fig's trunk, branches and aerial roots — parts
  (`e.part`) at their own depth, still; point `forest#trail`;
- `canopy` — the tall trees' crowns with lianas and the fig's dome: each a layer (`e.layer`) with `depth` to its own
  tree, its foot on the ground there (`lib.plantLayer`: offset by `lib.ground`), bending in the wind about the fork
  (`wind` 0.1, gusts); `translucent` — the sun through the leaves is green, in their shade too; the crowns' shadows on
  the ground move with the wind;
- `undergrowth` — the palms of the undergrowth, bamboo by the trail, ferns and broad leaves, palms on the bank: layers,
  bending from the foot, each on its own;
- `near` (anchor 4 m) — big dark trunks before the trail (parts); `near_leaves` — ferns, leaves at the feet and lianas
  from above (layers; the lianas swing from the top).
The scene's wind — `light.wind`. Layers with `depth` go not through the depth prepass but in order of depth — the
engine's way.

## Air and light

- The sky (`sky`): the night is its painting; the day, dawn, the stars, the moon, the sun — layers; the shader
  (`sky.wgsl`) mixes them by `day`/`dawn` (uniforms from the animate), the stars twinkle each on its own; the animate
  leads the sun from the river at dawn up by day (`sky#sun` — the light `sun` shines from there), the moon —
  `sky#moon`. The glows of the sun and the moon — their `e.light`, put out by `e.glow`.
- The light: the base is the night, `looks.day`, `looks.dawn` over it; by day the moon goes out. `shafts` — the sun's
  rays through the crowns (and the moon's at night), `hazeGlow` — the halos of the torches and the pyre. The pyre — the
  light `pyre` (`pyre#fire`, `on: pyre_fire`), the torches — a light at the flame `<id>#flame` (`torch_pb1…4`,
  `torch_pr1/2`, `on: torches`), the lamps of the engine and the pagoda — their `e.light`.
- The pyre (`pyre`): its logs — trunks laid lengthwise and the ends of the crosswise ones, all different (thickness,
  colour, joints), brushwood between the rows. The flames — a man's height: `pyre_flames` (a row behind those lying on
  the pyre: tongues up to 2–2.8 m, above the head of one standing) and `pyre_flames_near` (in front of them, up to the
  thighs) — whoever stands on the pyre stands in the fire. Each fire of the row — a body of flame (a broad soft patch),
  tongues out of it (five broad red ones, three narrow hot ones, the tip curled) and two little tongues torn off; all
  of it layers painted once (`lib.FLAMES`, `flamePaint`). `flameMotion` (animate): the height — a slow breath and a
  fast tremble by noise, a lean towards the river, the little tongues fly up over the fire in turn and go out; the size
  — by `pyre_fire`; the elements `glows`. The pyre's light comes from the middle of the flame (`pyre#fire`, 2.2 / 16 m),
  the smoke rises above the tongues (`pyre#smoke`), the sparks — the whole height of the fire.
- Particles: the pyre's sparks (`pyre_embers`, `amount: pyre_fire`), its smoke (`smoke`, `amount: smoke`, casts a
  shadow, the wind carries it to the river), the torches' flames (`fire_<id>`), the engine's steam (`steam` from
  `train#chimney`), fireflies (`fireflies`, `amount: fireflies`), motes in the rays (`motes`), falling leaves
  (`leaf_fall`).
- Mist: `mist_stream` (over the stream and the litter) and `mist_river` — two layers each, drifting towards each other
  (`drift`); their animate makes it thick at dawn, noticeable at night, thin by day.
- The heart of the pyre glows between the logs: the layer `heat`, its shader (`pyre.wgsl`) — by `pyre_fire`.

The paintings read no moving keys: `sign` reads only `station` (changed on a cut).

## Keys

| Key | What |
| --- | --- |
| `day` | 0…1: 0 — night (the moon, stars, light), 1 — day |
| `dawn` | 0…1: dawn — saffron light, a low sun over the river |
| `station` | `kholby` · `allahabad` — the words on the sign |
| `procession` | where the column goes along the trail (0 — not come, 0.476 — stands before the thicket, 1 — gone by). **Was:** the key moved the column by the seconds (the people walked at its speed). **Now:** the value set — the column walks there at its own pace (the cast's gaits); 0 — it is not there |
| `torches` | 0…1: whether the torches burn (the priests' at dawn too) |
| `pyre_fire` | 0…1: the pyre's flame and as much of its light |
| `smoke` | 0…1: the pyre's smoke |
| `heads` | the crowd at the pyre: 0 — face down, 1 — looking (each a little after its neighbour) |
| `walk` | how far the «rajah» carries the widow from the pyre to the trees (0…1, the way `WAY`). **Was:** the key led him by the seconds. **Now:** the value set — he walks there at his own pace (`carry_walk`) |
| `fireflies` | fireflies; the scene sets it itself by `day` |
| `beat` | a beat (`beats`): drums, procession, pyre, rise, walk; at its end — `beat:<name>`. It was `film` — the montage; the montage is now the showcase (`showcase.js`) |

The people — `person` (the cast `cast`): the keys `<id>_a`, `_d`, `_do`, `_turn`, `_look`, `_reach`, `_with`, `_wear`,
`_gait`, `_on`, `_here`. The footbridge (`bridge`), the top of the pyre (`pyre_top`) and its steps (`pyre_steps`) —
`walk` planes.

## Beats (lib.js `FILM`)

| Beat | after | What |
| --- | --- | --- |
| `drums` | — | Dusk: the four walk along the trail at their own pace; the guide turns at the drums; all go off into the thicket and hide (`crouch_hide`, `kneel_up`) |
| `procession` | — | Night (a cut closer, over the shoulders of those hiding): the column comes along the trail from the left (`procession` → 0.476), over the footbridge, and stops; those hiding look at the first torch-bearer as he comes into the frame, at Aouda — as she does |
| `pyre` | — | Dawn in the clearing: the priests come up and set it alight, the pyre flares up, the camera comes closer; Fogg strains forward, Cromarty holds him back |
| `rise` | pyre | The smoke thicker, the camera closer; a cut (made ready ahead) to a low shot: the «rajah» stands on the pyre with Aouda in his arms; the crowd face down |
| `walk` | rise | The camera draws back; he comes down the steps and walks to the trees (`walk` → 1); once he is down, the crowd raises its heads, the smoke thins; Fogg steps back |

Each beat ≤ 30 s, waits for what happens (got there, came into the frame), time only in the pauses. The showcase
(`showcase.js`): its own beat `day` (day, the camera goes along the trail from the end of the rails into the forest),
then all the beats in order.

The scene tells the game the beats' moments (`scene.tell`), besides `beat:<name>`: `drums:heard` (the guide turned),
`drums:hidden`, `procession:torches` (the first torch-bearer in the frame), `procession:widow` (the widow in the frame),
`procession:stopped`, `pyre:kindled` (the priests put their torches to it), `rise:risen` (the cut: he stands on the
pyre), `walk:down` (came down from the pyre), `walk:away` (at the trees).

Those hiding: the cast's `crouch_hide` — a real squat on the heels (the motion made anew).

## Points

`train#train`, `train#chimney`, `shed#kiouni_shed`, `sign#station`, `hut#hut`, `forest#trail`,
`procession#procession` (over the head of the first torch-bearer — animate), `pyre#pyre`, `pyre#flames`, `pyre#smoke`,
`pagoda#pagoda`, `sky#moon`, `sky#sun`.

## The light after the tone curve was changed (2026-10-11)

The dark became lighter and greyer — the haze and the halos, chosen for the old curve, drew a pinkish-grey veil over
the frame. By sheets against v1 (the air cleaner, the green and the pyre's gold seen): `haze` 0.25 → 0.14,
`hazeGlow` 0.9 → 0.25, `shafts` 0.4 → 0.25, `saturation` 0.85 → 1; the look `day`: `haze` 0.32 → 0.16, `shafts`
0.7 → 0.4; `dawn`: `haze` 0.3 → 0.18, `shafts` 1.1 → 0.5; the pyre `pyre` `strength` 2.2 → 1.6 (it does not bleach the
frame). The mist over the stream and the river — painted layers (`mist_*`); the light does not change them.

## Kiouni — where the work stands (2026-10-15, stopped at the owner's request)

**Done and checked with one sheet on the GPU (no errors):** the elephant — the elements `kiouni` (an anchor: place
`kiouni_x`, `kiouni_d`, `kiouni_facing`, `kiouni_el`, `kiouni_tilt`; it paints nothing, its animate sets the points
`kiouni#head` (the eye), `kiouni#trunk` (the tip of the trunk), `kiouni#lift` (the bend of the trunk, to lift a
man)), the sides `kiouni_l` / `kiouni_r` (cards at the sides, `lib.kiouniPaint`: the body with a red caparison, the
legs in two parts each, the head with a painted forehead and an eye, the ear, the trunk of five parts, the tail; the
near side shows all, the far side only its own two legs), the howdah `gauda_l` / `gauda_r` (its sides on his back).
The motion — `lib.kiouniMove` (the sides' animate): the legs step by the way gone (no sliding; a longer step at a run
and with `pace`), fold when he kneels; the trunk goes smoothly to the pose `trunk` (`rest`, `up`, `sugar`, `lift`;
folds with `kneel`), the ears flap and fan out (`ears`, `balk`, `kiouni_blow`), the head nods, blinks. The seats —
`lib.KIOUNI_SEATS` (`guide` on the neck, `front`, `mid`, `back` in the howdah; points in his frame: `<id>_on:
lib.seat('front')`, they sit `sit_calm`, `_turn` 180 — facing the way he goes). Checked: standing, kneeling, the trunk
up and to the howdah, walking along the trail, four sitting in the howdah.

**Not done:**
- The script: `kneel`/`balk` → `kiouni_el`/`kiouni_tilt` (the sheet checked it by setting them by hand: el =
  −1.15·kneel, tilt ≈ −9·sin(π·kneel) + 6·balk); `trumpet` → `kiouni_blow` (a rise of 0.4 s, 1.3 s, a fall of 0.9 s);
  `sugar`, `goad`, `ride`, `pace`, `charge`, `scatter`, `grab`, `guide_seen`, `owner_turn`, `offer` — the scene hears
  none of them yet. `kiouni_here` is read only by the animate (transparency); the anchor is not taken away.
- Not one new beat: `rails_end`, `haggle`, `mount`, `ride`, `drums` with Kiouni, `night_wall`, `flee`, `charge`,
  `aouda_fear`, `allahabad`, `wake`, `gift`, `sold`. The old beats (drums…walk) — as they were, the elephant takes no
  part in them.
- The people `owner`, `trader`, `conductor` not added (not in the cast when the work stopped); the roll of banknotes
  (`offer`) — none.
- The seat on the rump (`rump`) for a fifth (with Aouda) not added.
- Small things of the look, by the sheet: the ear nearly merges with the head (a dark outline is needed), the eye could
  be bigger, the caparison is a little large.

**By default** Kiouni stands under the shed (−34, 13.4), facing right; he is not seen in the frames of the old beats.

**Planned (not code):** `ride` — the camera `camera_on: 'kiouni'` from the side (camera_x ≈ −5.6, camera_yaw 90,
camera_h ≈ 1), the way `ride` 0…1 = x −22 → 18 along the trail (d = trail + 0.3; at the stream a detour behind the
footbridge, d = trail + 2.6), day → dusk by `ride`; `charge` — out of the thicket right of the column slantwise onto
the trail and left through it; `flee`, `allahabad` — mounting and getting down on a cut (people cannot climb up).
