// Славянский базар: the scene's mechanics. The door's leaf turns by `door`; what the party decided shows at once
// (`spring` — the snow or the thaw, `dog_here` — the spitz on the armchair); `think` turns their looks; the beats are
// a film in pieces, started by the game setting `beat` (each ends saying `beat:<name>` and setting `beat_end`).
const L = scene.lib;
const on = k => Number(scene.get(k)) > 0.5;

function door() { scene.set('door_f', L.doorFacing(scene.get('door'))); }
scene.on('change', 'door', door);
scene.on('move', 'door', door);
function party() {
  scene.set('snowing', on('spring') ? 0 : 1);
  scene.set('spitz_here', on('dog_here') ? 1 : 0);
}
scene.on('change', 'spring', party);
scene.on('change', 'dog_here', party);
door();
party();

// «Советоваться»: where they look — the window (he), the door (she), the two glasses (both)
const LOOKS = {
  none: { gurov: 'anna', anna: 'gurov' },
  window: { gurov: 'window', anna: 'gurov' },
  door: { gurov: 'anna', anna: 'door' },
  table: { gurov: 'glasses', anna: 'glasses' },
};
scene.on('change', 'think', t => {
  const l = LOOKS[t] || LOOKS.none;
  scene.set('gurov_look', l.gurov);
  scene.set('anna_look', l.anna);
});

// where every beat may begin from: evening, the lamp; she at the window, her back to the room; he just inside the
// door; the waiter gone; the spitz on the armchair if the party says so
function base(extra) {
  return {
    fade: 0, ...L.ROOM_CAM,
    tea: 0, tap: 0, fill: 0, spill: 0, mirror: 0, think: 'none', door: 0, door_f: 180, samovar: 0,
    snowing: on('spring') ? 0 : 1,
    spitz_here: on('dog_here') ? 1 : 0, spitz_a: L.ARMCHAIR[0], spitz_d: L.ARMCHAIR[1] - 0.25, spitz_e: L.ARMCHAIR[2] + 0.01,
    spitz_do: 'lie', spitz_view: 'side', spitz_dir: 1, spitz_look: null, leash: 'chair',
    anna_here: true, anna_a: L.ANNA_WINDOW[0], anna_d: L.ANNA_WINDOW[1], anna_turn: 0, anna_do: 'stand', anna_look: null, anna_reach: null,
    gurov_here: true, gurov_a: L.IN_DOOR[0], gurov_d: L.IN_DOOR[1], gurov_turn: 160, gurov_do: 'stand', gurov_on: null, gurov_look: 'anna', gurov_reach: null, gurov_with: null,
    waiter_here: false, waiter_a: L.OUTSIDE[0], waiter_d: L.OUTSIDE[1], waiter_turn: 180, waiter_with: null, waiter_gait: null, waiter_reach: null,
    ...extra,
  };
}
const SHOULDERS = { gurov_a: L.GUROV_BEHIND[0], gurov_d: L.GUROV_BEHIND[1], gurov_turn: 20, gurov_reach: { r: 'anna#shoulder_r', l: 'anna#shoulder_l' }, gurov_look: 'anna' };
const AT_TABLE = { gurov_a: L.CHAIR_SEAT[0], gurov_d: L.CHAIR_SEAT[1], gurov_on: L.CHAIR_SEAT, gurov_turn: 270, gurov_do: 'seated', gurov_look: 'glasses', samovar: 1 };
const CLOSE = { gurov_a: L.GUROV_CLOSE[0], gurov_d: L.GUROV_CLOSE[1], gurov_turn: 90, gurov_look: 'anna',
  anna_a: L.ANNA_CLOSE[0], anna_d: L.ANNA_CLOSE[1], anna_turn: 270, anna_look: 'gurov' };

// he stands up from the table if he sits at it
async function upFromTable(s, gurov) {
  if (!s.state.gurov_on) return;
  gurov.on(null);
  await gurov.do('rise');
}
// she goes back to the window (if she is not there) and stands with her back to the room
async function annaToWindow(s, anna) {
  anna.reach(null);
  if (Math.hypot(s.state.anna_a - L.ANNA_WINDOW[0], s.state.anna_d - L.ANNA_WINDOW[1]) > 0.15) await anna.walk([L.ANNA_WINDOW]);
  await anna.turn(0);
}

const BEATS = {
  // he comes in at the door; she comes to meet him and they stand holding each other by the door (anna_life 1) —
  // or she stays at the window, her back to him (0)
  bazar_in: {
    after: [], from: () => base({ gurov_here: false, gurov_a: L.OUTSIDE[0], gurov_d: L.OUTSIDE[1], gurov_turn: 180, gurov_look: null }),
    run: async s => {
      const gurov = s.person('gurov'), anna = s.person('anna');
      await s.wait(1.5);
      await s.move('door', 1, { over: 1.2, ease: 'inOut' });
      gurov.here(true);
      await gurov.walk([L.IN_DOOR]);
      gurov.look('anna');
      if (on('anna_life')) {
        anna.look('gurov');
        await s.all(anna.walk([L.ANNA_MEET]), gurov.walk([L.GUROV_MEET]));
        await s.all(anna.turn(270), gurov.turn(90));
        gurov.reach({ r: 'anna#back', l: 'anna#back' });
        anna.reach({ r: 'gurov#nape', l: 'gurov#nape' });
        gurov.look('anna#head');
        anna.look('gurov#shoulder_r');
      }
      s.tell('bazar_in:met');
      s.move('door', 0, { over: 1.6, ease: 'inOut' });
      await s.wait(4);
    },
  },
  // he behind her at the window, his hands on her shoulders; the close-up of the mirror for 4 s, and back
  shoulders: {
    after: ['bazar_in', 'weep'], from: () => base({ ...SHOULDERS }),
    run: async s => {
      const gurov = s.person('gurov'), anna = s.person('anna');
      gurov.reach(null);
      gurov.do('stand');
      anna.do('stand');
      await upFromTable(s, gurov);
      await s.all(annaToWindow(s, anna), gurov.walk([L.GUROV_BEHIND]));
      await gurov.turn(20);
      gurov.look('anna');
      gurov.reach({ r: 'anna#shoulder_r', l: 'anna#shoulder_l' });
      await s.wait(1.4);
      s.set('mirror', 1);
      s.tell('shoulders:mirror');
      await s.wait(4);
      s.set('mirror', 0);
      await s.wait(1.2);
    },
  },
  // the waiter brings the samovar on a tray, sets it on the table and goes; he sits down to the table; the close-up
  // of the tap and the glass
  tea: {
    after: ['bazar_in', 'shoulders'], from: () => base({}),
    run: async s => {
      const gurov = s.person('gurov'), anna = s.person('anna'), waiter = s.person('waiter');
      gurov.reach(null);
      anna.reach(null);
      gurov.do('stand');
      anna.do('stand');
      gurov.look('door');
      await s.move('door', 1, { over: 1.0, ease: 'inOut' });
      waiter.with(['tray']);
      waiter.gait('carry_tray');
      waiter.here(true);
      const sits = (async () => {
        await s.wait(1.2);
        await gurov.go('sit_down', { to: [L.CHAIR_SEAT[0], L.CHAIR_SEAT[1]], turn: 270 });
        gurov.on(L.CHAIR_SEAT);
        gurov.do('seated');
        gurov.look('samovar');
      })();
      const back = annaToWindow(s, anna);
      await waiter.walk([L.WAITER_SET]);
      await waiter.turn(180);
      const at = [L.TABLE[0] + 0.27, L.TABLE[1] + 0.12, L.TABLE[2] + 0.1];
      waiter.reach({ r: at, l: at });
      await s.wait(0.8);
      s.set('samovar', 1);
      waiter.with(null);
      waiter.reach(null);
      waiter.gait(null);
      await waiter.walk([L.IN_DOOR, L.OUTSIDE]);
      waiter.here(false);
      s.move('door', 0, { over: 1.2, ease: 'inOut' });
      await s.all(sits, back);
      await s.wait(0.6);
      s.set('tea', 1);
    },
  },
  // back from the close-up: he at the table with his glass; she at the window, her back to him, her shoulders shake
  weep: {
    after: ['tea'], from: () => base({ ...AT_TABLE }),
    run: async s => {
      if (Number(s.state.tea) > 0) s.set('tea', 0);
      const gurov = s.person('gurov'), anna = s.person('anna');
      gurov.reach({ l: L.GLASS });
      gurov.look('anna');
      anna.do('weep_stand', { loop: true });
      await s.wait(10);
    },
  },
  // the two at the window (he comes from the table if he sat there); she turns to him; they stand close
  cages: {
    after: ['shoulders', 'weep'], from: () => base({ ...CLOSE, samovar: 1 }),
    run: async s => {
      const gurov = s.person('gurov'), anna = s.person('anna');
      gurov.reach(null);
      if (!s.state.gurov_on) gurov.do('stand');
      await upFromTable(s, gurov);
      await gurov.walk([L.GUROV_CLOSE]);
      await gurov.turn(90);
      anna.do('stand');
      gurov.look('anna');
      await anna.walk([L.ANNA_CLOSE]);
      await anna.turn(270);
      anna.look('gurov');
      s.tell('cages:turned');
      await s.wait(8);
    },
  },
  // the same — «Советоваться» plays over it (the window, the door, the table are offered)
  sovet: {
    after: ['cages'], from: () => base({ ...CLOSE, samovar: 1 }),
    run: async s => { await s.wait(2); },
  },
  // the camera draws slowly back; the lamp; the two at the window; the spitz on the armchair lifts its head
  bazar_end: {
    after: ['sovet'], from: () => base({ ...CLOSE, samovar: 1 }),
    run: async s => {
      s.set('think', 'none');
      if (on('dog_here')) { s.set('spitz_do', 'sit'); s.set('spitz_look', 'anna'); }
      await s.move('camera_z', -0.6, { over: 12, ease: 'inOut' });
    },
  },
};

scene.on('change', 'beat', (name, old) => {
  const b = BEATS[name];
  if (!b) return;
  scene.sequence(async s => {
    if (!b.after.includes(old)) {
      const next = s.shot(b.from());
      await s.until(() => next.ready);
      next.cut();
    }
    await b.run(s);
    s.set('beat_end', name);
    s.tell('beat:' + name);
  }, { name: 'beat' });
});
