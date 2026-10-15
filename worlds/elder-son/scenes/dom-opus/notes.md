> **НЕДОДЕЛАНО — работа остановлена на полпути (ветка ss/dom, 2026-10-15); влито в env/malay/three и env/dev как есть, на паузе.**
> Сделано: `lib.js` переписан под план scenes.md (x/z плана, across = x − 2; стол торцом к окну, шесть мест, раскладушка,
> диван, дверь Сарафанова со щелью и его лампа, путь «На цыпочках», дальний поезд и фигура за окном — ключи), кадры
> всех кусков числами (`CAM`), `film(scene)` — таблица модуля beats со всеми 33 кусками (from/after/run), облики из
> `kit.cast.characters`, части в руках вместе с частями облика (`hold`/`WITH`). `tools/dom-opus/gen.mjs` переписан
> (новые элементы, ключи, states, вставки hands/tea/box, модули cast/beats/closeups), но **ещё не запускался**:
> `scene.json` — старый, `script.js` зовёт старый API — сцена на этой ветке сломана. Не сделано: `script.js` (beats.play,
> door_f, sar_door_f = 270 − 90·sar_door, far_train_x, sneak/sneak_at/stir), `showcase.js`, рисунки новых элементов (window с WGSL-дырой hole, window_frame, sar_door,
> sar_room, table/table_end/table_side, cot, cot_top, cot_chair, case_chair, coat_chair, rucksack_door, far_train,
> father_far; правки stove/hook/clock/cupboard/k_back/r_right под новый план), прогон в node, рендер, блок контракта.
> Ниже — описание прежней версии; оно уже не равно коду.

# Дом Сарафановых (opus)

Главы I–II: кухня под оранжевым абажуром и комната за дверным проёмом, ночь. Движок 3, камера `roam` (`area` по
кухне и комнате), кадры — ключами `camera_x/z/yaw/h`. Модуль `cast` (`izby` и `poezd` не нужны: вид из окна —
своя карточка `outside`). `scene.json` пишет генератор `tools/dom-opus/gen.mjs` из `lib.js`.

## Как устроено

- **План** (across = x − 2 плана scenes.md, distance = z): кухня across −2…2, distance 0…4; комната 2…6. Стены —
  карточки лицом внутрь (`k_back` с прорезанным окном, `k_left`, ближняя — три куска вокруг двери, правая — два куска
  и перемычка вокруг проёма; `r_*` комнаты), пол (по нему ходят), потолок (плоскость лицом вниз). Краска стен — общая
  `lib.kitchenWall` (зелёная масляная до 1.2 м, побелка) и `lib.roomWall` (обои).
- **Окно** `window` (иней по `frost`, рама, занавеска; точки `window`, `window#pane`), за ним огороды, платформа с
  фонарями (`outside`, `yard`) и небо. **Дверь** `door` на петле (`door_f` = 80·`door`), за ней тёмные сени.
- **Печь** `stove` у левой стены: дверца — слой, открывается по `stove_door`, огонь — свет `fire` (`on:
  stove_door`); точка `stove#door`. **Стол** с клеёнкой: хлебница, два стакана, табакерка при `box_at` table; точки
  `table#bread`, `table#glass`, `table#box`. Абажур: его стекло оранжевое (светится), свет `lamp` — тёпло-белый,
  `on: lamp` (= 0.6 + 0.4·`warm`, скрипт). Стулья у торцов стола — места `SEAT.l`, `SEAT.r`. Часы-ходики (маятник —
  слой). Вешалка `hook` (пальто при `coat_b` hook; точка `hook#coat`), табурет у двери (шапка — `hat_on_stool`),
  **буфет** `cupboard` в комнате за проёмом (табакерка на полке при `box_at` shelf; точки `cupboard#box`,
  `cupboard#shelf`), диван, рюкзак Васеньки у его стула (`rucksack`).
- Облик по куску — `<id>_wear: {who: …}` (Бусыгин в рубашке, Сарафанов с шапкой в руке, Сарафанов дома).

## Куски

- `kitchen` (≈ 16 с, склейкой): дверь; входят Васенька, Сильва, Бусыгин; Васенька садится (рюкзак у стула), Сильва
  садится и тянется к хлебнице, Бусыгин к печи, открывает дверцу (`reach`), руки к огню (`warm_hands`) —
  `kitchen:stove`. Вставки `hands` нет.
- `warm_up` (≈ 6 с, после `kitchen`): поворачивается к столу — `warm_up:turn`.
- `enter` (≈ 20 с, склейкой): дверь, Сарафанов с шапкой в руке — `enter:in`; Сильва встаёт; шапка на табурет
  (`reach_put`); он идёт к Бусыгину; склейка (готовится заранее) в близкий кадр двоих в профиль против абажура —
  `enter:near`.
- `embrace` (≈ 8 с, после `enter`): шаг вплотную, `hug` и руки к `busygin#back`, его руки к `sarafanov#back` —
  `embrace:held`; Сильва садится.
- `box_out` (≈ 20 с, склейкой): за столом (камера с ближней стороны, наискосок); встаёт, в комнату к буфету, берёт
  табакерку (`box_at` none, часть `box_held`), садится, ставит на клеёнку (`box_at` table) — `box_out:down`. Поза под
  выбор: `table#box` (x ≈ 0.42) и `sarafanov` (≈ 0.60).
- `box_take`, `box_give` (≈ 3 с, после `box_out`): рука к табакерке — `box_take:close` / `box_give:close`; дальше
  должна быть вставка `box` модуля `closeups` — её в мире нет.
- `box_kept` (≈ 7 с, после `box_take`): табакерки нет, рука к груди — `box_kept:back`.
- `box_back` (≈ 15 с, после `box_give`): табакерка в его руке, к буфету, на полку — `box_back:shelf`, стоит спиной.

## Чего нет / открыто

- Вставки (`hands`, `tea`, `box`) — модуля `closeups` нет. Куски `nina_in`, `supper`, `supper_after`, `talk`,
  `talk_back`, `galya_*`, `wall`, `wake`, `sneak`, `caught`, `window_watch`, `morning`, `table`, `toast`, `let_go`,
  `ask_stay`, `for_me`, `pack`, `confess`, `exposed`, `go_out`, `home_late`, `home_anyway`; раскладушка, `sar_door`,
  `sar_light`, `far_train`, `hole`, `sneak`, `stir`; `coat_b` cot/arm/chair — не сделаны.
- Движений `take_shelf`, `put_shelf` нет — рука к полке (`reach`).
- Вход в кухню снят из угла у двери: входящие проходят близко к объективу (первые секунды — крупный тёмный силуэт).

## Контракт для проверки

```json
{"beats": {"kitchen": {"after": [], "tells": ["kitchen:stove"], "seconds": 16, "show": false},
 "warm_up": {"after": ["kitchen"], "tells": ["warm_up:turn"], "seconds": 6, "show": false},
 "enter": {"after": [], "tells": ["enter:in", "enter:near"], "seconds": 20, "show": false},
 "embrace": {"after": ["enter"], "tells": ["embrace:held"], "seconds": 8, "show": false},
 "box_out": {"after": [], "tells": ["box_out:down"], "seconds": 20, "show": false},
 "box_take": {"after": ["box_out"], "tells": ["box_take:close"], "seconds": 3, "show": false},
 "box_give": {"after": ["box_out"], "tells": ["box_give:close"], "seconds": 3, "show": false},
 "box_kept": {"after": ["box_take"], "tells": ["box_kept:back"], "seconds": 7, "show": false},
 "box_back": {"after": ["box_give"], "tells": ["box_back:shelf"], "seconds": 15, "show": false}},
 "points": ["table#box", "table#glass", "table#bread", "sarafanov", "busygin", "window", "window#pane", "stove#door", "hook#coat", "cupboard#box"],
 "offers": ["table#box", "sarafanov"],
 "party": {"warm": 0.36, "frost": 0.25},
 "acts": {}}
```
