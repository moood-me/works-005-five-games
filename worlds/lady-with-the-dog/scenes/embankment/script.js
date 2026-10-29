// The sea-front at Yalta: the scene's mechanics. The hour's light follows `hour` (the world's sky); its film in beats
// (lib.js film(scene), played by the world's module beats: the game sets `beat`, the scene tells `beat:<name>`). What
// the game moves is kept here: the steamer by `steamer`; the dog by `spitz_near` and Gurov's hand by `hand` («Coax»);
// the arrivals down the gangway by `pass`, `look_at`, `stranger_turned`; the crowd by `surge`; the walkers in the avenue,
// `watched`, `seen`, `kiss_now` («Looking round»).
const L = scene.lib;
scene.kit.sky.follow(scene);
scene.kit.beats.play(scene, L.film(scene));
const beat = () => scene.get('beat');
const keep = (keys, put) => {
  put();
  for (const key of keys) { scene.on('change', key, put); scene.on('move', key, put); }
};

// ── the steamer where `steamer` has it ──
keep(['steamer'], () => {
  const [a, d, f] = L.steamerAt(scene.get('steamer'));
  scene.set('steamer_a', a); scene.set('steamer_d', d); scene.set('steamer_f', f);
});

// ── «Coax»: the dog from her chair to his knee; his right hand lowered toward it ──
const COAX = ['coax', 'coax_hold', 'finger', 'pat'];
keep(['spitz_near'], () => {
  if (!COAX.includes(beat())) return;
  const p = L.dogNear(Number(scene.get('spitz_near')) || 0);
  scene.set('spitz_a', p[0]); scene.set('spitz_d', p[1]);
  // he watches it come (his look at its place, never at its points: spitz.md)
  if (beat() === 'coax') scene.set('gurov_look', L.dogAt(p));
});
keep(['hand'], () => {
  if (!COAX.includes(beat())) return;
  const k = Number(scene.get('hand')) || 0;
  scene.set('gurov_reach', k > 0.02 ? { r: L.handAt(k) } : null);
});

// ── «Lorgnette»: `pass` lets the arrivals down the gangway one by one, in order; each stops below, met, and goes on
// up the pier when two more have come down. The stooping man stops at the gangway's foot, his back to us, says so and
// waits for `stranger_turned`: then he turns to his lady, she takes his arm, they go. `look_at` — the one looked at
// stops a moment and turns his head (in profile) ──
let led = 0;
const walks = {};                               // id → the sequence leading them
const lead = (id, fn) => { walks[id]?.cancel(); walks[id] = scene.sequence(fn, { name: `arrive_${id}` }); };
const stopAll = () => { for (const id of Object.keys(walks)) { walks[id].cancel(); delete walks[id]; } };
function arrive(i) {
  const id = L.ARRIVALS[i];
  if (id === 'stranger') {
    lead('stranger', async s => {
      const man = s.person('stranger'), lady = s.person('stranger_lady');
      lady.walk([[L.GANG.x - 0.35, L.GANG.z1 - 0.1], [L.FOOT[0] - 0.7, L.FOOT[1] + 0.35]]);
      await man.walk([[L.GANG.x, L.GANG.z1 - 0.1], L.FOOT]);
      await man.turn(335);
      s.tell('gangway:stranger');
      await s.until(() => Number(s.state.stranger_turned) > 0.5);
      man.look('stranger_lady');
      await man.turn(250);
      lady.look('stranger');
      lady.reach({ r: 'stranger#elbow_l' });
      await s.wait(1.2);
      lady.walk(L.OFF_PIER.map(([x, z]) => [x - 0.6, z]));
      await man.walk(L.OFF_PIER);
      man.here(false); lady.here(false);
    });
    return;
  }
  lead(id, async s => {
    const p = s.person(id);
    await p.walk([[L.GANG.x, L.GANG.z1 - 0.1], L.FOOT, L.MET[id]]);
    await p.turn(L.MET[id][0] < L.GANG.x ? 150 : 210);
    p.look([-29, 22, 1.5]);
    await s.until(() => led > i + 2 || Number(s.state.surge) > 0.5);
    p.look(null);
    await p.walk(L.OFF_PIER);
    p.here(false);
  });
}
scene.on('change', 'pass', n => {
  n = Math.max(0, Math.min(L.ARRIVALS.length, Math.floor(Number(n) || 0)));
  if (beat() !== 'gangway') { led = n; return; }
  if (n < led) { stopAll(); led = n; return; }   // (set back: the beat begun again)
  while (led < n) arrive(led++);
});
scene.on('change', 'look_at', id => {
  if (beat() !== 'gangway' || !id || !walks[id]) return;
  const p = scene.person(id), ref = scene.get(`${id}_a`), z = scene.get(`${id}_d`);
  walks[id].pause();
  p.look([Number(ref) - 2.5, Number(z) - 1.5, 1.6]);
  scene.after(1.5, () => { p.look(null); walks[id]?.resume(); });
});
// the crowd surges off the pier: it thins at once
scene.on('change', 'surge', v => {
  if (!(Number(v) > 0.5) || beat() !== 'gangway') return;
  scene.move('crowd', 0.35, { over: 4 });
});

// ── «Looking round»: in the avenue at noon walkers come out from behind the hedge at its far end and go off past
// the camera, or the other way — two every 16 s, 2.5 s apart; the avenue empty about 4 s between. `watched` — someone
// is in the avenue as the window shows it; `seen` (the game's pulse) — the nearest turns to look, Anna steps back;
// `kiss_now` — no one more comes, the two embrace ──
const WALKERS = ['stroller1', 'stroller2', 'stroller3'];
const strolls = {};
let lastPass = -1e9, nextWalker = 0, way = 1, beatAt = 0;
const avenue = () => beat() === 'noon_garden' && !(Number(scene.get('kiss_now')) > 0.5);
function stroll(id, dir) {
  const path = dir > 0 ? [...L.ALLEY_FAR, ...L.ALLEY_NEAR] : [...L.ALLEY_NEAR].reverse().concat([...L.ALLEY_FAR].reverse());
  strolls[id]?.cancel();
  strolls[id] = scene.sequence(async s => {
    const p = s.person(id);
    s.set(`${id}_a`, path[0][0]); s.set(`${id}_d`, path[0][1]);
    p.look(null);
    p.here(true);
    await p.walk(path.slice(1));
    p.here(false);
  }, { name: `stroll_${id}` });
}
scene.every(1, () => {
  if (!avenue() || scene.time - lastPass < 16 || scene.time - beatAt < 0.3) return;
  lastPass = scene.time;
  const a = WALKERS[nextWalker % 3], b = WALKERS[(nextWalker + 1) % 3];
  nextWalker++;
  stroll(a, way);
  scene.after(2.5, () => { if (avenue()) stroll(b, -way); });
  way = -way;
});
const seenNow = id => {
  if (!(scene.get(`${id}_here`) ?? false)) return false;
  const a = Number(scene.get(`${id}_a`)), d = Number(scene.get(`${id}_d`)), R = L.ALLEY_SEEN;
  return a > R.x0 && a < R.x1 && d > R.z0 && d < R.z1;
};
scene.every(0.1, () => {
  const w = beat() === 'noon_garden' && WALKERS.some(seenNow) ? 1 : 0;
  if (scene.get('watched') !== w) scene.set('watched', w);
});
scene.on('change', 'seen', v => {
  if (!(Number(v) > 0.5) || beat() !== 'noon_garden') return;
  const near = WALKERS.filter(seenNow).sort((x, y) => Number(scene.get(`${y}_d`)) - Number(scene.get(`${x}_d`)))[0];
  if (near) { scene.person(near).look('anna'); scene.after(1.5, () => scene.person(near).look(null)); }
  scene.person('anna').do('step_back');
  scene.after(2, () => scene.set('seen', 0));
});
scene.on('change', 'kiss_now', v => {
  if (!(Number(v) > 0.5) || beat() !== 'noon_garden') return;
  scene.sequence(async s => {
    const anna = s.person('anna'), gurov = s.person('gurov');
    gurov.look('anna'); anna.look('gurov');
    await s.all(gurov.do('embrace_him'), anna.do('embrace_her'));
    gurov.reach({ r: 'anna#back', l: 'anna#back' });
    anna.reach({ r: 'gurov#nape', l: 'gurov#back' });
    await s.wait(1.6);
    s.tell('noon_garden:kiss');
  }, { name: 'kiss_now' });
});

// a new beat: whoever was being led about by the avenue or the gangway is let go (the beat's cut has placed them)
scene.on('change', 'beat', () => {
  if (beat() !== 'gangway') stopAll();
  if (beat() !== 'noon_garden') for (const id of Object.keys(strolls)) { strolls[id].cancel(); delete strolls[id]; }
  lastPass = -1e9;
  beatAt = scene.time;
});
