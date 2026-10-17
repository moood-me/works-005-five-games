// From the train window — what the scene's elements, script and film share: the carriage's plan, the five lands laid along the
// line (each its own stretch of the world), their colours, the sky's colours, the things standing along the line, the
// sofas; and the film in beats (film(scene), for the world's module beats).
//   Metres: `across` along the line (the train runs toward +across), `distance` away from it (out of the window),
// elevation up from the carriage's floor; the eye is 1.7 m over the floor. The world lies where it is; the camera is the
// train (camera_x — script.js drives it by `speed`), the carriage rides on it.

// colours (the world's module svet)
const { mixc, css, rgba, gas } = kit.svet;

const plan = {
  // the eye level on screen (scene.json "horizon"): where the sky meets the land
  horizon: 0.27,
  // the carriage wall with its window
  wall: 2.6,
  win: { w: 2, sill: 0.8, top: 2.2, round: 0.2 },
  // the land outside lies this much below the carriage floor (the relief: the embankment drops to it)
  ground: -1.3,
  // how fast the land goes by at `speed` 1, metres a second
  pace: 20,
  // India: the river runs along the line, from its near bank to its far bank
  river: [22, 320],
  // the lands, each laid out round its own middle `apart` metres from the one before (Europe at across 0)
  lands: ['europe', 'india', 'prairie', 'snow', 'england'],
  apart: 30000,
  // each land is the same every `period` metres along the line: the train runs its stretch (a period round the middle)
  // and, at its end, is cut back a period — to the very same view (script.js)
  period: 8000,
  // how far aside of the eye the window lets anyone see a thing D metres off: reach × D (the widest shot, the eye 1.1 m
  // off the window's middle and 1.2 m nearer it, and a lean)
  reach: 1.7,
};
const clamp01 = v => anim.clamp(v ?? 0, 0, 1);
// a land's middle along the line; the land a place along the line is in
const centre = land => Math.max(0, plan.lands.indexOf(land)) * plan.apart;
const landAt = x => plan.lands[anim.clamp(Math.round(x / plan.apart), 0, plan.lands.length - 1)];
// how far either side of its land's middle what stands D metres off is painted: its stretch and what the window sees
// past its ends (more — the things' own size)
const reachOf = (D, more = 0) => plan.period / 2 + plan.reach * D + more;
const mod = (i, n) => ((i % n) + n) % n;
// the Ganges' plane: as long as its far bank is seen along its stretch
const riverWidth = 2 * reachOf(plan.river[1], 100);

// Things standing along the line in a land, one every `spacing` metres (jittered; the period a whole number of them):
// draw(x, j) for each — x where it stands (across, metres), j its steady number within the period (anim.hash(j, …)
// gives it its looks: the same thing a period on). D — how far off they stand (how far aside they are seen).
function along(land, spacing, D, seed, draw, more = 0) {
  const n = Math.round(plan.period / spacing), C = centre(land), H = reachOf(D, spacing + more);
  for (let i = Math.floor(-H / spacing); i <= Math.ceil(H / spacing); i++) {
    const j = mod(i, n);
    draw(C + i * spacing + (anim.hash(j, seed) - 0.5) * spacing * 0.8, j);
  }
}
// smooth noise −1…1 along a land, `cell` metres a step, the same every period (cell divides it): u — metres from its middle
function pnoise(u, cell, seed) {
  const n = Math.round(plan.period / cell), x = u / cell, i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f);
  return anim.mix(anim.hash(mod(i, n), seed) * 2 - 1, anim.hash(mod(i + 1, n), seed) * 2 - 1, s);
}

// The land under the window: level with the carriage floor at the line, the embankment falling to the land 1.3 m lower
// by 7 m out; in India the river's bed under the water (its banks shelving in).
function relief(across, distance) {
  let h = plan.ground * anim.ease.smooth(anim.span(distance, 3, 7.5));
  if (landAt(across) === 'india') {
    const [a, b] = plan.river;
    h -= 0.5 * anim.span(distance, a - 6, a + 4) * (1 - anim.span(distance, b - 4, b + 8));
  }
  return h;
}

// Each land by day, painted so (the scene's light makes the night and the dawn; the air hazes what is far): its sky,
// its layers from far to near, its ground, its lights.
const LANDS = {
  europe: {
    top: '#6f93b8', low: '#d3dde0', far: '#7f95a2', distant: '#5d7866', mid: '#4d6743', near: '#3b5232',
    groundFar: '#82946f', groundNear: '#56693f', lights: '#ffcf86',
    crops: ['#6f8a48', '#a7a060', '#7a6448', '#5f7a3c'],
  },
  india: {
    top: '#7fb0cc', low: '#f2e6c8', far: '#ada68c', distant: '#80835a', mid: '#5f7a3e', near: '#5a6a34',
    groundFar: '#c2a67c', groundNear: '#a87c50', water: '#b8ccc6', lights: '#ffc070',
    crops: ['#8a9a50', '#b8955c', '#6f8a40'],
  },
  prairie: {
    top: '#4f86c0', low: '#e3ecf3', far: '#b8c4d0', distant: '#a2acb3', mid: '#a88f5e', near: '#97845a',
    groundFar: '#e5eaee', groundNear: '#f2f4f6', hide: '#4a3426', lights: '#ffc878',
  },
  snow: {
    top: '#86a9c8', low: '#eef2f5', far: '#9aaec2', distant: '#4b5b62', mid: '#3e4d51', near: '#5c6b70',
    groundFar: '#eaeef1', groundNear: '#f6f7f8', lights: '#ffcf86',
  },
  england: {
    top: '#a2aaaf', low: '#c6c8c4', far: '#9aa0a0', distant: '#7f8789', mid: '#6b7275', near: '#4d5559',
    groundFar: '#a4a8a2', groundNear: '#6c736b', lights: '#ffc878',
    crops: ['#6e7a66', '#7d7462', '#5f6d5a'],
  },
};
const colours = land => LANDS[land] ?? LANDS.europe;

// The sky's colours now (sRGB 0…255): the land's day sky darkened to a moonlit night, warmed low by the dawn — and how
// much of the stars, the moon and the sun is out. For the sky's animate (its shader's uniforms).
function skyOf(state) {
  const C = colours(state.land), night = clamp01(state.night), dawn = clamp01(state.dawn);
  let top = mixc(C.top, '#0d1626', night * 0.85);
  let low = mixc(C.low, '#3a4c66', night * 0.7);
  top = mixc(top, '#7d84a8', dawn * 0.25 * (1 - night * 0.5));
  low = mixc(low, '#f2a46e', dawn * 0.7 * (1 - night * 0.5));
  const england = state.land === 'england';
  return {
    top, low,
    stars: england ? 0 : anim.ease.smooth(anim.span(night, 0.4, 0.9)),
    moon: anim.ease.smooth(anim.span(night, 0.3, 0.8)) * (england ? 0.35 : 1),
    sun: dawn,
  };
}
// the sky's animate: its colours and what is out of it, as its shader's uniforms; the moon's and the sun's glows; the
// sun a little higher as the dawn grows
function skyMotion(e) {
  const S = skyOf(e.state), m = e.mem;
  const sky = m.sky ??= { tr: 0, tg: 0, tb: 0, lr: 0, lg: 0, lb: 0 };
  sky.tr = S.top[0] / 255; sky.tg = S.top[1] / 255; sky.tb = S.top[2] / 255;
  sky.lr = S.low[0] / 255; sky.lg = S.low[1] / 255; sky.lb = S.low[2] / 255;
  for (const k in sky) e.uniform(k, sky[k]);
  e.uniform('w', e.aspect);
  e.uniform('stars', S.stars);
  e.uniform('moon', S.moon);
  e.uniform('sun', S.sun);
  const rise = -0.03 * S.sun;
  e.uniform('sun_dy', rise);
  e.layer('sun').y = rise;
  e.glow('moon', S.moon);
  e.glow('sun', S.sun);
}
// what paints lit windows and lamps has them in a layer its shader adds as light (emission, `lit`) as much as the lamps
// are on at the night, and their glows (its unnamed e.light) as much — but those a light of the scene takes (`of`),
// which its `on` puts out
function litMotion(e, shader = true, glows = true) {
  const k = gas(e.state.night);
  if (shader) e.uniform('lit', k);
  if (glows) e.glow(null, k);
}

// The window's rounded opening, as a path on the carriage wall's card (the wall cuts it out, the glass fills it).
function opening(g) {
  const W = plan.win, x0 = -W.w / 2, x1 = W.w / 2, y0 = -W.top, y1 = -W.sill, r = W.round;
  g.moveTo(x0 + r, y0);
  g.lineTo(x1 - r, y0);
  g.quadraticCurveTo(x1, y0, x1, y0 + r);
  g.lineTo(x1, y1 - r);
  g.quadraticCurveTo(x1, y1, x1 - r, y1);
  g.lineTo(x0 + r, y1);
  g.quadraticCurveTo(x0, y1, x0, y1 - r);
  g.lineTo(x0, y0 + r);
  g.quadraticCurveTo(x0, y0, x0 + r, y0);
  g.closePath();
}

// A sofa turned to the window, its back to you: deep red velvet, a rolled top.
function sofa(g) {
  const w = 0.55;
  g.fillStyle = '#6a2a30';
  g.beginPath();
  g.moveTo(-w, 0);
  g.lineTo(-w, -0.7);
  g.quadraticCurveTo(-w, -0.8, -w + 0.1, -0.8);
  g.lineTo(w - 0.1, -0.8);
  g.quadraticCurveTo(w, -0.8, w, -0.7);
  g.lineTo(w, 0);
  g.closePath();
  g.fill();
  // the pleats of the back
  g.fillStyle = 'rgba(0,0,0,0.18)';
  for (let k = -1; k <= 1; k++) g.fillRect(k * 0.26 - 0.006, -0.64, 0.012, 0.56);
}
// A sofa's arm by the aisle, seen from the side (a card turned to the aisle, x from the sofa's back toward the window):
// the same velvet, a rolled top a little lower than the back. side −1: turned the other way (the right sofa's).
function sofaArm(g, side = 1) {
  g.scale(side, 1);
  g.fillStyle = '#5c2329';
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -0.62);
  g.quadraticCurveTo(0, -0.7, 0.08, -0.7);
  g.lineTo(0.5, -0.66);
  g.quadraticCurveTo(0.56, -0.65, 0.56, -0.58);
  g.lineTo(0.55, 0);
  g.closePath();
  g.fill();
}

// The buffalo herd (the element herd, its shader herd.wgsl): HERD.n animals in HERD.rows rows, the herd HERD.long metres
// from its head to its tail, crossing the card's ±HERD.half; each a sprite of the atlas (one buffalo in HERD.frames
// poses of its stride, side by side, HERD.cell metres apart, from HERD.at), its stride HERD.stride metres.
const HERD = { half: 50, long: 260, rows: 6, slot: 7, frames: 12, cell: 4, at: 60, stride: [3.2, 3.8] };
// one buffalo at the phase of its stride ph (0…1), heading right, its feet at (0, 0)
function buffalo(g, ph) {
  const a = 2 * Math.PI * ph, bob = 0.06 * Math.sin(2 * a);
  g.save();
  g.translate(0, bob);
  g.beginPath();
  g.moveTo(-1.5, -0.55);
  g.quadraticCurveTo(-1.65, -1.3, -0.8, -1.35);
  g.quadraticCurveTo(0.1, -2.0, 0.8, -1.6);
  g.quadraticCurveTo(1.45, -1.3, 1.6, -0.6);
  g.lineTo(1.45, -0.3);
  g.quadraticCurveTo(0.95, -0.3, 0.85, -0.55);
  g.lineTo(-1.4, -0.45);
  g.closePath();
  g.fill();
  g.restore();
  // its legs at their stride
  for (const [lx, p] of [[-1.1, 0], [-0.8, Math.PI], [0.5, Math.PI], [0.8, 0]]) {
    const swing = 0.18 * Math.sin(a + p);
    g.fillRect(lx + swing - 0.09, -0.6 + bob, 0.18, 0.6 - bob);
  }
}

// ── the film ──
// The people on the two sofas turned to the window, their backs to us: Fogg and Aouda on the left, Passepartout and Fix
// on the right — on the carriage (their places its own). The film's beats (module beats): FILM = film(scene).
const SEAT = { fogg: [-1.52, 2.12], aouda: [-0.98, 2.12], passepartout: [0.98, 2.12], fix: [1.52, 2.12] };
// where Passepartout stands at the glass, his palms on it (window#pane_r, window#pane_l)
const AT_GLASS = [0.74, 2.4];
// points in the carriage, going with it ([across, distance, elevation] from its anchor): what they look at out of the
// window and in it, where a watch is held
const inside = at => ({ on: 'carriage', at });
const LOOK = {
  out: inside([0, 40, 1.0]), // far out of the window, ahead
  platform: inside([3, 12, 1.0]), // ahead along the line (the way the train goes)
  field: inside([0.6, 6, 1.1]), // the field by the line
  trees: inside([-0.4, 4, 1.2]), // the trees by the line, behind
  aisle: inside([1.6, 1.7, 1.12]), // into the aisle on the right (Aouda's profile against the window)
  herd: inside([0.2, 60, 0.4]), // the herd crossing
};
// a watch held in the palm before the chest: Fogg's; Passepartout's, held up toward the light
const PALM = { fogg: inside([-1.46, 2.38, 0.86]), passepartout: inside([0.76, 2.36, 1.02]) };
const WITH = { aouda: 'with_aouda', passepartout: 'with_pp', fix: 'with_fix' };
const loop = (motion, from = 0) => ({ motion, loop: true, from });
const seated = (id, motion, from = 0) => ({
  [`${id}_a`]: SEAT[id][0], [`${id}_d`]: SEAT[id][1], [`${id}_turn`]: 0, [`${id}_do`]: loop(motion, from),
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null,
});
// the camera of a shot (metres right of the carriage's middle, in, up): the camera is the train, so a shot aside moves
// the carriage the other way (carriage_x)
const shot = (x = 0, z = 0, h = 0) => ({ carriage_x: -x, camera_z: z, camera_h: h });
// Fogg's watch close (the insert watch_close, in stage heights): `at` — where the palm's middle lies, from the frame's
// middle; `turn` — the hand turned (radians: his right forearm comes up from the lower right); `cm` — a centimetre;
// in the hand's centimetres (the fingers toward −y): `watch` — the watch's middle, `R` — its case's radius, `seconds` —
// the seconds' dial, from the watch's middle. closeAt — a point of the hand in stage heights (the stage 16:9).
const CLOSE = { at: [-0.02, 0.56], turn: -0.26, cm: 1 / 18.5, watch: [0, -0.5], R: 2.55, seconds: [0, 1.02] };
const closeAt = ([x, y]) => {
  const c = Math.cos(CLOSE.turn), q = Math.sin(CLOSE.turn);
  return [16 / 18 + CLOSE.at[0] + (c * x - q * y) * CLOSE.cm, CLOSE.at[1] + (q * x + c * y) * CLOSE.cm];
};
// a land, and where in it the train is (metres from its middle); its air: England's fog
const where = (land, off) => ({ land, camera_x: centre(land) + off, fog: land === 'england' ? 1 : 0 });

function film(scene) {
  // who is in the carriage: the game's with_* (Fogg always)
  const here = () => Object.fromEntries(Object.entries(WITH).map(([id, k]) => [`${id}_here`, !!(scene.get(k) ?? 1)]));
  // where one stands after a motion done once that began at (a, d)
  const after = (id, motion, turn, [a, d]) => {
    const o = scene.person(id).startOf(motion, turn) ?? { across: 0, distance: 0 };
    return [a - o.across, d - o.distance];
  };
  // the night journey: Fogg reads, Aouda looks out, Fix behind his paper, Passepartout asleep
  const RIDE = {
    ...where('europe', -2400), speed: 1, night: 1, dawn: 0, herd: 0, watch_close: 0, ...shot(),
    ...seated('fogg', 'read_book'), fogg_with: ['book'], fogg_here: true,
    ...seated('aouda', 'sit_calm'), aouda_look: LOOK.out,
    ...seated('passepartout', 'sleep_seated'),
    ...seated('fix', 'paper_seated', 3.3), fix_with: ['newspaper'],
  };
  // leaving London: only Fogg and Passepartout, Passepartout at the window, Fogg's book still shut; the train moving off
  const DEPART = {
    ...RIDE, ...where('europe', -3600), speed: 0.2, ...seated('fogg', 'sit_calm'), ...seated('passepartout', 'look_out'),
    passepartout_look: LOOK.out, passepartout_here: true, aouda_here: false, fix_here: false,
  };
  // …running: Fogg has opened his book
  const OFF = { ...DEPART, ...where('europe', -3500), speed: 1, fogg_with: ['book'], fogg_do: loop('read_book') };
  // India at dawn
  const INDIA = { ...RIDE, ...where('india', 600), night: 0.15, dawn: 1 };
  return {
    // ---- Charing Cross, night: the train gathers speed. Passepartout at the window, all eyes; Fogg opens his book.
    depart: {
      from: () => DEPART,
      run: async s => {
        const fogg = s.person('fogg'), pp = s.person('passepartout');
        s.move('speed', 1, { over: 6, ease: 'in' });
        await s.wait(1.6);
        fogg.with(['book']);
        fogg.do('read_book', { loop: true });
        s.tell('depart:book');
        await s.wait(2.4);
        pp.look(LOOK.platform);
        await s.wait(2.5);
        pp.look(LOOK.out);
        await s.wait(1.5);
      },
    },
    // ---- The gas! Passepartout jumps up, his hand to his forehead, turns to his master; Fogg looks up from the book.
    gas: {
      after: 'depart',
      from: () => OFF,
      run: async s => {
        const fogg = s.person('fogg'), pp = s.person('passepartout');
        const near = s.shot(shot(0.4, 0.7));
        const up = pp.go('gas_up', { from: SEAT.passepartout, turn: 0 });
        await s.wait(0.6);
        await s.until(() => near.ready);
        near.cut();
        await up;
        s.tell('gas:up');
        pp.turn(290);
        await s.wait(0.2);
        pp.look('fogg#head');
        await s.wait(0.2);
        fogg.look('passepartout#head');
        await s.wait(1.4);
        fogg.look(null);
        await s.wait(0.4);
      },
    },
    // ---- He sits down again and takes out his great silver watch: London time — he won't put it right.
    watch: {
      after: 'gas',
      from: () => {
        const [a, d] = after('passepartout', 'gas_up', 0, SEAT.passepartout);
        return {
          ...OFF, ...shot(0.4, 0.7), passepartout_a: a, passepartout_d: d, passepartout_turn: 290,
          passepartout_do: { motion: 'gas_up', loop: false, from: 99 }, passepartout_look: 'fogg#head',
        };
      },
      run: async s => {
        const pp = s.person('passepartout');
        const close = s.shot(shot(0.1, 0.6, -0.2));
        pp.look(null);
        await pp.go('sit_down', { to: SEAT.passepartout, turn: 0 });
        await s.until(() => close.ready);
        close.cut();
        pp.do('sit_calm', { loop: true });
        pp.with(['watch']);
        s.tell('watch:out');
        pp.reach({ r: PALM.passepartout });
        await s.wait(0.2);
        pp.look('passepartout#watch');
        await s.wait(3.2);
      },
    },
    // ---- The land runs by; they live: Fogg reads, Aouda by the window, Fix behind his paper, Passepartout asleep.
    ride: {
      from: () => ({ ...RIDE, ...here() }),
      run: async s => {
        const aouda = s.person('aouda'), fix = s.person('fix');
        await s.wait(3);
        aouda.look(LOOK.field);
        await s.wait(2);
        fix.look('fogg#head');
        await s.wait(2);
        aouda.look(LOOK.out);
        await s.wait(0.5);
        fix.look(null);
        await s.wait(2.5);
      },
    },
    // ---- India: the train slows and stands among the trees. They wake and look up and out.
    brake: {
      from: () => ({ ...INDIA, ...here() }),
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda'), pp = s.person('passepartout'), fix = s.person('fix');
        const stop = s.move('speed', 0, { over: 6, ease: 'out' });
        await s.wait(1.5);
        pp.do('look_out', { loop: true });
        await s.wait(0.1);
        pp.look(LOOK.out);
        await s.wait(0.8);
        fogg.look(LOOK.out);
        await s.wait(0.6);
        fix.with(['newspaper_folded']);
        fix.do('talk_seated', { loop: true });
        await s.wait(0.2);
        fix.look(LOOK.out);
        await s.wait(0.8);
        aouda.look(LOOK.trees);
        await stop;
        s.tell('brake:stopped');
        await s.wait(2);
      },
    },
    // ---- Dawn on the Ganges, the train going on slowly: Aouda turns her head — her profile against the river.
    ganges: {
      from: () => ({
        ...INDIA, ...where('india', 1400), speed: 0.4, ...shot(-0.9, 0.8, -0.3), ...seated('passepartout', 'look_out'),
        passepartout_look: LOOK.out, fogg_look: LOOK.out, ...seated('fix', 'talk_seated'), fix_with: ['newspaper_folded'],
        fix_look: LOOK.out, aouda_look: LOOK.trees, ...here(),
      }),
      run: async s => {
        const aouda = s.person('aouda');
        await s.wait(1);
        aouda.look(LOOK.aisle);
        s.tell('ganges:profile');
        await s.wait(4.6);
        aouda.look(LOOK.out);
        await s.wait(2.4);
      },
    },
    // ---- The prairie: the train stands; buffalo, buffalo. Passepartout up at the glass, his palms on it.
    buffalo: {
      from: () => ({
        ...RIDE, ...where('prairie', 300), herd_x: centre('prairie') + 300, speed: 0, night: 0, dawn: 0.35, herd: 0,
        ...seated('passepartout', 'look_out'), passepartout_look: LOOK.out, ...here(),
      }),
      run: async s => {
        const fogg = s.person('fogg'), pp = s.person('passepartout');
        const herd = s.move('herd', 1, { over: 24, ease: 'linear' });
        const near = s.shot(shot(0.4, 0.7));
        await s.wait(0.6);
        const up = pp.go('rise_chair', { from: SEAT.passepartout, turn: 0 });
        await s.wait(2.4);
        await s.until(() => near.ready);
        near.cut();
        await up;
        await pp.walk([AT_GLASS]);
        await pp.turn(350);
        pp.reach({ r: 'window#pane_r', l: 'window#pane_l' });
        s.tell('buffalo:at-glass');
        pp.look(LOOK.herd);
        await s.wait(1.7);
        fogg.look(LOOK.herd);
        await s.wait(3);
        fogg.look(null);
        await herd;
      },
    },
    // ---- Omaha to New York: the snow, a clear cold day; they ride on.
    snow: {
      from: () => ({ ...RIDE, ...where('snow', -1800), night: 0, dawn: 0, ...seated('passepartout', 'look_out'), passepartout_look: LOOK.out, ...here() }),
      run: async s => {
        const aouda = s.person('aouda'), pp = s.person('passepartout');
        await s.wait(2.5);
        pp.look(LOOK.platform);
        await s.wait(2.5);
        aouda.look(LOOK.field);
        await s.wait(3);
        pp.look(LOOK.out);
        await s.wait(2);
      },
    },
    // ---- England, fog: the special train at full speed. Fogg takes out his watch; the watch close in his palm (the
    // insert watch_close); back in the carriage, all eyes on it.
    special: {
      from: () => ({
        ...RIDE, ...where('england', -900), night: 0.8, speed: 1, ...seated('passepartout', 'look_out'), passepartout_look: LOOK.out, ...here(),
      }),
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda'), pp = s.person('passepartout'), fix = s.person('fix');
        const close = s.shot({ watch_close: 1 });
        await s.wait(0.8);
        fogg.with(['watch']);
        fogg.do('sit_calm', { loop: true });
        await s.wait(0.1);
        fogg.reach({ r: PALM.fogg });
        await s.wait(0.2);
        fogg.look('fogg#watch');
        await s.wait(1.4);
        await s.until(() => close.ready);
        close.cut();
        s.tell('special:watch');
        // (under the close shot the others turn to him: the carriage is cut back to, a step nearer, with all eyes on the watch)
        const near = s.shot({ watch_close: 0, ...shot(-0.25, 0.1) });
        await s.wait(1.4);
        aouda.look('fogg#watch');
        await s.wait(0.6);
        pp.look('fogg#head');
        await s.wait(0.6);
        fix.look('fogg#watch');
        await s.wait(2.4);
        await s.until(() => near.ready);
        near.cut();
        s.tell('special:eyes');
        await s.wait(3.5);
      },
    },
  };
}
// the showcase's order: the whole journey
const SHOWCASE = ['depart', 'gas', 'watch', 'ride', 'brake', 'ganges', 'buffalo', 'snow', 'special'];

return {
  plan, centre, landAt, reachOf, riverWidth, along, pnoise, relief, colours, gas, skyMotion, litMotion, mixc, css, rgba,
  opening, sofa, sofaArm, HERD, buffalo, WITH, LOOK, CLOSE, closeAt, film, SHOWCASE,
};
