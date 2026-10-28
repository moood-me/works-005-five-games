# 2026-10-13 — «Алые паруса v3»: перенос мира и игры на движок 3

Ветка `e3-alye`. Мир `pavel/alye-parusa-v3` (из `alye-parusa-v2`, 7 сцен) и игра `pavel/alye-parusa-v3` на dev.
Порядок как в `pavel-zhur/rpg:moood/docs/agents/engine3-porting.md`: копия мира как есть (ветка `e2-import`), затем перенос (`port-e3`).

## Что менял перенос

- `"engine": 3` во всех семи сценях.
- Шейдеры GLSL → WGSL: 8 собственных (`dal` sea/fleet, `paluba` sea, `zamok-greev` candles/fire/firebox/floor_lamp/
  ship_painting) и два шейдера мира в `tools/` (`nebo-sky`, `korabl-cloth`), из которых генераторы пишут небо
  и паруса в сцены (49 файлов `elements/*.wgsl`). Генераторы (`tools/lib.js`, `korabl.js`, `nebo-sky.js`, `paluba.js`)
  и модули пишут теперь `.wgsl`. Проверка: `moood/dev/wgsl/check.mjs` на всех семи сценях — 10 текстов, без ошибок.
- Модуль `beats` — как в «Вокруг света v3»: игровая склейка готовится заранее (`scene.shot`, ключ `beat_next`).
- Сцены не требовали: `scene.prepare`, ключей камеры каждый кадр (в `dom-longrena` камера уже ведётся `scene.move`),
  `veil`, `light.people`, неподдерживаемых слов; `shadow.onto` — это тени, а не частицы.
- Игра: только комментарии (`game.json` и код как были).

## Что нашли при просмотре картинок и починили в движке

`animate`, который двигает слой `yard_*` у «Фок-мачты» «Палубы», получал предупреждение
`there is no layer "yard_fore_course"`: сцена меняет `ship` (Anselm → Secret), у кораблей разные реи, `animate`
видит новое состояние, а рисунок элемента ещё старый (перерисовка ждёт или в полёте). Движок молчит, пока у элемента
вообще нет рисунка; пока рисунок делается заново — должен молчать так же. `web/scene3/world/element.js`:
предупреждение о слое и о свечении (`e.glow`) — только когда рисунок не ждёт и не в работе (`el.toPaint`, `el.job`).
Сцену не меняли.
