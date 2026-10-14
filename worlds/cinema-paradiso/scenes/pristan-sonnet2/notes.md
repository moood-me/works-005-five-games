# Пристань (sonnet2)

Ночь, мол уходит к фонарю, экран на шестах справа, проектор на столе у склада. Куски: summer, covered, headlights,
found, alone. Нет: back, rise_go, car, meet, ask, bye, parting (эта сцена — один круг, не весь контракт).

Нет движений каста: все люди — только stand и walk. «Сидит» и «бежит» заменены стоянием и ходьбой;
Тото «сидит на тумбе» — стоит у тумбы спиной. Прожектора-конуса в движке нет; луч и фары — светящийся клин со светом на кончике.

## Контракт для проверки

```json
{"beats": {"summer": {"after": [], "tells": ["summer:screen", "summer:rain"], "seconds": 22, "show": false},
 "covered": {"after": ["summer"], "tells": ["covered:done"], "seconds": 6, "show": false},
 "headlights": {"after": ["covered"], "tells": ["headlights:father", "headlights:turn"], "seconds": 14, "show": false},
 "found": {"after": [], "tells": ["found:run", "found:hug"], "seconds": 14, "show": false},
 "alone": {"after": [], "tells": ["alone:sea"], "seconds": 9, "show": false}},
 "points": ["toto", "elena", "table#projector", "lantern#lamp"], "offers": [],
 "party": {}, "keys": {"beat": "summer", "era": "past", "rain": 0, "screen_up": 1, "screen_film": "romance", "beam_on": 1, "cover": 0, "car": "none", "headlights": 0, "car_go": 0, "beat_next": ""}}
```
