// Moscow: what the paintings and the script share — the lane in metres, its sky, the sledges, the shots, the film in
// beats (film(scene): the world's module beats plays it). A quiet lane in winter, laid along the distance: the road
// across −3.4…1.4, the right pavement to the house fronts at 3.6, the left one to the fronts at −5.4. On the right, from
// the viewer: the girls' school behind its railings (its gate at 4.6…5.8), the Gurovs' house (its porch and door at
// 13, the window upstairs at 15.4), a neighbour's house with a gateway arch; on the left: a long low house, the baker's
// shop with its lit window, the doctors' club with its portico (its door at 23.5); a cross street at 30…38, the lane
// going on beyond, a church at its end. Gas lamps along both kerbs.
const N = kit.sky;
const num = v => Number(v) || 0;
const clamp01 = v => anim.clamp(num(v), 0, 1);
const on = v => num(v) > 0.5;

// ── the lane ──
const XR = 3.6;                // the right house fronts (facing the lane: 270)
const XL = -5.4;               // the left house fronts (facing the lane: 90)
const KERB_R = 1.4;
const KERB_L = -3.4;
// the porches' land: the Gurovs' steps rise from the pavement (x 1.95) to the porch's top (0.75) at 2.8…3.6, z 11.9…14.1;
// the club's from the road (x −4.0) to its portico (0.6) at −4.7…−5.4, z 21.8…25.2 (relief.js — the same numbers)
const PORCH = { x0: 1.95, x1: 2.8, z0: 11.9, z1: 14.1, top: 0.75 };
const CLUB_PORCH = { x0: -4.0, x1: -4.7, z0: 21.8, z1: 25.2, top: 0.6 };
const DOOR_Z = 13.0;           // the Gurovs' door: 12.45…13.55, hinged at 13.55
const WIN_UP = { z: 15.4, w: 0.8, y0: 4.3, y1: 5.9 };   // the window upstairs (its room's floor at 3.9)
const CLUB_DOOR_Z = 23.5;
// the door's leaf: `door` 0 shut … 1 open into the house (its facing, degrees)
const doorFacing = door => 270 - 82 * clamp01(door);

// ── the gas lamps: copies of one painting along the kerbs; the far lamp up the lane on the right (`lamp2`, the
// choice's mark after “the sturgeon”) is an element of its own ──
const LAMPS = [[1.55, 6.4], [1.55, 20.2], [1.55, 47.8], [-3.55, 13.1], [-3.55, 26.9], [-3.55, 40.7], [-3.55, 54.5]];
const LAMP2 = [1.55, 34.0];

// ── the sky (module sky): the winter sun low over the roofs, the moon higher; the grey cover by `overcast` ──
const HORIZON = 0.5;
const SKY = {
  horizon: HORIZON,
  sun: (u, height, state, out) => { out[0] = 0.25 + 1.3 * u; out[1] = HORIZON - 0.06 - 0.26 * height; },
  moon: (u, height, state, out) => { out[0] = 1.5 - 1.1 * u; out[1] = HORIZON - 0.12 - 0.38 * height; },
  clouds: [[0.3, 0.12, 0.8, 0.02], [1.1, 0.2, 0.7, 0.016], [1.7, 0.08, 0.6, 0.02], [0.75, 0.3, 0.9, 0.012]],
  storm: 'overcast',
};

// ── the sledges: each an unseen base (`sledge_base`, `sledge2_base`) turned by its facing, its sides, its back and its
// horse on it. In the base's frame u runs along the sledge toward the horse, v across it (+ behind its face); its face
// looks out to the road. Gurov's (`sledge`, with his cabman) stands by the Gurovs' porch (`house`) or at the club
// (`club`), or is not in the lane (`none`); the official's (`sledge2`, its driver painted on the box) waits at the kerb
// by the baker's (`street`) or at the club's portico (`club`) ──
const SLEDGE = {
  house: { a: 0.7, d: 11.4, f: 270 },
  club: { a: -2.8, d: 30.6, f: 90 },
  none: { a: 0.7, d: -60, f: 270 },     // out of the lane: behind the near end, never in a shot
};
const SLEDGE2 = { street: { a: -2.8, d: 7.4, f: 90 }, club: { a: -2.8, d: 24.8, f: 90 } };
const SEAT_U = -0.35, BOX_U = 0.55, SEAT_E = 0.55, BOX_E = 0.78;
// a point of a sledge (u along it, v across, e up) in the lane
function onSledge(p, u, v = 0, e = 0) {
  const r = (p.f * Math.PI) / 180;
  // the base's +u: its facing − 90; its +v: away behind its face
  const ru = r - Math.PI / 2;
  return [p.a + Math.sin(ru) * u - Math.sin(r) * v, p.d + Math.cos(ru) * u - Math.cos(r) * v, e];
}
const sledgeOf = at => SLEDGE[at] || SLEDGE.house;
const sledge2Of = at => SLEDGE2[at] || SLEDGE2.street;
// the keys of Gurov's sledge and his cabman where `sledge_at` puts them
function sledgeKeys(at) {
  const p = sledgeOf(at), box = onSledge(p, BOX_U, 0, BOX_E), here = at === 'house' || at === 'club';
  return {
    sledge_a: p.a, sledge_d: p.d, sledge_f: p.f,
    cabman_here: here, cabman_a: box[0], cabman_d: box[1], cabman_on: here ? box : null, cabman_turn: (p.f + 270) % 360,
    cabman_do: 'seated', cabman_look: null,
  };
}
function sledge2Keys(at) {
  const p = sledge2Of(at);
  return { sledge2_a: p.a, sledge2_d: p.d };
}
// where a passenger sits in Gurov's sledge / the official's, and which way they face (toward the horse)
const seatOf = at => onSledge(sledgeOf(at), SEAT_U, 0, SEAT_E);
const seat2Of = at => onSledge(sledge2Of(at), SEAT_U, 0, SEAT_E);
const forward = at => (sledgeOf(at).f + 270) % 360;

// ── the season: the snow, or the thaw — wet dark snow, the wet road a mirror, drops from the eaves ──
const seasonOf = v => (v === 'thaw' ? 'thaw' : 'winter');
const seasonKeys = season => ({ season, puddles: season === 'thaw' ? 0.38 : 0, drip: season === 'thaw' ? 1 : 0 });

// ── the shadows' walk (“The shadow”): the four points Gurov stops at on the right pavement, far to near; each woman
// comes out ahead of hers (from a gateway arch, the baker's door, behind the official's sledge, the school's gate),
// stands with her back to us, then turns — a stranger's face in profile — and goes ──
const FAR_END = [2.2, 27.5];
const STOPS = [[2.2, 22.0], [2.2, 17.0], [2.2, 10.0], [2.2, 7.8]];
const SHADES = {
  shade1: { from: [4.3, 20.6], at: [2.0, 19.2], turn: 20, face: 270, off: [[3.4, 20.6], [4.6, 20.6]] },
  shade2: { from: [-6.0, 15.6], at: [-4.0, 14.2], turn: 300, face: 90, off: [[-5.0, 15.6], [-6.2, 15.6]] },
  shade3: { from: [-3.6, 8.3], at: [-1.6, 6.2], turn: 330, face: 90, off: [[-1.0, 2.0], [-0.6, -1.6]] },
  shade4: { from: [4.6, 5.2], at: [2.8, 4.9], turn: 60, face: 270, off: [[3.9, 5.2], [5.2, 5.4]] },
};

// ── to school by the hand (“By the hand”): from the porch's foot (13 m from the lane's camera) to the school's gate
// (≈ 6 m); she holds his left hand with her right, on his right ──
const SCHOOL_FROM = { gurov: [1.72, 11.5], daughter: [2.32, 11.5] };
const SCHOOL_TO = { gurov: [1.9, 6.0], daughter: [2.5, 6.0] };
const walkedOf = d => clamp01((SCHOOL_FROM.daughter[1] - num(d)) / (SCHOOL_FROM.daughter[1] - SCHOOL_TO.daughter[1]));

// ── places at the Gurovs' door: inside the hall, on the threshold, on the porch, a step below, the porch's foot ──
const HALL = [4.3, 13.0];
const THRESHOLD = [3.45, 13.0];
const PORCH_TOP = [3.15, 12.9];
const STEP_BELOW = [2.6, 12.9];
const PORCH_FOOT = [1.72, 12.4];
const UPSTAIRS = [4.2, 15.4];          // the wife at the window upstairs (on the room's floor, 3.9; 0.6 m behind the front:
                                       // her dress's flare must not reach through the wall)
// at the club: inside its door, on the portico, the bottom step
// (out through the door, 22.95…24.05, and between its two middle columns, 23.17…23.83: one after the other)
const CLUB_IN = { gurov: [-6.0, 23.65], official: [-6.0, 23.35] };
const CLUB_GAP = { gurov: [-4.9, 23.55], official: [-4.9, 23.45] };
const CLUB_OUT = { gurov: [-4.55, 24.2], official: [-4.5, 22.9] };
const CLUB_STEP = [-4.15, 23.6];

// ── the shots: place x, z (metres from the start), the eye's height, yaw (right of straight ahead), pitch ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
// a shot of two people face to face, from the side of the line between them (toward the lane: +x, −z), `dist` metres
// off its middle, at the eye's height `eye`: both in profile or three-quarter, both in the 4:3 window
function twoShot(p, q, dist, eye, pitch = 0) {
  const mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
  let dx = q[0] - p[0], dz = q[1] - p[1];
  const l = Math.hypot(dx, dz) || 1;
  dx /= l; dz /= l;
  let px = dz, pz = -dx;
  if (px < 0) { px = -px; pz = -pz; }
  const x = mx + px * dist, z = mz + pz * dist;
  return cam(x, z, eye, (Math.atan2(-px, -pz) * 180) / Math.PI, pitch);
}
const turnTo = (p, q) => ((Math.atan2(q[0] - p[0], q[1] - p[1]) * 180) / Math.PI + 360) % 360;
const OFFICIAL_SEAT = seat2Of('club');
const CAM = {
  // down the lane at a slant, from the near end: the school's gate ≈ 5 m, the official's sledge by the baker's ≈ 7, the
  // Gurovs' porch ≈ 13, the cross street ≈ 30; still, for “The shadow” and “By the hand”
  STREET: cam(0.2, 0, 1.7, 10),
  // the Gurovs' house from the road, a little below: the steps, the door, the window upstairs, the sledge at the kerb
  PORCH: cam(-3.0, 15.5, 1.5, 105, 13),
  // the club's portico from the road ≈ 5 m, the sledges along the kerb beyond it, the lane going on to the far lamp
  CLUB: cam(-0.4, 17.5, 1.7, -22),
  // faces: the official in his sledge turned back to Gurov on the bottom step, both in profile, the club's lamps on them
  TWO: twoShot(CLUB_STEP, [OFFICIAL_SEAT[0], OFFICIAL_SEAT[1]], 3.3, 1.55),
  // faces: the wife on the threshold and Gurov a step below, from along the house front; the porch lamp before them
  DOOR: cam(3.0, 10.0, 2.1),
  // her face close (chest up, 1.8 m), three-quarter, from the pavement by the steps; his shoulder at the frame's right
  WIFE: cam(1.85, 13.9, 2.3, 119),
  // at the school's gate: Gurov from along the railings, three-quarter; the gate, the girl at it
  GATE: cam(2.9, 2.6, 1.6, -8),
  // the gate end of the lane: Gurov at the gate, the street behind him (the messenger comes across it)
  NEAR: cam(0.2, 1.5, 1.7, 10),
};

// ── the people ──
const PEOPLE = ['gurov', 'wife', 'daughter', 'official', 'yardman', 'redcap', 'shade1', 'shade2', 'shade3', 'shade4', 'cabman'];
const WITH = { daughter: ['satchel'], shade2: ['muff'], shade3: ['parcel'] };
// where each stands when not in the beat (out of sight: here false)
const AWAY = {
  gurov: HALL, wife: HALL, daughter: HALL, official: CLUB_IN.official, yardman: [4.4, 12.6], redcap: [-4.4, 14.0],
  shade1: SHADES.shade1.from, shade2: SHADES.shade2.from, shade3: SHADES.shade3.from, shade4: SHADES.shade4.from,
};
function nobody() {
  const v = {};
  for (const id of PEOPLE) {
    if (id === 'cabman') continue;
    const [a, d] = AWAY[id];
    Object.assign(v, {
      [`${id}_here`]: false, [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_turn`]: 180, [`${id}_do`]: 'stand', [`${id}_look`]: null,
      [`${id}_reach`]: null, [`${id}_on`]: null, [`${id}_gait`]: null, [`${id}_with`]: WITH[id] ?? null, [`${id}_mood`]: null,
    });
  }
  v.wife_wear = null;
  return v;
}
const at = (id, p, turn, extra = {}) => ({ [`${id}_here`]: true, [`${id}_a`]: p[0], [`${id}_d`]: p[1], [`${id}_turn`]: turn, ...extra });

function film(scene) {
  const party = k => on(scene.get(k));
  const thaw = () => party('spring');
  // where every beat may begin from: an hour, the weather, the shot, the sledges where they stand, nobody in the lane.
  // What the game has decided (wife_knows, spring) and set before a beat (look_back, wave) is never set here: read.
  const base = ({ hour, sledge = 'none', sledge2 = 'street', season = 'winter', ...extra }) => ({
    ...CAM.STREET, hour, ...N.keys(hour), overcast: 0, snow: 0.5, wet: 0, ...seasonKeys(season),
    lamps: 0, porch_lamp: 0, windows: 0, home: 0, door: 0, door_f: doorFacing(0), window_up: 0, curtain: 1, shadows: 0,
    sledge_at: sledge, ...sledgeKeys(sledge), sledge2_at: sledge2, ...sledge2Keys(sledge2),
    walk_on: 0, shade1: 0, shade2: 0, shade3: 0, shade4: 0, go: 0, walked: 0,
    ...nobody(), ...extra,
  });
  const MORNING = 0.36, EVENING = 0.81, NIGHT = 0.96, BEFORE_DAWN = 0.15;
  const nightLights = { lamps: 1, porch_lamp: 1 };
  // the wife at the window upstairs, lit, looking down at the lane (the party's wife_knows) — or the curtain drawn
  const wifeUpstairs = (look = null) => party('wife_knows')
    ? { window_up: 1, curtain: 0, ...at('wife', UPSTAIRS, 270, { wife_look: look }) }
    : { window_up: 0, curtain: 1 };

  // he goes in at the door: it opens, he walks in and is gone, it shuts
  async function inAtDoor(s, who) {
    await s.move('door', 1, { over: 1.1, ease: 'inOut' });
    await who.walk([THRESHOLD, HALL]);
    who.here(false);
    await s.move('door', 0, { over: 1.3, ease: 'inOut' });
  }
  // he comes up the steps from the pavement
  async function upTheSteps(gurov, from) {
    await gurov.walk([from, PORCH_FOOT, PORCH_TOP]);
  }

  return {
    // morning, the first snow; the white roofs and limes; he comes out on the porch, lifts his face to the snow (in
    // profile), goes down to his sledge and gets in — under L42, L43
    first_snow: {
      from: () => base({ hour: MORNING, sledge: 'house', ...CAM.PORCH, overcast: 0.55, snow: 1, windows: 0.2,
        ...at('gurov', HALL, 270) }),
      run: async s => {
        const gurov = s.person('gurov');
        await s.wait(0.8);
        await s.move('door', 1, { over: 1.1, ease: 'inOut' });
        await gurov.walk([THRESHOLD, PORCH_TOP]);
        s.move('door', 0, { over: 1.4, ease: 'inOut' });
        s.tell('first_snow:out');
        await gurov.turn(195);
        gurov.look([1.2, 11.0, 7.5]);
        await s.wait(3.2);
        gurov.look(null);
        const seat = seatOf('house');
        await gurov.go('sit_down', { to: [seat[0], seat[1]], turn: forward('house') });
        gurov.on(seat);
        gurov.do('seated');
        await s.wait(1.2);
      },
    },
    // evening, the lamps lit, the snow; the lane from its near end; he at its far end — under “The shadow”
    evening_walk: {
      from: () => base({ hour: EVENING, ...nightLights, windows: 1, snow: 0.45,
        ...at('gurov', FAR_END, 180, { gurov_gait: 'stroll' }) }),
      run: async s => { await s.wait(4); },
    },
    // a cut to the porch: he comes up the steps; (look_back 1) on the top step he turns and looks up the empty lane, his
    // face in profile under the porch lamp; he goes in; the window upstairs is lit, on its drawn curtain the shadows of
    // two at a table under the lamp — under L45, L46
    table_window: {
      from: () => base({ hour: EVENING + 0.01, ...nightLights, windows: 1, home: 1, window_up: 1, curtain: 1, shadows: 1,
        snow: 0.45, ...CAM.PORCH, ...at('gurov', [1.9, 18.6], 180) }),
      run: async s => {
        const gurov = s.person('gurov');
        await upTheSteps(gurov, [1.75, 14.6]);
        if (party('look_back')) {
          await gurov.turn(15);
          gurov.look([0.4, 30, 1.6]);
          await s.wait(2.6);
          gurov.look(null);
        }
        await gurov.turn(90);
        await inAtDoor(s, gurov);
        s.tell('table_window:lit');
        await s.wait(6);
      },
    },
    // night, the club's portico; Gurov and the official come out onto it; both sledges at the kerb; Gurov turns to the
    // official — under L50
    club: {
      from: () => base({ hour: NIGHT, sledge: 'club', sledge2: 'club', ...nightLights, windows: 0.6, snow: 0.3, ...CAM.CLUB,
        ...at('gurov', CLUB_IN.gurov, 90), ...at('official', CLUB_IN.official, 90) }),
      run: async s => {
        const gurov = s.person('gurov'), official = s.person('official');
        await s.wait(0.6);
        const out = official.walk([CLUB_GAP.official, CLUB_OUT.official]);
        await s.wait(0.9);
        await s.all(out, gurov.walk([CLUB_GAP.gurov, CLUB_OUT.gurov]));
        s.tell('club:out');
        official.turn(turnTo(CLUB_OUT.official, CLUB_OUT.gurov));
        await gurov.turn(turnTo(CLUB_OUT.gurov, CLUB_OUT.official));
        gurov.look('official');
        official.look('gurov');
        gurov.mood('smile');
        await s.wait(5.5);
      },
    },
    // faces: the official goes down to his sledge, sits, turns back — a well-fed face in the club's lamplight (under
    // L51–L53); Gurov alone on the bottom step, thinking; back to the portico: his sledge at the kerb, the far lamp up
    // the lane — under the choice
    say: {
      after: 'club',
      from: () => base({ hour: NIGHT, sledge: 'club', sledge2: 'club', ...nightLights, windows: 0.6, snow: 0.3, ...CAM.CLUB,
        ...at('gurov', CLUB_STEP, turnTo(CLUB_STEP, OFFICIAL_SEAT), { gurov_look: 'official', gurov_mood: 'thinking' }),
        ...at('official', [OFFICIAL_SEAT[0], OFFICIAL_SEAT[1]], 238, { official_on: OFFICIAL_SEAT, official_do: 'seated',
          official_look: 'gurov', official_mood: 'smile' }) }),
      run: async s => {
        const gurov = s.person('gurov'), official = s.person('official');
        const two = s.shot({ ...CAM.TWO });
        // (come straight to: they are there already — the official sits, Gurov is on the bottom step)
        if (!s.state.official_on) {
          gurov.mood(null);
          official.look(null);
          await official.go('sit_down', { to: [OFFICIAL_SEAT[0], OFFICIAL_SEAT[1]], turn: 238 });
          official.on(OFFICIAL_SEAT);
          official.do('seated');
        }
        const down = gurov.walk([CLUB_STEP]);
        await s.wait(0.4);
        official.look('gurov');
        official.mood('smile');
        await down;
        await gurov.turn(turnTo(CLUB_STEP, OFFICIAL_SEAT));
        gurov.look('official');
        await s.until(() => two.ready);
        two.cut();
        s.tell('say:turns');
        await s.wait(3);
        gurov.mood('thinking');
        const wide = s.shot({ ...CAM.CLUB });
        await s.wait(4);
        await s.until(() => wide.ready);
        wide.cut();
        await s.wait(0.8);
      },
    },
    // he laughs, his shoulders shaking, goes down to his sledge and gets in
    laugh_sit: {
      after: 'say',
      from: () => base({ hour: NIGHT, sledge: 'club', sledge2: 'club', ...nightLights, windows: 0.6, snow: 0.3, ...CAM.CLUB,
        ...at('gurov', CLUB_STEP, turnTo(CLUB_STEP, OFFICIAL_SEAT), { gurov_look: 'official' }),
        ...at('official', [OFFICIAL_SEAT[0], OFFICIAL_SEAT[1]], 238, { official_on: OFFICIAL_SEAT, official_do: 'seated', official_look: 'gurov' }) }),
      run: async s => {
        const gurov = s.person('gurov');
        gurov.mood('laugh');
        gurov.look(null);
        await gurov.do('laugh_stand');
        s.person('official').look(null);
        const seat = seatOf('club');
        await gurov.go('sit_down', { to: [seat[0], seat[1]], turn: forward('club') });
        gurov.on(seat);
        gurov.do('seated');
        gurov.mood(null);
        await s.wait(1);
      },
    },
    // he walks away through the snow, past his empty sledge, toward the far lamp; the cabman turns after him — under L54
    say_walk: {
      after: 'say',
      from: () => base({ hour: NIGHT, sledge: 'club', sledge2: 'club', ...nightLights, windows: 0.6, snow: 0.3, ...CAM.CLUB,
        ...at('gurov', CLUB_STEP, turnTo(CLUB_STEP, OFFICIAL_SEAT), { gurov_look: 'official', gurov_mood: 'thinking' }),
        ...at('official', [OFFICIAL_SEAT[0], OFFICIAL_SEAT[1]], 238, { official_on: OFFICIAL_SEAT, official_do: 'seated', official_look: 'gurov' }) }),
      run: async s => {
        const gurov = s.person('gurov'), cabman = s.person('cabman');
        gurov.look(null);
        const away = gurov.walk([[-2.9, 25.9], [-1.4, 29.8], [0.9, 33.4]]);
        await s.wait(1.6);
        s.tell('say_walk:off');
        s.person('official').look(null);
        await s.wait(2.4);
        cabman.look('gurov');
        await away;
        await s.wait(1.5);
      },
    },
    // December, before dawn; the porch; the yard porter carries the valise to the sledge; the wife in her shawl in the
    // lit doorway; faces: he on the step turns to her, the porch lamp on both — under L57, L58; then he goes down to the
    // sledge and gets in
    porch_go: {
      from: () => base({ hour: BEFORE_DAWN, sledge: 'house', ...nightLights, windows: 0.15, home: 0.5, door: 1, door_f: doorFacing(1),
        snow: 0.25, ...CAM.PORCH,
        ...at('wife', THRESHOLD, 263, { wife_wear: kit.cast.characters.wife_shawl }),
        ...at('gurov', STEP_BELOW, 215),
        ...at('yardman', [3.1, 13.7], 200, { yardman_with: ['valise'], yardman_gait: 'carry_walk' }) }),
      run: async s => {
        const gurov = s.person('gurov'), wife = s.person('wife'), yardman = s.person('yardman');
        const seat = seatOf('house'), boot = onSledge(sledgeOf('house'), -1.6, 0, 0);
        const carry = (async () => {
          await yardman.walk([[2.5, 13.7], [1.6, 13.4], [boot[0], boot[1]]]);
          await yardman.turn(forward('house'));
          yardman.with(null);
          yardman.gait(null);
        })();
        const faces = s.shot({ ...CAM.DOOR });
        await s.wait(2.2);
        await gurov.turn(83);
        gurov.look('wife');
        wife.look('gurov');
        await s.until(() => faces.ready);
        faces.cut();
        s.tell('porch_go:turns');
        await s.wait(7);
        const wide = s.shot({ ...CAM.PORCH });
        await s.until(() => wide.ready);
        wide.cut();
        gurov.look(null);
        await s.all(carry, gurov.go('sit_down', { to: [seat[0], seat[1]], turn: forward('house') }));
        gurov.on(seat);
        gurov.do('seated');
        await s.wait(1);
      },
    },
    // night, snow or the thaw; the house dark but the window upstairs; he comes along the pavement and up the steps;
    // the door opens: faces — the wife in the doorway, the porch lamp on her face, he a step below — under L84 and the
    // choice
    home_late: {
      from: () => {
        const season = thaw() ? 'thaw' : 'winter';
        return base({ hour: NIGHT, ...nightLights, season, windows: 0.25, window_up: 1, curtain: 1, snow: season === 'thaw' ? 0 : 0.4,
          ...CAM.PORCH, ...at('gurov', [1.9, 18.6], 180), ...at('wife', HALL, 270) });
      },
      run: async s => {
        const gurov = s.person('gurov'), wife = s.person('wife');
        await gurov.walk([[1.75, 14.6], PORCH_FOOT, STEP_BELOW]);
        await gurov.turn(83);
        const faces = s.shot({ ...CAM.DOOR });
        await s.move('door', 1, { over: 1.0, ease: 'inOut' });
        s.tell('home_late:door');
        await wife.walk([THRESHOLD]);
        await wife.turn(263);
        wife.look('gurov');
        gurov.look('wife');
        await s.until(() => faces.ready);
        faces.cut();
        await s.wait(3);
      },
    },
    // her face level; she steps back; he goes in; the door shuts; the window upstairs goes dark
    wife_lie: {
      after: 'home_late',
      from: () => base({ hour: NIGHT, ...nightLights, season: thaw() ? 'thaw' : 'winter', windows: 0.25, window_up: 1, curtain: 1,
        snow: thaw() ? 0 : 0.4, door: 1, door_f: doorFacing(1), ...CAM.DOOR,
        ...at('gurov', STEP_BELOW, 83, { gurov_look: 'wife' }), ...at('wife', THRESHOLD, 263, { wife_look: 'gurov' }) }),
      run: async s => {
        const gurov = s.person('gurov'), wife = s.person('wife');
        wife.mood('neutral');
        await s.wait(1.4);
        const wide = s.shot({ ...CAM.PORCH });
        wife.look(null);
        await wife.walk([HALL]);
        wife.here(false);
        await s.until(() => wide.ready);
        wide.cut();
        gurov.look(null);
        await gurov.walk([THRESHOLD, HALL]);
        gurov.here(false);
        s.tell('wife_lie:in');
        await s.move('door', 0, { over: 1.2, ease: 'inOut' });
        await s.wait(1.2);
        s.set('window_up', 0);
        await s.wait(1.8);
      },
    },
    // her face close: sad, still (under L86, L87); she steps back; he goes in; wide: she stays in the open door, looks
    // out at the snow, shuts the door; the window upstairs stays lit
    wife_truth: {
      after: 'home_late',
      from: () => base({ hour: NIGHT, ...nightLights, season: thaw() ? 'thaw' : 'winter', windows: 0.25, window_up: 1, curtain: 1,
        snow: thaw() ? 0 : 0.4, door: 1, door_f: doorFacing(1), ...CAM.WIFE,
        ...at('gurov', STEP_BELOW, 83, { gurov_look: 'wife' }), ...at('wife', THRESHOLD, 263, { wife_look: 'gurov', wife_mood: 'sad' }) }),
      run: async s => {
        const gurov = s.person('gurov'), wife = s.person('wife');
        const close = s.shot({ ...CAM.WIFE });
        await s.until(() => close.ready);
        close.cut();
        wife.mood('sad');
        await s.wait(6.5);
        const wide = s.shot({ ...CAM.PORCH });
        await wife.walk([[3.8, 13.45]]);
        await s.until(() => wide.ready);
        wide.cut();
        gurov.look(null);
        await gurov.walk([THRESHOLD, HALL]);
        gurov.here(false);
        await wife.walk([THRESHOLD]);
        await wife.turn(255);
        wife.look([0.0, 11.0, 2.5]);
        await s.wait(2.5);
        wife.look(null);
        await wife.turn(90);
        await wife.walk([[3.75, 13.0]]);
        s.tell('wife_truth:door');
        await s.move('door', 0, { over: 1.3, ease: 'inOut' });
        wife.here(false);
        await s.wait(1);
      },
    },
    // morning, wet snow (the thaw: puddles too); he and his daughter come out of the door; at the lit window upstairs
    // the wife watching them go (wife_knows 1) — or its curtain drawn
    school: {
      from: () => {
        const season = thaw() ? 'thaw' : 'winter';
        return base({ hour: MORNING, season, overcast: 0.7, snow: season === 'thaw' ? 0 : 0.25, wet: 1, windows: 0.15, ...CAM.PORCH,
          ...wifeUpstairs('daughter'),
          ...at('gurov', [4.3, 12.75], 270), ...at('daughter', [4.3, 13.3], 270) });
      },
      run: async s => {
        const gurov = s.person('gurov'), daughter = s.person('daughter');
        await s.wait(0.6);
        await s.move('door', 1, { over: 1.0, ease: 'inOut' });
        const her = daughter.walk([[3.3, 13.25], [2.35, 12.0], SCHOOL_FROM.daughter]);
        await s.wait(0.5);
        await s.all(her, gurov.walk([[3.3, 12.8], [2.0, 12.6], SCHOOL_FROM.gurov]));
        s.move('door', 0, { over: 1.3, ease: 'inOut' });
        await s.all(gurov.turn(180), daughter.turn(180));
        daughter.look('gurov#head');
        gurov.look('daughter');
        await s.wait(2);
      },
    },
    // a cut to the lane from its near end: they at the porch's foot (≈ 13 m: he 0.14 of the frame, she 0.1), hand in
    // hand, toward us; he at her pace — under “By the hand” (the script walks them while `go` is 1)
    walk_hand: {
      after: 'school',
      from: () => {
        const season = thaw() ? 'thaw' : 'winter';
        return base({ hour: MORNING, season, overcast: 0.7, snow: season === 'thaw' ? 0 : 0.25, wet: 1, windows: 0.15,
          ...wifeUpstairs('daughter'),
          ...at('gurov', SCHOOL_FROM.gurov, 180, { gurov_gait: 'walk_child', gurov_reach: { l: 'daughter#hand_r' } }),
          ...at('daughter', SCHOOL_FROM.daughter, 180, { daughter_reach: { r: 'gurov#hand_l' } }) });
      },
      run: async s => {
        const next = s.shot({ ...CAM.STREET });
        await s.until(() => next.ready);
        next.cut();
        const gurov = s.person('gurov'), daughter = s.person('daughter');
        gurov.gait('walk_child');
        gurov.look(null);
        daughter.look(null);
        gurov.reach({ l: 'daughter#hand_r' });
        daughter.reach({ r: 'gurov#hand_l' });
        await s.wait(2);
      },
    },
    // at the school's gate (they come up to it if they have not yet), close: she lets go of his hand; (wave 0) runs in
    // at the gate without looking back; (wave 1) turns at the gate and waves to him, runs off; he stands — his face
    gate_school: {
      after: 'walk_hand',
      from: () => {
        const season = thaw() ? 'thaw' : 'winter';
        return base({ hour: MORNING + 0.01, season, overcast: 0.7, snow: season === 'thaw' ? 0 : 0.25, wet: 1, windows: 0.1,
          ...CAM.GATE, walked: 1,
          ...at('gurov', SCHOOL_TO.gurov, 180, { gurov_gait: 'walk_child', gurov_reach: { l: 'daughter#hand_r' } }),
          ...at('daughter', SCHOOL_TO.daughter, 180, { daughter_reach: { r: 'gurov#hand_l' } }) });
      },
      run: async s => {
        const gurov = s.person('gurov'), daughter = s.person('daughter');
        if (Math.abs(num(s.state.daughter_d) - SCHOOL_TO.daughter[1]) > 0.15) {
          await s.all(gurov.walk([SCHOOL_TO.gurov]), daughter.walk([SCHOOL_TO.daughter]));
        }
        const close = s.shot({ ...CAM.GATE });
        await s.until(() => close.ready);
        close.cut();
        gurov.gait(null);
        gurov.reach(null);
        daughter.reach(null);
        daughter.look(null);
        await s.wait(0.6);
        gurov.look('daughter');
        if (party('wave')) {
          await daughter.walk([[3.3, 5.2]]);
          await daughter.turn(turnTo([3.3, 5.2], SCHOOL_TO.gurov));
          daughter.look('gurov#head');
          daughter.reach({ r: [3.15, 5.35, 1.95] });
          await s.wait(1.4);
          daughter.reach(null);
          daughter.look(null);
        }
        daughter.gait('run');
        await daughter.walk([[3.3, 5.2], [5.2, 5.2], [7.4, 6.4]]);
        daughter.here(false);
        daughter.gait(null);
        gurov.look(null);
        await gurov.turn(110);
        gurov.mood('thinking');
        await s.wait(2.4);
      },
    },
    // a cut to the near end of the lane: the messenger in the red cap comes across the road to him with a note — under L95
    red_cap: {
      after: 'gate_school',
      from: () => {
        const season = thaw() ? 'thaw' : 'winter';
        return base({ hour: MORNING + 0.01, season, overcast: 0.7, snow: season === 'thaw' ? 0 : 0.25, wet: 1, windows: 0.1,
          ...CAM.NEAR, walked: 1, ...at('gurov', SCHOOL_TO.gurov, 110, { gurov_mood: 'thinking' }),
          ...at('redcap', [-4.4, 14.0], 160, { redcap_with: ['note'] }) });
      },
      run: async s => {
        const gurov = s.person('gurov'), redcap = s.person('redcap');
        const near = s.shot({ ...CAM.NEAR });
        await s.until(() => near.ready);
        near.cut();
        redcap.with(['note']);
        redcap.here(true);
        const meet = [1.2, 6.6];
        await redcap.walk([[-2.0, 10.5], meet]);
        await redcap.turn(turnTo(meet, SCHOOL_TO.gurov));
        gurov.turn(turnTo(SCHOOL_TO.gurov, meet));
        gurov.look('redcap');
        gurov.mood(null);
        await redcap.do('give_small');
        redcap.with(null);
        gurov.with(['note']);
        s.tell('red_cap:note');
        await gurov.do('take_small');
        gurov.look('gurov#note');
        await s.wait(0.8);
        await redcap.walk([[-1.8, 9.6], [-4.4, 16.0]]);
        redcap.here(false);
        await s.wait(1);
      },
    },
    // the epilogue: night, snow or the thaw; the porch; (wife_knows 1) the wife at the lit window upstairs; (0) the house
    // dark but the porch lamp
    porch_end: {
      from: () => {
        const season = thaw() ? 'thaw' : 'winter';
        return base({ hour: NIGHT, ...nightLights, season, windows: 0.15, snow: season === 'thaw' ? 0 : 0.5, ...CAM.PORCH,
          ...wifeUpstairs([0.0, 11.0, 0.5]) });
      },
      run: async s => {
        await s.wait(5);
        if (party('wife_knows')) {
          s.person('wife').look([-2.0, 20.0, 0.5]);
          await s.wait(5);
        } else await s.wait(5);
      },
    },
  };
}


// ── painting: what the lane's paintings share (in a card's metres: x along it, y down, 0 its foot). In daylight
// colours — the hour is the scene's light. The season (`season`) is read once: the snow on cornices, sills and roofs,
// or the thaw's wet iron and stains ──
const SNOW = '#eef1f5';
const WET_SNOW = '#b9bcc0';
const rect = (g, x0, y0, x1, y1) => g.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
function fillRect(g, colour, x0, y0, x1, y1) {
  g.fillStyle = colour;
  g.beginPath();
  rect(g, x0, y0, x1, y1);
  g.fill();
}
// a band of snow lying on a ledge from x0 to x1 at y (its top uneven, a little over the edge)
function snowLedge(g, season, x0, x1, y, depth, rnd) {
  g.fillStyle = season === 'thaw' ? WET_SNOW : SNOW;
  g.beginPath();
  g.moveTo(x0, y + 0.02);
  const n = Math.max(2, Math.round((x1 - x0) / 0.25));
  for (let i = 0; i <= n; i++) g.lineTo(x0 + ((x1 - x0) * i) / n, y - depth * (season === 'thaw' ? 0.35 : 0.7 + 0.5 * rnd()));
  g.lineTo(x1, y + 0.02);
  g.closePath();
  g.fill();
}
// the windows of a house front: [{x0, x1, y0, y1}] in its card's metres (y up negative)
function windowsOf(o) {
  const out = [];
  o.floors.forEach((f, fi) => f.xs.forEach(x => {
    if ((o.skip || []).some(([a, b, k]) => k === fi && x > a && x < b)) return;
    out.push({ x0: x - f.w / 2, x1: x + f.w / 2, y0: -f.y0, y1: -f.y1 });
  }));
  return out;
}
// a house front of old Moscow: plastered, a plinth, the floors' windows with their frames and surrounds, a cornice,
// the iron roof's edge with the snow on it, a chimney (its point `chimney`); holes cut where doors and the window
// upstairs open into the house (o.holes: [x0, y0, x1, y1], heights up positive).
//   o: { x0, x1, h, plinth, color, trim, floors: [{y0, y1, w, xs}], holes, skip, roof, chimney, rust, pilasters, season }
function facade(g, e, o) {
  const season = o.season;
  const rnd = () => e.rnd();
  const H = o.h, R = o.roof ?? 1.2;
  // the wall with its holes
  g.fillStyle = o.color;
  g.beginPath();
  rect(g, o.x0, -H, o.x1, 0);
  for (const [a, y0, b, y1] of o.holes || []) rect(g, a, -y1, b, -y0);
  g.fill('evenodd');
  // the plaster's unevenness and, in the thaw, the wet below
  for (let i = 0; i < (o.x1 - o.x0) * 3; i++) {
    g.fillStyle = `rgba(80,70,60,${0.03 + 0.03 * rnd()})`;
    const w = 0.4 + rnd() * 1.2, h = 0.3 + rnd() * 0.8;
    g.fillRect(o.x0 + rnd() * (o.x1 - o.x0 - w), -H + (H - h) * rnd(), w, h);
  }
  if (season === 'thaw') {
    const wet = g.createLinearGradient(0, -1.6, 0, 0);
    wet.addColorStop(0, 'rgba(60,55,50,0)');
    wet.addColorStop(1, 'rgba(60,55,50,0.28)');
    g.fillStyle = wet;
    g.fillRect(o.x0, -1.6, o.x1 - o.x0, 1.6);
  }
  // the plinth and the rusticated ground floor
  const P = o.plinth ?? 0.6;
  g.fillStyle = 'rgba(70,64,58,0.55)';
  g.fillRect(o.x0, -P, o.x1 - o.x0, P);
  if (o.rust) {
    g.strokeStyle = 'rgba(60,52,44,0.22)';
    g.lineWidth = 0.025;
    for (let y = P + 0.45; y < o.rust; y += 0.45) {
      g.beginPath();
      g.moveTo(o.x0, -y);
      g.lineTo(o.x1, -y);
      g.stroke();
    }
  }
  // pilasters, string courses
  g.fillStyle = o.trim;
  for (const x of o.pilasters || []) g.fillRect(x - 0.22, -H + 0.5, 0.44, H - P - 0.5);
  for (const f of o.floors.slice(1)) g.fillRect(o.x0, -(f.y1 - 0.45), o.x1 - o.x0, 0.14);
  // the windows: dark glass, white frames, a cross of bars, a surround, a sill (snow on it)
  for (const w of windowsOf(o)) {
    const ww = w.x1 - w.x0, hh = w.y1 - w.y0;
    fillRect(g, o.trim, w.x0 - 0.14, w.y0 - 0.3, w.x1 + 0.14, w.y1 + 0.08);
    fillRect(g, 'rgba(0,0,0,0.12)', w.x0 - 0.14, w.y0 - 0.3, w.x1 + 0.14, w.y0 - 0.22);
    fillRect(g, '#36404c', w.x0, w.y0, w.x1, w.y1);
    g.fillStyle = 'rgba(160,178,200,0.18)';
    g.fillRect(w.x0, w.y0, ww * 0.45, hh * 0.35);
    g.strokeStyle = '#e8e4da';
    g.lineWidth = 0.05;
    g.strokeRect(w.x0 + 0.025, w.y0 + 0.025, ww - 0.05, hh - 0.05);
    g.lineWidth = 0.04;
    g.beginPath();
    g.moveTo(w.x0 + ww / 2, w.y0);
    g.lineTo(w.x0 + ww / 2, w.y1);
    g.moveTo(w.x0, w.y0 + hh * 0.32);
    g.lineTo(w.x1, w.y0 + hh * 0.32);
    g.stroke();
    fillRect(g, '#8f8a82', w.x0 - 0.12, w.y1, w.x1 + 0.12, w.y1 + 0.07);
    if (season) snowLedge(g, season, w.x0 - 0.12, w.x1 + 0.12, w.y1, 0.07, rnd);
    snowLedge(g, season, w.x0 - 0.14, w.x1 + 0.14, w.y0 - 0.3, 0.06, rnd);
  }
  // the cornice
  fillRect(g, o.trim, o.x0 - 0.1, -H, o.x1 + 0.1, -H + 0.35);
  fillRect(g, 'rgba(0,0,0,0.15)', o.x0 - 0.1, -H + 0.35, o.x1 + 0.1, -H + 0.42);
  // the roof's slope seen from the lane: painted iron, the snow lying on it (in the thaw: wet, patchy)
  g.fillStyle = season === 'thaw' ? '#3e4548' : '#55605c';
  g.beginPath();
  g.moveTo(o.x0 - 0.2, -H);
  g.lineTo(o.x0 + 0.4, -H - R);
  g.lineTo(o.x1 - 0.4, -H - R);
  g.lineTo(o.x1 + 0.2, -H);
  g.closePath();
  g.fill();
  if (season === 'thaw') {
    for (let i = 0; i < (o.x1 - o.x0) * 0.8; i++) {
      g.fillStyle = 'rgba(200,204,208,0.55)';
      g.fillRect(o.x0 + rnd() * (o.x1 - o.x0), -H - R * (0.3 + 0.6 * rnd()), 0.4 + rnd(), 0.12 + 0.2 * rnd());
    }
    g.strokeStyle = 'rgba(30,34,38,0.6)';
    g.lineWidth = 0.03;
    for (let x = o.x0 + 0.5; x < o.x1; x += 0.9) {
      g.beginPath();
      g.moveTo(x, -H - R);
      g.lineTo(x - 0.3, -H);
      g.stroke();
    }
  } else {
    g.fillStyle = SNOW;
    g.beginPath();
    g.moveTo(o.x0 - 0.25, -H + 0.05);
    for (let x = o.x0; x <= o.x1; x += 0.3) g.lineTo(x, -H - 0.12 - 0.08 * rnd());
    g.lineTo(o.x1 - 0.4, -H - R - 0.12);
    g.lineTo(o.x0 + 0.4, -H - R - 0.12);
    g.closePath();
    g.fill();
    // icicles along the eaves, short
    g.fillStyle = 'rgba(225,232,240,0.9)';
    for (let x = o.x0; x < o.x1; x += 0.35 + 0.4 * rnd()) {
      const l = 0.08 + 0.22 * rnd();
      g.beginPath();
      g.moveTo(x - 0.03, -H + 0.04);
      g.lineTo(x + 0.03, -H + 0.04);
      g.lineTo(x, -H + 0.04 + l);
      g.closePath();
      g.fill();
    }
  }
  if (o.chimney != null) {
    const cx = o.chimney, top = -H - R - 1.1;
    fillRect(g, '#8a7f74', cx - 0.3, top, cx + 0.3, -H - R + 0.2);
    fillRect(g, '#6e655c', cx - 0.36, top - 0.1, cx + 0.36, top + 0.08);
    if (season !== 'thaw') snowLedge(g, season, cx - 0.36, cx + 0.36, top - 0.1, 0.12, rnd);
    e.at(cx, top - 0.1, 'chimney');
  }
}
// a house front's windows lit from inside (an element that glows, in front of its front): warm panes — some — with
// a curtain's shadow; on a layer `lit`, which the animate fades by a key
function litWindows(g, e, o, share = 0.65) {
  e.layer('lit', {}, gl => {
    for (const w of windowsOf(o)) {
      if (e.rnd() > share) continue;
      const ww = w.x1 - w.x0, hh = w.y1 - w.y0;
      const warm = e.rnd() < 0.8;
      gl.fillStyle = warm ? '#f7c98a' : '#e8e0c8';
      gl.fillRect(w.x0 + 0.05, w.y0 + 0.05, ww - 0.1, hh - 0.1);
      gl.fillStyle = warm ? 'rgba(170,120,70,0.35)' : 'rgba(150,140,120,0.3)';
      gl.fillRect(w.x0 + 0.05, w.y0 + 0.05, ww * 0.22, hh - 0.1);
      gl.fillRect(w.x1 - 0.05 - ww * 0.22, w.y0 + 0.05, ww * 0.22, hh - 0.1);
      gl.strokeStyle = 'rgba(60,50,40,0.6)';
      gl.lineWidth = 0.04;
      gl.beginPath();
      gl.moveTo(w.x0 + ww / 2, w.y0);
      gl.lineTo(w.x0 + ww / 2, w.y1);
      gl.moveTo(w.x0, w.y0 + hh * 0.32);
      gl.lineTo(w.x1, w.y0 + hh * 0.32);
      gl.stroke();
    }
  });
}
// the fronts of the lane, as their paintings and their lit windows both need them (card metres; holes cut)
const FRONTS = {
  // the Gurovs': two floors over a raised ground floor, pale ochre; the door at 0 (the porch's top 0.75), the window
  // upstairs at −2.4 (a hole: its frame, curtain and the room behind are elements of their own)
  house: { x0: -5.4, x1: 5.4, h: 7.6, plinth: 0.75, color: '#d8c49e', trim: '#efe8da', rust: 3.3, roof: 1.4, chimney: -3.4,
    floors: [{ y0: 2.9, y1: 1.35, w: 0.9, xs: [4.4, 2.8, -2.2, -3.8] }, { y0: 5.9, y1: 4.3, w: 0.8, xs: [4.4, 2.8, 1.2, -2.4, -4.0] }],
    holes: [[-0.55, 0.75, 0.55, 3.15], [-2.8, 4.3, -2.0, 5.9]], skip: [[-2.8, -2.0, 1]] },
  // the neighbour's: three floors, pale grey-green; a gateway arch to its yard at 3.1…4.1
  neighbour: { x0: -5.8, x1: 5.8, h: 11, plinth: 0.5, color: '#b9c3b0', trim: '#e6e8de', rust: 3.6, roof: 1.6, chimney: 2.2, pilasters: [-5.6, -1.2, 1.7, 5.6],
    floors: [{ y0: 3.0, y1: 1.2, w: 0.95, xs: [-4.6, -3.0, -0.2, 1.0, 2.3] }, { y0: 6.4, y1: 4.4, w: 0.95, xs: [-4.6, -3.0, -0.2, 1.0, 2.3, 3.6] }, { y0: 9.6, y1: 7.9, w: 0.85, xs: [-4.6, -3.0, -0.2, 1.0, 2.3, 3.6] }],
    holes: [[3.1, 0, 4.1, 3.0]] },
  // the long low house at the near end on the left: one floor and a mezzanine, sand
  low: { x0: -8.5, x1: 8.5, h: 6.4, plinth: 0.6, color: '#cfb894', trim: '#eee6d6', roof: 1.5, chimney: 3.0, pilasters: [-1.4, 1.4],
    floors: [{ y0: 2.9, y1: 1.3, w: 0.9, xs: [-7.4, -5.8, -4.2, -2.6, 2.6, 4.2, 5.8, 7.4] }, { y0: 5.4, y1: 4.3, w: 0.7, xs: [-0.8, 0.8] }] },
  // the baker's: two floors, grey-blue; the shop window (−1.8…0.8) and its door (a hole, 1.2…2.0) below
  shop: { x0: -3.0, x1: 3.0, h: 8.2, plinth: 0.4, color: '#aab4bd', trim: '#e3e4e0', roof: 1.3,
    floors: [{ y0: 6.6, y1: 5.0, w: 0.85, xs: [-2.0, -0.6, 0.8, 2.1] }], holes: [[1.2, 0, 2.0, 2.3]] },
  // the doctors' club: two tall floors, pale grey-white, pilasters; its door behind the portico (a hole)
  club: { x0: -6.0, x1: 6.0, h: 10.5, plinth: 0.6, color: '#d9d5ca', trim: '#f0ece2', rust: 4.6, roof: 1.4, pilasters: [-5.8, -2.6, 1.6, 5.8],
    floors: [{ y0: 4.0, y1: 1.6, w: 1.1, xs: [-4.8, -3.6, 2.6, 3.8, 5.0] }, { y0: 8.6, y1: 6.0, w: 1.1, xs: [-4.8, -3.6, -1.6, 0.6, 2.6, 3.8, 5.0] }],
    holes: [[-1.05, 0.6, 0.05, 3.4]] },
};
// a gas lamp of the lane: a cast-iron post with a crossbar, a four-sided lantern; its light the engine's (`flame`)
function lamp(g, e, season) {
  g.fillStyle = '#2d3036';
  g.beginPath();
  g.moveTo(-0.11, 0);
  g.lineTo(0.11, 0);
  g.lineTo(0.06, -0.5);
  g.lineTo(0.035, -2.75);
  g.lineTo(-0.035, -2.75);
  g.lineTo(-0.06, -0.5);
  g.closePath();
  g.fill();
  g.fillRect(-0.32, -2.62, 0.64, 0.04);
  // the lantern: a frame, pale glass, a cap
  g.fillStyle = '#e9dcc0';
  g.beginPath();
  g.moveTo(-0.13, -2.8);
  g.lineTo(0.13, -2.8);
  g.lineTo(0.18, -3.28);
  g.lineTo(-0.18, -3.28);
  g.closePath();
  g.fill();
  g.strokeStyle = '#2d3036';
  g.lineWidth = 0.025;
  g.stroke();
  g.beginPath();
  g.moveTo(0, -2.8);
  g.lineTo(0, -3.28);
  g.stroke();
  g.fillStyle = '#2d3036';
  g.beginPath();
  g.moveTo(-0.24, -3.28);
  g.lineTo(0.24, -3.28);
  g.lineTo(0, -3.48);
  g.closePath();
  g.fill();
  if (season !== 'thaw') snowLedge(g, season, -0.24, 0.24, -3.32, 0.07, () => e.rnd());
  e.light(0, -3.04, 0.16, '#ffd08a', 1, 'flame');
  e.at(0, -3.04);
}
// a sledge's side (u along it, the horse toward +u): the runners curling up in front, the lacquered body, the high
// back, a fur rug over the side
function sledgeSide(g, e) {
  g.strokeStyle = '#2a2826';
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(-1.05, -0.06);
  g.lineTo(0.75, -0.06);
  g.quadraticCurveTo(1.05, -0.06, 1.0, -0.42);
  g.stroke();
  for (const u of [-0.8, -0.2, 0.4]) {
    g.beginPath();
    g.moveTo(u, -0.06);
    g.lineTo(u + 0.04, -0.32);
    g.stroke();
  }
  g.fillStyle = '#2f3b38';
  g.beginPath();
  g.moveTo(-1.02, -0.32);
  g.lineTo(0.62, -0.32);
  g.quadraticCurveTo(0.92, -0.36, 0.86, -0.92);
  g.lineTo(0.62, -0.78);
  g.lineTo(0.1, -0.72);
  g.lineTo(-0.55, -0.74);
  g.quadraticCurveTo(-0.8, -1.18, -1.02, -1.16);
  g.closePath();
  g.fill();
  g.strokeStyle = '#8c8a7a';
  g.lineWidth = 0.02;
  g.stroke();
  // the fur rug thrown over the side by the seat
  g.fillStyle = '#5a4a3c';
  g.beginPath();
  g.moveTo(-0.6, -0.76);
  g.quadraticCurveTo(-0.25, -0.82, 0.12, -0.74);
  g.lineTo(0.16, -0.46);
  g.quadraticCurveTo(-0.2, -0.4, -0.58, -0.5);
  g.closePath();
  g.fill();
  e.at(-0.35, -0.7);
}
function sledgeBack(g) {
  g.fillStyle = '#2f3b38';
  g.beginPath();
  g.moveTo(-0.46, -0.32);
  g.lineTo(0.46, -0.32);
  g.lineTo(0.42, -1.12);
  g.quadraticCurveTo(0, -1.22, -0.42, -1.12);
  g.closePath();
  g.fill();
  g.strokeStyle = '#8c8a7a';
  g.lineWidth = 0.02;
  g.stroke();
  g.strokeStyle = '#2a2826';
  g.lineWidth = 0.05;
  for (const v of [-0.4, 0.4]) {
    g.beginPath();
    g.moveTo(v, -0.04);
    g.lineTo(v, -0.32);
    g.stroke();
  }
}
// the horse in its shafts (u 0.9…3.6): a bay under a grey-blue blanket, the shaft-bow over its withers; the steam of its
// breath comes from its point `nose`. (driver: a cabman hunched on the box, painted — the official's sledge)
function horse(g, e, driver) {
  const leg = (x, lift) => {
    g.beginPath();
    g.moveTo(x - 0.07, -1.05);
    g.lineTo(x + 0.07, -1.05);
    g.lineTo(x + 0.05 + lift, -0.12);
    g.lineTo(x + 0.08 + lift, -0.02);
    g.lineTo(x - 0.06 + lift, -0.02);
    g.lineTo(x - 0.04 + lift, -0.12);
    g.closePath();
    g.fill();
  };
  g.fillStyle = '#4a3a2f';
  leg(1.55, 0);
  leg(1.75, 0.04);
  leg(2.75, 0.02);
  leg(2.95, -0.03);
  // body, neck, head
  g.beginPath();
  g.moveTo(1.4, -1.0);
  g.quadraticCurveTo(1.3, -1.55, 1.75, -1.58);
  g.lineTo(2.7, -1.6);
  g.quadraticCurveTo(3.05, -1.7, 3.25, -2.05);
  g.quadraticCurveTo(3.45, -2.1, 3.62, -1.75);
  g.lineTo(3.56, -1.62);
  g.quadraticCurveTo(3.35, -1.7, 3.15, -1.45);
  g.quadraticCurveTo(3.0, -1.05, 2.8, -0.98);
  g.closePath();
  g.fill();
  // mane and tail
  g.fillStyle = '#2b221d';
  g.beginPath();
  g.moveTo(2.75, -1.62);
  g.quadraticCurveTo(3.05, -1.78, 3.22, -2.08);
  g.lineTo(3.12, -1.98);
  g.quadraticCurveTo(2.95, -1.7, 2.72, -1.55);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(1.38, -1.42);
  g.quadraticCurveTo(1.18, -1.1, 1.26, -0.62);
  g.lineTo(1.36, -0.64);
  g.quadraticCurveTo(1.32, -1.05, 1.46, -1.35);
  g.closePath();
  g.fill();
  // the blanket, its fringe
  g.fillStyle = '#6d7b8c';
  g.beginPath();
  g.moveTo(1.48, -1.5);
  g.lineTo(2.75, -1.56);
  g.lineTo(2.8, -1.05);
  g.lineTo(1.5, -1.0);
  g.closePath();
  g.fill();
  g.strokeStyle = '#c9c4b4';
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(1.5, -1.02);
  g.lineTo(2.8, -1.07);
  g.stroke();
  // the shafts and the bow over the withers (unpainted wood, a band of carving — no colour)
  g.strokeStyle = '#7b6650';
  g.lineWidth = 0.045;
  g.beginPath();
  g.moveTo(0.86, -0.55);
  g.lineTo(2.85, -1.2);
  g.stroke();
  g.lineWidth = 0.06;
  g.beginPath();
  g.moveTo(2.62, -1.15);
  g.quadraticCurveTo(2.7, -2.45, 2.92, -1.2);
  g.stroke();
  g.strokeStyle = '#3a2f26';
  g.lineWidth = 0.02;
  g.beginPath();
  g.moveTo(3.5, -1.72);
  g.quadraticCurveTo(2.9, -1.5, 2.78, -1.35);
  g.lineTo(0.86, -0.85);
  g.stroke();
  e.at(3.6, -1.68, 'nose');
  if (driver) {
    // the cabman on the box, hunched in his dark coat, a low hat
    g.fillStyle = '#34363c';
    g.beginPath();
    g.moveTo(0.38, -0.78);
    g.lineTo(0.84, -0.78);
    g.quadraticCurveTo(0.86, -1.32, 0.66, -1.48);
    g.quadraticCurveTo(0.48, -1.5, 0.4, -1.3);
    g.closePath();
    g.fill();
    g.fillStyle = '#c9a98c';
    g.beginPath();
    g.arc(0.66, -1.56, 0.09, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#26272b';
    g.fillRect(0.53, -1.72, 0.26, 0.08);
    g.fillRect(0.58, -1.8, 0.16, 0.09);
    g.strokeStyle = '#26272b';
    g.lineWidth = 0.02;
    g.beginPath();
    g.moveTo(0.8, -1.2);
    g.lineTo(2.7, -1.35);
    g.stroke();
  }
}
// one bare lime of the lane: trunk and branches; in winter their tops white with rime, in the thaw dark and wet
function lime(g, e, season) {
  const rnd = () => e.rnd();
  const twigs = [];
  const branch = (x, y, a, len, w, depth) => {
    const x1 = x + Math.sin(a) * len, y1 = y - Math.cos(a) * len;
    g.strokeStyle = season === 'thaw' ? '#2f2b28' : '#4a443e';
    g.lineWidth = w;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo((x + x1) / 2 + (rnd() - 0.5) * len * 0.2, (y + y1) / 2, x1, y1);
    g.stroke();
    if (depth <= 0) { twigs.push([x1, y1]); return; }
    for (let i = 0; i < 3; i++) branch(x1, y1, a + (i - 1) * 0.55 + (rnd() - 0.5) * 0.5, len * (0.66 + 0.12 * rnd()), Math.max(0.03, w * 0.6), depth - 1);
  };
  // the crown's mist of fine twigs (in winter white with rime), then the limbs over it
  const haze = season === 'thaw' ? 'rgba(60,52,46,0.35)' : 'rgba(236,240,246,0.55)';
  for (let k = 0; k < 9; k++) {
    const cx = (rnd() - 0.5) * 3.6, cy = -5.6 - rnd() * 3.0, r = 1.0 + rnd() * 1.2;
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    gr.addColorStop(0, haze);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  }
  branch(0, 0, 0, 3.0, 0.34, 5);
  if (season !== 'thaw') {
    g.fillStyle = 'rgba(244,247,251,0.9)';
    for (const [x, y] of twigs) for (let k = 0; k < 4; k++) g.fillRect(x + (rnd() - 0.5) * 0.6, y + (rnd() - 0.5) * 0.5, 0.08, 0.06);
  }
}
const PAINT = { SNOW, WET_SNOW, rect, fillRect, snowLedge, windowsOf, facade, litWindows, FRONTS, lamp, sledgeSide, sledgeBack, horse, lime };

return {
  num, clamp01, on, XR, XL, KERB_R, KERB_L, PORCH, CLUB_PORCH, DOOR_Z, WIN_UP, CLUB_DOOR_Z, doorFacing, LAMPS, LAMP2,
  HORIZON, SKY, SLEDGE, SLEDGE2, onSledge, sledgeOf, sledge2Of, sledgeKeys, sledge2Keys, seatOf, seat2Of, forward,
  seasonOf, seasonKeys, FAR_END, STOPS, SHADES, SCHOOL_FROM, SCHOOL_TO, walkedOf, HALL, THRESHOLD, PORCH_TOP, STEP_BELOW,
  PORCH_FOOT, UPSTAIRS, CLUB_IN, CLUB_OUT, CLUB_STEP, cam, twoShot, turnTo, CAM, PEOPLE, film, PAINT,
};
