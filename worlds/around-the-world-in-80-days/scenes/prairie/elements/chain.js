// What hangs under the cars on the line's middle, seen from low beside the wheels: the dark underframe of each car, its
// truss rods and queen posts, the drawheads at the cars' ends and the links between them, the chains Passepartout goes by
// (layers that sag and swing as the cars sway: c0 under the middle car, c1 between the first and the middle car, c2
// under the first car, c3 at the coupling with the tender) and the coupling's link (a layer: it drops when the pin is
// out). Points `c0`…`c3` — the chains; `hand_r`, `hand_l`, `pp` — where Passepartout's hands hold and where he lies
// (animate, by pp_car).
const L = e.lib, { R } = L, TAU = Math.PI * 2;
for (let k = 0; k < L.plan.cars.n; k++) {
  const x0 = L.carX(k);
  R(g, x0 - 15.4, -1.12, x0 - 0.1, -0.98, '#231f1c');
  g.strokeStyle = '#3a3632';
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(x0 - 14.2, -1.0);
  g.lineTo(x0 - 10.4, -0.6);
  g.lineTo(x0 - 5.1, -0.6);
  g.lineTo(x0 - 1.3, -1.0);
  g.stroke();
  for (const x of [x0 - 10.4, x0 - 5.1]) R(g, x - 0.04, -1.0, x + 0.04, -0.58, '#3a3632');
  R(g, x0 - 0.1, -1.0, x0 + 0.32, -0.74, '#2a2622');
  R(g, x0 - 15.82, -1.0, x0 - 15.4, -0.74, '#2a2622');
  if (k < L.plan.cars.n - 1) R(g, x0 - 16.2, -0.9, x0 - 15.6, -0.84, '#6e7176');
}
// the chains: links along a sag, each a layer hung from its two ends
L.plan.chains.forEach((cx, k) => {
  e.layer(`ch${k}`, { pivot: [cx, -0.98], box: [cx - 0.75, -1.1, cx + 0.75, -0.35] }, g => {
    g.strokeStyle = '#5e6168';
    g.lineWidth = 0.025;
    for (let i = 0; i <= 11; i++) {
      const u = i / 11, x = cx - 0.55 + 1.1 * u, y = -0.98 + 0.38 * 4 * u * (1 - u);
      g.beginPath();
      g.ellipse(x, y, 0.05, 0.025, i % 2 ? 0.6 : -0.6, 0, TAU);
      g.stroke();
    }
  });
  e.at(cx, -0.62, `c${k}`);
});
// the coupling's link, from the first car's drawhead to the tender's pin
e.layer('link', { pivot: [0.15, -0.88], box: [-0.05, -1.1, 0.75, -0.2] }, g => {
  g.strokeStyle = '#6e7176';
  g.lineWidth = 0.06;
  g.beginPath();
  g.ellipse(0.38, -0.88, 0.24, 0.06, 0, 0, TAU);
  g.stroke();
});
