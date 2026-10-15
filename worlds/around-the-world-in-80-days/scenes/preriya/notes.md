# Прерия (`preriya`) — НЕ ГОТОВА (остановлена на середине, 2026-10-15)

Глава III (rpg docs/vokrug-sveta/scenes.md, «Прерия»). Работа остановлена по слову координатора: владелец ставит игру
на паузу. Сцена в ветке, но **не играется**: нет `script.js` и `showcase.js`, у большинства элементов нет рисунка.
Ничего не рендерилось и не проверялось (ни в node, ни на GPU).

## Что есть

- `scene.json` — полный план: 67 элементов, свет и `looks` (`speed`, `wind_l`, `wind_r`, `snowing`, `dawn`, `night`),
  источники (`sun`, `dawn_sun`, `moon`, `platform_lamp`, `depot_window`, `headlamp`, `car_windows`), все ключи в
  `states` с описанием, музыка (`scale` `A_FLAT_MAJOR_F_MINOR`), `relief` (`lib.ground`). Он собирается скриптом
  `gen_scene.py` (python gen_scene.py scene.json) — правьте генератор, не JSON руками.
- `lib.js` — план места (`plan`), земля (`ground`: ущелье поперёк пути у −260, пологие увалы вдали), `ppX`, `sailFace`
  и **фильм целиком** (`film(scene)`): все 14 кусков scenes.md с `from` и `run`, моменты, плюс показ (`SHOWCASE`,
  `SHOWCASE_ONLY`: `under_show`, `sail_show`). Код не прогонялся.
- Рисунки: только `sky` (+ animate: день, рассвет, ночь, луна, звёзды, облака бегут с поездом/санями) и `far` (+ animate:
  дальние увалы, бегут периодом 2000 м).

## Чего нет

- Рисунков всех остальных элементов: `ground` (снег, скалы ущелья, лёд реки), `river`, `rush`, `track_w`, `track_e`
  (их шейдер — шпалы, бегущие по фазе), `poles`, `scrub0..2`, мост (`bridge`, `bridge_far`, `bridge_deck`, `bridge_mid`),
  поезд (`loco_side`, `loco_far`, `cab_floor` с точками `driver`/`pp`, `coupling` с точкой `pin` и слоем пальца,
  `cars_side` с точками `middle`/`rear`/`lit`, `cars_far`, `chain` с точками `c0…c3` и `pp`, `rear_floor` с точками
  `fogg`/`pp`), `riders` (точки `gun1`, `gun2`, `hooves`), станция (`platform`, `platform_edge`, `depot` с `window` и
  вывеской по `town`, `depot_side`, `depot_roof`, `lamp` с `flame`, `tank`), `fort` (частокол/Омаха по `town`, ворота
  по `gate`, точка `chimney`), сани (`sledge_deck` с точкой `mudge`, `sledge_side`, `sledge_back`, `mast` с флажком по
  `wind`, `sail` с точками `clew`/`sheet`/`peak` и слоем по `sail_up`, `sheet_rope`), `ridge`, `wolves`.
- `script.js`: train_x → loco_x/cars_x (пока не `cars_free`), `bridge_down` → `span_drop`/`span_tilt`/`bridge_splash`,
  фаза `swing_at` (ведёт сцена, пока Паспарту под вагонами), `pp_car` → руки Паспарту к цепям и момент
  `under:coupling`, `firing` → `shots`, `wind` → `wind_l`/`wind_r` и `sail_face`, `drift` → `ridge_x`, `wolves` →
  `wolves_x`, `sledge` → `omaha_near`, `snow_on_aouda` → цвета Ауды шагами, `speed` → `steam`, `sl_*` → кто в санях;
  `scene.kit.beats.play`.
- `showcase.js`.
- Люди каста `driver`, `captain`, `soldier`, `mudge` и вещь `rifle` — у автора Лондона, в касте их ещё не было.
  Движение `knocked_down` (машинист падает) — у автора «Палубы».

## Задуманное устройство (для того, кто продолжит)

Панорама вдоль пути (рельсы на distance 22, поезд идёт к +across — на восток): слева ущелье и деревянная эстакада
Медисин-Боу (−292…−228, средний пролёт падает слоем и плоскостью `bridge_mid`), посередине равнина, справа станция
форта Керни (платформа 196…256 на ближней стороне, станция, фонарь, водокачка; за путём частокол форта на 72 м;
`town: omaha` — тот же перрон как Омаха). Поезд «на месте» (`speed`): стоит, бегут шейдеры пути и снега у пути (`rush`,
`track_e`), столбы и кусты (слой копий по модулю шага), увалы (`far`), облака; ветер look `speed` уносит дым назад.
«Сцепка»: камера низко у колёс (`camera_h` −1.15, оператор на Паспарту), Паспарту на спине (`lie_limp`) на точке
`chain#pp`, руки — к цепям `chain#c0…c3`; `swing` — размах, `swing_at` — фаза (ведёт сцена). «Парус»: сани у пути
посередине равнины, всё бежит по `sl_speed`; парус поворачивается по `sheet` и `wind` (`sailFace`).

## Отличия от scenes.md (задуманные)

- `stop_at` ставит игра до куска `stop`: 0 — вагоны у платформы, 1 — на 130 м дальше.
- Ключи мини-игр в `from` кусков `under`/`sail` ставятся в начальные значения: игре ставить свои после `beat`.
- `snow_on_aouda` — цвета её платья белеют четырьмя шагами (своей части «снег на плечах» в касте нет).
- `fogg_went`, `fogg_on_train`, `omaha_train` — 0/1, как в scenes.md.
