// «Saville Row» — its mechanics: the door's leaf, Fix by the lamp when the game says he is there, the street's own life
// (`traffic`: cabs and passers-by), and the film in beats for the game (lib.js film, the world's module beats: `beat`
// names one; notes.md tells them).
const L = scene.lib, P = L.plan;

// The door's leaf turns as `door` goes 0…1: from shut (facing the street, 180°) to open 100° into the hall — following
// `door` as it moves, or at once when it is set so.
const leaf = v => scene.set('door_leaf', 180 + 100 * v);
scene.on('change', 'door', v => scene.get('door') === v && leaf(v));
scene.on('move', 'door', leaf);
leaf(scene.get('door') ?? 0);

scene.on('change', 'fix_present', v => scene.set('fix_here', !!v));

// The street's life, as busy as `traffic`: now and then a cab comes out of the fog at one end of its lane and trots to
// the other (at a cab's pace, 3.6–4 m/s: its horse's legs and its wheel go by the ground it covers); a passer-by walks
// the far pavement from one end of the street to the other at their own pace. Who is out at an end is idle — what the
// state says, so a restored scene goes on as it was.
const CABS = [['cab', 1, 3.8], ['cab2', -1, 3.6]];
const [left, right] = P.ends, [wl, wr] = P.walk;
scene.every(1, () => {
  const k = scene.get('traffic') ?? 0;
  for (const [id, dir, speed] of CABS) {
    const key = `${id}_across`, a = scene.get(key);
    const from = dir > 0 ? left : right, to = dir > 0 ? right : left;
    if (typeof a === 'number' && Math.abs(a - to) > 0.01 && Math.abs(a - from) > 0.01) continue;
    if (k <= 0 || scene.random() > 0.07 * k) continue;
    scene.set(key, from);
    scene.path([key], [[from], [to]], { speed, ease: 'linear' });
  }
  for (const id of Object.keys(P.walkers)) {
    const a = scene.get(`${id}_a`);
    const atEnd = typeof a !== 'number' || Math.abs(a - wl) < 0.3 || Math.abs(a - wr) < 0.3;
    if (!atEnd) continue;
    if (scene.get(`${id}_here`) !== false) scene.set(`${id}_here`, false);
    if (k <= 0 || scene.random() > 0.05 * k) continue;
    const d = P.walkers[id], to = typeof a === 'number' && Math.abs(a - wl) < 0.3 ? wr : wl;
    scene.set(`${id}_here`, true);
    scene.person(id).walk([[to, d]]);
  }
});

// «Ten minutes» (while `packing`: the beat pack brings it): the light follows Passepartout from room to room — on in
// the one `pp_in` names, out in the others, in a third of a second; each time `fly` rises a thing flies out of his
// window into the bag (thing_a/d/e along its arc, thing_on while it is in the air).
scene.on('change', 'pp_in', v => {
  if (!scene.get('packing')) return;
  for (const [room, r] of Object.entries(L.PP_ROOMS)) if (r.key) scene.move(r.key, room === v ? 1 : 0, { over: 0.3 });
});
scene.on('change', 'fly', (v, old) => {
  const way = scene.get('packing') && (v ?? 0) >= 0.5 && (old ?? 0) < 0.5 && L.THROW(scene.get('pp_in'));
  if (!way) return;
  scene.set('thing_a', way[0][0]);
  scene.set('thing_d', way[0][1]);
  scene.set('thing_e', way[0][2]);
  scene.set('thing_on', 1);
  scene.path(['thing_a', 'thing_d', 'thing_e'], way, { over: 0.45, ease: 'in' }).then(() => scene.set('thing_on', 0));
});

// «The cab»: the game urges the cab on — `cab_to`, how far along its way to the club it should be (0…1); the cab goes
// there (as fast as that, its horse's legs and its wheel by the ground it covers), the camera with it, and the scene
// says where it is (`cab_at`).
const [c0, c1] = L.CAB;
scene.on('change', 'cab_to', v => {
  const a = c0 + Math.min(1, Math.max(0, v ?? 0)) * (c1 - c0);
  scene.move('cab_across', a, { over: 0.8 });
  scene.move('camera_x', L.camX(a), { over: 0.8 });
});
scene.on('move', 'cab_across', v => scene.set('cab_at', Math.min(1, Math.max(0, (v - c0) / (c1 - c0)))));

scene.kit.beats.play(scene, L.film(scene));
