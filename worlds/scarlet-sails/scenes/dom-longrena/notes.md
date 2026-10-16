# Longren's House — engine 2

Longren's room and workshop at the top of the slope above Kaperna. The language is the same as on the shore: modern, fine,
minimal, clean forms, light and space. The main source of light is the window to the sea: the day lies on the floor by the window, at
dawn the sun rises right in the window and lays the frame's bars on the floor. The warm lamp on the workbench answers it. Scarlet here
belongs only to Assol's yacht (`toy` on the board above the window, in her hands, in the close-up), to the scrap of silk (the insert `scrap`) and to the sails
in the window (`sails_window`; their scarlet light — `sails_light`).

The scene is one of the scenes of the game “Scarlet Sails” (docs/alye-parusa/scenes.md, the chapter “Longren's House”): the play's keys are set by the game
on opening, no `from` sets them. The game plays the beats one at a time (the key `beat` = a name; once it has ended the scene tells `beat:<name>`; the world's module `beats`); outside the game —
its own showcase (`showcase.js`): all the beats in the order of `lib.js ORDER` and between them what the game's keys do (the rigging, the gaze,
the shelves emptying); the morning in the showcase is the one where the girl has the yacht (`girl_toy` 1: the board above the window empty). The sky, the hour's light and the ship are the world's modules `nebo` and `korabli`: the same hour and the same ship as on the shore.

## The space

The camera `roam`: the viewer by the back wall, looking at the window (east, to the sea), may step 0.9 m aside, 0.6 m back,
1.2 m forward. The horizon 0.42. The room (metres: X to the right, Z forward to the sea, H up; the start — X 0, Z 0): X −1.6…3,
Z −1.2…5, the ceiling 2.55. In the wall to the sea (Z 5) the window X 0…1.5, H 0.8…2.05, to the right the door X 2…2.85.

| Element | What |
| --- | --- |
| `sky` | the world's sky (nebo): painted once, the hour is its shader and animate; the sun and the moon are layers, the points `sky#sun`, `sky#moon` |
| `sea` | the sea 40 m below the house out to the horizon: the engine's mirror (`rough`, `ripple`) — the sky in it, the sun's path, the ship |
| `ship`, `ship_*` | the Secret under scarlet sails 420 m off on the water: the anchor `ship` is the scene's (`place.across` — `ship_across`, the rolling — `ship_roll`), the rest is written by `node tools/korabl.js dom-longrena ship` |
| `yard` | a plane beyond the door: grass to the brow and a path |
| `wall_back`, `wall_left`, `wall_right`, `wall_front`, `floor`, `ceiling` | the walls (`facing`), the floor, the ceiling with beams |
| `window`, `sill`, `sill_front` | the window's frame, the sill (a plane) and its edge |
| `opening`, `doorway` | the unseen openings of the window and the door: the daylight comes in through them (`window_light`, `door_light`) |
| `window_left`, `window_right`, `glass_left`, `glass_right` | the leaves on their hinges and their panes (`glass`), turned by `place.facing`; the leaves cast the shadow of the bars from the sun |
| `door` | the door on its hinges on the right (`place.facing`); shut, it does not let the sun into the doorway (its shadow) |
| `shelves` | three shelves to the left of the window and one above it; each toy is a layer, animate takes them away one by one by `toys` |
| `toy` | Assol's yacht on the board above the window (`korabli.toy`), a layer: there by `toy_on_shelf` |
| `bench`, `bench_side`, `bench_end`, `lamp`, `flame`, `work` | the workbench; the lamp (its glass cold/warm — layers) and its flame (a layer, alive; the light — `lamp_light`); on the workbench a plane and shavings, layers: the yacht's hull (while the yacht is not made) and the knife (while it is not in Longren's hand) |
| `box`, `box_end`, `box_top`, `box_wood` | the box of scraps — under the workbench |
| `chest`, `chest_end`, `chest_lid` | the sea chest in the left corner: a volume in front (`place` — `chest_across`, `chest_distance`); with `chest_here` 0 it is not painted. The point `chest` (nameless, the middle of the lid) — the game's offer |
| `chair`, `stool`, `stool_back`, `stool_top` | a chair by the sill; a high stool by the workbench |
| `basket`, `book` | the basket by the door (`basket`), the book on the floor (`book_down`) — painted by their own key (0 or 1, set at once) |
| `longren`, `assol`, `filipp`, `girl` | the engine's people (the world's cast): Longren, Assol (a girl; at seventeen — the look `assol` through `assol_wear`, the ring — a part by `ring`, `ring_kind`), the collier outside the window, the little girl with the yacht (`girl`, the part `yacht`; she runs in in `girl_in`) |
| `closeup` | an insert: the close-ups `rig`, `page`, `match` (below) |
| `scrap` | an insert: the shot `scrap` of the world's module `closeups` (the scarlet scrap on the workbench by the lamp, a child's fingers beside it); painted and moved by the module (`paint`, `live` with `taken`), the point `scrap#scrap` |

`lib.js` — the window's leaves, the shelves' toys, where the chest, the door, the leaves and the ship are by their keys (`placed`), the close-ups
(`closeup`, `closeupMotion`), the film (`film(scene)`, `ORDER`). Modules: `nebo`, `korabli`, `cast`, `beats`, `closeups`.

## The beats (lib.js film)

Each beat is a director's sequence: people go at their own pace and make their motions as long as these last;
seconds — only the pauses. `from` — all that the beat begins with (a cut, if it does not come after its `after`): the game
may begin with any. What the game waits for inside a beat, the scene tells: `<beat>:<moment>`.

| Beat | What | Tells |
| --- | --- | --- |
| `match` | the prologue's cut: the insert `closeup`, the shot `match`. The sea and the sky at dawn in the colours of the prologue's end, on it a sail — the white sails of a toy sailing ship, there and of that size, as the prologue's ship (`match_x`, `match_y`, `match_s`). Over 4 s (`match` 0 → 1) the little ship grows to its place on the workbench, the sea goes, the workbench, the lamp and Longren's big hands setting it down come through (≈ 6 s, R01) | `match:near` |
| `evening` | evening, the lamp (no fade: in the game — right after `match`, by a cut); Longren whittles (carve), Assol on the stool, her hand on the workbench; a look at the lamp and back | |
| `scrap` (after evening) | a cut into the insert `scrap`: the scarlet scrap on the workbench by the lamp, her fingers beside it. Under a touch: the player takes the scrap (`scrap#scrap`; the game leads `scrap_taken` → 1). ≈ 3 s | `scrap:close` |
| `rig` (after evening, scrap) | he lays down the knife (lay_down), her hands to the hull, the camera nearer; a cut into the close-up `rig` — the workbench with the yacht (if the insert `scrap` was on — it closes by a cut into the room). Under “Rigging”: `rig1…rig4`, `guide` | `rig:close` |
| `glow` (after rig) | back into the room; the yacht in her hands, raised to the lamp; he looks at her | `glow:up` |
| `glow_close` (after glow; close up, by the camera) | near, from the lamp's side, over the workbench (the camera −1.09, 2.68, turned 22°, 0.15 m higher, `camera_pitch` −26° — on the line from her face through the yacht): the yacht before her face, the sails hiding the face; the sail's scarlet light (the scene's small light `yacht_light` at the point `assol#yacht`, the key `yacht_glow`) on her hands and hair. ≈ 5 s | |
| `tell` (after glow, glow_close) | the window opens (`yacht_glow` goes out), the camera back to the wide shot, level; she slides off the stool (hop_down), tells with her hands (tell); he turns to her; outside the window the collier passes, stops, looks | `tell:down`, `tell:collier` |
| `why` (after tell) | the window closes; he sits on the stool facing the room, she by his knees, her hands on them; his palm on her head | `why:knees` |
| `shelf` | night; he puts the yacht on the board above the window (shelve) | `shelf:placed` |
| `years` | nine years later, day, the shelves half empty; he by the window with his pipe; the door opens, Assol (17) comes in with a basket and puts it down by the door; the ring on her, if `ring` = `finger` | `years:basket` |
| `decide` (after years) | he turns to her; the camera goes to the right wall over 1.6 s (2.4, 1.3, turned −27°), and at the end the chest in the corner (whole, not behind the stool and the workbench), he by the window and she by the door — within the middle 4:3 of the frame, the camera still (the rule of the pose for a choice: the game presses `longren` and `chest`). ≈ 2 s | `decide:turned` |
| `chest_out` (after decide) | he goes to the chest, takes hold of the lid, pulls it out of the corner, backing away (the gait drag — the chest goes after him); brushes off the dust | `chest_out:out` |
| `stay` (after decide) | his palm on her head; he sits down by the workbench, turns the knife about | `stay:palm` |
| `unpack` | night, the lamp; he comes in from the shore, the door closes; he pushes the chest back with his foot in two pushes (push_foot), lights his pipe | `unpack:pushed` |
| `read` | morning, by a cut (no fade); Assol (17) on the chair by the window with a book. Longren by the play's key `longren`: `home`, `knows` — sits at the empty workbench (seated, the knife in his hands); `sea` — neither he nor the chest is there (`chest_here` 0). `girl_toy` 1 — no yacht on the board above the window. ≈ 3 s | |
| `beetle` (after read) | the camera nearer; a cut into the close-up `page`: a beetle crawls over the page and stops at the word “Look”; on the finger that holds the page a ring, if `ring` = `finger` | `beetle:word` |
| `cry` (after read, beetle) | a cry outside; she does not raise her eyes; again — a glance to the door and back | `cry:glance` |
| `look` (after read, beetle, cry, girl_in) | she sits with the book, her eyes in the page; the camera beside her (1.65, 3.0, turned −26°: she in the middle of the frame, the window behind her, Longren at the workbench out of the frame) and lowered to the page together with her gaze (`camera_pitch` −12°) — under “Look”: `gaze` 0…1 continuously leads her eyes from the page to the window; the camera stays still while the game leads the gaze, and rises back when `gaze` is 1 (the script). `from` — as `read`'s, the camera at the page. ≈ 2 s | `look:ready` |
| `girl_in` (after look, cry) | the door flies open, the girl runs in with the yacht over her head (the gait `run_high`), stops by her knees on the room's side (not on her way from the chair to the door), takes the yacht into her right hand (the part `yacht_r`) and with her left tugs Assol by the sleeve (`reach` to `assol#hand_r`); Assol raises her eyes to her; the camera (1.5, 2.0, turned 2°) lowered, as in `look` (`camera_pitch` −12°: the girl whole in the frame) — “Look” raises it from here too. ≈ 6 s | `girl_in:tugs` |
| `sails_window` (after read, beetle, cry, look, girl_in) | a ship under scarlet sails comes into the window from the right; she raises her eyes to it; the camera level (`camera_pitch` 0) | `sails_window:seen` |
| `sails_close` (after sails_window; close up, by the camera) | from behind her (the camera 0.6, 2.3, turned 6°, `camera_pitch` −16°): she whole on the chair, the back of her head a little left of the middle, the window, in its upper right leaf the sails over her shoulder — within the middle 4:3; the scarlet light of the sails (the scene's light `sails_glow`, the key `sails_light`) falls on her and on the room; the book slides off her knees to the floor (`book_down`) — the floor by the chair in the frame. ≈ 5 s | |
| `wake` | dawn, by a cut (no fade); she has fallen asleep on the chair (doze), he beside her, his hand on her shoulder (with `longren` = `sea` he is not there — she raises her head by herself); she raises her head | `wake:touched` |
| `out` (after wake, sails_window, sails_close, girl_in) | the door flies open, she springs up (wake_up), the book on the floor, runs out of the door (run); he looks after her (the girl, if she is here, lets go of the sleeve and looks after her). The camera level; if the ship is in the window (after `sails_window`, `sails_close`) — it goes back to the shot of `sails_window`, where the door is seen | `out:gone` |

The ring of Assol (17) is a part of the cast with `ring` = `finger`: `ring` (his mother's, `ring_kind` = `mother`) or `ring_old` (his
old one, `own`); it stays on her whatever she takes or gives (`worn` in `film`).

Fades — only for time passing (the start of `shelf`, `years`, `unpack`: another day or hour); `evening`, `read` and `wake` are
entered by a cut, with no fade. The cuts into a close-up and back — with no fades, the shot made ready ahead (`s.shot`).

## Keys

Described in the scene's `states`.

- `hour` 0…1 — as in the whole world; 0.75 by default. The window faces east: the sun rises right in it and goes off to the right.
- `lamp` 0…1 — the lamp: the flame, warm light on the workbench, the left wall, the ceiling and the floor.
- `toys` 0…1 — the shelves full → empty: the toys go one by one. `toy_on_shelf` 0…1 — Assol's yacht on the board above the window.
- `chest` 0…1 — the chest in the corner → pulled out. `door` 0…1, `window_open` 0…1 — the door and the leaves open into the room.
- `sails_window` 0…1 — the ship: 0 — behind the cape, seen neither from the window nor from the door; 1 — stands in the middle of the window.
- `sails` 0…1 — the ship's sails white → scarlet (the korabli module's key; here 1).
- `basket`, `book_down` — 0 or 1 (set at once). `chest_here` 0/1 — the chest in the house (1, by default) or taken to sea (0).
- `guide` 0…1 — “Rigging”: the father's hand (in the close-up it comes into the frame and holds the stern — the yacht stops rocking; in
  the room — his hand on the hull). `gaze` 0…1 — “Look”: Assol's gaze from the page to the window (while she sits with the book),
  continuously all the way (the point of the gaze — `lib.js gazed`); the camera under the gesture stays still: the beat `look` lowers it to the page
  (`camera_pitch`), and at `gaze` 1 the script brings it back level (`camera_look` = tg `camera_pitch`) over 1.5 s (the script leads the camera's key
  rather than setting it — a camera key set at once is a new shot for the engine: once every 0.06 s (`scene.every`) it looks where
  it should be and gives a `move` there).
- `closeup` 0/1, `closeup_shot` (`rig` | `page` | `match`) — the close-up; `rig1…rig4` 0…1 — the mainsail hoisted, the main sheet made fast,
  the jib hoisted, its sheet made fast; `beetle` 0…1 — the beetle from the page's edge to the word; `match` 0…1 — the little ship grows out of the spark
  into the yacht on the workbench (moved by the beat). `scrap` 0/1 — the scrap's insert; `scrap_taken` 0…1 — the fingers have taken the scrap (moved by the game).
- `yacht_glow` 0…1 — the scarlet light of the sail of the yacht in Assol's hands (the beat `glow_close`); `sails_light` 0…1 — the scarlet light of the sails in the window
  on her and on the room (the beat `sails_close`).
- The play's keys (set by the game on opening, no `from` sets them; the defaults in `state`): `ring` (`none` · `finger` ·
  `cord`; `none`), `ring_kind` (`mother` · `own`; `own`) — Assol's (17) ring, and in the shot `page`; `longren` (`home` · `knows` ·
  `sea`; `home`) — Longren in `read`, `look`, `wake`; `girl_toy` (0/1; 0) — the girl has the yacht, it is not on the board; `sun` (0.2…0.4;
  none — null) — the hour of the morning of the sails in all its beats (`read`, `beetle`, `cry`, `look`, `girl_in`, `sails_window`,
  `sails_close`, `wake`, `out`): the game leads the last chapter's hour only forward through its scenes; without it a beat has its own
  hour — 0.31, in `wake` and in `out` after it 0.245; `match_x`,
  `match_y` (0, 0) — where the sail is on the screen in the shot `match`, in frame heights from its middle (x to the right, y down), `match_s`
  (0.006) — the ship's height in frame heights; read only by the shot's `animate`.
- `beat` — the beat (the beats module); `fade`, `camera_*` — the engine's.
- Internal (kept by `script.js` and the modules, not to be set by hand): `day`, `dawn`, `dusk`, `night`, `sun_light`,
  `moon_light` (nebo by `hour`), `chest_across`, `chest_distance`, `ship_across`, `door_facing`, `window_left_facing`,
  `window_right_facing`, `ship_roll`; `lo_a/lo_d`, `as_a/as_d`, `fi_a/fi_d` — where the people are.

Points for the game: `window#window`, `door#door`, `shelves#shelves`, `shelves#yacht` (the yacht's place on the board), `toy#toy`,
`chest#chest`, `chest#grip_l`, `chest#grip_r`, `chair#chair`, `stool#stool`, `box#box`, `work#work`, `flame#flame`,
`basket#basket`, `book#book`, `ship_rig#ship`; the people — their head, hands, shoulders; in the close-ups — `closeup#rig1…rig4`
(where her fingers take hold of the fastening as it begins: her hand comes there), `closeup#word`, `closeup#beetle`, in the scrap's insert — `scrap#scrap`.

Pressed (the game's offers): `scrap#scrap` after `scrap`; `longren` (the head) and `chest` (the nameless point on the lid) after
`decide`.

## The close-ups (the insert `closeup`)

Painted once a shot (the painting reads only what chooses the shot: `closeup_shot`, and the play's keys `ring`, `ring_kind`,
which are set at once on opening), in frame heights; the light in them is painted — it is a picture of its own.
All that moves is layers, moved by `closeupMotion` (nothing is painted anew).

- `rig` — the workbench in the evening: the yacht in its cradle (the hull, the mast, the boom, the mainsail, the jib, the sheets — layers), the rest of the scarlet silk,
  a reel, the lamp on the right. `rig1` hoists the mainsail from the boom, `rig2` brings the boom in and makes the sheet fast at the stern, `rig3` hoists
  the jib from the bow up the stay, `rig4` makes its sheet fast. The girl's hand (on the right) goes to what she is fastening now; while
  her father does not hold it (`guide`), the yacht rocks under her fingers. His hand comes in from the left: the fingers lie
  round the stern, the thumb over the deck.
- `page` — a page of the book on her knees, the window's light from the left, the shadow of the bars; the lines are strokes, one word can be read:
  “Look”. The beetle (its body and two phases of its legs — layers) crawls along the path `PAGE.way`, its legs stepping over what it has passed, and stops under
  the word. Her thumb holds the page's edge; with `ring` = `finger` a ring on it: a thin golden one (`mother`) or a broad
  dark one (`own`).
- `match` — the prologue's cut. The base is the workbench by the lamp (shared with `rig`: the wall, the bench top, the lamp and its flame). Over it
  the layers: `sea` (the dawn sky and sea in the colours of hour 0.25 — the prologue's end, dimmed by alpha), `yacht` (the toy sailing ship with
  white sails: it stands where and is of the size of the prologue's ship — `match_x`, `match_y`, `match_s` —, grows towards its place
  on the workbench in a geometric progression, `match` 0 → 1), `hand_l`, `hand_r` (Longren's big hands in their sleeves come
  from the sides and from below to the hull). All is set by `closeupMotion` by `match`.

The insert `scrap` is not this element: it is painted and moved by the world's module `closeups` (the shot `scrap`).

## Light

Everything is painted in the day's colours; the light is the engine's. Outside — the hour's light (`light.looks` by nebo's weights) and the sun/moon
(`sun`, `moon` — from the sky's points). The room is inside (`inside`): a share of the outside light comes into it (`light.inside`), the
daylight in the window's and the door's openings (`window_light`, `door_light` — `daylight` “of” the unseen openings; the door's — by `door`), and
the sun and the moon only through the openings (`through`): a patch on the floor, the leaves' bars, a shut door does not let it in.
The lamp — `lamp_light` (the light of the flame `flame`, `on`: `lamp`). Two scarlet lights: `yacht_light` — a small one, at the point `assol#yacht` (`on`:
`yacht_glow`, the beat `glow_close`), and `sails_glow` — the sails' in the window, from afar, only through the window's opening (`on`: `sails_light`,
the beat `sails_close`). The furniture and the people cast shadows on the floor and the walls.
The people read in every shot: at night the room is held by the lamp (up to 5.5 m) and the blue air of the night, the moon lays a patch on the floor.

## The move from the old engine (2026-10-11)

- The sky read `hour` and was painted anew — now it is the world's sky (a shader). The ship was a flat painting — now it is the world's
  Secret (the assembly `tools/korabl.js`); it does not hide by its painting at `sails_window` 0, but stands behind the cape (out of all the lines
  of sight from the room) and comes into the window, slowing down. The point `ship#ship` → `ship_rig#ship`.
- The shelves, the lamp, the flame, the work on the workbench — layers and animate instead of repainting by keys. The yacht on the shelf is an element
  of its own, `toy` (to be chosen in the game). `basket`, `book_down` — now 0 or 1.
- The film — `lib.js film` for the module `beats` instead of lines by seconds (`film`): people go at their own pace; the chest goes after
  Longren while he pulls it (the script: the gait `drag`), and not by seconds; `beat` at the start — `null` (outside games — the showcase).
- The beats' camera — the same keys `camera_x/z/yaw` as in v1, but they move by actions.
- The knife: Longren lays it down in `rig` (in v1 the knife vanished in `rig`, and he “laid” it down in `tell`); the knife lies on the workbench while it is not
  in his hand. The hull on the workbench vanishes when the yacht is made.
- The box of scraps has moved under the workbench: in the corner it stood in the chest's way. The chest comes out a little more to the right (past
  the stool). In `wake` Longren stands by the chair on the room's side (on the left) — in `out` he is not in her way; the hour of `wake` with no play's key `sun` is 0.245 (the sun
  already over the sea, in the window's right leaf).
- The book falls by the chair nearer the door.
- New: the close-ups `rig` and `page` (in v1 there were none — the camera only came nearer), the light of the sun and the moon through
  the window and the door, the daylight in the open door, the lamp's living flame, the ship's rolling, the ripple and the path on the sea.

## Contract for the check

```json
{
  "beats": {
    "match": { "after": [], "tells": ["match:near"], "seconds": 6 },
    "evening": { "after": [], "tells": [], "seconds": 8 },
    "scrap": { "after": ["evening"], "tells": ["scrap:close"], "seconds": 3 },
    "rig": { "after": ["evening", "scrap"], "tells": ["rig:close"], "seconds": 5 },
    "glow": { "after": ["rig"], "tells": ["glow:up"], "seconds": 6 },
    "glow_close": { "after": ["glow"], "tells": [], "seconds": 5 },
    "tell": { "after": ["glow", "glow_close"], "tells": ["tell:down", "tell:collier"], "seconds": 12 },
    "why": { "after": ["tell"], "tells": ["why:knees"], "seconds": 8 },
    "shelf": { "after": [], "tells": ["shelf:placed"], "seconds": 5 },
    "years": { "after": [], "tells": ["years:basket"], "seconds": 8 },
    "decide": { "after": ["years"], "tells": ["decide:turned"], "seconds": 2 },
    "chest_out": { "after": ["decide"], "tells": ["chest_out:out"], "seconds": 10 },
    "stay": { "after": ["decide"], "tells": ["stay:palm"], "seconds": 11 },
    "unpack": { "after": [], "tells": ["unpack:pushed"], "seconds": 10 },
    "read": { "after": [], "tells": [], "seconds": 3 },
    "beetle": { "after": ["read"], "tells": ["beetle:word"], "seconds": 9 },
    "cry": { "after": ["read", "beetle"], "tells": ["cry:glance"], "seconds": 8 },
    "look": { "after": ["read", "beetle", "cry", "girl_in"], "tells": ["look:ready"], "seconds": 2 },
    "girl_in": { "after": ["look", "cry"], "tells": ["girl_in:tugs"], "seconds": 6 },
    "sails_window": { "after": ["read", "beetle", "cry", "look", "girl_in"], "tells": ["sails_window:seen"], "seconds": 6 },
    "sails_close": { "after": ["sails_window"], "tells": [], "seconds": 5 },
    "wake": { "after": [], "tells": ["wake:touched"], "seconds": 6 },
    "out": { "after": ["wake", "sails_window", "sails_close", "girl_in"], "tells": ["out:gone"], "seconds": 6 }
  },
  "points": ["closeup#rig1", "closeup#rig2", "closeup#rig3", "closeup#rig4", "closeup#word", "closeup#beetle", "scrap#scrap", "longren", "chest", "book#book", "window#window"],
  "offers": ["scrap#scrap", "longren", "chest"],
  "party": { "ring": "none", "ring_kind": "own", "longren": "home", "girl_toy": 0, "sun": null, "match_x": 0, "match_y": 0, "match_s": 0.006 }
}
```
