# svet

The world's colours and London's hour — one for all its scenes: Pall Mall behind the club's windows and Saville Row
are one town at one hour. Everything is painted once, in daylight colours; the hour is the scene's light: its `looks`
on the hour's key (`ambient`, `ambientColor`, `hazeColor`, …). The module gives the colours for what the light cannot
make — and the gas.

- `mixc(a, b, u)` — a colour between a and b (`#rrggbb` or `[r, g, b]`), u 0…1 → `[r, g, b]`; `rgba(c, a)` — for
  `fillStyle`; `css(c)` — `#rrggbb` (what `e.light`, `lights`, `looks` take); `lin(c, out?)` — a colour for a shader,
  linear 0…1 (`out` — an `animate`'s own array, so as not to make a new one every frame).
- `glow(g, x, y, r, c, a, sy)` — a soft patch, painted: a radial gradient of the colour c (opacity a) into nothing,
  squeezed sy times in height. A lamp's glow and its halo in the air are the engine's (`e.light`, `light.hazeGlow`) —
  do not paint them.
- `london(night)` — the fog's colours at the hour `night` (0 — a grey day, 0.5 — dusk, the gas is lit, 1 — night) →
  `{ night, high, low, gas }`: the fog high up and low over the street, the gas 0…1. The sky is not lit by the scene's
  light — its fog is painted once (a gradient as a share «top → bottom»), its shader's colours are given by `animate`:
  ```js
  // the sky's animate: uniforms high_r, high_g, high_b, low_r, low_g, low_b
  const A = e.kit.svet.london(e.state.day), m = e.mem, h = e.kit.svet.lin(A.high, m.h ??= [0, 0, 0]), l = e.kit.svet.lin(A.low, m.l ??= [0, 0, 0]);
  e.uniform('high_r', h[0]); …
  ```
- `gas(night)` — how much the gas burns (0…1) at this hour: a street lamp's `animate` — `e.glow('lamp1', e.kit.svet.gas(e.state.day))`.
- `gasLamp(g, e, name)` — a gas street lamp, its foot at (0, 0): a thin cast-iron post, a glass globe, its flame — the
  `e.light` of the element `e` (the name `name`, if given: `lamps#lamp1`) at the gas's full strength; the hour is set
  by `animate` (`gas`; `e.glow` puts out the light taken in `lights` with `of` too). The halo in the fog — `hazeGlow`.
  Painted in daylight colours: the evening is made by the scene's light.

In the club the hour's key is called `day`, in Saville Row — `night`; the values are the same.
