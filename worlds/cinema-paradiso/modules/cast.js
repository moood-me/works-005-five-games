// The people of «Новый кинотеатр „Парадизо“» as people in a scene (the engine's people: an element with "person"):
// who they are — figures of shapes in the world's style `paradizo` (the engine's `graphic`, faces `simple`: eyes,
// brows, nose, mouth, an expression by `<id>_mood`) — what they carry (the parts), and how they move: the motions in
// cast.data.json (Kimodo's, put there with put_motion). cast.md says who is who, what each part is and every motion.
// A part's lengths are a man's metres times F.fit.h (the person's height as a share of a man's 1.76 m); the points a
// part names are the person's: "alfredo#pocket", "maria#lamp".
// One person at several ages is one element: `<id>_wear` = the look object (scene.kit.cast.characters.salvatore),
// never its name.
const V = () => MooodShapes.V;
const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255);
const C = (s, k = 1) => [...hex(s), k]; // k 2: it glows (a lamp's glass)
const WOOD = C('#5a3f2a'), DARK = C('#231c17'), BRASS = C('#b8923e'), TIN = C('#8d8d88'), PAPER = C('#e9e3d2'),
  YELLOWED = C('#dccfa6'), SLATE = C('#2c3030'), FILM = C('#3a2c22'), METAL = C('#2b2b2e');
const UP = [0, 1, 0];
// the hand's axes: across the palm, up the hand, out of the fist
const axesOf = (F, h) => [F.side(h), F.up(h), F.fwd(h)];
// between the two hands, a little up; and the axes of a flat thing held there turned to the eyes
function held(F, lift = 0.03) {
  const { add, mix, unit, sub, cross } = V(), m = F.fit.h;
  const c = add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), [0, lift * m, 0]);
  const n = unit(sub(F.P('Head'), c)), x = unit(cross(UP, n)), y = cross(n, x);
  return { c, axes: [x, y, n] };
}
// a flat sheet in the right hand's fingers (a frame of film, a note, a paper), turned to the eyes
function sheetInHand(F, w, h, colour, name) {
  const { add, mul, unit, sub, cross } = V(), m = F.fit.h, hand = F.P('RightHand'), [, , f] = axesOf(F, 'RightHand');
  const c = add(hand, mul(f, 0.05 * m)), n = unit(sub(F.P('Head'), c)), x = unit(cross(UP, n)), y = cross(n, x);
  F.ball(c, [x, y, n], [w * m, h * m, 0.002 * m], colour, 4, 8);
  if (name) F.point(name, c);
}

const parts = {
  // the priest's small brass hand bell in the right hand, its clapper swinging a little late as the hand moves
  bell: { name: 'колокольчик', draw: F => {
    const { add, mul } = V(), h = F.fit.h, hand = F.P('RightHand'), axes = [[1, 0, 0], UP, [0, 0, 1]];
    const top = add(hand, mul(UP, -0.03 * h)), body = add(hand, mul(UP, -0.1 * h));
    F.bar(add(hand, mul(UP, 0.02 * h)), top, 0.012 * h, 0.012 * h, [[0, C('#3a2a1c')]], 6, [1, 0, 0]);
    F.ball(body, axes, [0.04 * h, 0.05 * h, 0.04 * h], BRASS, 10);
    const tongue = F.swing('clapper', add(body, mul(UP, -0.06 * h)), 70);
    F.ball(tongue, axes, [0.014 * h, 0.014 * h, 0.014 * h], C('#6a5428'), 6);
    F.point('bell', body);
  } },
  // a blind man's cane in the right hand: from the crook in the hand down to the floor
  cane: { name: 'трость', draw: F => {
    const { add, mul } = V(), h = F.fit.h, hand = F.P('RightHand'), fwd = F.fwd('Hips');
    const tip = [hand[0] + fwd[0] * 0.06 * h, Math.max(0.01, hand[1] - 0.92 * h), hand[2] + fwd[2] * 0.06 * h];
    F.bar(hand, tip, 0.012 * h, 0.01 * h, [[0, C('#2e2119')]], 6, F.side('Hips'));
    F.bar(hand, add(hand, mul(fwd, 0.08 * h)), 0.013 * h, 0.013 * h, [[0, C('#2e2119')]], 6, UP);
  } },
  // round dark glasses (the blind Alfredo's look)
  glasses: { name: 'тёмные очки', draw: F => {
    const { add, mul } = V(), { at, axes, r, out } = F.head, [hs, hu, hf] = axes, R = r * out;
    for (const s of [-1, 1]) {
      F.ball(add(at, add(add(mul(hs, s * R * 0.36), mul(hu, R * 0.12)), mul(hf, R * 0.98))), axes, [R * 0.27, R * 0.24, R * 0.06], C('#0d0d10'), 12);
    }
    F.bar(add(at, add(mul(hs, -R * 0.12), add(mul(hu, R * 0.16), mul(hf, R * 1.02)))),
      add(at, add(mul(hs, R * 0.12), add(mul(hu, R * 0.16), mul(hf, R * 1.02)))), R * 0.03, R * 0.03, [[0, METAL]], 4, hu);
  } },
  // the pocket of Alfredo's waistcoat where he keeps coins and the tin: a point (`alfredo#pocket`), nothing drawn
  pocket: { name: 'карман жилета', points: { pocket: { joint: 'Chest', off: [-0.09, -0.14, 0.13] } }, draw: () => {} },
  // a few coins on the right palm, held out
  coins: { name: 'монеты', draw: F => {
    const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), [s, u, f] = axesOf(F, 'RightHand');
    for (const [a, b] of [[0, 0.03], [0.018, 0.045], [-0.016, 0.05]]) {
      F.ball(add(h, add(mul(s, a * m), add(mul(f, b * m), mul(UP, 0.015 * m)))), [s, UP, f], [0.011 * m, 0.003 * m, 0.011 * m], C('#c9b27a'), 8);
    }
    F.point('coins', add(h, mul(f, 0.04 * m)));
  } },
  // the flat round film tin held in both hands before the chest
  tin: { name: 'жестянка', draw: F => {
    const { c, axes } = held(F, 0.02), m = F.fit.h;
    F.ball(c, [axes[0], axes[2], axes[1]], [0.13 * m, 0.025 * m, 0.13 * m], TIN, 16);
    F.point('tin', c);
  } },
  // the edge of the tin showing out of the waistcoat's pocket
  tin_pocket: { name: 'жестянка в кармане', draw: F => {
    const { add, mul } = V(), m = F.fit.h, c = F.P('Chest'), [s, u, f] = [F.side('Chest'), F.up('Chest'), F.fwd('Chest')];
    const at = add(c, add(mul(s, -0.09 * m), add(mul(u, -0.1 * m), mul(f, 0.14 * m))));
    F.ball(at, [s, f, u], [0.06 * m, 0.012 * m, 0.04 * m], TIN, 12);
  } },
  // a single frame of film between the fingers of the right hand
  frame_hand: { name: 'кадр плёнки', draw: F => sheetInHand(F, 0.022, 0.017, FILM, 'frame') },
  // a primer, open, in both hands
  primer: { name: 'букварь', draw: F => {
    const { add, mul } = V(), m = F.fit.h, { c, axes } = held(F, 0.04), [x, y, n] = axes;
    F.ball(add(c, mul(n, -0.006 * m)), axes, [0.12 * m, 0.09 * m, 0.01 * m], C('#5b3b2c'), 8, 10);
    for (const s of [-1, 1]) F.ball(add(add(c, mul(x, s * 0.058 * m)), mul(n, 0.004 * m)), axes, [0.055 * m, 0.08 * m, 0.006 * m], PAPER, 8, 10);
    F.point('primer', c);
  } },
  // the slate in both hands at the face's height, its face to the eyes' front (its letters are the insert's: here it
  // shows the chalk as a pale band)
  slate_held: { name: 'грифельная доска', draw: F => {
    const { add, mul, mix, unit, sub, cross } = V(), m = F.fit.h, c = add(mix(F.P('LeftHand'), F.P('RightHand'), 0.5), [0, 0.06 * m, 0]);
    const n = F.fwd('Chest'), x = unit(cross(UP, n)), y = cross(n, x), axes = [x, y, n];
    F.ball(c, axes, [0.2 * m, 0.14 * m, 0.012 * m], C('#6b4c32'), 4, 8);
    F.ball(add(c, mul(n, 0.008 * m)), axes, [0.18 * m, 0.12 * m, 0.008 * m], SLATE, 4, 8);
    F.ball(add(c, mul(n, 0.016 * m)), axes, [0.13 * m, 0.02 * m, 0.003 * m], C('#bfbcb2'), 4, 8);
    F.point('slate', c);
  } },
  // a sheet of official paper in the right hand
  paper_sheet: { name: 'бумага', draw: F => sheetInHand(F, 0.09, 0.12, PAPER, 'paper') },
  // a letter held open in both hands before the eyes
  letter_sheet: { name: 'письмо', draw: F => {
    const { c, axes } = held(F, 0.05), m = F.fit.h;
    F.ball(c, axes, [0.1 * m, 0.13 * m, 0.003 * m], C('#ece6d6'), 4, 8);
    F.point('letter', c);
  } },
  // the small 8 mm camera at the right eye in both hands
  cam8: { name: 'камера', draw: F => {
    const { add, mul } = V(), m = F.fit.h, hd = F.head, [hs, hu, hf] = hd.axes, R = hd.r * hd.out;
    const c = add(hd.at, add(mul(hf, R * 1.55), add(mul(hs, R * 0.25), mul(hu, R * 0.05))));
    F.ball(c, [hs, hu, hf], [0.035 * m, 0.06 * m, 0.08 * m], C('#2a2a2c'), 4, 6);
    F.bar(add(c, mul(hf, 0.07 * m)), add(c, mul(hf, 0.12 * m)), 0.02 * m, 0.022 * m, [[0, METAL]], 10, hu);
    F.point('camera', c);
  } },
  // a plain wooden chair carried before him in both hands, its seat at the hands
  chair_carried: { name: 'стул в руках', draw: F => {
    const { add, mul, mix, unit, cross } = V(), m = F.fit.h, c = mix(F.P('LeftHand'), F.P('RightHand'), 0.5);
    const f = F.fwd('Hips'), x = unit(cross(UP, f)), axes = [x, UP, f];
    const seat = add(c, mul(f, 0.12 * m));
    F.ball(seat, axes, [0.21 * m, 0.02 * m, 0.2 * m], WOOD, 4, 8);
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const top = add(seat, add(mul(x, a * 0.18 * m), mul(f, b * 0.17 * m)));
      F.bar(top, add(top, mul(UP, -0.42 * m)), 0.014 * m, 0.012 * m, [[0, WOOD]], 5, f);
    }
    const back = add(seat, mul(f, 0.18 * m));
    F.ball(add(back, mul(UP, 0.26 * m)), axes, [0.2 * m, 0.1 * m, 0.012 * m], WOOD, 4, 8);
    for (const a of [-1, 1]) F.bar(add(back, mul(x, a * 0.18 * m)), add(add(back, mul(x, a * 0.18 * m)), mul(UP, 0.4 * m)), 0.013 * m, 0.013 * m, [[0, WOOD]], 5, f);
  } },
  // a telephone's receiver at the ear in the right hand
  phone: { name: 'трубка', draw: F => {
    const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), [s, u, f] = axesOf(F, 'RightHand');
    F.bar(add(h, mul(u, 0.09 * m)), add(h, mul(u, -0.08 * m)), 0.018 * m, 0.018 * m, [[0, C('#151517')]], 6, f);
    F.ball(add(h, mul(u, 0.1 * m)), [s, u, f], [0.03 * m, 0.025 * m, 0.03 * m], C('#151517'), 8);
  } },
  // an oil lamp in the right hand: its glass glows (the scene's light is at "<id>#lamp")
  lamp_hand: { name: 'лампа', draw: F => {
    const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), axes = [F.side('Hips'), UP, F.fwd('Hips')];
    const c = add(h, mul(UP, -0.1 * m));
    F.ball(add(c, mul(UP, -0.06 * m)), axes, [0.06 * m, 0.035 * m, 0.06 * m], BRASS, 10);
    F.ball(add(c, mul(UP, 0.03 * m)), axes, [0.04 * m, 0.07 * m, 0.04 * m], C('#ffd08a', 2), 10);
    F.bar(h, add(c, mul(UP, 0.1 * m)), 0.004 * m, 0.004 * m, [[0, METAL]], 4, axes[0]);
    F.point('lamp', add(c, mul(UP, 0.03 * m)));
  } },
  // a pencil in the right hand's fingers
  pencil: { name: 'карандаш', draw: F => {
    const { add, mul } = V(), m = F.fit.h, h = F.P('RightHand'), [s, u, f] = axesOf(F, 'RightHand');
    F.bar(add(h, mul(f, 0.02 * m)), add(h, add(mul(f, 0.1 * m), mul(u, 0.04 * m))), 0.004 * m, 0.002 * m, [[0, C('#c9a640')]], 5, s);
  } },
  // a small folded note in the right hand
  note: { name: 'записка', draw: F => sheetInHand(F, 0.04, 0.05, YELLOWED, 'note') },
  // an old suitcase hanging from the right hand, its long side along the way the person faces
  suitcase: { name: 'чемодан', draw: F => {
    const { add, mul } = V(), h = F.fit.h, hand = F.P('RightHand'), c = add(hand, mul(UP, -0.22 * h));
    F.ball(c, [F.side('Hips'), UP, F.fwd('Hips')], [0.075 * h, 0.2 * h, 0.3 * h], C('#6b4a30'), 12, 6);
    F.bar(add(c, mul(UP, 0.2 * h)), hand, 0.01 * h, 0.01 * h, [[0, C('#2a1d14')]], 5, F.fwd('Hips'));
  } },
};

const look = (who, more) => Object.assign({ kind: 'shapes', style: 'paradizo', who, face: 'simple' }, more);
return {
  ...data,
  characters: {
    // Toto, 8–10: thin, dark tufts, a big pale shirt, short trousers, sandals
    toto_boy: look('child', { garment: 'none', hair: 'spiky', body: { thick: 0.8 },
      colors: { top: '#ece5d4', bottom: '#4c4136', hair: '#1a1410', skin: '#c99d7a', shoes: '#5a4232' } }),
    // Toto, 17–18: tall, dark hair, a white shirt, sleeves rolled, dark trousers
    toto_teen: look('youth', { garment: 'none', hair: 'short',
      colors: { top: '#efe8da', bottom: '#2a2a32', hair: '#1c1511', skin: '#c99d7a', shoes: '#2b2019' } }),
    // Salvatore, 47: a dark coat, greying hair, a pale scarf
    salvatore: look('man', { garment: 'coat', scarf: true, hair: 'short',
      colors: { garment: '#2d2c33', bottom: '#26252b', top: '#3a3a42', hair: '#8f8a84', skin: '#c49a7a', accent: '#ddd6c8', shoes: '#1e1b1a' } }),
    // Alfredo, about fifty: stocky, a cap, a short work jacket (its pocket: alfredo#pocket — «карман жилета»), a collarless shirt
    alfredo: look('grandpa', { garment: 'jacket', hat: 'cap', scarf: false, hair: 'short', parts: ['pocket', 'moustache'],
      body: { thick: 1.2, height: 0.98 },
      colors: { garment: '#4a3d30', top: '#d9cfb6', bottom: '#3d362e', hat: '#3a3530', hair: '#4a3f36', skin: '#c29775', shoes: '#2a221c' } }),
    // Alfredo blind, 55–65: greyer, round dark glasses, a jacket; the cane
    alfredo_blind: look('grandpa', { garment: 'jacket', hat: 'cap', scarf: false, hair: 'short', parts: ['glasses', 'moustache', 'cane'],
      body: { thick: 1.15, height: 0.97 },
      colors: { garment: '#4b4237', top: '#cfc6b2', bottom: '#3a352f', hat: '#3a3530', hair: '#bdb6aa', skin: '#c29775', shoes: '#2a221c' } }),
    // Maria, about thirty: a widow's dark dress, a shawl, hair in a knot
    maria: look('woman', { garment: 'dress', scarf: true, hair: 'bun',
      colors: { garment: '#1f1c20', accent: '#4a4046', hair: '#1c1512', skin: '#d0a684', shoes: '#1e1a18' } }),
    // Maria, about seventy: a grey knot, a black cardigan, a shawl
    maria_old: look('old', { garment: 'dress', scarf: true, hair: 'bun', body: { height: 0.9 },
      colors: { garment: '#18161a', accent: '#3d383c', hair: '#c9c4bb', skin: '#cfa587', shoes: '#1e1a18' } }),
    // Elena, 17: a light summer dress, dark hair to the shoulders
    elena: look('woman', { garment: 'dress', hair: 'straight',
      colors: { garment: '#ece2cc', hair: '#2a1b14', skin: '#d6ab88', shoes: '#6b4a36' } }),
    // Elena, 47: a light raincoat, shorter hair
    elena_grown: look('woman', { garment: 'coat', hair: 'bob',
      colors: { garment: '#cbbd9f', bottom: '#4a4540', hair: '#3a2a22', skin: '#d0a684', shoes: '#3a2c24' } }),
    // Elena's daughter, 17: like her mother then, a dress of the eighties in another colour
    daughter: look('woman', { garment: 'dress', hair: 'straight',
      colors: { garment: '#a04848', hair: '#2a1b14', skin: '#d6ab88', shoes: '#2a2a2e' } }),
    // Father Adelfio: a cassock, no hat, a white fringe of hair; the bell
    adelfio: look('old', { garment: 'robe', hair: 'short', hat: 'none', parts: ['bell'],
      colors: { garment: '#17161a', top: '#17161a', bottom: '#17161a', hair: '#d6d0c4', skin: '#d2a888', shoes: '#111111' } }),
    // the madman, about thirty: a long coat out of season, dishevelled
    madman: look('man', { garment: 'coat', hair: 'spiky',
      colors: { garment: '#5a4e3a', top: '#8a7c64', bottom: '#3a332b', hair: '#2a211a', skin: '#c49a7a', shoes: '#2a221c' } }),
    // the madman at seventy: the same coat, a grey beard
    madman_old: look('old', { garment: 'coat', hair: 'spiky', parts: ['beard'],
      colors: { garment: '#4f4535', top: '#7a6e5a', bottom: '#33302a', hair: '#c9c4bb', skin: '#c49a7a', shoes: '#2a221c' } }),
    // Anna, Alfredo's widow: old, in black, a headscarf
    anna: look('old', { garment: 'dress', scarf: true, hat: 'kerchief', hair: 'bun', body: { height: 0.9 },
      colors: { garment: '#141316', accent: '#2c292c', hat: '#1c1a1d', hair: '#bdb7ae', skin: '#c99f80', shoes: '#141316' } }),
    // Elena's father: a suit, a hat (only seen far off)
    banker: look('man', { garment: 'coat', hat: 'hat',
      colors: { garment: '#1e1e23', hat: '#1a1a1d', bottom: '#1e1e23', skin: '#c49a7a', shoes: '#111111' } }),
    // the crowd: work shirts, headscarves, caps — each element its own colours over these
    villager_m: look('man', { garment: 'none', hat: 'cap', colors: { top: '#6a6a72', bottom: '#3a3530', hat: '#3b3734' } }),
    villager_w: look('woman', { garment: 'skirt', scarf: true, hair: 'bun', colors: { garment: '#3d3330', top: '#7a6658', accent: '#5a4a44' } }),
    old_m: look('old', { garment: 'jacket', hat: 'cap', colors: { garment: '#4d4740', hat: '#2f2c2a' } }),
    old_w: look('old', { garment: 'dress', scarf: true, colors: { garment: '#29262a', accent: '#3b3536' } }),
    kid: look('child', { garment: 'tunic', hair: 'short', colors: { top: '#a69a80', bottom: '#4a4038', hair: '#2a1f17' } }),
  },
  shapes: {
    // the world's style: the engine's `graphic` with a face that reads (eyes, brows, nose, mouth: `<id>_mood`)
    styles: { paradizo: { from: 'graphic', face: 'simple' } },
    hats: {
      // a headscarf over the hair, tied at the nape
      kerchief: { name: 'платок', draw: F => {
        const { add, mul } = V(), { at, axes, egg, r, out, sides, square } = F.head, [, hu, hf] = axes;
        F.cap(at, axes, egg.map(e => e * r * out * 1.08), [0, 0.7, -0.72], -0.05, F.colors.hat, sides, square);
        F.ball(add(at, add(mul(hu, -r * 0.45), mul(hf, -r * 1.02))), axes, [r * 0.22, r * 0.16, r * 0.14], F.colors.hat, 10);
      } },
    },
    parts: {
      ...parts,
      // a thick moustache under the nose (the hair's colour)
      moustache: { name: 'усы', draw: F => {
        const { add, mul } = V(), h = F.head, [hs, hu, hf] = h.axes, r = h.r * h.out;
        F.ball(add(h.at, add(mul(hu, -r * 0.42), mul(hf, r * 0.96))), h.axes, [r * 0.34, r * 0.08, r * 0.08], F.colors.hair, 10);
      } },
      // a beard over the jaw and the chin (the hair's colour)
      beard: { name: 'борода', draw: F => {
        const { add, mul } = V(), h = F.head, [, hu, hf] = h.axes, r = h.r * h.out;
        F.cap(h.at, h.axes, h.egg.map(e => e * r * 1.05), [0, -0.55, 0.83], 0.25, F.colors.hair, h.sides, h.square);
        F.ball(add(h.at, add(mul(hu, -r * 0.92), mul(hf, r * 0.5))), h.axes, [r * 0.6, r * 0.46, r * 0.4], F.colors.hair, h.sides);
      } },
    },
  },
};
