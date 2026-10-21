// «The route» — the view comes to the chapter shown: camera_x at its point (lib.js CHAPTERS) — at once as it opens (or
// is restored), over a second when the game names another chapter; `come` brings it back there from wherever the
// player dragged it.
const X = scene.lib.CHAPTERS;
const to = () => X[Math.max(0, Math.min(X.length - 1, Math.round(scene.get('shown') ?? 0)))];
scene.set('camera_x', to());
scene.on('change', 'shown', () => scene.move('camera_x', to(), { over: 1, ease: 'inOut' }));
scene.on('change', 'come', () => scene.move('camera_x', to(), { over: 1, ease: 'inOut' }));
