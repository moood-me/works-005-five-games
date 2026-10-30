// The town of S.: what the paintings and the script share — Old Gontcharny Street in metres, the keys' meaning in
// metres, the shots, the film in beats (FILM: modules/beats.js plays it). Metres: across x (right of the start's line
// of sight), distance z (ahead). The start stands on the street's near side, facing the fence.
//   The long grey fence of von Diderits' house runs across the view, its face at z 7.0 (2.4 m high, nails along the
// top): from its corner at x −5.0 (where it turns back along a lane) to its end at x +14 (where the road turns off
// into the fields toward the station). The gate in it at x 2.4…3.4 (hinged on the left, it opens into the yard), the
// lantern on the gate's right post, the poster further right (x 4.4). Behind the fence the yard, the porch (2.9, 13.6)
// and the house's front (z 14.5, x −3…9): its upper window over x +1.15 is hers — the one with the piano. Across the
// street (z −1.6) the near side's fence and bare trees, for the shots looking back. The field beyond the fence's end,
// the railway's bank far off (z 120), a lit train along it now and then.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));

const FENCE_Z = 7.0, FENCE_H = 2.4, CORNER_X = -5.0, END_X = 14.0;
const GATE = { x0: 2.4, x1: 3.4, mid: 2.9 };
const POSTER_X = 4.4;
const LANTERN = [3.47, 6.93, 2.45];
// Gurov along the fence: `gurov_at` 0…1 ↔ across −4.37…+4.83 at z 6.3 (the places p1…p5 at 0.1, 0.3, 0.5, 0.6, 0.85 —
// all five and his head in the 4:3 window of FENCE; p4, under her window, marked high on the fence: two marks not
// nearer than 0.15 of the window)
const GUROV_Z = 6.3, G0 = -4.37, GL = 9.2;
const gurovX = u => G0 + GL * u;
const gurovAt = x => clamp01((x - G0) / GL);
const PLACES = [0.1, 0.3, 0.5, 0.6, 0.85];
const PLACE_H = [0.45, 0.45, 0.45, 1.95, 0.45];      // where on the fence each place is marked (metres up)
const WINDOW_X = gurovX(0.6);                         // her window over p4
// Anna along the fence: `anna_at` 0…1 ↔ the gate … the fence's end, at z 6.1
const ANNA_Z = 6.1, A0 = GATE.mid, AL = 13.5 - GATE.mid;
const annaX = u => A0 + AL * u;
const annaAt = x => clamp01((x - A0) / AL);
// the yard: the porch, the maid by it, the old spitz at her feet
const PORCH = [2.9, 13.4];
const MAID_PORCH = [2.25, 12.5], DOG_PORCH = [2.85, 12.15];
const IN_GATE = [2.9, 8.7];                           // inside the gate, clear of its leaf, hidden by the fence
const LANE = [-5.85, 8.6];                            // round the corner, in the lane's mouth
const CAB = [11.0, 4.0];                              // the cab on the road: the horse's head toward the right
const CABMAN = [10.15, 3.75];                         // by the sledge, before the horse's flank: the horse whole beyond him
const ROAD = [16.6, 9.6];                             // Anna on the road beyond the fence's end, looking at the fields
const FAR_TRAIN = { z: 120, from: -260, to: 330 };    // the train along the bank: `far_train` 0…1 → across
const farTrainX = u => FAR_TRAIN.from + (FAR_TRAIN.to - FAR_TRAIN.from) * clamp01(u);

// ── painting helpers (a card's own metres, y up negative) ──
// the season's ground colours: autumn — dark earth and leaves; winter — snow; thaw — grey wet snow and dark slush
const SEASONS = {
  autumn: { ground: '#5a5046', dark: '#3e3630', light: '#7a6c5a', snow: null, leaf: ['#8a6a3a', '#6e5232', '#a07a42'] },
  winter: { ground: '#e4e6ec', dark: '#c4c8d4', light: '#f4f5f8', snow: '#f2f3f7', leaf: null },
  thaw: { ground: '#b4b4b4', dark: '#6e6c6a', light: '#cfcfd0', snow: '#c8c9cc', leaf: null },
};
const seasonOf = s => SEASONS[s] || SEASONS.winter;
// a stretch of the grey board fence, x0…x1 along its face: boards with gaps, two rails seen through the gaps, a row of
// nails along the top; snow or wet snow lying along its top by the season
function fenceBoards(g, x0, x1, season, seed = 0) {
  const S = seasonOf(season), H = FENCE_H;
  for (let x = x0, i = 0; x < x1 - 0.001; x += 0.16, i++) {
    const w = Math.min(0.15, x1 - x), h = H - 0.04 + anim.hash(i, 3 + seed) * 0.06;
    const tone = 128 + Math.round(anim.hash(i, 1 + seed) * 22);
    g.fillStyle = `rgb(${tone},${tone + 2},${tone + 6})`;
    g.fillRect(x, -h, w, h);
    g.fillStyle = 'rgba(60,62,70,0.25)';
    g.fillRect(x + w * 0.65, -h, w * 0.08, h);
    g.fillStyle = 'rgba(40,40,46,0.35)';
    for (let k = 0; k < 3; k++) { const y = -0.3 - anim.hash(i * 3 + k, 7 + seed) * (h - 0.4); g.fillRect(x + w * 0.2, y, w * 0.25, 0.01); }
    g.fillStyle = '#5a5a5e';                                                   // the nail at the top
    g.fillRect(x + w * 0.45, -h - 0.07, 0.012, 0.08);
    if (S.snow) { g.fillStyle = S.snow; g.beginPath(); g.ellipse(x + w / 2, -h, w * 0.55, 0.035, 0, Math.PI, 0); g.fill(); }
  }
  g.fillStyle = 'rgba(70,72,80,0.5)';                                          // its foot, damp
  g.fillRect(x0, -0.18, x1 - x0, 0.18);
  if (S.snow) {                                                                // a drift against its foot
    g.fillStyle = S.snow;
    g.beginPath(); g.moveTo(x0, 0.02);
    for (let x = x0; x <= x1 + 0.01; x += 0.3) g.lineTo(x, -0.12 - 0.1 * Math.abs(Math.sin(x * 1.7 + seed)));
    g.lineTo(x1, 0.02); g.closePath(); g.fill();
  }
}
// a bare tree (a birch in the yard, a lime across the street): trunk and branches; snow along the branches in winter
function bareTree(g, h, season, seed, birch) {
  const S = seasonOf(season);
  const branch = (x, y, a, len, w, depth) => {
    const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len;
    g.strokeStyle = birch && depth < 2 ? '#d8d6d0' : '#4a4440'; g.lineWidth = w;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    if (S.snow && depth > 0 && w > 0.03) { g.strokeStyle = S.snow; g.lineWidth = w * 0.4; g.beginPath(); g.moveTo(x, y - w * 0.4); g.lineTo(x2, y2 - w * 0.4); g.stroke(); }
    if (depth < 5) for (let k = 0; k < 2; k++) branch(x2, y2, a + (k ? 1 : -1) * (0.35 + anim.hash(depth * 7 + k + seed, 5) * 0.4), len * 0.72, w * 0.62, depth + 1);
  };
  g.lineCap = 'round';
  branch(0, 0, 0, h * 0.42, h * 0.035, 0);
  if (birch) { g.fillStyle = '#2c2a28'; for (let i = 0; i < 8; i++) g.fillRect(-h * 0.017, -i * h * 0.05 - 0.2, h * 0.02, 0.03); }
}

// ── the shots: place x, z (metres), the eye's height, yaw (right of straight ahead), pitch (up) ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0,
  spitz_face: (yaw + 180) % 360 });                    // the spitz's card turned to the shot's camera (spitz.md)
const CAM = {
  FENCE: cam(0, 0, 1.7),                 // the fence across the view: Gurov 0.29 of the frame, p1…p5 in the 4:3 window
  GATE: cam(-1.05, -0.5, 1.7, 0, 0),     // a little back and left: the corner (x −5) and the gate both in the 4:3 window
  WALK: cam(-0.5, 1.2, 1.7, 45, -2),     // along the fence toward its end: Anna from the gate (0.27) to the end (0.12)
  ROAD: cam(15.2, 4.2, 1.75, 10, 1),     // from the fence's end along the road into the fields: her back, the bank, the train
  ROAD_FACE: cam(15.35, 9.75, 1.5, 88, 0),   // her face in profile, 1.3 m, the train's lights beyond
  GATE_TWO: cam(4.85, 5.5, 1.6, 295, 3),     // the two at the gate under the lantern, side by side, three-quarter, medium
  FENCE_FACE: cam(-4.75, 5.55, 1.75, 62, 0), // Gurov at p1 in three-quarter, looking at the fence
  DUSK_WIDE: cam(2.6, 0.3, 1.7, 8, 0),       // along the fence at dusk: the gate, the lantern, the poster
  DUSK_FACE: cam(6.05, 6.7, 1.7, 220, 3),    // Gurov before the poster, from the fence's side: his face in the lantern's light
  LEAVE: cam(1.0, -1.0, 1.75, 32, 0),        // the morning: the gate, the yard through it, the cab on the road
  LEAVE_TWO: cam(4.7, 5.35, 1.6, 300, 0),    // the two at the gate side by side, three-quarter
  ANNA_FACE: cam(3.65, 5.3, 1.5, 305, 0),    // her face, past him
  HIS_FACE: cam(3.5, 5.95, 1.62, 333, 7),      // his face close: he looks down and away, past her
  YARD: cam(1.8, 8.4, 1.6, 12, -3),          // in the yard toward the porch
  PORCH: cam(5.6, 14.0, 1.7, 218, -2),       // from beside the porch back toward the gate and the street
  HER_GATE: cam(3.45, 6.6, 1.5, -124, -4),   // her face beside him, 1.1 m, she looking up at him — under her choice
  END_GATE: cam(2.2, 2.2, 1.55, 11, 3),      // the epilogue: he at the gate with the old spitz, her dark window over him
};
// the medium two at the gate under the choice: Gurov (three-quarter, toward us) and the maid with the spitz at her feet;
// from the street, a little to the maid's side — where “By the fence” left him (`under`)
const gateTwo = under => {
  const gx = gurovX(under ? 0.6 : 0.15), mx = under ? gurovX(0.6) + 1.5 : -1.2;
  const cx = mx + 0.6, cz = 2.6, tx = (gx + mx) / 2, tz = 6.0;
  return cam(cx, cz, 1.6, Math.atan2(tx - cx, tz - cz) * 180 / Math.PI, -10);
};

function film(scene) {
  const on = k => Number(scene.get(k)) > 0.5;
  const C = () => scene.kit.cast.characters;
  // where people look or reach at the spitz: a point from its place keys (spitz.md — not its own points, which it marks
  // after the people have moved)
  const dogAt = (st, part = 'head', up = 0) => scene.kit.spitz.at(st, part, up);
  const season = () => (on('spring') ? 'thaw' : 'winter');
  // the light of each time: `dusk`, `morning` — the scene's looks; the sun's low light at dusk; the gate's lantern
  const AUTUMN_DUSK = { season: 'autumn', hour: 0.78, dusk: 1, morning: 0, sunset: 1, lamp: 1, snow: 0, wet_k: 0.12, wind: 1, drip: 0 };
  const GREY_DAY = { season: 'winter', hour: 0.5, dusk: 0, morning: 0, sunset: 0, lamp: 0, snow: 0.35, wet_k: 0, wind: 0, drip: 0 };
  const WINTER_DUSK = { season: 'winter', hour: 0.8, dusk: 1, morning: 0, sunset: 1, lamp: 1, snow: 0.15, wet_k: 0, wind: 0, drip: 0 };
  const MORNING = () => (on('spring')
    ? { season: 'thaw', hour: 0.36, dusk: 0, morning: 1, sunset: 0, lamp: 0, snow: 0, wet_k: 0.4, wind: 0, drip: 1 }
    : { season: 'winter', hour: 0.36, dusk: 0, morning: 1, sunset: 0, lamp: 0, snow: 0.2, wet_k: 0, wind: 0, drip: 0 });
  const EVENING = () => ({ ...WINTER_DUSK, season: season(), snow: on('spring') ? 0 : 0.2, wet_k: on('spring') ? 0.4 : 0, drip: on('spring') ? 1 : 0 });

  const hidden = id => ({ [`${id}_here`]: false, [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_do`]: 'stand',
    [`${id}_gait`]: null, [`${id}_mood`]: null });
  const at = (id, [a, d], turn, extra = {}) => ({ [`${id}_here`]: true, [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_turn`]: turn, ...extra });
  const dog = (p, extra = {}) => ({ spitz_here: 1, spitz_a: p[0], spitz_d: p[1], spitz_e: 0, spitz_view: 'side', spitz_do: 'stand', spitz_look: null,
    spitz_old: 0, ...extra });
  // where every beat may begin from: nobody in the street, the gate shut, the window dark
  const base = extra => ({
    ...CAM.FENCE, ...GREY_DAY, gate: 0, window: 0, far_train: 0, inkwell: 0, dog_follow: 0, dog_lead: 'none',
    ...hidden('anna'), anna_a: IN_GATE[0], anna_d: IN_GATE[1], anna_turn: 180, anna_wear: C().anna_winter,
    ...hidden('gurov'), gurov_a: gurovX(0.1), gurov_d: GUROV_Z, gurov_turn: 270,
    ...hidden('diderits'), diderits_a: IN_GATE[0], diderits_d: IN_GATE[1] + 0.6, diderits_turn: 180,
    ...hidden('maid'), maid_a: MAID_PORCH[0], maid_d: MAID_PORCH[1], maid_turn: 180,
    ...hidden('cabman'), cabman_a: CABMAN[0], cabman_d: CABMAN[1], cabman_turn: 90, cab: 0,
    spitz_here: 0, spitz_a: DOG_PORCH[0], spitz_d: DOG_PORCH[1], spitz_e: 0, spitz_view: 'side', spitz_dir: 0, spitz_do: 'stand', spitz_look: null,
    spitz_old: 0, leash: 'none',
    ...extra,
  });
  // the morning of her going: she by the gate with her bag, he holding the gate; the maid with the old spitz by the
  // porch; the cabman at his horse on the road, his back to them
  const LEAVING = () => {
    const d = dog(DOG_PORCH, { spitz_do: 'sit', spitz_old: 1, spitz_dir: 1, spitz_look: 'anna' });
    return {
    ...MORNING(), ...CAM.LEAVE, gate: 1, window: 0, cab: 1,
    ...at('anna', [2.55, 6.0], 35, { anna_wear: C().anna_winter, anna_with: ['bag'], anna_mood: 'sad' }),
    ...at('diderits', [3.05, 6.85], 200, { diderits_look: 'anna', diderits_mood: 'thinking' }),
    ...at('maid', MAID_PORCH, 160, { maid_look: dogAt(d) }),
    ...at('cabman', CABMAN, 75, { cabman_look: [11.9, 4.0, 1.3] }),
    ...d, leash: 'maid#hand_r',
    };
  };
  // the spitz follows who leads it (the scene's script keeps it ahead of them as they walk)
  const lead = (who, d = 1) => ({ dog_follow: d, dog_lead: who });
  // the gate opening: Gurov where “By the fence” left him (under 1 — under her window, 0 — by the far end), the maid
  // and the old spitz behind the gate; `under` is the game's (read, not set)
  const gateOpen = () => {
    const u = on('under') ? 0.6 : 0.15;
    return base({ ...GREY_DAY, ...CAM.GATE, window: 1, gurov_at: u,
      ...at('gurov', [gurovX(u), GUROV_Z], on('under') ? 90 : 60, { gurov_wear: C().gurov_winter, gurov_mood: 'tired', gurov_look: [GATE.mid, FENCE_Z, 1.2] }),
      ...at('maid', IN_GATE, 180), ...dog([IN_GATE[0] - 0.3, IN_GATE[1] - 0.6], { spitz_old: 1 }), leash: 'maid#hand_r', ...lead('maid') });
  };

  return {
    // late autumn at dusk; the wind, leaves on the ground; she comes out of the gate with the spitz on its leash and walks
    // along the fence toward its end — under L47 and “The leash”
    autumn_walk: {
      from: () => base({ ...AUTUMN_DUSK, ...CAM.WALK, window: 1,
        ...at('anna', IN_GATE, 180, { anna_wear: C().anna_autumn, anna_mood: 'sad' }),
        ...dog([IN_GATE[0] + 0.45, IN_GATE[1] - 0.6], {}), leash: 'anna#hand_l', ...lead('anna') }),
      run: async s => {
        const anna = s.person('anna');
        await s.move('gate', 1, { over: 1.1, ease: 'inOut' });
        await anna.walk([[GATE.mid, ANNA_Z]]);
        s.move('gate', 0, { over: 1.4, ease: 'inOut' });
        anna.look([10, 9, 1.4]);
        await anna.walk([[annaX(0.3), ANNA_Z]]);
        await anna.turn(90);
        await s.wait(2);
      },
    },
    // a cut: the fence's end, the road into the fields; she stands, the spitz at her feet; far off a lit train goes
    // along the bank; a cut — her face in profile, she looks after the lights
    road_end: {
      from: () => base({ ...AUTUMN_DUSK, ...CAM.ROAD,
        ...at('anna', ROAD, 0, { anna_wear: C().anna_autumn, anna_look: [40, 120, 3], anna_mood: 'sad' }),
        ...dog([ROAD[0] + 0.55, ROAD[1] + 0.35], { spitz_do: 'sit', spitz_dir: 1 }), leash: 'anna#hand_l' }),
      run: async s => {
        const face = s.shot({ ...CAM.ROAD_FACE });
        await s.wait(1.5);
        s.tell('road_end:train');
        s.move('far_train', 1, { over: 24, ease: 'linear' });
        await s.wait(3.5);
        await s.until(() => face.ready);
        face.cut();
        s.person('anna').look([farTrainX(0.3), FAR_TRAIN.z, 3]);
        await s.wait(5);
      },
    },
    // (after “The leash”) she goes back to the gate from where she is; (after road_end) a cut — she by the gate. Her
    // husband comes out with his coat over his arm and puts it on her shoulders; faces: his kind short-sighted face,
    // hers past him — under L48; they go in at the gate
    gate_home: {
      after: 'autumn_walk',
      from: () => base({ ...AUTUMN_DUSK, ...CAM.WALK, window: 1,
        ...at('anna', [GATE.mid - 0.2, ANNA_Z], 30, { anna_wear: C().anna_autumn, anna_mood: 'sad' }),
        ...dog([GATE.mid + 0.9, ANNA_Z - 0.3], {}), leash: 'anna#hand_l', ...lead('anna', 0) }),
      run: async s => {
        const anna = s.person('anna'), d = s.person('diderits');
        s.set('dog_follow', 1);
        anna.gait(null);
        if (Math.abs(s.state.anna_a - (GATE.mid - 0.2)) > 0.2) await anna.walk([[GATE.mid - 0.2, ANNA_Z]]);
        await anna.turn(30);
        const two = s.shot({ ...CAM.GATE_TWO });
        d.with(['coat_carried']);
        await s.move('gate', 1, { over: 1, ease: 'inOut' });
        d.here(true);
        await d.walk([[GATE.mid + 0.1, 6.75]]);
        await d.turn(205);
        await s.until(() => two.ready);
        two.cut();
        d.look('anna');
        d.mood('smile');
        d.reach({ r: 'anna#shoulder_r', l: 'anna#shoulder_l' });
        await s.wait(1.2);
        d.with(null);
        anna.with(['coat_over']);
        d.reach(null);
        anna.look([5, 3, 1.6]);
        s.tell('gate_home:coat');
        await s.wait(4);
        anna.look(null);
        s.set('dog_follow', 1);
        await s.all(anna.walk([[GATE.mid, 6.6], IN_GATE]), (async () => { await s.wait(0.5); await d.walk([IN_GATE]); })());
        anna.here(false); d.here(false); s.set('spitz_here', 0);
        await s.move('gate', 0, { over: 1.2, ease: 'inOut' });
      },
    },
    // the close-up of the inkstand at the hotel (the module closeups) — under L59
    inkwell: {
      from: () => base({ ...GREY_DAY, inkwell: 1 }),
      run: async s => { await s.wait(6); },
    },
    // a cut, the close-up shut: winter, a grey day, snow along the fence's top; Gurov comes along the fence, stops and
    // looks at it; faces: his profile, tired — under L60, L61; back to the fence
    fence: {
      from: () => base({ ...GREY_DAY, window: 1, inkwell: 0, ...at('gurov', [gurovX(0.62), GUROV_Z], 270, { gurov_wear: C().gurov_winter, gurov_mood: 'tired' }) }),
      run: async s => {
        const g = s.person('gurov');
        await g.walk([[gurovX(0.1), GUROV_Z]]);
        g.look([gurovX(0) - 2, FENCE_Z, 2.3]);
        const face = s.shot({ ...CAM.FENCE_FACE });
        await g.turn(270);
        s.tell('fence:stops');
        await s.until(() => face.ready);
        face.cut();
        const back = s.shot({ ...CAM.FENCE });
        await s.wait(5.5);
        await s.until(() => back.ready);
        back.cut();
        g.look(null);
      },
    },
    // he stands by the first place; the window over the fence is lit — under “By the fence”
    fence_wait: {
      after: 'fence',
      from: () => base({ ...GREY_DAY, window: 1, ...at('gurov', [gurovX(0.1), GUROV_Z], 0, { gurov_wear: C().gurov_winter, gurov_mood: 'tired' }), gurov_at: 0.1 }),
      run: async s => { await s.person('gurov').turn(0); await s.wait(1.4); },
    },
    // a cut: under 1 he stands under her window, under 0 by the far end; the gate opens, the old maid comes out with the
    // old spitz on its leash — under 1 right by him, she looks up at him; under 0 she goes a few steps along the fence
    // toward the corner; the spitz sniffs the snow — under the choice (the spitz, the fence's corner)
    gate_open: {
      from: gateOpen,
      run: async s => {
        const maid = s.person('maid'), g = s.person('gurov');
        await s.move('gate', 1, { over: 1.4, ease: 'inOut' });
        const stop = on('under') ? [gurovX(0.6) + 1.5, 6.15] : [-1.2, 6.15];
        await maid.walk([[GATE.mid, 6.4], stop]);
        await maid.turn(270);
        maid.look(on('under') ? 'gurov' : null);
        if (on('under')) maid.mood('surprised');
        g.look('maid');
        const two = s.shot({ ...gateTwo(on('under')) });
        await g.turn(90);
        s.set('dog_follow', 0);
        s.set('spitz_do', 'sniff');
        await s.wait(0.8);
        await s.until(() => two.ready);
        two.cut();
        await s.wait(1.4);
      },
    },
    // he stoops and beckons; the spitz pulls and runs to him (the maid dragged two steps), stands up with its paws on his
    // knees; faces: the maid holds it back and looks long at Gurov
    call_run: {
      after: 'gate_open', from: gateOpen,
      run: async s => {
        const g = s.person('gurov'), maid = s.person('maid');
        await g.turn(90);
        g.look(dogAt(s.state));
        g.do('beckon_low');
        s.set('spitz_do', 'run'); s.set('spitz_look', 'gurov');
        const gx = s.state.gurov_a, mx = s.state.maid_a;
        await s.all(s.path(['spitz_a', 'spitz_d'], [[gx + 0.35, 6.25]], { speed: 3.2 }),
          (async () => { await s.wait(0.3); await maid.walk([[mx - 0.6, 6.15]]); })());
        s.set('spitz_do', 'up');
        g.look(dogAt(s.state));
        const face = s.shot({ camera_target: 'maid', camera_shot: 'medium', camera_glide: 0 });
        await s.wait(1.2);
        await s.until(() => face.ready);
        face.cut();
        maid.look('gurov'); maid.mood('thinking');
        maid.reach({ r: [mx - 0.3, 6.0, 0.8] });
        await s.wait(5);
      },
    },
    // he beckons; the spitz barks and backs away; the maid looks at Gurov and quickly leads it in at the gate
    call_bark: {
      after: 'gate_open', from: gateOpen,
      run: async s => {
        const g = s.person('gurov'), maid = s.person('maid');
        await g.turn(90);
        g.look(dogAt(s.state));
        g.do('beckon_low');
        s.set('spitz_do', 'bark'); s.set('spitz_look', 'gurov'); s.set('spitz_dir', s.state.gurov_a < s.state.spitz_a ? -1 : 1);
        await s.wait(1.2);
        await s.path(['spitz_a', 'spitz_d'], [[s.state.maid_a + 0.3, 6.0]], { speed: 1.2 });
        g.look(dogAt(s.state));
        maid.look('gurov'); maid.mood('afraid');
        await s.wait(1.4);
        s.set('spitz_do', 'stand'); s.set('spitz_dir', 0);
        maid.look(null);
        s.set('dog_follow', 1); s.set('dog_lead', 'maid');
        await maid.walk([[GATE.mid, 6.4], IN_GATE]);
        maid.here(false); s.set('spitz_here', 0);
        await s.move('gate', 0, { over: 1.2, ease: 'inOut' });
        g.look([GATE.mid, FENCE_Z, 1.3]);
        await s.wait(1.5);
      },
    },
    // he steps back round the fence's corner; the maid and the spitz go past along the fence; the spitz stops at the
    // corner and sniffs the air; (dog_pat 1) it strains toward the corner, up on its hind legs, and she pulls it away;
    // (0) it goes on
    corner_hide: {
      after: 'gate_open', from: gateOpen,
      run: async s => {
        const g = s.person('gurov'), maid = s.person('maid');
        const wide = s.shot({ ...CAM.GATE });                   // from the medium two of the choice: the corner in view
        await s.until(() => wide.ready);
        wide.cut();
        g.look(null);
        await g.walk([[CORNER_X - 0.5, GUROV_Z], LANE]);
        await g.turn(120);
        g.look('maid');
        s.set('spitz_do', 'stand');
        s.set('dog_follow', 1); s.set('dog_lead', 'maid');
        maid.mood(null);
        await maid.walk([[CORNER_X + 1.3, 6.15]]);
        s.set('dog_follow', 0);
        s.set('spitz_do', 'sniff'); s.set('spitz_look', 'gurov');
        await s.wait(1.6);
        if (on('dog_pat')) {
          s.set('spitz_do', 'run');
          await s.path(['spitz_a', 'spitz_d'], [[CORNER_X - 0.2, 6.75]], { speed: 1.5 });
          s.set('spitz_do', 'up');
          maid.look(dogAt(s.state));
          maid.reach({ r: [CORNER_X + 0.6, 6.3, 0.7] });
          await s.wait(2);
          maid.reach(null);
          s.set('spitz_do', 'stand');
        } else await s.wait(0.8);
        s.set('spitz_look', null);
        s.set('dog_follow', 1);
        await maid.walk([[CORNER_X - 2.4, 6.1], [CORNER_X - 9, 6.0]]);
        maid.here(false); s.set('spitz_here', 0);
        await s.wait(0.5);
      },
    },
    // a cut: the dusk; he goes along the fence away; under the lantern a poster; he stops before it, his face in the
    // lantern's light — under L64, L65
    fence_dusk: {
      from: () => base({ ...WINTER_DUSK, ...CAM.DUSK_WIDE, window: 1, ...at('gurov', [gurovX(0.4), GUROV_Z], 90, { gurov_wear: C().gurov_winter, gurov_mood: 'tired' }) }),
      run: async s => {
        const g = s.person('gurov');
        await g.walk([[5.2, 5.7]]);
        const face = s.shot({ ...CAM.DUSK_FACE });
        await g.turn(330);
        g.look('fence#poster');
        await s.until(() => face.ready);
        face.cut();
        s.tell('fence_dusk:poster');
        await s.wait(5);
        g.mood('sad');
        await s.wait(2);
      },
    },
    // a morning; (spring) the snow or the thaw. From the street: she by the gate with her bag, he holding the gate; the
    // maid with the spitz by the porch, seen through the gate; the cabman at his horse, his back to them. Faces: a cut —
    // the two in three-quarter, he turns to her — under L77 and the choice
    gate_leave: {
      from: () => base({ ...LEAVING() }),
      run: async s => {
        const d = s.person('diderits');
        const two = s.shot({ ...CAM.LEAVE_TWO });
        await s.wait(3.5);
        await s.until(() => two.ready);
        two.cut();
        await d.turn(215);
        d.look('anna');
        s.tell('gate_leave:asks');
        const her = s.shot({ ...CAM.HER_GATE });
        await s.wait(1.6);
        s.person('anna').look('diderits#head');
        await s.wait(1.4);
        await s.until(() => her.ready);
        her.cut();
        await s.wait(0.8);
      },
    },
    // the lie: he takes an envelope from his pocket and gives it to her (leave_lie:envelope, L114); bows and kisses her
    // hand; her face close, past him; she goes into the yard, stoops to the spitz sitting at the maid's feet and strokes
    // it; she goes to the cab (leave_lie:goes); the spitz stays sitting, looking after her; (talk 1) he stays at the gate
    // and looks after her a long while, (0) he goes into the house
    leave_lie: {
      after: 'gate_leave', from: () => base({ ...LEAVING(), ...CAM.LEAVE_TWO, diderits_turn: 215 }),
      run: async s => {
        const anna = s.person('anna'), d = s.person('diderits');
        const two = s.shot({ ...CAM.LEAVE_TWO });               // from her face under the choice back to the two
        await s.until(() => two.ready);
        two.cut();
        anna.look('diderits#head');
        d.with(['envelope']);
        await d.do('give_small');
        anna.do('take_small');
        await s.wait(0.9);
        d.with(null); anna.with(['bag', 'envelope']);
        s.tell('leave_lie:envelope');
        await s.wait(1.5);
        d.reach({ r: 'anna#hand_r' }); anna.reach({ r: [2.85, 6.45, 1.0] });
        await d.do('kiss_hand');
        d.reach(null); anna.reach(null);
        const face = s.shot({ ...CAM.ANNA_FACE });
        await anna.turn(150);
        anna.look([11, 4, 1.4]);
        await s.until(() => face.ready);
        face.cut();
        await s.wait(3);
        const yard = s.shot({ ...CAM.YARD, anna_a: GATE.mid, anna_d: 7.6, anna_turn: 0, anna_look: dogAt(s.state), diderits_here: false });
        await s.until(() => yard.ready);
        yard.cut();
        await anna.walk([[2.75, 11.35]]);
        await anna.go('bend_take', { to: [2.75, 11.35], turn: 10 });
        anna.reach({ l: dogAt(s.state, 'back') });
        s.set('spitz_look', 'anna');
        await s.wait(1.4);
        anna.reach(null);
        const porch = s.shot({ ...CAM.PORCH, diderits_here: true, diderits_a: 3.05, diderits_d: 6.85, diderits_turn: 10, diderits_look: 'anna' });
        await anna.turn(190);
        s.tell('leave_lie:goes');
        await s.until(() => porch.ready);
        porch.cut();
        const goes = anna.walk([[GATE.mid, 7.4], [GATE.mid, 6.0], [6.5, 4.6]]);
        if (on('talk')) { d.look('anna'); await s.wait(5); }
        else { await s.wait(1.2); d.look(null); await d.walk([[GATE.mid, 8.6], [PORCH[0], 13.0]]); d.here(false); }
        await goes;
        anna.here(false);
        await s.wait(1);
      },
    },
    // the truth, with no music: the two at the gate; she comes close to him (leave_truth:close, L80, quietly); a cut —
    // his face close; he stands still (talk 1: leave_truth:still, under L81); he answers, not looking at her, down and
    // past her (leave_truth:answer, L82); from the porch: he goes into the yard himself, takes the leash from the maid;
    // she goes to the cab without the spitz; it strains after her from his hand, up on its hind legs (leave_truth:pulls);
    // he holds it — at the end by the porch with the spitz, the maid beside him
    leave_truth: {
      after: 'gate_leave', from: () => base({ ...LEAVING(), ...CAM.LEAVE_TWO, diderits_turn: 215 }),
      run: async s => {
        const anna = s.person('anna'), d = s.person('diderits'), maid = s.person('maid');
        const two = s.shot({ ...CAM.LEAVE_TWO });               // from her face under the choice back to the two
        await s.until(() => two.ready);
        two.cut();
        await anna.walk([[2.8, 6.38]]);
        await anna.turn(35);
        anna.look('diderits');
        s.tell('leave_truth:close');
        const his = s.shot({ ...CAM.HIS_FACE });
        await s.wait(3.2);
        await s.until(() => his.ready);
        his.cut();
        d.mood('sad');
        d.look('anna');
        if (on('talk')) { s.tell('leave_truth:still'); await s.wait(2.2); }
        d.look([4.6, 5.3, 1.15]);
        s.tell('leave_truth:answer');
        await s.wait(4.5);
        const porch = s.shot({ ...CAM.PORCH });
        await s.until(() => porch.ready);
        porch.cut();
        await d.walk([[GATE.mid, 8.4], [3.35, 12.3]]);
        await d.turn(250);
        d.reach({ r: 'maid#hand_r' });
        await d.do('take_small');
        d.reach(null);
        s.set('leash', 'diderits#hand_r');
        anna.with(['bag']);
        const goes = anna.walk([[3.6, 5.6], [6.5, 4.6]]);
        await s.wait(1.4);
        s.set('spitz_do', 'run'); s.set('spitz_look', 'anna');
        await s.path(['spitz_a', 'spitz_d'], [[2.6, 10.6]], { speed: 2.2 });
        s.set('spitz_do', 'up');
        d.look(dogAt(s.state));
        d.reach({ r: [2.85, 11.0, 0.8] });
        s.tell('leave_truth:pulls');
        maid.look('diderits');
        await goes;
        anna.here(false);
        await s.wait(2);
      },
    },
    // the epilogue, an evening, the lantern; (husband_knows 0) he walks the old spitz along the fence himself; (1) he
    // stands at the gate with the spitz on its leash, looks down at it, then turns his back to us and looks up at her
    // window, dark (a little nearer: END_GATE); (spring) snow or thaw
    fence_end: {
      from: () => {
        const knows = on('husband_knows');
        return base({ ...EVENING(), ...(knows ? CAM.END_GATE : {}), window: knows ? 0 : 1, gate: knows ? 1 : 0,
          ...at('diderits', knows ? [GATE.mid + 0.15, 6.6] : [gurovX(0.75), 6.3], knows ? 200 : 270, { diderits_wear: C().diderits_coat }),
          ...dog(knows ? [GATE.mid - 0.5, 6.0] : [gurovX(0.75) - 1.3, 6.1], { spitz_old: 1, spitz_do: knows ? 'sit' : 'stand' }),
          leash: 'diderits#hand_r', ...lead('diderits') });
      },
      run: async s => {
        const d = s.person('diderits');
        if (on('husband_knows')) {
          d.look(dogAt(s.state));
          await s.wait(3);
          d.look(null);
          await d.turn(346);                                    // his back to us: up at her window, dark
          d.look([WINDOW_X, 14.4, 4.0]);
          await s.wait(7);
        } else {
          await d.walk([[gurovX(0.1), 6.3]]);
          await s.wait(1.5);
        }
      },
    },
  };
}

return {
  SEASONS, seasonOf, fenceBoards, bareTree,
  clamp01, FENCE_Z, FENCE_H, CORNER_X, END_X, GATE, POSTER_X, LANTERN, GUROV_Z, gurovX, gurovAt, PLACES, PLACE_H, WINDOW_X,
  ANNA_Z, annaX, annaAt, PORCH, MAID_PORCH, DOG_PORCH, IN_GATE, LANE, CAB, CABMAN, ROAD, FAR_TRAIN, farTrainX, CAM, cam, film,
};
