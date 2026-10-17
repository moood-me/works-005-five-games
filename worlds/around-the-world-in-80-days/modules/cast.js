// The people of «Around the World» as people in a scene (the engine's people.js: an element with "person"): who they are —
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
    // Passepartout in the costume of the Long Noses (Yokohama): tights of the troupe's red, wings at his back, the nose
    // (a whole look: passepartout_wear = scene.kit.cast.characters.passepartout_nose)
    passepartout_nose: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'none', hair: 'curls', parts: ['wings', 'long_nose'],
      body: { height: 0.96, shoulders: 1.12, thick: 1.06, head: 1.06 },
      colors: { skin: '#dcae8c', hair: '#2b211c', top: '#b8452f', bottom: '#b8452f', shoes: '#2a1c16', accent: '#e0b84a' } },
    // the British consul at Suez: a light frock coat, a pith helmet, side-whiskers
    consul: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'kempt', hat: 'helmet', parts: ['shirtfront', 'whiskers'],
      body: { height: 0.99, shoulders: 1.02, thick: 1.12 },
      colors: { skin: '#dcae90', hair: '#8a7a64', top: '#ece8dc', garment: '#cfc4a8', bottom: '#bfb49a', shoes: '#3a2c22', hat: '#ebe5d2', accent: '#2a2622' } },
    // Kiouni's owner: an old Indian, a white beard, a white turban, a dark cloak to the ground, barefoot
    owner: { kind: 'shapes', style: 'vokrug', who: 'old', garment: 'robe', hair: 'short', hat: 'turban', barefoot: 'both', parts: ['beard'],
      body: { height: 0.95, shoulders: 0.96, thick: 0.92 },
      colors: { skin: '#7e5640', hair: '#ece8e0', top: '#4a3f36', garment: '#3c332c', bottom: '#4a3f36', hat: '#efeadf' } },
    // the trader at Allahabad: stout, a bright turban, a motley robe, a sash
    trader: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'robe', hair: 'short', hat: 'turban', parts: ['moustache', 'sash'],
      body: { height: 0.97, shoulders: 1.08, thick: 1.38 },
      colors: { skin: '#86593e', hair: '#1a1410', top: '#2f6a5a', garment: '#2f6a5a', bottom: '#d8ccb0', shoes: '#5a3a22', hat: '#e2a12c', accent: '#b8402e' } },
    // the conductor of the Indian line: a white tunic-jacket, a dark peaked cap, a moustache
    conductor: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap', parts: ['moustache'],
      body: { height: 0.98, thick: 0.98 },
      colors: { skin: '#c99a76', hair: '#2a211a', top: '#ece8de', garment: '#ece8de', bottom: '#ddd8cc', shoes: '#1e1a18', hat: '#22283a' } },
    // John Bunsby, the pilot: weathered and ruddy, a grey beard, a yellow sou'wester, a pea jacket, a pipe in his teeth
    bunsby: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'jacket', hair: 'short', hat: 'souwester', parts: ['beard', 'pipe'],
      body: { height: 0.97, shoulders: 1.1, thick: 1.16 },
      colors: { skin: '#c4805e', hair: '#9a948a', top: '#cfc6b0', garment: '#26324a', bottom: '#2c2a2a', shoes: '#1a1716', hat: '#d8a92c' } },
    // a Hong Kong boatman: a wide conical straw hat, a blue jacket, barefoot; his lantern (with: ['lantern'])
    boatman: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'jacket', hair: 'short', hat: 'straw', barefoot: 'both',
      body: { height: 0.94, thick: 0.86 },
      colors: { skin: '#c49a6c', hair: '#151210', top: '#2f5486', garment: '#2f5486', bottom: '#2c3440', hat: '#cdb27a' } },
    // Batulcar, the showman: a top hat, a waistcoat over shirt-sleeves, long moustaches
    batulcar: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'waistcoat', hair: 'kempt', hat: 'tophat', parts: ['mustachios'],
      body: { height: 1.0, shoulders: 1.06, thick: 1.2 },
      colors: { skin: '#d9aa86', hair: '#2a1e18', top: '#ece6d6', garment: '#8a2230', bottom: '#2a2830', shoes: '#141414', hat: '#1a1a1e' } },
    // an acrobat of the Long Noses: tights, wings at his back, the nose two metres long. His colours his own:
    // person.look.colors (top and bottom — the tights, accent — the wings; cast.md has six)
    nose: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'none', hair: 'short', parts: ['wings', 'long_nose'],
      body: { height: 0.95, shoulders: 1.04, thick: 0.92 },
      colors: { skin: '#d8ae86', hair: '#151210', top: '#3d5f9a', bottom: '#3d5f9a', shoes: '#1c1a20', accent: '#e0b84a' } },
    // a sailor: a flat round cap, a striped shirt
    sailor: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'none', hair: 'short', hat: 'sailorcap', parts: ['stripes'],
      body: { height: 0.96, thick: 0.94 },
      colors: { skin: '#d2a07e', hair: '#3a2a1e', top: '#ece8e0', bottom: '#2a3044', shoes: '#1a1818', hat: '#1f2a44', accent: '#24314e' } },
    // Captain Speedy of the Henrietta: big, a red beard, a peaked cap, a pea jacket
    speedy: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'jacket', hair: 'short', hat: 'cap', parts: ['beard'],
      body: { height: 1.04, shoulders: 1.14, thick: 1.3 },
      colors: { skin: '#d49a78', hair: '#b4502a', top: '#cfc8b8', garment: '#1f2a40', bottom: '#262a34', shoes: '#151413', hat: '#1b2236' } },
    // a stoker: no jacket, his sleeves rolled up, soot on his face
    stoker: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'rolled', hair: 'short', parts: ['soot'],
      body: { height: 0.97, shoulders: 1.1, thick: 1.12 },
      colors: { skin: '#c8987a', hair: '#201a16', top: '#b8b2a4', bottom: '#33302c', shoes: '#151413' } },
    // a Liverpool constable: a tall helmet, a dark tunic to the knee
    policeman: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'short', hat: 'custodian', parts: ['whiskers'],
      body: { height: 1.02, shoulders: 1.04, thick: 1.0 },
      colors: { skin: '#d8ae90', hair: '#4a3a2c', top: '#1e2536', garment: '#1e2536', bottom: '#1b2030', shoes: '#111114', hat: '#1b2232', accent: '#b8a46a' } },
    // the driver of an American locomotive: overalls, a cap, a beard
    driver: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'none', hair: 'short', hat: 'cap', parts: ['beard'],
      body: { height: 1.0, shoulders: 1.08, thick: 1.08 },
      colors: { skin: '#d0a07e', hair: '#4a3626', top: '#3f5878', bottom: '#3f5878', shoes: '#1c1814', hat: '#3a3a3c' } },
    // the captain at Fort Kearney: a blue frock coat, a wide-brimmed hat, a moustache
    captain: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'frockcoat', hair: 'short', hat: 'hat', parts: ['moustache'],
      body: { height: 1.02, shoulders: 1.04, thick: 1.0 },
      colors: { skin: '#d4a684', hair: '#6a4e34', top: '#24345e', garment: '#24345e', bottom: '#5f7194', shoes: '#141414', hat: '#2a2622' } },
    // a soldier of the fort: a sky-blue greatcoat, a kepi; his rifle (with: ['rifle'])
    soldier: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'coat', hair: 'short', hat: 'kepi',
      body: { height: 0.98, thick: 0.96 },
      colors: { skin: '#d4a684', hair: '#3a2c20', top: '#24345e', garment: '#6f84a6', bottom: '#5f7194', shoes: '#141414', hat: '#22305a' } },
    // Mudge, the owner of the sledge: a fur coat, a fur hat, a beard
    mudge: { kind: 'shapes', style: 'vokrug', who: 'man', garment: 'coat', hair: 'short', hat: 'fur', parts: ['beard'],
      body: { height: 1.0, shoulders: 1.1, thick: 1.3 },
      colors: { skin: '#d2a07e', hair: '#5e4430', top: '#6e5640', garment: '#6a5038', bottom: '#3a3028', shoes: '#241c16', hat: '#4a3626' } },
  },
  // what is put on over a look as the game's keys say (<id>_wear: a scene's own key turned into these) — fields over the
  // cast's look: Aouda's travelling dress (aouda_dress), Fix's bruise (fix_bruise), Passepartout's wings (pp_wings),
  // the whole costume is characters.passepartout_nose
  wears: {
    aouda_dress: { garment: 'dress', hood: false, colors: { top: '#3c4a5e', garment: '#3c4a5e', accent: '#b8893a', shoes: '#2a2018' } },
    fix_bruise: { parts: ['whiskers', 'bruise'] },
    pp_wings: { parts: ['wings'] },
  },
  shapes: {
    // the world's style: the engine's flat geometry — straight-edged shapes, flat colours lit by the scene's own light,
    // the engine's face (simple: at rest, or as <id>_mood has it), no lines: as quiet as the rooms they stand in
    // — with a big head (the face reads at a distance: eyes, brows, nose, mouth) and fuller arms and legs
    styles: { vokrug: { from: 'flat', name: 'Around the World', face: 'simple', ground: 'night', head: 1.34, neck: 0.6, limb: 1.15 } },
    garments: {
      // a waistcoat over the shirt-sleeves: the trunk in the garment's colour to the waist, the sleeves the shirt's
      waistcoat: { name: 'waistcoat', hang: [{ to: 0.06, from: 'shoulders', flare: 0.04, folds: false }] },
      // no jacket, the shirt's sleeves rolled up (the forearms bare)
      rolled: { name: 'sleeves rolled up', short: true },
      // a frock coat: from the shoulders to the knees, straight, its sleeves of it
      frockcoat: { name: 'frock-coat', hang: [{ to: 0.8, from: 'shoulders', flare: 0.1, folds: false }], sleeves: 'garment' },
      // a sari: a skirt to the ground from the waist, the bodice of it, and its end (the pallu) from the right hip over the
      // breast to the left shoulder and down the back, in the look's accent
      sari: { name: 'sari', hang: [{ to: 1.95, from: 'waist', flare: 0.3, off: 0.96 }], sleeves: 'garment', short: true, bare: true, bodice: true,
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
      kempt: { name: 'smoothed back', draw: F => {
        const { at, axes, egg, r, out, sides, square } = F.head;
        F.cap(at, axes, egg.map(e => e * r * out * 1.05), [0, 0.8, -0.36], -0.05, F.colors.hair, sides, square);
      } },
      // dark curls: a close cap of them, round, a little fuller than short hair
      curls: { name: 'curls', draw: F => {
        const { at, axes, egg, r, out, sides, square } = F.head;
        F.cap(at, axes, egg.map(e => e * r * out * 1.12), [0, 0.8, -0.6], -0.2, F.colors.hair, sides, square);
      } },
    },
    hats: {
      // a top hat: a narrow brim at the brow, a tall straight crown, its top flat
      tophat: { name: 'top hat', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, 0.05))), ax = [hs, tilt, cross(hs, tilt)];
        const base = add(at, mul(hu, r * 0.42)), top = add(base, mul(tilt, r * 1.7));
        F.ball(base, ax, [r * 1.32, r * 0.05, r * 1.22], F.colors.hat, F.sides * 2);
        F.tube([add(base, mul(tilt, r * 0.02)), top], [[0, r * 0.84], [1, r * 0.88]], [[0, F.colors.hat]], F.sides, hs, 0.92, 2, true);
        F.ball(top, ax, [r * 0.88, r * 0.02, r * 0.81], F.colors.hat, F.sides);
      } },
      // a bowler: a dome over the crown, a short curled brim
      bowler: { name: 'bowler', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, 0.06))), ax = [hs, tilt, cross(hs, tilt)];
        const base = add(at, mul(hu, r * 0.36));
        F.ball(base, ax, [r * 1.25, r * 0.06, r * 1.18], F.colors.hat, F.sides * 2);
        F.cap(base, ax, [r * 0.92, r * 0.9, r * 0.95], [0, 1, 0], 0, F.colors.hat, F.sides);
      } },
      // a pith helmet: a dome over the crown, a brim all round, longer behind
      helmet: { name: 'pith helmet', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, ax = [hs, hu, hf];
        F.ball(add(at, add(mul(hu, r * 0.3), mul(hf, -r * 0.1))), ax, [r * 1.45, r * 0.06, r * 1.55], F.colors.hat, F.sides * 2);
        F.cap(add(at, mul(hu, r * 0.28)), ax, [r * 1.08, r * 1.0, r * 1.15], [0, 1, 0], 0, F.colors.hat, F.sides);
      } },
      // a turban: wound round the crown, high and full
      turban: { name: 'turban', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head;
        F.ball(add(at, mul(hu, r * 0.48)), [hs, hu, hf], [r * 1.12, r * 0.62, r * 1.14], F.colors.hat, F.sides);
        F.ball(add(at, add(mul(hu, r * 0.82), mul(hf, -r * 0.1))), [hs, hu, hf], [r * 0.8, r * 0.45, r * 0.85], F.colors.hat, F.sides);
      } },
      // a sou'wester: a round crown, the brim wide all round and longest behind, sloping down over the nape
      souwester: { name: 'sou\'wester', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, -0.3))), ax = [hs, tilt, cross(hs, tilt)];
        F.cap(add(at, mul(hu, r * 0.22)), [hs, hu, hf], [r * 1.1, r * 1.02, r * 1.12], [0, 1, 0], 0, F.colors.hat, F.sides);
        F.ball(add(at, add(mul(hu, r * 0.24), mul(hf, -r * 0.3))), ax, [r * 1.5, r * 0.06, r * 1.75], F.colors.hat, F.sides * 2);
      } },
      // a wide conical straw hat: a low cone, its rim far out over the shoulders
      straw: { name: 'straw hat', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, rim = add(at, mul(hu, r * 0.5)), top = add(at, mul(hu, r * 1.45));
        F.tube([top, rim], [[0, r * 0.06], [1, r * 2.3]], [[0, F.colors.hat]], F.sides * 2, hs);
        F.ball(rim, [hs, hu, hf], [r * 2.3, r * 0.03, r * 2.3], F.colors.hat, F.sides * 2);
      } },
      // a sailor's flat round cap with no peak: a band round the head, a flat crown a little wider, two ribbons behind
      sailorcap: { name: 'sailor\'s cap', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, -0.12))), ax = [hs, tilt, cross(hs, tilt)];
        F.ball(add(at, mul(tilt, r * 0.5)), ax, [r * 1.02, r * 0.16, r * 1.04], F.colors.accent, F.sides);
        F.ball(add(at, mul(tilt, r * 0.72)), ax, [r * 1.2, r * 0.13, r * 1.18], F.colors.hat, F.sides * 2);
        for (const s of [-1, 1]) {
          const from = add(add(at, mul(tilt, r * 0.45)), add(mul(hf, -r * 1.0), mul(hs, s * r * 0.15)));
          F.tube([from, add(from, add(mul(hu, -r * 0.7), mul(hf, -r * 0.15)))], [[0, r * 0.06], [1, r * 0.06]], [[0, F.colors.accent]], 4, hs, 0.25);
        }
      } },
      // a constable's tall helmet: a high dome over the crown, a narrow brim, a badge before
      custodian: { name: 'constable\'s helmet', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, ax = [hs, hu, hf];
        F.ball(add(at, mul(hu, r * 0.3)), ax, [r * 1.25, r * 0.05, r * 1.3], F.colors.hat, F.sides * 2);
        F.cap(add(at, mul(hu, r * 0.3)), ax, [r * 1.05, r * 1.55, r * 1.12], [0, 1, 0], 0, F.colors.hat, F.sides);
        F.ball(add(at, add(mul(hu, r * 1.05), mul(hf, r * 1.0))), ax, [r * 0.2, r * 0.24, r * 0.06], F.colors.accent, 10);
      } },
      // a kepi: a short crown leaning forward, flat on top, a small peak
      kepi: { name: 'kepi', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head, tilt = unit(add(hu, mul(hf, 0.35))), ax = [hs, tilt, cross(hs, tilt)];
        const base = add(at, mul(hu, r * 0.3)), top = add(base, mul(tilt, r * 0.95));
        F.tube([base, top], [[0, r * 1.0], [1, r * 0.82]], [[0, F.colors.hat]], F.sides, hs, 0.92, 2, true);
        F.ball(top, ax, [r * 0.82, r * 0.03, r * 0.8], F.colors.hat, F.sides);
        F.ball(add(base, mul(hf, r * 0.9)), [hs, unit(add(hu, mul(hf, -0.4))), unit(add(hf, mul(hu, 0.4)))], [r * 0.72, r * 0.05, r * 0.42], [0.08, 0.08, 0.1, 1], F.sides);
      } },
      // a round fur hat, big over the crown and the ears
      fur: { name: 'fur cap', draw: F => {
        const { at, axes: [hs, hu, hf], r } = F.head;
        F.ball(add(at, add(mul(hu, r * 0.78), mul(hf, -r * 0.1))), [hs, hu, hf], [r * 1.22, r * 0.72, r * 1.24], F.colors.hat, F.sides);
      } },
    },
    parts: {
      // a white shirt-front in the open frock coat — wide under the collar, narrowing down to the waistcoat — and a black
      // tie at its top
      shirtfront: { name: 'shirt-front', draw: F => {
        const k = m(F), sd = F.side('Chest'), n = F.P('Neck1'), c = F.P('Chest');
        const top = F.clear(mix(n, c, 0.15), 1, 0.006 * k), low = F.clear(mix(n, c, 1.15), 1, 0.006 * k);
        F.tube([top, mix(top, low, 0.5), low], [[0, 0.065 * k], [1, 0.04 * k], [2, 0.006 * k]], [[0, F.colors.top]], 6, sd, 0.12);
        F.ball(F.clear(mix(n, c, 0.12), 1, 0.014 * k), [sd, F.up('Chest'), F.fwd('Chest')], [0.04 * k, 0.016 * k, 0.012 * k], F.colors.accent, 8);
      } },
      // side-whiskers: down the cheeks from the hair to the jaw
      whiskers: { name: 'whiskers', draw: F => {
        const { at, axes, r, out } = F.head, [hs, hu, hf] = axes, rr = r * out;
        for (const s of [-1, 1]) F.ball(add(at, add(add(mul(hs, s * rr * 0.9), mul(hu, -rr * 0.3)), mul(hf, rr * 0.12))), axes, [rr * 0.09, rr * 0.36, rr * 0.17], F.colors.hair, 10);
      } },
      // a moustache under the nose
      moustache: { name: 'moustache', draw: F => {
        const { at, axes, r, out } = F.head, [, hu, hf] = axes, rr = r * out;
        F.ball(add(at, add(mul(hu, -rr * 0.38), mul(hf, rr * 0.9))), axes, [rr * 0.42, rr * 0.1, rr * 0.14], F.colors.hair, 10);
      } },
      // a drum hanging at the waist before the belly, played with both hands
      drum: { name: 'drum', draw: F => {
        const k = m(F), f = F.fwd('Hips'), s = F.side('Hips'), c = add(add(F.P('Hips'), mul(f, 0.2 * k)), [0, 0.06 * k, 0]);
        F.bar(add(c, mul(s, -0.17 * k)), add(c, mul(s, 0.17 * k)), 0.12 * k, 0.12 * k, [[0, [0.55, 0.36, 0.2, 1]]], 14, f);
      } },
      // a full beard: over the jaw, the cheeks and the chin, below the nose (the eyes and the nose clear of it)
      beard: { name: 'beard', draw: F => {
        const h = F.head, [, hu, hf] = h.axes, r = h.r * h.out;
        F.cap(h.at, h.axes, h.egg.map(e => e * r * 1.05), [0, -0.85, 0.53], 0.65, F.colors.hair, h.sides, h.square);
        F.ball(add(h.at, add(mul(hu, -r * 0.85), mul(hf, r * 0.45))), h.axes, [r * 0.55, r * 0.42, r * 0.38], F.colors.hair, h.sides);
      } },
      // a pocket watch open in the right palm, held to be read — its face turned to its owner's eyes, twelve away from
      // the wrist: the silver case, the white dial with its two hands, the bow at twelve with the chain going from it to
      // the waistcoat, the lid standing open at its side; its point watch
      watch: { name: 'watch', draw: F => {
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
      watch_shut: { name: 'watch shut', draw: F => {
        const k = m(F), ax = axesOf(F, 'RightHand'), c = add(add(F.P('RightHand'), mul(ax[2], 0.05 * k)), mul(ax[1], 0.02 * k));
        F.ball(c, ax, [0.026 * k, 0.012 * k, 0.026 * k], SILVER, 14);
        F.point('watch', c);
      } },
      // a hand of cards fanned in the left hand
      cards: { name: 'cards', draw: F => {
        const k = m(F), ax = axesOf(F, 'LeftHand'), c = add(add(F.P('LeftHand'), mul(ax[2], 0.07 * k)), mul(ax[1], 0.03 * k));
        F.ball(c, ax, [0.004 * k, 0.07 * k, 0.06 * k], CARD, 8, 6);
      } },
      // Fix's badge, shown in the right palm: a small gilt oval; its point badge
      badge: { name: 'badge', draw: F => {
        const k = m(F), ax = axesOf(F, 'RightHand'), c = add(add(F.P('RightHand'), mul(ax[2], 0.05 * k)), mul(ax[1], 0.02 * k));
        F.ball(c, ax, [0.03 * k, 0.006 * k, 0.04 * k], GOLD, 12);
        F.point('badge', c);
      } },
      // a newspaper open in both hands; its point paper
      newspaper: { name: 'newspaper', draw: F => sheet(F, 0.3, 0.21, PAPER, 'paper') },
      // the same folded, in the left hand
      newspaper_folded: { name: 'newspaper folded', draw: F => {
        const k = m(F), ax = axesOf(F, 'LeftHand');
        F.ball(add(F.P('LeftHand'), mul(ax[2], 0.1 * k)), ax, [0.012 * k, 0.12 * k, 0.15 * k], PAPER, 8, 6);
      } },
      // the carpet bag in the right hand — the twenty thousand in it: hanging from the fist by its handles, swinging; its
      // point bag
      bag: { name: 'carpet-bag', draw: F => {
        const k = m(F), hand = F.P('RightHand'), low = F.swing('bag', add(hand, [0, -0.2 * k, 0]), 70);
        const down = unit(sub(low, hand)), side = unit(cross(down, F.fwd('Hips'))), up = mul(down, -1), ax = [unit(cross(up, side)), up, side];
        const body = [0.48, 0.28, 0.24, 1], trim = [0.2, 0.15, 0.12, 1];
        F.ball(add(hand, mul(down, 0.21 * k)), ax, [0.25 * k, 0.17 * k, 0.11 * k], body, 12, 3.2);
        F.point('bag', add(hand, mul(down, 0.21 * k)));
        F.tube([add(add(hand, mul(down, 0.07 * k)), mul(ax[0], -0.07 * k)), hand, add(add(hand, mul(down, 0.07 * k)), mul(ax[0], 0.07 * k))], [[0, 0.008 * k], [2, 0.008 * k]], [[0, trim]], 6, side);
      } },
      // a bundle in the left hand: a cloth knotted round what he has, hanging from the fist
      bundle: { name: 'bundle', draw: F => {
        const k = m(F), hand = F.P('LeftHand'), low = F.swing('bundle', add(hand, [0, -0.15 * k, 0]), 80);
        const axes = [F.side('Hips'), [0, 1, 0], F.fwd('Hips')], cloth = [0.5, 0.46, 0.38, 1];
        F.ball(mix(hand, low, 1.1), axes, [0.13 * k, 0.11 * k, 0.1 * k], cloth, 14);
        F.ball(add(hand, [0, -0.03 * k, 0]), axes, [0.035 * k, 0.045 * k, 0.035 * k], cloth, 10);
      } },
      // a top hat held in the left hand by its brim
      tophat_hand: { name: 'top hat in hand', draw: F => {
        const k = m(F), ax = axesOf(F, 'LeftHand'), c = add(F.P('LeftHand'), mul(ax[2], 0.06 * k)), r = 0.105 * k;
        F.ball(c, ax, [r * 1.3, r * 0.05, r * 1.2], F.colors.hat, 16);
        F.tube([c, add(c, mul(ax[1], -r * 1.7))], [[0, r * 0.84], [1, r * 0.88]], [[0, F.colors.hat]], 12, ax[0], 0.92, 2, true);
      } },
      // a torch in the right hand: a staff up out of the fist, its head of pitch-soaked rag glowing on it; its point flame,
      // where it burns (the scene's fire there: particles "at": "<id>#flame", a light "at" it)
      torch: { name: 'torch', draw: F => {
        const k = m(F), hand = F.P('RightHand'), up = unit(add(F.up('RightHand'), [0, 0.6, 0])), side = F.side('RightHand');
        const top = add(hand, mul(up, 0.42 * k)), head = add(top, mul(up, 0.06 * k));
        F.bar(add(hand, mul(up, -0.14 * k)), top, 0.016 * k, 0.02 * k, [[0, WOOD]], 6, side);
        F.ball(head, [side, up, unit(cross(side, up))], [0.045 * k, 0.09 * k, 0.045 * k], FLAME, 10);
        F.point('flame', add(head, mul(up, 0.06 * k)));
      } },
      // a book (Fogg's notebook, a novel on the train) open in both hands; its point book
      book: { name: 'notebook', draw: F => sheet(F, 0.13, 0.1, LINEN, 'book') },
      // an elephant goad: a short staff with a hook, in the right hand
      goad: { name: 'goad', draw: F => {
        const k = m(F), hand = F.P('RightHand'), d = F.fwd('RightHand'), side = F.side('RightHand'), tip = add(hand, mul(d, 0.5 * k));
        F.bar(add(hand, mul(d, -0.08 * k)), tip, 0.012 * k, 0.01 * k, [[0, WOOD]], 6, side);
        F.tube([tip, add(tip, mul(d, 0.05 * k)), add(add(tip, mul(d, 0.05 * k)), mul(F.up('RightHand'), -0.05 * k))], [[0, 0.007 * k], [2, 0.004 * k]], [[0, SILVER]], 6, side);
      } },
      // a gold chain across the waistcoat (Fogg's watch in its pocket)
      chain: { name: 'watch-chain', draw: F => {
        const k = m(F), s = F.side('Spine1'), c = add(F.P('Spine1'), mul(F.up('Spine1'), 0.02 * k));
        F.tube([-1, 0, 1].map(u => F.clear(add(c, add(mul(s, u * 0.07 * k), [0, -0.02 * k * (1 - u * u), 0])), 1, 0.006 * k)), [[0, 0.004 * k], [2, 0.004 * k]], [[0, GOLD]], 5, s);
      } },
      // a sash wound round the waist, in the accent
      sash: { name: 'sash', draw: F => {
        const k = m(F), c = F.P('Spine1'), s = F.side('Spine1'), f = F.fwd('Spine1');
        F.ball(add(c, mul(F.up('Spine1'), -0.03 * k)), [s, F.up('Spine1'), f], [0.2 * k * 1.3, 0.05 * k, 0.15 * k * 1.3], F.colors.accent, F.sides);
      } },
      // a short pipe in the teeth at the corner of the mouth, its bowl out before the chin
      pipe: { name: 'pipe', draw: F => {
        const { axes, r, on } = F.head, [hs, hu, hf] = axes, mouth = on([0.22, -0.38, 0.95], 1.0);
        const bowl = add(mouth, add(mul(hf, r * 0.75), add(mul(hu, -r * 0.18), mul(hs, r * 0.12))));
        F.tube([mouth, bowl], [[0, r * 0.05], [1, r * 0.05]], [[0, WOOD]], 5, hs);
        F.tube([add(bowl, mul(hu, -r * 0.08)), add(bowl, mul(hu, r * 0.24))], [[0, r * 0.11], [1, r * 0.12]], [[0, WOOD]], 8, hs, 0.92, 2, true);
        F.point('pipe', add(bowl, mul(hu, r * 0.26)));
      } },
      // long moustaches: from under the nose out past the cheeks, drooping at their ends
      mustachios: { name: 'long moustaches', draw: F => {
        const { at, axes, r, out } = F.head, [hs, hu, hf] = axes, rr = r * out, mid = add(at, add(mul(hu, -rr * 0.36), mul(hf, rr * 0.92)));
        for (const s of [-1, 1]) {
          const a = add(mid, mul(hs, s * rr * 0.05)), b = add(at, add(add(mul(hs, s * rr * 0.75), mul(hu, -rr * 0.42)), mul(hf, rr * 0.75)));
          const c = add(b, add(mul(hs, s * rr * 0.55), mul(hu, -rr * 0.35)));
          F.tube([a, b, c], [[0, rr * 0.09], [1, rr * 0.07], [2, rr * 0.015]], [[0, F.colors.hair]], 6, hu);
        }
      } },
      // soot on the face: smudges over a cheek and the brow
      soot: { name: 'soot', draw: F => {
        const { axes, r, on } = F.head, SOOT = [0.24, 0.21, 0.2, 1];
        F.ball(on([0.5, -0.12, 0.8], 0.99), axes, [r * 0.18, r * 0.12, r * 0.05], SOOT, 10);
        F.ball(on([-0.25, 0.55, 0.8], 0.99), axes, [r * 0.24, r * 0.08, r * 0.05], SOOT, 10);
      } },
      // a bruise round the eye on his right, purple (Fix after Passepartout's fists)
      bruise: { name: 'bruise', draw: F => {
        const { axes, r, on } = F.head;
        F.ball(on([-0.33, 0.06, 0.94], 0.975), axes, [r * 0.2, r * 0.18, r * 0.06], [0.45, 0.22, 0.4, 1], 12);
      } },
      // a striped shirt: dark bands round the chest and the belly
      stripes: { name: 'stripes', draw: F => {
        const T = F.trunk(1.035), n = Math.max(12, F.sides * 2), sq = F.style.square;
        const sec = u => {
          const a = u < 1 ? T[2] : T[3], b = u < 1 ? T[3] : T[4], v = u < 1 ? u : u - 1;
          return [mix(a[0], b[0], v), b[1], b[2], a[3] + (b[3] - a[3]) * v, a[4] + (b[4] - a[4]) * v];
        };
        for (const u of [0.05, 0.42, 0.79, 1.16]) F.rings([F.ringOf(sec(u), n, sq), F.ringOf(sec(u + 0.13), n, sq)], F.colors.accent, null, null);
      } },
      // wings at the back: two long leaves from between the shoulders out and up, in the accent, a paler one under each
      wings: { name: 'wings', draw: F => {
        const k = m(F), f = F.fwd('Chest'), s = F.side('Chest'), u = F.up('Chest'), back = add(F.P('Chest'), mul(f, -0.15 * k));
        const pale = [...F.colors.accent.slice(0, 3).map(v => 0.55 + v * 0.45), 1];
        for (const sd of [-1, 1]) {
          for (const [lift, len, col] of [[0.32, 0.62, F.colors.accent], [0.05, 0.48, pale]]) {
            const root = add(back, add(mul(s, sd * 0.07 * k), mul(u, (lift - 0.1) * 0.3 * k)));
            const tip = add(root, add(add(mul(s, sd * len * k), mul(u, lift * k)), mul(f, -0.12 * k))), mid = add(mix(root, tip, 0.45), mul(u, 0.05 * k));
            const along = unit(sub(tip, root)), wide = unit(cross(f, along));
            F.tube([root, mid, tip], [[0, 0.03 * k], [1, 0.13 * k], [2, 0.015 * k]], [[0, col]], 8, wide, 0.1);
          }
        }
      } },
      // the Long Noses' nose: a tapering pole two metres long out of the face, a little up
      long_nose: { name: 'long nose', draw: F => {
        const k = m(F), { axes: [hs, hu, hf], r, on } = F.head, base = on([0, -0.1, 1], 0.97), dir = unit(add(hf, mul(hu, 0.18)));
        F.tube([base, add(base, mul(dir, 2.0 * k))], [[0, r * 0.32], [1, r * 0.1]], [[0, [0.72, 0.2, 0.15, 1]]], 10, hs);
        F.point('nose', add(base, mul(dir, 2.0 * k)));
      } },
      // a lantern on a short pole in the right hand: a paper body glowing, hanging from the pole's end, swinging; its
      // point flame (a light "at": "<id>#flame")
      lantern: { name: 'lantern', draw: F => {
        const k = m(F), hand = F.P('RightHand'), up = unit(add(F.up('RightHand'), [0, 1.2, 0])), fw = F.fwd('Hips'), side = F.side('Hips');
        const end = add(add(hand, mul(up, 0.3 * k)), mul(fw, 0.22 * k)), body = F.swing('lantern', add(end, [0, -0.2 * k, 0]), 60);
        const dn = unit(sub(body, end)), ax = [side, mul(dn, -1), fw];
        F.bar(add(hand, mul(up, -0.06 * k)), end, 0.011 * k, 0.008 * k, [[0, WOOD]], 6, side);
        F.tube([end, mix(end, body, 0.6)], [[0, 0.003 * k], [1, 0.003 * k]], [[0, INK]], 4, side);
        F.ball(add(body, mul(dn, 0.04 * k)), ax, [0.085 * k, 0.11 * k, 0.085 * k], [1, 0.62, 0.3, 2], 12);
        F.ball(add(body, mul(dn, -0.065 * k)), ax, [0.05 * k, 0.012 * k, 0.05 * k], INK, 10);
        F.ball(add(body, mul(dn, 0.15 * k)), ax, [0.05 * k, 0.012 * k, 0.05 * k], INK, 10);
        F.point('flame', add(body, mul(dn, 0.04 * k)));
      } },
      // a rifle held upright in the right hand, its butt down by the foot (order arms)
      rifle: { name: 'rifle', draw: F => {
        const k = m(F), hand = F.P('RightHand'), side = F.side('Hips'), up = unit(add([0, 1, 0], mul(F.fwd('Hips'), 0.08)));
        F.bar(add(hand, mul(up, -0.66 * k)), add(hand, mul(up, 0.06 * k)), 0.035 * k, 0.022 * k, [[0, WOOD]], 6, F.fwd('Hips'), 0.5);
        F.bar(add(hand, mul(up, 0.04 * k)), add(hand, mul(up, 0.6 * k)), 0.012 * k, 0.01 * k, [[0, [0.25, 0.25, 0.27, 1]]], 6, side);
      } },
      // a plaid folded over the left forearm, its two ends hanging; its point plaid
      plaid: { name: 'plaid', draw: F => {
        const k = m(F), c = mix(F.P('LeftForeArm'), F.P('LeftHand'), 0.45), ax = [F.side('Hips'), [0, 1, 0], F.fwd('Hips')];
        F.ball(add(c, [0, -0.1 * k, 0]), ax, [0.06 * k, 0.17 * k, 0.15 * k], [0.46, 0.2, 0.18, 1], 10, 3);
        F.ball(add(c, [0, -0.2 * k, 0]), ax, [0.064 * k, 0.03 * k, 0.152 * k], [0.2, 0.3, 0.24, 1], 10, 3);
        F.point('plaid', c);
      } },
      // Fogg's notebook open in both hands, a pencil in the right; its point book
      notebook: { name: 'notebook with a pencil', draw: F => {
        sheet(F, 0.11, 0.15, LINEN, 'book');
        const k = m(F), ax = axesOf(F, 'RightHand'), c = add(F.P('RightHand'), mul(ax[2], 0.04 * k));
        F.bar(add(c, mul(ax[1], -0.06 * k)), add(c, mul(ax[1], 0.06 * k)), 0.004 * k, 0.003 * k, [[0, [0.3, 0.32, 0.24, 1]]], 5, ax[0]);
      } },
      // the book shut, held flat in both hands on the lap; its point book
      book_shut: { name: 'notebook shut', draw: F => {
        const k = m(F), L = F.P('LeftHand'), R = F.P('RightHand'), c = mix(L, R, 0.5), x = unit(sub(R, L)), y = unit(cross(x, F.fwd('Hips'))), n = cross(x, y);
        F.ball(add(c, [0, 0.015 * k, 0]), [x, n, y], [0.075 * k, 0.012 * k, 0.1 * k], [0.32, 0.12, 0.1, 1], 8, 6);
        F.point('book', c);
      } },
      // a lump of sugar on the right palm; its point sugar
      sugar: { name: 'sugar', draw: F => {
        const k = m(F), ax = axesOf(F, 'RightHand'), c = add(add(F.P('RightHand'), mul(ax[2], 0.05 * k)), mul(ax[1], 0.03 * k));
        F.ball(c, ax, [0.022 * k, 0.022 * k, 0.022 * k], [0.97, 0.96, 0.92, 1], 4, 6);
        F.point('sugar', c);
      } },
      // a sheet (a sail's rope) held in both hands, its end hanging from the left; its point sheet — the right hand, where
      // the scene's own rope comes to it
      sheet: { name: 'sheet', draw: F => {
        const k = m(F), L = F.P('LeftHand'), R = F.P('RightHand'), low = F.swing('sheet', add(L, [0, -0.45 * k, 0]), 50);
        F.tube([R, add(mix(R, L, 0.5), [0, -0.04 * k, 0]), L, low], [[0, 0.012 * k], [3, 0.012 * k]], [[0, [0.66, 0.58, 0.42, 1]]], 6, F.side('Hips'));
        F.point('sheet', R);
      } },
    },
  },
};
