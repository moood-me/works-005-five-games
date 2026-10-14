// cast — the people of «Старший сын»: figures of shapes in the world's style `zima` (from `shadow`: slender, a small
// head, painted `rim` — a silhouette that shows its colours on the side the light is on, rimmed by the lights behind).
// No faces. Here: Бусыгин and Нина as they are outside in winter (the rest of the cast comes with its scenes).
//   busygin — tall, a long dark-grey coat, a light scarf, no hat, short dark hair
//   nina — a coat with a fur collar, no hat, a long braid down her back

const hairCap = (F, scale) => {
  const h = F.head;
  F.cap(h.at, h.axes, h.egg.map(v => v * h.r * h.out * scale), [0, 0.62, -0.78], -0.12, F.colors.hair, h.sides, h.square);
};

return {
  ...(data || {}),
  characters: {
    busygin: { kind: 'shapes', style: 'zima', who: 'busygin', face: 'none', line: false },
    nina: { kind: 'shapes', style: 'zima', who: 'nina', face: 'none', line: false },
  },
  shapes: {
    styles: {
      zima: { from: 'shadow', name: 'зима', paint: 'rim', limb: 1.0, neck: 1.05, head: 1.0 },
    },
    characters: {
      busygin: {
        from: 'man', name: 'Бусыгин', body: { height: 1.04, shoulders: 1.08, thick: 1.0 },
        garment: 'long_coat', hair: 'short', hat: 'none', scarf: true, face: 'none',
        colors: { skin: '#d6ad8e', hair: '#231c18', garment: '#4b4d53', top: '#4b4d53', bottom: '#2a2a2f', shoes: '#1d1b1b', accent: '#ddd6c6' },
      },
      nina: {
        from: 'woman', name: 'Нина', body: { height: 0.95, shoulders: 0.88, hips: 1.04, thick: 0.86 },
        garment: 'fur_coat', hair: 'braid', hat: 'none', scarf: false, face: 'none', parts: ['fur_collar'],
        colors: { skin: '#e2bea0', hair: '#4a2c1d', garment: '#5d3d3b', top: '#5d3d3b', bottom: '#2c2729', shoes: '#211b1a', accent: '#8a7461' },
      },
    },
    garments: {
      long_coat: { name: 'длинное пальто', hang: [{ to: 1.32, from: 'shoulders', flare: 0.15, ragged: false }], sleeves: 'garment' },
      fur_coat: { name: 'пальто', hang: [{ to: 1.22, from: 'shoulders', flare: 0.3, ragged: false }], sleeves: 'garment' },
    },
    hair: {
      braid: {
        name: 'коса',
        draw: F => {
          const { add, mul } = MooodShapes.V;
          hairCap(F, 1.03);
          const { at: head, axes: [hs, hu, hf], r: rh } = F.head, fc = F.fwd('Chest');
          const from = add(head, add(mul(hf, -rh * 0.88), mul(hu, -rh * 0.3)));
          const mid = F.clear(F.swing('braid1', add(from, add([0, -0.2 * F.fit.h, 0], mul(fc, -0.05 * F.k))), 150), -1, rh * 0.28);
          const end = F.clear(F.swing('braid2', add(mid, [0, -0.21 * F.fit.h, 0]), 80), -1, rh * 0.22);
          F.tube([from, mid, end], [[0, rh * 0.34], [0.6, rh * 0.3], [1.6, rh * 0.22], [1.9, rh * 0.26], [2, 0.004]], [[0, F.colors.hair]], 10, hs, 0.85);
        },
      },
    },
    parts: {
      fur_collar: {
        name: 'меховой воротник',
        draw: F => {
          const { add, mul } = MooodShapes.V;
          const uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest');
          const c = add(F.P('Neck1'), add(mul(uc, -0.035 * F.fit.h), mul(fc, -0.012 * F.k)));
          F.ball(c, [sd, uc, fc], [0.15 * F.k, 0.06 * F.fit.h, 0.12 * F.k], F.colors.accent, F.sides);
        },
      },
    },
  },
};
