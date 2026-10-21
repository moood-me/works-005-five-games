# trains

Trains painted from the side in daylight colours (the scene's light makes the night). Metres, y down, the anchor on
the rail's head under the middle.

**The freight** (+x toward the train's tail): `car(g, e, kind, len)` — a freight car: `tank`, `box`, `gondola` (open,
under snow), `flat` (logs); `len` buffer to buffer; its box `[-len/2 - 0.4, -4.9, len/2 + 0.4, 0.2]`. `loco(g, e, len)`
— a diesel's side, its headlight at the nose (−x): the point `#light` and its glow `light`. `nose(g, e)` — its front (a
card turned forward, `on` the locomotive), the lamp unlit. The scene sets the cars along its track (“The Crossing”).

**The electric train** (ER2-like: four cars of 20 m, green with a red band; +x toward its HEAD; `ELECTRIC` — its
numbers: `x0(k)`, `doors(k)`, `windows(k)`, `floor`, `inside`…). Each car `k` (0 the head … 3 the tail) is painted
in `ELECTRIC.segs` segments `j` along it, each two cards on the train's place with the box `ELECTRIC.box(k, j)`: a card
beside the eye is drawn as one passing it, and a long one there came over what is behind it.
- `electric_train(g, e, k, j)` — the side: body with windows and doorways cut through, roof, pantograph (cars 1 and
  3), bogies, the cabs; layers `leaf_l`, `leaf_r` (the doors' leaves — `doorsLive(e, doors)`), `frost`
  (`frostLive(e, frost)`); the head lamp's glow `head` (k 0), the tail lamps' `tail`, `tail_top` (k 3).
- `electric_inside(g, e, k, j)` — what the windows and doorways show, in depth: the card (`glows`) `ELECTRIC.inside`
  behind the side, the car's far side on one opaque sheet 2.35 m beyond it (its wall, windows and doors, the ceiling's
  lamps, the benches and a few passengers); a glow and a light at each window and doorway, `w<k><n>`, `d<k><n>`;
  Silva's figure in the second car's front vestibule — layer `silva` (`silvaLive(e, silva)`).
- `electric_points(e)` — for an unseen card on the train's place: `#tail`, `#head`, `#door` (the second car's front
  doorway, chest high), `#back_door`.
- `train_window(g, e, o)` — a car's inner wall round one window, from inside (a card facing into the car): `o.w`,
  `o.h`, `o.sill`, `o.wall` `[from, to]`, `o.tall`; the frost — layer `frost` (the scene's shader rubs a hole in it);
  the glass's middle `#pane`; the ceiling lamp's glow `lamp`. `partition(g, e, o)` — the saloon's end wall from inside.

**The far train**: `far_train(g, e, o)` — a train far off at night in the painting's own units: a dark band `o.len`
by `o.h`, its windows a chain of warm points (`o.cars`), a lamp at its head (−x).

Used by: “The Crossing” (the freight), “The Platform” (the electric train), “The Yard” (the far train).
