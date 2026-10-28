# closeups — hands and things close up (engine 2)

Five shots for the world's scenes' inserts (`insert`): `scrap`, `hold`, `cellar`, `ropes`, `boat`. No faces. The hand is one model
for all the shots, flat, in the manner of the hand of the shot `rig` of “Longren's House”. `hold` and `boat` are painted with finish (the light on
every finger, the nails, the creases of the joints, the glint on the ring), the other three — simply.

The painting is done once a shot. All that moves is layers moved by `live()`; the painting reads nothing of `now`.

## How a scene shows a shot

```json
{ "id": "hands", "name": "Hands", "insert": "hands",
  "code": "e.kit.closeups.paint(g, e, \"hold\")",
  "animate": "const S = e.state; e.kit.closeups.live(e, \"hold\", { grip: [S.grip1, S.grip2, S.grip3, S.grip4] })" }
```

- **`paint(g, e, shot)`** — the insert's `code`. `shot` — the shot's name, a string: `"scrap"`, `"hold"`, `"cellar"`, `"ropes"`,
  `"boat"`. The painting reads none of the scene's keys — except the shot `boat`: it reads `e.state.ring` and `e.state.ring_kind`
  (they change at once).
- **`live(e, shot, now)`** — the insert's `animate`. `now` — a plain object; its fields are named as in the table below (the scene's numbered
  keys — as an array: `grip` ← `grip1…grip4`). The keys the game moves every frame are read by it alone.
- An insert opens with a cut (`s.shot({ hands: 1, … })` → `cut()`), with no fades; the insert's key is the scene's.
- The shot's units are the frame's height, the origin at its middle (x −0.89…0.89, y −0.5…0.5); in the scene the shot takes the whole scene.

## The shots

| `shot` | What is in the shot | `now` | Points (on the insert's element) |
| --- | --- | --- | --- |
| `scrap` | a workbench, the lamp's light from the right, a scarlet scrap in the middle, a child's hand from below | `taken` 0…1: up to 0.6 the fingers lie on the scrap, then they close on it (the scrap gathers) | `scrap` — the middle of the scrap |
| `hold` | the palm of Gray as a boy (on the left, palm up) with a ring on it, over it, across his fingers, his mother's four fingers; a candle on the left, a glint on the ring | `grip` — `[4]`, each 1…0: the finger holds → let go (it straightens, lifts, its shadow moves away); the order — from left to right | `finger1`…`finger4` — the middles of her fingers, from left to right |
| `cellar` | the bottom of a cask by candlelight (on the left), words in three lines “Gray shall drink me / when he is / in paradise”, the boy's hand | `dust` 1…0: the dust wiped off — three passes of the hand, line after line | `barrel` — the middle of the bottom |
| `ropes` | three tarred shrouds with ratlines, the ship's boy's two hands on the outer ones, the sky and the sea behind them | `climb` 0…1 — the ratlines go down (12 hand-over-hands); `left`, `right` 0/1 — the hand closed (0 — raised and open; the key jumps, the hand follows it by itself); `roll` −1…1 — the horizon heels (up to 8°); `slip` 0…1 — the hands slide and tremble | `left`, `right` — the palms (they move with the hands) |
| `boat` | on the left Gray's hand out of the skiff (a blue sleeve, palm up), on the right Assol's hand; the skiff's side low on the left, water, a low sun behind, between the hands a scarlet gleam on the water | `reach` 0…1 — her hand on its way to his (along a line from the start to his palm, with a small arc); from 0.8 his thumb lies on her fingers | `her` — her hand (the base of the fingers: what lies in his palm; it moves), `his` — his palm; at `reach` 1 they meet |

The insert's name with no point (`hands`, `card`…) is the main thing in the shot: the scrap, the ring on the palm, the cask's bottom, the middle of the shot at the shrouds,
the middle between the hands in the skiff.

- **The ring in `boat`** — on Assol's ring finger, only with `ring` = `finger`: `ring_kind` `mother` — thin, with a
  stone; `own` — old, broad. With `cord` and `none` there is none on the hand (the cord is out of the shot).
- **The ring in `hold`** — his mother's, lying in his palm.
- The points that move (`finger1…4`, `left`, `right`, `her`) are set by `live` every frame; the rest — by the painting.
  All of them — only while the insert is open.

## Where the points stand (the scene, frame heights; the whole frame)

`scrap#scrap` (0.89, 0.48). `finger1…4` at `grip` 1: (0.74, 0.58), (0.81, 0.63), (0.89, 0.62), (0.97, 0.56) — between
neighbours ≈ 0.08. `barrel` (0.95, 0.50). `left` (0.41, 0.61), `right` (1.37, 0.51); a raised hand — 0.16 higher.
`his` (0.54, 0.59); `her` at `reach` 0 — (1.38, 0.39). All within the middle 4:3.

## The layers (what `live` moves)

- `scrap`: `lamp` (the light, breathing), `scrap`, `open`, `closed` (the hand open and closed: one replaces the other).
- `hold`: `glow`, `his`, `ring`, `glint`, `shadow1…4`, `her` (the back of her hand and the sleeve), `finger1…4`, `finger1…4_open`.
- `cellar`: `dust0…2` (the dust by lines: it goes from edge to edge), `hand`, `flame`.
- `ropes`: `horizon` (the sky and the sea, heeling), `rigging` (the shrouds and the ratlines, the same from ratline to ratline — they slide
  down without end), `left_grip`, `left_open`, `right_grip`, `right_open`.
- `boat`: `scarlet` (the gleam, rippling), `his`, `her`, `glint` (if the ring is on the finger), `his_thumb`.

## The hand

One function `hand` (inside the module): the wrist, where the fingers point, the length, the side (a mirror), the view (`back` — from the back,
`palm` — from the palm), each finger's bend 0…1 (a bent finger is shorter in a flat painting; bent beyond a right angle it is not seen from the
back, from the palm it lies over it), the fan, the thumb, the skin, a sleeve with a cuff, a ring on a finger, `fine` —
the finish, `parts` — which parts to paint (a finger — a layer of its own). The skin is the cast's colours (`assol_child`, `assol`, `grey`,
`grey_teen`, `grey_boy`, `lilian`). There is one light in a shot, painted in the picture: an insert is a picture by itself, the scene's light does not
fall on it.

## The cost

A shot is painted once (before the cut to it: `s.shot(…)` makes it ready); while it is on, the code does not paint it — `live` gives the layers
numbers. Only `boat` is painted anew — when `ring` or `ring_kind` changes.
