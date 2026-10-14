// the people of «Старший сын»: shadow figures with a rim of light, no faces
const base = { kind: 'shapes', style: 'shadow', paint: 'rim', line: false, face: 'none' };
return {
  characters: {
    busygin: Object.assign({}, base, {
      who: 'man', garment: 'coat', hat: 'none', hair: 'short', scarf: true,
      body: { height: 1.04 },
      colors: { garment: '#5d6781', accent: '#e8ebf2', hair: '#1d1f28', bottom: '#2b2f3c', shoes: '#1b1d25' },
    }),
    nina: Object.assign({}, base, {
      who: 'woman', garment: 'coat', hat: 'none', hair: 'long', scarf: true,
      body: { height: 0.93 },
      colors: { garment: '#8a6a76', accent: '#d9cdc6', hair: '#3a2a2c', bottom: '#2b2f3c', shoes: '#1b1d25' },
    }),
  },
};
