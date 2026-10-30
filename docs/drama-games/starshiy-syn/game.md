# Старший сын: игра в коде

> С 2026-10-16 (мультиязычность, `moood-me/studio:docs/history/2026-10-16-multilang.md`): код и тексты — по-английски, русский —
> перевод (`lang/`); люди — `bespoke/people.json`, реплики — `b.say` рантайма; сцены, модули (`houses`, `trains`),
> мини-игры, ключ `buckets`, костюмы, шрифт «Son Hand» — с английскими именами (список —
> `moood-me/studio:docs/history/2026-10-16-multilang-migration.md`); сцены, которых ещё нет, — `platform`, `yard`; раздел проверки в
> `notes.md` — «Contract for the check». Ниже — как было сделано до этого (и `scenes.md`, `work.md`, `design.md` рядом).
>
> С 2026-10-21 (доделка, `finish.md`): каркас — как у «Cinema Paradiso» (`moood-me/moood:docs/games/games.md`): **карта партии**
> вместо семафора и карт «Состава» (§3.4–3.5 ниже переписаны), ⏭ и ☰ — страницы (`bespoke.forward`, `bespoke.menu`),
> своих кнопок у игры нет; `bespoke.at`/`ended`; **на платформу приходят и по правде** (§5 `facts`, §6 V.3, эпилог).

2026-10-15, четвёртая редакция (после третьего чтения). Как устроен код игры: по этому файлу и [scenes.md](scenes.md)
пишется всё в её репозитории. Замысел — [design.md](design.md) (история — только оттуда); кто что пишет и в каком
порядке — [work.md](work.md). **Образец каркаса — игра «Алые паруса v3»** (`pavel/alye-parusa-v3`, версия 6 и новее;
`bespoke/` её репозитория: `game.js`, `story.js`, `jump.js`, `hands.js`, `ui.*`, `check/`): её файлы копируются как
есть, и в них вносятся правки §3. Всё, что там своё у «Алых парусов» (`g.hero`, `g.spot`, `g.letter`, «Даль», кораблик
и компас, ключи и главы), убирается.

Экран — любое устройство лёжа, кадр от 4:3 до 21:9 (scenes.md «Общее»). Всё делается одним пальцем или мышью:
нажатие и ведение с нажатием, без наведения и без клавиш; метки и отклики — язык мини-игр.

## 1. Репозиторий игры

Игра: тип `bespoke`, название «Старший сын», мир `pavel--starshiy-syn`. Меняются только `game.json` и `bespoke/**`.

| Файл | Что это | Откуда | Область (work.md) |
| --- | --- | --- | --- |
| `game.json` | `{type: "bespoke", title: "Старший сын", description, genres: {"драма": 80, "трагикомедия": 70, "отношения": 70}, world: "pavel--starshiy-syn", scenes: []}` | создаёт MCP | координатор |
| `bespoke/game.js` | вход: порядок глав, цикл, сохранение, карта партии на «Составе» (`map.js`), переигровки, переходы автора, `PLAYS` | «Алые паруса», с правками §3; с 2026-10-21 — «Cinema Paradiso» | Каркас |
| `bespoke/story.js` | словарь шага (`g`), `PEOPLE`, `SCALES`, `EFFECTS`, `SCENES`, `ENDINGS`, `facts`, `carry`, `listen` | «Алые паруса», с правками §3–§5 | Каркас |
| `bespoke/jump.js` | шаг, сыгранный невидимо до мини-игры; `jump(target, quiet, {result})` | «Алые паруса», как есть | Каркас |
| `bespoke/hands.js` | `until`, `once`, `keys` — ожидания и ключи сцены для мини-игр | «Алые паруса», как есть | Каркас |
| `bespoke/ui.js`, `ui.css`, `fonts.css` | всё, что игра показывает поверх сцены | устройство «Алых парусов», вид свой (§9) | Каркас |
| `bespoke/sound.js` | звуки страницы, синтез | свой, устройство — как у «Алых парусов» | Звук |
| `bespoke/chapters/prologue.js`, `1.js` … `5.js`, `epilogue.js` | главы | свои | Главы |
| `bespoke/minigames/<имя>.js` | тринадцать мини-игр на языке мини-игр (без своих css) | свои | Мини-игры |
| `bespoke/check/run.mjs`, `fake.mjs` | проверка веток: node, без движка и без картинки (§11) | «Алые паруса», с правками §11 | Проверка веток |

## 2. Что даёт страница

`bespoke` (`b`) — `moood/web/site/bespoke/play.js`, шапка файла — полный список. Игра берёт: `b.show`, `b.specOf`,
`b.get/set`, `b.on`, `b.offer`, `b.say`, `b.hush`, `b.where`, `b.frame`, `b.act('state', 'move', …)`, `b.layer`,
`b.css`, `b.saved`, `b.keep`, `b.restart`, `b.trouble`, `b.pause`, `b.minigame` (язык мини-игр; на движке 3 и выбор
делается им — `b.offer` там ошибка). Слушателей `b.on` снять нельзя — их ставит один
`listen(b)`; шаги и мини-игры слушают сцену только через `g.told` (с 2026-10-21 `g.when`, `g.arrived`, `g.watch`, `g.move`, `g.hint` убраны — их никто не звал). **`b.get` у значения, которое
движется, отдаёт цель, а не место**: где сейчас то, что игра двигает сама, она считает сама; где сейчас человек — сцена
говорит своим ключом «где сейчас» (`…_at`).

## 3. Каркас: что берём у «Алых парусов» и что меняем

Берём как есть (это уже есть в каркасе «Алых парусов v3»): цикл глав и шагов, сохранение после каждого шага, шаг
заново с начала, ⏸; ⏭ и ☰ — страницы (с 2026-10-21, как у «Cinema Paradiso», `games.md` §2–§5: ☰ — на карту партии
всем; ⏭ — где игрок уже был: в увиденном шаге — к следующему действию, в мини-игре — пропуск, в неувиденной — через
20 с; своих кнопок у игры нет); переход к мини-игре, `hub` (и `hub.offer` — выбор на языке мини-игр), ожидания
`told/when/arrived/watch`, `say`, `choose`, `beat`, `play` и `g.minigame` (язык мини-игр), `move`, `wait`,
`title`; `hands.js`; `g.beds` (названные подложки к уровню, остальные — в ноль); две шкалы с двумя сторонами
(`g.scale`: тост `up`/`down` и стрелки); `g.gauge(name, {rule})` — шкала видна раньше правила; `g.scene(…, {cut:
true})` → `b.show(…, {fade: false})`, без `cut` — затемнение (ход времени); `carry(title, facts(state))` при каждом
`g.scene`; `g.mark`; `PLAYS` («партия как…»); `jump(target, quiet, {result})` — итоги
мини-игр подставляет проверка.

Меняем (каждое — одним способом):

1. **Последствия выбора — одной таблицей.** `EFFECTS` (§5): что каждый вариант делает со шкалами и метками.
   `g.apply(choice)` берёт вариант из `state.choices[choice]` и делает по таблице: `g.scale('home', …)`, потом
   `g.scale('lie', …)`, потом каждую метку `g.mark(key, value, text)`; метка с `text` `null` пишется без тоста (так
   две метки дают один тост). Главы шкал и меток напрямую не двигают.
2. **`g.mark(key, value, text | null)`** — `null`: без тоста.
3. **Выбор — на языке мини-игр — правки не требует.** В каркасе «Алых парусов v3» он уже такой (docs/alye-parusa/game.md
   §3.10, коммит 2658456): `g.choose` идёт через `hub.offer` → `b.minigame.start({plate: false})`, метка на каждой
   точке, касание открывает её лепестки — всегда, даже из одного; через 8 с без касания — призрачный палец; `b.offer`
   не берётся. Берём как есть. (Код «Алых парусов v3» читатели не сверяли — пункт для координатора в work.md.)
4. **Карта партии** (с 2026-10-21; `games.md` §2–§6, каркас «Cinema Paradiso»: `game.js`, `map.js`, карта в `ui.css`).
   Фон — служебная сцена «Состав» (`yard`): ночная станция, ближний путь поперёк кадра, снег, фонари на мачтах; панорама
   (`span` [0, 35]), ключи `shown` (глава, к которой идёт вид; сцена ведёт `camera_x` = `shown`·5 м) и `come` (каждое
   новое значение — вид обратно к ней), невидимые точки `c0`…`c7` (главы и финал; across i·5 м, 10 м от глаза, на 0.3
   высоты кадра) и `author` (across −3.2, 0.3). Деревья рисует игра в `bespoke.underlay`: каждая глава — **вагон одного
   состава** (вагоны встык, 448 / 900 высоты кадра — 5 м на 10 м), фонарь на крыше — её узел, номер и название на борту;
   развилки — окна: выбранное горит (тёплый `--lamp`), могло быть — в инее, не дошли — заколочено; будущая глава —
   тёмный вагон с номером; финал — последний вагон с красным хвостовым огнём, после эпилога в нём концовки. Вагон — от
   ≈ 0.2 до ≈ 0.62 высоты кадра (колёса до ≈ 0.63: там у сцены рельсы ближнего пути). Нажимается сама карта (`hub.ask`): указатель — «Начать»/«Продолжить»;
   узел сыгранной главы — «Переиграть главу»; развилка — «Переиграть отсюда»; переигровки — плашка на вагоне, «Оставить»
   / «Отменить»; знак автора (фонарь путейца) — его карта. На карте — `beds({wind: 0.2, rails: 0.4})`, шкалы скрыты.
5. **Когда карта.** Партия начинается с неё (её «Начать» — первое касание: страница звучит); после главы — карта, кроме
   главы перед `wall: false` (после пролога сразу глава I, после главы V сразу эпилог: её строки — сама концовка);
   по ☰; при каждом открытии. После эпилога — карта с финалом; заново — ↺ страницы.
6. **Нет досрочного конца.** Концовка считается (`facts(state).ending`); после главы V всегда эпилог.
7. **`PLAYS`** — как в «Алых парусах» (`ran()`): состояние на шаге n — это шаги 0…n−1 набора, сыгранные невидимо (они и
   зовут `g.apply`). Шкалы набора **не** суммируются по всем его выборам — это добавило бы будущее.
8. **Склейка внутри открытой сцены в кусок, который в фильме не следующий** — `g.set('beat_next', '<имя>')` до этой
   склейки, пока играет кусок перед ней (§4, правило шага). Модуль `beats` готовит кадр того куска, что назван в
   `beat_next` (и заново, когда `beat_next` меняется), а если не назван — следующего по таблице фильма. Без
   заготовки склейка тоже идёт — кадр делается в её миг.
9. Убрать: `g.hero`, `g.spot`, `g.letter`, кораблик, компас, «Даль», `g.trouble` и кнопку «Дальше» (в «Алых парусах
   v3» их уже нет).

## 4. Словарь шага (`story.js`), точные подписи

```js
export const SCENES = { platform: 'Платформа', street: 'Улица', home: 'Дом Сарафановых', hill: 'Косогор',
  crossing: 'Переезд', yard: 'Состав' };
export function facts(state)            // §5
export function carry(title, facts)     // §5
export function context(b, view, hub, state, j = null, { forward = null } = {})  // → g; forward — шаг увиден (⏭ страницы)
export function listen(b)               // → hub; hub.ask(at, options) — метка карты, рождённая раскрытой

g.state; g.signal; g.sound
g.beds(levels)                          // {имя подложки: уровень}; остальные — в ноль; сразу (внутри сцены)
await g.scene(title, state = {}, { cut = false, beds } = {})  // beds — подложки сцены: на её склейке, с музыкой
g.set(key, value, seconds); g.get(key)
await g.wait(ms)                        // только своё время игры
await g.told(text, ms = 60000)          // → true | false
await g.say(who, text, at = who)        // who — ключ PEOPLE; at — 'id' | 'id#точка' | 'narrator'
await g.choose(choice, {ref: [{id, label}], …})   // → id варианта; пишет state.choices[choice]; choice null — не пишет
await g.beat(name, { wait = true } = {})
await g.play(minigame, opts = {})       // → итог мини-игры (или её skipped — по ⏭)
g.minigame({ phrase })                  // внутри run: язык мини-игр (b.minigame.start), уходит по signal
g.apply(choice)                         // §3.1
g.scale(name, delta); g.gauge(name, { rule = true } = {})
g.mark(key, value, text)                // text null — без тоста
await g.title(text)
await g.done(); g.leave()               // game.js: шаг прошёл (⏭ убрана) / брошен (☰)
```

Правила шага (все обязательны):

- Шаг начинается с `g.beds(…)` и `g.scene(…)`; читает только `g.state` и `facts(g.state)`. Его можно сыграть заново,
  пропустить, войти в него с середины и прогнать всухую.
- Сцену открывают сразу на первом куске: `await g.scene(T, {beat: 'x'})`, потом `await g.beat('x')`. **`g.scene`
  всегда открывает сцену заново** (`b.show`: новая сцена со своим состоянием и модулями — это открытие, его цена — время
  открытия), даже если та же сцена уже на экране; первый кусок встаёт по своему `from` с первого кадра, `beat_next` ему
  не нужен. С `{cut: true}` прежний кадр держится, пока новый не нарисован, и сменяется в один кадр; без `cut` —
  затемнение. Внутри шага ту же сцену заново не открывают: дальше — только `g.beat`.
- **Склейка внутри открытой сцены** (`g.beat` куска). Кусок, у которого в scenes.md есть `after`, идёт без склейки
  после этого куска. Кусок без `after` (или после другого куска) начинается склейкой по своему `from`. Если в фильме
  сцены он не следует за тем, что играет сейчас, глава, пока играет кусок перед склейкой (или мини-игра на нём),
  ставит `g.set('beat_next', '<имя>')` — тогда кадр готов заранее. Места в §6 помечены «(`beat_next`)». После выбора
  ставится `beat_next` той ветки, что выбрана, — сразу после `g.choose`, если ветка начинается склейкой.
- Ключ, который глава ставит перед самым куском по итогу мини-игры (`heard`, `snowy`, `seen`, `torn`, `shed_left`,
  `hurt`), ставится **до** `g.beat` этого куска (его `from` и `run` его читают). Если этот кусок идёт склейкой и его
  кадр заготовлен заранее (`beat_next` поставлен до игры — заготовка сделана по ключам, какими они были тогда), то сразу
  после ключей итога глава ещё раз ставит `g.set('beat_next', '<тот же кусок>')` — модуль готовит кадр заново, уже по
  новым ключам. Так в II.6 (`heard` → `caught`), III.1 (`snowy` → `bottom`, `seen` → `club`), IV.3 (`shed_left` →
  `after_fire`). (Что повторная установка того же имени заново готовит кадр — проверить в `beats.js`: пункт для
  координатора в work.md.)
- Ждать момент сцены — только её событием. Ожидание делается **до** куска, которому момент принадлежит (если это первый
  кусок — до `g.scene`):
  ```js
  const near = g.told('enter:near');
  const enter = g.beat('enter');
  await near;
  await g.say('sarafanov', 'Похож. Честное слово, похож');
  await enter;
  ```
- Реплика — всегда вызов `g.say` с двумя **строковыми литералами**: кто и текст — буква в букву из списка §8. Никаких
  таблиц строк и склеек. Где реплику выбирает мини-игра, глава передаёт ей функции, в каждой — свой литерал.
- `at` по умолчанию — сам говорящий. Голоса из-за окон: `at` — окно (`'win1'`, `'mak_window'`). Пока открыта вставка во
  весь кадр, реплика ставится внизу: `at = 'narrator'`.
- После `g.play` глава сама ставит ключи сцены и подложки в итог — строка «после игры» в §6: пропущенная (⏭)
  мини-игра оставляет сцену и звук такими же, как сыгранная; итог идёт в историю (§7, столбец «в истории»). Где после мини-игры люди должны стоять в другом месте, следующий кусок
  начинается склейкой по своему `from` (не `after`), — тогда пропуск не оставляет их на полпути.
- Ручка звука (`march`) останавливается в конце шага и по `g.signal`. Остальные звуки — разовые и кончаются сами.
- Состояние меняют только `g.choose`, `g.apply` (через `g.scale` и `g.mark`), `g.gauge` и тихая метка итога мини-игры
  (`g.mark('knocked', value, null)`).
- Шапка каждой главы говорит, что она читает и что оставляет.

Глава: `export default { number, title, wall?: false, titles: [имена шагов], choices: [{id, weight: '⚑' | '~', title,
options: [{id, label}]}], steps: [async g => …] }`.

## 5. Состояние партии

| Поле `g.state` | Кто ставит | Кто читает |
| --- | --- | --- |
| `chapter`, `step`, `play`; рядом в сохранении — `steps` (состояние в начале каждого шага каждой главы), `seen` (сколько шагов главы увидено) | `game.js` | `game.js`, карта |
| `scales.home` (−4…7, начало 0) | `g.apply`: II.3, II.4, II.6, III.1, III.2, IV.2, IV.3 | `facts`, окно-шкала |
| `scales.lie` (−6…9, начало 0) | `g.apply`: I.2, II.3, II.4, II.6, III.1, III.2, IV.2, IV.3, V.2 | `facts`, окно-шкала |
| `shown.home`, `shown.lie` | `g.gauge`, `g.scale` | `view.gauge` |
| `choices.entry` | I.2: `asked` · `said` | `facts.entry`, карта |
| `choices.galya` | II.3: `remembered` · `never` | карта |
| `choices.box` | II.4: `take` · `refuse` | `facts.boxWhere`, карта |
| `choices.dawn` | II.6: `leave` · `stay` | карта |
| `choices.father` | III.1: `approach` · `hide` | `facts.secret`, карта |
| `choices.crossing` | III.2: `truth` · `roar` · `brother` | `facts.ninaIs`, `facts.ninaCame`, карта |
| `choices.kudimov` | IV.2: `let` · `ask` · `for_me` (третий — только при `ninaIs` `knows`) | `facts.ninaEnd`, `facts.ninaFor`, карта |
| `choices.fire` | IV.3: `blame` · `own_up` | `facts.vasyaEnd`, `facts.vasenkaBy`, `facts.silvaDoor`, `facts.vasyaCame`, карта |
| `choices.truth` | V.2: `self` · `silent` | `facts.told`, `facts.fatherCame`, концовка |
| `choices.train` | V.3: `stay` · `go` | `facts.train`, концовка |
| `marks.sarafanov` | II.4 `refuse`: `'box'` | платит выбор `box` (`boxWhere` = `cupboard`): табакерка ждёт на полке; в концовке он отдаёт её — `home_late` Р106 или в дверях вагона Р102 |
| `marks.nina` | III.2 `truth`: `'knows'`; `brother`: `'sister'` | платит выбор `crossing` (`ninaIs`): крыльцо V.1 (рука на руке / пальто возвращено / рядом, не касаясь), лестница платформы, третий вариант IV.2 |
| `marks.nina_stay` | IV.2 `ask`: `'father'`; `for_me`: `'me'` | платит выбор `kudimov` (`ninaEnd`, `ninaFor`): Нина дома в концовке; при `for_me` — она за столом рядом с ним (на платформу её приводит правда — `ninaCame`) |
| `marks.vasenka` | IV.3: `'saved'` · `'confessed'` | платит выбор `fire` (`vasenkaBy`, `vasyaEnd`) |
| `marks.silva` | IV.3 `blame`: `'grudge'` | платит выбор `fire` (`silvaDoor`) |
| `marks.knocked` | I.1, итог «Окон»: строка номеров окон, `''`…`'12345'` (тихо) | `facts.knocked` → Улица `knocked`: в `evening` эти окна тёмные |

Метку платит выбор, который её поставил: проверка веток (§11) ищет у каждой метки читателя в `facts` — саму метку или
её выбор. Тихая метка итога мини-игры (`knocked`) читается в `facts` сама. (Лужица «Чая» метки не требует: вопрос
переливает всегда, лужица в `box_out` есть всегда — §7 «Чай».)

```js
export const SCALES = {
  lie: { start: 0, min: -6, max: 9, up: 'Ложь', down: 'Правда',
    rule: 'Иней на стекле — сколько неправды в доме.' },
  home: { start: 0, min: -4, max: 7, up: 'Вместе', down: 'Врозь',
    rule: 'Свет в окне — держится ли семья Сарафановых вместе.' },
};
export const EFFECTS = {
  entry: { asked: { lie: 1 }, said: { lie: 2 } },
  galya: { remembered: { home: 1, lie: 1 }, never: { home: -1 } },
  box: { take: { home: 1, lie: 1 },
    refuse: { home: -1, lie: -1, marks: [['sarafanov', 'box', 'Сарафанов это запомнит.']] } },
  dawn: { leave: { home: -1 }, stay: { home: 1, lie: 1 } },
  father: { approach: { home: 1, lie: 1 }, hide: {} },
  crossing: { truth: { lie: -2, marks: [['nina', 'knows', 'Нина это запомнит.']] }, roar: { lie: -1 },
    brother: { home: 1, lie: 1, marks: [['nina', 'sister', 'Нина это запомнит.']] } },
  kudimov: { let: { home: -1 },
    ask: { home: 1, lie: 1, marks: [['nina_stay', 'father', 'Нина это запомнит.']] },
    for_me: { home: 1, marks: [['nina_stay', 'me', 'Нина это запомнит.']] } },
  fire: { blame: { home: 1, lie: 1, marks: [['silva', 'grudge', null],
      ['vasenka', 'saved', 'Сильва и Васенька это запомнят.']] },
    own_up: { lie: -1, marks: [['vasenka', 'confessed', 'Васенька это запомнит.']] } },
  truth: { self: { lie: -3 }, silent: { lie: -1 } },
  train: { stay: {}, go: {} },
};
export const ENDINGS = [
  { id: 'late', label: 'Опоздал на электричку' }, { id: 'saturday', label: 'В субботу' },
  { id: 'anyway', label: 'Всё равно' }, { id: 'suitcase', label: 'Чемодан' },
];
const clamp = x => Math.round(Math.min(1, Math.max(0, x)) * 100) / 100;   // до сотых: умолчание сцены — простое число
export function facts(state) {
  const c = state.choices, s = state.scales;
  const told = c.truth === 'silent' ? 'silva' : 'self';
  const train = c.train === 'go' ? 'go' : 'stay';
  // кто приходит за ним на платформу (V.3): по «Вместе» — вся семья, один отец, никто; и, при любой шкале, те, кого он
  // сам связал правдой, — знают, кто он: отец, если сказал ему сам; Нина, если знает от него; Васенька, если признался сам
  const came = s.home >= 3 ? 'family' : s.home >= 0 ? 'father' : 'none';
  const ninaIs = c.crossing === 'truth' ? 'knows' : c.crossing === 'brother' ? 'sister' : 'none';
  const fatherCame = came !== 'none' || told === 'self';
  const ninaCame = came === 'family' || ninaIs === 'knows';         // («Не ради отца» и есть только при этом)
  const vasyaCame = came === 'family' || c.fire === 'own_up';
  const boxWhere = c.box === 'take' ? 'busygin' : 'cupboard';
  const boxHand = boxWhere === 'cupboard' && fatherCame && came !== 'family'; // в дверях вагона — не при всей семье
  const hurt = told === 'silva' || s.lie > 1;                       // читается после V.2 (шкала уже сдвинута)
  return {
    warm: clamp((s.home + 4) / 11),                    // 0 Врозь … 1 Вместе
    frost: clamp((s.lie + 2) / 8),                     // 0 чистое стекло … 1 всё в инее (полупрозрачном)
    entry: c.entry === 'said' ? 'said' : 'asked',      // кто соврал у двери
    boxWhere,                                          // 'cupboard' | 'busygin'
    ninaIs,                                            // 'knows' | 'sister' | 'none'
    secret: c.father === 'approach',                   // Бусыгин обещал отцу молчать про оркестр
    told,                                              // 'self' | 'silva'
    train,                                             // 'stay' | 'go'
    came,                                              // по «Вместе»: 'none' | 'father' | 'family'
    fatherCame, ninaCame, vasyaCame,                   // кто стоит на лестнице платформы (V.3) и входит с ним в дом
    hurt,
    // фраза кларнета: 'now' — в доме сразу; 'later' — в эпилоге, издали; 'cut' — обрывается, как всегда.
    // Разрешается, где он остался и за ним кто-то пришёл: сразу — где дом держится и неправды было немного; позже —
    // после долгой лжи или где привела только правда (дом весь вечер был холодным: тепло после правды приходит не сразу).
    tune: train === 'go' || !(fatherCame || ninaCame || vasyaCame) ? 'cut' : hurt || came === 'none' ? 'later' : 'now',
    silvaDoor: c.fire !== 'blame',
    vasenkaBy: c.fire === 'blame',
    suitcase: told === 'silva' && came !== 'none',
    boxHand,
    boxGone: train === 'go' && ((boxWhere === 'busygin' && told === 'silva') || boxHand), // табакерка уехала с ним
    ninaEnd: c.kudimov === 'ask' || c.kudimov === 'for_me' ? 'home' : 'gone',
    ninaFor: c.kudimov === 'for_me',
    knocked: state.marks.knocked ?? '',                // окна, в которые стучал (итог «Окон»)
    vasyaEnd: c.fire === 'own_up' ? 'home' : 'taiga',
    ending: told === 'self' ? (train === 'stay' ? 'late' : 'saturday') : (train === 'stay' ? 'anyway' : 'suitcase'),
  };
}
```

Пропущенный автором шаг не оставляет выбора: `facts` даёт тогда значения по умолчанию, написанные выше (у двери —
Сильва, табакерка на полке, Нина не знает, правду говорит сам, остаётся). На полной партии каждая концовка
достижима при любом `came`: `home` двигают семь выборов, а концовку — два других. `lie` до V.2 может дойти до 9 (поэтому
`max` 9): после «Промолчать» — 8. Сказал сам — отец на платформе всегда («Опоздал», «В субботу»); никого — только после
слов Сильвы, при холодном доме, без правды Нине и без признания Васеньки.

**Состояние → ключи партии сцен** (`carry`):

| Сцена | Ключи |
| --- | --- |
| Платформа | `father_came: f.fatherCame ? 1 : 0`, `nina_came: f.ninaCame ? 1 : 0`, `vasya_came: f.vasyaCame ? 1 : 0`, `silva_door: f.silvaDoor ? 1 : 0`, `nina_is: f.ninaIs`, `suitcase: f.suitcase ? 1 : 0`, `box_hand: f.boxHand ? 1 : 0`, `warm: f.warm`, `frost: f.frost`, `vasya_end: f.vasyaEnd` |
| Улица | `warm: f.warm`, `frost: f.frost`, `nina_is: f.ninaIs`, `secret: f.secret ? 1 : 0`, `silva_door: f.silvaDoor ? 1 : 0`, `ending: f.ending`, `nina_end: f.ninaEnd`, `nina_for: f.ninaFor ? 1 : 0`, `knocked: f.knocked` |
| Дом Сарафановых | `warm: f.warm`, `frost: f.frost`, `box_where: f.boxWhere`, `vasenka_by: f.vasenkaBy ? 1 : 0`, `silva_door: f.silvaDoor ? 1 : 0`, `father_came: f.fatherCame ? 1 : 0`, `nina_came: f.ninaCame ? 1 : 0`, `vasya_came: f.vasyaCame ? 1 : 0`, `nina_end: f.ninaEnd`, `nina_for: f.ninaFor ? 1 : 0`, `vasya_end: f.vasyaEnd` |
| Косогор, Переезд, Состав | — |

**Кто пришёл на платформу и как** (`last`, `stays`, `boards`, `away`, `glass` — по ключам): `father_came`, `nina_came`,
`vasya_came` — кто на лестнице (каждый — сам по себе; вместо прежнего `came`). Кого привела правда — знает, кто он, и это
видно по ключам, что уже есть: Нина впереди (`nina_is` `knows`), Васенька без рюкзака (`vasya_end` `home` — признался
сам), отец без чемодана (`suitcase` 0 — правду сказал сам). Кто первый — у того «Остаться»: отец, иначе Нина, иначе
Васенька, иначе далёкое окно. **Дом** (`home_late`, `home_anyway`): с ним входят те, кто пришёл (те же три ключа; отец в
`home_anyway` не пришёл — он дома у окна); Нина рядом с ним за столом — `nina_for`; её стул пуст — `nina_end` `gone`
(пришла на платформу, а потом уехала с Кудимовым).

`hurt` — не ключ партии: его ставит V.2 перед `confess` (`g.set('hurt', …)`), когда шкала уже сдвинута. Так же перед
своими кусками глава ставит ключи итогов мини-игр: `heard`, `snowy`, `seen`, `torn`, `shed_left`; `late_run` идёт в
состоянии `g.scene` платформы в V.3.

**«Партия как…»** (`PLAYS` в `game.js`; состояние на шаге — шаги до него, сыгранные невидимо):

| Набор | entry | galya | box | dawn | father | crossing | kudimov | fire | truth | train | → `home` / `came` / на лестнице |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Опоздал — вся семья | asked | remembered | take | stay | approach | truth | for_me | blame | self | stay | 6 / family / все |
| Опоздал — честно, пришли по правде | asked | never | refuse | leave | hide | truth | for_me | own_up | self | stay | −2 / none / все трое по правде (`lie` −6; кларнет — позже, в эпилоге) |
| В субботу — по правде, табакерка в дверях | said | never | refuse | leave | hide | truth | let | own_up | self | go | −4 / none / все трое по правде |
| В субботу — отец и Васенька, табакерка в дверях | said | remembered | refuse | leave | hide | roar | ask | own_up | self | go | 0 / father / отец, Васенька |
| Всё равно — отец | asked | never | take | leave | approach | roar | let | blame | silent | stay | 0 / father / отец |
| Всё равно — Нина и Васенька, по правде | asked | never | refuse | leave | hide | truth | let | own_up | silent | stay | −4 / none / Нина, Васенька (кларнет — позже) |
| Чемодан — отец | asked | never | take | leave | approach | roar | let | blame | silent | go | 0 / father / отец |
| Чемодан — никто | said | never | refuse | leave | hide | roar | let | blame | silent | go | −3 / none / никто |

## 6. Главы по шагам

Запись: **сцена** · `кусок` · Рnn — реплика из §8 (там её текст и кто говорит; «у X» — где стоит пузырь, если не над
говорящим) · *момент*, по которому она говорится. «Сразу» — реплика говорится с началом куска, не дожидаясь его конца.
«(`beat_next`)» — перед куском, который идёт до этой склейки, глава ставит `g.set('beat_next', '<этот кусок>')`.
Подложки — полный набор шага; остальные звуки — §8.

### Пролог — `prologue.js` (`number: ''`, `title: 'Пролог'`, без выборов)

Перед ним `game.js` показывает карту партии (§3.4): первое касание — «Начать» на указателе пролога, звук просыпается.

1. **Платформа.** `g.beds({wind: 0.4, train: 0.5})`. **Платформа** · `gone` (из темноты). Касание:
   `g.choose(null, {'train#tail': [{id: 'call', label: 'Окликнуть'}]})` — на 14–16-й секунде от начала: первое касание
   вещи в сцене (кольцо и лепесток со словом); пока игрок не коснулся, электричка ползёт дальше (scenes.md `gone`).
   `wave`; сразу `g.sound.horn(0.7)` (электричка отвечает),
   `g.beds({wind: 0.4}, 6)`; по *`wave:dark`* — `g.title('Старший сын')` (не ждать). `stand`; по *`stand:cold`* —
   Р01, Р02, Р03. Дальше без титула — глава I.

**Первые 30 секунд:** 0–3 с — станция и вагоны карты, касание «Начать»; 3–5 с — из темноты платформа, электричка стоит, вот-вот
тронется; 8 с — двое взбегают по лестнице, электричка трогается вправо; 12 с — встают под фонарём; 15 с — первое
касание в сцене (хвостовые огни); 17 с — гудок в ответ; 26 с — название.

### Глава I «Чужие окна» — `1.js` (`number: 'I'`, `wall: false`)

`titles`: Окна, У двери, Руки, Сарафанов. `choices`: `{id: 'entry', weight: '⚑', title: 'У двери', options: [{id:
'asked', label: 'Попроситься на ночь'}, {id: 'said', label: '«Я его сын»'}]}`. Оставляет: `choices.entry`,
`scales.lie`, `shown.lie`, `shown.home`.

1. **Окна.** `g.beds({wind: 0.5})`. **Улица** · `walk`, склейкой (`{cut: true}` — из пролога, время не прошло). По
   *`walk:stop`* (встали, горящие окна перед ними) — Р04. `knock_ready`. `g.play(okna, {refuse: [ref => g.say('neighbor_m', 'Иди, иди отсюда!', ref), ref =>
   g.say('neighbor_w', 'Ночь на дворе! Милицию позову!', ref), ref => g.say('neighbor_old', 'Нету никого. Спят все',
   ref)]})` (Р05–Р07); `g.set('beat_next', 'last_window')` — до игры. После игры: `win1…win5` = 0, `knock` = 0, `snow` = 0.7
   (за 2 с); `g.mark('knocked', r.knocked.join(''), null)`;
   `last_window` (склейкой по своему `from`: окна тёмные, двое посреди улицы, идут к углу); по *`last_window:corner`* —
   Р08.
2. **У двери.** `g.beds({wind: 0.5})`. **Улица** · `neighbor`, открытием той же сцены без затемнения (`{cut: true}`:
   тот же угол, время не прошло);
   по *`neighbor:knock`* — `g.sound.knock()`; по *`neighbor:answer`* — Р09, Р10 (у `'mak_window'`); по
   *`neighbor:vasya`* — `g.sound.door()`. `porch`; сразу Р11, Р12; по *`porch:knock`* — `g.sound.knock()`; по
   *`porch:open`* — `g.sound.door()`, Р13. Выбор `entry`: `{vasenka: [{id: 'asked', label: 'Попроситься на ночь'}],
   kitchen: [{id: 'said', label: 'Сказать: «Я его сын»'}]}`. Сразу после выбора — `g.gauge('lie')` (окно-шкала
   появляется: стекло, иней, лампа пока не горит; правило), потом `g.apply('entry')`.
   - `asked`: Р14; `shut`; сразу Р15; по *`shut:closed`* — `g.sound.door()`, Р16; по *`shut:knock`* —
     `g.sound.knock()`; по *`shut:again`* — `g.sound.door()`, Р17.
   - `said`: Р18.

   Обе: `in`; сразу Р19.
3. **Руки.** `g.beds({room: 0.4, clock: 0.3})`. **Дом** · `kitchen`, склейкой; сразу `g.sound.door()`. Кусок кончается
   вставкой `hands`. `g.play(ruki)`. После игры: `thaw` = 1, `rub` = 0. `warm_up`; по *`warm_up:turn`* — Р20, Р21.
4. **Сарафанов.** `g.beds({wind: 0.4})`. **Улица** · `return`; по *`return:door`* — `g.sound.door()`.
   `g.beds({room: 0.4, clock: 0.5}, 1)`; **Дом** · `enter`, склейкой; по *`enter:in`* — Р22, Р23, `g.wait(2000)` (часы),
   Р24; по *`enter:near`* — Р25. `embrace`; по *`embrace:held`* — `g.gauge('home')` (в окне-шкале загорается лампа;
   правило).

### Глава II «Табакерка» — `2.js` (`number: 'II'`)

`titles`: Нина, Ужин, Галя, Табакерка, Кларнет, Рассвет. `choices`: `{id: 'galya', weight: '~', title: 'Галя',
options: [{id: 'remembered', label: '«Помнила»'}, {id: 'never', label: '«Не рассказывала»'}]}`, `{id: 'box', weight:
'⚑', title: 'Табакерка', options: [{id: 'take', label: 'Взять'}, {id: 'refuse', label: 'Не брать'}]}`, `{id: 'dawn',
weight: '⚑', title: 'Рассвет', options: [{id: 'leave', label: 'Уйти тайком'}, {id: 'stay', label: 'Остаться'}]}`.
Оставляет: `choices.galya`, `.box`, `.dawn`, `marks.sarafanov`, шкалы.

1. **Нина.** `g.beds({wind: 0.3})`. **Улица** · `gate`; по *`gate:watch`* — Р26, Р27. `g.beds({room: 0.4, clock: 0.4},
   1)`; **Дом** · `nina_in`, склейкой; по *`nina_in:door`* — Р28, Р29.
2. **Ужин.** `g.beds({room: 0.4, clock: 0.3})`. **Дом** · `supper`; по *`supper:toast`* — Р30; касание: `g.choose(null,
   {'table#glass': [{id: 'clink', label: 'Чокнуться'}]})`; по касанию — `g.sound.glass()`. `supper_after`; сразу Р31.
3. **Галя.** `g.beds({room: 0.3, clock: 0.5})`. **Дом** · `talk` (из темноты); сразу Р32. Кусок кончается вставкой
   `tea`.    `let asked = false`; `const r = await g.play(chai, {ask: () => { asked = true; return g.say('sarafanov', 'Она меня…
   вспоминала?', 'narrator'); }})` (Р33); если `!asked` — `await g.say('sarafanov', 'Она меня… вспоминала?',
   'narrator')`. После игры: `glass1` = `glass2` = 1, `pour` = 0, `shake` = 0, `which` = 1, `spill` = 1 (вопрос
   переливает всегда; пропуск — тот же след), `g.sound.pour(0, 0.3)`. `talk_back`.
   Выбор `galya`: `{sarafanov: [{id: 'remembered', label: '«Помнила»'}, {id: 'never', label: '«Не рассказывала»'}]}`.
   `g.apply('galya')`.
   - `remembered`: Р34; `galya_yes`.
   - `never`: Р35; `galya_no`.
4. **Табакерка.** `g.beds({room: 0.3, clock: 0.5})`. **Дом** · `box_out`, открытием той же сцены без затемнения
   (`{cut: true}`: та же ночь, тот же стол; лужица на клеёнке — всегда); по *`box_out:down`* — Р36, Р37. Выбор `box`: `{'table#box': [{id: 'take', label: 'Взять'}, {id: 'refuse',
   label: 'Не брать'}]}`. `g.apply('box')`.
   - `take`: `box_take` (кончается вставкой). `g.play(tabakerka, {mode: 'take'})`. После игры: `finger1…finger4` = 1,
     `old` = 0. `box_kept`; по *`box_kept:back`* — Р38.
   - `refuse`: Р39; `box_give` (кончается вставкой). `g.play(tabakerka, {mode: 'give'})`. После игры: `push` = 1,
     `old_close` = 1. `box_back`; по *`box_back:shelf`* — Р40.
5. **Кларнет.** `g.beds({clock: 0.25})`. **Дом** · `wall` (из темноты); сразу Р118 (у `'silva'`, из темноты дивана);
   по *`wall:dark`* — `g.sound.clarinet({times: 2})` (хэндл: гасится в конце шага и при уходе из него; в V.4 и эпилоге — при уходе); по *`wall:turn`* — Р41.
6. **Рассвет.** `g.beds({clock: 0.4, rails: 0.3})`. **Дом** · `wake` (из темноты); по *`wake:up`* — Р42. Выбор `dawn`:
   `{'cot_chair#coat': [{id: 'leave', label: 'Уйти тайком'}], cot: [{id: 'stay', label: 'Остаться'}]}`.
   `g.apply('dawn')`.
   - `leave`: `sneak`. `g.beds({rails: 0.3}, 1)` (часы тикает сама мини-игра). `g.set('beat_next', 'caught')`;
     `g.play(tsypochki)`. После игры: `sneak` = 1, `stir` = 0, `heard` = `r.creaks > 0 ? 1 : 0`, ещё раз
     `g.set('beat_next', 'caught')` (§4), `g.beds({clock: 0.4, rails: 0.3}, 1)`. `caught`
     (склейкой по своему `from`: оба у входной двери); по *`caught:face`* — Р43, Р44, Р45; по *`caught:hook`* — Р48;
     по *`caught:out`* — `g.sound.door()`.
   - `stay`: `window_watch`; сразу Р46. `g.play(inei)`. После игры: `far_train` = 1, `hole` = max(`r.hole`, 0.4),
     `g.beds({clock: 0.4, rails: 0.3}, 1)`. `morning`; по *`morning:in`* — Р47, Р48; по *`morning:out`* —
     `g.sound.door()`.

   Обе: после куска — Р49.

### Глава III «Марш» — `3.js` (`number: 'III'`)

`titles`: Отец, Переезд. `choices`: `{id: 'father', weight: '~', title: 'Отец на косогоре', options: [{id: 'approach',
label: 'Подойти к нему'}, {id: 'hide', label: 'Уйти незаметно'}]}`, `{id: 'crossing', weight: '⚑', title: 'Переезд',
options: [{id: 'truth', label: 'Сказать правду'}, {id: 'roar', label: 'Сказать под грохот'}, {id: 'brother', label:
'«Брат»'}]}`. Оставляет: `choices.father`, `.crossing`, `marks.nina`, шкалы.

1. **Отец.** `g.beds({wind: 0.3})`. **Косогор** · `road`; сразу Р50, Р51. `march`; сразу `const m = g.sound.march()`,
   `g.wait(3000)`, Р52, Р53, Р54; по *`march:end`* — `m.stop(3)`. `alone`. Выбор `father`: `{sarafanov: [{id:
   'approach', label: 'Подойти к нему'}], nina: [{id: 'hide', label: 'Уйти незаметно'}]}`. `g.apply('father')`.
   - `approach`: `meet`; по *`meet:talk`* — Р55, Р56, Р57. `g.set('beat_next', 'bottom')`; `g.play(podRuku)`. После
     игры: `down` = 1, `catch` = 0, `fall` = 0, `snowy` = `r.falls > 0 ? 1 : 0`, ещё раз `g.set('beat_next',
     'bottom')` (§4). `bottom` (склейкой по своему `from`: оба
     у ворот); сразу Р58.
   - `hide`: `hide`. `g.set('beat_next', 'club')`; `g.play(sledom)`. После игры: `seen` = `r.seen > 0 ? 1 : 0`
     (остальное ставит `from` куска `club`), ещё раз `g.set('beat_next', 'club')` (§4). `club` (склейкой); по *`club:in`* — `g.sound.dance(3)`, потом Р59.

   В конце шага `m.stop(0)` (если ещё играет).
2. **Переезд.** `g.beds({wind: 0.3, crossing: 0.6})`. **Переезд** · `wait`; по *`wait:light`* — Р60, Р61. Выбор
   `crossing`: `{nina: [{id: 'truth', label: 'Сказать правду'}], 'freight#light': [{id: 'roar', label: 'Сказать под
   грохот'}], barrier: [{id: 'brother', label: 'Ответить: «Брат»'}]}`. `g.apply('crossing')`.
   - `truth`: `truth`; по *`truth:said`* — Р62, потом `g.beds({crossing: 0.6, freight: 1}, 4)`; по *`truth:passed`* —
     `g.beds({wind: 0.3}, 3)`, Р63.
   - `roar`: `roar`; сразу `g.beds({crossing: 0.6, freight: 1}, 4)`; по *`roar:loud`* — Р64, Р65, Р66 (голос не
     приглушает грохот: Р64 почти не слышно — так и задумано); по *`roar:passed`* — `g.beds({wind: 0.3}, 3)`.
   - `brother`: `brother`; сразу Р67; по *`brother:arm`* — `g.beds({crossing: 0.6, freight: 1}, 4)`; по
     *`brother:passed`* — `g.beds({wind: 0.3}, 3)`, Р68.

### Глава IV «Пожар» — `4.js` (`number: 'IV'`)

`titles`: Рюкзак, Жених, Пожар. `choices`: `{id: 'kudimov', weight: '~', title: 'Жених', options: [{id: 'let', label:
'«Пусть едет»'}, {id: 'ask', label: '«Нина, останься»'}, {id: 'for_me', label: '«Останься. Не ради отца»'}]}`, `{id:
'fire', weight: '⚑', title: 'Пожар', options: [{id: 'blame', label: 'Взять на себя'}, {id: 'own_up', label: 'Пусть
скажет сам'}]}`. Читает: `facts.ninaIs`. Оставляет: `choices.kudimov`, `.fire`, `marks.nina_stay`, `.vasenka`,
`.silva`, шкалы.

1. **Рюкзак.** `g.beds({wind: 0.2, rails: 0.3})`. **Платформа** · `bench`; по *`bench:sit`* — Р69, Р70. `strap`; сразу
   `g.beds({wind: 0.2, train: 0.6}, 2)`; по *`strap:open`* — `g.sound.doors()`. Кусок кончается вставкой `strap`.
   `g.play(ryukzak)`. После игры: `pull` = 0, `grip` = 1, `door_bg` = 1, `torn` = `r.slips >= 2 ? 1 : 0`. `bench_back`; сразу `g.beds({wind: 0.2}, 6)`;
   по *`bench_back:sat`* — Р71.
2. **Жених.** `g.beds({room: 0.4, clock: 0.4})`. **Дом** · `table` (из темноты); сразу Р72; по *`table:nine`* —
   `g.sound.strike(9)` (не ждать); по *`table:in`* — `g.sound.door()`, Р73; по *`table:sat`* — Р74. `toast`; по
   *`toast:news`* — Р75, Р76; по *`toast:turn`* — Р77. Выбор `kudimov`: `{kudimov: [{id: 'let', label: '«Пусть едет»'}],
   sarafanov: [{id: 'ask', label: '«Нина, останься»'}]}`; при `f.ninaIs === 'knows'` ещё `nina: [{id: 'for_me',
   label: '«Останься. Не ради отца»'}]` (на ней самой). `g.apply('kudimov')`.
   - `let`: Р78; `let_go`; по *`let_go:glass`* — Р79.
   - `ask`: Р80; `ask_stay`; по *`ask_stay:stand`* — Р81.
   - `for_me`: Р116; `for_me`; по *`for_me:stand`* — Р117.
3. **Пожар.** `g.beds({wind: 0.3})`. **Улица** · `evening` (из темноты; окна соседей — по `knocked`); по *`evening:in`* —
   `g.sound.door()` (Р82 убрана: рассказчик говорит только виденное, а Васенька на крыльце виден сам).
   `fire`; сразу `g.beds({wind: 0.3, fire: 0.6, crowd: 0.5}, 2)`; по *`fire:cry`* — Р83. `g.set('beat_next',
   'after_fire')`; `g.play(vyodra)`. После игры: `g.set('fire', 0, 3)`, `vyodra` = `none` (ведро — прочь),
   `shed_left` = `r.buckets >= 3 ? 1 : 0`, ещё раз `g.set('beat_next', 'after_fire')` (§4), `g.beds({wind: 0.3,
   crowd: 0.3}, 3)`. `after_fire` (склейкой по своему `from`); по *`after_fire:who`* — Р84. Выбор
   `fire`: `{makarskaya: [{id: 'blame', label: 'Взять на себя'}], vasenka: [{id: 'own_up', label: 'Пусть скажет
   сам'}]}`. `g.apply('fire')`.
   - `blame`: `blame`; по *`blame:step`* — Р85, Р86.
   - `own_up`: `own_up`; по *`own_up:said`* — Р87, `g.wait(2000)`, Р88.

### Глава V «Старший сын» — `5.js` (`number: 'V'`)

`titles`: Крыльцо, Правда, Последняя, Дом. `choices`: `{id: 'truth', weight: '⚑', title: 'Правда', options: [{id:
'self', label: 'Сказать самому'}, {id: 'silent', label: 'Промолчать'}]}`, `{id: 'train', weight: '⚑', title:
'Последняя', options: [{id: 'stay', label: 'Остаться'}, {id: 'go', label: 'Войти в вагон'}]}`. Читает: `facts`
(`ninaIs`, `secret`, `entry`, `boxWhere`, `fatherCame`, `ninaCame`, `vasyaCame`, `silvaDoor`, `boxHand`, `told`, `hurt`,
`train`, `tune`, `ending`). Оставляет:
`choices.truth`, `.train`. После главы карты нет (§3.5); эпилог `wall: false`.

1. **Крыльцо.** `g.beds({wind: 0.3})`. **Улица** · `porch_night`; по *`porch_night:sat`* — если `f.secret` — Р115, Р57;
   потом `f.ninaIs === 'knows'` ? Р89 : Р90 (Р89 остаётся без ответа — так задумано: его ответ — выбор V.2); потом Р91. `shawl` (кончается вставкой). `g.play(palto)`. После игры:
   `lay` = 1. `porch_after`.
2. **Правда.** `g.beds({room: 0.3, clock: 0.5})`. **Дом** · `pack` (из темноты); сразу Р92; по *`pack:case`* — Р93,
   Р94; по *`pack:silva`* — Р95. Выбор `truth`: `{sarafanov: [{id: 'self', label: 'Сказать самому'}], silva: [{id:
   'silent', label: 'Промолчать'}]}`. `g.apply('truth')`.
   - `self`: `g.set('hurt', facts(g.state).hurt ? 1 : 0)`; `confess`; по *`confess:said`* — Р96; по
     *`confess:sarafanov`* — Р99.
   - `silent`: `exposed`; по *`exposed:said`* — `f.entry === 'asked'` ? Р97 : Р98; по *`exposed:window`* — Р99.

   `go_out`; по *`go_out:gone`* — `g.sound.door()`.
3. **Последняя.** `g.beds({wind: 0.5})`. **Улица** · `run_out`, склейкой (`{cut: true}`: та же минута). `const r =
   await g.play(begom)`. После игры: `run` = 1, `look_back` = 0. `g.beds({wind: 0.5, train: 0.6}, 1)`; **Платформа** ·
   `last`, склейкой (`g.scene(SCENES.platform, {beat: 'last', late_run: r.looks >= 2 ? 1 : 0}, {cut: true})`); по
   *`last:open`* — `g.sound.doors()`, если `f.silvaDoor` — Р100; по *`last:came`* — если `f.fatherCame` — Р101,
   иначе если `f.ninaCame` — Р119 (Васенька, пришедший один, молчит). Выбор `train`: `{'train#door': [{id: 'go', label:
   'Войти в вагон'}], [f.fatherCame ? 'sarafanov' : f.ninaCame ? 'nina' : f.vasyaCame ? 'vasenka' : 'far_window']:
   [{id: 'stay', label: 'Остаться'}]}`. `g.apply('train')`. Кто на лестнице — §5 «Кто пришёл на платформу и как».
   - `stay`: `stays`; по *`stays:gone`* — `g.beds({wind: 0.4}, 4)`.
   - `go`: `boards`; по *`boards:box`* — если `f.boxHand` — Р102; по *`boards:in`* — `g.sound.doors()`. `glass`.
     `g.play(steklo)`. После игры: `wipe` = max(`r.wipe`, 0.3) (видно столько, сколько протёр). `away`; сразу `g.beds({train: 0.8}, 2)`; по *`away:wave`* —
     если `f.told === 'self'` (тогда отец на платформе всегда) — Р103.
4. **Дом.** Только если `f.train === 'stay'`; иначе шаг сразу кончается. `g.beds({room: 0.4, clock: 0.5})`.
   - `f.told === 'self'`: **Дом** · `home_late` (из темноты); по *`home_late:sat`* — Р104, Р105; по *`home_late:box`* —
     если `f.boxWhere === 'cupboard'` — Р106; по *`home_late:room`* — `f.tune === 'now'` ? `g.sound.clarinet({times: 1,
     resolve: true})` — фраза впервые идёт дальше и разрешается (≈ 14 с; кончится сама, уже в эпилоге) :
     `g.sound.clarinet({times: 1})` — обрывается, как всегда: `later` — неправды было много или за ним пришли только по
     правде (дом весь вечер был холодным): сразу не заживает, разрешится позже, в эпилоге. (`cut` здесь не бывает:
     сказал сам — отец пришёл.)
   - `f.told === 'silva'`: **Дом** · `home_anyway` (из темноты); по *`home_anyway:turn`* — Р107.

### Эпилог — `epilogue.js` (`number: ''`, `title: 'Эпилог'`, `wall: false`, без выборов; шкалы скрыты)

1. **Окно.** `g.beds({wind: 0.4, rails: 0.2})`. **Улица** · `night_window` (из темноты); по *`night_window:held`* —
   кларнет за окном по `f.tune`: `later` — `g.sound.clarinet({times: 1, resolve: true, far: true})` (остался, и за ним
   пришли — после долгой лжи или только по правде, — фраза разрешается позже и издали); `cut` —
   `g.sound.clarinet({times: 1, far: true})` (обрывается, как всегда: уехал — или остался после слов Сильвы, и не пришёл
   никто); `now` — ничего (она уже прозвучала в доме). По `f.ending`:
   `saturday` — Р108; `suitcase` — Р109. Если `f.boxGone` — Р110. Что стало с Ниной и Васенькой, рассказчик не
   говорит — это видно: Нина в окне или её нет (scenes.md `night_window`), Васенька на рассвете уезжает первой
   электричкой или платформа пуста (`dawn`).
2. **Рассвет.** `g.beds({wind: 0.2, train: 0.6}, 2)`. **Платформа** · `dawn` (по `vasya_end` из `carry`); по
   *`dawn:pass`* — `g.sound.horn(0.8)`; по *`dawn:open`* и *`dawn:shut`* (их сцена говорит только при `vasya_end`
   `taiga`) — `g.sound.doors()`. После куска — `g.beds({wind: 0.2}, 6)`.

Потом `game.js` — карта партии, вид на финал: концовки, достигнутая горит (§3.4–3.5).

## 7. Мини-игры — на языке мини-игр

Каждая мини-игра — код игры на **языке мини-игр** (решение владельца): `moood-me/moood:docs/games/minigames.md` и
`moood-me/moood:docs/games/miniux/language.md` (читать в `origin/main`), API — головы файлов `moood/web/site/bespoke/minigame/`; как этим
пользуются — мини-игры «Алых парусов v3» и их `hands.js` (`until`, `once`, `keys`), который берётся в каркас как есть.

```js
import { until, once, keys } from '../hands.js';
export default {
  title: 'Окна',                          // как её зовёт ☰ автора
  about: 50,                              // сколько она обычно длится, с — для проверки веток (по правилам ниже)
  skipped: { knocked: [] },               // итог, если её пропустили (⏭), — обычный, той же формы
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Ночь. В посёлке ещё горит свет — в пяти окнах' });
    …                                     // метки, жесты, отклики языка; ключи сцены — keys(g)
    await mg.end({ as: 'clean' });        // clean | flawed | neutral
    return result;
  },
};
```

Общее для всех тринадцати (автор мини-игры читает ещё §4 и таблицу звуков §8):

- **Четыре строки** (minigames.md §1) — что делает Бусыгин, чего хочет, в каком он состоянии, что должен чувствовать
  игрок — написаны в разделе каждой мини-игры ниже; жест выбран под них.
- **Всё видимое делает сцена** своими ключами (`keys(g)` — шлёт ключ, когда он изменился больше чем на 0.01). Своего
  на экране у игры — только язык: метки, свечение вещи, плашка, призрачный палец. Своих подсказок (`g.hint`), кнопок
  и css у мини-игр нет.
- **Фраза плашки** — одна строка, как ремарка Вампилова: настоящее время, сухо, коротко, с тихой усмешкой; говорит,
  что происходит с вещью и что на кону; без «ты», без приказов, без умиления; только то, что показывает сцена. Фразы —
  в разделах ниже, буква в букву.
- **Метки — только на точках сцены** из таблицы (scenes.md: они в средних 4:3, не в углах, не внизу, не под
  плашкой). Видимая метка ≥ 44 px, касание — круг ≥ 64 px (это делает язык). Один палец; нажатие и ведение с
  нажатием; **клавиш нет**, наведения нет.
- **Как играть, показывает призрачный палец** (`b.minigame.tricks.teach`): при первой встрече с жестом за партию и
  когда игрок замер. Слов-подсказок нет.
- **⏭ — страховка, не путь**: с 2026-10-21 ⏭ — страницы (`games.md` §5): в мини-игре увиденного шага — сразу, в
  неувиденной — через 20 с (`SKIPPABLE`, часы партии); нажатие — `b.minigame.skip()` → `signal` → итог `skipped`. Пропущенная
  мини-игра оставляет в истории тот же след, что сыгранная (`skipped` — обычный итог; глава после игры ставит те же
  ключи). Кнопки «Дальше» нет. Каждая мини-игра проходима сама по себе: ошибка стоит секунд, ничто в сцене не
  запирается, — ⏭ на это не рассчитывает.
- **Ошибка** — `mg.error(причина, {at})` по таблице языка (§5): тихо, с причиной на месте; проигрыша нет.
- **Умение или выбор.** Умение (Руки, Чай — первый стакан, Табакерка, На цыпочках, Под руку, Следом, Рюкзак, Вёдра, Пальто, Стекло)
  доводит до конца игрок — само ничего не доделывается; кроме того, что сцена делает своим ходом и что названо (двери
  закрываются, соседи тушат, поезд трогается). Где руками выбирают (Окна — стучать или ждать; Иней — тереть или
  смотреть; Бегом — бежать или оглядываться), отклик нейтральный, второй путь виден с начала, конец `neutral`.
- **Камера** под жестом на точке стоит; под жестами где угодно (Под руку, Следом, Бегом) может ехать.
- Сцену мини-игра слушает только через `g.told`: ожидание ставится до причины и заново после каждого раза.
  Где сейчас человек — ключ сцены `…_at`; где сейчас то, что двигает игра, она помнит сама.
- По `signal` язык уходит сам; мини-игра убирает свои таймеры, возвращает подложки, которые
  поднимала.
- Реплик своих нет (их даёт глава через `opts`); `g.state` не трогает; звуки — из `g.sound` (звуки языка — его).
- Время — `mg.t` и кадры языка (на паузе стоят).
- **Итог — в историю** (minigames.md: «The outcome matters»). Что руки сделали, видно потом: глава сразу после игры
  ставит ключ сцены, который читает следующий кусок, или тихую метку (`g.mark(key, value, null)`), которую через
  `facts` читает дальняя сцена. Столбец «в истории» ниже. `skipped` — итог обычной игры: пропуск (⏭) оставляет тот
  же след, что сыгранная.
- `about` — честная длина по правилам раздела (скорость людей, пороги, путь), а не «примерно».

| Мини-игра (файл) | Сцена, после куска | Слова языка | Точки | Ключи двигает / слушает | `opts` | Итог → в истории |
| --- | --- | --- | --- | --- | --- | --- |
| Окна (`okna`) | Улица, `knock_ready` | нажать ×5 (кольца на горящих окнах, сразу все); ожидание — путь | `win1…win5` | `knock`, `win1…win5`, `snow` / `knock:hit`, `knock:done` | `refuse[3]` | `{knocked}` → метка `knocked` → в `evening` (IV) эти окна тёмные |
| Руки (`ruki`) | Дом, `kitchen` | тереть (пятно) | `hands#hands` | `thaw`, `rub` | — | `{seconds}` → руки отогреты: `thaw` 1 в `warm_up` и дальше |
| Чай (`chai`) | Дом, `talk` | держать (кольцо с желобом), по очереди на двух стаканах | `tea#glass1`, `tea#glass2` | `which`, `pour`, `glass1`, `glass2`, `spill`, `shake` | `ask()` | `{spills}` → лужица от вопроса (всегда): `spill` 1 в `talk_back`, лужица в `box_out` |
| Табакерка (`tabakerka`) | Дом, `box_take` / `box_give` | `take`: тянуть к цели ×4; `give`: тянуть с сопротивлением | `box#finger1…4`, `box#box`, `box#old` | `finger1…4`, `old` / `push`, `old_close` | `mode` | `{closed}` / `{seconds}` → сам выбор: табакерка у него или на полке |
| На цыпочках (`tsypochki`) | Дом, `sneak` | ритм: доля — ходики (знак доли без метки), касание где угодно | `clock#face` | `sneak`, `stir` / `sneak_at` | — | `{creaks}` → `heard` в `caught`: скрипели — Сарафанов уже стоит в проёме |
| Иней (`inei`) | Дом, `window_watch` | тереть (пятно); ожидание — путь | `window#pane` | `hole`, `far_train` | — | `{hole}` → `hole` в `morning`: сквозь эту дыру видно отца |
| Под руку (`pod-ruku`) | Косогор, `meet` | держать где угодно (идти) + нажать на локоть с дугой времени | `sarafanov#shoulder_l` | `down`, `catch`, `fall` / `down_at`, `down:slip` | — | `{falls}` → `snowy` в `bottom`: снег на пальто, он смеётся |
| Следом (`sledom`) | Косогор, `hide` | держать где угодно (идти) с опасностью; дуга опасности у Сарафанова | `sarafanov` | `sar_go`, `follow`, `hold`, `duck` / `follow_at`, `sar_at`, `sar_go:look`, `sar_go:on`, `sar_go:club` | — | `{seen}` → `seen` в `club`: оглядывается на крыльце |
| Рюкзак (`ryukzak`) | Платформа, `strap` | держать с опасностью (дуга — как тянет) | `strap#grip` | `pull`, `grip`, `door_bg` | — | `{slips}` → `torn` в `bench_back`: ремень оборван, узел |
| Вёдра (`vyodra`) | Улица, `fire` | нажать, одна метка за раз: бочка — сарай | `barrel`, `shed` | `vyodra`, `fire` / `vyodra:full`, `vyodra:splash` | — | `{buckets}` → `shed_left` в `after_fire`: сарай устоял или выгорел |
| Пальто (`palto`) | Улица, `shawl` | тянуть к цели | `shawl#coat`, `shawl#shoulders` | `lay` | — | `{seconds}` → пальто у неё на плечах в `porch_after` |
| Бегом (`begom`) | Улица, `run_out` | держать где угодно (бежать); отпустил — оглядывается | `busygin` (свечение) | `run`, `look_back` / `run_at` | — | `{seconds, looks}` → `late_run` в `last`: оглядывался — поезд уже стоит |
| Стекло (`steklo`) | Платформа, `glass` | тереть (пятно) | `train_window#pane` | `wipe` | — | `{wipe}` → `wipe` в `away`: сколько видно платформы |

### Окна (`about: 50`)

Четыре строки: стучит в чужие окна; хочет, чтобы пустили; замёрз, неловко будить людей; игрок — холод и закрытый мир.
Фраза: «Ночь. В посёлке ещё горит свет — в пяти окнах». Пять окон горят (`win1…win5` = 1); на каждом горящем —
кольцо (нажать; касание и есть стук, без лепестков). Нажато окно N: `mg.sceneTurn(true)` (метки скрыты — ход сцены),
поставить ожидания `knock:hit` и `knock:done`, `g.set('knock', N)` — Бусыгин идёт (окна через 6 м — до 8 с ходу) и
стучит; по `knock:hit` — `g.sound.knock()`; по `knock:done` — `g.set('winN', 2)` (силуэт), 0.6 с; первое
постучанное — `await opts.refuse[0]('winN')`, второе — `refuse[1]`, третье — `refuse[2]`; четвёртое и пятое — без
слов, `g.sound.dog()`; 0.5 с; `g.set('winN', 0)`, `mg.snap`; `mg.sceneTurn(false)` — кольца на оставшихся. **Ждать — тоже
путь:** каждые 9 с без касания гаснет горящее окно с наименьшим номером (`g.set('winN', 0)` — люди ложатся); это видно с
начала: на его кольце бежит дуга времени (`time` языка, 1 → 0 за 9 с). Полоса —
сколько окон тёмные. Снег: после каждого угасшего окна `g.set('snow', 0.4 + 0.06 · тёмных, 2)`. Конец: все пять
тёмные — 1 с — `g.set('knock', 0)`, `mg.end({as: 'neutral'})`. Итог `{knocked: [номера по порядку]}`; `skipped`
`{knocked: []}`. Не стучать: ≈ 45 с; пять стуков ≈ 5 × 10 с.

### Руки (`about: 9`)

Четыре строки: греет руки у чужой печи; хочет согреться; тепло взято ложью — неловко; игрок — тепло, которое жжёт.
Фраза: «Руки с мороза не гнутся. Дверца печи открыта». Вставка `stove` открыта; на `hands#hands` — пятно (тереть); призрак трёт
сразу и снова через 1.5 с без дела (`still: [1.5, 6]`).
Покрытие пятна u (язык) — `thaw` = u; `rub` = направление и скорость пальца: знак dx · min(1, |dx|/dt / 1) по
`frame` касания. Скорость покрытия задана так, что живого растирания (кадр в секунду — обычный темп) нужно ≈ 6 с
(было 10 — затянуто: семь-восемь растираний ни к чему). Стоит без дела — ничего не
остывает. На смене направления — `g.sound.rub()`. `thaw` ≥ 1 — `rub` = 0, `mg.snap`, через 1 с `mg.end({as:
'clean'})`. Итог `{seconds}`; `skipped` `{seconds: 6}`.

### Чай (`about: 13`)

Четыре строки: наливает чай чужому отцу; хочет, чтобы не спрашивали; на втором стакане вопрос про мать, которой он
не сын; игрок — рука, которая дрогнула. Фраза: «Чайник тяжёлый. Два стакана в подстаканниках». Вставка `tea` открыта,
чайник над первым стаканом (`which` 0). **Первый стакан — умение.** Кольцо с желобом — на `tea#glass1`, с дугой опасности: от 0.85 растёт к краю (пора
отпускать) (одна метка за
раз). Держат — льётся: `pour` = 1, `g.sound.pour(0.6, 0.2)`, уровень текущего стакана растёт на 0.22 в секунду (своё
число, шлётся ключом `glass1` / `glass2`; налив кольца — уровень; 0.85 — через ≈ 3.9 с). Отпустил — `pour` = 0,
`g.sound.pour(0, 0.2)`. Уровень 0.85…1.0 в миг отпускания — стакан налит: `mg.snap`, `g.move('which', 1, 0.6)`,
кольцо — на `tea#glass2`. Отпустил раньше 0.85 — можно долить (не ошибка). Дошёл до 1.0, пока держат, — через край:
ошибка умения (`mg.error('danger', {at})`, плашка `bad`), `spill` = 1, `g.sound.spill()`, струя льётся, пока палец
держит, — чай бежит по стакану, лужица растёт; отпустил — стакан налит. **Второй стакан — не умение, а вопрос.** На первом касании второго стакана глава
спрашивает — `opts.ask()` (не ждать) — и рука дрожит: `shake` = 1 (носик ходит во вставке), отпускание струю **не
останавливает** (`pour` остаётся 1), уровень растёт **0.6 в секунду** — с нуля до 1.0 за ≈ 1.7 с, пока вопрос ещё
звучит (Р33 ≈ 1.6 с). Дрожь длится, пока звучит Р33 и ещё 0.6 с после неё, но не меньше 1.8 с (≈ 2.2 с) — поэтому
второй стакан переливается **всегда**, что бы ни делал палец: уровень доходит до 1.0 — `spill` = 1, `g.sound.spill()`,
счёт `spills`, уровень стоит на 1.0, чай бежит через край, пока дрожь не кончится; тогда `shake` = 0, струя
останавливается сама (`pour` = 0, `g.sound.pour(0, 0.2)`), даже если палец держит; стакан налит. Это **не ошибка**
(без `mg.error`): перелитый стакан — след вопроса. Конец — через 1 с (`neutral`). Итог `{spills}` (1, или 2 — если и
первый перелил); `skipped` `{spills: 1}`. Длина: ≈ 2 с призрачный палец (первая встреча с «держать») + 1.5 с до касания
+ 3.9 с налив + 0.6 с + 1 с до касания + 2.2 с дрожь + 1 с — ≈ 12–13 с. Р33 говорит только `opts.ask()`; если её не
сказала игра (пропуск раньше второго стакана), глава говорит её после игры (§6 II.3). По `signal` — `shake` = 0,
`g.sound.pour(0, 0.2)`.

### Табакерка (`about: 8`)

Четыре строки: берёт (или отдаёт) дедову табакерку «старшему сыну»; хочет не обидеть старика; стыдно; игрок —
вещь, которая тяжелее, чем весит. Вставка `box` открыта; режим — `opts.mode` (кадр уже в нём: `box_mode` ставит кусок).
- `take`. Фраза: «Табакерка лежит на ладони. Старая рука ещё над ней». Ладонь раскрыта (`finger1…4` = 0), старая рука
  над ней (`old` 1). Четыре кольца с пунктиром — на `box#finger1…4`, сразу все; тянуть к цели `box#box`: палец дошёл —
  `g.move('fingerN', 1, 0.5)`, `mg.snap`, кольцо снято. Порядок любой. **Сами пальцы не сжимаются.** Все четыре —
  `g.sound.box()`, `g.move('old', 0, 1.5)`, `mg.end({as: 'clean'})`. Итог `{closed: 4}`.
- `give`. Фраза: «Табакерка стоит на клеёнке между ними». Кольцо с пунктиром на `box#box`, путь к `box#old`; тянуть с
  сопротивлением (тяжёлая: идёт, пока палец тянет впереди неё); `push` = место на пути, назад не идёт; отпустил —
  стоит. `push` ≥ 0.9 (табакерка уже видна на ладони; остаток пути — `g.move('push', 1, 0.3)` сам) —
  `g.move('old_close', 1, 2)` (он берёт её не сразу), `g.sound.box()`, `mg.end({as: 'clean'})`.
  Само не едет. Итог `{seconds}`.

`skipped`: `{closed: 4}` при `take`, `{seconds: 6}` при `give` (форма по `opts.mode`).

### На цыпочках (`about: 15`)

Четыре строки: крадётся из чужого дома на рассвете; хочет уйти, не разбудив; стыдно; игрок — шаг в такт, дыхание
затаено. Фраза: «Половицы старые. Ходики тикают на всю кухню». Ритм: доли — тики ходиков, раз в 1.0 с (часы игры;
`g.sound.tick()` на каждой); знак доли без метки — на `clock#face`; касание — где угодно (окно доли ±220 мс). Касание
в долю — шаг: цель `sneak` = min(`sneak` + 0.1, `sneak_at` + 0.12) (вперёд не дальше, чем они успевают дойти); сцена
ведёт обоих походкой `tiptoe` (≈ 0.5 м/с, путь 6 м). Касание не в долю — `mg.error` (рано / поздно),
`g.sound.creak()`, своё `stir` += 0.3 (шлётся ключом: лампа Сарафанова разгорается, полоса её света на полу кухни у
проёма — ярче), при `stir` ≥ 0.6 —
`g.sound.cough()`; счёт `creaks`. `stir` спадает на 0.1 в секунду. Конец: `sneak_at` ≥ 0.98 (`clean` / `flawed`).
Итог `{creaks}`; `skipped` `{creaks: 0}`. (Сарафанов выходит к ним в любом случае — следующий кусок; скрипели — он уже
стоит в проёме.)

### Иней (`about: 18`)

Четыре строки: остался; хочет увидеть, что упустил; тихо, свобода уходит мимо; игрок — окно в инее, протёртое
пальцем. Фраза: «Стекло заросло инеем. За ним — огороды и станция». Пятно на `window#pane` (пятно языка — трут там, где оно нарисовано; круг в 0.3 высоты кадра, вчетверо шире
нарисованного, протереть было нельзя);
покрытие — своё `hole` (до 1); не трут — `hole` медленно затягивается (−0.02 в секунду), но не ниже 0.4 после начала
поезда; каждые 0.4 высоты пути — `g.sound.scrape()`. **Смотреть — тоже путь:** поезд — когда `hole` впервые ≥ 0.6 или
после 12 с без движения: `g.move('far_train', 1, 14)` (своё движение, отменить по `signal`), `g.sound.horn(0.3)`,
`g.beds({clock: 0.4, rails: 0.3, train: 0.25}, 2)`. Конец — когда движение поезда кончилось (`neutral`). Итог `{hole}`;
`skipped` `{hole: 0.6}`. Призрачный палец — свой (`rub:frost`): «тереть» из «Рук» не говорит, что в окно
можно и просто смотреть. По `signal` — подложки к `{clock: 0.4, rails: 0.3}`.

### Под руку (`about: 36`)

Четыре строки: ведёт чужого отца вниз по льду; хочет, чтобы тот не упал; узнал его тайну — бережно; игрок —
забота рукой. Фраза: «Тропа обледенела. Старик ступает осторожно». Путь по тропе 0…1 (`down`, `down_at`, ≈ 25 м,
походка `careful` ≈ 0.8 м/с). Держать где угодно — идут: `down` = min(`down_at` + 0.08, 1); отпустил — `down` =
`down_at`: стоят. Полоса — `down_at`. На ледяной полосе сцена говорит `down:slip` (ожидание — в цикле) и сама
останавливает обоих; держание кончается (один палец: чтобы поймать, палец надо поднять); на `sarafanov#shoulder_l` —
кольцо с дугой времени 2.5 с — она бежит, только когда палец поднят (время — дотянуться, а не сначала
отпустить); в первый раз призрачный палец показывает нажатие. Держание «идти» показывается снова, когда игрок
замер (после подхвата иначе не видно, что путь продолжается). Нажал — `catch` = 1, `g.sound.crunch()`, `mg.snap`, через 1.5 с `catch` = 0, можно идти.
Не нажал — `mg.error` (отстал), `fall` = 1 (садится в снег), `g.sound.thud()`, счёт `falls`, через 2 с `fall` = 0
(встаёт), ещё 2 с — можно идти. Конец: `down_at` ≥ 0.98 (`clean` / `flawed`). Итог `{falls}`; `skipped` `{falls: 0}`.

### Следом (`about: 40`)

Четыре строки: идёт за отцом, чтобы тот не увидел; хочет сберечь его ложь; смешно и стыдно; игрок — замереть
вовремя. Фраза: «Сарафанов идёт к клубу. Иногда оглядывается». Начало: `g.set('sar_go', 1)` — Сарафанов пошёл сам
(≈ 34 с ходьбы и три оглядки по 2 с). Держать где угодно — `follow` = min(`follow_at` + 0.08, `sar_at` − 0.1), `hold` =
1: Нина и Бусыгин идут; отпустил — `follow` = `follow_at`, `hold` = 0. Дуга опасности — у `sarafanov` (тихое кольцо без касания: у метки-`light` дуги не видно):
растёт, когда
`sar_at` в 0.04 до места оглядки (0.25, 0.5, 0.75). По `sar_go:look` (сцена говорит его, когда голова **начинает**
поворачиваться; ожидание в цикле) — судить через **0.6 с**: `hold` = 1 или `follow_at` изменился за последние 0.3 с —
почти увидел: `mg.error` (в опасность), `duck` = 1, счёт `seen` (сцена тоже судит `hold` через 0.6 с и держит оглядку
ещё 2 с); по `sar_go:on` — `duck` = 0. Конец: `sar_go:club` (`clean` / `flawed`). Итог `{seen}`; `skipped`
`{seen: 0}`. Полоса — `follow_at` (сколько прошли они). Призрачный палец — свой (`hold:follow`): «держать» из «Под
руку» не говорит, что здесь отпустить — замереть.

### Рюкзак (`about: 25`)

Четыре строки: держит младшего за рюкзак, говоря «я не держу»; хочет, чтобы тот не уехал; смешно и больно;
игрок — «не держу» — и держу. Фраза: «Двери вагона открыты. Васенька тянет рюкзак к себе». Вставка `strap` открыта,
двери за ней открыты. Кольцо с желобом на `strap#grip`; дуга опасности — `pull`. Васенька тянет: своё `pull` растёт на
0.12 в секунду и рывками +0.15 каждые 2–3 с. Держат — `grip` = 1 и `pull` −0.2 в секунду (не ниже 0); отпустил —
`grip` = 0, `pull` +0.25 в секунду. `pull` ≥ 1 — вырвался: `mg.error` (сорвал), счёт `slips`, `pull` = 0.6, `grip` = 1
на 1 с (поймал снова). Через 22 с от начала — сцена своим ходом: `g.sound.doors()`, `g.move('door_bg', 1, 1.5)` — дверь
закрылась — `g.move('pull', 0, 1)`, `grip` = 1, конец (`clean` / `flawed`). Итог `{slips}`; `skipped` `{slips: 0}`.

### Вёдра (`about: 35`)

Четыре строки: тушит чужой сарай с соседями; хочет погасить; паника и смех; игрок — бочка — сарай, быстрее.
Фраза: «Сарай горит. Бочка у забора полная». Свой огонь `fire` = 0.6, растёт на 0.01 в секунду (шлётся ключом);
каждые 0.25 с `g.sound.fire(0.3 + 0.7 · fire, 0.3)`. Одна метка за раз: пустой — кольцо на `barrel`; нажал —
`mg.sceneTurn(true)`, ожидание `vyodra:full`, `g.set('vyodra', 'fill')`; по `vyodra:full` — с ведром, кольцо на `shed`;
нажал — ожидание `vyodra:splash`, `g.set('vyodra', 'throw')`; по `vyodra:splash` — `fire` −= 0.18,
`g.sound.splash(1)`, `mg.snap`, счёт `buckets`, пуст. Соседи (сцена своим ходом): каждые 6 с `fire` −= 0.07,
`g.sound.splash(0.5)`. Полоса — 1 − `fire` / 0.6. Призрак (`press:buckets`) — нажатие на каждой метке, снова, когда
игрок замер: два нажатия, не перенос. Один круг (бочка — сарай — бочка, 4 м шагом и с ведром) ≈ 11 с:
огонь гаснет за 3 круга. `fire` ≤ 0 — 2 с пара — `clean`. Через 40 с — соседи справились: `g.move('fire', 0, 4)` —
`neutral`. Итог `{buckets}`; `skipped` `{buckets: 3}`. По `signal` — `g.sound.fire(0, 1)`.

### Пальто (`about: 6`)

Четыре строки: кладёт своё пальто на плечи Нины; хочет её согреть — и сказать то, чего не скажет; нежно, неловко;
игрок — отдать своё. Фраза: «Снег. Нина в одном платке». Вставка `shawl` открыта. Кольцо с пунктиром на `shawl#coat`,
путь к `shawl#shoulders`; `lay` = место на пути, назад не идёт; отпустил — стоит. `lay` ≥ 0.97 — `mg.snap`, через 1 с
`clean`. Само не опускается. Итог `{seconds}`; `skipped` `{seconds: 5}`.

### Бегом (`about: 24`)

Четыре строки: бежит от дома, где сказана правда, к последней электричке; хочет уехать; не может не оглядываться;
игрок — бег и оглядка на окно. Фраза: «Последняя — в двадцать три сорок. Окно кухни ещё горит». Улица от калитки (0) до
тропы на платформу (1), ≈ 65 м. Держать где угодно — `run` = min(`run_at` + 0.08, 1), `look_back` = 0: Бусыгин бежит
(походка `run`, ≈ 4.5 м/с); светится `busygin`. Отпустил — `run` = `run_at`, `look_back` = 1: он останавливается и
оборачивается на освещённое окно кухни (камера едет сбоку; он в профиль, дом с окном — справа от него); счёт `looks`.
Это не ошибка: бег и оглядки — и есть игра. На 8-й секунде — `g.sound.horn(0.4)` (последняя уже идёт). Конец: `run_at`
≥ 0.98 (`neutral`). Само не бежит. Итог `{seconds, looks}`; `skipped` `{seconds: 24, looks: 1}`. Чистый бег — ≈ 15 с,
с двумя-тремя оглядками по 3 с — ≈ 24 с.

### Стекло (`about: 6`)

Четыре строки: уехал; хочет увидеть, кто остался; уезжает от них; игрок — протереть иней, его ложь, на стекле.
Фраза: «Стекло вагона в инее. За ним — платформа». Пятно на `train_window#pane` (пятно языка, как нарисовано — как в Инее); покрытие — `wipe` (до 1); каждые 0.4
высоты пути — `g.sound.scrape()`. `wipe` ≥ 0.8 — `clean`. Электричка ждёт недолго: 15 с без движения — конец
(`neutral`): видно столько, сколько протёрто. Итог `{wipe}`; `skipped` `{wipe: 0.8}`.

## 8. Голоса, реплики, звук, музыка

### Голоса (`PEOPLE` в `story.js`)

Рассказчик — безымянный, спокойный мужской голос, суховато, с тихой усмешкой: как ремарки Вампилова вслух; говорит
только то, что было видно. Голоса — готовые голоса сервиса звука (Gemini). Любая правка буквы в тексте, манере, имени
или голосе — новая платная запись; голоса делают один раз, все вместе, когда текст решён (work.md).

| Ключ | Голос | Манера (`how`) | Кто (`name`) |
| --- | --- | --- | --- |
| `narrator` | Rasalgethi | спокойно, суховато, с тихой усмешкой, не торопясь — как ремарки пьесы вслух | рассказчик |
| `busygin` | Iapetus | молодой: негромко, сдержанно, чуть хрипло с мороза; неловко, когда врёт | Володя Бусыгин, студент |
| `silva` | Puck | бойко, весело, нагловато, быстро; злость — тем же весёлым голосом | Сильва, Семён Севостьянов |
| `sarafanov` | Algenib | немолодой: мягко, торопливо, взволнованно, с одышкой и улыбкой; тихо, когда больно | Андрей Григорьевич Сарафанов, музыкант |
| `nina` | Kore | ровно, прямо, чуть насмешливо и устало; без жалобы | Нина, дочь Сарафанова |
| `vasenka` | Fenrir | ломкий голос подростка: хмуро, отрывисто, обиженно | Васенька, сын Сарафанова |
| `kudimov` | Alnilam | чётко, громко, по-уставному, без улыбки | Михаил Кудимов, курсант |
| `makarskaya` | Aoede | низко, лениво, насмешливо; в крике — испуганно | Наталья Макарская, соседка |
| `neighbor_m` | Orus | из-за окна: сонно, сердито | сосед |
| `neighbor_w` | Gacrux | из-за окна: визгливо, испуганно-сердито | соседка |
| `neighbor_old` | Enceladus | из-за окна: старик, шёпотом, лукаво | старик-сосед |

### Все реплики — единственный список

Каждая реплика игры написана здесь один раз; в §6 и в scenes.md — только её номер. Глава пишет её литералом:
`g.say('<кто>', '<текст>')`. «≈ с» — 0.3 с + 0.06 с на букву.

| № | Кто | Текст | ≈ с |
| --- | --- | --- | --- |
| Р01 | `narrator` | Последняя электричка ушла в двадцать три сорок. Следующая — в шесть ноль пять | 5.1 |
| Р02 | `silva` | Всё, студент. Приехали | 1.7 |
| Р03 | `busygin` | До шести тут замёрзнем | 1.7 |
| Р04 | `silva` | Стучим, где горит свет. Кто-нибудь да пустит | 3.1 |
| Р05 | `neighbor_m` | Иди, иди отсюда! | 1.3 |
| Р06 | `neighbor_w` | Ночь на дворе! Милицию позову! | 2.1 |
| Р07 | `neighbor_old` | Нету никого. Спят все | 1.6 |
| Р08 | `narrator` | Свет остался в одном окне — в конце улицы | 2.8 |
| Р09 | `sarafanov` | Наталья… Васеньки у вас нет? Простите, ради бога | 3.2 |
| Р10 | `makarskaya` | Нет вашего Васеньки. Идите спать, Андрей Григорьевич | 3.5 |
| Р11 | `silva` | Сарафанов. Андрей Григорьевич. Сын — Васенька | 3.1 |
| Р12 | `silva` | Слушай, студент. А ведь ты ему — сын. Старший | 3.1 |
| Р13 | `vasenka` | Вам кого? | 0.8 |
| Р14 | `busygin` | Пусти переночевать. Мы на электричку опоздали | 3.1 |
| Р15 | `vasenka` | Тут не гостиница | 1.3 |
| Р16 | `silva` | Учись, студент | 1.2 |
| Р17 | `silva` | Мы к Андрею Григорьевичу. Вот — сын его. Старший | 3.2 |
| Р18 | `busygin` | Я к отцу. Я — сын Андрея Григорьевича | 2.6 |
| Р19 | `vasenka` | Сын?.. Ну, входите. Отец скоро придёт | 2.6 |
| Р20 | `vasenka` | Он вам обрадуется. Он всем радуется | 2.5 |
| Р21 | `vasenka` | А я завтра уезжаю. В тайгу | 1.9 |
| Р22 | `silva` | Андрей Григорьевич! Не узнаёте? Это же ваш сын | 3.1 |
| Р23 | `sarafanov` | Сын?.. | 0.7 |
| Р24 | `sarafanov` | Сорок пятый год… Чернигов… | 1.9 |
| Р25 | `sarafanov` | Похож. Честное слово, похож | 2.0 |
| Р26 | `kudimov` | Ноль пятьдесят. В час я должен быть в казарме | 2.8 |
| Р27 | `nina` | Иди, Миша. Опоздаешь | 1.6 |
| Р28 | `sarafanov` | Нина! Это Володя. Твой брат | 2.0 |
| Р29 | `nina` | Брат. Ну конечно | 1.3 |
| Р30 | `sarafanov` | Все люди — братья! | 1.4 |
| Р31 | `narrator` | Сарафанов писал ораторию «Все люди — братья» | 3.0 |
| Р32 | `sarafanov` | Галя Бусыгина… Я ей писал. Она не ответила | 3.0 |
| Р33 | `sarafanov` | Она меня… вспоминала? | 1.6 |
| Р34 | `busygin` | Помнила. Часто | 1.2 |
| Р35 | `busygin` | Мама про вас не рассказывала | 2.0 |
| Р36 | `sarafanov` | Табакерка моего деда. Её всегда отдавали старшему сыну | 3.6 |
| Р37 | `sarafanov` | Возьми | 0.7 |
| Р38 | `sarafanov` | Ну вот. Теперь я спокоен | 1.8 |
| Р39 | `busygin` | Не надо. Пусть Васе | 1.5 |
| Р40 | `sarafanov` | Ну… Пусть полежит. Она подождёт | 2.2 |
| Р41 | `narrator` | За стеной он играл одно и то же место. Дальше оно не шло | 3.7 |
| Р42 | `silva` | Подъём. Первая — в шесть ноль пять. Уходим по-тихому | 3.4 |
| Р43 | `sarafanov` | Уходите?.. Вот и Нина уходит. И Вася. Все уходят | 3.2 |
| Р44 | `silva` | Да мы… за папиросами | 1.5 |
| Р45 | `sarafanov` | Останься до вечера, Володя. Нина жениха приведёт | 3.3 |
| Р46 | `silva` | Ну и сиди, сынок | 1.3 |
| Р47 | `sarafanov` | Не спится? И мне | 1.3 |
| Р48 | `sarafanov` | Пойду. В филармонии репетиция | 2.1 |
| Р49 | `narrator` | Он сказал, что идёт в филармонию | 2.3 |
| Р50 | `narrator` | Вечером Нина повела его за посёлок | 2.4 |
| Р51 | `nina` | Пойдём. Покажу, в какой филармонии играет наш отец | 3.4 |
| Р52 | `nina` | Его из оркестра уволили. Два года назад. Он думает, мы не знаем | 4.1 |
| Р53 | `busygin` | А вы знаете | 1.0 |
| Р54 | `nina` | Мы делаем вид. Ему так легче | 2.0 |
| Р55 | `sarafanov` | Ну вот. Теперь и ты знаешь | 1.9 |
| Р56 | `sarafanov` | Только Нине с Васей — ни слова | 2.1 |
| Р57 | `busygin` | Ни слова | 0.8 |
| Р58 | `sarafanov` | Ну, иди. Мне ещё в клуб — на танцах играть | 2.9 |
| Р59 | `nina` | Теперь и ты делаешь вид | 1.7 |
| Р60 | `nina` | Я за Мишу выхожу. Он хороший. Он никогда не врёт | 3.3 |
| Р61 | `nina` | А ты ведь мне не брат. Правда? | 2.1 |
| Р62 | `busygin` | Не брат. Мы вчера опоздали на электричку. Вот и всё | 3.4 |
| Р63 | `nina` | Отцу не говори. Пока | 1.6 |
| Р64 | `busygin` | Не брат я тебе, Нина… | 1.6 |
| Р65 | `nina` | Что? | 0.5 |
| Р66 | `busygin` | Брат, говорю | 1.1 |
| Р67 | `busygin` | Брат | 0.6 |
| Р68 | `nina` | Ну, тогда — брат | 1.3 |
| Р69 | `vasenka` | Не держи. Всё равно уеду | 1.9 |
| Р70 | `busygin` | Я не держу | 1.0 |
| Р71 | `vasenka` | Ладно. Пошли жениха смотреть | 2.0 |
| Р72 | `narrator` | Жениха ждали к девяти | 1.6 |
| Р73 | `kudimov` | Двадцать один ноль-ноль. Курсант Кудимов | 2.8 |
| Р74 | `kudimov` | Нина сказала — у неё брат нашёлся. Поздравляю | 2.9 |
| Р75 | `kudimov` | Я никогда не вру. Это у меня принцип | 2.5 |
| Р76 | `kudimov` | Мы с Ниной в субботу уезжаем. На Сахалин | 2.8 |
| Р77 | `sarafanov` | Скажи хоть ты, Володя. Ты старший | 2.3 |
| Р78 | `busygin` | Пусть едет. Это её жизнь | 1.8 |
| Р79 | `sarafanov` | Да… Да, конечно | 1.3 |
| Р80 | `busygin` | Нина, не уезжай. Отцу одному нельзя | 2.5 |
| Р81 | `kudimov` | Это решать нам | 1.2 |
| Р82 | — | *убрана в третьей редакции* (рассказчик говорил невиденное; номер не занимать) | 0 |
| Р83 | `makarskaya` | Горим! Сарай горит! | 1.4 |
| Р84 | `silva` | Кто поджёг? Найду — убью! | 1.8 |
| Р85 | `busygin` | Это я. Курил у сарая | 1.6 |
| Р86 | `silva` | Ты?! | 0.5 |
| Р87 | `vasenka` | Это я. Я поджёг | 1.3 |
| Р88 | `makarskaya` | Дурак ты, Васенька | 1.4 |
| Р89 | `nina` | Скажешь ему? Про себя | 1.6 |
| Р90 | `nina` | Хорошо, что ты к нам приехал | 2.0 |
| Р91 | `busygin` | Я своего отца не знаю. Видел раз — на вокзале. Он меня не узнал | 4.1 |
| Р92 | `silva` | Всё, сынок. Спектакль окончен. На последнюю ещё успеем | 3.6 |
| Р93 | `sarafanov` | Я с тобой. Тут я никому не нужен | 2.3 |
| Р94 | `sarafanov` | Поеду к твоей маме. Повинюсь | 2.0 |
| Р95 | `silva` | Андрей Григорьевич, да какой он вам… | 2.5 |
| Р96 | `busygin` | Я вам не сын. Мы опоздали на электричку. Надо было где-то ночевать | 4.3 |
| Р97 | `silva` | …сын! Он вас вчера первый раз увидел. Это я его сыном назвал — для смеху | 4.6 |
| Р98 | `silva` | …сын! Он вас вчера первый раз увидел. Сам назвался — артист | 3.8 |
| Р99 | `sarafanov` | Ну и что. Я всё равно считаю тебя своим сыном | 3.1 |
| Р100 | `silva` | Ну? Едешь, сынок? | 1.3 |
| Р101 | `sarafanov` | Володя! | 0.7 |
| Р102 | `sarafanov` | Возьми. Она — старшему | 1.6 |
| Р103 | `sarafanov` | В субботу приезжай! Слышишь — в субботу! | 2.7 |
| Р104 | `busygin` | Я опоздал на электричку | 1.7 |
| Р105 | `sarafanov` | Вот и хорошо. Вот и правильно | 2.1 |
| Р106 | `sarafanov` | Теперь возьмёшь? | 1.3 |
| Р107 | `sarafanov` | Чаю? | 0.5 |
| Р108 | `narrator` | Окно в конце улицы горело до утра | 2.3 |
| Р109 | `narrator` | Чемодан он так и не разобрал | 2.0 |
| Р110 | `narrator` | Табакерка уехала с ним | 1.7 |
| Р111 | — | *убрана в четвёртой редакции* (рассказчик говорил невиденное: что Нина уехала, видно — её нет в окне и за столом) | 0 |
| Р112 | — | *убрана в четвёртой редакции* (то же) | 0 |
| Р113 | — | *убрана в четвёртой редакции* (Васенька уезжает первой электричкой в `dawn` — видно) | 0 |
| Р114 | — | *убрана в четвёртой редакции* (платформа на рассвете пуста — видно) | 0 |
| Р115 | `nina` | Он тебе сказал? Про оркестр | 1.9 |
| Р116 | `busygin` | Останься. Не ради отца | 1.6 |
| Р117 | `kudimov` | Я понял | 0.7 |
| Р118 | `silva` | У меня батя тоже есть. В Чите. Пишет раз в год — денег просит | 3.9 |
| Р119 | `nina` | Володя | 0.6 |

Где сказано: Р05–Р07 — у окна, в которое постучали (`at` — `'winN'`); Р10 — у `'mak_window'`; Р13, Р15 — у `'vasenka'`
в двери; Р33 — внизу (`'narrator'`: вставка `tea` открыта); Р99 в `exposed` — у `'sarafanov'` (спиной); Р64 — под грохот
товарного; Р57 сказан дважды (III.1 и V.1) — **одна запись сознательно**: те же слова тем же голосом — отцу это обещание, Нине
уже ложь; игрок слышит одно и то же «Ни слова» и понимает разницу сам; рассказчик — внизу. Р119 — Нина одна на
лестнице платформы впереди (отца нет: `ninaCame`, не `fatherCame`), негромко. Р89 — «Про себя»: после Р115 и Р57 (про оркестр) голое
«Скажешь ему?» звучало бы про оркестр. Р82 и Р111–Р114 убраны: рассказчик говорит только виденное. **Реплик — 114**
(номера Р01–Р119 без Р82, Р111–Р114; номера не занимать).

### Звуки страницы (`sound.js`)

Всё синтезируется в Web Audio, файлов нет, по образцу Ашеров: один `AudioContext` → общий уровень → компрессор; посыл в
сгенерированную реверберацию (две: улица — открытая, 1.5 с, тёмная; дом — комната, 0.5 с); шумовые буферы; огибающие;
пауза и первое касание — страницы (выход через `MooodVolume.output`: звуки ждут с партией, как музыка, — затухая и возвращаясь); `background(levels, seconds)` — названные подложки к уровню, остальные в ноль (его
зовёт страница); `unheard()` — немой двойник для невидимого шага: **в нём перечислен каждый звук по имени**, подложки
тоже немые, `march()` отдаёт немую ручку `{loud() {}, stop() {}}`.

Подложки игра объявляет, а не переключает: со сценой — `g.scene(…, {beds})` (страница меняет их на склейке вместе с
музыкой сцены, тем же переходом), внутри сцены — `g.beds(…)` (сразу, тем же переходом); секунды игра не задаёт, на карте —
`background` в `b.show` (moood `bespoke.background`, `docs/games/README.md`).

| Звук | Вид | Как сделан | Где |
| --- | --- | --- | --- |
| `wind(level, s)` | подложка | розовый шум через полосовой фильтр, частота гуляет 250–700 Гц, редкие порывы | улица, платформа, косогор |
| `rails(level, s)` | подложка | далёкая железная дорога: раз в 20–40 с — далёкий стук колёс (НЧ-шум ритмом «та-та, та-та»), иногда далёкий гудок | ночь, рассвет, «Состав» |
| `train(level, s)` | подложка | электричка рядом: гул мотора (две пилы 90/180 Гц через НЧ) + стук колёс на стыках | платформа |
| `freight(level, s)` | подложка | товарный: тяжёлый стук колёс чаще и громче, скрежет, гул тепловоза | переезд |
| `crossing(level, s)` | подложка | звонок переезда: металлический «динь» 2 раза в секунду (два синуса 1.9/2.4 кГц, быстрый спад) | переезд |
| `room(level, s)` | подложка | тихий гул комнаты и потрескивание печи: редкие щелчки шума | дом |
| `clock(level, s)` | подложка | ходики: «тик» и «так» по очереди, раз в 0.5 с каждое (короткие щелчки двух высот через резонанс 3 кГц) | дом |
| `fire(level, s)` | подложка | пожар: рёв (бурый шум) + частый треск | IV.3 |
| `crowd(level, s)` | подложка | гомон людей вдали, без слов: несколько шумовых формант, неровно | IV.3 |
| `pour(level, s)` | подложка | струя в стакан: шум через полосу, частота растёт с уровнем | «Чай» |
| `horn(level)` | раз | гудок электрички: две пилы 330/415 Гц через НЧ, 1.6 с, далеко (реверберация) | пролог, «Иней», «Бегом», эпилог |
| `doors()` | раз | пневматика дверей: шипение 0.6 с и глухой стук | платформа |
| `knock()` | раз | три стука костяшками в стекло/дверь | I |
| `dog()` | раз | далёкий лай: 2–3 «гав» (шум + формант, короткие) | «Окна» |
| `door()` | раз | пружина двери: скрип (пила 120–200 Гц через резонанс) и хлопок | дом, улица |
| `creak()` | раз | скрип половицы: короткое трение 0.3 с | «На цыпочках» |
| `cough()` | раз | глухой кашель за стеной: два коротких всплеска шума через НЧ | «На цыпочках» |
| `tick()` | раз | один тик ходиков | «На цыпочках» |
| `strike(n)` | раз | бой часов: n ударов раз в 1.1 с (колокольчик с хвостом) | IV.2 |
| `rub()` | раз | шорох ладоней | «Руки» |
| `spill()` | раз | плеск через край | «Чай» |
| `box()` | раз | тонкий серебряный щелчок крышки | «Табакерка» |
| `glass()` | раз | звон гранёных стаканов | II.2 |
| `splash(level)` | раз | вода на огонь: всплеск и шипение пара | «Вёдра» |
| `crunch()` | раз | хруст снега под ногой | «Под руку» |
| `thud()` | раз | мягкое падение в снег | «Под руку» |
| `scrape()` | раз | ноготь по инею: тонкий шорох | «Иней», «Стекло» |
| `clarinet({times, resolve})` | раз | кларнет **за стеной**: одна язычковая — прямоугольная волна с нечётными гармониками, вибрато 5 Гц, шум дыхания, НЧ 1.2 кГц (глухо, через стену), комнатная реверберация. Фраза оратории `PHRASE`: шесть нот (ля, ре, фа, ми, ре, до-диез) и начало седьмой (си-бемоль) — обрыв на 80-й мс; `times` — сколько раз, пауза 3 с; `resolve: true` — седьмой звучит не си-бемоль, а ре (он нашёл ноту), целиком, и фраза идёт дальше: ми, фа, ля, ре октавой выше, долгая последняя; `far: true` — ещё глуше и тише (слышно с улицы, сквозь окно) | II.5, конец V, эпилог |
| `march()` | ручка `{loud(v, s), stop(s)}` | похоронный марш: четыре медных голоса (пилы с вибрато через НЧ, каждый расстроен на 10–20 центов — чуть фальшиво), большой барабан на сильные доли; издали (НЧ, реверберация улицы) | III.1 |
| `dance(seconds)` | раз | музыка танцев из открытой двери клуба: глухой фокстрот (аккордеон-пила, бас), `seconds` и затухание | III.1 |

### Музыка сцен

`music` каждой сцены — тихая подложка; игра ею не управляет. Кларнет, медь и фразу оратории играет игра, в `music`
сцен их нет (scenes.md).

## 9. Интерфейс и стиль (`ui.js`, `ui.css`, `fonts.css`)

- **Иней и чернила.** Переменные на `#layer`: `--frost` (`#e3e9f0`), `--frost-dark` (`#b8c3cf`), `--ink` (тёмно-синие
  чернила, `#1b2230`), `--lamp` (`#e8963a` — **только** лампа в окне-шкале и окна на карте), `--hand`, `--below-header`
  (46 px). Подложка тостов и подсказок — морозное стекло с узором инея по краям, слова — чернилами. **Стиль языка
  мини-игр** (`b.minigame.style`, language.md §7): цвет меток и налива — `--frost` с ободком `--ink`, лепестки — шрифтом
  «Syn Hand», чернилами по инею; «хорошо» — тёплый `--lamp` не берётся (он только у окон), берётся чистый белый;
  опасность — холодный красный огней переезда. Смысл меток, ошибок и плашки — общий, не меняется.
- **Шрифт** — `"Syn Hand"`: Neucha (OFL 1.1, кириллица и латиница), встроен в `fonts.css` как woff2 в base64. Стрелки ↑ —
  системными засечками.
- **Окно-шкала** (`view.gauge(state | null)`), `pointer-events: none`, слева внизу, на 64 px выше низа: SVG 80×80 —
  деревянная рама в четыре стекла, за стеклом тёмная комната.
  - Лампа (`home`, видна при `shown.home`): абажур и тёплый круг света; цвет — смесь `#1d2a3c` и `--lamp`, `u = (home −
    min) / (max − min)`; при `u` < 0.3 лампа почти гаснет. Пока `shown.home` нет — комната тёмная, лампы нет.
  - Иней (`lie`, виден при `shown.lie`): узор инея от углов к середине; покрытие `v = (lie − min) / (max − min)` (0 — по
    углам чуть-чуть, 1 — всё стекло, кроме маленького круга в середине). Узор рисуется маской, переход 2 с.
- **Тосты** (`view.toast(text, kind)`): полоска морозного стекла справа вверху под кнопками страницы, не больше трёх, 4.2 с
  (`rule` — 7.5 с); виды `scale`, `rule`, `mark`.
- **Подсказка** (`view.hint`) — одна строка внизу посередине; только вне мини-игр и выбора (там говорит язык).
  Кнопки «Дальше» нет (`view.onward` убрать).
- **Титр** (`view.title`): слова посреди кадра, 9 с — только название в прологе.
- **Кнопки** ⏸, ⏭, ☰ — страницы (с 2026-10-21); своих у игры нет. Карта автора (`view.author`) — окно поверх сцены,
  `z-index` 20, открывается его знаком на карте партии.
- Кольцо выбора, меню действий, пузыри реплик, строка «без голоса» — страницы; игра своих колец не рисует.
- **Карта партии** — HTML игры (`map.js`, `ui.css` `#underlay .map.yard`) поверх фона «Состава» (§3.4): вагоны — в
  инее и чернилах, шрифт «Son Hand», номера — узким рубленым; тёплый `--lamp` — только горящие окна выбранного.

## 10. Что сделано не так, как в пьесе или в замысле, и как именно

| В пьесе / в замысле | Как сделано | Почему |
| --- | --- | --- |
| пьеса — разговор на двух актах | одна-две фразы на момент; разговор заменён вещами и жестами (окна, руки у печи, чай, табакерка, пальто, иней, ремень рюкзака, ведро) | решение владельца: мало текста |
| Бусыгин и Сильва видят Сарафанова у дома Макарской | так же, но он «ищет Васеньку» у её окна — повод узнать имена | у Вампилова Сарафанов приходит к Макарской из-за сына |
| «женщина из Чернигова» | имя «Галя Бусыгина» и выбор «помнила / не рассказывала» | своё, по намёку; выбор — ложь, которая утешает, против правды внутри лжи |
| дети знают, что отца уволили | Нина сама ведёт Бусыгина на косогор | своё: показывает знание детей делом, а не рассказом |
| признание Нине | переезд, товарный; вариант «сказать под грохот» | своё: правда, которую никто не услышал, — середина между правдой и ложью |
| Васенька собирается уехать | рюкзак на платформе, «Не держи» — «Я не держу» | своё: старший брат делом; комично и больно |
| Васенька поджигает квартиру Макарской | сарай; выбор — взять вину на себя или привести его признаться | своё упрощение: без угрозы жизни; ложь из любви против правды, которая стыдит |
| безотцовщина Бусыгина | одна реплика на крыльце: «Видел раз — на вокзале. Он меня не узнал» | своё, по намёку; корень того, почему ложь его держит |
| Сарафанов узнаёт правду | всегда; говорит Бусыгин сам или Сильва (по выбору); чемодан «к твоей маме» | своё: чемодан делает ложь опасной для самого Сарафанова и вынуждает правду в V |
| финал в доме | финал на платформе: войти в вагон или остаться; дом — только если остался | выбор там, где человек правда стоит перед решением: у открытой двери вагона |
| крупные планы лиц | лица `simple` с выражением (`mood`), средние и крупные планы в ключевые моменты (scenes.md «лица:»); со спины — только как приём; пять вставок рук и вещей | решение владельца 2026-10-15 |
| играть на кларнете, танцевать, надеть пальто | кадры без этих движений (scenes.md «Движения») | модель движений их не даёт; подделывать тело нельзя |
| объятие при встрече — выбор | объятие всегда (выбора нет) | лимит 7–10 выборов; выбор «Галя» сильнее |
| Нина — только наперсница | нить Бусыгин — Нина: правда на переезде открывает ей выбор; в IV.2 при правде третий вариант «Останься. Не ради отца» (Кудимов понимает, отец — нет); крыльцо V.1 по `ninaIs`; при `for_me` она рядом с ним и на платформе, и за столом | у Вампилова на этой нити стоит второй акт: ложь «я брат» мешает самому Бусыгину |
| у Сильвы нет своего дна | одна реплика в темноте с дивана (Р118): свой отец, который пишет раз в год | своё, по намёку; зеркало безотцовщины Бусыгина |
| Кудимов «где-то встречались» | убрано; Р74 — «Нина сказала — у неё брат нашёлся. Поздравляю»: честный курсант поздравляет с ложью | ружьё без выстрела (проверка принципов С4) |
| кларнет разрешается только в одной концовке | разрешается только там, где Бусыгин остался **и за ним пришли** — по «Вместе» или по правде (`facts.tune`): в «Опоздал» — сразу, если дом держится и неправды было немного; если неправды много (`hurt`) или пришли только те, кого он связал правдой, а дом весь вечер был холодным (`came` `none`), — в доме обрывается и разрешается позже, издали, в эпилоге, как в «Всё равно». Остался, а не пришёл никто (только после слов Сильвы), — обрывается и в доме, и в эпилоге; при отъезде обрывается | разрешение — то, что случается в доме, где остались и где кто-то пришёл за ним, а не награда за «правильный» ответ; честная линия (почти вся правда — «Не рассказывала», «Не брать», «Уйти тайком»…) остужает дом, и её цена видна (табакерка на полке, отец у окна, пустой стул Нины, если отпустил её), но тех, кому он сам сказал правду, она приводит к нему настоящему; тепло после правды приходит не сразу (решение 2026-10-20, finish.md; принцип 4: ни одна концовка не идеальна) |
| рассказчик говорит только виденное | так и есть везде: Р82 убрана (мотив поджога виден — Васенька стоял под окном Макарской в I и смотрит с тёмного крыльца, как к ней входит Сильва, в IV); Р31 укорочен до видимого; в эпилоге Р111–Р114 («Нина уехала», «Васенька уехал») убраны — это видно вещами: Нины нет в окне и её стул пуст, Васенька с рюкзаком садится в первую электричку на рассвете (или платформа пуста) | принцип владельца 7 |
| 35–40 минут | ≈ 22 минуты по честному счёту (design.md «Объём») | при одной-двух фразах пьеса даёт столько; короткая игра — решение владельца, воды не добавляли |
| на платформу приходят по «Вместе» | и по «Вместе», и по правде: отец — если правду сказал сам Бусыгин, Нина — если знает её от него (переезд), Васенька — если признался сам; кто пришёл так, знает, кто он: Нина впереди, Васенька без рюкзака, отец без чемодана; если он уехал, а Нина осталась ради него, — в эпилоге она одна у окна | правда, сказанная самим, привязывает к нему настоящему; это не шкала семьи, а воля каждого (решение 2026-10-20, finish.md) |

Все реплики — свои, в тоне пьесы; по смыслу пьесы взяты: название оратории «Все люди — братья», «Я всё равно считаю
тебя своим сыном», «Я опоздал на электричку» (смысл финала). Добавленные персонажи без слов: соседи в окнах, медные,
провожающие.

## 11. Проверка веток (`bespoke/check/`)

`node bespoke/check/run.mjs <клон мира>` — без браузера, без движка, ничего не рисует.

- `fake.mjs` — поддельная `b`: `specOf(title)` отвечает из `scenes/*/scene.json` клона; остальное — пустышки. Шаги
  идут всухую тем же путём, что карта автора (`jump(Infinity, unheard(), {result})`, `context(…, j)`): без времени, выборы —
  из заданного состояния, мини-игры — подставленным итогом.
- Обход: все 1792 сочетания десяти выборов (`crossing` — 3 варианта; `kudimov` — 3 при `truth`, иначе 2: 2⁸ · (1·3 + 2·2)) с итогами `skipped`; плюс две партии с
  «живыми» итогами на оба края (`okna.knocked` [] и [1, 2, 3, 4, 5], `chai.spills` 1 и 2, `tsypochki.creaks` 0 и 2,
  `podRuku.falls` 0 и 1, `sledom.seen` 0 и 1, `ryukzak.slips` 0 и 2, `vyodra.buckets` 0 и 3, `begom.looks` 0 и 3,
  `steklo.wipe` 0.3 и 1 …): итоги выборов не меняют, но меняют ключи (`heard`, `snowy`, `seen`, `torn`, `shed_left`,
  `late_run`, `knocked`) — проверяется, что каждый из них дошёл до своей сцены и есть в её `party` или в
  строке куска. Плюс каждый шаг отдельно с пустым состоянием (пропущенные шаги: `facts` по умолчанию). Каждая партия — все
  22 шага подряд (пролог 1, I 4, II 6, III 2, IV 3, V 4, эпилог 2), состояние переходит из шага в шаг.
- Что записывает (обёртка над `j`): каждое `g.scene` (название и ключи), `g.beat`, `g.told`, `g.set/move/get` (ключ и
  значение для строковых ключей-действий), ключ предложения, `at` реплики, точки из таблицы §7, текст и говорящего
  каждой реплики, звуки, тосты шкал и меток.
- С чем сверяет — с блоком «Контракт для проверки» из `notes.md` каждой сцены и её `scene.json`: сцена есть; кусок
  есть; кусок идёт после своего `after` или открывает сцену (иначе — склейка: сообщить); момент есть у этого куска (или
  у ключа-действия в `acts` — моменты действий называются `<ключ>:<момент>`: `knock:hit`, `vyodra:full`, `down:slip`,
  `sar_go:look`); ключ есть в `states`; значение ключа-действия есть в `acts`; ключ партии из `carry` есть в
  `party`; точка и предложение есть; элемент предложения имеет `name`; говорящий есть в `PEOPLE`; звук есть в
  `sound.js` и в `unheard()`; поля `opts` и итога, которые глава даёт и читает, есть у мини-игры.
- Логику партии: на каждой партии ровно одна концовка; `scales.home` и `scales.lie` в своих пределах; каждая метка или
  выбор, который её поставил, читается в `facts` — список меток без читателя; `beat_next` стоит перед каждой склейкой в
  кусок, который в фильме сцены не следующий, и называет кусок, который правда играется следующим; Р100–Р103, Р106,
  Р110, Р115, Р116, Р119 сказаны только при своём условии; на лестнице платформы (`last`) — те, кого приводят «Вместе» и
  правда (отец, Нина, Васенька — по правилу §5, записанному в проверке заново, не из `facts`); фраза кларнета
  разрешается ровно там, где он остался и кто-то пришёл, и в доме — только при `came` ≠ `none` и без `hurt`; нет ни
  одного `b.offer` (на движке 3 выбор — язык мини-игр). «Состав» (его `game.js` в проверке не играется): ключи `shown`,
  `come` в `states` и в `keys` контракта, точки `c0`…`c7`, `author` в его `points`.
- Обратно: кусок, момент, ключ партии, точка, реплика из §8, которых не назвала ни одна партия (кроме `show: false`), —
  списком.
- Печатает: расхождения; список всех сказанных реплик без повторов (кто, текст) — по нему записывают голоса, а с §8
  его сверяет проверяющий; по каждой концовке и тем, кто на лестнице платформы, — список кусков по шагам и время: сумма `seconds` кусков, длин
  реплик **в паузах** (реплики по моменту внутри куска — в его длине) и `about` мини-игр, плюс 8 с на выбор, 12 с на карту партии
  и 1 с на открытие сцены (не замер: на стенде движка 3 было 6–19 с — work.md) — по главам и всего; каждый отрезок смотрения без действия дольше 90 с.
