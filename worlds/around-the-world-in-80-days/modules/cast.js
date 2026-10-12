// The people of «Вокруг света» as people in a scene (the engine's people.js: an element with "person"): who they are —
// figures of shapes in this world's style, straight-edged and quiet, lit by the scene as its rooms and streets are —
// and how they move: the motions in cast.data.json (Kimodo's, put there with put_motion). cast.md says who is who, what
// each part in the hands is and what each motion is. A part's lengths are a man's metres times F.fit.h (the person's
// height as a share of a man's 1.76 m); the points a part names (F.point) are the person's: "fogg#watch".
// vectors (metres, [x, y, z]) — as MooodShapes.V, which is there only once the people are drawn
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (v, k) => [v[0] * k, v[1] * k, v[2] * k], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = v => mul(v, 1 / (Math.hypot(...v) || 1)), mix = (a, b, u) => add(a, mul(sub(b, a), u));
// colours of the things they carry ([r, g, b, tone]: 1 — taking the light as the clothes do; 2 — glowing, its own colour
// whatever the light: a flame)
const SILVER = [0.78, 0.77, 0.73, 1], GOLD = [0.72, 0.58, 0.3, 1], PAPER = [0.85, 0.82, 0.75, 1], CARD = [0.92, 0.9, 0.85, 1];
const WOOD = [0.3, 0.22, 0.15, 1], FLAME = [1, 0.66, 0.28, 2], LINEN = [0.9, 0.88, 0.83, 1], INK = [0.08, 0.08, 0.1, 1];
// a man's metre on this person: a man's x metres are x * m(F)
const m = F => F.fit.h;
// a hand's axes: across the palm, up it, out of the fingers
const axesOf = (F, hand) => [F.side(hand), F.up(hand), F.fwd(hand)];
// a sheet held in both hands, its middle between them, its plane to the reader's eyes (a newspaper open); its middle the
// person's point `name`
function sheet(F, w, h, colour, name) {
  const L = F.P('LeftHand'), R = F.P('RightHand'), head = F.P('Head'), c = mix(L, R, 0.5);
  const n = unit(sub(head, c)), x0 = unit(sub(R, L));
  const x = unit(sub(x0, mul(n, dot(x0, n)))), y = cross(n, x);
  F.ball(add(c, mul(y, 0.04 * m(F))), [x, y, n], [w * m(F), h * m(F), 0.006 * m(F)], colour, 8, 12);
  F.point(name, c);
}
return {
  ...data,
  characters: {
    // Phileas Fogg: about forty, tall and straight; fair hair and side-whiskers; a dark frock coat open over a white
    // shirt-front; out of doors his top hat (wear {hat: 'tophat'})
    fogg: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt', parts: ['shirtfront', 'whiskers'],
      body: { height: 1.04, shoulders: 1.0, thick: 0.9 },
      colors: { skin: '#d8b496', hair: '#94713f', top: '#e6e1d6', garment: '#1d1f24', bottom: '#2a2b30', shoes: '#141416', hat: '#16171a', accent: '#16171a' } },
    // Passepartout: about thirty, a Parisian, an acrobat once — broad shoulders, a round head, dark curly hair; his
    // livery jacket, short, in a deep blue
    passepartout: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'jacket', hair: 'curls',
      body: { height: 0.96, shoulders: 1.12, thick: 1.06, head: 1.06 },
      colors: { skin: '#dcae8c', hair: '#2b211c', top: '#d9d2c4', garment: '#2f3d58', bottom: '#3b3934', shoes: '#1c1a18', hat: '#2a2622' } },
    // Aouda: young and slight, dark hair in a knot; a sari of deep red, its end over the shoulder in gold
    aouda: { kind: 'shapes', style: 'vokrug', who: 'woman', garment: 'sari', hair: 'bun',
      body: { height: 0.93, shoulders: 0.86, thick: 0.84 },
      colors: { skin: '#b9875f', hair: '#17120f', top: '#7e1f2c', garment: '#7e1f2c', accent: '#b8893a', shoes: '#3a2418' } },
    // Fix: short and thin, a sharp face, thick brows and whiskers; a bowler, a checked overcoat
    fix: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'coat', hair: 'kempt', hat: 'bowler', parts: ['whiskers'],
      body: { height: 0.94, shoulders: 0.94, thick: 0.84 },
      colors: { skin: '#d6ae90', hair: '#3a2c22', garment: '#5e5848', bottom: '#33302b', shoes: '#1a1816', hat: '#1b1a19' } },
    // the gentlemen of the Reform Club, Fogg's partners at whist: frock coats over white shirt-fronts, each his build
    // and his hair. Andrew Stuart, the engineer — grey, broad, side-whiskers
    stuart: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt', parts: ['shirtfront', 'whiskers'],
      body: { height: 1.0, shoulders: 1.06, thick: 1.12 },
      colors: { skin: '#d6aa8a', hair: '#6f6b65', top: '#e4dfd4', garment: '#22201e', bottom: '#2d2b29', shoes: '#151413', accent: '#151413' } },
    // Thomas Flanagan, the brewer — stout, red-haired, a beard
    flanagan: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt', parts: ['shirtfront', 'beard'],
      body: { height: 0.97, shoulders: 1.08, thick: 1.3 },
      colors: { skin: '#dcae90', hair: '#7a4a2c', top: '#e4dfd4', garment: '#26221f', bottom: '#302c28', shoes: '#151413', accent: '#151413' } },
    // Samuel Fallentin, a banker — tall and thin, bald
    fallentin: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'none', parts: ['shirtfront', 'whiskers'],
      body: { height: 1.05, shoulders: 0.96, thick: 0.86 },
      colors: { skin: '#d4ad92', hair: '#6c6258', top: '#e4dfd4', garment: '#1e2026', bottom: '#2a2c31', shoes: '#141416', accent: '#141416' } },
    // John Sullivan, a banker — middling, dark-haired, clean-shaven
    sullivan: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt', parts: ['shirtfront'],
      body: { height: 0.99, shoulders: 1.02, thick: 1.0 },
      colors: { skin: '#d9b294', hair: '#2a2420', top: '#e4dfd4', garment: '#24232a', bottom: '#2c2b30', shoes: '#141416', accent: '#141416' } },
    // Gauthier Ralph, a director of the Bank of England — old, white-haired, a little bent
    ralph: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt', parts: ['shirtfront', 'whiskers'],
      body: { height: 0.97, shoulders: 0.98, thick: 1.0 },
      colors: { skin: '#d8b4a0', hair: '#d4d0c8', top: '#e4dfd4', garment: '#1f1e22', bottom: '#2b2a2e', shoes: '#141416', accent: '#141416' } },
    // Sir Francis Cromarty, brigadier-general: a white uniform, a pith helmet, a grey moustache
    cromarty: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'jacket', hair: 'kempt', hat: 'helmet', parts: ['moustache'],
      body: { height: 1.0, shoulders: 1.04, thick: 1.0 },
      colors: { skin: '#d2a07e', hair: '#b8b2a8', top: '#ddd8c8', garment: '#d6d0bc', bottom: '#cfc9b6', shoes: '#3a2c22', hat: '#e2dcc8' } },
    // the Parsi guide: young and slight, a white turban, a light tunic, barefoot
    guide: { kind: 'shapes', style: 'vokrug', who: 'youth', garment: 'tunic', hair: 'short', hat: 'turban', barefoot: 'both',
      body: { height: 0.95, thick: 0.82 },
      colors: { skin: '#8e6246', hair: '#1a1410', top: '#d8d2c2', bottom: '#cfc6b2', shoes: '#2a1e16', hat: '#e8e2d2' } },
    // the procession (night): a brahmin priest in a saffron robe, his head shaven
    priest: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'robe', hair: 'none',
      body: { height: 0.98, thick: 0.92 },
      colors: { skin: '#8a5e42', top: '#b9611f', garment: '#b9611f', shoes: '#3a2418' } },
    // …a torch-bearer, a drummer: white tunic and dhoti, a turban
    bearer: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'tunic', hair: 'short', hat: 'turban', barefoot: 'both',
      body: { height: 0.96, thick: 0.88 },
      colors: { skin: '#7e5640', hair: '#16110e', top: '#d6cfbd', bottom: '#cfc8b4', hat: '#d9cfb8' } },
    drummer: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'tunic', hair: 'short', hat: 'turban', barefoot: 'both', parts: ['drum'],
      body: { height: 0.95, thick: 0.95 },
      colors: { skin: '#7a523c', hair: '#16110e', top: '#cfc6b0', bottom: '#c8c0aa', hat: '#9c3b24' } },
    // the crowd at the pyre: men and women of the villages
    villager: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'tunic', hair: 'short', hat: 'turban', barefoot: 'both',
      body: { height: 0.95, thick: 0.9 },
      colors: { skin: '#80583f', hair: '#16110e', top: '#c4b89c', bottom: '#b8ad94', hat: '#cdbf9e' } },
    villager_woman: { kind: 'shapes', style: 'vokrug', who: 'woman', garment: 'sari', hair: 'bun', hood: true, barefoot: 'both',
      body: { height: 0.9, thick: 0.86 },
      colors: { skin: '#80583f', hair: '#16110e', top: '#7a4a5a', garment: '#6e4252', accent: '#a8803c' } },
    // the club's porter: a livery coat of dark claret, grey hair
    porter: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt',
      body: { height: 0.98, shoulders: 1.0, thick: 1.04 },
      colors: { skin: '#d6ae90', hair: '#8e8a84', top: '#5a2a2c', garment: '#4c2326', bottom: '#2b2526', shoes: '#151313' } },
  },
  shapes: {
    // the world's style: the engine's flat geometry — straight-edged shapes, flat colours lit by the scene's own light,
    // the engine's face (simple: at rest, or as <id>_mood has it), no lines: as quiet as the rooms they stand in
    styles: { vokrug: { from: 'flat', name: 'Вокруг света', face: 'simple', ground: 'night' } },
    garments: {
      // a frock coat: from the shoulders to the knees, straight, its sleeves of it
      frockcoat: { name: 'сюртук', hang: [{ to: 0.8, from: 'shoulders', flare: 0.1, folds: false }], sleeves: 'garment' },
      // a sari: a skirt to the ground from the waist, the bodice of it, and its end (the pallu) from the right hip over the
      // breast to the left shoulder and down the back, in the look's accent
      sari: { name: 'сари', hang: [{ to: 1.95, from: 'waist', flare: 0.3, off: 0.96 }], sleeves: 'garment', short: true, bare: true, bodice: true,
        draw: F => {
          const s = F.side('Chest'), f = F.fwd('Chest'), k = m(F), hip = add(F.P('Hips'), mul(F.side('Hips'), 0.13 * k));
          const sh = add(F.P('LeftShoulder'), mul(F.up('Chest'), 0.03 * k));
          const front = [hip, mix(hip, sh, 0.35), mix(hip, sh, 0.7)].map(p => F.clear(p, 1, 0.012 * k));
          const back = F.clear(F.swing('pallu', add(sh, add(mul(f, -0.14 * k), [0, -0.42 * k, 0])), 90), -1, 0.02 * k);
          F.tube([...front, sh, mix(sh, back, 0.5), back], [[0, 0.07 * k], [3, 0.075 * k], [5, 0.085 * k]], [[0, F.colors.accent]], 8, s, 0.18, 4, true);
        } },
    },
    hair: {
      // a gentleman's hair: smoothed back from the brow over the crown and down to the nape, close to the head
      kempt: { name: 'приглаженные', draw: F => {
        const { at, axes, egg, r, out, sides, square } = F.head;
        F.cap(at, axes, egg.map(e => e * r * out * 1.05), [0, 0.8, -0.36], -0.05, F.colors.hair, sides, square);
      } },
      // dark curls: a close cap of them, round, a little fuller than short hair
      curls: { name: 'кудри', draw: F => {
        const { at, axes, egg, r, out, sides, square } = F.head;
        F.cap(at, axes, egg.map(e => e * r * out * 1.12), [0, 0.8, -0.6], -0.2, F.colors.hair, sides, square);
      } },
    },
    hats: {
      // a top hat: a narrow brim at the brow, a tall straight crown, its top flat
      tophat: { name: 'цилиндр', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, 0.05))), ax = [hs, tilt, cross(hs, tilt)];
        const base = add(at, mul(hu, r * 0.42)), top = add(base, mul(tilt, r * 1.7));
        F.ball(base, ax, [r * 1.32, r * 0.05, r * 1.22], F.colors.hat, F.sides * 2);
        F.tube([add(base, mul(tilt, r * 0.02)), top], [[0, r * 0.84], [1, r * 0.88]], [[0, F.colors.hat]], F.sides, hs, 0.92, 2, true);
        F.ball(top, ax, [r * 0.88, r * 0.02, r * 0.81], F.colors.hat, F.sides);
      } },
      // a bowler: a dome over the crown, a short curled brim
      bowler: { name: 'котелок', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, 0.06))), ax = [hs, tilt, cross(hs, tilt)];
        const base = add(at, mul(hu, r * 0.36));
        F.ball(base, ax, [r * 1.25, r * 0.06, r * 1.18], F.colors.hat, F.sides * 2);
        F.cap(base, ax, [r * 0.92, r * 0.9, r * 0.95], [0, 1, 0], 0, F.colors.hat, F.sides);
      } },
      // a pith helmet: a dome over the crown, a brim all round, longer behind
      helmet: { name: 'пробковый шлем', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, ax = [hs, hu, hf];
        F.ball(add(at, add(mul(hu, r * 0.3), mul(hf, -r * 0.1))), ax, [r * 1.45, r * 0.06, r * 1.55], F.colors.hat, F.sides * 2);
        F.cap(add(at, mul(hu, r * 0.28)), ax, [r * 1.08, r * 1.0, r * 1.15], [0, 1, 0], 0, F.colors.hat, F.sides);
      } },
      // a turban: wound round the crown, high and full
      turban: { name: 'тюрбан', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head;
        F.ball(add(at, mul(hu, r * 0.48)), [hs, hu, hf], [r * 1.12, r * 0.62, r * 1.14], F.colors.hat, F.sides);
        F.ball(add(at, add(mul(hu, r * 0.82), mul(hf, -r * 0.1))), [hs, hu, hf], [r * 0.8, r * 0.45, r * 0.85], F.colors.hat, F.sides);
      } },
    },
    parts: {
      // a white shirt-front in the open frock coat — wide under the collar, narrowing down to the waistcoat — and a black
      // tie at its top
      shirtfront: { name: 'манишка', draw: F => {
        const k = m(F), sd = F.side('Chest'), n = F.P('Neck1'), c = F.P('Chest');
        const top = F.clear(mix(n, c, 0.15), 1, 0.006 * k), low = F.clear(mix(n, c, 1.15), 1, 0.006 * k);
        F.tube([top, mix(top, low, 0.5), low], [[0, 0.065 * k], [1, 0.04 * k], [2, 0.006 * k]], [[0, F.colors.top]], 6, sd, 0.12);
        F.ball(F.clear(mix(n, c, 0.12), 1, 0.014 * k), [sd, F.up('Chest'), F.fwd('Chest')], [0.04 * k, 0.016 * k, 0.012 * k], F.colors.accent, 8);
      } },
      // side-whiskers: down the cheeks from the hair to the jaw
      whiskers: { name: 'бакенбарды', draw: F => {
        const { at, axes, r, out } = F.head, [hs, hu, hf] = axes, rr = r * out;
        for (const s of [-1, 1]) F.ball(add(at, add(add(mul(hs, s * rr * 0.9), mul(hu, -rr * 0.3)), mul(hf, rr * 0.12))), axes, [rr * 0.09, rr * 0.36, rr * 0.17], F.colors.hair, 10);
      } },
      // a moustache under the nose
      moustache: { name: 'усы', draw: F => {
        const { at, axes, r, out } = F.head, [, hu, hf] = axes, rr = r * out;
        F.ball(add(at, add(mul(hu, -rr * 0.38), mul(hf, rr * 0.9))), axes, [rr * 0.42, rr * 0.1, rr * 0.14], F.colors.hair, 10);
      } },
      // a drum hanging at the waist before the belly, played with both hands
      drum: { name: 'барабан', draw: F => {
        const k = m(F), f = F.fwd('Hips'), s = F.side('Hips'), c = add(add(F.P('Hips'), mul(f, 0.2 * k)), [0, 0.06 * k, 0]);
        F.bar(add(c, mul(s, -0.17 * k)), add(c, mul(s, 0.17 * k)), 0.12 * k, 0.12 * k, [[0, [0.55, 0.36, 0.2, 1]]], 14, f);
      } },
      // a full beard: over the jaw and the chin
      beard: { name: 'борода', draw: F => {
        const h = F.head, [, hu, hf] = h.axes, r = h.r * h.out;
        F.cap(h.at, h.axes, h.egg.map(e => e * r * 1.05), [0, -0.55, 0.83], 0.25, F.colors.hair, h.sides, h.square);
        F.ball(add(h.at, add(mul(hu, -r * 0.85), mul(hf, r * 0.45))), h.axes, [r * 0.55, r * 0.42, r * 0.38], F.colors.hair, h.sides);
      } },
      // a pocket watch open in the right palm, held to be read — its face turned to its owner's eyes, twelve away from
      // the wrist: the silver case, the white dial with its two hands, the bow at twelve with the chain going from it to
      // the waistcoat, the lid standing open at its side; its point watch
      watch: { name: 'часы', draw: F => {
        const k = m(F), hand = axesOf(F, 'RightHand'), c = add(add(F.P('RightHand'), mul(hand[2], 0.05 * k)), mul(hand[1], 0.025 * k));
        const n = unit(sub(F.P('Head'), c)), z = unit(sub(hand[2], mul(n, dot(hand[2], n)))), x = cross(n, z), ax = [x, n, z], R = 0.03 * k;
        F.ball(c, ax, [R, 0.007 * k, R], SILVER, 16);
        F.ball(add(c, mul(n, 0.006 * k)), ax, [R * 0.84, 0.003 * k, R * 0.84], [0.95, 0.93, 0.88, 0], 16);
        // (the hands, at ten past ten)
        const pin = add(c, mul(n, 0.0095 * k)), to = (a, len) => add(pin, add(mul(z, Math.cos(a) * len), mul(x, Math.sin(a) * len)));
        F.bar(pin, to(-0.97, R * 0.46), 0.0022 * k, 0.0016 * k, [[0, INK]], 4, n);
        F.bar(pin, to(0.94, R * 0.72), 0.0016 * k, 0.001 * k, [[0, INK]], 4, n);
        const bow = add(c, mul(z, R + 0.005 * k)), vest = F.clear(add(F.P('Spine1'), mul(F.up('Spine1'), 0.02 * k)), 1, 0.006 * k);
        F.ball(bow, ax, [0.007 * k, 0.004 * k, 0.007 * k], SILVER, 8);
        F.tube([bow, add(mix(bow, vest, 0.5), [0, -0.05 * k, 0]), vest], [[0, 0.002 * k], [2, 0.002 * k]], [[0, SILVER]], 4, x);
        const up = unit(add(mul(n, 0.94), mul(x, -0.34)));
        F.ball(add(add(c, mul(x, -R)), mul(up, R)), [z, cross(z, up), up], [R, 0.004 * k, R], SILVER, 16);
        F.point('watch', c);
      } },
      // the same, shut in the hand; its point watch
      watch_shut: { name: 'часы закрыты', draw: F => {
        const k = m(F), ax = axesOf(F, 'RightHand'), c = add(add(F.P('RightHand'), mul(ax[2], 0.05 * k)), mul(ax[1], 0.02 * k));
        F.ball(c, ax, [0.026 * k, 0.012 * k, 0.026 * k], SILVER, 14);
        F.point('watch', c);
      } },
      // a hand of cards fanned in the left hand
      cards: { name: 'карты', draw: F => {
        const k = m(F), ax = axesOf(F, 'LeftHand'), c = add(add(F.P('LeftHand'), mul(ax[2], 0.07 * k)), mul(ax[1], 0.03 * k));
        F.ball(c, ax, [0.004 * k, 0.07 * k, 0.06 * k], CARD, 8, 6);
      } },
      // Fix's badge, shown in the right palm: a small gilt oval; its point badge
      badge: { name: 'значок', draw: F => {
        const k = m(F), ax = axesOf(F, 'RightHand'), c = add(add(F.P('RightHand'), mul(ax[2], 0.05 * k)), mul(ax[1], 0.02 * k));
        F.ball(c, ax, [0.03 * k, 0.006 * k, 0.04 * k], GOLD, 12);
        F.point('badge', c);
      } },
      // a newspaper open in both hands; its point paper
      newspaper: { name: 'газета', draw: F => sheet(F, 0.3, 0.21, PAPER, 'paper') },
      // the same folded, in the left hand
      newspaper_folded: { name: 'газета сложена', draw: F => {
        const k = m(F), ax = axesOf(F, 'LeftHand');
        F.ball(add(F.P('LeftHand'), mul(ax[2], 0.1 * k)), ax, [0.012 * k, 0.12 * k, 0.15 * k], PAPER, 8, 6);
      } },
      // the carpet bag in the right hand — the twenty thousand in it: hanging from the fist by its handles, swinging; its
      // point bag
      bag: { name: 'саквояж', draw: F => {
        const k = m(F), hand = F.P('RightHand'), low = F.swing('bag', add(hand, [0, -0.2 * k, 0]), 70);
        const down = unit(sub(low, hand)), side = unit(cross(down, F.fwd('Hips'))), up = mul(down, -1), ax = [unit(cross(up, side)), up, side];
        const body = [0.48, 0.28, 0.24, 1], trim = [0.2, 0.15, 0.12, 1];
        F.ball(add(hand, mul(down, 0.21 * k)), ax, [0.25 * k, 0.17 * k, 0.11 * k], body, 12, 3.2);
        F.point('bag', add(hand, mul(down, 0.21 * k)));
        F.tube([add(add(hand, mul(down, 0.07 * k)), mul(ax[0], -0.07 * k)), hand, add(add(hand, mul(down, 0.07 * k)), mul(ax[0], 0.07 * k))], [[0, 0.008 * k], [2, 0.008 * k]], [[0, trim]], 6, side);
      } },
      // a bundle in the left hand: a cloth knotted round what he has, hanging from the fist
      bundle: { name: 'узелок', draw: F => {
        const k = m(F), hand = F.P('LeftHand'), low = F.swing('bundle', add(hand, [0, -0.15 * k, 0]), 80);
        const axes = [F.side('Hips'), [0, 1, 0], F.fwd('Hips')], cloth = [0.5, 0.46, 0.38, 1];
        F.ball(mix(hand, low, 1.1), axes, [0.13 * k, 0.11 * k, 0.1 * k], cloth, 14);
        F.ball(add(hand, [0, -0.03 * k, 0]), axes, [0.035 * k, 0.045 * k, 0.035 * k], cloth, 10);
      } },
      // a top hat held in the left hand by its brim
      tophat_hand: { name: 'цилиндр в руке', draw: F => {
        const k = m(F), ax = axesOf(F, 'LeftHand'), c = add(F.P('LeftHand'), mul(ax[2], 0.06 * k)), r = 0.105 * k;
        F.ball(c, ax, [r * 1.3, r * 0.05, r * 1.2], F.colors.hat, 16);
        F.tube([c, add(c, mul(ax[1], -r * 1.7))], [[0, r * 0.84], [1, r * 0.88]], [[0, F.colors.hat]], 12, ax[0], 0.92, 2, true);
      } },
      // a torch in the right hand: a staff up out of the fist, its head of pitch-soaked rag glowing on it; its point flame,
      // where it burns (the scene's fire there: particles "at": "<id>#flame", a light "at" it)
      torch: { name: 'факел', draw: F => {
        const k = m(F), hand = F.P('RightHand'), up = unit(add(F.up('RightHand'), [0, 0.6, 0])), side = F.side('RightHand');
        const top = add(hand, mul(up, 0.42 * k)), head = add(top, mul(up, 0.06 * k));
        F.bar(add(hand, mul(up, -0.14 * k)), top, 0.016 * k, 0.02 * k, [[0, WOOD]], 6, side);
        F.ball(head, [side, up, unit(cross(side, up))], [0.045 * k, 0.09 * k, 0.045 * k], FLAME, 10);
        F.point('flame', add(head, mul(up, 0.06 * k)));
      } },
      // a book (Fogg's notebook, a novel on the train) open in both hands; its point book
      book: { name: 'книжка', draw: F => sheet(F, 0.13, 0.1, LINEN, 'book') },
      // an elephant goad: a short staff with a hook, in the right hand
      goad: { name: 'крюк', draw: F => {
        const k = m(F), hand = F.P('RightHand'), d = F.fwd('RightHand'), side = F.side('RightHand'), tip = add(hand, mul(d, 0.5 * k));
        F.bar(add(hand, mul(d, -0.08 * k)), tip, 0.012 * k, 0.01 * k, [[0, WOOD]], 6, side);
        F.tube([tip, add(tip, mul(d, 0.05 * k)), add(add(tip, mul(d, 0.05 * k)), mul(F.up('RightHand'), -0.05 * k))], [[0, 0.007 * k], [2, 0.004 * k]], [[0, SILVER]], 6, side);
      } },
      // a gold chain across the waistcoat (Fogg's watch in its pocket)
      chain: { name: 'цепочка', draw: F => {
        const k = m(F), s = F.side('Spine1'), c = add(F.P('Spine1'), mul(F.up('Spine1'), 0.02 * k));
        F.tube([-1, 0, 1].map(u => F.clear(add(c, add(mul(s, u * 0.07 * k), [0, -0.02 * k * (1 - u * u), 0])), 1, 0.006 * k)), [[0, 0.004 * k], [2, 0.004 * k]], [[0, GOLD]], 5, s);
      } },
    },
  },
};
