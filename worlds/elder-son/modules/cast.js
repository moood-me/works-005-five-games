// cast — the people of «Старший сын»: figures of shapes in the world's style `zima` (made from `shadow`: slender, the
// fingers of its hands — but a bigger head, a shorter neck, fuller arms and legs, so a face reads in a medium shot),
// painted lit: the lamp's, the window's, the street lamp's light lies on the face and the chest, the side away from it
// in shade — never a silhouette. No lines. Every one has the face `simple` (eyes, brows, a nose, a mouth; the
// expression — `<id>_mood`), each with a feature of their own: Сарафанов — lines at the eyes, grey brows; Нина —
// straight brows; Васенька — tufts down on the forehead; Сильва — a thin moustache; Кудимов — a square chin.
// Who is who, every part and every motion — cast.md. A part's lengths are a man's metres times F.fit.h (the person's
// height as a share of a man's 1.76 m), thicknesses times F.k; the points a part names are the person's
// ("vasenka#rucksack", "busygin#bucket").
const V = () => MooodShapes.V;
const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255);
const C = (s, k = 1) => [...hex(s), k]; // k 2: it glows
const UP = [0, 1, 0];
const BRASS = C('#a8853f'), BLACK = C('#121214'), LEATHER = C('#2a1d15'), SILVER = C('#b8b8b2'), CANVAS = C('#6a6650'),
  CANVAS_D = C('#4c4a3a'), FIBRE = C('#5b4a3a'), PAPER = C('#e6e0cf'), ENAMEL = C('#4f6474'), GLASS = C('#9fb0b4'),
  TEA = C('#6a3a1c'), WATER = C('#8fa3b0'), SNOW = C('#e9eef3'), CHAR = C('#141110'), EMBER = C('#3a2016');

// ── faces ──────────────────────────────────────────────────────────────
// The engine's `simple` face (eyes, brows, a nose, a mouth, as the expression has them), its brows a little heavier to
// read at the size of a medium shot, and each person's own feature drawn the same for every expression (the face goes
// from one expression to another on the GPU: the same solids each time).
const MOODS = {
  neutral: { inner: 0, outer: 0, eye: 1, wide: 0.13, corners: 0, open: 0 },
  smile: { inner: 0.01, outer: 0.01, eye: 0.85, wide: 0.15, corners: 0.045, open: 0 },
  laugh: { inner: 0.03, outer: 0.02, eye: 0.45, wide: 0.16, corners: 0.05, open: 0.07 },
  sad: { inner: 0.07, outer: -0.05, eye: 0.85, wide: 0.12, corners: -0.04, open: 0 },
  angry: { inner: -0.08, outer: 0.03, eye: 0.8, wide: 0.11, corners: -0.025, open: 0 },
  surprised: { inner: 0.08, outer: 0.08, eye: 1.35, wide: 0.07, corners: 0, open: 0.08 },
  afraid: { inner: 0.09, outer: 0.01, eye: 1.3, wide: 0.12, corners: -0.025, open: 0.04 },
  disgusted: { inner: -0.05, outer: -0.01, eye: 0.75, wide: 0.12, corners: -0.035, open: 0 },
  thinking: { inner: -0.03, outer: 0.03, eye: 0.85, wide: 0.08, corners: -0.01, open: 0 },
  tired: { inner: 0.02, outer: -0.05, eye: 0.5, wide: 0.12, corners: -0.015, open: 0 },
};
// o: brow — the brows' colour (else the hair's, darker); straight — 0…1 how flat the brows lie (Нина's); lines — at the
// eyes' corners and under them (Сарафанов's); moustache; chin — a square chin (Кудимов's)
const face = (name, o = {}) => ({ name, draw: F => {
  const { axes, r: rh, on } = F.head, [, hu] = axes, dark = [0.12, 0.1, 0.1];
  const brow = o.brow ? hex(o.brow) : F.colors.hair.map(v => v * 0.7), skin = F.colors.skin;
  const x = MOODS[F.look.expression] ?? MOODS.neutral, lips = skin.map(v => v * 0.7), fl = 1 - (o.straight ?? 0);
  for (const sx of [-1, 1]) {
    F.ball(on([sx * 0.33, 0.08, 0.94], 0.985), axes, [rh * 0.075, rh * 0.09 * x.eye, rh * 0.04], dark, 10);
    const yi = 0.34 + x.inner * (0.5 + 0.5 * fl), yo = 0.31 + 0.04 * (1 - fl) + x.outer * (0.5 + 0.5 * fl);
    F.tube([on([sx * 0.15, yi, 0.93], 0.995), on([sx * 0.3, 0.36 * fl + 0.34 * (1 - fl) + (x.inner + x.outer) / 2 * (0.5 + 0.5 * fl), 0.9], 1.0), on([sx * 0.46, yo, 0.84], 0.995)],
      [[0, rh * 0.034], [1, rh * 0.038], [2, rh * 0.024]], [[0, brow]], 6, hu);
    if (o.lines) {
      const ln = skin.map(v => v * 0.68);
      for (const dy of [-0.06, 0.03, 0.12]) F.tube([on([sx * 0.5, 0.08 + dy * 0.4, 0.8], 0.995), on([sx * 0.6, 0.08 + dy, 0.7], 0.995)], [[0, rh * 0.012], [1, rh * 0.008]], [[0, ln]], 4, hu);
      F.tube([on([sx * 0.22, -0.06, 0.94], 0.995), on([sx * 0.34, -0.1, 0.92], 0.998), on([sx * 0.45, -0.05, 0.86], 0.995)], [[0, rh * 0.01], [2, rh * 0.008]], [[0, ln]], 4, hu);
    }
  }
  F.ball(on([0, -0.1, 1], 0.97), axes, [rh * 0.09, rh * 0.13, rh * 0.12], skin.map(v => v * 0.96), 10);
  const w = x.wide, y = -0.4;
  F.ball(on([0, y - x.open / 2, 0.95], 0.975), axes, [rh * w * 0.75, rh * x.open, rh * 0.03], dark, 10);
  F.tube([on([-w, y + x.corners, 0.93], 0.995), on([0, y, 0.94], 1.0), on([w, y + x.corners, 0.93], 0.995)], [[0, rh * 0.018], [2, rh * 0.018]], [[0, lips]], 6, hu);
  if (o.moustache) F.tube([on([-0.17, -0.27, 0.93], 1.0), on([0, -0.24, 0.99], 1.0), on([0.17, -0.27, 0.93], 1.0)], [[0, rh * 0.014], [1, rh * 0.03], [2, rh * 0.014]], [[0, F.colors.hair]], 6, hu);
  if (o.chin) F.ball(on([0, -0.8, 0.6], 0.88), axes, [rh * 0.36, rh * 0.13, rh * 0.2], skin, 10, 3.2);
} });

// ── what is drawn on them ──────────────────────────────────────────────
const hand = (F, n) => { const j = n === 'l' ? 'LeftHand' : 'RightHand'; return { at: F.P(j), axes: [F.side(j), F.up(j), F.fwd(j)] }; };
// a section of the trunk (2 the waist, 3 the chest, 4 the shoulders): [centre, side, forward, half-width, half-depth]
const sec = (F, i) => F.trunk(1)[i];
// a panel down the front of the trunk (an open coat's sweater, a shirt's front): from the shoulders' section down to the
// waist's, half as wide as `w` of the chest, a little out of the trunk
const front = (F, w, colour, down = 2, out = 1.06) => {
  const { add, mul, mix } = V(), sh = sec(F, 4), lo = sec(F, down), ch = sec(F, 3);
  const top = add(sh[0], mul(sh[2], sh[4] * out)), bot = add(lo[0], mul(lo[2], lo[4] * out));
  F.bar(top, bot, ch[3] * w, ch[3] * w * 0.9, [[0, colour]], 6, sh[2], true);
  return { top, bot };
};
// a flat thing in the right hand's fingers, turned to the eyes
const inHand = (F, w, h, colour, name) => {
  const { add, mul, unit, sub, cross } = V(), m = F.fit.h, at = F.P('RightHand'), f = F.fwd('RightHand');
  const c = add(at, mul(f, 0.05 * m)), n = unit(sub(F.P('Head'), c)), x = unit(cross(UP, n)), y = cross(n, x);
  F.ball(c, [x, y, n], [w * m, h * m, 0.002 * m], colour, 4, 8);
  if (name) F.point(name, c);
};
const hairCap = (F, scale) => { const h = F.head; F.cap(h.at, h.axes, h.egg.map(v => v * h.r * h.out * scale), [0, 0.75, -0.66], -0.2, F.colors.hair, h.sides, h.square); };
// a fur hat pulled low; with ear-flaps tied up and, for a cadet, a star at the front
const furHat = (flaps, star) => F => {
  const { add, mul } = V(), { at, axes, r } = F.head, [hs, hu, hf] = axes;
  F.ball(add(at, mul(hu, r * 0.5)), axes, [r * 1.16, r * 0.76, r * 1.14], F.colors.hat, F.sides);
  F.ball(add(at, mul(hu, r * 0.18)), axes, [r * 1.13, r * 0.3, r * 1.11], F.colors.hat, F.sides);
  if (flaps) for (const s of [-1, 1]) F.ball(add(at, add(mul(hs, s * r * 1.02), mul(hu, r * 0.4))), axes, [r * 0.18, r * 0.42, r * 0.5], F.colors.hat, 10);
  if (star) F.ball(add(at, add(mul(hu, r * 0.5), mul(hf, r * 1.16))), axes, [r * 0.11, r * 0.11, r * 0.04], C('#b02a22'), 5, 1.4);
};

const parts = {
  // ── kept from before ──
  fur_collar: { name: 'меховой воротник', draw: F => {
    const { add, mul } = V(), uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest');
    F.ball(add(F.P('Neck1'), add(mul(uc, -0.035 * F.fit.h), mul(fc, -0.012 * F.k))), [sd, uc, fc], [0.16 * F.k, 0.065 * F.fit.h, 0.13 * F.k], F.colors.accent, F.sides);
  } },
  collar: { name: 'воротник рубашки', draw: F => {
    const { add, mul } = V(), uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest');
    F.ball(add(F.P('Neck1'), add(mul(uc, -0.02 * F.fit.h), mul(fc, 0.01 * F.k))), [sd, uc, fc], [0.08 * F.k, 0.03 * F.fit.h, 0.075 * F.k], F.colors.accent, F.sides);
  } },
  // Сарафанов's long light scarf: its two ends down the front of the coat, to the waist
  long_scarf: { name: 'длинный шарф', draw: F => {
    const { add, mul } = V(), uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest'), r = 0.022 * F.k;
    F.ball(add(F.P('Neck1'), mul(uc, -0.01 * F.fit.h)), [sd, uc, fc], [0.085 * F.k, 0.035 * F.fit.h, 0.08 * F.k], F.colors.accent, F.sides);
    for (const s of [-1, 1]) {
      const from = add(F.P('Neck1'), add(add(mul(sd, s * 0.045 * F.k), mul(fc, 0.075 * F.k)), mul(uc, -0.03 * F.fit.h)));
      const mid = F.clear(F.swing(`sc${s}a`, add(from, add([0, -0.24 * F.fit.h, 0], mul(fc, 0.02 * F.k))), 140), 1, 0.014 * F.fit.h);
      const end = F.clear(F.swing(`sc${s}b`, add(mid, [0, -0.24 * F.fit.h, 0]), 90), 1, 0.014 * F.fit.h);
      F.tube([from, mid, end], [[0, r * 1.6], [1, r * 1.7], [2, r * 1.5]], [[0, F.colors.accent]], 8, sd, 0.35);
    }
  } },
  // the clarinet's case, by its handle in the right hand: a long dark box
  case: { name: 'футляр', draw: F => {
    const { add, mul } = V(), { at, axes } = hand(F, 'r');
    F.ball(add(at, mul(axes[1], -0.07 * F.fit.h)), axes, [0.045 * F.k, 0.06 * F.fit.h, 0.3 * F.fit.h], LEATHER, 8, 3);
    F.point('case', at);
  } },
  hat_hand: { name: 'шапка в руке', draw: F => {
    const { add, mul } = V(), { at, axes } = hand(F, 'r');
    F.ball(add(at, mul(axes[1], -0.06 * F.fit.h)), axes, [0.11 * F.k, 0.075 * F.fit.h, 0.11 * F.k], C('#4b3c31'), F.sides);
  } },
  clarinet_low: { name: 'кларнет', draw: F => {
    const { add, mul, mean } = V(), c = mean([F.P('RightHand'), F.P('LeftHand')]);
    const top = add(c, [0, 0.16 * F.fit.h, 0]), bot = add(c, add([0, -0.38 * F.fit.h, 0], mul(F.fwd('Hips'), 0.06 * F.k)));
    F.bar(top, bot, 0.013 * F.k, 0.032 * F.k, [[0, BLACK], [0.93, SILVER]], 8, F.side('Hips'));
    F.point('clarinet', c);
  } },
  trumpet: { name: 'труба', draw: F => {
    const { add, mul } = V(), { at, axes } = hand(F, 'r');
    F.bar(add(at, mul(axes[2], -0.14 * F.fit.h)), add(at, add(mul(axes[2], 0.3 * F.fit.h), mul(axes[1], -0.05 * F.fit.h))), 0.012 * F.k, 0.07 * F.k, [[0, BRASS]], 10, axes[0]);
  } },
  tuba: { name: 'туба', draw: F => {
    const { add, mul, mean } = V(), fc = F.fwd('Chest'), uc = F.up('Chest'), sd = F.side('Chest');
    const c = add(mean([F.P('RightHand'), F.P('LeftHand'), F.P('Chest')]), mul(fc, 0.12 * F.k));
    F.ball(c, [sd, uc, fc], [0.17 * F.k, 0.24 * F.fit.h, 0.12 * F.k], BRASS, 14);
    F.bar(add(c, mul(uc, 0.18 * F.fit.h)), add(c, add(mul(uc, 0.42 * F.fit.h), mul(sd, -0.1 * F.k))), 0.05 * F.k, 0.14 * F.k, [[0, BRASS]], 12, fc);
  } },
  drum: { name: 'барабан', draw: F => {
    const { add, mul } = V(), fh = F.fwd('Hips'), uh = F.up('Hips'), sd = F.side('Hips');
    const c = add(F.P('Hips'), add(mul(fh, 0.22 * F.k), mul(uh, 0.12 * F.fit.h)));
    F.ball(c, [sd, uh, fh], [0.12 * F.k, 0.22 * F.fit.h, 0.22 * F.k], C('#5c2120'), 16);
    F.ball(c, [sd, uh, fh], [0.135 * F.k, 0.2 * F.fit.h, 0.2 * F.k], C('#c7c2b4'), 16);
    const { at, axes } = hand(F, 'r');
    F.bar(at, add(at, mul(axes[1], -0.3 * F.fit.h)), 0.01 * F.k, 0.03 * F.k, [[0, LEATHER], [0.85, C('#d9d4c6')]], 6, axes[0]);
  } },
  // the silver snuffbox in the fingers of the right hand
  box_held: { name: 'табакерка', draw: F => {
    const { add, mul } = V(), { at, axes } = hand(F, 'r'), c = add(at, mul(axes[2], 0.03 * F.fit.h));
    F.ball(c, axes, [0.032 * F.k, 0.013 * F.fit.h, 0.042 * F.k], SILVER, 8, 3);
    F.point('box', c);
  } },

  // ── new ──
  // the canvas rucksack on the back, its straps over the shoulders
  rucksack: { name: 'рюкзак', draw: F => {
    const { add, mul } = V(), [c, sd, fw, w, d] = sec(F, 3), uc = F.up('Chest'), m = F.fit.h, k = F.k;
    const bag = add(c, add(mul(fw, -d - 0.085 * k), mul(uc, -0.05 * m)));
    F.ball(bag, [sd, uc, fw], [0.15 * k, 0.21 * m, 0.09 * k], CANVAS, 12, 3);
    F.ball(add(bag, add(mul(uc, 0.14 * m), mul(fw, -0.02 * k))), [sd, uc, fw], [0.155 * k, 0.07 * m, 0.1 * k], CANVAS_D, 12, 3);
    F.ball(add(bag, add(mul(uc, -0.04 * m), mul(fw, -0.09 * k))), [sd, uc, fw], [0.1 * k, 0.08 * m, 0.03 * k], CANVAS_D, 10, 3);
    for (const s of [-1, 1]) {
      const sh = add(c, add(mul(sd, s * w * 0.55), mul(uc, 0.16 * m)));
      F.tube([add(sh, mul(fw, -d * 0.9)), add(sh, mul(uc, 0.012 * m)), add(sh, mul(fw, d * 1.08)), add(c, add(mul(sd, s * w * 0.9), add(mul(fw, d * 0.7), mul(uc, -0.06 * m))))],
        [[0, 0.013 * k], [3, 0.013 * k]], [[0, CANVAS_D]], 4, sd, 0.3);
    }
    F.point('rucksack', bag);
  } },
  // the rucksack on the knees of one sitting, both hands on it
  rucksack_lap: { name: 'рюкзак на коленях', draw: F => lapBag(F, false) },
  // the same after the strap was torn: a knot tied on its strap
  rucksack_lap_torn: { name: 'рюкзак с узлом', draw: F => lapBag(F, true) },
  // a bucket in the right hand, empty / full (water to near its brim)
  bucket: { name: 'ведро', draw: F => bucket(F, false) },
  bucket_full: { name: 'полное ведро', draw: F => bucket(F, true) },
  // a matchbox in the right fist
  matches: { name: 'спички', draw: F => {
    const { add, mul } = V(), { at, axes } = hand(F, 'r'), c = add(at, mul(axes[2], 0.025 * F.fit.h));
    F.ball(c, axes, [0.026 * F.k, 0.018 * F.fit.h, 0.036 * F.k], C('#b5a37a'), 4, 6);
    F.point('matches', c);
  } },
  // an old fibre suitcase in the LEFT hand, its long side along the way he faces
  suitcase: { name: 'чемодан', draw: F => {
    const { add, mul } = V(), m = F.fit.h, at = F.P('LeftHand'), c = add(at, mul(UP, -0.21 * m)), ax = [F.side('Hips'), UP, F.fwd('Hips')];
    F.ball(c, ax, [0.07 * m, 0.19 * m, 0.28 * m], FIBRE, 12, 6);
    F.ball(add(c, mul(UP, 0.12 * m)), ax, [0.072 * m, 0.012 * m, 0.282 * m], C('#3b2f25'), 12, 6);
    F.bar(add(c, mul(UP, 0.19 * m)), at, 0.01 * m, 0.01 * m, [[0, LEATHER]], 5, ax[2]);
    F.point('suitcase', c);
  } },
  // a coat folded over the left forearm, hanging down both sides of it
  coat_arm: { name: 'пальто на руке', draw: F => {
    const { add, mul, mix } = V(), m = F.fit.h, k = F.k, e = F.P('LeftForeArm'), w = F.P('LeftHand'), c = mix(e, w, 0.45), ax = [F.side('LeftForeArm'), UP, F.fwd('Hips')];
    const col = C('#4b4d53');
    F.ball(c, ax, [0.075 * k, 0.045 * m, 0.14 * m], col, 10, 2.4);
    for (const s of [-1, 1]) F.ball(add(c, add(mul(ax[0], s * 0.05 * k), mul(UP, -0.17 * m))), ax, [0.035 * k, 0.17 * m, 0.13 * m], col, 10, 2.6);
    F.point('coat', c);
  } },
  // Бусыгин's coat laid over her shoulders: a long cape of it from the collar to below the knees, the collar up
  coat_over: { name: 'пальто на плечах', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [c, sd, fw, w, d] = sec(F, 4), uc = F.up('Chest'), col = C('#4b4d53');
    const top = add(c, mul(uc, 0.03 * m)), hips = F.P('Hips');
    F.bar(top, add(hips, mul(UP, -0.42 * m)), w * 1.32, w * 1.42, [[0, col]], 18, fw, false, 2.2);
    F.ball(add(F.P('Neck1'), mul(uc, 0.0)), [sd, uc, fw], [w * 0.62, 0.06 * m, d * 1.45], col, 14);
    F.point('coat', add(top, mul(fw, -d)));
  } },
  // a knitted shawl over the shoulders, crossed and tied before the chest, its point down the back
  shawl: { name: 'платок', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [c, sd, fw, w, d] = sec(F, 4), uc = F.up('Chest'), col = C('#8b7562');
    F.bar(add(c, mul(uc, 0.035 * m)), add(c, mul(uc, -0.17 * m)), w * 1.12, w * 1.3, [[0, col]], 16, fw, false, 2.2);
    F.ball(add(c, add(mul(fw, -d * 1.05), mul(uc, -0.2 * m))), [sd, uc, fw], [w * 0.55, 0.13 * m, 0.03 * m], col, 4, 1.2);
    F.ball(add(c, add(mul(fw, d * 1.25), mul(uc, -0.12 * m))), [sd, uc, fw], [0.035 * m, 0.03 * m, 0.03 * m], col.map((v, i) => (i < 3 ? v * 0.85 : v)), 8);
    F.point('shawl', add(c, mul(fw, -d)));
  } },
  // a faceted glass in a metal holder in the right hand, tea in it
  glass_held: { name: 'стакан', draw: F => {
    const { add, mul } = V(), m = F.fit.h, at = F.P('RightHand'), f = F.fwd('RightHand'), c = add(at, add(mul(f, 0.04 * m), mul(UP, 0.03 * m))), ax = [F.side('Hips'), UP, F.fwd('Hips')];
    F.bar(add(c, mul(UP, -0.05 * m)), add(c, mul(UP, 0.055 * m)), 0.03 * m, 0.034 * m, [[0, GLASS]], 8, ax[2]);
    F.bar(add(c, mul(UP, -0.045 * m)), add(c, mul(UP, 0.035 * m)), 0.029 * m, 0.032 * m, [[0, TEA]], 8, ax[2]);
    F.bar(add(c, mul(UP, -0.06 * m)), add(c, mul(UP, -0.01 * m)), 0.035 * m, 0.035 * m, [[0, SILVER]], 10, ax[2]);
    F.point('glass', c);
  } },
  // a kettle in the right hand, hanging by its handle, its spout forward
  kettle: { name: 'чайник', draw: F => {
    const { add, mul } = V(), m = F.fit.h, at = F.P('RightHand'), ax = [F.side('Hips'), UP, F.fwd('Hips')], c = add(at, mul(UP, -0.12 * m));
    F.ball(c, ax, [0.095 * m, 0.08 * m, 0.095 * m], ENAMEL, 14);
    F.ball(add(c, mul(UP, 0.07 * m)), ax, [0.04 * m, 0.02 * m, 0.04 * m], ENAMEL, 10);
    F.bar(add(c, mul(ax[2], 0.07 * m)), add(c, add(mul(ax[2], 0.17 * m), mul(UP, 0.07 * m))), 0.016 * m, 0.008 * m, [[0, ENAMEL]], 6, ax[0]);
    F.bar(add(c, add(mul(ax[2], -0.06 * m), mul(UP, 0.06 * m))), at, 0.006 * m, 0.006 * m, [[0, C('#2a2a2c')]], 4, ax[0]);
    F.bar(at, add(c, add(mul(ax[2], 0.06 * m), mul(UP, 0.06 * m))), 0.006 * m, 0.006 * m, [[0, C('#2a2a2c')]], 4, ax[0]);
    F.point('kettle', c);
  } },
  // a sheet of music in the right hand
  sheet: { name: 'нотный лист', draw: F => inHand(F, 0.1, 0.13, PAPER, 'sheet') },
  // the left sleeve burnt: black, ragged, from the elbow to the wrist
  burnt_sleeve: { name: 'обгоревший рукав', draw: F => {
    const { mix } = V(), k = F.k, a = F.P('LeftArm'), e = F.P('LeftForeArm'), w = F.P('LeftHand');
    F.tube([mix(a, e, 0.55), e, mix(e, w, 0.5), mix(e, w, 0.88)], [[0, 0.045 * k], [1, 0.044 * k], [2, 0.04 * k], [3, 0.033 * k]], [[0, CHAR], [2, EMBER], [3, CHAR]], 7, F.side('LeftForeArm'));
  } },
  // snow on the back and down the skirts of the coat (one who lay in the snow)
  snow_back: { name: 'снег на спине', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [c, sd, fw, w, d] = sec(F, 3), uc = F.up('Chest'), [ch, sh, fh, wh, dh] = sec(F, 1);
    F.ball(add(c, mul(fw, -d * 1.05)), [sd, uc, fw], [w * 0.8, 0.14 * m, 0.022 * m], SNOW, 8, 1.5);
    F.ball(add(ch, add(mul(fh, -dh * 1.2), mul(UP, -0.12 * m))), [sh, UP, fh], [wh * 0.9, 0.12 * m, 0.022 * m], SNOW, 8, 1.5);
  } },
  // Сарафанов's best: a white shirt's front and a dark tie in the open jacket
  tie: { name: 'галстук', draw: F => {
    const { add, mul } = V(), m = F.fit.h, { top, bot } = front(F, 0.36, C('#e8e4da'), 2, 1.05), [c, sd, fw, w, d] = sec(F, 4);
    F.bar(add(top, mul(fw, 0.012 * m)), add(bot, mul(fw, 0.012 * m)), 0.016 * m, 0.03 * m, [[0, C('#3a2b2e')]], 4, fw, true);
  } },
  // Кудимов's belt over the tunic: leather round the waist, a brass buckle
  belt: { name: 'ремень', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [c, sd, fw, w, d] = sec(F, 2), uh = F.up('Spine1');
    F.ball(c, [sd, uh, fw], [w * 1.08, 0.024 * m, d * 1.12], LEATHER, 16, 3);
    F.ball(add(c, mul(fw, d * 1.12)), [sd, uh, fw], [0.03 * m, 0.024 * m, 0.008 * m], BRASS, 4, 4);
  } },
};
function lapBag(F, torn) {
  const { add, mul, mix } = V(), m = F.fit.h, k = F.k, fh = F.fwd('Hips'), sd = F.side('Hips');
  const c = add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), add(mul(UP, -0.03 * m), mul(fh, 0.02 * m)));
  F.ball(c, [sd, UP, fh], [0.16 * k, 0.1 * m, 0.13 * k], CANVAS, 12, 3);
  F.ball(add(c, add(mul(UP, 0.07 * m), mul(fh, -0.03 * m))), [sd, UP, fh], [0.165 * k, 0.04 * m, 0.1 * k], CANVAS_D, 12, 3);
  const st = add(c, mul(sd, 0.12 * k));
  F.tube([add(st, mul(UP, 0.06 * m)), add(st, add(mul(UP, 0.16 * m), mul(fh, -0.06 * m))), add(st, add(mul(UP, 0.06 * m), mul(fh, -0.12 * m)))], [[0, 0.012 * k], [2, 0.012 * k]], [[0, CANVAS_D]], 4, sd, 0.3);
  if (torn) F.ball(add(st, add(mul(UP, 0.15 * m), mul(fh, -0.06 * m))), [sd, UP, fh], [0.024 * m, 0.022 * m, 0.024 * m], CANVAS_D, 8);
  F.point('rucksack', c);
}
function bucket(F, full) {
  const { add, mul } = V(), m = F.fit.h, at = F.P('RightHand'), ax = [F.side('Hips'), UP, F.fwd('Hips')], c = add(at, mul(UP, -0.2 * m));
  F.bar(add(c, mul(UP, -0.13 * m)), add(c, mul(UP, 0.12 * m)), 0.1 * m, 0.13 * m, [[0, C('#7c8288')]], 14, ax[2]);
  F.ball(add(c, mul(UP, 0.12 * m)), ax, [0.13 * m, 0.008 * m, 0.13 * m], C('#5c6268'), 14);
  if (full) F.ball(add(c, mul(UP, 0.105 * m)), ax, [0.12 * m, 0.006 * m, 0.12 * m], WATER, 14);
  F.tube([add(c, add(mul(ax[0], -0.13 * m), mul(UP, 0.12 * m))), add(at, mul(UP, 0.0)), add(c, add(mul(ax[0], 0.13 * m), mul(UP, 0.12 * m)))], [[0, 0.004 * m], [2, 0.004 * m]], [[0, C('#2c2c2e')]], 4, ax[2]);
  F.point('bucket', c);
}

// ── the people ─────────────────────────────────────────────────────────
const C_BUS = { skin: '#dcb497', hair: '#26201c', garment: '#4f525a', top: '#4f525a', bottom: '#2c2d33', shoes: '#1f1d1e', accent: '#ddd6c6' };
const C_SIL = { skin: '#ddb293', hair: '#2e2018', garment: '#7a5538', top: '#7a5538', bottom: '#30292a', shoes: '#211b17', hat: '#3d332c', accent: '#b0563c' };
const C_SAR = { skin: '#d8ad90', hair: '#c4bfb7', garment: '#433f3d', top: '#433f3d', bottom: '#2a2827', shoes: '#1d1b1a', hat: '#4f4034', accent: '#dcd6c8' };
const C_VAS = { skin: '#e0ba9e', hair: '#5e4433', garment: '#3e4438', top: '#8f8a80', bottom: '#2e2e30', shoes: '#211f1d' };
const C_KUD = { skin: '#dbb194', hair: '#3a2c22', garment: '#55594a', top: '#55594a', bottom: '#33352d', shoes: '#191817', hat: '#4a4038' };
const look = (who, more) => ({ kind: 'shapes', style: 'zima', who, line: false, ...more });
const ids = ['busygin', 'busygin_shirt', 'silva', 'silva_shirt', 'silva_burnt', 'sarafanov', 'sarafanov_hat', 'sarafanov_nohat',
  'sarafanov_home', 'sarafanov_best', 'sarafanov_funeral', 'nina', 'nina_home', 'vasenka', 'vasenka_home', 'kudimov', 'kudimov_in',
  'makarskaya', 'neighbor1', 'neighbor2', 'band1', 'band2', 'band3', 'mourner1', 'mourner2', 'mourner3', 'mourner4'];

return {
  ...(data || {}),
  characters: Object.fromEntries(ids.map(id => [id, look(id)])),
  shapes: {
    // the world's style: `shadow`'s slender trunk and fingered hands, a bigger head on a shorter neck, fuller limbs;
    // painted lit (colours under the scene's light, shade on the far side), no lines, the face `simple`
    styles: { zima: { from: 'shadow', name: 'зима', head: 1.3, egg: [0.88, 1.1, 0.98], neck: 0.6, legs: 1.05, limb: 1.0, feet: 'bean', paint: 'toned', line: 0, face: 'simple' } },
    characters: {
      busygin: { from: 'man', name: 'Бусыгин', body: { height: 1.04, shoulders: 1.08, thick: 1.0 },
        garment: 'long_coat', hair: 'short', hat: 'none', scarf: true, face: 'f_plain', colors: C_BUS },
      busygin_shirt: { from: 'busygin', name: 'Бусыгин дома', garment: 'sweater', scarf: false, parts: ['collar'],
        colors: { ...C_BUS, top: '#323846', garment: '#323846', accent: '#e2ddd1' } },
      silva: { from: 'man', name: 'Сильва', body: { height: 0.99, shoulders: 1.08, thick: 1.18 },
        garment: 'check_coat', hair: 'short', hat: 'hat_aside', scarf: true, face: 'f_silva', colors: C_SIL },
      silva_shirt: { from: 'silva', name: 'Сильва дома', garment: 'jacket', hat: 'none', scarf: false, parts: ['collar'],
        colors: { ...C_SIL, garment: '#5d4838', top: '#5d4838', accent: '#d8cfbd' } },
      silva_burnt: { from: 'silva', name: 'Сильва после пожара', parts: ['burnt_sleeve'], colors: C_SIL },
      sarafanov: { from: 'old', name: 'Сарафанов', body: { height: 0.92, shoulders: 0.94, thick: 0.86 },
        garment: 'old_coat', hair: 'short', hat: 'fur_hat', scarf: false, face: 'f_sarafanov', parts: ['long_scarf'], colors: C_SAR },
      sarafanov_hat: { from: 'sarafanov', name: 'Сарафанов с шапкой в руке', hat: 'none', parts: ['long_scarf', 'hat_hand'], colors: C_SAR },
      sarafanov_nohat: { from: 'sarafanov', name: 'Сарафанов без шапки', garment: 'old_coat_open', hat: 'none', parts: ['long_scarf'],
        colors: { ...C_SAR, top: '#6e4f37' } },
      sarafanov_home: { from: 'sarafanov', name: 'Сарафанов дома', garment: 'cardigan', hat: 'none', parts: ['collar'],
        colors: { ...C_SAR, garment: '#6e4f37', top: '#6e4f37', accent: '#d9d2c2' } },
      sarafanov_best: { from: 'sarafanov', name: 'Сарафанов в выходном', garment: 'jacket', hat: 'none', parts: ['tie'],
        colors: { ...C_SAR, garment: '#2b2a30', top: '#2b2a30', bottom: '#26252a' } },
      sarafanov_funeral: { from: 'sarafanov', name: 'Сарафанов на похоронах', parts: ['long_scarf', 'clarinet_low'],
        colors: { ...C_SAR, garment: '#1f1e22', top: '#1f1e22', hat: '#2c2725', accent: '#e4dfd4' } },
      nina: { from: 'woman', name: 'Нина', body: { height: 0.95, shoulders: 0.88, hips: 1.04, thick: 0.86 },
        garment: 'fur_coat', hair: 'braid', hat: 'none', scarf: false, face: 'f_nina', parts: ['fur_collar'],
        colors: { skin: '#e6c2a5', hair: '#4a2c1d', garment: '#5f4040', top: '#5f4040', bottom: '#2e292b', shoes: '#231c1b', accent: '#8f7a66' } },
      nina_home: { from: 'nina', name: 'Нина дома', garment: 'dress', parts: [],
        colors: { skin: '#e6c2a5', hair: '#4a2c1d', garment: '#3c3140', top: '#3c3140', bottom: '#2e292b', shoes: '#231c1b', accent: '#8f7a66' } },
      vasenka: { from: 'youth', name: 'Васенька', body: { height: 1.01, shoulders: 0.94, thick: 0.8, arms: 1.04, legs: 1.03 },
        garment: 'telogreika', hair: 'vihry', hat: 'none', scarf: false, face: 'f_plain', colors: C_VAS },
      vasenka_home: { from: 'vasenka', name: 'Васенька дома', garment: 'sweater', colors: { ...C_VAS, garment: '#7b7c7e', top: '#7b7c7e' } },
      kudimov: { from: 'man', name: 'Кудимов', body: { height: 1.02, shoulders: 1.16, thick: 1.04 },
        garment: 'shinel', hair: 'short', hat: 'ushanka_star', scarf: false, face: 'f_kudimov', colors: C_KUD },
      kudimov_in: { from: 'kudimov', name: 'Кудимов в доме', garment: 'gimnastyorka', hat: 'none', parts: ['belt'],
        colors: { ...C_KUD, garment: '#68694e', top: '#68694e' } },
      makarskaya: { from: 'woman', name: 'Макарская', body: { height: 0.97, shoulders: 0.9, hips: 1.06, thick: 0.9 },
        garment: 'coat', hair: 'bun', hat: 'kerchief', scarf: false, face: 'f_plain',
        colors: { skin: '#e3bc9e', hair: '#3a2219', garment: '#8c3d2c', top: '#8c3d2c', bottom: '#241b19', shoes: '#1d1716', hat: '#b49a6a' } },
      neighbor1: { from: 'man', name: 'Сосед', body: { height: 0.98, thick: 1.06 }, garment: 'telogreika_shut', hair: 'short', hat: 'ushanka', face: 'f_plain',
        colors: { skin: '#d6a98a', hair: '#3a3029', garment: '#3c4038', top: '#3c4038', bottom: '#2b2a2a', shoes: '#1c1a19', hat: '#4a4038' } },
      neighbor2: { from: 'woman', name: 'Соседка', body: { height: 0.92, thick: 1.08 }, garment: 'tulup', hair: 'bun', hat: 'kerchief', face: 'f_plain',
        colors: { skin: '#dcb193', hair: '#4a3a30', garment: '#75604a', top: '#75604a', bottom: '#2b2622', shoes: '#1c1a19', hat: '#5c4f55' } },
      band1: { from: 'man', name: 'Трубач', body: { height: 1.0, thick: 1.05 }, garment: 'coat', hair: 'short', hat: 'fur_hat', scarf: false, face: 'f_plain', parts: ['trumpet'],
        colors: { skin: '#d6a98a', garment: '#1e1d20', top: '#1e1d20', bottom: '#1a191b', hat: '#252226', shoes: '#141313' } },
      band2: { from: 'man', name: 'Тубист', body: { height: 1.02, thick: 1.25 }, garment: 'coat', hair: 'short', hat: 'fur_hat', scarf: false, face: 'f_plain', parts: ['tuba'],
        colors: { skin: '#d9ab8c', garment: '#211f23', top: '#211f23', bottom: '#1a191b', hat: '#28252a', shoes: '#141313' } },
      band3: { from: 'man', name: 'Барабанщик', body: { height: 0.98, thick: 1.1 }, garment: 'coat', hair: 'short', hat: 'cap', scarf: false, face: 'f_plain', parts: ['drum'],
        colors: { skin: '#d3a587', garment: '#1f1e21', top: '#1f1e21', bottom: '#1a191b', hat: '#1d1c1e', shoes: '#141313' } },
      mourner1: { from: 'woman', name: 'Провожающая', body: { height: 0.92, thick: 0.95 }, garment: 'coat', hair: 'bun', hat: 'kerchief', face: 'f_plain',
        colors: { skin: '#dcb193', garment: '#2c282a', top: '#2c282a', hat: '#3d363a', bottom: '#211e1f' } },
      mourner2: { from: 'woman', name: 'Старуха в тулупе', body: { height: 0.86, thick: 1.12, shoulders: 0.92 }, garment: 'tulup', hair: 'bun', hat: 'kerchief', face: 'f_old',
        colors: { skin: '#d4a88c', hair: '#c4bfb7', garment: '#6e5a45', top: '#6e5a45', hat: '#4c4648', bottom: '#2b2521' } },
      mourner3: { from: 'man', name: 'Провожающий', body: { height: 0.97, thick: 1.0 }, garment: 'coat', hair: 'short', hat: 'cap', face: 'f_plain',
        colors: { skin: '#d6a98a', garment: '#2b2b2e', top: '#2b2b2e', hat: '#252428', bottom: '#1e1d1f' } },
      mourner4: { from: 'woman', name: 'Провожающая', body: { height: 0.9, thick: 0.9 }, garment: 'coat', hair: 'bun', hat: 'kerchief', face: 'f_plain',
        colors: { skin: '#dfb698', garment: '#322c2c', top: '#322c2c', hat: '#5c4d50', bottom: '#211e1f' } },
    },
    faces: {
      f_plain: face('простое'),
      f_old: face('старое', { lines: true }),
      f_sarafanov: face('Сарафанов', { lines: true, brow: '#d4cfc6' }),
      f_nina: face('Нина', { straight: 0.75 }),
      f_silva: face('Сильва', { moustache: true }),
      f_kudimov: face('Кудимов', { chin: true }),
    },
    garments: {
      long_coat: { name: 'длинное пальто', hang: [{ to: 1.32, from: 'shoulders', flare: 0.15, ragged: false }], sleeves: 'garment' },
      fur_coat: { name: 'пальто', hang: [{ to: 1.22, from: 'shoulders', flare: 0.3, ragged: false }], sleeves: 'garment' },
      check_coat: { name: 'пальто в клетку', hang: [{ to: 1.08, from: 'shoulders', flare: 0.2, ragged: false }], sleeves: 'garment',
        draw: F => { // the check: a few lighter bands round the coat over the chest and the waist
          const { add, mul } = V(), lite = F.colors.garment.map((v, i) => (i < 3 ? Math.min(1, v * 1.35) : v));
          for (const [i, y] of [[3, -0.02], [2, 0.0]]) { const [c, sd, fw, w, d] = sec(F, i); F.ball(add(c, mul(F.up('Chest'), y * F.fit.h)), [sd, F.up('Chest'), fw], [w * 1.03, 0.006 * F.fit.h, d * 1.06], lite, 16, 2.4); }
        } },
      old_coat: { name: 'старое пальто', hang: [{ to: 1.18, from: 'shoulders', flare: 0.16, ragged: true }], sleeves: 'garment' },
      old_coat_open: { name: 'пальто нараспашку', hang: [{ to: 1.18, from: 'shoulders', flare: 0.2, ragged: true }], sleeves: 'garment',
        draw: F => { front(F, 0.4, F.colors.top); } },
      shinel: { name: 'шинель', hang: [{ to: 1.42, from: 'shoulders', flare: 0.22, ragged: false }], sleeves: 'garment',
        draw: F => { // two rows of brass buttons
          const { add, mul } = V(), [c, sd, fw, w, d] = sec(F, 3), uc = F.up('Chest');
          for (const s of [-1, 1]) for (const y of [0.06, -0.04, -0.14]) F.ball(add(c, add(mul(sd, s * w * 0.32), add(mul(fw, d * 1.08), mul(uc, y * F.fit.h)))), [sd, uc, fw], [0.012 * F.fit.h, 0.012 * F.fit.h, 0.006 * F.fit.h], BRASS, 6);
        } },
      gimnastyorka: { name: 'гимнастёрка', hang: [{ to: 0.3, from: 'shoulders', flare: 0.06, folds: false }], sleeves: 'garment' },
      tulup: { name: 'тулуп', hang: [{ to: 1.2, from: 'shoulders', flare: 0.34, ragged: false }], sleeves: 'garment' },
      telogreika: { name: 'телогрейка нараспашку', hang: [{ to: 0.55, from: 'shoulders', flare: 0.18, folds: false }], sleeves: 'garment',
        draw: F => { front(F, 0.42, F.colors.top); } },
      telogreika_shut: { name: 'телогрейка', hang: [{ to: 0.55, from: 'shoulders', flare: 0.14, folds: false }], sleeves: 'garment' },
      cardigan: { name: 'вязаная кофта', hang: [{ to: 0.5, from: 'shoulders', flare: 0.08, folds: false }], sleeves: 'garment' },
      sweater: { name: 'свитер', hang: [{ to: 0.32, from: 'shoulders', flare: 0.05, folds: false }], sleeves: 'garment' },
    },
    hair: {
      braid: { name: 'коса', draw: F => {
        const { add, mul } = V();
        hairCap(F, 1.03);
        const { at: head, axes: [hs, hu, hf], r: rh } = F.head, fc = F.fwd('Chest');
        const from = add(head, add(mul(hf, -rh * 0.88), mul(hu, -rh * 0.3)));
        const mid = F.clear(F.swing('braid1', add(from, add([0, -0.2 * F.fit.h, 0], mul(fc, -0.05 * F.k))), 150), -1, rh * 0.28);
        const end = F.clear(F.swing('braid2', add(mid, [0, -0.21 * F.fit.h, 0]), 80), -1, rh * 0.22);
        F.tube([from, mid, end], [[0, rh * 0.32], [0.6, rh * 0.28], [1.6, rh * 0.2], [1.9, rh * 0.24], [2, 0.004]], [[0, F.colors.hair]], 10, hs, 0.85);
      } },
      // Васенька's: short hair standing up, tufts falling on the forehead
      vihry: { name: 'вихры', draw: F => {
        MooodShapes.HAIR.spiky.draw(F);
        const { on, axes, r: rh } = F.head;
        for (const [x, l] of [[-0.3, 0.16], [-0.08, 0.2], [0.16, 0.17], [0.36, 0.12]]) {
          F.tube([on([x, 0.72, 0.6], 1.06), on([x * 1.05, 0.62, 0.8], 1.07), on([x * 1.1 + 0.04, 0.62 - l, 0.9], 1.05)], [[0, rh * 0.09], [2, rh * 0.02]], [[0, F.colors.hair]], 6, axes[0]);
        }
      } },
    },
    hats: {
      fur_hat: { name: 'меховая шапка', draw: furHat(false, false) },
      ushanka: { name: 'ушанка', draw: furHat(true, false) },
      ushanka_star: { name: 'ушанка со звездой', draw: furHat(true, true) },
      // a hat tipped aside (Сильва's): a brim and a crown, leant to his right
      hat_aside: { name: 'шляпа набок', draw: F => {
        const { add, mul, unit, cross } = V();
        const { at: head, axes: [hs, hu, hf], r: rh } = F.head;
        const tilt = unit(add(add(hu, mul(hs, 0.2)), mul(hf, 0.06))), axes = [unit(cross(tilt, hf)), tilt, hf];
        F.ball(add(head, add(mul(hu, rh * 0.48), mul(hs, rh * 0.06))), axes, [rh * 1.6, rh * 0.06, rh * 1.5], F.colors.hat, F.sides * 2);
        F.ball(add(head, add(mul(hu, rh * 0.72), mul(hs, rh * 0.12))), axes, [rh * 0.86, rh * 0.48, rh * 0.84], F.colors.hat, F.sides, 3);
      } },
      // a kerchief over the head, tied under the chin: the head covered over the top and behind, the face open
      kerchief: { name: 'платок', draw: F => {
        const { add, mul } = V(), h = F.head;
        F.cap(h.at, h.axes, h.egg.map(v => v * h.r * h.out * 1.1), [0, 0.42, -0.9], -0.42, F.colors.hat, h.sides, h.square);
        F.ball(add(h.at, add(mul(h.axes[2], -h.r * 0.8), mul(h.axes[1], -h.r * 0.75))), h.axes, [h.r * 0.45, h.r * 0.45, h.r * 0.32], F.colors.hat, F.sides);
      } },
    },
    parts,
  },
};
