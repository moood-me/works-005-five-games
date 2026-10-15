# Палуба (`paluba`) — НЕ ГОТОВА (остановлено 2026-10-15 по паузе игры)

Новая сцена главы I–IV (docs/vokrug-sveta/scenes.md «Палуба»). Работа остановлена на середине: есть замысел, план,
`scene.json` (все элементы, ключи, свет, музыка), `lib.js` (план корабля, цвета, части «Генриетты», куски фильма),
и рисунки неба, моря, порта, дыма «Китая», причала, пакгаузов, сходней. **Ни разу не рендерилась и не проверялась**
(даже прогоном в node). Сцену на стенде пока не открывать как готовую.

## Замысел (решено)

- Корабль стоит в мире; ход — это море (шейдер `sea.wgsl` гонит барашки назад по `speed`, фаза — `sea.animate.js`).
  Метры корабля: `distance` — вперёд по килю (нос ~+46), `across` — к правому борту. Палуба — земля (0), море −5.5,
  причал −2.6 справа (`relief`). Камера `walk` стоит у юта и смотрит вперёд; людей кадрирует оператор
  (`camera_target` на людей или на невидимые точки между ними: `night_two`, `fix_consul`, `two_pacific`,
  `calendar_three`, `coal_three`, `bridge_two`).
- Один набор элементов на четыре корабля (`ship`): рисунки читают `ship` и `port` (меняются только склейкой).
- Порт (`port`) — далёкий силуэт справа по носу (`port_far`, `lib.skyline`), для suez / new_york / liverpool ещё
  причал (`quay`), пакгаузы (`sheds`) и сходни (`gangway`, walk-плоскость: констебли поднимаются по ней).
- Свет: день (солнце сзади-справа `sun_day`), `dawn` (низкое солнце справа по носу, `sky#sun`), `night` (луна
  справа `sky#moon`, лунная дорожка — зеркало моря; фонарь `lantern` у людей у борта), `fog` (Ливерпуль); огонь
  люка `fire_light`, вспышка `flare_light`.
- «Котлы» (`burn`): вид с юта высоко (`lib.BURN_VIEW`), все части видны. Части — `PARTS` в lib.js: каждая на своём
  якоре с ключами места `at_<part>_a/_d/_e`; по `drag_<part>` скрипт должен ставить их (`lib.partAt`), animate —
  уменьшать (`lib.partAnimate`), мачта валится на бок (`lib.fallOf`), `locked_*` — тусклее, 0 — исчезает, вспышка
  (`flare` — номер вспышки, `flare_glow`).
- Камера (`cell`) — маленькая комната далеко справа (across 400, вне кадров палубы), туда склейка `camera_x`;
  `cell` — вставка `cell_close`, `release` — Фикс вбегает (настоящие люди).

## Что есть

| Файл | Состояние |
| --- | --- |
| `scene.json` | все элементы, люди (10: fogg, passepartout, aouda, fix, consul, sailor, speedy, stoker, policeman, policeman_2), ключи и `states`, свет и looks, музыка (`A_FLAT_MAJOR_F_MINOR`). Собран скриптом (вне репозитория) — дальше править сам JSON |
| `lib.js` | план, цвета кораблей, части и их движение, силуэты портов, **все куски** (`film`): suez, bombay, rail_night, plaid, writes, pacific, punch, shake, calendar, new_york, mutiny, coal, burn, queenstown, sails_only, liverpool, cell, release, fix_down, fix_hand — написаны, не проверены |
| `elements/` | `sky` (+animate), `sea` (+animate, wgsl), `port_far`, `china`, `quay`, `sheds`, `gangway` |

## Чего нет

- Рисунков остальных элементов (в `scene.json` они есть, кода нет — пустые): `deck`, `bulwarks`, `bulwarks_s`,
  `gunwale`, `gunwale_s`, `bow`, `speedy_cabin`, `speedy_cabin_side`, `cabin_roof`, `deckhouse`, `deckhouse_side`,
  `house_roof`, `bridge_rail`, `calendar` (лист `leaf`, «СРЕДА», точка `calendar#leaf`), `funnel` (точка
  `funnel#top`), `mast_main`, `mast_fore`, `yards`, `yards_fore` (паруса по `sails`), `hatch` (точка `hatch#fire`),
  `hatch_glow`, `bunks`, `boats`, `paddle_box`, `walking_beam`, `lantern` (точка `lantern#lamp`), `deckchair`,
  вставки `porthole` (Спиди ревёт в иллюминатор) и `cell_close` (скамья, часы, тень решётки по `cell_time`), стены
  камеры `cell_*` и дверь (`door`). Точки `<part>#part` для «Котлов» ставятся в этих рисунках — их ещё нет.
- `script.js` (размещение частей по `drag_*`, вспышка при 0, `speedy_grief` → руки к голове, wear по ключам игры,
  `scene.kit.beats.play`), `showcase.js` (в lib.js `SHOWCASE` ссылается на ещё не написанные `burn_show`,
  `cell_show` — их нет), animate элементов.
- Люди каста `consul`, `sailor`, `speedy`, `stoker`, `policeman`, вещи `notebook`, `plaid`, `plaid_shoulders`
  (плед на плечах Ауды — нужен в касте), крылья Паспарту и синяк Фикса (`kit.cast.wear.pp_wings / fix_bruise` —
  так их ждёт `lib.film`; как даст каст — поправить).
- Движения каста, которые куски зовут: `punch`, `knocked_down`, `laugh`, `spread_hands`, `salute`, `whisper`,
  `write_note`, `shovel` — заказаны в make_motion (ключи ниже), не просмотрены и не положены в `cast.data.json`.
  make_motion: punch `e6b110bc218b67577df72748d77fe35b6f915ef7`, knocked_down
  `5af08d051c5ecd83b593cb144898b33966ce1478`, laugh `79e4aeec4cdf5103283bd995822222b41275b7ff`, spread_hands
  `48183812c681a3f431b2bc18618899b4e5448291`, salute `cda91ec955dd11586b69a038c36efe32bbaf0da7`, whisper
  `fbfe74190364ac4498c7d9857265aa29da37eefa`, write_note `ffc97b4e9a43fa76229ba49f923f41d5e2f67a30`, shovel
  `ad0cb24c55f82a7ec8641a0f281ba8b9f76c0f00`.

## Отличия от scenes.md (задуманные)

- Ключ вставки камеры — `cell_close` (ключ `cell` — имя куска); `release` — кусок, плюс куски `fix_down`,
  `fix_hand`; если `release` (ключ) поставлен до куска, кусок сам доигрывает исход.
- Шлюпки — на кильблоках поперёк палубы между люком и рубкой (на шлюпбалках с юта их не видно).
- Добавлены ключи: `flare`, `flare_glow`, `door`, `leaf`, `at_<part>_a/_d/_e` (ведёт сцена).
- Моменты — как в scenes.md; своих не добавлено.

## Сомнительно

- Морская плоскость с `reflect` и своим шейдером сразу — не проверено, что движок берёт оба.
- Направление `rotation` у сходней (270) и наклон — на глаз, не проверено.
- Расстановки людей в кусках (`lib.SPOT`) посчитаны, не видены; Ливерпуль — Фогг стоит спиной к камере, переставить.
