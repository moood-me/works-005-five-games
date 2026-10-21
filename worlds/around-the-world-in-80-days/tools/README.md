# Build tools (2026-10-15)

- `deck_scene.py` — writes `scenes/deck/scene.json`: `python tools/deck_scene.py scenes/deck/scene.json`.
  The Deck's spec is edited here, not in the JSON.
- `prairie_scene.py` — writes `scenes/prairie/scene.json`: `python tools/prairie_scene.py scenes/prairie/scene.json`. The same.
- `check-scene.mjs` — a dry run of an engine 3 scene's folder in node (a stand-in canvas; `tr` gives the English): `node tools/check-scene.mjs scenes/<folder>`.
- `castcheck.mjs` — builds all the cast's people with the engine's shapes, no GPU: `node tools/castcheck.mjs <rpg>/moood <this world>`.
