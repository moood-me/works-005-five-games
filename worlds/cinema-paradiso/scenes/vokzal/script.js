// Вокзал — the scene's mechanics: its beats (the game sets `beat`), the train's place from `train`, the light's key
// from `era`. A beat plays from its start: if it follows (`after`) the beat that last ended, it goes on from there (a
// cut to its own camera when it has one); otherwise it cuts to its `from`. At its end it says `beat:<name>` and makes
// ready the opening shot of the beat that may come next. `alfredo_stays` (the game's, set before boarding): 0 —
// Alfredo turns and goes off along the platform, tapping his cane; 1 — he stays at the platform's edge.
const L = scene.lib, G = L.G, CH = scene.kit.cast.characters;
const IDS = ['toto', 'maria', 'alfredo', 'c1', 'c2'];
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };

// ---- the camera's shots (metres from the start on the platform; yaw — degrees right of north) ----
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_on: null, camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  platform: cam(-0.9, -0.2, 35, 0, 1),        // across the platform to the carriage: the mother, Toto, Alfredo in profile
  window: cam(-3.2, 1.6, 30, 0.15, 8),        // under Toto's window from the platform, looking up at him
  away: cam(-5.5, 0.4, 60, 0, 2),             // along the platform east: the carriage goes, the mother waves, foreground right
  back: { ...cam(1.7, G.WIN1 - 0.2, 150, 1.25, -2), camera_on: 'train' },    // leaning out of Toto's window, back at the platform
  arrive: cam(1.9, 4.35, 205, 0, 3),          // 1988, from the carriage's step: Salvatore's back, the empty platform, the clock
};

// ---- places (at train 0) ----
const T_HUG = [1.2, 3.3], M_HUG = [0.75, 3.3], M_BACK = [0.3, 2.55], A_WAIT = [2.7, 2.5], A_HUG = [1.65, 3.3];
const DOOR = [G.DOOR1, 4.35], A_EDGE = [1.6, 3.9], A_OFF = [-6, 0.4], A_GONE = [-16, 0.2];
const WIN = 'car1_floor#win';                  // the spot behind Toto's window on car 1's floor: he stands there, carried
const C_FAR = { c1: { at: [14, 1.0], turn: 300 }, c2: { at: [-11, -2.2], turn: 20 } };

// ---- the keys a beat starts from ----
const trainKeys = t => ({ train: t, train_x: G.trainX(t) });
const base = (era, hour) => ({ era, hour, now_k: era === 'now' ? 1 : 0, dawn_k: era === 'now' ? 0 : 1, steam: era === 'now' ? 0 : 1, ...trainKeys(0) });
function cast(who) {
  const o = {};
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_gait'] = p.gait ?? null;
    if (id === 'toto') { o.toto_on = p.on ?? null; o.toto_with = p.with ?? null; o.toto_wear = p.wear ?? null; o.toto_steps = p.on ? false : null; }
    if (id === 'alfredo') o.alfredo_with = ['cane'];
  }
  return o;
}
const stays = () => scene.get('alfredo_stays') !== 0;
// where Alfredo is after Toto has boarded, by what the game chose
const alfAfter = (far) => stays() ? { at: A_EDGE, turn: 20, look: 'car1#window' } : { at: far ? A_GONE : A_OFF, turn: 270, gait: 'cane_walk' };

// ---- the beats ----
const B = {
  platform: {
    from: () => ({ ...base('past', 0.25), ...cast({
      toto: { at: T_HUG, turn: 270, look: 'maria', reach: { r: 'maria#back', l: 'maria#back' } },
      maria: { at: M_HUG, turn: 90, look: 'toto', reach: { r: 'toto#nape', l: 'toto#nape' } },
      alfredo: { at: A_WAIT, turn: brg(A_WAIT, T_HUG), look: 'toto' }, ...C_FAR }), ...CAM.platform }),
    run: async s => {
      const toto = s.person('toto'), ma = s.person('maria'), alf = s.person('alfredo');
      await s.wait(5); s.tell('platform:hug');
      await s.wait(1.5);
      toto.reach(null); ma.reach(null);
      await ma.walk([M_BACK]); await ma.turn(brg(M_BACK, T_HUG)); ma.look('toto');
      alf.gait('cane_walk');
      await alf.walk([A_HUG]); alf.gait(null);
      await s.all(alf.turn(270), toto.turn(90));
      alf.look('toto'); toto.look('alfredo');
      alf.reach({ l: 'toto#back' }); toto.reach({ r: 'alfredo#back', l: 'alfredo#back' });
      await s.wait(4);
    },
  },
  boarding: {
    after: ['platform'],
    from: () => ({ ...base('past', 0.25), ...cast({
      toto: { at: T_HUG, turn: 90, look: 'alfredo', reach: { r: 'alfredo#back', l: 'alfredo#back' } },
      maria: { at: M_BACK, turn: brg(M_BACK, T_HUG), look: 'toto' },
      alfredo: { at: A_HUG, turn: 270, look: 'toto', reach: { l: 'toto#back' } }, ...C_FAR }), ...CAM.platform }),
    run: async s => {
      const toto = s.person('toto'), ma = s.person('maria'), alf = s.person('alfredo');
      const after = alfAfter(false);
      const win = s.shot({ ...CAM.window, toto_here: true, toto_on: WIN, toto_steps: false, toto_turn: 90, toto_with: null, toto_do: 'stand', toto_look: 'alfredo', toto_reach: null, toto_gait: null });
      toto.reach(null); alf.reach(null);
      await s.wait(0.6);
      toto.look('suitcase'); toto.reach({ r: 'suitcase' });
      await s.wait(0.8);
      toto.with(['suitcase']); toto.reach(null); toto.gait('carry_walk'); toto.look(null);
      await toto.walk([[1.0, 3.9], DOOR]);
      toto.here(false); toto.gait(null);
      win.cut();
      // the train starts; the camera tracks along the platform with Toto's window and stops with it
      s.move('train', 0.08, { over: 4.5, ease: 'in' });
      s.move('camera_x', CAM.window.camera_x + G.RUN * 0.08, { over: 4.5, ease: 'in' });
      alf.look('car1#window'); ma.look('car1#window');
      await s.wait(1.2); s.tell('boarding:window');
      if (stays()) { await alf.walk([A_EDGE]); await alf.turn(20); }
      else { await alf.turn(270); alf.look(null); alf.gait('cane_walk'); alf.walk([A_OFF, A_GONE]); }
      await s.wait(2.6);
    },
  },
  away: {
    after: ['boarding'],
    open: () => ({ ...CAM.away, toto_turn: 0, toto_look: null, toto_steps: false }),
    from: () => ({ ...base('past', 0.25), ...trainKeys(0.08), ...cast({ toto: { at: [0, 0], on: WIN, turn: 0 }, maria: { at: M_BACK, turn: 20, look: 'car1#window' }, alfredo: alfAfter(false), ...C_FAR }), ...CAM.away }),
    run: async s => {
      const ma = s.person('maria'), alf = s.person('alfredo');
      if (!stays()) { alf.gait('cane_walk'); alf.walk([A_GONE]); }
      const go = s.move('train', 1, { over: 12, ease: 'in' });
      await s.wait(0.6); ma.do('wave');
      await s.wait(4.2); ma.do('wave');
      await go;
      s.tell('away:gone');
      await s.wait(0.6);
    },
  },
  back_look: {
    after: ['boarding'],
    open: () => ({ ...CAM.back, toto_here: false }),
    from: () => ({ ...base('past', 0.25), ...trainKeys(0.08), ...cast({ maria: { at: M_BACK, turn: 20, look: 'car1#window' }, alfredo: alfAfter(false), ...C_FAR }), ...CAM.back }),
    run: async s => {
      const ma = s.person('maria'), alf = s.person('alfredo');
      if (!stays()) { alf.gait('cane_walk'); alf.walk([A_GONE]); }
      const go = s.move('train', 1, { over: 12, ease: 'in' });
      await s.wait(0.5); ma.do('wave');
      if (stays()) { await s.wait(1.2); alf.do('wave'); }
      await s.wait(4.5); ma.do('wave');
      await s.wait(2); s.tell('back_look:far');
      await go;
      await s.wait(0.5);
    },
  },
  arrival: {
    from: () => ({ ...base('now', 0.8), ...cast({ toto: { at: [0.75, 3.95], turn: 200, wear: CH.salvatore, with: ['suitcase'] } }), ...CAM.arrive }),
    run: async s => {
      const sal = s.person('toto');
      await s.wait(1.5);
      await sal.walk([[0.35, 2.6], [-0.2, 1.4]]);
      await s.wait(1.2); s.tell('arrival:stand');
      sal.look('clock#face');
      await s.wait(6);
    },
  },
};

// ---- running the beats ----
let ready = null;   // the shot made ready for the beat expected next: { name, cont, shot }
function opening(name, cont) {
  const b = B[name];
  return cont ? (b.open ? b.open() : null) : b.from();
}
function start(name) {
  const b = B[name];
  if (!b) { scene.warn('Вокзал: нет куска «' + name + '»'); return; }
  const cont = (b.after || []).includes(scene.get('beat_last'));
  scene.set('beat_last', '');
  const shot = ready && ready.name === name && ready.cont === cont ? ready.shot : null;
  if (ready && !shot) ready.shot.cancel();
  ready = null;
  scene.sequence(async s => {
    const open = opening(name, cont);
    if (shot) shot.cut(); else if (open) s.cut(open);
    await b.run(s);
    scene.set('beat_last', name);
    s.tell('beat:' + name);
    prepare(name);
  }, { name: 'beat' });
}
function prepare(done) {
  const next = scene.get('beat_next') || Object.keys(B).find(k => (B[k].after || []).includes(done));
  if (!next || !B[next]) return;
  const cont = (B[next].after || []).includes(done), open = opening(next, cont);
  if (open) ready = { name: next, cont, shot: scene.shot(open) };
}

// ---- derived keys ----
function train() { scene.set('train_x', G.trainX(scene.get('train'))); }
function light() { const now = scene.get('era') === 'now'; scene.set('now_k', now ? 1 : 0); scene.set('dawn_k', now ? 0 : 1); }
scene.on('change', 'train', train);
scene.on('move', 'train', train);
scene.on('change', 'era', light);
scene.on('change', 'beat', v => { if (v) start(v); });
scene.on('change', 'beat_next', () => { if (scene.get('beat_last')) { if (ready) ready.shot.cancel(); ready = null; prepare(scene.get('beat_last')); } });
train(); light();
{
  const b = scene.get('beat');
  if (b && scene.get('beat_last') !== b) start(b);
  else if (b) prepare(b);
}
