# spitz — the white Pomeranian and the red leash

One Pomeranian for all the world's scenes. A scene's element (not a person), painted once for a pose, moved by layers.

```json
{ "id": "spitz", "name": "Pomeranian", "across": -1.3, "distance": 3.95,
  "place": { "across": "spitz_a", "distance": "spitz_d", "elevation": "spitz_e" },
  "height": 0.45, "box": [-2.6, -2.2, 2.6, 0.3], "shadow": true }
```
`elements/spitz.js`: `e.kit.spitz.paint(g, e);` · `elements/spitz.animate.js`: `e.kit.spitz.live(e);` · the scene
names `"spitz"` in `modules`. The `box` is so wide for the leash (a layer that turns and stretches to the hand).

## Keys (the scene keeps them in `states`)

| Key | What |
| --- | --- |
| `spitz_a`, `spitz_d`, `spitz_e` | the place and the height above the ground, m |
| `spitz_view` | `side` (from the side) · `back` (from behind). `front3q` is not painted — a warning |
| `spitz_dir` | 1 — facing right, −1 — left (painted anew on a change; the scene sets it by the way it goes) |
| `spitz_do` | `stand` · `sit` · `lie` · `up` (on its hind legs) — the painting's own poses; `trot`, `run` — the pose `stand` and the legs' step; `growl`, `bark` — a jerk of the head; `sniff` — the head down |
| `spitz_look` | a point it turns its head a little toward, or `null` |
| `spitz_here` | 0/1 — whether it is there |
| `spitz_old` | 0/1 — old: its coat yellower, everything slower |
| `leash` | a hand's point (`'anna#hand_l'`) — the leash to it; `'none'` — it trails on the ground behind; `'chair'` — to the point `chair#leash` (the scene's element `chair` marks it on the armchair's back) |

Points: `spitz` (the head; a press), `spitz#collar`, `spitz#back`. The leash's colour — `kit.spitz.LEASH` (`#a8322c`).

## What is not here (yet)

- The view `front3q`; the leash's sag (a straight strap); the `scaleX` mirror by speed — the direction is the key
  `spitz_dir`.
- No glow of the leash (`emission`): an element's own shader would have to read all the layers itself; at dawn the leash
  reads without it. Night scenes — to check.
- The leash's length is not limited: the scene itself keeps the Pomeranian no more than 2 m from the hand.
