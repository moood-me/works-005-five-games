// The land a hundred and twenty metres off: poplars, hedges and haystacks (Europe); dry grass standing out of the snow and
// fence posts (the prairie); single pines under snow (the snow); hedges, bare December trees and brick houses, a lit
// window in each (England: the layer `lights`, added as light as the night has them lit). India has the river here.
const L = e.lib, D = 120, h = e.anim.hash;
const lit = [];

{
  const land = 'europe', C = L.colours(land);
  g.fillStyle = L.rgba(C.mid);
  L.along(land, 32, D, 51, (x, j) => {
    const k = h(j, 52);
    if (k < 0.35) {
      // a poplar: tall and slender
      const t = 16 + 8 * h(j, 53);
      g.fillRect(x - 0.2, -t * 0.2, 0.4, t * 0.2);
      g.beginPath();
      g.moveTo(x, -t);
      g.bezierCurveTo(x + 2.2, -t * 0.7, x + 2, -t * 0.25, x, -t * 0.12);
      g.bezierCurveTo(x - 2, -t * 0.25, x - 2.2, -t * 0.7, x, -t);
      g.fill();
    } else if (k < 0.6) {
      // a hedge
      g.beginPath();
      g.ellipse(x, 0, (14 + 16 * h(j, 54)) / 2, 2.2, 0, Math.PI, 0);
      g.fill();
    } else if (k < 0.72) {
      // a haystack
      g.beginPath();
      g.ellipse(x, 0, 2.6, 3.4, 0, Math.PI, 0);
      g.fill();
    }
  }, 16);
}

{
  const land = 'prairie', C = L.colours(land);
  g.fillStyle = L.rgba(C.mid);
  L.along(land, 1.6, D, 61, (x, j) => {
    const t = 0.4 + 0.7 * h(j, 62);
    g.fillRect(x - 0.05, -t, 0.1, t);
  });
  g.fillStyle = L.rgba(L.mixc(C.mid, '#2a2018', 0.5));
  L.along(land, 8, D, 63, (x, j) => {
    if (h(j, 64) < 0.3) return;
    g.fillRect(x - 0.1, -1.3, 0.2, 1.3);
  });
}

{
  const land = 'snow', C = L.colours(land), snow = L.rgba(C.groundNear), dark = L.rgba(C.mid);
  L.along(land, 25, D, 71, (x, j) => {
    if (h(j, 72) < 0.4) return;
    const t = 8 + 7 * h(j, 73);
    g.fillStyle = dark;
    g.beginPath();
    g.moveTo(x - t * 0.3, 0);
    g.lineTo(x, -t);
    g.lineTo(x + t * 0.3, 0);
    g.closePath();
    g.fill();
    // snow along its branches
    g.fillStyle = snow;
    for (let k = 1; k < 4; k++) {
      const y = -t * (k / 4), w = t * 0.3 * (1 - k / 4);
      g.fillRect(x - w * 0.8, y, w * 1.6, 0.25);
    }
  }, 6);
}

{
  const land = 'england', C = L.colours(land), fill = L.rgba(C.mid);
  g.strokeStyle = fill;
  g.lineCap = 'round';
  g.lineWidth = 0.45;
  L.along(land, 25, D, 81, (x, j) => {
    const k = h(j, 82);
    g.fillStyle = fill;
    if (k < 0.3) {
      // a bare tree: a trunk and a few forked branches
      const t = 9 + 5 * h(j, 83);
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, -t * 0.5);
      for (let b = 0; b < 5; b++) {
        const a = -Math.PI / 2 + (b - 2) * 0.38;
        g.moveTo(x, -t * (0.4 + 0.08 * b));
        g.lineTo(x + Math.cos(a) * t * 0.5, -t * (0.4 + 0.08 * b) + Math.sin(a) * t * 0.5);
      }
      g.stroke();
    } else if (k < 0.55) {
      g.beginPath();
      g.ellipse(x, 0, (12 + 10 * h(j, 84)) / 2, 1.8, 0, Math.PI, 0);
      g.fill();
    } else if (k < 0.7) {
      // a brick house, its window
      g.fillRect(x - 5, -7, 10, 7);
      g.beginPath();
      g.moveTo(x - 5.5, -7);
      g.lineTo(x, -10);
      g.lineTo(x + 5.5, -7);
      g.closePath();
      g.fill();
      lit.push([x - 2.1, -3.9, C.lights]);
    }
  }, 12);
}

// the lit windows
e.layer('lights', {}, g => {
  for (const [x, y, col] of lit) {
    g.fillStyle = L.rgba(col);
    g.fillRect(x - 0.5, y - 0.7, 1, 1.4);
    e.light(x, y, 2.4, L.css(col), 0.4);
  }
});
