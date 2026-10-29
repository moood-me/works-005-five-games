# The sea-front (Набережная)

The prologue, I and II of “The Lady with the Dog” (scenes.md, «Набережная (`main`)», the 4th edition): the world's main
scene. Yalta: the long sea-front along the sea — the camera `panorama`, `span` [−45, 45]. The start stands on the
flags facing the sea (south): the stone parapet across the view at 8.5 m, the sea beyond it; the pier runs out to sea
on the left (across −40…−24); on the right, between the start and the parapet, the pavilion (10…18), the gardens with
their tables (≈ 20…27) and the avenue under the acacias (along across 34).

## How it is made

- **The sky and the hour** — the world's `sky` (`lib.SKY`: the sun crosses over the sea from the left to the right, above
  the frame at noon; the moon by night a little right of the middle, its path on the water toward us); `sky.follow`
  keeps the looks' weights and the sun's and moon's light by `hour`; every beat's `from` and shot carries
  `lib.hourOf(hour)`. No painting reads the hour.
- **The sea** — a water plane with `reflect` (`rough`, `ripple`): it mirrors the sky — glitter at noon, lilac in the
  evening, the moon's path at night; its own blue-green and a drifting ripple (stronger in the `wind`). The far capes —
  a card 2.6 km out, blue in the haze.
- **The land** (`relief.js` → `lib.ground`) — 0 on the sea-front and under the pier, the sea's bed −2.2 beyond the
  parapet; the sea's surface −1.0. Planes take their height as it is (the pier's deck 0.02, the gangway up to the
  steamer's deck 1.1).
- **The sea-front** — the flags (a plane), the parapet (a balustrade card with the pier's gap) and its top (two planes:
  the dog runs and sits there, `spitz_e` 0.8), lamp-posts (copies, all facing 180), cypresses and acacias (copies,
  the crowns swaying in the wind).
- **The pavilion** — its floor (a walk plane, `inside`: the light `inside` 0.55 gives its shade), the awning's underside
  (a card laid back flat, its face down), the scalloped valance, the posts, his table and chair. Seen only from
  `PAVILION` (nothing else looks inland).
- **The gardens** — gravel, five tables (planes and their feet), chairs; he sits behind the first (`SEAT_G`), she
  behind the second (`SEAT_A`), both facing the promenade, 2.2 m apart; the dog between them (`DOG_CHAIR` →
  `DOG_KNEE` by `spitz_near`).
- **The avenue** — gravel under acacias, a seat, a clipped hedge at the far end: the walkers come out from behind it
  and go off to the left out of every frame, or the other way (the script, below).
- **The pier** — the neck and the head (walk planes of boards), white railings (cards along every edge, open where the
  gangway comes), a kiosk (two cards and a roof), lamps. **The steamer** — an unseen anchor placed by `steamer`
  (`lib.steamerAt`: far out → turning in → alongside, broadside), its hull (the bulwark open for the gangway) and its
  deckhouse, funnel and masts (two cards on it), a walk plane for its deck, smoke from `steamer_house#funnel`, its lights
  by `steamer_lit`. **The gangway** — a tilted walk plane from the pier to the deck, shown only alongside.
- **The crowd** — painted groups of three (four elements of two copies each — beyond the dozen people the engine moves),
  thinned group by group by `crowd`. The arrivals and the walkers are the cast's people.
- **The dog** — the module `spitz`; its card kept toward each shot by `spitz_face` (180 + the camera's yaw).
- **People** — `gurov_summer`, `anna_summer`, `waiter_summer`, `p1…p6`, `stranger`, `stranger_lady`, `stroller1…3`,
  `boy`. Motions: `run`, `stroll` (his gait beside her), `bend_take`, `seated`, `sit_down`, `eat_slow`, `wag_finger`,
  `pat_low`, `lorgnette_up` (the part `lorgnette`), `embrace_him`, `embrace_her` (+ `reach` to `#back`), `step_back`,
  `give_small`, `take_small`, `read_letter` (the part `letter_paper`; the boy's `note`). All in the cast; none made new.
- **The film** — `lib.js` `film(scene)`, played by the module `beats`. A beat that follows another and begins with its
  own cut says it as it begins and cuts when it is ready (`cutTo`); begun by the game's cut to its `from` it makes no
  second cut.

## Shots (`lib.CAM`)

`NOON` (on the flags looking along the front to the left and out: the dog on the parapet in the middle at 7 m, Anna
far off on the left), `PAVILION` (in its shade behind Gurov on the right; out on the bright front the lady goes off,
small), `GARDEN` (the two at their tables, 3.9 m: a third of the frame sitting; the dog between), `TALK` (2.1 m:
medium, both three-quarters), `QUAY` (side on along the parapet, ≈ 4.7 m from those walking; its `camera_x` follows
them), `PIER` (on the neck looking out: the two near, the crowd on the head, the steamer), `GANGWAY` (over Anna's
shoulder, 4.5 m to the gangway's foot: the arrivals a third of the frame; her head and lorgnette at the left edge),
`KISS` (the pier's end, side on, 1.8 m), `GO` (the head across the frame from the neck), `ALLEY` (the avenue along, the
seat in the middle third).

## Beats

| Beat | after | ≈ s | What |
| --- | --- | --- | --- |
| `noon` | — | 8 | noon out of the glare (`glare` 1 → 0 in 1.5 s); the dog runs along the parapet from the right, the leash trailing, trots, sits in the middle; Anna far off, her back to us |
| `noon_turn` | noon | 12 | it turns its head to us, jumps down; she comes back, stoops (`bend_take`), takes the leash (`noon_turn:leash`), goes off left with it |
| `pavilion` | — | 10 | the pavilion's shade, Gurov at his table; the lady goes off small with her dog; he turns his head after her (`pavilion:looks`) |
| `garden` | — | 12 | evening (0.76), the lamps; he dines; she comes in with the dog, sits at the next table, lets the leash go (it trails); the dog lies by her chair (`garden:sat`) |
| `coax` | garden | 2 | the dog gets up, looks at him; he turns on his chair to it — under «Coax» |
| `coax_hold` | coax | 3 | `trust` 1: it noses his palm, she has turned and smiles; 0: it sits a step off, wary — under the choice |
| `finger` | coax_hold | 6 | he shakes a finger; it growls (`finger:growl`), backs off to her chair facing him; she reaches down for the leash |
| `pat` | coax_hold | 5 | he stoops and pats it (`pat_low`, his hand to `spitz#back`); it sits by his foot (`pat:sits`) |
| `talk` | finger, pat | 15 | faces: a cut to `TALK` — she turns on her chair to him, he smiles (`talk:turned`); a waiter passes behind |
| `walk_out` | — | 12 | night (0.88), `QUAY`: they walk across the frame, the dog ahead on the leash, the moon's path behind (`walk_out:moon`) |
| `pier` | — | 13 | the holiday's evening (0.8), the wind and dust, `PIER`; the crowd; the steamer comes alongside; she raises her lorgnette (`pier:lorgnette`) |
| `gangway` | pier | 3 | a cut to `GANGWAY`, `glass` 1; the arrivals up on the deck — under «Lorgnette» (the script lets them down by `pass`: `gangway:stranger`) |
| `lost` | — | 10 | `PIER`, the crowd thinning, the arrivals going off up the pier past them; she without her lorgnette (`lost:empty`) |
| `kiss` | lost | 9 | dusk (0.83 → 0.85), a cut to `KISS`; `fright` 1 — she presses to him first, afraid; 0 — he turns to her, they embrace; he looks back over his shoulder (`kiss:look`) |
| `go` | kiss | 8 | a cut to `GO`: they go back along the pier, he at her pace; the dog runs ahead |
| `noon_garden` | — | 3 | noon, `ALLEY`: the two by the seat; walkers come and go (the script) — under «Looking round»; `kiss_now` → the embrace, `noon_garden:kiss` |
| `days` | — | 14 | noon, `QUAY`: they walk slowly across, the dog ahead; `gossip` 1 — the lady with the parasol ahead, she looks back once; the hotel boy runs up with a letter; she stops and reads (`days:letter`) |

Keys: `hour` (and the sky's `day`, `dawn`, `dusk`, `night`, `sun_light`, `moon_light`), `glare`, `glass`, `wind`,
`lamps`, `steamer` (→ `steamer_a/d/f`), `steamer_lit`, `smoke`, `crowd`, `pass`, `look_at`, `stranger_turn`, `surge`,
`spitz_near`, `hand`, `watched`, `seen`, `kiss_now`, `trust`, `fright`, `gossip`, `spitz_face`, the keys of `spitz`,
`beat`, `beat_next`. No keys of the play (`trust`, `fright`, `gossip` are the game's story keys set during the play).

## The script

- `steamer` → its place; `spitz_near` → the dog's place, `hand` → Gurov's right hand reaching low toward the dog —
  only in `coax` … `pat` (elsewhere the beats place them).
- `pass` (only in `gangway`): each arrival let down walks down the gangway to its place by the foot (`MET`), turns to
  the crowd, and goes off up the pier when two more have come down (or on `surge`). The stooping man (the fifth) comes
  down with his lady, stops at the foot with his back to us, tells `gangway:stranger`, waits for `stranger_turn`, turns
  to her, she takes his arm (`stranger#elbow_l`), they go. `look_at` — the one looked at stops 1.5 s and turns his head
  (in profile). `surge` in `gangway` — the crowd thins.
- The avenue (only in `noon_garden`, until `kiss_now`): two walkers every 16 s, 2.5 s apart, one coming from behind
  the hedge and going off left, the other the other way (≈ 9.5 s in the window each) — the avenue empty about 4 s
  between. `watched` is set at once on every change (checked ten times a second). `seen` — the nearest walker in it
  turns to look at them, Anna steps back (`step_back`); 0 again after 2 s. `kiss_now` — no walker more; they embrace;
  `noon_garden:kiss`.

## What is not here / what to know

- **No fade from white**: a scene has no fade of its own (scene-format-3: transitions are the page's). The noon's
  glare is the light's look `glare` (brightness up, colours washed out) going off in 1.5 s — light, not a fade.
- **The arrivals in `pier`** are not on the pier: scenes.md has `p1…p6` in the waiting crowd and then at the top of the
  gangway; here the crowd on the pier is painted and `p1…p6` come only on the steamer's deck (`gangway`) — the same
  people do not stand in two places.
- **The crowd does not surge off as people**: the painted groups only thin out (`crowd`, group by group, far back on
  the head); those who walk off up the pier past the two in `lost` are the arrivals — the cast's people.
- **`finger`**: she is seated — `bend_take` is a standing motion; she reaches down for the leash (`reach`) instead.
- **`noon_turn`'s head “to us”** is a look at the camera's place (`spitz_look`), the dog's head turning in profile.
- `kiss` and `go` follow `lost`: each makes its own cut as it begins (≈ a moment's wait for the shot) — a cut inside a
  beat cannot be made ready during the beat before (that one does not know what follows).
- Houses on the slope are not built: no shot looks inland.

## Contract for the check

```json
{"beats": {"noon": {"after": [], "tells": [], "seconds": 8, "show": false},
           "noon_turn": {"after": ["noon"], "tells": ["noon_turn:leash"], "seconds": 12, "show": false},
           "pavilion": {"after": [], "tells": ["pavilion:looks"], "seconds": 10, "show": false},
           "garden": {"after": [], "tells": ["garden:sat"], "seconds": 12, "show": false},
           "coax": {"after": ["garden"], "tells": [], "seconds": 2, "show": false},
           "coax_hold": {"after": ["coax"], "tells": [], "seconds": 3, "show": false},
           "finger": {"after": ["coax_hold"], "tells": ["finger:growl"], "seconds": 6, "show": false},
           "pat": {"after": ["coax_hold"], "tells": ["pat:sits"], "seconds": 5, "show": false},
           "talk": {"after": ["finger", "pat"], "tells": ["talk:turned"], "seconds": 15, "show": false},
           "walk_out": {"after": [], "tells": ["walk_out:moon"], "seconds": 12, "show": false},
           "pier": {"after": [], "tells": ["pier:lorgnette"], "seconds": 13, "show": false},
           "gangway": {"after": ["pier"], "tells": ["gangway:stranger"], "seconds": 3, "show": false},
           "lost": {"after": [], "tells": ["lost:empty"], "seconds": 10, "show": false},
           "kiss": {"after": ["lost"], "tells": ["kiss:look"], "seconds": 9, "show": false},
           "go": {"after": ["kiss"], "tells": [], "seconds": 8, "show": false},
           "noon_garden": {"after": [], "tells": ["noon_garden:kiss"], "seconds": 3, "show": false},
           "days": {"after": [], "tells": ["days:letter"], "seconds": 14, "show": false}},
 "points": ["spitz", "spitz#head", "p1#head", "p2#head", "p3#head", "p4#head", "p5#head", "p6#head", "stranger#head", "anna#head"],
 "offers": ["spitz"],
 "party": {}}
```
(`gangway:stranger` and `noon_garden:kiss` are told by the script during the game's mini-games, after the beat.)
