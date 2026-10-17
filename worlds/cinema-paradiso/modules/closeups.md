# closeups — hands and things close up

Seven inserts (`insert`) of the world's scenes — scenes.md "Close-ups": `splice`, `slate`, `thread` (the booth),
`viewfinder` (the square), `calendar`, `strip` (the booth), `wallet` (the station). No faces. One hand for every shot
(the hand model of Scarlet Sails): the boy's (8–10), Alfredo's (big, a shirtsleeve rolled up), the young man's, the
grown man's (Salvatore: a dark coat sleeve, a light cuff) — `closeups.WHO`, `closeups.handOf(who, {...})`,
`closeups.hand(g, o, light)`.

## How a scene shows an insert

```json
{ "id": "splice", "name": "Splicing", "insert": "splice",
  "code": "e.kit.closeups.splice(g, e);", "animate": "e.kit.closeups.spliceMove(e);" }
```
In the scene's `modules` — `cinema` and `closeups`; the insert's keys — in the scene's `states` (the table below). An insert
opens by its key 0 → 1 (no shot, no cut), no `iris`: from the middle over the whole frame.

- The frame's units — the frame's height, the origin in the middle (x −0.89…0.89 at 16:9); painted out to ±1.3 —
  **21:9 is full** (the table, the wall, the window, the night go on past the edges).
- The light — its own, painted (a lamp, a window, a street lamp); the scene's light does not fall on an insert.
- **The painting reads only keys that change no more than once a second**: `bent1…3`, `letters`, `crooked`,
  `threaded`, `loop`, `pages`, `jumps`. Everything that moves (`cut*`, `glue*`, `boy_reach`, `chalk_x`, `wobble`, `pull`,
  `fold`, `dust`, `strip_x`, `pan`, `elena_x`, `madman_x`, `rec`, `open`) is layers, moved by `…Move(e)`.
- Every point is within the middle 4:3 (|x| ≤ 0.58), y −0.36…0.33 (not under the plate, not in the band of speech). The
  points are there while the insert is open.

## The shots

| Insert | What is in the shot | Keys (default) | Points (the shot's middle 0, 0; y down) |
| --- | --- | --- | --- |
| `splice` | the bench under the lamp (a warm circle top right), the strip across it; three paper markers stick up over the frames `kiss_cut1…3`; Alfredo's left hand holds the strip down on the left, his right one with the scissors above; the boy's small hand at the right edge | `cut1…3` 0…1 (0) — the cut: the clipping with its marker slides off toward the boy; `bent1…3` 0/1 (0) — the cut is slanted (the painting of the splice's edge); `glue1…3` 0…1 (0) — the press's lid comes down on the joint, at 1 the splice's clear tape, the lid rises and goes; `boy_reach` 0…1 (0) — the boy's hand nearer the clippings | `splice#cutN` (−0.55 / 0 / 0.55, −0.18) — the top of the cut's line; `splice#cutN_end` (… , 0.12) — its bottom; the line upright, across the strip along the left edge of the kiss frame (0.3 of the frame's height); `splice#glueN` (…, −0.03) — the middle of the joint |
| `slate` | a slate in a wooden frame on the bench under the lamp, the letters «ALFREDO» dotted on it; the big hand with the chalk, the small one on it | `chalk_x` 0…1 (0) — the chalk along the line: the letters come up one by one, the hands follow the chalk; `letters` 0…7 (0) — how many letters are written already (the same, as painting); `crooked` a string of 7 `0/1` (`'0000000'`) — the crooked letters (a slant, a shift); `wobble` 0…1 (0) — the hand twitches | `slate#start` (−0.56, 0), `slate#end` (0.56, 0) — **a straight line**, through the letters' middles; also `slate#l0…l6` — the letters' middles (for an answer on a letter) |
| `thread` | the open film path: the feed reel top left (past the edge), the upper sprocket, the loop, the gate (lit by the lamp), the lower sprocket, the take-up reel on the right; the boy's fingers hold the film's end | `threaded` 0…5 (0) — how many stretches are threaded (painting); `pull` 0…1 (0) — the film's end along the stretch now (bits of the strip come up behind it); `loop` 0/1 (0) — the loop before the gate (the stretch 2 → 3 painted as an arc) | `thread#p0` (−0.5, −0.3), `p1` (−0.24, −0.2), `p2` (−0.1, 0.02), `p3` (0.1, 0.16), `p4` (0.32, 0.26), `p5` (0.52, 0.06); the stretch k — a straight line from `pk` to `pk+1` |
| `viewfinder` | the square at dusk through the viewfinder of an eight-millimetre camera: a rounded window, the crosshair and the frame, the counter «17 FT», a red dot; the church with its steps, the fountain, the bank with its balcony and door, the bus on the right; the colour of reversal film | `pan` −1…1 (0) — where the camera looks (the square slides under the crosshair); `elena_x` −1…1 — where the girl is in the square (−1 on the left … 1 on the right; in the frame she is at `(elena_x − pan)`); `madman_x` −1…1 (**−1**) — the madman runs across (seen while \|`madman_x`\| < 0.97); `rec` 0/1 (0) — the red dot blinks | — (`viewfinder` — the middle) |
| `calendar` | the booth's plastered wall, the cold light of a window on the left, the edge of the door's leaf on the right; a 1958 calendar on a nail, open at `DICEMBRE`, the months before turned over the top (their edge above the top); dust; a grown man's hand | `pages` 0…4 (0) — how many sheets are let down over December: `NOVEMBRE`, `OTTOBRE`, `SETTEMBRE`, `AGOSTO` (on August — four lines in pencil, not to be read); `fold` 0…1 (0) — the next sheet unfolds from the top down, the hand holds its edge; `dust` 1…0 (1) — the dust | `calendar#fold` (0, −0.3…−0.33) — the edge of the nearest turned sheet above the top (the "pull" goes down) |
| `strip` | the booth's port onto the square: only the cold evening in it (a lilac sky, stars, the broken glass); across it the spliced strip in a grown man's two hands at the window's edges; the frame in the middle of the window warm (the light behind), outside the window the strip in the room's dark | `strip_x` 0…1 (0) — the strip from right to left: at 0 `kiss_cut1` in the middle of the window, at 1 — `kiss8` (in order `kiss_cut1…3`, `kiss1…8`); `jumps` 0…3 (0, a party key; painting) — the first `jumps` of the three cut ones jump at the splice while in the light | `strip#hand_l` (−0.52, 0), `strip#hand_r` (0.52, 0) |
| `wallet` | the platform in the evening: the sky's lilac steel, the station's lamp; a grown man's hands open an old wallet, one frame (`kiss_cut2`) rises out of it between the right hand's fingers against the lamp | `open` 0…1 (0) | — (`wallet` — the frame in the fingers) |

## What the scene does

- Writes its insert's keys into `states` (the ranges and the defaults — from the table; `madman_x` −1, `dust` 1,
  `crooked` `'0000000'`), sets them to their defaults in `state`.
- The key `jumps` of the booth is a party key: the insert `strip` reads it as painting.
- Opens the insert by its key (`splice` 1), closes it — 0. The minigames move the keys; the chapter sets their outcome
  after the game.

## The layers (what `…Move` moves)

`splice`: `jointN` (the cut's line, after the cut), `tapeN` (the tape, by `glueN`), `pieceN` (the frame with its marker —
it slides off), `pressN` (the press's lid and the hand on it), `scissors`, `scissors_shut`, `left`, `boy`, `lamp`.
`slate`: `l0…l6` (the chalk letters), `hands`, `lamp`. `thread`: `seg0…5` (bits of the stretch now), `tip` (the film's
end and the fingers). `viewfinder`: `square` (the square), `girl`, `madman`, `tone`, `mask`, `rec`. `calendar`: `fold`,
`hand`, `dust`. `strip`: `tape`, `f0…f10` (the frames), `dim` (the room's shadow outside the window), `warm` (the light
in the window), `left`, `right`. `wallet`: `lamp`, `body`, `flap`, `frame`, `left`, `right`.

## Checked

A trial scene "Close-ups (trial)" (all seven inserts with a showcase; the commit f6d2ae3 and those after it in the
branch `pd/closeups`) — pictures on the GPU at 21:9 and 4:3: no errors in the code, the points where the hands are.
Before the merge the trial scene was taken away.
