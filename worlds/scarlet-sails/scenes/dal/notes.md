A service scene of the game “Scarlet Sails” (bespoke): between the chapters. The sea at dawn out to the horizon; at the bottom edge of the frame a toy yacht on the water. The chapter's title comes through on one great sail; after the chapter — the map of its choices as sails on the water; after the epilogue — the play's whole fleet. No music. Engine 2: the pictures are static, the motion is layers, `animate` and shaders. The world's module — `nebo` (the colours of sailcloth and of scarlet, a soft patch of light).

- `chapter_number`, `chapter_title` — strings; both may be empty (the very beginning, before the prologue: only the yacht).
- `map` — `null` (only the title: it comes through on one great sail amid the sea, as if through the cloth) or the rows of choices `[{title, weight '⚑'|'~', options: [{label, state: 'chosen'|'open'|'unseen'}]}]` — a fleet: a row is a group of sails on the water, a sail for each option. `chosen` — the sail full of wind, scarlet, glowing; `open` — a white outline, slack; `unseen` — a barely seen dot with no word. `⚑` — a sail 0.16 of the frame's height, `~` — 0.09 (when crowded — smaller, down to 0.3 of that). The row's question is above the group, the option's label under its sail, dark blue on the light water; the font — a serif with italics, 0.05 of the frame's height (never smaller). Above the map the chapter's number and title — on one line in the sky (y 0.11, below the site's header). No more than six rows (the rest are dropped); up to three — one to a line of the sea (a chapter's map). More than three — the whole play: two to a line of the sea, the sails alone — with no question above the group and no labels for the options; under the group one word, the first word of the row's `title` (the chapter's number, “Finale”).
- `reveal` 0…1 — the mist goes off the sea from the top down (`lib.js` `front`: the edge goes from y 0.02 to 1.15, easing in and out): all below the edge is still hidden, the title and the rows come through as it passes them (the game leads it 0 → 1 over 3.5 s for a title, 2.5 + 1.2 s a row of a map).
- `korablik` 0…1 — the brightness of the yacht at the edge (it and its halo); the yacht always rocks.

How it is built: `lib.js` — `layout(A, state, measure)`: where everything stands (the great sail and its words, the heading, the lines of the sea, the rows, the sails, the labels) by measured words, in scene heights; `fleet` calls it. Also in `lib.js`: `front(reveal)` — the mist's edge (`sea.animate`, `fleet.animate` take it into the uniform `front`), `HORIZON`, `sunX`, `font`, `INK`. All three elements are sky (a 16:9 scene, frame heights).
- `sea` — the sky and the sea, painted once: the dawn, a low sun, clouds, the water in streaks. The shader `sea.wgsl`: glints on the water (thicker in the sun's path and towards the horizon), the mist with a living edge.
- `fleet` — the title and the fleet, painted once a map (reads `map`, `chapter_*`, not `reveal`): the base — the glow about the scarlet sails and the light through the great sail (the shader makes it light, `emission`), layer 1 — the sails and the hulls, 2 — the words, 3 — the cloth on top (the seams of the scarlet sails; a pale gauze on the great sail, through which the title is seen). `fleet.wgsl` hides all that is below the mist's edge and stirs the cloth a little; the words stand still.
- `korablik` — the yacht at the edge (the layers: the ripple, the halo, the yacht itself); it rocks and breathes in `korablik.animate.js`. It is a thing of the sky: it marks the point `sail` in the middle of its sails itself (x — the middle of the scene, y 0.895 — within the middle 4:3, no nearer than 0.08 to the edges). The yacht is scarlet — Assol's toy; there are no other scarlet places but the chosen sails.

The font sizes are fractions of the frame's height, the same on every screen. Everything within the scene's middle 4:3 (x from (A − 4/3)/2 + 0.03). The showcase (`showcase.js`): the title of chapter I, the map of chapter III, the whole play.

What fits in the sea (under the heading it takes 0.58 of the frame's height, the text no smaller than 0.05): the whole play (six rows, the sails alone with a word under the group) — the sails ~0.75 of their size; a chapter's map of two rows — at full size or near it; a chapter's map of three rows with questions and labels — the sails ~0.4 of their size (left so: the scene is a service one). If something does not fit (a word wider than its place), `fleet` says so through `e.warn`.

## Contract for the check

```json
{
  "beats": {},
  "points": ["korablik#sail"],
  "offers": ["korablik#sail"],
  "party": { "chapter_number": "", "chapter_title": "", "map": null, "reveal": 1, "korablik": 1 }
}
```
