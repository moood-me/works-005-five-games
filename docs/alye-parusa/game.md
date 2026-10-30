# Алые паруса: игра в коде

> С 2026-10-16 (мультиязычность, `moood-me/studio:docs/history/2026-10-16-multilang.md`): код и тексты — по-английски, русский —
> перевод (`lang/`); люди — `bespoke/people.json`, реплики — `b.say` рантайма; сцены, модули, мини-игры — с английскими
> именами (список — `moood-me/studio:docs/history/2026-10-16-multilang-migration.md`); раздел проверки в `notes.md` — «Contract for the
> check». Ниже — как было сделано до этого (и `scenes.md`, `work.md`, `design.md` рядом).

2026-10-11, вторая редакция (после трёх проверок). Как устроен код игры: по этому файлу и [scenes.md](scenes.md)
пишется всё в её репозитории. Замысел — [design.md](design.md) (история — только оттуда); кто что пишет и в каком
порядке — [work.md](work.md). Образец каркаса — игра «Падение дома Ашеров v2»
(`moood-me/pavel--game--padenie-doma-asherov-v2`, ветка `env/dev`): файлы оттуда берутся как сказано ниже; всё Ашерово
в них (трещина, «Мэдлин это слышала», `g.end`) убирается.

Экран — лёжа; сначала компьютер: всё делается одним указателем (мышь или один палец), без наведения, цели не меньше
44 px. Под телефон стоймя ничего не делается.

## 1. Репозиторий игры

Игра: тип `bespoke`, название «Алые паруса», мир `pavel--alye-parusa-v2`. Меняются только `game.json` и `bespoke/**`.

| Файл | Что это | Откуда | Область (work.md) |
| --- | --- | --- | --- |
| `game.json` | `{type: "bespoke", title: "Алые паруса", description, genres: {"драма": 80, "отношения": 70, "погружение": 60}, world: "pavel--alye-parusa-v2", scenes: []}` | создаёт MCP | координатор |
| `bespoke/game.js` | вход: порядок глав, цикл, сохранение, «Даль» между главами, переходы автора | Ашеры, с правками §3 | Каркас |
| `bespoke/story.js` | словарь шага (`g`), `PEOPLE`, `SCALES`, `SCENES`, `ENDINGS`, `facts`, `carry`, `listen` | Ашеры, с правками §3–§5 | Каркас |
| `bespoke/jump.js` | шаг, сыгранный невидимо до мини-игры | Ашеры, одна правка (§3.13) | Каркас |
| `bespoke/ui.js`, `ui.css`, `fonts.css` | всё, что игра показывает поверх сцены | свои (устройство — как у Ашеров) | Каркас |
| `bespoke/sound.js` | звуки страницы, синтез | свой, по образцу Ашеров | Звук |
| `bespoke/chapters/prologue.js`, `1.js` … `5.js`, `epilogue.js` | главы | свои | Главы |
| `bespoke/minigames/<имя>.js` | одиннадцать мини-игр на языке мини-игр (§7) | свои | Мини-игры |
| `bespoke/check/run.mjs`, `fake.mjs` | проверка веток: node, без движка и без картинки (§11) | свои | Проверка веток |

## 2. Что даёт страница

`bespoke` (`b`) — `moood/web/site/bespoke/play.js`, шапка файла — полный список. Игра берёт: `b.show`, `b.specOf`,
`b.get/set`, `b.on`, `b.say`, `b.hush`, `b.where`, `b.frame`, `b.act('state', 'move', …)`, `b.layer`,
`b.css`, `b.saved`, `b.keep`, `b.restart`, `b.trouble`, `b.pause`, `b.minigame` (язык мини-игр). Слушателей `b.on` снять нельзя — их ставит один
`listen(b)`; шаги и мини-игры слушают сцену только через `g.told`, `g.when`, `g.watch`. **`b.get` у значения, которое
движется, отдаёт цель, а не место**: где сейчас то, что игра двигает сама, она считает сама.

## 3. Каркас: что берём у Ашеров и что меняем

Берём как есть: цикл глав и шагов, сохранение после каждого шага, шаг заново с начала, ⏸ ⏭ ☰, переход к мини-игре,
`hub`, ожидания `told/when/arrived/watch`, `say`, `choose`, `beat`, `play`, `move`, `wait`, `title`.

Меняем (каждое — одним способом):

1. **Две шкалы с двумя сторонами.** `SCALES` (§5). `g.scale(name, delta)`: тост — `up` и стрелки при `delta` > 0, `down`
   и стрелки при `delta` < 0; стрелок столько, сколько |`delta`|. Шкалу, которой ещё не видно, `g.scale` показывает без
   правила (`state.shown[name] ||= 'bare'`).
2. **Шкала видна раньше правила.** `g.gauge(name, {rule: false})` — показать без строки; `g.gauge(name)` — показать и
   сказать правило один раз (`state.shown[name] = true`).
3. **Чья сейчас сцена.** `g.hero('assol' | 'grey' | 'both')` — первая строка каждого шага: шкала героя — в полную силу,
   другая — на треть.
4. **Подложки звука — набором.** `g.beds({sea: 0.4, campfire: 0.6}, seconds = 2)` — вторая строка каждого шага:
   названные подложки идут к своему уровню, **все остальные — к нулю**. Так шаг звучит одинаково, откуда бы в него ни
   пришли.
5. **Значения партии в каждой сцене.** `g.scene` сам добавляет ключи партии этой сцены: `carry(title, facts(state))`
   (§5), только те, что есть в `states` сцены; `state` шага — поверх.
6. **Склейка между сценами.** `g.scene(title, state, {cut: true})` → `b.show(…, {fade: false})`: прежняя сцена живёт на
   экране, пока новая не нарисована, и сменяется ею в одном кадре. Без `cut` — затемнение страницы (ход времени).
   Склейки — в прологе, в I.1 и во всех шагах главы V.
7. **Точка сцены в числах** — для склейки пролога: `await g.spot(ref)` → `{x, y}` — где точка на экране, в высотах кадра
   от его середины (x вправо, y вниз), по `b.where` и `b.frame`; спрашивает каждый кадр до ответа (до 1 с), иначе
   `null`. Невидимо — сразу `null`.
8. **Служебная сцена — «Даль»**, нажимается яхта: `hub.offer({'korablik#sail': options})`, подсказка «Коснись
   кораблика». Состояние: `{chapter_number, chapter_title, map, reveal: 0, korablik: 1}`; `reveal` → 1 за 3.5 с (титул)
   или 2.5 + 1.2 с на строку. Глава может сказать `wall: false` — тогда перед ней «Дали» нет: так у главы I (пролог
   переходит в неё без остановки) и у эпилога (музыка финала не обрывается). Самая первая «Даль» (перед прологом) —
   без титула, только яхта: первое касание, после него страница звучит. В «Дали» — `g.beds({sea: 0.3})`, шкалы скрыты.
9. **Нет досрочного конца.** `g.end`, `state.ending`, `ends: true` убраны; после главы V всегда эпилог. Концовка
   считается (`facts(state).ending`). После эпилога — «Даль» со всей партией: пять строк `⚑` всех глав (с номером
   главы) и строка «Финал» из четырёх вариантов `ENDINGS`; яхта: только «Сыграть заново» (`b.restart()`; автор
   идёт к главе через ☰). Карта после главы — все её строки (`⚑` и `~`); яхта: «Дальше», «Пройти главу заново».
10. **Мини-игра — на языке мини-игр.** `g.minigame({phrase, sample})` (внутри `run`) начинает её на странице
    (`b.minigame.start`): метки, жесты, плашка с фразой, призрачный палец — страницы; пропуск — ⏭ автора
    (`b.minigame.skip()`, по `signal`). Выхода для игрока нет: проигрыша и тупиков нет, ошибка — вид, звук и щербинка на
    плашке (§7). Стиль языка игра задаёт один раз: шрифт плашки «Parusa Hand» (`b.minigame.style`). Обычный выбор —
    тоже язык: `hub.offer` (через него `g.choose` и яхта «Дали») — `b.minigame.start({plate: false})`, метка на каждой
    точке (`'id#point'`; `'id'` — где элемент нажат); касание открывает её лепестки — всегда, даже из одного
    («Я не вру», «Начать», «Дальше» / «Пройти главу заново», «Сыграть заново»): что выбираешь, видно словами, слово
    нажимают явно; касание мимо или другой метки закрывает (другая открывает свои). Точка одна — светится сама вещь.
    `b.offer` страницы игра не берёт (на движке 3 он — ошибка).
11. **Подсказка — каркаса.** `g.hint(text, afterMs = 0)` → функция «убрать»: одна строка внизу, не в мини-играх (их
    подсказывает язык). Её использует «Даль» («Коснись кораблика»); в `hub.offer` через 8 с без касания призрачный палец
    по очереди нажимает каждую метку.
12. **Метки.** `g.mark(key, value, text)`; тост вида `mark`. `g.overheard`, `state.heard`, `CRACK_FULL`, `crackIn`,
    `g.think` убраны.
13. **Проверка веток и партии автора.** `jump(target, quiet, {result})`: в невидимом шаге `g.play` отдаёт
    `result?.(minigame) ?? minigame.skipped` — так проверка подставляет итоги мини-игр. В ☰ автора — «партия как…»:
    готовые наборы выборов (`PLAYS` в `game.js`: четыре концовки и «Лонгрен в море»), с которых начинается переход
    вместо пустого состояния; шкалы набора считаются из его выборов.
14. **Письмо и записка** — `g.letter({text, sign})`: лист небелёной бумаги, сложенный втрое, синие чернила, без печати;
    нажал — развернул, нажал — сложил. **Стиль** — §9.

## 4. Словарь шага (`story.js`), точные подписи

```js
export const SCENES = { shore: 'Берег Каперны', home: 'Дом Лонгрена', forest: 'Лес у моря', castle: 'Замок Греев',
  deck: 'Палуба', shop: 'Лавка в Лиссе', far: 'Даль' };
export function facts(state)            // §5
export function carry(title, facts)     // §5
export function context(b, view, hub, state, j = null)  // → g
export function listen(b)               // → hub

g.state; g.signal; g.sound
g.hero(who)                             // 'assol' | 'grey' | 'both'
g.beds(levels)                          // {имя подложки: уровень}; остальные — в ноль; сразу (внутри сцены)
await g.scene(title, state = {}, { cut = false, beds } = {})  // beds — подложки сцены: на её склейке, с музыкой
g.set(key, value, seconds); g.get(key)
await g.move(key, value, seconds, ease) // движение режиссёром; ждёт конца
await g.wait(ms)                        // только своё время игры
await g.told(text, ms = 60000)          // → true | false
await g.when(key, test, ms = 60000); await g.arrived(who, ms = 60000); g.watch(key, fn)
await g.spot(ref)                       // → {x, y} | null
await g.say(who, text, at = who)        // who — ключ PEOPLE; at — 'id' | 'id#точка' | 'narrator'
await g.choose(choice, {ref: [{id, label}], …})   // → id варианта; пишет state.choices[choice]; choice null — не пишет
g.withdraw()
await g.beat(name, { wait = true } = {})
await g.play(minigame, opts = {})       // → итог мини-игры (или её skipped)
g.hint(text, afterMs = 0)               // → off()
g.minigame({phrase, sample})          // → mg: мини-игра на языке, только внутри run (§3.10)
g.scale(name, delta); g.gauge(name, { rule = true } = {})
g.mark(key, value, text)
await g.letter({ text, sign }); await g.title(text)
```

Правила шага (все обязательны):

- Шаг начинается с `g.hero(…)` и `g.scene(…, {beds})`; читает только `g.state` и `facts(g.state)`. Его можно
  сыграть заново, пропустить, войти в него с середины и прогнать всухую.
- Сцену открывают сразу на первом куске: `await g.scene(T, {beat: 'x'})`, потом `await g.beat('x')`.
- Ждать момент сцены — только её событием. Ожидание делается **до** куска, которому момент принадлежит (если это первый
  кусок — до `g.scene`):
  ```js
  const turned = g.told('decide:turned');
  const decide = g.beat('decide');
  await turned;
  await g.say('longren', 'Игрушки никому не нужны, Ассоль. Пойду опять в море — на почтовый пароход');
  await decide;
  ```
- Реплика — всегда вызов `g.say` с двумя **строковыми литералами**: кто и текст — буква в букву из списка §8. Никаких
  таблиц строк и склеек. Где реплику выбирает мини-игра, глава передаёт ей функции, в каждой — свой литерал.
- У Ассоль и Грея один элемент сцены на все возрасты, а голоса разные: `g.say('assol_child', '…', 'assol')`. Пока
  открыта вставка во весь кадр, реплика ставится внизу: `at = 'narrator'`.
- После `g.play` глава сама ставит ключи сцены и подложки в итог — строка «после игры» в §6: пропущенная мини-игра
  оставляет сцену и звук такими же, как сыгранная.
- Ручки звука (`violin`, `song`) останавливают в конце шага и по `g.signal`.
- Состояние меняют только `g.choose`, `g.scale`, `g.gauge`, `g.mark`.
- Шапка каждой главы говорит, что она читает и что оставляет.

Глава: `export default { number, title, wall?: false, titles: [имена шагов], choices: [{id, weight: '⚑' | '~', title,
options: [{id, label}]}], steps: [async g => …] }`.

## 5. Состояние партии

| Поле `g.state` | Кто ставит | Кто читает |
| --- | --- | --- |
| `chapter`, `step`, `start`, `play` | `game.js` | `game.js` |
| `scales.tale` (−3…3, начало 0) | `g.scale('tale', ±1)`: I.6, III.4, IV.3 | `facts`, шкала-кораблик |
| `scales.sea` (−4…4, начало 0) | `g.scale('sea', …)`: II.3 ±1, II.4 +1, II.5 ±2 | `facts`, компас, «Курс» |
| `shown.tale`, `shown.sea` | `g.gauge`, `g.scale` | `view.gauges` |
| `choices.egl_ask` | I.4: `when` · `how` | карта главы |
| `choices.kids` | I.6: `true` · `made_up` | карта |
| `choices.leave` | II.3: `farewell` · `quiet` | `facts.ringKind`, `facts.leave`, карта |
| `choices.letter` | II.5: `home` · `share` | `facts.wine`, карта |
| `choices.longren` | III.1: `go` · `stay` | `facts.longren`, III.6, карта |
| `choices.ring` | III.4: `wear` · `hide` | `facts.ring`, карта |
| `choices.way` | III.6: `secret` · `straight` | `facts.way`, карта |
| `choices.girl` | IV.3: `give` · `keep` | `facts.girlToy`, карта |
| `marks.mother` | II.3 `quiet`: `'note'` | запись партии (платит её `facts.leave`: мать в `return`) |
| `marks.longren` | III.1: `'go'` · `'stay'` | запись (платит `facts.longren`) |
| `marks.girl` | IV.3 `give`: `true` | запись (платит `facts.girlToy`: девочка с яхтой на берегу в любой концовке) |
| `marks.kurs1`, `kurs2`, `kurs3` | V.1, V.3, V.5: ровность отрезка 0…1 | V.5 |
| `marks.morning` | V.5: час прихода 0.27…0.36 | `facts.morning` |

```js
export const SCALES = {
  tale: { start: 0, min: -3, max: 3, up: 'Сказка', down: 'Люди',
    rule: 'Паруса алеют, когда Ассоль верит. Белеют, когда она живёт как все.' },
  sea: { start: 0, min: -4, max: 4, up: 'Море', down: 'Дом', rule: 'Стрелка — куда тянет Грея: домой или в море.' },
};
export const ENDINGS = [
  { id: 'grin', label: 'Как у Грина' }, { id: 'cry', label: 'Красные паруса плывут!' },
  { id: 'waited', label: 'Она ждала' }, { id: 'kaperna', label: 'Вся Каперна' },
];
export function facts(state) {
  const c = state.choices, tale = state.scales.tale >= 0 ? 'tale' : 'people', way = c.way ?? 'secret';
  const home = c.letter ? c.letter === 'home' : state.scales.sea < 0;   // сторона Грея: её решает письмо
  return {
    tale,                                              // 'tale' | 'people'
    warm: Math.min(1, Math.max(0, (3 - state.scales.tale) / 6)),   // 0 Сказка … 1 Люди
    sea: home ? 'home' : 'sea',                        // 'sea' | 'home'
    home: Math.min(1, Math.max(0, (4 - state.scales.sea) / 8)),    // 0 Море … 1 Дом
    way,                                               // 'secret' | 'straight'
    longren: way === 'straight' ? 'knows' : c.longren === 'go' ? 'sea' : 'home',
    ring: c.ring === 'wear' ? 'finger' : c.ring === 'hide' ? 'cord' : 'none',
    ringKind: c.leave === 'farewell' ? 'mother' : 'own',
    leave: c.leave === 'quiet' ? 'note' : 'farewell',
    girlToy: c.girl === 'give',
    wine: home,
    ending: way === 'straight' ? (tale === 'tale' ? 'waited' : 'kaperna') : tale === 'tale' ? 'grin' : 'cry',
    morning: state.marks.morning ?? 0.3,
  };
}
```

Пропущенный автором шаг не оставляет выбора: `facts` даёт тогда значения по умолчанию, написанные выше. В полной
партии `scales.sea` > 0 ровно тогда, когда письмо — «только за долей» (±2 против ±1 и +1), так что бочка, письмо матери
и поздний приход не расходятся со стрелкой; простившийся, сорвавшийся на вантах и оставшийся дома Грей даёт стрелку
ровно посередине при всех исходах «Дома» — это принято.

**Состояние → ключи партии сцен** (`carry`):

| Сцена | Ключи |
| --- | --- |
| Берег Каперны | `ring: f.ring`, `ring_kind: f.ringKind`, `warm: f.warm`, `girl_toy: f.girlToy ? 1 : 0`, `longren: f.longren`, `ending: f.ending`, `morning: f.morning` |
| Дом Лонгрена | `ring: f.ring`, `ring_kind: f.ringKind`, `longren: f.longren`, `girl_toy: f.girlToy ? 1 : 0` |
| Лес у моря | `ring_kind: f.ringKind` |
| Замок Греев | `home: f.home`, `leave: f.leave`, `letter: f.wine ? 1 : 0` |
| Палуба | `wine: f.wine ? 1 : 0` |
| Лавка в Лиссе, Даль | — |

## 6. Главы по шагам

Запись: **сцена** · `кусок` · Рnn — реплика из §8 (там её текст и кто говорит; «у X» — где стоит пузырь, если не над
говорящим) · *момент*, по которому она говорится. «(крупно)» — кадр камерой, одна строка `await g.beat(…)`, её можно
убрать. Подложки — полный набор шага; остальные звуки — §8.

### Пролог — `prologue.js` (`number: ''`, `title: 'Пролог'`, без выборов)

Шаг «Берег»: `g.hero('both')`; `g.beds({sea: 0.5}, 4)`.
1. **Берег** · `spark` (до конца). Касание: `g.choose(null, {'ship_rig#ship': [{id: 'look', label: 'Всмотреться'}]})` —
   первое действие игрока, на 8–10-й секунде; тем же жестом он будет всматриваться в огни в «Ждать».
2. `prologue`; по *`prologue:spark`* — `motif()`, `g.title('Алые паруса')` (не ждать). Дождаться конца куска.
3. `const ship = await g.spot('ship_rig#ship'), top = await g.spot('ship_rig#masthead');` Высота корабля:
   `s = 2 * (ship.y - top.y)`.
4. **Дом** · `match`, склейкой: `g.scene(SCENES.home, {beat: 'match', match_x: ship.x, match_y: ship.y, match_s: s},
   {cut: true})` (если `ship` или `top` — `null`, ключи `match_*` не передавать). По *`match:near`* — Р01. Дождаться
   конца `match`. Дальше без «Дали» — глава I.

### Глава I «Кораблик» — `1.js` (`number: 'I'`, `wall: false`)

`titles`: Оснастка, Лавка, За корабликом, Эгль, Дома, Дети. `choices`: `{id: 'egl_ask', weight: '~', title: 'Что
спросить у Эгля', options: [{id: 'when', label: '«Когда?»'}, {id: 'how', label: '«А как я его узнаю?»'}]}`, `{id:
'kids', weight: '⚑', title: 'Дети у лодок', options: [{id: 'true', label: '«Я не вру»'}, {id: 'made_up', label: '«Я
придумала»'}]}`. Все шаги — `g.hero('assol')`.

1. **Оснастка.** `g.beds({sea: 0.2})`. **Дом** · `evening`, склейкой (`{cut: true}` — из пролога); `knife()` в начале.
   После куска — Р02. `scrap` (кончается вставкой лоскута). Касание: `g.choose(null, {'scrap#scrap': [{id: 'take',
   label: 'Взять лоскут'}]})`; `g.move('scrap_taken', 1, 0.6)`, `silk()`. `rig` (кончается вставкой `rig`).
   `g.play(osnastka, {onGuide})` — `onGuide` говорит Р03 (у `'narrator'`), один раз. После игры: `rig1…rig4` = 1,
   `guide` = 0. `glow`; по *`glow:up`* — `motif()`. `glow_close` (крупно). `g.gauge('tale', {rule: false})`.
2. **Лавка.** `g.beds({})`. **Лавка** · `toys_in`. По *`toys_in:no`* — Р04.
3. **За корабликом.** `g.beds({stream: 0.6}, 3)`. **Лес** · `launch`; по *`launch:afloat`* — Р05. `chase`.
   `g.play(zaKorablikom)`. После игры: `g.set('run', 1)`, `g.set('toy', 1, 1)`, `g.set('reeds', 0)`.
4. **Эгль.** `g.beds({stream: 0.3, sea: 0.5})`. **Лес** · `mouth`. `egl`: по *`egl:tale`* — Р06; по *`egl:sail`* — Р07;
   по *`egl:boat`* — Р08. `assol_close` (крупно). `egl_hold`; Р09 (у `'assol'`). Выбор `egl_ask`: `{egl: [{id: 'when',
   label: 'Спросить: «Когда?»'}, {id: 'how', label: 'Спросить: «А как я его узнаю?»'}]}`.
   - `when`: Р10 (у `'assol'`); `egl_when`; по *`egl_when:sea`* — Р11.
   - `how`: Р12 (у `'assol'`); `egl_how`; по *`egl_how:down`* — Р13.

   `egl_goes`.
5. **Дома.** `g.beds({sea: 0.2})`. **Дом** · `tell`. По *`tell:down`* — Р14 (у `'assol'`). По *`tell:collier`* — Р15.
   После куска — Р16.
6. **Дети.** `g.beds({sea: 0.5})`. **Берег** · `kids`; `gulls()`. По *`kids:laugh`* — Р17 (у `'kid_boy'`). По
   *`kids:beckon`* — Р18 (у `'kid_girl'`). `kids_hold`. Выбор `kids`: `{'assol#yacht': [{id: 'true', label: '«Я не
   вру»'}], kid_girl: [{id: 'made_up', label: '«Я придумала»'}]}`.
   - `true`: Р19 (у `'assol'`); `alone`; `g.scale('tale', 1)`. `g.beds({sea: 0.2})`; **Дом** · `why`; по *`why:knees`*
     — Р21 (у `'assol'`), Р22.
   - `made_up`: Р20 (у `'assol'`); `play`; `g.scale('tale', -1)`. `g.beds({sea: 0.2})`; **Дом** · `shelf`.

   В конце шага: `g.gauge('tale')` — правило шкалы.

### Глава II «Грей» — `2.js` (`number: 'II'`)

`titles`: Кисть, Корабль на картине, Уход, Ванты, Письмо. `choices`: `{id: 'leave', weight: '⚑', title: 'Ночь ухода',
options: [{id: 'farewell', label: 'Проститься'}, {id: 'quiet', label: 'Уйти тихо'}]}`, `{id: 'letter', weight: '⚑',
title: 'Письмо', options: [{id: 'home', label: 'Домой — надолго'}, {id: 'share', label: 'Только за долей'}]}`. Все шаги
— `g.hero('grey')`.

1. **Кисть.** `g.beds({hearth: 0.3})`. **Замок** · `boy`; сразу Р23. `brush` (кончается вставкой). `g.play(kist)`. После
   игры: `nail1…nail3` = 1. Р24 (у `'narrator'`). `mother_in`; по *`mother_in:stops`* — Р25. `mother_close` (крупно).
2. **Корабль на картине.** `g.beds({hearth: 0.3})`. **Замок** · `ship_painting`. По *`ship_painting:alive`* —
   `g.beds({hearth: 0.2, sea: 0.4}, 4)`, Р26. После куска: `g.beds({})`, Р27; `cellar` (до конца).
3. **Уход.** `g.beds({hearth: 0.15})`. **Замок** · `night`. Выбор `leave`: `{'mother_door#mother_door': [{id:
   'farewell', label: 'Проститься'}], 'table#bundle': [{id: 'quiet', label: 'Уйти тихо'}]}`. Сразу после выбора —
   `g.gauge('sea')`: компас и его правило.
   - `farewell`: `farewell`; по *`farewell:at-door`* — `knock()`; по *`farewell:open`* — Р28, Р29; по
     *`farewell:ring`* — Р30.
     Кусок кончается вставкой рук (*`farewell:hands`*). `const r = await g.play(otpustit)`. После игры: `grip1…grip4` = 0, `g.set('pried',
     r.opened > 0 ? 1 : 0)`. `let_go`. `g.scale('sea', -1)`.
   - `quiet`: `note` (до конца); `g.letter({text: 'Мама, я ушёл в море.', sign: 'Артур'})`; `note_goes`.
     `g.scale('sea', 1)`; `g.mark('mother', 'note', 'Мать это запомнит.')`.
4. **Ванты.** `g.beds({wind: 0.4, sea: 0.6})`. **Палуба** · `anselm`; `rigging()`. По *`anselm:looks-up`* — Р31.
   `shrouds` (кончается вставкой). `const r = await g.play(vanty)`. После игры: `climb` = 1, `hand_l` = `hand_r` = 1,
   `g.set('roll', 0, 1)`, `g.sound.wind(0.4, 1)`. `top`; по *`top:up`* — Р32. Если `r.slips === 0` —
   `g.scale('sea', 1)`.
5. **Письмо.** `g.beds({sea: 0.3})`. **Палуба** · `letter`; `gulls()`. По *`letter:reading`* — Р33. После куска:
   `g.letter({text: 'Артур, отец умер.', sign: 'Мама'})`. Выбор `letter`: `{'grey#letter': [{id: 'home', label: 'Домой —
   надолго'}, {id: 'share', label: 'Только за долей'}]}`. **Шкала — сразу после выбора, до замка** (тепло зала уже
   показывает его): `home` — `g.scale('sea', -2)`; `share` — `g.scale('sea', 2)`.
   - `home`: `g.beds({hearth: 0.4})`; **Замок** · `return`; `stays`; по *`stays:hand`* — Р34, Р35. `spring`; по
     *`spring:turns`* — Р36.
   - `share`: `g.beds({hearth: 0.2})`; **Замок** · `return`; `one_evening`; по *`one_evening:window`* — Р37.
     `g.beds({sea: 0.3})`; **Палуба** · `gop_bye`; по *`gop_bye:turns`* — Р38.

   Обе ветки: `g.beds({sea: 0.3})`; **Палуба** · `secret`; по *`secret:hand-on-wheel`* — Р39.

### Глава III «Рассвет» — `3.js` (`number: 'III'`)

`titles`: Лонгрен, Костёр, Спящая, Кольцо, Трактир, Тайна или прямо. `choices`: `{id: 'longren', weight: '⚑', title:
'Лонгрен собрался в море', options: [{id: 'go', label: '«Иди. Я справлюсь»'}, {id: 'stay', label: '«Не уходи»'}]}`,
`{id: 'ring', weight: '~', title: 'Кольцо', options: [{id: 'wear', label: 'Носить'}, {id: 'hide', label: 'Спрятать на
шнурок'}]}`, `{id: 'way', weight: '⚑', title: 'Тайна или прямо', options: [{id: 'secret', label: 'Тайна'}, {id:
'straight', label: 'Прямо'}]}`.

1. **Лонгрен** (`assol`). `g.beds({})`. **Лавка** · `toys_again`; сразу Р40; по *`toys_again:looks`* — Р41.
   `g.beds({sea: 0.2})`; **Дом** · `years`. `decide`; по *`decide:turned`* — Р42. Выбор `longren`: `{chest: [{id: 'go',
   label: '«Иди. Я справлюсь»'}], longren: [{id: 'stay', label: '«Не уходи»'}]}`.
   - `go`: Р43; `chest_out`; `g.mark('longren', 'go', 'Лонгрен это запомнит.')`.
   - `stay`: Р44; `stay`; `g.mark('longren', 'stay', 'Лонгрен это запомнит.')`.
2. **Костёр** (`grey`). `g.beds({campfire: 0.6, sea: 0.4})`. **Лес** · `fire`; сразу Р45. По *`fire:letika`* — Р46.
3. **Спящая** (`grey`). `g.beds({sea: 0.4})`. **Лес** · `dawn_walk`. По *`dawn_walk:found`* — Р47. `sleeping` (крупно);
   в его начале `g.sound.breath(0.2, 2)`. `ring`. `const r = await g.play(koltso)`. После игры: `g.set('stir', 0, 1)`,
   `g.sound.breath(0, 1)`; если `!r.on` — `ring_on`. `chime()`. `facts.ringKind`: `mother` — Р48; `own` — Р49. `leave`.
4. **Кольцо** (`assol`). `g.beds({sea: 0.4})`. **Лес** · `wake`; `gulls()`. `wake_hold`. Выбор `ring`: `{'assol#ring':
   [{id: 'wear', label: 'Носить'}, {id: 'hide', label: 'Спрятать на шнурок под платье'}]}`.
   - `wear`: `wear`; Р50; `g.scale('tale', 1)`.
   - `hide`: `hide`; Р51; `g.scale('tale', -1)`.
5. **Трактир** (`grey`). `g.beds({sea: 0.4})`. **Берег** · `tavern`. По *`tavern:hin`* — Р52, Р53. `past_mary`;
   `g.beds({storm: 0.5}, 1)`; по *`past_mary:door`* — Р54; по *`past_mary:goes`* — Р55. `past_storm`;
   `g.beds({storm: 1}, 1)`; по *`past_storm:cry`* — Р56 (у `'longren'`); по *`past_storm:gone`* — Р57. `tavern_back`;
   `g.beds({sea: 0.4}, 1)`. Касание — Грей спрашивает: `g.choose(null, {filipp: [{id: 'ask', label: 'Спросить
   угольщика'}]})`; Р58. `passing`; по *`passing:assol`* — Р59. `grey_close` (крупно).
6. **Тайна или прямо** (`grey`). `g.beds({sea: 0.5})`. **Берег** · `grey_shore`. По *`grey_shore:alone`* — Р60. Выбор
   `way`: `{skiff: [{id: 'secret', label: 'Тайна: вернуться к шлюпке'}], longren: [{id: 'straight', label: 'Прямо:
   подойти к Лонгрену'}]}`.
   - `secret`: `to_skiff`.
   - `straight`: `longren_boat`; по *`longren_boat:met`* — Р61, Р62, Р63; если `g.state.choices.longren === 'go'` —
     Р64, потом `g.beds({sea: 0.2})`; **Дом** · `unpack`.

### Глава IV «Накануне» — `4.js` (`number: 'IV'`)

`titles`: Алый, Проводы, Девочка, Шёлк, Ждать, У борта. `choices`: `{id: 'girl', weight: '~', title: 'Девочка и яхта',
options: [{id: 'give', label: 'Отдать'}, {id: 'keep', label: 'Оставить'}]}`.

1. **Алый** (`grey`). `g.beds({})`. **Лавка** · `silk_in`. `memory`; в начале — `motif()`. `silk`. `g.play(alyi, {no,
   yes, last})` — функции главы: `no` — Р66, `yes` — Р67, `last` — Р65. После игры: `g.set('memory', 0)`, `roll` =
   `'scarlet'`, `g.set('roll_out', 1, 1)`. `found`; по *`found:glow`* — `motif()`, Р68. `violin`; по *`violin:heard`* —
   `const v = g.sound.violin()`; по *`violin:letika`* — Р69. В конце шага `v.stop(2)`.
2. **Проводы** (`assol`). Только если `facts.longren === 'sea'`, иначе шаг сразу кончается. `g.beds({sea: 0.5})`.
   **Берег** · `longren_goes`. По *`longren_goes:wave`* — Р70.
3. **Девочка** (`assol`). `g.beds({sea: 0.5})`. **Берег** · `girl`. По *`girl:came`* — Р71. Выбор `girl`: `{girl: [{id:
   'give', label: 'Отдать'}], 'assol#yacht': [{id: 'keep', label: 'Оставить'}]}`.
   - `give`: Р72; `give`; `g.scale('tale', -1)`; `g.mark('girl', true, 'Девочка это запомнит.')`.
   - `keep`: Р73; `keep`; `g.scale('tale', 1)`.
4. **Шёлк** (`grey`). `g.beds({sea: 0.3})`. **Палуба** · `sew`; `silk()`, `tuning()`. По *`sew:panten`* — Р74, Р75.
5. **Ждать** (`assol`). `g.beds({sea: 0.6})`. **Берег** · `wait`. `g.play(zhdat)`. После игры: `g.set('light1', 2, 3)`,
   `g.set('light2', 2, 3)`, `g.set('light3', 2, 3)`, `g.set('windows', 0.1, 3)`. `grey_dawn`; по *`grey_dawn:light`* —
   Р76.
6. **У борта** (`grey`). `g.beds({sea: 0.5})`. **Палуба** · `rail`; `rigging()`. Без слов.

### Глава V «Алые паруса» — `5.js` (`number: 'V'`, без выборов)

`titles`: Курс, Дом, Курс, Смотри, Курс, К воде, Рука. Монтаж через кадр: каждый шаг открывает свою сцену **склейкой**
(`{cut: true}`). В каждом шаге: `const f = facts(g.state), base = 0.26 + (f.sea === 'home' ? 0.045 : 0);` — утро Дома
позже. `kurs` получает `{leg, sea: g.state.scales.sea, onSteady}`; `onSteady(u)` → `g.sound.orchestra(0.25 + 0.6 * u,
0.5)`.

1. **Курс** (`both`). `g.beds({sea: 0.6, wind: 0.4})`. **Палуба** · `raise`, `{sun: base}`; сразу Р77; по
   *`raise:going-up`* — `motif()`, `g.sound.orchestra(0.25, 4)`. `helm`. `r = await g.play(kurs, {leg: 0, …})`. После
   игры: `helm` = 0, `luff` = 0 (за 0.5 с), `orchestra(0.4, 1)`. `g.mark('kurs1', r.steady)`.
2. **Дом** (`assol`). `g.beds({sea: 0.3, orchestra: 0.15})`. **Дом**:
   - `grin`: `read`, `beetle` (до конца).
   - `cry`: `read`; `cry`; по *`cry:glance`* — Р78 (у `'door'`).
   - `waited`, `kaperna`: `wake`; по *`wake:touched`* — Р79; `out`.
3. **Курс** (`both`). `g.beds({sea: 0.6, wind: 0.4, orchestra: 0.4})`. **Палуба** · `helm`, `{leg: 0.5, sun: base +
   0.005}`. `kurs` с `leg: 1`. После игры — как в шаге 1. `g.mark('kurs2', r.steady)`.
4. **Смотри** (`assol`). `g.beds({sea: 0.3, orchestra: 0.3})`.
   - `grin`: **Дом** · `look`. `g.play(smotri)`. После игры: `gaze` = 1. `sails_window`; по *`sails_window:seen`* —
     `motif()`. `sails_close` (крупно). `out`.
   - `cry`: **Дом** · `look`; по *`look:ready`* — Р80 (у `'door'`); если `f.girlToy` — `girl_in`. `g.play(smotri,
     {heavy: true})` — она не верит глазам. Дальше как `grin`.
   - `waited`: **Берег** · `dawn_two`, `{morning: base + 0.01}`; по *`dawn_two:spark`* — `motif()`; по
     *`dawn_two:turns`* — Р81, Р82.
   - `kaperna`: **Берег** · `sails_far`, `{morning: base + 0.01}`; по *`sails_far:seen`* — `motif()`, Р83.
5. **Курс** (`both`). `g.beds({sea: 0.6, wind: 0.4, orchestra: 0.5})`. **Палуба** · `helm`, `{leg: 0.85, sun: base +
   0.01}`. `kurs` с `leg: 2`. После игры — как в шаге 1. `g.mark('kurs3', r.steady)`. Час прихода: `steady` — среднее
   `marks.kurs1…3` (нет метки — 0.5); `late = 0.5 * (1 - steady) + (f.sea === 'home' ? 0.5 : 0); morning = 0.27 + 0.09
   * late;` → `g.mark('morning', morning)`. Неловкость и Дом стоят только времени; время в главе идёт только вперёд.
   `arrive`, `{sun: morning}`: **Палуба** открывается снова склейкой на `arrive`; по *`arrive:boat`* — `chain()`.
6. **К воде** (`assol`). `g.beds({sea: 0.6, orchestra: 0.7})`.
   - `grin`, `cry`: **Берег** · `sails_far`; `run`; `shore`.
   - `kaperna`: **Берег** · `run`; `shore`.
   - `waited`: **Берег** · `shore`.

   По *`shore:anchor`* — `chain()`.
7. **Рука** (`both`). `g.beds({sea: 0.6, orchestra: 0.5})`. **Берег** · `hands`. `g.play(ruka, {onReach})` —
   `onReach(u)` → `g.sound.orchestra(0.5 + 0.5 * u, 0.3)`. После игры: `reach` = 1; `motif()`, `orchestra(1, 2)`.
   `meet`; по *`meet:boat`* — Р84, Р85, Р86; `f.longren === 'sea'` — Р88, иначе — Р87. `away`.

### Эпилог — `epilogue.js` (`number: ''`, `title: 'Эпилог'`, `wall: false`, без выборов; шкалы скрыты)

1. **Ночь на «Секрете».** `g.beds({sea: 0.5}, 4)` (оркестр уходит). **Палуба** · `night_end`. `const v =
   g.sound.violin(); let song = null;` По *`night_end:look`*: `f.wine` — Р89; иначе — `song = g.sound.song()`. В конце
   шага `v.stop(3)`, `song?.stop(3)`.
2. **Пароход.** Только если `f.longren === 'sea'`. `g.beds({sea: 0.6})`. **Палуба** · `steamer`; по
   *`steamer:longren`* — `horn()`, `motif()`.
3. **Окно.** `g.beds({hearth: 0.2})`. **Замок** · `window_end`. Без слов.

## 7. Мини-игры

```js
export default {
  title: 'Оснастка',                      // как её зовёт ☰ автора
  about: 20,                              // сколько она обычно длится, с — для проверки веток
  skipped: { slips: 0 },                  // итог при пропуске — обычный, той же формы
  async run(g, b, opts, signal) { … return result; },
};
```

Все одиннадцать сделаны на языке мини-игр (`bespoke.minigame`, `moood-me/moood:docs/games/miniux/language.md`): метки, жесты,
отклики, плашку с фразой и призрачный палец рисует и озвучивает страница; игра решает, что ставить, что считать и что
делает сцена. Общее (автор мини-игры читает ещё §4 и таблицу звуков §8):

- Начало: `const mg = g.minigame({phrase, sample?})`. **Фраза** плашки — в манере Грина: о том, что происходит, без «ты»
  и приказов. `sample` — образец слева от полосы (лоскут в «Алом»). Конец: `await mg.end({as: 'clean' | 'flawed' |
  'neutral'})` — приятный; с ошибками — `flawed`; в выборе — `neutral`.
- Плашка (`mg.plate.set`): заливка — сколько сделано, огонёк (`glow`: `good` / `bad` / `idle` / `null`) — как идёт,
  засечки — шаги; ставится каждый кадр. Своего на экране у игры нет: ни подсказки, ни слоя указателя, ни css, ни клавиш.
- Жест, встреченный впервые, показывает призрачный палец (`b.minigame.tricks.teach`); где есть второй путь (ждать, не
  рвать), показаны оба (`mg.show`). Верное — `mg.snap({at})`, ошибка — `mg.error(причина, {at})` (вид, звук, щербинка на плашке).
  Проигрыша нет; выхода у игрока нет, и тупиков тоже.
- Ключи сцены шлёт `keys(g)` из `hands.js`, когда они изменились больше чем на 0.01. Ждать: `until(mg, кадр)`,
  `once(mg, жест, событие)`. Сцену слушают только через `g.told`; пока отвечает сцена — `mg.sceneTurn(true/false)`
  (метки скрыты, огонёк плашки дышит). Времена — кадры мини-игры (на паузе стоят); прыжок «За корабликом» и стоянка
  огня «Ждать» — `setTimeout`.
- ⏭ автора (в ряду ⏸ ⏭ ☰) кончает мини-игру: по `signal` убрать свои `b.act` (`action.cancel()`) и вернуть
  `this.skipped`. Реплик своих нет (их даёт глава через `opts`); `g.state` не трогает; звуки — из `g.sound`.

| Мини-игра (файл) | Сцена, после куска | Ключи двигает / слушает | Точки | `opts` | Итог (читает глава) |
| --- | --- | --- | --- | --- | --- |
| Оснастка (`osnastka`) | Дом, `rig` | `rig1…rig4`, `guide` | `closeup#rig1…rig4` | `onGuide()` | `{slips}` |
| За корабликом (`za-korablikom`) | Лес, `chase` | `run`, `jump`, `toy`, `reeds` / `run_at`, `chase:snag` | `toy#toy`, `snag#snag`, `snag2#snag` | — | `{seconds, lost, jumps}` |
| Кисть (`kist`) | Замок, `brush` | `nail1…nail3` | `canvas#nail1…nail3` | — | `{order, seconds}` |
| Отпустить (`otpustit`) | Замок, `farewell` | `grip1…grip4` | `hands#finger1…finger4` | — | `{opened, waited}` → `pried` |
| Ванты (`vanty`) | Палуба, `shrouds` | `climb`, `hand_l`, `hand_r`, `slip`, `roll` | `ropes#left`, `ropes#right` | — | `{slips, seconds}` → «Море ↑» |
| Кольцо (`koltso`) | Лес, `ring` | `ring_at`, `stir` / `ring:on` | `grey#ring` | — | `{on, stirs, seconds}` → `ring_on` |
| Алый (`alyi`) | Лавка, `silk` | `roll`, `roll_out`, `memory` | кольцо на элементе `roll` | `no()`, `yes()`, `last()` | `{wrong, passed, shown}` |
| Ждать (`zhdat`) | Берег, `wait` | `light1…light3`, `windows` | `light1#light`…`light3#light` | — | `{touched, waited}` |
| Курс (`kurs`) | Палуба, `helm` | `helm`, `heading`, `luff` | — | `leg`, `sea`, `onSteady(u)` | `{steady}` |
| Смотри (`smotri`) | Дом, `look` | `gaze` | `book#book`, `window#window` | `heavy` | `{tries, seconds}` |
| Рука (`ruka`) | Берег, `hands` | `reach` | `hands#her`, `hands#his` | `onReach(u)` | `{seconds, lets}` |

Дальше по каждой: фраза плашки, жест и метки, что считается, итог для главы. Конец «чистый», если нет ошибок.

### Оснастка (`about: 20`)

«Яхта была готова — недоставало лишь алого шёлка». Вставка `rig` открыта (лоскут игрок взял — это делает глава). Четыре
крепления по порядку, одна метка-желоб за раз (`closeup#rigN`): **держать** 2 с, пока не нальётся; `rigN` идёт с
наливом, на плашке засечки 0.25 / 0.5 / 0.75. Первое — вместе с отцом: `guide` → 1 (рука отца, `opts.onGuide?.()`, не
ждать), отпущенный налив не стекает. На остальных отпустил раньше — срыв: `slips`, ошибка `early`, налив стекает (1.25 с
от полного), приходит рука отца и остаётся до конца крепления: налив за 1 с и не стекает (`hold.set({seconds, drain})`),
новых срывов на нём не считается. Готово — `g.sound.silk()`, метка гаснет; все
четыре — конец. Итог `{slips}`; `skipped` `{slips: 0}`.

### За корабликом (`about: 40`)

«Ручей, играя, уносил кораблик всё дальше к морю». **Держать где угодно** (метки нет, светится сама Ассоль) — она бежит,
отпустил — стоит. Место яхты — число игры `toy` (1/34 в секунду, шлётся ключом); Ассоль: `run` = min(`run_at` + 0.1,
`toy` + 0.04, 1). Отстала: `toy` − `run_at` > 0.2 — яхта в камыше (`reeds`), `lost`, `g.sound.splash()`, ошибка `behind`
на месте яхты, огонёк плохой; догнала (< 0.06) — идёт дальше. Перед корягой сцена говорит `chase:snag` — на коряге
кольцо: **нажать** — прыжок (`jump` 0.3 с, `jumps`). Заливка плашки — путь (`run_at`). Конец: `run_at` ≥ 0.98. Итог
`{seconds, lost, jumps}`; `skipped` `{seconds: 0, lost: 0, jumps: 0}`.

### Кисть (`about: 15`)

«Гвозди на картине были написаны так, что больно было смотреть». Вставка `canvas`: три пятна на гвоздях
(`canvas#nailN`) сразу, в любом порядке. **Тереть** пятно: `nailN` = сколько закрашено; начало мазка — `g.sound.brush()`;
мазок мимо пятна — ошибка `miss`. Закрашенное щёлкает и гаснет. Заливка плашки — среднее трёх. Все три — конец. Итог
`{order: [номера по порядку], seconds}`; `skipped` `{order: [3, 1, 2], seconds: 0}`.

### Отпустить (`about: 15`)

«Мать держала его руку и не могла отпустить». Вставка `hold`: четыре пальца матери (`grip1…grip4` = 1). **Выбор, не
умение**, «неверно» нет. У ближайшего сжатого пальца метка с пунктиром (`hands#fingerN`) — **оторвать** (тянуть на 0.05
высоты окна): палец разжимается за 0.6 с, `opened`, метка на следующем. Или **ничего не делать**: 12 с без касаний — она
отпускает сама, по пальцу в 1.5 с (метки гаснут). Призрак показывает оба пути (тянуть, потом «руки прочь»). На плашке
фраза и заливка (сколько разжато), огонька нет. Все четыре разжаты — через 1 с конец, `neutral`. Итог `{opened: 0…4,
waited: opened === 0}`; `skipped` `{opened: 0, waited: true}`.

### Ванты (`about: 40`)

«Ванты уходили в небо, и палуба кренилась под ногами». Вставка `ropes`: обе руки на вантах (`hand_l` = `hand_r` = 1).
Метка-желоб на одной руке за раз, левой, потом правой (`ropes#left`, `ropes#right`): **держать** 0.3 с — рука поднята
(`hand_*` = 0); налилось и отпустил — перехват выше: `climb` += 1/12, метка на другой руке; отпустил раньше — рука
сжимается где была. Корабль качает: `roll` = 0.8·sin(2π·t / 6); крен — дуга опасности на метке; при |`roll`| > 0.6
`g.sound.rigging()`. Рука поднята в такой крен дольше 0.25 с — срыв: `slip`, `climb` −= 2/12, `g.sound.burn()`, ошибка
`danger`, налив сброшен — отпустить и взяться снова. Ветер: `g.sound.wind(0.3 + 0.5 * climb, 0.5)`. Конец: `climb` ≥ 1.
Итог `{slips, seconds}`; `skipped` `{slips: 1, seconds: 0}` (пропуск не даёт «Море ↑»).

### Кольцо (`about: 25`)

«Она спала легко, как спят в детстве». Метка-желоб на его руке с кольцом (`grey#ring`): **держать** — налив растёт
(0.11 в секунду, `ring_at`), рука тянется. Дуга опасности на метке — `stir`, как она шевелится: растёт на 0.25 в секунду,
пока держат, падает на 0.35, пока нет; раз в 4–7 с вздох (+0.3); `g.sound.breath(0.2 + 0.8 * stir, 0.2)` — дыхание
слышно. `stir` дошёл до 1 — почти проснулась: рука отходит (`ring_at` −= 0.15), `stir` = 0.6, `stirs`, ошибка `danger`,
1 с рука стоит, хоть держи; надо замереть. Огонёк плохой при `stir` > 0.7. `ring_at` дошёл до 1 — ждать `ring:on` (до 3 с) —
конец. Итог `{on, stirs, seconds}`; `skipped` `{on: false, stirs: 0, seconds: 0}`. (`stir` и дыхание в ноль ставит глава.)

### Алый (`about: 45`)

«Шёлка было много — вишнёвого, розового, пунцового, — но не того». **Нажать на кольцо с двумя лепестками** «Не то» /
«Этот»; образец — лоскут слева от полосы. Торговец цветов не называет: узнаёт игрок. Порядок рулонов: `cherry`, `pink`,
`crimson`, `brick`, `scarlet`, `raspberry`, `carrot`. Круг для каждого: Грей сам подносит рулон (`roll`, `roll_out` за
1.2 с, `g.sound.silk()`; ход сцены, метки скрыты), потом лепестки на рулоне. Заливка плашки — сколько рулонов показано
из семи.
- не алый и «Не то»: `await opts.no()`; следующий.
- не алый и «Этот»: `wrong`, ошибка `wrong` (рулон качает головой), лоскут рядом во весь кадр — `memory` 1.5 с;
  `await opts.no()`; следующий.
- алый и «Этот»: `await opts.yes()`; конец.
- алый и «Не то»: `passed = true`; `await opts.no()`; после `carrot` торговец приносит его снова (`opts.last()`),
  кольцо с одним лепестком «Этот»: нажать его.

Итог `{wrong, passed, shown}`; `skipped` `{wrong: 0, passed: false, shown: 5}`.

### Ждать (`about: 40`)

«Ночь тянулась, и огни на горизонте вспыхивали и гасли». Ассоль на камне; три огня (`light1…3` = 0), окна Каперны
(`w0 = g.get('windows')`). **Нажать на кольцо огня** (`lightN#light`): он подходит за 5 с (1 — `g.sound.oars()`, 2 —
`g.sound.horn()`, 3 — без звука), стоит 3 с, уходит за мыс 6 с. Окна гаснут: с каждым уходящим огнём и каждые 12 с без касаний
`windows` −= `w0` / 4 (за 3 с), не ниже 0.1. **Ничего не делать — тоже путь:** призрак показывает огонь, потом «руки
прочь». Плашка — ожидание ночи: заливка идёт сама (`since` / 40 с), нажатие откатывает её к началу. Конец: все три
тронуты и третий ушёл — или 40 с от начала или от последнего нажатия; `neutral`. Итог `{touched: [id по порядку], waited:
touched.length === 0}`; `skipped` `{touched: [], waited: true}`.

### Курс (`about: 22`)

«Ветер сносил «Секрет» с курса на Каперну». Грей у штурвала (светится). **Вести вбок где угодно:** смещение пальца
поворачивает штурвал (`helm`; отпустил — возвращается за 0.5 с), порывы толкают нос: `T = t + 20 · opts.leg`, `A = (0.5
− 0.06 · opts.sea) · (0.8 + 0.2 · opts.leg)`, `gust = 0.8 · A · (0.6·sin(2π·T / 7) + 0.4·sin(2π·T / 2.9 + 1))`. Зона на
полосе: |`heading`| < 0.2 — огонёк хороший, вне её — плохой. `luff = clamp((|heading| − 0.25) / 0.5, 0, 1)`; когда он
переходит 0.5 вверх — `g.sound.rigging()`. Игра шлёт `helm`, `heading`, `luff`. Отрезок — 20 с от первого касания (или от
4-й секунды); заливка плашки — время отрезка. `steady` — доля времени в зоне; четыре раза в секунду `opts.onSteady(u)` —
доля за последние 3 с. Призрак — только на первом отрезке. Конец чистый при `steady` ≥ 0.6. Итог `{steady: 0…1}`;
`skipped` `{steady: 0.5}`.

### Смотри (`about: 5`)

«Она читала, и строки не отпускали её». Метка с пунктиром на книге (`book#book`) — **тянуть** к окну (`window#window`):
`gaze` идёт за пальцем (с `opts.heavy` — отстаёт: она не верит глазам). Отпустил раньше — взгляд пружиной возвращается
к странице, `tries`. До конца `gaze` ≤ 0.99, в конце 1 (камера идёт вверх). Заливка плашки — путь. Итог `{tries,
seconds}`; `skipped` `{tries: 0, seconds: 0}`.

### Рука (`about: 6`)

«Его рука ждала её руки». Вставка `boat`. Метка на её ладони (`hands#her`) — **тянуть тяжёлую руку** к его ладони
(`hands#his`): идёт, пока палец ведёт впереди, назад не идёт, отпустил — стоит, `lets`. `reach` — путь; четыре раза в
секунду `opts.onReach?.(u)`. `reach` ≥ 0.97 — конец. Итог `{seconds, lets}`; `skipped` `{seconds: 0, lets: 0}`.

## 8. Голоса, реплики, звук, музыка

### Голоса (`PEOPLE` в `story.js`)

Рассказчик — безымянный сказитель, спокойный мужской голос: говорит, что было видно, не персонаж. Голоса — готовые
голоса сервиса звука (Gemini). Любая правка буквы в тексте, манере, имени или голосе — новая платная запись; поэтому
голоса делают один раз, все вместе, когда текст решён (work.md).

| Ключ | Голос | Манера (`how`) | Кто (`name`) |
| --- | --- | --- | --- |
| `narrator` | Schedar | спокойно, светло, чуть торжественно — как рассказывают сказку, в которую верят | рассказчик |
| `assol_child` | Leda | девочка восьми лет: звонко, доверчиво, на одном дыхании | Ассоль, восемь лет |
| `assol` | Vindemiatrix | тихо, ясно, чуть удивлённо, без жалобы | Ассоль, семнадцать лет |
| `longren` | Algenib | низко, медленно, хрипловато, бережно | Лонгрен, старый моряк, отец Ассоль |
| `egl` | Charon | старик-сказочник: медленно, нараспев, с улыбкой в голосе | Эгль, собиратель сказок |
| `grey_boy` | Autonoe | мальчик восьми лет: серьёзно, упрямо, негромко | Артур Грей, восемь лет |
| `grey` | Iapetus | молодой капитан: ровно, негромко, уверенно | Артур Грей, капитан |
| `lilian` | Achernar | мягко, негромко, сдерживая волнение | Лилиан Грей, мать Артура |
| `gop` | Orus | капитан старой школы: резко, громко, с насмешкой | капитан Гоп |
| `letika` | Puck | матрос-балагур: весело, быстро, вполголоса | матрос Летика |
| `panten` | Umbriel | немолодой помощник: тревожно, осторожно | помощник Пантен |
| `hin` | Algieba | трактирщик: вкрадчиво, с ухмылкой, сплетничая | Хин Меннерс, трактирщик |
| `filipp` | Achird | угольщик: просто, добродушно, сердито заступаясь | угольщик Филипп |
| `merchant` | Sadaltager | лавочник: сухо, равнодушно, по-деловому | торговец в Лиссе |
| `kids` | Laomedeia | дети дразнят: звонко, нараспев, со смехом | дети Каперны |
| `kids_call` | Laomedeia | девочка постарше зовёт: по-доброму, чуть свысока, без смеха | девочка Каперны |
| `kids_true` | Laomedeia | те же дети кричат всерьёз: запыхавшись, взволнованно, без смеха | дети Каперны |
| `girl` | Zephyr | маленькая девочка: робко, с восхищением | девочка лет семи |

### Все реплики — единственный список

Каждая реплика игры написана здесь один раз; в §6 и в scenes.md — только её номер. Глава пишет её литералом:
`g.say('<кто>', '<текст>')`.

| № | Кто | Текст | ≈ с |
| --- | --- | --- | --- |
| Р01 | `narrator` | Лонгрен делал игрушки. Ассоль было восемь лет | 4 |
| Р02 | `longren` | Остался лоскут. Алый шёлк — им оклеивают каюты богатых пароходов | 5 |
| Р03 | `longren` | Держи мачту. Крепче | 2 |
| Р04 | `merchant` | Не берём больше. Теперь в моде заморские | 3 |
| Р05 | `narrator` | У ручья ей захотелось посмотреть, как яхта плывёт | 3 |
| Р06 | `egl` | Не знаю, сколько пройдёт лет, только в Каперне расцветёт одна сказка | 5 |
| Р07 | `egl` | Однажды утром в морской дали под солнцем сверкнёт алый парус. Белый корабль двинется прямо к тебе | 7 |
| Р08 | `egl` | С корабля придёт лодка, и в ней — тот, кто увидел тебя во сне. Он увезёт тебя навсегда | 6 |
| Р09 | `assol_child` | Это всё мне? | 2 |
| Р10 | `assol_child` | Когда? | 1 |
| Р11 | `egl` | Не знаю. Ты будешь большая | 3 |
| Р12 | `assol_child` | А как я его узнаю? | 2 |
| Р13 | `egl` | Узнаешь. Он тебя — тоже | 3 |
| Р14 | `assol_child` | Он приплывёт за мной. Под алыми парусами! | 3 |
| Р15 | `longren` | Так и будет, Ассоль | 2 |
| Р16 | `narrator` | Наутро это знала вся Каперна | 2 |
| Р17 | `kids` | Корабельная! Эй, Корабельная! Красные паруса плывут! | 4 |
| Р18 | `kids_call` | Иди к нам. Только не ври больше про корабль | 3 |
| Р19 | `assol_child` | Я не вру | 1.5 |
| Р20 | `assol_child` | Я придумала | 1.5 |
| Р21 | `assol_child` | Почему с нами не играют? | 2 |
| Р22 | `longren` | Э, Ассоль, разве они умеют любить? Надо уметь любить, а этого-то они не могут | 6 |
| Р23 | `narrator` | Грей родился в замке, где всё было заведено навсегда | 4 |
| Р24 | `grey_boy` | Я не хочу, чтобы при мне из рук торчали гвозди и текла кровь | 4 |
| Р25 | `lilian` | Артур… | 1 |
| Р26 | `narrator` | Грей решил, что будет капитаном | 3 |
| Р27 | `narrator` | В погребе он нашёл бочку с надписью | 2 |
| Р28 | `lilian` | Ты вернёшься? | 1.5 |
| Р29 | `grey` | Капитаном | 1 |
| Р30 | `lilian` | Возьми. Пусть будет с тобой | 2 |
| Р31 | `gop` | Капитаном хочешь? Сначала — на салинг. И не смотри вниз | 4 |
| Р32 | `gop` | Будет толк | 1 |
| Р33 | `narrator` | Ему было двадцать, когда пришло письмо: отец умер | 4 |
| Р34 | `lilian` | Останься до весны | 2 |
| Р35 | `grey` | Останусь | 1 |
| Р36 | `lilian` | Возьми ту бочку из погреба. Она тебя дождалась | 3 |
| Р37 | `lilian` | Ты уже уходишь | 2 |
| Р38 | `gop` | Купишь корабль — не забудь, кто тебя учил | 3 |
| Р39 | `narrator` | Он купил трёхмачтовый галиот "Секрет" | 3 |
| Р40 | `narrator` | Прошло девять лет | 2 |
| Р41 | `merchant` | Не берём. Я говорил твоему отцу | 3 |
| Р42 | `longren` | Игрушки никому не нужны, Ассоль. Пойду опять в море — на почтовый пароход | 5 |
| Р43 | `assol` | Иди. Я справлюсь | 2 |
| Р44 | `assol` | Не уходи | 1 |
| Р45 | `narrator` | "Секрет" стоял в Лиссе. Грей с Летикой ушли ночью ловить рыбу под Каперной | 5 |
| Р46 | `letika` | Рыба спит, капитан. Как люди | 2 |
| Р47 | `narrator` | В траве спала девушка | 2 |
| Р48 | `narrator` | Он надел ей на палец кольцо матери | 3 |
| Р49 | `narrator` | Он надел ей на палец своё старинное кольцо | 3 |
| Р50 | `narrator` | Она надела кольцо и не сняла его | 3 |
| Р51 | `narrator` | Она спрятала кольцо на шнурок | 3 |
| Р52 | `hin` | Корабельная Ассоль. Помешанная. Ждёт заморского принца — под красными парусами | 5 |
| Р53 | `hin` | А её отец моего в шторм не спас. Стоял на берегу и курил | 4 |
| Р54 | `narrator` | Мать Ассоль просила у Меннерса в долг. Он хотел за деньги другого | 4 |
| Р55 | `narrator` | Она пошла в город заложить кольцо — и простудилась насмерть | 4 |
| Р56 | `longren` | Она так же просила тебя! | 2 |
| Р57 | `narrator` | Меннерса подобрал пароход. Он успел рассказать Каперне, как Лонгрен смотрел | 5 |
| Р58 | `filipp` | Врёт он. Не помешанная она. Сидела со мной на возу — корзина моя будто зацвела | 6 |
| Р59 | `hin` | Вот она идёт | 1 |
| Р60 | `grey` | Я не знаю, ждёт ли она ещё | 2 |
| Р61 | `grey` | Я капитан "Секрета". Ваша дочь ещё ждёт свой корабль? | 4 |
| Р62 | `longren` | Девять лет ждёт | 2 |
| Р63 | `grey` | Он придёт. Ей не говорите | 2 |
| Р64 | `longren` | Тогда и я подожду | 2 |
| Р65 | `merchant` | Разве что этот | 1.5 |
| Р66 | `grey` | Не то | 1 |
| Р67 | `grey` | Этот. Весь | 1.5 |
| Р68 | `merchant` | Тут две тысячи метров | 2 |
| Р69 | `grey` | Найди того скрипача. И всех, кого он знает | 3 |
| Р70 | `longren` | Не скучай, Ассоль. Я скоро | 2 |
| Р71 | `girl` | Это твой? С красными парусами… | 2 |
| Р72 | `assol` | Возьми. Он умеет плавать | 2 |
| Р73 | `assol` | Он мне ещё нужен | 2 |
| Р74 | `panten` | Капитан… это ведь контрабанда? | 2 |
| Р75 | `grey` | Я понял одну нехитрую истину. Она в том, чтобы делать так называемые чудеса своими руками | 7 |
| Р76 | `narrator` | Огни уходили за мыс | 2 |
| Р77 | `grey` | Поднять паруса | 1.5 |
| Р78 | `kids` | Красные паруса плывут! | 2 |
| Р79 | `longren` | Ассоль. Иди к морю | 2 |
| Р80 | `kids_true` | Ассоль! Правда плывут! | 2 |
| Р81 | `assol` | Ты знал? | 1 |
| Р82 | `longren` | Знал. Ждал вместе с тобой | 3 |
| Р83 | `narrator` | Лонгрен сказал Филиппу. Филипп — всем | 3 |
| Р84 | `grey` | Ну вот, я пришёл. Узнала ли ты меня? | 3 |
| Р85 | `assol` | Совсем таким я представляла тебя | 3 |
| Р86 | `assol` | А ты возьмёшь к себе моего Лонгрена? | 2 |
| Р87 | `grey` | Да | 1 |
| Р88 | `grey` | Да. Мы его найдём | 2 |
| Р89 | `narrator` | В ту ночь пили старое вино Греев. Его берегли для рая | 4 |

Текстом, без голоса: записка — «Мама, я ушёл в море.» / «Артур»; письмо — «Артур, отец умер.» / «Мама».

### Звуки страницы (`sound.js`)

Всё синтезируется в Web Audio, файлов нет, по образцу Ашеров: один `AudioContext` → общий уровень → компрессор; посыл в
сгенерированную реверберацию (открытый воздух: 1.8 с, светлая); шумовые буферы; огибающие; пауза и первое касание — страницы (выход через `MooodVolume.output`: звуки ждут с партией, как музыка, — затухая и возвращаясь); `background(levels, seconds)` — названные подложки к уровню, остальные в ноль (его зовёт страница);
`unheard()` — немой двойник для невидимого шага: **в нём перечислен каждый звук по имени**, подложки тоже немые,
`violin()` и `song()` отдают немую ручку `{loud() {}, stop() {}}`.

Подложки игра объявляет, а не переключает: со сценой — `g.scene(…, {beds})` (страница меняет их на склейке вместе с
музыкой сцены, тем же переходом), внутри сцены — `g.beds(…)` (сразу, тем же переходом); секунды игра не задаёт, на карте —
`background` в `b.show` (moood `bespoke.background`, `docs/games/README.md`).

| Звук | Вид | Как сделан | Где |
| --- | --- | --- | --- |
| `sea(level, s)` | подложка | бурый шум через НЧ-фильтр, волна раз в 7–9 с, шипение отката — розовый шум через ВЧ | почти везде |
| `stream(level, s)` | подложка | белый шум через полосовой фильтр 1.5–4 кГц с быстрой мелкой модуляцией | Лес, глава I |
| `wind(level, s)` | подложка | розовый шум через полосовой фильтр, частота гуляет 300–900 Гц | Палуба |
| `storm(level, s)` | подложка | ветер громче и ниже + удары волн (бурый шум вспышками) | прошлое в III.5 |
| `campfire(level, s)`, `hearth(level, s)` | подложки | треск: редкие короткие щелчки белого шума + тихий бурый гул | костёр; камин замка |
| `breath(level, s)` | подложка | розовый шум через НЧ 600 Гц, вдох-выдох 3.5 с; выше уровень — чаще и неровнее | «Кольцо» |
| `orchestra(level, s)` | подложка | струнные: 6–8 пилообразных голосов с вибрато и медленной атакой через НЧ-фильтр, аккорды под мотив по кругу; уровень открывает фильтр и добавляет голоса | глава V |
| `motif()` | раз | четыре восходящие ноты (ре–фа-диез–ля–ре) мягким колокольчиком: синус + слабая октава, длинный хвост | каждый раз, когда появляется алый |
| `violin()` | ручка `{loud(v, s), stop(s)}` | одна смычковая: пила с вибрато 5.5 Гц, НЧ-фильтр, атака 80 мс; играет мотив и его развитие по данным (`SONG`) | Лисс, эпилог |
| `tuning()` | раз, ~6 с | та же смычковая: открытые струны, квинты, с подстройкой высоты | IV.4 |
| `song()` | ручка | мужской хор без слов: 4 голоса-гудения, мотив в низком регистре | эпилог, Море |
| `gulls()` | раз | 2–3 крика: синус 1.2–2.4 кГц с быстрым спадом высоты | берег днём |
| `knife()` | раз | 3 коротких скребка: шум через полосу 2–5 кГц | I.1 |
| `silk()` | раз | шорох: белый шум через ВЧ 5 кГц, огибающая 0.5 с | лоскут, «Оснастка», «Алый», IV.4 |
| `brush()` | раз | мягкий мазок: розовый шум через полосу 800 Гц, 0.3 с | «Кисть» |
| `rigging()` | раз | скрип: пила 90–140 Гц через резонансный фильтр, 0.8 с | палуба |
| `burn()` | раз | короткое шипение: шум через ВЧ, 0.25 с | «Ванты», срыв |
| `splash()`, `oars()` | раз | всплеск: шум с быстрой атакой через НЧ; `oars` — два всплеска и стук дерева | ручей; «Ждать» |
| `horn()` | раз | гудок парохода: две пилы 175 и 233 Гц через НЧ, 1.5 с, далеко | «Ждать», эпилог |
| `chain()` | раз | якорная цепь: частые металлические щелчки 1.5 с и всплеск | V |
| `knock()` | раз | три стука в дверь: короткие удары НЧ-шума | II.3 |
| `chime()` | раз | тонкий звон: два высоких синуса с хвостом | кольцо надето |
| `paper()` | раз | шелест листа (как у Ашеров) | письмо, записка |

### Музыка сцен

`music` каждой сцены — тихая подложка; игра ею не управляет. Мотив паруса, скрипку и оркестр играет игра, в `music`
сцен их нет (scenes.md).

## 9. Интерфейс и стиль (`ui.js`, `ui.css`, `fonts.css`)

- **Парусина и чернила.** Переменные на `#layer`: `--linen` (`#d8cfbd`), `--linen-dark` (`#b9ad96`), `--ink`
  (тёмно-синие чернила, `#1c2a4a`), `--scarlet` (`#d2232a` — **только** паруса кораблика-шкалы), `--hand`,
  `--below-header` (46 px). Подложка тостов, подсказки, письма — лён с видимым плетением, слова —
  чернилами.
- **Шрифт** — `"Parusa Hand"`: Marck Script (OFL 1.1, кириллица и латиница), встроен в `fonts.css` как woff2 в base64.
  Стрелки ↑ — системными засечками.
- **Шкалы** (`view.gauges(state | null, hero)`), `pointer-events: none`, обе на 64 px выше низа:
  - кораблик — слева внизу, SVG 72×72: корпус и мачта чернилами, два паруса; их цвет — смесь белого и `--scarlet`:
    `u = t >= 0 ? 0.65 + 0.35 * t / 3 : 0.65 * (1 + t / 3)` (`t` — `scales.tale`); переход 2 с.
  - компас — справа внизу, SVG 72×72: круг, слева башня, справа волна, стрелка; угол `15° · scales.sea` (к волне —
    вправо); поворот 2 с с лёгким качанием.
  - шкала героя сцены — `opacity` 1, другая — 0.35; `both` — обе 1.
- **Тосты** (`view.toast(text, kind)`): полоска льна справа вверху под инструментами, не больше трёх, 4.2 с (`rule` —
  7.5 с); виды `scale`, `rule`, `mark`.
- **Подсказка** (`view.hint`) — одна строка внизу посередине (в «Дали» и у выбора; в мини-играх — плашка языка).
- **Титр** (`view.title`): слова посреди кадра, 9 с — только название в прологе.
- **Письмо** (`view.letter`): §3.14; звук `paper()`.
- **Инструменты**: ⏸ — всем; ⏭ и ☰ — автору; справа вверху под шапкой, `z-index` 10 (карта автора — 20).
- Метки и лепестки выбора (язык мини-игр), пузыри реплик, строка «без голоса» — страницы; игра своих меток не рисует.
- **Карта выборов и титулы глав** — сцена «Даль» (scenes.md), не интерфейс.

## 10. Что сделано не так, как в замысле, и как именно

| В замысле | Как сделано | Почему |
| --- | --- | --- |
| мир `pavel--alye-parusa`, модули `parusa`, `film`, `closeups` | мир `pavel--alye-parusa-v2`; `cast`, `beats`, `nebo`, `korabli` и малый `closeups` (руки и вещи) | мир перенесён на движок 2 |
| крупные планы лиц | камера на лица не наводится: момент несут рука, свет, затылок, спина, вещь; руки матери и руки в шлюпке — два отделанных кадра | решение владельца: писаных лиц нет, а лицо-точка крупно убивает сопереживание |
| лоскут в углу — свой минимум мини-игры | лоскут — вставка сцены (в I игрок берёт его рукой; в IV он же — память, а образец «Алого» — на плашке) | цвет должен пройти через тот же свет движка; и память в IV — о том, что игрок сделал сам |
| торговец называет оттенки | молчит о цвете; узнаёт игрок | названный «алый» отменяет игру |
| монтаж «Курса» и «Смотри» через кадр | семь шагов главы V: три отрезка «Курса» по 20 с, между ними дом и берег; смена сцены — склейка | страница показывает одну сцену |
| склейка пролога «та же форма паруса» | игра передаёт дому место и размер паруса (`match_x/y/s`); парусник в мастерской — с белыми парусами | две сцены; первый алый в руках — у Ассоль в I.1 |
| пролог без действий | игрок касается искры на горизонте — первое действие на 8–10-й секунде | правило: действие руками в первые 30 с |
| трактир и прошлое подряд | между прошлым и словами Филиппа — касание: Грей спрашивает угольщика | две минуты одного смотрения перед главным выбором |
| вопрос Эглю меняет только слова | «Когда?» — Эгль уходит взглядом в море; «Как узнаю?» — опускается к ней на колено | выбор различается телом и камерой |
| «Лонгрен сказал Филиппу, Филипп — всем» — только в описании концовки | Лонгрен в конце разговора с Греем оглядывается на воз Филиппа; в концовке `kaperna` это говорит рассказчик (Р83) | иначе неясно, почему вся Каперна на берегу |
| «Мать это запомнит», «Девочка это запомнит» | мать в `return` не идёт навстречу и держит его записку; девочка с яхтой стоит на берегу в любой концовке | обещанное игроку платится |
| оркестр крепнет от ровного курса; мотив паруса | синтез в `sound.js`; музыка сцен — подложка | игра не управляет музыкой сцен |
| ванты, скрипка, гребля, подъём в шлюпку, сеть | кадры без этих движений (scenes.md) | модель движений их не даёт; подделывать тело нельзя |
| «в замке — горит ли окно матери» | тепло зала (`home`) | окно матери снаружи нигде не видно |
| вторая насмешка в финале «без смеха» | тот же голос, другая манера (`kids_true`) | как в замысле |
| письмо о смерти отца | «Артур, отец умер.» — «Мама» | текста в замысле нет; решено |
| «Место у Гопа уходит другому», «Бочка остаётся в погребе» | не показано и не сказано | в замысле нет ни кадра, ни реплики; выдумывать не стали |
| карта всей партии — весь флот | пять `⚑` и «Финал» (шесть строк) | девять строк не читаются |

Реплики, которых нет в тексте design.md (все — из принятого с ним scenes.md от 2026-10-06, кроме Р83): рассказчик —
Р05, Р23, Р27, Р33, Р39, Р47, Р48, Р49, Р51, Р83; мать — Р25, Р30; Лонгрен — Р03; торговец — Р65.

## 11. Проверка веток (`bespoke/check/`)

`node bespoke/check/run.mjs <клон мира>` — без браузера, без движка, ничего не рисует.

- `fake.mjs` — поддельная `b`: `specOf(title)` отвечает из `scenes/*/scene.json` клона; остальное — пустышки. Шаги
  идут всухую тем же путём, что ☰ автора (`jump(Infinity, unheard(), {result})`, `context(…, j)`): без времени, выборы —
  из заданного состояния, мини-игры — подставленным итогом.
- Обход: все 256 сочетаний восьми выборов при `vanty.slips` 0 и `koltso.on` true; и по одной партии с `slips: 1` и с
  `on: false`. Каждая — все 34 шага подряд, состояние переходит из шага в шаг.
- Что записывает (обёртка над `j`): каждое `g.scene` (название и ключи), `g.beat`, `g.told`, `g.set/move/get` (ключ),
  ключ предложения, `at` реплики, `b.where`-точки из таблицы §7, текст и говорящего каждой реплики, звуки.
- С чем сверяет — с блоком «Контракт для проверки» из `notes.md` каждой сцены и её `scene.json`: сцена есть; кусок
  есть; кусок идёт после своего `after` или открывает сцену (иначе — склейка: сообщить); момент есть у этого куска;
  ключ есть в `states`; ключ партии из `carry` есть в `party`; точка и предложение есть; элемент предложения имеет
  `name`; говорящий есть в `PEOPLE`; звук есть в `sound.js` и в `unheard()`; поля `opts` и итога, которые глава даёт и читает, есть у мини-игры.
- Обратно: кусок, момент, ключ партии, точка из контрактов сцен, которых не назвала ни одна партия (кроме `show:
  false`), — списком.
- Печатает: расхождения; список всех сказанных реплик без повторов (кто, текст) — по нему записывают голоса, а с §8
  его сверяет проверяющий; по каждой концовке — список кусков по шагам и время: сумма `seconds` кусков, длин реплик
  (из §8-оценки: 0.3 с + 0.06 с на букву) и `about` мини-игр — по главам и всего; каждый отрезок смотрения без действия
  дольше 90 с.
