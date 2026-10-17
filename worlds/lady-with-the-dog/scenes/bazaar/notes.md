# The Slavyansky Bazaar

V.3 and the ending of “The Lady with the Dog” (scenes.md, the Slavyansky Bazaar, the 4th edition). A room of a Moscow hotel on
a winter evening: the camera `picture`. In the back wall on the left a door (a leaf on hinges, a dim corridor behind it),
in the middle a gilt mirror, on the right a tall window with drapes: behind it snowy roofs, domes, a few yellow windows —
or the thaw, wet roofs and drops on the glass. A round table under a white cloth, a lamp under a silk shade (the one
warm light), two glasses; an armchair on the left, a chair at the table. Grey hair, a heavy tenderness, “the most
complicated part is only just beginning”. The Pomeranian is not here in any branch.

## How it is made

- **The room** — cards of the walls (the back one with holes for the door and the window; the front one behind the
  viewer), the ceiling, the floor. The mirror — a standing plane with `reflect`, its frame a card of its own.
- **Light**: the lamp (`lamp_l`, the point `lamp#flame`), the window's light (`window_l`). The sky behind the window is
  its own (`spring` repaints it once); the snow — particles (`snowing` = 1 − `spring`), the drops on the glass —
  particles (`spring`).
- **The table** (`table`, the plane of the cloth) paints by keys that change once: the husband's envelope by the
  samovar (`husband_knows` 0 — a light rectangle with writing), the tea stain by his hand (`stain` 1); the point
  `table#glasses` — the two glasses (the element `glasses` stands on it). `table_skirt` — the cloth's edge and the legs.
- **The points of “Taking counsel”**: `window#window`, `door#door`, `table#glasses` — all within the 4:3 window of the
  wide shot `ROOM`. `think` sets where they look (the window — he, the door — she, the table — both at the glasses,
  `none` — at each other) and keeps it to the end.
- **The door** — `door` 0…1 → the leaf's turn (`door_f`) by one function.
- **Inserts** — the module `closeups`: `tea` (`tea`; `glass_at`, `tap`, `fill`, `spill`; the envelope by
  `husband_knows`; the points `tea#glass`, `tea#under`, `tea#tap`) and `mirror` (`mirror`).
- **People**: `gurov_grey`, `anna_grey`, `waiter` (the tray with the samovar — the part `tray`, the gait `carry_tray`);
  motions `embrace_her` / `embrace_him` (+ `reach` to their backs), `weep_stand`, `sit_down`, `seated`, `rise`,
  `take_watch` (the part `watch`, the point `gurov#watch`). Faces — `anna_mood` / `gurov_mood`.
- **The film** — `lib.js` `film(scene)`, played by the module `beats`. Shots: `ROOM`, `CAGES` (from the lamp toward the
  window: the two in profile, face to face, 1.8 m; the lamp behind the camera lights both faces), `END` (drawn back,
  `camera_z` −0.6). The beats that come after different beats (`shoulders`, `tea`, `cages`) go on from where the people
  are: he rises from the table if he was sitting; goes to the window.

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `bazaar_in` | — | 10 | evening; the door opens, he comes in; `anna_life` 1 — she goes to meet him, they stand embracing by the door, her face at his shoulder (`sad`); 0 — at the window, her back to him; `husband_knows` 0 — the envelope on the table (`bazaar_in:met`) |
| `shoulders` | bazaar_in, weep | 9 | he behind her at the window, his hands on her shoulders; the insert `mirror` 4 s (`shoulders:mirror`), back |
| `tea` | bazaar_in, shoulders | 11 | the waiter brings in the samovar, sets it down, goes; he sits down at the table; the insert `tea` open |
| `weep` | tea | 10 | the insert closed: he at the table with the glass (the stain if `stain` 1); she at the window, her back to him, her shoulders shaking |
| `cages` | shoulders, weep | 14 | faces: the two at the window, she turns to him (`cages:turned`); a cut to `CAGES` — profiles in the lamplight (`sad`, `thinking`) ≈ 9 s; a cut back to `ROOM` |
| `counsel` | cages | 2 | the same — under “Taking counsel”; the camera stands, marks on the window, the door, the glasses in 4:3 |
| `bazaar_end` | counsel | 12 | the camera slowly draws back; the two stand as `think` left them; `wife_knows` 0 — at the 5th s he takes out his watch, holds it to the light, looks (`bazaar_end:watch`) |

Keys: `hour`, `tea`, `glass_at`, `tap`, `fill`, `spill`, `stain`, `mirror`, `think`, `door`, `samovar`, `beat`,
`beat_next`; the play's keys — below.

## What is not here / what to know

- `anna_life` 1: they embrace not at the very door but two steps from it, before the mirror: by the door the lamp hid
  them.
- “Draws back toward the door” — the door here is in the back wall; the camera draws back (toward the viewer).
- In `cages` the last ≈ 1 s is the wide shot (`ROOM`): “Taking counsel” puts its marks on the window, the door and the
  glasses, which the shot of the profiles does not have.
- `hour` is described, but the light is always the evening's.

## Contract for the check

```json
{"beats": {"bazaar_in": {"after": [], "tells": ["bazaar_in:met"], "seconds": 10, "show": false},
           "shoulders": {"after": ["bazaar_in", "weep"], "tells": ["shoulders:mirror"], "seconds": 9, "show": false},
           "tea": {"after": ["bazaar_in", "shoulders"], "tells": [], "seconds": 11, "show": false},
           "weep": {"after": ["tea"], "tells": [], "seconds": 10, "show": false},
           "cages": {"after": ["shoulders", "weep"], "tells": ["cages:turned"], "seconds": 14, "show": false},
           "counsel": {"after": ["cages"], "tells": [], "seconds": 2, "show": false},
           "bazaar_end": {"after": ["counsel"], "tells": ["bazaar_end:watch"], "seconds": 12, "show": false}},
 "points": ["window#window", "door#door", "table#glasses", "tea#glass", "tea#under", "tea#tap"],
 "offers": ["window#window", "door#door", "table#glasses"],
 "party": {"anna_life": 0, "husband_knows": 0, "wife_knows": 0, "spring": 0}}
```
