// Fogg's watch, close (insert `watch_close`): seen from above his lap, down along his right forearm — the open pocket
// watch lying in his palm, its dial to us, in the table lamp's light from the upper right. In this world's manner:
// flat shapes, flat colours, each with one lit or one shaded facet. Painted once, in stage heights (lib.js CLOSE: where
// the hand lies, how it is turned, how big a centimetre is); the hand and all on it is the layer `hand`, the seconds'
// hand the layer `second`, the lamp's light over it all the layer `light` — its animate moves them (the carriage's
// sway, the breath, the seconds ticking). Point: watch_close#dial (the dial's middle).
const L = e.lib, C = L.CLOSE, A = e.aspect, W = C.watch, R = C.R, TAU = Math.PI * 2;
// (everything that moves is painted past the frame's edges, so its sway shows no edge)
const BOX = [-0.4, -0.3, A + 0.4, 1.35];
// the hand's own frame: centimetres, its middle the palm's, the fingers toward −y
const inHand = (g, paint) => {
  g.save();
  g.translate(A / 2 + C.at[0], C.at[1]);
  g.rotate(C.turn);
  g.scale(C.cm, C.cm);
  paint(g);
  g.restore();
};
const poly = (g, pts, fill) => {
  g.fillStyle = fill;
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.fill();
};
// a shape through points, its corners rounded by r
const round = (g, pts, r, fill) => {
  const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  g.fillStyle = fill;
  g.beginPath();
  g.moveTo(...mid(pts[n - 1], pts[0]));
  for (let i = 0; i < n; i++) g.arcTo(...pts[i], ...mid(pts[i], pts[(i + 1) % n]), r);
  g.closePath();
  g.fill();
};
const disc = (g, x, y, r, fill, ry = r, turn = 0) => {
  g.fillStyle = fill;
  g.beginPath();
  g.ellipse(x, y, r, ry, turn, 0, TAU);
  g.fill();
};
// a finger, a thumb: a rounded bar from a to b, w thick
const bar = (g, a, b, w, colour) => {
  g.strokeStyle = colour;
  g.lineWidth = w;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(...a);
  g.lineTo(...b);
  g.stroke();
};

// ── his lap under the hand: the carpet past his knees, the red velvet seat, his thighs, the skirts of his coat ──
const SEAT = '#6a2a30', TROUSERS = '#2a2b30', COAT = '#1d1f24';
g.fillStyle = '#1c1214';
g.fillRect(BOX[0], BOX[1], BOX[2] - BOX[0], BOX[3] - BOX[1]);
g.fillStyle = SEAT;
g.fillRect(BOX[0], 0.25, BOX[2] - BOX[0], BOX[3] - 0.25);
g.fillStyle = '#7d353a';
g.fillRect(BOX[0], 0.25, BOX[2] - BOX[0], 0.035);
// (the seat's pleats, running back from its edge)
g.fillStyle = 'rgba(0,0,0,0.16)';
for (let x = -0.3; x < A + 0.4; x += 0.27) g.fillRect(x, 0.285, 0.012, BOX[3]);
const m = A / 2;
for (const side of [-1, 1]) {
  // a thigh from the hip (below the frame) to the knee, its lamp side lighter
  const x = m + side * 0.31;
  round(g, [[x - 0.2, 1.4], [x - 0.17, 0.05], [x + 0.17, 0.05], [x + 0.2, 1.4]], 0.09, TROUSERS);
  round(g, [[x + 0.07, 1.4], [x + 0.08, 0.08], [x + 0.155, 0.08], [x + 0.185, 1.4]], 0.04, '#383940');
  // the coat's skirt fallen back off it
  poly(g, [[x + side * 0.12, 1.4], [x + side * 0.2, 0.74], [x + side * 0.36, 0.66], [x + side * 0.52, 1.4]], COAT);
}
poly(g, [[m + 0.57, 1.4], [m + 0.61, 0.69], [m + 0.67, 0.66], [m + 0.75, 1.4]], '#2b2c33');

// ── the hand, the cuff, the sleeve, and the watch in the palm ──
const SKIN = '#d8b496', SKIN_LIT = '#e9caa9', SKIN_SHADE = '#b78f73', SILVER = '#c7c4ba', SILVER_SHADE = '#97958c';
const INK = '#17181d', STEEL = '#1c2438';
// [where it leaves the palm, its length, its thickness, how it leans] — little, ring, middle, index
const FINGERS = [[-3.3, 5.3, 1.6, -0.12], [-1.15, 6.9, 1.85, -0.04], [1.02, 7.5, 1.95, 0.02], [3.2, 6.8, 1.9, 0.1]];
const tip = ([x, len, w, lean], at = 1) => [x + Math.sin(lean) * (len - w / 2) * at, -3.7 - Math.cos(lean) * (len - w / 2) * at];
const PALM = [[-3.5, 5.2], [-4.5, 0.6], [-4.35, -4.6], [4.35, -4.6], [4.9, 1.2], [3.5, 5.2]];
const SLEEVE = [[-4.8, 6.9], [4.8, 6.9], [6.6, 42], [-6.6, 42]];
const THUMB = [[3.7, 1.9], [7.3, -2.9]];
e.layer('hand', { pivot: L.closeAt(W), box: BOX }, g => inHand(g, g => {
  // its shadow on his lap, away from the lamp
  g.save();
  g.translate(-1.3, 1.0);
  const dark = 'rgba(8,6,10,0.34)';
  poly(g, SLEEVE, dark);
  round(g, PALM, 1.6, dark);
  for (const f of FINGERS) bar(g, [f[0], -3.7], tip(f), f[2], dark);
  bar(g, ...THUMB, 2.3, dark);
  g.restore();
  // the sleeve of the frock coat, its two buttons; the shirt's cuff
  poly(g, SLEEVE, COAT);
  poly(g, [[2.4, 6.9], [4.8, 6.9], [6.6, 42], [3.6, 42]], '#2b2c33');
  for (const y of [9.6, 11.6]) disc(g, -3.7, y, 0.42, '#0e0f12');
  round(g, [[-4.1, 4.5], [4.1, 4.5], [4.3, 7.5], [-4.3, 7.5]], 0.5, '#e6e1d6');
  round(g, [[-4.1, 4.5], [-1.9, 4.5], [-2.0, 7.5], [-4.3, 7.5]], 0.5, '#c9c2b3');
  disc(g, 3.3, 6.1, 0.3, '#b8944c');
  // the fingers, each with its lamp side and its two creases
  for (const f of FINGERS) {
    const [x, , w, lean] = f, end = tip(f), ox = Math.cos(lean) * w * 0.26, oy = Math.sin(lean) * w * 0.26;
    bar(g, [x, -3.7], end, w, SKIN);
    bar(g, [x + ox, -3.4 + oy], [end[0] + ox, end[1] + oy], w * 0.34, SKIN_LIT);
    for (const at of [0.36, 0.68]) {
      g.save();
      g.translate(...tip(f, at));
      g.rotate(lean);
      g.fillStyle = 'rgba(120,78,56,0.3)';
      g.fillRect(-w * 0.4, -0.06, w * 0.8, 0.12);
      g.restore();
    }
  }
  // the palm: its heel and the ball of the thumb in the light, its far side shaded
  round(g, PALM, 1.6, SKIN);
  round(g, [[-3.5, 5.2], [-4.5, 0.6], [-4.35, -4.6], [-2.5, -4.6], [-1.9, 5.2]], 1.2, SKIN_SHADE);
  disc(g, 2.9, 2.3, 1.9, SKIN_LIT, 3.0, -0.3);
  bar(g, ...THUMB, 2.3, SKIN);
  bar(g, [4.5, 1.7], [7.6, -2.5], 0.8, SKIN_LIT);
  // the lines of the palm, where the watch leaves them seen
  g.strokeStyle = 'rgba(120,78,56,0.35)';
  g.lineWidth = 0.1;
  g.beginPath();
  g.moveTo(-4.0, -2.6);
  g.quadraticCurveTo(-1, -3.9, 3.6, -3.5);
  g.moveTo(0.8, 5.0);
  g.quadraticCurveTo(0.2, 3.2, 1.6, 2.2);
  g.stroke();

  // ── the watch ──
  g.save();
  g.translate(...W);
  // its shadow in the palm
  disc(g, -0.75, 0.6, R + 0.25, 'rgba(96,58,40,0.5)');
  // the lid standing open at nine, seen from above: its rim and its polished inside
  disc(g, -R - 0.5, 0, 0.62, SILVER_SHADE, R * 0.98);
  disc(g, -R - 0.42, 0, 0.4, '#dedbd2', R * 0.86);
  g.fillStyle = SILVER_SHADE;
  g.fillRect(-R - 0.2, -0.5, 0.5, 1.0);
  // the stem and the bow at twelve
  g.fillStyle = SILVER;
  g.fillRect(-0.24, -R - 0.55, 0.48, 0.7);
  g.fillStyle = SILVER_SHADE;
  g.fillRect(-0.34, -R - 0.75, 0.68, 0.26);
  g.strokeStyle = SILVER;
  g.lineWidth = 0.2;
  g.beginPath();
  g.arc(0, -R - 1.25, 0.52, 0, TAU);
  g.stroke();
  // the case: its rim darker away from the lamp, lighter toward it
  disc(g, 0, 0, R, SILVER_SHADE);
  disc(g, 0.09, -0.09, R - 0.11, '#dad7cd');
  disc(g, 0, 0, R - 0.3, SILVER);
  // the dial
  const D = R - 0.42;
  disc(g, 0, 0, D, '#f4efe2');
  // (the minutes' track: two hair rings, sixty marks, each fifth heavier)
  g.strokeStyle = 'rgba(23,24,29,0.55)';
  g.lineWidth = 0.025;
  for (const r of [D - 0.08, D - 0.24]) {
    g.beginPath();
    g.arc(0, 0, r, 0, TAU);
    g.stroke();
  }
  g.fillStyle = INK;
  for (let i = 0; i < 60; i++) {
    g.save();
    g.rotate((i * TAU) / 60);
    if (i % 5) g.fillRect(-0.012, -D + 0.1, 0.024, 0.12);
    else g.fillRect(-0.03, -D + 0.08, 0.06, 0.16);
    g.restore();
  }
  // (the hours in Roman figures, their heads outward; six gives its place to the seconds' dial)
  const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', '', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const GLYPH = { I: 0.11, V: 0.25, X: 0.25 }, H = 0.36, T = 0.05, GAP = 0.035;
  // (a figure's stroke: from x0 at its head to x1 at its foot)
  const stroke = (x0, x1) => poly(g, [[x0 - T / 2, -H], [x0 + T / 2, -H], [x1 + T / 2, 0], [x1 - T / 2, 0]], INK);
  ROMAN.forEach((text, i) => {
    const wide = [...text].reduce((s, ch) => s + GLYPH[ch], 0) + GAP * (text.length - 1);
    g.save();
    g.rotate((i * TAU) / 12);
    g.translate(-wide / 2, -D + 0.32 + H);
    let x = 0;
    for (const ch of text) {
      const w = GLYPH[ch];
      if (ch === 'I') stroke(x + w / 2, x + w / 2);
      if (ch === 'V') {
        stroke(x + T / 2, x + w / 2);
        stroke(x + w - T / 2, x + w / 2);
      }
      if (ch === 'X') {
        stroke(x + T / 2, x + w - T / 2);
        stroke(x + w - T / 2, x + T / 2);
      }
      x += w + GAP;
    }
    g.restore();
  });
  // (the seconds' dial at six)
  disc(g, ...C.seconds, 0.5, '#e9e2cf');
  g.strokeStyle = 'rgba(23,24,29,0.5)';
  g.lineWidth = 0.025;
  g.beginPath();
  g.arc(...C.seconds, 0.5, 0, TAU);
  g.stroke();
  g.fillStyle = INK;
  for (let i = 0; i < 12; i++) {
    g.save();
    g.translate(...C.seconds);
    g.rotate((i * TAU) / 12);
    g.fillRect(-0.012, -0.47, 0.024, i % 3 ? 0.07 : 0.12);
    g.restore();
  }
  // (the hands, of blued steel: seventeen minutes past eight)
  const hand = (turn, len, w) => {
    g.save();
    g.rotate(turn);
    poly(g, [[-w * 0.45, 0.3], [-w, -len * 0.62], [0, -len], [w, -len * 0.62], [w * 0.45, 0.3]], STEEL);
    g.restore();
  };
  hand(((8 + 17 / 60) * TAU) / 12, 1.12, 0.11);
  hand((17 * TAU) / 60, 1.7, 0.075);
  disc(g, 0, 0, 0.11, STEEL);
  disc(g, 0, 0, 0.04, '#c9b06a');
  // (the lamp in the crystal: a pale crescent on its side)
  g.fillStyle = 'rgba(255,250,236,0.3)';
  g.beginPath();
  g.arc(0, 0, D - 0.3, -1.25, -0.25);
  g.arc(0.22, -0.2, D - 0.42, -0.25, -1.25, true);
  g.closePath();
  g.fill();
  g.restore();

  // the chain from the bow over the finger and down past the thumb to his waistcoat: its links one light, one dark
  const P = [[W[0] + 0.35, W[1] - R - 1.7], [5.2, -8.4], [10.6, -1.5], [9.2, 9], [11.5, 42]];
  const bez = (a, b, c, d, u) => a * (1 - u) ** 3 + 3 * b * (1 - u) ** 2 * u + 3 * c * (1 - u) * u * u + d * u ** 3;
  for (let k = 0; k <= 84; k++) {
    const u = k / 84;
    disc(g, bez(P[0][0], P[1][0], P[2][0], P[3][0], u), bez(P[0][1], P[1][1], P[2][1], P[3][1], u), 0.17, k % 2 ? SILVER : SILVER_SHADE);
  }
  for (let k = 1; k <= 110; k++) {
    const u = k / 110;
    disc(g, P[3][0] + (P[4][0] - P[3][0]) * u, P[3][1] + (P[4][1] - P[3][1]) * u, 0.17, k % 2 ? SILVER_SHADE : SILVER);
  }
}));
e.at(...L.closeAt(W), 'dial');

// the seconds' hand, painted at sixty: its animate ticks it round
e.layer('second', { pivot: L.closeAt([W[0] + C.seconds[0], W[1] + C.seconds[1]]), box: BOX }, g => inHand(g, g => {
  g.translate(W[0] + C.seconds[0], W[1] + C.seconds[1]);
  poly(g, [[-0.03, 0.14], [-0.022, -0.42], [0.022, -0.42], [0.03, 0.14]], STEEL);
  disc(g, 0, 0, 0.055, STEEL);
}));

// the lamp's light over it all: warm and full toward the lamp, dimmer and cooler away from it (it trembles a little)
e.layer('light', { blend: 'multiply', flicker: 0.06, box: BOX }, g => {
  const far = Math.hypot(BOX[2] - BOX[0], BOX[3] - BOX[1]), gr = g.createRadialGradient(A / 2 + 0.55, 0.05, 0.1, A / 2 + 0.55, 0.05, far * 0.8);
  gr.addColorStop(0, '#fff3dc');
  gr.addColorStop(0.35, '#f1dcc0');
  gr.addColorStop(0.7, '#b8a39c');
  gr.addColorStop(1, '#85747a');
  g.fillStyle = gr;
  g.fillRect(BOX[0], BOX[1], BOX[2] - BOX[0], BOX[3] - BOX[1]);
});
