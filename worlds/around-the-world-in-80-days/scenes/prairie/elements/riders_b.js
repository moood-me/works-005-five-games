// Three more riders a little behind the first, nearer the train: a chestnut, a dun, a piebald; one with his rifle up
// (`gun1`). Four strides each, as the first.
const L = e.lib;
const RIDERS = [
  { x: -9, horse: '#8a4a26', robe: '#6a4a32', stripe: '#e0d2a8', leggings: '#4a3020', rifle: false },
  { x: -2, horse: '#a88a5e', robe: '#5a3e2a', stripe: '#b8402e', leggings: '#5a3a24', rifle: true },
  { x: 5, horse: '#4a3428', patches: true, robe: '#7a5236', stripe: '#3d6a8a', leggings: '#4a3020', rifle: false },
];
RIDERS.forEach((r, i) => {
  for (let f = 0; f < 4; f++) e.layer(`r${i}f${f}`, { box: [r.x - 1.9, -3.6, r.x + 2.0, 0.2] }, g => L.rider(g, r.x, f, r));
});
e.at(...L.muzzle(RIDERS[1].x), 'gun1');
