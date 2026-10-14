# Пристань (sonnet)

Каменный мол (10 м шириной) уходит от зрителя к фонарю; слева — стена склада с дверью, лампой и скамьёй; у корня — стол с
проектором, ящик; в конце — экран на шестах, четыре ряда стульев (копии одной картины), лодки по сторонам. Камера
`roam`, зритель стоит у корня мола; горизонт 0.42. Всё нарисовано раз; движут слои, `animate`, свет и скрипт.

Устройство: люди и ящик Елены — от `modules/cast.js` (облики; движения `seated`, `run`, `rise` — Kimodo).
Нарисованные зрители — `audience` (копии) и слой `viewers` у `boats`. Луч — клин `glows` слоем `add` с огоньком на
кончике (`beam`); фары — такой же клин на плоскости, привязанной к машине (`wedge`, `on: car`). Прожектора-конуса в
движке нет; луч и фары — светящийся клин со светом на кончике.

Скрипт (`script.js`): `beat` → кусок: `from` (склейка в известное состояние, если предыдущий кусок не в `after`), потом
`run` — последовательность, ждущая событий; в конце `beat:<имя>`. Выведенные ключи: `dusk_k` (из `hour`), `now_k` (из
`era`), `car_z` (из `car_go`).

Чего нет (честно):
- `sit_down` не делался (лимит трёх движений): в `back` оба уже сидят на скамье, в `found`/`alone` Тото уже на тумбе.
- Машина всегда подъезжает и уезжает по молу вдоль правой стороны (дорога за спиной зрителя); «фары уходят к дороге»
  — уходят вперёд по молу в темноту, а не к дороге.
- Нет дальней дороги вдоль берега и города; нет модуля `nebo` (небо — слои самого элемента `sky`).
- Нет кадра `elena8`, плёнка — нарисованные силуэты без лиц.

## Контракт для проверки

```json
{"beats": {
  "summer": {"after": [], "tells": ["summer:screen", "summer:rain"], "seconds": 18, "show": false},
  "covered": {"after": ["summer"], "tells": ["covered:done"], "seconds": 6, "show": false},
  "headlights": {"after": ["covered"], "tells": ["headlights:father", "headlights:turn"], "seconds": 14, "show": false},
  "found": {"after": [], "tells": ["found:run", "found:hug"], "seconds": 20, "show": false},
  "alone": {"after": [], "tells": ["alone:sea"], "seconds": 10, "show": false},
  "back": {"after": [], "tells": ["back:sat"], "seconds": 22, "show": false},
  "rise_go": {"after": ["back"], "tells": ["rise_go:gone"], "seconds": 6, "show": false},
  "car": {"after": [], "tells": [], "seconds": 12, "show": false},
  "meet": {"after": ["car"], "tells": ["meet:turned"], "seconds": 10, "show": false},
  "ask": {"after": ["meet"], "tells": ["ask:hand"], "seconds": 8, "show": false},
  "bye": {"after": ["meet"], "tells": ["bye:nod"], "seconds": 6, "show": false},
  "parting": {"after": ["ask", "bye"], "tells": ["parting:gone"], "seconds": 12, "show": false}},
 "points": ["projector", "toto", "elena", "screen#screen", "projector#lens", "sky#disc", "lantern#lamp"],
 "offers": ["projector", "toto", "elena"],
 "party": {},
 "keys": {"beat": "summer", "beat_next": "", "hour": 0.9, "era": "past", "rain": 0, "screen_up": 1, "screen_film": "romance",
  "beam_on": 1, "cover": 0, "car": "none", "headlights": 0, "car_go": 0}}
```
