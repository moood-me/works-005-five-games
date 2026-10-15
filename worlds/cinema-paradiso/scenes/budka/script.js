// Будка — the scene's mechanics: its beats (the game sets `beat`), the keys derived from others (the light's from
// `hour`, the door's turn from `door`, which projector's lamp burns). A beat plays from its start: if it follows
// (`after`) the beat that last ended, it goes on from there (a cut to its own camera when it has one); otherwise it
// cuts to its `from`. At its end it says `beat:<name>` and makes ready the opening shot of the beat that may come next.
const L = scene.lib, G = L.G, CH = scene.kit.cast.characters;
const IDS = ['alfredo', 'toto', 'elena'];
const SIT = { motion: 'seated', loop: true }, WORK = { motion: 'bench_work', loop: true };
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };

// ---- the camera's shots (metres from the start by the south wall; yaw — degrees right of north) ----
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  bench: cam(0.3, -0.1, 34, -0.1, 2),          // from the south wall: Alfredo at the bench under the lamp, the calendar, the door right
  ports: cam(0.1, -0.15, -14, 0.1, 1),         // behind and right of Alfredo: the boy on the crate between the projectors, the look port
  door: cam(-1.6, 0.2, 72, -0.2, 0),           // from the window's corner toward the door: Alfredo on his stool left, the door right
};

// ---- places ----
const AT_BENCH = [1.2, 2.45], BOY_BY = [1.12, 1.55], LANDING = [2.5, 0.55], IN_GAP = [2.28, 0.6];
const AT_P1 = [0.45, 1.72];                    // Alfredo at projector 2, looking it over: his back to the bench
const CRATE = G.CRATE, BEHIND = [-0.48, 1.58];
const SEAT = G.STOOL, EL_DOOR = [2.35, 0.55], EL_IN = [1.72, 0.62], EL_CAL = [1.62, 1.45], EL_AWAY = [2.6, -0.25];

// ---- the keys a beat starts from ----
const base = (hour) => ({
  era: 'past', hour, night_k: hour >= 0.85 ? 1 : 0, lamp: 1, door: 0, door_f: 270, stair: 0, beam_on: 0, active: 1,
  motor1: 0, motor2: 0, crank: 0, clock: 6, tin_open: 0, tin_at: 'bench', clips: 0, written: 0, p1_on: 0, p2_on: 0,
});
const show = (active) => ({ beam_on: 1, active, motor1: active === 1 ? 1 : 0, motor2: active === 2 ? 1 : 0, p1_on: active === 1 ? 1 : 0, p2_on: active === 2 ? 1 : 0 });
function cast(who) {
  const o = {};
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_gait'] = null;
    if (id === 'alfredo') { o.alfredo_wear = p.wear ?? null; o.alfredo_with = p.with ?? null; }
  }
  return o;
}
const alfWorks = { at: AT_BENCH, turn: 90, do: WORK, look: 'press#press' };
const boyBy = { at: BOY_BY, turn: 35, look: 'tin' };
const blind = (more) => ({ at: SEAT, turn: 135, do: SIT, wear: CH.alfredo_blind, with: ['cane'], ...more });

// ---- the beats ----
const B = {
  cutting: {
    from: () => ({ ...base(0.9), ...show(1), ...cast({ alfredo: alfWorks, toto: { at: LANDING, turn: 270, look: 'alfredo' } }), toto_here: false, ...CAM.bench }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await s.wait(1.2);
      s.set('stair', 1); s.move('door', 0.4, { over: 1.1, ease: 'out' });
      boy.here(true);
      await s.wait(0.8); s.tell('cutting:door');
      await s.wait(2.6);
      alf.look('toto');
      await s.wait(1.2);
      s.move('door', 1, { over: 0.9 });
      await boy.walk([IN_GAP, [1.55, 0.95], BOY_BY]);
      await boy.turn(35); boy.look('alfredo');
      s.tell('cutting:bench');
      await s.wait(1.6);
      alf.look('press#press');
      s.move('door', 0, { over: 1.5 }); s.move('stair', 0, { over: 1.5 });
      await s.wait(2.4);
    },
  },
  frames: {
    from: () => ({ ...base(0.9), ...show(1), clips: 1, ...cast({ alfredo: alfWorks, toto: boyBy }), ...CAM.bench }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      s.move('tin_open', 1, { over: 0.8 });
      alf.look('tin'); alf.reach({ r: 'tin' });
      await s.wait(2); s.tell('frames:tin');
      await s.wait(1.6);
      s.set('clips', 0);
      alf.reach(null); alf.do('stand');
      await alf.walk([[0.35, 1.3], AT_P1]);
      await alf.turn(330); alf.look('projector2_e#gate');
      boy.look('tin');
      await s.wait(1.2);
    },
  },
  tin_shut: {
    after: ['frames'],
    from: () => ({ ...base(0.9), ...show(1), tin_open: 1, ...cast({ alfredo: { at: AT_P1, turn: 330, look: 'projector2_e#gate' }, toto: boyBy }), ...CAM.bench }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await alf.walk([[0.35, 1.3], AT_BENCH]); await alf.turn(90);
      boy.look('alfredo');
      alf.look('tin'); alf.reach({ r: 'tin' });
      await s.move('tin_open', 0, { over: 0.7 });
      alf.reach({ r: 'alfredo#pocket' }); s.set('tin_at', 'pocket');
      s.tell('tin_shut:pocket');
      await s.wait(0.9); alf.reach(null); alf.look('toto');
      await s.wait(1.2);
    },
  },
  pocket: {
    after: ['frames'],
    from: () => B.tin_shut.from(),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await boy.walk([[1.3, 1.85]]); await boy.turn(60);
      boy.look('tin'); boy.reach({ r: 'tin' });
      await s.wait(1.0);
      boy.reach({ r: 'toto#hips' }); boy.look('alfredo');
      await s.wait(0.6); s.tell('pocket:hidden');
      await s.wait(0.6); boy.reach(null);
      await alf.turn(140);
      await alf.walk([[0.35, 1.3], AT_BENCH]); await alf.turn(90);
      alf.look('tin'); alf.reach({ r: 'tin' });
      await s.move('tin_open', 0, { over: 0.7 });
      alf.reach({ r: 'alfredo#pocket' }); s.set('tin_at', 'pocket');
      s.tell('pocket:tin');
      await s.wait(0.9); alf.reach(null);
      await s.wait(0.6);
    },
  },
  lesson: {
    from: () => ({ ...base(0.8), ...cast({ toto: { at: CRATE, turn: 0, look: 'projector#gate' }, alfredo: { at: BEHIND, turn: 0, look: 'projector#gate', reach: { l: 'toto#shoulder_l' } } }), ...CAM.ports }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await s.wait(1); s.tell('lesson:crate');
      await s.wait(2.5); boy.look('projector2#lever');
      await s.wait(2); boy.look('projector#gate');
      await s.wait(4.5);
    },
  },
  motor: {
    from: () => ({ ...B.lesson.from() }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      alf.look('projector#motor'); alf.reach({ l: 'toto#shoulder_l', r: 'projector#motor' });
      s.set('crank', 1); s.move('motor1', 1, { over: 1.5, ease: 'in' });
      await s.wait(2.4);
      s.set('crank', 0); s.set('p1_on', 1); s.set('active', 1);
      s.move('beam_on', 1, { over: 0.25, ease: 'out' });
      s.tell('motor:beam');
      boy.look('wall_n#look'); alf.look('wall_n#look'); alf.reach({ l: 'toto#shoulder_l' });
      await s.wait(3.2);
      await boy.turn(25);
      boy.look('projector2#lever'); boy.reach({ r: 'projector2#lever' });
      alf.look('projector2#lever'); alf.reach({ r: 'projector2#lever' });
      s.tell('motor:lever');
      await s.wait(4);
    },
  },
  knock: {
    from: () => ({ ...base(0.9), ...show(2), clock: 10, lamp: 0.85, ...cast({ alfredo: blind({ look: 'projector2_e#gate' }), elena: { at: EL_DOOR, turn: 270, look: 'alfredo' } }), elena_here: false, ...CAM.door }),
    run: async s => {
      const alf = s.person('alfredo'), el = s.person('elena');
      await s.wait(1.2);
      s.set('stair', 1); el.here(true);
      await s.move('door', 1, { over: 0.9, ease: 'out' });
      s.tell('knock:in');
      await s.wait(1.4);
      alf.look('elena');
      await s.wait(6);
    },
  },
  runs: {
    after: ['knock'],
    from: () => ({ ...base(0.9), ...show(2), clock: 10, lamp: 0.85, door: 1, stair: 1, ...cast({ alfredo: blind({ look: 'elena' }), elena: { at: EL_DOOR, turn: 270, look: 'alfredo' } }), ...CAM.door }),
    run: async s => {
      const alf = s.person('alfredo'), el = s.person('elena');
      await el.turn(180);
      el.gait('run');
      const away = el.walk([[2.55, 0.2], EL_AWAY]);
      await s.wait(0.6);
      s.move('door', 0, { over: 0.3, ease: 'in' }); s.tell('runs:gone');
      await away; el.here(false);
      alf.look('projector2_e#gate');
      await alf.turn(70);
      alf.reach({ r: 'projector2_e#gate' });
      await s.wait(2.4);
    },
  },
  note: {
    after: ['knock'],
    from: () => B.runs.from(),
    run: async s => {
      const alf = s.person('alfredo'), el = s.person('elena');
      await s.wait(4);
      el.look('door#edge');
      await el.walk([EL_IN]);
      el.reach({ r: 'door#edge' });
      await s.move('door', 0.4, { over: 1.2 });
      el.reach(null);
      await el.walk([[1.05, 0.78], [1.3, 1.3], EL_CAL]); await el.turn(90);
      el.look('calendar#page'); el.do('paint');
      await s.wait(1.4); s.tell('note:writing');
      await s.move('written', 1, { over: 4 });
      el.do('stand');
      await el.turn(220);
      await el.walk([[1.3, 1.3], [1.05, 0.78], [1.6, 0.45], [2.3, 0.45], EL_AWAY]);
      el.here(false);
      await s.move('door', 0, { over: 1.6 });
      s.tell('note:gone');
      alf.look('projector2_e#gate'); await alf.turn(70);
      alf.reach({ r: 'projector2_e#gate' });
      await s.wait(2.4);
    },
  },
};

// ---- running the beats ----
let ready = null;   // the shot made ready for the beat expected next: { name, cont, shot }
function opening(name, cont) {
  const b = B[name];
  const v = cont ? (b.open ? b.open() : null) : b.from();
  if (v && 'door' in v) v.door_f = (270 + 170 * v.door) % 360;
  return v;
}
function start(name) {
  const b = B[name];
  if (!b) { scene.warn('Будка: нет куска «' + name + '»'); return; }
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
function light() { scene.set('night_k', scene.get('hour') >= 0.85 ? 1 : 0); }
function door() { scene.set('door_f', (270 + 170 * Math.max(0, Math.min(1, scene.get('door')))) % 360); }
scene.on('change', 'hour', light);
scene.on('change', 'door', door);
scene.on('move', 'door', door);
scene.on('change', 'beat', v => { if (v) start(v); });
scene.on('change', 'beat_next', () => { if (scene.get('beat_last')) { if (ready) ready.shot.cancel(); ready = null; prepare(scene.get('beat_last')); } });
light(); door();
{
  const b = scene.get('beat');
  if (b && scene.get('beat_last') !== b) start(b);
  else if (b) prepare(b);
}
