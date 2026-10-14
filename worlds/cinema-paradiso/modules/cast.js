// The world's cast (web/scene/people.js): its data — the motions put in it — and the looks of the world's people
// that the Pristan scene uses (scenes.md «Люди мира»; the Cast area will make the whole cast — these are its first
// characters, kept to the names there).
const shape = (who, more) => Object.assign({ kind: 'shapes', style: 'graphic', who, face: 'none' }, more);
return {
  ...data,
  characters: {
    toto_teen: shape('youth', { garment: 'none', hair: 'short', colors: { top: '#efe8da', bottom: '#2a2a32', hair: '#1c1511', skin: '#c99d7a', shoes: '#2b2019' } }),
    salvatore: shape('man', { garment: 'coat', scarf: true, hair: 'short', colors: { garment: '#2d2c33', bottom: '#26252b', top: '#3a3a42', hair: '#8f8a84', skin: '#c49a7a', accent: '#ddd6c8', shoes: '#1e1b1a' } }),
    alfredo_blind: shape('grandpa', { garment: 'jacket', hat: 'cap', scarf: false, hair: 'short', body: { thick: 1.15, height: 0.97 }, colors: { garment: '#4b4237', top: '#cfc6b2', bottom: '#3a352f', hat: '#3a3530', hair: '#bdb6aa', skin: '#c29775', shoes: '#2a221c' } }),
    elena: shape('woman', { garment: 'dress', hair: 'straight', colors: { garment: '#ece2cc', hair: '#2a1b14', skin: '#d6ab88', shoes: '#6b4a36' } }),
    elena_grown: shape('woman', { garment: 'coat', hair: 'bob', colors: { garment: '#cbbd9f', bottom: '#4a4540', hair: '#3a2a22', skin: '#d0a684', shoes: '#3a2c24' } }),
    daughter: shape('woman', { garment: 'dress', hair: 'straight', colors: { garment: '#a04848', hair: '#2a1b14', skin: '#d6ab88', shoes: '#2a2a2e' } }),
    banker: shape('man', { garment: 'coat', hat: 'hat', colors: { garment: '#1e1e23', hat: '#1a1a1d', bottom: '#1e1e23', skin: '#c49a7a', shoes: '#111' } }),
    villager_m: shape('man', { garment: 'none', hat: 'cap', colors: { top: '#6a6a72', bottom: '#3a3530', hat: '#3b3734' } }),
    villager_w: shape('woman', { garment: 'skirt', scarf: true, hair: 'bun', colors: { garment: '#3d3330', top: '#7a6658', accent: '#5a4a44' } }),
    old_m: shape('old', { garment: 'jacket', hat: 'cap', colors: { garment: '#4d4740', hat: '#2f2c2a' } }),
    old_w: shape('old', { garment: 'dress', scarf: true, colors: { garment: '#29262a', accent: '#3b3536' } }),
  },
};
