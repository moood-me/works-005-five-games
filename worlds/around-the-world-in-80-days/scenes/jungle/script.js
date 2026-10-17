// «The jungle» — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names one;
// notes.md tells them); the keys the game moves the people by — `procession` (the column walks along the trail to
// there), `walk` (the «rajah» carries the widow toward the trees as far as that), `heads` (the crowd at the pyre face down
// or looking up); `fireflies` follows the night.
const L = scene.lib;

// `procession` set (or moved — where it goes): the column walks there along the trail, each at their gait's pace
scene.on('change', 'procession', v => { if (typeof v === 'number') L.march(scene, v); });
// `walk` set: he carries her along the way from the pyre to there, at the pace of his stiff walk
scene.on('change', 'walk', v => L.carry(scene, v));
// `heads`: the crowd at the pyre falls on its face, or lifts its heads — each a little after the one before
scene.on('change', 'heads', v => L.CROWD_IDS.forEach((id, i) => {
  if (scene.get(`${id}_here`)) scene.after(0.15 * i, () => scene.set(`${id}_do`, L.crowdDo(i, v > 0.5)));
}));
// the fireflies come out as the night falls
const night = () => { const d = scene.get('day'); if (typeof d === 'number') scene.set('fireflies', 1 - scene.anim.ease.smooth(scene.anim.span(d, 0.08, 0.4))); };
scene.on('change', 'day', night);
scene.on('move', 'day', night);
scene.on('load', night);

scene.kit.beats.play(scene, L.FILM);
