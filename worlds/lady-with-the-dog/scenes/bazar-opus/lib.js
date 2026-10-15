// Славянский базар: what the paintings and the script share — the room in metres, the shots, the film in beats
// (FILM: modules/beats.js plays it). A room of a Moscow hotel seen from its open side: the back wall at distance 6
// with the door on the left (across −2.1…−1.2), the gilt mirror between, the tall window on the right (across
// 0.6…2.2); the round table with the lamp (the one warm light) in the middle-left, the armchair on the left.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const WALL_D = 6.0, HALF = 2.7, CEIL = 3.4;
const DOOR = { x0: -2.1, x1: -1.2, h: 2.35 };
const WIN = { x0: 0.6, x1: 2.2, sill: 0.45, top: 3.0 };
const MIRROR = { x: -0.3, w: 0.8, y0: 0.95, y1: 2.35 };
// the door's leaf: `door` 0 shut … 1 open into the room (its facing, degrees)
const doorFacing = door => 180 + 82 * clamp01(door);
const TABLE = [-0.55, 4.1, 0.76];
const GLASS = [-0.2, 4.0, 0.84];                // his glass of tea, on the table's right side
const CHAIR_SEAT = [0.12, 4.1, 0.46];           // his chair at the table's right, facing it (turn 270)
const OUTSIDE = [-1.65, 6.45];                  // in the corridor behind the door
const IN_DOOR = [-1.6, 5.35];                   // just inside the door
const ANNA_WINDOW = [1.45, 5.45];               // at the window, her back to the room (turn 0)
const GUROV_BEHIND = [0.98, 5.08];              // behind her and to her left, his hands on her shoulders
const GUROV_MEET = [-1.3, 5.15];                // by the door, holding each other: he faces right (90) …
const ANNA_MEET = [-0.82, 5.15];                // … she left (270)
// at the window, face to face across the line the lamp lights them along: he by the window (150), she (330) — from the
// cages shot both are in profile, the lamp behind the camera on both faces
const GUROV_CLOSE = [1.05, 5.6], GUROV_CLOSE_TURN = 150;
const ANNA_CLOSE = [1.3, 5.16], ANNA_CLOSE_TURN = 330;
const WAITER_SET = [-0.45, 4.78];               // the waiter behind the table, setting the samovar down (turn 180)

// ── the shots: place x, z (metres from the start), the eye's height, yaw, pitch ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  ROOM: cam(0, 0, 1.7),                  // the room: door left, mirror, window right; the table and the lamp; the offers in 4:3
  CAGES: cam(-0.35, 4.5, 1.55, 58),      // from beside the lamp toward the window: the two in profile, 1.8 m off, lamp-lit
  END: cam(0, -0.6, 1.7),                // drawn back
};

// «Советоваться»: where they look — the window (he), the door (she), the two glasses (both); none — at each other
const LOOKS = {
  none: { gurov: 'anna', anna: 'gurov' },
  window: { gurov: 'window#window', anna: 'gurov' },
  door: { gurov: 'anna', anna: 'door#door' },
  table: { gurov: 'table#glasses', anna: 'table#glasses' },
};
const looks = think => LOOKS[think] || LOOKS.none;

function film(scene) {
  const on = k => Number(scene.get(k)) > 0.5;
  // where every beat may begin from: evening, the lamp; she at the window, her back to the room; he just inside the
  // door; the waiter gone. The party's keys (anna_life, husband_knows, wife_knows, spring) are the game's: not set here.
  const base = extra => ({
    fade: 0, ...CAM.ROOM, hour: 0.72,
    tea: 0, glass_at: 0, tap: 0, fill: 0, spill: 0, mirror: 0, think: 'none', door: 0, door_f: 180, samovar: 0,
    anna_here: true, anna_a: ANNA_WINDOW[0], anna_d: ANNA_WINDOW[1], anna_turn: 0, anna_do: 'stand', anna_look: null, anna_reach: null, anna_mood: 'sad',
    gurov_here: true, gurov_a: IN_DOOR[0], gurov_d: IN_DOOR[1], gurov_turn: 160, gurov_do: 'stand', gurov_on: null, gurov_look: 'anna',
    gurov_reach: null, gurov_with: null, gurov_mood: null,
    waiter_here: false, waiter_a: OUTSIDE[0], waiter_d: OUTSIDE[1], waiter_turn: 180, waiter_with: null, waiter_gait: null, waiter_reach: null,
    ...extra,
  });
  const SHOULDERS = { gurov_a: GUROV_BEHIND[0], gurov_d: GUROV_BEHIND[1], gurov_turn: 20, gurov_reach: { r: 'anna#shoulder_r', l: 'anna#shoulder_l' }, gurov_look: 'anna' };
  const AT_TABLE = { gurov_a: CHAIR_SEAT[0], gurov_d: CHAIR_SEAT[1], gurov_on: CHAIR_SEAT, gurov_turn: 270, gurov_do: 'seated', gurov_look: 'anna',
    gurov_reach: { l: GLASS }, samovar: 1, fill: 1, glass_at: 1 };
  const CLOSE = { gurov_a: GUROV_CLOSE[0], gurov_d: GUROV_CLOSE[1], gurov_turn: GUROV_CLOSE_TURN, gurov_look: 'anna', gurov_mood: 'thinking',
    anna_a: ANNA_CLOSE[0], anna_d: ANNA_CLOSE[1], anna_turn: ANNA_CLOSE_TURN, anna_look: 'gurov', samovar: 1, fill: 1, glass_at: 1 };

  // he stands up from the table if he sits at it
  async function upFromTable(s, gurov) {
    if (!s.state.gurov_on) return;
    gurov.on(null);
    gurov.reach(null);
    await gurov.go('rise', { from: [CHAIR_SEAT[0], CHAIR_SEAT[1]] });
  }
  // she goes back to the window (if she is not there) and stands with her back to the room
  async function annaToWindow(s, anna) {
    anna.reach(null);
    if (Math.hypot(s.state.anna_a - ANNA_WINDOW[0], s.state.anna_d - ANNA_WINDOW[1]) > 0.15) await anna.walk([ANNA_WINDOW]);
    await anna.turn(0);
  }

  return {
    // he comes in at the door; she comes to meet him and they stand holding each other by the door, her face at his
    // shoulder (anna_life 1) — or she stays at the window, her back to him (0). The envelope on the table (husband_knows
    // 0) is the table's painting.
    bazar_in: {
      from: () => base({ gurov_here: false, gurov_a: OUTSIDE[0], gurov_d: OUTSIDE[1], gurov_turn: 180, gurov_look: null }),
      run: async s => {
        const gurov = s.person('gurov'), anna = s.person('anna');
        await s.wait(1.2);
        await s.move('door', 1, { over: 1.2, ease: 'inOut' });
        gurov.here(true);
        await gurov.walk([IN_DOOR]);
        gurov.look('anna');
        if (on('anna_life')) {
          anna.look('gurov');
          await s.all(anna.walk([ANNA_MEET]), gurov.walk([GUROV_MEET]));
          await s.all(anna.turn(270), gurov.turn(90));
          gurov.do('embrace_her');
          anna.do('embrace_him');
          gurov.reach({ r: 'anna#back', l: 'anna#back' });
          anna.reach({ r: 'gurov#back', l: 'gurov#back' });
          gurov.look('anna#head');
          anna.look('gurov#shoulder_r');
          anna.mood('sad');
        }
        s.tell('bazar_in:met');
        s.move('door', 0, { over: 1.6, ease: 'inOut' });
        await s.wait(4);
      },
    },
    // he behind her at the window, his hands on her shoulders; the close-up of the mirror for 4 s, and back
    shoulders: {
      after: ['bazar_in', 'weep'], from: () => base({ ...SHOULDERS, samovar: on('samovar') ? 1 : 0 }),
      run: async s => {
        const gurov = s.person('gurov'), anna = s.person('anna');
        gurov.reach(null);
        if (!s.state.gurov_on) gurov.do('stand');
        anna.do('stand');
        await upFromTable(s, gurov);
        await s.all(annaToWindow(s, anna), gurov.walk([GUROV_BEHIND]));
        await gurov.turn(20);
        gurov.look('anna');
        gurov.reach({ r: 'anna#shoulder_r', l: 'anna#shoulder_l' });
        await s.wait(1.2);
        s.set('mirror', 1);
        s.tell('shoulders:mirror');
        await s.wait(4);
        s.set('mirror', 0);
        await s.wait(1);
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
        gurov.look('door#door');
        await s.move('door', 1, { over: 0.9, ease: 'inOut' });
        waiter.with(['tray']);
        waiter.gait('carry_tray');
        waiter.here(true);
        const sits = (async () => {
          await s.wait(0.8);
          await gurov.go('sit_down', { to: [CHAIR_SEAT[0], CHAIR_SEAT[1]], turn: 270 });
          gurov.on(CHAIR_SEAT);
          gurov.do('seated');
          gurov.look('samovar');
        })();
        const back = annaToWindow(s, anna);
        await waiter.walk([WAITER_SET]);
        await waiter.turn(180);
        const at = [TABLE[0] + 0.27, TABLE[1] + 0.12, TABLE[2] + 0.1];
        waiter.reach({ r: at, l: at });
        await s.wait(0.6);
        s.set('samovar', 1);
        waiter.with(null);
        waiter.reach(null);
        waiter.gait(null);
        await waiter.walk([IN_DOOR, OUTSIDE]);
        waiter.here(false);
        s.move('door', 0, { over: 1.2, ease: 'inOut' });
        await s.all(sits, back);
        await s.wait(0.3);
        s.set('tea', 1);
      },
    },
    // back from the close-up: he at the table with his glass (the stain by his hand, stain 1); she at the window, her
    // back to him, her shoulders shaking
    weep: {
      after: 'tea', from: () => base({ ...AT_TABLE }),
      run: async s => {
        s.set('tea', 0);
        const gurov = s.person('gurov'), anna = s.person('anna');
        gurov.reach({ l: GLASS });
        gurov.look('anna');
        anna.mood('sad');
        anna.do('weep_stand', { loop: true });
        await s.wait(10);
      },
    },
    // faces: the two at the window (he comes from the table if he sat there); she turns to him; the cut — the two in
    // profile, medium, the lamp on their faces; at the end back to the room (said ahead) for «Советоваться»
    cages: {
      after: ['shoulders', 'weep'], from: () => base({ ...CLOSE }),
      run: async s => {
        const gurov = s.person('gurov'), anna = s.person('anna');
        if (!s.state.gurov_on) { gurov.reach(null); gurov.do('stand'); }
        await upFromTable(s, gurov);
        anna.do('stand');
        anna.reach(null);
        await s.all(gurov.walk([GUROV_CLOSE]), anna.walk([ANNA_CLOSE]));
        const close = s.shot({ ...CAM.CAGES });
        gurov.turn(GUROV_CLOSE_TURN);
        gurov.look('anna');
        await anna.turn(ANNA_CLOSE_TURN);
        anna.look('gurov');
        s.tell('cages:turned');
        await s.until(() => close.ready);
        close.cut();
        anna.mood('sad');
        gurov.mood('thinking');
        const room = s.shot({ ...CAM.ROOM });
        await s.wait(9);
        await s.until(() => room.ready);
        room.cut();
        await s.wait(0.8);
      },
    },
    // the same — «Советоваться» plays over it (the window, the door, the glasses are offered; the camera stands)
    sovet: {
      after: 'cages', from: () => base({ ...CLOSE }),
      run: async s => { await s.wait(2); },
    },
    // the camera draws slowly back; the lamp; the two at the window as «Советоваться» left them (think); the watch
    // (wife_knows 0): he takes out his pocket watch, lifts it to the lamp's light and looks
    bazar_end: {
      after: 'sovet', from: () => {
        const l = looks(scene.get('think'));
        return base({ ...CLOSE, think: scene.get('think') || 'none', gurov_look: l.gurov, anna_look: l.anna });
      },
      run: async s => {
        s.move('camera_z', CAM.END.camera_z, { over: 12, ease: 'inOut' });
        await s.wait(5);
        if (!on('wife_knows')) {
          const gurov = s.person('gurov');
          gurov.with(['watch']);
          gurov.do('take_watch');
          await s.wait(1.4);
          gurov.look('gurov#watch');
          s.tell('bazar_end:watch');
          await s.wait(5.6);
        } else await s.wait(7);
      },
    },
  };
}

return {
  clamp01, WALL_D, HALF, CEIL, DOOR, WIN, MIRROR, doorFacing, TABLE, GLASS, CHAIR_SEAT, OUTSIDE, IN_DOOR, ANNA_WINDOW,
  GUROV_BEHIND, GUROV_MEET, ANNA_MEET, GUROV_CLOSE, ANNA_CLOSE, WAITER_SET, CAM, cam, LOOKS, looks, film,
};
