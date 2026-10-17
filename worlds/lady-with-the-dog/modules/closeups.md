# closeups — close-ups of hands and things

Engine 3 inserts in one manner: one flat model of a hand (`hand(g, x, y, s, rot, {palm, side, sleeve, light})`), a soft
light painted in the shot. They paint in the scene's heights (x 0…aspect, y 0…1), what matters — in the middle 4:3.

A scene's element: `{ "id": "<shot>", "insert": "<key>" }`; `elements/<shot>.js`: `e.kit.closeups.paint(g, e,
'<shot>');` · `elements/<shot>.animate.js`: `e.kit.closeups.live(e, '<shot>');`

| Shot | What | Keys (`animate`) | Points |
| --- | --- | --- | --- |
| `melon` | the table by the candle, a striped watermelon on a plate, his left hand holding it, the right with the knife | `cut` 0…1 — the knife and the line of the cut; `slice` 0/1 — the red slice | `melon#knife`, `melon#from`, `melon#to` |
| `hands` | a light bedspread, her hand on the right, his on the left | `hand_at` 0…1 — his hand to hers; `pull` 0…1 — hers drawn away; `palm` 0/1 — the palm up (0.6 s to turn) | `hands#his`, `hands#her` |
| `tea` | the samovar's brass tap, a glass in its holder on a saucer, his hand at the tap | `fill` 0…1 — the tea; `tap` 0/1 — the stream; `spill` 0…1 — the puddle; the steam drifts | `tea#tap` |
| `mirror` | a corner of the gilt frame; in the mirror the back of her fair head and her grey shoulder, his hand on the shoulder, his ear and grey temple; the lamp | the lamp trembles | — |

There is no shot `inkwell` (the town of S.).
