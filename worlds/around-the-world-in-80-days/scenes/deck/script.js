// «The deck» — its mechanics. The «Henrietta»'s parts go where their drag says (`drag_<part>` → the anchor's place,
// at_<part>_a/_d/_e: lib.partAt); a part gone into the hatch (its key → 0) flares there (`flare` a burst of sparks,
// `flare_glow` the flash). Speedy clutches his head as `speedy_grief` grows. The cell's door swings by `door`. The film
// is in beats (lib.film, the world's module beats; notes.md lists them).
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

for (const part of L.PART_NAMES) {
  const place = () => {
    const [a, d, el] = L.partAt(part, scene.get(`drag_${part}`));
    scene.set(`at_${part}_a`, a);
    scene.set(`at_${part}_d`, d);
    scene.set(`at_${part}_e`, el);
  };
  scene.on('change', `drag_${part}`, place);
  scene.on('move', `drag_${part}`, place);
  place();
  scene.on('change', part, (v, old) => {
    if (v != null && v < 0.5 && (old == null || old >= 0.5)) {
      scene.set('flare', (Number(scene.get('flare')) || 0) + 1);
      scene.set('flare_glow', 1);
      scene.move('flare_glow', 0, { over: 1.4, ease: 'out' });
    }
  });
}

// Speedy's grief: from 0.4 his hands to his head, angry; from 0.8 the anger gone to grief
function grief() {
  const v = Number(scene.get('speedy_grief')) || 0, speedy = scene.person('speedy');
  speedy.reach(v >= 0.4 ? { r: 'speedy#head', l: 'speedy#head' } : null);
  speedy.mood(v >= 0.8 ? 'sad' : v >= 0.4 ? 'angry' : null);
}
scene.on('change', 'speedy_grief', grief);

// the cell's door: shut (90°) → flung open into the cell
const door = () => scene.set('door_f', 90 + 80 * L.clamp01(scene.get('door')));
scene.on('change', 'door', door);
scene.on('move', 'door', door);
door();
