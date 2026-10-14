# Переезд (sonnet3)

Собрано генератором `tools/make-pereezd.js` (правь его, не файлы сцены). Камера picture, горизонт 0.4, пути наискосок (ломаная в `lib.js`),
товарный — 15 карточек, которые скрипт ведёт по пути (`c<i>_a/_d/_f`). Люди: `busygin`, `nina` (модуль `cast`, стиль shadow/rim).

Чего нет: движений из модели (только стоять, повернуться, идти, смотреть); «наклон» Нины — поворот к нему; тело поезда на дальней
дуге видно с торца (ребро карточки), там читается только фара; модуль `beats` не копировался — куски запускает скрипт сцены по ключу `beat`;
`closeups`, `izby`, `poezd` как модули не делались — их вещи внутри сцены.

## Контракт для проверки
```json
{"beats": {"wait": {"after": [], "tells": ["wait:light", "beat:wait"], "seconds": 22, "show": false},
 "truth": {"after": ["wait"], "tells": ["truth:said", "truth:passed", "beat:truth"], "seconds": 36, "show": false},
 "roar": {"after": ["wait"], "tells": ["roar:loud", "roar:passed", "beat:roar"], "seconds": 36, "show": false},
 "brother": {"after": ["wait"], "tells": ["brother:arm", "brother:passed", "beat:brother"], "seconds": 36, "show": false}},
 "points": ["nina", "freight#light", "barrier", "busygin"],
 "offers": ["nina", "freight#light", "barrier"],
 "party": {},
 "acts": {}}
```
