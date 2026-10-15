// «Улица»: where everything stands (metres: across to the right along the street, distance away from the near side),
// the people's marks, the film's beats. Shared by the paintings, the script and the showcase; the generator
// (tools/ulica-opus/gen.mjs) writes scene.json from it.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const span = (v, a, b) => clamp((v - a) / (b - a), 0, 1);

// ── the place ──
// the far side: three houses with the five windows of «Окна»; Сарафановы; Макарская. Each house a long log wall
// facing the street (its front at `d`), `w` wide, `deep` back; windows by x from the house's middle.
const SILL = 1.15;
const HOUSES = [
  { id: 'h1', a: -11, d: 14, w: 9, deep: 6, color: '#6f5844', windows: [{ x: -3, w: 1.0, h: 1.1, sill: SILL, pane: 'win1' }, { x: 3, w: 1.0, h: 1.1, sill: SILL, pane: 'win2' }] },
  { id: 'h2', a: 0.5, d: 14, w: 9.4, deep: 6, color: '#665443', windows: [{ x: -2.5, w: 1.0, h: 1.1, sill: SILL, pane: 'win3' }, { x: 3.5, w: 1.0, h: 1.1, sill: SILL, pane: 'win4' }] },
  { id: 'h3', a: 10.5, d: 14, w: 7, deep: 6, color: '#735b47', windows: [{ x: -0.5, w: 1.0, h: 1.1, sill: SILL, pane: 'win5' }] },
  // Сарафановы: the room's window (dark), the kitchen's (cut through: the kitchen is behind it), the door
  { id: 'sar', a: 21.5, d: 12, w: 10, deep: 7, color: '#6a5240', windows: [{ x: -2.9, w: 1.0, h: 1.1, sill: SILL, pane: 'sar_room' }, { x: 0.5, w: 1.2, h: 1.0, sill: 1.1 }], door: { x: 3.7, w: 0.9, h: 1.95 } },
  // Макарская: her window, her door (closed: its leaf is mak_door)
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
const THRESHOLD = [25.2, 12.45];
const MAK_DOOR = { a: 36.9, d: 13, w: 0.9, h: 1.95 };
// the kitchen behind its window: a 3 × 3 m room; its table under the lamp, the stove at its left wall
const KITCHEN = { a0: 20.5, a1: 23.5, d0: 12, d1: 15 };
const TABLE = { a: 21.65, d: 13.65, w: 1.3, depth: 0.8 };
const LAMP = [21.65, 13.65, PLINTH + 1.85];
const STOVE = { a: 20.55, d: 14.35 };
// the porch before the door: a landing at the floor's height, its steps down to the snow
const PORCH = { a0: 24.4, a1: 26.0, d0: 10.95, d1: 12, steps: 10.2 };
// the front garden's fence before Сарафановы, its gate; the fence between the yards (its wicket); the near fence
const SAR_FENCE = { a: 15.6, d: 9.4, len: 8.2, gate: [4.0, 5.2] };
const GATE_LAMP = [19.3, 9.25];
const SIDE_FENCE = { a: 27.4, d: 9.6, len: 5, gate: [0.6, 1.4] };
const STREET_LAMP = [-5.3, 13.4];
const SHED = { a: 28.9, d: 11.2, w: 2.6, h: 2.4, deep: 2 };
const BARREL = [17.0, 8.95];
const BENCH = [21.9, 11.55];
const WOODPILE = [36.9, 10.7];

// the people's marks
const SPOT = {
  // «Окна»: in the middle of the street, before the windows
  windows: { busygin: [-2.7, 5.0], silva: [-1.5, 5.35] },
  // the hiding place: in the dark by Макарская's woodpile, a few metres right of her window
  corner: { busygin: [34.6, 10.0], silva: [35.45, 10.25] },
  // the porch: Сильва up on the landing, left of the door; Бусыгин below, right of the steps
  porch: { busygin: [26.3, 9.9], silva: [24.75, 11.55], vasenka: [25.2, 12.35] },
  // Сарафанов under Макарская's window; under his own kitchen window
  mak: [32.0, 12.4],
  under: [20.95, 10.8],
};
// before a window of «Окна», close enough to knock
const knockSpot = n => { const w = winOf(`win${n}`); return [w.a + 0.05, w.d - 0.6]; };
// the kitchen's people (the ones who came in): where each stands or sits
const SEATS = { k1: [21.0, 13.55, 90], k3: [21.75, 14.25, 180] };
const K2_STOVE = [21.05, 14.3, 270];

// the camera's shots: {camera_x, camera_z, camera_yaw, camera_h}
const CAM = {
  // walking along the street the camera goes beside them, as long as Бусыгин's walk takes (follow, below)
  walk0: { camera_target: null, camera_x: -33.5, camera_z: -1.2, camera_yaw: -6, camera_h: 0 },
  walk1: { camera_target: null, camera_x: -2.1, camera_z: 0, camera_yaw: 0, camera_h: 0 },
  last0: { camera_target: null, camera_x: 4, camera_z: -0.5, camera_yaw: 4, camera_h: 0 },
  last1: { camera_target: null, camera_x: 28, camera_z: 1.0, camera_yaw: 0, camera_h: 0 },
  wide: { camera_target: null, camera_x: -2.1, camera_z: -7.2, camera_yaw: 0, camera_h: 0.3 },
  corner: { camera_target: null, camera_x: 37.9, camera_z: 9.7, camera_yaw: -64, camera_h: 0.2 },
  porch: { camera_target: null, camera_x: 26.5, camera_z: 5.0, camera_yaw: -20, camera_h: 0 },
  under: { camera_target: null, camera_x: 23.6, camera_z: 6.8, camera_yaw: -26, camera_h: 0 },
};

// the beats' openings (what a cut to them sets) and their ends (what a beat after them starts from)
const OUT = { vasenka_here: false, sarafanov_here: false, k1_here: false, k2_here: false, k3_here: false };
const WIN_ON = { win1: 1, win2: 1, win3: 1, win4: 1, win5: 1 };
const WIN_OFF = { win1: 0, win2: 0, win3: 0, win4: 0, win5: 0 };
const AT = (id, p, turn) => ({ [`${id}_a`]: p[0], [`${id}_d`]: p[1], ...(turn == null ? {} : { [`${id}_turn`]: turn }), [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_do`]: 'stand' });
const FROM = {
  walk: { ...CAM.walk0, ...OUT, ...WIN_ON, mak_window: 0, door: 0, porch_light: 0, knock: 0, hour: 0.9, busygin_here: true, silva_here: true,
    ...AT('busygin', [-37.8, 7.2], 75), ...AT('silva', [-36.6, 8.6], 75) },
  last_window: { ...CAM.last0, ...OUT, ...WIN_OFF, mak_window: 0, door: 0, porch_light: 0, knock: 0, hour: 0.92, busygin_here: true, silva_here: true,
    ...AT('busygin', [5.4, 5.1], 90), ...AT('silva', [6.6, 5.9], 90) },
  neighbor: { ...CAM.corner, ...OUT, ...WIN_OFF, mak_window: 0, door: 0, porch_light: 0, knock: 0, hour: 0.92, busygin_here: true, silva_here: true,
    ...AT('busygin', SPOT.corner.busygin, 322), ...AT('silva', SPOT.corner.silva, 318),
    sarafanov_here: false, ...AT('sarafanov', INSIDE, 90), vasenka_here: false, ...AT('vasenka', [29.9, 14.1], 270) },
  return: { ...CAM.under, ...OUT, ...WIN_OFF, mak_window: 0, door: 0, porch_light: 0, knock: 0, hour: 0.94, busygin_here: false, silva_here: false,
    sarafanov_here: true, ...AT('sarafanov', [11.5, 7.2], 90),
    k1_here: true, ...AT('k1', SEATS.k1.slice(0, 2), SEATS.k1[2]), k1_do: 'seated',
    k2_here: true, ...AT('k2', K2_STOVE.slice(0, 2), K2_STOVE[2]), k2_do: 'warm_hands',
    k3_here: true, ...AT('k3', SEATS.k3.slice(0, 2), SEATS.k3[2]), k3_do: 'seated' },
};
// the end of `walk` (`knock_ready` starts from it); the end of `neighbor` (`porch` starts from it); of `porch` (`shut`,
// `in` start from it)
const END = {
  walk: { ...FROM.walk, ...CAM.walk1, ...AT('busygin', SPOT.windows.busygin, 0), ...AT('silva', SPOT.windows.silva, 350) },
  neighbor: { ...FROM.neighbor, sarafanov_here: false, vasenka_here: false, door: 0, ...AT('busygin', SPOT.corner.busygin, 300), ...AT('silva', SPOT.corner.silva, 300) },
  porch: { ...FROM.neighbor, ...CAM.porch, door: 1, porch_light: 1, sarafanov_here: false, vasenka_here: true,
    ...AT('vasenka', SPOT.porch.vasenka, 180), ...AT('busygin', SPOT.porch.busygin, 335), ...AT('silva', SPOT.porch.silva, 35) },
};
END.knock_ready = { ...END.walk, ...CAM.wide };

// ── the film: each beat a function of a sequence (s) ──
const near = (s, id, p, tol = 0.35) => Math.hypot(s.get(`${id}_a`) - p[0], s.get(`${id}_d`) - p[1]) < tol;
// a beat that goes on from another: cut to that one's end unless the scene stands there
async function goOnFrom(s, ends, test) {
  if (!test()) s.cut({ ...ends });
}
// the camera along with a walk, as long as the walk takes (it knows its length a moment after it sets off)
async function follow(s, walk, cam) {
  await s.wait(0.1);
  const over = Math.max(1, walk.remaining || walk.duration || 1);
  for (const [k, v] of Object.entries(cam)) if (k !== 'camera_target') s.move(k, v, { over, ease: 'linear' });
}
// a beat's opening cut: the shot the scene made ready (beat_next) if there is one, else a plain cut
const open = (s, ready, values) => (ready ? ready.cut() : s.cut({ ...values }));

const film = {
  // night, snow; they come down from the platform and along the street to the five lit windows; stop, backs to us
  async walk(s, ready) {
    open(s, ready, FROM.walk);
    const bus = s.person('busygin'), sil = s.person('silva');
    const wb = [[-30, 5.5], [-12, 5.1], SPOT.windows.busygin];
    const ws = [[-30, 6.6], [-12, 6.2], SPOT.windows.silva];
    const sw = sil.walk(ws);
    await s.wait(0.4);
    const bw = bus.walk(wb);
    await follow(s, bw, CAM.walk1);
    await s.all(bw, sw);
    bus.look('win2');
    await s.all(bus.turn(0), sil.turn(350));
    sil.look('win4');
    s.tell('walk:stop');
    await s.wait(1.6);
    s.tell('beat:walk');
  },
  // the camera draws back to the near fence: the five windows and the two in the middle of the street
  async knock_ready(s) {
    // a cut back to the near fence: the five windows, the two small in the middle of the street
    if (near(s, 'busygin', SPOT.windows.busygin, 0.6)) s.cut({ ...CAM.wide });
    else s.cut({ ...END.knock_ready });
    await s.wait(2.2);
    s.tell('beat:knock_ready');
  },
  // the windows dark, the snow thicker; they go along the street to the dark corner by Макарская's woodpile
  async last_window(s, ready) {
    open(s, ready, FROM.last_window);
    const bus = s.person('busygin'), sil = s.person('silva');
    const bw = bus.walk([[16, 6.2], [30.5, 7.6], SPOT.corner.busygin]);
    await s.wait(0.3);
    const sw = sil.walk([[17.6, 7.2], [31.8, 8.6], SPOT.corner.silva]);
    await follow(s, bw, CAM.last1);
    await s.all(bw, sw);
    await s.all(bus.turn(300), sil.turn(300));
    bus.look('kitchen#glow');
    sil.look('kitchen#glow');
    s.tell('last_window:corner');
    await s.wait(2);
    s.tell('beat:last_window');
  },
  // from behind them: Сарафанов comes out, knocks at her window, is answered, goes off past them;
  // then Васенька comes out from behind the shed and goes into the house
  async neighbor(s, ready) {
    open(s, ready, FROM.neighbor);
    const sar = s.person('sarafanov'), vas = s.person('vasenka'), bus = s.person('busygin'), sil = s.person('silva');
    bus.look([DOOR.a, DOOR.d, 1.4]);
    sil.look([DOOR.a, DOOR.d, 1.4]);
    await s.wait(1.4);
    await s.move('door', 1, { over: 1.1, ease: 'out' });
    sar.here(true);
    await sar.walk([THRESHOLD, [DOOR.a, 11.2], [DOOR.a, 10.0], [26.6, 8.3], [30.6, 8.4], [31.7, 10.5], SPOT.mak]);
    s.move('door', 0, { over: 1.2 });
    bus.look('sarafanov');
    sil.look('sarafanov');
    await sar.turn(0);
    const knock = sar.do('knock');
    await s.wait(0.6);
    s.tell('neighbor:knock');
    await knock;
    await s.wait(1.2);
    s.set('mak_window', 2);
    s.tell('neighbor:answer');
    await s.wait(7.5);
    s.set('mak_window', 0);
    await s.wait(1.8);
    await sar.turn(75);
    sar.look(null);
    await sar.walk([[33.4, 12.3], [37.8, 12.1], [44.5, 11.2]]);
    sar.here(false);
    s.tell('neighbor:gone');
    bus.look([29.5, 12.5, 1.3]);
    vas.here(true);
    await vas.walk([[27.75, 13.6], [27.75, 10.6], [26.9, 10.6], [DOOR.a, 10.0], [DOOR.a, 11.4]]);
    await s.move('door', 1, { over: 0.9, ease: 'out' });
    await vas.walk([THRESHOLD, INSIDE]);
    vas.here(false);
    await s.move('door', 0, { over: 1.0 });
    bus.look(null);
    sil.look([DOOR.a, DOOR.d, 1.4]);
    s.tell('neighbor:vasya');
    s.tell('beat:neighbor');
  },
  // to the porch; Сильва knocks; the door opens, Васенька against the light; the camera to the side of the porch
  async porch(s) {
    await goOnFrom(s, END.neighbor, () => near(s, 'busygin', SPOT.corner.busygin));
    const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
    bus.look(null);
    sil.look(null);
    for (const [k, v] of Object.entries(CAM.porch)) if (k !== 'camera_target') s.move(k, v, { over: 8, ease: 'inOut' });
    await s.all(
      sil.walk([[31.5, 9.2], [27.2, 9.3], [DOOR.a, 9.9], [DOOR.a, 10.9], SPOT.porch.silva]),
      (async () => { await s.wait(0.5); await bus.walk([[31.0, 9.4], [28.0, 9.4], SPOT.porch.busygin]); })(),
    );
    await s.all(sil.turn(35), bus.turn(335));
    bus.look([DOOR.a, DOOR.d, 1.6]);
    const knock = sil.do('knock');
    await s.wait(0.6);
    s.tell('porch:knock');
    await knock;
    await s.wait(1.4);
    // behind the shut door, at the threshold: he is there when it opens
    s.set('vasenka_a', SPOT.porch.vasenka[0]);
    s.set('vasenka_d', SPOT.porch.vasenka[1]);
    s.set('vasenka_turn', 180);
    vas.here(true);
    s.set('porch_light', 1);
    await s.move('door', 1, { over: 1.0, ease: 'out' });
    s.tell('porch:open');
    vas.look('silva');
    sil.look('vasenka');
    await s.wait(2.6);
    s.tell('beat:porch');
  },
  // «Тут не гостиница»: he steps back, the door shuts, the porch light goes out; in the dark; Сильва knocks again
  async shut(s) {
    await goOnFrom(s, END.porch, () => s.get('door') > 0.9 && s.get('vasenka_here') === true);
    const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
    await s.wait(2.4);
    await vas.walk([THRESHOLD, INSIDE]);
    vas.here(false);
    await s.move('door', 0, { over: 0.7, ease: 'in' });
    s.set('porch_light', 0);
    s.tell('shut:closed');
    sil.look(null);
    bus.look([22, 8, 1.2]);
    bus.do('warm_hands', { loop: true });
    await s.wait(4.2);
    bus.do('stand');
    bus.look('silva');
    sil.look([DOOR.a, DOOR.d, 1.6]);
    const knock = sil.do('knock');
    await s.wait(0.6);
    s.tell('shut:knock');
    await knock;
    await s.wait(1.2);
    s.set('porch_light', 1);
    // behind the shut door, at the threshold: he is there when it opens
    s.set('vasenka_a', SPOT.porch.vasenka[0]);
    s.set('vasenka_d', SPOT.porch.vasenka[1]);
    s.set('vasenka_turn', 180);
    vas.here(true);
    await s.move('door', 1, { over: 1.0, ease: 'out' });
    vas.look('silva');
    s.tell('shut:again');
    await s.wait(1.5);
    s.tell('beat:shut');
  },
  // in: Васенька goes back inside, they after him; the door shuts; their shadows cross the kitchen window
  async in(s) {
    await goOnFrom(s, END.porch, () => s.get('door') > 0.9 && s.get('vasenka_here') === true);
    const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
    vas.look(null);
    await vas.walk([THRESHOLD, INSIDE]);
    vas.here(false);
    await sil.walk([[DOOR.a, 11.95], THRESHOLD, INSIDE]);
    sil.here(false);
    await bus.walk([[DOOR.a, 10.0], [DOOR.a, 11.0], THRESHOLD, INSIDE]);
    bus.here(false);
    await s.move('door', 0, { over: 0.9 });
    s.set('porch_light', 0);
    // in the kitchen: they come in from the hall and go to their places
    const k1 = s.person('k1'), k2 = s.person('k2'), k3 = s.person('k3');
    k1.here(true); k2.here(true); k3.here(true);
    await s.all(
      (async () => { await k3.walk([[23.2, 13.2], SEATS.k3.slice(0, 2)]); await k3.turn(SEATS.k3[2]); await k3.do('sit_down'); k3.do('seated', { loop: true }); })(),
      (async () => { await s.wait(0.7); await k1.walk([[23.2, 13.0], SEATS.k1.slice(0, 2)]); await k1.turn(SEATS.k1[2]); await k1.do('sit_down'); k1.do('seated', { loop: true }); })(),
      (async () => { await s.wait(1.5); await k2.walk([[23.2, 13.1], K2_STOVE.slice(0, 2)]); await k2.turn(K2_STOVE[2]); k2.do('warm_hands', { loop: true }); })(),
    );
    s.tell('in:inside');
    s.tell('beat:in');
  },
  // later, snow: Сарафанов comes back along the street and stops under his own window — strangers at his table;
  // he stands; goes to the porch and opens the door
  async return(s, ready) {
    open(s, ready, FROM.return);
    const sar = s.person('sarafanov');
    await sar.walk([[17.5, 8.0], [20.2, 8.9], [20.2, 9.9], SPOT.under]);
    await sar.turn(6);
    sar.look('kitchen#glow');
    s.tell('return:window');
    await s.wait(4);
    sar.look(null);
    await sar.walk([[20.2, 9.9], [20.4, 8.8], [24.0, 9.3], [DOOR.a, 9.9], [DOOR.a, 11.4]]);
    await sar.turn(0);
    await s.move('door', 1, { over: 1.1, ease: 'out' });
    s.tell('return:door');
    s.tell('beat:return');
  },
};
// the beats a game plays after another, and those it cuts to (the film's table, scenes.md)
const AFTER = { knock_ready: 'walk', porch: 'neighbor', shut: 'porch', in: 'porch' };

// the knock of «Окна» (the game's key `knock`): N — to window N, knock; 0 — back to Сильва
async function knock(s, n) {
  const bus = s.person('busygin');
  if (!n) {
    bus.look(null);
    await bus.walk([SPOT.windows.busygin]);
    await bus.turn(0);
    return;
  }
  const to = knockSpot(n);
  bus.look(null);
  await bus.walk([[to[0], 6.8], to]);
  await bus.turn(0);
  bus.look(`win${n}`);
  const k = bus.do('knock');
  await s.wait(0.6);
  s.tell('knock:hit');
  await k;
  s.tell('knock:done');
}

// a pane's lit layer, its figure and its glow by its keys (`<id>_lit`, `<id>_who`: the script's, smooth); a pane
// with no keys stays dark
function paneLive(e) {
  const lit = e.state[`${e.id}_lit`] ?? 0, who = e.state[`${e.id}_who`] ?? 0;
  e.layer('lit').alpha = lit;
  e.layer('figure').alpha = who * lit;
  e.glow('pane', lit);
}

// hour → the late look's weight
const lateOf = hour => span(hour, 0.9, 0.96);

return { HOUSES, PLINTH, WALL_H, RISE, winOf, KITCHEN_WIN, DOOR, MAK_DOOR, KITCHEN, TABLE, LAMP, STOVE, PORCH, SAR_FENCE, GATE_LAMP,
  SIDE_FENCE, STREET_LAMP, SHED, BARREL, BENCH, WOODPILE, SPOT, SEATS, K2_STOVE, CAM, FROM, END, AFTER, film, knock, knockSpot, paneLive, lateOf, span, clamp };
