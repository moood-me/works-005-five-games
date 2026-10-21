// The prairie — its mechanics: the riders' shots, the sway under the cars and the camera going along with Passepartout
// there, the moment he is at the coupling, the pin out (the engine runs on); the sail by the sheet and the wind, the snow
// ridge, the wolves, Omaha's smoke; Aouda's dress and the snow on her, Fix's bruise. And the film in beats (lib.js film,
// the world's module beats) for the game.
const L = scene.lib, P = L.plan;
const num = (key, or = 0) => { const v = scene.get(key); return typeof v === 'number' ? v : or; };
// a key's handler as it is set at once (its value now) and every frame while it moves
const follow = (key, fn) => {
  scene.on('change', key, v => scene.get(key) === v && fn(v));
  scene.on('move', key, fn);
};

// ── the riders fire: while they ride and `firing`, now one rifle and now another puffs its smoke ──
let nextShot = 0;
scene.every(0.25, () => {
  if (num('riders') < 0.5 || num('firing') < 0.5 || scene.time < nextShot) return;
  const k = 1 + Math.floor(scene.random() * 3);
  scene.set(`shots${k}`, num(`shots${k}`) + 1);
  nextShot = scene.time + 0.9 + scene.random() * 1.6;
});

// ── under the cars: while Passepartout is there, the scene leads the sway's phase — swing_at runs 0 → 1 over a period,
// again and again (the game reads it: 0.5 — the cars come together); the camera goes along with him as he goes ──
const PERIOD = 1.4;
const under = () => scene.get('passepartout_on') === 'chain#pp';
let swinging = false;
function swingOn() {
  if (swinging || !under()) return;
  swinging = true;
  const v = num('swing_at') % 1;
  scene.move('swing_at', 1, { over: PERIOD * (1 - v), ease: 'linear' }).then(how => {
    swinging = false;
    if (how !== 'done') return;
    scene.set('swing_at', 0);
    swingOn();
  });
}
scene.on('change', 'passepartout_on', swingOn);
scene.on('cut', swingOn);
scene.every(0.5, swingOn);
scene.on('change', 'pp_car', v => under() && scene.move('camera_x', L.underCam(num('cars_x'), v), { over: 0.9 }));
// he is at the coupling (pp_car comes to 3): the moment, once each time
let atCoupling = num('pp_car') >= 2.95;
follow('pp_car', v => {
  if (v >= 2.95 && !atCoupling && under()) {
    atCoupling = true;
    scene.tell('under:coupling');
  } else if (v < 2.5) atCoupling = false;
});
// the pin out under way: the engine runs on ahead, the cars fall behind, slowing
let free = num('uncouple') >= 0.99;
follow('uncouple', v => {
  if (v >= 0.99 && !free) {
    free = true;
    if (num('speed') > 0) {
      scene.move('train_x', num('train_x') + 260, { over: 9, ease: 'in' });
      scene.move('speed', 0.5, { over: 7, ease: 'out' });
    }
  } else if (v < 0.5) free = false;
});

// ── the sail: its facing by the sheet and the wind; the wind's look (from the sledge's left or right) ──
const sail = () => {
  const w = num('wind');
  scene.set('sail_face', L.sailFace(num('sheet'), w));
  scene.set('wind_l', Math.max(0, -w));
  scene.set('wind_r', Math.max(0, w));
};
follow('sheet', sail);
follow('wind', sail);
// the snow ridge: it rises ahead as `drift` grows, at the bow at 1; falling back to 0 it passes behind the sledge as the
// plain runs, then waits far ahead
let passing = false, lastDrift = num('drift');
const ridge = v => {
  const x = num('sl_x');
  if (v > 0.02) {
    passing = false;
    scene.set('ridge_x', x + 6 + 44 * (1 - v));
  } else if (lastDrift > 0.5 && !passing) {
    passing = true;
    const from = num('ridge_x'), pace = Math.max(0.2, num('sl_speed')) * P.sailPace;
    scene.move('ridge_x', x - 50, { over: Math.max(0.5, (from - x + 50) / pace), ease: 'linear' }).then(how => {
      if (how !== 'done') return;
      passing = false;
      scene.set('ridge_x', x + 400);
    });
  } else if (!passing && num('ridge_x') < x + 300) scene.set('ridge_x', x + 400);
  lastDrift = v;
};
follow('drift', ridge);
// the wolves come up from behind along the edge of the plain as `wolves` grows
follow('wolves', v => scene.set('wolves_x', num('sl_x') - 70 + 72 * v));
// Omaha's smoke over the horizon toward the way's end
follow('sledge', v => scene.set('omaha_near', L.clamp01((v - 0.6) / 0.4)));

// ── the marks of the journey on them: Aouda's travelling dress and the snow settling on her (in four steps); Fix's
// bruise ──
let snowStep = -1;
const aouda = () => {
  const step = Math.floor(L.clamp01(num('snow_on_aouda')) * 4 + 1e-6);
  if (step === snowStep) return;
  snowStep = step;
  scene.set('aouda_wear', L.aoudaWear(scene.kit.cast, num('aouda_dress'), num('snow_on_aouda')));
};
follow('snow_on_aouda', aouda);
scene.on('change', 'aouda_dress', () => { snowStep = -1; aouda(); });
scene.on('change', 'fix_bruise', v => scene.set('fix_wear', v ? scene.kit.cast.wears.fix_bruise : null));

scene.kit.beats.play(scene, L.film(scene));
