# Площадь (`main`)

Площадь Джанкальдо: пролог, главы I, II, III, V, эпилог (scenes.md «Площадь»). Движок 3, камера `roam`, кадры — ключи
`camera_*` (константы `CAM` в `lib.js`). Модули: `cast`, `kino`, `closeups`, `beats`, `nebo`.

Настроение: тёплая ночь прошлого — медовый камень, синие тени, янтарный луч, окошко будки, одно-два тёплых окна;
прохладный сиреневый 1988 год — серая известь, заколоченный «Парадизо», тёплое только окно матери; серое утро
похорон и сноса.

## Место (метры: x — поперёк, восток +; z — от южного края площади, север +; старт (0, 0), взгляд на север)

Всё в `lib.js` (`G`, `FRONTS`, `PAR`, `BANK`). Площадь x −12…12, z 0…26; улица к автобусу на юг (x −5…5, до z −34;
в конце — остановка); улица к морю в северо-восточном углу (x 9…12, на север), в её конце карточка моря с лунной
дорожкой (z 80, верх на уровне глаз). Запад: дом Альфредо (`alfredo_door`, z 0…6, дверь z 3, стул `alfredo_chair`
при `paradiso_state` `new`), «Парадизо» (`paradiso`, z 6…20: двери z 12, окошко будки z 16 на 6 м, афиши, козырёк
`canopy` с вывеской `canopy_front`), дом z 20…26. Север: дом с аркой и окном матери (`f_n1`; окно прорезано, за ним
`mother_window` — комната с лампой, Мария стоит в ней на невидимом полу на 4.05 м), белая глухая стена (`wall`,
x −5…5.5; фильм — `screen`, x −1…5, 2.5…6.5 м), часовня (`church`, x 5.5…9.1) и ступени `step1…4` + `steps` (x 3…8,
z 23…26, по 0.25 м). Восток: банк (`bank`, z 8…22, дверь z 13), балкон над дверью (`balcony` — ставни слоями,
`balcony_room` — тёплая комната за ними, `balcony_rail`, `balcony_slab`), стена с мелом (`chalk_wall`, у стула), стул
Тото (`chair`, x 11.3, z 15.6, ключ `chair_on`), гирлянда (`garland`). Фонтан (`fountain`, `fountain_col` — формы,
`fountain_water`, `fountain_spout`) в (0, 13), край 1.4 м. Фонари `lamppost` (копии) и их свет — точки в `lights`.

Окна, которые могут гореть, — у каждого фасада близнец `<id>_win` (`glows`): свет каждого окна — `e.light`, горит
0.3 + 0.6·`warm` ночью (0.65 того в сумерки), в 1988-м — нет; при `rewind` загораются по одному с `past`.

## Луч

`beam_anchor` (невидимый якорь в окошке будки) повёрнут в плане `beam_turn` и наклонён `beam_pitch` — их ставит
`script.js` из `beam_aim` (функция `beamOf`): конец луча идёт по камню и головам от пятна под окошком (0) к белой
стене (1). Сам луч (`beam`, `kino.beam` + шейдер мира `tools/kino-beam.wgsl`) — светящийся клин 18 м на якоре; что
длиннее пути, прячут камень или стена. Пятно на конце — свет сцены `beam_tip`, едущий по `tip_x/tip_z/tip_y`.
Прожектора-конуса в движке нет; луч и фары — светящийся клин со светом на кончике. Слои кадра на стене (`screen`):
`blur` / `sharp` по `beam_focus`, `white`, `burn` по `wall_burn`; свет стены — `wall_light` по `wall_lit` (ставит сцена,
когда на стене фильм и горит луч). В прологе (`beam_sky` 1) луч уходит над площадью вверх.

## Время и свет

`era` / `hour` — вид света: ключи `dusk_k`, `now_k`, `morning_k` (их ставит `from` куска через `LIGHT`), `rain`,
`wind_k`, `cold_k` (из `night_kind`, скрипт), `dust` (пыль сноса — тоже вид света), `flash` (вспышка: фейерверк,
конец перехода в прошлое). Небо — модуль мира `nebo` (луна над морем на 15° от севера). `past` — переход в прошлое,
только слоями (доски падают с дверей, вывеска загорается, окна по одному, нарисованная толпа проступает): куски
настоящего держат `past` 0, прошлого — 1; в конце `rewind` вспышка — склейка в ночь прошлого с людьми `c1…c9`.
`collapse` — фасад «Парадизо» (`charged`) рисуется четырьмя кусками-слоями, они оседают; окошко будки падает
последним; за ним — задняя стена соседнего дома (`par_back`).

## Люди

`toto` (облики `toto_boy`, `toto_teen`, `salvatore` — `toto_wear` объектом каста), `alfredo` (`alfredo`,
`alfredo_blind`), `maria` (`maria`, `maria_old`), `elena`, `daughter`, `madman` (`madman`, `madman_old`), `anna`,
`bearer1`, `bearer2`, толпа `c1…c10`. Нарисованные толпы — `crowd_far` (стоя) и `crowd_sit` (на камнях): одна
карточка на три ряда, её место — `crowd_x/z/f`, видна целиком (`crowd_k` 0 или 1; только `rewind` проявляет её).
Процессия: `cart` двигает якорь `hearse_anchor` (на нём `hearse` — задок с ручками `#handle_l`/`#handle_r`, `#rail`,
бока, верх с гробом); при `follow` 1 скрипт держит носильщиков, Анну и стариков на их местах за повозкой (они
идут её ходом — `walk_slow`, 0.6 м/с), при `sal_rail` 1 — и Сальваторе у её края.

Кусок за куском — `FILM` в `lib.js`: каждый `from` ставит всё, кроме ключей партии (`warm`, `place`, `with_mother`
— их ставит игра); `demolition` читает `place` и `with_mother` в `run`.

## Чего нет и что слабо

- Лица `simple` в стиле каста на среднем плане читаются слабо (мелкие и тёмные): нужен свет на лицо — у дверей
  «Парадизо» добавлен `porch_fill`; крупных планов лиц сцена сама не делает (кроме `midnight_close`).
- `pour`, `give_coins`, `phone_ear`, `cane_sit` — слабые движения каста: руки поддержаны `reach` (монеты вперёд,
  трубка у головы).
- Фейерверк — искры частиц над южными домами и свет `flash`; в кадре `BALCONY` их видно над крышами.
- Нажимаемые точки стоят по кадрам scenes.md; кадр `FOUNTAIN` отодвинут (−2.2, 9.3), чтобы край фонтана был в 2.9 м,
  как сказано (из (−1.5, 10.5) до края было 1.6 м). `EVE` — (−1, −8), яв 3.6 (из (0, −10) окошко будки закрывает дом
  улицы; так окошко и балкон оба в средних 4:3). `WIDE` — яв −8 (окошко будки дальше от края 4:3). `RUIN` — (6, 8), яв −85 (фонтан не перед фасадом). `BALCONY` — взгляд вверх 12°, чтобы балкон был в кадре.
  `stay_door` кончается, когда процессия уходит из середины кадра (`cart` 0.57); `widow_late` начинается склейкой —
  площадь уже пуста.

## Контракт для проверки

```json
{"beats": {
  "now_open": {"after":[],"tells":["now_open:window"],"seconds":10,"show":false},
  "rewind": {"after":["now_open"],"tells":["rewind:beam","rewind:past"],"seconds":13,"show":false},
  "after_show": {"after":[],"tells":["after_show:caught"],"seconds":13,"show":false},
  "alfredo_down": {"after":["after_show"],"tells":["alfredo_down:coins"],"seconds":9,"show":false},
  "coins_taken": {"after":["alfredo_down"],"tells":["coins_taken:take","coins_taken:gone"],"seconds":10,"show":false},
  "slap": {"after":["alfredo_down"],"tells":["slap:cut"],"seconds":7,"show":false},
  "paper": {"after":[],"tells":["paper:hand"],"seconds":24,"show":false},
  "crowd": {"after":[],"tells":["crowd:madman","crowd:shout"],"seconds":11,"show":false},
  "beam_out": {"after":[],"tells":["beam_out:ready"],"seconds":3,"show":false},
  "wall_film": {"after":["beam_out"],"tells":["wall_film:sit"],"seconds":17,"show":false},
  "smoke": {"after":[],"tells":["smoke:fire"],"seconds":8,"show":false},
  "outside": {"after":[],"tells":["outside:sat"],"seconds":13,"show":false},
  "new_sign": {"after":[],"tells":["new_sign:lit"],"seconds":12,"show":false},
  "door": {"after":[],"tells":["door:asked"],"seconds":8,"show":false},
  "go_together": {"after":["door"],"tells":["go_together:in"],"seconds":12,"show":false},
  "go_alone": {"after":["door"],"tells":["go_alone:in"],"seconds":10,"show":false},
  "dusk": {"after":[],"tells":["dusk:aim"],"seconds":8,"show":false},
  "seen": {"after":[],"tells":["seen:turned"],"seconds":3,"show":false},
  "film_on": {"after":["seen"],"tells":["film_on:door"],"seconds":10,"show":false},
  "hello": {"after":["seen"],"tells":["hello:met"],"seconds":16,"show":false},
  "story_door": {"after":[],"tells":["story_door:start","story_door:99","story_door:why"],"seconds":26,"show":false},
  "chair": {"after":[],"tells":["chair:sat"],"seconds":9,"show":false},
  "nights": {"after":["chair"],"tells":[],"seconds":3,"show":false},
  "eve": {"after":[],"tells":["eve:ready"],"seconds":9,"show":false},
  "midnight": {"after":["eve"],"tells":["midnight:open","midnight:hug"],"seconds":20,"show":false},
  "midnight_close": {"after":["midnight"],"tells":[],"seconds":5,"show":false},
  "girl": {"after":[],"tells":["girl:seen"],"seconds":17,"show":false},
  "follow": {"after":["girl"],"tells":["follow:gone"],"seconds":10,"show":false},
  "let": {"after":["girl"],"tells":["let:hand"],"seconds":10,"show":false},
  "funeral": {"after":[],"tells":["funeral:passing"],"seconds":18,"show":false},
  "walk_behind": {"after":["funeral"],"tells":["walk_behind:hand"],"seconds":15,"show":false},
  "widow": {"after":["walk_behind"],"tells":["widow:tin"],"seconds":10,"show":false},
  "stay_door": {"after":["funeral"],"tells":["stay_door:passed"],"seconds":13,"show":false},
  "widow_late": {"after":["stay_door"],"tells":["widow_late:tin"],"seconds":15,"show":false},
  "demolition": {"after":[],"tells":["demolition:whistle","demolition:blast"],"seconds":26,"show":false},
  "dust": {"after":["demolition"],"tells":["dust:madman"],"seconds":16,"show":false}
},
"points":["paradiso","paradiso#door","paradiso#booth_window","paradiso#poster","wall#screen","mother_window","balcony","bank#door","chalk_wall#chalk","hearse","hearse#handle_l","hearse#handle_r","hearse#rail","alfredo_door#door","canopy_front#marquee","toto","alfredo","maria","elena","daughter","madman","anna","bearer1","bearer2","c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","alfredo#hand_r","alfredo#pocket","toto#hand_l","toto#hand_r","toto#shoulder_r","toto#nape","elena#back","maria#hand_l","maria#hand_r"],"offers":["paradiso#booth_window","alfredo#hand_r","toto","alfredo","elena","balcony","daughter","hearse","chalk_wall#chalk","wall#screen"],"party":{"warm":0.5,"place":"crowd","with_mother":0},"keys":{"beat_next":"","beam_aim":0,"beam_focus":0,"wall_film":"none","beam_on":0,"chalk":0,"mark_chalk":0,"night_kind":"clear","elena_window":0,"poster":0,"full_sign":0,"viewfinder":0,"pan":0,"elena_x":1,"madman_x":-1,"rec":0}}
```
