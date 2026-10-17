# The Di Vita home

The kitchen-room of Totò's mother (scenes.md "The Di Vita home"): chapters I, IV, V. Engine 3, camera `roam`. The mood —
cramped, poor, warm from one lamp over the table; in 1988 the same room without the lamp — warm only the lamp in the
old mother's hand.

## How it is built (metres: x across, right +; z inward from the south wall, where the start stands, looking north)

All the numbers are `lib.js`'s (`G`). The room x −2.8…2.8, z 0…4.8, the ceiling 2.8. The north wall: the window on the
square (x −2.05, 0.8 × 1.1, the sill at 1.0; beyond it `window_out` — the world's sky `sky.pane` by the hour and the
era, the houses opposite, the bell tower; in the past one warm window), the father's photograph in uniform over the
table (`photo`, the point `photo#photo`, x −0.5, height 1.5…2.0), an icon. The table (x −0.5, z 3.4; 1.3 × 0.8, its top
at 0.76) — a card in front and a plane on top (the lamp's shadow on the floor); three chairs — copies of one (`chairs`:
the northern — where the mother sits, the eastern — the boy's, the western); the lamp over the table (`lamp`, the light
`lamp_light` by the key `lamp`). The west wall — the door to the stairs, a coat on a hook, the dresser. Totò's corner —
the east, behind a curtain (`curtain`, on a rod along x 1.2; the gap z 2.55…3.45 — his door): the bed along the east
wall (`bed`, `bed_top`, `headboard`; its head to the north), a shelf over it (`shelf`: books, the camera, tins; with
`reel8` the tin «E.»), the home projector on the shelf (`home_projector`, only with `reel8`; its points — itself and
`#switch`), the partition to the south (`partition_n` / `partition_s`, z 0.6) with cut-out film stars round an empty
place — the square of the home movie falls there (`home_screen`: `cinema.frame` `elena8` as a layer, the girl
`cinema.elena8Girl` as a layer; it glows by itself while `projector_on`), the projector's beam (`home_beam`, `cinema.beam`
with the world's shader). On the table: the jug (`jug`; while `jug_held`, `animate` carries it to the mother's hands),
the glass (`milk`, the milk rises by `milk`), the letters (`letters`).

The light: the lamp over the table (warm, `lamp`), the lamp in the mother's hand in 1988 (`hand_lamp`, the light
`{"at": "maria#lamp"}`), the window's cold light, the warm glow of the home movie (`movie_light`, by `projector_on`).
The looks of the light (`looks`): `night_k` (from `hour`), `now_k` (from `era`: colder, paler) — `script.js` sets them;
each beat's `from` sets them at once.

## The shots (`lib.js` `CAM`; yaw — degrees from north, h — the eye from 1.7)

- `table` (0.85, 1.05; −24; eye 1.4) — the table under the lamp, the photo over it, the window on the left: the mother
  at the table ≈ 2.8 m, the boy on the eastern chair.
- `photo` (−0.45, 2.05; −2; eye 1.55, looking a little down) — a medium shot across the table: the mother seated
  ≈ 2 m, her face under the lamp, the photo over her, the boy on the left at her right shoulder.
- `call` (−1.75, 4.5; 145) — from behind the table past the lamp: the mother and Totò (17) stand facing each other at
  the table, in its light; Totò's face half turned to us. `answer` (−1.6, 4.55; 148) — the same, closer: Totò reads by
  the lamp, his face in its light.
- `corner` (2.45, 0.72; −10; eye 1.32) — in the corner by the partition: the curtain's gap with the mother (≈ 2.6 m,
  −20°), the bed; in `question` the mother a step into the corner, the lamp between them — light on both faces; the
  point `home_projector` ≈ +13°.
- `movie` (2.3, 4.45; 186) — over the bed's head: his back on the bed, the shelf with the projector, the beam, the
  square on the partition, the mother with the lamp on the right.

## The beats

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| supper | — | 1949, night, the lamp, `table`: the mother pours the milk (`pour`, the jug in her hands, the milk rising), the boy sits at the table; then they look at each other, the boy reaches for the glass (face: `smile`) | supper:milk (≈4) | 10 |
| photo | — | night, the lamp, `photo`: the mother sits bowed over the table (`seated_bowed` from its end, the hands to the table); the boy comes up, his hand on her right shoulder; she raises her face to the photo (`sad`), then to him | photo:hand (≈8) | 16 |
| call | — | 1958, evening, the lamp, `call`: the mother holds the paper out to Totò (17) (`give`, the part `paper_sheet`), he takes it (`take`) and looks at it (`thinking`) | call:paper (≈5) | 12 |
| returned | call | on the table a pile of envelopes stamped «Addressee has moved»; the mother lays one more on top (`pile` 1); Totò looks (`sad`) | returned:pile (≈6) | 12 |
| answered | call | her letters on the table; Totò by the lamp reads a sheet (`read`, the part `letter_sheet`), the camera comes up to him in a medium shot; his face in the lamp's light (`smile`) | answered:reading (≈5) | 12 |
| room | — | 1988, night, the lamp not lit, `corner`: the old mother in the curtain's gap with a lamp (`lamp_hand`), Salvatore comes in, stands in the middle of the corner, looks at the shelf, at the bed, at her. With `reel8` the projector and the tin «E.» on the shelf. A pose for the touch on `home_projector` | room:door (≈6) | 14 |
| home_movie | room | he goes to the shelf, switches the projector on (`reach` to `home_projector#switch`, `projector_on` 1); a cut to `movie`; he sits on the bed (`sit_down` → `seated`), watches, his back to us; on the square the girl walks across the square — as much of her as he held (`share`) | home_movie:light (≈8) | 16 |
| question | room, home_movie | `corner`: he sits on the bed half turned to us, the mother takes a step into the corner and holds the lamp between them — both faces in its light (the mother `sad`, he `tired`); after `room` he sits down first; the square goes out (the film has run out) | question:asked (≈1–4) | 11 |

The seconds — reckoned from the code (the steps at the gait's pace); checked against the showcase on the sheet.

## The people

`maria` (the look `maria`; in 1988 `maria_wear` = the object of the look `maria_old`), `toto` (`toto_boy`; `toto_teen`
in `call`, `returned`, `answered`; `salvatore` in 1988) — objects of `scene.kit.cast.characters`. The cast's motions:
`pour`, `seated_bowed` (weak takes: propped up by `reach` to the jug and to the table), `seated`, `sit_down`, `give`,
`take`, `read`, `stand`, `walk`.

## What is not there / what is not so

- The jug in her hands is a thing of the scene that `animate` brings to the mother's hands (the cast has no part "jug");
  the tilt of the pouring itself is a turn of the jug's layer, the body does not tilt (`pour` holds the hands at the
  table).
- The mother in `photo` begins from the end of `seated_bowed` (bowed), her hands — `reach` to the table.
- In 1988 the table is bare (no jug, no glass); through the curtain's gap the dark room is seen from the corner.
- The door to the stairs does not open: in the beats nobody comes in through it in the shot (in `room` he comes in from
  the room through the curtain's gap).

## Contract for the check

```json
{"beats": {
  "supper": {"after": [], "tells": ["supper:milk"], "seconds": 10, "show": false},
  "photo": {"after": [], "tells": ["photo:hand"], "seconds": 16, "show": false},
  "call": {"after": [], "tells": ["call:paper"], "seconds": 12, "show": false},
  "returned": {"after": ["call"], "tells": ["returned:pile"], "seconds": 12, "show": false},
  "answered": {"after": ["call"], "tells": ["answered:reading"], "seconds": 12, "show": false},
  "room": {"after": [], "tells": ["room:door"], "seconds": 14, "show": false},
  "home_movie": {"after": ["room"], "tells": ["home_movie:light"], "seconds": 16, "show": false},
  "question": {"after": ["room", "home_movie"], "tells": ["question:asked"], "seconds": 11, "show": false}
},
"points": ["maria", "toto", "maria#lamp", "photo#photo", "home_projector", "home_projector#switch", "home_screen#square", "shelf#middle", "bed#pillow", "letters#pile", "milk", "jug#handle", "jug#spout", "lamp#bulb"],
"offers": ["home_projector"],
"party": {"reel8": 0, "share": 1},
"keys": {"beat_next": ""}}
```
