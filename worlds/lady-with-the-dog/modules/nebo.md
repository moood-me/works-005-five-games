# nebo — the sky of Kaperna and the hour's light (engine 2)

One sky and one hour for all the world's scenes: the shore, the house, the wood, the castle and the deck see the same hour. `hour` 0…1: 0 —
midnight, 0.25 — dawn, 0.5 — noon, 0.75 — sunset. The sky is painted once; the hour is led by the sky's `animate` and its shader.
**No painting reads `hour`**: all that stands in a scene is painted in the day's colours, the hour is the scene's light
(`light.looks`, the far sources).

## The sky in a scene

```json
{ "id": "sky", "name": "Sky", "sky": true }
```
```js
// the scene's lib.js — once, not in animate
const SKY = { horizon: 0.55, sun: (u, height, state, out) => { out[0] = …; out[1] = …; }, moon: … };
// elements/sky.js
e.kit.nebo.sky(g, e, e.lib.SKY);
// elements/sky.animate.js
e.kit.nebo.skyMotion(e, e.lib.SKY);
```
```
node tools/nebo-sky.js <the scene's folder> [the sky's id]
```
— writes the world's shader `elements/sky.wgsl` (from `tools/nebo-sky.wgsl`) and the element's `uniforms`. The shader is changed only in
`tools/`; after a change, run it again.

`SKY`:
- `horizon` — the scene's horizon (its `"horizon"`);
- `round: true` — a sky all round (the cameras `around`, `roam`: x 0…2π, straight ahead — π); else the scene's sky (x 0…`e.aspect`);
- `sun`, `moon` — where the scene keeps the sun and the moon on its sky: `(u, height, state, out)` → writes `out[0] = x; out[1] = y`
  (or returns `[x, y]`). `u` — the path: 0 the sunrise over the sea in the east, 0.5 the south, 1 the sunset in the west behind the hills (below 0
  and above 1 — under the horizon); `height` 0…1; `state` — the scene's values. For a sky all round — `nebo.onRound(bearing,
  heightDeg, horizon, out)` (the bearing in degrees from “straight ahead”, to the right +). `null` — the scene has none;
- `clouds` — `[[x, y, length, thickness], …]` long soft streaks (scene heights); without them — its own;
- `storm` — a key's name, 0…1: a low grey veil, the sun and the moon go dim (with no repainting).

What the shader does: the hour's gradient (v1's palette, exactly), the far sea below the horizon, the stars at night (twinkling, each
in its own way), clouds in the hour's colours — lit from below by a low sun, drifting slowly, — the sun's light along the horizon and
about it, the discs of the sun and the moon.

The sun and the moon are layers: `animate` leads them, the points `sky#sun`, `sky#moon` go with them, their glows (`e.light`) draw
paths on mirror water. The scene's light comes from where they are painted:

```json
"lights": [
  { "id": "sun", "from": "sky#sun", "color": "#fff1de", "strength": 1, "on": "sun_light" },
  { "id": "moon", "from": "sky#moon", "color": "#b8c7e6", "strength": 0.4, "on": "moon_light" }
]
```

## The hour's light

- `nebo.follow(scene)` — in `script.js`: keeps the keys `day`, `dawn`, `dusk`, `night` (the weights of the scene's `light.looks`, as in v1)
  and `sun_light`, `moon_light` (0…1, the far sources' `on`) by `hour`, when it is set or moved. All six keys are
  to be described in the scene's `states`.
- **A cut to another hour — together with its light:** `nebo.keys(hour)` → `{ day, dawn, dusk, night, sun_light, moon_light }`
  (exactly what `follow` sets). In a beat's `from`, in `s.shot` / `s.cut`: `{ hour: 0.96, ...nebo.keys(0.96), … }` — else
  a shot made ready ahead gets the old hour's light.
- `nebo.looks(hour)` → `{ day, dawn, dusk, night }`; `nebo.shine(hour)` → `{ sun, moon }`; `nebo.sun(hour)`,
  `nebo.moon(hour)` → `{ u, height, visible }` (as in v1); `nebo.palette(hour)` → `{ top, mid, low, glow, sea, day, night }`
  (`#rrggbb`) — for scripts and `animate`, not for paintings; `nebo.paletteInto(hour, out)` — the same in numbers (16: five colours'
  r, g, b 0…1 and `day`), it makes nothing new — for `animate`.

## Colours

- `WARM`, `PALE` — the lamps' light: warm (a lamp, Longren's window) and pale (the village's windows).
- `WHITE`, `SCARLET`, `SCARLET_LIGHT`, `SCARLET_DEEP` — sailcloth and scarlet silk by day (the body, the light, a fold); `sail(k)` —
  white → scarlet.
- `mix(a, b, u)`, `rgba(c, a)` — `#rrggbb` colours; `lin(c, out?)` — a colour for a shader (linear 0…1; `out` — `animate`'s own
  array).
- `glow(g, x, y, r, flat, colour, a)` — a soft patch in a painting (a cloud, a streak of mist). The lamps' glow and the haloes in the air
  are the engine's (`e.light`, `light.hazeGlow`).

No more: `stars`, v1's `sky(g, {hour, …})` (the sky by the hour in a painting), `e.px`.
