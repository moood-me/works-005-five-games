# The games' own sounds wait with the play as its music does (2026-10-29)

**Why.** Pavel: «пауза ставит на паузу музыку с фейдом, а звуки без фейда … пока сцена только открывается … звуки
начинаются еще пока она готовится, а музыка начинается только когда сцена готова. сделай звуки как музыку.»

**What.** moood now runs a game's sound context through its "sounds" output (`MooodVolume.output`, moood
`docs/history/2026-10-29-sounds-like-music.md`): it fades the sounds out and back in on the play's pause, holds them
while the scene stands or is being made ready (the play's start, between scenes), and resumes the context as soon as
the browser lets sound begin. The games here stopped fighting it: their `sound.js` no longer suspends or resumes its
AudioContext — no `pause(on)` (and no `b.onPause(pause)` in game.js), no `wake()` / `awake` gate (game.js no longer
wakes it as the map is left: the map's own sounds are heard from the first touch, as the music is); the checks
(`check/run.mjs`) no longer list `pause` and `wake` among the sounds. Each game's sounds themselves are unchanged.
