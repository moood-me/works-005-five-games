# Зал (opus)

The hall of the «Парадизо» (scenes.md «Зал»), chapters I, II, III and V. Engine 3, camera `roam`. Mood: a dark hall,
the one warm thing the beam and the screen; heads in silhouette against the film; 1988 — cold, grey, a hole in the
roof, and for five seconds the warm hall again.

## The place (metres; x across, z north toward the screen; the start at the back of the hall, in the middle)

All numbers in `lib.js` (`G`). Walls x ±6.5, back wall z −1.5, screen wall z 19, ceiling 7.4 (a card facing down).
Eight rows of 18 seats (one painted row, copies) at z 12.5 … 5.5 (row 1 nearest the screen), seats x −4.675 + 0.55·i;
side aisles at x ±5.7. The low stage z 17.2…19 (0.8 m); the screen 7 × 4 m (2.2…6.2 m up) in a proscenium with
drawn velvet curtains and «CINEMA PARADISO» over it. The stone lion on the back wall at x 2.4 (right of the middle —
so that the beam crosses the view from behind the rows instead of being seen end-on), mouth 4.6 m up; the beam is a
glowing wedge in its vertical plane from the mouth to the screen (20.44 m). The side door with the curtain: left wall,
z 5.9…7.9 (two rows behind the priest's row 5), 2.6 m high, onto a short corridor (x −6.6…−8.95, the stair light).
The priest's seat — row 5, seat 3 (x −3.0, hips z 8.82): left of the middle, so that the shot from behind the curtain
can see him at ≈ 5.9 m (the script's «в середине пятого ряда» and «≈ 3 м от двери, 1/3 кадра» cannot both hold in a
14 m hall; he is ≈ 0.2 of the frame there, seated behind seat backs).

1988 (`era` ruin): grey plaster, bare seat frames, pigeons on three backs, boarded doors, letters fallen from the
name, a torn screen, a hole in the ceiling over the left rows near row 5 — the sky through it, and a cold far light
`through` it (`hole`) that lays a patch on the left aisle where Salvatore stops. `past` 0…1 (memory) brings back,
as layers, the seats, the painted audience, the screen's film, the beam, the warm light (the look `past`).

Light: the screen's light (warm, flickering, `on` beam_on), the lion's glow, the corridor's stair light (cool, weak),
the hole (1988). Looks: `ruin_k` (the scene's from `era`), then `past` (the warm hall's own light — identity in the
old era). Прожектора-конуса в движке нет; луч — светящийся клин со светом экрана на конце.

## Shots (`script.js` CAM)

`back` — behind the last rows, left of the beam: the priest seated foreground left, the beam coming over from the
right, the screen. `curtain` — from the corridor through the door: the curtain (left), the boy from behind, the hall
and the priest through the opening. `ruin` — from the stage's foot back over the ruined rows to the lion. `lion` —
behind Salvatore, 3/4 from his right, the lion above the back wall in the middle 4:3.

## Beats

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| priest | — | `back`: the empty hall, the priest alone in row 5, the beam, `romance`; at the end a cut to `curtain` | priest:sat (3) | 14 |
| peek | priest | `curtain`, peek 0: the boy behind the curtain | — | 3 |
| bell_end | peek | the priest gets up, goes along the row and down the left aisle past the door (the boy watches him), out | bell_end:out (≈7) | 9 |
| full_hall | — | `back`, the hall full of silhouettes, `comedy`, the hall laughs (shoulders shake, waves of `laugh`) | full_hall:laugh (1) | 12 |
| first_kiss | — | `back`, full; `romance` dissolves into `romance_kiss` (3 s); the hall rises in a wave from the front rows; the priest gets up and leaves down the aisle | first_kiss:kiss (4), first_kiss:priest (9) | 20 |
| whistle | — | `back`, the hall standing with raised arms, the screen white | whistle:white (1) | 6 |
| ruin_hall | — | 1988, `ruin` shot: Salvatore comes in by the side door, walks to the aisle at row 5 into the hole's light, turns to the lion; cut to `lion` | ruin_hall:seat (≈5) | 10 |
| memory | ruin_hall | the lion's mouth flares: for ≈ 5 s the hall as it was (seats, audience laughing, beam, warm light), then back to ruin over 1.5 s | memory:warm (0.5), memory:gone (6.5) | 8 |

«Подглядывать» (game keys, any time in `peek`): `peek` > 0.5 — the boy leans out (`peek_lean`), < 0.3 — stands; the
curtain turns aside into the corridor about its jamb (`curtain_f` = 270 + 75·peek: a card turned by its place —
the curtain is opaque); `bell` → 1 — the priest's right hand goes to `aud5#ring` (a point over his shoulder that the
row-5 audience element marks and shakes for 3 s), then back; `turn` — he looks round at `curtain#gap`, 0 — at the
screen. The bell's clapper swings by itself (the cast's part `bell`).

## People

`adelfio` (cast `adelfio`: old, black cassock, grey hair, the part `bell` in the right hand), `toto` (`toto_boy`;
in 1988 `toto_wear` = the cast's `salvatore` look object — see below). Motions (cast_opus): `seated`, `rise_chair`
(«stands up from a chair», a ready motion put in), `peek_lean` (leans to the right round a wall's edge, holding it,
stays leaned — a ready motion), `stand`, `walk`.

## What is not here / found

- **`<id>_wear` with a character's name does not work in engine 3**: `people.js` spreads the value as look fields
  (`{...L0, ...wear}`), so a string changes nothing (the boy stayed a boy in 1988). The scene passes the cast's look
  object (`scene.kit.cast_opus.characters.salvatore`) — which works. people.md says a name is enough; one of the two
  should change. (The earlier «Пристань (opus)» passes names: its 1988 people are still the young ones.)
- Seen on the renders: as the priest walks along row 5 behind the closed curtain (an opaque card, nearer the
  camera), a thin outline of him shows over the curtain — the figure's line drawn where the figure is hidden.
  An engine matter (people's outlines and the depth of a card before them); the scene does nothing about it.
- No `bell_ring` motion: the fallback of the script (a reach over the shoulder, shaken by the point).
- The audience is painted (eight rows of heads and shoulders, layers lifted by `rise` with a delay per row, arms a
  layer for `standing`); the priest's seat is left empty in it.
- The hole's light shaft in the air is faint (haze 0.24, shafts 2.6): the patch on the aisle carries it.

## Контракт для проверки

```json
{"beats": {
  "priest": {"after": [], "tells": ["priest:sat"], "seconds": 14, "show": false},
  "peek": {"after": ["priest"], "tells": [], "seconds": 3, "show": false},
  "bell_end": {"after": ["peek"], "tells": ["bell_end:out"], "seconds": 9, "show": false},
  "full_hall": {"after": [], "tells": ["full_hall:laugh"], "seconds": 12, "show": false},
  "first_kiss": {"after": [], "tells": ["first_kiss:kiss", "first_kiss:priest"], "seconds": 20, "show": false},
  "whistle": {"after": [], "tells": ["whistle:white"], "seconds": 6, "show": false},
  "ruin_hall": {"after": [], "tells": ["ruin_hall:seat"], "seconds": 10, "show": false},
  "memory": {"after": ["ruin_hall"], "tells": ["memory:warm", "memory:gone"], "seconds": 8, "show": false}
},
"points": ["lion", "lion#mouth", "curtain#gap", "curtain#edge", "screen#screen", "beam#beam", "adelfio", "toto", "aud5#ring", "wall_l#door"],
"offers": ["lion"],
"party": {},
"keys": {"era": "past", "past": 1, "hall": "empty", "screen_film": "romance", "peek": 0, "bell": 0, "turn": 0, "beam_on": 1, "beat_next": ""}}
```
