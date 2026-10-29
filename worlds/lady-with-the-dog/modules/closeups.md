# closeups — close-ups of hands and things

Engine 3 inserts in one manner: one flat model of a hand (`hand(g, x, y, s, rot, {palm, side, sleeve, light})`), a soft
light painted in the shot. They paint in the scene's heights (x 0…aspect, y 0…1), what matters — in the middle 4:3
(x 0.222…1.556 on the 16:9 stage); the cloth, the table, the wall go on to 21:9 and past.

A scene's element: `{ "id": "<shot>", "insert": "<key>" }`; `elements/<shot>.js`: `e.kit.closeups.paint(g, e,
'<shot>');` · `elements/<shot>.animate.js`: `e.kit.closeups.live(e, '<shot>');` — the element's id is the shot's name
(its points are `<shot>#…`). The keys below are the scene's: it describes them in `states`.

| Shot | Scene | What | Keys (`animate`, unless said) | Points |
| --- | --- | --- | --- | --- |
| `melon` | the room in Yalta | the table by the candle, a striped watermelon on a plate, his left hand holding it, the right with the knife | `cut` 0…1 — the knife and the line of the cut; `slice` 0/1 — the red slice; `ragged` 0/1 — **painted** (changes once): the slice cut unevenly, its edge stepped, a tooth standing out | `melon#knife`, `melon#from`, `melon#to` |
| `hands` | the room in Yalta | a light bedspread, her hand on the right, his on the left | `hand_at` 0…1 — his hand to hers; `pull` 0…1 — hers drawn away; `palm` 0/1 — the palm up (0.6 s to turn) | `hands#his`, `hands#her` |
| `tea` | the Slaviansky Bazaar | the samovar's brass tap, a glass in its holder on a saucer, his hand at the tap's key | `glass_at` 0…1 — the glass with its saucer, its tea, its spill and its steam from its place on the cloth to the left (0) to under the tap (1); `fill` 0…1 — the tea; `tap` 0/1 — the stream; `spill` 0…1 — the puddle on the saucer; the steam drifts; `husband_knows` — **painted**, the party's: 0 — the husband's envelope lies on the cloth to the right (“To Anna. For the professor” — a few lines of his writing, not legible), 1 — none | `tea#glass` (the glass, where it is now), `tea#under` (its place under the tap: where `tea#glass` is at `glass_at` 1), `tea#tap` (the tap's key) |
| `mirror` | the Slaviansky Bazaar | a corner of the gilt frame; in the mirror on the left his face three-quarters, turned to her — brow, nose, moustache, the hair greying, grey at the temple — lit by the lamp from the right; his hand on her grey shoulder; the back of her fair head on the right | the lamp and its warmth on his face tremble (`flicker`) | — |
| `inkwell` | the town of S. | the grey soldier's cloth of the hotel table; a dusty bronze inkwell: two ink pots on a plinth, between them a horseman on a standing horse, his right hand raised with a hat in it, his head broken off (a jagged stump); a grey light from the window on the left | a few motes drift in the light | — |

All points are in the middle 4:3, out of its top 0.12 and bottom 0.15: `tea#glass` at `glass_at` 0 is 0.46 stage
heights left of `tea#under`.

## What is not here

- Nothing of the old engine; no shot is a person: faces close are the scenes' own cameras on their people.
