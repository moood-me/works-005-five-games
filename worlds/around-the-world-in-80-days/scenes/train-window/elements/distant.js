// The land four hundred metres off: villages with their spires and their windows (Europe), dark pine forest (the snow),
// London itself — terraces, chimneys, spires, a dome, gas lamps in the street (England). Painted in daylight; the windows
// and the lamps are a layer (`lights`) its shader adds as light, as much as they are lit at the night (its animate),
// each with its glow.
const L = e.lib, D = 400, h = e.anim.hash;
// the lit windows and lamps: where each is, painted last in their own layer
const lit = [];
const house = (x, w, hh, roof) => {
  g.beginPath();
  g.moveTo(x - w / 2, 0);
  g.lineTo(x - w / 2, -hh);
  g.lineTo(x, -hh - roof);
  g.lineTo(x + w / 2, -hh);
  g.lineTo(x + w / 2, 0);
  g.closePath();
  g.fill();
};

{
  const land = 'europe', C = L.colours(land), fill = L.rgba(C.distant);
  g.fillStyle = fill;
  // tree lines along the fields
  L.along(land, 100, D, 11, (x, j) => {
    const r = 6 + 6 * h(j, 12);
    g.beginPath();
    g.ellipse(x, -r * 0.8, r * 1.6, r, 0, 0, Math.PI * 2);
    g.fill();
  }, 20);
  // a lone farm, its window
  L.along(land, 50, D, 24, (x, j) => {
    if (h(j, 25) < 0.5) return;
    house(x, 8, 5, 4);
    lit.push([x + 1.5, -2.5, 0.8, 1, C.lights, 14]);
  }, 10);
  // a village now and then, and its church: a nave and a slender spire
  L.along(land, 400, D, 13, (x, j) => {
    if (h(j, 14) < 0.2) return;
    const houses = 4 + Math.floor(5 * h(j, 15));
    for (let k = 0; k < houses; k++) {
      const hx = x + (k - houses / 2) * 11 + 4 * h(j * 31 + k, 16), hh = 6 + 4 * h(j * 31 + k, 17);
      house(hx, 9, hh, 5);
      if (h(j * 31 + k, 18) < 0.55) lit.push([hx + 1.5, -hh * 0.45, 0.8, 1, C.lights, 14]);
    }
    if (h(j, 19) < 0.6) {
      const cx = x + 30;
      house(cx, 16, 10, 6);
      g.beginPath();
      g.moveTo(cx - 3, -10);
      g.lineTo(cx - 3, -20);
      g.lineTo(cx, -36);
      g.lineTo(cx + 3, -20);
      g.lineTo(cx + 3, -10);
      g.closePath();
      g.fill();
    }
  }, 80);
}

{
  // the snow: the forest — a dark serrated band, its edge rising and falling
  const land = 'snow', C = L.colours(land), X = L.centre(land);
  g.fillStyle = L.rgba(C.distant);
  L.along(land, 8, D, 21, (x, j) => {
    if (L.pnoise(x - X, 400, 22) < -0.2) return;
    const t = 10 + 12 * h(j, 23);
    g.beginPath();
    g.moveTo(x - t * 0.28, 0);
    g.lineTo(x, -t);
    g.lineTo(x + t * 0.28, 0);
    g.closePath();
    g.fill();
  }, 8);
}

{
  // London: terraces and chimneys, spires, a dome; windows lit, gas lamps in the street before them
  const land = 'england', C = L.colours(land);
  g.fillStyle = L.rgba(C.distant);
  L.along(land, 40, D, 31, (x, j) => {
    const hh = 12 + 10 * h(j, 32), w = 30 + 14 * h(j, 33);
    g.fillRect(x - w / 2, -hh, w, hh);
    for (let k = 0; k < 4; k++) g.fillRect(x - w / 2 + 3 + k * (w / 4), -hh - 3, 1.6, 3);
    for (let k = 0; k < 3; k++) if (h(j * 7 + k, 34) < 0.7) lit.push([x - w / 3 + k * (w / 3), -hh * 0.5, 0.8, 1, C.lights, 14]);
    if (h(j, 38) < 0.6) {
      // the lamp's post, its globe in the lit layer, its glow wide in the fog
      g.fillRect(x - 0.08, -4.5, 0.16, 4.5);
      lit.push([x, -4.5, 1, 1, C.lights, 22]);
    }
  }, 30);
  L.along(land, 500, D, 35, (x, j) => {
    if (h(j, 36) < 0.5) {
      // a spire
      g.beginPath();
      g.moveTo(x - 4, 0);
      g.lineTo(x - 4, -40);
      g.lineTo(x, -70);
      g.lineTo(x + 4, -40);
      g.lineTo(x + 4, 0);
      g.closePath();
      g.fill();
    } else if (h(j, 37) < 0.4) {
      // a dome on its drum
      g.fillRect(x - 16, -48, 32, 48);
      g.beginPath();
      g.arc(x, -48, 16, Math.PI, 0);
      g.fill();
      g.fillRect(x - 1.5, -72, 3, 10);
    }
  }, 20);
}

// the lit windows and lamps
e.layer('lights', {}, g => {
  for (const [x, y, w, hh, col, r] of lit) {
    g.fillStyle = L.rgba(col);
    g.fillRect(x - w / 2, y - hh / 2, w, hh);
    e.light(x, y, r, L.css(col), 0.9);
  }
});
