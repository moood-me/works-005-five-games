// The world's people — what the scenes «Ореанда», «Станция», «Номер в Ялте», «Славянский базар» (opus) need: their
// characters, the world's style, a beret and a travelling hat, the things held in the hands.
// (The full cast — 47 looks, its parts and motions — is the area «Каст и движения»: this is a seed it may replace.)
const V = MooodShapes.V;

// a colour of the figure's own palette, as the figure gives its colours, from #rrggbb — the scale and the paint flag
// taken from one the figure has (so it is the same kind of value whatever the engine's scale)
function tone(F, hex, glow) {
  const ref = F.colors.accent || F.colors.top;
  const S = Math.max(ref[0], ref[1], ref[2]) > 1.5 ? 255 : 1;
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255 * S, ((n >> 8) & 255) / 255 * S, (n & 255) / 255 * S, glow ? 2 : ref[3]];
}
// the axes of a joint, as a ball wants them
const axesOf = (F, j) => [F.side(j), F.up(j), F.fwd(j)];
// between the two hands, a little in front of them
function between(F, up, fwd) {
  const a = F.P('LeftHand'), b = F.P('RightHand');
  const mid = V.mul(V.add(a, b), 0.5);
  const f = V.unit(V.add(F.fwd('LeftHand'), F.fwd('RightHand')));
  return V.add(V.add(mid, V.mul([0, 1, 0], up * F.fit.h)), V.mul(f, fwd * F.fit.h));
}

const man = (o) => ({ kind: 'shapes', style: 'dama', who: 'man', face: 'none', ...o });
const woman = (o) => ({ kind: 'shapes', style: 'dama', who: 'woman', face: 'none', ...o });

const GUROV_BODY = { height: 1.03, thick: 1.12, shoulders: 1.06 };
const ANNA_BODY = { height: 0.94 };

return {
  ...data,
  characters: {
    gurov_summer: man({ garment: 'jacket', hair: 'short', hat: 'hat', body: GUROV_BODY,
      colors: { top: '#ddd6c4', bottom: '#cfc7b1', garment: '#d8d0bb', hat: '#e2d4a6', hair: '#5a4a3a', shoes: '#6b5a48', skin: '#d8b89e', accent: '#f4f1ea' } }),
    // without the hat, in the same light summer suit (the room in Yalta)
    gurov_indoor: man({ garment: 'jacket', hair: 'short', hat: 'none', body: GUROV_BODY,
      colors: { top: '#ece7da', bottom: '#cfc7b1', garment: '#d8d0bb', hair: '#5a4a3a', shoes: '#6b5a48', skin: '#d8b89e', accent: '#f4f1ea' } }),
    // years later in Moscow: a dark frock coat, no hat, the hair going grey
    gurov_grey: man({ garment: 'coat', hair: 'short', hat: 'none', body: GUROV_BODY,
      colors: { top: '#e4e0d8', bottom: '#2f3036', garment: '#34353d', hair: '#a9a59e', shoes: '#26252a', skin: '#d8b89e', accent: '#f4f1ea' } }),
    anna_summer: woman({ garment: 'dress', hair: 'bun', hat: 'beret', body: ANNA_BODY,
      colors: { top: '#efedf1', garment: '#efedf1', bottom: '#efedf1', hair: '#d9c08c', hat: '#c9c5d8', shoes: '#857c8a', skin: '#e6c6ad', accent: '#f7f5f0' } }),
    // the room at night: the same pale dress, the hair let down, no beret
    anna_hairdown: woman({ garment: 'dress', hair: 'long', hat: 'none', body: ANNA_BODY,
      colors: { top: '#efedf1', garment: '#efedf1', bottom: '#efedf1', hair: '#d9c08c', shoes: '#857c8a', skin: '#e6c6ad', accent: '#f7f5f0' } }),
    // the station: a grey-blue travelling dress, a small hat
    anna_travel: woman({ garment: 'dress', hair: 'bun', hat: 'toque', body: ANNA_BODY,
      colors: { top: '#a9b6c6', garment: '#9fadbf', bottom: '#9fadbf', hair: '#d9c08c', hat: '#5d6577', shoes: '#4c4a52', skin: '#e6c6ad', accent: '#f7f5f0' } }),
    // Moscow, «Славянский базар»: his favourite grey dress, no hat
    anna_grey: woman({ garment: 'dress', hair: 'bun', hat: 'none', body: ANNA_BODY,
      colors: { top: '#a8a6ab', garment: '#9c9aa0', bottom: '#9c9aa0', hair: '#d9c08c', shoes: '#4c4a52', skin: '#e6c6ad', accent: '#f7f5f0' } }),
    watchman: { kind: 'shapes', style: 'dama', who: 'grandpa', garment: 'coat', hat: 'cap', face: 'none', scarf: false,
      colors: { garment: '#7c766b', bottom: '#4a453f', hat: '#3f3a36', shoes: '#2f2a26', skin: '#b98f74', hair: '#c9c4bb' } },
    // the far conductor with his lantern (its glass glows: the accent)
    conductor: man({ garment: 'coat', hair: 'short', hat: 'cap',
      colors: { top: '#3d4352', bottom: '#2e323c', garment: '#3a4050', hat: '#2b2f38', hair: '#4a3a2e', shoes: '#22222a', skin: '#c9a084', accent: '#ffd38a' } }),
    // a Moscow waiter in a tail coat, a white shirt-front; the tray's brass is the accent
    waiter: man({ garment: 'jacket', hair: 'short', hat: 'none', body: { height: 0.98 },
      colors: { top: '#ebe8e1', bottom: '#222228', garment: '#232329', hair: '#3a2f28', shoes: '#1c1c20', skin: '#d4ae94', accent: '#b8914f' } }),
  },
  shapes: {
    styles: { dama: { from: 'soft', paint: 'toned', face: 'none' } },
    hats: {
      // a beret: a soft flat disc on the crown, tilted a little to one side
      beret: { name: 'берет', draw: F => {
        const { at: head, axes: [hs, hu], r: rh } = F.head;
        const tilt = V.unit(V.add(hu, V.mul(hs, 0.22)));
        const fwd = V.unit(V.cross(hs, tilt));
        const axes = [V.unit(V.cross(tilt, fwd)), tilt, fwd];
        F.ball(V.add(head, V.add(V.mul(hu, rh * 0.66), V.mul(hs, rh * 0.1))), axes, [rh * 1.14, rh * 0.3, rh * 1.08], F.colors.hat, F.sides);
      } },
      // a small travelling hat: a low round crown on a narrow brim, set high on the head
      toque: { name: 'шляпка', draw: F => {
        const { at: head, axes: [hs, hu, hf], r: rh } = F.head;
        const axes = [hs, hu, hf];
        F.ball(V.add(head, V.mul(hu, rh * 0.62)), axes, [rh * 1.18, rh * 0.12, rh * 1.15], F.colors.hat, F.sides);
        F.ball(V.add(head, V.mul(hu, rh * 0.86)), axes, [rh * 0.78, rh * 0.36, rh * 0.76], F.colors.hat, F.sides);
      } },
    },
    parts: {
      // the white spitz held in both arms at the chest: a simple white bundle, the ears and the muzzle just told
      spitz_held: { name: 'шпиц на руках', draw: F => {
        const c = between(F, 0.07, 0.06);
        const ax = axesOf(F, 'Chest');
        const fur = F.colors.accent;
        F.ball(c, ax, [0.17 * F.fit.h, 0.12 * F.fit.h, 0.12 * F.fit.h], fur, 14);
        const head = V.add(c, V.add(V.mul(ax[0], 0.13 * F.fit.h), V.mul(ax[1], 0.1 * F.fit.h)));
        F.ball(head, ax, [0.075 * F.fit.h, 0.07 * F.fit.h, 0.07 * F.fit.h], fur, 12);
        F.ball(V.add(head, V.mul(ax[0], 0.07 * F.fit.h)), ax, [0.04 * F.fit.h, 0.025 * F.fit.h, 0.03 * F.fit.h], fur, 8);
        for (const s of [-1, 1]) F.ball(V.add(head, V.add(V.mul(ax[1], 0.07 * F.fit.h), V.mul(ax[2], s * 0.03 * F.fit.h))), ax, [0.018 * F.fit.h, 0.035 * F.fit.h, 0.015 * F.fit.h], fur, 6);
        F.ball(V.add(c, V.add(V.mul(ax[0], -0.15 * F.fit.h), V.mul(ax[1], 0.08 * F.fit.h))), ax, [0.06 * F.fit.h, 0.06 * F.fit.h, 0.06 * F.fit.h], fur, 10);
      } },
      // the conductor's lantern in his right hand: a dark frame round a glowing glass
      lantern: { name: 'фонарь', points: { glass: { joint: 'RightHand', off: [0, 0, 0], rise: -0.16 } }, draw: F => {
        const hand = F.P('RightHand'), ax = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        const c = V.add(hand, [0, -0.16 * F.fit.h, 0]);
        F.ball(V.add(hand, [0, -0.06 * F.fit.h, 0]), ax, [0.015 * F.fit.h, 0.04 * F.fit.h, 0.015 * F.fit.h], tone(F, '#2a2a30'), 6);
        F.ball(c, ax, [0.055 * F.fit.h, 0.08 * F.fit.h, 0.055 * F.fit.h], tone(F, '#ffd38a', true), 10);
        F.ball(V.add(c, [0, 0.085 * F.fit.h, 0]), ax, [0.065 * F.fit.h, 0.02 * F.fit.h, 0.065 * F.fit.h], tone(F, '#2a2a30'), 10);
      } },
      // a white plate with the red slice of watermelon on it, held in both hands before him
      plate: { name: 'тарелка с ломтем', draw: F => {
        const c = between(F, 0.03, 0.08), ax = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        F.ball(c, ax, [0.12 * F.fit.h, 0.012 * F.fit.h, 0.12 * F.fit.h], tone(F, '#f2efe8'), 16);
        F.ball(V.add(c, [0, 0.03 * F.fit.h, 0]), ax, [0.08 * F.fit.h, 0.03 * F.fit.h, 0.035 * F.fit.h], tone(F, '#b8403a'), 10);
        F.ball(V.add(c, [0, 0.016 * F.fit.h, -0.03 * F.fit.h]), ax, [0.085 * F.fit.h, 0.012 * F.fit.h, 0.012 * F.fit.h], tone(F, '#3f6a3c'), 8);
      } },
      // the waiter's brass tray with the samovar on it, carried in both hands
      tray: { name: 'поднос с самоваром', draw: F => {
        const c = between(F, 0.0, 0.1), ax = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        const brass = F.colors.accent;
        F.ball(c, ax, [0.24 * F.fit.h, 0.012 * F.fit.h, 0.17 * F.fit.h], brass, 18);
        F.ball(V.add(c, [0, 0.16 * F.fit.h, 0]), ax, [0.11 * F.fit.h, 0.13 * F.fit.h, 0.11 * F.fit.h], brass, 14);
        F.ball(V.add(c, [0, 0.32 * F.fit.h, 0]), ax, [0.045 * F.fit.h, 0.05 * F.fit.h, 0.045 * F.fit.h], brass, 10);
        F.ball(V.add(c, [0, 0.38 * F.fit.h, 0]), ax, [0.035 * F.fit.h, 0.03 * F.fit.h, 0.035 * F.fit.h], tone(F, '#e8e4dc'), 8);
      } },
    },
  },
};
