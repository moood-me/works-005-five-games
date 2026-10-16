// The Grays' hall: what its paintings and its film share. Metres: across (right of the start), distance (ahead of it),
// elevation (over the floor). The hall is across −4…4.5, distance −1.5…9, 6 m high; it looks north-north-west.
const A = anim, C = kit.cast, N = kit.nebo;

// ── where things are ──
const plan = {
  // the ladder along the far wall: in its corner by the windows (ladder 0), under the crucifixion (1)
  ladder: [-3.55, -2.45],
};

// ── the crucifixion: the canvas (1.76 × 2.56 m; x across from its middle, y up from its foot — negative) ──
// The picture itself, without its nails' fresh paint: a dark ground, a pale light behind the cross, the cross, the
// figure — long, quiet, the head bowed; the nails in the hands and the feet, a dark trickle under each.
const NAILS = [[-0.66, -1.995, -0.1, 'nail1'], [0.66, -1.995, 0.1, 'nail2'], [0, -0.47, Math.PI / 2, 'nail3']];
function crucifixion(g) {
  const bg = g.createLinearGradient(0, -2.58, 0, -0.02);
  bg.addColorStop(0, '#2f2a26');
  bg.addColorStop(0.6, '#3c342c');
  bg.addColorStop(1, '#262220');
  g.fillStyle = bg;
  g.fillRect(-0.88, -2.58, 1.76, 2.56);
  const halo = g.createRadialGradient(0, -1.75, 0.05, 0, -1.6, 1.1);
  halo.addColorStop(0, 'rgba(214,196,160,0.55)');
  halo.addColorStop(0.5, 'rgba(170,150,118,0.18)');
  halo.addColorStop(1, 'rgba(170,150,118,0)');
  g.fillStyle = halo;
  g.fillRect(-0.88, -2.58, 1.76, 2.56);
  g.fillStyle = '#3a2c20';
  g.fillRect(-0.05, -2.45, 0.1, 2.3);
  g.fillRect(-0.76, -2.06, 1.52, 0.09);
  const SKIN = '#cdbca2', SHADE = '#9e8c74';
  g.fillStyle = SKIN;
  // the arms along the beam, from the shoulders to the hands
  for (const k of [-1, 1]) {
    g.beginPath();
    g.moveTo(k * 0.1, -1.86);
    g.quadraticCurveTo(k * 0.4, -1.93, k * 0.68, -2.02);
    g.lineTo(k * 0.68, -1.97);
    g.quadraticCurveTo(k * 0.4, -1.86, k * 0.1, -1.76);
    g.closePath();
    g.fill();
  }
  // the body, long and narrow, tapering to the feet
  g.beginPath();
  g.moveTo(-0.12, -1.85);
  g.quadraticCurveTo(-0.13, -1.5, -0.08, -1.2);
  g.quadraticCurveTo(-0.07, -0.8, -0.035, -0.42);
  g.lineTo(0.035, -0.42);
  g.quadraticCurveTo(0.07, -0.8, 0.08, -1.2);
  g.quadraticCurveTo(0.13, -1.5, 0.12, -1.85);
  g.closePath();
  g.fill();
  g.fillStyle = SHADE;
  g.fillRect(0.005, -1.15, 0.006, 0.7);
  // the cloth at the hips, the head bowed to its right
  g.fillStyle = '#e3dccd';
  g.beginPath();
  g.moveTo(-0.1, -1.24);
  g.lineTo(0.11, -1.25);
  g.lineTo(0.09, -1.04);
  g.lineTo(-0.07, -1.0);
  g.closePath();
  g.fill();
  g.fillStyle = SKIN;
  g.beginPath();
  g.ellipse(0.045, -1.92, 0.055, 0.068, 0.35, 0, 7);
  g.fill();
  g.fillStyle = '#3b2f25';
  g.beginPath();
  g.ellipse(0.03, -1.95, 0.06, 0.06, 0.35, Math.PI * 0.9, Math.PI * 2.1);
  g.fill();
  // the nails, a dark trickle under each
  for (const [x, y] of NAILS) {
    g.fillStyle = '#5a2620';
    g.fillRect(x - 0.006, y, 0.012, 0.09);
    g.fillStyle = '#1c1612';
    g.beginPath();
    g.arc(x, y, 0.014, 0, 7);
    g.fill();
  }
}
// The fresh paint over the nails, as layers: over each nail a dab along the limb (`<key>_dab`) and a stroke down over its
// trickle (`<key>_run`), painted whole — how much of each shows is the animate's (dabsNow: the layers scaled about the
// nail). The canvas is laid in the painting at (x0, y0), k times its size (a card: 0, 0, 1; the close-up: its own).
// The points `nail1…3` are marked there.
function dabs(e, x0 = 0, y0 = 0, k = 1) {
  for (const [x, y, along, key] of NAILS) {
    const at = [x0 + k * x, y0 + k * y];
    e.layer(`${key}_dab`, { pivot: at }, c => {
      c.translate(at[0], at[1]);
      c.rotate(along);
      c.fillStyle = '#cfbfa5';
      c.beginPath();
      c.ellipse(0, 0, 0.045 * k, 0.024 * k, 0, 0, 7);
      c.fill();
    });
    e.layer(`${key}_run`, { pivot: at }, c => {
      // (over the hands' trickles — the ground's dark; over the feet's — the body's colour, on down the cross)
      c.fillStyle = along === Math.PI / 2 ? '#cfbfa5' : '#2f2a26';
      c.beginPath();
      c.ellipse(at[0], at[1] + 0.05 * k, 0.012 * k, 0.05 * k, 0, 0, 7);
      c.fill();
    });
    e.at(at[0], at[1], key);
  }
}
// how far each nail is painted over now (nail1…3 0…1): the dab grows first, then the stroke runs down the trickle
function dabsNow(e) {
  for (const [, , , key] of NAILS) {
    const u = A.clamp(+e.state[key] || 0, 0, 1);
    const dab = e.layer(`${key}_dab`), run = e.layer(`${key}_run`);
    dab.scale = A.ease.out(A.clamp(u * 1.6, 0, 1));
    dab.alpha = u > 0 ? 1 : 0;
    run.scaleY = A.ease.out(A.clamp(u * 1.6 - 0.6, 0, 1));
    run.alpha = u > 0.375 ? 1 : 0;
  }
}

// ── a plain high-backed chair at the table: its back (seen from either side), the seat's edge under it ──
function chairBack(g) {
  g.fillStyle = '#3d2f25';
  g.fillRect(-0.22, -1.02, 0.035, 1.02);
  g.fillRect(0.185, -1.02, 0.035, 1.02);
  g.fillStyle = '#4a392c';
  g.fillRect(-0.22, -1.04, 0.44, 0.3);
  g.fillStyle = '#57443a';
  g.fillRect(-0.23, -0.47, 0.46, 0.04);
}

// ── the father's wing chair: its side (x from its front back to its back): the rolled arm over the seat block, the
// wing rising at the back, the legs ──
function chairSide(g) {
  g.fillStyle = '#2c241e';
  g.fillRect(-0.34, -0.12, 0.05, 0.12);
  g.fillRect(0.3, -0.12, 0.05, 0.12);
  g.fillStyle = '#664429';
  g.beginPath();
  g.moveTo(-0.36, -0.1);
  g.lineTo(-0.36, -0.6);
  g.quadraticCurveTo(-0.36, -0.68, -0.28, -0.68);
  g.lineTo(0.22, -0.68);
  g.quadraticCurveTo(0.26, -1.1, 0.34, -1.15);
  g.lineTo(0.37, -1.15);
  g.lineTo(0.36, -0.1);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(30,18,10,0.22)';
  g.fillRect(-0.36, -0.42, 0.72, 0.32);
}

// ── the canvas close (the insert `canvas`): the crucifixion k times its size, its foot at y0 (stage heights, across
// from the frame's middle); where the brush's tip waits (`hand`), and where the boy's shoulder is under the frame when
// the tip is at x (`shoulder`: the arm reaches up from there). Its size and place keep the three nails (the game's
// «Brush» marks them) within the frame's middle band: the hands' at 0.2 of its height, the feet's at 0.76 ──
const CLOSE = { k: 0.37, y0: 0.935, hand: aspect => [aspect / 2 + 0.2, 0.97], shoulder: (aspect, x) => [(x + aspect / 2) / 2 + 0.1, 1.9] };

// ── the hour ──
// The hall looks north-north-west (azimuth 340): its windows on the left face the west-south-west, the sun comes in at
// them from noon to sunset. Where the sun and the moon are on the hall's sky at an hour (the sky's layers go there;
// the scene's lights `sun`, `moon` shine from them: "sky#sun", "sky#moon") — the world's hour (`nebo`) turned to where
// the hall looks.
const HORIZON = 0.44, LOOK = 340;
const bearing = u => ((((90 + 180 * A.clamp(u, 0, 1) - LOOK) % 360) + 540) % 360) - 180;
const SKY = {
  horizon: HORIZON, round: true,
  // (u — along its way: 0 rising in the east, 1 setting in the west; past them — under the horizon)
  sun: (u, height, state, out) => N.onRound(bearing(u), 55 * height - (u < 0 || u > 1 ? 4 : 0), HORIZON, out),
  moon: (u, height, state, out) => N.onRound(bearing(u), 40 * height - (u < 0 || u > 1 ? 4 : 0), HORIZON, out),
  clouds: [[1.1, 0.16, 1.2, 0.02], [1.7, 0.27, 0.9, 0.014], [0.5, 0.31, 1.0, 0.012], [4.6, 0.2, 1.2, 0.02], [5.6, 0.29, 0.8, 0.012]],
};

// What the scene's script keeps from the keys a game turns (script.js): where the ladder stands (`ladder`), how the
// mother's door is turned (`door`) — and, with the world's `nebo`, the hour's light. A cut's values carry them all
// (`full`), so a shot made ready ahead is made with its own light.
const placed = st => ({ ladder_across: A.mix(plan.ladder[0], plan.ladder[1], st.ladder), door_facing: 270 - 85 * st.door });
const full = st => ({ ...st, ...N.keys(st.hour), ...placed(st) });

// ── the film (the world's module beats: script.js plays a beat for the game, showcase.js all of them) ──
// The people are the world's cast: Gray — one element `grey`: a boy of eight (`grey_boy`), at fifteen and at twenty his
// looks `grey_teen`, `grey` (`grey_wear`), his frock coat off `grey_shirt` — and his mother `lilian` (in mourning
// `lilian_black`). Where they stand: gr_a / gr_d (and gr_e — how high: the ladder's rung), li_a / li_d. They face
// (`_turn`): 0 the hearth, 90 her door, 270 the windows.
const loop = motion => ({ motion, loop: true });
const PULL = 0.45, // the boy at the ladder's right, pulling it along the wall (backing: he faces it)
  RUNG = [-2.45, 8.62], RUNG_UP = 1.05, // the rung he stands on (the ladder leans back 10°: 1.05 m up is 0.14 m nearer the wall)
  AT_DOOR = [4.92, 6.0], BEFORE_DOOR = [4.0, 6.05], // the mother behind her door (in her doorway as it opens); he before it
  HANDS = [4.45, 6.05, 1.05], // where their hands meet over the ring
  CANDLE = [4.66, 6.15, 1.3], // where she in her doorway holds her candle: before her, clear of her body from the hall
  AT_TABLE = [-1.55, 4.65], // at the table, facing it
  BY_CHAIR = [1.55, 6.5], // she by the father's armchair
  BY_COAT = [2.7, 6.4], COAT_TURN = 325, // he behind the armchair's back, facing it
  TO_HER = [2.15, 6.2], // a step from the armchair to her
  SEAT_NEAR = [-2.35, 3.57, 0.45], SEAT_FAR = [-2.35, 6.43, 0.45], // the chairs at the table's ends
  AT_WINDOW = [-3.55, 2.9], // the mother at the near window
  WINDOW = [-6, 3.5, 2.2], OUT = [2.6, 0.2];

// The camera, two ways: the hall's own picture moved by keys (`view`: metres right and ahead of the start, degrees
// turned right and up) — the composed shots; and the operator on someone (`on`: who, how tall they are in the frame —
// in frame heights —, where their head goes).
const CAM = { camera_glide: 1.5, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_z: 0, camera_yaw: 0, camera_pitch: 0 };
const view = (x = 0, z = 0, yaw = 0, pitch = 0) => ({ ...CAM, camera_x: x, camera_z: z, camera_yaw: yaw, camera_pitch: pitch });
const on = (target, shot, frame) => ({ ...CAM, camera_target: target, camera_shot: shot, camera_frame: frame });
const BOY = view(0.2, 6.0, -45, 3), // the corner by the windows along the far wall: the boy and his ladder, the painting over them
  ON_LADDER = on('grey', 0.5, [0.5, 0.5]), // closer: he up on the ladder, painting
  HELD = on('grey', 0.32, [0.45, 0.25]), // the ladder and the two of them at it
  DOOR = view(0.8, 2.5, 22), // her door, from the hall
  LEAVING = view(-0.1, 1.9, 39), // her doorway from farther back in the hall: she in it, and his way from it to the way out
  ACROSS_TABLE = view(-3.4, 2.6, 50, -4), // across the table: his face in the candles' light, her door beyond
  CAME_IN = view(0.6, 2.0), // he has come in: the two of them by the armchair
  SUPPER_VIEW = view(-0.3, 4.4, -80, -4), // across the table from the hall: he on the left, she on the right, the candles between, the windows behind
  WINDOW_VIEW = view(-0.5, 0.8, -30), // she at the near window
  SPRING_VIEW = view(0.1, 2.45, -90), // the near window from across the hall: the two of them side by side before it
  SHIP_NEAR = view(3.3, 4.4, -10), // come in on the painting of the ship
  MOTHER_CLOSE = view(-1.6, 6.1, -15, 8); // from behind her shoulder, close: her arms round him on the ladder, the painting over them
// the camera taken to a view of the hall over seconds, as one movement (a sequence of the beat's: stopped with it,
// whether the beat has come to await it or not)
const glide = (s, v, over) => s.sequence(q => q.all(...['camera_x', 'camera_z', 'camera_yaw', 'camera_pitch'].map(k => q.move(k, v[k], { over, ease: 'inOut' }))));

const nobody = Object.fromEntries(['grey', 'lilian'].flatMap(id => [[`${id}_here`, false], [`${id}_do`, 'stand'], [`${id}_look`, null],
  [`${id}_reach`, null], [`${id}_with`, null], [`${id}_on`, null], [`${id}_gait`, null], [`${id}_wear`, null]]));
// the hall with no one in it, nothing happened yet
const HALL = { ...nobody, ...view(), fade: 0, canvas: 0, lilian_candle: 0, gr_e: 0, grey_pulls: 0, door: 0, door_light: 0, bundle: 0,
  note: 0, coat_on_chair: 0, painting_alive: 0, nail1: 0, nail2: 0, nail3: 0, ladder: 0, fire: 0, lamps: 0, candles: 0,
  hands: 0, card: 0, grip1: 0, grip2: 0, grip3: 0, grip4: 0, dust: 1,
  gr_a: OUT[0], gr_d: OUT[1], grey_turn: 0, li_a: AT_DOOR[0], li_d: AT_DOOR[1], lilian_turn: 270 };
// a day: the boy in the corner by the windows, at the ladder's right, his hands on its rail
const DAY = { ...HALL, ...BOY, hour: 0.58, gr_a: plan.ladder[0] + PULL, gr_d: 8.25, grey_here: true, grey_turn: 270, grey_look: 'ladder#ladder' };
// up on the ladder under the crucifixion, painting
const UP = { ...DAY, ...ON_LADDER, ladder: 1, gr_a: RUNG[0], gr_d: RUNG[1], gr_e: RUNG_UP, grey_turn: 0, grey_do: loop('paint'),
  grey_with: ['paints', 'brush'], grey_look: 'crucifix#nail3' };
// his mother holds him on the ladder: the nails painted over, the brush lowered in his hand
const EMBRACE = { ...UP, ...MOTHER_CLOSE, nail1: 1, nail2: 1, nail3: 1, door: 1, door_light: 0.6, grey_do: 'stand', grey_look: 'lilian',
  li_a: -1.92, li_d: 8.25, lilian_here: true, lilian_turn: 285, lilian_look: 'grey', lilian_reach: { r: 'grey#hips', l: 'grey#hips' } };
// an evening: the lamps over the paintings, the fire; the boy before the ship
const EVENING = { ...HALL, hour: 0.8, fire: 0.8, lamps: 1, gr_a: 2.75, gr_d: 8.2, grey_here: true, grey_turn: 0, grey_look: 'ship_painting#ship' };
// the night he goes: Gray at fifteen at the table, his bundle on it; the light under her door; she behind it with a candle
const NIGHT = { ...HALL, ...ACROSS_TABLE, hour: 0.96, fire: 0.25, candles: 1, door_light: 1, bundle: 1, lilian_candle: 1,
  gr_a: AT_TABLE[0], gr_d: AT_TABLE[1], grey_here: true, grey_wear: C.characters.grey_teen, grey_turn: 270, grey_look: 'table#bundle',
  li_a: AT_DOOR[0], li_d: AT_DOOR[1], lilian_turn: 270, lilian_with: ['candle'], lilian_reach: { r: CANDLE }, lilian_do: loop('sad_stand') };
// the ring is in his palm and she has let go of him: she in her open doorway with the candle (a dark figure in the light
// of her room), he before it with his bundle
const LET_GO = { ...NIGHT, ...LEAVING, door: 1, bundle: 0, grey_with: ['bundle'], gr_a: BEFORE_DOOR[0], gr_d: BEFORE_DOOR[1], grey_turn: 90, grey_look: 'lilian',
  lilian_here: true, lilian_look: 'grey' };
// the note: after the farewell, at the table again; her door shut, the light under it
const NOTE = { ...NIGHT, grey_look: 'table#note' };
// the note laid and the bundle taken: he turns from the table
const NOTE_LAID = { ...NOTE, note: 1, bundle: 0, grey_with: ['bundle'], grey_turn: 300, grey_look: null };
// years on, a day: she in black by the armchair, turned to the fire; he about to come in
const RETURN = { ...HALL, hour: 0.52, fire: 0.4, gr_a: OUT[0], gr_d: OUT[1], grey_here: true, grey_wear: C.characters.grey, grey_turn: 20,
  li_a: BY_CHAIR[0], li_d: BY_CHAIR[1], lilian_here: true, lilian_wear: C.characters.lilian_black, lilian_turn: 330, lilian_look: 'fire#fire',
  lilian_do: loop('sad_stand') };
// he has come in: the two of them by the armchair
const RETURNED = { ...RETURN, ...CAME_IN, gr_a: 1.9, gr_d: 5.5, grey_turn: 20, grey_look: 'lilian', lilian_turn: 200, lilian_look: 'grey' };
// spring, a day: she at the near window, he beside her in his frock coat (seen from across the hall: side by side)
const SPRING = { ...HALL, ...SPRING_VIEW, hour: 0.45, grey_here: true, grey_wear: C.characters.grey, gr_a: -3.45, gr_d: 2.05, grey_turn: 270, grey_look: WINDOW,
  li_a: AT_WINDOW[0], li_d: AT_WINDOW[1], lilian_here: true, lilian_wear: C.characters.lilian_black, lilian_turn: 280, lilian_look: WINDOW };
// supper for two at the table, the candles lit
const SUPPER = { ...HALL, ...SUPPER_VIEW, hour: 0.85, fire: 0.6, lamps: 0.6, candles: 1,
  gr_a: SEAT_NEAR[0], gr_d: SEAT_NEAR[1], grey_here: true, grey_wear: C.characters.grey, grey_on: SEAT_NEAR, grey_turn: 0, grey_do: loop('eat'), grey_look: 'lilian',
  li_a: SEAT_FAR[0], li_d: SEAT_FAR[1], lilian_here: true, lilian_wear: C.characters.lilian_black, lilian_on: SEAT_FAR, lilian_turn: 180, lilian_do: loop('eat'), lilian_look: 'grey' };
// the epilogue: night; she at the near window — his letter in her hands, or alone with a candle
const END = { ...HALL, ...WINDOW_VIEW, hour: 0.97, fire: 0.2,
  li_a: AT_WINDOW[0], li_d: AT_WINDOW[1], lilian_here: true, lilian_wear: C.characters.lilian_black, lilian_turn: 280, lilian_look: WINDOW };

// someone walks along points (their gait's own pace) and turns at the end
const walk = (s, id, pts, turn) => s.sequence(async q => {
  await q.person(id).walk(pts);
  if (turn != null) await q.person(id).turn(turn);
});

// his letter held open in her hands before her (the reading stance holds it up: where her eyes go is the beat's)
const READS = { lilian_with: ['letter'], lilian_do: loop('read_stand') };
// the fire and the lamps by how warm the house has become (`home`, 0…1: the game's)
const warmth = scene => 0.35 + 0.65 * scene.get('home');
// the day he comes back, as the game has it: the house as warm as that, and — he left with a note (`leave`) — his note
// in her hands
const cameBack = scene => ({ fire: warmth(scene), lamps: warmth(scene), ...(scene.get('leave') === 'note' ? READS : {}) });

const film = scene => ({
  // boy — day, out of the dark: the boy pulls the library ladder along the wall under the crucifixion, backing; looks
  // up at the painting; takes his box of paints and his brush from the floor
  boy: {
    from: () => full({ ...DAY, fade: 1 }),
    run: async s => {
      const grey = s.person('grey');
      s.move('fade', 0, { over: 1.5, ease: 'out' });
      await s.wait(0.6);
      grey.reach({ r: 'ladder#rail_hi', l: 'ladder#rail_lo' });
      await s.wait(0.5);
      // (the ladder goes with him while he pulls it: script.js)
      s.set('grey_pulls', 1);
      await grey.walk([[plan.ladder[1] + PULL, 8.25]], { gait: 'drag' });
      s.set('grey_pulls', 0);
      s.set('ladder', 1);
      s.tell('boy:ladder');
      grey.reach(null);
      await s.wait(0.2);
      grey.look('crucifix#crucifix');
      await s.wait(1.2);
      await grey.turn(160);
      grey.look([-1.75, 7.7, 0]);
      await s.wait(0.3);
      const pick = grey.do('pick_up');
      await s.wait(1);
      grey.with(['paints', 'brush']);
      s.tell('boy:paints');
      await pick;
      grey.look('crucifix#nail3');
      await grey.turn(0);
      await s.wait(1);
    },
  },
  // brush — closer: he is up on the ladder, painting; then the canvas close (the insert `canvas`): the nails, his hand
  // with the brush — the game's «Brush» paints them over (nail1…3)
  brush: {
    from: () => full(UP),
    run: async s => {
      const canvas = s.shot({ canvas: 1 });
      await s.wait(3);
      await s.until(() => canvas.ready);
      canvas.cut();
      s.tell('brush:canvas');
      await s.wait(1);
    },
  },
  // paint_over — (the scene's own showing; in the game it is «Brush») the nails painted over one after another
  paint_over: {
    after: 'brush',
    from: () => full({ ...UP, canvas: 1 }),
    run: async s => {
      for (const key of ['nail3', 'nail1', 'nail2']) {
        await s.move(key, 1, { over: 2, ease: 'inOut' });
        await s.wait(0.4);
      }
    },
  },
  // mother_in — her door opens: she comes in and stops, looking at him; he looks round; she comes over to the ladder
  // and holds him on it
  mother_in: {
    after: ['brush', 'paint_over'],
    from: () => full(UP),
    run: async s => {
      const lilian = s.person('lilian'), grey = s.person('grey');
      s.cut({ ...DOOR, canvas: 0, lilian_here: true });
      const held = s.shot(HELD);
      const open = s.move('door', 1, { over: 1.6, ease: 'inOut' });
      s.move('door_light', 0.6, { over: 1.6 });
      await s.wait(0.6);
      await walk(s, 'lilian', [[3.7, 6.3]], 280);
      lilian.look('grey');
      await open;
      await s.wait(0.4);
      s.tell('mother_in:stops');
      await s.wait(1.6);
      await s.until(() => held.ready);
      held.cut();
      grey.do('stand');
      grey.look('lilian');
      await s.wait(1.2);
      await walk(s, 'lilian', [[0.6, 7.6], [-1.92, 8.25]], 285);
      lilian.look('grey');
      lilian.reach({ r: 'grey#hips', l: 'grey#hips' });
      s.tell('mother_in:holds');
      await s.wait(3);
    },
  },
  // mother_close — (a camera close-up: one line in the chapter takes it away) from behind her back: her arms round him,
  // his hand with the brush lowered, the painting with its nails painted over behind them
  mother_close: {
    after: 'mother_in',
    from: () => full(EMBRACE),
    run: async s => {
      s.cut(MOTHER_CLOSE);
      await s.move('camera_z', MOTHER_CLOSE.camera_z + 0.3, { over: 4.5, ease: 'inOut' });
      await s.wait(0.4);
    },
  },
  // ship_painting — an evening, the lamps: the boy before the painting of the ship on the crest of a wave; the camera
  // comes in, the waves on the canvas begin to move
  ship_painting: {
    from: () => full(EVENING),
    run: async s => {
      const dolly = glide(s, SHIP_NEAR, 12);
      await s.wait(2);
      s.tell('ship_painting:alive');
      await s.move('painting_alive', 1, { over: 8, ease: 'inOut' });
      await dolly;
    },
  },
  // cellar — the bottom of the old barrel (the insert `card`): the boy's hand wipes the dust away, the words can be read
  cellar: {
    after: 'ship_painting',
    from: () => full({ ...EVENING, ...SHIP_NEAR, painting_alive: 1 }),
    run: async s => {
      const card = s.shot({ card: 1, dust: 1 });
      await s.wait(1);
      await s.until(() => card.ready);
      card.cut();
      await s.move('dust', 0, { over: 4, ease: 'inOut' });
      s.tell('cellar:read');
      await s.wait(3);
    },
  },
  // night — out of the dark, years on: Gray at fifteen at the table, his bundle on it; a strip of light under his
  // mother's door (the game's choice)
  night: {
    from: () => full({ ...NIGHT, fade: 1 }),
    run: async s => {
      await s.move('fade', 0, { over: 1.5, ease: 'out' });
      await s.wait(1.5);
    },
  },
  // farewell — he goes to her door; it opens: his mother in the doorway with a candle; she looks at her ring, holds it
  // out, and it is in his palm
  farewell: {
    after: 'night',
    from: () => full(NIGHT),
    run: async s => {
      const lilian = s.person('lilian'), grey = s.person('grey');
      grey.look('mother_door#mother_door');
      await s.wait(0.4);
      glide(s, DOOR, 4);
      await walk(s, 'grey', [[1.2, 5.6], BEFORE_DOOR], 90);
      s.tell('farewell:at-door');
      await s.wait(0.4);
      lilian.here(true);
      const open = s.move('door', 1, { over: 1.4, ease: 'inOut' });
      await s.wait(0.6);
      grey.look('lilian');
      lilian.look('grey');
      await open;
      s.tell('farewell:open');
      await s.wait(1.4);
      lilian.look('lilian#hand_l');
      await s.wait(1.2);
      lilian.reach({ r: CANDLE, l: HANDS });
      await s.wait(0.2);
      grey.reach({ r: HANDS });
      lilian.look('grey#hand_r');
      grey.look('grey#hand_r');
      await s.wait(1.2);
      grey.with(['ring']);
      s.tell('farewell:ring');
      const hold = s.shot({ hands: 1, grip1: 1, grip2: 1, grip3: 1, grip4: 1 });
      await s.wait(0.6);
      lilian.reach({ r: CANDLE });
      grey.reach(null);
      await s.wait(0.2);
      lilian.look('grey');
      await s.wait(0.4);
      grey.look('lilian');
      await s.wait(1);
      await s.until(() => hold.ready);
      hold.cut();
      s.tell('farewell:hands');
      await s.wait(1);
    },
  },
  // let_go — back in the hall: she a dark figure in the light of her doorway, he with his bundle going to the way out;
  // he looks back. `pried` 0 — she lifts her candle higher; 1 — her empty hand stays held out after him
  let_go: {
    after: 'farewell',
    from: () => full(LET_GO),
    run: async s => {
      const lilian = s.person('lilian'), grey = s.person('grey');
      s.cut({ hands: 0, ...LEAVING, bundle: 0, grey_with: ['bundle'] });
      await s.wait(2);
      const go = walk(s, 'grey', [[3.7, 4.9], [3.2, 3.5]]);
      await s.until(() => s.get('gr_d') < 4.1);
      grey.look('lilian');
      s.tell('let_go:looks-back');
      if (s.get('pried')) lilian.reach({ r: CANDLE, l: [4.4, 6.0, 1.15] });
      else lilian.reach({ r: [4.65, 6.0, 2.1] });
      await go;
      await s.wait(4);
    },
  },
  // note — he lays a note on the table and takes his bundle
  note: {
    after: 'night',
    from: () => full(NOTE),
    run: async s => {
      const grey = s.person('grey');
      grey.look('table#note');
      await s.wait(0.6);
      const lay = grey.do('lay_down');
      await s.wait(0.8);
      s.set('note', 1);
      s.tell('note:laid');
      await lay;
      grey.look('table#bundle');
      await grey.turn(300);
      const pick = grey.do('pick_up');
      await s.wait(0.8);
      s.set('bundle', 0);
      grey.with(['bundle']);
      await pick;
      grey.look(null);
      await s.wait(0.5);
    },
  },
  // note_goes — he goes out past her door without knocking, looking round at it; the light under it burns on
  note_goes: {
    after: 'note',
    from: () => full(NOTE_LAID),
    run: async s => {
      const grey = s.person('grey');
      const past = s.shot(DOOR);
      const out = grey.walk([[0.6, 5.4], [3.3, 5.6], [3.6, 3.6], OUT]);
      await s.until(() => s.get('gr_a') > 0);
      await s.until(() => past.ready);
      past.cut();
      await s.until(() => s.get('gr_a') > 2.5);
      grey.look('mother_door#mother_door');
      s.tell('note_goes:passes');
      await s.until(() => s.get('gr_a') > 2.5 && s.get('gr_d') < 4.4);
      grey.look(null);
      await out;
      grey.here(false);
      s.tell('note_goes:gone');
      await s.wait(1.5);
    },
  },
  // return — out of the dark, years on, a day: Gray at twenty in his captain's frock coat comes in; his mother in black
  // by his father's empty armchair turns to him. `leave` farewell — she takes a step to meet him; note — she stays by
  // the chair with his note in her hands, looking at him
  return: {
    from: () => full({ ...RETURN, fade: 1, ...cameBack(scene) }),
    run: async s => {
      const lilian = s.person('lilian'), grey = s.person('grey');
      s.move('fade', 0, { over: 1.5, ease: 'out' });
      await s.wait(0.6);
      glide(s, CAME_IN, 5);
      const come = walk(s, 'grey', [[2.4, 3.2], [1.9, 5.5]], 20);
      await s.until(() => s.get('gr_d') > 2.6);
      lilian.turn(200);
      await s.wait(0.4);
      lilian.look('grey');
      s.tell('return:turns');
      const meet = s.get('leave') === 'farewell' ? walk(s, 'lilian', [[1.65, 6.15]], 200) : null;
      await s.wait(0.8);
      grey.look('lilian');
      await come;
      await meet;
      await s.wait(2);
    },
  },
  // stays — he goes round to the back of his father's chair, takes off his frock coat and hangs it there (she, if his
  // note is in her hands, puts it away in her dress meanwhile); a step to her, and she takes his hand
  stays: {
    after: 'return',
    from: () => full({ ...RETURNED, ...cameBack(scene) }),
    run: async s => {
      const lilian = s.person('lilian'), grey = s.person('grey');
      const away = [].concat(s.get('lilian_with') ?? []).includes('letter') && s.sequence(async q => {
        lilian.look('lilian#hands');
        await q.wait(1.6);
        lilian.reach({ l: 'lilian#hips' });
        await q.wait(0.8);
        lilian.with(null);
        lilian.do('sad_stand', { loop: true });
        lilian.reach(null);
        await q.wait(0.4);
        lilian.look('grey');
      });
      grey.look('chair_back#armchair');
      await walk(s, 'grey', [BY_COAT], COAT_TURN);
      await grey.do('coat_off');
      grey.wear(C.characters.grey_shirt);
      grey.look('coat#coat');
      grey.reach({ r: 'coat#coat' });
      await s.move('coat_on_chair', 1, { over: 0.6 });
      s.tell('stays:coat');
      await s.wait(0.3);
      grey.reach(null);
      grey.look('lilian');
      await walk(s, 'grey', [TO_HER], 290);
      await away;
      lilian.reach({ r: 'grey#hand_l' });
      grey.reach({ l: 'lilian#hand_r' });
      s.tell('stays:hand');
      await s.wait(2.5);
    },
  },
  // spring — out of the dark, a spring day: his mother at the window, Gray beside her in his frock coat; she turns to him
  spring: {
    from: () => full({ ...SPRING, fade: 1, fire: warmth(scene), lamps: warmth(scene) }),
    run: async s => {
      const lilian = s.person('lilian'), grey = s.person('grey');
      await s.move('fade', 0, { over: 1.5, ease: 'out' });
      await s.wait(1.5);
      await lilian.turn(175);
      lilian.look('grey');
      s.tell('spring:turns');
      await s.wait(0.8);
      grey.look('lilian');
      await s.wait(1.5);
    },
  },
  // one_evening — supper for two by candlelight; he in his frock coat looks at the window; she looks at him
  one_evening: {
    from: () => full({ ...SUPPER, fire: warmth(scene), lamps: warmth(scene) }),
    run: async s => {
      const grey = s.person('grey');
      await s.wait(3);
      grey.look(WINDOW);
      s.tell('one_evening:window');
      await s.wait(2.6);
      grey.look('lilian');
      await s.wait(1.2);
      grey.look(WINDOW);
      await s.wait(1.5);
    },
  },
  // window_end — the epilogue, out of the dark, night: his mother at the window — his letter in her hands (`letter`),
  // or alone with a candle
  window_end: {
    from: () => {
      const letter = scene.get('letter') > 0.5;
      return full({ ...END, fade: 1, fire: warmth(scene), lamps: warmth(scene), ...(letter ? { ...READS, lilian_look: 'lilian#hands' } : { lilian_with: ['candle'], lilian_candle: 1 }) });
    },
    run: async s => {
      const lilian = s.person('lilian');
      await s.move('fade', 0, { over: 2, ease: 'out' });
      await s.wait(2.5);
      lilian.look(WINDOW);
      await s.wait(3);
      if (s.get('letter') > 0.5) lilian.look('lilian#hands');
      await s.wait(2.5);
    },
  },
});
// the scene's own showing: every beat in the film's order
const ORDER = ['boy', 'brush', 'paint_over', 'mother_in', 'mother_close', 'ship_painting', 'cellar', 'night', 'farewell', 'let_go', 'note', 'note_goes', 'return', 'stays', 'spring', 'one_evening', 'window_end'];

return { plan, SKY, NAILS, CLOSE, PULL, crucifixion, dabs, dabsNow, chairBack, chairSide, placed, film, ORDER };
