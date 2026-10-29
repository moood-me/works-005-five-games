// Lights — the play's map: the view comes to the chapter shown (camera_x at shown·SPACING) — at once as it opens (or is
// restored), over a second when the game names another chapter; `come` brings it back there from wherever the player
// dragged it. The season's weather in the air: snow in the winter, a fine drizzle in the thaw.
const L = scene.lib;
const s = scene;
s.set('camera_x', (s.get('shown') ?? 0) * L.SPACING);
s.on('change', 'shown', v => s.move('camera_x', (v ?? 0) * L.SPACING, { over: 1, ease: 'inOut' }));
s.on('change', 'come', () => s.move('camera_x', (s.get('shown') ?? 0) * L.SPACING, { over: 1, ease: 'inOut' }));

function weather() {
  const season = L.seasonOf(s.get('season'));
  s.set('snowing', season === 'winter' ? 1 : 0);
  s.set('drizzle', season === 'thaw' ? 1 : 0);
}
s.on('change', 'season', weather);
weather();
