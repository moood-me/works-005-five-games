// Люди «Парадизо»: облики и части. Движения — data (put_motion).
const d = data || {};
const sh = (who, o) => Object.assign({ kind: 'shapes', style: 'graphic', paint: 'lit', who, face: 'none' }, o);
return {
  ...d,
  characters: {
    toto_teen: sh('youth', { garment: 'none', hair: 'short', colors: { skin: '#c9a07c', hair: '#1c1511', top: '#f1ece0', bottom: '#2a2b33', shoes: '#25221f' } }),
    salvatore: sh('man', { garment: 'coat', scarf: true, hair: 'short', colors: { skin: '#cfa985', hair: '#8c8c92', garment: '#2c2d36', accent: '#e4dfd2', bottom: '#222228', shoes: '#1c1c20' } }),
    elena: sh('teen', { garment: 'dress', hair: 'long', colors: { skin: '#d6b090', hair: '#2a1c16', garment: '#f3ead6', shoes: '#cbbba0' } }),
    elena_grown: sh('woman', { garment: 'coat', hair: 'bob', colors: { skin: '#d6b090', hair: '#33261f', garment: '#d9d0bb', bottom: '#2c2c33', shoes: '#2a2522' } }),
    daughter: sh('teen', { garment: 'dress', hair: 'ponytail', colors: { skin: '#d6b090', hair: '#2a1c16', garment: '#6d5480', shoes: '#2a2522' } }),
    alfredo_blind: sh('grandpa', { garment: 'jacket', hat: 'cap', parts: ['cane'], colors: { skin: '#c49a78', hair: '#9a9a9a', garment: '#3d372e', hat: '#4a4238', bottom: '#2a2825', shoes: '#1d1b19', accent: '#6b5a40' } }),
    banker: sh('man', { garment: 'coat', hat: 'hat', colors: { skin: '#c9a07c', garment: '#1c1c22', hat: '#17171c', bottom: '#17171c', shoes: '#111114' } }),
    villager_m: sh('man', { garment: 'none', hat: 'cap', colors: { top: '#7a6a55', bottom: '#3a342c', hat: '#4a4036' } }),
    villager_w: sh('woman', { garment: 'dress', hair: 'bun', colors: { garment: '#6a4a46', hair: '#2a1d18' } }),
    old_m: sh('old', { garment: 'jacket', hat: 'cap', colors: { garment: '#4a4a40', hat: '#2f2c27' } }),
    kid: sh('child', { garment: 'none', hair: 'short', colors: { top: '#a89c82', bottom: '#4a4238' } })
  },
  shapes: {
    parts: {
      cane: { name: 'трость', draw: F => {
        const V = MooodShapes.V, hand = F.P('RightHand');
        const tip = V.add(hand, [0, -0.88 * F.fit.h, 0.05]);
        F.bar(hand, tip, 0.016 * F.k, 0.012 * F.k, [[0, F.colors.accent || F.colors.shoes]], 6, [1, 0, 0]);
      } }
    }
  }
};
