// The booth — the scene's mechanics: its film in beats (lib.js film(scene), played by the world's module beats: the game
// sets `beat`, the scene tells `beat:<name>`), and the keys it derives from others — the light's from `hour` and
// `era`, the door's turn from `door`, projector 1's turn from `turned`, the lamp houses from `beam_on` and `active`;
// «Pull Him Out»: the boy and Alfredo along the way by `drag` (where they are now: `drag_at`), the cough.
const L = scene.lib, G = L.G;
scene.kit.beats.play(scene, L.film(scene));

const clamp = v => Math.max(0, Math.min(1, +v || 0));
function light() { for (const [k, v] of Object.entries(L.tone(scene.get('hour'), scene.get('era')))) if (scene.get(k) !== v) scene.set(k, v); }
const doorF = () => scene.set('door_f', 270 - 90 * clamp(scene.get('door')));
const turnF = () => scene.set('p1_f', 180 - 140 * clamp(scene.get('turned')));
function lamps() {
  const on = scene.get('era') === 'ruin' ? 0 : clamp(scene.get('beam_on')), a = scene.get('active');
  scene.set('p1_on', a === 1 ? on : 0); scene.set('p2_on', a === 2 ? on : 0);
}
scene.on('change', 'hour', light); scene.on('change', 'era', () => { light(); lamps(); });
scene.on('change', 'door', doorF); scene.on('move', 'door', doorF);
scene.on('change', 'turned', turnF); scene.on('move', 'turned', turnF);
for (const k of ['beam_on', 'active']) { scene.on('change', k, lamps); scene.on('move', k, lamps); }
light(); doorF(); turnF(); lamps();

// «Pull Him Out»: the game moves `drag` (where Alfredo is to be, 0 — where he fell, 1 — by the door); he comes heavily,
// at most 0.3 of the way a second: the boy backs along the way pulling (gait `drag`), Alfredo lying slides behind
// his hands with no steps. `drag_at` — where he is now, set ten times a second.
const RATE = 0.3, DX = G.PATH1[0] - G.PATH0[0], DZ = G.PATH1[1] - G.PATH0[1], LEN = Math.hypot(DX, DZ);
const ux = DX / LEN, uz = DZ / LEN;
let at = null, coughUntil = 0;
function place(u) {
  const ax = G.PATH0[0] + DX * u, az = G.PATH0[1] + DZ * u;
  scene.set('alfredo_a', ax); scene.set('alfredo_d', az);
  scene.set('toto_a', ax + ux * 0.8); scene.set('toto_d', az + uz * 0.8);
}
scene.every(0.1, () => {
  const want = clamp(scene.get('drag'));
  if (at === null) at = clamp(scene.get('drag_at'));
  if (Math.abs(want - at) < 0.002) { if (scene.get('drag_at') !== at) scene.set('drag_at', at); return; }
  if (scene.time < coughUntil) return;
  if (scene.get('toto_gait') !== 'drag') { scene.set('toto_do', 'stand'); scene.set('toto_gait', 'drag'); }
  at += Math.max(-RATE * 0.1, Math.min(RATE * 0.1, want - at));
  place(at);
  scene.set('drag_at', Math.round(at * 1000) / 1000);
});
scene.on('change', 'drag_at', v => { if (Math.abs(v - (at ?? v)) > 0.05) at = clamp(v); });
scene.on('change', 'cough', v => {
  if (!v) return;
  coughUntil = scene.time + 1.0;
  scene.person('toto').do('cough_stand');
  scene.after(1.0, () => { scene.set('toto_do', 'stand'); });
});
