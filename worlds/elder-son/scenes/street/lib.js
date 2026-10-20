// “The Street”: where everything stands (metres: across to the right along the street, distance away from the near side),
// the people's marks, the shots, the film in beats (film(scene): the world's module `beats` plays it), the actions the
// mini-games ask for by key (knock, buckets; the run of “Running” — runAt/runWay). Shared by the paintings, the script and
// the showcase; the generator (tools/street/gen.mjs) writes scene.json from it.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const span = (v, a, b) => clamp((v - a) / (b - a), 0, 1);

// ── the place ──
// the far side: three houses with the five windows of “Windows”; the Sarafanovs'; Makarskaya. Each house a long log wall
// facing the street (its front at `d`), `w` wide, `deep` back; windows by x from the house's middle.
const SILL = 1.15;
const HOUSES = [
  { id: 'h1', a: -11, d: 14, w: 9, deep: 6, color: '#6f5844', windows: [{ x: -3, w: 1.0, h: 1.1, sill: SILL, pane: 'win1' }, { x: 3, w: 1.0, h: 1.1, sill: SILL, pane: 'win2' }] },
  { id: 'h2', a: 0.5, d: 14, w: 9.4, deep: 6, color: '#665443', windows: [{ x: -2.5, w: 1.0, h: 1.1, sill: SILL, pane: 'win3' }, { x: 3.5, w: 1.0, h: 1.1, sill: SILL, pane: 'win4' }] },
  // the neighbours' house nearest the Sarafanovs': its door (the two with buckets come out of it in IV)
  { id: 'h3', a: 10.5, d: 14, w: 7, deep: 6, color: '#735b47', windows: [{ x: -0.5, w: 1.0, h: 1.1, sill: SILL, pane: 'win5' }], door: { x: 2.3, w: 0.9, h: 1.95 } },
  // the Sarafanovs': the room's window (dark), the kitchen's (cut through: the kitchen is behind it), the door
  { id: 'sar', a: 21.5, d: 12, w: 10, deep: 7, color: '#6a5240', windows: [{ x: -2.9, w: 1.0, h: 1.1, sill: SILL, pane: 'sar_room' }, { x: 0.5, w: 1.2, h: 1.0, sill: 1.1 }], door: { x: 3.7, w: 0.9, h: 1.95 } },
  // Makarskaya: her window, her door (closed: its leaf is mak_door)
  { id: 'mak', a: 34.5, d: 13, w: 8, deep: 6, color: '#70573f', windows: [{ x: -2.5, w: 1.0, h: 1.1, sill: SILL, pane: 'mak_window' }, { x: 0.6, w: 1.0, h: 1.1, sill: SILL, pane: 'mak_room' }], door: { x: 2.4, w: 0.9, h: 1.95 } },
];
const PLINTH = 0.45;      // the floors inside are this high over the snow
const WALL_H = 2.5;       // the log walls over the plinth
const RISE = 2.1;         // the roofs' rise to the ridge
const winOf = id => {
  for (const h of HOUSES) for (const w of h.windows) if (w.pane === id) return { a: h.a + w.x, d: h.d, w: w.w, h: w.h, sill: w.sill };
  return null;
};
const KITCHEN_WIN = { a: 22.0, d: 12, w: 1.2, h: 1.0, sill: 1.1 };
const DOOR = { a: 25.2, d: 12, w: 0.9, h: 1.95 };
// inside the hall, left of the door: out of sight from the street (people come and go there, never pop up in view)
const INSIDE = [23.9, 12.85];
// in the hall right behind the door, seen through it once it opens
const HALL = [25.55, 13.0];
const THRESHOLD = [25.2, 12.45];
const MAK_DOOR = { a: 36.9, d: 13, w: 0.9, h: 1.95 };
const MAK_INSIDE = [35.9, 13.8];
const NB_DOOR = { a: 12.8, d: 14, w: 0.9, h: 1.95 };
// the kitchen behind its window: a 3 × 3 m room; the table under the lamp facing the window, the stove at the back wall
// (seen through the window from before it: what the street sees in it stands across 21…23)
const KITCHEN = { a0: 20.5, a1: 23.5, d0: 12, d1: 15 };
const TABLE = { a: 21.75, d: 13.65, w: 1.3, depth: 0.8 };
const LAMP = [21.75, 13.65, PLINTH + 1.85];
const STOVE = { a: 22.8, d: 14.95 };
// the porch before the door: a landing at the floor's height, its steps down to the snow
const PORCH = { a0: 24.4, a1: 26.0, d0: 10.95, d1: 12, steps: 10.2 };
// the front garden's fence before the Sarafanovs', its gate; the fence between the yards (its wicket by the street and
// one at the back, behind the shed); the near fence
const SAR_FENCE = { a: 15.6, d: 9.4, len: 8.2, gate: [4.0, 5.2] };
const GATE_LAMP = [19.3, 9.25];
const SIDE_FENCE = { a: 27.4, d: 9.6, len: 5, gates: [[0.6, 1.4], [2.8, 3.6]] };
const STREET_LAMP = [-5.3, 13.4];
const SHED = { a: 28.9, d: 11.2, w: 2.6, h: 2.4, deep: 2 };
// the barrel by the Sarafanovs' fence, at its right end (four metres of snow from the shed: “Buckets”)
const BARREL = [23.2, 8.85];
const BENCH = [21.9, 11.55];
const WOODPILE = [34.0, 12.45];
// the run of “Running”: from the Sarafanovs' gate along the street to the path up to the platform (≈ 65 m)
const RUN = [[20.3, 8.35], [16.0, 6.2], [-34.0, 5.6], [-44.6, 7.4]];
// the camera beside him as he runs: on the near side, this far right of him at the gate, ahead of him (left) once he
// is under way — room before him the way he runs
const RUN_CAM = { z: 1.4, off0: 2.2, off1: -1.4, settle: 0.1 };
const RUN_LEN = (() => { let l = 0; for (let i = 1; i < RUN.length; i++) l += Math.hypot(RUN[i][0] - RUN[i - 1][0], RUN[i][1] - RUN[i - 1][1]); return l; })();
// the point of the run at u (0…1)
function runPoint(u) {
  let left = clamp(u, 0, 1) * RUN_LEN;
  for (let i = 1; i < RUN.length; i++) {
    const p = RUN[i - 1], q = RUN[i], l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (left <= l || i === RUN.length - 1) { const k = clamp(left / l, 0, 1); return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; }
    left -= l;
  }
  return RUN[RUN.length - 1];
}
// where along the run (0…1) a point is
function runAt(a, d) {
  let best = Infinity, at = 0, done = 0;
  for (let i = 1; i < RUN.length; i++) {
    const p = RUN[i - 1], q = RUN[i], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz);
    const k = clamp(((a - p[0]) * dx + (d - p[1]) * dz) / (l * l), 0, 1);
    const dd = Math.hypot(p[0] + dx * k - a, p[1] + dz * k - d);
    if (dd < best) { best = dd; at = (done + k * l) / RUN_LEN; }
    done += l;
  }
  return at;
}
// the run's way from u0 to its end: the bends after u0, then the end
function runWay(u0) {
  const pts = [];
  let done = 0;
  for (let i = 1; i < RUN.length - 1; i++) {
    done += Math.hypot(RUN[i][0] - RUN[i - 1][0], RUN[i][1] - RUN[i - 1][1]);
    if (done / RUN_LEN > u0 + 1e-4) pts.push(RUN[i]);
  }
  pts.push(RUN[RUN.length - 1]);
  return pts;
}

// ── the people's marks ──
const SPOT = {
  // “Windows”: in the street before the windows, under the street lamp's light
  windows: { busygin: [-2.5, 9.3], silva: [-1.5, 10.4] },
  // the hiding place: in front of the shed by Makarskaya's fence — her window ahead on the right, the Sarafanovs' door
  // back on the left
  corner: { busygin: [29.3, 8.3], silva: [30.0, 9.1] },
  // the porch: Silva up on the landing, left of the door; Busygin below it, left of the steps
  porch: { busygin: [24.0, 10.25], silva: [24.75, 11.5], vasenka: [25.2, 12.35] },
  // Sarafanov at Makarskaya's window (right of it, turned to the glass); under his own kitchen window
  mak: [32.7, 12.35],
  under: [20.5, 10.8],
  // the gate: Nina and Kudimov under its lamp, face to face
  gate: { nina: [19.55, 8.55], kudimov: [20.45, 8.6] },
  // “Buckets”: at the barrel (filling), before the shed (throwing); the neighbours' throwing places
  barrel: [24.0, 8.55],
  throw: [29.0, 9.75],
  nb1: [27.75, 9.6], nb2: [30.25, 9.55],
  // after the fire: the half-ring before the shed; Vasenka aside in the open wicket of the fence between the yards,
  // Busygin by the fence near him; where Busygin steps to take the blame, where Silva comes at him; where the boy owns
  // up to Makarskaya (Busygin behind him)
  ring: { makarskaya: [30.3, 9.5], silva: [31.3, 8.7], neighbor1: [28.1, 9.8], neighbor2: [32.2, 9.9] },
  aside: { vasenka: [26.9, 10.4], busygin: [25.8, 9.4] },
  blame: { busygin: [27.3, 9.1], silva: [29.9, 8.85] },
  own: { vasenka: [29.4, 9.6], busygin: [28.6, 9.95], beside: [27.05, 10.95] },
  // the bench under the kitchen window: Busygin (left as seen from the street), Nina (right, under the window)
  bench: { busygin: [21.45, 11.6], nina: [22.35, 11.6] },
};
const BENCH_Y = 0.47;
// before a window of “Windows”, close enough to knock
const knockSpot = n => { const w = winOf(`win${n}`); return [w.a + 0.05, w.d - 0.6]; };
// the kitchen's places (across, distance, turn): at the table — its far side (facing the window), its ends; at the
// stove (facing it); at the window (facing the glass)
const K = {
  far_l: [21.45, 14.2, 180], far_r: [22.1, 14.2, 180], end_w: [20.95, 13.6, 90], end_e: [22.5, 13.55, 270],
  stove: [22.8, 14.5, 0], window: [21.85, 12.45, 180],
};

// the camera's shots: {camera_x, camera_z, camera_yaw, camera_h} (no target: the scene's camera put there)
const cam = (x, z, yaw, h = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h });
const CAM = {
  // down the bank from the platform's path, turning with them as they come
  bank: cam(-37.2, 1.4, -48, 0.2),
  // along the street beside them
  street0: cam(-11.0, 1.2, -4, 0),
  street1: cam(-5.5, 2.4, 2, 0),
  // the side medium at the stop: from up the street, the two in three quarters, the street lamp's light on them
  stop: cam(-6.2, 8.1, 68, -0.15),
  wide: cam(-2.1, -7.2, 0, 0.3),
  last0: cam(4, -0.5, 4),
  last1: cam(24.0, 1.5, 6),
  // the corner from the near side, right: the two in profile toward her window, the kitchen window on the left, hers on
  // the right
  corner: cam(34.5, 5.3, -40, -0.1),
  // the same corner from just behind them: first toward the Sarafanovs' door, then to her window
  behind: cam(29.55, 6.85, -34, 0.25),
  behind_win: cam(29.55, 6.85, 20, 0.25),
  porch: cam(28.1, 9.4, -72, -0.1),
  dark: cam(20.6, 7.4, 34, -0.1),
  // before the kitchen window: the room behind it seen through the glass
  window: cam(21.95, 6.3, 3, 0),
  under: cam(21.6, 6.2, -2, -0.1),
  gate: cam(20.0, 4.6, 0, -0.1),
  ev1: cam(-2, -7, 0, 1),
  ev2: cam(29.5, -10, 0, 0.6),
  ev3: cam(26.6, 9.0, -30, -0.1),
  fire: cam(28.5, -1.0, -2, 0.4),
  ring: cam(28.6, 3.6, 4, 0.1),
  // the boy close, from before the shed: its smouldering glow on his face
  vas: cam(29.2, 11.0, 255, -0.15),
  choose: cam(28.4, 3.4, 0, 0.1),
  blame: cam(24.9, 7.0, 55, -0.1),
  own: cam(29.85, 6.5, 0, -0.2),
  own_porch: cam(29.85, 6.5, -28, -0.2),
  bench: cam(20.0, 9.2, 40, -0.35),
  bench_near: cam(20.85, 10.05, 42, -0.5),
  run: cam(RUN[0][0] + RUN_CAM.off0, RUN_CAM.z, 0, -0.1),
  night0: cam(-12, 2.0, 66, 0.4),
  night1: cam(21.6, -0.6, 1.5, 0.4),
};
// the camera's keys of a shot moved there together, over seconds
const CAM_KEYS = ['camera_x', 'camera_z', 'camera_yaw', 'camera_h'];
const camTo = (s, to, over, ease = 'inOut') => s.all(...CAM_KEYS.filter(k => to[k] != null).map(k => s.move(k, to[k], { over, ease })));
// the camera along with a walk, as long as the walk takes (it knows its length a moment after it sets off)
async function follow(s, walk, to) {
  await s.wait(0.1);
  return camTo(s, to, Math.max(1, walk.remaining || walk.duration || 1), 'linear');
}

// a look of the cast (people.md: `<id>_wear` takes the look's object, not its name)
const LOOK = name => (kit && kit.cast && kit.cast.characters && kit.cast.characters[name]) || null;

// ── the beats' values ──
const PEOPLE = ['busygin', 'silva', 'sarafanov', 'vasenka', 'nina', 'kudimov', 'makarskaya', 'neighbor1', 'neighbor2', 'k1', 'k2', 'k3', 'k4'];
// everyone away, as they are by default; the place's things shut and out
function base(hour, snow) {
  const v = {};
  for (const p of PEOPLE) Object.assign(v, { [`${p}_here`]: false, [`${p}_do`]: 'stand', [`${p}_look`]: null, [`${p}_reach`]: null, [`${p}_with`]: null, [`${p}_wear`]: null, [`${p}_gait`]: null, [`${p}_on`]: null, [`${p}_mood`]: null });
  return Object.assign(v, {
    hour, snow, win1: 0, win2: 0, win3: 0, win4: 0, win5: 0, mak_window: 0,
    door: 0, mak_door: 0, nb_door: 0, porch_light: 0, fire: 0, steam: 0, shed_burnt: 0, silva_smoke: 0, shawl: 0,
  });
}
// someone here, at [across, distance], turned
const AT = (id, p, turn, more = {}) => ({ [`${id}_here`]: true, [`${id}_a`]: p[0], [`${id}_d`]: p[1], ...(turn == null ? {} : { [`${id}_turn`]: turn }), ...more });
const WIN_ON = { win1: 1, win2: 1, win3: 1, win4: 1, win5: 1 };
// someone in the kitchen at one of its places (K): sitting, standing, or warming the hands at the stove
const KAT = (id, place, look, how = 'sit') => AT(id, place, place[2], { [`${id}_wear`]: LOOK(look),
  [`${id}_do`]: how === 'sit' ? { motion: 'seated', loop: true } : how === 'warm' ? { motion: 'warm_hands', loop: true } : 'stand' });
// the kitchen of the first night: Silva and Vasenka at the table, Busygin at the stove
const FIRST_NIGHT = () => ({ ...KAT('k1', K.far_r, 'silva'), ...KAT('k2', K.stove, 'busygin', 'warm'), ...KAT('k3', K.far_l, 'vasenka') });
// the kitchen of the second night: Sarafanov, Nina, Kudimov, Busygin at the table
const SECOND_NIGHT = () => ({ ...KAT('k1', K.far_r, 'sarafanov_home'), ...KAT('k2', K.far_l, 'nina_home'), ...KAT('k3', K.end_e, 'kudimov_in'), ...KAT('k4', K.end_w, 'busygin_shirt') });

// the beginnings (`from`) — functions of the play's keys, read through the scene (`sc.get`)
const FROM = {
  walk: () => ({ ...base(0.9, 0.35), ...CAM.bank, ...WIN_ON,
    ...AT('busygin', [-45.2, 7.6], 100), ...AT('silva', [-46.4, 8.3], 100) }),
  last_window: () => ({ ...base(0.92, 0.7), ...CAM.last0, mak_window: 1,
    ...AT('busygin', [5.4, 5.1], 90), ...AT('silva', [6.6, 5.9], 90) }),
  neighbor: () => ({ ...base(0.92, 0.7), ...CAM.behind, mak_window: 1,
    ...AT('busygin', SPOT.corner.busygin, 330, { busygin_look: [DOOR.a, DOOR.d, 1.4] }), ...AT('silva', SPOT.corner.silva, 335, { silva_look: [DOOR.a, DOOR.d, 1.4] }) }),
  return: () => ({ ...base(0.94, 0.6), ...CAM.under, ...FIRST_NIGHT(),
    ...AT('sarafanov', [11.5, 7.2], 90, { sarafanov_mood: 'sad' }) }),
  gate: () => ({ ...base(0.95, 0.25), ...CAM.gate,
    ...AT('nina', SPOT.gate.nina, 90, { nina_mood: 'tired', nina_look: 'kudimov' }), ...AT('kudimov', SPOT.gate.kudimov, 270, { kudimov_mood: 'neutral', kudimov_look: 'nina' }) }),
  // the second night: the neighbours' windows lit but where he knocked in I (they sleep); the kitchen full
  evening: sc => {
    const knocked = String(sc.get('knocked') ?? '');
    const wins = {};
    for (let n = 1; n <= 5; n++) wins[`win${n}`] = knocked.includes(String(n)) ? 0 : 1;
    return { ...base(0.9, 0), ...CAM.ev1, ...wins, mak_window: 1, ...SECOND_NIGHT(),
      ...AT('vasenka', [24.85, 11.45], 82, { vasenka_mood: 'sad', vasenka_look: [MAK_DOOR.a, MAK_DOOR.d, 1.5] }) };
  },
  // the fire put out: the shed by `shed_left` (its painting), steam; the people in a half-ring; Vasenka aside
  // (the shed still smoulders a little: its glow on those near it)
  after_fire: () => ({ ...base(0.9, 0), ...CAM.ring, fire: 0.1, steam: 1, shed_burnt: 1, mak_window: 1, door: 1, porch_light: 1,
    ...KAT('k1', K.far_r, 'sarafanov_home'), ...KAT('k2', K.far_l, 'nina_home'), ...KAT('k3', K.end_e, 'kudimov_in'),
    ...AT('makarskaya', SPOT.ring.makarskaya, 330, { makarskaya_look: 'shed', makarskaya_mood: 'sad' }),
    ...AT('silva', SPOT.ring.silva, 320, { silva_wear: LOOK('silva_burnt'), silva_mood: 'angry', silva_look: 'shed' }),
    ...AT('neighbor1', SPOT.ring.neighbor1, 30, { neighbor1_look: 'shed' }), ...AT('neighbor2', SPOT.ring.neighbor2, 300, { neighbor2_look: 'shed' }),
    ...AT('busygin', SPOT.aside.busygin, 60, { busygin_wear: LOOK('busygin_shirt'), busygin_look: 'shed' }),
    ...AT('vasenka', SPOT.aside.vasenka, 110, { vasenka_with: ['matches'], vasenka_mood: 'afraid', vasenka_look: 'shed' }) }),
  // the third night, the bench under the kitchen window; Nina on it in her shawl
  porch_night: sc => ({ ...base(0.95, 0.5), ...CAM.bench, porch_light: 1,
    ...AT('nina', SPOT.bench.nina, 180, { nina_wear: LOOK('nina_home'), nina_with: ['shawl'], nina_on: [SPOT.bench.nina[0], SPOT.bench.nina[1], BENCH_Y], nina_do: { motion: 'seated', loop: true },
      nina_mood: sc.get('nina_is') === 'knows' ? 'sad' : 'thinking' }) }),
  run_out: sc => ({ ...base(0.95, 0.4), ...CAM.run, porch_light: 1, run: 0, run_at: 0, look_back: 0,
    ...AT('busygin', THRESHOLD, 180, { busygin_here: false }),
    ...(Number(sc.get('silva_door') ?? 1) ? AT('silva', THRESHOLD, 180, { silva_here: false }) : {}) }),
  // the epilogue: the street from far off, toward the kitchen window; who is in it by the ending
  night_window: sc => {
    const ending = sc.get('ending') ?? 'late', ninaEnd = sc.get('nina_end') ?? 'gone', ninaFor = Number(sc.get('nina_for') ?? 0);
    const v = { ...base(0.95, 0.6), ...CAM.night0 };
    if (ending === 'anyway') Object.assign(v, KAT('k1', K.end_w, 'sarafanov_home'), KAT('k4', K.end_e, 'busygin_shirt'));
    else if (ending === 'late') Object.assign(v, KAT('k1', K.far_r, 'sarafanov_home'), KAT('k4', K.end_e, 'busygin_shirt'));
    else Object.assign(v, KAT('k1', K.far_r, 'sarafanov_home'));
    if (ninaEnd === 'home') {
      if ((ending === 'saturday' || ending === 'suitcase') && ninaFor) Object.assign(v, KAT('k2', K.window, 'nina_home', 'stand'));
      else Object.assign(v, KAT('k2', K.far_l, 'nina_home'));
    }
    return v;
  },
};
// the ends of beats that others go on from (what a beat after them cuts to when it does not follow them)
const END = {
  walk: () => ({ ...FROM.walk(), ...CAM.stop,
    ...AT('busygin', SPOT.windows.busygin, 318, { busygin_look: 'win2', busygin_mood: 'tired' }),
    ...AT('silva', SPOT.windows.silva, 300, { silva_look: 'street_lamp', silva_mood: 'smile' }) }),
  neighbor: () => ({ ...FROM.neighbor(), mak_window: 0,
    ...AT('busygin', SPOT.corner.busygin, 330, { busygin_look: null }), ...AT('silva', SPOT.corner.silva, 335, { silva_look: [DOOR.a, DOOR.d, 1.4] }) }),
  porch: () => ({ ...FROM.neighbor(), ...CAM.porch, mak_window: 0, door: 1, porch_light: 1,
    ...AT('vasenka', SPOT.porch.vasenka, 180, { vasenka_look: 'silva', vasenka_mood: 'neutral' }),
    ...AT('busygin', SPOT.porch.busygin, 25, { busygin_look: 'vasenka', busygin_mood: 'thinking' }),
    ...AT('silva', SPOT.porch.silva, 50, { silva_look: 'vasenka', silva_mood: 'smile' }) }),
  after_fire: () => ({ ...FROM.after_fire(), ...CAM.choose, steam: 0.6,
    ...AT('silva', SPOT.ring.silva, 250, { silva_wear: LOOK('silva_burnt'), silva_mood: 'angry', silva_look: null }),
    ...AT('makarskaya', SPOT.ring.makarskaya, 330, { makarskaya_look: 'silva', makarskaya_mood: 'sad' }),
    ...AT('vasenka', SPOT.aside.vasenka, 110, { vasenka_with: ['matches'], vasenka_mood: 'afraid', vasenka_look: 'shed' }) }),
  porch_night: sc => ({ ...FROM.porch_night(sc), ...CAM.bench,
    ...AT('busygin', SPOT.bench.busygin, 180, { busygin_wear: LOOK('busygin_shirt'), busygin_with: ['coat_arm'], busygin_on: [SPOT.bench.busygin[0], SPOT.bench.busygin[1], BENCH_Y], busygin_do: { motion: 'seated', loop: true }, busygin_mood: 'tired', busygin_look: 'nina' }) }),
};
END.knock_ready = () => ({ ...END.walk(), ...CAM.wide });
// the second night's end: Vasenka alone on the dark porch, close; Makarskaya's door shut on the two
END.evening = sc => ({ ...FROM.evening(sc), ...CAM.ev3 });
// the fire's opening: later the same night, the yard from the street (Vasenka gone from the porch)
const FIRE_OPEN = sc => ({ ...END.evening(sc), ...CAM.fire, vasenka_here: false, vasenka_mood: null, vasenka_look: null });
END.shawl = sc => END.porch_night(sc);

// ── the film: film(scene) → { <name>: { from, after, run } } (modules/beats.md) ──
function film(scene) {
  const F = name => () => FROM[name](scene), E = name => () => END[name](scene);
  // the neighbours' buckets during “Buckets” (a sequence of its own, stopped when the beat after begins)
  let crowd = null;
  const stopCrowd = () => { if (crowd) { crowd.cancel(); crowd = null; } };
  // someone put somewhere at once (out of sight: a hall, behind a shed)
  const put = (s, id, p, turn) => { s.set(`${id}_a`, p[0]); s.set(`${id}_d`, p[1]); if (turn != null) s.set(`${id}_turn`, turn); };

  return {
    // night, snow; down the bank from the platform's path to the street; along it to the five lit windows; the stop
    // under the street lamp, looking round the street — the side medium, their faces in the lamp's light
    walk: { from: F('walk'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva');
      const street = s.shot({ ...CAM.street0, ...AT('busygin', [-12.6, 6.2], 90), ...AT('silva', [-13.6, 7.0], 90) });
      const bw0 = bus.walk([[-41.0, 7.0], [-36.4, 6.3]]);
      await s.wait(0.4);
      const sw0 = sil.walk([[-42.0, 7.6], [-37.6, 7.0]]);
      await camTo(s, { camera_yaw: -6 }, 6.2);
      await s.all(bw0, sw0);
      street.cut();
      const side = s.shot({ ...CAM.stop });
      const sw = sil.walk([[-6.0, 7.6], SPOT.windows.silva]);
      const bw = bus.walk([[-6.5, 6.6], SPOT.windows.busygin]);
      await follow(s, bw, CAM.street1);
      await s.all(bw, sw);
      side.cut();
      bus.mood('tired');
      sil.mood('smile');
      await s.all(bus.turn(318), sil.turn(300));
      bus.look('win2');
      sil.look('street_lamp');
      s.tell('walk:stop');
      await s.wait(2.4);
    } },
    // the camera draws back to the near fence: the five windows, the two small in the middle of the street
    knock_ready: { after: 'walk', from: E('knock_ready'), run: async s => {
      s.cut({ ...CAM.wide });
      await s.wait(2.2);
    } },
    // the windows dark, the snow thicker; along the street to the corner by Makarskaya's fence, before the shed; the
    // side: both in profile toward her lit window, the kitchen window behind them on the left
    last_window: { from: F('last_window'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva');
      const side = s.shot({ ...CAM.corner });
      const bw = bus.walk([[16, 6.2], [26.0, 7.2], SPOT.corner.busygin]);
      await s.wait(0.3);
      const sw = sil.walk([[17.6, 6.6], [27.0, 7.0], SPOT.corner.silva]);
      await follow(s, bw, CAM.last1);
      await s.all(bw, sw);
      side.cut();
      await s.all(bus.turn(38), sil.turn(30));
      bus.look('mak_window');
      sil.look('mak_window');
      bus.mood('tired');
      sil.mood('thinking');
      s.tell('last_window:corner');
      await s.wait(3.5);
    } },
    // from just behind them: Sarafanov comes out, the camera turning with him to her window; he knocks, is answered
    // (“Forgive me”), goes back past them toward his gate; Vasenka slips out from behind the shed into the house
    neighbor: { from: F('neighbor'), run: async s => {
      const sar = s.person('sarafanov'), vas = s.person('vasenka'), bus = s.person('busygin'), sil = s.person('silva');
      // (in the hall behind the door, as it opens)
      put(s, 'sarafanov', HALL, 200);
      sar.wear(null);
      sar.mood('sad');
      sar.here(true);
      const open = s.move('door', 1, { over: 1.0, ease: 'out' });
      await s.wait(0.5);
      bus.look('sarafanov');
      sil.look('sarafanov');
      const there = sar.walk([THRESHOLD, [DOOR.a, 11.2], [DOOR.a, 10.05], [26.7, 10.4], [27.4, 10.6], [28.4, 10.75], [30.5, 10.85], [31.9, 11.6], SPOT.mak]);
      await open;
      await s.wait(1.2);
      s.move('door', 0, { over: 1.4 });
      await follow(s, there, CAM.behind_win);
      await there;
      await sar.turn(318);
      sar.look('mak_window');
      const knock = sar.do('knock');
      await s.wait(0.6);
      s.tell('neighbor:knock');
      await knock;
      await s.wait(0.2);
      s.set('mak_window', 2);
      s.tell('neighbor:answer');
      // L09, L10 (≈ 7 s): “Forgive me, for heaven's sake” — a guilty smile
      await s.wait(2.4);
      sar.mood('smile');
      await s.wait(4.0);
      s.set('mak_window', 0);
      sar.mood('sad');
      await s.wait(0.8);
      sar.look(null);
      // back along the shed, two metres before the two, not turning his head; through the wicket into his garden and on
      const away = sar.walk([[31.9, 11.6], [30.5, 10.85], [28.4, 10.75], [27.4, 10.6], [26.4, 10.25], [24.2, 10.0], [21.6, 9.9], [20.2, 9.3], [19.0, 7.6], [12.0, 6.6]]);
      await s.wait(2.6);
      s.tell('neighbor:gone');
      bus.look(null);
      sil.look([DOOR.a, DOOR.d, 1.4]);
      // the camera back to the door; from behind the shed through the back wicket, Vasenka, home behind his father's back
      camTo(s, CAM.behind, 3.2);
      await s.wait(1.0);
      put(s, 'vasenka', [27.9, 13.6], 270);
      vas.mood('afraid');
      vas.look(null);
      vas.here(true);
      bus.look('vasenka');
      sil.look('vasenka');
      await vas.walk([[27.4, 12.85], [26.8, 11.2], [25.6, 10.2], [DOOR.a, 10.6], [DOOR.a, 11.4]]);
      // (he is out of the garden by now, out of sight: gone along the street)
      away.cancel();
      sar.here(false);
      // the door: he goes in (the porch's beat sees him in)
      s.move('door', 1, { over: 0.8, ease: 'out' });
      vas.walk([THRESHOLD, INSIDE]);
      s.tell('neighbor:vasya');
      await s.wait(0.5);
    } },
    // to the porch (L11, L12 on the way); Silva knocks; the door opens, Vasenka against the light; the camera at
    // the porch's side, the two in three quarters; the pose for the choice: Vasenka and the kitchen window
    porch: { after: 'neighbor', from: E('neighbor'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
      // (Vasenka going in after the neighbour's beat: in, the door shut behind him)
      if (s.get('vasenka_here')) (async () => { await vas.walk([THRESHOLD, INSIDE]); vas.here(false); s.move('door', 0, { over: 1.0 }); })();
      bus.look(null);
      sil.look(null);
      const go = s.all(
        sil.walk([[28.2, 9.1], [26.6, 9.3], [DOOR.a, 9.8], [DOOR.a, 10.9], SPOT.porch.silva]),
        (async () => { await s.wait(0.6); await bus.walk([[28.0, 8.9], [26.2, 9.2], SPOT.porch.busygin]); })(),
      );
      await s.wait(1.4);
      camTo(s, CAM.porch, 6.5);
      await go;
      await s.all(sil.turn(50), bus.turn(25));
      bus.look([DOOR.a, DOOR.d, 1.6]);
      bus.mood('thinking');
      sil.mood('smile');
      const knock = sil.do('knock');
      await s.wait(0.6);
      s.tell('porch:knock');
      await knock;
      await s.wait(1.2);
      // behind the shut door, at the threshold: he is there when it opens
      put(s, 'vasenka', SPOT.porch.vasenka, 180);
      vas.mood('neutral');
      vas.here(true);
      s.set('porch_light', 1);
      await s.move('door', 1, { over: 1.0, ease: 'out' });
      s.tell('porch:open');
      vas.look('silva');
      sil.look('vasenka');
      bus.look('vasenka');
      await s.wait(2.6);
    } },
    // “This isn't a hotel”: he steps back, the door shuts, the porch light goes out; the two in the dark under the
    // gate lamp's light, Busygin hugging himself; Silva knocks again; the light, the door
    shut: { after: 'porch', from: E('porch'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
      const dark = s.shot({ ...CAM.dark });
      await s.wait(2.2);
      await vas.walk([THRESHOLD, INSIDE]);
      vas.here(false);
      await s.move('door', 0, { over: 0.7, ease: 'in' });
      s.set('porch_light', 0);
      s.tell('shut:closed');
      dark.cut();
      // turned from the door, toward the gate's lamp: their faces in its light
      await s.all(bus.turn(235), sil.turn(215));
      bus.look('silva');
      sil.look('busygin');
      bus.mood('sad');
      sil.mood('smile');
      bus.do('cold', { loop: true });
      await s.wait(4.0);
      const side = s.shot({ ...CAM.porch });
      bus.do('stand');
      sil.look([DOOR.a, DOOR.d, 1.6]);
      await sil.turn(50);
      side.cut();
      bus.turn(25);
      bus.look([DOOR.a, DOOR.d, 1.6]);
      const knock = sil.do('knock');
      await s.wait(0.6);
      s.tell('shut:knock');
      await knock;
      await s.wait(1.0);
      s.set('porch_light', 1);
      put(s, 'vasenka', SPOT.porch.vasenka, 180);
      vas.here(true);
      bus.look('vasenka');
      await s.move('door', 1, { over: 1.0, ease: 'out' });
      vas.look('silva');
      s.tell('shut:again');
      await s.wait(1.6);
    } },
    // in: Vasenka goes back inside, they after him; the door shuts; the camera to the kitchen window: in it the three
    // come to their places
    in: { after: ['porch', 'shut'], from: E('porch'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
      vas.look(null);
      await vas.walk([THRESHOLD, INSIDE]);
      vas.here(false);
      await sil.walk([[DOOR.a, 11.95], THRESHOLD, INSIDE]);
      sil.here(false);
      const toWin = camTo(s, CAM.window, 4.5);
      await bus.walk([[DOOR.a, 10.1], [DOOR.a, 11.0], THRESHOLD, INSIDE]);
      bus.here(false);
      s.move('door', 0, { over: 0.9 });
      s.set('porch_light', 0, 0.9);
      const k1 = s.person('k1'), k2 = s.person('k2'), k3 = s.person('k3');
      // in from the hall at the kitchen's right wall
      for (const [id, look, p] of [['k1', 'silva', [23.3, 13.9]], ['k2', 'busygin', [23.3, 14.0]], ['k3', 'vasenka', [23.3, 14.1]]]) {
        put(s, id, p, 270);
        s.set(`${id}_wear`, LOOK(look));
        s.set(`${id}_do`, 'stand');
      }
      k3.here(true);
      await s.all(
        toWin,
        (async () => { await k3.walk([[22.6, 14.0], [21.8, 14.2], K.far_l]); await k3.turn(K.far_l[2]); await k3.do('sit_down'); k3.do('seated', { loop: true }); })(),
        (async () => { await s.wait(0.8); k1.here(true); await k1.walk([[22.6, 14.0], K.far_r]); await k1.turn(K.far_r[2]); await k1.do('sit_down'); k1.do('seated', { loop: true }); })(),
        (async () => { await s.wait(1.6); k2.here(true); await k2.walk([K.stove]); await k2.turn(K.stove[2]); k2.do('warm_hands', { loop: true }); })(),
      );
      s.tell('in:inside');
    } },
    // later, snow: Sarafanov comes back along the street and stops under his own window — strangers at his table; his
    // back to us (he looks at them); he stands; to the porch, the door
    return: { from: F('return'), run: async s => {
      const sar = s.person('sarafanov');
      await sar.walk([[17.5, 8.0], [19.6, 8.3], [20.2, 9.4], [20.2, 10.2], SPOT.under]);
      await sar.turn(51);
      sar.look('kitchen');
      s.tell('return:window');
      await s.wait(4);
      sar.look(null);
      const walk = sar.walk([[22.6, 10.25], [DOOR.a, 10.1], [DOOR.a, 11.4]]);
      await s.wait(0.8);
      camTo(s, { camera_x: 22.2, camera_yaw: 22 }, 3.5);
      await walk;
      await sar.turn(0);
      await s.move('door', 1, { over: 1.1, ease: 'out' });
      s.tell('return:door');
    } },
    // the late night at the gate: Nina and Kudimov under its lamp in profile; his watch; he goes off left, she to the porch
    gate: { from: F('gate'), run: async s => {
      const nina = s.person('nina'), kud = s.person('kudimov');
      await s.wait(1.2);
      kud.look(null);
      const watch = kud.do('look_watch');
      await s.wait(1.0);
      s.tell('gate:watch');
      await watch;
      kud.do('stand');
      kud.look('nina');
      // L26, L27
      await s.wait(4.2);
      kud.look(null);
      kud.gait('march_walk');
      const go = kud.walk([[18.0, 7.0], [8.0, 6.4], [2.0, 6.4]]);
      await s.wait(1.0);
      nina.look('kudimov');
      await s.wait(1.2);
      nina.look(null);
      const home = nina.walk([[20.2, 8.9], [20.2, 10.0], [22.6, 10.3], [DOOR.a, 10.0], [DOOR.a, 11.4]]);
      await s.wait(2.2);
      s.tell('gate:gone');
      go.cancel();
      kud.here(false);
      kud.gait(null);
      await home;
      await nina.turn(0);
      await s.move('door', 1, { over: 1.0, ease: 'out' });
      await nina.walk([THRESHOLD, INSIDE]);
      nina.here(false);
      s.move('door', 0, { over: 1.0 });
    } },
    // the second night, three shots: the street from the windows; Silva to Makarskaya's door, Vasenka on the dark
    // porch; Vasenka close, her door shutting off the frame
    evening: { from: F('evening'), run: async s => {
      const sil = s.person('silva'), vas = s.person('vasenka'), mak = s.person('makarskaya');
      const two = s.shot({ ...CAM.ev2 });
      await s.wait(4);
      two.cut();
      const three = s.shot({ ...CAM.ev3 });
      put(s, 'silva', THRESHOLD, 180);
      sil.wear(null);
      sil.mood('smile');
      const open = s.move('door', 1, { over: 0.9, ease: 'out' });
      await s.wait(0.4);
      sil.here(true);
      vas.look('silva');
      const there = sil.walk([[DOOR.a, 11.3], [DOOR.a, 10.1], [27.4, 10.6], [30.5, 10.9], [35.4, 12.0], [MAK_DOOR.a, 12.35]]);
      await open;
      s.move('door', 0, { over: 1.0 });
      await s.wait(1.6);
      vas.look('silva');
      await there;
      vas.look([MAK_DOOR.a, MAK_DOOR.d, 1.5]);
      await sil.turn(0);
      const knock = sil.do('knock');
      await s.wait(1.6);
      put(s, 'makarskaya', [MAK_DOOR.a, 13.4], 180);
      mak.wear(null);
      mak.mood('neutral');
      mak.here(true);
      await s.move('mak_door', 1, { over: 0.9, ease: 'out' });
      await knock;
      await s.wait(0.6);
      await mak.walk([[MAK_DOOR.a, 13.6], MAK_INSIDE]);
      mak.here(false);
      await sil.walk([[MAK_DOOR.a, 13.0], [MAK_DOOR.a, 13.6], MAK_INSIDE]);
      sil.here(false);
      three.cut();
      vas.mood('sad');
      await s.move('mak_door', 0, { over: 0.8, ease: 'in' });
      s.tell('evening:in');
      await s.wait(3);
    } },
    // later: the shed's window orange, smoke; Makarskaya runs out — the cry; Silva with his smoking sleeve; the
    // neighbours with buckets; Busygin leaves the table and runs to the barrel. The pose for “Buckets”
    fire: { after: 'evening', from: () => FIRE_OPEN(scene), run: async s => {
      stopCrowd();
      const mak = s.person('makarskaya'), sil = s.person('silva'), bus = s.person('busygin'), n1 = s.person('neighbor1'), n2 = s.person('neighbor2');
      // (after the evening: time has passed — Vasenka gone from the porch, the kitchen as it was)
      if (s.get('vasenka_here')) s.cut(FIRE_OPEN(scene));
      await s.move('fire', 0.6, { over: 3, ease: 'in' });
      put(s, 'makarskaya', [MAK_DOOR.a, 13.4], 180);
      mak.mood('afraid');
      mak.here(true);
      await s.move('mak_door', 1, { over: 0.6, ease: 'out' });
      const mrun = mak.walk([[35.4, 11.9], [31.6, 10.7], [30.9, 9.3]], { gait: 'run' });
      await s.wait(0.6);
      s.tell('fire:cry');
      put(s, 'silva', [MAK_DOOR.a, 13.4], 180);
      sil.wear(LOOK('silva_burnt'));
      sil.mood('afraid');
      s.set('silva_smoke', 1);
      sil.here(true);
      sil.reach({ r: 'silva#hand_l' });
      const srun = sil.walk([[35.6, 11.8], [32.6, 10.0], SPOT.ring.silva], { gait: 'run' });
      await s.wait(0.8);
      // the neighbours' door; the two with buckets
      await s.move('nb_door', 1, { over: 0.6, ease: 'out' });
      for (const [id, k] of [['neighbor1', 0], ['neighbor2', 1]]) { put(s, id, [NB_DOOR.a - 0.2 + k * 0.4, 14.6], 180); s.set(`${id}_with`, ['bucket']); s.set(`${id}_mood`, 'afraid'); }
      n1.here(true);
      const w1 = n1.walk([[NB_DOOR.a, 13.2], [17.0, 7.6], [24.5, 7.4], SPOT.nb1], { gait: 'run' });
      await s.wait(0.7);
      n2.here(true);
      const w2 = n2.walk([[NB_DOOR.a + 0.3, 13.2], [17.5, 7.0], [26.0, 7.2], SPOT.nb2], { gait: 'run' });
      s.move('nb_door', 0, { over: 1.5 });
      // Busygin leaves the table, out of the door, to the barrel
      s.person('k4').here(false);
      await s.wait(0.8);
      put(s, 'busygin', INSIDE, 90);
      bus.wear(LOOK('busygin_shirt'));
      bus.mood('afraid');
      bus.with(null);
      await s.move('door', 1, { over: 0.5, ease: 'out' });
      bus.here(true);
      await bus.walk([THRESHOLD, [DOOR.a, 11.3], [DOOR.a, 9.9], SPOT.barrel], { gait: 'run' });
      bus.gait(null);
      s.move('door', 0.3, { over: 1.2 });
      await s.all(mrun, srun, w1, w2);
      for (const p of [mak, sil, n1, n2]) p.gait(null);
      await s.all(bus.turn(270), mak.turn(20), sil.turn(10), n1.turn(25), n2.turn(340));
      bus.look('barrel');
      n1.look('shed'); n2.look('shed'); mak.look('shed'); sil.look('shed');
      s.move('silva_smoke', 0, { over: 30 });
      s.tell('fire:ready');
      // the neighbours throw by themselves as long as it burns
      crowd = scene.sequence(async c => { await neighbours(c); }, { name: 'crowd' });
    } },
    // the fire out: steam; the half-ring before the shed (Silva turns round on them: who?); Vasenka aside, the
    // matchbox in his fist — close, in the smouldering shed's glow; the pose for the choice: Vasenka and Makarskaya
    after_fire: { from: F('after_fire'), run: async s => {
      stopCrowd();
      const sil = s.person('silva'), vas = s.person('vasenka'), mak = s.person('makarskaya');
      s.move('steam', 0.6, { over: 8 });
      await s.wait(1.4);
      sil.look(null);
      await sil.turn(250);
      sil.look('neighbor1');
      s.tell('after_fire:who');
      // L84
      const close = s.shot({ ...CAM.vas });
      await s.wait(2.4);
      close.cut();
      vas.look('silva');
      await s.wait(3.4);
      const back = s.shot({ ...CAM.choose });
      vas.look('shed');
      await s.wait(0.3);
      back.cut();
      sil.look(null);
      mak.look('silva');
      await s.wait(1.6);
    } },
    // he takes it on himself: two steps toward the people; Silva comes at him, points; Vasenka's fist into his pocket,
    // not looking at his brother
    blame: { after: 'after_fire', from: E('after_fire'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
      camTo(s, CAM.blame, 3);
      bus.look(null);
      bus.mood('sad');
      await bus.walk([[26.6, 9.15], SPOT.blame.busygin]);
      await bus.turn(95);
      bus.look('silva');
      s.tell('blame:step');
      sil.mood('surprised');
      sil.look('busygin');
      await sil.walk([SPOT.blame.silva]);
      await sil.turn(265);
      await s.wait(0.6);
      sil.mood('angry');
      await sil.do('point');
      vas.mood('sad');
      vas.look([25.0, 8.6, 0.3]);
      vas.reach({ r: 'vasenka#hips' });
      await s.wait(1.0);
      vas.with(null);
      vas.reach(null);
      await s.wait(2.6);
    } },
    // he lets the boy say it himself: a hand on his shoulder; the two to Makarskaya; “It was me”; she goes in; Sarafanov
    // runs out onto his porch
    own_up: { after: 'after_fire', from: E('after_fire'), run: async s => {
      const bus = s.person('busygin'), vas = s.person('vasenka'), mak = s.person('makarskaya'), sar = s.person('sarafanov');
      const own = s.shot({ ...CAM.own });
      // to his left side; his hand on the boy's shoulder
      bus.look('vasenka');
      await bus.walk([[26.3, 10.4], SPOT.own.beside]);
      await bus.turn(110);
      bus.reach({ r: 'vasenka#shoulder_l' });
      vas.look('busygin');
      vas.mood('sad');
      await s.wait(1.6);
      bus.reach(null);
      vas.look('makarskaya');
      mak.look('vasenka');
      // through the wicket to her, he a step behind
      await s.all(vas.walk([[27.5, 10.6], [28.6, 10.1], SPOT.own.vasenka]), (async () => { await s.wait(0.6); await bus.walk([[27.5, 10.75], SPOT.own.busygin]); })());
      own.cut();
      await s.all(vas.turn(90), mak.turn(270), bus.turn(90));
      vas.look('makarskaya');
      mak.mood('neutral');
      bus.look('vasenka');
      s.tell('own_up:said');
      // L87, two seconds, L88
      await s.wait(5.4);
      mak.look(null);
      const home = mak.walk([[31.6, 10.6], [35.4, 11.9], [MAK_DOOR.a, 12.4]]);
      camTo(s, { camera_yaw: CAM.own_porch.camera_yaw }, 3);
      put(s, 'sarafanov', HALL, 200);
      sar.wear(LOOK('sarafanov_home'));
      sar.mood('afraid');
      sar.here(true);
      await s.move('door', 1, { over: 0.4, ease: 'out' });
      await sar.walk([THRESHOLD, [DOOR.a, 11.3]], { gait: 'run' });
      sar.gait(null);
      await sar.turn(130);
      sar.look('vasenka');
      vas.look('sarafanov');
      bus.look('sarafanov');
      await home;
      mak.here(false);
      s.tell('own_up:gone');
      await s.wait(1.4);
    } },
    // the third night on the bench under the kitchen window: Nina in her shawl; he comes out, his coat over his arm,
    // sits by her; both in profile, their faces in the window's light (L115, L57, L89/L90, L91 over it)
    porch_night: { from: F('porch_night'), run: async s => {
      const bus = s.person('busygin'), nina = s.person('nina');
      await s.wait(1.4);
      put(s, 'busygin', INSIDE, 90);
      bus.wear(LOOK('busygin_shirt'));
      bus.with(['coat_arm']);
      bus.mood('tired');
      await s.move('door', 1, { over: 0.9, ease: 'out' });
      bus.here(true);
      await bus.walk([THRESHOLD, [DOOR.a, 11.2], [DOOR.a, 10.1], [22.4, 10.55], [SPOT.bench.busygin[0], 10.95], SPOT.bench.busygin]);
      s.move('door', 0, { over: 1.2 });
      await bus.turn(180);
      bus.on([SPOT.bench.busygin[0], SPOT.bench.busygin[1], BENCH_Y]);
      await bus.do('sit_down');
      bus.do('seated', { loop: true });
      bus.look('nina');
      nina.look('busygin');
      s.tell('porch_night:sat');
      await s.wait(2.0);
      nina.look(null);
    } },
    // the insert: his coat over her shoulders (closeups, the shot `shawl`)
    shawl: { after: 'porch_night', from: E('shawl'), run: async s => {
      s.person('busygin').look('nina');
      await s.wait(0.6);
      s.set('lay', 0);
      s.set('shawl', 1);
      await s.wait(0.8);
      s.tell('shawl:close');
      await s.wait(1.4);
    } },
    // the insert closed: the coat on her shoulders; by `nina_is` — her hands round his (knows), the coat given back
    // (sister), or sitting apart looking at the snow (none)
    porch_after: { after: 'shawl', from: () => ({ ...END.shawl(scene), shawl: 0, nina_with: ['shawl', 'coat_over'], busygin_with: null }), run: async s => {
      const bus = s.person('busygin'), nina = s.person('nina');
      s.set('shawl', 0);
      nina.with(['shawl', 'coat_over']);
      bus.with(null);
      const is = scene.get('nina_is') ?? 'none';
      await s.wait(1.0);
      if (is === 'knows') {
        camTo(s, CAM.bench_near, 4);
        nina.reach({ r: 'busygin#hand_l', l: 'busygin#hand_l' });
        await s.wait(1.2);
        nina.look('busygin');
        nina.mood('smile');
        bus.look('nina');
        await s.wait(4.0);
      } else if (is === 'sister') {
        nina.look('busygin');
        nina.mood('neutral');
        nina.with(['shawl']);
        await nina.do('give');
        nina.do({ motion: 'seated', loop: true });
        bus.with(['coat_arm']);
        await bus.do('take');
        bus.do({ motion: 'seated', loop: true });
        nina.look(null);
        bus.look([20.0, 6.0, 0.3]);
        await s.wait(2.4);
      } else {
        nina.look([20.5, 8.0, 0]);
        bus.look([23.5, 7.5, 0]);
        await s.wait(5.0);
      }
      s.tell('porch_after:lean');
    } },
    // the door flung open: he runs off the porch into the street (Silva ahead, by `silva_door`); they stand at the
    // gate facing left — the pose for “Running” (the script runs him by `run` and the camera along beside him)
    run_out: { from: F('run_out'), run: async s => {
      const bus = s.person('busygin'), sil = s.person('silva');
      const two = Number(scene.get('silva_door') ?? 1) === 1;
      await s.move('door', 1, { over: 0.3, ease: 'out' });
      if (two) { sil.wear(null); sil.mood('afraid'); sil.here(true); }
      const sw = two ? sil.walk([[DOOR.a, 11.0], [DOOR.a, 9.9], [22.5, 8.3], [19.2, 8.0]], { gait: 'run' }) : null;
      await s.wait(two ? 0.5 : 0);
      bus.wear(null);
      bus.with(null);
      bus.mood('sad');
      bus.here(true);
      await bus.walk([[DOOR.a, 11.0], [DOOR.a, 9.9], [22.6, 8.6], RUN[0]], { gait: 'run' });
      bus.gait(null);
      if (sw) { await sw; sil.gait(null); await sil.turn(270); }
      await bus.turn(270);
      bus.look([0, 6, 1.6]);
      s.tell('run_out:ready');
      await s.wait(1.6);
    } },
    // the epilogue: the street from the path by the platform; the camera comes slowly toward the kitchen window
    night_window: { from: F('night_window'), run: async s => {
      await camTo(s, CAM.night1, 16);
      s.tell('night_window:held');
      await s.wait(3);
    } },
  };

  // the neighbours at the shed while it burns: a throw, back two steps, again — never in step
  async function neighbours(c) {
    const one = async (id, at, k) => {
      const p = c.person(id);
      await c.wait(0.9 + k * 2.1);
      while (Number(scene.get('fire') ?? 0) > 0.03) {
        const t = p.do('throw_bucket');
        await c.wait(1.0);
        c.set('splash', Number(scene.get('splash') ?? 0) + 1);
        await t;
        p.do('stand');
        await p.walk([[at[0] - 1.2 + k * 2.4, at[1] - 2.2]], { gait: 'carry_walk' });
        await p.walk([at], { gait: 'carry_walk' });
        p.gait(null);
        await p.turn(k ? 340 : 25);
      }
    };
    await c.all(one('neighbor1', SPOT.nb1, 0), one('neighbor2', SPOT.nb2, 1));
  }
}

// ── the actions the mini-games ask for by key ──
// “Windows” (`knock`): N — to window N, knock; 0 — back to Silva
async function knock(s, n) {
  const bus = s.person('busygin');
  bus.look(null);
  if (!n) {
    await bus.walk([SPOT.windows.busygin]);
    await bus.turn(318);
    bus.look('win2');
    return;
  }
  const to = knockSpot(n);
  await bus.walk([to]);
  await bus.turn(0);
  bus.look(`win${n}`);
  const k = bus.do('knock');
  await s.wait(0.6);
  s.tell('knock:hit');
  await k;
  s.tell('knock:done');
}
const near = (s, id, p, tol = 0.35) => Math.hypot(Number(s.get(`${id}_a`)) - p[0], Number(s.get(`${id}_d`)) - p[1]) < tol;
// “Buckets” (`buckets`): fill — to the barrel, a full bucket up (buckets:full); throw — carried to the shed, thrown
// (buckets:splash); none — the bucket set down on the snow, he stands where he stands
async function buckets(s, v) {
  const bus = s.person('busygin');
  bus.look(null);
  if (v === 'fill') {
    if (!near(s, 'busygin', SPOT.barrel)) await bus.walk([SPOT.barrel]);
    await bus.turn(270);
    bus.with(['bucket']);
    bus.look('barrel');
    await bus.do('dip');
    bus.with(['bucket_full']);
    s.tell('buckets:full');
    bus.look('shed');
  } else if (v === 'throw') {
    bus.with(['bucket_full']);
    await bus.walk([SPOT.throw], { gait: 'carry_walk' });
    bus.gait(null);
    await bus.turn(15);
    bus.look('shed');
    const t = bus.do('throw_bucket');
    await s.wait(1.0);
    bus.with(['bucket']);
    s.set('splash', Number(s.get('splash') ?? 0) + 1);
    s.tell('buckets:splash');
    await t;
    bus.do('stand');
  } else if (v === 'none' && Array.isArray(s.get('busygin_with')) && s.get('busygin_with').some(p => p === 'bucket' || p === 'bucket_full')) {
    await bus.do('put_down');
    bus.with(null);
    bus.do('stand');
  }
}

// a pane's lit layer, its figure and its glow by its keys (`<id>_lit`, `<id>_who`: the script's, smooth); a pane
// with no keys stays dark
function paneLive(e) {
  const lit = e.state[`${e.id}_lit`] ?? 0, who = e.state[`${e.id}_who`] ?? 0;
  e.layer('lit').alpha = lit;
  e.layer('figure').alpha = who * lit;
  e.glow('pane', lit);
}
// the shed's fire by `fire` (0…1): its window's glow, the tongues under its eaves, flickering
function shedLive(e) {
  const f = clamp(Number(e.state.fire) || 0, 0, 1), k = f > 0 ? Math.min(1, f / 0.35) : 0;
  const fl = 0.82 + 0.18 * e.anim.noise(e.t * 3.1, 7);
  e.layer('fire').alpha = k;
  e.layer('fire').brightness = fl;
  e.layer('tongues').alpha = clamp((f - 0.15) / 0.35, 0, 1);
  e.layer('tongues').scaleY = 0.85 + 0.25 * e.anim.noise(e.t * 2.3, 3);
  e.glow('fire', k * fl);
}

// hour → the late look's weight
const lateOf = hour => span(hour, 0.9, 0.96);

return { HOUSES, PLINTH, WALL_H, RISE, winOf, KITCHEN_WIN, DOOR, MAK_DOOR, NB_DOOR, KITCHEN, TABLE, LAMP, STOVE, PORCH, SAR_FENCE, GATE_LAMP,
  SIDE_FENCE, STREET_LAMP, SHED, BARREL, BENCH, WOODPILE, SPOT, K, CAM, RUN, RUN_LEN, RUN_CAM, runPoint, runAt, runWay,
  FROM, END, base, film, knock, buckets, knockSpot, paneLive, shedLive, lateOf, span, clamp, PEOPLE, INSIDE, HALL, THRESHOLD };
