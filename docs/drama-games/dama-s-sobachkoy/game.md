# Дама с собачкой: игра в коде

> С 2026-10-16 (мультиязычность, `moood-me/studio:docs/history/2026-10-16-multilang.md`): код и тексты — по-английски, русский —
> перевод (`lang/`); люди — `bespoke/people.json`, реплики — `b.say` рантайма; сцены, модули, мини-игры, такты
> (`bazaar_in`, `bazaar_end`, `counsel`), стиль `lady`, шрифт «Lady Hand» — с английскими именами (список —
> `moood-me/studio:docs/history/2026-10-16-multilang-migration.md`); сцены, которых ещё нет, — `main`, `moscow`, `town`, `theatre`,
> `lights`; раздел проверки в `notes.md` — «Contract for the check». Ниже — как было сделано до этого (и `scenes.md`,
> `work.md`, `design.md` рядом).
>
> **С 2026-10-29** (`docs/history/2026-10-29-dama-game.md`): каркас — «Кино Парадизо» в том виде, какой у него теперь
> (moood `docs/games/games.md`): карта партии вместо «Огней» между главами — сцена `lights` фоном (точки глав `c0…c7`,
> `author`, ключи `shown`, `come`, по желанию `season`) и деревья глав, нарисованные игрой (`map.js`); переигровки; ⏭ —
> страницы (`bespoke.forward`: где игрок уже был, в мини-игре — по своему правилу), ⏸ и ☰ — страницы; `bespoke.at`,
> `bespoke.ended`. Шпица «Огней» и его лепестков больше нет; §3.3–3.4, §3.12, §9 «Инструменты» — так. Письмо звучит, пока
> лежит открытым: `g.letter({text, sign, voice: () => g.say(…)})` вместо `Promise.all` (§3.6). Папки сцен: `embankment`,
> `room`, `oreanda`, `station`, `moscow`, `town-s`, `theatre`, `bazaar`, `lights`. Проверка веток — `bespoke/check/run.mjs`
> (§11; переигровки и карту она не гоняет).

2026-10-15, четвёртая редакция (после третьего чтения). Как устроен код игры: по этому файлу и [scenes.md](scenes.md)
пишется всё в её репозитории. Замысел — [design.md](design.md) (история — только оттуда); кто что пишет и в каком
порядке — [work.md](work.md). **Каркас — игра «Алые паруса v3»** (`pavel/alye-parusa-v3`, репозиторий
`moood-me/pavel--game--alye-parusa-v3`): её `bespoke/game.js`, `story.js`, `jump.js`, `hands.js`, `ui.js`,
`check/run.mjs`, `check/fake.mjs` берутся как есть (их описание — docs/alye-parusa/game.md §3), меняется только
названное в §3 ниже. Всё «алое» (кораблик, «Даль», `g.spot`, «Курс», главы, мини-игры, звуки, стиль) убирается.

Экран — любое устройство, лёжа (альбомно): компьютер, планшет, телефон боком. Всё делается одним указателем (мышь
или один палец), без наведения и **без клавиш**. Всё нажимаемое и все люди в свои моменты — в окне 4:3, вписанном в
экран (язык мини-игр, §2.8); сцены написаны шире, до 21:9 (scenes.md «Общее»). Движок не меняется.

## 1. Репозиторий игры

Игра: тип `bespoke`, название «Дама с собачкой», мир `pavel--dama-s-sobachkoy`. Меняются только `game.json` и
`bespoke/**`.

| Файл | Что это | Откуда | Область (work.md) |
| --- | --- | --- | --- |
| `game.json` | `{type: "bespoke", title: "Дама с собачкой", description, genres: {"драма": 85, "отношения": 80, "погружение": 50}, world: "pavel--dama-s-sobachkoy", scenes: []}` | создаёт MCP | координатор |
| `bespoke/game.js` | вход: порядок глав, цикл, сохранение, «Огни» между главами, переходы автора, `PLAYS` | каркас «Алых парусов v3», правки §3 | Каркас |
| `bespoke/story.js` | словарь шага (`g`), `PEOPLE`, `SCALES`, `SCENES`, `ENDINGS`, `facts`, `carry`, `listen` | каркас, правки §3–§5 | Каркас |
| `bespoke/jump.js` | шаг, сыгранный невидимо до мини-игры | каркас как есть | Каркас |
| `bespoke/hands.js` | `until`, `once`, `keys` — ожидания мини-игр на языке и посылка ключей | каркас как есть | Каркас |
| `bespoke/ui.js`, `ui.css`, `fonts.css` | шкалы, тосты, письмо, титр, ⏸ и инструменты автора | устройство каркаса, свой вид (§9) | Каркас |
| `bespoke/sound.js` | звуки страницы, синтез | свой, по образцу каркаса | Звук |
| `bespoke/chapters/prologue.js`, `1.js` … `5.js`, `epilogue.js` | главы | свои | Главы |
| `bespoke/minigames/<имя>.js` | тринадцать мини-игр на языке мини-игр (без своих css и слоёв) | свои | Мини-игры |
| `bespoke/check/run.mjs`, `fake.mjs` | проверка веток: node, без движка и без картинки (§11) | каркас, свои таблицы | Проверка веток |

## 2. Что даёт страница

`bespoke` (`b`) — `moood/web/site/bespoke/play.js`, шапка файла — полный список; язык мини-игр —
`b.minigame` (`moood/web/site/bespoke/minigame/`, шапки `index.js`, `gestures.js`, `tricks.js`;
`moood-me/moood:docs/games/miniux/language.md`, `moood-me/moood:docs/games/minigames.md`). Игра берёт: `b.show`, `b.specOf`, `b.get/set`, `b.on`,
`b.say`, `b.hush`, `b.where`, `b.frame`, `b.act('state', 'move', …)`, `b.layer`, `b.css`, `b.saved`, `b.keep`,
`b.restart`, `b.trouble`, `b.pause`, `b.minigame`. **`b.offer` на сцене движка 3 — ошибка**: выбор — язык мини-игр
(§3.3). Слушателей `b.on` снять нельзя — их ставит один `listen(b)`; шаги и мини-игры слушают сцену только через
`g.told`, `g.when`, `g.watch`. **`b.get` у значения, которое движется, отдаёт цель, а не место**: где сейчас то, что
игра двигает сама, она считает сама.

## 3. Каркас: что берём и что меняем

Берём как есть (каркас «Алых парусов v3»): цикл глав и шагов, сохранение после каждого шага, шаг заново с начала,
⏸ всем, ⏭ и ☰ автору (⏭ на время мини-игры — и игроку, правка 12), переход к мини-игре (`jump.js`), `hub`, ожидания `told/when/arrived/watch`, `say`, `choose`,
`beat`, `play`, `minigame`, `move`, `wait`, `title`, `letter`, `g.beds`, `g.scale` с двумя сторонами, `g.gauge(name,
{rule})`, `g.mark`, ключи партии через `carry`, нет досрочного конца, подстановка итогов мини-игр в невидимом шаге,
«партия как…» автора (`PLAYS`), `hands.js`.

**Выбор и мини-игры — язык мини-игр, как в каркасе** (docs/alye-parusa/game.md §3.10): `g.choose` и шпиц «Огней»
идут через `hub.offer` каркаса — `b.minigame.start({plate: false})`, метка на каждой точке, касание открывает её
лепестки (всегда, даже из одного); через 8 с без касания призрачный палец по очереди нажимает каждую метку.
Мини-игра — `g.minigame({phrase})` внутри `run`: метки, жесты, плашка, отклики — страницы. Каждая мини-игра проходима
по устройству, ошибка стоит секунд (`mg.error`), «Дальше» и `g.trouble` нет; ⏭ во время мини-игры есть и у игрока —
как страховка (§7 «Общее»). Клавиш нет нигде.

Меняем (каждое — одним способом):

1. **Шкалы** — `heart` (Гуров) и `anna` (Анна), §5. Виды тостов: `scale` («Открытость ↑», «Долг ↑» — стрелок столько,
   сколько |`delta`|), `rule`, `mark`.
2. **Чья сейчас сцена.** `g.hero('gurov' | 'anna' | 'both')` — первая строка каждого шага; её можно позвать ещё раз
   внутри шага, когда сцена переходит к другому герою (II.4: Анна в окне → Гуров на платформе). Шкала героя — в полную
   силу, другая — на треть; `both` — обе.
3. **Служебная сцена — «Огни»** (scenes.md) вместо «Дали»; нажимается шпиц: `hub.offer({'spitz#spitz': options})`
   (лепестки «Дальше», «Пройти главу заново», «Сыграть заново»), подсказка каркаса «Коснись шпица». Состояние:
   `{chapter_number, chapter_title, map, reveal: 0, season, spitz: 1}`; `reveal` → 1 за 3.5 с (титул) или 2.5 + 1.2 с
   на строку. Время года — `season` главы: у главы поле `season(state)` → `'summer' | 'autumn' | 'winter' | 'thaw'`;
   титул главы — время года на её начале, карта — на её конце (у IV после «Уезжайте» титул зимний, карта — оттепель:
   так глава кончилась). Глава может сказать `wall: false` — тогда перед ней «Огней» нет: так у главы I (пролог
   переходит в неё без остановки; титула у I нет) и у эпилога. Самые первые «Огни» (перед прологом) — без титула,
   лето, только шпиц: первое касание, после него страница звучит. В «Огнях» — `g.beds({sea: 0.3})` летом и осенью,
   `g.beds({snow: 0.3})` зимой и в оттепель; шкалы скрыты.
4. **Карта.** После главы — все её строки (`⚑` и `~`). После эпилога — «Огни» со всей партией: три строки `⚑` —
   `fence`, `husband`, `wife` (с номером главы) и строка «Финал» из четырёх вариантов `ENDINGS`; время года — эпилога;
   шпиц: «Сыграть заново» (`b.restart()`).
5. **Смена сцены — всегда ход времени** (затемнение страницы). Склеек между сценами в этой игре нет; склейки — внутри
   сцены, кусками. `{cut: true}` у `g.scene` остаётся в каркасе, но не используется.
6. **Письмо и записка** — `g.letter({text, sign})` каркаса, свой вид (§9). Текст письма всегда ещё и звучит: глава
   зовёт `g.letter` и `g.say` одновременно (`Promise.all`), реплика — буква в букву тот же текст (§8).
7. **Убираем из каркаса:** кораблик, «Даль», `g.spot`, «Курс», `korablik`.
8. **«Партия как…» автора** (`PLAYS` в `game.js`), восемь выборов каждого набора; шкалы набора считаются из его
   выборов:
   - `cages` «Две клетки»: `dog: finger, room: eat, window: curtain, club: laugh, fence: hide, stairs: away, husband: lie,
     wife: lie`;
   - `open` «Без лжи»: `dog: pat, room: bring, window: look, club: walk, fence: call, stairs: promise, husband: truth,
     wife: truth`;
   - `wife` «Жена знает»: как `open`, но `husband: lie`; `husband` «Муж знает»: как `open`, но `wife: lie`;
   - `spring` «До весны»: как `open`, но `stairs: away`.
9. **Склейки к кускам — подготовленные** (движок 3: неподготовленная склейка стоит под знаком ожидания 0,4–3 с).
   Модуль `beats` мира — из «Алых парусов v3», как есть. Он сам готовит кадр следующего по порядку фильма куска; к
   куску **не следующему по порядку** склейка готовится по ключу `beat_next`. В каркасе этого вызова нет — добавляем
   `g.next(name)` (= `g.set('beat_next', name)`). Правило шага (одно на все случаи): для **каждого** куска шага, кроме
   того, которым открыта сцена, глава зовёт `g.next(name)`, как только знает, что он пойдёт следующим: до ожидания, на
   котором стоит предыдущий кусок; сразу после выбора — до реплик ветки; до `g.play` — на кусок после игры. Следующий
   ли он по порядку фильма — не разбирать: лишний вызов ничего не стоит. В §6 эти вызовы не выписаны — они обязательны
   везде. Проверка веток (§11) сверяет: перед каждым `g.beat(x)`, кроме открывающего сцену, был `g.next(x)`, и между
   ними не было другого `g.next`.
10. **Движения ключей в мини-игре — своими действиями.** `g.move` ждёт и ручки не отдаёт; мини-игра двигает свои ключи
    так: `const a = b.act('state', 'move', key, value, {over})`, помнит `a` и на `signal` зовёт `a.cancel()`.
11. **Стиль языка** — один раз в `game.js`: `b.minigame.style({font: '"Dama Hand", "Segoe Script", cursive', …})`
    (§9).
12. **⏭ мини-игры — и игроку** (решение владельца 2026-10-15). Кнопка ⏭ каркаса, пока идёт мини-игра, видна всем, не
    только автору; действие то же, что у автора, — `b.minigame.skip()`. Вне мини-игры ⏭ (пропуск шага) — по-прежнему
    только автору. Правило — §7 «Общее».

## 4. Словарь шага (`story.js`), точные подписи

Подписи — каркаса (шапка его `story.js`); здесь — что берёт эта игра.

```js
export const SCENES = { quay: 'Набережная', room: 'Номер в Ялте', oreanda: 'Ореанда', station: 'Станция',
  moscow: 'Москва', town: 'Город С.', theatre: 'Театр в С.', bazar: 'Славянский базар', lights: 'Огни' };
export function facts(state)            // §5
export function carry(title, facts)     // §5
export function context(b, view, hub, state, j = null)  // → g
export function listen(b)               // → hub

g.state; g.signal; g.sound
g.hero(who)                             // 'gurov' | 'anna' | 'both'
g.beds(levels)                          // {имя подложки: уровень}; остальные — в ноль; сразу (внутри сцены)
await g.scene(title, state = {}, { cut = false, beds } = {})  // beds — подложки сцены: на её склейке, с музыкой
g.set(key, value, seconds); g.get(key)
await g.move(key, value, seconds, ease) // движение режиссёром; ждёт конца
await g.wait(ms)                        // только своё время игры
await g.told(text, ms = 60000)          // → true | false
await g.when(key, test, ms = 60000); await g.arrived(who, ms = 60000); g.watch(key, fn)
await g.say(who, text, at = who)        // who — ключ PEOPLE; at — 'id' | 'id#точка' | 'narrator'
await g.choose(choice, {ref: [{id, label}], …})   // → id варианта; пишет state.choices[choice]; choice null — не пишет
g.withdraw()
await g.beat(name, { wait = true } = {})
g.next(name)                            // g.set('beat_next', name): готовить склейку к этому куску (§3.9)
await g.play(minigame, opts = {})       // → итог мини-игры (или её skipped — после ⏭)
g.minigame({ phrase, sample })          // внутри run мини-игры: язык мини-игр начат → mg
g.hint(text, afterMs = 0)               // → off(); только каркас («Коснись шпица»), не в мини-играх
g.scale(name, delta); g.gauge(name, { rule = true } = {})
g.mark(key, value, text)
await g.letter({ text, sign }); await g.title(text)
```

Правила шага (все обязательны):

- Шаг начинается с `g.hero(…)` и `g.scene(…, {beds})`; читает только `g.state` и `facts(g.state)`. Его можно
  сыграть заново, пропустить (автор), войти в него с середины и прогнать всухую.
- Сцену открывают сразу на первом куске: `await g.scene(T, {beat: 'x'})`, потом `await g.beat('x')`.
- Ждать момент сцены — только её событием. Ожидание делается **до** куска, которому момент принадлежит (если это
  первый кусок — до `g.scene`):
  ```js
  const sat = g.told('garden:sat');
  const garden = g.beat('garden');
  await sat;
  await g.say('narrator', 'Однажды под вечер он обедал в саду, а она подошла и села за соседний стол');
  await garden;
  ```
- Момент, который кусок говорит **не во всех ветках** (scenes.md пишет условие рядом с ним: `leave_truth:still` —
  только при `talk` 1, `bazar_end:watch` — только при `wife_knows` 0), ждут только при том же условии в `facts`; иначе
  `g.told` простоит свои 60 с.
- Реплика — всегда вызов `g.say` с двумя **строковыми литералами**: кто и текст — буква в букву из списка §8.
  Никаких таблиц строк и склеек. Где реплику выбирает мини-игра, глава передаёт ей функции, в каждой — свой литерал.
- Мысли Гурова вслух говорит `gurov_inner` над Гуровым: `g.say('gurov_inner', '…', 'gurov')`. Пока открыта вставка
  во весь кадр, реплика ставится внизу: `at = 'narrator'`.
- После `g.play` глава сама ставит ключи сцены, подложки и недосказанные реплики в итог — строка «после игры» в §6:
  мини-игра, пропущенная автором, оставляет сцену, звук и сказанное такими же, как сыгранная; **итог рук идёт в
  историю** — ключ сцены, который читает следующий кусок (строка «после игры», таблица §7).
- Ручки звука (`band`, `piano`) останавливают в конце шага и по `g.signal`.
- Состояние меняют только `g.choose`, `g.scale`, `g.gauge`, `g.mark`.
- Сразу после выбора: сначала `g.gauge` (если шкала впервые), потом `g.scale`, `g.mark`, потом ветка.
- Шапка каждой главы говорит, что она читает и что оставляет.

Глава: `export default { number, title, wall?: false, season(state), titles: [имена шагов], choices: [{id, weight:
'⚑' | '~', title, options: [{id, label}]}], steps: [async g => …] }`.

## 5. Состояние партии

| Поле `g.state` | Кто ставит | Кто читает |
| --- | --- | --- |
| `chapter`, `step`, `start`, `play` | `game.js` | `game.js` |
| `scales.heart` (−5…5, начало 0) | `g.scale('heart', …)`: I.1 ±1, II.1 ±2, III.3 ±2 | `facts`, часы |
| `scales.anna` (−3…3, начало 0) | `g.scale('anna', …)`: II.4 ±1, IV.2 ±2 | `facts`, поводок |
| `shown.heart`, `shown.anna` | `g.gauge`, `g.scale` | `view.gauges` |
| `choices.dog` | I.1: `finger` · `pat` | `facts.dog`, карта |
| `choices.room` | II.1: `eat` · `bring` | `facts.eat`, карта |
| `choices.window` | II.4: `look` · `curtain` | карта |
| `choices.club` | III.3: `laugh` · `walk` | карта |
| `choices.fence` | IV.1: `call` · `hide` | `facts.talk`, карта |
| `choices.stairs` | IV.2: `promise` · `away` | `facts.spring`, карта |
| `choices.husband` | IV.3: `lie` · `truth` (шкал не двигает) | `facts.husband`, `facts.ending`, карта |
| `choices.wife` | V.1: `lie` · `truth` (шкал не двигает) | `facts.wife`, `facts.ending`, карта |
| `marks.dog` | I.1: `'finger'` · `'pat'` | запись партии (платит `facts.dog`: шпиц у калитки — бежит или лает при `call`, рвётся к углу или проходит при `hide`) |
| `marks.maid` | IV.1 `call`: `true` | запись (платит `facts.talk`: антракт, калитка) |
| `marks.husband` | IV.3 `truth`: `'knows'` | запись (платит `facts.husband`: держит шпица, конверта нет, эпилог) |
| `marks.wife` | V.1 `truth`: `'knows'` | запись (платит `facts.wife`: окно утром, часов нет, эпилог) |

```js
export const SCALES = {
  heart: { start: 0, min: -5, max: 5, up: 'Открытость', down: 'Лёгкость',
    rule: 'Часы открыты, когда Гуров не прячется. Закрыты — когда держится легко.' },
  anna: { start: 0, min: -3, max: 3, up: 'Жизнь', down: 'Долг',
    rule: 'Поводок длиннее, когда Анна живёт. Короче — когда помнит о долге.' },
};
export const ENDINGS = [
  { id: 'cages', label: 'Две клетки' }, { id: 'wife', label: 'Жена знает' },
  { id: 'husband', label: 'Муж знает' }, { id: 'open', label: 'Без лжи' },
];
export function facts(state) {
  const c = state.choices, husband = c.husband ?? 'lie', wife = c.wife ?? 'lie';
  return {
    heart: state.scales.heart > 0 ? 'frank' : 'light',     // 'frank' (открытость) | 'light' (лёгкость)
    life: state.scales.anna > 0 ? 'life' : 'duty',         // 'life' | 'duty'
    dog: c.dog ?? 'finger',                                // 'finger' | 'pat'
    eat: c.room !== 'bring',                               // по умолчанию — как у Чехова: ест за столом
    talk: c.fence === 'call',
    spring: c.stairs === 'away',
    husband, wife,                                         // 'lie' | 'truth'
    ending: husband === 'truth' ? (wife === 'truth' ? 'open' : 'husband') : (wife === 'truth' ? 'wife' : 'cages'),
  };
}
```

Шкала Гурова мерит **манеру**, не силу любви: «лёгкость» — чеховский Гуров, спокойный, насмешливый, привыкший прятать;
«открытость» — Гуров, который не прячет того, что с ним. Любит он на обоих путях — это несёт седина в зеркале,
одинаковая во всех ветках. **Правда и ложь супругам шкал не двигают** (IV.3, V.1): правда — не «открытость» и не
«жизнь», ложь — не «долг»; их цена — своя, видимая (конверт, поводок в руке мужа, часы, окно; design.md «Шкалы»).

Шаги двигают шкалы так, что в полной партии `heart` после I.1 всегда нечётный (±1, ±2, ±2 → ±1, ±3, ±5), а `anna`
после II.4 — нечётный (±1, ±2 → ±1, ±3): ноля, где сторона не определена, нет. Пропущенный автором шаг не оставляет
выбора: `facts` даёт тогда значения по умолчанию, написанные выше (шкала 0 — «лёгкость» и «долг»).

**Где какая сторона читается** (сторона — на момент шага): `heart` — II.4 (станция, после I.1 и II.1), III.1 («Тень»,
те же), V.3 (порядок, после всех трёх); `anna` — III.2 («Поводок»: сила шпица, после II.4), IV.1 (рояль, после II.4),
IV.2 (лестница, после II.4), V.3 (навстречу или у окна, после IV.2).

**Состояние → ключи партии сцен** (`carry`):

| Сцена | Ключи |
| --- | --- |
| Москва | `wife_knows: f.wife === 'truth' ? 1 : 0`, `spring: f.spring ? 1 : 0` |
| Город С. | `spring: f.spring ? 1 : 0`, `talk: f.talk ? 1 : 0`, `husband_knows: f.husband === 'truth' ? 1 : 0`, `dog_pat: f.dog === 'pat' ? 1 : 0` |
| Театр в С. | `anna_life: f.life === 'life' ? 1 : 0` |
| Славянский базар | `anna_life: f.life === 'life' ? 1 : 0`, `husband_knows: f.husband === 'truth' ? 1 : 0`, `wife_knows: f.wife === 'truth' ? 1 : 0`, `spring: f.spring ? 1 : 0` |
| Набережная, Номер в Ялте, Ореанда, Станция, Огни | — |

## 6. Главы по шагам

Запись: **сцена** · `кусок` · Рnn — реплика из §8 (переносы строк внутри литералов здесь — только вёрстка: в коде
литерал пишется одной строкой, буква в букву из §8) (там её текст и кто говорит; «у X» — где стоит пузырь, если не над
говорящим) · *момент*, по которому она говорится. Подложки — полный набор шага; остальные звуки — §8. Выборы — с
точками и подписями, как их видит игрок.

### Пролог — `prologue.js` (`number: ''`, `title: 'Новое лицо'`, `titles: ['Новое лицо']`, `choices: []`; `season: () => 'summer'`)

Читает —. Оставляет —.

1. **Новое лицо.** `g.hero('gurov')`; `g.beds({sea: 0.6, cicadas: 0.4}, 3)`. **Набережная** · `noon` (до конца; шпиц
   сел на 8-й с). Касание: `g.choose(null, {spitz: [{id: 'call', label: 'Окликнуть'}]})` — действие игрока на 8–10-й
   секунде; после — `g.sound.bark()`. `noon_turn`; по *`noon_turn:leash`* — Р1; после куска — `g.title('Дама с
   собачкой')` (не ждать). `pavilion`; по *`pavilion:looks`* — Р2, Р3. Дальше без «Огней» — глава I.

### Глава I «Набережная» — `1.js` (`number: 'I'`, `wall: false`, `season: () => 'summer'`)

Читает —. Оставляет `choices.dog`, `marks.dog`, `shown.heart`.

`titles`: Сад, Пристань. `choices`: `{id: 'dog', weight: '~', title: 'Шпиц у колена', options: [{id: 'finger', label:
'Погрозить пальцем'}, {id: 'pat', label: 'Погладить'}]}`.

1. **Сад.** `g.hero('gurov')`; `g.beds({sea: 0.3, cicadas: 0.2})`; `const band = g.sound.band()`. **Набережная** ·
   `garden`; по *`garden:sat`* — Р4. `coax`. `const r = await g.play(podmanit)`. После игры: `spitz_near` = 1, `hand` = 0, `trust` =
   `r.startles ? 0 : 1` (кусок `coax_hold` его читает). `coax_hold`. Выбор `dog`: `{spitz: [{id: 'finger', label: 'Погрозить пальцем'}, {id: 'pat', label: 'Погладить'}]}`.
   Сразу: `g.gauge('heart')` — часы и правило.
   - `finger`: `g.scale('heart', -1)`; `g.mark('dog', 'finger', 'Шпиц это запомнит.')`; `finger`; по
     *`finger:growl`* — `g.sound.growl()`, Р5 (у `'anna'`), Р6.
   - `pat`: `g.scale('heart', 1)`; `g.mark('dog', 'pat', 'Шпиц это запомнит.')`; `pat`; по *`pat:sits`* — Р5 (у
     `'anna'`), Р6.

   `talk`; по *`talk:turned`* — Р7, Р8, Р9, Р10, Р11. `walk_out`; по *`walk_out:moon`* — Р12, Р13. В конце шага
   `band.stop(3)`.
2. **Пристань.** `g.hero('anna')`; `g.beds({sea: 0.5, wind: 0.5, crowd: 0.6})`. **Набережная** · `pier`; сразу Р14 и
   `g.sound.horn()`; по *`pier:lorgnette`* — Р15. `gangway`. `const r = await g.play(lornetka)`. После игры: `pass` = 7,
   `look_at` = `''`, `stranger_turn` = 1, `surge` = 1, `fright` = `r.stranger ? 1 : 0` (читает `kiss`); `g.sound.clink()`; `g.beds({sea: 0.5, wind: 0.4})`. `lost`; по
   *`lost:empty`* — Р16. `kiss`; по *`kiss:look`* — Р17. `go`.

### Глава II «Ореанда» — `2.js` (`number: 'II'`, `season: () => 'summer'`)

Читает `facts.eat`, `facts.heart`. Оставляет `choices.room`, `choices.window`, `shown.anna`.

`titles`: Номер, Ореанда, Полдень, Станция. `choices`: `{id: 'room', weight: '~', title: 'После арбуза', options:
[{id: 'eat', label: 'Есть за столом'}, {id: 'bring', label: 'Отнести ей ломоть'}]}`, `{id: 'window', weight: '~',
title: 'Окно вагона', options: [{id: 'look', label: 'Смотреть, пока видно'}, {id: 'curtain', label: 'Задёрнуть
занавеску'}]}`.

1. **Номер.** `g.hero('gurov')`; `g.beds({sea: 0.25, room: 0.3})`. **Номер в Ялте** · `room`; сразу Р18.
   `room_hold`; Р19 (у `'anna'`). `melon` (кончается вставкой). `const r = await g.play(arbuz)` — арбуз режут всегда, как у Чехова.
   После игры: `cut` = 1, `slice` = 1, `ragged` = `r.lifts ? 1 : 0` (неровный ломоть — `melon_hold` и дальше),
   `g.set('candle', 0.4, 2)`, `g.beds({sea: 0.25, room: 0.3, weep: 0.15})`.
   `melon_hold`; Р20. Выбор `room`: `{watermelon: [{id: 'eat', label: 'Есть за столом'}], anna: [{id: 'bring', label:
   'Отнести ей ломоть'}]}`.
   - `eat`: `g.scale('heart', -2)`; `melon_eat`. `confession_table`; по *`confession_table:speaks`* — Р22, Р23, Р24,
     Р25.
   - `bring`: `g.scale('heart', 2)`; `beside` (кончается вставкой). `const q = await g.play(ryadom)`. После игры:
     `hand_at` = 1, `pull` = 0, `palm` = 1, `apart` = `q.pulls ? 1 : 0` (читает `beside_hold`). `beside_hold`; Р21. `confession_bed`; по *`confession_bed:speaks`* — Р22, Р23, Р24, Р25.

   В конце шага `g.beds({sea: 0.25, room: 0.3})`.
2. **Ореанда.** `g.hero('both')`; `g.beds({sea: 0.6, cicadas: 0.4}, 3)`. **Ореанда** · `bench`; по *`bench:sat`* —
   Р26. `still`. `let sea = false;` `const r = await g.play(more, {sea: () => (sea = true, g.say('narrator', 'Так шумело
   внизу, когда ещё тут не было ни Ялты, ни Ореанды. Теперь шумит и будет шуметь так же равнодушно и глухо, когда нас
   не будет'))})`. После игры: `g.set('dawn', 1, 1)`, `g.set('lights', 0, 2)`, `cicada` = 0, `hand` =
   `r.touched.includes('hand') ? 1 : 0`, `g.beds({sea: 0.6})`; если `!sea` — Р27. `watchman`; по *`watchman:looks`* —
   Р28; по *`watchman:gone`* — Р29. `dew`; Р30 (у `'anna'`), Р31.
3. **Полдень.** `g.hero('both')`; `g.beds({sea: 0.4, cicadas: 0.5})`. **Набережная** · `noon_garden`; сразу Р32, Р33.
   `const r = await g.play(sOgljadkoj)`. После игры: `kiss_now` = 1, `seen` = 0, `gossip` = `r.seen ? 1 : 0`
   (читает `days`: дама с зонтом впереди оглядывается). `days`; по *`days:letter`* — Р34; потом
   `await Promise.all([g.letter({text: 'Анна, у меня разболелись глаза. Возвращайся, если можно. Шпица не
   перекармливай.', sign: 'Твой муж'}), g.say('diderits', 'Анна, у меня разболелись глаза. Возвращайся, если можно.
   Шпица не перекармливай', 'narrator')])` (Р35); `g.sound.paper()`.
4. **Станция.** `g.hero('anna')`; `g.beds({crickets: 0.5, wires: 0.3, steam: 0.4})`. **Станция** · `platform`;
   сразу: `facts.eat` — Р36, иначе — Р37; потом Р38; по *`platform:bell`* — `g.sound.bell()`. `board`. Выбор `window`:
   `{anna: [{id: 'look', label: 'Смотреть, пока видно'}], 'carriage#curtain': [{id: 'curtain', label: 'Задёрнуть
   занавеску'}]}`. Сразу: `g.gauge('anna')` — поводок и правило; `g.sound.whistle()`.
   - `look`: `g.scale('anna', 1)`; `look_back`; в начале `g.sound.wheels()`.
   - `curtain`: `g.scale('anna', -1)`; `curtain`; в начале `g.sound.wheels()`.

   `g.hero('gurov')`; `g.beds({crickets: 0.6, wires: 0.4})`. `facts.heart === 'frank'` — `alone_far`, по
   *`alone_far:stands`* — Р40; иначе — `alone_turn`, по *`alone_turn:door`* — Р40. В обоих: Р39 в начале куска, Р41
   после него.

### Глава III «Зима» — `3.js` (`number: 'III'`, `season: () => 'winter'`)

Читает `facts.heart`, `facts.life` («Поводок»). Оставляет `choices.club`.

`titles`: Первый снег, Поводок, Клуб, Отъезд. `choices`: `{id: 'club', weight: '~', title: 'После осетрины', options:
[{id: 'laugh', label: 'Засмеяться и сесть в сани'}, {id: 'walk', label: 'Уйти пешком'}]}`.

1. **Первый снег.** `g.hero('gurov')`; `g.beds({snow: 0.4})`. **Москва** · `first_snow`; сразу Р42 и
   `g.sound.sleigh()`; по *`first_snow:out`* — Р43 (`gurov_inner`). `evening_walk`. `let first = false;` `const count = facts.heart === 'frank' ? 4 : 2;` `const r = await g.play(ten,
   {count, onFirst: () => (first = true, g.say('narrator', 'Прошло больше месяца. Она
   не снилась ему, а шла за ним всюду, как тень'))})`. После игры: `walk_on` = `count`, `gurov_look` = `null`,
   `shade1…shade4` = 0, `look_back` = `r.touched.length === count ? 1 : 0` (читает `table_window`); если `!first` — Р44. `table_window`; по *`table_window:lit`* — Р45, Р46 (у `'window_up'`).
2. **Поводок.** `g.hero('anna')`; `g.beds({wind: 0.5})`. **Город С.** · `autumn_walk`; сразу Р47. `const r = await
   g.play(povodok, {pull: facts.life === 'life' ? 0.09 : 0.06})` (смотрела из окна — шпиц тянет сильнее). После игры: `anna_to` = `r.end === 'road' ? 1 : 0`. Если `r.end === 'road'` — `road_end`, по
   *`road_end:train`* — `g.sound.whistle(0.3)` (тихо, далеко). `gate_home`; по *`gate_home:coat`* — Р48.
3. **Клуб.** `g.hero('gurov')`; `g.beds({snow: 0.3})`. **Москва** · `club`; сразу Р49; по *`club:out`* — Р50 (Гуров
   говорит всегда, как у Чехова). `say`; по *`say:turns`* — Р51 (у `'official'`), Р52, Р53. Выбор `club`: `{sledge:
   [{id: 'laugh', label: 'Засмеяться и сесть в сани'}], lamp2: [{id: 'walk', label: 'Уйти пешком'}]}`.
   - `laugh`: `g.scale('heart', -2)`; `laugh_sit`.
   - `walk`: `g.scale('heart', 2)`; `say_walk`; по *`say_walk:off`* — Р54.

   В конце: Р55; `g.sound.sleigh()`.
4. **Отъезд.** `g.hero('gurov')`; `g.beds({snow: 0.3})`. **Москва** · `porch_go`; сразу Р56; по *`porch_go:turns`* —
   Р57, Р58 (у `'wife'`).

### Глава IV «Город С.» — `4.js` (`number: 'IV'`, `season: s => facts(s).spring ? 'thaw' : 'winter'`)

Читает `facts.life`, `facts.dog`, `facts.talk`, `facts.spring`. Оставляет `choices.fence`, `choices.stairs`,
`choices.husband`, `marks.maid`, `marks.husband`.

`titles`: Забор, Гейша, Калитка. `choices`: `{id: 'fence', weight: '⚑', title: 'У калитки', options: [{id: 'call',
label: 'Позвать шпица'}, {id: 'hide', label: 'Отойти за угол'}]}`, `{id: 'stairs', weight: '~', title: 'На лестнице',
options: [{id: 'promise', label: '«Я приеду к вам в Москву»'}, {id: 'away', label: '«Уезжайте сегодня же»'}]}`, `{id:
'husband', weight: '⚑', title: 'Муж у калитки', options: [{id: 'lie', label: '«К профессору»'}, {id: 'truth', label:
'«Я еду к нему»'}]}`. Обе подписи — её реплики: ни одна не подсказывает «правильную».

1. **Забор.** `g.hero('gurov')`; `g.beds({snow: 0.3})`. **Город С.** · `inkwell`; Р59 (у `'narrator'`). `fence`;
   сразу Р60; по *`fence:stops`* — Р61. `fence_wait`. `let heard = false;` `g.play(uZabora, {tune: facts.life ===
   'life' ? 'waltz' : 'etude', onPiano: () => (heard = true, g.say('narrator', 'Он услышал звуки рояля, слабые,
   неясные. Должно быть, Анна Сергеевна играла'))})` (итог — `r`). После игры: если `!heard` — Р62; `under` =
   `r.stood ? 1 : 0` (`gate_open` ставит его под окно или у дальнего угла). `g.sound.gate()`; `gate_open`
   (`from` ставит Гурова под окно). Выбор `fence`: `{spitz: [{id: 'call', label: 'Позвать шпица'}], 'fence#corner':
   [{id: 'hide', label: 'Отойти за угол'}]}`.
   - `call`: `g.mark('maid', true, 'Горничная это запомнит.')`; Р63; `facts.dog === 'pat'` — `call_run`, в начале
     `g.sound.yap()`; иначе — `call_bark`, в начале `g.sound.bark()`.
   - `hide`: `corner_hide` (кусок сам читает ключ партии `dog_pat`).

   `fence_dusk`; по *`fence_dusk:poster`* — Р65, Р64 (`gurov_inner`).
2. **Гейша.** `g.hero('gurov')`; `g.beds({hall: 0.5})`. **Театр в С.** · `hall`; сразу `g.sound.tuning()`.
   `hall_find`. `const r = await g.play(najti)`. После игры: `enter` = 6, `glint` = 0, `noticed` = `r.wrong ? 1 : 0`
   (читает `husband_in`). `husband_in`; по *`husband_in:sat`* — Р66,
   Р67, Р68.
   - `facts.talk` нет: `interval_out`; `approach`; по *`approach:at`* — Р69.
   - `facts.talk`: `interval_stay`; `corridor`; по *`corridor:meet`* — Р69.

   `g.hero('anna')`; `g.beds({hall: 0.2})`. `stairs`; по *`stairs:landing`* — Р70 (у `'anna'`), Р71. Выбор `stairs`:
   `{anna: [{id: 'promise', label: '«Я приеду к вам в Москву»'}], 'stairs#down': [{id: 'away', label: '«Уезжайте
   сегодня же»'}]}`.
   - `promise`: `g.scale('anna', 2)`; Р72; `promise_go`; по *`promise_go:back`* — Р73.
   - `away`: `g.scale('anna', -2)`; Р74; `away_go`.

   `bell`; в начале `g.sound.bell()`.
3. **Калитка.** `g.hero('anna')`; `g.beds(facts.spring ? {thaw: 0.4} : {snow: 0.3})`. **Город С.** · `gate_leave`;
   сразу `facts.spring` — Р76, иначе — Р75; по *`gate_leave:asks`* — Р77 (у `'diderits'`). Выбор `husband`:
   `{diderits: [{id: 'lie', label: '«К профессору»'}, {id: 'truth', label: '«Я еду к нему»'}]}`.
   Шкал выбор не двигает. Горничная со шпицем — у крыльца, извозчик — у лошади: ни в одной ветке они не слышат.
   - `lie`: Р78; `leave_lie`; по *`leave_lie:envelope`* — Р114 (у `'diderits'`), `g.sound.paper()`; по
     *`leave_lie:goes`* — Р79.
   - `truth`: `g.mark('husband', 'knows', 'Фон Дидериц это запомнит.')`; `leave_truth`; по *`leave_truth:close`* (она
     подошла к нему вплотную) — Р80 (у `'anna'`); по *`leave_truth:still`* — Р81 (`diderits_low`, у
     `'diderits'`) — **ожидание ставится только при `facts.talk`** (сцена говорит этот момент только при `talk` 1); по
     *`leave_truth:answer`* — Р82 (`diderits_low`, у `'diderits'`); по *`leave_truth:pulls`* (он у крыльца
     взял поводок у горничной, шпиц рвётся за ней) — `g.sound.yap()`.

### Глава V «Две жизни» — `5.js` (`number: 'V'`, `season: s => facts(s).spring ? 'thaw' : 'winter'`)

Читает `facts.spring`, `facts.wife` (после выбора), `facts.heart`, `facts.ending` (и через `carry` — `husband_knows`,
`wife_knows`). Оставляет `choices.wife`, `marks.wife`. Подложка погоды шага: `const w = facts.spring ? {thaw: 0.4} : {snow: 0.4}`.

Время главы: шаг 1 — ночь после одной из её поездок; шаг 2 — утро другой поездки («В другой её приезд…», Р88); шаг 3
— тот же день. Сезон главы один (снег или оттепель): её поездки этой главы — внутри одной зимы (московская зима —
ноябрь–март, два приезда «раз в два-три месяца» в ней помещаются) или одной весны.

`titles`: Ночью, В гимназию, Славянский базар. `choices`: `{id: 'wife', weight: '⚑', title: 'Жена в дверях',
options: [{id: 'lie', label: '«В клубе»'}, {id: 'truth', label: '«Я был у неё»'}]}`. Обе подписи — его реплики.

1. **Ночью.** `g.hero('gurov')`; `g.beds(w)`. **Москва** · `home_late`; сразу Р83; по *`home_late:door`* —
   `g.sound.door()`, Р84 (у `'wife'`). Выбор `wife`: `{wife: [{id: 'lie', label: '«В клубе»'}, {id: 'truth', label:
   '«Я был у неё»'}]}`.
   Шкал выбор не двигает.
   - `lie`: Р85; `wife_lie`; по *`wife_lie:in`* — `g.sound.door()`.
   - `truth`: `g.mark('wife', 'knows', 'Жена это запомнит.')`; Р86; Р87 (`wife_low`, у `'wife'`); `wife_truth`; по *`wife_truth:door`* — `g.sound.door()`.
2. **В гимназию.** `g.hero('gurov')`; `g.beds(w)`. **Москва** · `school` (сцена открывается заново, и `carry` несёт
   `wife_knows` уже по выбору шага 1); сразу Р88. `walk_hand`. `let said = 0;` `const r = await g.play(zaRuku, {lines: [() => (said =
   1, g.say('gurov', 'Теперь три градуса тепла, а между тем идёт снег')), () => (said = 2, g.say('gurov', 'Это тепло
   только на поверхности земли, а в верхних слоях атмосферы совсем другая температура')), () => (said = 3,
   g.say('daughter', 'Папа, а отчего зимой не бывает грома?')), () => (said = 4, g.say('narrator', 'Он объяснил и
   это'))]})` (Р89–Р92). После игры: `go` = 0, `wave` = `r.stops ? 1 : 0` (читает `gate_school`); реплики после `said` (с номера
   `said + 1`) — по порядку тем же литералом. `gate_school` (если они не у ворот — доходят). Р93, Р94. `red_cap`; по *`red_cap:note`* — Р95; потом
   `await Promise.all([g.letter({text: 'Я приехала. «Славянский базар».', sign: 'А.'}), g.say('anna', 'Я приехала.
   «Славянский базар»', 'narrator')])` (Р96); `g.sound.paper()`.
3. **Славянский базар.** `g.hero('both')`; `g.beds({room: 0.3})`; `const piano = g.sound.piano('waltz', {wall:
   true})`. **Славянский базар** · `bazar_in`; по *`bazar_in:met`* — Р97.
   - `facts.heart === 'frank'`: `shoulders`; по *`shoulders:mirror`* — Р99. `g.beds({room: 0.3, weep: 0.3})`. `tea`
     (кончается вставкой). `const r = await g.play(chaj)`. После игры: `glass_at` = 1, `tap` = 0, `fill` = 0.9,
     `spill` = 0, `stain` = `r.spills ? 1 : 0` (пятно на скатерти — `weep`, `cages`, `bazar_end`). `weep`; Р98.
   - иначе (как у Чехова: сел, велел подать чаю, потом подошёл): `g.beds({room: 0.3, weep: 0.3})`. `tea` (кончается
     вставкой). `const r = await g.play(chaj)`. После игры — как выше. `weep`; Р98. `shoulders`; по
     *`shoulders:mirror`* — Р99.

   `g.beds({room: 0.3})`. `cages`; по *`cages:turned`* — Р100; потом по `facts.ending`: `cages` — Р101; `wife` — Р102,
   Р103; `husband` — Р104, Р105; `open` — Р102, Р104, Р105. `sovet`. `const t = await g.play(sovet, {window: async () => { await
   g.say('gurov', 'Переезжай в Москву'); await g.say('anna', 'А он? Он ни в чём не виноват'); }, door: async () => {
   await g.say('anna', 'Уехать бы вдвоём…'); await g.say('gurov', 'А дети?'); }, table: async () => { await
   g.say('gurov', 'Видеться бы каждый день…'); await g.say('anna', 'И каждый день прощаться?'); }})` (Р106–Р111).
   Тронутые выходы — сам разговор, не выбор, и в карту не идут; последний остаётся позой. После игры: `think` =
   `t.touched.at(-1) ?? 'none'` (куда смотрели последним, так и стоят в `bazar_end`). Р112. `bazar_end`; сразу Р113;
   по *`bazar_end:watch`* (Гуров достаёт часы) — `g.sound.watch()`; **ожидание ставится только при `facts.wife ===
   'lie'`** (кусок говорит этот момент только при `wife_knows` 0).
   В конце шага `piano.stop(4)`.

### Эпилог — `epilogue.js` (`number: ''`, `title: 'Три окна'`, `titles: ['С.', 'Москва', 'Ореанда']`, `choices: []`, `wall: false`; шкалы скрыты; `season` — как у V)

Читает `facts.husband`, `facts.wife`, `facts.spring` (через `carry`). Оставляет —. Без слов. Каждый шаг:
`g.hero('both')`.

1. **С.** `g.beds(facts.spring ? {thaw: 0.3} : {snow: 0.3})`. **Город С.** · `fence_end`.
2. **Москва.** `g.beds(facts.spring ? {thaw: 0.3} : {snow: 0.3})`. **Москва** · `porch_end`.
3. **Ореанда.** `g.beds({sea: 0.6}, 4)`. **Ореанда** · `bench_end`.

## 7. Мини-игры

На языке мини-игр (`moood-me/moood:docs/games/miniux/language.md`, `moood-me/moood:docs/games/minigames.md`; образец кода — мини-игры каркаса
«Алых парусов v3»: `ruka.js` — тянуть с сопротивлением, `kist.js` — тереть, `zhdat.js` — нажать и бездействие как
путь, `za-korablikom.js` — держать где угодно; помощники `hands.js`).

```js
export default {
  title: 'Подманить',                     // как её зовёт ☰ автора
  about: 15,                              // сколько она длится по своим правилам, с — для счёта длины
  skipped: { startles: 0 },               // итог при ⏭ (игрока или автора) — обычный, той же формы
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: '…' });   // плашка с фразой; конец — mg.end({as})
    … return result;
  },
};
```

Общее для всех тринадцати (автор мини-игры читает ещё §4 и таблицу звуков §8):

- **Четыре строки** (minigames.md §1) — у каждой ниже: кто что делает, чего хочет, что чувствует, что должен
  чувствовать игрок. Жест выбран по ним.
- Всё видимое в мире делает сцена своими ключами; поверх — только язык: метки на точках сцены, путь и налив жеста,
  призрачный палец, плашка. Своих слоёв, css, подсказок (`g.hint`) и кнопок нет.
- **Метки** — на точках, которые называет сцена (`'id#точка'`, scenes.md); точки — в окне 4:3, не ближе 0.08 высоты
  окна к краям и 0.15 к углам, не под плашкой и не в полосе речи. Вид метки — по жесту: кольцо — нажать; кольцо с
  желобом — держать; кольцо с пунктиром — тянуть, вести по линии; жесты «где угодно» — без метки, отклик на вещи.
- **Плашка** — фраза в одну строку, как написал бы Чехов: что происходит, без «ты» и без приказа, только то, что
  видно в сцене (фразы ниже). Полоса — честная: идёт, когда делают как надо, стоит или стекает, когда нет.
- **Показ** — `b.minigame.tricks.teach(mg, [жест], {id})` при первой встрече с жестом за партию и при замере; где
  бездействие — путь, палец показывает и «руки прочь».
- **Ошибка** — `mg.error(причина, {at})` (вид причины — язык §5); проигрыша нет, тупиков нет: каждая проходима, ошибка
  стоит секунд.
- **⏭ — страховка, и у игрока тоже** (решение владельца 2026-10-15): игрок не должен застрять, если что-то пошло не
  так, поэтому пока идёт мини-игра, ⏭ каркаса видна и ему (§3, правка 12), не только автору. Это не путь сквозь игру:
  мини-игры по-прежнему проходимы по устройству, без своей кнопки пропуска, без «Дальше» и подсказок о ⏭. Пропущенная
  оставляет **тот же след, что сыгранная**: ⏭ приходит по `signal`, мини-игра отдаёт `skipped` — итог той же формы, один
  из тех, что даёт и сыгранная (ниже у каждой); глава ставит по нему те же ключи истории, подложки
  и недосказанные реплики (§4, строка «после игры» в §6) — дальше история не знает, сыграна игра или пропущена.
- **Выбор жестом** («Море», «Советоваться», «Поводок») — отклик нейтральный, второй путь виден с начала; **умение**
  доводит до конца игрок — ничто не доделывается само.
- Ключ сцены шлётся через `keys(g)` из `hands.js` (изменился больше чем на 0.01, не чаще раза в кадр). Свои плавные
  движения ключей — только действиями `b.act('state', 'move', …)` (§3.10). Камера под жестом на точке стоит (сцена
  её не двигает).
- По `signal`: отменить свои `b.act`, вернуть подложки, которые поднимала, остановить свои ручки звука; вернуть
  `this.skipped`. Реплик своих нет (их даёт глава через `opts`); `g.state` не трогает; звуки вещей — из `g.sound`,
  звуки языка — языка.
- **Итог → в историю**: каждый итог читает глава и ставит ключ, который показывает следующий кусок (§6 «после
  игры», последний столбец таблицы).

| Мини-игра (файл) | Сцена, после куска | Жест языка, метки | Ключи двигает / слушает | `opts` | Итог → ключ истории |
| --- | --- | --- | --- | --- | --- |
| Подманить (`podmanit`) | Набережная, `coax` | вести: стрелка — его рука, зона — у морды шпица | `hand`, `spitz_near` | — | `{startles}` → `trust` (`coax_hold`) |
| Лорнетка (`lornetka`) | Набережная, `gangway` | нажать: кольцо на голове приезжего | `pass`, `look_at`, `stranger_turn` / `gangway:stranger` | — | `{looked, stranger}` → `fright` (`kiss`) |
| С оглядкой (`s-ogljadkoj`) | Набережная, `noon_garden` | нажать: кольцо на Анне; дуга опасности — гуляющие | `seen`, `kiss_now` / `watched`, `noon_garden:kiss` | — | `{seen}` → `gossip` (`days`) |
| Арбуз (`arbuz`) | Номер в Ялте, `melon` | вести по линии: кольцо у ножа, пунктир разреза | `cut`, `slice`, `candle` | — | `{lifts}` → `ragged` (`melon_hold`…) |
| Рядом (`ryadom`) | Номер в Ялте, `beside` | тянуть с сопротивлением: кольцо с пунктиром на его руке, цель — её рука | `hand_at`, `pull`, `palm` | — | `{pulls}` → `apart` (`beside_hold`) |
| Море (`more`) | Ореанда, `still` | нажать ×3 (кольца) или ничего | `dawn`, `lights`, `cicada`, `hand` | `sea()` | `{touched}` → `hand`, `lights` (`watchman`, `dew`) |
| Тень (`ten`) | Москва, `evening_walk` | нажать: кольцо на каждой фигуре, дуга времени | `walk_on`, `gurov_look`, `shade1…4` / `evening_walk:stop1…4` | `count`, `onFirst()` | `{touched}` → `look_back` (`table_window`) |
| Поводок (`povodok`) | Город С., `autumn_walk` | держать где угодно (выбор: держать — домой, отпустить — к дороге) | `anna_to` / `anna_at` | `pull` | `{end}` → кусок `road_end` |
| У забора (`u-zabora`) | Город С., `fence_wait` | тянуть к целям: кольцо на Гурове, цели — места вдоль забора | `walk_to` / `gurov_at` | `tune`, `onPiano()` | `{stood}` → `under` (`gate_open`) |
| Найти (`najti`) | Театр в С., `hall_find` | нажать с лепестком «Она?» на каждой севшей | `enter`, `glint` | — | `{wrong}` → `noticed` (`husband_in`) |
| За руку (`za-ruku`) | Москва, `walk_hand` | держать где угодно | `go` / `walked` | `lines` (4 функции) | `{stops}` → `wave` (`gate_school`) |
| Чай (`chaj`) | Славянский базар, `tea` | тянуть (стакан под кран), потом держать с опасностью (кран) | `glass_at`, `tap`, `fill`, `spill` | — | `{spills}` → `stain` (`weep`…) |
| Советоваться (`sovet`) | Славянский базар, `sovet` | нажать с лепестком на трёх вещах, или молчать | `think` | `window()`, `door()`, `table()` | `{touched}` → `think` (`bazar_end`) |

`about` — сколько игра длится по своим правилам у игрока, который играет спокойно (не у самого медленного): на этом
стоит счёт длины (§11, design.md «Длина»). Что сказано через `opts`, глава считает сама (§6: флаг или счётчик в
замыкании), а не по итогу: ⏭ отдаёт `skipped`, что бы ни было сказано до него.

### Подманить (`about: 15`)

*Гуров тянет руку к чужой собачке; хочет развлечься и подойти к даме через неё; ленив, насмешлив, чуть любопытен.
Игрок — терпение и маленькая хитрость.* Жест — **вести** (§4.9): стрелка — его опущенная рука (сцена ставит `hand`
0…1 — как низко и как близко она к шпицу), зона — у морды шпица (точка `spitz#head`). Пока стрелка в зоне и движение
не резкое (язык сообщает резкость), своё `near` растёт на 0.09 в секунду и шлётся ключом `spitz_near`. Резкое движение
— `mg.error('danger', {at: 'spitz#head'})`, `g.sound.growl()`, `near` −= 0.2 (не ниже 0), счёт `startles`, 1 с роста
нет. Полоса — `near`. `near` ≥ 1 — `mg.snap`, через 0.5 с конец (`clean`, если `startles` 0, иначе `flawed`). Фраза:
«Шпиц смотрел на чужую руку и не решался подойти». Итог `{startles}`; `skipped` `{startles: 0}`.

### Лорнетка (`about: 32`)

*Анна ищет в лорнетку знакомых из С. среди приезжих; хочет, чтобы их не было; страх и стыд. Игрок — всматриваться и
бояться узнать.* Жест — **нажать** (кольцо на `pN#head`). Камера стоит (`GANGWAY_CAM`); вид света `glass` — мягкое
затемнение краёв кадра, на переднем плане её рука с лорнеткой. Своё `pass` (сколько приезжих отпущено) шлётся
ключом; по порядку: `p1`, `p2`, `p3`, `p4`, `stranger` (с `stranger_lady`), `p5`, `p6` — сцена ведёт каждого вниз по
сходням. Каждые 4 с `pass` += 1. Метки — на двух последних отпущенных из `p1…p6` (метка идёт за точкой). Нажал —
`look_at` = id на 1.5 с, потом `''`; метка снимается; счёт `looked`. Перед тем как отпустить пятого (`stranger`),
ожидание `g.told('gangway:stranger')` ставится заранее; когда он встал внизу сходней спиной — поток стоит, метка
только на `stranger#head` (до этого — нигде): нажал — `g.sound.heart()`, `look_at` = `'stranger'`, 1.5 с,
`stranger_turn` = 1 (он поворачивается к своей даме — чужое лицо, они уходят), `stranger` = true; 12 с без нажатия —
`stranger_turn` = 1 без звука. Дальше `p5`, `p6` по 4 с; потом `surge` = 1 и через 1 с конец (`neutral`). Полоса —
сколько сошло. Фраза: «Пассажиры сходили по сходням, и между ними могли быть знакомые». Итог `{looked, stranger}`;
`skipped` `{looked: 0, stranger: false}`.

### С оглядкой (`about: 15`)

*Гуров целует её среди белого дня; хочет — и боится, что увидят; азарт тайны. Игрок — выждать миг.* Жест — **нажать**
(кольцо на `anna#head`); дуга опасности на метке — гуляющие в аллее. Гуляющие ходят по аллее (скрипт сцены: аллея
пуста около 4 с раз в 10–12 с). В начале `let empty = g.get('watched') === 0` (ключ сцена ставит разом — значение
точное), потом `g.watch('watched', …)` его обновляет; дуга — 1 при `watched` 1, 0 при 0. Нажал при `watched` 1 —
`mg.error('danger', {at: 'anna#head'})`, `seen` = 1 (импульс; сцена через 2 с сама ставит 0): прохожая с зонтом
оборачивается, она отступает; счёт `seen`; через 2 с метка снова. Нажал при `watched` 0 — ожидание
`g.told('noon_garden:kiss')` ставится, `kiss_now` = 1, дождаться (до 6 с) — `mg.snap`, конец. Фраза: «По аллее
ходили, и всякий мог оглянуться». Итог `{seen}`; `skipped` `{seen: 0}`.

### Арбуз (`about: 18`)

*Гуров режет арбуз, чтобы было чем занять руки рядом с её стыдом; неловкость, ирония. Игрок — медленный аккуратный
разрез и потом ничего.* Жест — **вести по линии** (§4.4): кольцо у `melon#knife`, пунктир — от `melon#from` до
`melon#to`. Пройдено 0…1 — `cut` (не быстрее 0.15 в секунду: язык сообщает пройденное, игра шлёт меньшее из него и
своего предела); можно отпускать и продолжать — счёт `lifts`. Сошёл с линии — `mg.error('off')`. Каждые 0.15 пути —
`g.sound.knife()`. `cut` ≥ 1 — `mg.snap`, `slice` = 1, потом молчание: метки нет, «ход сцены» (`mg.sceneTurn(true)`),
`g.sound.weep(0.15, 2)` (подложка; на выходе вернуть в 0 — глава потом ставит свою), свеча оплывает своим действием
`const a = b.act('state', 'move', 'candle', 0.4, {over: 10})` (на `signal` — `a.cancel()`), 10 с — конец (`neutral`).
Фраза: «На столе в номере лежал арбуз». Итог `{lifts}`; `skipped` `{lifts: 0}`.

### Рядом (`about: 12`)

*Гуров кладёт руку на её руку; хочет её утешить; осторожность, нежность. Игрок — не спешить.* Жест — **тянуть с
сопротивлением** (`heavy`): кольцо с пунктиром на `hands#his`, цель — `hands#her`; его рука идёт, пока палец ведёт
впереди неё. Где она — `hand_at` 0…1. Палец обгоняет руку больше чем на 0.25 дольше 0.3 с (спешит) — она отнимает
руку: `mg.error('danger', {at: 'hands#her'})`, действие `b.act('state', 'move', 'pull', 1, {over: 0.5})`, `hand_at`
−= 0.2, счёт `pulls`; через 2 с `b.act('state', 'move', 'pull', 0, {over: 1})` (оба действия помнить и отменять на
`signal`). `hand_at` ≥ 0.95 и `pull` 0, 2 с без нового движения — `palm` = 1, `mg.snap`; через 1.5 с конец. Фраза:
«Её рука лежала на покрывале, ладонью вниз». Итог `{pulls}`; `skipped` `{pulls: 0}`.

### Море (`about: 40`)

*Они сидят над морем; ничего не хотят; покой. Игрок — можно ничего не делать.* Жест — **нажать** ×3 или ничего
(бездействие — путь: палец показывает и нажатие, и «руки прочь»). В начале `const dawn = b.act('state', 'move',
'dawn', 1, {over: 40})` (не ждать; на `signal` — `dawn.cancel()`). Кольца: `steamer#lights` (огни парохода),
`cypress#cicada` (цикада в ближнем кипарисе), `anna#hand_r` (её рука на скамье); тронутое снимается (`mg.snap`).
`lights` — действие `b.act('state', 'move', 'lights', 0, {over: 6})` (огни гаснут по одному; отменять на `signal`);
`cicada` — `cicada` = 0, `g.sound.cicadas(0, 2)`; `hand` — `hand` = 1. На 12-й секунде — `opts.sea()` (не ждать).
Полоса — рассвет (идёт сама). Конец — через 40 с от начала, как бы ни нажимали (`neutral`). Фраза: «Внизу шумело
море, и светало». Итог `{touched: [id по порядку]}`; `skipped` `{touched: []}`.

### Тень (`about: 26`)

*Гуров идёт по московской улице и в каждой женщине видит её; хочет забыть; память не отпускает. Игрок — всмотреться,
узнать, ошибиться.* Жест — **нажать** (кольцо на `shadeN#head`, дуга времени 6 с). Камера стоит (`STREET_CAM`). Своё
`walk_on` = N ведёт Гурова к N-й точке остановки (у сцены — `stop1…stop4`, по одной на тень) и стоит там; сцена
говорит `evening_walk:stopN`, когда он дошёл. По порядку для N = 1…`count`: ожидание
`g.told('evening_walk:stopN')`, `walk_on` = N; там
`shadeN` = 1 — она выходит впереди этой точки (ближе к камере) из-за саней, из двери лавки или из-за края кадра (сцена,
1–2 с) и стоит спиной; первая — `opts.onFirst()` (не ждать); метка. Нажал за 6 с: `gurov_look` = `'shadeN'`, 1 с,
`shadeN` = 2 (оборачивается — чужое лицо, уходит), 2.5 с, `gurov_look` = `null`; счёт `touched`. Не нажал за 6 с —
`shadeN` = 2. Следующая — через 2 с. После последней — 2 с, конец (`neutral`; `count` 4 — около 34 с, `count` 2 —
около 18 с). Полоса — сколько фигур прошло. Фраза: «На улице были женщины, и каждая издали была похожа на неё». Итог
`{touched: [номера]}`; `skipped` `{touched: []}`.

### Поводок (`about: 20`)

*Анна гуляет со шпицем вдоль забора; хочет забыть Ялту — и не может; шпиц тянет к дороге на станцию. Игрок — держать
или отпустить.* Это выбор жестом — **держать где угодно**: держит — она держит шпица и идёт к калитке; отпустил —
шпиц тянет к концу забора. Отклик нейтральный, оба пути показаны пальцем в начале (держать и «руки прочь»). Анна у
забора (`anna_at` 0.3, его ставит сцена). Держит: `anna_to` = max(0, `anna_at` − 0.05). Отпустил: `anna_to` = min(1,
`anna_at` + `opts.pull`) (0.06 — долг, 0.09 — жизнь: шпиц тянет сильнее). Ключ шлётся при каждом изменении `anna_at`
(сцена ставит его разом). Полоса — где она между калиткой и дорогой (две части полосы — два пути, нейтральным цветом).
Конец: `anna_at` ≤ 0.05 — `end: 'home'`; ≥ 0.95 — `'road'`; через 35 с — к какому концу ближе. Порывы ветра —
`g.sound.wind` поднимается до 0.7 на 1 с раз в 5–8 с и возвращается к 0.5 (уровень шага); на выходе — 0.5. Фраза:
«Шпиц тянул к концу забора, туда, где дорога к станции». Итог `{end}`; `skipped` `{end: 'home'}`.

### У забора (`about: 18`)

*Гуров ходит вдоль забора её дома; хочет увидеть её; нелепость, надежда. Игрок — искать место, где слышнее.* Жест —
**тянуть к целям**: кольцо с пунктиром на `gurov#head`, цели — места вдоль забора `fence#p1…fence#p5` (точки
элемента `fence`, scenes.md «Город С.»); отпустил у цели — `walk_to` = её место (0…1), Гуров идёт туда своим шагом
(туда и обратно, сколько угодно раз). В начале `const p = g.sound.piano(opts.tune)` (через стекло и снег: глухо),
уровень четыре раза в секунду: `p.loud(0.15 + 0.6 · clamp(1 − |gurov_at − 0.6| / 0.35, 0, 1), 0.3)`; полоса — тот же
уровень. Первый раз уровень выше 0.4 — `opts.onPiano()` (не ждать). Стоит при |`gurov_at` − 0.6| < 0.08 пять секунд —
`stood` = true, `mg.snap`, конец; или 35 с — конец (`neutral`). На выходе (и по `signal`) `p.stop(3)`. Фраза: «Из
дома доносились звуки рояля, слабые, неясные». Итог `{stood}`; `skipped` `{stood: true}`.

### Найти (`about: 18`)

*Гуров ищет её в провинциальной толпе; хочет увидеть; нетерпение. Игрок — искать и ошибаться.* Жест — **нажать с
лепестком** «Она?» (кольцо на `ladyN#head` / `anna#head` каждой севшей). Своё `enter` растёт на 1 каждые 3 с от 1 до 6
(сцена ведёт следующую даму по проходу к месту; Анна — четвёртая, около 12-й секунды). Не она — `mg.error('wrong',
{at})`, метка снимается, счёт `wrong`. Она — `mg.snap`, через 0.5 с конец. Через 25 с от начала, если не нашёл, —
`g.set('glint', 1, 1)` (блик её лорнетки ярче) и показ пальцем на её метке. Полоса — сколько дам вошло. Фраза:
«Публика входила и рассаживалась». Итог `{wrong}`; `skipped` `{wrong: 0}`.

### За руку (`about: 20`)

*Гуров ведёт дочь в гимназию; хочет быть хорошим отцом в явной жизни; тепло и пустота. Игрок — вести и слушать.*
Жест — **держать где угодно** (отклик — у руки дочери, `daughter#hand_r`). Камера стоит (`STREET_CAM`); они идут **к
камере**: от подъезда их дома (≈ 13 м от камеры) к воротам гимназии у ближнего края (≈ 4.5 м); Гуров — походкой
`walk_child`. Держит — `go` = 1 (идут); отпустил — `go` = 0 (стоят; дочь поднимает к нему лицо — это делает сцена),
счёт `stops` (это не ошибка — отклик нейтральный). Реплики — `opts.lines[i]()` по очереди, когда `walked` переходит
0.35, 0.6, 0.9, 1 (одна за другой, не перебивая). По объективу (scenes.md «Общее», «Объектив»): на 0.35 Гуров
(1.8 м) в ≈ 10 м — 0.18 кадра, на 0.6 в ≈ 7.9 м — 0.23; вопрос дочери — на 0.9, в ≈ 5.4 м: она (1.35 м) — 0.25
кадра, он — 0.34; Р92 рассказчика — у ворот. Полоса — `walked`. Конец: `walked` ≥ 1 и все
четыре сказаны. `about`: путь 8.5 м шагом ребёнка (0.8–1 м/с) — 9–11 с, четыре реплики подряд — 12.7 с, конец ≈ 17 с,
с одной остановкой ≈ 20 с. Фраза: «Шёл мокрый снег; дочь держала его за руку». Итог `{stops}`; `skipped` `{stops: 0}`.

### Чай (`about: 14`)

*Гуров наливает чай, пока она плачет; хочет переждать её слёзы, сделать что-то; забота мелочью. Игрок — два
движения, второе с опасностью.* Вставка `tea` открыта. Подложку плача ставит глава, мини-игра её не трогает.
1) **Тянуть**: кольцо с пунктиром на `tea#glass`, цель — `tea#under` (под краном); где стакан — `glass_at` 0…1; дошёл
— `mg.snap`, метка снимается. 2) **Держать с опасностью**: кольцо с желобом на `tea#tap`; держит — `tap` = 1, своё
`fill` растёт на 0.12 в секунду и шлётся ключом; на каждом открытии `g.sound.pour()`; дуга опасности — от `fill` 0.8
к 1. Отпустил — `tap` = 0. Отпустил при `fill` 0.82…0.95 — `mg.snap`, через 0.8 с конец (`clean`). `fill` > 1 —
перелил: `mg.error('danger', {at: 'tea#tap'})`, действие `b.act('state', 'move', 'spill', 1, {over: 0.5})` (отменять
на `signal`), `g.sound.spill()`, счёт `spills`, `tap` = 0, `fill` = 0.9 — через 1 с конец (`flawed`). Полоса —
`fill`. Фраза: «Самовар был горячий, а она всё плакала у окна». Итог `{spills}`; `skipped` `{spills: 0}`.

### Советоваться (`about: 18`)

*Они ищут выход; хотят придумать, как жить; всё упирается. Игрок — трогать выходы — или молчать.* Жест — **нажать с
лепестком** на трёх вещах: `window` — «Жить в одном городе», `door` — «Уехать вдвоём», `table` — «Видеться каждый
день» (точки `window#window`, `door#door`, `table#glasses`). Нажал лепесток — метки скрыты («ход сцены»), `think` = id,
`await opts[id]()`, `think` = `'none'`, метки остальных снова. Молчать — тоже путь (палец показывает «руки прочь»).
Конец: все три тронуты — или 15 с без нажатия от начала или от конца последних слов (`neutral`). Полоса — время
тишины. Фраза: «Потом они долго советовались». Итог `{touched: [id по порядку]}`; `skipped` `{touched: []}`.

## 8. Голоса, реплики, звук, музыка

### Голоса (`PEOPLE` в `story.js`)

Рассказчик — безымянный, спокойный мужской голос: говорит, что было видно и слышно, не персонаж; тон Чехова — тёплый,
чуть насмешливый. Голоса — готовые голоса сервиса звука (Gemini). Любая правка буквы в тексте, манере, имени или голосе
— новая платная запись; поэтому голоса делают один раз, все вместе, когда текст решён (work.md).

| Ключ | Голос | Манера (`how`) | Кто (`name`) |
| --- | --- | --- | --- |
| `narrator` | Sadachbia | спокойно, тепло, чуть насмешливо — как автор читает свой рассказ вслух | рассказчик |
| `gurov` | Algenib | мужчина под сорок: негромко, бархатно, с ленцой и лёгкой усмешкой | Дмитрий Дмитрич Гуров |
| `gurov_inner` | Algenib | тот же, тихо, про себя, с усмешкой над собой | Гуров, про себя |
| `anna` | Sulafat | молодая женщина: тихо, быстро, взволнованно, без жалобы | Анна Сергеевна |
| `diderits` | Umbriel | молодой мужчина: вежливо, мягко, чуть неловко, по-домашнему | фон Дидериц, муж Анны |
| `diderits_low` | Umbriel | тот же: глухо, медленно, не глядя на неё (Р81, Р82) | фон Дидериц, муж Анны |
| `wife` | Gacrux | зрелая женщина: ровно, прямо, негромко, с достоинством | жена Гурова |
| `wife_low` | Gacrux | та же: тихо, ровно (Р87) | жена Гурова |
| `daughter` | Leda | девочка двенадцати лет: серьёзно, звонко | дочь Гурова |
| `official` | Algieba | чиновник: сыто, громко, добродушно, о своём | чиновник, партнёр по картам |

### Все реплики — единственный список

Каждая реплика игры написана здесь один раз; в §6 и в scenes.md — только её номер. Глава пишет её литералом:
`g.say('<кто>', '<текст>')`. «≈ с» — 0,3 с + 0,06 с на букву.

| № | Кто | Текст | ≈ с |
| --- | --- | --- | --- |
| Р1 | `narrator` | Говорили, что на набережной появилось новое лицо: дама с собачкой | 4.2 |
| Р2 | `narrator` | Дмитрий Дмитрич Гуров, проживший в Ялте уже две недели, тоже стал интересоваться новыми лицами | 5.9 |
| Р3 | `narrator` | О женщинах он отзывался почти всегда дурно и называл их низшей расой | 4.3 |
| Р4 | `narrator` | Однажды под вечер он обедал в саду, а она подошла и села за соседний стол | 4.7 |
| Р5 | `anna` | Он не кусается | 1.1 |
| Р6 | `gurov` | Можно дать ему кость? | 1.6 |
| Р7 | `gurov` | Вы давно изволили приехать в Ялту? | 2.3 |
| Р8 | `anna` | Дней пять | 0.8 |
| Р9 | `gurov` | А я уж дотягиваю здесь вторую неделю | 2.5 |
| Р10 | `gurov` | Это только принято говорить, что здесь скучно. Обыватель живёт где-нибудь в Белёве — и ему не скучно | 6.3 |
| Р11 | `gurov` | А приедет сюда: «Ах, скучно! Ах, пыль!» Подумаешь, что он из Гренады приехал | 4.9 |
| Р12 | `narrator` | Вода была сиреневого цвета, такого мягкого и тёплого, и по ней от луны шла золотая полоса | 5.6 |
| Р13 | `narrator` | Он узнал, что её зовут Анна Сергеевна, что она замужем и что муж её служит в С. | 5.0 |
| Р14 | `narrator` | Прошла неделя. Был праздничный день, дул сухой ветер, и пароход пришёл поздно | 4.9 |
| Р15 | `narrator` | Она смотрела в лорнетку на пассажиров, как бы отыскивая знакомых | 4.1 |
| Р16 | `narrator` | Анна Сергеевна потеряла в толпе лорнетку | 2.7 |
| Р17 | `gurov` | Пойдёмте к вам | 1.1 |
| Р18 | `narrator` | У неё в номере было душно и пахло духами, которые она купила в японском магазине | 5.1 |
| Р19 | `anna` | Нехорошо. Вы же первый меня не уважаете теперь | 3.1 |
| Р20 | `narrator` | Прошло, по крайней мере, полчаса в молчании | 2.9 |
| Р21 | `gurov` | Отчего бы я мог перестать уважать тебя? | 2.6 |
| Р22 | `anna` | Я не мужа обманула, а самоё себя | 2.2 |
| Р23 | `anna` | Мой муж, может быть, честный, хороший человек, но ведь он лакей! | 4.1 |
| Р24 | `anna` | Хотелось пожить! Пожить и пожить… | 2.3 |
| Р25 | `gurov` | Полно, полно… | 1.1 |
| Р26 | `narrator` | В Ореанде сидели на скамье недалеко от церкви, смотрели вниз на море и молчали | 5.0 |
| Р27 | `narrator` | Так шумело внизу, когда ещё тут не было ни Ялты, ни Ореанды. Теперь шумит и будет шуметь так же равнодушно и глухо, когда нас не будет | 8.3 |
| Р28 | `narrator` | Подошёл какой-то человек — должно быть, сторож, — посмотрел на них и ушёл | 4.7 |
| Р29 | `narrator` | Видно было, как пришёл пароход из Феодосии, освещённый утренней зарёй, уже без огней | 5.3 |
| Р30 | `anna` | Роса на траве | 1.1 |
| Р31 | `gurov` | Да. Пора домой | 1.1 |
| Р32 | `narrator` | Каждый полдень они встречались на набережной, вместе завтракали, обедали, гуляли | 5.1 |
| Р33 | `narrator` | Они целовались среди белого дня, с оглядкой — как бы кто не увидел | 4.3 |
| Р34 | `narrator` | Но вот пришло письмо от мужа | 2.0 |
| Р35 | `diderits` | Анна, у меня разболелись глаза. Возвращайся, если можно. Шпица не перекармливай | 5.0 |
| Р36 | `anna` | Хорошо, что я уезжаю. Это сама судьба | 2.5 |
| Р37 | `anna` | Дайте я погляжу на вас ещё… Погляжу ещё раз. Вот так | 3.4 |
| Р38 | `anna` | Мы навсегда прощаемся, это так нужно, потому что не следовало бы вовсе встречаться | 5.2 |
| Р39 | `narrator` | Он остался на платформе один. Кричали кузнечики, гудели телеграфные проволоки | 4.9 |
| Р40 | `gurov_inner` | Вот и ещё одно приключение… И оно тоже уже кончилось | 3.4 |
| Р41 | `narrator` | На станции уже пахло осенью, вечер был прохладный | 3.2 |
| Р42 | `narrator` | В Москве уже всё было по-зимнему. Выпал первый снег, и поехали сани | 4.3 |
| Р43 | `gurov_inner` | Пройдёт какой-нибудь месяц — и всё это покроется в памяти туманом | 4.2 |
| Р44 | `narrator` | Прошло больше месяца. Она не снилась ему, а шла за ним всюду, как тень | 4.5 |
| Р45 | `narrator` | Иногда за обедом он вдруг начинал говорить о любви, о женщинах | 4.0 |
| Р46 | `wife` | Тебе, Димитрий, совсем не идёт роль фата | 2.7 |
| Р47 | `narrator` | А в С. стояла поздняя осень. Каждый вечер Анна Сергеевна гуляла со шпицем вдоль забора | 5.5 |
| Р48 | `diderits` | Анна, простудишься. Пойдём в дом | 2.2 |
| Р49 | `narrator` | Однажды ночью он выходил из докторского клуба со своим партнёром, чиновником | 4.9 |
| Р50 | `gurov` | Если б вы знали, с какой очаровательной женщиной я познакомился в Ялте! | 4.6 |
| Р51 | `official` | Дмитрий Дмитрич! | 1.3 |
| Р52 | `gurov` | Что? | 0.5 |
| Р53 | `official` | А давеча вы были правы: осетрина-то с душком! | 3.0 |
| Р54 | `gurov_inner` | Какие дикие нравы, какие лица! Что за бестолковые ночи… | 3.6 |
| Р55 | `narrator` | Он не спал всю ночь | 1.4 |
| Р56 | `narrator` | В декабре, на праздниках, он собрался в дорогу | 3.1 |
| Р57 | `gurov` | Еду в Петербург хлопотать за одного молодого человека | 3.5 |
| Р58 | `wife` | Поезжай, Димитрий. К Новому году вернись | 2.7 |
| Р59 | `narrator` | В С. он остановился в лучшей гостинице. На столе стояла чернильница: всадник, у которого поднята рука со шляпой, а голова отбита | 8.0 |
| Р60 | `narrator` | Швейцар сказал: фон Дидериц живёт на Старо-Гончарной, в собственном доме | 4.6 |
| Р61 | `gurov_inner` | От такого забора убежишь | 1.7 |
| Р62 | `narrator` | Он услышал звуки рояля, слабые, неясные. Должно быть, Анна Сергеевна играла | 4.8 |
| Р63 | `narrator` | Он хотел позвать собаку — и не мог вспомнить, как зовут шпица | 4.0 |
| Р64 | `gurov_inner` | Вот тебе и дама с собачкой… Вот тебе и приключение… Вот и сиди тут | 4.3 |
| Р65 | `narrator` | На заборе висела афиша: в этот вечер в театре шла первый раз «Гейша» | 4.4 |
| Р66 | `narrator` | Она затерялась в провинциальной толпе, эта маленькая женщина с вульгарною лорнеткой в руках | 5.8 |
| Р67 | `narrator` | С ней вошёл молодой человек с небольшими бакенами, очень высокий, сутулый. Он при каждом шаге кланялся | 6.4 |
| Р68 | `narrator` | Это был муж, которого она тогда в Ялте назвала лакеем | 3.5 |
| Р69 | `gurov` | Здравствуйте | 1.0 |
| Р70 | `anna` | Как вы меня испугали! Зачем вы приехали? Зачем? | 3.1 |
| Р71 | `gurov` | Но поймите, Анна, поймите… | 1.9 |
| Р72 | `anna` | Я приеду к вам в Москву. Клянусь, я приеду. А теперь расстанемся! | 4.2 |
| Р73 | `anna` | Мой дорогой, хороший, расстанемся! | 2.3 |
| Р74 | `anna` | Уезжайте сегодня же. Я никогда не была счастлива и никогда не буду. Не заставляйте же меня страдать ещё больше! | 7.0 |
| Р75 | `narrator` | Через месяц она собралась в Москву | 2.3 |
| Р76 | `narrator` | Она продержалась до весны | 1.8 |
| Р77 | `diderits` | Когда вернёшься? | 1.3 |
| Р78 | `anna` | Через неделю. Профессор велел показаться ещё раз | 3.2 |
| Р79 | `narrator` | Муж верил и не верил | 1.5 |
| Р80 | `anna` | Я еду к нему | 1.0 |
| Р81 | `diderits_low` | Я знал | 0.7 |
| Р82 | `diderits_low` | Поезжай. Только чтобы в городе не знали. Шпиц останется со мной | 4.0 |
| Р83 | `narrator` | Она приезжала в Москву раз в два-три месяца. Он возвращался от неё поздно | 4.7 |
| Р84 | `wife` | Где ты был, Димитрий? | 1.6 |
| Р85 | `gurov` | В клубе. Играли до двух | 1.7 |
| Р86 | `gurov` | Я был у неё | 1.0 |
| Р87 | `wife_low` | Тише. Дети спят | 1.2 |
| Р88 | `narrator` | В другой её приезд, утром, он вёл дочь в гимназию | 3.2 |
| Р89 | `gurov` | Теперь три градуса тепла, а между тем идёт снег | 3.1 |
| Р90 | `gurov` | Это тепло только на поверхности земли, а в верхних слоях атмосферы совсем другая температура | 5.8 |
| Р91 | `daughter` | Папа, а отчего зимой не бывает грома? | 2.5 |
| Р92 | `narrator` | Он объяснил и это | 1.3 |
| Р93 | `narrator` | У него были две жизни: одна явная, полная условной правды и условного обмана, и другая — тайная | 6.0 |
| Р94 | `narrator` | Каждое личное существование держится на тайне | 3.0 |
| Р95 | `narrator` | Человек в красной шапке подал ему записку | 2.8 |
| Р96 | `anna` | Я приехала. «Славянский базар» | 2.1 |
| Р97 | `narrator` | Она была в его любимом сером платье | 2.4 |
| Р98 | `gurov` | Перестань, моя хорошая… | 1.7 |
| Р99 | `narrator` | Голова его уже начинала седеть | 2.1 |
| Р100 | `narrator` | Они были как две перелётные птицы, самец и самка, которых поймали и заставили жить в отдельных клетках | 6.4 |
| Р101 | `gurov` | Как освободиться от этих невыносимых пут? | 2.8 |
| Р102 | `gurov` | Жена знает | 0.9 |
| Р103 | `anna` | И что же теперь? | 1.3 |
| Р104 | `anna` | Муж знает. Отпустил — а шпица оставил себе | 2.8 |
| Р105 | `gurov` | И что же теперь? | 1.3 |
| Р106 | `gurov` | Переезжай в Москву | 1.4 |
| Р107 | `anna` | А он? Он ни в чём не виноват | 2.0 |
| Р108 | `anna` | Уехать бы вдвоём… | 1.4 |
| Р109 | `gurov` | А дети? | 0.8 |
| Р110 | `gurov` | Видеться бы каждый день… | 1.7 |
| Р111 | `anna` | И каждый день прощаться? | 1.7 |
| Р112 | `gurov` | Как? Как? | 0.8 |
| Р113 | `narrator` | И казалось, что ещё немного — и решение будет найдено, и тогда начнётся новая, прекрасная жизнь; и обоим было ясно, что до конца ещё далеко-далеко и что самое сложное и трудное только ещё начинается | 12.2 |
| Р114 | `diderits` | На профессора. И купи себе что-нибудь в Москве | 3.0 |

Текстом на бумаге (и голосом той же реплики): письмо мужа — «Анна, у меня разболелись глаза. Возвращайся, если можно.
Шпица не перекармливай.» / «Твой муж» (Р35); записка — «Я приехала. «Славянский базар».» / «А.» (Р96). На бумаге стоит
точка в конце, в реплике — нет; больше они ничем не различаются.

### Звуки страницы (`sound.js`)

Всё синтезируется в Web Audio, файлов нет, по образцу Ашеров: один `AudioContext` → общий уровень → компрессор; посыл
в сгенерированную реверберацию (две: открытый воздух 1.8 с, светлая; комната 0.6 с); шумовые буферы; огибающие;
пауза и первое касание — страницы (выход через `MooodVolume.output`: звуки ждут с партией, как музыка, — затухая и возвращаясь); `background(levels, seconds)` — названные подложки к уровню, остальные в ноль (его
зовёт страница); `unheard()` — немой двойник для невидимого шага: **в нём перечислен каждый звук по имени**, подложки
тоже немые, `band()` и `piano()` отдают немую ручку `{loud() {}, stop() {}}`.

Подложки игра объявляет, а не переключает: со сценой — `g.scene(…, {beds})` (страница меняет их на склейке вместе с
музыкой сцены, тем же переходом), внутри сцены — `g.beds(…)` (сразу, тем же переходом); секунды игра не задаёт, на карте —
`background` в `b.show` (moood `bespoke.background`, `docs/games/README.md`).

| Звук | Вид | Как сделан | Где |
| --- | --- | --- | --- |
| `sea(level, s)` | подложка | бурый шум через НЧ-фильтр, волна раз в 7–9 с, шипение отката — розовый шум через ВЧ | Ялта, Ореанда |
| `cicadas(level, s)` | подложка | частые щелчки полосового шума 4–6 кГц пачками, медленная волна громкости | Ялта днём и вечером |
| `crowd(level, s)` | подложка | гул голосов: несколько полос розового шума 300–1200 Гц с медленной случайной модуляцией | пристань |
| `wind(level, s)` | подложка | розовый шум через полосовой фильтр, частота гуляет 300–900 Гц | пристань, С. осенью |
| `crickets(level, s)` | подложка | кузнечики: синусы 4–5 кГц ритмичными трелями, вразнобой | станция |
| `wires(level, s)` | подложка | гул проводов: два синуса 100 и 150 Гц с медленным биением, тихо | станция |
| `steam(level, s)` | подложка | пар паровоза: шипящий шум через ВЧ с редкими вздохами | станция |
| `snow(level, s)` | подложка | снежная тишина: очень тихий низкий ветер и далёкие редкие бубенцы | Москва, С. зимой |
| `thaw(level, s)` | подложка | оттепель: редкая капель (короткие звонкие капли) и мокрый шорох | V при `spring`, IV.3 |
| `room(level, s)` | подложка | тишина комнаты: тиканье часов и едва слышный гул | номера |
| `hall(level, s)` | подложка | театральный гул голосов, скрип кресел | театр |
| `weep(level, s)` | подложка | тихий неровный плач: прерывистое дыхание розовым шумом через НЧ 700 Гц, всхлипы раз в 3–6 с | номер в Ялте, «Славянский базар» |
| `band()` | ручка `{loud(v, s), stop(s)}` | далёкий духовой оркестр: вальс «Дунайские волны» (И. Иванович, 1880, общественное достояние) — медь пилой и квадратом через НЧ-фильтр, «ум-па-па» тубы, большая реверберация, далеко | сад в Ялте |
| `piano(tune, {wall})` | ручка `{loud(v, s), stop(s)}` | рояль: затухающие синусы с обертонами, педаль; `tune`: `'waltz'` — тот же вальс, `'etude'` — гаммы и простой этюд (по данным в коде); глухо — НЧ-фильтр 1.2 кГц (через окно и снег); `{wall: true}` — ещё глуше и тише, за стеной | С., «Славянский базар» |
| `tuning()` | раз, ~6 с | театральный оркестр настраивается: несколько смычковых и духовых голосов тянут ля и квинты вразнобой | театр |
| `bark()`, `yap()`, `growl()` | раз | лай: короткие шумовые импульсы через полосовой фильтр 800–1500 Гц; `yap` — радостный, выше и двойной; `growl` — низкое рычание 120–200 Гц с дрожанием, 1 с | шпиц |
| `clink()` | раз | стук упавшей лорнетки по доскам: два коротких звонких удара | пристань |
| `heart()` | раз | два глухих удара сердца, низкий синус с быстрым спадом | «Лорнетка» |
| `knife()` | раз | хруст разреза арбуза: короткий влажный шум через полосу 1–3 кГц | «Арбуз» |
| `horn()` | раз | гудок парохода: две пилы 175 и 233 Гц через НЧ, 1.5 с, далеко | пристань |
| `bell(level = 1)` | раз | станционный колокол / театральный звонок: три удара металлического тона (несколько негармоничных синусов) | станция, театр |
| `whistle(level = 1)` | раз | паровозный свисток: пила 600 Гц через полосовой фильтр, 1.2 с | станция, С. |
| `wheels()` | раз, ~8 с | поезд трогается: удары колёс на стыках, учащаясь и стихая | станция |
| `sleigh()` | раз | сани проезжают: бубенцы и скрип полозьев, слева направо | Москва |
| `gate()`, `door()` | раз | скрип калитки; дверь подъезда (скрип и мягкий удар) | С., Москва |
| `pour()` | раз, 2 с | чай льётся из крана в стакан: журчание, тон чуть растёт | «Чай» |
| `spill()` | раз | перелилось на блюдце: короткое шипение капель | «Чай» |
| `paper()` | раз | шелест листа (как у Ашеров) | письмо, записка, конверт мужа |
| `watch()` | раз | карманные часы: щелчок крышки и тихое тиканье 2 с | «Славянский базар», `bazar_end` при лжи жене |

### Музыка сцен

`music` каждой сцены — тихая подложка; игра ею не управляет. Вальс, рояль и оркестр играет игра; в `music` сцен их
нет (scenes.md).

## 9. Интерфейс и стиль (`ui.js`, `ui.css`, `fonts.css`)

- **Курортная открытка и карандаш.** Переменные на `#layer`: `--card` (`#f1ebdf`, тёплая белая бумага), `--card-edge`
  (`#cbbfa8`, выцветшая рамка), `--graphite` (`#3b3a38`), `--leash` (`#a8322c` — **только** поводок шкалы Анны),
  `--hand`, `--below-header` (46 px). Подложка тостов, подсказки «Коснись шпица», письма — бумага открытки с тонкой
  рамкой, слова — графитом.
- **Язык мини-игр в этой игре** (`b.minigame.style`, один раз в `game.js`): шрифт плашки и лепестков — «Dama Hand»;
  цвет метки и налива — графит `#3b3a38` с белым ободком; «хорошо» — тёплый белый `#f1ebdf`; опасность — тускло-
  охристый `#b07a3a` (не красный: красное в игре — только поводок); нейтральные цвета путей («Поводок»: домой /
  к дороге) — серо-голубой `#8a9bab` и песочный `#c2a77e`. Звуки языка — его, свои не подменяем. Смысл меток,
  ошибок и плашки — языка.
- **Шрифт** — `"Dama Hand"`: Bad Script (OFL 1.1, кириллица и латиница), встроен в `fonts.css` как woff2 в base64.
  Стрелки ↑ — системными засечками.
- **Шкалы** (`view.gauges(state | null, hero)`), `pointer-events: none`, обе на 64 px выше низа:
  - поводок — слева внизу, SVG 72×72: линия парапета графитом, белый шпиц силуэтом с графитовым контуром, от руки у
    левого края к ошейнику — красная линия поводка (`--leash`); место шпица `x = 14 + 44 · (a + 3) / 6` (a —
    `scales.anna`); чем дальше шпиц, тем длиннее поводок; переход 2 с.
  - часы — справа внизу, SVG 72×72: карманные часы графитом, цепочка; крышка на шарнире сверху открыта на угол: при
    h ≤ 0 — `15° · (5 + h) / 5` (0…15°: закрыта, чуть приоткрыта у ноля), при h > 0 — `60° + 50° · (h − 1) / 4`
    (60…110°: открыта) (h — `scales.heart`, −5…5; в партии ±1, ±3, ±5 → 12°/6°/0° и 60°/85°/110°); сторону видно
    сразу; переход 2 с.
  - шкала героя сцены — `opacity` 1, другая — 0.35; `both` — обе 1.
- **Тосты** (`view.toast(text, kind)`): полоска бумаги открытки справа вверху под инструментами, не больше трёх,
  4.2 с (`rule` — 7.5 с); виды `scale`, `rule`, `mark`.
- **Подсказка** (`view.hint`) — одна строка внизу посередине, только каркаса («Коснись шпица»); в мини-играх её нет
  (там — плашка языка). Кнопки «Дальше» нет; страховка игрока — ⏭ на время мини-игры (§7 «Общее»).
- **Титр** (`view.title`): слова посреди кадра, 9 с — только название в прологе.
- **Письмо** (`view.letter`): §3.6; звук `paper()`.
- **Инструменты**: ⏸ — всем; ☰ — автору; ⏭ — автору, а пока идёт мини-игра — всем (§3, правка 12); справа вверху под шапкой, `z-index` 10 (карта автора — 20).
- Метки и лепестки выбора (язык мини-игр), пузыри реплик, строка «без голоса» — страницы; игра своих меток не рисует.
- **Карта выборов и титулы глав** — сцена «Огни» (scenes.md), не интерфейс.

## 10. Что сделано не так, как у Чехова и в замысле, и как именно

| У Чехова / в замысле | Как сделано | Почему |
| --- | --- | --- |
| весь рассказ глазами Гурова | Анна играется в пяти местах: лорнетка, окно вагона, поводок в С., лестница, калитка | у неё свои серые выборы; игрок знает больше обоих |
| о письме мужа — одна фраза | письмо с текстом: «…Шпица не перекармливай», его голосом | показать мужа неплохим человеком до того, как Гуров увидит в нём «лакея» |
| Анна в С. осенью не показана | шаг «Поводок»: она гуляет со шпицем вдоль забора, муж накидывает ей пальто | намёк: «я так страдала… мне хотелось забыть»; игрок видит забор её глазами раньше Гурова |
| арбуз — одна картинка | арбуз режут всегда (мини-игра «Арбуз»); выбор — после: есть за столом или отнести ей ломоть и сесть рядом | самая чеховская картинка — у всех; выбор — как он с ней обошёлся |
| «осетрина-то с душком» — поворот | Гуров говорит о ней всегда; выбор — после осетрины: засмеяться и сесть в сани или уйти пешком | переживание главы у всех; цена — как он с ним обошёлся |
| жена: «Тебе, Димитрий, совсем не идёт роль фата» | кусок `table_window`: два силуэта в окне, её голос | Чехов; жена живая до развилки V |
| «каждое личное существование держится на тайне» | реплика рассказчика в V.2 (Р94) | чеховская мысль рядом с выбором правды: ложь — позиция автора, а не «хуже» |
| Гуров не зовёт шпица (не может вспомнить имя) | выбор: позвать — манит рукой, шпиц бежит к нему или лает; горничная видит | у Чехова он хочет позвать; цена — слух в доме; плата за ялтинский жест |
| муж в антракте всегда уходит курить | если горничная видела — остаётся; Анна выходит сама | последствие выбора у калитки телом |
| «Я приеду к вам в Москву» и «расстанемся» — вместе | её ответ — выбор (`~`): обещание или «уезжайте» (весной всё равно едет) | её доля выбора; цена — сезон: зима без неё |
| «муж верил и не верил» | выбор Анны: солгать (как у Чехова; муж даёт конверт «на профессора», он лежит на столе в Москве) или сказать правду — тихо, у калитки, так что горничная у крыльца и извозчик у лошади не слышат (муж отпускает её и оставляет шпица себе: «Поезжай. Только чтобы в городе не знали»; сам идёт к крыльцу и берёт поводок у горничной) | «как избавить себя от необходимости… обманывать» — они это обсуждают у Чехова; 1899: вид на жительство жены — в воле мужа (Устав о паспортах, до закона 1914 г.), развод — только с оглаской; правда не освобождает |
| жене Гуров лжёт про Петербург, и всё | в V жена спрашивает «Где ты был?» — солгать («В клубе. Играли до двух» — потом в номере он смотрит на часы) или «Я был у неё» («Тише. Дети спят»; она остаётся в дверях; утром у окна) | то же; концовки по двум правдам; жена 1899 года не уходит — дети, имя, деньги |
| финал один | четыре концовки — кто из супругов знает; последняя фраза Чехова во всех | все открытые и тёплые, ни одна не идеальна |
| превращение Гурова | несёт седина в зеркале во всех ветках; шкала мерит манеру (лёгкость ↔ открытость), не любовь | шкала не подменяет характер |
| «Голова его уже начинала седеть… он полюбил как следует, по-настоящему — первый раз в жизни» | только «Голова его уже начинала седеть»; любовь несут руки на её плечах и зеркало | принцип: чувства не называются |
| «…и обоим было ясно, что…» | сохранено слово в слово (Р113) | последняя фраза рассказа; единственное исключение из «не называть», сознательно |
| «Потом они долго советовались…» | мини-игра «Советоваться»: три выхода, на каждый — причина (Р106–Р111), верные во всех четырёх концовках | действие руками в финале; слов в рассказе нет — написаны в тоне |
| номер Гурова в С. (серое сукно, «больничное» одеяло, сон до темноты) | только чернильница (вставка `inkwell`) и «Вот тебе и дама с собачкой…» у афиши | новое место ради одного лежания — смотрение без действия |
| поездки, водопад, юбилей, банк | не показаны | выдумка или вода |
| оркестр, рояль | только звуком; рояль — через забор и стену | модель движений не играет на инструментах; у Чехова рояль тоже только слышен |
| лорнетка в театре «вульгарная» | новая лорнетка — прежнюю она потеряла в Ялте (игрок это видел) | рифма без слов |
| лестница театра | склейка на площадку; подъёма и спуска по ступеням в кадре нет | модель движений не ходит по ступеням |
| лица на ключевых моментах | лица фигур (`simple`, с выражением `_mood`) — средним и крупным планом в ключевые моменты (scenes.md «Общее», «Лица»); руки и вещи — вставками | решение владельца 2026-10-15: лица видны; со спины — только как приём |
| длина 35–40 минут | ≈ 18–19 минут по честному счёту (design.md, «Длина») | рассказ короче; воды не добавляли; решение владельца: короткая игра — можно |

Реплики, которых нет у Чехова дословно (написаны в тоне или пересказ): Р3, Р33, Р35 (письмо), Р47, Р48, Р58, Р63,
Р65, Р75, Р76, Р77, Р78 (по Чехову: «к профессору»), Р80–Р82, Р83, Р84–Р88, Р96, Р102–Р111, Р114. Остальное — Чехов, местами
сокращён (Р45, Р46, Р94 — Чехов).

## 11. Проверка веток (`bespoke/check/`)

`node bespoke/check/run.mjs <клон мира>` — без браузера, без движка, ничего не рисует.

- `fake.mjs` — поддельная `b`: `specOf(title)` отвечает из `scenes/*/scene.json` клона; остальное — пустышки. Шаги
  идут всухую тем же путём, что ☰ автора (`jump(Infinity, unheard(), {result})`, `context(…, j)`): без времени, выборы —
  из заданного состояния, мини-игры — подставленным итогом.
- Обход: все 256 сочетаний восьми выборов (их строит `run.mjs` каркаса) и ещё одна партия с «Поводком» `end: 'road'`
  (`r.end` меняет только куски III.2, не состояние: этого хватает). «Море» — `touched: ['hand']`. Итоги остальных
  мини-игр — по очереди обе стороны своего ключа истории (`trust`, `fright`, `ragged`, `apart`, `gossip`, `look_back`,
  `under`, `noticed`, `wave`, `stain`, `think`): чётные партии — «ошибался», нечётные — «чисто». Каждая партия — все
  20 шагов подряд, состояние переходит из шага в шаг.
- Что записывает (обёртка над `j`): каждое `g.scene` (название и ключи), `g.beat`, `g.next`, `g.told`, `g.set/get`
  (ключ), ключ предложения, `at` реплики, `b.where`-точки из таблицы §7, текст и говорящего каждой реплики, звуки.
- С чем сверяет — с блоком «Контракт для проверки» из `notes.md` каждой сцены и её `scene.json`: сцена есть; кусок
  есть; кусок идёт после своего `after` или открывает сцену (иначе — сообщить); перед каждым `g.beat(x)`, кроме
  открывающего сцену, был `g.next(x)` (§3.9); момент есть у этого куска; ключ есть в `states`; ключ партии из `carry`
  есть в `party`; точка и предложение есть; элемент предложения имеет `name`; говорящий есть в `PEOPLE`; звук есть в
  `sound.js` и в `unheard()`; поля `opts` и итога, которые глава даёт и читает, есть у мини-игры.
- Обратно: кусок, момент, ключ партии, точка из контрактов сцен, которых не назвала ни одна партия (кроме `show:
  false`), — списком.
- Ровно одна концовка на партию; каждая из четырёх встречается; каждая метка, которую ставит партия, где-то читается
  (`facts` или запись); каждый итог мини-игры доходит до ключа сцены, который читает кусок (§7, последний столбец);
  выборы `husband` и `wife` шкал не двигают; `heart` и `anna` в каждой полной партии нечётны там, где читаются (§5).
- **Что действие** (для отрезков смотрения): мини-игра, выбор, касание без выбора (`g.choose(null, …)`), касание шпица
  в «Огнях», письмо и записка (их убирают касанием).
- **Длина — честно:** по каждому куску считается max(его `seconds`, сумма реплик, сказанных, пока он держит позу);
  реплика между кусками — целиком; мини-игра — её `about` (по своим правилам, §7); выбор — 5 с; «Огни» — 2,5 с + 1,2 с
  на строку + 5 с; стена с титулом — 6 с. Печатает: расхождения; список всех сказанных реплик без повторов (кто, текст)
  — по нему записывают голоса; каждая из 114 реплик §8 сказана хоть в одной партии; по каждой концовке — куски по
  шагам и время по главам и всего; каждый отрезок смотрения без действия дольше 90 с.
- Чего проверка не видит: значения ключей партии (только имена), повторы реплик, если глава нарушит §6 (досказ по
  счётчику), настоящее время у игрока, условие момента, который кусок говорит не всегда (его держит правило §4).
