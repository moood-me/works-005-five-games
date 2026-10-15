// cast — the people of «Старший сын»: figures of shapes in the world's style `zima` (from `shadow`: slender, a small
// head, painted `rim` — a silhouette that shows its colours on the side the light is on, rimmed by the lights behind).
// No faces. Who is here (scenes.md, «Люди мира»):
//   busygin, busygin_shirt — tall; a long dark-grey coat, a light scarf, no hat / at home: a light shirt, a dark sweater
//   nina — a coat with a fur collar, no hat, a long braid down her back
//   silva, silva_shirt — stockier; a brown check coat, a hat tipped aside, a bright scarf / at home: a jacket, no hat
//   sarafanov, sarafanov_hat, sarafanov_home, sarafanov_funeral — small and thin; an old dark coat, a long light scarf,
//     a fur hat / the hat in his right hand / at home: a brown knitted cardigan, grey hair / at the funeral: a black
//     coat, the fur hat, the long light scarf (the only one among the brass), the clarinet low in both hands
//   vasenka, vasenka_home — lanky, thin; an open quilted jacket, no hat, tousled hair / at home: a grey sweater
//   band1, band2, band3 — the brass at the funeral: black coats, hats, no scarves; a trumpet, a tuba, a drum
//   mourner1…mourner4 — dark coats, kerchiefs; one old woman in a sheepskin coat
// Parts (in the hands or on the body): case (the clarinet's case, right hand), hat_hand, clarinet_low, trumpet, tuba,
// drum, box_held (the snuffbox, right hand).

const V = () => MooodShapes.V;
const hairCap = (F, scale) => {
  const h = F.head;
  F.cap(h.at, h.axes, h.egg.map(v => v * h.r * h.out * scale), [0, 0.62, -0.78], -0.12, F.colors.hair, h.sides, h.square);
};
const hand = (F, name) => {
  const j = name === 'l' ? 'LeftHand' : 'RightHand';
  return { at: F.P(j), axes: [F.side(j), F.up(j), F.fwd(j)] };
};
// the colours of those who come in more than one look (a look made `from` another takes its colours whole, not merged)
const C_BUS = { skin: '#d6ad8e', hair: '#231c18', garment: '#4b4d53', top: '#4b4d53', bottom: '#2a2a2f', shoes: '#1d1b1b', accent: '#ddd6c6' };
const C_SIL = { skin: '#d9ad8c', hair: '#2a1d15', garment: '#6e4b31', top: '#6e4b31', bottom: '#2e2723', shoes: '#1d1814', hat: '#3a3029', accent: '#b8573a' };
const C_SAR = { skin: '#d4a98b', hair: '#bdb8b0', garment: '#3c3a3a', top: '#3c3a3a', bottom: '#262424', shoes: '#1b1918', hat: '#4b3c31', accent: '#d6d0c2' };
const C_VAS = { skin: '#dcb497', hair: '#5a4130', garment: '#3b4036', top: '#9a948a', bottom: '#2c2c2e', shoes: '#1e1c1b' };
const BRASS = [0.66, 0.5, 0.24, 1];
const BLACK = [0.07, 0.07, 0.08, 1];
const LEATHER = [0.16, 0.11, 0.08, 1];
const SILVER = [0.72, 0.72, 0.7, 1];

// a fur hat over the crown, pulled low: a round, a little tall
const furHat = F => {
  const { add, mul } = V();
  const { at, axes: [hs, hu], r } = F.head;
  F.ball(add(at, mul(hu, r * 0.48)), F.head.axes, [r * 1.16, r * 0.74, r * 1.14], F.colors.hat, F.sides);
  F.ball(add(at, mul(hu, r * 0.16)), F.head.axes, [r * 1.12, r * 0.3, r * 1.1], F.colors.hat, F.sides);
};

return {
  ...(data || {}),
  characters: {
    busygin: { kind: 'shapes', style: 'zima', who: 'busygin', face: 'none', line: false },
    busygin_shirt: { kind: 'shapes', style: 'zima', who: 'busygin_shirt', face: 'none', line: false },
    nina: { kind: 'shapes', style: 'zima', who: 'nina', face: 'none', line: false },
    silva: { kind: 'shapes', style: 'zima', who: 'silva', face: 'none', line: false },
    silva_shirt: { kind: 'shapes', style: 'zima', who: 'silva_shirt', face: 'none', line: false },
    sarafanov: { kind: 'shapes', style: 'zima', who: 'sarafanov', face: 'none', line: false },
    sarafanov_hat: { kind: 'shapes', style: 'zima', who: 'sarafanov_hat', face: 'none', line: false },
    sarafanov_home: { kind: 'shapes', style: 'zima', who: 'sarafanov_home', face: 'none', line: false },
    sarafanov_funeral: { kind: 'shapes', style: 'zima', who: 'sarafanov_funeral', face: 'none', line: false },
    vasenka: { kind: 'shapes', style: 'zima', who: 'vasenka', face: 'none', line: false },
    vasenka_home: { kind: 'shapes', style: 'zima', who: 'vasenka_home', face: 'none', line: false },
    band1: { kind: 'shapes', style: 'zima', who: 'band1', face: 'none', line: false },
    band2: { kind: 'shapes', style: 'zima', who: 'band2', face: 'none', line: false },
    band3: { kind: 'shapes', style: 'zima', who: 'band3', face: 'none', line: false },
    mourner1: { kind: 'shapes', style: 'zima', who: 'mourner1', face: 'none', line: false },
    mourner2: { kind: 'shapes', style: 'zima', who: 'mourner2', face: 'none', line: false },
    mourner3: { kind: 'shapes', style: 'zima', who: 'mourner3', face: 'none', line: false },
    mourner4: { kind: 'shapes', style: 'zima', who: 'mourner4', face: 'none', line: false },
  },
  shapes: {
    styles: {
      zima: { from: 'shadow', name: 'зима', paint: 'rim', limb: 1.0, neck: 1.05, head: 1.0 },
    },
    characters: {
      busygin: {
        from: 'man', name: 'Бусыгин', body: { height: 1.04, shoulders: 1.08, thick: 1.0 },
        garment: 'long_coat', hair: 'short', hat: 'none', scarf: true, face: 'none',
        colors: C_BUS,
      },
      busygin_shirt: {
        from: 'busygin', name: 'Бусыгин дома', garment: 'sweater', scarf: false, parts: ['collar'],
        colors: { ...C_BUS, top: '#2f3440', garment: '#2f3440', accent: '#d9d4c8' },
      },
      nina: {
        from: 'woman', name: 'Нина', body: { height: 0.95, shoulders: 0.88, hips: 1.04, thick: 0.86 },
        garment: 'fur_coat', hair: 'braid', hat: 'none', scarf: false, face: 'none', parts: ['fur_collar'],
        colors: { skin: '#e2bea0', hair: '#4a2c1d', garment: '#5d3d3b', top: '#5d3d3b', bottom: '#2c2729', shoes: '#211b1a', accent: '#8a7461' },
      },
      silva: {
        from: 'man', name: 'Сильва', body: { height: 0.99, shoulders: 1.08, thick: 1.18 },
        garment: 'check_coat', hair: 'short', hat: 'hat_aside', scarf: true, face: 'none',
        colors: C_SIL,
      },
      silva_shirt: {
        from: 'silva', name: 'Сильва дома', garment: 'jacket', hat: 'none', scarf: false,
        colors: { ...C_SIL, garment: '#5b4636', top: '#b9ae9a' },
      },
      sarafanov: {
        from: 'old', name: 'Сарафанов', body: { height: 0.92, shoulders: 0.94, thick: 0.86 },
        garment: 'old_coat', hair: 'short', hat: 'fur_hat', scarf: true, face: 'none', parts: ['long_scarf'],
        colors: C_SAR,
      },
      sarafanov_hat: {
        from: 'sarafanov', name: 'Сарафанов с шапкой в руке', hat: 'none', parts: ['long_scarf', 'hat_hand'], colors: C_SAR,
      },
      sarafanov_home: {
        from: 'sarafanov', name: 'Сарафанов дома', garment: 'cardigan', hat: 'none', scarf: false, parts: [],
        colors: { ...C_SAR, garment: '#6b4c35', top: '#cfc6b4' },
      },
      sarafanov_funeral: {
        from: 'sarafanov', name: 'Сарафанов на похоронах', parts: ['long_scarf', 'clarinet_low'],
        colors: { ...C_SAR, garment: '#1e1d20', top: '#1e1d20', hat: '#2a2523', accent: '#e2ddd2' },
      },
      vasenka: {
        from: 'youth', name: 'Васенька', body: { height: 1.01, shoulders: 0.94, thick: 0.78, arms: 1.04, legs: 1.03 },
        garment: 'telogreika', hair: 'spiky', hat: 'none', scarf: false, face: 'none',
        colors: C_VAS,
      },
      vasenka_home: {
        from: 'vasenka', name: 'Васенька дома', garment: 'sweater', colors: { ...C_VAS, garment: '#77787a', top: '#77787a' },
      },
      band1: {
        from: 'man', name: 'Трубач', body: { height: 1.0, thick: 1.05 }, garment: 'coat', hair: 'short', hat: 'fur_hat', scarf: false, face: 'none', parts: ['trumpet'],
        colors: { garment: '#1c1b1e', top: '#1c1b1e', bottom: '#19181a', hat: '#222024', shoes: '#141313' },
      },
      band2: {
        from: 'man', name: 'Тубист', body: { height: 1.02, thick: 1.25 }, garment: 'coat', hair: 'short', hat: 'fur_hat', scarf: false, face: 'none', parts: ['tuba'],
        colors: { garment: '#1f1e21', top: '#1f1e21', bottom: '#19181a', hat: '#262328', shoes: '#141313' },
      },
      band3: {
        from: 'man', name: 'Барабанщик', body: { height: 0.98, thick: 1.1 }, garment: 'coat', hair: 'short', hat: 'cap', scarf: false, face: 'none', parts: ['drum'],
        colors: { garment: '#1d1c1f', top: '#1d1c1f', bottom: '#19181a', hat: '#1b1a1c', shoes: '#141313' },
      },
      mourner1: {
        from: 'woman', name: 'Провожающая', body: { height: 0.92, thick: 0.95 }, garment: 'coat', hair: 'bun', hat: 'kerchief', face: 'none',
        colors: { garment: '#2a2628', top: '#2a2628', hat: '#3b3438', bottom: '#201d1e' },
      },
      mourner2: {
        from: 'woman', name: 'Старуха в тулупе', body: { height: 0.86, thick: 1.12, shoulders: 0.92 }, garment: 'tulup', hair: 'bun', hat: 'kerchief', face: 'none',
        colors: { garment: '#6c5843', top: '#6c5843', hat: '#4a4446', bottom: '#2a2420' },
      },
      mourner3: {
        from: 'man', name: 'Провожающий', body: { height: 0.97, thick: 1.0 }, garment: 'coat', hair: 'short', hat: 'cap', face: 'none',
        colors: { garment: '#29292c', top: '#29292c', hat: '#232226', bottom: '#1d1c1e' },
      },
      mourner4: {
        from: 'woman', name: 'Провожающая', body: { height: 0.9, thick: 0.9 }, garment: 'coat', hair: 'bun', hat: 'kerchief', face: 'none',
        colors: { garment: '#302a2a', top: '#302a2a', hat: '#5a4b4e', bottom: '#201d1e' },
      },
    },
    garments: {
      long_coat: { name: 'длинное пальто', hang: [{ to: 1.32, from: 'shoulders', flare: 0.15, ragged: false }], sleeves: 'garment' },
      fur_coat: { name: 'пальто', hang: [{ to: 1.22, from: 'shoulders', flare: 0.3, ragged: false }], sleeves: 'garment' },
      check_coat: { name: 'пальто в клетку', hang: [{ to: 1.08, from: 'shoulders', flare: 0.2, ragged: false }], sleeves: 'garment' },
      old_coat: { name: 'старое пальто', hang: [{ to: 1.18, from: 'shoulders', flare: 0.16, ragged: true }], sleeves: 'garment' },
      tulup: { name: 'тулуп', hang: [{ to: 1.2, from: 'shoulders', flare: 0.34, ragged: false }], sleeves: 'garment' },
      telogreika: { name: 'телогрейка нараспашку', hang: [{ to: 0.55, from: 'shoulders', flare: 0.16, folds: false }], sleeves: 'garment' },
      cardigan: { name: 'вязаная кофта', hang: [{ to: 0.48, from: 'shoulders', flare: 0.08, folds: false }], sleeves: 'garment' },
      sweater: { name: 'свитер', hang: [{ to: 0.32, from: 'shoulders', flare: 0.05, folds: false }], sleeves: 'garment' },
    },
    hair: {
      braid: {
        name: 'коса',
        draw: F => {
          const { add, mul } = V();
          hairCap(F, 1.03);
          const { at: head, axes: [hs, hu, hf], r: rh } = F.head, fc = F.fwd('Chest');
          const from = add(head, add(mul(hf, -rh * 0.88), mul(hu, -rh * 0.3)));
          const mid = F.clear(F.swing('braid1', add(from, add([0, -0.2 * F.fit.h, 0], mul(fc, -0.05 * F.k))), 150), -1, rh * 0.28);
          const end = F.clear(F.swing('braid2', add(mid, [0, -0.21 * F.fit.h, 0]), 80), -1, rh * 0.22);
          F.tube([from, mid, end], [[0, rh * 0.34], [0.6, rh * 0.3], [1.6, rh * 0.22], [1.9, rh * 0.26], [2, 0.004]], [[0, F.colors.hair]], 10, hs, 0.85);
        },
      },
    },
    hats: {
      fur_hat: { name: 'меховая шапка', draw: furHat },
      // a hat tipped aside (Сильва's): a brim and a crown, leant to his right
      hat_aside: {
        name: 'шляпа набок',
        draw: F => {
          const { add, mul, unit, cross } = V();
          const { at: head, axes: [hs, hu, hf], r: rh } = F.head;
          const tilt = unit(add(add(hu, mul(hs, 0.2)), mul(hf, 0.06))), axes = [unit(cross(tilt, hf)), tilt, hf];
          F.ball(add(head, add(mul(hu, rh * 0.42), mul(hs, rh * 0.06))), axes, [rh * 1.7, rh * 0.06, rh * 1.6], F.colors.hat, F.sides * 2);
          F.ball(add(head, add(mul(hu, rh * 0.68), mul(hs, rh * 0.12))), axes, [rh * 0.88, rh * 0.52, rh * 0.86], F.colors.hat, F.sides, 3);
        },
      },
      // a kerchief over the head, tied under the chin: the head covered over the top and behind, the face open
      kerchief: {
        name: 'платок',
        draw: F => {
          const { add, mul } = V();
          const h = F.head;
          F.cap(h.at, h.axes, h.egg.map(v => v * h.r * h.out * 1.12), [0, 0.42, -0.9], -0.42, F.colors.hat, h.sides, h.square);
          F.ball(add(h.at, add(mul(h.axes[2], -h.r * 0.8), mul(h.axes[1], -h.r * 0.75))), h.axes, [h.r * 0.5, h.r * 0.5, h.r * 0.35], F.colors.hat, F.sides);
        },
      },
    },
    parts: {
      fur_collar: {
        name: 'меховой воротник',
        draw: F => {
          const { add, mul } = V();
          const uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest');
          const c = add(F.P('Neck1'), add(mul(uc, -0.035 * F.fit.h), mul(fc, -0.012 * F.k)));
          F.ball(c, [sd, uc, fc], [0.15 * F.k, 0.06 * F.fit.h, 0.12 * F.k], F.colors.accent, F.sides);
        },
      },
      // a light shirt collar over the sweater (Бусыгин at home)
      collar: {
        name: 'воротник рубашки',
        draw: F => {
          const { add, mul } = V();
          const uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest');
          F.ball(add(F.P('Neck1'), add(mul(uc, -0.02 * F.fit.h), mul(fc, 0.01 * F.k))), [sd, uc, fc], [0.075 * F.k, 0.03 * F.fit.h, 0.07 * F.k], F.colors.accent, F.sides);
        },
      },
      // Сарафанов's long light scarf: its two ends down the front of the coat, to the waist
      long_scarf: {
        name: 'длинный шарф',
        draw: F => {
          const { add, mul } = V();
          const uc = F.up('Chest'), fc = F.fwd('Chest'), sd = F.side('Chest'), r = 0.02 * F.k;
          for (const s of [-1, 1]) {
            const from = add(F.P('Neck1'), add(add(mul(sd, s * 0.045 * F.k), mul(fc, 0.07 * F.k)), mul(uc, -0.03 * F.fit.h)));
            const mid = F.clear(F.swing(`sc${s}a`, add(from, add([0, -0.24 * F.fit.h, 0], mul(fc, 0.02 * F.k))), 140), 1, 0.014 * F.fit.h);
            const end = F.clear(F.swing(`sc${s}b`, add(mid, [0, -0.24 * F.fit.h, 0]), 90), 1, 0.014 * F.fit.h);
            F.tube([from, mid, end], [[0, r * 1.6], [1, r * 1.7], [2, r * 1.5]], [[0, F.colors.accent]], 8, sd, 0.35);
          }
        },
      },
      // the clarinet's case, carried by its handle in the right hand: a long dark box
      case: {
        name: 'футляр',
        draw: F => {
          const { add, mul } = V();
          const { at, axes } = hand(F, 'r');
          F.ball(add(at, mul(axes[1], -0.07 * F.fit.h)), axes, [0.045 * F.k, 0.06 * F.fit.h, 0.3 * F.fit.h], LEATHER, 8, 3);
        },
      },
      hat_hand: {
        name: 'шапка в руке',
        draw: F => {
          const { add, mul } = V();
          const { at, axes } = hand(F, 'r');
          F.ball(add(at, mul(axes[1], -0.06 * F.fit.h)), axes, [0.1 * F.k, 0.07 * F.fit.h, 0.1 * F.k], F.colors.hat, F.sides);
        },
      },
      // the clarinet held low in both hands, bell down
      clarinet_low: {
        name: 'кларнет',
        draw: F => {
          const { add, mul, mean } = V();
          const c = mean([F.P('RightHand'), F.P('LeftHand')]);
          const top = add(c, [0, 0.16 * F.fit.h, 0]), bot = add(c, add([0, -0.38 * F.fit.h, 0], mul(F.fwd('Hips'), 0.06 * F.k)));
          F.bar(top, bot, 0.012 * F.k, 0.03 * F.k, [[0, BLACK], [0.93, SILVER]], 8, F.side('Hips'));
        },
      },
      // the trumpet held low in the right hand, bell forward and down
      trumpet: {
        name: 'труба',
        draw: F => {
          const { add, mul } = V();
          const { at, axes } = hand(F, 'r');
          const a = add(at, mul(axes[2], -0.14 * F.fit.h)), b = add(at, add(mul(axes[2], 0.3 * F.fit.h), mul(axes[1], -0.05 * F.fit.h)));
          F.bar(a, b, 0.012 * F.k, 0.07 * F.k, [[0, BRASS]], 10, axes[0]);
        },
      },
      // the tuba before the chest in both hands: a big brass round, its bell up over the shoulder
      tuba: {
        name: 'туба',
        draw: F => {
          const { add, mul, mean } = V();
          const fc = F.fwd('Chest'), uc = F.up('Chest'), sd = F.side('Chest');
          const c = add(mean([F.P('RightHand'), F.P('LeftHand'), F.P('Chest')]), mul(fc, 0.12 * F.k));
          F.ball(c, [sd, uc, fc], [0.17 * F.k, 0.24 * F.fit.h, 0.12 * F.k], BRASS, 14);
          F.bar(add(c, mul(uc, 0.18 * F.fit.h)), add(c, add(mul(uc, 0.42 * F.fit.h), mul(sd, -0.1 * F.k))), 0.05 * F.k, 0.14 * F.k, [[0, BRASS]], 12, fc);
        },
      },
      // the drum on its strap before the hips, the beater in the right hand
      drum: {
        name: 'барабан',
        draw: F => {
          const { add, mul } = V();
          const fh = F.fwd('Hips'), uh = F.up('Hips'), sd = F.side('Hips');
          const c = add(F.P('Hips'), add(mul(fh, 0.22 * F.k), mul(uh, 0.12 * F.fit.h)));
          F.ball(c, [sd, uh, fh], [0.12 * F.k, 0.22 * F.fit.h, 0.22 * F.k], [0.36, 0.13, 0.12, 1], 16);
          F.ball(c, [sd, uh, fh], [0.135 * F.k, 0.2 * F.fit.h, 0.2 * F.k], [0.78, 0.76, 0.7, 1], 16);
          const { at, axes } = hand(F, 'r');
          F.bar(at, add(at, mul(axes[1], -0.3 * F.fit.h)), 0.01 * F.k, 0.03 * F.k, [[0, LEATHER], [0.85, [0.85, 0.83, 0.78, 1]]], 6, axes[0]);
        },
      },
      // the snuffbox in the fingers of the right hand
      box_held: {
        name: 'табакерка',
        draw: F => {
          const { at, axes } = hand(F, 'r');
          F.ball(at, axes, [0.03 * F.k, 0.012 * F.fit.h, 0.04 * F.k], SILVER, 8, 3);
        },
      },
    },
  },
};
