// “The Hillside”: the suburban cemetery on its slope at dusk — where everything stands (metres: across to the right along
// the road, distance up the slope), the land's shape, the people's marks, the film's beats (film(scene): the world's
// module `beats` plays them). Shared by the paintings, the script, the showcase and the relief; the generator
// (tools/hillside/gen.mjs) writes scene.json from it.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const span = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
const smooth = u => u * u * (3 - 2 * u);

// the land: flat by the road; past the fence the slope rises to its crest (6 m, 30–33 m up) and falls away beyond it
// to the level fields again by 56 m
function height(across, distance) {
  return 6.2 * smooth(span(distance, 8, 31)) - 6.2 * smooth(span(distance, 34, 56)) + 0.6 * smooth(span(distance, 10, 30)) * (1 - smooth(span(distance, 34, 50))) * Math.sin(across * 0.09);
}

const ROAD_D = 4.8;
const FENCE_D = 7.0;
const GATE = 8.0;
const BIRCH = [-3.2, 7.55];
const GRAVE = [-1.0, 26.6];
// the icy path from the grave down to the gate, zigzag; its three icy stretches (shares of its way)
const PATH = [[1.4, 24.8], [6.2, 20.6], [2.2, 15.6], [7.4, 10.6], [GATE, 7.6], [GATE, ROAD_D]];
const ICE = [0.3, 0.55, 0.8];
const pathLen = () => { let l = 0; for (let i = 1; i < PATH.length; i++) l += Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]); return l; };
function pathAt(u) {
  const total = pathLen();
  let want = u * total;
  for (let i = 1; i < PATH.length; i++) {
    const a = PATH[i - 1], b = PATH[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (want <= l) return [a[0] + ((b[0] - a[0]) * want) / l, a[1] + ((b[1] - a[1]) * want) / l];
    want -= l;
  }
  return PATH[PATH.length - 1].slice();
}
// how far along the path a point is (the nearest of its sampled points), 0…1
const PATH_PTS = Array.from({ length: 401 }, (_, i) => pathAt(i / 400));
function pathU(a, d) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < PATH_PTS.length; i++) {
    const k = (PATH_PTS[i][0] - a) ** 2 + (PATH_PTS[i][1] - d) ** 2;
    if (k < bd) { bd = k; best = i; }
  }
  return best / 400;
}
// the shares of the path at which its corners are
const PATH_U = (() => { const total = pathLen(); let run = 0; return PATH.map((p, i) => { if (i) run += Math.hypot(p[0] - PATH[i - 1][0], p[1] - PATH[i - 1][1]); return run / total; }); })();
// the two going down the path arm in arm: the father on it, Busygin at his left hand (left of the way they go)
const BUS_SIDE = 0.65;
function pair(u) {
  const p = pathAt(u), q = pathAt(Math.min(1, u + 0.02)), r = pathAt(Math.max(0, u - 0.02));
  const dx = q[0] - r[0], dd = q[1] - r[1], l = Math.hypot(dx, dd) || 1;
  return { sar: p, bus: [p[0] - (dd / l) * BUS_SIDE, p[1] + (dx / l) * BUS_SIDE] };
}
// the places of the pair from u0 to u1: each corner of the path between, then u1
function pairWay(u0, u1) {
  const out = PATH_U.filter(u => u > u0 + 0.01 && u < u1 - 0.01).map(pair);
  out.push(pair(u1));
  return out;
}

// the road along the foot (the track of “Following”): 0 at the gate's pillar, 1 at the club's steps
const ROAD_A0 = 6.2, ROAD_A1 = 53.5, ROAD_Y = 5.0;
const roadAt = u => [ROAD_A0 + (ROAD_A1 - ROAD_A0) * u, ROAD_Y];
const roadU = a => clamp((a - ROAD_A0) / (ROAD_A1 - ROAD_A0), 0, 1);
// the railwaymen's club by the road: its front on the line d 9, the door over the steps at the road's end
const CLUB = { a: 55.5, d: 9.0, w: 11, door: 53.5, steps: [ROAD_A1, 6.6], landing: [ROAD_A1, 8.2], porchTop: 0.45 };

// the people's marks
const SPOT = {
  nina: [-2.0, 6.15], busygin: [-1.1, 6.3],
  behind: [-3.55, 6.25],               // Nina behind the birch, out of sight from the slope
  pillar: { nina: [5.75, 6.15], busygin: [6.45, 6.4] },   // in the shadow of the gate's left pillar
  top: [1.4, 24.8],                    // the head of the path
  meet: [2.25, 24.1],                  // Busygin on the path a step below his father, facing him
  caseAt: [0.4, 26.45],                // where the case lies on the snow by the grave, before him
  gate: { sarafanov: [8.95, 5.3], busygin: [7.05, 5.45] },   // at the gate's foot on the road, face to face
  gone: [9.6, ROAD_Y],                 // where the old man turns right on the road
  club: { nina: [47.9, 5.35], busygin: [48.9, 5.55] },      // in the road before the club, by the way they came
};
// the funeral: the mourners round the grave on its near side, the brass in a row to its right, Sarafanov at the row's
// grave end; all with their backs to us
const FUNERAL = {
  mourner1: [-2.5, 25.35, 20], mourner2: [-1.5, 25.0, 0], mourner3: [0.0, 25.2, 340], mourner4: [-3.4, 25.9, 30],
  sarafanov: [0.75, 26.95, 345], band1: [1.65, 27.1, 345], band2: [2.6, 27.35, 345], band3: [3.5, 27.15, 345],
};
// where they go when it is over: up and over the crest
const AWAY = { mourner1: [-4.5, 44], mourner2: [-3.2, 45], mourner3: [-1.8, 44.5], mourner4: [-5.5, 43.5], band1: [0.5, 45], band2: [1.6, 45.5], band3: [2.6, 45] };
const PEOPLE = ['nina', 'busygin', 'sarafanov', 'band1', 'band2', 'band3', 'mourner1', 'mourner2', 'mourner3', 'mourner4'];

const CAM = {
  road0: { camera_x: -18.3, camera_z: 0.4, camera_yaw: -6, camera_h: 0 },
  march: { camera_x: -1.3, camera_z: 0.6, camera_yaw: 0, camera_h: 0 },
  // from the slope beyond the fence: the two by the birch seen in three quarters, looking up at the funeral
  talk: { camera_x: 1.2, camera_z: 8.6, camera_yaw: -130, camera_h: 0 },
  near: { camera_x: -1.0, camera_z: 2.4, camera_yaw: 2, camera_h: 0 },
  // on the slope below them and to the side, a little under them: both in profile against the snow and the sky
  meet: { camera_x: -1.0, camera_z: 22.2, camera_yaw: 45, camera_h: 0 },
  hide: { camera_x: 0.6, camera_z: 1.2, camera_yaw: 22, camera_h: 0 },
  // on the road at the gate's foot: the two face to face, the pillar behind them
  bottom: { camera_x: 8.0, camera_z: 2.3, camera_yaw: 0, camera_h: 0 },
  // on the road before the club: the two in profile at the left, the steps and the door at the right
  club: { camera_x: 49.6, camera_z: 1.3, camera_yaw: 12, camera_h: 0 },
};
const CAMKEYS = ['camera_x', 'camera_z', 'camera_yaw', 'camera_h'];
// “Arm in Arm”: the camera goes down the slope with the pair, a fixed way off them (as at the end of `meet`)
const DOWN_CAM = { dx: -2.4, dz: -2.6, yaw: 45 };
const downCam = p => [p[0] + DOWN_CAM.dx, p[1] + DOWN_CAM.dz, DOWN_CAM.yaw, 0];
// “Following”: the camera along the road, behind the road's far edge, the father a little right of its middle
const trailCam = a => [a - 2.4, -3.2, 0, 0];

// a person at a place, doing nothing, looking at nothing, here
const AT = (id, p, turn, extra = {}) => ({
  [`${id}_a`]: p[0], [`${id}_d`]: p[1], ...(turn == null ? {} : { [`${id}_turn`]: turn }),
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_do`]: 'stand', [`${id}_here`]: true, [`${id}_mood`]: null, [`${id}_gait`]: null, ...extra });
const FUNERAL_AT = Object.assign({}, ...Object.entries(FUNERAL).map(([id, p]) => AT(id, p, p[2])));
const THREE = { sarafanov_with: ['long_scarf', 'case'], case_down: 0 };
const GONE = Object.assign({}, ...Object.keys(AWAY).map(id => ({ [`${id}_here`]: false, [`${id}_a`]: AWAY[id][0], [`${id}_d`]: AWAY[id][1] })));

const FROM = {
  road: () => ({ ...CAM.road0, ...FUNERAL_AT, sarafanov_with: null, case_down: 1, hour: 0.74, club_door: 0, down: 0, down_at: 0, catch: 0, fall: 0, sar_go: 0, sar_at: 0, follow: 0, follow_at: 0, hold: 0, duck: 0,
    ...AT('nina', [-18.9, 4.5], 90, { nina_mood: 'tired' }), ...AT('busygin', [-19.8, 5.2], 90, { busygin_mood: 'thinking' }) }),
};
const END = {};
END.road = () => ({ ...FROM.road(), ...CAM.march, ...AT('nina', SPOT.nina, 0, { nina_mood: 'tired', nina_look: 'sarafanov' }), ...AT('busygin', SPOT.busygin, 8, { busygin_mood: 'thinking', busygin_look: 'band2' }) });
// after `march`: the mourners and the brass gone over the crest, Sarafanov alone by the grave
END.march = () => ({ ...END.road(), ...GONE, nina_mood: 'sad', busygin_mood: 'surprised', busygin_look: 'sarafanov' });
// after `alone`: he stands at the head of the path with the case; the camera nearer the fence
END.alone = () => ({ ...END.march(), ...CAM.near, ...AT('sarafanov', SPOT.top, 180, THREE), hour: 0.77, nina_look: 'sarafanov', busygin_look: 'sarafanov' });

const near = (s, id, p, tol = 0.4) => Math.hypot(s.get(`${id}_a`) - p[0], s.get(`${id}_d`) - p[1]) < tol;
// the camera along with a walk, as long as the walk takes
async function follow(s, walk, cam) {
  await s.wait(0.1);
  const over = Math.max(1, walk.remaining || walk.duration || 1);
  for (const k of CAMKEYS) if (k in cam) s.move(k, cam[k], { over, ease: 'linear' });
  return over;
}
const camTo = (s, cam, over, ease = 'inOut') => { for (const k of CAMKEYS) if (k in cam) s.move(k, cam[k], { over, ease }); };
const mood = (s, who, how) => s.person(who).mood(how);

// ── the film: film(scene) → { <name>: { from, after, run } } (modules/beats.md) ──
function film(scene) {
  return {
    // dusk; along the road from the left, Nina and Busygin; the people on the slope above; they stop at the fence by the
    // birch
    road: {
      from: FROM.road,
      async run(s) {
        const nina = s.person('nina'), bus = s.person('busygin');
        const nw = nina.walk([[-9, 4.6], [-2.6, 5.4], SPOT.nina]);
        await s.wait(0.5);
        const bw = bus.walk([[-9.5, 5.2], [-1.6, 5.5], SPOT.busygin]);
        await follow(s, bw, CAM.march);
        await s.all(nw, bw);
        await s.all(nina.turn(0), bus.turn(8));
        nina.look('sarafanov');
        bus.look('band2');
        s.tell('road:fence');
        await s.wait(1.2);
      },
    },
    // the march: they stand at the fence, backs to us; up there the funeral, the brass and the small clarinettist with
    // the light scarf; Nina tells him (the cut to the two by the birch, their faces, and back); when it ends the
    // mourners turn and go off over the crest
    march: {
      after: 'road',
      from: END.road,
      async run(s) {
        const nina = s.person('nina'), bus = s.person('busygin');
        const talk = s.shot({ ...CAM.talk });
        await s.wait(3);
        talk.cut();
        nina.mood('sad');
        bus.mood('surprised');
        await s.wait(10);
        const back = s.shot({ ...CAM.march });
        back.cut();
        bus.look('sarafanov');
        await s.wait(6);
        // the mourners turn and set off up over the crest (`alone` sees them on their way)
        for (const [i, id] of ['mourner2', 'mourner1', 'mourner3', 'mourner4'].entries()) {
          const p = s.person(id);
          p.turn(170);
          s.after(i * 0.5, () => p.walk([[FUNERAL[id][0] - 1.5, 30], AWAY[id]]));
        }
        await s.wait(3.5);
        s.tell('march:end');
      },
    },
    // the brass after them; he alone lays the clarinet in its case on the snow, takes the case, goes to the head of the
    // path and stands; the camera comes slowly up toward the fence
    alone: {
      after: 'march',
      from: END.march,
      async run(s) {
        const sar = s.person('sarafanov'), nina = s.person('nina'), bus = s.person('busygin');
        camTo(s, CAM.near, 20, 'inOut');
        s.move('hour', 0.77, { over: 24, ease: 'linear' });
        // the mourners on over the crest (from wherever they are), the brass after them; gone past it, they are not here
        const away = (id, wait, turn) => (async () => {
          if (s.get(`${id}_here`) === false) return;
          const p = s.person(id);
          await s.wait(wait);
          if (turn) await p.turn(turn);
          await p.walk([[FUNERAL[id][0] - 1.2, 31], AWAY[id]]);
          p.here(false);
        })();
        const going = [away('mourner2', 0), away('mourner1', 0.2), away('mourner3', 0.4), away('mourner4', 0.6),
          away('band2', 1.2, 175), away('band1', 1.9, 175), away('band3', 2.6, 175)];
        await s.wait(2.5);
        sar.look(SPOT.caseAt.concat(0));
        await sar.turn(210);
        await sar.do('put_down');
        sar.with(['long_scarf']);
        await s.wait(0.6);
        await sar.do('pick_up');
        sar.with(['long_scarf', 'case']);
        s.set('case_down', 0);
        s.tell('alone:case');
        sar.look(null);
        await sar.walk([SPOT.top]);
        await sar.turn(180);
        nina.look('sarafanov');
        bus.look('sarafanov');
        await s.all(...going);
        await s.wait(1.5);
      },
    },
    // she steps back behind the birch; he goes through the gate and up the path; the old man puts the case behind his back;
    // they stand side by side; the camera comes up the slope with him
    meet: {
      after: 'alone',
      from: END.alone,
      async run(s) {
        const sar = s.person('sarafanov'), nina = s.person('nina'), bus = s.person('busygin');
        nina.look(null);
        await nina.walk([SPOT.behind]);
        nina.turn(20);
        nina.look('sarafanov');
        const up = bus.walk([[4.8, 5.6], [GATE, 6.4], ...PATH.slice(0, 5).reverse().slice(1, -1), SPOT.meet]);
        await s.wait(0.1);
        const over = Math.max(1, up.remaining || 12);
        // the camera through the gate and up the slope behind him, to where it sees the two side by side
        s.path(CAMKEYS, [[4.6, 3.6, 22, 0], [4.8, 8.0, -5, 0], [0.5, 13.0, 12, 0], [-1.5, 18.5, 30, 0], CAMKEYS.map(k => CAM.meet[k])], { over, ease: 'inOut' });
        sar.look('busygin');
        sar.mood('afraid');
        bus.mood('thinking');
        await s.wait(Math.max(0, over - 6));
        await sar.do('hide_back');
        s.tell('meet:talk');
        await up;
        await bus.turn(311);
        await sar.turn(131);
        bus.look('sarafanov');
        await s.wait(3);
        sar.mood('smile');
        await s.wait(2);
        bus.reach({ r: 'sarafanov#hand_r' });
        sar.do('stand');
        await s.wait(1.4);
        bus.reach(null);
        sar.with(['long_scarf']);
        bus.with(['case']);
        s.tell('meet:ready');
      },
    },
    // after “Arm in Arm”: at the gate's foot on the road; if he fell on the path, snow on the back of his coat — he
    // brushes it off, laughs; he takes the case from Busygin and goes off along the road to the club; Nina comes out
    // from behind the birch
    bottom: {
      from: () => ({ ...END.alone(), ...CAM.bottom, hour: 0.78, down: 1, down_at: 1, catch: 0, fall: 0,
        ...AT('sarafanov', SPOT.gate.sarafanov, 270, { sarafanov_with: Number(scene.get('snowy')) ? ['long_scarf', 'snow_back'] : ['long_scarf'], sarafanov_mood: 'smile', sarafanov_look: 'busygin' }),
        ...AT('busygin', SPOT.gate.busygin, 90, { busygin_with: ['case'], busygin_mood: 'tired', busygin_look: 'sarafanov' }),
        ...AT('nina', SPOT.behind, 20, { nina_mood: 'thinking', nina_look: 'busygin' }) }),
      async run(s) {
        const sar = s.person('sarafanov'), bus = s.person('busygin'), nina = s.person('nina');
        if (Number(s.get('snowy'))) {
          sar.look(null);
          sar.reach({ r: 'sarafanov#back' });
          sar.mood('laugh');
          await s.wait(2.6);
          sar.reach(null);
          sar.look('busygin');
          sar.mood('smile');
          await s.wait(0.4);
        } else await s.wait(1.2);
        await sar.do('take');
        bus.with([]);
        sar.with(['long_scarf', 'case']);
        await s.wait(2.6);
        sar.look(null);
        await sar.turn(90);
        bus.look('sarafanov');
        await sar.walk([SPOT.gone, [15.5, ROAD_Y]]);
        bus.look(null);
        s.tell('bottom:gone');
        nina.walk([[-1, 5.7], [SPOT.gate.busygin[0] - 1.1, 5.6]]);
        nina.look(null);
        await s.wait(5);
      },
    },
    // they step back into the shadow of the gate's pillar; he comes down the path by himself, out on the road, turns
    // right
    hide: {
      after: 'alone',
      from: END.alone,
      async run(s) {
        const sar = s.person('sarafanov'), nina = s.person('nina'), bus = s.person('busygin');
        camTo(s, CAM.hide, 4, 'inOut');
        await s.all(nina.walk([[1.5, 5.6], SPOT.pillar.nina]), (async () => { await s.wait(0.3); await bus.walk([[2.2, 5.8], SPOT.pillar.busygin]); })());
        await s.all(nina.turn(30), bus.turn(10));
        nina.look('sarafanov');
        bus.look('sarafanov');
        await sar.walk([...PATH.slice(1), [GATE + 0.8, ROAD_Y], SPOT.gone]);
        await sar.turn(90);
        s.tell('hide:ready');
      },
    },
    // after “Following”: before the club, the two in the road in profile; the father goes up the steps; if he all but
    // saw them, on the top step he turns and looks down the road for long, and only then goes in; the door opens, the
    // warm light, in, the door shuts
    club: {
      from: () => ({ ...END.alone(), ...CAM.club, hour: 0.79, club_door: 0, sar_go: 0, sar_at: 1, follow: roadU(SPOT.club.busygin[0]), follow_at: roadU(SPOT.club.busygin[0]), hold: 0, duck: 0,
        ...AT('sarafanov', [ROAD_A1, 6.3], 0, { ...THREE, sarafanov_mood: 'neutral' }),
        ...AT('nina', SPOT.club.nina, 90, { nina_mood: 'smile', nina_look: 'sarafanov' }),
        ...AT('busygin', SPOT.club.busygin, 90, { busygin_mood: 'sad', busygin_look: 'sarafanov' }) }),
      async run(s) {
        const sar = s.person('sarafanov');
        await sar.walk([CLUB.landing]);
        if (Number(s.get('seen'))) {
          await sar.do('look_back');
          await s.wait(2.4);
        }
        await sar.turn(0);
        s.move('club_door', 1, { over: 1.1, ease: 'inOut' });
        await s.wait(1.4);
        await sar.walk([[CLUB.door, CLUB.d - 0.3]]);
        sar.here(false);
        s.move('club_door', 0, { over: 1.0, ease: 'inOut' });
        await s.wait(1.0);
        s.tell('club:in');
        await s.wait(3);
      },
    },
  };
}

// hour → the dusk going down
const duskOf = hour => span(hour, 0.72, 0.8);

return { height, ROAD_D, FENCE_D, GATE, BIRCH, GRAVE, PATH, ICE, pathAt, pathLen, pathU, pair, pairWay, BUS_SIDE, ROAD_A0, ROAD_A1, ROAD_Y, roadAt, roadU, CLUB, SPOT, FUNERAL, AWAY,
  PEOPLE, CAM, CAMKEYS, downCam, trailCam, FROM, END, film, duskOf, span, clamp, smooth, near, mood };
