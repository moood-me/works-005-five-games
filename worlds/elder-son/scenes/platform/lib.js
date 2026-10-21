// The Platform — what the paintings, the script and the film share. Metres: across — along the platform (right +),
// distance — away from the start (the tracks beyond the platform's edge, the slope down to the settlement before it).
// The platform and the ground before it are at 0; the tracks' bed 1.25 m lower; the settlement below on the slope.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const span = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
const smooth = u => u * u * (3 - 2 * u);
const EL = kit.trains.ELECTRIC;

const G = {
  PLAT: { a0: -45, a1: 15.5, d0: 3.5, d1: 10.2 },   // the platform's concrete (its top 0.05 over the ground)
  EDGE: 10.2,                                       // its edge over the tracks
  SIDE: 10.3,                                       // the train's side
  TRACK: 11.5, TRACK2: 15.6, BED: -1.25,            // the two tracks' middles; their bed
  LAMP: [-0.3, 5.5, 4.6],                           // the lamp post (its lamp 0.46 m right of the post, 4.6 m up)
  STAIR_LAMP: [14.4, 5.4, 4.0],                     // the lamp over the stairs
  BENCH: [-1.5, 8.0], SEAT: 0.5,                    // the bench (facing the near side), its seat's height
  BOOTH: [-8.5, 4.4],                               // the dark ticket booth
  LANDING: { a0: 13.5, a1: 15.5, d0: 5.5, d1: 8.0 }, // the stairs' top (the platform's own concrete)
  FOOT: { a: 20.0, low: -3.2 },                     // the flight's foot (across) and how low it goes
  FAR_WINDOW: [60, -20, 1.0],                       // the Sarafanovs' window far below (across, distance, over its ground)
  // the train: its anchor (the middle of the four cars, on the rail head) at train 0; how far it is at −1 and at 1
  X0: -8, LEFT: 100, RIGHT: 250,
};
G.trainX = t => G.X0 + (t < 0 ? G.LEFT : G.RIGHT) * t;
// the land (relief.js reads this): the bed beyond the edge, the slope down to the settlement before the platform and
// beyond the stairs on the right
G.ground = (a, d) => {
  if (d > G.EDGE + 0.05) return G.BED + 0.7 * smooth(span(d, 18, 45));
  // (the slope's top: at the start's line it begins 0 m before the platform — the start's ground stays 0 —, toward the
  // stairs right at the platform's near edge, so the window far below is seen from the platform's end)
  const top = G.PLAT.d0 * smooth(span(a, 8, 12));
  const near = d < top ? -8 * smooth(span(top - d, 0, 22)) - 0.12 * Math.max(0, top - d - 22) : 0;
  const right = -3.4 * smooth(span(a, 15.5, 17.6)) * (1 - 0.6 * smooth(span(d, 6.5, 10.2)));
  return Math.min(near, right);
};
// the hour → the weights of the light's looks (light.looks): dusk 0.84, night 0.9, late night 0.93…, dawn (below 0.5)
G.looks = hour => {
  const h = Number(hour);
  const dawn = h < 0.5 ? 1 : 0;
  return { dawn_k: dawn, dusk_k: dawn ? 0 : smooth(span(0.9 - h, 0, 0.06)), late_k: dawn ? 0 : smooth(span(h - 0.9, 0, 0.03)) };
};

// the train's numbers in the world at train 0 (ELECTRIC's x + X0): the second car's front doorway, its window by it
const DOOR = G.X0 + EL.doors(1)[1];            // 10
const BACK_DOOR = G.X0 + EL.doors(1)[0];       // −6: the second car's rear doorway (the bench's)
const WIN = EL.windows(1)[EL.windows(1).length - 1];   // the second car's last window before the front vestibule (its x)
// the camera in the car: its place in the train's frame (the train faces the platform, its frame as the world's:
// x along it from its anchor, z from its side into the car, h over the anchor's eye)
const EYE = { x: WIN - 1.19, z: 0.75, h: 1.0, yaw: 122 };

// ── the film (the world's beats): film(scene) → { <beat>: { from, after, run } } ──
const IDS = ['busygin', 'silva', 'sarafanov', 'nina', 'vasenka'];
const AWAY = [24, 6.8];
// places (across, distance)
const P = {
  FOOT_B: [20.8, 6.5], MID_B: [17.0, 6.5], FOOT_S: [21.6, 7.2], TOP_B: [15.3, 6.5], TOP_S: [15.3, 7.1],
  LAMP_B: [0, 6.1], LAMP_S: [-0.8, 6.35], EDGE_B: [-0.25, 7.45],
  SEAT_V: [-2.1, 8.0], SEAT_B: [-0.9, 8.0], UP_V: [-2.1, 8.65], UP_B: [-1.1, 8.6],
  WAIT: [11.5, 8.5], WAIT_RUN: [13.4, 7.4], AT_DOOR: [DOOR, 9.85], DOOR_GIVE: [11.0, 9.35],
  SAR: [14.5, 7.0], VAS: [15.4, 6.2], NINA_AHEAD: [13.3, 7.2], NINA_BEHIND: [15.6, 7.6], FRONT: [14.0, 7.0],
  FOOT_SAR: [20.6, 6.9], FOOT_VAS: [21.3, 6.2], FOOT_NA: [20.2, 7.7], FOOT_NB: [21.8, 7.5],
  WATCH: [14.3, 7.2], ALONE: [8.2, 8.0], AHEAD: [2, 3, 1.1], DAWN_V: [-2.0, 8.0], DAWN_DOOR: [BACK_DOOR, 9.85],
};
const brg = (a, b) => ((Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI + 360) % 360;
const cam = (x, z, yaw, h = 0, look = 0) => ({ camera_on: null, camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: 0, camera_look: look });
const CAM = {
  stairs: cam(6, 1, 55),                 // along the platform to the right: the stairs
  gone: cam(6, 1, -60),                  // the two under the lamp, the train's tail far left
  stand: cam(1.9, 6.3, -68, -0.1),       // the two under the lamp from the right, a medium shot in three quarters (the post out of it)
  bench0: cam(-6.5, 3.2, 62),            // the bench with Vasenka, the stairs far right
  bench: cam(-1.5, 5.4, 0, -0.4),        // the two on the bench face on, a medium shot, the lamp over the camera's shoulder
  strap: cam(-4.6, 6.2, 55, -0.1),       // they stand before the train's open door
  A: cam(7, 4, 45),                      // from the near edge slantwise right: the door, he, the stairs' top
  A2: cam(8.2, 5.0, 48),                 // the same, nearer: the door, he, who came on the stairs' top
  meet: cam(11.0, 5.6, 30, -0.1),        // they meet him by the stairs' top, a medium shot
  watch: cam(12.3, 8.6, 118, 0.3),       // over his shoulder, the window far below before him
  give: cam(9.2, 7.4, 37, -0.2),         // at the door: the snuffbox from hand to hand, both in profile
  B: cam(0.5, 7.0, 92, 0.5),             // along the platform right, a little high: the door, he, the window far below
  glass: { camera_on: 'train', camera_target: null, camera_x: EYE.x, camera_z: EYE.z, camera_yaw: EYE.yaw, camera_h: EYE.h, camera_pitch: 0, camera_look: 0 },
  dawn: cam(-6.5, 4.6, 40, -0.2),        // slantwise from the near side: the bench in three quarters, the train's door beyond it
};

function film(scene) {
  const get = k => scene.get(k);
  const num = (k, d) => (get(k) == null ? d : Number(get(k)));
  // who came for him (the play's keys): the father, Nina, Vasenka — each by Together or by the truth
  const fatherCame = () => num('father_came', 1) === 1;
  const ninaCame = () => num('nina_came', 0) === 1;
  const vasyaCame = () => num('vasya_came', 0) === 1;
  const ninaAhead = () => (get('nina_is') ?? 'none') === 'knows';
  const suitcase = () => num('suitcase', 0) === 1;
  const trainKeys = t => ({ train: t, train_x: G.trainX(t) });
  const off = id => ({ [`${id}_here`]: false, [`${id}_a`]: AWAY[0], [`${id}_d`]: AWAY[1], [`${id}_turn`]: 270, [`${id}_do`]: 'stand',
    [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_on`]: null, [`${id}_gait`]: null, [`${id}_mood`]: 'neutral' });
  const at = (id, p, turn, more = {}) => ({ ...off(id), [`${id}_here`]: true, [`${id}_a`]: p[0], [`${id}_d`]: p[1], [`${id}_turn`]: turn, ...more });
  const seated = (id, p, motion, more = {}) => at(id, p, 180, { [`${id}_do`]: { motion, loop: true }, [`${id}_on`]: [p[0], p[1], G.SEAT], ...more });
  // the night (or the dusk, the dawn): every key the beats move, the people away
  const base = (hour, snow, more = {}) => ({
    fade: 0, hour, ...G.looks(hour), snow, ...trainKeys(1), doors: 0, wipe: 0, silva_window: 0, strap: 0, pull: 0, grip: 1,
    door_bg: 0, bench_snow: 0, ...Object.assign({}, ...IDS.map(off)), ...more,
  });
  const sarWith = () => (suitcase() ? ['long_scarf', 'suitcase'] : null);
  // Silva in the second car's front vestibule (silva_door 1), carried by the train
  const silvaIn = () => (num('silva_door', 1) ? at('silva', P.AT_DOOR, 180, { silva_on: 'floor#vest', silva_look: null, silva_mood: 'smile' }) : {});
  // who came, where they stand on the stairs' top (their places) or wait below (their feet). Whom the truth brought
  // shows by the keys there are: Nina ahead of her father (nina_is knows), Vasenka without his rucksack (vasya_end
  // home: he stays), the father without a suitcase (suitcase 0). The first of them — the father, else Nina, else
  // Vasenka — stands in front and calls him
  function cameSet() {
    const who = [], father = fatherCame();
    if (father) who.push({ id: 'sarafanov', foot: P.FOOT_SAR, to: P.SAR, mood: suitcase() ? 'tired' : 'sad', with: sarWith() });
    if (ninaCame()) {
      const ahead = !father || ninaAhead();
      who.push({ id: 'nina', foot: ahead ? P.FOOT_NA : P.FOOT_NB, to: !father ? P.FRONT : ahead ? P.NINA_AHEAD : P.NINA_BEHIND, mood: 'thinking', first: ahead });
    }
    if (vasyaCame()) {
      const alone = !who.length, stays = (get('vasya_end') ?? 'taiga') === 'home';
      who.push({ id: 'vasenka', foot: P.FOOT_VAS, to: alone ? P.FRONT : P.VAS, mood: 'neutral', first: alone, with: stays ? null : ['rucksack'] });
    }
    return who;
  }
  const caller = () => (fatherCame() ? 'sarafanov' : ninaCame() ? 'nina' : vasyaCame() ? 'vasenka' : null);
  const callerAt = () => (cameSet().find(w => w.id === caller()) || { to: P.SAR }).to;
  // they on the stairs' top, turned to him (at P.WAIT) — or still below
  const cameHere = (upTop = true) => Object.assign({}, ...cameSet().map(w => at(w.id, upTop ? w.to : w.foot, upTop ? brg(w.to, P.WAIT) : 270, {
    [`${w.id}_here`]: upTop, [`${w.id}_mood`]: w.mood, [`${w.id}_with`]: w.with ?? null, [`${w.id}_look`]: upTop ? 'busygin' : null })));
  // the medium shot on whoever calls him, three quarters from the platform's side: behind them the stairs' top in the
  // lamp's light
  const callShot = who => {
    const p = callerAt(), k = brg(p, P.WAIT) + 40, r = 1.5, rad = (k * Math.PI) / 180;
    return cam(p[0] + r * Math.sin(rad), p[1] + r * Math.cos(rad), (k + 180) % 360, who === 'sarafanov' ? -0.3 : -0.2);
  };

  // the camera moved to a shot's place over `over` s (not a cut): its x, z, turn and height together
  const glide = (s, c, over) => Promise.all(['camera_x', 'camera_z', 'camera_yaw', 'camera_h'].map(k => s.move(k, c[k], { over, ease: 'inOut' })));
  async function sit(p, place, motion) {
    await p.go('sit_down', { to: place, turn: 180 });
    p.on([place[0], place[1], G.SEAT]);
    p.do(motion, { loop: true });
  }
  async function rise(p, place, motion = 'rise') {
    p.on(null);
    await p.go(motion, { from: place, turn: 180 });
  }
  // the train comes up and stands (train −1 → 0); its doors open — `then` told as they begin to
  async function arrive(s, then) {
    if (s.get('train') !== 0) await s.move('train', 0, { over: 8, ease: 'out' });
    await s.wait(0.5);
    s.tell(then);
    await s.move('doors', 1, { over: 1.4, ease: 'inOut' });
  }

  const B = {
    // night, out of the dark, snow; the train standing, its doors shut. The two run up the stairs (seen by the 5th
    // second); at the 8th the train moves off — barely, one slow move on, its tail ≈ 0.3 m/s; the camera turned with
    // them from the stairs to under the lamp; they stop there by the 9th. The pose for the choice: the tail's red
    // lamps far left, x ≈ −0.34; the train crawls on the same way while the game waits.
    gone: {
      from: () => base(0.9, 0.4, { fade: 1, ...trainKeys(0), ...CAM.stairs,
        ...at('busygin', P.FOOT_B, 270, { busygin_mood: 'surprised' }), ...at('silva', P.FOOT_S, 270, { silva_mood: 'smile' }) }),
      run: async s => {
        const b = s.person('busygin'), sv = s.person('silva');
        s.move('fade', 0, { over: 2, ease: 'out' });
        await s.wait(1.2);
        b.gait('run');
        sv.gait('run');
        s.tell('gone:run');
        const bw = b.walk([P.TOP_B, [6, 6.2], P.LAMP_B]);
        const sw = s.sequence(async q => { await q.wait(0.35); await q.person('silva').walk([P.TOP_S, [6, 6.6], P.LAMP_S]); });
        await s.wait(2.2);
        s.move('camera_yaw', CAM.gone.camera_yaw, { over: 5.2, ease: 'inOut' });
        await s.wait(2.3);
        // (the same slow way on while the game waits: 0.3 m/s, far longer than any wait)
        s.move('train', 0.3, { over: 250, ease: 'linear' });
        await s.all(bw, sw);
        b.gait(null);
        sv.gait(null);
        b.look('train#tail');
        sv.look('train#tail');
        s.tell('gone:stop');
        await s.all(b.turn(292), sv.turn(296));
        b.mood('sad');
        await s.wait(3.2);
      },
    },
    // he steps to the edge and waves; the train gathers way from where it is and goes off right, its lamps gone
    wave: {
      after: ['gone'],
      from: () => base(0.9, 0.4, { ...trainKeys(0.03), ...CAM.gone,
        ...at('busygin', P.LAMP_B, 292, { busygin_look: 'train#tail', busygin_mood: 'sad' }), ...at('silva', P.LAMP_S, 296, { silva_look: 'train#tail', silva_mood: 'smile' }) }),
      run: async s => {
        const b = s.person('busygin');
        s.move('train', 1, { over: 24, ease: 'in' });
        await b.walk([P.EDGE_B]);
        b.look('train#tail');
        await b.do('wave');
        await s.until(() => G.trainX(s.get('train')) - EL.len * 2 > 2);
        b.look(null);
        s.tell('wave:dark');
        await s.wait(1.2);
      },
    },
    // the two under the lamp, a medium shot in three quarters: Silva's hand to his collar, Busygin hugging himself
    stand: {
      after: ['wave'],
      from: () => base(0.9, 0.4, { ...trainKeys(1), ...CAM.gone,
        ...at('busygin', P.EDGE_B, 330, { busygin_mood: 'sad' }), ...at('silva', P.LAMP_S, 296, { silva_mood: 'smile' }) }),
      run: async s => {
        const b = s.person('busygin'), sv = s.person('silva');
        glide(s, CAM.stand, 4);
        await b.walk([[0.3, 6.95]]);
        await s.all(b.turn(140), sv.turn(100));
        b.mood('tired');
        sv.mood('smile');
        b.do('cold', { loop: true });
        s.tell('stand:cold');
        sv.look('busygin');
        sv.reach({ r: 'silva#nape' });
        await s.wait(3);
        sv.reach(null);
        await s.wait(7.2);
      },
    },
    // late dusk, no snow: Vasenka on the bench under the lamp, his rucksack on his knees; Busygin comes up the stairs,
    // walks along and sits by him. Both in three quarters under the lamp: Vasenka angry, not looking at him
    bench: {
      from: () => base(0.84, 0, { ...CAM.bench0,
        ...seated('vasenka', P.SEAT_V, 'seated_bag', { vasenka_with: ['rucksack_lap'], vasenka_mood: 'angry', vasenka_look: [-4, 4, 0.8] }),
        ...at('busygin', P.MID_B, 270, { busygin_mood: 'thinking' }) }),
      run: async s => {
        const b = s.person('busygin');
        glide(s, CAM.bench, 13);
        await b.walk([P.TOP_B, [6, 7.0], [-0.6, 7.2]]);
        b.look('vasenka');
        await sit(b, P.SEAT_B, 'seated');
        b.look(P.AHEAD);
        s.tell('bench:sit');
        await s.wait(5.5);
      },
    },
    // the train comes up from the left and stands, its doors open; Vasenka gets up with his rucksack, Busygin gets
    // up and reaches for it; the insert `strap` opens
    strap: {
      after: ['bench'],
      from: () => base(0.84, 0, { ...trainKeys(-1), ...CAM.bench,
        ...seated('vasenka', P.SEAT_V, 'seated_bag', { vasenka_with: ['rucksack_lap'], vasenka_mood: 'angry', vasenka_look: [-4, 4, 0.8] }),
        ...seated('busygin', P.SEAT_B, 'seated', { busygin_mood: 'thinking', busygin_look: 'vasenka' }) }),
      run: async s => {
        const v = s.person('vasenka'), b = s.person('busygin');
        s.set('train', -1);
        glide(s, CAM.strap, 5);
        v.look('train#back_door');
        await arrive(s, 'strap:open');
        b.look('vasenka#back');
        await s.all(s.sequence(async q => { const qv = q.person('vasenka'); await rise(qv, P.SEAT_V, 'stand_bag'); await qv.walk([P.UP_V]); await qv.turn(10); }),
          s.sequence(async q => { const qb = q.person('busygin'); await q.wait(0.5); await rise(qb, P.SEAT_B); await qb.walk([P.UP_B]); await qb.turn(300); }));
        b.reach({ r: 'vasenka#back' });
        await s.wait(0.8);
        s.set('strap', 1);
      },
    },
    // the insert closed: the doors shut, the train goes off right; Vasenka sits down again with his rucksack, he by
    // him (torn 1: the strap knotted — the part with the knot); after L71 they get up and go to the stairs
    bench_back: {
      after: ['strap'],
      from: () => base(0.84, 0, { ...trainKeys(0), ...CAM.strap, doors: 1,
        ...at('vasenka', P.UP_V, 10, { vasenka_with: ['rucksack_lap'], vasenka_mood: 'angry' }),
        ...at('busygin', P.UP_B, 300, { busygin_mood: 'thinking', busygin_reach: { r: 'vasenka#back' } }) }),
      run: async s => {
        const v = s.person('vasenka'), b = s.person('busygin');
        const torn = num('torn', 0) === 1;
        s.set('strap', 0);
        b.reach(null);
        await s.move('doors', 0, { over: 1.4, ease: 'inOut' });
        s.move('train', 1, { over: 24, ease: 'in' });
        glide(s, CAM.bench, 4);
        v.look(null);
        await v.walk([[-2.0, 8.4]]);
        await sit(v, P.SEAT_V, 'seated_bag');
        if (torn) v.with(['rucksack_lap_torn']);
        v.look(torn ? 'vasenka#rucksack' : [-4, 4, 0.8]);
        v.mood(torn ? 'sad' : 'angry');
        await b.walk([[-1.0, 8.4]]);
        await sit(b, P.SEAT_B, 'seated');
        b.look(P.AHEAD);
        s.tell('bench_back:sat');
        await s.wait(3.6);
        v.look('busygin');
        v.mood('neutral');
        await s.wait(0.8);
        await s.all(rise(v, P.SEAT_V, 'stand_bag'), s.sequence(async q => { await q.wait(0.4); await rise(q.person('busygin'), P.SEAT_B); }));
        b.look(null);
        v.look(null);
        b.walk([[2, 7.4], P.TOP_B]);
        v.walk([[2, 7.0], [8, 6.8]]);
        await s.wait(2.5);
      },
    },
    // night, snow. He runs up the stairs and stands by the second car's front doorway, facing it, between it and the
    // stairs. late_run 0 — the last train comes up and opens its doors with him there; 1 — it stands open already.
    // Silva in the vestibule (silva_door). Who came comes up the stairs (father_came, nina_came, vasya_came) —
    // last:came, the cut to the face of the first of them, and back; he turns to them. No one: the camera goes along
    // the platform to the window far below. The pose for the choice: the door, and the first who came (or the window)
    last: {
      from: () => {
        const late = num('late_run', 0) === 1;
        return base(0.93, 0.5, { ...trainKeys(late ? 0 : -1), doors: late ? 1 : 0, ...CAM.A,
          ...at('busygin', P.FOOT_B, 270, { busygin_mood: 'afraid' }), ...silvaIn(), ...cameHere(false) });
      },
      run: async s => {
        const late = num('late_run', 0) === 1, b = s.person('busygin'), who = cameSet(), call = caller();
        // (late_run: the train stands open as he comes running up — the doors' hiss at once)
        if (late) s.tell('last:open');
        const silva = num('silva_door', 1) === 1;
        const train = late ? null : arrive(s, 'last:open');
        b.gait('run');
        await b.walk([P.TOP_B, P.WAIT_RUN]);
        b.gait(null);
        await b.walk([P.WAIT]);
        await b.turn(brg(P.WAIT, P.AT_DOOR));
        b.look('train#door');
        b.mood('tired');
        await train;
        if (silva) {
          const sv = s.person('silva');
          sv.look('busygin');
          sv.turn(150);
        }
        await s.wait(1.0);
        if (!who.length) {
          // no one: along the platform to the window far below
          const back = b.walk([P.ALONE]);
          await glide(s, CAM.B, 3);
          await back;
          await b.turn(brg(P.ALONE, [G.FAR_WINDOW[0], G.FAR_WINDOW[1]]));
          b.look('far_window');
          s.tell('last:came');
          await s.wait(3.5);
          return;
        }
        // they come up the stairs, the first ahead
        const face = s.shot({ ...callShot(call) });
        const walks = who.map((w, i) => s.sequence(async q => {
          await q.wait(w.first ? 0 : 0.5 + 0.3 * i);
          const p = q.person(w.id);
          p.here(true);
          await p.walk([[15.6, w.to[1]], w.to]);
          await p.turn(brg(w.to, P.WAIT));
          p.look('busygin');
        }));
        await s.all(...walks);
        await s.until(() => face.ready);
        face.cut();
        s.tell('last:came');
        const back = s.shot({ ...CAM.A2 });
        await s.wait(3.2);
        back.cut();
        b.look(call);
        await b.turn(brg(P.WAIT, callerAt()));
        await s.wait(1.6);
      },
    },
    // the doors shut, the train goes; Silva's figure in its window going by (silva_window); he turns to the stairs;
    // who came comes to meet him, Nina first if she came; no one — he goes to the stairs' top and stands, the window far
    // below before him
    stays: {
      after: ['last'],
      from: () => base(0.93, 0.5, { ...trainKeys(0), doors: 1, ...(caller() ? CAM.A2 : CAM.B),
        ...at('busygin', P.WAIT, caller() ? brg(P.WAIT, callerAt()) : brg(P.WAIT, P.AT_DOOR), { busygin_mood: 'tired' }), ...silvaIn(), ...cameHere(true) }),
      run: async s => {
        const b = s.person('busygin'), who = cameSet();
        glide(s, who.length ? CAM.meet : CAM.watch, 6);
        b.look(null);
        await s.move('doors', 0, { over: 1.6, ease: 'inOut' });
        if (num('silva_door', 1) === 1) {
          s.person('silva').here(false);
          s.set('silva_window', 1);
        }
        const gone = s.move('train', 1, { over: 18, ease: 'in' });
        await s.wait(1.2);
        if (!who.length) {
          await b.walk([P.WATCH]);
          await b.turn(brg(P.WATCH, [G.FAR_WINDOW[0], G.FAR_WINDOW[1]]));
          b.look('far_window');
          b.mood('sad');
        } else {
          b.mood('thinking');
          const order = [...who].sort((x, y) => (y.first ? 1 : 0) - (x.first ? 1 : 0));
          const meet = order.map((w, i) => s.sequence(async q => {
            await q.wait(i * 0.6);
            const p = q.person(w.id), to = [P.WAIT[0] + 1.0 + 0.5 * i, P.WAIT[1] - 0.7 + 0.6 * ((i % 2) * 2 - 1) * (i ? 1 : 0)];
            await p.walk([to]);
            await p.turn(brg(to, P.WAIT));
          }));
          await b.walk([[12.2, 8.0]]);
          await b.turn(brg([12.2, 8.0], callerAt()));
          await s.all(...meet);
        }
        await gone;
        s.tell('stays:gone');
        await s.wait(1.5);
      },
    },
    // box_hand 1 (the father alone): he comes to the very door and holds out the snuffbox, Busygin takes it —
    // boards:box; he goes in; the doors shut — boards:in
    boards: {
      after: ['last'],
      from: () => base(0.93, 0.5, { ...trainKeys(0), doors: 1, ...CAM.A2,
        ...at('busygin', P.WAIT, caller() ? brg(P.WAIT, callerAt()) : brg(P.WAIT, P.AT_DOOR), { busygin_mood: 'tired', busygin_look: caller() }), ...silvaIn(), ...cameHere(true) }),
      run: async s => {
        const b = s.person('busygin'), give = num('box_hand', 1) === 1 && fatherCame();
        if (give) {
          const sar = s.person('sarafanov'), close = s.shot({ ...CAM.give });
          await s.all(b.walk([[10.6, 9.6]]), sar.walk([P.DOOR_GIVE]));
          await s.until(() => close.ready);
          close.cut();
          await s.all(b.turn(brg([10.6, 9.6], P.DOOR_GIVE)), sar.turn(brg(P.DOOR_GIVE, [10.6, 9.6])));
          b.look('sarafanov');
          sar.look('busygin');
          sar.with([...(sarWith() ?? ['long_scarf']), 'box_held']);
          sar.mood('sad');
          await sar.do('give');
          b.with(['box_held']);
          sar.with(sarWith());
          s.tell('boards:box');
          await b.do('take');
          await s.wait(1.5);
          b.with(null);
        } else {
          s.tell('boards:box');
          await b.walk([[10.6, 9.6]]);
        }
        b.look(null);
        await b.walk([P.AT_DOOR, [DOOR, 10.9]]);
        await s.move('doors', 0, { over: 1.6, ease: 'inOut' });
        s.tell('boards:in');
        await s.wait(0.6);
      },
    },
    // a cut: the camera in the car by the window, the glass under translucent frost; through it — the lamp over the
    // stairs and who came on the stairs' top
    glass: {
      from: () => base(0.93, 0.5, { ...trainKeys(0), doors: 0, wipe: 0, ...CAM.glass, ...cameHere(true) }),
      run: async s => {
        s.tell('glass:ready');
        await s.wait(3);
      },
    },
    // the train moves off right: through the rubbed glass the platform goes away to the right of the frame, the
    // father lifts his hand (away:wave); the platform ends; one lit window passes far below (away:window)
    away: {
      after: ['glass'],
      from: () => base(0.93, 0.5, { ...trainKeys(0), doors: 0, wipe: 0.6, ...CAM.glass, ...cameHere(true) }),
      run: async s => {
        const go = s.move('train', 0.6, { over: 16, ease: 'in' });
        // the father lifts his hand; without him — the moment the stairs' top passes the middle of the frame
        if (fatherCame()) {
          await s.wait(1.6);
          s.person('sarafanov').do('wave');
        } else await s.until(() => G.trainX(s.get('train')) + EYE.x >= P.SAR[0] - (G.SIDE + EYE.z - P.SAR[1]) * Math.tan(((180 - EYE.yaw) * Math.PI) / 180));
        s.tell('away:wave');
        // the window far below in the middle of the frame: the car's eye at across ≈ 40
        await s.until(() => G.trainX(s.get('train')) + EYE.x >= 40);
        s.tell('away:window');
        await go;
      },
    },
    // the epilogue: grey dawn, the snow stopped, snow on the bench. vasya_end home — the platform empty, the first
    // train goes by without stopping; taiga — Vasenka on the bench with his rucksack, the train stands, he gets on at
    // the door before the bench, it goes
    dawn: {
      from: () => {
        const taiga = (get('vasya_end') ?? 'taiga') === 'taiga';
        return base(0.25, 0, { ...trainKeys(-1), bench_snow: 1, ...CAM.dawn,
          ...(taiga ? seated('vasenka', P.DAWN_V, 'seated_bag', { vasenka_with: ['rucksack_lap'], vasenka_mood: 'tired', vasenka_look: [10, 9, 1.4] }) : {}) });
      },
      run: async s => {
        const taiga = (get('vasya_end') ?? 'taiga') === 'taiga';
        if (!taiga) {
          const by = s.move('train', 1, { over: 16, ease: 'linear' });
          await s.until(() => G.trainX(s.get('train')) + EL.half > CAM.dawn.camera_x + 8);
          s.tell('dawn:pass');
          await by;
          await s.wait(1);
          return;
        }
        const v = s.person('vasenka');
        await s.wait(1);
        s.tell('dawn:pass');
        await s.move('train', 0, { over: 8, ease: 'out' });
        v.look('train#back_door');
        await s.wait(0.6);
        s.tell('dawn:open');
        await s.move('doors', 1, { over: 1.4, ease: 'inOut' });
        await rise(v, P.DAWN_V, 'stand_bag');
        await v.walk([[-3.6, 9.0], P.DAWN_DOOR, [BACK_DOOR, 10.9]]);
        v.here(false);
        await s.move('doors', 0, { over: 1.6, ease: 'inOut' });
        s.tell('dawn:shut');
        s.move('train', 1, { over: 12, ease: 'in' });
        await s.wait(5);
      },
    },
  };
  return B;
}

return { G, EL, P, CAM, EYE, WIN, DOOR, BACK_DOOR, IDS, brg, film };
