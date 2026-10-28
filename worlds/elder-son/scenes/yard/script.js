// the view comes to the chapter shown: camera_x at shown·SPACING — at once as it opens (or is restored), over a second
// when the game names another chapter; each new `come` brings it back there from wherever the player dragged it
const SPACING = 5; // m between the chapters' points (c0…)
const s = scene;
s.set('camera_x', (s.get('shown') ?? 0) * SPACING);
s.on('change', 'shown', v => s.move('camera_x', (v ?? 0) * SPACING, { over: 1, ease: 'inOut' }));
s.on('change', 'come', () => s.move('camera_x', (s.get('shown') ?? 0) * SPACING, { over: 1, ease: 'inOut' }));
