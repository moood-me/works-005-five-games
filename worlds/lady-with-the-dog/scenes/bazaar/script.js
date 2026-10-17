// The Slaviansky Bazaar: the scene's mechanics. Its film in beats (lib.js film(scene), played by the world's module
// beats); the door's leaf turns by `door`; the party's `spring` — the snow or the thaw — shows at once; `think` turns
// their looks (“Taking counsel”).
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

function door() { scene.set('door_f', L.doorFacing(scene.get('door'))); }
scene.on('change', 'door', door);
scene.on('move', 'door', door);
function season() { scene.set('snowing', Number(scene.get('spring')) > 0.5 ? 0 : 1); }
scene.on('change', 'spring', season);
door();
season();

scene.on('change', 'think', t => {
  const l = L.looks(t);
  scene.set('gurov_look', l.gurov);
  scene.set('anna_look', l.anna);
});
