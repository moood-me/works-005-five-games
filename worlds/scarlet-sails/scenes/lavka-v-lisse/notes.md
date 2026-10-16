# A Shop in Liss — engine 2

The shop from inside, morning (`hour` 0.4). Light, fine, pearly; the warm thing is the sun's beam; the scarlet — only the roll `scarlet` and the scrap
(the inserts). The other rolls are shades of the same colour, not scarlet; on the shelves and the signs there is no red at all. The camera `picture`:
the viewer by the back wall, looking at the counter. The sky, the hour's light — the world's module `nebo`; the people — `cast`; the film — `beats`;
the scrap's insert — `closeups` (the shot `scrap`).

The game plays the beats one at a time (the key `beat` = a name; once it has ended the scene tells `beat:<name>`); outside the game — `showcase.js`: all the beats
in the order of `lib.js ORDER` and after `silk` — what “Scarlet” does (the rolls one after another, up to the scarlet one).

## The space (metres: X to the right, Z forward, H up; the viewer at X 0, Z 0)

The shop X −2.6…2.6, Z −0.6…6, the ceiling 3. The far wall (Z 6): shelves to the ceiling in the middle (X −1.5…1.5), on the right a door
(X 1.55…2.45, 2.15 high) onto the sunny street. The left wall (X −2.6): a big window (Z 3.2…5.4, H 0.95…2.6) onto the street —
in the window the low shops opposite and the sky are seen. The counter X −0.9…1.3, Z 4.45…5.05, its top 0.95; over it a hanging shelf
(`rack`, H 2.05). Behind the counter the merchant (Z 5.3), before it — the customers (Z ≈ 3.9).

| Element | What |
| --- | --- |
| `sky` | the world's sky (nebo), the sun on the left behind the window's wall; the shader `sky.wgsl` is written by `node tools/nebo-sky.js lavka-v-lisse` |
| `street`, `row_left`, `row_far` | the street (a plane a little below the floor) and the low shops opposite — in the window and in the door |
| `floor`, `ceiling`, `wall_back`, `wall_left`, `wall_right`, `wall_front` | the floor, the ceiling with beams, the walls (`wall_back` with the doorway, `wall_left` with the window) |
| `window`, `opening`, `doorway` | the window's frame (the point `window#window`); the unseen openings of the window and the door — the daylight comes in through them |
| `shelves`, `rack`, `counter`, `counter_top` | the shelves, the hanging shelf, the counter; what is on them — by `goods` |
| `basket` | Assol's basket on the counter (`basket` 0/1, `basket_d` — in depth), the point `basket#basket` |
| `roll` | a roll of silk: a pair of layers for each colour (the wound roll and the cloth let down); which colour is seen — `roll`, where it is — `roll_at` |
| `merchant`, `assol`, `grey`, `letika`, `violinist` | the people (`cast`): the merchant; Assol (`assol_child`, at seventeen `assol_wear`); Gray; Letika; Zimmer in the street (`zimmer`, the part `violin`) |
| `motes` | motes in the beam |
| `memory` | an insert: the scrap filling the frame (in the game's “Scarlet” the scrap's sample is on the mini-games' language's plate) |

## The roll and its colour

The roll is one element (`roll`), a card by the people or at its place of rest; the painting reads only the layers, `animate` (`rollMotion`)
shows one colour, lets the cloth down by `roll_out` (to the window, to the left of the hands) and puts the press point `roll` on the cloth.
`roll_at` (set at once): `rack` — on the hanging shelf, `merchant` — in the merchant's hands, `counter` — on the counter,
`grey` — in Gray's hands (it follows the point `grey#hands`; if whoever holds it is not in the scene, the roll stays where it was); the script (`script.js`) keeps `roll_a`, `roll_d` — the card follows
its owner. The order and the colours (the game shows them in this order): `cherry` #8b1d3d (darker and bluer than scarlet), `pink` #eaa0ad
(paler), `crimson` #a8182e (darker), `brick` #b8472f (browner), `scarlet` — `nebo.SCARLET` #d4283a, `raspberry`
#cf2a63 (bluer), `carrot` #e2662a (yellower). The roll's scarlet at `roll_out` 1 is the light of the sun and the window on the cloth (`translucent`
0.6); the scrap is painted by the module `closeups` in its own light. The likeness “by eye” is not measured — look at the sheets `silk` (`scarlet`)
at `roll_out` 1 and at the plate.

`found` 0→1 — the light `silk_glow` (the glow of the scarlet cloth's layer) falls on Gray's hands and frock coat.

## The inserts

`memory` — `closeups` the shot `scrap`, `taken` always 1, filling the frame. It opens by a cut (`s.shot` → `cut()`), with no
fades.

## The beats (lib.js film)

`from` — all that the beat begins with (a cut, if it does not come after its `after`). The moments are told by the scene
(`<beat>:<moment>`). Seconds — the pauses; people go and make their motions as long as these last. The constants
`PUT_UP_LET_GO`, `PUSH_AWAY_PUSHED`, `TAKE_DOWN_TAKEN`, `TAKE_DOWN_LAID` (lib.js) — guesses at the second in which the motions
`put_up`, `push_away`, `take_down` let the thing go; to be checked against the finished motions (`look_at_motion`).

| Beat | What | Tells |
| --- | --- | --- |
| `toys_in` | `goods` `toys`. Assol (8) puts the basket on the counter (`put_up`); the merchant sorts through it (`sort`), shakes his head (`shake_head`), pushes the basket away (`push_away`); she takes it and stands | `toys_in:no` |
| `toys_again` | nine years later; the merchant sits behind the counter, his head down; Assol (17) with a basket comes in at the door and stops in the doorway; he raises his head | `toys_again:looks` |
| `silk_in` | `goods` `silk`; Gray comes in, Letika stays by the door; the merchant takes a roll down from the hanging shelf (`take_down`), puts it on the counter; Gray takes it | `silk_in:first` |
| `memory` (after `silk_in`) | a cut into the insert `memory` for 3 s, and back | `memory:corner` |
| `silk` (after `memory`) | Gray carries the roll to the window, stands in the beam (`hold_up`); the merchant turns to the shelves. Under “Scarlet” | `silk:ready` |
| `found` (after `silk`) | the camera close behind Gray (`FOUND_CAM`: `camera_x` −1.3, `camera_z` 1.6): he from behind and from the side; the merchant still; `found` 0→1 | `found:glow` |
| `violin` (after `found`) | the camera back (to `SILK_CAM`); outside the window the violinist stands (`violinist` 1); Gray turns to the window, then to Letika | `violin:heard`, `violin:letika` |

The key `roll` is set by the beat `silk_in` itself (`cherry`: the game's first roll; the game sets the same in its first round). `found` and
`violin` begin with the scarlet roll let down to the window (`roll` `scarlet`, `roll_out` 1) — as the game leaves it after “Scarlet”.

The beats' cameras (`lib.js`, set in `from`): `toys_in` — `TOYS_IN_CAM` (`camera_x` 1.2, `camera_z` 2.1, `camera_yaw` −30):
across the counter from its right end, Assol (X −0.69, Z 4.05, turned 40° to the basket) from the side, the merchant facing us;
`toys_again` — `TOYS_AGAIN_CAM` (0.9, 2.8): nearer, the door and the counter; the silk beats — `SILK_CAM` (−0.5, 0.6): a step to the left,
the merchant not hidden by Gray (who is at the counter at X 0.75). At the window Gray is turned to the window (`TO_WINDOW` 310): from behind and from the side.

## Keys

Described in the scene's `states`. For the game: `hour`; `goods` (`toys` · `silk`, by a cut); `roll` (`none` · `cherry` · `pink` ·
`crimson` · `brick` · `scarlet` · `raspberry` · `carrot`, at once); `roll_out` 0…1; `found` 0…1; `violinist` 0/1;
`memory` 0/1 (by a cut); `beat`. There are no play's keys. Internal (the script, the beats): `roll_at`, `roll_a`,
`roll_d`, `basket`, `basket_d`, `mer_*`, `as_*`, `gr_*`, `le_*`, `vi_*`, `day`, `dawn`, `dusk`, `night`, `sun_light`, `moon_light`.

Pressed: `roll` (the roll in his hands; it marks itself — a point on the cloth let down, `roll_out` 1) — in “Scarlet”, after `silk:ready`.

## What to check on the sheets (not checked)

The beam on the counter (the sun's place `SKY.sun` is chosen by reckoning, not by eye); whether the roll and the cloth behind Gray's back read
(`ROLL_WITH`, the offset 0.25); whether the point `roll` falls within the middle 4:3; the scarlet roll's colour against the scrap; the seconds of letting go
in the motions; whether the violinist is seen in the window (X −3.7, Z 6.2).

## Contract for the check

Read by the check of the game's branches; equal to the scene's code (`lib.js film`, `scene.json`). `seconds` — the beat's target length.

```json
{
  "beats": {
    "toys_in": { "after": [], "tells": ["toys_in:no"], "seconds": 14 },
    "toys_again": { "after": [], "tells": ["toys_again:looks"], "seconds": 8 },
    "silk_in": { "after": [], "tells": ["silk_in:first"], "seconds": 9 },
    "memory": { "after": ["silk_in"], "tells": ["memory:corner"], "seconds": 4 },
    "silk": { "after": ["memory"], "tells": ["silk:ready"], "seconds": 2 },
    "found": { "after": ["silk"], "tells": ["found:glow"], "seconds": 7 },
    "violin": { "after": ["found"], "tells": ["violin:heard", "violin:letika"], "seconds": 8 }
  },
  "points": ["roll"],
  "offers": [],
  "party": {}
}
```
