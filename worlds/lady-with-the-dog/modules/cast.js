// The people of “The Lady with the Dog” as people in a scene (the engine's people: an element with "person"): who
// they are — figures of shapes in the world's style `dama` (from the engine's `soft`: a little longer, a head big
// enough for the face `simple` — eyes, brows, nose, mouth, an expression by `<id>_mood` — to read), faded colours
// (white, grey-blue, sand, graphite); what they carry (the parts, with their named points: "anna#lorgnette",
// "gurov#watch"); how they move — the motions in cast.data.json (Kimodo's, put there with put_motion). cast.md says who
// is who, every part and motion.
// A part's lengths are a man's metres times F.fit.h (the person's height as a share of a man's 1.76 m).
// A look changed on a cut: `<id>_wear` = the look object (scene.kit.cast.characters.gurov_winter), never its name.
const V = () => MooodShapes.V;
const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255);
const C = (s, k = 1) => [...hex(s), k]; // k 2: it glows (a lantern's glass)
const UP = [0, 1, 0], AX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const PAPER = C('#ece6d6'), DARK = C('#2a2a30'), BROWN = C('#5b4a3c'), LEATHER = C('#4a3a30'), SILVER = C('#c9c6bd'),
  BRASS = C('#c2a25a'), GRAPHITE = C('#3a3c42');

// the joint's axes: across, up, forward
const axesOf = (F, j) => [F.side(j), F.up(j), F.fwd(j)];
// between the two hands, a little up; and the axes of a flat thing held there turned to the eyes
function held(F, lift = 0.03) {
  const { add, mix, unit, sub, cross } = V(), m = F.fit.h;
  const c = add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), [0, lift * m, 0]);
  const n = unit(sub(F.P('Head'), c)), x = unit(cross(UP, n)), y = cross(n, x);
  return { c, axes: [x, y, n] };
}
// a flat sheet in the right hand's fingers (a note, an envelope), turned to the eyes; its point
function sheetInHand(F, w, h, colour, name) {
  const { add, mul, unit, sub, cross } = V(), m = F.fit.h, hand = F.P('RightHand'), f = F.fwd('RightHand');
  const c = add(hand, mul(f, 0.05 * m)), n = unit(sub(F.P('Head'), c)), x = unit(cross(UP, n)), y = cross(n, x);
  F.ball(c, [x, y, n], [w * m, h * m, 0.002 * m], colour, 4, 8);
  F.point(name, c);
}
// a point on the head: across, up, forward of its radius (as the face's own)
function onHead(F, s, u, f) {
  const { add, mul } = V(), h = F.head, [hs, hu, hf] = h.axes, R = h.r * h.out;
  return add(h.at, add(mul(hs, s * R), add(mul(hu, u * R), mul(hf, f * R))));
}

// ── faces: the engine's `simple`, with straight brows (the wife's) ──
// (the expressions as the engine's simple face has them: brows' inner/outer ends, eyes, the mouth)
const EXPRESSIONS = {
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
const level = { name: 'plain, straight brows', draw: F => {
  const { axes, r: rh, on } = F.head, [, hu] = axes, dark = [0.17, 0.14, 0.13], brow = F.colors.hair.map(v => v * 0.7);
  const x = EXPRESSIONS[F.look.expression] ?? EXPRESSIONS.neutral, lips = F.colors.skin.map(v => v * 0.72);
  for (const sx of [-1, 1]) {
    F.ball(on([sx * 0.33, 0.08, 0.94], 0.985), axes, [rh * 0.07, rh * 0.085 * x.eye, rh * 0.04], dark, 10);
    // straight, a little heavier: the ends level with the middle (moved as the expression moves them)
    F.tube([on([sx * 0.15, 0.31 + x.inner, 0.93], 0.995), on([sx * 0.3, 0.31 + (x.inner + x.outer) / 2, 0.9], 1.0), on([sx * 0.46, 0.31 + x.outer, 0.84], 0.995)],
      [[0, rh * 0.034], [1, rh * 0.034], [2, rh * 0.026]], [[0, brow]], 6, hu);
  }
  F.ball(on([0, -0.1, 1], 0.97), axes, [rh * 0.085, rh * 0.12, rh * 0.11], F.colors.skin.map(v => v * 0.97), 10);
  const w = x.wide, y = -0.37;
  F.ball(on([0, y - x.open / 2, 0.95], 0.975), axes, [rh * w * 0.75, rh * x.open, rh * 0.03], dark, 10);
  F.tube([on([-w, y + x.corners, 0.93], 0.995), on([0, y, 0.94], 1.0), on([w, y + x.corners, 0.93], 0.995)], [[0, rh * 0.016], [2, rh * 0.016]], [[0, lips]], 6, hu);
} };

// ── hats ──
const hats = {
  // a beret: a soft flat disc on the crown, tilted a little to one side
  beret: { name: 'béret', draw: F => {
    const { add, mul, unit, cross } = V(), { at: head, axes: [hs, hu], r: rh } = F.head;
    const tilt = unit(add(hu, mul(hs, 0.22))), fwd = unit(cross(hs, tilt)), axes = [unit(cross(tilt, fwd)), tilt, fwd];
    F.ball(add(head, add(mul(hu, rh * 0.66), mul(hs, rh * 0.1))), axes, [rh * 1.14, rh * 0.3, rh * 1.08], F.colors.hat, F.sides);
  } },
  // a small travelling hat: a low round crown on a narrow brim, set high on the head
  toque: { name: 'toque', draw: F => {
    const { add, mul } = V(), { at: head, axes, r: rh } = F.head, [, hu] = axes;
    F.ball(add(head, mul(hu, rh * 0.62)), axes, [rh * 1.18, rh * 0.12, rh * 1.15], F.colors.hat, F.sides);
    F.ball(add(head, mul(hu, rh * 0.86)), axes, [rh * 0.78, rh * 0.36, rh * 0.76], F.colors.hat, F.sides);
  } },
  // a straw boater: a flat-topped low crown, a dark band, a flat brim
  boater: { name: 'boater', draw: F => {
    const { add, mul } = V(), { at: head, axes, r: rh } = F.head, [, hu] = axes;
    F.ball(add(head, mul(hu, rh * 0.6)), axes, [rh * 1.66, rh * 0.06, rh * 1.64], F.colors.hat, F.sides * 2);
    F.ball(add(head, mul(hu, rh * 0.92)), axes, [rh * 1.0, rh * 0.32, rh * 0.98], F.colors.hat, F.sides, 3.2);
    F.ball(add(head, mul(hu, rh * 0.74)), axes, [rh * 1.02, rh * 0.1, rh * 1.0], GRAPHITE, F.sides, 3.2);
  } },
  // a tall round fur hat (a man's, winter)
  fur_hat: { name: 'fur hat', draw: F => {
    const { add, mul } = V(), { at: head, axes, r: rh } = F.head, [, hu] = axes;
    F.ball(add(head, mul(hu, rh * 0.84)), axes, [rh * 1.16, rh * 0.62, rh * 1.14], F.colors.hat, F.sides, 2.8);
  } },
  // a small round fur cap (a woman's, winter), high on the head
  fur_cap: { name: 'fur cap', draw: F => {
    const { add, mul } = V(), { at: head, axes, r: rh } = F.head, [, hu, hf] = axes;
    F.ball(add(head, add(mul(hu, rh * 0.68), mul(hf, -rh * 0.08))), axes, [rh * 1.1, rh * 0.42, rh * 1.08], F.colors.hat, F.sides, 2.4);
  } },
  // a girl's bonnet: round the crown and the back of the head, a brim framing the face
  capor: { name: 'capote', draw: F => {
    const { add, mul, unit, cross } = V(), { at: head, axes, egg, r: rh, out, sides, square } = F.head, [hs, hu, hf] = axes;
    F.cap(head, axes, egg.map(e => e * rh * out * 1.14), [0, 0.45, -0.89], -0.1, F.colors.hat, sides, square);
    const tilt = unit(add(hu, mul(hf, 0.9))), axes2 = [hs, tilt, cross(hs, tilt)];
    F.ball(add(head, add(mul(hu, rh * 0.62), mul(hf, rh * 0.42))), axes2, [rh * 1.2, rh * 0.07, rh * 0.62], F.colors.hat, F.sides);
  } },
  // a headscarf over the hair, tied at the nape
  kerchief: { name: 'kerchief', draw: F => {
    const { add, mul } = V(), { at, axes, egg, r, out, sides, square } = F.head, [, hu, hf] = axes;
    F.cap(at, axes, egg.map(e => e * r * out * 1.08), [0, 0.7, -0.72], -0.05, F.colors.hat, sides, square);
    F.ball(add(at, add(mul(hu, -r * 0.45), mul(hf, -r * 1.02))), axes, [r * 0.22, r * 0.16, r * 0.14], F.colors.hat, 10);
  } },
  // a peaked cap with a cockade: the engine's cap and a small bright badge over the peak
  cap_cockade: { name: 'peaked cap with a cockade', draw: F => {
    MooodShapes.HATS.cap.draw(F);
    const { add, mul } = V(), { at: head, axes, r: rh } = F.head, [, hu, hf] = axes;
    F.ball(add(head, add(mul(hu, rh * 0.62), mul(hf, rh * 0.98))), axes, [rh * 0.12, rh * 0.1, rh * 0.05], BRASS, 8);
  } },
};

// ── parts: what is on the face and the body, what is in the hands ──
const parts = {
  // a thick moustache under the nose (the hair's colour)
  moustache: { name: 'moustache', draw: F => {
    const { add, mul } = V(), h = F.head, [, hu, hf] = h.axes, r = h.r * h.out;
    F.ball(add(h.at, add(mul(hu, -r * 0.24), mul(hf, r * 0.95))), h.axes, [r * 0.36, r * 0.085, r * 0.09], F.colors.hair, 10);
  } },
  // small side-whiskers down the cheeks (the hair's colour)
  sideburns: { name: 'side-whiskers', draw: F => {
    for (const s of [-1, 1]) F.ball(onHead(F, s * 0.86, -0.22, 0.28), F.head.axes, [F.head.r * 0.16, F.head.r * 0.34, F.head.r * 0.22], F.colors.hair, 10);
  } },
  // a pince-nez: two thin dark rims over the eyes, a bridge between, a cord down to the chest
  pince_nez: { name: 'pince-nez', draw: F => {
    const h = F.head, rh = h.r, hu = h.axes[1];
    for (const s of [-1, 1]) {
      const ring = [];
      for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI * 2; ring.push(h.on([s * 0.33 + 0.13 * Math.cos(a), 0.08 + 0.12 * Math.sin(a), 0.94], 1.04)); }
      F.tube(ring, [[0, rh * 0.014], [8, rh * 0.014]], [[0, DARK]], 5, hu);
    }
    F.tube([h.on([-0.2, 0.1, 0.98], 1.05), h.on([0, 0.13, 1], 1.06), h.on([0.2, 0.1, 0.98], 1.05)], [[0, rh * 0.012], [2, rh * 0.012]], [[0, DARK]], 5, hu);
  } },
  // the small scholarly badge on the breast of his tail coat: a glint (its point: "diderits#badge")
  badge: { name: 'badge', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [s, u, f] = axesOf(F, 'Chest');
    const at = add(F.P('Chest'), add(mul(s, 0.08 * m), add(mul(u, 0.02 * m), mul(f, 0.125 * F.k))));
    F.ball(at, [s, u, f], [0.016 * m, 0.02 * m, 0.008 * m], C('#e3cf8a'), 8);
    F.point('badge', at);
  } },
  // a fur collar round the neck over the coat (the accent's colour)
  fur_collar: { name: 'fur collar', draw: F => {
    const { add, mul } = V(), k = F.k, ax = axesOf(F, 'Chest');
    F.ball(add(F.P('Neck1'), mul(ax[1], -0.035 * F.fit.h)), ax, [0.2 * k, 0.07 * F.fit.h, 0.14 * k], F.colors.accent, 16);
  } },
  // an apron in front of the skirt or the coat (the accent's colour), from the waist to the knees
  apron_front: { name: 'apron', draw: F => {
    const { add, mul } = V(), k = F.k, [s, u, f] = axesOf(F, 'Hips');
    F.ball(add(F.P('Hips'), add(mul(f, 0.15 * k), mul(UP, -0.1 * F.fit.h))), [s, UP, f], [0.17 * k, 0.26 * F.fit.h, 0.03 * k], F.colors.accent, 12, 3);
  } },
  // gloves: dark over both hands
  gloves: { name: 'gloves', draw: F => {
    for (const hn of ['LeftHand', 'RightHand']) {
      const { add, mul } = V(), [s, u, f] = axesOf(F, hn);
      F.ball(add(F.P(hn), mul(u, 0.035 * F.fit.h)), [s, u, f], [0.034 * F.k, 0.052 * F.fit.h, 0.03 * F.k], C('#36343a'), 10);
    }
  } },
  // the white spitz held in both arms at the chest: a simple white bundle, the ears and the muzzle just told
  spitz_held: { name: 'Pomeranian in her arms', draw: F => {
    const { add, mul, mix, unit } = V(), m = F.fit.h;
    const a = F.P('LeftHand'), b = F.P('RightHand'), f = unit(add(F.fwd('LeftHand'), F.fwd('RightHand')));
    const c = add(add(mix(a, b, 0.5), mul(UP, 0.07 * m)), mul(f, 0.06 * m));
    const ax = axesOf(F, 'Chest'), fur = C('#f6f4ee');
    F.ball(c, ax, [0.17 * m, 0.12 * m, 0.12 * m], fur, 14);
    const head = add(c, add(mul(ax[0], 0.13 * m), mul(ax[1], 0.1 * m)));
    F.ball(head, ax, [0.075 * m, 0.07 * m, 0.07 * m], fur, 12);
    F.ball(add(head, mul(ax[0], 0.07 * m)), ax, [0.04 * m, 0.025 * m, 0.03 * m], fur, 8);
    F.ball(add(head, add(mul(ax[0], 0.11 * m), mul(ax[1], 0.005 * m))), ax, [0.012 * m, 0.012 * m, 0.012 * m], C('#1e1c1c'), 6);
    for (const s of [-1, 1]) F.ball(add(head, add(mul(ax[1], 0.06 * m), mul(ax[2], s * 0.035 * m))), ax, [0.016 * m, 0.022 * m, 0.013 * m], fur, 6);
    F.ball(add(c, add(mul(ax[0], -0.15 * m), mul(ax[1], 0.08 * m))), ax, [0.06 * m, 0.06 * m, 0.06 * m], fur, 10);
    F.point('spitz', head);
  } },
  // a lorgnette in the right hand: a short handle and two small lenses (its point: the lenses, "anna#lorgnette")
  lorgnette: { name: 'lorgnette', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('RightHand'), [s, u, f] = axesOf(F, 'RightHand');
    const top = add(hand, mul(u, 0.09 * m));
    F.bar(add(hand, mul(u, 0.02 * m)), top, 0.006 * m, 0.006 * m, [[0, C('#d9c9a0')]], 5, f);
    const c = add(top, mul(u, 0.02 * m));
    for (const k of [-1, 1]) F.ball(add(c, mul(s, k * 0.022 * m)), [s, u, f], [0.02 * m, 0.016 * m, 0.004 * m], C('#cfd8de'), 10);
    F.point('lorgnette', c);
  } },
  // a light parasol in the right hand: the stick upright from the hand, the canopy over her head
  parasol: { name: 'parasol', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('RightHand'), tip = add(hand, mul(UP, 1.02 * m));
    F.bar(add(hand, mul(UP, -0.08 * m)), add(tip, mul(UP, 0.2 * m)), 0.007 * m, 0.006 * m, [[0, C('#8f8577')]], 5, [1, 0, 0]);
    F.cap(tip, AX, [0.48 * m, 0.2 * m, 0.48 * m], [0, 1, 0], 0, C('#f1ece2'), 18);
    F.point('parasol', add(tip, mul(UP, 0.12 * m)));
  } },
  // the conductor's lantern in his right hand: a dark frame round a glowing glass ("conductor#glass")
  lantern: { name: 'lantern', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('RightHand'), c = add(hand, mul(UP, -0.16 * m));
    F.ball(add(hand, mul(UP, -0.06 * m)), AX, [0.015 * m, 0.04 * m, 0.015 * m], DARK, 6);
    F.ball(c, AX, [0.055 * m, 0.08 * m, 0.055 * m], C('#ffd38a', 2), 10);
    F.ball(add(c, mul(UP, 0.085 * m)), AX, [0.065 * m, 0.02 * m, 0.065 * m], DARK, 10);
    F.point('glass', c);
  } },
  // a white plate with the red slice of watermelon on it, held in both hands before him ("gurov#plate")
  plate: { name: 'plate with a slice', draw: F => {
    const { add, mix, mul, unit } = V(), m = F.fit.h, f = unit(add(F.fwd('LeftHand'), F.fwd('RightHand')));
    const c = add(add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), mul(UP, 0.03 * m)), mul(f, 0.08 * m));
    F.ball(c, AX, [0.12 * m, 0.012 * m, 0.12 * m], C('#f2efe8'), 16);
    F.ball(add(c, mul(UP, 0.03 * m)), AX, [0.08 * m, 0.03 * m, 0.035 * m], C('#b8403a'), 10);
    F.ball(add(c, add(mul(UP, 0.016 * m), [0, 0, -0.03 * m])), AX, [0.085 * m, 0.012 * m, 0.012 * m], C('#3f6a3c'), 8);
    F.point('plate', c);
  } },
  // the waiter's brass tray with the samovar on it, carried in both hands ("waiter#tray")
  tray: { name: 'tray with a samovar', draw: F => {
    const { add, mix, mul, unit } = V(), m = F.fit.h, f = unit(add(F.fwd('LeftHand'), F.fwd('RightHand')));
    const c = add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), mul(f, 0.1 * m));
    F.ball(c, AX, [0.24 * m, 0.012 * m, 0.17 * m], BRASS, 18);
    F.ball(add(c, mul(UP, 0.16 * m)), AX, [0.11 * m, 0.13 * m, 0.11 * m], BRASS, 14);
    F.ball(add(c, mul(UP, 0.32 * m)), AX, [0.045 * m, 0.05 * m, 0.045 * m], BRASS, 10);
    F.ball(add(c, mul(UP, 0.38 * m)), AX, [0.035 * m, 0.03 * m, 0.035 * m], C('#e8e4dc'), 8);
    F.point('tray', c);
  } },
  // a man's coat folded over the left forearm, hanging
  coat_carried: { name: 'coat over the arm', draw: F => {
    const { add, mix, mul, unit, cross } = V(), m = F.fit.h, along = unit([F.fwd('Hips')[0], 0, F.fwd('Hips')[2]]);
    const c = add(mix(F.P('LeftForeArm'), F.P('LeftHand'), 0.5), mul(UP, -0.14 * m)), x = unit(cross(UP, along));
    F.ball(c, [x, UP, along], [0.07 * m, 0.24 * m, 0.13 * m], GRAPHITE, 12, 2.6);
  } },
  // a bunch of white and yellow flowers in the right hand ("p1#bouquet")
  bouquet: { name: 'bouquet', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('RightHand'), [s, u, f] = axesOf(F, 'RightHand');
    F.bar(add(hand, mul(u, -0.06 * m)), add(hand, mul(u, 0.08 * m)), 0.016 * m, 0.022 * m, [[0, C('#6d7a55')]], 6, f);
    const top = add(hand, mul(u, 0.13 * m)), W = C('#f3f0e6'), Y = C('#e6cc6a');
    const at = [[0, 0, 0, W], [0.045, 0.01, 0.01, Y], [-0.045, 0.005, 0.015, W], [0.02, 0.035, -0.02, W], [-0.02, 0.03, 0.03, Y], [0.0, -0.03, 0.04, W], [0.03, -0.02, -0.035, Y]];
    for (const [a, b, c2, col] of at) F.ball(add(top, add(mul(s, a * m), add(mul(u, b * m), mul(f, c2 * m)))), [s, u, f], [0.032 * m, 0.03 * m, 0.032 * m], col, 8);
    F.point('bouquet', top);
  } },
  // a letter held open in both hands at the chest, turned to the eyes ("anna#letter")
  letter_paper: { name: 'letter', draw: F => {
    const { c, axes } = held(F, 0.05), m = F.fit.h;
    F.ball(c, axes, [0.1 * m, 0.13 * m, 0.003 * m], PAPER, 4, 8);
    F.point('letter', c);
  } },
  // a small folded note in the right hand ("gurov#note")
  note: { name: 'note', draw: F => sheetInHand(F, 0.04, 0.05, C('#e4dcc4'), 'note') },
  // the husband's envelope, light, in the right hand ("anna#envelope")
  envelope: { name: 'envelope', draw: F => sheetInHand(F, 0.075, 0.045, C('#efe9dc'), 'envelope') },
  // a suitcase hanging from the right hand, its long side along the way the person faces
  valise: { name: 'valise', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('RightHand'), c = add(hand, mul(UP, -0.2 * m));
    F.ball(c, [F.side('Hips'), UP, F.fwd('Hips')], [0.07 * m, 0.17 * m, 0.27 * m], BROWN, 12, 6);
    F.bar(add(c, mul(UP, 0.17 * m)), hand, 0.01 * m, 0.01 * m, [[0, LEATHER]], 5, F.fwd('Hips'));
  } },
  // a soft travelling bag hanging from the left hand
  bag: { name: 'travelling bag', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('LeftHand'), c = add(hand, mul(UP, -0.13 * m));
    F.ball(c, [F.side('Hips'), UP, F.fwd('Hips')], [0.06 * m, 0.1 * m, 0.15 * m], C('#5d5650'), 12, 3);
    F.bar(add(c, mul(UP, 0.09 * m)), hand, 0.008 * m, 0.008 * m, [[0, LEATHER]], 5, F.fwd('Hips'));
  } },
  // a walking stick in the right hand: from the hand down to the floor
  stick: { name: 'stick', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hand = F.P('RightHand'), fwd = F.fwd('Hips');
    const tip = [hand[0] + fwd[0] * 0.06 * m, Math.max(0.01, hand[1] - 0.92 * m), hand[2] + fwd[2] * 0.06 * m];
    F.bar(hand, tip, 0.012 * m, 0.01 * m, [[0, C('#3a2e26')]], 6, F.side('Hips'));
    F.bar(hand, add(hand, mul(fwd, 0.08 * m)), 0.013 * m, 0.013 * m, [[0, C('#3a2e26')]], 6, UP);
  } },
  // a school satchel on the back
  satchel: { name: 'satchel', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [s, u, f] = axesOf(F, 'Chest');
    F.ball(add(F.P('Chest'), add(mul(f, -0.15 * F.k), mul(u, -0.05 * m))), [s, u, f], [0.12 * m, 0.14 * m, 0.05 * m], C('#4e4136'), 10, 4);
  } },
  // a fur muff between the hands before her (the hat's colour: the fur of her cap)
  muff: { name: 'muff', draw: F => {
    const { add, mix, mul, unit, sub, cross } = V(), m = F.fit.h, a = F.P('LeftHand'), b = F.P('RightHand');
    const c = mix(a, b, 0.5), x = unit(sub(b, a)), f = unit(cross(x, UP)), y = cross(f, x);
    F.ball(c, [x, y, f], [0.11 * m, 0.075 * m, 0.075 * m], F.colors.hat, 14);
    F.point('muff', c);
  } },
  // a parcel from a shop, tied, held at the chest in both hands
  parcel: { name: 'parcel', draw: F => {
    const { c, axes } = held(F, 0.02), m = F.fit.h;
    F.ball(c, axes, [0.1 * m, 0.07 * m, 0.06 * m], C('#cdbd9c'), 6, 4);
    F.ball(c, axes, [0.006 * m, 0.072 * m, 0.062 * m], C('#7d6a52'), 4, 4);
    F.point('parcel', c);
  } },
  // a man's coat over her shoulders: down her back and her arms to the hips, open in front (the accent's colour)
  coat_over: { name: 'coat over the shoulders', draw: F => {
    const { add, mul } = V(), m = F.fit.h, [s, u, f] = axesOf(F, 'Chest'), c = add(F.P('Chest'), mul(u, -0.1 * m)), col = C('#3a3c42');
    for (const k of [-1, 1]) F.ball(add(c, add(mul(s, k * 0.15 * m), mul(f, -0.01 * m))), [s, u, f], [0.12 * m, 0.3 * m, 0.15 * m], col, 12);
    F.ball(add(c, mul(f, -0.07 * m)), [s, u, f], [0.25 * m, 0.3 * m, 0.09 * m], col, 12);
  } },
  // Gurov's pocket watch in the right hand, its face up to the eyes, the chain to the waistcoat ("gurov#watch")
  watch: { name: 'watch', draw: F => {
    const { add, mul, unit, sub, cross } = V(), m = F.fit.h, hand = F.P('RightHand'), f = F.fwd('RightHand');
    const c = add(hand, mul(f, 0.04 * m)), n = unit(sub(F.P('Head'), c)), x = unit(cross(UP, n)), y = cross(n, x);
    F.ball(c, [x, y, n], [0.026 * m, 0.026 * m, 0.008 * m], SILVER, 12);
    F.ball(add(c, mul(n, 0.006 * m)), [x, y, n], [0.02 * m, 0.02 * m, 0.003 * m], C('#f3efe4'), 12);
    const [cs, cu, cf] = axesOf(F, 'Spine1');
    const pocket = add(F.P('Spine1'), add(mul(cs, -0.08 * m), add(mul(cu, 0.04 * m), mul(cf, 0.12 * F.k))));
    F.bar(c, pocket, 0.003 * m, 0.003 * m, [[0, BRASS]], 4, x);
    F.point('watch', c);
  } },
};

// ── the looks ──
const look = (who, more) => Object.assign({ kind: 'shapes', style: 'dama', who }, more);
const man = more => look('man', more), woman = more => look('woman', more);
const GUROV = { height: 1.03, thick: 1.12, shoulders: 1.06, head: 1.08 };
const ANNA = { height: 0.92, head: 1.02 };
const GUROV_C = { hair: '#5a4a3a', skin: '#d8b89e' };
const ANNA_C = { hair: '#d9c08c', skin: '#ecccb4' };
const characters = {
  // Gurov in Yalta: a big man under forty, a light summer suit, a straw boater; a moustache
  gurov_summer: man({ garment: 'jacket', hair: 'short', hat: 'boater', body: GUROV, parts: ['moustache'],
    colors: { ...GUROV_C, top: '#ece7da', bottom: '#cfc7b1', garment: '#d8d0bb', hat: '#e6d9ae', shoes: '#6b5a48', accent: '#f4f1ea' } }),
  // without the hat, in the same light suit (the room in Yalta); in the theatre — the scene gives it a dark frock coat
  // by `colors` ({garment: '#34353d', bottom: '#2f3036'})
  gurov_indoor: man({ garment: 'jacket', hair: 'short', hat: 'none', body: GUROV, parts: ['moustache'],
    colors: { ...GUROV_C, top: '#ece7da', bottom: '#cfc7b1', garment: '#d8d0bb', shoes: '#6b5a48', accent: '#f4f1ea' } }),
  // Moscow winter: a long dark fur coat with a fur collar, a fur hat
  gurov_winter: man({ garment: 'coat', hair: 'short', hat: 'fur_hat', body: GUROV, parts: ['moustache', 'fur_collar'],
    colors: { ...GUROV_C, top: '#e4e0d8', bottom: '#2c2d33', garment: '#34343c', hat: '#2e2b2c', accent: '#5a4c40', shoes: '#222226' } }),
  // years later in Moscow: a dark frock coat, no hat, the hair going grey
  gurov_grey: man({ garment: 'coat', hair: 'short', hat: 'none', body: GUROV, parts: ['moustache'],
    colors: { ...GUROV_C, hair: '#a9a59e', top: '#e4e0d8', bottom: '#2f3036', garment: '#34353d', shoes: '#26252a', accent: '#f4f1ea' } }),
  // Anna in Yalta: small, fair, a pale dress, a beret
  anna_summer: woman({ garment: 'dress', hair: 'bun', hat: 'beret', body: ANNA,
    colors: { ...ANNA_C, top: '#efedf1', garment: '#efedf1', bottom: '#efedf1', hat: '#c9c5d8', shoes: '#857c8a', accent: '#f7f5f0' } }),
  // the room at night: the same pale dress, the hair let down, no beret
  anna_hairdown: woman({ garment: 'dress', hair: 'long', hat: 'none', body: ANNA,
    colors: { ...ANNA_C, top: '#efedf1', garment: '#efedf1', bottom: '#efedf1', shoes: '#857c8a', accent: '#f7f5f0' } }),
  // the station: a grey-blue travelling dress, a small hat
  anna_travel: woman({ garment: 'dress', hair: 'bun', hat: 'toque', body: ANNA,
    colors: { ...ANNA_C, top: '#a9b6c6', garment: '#9fadbf', bottom: '#9fadbf', hat: '#5d6577', shoes: '#4c4a52', accent: '#f7f5f0' } }),
  // S., autumn: a dark coat, a small hat, gloves
  anna_autumn: woman({ garment: 'coat', hair: 'bun', hat: 'toque', body: ANNA, parts: ['gloves'],
    colors: { ...ANNA_C, top: '#4a4c56', garment: '#3c3f4a', bottom: '#3c3f4a', hat: '#2f3038', shoes: '#2a2a30', accent: '#8f97a6' } }),
  // S., winter: a pale grey fur coat, a fur cap, a muff (the part `muff`, the cap's fur)
  anna_winter: woman({ garment: 'coat', hair: 'bun', hat: 'fur_cap', body: ANNA,
    colors: { ...ANNA_C, top: '#c9c6c4', garment: '#b8b4b0', bottom: '#8d8a90', hat: '#e8e2d8', shoes: '#3a383e', accent: '#e8e2d8' } }),
  // the theatre: a light grey evening dress, a light shawl
  anna_theatre: woman({ garment: 'dress', hair: 'bun', hat: 'none', scarf: true, body: ANNA,
    colors: { ...ANNA_C, top: '#d6d4d8', garment: '#cfccd2', bottom: '#cfccd2', shoes: '#6b6670', accent: '#f1ede4' } }),
  // Moscow, the Slavyansky Bazaar: his favourite grey dress, no hat
  anna_grey: woman({ garment: 'dress', hair: 'bun', hat: 'none', body: ANNA,
    colors: { ...ANNA_C, top: '#a8a6ab', garment: '#9c9aa0', bottom: '#9c9aa0', shoes: '#4c4a52', accent: '#f7f5f0' } }),
  // von Diderits: young, very tall, stooping, a narrow face, small side-whiskers, a pince-nez; a tail coat with a
  // scholarly badge on the breast ("diderits#badge")
  diderits: man({ style: 'dama_narrow', garment: 'jacket', hair: 'short', hat: 'none', parts: ['sideburns', 'pince_nez', 'badge'],
    body: { height: 1.12, thick: 0.84, shoulders: 0.92 },
    colors: { hair: '#8a7258', skin: '#e2c2a8', top: '#eeeae2', bottom: '#202026', garment: '#222228', shoes: '#18181c', accent: '#eeeae2' } }),
  // the same at the gate: a coat, a peaked cap with a cockade
  diderits_coat: man({ style: 'dama_narrow', garment: 'coat', hair: 'short', hat: 'cap_cockade', parts: ['sideburns', 'pince_nez'],
    body: { height: 1.12, thick: 0.84, shoulders: 0.92 },
    colors: { hair: '#8a7258', skin: '#e2c2a8', top: '#3a3d46', bottom: '#2a2c33', garment: '#3a3e48', hat: '#2a2c33', shoes: '#18181c', accent: '#d8d2c4' } }),
  // Gurov's wife: tall, upright, dark hair, straight dark brows, a dark dress
  wife: woman({ face: 'level', garment: 'dress', hair: 'bun', hat: 'none', body: { height: 0.99, shoulders: 0.92 },
    colors: { hair: '#2a2220', skin: '#e0c0a6', top: '#34303a', garment: '#2e2b33', bottom: '#2e2b33', shoes: '#1e1c20', accent: '#8a8288' } }),
  // the same with a shawl over her shoulders (the porch at dawn)
  wife_shawl: woman({ face: 'level', garment: 'dress', hair: 'bun', hat: 'none', scarf: true, body: { height: 0.99, shoulders: 0.92 },
    colors: { hair: '#2a2220', skin: '#e0c0a6', top: '#34303a', garment: '#2e2b33', bottom: '#2e2b33', shoes: '#1e1c20', accent: '#9a9096' } }),
  // the daughter, twelve: a gymnasium coat, a bonnet
  daughter: look('child', { garment: 'coat', hair: 'long', hat: 'capor', body: { height: 0.84, head: 1.08 },
    colors: { hair: '#7a5a3a', skin: '#ecccb4', top: '#6f6656', garment: '#5d5a52', bottom: '#4a4740', hat: '#e2ddd2', shoes: '#2a2626', accent: '#e2ddd2' } }),
  // the official: stout, a fur coat and a fur hat
  official: man({ garment: 'coat', hair: 'short', hat: 'fur_hat', parts: ['fur_collar'], body: { height: 0.98, thick: 1.32, shoulders: 1.08 },
    colors: { hair: '#4a4038', skin: '#d6a88c', top: '#4a4440', bottom: '#2c2a2c', garment: '#4c4038', hat: '#3a322c', accent: '#6a5a4a', shoes: '#1e1c1c' } }),
  // the old maid: a headscarf, a dark jacket, an apron
  maid: look('old', { garment: 'dress', hair: 'bun', hat: 'kerchief', parts: ['apron_front'], body: { height: 0.88 },
    colors: { hair: '#c9c4bb', skin: '#d4ae94', top: '#3c3a40', garment: '#3c3a40', bottom: '#3c3a40', hat: '#d8d2c6', shoes: '#26232a', accent: '#d6d1c6' } }),
  // the watchman at Oreanda: an old man in a cap, with a stick
  watchman: look('grandpa', { garment: 'coat', hat: 'cap', scarf: false, parts: ['stick'],
    colors: { garment: '#7c766b', bottom: '#4a453f', hat: '#3f3a36', shoes: '#2f2a26', skin: '#b98f74', hair: '#c9c4bb' } }),
  // the messenger: a dark coat, a red cap (one of the three reds of the film)
  redcap: man({ garment: 'coat', hair: 'short', hat: 'cap', body: { height: 0.96 },
    colors: { hair: '#3a2f28', skin: '#d6ae94', top: '#3a3a40', bottom: '#2a2a30', garment: '#33343c', hat: '#a8322c', shoes: '#1e1e22' } }),
  // the Moscow waiter: a tail coat, a white shirt-front (the tray: the part `tray`)
  waiter: man({ garment: 'jacket', hair: 'short', hat: 'none', body: { height: 0.98 },
    colors: { hair: '#3a2f28', skin: '#d4ae94', top: '#ebe8e1', bottom: '#222228', garment: '#232329', shoes: '#1c1c20', accent: '#b8914f' } }),
  // the Yalta waiter: a white jacket and a long white apron
  waiter_summer: man({ garment: 'apron', hair: 'short', hat: 'none', body: { height: 0.98 },
    colors: { hair: '#3a2f28', skin: '#d4ae94', top: '#ece9e2', bottom: '#4a4740', garment: '#f3f1ec', shoes: '#2a2622', accent: '#b8914f' } }),
  // the yardman: a sheepskin coat colour, an apron, a cap
  yardman: look('janitor', { garment: 'apron', hair: 'short', hat: 'cap', body: { thick: 1.1 },
    colors: { hair: '#4a3a2c', skin: '#cf9f80', top: '#9c8668', bottom: '#3a3530', garment: '#d2cbbd', hat: '#3a3430', shoes: '#26221e' } }),
  // the hotel boy: a short jacket, a cap
  boy: look('child', { garment: 'jacket', hair: 'short', hat: 'cap', body: { height: 0.8 },
    colors: { hair: '#6a4c32', skin: '#e2b896', top: '#d8d2c2', bottom: '#4a4a52', garment: '#5a6476', hat: '#3c4250', shoes: '#2a2626' } }),
  // the conductor, far: a uniform, a cap; his lantern's glass glows (the part `lantern`)
  conductor: man({ garment: 'coat', hair: 'short', hat: 'cap',
    colors: { hair: '#4a3a2e', skin: '#c9a084', top: '#3d4352', bottom: '#2e323c', garment: '#3a4050', hat: '#2b2f38', shoes: '#22222a', accent: '#ffd38a' } }),
  // the cabman, far: a long dark peasant coat, a low hat
  cabman: man({ garment: 'robe', hair: 'short', hat: 'hat', body: { thick: 1.15 },
    colors: { hair: '#3a2e26', skin: '#c9a084', top: '#3a342e', bottom: '#2a2624', garment: '#3c3630', hat: '#26221f', shoes: '#1e1a18' } }),
  // the arrivals on the pier: ladies and gentlemen in summer and travelling clothes
  p1: woman({ garment: 'dress', hair: 'bun', hat: 'toque', colors: { hair: '#5a4030', garment: '#d9cfbb', top: '#d9cfbb', hat: '#8a7e6e', shoes: '#4a4040' } }),
  p2: man({ garment: 'jacket', hair: 'short', hat: 'boater', colors: { hair: '#3a2e26', garment: '#c9c2b0', top: '#ebe6da', bottom: '#b9b2a0', hat: '#e2d6aa', shoes: '#4a3e34' } }),
  p3: woman({ garment: 'dress', hair: 'bun', hat: 'hat', body: { height: 0.96 }, colors: { hair: '#2e2420', garment: '#aab4c2', top: '#aab4c2', hat: '#e9e4d8', shoes: '#3a3a40' } }),
  p4: man({ garment: 'coat', hair: 'short', hat: 'hat', body: { thick: 1.12 }, colors: { hair: '#6a6058', garment: '#8f8a80', top: '#e4e0d6', bottom: '#5a564e', hat: '#4a4640', shoes: '#2a2826' } }),
  p5: woman({ garment: 'coat', hair: 'bun', hat: 'toque', body: { height: 0.9 }, colors: { hair: '#7a5a3a', garment: '#c8bca4', top: '#c8bca4', bottom: '#8a8070', hat: '#5a5048', shoes: '#3a3430' } }),
  p6: man({ garment: 'jacket', hair: 'short', hat: 'cap', body: { height: 0.97 }, colors: { hair: '#4a3a2c', garment: '#6f7a8a', top: '#e8e4da', bottom: '#4e5662', hat: '#3a3e48', shoes: '#26262a' } }),
  // the tall stooping stranger with small side-whiskers in a light coat — from far, like von Diderits
  stranger: man({ style: 'dama_narrow', garment: 'coat', hair: 'short', hat: 'hat', parts: ['sideburns'], body: { height: 1.1, thick: 0.86, shoulders: 0.92 },
    colors: { hair: '#7a6450', skin: '#e0c0a6', top: '#e6e1d6', bottom: '#8a8478', garment: '#d2cab8', hat: '#8a8274', shoes: '#2a2826' } }),
  stranger_lady: woman({ garment: 'dress', hair: 'bun', hat: 'toque', colors: { hair: '#4a3628', garment: '#b9aec0', top: '#b9aec0', hat: '#6e6478', shoes: '#3a3640' } }),
  // the strollers in the garden: a lady with a light parasol, an officer, an old man
  stroller1: woman({ garment: 'dress', hair: 'bun', hat: 'toque', parts: ['parasol'], colors: { hair: '#6a4a32', garment: '#e6e0d2', top: '#e6e0d2', hat: '#c8bfa8', shoes: '#5a5048' } }),
  stroller2: man({ garment: 'coat', hair: 'short', hat: 'cap_cockade', parts: ['moustache'], colors: { hair: '#4a3628', garment: '#e8e4da', top: '#e8e4da', bottom: '#3a3e48', hat: '#e8e4da', shoes: '#1e1e22' } }),
  stroller3: look('old', { garment: 'jacket', hair: 'short', hat: 'boater', parts: ['stick'], colors: { hair: '#d4cfc6', garment: '#c6bfae', top: '#e6e1d6', bottom: '#a8a090', hat: '#d8ccaa', shoes: '#4a4038' } }),
  // the women on the Moscow street, in winter — all small; told apart by a thing and a figure when they turn
  shade1: look('old', { garment: 'coat', hair: 'bun', hat: 'kerchief', parts: ['stick'], body: { height: 0.86, shoulders: 0.86 },
    colors: { hair: '#c9c4bb', skin: '#d4ae94', garment: '#4a4440', top: '#4a4440', bottom: '#3a3634', hat: '#6a6058', shoes: '#26232a' } }),
  shade2: woman({ garment: 'coat', hair: 'bun', hat: 'fur_cap', body: { height: 0.9 },
    colors: { hair: '#3a2c24', garment: '#2c2c34', top: '#2c2c34', bottom: '#26262c', hat: '#5a4c42', shoes: '#1e1e22' } }),
  shade3: woman({ garment: 'coat', hair: 'bun', hat: 'toque', body: { height: 0.9 },
    colors: { hair: '#6a4a32', garment: '#5a5868', top: '#5a5868', bottom: '#3a3a44', hat: '#3a3a44', shoes: '#1e1e22' } }),
  shade4: woman({ garment: 'coat', hair: 'bun', hat: 'fur_cap', body: { height: 0.98 },
    colors: { hair: '#b08a5a', garment: '#d2ccc2', top: '#d2ccc2', bottom: '#8a8690', hat: '#e2dcd2', shoes: '#3a383e' } }),
  // the ladies in the theatre: winter evening dresses, dark and deep — none light as she is, none red
  lady1: woman({ garment: 'dress', hair: 'bun', colors: { hair: '#2e2420', garment: '#2a3350', top: '#2a3350', shoes: '#1a1a22' } }),
  lady2: woman({ garment: 'dress', hair: 'bun', colors: { hair: '#5a3e2a', garment: '#4e3a2c', top: '#4e3a2c', shoes: '#22201e' } }),
  lady3: woman({ garment: 'dress', hair: 'bun', body: { height: 0.96 }, colors: { hair: '#1e1a1a', garment: '#1c1b20', top: '#1c1b20', shoes: '#141418' } }),
  lady4: woman({ garment: 'dress', hair: 'bun', colors: { hair: '#4a3020', garment: '#4a2a2c', top: '#4a2a2c', shoes: '#201a1a' } }),
  lady5: woman({ garment: 'dress', hair: 'bun', body: { height: 0.9 }, colors: { hair: '#6a5038', garment: '#263a30', top: '#263a30', shoes: '#181e1a' } }),
  // the schoolboys on the stairs: grey greatcoats, peaked caps
  schoolboy1: look('youth', { garment: 'coat', hair: 'short', hat: 'cap_cockade', body: { height: 0.94 },
    colors: { hair: '#4a3628', skin: '#e2b896', garment: '#7c7e84', top: '#7c7e84', bottom: '#3a3c44', hat: '#2e3240', shoes: '#1e1e22' } }),
  schoolboy2: look('youth', { garment: 'coat', hair: 'short', hat: 'cap_cockade', body: { height: 0.92 },
    colors: { hair: '#8a6a44', skin: '#e8c0a0', garment: '#74767c', top: '#74767c', bottom: '#3a3c44', hat: '#2e3240', shoes: '#1e1e22' } }),
};

return {
  ...data,
  characters,
  shapes: {
    // the world's style: the engine's `soft` a little longer (a smaller head on longer legs, a little longer neck, slimmer
    // limbs), the head still big enough for the face `simple` to read at a medium shot; toned paint, thin tinted lines.
    // `dama_narrow` — the same with a narrow long head (von Diderits, the stranger like him)
    styles: {
      dama: { from: 'soft', head: 1.26, egg: [1.0, 1.06, 1.0], neck: 0.42, legs: 0.96, limb: 0.96, paint: 'toned', line: 1.6, face: 'simple' },
      dama_narrow: { from: 'dama', egg: [0.86, 1.14, 0.98] },
    },
    faces: { level },
    hats,
    parts,
  },
};
