# cast — the people of “The Lady with the Dog”

The people — figures of shapes in the world's style `lady`: the engine's `soft`, a little longer (head 1.26, neck 0.42,
legs 0.96), the face `simple` (eyes, brows, nose, mouth; the expression — the key `<id>_mood`: `neutral`, `smile`,
`laugh`, `sad`, `angry`, `surprised`, `afraid`, `disgusted`, `thinking`, `tired`). The paint `toned` — chosen from test
pictures of the room in Yalta (a candle, night) and the station (`rim` made Anna and Gurov dark silhouettes: the white
dress did not read). `lady_narrow` — the same style with a narrow long head (von Diderits and the `stranger` who looks
like him). The colours are faded: white, grey-blue, sand, graphite; no red, but the messenger's cap (`redcap`) and the
watermelon (`plate`).

In a scene: `"modules": ["cast"]`, a person has `"person": {"cast": "cast", "who": "<look>"}`. A look on a cut —
`<id>_wear` = the look's **object**: `scene.kit.cast.characters.gurov_winter` (the engine does not read a string). Parts
in the hands — `<id>_with: ["watch"]`, `null` — the look's own parts. The parts' lengths — a man's metres × `F.fit.h`.

## Looks (`characters`, 48)

| name | who | what it is, what is seen |
| --- | --- | --- |
| `gurov_summer` | Gurov, Yalta | big (height 1.03, head 1.08), a moustache; a light summer suit, a boater (`boater`) |
| `gurov_indoor` | Gurov without a hat | the same suit, the moustache; in the theatre the scene gives a dark frock coat through `colors` ({`garment`: '#34353d', `bottom`: '#2f3036'}) |
| `gurov_winter` | Gurov, winter | a dark fur coat, a fur collar (`fur_collar`), a fur hat (`fur_hat`), the moustache |
| `gurov_grey` | Gurov, the Slavyansky Bazaar | a dark frock coat, no hat, greying hair, the moustache |
| `anna_summer` | Anna, Yalta | short (0.92), fair-haired (light brows), a white dress, a béret (`beret`) |
| `anna_hairdown` | Anna in her room | the same dress, her hair down (`long`) |
| `anna_travel` | Anna, the station | a grey-blue travelling dress, a toque (`toque`) |
| `anna_autumn` | Anna, S., autumn | a dark coat, the toque, dark gloves (`gloves`) |
| `anna_winter` | Anna, S., winter | a pale grey fur coat, a white fur cap (`fur_cap`); the scene gives the muff: `anna_with: ["muff"]` (its fur — the cap's colour) |
| `anna_theatre` | Anna at the theatre | a light grey evening dress, a light shawl (`scarf`) |
| `anna_grey` | Anna, the Slavyansky Bazaar | a grey dress, no hat |
| `diderits` | von Diderits at the theatre | `lady_narrow`; very tall (1.12), thin; side-whiskers, a pince-nez; a tail coat, a white shirt front, a scholarly badge (`badge`, the point `#badge`) |
| `diderits_coat` | the same at the gate | a coat, a peaked cap with a cockade (`cap_cockade`), side-whiskers, the pince-nez |
| `wife`, `wife_shawl` | Gurov's wife | tall (0.99), dark hair in a knot, the face `level` (straight dark brows), a dark dress; `wife_shawl` — with a shawl |
| `daughter` | his daughter, 12 | `child` 0.84; a school coat, a capote (`capote`); the satchel — `daughter_with: ["satchel"]` |
| `official` | the official | stout (1.32), a fur coat, a fur collar, a fur hat |
| `maid` | the old maid | `old`, a kerchief (`kerchief`), a dark dress and jacket, a light apron (`apron_front`) |
| `watchman` | the keeper | `grandpa`, a peaked cap, a coat, a stick (`stick`) |
| `redcap` | the messenger | a dark coat, a **red** cap |
| `waiter` | a waiter, Moscow | a tail coat, a white shirt front; the tray — `waiter_with: ["tray"]` |
| `waiter_summer` | a waiter, Yalta | a white jacket, a long white apron |
| `yardman` | a yard porter | `janitor`: a sheepskin coat (the top), a light apron, a peaked cap |
| `boy` | a hotel boy | `child` 0.8, a short jacket, a peaked cap |
| `conductor` | the conductor (far off) | a uniform, a peaked cap; the lantern — the part `lantern` |
| `cabman` | a cabman (far off) | a dark coachman's coat (`robe`), a low hat |
| `p1`…`p6` | arrivals on the pier | `p1`, `p3`, `p5` — ladies (toques; light / grey-blue / sand), `p2`, `p4`, `p6` — gentlemen (a boater, a hat, a peaked cap); bouquets and valises — `pN_with: ["bouquet"]` / `["valise"]` |
| `stranger` | the tall stooping man | `lady_narrow`, 1.10, side-whiskers, a light coat, a hat — from far off like von Diderits |
| `stranger_lady` | his lady | a lilac-grey dress, a toque |
| `stroller1` | a lady out walking | a light dress, a toque, a light parasol (`parasol` — part of the look) |
| `stroller2` | an officer | a white tunic, a peaked cap with a cockade, a moustache |
| `stroller3` | an old man | a light jacket, a boater, a stick |
| `shade1` | a shadow: older, stooping | `old` 0.86, a dark coat, a kerchief, a stick (`stick`) |
| `shade2` | a shadow: in dark clothes | 0.9, a dark fur coat, a fur cap; the muff — `shade2_with: ["muff"]` |
| `shade3` | a shadow: with a parcel | 0.9, a grey-lilac coat, a toque; the parcel — `shade3_with: ["parcel"]` |
| `shade4` | a shadow: taller, a light fur coat | 0.98, a light fur coat, a light fur cap |
| `lady1`…`lady5` | ladies at the theatre | dark evening dresses: dark blue, brown, black, maroon-brown, dark green |
| `schoolboy1`, `schoolboy2` | schoolboys | `youth`, grey greatcoats, peaked caps with cockades |

## Hats (`hats`, the world's own)

`beret` a béret · `toque` a toque · `boater` a boater · `fur_hat` a fur hat (a man's) · `fur_cap` a fur cap (a
woman's) · `capote` a capote · `kerchief` a kerchief · `cap_cockade` a peaked cap with a cockade. The engine's: `cap` a
peaked cap, `hat` a hat.

## Parts (`parts`) and their points

A part's point is the person's point (`"anna#lorgnette"`): for a look, a hand, the camera, the game's mark; there while
the part is with them.

| part | what | point |
| --- | --- | --- |
| `spitz_held` | the white Pomeranian in both arms at her breast (a ball, the head, ears, nose) | `#spitz` (its head) |
| `lorgnette` | a lorgnette in the right hand: a handle and two lenses | `#lorgnette` (the lenses) |
| `parasol` | a light parasol: the stick up from the right hand, the canopy over the head | `#parasol` |
| `lantern` | the conductor's lantern in the right hand, its glass glowing | `#glass` |
| `plate` | a plate with a red slice of watermelon in both hands | `#plate` |
| `coat_carried` | a man's coat over the left arm | — |
| `bouquet` | a bouquet of white and yellow flowers in the right hand | `#bouquet` |
| `letter_paper` | an open letter in both hands at the breast, toward the eyes | `#letter` |
| `valise` | a valise in the right hand | — |
| `bag` | a travelling bag in the left hand | — |
| `tray` | a brass tray with the samovar in both hands | `#tray` |
| `stick` | a stick in the right hand down to the ground | — |
| `satchel` | a satchel on the back | — |
| `note` | a note in the right hand | `#note` |
| `muff` | a fur muff between the hands (the colour of the look's cap) | `#muff` |
| `parcel` | a parcel from a shop in both hands at the breast | `#parcel` |
| `coat_over` | a man's coat over her shoulders (graphite), open in front | — |
| `envelope` | a light envelope in the right hand | `#envelope` |
| `watch` | Gurov's pocket watch in the right hand, its face to his eyes, the chain to the waistcoat | `#watch` |
| `moustache` | a moustache (the hair's colour) | — |
| `sideburns` | side-whiskers (the hair's colour) | — |
| `pince_nez` | a pince-nez: thin dark rims and a bridge | — |
| `badge` | a scholarly badge on the breast of the tail coat, a light glint | `#badge` |
| `fur_collar` | a fur collar (the colour `accent`) | — |
| `apron_front` | an apron in front from the waist to the knees (the colour `accent`) | — |
| `gloves` | dark gloves | — |

The engine's own points of a person — `head`, `hand_r`, `hand_l`, `hands`, `chest`, `hips`, `shoulder_r`,
`shoulder_l`, `back`, `nape`, `foot_r`, `foot_l`, `feet`.

## Motions (33, in cast.data.json; `stand`, `walk` — the engine's)

From the seed: `seated`, `rise`, `sit_down`, `seated_bowed`, `eat_slow`, `hold_dog`, `embrace`, `weep_stand`,
`carry_tray`. From the cast of “Scarlet Sails v3”: `run` (running, a loop; their `run`), `read_letter` (their
`read_stand`: reads standing, a loop, 10 s). New (Kimodo's, looked at on a figure): `wag_finger` (sitting, the right hand
forward, shaking a finger — at middle height, not low), `pat_low` (sitting, bends and pats at the floor before him),
`beckon_low` (standing, bends, the hand to the ground), `bend_take` (bends, picks up with the left), `lorgnette_up` (the
right hand to the eyes and holds — the hand hides part of the face), `embrace_him`, `embrace_her` (a step forward, the
arms forward at shoulder height — the embrace finished by `reach` to `#back`/`#nape`), `give_small`, `take_small` (with
the right hand at waist height), `step_back` (a step back, the hands to the breast), `bow_walk` (a stooping slow walk,
the head lowered, 0.85 m/s — the model gave no bow at every step: the script's fallback) and `bow` (a deep bow on the
spot — “a bow by the armchair”), `stroll` (a gait of 1.30 m/s on a man = Anna's pace with the engine's walk),
`walk_child` (a short step, 1.11 m/s = the daughter's pace with the engine's walk), `laugh_stand`, `kiss_hand` (takes the
hand, bows, straightens), `walk_fast` (a fast walk, 1.9 m/s), `pulled_walk` (fast, the right arm stretched forward — at
breast height, not down), `carry_walk` (with something heavy in the right hand, 0.85 m/s), `lean_rail` (leaning
forward, the elbows on a counter/railing, the head down; the knees bent more than they should be — the best of three
tries), `stand_cold` (the hands at the breast, the head lowered — almost no shifting from foot to foot), `take_watch`
(the right hand to the breast before him and holds — does not raise it to the eyes: look with `look` at `#watch`).

Not checked in a scene: `stroll`/`walk_child` beside Anna and the daughter (the pace worked out from the looks' height
and legs, not filmed).
