// The people of «Старший сын» as people in a scene: figures of shapes in the world's winter style (a slender
// silhouette with a rim of the lamps' and windows' light, no faces). Only Busygin and Nina so far.
return {
  characters: {
    // Володя Бусыгин, 21: tall, a long dark-grey coat, a light scarf, bare dark head
    busygin: { kind: 'shapes', style: 'zima', who: 'man', garment: 'coat', hair: 'short', scarf: true,
      body: { height: 1.05, shoulders: 1.0, thick: 0.92 },
      colors: { skin: '#cdb09a', hair: '#1a1816', garment: '#5d6577', bottom: '#2c2f38', shoes: '#14141a', accent: '#e4e0d4' } },
    // Нина, 19: a coat with a fur collar, bare head, a long braid
    nina: { kind: 'shapes', style: 'zima', who: 'woman', garment: 'coat', hair: 'ponytail', scarf: true,
      body: { height: 0.94, shoulders: 0.88, thick: 0.86 },
      colors: { skin: '#d6b8a2', hair: '#2a1a12', garment: '#8c5f58', bottom: '#2c2a30', shoes: '#18141a', accent: '#d9d3c6' } },
  },
  shapes: {
    styles: { zima: { from: 'shadow', name: 'Зима', paint: 'rim', line: false, ground: 'night' } },
  },
};
