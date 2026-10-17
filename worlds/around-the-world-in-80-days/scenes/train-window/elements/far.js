// The far land, three kilometres off, along every land: rolling hills (Europe, India, England), the prairie's buttes, the
// snow's mountains under snow — barely moving as the train goes. Painted in each land's colours; the air hazes them.
const L = e.lib, P = L.plan, D = 3000, hash = e.anim.hash;
// a rolling skyline round a land's middle C: its height by smooth noise, the same each period
const ridge = (C, base, amp, cell, seed) => {
  const R = L.reachOf(D, 400);
  g.beginPath();
  g.moveTo(C - R, 20);
  for (let u = -R; u <= R; u += 20) g.lineTo(C + u, -(base + amp * (0.5 + 0.5 * L.pnoise(u, cell, seed))));
  g.lineTo(C + R, 20);
  g.closePath();
  g.fill();
};
for (const land of P.lands) {
  const C = L.colours(land), X = L.centre(land);
  g.fillStyle = L.rgba(C.far);
  if (land === 'europe') ridge(X, 25, 90, 1000, 1);
  if (land === 'india') ridge(X, 10, 45, 800, 2);
  if (land === 'england') ridge(X, 5, 25, 500, 3);
  if (land === 'prairie') {
    // flat, but for a butte now and then, its top cut level
    L.along(land, 2000, D, 4, (x, j) => {
      const h = 50 + 90 * hash(j, 5), w = 250 + 500 * hash(j, 6);
      g.beginPath();
      g.moveTo(x - w / 2 - h * 1.4, 0);
      g.lineTo(x - w / 2, -h);
      g.lineTo(x + w / 2, -h);
      g.lineTo(x + w / 2 + h * 1.6, 0);
      g.closePath();
      g.fill();
    }, 1000);
  }
  if (land === 'snow') {
    // mountains, their upper slopes under snow
    const snow = L.rgba(L.mixc(C.groundFar, C.top, 0.15));
    L.along(land, 800, D, 7, (x, j) => {
      const h = 380 + 520 * hash(j, 8), w = h * (1.3 + 0.6 * hash(j, 9)), peak = x + (hash(j, 10) - 0.5) * w * 0.3;
      g.fillStyle = L.rgba(C.far);
      g.beginPath();
      g.moveTo(x - w, 0);
      g.lineTo(peak, -h);
      g.lineTo(x + w, 0);
      g.closePath();
      g.fill();
      g.fillStyle = snow;
      g.beginPath();
      g.moveTo(peak, -h);
      g.lineTo(peak + (x + w - peak) * 0.4, -h * 0.6);
      g.lineTo(peak + (x - w - peak) * 0.4, -h * 0.6);
      g.closePath();
      g.fill();
    }, 1800);
  }
}
