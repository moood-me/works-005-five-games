# The jungle (`jungle`) — on engine 3

Chapter I of the game (rpg docs/vokrug-sveta/scenes.md): the end of the rails, the elephant Kiouni bought and ridden,
the drums, the procession, the suttee — at night by the pagoda or now on the road —, Allahabad. An Indian forest, a
panorama along the trail. The people are the engine's (the world's cast `cast`), the film is in beats (`beats`:
lib.js `film(scene)`), the colours — `light`; the elephant Kiouni is the scene's own (below). Dark silhouettes of thicket in front,
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

## Kiouni

An element of the scene (people do not move as he does), built on the unseen anchor `kiouni_site` (its place —
`kiouni_x`, `kiouni_d`, `kiouni_facing`, `kiouni_el`, `kiouni_tilt` — led by the scene): two flanks seen from the side
(`kiouni_l`, `kiouni_r`: one is near, whichever way he faces, and shows all of him; the far one only its two legs
between the near ones — `lib.kiouniPaint`), the howdah's rails (`howdah_l`, `howdah_r`) on his back, and `kiouni` — a
card in his middle turned as the left flank, painting only the girth under his belly: its animate marks his points
`kiouni#head` (his face below the eye, toward the trunk's root — clear of the guide's hands for «The elephant»; his own point is the eye), `kiouni#trunk` (the tip), `kiouni#lift` (the curl that lifts a man). (They were
the anchor's first: an anchor that paints nothing is not there to be seen, its animate does not run — no points.)
His motion — `lib.kiouniMove` (the flanks' animate): the legs step by the way gone (no sliding; a longer step at a run
and with `pace`), fold as he kneels; the trunk eases to its pose (`trunk`: rest, up, sugar, lift; folded as he kneels),
the ears flap and fan (`ears`, `balk`, `kiouni_blow`), the head nods, lifts as he trumpets, blinks. His look: the ear's
rim dark (it stands off the head), the eye big enough to read across the trail, the caparison over his back only.

The seats — `lib.KIOUNI_SEATS`, points of his frame (`seat(name)` = `{on: 'kiouni_site', at}`): `guide` on the neck,
`front`, `mid`, `back` in the howdah, `rump` behind it; those sat there `_turn` 180 — his way (0 — back, 90/270 — out
to a side). Getting down: their place set on the ground by his near flank, `_on` null and `rise_chair` at once — they
go down from the seat as the motion rises. Getting up is a cut (people cannot climb). He walks by `lib.kiouniGo` (a
path of his place and his turn, m/s), kneels by `kneel` (the script keeps `kiouni_el` = −1.15·kneel, `kiouni_tilt` =
−9·sin(π·kneel) + 6·balk). Passepartout lifted on the trunk (`gift`) stands `on` `kiouni#lift`.

`camera_target` on a person sat on him frames them where they ride (the engine, 2026-10-22: the operator stands as
high as what carries them). `wake` — Aouda waking in the howdah — is such a shot (`AOUDA_CLOSE`, the operator on her,
1.2). Where it reads worse the camera still rides him beside his near side (`camera_on: 'kiouni_site'`): `aouda_fear`
(`howdahRide`; the operator on her as he runs stands behind the riders, her face behind Cromarty's) and the guide's face
in the torchlight in the dash (`guideRide`; the operator stands behind Fogg, the rail across the frame); the ride
(`RIDE`) rides him as a travelling shot. `march(0)` (`procession` 0: the column not come) leaves alone whoever of it
rides on him — the widow carried off in the howdah (MORNING had hidden her, and `wake` had no one to frame).

## Keys

| Key | What |
| --- | --- |
| `day` | 0…1: 0 — night (the moon, stars, light), 1 — day |
| `dawn` | 0…1: dawn — saffron light, a low sun over the river |
| `station` | `kholby` · `allahabad` — the words on the sign |
| `procession` | where the column goes along the trail (0 — not come, 0.476 — stands before the thicket, 1 — gone by); the value set — the column walks there at its own pace (the cast's gaits) |
| `torches` | 0…1: whether the torches burn |
| `pyre_fire` | 0…1: the pyre's flame and as much of its light |
| `smoke` | 0…1: the pyre's smoke |
| `heads` | the crowd at the pyre: 0 — face down, 1 — looking (each a little after its neighbour) |
| `walk` | how far the «rajah» carries the widow from the pyre to the trees (0…1); the value set — he walks there at his own pace (`carry_walk`) |
| `fireflies` | the scene sets it itself by `day` |
| `kneel`, `balk`, `ears`, `trunk`, `trumpet` (a rise to 1), `pace`, `kiouni_here` | Kiouni (above); `kiouni_blow`, `kiouni_el`, `kiouni_tilt`, `kiouni_x`, `kiouni_d`, `kiouni_facing` — led by the scene |
| `owner_back` | «The bargain»: 0 — the owner faces Fogg, 1 — he turns his back, arms folded (`haggle:turned` when turned). Not `owner_turn`: that is the person `owner`'s own turn (degrees) |
| `offer` | «The bargain»: the roll of banknotes in Fogg's hand — how thick (£1000 … £2000); `banknotes` 1 — he holds it out |
| `ride` | «The elephant»: Kiouni along the trail, 40 m from the end of the rails into the forest (through the stream: he wades); the day goes to dusk with it (`day` 1 → 0.35, `dawn` → 0.5). The camera rides him from the side |
| `goad` | 1 — the guide lifts the goad over his head |
| `sugar` | a rise to 1 — Passepartout leans out with a lump of sugar, the trunk comes back for it (~2 s) |
| `charge` | «The dash»: Kiouni out of the thicket — 0.5 at the widow, 1 through the column and away into the dark (past the first torch-bearer) |
| `kiouni_lane`, `litter_lane` | «The dash»: −1…1 — where along the trail Kiouni heads for; where the widow and her two priests have shied to (1.6 m a side). There is no palanquin: she walks led by the priests, as in Verne and in the procession |
| `scatter` | «The dash»: the torch-bearers and drummers run off with their torches, each past its share (`lib.SCATTER`); the first torch-bearer stays |
| `grab` | «The dash»: a rise to 1 — Passepartout, reaching down from the rump, has her up into the howdah (her veil falls back); the priests fall back |
| `guide_seen` | «The dash»: a rise to 1 — the torch-bearer who stood lifts his torch to the guide's face as Kiouni goes by, their eyes meet; a cut (made ready at `grab`) close on the guide riding beside him, in the torch's light |
| `howdah_lamp` | the small lantern on the howdah's front posts lit (the lights `howdah_lamp_l/_r`): the faces in it warm at night on the run (the dash, `aouda_fear`) |
| `aouda_calm` | wake: 1 — she wakes calm and sees Fogg first; 0 — frightened, looking round |
| `guide_walks` | sold: 1 — the guide walks off alone along the sleepers |
| `beat`, `beat_next` | the film (the module beats) |

The rescue is no fight: torches, drums, the elephant's bulk and shadow, faces in the firelight; nobody strikes anyone.

The people — `person` (the cast `cast`): the keys `<id>_a`, `_d`, `_do`, `_turn`, `_look`, `_reach`, `_with`, `_wear`,
`_gait`, `_on`, `_here`, `_mood`. The near trunk at −6 is gone (it stood before Kiouni's face where the four hide). The footbridge (`bridge`), the top of the pyre (`pyre_top`) and its steps
(`pyre_steps`) — `walk` planes. 24 people (the engine's most): the column (9), the four, the crowd `v1…v8` (also the
passengers at the station), `owner`, `trader`, `conductor`. The roll of banknotes — `banknotes`, a layer its animate
carries to `fogg#hand_r`.

## Beats (lib.js `film(scene)`; at its end the scene says `beat:<name>`)

| Beat | after | What |
| --- | --- | --- |
| `rails_end` | — | Day, the end of the rails: the conductor along the carriages, the passengers off along the line; Passepartout ahead to Kiouni by his shed, Fogg and Cromarty after; his trunk up. `rails_end:shed` |
| `haggle` | rails_end | (the game's «The bargain») Fogg and the owner three-quarters to each other, Kiouni behind, the roll in Fogg's hand; then the game. `haggle:turned` |
| `mount` | haggle | The owner takes the roll; the guide to Kiouni's head; he kneels — a cut: all up, the guide on his neck — he rises, trumpets. `mount:up` |
| `ride` | — | (the game's «The elephant») Kiouni on the trail, the camera riding him from the side; then the game |
| `drums` | — | Dusk: Kiouni along the trail with the four; he stops dead, ears out (`drums:heard`); kneels, they get down one by one and hide crouching in the thicket; he goes in among the trees behind them. `drums:hidden` |
| `procession` | — | Night (a cut): the column comes and stops before the thicket (`procession:torches`, `procession:widow`, `procession:stopped`); holds under the choice — `kiouni#head` and `fogg#head` in the frame; the dash's first frame made ready meanwhile |
| `night_wall` | — | «At night»: by the pagoda's wall, the two guards' torches; the four creep up, a guard lifts his torch, they draw back; Passepartout lags and is gone into the dark. `night_wall:gone` |
| `pyre` | — | Dawn on the clearing: the priests set it alight; Fogg strains, Cromarty holds him back (Kiouni kneels at the trees, out of the frame, the guide on his neck). `pyre:kindled` |
| `rise` | pyre | The «rajah» rises from the smoke with the widow; the crowd on its face. `rise:risen` |
| `walk` | rise | (the game's «Like the dead») He carries her down and toward the trees as `walk` sends him. `walk:down`, `walk:away` |
| `flee` | walk | At the trees: he throws off the shroud (a cut, close) — Passepartout (`flee:pp`); a cut: all five up on Kiouni kneeling there, he rises and goes off into the forest; the crowd rises |
| `charge` | procession | (the game's «The dash») A cut to the four up on Kiouni in the thicket; then the game: out into the torches. `charge:through` (charge ≥ 0.8) |
| `aouda_fear` | charge | Close (riding him beside the howdah, its lantern lit, the frame shaken as he runs) through the dark: Aouda's eyes open, afraid, she looks out at us |
| `allahabad` | — | Morning, the board ALLAHABAD: Kiouni along the trail to the line's end, kneels (`allahabad:kneel`); Fogg, Passepartout and Cromarty get down, toward his head; Fogg stays by the howdah looking up at her |
| `wake` | allahabad | Close on the howdah: she wakes (`aouda_calm`). `wake:eyes`; the gift's and the sale's first frames made ready meanwhile |
| `gift` | wake | (a cut) Fogg's palm on the trunk, the goad to the guide; Kiouni lifts Passepartout on his trunk, he laughs. `gift:lift` |
| `sold` | wake | (a cut) The trader leads Kiouni away along the trail; Passepartout looks after him; with `guide_walks` the guide off along the sleepers. `sold:away` |
| `haggle_show`, `ride_show`, `walk_show`, `charge_show` | | The showcase's own (at the table's end): the games' beats playing themselves |

The cuts inside beats are made ready (shots): `mount`, `rise`, `flee`, `aouda_fear`, `wake`; `charge`, `gift`, `sold`
cut to a frame the scene made ready in the beat before (while it holds under the choice), else plainly. Each beat ends
in a living pose. The showcase (`showcase.js`): its own beat `day` (the camera along the trail by day), then
`lib.SHOWCASE`. Silent action before a moment: at most ~9 s (`mount`, `drums`, `allahabad`).

## Points

`kiouni#head`, `kiouni#trunk`, `kiouni#lift`, `banknotes`, `train#train`, `train#chimney`, `shed#kiouni_shed`,
`sign#station`, `hut#hut`, `forest#trail`, `procession#procession` (over the head of the first torch-bearer —
animate), `pyre#pyre`, `pyre#flames`, `pyre#smoke`, `pagoda#pagoda`, `sky#moon`, `sky#sun`; the people's
(`fogg#head`, `fogg#hands`, `guide#head`, `guide#hands`, `aouda#hands`, `owner#head`, …).

## Known

- The mist over the stream (`mist_stream`) lies as a grey veil over the lower frame when the camera is near the stream
  (the ride, the dash) — it was made for the views from the thicket.
- `walk`: the «rajah» walks by his gait's own pace toward where «Like the dead» sends him — the game's step shows as
  walking and halting, not as a slower or quicker step.
- People: 24 — the engine's most, none to spare.

## The light after the tone curve was changed (2026-10-11)

The dark became lighter and greyer — the haze and the halos, chosen for the old curve, drew a pinkish-grey veil over
the frame. By sheets against v1 (the air cleaner, the green and the pyre's gold seen): `haze` 0.25 → 0.14,
`hazeGlow` 0.9 → 0.25, `shafts` 0.4 → 0.25, `saturation` 0.85 → 1; the look `day`: `haze` 0.32 → 0.16, `shafts`
0.7 → 0.4; `dawn`: `haze` 0.3 → 0.18, `shafts` 1.1 → 0.5; the pyre `pyre` `strength` 2.2 → 1.6 (it does not bleach the
frame). The mist over the stream and the river — painted layers (`mist_*`); the light does not change them.


Shortened silences (2026-10-21, the browser play): `rails_end` — the travellers start nearer the shed (`rails_end:shed` at about 4 s, the beat 7 s); `night_wall` — shorter creep and slip (`night_wall:gone` at about 6.6 s); `pyre` — the priests start nearer (`pyre:kindled` at about 2.8 s). «The bargain»: `owner_back` 1 turns the owner to 25° — his back to Fogg and to us (60° read as a look at the elephant).

After the second browser play (2026-10-21): `kiouni#head` moved from his eye down to his face toward the trunk's root (`KI.face`) — in «The elephant» its ring sat almost on the goad's groove at `guide#hands`.

## Contract for the check

```json
{"beats": {
  "rails_end": {"after": [], "tells": ["rails_end:shed"], "seconds": 7, "show": false},
  "haggle": {"after": ["rails_end"], "tells": ["haggle:turned"], "seconds": 4, "show": false},
  "mount": {"after": ["haggle", "haggle_show"], "tells": ["mount:up"], "seconds": 12, "show": false},
  "ride": {"after": [], "tells": [], "seconds": 1, "show": false},
  "drums": {"after": [], "tells": ["drums:heard", "drums:hidden"], "seconds": 21, "show": false},
  "procession": {"after": [], "tells": ["procession:torches", "procession:widow", "procession:stopped"], "seconds": 27, "show": false},
  "night_wall": {"after": [], "tells": ["night_wall:gone"], "seconds": 8, "show": false},
  "pyre": {"after": [], "tells": ["pyre:kindled"], "seconds": 8, "show": false},
  "rise": {"after": ["pyre"], "tells": ["rise:risen"], "seconds": 8, "show": false},
  "walk": {"after": ["rise"], "tells": ["walk:down", "walk:away"], "seconds": 22, "show": false},
  "flee": {"after": ["walk", "walk_show"], "tells": ["flee:pp"], "seconds": 12, "show": false},
  "charge": {"after": ["procession"], "tells": ["charge:through"], "seconds": 10, "show": false},
  "aouda_fear": {"after": ["charge", "charge_show"], "tells": [], "seconds": 5, "show": false},
  "allahabad": {"after": [], "tells": ["allahabad:kneel"], "seconds": 12, "show": false},
  "wake": {"after": ["allahabad"], "tells": ["wake:eyes"], "seconds": 5, "show": false},
  "gift": {"after": ["wake"], "tells": ["gift:lift"], "seconds": 10, "show": false},
  "sold": {"after": ["wake"], "tells": ["sold:away"], "seconds": 10, "show": false},
  "haggle_show": {"after": ["rails_end"], "tells": [], "seconds": 15, "show": true},
  "ride_show": {"after": [], "tells": [], "seconds": 30, "show": true},
  "walk_show": {"after": ["rise"], "tells": [], "seconds": 22, "show": true},
  "charge_show": {"after": [], "tells": [], "seconds": 11, "show": true}
},
"points": ["kiouni", "kiouni#head", "kiouni#trunk", "kiouni#lift", "banknotes", "train#train", "train#chimney", "shed#kiouni_shed",
  "sign#station", "hut#hut", "forest#trail", "procession#procession", "pyre#pyre", "pyre#flames", "pyre#smoke", "pagoda#pagoda",
  "sky#moon", "sky#sun", "fogg", "fogg#head", "fogg#hands", "fogg#hand_r", "guide", "guide#head", "guide#hands", "aouda", "aouda#head",
  "aouda#hands", "passepartout", "cromarty", "owner", "owner#head", "trader", "conductor"],
"offers": ["kiouni#head", "fogg#head", "guide#head"],
"party": {},
"acts": {}}
```
