// The cars' floor (people stand on it, carried; seen through the open doorways and, from inside the second car, under
// its window): worn brown linoleum, its seams across, the vestibules' ribbed metal plates. The spot in the second
// car's front vestibule by the doorway's left jamb, 0.6 m in from the side — floor#vest (Silva's). From above: x along
// the train, y toward the platform; the plane's middle 1.45 m in from the side.
const EL = e.kit.trains.ELECTRIC, W = EL.half * 2 - 0.4;
g.fillStyle = '#6b5a47';
g.fillRect(-W / 2, -1.45, W, 2.9);
g.fillStyle = 'rgba(40,32,24,0.35)';
for (let x = -W / 2; x < W / 2; x += 1.2) g.fillRect(x, -1.45, 0.02, 2.9);
g.fillStyle = '#7d7c78';
for (let k = 0; k < EL.cars; k++) {
  for (const x of EL.doors(k)) {
    g.fillRect(x - 0.75, -1.45, 1.5, 2.9);
    g.fillStyle = '#5f5e5b';
    for (let y = -1.4; y < 1.45; y += 0.08) g.fillRect(x - 0.72, y, 1.44, 0.025);
    g.fillStyle = '#7d7c78';
  }
}
e.at(EL.doors(1)[1] - 0.4, 1.45 - 0.6, 'vest');
