// The station: what the paintings and the script share — the station in metres, the shots, the film in beats (FILM: modules/beats.js plays it).
// The platform runs across the frame (across −21…31, distance 0.6…7.6); beyond its edge the track lies 0.6 m lower;
// the train stands on it, its side at distance 7.95; behind it the steppe, the poles and the wires.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const TRAIN_D = 7.95;              // the carriages' sides: the train's anchor
const TRACK = -0.6;                // the track bed, under the platform's level
const CAR = 13.6;                  // a carriage's length, buffer to buffer
const FLOOR = 1.2;                 // a carriage's floor over the rail
const WIN = { y0: -3.05, y1: -2.05, w: 0.9 };      // its windows: top, bottom (over the rail, y down), width
const HER_WIN = 3.6;               // Anna's window: across in her carriage's frame
// the train's place: `train` 0 standing … 1 gone past the edge (300 m on); `far` carries it on over the horizon
const trainAt = (train, far) => 300 * clamp01(train) + 1700 * clamp01(far);

// one carriage's side, painted in its own metres (origin: the middle of its foot, at the rail): `lit` — only the
// window panes, as they glow from inside (another element, so they shine at dusk)
function carriage(g, { lit = false, hole = null, tail = false } = {}) {
  const L = CAR / 2 - 0.25;
  const xs = [];
  for (let i = 0; i < 8; i++) xs.push(-L + 1.05 + i * ((2 * L - 2.1) / 7));
  if (lit) {
    for (const x of xs) {
      if (hole !== null && Math.abs(x - hole) < 0.5) continue;
      const gr = g.createLinearGradient(0, WIN.y0, 0, WIN.y1);
      gr.addColorStop(0, '#ffe0aa'); gr.addColorStop(1, '#e8b06c');
      g.fillStyle = gr;
      g.fillRect(x - WIN.w / 2, WIN.y0, WIN.w, WIN.y1 - WIN.y0);
      g.fillStyle = '#f3b971';
      g.fillRect(x - WIN.w / 2, WIN.y0, WIN.w, 0.14);          // a blind half let down
    }
    return xs;
  }
  // the wheels, the frame under it, the steps at each end
  g.fillStyle = '#2b2a2c';
  for (const x of [-L + 1.4, -L + 2.9, L - 2.9, L - 1.4]) { g.beginPath(); g.arc(x, -0.48, 0.47, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#4a4646';
  for (const x of [-L + 1.4, -L + 2.9, L - 2.9, L - 1.4]) { g.beginPath(); g.arc(x, -0.48, 0.16, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#353335';
  g.fillRect(-L, -1.12, 2 * L, 0.32);
  g.fillRect(-L - 0.25, -1.0, 0.25, 0.14); g.fillRect(L, -1.0, 0.25, 0.14);   // the buffers
  g.fillStyle = '#3a3836';
  for (const x of [-L + 0.25, L - 0.65]) { g.fillRect(x, -1.0, 0.4, 0.06); g.fillRect(x, -0.62, 0.4, 0.06); }
  // the body: faded green-grey boards, a darker band under the windows; the hole of a window if asked
  g.fillStyle = '#6f7d72';
  g.beginPath();
  g.rect(-L, -3.95, 2 * L, 2.83);
  if (hole !== null) g.rect(hole + WIN.w / 2, WIN.y0, -WIN.w, WIN.y1 - WIN.y0);   // counter-clockwise: a hole
  g.fill('evenodd');
  g.fillStyle = '#5b675e';
  g.fillRect(-L, -1.6, 2 * L, 0.48);
  g.strokeStyle = 'rgba(40,48,42,0.35)'; g.lineWidth = 0.025;
  for (let x = -L + 0.2; x < L; x += 0.2) { g.beginPath(); g.moveTo(x, -1.6); g.lineTo(x, -1.12); g.stroke(); }
  // the doors at the ends, the windows' frames
  g.fillStyle = '#5f6c62';
  g.fillRect(-L + 0.1, -3.7, 0.7, 2.55); g.fillRect(L - 0.8, -3.7, 0.7, 2.55);
  g.strokeStyle = '#46504a'; g.lineWidth = 0.05;
  for (const x of xs) g.strokeRect(x - WIN.w / 2 - 0.04, WIN.y0 - 0.04, WIN.w + 0.08, WIN.y1 - WIN.y0 + 0.08);
  g.fillStyle = '#d8d2bf';                                   // the cream line along the top
  g.fillRect(-L, -3.62, 2 * L, 0.08);
  // the roof: a low curve, darker
  g.fillStyle = '#3f4440';
  g.beginPath(); g.moveTo(-L - 0.1, -3.92); g.quadraticCurveTo(0, -4.38, L + 0.1, -3.92); g.lineTo(L + 0.1, -3.85); g.lineTo(-L - 0.1, -3.85); g.closePath(); g.fill();
  g.fillStyle = '#353a37';
  for (const x of [-L + 2, -0.4, L - 2.6]) g.fillRect(x, -4.42, 0.5, 0.18);   // the vents
  // the windows' glass where they are not lit from inside (painted under the lit element)
  g.fillStyle = '#3c4048';
  for (const x of xs) if (hole === null || Math.abs(x - hole) > 0.5) g.fillRect(x - WIN.w / 2, WIN.y0, WIN.w, WIN.y1 - WIN.y0);
  return xs;
}

// where people stand (the platform's metres; Anna's in her carriage's frame where she is carried by it)
const ANNA_PLATFORM = [4.9, 6.6];               // at her carriage's steps, under the lamp at 6: facing him and the lamp
const GUROV_PLATFORM = [6.4, 6.4];              // facing her, his back half to the camera
const CONDUCTOR = [11.2, 7.05];
const GUROV_BELOW = [3.7, 5.3];                 // on the platform below her window, behind the window shot's camera
const ANNA_IN = [HER_WIN + 0.22, 0.45, FLOOR];  // in her carriage at the window (its frame: across, distance, elevation)
const GUROV_FAR_FROM = [16.8, 6.25];            // alone_far: he comes along the platform…
const GUROV_FAR_STOP = [27.35, 6.3];            // … to the last lamp
const GUROV_LAMP = [-5.6, 6.2];                 // alone_turn: under the lamp nearest the house
const HOUSE_DOOR = [-12.75, 4.75];              // before the station's door
const LAMPS = [-18, -6, 6, 18, 28];             // the platform's lamps, along its edge (distance 6.9)
const WINLAMP = HER_WIN + 0.35;                 // the compartment's wall lamp by her window (on her face), across in the train

// ── the shots: place x, z (metres from the start), the eye's height, yaw, pitch ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  PLATFORM: cam(-1, 2.5, 1.7, 40),       // along the platform at an angle: the train, the two at her carriage, the conductor far
  FACE: cam(7.5, 4.9, 1.55, -45),        // under the lamp, over his shoulder: her face to him, 3 m off, three-quarter, lit
  WINDOW: cam(3.7, 6.0, 1.5, 0, 13),     // below her window, looking up: her face behind the glass 2.4 m off, the curtain
  END: cam(23, 1.5, 1.7, 65),            // the platform's end, along the line: the train going away, the last lamp
  HOUSE: cam(-2, 1, 1.7, -55),           // toward the station house and its door
  LAMP: cam(-3.5, 4.95, 1.6, -59),       // his face under the lamp by the house, 2.4 m off, three-quarter
};
const placeTrain = v => {
  v.train_a = trainAt(v.train, v.far);
  v.tail_a = v.train_a - 6.95;
  v.tail_on = anim.span(v.train_a, 40, 120);
  v.winlamp_a = v.train_a + WINLAMP;
  return v;
};

function film(scene) {
  // Anna on the platform, in her carriage's frame (across along it, distance from its side, her floor over the rail)
  const ANNA_ON_PLATFORM = { anna_a: ANNA_PLATFORM[0], anna_d: ANNA_PLATFORM[1] - TRAIN_D, anna_e: -TRACK };
  const ANNA_AT_WINDOW = { anna_a: ANNA_IN[0], anna_d: ANNA_IN[1], anna_e: ANNA_IN[2] };
  // where every beat may begin from: the train standing, the two on the platform at her carriage, the conductor far
  const base = extra => placeTrain({
    hour: 0.8, train: 0, far: 0, curtain: 0, ...CAM.PLATFORM,
    spitz_here: 0,
    anna_here: true, ...ANNA_ON_PLATFORM, anna_turn: 100, anna_do: 'hold_dog', anna_with: ['spitz_held'], anna_look: 'gurov', anna_reach: null, anna_mood: 'sad',
    gurov_here: true, gurov_a: GUROV_PLATFORM[0], gurov_d: GUROV_PLATFORM[1], gurov_turn: 265, gurov_do: 'stand', gurov_look: 'anna', gurov_reach: null, gurov_mood: null,
    conductor_here: true, conductor_a: CONDUCTOR[0], conductor_d: CONDUCTOR[1], conductor_turn: 260, conductor_do: 'stand', conductor_with: ['lantern'], conductor_look: null,
    ...extra,
  });
  // she is in the carriage at her window, her hand on the frame, looking down at him (at us); he below, behind the camera
  const WINDOW = () => base({
    ...CAM.WINDOW,
    ...ANNA_AT_WINDOW, anna_turn: 180, anna_do: 'stand', anna_with: null, anna_look: 'gurov', anna_reach: { r: 'carriage#sill' },
    gurov_a: GUROV_BELOW[0], gurov_d: GUROV_BELOW[1], gurov_turn: 0, gurov_look: 'anna',
  });
  // the platform empty: the train gone
  const EMPTY = extra => base({ train: 1, anna_here: false, conductor_here: false, gurov_look: null, ...extra });

  // the train moves off; when her window has slid out of the near shot, the cut to the platform's end (said ahead):
  // her carriage passes and goes away down the line
  async function departs(s) {
    const end = s.shot({ ...CAM.END });
    const go = s.move('train', 1, { over: 14, ease: 'in' });
    await s.until(() => Number(s.state.train_a) > 3);
    await s.until(() => end.ready);
    end.cut();
    await go;
  }

  return {
    // evening; the train stands; the wide shot, then faces: the two at her steps under the lamp, over his shoulder —
    // she looks at him (L37), past him down the train (L36), at him again; the conductor far off; the bell at the end
    platform: {
      from: () => base({}),
      run: async s => {
        const anna = s.person('anna');
        const face = s.shot({ ...CAM.FACE });
        await s.wait(3);
        s.person('conductor').look('carriage');
        await s.until(() => face.ready);
        face.cut();
        await s.wait(3.5);
        anna.look([40, 8.5, 2]);
        await s.wait(3);
        anna.look('gurov');
        s.person('gurov').look('anna#head');
        await s.wait(2.5);
        s.tell('platform:bell');
        await s.wait(2);
      },
    },
    // faces: the cut — she is in the carriage at the window, her hand on the frame; below, from the platform, her face
    // behind the glass lit by the compartment's lamp, looking at us; the curtain in frame — the choice is offered here
    board: {
      after: 'platform', from: WINDOW,
      run: async s => {
        const w = s.shot(WINDOW());
        await s.until(() => w.ready);
        w.cut();
        await s.wait(6);
      },
    },
    // she looks while it can be seen: her hand on the glass; the train goes; her window gets small down the line
    look_back: {
      after: 'board', from: WINDOW,
      run: async s => {
        s.person('anna').reach({ r: 'carriage#glass' });
        await s.wait(1.4);
        await departs(s);
      },
    },
    // she draws the curtain; the train goes; a pale shut square goes away down the line
    curtain: {
      after: 'board', from: WINDOW,
      run: async s => {
        const anna = s.person('anna');
        anna.reach({ r: 'carriage#curtain' });
        await s.wait(0.6);
        await s.move('curtain', 1, { over: 1.6, ease: 'inOut' });
        anna.reach(null);
        anna.look(null);
        await s.wait(0.4);
        await departs(s);
      },
    },
    // the platform empty: he walks along it to the last lamp and stands; far down the line the red light melts away
    alone_far: {
      from: () => EMPTY({ ...CAM.END, gurov_a: GUROV_FAR_FROM[0], gurov_d: GUROV_FAR_FROM[1], gurov_turn: 90 }),
      run: async s => {
        const gurov = s.person('gurov');
        await gurov.walk([GUROV_FAR_STOP]);
        await gurov.turn(72);
        gurov.look('carriage_end#tail_r');
        s.tell('alone_far:stands');
        await s.move('far', 1, { over: 11, ease: 'in' });
        await s.wait(1);
      },
    },
    // he stands under the lamp by the house, looking after the train; a cut to his face under the lamp — tired, his
    // thought (alone_turn:door: he turns away from the line); back: he goes to the station's door
    alone_turn: {
      from: () => EMPTY({ far: 1, ...CAM.HOUSE, gurov_a: GUROV_LAMP[0], gurov_d: GUROV_LAMP[1], gurov_turn: 80 }),
      run: async s => {
        const gurov = s.person('gurov');
        const face = s.shot({ ...CAM.LAMP });
        await s.wait(2.5);
        await s.until(() => face.ready);
        face.cut();
        gurov.mood('tired');
        await s.wait(1);
        gurov.look([-3, 4.6, 1.5]);
        s.tell('alone_turn:door');
        // (his thought comes after the narrator's line: the face holds through it)
        await s.wait(7);
        const house = s.shot({ ...CAM.HOUSE });
        await s.until(() => house.ready);
        house.cut();
        await gurov.walk([HOUSE_DOOR]);
        await gurov.turn(320);
        await s.wait(1);
      },
    },
  };
}

return {
  clamp01, TRAIN_D, TRACK, CAR, FLOOR, WIN, HER_WIN, WINLAMP, trainAt, carriage, placeTrain, CAM, cam, film,
  ANNA_PLATFORM, GUROV_PLATFORM, CONDUCTOR, GUROV_BELOW, ANNA_IN, GUROV_FAR_FROM, GUROV_FAR_STOP, GUROV_LAMP, HOUSE_DOOR, LAMPS,
};
