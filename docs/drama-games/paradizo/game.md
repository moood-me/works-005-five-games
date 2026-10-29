# Новый кинотеатр «Парадизо»: игра в коде

> С 2026-10-16 (мультиязычность, `moood-me/studio:docs/history/2026-10-16-multilang.md`): код и тексты — по-английски, русский —
> перевод (`lang/`); люди — `bespoke/people.json`, реплики — `b.say` рантайма; сцены, модули, мини-игры — с английскими
> именами (список — `moood-me/studio:docs/history/2026-10-16-multilang-migration.md`), названия §7 в `HANDS` — английские, реплики §8
> (`lines.mjs`) — английская копия; табличка — ALFREDO (7 букв, `'0000000'`); раздел проверки в `notes.md` —
> «Contract for the check». Ниже — как было сделано до этого (и `scenes.md`, `work.md`, `design.md` рядом).

2026-10-15, четвёртая редакция (после третьего чтения). Как устроен код игры: по этому файлу и [scenes.md](scenes.md)
пишется всё в её репозитории. Замысел — [design.md](design.md) (история — только оттуда); кто что пишет и в каком
порядке — [work.md](work.md).

Экран — любое устройство лёжа (альбомный кадр): всё, что важно (люди в свои моменты, каждая точка, которую нажимают),
— в средних 4:3; сцены и вставки нарисованы шире, так что 21:9 полон. Всё делается одним указателем (мышь или один
палец), без наведения и без клавиатуры. Мини-игры — на языке мини-игр (§7).

## 1. Репозиторий игры

Игра: тип `bespoke`, название «Новый кинотеатр „Парадизо“», мир `pavel--paradizo` (сцены на языке `artist3.md`, стек
движка 3). Меняются только `game.json` и `bespoke/**`.

| Файл | Что это | Откуда | Область (work.md) |
| --- | --- | --- | --- |
| `game.json` | `{type: "bespoke", title: "Новый кинотеатр «Парадизо»", description, genres: {"драма": 80, "отношения": 70, "погружение": 60}, world: "pavel--paradizo", scenes: []}` | создаёт MCP | координатор |
| `bespoke/game.js` | вход: порядок глав, цикл, сохранение, «Плёнка» между главами, переходы автора, `PLAYS` | каркас «Алых парусов v3», правки §3 | Каркас |
| `bespoke/story.js` | словарь шага (`g`), `PEOPLE`, `SCALES`, `SCENES`, `ENDINGS`, `facts`, `carry`, `listen` | каркас «Алых парусов v3», правки §3–§5 | Каркас |
| `bespoke/jump.js` | шаг, сыгранный невидимо до мини-игры | «Алые паруса v3» как есть | Каркас |
| `bespoke/ui.js`, `ui.css`, `fonts.css` | всё, что игра показывает поверх сцены | свои (устройство — как у «Алых парусов») | Каркас |
| `bespoke/sound.js` | звуки страницы, синтез | свой, по образцу «Алых парусов» | Звук |
| `bespoke/chapters/prologue.js`, `1.js` … `5.js`, `epilogue.js` | главы | свои | Главы |
| `bespoke/minigames/<имя>.js` | одиннадцать мини-игр на языке мини-игр (`b.minigame`; без своих css) | свои | Мини-игры |
| `bespoke/check/run.mjs`, `fake.mjs` | проверка веток: node, без движка и без картинки (§11) | по образцу «Алых парусов» | Проверка веток |

**Каркас-источник** — игра «Алые паруса v3» (`pavel/alye-parusa-v3` на мире `pavel/alye-parusa-v3`, движок 3;
`read_game` / `game_repo`), папка `bespoke/`, ветка `env/dev`. Берётся как есть, не переписывается. Всё «парусное»
(кораблик, компас, `korablik`, «Даль», `tale`, `sea`) убирается. Мини-игр каркаса нет: наши пишутся на языке мини-игр
(`moood-me/moood:docs/games/minigames.md`, `moood-me/moood:docs/games/miniux/language.md` в main).

## 2. Что даёт страница

`bespoke` (`b`) — `moood/web/site/bespoke/play.js`, шапка файла — полный список. Игра берёт: `b.show`, `b.specOf`,
`b.get/set`, `b.on`, `b.offer`, `b.say`, `b.hush`, `b.where`, `b.frame`, `b.act('state', 'move', …)`, `b.layer`,
`b.css`, `b.saved`, `b.keep`, `b.restart`, `b.pause`, `b.game.mine`, `b.minigame` (язык мини-игр: `start`, метки,
жесты, отклики, плашка, `skip()` — шапки файлов `moood/web/site/bespoke/minigame/`). Слушателей `b.on` ставит один `listen(b)`; шаги и
мини-игры слушают сцену только через `g.told`, `g.when`, `g.watch`. **`b.get` у значения, которое движется, отдаёт
цель, а не место**: где сейчас то, что игра двигает сама, она считает сама. Каждая смена сцены (`b.show`) строит её
заново — сцены не кешируются.

## 3. Каркас: что берём и что меняем

Берём у «Алых парусов v3» как есть: цикл глав и шагов, сохранение после каждого шага, шаг заново, ⏸ ⏭ ☰, переход к
мини-игре, `hub`, ожидания `told/when/arrived/watch`, `say`, `choose`, `beat`, `play`, `move`, `wait`, `title`,
`g.hero`, `g.beds` (названные подложки к уровню, **остальные к нулю**), `g.scene(…, {cut})`, `facts/carry`, «нет
досрочного конца», `g.hint`, `g.mark`, `jump(…, {result})` для проверки веток, «партия как…» (`PLAYS`), `g.letter`.
Карта после главы показывается, если у главы есть выборы — и после главы V тоже (перед эпилогом).

Берём так же, как они сделаны в «Алых парусах v3» (их `docs/alye-parusa/game.md` §3.10–§3.13, §7): **мини-игра — на
языке мини-игр** (`g.minigame({phrase})` → `b.minigame.start`; `hands.js`: `keys`, `until`, `once`); **обычный выбор —
тоже язык**: `hub.offer` (через него `g.choose` и лампа «Плёнки») — `b.minigame.start({plate: false})`, метка на
каждой точке, касание открывает её лепестки — всегда, даже из одного (подписи вариантов в §6 — это слова лепестков);
`b.offer` не берётся (на движке 3 он — ошибка). Кнопки «Дальше» нет, мини-игра всегда проходима, ошибка стоит
секунд. **⏭ в мини-игре — у всех** (решение владельца: игрок не должен застрять, если что-то сломалось; это страховка,
не путь — правило §7): он зовёт `b.minigame.skip()`, мини-игра отдаёт `skipped` по `signal`. Вне мини-игры ⏭
пропускает шаг — только автору (`b.game.mine`): пропущенный шаг не оставляет выбора.

Меняем (каждое — одним способом):

1. **Шкалы** — `SCALES` (§5): `toto` (Кино ↔ Люди) и `alfredo` (Держать ↔ Отпустить). `g.hero('toto' | 'alfredo'
   | 'both')` — шкала героя в полную силу, другая на треть.
2. **Служебная сцена — «Плёнка»** вместо «Дали»: нажимается лампа, `hub.offer({'lamp#lamp': options})`, подсказка
   «Коснись лампы». Состояние: `{chapter_number, chapter_title, map, reveal: 0, lamp: 1}`; `reveal` → 1 за 3.5 с
   (титул) или 2.5 + 1.2 с на строку. Самая первая «Плёнка» (перед прологом) — без титула, только лампа: первое
   касание, после него страница звучит. Глава с `wall: false` идёт без титульной «Плёнки» перед собой: глава I и
   эпилог. В «Плёнке» — `g.beds({})`, шкалы скрыты.
3. **Карта.** После главы — все её строки (`⚑` и `~`); лампа: «Дальше», «Пройти главу заново». После эпилога —
   «Плёнка» со всей партией: девять строк `⚑` (с номером главы) и строка «Финал» из трёх `ENDINGS` — три ленты (4 + 3 +
   3 кадра); лампа: «Сыграть заново» (`b.restart()`) и, для автора, переходы.
4. **`PLAYS`** (☰ автора, «партия как…») — шесть наборов, все двенадцать выборов каждого; шкалы набора считаются из
   его выборов:

   | Набор | frame | milk | booth | camera | nights | elena | stay | station | look | girl | ask | funeral |
   | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
   | «Пусть останется», держит | leave | truth | hold | speak | wait | truth | stay | come | back | let | — | walk |
   | «Пусть останется», отпускает | take | lie | release | film | booth | future | go | never | no | let | — | apart |
   | «Записка», держит | leave | lie | hold | film | wait | future | stay | come | back | follow | ask | walk |
   | «Записка», отпускает | take | truth | release | speak | booth | future | go | never | no | follow | bye | apart |
   | «Письма», держит | take | truth | hold | speak | wait | truth | stay | come | back | follow | bye | walk |
   | «Письма», отпускает | leave | lie | release | film | booth | truth | go | never | no | follow | ask | apart |

   (Альфредо: держит — +3 или +1, отпускает — −1 или −3; все шесть достижимы.)
5. **Письмо** — `g.letter({text, sign, kind, voice})`: `kind` `note` (лист календаря, карандаш), `letter` (лист в
   линейку, чернила), `envelope` (конверт со штампом, текст — надпись на нём); `voice` — `() => g.say(…)` (литерал
   §8), говорится, пока лист раскрыт. Нажал — развернул, нажал — сложил; звук `paper()`. **Глава ждёт, пока игрок
   раскроет и сложит лист** — это действие игрока.
6. **Итоги рук.** `g.play` пишет итог мини-игры (сыгранной или пропущенной — её `skipped`) в
   `g.state.hands[<файл>]`; так он доходит до истории (§5, `facts`, `carry`; таблица §7 «Куда идёт итог»).
7. **Стиль** — §9 (интертитры; стиль языка мини-игр — `b.minigame.style`).

## 4. Словарь шага (`story.js`), точные подписи

```js
export const SCENES = { square: 'Площадь', booth: 'Будка', hall: 'Зал', home: 'Дом Ди Вита', quay: 'Пристань',
  station: 'Вокзал', rome: 'Просмотровый зал', strip: 'Плёнка' };
export function facts(state)            // §5
export function carry(title, facts)     // §5
export function context(b, view, hub, state, j = null)  // → g
export function listen(b)               // → hub

g.state; g.signal; g.sound
g.hero(who)                             // 'toto' | 'alfredo' | 'both'
g.beds(levels, seconds = 2)             // {имя подложки: уровень}; остальные — в ноль
await g.scene(title, state = {}, { cut = false } = {})
g.set(key, value, seconds); g.get(key)
await g.move(key, value, seconds, ease)
await g.wait(ms)
await g.told(text, ms = 60000)          // → true | false
await g.when(key, test, ms = 60000); await g.arrived(who, ms = 60000); g.watch(key, fn)
await g.say(who, text, at = who)        // who — ключ PEOPLE; at — 'id' | 'id#точка' | 'narrator'
await g.choose(choice, {ref: [{id, label}], …})   // → id варианта; пишет state.choices[choice]; choice null — не пишет
g.withdraw()
await g.beat(name, { wait = true } = {})
await g.play(minigame, opts = {})       // → итог мини-игры (или её skipped); пишет g.state.hands[файл]
g.minigame({phrase})                    // → mg: мини-игра на языке, только внутри run (§3, §7)
g.hint(text, afterMs = 0)               // → off(); не в мини-играх (их подсказывает язык)
g.scale(name, delta); g.gauge(name, { rule = true } = {})
g.mark(key, value, text)
await g.letter({ text, sign, kind, voice }); await g.title(text)
```

Правила шага (все обязательны):

- Шаг начинается с `g.hero(…)`, `g.beds(…)` и `g.scene(…)`; читает только `g.state` и `facts(g.state)`. Его можно
  сыграть заново, пропустить, войти с середины и прогнать всухую. `g.hero` можно позвать ещё раз внутри шага, когда
  меняется, чья сцена.
- Сцену открывают сразу на первом куске: `await g.scene(T, {beat: 'x'})`, потом `await g.beat('x')`.
- **Модуль `beats` движка 3** — как в «Алых парусах v3» (тот же, что в «Вокруг света v3»; по
  `moood-me/moood:docs/engine3/architecture.md`, строка о `modules/beats.js`, и `moood-me/studio:docs/history/2026-10-11-engine3.md`): когда кусок
  начался, он готовит снимок начала куска, названного ключом `beat_next`, иначе — следующего в таблице, если тот
  начинается склейкой. Кусок с `after` идёт без склейки, снимок ему не нужен. **Правило: `g.set('beat_next', '<кусок>')`
  — только перед куском-склейкой внутри открытой сцены, который не следующий по таблице.** В этой игре таких нет:
  каждая склейка внутри сцены (`frames`, `slate_out`, `motor`, `seen`, `alfredo_comes`, `strip_end`) — следующая по
  таблице, ветки идут по `after`, остальное открывает сцену (`g.scene`). Проверка веток (§11) ловит нарушение.
- Ждать момент сцены — только её событием; ожидание ставится **до** куска, которому момент принадлежит (если это
  первый кусок — до `g.scene`).
- Реплика — всегда `g.say` с двумя **строковыми литералами**: кто и текст — буква в букву из §8. Где реплику выбирает
  мини-игра или письмо, глава передаёт функции, в каждой свой литерал.
- У Тото один элемент сцены на все возрасты (`toto`), голоса разные: `g.say('toto_boy', '…', 'toto')`,
  `g.say('salvatore', '…', 'toto')`. У Елены — так же (`elena`; голоса `elena` и `elena_grown`). Рассказчик
  (`narrator`) говорит внизу. Пока открыта вставка во весь кадр — реплика у `'narrator'`.
- После `g.play` глава ставит ключи сцены и подложки в итог (строка «после игры» в §6): пропущенная мини-игра
  оставляет сцену и звук такими же, как сыгранная.
- Ручки звука (`theme`, `camera8`) останавливают в конце шага и по `g.signal`.
- Состояние меняют только `g.choose`, `g.scale`, `g.gauge`, `g.mark` и `g.play` (итог рук, §3.6).
- Шапка каждой главы говорит, что она читает и что оставляет.

Глава: `export default { number, title, wall?: false, titles: [имена шагов], choices: [{id, weight: '⚑' | '~', title,
options: [{id, label}]}], steps: [async g => …] }`.

## 5. Состояние партии

| Поле `g.state` | Кто ставит | Кто читает |
| --- | --- | --- |
| `chapter`, `step`, `start`, `play` | `game.js` | `game.js` |
| `scales.toto` (−5…5, начало 0; + Кино) | `g.scale('toto', ±1)`: I.2, I.3, III.1, III.4, IV.5 | `facts`, шкала-луч |
| `scales.alfredo` (−3…3, начало 0; + Держать) | `g.scale('alfredo', ±1)`: II.5, IV.3, IV.6 | `facts`, шкала-катушка |
| `shown.toto`, `shown.alfredo` | `g.gauge`, `g.scale` | `view.gauges` |
| `choices.frame` | I.2: `leave` · `take` | `facts.frame`, карта |
| `choices.milk` | I.3: `lie` · `truth` | IV.5, V.2, карта |
| `choices.booth` | II.5: `hold` · `release` | `facts.alfredoHere`, III.2, III.4, карта |
| `choices.camera` | III.1: `film` · `speak` | `facts.reel8`, карта |
| `choices.nights` | III.4: `wait` · `booth` | карта |
| `choices.elena` | IV.3: `truth` · `future` | `facts.elena`, IV.4, IV.5, `facts.ending`, карта |
| `choices.stay` | IV.5: `go` · `stay` | IV.5, карта |
| `choices.station` | IV.6: `never` · `come` | IV.6 (`alfredo_stays`), V.4, карта |
| `choices.look` | IV.6: `no` · `back` | карта |
| `choices.girl` | V.3: `follow` · `let` | `facts.ending`, карта |
| `choices.ask` | V.3 (только при `follow`): `ask` · `bye` | V.3, карта |
| `choices.funeral` | V.4: `walk` · `apart` | `facts.place`, V.4, карта |
| `marks.frame` | I.2 `take`: `true` | V.1 (`wallet`) |
| `marks.mother` | I.3 `truth`: `true` | V.2 (Р83) |
| `marks.alfredo` | I.3 `lie`: `true` | IV.5 (Р71) |
| `marks.reel8` | III.1 `film`: `true` | запись партии (платит `facts.reel8`: проектор и плёнка в V.2) |
| `hands.<мини-игра>` | `g.play` (§3.6) | `facts`: `seen` (I.2), `slips` (II.1), `jumps`, `slate`, `share`, `missed` (IV.2) |

```js
export const SCALES = {
  toto: { start: 0, min: -5, max: 5, up: 'Кино', down: 'Люди',
    rule: 'Луч ярче — Тото живёт кино. Окна теплее — Тото живёт людьми.' },
  alfredo: { start: 0, min: -3, max: 3, up: 'Держать', down: 'Отпустить',
    rule: 'Катушка: держит Альфредо мальчика при себе — или отпускает в большую жизнь.' },
};
export const ENDINGS = [
  { id: 'turn', label: 'Пусть останется' }, { id: 'note', label: 'Записка' }, { id: 'letters', label: 'Письма' },
];
export function facts(state) {
  const c = state.choices, t = state.scales.toto, a = state.scales.alfredo, elena = c.elena ?? 'future';
  const girl = c.girl ?? 'let', h = state.hands ?? {};
  return {
    seen: h.podglyadyvat?.seen ?? 3,                     // I.2: Р07 (≥ 2) или Р128
    slips: h.zapravka?.slips ?? 0,                       // II.1: кадр дрожит в `motor` (`stutter`)
    jumps: h.skleyka?.jumps ?? 0,                        // кривые склейки: «Лента», Рим
    slate: h.bukvy?.crooked ?? '00000000',               // доска с его буквами в будке 1988 года
    share: h.kamera?.share ?? 1,                         // сколько её в его плёнке (V.2)
    missed: h.smena?.missed ?? 0,                        // IV.2: Р129
    letter: elena === 'truth',                           // её письмо в руке Тото на пристани (IV.5)
    kino: t > 0,                                         // ответ матери в V.2, мать на сносе
    warm: Math.min(1, Math.max(0, (5 - t) / 10)),        // 0 Кино … 1 Люди
    hold: a > 0,                                         // слова вдовы в V.4
    alfredoHere: c.booth === 'hold',
    frame: c.frame === 'take',
    reel8: c.camera === 'film',
    elena,                                               // 'truth' | 'future'
    ending: girl === 'let' ? 'turn' : elena === 'future' ? 'note' : 'letters',
    knows: girl === 'follow' && elena === 'future',
    place: c.funeral === 'apart' ? 'apart' : 'crowd',
  };
}
```

Шкала Тото сдвигается пять раз (I.2, I.3, III.1, III.4, IV.5) по ±1 — к главе V она нечётная, нуля не бывает; `look`
шкалу не двигает. Шкала Альфредо — три раза, тоже без нуля. Пропущенный автором шаг не оставляет выбора: `facts` даёт
значения по умолчанию (шкала 0 → Люди, Отпустить; `elena` `future`; `girl` `let`; `funeral` → `crowd`).

**Состояние → ключи партии сцен** (`carry`):

| Сцена | Ключи |
| --- | --- |
| Площадь | `warm: f.warm`, `place: f.place`, `with_mother: f.kino ? 0 : 1` |
| Будка | `alfredo_here: f.alfredoHere ? 1 : 0`, `jumps: f.jumps`, `slate_letters: f.slate` |
| Дом Ди Вита | `reel8: f.reel8 ? 1 : 0`, `share: f.share` |
| Пристань | `letter_in_hand: f.letter ? 1 : 0` |
| Просмотровый зал | `note_in_hand: f.ending === 'note' ? 1 : 0`, `jumps: f.jumps` |
| Зал, Вокзал, Плёнка | — |

## 6. Главы по шагам

Запись: **сцена** · `кусок` · Рnn — реплика из §8 (там текст и кто; «у X» — где пузырь, если не над говорящим) ·
*момент*, по которому она говорится. «(крупно)» — кадр камерой, одна строка `await g.beat(…)`, её можно убрать.
`beat_next` в главах не ставится (§4: склеек не по таблице нет). Подложки — полный набор шага. Подписи вариантов
выбора — слова лепестков (§3).

### Пролог — `prologue.js` (`number: ''`, `title: 'Пролог'`, без выборов)

Шаг «Звонок»: `g.hero('both')`; `g.beds({wind_cold: 0.3, sea: 0.2}, 3)`.
1. **Площадь** · `now_open`. По *`now_open:window`* — Р01 (у `'mother_window'`), Р02. Дождаться конца куска.
2. Касание: `g.choose(null, {'paradiso#booth_window': [{id: 'look', label: 'Посмотреть'}]})` — первое действие в
   сцене, на ≈ 16-й секунде.
3. `rewind`; по *`rewind:beam`* — `motif()`, `g.beds({cicadas: 0.4, square: 0.3}, 6)`, `g.title('Новый кинотеатр
   «Парадизо»')` (не ждать). Дождаться конца. Дальше без «Плёнки» — глава I.

### Глава I «Колокольчик» — `1.js` (`number: 'I'`, `wall: false`)

`titles`: Колокольчик, Ножницы, Молоко, Уговор, Бумага. `choices`: `{id: 'frame', weight: '~', title: 'Обрезки',
options: [{id: 'leave', label: 'Пусть хранит'}, {id: 'take', label: 'Взять один кадр'}]}`, `{id: 'milk', weight:
'⚑', title: 'Деньги на молоко', options: [{id: 'lie', label: 'Промолчать'}, {id: 'truth', label: 'Сказать
правду'}]}`.

1. **Колокольчик** (`toto`). `g.beds({hall: 0.5, whirr: 0.3})`. **Зал** · `priest`, склейкой (`{cut: true}` — из
   пролога); по *`priest:sat`* — Р03. `peek`. `g.play(podglyadyvat, {onFirstBell, onCaught})` — `onFirstBell` — Р04
   (у `'adelfio'`), `onCaught` — Р05 (у `'adelfio'`), каждое один раз. После игры: `peek` = 0, `turn` = 0, `bell` =
   0, `screen_film` = `'romance'`. `bell_end`.
2. **Ножницы** (`both`). `g.beds({whirr: 0.5, hall: 0.2})`. **Будка** · `cutting`; по *`cutting:door`* — Р06; по
   *`cutting:bench`* — `facts.seen` ≥ 2: Р07, иначе Р128 (у `'toto'`). `splice_in`. `g.play(skleyka, {onCrooked})` —
   `onCrooked` — Р08 (у `'narrator'`, вставка открыта), один раз. После игры: `cut1…cut3` = 1, `glue1…glue3` = 1,
   `boy_reach` = 1, `bent1…bent3` — как оставила игра (при пропуске 0). `frames`;
   по *`frames:tin`* — Р09 (у `'toto'`), Р10. Выбор `frame`: `{tin: [{id: 'leave', label: 'Пусть хранит'}], toto: [{id:
   'take', label: 'Взять один кадр'}]}`. **Сразу после выбора — `g.gauge('toto')`** (шкала и её правило), потом ветка.
   - `leave`: `g.scale('toto', -1)`; `tin_shut`.
   - `take`: `g.scale('toto', 1)`; `g.mark('frame', true, 'Кадр останется у Тото.')`; `pocket`; по
     *`pocket:hidden`* — Р11.
3. **Молоко** (`toto`). `g.beds({square: 0.5, cicadas: 0.3, crowd: 0.3})`. **Площадь** · `after_show`; по
   *`after_show:caught`* — Р12 (у `'maria'`). `alfredo_down`; по *`alfredo_down:coins`* — `coins()`, Р13. Выбор
   `milk`: `{'alfredo#hand_r': [{id: 'lie', label: 'Промолчать'}], toto: [{id: 'truth', label: 'Сказать правду'}]}`.
   - `lie`: `g.scale('toto', 1)`; `g.mark('alfredo', true, 'Альфредо это запомнит.')`; `coins_taken`; по
     *`coins_taken:take`* — Р14 (у `'maria'`). `g.beds({})`; **Дом** · `supper`; после куска — Р17.
   - `truth`: `g.scale('toto', -1)`; `g.mark('mother', true, 'Мама это запомнит.')`; Р15 (у `'toto'`); `slap`; по *`slap:cut`* — `slap()`. `g.beds({})`; **Дом** · `photo`; по *`photo:hand`* — Р16 (у `'maria'`).
4. **Уговор** (`both`). `g.beds({whirr: 0.3})`. **Будка** · `deal`; по *`deal:primer`* — Р18, Р19 (у `'toto'`), Р20.
   `slate_in`. `g.play(bukvy)`. После игры: `letters` = 8, `chalk_x` = 1, `wobble` = 0 (`crooked` — как оставила
   игра, `facts.slate`; при пропуске `'00000000'`). `slate_out`; по *`slate_out:up`* — Р21.
5. **Бумага** (`toto`). `g.beds({square: 0.3, cicadas: 0.2})`. **Площадь** · `paper`, `{poster: 1}`; по
   *`paper:hand`* — Р22.

### Глава II «Луч» — `2.js` (`number: 'II'`)

`titles`: Заправка, Толпа, Огонь, Поцелуи, Будка. `choices`: `{id: 'booth', weight: '⚑', title: 'Механик в десять
лет', options: [{id: 'hold', label: '«Пойдём. Буду рядом»'}, {id: 'release', label: '«Иди один»'}]}`.

1. **Заправка** (`both`). `g.beds({})`. **Будка** · `lesson`; по *`lesson:crate`* — Р23. `g.play(zapravka)`.
   После игры: `threaded` = 5, `pull` = 0, `stutter` = `facts.slips` ≥ 1 ? 1 : 0 (не удержал петлю — кадр в луче
   дрожит, Альфредо стукает по кожуху). `motor`; по *`motor:beam`* — `g.beds({whirr: 0.6})`, `motif()`;
   по *`motor:lever`* — Р111 (у `'alfredo'`). **Зал** · `full_hall`, склейкой; `g.beds({whirr: 0.3, hall: 0.6})`; по
   *`full_hall:laugh`* — `laugh()`, Р24 (у `'lion'`), Р25 (у `'lion'`), Р112 (у `'lion'`).
2. **Толпа** (`alfredo`). `g.beds({square: 0.7, cicadas: 0.2})`. **Площадь** · `crowd`, `{full_sign: 1}`; по
   *`crowd:madman`* — Р26 (у `'madman'`); по *`crowd:shout`* — `whistle()`, Р27 (у `'c1'`). `g.beds({whirr: 0.5,
   square: 0.4})`; **Будка** · `window`, склейкой; по *`window:hands`* — Р28. **Площадь** · `beam_out`, склейкой.
   `g.play(luch, {onFocus})` — `onFocus(u)` → `g.sound.whirr(0.3 + 0.3 * u, 0.3)`. После игры: `beam_aim` = 1,
   `beam_focus` = 1, `wall_film` = `'comedy'`; `motif()`, `applause()`. `const th = g.sound.theme()`, `th.loud(0.35,
   3)` — **тема впервые целиком**, тихо, под подарок площади. `wall_film`; по *`wall_film:sit`* — `laugh()`, Р29.
   Дождаться конца куска; в конце шага `th.stop(3)` (в следующем шаге — огонь).
3. **Огонь** (`both`). `g.beds({whirr: 0.5, square: 0.3})`. **Будка** · `jam`; сразу Р30 (у `'alfredo'`); по
   *`jam:flame`* — `flame()`, `g.beds({fire: 0.8})`. **Площадь** · `smoke`, склейкой, `{beam_on: 1, beam_aim: 1,
   beam_focus: 1, wall_film: 'comedy'}`; по *`smoke:fire`* — Р31 (у `'c1'`). `g.beds({fire: 1})`; **Будка** ·
   `smoke_in`, склейкой (огонь, дым и повёрнутый проектор ставит `from` куска). `g.play(vytaschit)`. После игры: `drag` = 1, `cough` = 0,
   `g.beds({square: 0.4, fire: 0.2}, 2)`. **Площадь** · `outside`; по *`outside:sat`* — Р32.
4. **Поцелуи** (`toto`). `g.beds({square: 0.3})`. **Площадь** · `new_sign`; по *`new_sign:lit`* — Р33.
   `g.beds({hall: 0.6, whirr: 0.3})`; **Зал** · `first_kiss`; по *`first_kiss:kiss`* — `roar()`; по
   *`first_kiss:priest`* — Р34.
5. **Будка** (`alfredo`). `g.beds({square: 0.4, cicadas: 0.3})`. **Площадь** · `door`; по *`door:asked`* — Р35 (у
   `'toto'`). Выбор `booth`: `{toto: [{id: 'hold', label: '«Пойдём. Буду рядом»'}], alfredo: [{id: 'release', label:
   '«Иди один»'}]}`. Сразу после выбора — `g.gauge('alfredo')`: катушка и её правило.
   - `hold`: `g.scale('alfredo', 1)`; Р36; `go_together`.
   - `release`: `g.scale('alfredo', -1)`; Р37; `go_alone`.

### Глава III «Сто ночей» — `3.js` (`number: 'III'`)

`titles`: Камера, Солдат и принцесса, Сто ночей, Новый год. `choices`: `{id: 'camera', weight: '⚑', title:
'Незнакомая девушка', options: [{id: 'film', label: 'Снимать дальше'}, {id: 'speak', label: 'Подойти к ней'}]}`,
`{id: 'nights', weight: '⚑', title: 'Девяносто девятая ночь', options: [{id: 'wait', label: 'Ждать дальше'}, {id:
'booth', label: 'Уйти в будку'}]}`.

1. **Камера** (`toto`). `g.beds({square: 0.5, cicadas: 0.4})`. **Площадь** · `dusk`; по *`dusk:aim`* — Р38 (кусок
   кончается вставкой). `const cam = g.sound.camera8()`; `g.play(kamera, {onFrame})` — `onFrame(inFrame)` →
   `cam.loud(inFrame ? 0.6 : 0.15, 0.3)`. После игры: `viewfinder` = 0, `pan` = 0, `elena_x` = 0, `madman_x` = 1, `rec`
   = 0; `cam.stop(0.5)`. `seen`. Выбор `camera`: `{toto: [{id: 'film', label: 'Снимать дальше'}], elena: [{id: 'speak',
   label: 'Подойти к ней'}]}`.
   - `film`: `g.scale('toto', 1)`; `g.mark('reel8', true, 'Плёнка останется у Тото.')`; `const c2 =
     g.sound.camera8()`; `film_on`; по *`film_on:door`* — `c2.stop(0.5)`, Р39.
   - `speak`: `g.scale('toto', -1)`; `hello`; по *`hello:met`* — Р40 (у `'elena'`), Р113 (у `'toto'`),
     Р41 (у `'elena'`), `giggle()`.
2. **Солдат и принцесса** (`both`).
   - `facts.alfredoHere`: `g.beds({whirr: 0.4, hall: 0.2})`; **Будка** · `story_booth`; по *`story_booth:start`* —
     Р42, Р43; по *`story_booth:99`* — Р44; по *`story_booth:why`* — Р45 (у `'toto'`), Р46.
   - иначе: `g.beds({square: 0.4, cicadas: 0.4})`; **Площадь** · `story_door`; моменты и реплики те же
     (*`story_door:start`*, *`story_door:99`*, *`story_door:why`*).
3. **Сто ночей** (`toto`). `g.beds({square: 0.3, cicadas: 0.3})`. **Площадь** · `chair`; по *`chair:sat`* — Р47.
   `nights`. `g.play(stoNochey)`. После игры: `chalk` = 98, `night_kind` = `'cold'`, `elena_window` = 0; `g.beds({square:
   0.3}, 2)`.
4. **Новый год** (`toto`). `g.beds({square: 0.5, hall: 0.2})`. **Площадь** · `eve`, `{chalk: 99}`; по *`eve:ready`* —
   Р48. Выбор `nights`: `{balcony: [{id: 'wait', label: 'Ждать дальше'}], 'paradiso#booth_window': [{id: 'booth',
   label: 'Уйти в будку'}]}`.
   - `wait`: `g.scale('toto', -1)`; `midnight`; по *`midnight:open`* — `whistle()`, `fireworks()`, `motif()`; по
     *`midnight:hug`* — Р49 (у `'elena'`). `midnight_close` (крупно). Р50.
   - `booth`: `g.scale('toto', 1)`; `g.beds({whirr: 0.6, hall: 0.3})`; **Будка** · `reels`; по *`reels:door`* — Р51
     (у `'elena'`); по *`reels:hug`* — `motif()`; по *`reels:tail`* — `reelEnd()`; если `facts.alfredoHere` — Р52.
     `g.beds({hall: 0.4})`; **Зал** · `whistle`, склейкой; `whistle()`.

   Обе ветки: Р53.

### Глава IV «Уезжай» — `4.js` (`number: 'IV'`)

`titles`: Ливень, В шесть, Елена, Письма, Пристань, Вокзал. `choices`: `{id: 'elena', weight: '⚑', title: 'Елена в
будке', options: [{id: 'truth', label: '«Он на пристани. Беги»'}, {id: 'future', label: '«Если любишь — оставь
его»'}]}`, `{id: 'stay', weight: '⚑', title: 'Уехать или остаться', options: [{id: 'go', label: '«Уеду»'}, {id:
'stay', label: '«Останусь»'}]}`, `{id: 'station', weight: '⚑', title: 'Что сказать на перроне', options: [{id: 'never',
label: '«Не возвращайся»'}, {id: 'come', label: '«Возвращайся, когда захочешь»'}]}`, `{id: 'look', weight: '~',
title: 'Из окна вагона', options: [{id: 'no', label: 'Не оборачиваться'}, {id: 'back', label: 'Обернуться'}]}`.

1. **Ливень** (`toto`). `g.beds({sea: 0.4, whirr: 0.3})`. **Пристань** · `summer`; по *`summer:screen`* — Р54; по
   *`summer:rain`* — `g.beds({sea: 0.3, rain: 0.8, whirr: 0.3}, 3)`. Касание: `g.choose(null, {projector: [{id:
   'cover', label: 'Укрыть проектор'}]})`. `covered`; по *`covered:done`* — `g.beds({sea: 0.3, rain: 0.8})`.
   `headlights`; по *`headlights:father`* — `car()`, Р55 (у `'banker'`); по *`headlights:turn`* — Р56 (у `'elena'`).
2. **В шесть** (`toto`). `g.beds({whirr: 0.5, hall: 0.3})`. **Будка** · `six`; по *`six:clock`* — Р57. `changeover`.
   `g.play(smena)`. После игры: `cue` = 0, `white` = 0, `clock` = 10, `motor1` = 0, `motor2` = 1, `active` = 2.
   `alfredo_comes`; по *`alfredo_comes:turned`* — если `facts.missed` ≥ 1, Р129 (у `'alfredo'`); Р58 (у `'alfredo'`),
   Р59 (у `'toto'`).
3. **Елена** (`alfredo`). `g.beds({whirr: 0.5, hall: 0.2})`. **Будка** · `knock`; по *`knock:in`* — `steps()`, Р60 (у
   `'elena'`). Выбор `elena`: `{elena: [{id: 'truth', label: '«Он на пристани. Беги»'}], alfredo: [{id: 'future', label:
   '«Если любишь — оставь его»'}]}`.
   - `truth`: `g.scale('alfredo', 1)`; Р61; `runs`; по *`runs:gone`* — `door()`. `g.hero('toto')`; `g.beds({sea:
     0.5})`; **Пристань** · `found`; по *`found:hug`* — `motif()`, Р62 (у `'elena'`), Р63 (у `'toto'`).
   - `future`: `g.scale('alfredo', -1)`; Р64; `note` (Елена пишет на августе; когда она ушла, Альфредо на ощупь
     переворачивает лист на сентябрь — ложь руками); `note_close` (крупно). `g.hero('toto')`;
     `g.beds({sea: 0.5})`; **Пристань** · `alone`. `g.beds({})`; **Будка** · `morning`; по *`morning:in`* — Р65 (у
     `'toto'`), Р66 (у `'alfredo'`).
4. **Письма** (`toto`). `g.beds({})`. **Дом** · `call`; по *`call:paper`* — Р67 (у `'maria'`).
   - `facts.elena === 'truth'`: `answered`; по *`answered:reading`* — Р68; после куска `g.letter({text: 'Тото, в
     Палермо жарко и нет кино. Пиши мне.', sign: 'Е.', kind: 'letter', voice: () => g.say('elena', 'Тото, в Палермо
     жарко и нет кино. Пиши мне', 'narrator')})` (Р127).
   - иначе: `returned`; по *`returned:pile`* — Р69; после куска `g.letter({text: 'Адресат выбыл',
     sign: '', kind: 'envelope'})`.

   Глава ждёт, пока игрок раскроет и сложит лист.
5. **Пристань** (`both`). `g.beds({sea: 0.5})`. **Пристань** · `back` (при `facts.letter` у Тото в руках её письмо —
   ключ партии `letter_in_hand`: цена правды видна, пока Альфредо гонит его); по *`back:sat`* — Р70; если
   `facts.elena === 'truth'` — Р114 (у `'toto'`); если `g.state.marks.alfredo` — Р71 (у `'alfredo'`); Р72, Р73 (оба у
   `'alfredo'`). `g.hero('toto')`. Выбор `stay`: `{toto: [{id: 'go', label: '«Уеду»'}, {id: 'stay', label:
   '«Останусь»'}]}`.
   - `go`: `g.scale('toto', 1)`; Р115 (у `'toto'`); `rise_go`.
   - `stay`: `g.scale('toto', -1)`; Р116 (у `'toto'`). `g.beds({whirr: 0.4, rain: 0.4})`; **Будка** · `autumn`; по
     *`autumn:door`* — Р117 (у `'alfredo'`); Р118.
6. **Вокзал** (`both`). `g.beds({station: 0.5})`. **Вокзал** · `platform`; `trainHiss()`; по *`platform:hug`* — Р74
   (у `'maria'`). `g.hero('alfredo')`. Выбор `station`: `{alfredo: [{id: 'never', label: '«Не возвращайся»'}, {id:
   'come', label: '«Возвращайся, когда захочешь»'}]}`.
   - `never`: `g.scale('alfredo', -1)`; Р75; `g.set('alfredo_stays', 0)`.
   - `come`: `g.scale('alfredo', 1)`; Р76; `g.set('alfredo_stays', 1)`.

   Обе: Р77. `g.hero('toto')`. `boarding`; по *`boarding:window`* — `trainWhistle()`. Выбор `look`: `{toto: [{id: 'no',
   label: 'Не оборачиваться'}, {id: 'back', label: 'Обернуться'}]}` (шкалу не двигает).
   - `no`: `away`.
   - `back`: `back_look`.

   Обе: Р78.

### Глава V «Возвращение» — `5.js` (`number: 'V'`)

`titles`: Перрон, Комната, Девушка, Похороны, Будка. `choices`: `{id: 'girl', weight: '⚑', title: 'Девушка, похожая
на Елену', options: [{id: 'follow', label: 'Пойти за ней'}, {id: 'let', label: 'Остаться у «Парадизо»'}]}`, `{id:
'ask', weight: '~', title: 'Елена через тридцать лет', options: [{id: 'ask', label: '«Поедем со мной»'}, {id: 'bye',
label: '«Прощай»'}]}`, `{id: 'funeral', weight: '⚑', title: 'Похороны', options: [{id: 'walk', label: 'Идти за
гробом'}, {id: 'apart', label: 'Остаться у дверей'}]}`. В карте главы строка `ask` при `let` — `unseen`.

**Стрекота (`whirr`) в главе V нет — кроме вспышки `memory` (V.5) и с «Ленты»;** домашний проектор — свой звук
`camera8`. Все шаги — `g.hero('toto')`, кроме V.4 (`both`).

1. **Перрон**. `g.beds({wind_cold: 0.4, station: 0.2})`. **Вокзал** · `arrival`; по *`arrival:stand`* — Р79. Если
   `facts.frame` — `wallet`; Р80 (у `'narrator'`).
2. **Комната**. `g.beds({wind_cold: 0.15})`. **Дом** · `room`; по *`room:door`* — Р81 (у `'maria'`). Если
   `facts.reel8`: касание `g.choose(null, {home_projector: [{id: 'on', label: 'Включить проектор'}]})`; `const p =
   g.sound.camera8()`; `home_movie` (её в кадре столько, сколько он удержал в «Камере» — ключ партии `share`); по
   *`home_movie:light`* — Р82; `p.stop(1)`. `question`; по *`question:asked`*: `g.state.marks.mother` — Р83 (у `'maria'`), иначе Р84 (у
   `'maria'`); потом `facts.kino` — Р85, иначе Р86 (оба у `'toto'`).
3. **Девушка**. `g.beds({wind_cold: 0.4, sea: 0.2})`. **Площадь** · `girl`; по *`girl:seen`* — Р87 (у `'madman'`),
   Р88. Выбор `girl`: `{daughter: [{id: 'follow', label: 'Пойти за ней'}], toto: [{id: 'let', label: 'Остаться у
   «Парадизо»'}]}`.
   - `follow`: `follow`. `g.beds({sea: 0.6, wind_cold: 0.2})`; **Пристань** · `car`. Касание: `g.choose(null,
     {elena: [{id: 'go', label: 'Подойти'}]})`. `meet`; по *`meet:turned`* — Р90 (у `'elena'`), Р91 (у `'toto'`),
     Р92 (у `'elena'`).
     - `facts.elena === 'future'`: Р93, Р94 (у `'elena'`), Р95 (у `'toto'`).
     - иначе: Р97 (у `'elena'`), Р98 (у `'toto'`).

     Выбор `ask`: `{elena: [{id: 'ask', label: '«Поедем со мной»'}], toto: [{id: 'bye', label: '«Прощай»'}]}`.
     - `ask`: Р121 (у `'toto'`); `ask`; по *`ask:hand`* — `future`: Р96, `truth`: Р124 (у `'elena'`).
     - `bye`: Р122 (у `'toto'`); `bye`; по *`bye:nod`* — `future`: Р123, `truth`: Р99 (у `'elena'`).

     `parting`; по *`parting:gone`* — `car()`.
   - `let`: `let`; по *`let:hand`* — Р89.
4. **Похороны** (`both`). `g.beds({wind_cold: 0.3})`. **Площадь** · `funeral`; `church()`; по *`funeral:passing`* —
   Р100; `choices.station === 'come'` — Р120, иначе Р119. Выбор `funeral`: `{hearse: [{id: 'walk', label: 'Идти за
   гробом'}], toto: [{id: 'apart', label: 'Остаться у дверей'}]}`.
   - `walk`: `walk_behind`; по *`walk_behind:hand`* — `whisper()`; если `facts.knows` — Р101. `widow` (Анна отдаёт
     жестянку у повозки, при всех).
   - `apart`: `stay_door`; если `facts.knows` — Р102. `widow_late` (Анна подходит одна,
     когда процессия ушла).

   По *`widow:tin`* / *`widow_late:tin`* — Р103 (у `'anna'`); `facts.hold` — Р105, иначе Р104 (у `'anna'`).
5. **Будка**. `g.beds({wind_cold: 0.2})`. **Зал** · `ruin_hall`. Касание: `g.choose(null, {lion: [{id: 'look', label:
   'Посмотреть'}]})`. `memory`; по *`memory:warm`* — `laugh()`, `g.sound.whirr(0.4, 0.5)`; по *`memory:gone`* —
   `g.sound.whirr(0, 1.5)`. **Будка** · `ruins`, склейкой; по *`ruins:in`* — `pigeons()`, Р106, Р125.
   - Если `facts.knows`: `calendar`. `g.play(zapiska)`. После игры: `pages` = 4, `dust` = 0, `fold` = 0, `calendar` = 0.
     `g.letter({text: 'Тото, я приходила. Альфредо сказал, что так будет лучше для тебя. Я буду ждать.', sign:
     'Елена', kind: 'note', voice: () => g.say('elena', 'Тото, я приходила. Альфредо сказал, что так будет лучше для
     тебя. Я буду ждать', 'narrator')})` (Р126); Р107.
   - `window_strip`. `const th = g.sound.theme(); g.sound.whirr(0.2, 2)`;
     `g.play(lenta, {onProgress})` — `onProgress(u)` → `th.loud(0.2 + 0.6 * u, 0.5)`. После игры: `strip_x` = 1,
     `strip` = 0, `th.loud(0.8, 1)`. `strip_end`; по *`strip_end:held`* — Р108. В конце шага `th.stop(4)`,
     `g.sound.whirr(0, 3)`.

### Эпилог — `epilogue.js` (`number: ''`, `title: 'Эпилог'`, `wall: false`, без выборов; шкалы скрыты)

1. **Снос.** `g.beds({crowd: 0.4, wind_cold: 0.2})`. **Площадь** · `demolition`; по *`demolition:whistle`* —
   `whistleBlow()`, `g.beds({wind_cold: 0.2}, 1)` (толпа затихает); по *`demolition:blast`* — `blast()`. `dust`; по
   *`dust:madman`* — Р109 (у `'madman'`).
2. **Рим.** `g.beds({})`. **Просмотровый зал** · `rome`. Касание: `g.choose(null, {'port#window': [{id: 'play',
   label: 'Пустить'}]})`. Р110 (у `'toto'`). `g.beds({whirr: 0.5})`; `const th = g.sound.theme()`; `kisses`;
   `kisses_end`; по *`kisses_end:white`* — `th.loud(1, 2)`, `g.beds({}, 4)`. Дождаться конца; `th.stop(6)`.

## 7. Мини-игры

```js
export default {
  title: 'Склейка',                       // как её зовёт ☰ автора
  about: 18,                              // сколько она длится при обычной игре, с — по её правилам (для проверки веток)
  skipped: { jumps: 0 },                  // итог при пропуске (⏭) — обычный, той же формы, как у чистой игры
  async run(g, b, opts, signal) { const mg = g.minigame({ phrase }); … await mg.end({ as }); return result; },
};
```

Все одиннадцать — на **языке мини-игр** (`moood-me/moood:docs/games/minigames.md`, `moood-me/moood:docs/games/miniux/language.md` в main; устройство
— как у мини-игр «Алых парусов v3», их `docs/alye-parusa/game.md` §7). Общее (автор мини-игры читает ещё §4 и таблицу
звуков §8):

- **Механика из истории.** Мини-игра — действие героя руками игрока. Четыре строки (что он делает, чего хочет, что
  чувствует, что должен чувствовать игрок) — в шапке её файла; они даны в каждом разделе ниже («Чувство»).
- **Начало** `const mg = g.minigame({phrase})`; **конец** `await mg.end({as: 'clean' | 'flawed' | 'neutral'})` — с
  ошибками `flawed`. **Фраза плашки** — буква в букву из раздела: так, как написал бы рассказчик (взрослый Сальваторе
  вспоминает — просто, тепло, коротко), о том, что происходит с вещью и чего ей не хватает; без «ты» и приказов; только
  то, что видно в сцене. Меняет фразу (`mg.plate.set({phrase})`) только там, где сказано. Плашка: заливка — сколько
  сделано, огонёк — как идёт, засечки — шаги (ставится каждый кадр).
- **Метки и жесты — языка**, на точках, которые называет сцена (`'id#точка'`); все — в средних 4:3, не ближе 0.08
  высоты окна к краям, не под плашкой, не в полосе речи внизу. Вид метки — по жесту (кольцо — нажать; с желобом —
  держать; с пунктиром — тянуть, вести по линии, крутить; пятно — тереть, искать); касание засчитывается в круге ≥ 64
  px. Отклики, звуки ролей, вибрация, призрачный палец — языка. **Своего на экране у игры нет**: ни подсказки, ни слоя
  указателя, ни css, **ни клавиш**.
- Жест, встреченный впервые за партию, показывает призрачный палец (`b.minigame.tricks.teach`). Верное —
  `mg.snap({at})`; ошибка — `mg.error(причина, {at})` с причиной языка (`рано отпустил`, `в опасность`, `сошёл`,
  `отстал`, `против`, `сорвал`): вид, звук, щербинка на плашке. Проигрыша нет; тупиков нет.
- **Ничего не доделывается само**: чего не сделал игрок — не сделано, мини-игра ждёт. Ожидание — путь только там, где
  сказано.
- **⏭ — страховка, у игрока тоже** (решение владельца): чтобы игрок не застрял, если что-то в мини-игре сломалось,
  ⏭ во время мини-игры видят все, не только автор. Мини-игра от этого не становится короче по замыслу: она проходима
  сама, ⏭ — не путь через неё. Пропущенная оставляет **тот же след, что сыгранная**: `skipped` — обычный итог той же
  формы (чистая игра), глава после неё ставит те же ключи и подложки (§4), история читает его так же. По `signal`
  (`b.minigame.skip()`): убрать свои `b.act` (`action.cancel()`), вернуть подложки, которые поднимала, вернуть
  `this.skipped`.
- Ключи сцены шлёт `keys(g)` (`hands.js`: когда изменились больше чем на 0.01, не чаще кадра). Сцену слушают только
  через `g.told` / `until` / `once`; пока отвечает сцена — `mg.sceneTurn(true)`. Времена — кадры мини-игры (на паузе
  стоят). Под жестом на точке камера стоит.
- Реплик своих нет (их даёт глава через `opts`); `g.state` не трогает (итог пишет `g.play`, §3.6); звуки вещей — из
  `g.sound`.
- **Итог — в истории**: что сделали руки, видно дальше (столбец «Куда идёт итог»).
- `about` — длина по её же правилам при обычной игре (не больше), иначе проверка веток врёт о длине.

| Мини-игра (файл) | Сцена, после куска | Жесты | Ключи двигает / слушает | Точки | `opts` | Итог → куда идёт | `about` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Подглядывать (`podglyadyvat`) | Зал, `peek` | держать где угодно, с опасностью | `peek`, `screen_film`, `bell`, `turn` | `curtain#gap` | `onFirstBell()`, `onCaught()` | `{seen, caught}` → I.2: Р07 или Р128 | 28 |
| Склейка (`skleyka`) | Будка, `splice_in` | вести по линии ×3, держать ×3 | `cut1…3`, `glue1…3`, `bent1…3`, `boy_reach` | `splice#cut1…3`, `splice#cut1_end…cut3_end`, `splice#glue1…3` | `onCrooked()` | `{jumps}` → кривые склейки прыгают в «Ленте» и в Риме | 18 |
| Буквы (`bukvy`) | Будка, `slate_in` | вести по линии | `chalk_x`, `letters`, `crooked`, `wobble` | `slate#start`, `slate#end` | — | `{crooked}` → эта доска висит в будке 1988 года | 14 |
| Заправка (`zapravka`) | Будка, `lesson` | тянуть по пути ×5, держать (петля) | `threaded`, `pull`, `loop` | `thread#p0…p5` | — | `{slips}` → заправленная им лента идёт в `motor`; `slips` ≥ 1 — кадр в луче дрожит (`stutter`) | 14 |
| Луч (`luch`) | Площадь, `beam_out` | вести; крутить | `beam_aim`, `beam_focus`, `wall_film` | `wall#screen` | `onFocus(u)` | `{seconds}` → площадь смотрит фильм, который навёл он | 14 |
| Вытащить (`vytaschit`) | Будка, `smoke_in` | тянуть с сопротивлением | `drag`, `cough` / `drag_at` | `toto#hand_r`, `floor#path0`, `floor#path1` | — | `{}` → Альфредо жив: он у фонтана (`outside`) потому, что мальчик дотащил | 18 |
| Камера (`kamera`) | Площадь, `dusk` | вести за движущейся зоной | `pan`, `elena_x`, `madman_x`, `rec` | — | `onFrame(inFrame)` | `{share}` → её в его плёнке в V.2 столько, сколько он удержал | 26 |
| Сто ночей (`sto-nochey`) | Площадь, `nights` | держать где угодно ×14, нажать ×14 | `chalk`, `night_kind`, `elena_window`, `mark_chalk` | `toto`, `chalk_wall#chalk` | — | `{}` → 98 палочек на стене (`eve`: 99; в 1988 они ещё видны) | 36 |
| Смена (`smena`) | Будка, `changeover` | нажать ×6, с дугой времени | `cue`, `motor1`, `motor2`, `active`, `white`, `clock` | `projector#motor`, `projector#lever`, `projector2#motor`, `projector2#lever` | — | `{missed}` → IV.2: Р129 | 38 |
| Записка (`zapiska`) | Будка, `calendar` | тянуть ×4, с пружиной | `pages`, `fold`, `dust` | `calendar#fold` | — | `{}` → её записка (Р126), листок в руке в Риме | 10 |
| Лента (`lenta`) | Будка, `window_strip` | тянуть с сопротивлением | `strip_x` | `strip#hand_r` | `onProgress(u)` | `{seconds}` → та же лента на экране в Риме | 24 |

### Подглядывать (`about: 28`)

*Чувство:* мальчик подглядывает из-за занавески за тем, что ему нельзя; хочет увидеть, что режет священник; страшно и
смешно; игрок — сообщник.

Кадр `CURTAIN`. **Держать где угодно**: налив и дуга — у точки `curtain#gap`. Держат — `peek` растёт к 1 на 2 в
секунду; отпустили — падает к 0 на 3 в секунду (сцена: занавес и наклон мальчика). Фильм идёт сам: игра ставит
`screen_film` `romance`; три поцелуя — на 6-й, 15-й и 24-й секунде: `screen_film` → `romance_kiss`, через 1.2 с `bell` =
1 (сцена запускает `bell_ring` один раз; `g.sound.bell()`), через 0.8 с `bell` = 0, `screen_film` → `romance`. На
первом звонке — `opts.onFirstBell()` (не ждать). Если на звонке `peek` > 0.5 — `seen` += 1, `mg.snap`, засечка.
Священник оглядывается на занавес два раза — в случайный миг между 8-й и 12-й и между 18-й и 22-й секундой: за 0.8 с
— `g.sound.creak()` и дуга опасности у `curtain#gap` растёт до 1; `turn` → 1 за 0.4 с, держит 1.6 с, → 0, дуга
гаснет. Если при `turn` > 0.5 держат (`peek` > 0.5) — ошибка `в опасность`, `caught` += 1, `opts.onCaught()` (один раз
за игру), `peek` → 0, держание не принимается 2 с. Отпустить на скрип — путь, не ошибка. Заливка — время фильма (за
26 с), засечки — три поцелуя. Конец — через 2 с после третьего звонка (`flawed`, если `caught`). Фраза: **«Отец
Адельфио смотрит фильм один. Прежде чем обернуться, его кресло скрипит»**. Итог `{seen, caught}`; `skipped` `{seen: 3,
caught: 0}`.

### Склейка (`about: 18`)

*Чувство:* Альфредо режет поцелуи, потому что так велено; хочет, чтобы не прыгало; привычная досада; игрок режет то,
что потом вернётся к нему.

Вставка `splice` открыта. Три закладки по порядку, одна метка за раз. **Разрез — вести по линии**: кольцо с пунктиром
на `splice#cutN`, линия — поперёк плёнки по краю кадра до `splice#cutN_end` (допуск языка). Пройдено 1 — `cutN` → 1 за
0.3 с, `g.sound.scissors()`, `mg.snap`; обрезок отъезжает (сцена); `boy_reach` → N/3 за 1 с. Сошёл с линии (язык
сообщает) — ошибка `сошёл` (раз на разрез), разрез этого кадра будет косым: `bentN` = 1 (сцена рисует косой край),
`jumps` += 1, `opts.onCrooked()` (один раз за игру); вести дальше с того же места. **Склейка — держать**: кольцо с
желобом на `splice#glueN`, налив 1.2 с — `glueN` → 1, `g.sound.press()`, `mg.snap`; отпустил раньше — налив стекает
(ошибка `рано отпустил`), держать снова. Засечки — шесть шагов. Конец — третья склейка (`flawed`, если `jumps`). Фраза:
**«Закладки торчат там, где звонил колокольчик. Кривая склейка потом прыгает на экране»**. Итог `{jumps}`; `skipped`
`{jumps: 0}`.

### Буквы (`about: 14`)

*Чувство:* взрослый Альфредо учится писать своё имя у мальчика; хочет сдать экзамен; стыдно и смешно; игрок —
нежность и терпение.

Вставка `slate`. **Вести по линии**: кольцо в начале пунктира `slate#start`, линия — пунктир букв до `slate#end`.
Пройдено — `chalk_x` (язык сообщает 0…1), `letters` = floor(8 · `chalk_x`). Если `chalk_x` растёт быстрее 0.1 в секунду
(сглаженно за 0.3 с) — рука дёрнулась: `wobble` = 1 на 0.4 с, текущая буква в `crooked` (строка из 8 знаков `0/1`)
становится `1`, `g.sound.chalkSqueak()`, ошибка `сошёл` у мела (не чаще раза на букву). Иначе каждая новая буква —
`g.sound.chalk()`, засечка. Отпустил — стоит; продолжить с того же места. Заливка — `chalk_x`. Конец: `chalk_x` ≥ 1
(`flawed`, если в `crooked` есть `1`). Фраза: **«Рука у Альфредо тяжёлая. Мел слушается её, только когда она идёт
медленно»**. Итог `{crooked: '…'}`; `skipped` `{crooked: '00000000'}`.

### Заправка (`about: 14`)

*Чувство:* мальчик впервые заправляет проектор; хочет сделать как мастер; гордость и осторожность; игрок — учиться
руками.

Вставка `thread`: `threaded` = 0, конец плёнки у `thread#p0`. Пять отрезков, одна метка за раз. **Тянуть по пути**:
кольцо на конце плёнки у `thread#p{threaded}`, путь до следующей точки; `pull` — где плёнка на пути 0…1 (язык). Дошёл —
`threaded` += 1, `pull` = 0, `g.sound.click()`, `mg.snap`. Отпустил раньше — пружина: плёнка видимо возвращается к
началу отрезка, без ошибки. **У петли** (на `thread#p2`, перед отрезком 2 → 3) — **держать**: кольцо с желобом, налив
0.8 с — `loop` = 1 (сцена делает петлю); отпустил раньше — налив стекает, ошибка `рано отпустил`, `slips` += 1. Засечки —
шесть шагов. Конец: `threaded` = 5. Фраза: **«Плёнка идёт от зубца к зубцу. Без петли перед кадровым окном её рвёт»**.
Итог `{slips}`; `skipped` `{slips: 0}`.

### Луч (`about: 14`)

*Чувство:* Альфредо дарит кино тем, кому не хватило мест; хочет, чтобы вся площадь увидела; озорство и гордость;
игрок — щедрость.

Кадр `WALL`. **Фаза 1 — вести**: стрелка — конец луча (пятно света на камне и головах), зона — белая стена (`wall#screen`).
Нажал где угодно и ведёт вбок: цель `beam_aim` — смещение пальца (четверть ширины окна = 1) от `beam_aim` на момент
нажатия; сам `beam_aim` идёт к цели не быстрее 0.25 в секунду (проектор тяжёлый). В зоне (`beam_aim` ≥ 0.95) 0.5 с —
защёлка: `beam_aim` = 1, `g.sound.clunk()`, `mg.snap`; `wall_film` = `comedy`, `beam_focus` = 0 (на стене мутное
пятно). **Фаза 2 — крутить**: кольцо с пунктиром по кругу на `wall#screen`; полтора оборота по стрелке — `beam_focus`
0 → 1; против стрелки — назад (ошибка `против`, язык). `opts.onFocus(beam_focus)` четыре раза в секунду. `beam_focus`
≥ 1 — конец (`clean`). Фраза: **«Белая стена дома напротив пустая. Проектор тяжёлый, луч ползёт медленно»**; в фазе 2
— **«На стене уже смеются, а кадр ещё мутный»**. Итог `{seconds}`; `skipped` `{seconds: 0}`.

### Вытащить (`about: 18`)

*Чувство:* мальчик тащит Альфредо из дыма; хочет спасти; страх и упрямство; игрок — усилие и дыхание.

Кадр `FLOOR`. **Тянуть с сопротивлением по пути**: кольцо на руках мальчика (`toto#hand_r`), путь — от `floor#path0`
(у проектора) к `floor#path1` (у двери, сверху вниз по кадру). Пока тянут, Альфредо идёт за пальцем тяжело (натяжение
— язык); `drag` = где вещь на пути, 0…1 (сцена ведёт двоих). **Дыхание**: тянут дольше 3 с подряд — кашель: ошибка
`сорвал` (дорожка рвётся), `cough` = 1 (импульс), `drag` −= 0.05, `g.sound.cough()`, 1 с тянуть нельзя. Отпустил и
снова взялся — вдохнул, без ошибки. Заливка — `drag`. Конец: `drag` ≥ 1 и `drag_at` ≥ 0.97 (`until`). Фраза: **«Дым
стоит под потолком. У пола ещё можно дышать — недолго»**. Итог `{}` (кашель стоит только секунд; итог рук — то, что
Альфредо жив); `skipped` `{}`.

### Камера (`about: 26`)

*Чувство:* Тото снимает незнакомую девушку; хочет удержать её в кадре; любопытство и робость; игрок — не потерять её.

Вставка `viewfinder` открыта. **Вести**: стрелка — перекрестие видоискателя (`pan`), зона — девушка (движется,
`elena_x`). Девушку ведёт игра: `elena_x` 1 → 0 за 22 с (от автобуса справа к фонтану), с остановкой 2 с на 0.5
(оглядывается на церковь). На 9-й секунде `madman_x` −1 → 1 за 3 с (перебегает кадр). Нажал где угодно и ведёт вбок —
`pan` = смещение пальца, делённое на четверть ширины окна, к `pan` на момент нажатия, от −1 до 1; отпустил — стоит. В
зоне (|`elena_x` − `pan`| < 0.22) — `rec` = 1, `opts.onFrame(true)`; иначе `rec` = 0, `opts.onFrame(false)`; вне зоны
дольше 4 с подряд — ошибка `отстал` (раз на выход). `share` — доля времени в зоне; заливка — путь девушки. Конец:
`elena_x` = 0 и 1.5 с (`flawed` при ошибках). Фраза: **«Незнакомая девушка идёт от автобуса через площадь. Камера
стрекочет, пока она в кадре»**. Итог `{share}`; `skipped` `{share: 1}`.

### Сто ночей (`about: 36`)

*Чувство:* Тото сидит под балконом ночь за ночью; хочет доказать; упрямство с улыбкой; игрок — терпение.

Кадр `BALCONY`. Четырнадцать недель по 7 ночей (98 палочек). `night_kind` по неделям: `clear`, `rain`, `wind`, `clear`,
`feast`, `rain`, `clear`, `wind`, `rain`, `clear`, `wind`, `cold`, `cold`, `cold` (дождь — `g.sound.rain` на неделю;
праздник — `g.sound.band()`, раз). Неделя — **держать где угодно** (он сидит): налив у `toto`, 1.2 с, в дождь, ветер и
холод — 1.8 с; отпустили — налив стоит (ночь не кончается; не ошибка). Налив полон — **нажать**: кольцо на
`chalk_wall#chalk` — `mark_chalk` = 1 (импульс; сцена играет `chalk_mark`), `chalk` += 7, `g.sound.chalk()`,
`mg.snap`, засечка; 0.4 с; следующая неделя. На седьмой неделе, пока налив, — ставня: `elena_window` → 0.3 за 0.4 с
(слой ставни), `g.sound.shutter()`, держит 1.5 с, → 0, `g.sound.shutter()`. Заливка — `chalk` / 98. Конец: после 14-й
недели (`clean`). Фраза: **«Ночи длинные. За каждую неделю — палочка мелом на стене банка»**. Итог `{}`; `skipped` `{}`.

### Смена (`about: 38`)

*Чувство:* Тото работает и ждёт Елену; хочет не пропустить ни смену, ни её шаги; тревога; игрок — работать, ожидая.

Кадр `PORTS`, часы на 6, `motor1` = 1, `active` = 1. Три смены, k = 1…3; проектор, на который переключают: `to` = 2,
1, 2 (`to` 1 — элемент `projector`, 2 — `projector2`) — **тот, что стоит** (бобины не крутятся); `from` — другой, на
нём меток нет, касание его ничего не делает.
1. Ожидание 6 с: часы `clock` → 6 + k за 2 с; на k = 2 — шаги на лестнице (`g.sound.steps()`), дверь не открывается.
2. Первая точка: `cue` = 1 на 0.8 с (мигает всё смотровое окошко), `g.sound.tick()`; кольцо на `#motor` проектора `to`
   с дугой времени 2.5 с. Нажал — `motor{to}` = 1, `g.sound.motor()`, `mg.snap`. Дуга кончилась — ошибка `отстал`,
   `missed` += 1, кольцо ждёт дальше (без мотора смены не будет).
3. Через 3 с после мотора — вторая точка: `cue` = 1 на 0.8 с, `g.sound.tick2()` (выше); кольцо на `#lever` проектора
   `to`, дуга времени 2 с. Нажал — `active` = `to`, `motor{from}` = 0, `g.sound.clunk()`, `mg.snap`. Дуга кончилась —
   экран белеет (`white` = 1), `g.sound.whistle()` (зал свистит), ошибка `отстал`, `missed` += 1; кольцо ждёт; нажал —
   `active` = `to`, `motor{from}` = 0, `white` = 0.

Засечки — шесть нажатий. Конец: после третьей смены (`active` 2, `motor2` 1, `motor1` 0) и `clock` → 10 за 2 с
(`flawed`, если `missed`). Фраза: **«Катушка на исходе. Перед концом в углу кадра мигает точка, потом вторая»**. Итог
`{missed}`; `skipped` `{missed: 0}`.

### Записка (`about: 10`)

*Чувство:* Сальваторе листает назад календарь, который тридцать лет висел за дверью; хочет и боится найти; игрок —
открыть то, что спрятал Альфредо.

Вставка `calendar`, `pages` = 0, `dust` = 1. Календарь открыт на декабре; прошлые месяцы завёрнуты за верхний край.
Четыре раза, одна метка за раз: **тянуть** — кольцо на `calendar#fold` (край завёрнутого листа над верхом), путь вниз на
0.15 высоты окна, с пружиной; `fold` — где лист на пути. Дошёл — лист опускается поверх (`pages` += 1: ноябрь, октябрь,
сентябрь, август), `g.sound.paper()`, `mg.snap`; на первом — `dust` → 0 за 1 с, `g.sound.puff()`. Отпустил раньше —
лист видимо уходит назад за верх. На августе — карандашные строки; 1.5 с — конец (`clean`). Фраза: **«Календарь
пятьдесят восьмого года открыт на декабре. Прошлые месяцы завёрнуты за верх»**. Итог `{}`; `skipped` `{}`.

### Лента (`about: 24`)

*Чувство:* Сальваторе ведёт к свету ленту, которую сохранил для него Альфредо; хочет увидеть всё; благодарность и
горе; игрок — бережно, не торопясь.

Вставка `strip`, `strip_x` = 0. **Тянуть с сопротивлением**: кольцо у `strip#hand_r`, путь — лента справа налево;
`strip_x` — где лента, 0…1; лента идёт не быстрее 0.045 в секунду (тянется, кадры успевают засветиться). Отпустил —
стоит; кольцо снова у руки. `opts.onProgress(strip_x)` четыре раза в секунду; первыми идут три поцелуя, разрезанные в
главе I (кривые склейки — по `jumps` — прыгают), каждый кадр в свете — `g.sound.motif()` не чаще раза в 3 с. Ошибок
нет. Заливка — `strip_x`. Конец: `strip_x` ≥ 1 (`clean`). Фраза: **«Обрезки склеены в одну ленту, кадр к кадру. За
стеклом ещё светло»**. Итог `{seconds}`; `skipped` `{seconds: 0}`.

## 8. Голоса, реплики, звук, музыка

### Голоса (`PEOPLE` в `story.js`)

Рассказчик — взрослый Сальваторе, вспоминает: говорит только то, что видел. Тот же голос, что `salvatore`, другая
манера. Голоса — готовые голоса сервиса звука (Gemini). Любая правка буквы, манеры, имени или голоса — новая платная
запись; голоса делают один раз, все вместе, когда текст решён (work.md).

| Ключ | Голос | Манера (`how`) | Кто (`name`) |
| --- | --- | --- | --- |
| `narrator` | Iapetus | негромко, тепло, чуть с усмешкой, как вспоминают давнее — без нажима | Сальваторе вспоминает |
| `salvatore` | Iapetus | взрослый мужчина: сдержанно, устало, коротко | Сальваторе, сорок семь лет |
| `toto_boy` | Puck | мальчик восьми–десяти лет: бойко, звонко, хитро | Тото, мальчик |
| `toto` | Achird | юноша: горячо, просто, немного смущённо | Тото, семнадцать–восемнадцать лет |
| `alfredo` | Algenib | низко, хрипловато, ворчливо и нежно; сицилийский выговор | Альфредо, киномеханик |
| `maria` | Achernar | молодая вдова: резко, устало, с надрывом | Мария, мать Тото |
| `maria_old` | Sulafat | старая женщина: тихо, ровно, без жалобы | Мария, мать, через тридцать лет |
| `elena` | Leda | девушка: живо, светло, немного дерзко; письма — тихо, как читают про себя | Елена, семнадцать лет |
| `elena_grown` | Vindemiatrix | женщина: спокойно, низко, с улыбкой и грустью | Елена, сорок семь лет |
| `adelfio` | Charon | старый священник: строго, в нос, с досадой | отец Адельфио |
| `madman` | Fenrir | сумасшедший: громко, нараспев, радостно | сумасшедший с площади |
| `madman_old` | Fenrir | тот же, старый: хрипло, нараспев | сумасшедший с площади, старый |
| `anna` | Gacrux | старая вдова: тихо, просто, по-деревенски | Анна, вдова Альфредо |
| `banker` | Orus | сухо, властно, громко | отец Елены |
| `crowd` | Sadachbia | толпа кричит: несколько голосов, громко, весело или испуганно | люди на площади |

### Все реплики — единственный список

Каждая реплика игры написана здесь один раз; в §6 и в scenes.md — только её номер. Глава пишет её литералом:
`g.say('<кто>', '<текст>')`. «≈ с» — 0,3 с + 0,06 с на букву. Р111–Р127 добавлены во второй редакции, Р128–Р129 —
в третьей (номера не переставлялись).

| № | Кто | Текст | ≈ с |
| --- | --- | --- | --- |
| Р01 | `maria_old` | Сальваторе… Умер Альфредо. Похороны в среду | 2.9 |
| Р02 | `narrator` | Я не был в Джанкальдо тридцать лет | 2.3 |
| Р03 | `narrator` | Отец Адельфио смотрел каждый фильм первым. Один | 3.1 |
| Р04 | `adelfio` | Это — вырезать | 1.1 |
| Р05 | `adelfio` | Тото! А ну домой! | 1.3 |
| Р06 | `alfredo` | Кыш! Тебе сюда нельзя | 1.6 |
| Р07 | `toto_boy` | Он звонил три раза. Я считал | 2.0 |
| Р08 | `alfredo` | Ровно по кадру режь. Чтоб не прыгало | 2.5 |
| Р09 | `toto_boy` | А эти куда? Можно мне? | 1.6 |
| Р10 | `alfredo` | Они твои. Но храню их я | 1.7 |
| Р11 | `narrator` | Один я унёс. Он не заметил. Или сделал вид | 2.8 |
| Р12 | `maria` | Где деньги на молоко? Где? | 1.9 |
| Р13 | `alfredo` | Синьора, он их в зале обронил. Я подобрал | 2.8 |
| Р14 | `maria` | Спасибо, дон Альфредо | 1.6 |
| Р15 | `toto_boy` | Я их потратил. На кино | 1.6 |
| Р16 | `maria` | Отец в России. Может, живой ещё. А ты — в кино | 3.1 |
| Р17 | `narrator` | Молоко в тот вечер было | 1.7 |
| Р18 | `alfredo` | Экзамен мне сдавать. За начальную школу. Без бумаги механиком не оставят | 4.6 |
| Р19 | `toto_boy` | Научу. А ты меня — кино крутить | 2.2 |
| Р20 | `alfredo` | Договорились. Только матери ни слова | 2.5 |
| Р21 | `alfredo` | А-ль-фре-до. Гляди-ка. Это я | 2.0 |
| Р22 | `narrator` | Отец не вернулся из России. Нам прислали бумагу | 3.1 |
| Р23 | `alfredo` | Сначала сюда. Петлю оставь — иначе порвёт | 2.8 |
| Р24 | `alfredo` | Работа одинокая, Тото. Летом жарко, зимой холодно. И один фильм — сто раз | 4.7 |
| Р25 | `toto_boy` | Это ты из кино взял! | 1.5 |
| Р26 | `madman` | Площадь моя! Моя площадь! | 1.8 |
| Р27 | `crowd` | Пусти! Мы тоже хотим кино! | 1.9 |
| Р28 | `alfredo` | Хотите кино? Будет вам кино | 1.9 |
| Р29 | `narrator` | В тот вечер площадь смотрела кино на стене дома | 3.1 |
| Р30 | `alfredo` | Беги вниз, глянь, как там видно | 2.2 |
| Р31 | `crowd` | Пожар! В будке пожар! | 1.6 |
| Р32 | `narrator` | Альфредо выжил. Но больше не видел | 2.3 |
| Р33 | `narrator` | Неаполитанец Чиччо выиграл в лотерею и отстроил «Парадизо». Механиком взяли меня. Больше никто не умел | 6.4 |
| Р34 | `narrator` | Чиччо сказал: в новом «Парадизо» поцелуи не режут | 3.2 |
| Р35 | `toto_boy` | Альфредо, пойдём со мной в будку. Мне одному страшно | 3.4 |
| Р36 | `alfredo` | Пойдём. Я буду рядом. Её я и на слух знаю | 2.8 |
| Р37 | `alfredo` | Иди один. Справишься. И в школу ходи. Не для тебя эта работа | 3.9 |
| Р38 | `narrator` | Мне было семнадцать. Я снимал всё подряд на маленькую камеру | 3.9 |
| Р39 | `narrator` | Три минуты плёнки. Я их потом смотрел сто раз | 3.0 |
| Р40 | `elena` | Это ты в будке кино крутишь? | 2.0 |
| Р41 | `elena` | Елена. Мы только приехали | 1.8 |
| Р42 | `alfredo` | Король устроил праздник. Солдат увидел принцессу — и пропал | 3.8 |
| Р43 | `alfredo` | Она сказала: простоишь сто ночей под моим балконом — буду твоей | 4.1 |
| Р44 | `alfredo` | Он стоял. А на девяносто девятую ночь встал, взял стул и ушёл | 4.0 |
| Р45 | `toto` | Почему? | 0.7 |
| Р46 | `alfredo` | Не знаю. Поймёшь — скажешь мне | 2.1 |
| Р47 | `narrator` | Я решил стоять сто ночей. Сидеть, если честно | 3.0 |
| Р48 | `narrator` | Девяносто девятая ночь. В «Парадизо» новогодний фильм. Крутить его должен был я | 5.0 |
| Р49 | `elena` | Девяносто девять. Я тоже считала | 2.2 |
| Р50 | `narrator` | Зал в ту ночь остался без фильма. Чиччо вычел из жалованья | 3.8 |
| Р51 | `elena` | Ты ушёл с площади. Я думала — всё | 2.3 |
| Р52 | `alfredo` | Тото! Плёнка кончилась! | 1.7 |
| Р53 | `narrator` | Так у нас было одно лето | 1.7 |
| Р54 | `narrator` | Летом кино крутили на пристани. Смотрели даже из лодок | 3.5 |
| Р55 | `banker` | Елена! В машину. Сейчас же | 1.9 |
| Р56 | `elena` | В воскресенье мы уезжаем. Я приду попрощаться. В будку, в шесть | 4.1 |
| Р57 | `narrator` | В шесть она не пришла | 1.6 |
| Р58 | `alfredo` | Иди домой, Тото. Я посижу. Придёт — скажу, где ты | 3.2 |
| Р59 | `toto` | Я буду на пристани | 1.4 |
| Р60 | `elena` | Где Тото? Отец меня не пускал… Я сбежала | 2.7 |
| Р61 | `alfredo` | Он на пристани. Весь вечер тебя ждал. Беги | 2.8 |
| Р62 | `elena` | Я пришла. Видишь — пришла | 1.8 |
| Р63 | `toto` | Пиши мне. Каждый день | 1.6 |
| Р64 | `alfredo` | Если любишь его — оставь. Ему надо уехать. Здесь он пропадёт, как я | 4.3 |
| Р65 | `toto` | Она приходила? | 1.1 |
| Р66 | `alfredo` | Нет | 0.5 |
| Р67 | `maria` | Повестка, Тото. В армию | 1.7 |
| Р68 | `narrator` | Она писала мне. Сначала каждый день. Потом по воскресеньям | 3.8 |
| Р69 | `narrator` | Я писал ей в Палермо. Письма возвращались | 2.8 |
| Р70 | `narrator` | Из армии я вернулся через год | 2.0 |
| Р71 | `alfredo` | Я раз соврал ради тебя — про молоко. Сейчас не вру | 3.3 |
| Р72 | `alfredo` | Уезжай. Эта земля проклятая. Пока ты здесь, ты думаешь, что это центр мира | 4.7 |
| Р73 | `alfredo` | Жизнь не такая, как в кино. Жизнь гораздо труднее | 3.2 |
| Р74 | `maria` | Пиши. Хоть иногда | 1.3 |
| Р75 | `alfredo` | Не возвращайся. Не думай о нас. Не оборачивайся. Не пиши | 3.7 |
| Р76 | `alfredo` | Возвращайся, когда захочешь. Я буду здесь. На площади | 3.5 |
| Р77 | `alfredo` | Что бы ты ни делал — люби это. Как любил будку, когда был маленьким | 4.3 |
| Р78 | `narrator` | Тридцать лет я не возвращался | 2.0 |
| Р79 | `narrator` | Тот же перрон. Только меньше | 2.0 |
| Р80 | `narrator` | Я всё ещё носил его с собой | 1.9 |
| Р81 | `maria_old` | Я ничего не трогала. Всё как было | 2.3 |
| Р82 | `narrator` | Три минуты. Она всё ещё шла через площадь | 2.8 |
| Р83 | `maria_old` | Ты мне раз в жизни сказал правду — про молоко. Скажи и теперь: ты счастлив? | 4.8 |
| Р84 | `maria_old` | Когда я звонила, всегда брала трубку другая женщина. Ни одна не говорила так, будто тебя любит. Ты счастлив? | 6.8 |
| Р85 | `salvatore` | Я снял всё, что хотел, мама | 1.9 |
| Р86 | `salvatore` | Нет, мама | 0.8 |
| Р87 | `madman_old` | Площадь моя! | 1.0 |
| Р88 | `narrator` | Я подумал, что сошёл с ума | 1.9 |
| Р89 | `narrator` | Я не пошёл. Пусть останется, как было | 2.5 |
| Р90 | `elena_grown` | Тото. Я знала, что ты приедешь | 2.1 |
| Р91 | `salvatore` | Это твоя дочь? | 1.1 |
| Р92 | `elena_grown` | Моя. Ей семнадцать | 1.4 |
| Р93 | `elena_grown` | Я пришла тогда. В будку. Опоздала | 2.3 |
| Р94 | `elena_grown` | Альфредо сказал: если любишь — оставь его. Я оставила тебе записку. На календаре | 5.1 |
| Р95 | `salvatore` | Я её не видел. Никогда | 1.6 |
| Р96 | `elena_grown` | Будущего у нас нет, Тото. Есть только прошлое | 3.0 |
| Р97 | `elena_grown` | Ты перестал писать первым. Помнишь? | 2.4 |
| Р98 | `salvatore` | Помню. Рим. Работа | 1.4 |
| Р99 | `elena_grown` | Мы были детьми. Это было хорошее лето | 2.5 |
| Р100 | `narrator` | Альфредо везли мимо «Парадизо» | 2.1 |
| Р101 | `narrator` | Я шёл за ним. Я знал про записку | 2.2 |
| Р102 | `narrator` | Я не пошёл за ним. Я знал про записку | 2.5 |
| Р103 | `anna` | Он оставил тебе. Велел отдать в руки | 2.5 |
| Р104 | `anna` | Читать про тебя в газетах велел. Вслух. А написать тебе — ни разу не написал | 4.8 |
| Р105 | `anna` | Каждое лето спрашивал: Тото не приехал? | 2.6 |
| Р106 | `narrator` | Я поднялся в будку. В последний раз | 2.4 |
| Р107 | `narrator` | Тридцать лет она висела здесь. За дверью | 2.7 |
| Р108 | `narrator` | Все поцелуи, что вырезал отец Адельфио. Он их сохранил | 3.5 |
| Р109 | `madman_old` | Моя площадь… | 1.0 |
| Р110 | `salvatore` | Пускай | 0.7 |
| Р111 | `alfredo` | А это рычаг. Мигнёт точка — мотор. Вторая — рычаг | 3.2 |
| Р112 | `alfredo` | Из кино. Зато правда | 1.5 |
| Р113 | `toto` | Я. Тото | 0.7 |
| Р114 | `toto` | Она пишет мне. Я могу остаться — и ждать | 2.7 |
| Р115 | `toto` | Уеду | 0.5 |
| Р116 | `toto` | Останусь. Ещё на год | 1.5 |
| Р117 | `alfredo` | Ты сидишь, как я сидел. Уезжай, пока не прирос | 3.1 |
| Р118 | `narrator` | Через год они посадили меня в поезд | 2.4 |
| Р119 | `narrator` | Он сказал — не возвращайся. Я и не вернулся | 2.9 |
| Р120 | `narrator` | Он звал. Я не ехал | 1.4 |
| Р121 | `salvatore` | Поедем со мной. Завтра | 1.6 |
| Р122 | `salvatore` | Прощай, Елена | 1.1 |
| Р123 | `elena_grown` | Прощай, Тото. Найди записку | 1.9 |
| Р124 | `elena_grown` | У меня дочь, Тото. Поздно | 1.8 |
| Р125 | `narrator` | Я понял про солдата. Сказать уже некому | 2.6 |
| Р126 | `elena` | Тото, я приходила. Альфредо сказал, что так будет лучше для тебя. Я буду ждать | 5.0 |
| Р127 | `elena` | Тото, в Палермо жарко и нет кино. Пиши мне | 2.8 |
| Р128 | `toto_boy` | Он звонил. А я прятался | 1.6 |
| Р129 | `alfredo` | Зал свистел. Я слышал | 1.5 |

Записка и письмо Елены и озвучены (Р126, Р127), и показаны листом; конверт — «Адресат выбыл» — только текстом.

### Звуки страницы (`sound.js`)

Всё синтезируется в Web Audio, файлов нет, по образцу «Алых парусов»: один `AudioContext` → общий уровень →
компрессор; посыл в реверберацию (площадь — открытый воздух 1.6 с, тёплая; будка — комната 0.4 с); шумовые буферы;
пауза и первое касание — страницы (выход через `MooodVolume.output`: звуки ждут с партией, как музыка, — затухая и возвращаясь); `background(levels, seconds)` — названные подложки к уровню, остальные в ноль (его зовёт страница);
`unheard()` — немой двойник для невидимого шага: **в нём перечислен каждый звук по имени**, подложки тоже немые,
`theme()` и `camera8()` отдают немую ручку `{loud() {}, stop() {}}`; `whirr(level, s)` — та же подложка, что в
`background`, по одной.

Подложки игра объявляет, а не переключает: со сценой — `g.scene(…, {beds})` (страница меняет их на склейке вместе с
музыкой сцены, тем же переходом), внутри сцены — `g.beds(…)` (сразу, тем же переходом); секунды игра не задаёт, на карте —
`background` в `b.show` (moood `bespoke.background`, `docs/games/README.md`).

| Звук | Вид | Как сделан | Где |
| --- | --- | --- | --- |
| `whirr(level, s)` | подложка, **главный инструмент** | стрекот проектора: щелчки 24 в секунду (короткие импульсы шума через полосу 2–4 кГц, лёгкий разброс громкости) + гул мотора (пила 50 Гц через НЧ) + шелест плёнки | будка, зал, пристань летом, Рим; в V — только вспышка `memory` и «Лента» |
| `hall(level, s)` | подложка | обрывки музыки фильма сквозь стену: струнные и духовые аккорды через НЧ 800 Гц, фразы по 4–6 с с паузами, гул зала | зал, будка |
| `square(level, s)` | подложка | гул площади: далёкие голоса (формантный шум), шаги по камню изредка | площадь в прошлом |
| `crowd(level, s)` | подложка | плотный гул толпы | снос |
| `cicadas(level, s)` | подложка | цикады: высокие пульсирующие полосы шума 4–6 кГц | летние ночи |
| `sea(level, s)` | подложка | бурый шум через НЧ, волна раз в 7–9 с | пристань, площадь у моря |
| `rain(level, s)` | подложка | розовый шум через ВЧ + капли | пристань, «Сто ночей», `autumn` |
| `fire(level, s)` | подложка | треск: щелчки белого шума + гул | пожар |
| `wind_cold(level, s)` | подложка | ветер, розовый шум 200–600 Гц, тише и холоднее | глава V, пролог |
| `station(level, s)` | подложка | шипение пара, далёкий колокол станции раз в 20 с | вокзал |
| `theme()` | ручка `{loud(v, s), stop(s)}` | тема «Парадизо» — **наша мелодия** (музыка фильма не наша): медленная мелодия струнных (пила с вибрато через НЧ) над аккордами, мотив — её начало; ноты записаны в `sound.js` одной таблицей | II.2 (впервые целиком, тихо), «Лента», эпилог |
| `motif()` | раз | пять нот темы на челесте: синус + слабая октава, длинный хвост | когда загорается луч, поцелуй |
| `camera8()` | ручка | стрекот восьмимиллиметровки: щелчки 18 в секунду, тоньше и тише `whirr` | «Камера», III.1, V.2 |
| `bell()` | раз | ручной колокольчик: три звонких удара (синусы 2.1 и 3.4 кГц с быстрым спадом) | «Подглядывать» |
| `creak()` | раз | скрип кресла: пила 120–180 Гц через резонанс, 0.5 с | «Подглядывать» |
| `scissors()` | раз | щелчок ножниц: два коротких металлических щелчка | «Склейка» |
| `press()` | раз | глухой щелчок пресса | «Склейка» |
| `chalk()`, `chalkSqueak()` | раз | мел: короткий шорох; скрип — высокий визг 3 кГц | «Буквы», «Сто ночей» |
| `click()` | раз | щелчок зубца | «Заправка» |
| `clunk()` | раз | лязг рычага | «Луч», «Смена» |
| `motor()` | раз | пуск мотора: гул, нарастающий 0.6 с | «Смена» |
| `tick()`, `tick2()` | раз | тихий щелчок; второй — выше и звонче | «Смена» |
| `laugh()`, `roar()`, `applause()`, `whistle()` | раз | толпа: смех волной; рёв со свистом; аплодисменты (частые щелчки шума); свист (2–3 синуса 2–3 кГц) | зал, площадь |
| `whisper()` | раз | шёпот нескольких голосов, тихо | V.4 |
| `giggle()` | раз | смех девушки: короткие высокие формантные вспышки | III.1 |
| `coins()`, `slap()` | раз | звон монет; хлопок | I.3 |
| `flame()` | раз | вспышка: шум с быстрым подъёмом через НЧ | II.3 |
| `drag()`, `cough()` | раз | шорох по доскам; кашель (две шумовые вспышки) | «Вытащить» |
| `band()` | раз | далёкий оркестрик: три аккорда духовых | «Сто ночей» |
| `shutter()` | раз | стук ставни | «Сто ночей» |
| `fireworks()` | раз | хлопки и треск, 4 с | III.4 |
| `reelEnd()` | раз | хвост плёнки хлопает по бобине: частые шлепки, затухают | III.4 |
| `steps()`, `door()` | раз | шаги по лестнице; хлопок двери | IV |
| `car()` | раз | мотор машины, отъезд | IV.1, V.3 |
| `trainHiss()`, `trainWhistle()` | раз | пар; гудок паровоза | IV.6 |
| `church()` | раз | колокол, пять ударов, далеко | V.4 |
| `pigeons()` | раз | хлопанье крыльев | V.5 |
| `paper()`, `puff()` | раз | шелест листа; облачко пыли | письма, «Записка» |
| `whistleBlow()`, `blast()` | раз | свисток; взрыв — низкий удар и долгий грохот с осыпью | снос |

### Музыка сцен

`music` каждой сцены — тихая подложка без мелодии; игра ею не управляет. Тему, мотив и стрекот играет игра.

## 9. Интерфейс и стиль (`ui.js`, `ui.css`, `fonts.css`)

- **Интертитры.** Переменные на `#layer`: `--card` (`#0d0b09`), `--ink` (`#efe8da`, белое старой плёнки),
  `--frame` (`#efe8da` в 0.8), `--beam` (`#f2c46b` — **только** луч шкалы Тото и выбранные кадры карты),
  `--below-header` (46 px). Тосты и подсказка — чёрная карточка с тонкой двойной рамкой и уголками,
  буквы белые; лёгкое мерцание (`opacity` 0.94–1, шаг 1/12 с, CSS-анимация) и зерно (SVG-шум, 6 %).
- **Шрифт** — «Paradizo Title»: Cormorant Garamond (OFL 1.1, кириллица), встроен в `fonts.css` как woff2 в base64.
- **Шкалы** (`view.gauges(state | null, hero)`), `pointer-events: none`, обе на 64 px выше низа:
  - луч — слева внизу, SVG 72×72: тёмный прямоугольник окошка вверху слева, из него клин луча вниз-вправо, внизу
    три маленьких окна площади. `u = (t + 5) / 10` (`t` — `scales.toto`): клин — `--beam` с прозрачностью 0.2 + 0.8·u;
    окна — от тёмного к тёплому `#e9b46a` с 0.2 + 0.8·(1 − u); переход 2 с.
  - катушка — справа внизу, SVG 72×72: бобина с намотанной плёнкой; хвост плёнки уходит вправо-вверх, длина
    `8 + 40 · (3 − a) / 6` px (`a` — `scales.alfredo`): Держать — короткий хвост, Отпустить — длинный, хвост
    колышется (CSS); переход 2 с.
  - шкала героя сцены — `opacity` 1, другая — 0.35; `both` — обе 1.
- **Тосты** (`view.toast(text, kind)`): справа вверху под инструментами, не больше трёх, 4.2 с (`rule` — 7.5 с); виды
  `scale`, `rule`, `mark`.
- **Подсказка** (`view.hint`) — одна строка внизу посередине (у лампы «Плёнки» и у касаний; в мини-играх — плашка
  языка).
- **Стиль языка мини-игр** — один раз, `b.minigame.style`: шрифт плашки и лепестков — «Paradizo Title», линии меток и
  призрачный палец — `--ink`; тёплого `--beam` в языке нет (тёплое — только луч и кадры карты).
- **Титр** (`view.title`) — название в прологе, 9 с, интертитр во весь экран, но прозрачный по краям.
- **Письмо** (`view.letter`): `note` — пожелтевший лист календаря, карандаш; `letter` — лист в линейку, синие
  чернила; `envelope` — конверт, штамп фиолетовым. Нажал — развернул, нажал — сложил.
- **Инструменты**: ⏸ — всем; ⏭ — всем во время мини-игры (§7), вне её — автору; ☰ — автору; справа вверху под шапкой, `z-index` 10.
- Метки и лепестки выбора (язык), пузыри реплик — страницы; игра своих колец не рисует.
- **Карта выборов и титулы глав** — сцена «Плёнка», не интерфейс.

## 10. Что сделано не так, как в фильме и в замысле, и почему

| В фильме / замысле | Как сделано | Почему |
| --- | --- | --- |
| Альфредо перехватывает Елену сам, зритель узнаёт в конце | это выбор игрока за Альфредо в IV.3; Сальваторе узнаёт, только если пойдёт за девушкой | серый выбор и «игрок знает больше героя»; пожелание владельца «Альфредо разлучает их — узнать, простить» |
| Тото уезжает, потому что Альфредо велел | выбор Тото «Уеду» / «Останусь» (IV.5); «Останусь» — ещё год в будке, и всё равно поезд: его сажают мать и Альфредо | пожелание владельца «уехать или остаться»; скелет держится — вокзал всегда |
| Тото выносит Альфредо из огня, его выносят на площадь мужчины | мальчик тащит его до двери (мини-игра); на площади он уже сидит на фонтане | модель движений не носит людей |
| поцелуи героев | объятия средним планом, лица видны; поцелуи — только на экранах | поцелуя модель движений не делает |
| гроб несут | катафалк толкают; «идти за гробом» — рука на повозке | то же |
| экзамен Альфредо в школе | уговор в будке и мини-игра «Буквы» | класс — ещё одна сцена ради одного куска без нового выбора; суть (Альфредо неграмотен и учится у мальчика) сохранена |
| армия, звонки из казармы | одна строка рассказчика и письма | без выбора это смотрение |
| Рим, работа Сальваторе, женщины | одна строка матери (Р84) и просмотровый зал в эпилоге | свет игры — Джанкальдо |
| Елена и Сальваторе проводят ночь в машине | разговор у машины, его «Поедем со мной» или «Прощай» (выбор), её отъезд | «будущего нет» сохранено; ночь вдвоём — не нужна выбору |
| лента поцелуев — только в Риме | ещё и «Лента» в разрушенной будке; в Риме — короче (≈ 38 с), первыми — три вырезанных в I | руки игрока должны тронуть то, что он резал; не повторять одно и то же дважды |
| «Почему солдат ушёл?» — Тото так и не отвечает в фильме вслух | Р125 в будке: «Я понял про солдата. Сказать уже некому» | обещание Р46 оплачено, ответ не назван |

Реплики — свои, по смыслу фильма; близкие к фильму: Р10, Р24, Р26, Р42–Р46, Р72, Р73, Р75, Р77, Р96.

## 11. Проверка веток (`bespoke/check/`)

`node bespoke/check/run.mjs <клон мира>` — без браузера, без движка, ничего не рисует.

- `fake.mjs` — поддельная `b`: `specOf(title)` отвечает из `scenes/*/scene.json` клона; остальное — пустышки. Шаги
  идут всухую тем же путём, что ☰ автора (`jump(Infinity, unheard(), {result})`, `context(…, j)`): без времени, выборы
  — из заданного состояния, мини-игры — подставленным итогом. **После каждого `g.play` обёртка зовёт по разу каждую
  функцию из `opts` (`onFirstBell`, `onCaught`, `onCrooked`, `onFocus(1)`, `onFrame(true)`, `onProgress(1)`), а
  `g.letter` — свою `voice`**: так реплики, которые говорят мини-игры и письма (Р04, Р05, Р08, Р126, Р127), попадают в
  список.
- Обход: все сочетания двенадцати выборов — 4096 (мини-игры — `skipped`), и по одной партии с итогами `{seen: 0,
  caught: 1}`, `{jumps: 2}`, `{slips: 1}`, `{crooked: '01000100'}`, `{share: 0.3}`, `{missed: 1}`. Каждая — все 28 шагов подряд (пролог 1, I 5, II 5, III 4, IV 6, V 5, эпилог 2),
  состояние переходит из шага в шаг.
- Что записывает (обёртка над `j`): каждое `g.scene` (название и ключи), `g.beat`, `g.told`, `g.set/move/get` (ключ,
  в том числе `beat_next`), ключ предложения, `at` реплики, точки мини-игр из таблицы §7, текст и говорящего каждой
  реплики, звуки.
- С чем сверяет — с блоком «Контракт для проверки» из `notes.md` каждой сцены и её `scene.json`: сцена есть; кусок
  есть; кусок идёт после своего `after` или открывает сцену, или он — склейка внутри сцены: тогда он следующий по
  таблице после текущего, либо перед ним был `beat_next` на него (иначе — сообщить, §4); момент есть у этого куска; ключ есть в `states` и (для ключей игры)
  в `keys`; ключ партии из `carry` есть в `party`; точка и предложение есть; элемент предложения имеет `name`;
  говорящий есть в `PEOPLE`; звук есть в `sound.js` и в `unheard()`; поля `opts` и итога, которые глава даёт и
  читает, есть у мини-игры.
- **Согласие концовки** на каждом пути (то, что может не совпасть): `note` ⇔ сказана Р93 ⇔ сыграна «Записка» ⇔
  `note_in_hand` 1 ⇔ Р107; `letters` ⇔ Р97; `turn` ⇔ Р89; `hold` ⇔ Р105; `kino` ⇔ Р85 ⇔ `with_mother` 0; `frame` ⇔
  `wallet`; `reel8` ⇔ `home_movie`; `stay` ⇔ `autumn`; `elena` `truth` ⇔ Р114 ⇔ `letter_in_hand` 1; `seen` < 2 ⇔
  Р128; `missed` ≥ 1 ⇔ Р129; итог «Склейки» ⇔ `jumps` в Будке и Риме; итог «Камеры» ⇔ `share` в Доме; итог «Букв» ⇔
  `slate_letters`; `slips` ≥ 1 ⇔ `stutter` 1.
- Обратно: кусок, момент, ключ партии, точка из контрактов сцен, которых не назвала ни одна партия, — списком;
  реплики §8, не сказанные ни в одной партии, — списком (должно быть пусто).
- Печатает: расхождения; список всех сказанных реплик без повторов (кто, текст) — по нему записывают голоса; по каждой
  концовке — список кусков по шагам и время: сумма `seconds` кусков, длин реплик и `about` мини-игр — по главам и
  всего; каждый отрезок смотрения без действия дольше 90 с.

**Длина по сценарию** (пересчитано в третьей редакции по таблицам кусков и §7; в четвёртой — +3 с в `girl` (стена с
палочками), Р71 и Р111 длиннее на 0.7 с вместе, дрожь кадра в `motor` — внутри куска: минуты те же; куски, мини-игры по их правилам
(`about`), касания и выборы по 4 с, письма 6 с, «Плёнка» ≈ 30 с на переход главы, реплики по 0,3 + 0,06 с на букву):
**23–27 минут** на путь — нижняя граница, если реплики лежат внутри кусков (сцена держит позу), верхняя — если
сложены сверху; середина ≈ 25. Короче всего — «Пусть останется» без плёнки и с «Уеду», длиннее — «Записка» с
«Останусь». По главам (с репликами): пролог 0.5, I ≈ 4.4, II ≈ 4.3, III ≈ 3.4, IV ≈ 5.4, V ≈ 4.0–5.6, эпилог ≈ 1.6
минуты, «Плёнка» между главами ≈ 2.5. По уроку «Алых парусов» готовая игра выходит короче сценария: ждать
**≈ 20–23 минуты**. Владелец решил: короткая игра — хорошо, длину ради длины не добавляем.
