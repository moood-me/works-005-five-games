// “The Hillside”: the suburban cemetery on its slope at dusk — where everything stands (metres: across to the right along
// the road, distance up the slope), the land's shape, the people's marks, the film's beats. Shared by the paintings,
// the script, the showcase and the relief; the generator (tools/hillside/gen.mjs) writes scene.json from it.

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

// the people's marks
const SPOT = {
  nina: [-2.0, 6.15], busygin: [-1.1, 6.3],
  behind: [-3.55, 6.25],               // Nina behind the birch, out of sight from the slope
  pillar: { nina: [5.75, 6.15], busygin: [6.45, 6.4] },   // in the shadow of the gate's left pillar
  top: [1.4, 24.8],                    // the head of the path
  meet: [2.25, 24.1],                  // Busygin on the path a step below his father, facing him
  caseAt: [0.4, 26.45],                // where the case lies on the snow by the grave, before him
};
// the funeral: the mourners round the grave on its near side, the brass in a row to its right, Sarafanov at the row's
// grave end; all with their backs to us
const FUNERAL = {
  mourner1: [-2.5, 25.35, 20], mourner2: [-1.5, 25.0, 0], mourner3: [0.0, 25.2, 340], mourner4: [-3.4, 25.9, 30],
  sarafanov: [0.75, 26.95, 345], band1: [1.65, 27.1, 345], band2: [2.6, 27.35, 345], band3: [3.5, 27.15, 345],
};
// where they go when it is over: up and over the crest
const AWAY = { mourner1: [-4.5, 44], mourner2: [-3.2, 45], mourner3: [-1.8, 44.5], mourner4: [-5.5, 43.5], band1: [0.5, 45], band2: [1.6, 45.5], band3: [2.6, 45] };

const CAM = {
  road0: { camera_x: -17.0, camera_z: 0.4, camera_yaw: -6, camera_h: 0 },
  march: { camera_x: -1.3, camera_z: 0.6, camera_yaw: 0, camera_h: 0 },
  near: { camera_x: -1.0, camera_z: 2.4, camera_yaw: 2, camera_h: 0 },
  // on the slope below them and to the side, a little under them: both in profile against the snow and the sky
  meet: { camera_x: -1.5, camera_z: 20.7, camera_yaw: 41, camera_h: 0 },
  hide: { camera_x: 0.6, camera_z: 1.2, camera_yaw: 22, camera_h: 0 },
};
const CAMKEYS = ['camera_x', 'camera_z', 'camera_yaw', 'camera_h'];

const AT = (id, p, turn) => ({ [`${id}_a`]: p[0], [`${id}_d`]: p[1], ...(turn == null ? {} : { [`${id}_turn`]: turn }), [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_do`]: 'stand', [`${id}_here`]: true });
const FUNERAL_AT = Object.assign({}, ...Object.entries(FUNERAL).map(([id, p]) => AT(id, p, p[2])));
const FROM = {
  road: { ...CAM.road0, ...FUNERAL_AT, sarafanov_with: null, case_down: 1, hour: 0.74,
    ...AT('nina', [-19.2, 4.4], 90), ...AT('busygin', [-20.0, 5.2], 90) },
};
const END = {
  road: { ...FROM.road, ...CAM.march, ...AT('nina', SPOT.nina, 0), ...AT('busygin', SPOT.busygin, 8), nina_look: 'sarafanov', busygin_look: 'band2' },
};
// after `march`: the mourners and the brass gone over the crest, Sarafanov alone by the grave
const GONE = Object.assign({}, ...Object.keys(AWAY).map(id => ({ [`${id}_here`]: false, [`${id}_a`]: AWAY[id][0], [`${id}_d`]: AWAY[id][1] })));
END.march = { ...END.road, ...GONE };
// after `alone`: he stands at the head of the path with the case; the camera nearer the fence
END.alone = { ...END.march, ...CAM.near, ...AT('sarafanov', SPOT.top, 180), sarafanov_with: ['long_scarf', 'case'], case_down: 0,
  nina_look: 'sarafanov', busygin_look: 'sarafanov' };

const near = (s, id, p, tol = 0.4) => Math.hypot(s.get(`${id}_a`) - p[0], s.get(`${id}_d`) - p[1]) < tol;
async function goOnFrom(s, ends, test) {
  if (!test()) s.cut({ ...ends });
}
const open = (s, ready, values) => (ready ? ready.cut() : s.cut({ ...values }));
// the camera along with a walk, as long as the walk takes
async function follow(s, walk, cam) {
  await s.wait(0.1);
  const over = Math.max(1, walk.remaining || walk.duration || 1);
  for (const k of CAMKEYS) if (k in cam) s.move(k, cam[k], { over, ease: 'linear' });
  return over;
}
const camTo = (s, cam, over, ease = 'inOut') => { for (const k of CAMKEYS) if (k in cam) s.move(k, cam[k], { over, ease }); };

const film = {
  // dusk; along the road from the left, Nina and Busygin; the people on the slope above; they stop at the fence by the
  // birch
  async road(s, ready) {
    open(s, ready, FROM.road);
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
    s.tell('beat:road');
  },
  // the march: they stand at the fence, backs to us; up there the funeral, the brass and the small clarinettist with
  // the light scarf; when it ends the mourners turn and go off over the crest
  async march(s) {
    await goOnFrom(s, END.road, () => near(s, 'nina', SPOT.nina));
    const bus = s.person('busygin');
    await s.wait(9);
    bus.look('sarafanov');
    await s.wait(11);
    // the mourners turn and set off up over the crest (`alone` sees them on their way)
    for (const [i, id] of ['mourner2', 'mourner1', 'mourner3', 'mourner4'].entries()) {
      const p = s.person(id);
      p.turn(170);
      s.after(i * 0.5, () => p.walk([[FUNERAL[id][0] - 1.5, 30], AWAY[id]]));
    }
    await s.wait(3.5);
    s.tell('march:end');
    s.tell('beat:march');
  },
  // the brass after them; he alone lays the clarinet in its case on the snow, takes the case, goes to the head of the
  // path and stands; the camera comes slowly up toward the fence
  async alone(s) {
    await goOnFrom(s, END.march, () => near(s, 'nina', SPOT.nina) && s.get('band1_here') === true);
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
    s.tell('beat:alone');
  },
  // she steps back behind the birch; he goes through the gate and up the path; the old man puts the case behind his back;
  // they stand side by side; the camera comes up the slope with him
  async meet(s) {
    await goOnFrom(s, END.alone, () => near(s, 'sarafanov', SPOT.top));
    const sar = s.person('sarafanov'), nina = s.person('nina'), bus = s.person('busygin');
    nina.look(null);
    await nina.walk([SPOT.behind]);
    nina.turn(20);
    nina.look('sarafanov');
    const up = bus.walk([[4.8, 5.6], [GATE, 6.4], ...PATH.slice(0, 5).reverse().slice(1, -1), SPOT.meet]);
    await s.wait(0.1);
    const over = Math.max(1, up.remaining || 12);
    // the camera through the gate and up the slope behind him, to where it sees the two side by side
    s.path(CAMKEYS, [[4.6, 3.6, 22, 0], [8.0, 6.4, 0, 0], [7.2, 11.4, -14, 0], [0.0, 16.0, 12, 0], CAMKEYS.map(k => CAM.meet[k])], { over, ease: 'inOut' });
    sar.look('busygin');
    await s.wait(Math.max(0, over - 6));
    await sar.do('hide_back');
    s.tell('meet:talk');
    await up;
    await bus.turn(311);
    await sar.turn(131);
    bus.look('sarafanov');
    await s.wait(5);
    bus.reach({ r: 'sarafanov#hand_r' });
    sar.do('stand');
    await s.wait(1.4);
    bus.reach(null);
    sar.with(['long_scarf']);
    bus.with(['case']);
    s.tell('meet:ready');
    s.tell('beat:meet');
  },
  // they step back into the shadow of the gate's pillar; he comes down the path by himself, out on the road, turns
  // right
  async hide(s) {
    await goOnFrom(s, END.alone, () => near(s, 'sarafanov', SPOT.top));
    const sar = s.person('sarafanov'), nina = s.person('nina'), bus = s.person('busygin');
    camTo(s, CAM.hide, 4, 'inOut');
    await s.all(nina.walk([[1.5, 5.6], SPOT.pillar.nina]), (async () => { await s.wait(0.3); await bus.walk([[2.2, 5.8], SPOT.pillar.busygin]); })());
    await s.all(nina.turn(30), bus.turn(10));
    nina.look('sarafanov');
    bus.look('sarafanov');
    await sar.walk([...PATH.slice(1), [12, ROAD_D], [17, ROAD_D]]);
    s.tell('hide:ready');
    s.tell('beat:hide');
  },
};
const AFTER = { march: 'road', alone: 'march', meet: 'alone', hide: 'alone' };

// hour → the dusk going down
const duskOf = hour => span(hour, 0.72, 0.8);

return { height, ROAD_D, FENCE_D, GATE, BIRCH, GRAVE, PATH, ICE, pathAt, pathLen, SPOT, FUNERAL, AWAY, CAM, FROM, END, AFTER, film, duskOf, span, clamp, smooth };
