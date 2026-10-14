// Пристань — the scene's mechanics: its beats (the game sets `beat`), the light's keys from `hour` and `era`, the
// car's place from `car_arrive` and `car_go`. A beat plays from its start: if it follows (`after`) the beat that
// last ended, it goes on from there (a cut to its camera when it has its own); otherwise it cuts to its `from`.
// At its end it says `beat:<name>` and makes ready the opening shot of the beat that may come next.
const L = scene.lib, G = L.G;
const IDS = ['toto', 'elena', 'daughter', 'alfredo', 'banker', 'c1', 'c2', 'c3', 'c4'];
const SIT = { motion: 'seated', loop: true }, HUNCH = { motion: 'seated_hunched', loop: true };
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };

// ---- the camera's shots (metres from the start; yaw — degrees right of north) ----
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  wide: cam(3.5, -1.0, -8, 0.5, 3),        // the summer cinema: the beam over the chairs, the screen, the boats, the moon
  close: cam(0.9, 3.6, -22, 0, 2),         // Toto at the projector, Elena on her crate, the screen beyond
  head: cam(-4.8, 13.5, 152, 0, 0),        // behind Toto, toward the car on the quay in the rain
  found: cam(1.0, 41, 2, 0.2, 1),          // down the mole to Toto on his bollard by the lantern; Elena runs past
  foundEnd: { camera_x: 1.4, camera_z: 52.3 },
  alone: cam(1.6, 51.5, 6, 0.2, 2),        // Toto alone, his back, the sea and the moon's path
  back: cam(-1.8, 5.0, -56, 0, -3),        // the bench at the warehouse at dusk: Alfredo and Toto side by side
  carNow: cam(3.6, 40, -10, 0.1, 1),       // 1988: the car on the head, Elena by it; the daughter goes; he comes
  meet: cam(-8.0, 53.2, 90, 1.0, -1),      // from the water, side on: Elena and Salvatore in the car's light
};

// ---- the keys a beat starts from ----
const carKeys = (type, arrive, go) => {
  if (type !== 'old' && type !== 'new') return { car: 'none', car_arrive: 1, car_go: 0, headlights: 0 };
  const c = L.carAt(type, arrive, go);
  return { car: type, car_arrive: arrive, car_go: go, car_a: c.x, car_d: c.z, car_f: c.h };
};
const base = (era, hour) => ({
  era, hour, dusk_k: hour < 0.84 ? 1 : 0, now_k: era === 'now' ? 1 : 0,
  rain: 0, screen_up: 0, screen_film: 'romance', beam_on: 0, cover: 0, crowd: 0, boats_out: 1, headlights: 0,
  ...carKeys('none'),
});
function cast(who) {
  const o = {};
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_gait'] = null;
    if (id === 'toto' || id === 'elena') o[id + '_wear'] = p.wear ?? null;
  }
  return o;
}
const audience = () => ({
  c1: { at: G.C_SEATS.c1, turn: 0, do: SIT }, c2: { at: G.C_SEATS.c2, turn: 0, do: SIT },
  c3: { at: G.C_SEATS.c3, turn: 0, do: SIT }, c4: { at: G.C_SEATS.c4, turn: 0, do: SIT },
});

// ---- places of the beats ----
const OLD = (side, fwd) => L.byCar('old', 1, 0, side, fwd);         // round the banker's car where it stands
const EL_TURN = OLD(-0.4, 2.8), EL_DOOR = OLD(-1.35, 0.2), BK_IN = OLD(-1.3, -0.7), BK_BACK = OLD(0, -2.9), BK_OUT = OLD(1.5, -0.6);
const EL_NOW = [-1.4, 55.0], SAL_STOP = [-0.4, 47.8], SAL_MEET = [-0.9, 52.4], SAL_ASK = [-1.05, 53.55], EL_ASK = [-1.25, 54.4];
// the reverse shot on Elena turning at the car: from the side of the mole, Toto behind the camera
CAM.turn = (() => {
  const dx = G.TOTO_PROJ[0] - EL_TURN[0], dz = G.TOTO_PROJ[1] - EL_TURN[1], d = Math.hypot(dx, dz);
  const x = EL_TURN[0] + dx / d * 6.4 + dz / d * 0.9, z = EL_TURN[1] + dz / d * 6.4 - dx / d * 0.9;
  return cam(+x.toFixed(2), +z.toFixed(2), +((brg([x, z], EL_TURN) + 2) % 360).toFixed(1), 0, 1);
})();
const RUN = {
  c1: [[-3.6, 13.6], [-4.5, 11.6], [-4.95, 10.6]], c2: [[-2.6, 13.8], [-4.3, 12.0], [-4.95, 10.9]],
  c3: [[-0.4, 13.6], [-3.9, 12.6], [-4.95, 10.3]], c4: [[0.6, 13.9], [-3.6, 13.0], [-4.95, 11.1]],
};
const goSeconds = (type, speed) => { const r = L.road(type); return (r.L - r.park) / speed; };

// ---- the beats ----
const B = {
  summer: {
    from: () => ({ ...base('past', 0.9), screen_up: 1, beam_on: 1, crowd: 1, boats_out: 0,
      ...cast({ toto: { at: G.TOTO_PROJ, turn: 5, look: 'screen#screen' }, elena: { at: G.CRATE, turn: 340, do: SIT, look: 'screen#screen' }, ...audience() }),
      ...CAM.wide }),
    run: async s => {
      const toto = s.person('toto'), elena = s.person('elena');
      const close = s.shot(CAM.close);
      await s.wait(3); s.tell('summer:screen');
      await s.wait(9);
      s.move('rain', 1, { over: 3, ease: 'in' }); s.tell('summer:rain');
      s.move('crowd', 0, { over: 3.5 }); s.move('boats_out', 1, { over: 10, ease: 'inOut' });
      toto.look([G.TOTO_PROJ[0] + 0.4, G.TOTO_PROJ[1] + 3, 6]);
      const runs = ['c1', 'c2', 'c3', 'c4'].map(async (id, i) => {
        const p = s.person(id);
        await s.wait(0.2 + i * 0.35 + s.random() * 0.4);
        await p.go('rise', { from: G.C_SEATS[id], turn: 0 });
        p.gait('run');
        await p.walk(RUN[id]);
        p.here(false);
      });
      await s.wait(1.6);
      close.cut();
      toto.look('projector'); elena.look('toto');
      await Promise.all(runs);
      await s.wait(0.8);
    },
  },
  covered: {
    after: ['summer'],
    from: () => ({ ...base('past', 0.9), screen_up: 1, beam_on: 1, rain: 1, crowd: 0, boats_out: 1,
      ...cast({ toto: { at: G.TOTO_PROJ, turn: 5, look: 'projector' }, elena: { at: G.CRATE, turn: 340, do: SIT, look: 'toto' } }), ...CAM.close }),
    run: async s => {
      const toto = s.person('toto'), elena = s.person('elena');
      toto.look('projector#tarp'); toto.reach({ r: 'projector#tarp', l: 'projector#tarp' });
      const her = (async () => {
        await s.wait(0.6);
        await elena.go('rise', { from: G.CRATE, turn: 340 });
        await elena.walk([G.ELENA_BY]);
        await elena.turn(brg(G.ELENA_BY, G.TOTO_PROJ));
        elena.look('toto');
      })();
      await s.wait(0.3);
      const cover = s.move('cover', 1, { over: 2.8, ease: 'inOut' });
      await s.wait(1.7); s.move('beam_on', 0, { over: 1.0 });
      await cover;
      toto.reach(null); toto.look('elena');
      await s.wait(0.5); s.tell('covered:done');
      await her;
    },
  },
  headlights: {
    after: ['covered'],
    open: () => ({ ...carKeys('old', 0, 0), headlights: 1, banker_here: false, banker_a: BK_IN[0], banker_d: BK_IN[1], ...CAM.head }),
    from: () => ({ ...base('past', 0.9), screen_up: 1, rain: 1, cover: 1, boats_out: 1,
      ...cast({ toto: { at: G.TOTO_PROJ, turn: 120, look: 'elena' }, elena: { at: G.ELENA_BY, turn: 290, look: 'toto' } }),
      banker_a: BK_IN[0], banker_d: BK_IN[1], ...carKeys('old', 0, 0), headlights: 1, ...CAM.head }),
    run: async s => {
      const toto = s.person('toto'), elena = s.person('elena'), banker = s.person('banker');
      const turnShot = s.shot(CAM.turn);
      toto.look('car_front');
      s.move('car_arrive', 1, { over: 3.2, ease: 'out' });
      await s.wait(1.4);
      elena.look('car_front');
      const walk = elena.walk([[-0.6, 5.2], [1.2, 3.0], EL_TURN]);
      await s.wait(1.6);
      s.tell('headlights:father');
      banker.here(true);
      const him = (async () => { await banker.walk([BK_BACK, BK_OUT]); await banker.turn(brg(BK_OUT, G.TOTO_PROJ)); })();
      await walk;
      turnShot.cut();
      await elena.turn(brg(EL_TURN, G.TOTO_PROJ)); elena.look('toto'); toto.look('elena');
      s.tell('headlights:turn');
      await s.wait(3.2);
      const backShot = s.shot(CAM.head);
      await elena.walk([EL_DOOR]); elena.here(false);
      await him;
      await banker.walk([BK_BACK, BK_IN]); banker.here(false);
      backShot.cut();
      toto.look('car_back');
      s.move('car_go', 1, { over: goSeconds('old', 8), ease: 'in' });
      await s.wait(2.8);
    },
  },
  found: {
    from: () => ({ ...base('past', 0.9),
      ...cast({ toto: { at: G.BOLLARD, turn: 0, do: HUNCH }, elena: { at: [-0.8, 37.5], turn: 0 } }), ...CAM.found }),
    run: async s => {
      const toto = s.person('toto'), elena = s.person('elena');
      elena.gait('run');
      const run = elena.walk([[-0.3, 50], [1.6, 57.8], [1.95, 59.6]]);
      s.move('camera_z', CAM.foundEnd.camera_z, { over: 6.5, ease: 'inOut' });
      s.move('camera_x', CAM.foundEnd.camera_x, { over: 6.5, ease: 'inOut' });
      await s.wait(3); s.tell('found:run');
      await s.wait(1.2);
      const up = toto.go('rise', { from: G.BOLLARD, turn: 0 });
      await run; elena.gait(null);
      await up;
      await s.all(toto.turn(270), elena.turn(90));
      toto.look('elena'); elena.look('toto');
      toto.reach({ r: 'elena#back', l: 'elena#back' }); elena.reach({ r: 'toto#nape', l: 'toto#nape' });
      await s.wait(0.8); s.tell('found:hug');
      await s.wait(7);
    },
  },
  alone: {
    from: () => ({ ...base('past', 0.9), ...cast({ toto: { at: G.BOLLARD, turn: 0, do: HUNCH } }), ...CAM.alone }),
    run: async s => {
      s.move('camera_z', CAM.alone.camera_z + 1.2, { over: 10, ease: 'inOut' });
      await s.wait(6); s.tell('alone:sea');
      await s.wait(3.5);
    },
  },
  back: {
    from: () => ({ ...base('past', 0.78),
      ...cast({ alfredo: { at: G.BENCH_A, turn: 90, do: SIT, reach: { r: 'cane#grip', l: 'cane#grip' } }, toto: { at: [-0.4, 6.2], turn: 300 } }), ...CAM.back }),
    run: async s => {
      const toto = s.person('toto'), alf = s.person('alfredo');
      await toto.go('sit_down', { to: G.BENCH_B, turn: 90 });
      toto.do('seated', { loop: true });
      s.tell('back:sat');
      await s.wait(8);
      alf.look('toto');
      await s.wait(6);
    },
  },
  rise_go: {
    after: ['back'],
    from: () => ({ ...base('past', 0.78),
      ...cast({ alfredo: { at: G.BENCH_A, turn: 90, do: SIT, reach: { r: 'cane#grip', l: 'cane#grip' }, look: 'toto' }, toto: { at: G.BENCH_B, turn: 90, do: SIT } }), ...CAM.back }),
    run: async s => {
      const toto = s.person('toto'), alf = s.person('alfredo');
      await toto.go('rise', { from: G.BENCH_B, turn: 90 });
      toto.look('alfredo'); toto.reach({ r: 'alfredo#shoulder_l' });
      await s.wait(1.8);
      toto.reach(null); toto.look(null); alf.look('toto');
      const away = toto.walk([[-2.4, 5.6], [0.2, 2.4], [4.5, -2.5]]);
      await s.wait(3.4); s.tell('rise_go:gone');
      await away; toto.here(false);
    },
  },
  car: {
    from: () => ({ ...base('now', 0.9), ...carKeys('new', 1, 0), headlights: 1,
      ...cast({ elena: { at: EL_NOW, turn: 0, wear: 'elena_grown' }, daughter: { at: [-0.4, 54.4], turn: 300, look: 'elena' }, toto: { at: [2.4, 36], turn: 345, wear: 'salvatore' } }), ...CAM.carNow }),
    run: async s => {
      const sal = s.person('toto'), d = s.person('daughter');
      await s.wait(1.2);
      const her = (async () => { await d.walk([[-2.0, 50.5], [-2.3, 40]]); d.here(false); })();
      await s.wait(1.8);
      await sal.walk([SAL_STOP]);
      await sal.turn(brg(SAL_STOP, EL_NOW)); sal.look('elena');
      await her;
      await s.wait(1);
    },
  },
  meet: {
    after: ['car'],
    open: () => ({ ...CAM.meet }),
    from: () => ({ ...base('now', 0.9), ...carKeys('new', 1, 0), headlights: 1,
      ...cast({ elena: { at: EL_NOW, turn: 0, wear: 'elena_grown' }, toto: { at: SAL_STOP, turn: brg(SAL_STOP, EL_NOW), wear: 'salvatore', look: 'elena' } }), ...CAM.meet }),
    run: async s => {
      const el = s.person('elena'), sal = s.person('toto');
      await s.wait(0.5);
      await el.turn(brg(EL_NOW, SAL_MEET)); el.look('toto'); s.tell('meet:turned');
      await s.wait(0.8);
      await sal.walk([SAL_MEET]); await sal.turn(brg(SAL_MEET, EL_NOW)); sal.look('elena');
      await s.wait(4);
    },
  },
  ask: {
    after: ['meet'],
    from: () => ({ ...B.meet.from(),
      ...cast({ elena: { at: EL_NOW, turn: brg(EL_NOW, SAL_MEET), wear: 'elena_grown', look: 'toto' }, toto: { at: SAL_MEET, turn: brg(SAL_MEET, EL_NOW), wear: 'salvatore', look: 'elena' } }) }),
    run: async s => {
      const el = s.person('elena'), sal = s.person('toto');
      await s.all(sal.walk([SAL_ASK]), el.walk([EL_ASK]));
      await s.all(sal.turn(brg(SAL_ASK, EL_ASK)), el.turn(brg(EL_ASK, SAL_ASK)));
      el.look('toto'); sal.look('elena');
      el.reach({ r: 'toto#chest' });
      await s.wait(0.9); s.tell('ask:hand');
      await s.wait(2.2);
      el.reach(null);
      await el.walk([[-1.35, 55.4]]);
    },
  },
  bye: {
    after: ['meet'],
    from: () => B.ask.from(),
    run: async s => {
      const el = s.person('elena'), sal = s.person('toto');
      await sal.walk([[SAL_MEET[0] + 0.05, SAL_MEET[1] - 0.6]], { steps: false });
      el.look([SAL_MEET[0] - 0.2, SAL_MEET[1] + 1.2, 0.3]);
      await s.wait(1.1);
      el.look('toto'); s.tell('bye:nod');
      await s.wait(2);
      await el.walk([[-1.35, 55.4]]);
    },
  },
  parting: {
    after: ['ask', 'bye'],
    from: () => ({ ...B.meet.from(),
      ...cast({ elena: { at: [-1.35, 55.4], turn: 20, wear: 'elena_grown' }, toto: { at: SAL_MEET, turn: brg(SAL_MEET, EL_NOW), wear: 'salvatore', look: 'elena' } }) }),
    run: async s => {
      const el = s.person('elena'), sal = s.person('toto');
      await el.walk([[-0.2, 54.4], [1.15, 55.2], [1.15, 56.4]]);
      el.here(false);
      sal.look('car_side_l');
      s.move('car_go', 1, { over: goSeconds('new', 7), ease: 'in' });
      await s.wait(6.5); s.tell('parting:gone');
      sal.look(null);
      await s.wait(2);
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
  if (!b) { scene.warn('Пристань: нет куска «' + name + '»'); return; }
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

// ---- the light's keys and the car's place ----
function light() {
  const h = scene.get('hour'), era = scene.get('era');
  scene.set('dusk_k', h < 0.84 ? 1 : 0);
  scene.set('now_k', era === 'now' ? 1 : 0);
}
function placeCar() {
  const t = scene.get('car');
  if (t !== 'old' && t !== 'new') return;
  const c = L.carAt(t, scene.get('car_arrive'), scene.get('car_go'));
  scene.set('car_a', c.x); scene.set('car_d', c.z); scene.set('car_f', c.h);
}
scene.on('change', 'hour', light);
scene.on('change', 'era', light);
for (const k of ['car', 'car_arrive', 'car_go']) { scene.on('change', k, placeCar); scene.on('move', k, placeCar); }
scene.on('change', 'beat', v => { if (v) start(v); });
scene.on('change', 'beat_next', () => { if (scene.get('beat_last')) { if (ready) ready.shot.cancel(); ready = null; prepare(scene.get('beat_last')); } });
light(); placeCar();
{
  const b = scene.get('beat');
  if (b && scene.get('beat_last') !== b) start(b);
  else if (b) prepare(b);
}
