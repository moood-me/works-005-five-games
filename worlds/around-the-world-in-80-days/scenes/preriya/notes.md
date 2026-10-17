# The prairie (`preriya`) — NOT READY (stopped halfway, 2026-10-15)

Chapter III (rpg docs/vokrug-sveta/scenes.md, the prairie). The work stopped at the coordinator's word: the owner puts
the game on pause. The scene is in the branch but **does not play**: there is no `script.js` or `showcase.js`, most of
the elements have no painting. Nothing was rendered or checked (neither in node nor on the GPU).

## What there is

- `scene.json` — the full plan: 67 elements, the light and `looks` (`speed`, `wind_l`, `wind_r`, `snowing`, `dawn`,
  `night`), the sources (`sun`, `dawn_sun`, `moon`, `platform_lamp`, `depot_window`, `headlamp`, `car_windows`), all the
  keys in `states` with their meanings, the music (`scale` `A_FLAT_MAJOR_F_MINOR`), `relief` (`lib.ground`). It is
  made by the script `gen_scene.py` (python gen_scene.py scene.json) — edit the generator, not the JSON by hand.
- `lib.js` — the place's plan (`plan`), the ground (`ground`: a gorge across the line at −260, gentle rises far off),
  `ppX`, `sailFace` and **the whole film** (`film(scene)`): all 14 beats of scenes.md with `from` and `run`, the
  moments, and the showcase (`SHOWCASE`, `SHOWCASE_ONLY`: `under_show`, `sail_show`). The code has not been run.
- Paintings: only `sky` (+ animate: day, dawn, night, the moon, the stars, the clouds running with the train/the
  sledge) and `far` (+ animate: the far rises, running with a period of 2000 m).

## What there is not

- The paintings of all the other elements: `ground` (snow, the gorge's rocks, the river's ice), `river`, `rush`,
  `track_w`, `track_e` (their shader — sleepers running by the phase), `poles`, `scrub0..2`, the bridge (`bridge`,
  `bridge_far`, `bridge_deck`, `bridge_mid`), the train (`loco_side`, `loco_far`, `cab_floor` with the points
  `driver`/`pp`, `coupling` with the point `pin` and the pin's layer, `cars_side` with the points
  `middle`/`rear`/`lit`, `cars_far`, `chain` with the points `c0…c3` and `pp`, `rear_floor` with the points
  `fogg`/`pp`), `riders` (the points `gun1`, `gun2`, `hooves`), the station (`platform`, `platform_edge`, `depot` with
  `window` and a sign by `town`, `depot_side`, `depot_roof`, `lamp` with `flame`, `tank`), `fort` (the stockade/Omaha
  by `town`, the gate by `gate`, the point `chimney`), the sledge (`sledge_deck` with the point `mudge`,
  `sledge_side`, `sledge_back`, `mast` with a pennant by `wind`, `sail` with the points `clew`/`sheet`/`peak` and a
  layer by `sail_up`, `sheet_rope`), `ridge`, `wolves`.
- `script.js`: train_x → loco_x/cars_x (while not `cars_free`), `bridge_down` → `span_drop`/`span_tilt`/
  `bridge_splash`, the phase `swing_at` (led by the scene while Passepartout is under the cars), `pp_car` →
  Passepartout's hands to the chains and the moment `under:coupling`, `firing` → `shots`, `wind` → `wind_l`/`wind_r`
  and `sail_face`, `drift` → `ridge_x`, `wolves` → `wolves_x`, `sledge` → `omaha_near`, `snow_on_aouda` → Aouda's
  colours in steps, `speed` → `steam`, `sl_*` → who is in the sledge; `scene.kit.beats.play`.
- `showcase.js`.
- The cast's people `driver`, `captain`, `soldier`, `mudge` and the thing `rifle` — with London's author, the cast did
  not have them yet. The motion `knocked_down` (the engineer falls) — with «The deck»'s author.

## The intended design (for whoever goes on)

A panorama along the line (the rails at distance 22, the train goes to +across — east): on the left the gorge and the
wooden trestle of Medicine Bow (−292…−228, the middle span falls as a layer and the plane `bridge_mid`), in the
middle the plain, on the right the station of Fort Kearney (the platform 196…256 on the near side, the station, a
lamp, a water tank; beyond the line the fort's stockade at 72 m; `town: omaha` — the same platform as Omaha). The
train «on the spot» (`speed`): it stands, the shaders of the line and of the snow by the line run (`rush`,
`track_e`), the poles and the bushes (a layer of copies modulo the step), the rises (`far`), the clouds; the wind of
the look `speed` carries the smoke back. «The coupling»: the camera low by the wheels (`camera_h` −1.15, the operator
on Passepartout), Passepartout on his back (`lie_limp`) at the point `chain#pp`, his hands — to the chains
`chain#c0…c3`; `swing` — the sway, `swing_at` — the phase (led by the scene). «The sail»: the sledge by the line in the
middle of the plain, everything runs by `sl_speed`; the sail turns by `sheet` and `wind` (`sailFace`).

## Differences from scenes.md (intended)

- `stop_at` is set by the game before the beat `stop`: 0 — the cars at the platform, 1 — 130 m further.
- The minigames' keys in the `from` of the beats `under`/`sail` are set to their starting values: the game sets its
  own after `beat`.
- `snow_on_aouda` — the colours of her dress whiten in four steps (the cast has no part of its own for «snow on the
  shoulders»).
- `fogg_went`, `fogg_on_train`, `omaha_train` — 0/1, as in scenes.md.
