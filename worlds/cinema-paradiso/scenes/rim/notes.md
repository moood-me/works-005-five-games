# Просмотровый зал

The small screening room in Rome (scenes.md «Просмотровый зал»), the epilogue. Engine 3, camera `roam`. Mood: a dark
plush room, one man alone in the middle of the rows; the reel of kisses; white light on his face. Modules: `cast`,
`kino` (the screen's frames, the beam, the projector), `beats`.

## The place (metres; x across, z north toward the screen; the start in the booth behind the back wall)

All numbers in `lib.js` (`G`). The room x ±3.6, back wall z 0, screen wall z 11, ceiling 3.6; dark fabric walls in
wooden panels, four small pink-shaded sconces (`lights`). Six rows of nine seats (copies) at z 7.6 … 3.1; Salvatore
in the middle of row 4 (x 0, hips z 5.22). The screen 5.2 × 2.9 m (0.9…3.8 m up) at z 10.9: `kino.screen`, every
frame of the reel a layer (`kiss_cut1…3`, `kiss1…8`, `white`), the element glows; the screen's light `on` beam_on.
The port in the back wall (1.0 × 0.62 m, its middle 2.3 m up, its point `port#window` — what the player touches):
the camera stands 0.9 m behind it, in the booth (dark walls, the booth's projector at the left, its vents glowing),
so the room is seen through the port as a frame in the frame — from behind him, as the priest in chapter I. The
beam (`kino.beam`, 10.85 m) from the port to the screen.

## Shots (`lib.js` CAM)

`PORT` — the booth behind the port (0, −0.9, eye 2.3, yaw 0): the room through it, he alone in row 4 from behind
(small, ≈ 0.1 of the frame — the rhyme with the priest asks for it), the screen. `FACE` — in front of him to his
left, ≈ 1.6 m (−0.81, 6.37; yaw 147): his face 3/4 in the screen's light, medium, the back wall and the port's
glow behind him. The camera goes from `PORT` to `FACE` in `kisses` along `ROUND` (14 s: forward through the port,
down the left side, round the row).

## Beats (`lib.js` film(scene); the world's `beats`)

| beat | after | what | tells | ≈ s |
| --- | --- | --- | --- | --- |
| rome | — | `PORT`: the room lit, he seated alone in row 4; the sconces dim to 0.15 (4 s); the screen dark. Under the touch on `port#window`. With `note_in_hand` 1 — the note in his right hand (the cast's part `note`) | rome:sat (≈5.5) | 8 |
| kisses | rome | the beam flares; on the screen the three cut in chapter I (2.6 s each; the first `jumps` hop at their crooked splice every 0.9 s), then kiss1…kiss7 faster (2.2 → 1.2 s), kiss8 at the end; he leans forward (`lean_seated`), `smile`, his eyes on the screen; the camera goes round the row to `FACE` (14 s) | kisses:start (1) | 20 |
| kisses_end | kisses | the last kiss held 5 s; the screen white; he sits back (`seated`); white light on his face and the rows; `smile` → `sad` → `smile`; held | kisses_end:white (6) | 18 |

Keys: `lights` (sconces), `beam_on`, `screen_film` (none · kisses · white), `reel` (the beat's: which frame of the
reel), `note_in_hand`, `jumps` (party keys, read by `from` — the film is a function of the scene — and by the screen's
animate).

## What is not here / found

- `lean_back_seated` (the cast's) is hands behind the head, not a slow lean back: in `kisses_end` he only settles back
  into `seated`. `lean_seated` bends the head down: his look at the screen lifts it.
- The rows are seen from the front in `FACE` (a card shows both sides): the seat backs' painting, mirrored.
- The sconces' glow and the room's light dim by `lights`; the room never goes quite black (ambient 0.5): he must read.

## Контракт для проверки

```json
{"beats": {
  "rome": {"after": [], "tells": ["rome:sat"], "seconds": 8, "show": false},
  "kisses": {"after": ["rome"], "tells": ["kisses:start"], "seconds": 20, "show": false},
  "kisses_end": {"after": ["kisses"], "tells": ["kisses_end:white"], "seconds": 18, "show": false}
},
"points": ["port#window", "port", "toto", "screen#screen", "beam#beam", "beam#tip", "beam#mouth", "projector#vents"],
"offers": ["port#window"],
"party": {"note_in_hand": 0, "jumps": 0},
"keys": {"beat_next": ""}}
```
