# korabli — the world's ships (engine 2)

## The Secret from outside

The white three-masted galliot is put together in a scene out of elements on an unseen anchor at her waterline: the sides (seven plates — every
face is seen, the light falls by its turn), the deck and the poop (planes `walk`: people stand and walk on them), a card along the keel
(the masts, the bowsprit, the stays, the pennant in the wind, the lantern), a card across at the fore- and mainmast (the mast and the yards), and the sails —
each an element of its own, painted once, moved by the world's sailcloth shader. The sails are translucent (`translucent`).

```
node tools/korabl.js <the scene's folder> [the anchor's id = ship] [the bracing, degrees = 35]
```
— writes the elements `<id>_side`, `_side_port`, `_bow`, `_bow_port`, `_quarter`, `_quarter_port`, `_transom`, `_deck`,
`_poop`, `_break`, `_rig`, `_fore`, `_fore_course`, `_fore_top`, `_fore_tg`, `_main`, `_main_course`, `_main_top`,
`_main_tg`, `_jib`, `_jib_outer`, `_spanker` right after the anchor (their files are a line of the module; the sails' shader —
`tools/korabl-cloth.wgsl`). The anchor is the scene's: if there is none, it is made. After a change to the module or the shader, run it again.

```json
{ "id": "ship", "name": "Secret", "unseen": true, "across": 60, "distance": 260, "elevation": -0.1, "facing": 0,
  "place": { "across": "ship_across", "distance": "ship_distance", "facing": "ship_facing", "tilt": "ship_roll" } }
```

- The anchor stands on the water (`elevation` — the sea's level). The ship's axes (as `on` places things): `across` — forward along the keel
  (the bow +17, the stern −16.5), `distance` — to port (the side ±3.7), `elevation` — up from the water. The anchor's `facing`: 0 — bow
  to the left, her port side to us; 180 — bow to the right; 270 — bow to us; 90 — stern to us.
- The rolling — the anchor's `tilt` by a key: in `script.js` `scene.kit.korabli.swell(scene, 'ship_roll', 4.2, 1.6)` (every 4.2 s to
  the other side, up to 1.6°).
- People on board: `"on": "ship"`, the place in the ship's axes, the height — the deck's: the waist `SECRET.deck` (2.4 m), the poop `SECRET.poop`
  (3.8 m, the stern up to X −8.5). They walk and stand in her frame and stay upright in the rolling.
- The scene's keys her `animate` reads (no key — the sails set, white, full; the lights unlit):
  `sails_set` 0…1 — furled → set, in turn (the courses, the topsails, the topgallants; the topsail and topgallant yards go up);
  `sails` 0…1 — white → scarlet; `luff` 0…1 — luffing; `lanterns` 0…1 — the lantern on the stay, the stern lantern, the cabin's
  windows; `<id>_spark` 0…1 — the spark of the sails from afar (beyond a mile the ship is a glowing point, white or scarlet; with no key
  it shines).
- Points: `<id>_rig#ship` (the middle, half the height), `#masthead`, `#bow`, `#stern`, `#deck`, `#wheel`, `#ladder` (at the water,
  in the middle of the side); `<id>_side#ladder`, `<id>_transom#stern`. The anchor `<id>` will do as a target for the camera and a gaze.
- Light: the lanterns are the glows `<id>_rig#lamp`, `<id>_transom#stern_lamp`; a scene may take them into `lights` (`of`).

## The sailcloth — one shader for the world

`tools/korabl-cloth.wgsl`: a sail is painted once, set, white; the shader sets it as far as `set` says (furled — a roll at the
yard; `rise` 1 — it grows from the foot upwards, 0 — it falls from the yard), dyes it scarlet by the painting's lights and darks
(`scarlet`), runs long folds of the wind over the cloth with light on their crests (`wind`, in gusts) and shakes it when the sail
luffs (`luff`). Uniforms: `head`, `foot` (the y of the head and the foot in the painting's units), `rise`, `seed`
(each sail's own), `set`, `scarlet`, `luff`, `wind` (set by `animate`).

A scene's own sails (the deck): the painting — `korabli.squareSail(g, c, { yard, foot, w0, w1 }, seed, side?, lap?)` (the mast at x 0, the heights upwards; `side` −1 | 1 — only
that half of the sail, it goes past the mast by `lap` = 0.6 m, the cloth lies as on a whole one — the halves meet in one sheet),
`korabli.alongSail(g, c, [[X, height], …])` or an outline of its own + `korabli.cloth(g, c, [l, t, r, b], { seams, seed })` (the cloth
within an outline already drawn; `whole` — the rectangle of the whole sail, when a part of it is painted: the body, the light on the belly, the shadow under the yard, the seams, the Anselm's patches; `c` — the ship's colours,
`SHIPS.secret`); the shader and the uniforms —

```
node tools/korabl.js <folder> cloth <id>:<head>:<foot>:<rise>:<seed> …
```
A sail's `animate` sets `set`, `scarlet`, `luff`, `wind` (`e.uniform`); `korabli.setOf(sails_set, order)` — how far
the sail is set, in turn. The sail's element — `"translucent": 0.55`.

## What else

- `SHIPS` — `{ secret, anselm }`: both ships' colours by day — `hull`, `deck`, `seam`, `bulwark`, `rail`, `spar`, `rig`,
  `cloth`, `patch` (the Anselm's patches; the Secret's `null`).
- `SECRET` — the Secret's measurements (the bow, the stern, the side, the decks, the masts); `SAILS` — her sails (the yard, the foot, the widths,
  the turn); `GALLIOT` — `{ length: 34, height: 29 }`.
- `toy(g, e)` — Assol's yacht on the water or on a shelf (the keel at y 0, 0.34 m): a white hull, scarlet sails; the point `toy`. It makes no layers.
- `reeds(g, e)` — nine reed stems out of the water before the yacht (as when it got stuck), from y 0, about x 0. It makes no
  layers: the scene paints them in a layer of its own — `e.layer("reeds", { box: [-0.24, -0.34, 0.24, 0.02] }, (g) => kit.korabli.reeds(g, e))` —
  and sets its alpha (the key `reeds`) in `animate`.
- `skiff(g, e)` — a skiff from the side, bow to the left, from the waterline (4.6 m): a dark hull, a light gunwale and band; people in it —
  `"on": "skiff"`. Points `skiff` (the middle, at the water), `bow`, `seat1` (the stern thwart), `seat2` (the bow one). It makes no layers.
- `far(g, e)` — a fishing boat far off, bow to the left, from the waterline (6 m): a low hull, a mast, a lantern on it — the glow
  `light` at full strength (the element's `animate`: `e.glow("light", k)`). It makes no layers.
- `steamer(g, e, colours?)` — a mail steamer from the side, bow to the left, from the waterline; painted once, with no smoke; the points
  `funnel` (the top of the funnel) and `steamer`; the masthead light on the mainmast — the glow `light` at full strength (`e.glow("light", k)`). It makes no layers. `STEAMER` — `{ length: 50, height: 22, funnel: [0, -15.5] }`. The smoke is the scene's particles:
  `{ "id": "steamer_smoke", "particles": { …korabli.SMOKE, "at": "steamer#funnel" } }` (`SMOKE` — the fields for JSON).
- `lantern(g, e, name)` — a ship's lantern (its base at 0, 0), the glow `name` at full strength: the element's `animate`
  gives `e.glow(name, k)`.
- `swell(scene, key, every, most)` — the rolling (above).

No more: `galliot(g, colours)` (a flat painting of the ship), the smoke in `steamer` by `e.t`.
