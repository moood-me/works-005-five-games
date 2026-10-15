// Будка — what the paintings and the script share: the booth in metres (scenes.md «Будка», 4th edition), the shots,
// the paintings' helpers and the film in beats (FILM: modules/beats.js plays it).
// Metres: x — across, left to right standing facing the ports into the hall; z — from the wall opposite the ports
// (z 0) toward them (z 3.5). The start (camera 0, 0) stands at the opposite wall looking at the ports; the shots move
// the camera (camera_x, camera_z, camera_h from the eye's 1.7 m, camera_yaw right of the ports' way).
const hash = (n, s) => anim.hash(n, s);

const G = {
  W: 2.0, N: 3.5, CEIL: 2.6,                           // walls x ±2, the opposite wall z 0, the ports' wall z 3.5
  P1: [-0.75, 3.0], P2: [0.75, 3.0],                   // the projectors' middles (body z 2.6…3.4, x ±0.25 about them)
  BODY: [0.25, 0.4, 0.9, 1.7],                         // half width, half length, bottom, top of a projector's body
  LENS_H: 1.5, PORT_H: 1.5, PORT_W: 0.3, PORT_HH: 0.22, // the lens's and the ports' height; a port's size
  LOOK: [0, 1.4, 1.7, 0.45],                           // the look port: x, bottom, top, width
  CLOCK_H: 2.1,
  CRATE: [-0.75, 2.2], CRATE_H: 0.4,                   // the boy's crate behind projector 1
  TOTO_IV: [-1.3, 2.8],                                // Toto's place at projector 1 in chapter IV
  STOOL: [0.9, 1.4], STOOL_H: 0.5,                     // the operator's stool
  BENCH: [1.5, 2.0, 1.4, 2.4], BENCH_H: 0.85,          // the bench along the right wall: x 1.5…2, z 1.4…2.4
  LAMP: [1.72, 1.9, 1.62],                             // the lamp's bulb over the bench
  WINDOW: [1.2, 1.8, 1.0, 1.7],                        // the window on the square, left wall: z 1.2…1.8, 1.0…1.7 m up
  DOOR: [0.1, 1.0], DOOR_H: 2.0,                       // the door in the right wall: z 0.1 (hinge) … 1.0
  CAL: [1.4, 1.5],                                     // the calendar on the opposite wall: x, height (behind the leaf)
  SLATE: [1.2, 1.6],                                   // the slate on its nail, right wall: z, height (1988)
  PATH0: [-0.6, 2.3], PATH1: [0.6, 1.4],               // «Вытащить»: where Alfredo fell → the door
  SCREEN: [0, 23.3, 0.4, 4.4, 3.3],                    // the hall's screen far beyond the ports: x, z, middle height, w, h
};
const R = Math.PI / 180;

// ── the shots (scenes.md «Будка», «Кадры»): place x, z, the eye's height, yaw, pitch ──
const cam = (x, z, eye, yaw, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_x: x, camera_z: z, camera_h: eye - 1.7,
  camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  PORTS: cam(0, 0.4, 1.5, 0),          // at the door wall's end, on both projectors: the look port 3.1 m ahead, the four handles
  OPER: cam(1.6, 0.5, 1.5, -40),       // the boy on the crate at projector 1, Alfredo behind; projector#motor on the axis
  BENCH: cam(-1.8, 0.3, 1.5, 62),      // the bench under the lamp; the door right (24°)
  BENCH2: cam(-1.8, 0.3, 1.5, 74),     // the same place, a little right: the stool and the box by the bench (the lesson of letters)
  DOOR: cam(-1.8, 1.2, 1.5, 98),       // from the window's corner across the room: the stool −12°, the door +2°, the calendar +13°
  CLOSE: cam(0.2, 2.6, 1.2, 140),      // close by the stool: the seated man to the chest, the door behind him
  SQUARE: cam(1.6, 0.6, 1.5, -60),     // the window on the square and projector 1
  FLOOR: cam(1.5, 0.3, 1.2, -40, -19), // low by the door, along the way from projector 1 to the door, looking down
  CAL: cam(1.25, 0.95, 1.55, 172),     // close at the calendar on the opposite wall
};

// ── light by the hour and the era (looks' weights) ──
const tone = (hour = 0.9, era = 'past') => {
  const h = ((hour % 1) + 1) % 1;
  return { night_k: era !== 'ruin' && (h >= 0.84 || h < 0.22) ? 1 : 0, dawn_k: h >= 0.22 && h < 0.5 ? 1 : 0,
    eve_k: era !== 'ruin' && h >= 0.5 && h < 0.84 ? 1 : 0, ruin_k: era === 'ruin' ? 1 : 0 };
};

// ── paintings ──
// plaster with stains over a w×h rectangle at (x, y), clipped to it; ruin — peeling, damp
function plaster(g, x, y, w, h, base, seed, ruin) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = base; g.fillRect(x, y, w, h);
  for (let i = 0; i < w * h * 3; i++) {
    const px = x + hash(i, seed) * w, py = y + hash(i, seed + 1) * h, r = 0.08 + hash(i, seed + 2) * 0.35;
    g.fillStyle = i % 3 ? 'rgba(60,46,36,0.04)' : 'rgba(255,236,210,0.03)';
    g.beginPath(); g.ellipse(px, py, r, r * 0.7, hash(i, seed + 3) * 3, 0, Math.PI * 2); g.fill();
  }
  if (ruin) {
    for (let i = 0; i < w * h * 1.2; i++) {
      const px = x + hash(i, seed + 7) * w, py = y + hash(i, seed + 8) * h, r = 0.05 + hash(i, seed + 9) * 0.22;
      g.fillStyle = i % 2 ? 'rgba(150,140,128,0.5)' : 'rgba(40,36,32,0.35)';
      g.beginPath(); g.ellipse(px, py, r, r * 0.6, hash(i, seed + 10) * 3, 0, Math.PI * 2); g.fill();
    }
    const dmp = g.createLinearGradient(0, y + h - 0.6, 0, y + h);
    dmp.addColorStop(0, 'rgba(40,46,40,0)'); dmp.addColorStop(1, 'rgba(40,46,40,0.4)');
    g.fillStyle = dmp; g.fillRect(x, y + h - 0.6, w, 0.6);
  }
  g.restore();
}
// film cans stacked on a shelf (a w-wide shelf at y)
function cans(g, x0, y, w, seed, ruin) {
  g.fillStyle = '#4a3726'; g.fillRect(x0, y, w, 0.03);
  let x = x0 + 0.04;
  while (x < x0 + w - 0.3) {
    const n = ruin ? Math.floor(hash(x * 10, seed) * 2) : 1 + Math.floor(hash(x * 10, seed) * 4);
    for (let k = 0; k < n; k++) { g.fillStyle = ruin ? '#6a5a4a' : k % 2 ? '#5a5a5e' : '#6a6964'; g.fillRect(x, y - 0.035 * (k + 1), 0.3, 0.03); }
    x += 0.34;
  }
}
// The projector's body as a form, unrolled (the element's box [−1.3, −0.8, 1.3, 0]: its perimeter by its height):
// the back (px −1.3…−0.8, the lamp house's vents, the lever), the right side (−0.8…0), the front (0…0.5, the lens's
// plate), the left side (0.5…1.3). inner — which side faces the room's middle (projector 1: right; 2: left): there the
// mechanism, the gate's window and the motor's crank boss. The form: e.form(projBody) — a box W × D × 0.8.
const BOX = [-1.3, -0.8, 1.3, 0];
function projBodyForm(u, v) {
  const W = 0.5, D = 0.8, s = u * 2 * (W + D), Y = 0.8 * (1 - v);
  if (s < W) return [-W / 2 + s, Y, D / 2];
  if (s < W + D) return [W / 2, Y, D / 2 - (s - W)];
  if (s < 2 * W + D) return [W / 2 - (s - W - D), Y, -D / 2];
  return [-W / 2, Y, -D / 2 + (s - 2 * W - D)];
}
// where a side's local point (a — metres from the back along the side; y — height over the body's bottom) is in the
// painting; side 'back' (a: across from left to right seen from behind), 'right', 'front', 'left'
function onBody(side, a, y) {
  const x0 = { back: -1.3, right: -0.8, front: 0, left: 0.5 }[side];
  // the right side runs back → front, the left side front → back (as the unrolled box goes round)
  const along = side === 'left' ? 0.8 - a : a;
  return [x0 + along, -y];
}
function projBody(g, e, inner, ruin) {
  const iron = ruin ? '#5a4436' : '#3c3b40', dark = ruin ? '#3a2c24' : '#2b2a2e', edge = ruin ? '#7a5038' : '#4c4b52';
  g.fillStyle = iron; g.fillRect(-1.3, -0.8, 2.6, 0.8);
  // the seams of the box's edges
  g.fillStyle = edge; for (const x of [-1.3, -0.8, 0, 0.5]) g.fillRect(x, -0.8, 0.012, 0.8);
  g.fillStyle = dark; g.fillRect(-1.3, -0.8, 2.6, 0.03); g.fillRect(-1.3, -0.03, 2.6, 0.03);
  // the back: the lamp house's vents (their glow is the vents' own element) and the lever, middle, 0.1 m up
  for (let k = 0; k < 4; k++) { g.fillStyle = '#18171a'; g.fillRect(-1.2, -0.72 + k * 0.08, 0.3, 0.035); }
  g.fillStyle = '#2a1e18'; g.fillRect(-1.08, -0.22, 0.06, 0.16);
  const lever = (x, y) => {
    g.fillStyle = ruin ? '#6a3a26' : '#8a3a28'; g.fillRect(x - 0.012, y - 0.16, 0.024, 0.16);
    g.fillStyle = ruin ? '#8a7a68' : '#d0c8b4'; g.beginPath(); g.arc(x, y - 0.17, 0.028, 0, Math.PI * 2); g.fill();
  };
  lever(-1.05, -0.04);
  // a side: the mechanism's plate, the gate's window near the front, the drive's gears; inner — the crank's boss
  const side = (name, isInner) => {
    const [mx] = onBody(name, 0.4, 0), sgn = name === 'left' ? -1 : 1;
    g.fillStyle = edge; g.fillRect(mx - 0.36, -0.74, 0.72, 0.5);
    const [gx] = onBody(name, 0.68, 0);
    g.fillStyle = '#121214'; g.fillRect(gx - 0.05, -0.66, 0.1, 0.12);           // the gate's window
    g.fillStyle = ruin ? '#4a3a30' : '#d8c8a0'; g.fillRect(gx - 0.035, -0.64, 0.07, 0.08);
    for (const [a, r] of [[0.25, 0.08], [0.45, 0.06]]) {
      const [cx] = onBody(name, a, 0);
      g.fillStyle = dark; g.beginPath(); g.arc(cx, -0.45, r, 0, Math.PI * 2); g.fill();
      g.fillStyle = edge; g.beginPath(); g.arc(cx, -0.45, r * 0.35, 0, Math.PI * 2); g.fill();
    }
    if (isInner) {                                                              // the motor's crank boss, 0.2 m up, middle
      g.fillStyle = ruin ? '#5a3a24' : '#6a5032'; g.beginPath(); g.arc(mx, -0.2, 0.045, 0, Math.PI * 2); g.fill();
    }
    g.save(); g.scale(0.01, 0.01); g.font = '600 4px serif'; g.fillStyle = ruin ? '#7a6a5a' : '#a49a84'; g.textAlign = 'center';
    g.fillText('CINEMECCANICA', (mx + sgn * 0) * 100, -12); g.restore();
  };
  side('right', inner === 'right'); side('left', inner === 'left');
  // the front: the plate round the lens
  g.fillStyle = dark; g.fillRect(0.12, -0.72, 0.26, 0.2);
  if (ruin) for (let i = 0; i < 90; i++) {                                    // rust bloom
    g.fillStyle = `rgba(${120 + hash(i, 5) * 40},${60 + hash(i, 6) * 20},30,0.35)`;
    g.beginPath(); g.arc(-1.3 + hash(i, 7) * 2.6, -0.8 + hash(i, 8) * 0.8, 0.01 + hash(i, 9) * 0.05, 0, Math.PI * 2); g.fill();
  }
  // its points, on the form: the lever (back, middle, 1.0 m up), the motor (the inner side's middle, 1.1 m up), the
  // gate (near the front, 1.45 m), the lens (the front's middle, 1.5 m), the body's outer side (a hand laid on it)
  e.at(...onBody('back', 0.25, 0.1), 'lever');
  e.at(...onBody(inner, 0.4, 0.2), 'motor');
  e.at(...onBody(inner, 0.7, 0.55), 'gate');
  e.at(0.25, -0.6, 'lens');
  e.at(...onBody(inner === 'right' ? 'left' : 'right', 0.35, 0.45), 'side');
  e.at(...onBody('back', 0.25, 0.5));
}
// the projector seen side-on in the plane through its middle (x toward the lens, the floor y 0): what stands outside
// the body — the reels' arms, the feed reel above, the take-up below, the chimney, the lens barrel. The reels are
// layers (kino.projectorReels) unless ruin (no reels then).
function projProfile(g, e, ruin) {
  const k = e.kit.kino, iron = ruin ? '#4e3a2e' : '#2e2d31';
  g.strokeStyle = iron; g.lineWidth = 0.03;
  g.beginPath(); g.moveTo(0.05, -1.7); g.lineTo(0.08, -1.92); g.moveTo(0.02, -0.9); g.lineTo(0.0, -0.78); g.stroke();
  g.fillStyle = iron; g.fillRect(-0.36, -1.98, 0.16, 0.3);                    // the lamp house's chimney
  g.fillStyle = ruin ? '#3a2a22' : '#1b1b1e'; g.fillRect(0.38, -1.56, 0.12, 0.12);   // the lens barrel
  g.fillStyle = ruin ? '#4a3a32' : '#8f8c84'; g.fillRect(0.49, -1.55, 0.02, 0.1);
  if (!ruin) {
    e.layer('rt', { pivot: [0.08, -2.2] }, r => k.reel(r, 0.08, -2.2, 0.28));
    e.layer('rl', { pivot: [0.0, -0.58] }, r => k.reel(r, 0.0, -0.58, 0.2));
  }
}

// ── the people's places ──
const P = {
  ALF_BENCH: [1.2, 1.9], BOY_BENCH: [0.95, 2.4], ALF_P2: [0.35, 2.75], BOY_TIN: [1.35, 2.3],
  DOORWAY: [2.05, 0.55], IN_DOOR: [1.72, 0.6], LANDING: [2.6, 0.5], AWAY: [2.7, -0.2],
  BOX_DEAL: [0.5, 1.8], BOX_FAR: [1.45, 0.75],
  ALF_BEHIND: [-1.1, 1.8], ALF_CRANK: [-0.05, 2.9], BOY_LEVER: [0.45, 2.25], ALF_LEVER: [1.0, 2.2],
  ALF_WINDOW: [-1.6, 1.45], ALF_PUSH: [-1.1, 2.45], BOY_JAM: [0.3, 1.6],
  TOTO_BENCH: [1.62, 1.75], TOTO_REEL: [1.25, 1.95], TOTO_HUG: [1.42, 0.78], EL_HUG: [1.76, 0.62],
  TOTO_STAND: [0.4, 0.95], EL_CAL: [1.4, 0.42], EL_PENCIL: [1.38, 1.5], ALF_CAL: [1.25, 0.55],
  TOTO_IN: [1.8, 0.6], SAL_P2: [1.25, 2.45], SAL_DOOR: [1.55, 0.7], SAL_WINDOW: [-1.72, 0.95],
};
const SEAT = [G.STOOL[0], G.STOOL[1], G.STOOL_H];
const BENCH_SEAT = [P.TOTO_BENCH[0], P.TOTO_BENCH[1], G.BENCH_H];
const ALONG = (u) => [G.PATH0[0] + (G.PATH1[0] - G.PATH0[0]) * u, G.PATH0[1] + (G.PATH1[1] - G.PATH0[1]) * u];
// «Вытащить»: where the boy (ahead of Alfredo's shoulders, toward the door) and Alfredo (his hips behind them) are at u
const UNIT = (() => { const dx = G.PATH1[0] - G.PATH0[0], dz = G.PATH1[1] - G.PATH0[1], l = Math.hypot(dx, dz); return [dx / l, dz / l]; })();
const AHEAD = u => { const p = ALONG(u); return [p[0] + UNIT[0] * 0.32, p[1] + UNIT[1] * 0.32]; };
const BEHIND = u => { const p = ALONG(u); return [p[0] - UNIT[0] * 0.55, p[1] - UNIT[1] * 0.55]; };
const PATH_TURN = Math.atan2(G.PATH0[0] - G.PATH1[0], G.PATH0[1] - G.PATH1[1]) / R; // facing back toward where he fell

// ── the keys a beat starts from ──
const IDS = ['alfredo', 'toto', 'elena'];
const CH = () => kit.cast.characters;
const MOOD = { alfredo: 'neutral', toto: 'neutral', elena: 'neutral' };
const base = (hour, more = {}) => ({
  era: 'past', hour, ...tone(hour, more.era), lamp: 1, door: 0, stair: 0, beam_on: 0, active: 1, motor1: 0, motor2: 0,
  crank: 0, jitter: 0, clock: 6, month: 'none', tin_open: 0, tin_at: 'bench', clips: 0, written: 0, turned: 0,
  fire: 0, smoke: 0, tail: 0, white: 0, cue: 0, rain_window: 0, box_a: P.BOX_FAR[0], box_d: P.BOX_FAR[1],
  splice: 0, slate: 0, thread: 0, calendar: 0, strip: 0, pigeons: 0, hanging: 0, ...more,
});
const show = active => ({ beam_on: 1, active, motor1: active === 1 ? 1 : 0, motor2: active === 2 ? 1 : 0 });
// who is where: {id: {at: [x, z], turn, do, look, reach, wear (a look's name), with, on, mood, gait, steps}} — the rest not here
function people(who) {
  const o = {};
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_gait'] = p.gait ?? null;
    o[id + '_wear'] = p.wear ? CH()[p.wear] : null; o[id + '_with'] = p.with ?? null; o[id + '_on'] = p.on ?? null;
    o[id + '_steps'] = p.steps ?? true; o[id + '_mood'] = p.mood ?? MOOD[id];
  }
  return o;
}
const SIT = { motion: 'seated', loop: true }, WORK = { motion: 'bench_work', loop: true }, CANE = { motion: 'cane_sit', loop: true };
const blind = more => ({ at: G.STOOL, on: SEAT, turn: 250, do: CANE, wear: 'alfredo_blind', ...more });
const teen = more => ({ wear: 'toto_teen', ...more });

// ── the film ──
// (inside a beat: s.* — its actions are the beat's own)
const walk = (s, id, pts, o) => s.person(id).walk(pts, o);
// the film is the scene's: a beat's `from` reads the play's keys (alfredo_here)
function film(scene) {
const here = () => !!scene.get('alfredo_here');
const FILM = {
  // I.2 — Alfredo at the bench with a reel full of paper bookmarks; the door opens a crack — the boy; he comes in
  cutting: {
    from: () => ({ ...base(0.9), ...show(1), ...CAM.BENCH, ...people({
      alfredo: { at: P.ALF_BENCH, turn: 90, do: WORK, look: 'press#press' },
      toto: { at: P.LANDING, turn: 270, look: 'alfredo', mood: 'smile' } }), toto_here: false }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await s.wait(0.8);
      s.set('stair', 1); s.move('door', 0.4, { over: 0.9, ease: 'out' });
      s.set('toto_a', 2.2); s.set('toto_d', 0.85); boy.here(true);
      await s.wait(1.2); s.tell('cutting:door');
      alf.look('toto'); alf.do('stand'); await alf.turn(230);
      await s.wait(1.6);
      s.move('door', 1, { over: 0.8 });
      await walk(s, 'toto', [[1.55, 0.95], [0.8, 1.55], [0.75, 2.2], P.BOY_BENCH]);
      await boy.turn(225); boy.look('alfredo'); boy.mood('smile');
      s.tell('cutting:bench');
      s.move('door', 0, { over: 1.5 }); s.move('stair', 0, { over: 1.5 });
      await s.wait(2.4);
      alf.look('press#press'); await alf.turn(90); alf.do(WORK);
      await s.wait(1.0);
    },
  },
  // the splice insert opens (under «Склейка»)
  splice_in: {
    after: 'cutting',
    run: async s => { await s.move('splice', 1, { over: 0.8 }); s.tell('splice_in:close'); await s.wait(0.6); },
  },
  // the insert closed: the clippings on the bench, into the tin; then Alfredo turns his back — the choice
  frames: {
    from: () => ({ ...base(0.9), ...show(1), clips: 1, ...CAM.BENCH, ...people({
      alfredo: { at: P.ALF_BENCH, turn: 250, look: 'toto', mood: 'smile' },
      toto: { at: P.BOY_BENCH, turn: 215, look: 'tin', mood: 'surprised' } }) }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      s.move('tin_open', 1, { over: 0.8 });
      alf.look('tin'); alf.reach({ r: 'tin' });
      await s.wait(2); s.tell('frames:tin');
      boy.look('alfredo');
      await s.wait(1.2); alf.reach(null); alf.look('toto');
      await s.wait(2.2);
      s.set('clips', 0);
      alf.look(null); alf.mood('neutral');
      await walk(s, 'alfredo', [[0.75, 2.2], P.ALF_P2]);
      await alf.turn(40); alf.look('projector2#gate');
      boy.look('tin');
      await s.wait(1.0);
    },
  },
  tin_shut: {
    after: 'frames',
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await alf.turn(160);
      await walk(s, 'alfredo', [[0.8, 2.15], P.ALF_BENCH]); await alf.turn(90);
      boy.look('alfredo');
      alf.look('tin'); alf.reach({ r: 'tin' });
      await s.move('tin_open', 0, { over: 0.7 });
      s.set('tin_at', 'pocket'); alf.with(['tin_pocket']); alf.reach({ r: 'alfredo#pocket' });
      s.tell('tin_shut:pocket');
      await s.wait(0.9); alf.reach(null); alf.look('toto');
      await s.wait(1.2);
    },
  },
  pocket: {
    after: 'frames',
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await walk(s, 'toto', [P.BOY_TIN]); await boy.turn(120);
      boy.look('tin'); boy.reach({ r: 'tin' });
      await s.wait(0.9);
      boy.with(['frame_hand']); boy.reach({ r: 'toto#hips' }); boy.look('alfredo');
      await s.wait(0.8); s.tell('pocket:hidden'); boy.with(null);
      await s.wait(0.5); boy.reach(null); boy.mood('smile');
      await alf.turn(170);
      await walk(s, 'alfredo', [[0.8, 2.15], P.ALF_BENCH]); await alf.turn(90);
      alf.look('tin'); alf.reach({ r: 'tin' });
      await s.move('tin_open', 0, { over: 0.7 });
      s.set('tin_at', 'pocket'); alf.with(['tin_pocket']); alf.reach({ r: 'alfredo#pocket' });
      s.tell('pocket:tin');
      await s.wait(0.9); alf.reach(null);
      await s.wait(0.6);
    },
  },
  // I.4 — Alfredo on the stool with a primer, the boy on a box beside him; at the end the slate before him
  deal: {
    from: () => ({ ...base(0.9), ...show(1), box_a: P.BOX_DEAL[0], box_d: P.BOX_DEAL[1], ...CAM.BENCH2, ...people({
      alfredo: { at: G.STOOL, on: SEAT, turn: 285, do: SIT, with: ['primer'], look: 'toto', mood: 'tired' },
      toto: { at: P.BOX_DEAL, on: [P.BOX_DEAL[0], P.BOX_DEAL[1], 0.36], turn: 170, do: SIT, look: 'alfredo', mood: 'smile' } }) }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await s.wait(1); s.tell('deal:primer');
      await s.wait(6); alf.mood('neutral');
      await s.wait(4); alf.mood('smile');
      await s.wait(2.5);
      alf.with(['slate_held']); alf.look([G.BENCH[0] + 0.1, G.STOOL[1] + 0.2, 0.9]);
      await s.wait(2.5);
    },
  },
  slate_in: {
    after: 'deal',
    run: async s => { await s.move('slate', 1, { over: 0.8 }); s.tell('slate_in:close'); await s.wait(0.6); },
  },
  // the insert closed: Alfredo lifts the slate to the lamp in both hands
  slate_out: {
    from: () => ({ ...FILM.deal.from(), slate: 0, ...people({
      alfredo: { at: G.STOOL, on: SEAT, turn: 270, do: SIT, with: ['slate_held'], look: 'lamp', mood: 'laugh' },
      toto: { at: P.BOX_DEAL, on: [P.BOX_DEAL[0], P.BOX_DEAL[1], 0.36], turn: 170, do: SIT, look: 'alfredo', mood: 'smile' } }) }),
    run: async s => {
      const alf = s.person('alfredo');
      alf.do('lift_show');
      await s.wait(2); s.tell('slate_out:up');
      await s.wait(3.5);
    },
  },
  // II.1 — evening; the boy (nine) on the crate at projector 1, Alfredo behind, a hand on his shoulder; the thread
  // insert opens at the end
  lesson: {
    from: () => ({ ...base(0.78), ...CAM.OPER, ...people({
      toto: { at: G.CRATE, turn: 90, look: 'projector#gate', mood: 'thinking' },
      alfredo: { at: P.ALF_BEHIND, turn: 50, look: 'projector#gate', reach: { r: 'toto#shoulder_r' }, mood: 'smile' } }) }),
    run: async s => {
      const boy = s.person('toto');
      await s.wait(1); s.tell('lesson:crate');
      await s.wait(3); boy.look('alfredo');
      await s.wait(2.5); boy.look('projector#gate');
      await s.wait(2);
      await s.move('thread', 1, { over: 0.8 });
      await s.wait(0.4);
    },
  },
  // the insert closed: the motor, the beam leaps into the port (and trembles while `stutter`); the lever of 2
  motor: {
    from: () => ({ ...FILM.lesson.from(), thread: 0 }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      alf.reach(null);
      await walk(s, 'alfredo', [[-0.4, 2.3], P.ALF_CRANK]); await alf.turn(275);
      alf.look('projector#motor'); alf.reach({ r: 'projector#motor' });
      s.set('crank', 1); s.move('motor1', 1, { over: 1.2, ease: 'in' });
      await s.wait(1.4);
      s.set('crank', 0); s.move('beam_on', 1, { over: 0.25, ease: 'out' });
      s.tell('motor:beam');
      boy.look('look_port'); alf.look('look_port'); alf.reach(null); boy.mood('surprised');
      if (s.get('stutter')) {
        s.set('jitter', 1);
        await s.wait(1.6);
        alf.look('projector#gate'); alf.reach({ r: 'projector#gate' });
        await s.wait(0.5); s.set('jitter', 0);
        await s.wait(0.4); alf.reach(null); alf.look('look_port');
      } else await s.wait(1.2);
      await walk(s, 'toto', [[-0.3, 2.0], P.BOY_LEVER]); await boy.turn(120);
      boy.look('projector2#lever');
      await walk(s, 'alfredo', [[0.25, 2.55], P.ALF_LEVER]); await alf.turn(300);
      boy.reach({ l: 'projector2#lever' }); alf.reach({ r: 'projector2#lever' }); alf.look('toto');
      s.tell('motor:lever');
      await s.wait(4);
    },
  },
  // II.2 — Alfredo at the window looks down at the square; turns the projector to the window
  window: {
    from: () => ({ ...base(0.92), ...show(1), ...CAM.SQUARE, ...people({
      alfredo: { at: P.ALF_WINDOW, turn: 110, look: 'projector', mood: 'smile' },
      toto: { at: G.CRATE, turn: 250, look: 'alfredo', mood: 'surprised' } }) }),
    run: async s => {
      const alf = s.person('alfredo');
      await s.wait(1); s.tell('window:hands');
      await s.wait(1.6);
      await walk(s, 'alfredo', [P.ALF_PUSH]); await alf.turn(70);
      alf.look('projector'); alf.reach({ r: 'projector#side', l: 'projector#lever' }); alf.do('push_turn');
      await s.move('turned', 1, { over: 2.6 });
      alf.reach(null); alf.do('stand');
      await s.wait(1.2);
    },
  },
  // II.3 — the projector turned to the window; the boy goes down; fire in the gate; Alfredo falls
  jam: {
    from: () => ({ ...base(0.92), ...show(1), turned: 1, door: 1, stair: 1, ...CAM.SQUARE, ...people({
      alfredo: { at: P.ALF_PUSH, turn: 60, look: 'toto', mood: 'smile' },
      toto: { at: P.BOY_JAM, turn: 110, look: 'alfredo' } }) }),
    run: async s => {
      const alf = s.person('alfredo'), boy = s.person('toto');
      await s.wait(1.2);
      boy.gait('run');
      await walk(s, 'toto', [[1.4, 1.1], [2.2, 0.55], P.LANDING]); boy.here(false);
      s.move('door', 0, { over: 0.4, ease: 'in' });
      alf.look('projector#gate');
      s.move('fire', 0.4, { over: 0.3 }); s.tell('jam:flame');
      await s.wait(1.4);
      s.move('fire', 1, { over: 1.6 }); s.move('smoke', 0.6, { over: 4 });
      alf.reach({ r: 'projector#gate' }); alf.mood('afraid');
      await s.wait(1.0);
      alf.reach(null); await alf.do('fall_back');
      await s.wait(1.2);
    },
  },
  // the cut to the floor in smoke: Alfredo lying, the boy on his knees at his shoulders (under «Вытащить»)
  smoke_in: {
    from: () => ({ ...base(0.92), ...show(1), beam_on: 0.6, turned: 1, fire: 1, smoke: 1, door: 1, stair: 1, drag: 0, drag_at: 0, cough: 0, ...CAM.FLOOR, ...people({
      alfredo: { at: BEHIND(0), turn: (PATH_TURN + 180) % 360, do: { motion: 'lay_down', from: 99 }, steps: false, mood: 'tired' },
      toto: { at: AHEAD(0), turn: PATH_TURN, do: { motion: 'kneel_down', from: 99 }, reach: { r: 'alfredo#nape', l: 'alfredo#nape' }, mood: 'afraid' } }) }),
    run: async s => { await s.wait(3.5); },
  },
  // III.2 — Alfredo (blind) on the stool tells of the soldier; Toto (17) on the bench's edge
  story_booth: {
    from: () => ({ ...base(0.9), ...show(1), lamp: 0.9, ...CAM.DOOR, ...people({
      alfredo: blind({ turn: 290, look: null, mood: 'thinking' }),
      toto: teen({ at: P.TOTO_BENCH, on: BENCH_SEAT, turn: 255, do: SIT, look: 'alfredo' }) }) }),
    run: async s => {
      const alf = s.person('alfredo'), toto = s.person('toto');
      await s.wait(1); s.tell('story_booth:start');
      alf.look([1.25, 1.2, 1.3]); alf.do({ motion: 'tell_hand', loop: true });
      await s.wait(4); alf.look(null);
      await s.wait(5); s.tell('story_booth:99');
      await s.wait(6); toto.mood('surprised');
      await s.wait(1); s.tell('story_booth:why');
      alf.look([1.3, 1.3, 1.3]); alf.do(CANE);
      await s.wait(3); alf.mood('smile'); toto.mood('thinking');
      await s.wait(5);
    },
  },
  // III.4 — Toto changes reels at the bench (Alfredo on the stool if he is here); Elena in the door; the tail flaps
  reels: {
    from: () => ({ ...base(0.99), ...show(1), ...CAM.DOOR, ...people({
      toto: teen({ at: P.TOTO_REEL, turn: 80, do: WORK, look: 'press#press' }),
      elena: { at: P.LANDING, turn: 270, look: 'toto', mood: 'sad' },
      alfredo: here() ? blind({ turn: 300 }) : null }), elena_here: false }),
    run: async s => {
      const toto = s.person('toto'), el = s.person('elena');
      await s.wait(1.2);
      s.set('stair', 1); s.set('elena_a', P.DOORWAY[0]); s.set('elena_d', P.DOORWAY[1]); el.here(true);
      await s.move('door', 1, { over: 0.9, ease: 'out' });
      s.tell('reels:door');
      toto.do('stand'); toto.look('elena'); await toto.turn(150);
      await s.wait(1.6); el.mood('smile');
      await s.all(walk(s, 'toto', [P.TOTO_HUG]), walk(s, 'elena', [P.EL_HUG]));
      await s.all(toto.turn(110), el.turn(290));
      toto.reach({ r: 'elena#back', l: 'elena#nape' }); el.reach({ r: 'toto#nape', l: 'toto#back' }); el.mood('laugh');
      s.tell('reels:hug');
      await s.wait(3);
      s.set('tail', 1); s.tell('reels:tail');
      await s.wait(3);
    },
  },
  // IV.2 — six o'clock: Toto at his place by projector 1 turns to the door
  six: {
    from: () => ({ ...base(0.78), ...show(1), month: 8, clock: 6, ...CAM.PORTS, ...people({
      toto: teen({ at: G.TOTO_IV, turn: 15, look: 'projector#gate', mood: 'thinking' }),
      alfredo: here() ? blind({ turn: 300 }) : null }) }),
    run: async s => {
      const toto = s.person('toto');
      await s.wait(1.2);
      await toto.turn(115); toto.look([2, 0.55, 1.6]);
      s.tell('six:clock');
      await s.wait(4.5);
    },
  },
  // he looks at the look port (under «Смена»)
  changeover: {
    after: 'six',
    run: async s => {
      const toto = s.person('toto');
      toto.look('look_port'); await toto.turn(40);
      await s.wait(1.5);
    },
  },
  // ten o'clock: Alfredo comes in (or turns on his stool); Toto goes to the pier
  alfredo_comes: {
    from: () => ({ ...base(0.9), ...show(2), month: 8, clock: 10, ...CAM.DOOR, ...people({
      toto: teen({ at: P.TOTO_STAND, turn: 50, look: 'alfredo', mood: 'sad' }),
      alfredo: here() ? blind({ turn: 230, look: 'toto', mood: 'tired' })
        : { at: P.LANDING, turn: 270, wear: 'alfredo_blind', look: null, mood: 'tired' } }), ...(here() ? {} : { alfredo_here: false }) }),
    run: async s => {
      const alf = s.person('alfredo'), toto = s.person('toto');
      if (!s.get('alfredo_here')) {
        toto.look([2, 0.55, 1.6]);
        await s.wait(0.6);
        alf.here(true); s.set('stair', 1);
        await s.move('door', 1, { over: 0.8 });
        alf.gait('cane_walk');
        await walk(s, 'alfredo', [P.IN_DOOR, [1.3, 1.1], [1.05, 1.15]]);
        alf.gait(null);
        await alf.go('sit_down', { to: G.STOOL, turn: 230 });
        alf.on(SEAT); alf.do(CANE);
        s.move('door', 0, { over: 1.2 }); s.set('stair', 0);
        toto.look('alfredo');
      } else {
        await s.wait(0.8);
        alf.look('toto'); await s.wait(1.5);
      }
      s.tell('alfredo_comes:turned');
      await s.wait(4);
      toto.look([2, 0.55, 1.6]); await toto.turn(110);
      s.set('stair', 1); s.move('door', 1, { over: 0.8 });
      await walk(s, 'toto', [P.IN_DOOR, P.LANDING]); toto.here(false);
      await s.move('door', 0, { over: 0.6 }); s.set('stair', 0);
      s.tell('alfredo_comes:gone');
      await s.wait(1);
    },
  },
  // IV.3 — Alfredo alone at the running projector; the door: Elena
  knock: {
    from: () => ({ ...base(0.92), ...show(2), month: 8, clock: 10, lamp: 0.85, ...CAM.DOOR, ...people({
      alfredo: blind({ turn: 200, look: 'projector2', mood: 'thinking' }),
      elena: { at: P.DOORWAY, turn: 280, look: 'alfredo', mood: 'afraid' } }), elena_here: false }),
    run: async s => {
      const alf = s.person('alfredo'), el = s.person('elena');
      await s.wait(1.0);
      s.set('stair', 1); el.here(true);
      await s.move('door', 1, { over: 0.8, ease: 'out' });
      s.tell('knock:in');
      await s.wait(1.2);
      alf.look('elena');
      await s.wait(5);
    },
  },
  runs: {
    after: 'knock',
    run: async s => {
      const alf = s.person('alfredo'), el = s.person('elena');
      el.gait('run'); await el.turn(90);
      const away = walk(s, 'elena', [P.LANDING, P.AWAY]);
      await s.wait(0.6);
      s.move('door', 0, { over: 0.25, ease: 'in' }); s.tell('runs:gone');
      await away; el.here(false);
      alf.look('projector2'); await s.wait(0.6);
      alf.reach({ r: 'projector2#side' });
      await s.wait(2.6);
    },
  },
  // she writes on August behind the half-shut door; he turns the sheet to September by touch
  note: {
    after: 'knock',
    run: async s => {
      const alf = s.person('alfredo'), el = s.person('elena');
      el.mood('sad');
      await s.wait(4);
      await walk(s, 'elena', [P.IN_DOOR]);
      el.reach({ r: 'booth_door#edge' });
      await s.move('door', 0.4, { over: 1.1 });
      el.reach(null);
      await walk(s, 'elena', [P.EL_PENCIL]); await el.turn(90);
      el.reach({ r: 'bench#pencil' }); await s.wait(0.6); el.with(['pencil']); el.reach(null);
      await walk(s, 'elena', [P.EL_CAL]); await el.turn(180);
      el.look('wall_calendar#page'); el.do('paint');
      s.tell('note:writing');
      await s.move('written', 1, { over: 3.6 });
      el.do('stand'); el.with(null); el.look(null);
      await walk(s, 'elena', [[1.75, 0.75], P.DOORWAY, P.LANDING]); el.here(false);
      await s.move('door', 0, { over: 1.4 }); s.set('stair', 0);
      s.tell('note:gone');
      await s.wait(1);
      s.set('alfredo_on', null); await alf.go('rise', { from: G.STOOL });
      alf.gait('cane_walk');
      await walk(s, 'alfredo', [[1.15, 1.0], P.ALF_CAL]); alf.gait(null);
      await alf.turn(160);
      alf.reach({ r: 'wall_calendar#page' });
      await s.wait(1.2);
      s.set('month', 9); s.set('written', 0);
      s.tell('note:turned');
      await s.wait(1.6);
    },
  },
  // close at the calendar: September; over the top the edge of August with its pencil; the stair's light goes
  note_close: {
    after: 'note',
    run: async s => {
      const next = s.shot({ ...CAM.CAL });
      await s.until(() => next.ready);
      next.cut();
      await s.wait(1);
      s.move('stair', 0, { over: 1.2 });
      await s.wait(2.6);
    },
  },
  // dawn: Alfredo dozing on the stool wakes; Toto comes in: «Она приходила?» — «Нет»
  morning: {
    from: () => ({ ...base(0.27), ...show(2), month: 9, clock: 6, lamp: 0.5, beam_on: 0, motor2: 0, ...CAM.CLOSE, ...people({
      alfredo: blind({ turn: 330, do: { motion: 'doze', loop: true }, mood: 'neutral' }),
      toto: teen({ at: P.LANDING, turn: 270, look: 'alfredo', mood: 'thinking' }) }), toto_here: false }),
    run: async s => {
      const alf = s.person('alfredo'), toto = s.person('toto');
      await s.wait(0.8);
      s.set('stair', 1); toto.here(true);
      await s.move('door', 1, { over: 0.7 });
      s.tell('morning:in');
      await walk(s, 'toto', [P.TOTO_IN]); await toto.turn(305);
      alf.do(CANE); alf.look('toto');
      await s.wait(4.5);
    },
  },
  // autumn, a year on: rain at the window; Toto on the stool as Alfredo sat; Alfredo in the doorway
  autumn: {
    from: () => ({ ...base(0.8), ...show(1), month: 12, rain_window: 1, door: 1, stair: 1, lamp: 0.9, ...CAM.DOOR, ...people({
      toto: teen({ at: G.STOOL, on: SEAT, turn: 250, do: SIT, look: [-1.9, 1.5, 1.3], mood: 'tired' }),
      alfredo: { at: P.DOORWAY, turn: 285, wear: 'alfredo_blind', look: 'toto', mood: 'sad' } }) }),
    run: async s => {
      const toto = s.person('toto');
      await s.wait(4); s.tell('autumn:door');
      await s.wait(9);
      toto.look([-1.9, 1.6, 1.5]);
      await s.wait(3);
    },
  },
  // 1988 — the ruin: he comes in with the tin; the slate on its nail; to projector 2, his hand on its rusty side
  ruins: {
    from: () => ({ ...base(0.8, { era: 'ruin' }), lamp: 0, month: 12, stair: 0, ...CAM.DOOR, ...people({
      toto: { at: P.LANDING, turn: 270, wear: 'salvatore', with: ['tin'], look: null, mood: 'sad' } }), toto_here: false }),
    run: async s => {
      const sal = s.person('toto');
      await s.wait(0.6);
      sal.here(true);
      await s.move('door', 1, { over: 1.2 });
      await walk(s, 'toto', [P.IN_DOOR, [1.45, 1.1]]);
      sal.look('slate_nail'); await s.wait(0.8);
      s.tell('ruins:in');
      s.set('pigeons', 1);
      sal.look('projector2');
      s.set('camera_shot', 'medium'); s.set('camera_glide', 2); s.set('camera_target', 'toto');
      await walk(s, 'toto', [P.SAL_P2]); await sal.turn(300);
      sal.reach({ l: 'projector2#side' });
      await s.wait(6);
      sal.reach(null);
    },
  },
  // back to the door; he shuts it: the calendar on December; its insert opens (under «Записка»)
  calendar: {
    after: 'ruins',
    run: async s => {
      const sal = s.person('toto');
      s.set('camera_glide', 1.5); s.set('camera_target', null);
      await walk(s, 'toto', [[1.4, 1.2], P.SAL_DOOR]); await sal.turn(140);
      sal.reach({ r: 'booth_door#edge' });
      await s.move('door', 0, { over: 1.2 });
      sal.reach(null); sal.look('wall_calendar#page');
      await s.move('calendar', 1, { over: 0.8 });
      s.tell('calendar:close');
      await s.wait(0.4);
    },
  },
  // at the window on the square he opens the tin; the strip insert opens (under «Лента»)
  window_strip: {
    after: ['ruins', 'calendar'],
    run: async s => {
      const v = { ...CAM.SQUARE, camera_glide: 0, toto_a: P.SAL_WINDOW[0], toto_d: P.SAL_WINDOW[1], toto_turn: 300, toto_look: 'square_window', toto_reach: null };
      const next = s.shot(v);
      await s.until(() => next.ready);
      next.cut();
      await s.wait(1.2);
      await s.move('strip', 1, { over: 0.8 });
      s.tell('window_strip:close');
      await s.wait(0.4);
    },
  },
  // the insert closed: at the window, the strip hanging from his hands to the floor; his face in the window's light
  strip_end: {
    from: () => ({ ...base(0.8, { era: 'ruin' }), lamp: 0, month: 12, strip: 0, hanging: 1, ...CAM.SQUARE, ...people({
      toto: { at: P.SAL_WINDOW, turn: 70, wear: 'salvatore', look: [0.5, 1.5, 1.6], reach: { r: 'toto#chest', l: 'toto#chest' }, mood: 'sad' } }) }),
    run: async s => {
      const sal = s.person('toto');
      await s.wait(1); s.tell('strip_end:held');
      await s.wait(2.5); sal.mood('smile');
      await s.wait(3);
    },
  },
};
return FILM;
}
return { G, R, CAM, P, SEAT, BENCH_SEAT, ALONG, PATH_TURN, tone, plaster, cans, BOX, projBodyForm, onBody, projBody, projProfile, film, base, people };
