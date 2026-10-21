# The route (`route`) — engine 3

The game's own scene (Around the World in 80 Days; the play's map, moood docs/agents/games.md §2): the background the
game hangs its chapters' pages over — an old map of the world on paper, the way round in red ink as far as the play has
come. Made after «The Yard» of «The Elder Son» and «The Strip» of «Cinema Paradiso»; the pages, their titles and rows
are the game's (`bespoke/map.js`, in `bespoke.underlay`), not this scene's.

## How it is made

- **The sheet** (`map`, a card 10.6 m off): Greenwich at its left edge and again at its right — the world once round,
  as Fogg went, east — and as much again either side as a wide frame sees past the ends (lon −95 … 455; lat 80 N …
  10 S). The scale — `lib.K` 0.147 m a degree, both ways (an equirectangular sheet); the frame's top at 66 N (the
  scene's horizon 0.9: the eye low, the sheet up in the frame), so the way (20–54 N) runs across its upper middle.
  Painted once: the yellowed paper, its stains and folds; the graticule every 15°, the equator and the tropic dashed;
  the seas washed grey-blue along the coasts; the lands (`lib.LANDS`, rough coasts as an engraver of the 1870s had them,
  each three times: −360, 0, +360) in ochre with sepia coasts; the towns of the way and the oceans in italic
  (`tr`). Clipped to its own box.
- **The way** (`lib.WAY`): London — Paris — Turin — Brindisi (rail), the Mediterranean to Suez, the Red Sea and the
  Indian Ocean to Bombay, the rail across India to Calcutta, by sea round Malacca to Hong Kong, Yokohama, across the
  Pacific to San Francisco, the rail to New York, the Atlantic to Queenstown and Liverpool, the rail home — its legs at
  the shares of the way the game's chapters have (0.04 Brindisi, 0.07 Suez, 0.14 Bombay, 0.22 Calcutta, 0.33 Hong Kong,
  0.4 Yokohama, 0.55 San Francisco, 0.78 New York, 0.97 Liverpool). In red ink — by land a line, by sea dashes — the
  layer `ink`; under it the layer `share`, the same way a little wider, its grey the share of the way at each point
  (written so that the light the shader reads is the share itself). The shader (`map.wgsl`) shows the ink where the
  share is short of `route` — nothing is painted again as the line grows.
- **The day won** — the layer `dateline` (the 180th meridian dashed in red, a notch across the way, «+1 day»), shown by
  the shader as far as `dateline`.
- **Fogg's watch** (`watch`) — lying open on the map low left of the prologue's page (at the frame's 0.8), its chain
  trailing; the second hand goes round (its animate). Its point `watch#watch`; the game does not use it now (the page's
  button goes on) — it is the map's still life.
- `desk` — the dark walnut under the map, seen only past its edges.
- **The camera** — panorama, span [0, 53]; the view goes to a chapter by `camera_x`, which `script.js` leads by
  `shown` (at once as it opens, over a second on a change; `come` — back to it from wherever the player dragged).
- **The chapters' points** `c0` … `c5` — unseen, 10 m off, in a row at the frame's 0.28 (their pages hang down from
  there), each over its part of the way: `c0` the prologue at London (lon 2), `c1` India (82), `c2` China and Japan
  (127), `c3` America (264), `c4` the Atlantic (312: halfway between America's and the far end's, the epilogue's page and its pen clear of IV), `c5` the epilogue at London again — the sheet's far end (358):
  the two Londons are the map's two ends. (No point for the author's sign: the game draws its pen itself.)

## Keys

| Key | What | By default |
| --- | --- | --- |
| `shown` | the chapter the player is at (0 the prologue … 5 the epilogue): the view goes to its point | 0 |
| `come` | each new value brings the view back to the chapter shown | 0 |
| `route` | 0…1, smoothly: how far the red line has come (the shares above) | 0 |
| `dateline` | 0…1: the day won at the 180th meridian | 0 |

No music, no people, no beats. The showcase inks the way chapter by chapter, the view going with it, and the day won
at the end (about 35 s).

## Contract for the check

```json
{"beats": {},
 "points": ["c0", "c1", "c2", "c3", "c4", "c5", "watch#watch"],
 "offers": [],
 "party": {},
 "keys": {"shown": 0, "come": 0, "route": 0, "dateline": 0}}
```
