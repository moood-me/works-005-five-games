// «The jungle» — its mechanics: the film in beats for the game (lib.js film(scene), the world's module beats: `beat` names
// one; notes.md tells them); the keys the game moves the people and Kiouni by — `procession` (the column walks along the
// trail to there), `walk` (the «rajah» carries the widow toward the trees as far as that), `heads` (the crowd at the pyre
// face down or looking up); Kiouni's — `kneel`, `balk` (his anchor sinks and tips with them), `trumpet`, `sugar`,
// `goad`; the games' — `owner_back` («The bargain»), `ride` («The elephant»: Kiouni along the trail, the day to dusk),
// `charge`, `kiouni_lane`, `litter_lane`, `scatter`, `grab`, `guide_seen` («The dash»); `fireflies` follows the night.
const L = scene.lib;
// a key the game sets at once, or moves (each frame): fn(value now)
const follow = (key, fn) => {
  scene.on('change', key, v => { if (scene.get(key) === v) fn(v); });
  scene.on('move', key, () => fn(scene.get(key)));
};

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

// ── Kiouni ──
// kneeling and balking: his anchor goes down and tips forward as he kneels, back as he balks (the people on him with it)
const pose = () => { const p = L.kneelPose(+scene.get('kneel') || 0, +scene.get('balk') || 0); scene.set('kiouni_el', p.kiouni_el); scene.set('kiouni_tilt', p.kiouni_tilt); };
follow('kneel', pose);
follow('balk', pose);
// `trumpet` rising to 1: he trumpets once — head and trunk up, ears out (kiouni_blow up, held, down)
scene.on('change', 'trumpet', v => {
  if (!(v >= 1)) return;
  scene.sequence(async s => {
    await s.move('kiouni_blow', 1, { over: 0.4, ease: 'out' });
    await s.wait(1.3);
    await s.move('kiouni_blow', 0, { over: 0.9 });
  }, { name: 'trumpet' });
});
// `sugar` rising to 1: Passepartout leans out of the howdah with a lump of sugar, the trunk comes back for it
scene.on('change', 'sugar', v => {
  if (!(v >= 1)) return;
  scene.sequence(async s => {
    s.set('passepartout_with', ['sugar']);
    s.set('passepartout_reach', { r: 'kiouni#trunk' });
    s.set('passepartout_look', 'kiouni#trunk');
    s.set('trunk', 'sugar');
    await s.wait(1.6);
    s.set('passepartout_with', null);
    s.set('trunk', 'rest');
    await s.wait(0.4);
    s.set('passepartout_reach', null);
    s.set('passepartout_look', null);
  }, { name: 'sugar' });
});
// `goad` 1: the guide on his neck lifts the goad over his head; 0 — lowers it
scene.on('change', 'goad', v => scene.set('guide_reach', v > 0.5 ? { r: { on: 'kiouni_site', at: [0.15, -1.7, 4.3] } } : null));

// ── «The bargain»: the owner turns his back, arms folded (`owner_back` → 1; turned — `haggle:turned`), and back to Fogg ──
scene.on('change', 'owner_back', async v => {
  const owner = scene.person('owner'), away = v > 0.5;
  scene.set('owner_look', away ? null : 'fogg#head');
  scene.set('owner_do', away ? { motion: 'arms_folded', loop: true } : 'stand');
  const turned = await owner.turn(away ? 25 : 245);
  if (away && turned === 'done') scene.tell('haggle:turned');
});

// ── «The elephant»: Kiouni along the trail as far as `ride`, the day going to dusk with it ──
follow('ride', v => { for (const [k, x] of Object.entries(L.rideAt(+v || 0))) scene.set(k, x); });

// ── «The dash» ──
// Kiouni out of the thicket at the widow (`charge` to 0.5, aimed by `kiouni_lane`), then on through into the dark from
// where he took her; turned the way he goes
let took = null;
const dash = () => {
  const c = +scene.get('charge') || 0;
  if (c <= 0 && !took) return;
  if (c > 0.5 && !took) took = [scene.get('kiouni_x'), scene.get('kiouni_d')];
  if (c <= 0.5) took = null;
  const [a, d] = L.dashAt(c, +scene.get('kiouni_lane') || 0, took), a0 = scene.get('kiouni_x'), d0 = scene.get('kiouni_d');
  if (Math.hypot(a - a0, d - d0) > 0.02) scene.set('kiouni_facing', L.toward([a0, d0], [a, d]));
  scene.set('kiouni_x', a);
  scene.set('kiouni_d', d);
};
follow('charge', dash);
follow('kiouni_lane', dash);
// the widow and her two priests shying along the trail (`litter_lane`): they go there as one, when it has moved enough
let shied = 0;
follow('litter_lane', v => {
  if ((+scene.get('grab') || 0) >= 1 || Math.abs(v - shied) < 0.22) return;
  shied = v;
  for (const id of ['pr1', 'aouda', 'pr2']) {
    const [a, d] = L.inColumn(L.STOPPED, id), x = a + L.LANE * v;
    scene.person(id).walk([[x, d]]);
  }
});
// the column scattering as he comes: each runs off with its torch past its share of `scatter`
scene.on('move', 'scatter', () => scatter(scene.get('scatter')));
scene.on('change', 'scatter', v => { if (scene.get('scatter') === v) scatter(v); });
const ran = new Set();
function scatter(v) {
  if (!(v > 0)) { ran.clear(); return; }
  for (const [id, at, to] of L.SCATTER) {
    if (v < at || ran.has(id) || !scene.get(`${id}_here`)) continue;
    ran.add(id);
    scene.set(`${id}_gait`, 'run');
    scene.person(id).walk([to]);
  }
}
// `grab` rising to 1: Passepartout, reaching down from Kiouni's rump, has her up into the howdah (her veil falls back);
// her priests fall back
// (the close on the guide, made ready as she is taken: cut to as the torch catches his face)
let seen = null;
scene.on('change', 'grab', v => {
  if (!(v >= 1)) return;
  seen?.cancel();
  seen = scene.shot(L.guideRide(30));
  scene.set('aouda_reach', null);
  scene.set('aouda_wear', null);
  scene.set('aouda_on', L.seat('mid'));
  scene.set('aouda_turn', 180);
  scene.set('aouda_do', { motion: 'sleep_seated', loop: true });
  scene.set('passepartout_reach', null);
  scene.set('passepartout_look', 'aouda#head');
  for (const [i, id] of ['pr1', 'pr2'].entries()) {
    scene.set(`${id}_reach`, null);
    const [a, d] = L.inColumn(L.STOPPED, id);
    scene.person(id).walk([[a - 1.5 + 3 * i, d + 1.6]]);
  }
});
// as he comes to her, Passepartout reaches down for her hands
follow('charge', c => { if (c >= 0.35 && (+scene.get('grab') || 0) < 1 && scene.get('aouda_on') == null) scene.set('passepartout_reach', { r: 'aouda#hands', l: 'aouda#hands' }); });
// `guide_seen` rising to 1: the first torch-bearer, who stood his ground, lifts his torch to the guide's face as Kiouni
// goes by — their eyes meet; a cut close on the guide's face in its light, riding beside him
scene.on('change', 'guide_seen', v => {
  if (!(v >= 1)) return;
  scene.set('pb1_look', 'guide#head');
  scene.set('pb1_reach', { r: 'guide#head' });
  scene.set('guide_look', 'pb1#head');
  const close = seen;
  seen = null;
  if (close?.ready) close.cut();
  else { close?.cancel(); scene.cut(L.guideRide(30)); }
});

scene.kit.beats.play(scene, L.film(scene));
