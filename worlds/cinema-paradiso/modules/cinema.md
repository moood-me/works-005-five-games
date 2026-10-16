# cinema — all the cinema of Giancaldo

The frames of the films of those years, the screen, the projector's beam, the projector, the tin, the strip, the
changeover dot. Only paintings and helpers for `animate`; the beam's smoke and motes are the world's shader
(`tools/cinema-beam.wgsl`, written into a scene by `node tools/cinema-beam.js <folder> <the beam's id>…`). Warm in the world
is the light of the cinema alone.

## The frames

`cinema.frame(g, name, x, y, w, h)` — one frame of a black-and-white film on a rectangle: silhouettes and profiles against
the light, no faces, the grain and dark corners of a print. `cinema.FRAMES` — all the names:

- `romance` — a man in a hat and a woman by a window; `romance_kiss` — the same, their heads come together;
- `comedy` — «I pompieri di Viggiù»: the fat one at a ladder, the thin one at the top, arms flung out;
- `kiss_cut1…3` — the three kisses the player cuts in "Splicing" (a drawing room by a lamp, a garden gate, a ballroom's
  door), with the marks of the splice along the edge;
- `kiss1…8` — eight more: a sailor and a girl on a pier, a couple in a bright doorway, under an umbrella in the rain, in
  a motor car, on a stair, at a carriage window, on a balcony under the moon, by the sea at sunset;
- `elena8` — the faded colour of eight-millimetre film: the square at dusk (the girl apart, `cinema.elena8Girl(g, x, y,
  h)`: a small figure, its layer moved by the scene);
- `white` — a white frame (the film has run out, the changeover was missed).

## The screen

`cinema.screen(g, e, {x, y, w, h, frames: [names], burn: true, sheet})` — the white sheet (painting) and each frame a
layer of its own `f_<name>` (a slight flicker of the layer); `burn` — the layer `burn`: the frame blisters and whitens
from the middle. The element — `"glows": true` (a lit screen is a light, the night does not put it out); the light on
the hall and the wall — the scene's light at the screen (`on` — its own key, `flicker` 0.15). The point `#screen`.
`cinema.screenMove(e, frames, key, burnKey?, onKey?)` — in `animate`: the frame `e.state[key]` is seen (a change of
0.15 s), `burn` grows by `e.state[burnKey]`, everything goes out by `e.state[onKey]`. The frames are layers: the
painting is not painted anew.
`cinema.cue(g, x, y, w, h)` — the changeover dot in the frame's top right corner, its diameter 1/8 of the frame's height
(a layer of the scene's own, its `alpha` — the key `cue`).

## The beam

`cinema.beam(e, {len, top, bot, mouth, dust, drift, tipRadius, tipStrength})` — in the beam's upright plane: x from the
lens (the anchor, 0) to `len`, y down; at the far end the beam takes up y `top…bot`. The layers: 1 `cone` (warm,
brighter at the mouth), 2 `dust` (motes drift to the end; the shader keeps them in the cone and sends smoke along it),
3 `tip` — **an `e.light` of radius 1.5 m at the tip**: lays the engine's spot of light on stone, heads, a wall. The
element `"glows": true` (the night does not put it out; it lights nothing itself but the spot at the tip), the world's
shader. The points `#beam` (the middle), `#tip`, `#mouth`. It stands on its anchor at the mouth, `facing` — the beam's
plane; a turn in plan — `place: {facing: <key>}`.
`cinema.beamMove(e, on, reach, tilt, len)` — in `animate`: `on` 0…1 (the shader's uniform and the glow), `reach` — the
share of the length (1 — all of it), `tilt` — radians down (+) from the horizontal about the mouth; the tip goes with
the end.
The engine has no cone spotlight: the beam is a glowing wedge with a light at its tip (`artist3.md`, "The engine's
limits").

## The projector, the tin, the strip

`cinema.projector(g, side)` — a 1940s projector from the side (x toward the lens, y down from the top, the floor y 0):
the stand, the mechanism, the lamp house with its chimney, the lens; `side: 'motor'` — the side with the motor's
handle. `cinema.projectorReels(e, flip)` — two reels as the layers `rt`, `rl`; `cinema.reelsMove(e, flip, motor)` — in
`animate`: they turn while `motor`. `cinema.reel`, `REEL_TOP`, `REEL_LOW`. (The handles, the points `#lens`, `#motor`,
`#lever`, `#gate` — the booth scene's, as it is built.)
`cinema.tin(g, e, cx, cy, r, open)` — a flat round tin (from above, at an angle), the point `#tin`.
`cinema.strip(g, x0, y, h, [names])` — a strip with perforations along its edges, the frames one after another →
`{width, step, frameW, frameH}`.
`cinema.man`, `cinema.woman`, `cinema.kissing` — the films' silhouettes (for a scene's own frames).
