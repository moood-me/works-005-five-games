// The world's cast (web/scene/people.js): its data — the motions put in it — and the looks of the world's people
// that the Opus scenes use (scenes.md «Люди мира»; the Cast area will make the whole cast — these are its first
// characters, kept to the names there), and the parts they carry: the priest's bell, the blind man's cane, a suitcase.
const shape = (who, more) => Object.assign({ kind: 'shapes', style: 'graphic', who, face: 'none' }, more);
const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255);
const col = (F, h) => [...hex(h), F.colors.accent[3]];
const UP = [0, 1, 0];
const parts = {
  // a small brass hand bell in the right hand, its clapper swinging a little late as the hand moves
  bell: { name: 'колокольчик', draw: F => {
    const { add, mul } = MooodShapes.V;
    const h = F.fit.h, hand = F.P('RightHand'), axes = [[1, 0, 0], UP, [0, 0, 1]];
    const top = add(hand, mul(UP, -0.03 * h)), body = add(hand, mul(UP, -0.1 * h));
    F.bar(add(hand, mul(UP, 0.02 * h)), top, 0.012 * h, 0.012 * h, [[0, col(F, '#3a2a1c')]], 6, [1, 0, 0]);
    F.ball(body, axes, [0.04 * h, 0.05 * h, 0.04 * h], col(F, '#b8923e'), 10);
    const tongue = F.swing('clapper', add(body, mul(UP, -0.06 * h)), 70);
    F.ball(tongue, axes, [0.014 * h, 0.014 * h, 0.014 * h], col(F, '#6a5428'), 6);
  } },
  // a blind man's cane in the right hand: from the crook in the hand down to the floor
  cane: { name: 'трость', draw: F => {
    const { add, mul } = MooodShapes.V;
    const h = F.fit.h, hand = F.P('RightHand'), fwd = F.fwd('Hips');
    const tip = [hand[0] + fwd[0] * 0.06 * h, Math.max(0.01, hand[1] - 0.92 * h), hand[2] + fwd[2] * 0.06 * h];
    F.bar(hand, tip, 0.012 * h, 0.01 * h, [[0, col(F, '#2e2119')]], 6, F.side('Hips'));
    F.bar(hand, add(hand, mul(fwd, 0.08 * h)), 0.013 * h, 0.013 * h, [[0, col(F, '#2e2119')]], 6, UP);
  } },
  // the vest's pocket where Alfredo keeps the tin: only a point (the cast's `alfredo#pocket`), nothing drawn
  pocket: { name: 'карман жилета', points: { pocket: { joint: 'Chest', off: [-0.09, -0.14, 0.13] } }, draw: F => {} },
  // an old suitcase hanging from the right hand, its long side along the way the person faces
  suitcase: { name: 'чемодан', draw: F => {
    const { add, mul } = MooodShapes.V;
    const h = F.fit.h, hand = F.P('RightHand'), c = add(hand, mul(UP, -0.22 * h));
    F.ball(c, [F.side('Hips'), UP, F.fwd('Hips')], [0.075 * h, 0.2 * h, 0.3 * h], col(F, '#6b4a30'), 12, 6);
    F.bar(add(c, mul(UP, 0.2 * h)), hand, 0.01 * h, 0.01 * h, [[0, col(F, '#2a1d14')]], 5, F.fwd('Hips'));
  } },
};
return {
  ...data,
  characters: {
    toto_boy: shape('child', { garment: 'none', hair: 'spiky', colors: { top: '#ece5d4', bottom: '#4c4136', hair: '#1a1410', skin: '#c99d7a', shoes: '#5a4232' } }),
    toto_teen: shape('youth', { garment: 'none', hair: 'short', colors: { top: '#efe8da', bottom: '#2a2a32', hair: '#1c1511', skin: '#c99d7a', shoes: '#2b2019' } }),
    salvatore: shape('man', { garment: 'coat', scarf: true, hair: 'short', colors: { garment: '#2d2c33', bottom: '#26252b', top: '#3a3a42', hair: '#8f8a84', skin: '#c49a7a', accent: '#ddd6c8', shoes: '#1e1b1a' } }),
    alfredo: shape('grandpa', { garment: 'none', hat: 'cap', scarf: false, hair: 'short', parts: ['pocket'], body: { thick: 1.2, height: 0.98 }, colors: { top: '#d9cfb6', bottom: '#3d362e', hat: '#3a3530', hair: '#4a3f36', skin: '#c29775', shoes: '#2a221c' } }),
    alfredo_blind: shape('grandpa', { garment: 'jacket', hat: 'cap', scarf: false, hair: 'short', body: { thick: 1.15, height: 0.97 }, colors: { garment: '#4b4237', top: '#cfc6b2', bottom: '#3a352f', hat: '#3a3530', hair: '#bdb6aa', skin: '#c29775', shoes: '#2a221c' } }),
    maria: shape('woman', { garment: 'dress', scarf: true, hair: 'bun', colors: { garment: '#1f1c20', accent: '#4a4046', hair: '#1c1512', skin: '#d0a684', shoes: '#1e1a18' } }),
    elena: shape('woman', { garment: 'dress', hair: 'straight', colors: { garment: '#ece2cc', hair: '#2a1b14', skin: '#d6ab88', shoes: '#6b4a36' } }),
    elena_grown: shape('woman', { garment: 'coat', hair: 'bob', colors: { garment: '#cbbd9f', bottom: '#4a4540', hair: '#3a2a22', skin: '#d0a684', shoes: '#3a2c24' } }),
    daughter: shape('woman', { garment: 'dress', hair: 'straight', colors: { garment: '#a04848', hair: '#2a1b14', skin: '#d6ab88', shoes: '#2a2a2e' } }),
    adelfio: shape('old', { garment: 'robe', hair: 'short', hat: 'none', parts: ['bell'], colors: { garment: '#17161a', top: '#17161a', bottom: '#17161a', hair: '#d6d0c4', skin: '#d2a888', shoes: '#111' } }),
    banker: shape('man', { garment: 'coat', hat: 'hat', colors: { garment: '#1e1e23', hat: '#1a1a1d', bottom: '#1e1e23', skin: '#c49a7a', shoes: '#111' } }),
    villager_m: shape('man', { garment: 'none', hat: 'cap', colors: { top: '#6a6a72', bottom: '#3a3530', hat: '#3b3734' } }),
    villager_w: shape('woman', { garment: 'skirt', scarf: true, hair: 'bun', colors: { garment: '#3d3330', top: '#7a6658', accent: '#5a4a44' } }),
    old_m: shape('old', { garment: 'jacket', hat: 'cap', colors: { garment: '#4d4740', hat: '#2f2c2a' } }),
    old_w: shape('old', { garment: 'dress', scarf: true, colors: { garment: '#29262a', accent: '#3b3536' } }),
  },
  shapes: { parts },
};
