// “The Crossing”: the track's way, the freight train along it, the people's marks, the film's beats.
// Shared by the paintings (the ground draws the track by it), the script (the cars' places) and the showcase.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const span = (v, a, b) => clamp((v - a) / (b - a), 0, 1);

// The track, from deep in the forest (far right) to past the left edge, near: [across, distance], metres.
// It comes out of the forest, curves toward the crossing and runs aslant before the people, right to left.
const CONTROL = [
  [178, 430], [140, 360], [112, 290], [80, 205], [52, 128], [30, 66], [17, 30], [9, 17.2],
  [0, 12.1], [-12, 7.9], [-28, 2.6], [-50, -4.6], [-90, -17.6],
];

// Catmull-Rom through the controls, sampled every ~1 m; s — metres along from the far end
function sample() {
  const pts = [];
  for (let i = 0; i < CONTROL.length - 1; i++) {
    const p0 = CONTROL[Math.max(0, i - 1)], p1 = CONTROL[i], p2 = CONTROL[i + 1], p3 = CONTROL[Math.min(CONTROL.length - 1, i + 2)];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const n = Math.max(2, Math.ceil(len));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
      pts.push([f(0), f(1)]);
    }
  }
  pts.push(CONTROL[CONTROL.length - 1].slice());
  const S = [0];
  for (let i = 1; i < pts.length; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, S, length: S[S.length - 1] };
}
const PATH = sample();

// where the track is s metres along (beyond its ends: on along its end's direction), and which way it runs there
// (the way the train goes: toward the near end)
function at(s) {
  const { pts, S, length } = PATH;
  let i;
  if (s <= 0) i = 0;
  else if (s >= length) i = pts.length - 2;
  else {
    let lo = 0, hi = S.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m] <= s) lo = m; else hi = m; }
    i = lo;
  }
  const a = pts[i], b = pts[i + 1], seg = S[i + 1] - S[i] || 1, u = (s - S[i]) / seg;
  const da = (b[0] - a[0]) / seg, dd = (b[1] - a[1]) / seg;
  return { a: a[0] + (b[0] - a[0]) * u, d: a[1] + (b[1] - a[1]) * u, da, dd };
}
// the nearest s to a point (for the marks below; the generator's and the script's)
function sOf(a, d) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < PATH.pts.length; i++) {
    const q = PATH.pts[i], k = (q[0] - a) ** 2 + (q[1] - d) ** 2;
    if (k < bd) { bd = k; best = PATH.S[i]; }
  }
  return best;
}
// a card along the track at s: its face toward the near side, its painting's +x toward the train's tail
const facingAt = s => { const p = at(s); return (Math.atan2(-p.dd, p.da) * 180) / Math.PI; };

// The road: from the lower left to the crossing and on to the village.
const ROAD = [[-6.5, -4], [-4.6, 0], [-2.4, 4.4], [-0.9, 8.2], [0, 11], [1.2, 22], [2.4, 60], [-14, 160], [-60, 300]];
const ROAD_W = 4.6;
// where the road crosses the track
const S_CROSS = sOf(-0.1, 11.6);
// where the headlight stands, far on the curve (≈ 200 m)
const S_LIGHT = (() => { for (let s = 0; s < PATH.length; s += 0.5) if (at(s).d < 200) return s; return 0; })();
// where the train waits unseen, its nose just inside the forest
const S_HIDDEN = (() => { for (let s = 0; s < PATH.length; s += 0.5) if (at(s).d < 392) return s; return 0; })();

// The freight: a diesel and its cars, nose first. len — metres buffer to buffer.
const TRAIN = [
  { id: 'freight', kind: 'loco', len: 18 },
  { id: 'car1', kind: 'tank', len: 12.2 }, { id: 'car2', kind: 'tank', len: 12.2 }, { id: 'car3', kind: 'box', len: 14.7 },
  { id: 'car4', kind: 'box', len: 14.7 }, { id: 'car5', kind: 'gondola', len: 13.9 }, { id: 'car6', kind: 'gondola', len: 13.9 },
  { id: 'car7', kind: 'flat', len: 14.6 }, { id: 'car8', kind: 'tank', len: 12.2 }, { id: 'car9', kind: 'box', len: 14.7 },
  { id: 'car10', kind: 'gondola', len: 13.9 }, { id: 'car11', kind: 'tank', len: 12.2 }, { id: 'car12', kind: 'tank', len: 12.2 },
  { id: 'car13', kind: 'box', len: 14.7 }, { id: 'car14', kind: 'flat', len: 14.6 }, { id: 'car15', kind: 'box', len: 14.7 },
];
const GAP = 0.9;
const OFFSETS = (() => { let o = 0; return TRAIN.map(c => { const mid = o + c.len / 2; o += c.len + GAP; return mid; }); })();
const TRAIN_LEN = OFFSETS[OFFSETS.length - 1] + TRAIN[TRAIN.length - 1].len / 2;

// `freight` (the game's 0…1) → the nose's s: 0 hidden in the forest; 0.04 the headlight far on the curve, standing;
// 0.1 the nose at the crossing (the cars before the people from here); 0.9 the tail at the crossing; 1 gone left
const KNOTS = [[0, S_HIDDEN], [0.04, S_LIGHT], [0.1, S_CROSS], [0.9, S_CROSS + TRAIN_LEN], [1, S_CROSS + TRAIN_LEN + 34]];
function noseOf(f) {
  f = clamp(f, 0, 1);
  for (let i = 1; i < KNOTS.length; i++) {
    const [f0, s0] = KNOTS[i - 1], [f1, s1] = KNOTS[i];
    if (f <= f1) return s0 + (s1 - s0) * span(f, f0, f1);
  }
  return KNOTS[KNOTS.length - 1][1];
}
// every car's place for a `freight`: [{id, a, d, f}]
function places(f) {
  const nose = noseOf(f);
  return TRAIN.map((c, i) => {
    const s = nose - OFFSETS[i], p = at(s);
    return { id: c.id, a: p.a, d: p.d, f: facingAt(s) };
  });
}
const SPEED = 27; // m/s (≈ 100 km/h), as it goes by

// The people's marks: they stand at the barrier turned to the right and a little toward us — the booth's window and the
// signal's red lights on their faces, the headlight far on the curve ahead of them
const SPOT = { nina: [-1.85, 5.1], busygin: [-1.05, 4.85] };
const TURN = { nina: 125, busygin: 135 };
const BEYOND = { nina: [0.5, 12.9], busygin: [-0.35, 12.5] };
// the camera is still (`picture`): the shots are its dolly along the view and aside — wide, medium, close on Nina
const CAM = {
  wide: { camera_x: 0, camera_z: 0 },
  med: { camera_x: -0.55, camera_z: 1.9 },
  close: { camera_x: -1.4, camera_z: 3.15 },
};
const CAMKEYS = ['camera_x', 'camera_z'];
const camTo = (s, cam, over, ease = 'inOut') => { for (const k of CAMKEYS) s.move(k, cam[k], { over, ease }); };

const AT = (id, p, turn, extra = {}) => ({ [`${id}_a`]: p[0], [`${id}_d`]: p[1], [`${id}_turn`]: turn, [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_mood`]: null, ...extra });
// the end of `wait` — what a beat after it starts from when the scene is opened on it
const WAIT_END = () => ({
  ...CAM.med, ...AT('nina', SPOT.nina, 98, { nina_look: 'busygin', nina_mood: 'thinking' }), ...AT('busygin', SPOT.busygin, TURN.busygin, { busygin_look: 'nina', busygin_mood: 'afraid' }),
  barrier: 1, bell: 1, freight: 0.04, hour: 0.82,
});
const WAIT_FROM = () => ({
  ...CAM.wide, ...AT('nina', [-3.7, -1.4], 20), ...AT('busygin', [-2.8, -2.0], 20), barrier: 0, bell: 0, freight: 0, hour: 0.78,
});

// ── the film: film() → { <name>: { from, after, run } } (modules/beats.md) ──
async function freightTo(s, to, ease) {
  const from = s.get('freight');
  const metres = Math.abs(noseOf(to) - noseOf(from));
  const over = Math.max(0.4, (metres / SPEED) * (ease === 'in' ? 1.3 : 1));
  await s.move('freight', to, { over, ease: ease || 'linear' });
}
// the train from the far curve until its tail has gone and the barrier is up; `loud` — called as the cars are before them
async function passing(s, loud) {
  await freightTo(s, 0.1, 'in');
  await freightTo(s, 0.24);
  const during = loud ? loud() : null;
  await freightTo(s, 0.9);
  await freightTo(s, 1);
  if (during) await during;
  s.set('bell', 0);
  await s.move('barrier', 0, { over: 3.2, ease: 'inOut' });
}

function film() {
  return {
    // dusk going to night; they come up the road, the bell, the lights, the barrier down; they stop, turn to the light
    // (the medium shot, their faces in the red of the signal and the booth's window); the headlight far off; Nina turns to
    // him
    wait: {
      from: WAIT_FROM,
      async run(s) {
        const nina = s.person('nina'), bus = s.person('busygin');
        s.move('hour', 0.82, { over: 20, ease: 'linear' });
        const walks = Promise.all([
          nina.walk([[-2.75, 2.6], SPOT.nina]),
          (async () => { await s.wait(0.5); await bus.walk([[-1.85, 2.3], SPOT.busygin]); })(),
        ]);
        await s.wait(1.5);
        s.set('bell', 1);
        await s.wait(0.8);
        s.move('barrier', 1, { over: 4.5, ease: 'inOut' });
        await walks;
        nina.mood('thinking');
        bus.mood('afraid');
        camTo(s, CAM.med, 4);
        await Promise.all([nina.turn(TURN.nina), bus.turn(TURN.busygin)]);
        nina.look('freight#light');
        await freightTo(s, 0.04, 'out');
        s.tell('wait:light');
        await s.wait(1.5);
        bus.look('nina');
        await s.wait(1.5);
        nina.look('busygin');
        await nina.turn(98);
        await s.wait(1.5);
      },
    },
    // he turns to her and says it; she turns away to the cars; after, she turns to him (nearer, her face) and goes over first
    truth: {
      after: 'wait',
      from: WAIT_END,
      async run(s) {
        const nina = s.person('nina'), bus = s.person('busygin');
        bus.look('nina');
        await bus.turn(235);
        s.tell('truth:said');
        const train = passing(s, async () => {
          nina.mood('neutral');
          await nina.turn(8);
          nina.look([-6, 9.5, 2.2]);
        });
        await s.wait(3);
        bus.look('nina#head');
        await train;
        s.tell('truth:passed');
        nina.mood('sad');
        camTo(s, CAM.close, 3.5);
        await nina.turn(98);
        nina.look('busygin');
        await s.wait(3.2);
        camTo(s, CAM.wide, 2.5);
        nina.look(null);
        const goes = nina.walk([[-1.1, 8.8], BEYOND.nina]);
        await s.wait(1.4);
        bus.look(null);
        await Promise.all([goes, bus.walk([[-1.2, 8.6], BEYOND.busygin])]);
      },
    },
    // under the roar: he turns and says it; she steps in to hear (leans to him); he says it again otherwise; she nods; over
    // side by side
    roar: {
      after: 'wait',
      from: WAIT_END,
      async run(s) {
        const nina = s.person('nina'), bus = s.person('busygin');
        bus.look('freight');
        await passing(s, async () => {
          s.tell('roar:loud');
          bus.look('nina');
          await bus.turn(235);
          await s.wait(2.2);
          nina.mood('surprised');
          bus.mood('sad');
          nina.look('busygin');
          await nina.turn(98);
          await nina.walk([[-1.62, 5.5]]);
          await nina.do('lean');
          await s.wait(2.6);
          nina.do('stand');
          nina.look([-1.2, 6.8, 0]);
          await s.wait(0.6);
          nina.look('busygin');
          await s.wait(0.8);
          nina.look([-3, 10, 2]);
        });
        s.tell('roar:passed');
        nina.look(null);
        bus.look(null);
        await Promise.all([nina.walk([[-1.2, 8.8], BEYOND.nina]), bus.walk([[-0.6, 8.6], BEYOND.busygin])]);
      },
    },
    // “Brother.” — she takes his hand (their backs to us: both to the cars); the train goes by; they turn to us hand in hand
    // (their faces), over the tracks together
    brother: {
      after: 'wait',
      from: WAIT_END,
      async run(s) {
        const nina = s.person('nina'), bus = s.person('busygin');
        bus.look('nina');
        await bus.turn(235);
        await s.wait(2.4);
        nina.look('busygin');
        await nina.turn(98);
        nina.mood('neutral');
        await s.wait(0.6);
        await Promise.all([nina.turn(8), bus.turn(352)]);
        nina.reach({ r: 'busygin#hand_l' });
        bus.reach({ l: 'nina#hand_r' });
        await s.wait(0.8);
        s.tell('brother:arm');
        nina.look('freight');
        bus.look('freight');
        await passing(s, null);
        s.tell('brother:passed');
        nina.mood('smile');
        bus.mood('tired');
        nina.look('busygin');
        bus.look('nina');
        nina.reach(null);
        bus.reach(null);
        await Promise.all([nina.turn(165), bus.turn(195)]);
        nina.reach({ l: 'busygin#hand_r' });
        bus.reach({ r: 'nina#hand_l' });
        await s.wait(2.6);
        nina.look(null);
        bus.look(null);
        await Promise.all([nina.walk([[-1.5, 8.8], [0.2, 12.7]]), bus.walk([[-0.7, 8.7], [0.75, 12.6]])]);
      },
    },
  };
}

// hour → the night look's weight
const nightOf = hour => span(hour, 0.74, 0.88);

return { PATH, CONTROL, ROAD, ROAD_W, at, sOf, facingAt, TRAIN, places, noseOf, S_CROSS, S_LIGHT, SPOT, TURN, CAM, WAIT_END, WAIT_FROM, film, nightOf, span, clamp };
