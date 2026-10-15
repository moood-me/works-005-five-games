# Зал

The hall of the «Парадизо» (scenes.md «Зал»), chapters I, II, III and V. Engine 3, camera `roam`. Begun as «Зал
(opus)», brought to the 4th edition. Mood: a dark hall, the one warm thing the beam and the screen; heads in
silhouette against the film; 1988 — cold, grey, a hole in the roof, and for five seconds the warm hall again.
Modules: `cast`, `kino` (the screen's frames, the beam), `nebo` (the sky in the hole), `beats` (the film).

## The place (metres; x across, z north toward the screen; the start at the back of the hall, in the middle)

All numbers in `lib.js` (`G`). Walls x ±6.5, back wall z −1.5, screen wall z 19, ceiling 7.4 (a card facing down).
Eight rows of 18 seats (one painted row, copies) at z 12.5 … 5.5 (row 1 nearest the screen), seats x −4.675 + 0.55·i;
side aisles at x ±5.7. The low stage z 17.2…19 (0.8 m); the screen 7 × 4 m (2.2…6.2 m up) in a proscenium with
drawn velvet curtains and «CINEMA PARADISO» over it. The stone lion on the back wall at x 2.4 (right of the middle —
so that the beam crosses the view from behind the rows), mouth 4.6 m up; the beam (`kino.beam`, the world's shader)
from the mouth to the screen (20.44 m), the warm light on its tip at the screen. The side door with the curtain: left
wall, z 5.9…7.9 — two rows behind the priest's row 5 — onto a short corridor (x −6.6…−8.95). The curtain hangs on the
hall's side, 2 m wide (z 5.7…7.7), closing the door but for a slit at the north jamb, and gathers toward its south end
as `peek` grows (a layer scaled; its edge the point `curtain#gap`). The priest's seat: row 5, the second from the left
aisle (x −4.125, hips z 8.82) — ≈ 3 m from the door.

1988 (`era` ruin): grey plaster, bare seat frames, pigeons, boarded doors, a torn screen (`screen_frame`), a hole in
the ceiling over the left rows near row 5 — the world's sky through it (nebo; the hall's `ruin` is the sky's `now`),
and a cold far light `through` it that lays a patch on the left aisle where Salvatore stops. `past` 0…1 (memory) brings
back, as layers and glows, the seats, the painted audience, the screen's film, the beam, and a warm light on his face
(`memory_light`).

Light: the screen's light (warm, flickering, `on` beam_on), the lion's glow, the corridor's light, the stair light,
the hole (1988), `memory_warm`. Looks: `ruin_k` (the scene's from `era`), then `past`. Прожектора-конуса в движке
нет; луч — светящийся клин со светом на кончике (`kino.beam`).

## Shots (`lib.js` CAM)

`BACK` — behind the last rows, left of the middle: the priest left of the middle (≈ 5.6 m), the beam over the heads
from the right, the screen. `CURTAIN` — from the corridor behind the curtain (−7.9, 5.6; yaw 45): the curtain covers
the right ⅔ of the frame at `peek` 0; the boy from behind at the north jamb, left of the middle (≈ 2 m); `peek` 1 —
the hall opens: the priest from behind right-front (≈ 5 m, seated ≈ 0.3 of the frame), the screen beyond at the
jamb. `RUIN` — from the stage's foot back over the ruined rows. `LION` — from the aisle at row 5 back: Salvatore
right, from behind 3/4, the lion over the back wall in the middle 4:3. `FACE` — in front of Salvatore to his left
(≈ 2 m): his face 3/4 in the warm light of the memory.

## Beats (`lib.js` FILM; the world's `beats`)

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| priest | — | `BACK`: the empty hall, the priest alone in row 5, the beam, `romance`; at the end a cut to `CURTAIN` (made ready) | priest:sat (3) | 14 |
| peek | priest | `CURTAIN`, peek 0: the boy behind the curtain | — | 3 |
| bell_end | peek | the priest gets up (`rise_chair`), goes down the left aisle past the door (the boy watches him), out at the back | bell_end:out (≈6) | 11 |
| full_hall | — | `BACK`, the hall full of silhouettes, `comedy`, the hall laughs (shoulders shake) | full_hall:laugh (1) | 12 |
| first_kiss | — | `BACK`, full; `romance` dissolves into `romance_kiss` (3 s); the hall rises in a wave from the front rows; the priest gets up and leaves down the aisle | first_kiss:kiss (4), first_kiss:priest (9) | 18 |
| whistle | — | `BACK`, the hall standing with raised arms, the screen white | whistle:white (1) | 6 |
| ruin_hall | — | 1988, `RUIN`: Salvatore comes in by the side door, walks to the aisle at row 5 into the hole's light, turns to the lion (`sad`); cut to `LION` — the pose under the touch | ruin_hall:seat (≈7) | 10 |
| memory | ruin_hall | the lion's mouth flares, the hall as it was (layers); cut to `FACE`: his face warm, `smile`; at ≈ 5 s back to ruin over 1.5 s, `sad` | memory:warm (0.5), memory:gone (≈6.4) | 8 |

«Подглядывать» (game keys, any time in `peek`): `peek` — the curtain gathers (its own animate); > 0.5 — the boy
steps into the slit, no steps (the cast's `peek_lean` barely leans — not used), < 0.3 — back; `bell` → 1 — the
priest's right hand to `aud5#ring` (a point over his shoulder the row-5 audience element shakes for 3 s) and
`bell_ring` played once, then `seated` again; `turn` — he looks round at `curtain#gap`, 0 — at the screen. The bell's
clapper swings by itself (the cast's part `bell`).

## People

`adelfio` (cast `adelfio`: old, black cassock, grey hair, the part `bell`), `toto` (`toto_boy`; in 1988 `toto_wear` =
the cast's `salvatore` look object). Motions: `seated`, `rise_chair`, `bell_ring`, `stand`, `walk`. Moods: the boy
`surprised` behind the curtain; Salvatore `tired` → `sad` → `smile` (memory) → `sad`.

## What is not here / found

- The priest is ≈ 5 m from the camera of `CURTAIN`, not 3.5 (scenes.md): from behind the curtain, at the door, 3.5 m
  would put him in the aisle or behind the boy; he is ≈ 0.3 of the frame seated, as asked, and ≈ 3 m from the door.
- As a seated person is drawn behind cards nearer the camera (the seat backs, the closed curtain), a thin outline of
  him shows over them — the engine's lines drawn where the figure is hidden. The scene does nothing about it.
- `bell_ring` raises the hand only to the shoulder: the reach to a point over the shoulder carries it higher.
- The audience is painted (eight rows of heads and shoulders, layers lifted by `rise` with a delay per row, arms a
  layer for `standing`); the priest's seat is left empty in it.

## Контракт для проверки

```json
{"beats": {
  "priest": {"after": [], "tells": ["priest:sat"], "seconds": 14, "show": false},
  "peek": {"after": ["priest"], "tells": [], "seconds": 3, "show": false},
  "bell_end": {"after": ["peek"], "tells": ["bell_end:out"], "seconds": 11, "show": false},
  "full_hall": {"after": [], "tells": ["full_hall:laugh"], "seconds": 12, "show": false},
  "first_kiss": {"after": [], "tells": ["first_kiss:kiss", "first_kiss:priest"], "seconds": 18, "show": false},
  "whistle": {"after": [], "tells": ["whistle:white"], "seconds": 6, "show": false},
  "ruin_hall": {"after": [], "tells": ["ruin_hall:seat"], "seconds": 10, "show": false},
  "memory": {"after": ["ruin_hall"], "tells": ["memory:warm", "memory:gone"], "seconds": 8, "show": false}
},
"points": ["lion", "lion#mouth", "curtain#gap", "curtain#edge", "screen#screen", "beam#beam", "beam#tip", "beam#mouth", "adelfio", "toto", "aud5#ring", "wall_l#door"],
"offers": ["lion"],
"party": {},
"keys": {"peek": 0, "bell": 0, "turn": 0, "screen_film": "romance", "beat_next": ""}}
```
