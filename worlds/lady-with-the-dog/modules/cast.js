// The world's people — only what the scene «Ореанда (opus)» needs: its three characters, the world's style, a beret.
// (The full cast — 47 looks, its parts and motions — is the area «Каст и движения»: this is a seed it may replace.)
const V = MooodShapes.V;
return {
  ...data,
  characters: {
    gurov_summer: { kind: 'shapes', style: 'dama', who: 'man', garment: 'jacket', hair: 'short', hat: 'hat', face: 'none',
      body: { height: 1.03, thick: 1.12, shoulders: 1.06 },
      colors: { top: '#ddd6c4', bottom: '#cfc7b1', garment: '#d8d0bb', hat: '#e2d4a6', hair: '#5a4a3a', shoes: '#6b5a48', skin: '#d8b89e' } },
    anna_summer: { kind: 'shapes', style: 'dama', who: 'woman', garment: 'dress', hair: 'bun', hat: 'beret', face: 'none',
      body: { height: 0.94 },
      colors: { top: '#efedf1', garment: '#efedf1', bottom: '#efedf1', hair: '#d9c08c', hat: '#c9c5d8', shoes: '#857c8a', skin: '#e6c6ad' } },
    watchman: { kind: 'shapes', style: 'dama', who: 'grandpa', garment: 'coat', hat: 'cap', face: 'none', scarf: false,
      colors: { garment: '#5d5850', bottom: '#4a453f', hat: '#3f3a36', shoes: '#2f2a26', skin: '#b98f74', hair: '#c9c4bb' } },
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
    },
  },
};
