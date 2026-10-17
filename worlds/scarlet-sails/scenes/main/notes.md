# The Kaperna Shore (`main`) — on engine 2

The world's first scene; it sets its style: modern, fine, almost minimalist. A vast morning mirror of a sea and
sky, a pearly silver-blue palette, clean volumes, long reflections, soft mist. The only warm thing in the frame is Longren's
window (and the tavern's lantern when it is lit); the only scarlet — the ship's sails and Assol's yacht. The people are the engine's, the world's cast
(`cast`); the film in beats — `beats` (`lib.film`); the sky and the hour's light — `sky`; the ship, the skiff, the night's lights — `ships`; the hands
close up — `closeups`.

Everything is painted once, in the day's colours. No painting reads a key: the hour, the mist, the wind, the windows, the lantern, the lighthouse,
the ship, the sails, the yacht on the water, the snow, the storm, the past — they are the scene's light, layers, `animate`, shaders, particles.

## The frame

The camera `panorama` right at the water (the eye at 1.7 m, the horizon 0.55), looking along the water's edge: on the left the hill with Kaperna, on the right
the open sea, the cape with the lighthouse; the sun rises over the sea on the right and sets behind the hill on the left.

| Element | Where | What |
| --- | --- | --- |
| `sky` | the sky | the world's sky (`sky.sky`, the shader `tools/sky.wgsl`): the hour's gradient, the stars, the clouds, the sun and the moon — layers; the points `sky#sun`, `sky#moon` |
| `sea` | a plane to the horizon | a mirror (`reflect`: `rough`, `ripple`); its own colour under the mirror; the wind's ripple is the layer `ripple` (it drifts, seen at `wind`) |
| `mist` | 700 m | the mist on the horizon by the cape: a layer-streak (the height and the thickness by `mist`) and two layers of banks drifting different ways |
| `ship` and `ship_…` | 9000 → 260 m | the Secret (`node tools/ship.js main ship`): the anchor `ship` (the place, the turn, the heel — keys) and 22 elements on it |
| `cape`, `lighthouse`, `lighthouse_light` | 800 m | the cape; the lighthouse's tower; its light (`glows`): a flash once in 8 s and a beam both ways — layers, lit from dusk till morning (in the mist of the night of waiting it is not seen: `lib.capeMist`) |
| `cape_mist` | 792 m | the mist on the cape on the night of waiting (`cape_mist`): a layer along the cape and a layer over its end and the tower — it parts while `light3` is about 1 |
| `light1`, `light2`, `light2_smoke`, `light3` | the horizon → near → behind the cape | the three lights of the night of waiting (below, “Chapters IV–V”) |
| `hill`, `hill_far` | planes `drape` | the hill's slope over the relief, pebbles at the water, a stair |
| `kaperna` | 200 m | the houses on the hill — parts (`e.part`) on the relief, the windows dark |
| `lit_windows` | 200 m, `glows` | the lit windows: the glows `w0`…`w42` in the houses' parts; `animate` lights them by `windows`, Longren's window (the last) — by `longren_window`; it is warm and three times brighter than the rest (strength 3: from the shore it is 3 pixels, and Gray looks at it and it goes out in `to_skiff`) |
| `veil` | 175 m | a veil over the bay: two layers of banks (by `mist`) |
| `road` | a plane `drape`, 127–182 m | the shore beyond the bay under the tavern and to the left of it: pebbles, the road to Liss along the water, the yard before the tavern; the snow is a layer |
| `tavern_set` and what is on it | 140 m | Menners' tavern, put together on an anchor (below, “The tavern”) |
| `cart`, `nets2` | by the tavern | Philip's cart with baskets to the left of the veranda; nets on stakes to the right, towards the water |
| `nets` | 30 m | nets on stakes |
| `net` | on the keel of `boat2` | a coil of net (Longren lays his palm on it) |
| `rope` | at the edge | a coil of rope — only in the past (a layer, seen by `past`) |
| `skiff`, `skiff_far`, `skiff_in` | the sand by the boats or the water | the Secret's skiff (`ships.skiff`): the near side (it is also the anchor and the point `skiff`), the far side 1.3 m behind it, an unseen “inside” between them (the point `skiff_in#stern` — where they stand in the stern); where it is, how it is turned and how high it floats — `lib.skiffAt` |
| `menners_skiff` | 46 → 260 m | Menners' boat — only in the storm (a layer, seen by `storm`); `menners_boat` carries it off, it rocks |
| `blizzard`, `storm_rain` | the air | particles: a blizzard by `winter`, a downpour by `storm` |
| `beach`, `sand` | planes `drape` | the near shore |
| `boat1`, `boat2`, `stone` | 8.5, 17, 4.6 m | upturned boats; a stone at the edge |
| `toy` | 6.3 m | Assol's yacht in the shallow water (`ships.toy`): a layer, seen by `toy_water`, it rocks |
| `assol`, `kid_boy`, `kid_girl`, `kid_small`, `girl`, `mother`, `longren` | by the boats | the engine's people |
| `grey`, `hin`, `filipp`, `mary`, `menners`, `woman2`, `woman3` | by the tavern (Gray and Longren — at the water too) | the people of chapter III and of the past |
| `fisher1`, `fisher2` | by the boats | Kaperna's fishermen (chapter V) |
| `letika` | in the skiff (`"on": "skiff"`, the bow thwart) | Letika at the oars (the part `oars`) |
| `hands` | an insert (`hands`) | the hands close up: the shot `boat` of the module `closeups`; `reach` is read only by `animate` |

## The tavern (chapter III)

Before — one flat card 140 m off on a landing in the water. Now it is a building in the same place.

**The relief** (`lib.js`: `LAND`, `strand`): beyond the bay the shore goes on — low level land (1.1 m above the sea) from its
edge at 127 m to the foot of the hill, under the tavern and to the left of it; to the right of the tavern (27 m to the right) it ends, the landing
stands over the water. From the usual camera it is a strip of a couple of pixels at the foot of the hill: the view from afar is as before.

**The building** — on the anchor `tavern_set` (14 m to the right, 140 m; `lib.tv(x, z)` — a point of the building in the scene's metres: x along
the front wall, z from it inwards, in front of it — minus). The house is a block of 12 × 6 m (x −4…8), the walls 4 m, the ridge 6.2 m.

| Element | What |
| --- | --- |
| `tavern` | the front wall with a doorway cut in it, dark windows; to the right — the landing on piles. The points `#tavern`, `#landing`, `#veranda`, `#lamp` (on the wall: behind the veranda and behind the lantern) |
| `tavern_inside`, `tavern_floor` | what is seen in the doorway (dark; the warmth is a layer by `tavern_lamp`) and the floor past the threshold (an unseen plane `walk`: Menners stands in the doorway) |
| `tavern_door` | a door on hinges on the left, opening inwards: the key `tavern_door` 0…1 (the script leads `tavern_door_facing`) |
| `tavern_light` | the lit windows: a layer and glows by `tavern_lamp` |
| `tavern_side`, `tavern_side_left` | the gable ends (the right one — to the landing; the left one is seen by the scene's usual camera) |
| `tavern_roof` | the roof's slope to the sea (a tilted plane); the snow is a layer |
| `veranda`, `veranda_steps` | the veranda's floor of 6 × 3 m, 0.5 m above the ground (x 2…8, before the wall), `walk`; the steps before the door (a tilted plane `walk`) |
| `veranda_rail`, `veranda_left`, `veranda_right` | the rail in front (with a gap at the steps), the posts and the beam with the lantern's body; the ends |
| `tavern_lantern` | the lantern over the table: the glass (a layer by `tavern_lamp`), the point `#lamp`; its light is the scene's source `lantern` |
| `tavern_table`, `tavern_table_top`, `tavern_bench`, `tavern_bench_top` | a table by the rail and a bench behind it; the seat — `lib.js` `SEAT` (for `<id>_on`), the point `tavern_bench#seat` |

**The tavern shots' camera** — `TAVERN_CAM` in `lib.js` (the keys `camera_x`, `camera_z`, `camera_yaw`): on the road 4.7 m before
the veranda, a little to the left of its middle, looking at the veranda. The engine's lens — the frame's height = the distance, so: the people on
the veranda at 5.8–6 m are about 0.3 of the frame's height (Hin 0.30), and about 10 m of the building go into the frame's width: the cart at the left
edge (16:9), the nets and the women by them — at the right one. **At 8 m (as in scenes.md) the people would be 0.2 of the frame** — less than a quarter, and
Hin speaks; the distance is chosen for the people's size. In `passing` the camera turns to the right (to the nets, where Assol
comes from) and follows her to the left.

The shot from behind Gray (`grey_close`) — the camera on the veranda behind his shoulder (`camera_h` 0.55: the camera's eye keeps to the relief, not
to the veranda's floor), looking along the road to the west. The slope with the houses is not seen from here — the tavern's house itself hides it, — so
Assol goes off along the road into the distance, towards the far hills, and not “up the slope”.

## What became what (v1 → v2)

| v1 | v2 |
| --- | --- |
| the sky was painted by `hour` (`sky.palette`) | the world's sky: one painting, a shader and `animate` by `hour`; the sun and the moon are layers with points and glows |
| the hour's light — only the looks' `ambient` | the looks `day/dawn/dusk/night` + the far sources `sun` (`sky#sun`), `moon` (`sky#moon`): the light comes from where they are painted; the shadows of the people and the stone |
| the sea was painted anew by `wind` | the ripple is a layer with `drift`, its alpha — `wind` |
| the mist and the veil were painted anew every frame (`e.t`) | layers with `drift`; the streak's height is the layer's `scaleY`, the thickness — the alpha |
| the lighthouse was painted anew every frame | the tower is a painting; the light is the element `lighthouse_light`: `e.glow` and two beam layers in `animate` |
| the ship — one flat painting `ships.galliot`, far off a point by `e.px` | the world's assembled ship: faceted sides, decks, masts and yards, nine sails with the sailcloth shader (the wind on the cloth, white ↔ scarlet by `sails`, translucent); she comes bow to the shore and anchors three-quarters on (`ship_facing`), rolls (`ship_roll`); far off — a spark (`ship_spark`) |
| Kaperna's windows — rectangles painted by `windows` | glows in the houses' parts, `e.glow` by `windows` |
| the film — lines by seconds (`film`), the people moved in the seconds given | the director's beats (`beats`): people walk at their own pace and run at their own run, the beat waits for them |
| fades (`fade`) at every cut | cuts with no fades; out of black — only the prologue; in `grey_dawn` the night turns into dawn before our eyes (`hour` moves) |

## Light

`light.looks`: `day`, `dawn` (pearly, a little warm), `dusk` (lilac-grey), `night` (blue). The weights and
`sun_light`, `moon_light` are kept by `script.js` (`sky.follow`); in cuts they go together with the hour (`sky.keys`). The windows,
the tavern's lantern, the lighthouse are glows (`e.light`), `hazeGlow` — their light in the air. The reflections, the paths of the sun, the moon and the windows —
the sea's mirror. The mist (`mist`) is only the layers by the cape and over the bay, it has no look of light: the morning air is clear to
the horizon (`dawn` — a haze of 0.03, seen to 20 km; `day` 0.07 — to 7 km), else the ship's spark 6–9 km off is not seen at all
(a glow fades as e^(−D/the haze's range): with a haze of 0.1, a twentieth of it is left at 9.5 km, with the old look
`mist` — a five-hundredth). The night is raised (ambient 0.62, the moon 0.6): Assol on the stone must read.

## Keys

Described in `states`. For the game: `hour`, `mist`, `wind`, `windows`, `longren_window`, `tavern_lamp`, `ship` (0 none → up to 0.15
a spark flares up by the cape → comes to the shore → 1 at anchor), `sails` (white → scarlet), `toy_water`, `beat`; `tavern_door`
(the tavern's door), `past` (the look of light “the past”: faded, the grain thicker — by a cut), `winter` (snow in layers on the shore by the
tavern, its roof and the slope; a blizzard — particles), `storm` (a look of light, a veil of sky, white crests — a layer of the sea, a downpour,
wind), `menners_boat` (Menners' boat is carried off), `boat` (the Secret's skiff on the water: 0 by the ship's side → 1 by Assol in
the water; the place — `lib.skiffAt`), `skiff_ashore` (the skiff hauled up on the sand by the boats — chapter III), `light1`, `light2`,
`light3` (0…2 — the lights of the night of waiting, moved by the game; outside that night 2), `cape_mist` (the mist on the cape that night), `hands`
(the hands insert), `reach` (“Hand”).
Internal (led by the scene): `day`, `dawn`, `dusk`, `night`, `sun_light`, `moon_light`, `ship_across`, `ship_distance`,
`ship_facing`, `ship_spark`, `ship_roll`, `tavern_door_facing`, `mb_a`/`mb_d`, `sk_a`/`sk_d`/`sk_f`/`sk_e`,
`light1_a`/`light1_d`, `light2_a`/`light2_d`, `light2_smoke`; the people's places — `lib.js`
`PLACE` (`as_`, `kb_`, … + `a`/`d`; set by the beats).

**The play's keys** — the game sets them on opening the scene; no `from` sets them; without the game — the values from `state`:
`ring` (`none` · `finger` · `cord`), `ring_kind` (`mother` · `own`), `warm` 0…1, `girl_toy` 0/1, `longren` (`home` ·
`knows` · `sea`), `ending` (`grin` · `cry` · `waited` · `kaperna`), `morning` 0.26…0.36. The beats read them through
`lib.js`: `lit(scene)` — the windows in the evening and at night 0.45 + 0.45·`warm`; `held(scene, …parts)` — what Assol (17) has with her:
the parts named and the ring with `ring` = `finger` (`ring_kind` `mother` → the part `ring`, thin, with a stone; `own` → `ring_old`, old, broad — as in “The House” and “The Wood”); `hisWindow(scene)` — Longren's window in the evening and at night of chapter IV: dark with `longren` = `sea` — **every beat that puts something into her hands
sets `assol_with` only through `held`**, else the ring vanishes. Read by: III — `tavern`, `tavern_back`, `passing`,
`grey_close`, `grey_shore`, `to_skiff`, `longren_boat`; IV — `longren_goes` (`ring`, `ring_kind`), `girl`, `give`, `keep`,
`wait`, `grey_dawn` (`ring`, `ring_kind`, `warm`, `longren`); V — `dawn_two` (`ring`, `ring_kind`, `morning`), `sails_far` (`morning`,
`ending`), `run`, `shore` (`ending`, `longren`, `girl_toy`, `ring`, `ring_kind`, `morning`), `hands`, `meet` (`ring`,
`ring_kind`, `morning`; with `ring` = `cord` in `meet` and `away` she has the part `ring_cord`), `away` (`ending`, `longren`,
`girl_toy`, `morning`).

With no beat there is nobody on the shore: in `state` every person's `<id>_here` = `false`; the people are placed by the beat's `from` (`shore()` —
none of them, `at()` — who is here). A beat's side affairs (the children leave in `alone`, run in `run`, Longren comes down in `shore`) —
`s.sequence`: a beat stopped midway stops them too.

**Changed against v1:** `beat` by default `null` (the showcase outside games — `showcase.js`, there is no value `film` any more);
`fade` takes no part in the cuts.

## Points for the game

`ship` (the anchor; will do for a gaze and the camera), `ship_rig#ship` (was `ship#ship`), `ship_rig#masthead`, `#bow`, `#stern`,
`#deck`, `#ladder`; `lighthouse#light`, `tavern#landing`, `tavern#tavern`, `tavern#veranda`, `tavern#lamp`,
`tavern_lantern#lamp`, `tavern_door#door`, `tavern_table#table`, `tavern_bench#seat`, `cart#cart`, `nets2#nets`, `net`,
`skiff` (itself — a point on the side; `#skiff`, `#bow`, `#seat1`, `#seat2` — the module's), `skiff_in#stern`, `light1#light`,
`light2#light` (and the module's `#funnel`, `#steamer`), `light3#light`, `hands#her`, `hands#his` (set by `closeups.live` while
the insert is open), `menners_skiff#skiff`, `nets#nets`,
`boat1#boat`, `boat2#boat`, `kaperna#longren_house`, `lit_windows#longren_window`, `stone#stone`, `toy#toy`, `sky#sun`,
`sky#moon`; the people's points (`assol#hands`, `assol#yacht` — the yacht in her hands…).

## The beats (`lib.film`; at the end the scene tells `beat:<name>`)

| Beat | after | What | Moments (`scene.tell`) |
| --- | --- | --- | --- |
| `spark` | — | dawn, out of the dark (2 s), the empty shore; by the cape a scarlet spark flares up (`ship` → 0.12) and stays — under the first touch (`ship_rig#ship`) | `spark:lit` |
| `prologue` | spark | the spark grows into a ship under scarlet sails, far off (`ship` → 0.32); no cut and no fade | `prologue:spark` (at the start) |
| `kids` | — | evening: Assol (8) runs with the yacht to the boats; the children turn round, point, laugh; the eldest girl steps forward and calls | `kids:came`, `kids:laugh`, `kids:beckon` |
| `kids_hold` | kids | she stands with the yacht, the children wait — under a choice | |
| `alone` | kids_hold | she goes to the water, puts the yacht on the shallow water (`toy_water`); the children go off up the slope, the boy looks back and laughs | `alone:toy-down`, `alone:left` |
| `play` | kids_hold | the eldest girl takes her by the hand, they sit down by a boat, throw pebbles; Assol looks back at the sea | `play:hand`, `play:sat` |
| `tavern` | — | III, evening (`hour` 0.76), the lantern, the tavern's camera: Gray at the table by the rail, Hin beside him, hands on his hips (`hands_hips`), by the cart Philip, by the nets two women. Hin nods towards the slope (`nod_aside`) | `tavern:hin` |
| `past_mary` | — | the past (a cut): winter, a blizzard, dusk, the same camera. Mary with the baby by the door (`baby_stand`) — to the left of the doorway, side-on to us: from the tavern's camera she is seen whole between the posts by the steps, to the right of the doorway a post hid her; the elder Menners in the doorway shakes his head (`shake_head`); she goes down the steps and away along the road to the left (`baby_walk`); the door closes | `past_mary:door`, `past_mary:goes` |
| `past_storm` | past_mary | the past, the near shore (**the beat makes the cut itself** — as the first line of `run`): a storm. Longren, younger (`longren_young`), at the water with his pipe, a rope at his feet; the boat with Menners on his knees (`wave_help`, a far silhouette) is carried off into the waves (`menners_boat` 0 → 1) | `past_storm:cry`, `past_storm:gone` |
| `tavern_back` | — | evening again, the tavern's camera (a cut): the same poses, Philip has stepped towards the veranda and stands — under a touch (`filipp`) | `tavern_back:ready` |
| `passing` | tavern_back | along the road past the veranda, from right to left, goes Assol (17) with a basket, not looking (she comes out half a second after the beat's start, still out of the frame); the three look after her; with `ring` = `finger` the women by the nets reach a hand towards `assol#ring`. The camera turns to her and follows her | `passing:assol` |
| `grey_close` | passing | (close up; **it makes the cut itself**) from behind Gray: he has stood up by the rail, over his shoulder the road and her small figure going off into the distance | |
| `grey_shore` | — | dusk (`hour` 0.8), the usual camera: Gray alone at the water; the skiff on the sand by the boats; Longren with his pipe by `boat2`; his window is lit on the slope — under a choice (`skiff`, `longren`) | `grey_shore:alone` |
| `to_skiff` | grey_shore | Gray goes to the skiff, lays his hand on its side; the window on the slope goes out behind his back | `to_skiff:dark` |
| `longren_boat` | grey_shore | Gray goes to the boats, round the bow of the skiff on the sand (the camera goes after him and comes to the boats a little later than he does: 12 s — else it caught up with him and cut him off at the knee; the skiff stays out of the frame); Longren lays his palm on the coil of net (`reach`), turns; they stand face to face; at the end Longren turns his head to the road, where the cart is | `longren_boat:met` |
| `longren_goes` | — | IV, sunset: Longren with his chest goes off along the shore, turns, raises his hand; Assol by a boat | `longren_goes:wave` |
| `girl` | — | evening, sunset (`hour` 0.76 — no earlier than `longren_goes`; the windows by `warm`, Longren's window dark with `longren` = `sea`): Assol (17) on a boat's keel, the yacht on her knees; a little girl comes up, looks at the yacht — under a choice (`girl`, `assol#yacht`) | `girl:came` |
| `give` | girl | she holds out the yacht; the girl takes it and runs off up the slope, holding it over her head (the gait `run_high`) | `give:given`, `give:gone` |
| `keep` | girl | the girl goes off to her mother by the nets, looks back | `keep:looks-back` |
| `wait` | — | night: Assol on the stone, hugging her knees; the camera turned to the sea and standing 4.7 m from the stone (nearer — the stone and her feet go under the frame's bottom edge) — she on the left, behind her Kaperna's windows (by `warm`; Longren's window dark with `longren` = `sea`), to the right of the cape three lights (`light1…3` = 0), the cape in mist (`cape_mist`) — under “Waiting” (`light1#light`…`light3#light`) | |
| `wait_lights` | wait | **for showing only** (in the game it is “Waiting”): the lights come near in turn (the boat, the steamer, the lighthouse in the parted mist) and go off behind the cape; the windows go out by quarters | |
| `grey_dawn` | wait, wait_lights | the night passes into a grey dawn (her head on her knees); she gets down and goes home, the camera turns after her | `grey_dawn:light`, `grey_dawn:home` |
| `dawn_two` | — | V, the ending `waited`: the same morning (`hour` = `morning`, as with the shore's other beats in V) — Longren and Assol together at the very edge, from behind and from the side; by the cape a scarlet point flares up and stays (`ship` 0 → 0.32); she turns to her father | `dawn_two:spark`, `dawn_two:turns` |
| `sails_far` | — | morning (`hour` = `morning`): the ship under scarlet sails comes out from behind the cape (`ship` 0.32 → 0.62). The camera looks at the sea — the shore's people are not in the frame; with `ending` = `kaperna` the camera is on the shore: all Kaperna already stands in two groups | `sails_far:seen` |
| `run` | sails_far | the camera turns to her way; Assol runs down to the water and stops at the edge (with `kaperna` — she walks between the two groups); the people — by `ending` (below); the ship comes near (`ship` → 0.8) | `run:at-the-edge` |
| `shore` | run | the ship anchors (`ship` → 1); the skiff comes from her (`boat` 0 → 0.8): Letika sits at the oars, Gray stands in the stern; Assol walks into the water up to her knees, the camera after her. Longren (`home`) comes down to the boats | `shore:anchor`, `shore:boat`, `shore:water` |
| `hands` | shore | the skiff comes up to her (`boat` → 1), Gray holds out his hand; a cut into the insert `hands` (`reach` 0) — under “Hand” | `hands:close` |
| `hands_reach` | hands | **for showing only** (in the game it is “Hand”): `reach` → 1 | |
| `meet` | hands | (**it makes the cut itself**) she is in the skiff, in the stern before him; the camera from the side, a medium shot: two profiles against the light water, over them the ship under scarlet sails; the hands meet; she looks back at Kaperna | `meet:boat` |
| `away` | meet | (**it makes the cut itself**) a wide shot from the shore: the skiff already far off, going to the ship (`boat` 0.6 → 0.3); those left behind look after it; one raises a hand (`wave`); the girl with the yacht over her head (`girl_toy`) | `away:wave` (told even when nobody raises a hand) |

The showcase (`showcase.js`, `lib.SHOWCASE`): spark, prologue, kids, kids_hold, alone, tavern, past_mary, past_storm, tavern_back,
passing, grey_close, grey_shore, longren_boat, girl, give, longren_goes, wait, wait_lights, grey_dawn, dawn_two, sails_far,
run, shore, hands, hands_reach, meet, away (with the play's keys at their defaults: the ending `grin`, Longren `home`). Every beat's
`from` is a cut: the states in `lib.js` — DAWN, KIDS, MET, HELD (with no play's keys, before the film) and inside
`film(scene)` (they read the play's keys): TAVERN_EVENING, ASKED, BEHIND_GREY, WINTER, STORM, DUSK, BOATSIDE, GIRL_CAME, GOES,
NIGHT, DAWN_TWO, SAILS_SEEN, COMES_DOWN, AT_THE_EDGE, WADED, TWO, LEFT. **A beat that by the contract comes “after”
another but opens with a cut** (`past_storm`, `grey_close`, `meet`, `away`) has no `from`: its `run` begins with
`s.cut(…)` of the full state — so there is one cut, whether it comes after its `after` or opens the scene.

The places (metres) — constants before the film in `lib.js`: a boat's keel (BOAT), the stone (STONE), at the edge (AT_EDGE), the way up
(UP — to the frame's edge and beyond), the nets (NETS); the tavern — SEAT, AT_TABLE, AT_RAIL, DOORWAY, AT_DOOR, CART, AT_CART,
BY_VERANDA, ALONG_ROAD; at the water in III — AT_WATER, AT_SKIFF, NET, AT_NET, MEETS, the cameras SHORE_CAM, BOATS_CAM; the morning of V —
FROM_UP, WAY_HEAD, DOWN, STAND, BY_BOAT, KIDS_FROM, KIDS_EDGE, GIRL_FROM, GIRL_EDGE, LONGREN_EDGE, LONGREN_BOATS, WAVES,
SLOPE,
IN_WATER, the cameras SEA_CAM, WAY_CAM, EDGE_CAM, WADE_CAM, WIDE_CAM, TWO_CAM.

**A look put on by a cut, and the pace.** The engine puts on a look from `<id>_wear` in the frame after the cut, and takes the walking speed
from the legs at the moment the walk begins: a walk begun in the same frame as a cut that changes the look (Assol 8 → 17) goes
at the pace of a child's legs — the warning “moved slower than its gait”. So in `passing` and `grey_close` she comes out
0.3–0.5 s after the beat's start.

## The relief and the houses

`relief.js` — `lib.ground`: the sea at −0.1 m; the beach rises from the edge (`EDGE`), and its bottom goes under the water at the same slope
— shallows by the near shore (up to 0.55 m; 9–14 m from the edge and 14–22 m deep the bottom comes back to the sea's level, so that all
that floats and is far off stands as before): Assol walks into the water up to her knees over them at her usual pace. What floats over the shallows is
raised to their depth (the yacht `toy` — `elevation`, the skiff — `sk_e`); the hill (`HILL`, `PROFILE`) 200 m off with two
terraces. The houses — `lib.houses`: blocks in steps, each a part of an element on the relief.

## Chapters IV–V

**The night of waiting (`wait`, “Waiting”).** The camera turned 12° to the sea: Assol on the stone in the left third, behind her the slope with
Kaperna's windows (the game puts them out: `windows`), the right half — the open sea to the right of the cape. The three lights are elements with the point
`light` (which the game offers): in 16:9 they stand at 1.01, 1.18 and 1.35 of the frame's height from the left edge (between neighbours ≥ 0.15,
all within the middle 4:3).

- `light1` — a fishing boat (`ships.far`), `light2` — a steamer (`ships.steamer`, the smoke — the particles `light2_smoke`). Where
  they are — `lib.lightAt` (`LIGHTS`: the bearing and the range at 0, 1, 1.5, 2): far out at sea → near (the boat 100 m off, the steamer
  430 m) → back past the cape's end → behind the cape. The place is set by the script (`light1_a`…), the painting reads no keys. Far off the module's lantern
  is smaller than a pixel, so each has its own far glow `far` (like the ship's spark): `lib.lightMotion`
  puts it out near by and both of them behind the cape. The far glows — 12 m (strength 4) for the boat and 26 m (strength 4) for the steamer: points of 3–5 pixels with a halo,
  weaker ones got lost; the lighthouse's light in the mist (`light3`) — strength 1, broad and pale. **Outside that night `light1…3` = 2** (so every cut sets them, `shore()`): the boat and
  the steamer stand behind the cape, the lights and the smoke out.
- `light3` — the lighthouse. That night mist lies on the cape (`cape_mist` 1: the element `cape_mist`, two layers); the tower and its light are not
  seen, only a dim broad light in the mist is seen (the element `light3`). At `light3` → 1 the layer of mist over the tower
  parts (`lib.capeMist`), `lighthouse_light` is lit and sweeps its beam; towards 2 the mist closes, the light in it is weaker.
- After “Waiting” the game itself leads the lights to 2 and the windows to 0.1; `grey_dawn` begins with that (its `from` — the lights at 2).

**The morning of the sails.** The hour is the play's key `morning`. Who is on the shore — `kaperna(when)` in `film` (by `ending`, `longren`,
`girl_toy`; `when`: `comes` → `edge` → `waded` → `away`):

| `ending` | Who and where | The hand in `away` |
| --- | --- | --- |
| `grin` | two fishermen and three women stand to the left of her way (`STAND`), looking; `woman2` whispers to `woman3` (`whisper`, turned to her) | Longren, if he is here; else nobody |
| `cry` | the same wave after her (`wave`); Philip without his cap (`filipp_bare`, `cap_hand` — from the first frame); three children run after her to the edge; with `girl_toy` the girl with the yacht runs ahead (`run_high`) | Longren, if here; else Philip |
| `waited` | at the water only Longren and Assol; from `shore` on, three people far off on the slope (`SLOPE`) | Longren |
| `kaperna` | all Kaperna in two groups (`STAND` on the left, `BY_BOAT` by the boat), a way between them; Assol walks | Longren |

Longren (`father()`): at the water — with `longren` = `knows` and in the endings `waited`, `kaperna`; `home` — in `run` he is not there, in
`shore` he comes down and stands by the boats; `sea` — not there. Philip does not take his cap off in the frame: he is without it from the first frame.
In `away` (a cut to the wide shot) whoever raises a hand stands within the frame, not at its edge: Longren, come down from
the house, and Philip, when it is he who waves, — behind the near boat (`WAVES`); Longren at the water stays at `LONGREN_EDGE`.

- **`sails_far` → `run` with no cut.** In `sails_far` (except `kaperna`) the camera looks at the sea (`SEA_CAM`, 14° to the right),
  and the people already standing on the shore stay beyond the frame's left edge (on 21:9 too); `run` turns the camera to them
  (`WAY_CAM`). Assol and the girl with the yacht appear higher up the shore while the camera has not turned yet; the three children — at
  1.2–2.2 s, already at the left edge of a 16:9 frame (as Longren from the house does in `shore`).
- **`run` with `kaperna` opens with a cut** (so the game plays it): the camera at once on her way, and Assol already stands at
  the start of the passage (`WAY_HEAD`: `COMES_DOWN` sets `assol_here`).
- **`shore` after `dawn_two` is a cut** (the ending `waited`, `run` is not played): `dawn_two` leaves the ship far off
  (`ship` 0.32), `shore` begins with `AT_THE_EDGE` (`ship` 0.8); both at the hour `morning`. `shore`'s `after` is only `run`.
- **The skiff.** `boat` 0…1 — straight from the ship's side to the meeting place (`SKIFF_MET`), quadratically: at 0.8
  ten metres are left, at 0.6 — about fifty. On the water the skiff lies side-on to the shore (`sk_f` 207: across the line
  shore — ship) and goes so all the way, there and back; there is no rowing and no turning. There are two sides (`skiff`, `skiff_far`), the people
  between them: Letika is an element `"on": "skiff"`, sitting (`seated`, the part `oars`); Gray stands in the stern
  (`grey_on: "skiff_in#stern"`), in `meet` and `away` he sits on the stern thwart, Assol — in the stern before him (`<id>_on`:
  `{"on": "skiff", "at": […]}`).
- **Knee-deep water.** Assol walks over the shallows' bottom (`IN_WATER`, 0.42 m deep) at her usual pace — the sea's mirror hides her legs.
- **`hands`.** The insert `hands` is the shot `boat` of the module `closeups`; it opens by a cut (`s.shot({hands: 1, reach: 0})` →
  `cut()`), the cut of `meet` closes it. In the shot Gray's hand is on the left — so Assol stands by the stern, to the right of him.
- **`meet`.** The camera stands in the water on the shore's side and looks along the line at the ship (`TWO_CAM`): the heads at the horizon,
  the ship between them and above them. Both in profile (in the skiff's frame `turn` 90 and 270); Letika has turned away to the ship and in 16:9 is beyond
  the frame's left edge.

## Contract for the check

```json
{
 "beats": { "spark": { "after": [], "tells": [ "spark:lit" ], "seconds": 6 }, "prologue": { "after": [ "spark" ], "tells": [ "prologue:spark" ], "seconds": 14 }, "kids": { "after": [], "tells": [ "kids:came", "kids:laugh", "kids:beckon" ], "seconds": 10 }, "kids_hold": { "after": [ "kids" ], "tells": [], "seconds": 2 }, "alone": { "after": [ "kids_hold" ], "tells": [ "alone:toy-down", "alone:left" ], "seconds": 10 }, "play": { "after": [ "kids_hold" ], "tells": [ "play:hand", "play:sat" ], "seconds": 10 }, "tavern": { "after": [], "tells": [ "tavern:hin" ], "seconds": 14 }, "past_mary": { "after": [], "tells": [ "past_mary:door", "past_mary:goes" ], "seconds": 16 }, "past_storm": { "after": [ "past_mary" ], "tells": [ "past_storm:cry", "past_storm:gone" ], "seconds": 16 }, "tavern_back": { "after": [], "tells": [ "tavern_back:ready" ], "seconds": 4 }, "passing": { "after": [ "tavern_back" ], "tells": [ "passing:assol" ], "seconds": 12 }, "grey_close": { "after": [ "passing" ], "tells": [], "seconds": 6 }, "grey_shore": { "after": [], "tells": [ "grey_shore:alone" ], "seconds": 6 }, "to_skiff": { "after": [ "grey_shore" ], "tells": [ "to_skiff:dark" ], "seconds": 8 }, "longren_boat": { "after": [ "grey_shore" ], "tells": [ "longren_boat:met" ], "seconds": 20 }, "girl": { "after": [], "tells": [ "girl:came" ], "seconds": 5 }, "give": { "after": [ "girl" ], "tells": [ "give:given", "give:gone" ], "seconds": 7 }, "keep": { "after": [ "girl" ], "tells": [ "keep:looks-back" ], "seconds": 6 }, "longren_goes": { "after": [], "tells": [ "longren_goes:wave" ], "seconds": 12 }, "wait": { "after": [], "tells": [], "seconds": 3 }, "wait_lights": { "after": [ "wait" ], "tells": [], "seconds": 22, "show": false }, "grey_dawn": { "after": [ "wait", "wait_lights" ], "tells": [ "grey_dawn:light", "grey_dawn:home" ], "seconds": 29 }, "dawn_two": { "after": [], "tells": [ "dawn_two:spark", "dawn_two:turns" ], "seconds": 14 }, "sails_far": { "after": [], "tells": [ "sails_far:seen" ], "seconds": 10 }, "run": { "after": [ "sails_far" ], "tells": [ "run:at-the-edge" ], "seconds": 12 }, "shore": { "after": [ "run" ], "tells": [ "shore:anchor", "shore:boat", "shore:water" ], "seconds": 14 }, "hands": { "after": [ "shore" ], "tells": [ "hands:close" ], "seconds": 4 }, "hands_reach": { "after": [ "hands" ], "tells": [], "seconds": 5, "show": false }, "meet": { "after": [ "hands" ], "tells": [ "meet:boat" ], "seconds": 14 }, "away": { "after": [ "meet" ], "tells": [ "away:wave" ], "seconds": 14 } },
 "points": [ "ship_rig#ship", "ship_rig#masthead", "hands#her", "hands#his", "light1#light", "light2#light", "light3#light" ],
 "offers": [ "ship_rig#ship", "kid_girl", "assol#yacht", "filipp", "skiff", "longren", "girl" ],
 "party": { "ring": "none", "ring_kind": "own", "warm": 0.5, "girl_toy": 0, "longren": "home", "ending": "grin", "morning": 0.3 }
}
```
