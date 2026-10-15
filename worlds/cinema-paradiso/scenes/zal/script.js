// Зал — the scene's mechanics: its beats (the game sets `beat`), the light's key from `era`, and the body's answers
// to the keys the game moves in «Подглядывать» (`peek` — the boy leans out from behind the curtain; `bell` — the
// priest rings; `turn` — he looks round at the curtain). A beat plays from its start: if it follows (`after`) the
// beat that last ended, it goes on from there (a cut to its own camera when it has one); otherwise it cuts to its
// `from`. At its end it says `beat:<name>` and makes ready the opening shot of the beat that may come next.
const L = scene.lib, G = L.G, CH = scene.kit.cast.characters;
const IDS = ['adelfio', 'toto'];
const SIT = { motion: 'seated', loop: true };
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };

// ---- the camera's shots (metres from the start at the back of the hall; yaw — degrees right of north) ----
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const SAL = [-5.6, 9.2];                             // where Salvatore stops in 1988, by the 5th row, facing the lion
const CAM = {
  back: cam(-1.4, 5.0, -8, 0.6, -2),                  // behind the last rows, left of the beam: the priest, the beam across, the screen
  curtain: cam(-8.3, 6.25, 64, -0.55, 4),              // from the corridor through the side door: the curtain, the boy, the priest
  ruin: cam(3.0, 16.4, 196, 0.6, 5),                 // 1988, from the stage's foot back over the ruined rows to the lion
  lion: cam(-4.0, 15.0, 177, 0, 7),                  // behind Salvatore, 3/4 from his right: the lion over the back wall
};
const BOY = [-7.0, 7.25];                            // behind the curtain, at its north part

// ---- the keys a beat starts from ----
const base = (era) => ({
  era, hour: era === 'ruin' ? 0.8 : 0.9, ruin_k: era === 'ruin' ? 1 : 0, past: era === 'ruin' ? 0 : 1,
  hall: 'empty', screen_film: 'romance', beam_on: era === 'ruin' ? 0 : 1, rise: 0, laugh: 0, peek: 0, bell: 0, turn: 0,
});
function cast(who) {
  const o = {};
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null;
    if (id === 'toto') { o.toto_wear = p.wear ?? null; o.toto_gait = null; }
  }
  return o;
}
const priestSits = { at: G.PRIEST, turn: 0, do: SIT, look: 'screen#screen' };
const boyHides = { at: BOY, turn: 70, look: 'curtain#gap' };

// ---- the beats ----
const B = {
  priest: {
    from: () => ({ ...base('past'), ...cast({ adelfio: priestSits }), ...CAM.back }),
    run: async s => {
      const curtain = s.shot({ ...CAM.curtain, ...cast({ adelfio: priestSits, toto: boyHides }) });
      await s.wait(3); s.tell('priest:sat');
      await s.wait(10.5);
      curtain.cut();
      await s.wait(0.5);
    },
  },
  peek: {
    after: ['priest'],
    from: () => ({ ...base('past'), ...cast({ adelfio: priestSits, toto: boyHides }), ...CAM.curtain }),
    run: async s => { await s.wait(3); },
  },
  bell_end: {
    after: ['peek'],
    from: () => B.peek.from(),
    run: async s => {
      const p = s.person('adelfio'), boy = s.person('toto');
      s.set('peek', 0, 0.4); s.set('bell', 0); s.set('turn', 0);
      p.look(null); p.reach(null);
      await p.go('rise_chair', { from: G.PRIEST, turn: 0 });
      boy.look('adelfio');
      await p.walk([[G.AISLE_X, G.PRIEST[1]]]);
      await p.walk([[G.AISLE_X, G.DOOR[0] - 0.4]]);
      s.tell('bell_end:out');
      await p.walk([[G.AISLE_X, 4.4]]);
      p.here(false);
      boy.look('curtain#gap');
      await s.wait(0.6);
    },
  },
  full_hall: {
    from: () => ({ ...base('past'), hall: 'full', screen_film: 'comedy', ...cast({}), ...CAM.back }),
    run: async s => {
      await s.wait(0.6); s.move('laugh', 1, { over: 0.4 }); await s.wait(0.4); s.tell('full_hall:laugh');
      await s.wait(3.2); s.move('laugh', 0.25, { over: 1.2 });
      await s.wait(2.4); s.move('laugh', 1, { over: 0.3 });
      await s.wait(3.0); s.move('laugh', 0, { over: 2.0 });
      await s.wait(2.4);
    },
  },
  first_kiss: {
    from: () => ({ ...base('past'), hall: 'full', screen_film: 'romance', ...cast({ adelfio: priestSits }), ...CAM.back }),
    run: async s => {
      const p = s.person('adelfio');
      await s.wait(1);
      s.set('screen_film', 'romance_kiss');           // the screen dissolves into the kiss over 3 s
      await s.wait(3); s.tell('first_kiss:kiss');
      s.move('rise', 1, { over: 0.9, ease: 'out' });
      await s.wait(3); s.move('rise', 0.35, { over: 2.5 });
      await s.wait(2); s.tell('first_kiss:priest');
      await p.go('rise_chair', { from: G.PRIEST, turn: 0 });
      await p.walk([[G.AISLE_X, G.PRIEST[1]], [G.AISLE_X, 2.0]]);
      p.here(false);
      s.move('rise', 0, { over: 2 });
      await s.wait(0.8);
    },
  },
  whistle: {
    from: () => ({ ...base('past'), hall: 'standing', screen_film: 'white', rise: 1, ...cast({}), ...CAM.back }),
    run: async s => {
      s.move('laugh', 0.6, { over: 0.5 });
      await s.wait(1); s.tell('whistle:white');
      await s.wait(5);
    },
  },
  ruin_hall: {
    from: () => ({ ...base('ruin'), hall: 'full', screen_film: 'comedy',
      ...cast({ toto: { at: [-7.9, 6.9], turn: 90, wear: CH.salvatore } }), ...CAM.ruin }),
    run: async s => {
      const sal = s.person('toto');
      const lion = s.shot(CAM.lion);
      await s.wait(1.2);
      await sal.walk([[-6.2, 7.1], SAL]);
      await sal.turn(brg(SAL, [G.LION[0], G.LION[1]]));
      sal.look('lion');
      s.tell('ruin_hall:seat');
      await s.wait(2.5);
      lion.cut();
      await s.wait(2);
    },
  },
  memory: {
    after: ['ruin_hall'],
    from: () => ({ ...base('ruin'), hall: 'full', screen_film: 'comedy',
      ...cast({ toto: { at: SAL, turn: brg(SAL, [G.LION[0], G.LION[1]]), wear: CH.salvatore, look: 'lion' } }), ...CAM.lion }),
    run: async s => {
      s.move('beam_on', 1, { over: 0.25, ease: 'out' });
      s.move('past', 1, { over: 0.4, ease: 'out' });
      await s.wait(0.5); s.tell('memory:warm');
      s.move('laugh', 1, { over: 0.4 });
      await s.wait(3.4); s.move('laugh', 0.2, { over: 1.2 });
      await s.wait(1.1);
      s.move('past', 0, { over: 1.5, ease: 'inOut' }); s.move('beam_on', 0, { over: 1.5, ease: 'inOut' }); s.move('laugh', 0, { over: 1.5 });
      await s.wait(1.5); s.tell('memory:gone');
      await s.wait(1.5);
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
  if (!b) { scene.warn('Зал: нет куска «' + name + '»'); return; }
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

// ---- «Подглядывать»: what the bodies do as the game moves its keys ----
let leaning = false;
function peek(v) {
  if (v > 0.5 && !leaning) { leaning = true; const boy = scene.person('toto'); boy.do('peek_lean'); }
  else if (v < 0.3 && leaning) { leaning = false; const boy = scene.person('toto'); boy.do('stand'); }
}
let ringing = null;
function bell(v) {
  if (!v) return;
  const p = scene.person('adelfio');
  p.reach({ r: 'aud5#ring' });
  if (ringing) ringing.cancel();
  ringing = scene.sequence(async s => { await s.wait(3.2); s.person('adelfio').reach(null); }, { name: 'bell' });
}
function turn(v) { scene.person('adelfio').look(v > 0.5 ? 'curtain#gap' : 'screen#screen'); }

function light() { scene.set('ruin_k', scene.get('era') === 'ruin' ? 1 : 0); }
// the curtain turns aside about its jamb as the boy pushes it: 0 — hanging in the door, 1 — 75° into the corridor
function curtain() { scene.set('curtain_f', 270 + 75 * Math.max(0, Math.min(1, scene.get('peek')))); }
scene.on('change', 'peek', curtain);
scene.on('move', 'peek', curtain);
scene.on('change', 'era', light);
scene.on('change', 'peek', peek);
scene.on('move', 'peek', () => peek(scene.get('peek')));
scene.on('change', 'bell', bell);
scene.on('change', 'turn', turn);
scene.on('change', 'beat', v => { if (v) start(v); });
scene.on('change', 'beat_next', () => { if (scene.get('beat_last')) { if (ready) ready.shot.cancel(); ready = null; prepare(scene.get('beat_last')); } });
light(); curtain();
leaning = scene.get('peek') > 0.5;
{
  const b = scene.get('beat');
  if (b && scene.get('beat_last') !== b) start(b);
  else if (b) prepare(b);
}
