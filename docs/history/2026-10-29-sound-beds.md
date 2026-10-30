# The five games: the beds declared, changed with the scene's music (2026-10-29)

**Why.** Pavel heard a game's sounds fade in, out and in again at a scene change: the games switched their beds
themselves (`g.beds(levels, seconds)` before or after `g.scene`), so the bed changed while the old picture was still
on, and the day's earlier change in moood (`2026-10-29-sounds-like-music.md`) held all their sounds while a scene was
being made ready. Agreed with Pavel: sounds are the game's, music the scene's; a game *declares* its background (its
beds and levels) and moood changes it at the moment the picture changes — with the scene's music, its crossfade's
moment and seconds — or at once when no scene change is under way; the pause, the phone upright, the page hidden, a
scene standing hold the music and every sound together (moood `docs/history/2026-10-29-sound-beds.md`,
`bespoke.background`, `bespoke.onBackground`).

**What.** Around the World in 80 Days, Cinema Paradiso, The Elder Son, The Lady with the Dog, Scarlet Sails. In each: `g.scene(folder, state, {cut, beds})` — the scene's background, changed at its cut; `g.beds(levels)`
— within a scene, at once; no seconds of the game's own (the page's crossfade, 4 s; 0.3 s at the play's start).
Every g.beds that came just before (or just after) a scene's opening went into that scene's `beds` — through helpers
that open scenes too (Summer Book's `piece`, Moominpappa's epilogue `shot`, branches each with its scene); the rest,
after a beat or a mini-game, stay `g.beds`. The map's beds go with its show (`background`). `sound.js`:
`background(levels, seconds)` (was `beds`) given to the page once (`b.onBackground`, game.js); `unheard()` keeps no
levels and wakes nothing — a jump keeps what its step declares (`j.background`) for the show that ends it. The
levels are as they were. Sounds a mini-game drives, or a chapter starts and stops itself as an effect (the projector's
whirr, the pour, the fire's roar, a gust, the orchestra, the breath), stay the game's own calls. The checks
(`check/run.mjs`) check the beds a background names and that no seconds are given; the specs' sound sections say it.

**How.** Per game: story.js, jump.js, sound.js, game.js, chapters (and minigames where they declared), check/run.mjs,
its spec. The chapters by a script (a g.beds before the step's next `await g.scene`, nothing awaited between, into
its `beds`), the rest by hand. Checked: each game's `node bespoke/check/run.mjs <its world>` — nothing to fix;
`moood-check` on the repository — all right.
