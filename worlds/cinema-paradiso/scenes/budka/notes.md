# Будка (opus)

The projection booth of the «Парадизо» (scenes.md «Будка»), chapters I, II and IV — part of its beats. Engine 3,
camera `roam`. Mood: a small warm room in smoke, one lamp over the bench, the projectors' lamp houses glowing, the
hall's light through the ports; the cool night only in the window on the square and the stair's bulb.

## The place (metres; x across, z north toward the hall; the start by the south wall, in the middle)

All numbers in `lib.js` (`G`). The room x ±2, z −0.3…3.2, ceiling 2.6. North wall: two ports (holes, 0.3 × 0.22 at
1.36 m) before the projectors at x −1.12 and 0.12, the look port (0.4 × 0.3 at 1.55 m) between them at x −0.5, the
clock over it (`clock` 6…10). The projectors stand 0.5 m from the wall (lens at z 2.75): each is four cards — its
inner face toward the crate (`projector` / `projector2`: the crank, the lever, the gate, the lens; reels as layers
turning by `motor1`/`motor2`; the crank turns by `crank` and its handle is the point `projector#motor`), its outer
face, its back (the lamp house: the vents' light `p1_lamp`/`p2_lamp` by `p1_on`/`p2_on`) and a top plane. Each beam
is a glowing wedge from its lens 20.5 m to the hall's screen, which stands far beyond the north wall (seen only through
the ports, with the hall's dark round it) — прожектора-конуса в движке нет; луч — светящийся клин. The boy's crate
between the projectors (x −0.5, z 2.1; an unseen walk plane 0.4 m up: he stands on it). Alfredo's stool by
projector 2 (0.55, 1.95). East wall: the bench (x 1.5…2, z 2…3.1) under the lamp, the press and rewinder, the tin;
the door (z 0.1…1.0, hinged at the north jamb): `door` 0…1 turns the leaf into the room toward the wall (`door_f`, the
script's): at 1 it lies along the wall and hides the calendar (z 1.45), shut or ajar the calendar shows. The stair
landing beyond the door with its bulb (`stair`). West wall: the window on the square (the houses across it far below,
the sky).

Light: the lamp (`lamp`), the two lamp houses, the stair bulb, a cool light at the window (weaker by night: `night_k`
from `hour`). `inside` 0.3, a little haze for the smoke.

## Shots (`script.js` CAM)

`bench` — from the south wall: Alfredo at the bench under the lamp (left of the middle), the calendar, the door at the
right edge. `ports` — behind Alfredo: the boy on the crate between the projectors, the look port and the clock.
`door` — from the window's corner: projector 2 and Alfredo's stool left, the door right of the middle; the calendar
between (hidden by the open leaf).

## Beats

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| cutting | — | `bench`, night: Alfredo works at the bench; the door opens a little, the boy in the gap; the door opens, the boy comes in and stands by the bench; the door shuts | cutting:door (2), cutting:bench (8) | 13 |
| frames | — | `bench`: the clippings on the bench, the tin open, Alfredo puts them in; he walks to projector 2 and looks it over — his back to the bench (choice pose: `tin`, `toto`) | frames:tin (2) | 9 |
| tin_shut | frames | Alfredo comes back, closes the tin, puts it in his vest pocket (`alfredo#pocket`); the boy watches | tin_shut:pocket | 7 |
| pocket | frames | the boy reaches into the tin, puts a frame in his pocket (his hand to his hips); Alfredo turns, comes back, closes the tin, pockets it | pocket:hidden (≈3), pocket:tin | 10 |
| lesson | — | evening, `ports`: the boy standing on the crate between the projectors, Alfredo behind him, a hand on his shoulder | lesson:crate (1) | 10 |
| motor | — | `ports`: Alfredo turns the crank (his right hand on the moving `projector#motor`), the reels run, the beam leaps into the port (the port flares, the far screen lights); he and the boy put their hands to `projector2#lever` | motor:beam (≈2.4), motor:lever (≈6.4) | 11 |
| knock | — | night, chapter IV, `door`: blind Alfredo on his stool by projector 2 (running), the clock at 10; the door opens: Elena in the lit doorway; he turns his head to her (choice pose: `alfredo`, `elena`) | knock:in (≈2) | 10 |
| runs | knock | she runs off down the stair, the door slams; he turns to the projector and lays his palm on it | runs:gone (≈1.4) | 6 |
| note | knock | she stands 4 s; comes in, pushes the door half shut — the calendar shows; writes on August (four pencil lines, `written`); goes out round the leaf, the door shuts quietly; his palm on the projector | note:writing (≈8), note:gone (≈11) | 22 |

## People

`alfredo` (cast `alfredo`: cap, collarless shirt; the part `pocket` marks `alfredo#pocket`; in chapter IV
`alfredo_wear` = the cast's `alfredo_blind` look object and `alfredo_with` ['cane']), `toto` (`toto_boy`), `elena`
(`elena`). Motions (cast, ready motions put in): `bench_work` (at a table sorting small things at waist height),
`seated`, `paint` (writing on the wall at head height), `stand`, `walk`, `run`.

## What is not here

- The other beats of scenes.md: `splice_in`, `deal`, `slate_in`, `slate_out`, `window`, `jam`, `smoke_in` (fire,
  smoke, «Вытащить»), `story_booth`, `reels`, `six`, `changeover` («Смена»: `cue`, `white`, the look port as a third
  of the frame), `alfredo_comes`, `note_close`, `morning`, `autumn`, `ruins`, `calendar`, `window_strip`, `strip_end`
  and the 1988 ruin (`era` ruin); the inserts (`closeups`: splice, slate, thread, calendar, strip) — not made.
- No pencil and no frame in the hand (the parts `pencil`, `frame_hand`): she writes and he hides with bare hands.
- The boy's lever reach in `motor` is at the length of his arm; their hands meet near the lever, not on it.
- `<id>_wear` takes a look object in engine 3, not a character's name (see «Зал (opus)» notes).

## Контракт для проверки

```json
{"beats": {
  "cutting": {"after": [], "tells": ["cutting:door", "cutting:bench"], "seconds": 13, "show": false},
  "frames": {"after": [], "tells": ["frames:tin"], "seconds": 9, "show": false},
  "tin_shut": {"after": ["frames"], "tells": ["tin_shut:pocket"], "seconds": 7, "show": false},
  "pocket": {"after": ["frames"], "tells": ["pocket:hidden", "pocket:tin"], "seconds": 10, "show": false},
  "lesson": {"after": [], "tells": ["lesson:crate"], "seconds": 10, "show": false},
  "motor": {"after": [], "tells": ["motor:beam", "motor:lever"], "seconds": 11, "show": false},
  "knock": {"after": [], "tells": ["knock:in"], "seconds": 10, "show": false},
  "runs": {"after": ["knock"], "tells": ["runs:gone"], "seconds": 6, "show": false},
  "note": {"after": ["knock"], "tells": ["note:writing", "note:gone"], "seconds": 22, "show": false}
},
"points": ["tin", "toto", "alfredo", "elena", "projector#motor", "projector#lever", "projector#lens", "projector#gate", "projector2#motor", "projector2#lever", "projector2_e#gate", "calendar#page", "door#edge", "wall_n#look", "clock#face", "press#press", "alfredo#pocket"],
"offers": ["tin", "toto", "elena", "alfredo"],
"party": {},
"keys": {"lamp": 1, "door": 0, "beam_on": 1, "active": 1, "motor1": 1, "motor2": 0, "clock": 6, "tin_open": 0, "tin_at": "bench", "written": 0, "beat_next": ""}}
```
