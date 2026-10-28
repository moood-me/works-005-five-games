# «Старший сын» — review of the logic as specified

2026-10-14. Read: design.md, scenes.md, game.md, work.md (all, then the checked parts again); the learnt document
`moood-me/moood:docs/writing/2026-10-13-scenarij-igry.md`; the «Алые паруса» logic review (model); the written AP framework
`ap/work/all-game/bespoke/` (`game.js`, `story.js`, `jump.js`, `check/run.mjs` headers). Nothing of the game was run; the
1536 choice combinations were enumerated with a 30-line script over `EFFECTS` + `facts` as written in game.md §5.

## Verdict

**Can writers start? Yes, after 9 fixes (one blocker, eight serious) — about half a day of the author's work, all in
game.md and scenes.md.** The state machine is sound: one `EFFECTS` table, ten unconditional choices, `facts` with full
defaults, exactly one ending on every path.
**Conforms to the owner's requirements (logic side): roughly.** Every minigame has an exit and a one-pointer input.
What breaks is local: one key name used twice, an «Окна» race, two minigames whose inputs work against their hints,
skipped walks, and the framework sections written against Asher's code, not AP's.

## What holds (checked, no finding)

- **1536 and `EFFECTS` agree.** 2⁹·3 = 1536. All ten choices are asked on every path (none sits in a branch). `EFFECTS`
  has every option id that §6 offers, letter for letter. The ranges are right (`home` −4…7, `lie` −6…8 as totals). The
  PLAYS column `home / came` is correct for all five rows. Enumeration: told × train × came — all 12 cells are reached
  (80–188 plays each). `hurt` is reached both ways on the `self` path (176 / 592). *проверено в тексте (перебором)*
- **Endings.** `ending` comes only from `truth` and `train`, defaults `self` and `stay` → exactly one ending on every
  path, also with skipped steps. Minigame results never touch the party (§7), so skipped minigames cannot change it.
- **Defaults of party keys** in scenes.md equal `facts` of an empty party for all 15 key×scene pairs (`warm` 0.36,
  `frost` 0.25, `came` father, `box_hand` 1 …). The `carry` table equals the «Ключи партии» tables of Платформа, Улица
  and Дом key for key.
- **Names crossing files.** All 114 lines are used in §6, each in its condition. Speakers are in `PEOPLE`; window voices
  speak at `winN` / `mak_window`. Every offered ref is in a scene's «Нажимается» table and in the pose under its choice.
  The §7 keys, points and moments are in the scenes' key tables. The sounds of §6/§7 are in the §8 table. Beat counts in
  work.md (12/19/31/7/4) match the scene tables.
- **Exits.** The framework's «Дальше» (two troubles or 60 s) covers every minigame. Окна, Рюкзак, Вёдра, Стекло,
  Табакерка and Пальто also end by themselves. All are played with one pointer (hold, drag or tap), with keys as a second
  way.
- **Beds.** Every step opens with a full `g.beds` set. Minigames that raise a bed («Иней», «Вёдра») return it on
  `signal`, and the chapter sets it again «после игры». The `march` handle is stopped at the step's end. The `pour` bed
  dies at the next step.
- **Counted length.** I recounted II, III, IV and V from the beat seconds, lines, `about` and 8 s choices. They agree
  with design.md within 1 s each (270 / 197 / 233 / 214).

## Findings

### BLOCKER

**1. `box` means two things in «Дом Сарафановых».** scenes.md: «Крупные планы» row `box` ("Дом, `box` (0/1)"); Дом
«Ключи» (`box`, `box_mode`, … — вставка); Дом «Ключи партии» (`box` = `cupboard` · `busygin`); game.md §5 `carry`
(`box: f.box`).
On every opening of Дом, `g.scene` sets `box` to `'cupboard'` or `'busygin'`. That is the same key that opens the
full-frame insert «Табакерка», and both strings are truthy. Then «Табакерка» sets it to 1 and the party value is lost
for the rest of the scene. Either the insert covers every Дом scene from `kitchen` on, or the box stands in the wrong
place. The branch check will not see it: the key "is in `states`".
*Fix:* rename the party key to `box_where` (`cupboard` · `busygin`) in game.md §5 `carry` and in scenes.md Дом «Ключи
партии» and in the beat rows that read it (`wall`, `wake`, `pack`, `confess`, `home_late`, `home_anyway`). *проверено в
тексте*

### SERIOUS

**2. «Окна»: a second window can be pressed while Бусыгин is still on his way to the first.** game.md §7 «Окна».
"Пока есть горящие, игра предлагает их", and nothing withdraws the offer during a knock. If the player presses window M
on the way to N, `knock` becomes M. The waits for N's `knock:hit` / `knock:done` then never come: each ends only by the
60 s timeout of `g.told`. Meanwhile the refusal for N and M can play at once. And a window that goes dark by itself
leaves a stale offer: `hub.offer` replaces its resolver, so the earlier promise never settles.
*Fix (§7 «Окна»):* "While a knock is under way, nothing is offered (`g.withdraw()`). Offer again after `knock:done` +
1.6 s and after each window that goes dark by itself — one `g.choose(null, {…all lit…})` at a time, raced with the
9 s self-darkening timer." *проверено в тексте и в коде (AP `story.js` `listen().offer`)*

**3. A skipped walking minigame leaves people in the middle of their path, and the next beat assumes the end.** game.md
§6 III.1 (`down` = 1 after «Под руку», then `bottom` "у ворот на дороге") and II.6 (`sneak` = 1, then `caught` "у
входной двери"). scenes.md «Общее»: a beat `after` another does not apply `from`, and "Люди идут к цели своей
походкой… не быстрее".
Skipped at `down_at` 0.3, the two still have ≈ 17 m at 0.8 m/s ≈ 22 s to walk, while the 14 s `bottom` already plays
the farewell at the gate. «На цыпочках» is the same over up to 6 m of tiptoe. The rule (learnt document: the skipped
game leaves the same trace in the scene) is broken twice. A smaller case: «Вёдра» skipped mid-carry leaves the `bucket`
part in his hand (`vyodra` = `none`: "стоит, где стоит").
*Fix (scenes.md):* `bottom` and `caught` are not `after` `meet` / `sneak`: they open by a cut on their own `from`, at the
gate and at the door. game.md §6 says `{cut: true}` for them. `vyodra` = `none` also drops the bucket. *проверено в
тексте*

**4. «Под руку»: the catch fights the gesture that walks.** game.md §7 «Под руку».
The player walks by holding the pointer down. At a slip the game waits for a **new** press within 1.2 s, and the hint
says «Держи его!». A held pointer is not a new press, and the hint tells the player to keep holding. So he falls on
every ice strip until «Дальше». The 1.2 s window is also exactly the `falter` length, with no reaction margin.
*Fix:* at `pod_ruku:slip` the walk stops (`down` = `down_at`), the hint is «Коснись — поймай!», and any `pointerdown`
(or a release-and-press) within 1.5 s catches. *проверено в тексте*

**5. «Следом»: being seen is decided at the very instant the turn begins.** game.md §7 «Следом»; scenes.md Косогор
`sar_go` ("если в момент оглядки `hold` = 1").
The player has no warning before `sledom:look` and no time after it, so holding at that instant always counts as seen.
Only a player who has learnt the 0.25 / 0.5 / 0.75 stops can avoid it. In practice: two troubles, then «Дальше».
*Fix (both files):* the scene says `sledom:look` as the head starts to turn. The game and the scene judge `hold` 0.6 s
later. *проверено в тексте*

**6. Map after chapter V and the whole-play map are not what AP's `game.js` does.** game.md §3.8 and §6 V ("После главы
«Состава» нет: эпилог `wall: false`"); scenes.md «Состав» ("до 6 строк… пять `⚑` глав I–IV и «Финал»"); AP `game.js`.
In AP, `wall: false` removes only the **title** before a chapter. The map after a chapter is shown whenever
`ch.choices.length` — and V has two choices. So before the epilogue the player would see a map with `truth` / `train`,
i.e. the ending. AP's `whole()` takes every `⚑` of every chapter, V included: 5 + 2 + «Финал» = 8 rows, against
«Состав»'s maximum of 6.
*Fix (§3.8):* "no map after the last chapter before the epilogue; `whole()` takes the `⚑` of chapters I–IV only". Also
count two «Составы» per transition (map + title) in design.md «Объём». *проверено в коде (AP game.js)*

**7. The framework sections are written against Asher's code, but AP's framework exists and already has most of them.**
game.md l.5–8, §1 ("Ашеры, с правками §3"), §3.10 ("`jump.js` … одна правка"); work.md «Каркас» ("те же файлы игры
Ашеров v2").
AP's `story.js`, `game.js` and `jump.js` already have: `g.beds`, two-sided scales, `g.gauge` bare, `cut`, `g.trouble` +
«Дальше», `g.hint`, `g.mark`, `PLAYS`, and `jump(target, quiet, {result})`. Rebuilding them from Asher's code invites
drift. What is really new here: `EFFECTS` + `g.apply`; «Состав» instead of «Даль» (`go`, semaphore); the `g.choose`
hint text; no `g.hero` / `g.letter`; the map rules of #6.
One line is also dangerous: "шкалы и метки набора считаются из его выборов по `EFFECTS`" (§3.10). In AP, a PLAY's state
at step n comes from playing steps 0…n−1 unseen (`ran()`), which already goes through `g.apply`. A writer who instead
sums `EFFECTS` over the PLAY's choices adds the future: a jump to II.1 of «Опоздал — вся семья» would open with
`home` 6.
*Fix:* game.md §1/§3 and work.md: "copy AP `bespoke/` (game.js, story.js, jump.js, ui.*, check/), then these
changes"; §3.10: "PLAYS as in AP `game.js` `ran()` — the steps before, played unseen". *проверено в коде*

**8. The automatic check, as specified, fails on its own game.** game.md §11, scenes.md «Общее» (contract block), AP
`check/run.mjs` l.110.
(a) Moments must be `<кусок>:<момент>` or belong to a key in `acts`. `pod_ruku:slip` belongs to neither: it is said
while `down` moves. `sledom:look/on/club` belong to the action key `sar_go`, not `sledom`.
(b) "каждая метка, которую поставил тост, читается где-то (`facts`)": `marks.sarafanov`, `marks.nina` and
`marks.nina_stay` are never read by `facts`. They are paid through `c.box`, `c.crossing` and `c.kudimov` (§5 says so),
so the check will list three marks as "без читателя" on every run.
*Fix:* rename the moments to `down:slip` and `sar_go:look` / `sar_go:on` / `sar_go:club` (or let `acts` declare its
moments by name). Rule (b): "a mark, or the choice that set it, is read by `facts`". *проверено в тексте и в коде*

**9. Р90 puts a word in Нина's mouth that she cannot know.** game.md §6 V.1 (`f.knows ? Р89 : Р90`), §8 Р90 «Хорошо, что
ты к нам опоздал».
Р90 is said exactly when Нина does **not** know the truth (`roar`, `brother`, or a skip). "Опоздал" is the word of the
train, and the player hears her knowing. That blurs the one thing the porch shows (head on shoulder vs a sister's
hand), and the line is a paid recording.
*Fix:* Р90 «Хорошо, что ты нашёлся» (or «…что ты к нам приехал»). *проверено в тексте*

### MINOR

**10. Continuous action cut by a fade.** A step that reopens the same scene without `cut` fades the page ("ход
времени", §3.6). These moments are continuous:
- I.2 `neighbor` (straight after `last_window`, same corner);
- II.4 `box_out` (straight after the Галя talk);
- V.3 `run_out` ("Дверь распахивается" right after `go_out`).

*Fix:* `{cut: true}` in these three. *проверено в тексте*

**11. Idle rules that switch off after one touch.**
- «Иней»: "через 12 с от начала без единого движения". One short rub, then nothing: `hole` < 0.6, the train never comes,
  and only «Дальше» at 60 s ends it.
- «Табакерка» and «Пальто»: "10 с без нажатия" does not say from when.

*Fix:* "12 s since the start or the last move"; "10 s since the last press". *проверено в тексте*

**12. `home_late` and the box on the table.** scenes.md Дом «Ключи партии» `box`: `from` of `home_late` sets `box_at`
`none` for `busygin`. But the beat needs `table` (laid down in `confess`; `home_late` happens only after `self`). Also
`home_late:box` is written only in the `table` case, while the game says Р106 at it in the `shelf` case.
*Fix:* `home_late` `from`: `busygin` → `table`. `home_late:box` is said in both cases, when the box stands before him.
*проверено в тексте*

**13. The prologue train goes the wrong way.** design.md Пролог, scenes.md `gone` ("тронулась влево", `train` 0 → 0.35)
against the Платформа `train` key (0 → 1 = leaves to the **right**; `wave`, `stays`, `away` use that).
*Fix:* the prologue train leaves to the right (the same 23:40 train as in V). *проверено в тексте*

**14. PLAYS never reach Р102 / Р103.** game.md §5. Р102 needs `box_hand` (refuse + someone came + go), and Р103 needs
`self` + go + someone came. No row has either.
*Fix:* add «В субботу — семья, табакерка в дверях»: said, remembered, refuse, stay, approach, brother, ask, blame,
self, go → `home` 5 / family, `hurt` 1. *проверено в тексте (счёт)*

**15. Four toasts at once.** IV.3 `blame` gives Вместе ↑, Ложь ↑ and two marks — four. §9 allows three. *Fix:* one mark
toast «Сильва и Васенька это запомнят.» *проверено в тексте*

**16. Small disagreements between design.md and game.md.**
- Р101 «Володя!» is said for `family` too (game.md, scenes.md `last`), but design says only for the father alone.
- Р110 «Табакерка уехала с ним» is said only for `suitcase` + `busygin`, though the box also leaves with him when given
  in the doors (`boxHand` + go).
- design.md «В субботу» says "фраза кларнета обрывается, как всегда", but that ending has no clarinet in game.md.

*Fix:* settle each in one file. *проверено в тексте*

**17. Smaller holes.**
- `lie` can sum to 9 before V.2; it is clamped at 8, so a `silent` play ends at 7, not 8. Either set `max: 9` or keep
  the clamp knowingly.
- `strike(9)` is 9 strokes at 1.1 s = 8.8 s, but the scene says "≈ 10 с". Say "`table:in` 8.8 s after `table:nine`".
- `dawn`'s `from` must set `camera_on` `none` (it follows `away`, where the camera is in the carriage).
- `hurt` has no default in Дом.
- Prologue "44 s (с первым «Составом»)" does not count the first «Состав».

*проверено в тексте*

## Что верно

The one `EFFECTS` table, the 1536 combinations, the ranges, the PLAYS arithmetic, `facts` and its defaults: all
consistent, checked by enumeration. There is exactly one ending on every path, also with skips, and every ending × came
cell is reachable. Every offered ref, speaker, line number, minigame key, point and sound crosses the files under the
same name, except #1 and #8a. Every minigame has an exit and a one-pointer input. The beds are set in full each step.
The counted length of chapters II–V is truly counted.

## Смотреть на картинках

- `last`: `train#door` and Сарафанов (or `far_window`) at least 0.15 apart in the middle 4:3. «Володя!» from a figure
  of at least 0.15 on the stairs.
- `gone`: the tail lights still in 4:3 at the end (the train stands while the game waits for the press).
- «Под руку» / «Следом»: are the slip and the turn of the head readable at that size before the game judges?
- Дом after `box_out`: no insert left over the frame (#1).
