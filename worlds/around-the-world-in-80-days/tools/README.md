# Инструменты сборки (2026-10-15)

- `paluba_scene.py` — пишет `scenes/paluba/scene.json`: `python tools/paluba_scene.py scenes/paluba/scene.json`.
  Правка спецификации Палубы — здесь, не в JSON. (У Прерии генератор лежит в её папке: `scenes/preriya/gen_scene.py`.)
- `check-scene.mjs` — сухой прогон папки сцены движка 3 в node (подставной холст): `node tools/check-scene.mjs scenes/<папка>`.
- `castcheck.mjs` — строит всех людей каста формами движка, без GPU: `node tools/castcheck.mjs <rpg>/moood <этот мир>`.
