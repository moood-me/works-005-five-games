# «Новый кинотеатр „Парадизо“» — review of the logic (first edition)

2026-10-13. Read in full: `design.md`, `scenes.md`, `game.md`, `work.md`; the learnt document
(`moood-me/moood:docs/writing/2026-10-13-scenarij-igry.md`), the brief, the «Алые паруса» logic review (as the model). Framework checked
in code: the «Алые паруса» `bespoke/` copy (`game.js`, `story.js`, `jump.js`, `minigames/zhdat.js`). Nothing was run.

## Verdict

**Can writers start? Yes, after 4 fixes** (#1–#4: one short pass over game.md and scenes.md, about an hour). The
state machine holds: I walked all paths and every one has exactly one ending, also with skipped steps and minigames.
**Does it meet the owner's requirements, on the logic side? Yes.** Every minigame has an exit and can be played with
one pointer, beds of sound are cleared by the framework, and every one of the 110 lines can be reached. The length
(27–29 min, below the 35–40 asked) is told to the owner openly.

## What holds (checked, no finding)

- **Endings.** `scales.toto` moves ±1 five times (I.2, I.3, III.1, III.4, IV.6) and `scales.alfredo` three times
  (II.5, IV.3, IV.6). Both sums are odd in a full play, so neither is ever 0. `ending` comes only from `girl` and
  `elena`, with the defaults `let` and `future`. That gives exactly one of `turn` / `note` / `letters` on every path,
  and `turn` when V.3 is skipped. `knows` (= `note`) drives four things: Р93–Р96, Р101/Р102, «Записка» and
  `note_in_hand`. All four agree on every path. *(checked in the text)*
- **Reachability.** All 10 choices always offer both options, so 2^10 = 1024 is right. Every conditional line can
  happen: Р52 (hold + booth), Р71 (lie), Р80 (take), Р82 (film), Р83/Р84, Р93–Р99, Р101/Р102, Р104/Р105, Р107. The
  ⚑ choices number 8, as the whole-play map says. Every moment the game waits for (`x:y`) exists in its beat in
  scenes.md. I cross-checked all of them. *(checked in the text)*
- **Framework fit.** `g.beds` sets every unnamed bed to 0 (story.js l.167). Every step opens with
  `hero` + `beds` + `scene`, and branches that move to «Дом» call `g.beds({})`. «Дальше» comes after two
  `g.trouble()` or 60 s (story.js l.272–274), so no minigame can lock anyone in. Every minigame also ends by itself
  without input («Подглядывать», «Камера», «Сто ночей», «Смена») or on simple progress. The `wall: false` chapters I
  and the epilogue run on without «Плёнка» once there was a touch (game.js l.112). In a dry run `g.choose(null)` gives
  the first option (story.js l.233), so V.2 and V.5 do not stall. *(checked in the code)*
- **Skip = play.** Every `g.play` has an «после игры» line that puts the keys where the played game leaves them
  (exceptions: #7, #8). `skipped` has the same shape as the result. No chapter reads a minigame result, so a skip
  changes no state. *(checked in the text)*
- **Length is truly counted.** I recounted chapters I, II, III, IV and V from beat seconds, line lengths and `about`.
  I got 4.3 / 4.7 / 3.3 / 4.4 / 3.8–5.6 min against the author's 4.3 / 4.7 / 3.4 / 4.6 / 3.6–5.2. The epilogue comes
  out at about 2.6 min plus the whole-play «Плёнка», against 3.3. Overall it is within about 10 %, slightly
  optimistic. *(checked in the text, ±25 %)*

## Findings

### SERIOUS

**1. V.3 `car`: the player is asked to press in the middle of a beat.** scenes.md l.419 («Под касание; потом Елена
поворачивается к нему…»); game.md l.359–361.
A beat cannot stop (scenes.md l.20). `car` (18 s) plays straight through to Elena turning and him coming two steps
closer. `g.choose(null, {elena_grown: …})` comes after the beat (or during it), so the press «Подойти» either comes
after she has already turned or gates nothing. The point is also offered «до её поворота», which cannot be met.
*Fix (scenes.md + game.md):* split it. `car` ends with Salvatore stopped ten steps away and Elena with her back to us
(pose for the press). A new `meet` (after `car`, ≈ 8 s, tells `meet:turned`) has her turn and him come closer. In V.3:
`car` → choose → `meet`, and Р90… on `meet:turned`. *(checked in the text)*

**2. The branch check never says the three lines given through `opts`, so their voices would not be recorded.**
game.md §6 l.209–215 (Р04, Р05 via `onFirstBell`, `onCaught`; Р08 via `onCrooked`), §11 l.789–791 and l.802–804.
In the check every minigame returns `skipped` or a set result and never runs, so its `opts` functions are never
called. Р04, Р05 and Р08 are therefore missing from «список всех сказанных реплик … по нему записывают голоса». The
reverse list «реплики §8, не сказанные ни в одной партии — должно быть пусто» is also never empty.
*Fix (game.md §11):* in a dry run the fake calls every function in `opts` once after `g.play`, so their `g.say` calls
are recorded. Or the voice list is built from §8 itself rather than from what was said. *(checked in the code:
story.js l.260–262, minigames do not run unseen)*

**3. Names that cross files disagree. The check would catch them, but only after the writers have finished.**
- Пристань: the people list has `elena` (облики `elena`; `elena_grown`), so the element is `elena`. But «Нажимается»
  and game.md V.3 use `elena_grown` as the offer and as `at` of Р90–Р99 (scenes.md l.424–425; game.md l.359–363).
  *Fix:* either a separate element `elena_grown` in Пристань, or offer `elena` and say at `'elena'`.
- Просмотровый зал: «Люди: `salvatore`» (scenes.md l.461), while Р110 is said «у `'toto'`» (game.md l.389), and
  game.md §4 says Toto is the element `toto` at every age. *Fix:* scenes.md: «Люди: `toto` (`salvatore`)».
- «Смена»: `projector{to}#motor` with `to` = 1 reads as `projector1#motor`, but the element is `projector`
  (game.md l.517–519). A cheaper model will write it literally. *Fix:* «`to` 1 → `projector`, 2 → `projector2`».
*(checked in the text)*

**4. V.2: the son answers a question his mother did not ask, and both are paid voice lines.** game.md l.353–355,
Р84 l.656; design.md l.259–262.
Р85/Р86 («Я снял всё, что хотел, мама» / «Нет, мама») answer «ты счастлив?», which only Р83 asks. After Р84 («…Ни
одна не говорила так, будто тебя любит») there is no question. «Нет, мама» then reads as agreeing with her, and the
scale's meaning (Люди = an honest «no, I am not happy») is lost on the path where the milk was a lie.
*Fix (game.md §8 + design.md):* end Р84 with «…Ты счастлив?». It is one line, written once. *(checked in the text)*

### MINOR

**5. Chapter V shows its map, contrary to what the docs say.** game.md §3.3 l.59–60 («Глава V своей карты не
показывает (эпилог — `wall: false`)»).
In the framework, `wall: false` only drops the title before a chapter. The map after a chapter is shown whenever the
chapter has choices (game.js l.142), so V's map will show. *Fix:* either list it as a change («no map after the last
chapter before the epilogue») or delete the sentence and accept the map. *(checked in the code)*

**6. «No `whirr` in V before „Лента“» is broken by the script itself.** game.md l.346 vs l.375–376 (`memory:warm` →
`g.sound.whirr(0.4, 0.5)`) and l.352 (`camera8()` for the home projector); design.md l.74.
The reading check in work.md l.104 («в главе V нет `whirr` до „Ленты“») will flag the chapter writer for following
§6. *Fix:* say it as the sound table does: «кроме вспышки `memory` и домашнего проектора». *(checked in the text)*

**7. «Смена»: the after-play line ends somewhere other than where the played game ends.** game.md l.311 (`motor1` =
1, `motor2` = 0, `active` = 1) vs l.514 (`to` = 2, 1, 2). After three changeovers the played game leaves `active` 2
and `motor2` 1. The chapter then jumps the beam back to `port1` in front of the player, and a skip leaves something
different from a played game. *Fix:* after play `active` = 2, `motor2` = 1, `motor1` = 0. *(checked in the text)*

**8. «Подглядывать»: a skip during a kiss leaves the kiss on the screen.** game.md l.211–212 resets only `peek`,
`turn` and `bell`. `bell_end` comes after `peek` (`from` not applied), so `screen_film` stays `romance_kiss`.
*Fix:* add `screen_film` = `'romance'`. *(checked in the text)*

**9. V.5: the calendar insert stays open into «Лента».** game.md l.377–379; scenes.md l.302–303.
`window_strip` comes after `calendar`, so its `from` is not applied, and nothing sets `calendar` back to 0. The other
inserts are all closed by the next beat («склейка в комнату (`splice` 0)» and so on). *Fix:* after «Записка»
`calendar` = 0, or `window_strip` starts with «склейка в комнату (`calendar` 0)». *(checked in the text)*

**10. Keys missing from the lists the check compares against** (scenes.md):
- `wall_film` is set by the game (luch phase 2, after-play line, `smoke` state) but is not among the Площадь «Ключи
  игры» (l.204).
- `madman_x` is moved by «Камера» every frame (game.md l.495), but it is not in the «двигает каждый кадр — никогда
  рисунок» list (l.39–41).
- `mark_chalk` has no row in the Площадь key table.
- `alfredo_stays` (Вокзал, l.443) has no default for `states`. Say 1.
- The cast must give people points that nobody lists: `#hand_l`, `#hand_r`, `#shoulder`, `#collar`, `#pocket` (used
  by `reach` in `paper`, `photo`, `go_together`, `smoke_in`, `tin_shut`, `slap`). Add them to «Люди мира».
*(checked in the text)*

**11. Two beats whose start is unclear.** `rewind` (scenes.md l.145) is not marked «(после `now_open`)», so the check
will report a cut and its `from` applies. Mark it. `knock` (l.296) is «(после `alfredo_comes`)», but IV.3 reopens
«Будка» on it as the first beat, so its `from` must set: Alfredo on the stool, the projector running, the clock at
10, Toto gone. Write that in. *(checked in the text)*

**12. Moments inside long beats have no seconds.** `story_booth`/`story_door` (26 s, three moments, five lines ≈
19.5 s with breaths), `midnight`, `reels` and `demolition` give no time for `:99`, `:why`, `:hug`, `:tail` and the
rest. A scene writer guesses, and the lines may outrun the beat or bunch up. *Fix:* give the seconds as `now_open`
does (for example `story_*:start` 1 s, `:99` 10 s, `:why` 17 s). *(checked in the text)*

**13. Dates do not add up.** Toto is 8 in «площадь 1946 года» (scenes.md l.145), which puts his birth in 1938, but he
is «сорок семь; 1988» (design.md l.252). The note is on «календарь 1954 года» (scenes.md l.94; design l.291), when
he would have been 16 or 13, before the hundred nights and the summer. The calendar is drawn in an insert and may be
read. *Fix:* rewind to 1949 and the calendar to 1958, or leave the years off the picture. *(checked in the text)*

**14. Framework source.** game.md l.27–30 still has the Asher fallback «если к началу этой работы он не написан». It
is written: `moood-me/pavel--game--alye-parusa`, `bespoke/` on branch `ap-game/all` / `env/dev`. Name the branch and
drop the fallback. While there, also write out the six `PLAYS` (l.61–62: endings × hold/release) as the ten choices
of each. All six are possible (for example `note` + hold: hold, future, come → +1), but a writer should not have to
work them out. *(checked in the code)*

**15. «Сто ночей» needs the «Ждать» pattern spelled out.** game.md l.506–508. `g.choose` has no timeout (story.js
l.219–237), so «ожидание до 3 с» means racing it against a 3 s timer and then calling `g.withdraw()`, as `zhdat.js`
l.69–71 does. Name `zhdat.js` there. Also, `night_kind` «по кругу `clear`, `rain`, `wind`, `clear`, `feast`, `rain`,
`cold`…» is undefined for weeks 8–14. Write all 14 out (ending `cold`, which the after-play line sets).
*(checked in the code)*

**16. Small wordings that a literal writer will trip on.**
- «Плёнка»: «до 5 кадров в одной ленте» but «вся партия — две ленты (8 ⚑ и „Финал“)» (scenes.md l.479–480). Say
  5 + 4.
- «Луч» phase 1: say that the aim follows a *pressed* pointer, since there is no hover (game.md l.477).
- `demolition` with `place` `door` is «один на ступенях», but `with_mother` 1 puts his mother beside him (l.177).
  Say «без толпы».
- work.md counts 36 beats for Площадь and 28 for Будка; scenes.md lists 35 and 27.
*(checked in the text)*

**17. The ending check is a tautology.** game.md l.801: `facts.ending` always has a value by construction. Add the
checks that can fail: `note` ⇔ Р93 said ⇔ «Записка» played ⇔ `note_in_hand` 1 ⇔ Р107; `hold` ⇔ Р105; `kino` ⇔ Р85
⇔ `with_mother` 0; `frame` ⇔ `wallet`; `reel8` ⇔ `home_movie`. *(my suggestion)*

## Что верно

- I walked all 1024 paths by the two decisive pairs (`girl` × `elena`) and the two scales. There is one ending each,
  defaults included, and the conditional lines, the inserts and the Rome note agree with it.
- Every `g.say` speaker is in PEOPLE (15 voices, 110 lines). Every offer key in game.md is in that scene's
  «Нажимается», apart from #3. Every awaited moment exists. The carry keys and defaults match the scene tables.
- All 11 minigames can be played with one pointer, end without input or on simple progress, and have «Дальше». Their
  keys are in the scene's state lists (apart from #10).
- Sound: the framework clears beds every step, and the handles (`theme`, `camera8`) stop at the end of the step and
  on the signal. In the «Плёнка» beds are `{}`.
- Story logic is consistent across branches. On the `future` path, Р71 «Сейчас не вру» comes right after Alfredo's
  «Нет». It reads as intended dramatic irony that the player sees, and it is true of «Уезжай».

## Смотреть на картинках

- Whether the choice points stand in the middle 4:3 at the end of `alfredo_down` (three people), `seen` (Elena far
  away), `eve` (balcony and booth window across the square) and `funeral` (hearse and door).
- `car`/`meet` after the split (#1): whether Elena is readable with her back to us before she turns, at night, in the
  headlights.
- `changeover`/«Смена»: whether `cue` (a small dot on a far screen seen through the port) can be seen at 1080p.
- The insert `calendar`: whether a year is readable (#13).
