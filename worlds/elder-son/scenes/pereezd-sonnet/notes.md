# Переезд (sonnet)

Ночной железнодорожный переезд за посёлком. Один движок-3 набросок для сравнения.

- Мир: одна плоскость `land` (снег, дорога, пути, настил), небо, посёлок и лес далеко (светятся), будка с тёплым
  окном (`booth_window` — единственный тёплый свет), светофор `signal` (мигает по `bell`), шлагбаум `barrier`
  (слой `arm` по `barrier`), товарный `freight` (один длинный лист вдоль пути; место по `freight` считает скрипт —
  `lib.js: loco`), далёкая электричка `electric_far` (ключ `electric`).
- Люди: `busygin`, `nina` из модуля `cast` (стиль `zima` от `shadow`, `paint: rim`, лиц нет).
- Куски: `wait`, `truth`, `roar`, `brother` (script.js). Моменты: wait:light, truth:said, truth:passed, roar:loud,
  roar:passed, brother:arm, brother:passed.
- Состояние по умолчанию — конец `wait`: шлагбаум опущен, огни мигают, фара на дуге, оба у шлагбаума.

## Контракт для проверки

```json
{"beats": {"wait": {"after": [], "tells": ["wait:light"], "seconds": 20, "show": false},
 "truth": {"after": ["wait"], "tells": ["truth:said", "truth:passed"], "seconds": 28, "show": false},
 "roar": {"after": ["wait"], "tells": ["roar:loud", "roar:passed"], "seconds": 28, "show": false},
 "brother": {"after": ["wait"], "tells": ["brother:arm", "brother:passed"], "seconds": 26, "show": false}},
 "points": ["nina", "freight#light", "barrier"], "offers": ["nina", "freight#light", "barrier"],
 "party": {}, "acts": {}}
```
