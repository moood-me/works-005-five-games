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

scene.kit.beats.play(scene, L.film(scene));
