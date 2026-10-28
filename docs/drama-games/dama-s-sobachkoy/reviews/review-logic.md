# «Дама с собачкой» — review of the logic as specified

2026-10-13. Read in full: `design.md`, `scenes.md`, `game.md`, `work.md`. Also the rules (`moood-me/moood:docs/writing/2026-10-13-scenarij-igry.md`),
the AP review-logic as a model, and the written AP framework (`ap/work/all-game/bespoke`: `game.js`, `story.js`,
`jump.js`, `check/run.mjs`, `check/fake.mjs`) and the header of `moood/web/site/bespoke/play.js`. Nothing was run.

## Verdict

**Can writers start? Yes, after 4 fixes** (#1–#4, about half a day for the author). The state machine holds: I walked
every path and found no dead end, no missing ending and no wait that cannot end.
**Does it meet the owner's requirements (logic side)? Roughly.** The length the owner is told (≈ 24–25 min) is counted
too high in the same way as in AP. One voiced story line contradicts the «Без лжи» ending. Chapter V's timeline breaks
between night and morning.

## Checked, no finding

- **Endings.** `facts.ending` depends only on `husband` and `wife`, and each defaults to `lie`. So every path, including
  skipped steps and minigames, has exactly one of the four endings, and each ending can be reached. No minigame result
  touches the ending.
- **Sides of the scales are never 0 where they are read.** `heart` moves ±1 at I.1, then ±2 at II.1, III.3 and V.1. When
  it is read at II.4 and III.1 it is ±1 or ±3. At V.3 it is odd. `anna` moves ±1 at II.4, then ±2 at IV.2 and IV.3. When
  it is read at IV.1 and IV.2 (`anna_life` is carried when the theatre opens, before the stairs choice) it is ±1. At V.3
  it is odd. The ranges −7…7 and −5…5 are exact.
- **Every conditional branch can be reached:** serious and habit at II.4, III.1 and V.3 (finger + beside = +1;
  pat + melon = −1), life and duty, `talk`, `spring`, `dog`, `melon`, road and home, heard and not heard. All 8 choices
  are always offered, so no choice is unreachable.
- **Names across files.** I compared every beat, moment, key, offer and point in §6 and §7 with the scene tables in
  scenes.md: they match (17 + 8 + 5 + 6 + 15 + 15 + 11 + 7 beats). All 109 lines in §8 are used in §6. Each speaker
  exists in `PEOPLE` and stands in the scene where it speaks, or speaks with `at = 'narrator'` (Р35, Р57, Р92). Each
  sound and bed used is in the §8 table. `carry` keys match each scene's party table, and their defaults match `carry`
  of a fresh state. The `after` chains match what §6 plays, in both orders of V.3. The counts of looks, parts and
  motions (47 / 13 / 26) add up.
- **Beds.** Every step names its full set of beds, and the after-play lines restore the set (crowd off after
  «Лорнетка», cicadas off at dawn, weep off before `cages`). `band` and `piano` are stopped at the end of the step.
- **Exits.** Every minigame either ends by itself (Лорнетка, Море, Тень, Поводок, У забора, Советоваться) or has the
  framework's «Дальше» after 60 s. Every minigame can be played with one pointer and has no hover. Hold-type minigames
  have the space bar as a second way.
- **Reopening scenes so party keys are fresh**: V.2 reopens «Москва» for `wife_knows`, IV.3 reopens «Город С.», and the
  epilogue reopens each scene.

## Findings

### SERIOUS

**1. Chapter V: he comes home from her at night, and next morning she «arrives».**
*Where:* game.md §6 V.1–V.2, Р81, Р91–Р92; design.md l.231, l.301 («жена у окна всю ночь; утром смотрит, как он ведёт
дочь»).
*What is wrong:* V.1 says «Он возвращался от неё поздно» and, with the truth, «Я был у неё». V.2 is the next morning:
the wife at the window is the consequence of the night before. In that same morning the red cap brings «Я приехала.
«Славянский базар»». Read in order, these say she was already in Moscow last night and arrives today. The seasons make
it worse. Р81 says she came «раз в два-три месяца», yet V.2–V.3 keep the season of her first trip (January snow, or
March thaw in the spring branch).
*Smallest fix (pick one; author, design.md + game.md):*
(a) Swap V.1 and V.2, which is Chekhov's order: morning with the daughter and the note, then the night («Где ты был» on
the way back from her), then the hotel. The wife at the window in the morning is lost; her knowledge still shows in
the epilogue and in the ending lines.
(b) Keep the order and add one narrator line at the start of V.2 that marks a new visit (one more paid line). Rewrite
design l.301 without «утром». Then decide the season of V.2–V.3 (thaw is the end of winter; two or three months later
is not).
*Checked in the text.*

**2. A skipped minigame makes the chapter say lines that were already said.**
*Where:* game.md §6 II.2 (`if !r.said` → Р27), III.1 (Р44), IV.1 (`!r.heard` → Р60), V.2 (lines «с номера `r.said`»);
§7 `skipped` of «Море», «Тень», «У забора», «За руку».
*What is wrong:* a skip (⏭, or «Дальше» after 60 s) returns `skipped`, which has `said: false` / `0` and
`heard: false`, whatever was actually said before the skip. Three cases:
- «Море»: skipped after its 12th second, Р27 (8 s) is said twice.
- «За руку»: a player who walks halfway and then waits 60 s for «Дальше» hears Р86… again from the start.
- «Тень» and «У забора» behave the same way.
The branch check cannot catch this, because it puts results in by hand. §4's rule «пропущенная мини-игра оставляет …
сказанное такими же» is broken by its own mechanism.
*Smallest fix (game.md §6 and §7):* the chapter keeps the count, not the result:
`let said = 0; g.play(zaRuku, {lines: [() => (said++, g.say(…)), …]})`, then the chapter says the lines from `said`
onward. Do the same with a flag for `sea`, `onFirst` and `onPiano`. Drop `said` and `heard` from the results and from
`skipped`.
*Checked in the text and in the framework code* (story.js `g.play`: a skip resolves to `minigame.skipped`).

**3. The length is counted the way that overestimated AP: ≈ 24–25 min is an upper bound, realistically ≈ 20–22.**
*Where:* design.md «Длина — посчитано»; game.md §11; work.md «Открыто: владельцу» 1.
*What is wrong:* I recounted every chapter by the script's own method and got 0.9 / 3.5 / 5.7 / 3.7 (3.2 for silent and
home) / 5.1 / **4.8** (written 4.4) / 0.8 min. So the arithmetic is honest apart from V. The method itself
overestimates in two ways:
- **Lines are added on top of beats that already hold for them.** scenes.md l.9: the scene «держит позу примерно
  столько, сколько реплика длится». `talk` is 14 s «под Р07–Р11» (16.8 s of lines), but the count gives 30.8 s.
  Lines total about 5.3 min on a path. Most are said over a beat, so about 2.5–3 min is counted twice.
- **`about` values exceed what the §7 rules give.** By the §7 rules: «Рядом» 25 → ≈ 10 s (0.95 at 0.25/s + 3.5 s),
  «Подманить» 25 → ≈ 13 (1 at 0.09/s), «Чай» 20 → ≈ 10, «Арбуз» 25 → ≈ 18, «С оглядкой» 30 → ≈ 15 (the alley empties
  every 10–12 s), «Найти» 30 → ≈ 15 (she is the 4th, at about 12 s), «Советоваться» 30 → ≈ 18. That is about 1–1.5 min
  per path.
`run.mjs` adds beats + lines + `about` in exactly this way (l.374), and work.md makes its printout «мера длины игры».
*Smallest fix:* say ≈ 20–22 min to the owner now (work.md «Открыто: владельцу» 1, design.md table). In §11, count a line
said during a beat only by the part that outlasts the beat (per beat: max(beat seconds, the lines said in it)). Set the
`about` values to what §7 gives.
*Checked in the text; the estimate of the overlap is my estimate.*

**4. «Без лжи»: in the finale Anna wishes «не лгать» after both spouses have been told.**
*Where:* game.md §6 V.3 `sovet` door → Р104 «Не прятаться бы, не лгать…»; design.md l.317 («Лгать больше некому»).
*What is wrong:* the line is said in all four endings. In `open` it contradicts the ending the player has just built.
It is a voiced line, so this is the kind of error that costs money later.
*Smallest fix (game.md §8):* make Р104 «Не прятаться бы…», which holds in all four endings because they still hide from
everyone else. The label «Не прятаться» stays.
*Checked in the text.*

### MINOR

**5. The watching stretch of about 117 s is real only if the map is not counted as an action.**
By the framework's rule (`run.mjs` l.441–463: each «Огни» touch, choice, letter and minigame is an action), the longest
stretches on any path are:
- I.1 dog choice → «Лорнетка»: 87 s (5 + 2.7 + 14 + 16.8 + 12 + 10.6 + 14 + 9 + 3).
- After «Советоваться» to the end: 59 s.
III.3 `say` → IV.1 «У забора» is 92 s of film (57.7 + 34.3), split by the chapter map and the IV title. If the map's
reveal and the two touches count as watching, that stretch is ≈ 105–117 s; this is the «117 s across the map». The
`silent` branch is ≈ 18 s shorter. With lines overlapping beats (#3), the real time is ≈ 80–90 s. Framework `run.mjs`,
as it is, will never report it.
*Fix:* game.md §11 should state the rule («касание шпица в «Огнях» — действие»), so that the principles reader and the
check agree. If the owner does not accept that rule, start «У забора» right after Р58 (drop the 12 s `fence` walk, so
`fence_wait` opens) and the stretch is under 90 s on any count.
*Checked in the text and in the framework code.*

**6. A director move started inside a minigame cannot be cancelled as §7 asks.**
«Арбуз» (`g.move('candle', 0.4, 10)`), «Море» (`g.move('dawn', 1, 40)`), «Рядом» and «Чай» use `g.move`. §7 says
«отменить свои b.act (action.cancel())». But `g.move` (story.js l.185–189) awaits the action and returns no handle, so
it cannot be cancelled. In «Море» it also blocks for 40 s unless it is left unawaited. The after-play `g.set` of the same
key probably wins, but this is not checked.
*Fix (§7):* a minigame moves its own keys with `const a = b.act('state', 'move', key, v, {over})` and calls `a.cancel()`
on `signal`.
*Checked in the code.*

**7. The prologue and epilogue need `choices: []` and `titles`.**
game.md §6 says «без выборов» and gives no `titles`. Framework `game.js` l.142 reads `ch.choices.length`, so the game
crashes after the prologue if `choices` is missing. `run.mjs` l.132 throws without it and l.133 reports `titles`.
*Fix (§6):* prologue `titles: ['Новое лицо'], choices: []`; epilogue `titles: ['С.', 'Москва', 'Ореанда'], choices: []`.
*Checked in the code.*

**8. `PLAYS` `wife` and `husband` are named but not defined** (§3.8). Write their eight choices, for example `wife` =
`open` with `husband: 'lie'`, and `husband` = `open` with `wife: 'lie'`. *Checked in the text.*

**9. «Тень»: the walk and the shades do not fit the fixed frame.**
With `count` 4 the game lasts 38–52 s. `walk_on` keeps Gurov walking «своим шагом» across 30 m, and the scene stops him
at the left edge. By about halfway he reaches the edge, and shades placed «слева от Гурова» are then out of frame or
behind him.
*Fix (scenes.md «Москва»):* his pace in «Тень» is about 0.5 m/s, and shadeN appears ahead of where he is now, inside the
frame. *My estimate.*

**10. «У забора» walks only forward.** Holding sends `walk_to` = 1. A player who passes the window (`gurov_at` > 0.68)
can never stand under it again and waits out the 35 s. *Fix:* holding on the left half of the screen walks back
(`walk_to` = 0), or releasing past 0.68 makes him step back to 0.6. *Checked in the text.*

**11. Small holes in the minigame rules.**
- «С оглядкой»: `g.watch` reports only changes, so the state of `watched` at the start is unknown. *Fix:* read it once
  with `g.get('watched')` (it is set at once, so it is exact).
- «Поводок» «вернуть» the wind: the bed is 0.5 from the step, but the minigame does not know that level. *Fix:* say
  «back to 0.5».
- «Чай»: the minigame returns `weep` to 0 on exit, then the chapter raises it to 0.3 again, so the crying dips. *Fix:*
  the minigame does not touch `weep`; the step's after-play line sets it.
- «Лорнетка»: the stranger is one of «двое последних отпущенных» before he stands, so he may be offered as an ordinary
  «Всмотреться». *Fix:* say he is offered only once he stands.
*Checked in the text.*

**12. `gate_home` has no `after`.**
After «Поводок» ends by 35 s with Anna at, say, 0.3, `from` snaps her to the gate, although scenes.md wants no cut
there. *Fix:* `after: ['autumn_walk']`, and the beat walks her to the gate from wherever she is. *Checked in the text.*

**13. Defaults in the branch check.**
§11 says «Тень», «За руку» and «У забора» run «с итогами по умолчанию и по одной партии с said: 0 / heard: false». But
the default (their `skipped`) already is said 0 / heard false, so the extra play is the same as all the others. The
results put in must be `said: true` / `4` and `heard: true`; after #2 this item goes away. «Тень» `said` is a boolean in
§7 and `0` in §11.
*About the claim of 512 plays:* it is possible. Framework `run.mjs` builds the 256 choice combinations itself (l.362);
making them 512 means taking each one with `povodok: {end: 'home'}` and with `{end: 'road'}`, a few lines. It is not
needed, though: `r.end` changes only the beats of III.2, never the state, so 256 + 1 play gives the same coverage.
What the check cannot see: the repeats in #2, the values of party keys (it checks names only), and real time (#3).
*Checked in the code.*

**14. Story order in design.md.**
l.18 and l.90 say: «Когда Анна в Ялте назовёт его лакеем, игрок уже знает больше её» / «Он видел мужа добрым — Анна
называет его лакеем». But II.1 (Р23 «лакей») comes before the letter (II.3) and before the husband is first seen
(III.2). It holds for Gurov's judgement in the theatre (IV.2), not for Anna's word. *Fix:* reword design.md. Otherwise,
the stranger at the pier «издали похож на фон Дидерица» cannot be recognised by the player either. *Checked in the
text.*

**15. Small mismatches.**
- Chapter II `season: () => 'autumn'`: its title appears on an autumn «Огни», then a summer night in Yalta.
  *Fix:* `'summer'`.
- The epilogue is `title: 'Эпилог'` in game.md and «Три окна» in design.md.
- The motion `anna_turn` (scenes.md `talk`) is not in the motions table; `stand_cold` is listed but never used.
- §6 III.3 says Р48 before the `say` beat, but scenes.md puts it inside `say`.
- work.md says «33 звука»; §8 lists 31.
- The I chapter header has no «Читает / оставляет» lines.
*Checked in the text.*

## Что верно

- Endings: exactly one on every path, also with skips; all four reachable. Scale parity is never 0 where it is read.
- All 8 choices are always offered, with their points, and each has a default.
- Names across files match one to one: beats, `after`, moments, keys, offers, points, speakers, sounds, `carry` ↔ party
  defaults.
- Every minigame ends or gets «Дальше». All can be played with one pointer. Beds are a full set per step and are
  restored after each game.
- The framework can do what the script relies on: dry steps, results put in, 256 (or 512) plays, and a printout of the
  watching stretches. The lengths add up as written, except V (≈ 4.8, not 4.4).

## Смотреть на картинках

- «Тень»: where Gurov is when each shade appears; all four shades inside the frame (#9).
- «Лорнетка» and «Найти»: rings on moving people, at least 44 px apart; is the 4th lady clearly not the others?
- «У забора»: is the lit window at `gurov_at` 0.6 visibly the place to stand?
- `gate_home` after «Поводок» ended by the clock: does Anna snap (#12)?
- «Огни»: the IV map with 3 rows and the final map with 5 rows in the middle 4:3.
