# Ореанда (sonnet2)

Обрыв над морем перед рассветом. Камера `picture` позади скамьи (чуть сверху, `camera_pitch` -11, `camera_z` 0.9): их спины, море, пароход.
Люди в стиле `soft`/`rim`, лиц нет. Анна слева, Гуров справа (его левая рука тянется к `anna#hand_r`).

Устройство: `script.js` — куски (`BEATS`) как последовательности, ждут событий; ключ `beat` запускает кусок с начала, каждый
кусок сначала приводит сцену к известному состоянию (`base`). Рассвет `dawn` двигает свет (look `dawn`) и слои неба; `mist` — слой тумана;
`lights` 0..3 — три огня парохода (`e.glow`). `hand` 0/1 ставит `gurov_reach`.

Чего нет / честно: движения только `seated` и `rise` (модель); `watchman` ходит движком, палка — часть `stick` в cast.js (не проверена на глаз);
`hand` не проверялся на картинке; шпиц — один рисунок в двух слоях (лежит/стоит), не модуль `shpic`; цикада — только точка; звука нет;
сторож ближе к камере, чем «дальняя фигура».

## Контракт для проверки
```json
{"beats": {"bench": {"after": [], "tells": ["bench:sat"], "seconds": 12, "show": false},
 "still": {"after": ["bench"], "tells": [], "seconds": 2, "show": false},
 "watchman": {"after": ["still"], "tells": ["watchman:looks", "watchman:gone"], "seconds": 14, "show": false},
 "dew": {"after": ["watchman"], "tells": [], "seconds": 8, "show": false},
 "bench_end": {"after": [], "tells": [], "seconds": 12, "show": false}},
 "points": ["steamer#lights", "cypress#cicada", "anna#hand_r"],
 "offers": ["steamer#lights", "cypress#cicada", "anna#hand_r"],
 "party": {"dawn": 0, "mist": 1, "lights": 3, "cicada": 0, "hand": 0, "hour": 0.18, "beat": "bench"}}
```
