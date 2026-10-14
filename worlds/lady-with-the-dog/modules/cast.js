const V = MooodShapes.V;
return {
  ...(data || {}),
  characters: {
    gurov_summer: {
      kind: 'shapes',
      style: 'dama',
      who: 'man',
      garment: 'jacket',
      hat: 'hat',
      hair: 'short',
      face: 'none',
      body: { height: 1.04, thick: 1.12, shoulders: 1.05 },
      colors: { garment: '#d8d4c6', bottom: '#cdc8b8', hat: '#ebe4cc', hair: '#6b6258', skin: '#c8a58c', shoes: '#4a4440' },
    },
    anna_summer: {
      kind: 'shapes',
      style: 'dama',
      who: 'woman',
      garment: 'dress',
      hat: 'cap',
      hair: 'bob',
      face: 'none',
      body: { height: 0.93 },
      colors: { garment: '#efede8', hat: '#8d9cc0', hair: '#dcc48c', skin: '#d2b19a', shoes: '#8a8a94' },
    },
    watchman: {
      kind: 'shapes',
      style: 'dama',
      who: 'old',
      garment: 'coat',
      hat: 'cap',
      face: 'none',
      parts: ['stick'],
      colors: { garment: '#5d5a58', bottom: '#4a4846', hat: '#3d3c40', skin: '#b99a84', hair: '#9a9a9a', shoes: '#33302e', accent: '#6e5a46' },
    },
  },
  shapes: {
    styles: { dama: { from: 'soft', paint: 'rim' } },
    parts: {
      stick: {
        name: 'палка',
        draw: F => {
          const hand = F.P('RightHand');
          const up = F.up('RightHand');
          const axes = [F.side('RightHand'), up, F.fwd('RightHand')];
          const c = V.add(hand, V.mul(up, -0.38 * F.k));
          F.ball(c, axes, [0.016 * F.k, 0.42 * F.k, 0.016 * F.k], F.colors.accent, 8);
        },
      },
    },
  },
};
