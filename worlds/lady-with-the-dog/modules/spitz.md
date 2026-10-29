# spitz — the white Pomeranian and the red leash

One Pomeranian for all the world's scenes. A scene's element (not a person), painted once for a view and a pose, moved
by its layers: the way it faces, its legs, tail and head, and the leash — no repainting while it runs about.

```json
{ "id": "spitz", "name": "Pomeranian", "across": -1.3, "distance": 3.95,
  "place": { "across": "spitz_a", "distance": "spitz_d", "elevation": "spitz_e" },
  "height": 0.45, "box": [-2.6, -2.2, 2.6, 0.3], "shadow": true }
```
`elements/spitz.js`: `e.kit.spitz.paint(g, e);` · `elements/spitz.animate.js`: `e.kit.spitz.live(e);` · the scene
names `"spitz"` in `modules`. The element's `box` is so wide for the leash; the dog's own layers have their own small
boxes. The place keys must be called `spitz_a`, `spitz_d`, `spitz_e`: `live` reads their speed for the legs and the
way it faces.

A card without `facing` stands facing the start: a scene whose camera turns far round (`camera_yaw` near ±90°) gives
the element `"place": {…, "facing": "spitz_face"}` and keeps `spitz_face` toward its camera (yaw + 180) — the scene's
business, not the module's.

## Keys (the scene keeps them in `states`)

| Key | What |
| --- | --- |
| `spitz_a`, `spitz_d`, `spitz_e` | the place and the height above the land, m (on the parapet, on a chair: `spitz_e`) |
| `spitz_view` | `side` (side on) · `front3q` (three-quarters toward us: the body shorter, the chest ruff full, the muzzle short, both eyes) · `back` (from behind). A view is a painting of its own (it changes rarely: one painting a change) |
| `spitz_dir` | which way it faces **as seen**: 1 — its head to the right, −1 — to the left, held so whatever it does (backing away, standing turned to someone); 0 (or none) — the way its place moves on the screen (`spitz_a`/`spitz_d` moving: `e.speed`), the last way kept when it stops (at first: right). Mirrored by its layers, never repainted |
| `spitz_do` | `stand` · `sit` · `lie` · `up` (on its hind legs) — the painting's own poses; `trot`, `run` — the pose `stand`, the legs stepping even on the spot; `growl`, `bark` — a jerk of the head; `sniff` — the head down. Moving (its place's speed over 0.08 m/s) its legs step in any pose but `lie`/`sit`, faster as it goes faster (1.5…4.5 steps a second) |
| `spitz_look` | a point it turns its head a little toward (up or down), or `null` |
| `spitz_here` | 0/1 — whether it is there |
| `spitz_old` | 0/1 — old: its coat yellower, everything slower |
| `leash` | a hand's point (`'anna#hand_l'`, `'maid#hand_r'`) — the leash to it; `'none'` — it trails: down to the ground a quarter metre behind it and along the ground; `'chair'` — to the point `chair#leash` (the scene's element `chair` marks it on the armchair's back) |
| `hour` | (the scene's) read only for the leash at night, below |

## Points

`spitz` (the head: its press, its lines), `spitz#head` (the same, named — for a mini-game's mark, «Подманить»),
`spitz#collar`, `spitz#back` (where it is patted). Marked by `live` every frame, where the mirror and the head's turn
have them.

## The leash

Four straps (layers `leash0…3`), laid every frame from the collar to the hand: 2 m long; nearer than that it sags in a
parabola (the sag `√(3·D·(2−D)/8)`, at most 1 m, never below its own feet: the ground, the deck, the parapet's top it stands on); a leash that looks taut while walking — the dog 1.5–1.9 m from the hand; farther it is a straight line — the scene
keeps the dog within 2 m of the hand that holds it. `#a8322c` (`kit.spitz.LEASH`), 2.7 cm wide (wider than a real one:
far off it would be thinner than a pixel), a thin light edge along it.

**At night** the straps are brighter (their `brightness` 1 by day, up to 2.2 at midnight, by `hour`) so the red stays
red where it would go black. scenes.md asked for a little `emission` from the element's own shader instead: a shader
would have to compose all the dog's layers itself and make the element see-through over its whole wide box — a cost
and a complication for a strap. Written down as a departure.

## What is not here

- No running jump: from the parapet down it goes along `spitz_e` (the scene's `scene.path`).
- The paws do not reach the ground on a slope: the dog stands on its place's height.
