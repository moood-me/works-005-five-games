// A Shop in Liss — what the shop's elements share (the street's sky, the wares on the shelves, the rack and the counter, the
// street's facades, the rolls of silk and where they are, the insert of the scarlet scrap) and its film in beats
// (film(scene), at the end: the world's module beats — notes.md lists them).
const N = kit.sky;
const num = (v) => +v || 0;
const clamp01 = (v) => anim.clamp(num(v), 0, 1);

// ── the sky: one picture seen through the window and the door; the sun stands high on the left, beyond the window's
// wall (its light comes in through the window and the door — scene.json lights) ──
const HORIZON = 0.42;
const SKY = {
  horizon: HORIZON,
  sun: (u, height, state, out) => {
    out[0] = -0.25;
    out[1] = -0.3;
  },
  moon: null,
  clouds: [[0.45, 0.11, 0.7, 0.016], [1.3, 0.16, 0.55, 0.012]],
};

// ── plain shapes ──
function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
function oval(g, x, y, rx, ry) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, 7);
}

// ── the wares. Toys (goods `toys`) and bolts of cloth (goods `silk`): muted, pale colours, no red anywhere — the only
// scarlet in the shop is the roll and the scrap ──
const TOY_COLOURS = ["#7fa3b8", "#e0bf6c", "#8fb08c", "#d9b08a", "#b9a8d0", "#efe9dc", "#9cc0bc"];
const CLOTH_COLOURS = ["#6f8fb5", "#8cae8a", "#d9b86a", "#efe6d2", "#9a86b8", "#a9b3bd", "#7fb0ae", "#c9b08f"];
const WOOD_LIGHT = "#d0a874";
// a toy standing on a board: x its middle, y the board's top, s its height
function toy(g, kind, x, y, s, c, c2) {
  g.fillStyle = c;
  if (kind === "box") {
    rr(g, x - s * 0.45, y - s * 0.8, s * 0.9, s * 0.8, 0.01);
    g.fill();
    g.fillStyle = c2;
    g.fillRect(x - s * 0.06, y - s * 0.8, s * 0.12, s * 0.8);
    g.fillRect(x - s * 0.45, y - s * 0.5, s * 0.9, s * 0.1);
  } else if (kind === "doll") {
    g.beginPath();
    g.moveTo(x - s * 0.22, y);
    g.lineTo(x + s * 0.22, y);
    g.lineTo(x + s * 0.09, y - s * 0.62);
    g.lineTo(x - s * 0.09, y - s * 0.62);
    g.closePath();
    g.fill();
    g.fillStyle = "#e5c4a6";
    oval(g, x, y - s * 0.76, s * 0.13, s * 0.14);
    g.fill();
    g.fillStyle = c2;
    g.beginPath();
    g.ellipse(x, y - s * 0.82, s * 0.14, s * 0.1, 0, Math.PI, 0);
    g.fill();
  } else if (kind === "horse") {
    g.strokeStyle = c2;
    g.lineWidth = 0.014;
    g.beginPath();
    g.ellipse(x, y - s * 0.12, s * 0.45, s * 0.14, 0, 0, Math.PI);
    g.stroke();
    oval(g, x, y - s * 0.46, s * 0.3, s * 0.17);
    g.fill();
    g.fillRect(x - s * 0.2, y - s * 0.4, s * 0.05, s * 0.28);
    g.fillRect(x + s * 0.15, y - s * 0.4, s * 0.05, s * 0.28);
    g.beginPath();
    g.moveTo(x + s * 0.2, y - s * 0.55);
    g.lineTo(x + s * 0.4, y - s * 0.85);
    g.lineTo(x + s * 0.5, y - s * 0.72);
    g.lineTo(x + s * 0.3, y - s * 0.45);
    g.closePath();
    g.fill();
  } else if (kind === "boat") {
    g.beginPath();
    g.moveTo(x - s * 0.5, y - s * 0.3);
    g.lineTo(x + s * 0.5, y - s * 0.3);
    g.quadraticCurveTo(x + s * 0.3, y, x - s * 0.3, y);
    g.closePath();
    g.fill();
    g.fillStyle = c2;
    g.fillRect(x - s * 0.01, y - s * 0.95, s * 0.02, s * 0.65);
    g.beginPath();
    g.moveTo(x + s * 0.03, y - s * 0.92);
    g.lineTo(x + s * 0.03, y - s * 0.34);
    g.lineTo(x + s * 0.4, y - s * 0.34);
    g.closePath();
    g.fill();
  } else if (kind === "top") {
    g.beginPath();
    g.moveTo(x - s * 0.3, y - s * 0.55);
    g.lineTo(x + s * 0.3, y - s * 0.55);
    g.lineTo(x, y);
    g.closePath();
    g.fill();
    g.fillStyle = c2;
    g.fillRect(x - s * 0.34, y - s * 0.62, s * 0.68, s * 0.1);
    g.fillRect(x - s * 0.03, y - s * 0.85, s * 0.06, s * 0.25);
  } else if (kind === "bear") {
    oval(g, x, y - s * 0.28, s * 0.3, s * 0.28);
    g.fill();
    oval(g, x, y - s * 0.7, s * 0.2, s * 0.19);
    g.fill();
    oval(g, x - s * 0.17, y - s * 0.86, s * 0.08, s * 0.08);
    g.fill();
    oval(g, x + s * 0.17, y - s * 0.86, s * 0.08, s * 0.08);
    g.fill();
    g.fillStyle = c2;
    oval(g, x, y - s * 0.66, s * 0.08, s * 0.06);
    g.fill();
  } else {
    // blocks: three squares, one on two
    const b = s * 0.4;
    g.fillRect(x - b, y - b, b, b);
    g.fillStyle = c2;
    g.fillRect(x, y - b, b, b);
    g.fillStyle = c;
    g.fillRect(x - b / 2, y - 2 * b, b, b);
  }
}
const TOY_KINDS = ["box", "doll", "horse", "boat", "top", "bear", "blocks"];
// a bolt of cloth standing on end: its side, its wound top
function bolt(g, x, y, w, h, c) {
  g.fillStyle = c;
  g.fillRect(x - w / 2, y - h, w, h);
  g.fillStyle = N.mix(c, "#ffffff", 0.25);
  g.fillRect(x - w / 2, y - h, w * 0.18, h);
  g.fillStyle = N.mix(c, "#000000", 0.18);
  g.fillRect(x + w * 0.3, y - h, w * 0.2, h);
  g.fillStyle = N.mix(c, "#ffffff", 0.12);
  oval(g, x, y - h, w / 2, w * 0.17);
  g.fill();
  g.fillStyle = N.mix(c, "#000000", 0.3);
  oval(g, x, y - h, w * 0.14, w * 0.05);
  g.fill();
}
// a bolt of cloth lying on its side, its end toward the right
function lying(g, x, y, len, d, c) {
  g.fillStyle = c;
  rr(g, x - len / 2, y - d, len, d, d * 0.3);
  g.fill();
  g.fillStyle = N.mix(c, "#ffffff", 0.22);
  g.fillRect(x - len / 2 + d * 0.3, y - d * 0.9, len - d * 0.6, d * 0.18);
  g.fillStyle = N.mix(c, "#000000", 0.2);
  g.fillRect(x - len / 2 + d * 0.3, y - d * 0.28, len - d * 0.6, d * 0.2);
  g.fillStyle = N.mix(c, "#ffffff", 0.1);
  oval(g, x + len / 2, y - d / 2, d * 0.14, d / 2);
  g.fill();
}

// ── the shelves on the far wall (card x −1.5…1.5, y −2.95…0): boards at SHELF_BOARDS (heights); what stands on them is
// the goods (toys, or cloth) — on the top board they rise past the shelves' top (the card's box has room: to 3.2) ──
const SHELF_BOARDS = [0.45, 0.95, 1.4, 1.85, 2.3, 2.75];
function paintShelves(g, e) {
  const silk = e.state.goods === "silk";
  g.fillStyle = "#cfbd9c";
  g.fillRect(-1.5, -2.95, 3, 2.95);
  g.fillStyle = "#a98458";
  g.fillRect(-1.5, -2.95, 0.05, 2.95);
  g.fillRect(1.45, -2.95, 0.05, 2.95);
  g.fillRect(-0.02, -2.95, 0.04, 2.5);
  g.fillRect(-1.5, -2.95, 3, 0.05);
  g.fillRect(-1.5, -0.45, 3, 0.45);
  SHELF_BOARDS.forEach((h, row) => {
    g.fillStyle = "#a98458";
    g.fillRect(-1.5, -h - 0.04, 3, 0.04);
    g.fillStyle = "#8a6a44";
    g.fillRect(-1.5, -h, 3, 0.012);
    if (row === 0) return;
    let x = -1.4;
    while (x < 1.38) {
      const left = x < 0 ? -0.04 : 1.43;
      if (silk) {
        if (row % 2 === 1) {
          const c = CLOTH_COLOURS[Math.floor(e.rnd() * CLOTH_COLOURS.length)];
          const w = 0.12 + e.rnd() * 0.04;
          if (x + w / 2 < left) bolt(g, x + w / 2, -h - 0.04, w, 0.3 + e.rnd() * 0.08, c);
          x += w + 0.015;
        } else {
          const len = 0.5 + e.rnd() * 0.15;
          if (x + len < left) {
            lying(g, x + len / 2, -h - 0.04, len, 0.13, CLOTH_COLOURS[Math.floor(e.rnd() * CLOTH_COLOURS.length)]);
            lying(g, x + len / 2, -h - 0.17, len * 0.9, 0.12, CLOTH_COLOURS[Math.floor(e.rnd() * CLOTH_COLOURS.length)]);
          }
          x += len + 0.04;
        }
      } else {
        const s = 0.22 + e.rnd() * 0.1;
        const kind = TOY_KINDS[Math.floor(e.rnd() * TOY_KINDS.length)];
        if (x + s * 0.55 < left) {
          toy(g, kind, x + s * 0.5, -h - 0.04, s, TOY_COLOURS[Math.floor(e.rnd() * TOY_COLOURS.length)], TOY_COLOURS[Math.floor(e.rnd() * TOY_COLOURS.length)]);
        }
        x += s + 0.05;
      }
    }
  });
  // the lowest shelf: cupboards
  g.fillStyle = "#b99a6e";
  g.fillRect(-1.45, -0.42, 1.4, 0.38);
  g.fillRect(0.05, -0.42, 1.4, 0.38);
  g.fillStyle = "#8a6a44";
  g.fillRect(-0.77, -0.42, 0.012, 0.38);
  g.fillRect(0.74, -0.42, 0.012, 0.38);
  g.fillStyle = "#e5d3a8";
  g.fillRect(-0.9, -0.26, 0.05, 0.05);
  g.fillRect(0.9, -0.26, 0.05, 0.05);
  e.at(0, -1.75, "shelves");
}

// ── the rack over the counter: hung from the ceiling on two chains (card anchored on the floor, x −0.8…0.8): a board at
// RACK_UP over the counter; goods `silk` — bolts on it (the top row is left to the roll the merchant takes down, which
// is the element `roll`); goods `toys` — wooden birds on strings ──
const RACK_UP = 2.05;
function paintRack(g, e) {
  const silk = e.state.goods === "silk";
  g.strokeStyle = "#8a8f94";
  g.lineWidth = 0.012;
  for (const x of [-0.7, 0.7]) {
    g.beginPath();
    g.moveTo(x, -3);
    g.lineTo(x, -RACK_UP);
    g.stroke();
  }
  g.fillStyle = "#a98458";
  g.fillRect(-0.8, -RACK_UP, 1.6, 0.05);
  g.fillStyle = "#8a6a44";
  g.fillRect(-0.8, -RACK_UP + 0.05, 1.6, 0.012);
  if (silk) {
    lying(g, -0.4, -RACK_UP, 0.7, 0.14, "#6f8fb5");
    lying(g, 0.4, -RACK_UP, 0.7, 0.14, "#8cae8a");
    lying(g, -0.4, -RACK_UP - 0.14, 0.7, 0.13, "#d9b86a");
    lying(g, 0.4, -RACK_UP - 0.14, 0.7, 0.13, "#9a86b8");
  } else {
    [[-0.5, 0.5, TOY_COLOURS[0]], [0, 0.7, TOY_COLOURS[1]], [0.5, 0.45, TOY_COLOURS[2]]].forEach(([x, drop, c]) => {
      g.strokeStyle = "#8a8f94";
      g.lineWidth = 0.006;
      g.beginPath();
      g.moveTo(x, -RACK_UP + 0.05);
      g.lineTo(x, -RACK_UP + 0.05 + drop);
      g.stroke();
      g.fillStyle = c;
      oval(g, x, -RACK_UP + 0.05 + drop + 0.06, 0.07, 0.06);
      g.fill();
      g.fillStyle = N.mix(c, "#000000", 0.2);
      g.beginPath();
      g.moveTo(x - 0.07, -RACK_UP + 0.05 + drop + 0.06);
      g.lineTo(x - 0.17, -RACK_UP + 0.05 + drop + 0.02);
      g.lineTo(x - 0.1, -RACK_UP + 0.05 + drop + 0.1);
      g.closePath();
      g.fill();
    });
  }
}

// ── the counter's top, seen from above (plane 2.2 × 0.6; x across, y toward the eye): boards, a brass measure along its
// front edge, and what lies on it for the goods ──
function paintCounterTop(g, e) {
  const silk = e.state.goods === "silk";
  g.fillStyle = WOOD_LIGHT;
  g.fillRect(-1.1, -0.3, 2.2, 0.6);
  g.fillStyle = "rgba(90,60,30,0.2)";
  for (const y of [-0.15, 0, 0.15]) g.fillRect(-1.1, y, 2.2, 0.006);
  g.fillStyle = "#b99a52";
  g.fillRect(-1.1, 0.23, 2.2, 0.04);
  g.fillStyle = "#6b5a2e";
  for (let x = -1.08; x < 1.1; x += 0.05) g.fillRect(x, 0.23, 0.004, x % 0.25 < 0.05 ? 0.04 : 0.02);
  // a ledger and a pen at the right end
  g.fillStyle = "#6b7f8c";
  g.fillRect(0.68, -0.2, 0.26, 0.18);
  g.fillStyle = "#efe9dc";
  g.fillRect(0.7, -0.19, 0.22, 0.16);
  g.fillStyle = "#3a3633";
  g.fillRect(0.6, -0.1, 0.12, 0.012);
  if (silk) {
    // shears and a reel of thread at the left end
    g.strokeStyle = "#8f979c";
    g.lineWidth = 0.012;
    g.beginPath();
    g.moveTo(-0.95, -0.05);
    g.lineTo(-0.7, 0.07);
    g.moveTo(-0.95, 0.07);
    g.lineTo(-0.7, -0.05);
    g.stroke();
    g.fillStyle = "#9a86b8";
    oval(g, -0.55, 0, 0.04, 0.04);
    g.fill();
  } else {
    // a toy sloop and a top
    toy(g, "boat", -0.85, -0.02, 0.2, TOY_COLOURS[0], TOY_COLOURS[5]);
    toy(g, "top", -0.55, -0.02, 0.14, TOY_COLOURS[3], TOY_COLOURS[1]);
  }
}

// ── the basket Assol brings (card on the counter): wicker, little boats heaped in it ──
function paintBasket(g, e) {
  g.fillStyle = "#9e8158";
  g.beginPath();
  g.moveTo(-0.2, -0.2);
  g.lineTo(0.2, -0.2);
  g.lineTo(0.16, 0);
  g.lineTo(-0.16, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = "#7d6544";
  g.lineWidth = 0.008;
  for (const y of [-0.15, -0.1, -0.05]) {
    g.beginPath();
    g.moveTo(-0.19, y);
    g.lineTo(0.19, y);
    g.stroke();
  }
  g.lineWidth = 0.014;
  g.beginPath();
  g.ellipse(0, -0.2, 0.17, 0.17, 0, Math.PI, 0);
  g.stroke();
  for (const [x, w, c] of [[-0.1, 0.12, "#8fa3b4"], [0.05, 0.1, "#e0bf6c"], [0.11, 0.08, "#8fb08c"]]) {
    g.fillStyle = "#e8e4dc";
    g.fillRect(x - w / 2, -0.24, w, 0.04);
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(x, -0.24);
    g.lineTo(x, -0.36);
    g.lineTo(x - w * 0.4, -0.24);
    g.closePath();
    g.fill();
  }
}

// ── the street: facades of low shops, pale, with slate roofs, striped awnings, shutters (card x −w/2…w/2, y −h…0; the
// last house ends past w/2 — the card's box has room for it) ──
const WALLS = ["#ecdfc2", "#e5d6b6", "#dfe3d2", "#ecdcc9", "#d9e0e3"];
const AWNINGS = ["#8fb08c", "#9cc0bc", "#d9c27a"];
function facade(g, w, h, e) {
  let x = -w / 2;
  let i = 0;
  while (x < w / 2) {
    const bw = 3 + e.rnd() * 1.6;
    const wall = WALLS[i % WALLS.length];
    g.fillStyle = wall;
    g.fillRect(x, -h, bw, h);
    g.fillStyle = "#8c98a4";
    g.beginPath();
    g.moveTo(x - 0.1, -h + 0.05);
    g.lineTo(x + bw + 0.1, -h + 0.05);
    g.lineTo(x + bw, -h - 0.45);
    g.lineTo(x, -h - 0.45);
    g.closePath();
    g.fill();
    g.fillStyle = N.mix(wall, "#000000", 0.1);
    g.fillRect(x, -0.25, bw, 0.25);
    // a shop window with an awning over it, a door beside it
    const awning = AWNINGS[i % AWNINGS.length];
    g.fillStyle = "#f4f2ea";
    g.fillRect(x + 0.4, -2.3, bw * 0.5, 1.6);
    g.fillStyle = "rgba(120,150,170,0.55)";
    g.fillRect(x + 0.5, -2.2, bw * 0.5 - 0.2, 1.4);
    for (let k = 0; k < 6; k++) {
      g.fillStyle = k % 2 ? "#f4f2ea" : awning;
      g.fillRect(x + 0.3 + (k * (bw * 0.5 + 0.2)) / 6, -2.7, (bw * 0.5 + 0.2) / 6, 0.45);
    }
    g.fillStyle = "#a98458";
    g.fillRect(x + bw * 0.62, -2.1, 0.8, 2.1);
    g.fillStyle = "#c9b08f";
    g.fillRect(x + bw * 0.62 + 0.08, -2.02, 0.64, 1.94);
    // a window above
    g.fillStyle = "#f4f2ea";
    g.fillRect(x + bw * 0.3, -h + 0.35, 0.7, 0.55);
    g.fillStyle = "rgba(120,150,170,0.6)";
    g.fillRect(x + bw * 0.3 + 0.06, -h + 0.41, 0.58, 0.43);
    x += bw;
    i++;
  }
}

// ── the rolls of silk. «Scarlet» shows them one after another (ROLL_NAMES — the game's order); the roll is one element,
// a layer pair for each colour: the wound roll (body_<name>) and the cloth hanging from it (cloth_<name>), the one of the
// key `roll` shown. The colours are tones of the one hue, each named for how it differs from the scarlet (notes.md) ──
const ROLLS = {
  cherry: "#8b1d3d",
  pink: "#eaa0ad",
  crimson: "#a8182e",
  brick: "#b8472f",
  scarlet: N.SCARLET,
  raspberry: "#cf2a63",
  carrot: "#e2662a",
};
const ROLL_NAMES = Object.keys(ROLLS);
const ROLL = { length: 0.96, radius: 0.075, sheet: 0.95, drop: 1.3 };
function paintRoll(e) {
  const R = ROLL;
  for (const name of ROLL_NAMES) {
    const c = ROLLS[name];
    e.layer(`body_${name}`, {}, (g) => {
      g.fillStyle = c;
      rr(g, -R.length / 2, -R.radius, R.length, 2 * R.radius, R.radius * 0.5);
      g.fill();
      g.fillStyle = N.mix(c, "#ffffff", 0.22);
      g.fillRect(-R.length / 2 + 0.03, -R.radius * 0.8, R.length - 0.06, R.radius * 0.3);
      g.fillStyle = N.mix(c, "#000000", 0.24);
      g.fillRect(-R.length / 2 + 0.03, R.radius * 0.35, R.length - 0.06, R.radius * 0.5);
      g.fillStyle = N.mix(c, "#ffffff", 0.1);
      oval(g, R.length / 2, 0, R.radius * 0.3, R.radius);
      g.fill();
      g.strokeStyle = N.mix(c, "#000000", 0.3);
      g.lineWidth = 0.004;
      oval(g, R.length / 2, 0, R.radius * 0.2, R.radius * 0.62);
      g.stroke();
    });
    e.layer(`cloth_${name}`, { pivot: [0, R.radius] }, (g) => {
      g.fillStyle = c;
      g.beginPath();
      g.moveTo(-R.sheet / 2, R.radius);
      g.lineTo(R.sheet / 2, R.radius);
      g.lineTo(R.sheet / 2, R.radius + R.drop);
      g.quadraticCurveTo(R.sheet / 4, R.radius + R.drop + 0.04, 0, R.radius + R.drop);
      g.quadraticCurveTo(-R.sheet / 4, R.radius + R.drop - 0.04, -R.sheet / 2, R.radius + R.drop);
      g.closePath();
      g.fill();
      // folds: long soft bands, light and dark
      for (let k = 0; k < 7; k++) {
        const x = -R.sheet / 2 + (k + 0.5) * (R.sheet / 7);
        g.fillStyle = k % 2 ? N.rgba("#ffffff", 0.16) : N.rgba("#000000", 0.12);
        g.fillRect(x - 0.03, R.radius, 0.06, R.drop - 0.02);
      }
      // (its light: high on the cloth, by the hands that hold the roll)
      if (name === "scarlet") e.light(0, R.radius + R.drop * 0.25, 1.1, "#ff4a55", 1, "silk");
    });
  }
}
// where the roll rests while it is on the rack or on the counter: across, distance, height of its middle (metres)
const ROLL_SPOT = { rack: [0.2, 4.82, RACK_UP + 0.21], counter: [0.4, 4.62, 1.03] };
// who has the roll in their hands: whose point it follows, and how far its card stands from them (toward the far wall)
const ROLL_WITH = { merchant: ["merchant", "mer", -0.3], grey: ["grey", "gr", 0.25] };
function rollPlace(S) {
  const spot = ROLL_SPOT[S.roll_at];
  if (spot) return { across: spot[0], distance: spot[1] };
  const [, key, off] = ROLL_WITH[S.roll_at];
  return { across: num(S[`${key}_a`]), distance: num(S[`${key}_d`]) + off };
}
// the roll each frame: the one colour of `roll` shown, the cloth let out toward the window by `roll_out`, the roll in the
// hands that have it (their point, in this card's own painting) or at its rest; its press point on the cloth
function rollMotion(e) {
  const S = e.state, R = ROLL;
  const out = clamp01(S.roll_out);
  const spot = ROLL_SPOT[S.roll_at];
  let x = 0;
  let y = spot ? -spot[2] : 0;
  if (!spot) {
    const p = e.point(`${ROLL_WITH[S.roll_at][0]}#hands`);
    // (its holder is not here: the roll stays where it was)
    if (!p) return;
    x = p[0];
    y = p[1];
  }
  for (const name of ROLL_NAMES) {
    const shown = S.roll === name ? 1 : 0;
    const body = e.layer(`body_${name}`);
    const cloth = e.layer(`cloth_${name}`);
    body.alpha = shown;
    body.x = x;
    body.y = y;
    cloth.alpha = shown;
    cloth.x = x - 0.4 * out;
    cloth.y = y;
    cloth.scaleY = 0.03 + 0.97 * out;
  }
  e.at(x - 0.4 * out, y + R.radius + 0.2 + 0.5 * out * R.drop * 0.5);
}

// ── the insert of the scarlet scrap (the closeups module, shot "scrap"): `memory` fills the frame (in the game's «Scarlet»
// the scrap to compare with is the sample on the plate of the language of mini-games). The picture reads nothing of
// the scene; what moves in it (the fingers closing on the scrap: `taken`) is `now`, which here is always closed ──
const SCRAP_NOW = { taken: 1 };

// ── the film ──
// where things are (metres: across, distance)
const M = [0.2, 5.3], // the merchant behind the counter
  STOOL = [0.2, 5.3, 0.75], // his high stool (hidden by the counter), where he sits nine years later
  LOOK_DOWN = [0.2, 4.9, 0.95], // the counter's top before him
  BEFORE = [-0.69, 4.05], BEFORE_TURN = 40, // Assol before the counter, left of her basket and half turned to it: seen from her side
  BASKET = [-0.1, 4.75, 4.58], // the basket on the counter: across, where she sets it, where he pushes it back
  OUT = [1.8, 7.2], IN = [1.8, 6.05], // Gray outside the door — in the doorway (the door is in the far wall, at the right)
  LET_OUT = [2.3, 7.2], LET_IN = [2.3, 6.05], BY_DOOR = [2.3, 5.55], // Letika the same, and where she stays
  ASSOL_OUT = [1.9, 7.2], ASSOL_IN = [1.9, 6.05], // Assol (seventeen) outside the door — in the doorway
  PAST = [1.8, 3.9], AT_COUNTER = [0.75, 3.9], // Gray passing the counter's end — before the counter, right of the merchant
  AT_WINDOW = [-1.3, 4.3], TO_WINDOW = 310, // Gray in the sunbeam by the window, turned to it: seen from behind and from his side
  STREET = [-3.7, 6.2]; // the violinist on the street, seen through the window
// into a motion: when the hands let go of what they put down or move, and when the merchant's take what he reaches for
// (seconds from the motion's start — set by the motions' length: notes.md)
const PUT_UP_LET_GO = 2.0, PUSH_AWAY_PUSHED = 1.2, TAKE_DOWN_TAKEN = 2.2, TAKE_DOWN_LAID = 4.2;
// the way from one place to another, degrees (0 away from us, 90 to the right)
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
// the cameras: across the counter from its right end, on Assol's side and the merchant's face (toys_in); near, the door
// and the counter (toys_again); a step left, the merchant clear of Gray before him (the silk beats); close behind Gray
// at the window (found)
const TOYS_IN_CAM = { camera_x: 1.2, camera_z: 2.1, camera_yaw: -30 },
  TOYS_AGAIN_CAM = { camera_x: 0.9, camera_z: 2.8 },
  SILK_CAM = { camera_x: -0.5, camera_z: 0.6 },
  FOUND_CAM = { camera_x: -1.3, camera_z: 1.6 };
// (a sequence of the beat's: stopped with it, whether the beat has come to await it or not)
const cam = (s, to, over) => s.sequence((q) => q.all(Object.keys(to).map((k) => q.move(k, to[k], { over, ease: "inOut" }))));
const ORDER = ["toys_in", "toys_again", "silk_in", "memory", "silk", "found", "violin"];


// film(scene) — the beats (the characters of the cast: Assol grown up)
function film(scene) {
  const loop = (motion) => ({ motion, loop: true });
  // all a shot's values: and the hour's light
  const whole = (v) => ({ ...v, ...N.keys(v.hour) });
  const stands = (id, key, at, turn, extra) => ({
    [`${id}_here`]: true, [`${key}_a`]: at[0], [`${key}_d`]: at[1], [`${id}_do`]: "stand", [`${id}_turn`]: turn, [`${id}_look`]: null,
    [`${id}_reach`]: null, [`${id}_gait`]: null, ...extra,
  });
  const away = (id, key, at, turn) => stands(id, key, at, turn, { [`${id}_here`]: false });

  // ── the states the beats begin at ──
  const room = {
    fade: 0, camera_target: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, hour: 0.4, goods: "toys", roll: "none", roll_out: 0, roll_at: "rack",
    found: 0, violinist: 0, memory: 0, basket: 0, basket_d: BASKET[1],
  };
  const merchant = stands("merchant", "mer", M, 180, { merchant_look: LOOK_DOWN, merchant_on: null, merchant_still: false });
  const seated = stands("merchant", "mer", M, 180, { merchant_look: LOOK_DOWN, merchant_on: STOOL, merchant_do: loop("seated"), merchant_still: false });
  const girl = stands("assol", "as", BEFORE, BEFORE_TURN, { assol_with: ["basket"], assol_wear: null, assol_on: null });
  const grown = stands("assol", "as", ASSOL_OUT, 180, { assol_with: ["basket"], assol_wear: kit.cast.characters.assol, assol_on: null });
  const noAssol = { ...away("assol", "as", BEFORE, 180), assol_with: null, assol_wear: null, assol_on: null };
  const outside = { ...away("grey", "gr", OUT, 180), ...away("letika", "le", LET_OUT, 180) };

  const TOYS_IN = whole({ ...room, ...TOYS_IN_CAM, ...merchant, ...girl, ...outside });
  const TOYS_AGAIN = whole({ ...room, ...TOYS_AGAIN_CAM, ...seated, ...grown, ...outside });
  const SILK = { ...room, ...SILK_CAM, goods: "silk", roll: "cherry" };
  const SILK_IN = whole({ ...SILK, ...merchant, ...noAssol, ...outside });
  // Gray before the counter with the roll in his hands, Letika by the door
  const COUNTER = whole({
    ...SILK, roll_at: "grey", ...merchant, ...noAssol, ...stands("grey", "gr", AT_COUNTER, 0, {}), ...stands("letika", "le", BY_DOOR, 180, {}),
  });
  // Gray in the beam by the window, the roll held toward the light; the merchant at his shelves
  const WINDOW = {
    ...COUNTER, ...stands("grey", "gr", AT_WINDOW, TO_WINDOW, { grey_do: loop("hold_up") }), merchant_turn: 0, merchant_look: null,
  };
  const FOUND = { ...WINDOW, roll: "scarlet", roll_out: 1 };
  const FOUND_NEAR = { ...FOUND, found: 1, ...FOUND_CAM, merchant_still: true };

  return {
    // toys_in — the morning. Assol sets her basket on the counter; the merchant turns the toys over, shakes his head,
    // pushes the basket away; she takes it and stands
    toys_in: {
      from: () => TOYS_IN,
      run: async (s) => {
        const as = s.person("assol"), me = s.person("merchant");
        await s.wait(0.3);
        const put = as.do("put_up");
        await s.wait(PUT_UP_LET_GO);
        as.with(null);
        s.set("basket", 1);
        await put;
        me.look("basket#basket");
        await s.wait(0.3);
        me.do("sort", { loop: true });
        await s.wait(2.4);
        const shake = me.do("shake_head");
        s.tell("toys_in:no");
        await shake;
        const push = me.do("push_away");
        await s.wait(PUSH_AWAY_PUSHED);
        s.move("basket_d", BASKET[2], { over: 0.8 });
        await push;
        me.do("stand", { loop: true });
        me.look("assol");
        as.reach({ r: "basket#basket", l: "basket#basket" });
        await s.wait(0.9);
        as.with(["basket"]);
        s.set("basket", 0);
        as.reach(null);
        await s.wait(1.2);
      },
    },
    // toys_again — nine years on. Assol with the basket comes in and stands in the doorway; the merchant, at his books,
    // raises his head and does not rise
    toys_again: {
      from: () => TOYS_AGAIN,
      run: async (s) => {
        const as = s.person("assol"), me = s.person("merchant");
        await s.wait(1.5);
        await as.walk([ASSOL_IN]);
        await s.wait(1);
        me.look("assol");
        s.tell("toys_again:looks");
        await s.wait(4.3);
      },
    },
    // silk_in — Gray comes in, Letika stays by the door; the merchant takes a roll down from the rack and lays it on the
    // counter; Gray takes it up
    silk_in: {
      from: () => SILK_IN,
      run: async (s) => {
        const gr = s.person("grey"), me = s.person("merchant");
        const entering = s.sequence(async (q) => {
          const g = q.person("grey"), le = q.person("letika");
          g.here(true);
          const walking = g.walk([IN, PAST, AT_COUNTER]);
          await q.wait(1);
          le.here(true);
          await le.walk([LET_IN, BY_DOOR]);
          await walking;
          await g.turn(0);
        });
        await s.wait(1.4);
        me.look("grey");
        const take = me.do("take_down");
        await s.wait(TAKE_DOWN_TAKEN);
        s.set("roll_at", "merchant");
        await s.wait(TAKE_DOWN_LAID - TAKE_DOWN_TAKEN);
        s.set("roll_at", "counter");
        await take;
        s.tell("silk_in:first");
        me.do("stand", { loop: true });
        await entering;
        gr.reach({ r: "roll", l: "roll" });
        await s.wait(0.8);
        s.set("roll_at", "grey");
        gr.reach(null);
        await s.wait(0.4);
      },
    },
    // memory — the scarlet scrap of the first chapter fills the frame (3 s)
    memory: {
      after: "silk_in",
      from: () => COUNTER,
      run: async (s) => {
        const insert = s.shot({ memory: 1 });
        const back = s.shot({ memory: 0 });
        await s.wait(0.4);
        await s.until(() => insert.ready && back.ready);
        insert.cut();
        await s.wait(3);
        back.cut();
        s.tell("memory:corner");
        await s.wait(0.6);
      },
    },
    // silk — Gray, the roll in his hands, goes to the window and stands in the beam; the merchant turns to his shelves.
    // The game's «Scarlet» goes on from here
    silk: {
      after: "memory",
      from: () => COUNTER,
      run: async (s) => {
        const gr = s.person("grey"), me = s.person("merchant");
        me.look(null);
        me.turn(0);
        await gr.walk([AT_WINDOW]);
        gr.do("hold_up", { loop: true });
        await gr.turn(TO_WINDOW);
        s.tell("silk:ready");
        await s.wait(0.4);
      },
    },
    // found — the scarlet roll let out in the beam; the camera comes close on it; the merchant stands still; the cloth's
    // light lies on Gray's hands and coat
    found: {
      after: "silk",
      from: () => whole(FOUND),
      run: async (s) => {
        s.person("merchant").still(true);
        const near = cam(s, FOUND_CAM, 2.8);
        await s.wait(0.8);
        const glow = s.move("found", 1, { over: 3.5, ease: "inOut" });
        s.tell("found:glow");
        await s.all(near, glow);
        await s.wait(2.4);
      },
    },
    // violin — a fiddler stands in the street beyond the window; Gray turns to the window, then to Letika by the door
    violin: {
      after: "found",
      from: () => whole(FOUND_NEAR),
      run: async (s) => {
        const gr = s.person("grey"), le = s.person("letika");
        s.person("merchant").still(false);
        const back = cam(s, SILK_CAM, 2.2);
        await s.wait(0.5);
        s.set("violinist", 1);
        s.tell("violin:heard");
        await gr.turn(toward(AT_WINDOW, STREET));
        gr.look("violinist");
        await s.wait(2.5);
        gr.look(null);
        await gr.turn(toward(AT_WINDOW, BY_DOOR));
        le.look("grey");
        s.tell("violin:letika");
        await s.all(back, s.wait(2));
      },
    },
  };
}
return { SKY, paintShelves, paintRack, paintCounterTop, paintBasket, facade, paintRoll, rollPlace, rollMotion, ROLL_NAMES, SCRAP_NOW, film, ORDER };
