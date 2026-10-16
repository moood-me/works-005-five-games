# The strip — the service scene between the chapters

The booth's dark; a strip of film runs across it, lit from behind by a projector's lamp (the lamp — at the bottom right
of the middle 4:3, its point `lamp#lamp`: the game offers to press it). The chapter's title — in one big frame of the
strip; after the chapter — the map of its choices as frames; after the epilogue — the whole play as three strips. No
music. Built like the far sea (`far-sea`) of Scarlet Sails v3 (the layout by measured words in `lib.js`, painted once a
map, the developing — by the shader).

## The state

- `chapter_number`, `chapter_title` — strings; both empty and no map — the very beginning: only the lamp in the dark.
- `map` — `null`: only the title, the number and the name in a big frame 0.46 of the frame's height in the middle. Else
  rows `[{title, weight '⚑'|'~', options: [{label, state}]}]`: a row is a frame cut by its options into parts;
  `chosen` — the part glows warm (the lamp through the film, it shines — `emission`), its label dark on the light;
  `open` — dark, its label barely seen; `unseen` — black with no word. The row's question — over the frame, light
  ("the white of old film"). ⚑ — a frame 0.3 of the frame's height, ~ — 0.2 (when crowded — smaller, together). The 4:3
  frame is wider (up to 3.2:1) where the strip has room: the parts' labels need the width. If the parts' labels do not
  fit even so (the type no smaller than 0.045 of the frame's height), the frame shows the chosen option big over 3/4 of
  the frame, the others as a dark band along the frame's bottom without words (a "folded" frame). Up to five rows — one
  strip; if in one strip the frames fold, and in two they do not — two (the map of chapter IV with its labels fits in
  two strips 2 + 2). More than five — the whole play: three strips 4 + 3 + 3, over a frame only the chapter's number
  («IV», «Finale»), the frames folded (the chosen one big); the last strip shorter, not reaching into the lamp's
  corner. The map's heading — the number and the name in one line at the top (y 0.095, under the site's header).
- `reveal` 0…1 — the first third: the strip comes in from the right into the light; then the frames develop one by one
  (the rows' order), together with their questions; the heading and the big frame first. The game takes it 0 → 1 in
  3.5 s for a title, 2.5 + 1.2 s a row of a map.
- `lamp` 0…1 — the lamp's brightness (and of the light through the frames).

## How it is built

All three elements are sky (the scene 16:9, in frame heights), `camera` `picture`.
- `dark` — the dark, the warm air at the lamp and along the strip's line; painted once.
- `film` — the strip; painted once a map (it reads `map`, `chapter_*`, not `reveal`): the base — the glow round the
  shining parts (the shader makes it light), layer 1 — the strips (the base, the perforation in the lamp's light,
  undeveloped frames all along the strip), 2 — what the frames show and all the words, 3 — the order of developing
  (grey; not seen). `film.wgsl` slides the strip (`slide`, `span`) and develops the frames by `develop` against their
  order; `film.animate.js` takes them from `reveal` (`lib.slide`, `lib.develop`).
- `lamp` — the lamp house, the lens glowing (layers: the house, the halo, the lens); it breathes; `lamp` — the
  brightness. The point `lamp#lamp` (the lens: x = the middle + 0.53, y 0.87 — within the middle 4:3, no nearer than
  0.08 to the edges).

The type: `"Cormorant Garamond", Georgia, serif`, italic — **the scene's painting has no web fonts** (the painting does
not load the page's fonts): where Cormorant Garamond is not installed, the letters are Georgia. The sizes — shares of
the frame's height, no smaller than 0.045.

The showcase (`showcase.js`): the very beginning, the title of chapter I, the map of chapter IV, the whole play.

## Contract for the check

```json
{"beats": {},
 "points": ["lamp#lamp"],
 "offers": ["lamp#lamp"],
 "party": {},
 "keys": {"chapter_number": "", "chapter_title": "", "map": null, "reveal": 1, "lamp": 1}}
```
