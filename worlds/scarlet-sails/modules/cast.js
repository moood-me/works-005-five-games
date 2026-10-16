// The people of «Scarlet Sails» as people in a scene (the engine's people.js: an element with "person"): who they are —
// figures of shapes in this world's style, clean straight-edged shapes in plain colours lit by the scene's own light, as
// the world is painted (modern, quiet, minimal) — and how they move: the motions in cast.data.json (Kimodo's, put there
// with put_motion). cast.md says who is who, what each carries and what each motion is. A part's lengths are a man's
// metres times F.fit.h (the person's height as a share of a man's 1.76 m); the points a part names (F.point) are the
// person's: "assol#yacht".
const V = () => MooodShapes.V;
const WOOD = [0.42, 0.31, 0.21, 1], DARK = [0.16, 0.13, 0.11, 1], STEEL = [0.62, 0.63, 0.64, 1], WICKER = [0.62, 0.5, 0.33, 1];
const HULL = [0.86, 0.84, 0.8, 1], SCARLET = [0.74, 0.11, 0.13, 1], COVER = [0.38, 0.3, 0.24, 1], PAGES = [0.9, 0.87, 0.8, 1];
// the hand's axes: across the palm, up the hand, out of the fist
const axesOf = (F, h) => [F.side(h), F.up(h), F.fwd(h)];
// the toy yacht Longren made for Assol: a white hull, a mast, two scarlet sails — at `c`, its keel along `along`, its
// mast up `up` (metres of a toy: 0.34 long); the middle of its sails is the person's point `yacht`
function yacht(F, c, along, up) {
  const { add, mul, cross, unit, sub, dot } = V(), m = F.fit.h;
  const u = unit(sub(up, mul(along, dot(up, along)))), side = cross(along, u), axes = [along, u, side];
  F.ball(c, axes, [0.17 * m, 0.04 * m, 0.045 * m], HULL, 12, 2.2);
  const foot = add(c, mul(u, 0.03 * m)), top = add(foot, mul(u, 0.34 * m));
  F.bar(foot, top, 0.005 * m, 0.004 * m, [[0, WOOD]], 5, side);
  // the mainsail aft of the mast, the jib before it: thin, a little bellied
  F.ball(add(add(foot, mul(u, 0.16 * m)), mul(along, -0.06 * m)), axes, [0.06 * m, 0.13 * m, 0.006 * m], SCARLET, 10);
  F.ball(add(add(foot, mul(u, 0.14 * m)), mul(along, 0.06 * m)), axes, [0.045 * m, 0.11 * m, 0.006 * m], SCARLET, 10);
  F.point('yacht', add(foot, mul(u, 0.14 * m)));
}
// an open book, its middle at `c`, its pages turned to the reader's eyes
function openBook(F, c, along) {
  const { add, mul, unit, sub, dot, cross } = V(), m = F.fit.h, n = unit(sub(F.P('Head'), c));
  const x0 = along ?? unit(cross([0, 1, 0], n)), x = unit(sub(x0, mul(n, dot(x0, n)))), y = cross(n, x);
  F.ball(add(c, mul(n, -0.008 * m)), [x, y, n], [0.15 * m, 0.11 * m, 0.012 * m], COVER, 8, 10);
  for (const s of [-1, 1]) F.ball(add(add(c, mul(x, s * 0.072 * m)), mul(n, 0.004 * m)), [x, y, n], [0.07 * m, 0.1 * m, 0.008 * m], PAGES, 8, 10);
  F.point('book', c);
}
// a basket hanging from a hand by its handle, swinging a little late as they go; full — the top heaped with toys
function basket(F, hand, name, full) {
  const { add, sub, mul, dot, cross, unit } = V(), m = F.fit.h, h = F.P(hand);
  const mid = F.swing(name, add(h, [0, -0.24 * m, 0]), 70), up = unit(sub(h, mid));
  const fwd = unit(sub(F.fwd('Hips'), mul(up, dot(F.fwd('Hips'), up)))), axes = [cross(up, fwd), up, fwd];
  F.ball(mid, axes, [0.11 * m, 0.09 * m, 0.17 * m], WICKER, 14, 2.4);
  F.bar(add(mid, add(mul(fwd, -0.14 * m), mul(up, 0.04 * m))), h, 0.007 * m, 0.007 * m, [[0, WICKER]], 6, fwd, 0.6);
  F.bar(add(mid, add(mul(fwd, 0.14 * m), mul(up, 0.04 * m))), h, 0.007 * m, 0.007 * m, [[0, WICKER]], 6, fwd, 0.6);
  if (!full) return;
  // (little boats heaped in it: white hulls, a few coloured sails)
  for (const [f, s2, col] of [[-0.08, 0.03, HULL], [0.02, -0.04, [0.3, 0.4, 0.5, 1]], [0.09, 0.02, HULL], [-0.02, 0.05, [0.66, 0.6, 0.45, 1]]]) {
    F.ball(add(add(mid, mul(up, 0.08 * m)), add(mul(fwd, f * m), mul(axes[0], s2 * m))), axes, [0.03 * m, 0.035 * m, 0.06 * m], col, 8);
  }
  F.point('basket', add(mid, mul(up, 0.1 * m)));
}
// how far they are sat down, 0 standing … 1 seated: by how high the hips are over the feet (a share of a man's metres)
function seated(F) {
  const high = (F.P('Hips')[1] - Math.min(F.P('LeftFoot')[1], F.P('RightFoot')[1])) / F.fit.h;
  return Math.max(0, Math.min(1, (0.75 - high) / 0.15));
}
// toward the person's right, level
function rightOf(F) {
  const { sub, unit } = V(), d = sub(F.P('RightLeg'), F.P('LeftLeg'));
  return unit([d[0], 0, d[2]]);
}
// a ring on the right hand between the fingers: a band `wide` across and `deep` along the finger (a man's metres),
// the person's point `ring`
function ring(F, wide, deep, gold) {
  const { mix } = V(), m = F.fit.h, at = mix(F.P('RightHandIndex1'), F.P('RightHandMiddle1'), 0.5);
  F.ball(at, axesOf(F, 'RightHand'), [wide * m, wide * m, deep * m], gold, 10);
  F.point('ring', at);
}
return {
  ...data,
  characters: {
    // Assol, eight: thin and sunburnt, dark tousled hair, a short faded chintz frock, barefoot
    assol_child: { kind: 'shapes', style: 'parusa', who: 'child', garment: 'frock', hair: 'long', barefoot: 'both',
      body: { height: 0.72, thick: 0.76, shoulders: 0.86 },
      colors: { skin: '#c4936f', hair: '#2a201b', top: '#9fb1b6', garment: '#9fb1b6' } },
    // Assol, seventeen: small and slight, dark hair under a light kerchief, a plain pale dress, barefoot on the sand
    assol: { kind: 'shapes', style: 'parusa', who: 'woman', garment: 'dress', hair: 'long', hat: 'kerchief', barefoot: 'both',
      body: { height: 0.9, thick: 0.78, shoulders: 0.84, neck: 1.05 },
      colors: { skin: '#cf9f7c', hair: '#271d19', top: '#d9d3c7', garment: '#d9d3c7', hat: '#b9c3c6' } },
    // Longren, her father: big and heavy, a greying beard, a sailor's dark jacket, a cap; big hands
    longren: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap', parts: ['beard'],
      body: { height: 1.04, shoulders: 1.18, thick: 1.14, arms: 1.03 },
      colors: { skin: '#b4886a', hair: '#8e8880', top: '#bdb4a4', garment: '#3e4a58', bottom: '#3a3732', hat: '#2c3138', shoes: '#26221e' } },
    // Arthur Gray, a captain of twenty: tall and lean, weathered, a dark-blue captain's frock coat, bare-headed
    grey: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'frockcoat', hair: 'short',
      body: { height: 1.06, thick: 0.9, shoulders: 1.02 },
      colors: { skin: '#c39a7a', hair: '#3b2a1f', top: '#e6e1d6', garment: '#1f2b46', bottom: '#262a33', shoes: '#1b1a1c' } },
    // Gray, a boy of eight: fair hair, a velvet jacket
    grey_boy: { kind: 'shapes', style: 'parusa', who: 'child', garment: 'jacket', hair: 'short',
      body: { height: 0.72, thick: 0.8 },
      colors: { skin: '#e2bd9d', hair: '#d4ba86', top: '#e9e4da', garment: '#5b2f3d', bottom: '#3a3438', shoes: '#231f22' } },
    // Gray at fifteen, a ship's boy: shot up tall, a canvas smock, barefoot
    grey_teen: { kind: 'shapes', style: 'parusa', who: 'teen', garment: 'tunic', hair: 'short', barefoot: 'both',
      body: { height: 0.94, thick: 0.78 },
      colors: { skin: '#c9a080', hair: '#b39a6c', top: '#b6ab92', bottom: '#5d584c' } },
    // Lilian Gray, his mother: thin and pale, a dark dress (black, a widow — colors over it), her hair in a bun
    lilian: { kind: 'shapes', style: 'parusa', who: 'woman', garment: 'dress', hair: 'bun',
      body: { height: 0.94, thick: 0.76, shoulders: 0.84 },
      colors: { skin: '#e3cdbb', hair: '#4a3a30', top: '#3b3442', garment: '#3b3442', shoes: '#1e1b20' } },
    // Lilian in mourning: all in black
    lilian_black: { kind: 'shapes', style: 'parusa', who: 'woman', garment: 'dress', hair: 'bun',
      body: { height: 0.94, thick: 0.76, shoulders: 0.84 },
      colors: { skin: '#e3cdbb', hair: '#4a3a30', top: '#1d1b20', garment: '#1d1b20', shoes: '#141215' } },
    // Gray with his frock coat off: a white shirt, dark trousers
    grey_shirt: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'none', hair: 'short',
      body: { height: 1.06, thick: 0.9, shoulders: 1.02 },
      colors: { skin: '#c39a7a', hair: '#3b2a1f', top: '#e6e1d6', bottom: '#262a33', shoes: '#1b1a1c' } },
    // Letika, a sailor of the «Secret»: thin and merry, a cap pushed aside, a short jacket
    letika: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap',
      body: { height: 0.97, thick: 0.84 },
      colors: { skin: '#c2926f', hair: '#5a3a24', top: '#d8d2c4', garment: '#56636f', bottom: '#3c3b3a', hat: '#7d3b33', shoes: '#26221f' } },
    // Hin Menners, the innkeeper: heavy, an apron over a shirt
    hin: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'apron', hair: 'short',
      body: { height: 0.98, thick: 1.42, shoulders: 1.06 },
      colors: { skin: '#d0a385', hair: '#5d4632', top: '#cbc3b3', garment: '#a79f8e', bottom: '#3b3631', shoes: '#26221f' } },
    // Philip the collier: big, black with coal dust, a cap
    filipp: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap', parts: ['beard'],
      body: { height: 1.02, thick: 1.3, shoulders: 1.1 },
      colors: { skin: '#8c6c58', hair: '#2a2523', top: '#4a4642', garment: '#2f2d2b', bottom: '#2b2927', hat: '#242220', shoes: '#1d1b1a' } },
    // Egle, the old storyteller: tall and lean, a white beard, a straw hat
    egl: { kind: 'shapes', style: 'parusa', who: 'old', garment: 'coat', hair: 'short', hat: 'hat', parts: ['beard'],
      body: { height: 1.07, thick: 0.78 },
      colors: { skin: '#c49c80', hair: '#e2ddd3', garment: '#8f8a7c', bottom: '#5e5a52', hat: '#cdb98a', shoes: '#3a342d' } },
    // the shopkeeper in Liss: old, spectacled, a waistcoat over the shirt
    merchant: { kind: 'shapes', style: 'parusa', who: 'old', garment: 'jacket', hair: 'short',
      body: { height: 0.95, thick: 1.05 },
      colors: { skin: '#d6b39a', hair: '#bdb6ab', top: '#e2ddd2', garment: '#4f4a52', bottom: '#38353a' } },
    // the people of Kaperna: a fisherman, a woman in a kerchief, the children (a boy, an older girl, a little one),
    // the little girl who asks about the yacht
    fisher: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap',
      body: { height: 1.0, thick: 1.1 },
      colors: { skin: '#b98d6c', hair: '#4a3a2c', garment: '#5d5a50', bottom: '#3d3a34', hat: '#3a3833' } },
    woman: { kind: 'shapes', style: 'parusa', who: 'woman', garment: 'dress', hair: 'bun', hat: 'kerchief',
      body: { height: 0.93, thick: 0.98 },
      colors: { skin: '#c99c7b', hair: '#3d2d22', top: '#7f7468', garment: '#7f7468', hat: '#b7ab96' } },
    kid_boy: { kind: 'shapes', style: 'parusa', who: 'child', garment: 'none', hair: 'short', barefoot: 'both',
      body: { height: 0.74, thick: 0.82 },
      colors: { skin: '#c7976f', hair: '#6a4a2c', top: '#b9ae96', bottom: '#4f4a40' } },
    kid_girl: { kind: 'shapes', style: 'parusa', who: 'child', garment: 'frock', hair: 'ponytail', barefoot: 'both',
      body: { height: 0.78, thick: 0.8 },
      colors: { skin: '#cc9f7d', hair: '#7a5232', top: '#a4867a', garment: '#a4867a' } },
    kid_small: { kind: 'shapes', style: 'parusa', who: 'toddler', garment: 'tunic', hair: 'short', barefoot: 'both',
      colors: { skin: '#d3a684', hair: '#a78350', top: '#c9bfa8' } },
    girl: { kind: 'shapes', style: 'parusa', who: 'child', garment: 'frock', hair: 'bob', barefoot: 'both',
      body: { height: 0.66, thick: 0.76 },
      colors: { skin: '#c99a76', hair: '#2f231d', top: '#b9a58f', garment: '#b9a58f' } },
    // the crew of the «Secret»: a sailor; Panten, the mate (round, buttoned up); Gop, the boatswain of the «Anselm»
    sailor: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'tunic', hair: 'short', hat: 'cap',
      body: { height: 1.0, thick: 1.0 },
      colors: { skin: '#c0906e', hair: '#3c2c22', top: '#d9d5cc', bottom: '#2e3446', hat: '#2e3446' } },
    panten: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'frockcoat', hair: 'short',
      body: { height: 0.95, thick: 1.35 },
      colors: { skin: '#d2a98c', hair: '#6b6258', garment: '#2c3343', bottom: '#2a2d36' } },
    gop: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap',
      body: { height: 0.98, thick: 1.25, shoulders: 1.1 },
      colors: { skin: '#a97e60', hair: '#4b3f35', garment: '#5d5a3e', bottom: '#3a382f', hat: '#2e2c24' } },
    // the past of Kaperna. Mary, Assol's mother: young and thin, dark hair under a kerchief, a dark dress, the baby in
    // her arms
    mary: { kind: 'shapes', style: 'parusa', who: 'woman', garment: 'dress', hair: 'long', hat: 'kerchief', parts: ['baby'],
      body: { height: 0.92, thick: 0.76, shoulders: 0.84 },
      colors: { skin: '#d8b196', hair: '#231a17', top: '#39404e', garment: '#39404e', hat: '#c9c4b6', shoes: '#22201f' } },
    // Menners the elder, Hin's father: as heavy as Hin, older, bald, a waistcoat over the shirt
    menners: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'waistcoat', hair: 'none',
      body: { height: 0.97, thick: 1.42, shoulders: 1.06 },
      colors: { skin: '#cc9f84', hair: '#8d857b', top: '#cbc3b3', garment: '#4b3d34', bottom: '#3b3631', shoes: '#26221f' } },
    // Longren in the past: the same man, his beard and hair still dark
    longren_young: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap', parts: ['beard'],
      body: { height: 1.04, shoulders: 1.18, thick: 1.14, arms: 1.03 },
      colors: { skin: '#b4886a', hair: '#2e2620', top: '#bdb4a4', garment: '#3e4a58', bottom: '#3a3732', hat: '#2c3138', shoes: '#26221e' } },
    // Philip with his cap off (the cap in his hand: the part cap_hand, in the cap's colour)
    filipp_bare: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'none', parts: ['beard'],
      body: { height: 1.02, thick: 1.3, shoulders: 1.1 },
      colors: { skin: '#8c6c58', hair: '#2a2523', top: '#4a4642', garment: '#2f2d2b', bottom: '#2b2927', hat: '#242220', shoes: '#1d1b1a' } },
    // Zimmer, the fiddler: thin, long hair, a dark frock coat
    zimmer: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'frockcoat', hair: 'long',
      body: { height: 1.01, thick: 0.76, shoulders: 0.94 },
      colors: { skin: '#d3ae93', hair: '#4a4038', top: '#d9d4c8', garment: '#2a272c', bottom: '#242226', shoes: '#1b1a1c' } },
    // his musicians, in dark: one with a fiddle, one with a cello
    musician: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap',
      body: { height: 0.98, thick: 0.92 },
      colors: { skin: '#c9a084', hair: '#3a2e26', top: '#cfc9bc', garment: '#2f3036', bottom: '#28272b', hat: '#26262a', shoes: '#1c1b1d' } },
    cellist: { kind: 'shapes', style: 'parusa', who: 'man', garment: 'frockcoat', hair: 'short', parts: ['beard'],
      body: { height: 1.0, thick: 1.16, shoulders: 1.04 },
      colors: { skin: '#c59a7e', hair: '#5b5148', top: '#cfc9bc', garment: '#33302f', bottom: '#2a2827', shoes: '#1c1b1b' } },
  },
  shapes: {
    // the world's style: the engine's flat geometry — straight edges, plain colours, lit by the scene
    styles: { parusa: { from: 'flat', name: 'Scarlet Sails', line: 0.8, face: 'simple' } },
    garments: {
      // a child's short frock: to the knee, bare arms, bare legs below it
      frock: { name: 'little frock', hang: [{ to: 1.05, from: 'waist', flare: 0.4, off: 0.94 }], short: true, bare: true, bodice: true },
      // a captain's frock coat: from the shoulders to above the knee, long sleeves
      frockcoat: { name: 'frock coat', hang: [{ to: 0.85, from: 'shoulders', flare: 0.16 }], sleeves: 'garment' },
      // a waistcoat: from the shoulders to the waist, the shirt's sleeves bare of it
      waistcoat: { name: 'waistcoat', hang: [{ to: 0.32, from: 'shoulders', flare: 0.05, folds: false }] },
    },
    hats: {
      // a light kerchief over the hair, tied at the nape
      kerchief: { name: 'kerchief', draw: F => {
        const { add, mul } = V(), { at, axes, egg, r, out, sides, square } = F.head, [, hu, hf] = axes;
        F.cap(at, axes, egg.map(e => e * r * out * 1.08), [0, 0.7, -0.72], -0.05, F.colors.hat, sides, square);
        F.ball(add(at, add(mul(hu, -r * 0.45), mul(hf, -r * 1.02))), axes, [r * 0.22, r * 0.16, r * 0.14], F.colors.hat, 10);
      } },
    },
    parts: {
      // a full beard over the jaw and the chin (the colour of the hair)
      beard: { name: 'beard', draw: F => {
        const { add, mul } = V(), h = F.head, [, hu, hf] = h.axes, r = h.r * h.out;
        F.cap(h.at, h.axes, h.egg.map(e => e * r * 1.05), [0, -0.55, 0.83], 0.25, F.colors.hair, h.sides, h.square);
        F.ball(add(h.at, add(mul(hu, -r * 0.92), mul(hf, r * 0.5))), h.axes, [r * 0.6, r * 0.46, r * 0.4], F.colors.hair, h.sides);
      } },
      // the toy yacht held in both hands, between them, its mast up
      yacht: { name: 'yacht in the hands', draw: F => {
        const { add, mul, mix, sub, unit } = V(), m = F.fit.h, l = F.P('LeftHand'), r = F.P('RightHand');
        const across = sub(r, l), along = Math.hypot(...across) > 0.08 * m ? unit(across) : F.side('Chest');
        yacht(F, add(mix(l, r, 0.5), [0, 0.04 * m, 0]), along, [0, 1, 0]);
      } },
      // …in the right hand, held by the hull, upright
      yacht_r: { name: 'yacht in the right hand', draw: F => {
        const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand');
        yacht(F, add(add(h, mul(F.fwd('RightHand'), 0.05 * m)), [0, 0.03 * m, 0]), F.fwd('Hips'), [0, 1, 0]);
      } },
      // a carving knife in the right hand: a short blade out of the fist
      knife: { name: 'knife', draw: F => {
        const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), [s, , f] = axesOf(F, 'RightHand');
        const grip = add(h, mul(f, 0.06 * m));
        F.bar(add(grip, mul(f, -0.04 * m)), add(grip, mul(f, 0.05 * m)), 0.011 * m, 0.011 * m, [[0, WOOD]], 6, s);
        F.bar(add(grip, mul(f, 0.05 * m)), add(grip, mul(f, 0.13 * m)), 0.009 * m, 0.002 * m, [[0, STEEL]], 4, s, 0.3);
      } },
      // a short pipe in the right hand: the stem out of the fist, the bowl at its end
      pipe: { name: 'pipe', draw: F => {
        const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), [s, u, f] = axesOf(F, 'RightHand');
        const a = add(h, mul(f, 0.05 * m)), b = add(a, mul(f, 0.1 * m));
        F.bar(add(a, mul(f, -0.05 * m)), b, 0.005 * m, 0.005 * m, [[0, DARK]], 5, s);
        F.ball(add(b, mul(u, 0.015 * m)), [s, u, f], [0.016 * m, 0.022 * m, 0.016 * m], [0.3, 0.2, 0.14, 1], 8);
        F.point('pipe', add(b, mul(u, 0.04 * m)));
      } },
      // a book held open in both hands, its pages to the reader
      book: { name: 'book', draw: F => {
        const { mix, add } = V(), m = F.fit.h;
        openBook(F, add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), [0, 0.04 * m, 0]));
      } },
      // a basket of toys hanging from the right hand
      basket: { name: 'basket of toys', draw: F => basket(F, 'RightHand', 'basket', true) },
      // Longren's sea chest on his right shoulder, his right hand up on it: a long dark box across the shoulder
      chest_shoulder: { name: 'chest on the shoulder', draw: F => {
        const { add, mul, cross, unit } = V(), m = F.fit.h, s = F.P('RightArm'), up = F.up('Chest');
        const along = F.fwd('Chest'), side = unit(cross(up, along)), c = add(add(s, mul(up, 0.15 * m)), mul(side, 0.04 * m));
        F.ball(c, [side, up, along], [0.17 * m, 0.14 * m, 0.27 * m], [0.31, 0.29, 0.27, 1], 8, 5);
      } },
      // a fishing rod held out in both hands (the right one at its butt), up and out ahead over the water, its line
      // hanging straight down from the tip
      rod: { name: 'fishing rod', draw: F => {
        const { add, mul, unit, mix } = V(), m = F.fit.h, h = F.P('RightHand');
        const dir = unit(mix(F.fwd('Hips'), [0, 1, 0], 0.32)), tip = add(h, mul(dir, 2.3 * m));
        F.bar(add(h, mul(dir, -0.3 * m)), tip, 0.012 * m, 0.004 * m, [[0, WOOD]], 5, F.side('Hips'));
        F.bar(tip, add(tip, [0, -2.6 * m, 0]), 0.0015 * m, 0.0015 * m, [[0, [0.85, 0.85, 0.82, 1]]], 3, F.side('Hips'));
      } },
      // a ring between the fingers of the right hand (Gray's mother's — gold, a small stone)
      ring: { name: 'ring', draw: F => ring(F, 0.011, 0.006, [0.83, 0.66, 0.3, 1]) },
      // …an old man's ring there instead (Gray's own): a broader, heavier band of darker gold; the same point `ring`
      ring_old: { name: 'old ring', draw: F => ring(F, 0.014, 0.011, [0.69, 0.5, 0.2, 1]) },
      // the ring on a cord round her neck, lying on her chest over the dress
      ring_cord: { name: 'ring on a cord', draw: F => {
        const { add, mul } = V(), m = F.fit.h, neck = F.P('Neck1'), uc = F.up('Chest'), fc = F.fwd('Chest'), sc = F.side('Chest');
        const at = F.clear(add(neck, add(mul(uc, -0.17 * m), mul(fc, 0.1 * m))), 1, 0.012 * m);
        for (const s of [-1, 1]) F.bar(add(neck, add(mul(sc, s * 0.05 * m), mul(fc, 0.02 * m))), at, 0.003 * m, 0.003 * m, [[0, DARK]], 4, fc);
        F.ball(at, [sc, uc, fc], [0.013 * m, 0.013 * m, 0.006 * m], [0.83, 0.66, 0.3, 1], 10);
      } },
      // a paintbrush in the right hand, its bristles dipped in paint
      brush: { name: 'brush', draw: F => {
        const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), [s, , f] = axesOf(F, 'RightHand');
        const a = add(h, mul(f, -0.02 * m)), b = add(h, mul(f, 0.17 * m));
        F.bar(a, b, 0.006 * m, 0.005 * m, [[0, WOOD]], 5, s);
        F.bar(b, add(b, mul(f, 0.035 * m)), 0.008 * m, 0.002 * m, [[0, [0.55, 0.42, 0.3, 1]]], 5, s);
      } },
      // a box of paints in the left hand, held flat
      paints: { name: 'paints', draw: F => {
        const { add, mul } = V(), m = F.fit.h, h = F.P('LeftHand'), ax = axesOf(F, 'LeftHand');
        F.ball(add(h, mul(ax[2], 0.05 * m)), ax, [0.09 * m, 0.02 * m, 0.06 * m], [0.42, 0.33, 0.26, 1], 6, 6);
      } },
      // a bundle hanging from the right hand: a cloth knotted round what he takes
      bundle: { name: 'bundle', draw: F => {
        const { add } = V(), m = F.fit.h, h = F.P('RightHand');
        const axes = [F.side('Hips'), [0, 1, 0], F.fwd('Hips')], cloth = [0.6, 0.55, 0.47, 1];
        F.ball(F.swing('bundle', add(h, [0, -0.16 * m, 0]), 70), axes, [0.14 * m, 0.12 * m, 0.11 * m], cloth, 14);
        F.ball(add(h, [0, -0.03 * m, 0]), axes, [0.035 * m, 0.045 * m, 0.035 * m], cloth, 10);
      } },
      // a candle in a small holder, in the right hand before her: its flame glows (tone 2) and is her point `flame` —
      // the scene's light shines from it ("at": "<id>#flame")
      candle: { name: 'candle', draw: F => {
        const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), up = [0, 1, 0], axes = [F.side('Hips'), up, F.fwd('Hips')];
        F.ball(add(h, mul(up, 0.01 * m)), axes, [0.05 * m, 0.012 * m, 0.05 * m], [0.62, 0.52, 0.34, 1], 10);
        F.bar(add(h, mul(up, 0.02 * m)), add(h, mul(up, 0.15 * m)), 0.012 * m, 0.012 * m, [[0, [0.93, 0.9, 0.82, 1]]], 8, axes[0]);
        F.ball(add(h, mul(up, 0.175 * m)), axes, [0.008 * m, 0.02 * m, 0.008 * m], [1, 0.85, 0.5, 2], 8);
        F.point('flame', add(h, mul(up, 0.175 * m)));
      } },
      // a letter held open in both hands before her
      letter: { name: 'letter', draw: F => {
        const { add, mix, unit, sub, cross } = V(), m = F.fit.h, c = add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), [0, 0.05 * m, 0]);
        const n = unit(sub(F.P('Head'), c)), x = unit(cross([0, 1, 0], n)), y = cross(n, x);
        F.ball(c, [x, y, n], [0.1 * m, 0.13 * m, 0.003 * m], [0.92, 0.9, 0.84, 1], 4, 8);
        F.point('letter', c);
      } },
      // the collier's two baskets, one in each hand
      baskets: { name: 'baskets', draw: F => { basket(F, 'RightHand', 'basket_r', false); basket(F, 'LeftHand', 'basket_l', false); } },
      // a baby wrapped in a shawl, on both arms at the chest: lying from the right hand up to the crook of the left
      // arm, its head there
      baby: { name: 'baby', draw: F => {
        const { add, sub, mul, mix, unit, cross } = V(), m = F.fit.h, l = F.P('LeftForeArm'), r = F.P('RightHand');
        const fc = F.fwd('Chest'), lie = sub(l, r), along = Math.hypot(...lie) > 0.08 * m ? unit(lie) : rightOf(F).map(v => -v);
        const c = mix(mix(l, r, 0.5), add(F.P('Chest'), mul(fc, 0.15 * m)), 0.5), up = unit(cross(along, cross([0, 1, 0], along)));
        const axes = [along, up, cross(along, up)], shawl = [0.84, 0.81, 0.74, 1];
        F.ball(c, axes, [0.2 * m, 0.085 * m, 0.09 * m], shawl, 12);
        const head = add(c, add(mul(along, 0.17 * m), mul(up, 0.035 * m)));
        F.ball(head, axes, [0.075 * m, 0.075 * m, 0.075 * m], shawl, 10);
        F.ball(add(head, mul(fc, 0.03 * m)), axes, [0.05 * m, 0.05 * m, 0.055 * m], F.colors.skin, 10);
      } },
      // a fiddle by its neck in the left hand, the bow in the right. Standing, both hang down beside the legs; seated,
      // they lie across the knees
      violin: { name: 'violin and bow', draw: F => {
        const { add, mul, mix, unit, cross } = V(), m = F.fit.h, s = seated(F), right = rightOf(F), fwd = cross([0, 1, 0], right);
        const l = F.P('LeftHand'), r = F.P('RightHand'), left = right.map(v => -v);
        const along = unit(mix([0, -1, 0], right, s)), wide = unit(cross(along, mix(fwd, [0, 1, 0], s))), flat = cross(wide, along), axes = [wide, along, flat];
        F.bar(add(l, mul(along, -0.1 * m)), add(l, mul(along, 0.2 * m)), 0.012 * m, 0.014 * m, [[0, DARK]], 5, flat);
        F.ball(add(l, mul(along, 0.3 * m)), axes, [0.085 * m, 0.11 * m, 0.03 * m], [0.56, 0.3, 0.16, 1], 12);
        F.ball(add(l, mul(along, 0.44 * m)), axes, [0.105 * m, 0.1 * m, 0.03 * m], [0.56, 0.3, 0.16, 1], 12);
        const bow = unit(mix(mix([0, -1, 0], fwd, 0.25), left, s));
        F.bar(add(r, mul(bow, -0.06 * m)), add(r, mul(bow, 0.66 * m)), 0.006 * m, 0.004 * m, [[0, WOOD]], 4, flat);
      } },
      // a cello standing on the floor at the left side, the left hand on its neck
      cello: { name: 'cello', draw: F => {
        const { add, sub, mul, unit, cross } = V(), m = F.fit.h, h = F.P('LeftHand'), right = rightOf(F), fwd = cross([0, 1, 0], right);
        const floor = Math.min(F.P('LeftFoot')[1], F.P('RightFoot')[1]) - 0.06 * m;
        const foot = add([h[0], floor, h[2]], add(mul(right, -0.1 * m), mul(fwd, 0.08 * m)));
        const along = unit(sub(h, foot)), wide = unit(cross(along, fwd)), flat = cross(wide, along), axes = [wide, along, flat], body = [0.5, 0.26, 0.14, 1];
        F.bar(foot, add(foot, mul(along, 0.1 * m)), 0.005 * m, 0.006 * m, [[0, STEEL]], 4, flat);
        F.ball(add(foot, mul(along, 0.33 * m)), axes, [0.21 * m, 0.24 * m, 0.07 * m], body, 14);
        F.ball(add(foot, mul(along, 0.63 * m)), axes, [0.165 * m, 0.19 * m, 0.07 * m], body, 14);
        F.bar(add(foot, mul(along, 0.76 * m)), add(foot, mul(along, 1.22 * m)), 0.022 * m, 0.016 * m, [[0, DARK]], 5, flat);
        F.ball(add(foot, mul(along, 1.24 * m)), axes, [0.03 * m, 0.04 * m, 0.035 * m], body, 8);
      } },
      // his cap in the right hand, held against the chest (in the look's hat colour)
      cap_hand: { name: 'cap in hand', draw: F => {
        const { add, mul } = V(), m = F.fit.h, rh = F.head.r, axes = [F.side('Chest'), F.up('Chest'), F.fwd('Chest')];
        const c = add(F.P('RightHand'), mul(axes[2], 0.04 * m));
        F.ball(c, axes, [rh * 1.0, rh * 0.9, rh * 0.42], F.colors.hat, 12);
        F.ball(add(c, mul(axes[1], -rh * 0.85)), axes, [rh * 0.7, rh * 0.3, rh * 0.1], F.colors.hat, 10);
      } },
      // two oars in the hands of one sitting in a boat: each out to its side from its hand, its blade over the water
      oars: { name: 'oars', draw: F => {
        const { add, mul, unit, cross } = V(), m = F.fit.h, right = rightOf(F), fwd = cross([0, 1, 0], right);
        for (const [hand, s] of [['RightHand', 1], ['LeftHand', -1]]) {
          const h = F.P(hand), out = unit(add(mul(right, s), [0, 0.1, 0])), blade = add(h, mul(out, 2.0 * m));
          F.bar(add(h, mul(out, -0.2 * m)), blade, 0.018 * m, 0.015 * m, [[0, WOOD]], 5, fwd);
          F.ball(add(blade, mul(out, 0.25 * m)), [out, cross(fwd, out), fwd], [0.28 * m, 0.07 * m, 0.012 * m], WOOD, 8);
        }
      } },
    },
  },
};
