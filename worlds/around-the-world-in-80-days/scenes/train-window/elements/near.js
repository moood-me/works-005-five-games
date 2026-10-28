// Close to the line: telegraph poles every fifty metres and their wires swooping between them, and what grows by the
// track — grass (Europe), tall grass and a palm now and then by the river (India), tufts out of the snow (the prairie),
// snow banks (the snow), wet bushes (England). Each land the same every period along the line.
const L = e.lib, P = L.plan, D = 14, h = e.anim.hash, span = 50;
for (const land of P.lands) {
  const C = L.colours(land), X = L.centre(land), R = L.reachOf(D, span);
  if (land === 'snow') {
    // a bank of snow along the line
    g.fillStyle = L.rgba(C.groundNear);
    g.beginPath();
    g.moveTo(X - R, 0);
    for (let u = -R; u <= R; u += 0.5) g.lineTo(X + u, -0.5 - 0.35 * (1 + L.pnoise(u, 5, 91)));
    g.lineTo(X + R, 0);
    g.closePath();
    g.fill();
  } else {
    // clumps of grass: a few blades each, bending
    g.strokeStyle = L.rgba(C.near);
    g.lineCap = 'round';
    g.lineWidth = 0.05;
    L.along(land, 1.25, D, 92, (x, j) => {
      const t = (land === 'india' ? 1.5 : 0.7) * (0.4 + h(j, 93));
      g.beginPath();
      for (let k = 0; k < 5; k++) {
        const lean = (k - 2) * 0.12 + 0.2 * (h(j * 5 + k, 94) - 0.5), bt = t * (0.6 + 0.4 * h(j * 5 + k, 101)), x0 = x + (k - 2) * 0.05;
        g.moveTo(x0, 0);
        g.quadraticCurveTo(x0 + lean * bt * 0.3, -bt * 0.6, x0 + lean * bt, -bt);
      }
      g.stroke();
    });
    if (land === 'england') {
      g.fillStyle = L.rgba(C.near);
      L.along(land, 8, D, 95, (x, j) => {
        if (h(j, 96) < 0.8) return;
        g.beginPath();
        g.ellipse(x, 0, 0.8 + 0.6 * h(j, 97), 0.7, 0, Math.PI, 0);
        g.fill();
      }, 2);
    }
    if (land === 'india') {
      // a palm by the water, now and then
      g.strokeStyle = L.rgba(L.mixc(C.near, '#3a2618', 0.6));
      L.along(land, 40, D, 98, (x, j) => {
        if (h(j, 99) < 0.6) return;
        const t = 9 + 3 * h(j, 100);
        g.lineWidth = 0.22;
        g.beginPath();
        g.moveTo(x, 0);
        g.quadraticCurveTo(x + 0.8, -t * 0.5, x + 1.2, -t);
        g.stroke();
        g.lineWidth = 0.12;
        g.beginPath();
        for (let k = 0; k < 8; k++) {
          const a = -Math.PI / 2 + ((k - 3.5) / 3.5) * 1.5;
          g.moveTo(x + 1.2, -t);
          g.quadraticCurveTo(x + 1.2 + Math.cos(a) * 2, -t + Math.sin(a) * 1.4, x + 1.2 + Math.cos(a) * 3.4, -t + Math.sin(a) * 1.6 + 1.2);
        }
        g.stroke();
      }, 5);
    }
  }
  // the telegraph line: a pole every fifty metres, three wires sagging between them
  const top = 5.6, pole = L.rgba(L.mixc(C.near, '#000000', 0.25)), first = Math.floor(-R / span), last = Math.ceil(R / span);
  g.fillStyle = pole;
  for (let i = first; i <= last; i++) {
    const x = X + i * span;
    g.fillRect(x - 0.11, -top, 0.22, top);
    g.fillRect(x - 0.8, -top + 0.35, 1.6, 0.1);
  }
  g.strokeStyle = L.rgba(L.mixc(C.near, '#000000', 0.35), 0.9);
  g.lineWidth = 0.03;
  for (let i = first; i < last; i++) {
    const x = X + i * span, x2 = x + span;
    g.beginPath();
    for (const dx of [-0.65, 0, 0.65]) {
      g.moveTo(x + dx, -top + 0.3);
      g.quadraticCurveTo((x + x2) / 2 + dx, -top + 0.3 + 1.6, x2 + dx, -top + 0.3);
    }
    g.stroke();
  }
}
