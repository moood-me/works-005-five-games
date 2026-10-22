// “The Sarafanovs' Home”: the kitchen and the room beyond its doorway — the plan (scenes.md “The Sarafanovs' Home”, metres: x
// to the right, z in from the kitchen's near wall; the scene's across = x − 2, distance = z), the seats, the shots,
// the film (film(scene): the beats module's table). Shared by the paintings, the script, the showcase; the generator
// (tools/home/gen.mjs) writes scene.json from it.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const A = x => x - 2;                         // plan x → across
const W = (x, z) => [x - 2, z];               // a plan point → [across, distance]
const P3 = (x, z, h) => [x - 2, z, h];        // … with its height

const H = 2.6;                                // the rooms' height
// the kitchen (x 0…4, z 0…4) and the room (x 4…8)
const WINDOW = { x: 1.8, w: 1.2, h: 1.0, sill: 1.0 };          // in the kitchen's back wall (z 4)
const TRANSOM = 0.22;                                          // the upper lights' height under the window's top
const PANE = [0.3, -0.48];                                     // the hole's middle in the lower right pane (from the sill's middle; window.wgsl)
const DOOR = { x: 3.2, w: 0.9, h: 2.0 };                       // the front door, in the near wall (on its spring)
const DOORWAY = { z0: 2.5, z1: 3.5, h: 2.05 };                 // in the kitchen's right wall (x 4), into the room
const STOVE = { front: 0.75, z0: 1.0, z1: 2.2, h: 2.0 };       // against the left wall; its fire door at z 1.6
const TABLE = { x0: 1.4, x1: 2.2, z0: 1.8, z1: 3.6, h: 0.76 }; // its end to the window
const LAMP = [1.8, 2.45, 2.04];                                 // the bulb, just under the orange shade
const SHADE = 2.1;                                             // the shade's rim (it rises 0.32 over it)
const CLOCK = { z: 0.6, face: 1.8 };                           // the wall clock on the left wall near the corner
const HOOK = [3.8, 0.03];                                      // the hooks by the door
const STOOL = [1.65, 0.32];                                    // the stool left of the door (the old man's hat)
const CUPBOARD = { x: 5.2, z: 0.25, w: 1.1, h: 1.95, shelf: 1.32 }; // in the room, against its near wall, glass above
const COT = { x: 4.45, z0: 0.7, z1: 2.4, w: 0.7, top: 0.42 };  // the folding bed along the kitchen wall, its head by the doorway
const COT_CHAIR = [4.32, 0.42];                                // the chair at the cot's foot, by the wall (his coat at night)
const SOFA = { x0: 5.6, x1: 7.6, z: 3.62, top: 0.45, front: 3.3, back: 3.92 }; // against the room's back wall: the seat z 3.3…3.92
// lying: on the back (`lie`) the turn is where the feet point; `lie_side` turns from the back onto the side, ending
// with the head at the turn − 22°, the face to the turn + 68° (seen on the sheets). On the cot the head by the doorway
// (+z), on the side facing the room; on the sofa the head at its right end (+x), in the light from his door
const LIE_AT = { cot: { at: [4.45, 1.55], bed: 'cot_top#bed', back: 180, side: 22 }, sofa: { at: [6.75, 3.62], bed: 'sofa_top#bed', back: 270, side: 112 } };
const SAR_DOOR = { z0: 3.1, z1: 3.9 };                         // in the room's right wall (x 8): Sarafanov's room
// his lamp's light, come through the gap of his door: a light standing in the room before the gap (the gap of a door
// ajar is too narrow for the lamp's shadow to cut a wedge) — it falls on the sofa's right end and through the doorway
// onto the kitchen's floor (the kitchen's right wall casts its shadow)
const SAR_LAMP = [7.7, 3.8, 1.45];
const CASE_CHAIR = [7.35, 1.0];                                // the chair with the clarinet case
const TOP = TABLE.h + 0.02;
const CHAIR_BACK = 0.21;                                       // a chair's back behind its seat
const RUCKSACK = { chair: [0.7, 2.5], door: [2.5, 0.3] };    // Vasenka's rucksack: by his chair · packed by the door
// on the oilcloth (plan x, z)
const ON = {
  box: [1.8, 2.15], glass_b: [2.12, 2.12], glass_s: [1.5, 2.12], bread: [1.95, 2.95], kettle: [1.62, 2.42],
  kettle_pushed: [1.92, 2.3], sheet: [1.52, 2.32], puddle: [2.0, 2.1], near: [2.02, 2.15], bottle: [1.8, 3.0],
};
// the table laid (IV): a glass at each place
const SET_GLASS = [[1.56, 2.3], [1.56, 2.9], [1.56, 3.42], [2.04, 1.95], [2.04, 2.52], [2.04, 3.1]];

// the six places: three a side; the left ones face +x (turn 90), the right ones −x (270) — the chairs drawn up, a
// quarter of a metre from the table's edges: the hands of one seated lie on it with the elbows bent
const SEATS = {
  L1: [1.15, 2.1, 90], L2: [1.15, 2.7, 90], L3: [1.15, 3.3, 90],
  R1: [2.45, 2.1, 270], R2: [2.45, 2.7, 270], R3: [2.45, 3.3, 270],
};
const RISEN = 0.24;   // where `rise_back` leaves one who got up: that far behind the seat
const SEAT_H = 0.46;
// the marks (plan)
const SPOT = {
  hall: [3.2, -1.1],           // beyond the front door, out of sight
  inDoor: [3.15, 0.75],        // a step in from the door
  stove: [1.2, 1.6],           // before the stove, its fire door at his left
  near: [1.85, 1.5],           // a step from him there
  close: [1.62, 1.56],         // in the old man's arms
  window: [1.0, 3.72],         // at the window, left of the table's end
  doorway: [3.85, 3.0],        // in the doorway between kitchen and room
  roomIn: [4.5, 3.0],
  cupboard: [5.2, 0.9],        // before the cupboard
  sarDoor: [7.6, 3.55],        // inside the room before Sarafanov's door
  sarIn: [8.5, 3.6],           // beyond it (out of sight)
  byCot: [4.95, 2.45],         // at the cot's head, the room's side
  silvaBack: [4.9, 2.6],       // a step off it toward the doorway
  hook: [3.62, 0.5],           // before the hooks
  stool: [1.75, 0.78],         // before the stool, facing it
};
// the old man's way from his place at the table (L1) to the doorway, round behind the table past the window — not
// across the near end, before the lens of the shots along the table
const ROUND = [[0.6, 2.45], [0.65, 3.7], [2.6, 3.85], [3.4, 3.2]];
// the way “On Tiptoe” creeps: from the stove past the wall clock along the near wall to the front door (≈ 3.7 m)
const SNEAK = [[1.2, 1.55], [0.55, 0.85], [1.1, 0.5], [2.4, 0.5], [2.9, 0.55]];
const SNEAK_LEN = SNEAK.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - SNEAK[i][0], p[1] - SNEAK[i][1]), 0);
const SNEAK_BEHIND = 0.7;      // Silva a step behind
// a point of the way at metres m along it, and how far along it a point lies
function sneakAt(m) {
  let left = clamp(m, 0, SNEAK_LEN);
  for (let i = 1; i < SNEAK.length; i++) {
    const [x0, z0] = SNEAK[i - 1], [x1, z1] = SNEAK[i], l = Math.hypot(x1 - x0, z1 - z0);
    if (left <= l) return [x0 + (x1 - x0) * left / l, z0 + (z1 - z0) * left / l];
    left -= l;
  }
  return SNEAK[SNEAK.length - 1];
}
function sneakOf(x, z) {
  let best = Infinity, at = 0, run = 0;
  for (let i = 1; i < SNEAK.length; i++) {
    const [x0, z0] = SNEAK[i - 1], [x1, z1] = SNEAK[i], dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz);
    const u = clamp(((x - x0) * dx + (z - z0) * dz) / (l * l), 0, 1), d = Math.hypot(x0 + dx * u - x, z0 + dz * u - z);
    if (d < best) { best = d; at = run + u * l; }
    run += l;
  }
  return at;
}
// the way from a point of the sneak to another (the corners between)
function sneakWay(m0, m1) {
  const pts = [], run = [0];
  for (let i = 1; i < SNEAK.length; i++) run.push(run[i - 1] + Math.hypot(SNEAK[i][0] - SNEAK[i - 1][0], SNEAK[i][1] - SNEAK[i - 1][1]));
  const lo = Math.min(m0, m1), hi = Math.max(m0, m1);
  const mid = run.map((r, i) => [r, SNEAK[i]]).filter(([r]) => r > lo && r < hi).map(([, p]) => p);
  if (m1 < m0) mid.reverse();
  pts.push(...mid, sneakAt(m1));
  return pts.map(([x, z]) => W(x, z));
}

// the far things through the window: the far train's lights (its place along the gardens), the old man going off
const FAR_TRAIN = { z: 29.5, from: -6, to: 52 };   // across: far_train 0 … 1 (seen through the window from the left)
const FATHER_FAR = { z: 12, from: 5.5, to: 9.5 };   // across: the figure with the case, across the gardens (through the hole)

// the people: their height (metres), the head of one seated
const HEIGHT = { busygin: 1.83, sarafanov: 1.62, nina: 1.66, silva: 1.76, vasenka: 1.8, kudimov: 1.8 };
const PEOPLE = ['busygin', 'silva', 'vasenka', 'sarafanov', 'nina', 'kudimov'];
const NAMES = { busygin: 'Busygin', silva: 'Silva', vasenka: 'Vasenka', sarafanov: 'Sarafanov', nina: 'Nina', kudimov: 'Kudimov' };

// the shots: where the camera stands (plan x, z, the eye's height), which way it looks (degrees to the right of +z),
// how far down (screen heights) — numbers, worked out by h/d (tools/home/run.mjs prints each beat's frame)
const cam = (x, z, h, yaw, look = 0) => ({ camera_target: null, camera_x: A(x), camera_z: z, camera_h: h - 1.7, camera_yaw: yaw, camera_look: look, camera_pitch: 0 });
const CAM = {
  win: cam(1.2, 3.8, 1.65, 155),             // from the corner by the window down the kitchen: the door, the stove right, the table
  stove: cam(0.9, 0.05, 1.55, 11),             // from the near wall by the stove's front: he at the open stove in profile, its fire left of him
  warm: cam(2.5, 0.85, 1.45, -55),             // the stove and Vasenka at the table, from the near right
  near: cam(1.15, 0.35, 1.45, 15),            // the two at the stove: Busygin in profile, the old man in three quarters
  embrace: cam(2.3, 1.0, 1.75, -62),          // over the old man's shoulder: Busygin's face in three quarters
  nina: cam(2.2, 1.55, 1.5, 132),             // Nina in the door, three quarters, in the lamp's light
  supper: cam(2.3, 0.45, 1.3, -15, 0.1),      // from the near side: the old man standing with his glass, three quarters; Busygin right
  tb: cam(1.8, 0.4, 1.2, 0, 0.06),            // talk_back, box_out: along the table, the two face to face in profile
  talk: cam(2.05, 1.25, 1.25, -48),           // the old man nearer, three quarters
  cupboard: cam(6.7, 1.9, 1.55, -125),        // in the room: the sideboard from the side, the cot beyond
  sofa: cam(7.3, 2.6, 0.8, 8, 0.12),          // Silva on the sofa close, in the light from his door
  cot: cam(7.0, 3.5, 1.15, -122),             // wake: from the room's far wall onto the cot and the chair by it
  wake: cam(5.9, 0.7, 1.05, -45, 0.05),       // close on the cot's head from its foot: Silva's hand on his shoulder, both faces
  sneak: cam(3.8, 3.3, 1.6, -143),            // from the doorway onto the near left corner: stove, the way, the wall clock
  caught: cam(3.0, 1.75, 1.6, 40),            // from where the two stand by the door: the old man in the doorway, facing us
  door: cam(3.2, 2.9, 1.55, 185),             // from by the doorway onto the front door and the hooks
  ww: cam(0.6, 2.75, 1.65, 44),               // the window: his shoulder left, the frosted glass in the middle
  morning: cam(1.75, 1.6, 1.5, 0),            // over the table: the old man at its far corner, Busygin at the window
  hole: cam(1.6, 3.45, 1.55, 42),             // at his shoulder, the rubbed hole close: the gardens through it
  toast: cam(1.8, 0.4, 1.9, 0, 0.25),         // high along the table: all six in profile
  askNina: cam(3.75, 2.6, 1.55, -120),       // past Kudimov's right shoulder: Nina facing him, her father beyond
  ask: cam(2.55, 0.4, 1.55, -21),             // Nina standing between her father and him
  for_me: cam(1.85, 3.0, 1.35, -118),         // close on Nina from over the table's far end, the old man beyond her
  pack: cam(0.4, 3.8, 1.5, 122),              // from the far left corner: the old man in the doorway, Silva at the door
  packSar: cam(2.6, 3.4, 1.55, 108),          // the old man in the doorway, close, in the lamp's light
  confess: cam(3.1, 3.75, 1.55, 150),         // from the back wall: the two by the doorway in profile, Busygin nearer
  back: cam(2.15, 0.9, 1.6, 5),               // the old man at the window, his back; the table; Busygin right
  window: cam(3.0, 1.4, 1.6, -41),            // the old man at the window, his back to us
  pair: cam(0.7, 1.4, 1.35, 62),              // from the stove's corner: the two side by side at the table's right
};

const film = scene => {
  const kit = scene.kit, get = k => scene.get(k);
  const LOOK = name => {
    const l = kit.cast && kit.cast.characters && kit.cast.characters[name];
    if (!l) scene.warn(`cast: no look "${name}"`);
    return l || null;
  };
  const ownOf = look => (kit.cast && kit.cast.shapes && kit.cast.shapes.characters[look] && kit.cast.shapes.characters[look].parts) || [];
  // what is in their hands, with their look's own parts (a scarf, a collar): a look's parts are replaced by the list
  const WITH = (look, ...parts) => (parts.length ? [...ownOf(look), ...parts] : null);
  const hold = (s, id, ...parts) => { const w = s.get(`${id}_wear`); s.person(id).with(WITH((w && w.who) || id, ...parts)); };
  const loop = motion => ({ motion, loop: true });
  const held = motion => ({ motion, loop: false, from: 99 });
  const lampOn = () => 0.6 + 0.4 * (Number(get('warm')) || 0);
  const boxAt = () => (get('box_where') === 'busygin' ? 'none' : 'shelf');

  // ── the values of a shot ──
  const OUT = id => ({ [`${id}_here`]: false, [`${id}_a`]: A(SPOT.hall[0]), [`${id}_d`]: SPOT.hall[1], [`${id}_turn`]: 0,
    [`${id}_do`]: 'stand', [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_on`]: null,
    [`${id}_mood`]: 'neutral', [`${id}_gait`]: null });
  const STAND = (id, [x, z], turn, more = {}) => ({ ...OUT(id), [`${id}_here`]: true, [`${id}_a`]: A(x), [`${id}_d`]: z,
    [`${id}_turn`]: turn, ...more });
  const SIT = (id, seat, more = {}) => {
    const [x, z, turn] = SEATS[seat];
    return STAND(id, [x, z], turn, { [`${id}_do`]: loop('seated'), [`${id}_on`]: P3(x, z, SEAT_H), ...more });
  };
  // lying on the cot (head by the doorway) or on the sofa (head at its right end, in the wedge from his door): on the
  // back, or on the side to the wall (`side`)
  const LIE = (id, where, more = {}, side = false) => {
    const b = LIE_AT[where];
    return STAND(id, b.at, side ? b.side : b.back, { [`${id}_do`]: side ? held('lie_side') : loop('lie'), [`${id}_on`]: b.bed, ...more });
  };
  const wear = (id, name) => ({ [`${id}_wear`]: name ? LOOK(name) : null });
  const OUTS = () => Object.assign({}, ...PEOPLE.map(OUT));
  // the room at night (or at dawn): every key a shot sets that the beats move
  const ROOM = (more = {}) => ({
    hour: 0.9, lamp: lampOn(), stove_door: 0, door: 0, door_f: 0, sar_door: 0.08, sar_door_f: 270 - 90 * 0.08,
    sar_light: 0, stir: 0, hands: 0, tea: 0, box: 0, table_set: 0, puddle: 0, sheet_on: 0, kettle_at: 'stove', glass_b: 'none',
    glass_s: 'none', hat_on_stool: 0, case_on: 1, nina_coat: 0, father_x: FATHER_FAR.from, father_on: 0, sneak: 0, sneak_at: 0,
    box_at: 'shelf', coat_b: 'hook', rucksack: 'none',
    ...OUTS(), ...wear('busygin', null), ...wear('silva', null), ...wear('vasenka', null), ...wear('sarafanov', null),
    ...wear('nina', null), ...wear('kudimov', null), ...more,
  });
  // (six in the morning in winter is dark yet: the kitchen lamp burns low — the people readable by it, the grey at the window)
  const DAWN = { hour: 0.25, lamp: 0.5 };
  const cut = (s, v) => s.cut({ ...v });
  const shot = (s, v) => s.shot({ ...v });
  const W2 = p => W(p[0], p[1]);
  const walk = (p, pts, o) => p.walk(pts.map(W2), o);
  // sit down on a place, up from it
  async function sit(p, seat) {
    const [x, z, turn] = SEATS[seat];
    await p.go('sit_down', { to: W(x, z), turn });
    p.on(P3(x, z, SEAT_H));
    p.do('seated', { loop: true });
  }
  // up from a place at the table: pushing the chair back (`rise_back` ends 0.24 m behind the seat)
  async function rise(p, seat) {
    const [x, z] = SEATS[seat];
    p.on(null);
    await p.go('rise_back', { from: W(x, z) });
  }
  // down onto a bed (on the back): the hips onto its point, the place kept at it
  function lieDown(s, id, where) {
    const b = LIE_AT[where], p = s.person(id);
    p.on(b.bed);
    s.set(`${id}_a`, A(b.at[0]));
    s.set(`${id}_d`, b.at[1]);
    p.do('lie', { loop: true });
  }
  // up off the cot: from its edge (where `wake` leaves him sitting), facing the room
  async function upFromCot(s) {
    const bus = s.person('busygin');
    bus.on(null);
    await bus.do('rise');
  }
  const turnTo = (from, to) => ((Math.atan2(to[0] - from[0], to[1] - from[1]) * 180 / Math.PI) + 360) % 360;

  // ── the beats' starts that follow others (also what a cut to them sets) ──
  const I_HOME = () => ROOM({ ...wear('sarafanov', 'sarafanov_hat'), stove_door: 1, rucksack: 'chair', coat_b: 'none',
    ...STAND('busygin', SPOT.stove, 65), ...SIT('silva', 'R1'), ...SIT('vasenka', 'L1') });
  const II_TABLE = (more = {}) => ROOM({ ...wear('sarafanov', 'sarafanov_home'), ...wear('busygin', 'busygin_shirt'), ...wear('silva', 'silva_shirt'),
    ...SIT('sarafanov', 'L1'), ...SIT('busygin', 'R1'), ...more });
  const NIGHT_TALK = (more = {}) => II_TABLE({ hour: 0.95, puddle: 1, sheet_on: 1, glass_b: 'table', glass_s: 'table', kettle_at: 'table',
    ...LIE('silva', 'sofa'), ...more });
  const IV_TABLE = (more = {}) => ROOM({ hour: 0.88, table_set: 1, box_at: boxAt(), ...wear('sarafanov', 'sarafanov_best'), ...wear('nina', 'nina_home'),
    ...wear('busygin', 'busygin_shirt'), ...wear('silva', 'silva_shirt'), ...wear('vasenka', 'vasenka_home'), ...wear('kudimov', 'kudimov_in'),
    ...SIT('sarafanov', 'L1'), ...SIT('nina', 'L2'), ...SIT('busygin', 'R1'), ...SIT('kudimov', 'R2'), ...SIT('silva', 'L3'), ...SIT('vasenka', 'R3'),
    ...more });
  const PACK = (more = {}) => ROOM({ box_at: boxAt(), ...wear('silva', 'silva_burnt'), ...wear('busygin', 'busygin_shirt'), ...wear('nina', 'nina_home'),
    ...wear('vasenka', 'vasenka_home'),
    ...STAND('silva', [3.1, 0.62], 315), ...STAND('busygin', [2.9, 2.3], 300),
    ...STAND('sarafanov', SPOT.doorway, 283, { sarafanov_with: WITH('sarafanov', 'case', 'suitcase') }),
    ...STAND('nina', [4.75, 3.25], 270), ...STAND('vasenka', [4.95, 2.75], 280), ...more });
  // dawn, the end of `wake`: he sits on the cot's edge facing the room, Silva (in his coat) a step off toward the doorway
  const EDGE = [COT.x + 0.27, 1.55];
  const WAKE = () => ROOM({ ...DAWN, box_at: boxAt(), coat_b: 'cot', ...wear('busygin', 'busygin_shirt'),
    ...STAND('busygin', EDGE, 90, { busygin_do: loop('seated'), busygin_on: P3(EDGE[0], EDGE[1], COT.top), busygin_look: 'silva', busygin_mood: 'tired' }),
    ...STAND('silva', SPOT.silvaBack, 240, { silva_look: 'busygin' }) });

  // ── the film, in the order the game mostly plays it ──
  const F = {
    // I. Night: the door, the three come in from the cold (the kitchen wide); a cut to the stove: Vasenka and Silva sat
    // at the table, his rucksack by his chair; Busygin at the stove in profile opens its door, holds his hands to the
    // fire — the insert `hands` opens
    kitchen: {
      from: () => ROOM({ ...CAM.win, coat_b: 'none', thaw: 0, rub: 0, ...wear('sarafanov', 'sarafanov_hat') }),
      run: async s => {
        const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
        const stove = shot(s, { ...CAM.stove, door: 0, door_f: 0, rucksack: 'chair',
          ...SIT('vasenka', 'L1', { vasenka_mood: 'tired', vasenka_look: P3(1.45, 2.75, TOP) }), ...SIT('silva', 'R1', { silva_reach: { r: 'table#bread' } }),
          ...STAND('busygin', SPOT.stove, 270, { busygin_look: 'stove#door', busygin_reach: { l: 'stove#door' } }) });
        await s.move('door', 1, { over: 0.8, ease: 'out' });
        vas.here(true);
        const vw = walk(vas, [SPOT.inDoor, [1.75, 1.35]]);
        await s.wait(0.6);
        sil.here(true);
        const sw = walk(sil, [SPOT.inDoor, [3.0, 1.9]]);
        await s.wait(0.6);
        bus.here(true);
        const bw = walk(bus, [SPOT.inDoor, [2.2, 1.35]]);
        await s.wait(1.2);
        await s.until(() => stove.ready);
        for (const w of [vw, sw, bw]) w.cancel();
        stove.cut();
        await s.wait(0.4);
        await s.move('stove_door', 1, { over: 0.8, ease: 'out' });
        bus.reach({ r: 'stove#fire', l: 'stove#fire' });
        bus.look('stove#fire');
        sil.reach(null);
        await s.wait(0.8);
        s.set('hands', 1);
        s.tell('kitchen:stove');
        await s.wait(1.0);
      },
    },
    // the insert closes: he turns from the stove to the table; Vasenka, not looking up (L20, L21)
    warm_up: {
      from: () => ({ ...I_HOME(), ...STAND('busygin', SPOT.stove, 270, { busygin_look: 'stove#fire' }), ...CAM.warm, sarafanov_here: false,
        hands: 0, thaw: 1, rub: 0 }),
      run: async s => {
        const bus = s.person('busygin'), vas = s.person('vasenka');
        bus.look('vasenka');
        await bus.turn(65);
        vas.look(P3(1.45, 2.75, TOP));
        vas.mood('tired');
        bus.mood('thinking');
        s.tell('warm_up:turn');
        await s.wait(6);
      },
    },
    // the door: Sarafanov in his coat, his hat in his hand — L22 as Silva gets up; the hat put down on the stool;
    // L23; the clock; L24; slowly to Busygin at the stove, a step from him — L25. Side by side in profile at the end
    enter: {
      from: () => ({ ...I_HOME(), ...CAM.win }),
      run: async s => {
        const sar = s.person('sarafanov'), sil = s.person('silva'), bus = s.person('busygin');
        await s.wait(1.0);
        await s.move('door', 1, { over: 1.0, ease: 'out' });
        sar.here(true);
        sar.mood('surprised');
        await walk(sar, [SPOT.inDoor]);
        s.tell('enter:in');
        bus.look('sarafanov');
        bus.mood('afraid');
        sar.look('busygin');
        await rise(sil, 'R1');
        sil.look('sarafanov');
        await sil.turn(200);
        await walk(sar, [SPOT.stool]);
        await sar.turn(180);
        sar.look(P3(STOOL[0], STOOL[1], 0.5));
        sar.reach({ r: P3(STOOL[0], STOOL[1], 0.55) });
        await sar.do('reach_put');
        s.set('hat_on_stool', 1);
        sar.with(['long_scarf']);
        sar.reach(null);
        sar.do('stand');
        s.move('door', 0, { over: 0.5, ease: 'in' });
        sar.look('busygin');
        await s.wait(4.5);
        // close: the two side by side in profile, the lamp between them — made ready while he comes
        const two = shot(s, { ...CAM.near });
        await walk(sar, [[2.2, 1.2], SPOT.near]);
        two.cut();
        await s.all(sar.turn(270), bus.turn(90));
        s.tell('enter:near');
        await s.wait(1.5);
        sar.mood('smile');
        await s.wait(2.5);
      },
    },
    // he takes him in his arms; Busygin's hands come to his back; Silva sits down again behind them
    embrace: {
      after: 'enter',
      from: () => ({ ...I_HOME(), ...CAM.near, hat_on_stool: 1, ...STAND('busygin', SPOT.stove, 90, { busygin_look: 'sarafanov', busygin_mood: 'afraid' }),
        ...STAND('sarafanov', SPOT.near, 270, { sarafanov_look: 'busygin', sarafanov_mood: 'smile', sarafanov_with: ['long_scarf'] }),
        ...STAND('silva', [2.65, 2.3], 200, { silva_look: 'sarafanov' }) }),
      run: async s => {
        const sar = s.person('sarafanov'), sil = s.person('silva'), bus = s.person('busygin');
        const close = shot(s, { ...CAM.embrace });
        await walk(sar, [SPOT.close]);
        await s.until(() => close.ready);
        close.cut();
        sar.turn(270);
        sar.do('hug');
        sar.reach({ r: 'busygin#back', l: 'busygin#back' });
        sar.look(null);
        await s.wait(1.0);
        bus.reach({ r: 'sarafanov#back', l: 'sarafanov#back' });
        bus.mood('sad');
        bus.look(P3(2.6, 1.0, 1.7));
        s.tell('embrace:held');
        await sit(sil, 'R1');
        await s.wait(3);
      },
    },

    // II. Night: the door, Nina in her coat; the old man gets up from the table — L28; she stands in the door, not
    // taking it off — L29 (close: three quarters in the lamp's light); goes through the kitchen into the room
    nina_in: {
      from: () => II_TABLE({ ...CAM.win, ...wear('nina', 'nina'), ...SIT('silva', 'R3'), ...LIE('vasenka', 'sofa', {}, true), ...wear('vasenka', 'vasenka_home') }),
      run: async s => {
        const nina = s.person('nina'), sar = s.person('sarafanov'), bus = s.person('busygin');
        await s.wait(0.8);
        await s.move('door', 1, { over: 1.0, ease: 'out' });
        nina.here(true);
        await walk(nina, [SPOT.inDoor]);
        nina.turn(turnTo(SPOT.inDoor, SEATS.L1));
        nina.look('sarafanov');
        s.move('door', 0, { over: 0.6, ease: 'in' });
        bus.look('nina');
        await rise(sar, 'L1');
        sar.look('nina');
        sar.mood('smile');
        await sar.turn(turnTo(SEATS.L1, SPOT.inDoor));
        s.tell('nina_in:door');
        const close = shot(s, { ...CAM.nina });
        await s.wait(3.0);
        close.cut();
        nina.mood('thinking');
        await s.wait(3.5);
        nina.mood('smile');
        const wide = shot(s, { ...CAM.win });
        await s.wait(2.0);
        wide.cut();
        nina.look(null);
        await walk(nina, [[3.4, 1.7], [3.55, 2.9], SPOT.doorway, SPOT.roomIn]);
        s.tell('nina_in:gone');
        await walk(nina, [[5.4, 2.7]]);
        nina.here(false);
        sar.look(SPOT.doorway.concat(1.5).map((v, i) => (i === 0 ? A(v) : v)));
        sar.mood('thinking');
        await s.wait(1.0);
      },
    },
    // the table under the lamp; the old man stands with his glass — L30 — and holds it up, waiting; Busygin's glass
    // on the oilcloth (a touch)
    supper: {
      from: () => II_TABLE({ ...CAM.supper, ...SIT('silva', 'R3'), glass_b: 'table', ...LIE('vasenka', 'sofa', {}, true), ...wear('vasenka', 'vasenka_home') }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin'), sil = s.person('silva');
        await s.wait(1.0);
        hold(s, 'sarafanov', 'glass_held');
        await rise(sar, 'L1');
        sar.mood('smile');
        sar.look('busygin');
        bus.look('sarafanov');
        sil.look('sarafanov');
        await sar.do('toast');
        sar.reach({ r: P3(1.3, 2.1, 1.45) });
        s.tell('supper:toast');
        await s.wait(4.0);
      },
    },
    // he raises his glass, the glasses meet; the old man sits and lays a page of music on the oilcloth — L31
    supper_after: {
      after: 'supper',
      from: () => ({ ...F.supper.from(), ...STAND('sarafanov', [SEATS.L1[0] - RISEN, SEATS.L1[1]], 90, { sarafanov_with: WITH('sarafanov_home', 'glass_held'), sarafanov_reach: { r: P3(1.3, 2.1, 1.45) },
        sarafanov_look: 'busygin', sarafanov_mood: 'smile' }), ...wear('sarafanov', 'sarafanov_home') }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin');
        bus.reach({ r: 'table#glass' });
        await s.wait(0.8);
        s.set('glass_b', 'hand');
        hold(s, 'busygin', 'glass_held');
        bus.reach({ r: P3(1.82, 2.1, 1.32) });
        sar.reach({ r: P3(1.7, 2.1, 1.36) });
        await s.wait(1.4);
        bus.reach({ r: 'table#glass' });
        sar.reach(null);
        await s.wait(0.7);
        s.set('glass_b', 'table');
        bus.with(null);
        bus.reach(null);
        await sit(sar, 'L1');
        hold(s, 'sarafanov', 'sheet');
        sar.reach({ r: P3(ON.sheet[0], ON.sheet[1], TOP + 0.05) });
        await s.wait(1.0);
        s.set('sheet_on', 1);
        sar.with(null);
        sar.reach(null);
        sar.look('table#sheet');
        s.tell('supper_after:sheet');
        await s.wait(4.0);
      },
    },
    // late night: Silva goes to lie down; the two face to face; the old man pushes the kettle to
    // him — L32 (closer: in profile); Busygin takes it — the insert `tea` opens
    talk: {
      from: () => NIGHT_TALK({ ...CAM.tb, ...SIT('silva', 'R3'), tea: 0, which: 0, pour: 0, glass1: 0, glass2: 0, spill: 0, shake: 0, puddle: 0 }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin');
        await s.wait(1.0);
        const lies = s.sequence(async c => {
          const p = c.person('silva');
          await rise(p, 'R3');
          await walk(p, [[3.2, 3.0], SPOT.doorway, SPOT.roomIn, [6.75, 3.05]]);
          await p.turn(LIE_AT.sofa.back);
          lieDown(c, 'silva', 'sofa');
        });
        sar.look('table#kettle');
        sar.reach({ r: 'table#kettle' });
        await s.wait(1.2);
        s.set('kettle_at', 'pushed');
        sar.reach(null);
        sar.look('busygin');
        const close = shot(s, { ...CAM.talk });
        await s.wait(1.0);
        close.cut();
        sar.mood('sad');
        await s.wait(5.0);
        bus.look('table#kettle');
        bus.reach({ r: 'table#kettle' });
        await s.wait(0.9);
        s.set('kettle_at', 'none');
        hold(s, 'busygin', 'kettle');
        bus.reach(null);
        await s.wait(0.6);
        s.set('tea', 1);
        s.tell('talk:kettle');
        await s.all(lies, s.wait(1.5));
      },
    },
    // the insert closes: the two at the table, the old man's glass in both hands, a puddle on the oilcloth; he waits
    // for the answer (a choice on him)
    talk_back: {
      from: () => NIGHT_TALK({ ...CAM.tb, tea: 0, which: 1, pour: 0, glass1: 1, glass2: 1, spill: 1, shake: 0, puddle: 1, kettle_at: 'table', glass_s: 'hand',
        sarafanov_with: WITH('sarafanov_home', 'glass_held'), sarafanov_reach: { r: P3(1.42, 2.1, 0.98), l: P3(1.42, 2.17, 0.96) },
        sarafanov_look: 'busygin', sarafanov_mood: 'thinking', busygin_look: 'table#glass', busygin_mood: 'afraid' }),
      run: async s => {
        await s.wait(1.4);
        s.tell('talk_back:ready');
        await s.wait(1.4);
      },
    },
    // “She remembered”: he puts the glass down, reaches across and lays his hand on Busygin's; then looks at the window
    galya_yes: {
      after: 'talk_back',
      from: () => NIGHT_TALK({ ...CAM.tb, puddle: 1, glass_s: 'hand', sarafanov_with: WITH('sarafanov_home', 'glass_held'), sarafanov_reach: { r: P3(1.42, 2.1, 0.98), l: P3(1.42, 2.17, 0.96) },
        sarafanov_look: 'busygin', sarafanov_mood: 'thinking', busygin_mood: 'afraid', busygin_look: 'table#glass' }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin');
        sar.reach({ r: 'table#glass_s' });
        await s.wait(0.9);
        s.set('glass_s', 'table');
        sar.with(null);
        sar.reach({ r: 'busygin#hand_r' });
        bus.look('sarafanov');
        await s.wait(1.6);
        s.tell('galya_yes:hand');
        await s.wait(1.4);
        sar.look('window#pane');
        sar.mood('smile');
        await s.wait(3.2);
      },
    },
    // “Never told me”: he lowers his head to the glass and turns it slowly in its holder
    galya_no: {
      after: 'talk_back',
      from: () => F.galya_yes.from(),
      run: async s => {
        const sar = s.person('sarafanov');
        sar.reach({ r: 'table#glass_s' });
        await s.wait(0.9);
        s.set('glass_s', 'table');
        sar.with(null);
        sar.reach(null);
        sar.look('table#glass_s');
        sar.mood('sad');
        sar.do('turn_glass', { loop: true });
        s.tell('galya_no:glass');
        await s.wait(3.5);
      },
    },
    // the same night (opening the scene again): he gets up, goes to the cupboard in the room, takes the snuffbox
    // from its shelf, comes back, sits and sets it on the oilcloth between them — L36, L37; a choice on it
    box_out: {
      from: () => NIGHT_TALK({ ...CAM.tb, puddle: 1, glass_s: 'table', box_at: 'shelf', sarafanov_look: 'busygin', busygin_look: 'table#glass' }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin');
        // the way there and back is left out: two cuts
        const room = shot(s, { ...CAM.cupboard, ...STAND('sarafanov', SPOT.cupboard, 180, { sarafanov_look: 'cupboard#box', sarafanov_mood: 'smile',
          sarafanov_wear: LOOK('sarafanov_home') }) });
        const back = shot(s, { ...CAM.tb, box_at: 'none', ...SIT('sarafanov', 'L1', { sarafanov_wear: LOOK('sarafanov_home'),
          sarafanov_with: WITH('sarafanov_home', 'box_held'), sarafanov_look: 'table#box', sarafanov_mood: 'smile' }) });
        await s.wait(0.5);
        bus.look('sarafanov');
        sar.mood('smile');
        await rise(sar, 'L1');
        await walk(sar, [ROUND[0]]);
        await s.until(() => room.ready);
        room.cut();
        sar.reach({ r: 'cupboard#box' });
        await s.wait(1.2);
        s.set('box_at', 'none');
        hold(s, 'sarafanov', 'box_held');
        sar.reach(null);
        await s.wait(0.6);
        await s.until(() => back.ready);
        back.cut();
        bus.look('table#box');
        sar.reach({ r: 'table#box' });
        await s.wait(1.0);
        s.set('box_at', 'table');
        sar.with(null);
        await s.wait(0.5);
        sar.reach(null);
        sar.look('busygin');
        bus.mood('afraid');
        s.tell('box_out:down');
        await s.wait(2.5);
      },
    },
    // he reaches for it — the insert `box`: taking it
    box_take: {
      after: 'box_out',
      from: () => NIGHT_TALK({ ...CAM.tb, puddle: 1, glass_s: 'table', box_at: 'table', sarafanov_look: 'busygin', sarafanov_mood: 'smile',
        busygin_look: 'table#box', busygin_mood: 'afraid', box: 0, box_mode: 'take', finger1: 0, finger2: 0, finger3: 0, finger4: 0, old: 1, push: 0, old_close: 0 }),
      run: async s => {
        const bus = s.person('busygin');
        s.set('box_mode', 'take');
        bus.reach({ r: 'table#box' });
        await s.wait(1.8);
        s.set('box', 1);
        s.tell('box_take:close');
        await s.wait(1.5);
      },
    },
    // his hand lies on it — the insert `box`: giving it back
    box_give: {
      after: 'box_out',
      from: () => ({ ...F.box_take.from(), box_mode: 'give' }),
      run: async s => {
        const bus = s.person('busygin');
        s.set('box_mode', 'give');
        bus.reach({ r: 'table#box' });
        await s.wait(1.8);
        s.set('box', 1);
        s.tell('box_give:close');
        await s.wait(1.5);
      },
    },
    // the insert closes: no box on the table; his hand to his breast pocket; the old man leans back, his palms on
    // the oilcloth — L38
    box_kept: {
      after: 'box_take',
      from: () => ({ ...F.box_take.from(), box: 1, finger1: 1, finger2: 1, finger3: 1, finger4: 1, old: 0, busygin_reach: { r: 'table#box' } }),
      run: async s => {
        const bus = s.person('busygin'), sar = s.person('sarafanov');
        cut(s, { box: 0, box_at: 'none', ...CAM.tb });
        bus.reach({ r: 'busygin#chest' });
        sar.reach({ r: P3(1.5, 2.0, TOP), l: P3(1.5, 2.28, TOP) });
        sar.look('busygin');
        sar.mood('smile');
        await s.wait(1.6);
        s.tell('box_kept:back');
        await s.wait(2.0);
        bus.reach(null);
        await s.wait(3.0);
      },
    },
    // the insert closes: the box in his hand; he gets up, takes it back to its shelf and stands there, his back to
    // us — L40
    box_back: {
      after: 'box_give',
      from: () => ({ ...F.box_give.from(), box: 1, push: 1, old_close: 1, busygin_reach: { r: 'table#box' } }),
      run: async s => {
        const bus = s.person('busygin'), sar = s.person('sarafanov');
        cut(s, { box: 0, box_at: 'none', ...CAM.tb, sarafanov_with: WITH('sarafanov_home', 'box_held'), busygin_reach: null });
        bus.look('sarafanov');
        sar.mood('sad');
        await s.wait(0.8);
        const room = shot(s, { ...CAM.cupboard, ...STAND('sarafanov', SPOT.cupboard, 180, { sarafanov_look: 'cupboard#shelf', sarafanov_mood: 'sad',
          sarafanov_wear: LOOK('sarafanov_home'), sarafanov_with: WITH('sarafanov_home', 'box_held') }) });
        await rise(sar, 'L1');
        await walk(sar, [ROUND[0]]);
        await s.until(() => room.ready);
        room.cut();
        sar.reach({ r: 'cupboard#shelf' });
        const put = sar.do('put_shelf');
        await s.wait(1.2);
        s.set('box_at', 'shelf');
        sar.with(null);
        await put;
        sar.reach(null);
        sar.look(P3(CUPBOARD.x, CUPBOARD.z, 1.4));
        s.tell('box_back:shelf');
        await s.wait(3.2);
      },
    },
    // night: the room; his lamp burns beyond his door ajar — a narrow wedge across the room.
    // Busygin on the cot, his coat on the chair by it; Silva on the sofa, his head in the wedge — L118 (close, in
    // profile, without his smile); then the clarinet; Busygin turns on his side to the wall — under L41
    wall: {
      from: () => ROOM({ ...CAM.sofa, lamp: 0, sar_light: 1, coat_b: 'cot', box_at: boxAt(), ...wear('busygin', 'busygin_shirt'), ...wear('silva', 'silva_shirt'),
        ...LIE('busygin', 'cot'), ...LIE('silva', 'sofa', { silva_mood: 'tired', silva_look: null }) }),
      run: async s => {
        const bus = s.person('busygin');
        const cot = shot(s, { ...CAM.cot });
        await s.wait(6.5);
        s.tell('wall:dark');
        await s.wait(3.0);
        cot.cut();
        await s.wait(0.8);
        s.set('busygin_turn', LIE_AT.cot.side);
        await bus.do('lie_side');
        s.tell('wall:turn');
        await s.wait(6.0);
      },
    },
    // grey dawn: Silva, in his coat already, bends over the cot and shakes him by the shoulder —
    // L42; he sits up. A choice: his coat on the chair (go), the cot (stay)
    wake: {
      from: () => ({ ...WAKE(), ...CAM.wake, ...LIE('busygin', 'cot', { busygin_mood: 'tired' }), ...STAND('silva', SPOT.byCot, 240, { silva_look: 'busygin' }) }),
      run: async s => {
        const sil = s.person('silva');
        // close: his hand on the sleeper's shoulder, the two faces; then (a cut) he sits on the cot's edge, the room
        const room = shot(s, { ...CAM.cot, ...STAND('busygin', EDGE, 90, { busygin_do: loop('seated'), busygin_on: P3(EDGE[0], EDGE[1], COT.top),
          busygin_look: 'silva', busygin_mood: 'tired' }), ...STAND('silva', SPOT.silvaBack, 240, { silva_look: 'busygin', silva_mood: 'neutral' }) });
        await s.wait(1.2);
        sil.reach({ r: 'busygin#shoulder_r' });
        await s.wait(2.8);
        sil.reach(null);
        await s.until(() => room.ready);
        room.cut();
        s.tell('wake:up');
        await s.wait(2.0);
      },
    },
    // “Slip away”: his coat over his arm, both into the kitchen to the stove (the way starts there); the old man's
    // lamp is out. Then the game creeps them along the way (`sneak`, scene: script); `stir` lights his lamp
    sneak: {
      after: 'wake',
      from: () => ({ ...WAKE(), ...CAM.cot }),
      run: async s => {
        const bus = s.person('busygin'), sil = s.person('silva');
        await upFromCot(s);
        await walk(bus, [[4.8, 0.75]]);
        bus.look('cot_chair#coat');
        bus.reach({ r: 'cot_chair#coat' });
        await bus.do('take');
        s.set('coat_b', 'arm');
        hold(s, 'busygin', 'coat_arm');
        bus.reach(null);
        bus.look(null);
        const kitchen = shot(s, { ...CAM.sneak, sar_light: 0, stir: 0, sneak: 0, sneak_at: 0 });
        const b = walk(bus, [[4.9, 1.6], [4.6, 2.85], SPOT.roomIn, SPOT.doorway, [2.9, 1.5], SNEAK[0]], { gait: 'tiptoe' });
        await s.wait(2.5);
        const si = walk(sil, [[4.6, 2.85], SPOT.roomIn, SPOT.doorway, [2.9, 1.6], [1.85, 1.6]], { gait: 'tiptoe' });   // a step behind him
        await s.until(() => s.get('busygin_a') < A(4.0));
        kitchen.cut();
        await s.all(b, si);
        await bus.turn(200);
        sil.turn(200);
        s.tell('sneak:ready');
        await s.wait(0.5);
      },
    },
    // both at the front door, coats over the arm; the old man in the doorway (he comes through the room, or — he
    // heard them — stands there already): L43, L44, L45; Busygin hangs his coat on the hook — L48; the old man goes
    // past them and out, the door slams
    caught: {
      from: () => ROOM({ ...DAWN, ...CAM.caught, box_at: boxAt(), coat_b: 'arm', case_on: 0, ...wear('busygin', 'busygin_shirt'),
        ...STAND('busygin', [2.6, 0.95], 30, { busygin_with: WITH('busygin_shirt', 'coat_arm'), busygin_look: 'sarafanov' }),
        ...STAND('silva', [2.15, 0.8], 35, { silva_look: 'sarafanov' }),
        ...(Number(get('heard')) >= 0.5
          ? STAND('sarafanov', SPOT.doorway, turnTo(SPOT.doorway, [2.6, 0.95]), { sarafanov_with: WITH('sarafanov', 'case'), sarafanov_look: 'busygin' })
          : { ...OUT('sarafanov'), sarafanov_a: A(SPOT.sarIn[0]), sarafanov_d: SPOT.sarIn[1] }) }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin'), sil = s.person('silva');
        if (!(Number(get('heard')) >= 0.5)) {
          await s.move('sar_door', 1, { over: 0.9, ease: 'out' });
          hold(s, 'sarafanov', 'case');
          sar.here(true);
          await walk(sar, [SPOT.sarDoor, [5.2, 2.9], SPOT.doorway]);
          s.move('sar_door', 0.08, { over: 1.0 });
          await sar.turn(turnTo(SPOT.doorway, [2.6, 0.95]));
          sar.look('busygin');
        }
        sar.mood('sad');
        bus.mood('afraid');
        s.tell('caught:face');
        await s.wait(9.0);
        const door = shot(s, { ...CAM.door });
        await walk(bus, [SPOT.hook]);
        door.cut();
        await bus.turn(180);
        bus.look('hook#coat');
        bus.reach({ r: 'hook#coat' });
        await s.wait(0.9);
        s.set('coat_b', 'hook');
        bus.with(null);
        bus.reach(null);
        bus.look('sarafanov');
        s.tell('caught:hook');
        await s.wait(3.0);
        sil.look('sarafanov');
        await walk(sar, [[3.3, 2.0], [3.05, 1.1], SPOT.inDoor]);
        await s.move('door', 1, { over: 0.6, ease: 'out' });
        await walk(sar, [SPOT.hall]);
        sar.here(false);
        await s.move('door', 0, { over: 0.25, ease: 'in' });
        s.tell('caught:out');
        await s.wait(1.5);
      },
    },
    // “Stay”: Silva lies down again — L46; Busygin gets up, goes into the kitchen to the window and stands at it:
    // the frosted glass in the middle of the frame (the game rubs the hole: “Frost”)
    window_watch: {
      after: 'wake',
      from: () => ({ ...WAKE(), ...CAM.cot }),
      run: async s => {
        const bus = s.person('busygin');
        const lie = s.sequence(async c => {
          const p = c.person('silva');
          p.mood('tired');
          await walk(p, [[5.6, 2.6], [6.75, 3.05]]);
          await p.turn(LIE_AT.sofa.back);
          lieDown(c, 'silva', 'sofa');
        });
        await upFromCot(s);
        const win = shot(s, { ...CAM.ww });
        await walk(bus, [[4.6, 2.85], SPOT.roomIn, SPOT.doorway, [3.0, 3.75], [2.4, 3.85]]);
        win.cut();
        await walk(bus, [SPOT.window]);
        await bus.turn(72);
        bus.look('window#pane');
        bus.mood('thinking');
        s.tell('window_watch:pane');
        await lie;
      },
    },
    // to the table: the old man comes out of the room in his coat, with his case, stops at the table — L47, L48; goes
    // to the door and out; back to the window: through the hole the small figure with the case crosses the gardens
    morning: {
      from: () => ({ ...WAKE(), ...CAM.morning, case_on: 0, ...LIE('silva', 'sofa'), ...OUT('sarafanov'), sarafanov_a: A(SPOT.sarIn[0]), sarafanov_d: SPOT.sarIn[1],
        ...STAND('busygin', SPOT.window, 72, { busygin_look: 'window#pane', busygin_mood: 'thinking' }) }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin');
        await s.move('sar_door', 1, { over: 0.8, ease: 'out' });
        hold(s, 'sarafanov', 'case');
        sar.here(true);
        await walk(sar, [SPOT.sarDoor, [5.2, 2.95], SPOT.doorway, [3.1, 3.55], [2.5, 3.6]]);
        s.move('sar_door', 0.08, { over: 1.0 });
        await sar.turn(270);
        sar.look('busygin');
        bus.look('sarafanov');
        await bus.turn(90);
        sar.mood('smile');
        s.tell('morning:in');
        await s.wait(5.0);
        sar.look(null);
        const win = shot(s, { ...CAM.hole, father_on: 1, father_x: FATHER_FAR.from, busygin_look: 'window#pane', busygin_turn: 72 });
        await walk(sar, [[3.0, 3.0], [3.15, 1.4], SPOT.inDoor]);
        await s.move('door', 1, { over: 0.6, ease: 'out' });
        await walk(sar, [SPOT.hall]);
        sar.here(false);
        await s.move('door', 0, { over: 0.25, ease: 'in' });
        s.tell('morning:out');
        await s.wait(0.5);
        win.cut();
        await s.move('father_x', FATHER_FAR.to, { over: (FATHER_FAR.to - FATHER_FAR.from) / 1.1, ease: 'linear' });
        s.set('father_on', 0);
      },
    },

    // IV. The second day's late evening: the table laid; the place facing Nina empty; the clock
    // strikes nine — on the ninth stroke the door: Kudimov in his greatcoat — L73; cut: in his tunic, he comes and
    // sits at his place — L74
    table: {
      from: () => IV_TABLE({ ...CAM.toast, ...OUT('kudimov'), ...wear('kudimov', 'kudimov'),
        busygin_mood: 'thinking', nina_look: P3(1.5, 2.7, TOP), sarafanov_look: 'nina' }),
      run: async s => {
        const kud = s.person('kudimov'), bus = s.person('busygin'), nina = s.person('nina'), sar = s.person('sarafanov');
        await s.wait(1.2);
        s.tell('table:nine');
        const door = shot(s, { ...CAM.win });
        await s.wait(6.6);
        door.cut();
        await s.wait(1.2);
        await s.move('door', 1, { over: 1.0, ease: 'out' });
        kud.here(true);
        await walk(kud, [SPOT.inDoor]);
        kud.turn(turnTo(SPOT.inDoor, SEATS.L1));
        kud.look('sarafanov');
        s.tell('table:in');
        sar.look('kudimov');
        nina.look('kudimov');
        bus.look('kudimov');
        bus.mood('afraid');
        await s.wait(3.0);
        cut(s, { door: 0, door_f: 0, kudimov_wear: LOOK('kudimov_in'), kudimov_a: A(3.05), kudimov_d: 1.05, kudimov_mood: 'smile' });
        await walk(kud, [[3.1, 2.7]]);
        const sitting = sit(kud, 'R2');
        const table = shot(s, { ...CAM.toast });
        await sitting;
        table.cut();
        kud.look('nina');
        s.tell('table:sat');
        await s.wait(3.0);
      },
    },
    // the old man stands up with his glass; Kudimov stands too, straight — L75, L76; the glass put down, he sits and
    // turns to Busygin — L77. All six in profile; a choice on the father, the bridegroom, Nina
    toast: {
      after: 'table',
      from: () => IV_TABLE({ ...CAM.toast, kudimov_look: 'nina', kudimov_mood: 'smile', busygin_mood: 'afraid', nina_look: P3(1.5, 2.7, TOP) }),
      run: async s => {
        const sar = s.person('sarafanov'), kud = s.person('kudimov'), nina = s.person('nina'), bus = s.person('busygin');
        hold(s, 'sarafanov', 'glass_held');
        await rise(sar, 'L1');
        sar.mood('smile');
        const t = sar.do('toast');
        kud.mood('neutral');
        await rise(kud, 'R2');
        await kud.turn(270);
        kud.look('sarafanov');
        await t;
        sar.reach({ r: P3(1.3, 2.1, 1.45) });
        s.tell('toast:news');
        nina.look('kudimov');
        nina.mood('thinking');
        await s.wait(5.5);
        sar.reach({ r: P3(1.45, 2.12, TOP + 0.05) });
        const put = sar.do('reach_put');
        await s.wait(1.0);
        sar.with(null);
        await put;
        sar.reach(null);
        const down = sit(kud, 'R2');
        await sit(sar, 'L1');
        await down;
        sar.look('busygin');
        sar.mood('sad');
        bus.look('sarafanov');
        s.tell('toast:turn');
        await s.wait(3.0);
      },
    },
    // “Let her go”: Nina lowers her head; Kudimov nods; the old man slowly raises his glass again
    let_go: {
      after: 'toast',
      from: () => IV_TABLE({ ...CAM.toast, sarafanov_look: 'busygin', sarafanov_mood: 'sad', nina_mood: 'thinking', nina_look: 'kudimov', busygin_look: 'sarafanov' }),
      run: async s => {
        const sar = s.person('sarafanov'), kud = s.person('kudimov'), nina = s.person('nina');
        nina.look(P3(1.45, 2.7, TOP));
        nina.mood('sad');
        await s.wait(1.0);
        kud.look(P3(2.2, 2.7, TOP));
        await s.wait(0.9);
        kud.look('nina');
        hold(s, 'sarafanov', 'glass_held');
        sar.look(null);
        sar.reach({ r: P3(1.42, 2.0, 1.05) });
        s.tell('let_go:glass');
        await s.wait(6.0);
      },
    },
    // “Nina, stay”: Kudimov stands — L81; Nina gets up and stands between him and her father, in profile, angry
    ask_stay: {
      after: 'toast',
      from: () => F.let_go.from(),
      run: async s => {
        const kud = s.person('kudimov'), nina = s.person('nina'), sar = s.person('sarafanov');
        const view = shot(s, { ...CAM.ask });
        const her = shot(s, { ...CAM.askNina, ...STAND('nina', [1.95, 1.55], 38, { nina_look: 'kudimov', nina_mood: 'angry' }),
          sarafanov_look: 'nina' });
        await s.until(() => view.ready);
        view.cut();
        await rise(kud, 'R2');
        await kud.turn(270);
        kud.look('sarafanov');
        kud.mood('angry');
        s.tell('ask_stay:stand');
        await s.wait(1.5);
        // a cut: she has got up and stands between him and her father, facing him — seen past Kudimov's shoulder
        await s.until(() => her.ready);
        her.cut();
        await s.wait(2.0);
      },
    },
    // “Stay. Not for Father's sake”: Nina looks at Busygin (close, in profile: surprised, then a smile); the old man looks
    // from her to him; Kudimov slowly stands, sets his chair straight, stands upright — L117
    for_me: {
      after: 'toast',
      from: () => F.let_go.from(),
      run: async s => {
        const kud = s.person('kudimov'), nina = s.person('nina'), sar = s.person('sarafanov');
        const close = shot(s, { ...CAM.for_me });
        await s.until(() => close.ready);
        close.cut();
        nina.look('busygin');
        nina.mood('surprised');
        await s.wait(2.0);
        nina.mood('smile');
        sar.look('nina');
        sar.mood('thinking');
        await s.wait(1.5);
        sar.look('busygin');
        await s.wait(1.2);
        const view = shot(s, { ...CAM.toast });
        kud.mood('neutral');
        await rise(kud, 'R2');
        view.cut();
        await walk(kud, [[3.0, 2.75]]);
        await kud.turn(270);
        kud.look(null);
        s.tell('for_me:stand');
        await s.wait(4.0);
      },
    },

    // V. The second night: Silva at the front door, his sleeve burnt; Busygin by the table — L92;
    // the old man comes out of the room with his case and the old suitcase and stands in the doorway — L93, L94; Nina
    // and Vasenka behind him; Silva turns to him — L95. A choice: the father, Silva
    pack: {
      from: () => PACK({ ...CAM.pack, ...OUT('sarafanov'), sarafanov_a: A(5.2), sarafanov_d: 2.9, ...wear('sarafanov', 'sarafanov'),
        silva_mood: 'smile', silva_look: 'busygin', busygin_mood: 'tired', busygin_look: 'silva' }),
      run: async s => {
        const sar = s.person('sarafanov'), sil = s.person('silva'), vas = s.person('vasenka'), bus = s.person('busygin');
        const close = shot(s, { ...CAM.packSar });
        await s.wait(4.0);
        hold(s, 'sarafanov', 'case', 'suitcase');
        sar.here(true);
        await walk(sar, [SPOT.doorway]);
        await sar.turn(283);
        sar.mood('tired');
        sar.look('busygin');
        bus.look('sarafanov');
        // close on him in the doorway as he says it (L93, L94), then the room again for the choice
        await s.until(() => close.ready);
        close.cut();
        s.tell('pack:case');
        const wide = shot(s, { ...CAM.pack });
        await s.wait(4.5);
        await s.until(() => wide.ready);
        wide.cut();
        if (Number(get('vasenka_by')) >= 0.5) {
          await walk(vas, [[4.3, 2.4], [3.4, 2.0], [2.45, 1.75]]);
          await vas.turn(30);
          vas.look('sarafanov');
          await s.wait(1.0);
        } else await s.wait(1.5);
        await sil.turn(10);
        sil.look('sarafanov');
        sil.mood('smile');
        s.tell('pack:silva');
        await s.wait(3.5);
      },
    },
    // “Tell him yourself”: he goes to the old man, a step from him — L96; (the box out of his pocket onto the table); the
    // suitcase put down; then — he sits down at the table and reaches for his hand (`hurt` 0), or goes to the window
    // and stands with his back to us (`hurt` 1) — L99
    confess: {
      after: 'pack',
      from: () => PACK({ ...CAM.pack, sarafanov_mood: 'tired', sarafanov_look: 'busygin', busygin_look: 'sarafanov', silva_turn: 10, silva_look: 'sarafanov',
        silva_mood: 'smile', ...(Number(get('vasenka_by')) >= 0.5 ? STAND('vasenka', [2.45, 1.75], 30, { vasenka_look: 'sarafanov' }) : {}) }),
      run: async s => {
        const sar = s.person('sarafanov'), bus = s.person('busygin');
        const two = shot(s, { ...CAM.confess });
        await walk(bus, [[3.1, 2.3], [3.3, 2.72]]);
        two.cut();
        await bus.turn(turnTo([3.3, 2.72], SPOT.doorway));
        bus.look('sarafanov');
        bus.mood('sad');
        sar.mood('sad');
        s.tell('confess:said');
        await s.wait(5.0);
        if (get('box_where') === 'busygin') {
          hold(s, 'busygin', 'box_held');
          await bus.turn(250);
          bus.reach({ r: P3(2.18, 2.6, TOP + 0.04) });
          const put = bus.do('reach_put');
          await s.wait(1.0);
          s.set('box_at', 'table');
          bus.with(null);
          await put;
          bus.reach(null);
          await bus.turn(turnTo([3.3, 2.72], SPOT.doorway));
        }
        sar.look(P3(3.6, 3.0, 0));
        await sar.do('put_heavy');
        sar.do('stand');
        hold(s, 'sarafanov', 'case');
        sar.look('busygin');
        if (Number(get('hurt')) >= 0.5) {
          const back = shot(s, { ...CAM.window });
          await walk(sar, [[3.3, 3.45], [2.4, 3.75], SPOT.window]);
          back.cut();
          await sar.turn(10);
          sar.look('window#pane');
          s.tell('confess:sarafanov');
          await s.wait(5.0);
        } else {
          // both sit down at the table, face to face across it (the old man by the doorway, he round the near end)
          const table = shot(s, { ...CAM.tb });
          const down = sit(sar, 'R2');
          await walk(bus, [[2.9, 1.55], [1.2, 1.5]]);
          await sit(bus, 'L2');
          await down;
          table.cut();
          bus.look('sarafanov');
          bus.reach({ r: P3(1.62, 2.7, TOP) });
          sar.reach({ r: 'busygin#hand_r' });
          sar.look('busygin');
          s.tell('confess:sarafanov');
          await s.wait(1.5);
          sar.mood('smile');
          await s.wait(3.5);
        }
      },
    },
    // “Keep quiet”: Silva steps toward the old man and points at Busygin — L97 / L98; the old man, the suitcase in his
    // hand, turns and goes to the window, stands with his back to us — L99 (into the glass)
    exposed: {
      after: 'pack',
      from: () => F.confess.from(),
      run: async s => {
        const sar = s.person('sarafanov'), sil = s.person('silva'), bus = s.person('busygin');
        await walk(sil, [[3.35, 1.55]]);
        await sil.turn(turnTo([3.35, 1.55], SPOT.doorway));
        sil.look('sarafanov');
        sil.mood('angry');
        sil.reach({ r: 'busygin' });
        await sil.do('point');
        bus.mood('afraid');
        s.tell('exposed:said');
        await s.wait(5.0);
        sil.reach(null);
        sil.look('busygin');
        sar.look(null);
        const back = shot(s, { ...CAM.window });
        await walk(sar, [[3.3, 3.45], [2.4, 3.75]]);
        back.cut();
        await walk(sar, [SPOT.window]);
        await sar.turn(10);
        sar.look('window#pane');
        s.tell('exposed:window');
        await s.wait(4.0);
      },
    },
    // a cut to the front door: he at the hooks takes his coat, Silva by the door opens it and waits, they go out together
    // (`silva_door` 1) — or Silva goes first, the door slams, he goes after (0); a cut to the old man left where he is (at
    // the window, or at the table)
    go_out: {
      after: ['confess', 'exposed'],
      from: () => PACK({ ...CAM.door, ...STAND('sarafanov', SPOT.window, 10, { sarafanov_with: WITH('sarafanov', 'case', 'suitcase'), sarafanov_look: 'window#pane' }),
        ...STAND('busygin', [2.85, 2.25], 300, { busygin_mood: 'sad' }), ...STAND('silva', [3.35, 1.55], 330, { silva_mood: 'angry' }) }),
      run: async s => {
        const bus = s.person('busygin'), sil = s.person('silva');
        const door = shot(s, { ...CAM.door, ...STAND('busygin', SPOT.hook, 180, { busygin_mood: 'sad', busygin_look: 'hook#coat', busygin_reach: { r: 'hook#coat' } }),
          ...STAND('silva', SPOT.inDoor, 180, { silva_mood: 'angry' }) });
        const left = shot(s, s.get('sarafanov_on') ? { ...CAM.tb } : { ...CAM.window });
        await s.until(() => door.ready);
        door.cut();
        const together = Number(get('silva_door')) >= 0.5;
        if (together) {
          const opens = s.move('door', 1, { over: 0.8, ease: 'out' });
          await bus.do('take');
          s.set('coat_b', 'arm');
          hold(s, 'busygin', 'coat_arm');
          bus.reach(null);
          await opens;
          await sil.turn(45);
          sil.look('busygin');
          await s.wait(0.5);
          await s.all(walk(sil, [SPOT.hall]), s.sequence(async c => { await c.wait(0.6); await walk(c.person('busygin'), [SPOT.inDoor, SPOT.hall]); }));
          sil.here(false);
          bus.here(false);
          await s.move('door', 0, { over: 1.0, ease: 'inOut' });
        } else {
          const goes = s.sequence(async c => {
            await c.move('door', 1, { over: 0.5, ease: 'out' });
            await walk(c.person('silva'), [SPOT.hall]);
            c.person('silva').here(false);
            await c.move('door', 0, { over: 0.25, ease: 'in' });
          });
          await bus.do('take');
          s.set('coat_b', 'arm');
          hold(s, 'busygin', 'coat_arm');
          bus.reach(null);
          await goes;
          await walk(bus, [SPOT.inDoor]);
          await s.move('door', 1, { over: 0.6, ease: 'out' });
          await walk(bus, [SPOT.hall]);
          bus.here(false);
          await s.move('door', 0, { over: 0.25, ease: 'in' });
        }
        s.tell('go_out:gone');
        await s.until(() => left.ready);
        left.cut();
        await s.wait(2.0);
      },
    },
    // night: the door — Busygin (and who came with him from the platform); he hangs his coat on the
    // back of his chair and sits — L104; the old man by his own chair across the table — L105; the snuffbox comes
    // before him (fetched off the shelf in the room, or slid across the oilcloth) — L106; the old man goes off to his
    // room, his door left ajar, his lamp lit; Nina at home comes to the table
    home_late: {
      from: () => HOME({}),
      run: async s => {
        const bus = s.person('busygin'), sar = s.person('sarafanov');
        const who = cameHome();
        const { all: others, father } = await comeIn(s, who);
        const nina = ninaComes(s, who);
        await s.all(father, s.wait(1.0));
        // the box before him
        if (get('box_where') === 'busygin') {
          sar.look('table#box');
          sar.reach({ r: 'table#box' });
          await s.wait(1.0);
          s.set('box_at', 'near');
          await s.wait(0.5);
          sar.reach(null);
        } else {
          // off to the sideboard and back, the way left out: at it (a cut), then the kitchen wide as he brings it
          const look = { sarafanov_wear: get('sarafanov_wear') };
          const room = shot(s, { ...CAM.cupboard, ...STAND('sarafanov', SPOT.cupboard, 180, { ...look, sarafanov_look: 'cupboard#box', sarafanov_mood: 'smile' }) });
          const back = shot(s, { ...CAM.win, box_at: 'none', ...STAND('sarafanov', SPOT.doorway, 230, { ...look, sarafanov_mood: 'smile', sarafanov_look: 'busygin',
            sarafanov_with: WITH('sarafanov_home', 'box_held') }) });
          sar.look(null);
          await rise(sar, 'L1');
          await walk(sar, [ROUND[0]]);
          await s.until(() => room.ready);
          room.cut();
          sar.reach({ r: 'cupboard#box' });
          await s.wait(1.2);
          s.set('box_at', 'none');
          hold(s, 'sarafanov', 'box_held');
          sar.reach(null);
          await s.wait(0.5);
          await s.until(() => back.ready);
          back.cut();
          await walk(sar, [[3.5, 2.85], [2.95, 1.95]]);
          await sar.turn(250);
          sar.look('table#box');
          sar.reach({ r: P3(ON.near[0], ON.near[1], TOP + 0.04) });
          await s.wait(1.0);
          s.set('box_at', 'near');
          sar.with(null);
          sar.reach(null);
        }
        sar.look('busygin');
        bus.look('table#box');
        s.tell('home_late:box');
        await s.wait(1.0);
        // he goes to his room; the door stays ajar, his lamp lit
        sar.look(null);
        const end = who.ninaSeat === 'R2' && (who.nina || who.ninaHome) ? shot(s, { ...CAM.pair }) : null;
        // (fetched off the shelf, the kitchen is seen wide as he goes: the table again once he is gone, the box before him)
        const table = !end && get('box_where') !== 'busygin' ? shot(s, { ...CAM.tb }) : null;
        if (get('box_where') === 'busygin') {
          await rise(sar, 'L1');
          await walk(sar, [...ROUND, SPOT.doorway, SPOT.roomIn]);
        } else await walk(sar, [[3.5, 2.85], SPOT.doorway, SPOT.roomIn]);
        sar.here(false);
        if (table) {
          await s.until(() => table.ready);
          table.cut();
        }
        s.move('sar_door', 0.3, { over: 1.0 });
        s.set('sar_light', 1);
        s.tell('home_late:room');
        await s.all(others, nina);
        // Nina beside him: the two of them, not one behind the other
        if (end) {
          await s.until(() => end.ready);
          end.cut();
        }
        await s.wait(1.0);
      },
    },
    // night: the old man at the window, his back to us (or he comes in first and goes to it);
    // Busygin comes in, his coat on his chair's back, sits (the box onto the oilcloth — the old man does not take it);
    // the clock; the old man turns — L107 —, takes the kettle to the stove and sits facing him
    home_anyway: {
      from: () => HOME({ anyway: true }),
      run: async s => {
        const bus = s.person('busygin'), sar = s.person('sarafanov');
        const who = cameHome();
        let first = null;
        if (who.father) {
          await s.move('door', 1, { over: 0.8, ease: 'out' });
          sar.here(true);
          first = s.sequence(async c => {
            const p = c.person('sarafanov');
            await walk(p, [SPOT.inDoor, [2.9, 2.0], [2.4, 3.75], SPOT.window]);
            await p.turn(10);
            p.look('window#pane');
          });
          await s.wait(1.2);
        }
        const { all: others } = await comeIn(s, who, true);
        const nina = ninaComes(s, who);
        await first;
        if (get('box_where') === 'busygin') {
          bus.reach({ r: 'table#box' });
          await s.wait(1.0);
          s.set('box_at', 'table');
          await s.wait(0.4);
          bus.reach(null);
        }
        await s.wait(5.0);
        sar.look(null);
        await sar.turn(190);
        sar.mood('tired');
        sar.look('busygin');
        s.tell('home_anyway:turn');
        await s.wait(1.2);
        await walk(sar, [[1.0, 3.0], [1.2, 2.45]]);
        sar.look('table#kettle');
        sar.reach({ r: 'table#kettle' });
        await s.wait(0.8);
        s.set('kettle_at', 'none');
        hold(s, 'sarafanov', 'kettle');
        sar.reach(null);
        await walk(sar, [SPOT.stove]);
        await sar.turn(270);
        sar.reach({ r: P3(0.7, 1.75, 1.05) });
        await s.wait(0.8);
        s.set('kettle_at', 'stove');
        sar.with(null);
        sar.reach(null);
        sar.mood('smile');
        sar.look('busygin');
        const table = shot(s, { ...CAM.tb });
        await sit(sar, 'L1');
        table.cut();
        await s.all(others, nina);
        await s.wait(1.0);
      },
    },
  };

  // who comes home with him from the platform (`father_came`, `vasya_came`; Nina — `nina_came` and at home in the
  // ending: come to the platform and gone after all, her chair stays empty), and Nina's place: beside him (`nina_for`)
  // or her own
  function cameHome() {
    const ninaHome = get('nina_end') === 'home';
    return { father: Number(get('father_came')) >= 0.5, vasya: Number(get('vasya_came')) >= 0.5, ninaHome,
      nina: ninaHome && Number(get('nina_came')) >= 0.5, ninaSeat: Number(get('nina_for')) >= 0.5 ? 'R2' : 'L2' };
  }
  // Nina at home (`nina_end` home) who did not come with him: out of the room to the table
  function ninaComes(s, who) {
    if (!who.ninaHome || who.nina) return null;
    return s.sequence(async c => {
      const nina = c.person('nina');
      nina.here(true);
      await walk(nina, [[5.0, 2.9], SPOT.roomIn, SPOT.doorway, [3.2, 2.7], who.ninaSeat === 'R2' ? [3.0, 2.75] : [1.0, 3.6]]);
      await sit(nina, who.ninaSeat);
      nina.look('busygin');
    });
  }

  // the end of the film: the kitchen at night, who is home (nina_end, vasya_end), the box where the party left it
  function HOME({ anyway }) {
    const who = cameHome();
    const box = get('box_where') === 'busygin' ? (anyway ? 'none' : 'table') : 'shelf';
    return ROOM({ ...(anyway ? CAM.back : CAM.win), box_at: box, coat_b: 'none', rucksack: get('vasya_end') === 'home' ? 'none' : 'door',
      nina_coat: who.ninaHome && !who.nina ? 1 : 0, sar_door: 0.08, kettle_at: 'table',
      ...wear('busygin', 'busygin'), ...wear('sarafanov', 'sarafanov_home'), ...wear('nina', who.nina ? 'nina' : 'nina_home'), ...wear('vasenka', 'vasenka'),
      ...(who.father ? { ...OUT('sarafanov'), ...wear('sarafanov', 'sarafanov') }
        : anyway ? STAND('sarafanov', SPOT.window, 10, { sarafanov_look: 'window#pane' })
          : SIT('sarafanov', 'L1', { sarafanov_look: P3(3.2, 0.5, 1.6) })),
      ...(who.ninaHome && !who.nina ? { ...OUT('nina'), nina_a: A(5.4), nina_d: 3.0 } : {}),
    });
  }
  // the door at night: Busygin in (with who came: the old man — unless he came in first, `first` —, Vasenka off into
  // the room, Nina to her place), his coat onto his chair's back, he sits — L104 — `home_late:sat`; the old man (who
  // came in with him, or sat here) sits facing him — L105. It ends as he sits; its `all` — when the others have come
  // where they go
  async function comeIn(s, who, first) {
    const bus = s.person('busygin'), sar = s.person('sarafanov');
    const table = first ? null : shot(s, { ...CAM.tb });
    await s.move('door', 1, { over: 1.0, ease: 'out' });
    bus.here(true);
    const going = walk(bus, [SPOT.inDoor, [2.95, 1.75]]), goes = [];
    // the others after him, each a little later, each a sequence of their own
    let after = 0;
    const later = fn => { const t = (after += 0.9), q = s.sequence(async c => { await c.wait(t); await fn(c); }); goes.push(q); return q; };
    const father = who.father && !first ? later(async c => { const p = c.person('sarafanov'); p.here(true); await walk(p, [SPOT.inDoor, [2.5, 1.45], [1.2, 1.55]]); await sit(p, 'L1'); }) : null;
    if (who.vasya) later(async c => { const p = c.person('vasenka'); p.here(true); await walk(p, [SPOT.inDoor, [3.3, 2.0], SPOT.doorway, SPOT.roomIn, [5.3, 2.6]]); p.here(false); });
    if (who.nina) {
      later(async c => {
        const p = c.person('nina');
        p.here(true);
        await walk(p, who.ninaSeat === 'R2' ? [SPOT.inDoor, [3.15, 2.4], [3.0, 2.75]] : [SPOT.inDoor, [2.5, 1.45], [1.0, 1.55], [0.8, 2.4]]);
        await sit(p, who.ninaSeat);
        p.look('busygin');
      });
    }
    // the door shut behind the last of them
    goes.push(s.sequence(async c => { await c.wait(after + 1.6); await c.move('door', 0, { over: 1.0, ease: 'in' }); }));
    await going;
    // the coat on the back of his chair, not the hook
    bus.reach({ r: P3(2.85, 2.1, 0.9) });
    await s.wait(0.9);
    s.set('coat_b', 'chair');
    s.set('busygin_wear', LOOK('busygin_shirt'));
    bus.reach(null);
    await sit(bus, 'R1');
    bus.mood('tired');
    const all = s.all(...goes);
    if (first) return { all, father };
    s.tell('home_late:sat');
    await s.until(() => table.ready);
    table.cut();
    sar.look('busygin');
    sar.mood('smile');
    bus.look('sarafanov');
    return { all, father };
  }

  return F;
};

// the walls' paint (shared by the wall cards): the kitchen — green oil paint to 1.2 m under a dark line, whitewash
// above; the room — faded wallpaper with a small pattern over a skirting. w wide, from its foot up h (the room's
// height unless said: a piece over a door is whitewash or paper only)
function kitchenWall(g, e, w, h) {
  const top = -(h || H);
  g.fillStyle = '#d6cbb4';
  g.fillRect(-w / 2, top, w, -top + 0.02);
  if (!h) {
    g.fillStyle = '#62725f';
    g.fillRect(-w / 2, -1.2, w, 1.22);
    g.fillStyle = '#3a4238';
    g.fillRect(-w / 2, -1.24, w, 0.04);
    g.fillStyle = '#4a3a2c';
    g.fillRect(-w / 2, -0.1, w, 0.12);
  }
  g.fillStyle = 'rgba(120,110,95,0.12)';
  for (let i = 0; i < (w > 1.4 ? 6 : 0); i++) {
    g.beginPath();
    g.ellipse(-w / 2 + 0.7 + e.rnd() * (w - 1.4), top + 0.4 + e.rnd() * (-top - 1.8), 0.3 + e.rnd() * 0.3, 0.12 + e.rnd() * 0.2, 0, 0, Math.PI * 2);
    g.fill();
  }
}
function roomWall(g, e, w, h) {
  const top = -(h || H);
  g.fillStyle = '#a39479';
  g.fillRect(-w / 2, top, w, -top + 0.02);
  g.fillStyle = 'rgba(70,58,44,0.35)';
  for (let y = top + 0.12, row = 0; y < -0.2; y += 0.26, row++) for (let x = -w / 2 + 0.1 + (row % 2) * 0.11; x < w / 2 - 0.03; x += 0.22) {
    g.beginPath();
    g.arc(x, y, 0.025, 0, Math.PI * 2);
    g.fill();
  }
  if (!h) {
    g.fillStyle = '#4a3a2c';
    g.fillRect(-w / 2, -0.12, w, 0.14);
  }
}

// the table's edge seen from the side: the oilcloth's hem with its checks (the white cloth's, longer, when the table is
// laid), the apron under it, the legs at the corners. w wide, 0.76 high, from its foot
function tableEdge(g, e, w) {
  const set = e.state.table_set, hem = set ? 0.2 : 0.11;
  g.fillStyle = '#4a3626';
  g.fillRect(-w / 2 + 0.03, -0.7, 0.05, 0.7);
  g.fillRect(w / 2 - 0.08, -0.7, 0.05, 0.7);
  g.fillStyle = '#3e2c20';
  g.fillRect(-w / 2 + 0.02, -0.7, w - 0.04, 0.08);
  g.fillStyle = set ? '#ece8df' : '#e4e0d4';
  g.fillRect(-w / 2 - 0.02, -0.78, w + 0.04, hem);
  if (!set) {
    g.fillStyle = 'rgba(70,104,140,0.35)';
    for (let x = -w / 2; x < w / 2; x += 0.1) g.fillRect(x, -0.78, 0.05, hem);
    g.fillRect(-w / 2 - 0.02, -0.73, w + 0.04, 0.05);
  }
}
// Vasenka's packed rucksack standing on the floor: khaki canvas, the flap and two pockets, the straps, a rolled
// blanket strapped on top (metres, from its foot)
function rucksack(g) {
  g.fillStyle = '#5d6044';
  g.beginPath();
  g.moveTo(-0.2, 0);
  g.quadraticCurveTo(-0.27, -0.3, -0.18, -0.5);
  g.lineTo(0.18, -0.5);
  g.quadraticCurveTo(0.27, -0.3, 0.2, 0);
  g.closePath();
  g.fill();
  g.fillStyle = '#4a4c36';
  g.beginPath();
  g.moveTo(-0.19, -0.5);
  g.lineTo(0.19, -0.5);
  g.lineTo(0.17, -0.3);
  g.quadraticCurveTo(0, -0.25, -0.17, -0.3);
  g.closePath();
  g.fill();
  g.fillRect(-0.2, -0.2, 0.13, 0.15);
  g.fillRect(0.07, -0.2, 0.13, 0.15);
  g.fillStyle = '#3a2c20';
  g.fillRect(-0.09, -0.5, 0.03, 0.42);
  g.fillRect(0.06, -0.5, 0.03, 0.42);
  g.fillStyle = '#7a3a2e';
  g.beginPath();
  g.ellipse(0, -0.56, 0.21, 0.07, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#5a2a22';
  g.lineWidth = 0.01;
  for (const x of [-0.12, 0.12]) {
    g.beginPath();
    g.moveTo(x, -0.63);
    g.lineTo(x, -0.49);
    g.stroke();
  }
}
// a faceted glass of tea in its metal holder (a podstakannik), standing at 0: the holder's handle on the right
function teaGlass(g) {
  g.fillStyle = 'rgba(214,222,228,0.6)';
  g.beginPath();
  g.moveTo(-0.034, -0.115);
  g.lineTo(0.034, -0.115);
  g.lineTo(0.03, -0.02);
  g.lineTo(-0.03, -0.02);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(150,72,22,0.9)';
  g.fillRect(-0.031, -0.1, 0.062, 0.06);
  g.fillStyle = '#9a9a96';
  g.beginPath();
  g.moveTo(-0.04, -0.07);
  g.lineTo(0.04, -0.07);
  g.lineTo(0.034, -0.012);
  g.lineTo(0.045, 0);
  g.lineTo(-0.045, 0);
  g.lineTo(-0.034, -0.012);
  g.closePath();
  g.fill();
  g.strokeStyle = '#7d7d78';
  g.lineWidth = 0.008;
  g.beginPath();
  g.moveTo(0.038, -0.062);
  g.quadraticCurveTo(0.07, -0.05, 0.036, -0.02);
  g.stroke();
  g.strokeStyle = '#c9c9c4';
  g.lineWidth = 0.004;
  g.beginPath();
  g.moveTo(-0.01, -0.1);
  g.lineTo(0.016, -0.15);
  g.stroke();
}

return { clamp, A, W, P3, H, WINDOW, DOOR, DOORWAY, STOVE, TABLE, TOP, CHAIR_BACK, RUCKSACK, SET_GLASS, LAMP, SHADE, LIE_AT, CLOCK, HOOK, STOOL, CUPBOARD, COT, COT_CHAIR, SOFA, SAR_DOOR, SAR_LAMP,
  CASE_CHAIR, ON, SEATS, SEAT_H, SPOT, SNEAK, SNEAK_LEN, SNEAK_BEHIND, sneakAt, sneakOf, sneakWay, FAR_TRAIN, FATHER_FAR, HEIGHT, PEOPLE, NAMES, CAM,
  PANE, TRANSOM, film, kitchenWall, roomWall, tableEdge, teaGlass, rucksack };
