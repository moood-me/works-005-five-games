// Прерия — what the scene's elements, script and film share: the plan of the line across the winter plain (the gorge
// and the Medicine Bow bridge on the left, the open plain in the middle, Fort Kearney's station on the right), the land,
// the train's and the sledge's geometry, and the film in beats (film(scene), for the world's module beats).
//   Metres: `across` along the line (the train runs toward +across: east, to Omaha), `distance` away from the viewer,
// across the line; the rails lie at distance 22. The viewer stands on the near side; camera_x carries the view along.
const { mixc, rgba, css } = kit.svet;

const plan = {
  track: 22,
  gauge: 1.44,
  // the gorge the bridge crosses: its middle, its half-width at the top and at the bed, its depth
  gorge: { x: -260, top: 30, bed: 7, depth: 30 },
  // the bridge, rim to rim (its deck at the land's level), and where its middle span breaks
  bridge: [-292, -228],
  breaks: [-11, 11],
  // Fort Kearney's station: the platform (near side of the line), its height, the lamp, the depot
  platform: { x0: 196, x1: 256, d0: 16.4, d1: 20.4, h: 0.5 },
  lamp: [221.2, 17.0],
  depot: [186, 14.5],
  fort: { x: 225, d: 72, gate: 230 },
  // metres a second at `speed` 1 and `sl_speed` 1
  pace: 18,
  sailPace: 14,
  // the train: the locomotive's anchor at the tender's rear end (it runs on to +25), the cars' anchor at their front
  // end (they run back to −49.5); coupled the cars stand 0.6 m behind the tender
  loco: 25,
  cars: 49.5,
  gap: 0.6,
  // the chains under the cars, from the last car's to the coupling at the tender (x in the cars' frame)
  chains: [-40, -24, -8, -0.5],
  // the near side of the train, from the rails' middle
  side: 1.42,
};
const clamp01 = v => anim.clamp(typeof v === 'number' && Number.isFinite(v) ? v : 0, 0, 1);
const mod = (x, n) => ((x % n) + n) % n;

// The land: level snow, the gorge cut across the line, gentle swells far out on the plain. 0 where the viewer stands
// and all along the line.
function ground(across, d) {
  const G = plan.gorge, x = Math.abs(across - G.x);
  let h = 0;
  if (x < G.top) h = -G.depth * (1 - anim.ease.smooth(anim.clamp((x - G.bed) / (G.top - G.bed), 0, 1)));
  const far = anim.clamp((d - 70) / 90, 0, 1);
  return h + far * (2.2 * Math.sin(across * 0.011 + 1.3) * Math.sin(d * 0.017) + 1.4 * Math.sin(across * 0.023 - d * 0.009));
}

// where PP is under the cars at `pp_car` (0 the last car … 3 the coupling at the tender), x in the cars' frame
function ppX(v) {
  const C = plan.chains, k = anim.clamp(v, 0, 3), i = Math.min(2, Math.floor(k));
  return C[i] + (C[i + 1] - C[i]) * (k - i);
}

// the sail of the sledge: how its boom stands for the sheet (0 let out … 1 hauled close) and the wind (−1 from the left
// … 1 from the right): to leeward, 75° out let go, 12° hauled in; the card's facing
function sailFace(sheet, wind) {
  const side = (wind ?? 0) < 0 ? 1 : -1;
  return 180 + side * (12 + 63 * (1 - clamp01(sheet)));
}

// ── people ──
const WHO = ['fogg', 'passepartout', 'aouda', 'fix', 'driver', 'captain', 'mudge', 's1', 's2', 's3', 's4', 's5'];
const SOLDIERS = ['s1', 's2', 's3', 's4', 's5'];
const TRAVEL = { garment: 'dress', colors: { garment: '#3c4a5a', top: '#3c4a5a', accent: '#c9b98f' } };
const OFF = id => ({ [`${id}_a`]: 120, [`${id}_d`]: -60, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 180,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_on`]: null, [`${id}_mood`]: null });
const NOBODY = () => Object.assign({}, ...WHO.map(OFF));
const at = (id, a, d, turn, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_here`]: true, [`${id}_turn`]: turn, ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const loop = (motion, from = 0) => ({ motion, loop: true, from });
const CAM0 = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, camera_look: 0, camera_roll: 0 };
// the light of the day's moments
const LIGHT = {
  day: { night: 0, dawn: 0, snowing: 0, lamps: 0, town: 'kearney', gate: 0 },
  snow: { night: 0, dawn: 0, snowing: 0.75, lamps: 0.3, town: 'kearney', gate: 1 },
  night: { night: 1, dawn: 0, snowing: 0.45, lamps: 1, town: 'kearney', gate: 0 },
  dawn: { night: 0.15, dawn: 1, snowing: 0.1, lamps: 0.6, town: 'kearney', gate: 1 },
};
// the train: where it stands (train_x — the locomotive's anchor), coupled, running or not; the riders away
const TRAIN = (x, more = {}) => ({ train_x: x, loco_x: x, cars_x: x - plan.gap, cars_free: false, speed: 0, uncouple: 0, bridge_down: 0, shake: 0, pp_car: 0,
  riders: 0, riders_x: 0, riders_d: 400, firing: 0, stop_at: 0, ...more });
// the sledge out of the way, its sail furled, the minigame's keys at rest
const SLEDGE_AWAY = { sl_x: 266, sl_d: 13.2, sail_up: 0, sl_speed: 0, sledge: 0, sheet: 0.6, wind: 0.4, drift: 0, wolves: 0 };
// the train standing at Fort Kearney's platform (the cars along it, the locomotive past its end)
const AT_STATION = 256;

function film(scene) {
  const num = (k, or = 0) => { const v = scene.get(k); return typeof v === 'number' ? v : or; };
  const yes = k => num(k, 1) > 0.5;
  const fF = () => clamp01(scene.get('stop_at'));
  // where the cars come to rest at the fort (their front end), by how far past it they ran
  const restAt = () => 252 + 130 * fF();

  // ---- the bridge, the train standing before it: Passepartout and the driver at the locomotive; Fogg, Aouda, Fix by the
  // first car
  const LOCO_STOP = -326;
  const DRIVER = [-304.6, 19.5], PP_ARGUE = [-307.2, 19.1], BY_CAR = { fogg: [-336.5, 19.3], aouda: [-337.8, 18.8], fix: [-335.0, 18.6] };
  const STOP = () => ({
    ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(LOCO_STOP), ...SLEDGE_AWAY,
    ...at('driver', ...DRIVER, 235, { look: 'passepartout#head' }),
    ...at('passepartout', ...PP_ARGUE, 115, { look: 'driver#head', gait: 'pp_walk' }),
    ...at('fogg', ...BY_CAR.fogg, 120, { look: 'passepartout#head', wear: { hat: 'tophat' } }),
    ...(yes('with_aouda') ? at('aouda', ...BY_CAR.aouda, 125, { look: 'passepartout#head', wear: TRAVEL }) : {}),
    ...(yes('with_fix') ? at('fix', ...BY_CAR.fix, 190, { look: 'driver#head' }) : {}),
  });
  // the bridge seen from its east rim, the gorge below
  const RIM = { camera_x: -192, camera_z: -24, camera_yaw: -30 };
  // in the cab: the driver at the regulator, Passepartout pressed into the corner
  const CAB = () => ({
    ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(LOCO_STOP), ...SLEDGE_AWAY,
    driver_here: true, driver_on: 'cab_floor#driver', driver_turn: 90, driver_look: [-200, 22, 2.5], driver_a: LOCO_STOP + 10, driver_d: 22,
    passepartout_here: true, passepartout_on: 'cab_floor#pp', passepartout_turn: 150, passepartout_mood: 'afraid', passepartout_a: LOCO_STOP + 10, passepartout_d: 22,
    camera_target: 'passepartout', camera_shot: 0.3, camera_frame: [0.42, 0.45],
  });
  // the passengers on the bridge, walking east in the snow; the empty train behind them
  const WALKERS = { passepartout: [-249, 21.0], aouda: [-251.6, 21.6], fogg: [-253.4, 20.9], fix: [-256.2, 21.5] };
  // running in the middle of the plain, the riders alongside
  const RUN = () => ({
    ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(0, { speed: 1, riders: 1, riders_x: -6, riders_d: 50, firing: 1 }), ...SLEDGE_AWAY,
    driver_here: true, driver_on: 'cab_floor#driver', driver_turn: 90, driver_look: [200, 22, 2.5], driver_a: 10, driver_d: 22,
    passepartout_here: true, passepartout_on: 'rear_floor#pp', passepartout_turn: 90, passepartout_look: [120, 22, 3], passepartout_a: -49, passepartout_d: 22,
  });
  const UNDER = () => ({
    ...RUN(), firing: 1,
    passepartout_on: 'chain#pp', passepartout_do: 'lie_limp', passepartout_turn: 270, passepartout_look: 'chain#c1', passepartout_mood: 'angry',
    passepartout_reach: { r: 'chain#c0', l: 'chain#c0' },
    camera_target: 'passepartout', camera_shot: 0.16, camera_frame: [0.5, 0.56], camera_h: -1.15,
  });
  // Fort Kearney's platform, the cars at rest
  const PLATFORM = () => ({ ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(3000, { cars_free: true, cars_x: restAt(), uncouple: 1 }), ...SLEDGE_AWAY });
  const ON_PLATFORM = { fogg: [224.2, 18.1], captain: [226.4, 18.7], aouda: [222.6, 17.5], fix: [221.4, 18.7] };
  const SOLDIERS_AT = [[214, 25.6], [218, 26.2], [233, 25.8], [237, 26.4], [229, 30]];
  // the column's way out into the white: across the line west of the platform, away north
  const COLUMN_FROM = { fogg: [193, 24.2], s1: [191.6, 23.0], s2: [194.6, 22.8], s3: [191.2, 26], s4: [194.2, 26.4], s5: [192.6, 27.6] };
  const COLUMN_TO = [183, 56];
  // the platform's west end, where Aouda waits for them to come back
  const WEST_END = { aouda: [199.2, 17.8], fix: [201.8, 18.5] };

  return {
    // ---- The train stands before the bridge; its truss has cracked. Passepartout argues with the driver at the
    // locomotive; Fogg, Aouda, Fix by the first car. Under the choice (driver#head · passepartout#head).
    bridge_stop: {
      from: () => ({ ...STOP(), camera_x: -308, camera_z: -40 }),
      run: async s => {
        const pp = s.person('passepartout'), driver = s.person('driver');
        await s.wait(2.6);
        const next = s.shot({ ...STOP(), camera_target: 'passepartout', camera_shot: 0.36, camera_frame: [0.38, 0.52] });
        await s.until(() => next.ready);
        next.cut();
        await s.wait(0.6);
        driver.reach({ r: [-280, 22, 3] });
        driver.look([-271, 22, 2]);
        await s.wait(1.6);
        driver.reach(null);
        driver.look('passepartout#head');
        await s.wait(0.4);
        pp.look([-271, 22, 1]);
        pp.reach({ r: [-292, 22, 2.2] });
        s.tell('bridge_stop:argue');
        await s.wait(1.8);
        pp.reach(null);
        pp.look('driver#head');
        await s.wait(2);
      },
    },
    // ---- Full steam: Passepartout in the cab, eyes shut; the train runs over the bridge, it shakes, and falls into the
    // river behind the last car.
    bridge_run: {
      from: CAB,
      run: async s => {
        await s.wait(0.8);
        s.move('shake', 0.25, { over: 2 });
        const off = s.move('train_x', -270, { over: 6, ease: 'in' });
        await s.wait(2.6);
        const wide = s.shot({ ...RIM, camera_target: null, camera_shot: null, camera_frame: null, camera_glide: 0 });
        await s.until(() => wide.ready);
        wide.cut();
        s.move('shake', 0.8, { over: 2 });
        await off;
        // (at full speed, 19 m/s, on past the east rim)
        s.move('train_x', -40, { over: 230 / 19, ease: 'linear' });
        // (the last car leaves the bridge as the locomotive is at −178)
        await s.wait(92 / 19);
        s.move('shake', 0, { over: 1.2 });
        await s.move('bridge_down', 1, { over: 2.4, ease: 'in' });
        s.tell('bridge_run:down');
        await s.wait(2.5);
      },
    },
    // ---- Passepartout's way: the passengers walk over the bridge in the snow; the empty train creeps after them; the
    // bridge creaks and holds.
    bridge_walk: {
      from: () => ({
        ...LIGHT.day, snowing: 0.35, ...CAM0, ...NOBODY(), ...TRAIN(-298, { shake: 0.08 }), ...SLEDGE_AWAY,
        driver_here: true, driver_on: 'cab_floor#driver', driver_turn: 90, driver_a: -288, driver_d: 22,
        ...at('passepartout', ...WALKERS.passepartout, 90, { gait: 'pp_walk' }),
        ...at('fogg', ...WALKERS.fogg, 90, { gait: 'fogg_walk', wear: { hat: 'tophat' } }),
        ...(yes('with_aouda') ? at('aouda', ...WALKERS.aouda, 90, { wear: TRAVEL }) : {}),
        ...(yes('with_fix') ? at('fix', ...WALKERS.fix, 90) : {}),
        camera_x: -198, camera_z: 7, camera_yaw: -52,
      }),
      run: async s => {
        const walk = (id, to) => (s.get(`${id}_here`) ? s.person(id).walk(to) : null);
        s.move('train_x', -270, { over: 22, ease: 'linear' });
        const ppw = walk('passepartout', [[-226, 20.6], [-220, 19.4]]);
        await s.wait(0.6);
        const aw = walk('aouda', [[-226, 21.2], [-221.6, 18.6]]);
        await s.wait(0.5);
        const fw = walk('fogg', [[-228, 20.9], [-223, 19.9]]);
        await s.wait(0.4);
        const xw = walk('fix', [[-226, 21.4], [-224.6, 21.4]]);
        await fw;
        s.tell('bridge_walk:over');
        await s.all(...[ppw, aw, xw].filter(Boolean));
        s.person('fogg').turn(270);
        await s.wait(2);
      },
    },
    // ---- The Sioux: riders along the train, snow from under the hooves, the smoke of shots; the train flies on; the
    // driver falls in the cab; Passepartout on the last car's platform.
    attack: {
      from: () => ({ ...RUN(), camera_x: -12, camera_z: -24 }),
      run: async s => {
        await s.wait(3.5);
        const cab = s.shot({ camera_x: 0, camera_z: 0, camera_target: 'driver', camera_shot: 0.42, camera_frame: [0.46, 0.46], camera_glide: 0 });
        await s.until(() => cab.ready);
        cab.cut();
        await s.wait(0.8);
        const fall = s.person('driver').do('knocked_down');
        await s.wait(0.9);
        s.tell('attack:driver');
        await fall;
        const pp = s.shot({ camera_target: 'passepartout', camera_shot: 0.4, camera_frame: [0.5, 0.48], camera_glide: 0 });
        await s.until(() => pp.ready);
        pp.cut();
        s.person('passepartout').reach({ r: [140, 24, 3] });
        await s.wait(2.6);
        s.person('passepartout').reach(null);
        await s.wait(0.6);
      },
    },
    // ---- «Сцепка» (the game's): under the cars, low, the snow streaming; Passepartout on his back hand over hand along
    // the chains toward the locomotive (pp_car), the cars swinging (swing; its phase swing_at), the coupling's pin
    // (uncouple). The beat only cuts here; the minigame plays it.
    under: {
      from: UNDER,
      run: async s => {
        await s.wait(1.5);
      },
    },
    // ---- The cars roll and stand at the fort (stop_at — how far past it, the game's); the soldiers run out; the riders
    // go off into the plain. No Passepartout.
    stop: {
      from: () => {
        const F = restAt();
        return {
          ...PLATFORM(), cars_x: F - 170, gate: 0, riders: 1, riders_x: F - 150, riders_d: 70,
          ...Object.fromEntries(SOLDIERS.flatMap(id => Object.entries(at(id, plan.fort.gate + (SOLDIERS.indexOf(id) - 2) * 1.2, plan.fort.d - 3, 180, { gait: 'run' })))),
          s1_here: false, s2_here: false, s3_here: false, s4_here: false, s5_here: false,
          camera_target: 'cars_side#middle', camera_shot: 'wide', camera_frame: [0.5, 0.6],
        };
      },
      run: async s => {
        const F = restAt();
        s.move('riders_d', 420, { over: 16, ease: 'in' });
        s.move('riders_x', F - 260, { over: 16, ease: 'in' });
        const roll = s.move('cars_x', F, { over: 13, ease: 'out' });
        await s.wait(5);
        s.move('gate', 1, { over: 1.5 });
        await s.wait(1.2);
        SOLDIERS.forEach((id, i) => {
          s.set(`${id}_here`, true);
          const to = SOLDIERS_AT[i];
          s.person(id).walk([[plan.fort.gate + (i - 2) * 1.6, plan.fort.d - 8], [Math.min(to[0], F - 6), to[1]]]);
        });
        await roll;
        s.tell('stop:still');
        await s.wait(3);
      },
    },
    // ---- The platform: Fogg, Aouda, Fix and the captain. Under the choice (fogg#head · captain#head).
    fort: {
      from: () => ({
        ...PLATFORM(), gate: 1,
        ...at('fogg', ...ON_PLATFORM.fogg, 115, { look: 'captain#head', wear: { hat: 'tophat' } }),
        ...at('captain', ...ON_PLATFORM.captain, 250, { look: [190, 60, 2] }),
        ...(yes('with_aouda') ? at('aouda', ...ON_PLATFORM.aouda, 120, { look: 'captain#head', wear: TRAVEL }) : {}),
        ...(yes('with_fix') ? at('fix', ...ON_PLATFORM.fix, 140, { look: 'captain#head' }) : {}),
        ...Object.fromEntries(SOLDIERS.flatMap((id, i) => Object.entries(at(id, ...SOLDIERS_AT[i], 160 + i * 9)))),
        camera_target: 'fogg', camera_shot: 0.3, camera_frame: [0.4, 0.5],
      }),
      run: async s => {
        await s.wait(1.4);
        const cap = s.person('captain');
        cap.look('fogg#head');
        await cap.turn(toward(ON_PLATFORM.captain, ON_PLATFORM.fogg));
        s.tell('fort:captain');
        await s.wait(2.4);
      },
    },
    // ---- «Тогда я пойду один»: the column of soldiers goes out with Fogg into the white.
    column: {
      from: () => ({
        ...PLATFORM(), ...LIGHT.snow,
        ...Object.fromEntries(Object.entries(COLUMN_FROM).flatMap(([id, p]) => Object.entries(at(id, ...p, 345)))),
        fogg_gait: 'fogg_walk', fogg_wear: { hat: 'tophat' },
        ...(yes('with_aouda') ? at('aouda', ...WEST_END.aouda, 350, { look: 'fogg#head', wear: TRAVEL }) : {}),
        ...(yes('with_fix') ? at('fix', ...WEST_END.fix, 345, { look: 'fogg#head' }) : {}),
        camera_x: 203, camera_z: 9, camera_yaw: -10,
      }),
      run: async s => {
        const walks = Object.keys(COLUMN_FROM).map((id, i) => {
          const [a, d] = COLUMN_FROM[id];
          return s.person(id).walk([[COLUMN_TO[0] + (a - 193), COLUMN_TO[1] + (d - 24)]]);
        });
        await s.wait(13);
        s.tell('column:gone');
        await s.any(...walks);
      },
    },
    // ---- Night. Aouda on the platform under the lamp, looking where they went; the snow settles on her shoulders; Fix
    // stamps his feet.
    night_wait: {
      from: () => ({
        ...PLATFORM(), ...LIGHT.night, snow_on_aouda: 0,
        ...at('aouda', 222.4, 17.7, 255, { look: [180, 70, 3], wear: TRAVEL }),
        ...(yes('with_fix') ? at('fix', 226.6, 18.6, 250, { do: loop('fidget_paper') }) : {}),
        camera_target: 'aouda', camera_shot: 0.42, camera_frame: [0.58, 0.48],
      }),
      run: async s => {
        const snow = s.move('snow_on_aouda', 1, { over: 16, ease: 'linear' });
        await s.wait(9.5);
        s.tell('night_wait:snow');
        await snow;
        await s.wait(1);
      },
    },
    // ---- Dawn. Out of the snow come the soldiers, Passepartout and Fogg (fogg_went).
    return: {
      from: () => ({
        ...PLATFORM(), ...LIGHT.dawn,
        ...at('passepartout', 186.4, 52, 165, { gait: 'pp_walk' }),
        ...(yes('fogg_went') ? at('fogg', 188.2, 52.6, 165, { gait: 'fogg_walk', wear: { hat: 'tophat' } }) : {}),
        ...Object.fromEntries(SOLDIERS.flatMap((id, i) => Object.entries(at(id, 183 + i * 1.7, 55 + (i % 2) * 1.6, 168)))),
        ...(yes('with_aouda') ? at('aouda', ...WEST_END.aouda, 345, { look: [188, 40, 1.7], wear: TRAVEL }) : {}),
        ...(yes('with_fix') ? at('fix', ...WEST_END.fix, 340, { look: [188, 40, 1.7] }) : {}),
        camera_x: 204, camera_z: 4, camera_yaw: -12,
      }),
      run: async s => {
        const go = (id, p) => (s.get(`${id}_here`) ? s.person(id).walk([p]) : null);
        const pp = go('passepartout', [196.2, 20.4]);
        go('fogg', [197.6, 21.2]);
        SOLDIERS.forEach((id, i) => go(id, [189 + i * 1.6, 24.5 + (i % 2) * 1.4]));
        await s.wait(7);
        s.tell('return:pp');
        if (s.get('aouda_here')) s.person('aouda').look('passepartout#head');
        if (s.get('fix_here')) s.person('fix').look('passepartout#head');
        await pp;
        await s.wait(1.5);
      },
    },
    // ---- The train leaves the station; with fogg_on_train Fogg on the rear platform looking back, else it goes
    // without them, they on the platform.
    train_leaves: {
      from: () => {
        const on = yes('fogg_on_train');
        return {
          ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(AT_STATION), ...SLEDGE_AWAY,
          ...(on ? { fogg_here: true, fogg_on: 'rear_floor#fogg', fogg_turn: 250, fogg_look: [190, 18, 1.7], fogg_a: AT_STATION - 49, fogg_d: 22, fogg_wear: { hat: 'tophat' } }
            : { ...at('fogg', 214.2, 18.0, 30, { look: 'cars_side#middle', wear: { hat: 'tophat' } }),
              ...(yes('with_aouda') ? at('aouda', 212.8, 17.4, 40, { look: 'cars_side#middle', wear: TRAVEL }) : {}),
              ...(yes('with_fix') ? at('fix', 216.0, 17.6, 20, { look: 'cars_side#middle' }) : {}) }),
          camera_x: 200, camera_z: 1, camera_yaw: 4,
        };
      },
      run: async s => {
        await s.wait(1.6);
        const go = s.move('train_x', 470, { over: 15, ease: 'in' });
        await s.wait(11);
        s.tell('train_leaves:gone');
        await go;
        await s.wait(0.5);
      },
    },
    // ---- Mudge's sledge with its great sail by the platform; who rides sits in it (sl_*); the sail goes up.
    sledge: {
      from: () => {
        const seated = [['fogg', 'sl_fogg', [0.7, -0.35]], ['aouda', 'sl_aouda', [-0.5, -0.45]], ['passepartout', 'sl_pp', [0.4, 0.5]], ['fix', 'sl_fix', [-0.9, 0.45]]];
        const v = { ...LIGHT.day, gate: 1, ...CAM0, ...NOBODY(), ...TRAIN(3000, { cars_free: true, cars_x: -3000 }), ...SLEDGE_AWAY,
          mudge_here: true, mudge_on: 'sledge_deck#mudge', mudge_turn: 90, mudge_a: 266, mudge_d: 13.2, mudge_look: [300, 13, 2],
          camera_target: 'mast', camera_shot: 0.7, camera_frame: [0.5, 0.42] };
        for (const [id, k, p] of seated) {
          if (num(k, 0) > 0.5) Object.assign(v, { [`${id}_here`]: true, [`${id}_on`]: { on: 'sledge', at: [p[0], p[1], 0.95] }, [`${id}_do`]: loop('sit_calm', p[0] * 1.3 + 1), [`${id}_turn`]: 90, [`${id}_a`]: 266, [`${id}_d`]: 13.2, [`${id}_look`]: [300, 13, 1.5] });
        }
        if (v.fogg_here) v.fogg_wear = { hat: 'tophat' };
        if (v.aouda_here) v.aouda_wear = TRAVEL;
        return v;
      },
      run: async s => {
        await s.wait(1);
        s.person('mudge').look('sail#peak');
        await s.move('sail_up', 1, { over: 3.2, ease: 'out' });
        s.tell('sledge:sail');
        s.person('mudge').look([300, 13, 2]);
        const who = s.get('fix_here') ? 'fix' : s.get('passepartout_here') ? 'passepartout' : 'fogg';
        s.camera({ target: who, shot: 0.34, frame: [0.45, 0.48], glide: 1.6 });
        await s.wait(3);
      },
    },
    // ---- «Парус» (the game's): the sledge flies along the line under its sail; the plain and the sky run. Only the cut.
    sail: {
      from: () => {
        const v = film(scene).sledge.from();
        return { ...v, sl_x: 0, sl_d: 13.2, sail_up: 1, sl_speed: 0.55, sledge: 0, sheet: 0.6, wind: 0.45, drift: 0, wolves: 0,
          camera_target: null, camera_shot: null, camera_frame: null, camera_x: 2.4, camera_z: -3.2, camera_yaw: -4 };
      },
      run: async s => {
        await s.wait(1.5);
      },
    },
    // ---- Omaha: the town's smoke, the train at the station. With omaha_train Passepartout runs to the last car and Fogg
    // reaches him his hand from its platform; else the train goes before he is there.
    omaha: {
      from: () => ({
        ...LIGHT.day, town: 'omaha', ...CAM0, ...NOBODY(), ...TRAIN(AT_STATION), ...SLEDGE_AWAY, sl_x: 150, sl_d: 12.6, sail_up: 0.15,
        fogg_here: true, fogg_on: 'rear_floor#fogg', fogg_turn: 250, fogg_look: [170, 16, 1.7], fogg_a: AT_STATION - 49, fogg_d: 22, fogg_wear: { hat: 'tophat' },
        mudge_here: true, mudge_on: 'sledge_deck#mudge', mudge_turn: 90, mudge_a: 150, mudge_d: 12.6, mudge_look: 'passepartout#head',
        ...at('passepartout', 157.5, 14.8, 75, { gait: 'run' }),
        camera_x: 186, camera_z: 2, camera_yaw: 6,
      }),
      run: async s => {
        const pp = s.person('passepartout'), fogg = s.person('fogg');
        const RP = [AT_STATION - plan.gap - 48.6, 20.0];
        if (yes('omaha_train')) {
          await pp.walk([[190, 18.6], RP]);
          pp.turn(10);
          pp.look('fogg#head');
          fogg.look('passepartout#head');
          fogg.reach({ r: 'passepartout#hand_r' });
          pp.reach({ r: 'fogg#hand_r' });
          await s.wait(1.3);
          s.tell('omaha:hand');
          await s.wait(1.2);
          s.set('passepartout_on', 'rear_floor#pp');
          s.set('passepartout_turn', 250);
          fogg.reach(null);
          pp.reach(null);
          await s.wait(0.8);
          await s.move('train_x', 480, { over: 15, ease: 'in' });
        } else {
          const go = s.move('train_x', 480, { over: 15, ease: 'in' });
          await s.wait(1.5);
          await pp.walk([[184, 18.2]]);
          pp.turn(80);
          pp.look('cars_side#rear');
          await go;
        }
        await s.wait(0.5);
      },
    },
  };
}

// the showcase's own beats: the two minigames played a little, as the game would
const SHOWCASE_ONLY = scene => {
  const F = film(scene);
  return {
    under_show: {
      from: F.under.from,
      run: async s => {
        await s.wait(1);
        await s.move('pp_car', 3, { over: 10, ease: 'linear' });
        await s.move('uncouple', 1, { over: 1.4, ease: 'in' });
        await s.wait(1.5);
      },
    },
    sail_show: {
      from: F.sail.from,
      run: async s => {
        s.move('sledge', 1, { over: 22, ease: 'linear' });
        await s.move('sl_speed', 1, { over: 3 });
        s.move('wolves', 1, { over: 6 });
        await s.wait(3);
        s.move('wind', -0.6, { over: 3 });
        await s.move('sheet', 0.9, { over: 2 });
        await s.wait(2);
        s.move('wolves', 0, { over: 5 });
        await s.move('drift', 0.9, { over: 5, ease: 'linear' });
        s.move('sheet', 0.1, { over: 1 });
        await s.move('sl_speed', 0.3, { over: 1.5 });
        await s.move('drift', 0, { over: 0.1 });
        await s.move('sl_speed', 0.9, { over: 2 });
        await s.wait(1.5);
      },
    },
  };
};
const SHOWCASE = ['bridge_stop', 'bridge_run', 'bridge_walk', 'attack', 'under_show', 'stop', 'fort', 'column', 'night_wait', 'return', 'train_leaves', 'sledge', 'sail_show', 'omaha'];

return { plan, ground, ppX, sailFace, film, SHOWCASE_ONLY, SHOWCASE, clamp01, mod, mixc, rgba, css, TRAVEL, WHO, SOLDIERS };
