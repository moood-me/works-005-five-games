// Inside the second car: its wall round the last window before the front vestibule, seen from within (the card faces
// into the car, its x toward the train's tail); the frost on the glass — the layer the shader rubs a hole in (`wipe`).
// Painted only while the camera rides the train (camera_on: a cut sets it): from the platform it is not to be seen.
if (e.state.camera_on === 'train') e.kit.trains.train_window(g, e, { w: e.kit.trains.ELECTRIC.winW, h: 0.95, sill: 0.9, tall: 3.0, wall: [-1.3, 4.5] });
