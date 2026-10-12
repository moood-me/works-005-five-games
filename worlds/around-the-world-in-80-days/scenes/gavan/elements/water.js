// The harbour's water from the quay to the far shore, seen from above: green-grey, darker in slow broad patches. The
// engine makes it water (reflect): the shore, the ships, the lanterns and the sky mirrored in it, the sun's and the
// moon's paths and the lights' long ones, small waves breaking it into glints.
g.fillStyle = '#5f7a7c';
g.fillRect(-1500, -997.5, 3000, 1995);
const h = e.anim.hash;
for (let i = 0; i < 160; i++) {
  const x = -1500 + 3000 * h(i, 1);
  const y = -997 + 1990 * h(i, 2) ** 2;
  const rr = 20 + 140 * h(i, 3);
  e.lib.glow(g, x, y, rr, h(i, 4) < 0.5 ? '#4c6668' : '#6c8486', 0.35, 0.35);
}
