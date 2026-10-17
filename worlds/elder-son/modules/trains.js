// trains — the world's trains, painted side-on in daylight colours (the scene's light makes the night).
// Every painting is in metres, its anchor on the rail head under the middle, y down; +x toward the train's tail.
//   car(g, e, kind, len) — a freight car: 'tank' (a tank car), 'box' (a boxcar), 'gondola' (an open car under snow),
//     'flat' (a flatcar with logs); len — buffer to buffer
//   loco(g, e, len) — the diesel's side; its headlight is the point `#light` at the nose (e.at, e.light)
//   nose(g, e) — the diesel's front face (a card turned to look ahead), its lamp unlit: the glow is loco's
// Box for a car: [-len/2 - 0.4, -4.9, len/2 + 0.4, 0.2].

const SNOW = '#e4eaf2';
const IRON = '#26272a';

function bogie(g, x) {
  g.fillStyle = IRON;
  g.fillRect(x - 1.35, -0.95, 2.7, 0.45);
  for (const dx of [-0.9, 0.9]) {
    g.beginPath();
    g.arc(x + dx, -0.47, 0.47, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = '#3a3b3f';
  g.fillRect(x - 0.25, -0.85, 0.5, 0.5);
}
function frame(g, len) {
  const h = len / 2;
  g.fillStyle = '#2d2c2b';
  g.fillRect(-h + 0.35, -1.32, len - 0.7, 0.3);
  // buffers
  g.fillStyle = IRON;
  for (const x of [-h, h - 0.35]) g.fillRect(x, -1.22, 0.35, 0.16);
  bogie(g, -h + 2.3);
  bogie(g, h - 2.3);
}
// a cap of snow along a top edge, a little ragged
function snowTop(g, x0, x1, y, depth, e) {
  g.fillStyle = SNOW;
  g.beginPath();
  g.moveTo(x0, y + 0.04);
  const n = Math.max(4, Math.round((x1 - x0) / 0.7));
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    g.lineTo(x, y - depth * (0.55 + 0.45 * e.rnd()));
  }
  g.lineTo(x1, y + 0.04);
  g.closePath();
  g.fill();
}

const KINDS = {
  tank(g, e, len) {
    const h = len / 2 - 0.5, top = -4.05, bot = -1.4, r = (bot - top) / 2, cy = (top + bot) / 2;
    g.fillStyle = '#3a3b3e';
    g.beginPath();
    g.moveTo(-h + r * 0.55, top);
    g.lineTo(h - r * 0.55, top);
    g.ellipse(h - r * 0.55, cy, r * 0.55, r, 0, -Math.PI / 2, Math.PI / 2);
    g.lineTo(-h + r * 0.55, bot);
    g.ellipse(-h + r * 0.55, cy, r * 0.55, r, 0, Math.PI / 2, (Math.PI * 3) / 2);
    g.fill();
    // a lighter band of the barrel's top, rivet seams
    g.fillStyle = '#3b3c3f';
    g.fillRect(-h + 0.6, top + 0.15, 2 * h - 1.2, 0.5);
    g.strokeStyle = '#1f2022';
    g.lineWidth = 0.04;
    for (const x of [-h * 0.5, 0, h * 0.5]) {
      g.beginPath();
      g.moveTo(x, top + 0.05);
      g.lineTo(x, bot - 0.05);
      g.stroke();
    }
    // the dome and its ladder
    g.fillStyle = '#3a3b3e';
    g.fillRect(-0.55, top - 0.45, 1.1, 0.5);
    g.strokeStyle = '#4a4b4e';
    g.lineWidth = 0.05;
    for (let y = bot; y > top - 0.3; y -= 0.35) {
      g.beginPath();
      g.moveTo(0.75, y);
      g.lineTo(1.25, y);
      g.stroke();
    }
    snowTop(g, -h + 0.9, h - 0.9, top + 0.02, 0.14, e);
    snowTop(g, -0.5, 0.5, top - 0.43, 0.1, e);
    frame(g, len);
  },
  box(g, e, len) {
    const h = len / 2 - 0.35, top = -4.25, bot = -1.32;
    g.fillStyle = '#6e4436';
    g.fillRect(-h, top, 2 * h, bot - top);
    g.strokeStyle = '#4a2d25';
    g.lineWidth = 0.07;
    for (let x = -h + 0.6; x < h; x += 0.95) {
      g.beginPath();
      g.moveTo(x, top + 0.1);
      g.lineTo(x, bot);
      g.stroke();
    }
    // the sliding door, its frame and rail
    g.fillStyle = '#563529';
    g.fillRect(-1.0, top + 0.25, 2.0, bot - top - 0.3);
    g.strokeStyle = '#3c241d';
    g.lineWidth = 0.06;
    g.strokeRect(-1.0, top + 0.25, 2.0, bot - top - 0.3);
    g.beginPath();
    g.moveTo(-1.0, top + 1.4);
    g.lineTo(1.0, top + 1.4);
    g.moveTo(-1.6, top + 0.2);
    g.lineTo(1.6, top + 0.2);
    g.stroke();
    // a white stencil plate
    g.fillStyle = '#b9b1a3';
    g.fillRect(-h + 1.2, top + 0.7, 1.4, 0.35);
    // the roof's curve and its snow
    g.fillStyle = '#4a3a33';
    g.beginPath();
    g.moveTo(-h, top);
    g.quadraticCurveTo(0, top - 0.42, h, top);
    g.closePath();
    g.fill();
    snowTop(g, -h + 0.2, h - 0.2, top - 0.2, 0.16, e);
    frame(g, len);
  },
  gondola(g, e, len) {
    const h = len / 2 - 0.35, top = -3.35, bot = -1.32;
    g.fillStyle = '#54473e';
    g.fillRect(-h, top, 2 * h, bot - top);
    g.strokeStyle = '#342c27';
    g.lineWidth = 0.08;
    for (let x = -h + 0.45; x < h; x += 1.25) {
      g.beginPath();
      g.moveTo(x, top);
      g.lineTo(x, bot);
      g.stroke();
    }
    // its load heaped under snow
    g.fillStyle = SNOW;
    g.beginPath();
    g.moveTo(-h + 0.1, top + 0.02);
    g.quadraticCurveTo(-h * 0.5, top - 0.9, 0, top - 0.75);
    g.quadraticCurveTo(h * 0.5, top - 0.6, h - 0.1, top + 0.02);
    g.closePath();
    g.fill();
    frame(g, len);
  },
  flat(g, e, len) {
    const h = len / 2 - 0.35, deck = -1.55;
    g.fillStyle = '#3a3330';
    g.fillRect(-h, deck, 2 * h, 0.25);
    // logs, side-on: long bands with darker seams, stakes holding them
    const logs = ['#6b5a48', '#5d4d3e', '#705f4c', '#62513f'];
    for (let i = 0; i < 4; i++) {
      g.fillStyle = logs[i];
      g.fillRect(-h + 0.3, deck - 0.4 * (i + 1), 2 * h - 0.6 - 0.4 * (i % 2), 0.38);
    }
    g.fillStyle = '#2b2725';
    for (const x of [-h + 0.4, -h * 0.33, h * 0.33, h - 0.55]) g.fillRect(x, deck - 1.95, 0.14, 1.95);
    snowTop(g, -h + 0.3, h - 0.6, deck - 1.6, 0.14, e);
    frame(g, len);
  },
};

function car(g, e, kind, len) {
  (KINDS[kind] || KINDS.box)(g, e, len);
}

// the diesel (a 2TE-like section): long hood, the cab at the nose (−x), a dark green body, a pale stripe
function loco(g, e, len) {
  const h = len / 2 - 0.3, top = -4.2, bot = -1.35;
  g.fillStyle = '#2c3a33';
  g.beginPath();
  g.moveTo(-h + 1.1, top);
  g.lineTo(h - 0.2, top);
  g.lineTo(h, top + 0.35);
  g.lineTo(h, bot);
  g.lineTo(-h, bot);
  g.lineTo(-h, top + 1.4);
  g.quadraticCurveTo(-h + 0.1, top + 0.1, -h + 1.1, top);
  g.fill();
  // the stripe
  g.fillStyle = '#9a8f6a';
  g.fillRect(-h, -2.25, 2 * h, 0.16);
  // the cab's windows (dark glass), the side door
  g.fillStyle = '#121518';
  g.fillRect(-h + 0.6, top + 0.55, 1.25, 0.9);
  g.fillRect(-h + 2.2, top + 0.55, 0.9, 0.9);
  g.strokeStyle = '#1d2621';
  g.lineWidth = 0.06;
  g.strokeRect(-h + 3.4, top + 0.45, 0.85, 2.3);
  // the hood's louvres
  g.strokeStyle = '#24302a';
  g.lineWidth = 0.05;
  for (let x = -h + 5; x < h - 1; x += 0.32) {
    g.beginPath();
    g.moveTo(x, top + 0.5);
    g.lineTo(x, top + 1.2);
    g.stroke();
  }
  snowTop(g, -h + 1.2, h - 0.4, top + 0.02, 0.1, e);
  // its frame and three-axle bogies
  g.fillStyle = '#232625';
  g.fillRect(-h, bot, 2 * h, 0.3);
  for (const x of [-h + 3.4, h - 3.4]) {
    g.fillStyle = IRON;
    g.fillRect(x - 2.0, -1.0, 4.0, 0.5);
    for (const dx of [-1.4, 0, 1.4]) {
      g.beginPath();
      g.arc(x + dx, -0.53, 0.53, 0, Math.PI * 2);
      g.fill();
    }
  }
  // the headlight at the nose, high: the train's point for the game, and a glow and a light of its own
  g.fillStyle = '#d8d4c4';
  g.beginPath();
  g.arc(-h + 0.05, top + 0.25, 0.16, 0, Math.PI * 2);
  g.fill();
  e.at(-h, top + 0.25, 'light');
  e.light(-h, top + 0.25, 2, '#fff1d2', 3.2, 'light');
}

// the front face, 3.2 m wide: the cab's two windows over the nose, the lamp (unlit: loco's glow is there), the plough
function nose(g, e) {
  const w = 1.6, top = -4.2;
  g.fillStyle = '#2c3a33';
  g.beginPath();
  g.moveTo(-w, -1.35);
  g.lineTo(-w, top + 1.0);
  g.quadraticCurveTo(-w, top, -w + 0.9, top);
  g.lineTo(w - 0.9, top);
  g.quadraticCurveTo(w, top, w, top + 1.0);
  g.lineTo(w, -1.35);
  g.fill();
  g.fillStyle = '#121518';
  g.fillRect(-1.3, top + 0.55, 1.15, 0.85);
  g.fillRect(0.15, top + 0.55, 1.15, 0.85);
  g.fillStyle = '#9a8f6a';
  g.fillRect(-w, -2.25, 2 * w, 0.16);
  g.fillStyle = '#d8d4c4';
  g.beginPath();
  g.arc(0, top + 0.25, 0.18, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#5a1f1a';
  for (const x of [-1.15, 1.15]) {
    g.beginPath();
    g.arc(x, -1.75, 0.1, 0, Math.PI * 2);
    g.fill();
  }
  // the plough, snow caught on it
  g.fillStyle = IRON;
  g.beginPath();
  g.moveTo(-w, -1.35);
  g.lineTo(w, -1.35);
  g.lineTo(w * 0.8, -0.15);
  g.lineTo(-w * 0.8, -0.15);
  g.fill();
  g.fillStyle = SNOW;
  g.fillRect(-w * 0.8, -0.35, w * 1.6, 0.2);
  snowTop(g, -w + 0.6, w - 0.6, top + 0.02, 0.1, e);
}

return { car, loco, nose, KINDS: Object.keys(KINDS) };
