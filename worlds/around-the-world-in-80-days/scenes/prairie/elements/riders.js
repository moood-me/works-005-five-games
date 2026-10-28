// Three Sioux riders galloping alongside the train on its near side: ponies bay, piebald and grey, the riders in robes
// with a coloured stripe, feathers in their hair, two with a rifle raised (their muzzles — the points `gun1`, `gun2`:
// the smoke of their shots). Each rider in four strides, each stride a layer, one shown at a time (animate); `hooves` —
// where the snow flies from under them.
const L = e.lib;
const RIDERS = [
  { x: -8, horse: '#6b4128', robe: '#7a4a2e', stripe: '#b8402e', leggings: '#5a3a24', rifle: true },
  { x: -1, horse: '#3a2a22', patches: true, robe: '#5e4a36', stripe: '#d8b04a', leggings: '#4a3020', rifle: false },
  { x: 6, horse: '#8d877e', robe: '#8a5a3a', stripe: '#3d6a8a', leggings: '#5a3a24', rifle: true },
];
RIDERS.forEach((r, i) => {
  for (let f = 0; f < 4; f++) e.layer(`r${i}f${f}`, { box: [r.x - 1.9, -3.6, r.x + 2.0, 0.2] }, g => L.rider(g, r.x, f, r));
});
e.at(...L.muzzle(RIDERS[0].x), 'gun1');
e.at(...L.muzzle(RIDERS[2].x), 'gun2');
e.at(-1, -0.1, 'hooves');
e.at(-1, -2.2);
