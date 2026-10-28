// Oreanda: what the paintings and the script share — the cliff in metres, the shots, the film in beats (FILM:
// modules/beats.js plays it).
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const SEAT_D = 3.6;       // the bench's seat: its middle, metres ahead of the start
const SEAT_E = 0.43;      // its height over the land
// where the cliff top ends: straight across before them, then a promontory runs out to the right (the church on it)
const edge = across => 8 + 14 * anim.span(across, 2.2, 7.5);
// the steamer from Feodosia: far out on the left before dawn, nearer under the coast as it grows light
const steamerAt = dawn => {
  const u = anim.ease.inOut(clamp01(dawn));
  return [anim.mix(-520, -250, u), anim.mix(1500, 650, u)];
};
const ANNA_SEAT = [-0.33, SEAT_D, SEAT_E], GUROV_SEAT = [0.34, SEAT_D, SEAT_E];
const ANNA_STAND = [-0.33, SEAT_D + 0.3], GUROV_STAND = [0.36, SEAT_D + 0.3];
const HAND_SPOT = [-0.04, SEAT_D - 0.06, SEAT_E + 0.03];   // her right hand lies on the seat between them
const SPITZ = [-1.3, SEAT_D + 0.35];                          // lying at her feet, to her left, clear of the bench
const WATCH_FROM = [5.6, 13.6];                               // out from behind the near cypress
const WATCH_STOP = [2.8, 9.0];                                // on the path by the cliff's edge, to Gurov's right
const WATCH_OFF = [[4.6, 11.8], [6.7, 14.9]];                // back behind the cypress

// ── the shots: place x, z (metres from the start), the eye's height, yaw, pitch ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  BENCH: cam(0, 0, 1.7),                 // behind the bench, a little above: their backs and the sea
  // from the side ahead of the bench, low, looking back at them (2.1–2.6 m): three-quarter faces, the dawn from the
  // east (ahead-left of them) on their faces; she turns her face to him — toward us; the dog at her feet in frame
  SIDE: cam(1.1, 5.7, 1.15, -150, -4),
};

function film(scene) {
  // where every beat may begin from: the two on the bench before dawn, the dog at her feet, nobody else
  const base = extra => {
    const [sa, sd] = steamerAt(extra.dawn ?? 0);
    return {
      ...CAM.BENCH, hour: 0.18, dawn: 0, mist: 1, lights: 3, cicada: 1, hand: 0,
      anna_a: ANNA_SEAT[0], anna_d: ANNA_SEAT[1], gurov_a: GUROV_SEAT[0], gurov_d: GUROV_SEAT[1],
      anna_here: true, anna_on: ANNA_SEAT, anna_do: 'seated', anna_turn: 0, anna_look: null, anna_reach: { r: HAND_SPOT }, anna_mood: null,
      gurov_here: true, gurov_on: GUROV_SEAT, gurov_do: 'seated', gurov_turn: 0, gurov_look: null, gurov_reach: null, gurov_mood: null,
      watchman_here: false, watchman_a: WATCH_FROM[0], watchman_d: WATCH_FROM[1], watchman_look: null, watchman_with: ['stick'],
      spitz_here: 1, spitz_a: SPITZ[0], spitz_d: SPITZ[1], spitz_e: 0, spitz_do: 'lie', spitz_view: 'side', spitz_look: null, leash: 'anna#hand_l',
      steamer_a: sa, steamer_d: sd,
      ...extra,
    };
  };
  return {
    // the hour before dawn, the two on the bench seen from behind, far out the steamer's lights
    bench: {
      from: () => base({}),
      run: async s => {
        await s.wait(2.5);
        s.tell('bench:sat');
        await s.wait(3);
        s.person('anna').look('steamer#lights');
        await s.wait(3.5);
        s.person('gurov').look([-120, 700, -2]);
        await s.wait(3);
      },
    },
    // the same: the game's “The sea” plays over it (it moves dawn, lights, cicada, hand)
    still: { after: 'bench', from: () => base({}), run: async s => { await s.wait(2); } },
    // light; the watchman with his stick comes along the path behind them, looks at them, goes — a far figure
    watchman: {
      after: 'still', from: () => base({ dawn: 0.85, lights: 0, cicada: 0 }),
      run: async s => {
        s.move('dawn', 1, { over: 6 });
        const w = s.person('watchman');
        s.set('watchman_a', WATCH_FROM[0]);
        s.set('watchman_d', WATCH_FROM[1]);
        w.with(['stick']);
        w.here(true);
        await w.walk([WATCH_STOP]);
        await w.turn(207);
        w.look('gurov');
        s.tell('watchman:looks');
        await s.wait(0.6);
        s.person('gurov').look('watchman');
        await s.wait(2.6);
        w.look(null);
        await w.walk(WATCH_OFF);
        w.here(false);
        s.person('gurov').look(null);
        s.tell('watchman:gone');
      },
    },
    // faces: the cut to the side, medium, against the light — the steamer below under the coast, its lights out; she
    // turns her face to him; they rise; the dog jumps up
    dew: {
      after: 'watchman', from: () => base({ ...CAM.SIDE, dawn: 1, lights: 0, cicada: 0 }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        const side = s.shot({ ...CAM.SIDE, lights: 0 });
        await s.until(() => side.ready);
        side.cut();
        await s.wait(0.8);
        anna.look('gurov');
        anna.mood('sad');
        await s.wait(2);
        gurov.look('anna');
        await s.wait(1.4);
        s.set('gurov_reach', null);
        s.set('anna_reach', null);
        s.set('spitz_do', 'stand');
        s.set('spitz_look', 'anna');
        s.set('anna_a', ANNA_STAND[0]); s.set('anna_d', ANNA_STAND[1]);
        s.set('gurov_a', GUROV_STAND[0]); s.set('gurov_d', GUROV_STAND[1]);
        anna.on(null);
        const up = anna.do('rise');
        await s.wait(0.4);
        gurov.on(null);
        await s.all(up, gurov.do('rise'));
        await s.wait(1);
      },
    },
    // the epilogue: the empty bench at dawn, the sea below, the mist going; the camera comes slowly closer
    bench_end: {
      from: () => base({ dawn: 1, lights: 0, cicada: 0, anna_here: false, gurov_here: false, spitz_here: 0 }),
      run: async s => {
        s.move('mist', 0.15, { over: 12 });
        await s.move('camera_z', 0.7, { over: 12, ease: 'inOut' });
      },
    },
  };
}

return {
  clamp01, SEAT_D, SEAT_E, edge, steamerAt, CAM, cam, film,
  ANNA_SEAT, GUROV_SEAT, ANNA_STAND, GUROV_STAND, HAND_SPOT, SPITZ, WATCH_FROM, WATCH_STOP, WATCH_OFF,
};
