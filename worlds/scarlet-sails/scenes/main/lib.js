// «The Kaperna Shore» — the shore: where the sun and the moon stand on its sky, where the ship is as she comes in, the
// land's shape (the relief reads it), what its elements paint and move with, and its film (film(scene): the world's
// module beats). Everything is painted once, in daylight colours: the hour is the world's sky (kit.sky) and the
// scene's light (light.looks); what moves is moved by layers, animates and the engine (notes.md).
const N = kit.sky;
const { clamp, mix, ease, span } = anim;
const HORIZON = 0.55;
// the sea's surface, metres (the viewer stands at 0 on the sand by it)
const SEA = -0.1;

// The sky (kit.sky.sky, skyMotion): the sun rises over the open sea on the right, stands above the frame at noon and
// sets behind the hills on the left; the moon by night goes from the sea on the right across to the left
const SKY = {
  horizon: HORIZON,
  sun: (u, height, state, out) => {
    out[0] = mix(1.45, 0.22, clamp(u, -0.1, 1.1));
    out[1] = HORIZON - height * 0.78 + (u < 0 || u > 1 ? 0.06 : 0);
  },
  moon: (u, height, state, out) => {
    out[0] = mix(1.5, 0.55, clamp(u, 0, 1));
    out[1] = HORIZON - height * 0.42;
  },
  clouds: [[0.95, 0.19, 1.2, 0.022], [1.6, 0.3, 0.9, 0.014], [0.35, 0.34, 1.0, 0.016], [1.15, 0.43, 1.4, 0.01], [0.1, 0.1, 0.8, 0.02]],
  storm: "storm",
};

// "Secret" as `ship` says (0…1): none (far off, unlit) → a spark on the horizon by the cape, kindling over the first
// 0.15 → coming in, her bow to the shore → at anchor off the beach, swung three-quarters on. [across, distance (metres),
// facing (degrees: 290 — her bow toward the shore and to the left; 338 — nearly broadside, bow left), spark 0…1]
function shipAt(ship) {
  const come = ease.inOut(clamp(((ship ?? 0) - 0.15) / 0.85, 0, 1));
  const distance = Math.exp(mix(Math.log(9000), Math.log(260), come));
  return [(mix(0.705, 0.775, come) - 0.5) * (16 / 9) * distance, distance, mix(290, 338, ease.inOut(span(come, 0.5, 1))), clamp((ship ?? 0) / 0.15, 0, 1)];
}

// ── The sea ── seen from above (its plane's centre 1250 m ahead): its own colour under the mirror, deeper toward the
// eye; the wind's long pale lines of ripple — a layer going slowly along, shown as much as `wind`; the storm's white
// crests — a layer running fast before the wind, shown as much as `storm` (seaMotion)
function sea(g, e) {
  const deep = g.createLinearGradient(0, 1250, 0, 650);
  deep.addColorStop(0, "#4b627a");
  deep.addColorStop(1, "#7088a0");
  g.fillStyle = deep;
  g.fillRect(-1600, -1250, 3200, 2500);
  e.layer("ripple", { box: [-1600, -1250, 1600, 1250], drift: [1.2, 0] }, (g) => {
    for (let i = 0; i < 900; i++) {
      const x = -1600 + anim.hash(i, 1) * 3200;
      const y = -1250 + anim.hash(i, 2) * 2500;
      const len = 12 + 50 * anim.hash(i, 4);
      g.fillStyle = `rgba(214,224,232,${(0.35 * anim.hash(i, 3)).toFixed(3)})`;
      for (const k of x + len > 1600 ? [0, -3200] : [0]) g.fillRect(x + k, y, len, 2.3);
    }
  });
  e.layer("crests", { box: [-1600, -1250, 1600, 1250], drift: [-7, 0] }, (g) => {
    for (let i = 0; i < 1400; i++) {
      const x = -1600 + anim.hash(i, 11) * 3200;
      const y = -1250 + anim.hash(i, 12) ** 0.6 * 2500;
      const len = 4 + 22 * anim.hash(i, 14);
      g.fillStyle = `rgba(240,244,246,${(0.3 + 0.6 * anim.hash(i, 13)).toFixed(3)})`;
      for (const k of x + len > 1600 ? [0, -3200] : [0]) g.fillRect(x + k, y, len, 0.5 + 1.6 * anim.hash(i, 15));
    }
  });
}
function seaMotion(e) {
  e.layer("ripple").alpha = clamp(e.state.wind ?? 0, 0, 1);
  e.layer("crests").alpha = clamp(e.state.storm ?? 0, 0, 1);
}

// ── Mist ── lying on the water at one depth, `half` metres either side, `tall` high at its thickest: a band along
// the water (its height and thickness follow `mist`) and soft long banks in two layers drifting round, one each way —
// painted in the day's pale colour, lit by the scene (dark blue at night, pearl at dawn). `thin`: what is left of the
// band with no mist at all.
function mist(e, { half, tall, banks, thin = 0, seed = 1 }) {
  const W = 2 * half;
  const colour = "#e2e7eb";
  if (thin >= 0) {
    e.layer("band", { box: [-half, -tall, half, tall * 0.3], pivot: [0, 0] }, (g) => {
      const band = g.createLinearGradient(0, -tall, 0, tall * 0.3);
      band.addColorStop(0, N.rgba(colour, 0));
      band.addColorStop(0.65, N.rgba(colour, 0.75));
      band.addColorStop(1, N.rgba(colour, 0.4));
      g.fillStyle = band;
      g.fillRect(-half, -tall, W, tall * 1.3);
    });
  }
  [["east", 1], ["west", -1]].forEach(([name, sign], k) => {
    e.layer(name, { box: [-half, -tall, half, tall * 0.3], drift: [sign * banks.pace * (0.7 + 0.6 * anim.hash(seed, k + 1)), 0] }, (g) => {
      for (let i = 0; i < banks.n; i++) {
        const w = banks.long[0] + anim.hash(i, seed * 5 + k) * banks.long[1];
        const x = -half + W * anim.hash(i, seed * 5 + k + 2);
        const r = tall * (0.35 + 0.4 * anim.hash(i, seed * 5 + k + 3)) * banks.thick;
        const y = -tall * (0.2 + 0.5 * anim.hash(i, seed * 5 + k + 4)) * banks.high;
        for (const dx of [-W, 0, W]) N.glow(g, x + dx, y, w, r / w, colour, banks.alpha);
      }
    });
  });
}
// the band as high and as thick as the mist is now (thin: its share with none), the banks as much as there is mist
function mistMotion(e, thin = 0) {
  const m = clamp(e.state.mist ?? 0, 0, 1);
  if (thin >= 0) {
    const band = e.layer("band");
    band.scaleY = mix(0.15, 1, m);
    band.alpha = mix(thin, 1, m);
  }
  e.layer("east").alpha = m;
  e.layer("west").alpha = m;
}

// ── the land ──
// The near beach: its water's edge (metres: across, ahead) curves away from under the eye to the
// left; the sand rises gently from it.
const EDGE = [
  [1.2, 0], [0.4, 2], [-0.4, 4], [-1.8, 6], [-3.7, 8], [-5.9, 10], [-10.5, 14], [-17.8, 20], [-30, 30],
  [-50, 45], [-75, 60], [-100, 75], [-125, 90],
];
// how far (X, Z) is inland of the water's edge, metres (negative: out in the water)
function inland(X, Z) {
  let best = Infinity;
  let side = 1;
  for (let i = 0; i < EDGE.length - 1; i++) {
    const [ax, az] = EDGE[i];
    const [bx, bz] = EDGE[i + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const u = anim.clamp(((X - ax) * dx + (Z - az) * dz) / (dx * dx + dz * dz), 0, 1);
    const d = Math.hypot(X - ax - u * dx, Z - az - u * dz);
    if (d < best) {
      best = d;
      side = dx * (Z - az) - dz * (X - ax) > 0 ? 1 : -1;
    }
  }
  return Z > EDGE[EDGE.length - 1][1] ? -1 : best * side;
}
// … and its bed goes on down under the water by the same slope — a shallow (WADE deep at most: who wades out stands on
// it, the sea's mirror at their knees) lying along the near beach only: 9…14 m out and 14…22 m ahead it comes back up
// to the sea's surface, where everything afloat and far off stands
const WADE = 0.55;
function beach(X, Z) {
  const m = inland(X, Z);
  if (m >= 0) return SEA + Math.min(m * 0.09, 0.7);
  return SEA - Math.min(-m * 0.09, WADE) * (1 - ease.smooth(span(-m, 9, 14))) * (1 - ease.smooth(span(Z, 14, 22)));
}

// Kaperna's hill: along the shore (x — metres from its anchor, 40 m left of the start) a long
// brow, highest at Longren's house, falling steeply to the water by the pier — its skyline 200 m
// ahead (the brow); toward the eye its face drops steeply to the water (Z 182). Two terraces are
// cut into the face: [from x, to x, height] — a level shelf, a stone wall under its edge.
const HILL = { across: -40, front: 182, brow: 200 };
const PROFILE = [
  [-420, 17], [-300, 19], [-200, 23], [-130, 29], [-80, 35], [-48, 39.5], [-30, 40], [-12, 35],
  [8, 26], [28, 16], [46, 8], [60, 3], [70, 1.2], [78, 0],
];
function profile(x) {
  const n = PROFILE.length;
  if (x <= PROFILE[0][0]) return PROFILE[0][1];
  if (x >= PROFILE[n - 1][0]) return 0;
  let i = 0;
  while (PROFILE[i + 1][0] < x) i++;
  const tangent = (j) => {
    const a = PROFILE[Math.max(0, j - 1)];
    const b = PROFILE[Math.min(n - 1, j + 1)];
    return (b[1] - a[1]) / (b[0] - a[0]);
  };
  const [x0, h0] = PROFILE[i];
  const [x1, h1] = PROFILE[i + 1];
  const d = x1 - x0;
  const u = (x - x0) / d;
  const u2 = u * u;
  const u3 = u2 * u;
  return Math.max(
    0,
    (2 * u3 - 3 * u2 + 1) * h0 + (u3 - 2 * u2 + u) * tangent(i) * d + (-2 * u3 + 3 * u2) * h1 + (u3 - u2) * tangent(i + 1) * d,
  );
}
const TERRACES = [
  [-28, -6, 18],
  [-2, 20, 9.5],
];
const WALL = 2;
const face = (Z) => anim.ease.smooth(anim.span(Z, HILL.front, HILL.brow));
// the face's own height above the water at (x, Z), and where on it (Z) that height is h
const natural = (x, Z) => profile(x) * face(Z);
function faceAt(x, h) {
  let lo = HILL.front;
  let hi = HILL.brow;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (natural(x, mid) < h) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function hill(X, Z) {
  const x = X - HILL.across;
  const h = natural(x, Z);
  for (const [x0, x1, level] of TERRACES) if (x >= x0 && x <= x1 && h >= level - WALL && h <= level) return SEA + level;
  return SEA + h;
}
// The tavern's shore: behind the cove the land goes on — a low flat shore (LAND.top metres over the sea) from its own
// water's edge (LAND.front ahead) back to the foot of Kaperna's hill, under the tavern and on to the left of it (the
// road to Liss runs along it); to the right of the tavern it ends (LAND.right), the pier standing on over the water.
const LAND = { front: 127, right: 27, top: 1.1 };
const strand = (X, Z) => SEA + LAND.top * ease.smooth(span(Z, LAND.front, LAND.front + 3)) * (1 - ease.smooth(span(X, LAND.right, LAND.right + 3)));
// the ground's height there, metres: the sea's surface where there is water — but in the shallow by the near beach, its bed
const ground = (X, Z) => (Z < 22 ? beach(X, Z) : Math.max(beach(X, Z), strand(X, Z), Z > HILL.front - 2 ? hill(X, Z) : SEA));

// snow lying on what a painting paints — its layer `snow`, shown as much as `winter` (snowMotion: its animate)
const SNOW = "#eef1f4";
function snowMotion(e) {
  e.layer("snow").alpha = clamp(e.state.winter ?? 0, 0, 1);
}

// The near beach painted onto a plane centred at (cx, cz), seen from above (x across, y toward the
// eye): wet sand along the water's edge, the pale dry sand above it, darker toward the eye, the thin
// line where the last wave reached
function sand(g, cx, cz) {
  const shore = (dx) => {
    g.beginPath();
    g.moveTo(6 - cx, cz + 5);
    for (const [x, z] of EDGE) g.lineTo(x + dx - cx, cz - z);
    g.lineTo(-300 - cx, cz - 90);
    g.lineTo(-300 - cx, cz + 5);
    g.closePath();
  };
  shore(0);
  g.fillStyle = "#a6b1ba";
  g.fill();
  shore(-1.5);
  const dry = g.createLinearGradient(0, cz, 0, cz - 40);
  dry.addColorStop(0, "#cfcdc5");
  dry.addColorStop(1, "#dedcd4");
  g.fillStyle = dry;
  g.fill();
  shore(-0.8);
  g.strokeStyle = "rgba(240,239,233,0.6)";
  g.lineWidth = 0.05;
  g.stroke();
}

// Kaperna's houses — [X (world metres), Z, blocks]: Longren's, highest of all, alone on the brow,
// its window to the sea; the houses along the brow, stepping down to the water by the pier; those on
// the two terraces (on the middle of the shelf). Their sides to the sea are seen obliquely: D deep,
// rising RISE.
const ROW = HILL.brow - 1.5;
const onTerrace = (X, level) => faceAt(X - HILL.across, level - WALL / 2);
const LONGREN = [-77, HILL.brow + 1, [{ w: 6, h: 3.4, roof: "gable" }]];
const HOUSES = [
  [-340, ROW, [{ w: 5, h: 3, roof: "gable" }]],
  [-258, ROW, [{ w: 6, h: 3.2, roof: "gable" }]],
  [-190, ROW, [{ w: 5, h: 3, roof: "gable" }]],
  [-46, ROW, [{ w: 5, h: 3.2, roof: "gable" }, { w: 4.5, h: 2.8, roof: "flat" }]],
  [-26, ROW, [{ w: 6, h: 3.2, roof: "shed" }]],
  [-12, ROW, [{ w: 5, h: 3, roof: "gable" }, { w: 5, h: 2.8, roof: "flat" }]],
  [6, ROW, [{ w: 6, h: 3.4, roof: "shed" }]],
  [18, ROW, [{ w: 6.5, h: 3.2, roof: "gable" }, { w: 4, h: 2.6, roof: "flat" }]],
  [-64, onTerrace(-60, 18), [{ w: 5, h: 3, roof: "gable" }, { w: 4, h: 2.6, roof: "flat" }]],
  [-35, onTerrace(-32, 9.5), [{ w: 6, h: 3, roof: "shed" }]],
];
const D = 1.4;
const RISE = 0.55;
// Every block where it stands (e.ground: the relief): { X, Z — its left front corner; b; g0 — the
// ground there; floor — how much higher its floor is (as high as the ground under its front: a
// plinth below); windows — [x, y, w, h] from its foot, each with its index (n) through the village;
// longren — the last window of Longren's house, the one to the sea; box }
function houses(e) {
  const out = [];
  let n = 0;
  for (const [X0, Z, blocks] of [...HOUSES, LONGREN]) {
    let X = X0;
    for (const b of blocks) {
      const g0 = e.ground(X, Z);
      let top = g0;
      for (let x = X; x <= X + b.w + D; x += 0.5) top = Math.max(top, e.ground(x, Z));
      const floor = top - g0;
      const windows = [];
      const k = Math.round(b.w / 3);
      for (let i = 0; i < k; i++) windows.push([((i + 0.5) * b.w) / k, -floor - b.h * 0.5, 0.7, 0.9, n++]);
      windows.push([b.w + D / 2, -floor - b.h * 0.5 - RISE / 2, 0.6, 1, n++]);
      out.push({ X, Z, b, g0, floor, windows, longren: X0 === LONGREN[0], box: [-0.6, -(floor + b.h + 4), b.w + D + 0.6, 6] });
      X += b.w;
    }
  }
  return out;
}

// the windows' glows by their index through the village (lit_windows: `w0`…; Longren's to the sea is the last)
const WINDOW_NAMES = [];
for (const [, , blocks] of [...HOUSES, LONGREN]) for (const b of blocks) for (let i = 0; i <= Math.round(b.w / 3); i++) WINDOW_NAMES.push(`w${WINDOW_NAMES.length}`);

// Kaperna's hill painted onto a plane centred at (cx, cz), seen from above, draped over the land:
// the face paler toward the brow, the pale shingle at its foot, the stairs from Longren's door down
// past the terraces to the water — [x, height] corners on the face, a step every 0.9 m down
const STAIRS = [
  [[-30, 39.6], [-22, 31], [-10, 25], [-26, 18.2]],
  [[-8, 18.2], [2, 13.5], [-1, 9.7]],
  [[20, 9.7], [34, 4.5], [52, 1.3]],
];
function hillside(g, e, cx, cz, w, d) {
  const to = (x, h) => [HILL.across + x - cx, cz - faceAt(x, h)];
  const width = Math.min(w, HILL.across + PROFILE[PROFILE.length - 1][0] - (cx - w / 2));
  const slope = g.createLinearGradient(0, cz - HILL.front, 0, cz - HILL.brow);
  slope.addColorStop(0, "#58616c");
  slope.addColorStop(1, "#68727d");
  g.fillStyle = slope;
  g.fillRect(-w / 2, -d / 2, width, d);
  g.fillStyle = "#c6cac9";
  g.fillRect(-w / 2, cz - HILL.front - 1.2, width, 1.2);
  for (const pts of STAIRS) {
    g.strokeStyle = "#a9b0b6";
    g.lineWidth = 0.4;
    g.beginPath();
    pts.forEach(([x, h], i) => (i ? g.lineTo(...to(x, h)) : g.moveTo(...to(x, h))));
    g.stroke();
    g.strokeStyle = "#8d969e";
    g.lineWidth = 0.12;
    g.beginPath();
    for (let i = 1; i < pts.length; i++) {
      const [ax, ah] = pts[i - 1];
      const [bx, bh] = pts[i];
      const n = Math.floor(Math.abs(ah - bh) / 0.9);
      for (let j = 1; j < n; j++) {
        const x = anim.mix(ax, bx, j / n);
        const h = anim.mix(ah, bh, j / n);
        const [px, py] = to(x, h);
        g.moveTo(px - 0.5, py);
        g.lineTo(px + 0.5, py);
      }
    }
    g.stroke();
  }
  e.layer("snow", {}, (g) => {
    g.fillStyle = N.rgba(SNOW, 0.9);
    g.fillRect(-w / 2, -d / 2, width, d);
  });
}

// ── Menners' tavern, built (chapter III) ── on its anchor `tavern_set` (TAVERN: across, distance; it faces the sea —
// the start): the house a block 12 m long and 6 m deep (x −4…8 from the anchor, back from its front wall), its walls
// 4 m, its ridge 6.2 m; before the right half of the front wall the veranda — a floor 6 × 3 m, 0.5 m up (x 2…8, 3 m
// out), steps down from it before the door, a rail, posts and a beam with the lantern over the table. tv(x, z, up?) —
// a point of the set in the scene's metres (x along the front wall, z back from it: out before it is negative).
const TAVERN = { across: 14, distance: 140 };
const tv = (x, z, up) => (up == null ? [TAVERN.across + x, TAVERN.distance + z] : [TAVERN.across + x, TAVERN.distance + z, up]);
const WALLS = { wall: "#dfe2e2", gable: "#eef0ef", roof: "#6c7681", timber: "#56606b", glass: "#46515c", boards: "#a9a7a0", stone: "#b4b9bc" };
// its windows [x, width] in the front wall (their sills 1.7 m up, 1.1 m tall), its door [x from, to] (from the veranda's
// floor 2.1 m up), the lantern [x, height] on the veranda's beam
const TAVERN_WINDOWS = [[-2.4, 1], [0.6, 1], [6.1, 1]];
const TAVERN_DOOR = [2.5, 3.5];
const TAVERN_LAMP = [5.9, 3.0];
// the front wall, in the anchor's metres (the card's own): the wall with the doorway cut through it (what is inside is
// seen in it), its dark windows; to the right the pier on piles out to the landing
function tavernFront(g, e) {
  g.fillStyle = WALLS.wall;
  g.beginPath();
  g.rect(-4, -4, 12, 4);
  g.rect(TAVERN_DOOR[0], -2.6, TAVERN_DOOR[1] - TAVERN_DOOR[0], 2.1);
  g.fill("evenodd");
  g.fillStyle = WALLS.stone;
  g.fillRect(-4, -0.5, 6.5, 0.5);
  g.fillRect(3.5, -0.5, 4.5, 0.5);
  g.fillStyle = WALLS.timber;
  g.fillRect(TAVERN_DOOR[0] - 0.08, -2.68, TAVERN_DOOR[1] - TAVERN_DOOR[0] + 0.16, 0.08);
  g.fillRect(TAVERN_DOOR[0] - 0.08, -2.6, 0.08, 2.1);
  g.fillRect(TAVERN_DOOR[1], -2.6, 0.08, 2.1);
  g.fillStyle = WALLS.glass;
  for (const [x, w] of TAVERN_WINDOWS) g.fillRect(x, -2.8, w, 1.1);
  g.fillStyle = WALLS.timber;
  g.fillRect(13, 0, 22, 0.3);
  for (let x = 13.5; x <= 35; x += 3) g.fillRect(x, 0, 0.2, 1.3);
  g.fillRect(31, -0.55, 4, 0.1);
  for (const x of [31, 33, 34.9]) g.fillRect(x, -0.55, 0.1, 0.55);
  e.at(33, 0, "landing");
  e.at(0.5, -3, "tavern");
  e.at(5, -1.4, "veranda");
  e.at(TAVERN_LAMP[0], -TAVERN_LAMP[1], "lamp");
}
// an end wall under its gable (6 m deep: x −3…3 on its card)
function tavernEnd(g) {
  g.fillStyle = WALLS.gable;
  g.beginPath();
  g.moveTo(-3, 0);
  g.lineTo(-3, -4);
  g.lineTo(0, -6.2);
  g.lineTo(3, -4);
  g.lineTo(3, 0);
  g.fill();
  g.strokeStyle = WALLS.roof;
  g.lineWidth = 0.25;
  g.beginPath();
  g.moveTo(-3.2, -3.9);
  g.lineTo(0, -6.25);
  g.lineTo(3.2, -3.9);
  g.stroke();
  g.fillStyle = WALLS.glass;
  g.fillRect(-0.5, -2.8, 1, 1.1);
}
// the roof's slope to the sea, from above (12.6 × 4 m: its eave toward the eye): slates in courses; snow — a layer
function tavernRoof(g, e) {
  g.fillStyle = WALLS.roof;
  g.fillRect(-6.3, -2, 12.6, 4);
  g.fillStyle = "rgba(60,68,78,0.35)";
  for (let y = -1.5; y < 2; y += 0.5) g.fillRect(-6.3, y, 12.6, 0.03);
  e.layer("snow", {}, (g) => {
    g.fillStyle = N.rgba(SNOW, 0.95);
    g.fillRect(-6.3, -2, 12.6, 4);
  });
}
// boards seen from above, running across (a floor w × d)
function boards(g, w, d, colour) {
  g.fillStyle = colour;
  g.fillRect(-w / 2, -d / 2, w, d);
  g.fillStyle = "rgba(40,44,50,0.25)";
  for (let y = -d / 2 + 0.2; y < d / 2; y += 0.2) g.fillRect(-w / 2, y, w, 0.012);
}
// a length of the veranda's rail from x0 to x1 (its floor 0.5 m up, the rail 0.9 m over it): the skirt under the
// floor, the floor's edge, balusters, the top rail
function rail(g, x0, x1) {
  g.fillStyle = "#8f8d87";
  g.fillRect(x0, -0.5, x1 - x0, 0.5);
  g.fillStyle = "rgba(40,44,50,0.25)";
  for (let x = x0 + 0.3; x < x1; x += 0.3) g.fillRect(x, -0.5, 0.012, 0.5);
  g.fillStyle = WALLS.timber;
  g.fillRect(x0, -0.56, x1 - x0, 0.06);
  g.fillRect(x0, -1.4, x1 - x0, 0.07);
  for (let x = x0 + 0.15; x < x1; x += 0.3) g.fillRect(x - 0.015, -1.4, 0.03, 0.84);
}
// the veranda's front (x −3…3 on its card): the rail either side of the steps (STEPS: x from, to, in the anchor's
// metres), the floor's edge across them, four posts up to the beam, the lantern's bracket and its dark case
const STEPS = [2.3, 3.7];
function verandaFront(g) {
  const s0 = STEPS[0] - 5, s1 = STEPS[1] - 5, lamp = TAVERN_LAMP[0] - 5;
  rail(g, -3, s0);
  rail(g, s1, 3);
  g.fillStyle = WALLS.timber;
  g.fillRect(s0, -0.56, s1 - s0, 0.06);
  for (const x of [-3, s0 - 0.1, s1, 2.9]) g.fillRect(x, -3.4, 0.1, 2.9);
  g.fillRect(-3.1, -3.5, 6.2, 0.12);
  g.fillRect(lamp - 0.015, -3.4, 0.03, 0.22);
  g.fillRect(lamp - 0.13, -3.2, 0.26, 0.04);
  g.fillRect(lamp - 0.13, -2.84, 0.26, 0.04);
  for (const x of [lamp - 0.13, lamp + 0.1]) g.fillRect(x, -3.2, 0.03, 0.4);
}
// its steps from above (1.4 m wide, three treads going up away from the eye)
function steps(g) {
  boards(g, 1.4, 1.12, WALLS.boards);
  g.fillStyle = "rgba(40,44,50,0.5)";
  for (const y of [-0.19, 0.19]) g.fillRect(-0.7, y, 1.4, 0.04);
}
// a table or a bench seen from before it: the top's edge w wide at h, two trestle legs
function trestle(g, w, h) {
  g.fillStyle = "#7d7a74";
  for (const x of [-w / 2 + 0.12, w / 2 - 0.2]) g.fillRect(x, -h, 0.08, h);
  g.fillStyle = "#6f6c67";
  g.fillRect(-w / 2 + 0.16, -h * 0.4, w - 0.32, 0.04);
  g.fillStyle = "#96938c";
  g.fillRect(-w / 2, -h, w, 0.05);
}
// the shore under the tavern from above, draped over the land (its plane's centre cx, cz; w × d): pale shingle, wet
// along the water; the road to Liss along the shore before the tavern — packed earth, two ruts — and the yard up to
// its wall; snow — a layer
const ROAD = [130.8, 136.8];
function tavernShore(g, e, cx, cz, w, d) {
  g.fillStyle = "#c3c5c0";
  g.fillRect(-w / 2, -d / 2, w, d);
  g.fillStyle = "#a6b1ba";
  g.fillRect(-w / 2, cz - LAND.front - 3.4, w, 3.4);
  g.fillStyle = "#b0aca2";
  g.fillRect(-w / 2, cz - ROAD[1], w, ROAD[1] - ROAD[0]);
  g.fillRect(TAVERN.across - 6 - cx, cz - TAVERN.distance, 14, TAVERN.distance - ROAD[1]);
  g.fillStyle = "rgba(96,92,84,0.45)";
  for (const z of [133.1, 134.5]) g.fillRect(-w / 2, cz - z, w, 0.14);
  e.layer("snow", {}, (g) => {
    g.fillStyle = N.rgba(SNOW, 0.95);
    g.fillRect(-w / 2, -d / 2, w, d);
    g.fillStyle = "rgba(150,160,172,0.5)";
    for (const z of [133.1, 134.5]) g.fillRect(-w / 2, cz - z, w, 0.14);
  });
}
// Philip's cart from its side, its shafts to the left on the ground: two wheels, the bed, three baskets of coal on it
function cart(g, e) {
  g.strokeStyle = "#4f4a44";
  for (const x of [-0.75, 0.75]) {
    g.lineWidth = 0.07;
    g.beginPath();
    g.arc(x, -0.5, 0.46, 0, 7);
    g.stroke();
    g.lineWidth = 0.035;
    g.beginPath();
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 4;
      g.moveTo(x - 0.46 * Math.cos(a), -0.5 - 0.46 * Math.sin(a));
      g.lineTo(x + 0.46 * Math.cos(a), -0.5 + 0.46 * Math.sin(a));
    }
    g.stroke();
  }
  g.fillStyle = "#6d665c";
  g.fillRect(-1.35, -0.86, 2.7, 0.12);
  g.fillRect(-1.35, -1.06, 0.06, 0.2);
  g.fillRect(1.29, -1.06, 0.06, 0.2);
  g.beginPath();
  g.moveTo(-1.35, -0.86);
  g.lineTo(-2.3, -0.04);
  g.lineTo(-2.3, 0);
  g.lineTo(-2.22, 0);
  g.lineTo(-1.25, -0.78);
  g.fill();
  for (const x of [-0.85, -0.05, 0.75]) {
    g.fillStyle = "#b79d72";
    g.beginPath();
    g.moveTo(x - 0.3, -0.86);
    g.lineTo(x - 0.36, -1.4);
    g.lineTo(x + 0.36, -1.4);
    g.lineTo(x + 0.3, -0.86);
    g.fill();
    g.fillStyle = "#2c2a29";
    g.beginPath();
    g.ellipse(x, -1.4, 0.36, 0.1, 0, Math.PI, 2 * Math.PI);
    g.fill();
  }
  e.at(0, -1.2, "cart");
}
// A fisherman's net on stakes: `poles` thin verticals 2.4 m apart from x0, the net hanging between them in a soft sag
function nets(g, poles, x0) {
  const pole = "#4a535c";
  for (let i = 0; i < poles; i++) {
    const x = x0 + i * 2.4 + (anim.hash(i, 1) - 0.5) * 0.5;
    const h = 2.1 + anim.hash(i, 2) * 0.7;
    g.fillStyle = pole;
    g.save();
    g.translate(x, 0);
    g.rotate((anim.hash(i, 3) - 0.5) * 0.06);
    g.fillRect(-0.035, -h, 0.07, h + 0.3);
    g.restore();
    if (i === poles - 1 || anim.hash(i, 4) < 0.2) continue;
    const nx = x + 2.4;
    g.fillStyle = "rgba(74,83,92,0.22)";
    g.beginPath();
    g.moveTo(x, -1.9);
    g.quadraticCurveTo(x + 1.2, -1.6, nx, -1.9);
    g.lineTo(nx, -0.2);
    g.quadraticCurveTo(x + 1.2, 0, x, -0.2);
    g.fill();
    g.strokeStyle = "rgba(74,83,92,0.6)";
    g.lineWidth = 0.025;
    g.beginPath();
    g.moveTo(x, -1.9);
    g.quadraticCurveTo(x + 1.2, -1.6, nx, -1.9);
    g.stroke();
  }
}
// a coil of rope or of net lying (w wide, h high): flattened turns one on another
function coil(g, w, h, colour) {
  g.strokeStyle = colour;
  g.lineWidth = h * 0.22;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.ellipse(0, -h * (0.14 + 0.22 * i), (w / 2) * (1 - 0.1 * i), h * 0.14, 0, 0, 7);
    g.stroke();
  }
}

// ── what the scene's script keeps in place as its keys move ──
// The tavern's door on its hinge (its card's facing, degrees): shut → open into the house
const doorFacing = (open) => mix(180, 85, clamp(open ?? 0, 0, 1));
// Menners' boat as `menners_boat` says (0…1): off the shore beyond the pier → carried away to the right, out into the
// waves [across, distance]
const mennersAt = (k) => [mix(20, 150, clamp(k ?? 0, 0, 1)), mix(46, 260, clamp(k ?? 0, 0, 1))];
// "Secret"'s skiff [across, distance, facing, elevation]: drawn up on the sand by the boats (`skiff_ashore`), else afloat —
// as `boat` says (0…1) from the ship's side (wherever `ship` has her) to the shallows where Assol meets it (SKIFF_MET):
// most of the way while it is small and far (at 0.8 the last ten metres are left). On the water it lies broadside to
// its way (WAY: the bearing from the shore to the ship at anchor, degrees) — to whoever looks from the shore at the
// ship; it floats on the sea's surface, over the shallow's bed too. Points of it as it lies at the meeting: inSkiff(a, b)
// — a metres toward its stern (its bow is to the left), b behind its near side.
const SKIFF_SAND = [-8.3, 10.3];
const WAY = 27;
const ALONG = [Math.cos((WAY * Math.PI) / 180), -Math.sin((WAY * Math.PI) / 180)];
const IN_WATER = [1.8, 9.05]; // Assol in the water to her knees, off the skiff's stern
const BEAM = 0.65; // who is in the skiff: this far behind its near side (its far side: twice that)
const SKIFF_MET = [IN_WATER[0] - 2.9 * ALONG[0] + BEAM * ALONG[1], IN_WATER[1] - 2.9 * ALONG[1] - BEAM * ALONG[0]];
const inSkiff = (a, b) => [SKIFF_MET[0] + a * ALONG[0] - b * ALONG[1], SKIFF_MET[1] + a * ALONG[1] + b * ALONG[0]];
function skiffAt(state) {
  if (state.skiff_ashore) return [...SKIFF_SAND, 180, 0];
  const [across, distance] = shipAt(state.ship);
  const k = 1 - (1 - clamp(state.boat ?? 0, 0, 1)) ** 2;
  const a = mix(across - 6, SKIFF_MET[0], k), d = mix(distance - 10, SKIFF_MET[1], k);
  return [a, d, 180 + WAY, SEA - ground(a, d)];
}

// ── the night of waiting: three lights on the horizon (`light1`…`light3`, each 0…2: a light far off → come near, seen
// for what it is → gone behind the cape) ──
// the fishing boat's and the steamer's way [light, bearing (degrees from straight ahead), how far (metres)]: far out on
// the open sea right of the cape → near → out again past the cape's end → behind the cape
const LIGHTS = {
  light1: [[0, 36.5, 1400], [1, 30, 100], [1.5, 22.5, 900], [2, 15, 940]],
  light2: [[0, 28.2, 3000], [1, 27, 430], [1.5, 23.5, 1000], [2, 8, 1150]],
};
// where that light's craft is now [across, distance]
function lightAt(id, v) {
  const way = LIGHTS[id];
  const k = clamp(v ?? 2, 0, 2);
  let i = 0;
  while (i < way.length - 2 && way[i + 1][0] < k) i++;
  const [v0, b0, r0] = way[i], [v1, b1, r1] = way[i + 1];
  const u = span(k, v0, v1);
  const bearing = (mix(b0, b1, u) * Math.PI) / 180, range = Math.exp(mix(Math.log(r0), Math.log(r1), u));
  return [range * Math.sin(bearing), range * Math.cos(bearing)];
}
// a craft's light as it is seen: its lantern (the glow `light`) and, far off, the spark it is from the shore (the glow
// `far`: full beyond `far` metres, none nearer than `near`) — both lost as it goes behind the cape
function lightMotion(e, key, near, far) {
  const gone = 1 - span(e.state[key] ?? 2, 1.7, 1.95);
  e.glow("light", gone);
  e.glow("far", gone * ease.smooth(span(Math.hypot(e.spot.across, e.spot.distance), near, far)));
}
// the steamer's smoke: none once she is behind the cape
const steamOf = (v) => 1 - span(v ?? 2, 1.8, 2);
// The lighthouse's lamp: lit from dusk till the morning. The mist on the cape's end that night (`cape_mist`) hides the
// tower and its light — a dim glow in it is all that is seen (the third light) — and parts as `light3` comes to 1,
// closing again as it goes on to 2: capeMist — how much of it lies over the tower now
const lampLit = (s) => clamp((s.night ?? 0) + 0.8 * (s.dusk ?? 0) + 0.6 * (s.dawn ?? 0), 0, 1);
const parted = (v) => (v <= 1 ? ease.smooth(span(v, 0.35, 1)) : 1 - ease.smooth(span(v, 1, 1.7)));
const capeMist = (s) => clamp(s.cape_mist ?? 0, 0, 1) * (1 - parted(s.light3 ?? 2));
// that mist, painted (metres from the lighthouse's foot; soft, dying out just under the waterline): a long bank over the
// cape, and the part of it over the cape's end and the tower — two layers (capeMistMotion shows them)
function capeBank(e) {
  const colour = "#e2e7eb";
  e.layer("bank", {}, (g) => {
    for (let i = 0; i < 11; i++) N.glow(g, -660 + i * 56, -30 - 8 * anim.hash(i, 31), 95, 0.36, colour, 0.45);
  });
  e.layer("tower", {}, (g) => {
    for (let i = 0; i < 7; i++) N.glow(g, -95 + i * 36, -32 - 5 * anim.hash(i, 32), 72, 0.5, colour, 0.5);
  });
}
function capeMistMotion(e) {
  e.layer("bank").alpha = clamp(e.state.cape_mist ?? 0, 0, 1);
  e.layer("tower").alpha = capeMist(e.state);
}

// An upturned boat on the sand, seen from the side, its stern to the left: the gunwale lies on the
// sand and lifts toward the bow, the dark hollow showing under it; pale weathered planking, the
// keel along the top, two strakes
function boat(g, len, h) {
  const L = len / 2;
  g.fillStyle = "#4c5563";
  g.beginPath();
  g.moveTo(L * 0.25, 0);
  g.quadraticCurveTo(L * 0.75, -h * 0.02, L * 0.98, -h * 0.3);
  g.lineTo(L * 0.98, 0);
  g.closePath();
  g.fill();
  const hull = g.createLinearGradient(0, -h, 0, 0);
  hull.addColorStop(0, "#d9dcdc");
  hull.addColorStop(1, "#a9aeb3");
  g.fillStyle = hull;
  g.beginPath();
  g.moveTo(-L, 0);
  g.lineTo(L * 0.25, 0);
  g.quadraticCurveTo(L * 0.75, -h * 0.02, L, -h * 0.3);
  g.quadraticCurveTo(L * 0.93, -h * 0.78, L * 0.74, -h * 0.96);
  g.quadraticCurveTo(-L * 0.05, -h * 1.06, -L * 0.86, -h * 0.9);
  g.lineTo(-L, -h * 0.06);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(92,100,112,0.45)";
  g.lineWidth = h * 0.03;
  g.beginPath();
  for (const u of [0.42, 0.72]) {
    g.moveTo(-L * (0.99 - 0.12 * u), -h * (0.06 + 0.84 * u));
    g.quadraticCurveTo(L * 0.1, -h * (0.02 + 1.0 * u), L * (1 - 0.2 * u), -h * (0.3 + 0.62 * u));
  }
  g.stroke();
  g.strokeStyle = "#7d8590";
  g.lineWidth = h * 0.06;
  g.beginPath();
  g.moveTo(L * 0.74, -h * 0.96);
  g.quadraticCurveTo(-L * 0.05, -h * 1.06, -L * 0.86, -h * 0.9);
  g.stroke();
}


// ── The film (the world's module beats), for the game and the showcase ── (the beats and what a game does with them:
// notes.md, docs/alye-parusa/scenes.md). The people are the engine's (the world's cast): Assol (a girl of eight;
// seventeen — her look `assol_wear`), the Kaperna children (a boy, an older girl, a little one), the little girl of
// chapter IV and her mother, Longren (in the past — his look `longren_young`); Gray, Hin Menners, Philip the collier;
// Mary and Menners the elder (the past); two more women and two fishermen of Kaperna; Letika at the oars of "Secret"'s
// skiff. Each one's keys: <id>_do, <id>_turn (degrees: 0 away from us, 90 to the right —
// the sea, 180 toward us, 270 to the left — Kaperna), <id>_look, <id>_reach, <id>_with, <id>_on, <id>_here — and
// their place (PLACE: as_, kb_, … a/d). They walk at their own pace; a beat waits for them.
// where things are (metres: across, distance, elevation); the water's edge runs from under the eye away to the left
const BOAT = [-5.6, 8.5, 0.5]; // the upturned boat's keel, where Assol sits in chapter IV
const STONE = [-1.4, 4.6, 0.38]; // the stone at the water's edge, its top
const AT_EDGE = [-2.3, 6.2]; // Assol at the water's edge, facing the sea (90); her yacht set down before her: TOY
const TOY = [-1.75, 6.3, 0];
const OUT_TO_SEA = [60, 400, 2];
const KAPERNA = [-40, 190, 30];
const UP = [[-9.5, 10.5], [-16, 17.5], [-21, 21.5]]; // the way up from the boats toward the village, on out of the frame
const NETS = [-11.5, 13.5]; // the mother by the nets
const PLACE = { assol: "as", kid_boy: "kb", kid_girl: "kg", kid_small: "ks", girl: "gi", mother: "mo", longren: "lo",
  grey: "gr", hin: "hi", filipp: "fi", mary: "ma", menners: "me", woman2: "w2", woman3: "w3", fisher1: "f1", fisher2: "f2" };
// (Letika has no place of his own: he sits in "Secret"'s skiff, on it)
const WHO = [...Object.keys(PLACE), "letika"];
const at = (id, [a, d]) => ({ [`${PLACE[id]}_a`]: a, [`${PLACE[id]}_d`]: d, [`${id}_here`]: true });
const loop = (motion) => ({ motion, loop: true });
// nobody but whom a beat names: each person's keys at rest, not here
const AWAY = () => Object.fromEntries(WHO.flatMap((id) => [[`${id}_here`, false], [`${id}_do`, "stand"], [`${id}_look`, null],
  [`${id}_reach`, null], [`${id}_with`, null], [`${id}_on`, null], [`${id}_gait`, null], [`${id}_wear`, null]]));
// the hour with its light (a cut is made in its own light: sky.keys), the shore's own keys, the camera
const hourOf = (hour) => ({ hour, ...N.keys(hour) });
const shore = (hour, o) => ({ ...AWAY(), fade: 0, ...hourOf(hour), mist: 0.2, wind: 0.25, windows: 0.3, longren_window: 1, tavern_lamp: 0,
  tavern_door: 0, past: 0, winter: 0, storm: 0, menners_boat: 0, skiff_ashore: 0, boat: 0,
  light1: 2, light2: 2, light3: 2, cape_mist: 0, hands: 0, reach: 0, ship: 0, sails: 0, toy_water: 0, camera_target: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, ...o });
const YOUNG = () => kit.cast.characters.assol;

// ── what the game's play has decided (the keys of the play: the game sets them as it opens the scene, no beat's
// `from` ever does; the scene's `state` holds what each is without a game) ──
// the windows of Kaperna of an evening and a night, as warm as the play has been (`warm` 0…1)
const lit = (scene) => 0.45 + 0.45 * clamp(scene.get("warm"), 0, 1);
// Longren's window on the slope of an evening and a night: dark once he has gone to sea (`longren` sea)
const hisWindow = (scene) => (scene.get("longren") === "sea" ? 0 : 1);
// what Assol (seventeen) has with her: `parts`, and the ring on her hand while `ring` is "finger" — his mother's, thin, with
// a stone (`ring`), or his own old wide one (`ring_old`), as `ring_kind` says (mother · own). Every beat that gives her something says it through this: the ring
// stays on her whatever she takes up or gives away.
const held = (scene, ...parts) => [...parts, ...(scene.get("ring") === "finger" ? [scene.get("ring_kind") === "mother" ? "ring" : "ring_old"] : [])];

// ── chapter III: the tavern's set and the shots on it ── (points of the set: tv, lib's tavern)
// the camera of the tavern's shots: on the road before the veranda, a little left of its middle, looking at it
const TAVERN_CAM = { camera_x: 17.3, camera_z: 132.3, camera_yaw: 0 };
const SEAT = tv(6.3, -1.7, 0.95); // the bench behind the table at the rail: its seat (over the land there)
const AT_TABLE = tv(4.9, -1.9); // Hin standing by the table
const AT_RAIL = tv(2.5, -2.3); // Gray risen, at the rail by the veranda's left end
const DOORWAY = tv(3.05, 0.45); // in the doorway, within the threshold
const AT_DOOR = tv(2.4, -1.0); // on the veranda before the door, by its left jamb: seen whole between the posts at the steps, clear of who stands in the doorway
const CART = [12.7, 138.7, 1.0]; // Philip's cart on the road left of the veranda
const AT_CART = [13.9, 137.9];
const BY_VERANDA = [14.9, 137.6]; // … and where he steps to, toward the veranda
const ALONG_ROAD = 135.7; // who passes the veranda goes along the road here, clear of the foot of its steps (they reach 136)
// chapter III, by the water: Longren's boat (boat2), the coil of net on its keel; where Gray stands at the water
const NET = [-16.9, 16.9];
const AT_NET = [-16.5, 16.45];
const MEETS = [-14.9, 16.3];
const AT_WATER = [-4.5, 8.0];
const AT_SKIFF = [-6.5, 9.75]; // by the skiff's stern, before it
const ON_SKIFF = [-6.4, 10.25, 0.7]; // … its side there, under his left hand
const SHORE_CAM = { camera_x: -3.6, camera_z: 2.4, camera_yaw: -12 };
const BOATS_CAM = { camera_x: -13, camera_z: 11, camera_yaw: -26 };

// the states the beats begin at (each a cut: the people already where it has them)
// dawn, the empty shore
const DAWN = () => shore(0.25, { mist: 0.35, windows: 0, sails: 1 });
// an evening of chapter I: the children by the boats, Assol not come yet (she stands off to the right with her yacht)
const KIDS = () => shore(0.735, {
  camera_x: -3.4, camera_z: 3.3, camera_yaw: -6,
  ...at("assol", [0.4, 2.6]), assol_with: ["yacht"], assol_turn: 315,
  ...at("kid_boy", [-6.4, 7.7]), kid_boy_turn: 160, kid_boy_look: [-5.3, 8.0, 1.0],
  ...at("kid_girl", [-5.3, 8.0]), kid_girl_turn: 220, kid_girl_look: [-6.4, 7.7, 1.0],
  ...at("kid_small", [-4.6, 7.5]), kid_small_turn: 240,
});
// … as the beat `kids` leaves them: she has run up with her yacht, they have turned to her, the older girl stepped out
const MET = () => ({
  ...KIDS(), ...at("assol", [-3.3, 6.6]), assol_turn: 300, assol_look: "kid_girl",
  kid_boy_turn: 105, kid_boy_look: "assol", kid_small_turn: 115, kid_small_look: "assol",
  ...at("kid_girl", [-4.5, 7.4]), kid_girl_turn: 120, kid_girl_look: "assol",
});
const HELD = () => ({ ...MET(), kid_girl_look: "assol#yacht" });
// chapter V, the morning of the sails: where Assol comes from (up the beach, out of the frame as it looks at the sea;
// when all Kaperna stands waiting she is at the head of the way they have left her as `run` begins), her way down past the
// boats to the water's edge (AT_EDGE), into the water (IN_WATER, above); where Kaperna stands — left of her way and
// right of it, behind the boat; where the children start from (clear of Longren's boat) and stop at the edge, and the
// little girl; Longren at the water, or by the boats; where the one who lifts a hand after the skiff stands if his
// place is at the wide shot's edge (WAVES: behind the near boat); two or three far off on the slope
const FROM_UP = [-16, 17.5];
const WAY_HEAD = [-10.9, 14.0];
const DOWN = [[-10.4, 13.2], [-8.0, 9.6], [-7.9, 8.2], [-5.0, 6.9]];
const STAND = [[-9.3, 10.0], [-10.2, 9.4], [-9.9, 11.0], [-11.0, 10.3], [-10.9, 11.9], [-11.9, 11.2]];
const BY_BOAT = [[-6.9, 9.4], [-6.0, 9.9], [-7.2, 10.5]];
const KIDS_FROM = [[-17.4, 18.6], [-16.6, 18.2], [-17.0, 19.6]];
const KIDS_EDGE = [[-4.5, 6.5], [-5.3, 7.4], [-5.9, 6.7]];
const GIRL_FROM = [-13.6, 15.3];
const GIRL_EDGE = [-1.7, 5.4];
const LONGREN_EDGE = [-3.6, 7.2];
const LONGREN_BOATS = [-7.9, 8.6];
const WAVES = BY_BOAT[0];
const SLOPE = [[-6, 191], [-4.6, 191.6], [-9, 193]];
const TO_SHIP = 28; // who stands on the shore faces the ship (their turn)
// the cameras of that morning [camera_x, camera_z, camera_yaw]: on the ship coming (the shore's people out of its
// frame), on her way down (they are in it), at the edge, on her wading out, the wide shot of the shore after her
const cam = ([camera_x, camera_z, camera_yaw]) => ({ camera_x, camera_z, camera_yaw });
const SEA_CAM = [-2, 0.4, 14];
const WAY_CAM = [-2, 0.4, -6];
const EDGE_CAM = [-1.6, 1.4, -2];
const WADE_CAM = [0.3, 3.4, 8];
const WIDE_CAM = [-2, 0.4, -2];
// in the skiff (inSkiff, above): a seat — the aft thwart 0.9, the stern sheets 1.9; where Gray's hand is held out to
// her over the stern; the camera of the two of them, from the shore's side, the ship over them
const seat = (a) => ({ on: "skiff", at: [a, BEAM, 0.5] });
const OFFERED = { on: "skiff", at: [2.3, BEAM, 1.05] };
const TWO_CAM = [...inSkiff(1.55, BEAM - 2), WAY];
// set at once, as a beat goes on from another: the values a cut to it would have set
const put = (s, values) => Object.entries(values).forEach(([key, value]) => s.set(key, value));

function film(scene) {
  // an evening at the tavern (chapter III): the lantern lit; Gray at the table by the rail, Hin standing by him, his
  // hands on his hips; Philip by his cart; two women by the nets; Assol (seventeen, her basket on her arm) not come
  // yet — off to the right along the road
  const TAVERN_EVENING = () => shore(0.76, {
    mist: 0.15, windows: lit(scene), tavern_lamp: 1, ...TAVERN_CAM,
    ...at("grey", SEAT), grey_on: SEAT, grey_turn: 180, grey_do: loop("seated"), grey_look: "hin",
    ...at("hin", AT_TABLE), hin_turn: 100, hin_do: loop("hands_hips"), hin_look: "grey",
    ...at("filipp", AT_CART), filipp_turn: 100, filipp_look: "hin",
    ...at("woman2", [25.4, 142.6]), woman2_turn: 215, ...at("woman3", [26.5, 143.3]), woman3_turn: 240, woman3_look: "woman2",
    as_a: 24.5, as_d: ALONG_ROAD, assol_wear: YOUNG(), assol_with: held(scene, "basket"), assol_turn: 270,
  });
  // … Philip stepped toward the veranda (the game's touch)
  const ASKED = () => ({ ...TAVERN_EVENING(), ...at("filipp", BY_VERANDA), filipp_look: "grey", grey_look: "filipp" });
  // … from behind Gray, risen and standing at the rail: along the road, over his shoulder, she goes away
  const BEHIND_GREY = () => ({
    ...ASKED(), camera_x: 18.8, camera_z: 138.5, camera_h: 0.55, camera_yaw: -90,
    ...at("grey", AT_RAIL), grey_on: null, grey_do: "stand", grey_turn: 270, grey_look: "assol",
    ...at("hin", tv(6.8, -1.0)), hin_turn: 250, hin_look: "assol",
    ...at("filipp", [12.6, 139.6]), filipp_turn: 250, filipp_look: "assol",
    ...at("assol", [-6, ALONG_ROAD]),
  });
  // the past, a winter's dusk in a blizzard, the same camera: the door open, Menners the elder in it; Mary with her
  // baby before him on the veranda, side on to us (the baby in her arms seen)
  const WINTER = () => shore(0.79, {
    past: 1, winter: 1, mist: 0.6, wind: 0.8, windows: 0.2, longren_window: 0, tavern_lamp: 0.7, tavern_door: 1, ...TAVERN_CAM,
    ...at("menners", DOORWAY), menners_turn: 200, menners_look: "mary",
    ...at("mary", AT_DOOR), mary_turn: 75, mary_do: loop("baby_stand"), mary_look: "menners",
  });
  // the past, the storm, the near shore: Longren (younger) at the water with his pipe, a coil of rope at his feet;
  // Menners on his knees in the boat the wind carries off, waving
  const STORM = () => shore(0.62, {
    past: 1, storm: 1, mist: 0.5, wind: 1, windows: 0, longren_window: 0, camera_x: -2.6, camera_z: 1.2, camera_yaw: 10,
    ...at("longren", [-2.4, 5.6]), longren_wear: kit.cast.characters.longren_young, longren_with: ["pipe"], longren_do: loop("pipe"),
    longren_turn: 70, longren_look: "menners",
    ...at("menners", mennersAt(0)), menners_on: "menners_skiff#skiff", menners_turn: 200, menners_do: loop("wave_help"),
  });
  // dusk by the water: Gray alone at the edge; "Secret"'s skiff drawn up on the sand; Longren by his boat with his
  // pipe; his window lit on the slope
  const DUSK = () => shore(0.8, {
    mist: 0.15, windows: lit(scene), tavern_lamp: 1, skiff_ashore: 1, ...SHORE_CAM,
    ...at("grey", AT_WATER), grey_turn: 60, grey_look: OUT_TO_SEA,
    ...at("longren", AT_NET), longren_turn: 320, longren_with: ["pipe"], longren_do: loop("pipe"),
  });
  // chapter IV: an evening nine years on, Assol (seventeen) on the boat, the yacht in her lap; the girl's mother by the nets
  const BOATSIDE = () => shore(0.76, {
    mist: 0.15, windows: lit(scene), longren_window: hisWindow(scene), camera_x: -4.4, camera_z: 3.4, camera_yaw: -4,
    ...at("assol", BOAT), assol_wear: YOUNG(), assol_on: BOAT, assol_turn: 180, assol_do: loop("seated"), assol_with: held(scene, "yacht"), assol_look: "assol#yacht",
    ...at("girl", [-9.8, 9.8]), girl_turn: 110,
    ...at("mother", NETS), mother_turn: 120,
  });
  const GIRL_CAME = () => ({ ...BOATSIDE(), ...at("girl", [-4.75, 7.85]), girl_turn: 250, girl_look: "assol#yacht", assol_look: "girl" });
  // sunset of the day he goes: Assol standing by the boat; Longren beside her, the chest on his shoulder
  const GOES = () => shore(0.76, {
    longren_window: 0, camera_x: -4.2, camera_z: 2.8, camera_yaw: -10,
    ...at("assol", [-4.7, 7.5]), assol_wear: YOUNG(), assol_with: held(scene), assol_turn: 230, assol_look: "longren",
    ...at("longren", [-5.4, 7.9]), longren_turn: 300, longren_with: ["chest_shoulder"], longren_look: [-13, 14.6, 1.6],
  });
  // the night of waiting: Assol on the stone, arms round her knees, looking out to sea; the cape in mist, three lights
  // on the horizon right of it (`light1`…`light3` 0: the game's «Waiting» looks into them); the camera turned to the sea —
  // she at the left, Kaperna's windows behind her, the lights in the open right half; it stands back from the stone far
  // enough for the stone's foot to be in the frame (the frame's lower edge meets the sand 3.8 m before the eye)
  const NIGHT = () => shore(0.96, {
    mist: 0.1, windows: lit(scene), longren_window: hisWindow(scene), cape_mist: 1, light1: 0, light2: 0, light3: 0, camera_x: -1.3, camera_z: -0.2, camera_yaw: 12,
    ...at("assol", STONE), assol_wear: YOUNG(), assol_with: held(scene), assol_on: STONE, assol_turn: 75, assol_do: loop("hug_knees"), assol_look: OUT_TO_SEA,
  });

  // ── chapter V: the morning of the sails, as the play has it ──
  const ending = () => scene.get("ending");
  // Longren that morning: at the water with her ("water": he knows — or he waited with her, or all Kaperna knows); at
  // home, down to the boats once the ship has anchored ("home"); at sea (null)
  const father = () => (["waited", "kaperna"].includes(ending()) || scene.get("longren") === "knows" ? "water" : scene.get("longren") === "home" ? "home" : null);
  // who lifts a hand after the skiff: Longren if he is here; else, where Kaperna wept, Philip; else no one
  const waver = () => (father() ? "longren" : ending() === "cry" ? "filipp" : null);
  // the people on the shore (`ending`, `longren`, `girl_toy`) at a moment of the morning: "comes" — the ship coming, she
  // not down yet (sails_far, run as it begins); "edge" — she at the edge (shore); "waded" — she in the water (hands);
  // "away" — the skiff gone off with her (a cut to the wide shot: Philip, if it is he who lifts a hand, and Longren come
  // down from home stand at WAVES, well inside its frame)
  const kaperna = (when) => {
    const e = ending(), toy = scene.get("girl_toy") === 1, down = when !== "comes", after = when === "waded" || when === "away";
    const out = {};
    const stands = (id, spot, o) => Object.assign(out, at(id, spot), { [`${id}_turn`]: TO_SHIP, [`${id}_look`]: after ? "skiff" : "ship" }, o);
    // Philip has his cap off, in his hand
    const philip = (spot) => stands("filipp", spot, { filipp_wear: kit.cast.characters.filipp_bare, filipp_with: ["cap_hand"] });
    if (e === "grin" || e === "cry") {
      // two fishermen and three women along her way; where Kaperna grinned, two of the women whisper
      stands("fisher1", STAND[0]);
      stands("fisher2", STAND[1]);
      stands("mother", STAND[3]);
      stands("woman2", STAND[2], e === "grin" ? { woman2_turn: 312, woman2_do: loop("whisper") } : null);
      stands("woman3", STAND[4], e === "grin" ? { woman3_turn: 100 } : null);
    }
    if (e === "cry") {
      // … where it wept: Philip by the boats; the three children run with her (not here till they do), and before
      // them the little girl with the yacht she was given
      philip(when === "away" && waver() === "filipp" ? WAVES : STAND[5]);
      ["kid_girl", "kid_boy", "kid_small"].forEach((id, i) => stands(id, down ? KIDS_EDGE[i] : KIDS_FROM[i], { [`${id}_here`]: down }));
      if (toy) stands("girl", down ? GIRL_EDGE : GIRL_FROM, { girl_here: down, girl_with: ["yacht"] });
    }
    if (e === "kaperna") {
      // all Kaperna, there since dawn, in two groups — the way to the water left open between them
      stands("fisher1", BY_BOAT[0]);
      stands("fisher2", BY_BOAT[1]);
      philip(BY_BOAT[2]);
      stands("mother", STAND[0]);
      stands("kid_boy", STAND[1]);
      stands("woman2", STAND[2]);
      stands("woman3", STAND[3]);
      stands("kid_girl", STAND[4]);
      stands("kid_small", STAND[5]);
    }
    // she waited with her father: no one else at the water; once the ship is in, two or three far off on the slope
    if (e === "waited" && down) ["fisher1", "mother", "woman2"].forEach((id, i) => stands(id, SLOPE[i]));
    if (father() === "water") stands("longren", LONGREN_EDGE);
    if (father() === "home") stands("longren", when === "away" ? WAVES : after ? LONGREN_BOATS : FROM_UP, { longren_here: after });
    // the little girl who was given the yacht holds it up over her head after the skiff
    if (toy && when === "away") stands("girl", GIRL_EDGE, { girl_with: ["yacht"], girl_reach: { r: [GIRL_EDGE[0] + 0.1, GIRL_EDGE[1] + 0.12, 1.42], l: [GIRL_EDGE[0] - 0.1, GIRL_EDGE[1] + 0.12, 1.42] } });
    return out;
  };
  // that morning's light and sea (`morning`: its hour), Assol seventeen
  const sails = (o) => shore(scene.get("morning"), { windows: 0, longren_window: 0, sails: 1, assol_wear: YOUNG(), assol_with: held(scene), ...o });
  // that morning where she waited (`ending` waited): Longren and Assol at the very edge, looking out to sea; from
  // behind them and a little to the side
  const DAWN_TWO = () => sails({
    mist: 0.3, camera_x: -2.2, camera_z: 1.9, camera_yaw: 6,
    ...at("assol", AT_EDGE), assol_turn: 30, assol_look: OUT_TO_SEA,
    ...at("longren", LONGREN_EDGE), longren_turn: 30, longren_look: OUT_TO_SEA,
  });
  // the ship coming round the cape; Assol not here yet. The camera looks at the sea, the shore's people out of its
  // frame — but all Kaperna, waiting since dawn, in it
  const SAILS_SEEN = () => sails({
    ship: 0.32, ...cam(ending() === "kaperna" ? WAY_CAM : SEA_CAM), ...kaperna("comes"),
    ...at("assol", ending() === "kaperna" ? WAY_HEAD : FROM_UP), assol_here: false, assol_turn: 120,
  });
  // … she comes down: the camera on her way (where all Kaperna waits it is on it already, and she stands at its head)
  const COMES_DOWN = () => ({ ...SAILS_SEEN(), ship: 0.62, ...cam(WAY_CAM), ...(ending() === "kaperna" && { assol_here: true }) });
  // "Secret"'s skiff under way: Letika at the oars on the forward thwart, Gray standing in the stern
  const CREW = () => ({
    letika_here: true, letika_turn: 90, letika_do: loop("seated"), letika_with: ["oars"],
    ...at("grey", SKIFF_MET), grey_on: "skiff_in#stern", grey_turn: 110, grey_look: "assol",
  });
  // … she at the water's edge, the ship coming to her anchor
  const AT_THE_EDGE = () => sails({
    ship: 0.8, ...cam(EDGE_CAM), ...kaperna("edge"), ...CREW(),
    ...at("assol", AT_EDGE), assol_turn: 60, assol_look: "ship",
  });
  // … she in the water to her knees, the skiff ten metres off
  const WADED = () => sails({
    ship: 1, boat: 0.8, ...cam(WADE_CAM), ...kaperna("waded"), ...CREW(),
    ...at("assol", IN_WATER), assol_turn: WAY, assol_look: "grey",
  });
  // … she in the skiff: Gray on the aft thwart, she in the stern before him — the ring on its cord over her dress, if
  // she kept it so; Letika at his oars
  const ABOARD = () => ({
    ...CREW(), grey_on: seat(0.9), grey_turn: 90, grey_do: loop("seated"),
    ...at("assol", SKIFF_MET), assol_on: seat(1.9), assol_turn: 270, assol_do: loop("seated"), assol_look: "grey",
    assol_with: [...held(scene), ...(scene.get("ring") === "cord" ? ["ring_cord"] : [])],
  });
  // the two of them from the side, against the bright water, the scarlet sails over them; Letika turned away to the ship
  const TWO = () => sails({ ship: 1, boat: 1, ...cam(TWO_CAM), ...ABOARD(), letika_turn: 270, letika_look: "ship" });
  // from the shore: the skiff already far, going back to the ship; who is left on the shore
  const LEFT = () => sails({ ship: 1, boat: 0.6, ...cam(WIDE_CAM), ...kaperna("away"), ...ABOARD() });
  // a pebble thrown from where she sits: the right hand out toward the water and back
  const toss = async (s, id, to) => {
    s.person(id).reach({ r: to });
    await s.wait(0.45);
    s.person(id).reach(null);
  };
  // off up the path and out of the frame, gone (a side job of its beat: a sequence, stopped with it)
  const leave = (s, id, pts, first) => s.sequence(async (q) => {
    await q.wait(first);
    await q.person(id).walk(pts);
    q.person(id).here(false);
  });
  return {
    // spark — dawn, out of the dark, the empty shore: far off on the horizon by the cape a scarlet spark kindles and
    // stands (the game's first touch is on it)
    spark: {
      from: () => ({ ...DAWN(), fade: 1 }),
      run: async (s) => {
        s.move("fade", 0, { over: 2, ease: "out" });
        await s.wait(2.2);
        await s.move("ship", 0.12, { over: 2.6, ease: "out" });
        s.tell("spark:lit");
        await s.wait(1.2);
      },
    },
    // prologue — the spark grows into a white ship under scarlet sails, far off
    prologue: {
      after: "spark",
      from: () => ({ ...DAWN(), ship: 0.12 }),
      run: async (s) => {
        s.tell("prologue:spark");
        await s.move("ship", 0.32, { over: 12, ease: "inOut" });
        await s.wait(2);
      },
    },
    // kids — evening: Assol, eight, runs along the sand with her yacht to the boats; the children turn, point, laugh;
    // the older girl steps out and beckons
    kids: {
      from: KIDS,
      run: async (s) => {
        const assol = s.person("assol"), boy = s.person("kid_boy"), girl = s.person("kid_girl"), small = s.person("kid_small");
        assol.gait("run");
        const run = assol.walk([[-1.6, 4.9], [-3.3, 6.6]]);
        await s.wait(0.5);
        small.look("assol");
        await s.wait(0.3);
        boy.look("assol");
        await s.wait(0.2);
        girl.look("assol");
        boy.turn(105);
        await s.wait(0.2);
        small.turn(115);
        girl.turn(120);
        await run;
        assol.gait(null);
        await assol.turn(300);
        assol.look("kid_boy");
        s.tell("kids:came");
        const laugh = boy.do("point_laugh");
        await s.wait(0.4);
        small.do("point_laugh");
        s.tell("kids:laugh");
        await laugh;
        await girl.walk([[-4.5, 7.4]]);
        await girl.turn(120);
        assol.look("kid_girl");
        await girl.do("beckon");
        s.tell("kids:beckon");
        await s.wait(0.6);
      },
    },
    // kids_hold — she stands with her yacht, the children wait (the game's choice)
    kids_hold: {
      after: "kids",
      from: MET,
      run: async (s) => {
        s.person("kid_boy").do("stand");
        await s.wait(0.4);
        s.person("kid_small").do("stand");
        await s.wait(0.6);
        s.person("kid_girl").look("assol#yacht");
        await s.wait(1);
      },
    },
    // alone — she goes down to the water and sets the yacht on the shallows at her feet; the children go off up the
    // path, the boy looks back and laughs
    alone: {
      after: "kids_hold",
      from: HELD,
      run: async (s) => {
        const assol = s.person("assol"), boy = s.person("kid_boy");
        // (the older girl turns away from the yacht as she goes)
        s.person("kid_girl").look(null);
        s.path(["camera_x", "camera_z", "camera_yaw"], [[-3.4, 3.3, -6], [-2.9, 1.6, 4]], { over: 3, ease: "inOut" });
        const gone = [
          leave(s, "kid_girl", UP, 0.6),
          leave(s, "kid_boy", UP.map(([a, d]) => [a - 0.6, d + 0.5]), 0.2),
          leave(s, "kid_small", UP.map(([a, d]) => [a + 0.5, d - 0.3]), 0.9),
        ];
        await s.wait(0.4);
        await assol.walk([AT_EDGE]);
        await assol.turn(90);
        assol.look(TOY);
        // (the boy, going, looks back at her and laughs)
        boy.look("assol");
        boy.do("point_laugh", { going: true });
        const put = assol.do("crouch_put");
        await s.wait(1);
        assol.with(null);
        s.set("toy_water", 1);
        s.tell("alone:toy-down");
        await put;
        boy.look(null);
        assol.look(OUT_TO_SEA);
        await s.all(gone);
        s.tell("alone:left");
      },
    },
    // play — the older girl takes Assol by the hand; they sit down by the boat and throw pebbles; Assol looks back at
    // the sea once
    play: {
      after: "kids_hold",
      from: HELD,
      run: async (s) => {
        const assol = s.person("assol"), boy = s.person("kid_boy"), girl = s.person("kid_girl"), small = s.person("kid_small");
        boy.do("stand");
        small.do("stand");
        small.look("kid_girl");
        boy.look("kid_girl");
        await s.wait(0.2);
        const come = girl.walk([[-3.85, 6.95]]);
        await s.wait(0.4);
        assol.look("kid_girl");
        await come;
        await girl.turn(120);
        girl.reach({ r: "assol#hand_l" });
        assol.reach({ l: "kid_girl#hand_r" });
        s.tell("play:hand");
        await s.wait(1);
        girl.reach(null);
        assol.reach(null);
        boy.turn(160);
        small.turn(200);
        await s.all(girl.go("sit_ground", { to: [-4.9, 7.6], turn: 180 }), assol.go("sit_ground", { to: [-4.1, 7.4], turn: 180 }));
        girl.do("hug_knees", { loop: true });
        await s.wait(0.2);
        assol.do("hug_knees", { loop: true });
        s.tell("play:sat");
        await s.wait(0.6);
        await toss(s, "kid_girl", [-4.4, 6.6, 0.9]);
        await s.wait(0.2);
        assol.look(OUT_TO_SEA);
        await s.wait(0.5);
        await toss(s, "assol", [-3.7, 6.5, 0.9]);
        await s.wait(0.4);
        assol.look("kid_girl");
        await s.wait(0.6);
      },
    },
    // tavern — chapter III, evening, the lantern lit, the tavern's camera: Gray at the table by the rail, Hin by him;
    // Philip by his cart. Hin nods aside, toward the slope where she lives (the game's lines on him)
    tavern: {
      from: TAVERN_EVENING,
      run: async (s) => {
        const grey = s.person("grey"), hin = s.person("hin"), filipp = s.person("filipp");
        await s.wait(2);
        s.tell("tavern:hin");
        await hin.do("nod_aside");
        hin.do("hands_hips", { loop: true });
        await s.wait(1);
        grey.look(KAPERNA);
        await s.wait(3);
        grey.look("hin");
        filipp.look("grey");
        await s.wait(1.5);
        hin.look(STONE);
        await s.wait(2.5);
        hin.look("grey");
        await s.wait(2);
      },
    },
    // past_mary — the past (a cut): winter, a blizzard, dusk, the same camera. Mary with her baby stands before the
    // door; Menners the elder in it shakes his head; she goes down the steps and off along the road to the left, into
    // the blizzard; the door shuts
    past_mary: {
      from: WINTER,
      run: async (s) => {
        const mary = s.person("mary"), menners = s.person("menners");
        await s.wait(1.2);
        s.tell("past_mary:door");
        await menners.do("shake_head");
        await s.wait(1);
        mary.look(null);
        mary.gait("baby_walk");
        await mary.walk([tv(3, -1.6), tv(3, -4.2)]);
        s.tell("past_mary:goes");
        const off = mary.walk([[15.6, ALONG_ROAD - 0.4], [9.5, ALONG_ROAD]]);
        await s.wait(0.6);
        menners.look(null);
        menners.turn(0);
        await s.move("tavern_door", 0, { over: 1.6, ease: "in" });
        menners.here(false);
        await off;
        mary.here(false);
        await s.wait(0.6);
      },
    },
    // past_storm — the past, a cut to the near shore (it makes its own cut: it follows past_mary in the game), the
    // storm: Longren stands at the water with his pipe, a coil of rope at his feet; out there the wind carries off a
    // boat, Menners on his knees in it waving; it goes away into the waves. He does not move.
    past_storm: {
      after: "past_mary",
      run: async (s) => {
        s.cut(STORM());
        const longren = s.person("longren"), menners = s.person("menners");
        await s.wait(1.5);
        const off = s.move("menners_boat", 1, { over: 13, ease: "in" });
        await s.wait(1.5);
        s.tell("past_storm:cry");
        await s.wait(6.5);
        s.tell("past_storm:gone");
        await off;
        menners.here(false);
        longren.look(OUT_TO_SEA);
        await s.wait(1.5);
      },
    },
    // tavern_back — the evening again, the tavern's camera (a cut): as they were; Philip has stepped from his cart
    // toward the veranda and stands (the game's touch on him)
    tavern_back: {
      from: ASKED,
      run: async (s) => {
        await s.wait(1);
        s.person("hin").look("filipp");
        await s.wait(1.5);
        s.tell("tavern_back:ready");
        await s.wait(1.5);
      },
    },
    // passing — along the road past the veranda, from the right to the left, goes Assol with her basket, looking at
    // no one; the three look after her; the ring on her hand — the two women by the nets reach out toward it. The
    // camera turns to where she comes from, then after her.
    passing: {
      after: "tavern_back",
      from: ASKED,
      run: async (s) => {
        const assol = s.person("assol"), grey = s.person("grey"), hin = s.person("hin"), filipp = s.person("filipp");
        const woman2 = s.person("woman2"), woman3 = s.person("woman3");
        const ring = s.get("ring") === "finger";
        assol.here(true);
        s.move("camera_yaw", 7, { over: 1.6, ease: "inOut" });
        woman2.look("assol");
        // (she sets off a moment after the beat begins, still out of the frame: a walk takes its pace from her legs as it
        // begins, and the look a cut gives her — seventeen — is on her from the frame after the cut)
        await s.wait(0.5);
        const by = assol.walk([[9.5, ALONG_ROAD]]);
        woman3.look("assol");
        if (ring) woman2.reach({ r: "assol#ring" });
        await s.wait(0.7);
        hin.look("assol");
        s.tell("passing:assol");
        if (ring) woman3.reach({ r: "assol#ring" });
        await s.wait(1);
        grey.look("assol");
        s.move("camera_yaw", -5, { over: 6, ease: "inOut" });
        await s.wait(1.2);
        filipp.look("assol");
        await s.wait(1.6);
        woman2.reach(null);
        woman3.reach(null);
        await by;
        assol.here(false);
      },
    },
    // grey_close — (close) from behind Gray (it makes its own cut: it follows passing in the game): he has risen and
    // stands at the rail; over his shoulder the road and her small figure going away along it
    grey_close: {
      after: "passing",
      run: async (s) => {
        s.cut(BEHIND_GREY());
        // (a moment after the cut, as in passing: her pace is her own legs')
        await s.wait(0.3);
        await s.person("assol").walk([[-13, ALONG_ROAD + 0.2]]);
      },
    },
    // grey_shore — dusk, the scene's own camera: Gray alone at the water; the skiff on the sand; Longren by his boat;
    // his window lit on the slope — Gray looks out to sea, then up at it (the game's choice: the skiff or Longren)
    grey_shore: {
      from: DUSK,
      run: async (s) => {
        const grey = s.person("grey");
        await s.wait(1.5);
        s.tell("grey_shore:alone");
        await s.wait(2.5);
        grey.look("lit_windows#longren_window");
        await s.wait(2);
      },
    },
    // to_skiff — he goes to the skiff and lays his hand on its side; behind his back the window on the slope goes out
    to_skiff: {
      after: "grey_shore",
      from: DUSK,
      run: async (s) => {
        const grey = s.person("grey");
        await s.wait(1.2);
        grey.look("skiff");
        await grey.walk([AT_SKIFF]);
        await grey.turn(100);
        grey.look(OUT_TO_SEA);
        grey.reach({ l: ON_SKIFF });
        await s.wait(0.8);
        await s.move("longren_window", 0, { over: 1.5 });
        s.tell("to_skiff:dark");
        await s.wait(1.5);
      },
    },
    // longren_boat — he goes to the boats, round the bow of the skiff on the sand; Longren lays his palm on the coil of net on the keel, turns to him; they
    // stand facing (the game's lines); at the end Longren turns his head toward the road, where Philip's cart is
    longren_boat: {
      after: "grey_shore",
      from: DUSK,
      run: async (s) => {
        const grey = s.person("grey"), longren = s.person("longren");
        grey.look("longren");
        // (the camera comes after him, not past him: it reaches the boats a little after he does — he is whole in the
        // frame all the way)
        s.path(["camera_x", "camera_z", "camera_yaw"], [Object.values(SHORE_CAM), Object.values(BOATS_CAM)], { over: 12, ease: "inOut" });
        const come = grey.walk([[-7.6, 8.2], [-11.4, 10.0], [-11.6, 12.0], MEETS]);
        await come.ending(4);
        longren.reach({ l: "net" });
        await come.ending(2.2);
        longren.look("grey");
        longren.reach(null);
        await longren.turn(95);
        await come;
        await grey.turn(265);
        s.tell("longren_boat:met");
        await s.wait(8);
        longren.look(CART);
        await s.wait(1.5);
      },
    },
    // girl — chapter IV, evening: Assol, seventeen, on the upturned boat with the yacht in her lap; a little girl comes
    // up, stops and looks at it (the game's choice)
    girl: {
      from: BOATSIDE,
      run: async (s) => {
        const assol = s.person("assol"), girl = s.person("girl");
        await s.wait(0.4);
        const come = girl.walk([[-6.8, 8.6], [-4.75, 7.85]]);
        await come.ending(1.2);
        assol.look("girl");
        await come;
        await girl.turn(250);
        girl.look("assol#yacht");
        s.tell("girl:came");
        await s.wait(0.5);
      },
    },
    // give — she holds out the yacht; the girl takes it and runs off up the path holding it high over her head: scarlet
    // going into the village
    give: {
      after: "girl",
      from: GIRL_CAME,
      run: async (s) => {
        const assol = s.person("assol"), girl = s.person("girl");
        assol.reach({ r: [-5.05, 8.0, 0.85], l: [-5.15, 8.1, 0.85] });
        await s.wait(0.8);
        girl.reach({ r: [-5.0, 7.95, 0.86], l: [-5.1, 8.05, 0.86] });
        await s.wait(0.8);
        assol.with(held(scene));
        girl.with(["yacht"]);
        girl.look("girl#yacht");
        s.tell("give:given");
        await s.wait(0.6);
        assol.reach(null);
        girl.reach(null);
        girl.look(null);
        await s.wait(0.2);
        girl.gait("run_high");
        const off = girl.walk(UP);
        await s.wait(0.2);
        assol.look("girl");
        await off;
        girl.here(false);
        s.tell("give:gone");
        await s.wait(1);
      },
    },
    // keep — she keeps it; the girl goes off to her mother by the nets, looking back
    keep: {
      after: "girl",
      from: GIRL_CAME,
      run: async (s) => {
        const girl = s.person("girl"), mother = s.person("mother");
        await s.wait(0.4);
        girl.look("assol");
        await s.wait(0.6);
        mother.look("girl");
        await s.wait(0.2);
        const off = girl.walk([[NETS[0] + 0.7, NETS[1] - 0.4]]);
        await off.ending(2.4);
        girl.look("assol");
        s.tell("keep:looks-back");
        await off.ending(1);
        girl.look("mother");
        await off;
        await s.wait(1);
      },
    },
    // longren_goes — sunset: Longren, his sea chest on his shoulder, goes off along the shore toward the Liss road;
    // Assol by the boat; he turns and lifts his hand
    longren_goes: {
      from: GOES,
      run: async (s) => {
        const assol = s.person("assol"), longren = s.person("longren");
        await s.wait(0.6);
        longren.gait("carry_chest");
        const off = longren.walk([[-8.5, 10.6], [-13.2, 14.6]]);
        await s.wait(0.2);
        assol.look("longren");
        await off;
        longren.gait(null);
        await longren.turn(125);
        longren.look("assol");
        await s.wait(0.4);
        s.tell("longren_goes:wave");
        await longren.do("wave");
        await s.wait(1.5);
      },
    },
    // wait — night: Assol on the stone at the water's edge, her arms round her knees, looking out to sea; three lights
    // on the horizon, the cape in mist (the game's «Waiting»: it offers the lights — `light1#light`…, moves `light1`…
    // `light3` — and puts out the windows of Kaperna, `windows`)
    wait: {
      from: NIGHT,
      run: async (s) => {
        await s.wait(3);
      },
    },
    // wait_lights — the showcase's only (in a game it is «Waiting»): each light looked into in turn — it comes near and is
    // a fishing boat with a lantern, a steamer under her smoke, the lighthouse as the mist on the cape parts — and goes
    // off behind the cape; the windows of Kaperna go out by quarters
    wait_lights: {
      after: "wait",
      run: async (s) => {
        const quarter = s.get("windows") / 4;
        let lit = s.get("windows");
        for (const light of ["light1", "light2", "light3"]) {
          await s.move(light, 1, { over: 4 });
          await s.wait(1.5);
          s.move(light, 2, { over: 5 });
          lit = Math.max(0.1, lit - quarter);
          s.move("windows", lit, { over: 3 });
        }
        await s.wait(5);
      },
    },
    // grey_dawn — the night passes into the first grey light, her head down on her knees; then she gets down and
    // goes home, the camera turning after her
    grey_dawn: {
      after: ["wait", "wait_lights"],
      from: () => ({ ...NIGHT(), light1: 2, light2: 2, light3: 2 }),
      run: async (s) => {
        const assol = s.person("assol");
        assol.do("head_on_knees", { loop: true });
        assol.look(null);
        s.move("windows", 0.1, { over: 5 });
        await s.move("hour", 1, { over: 2, ease: "in" });
        s.set("hour", 0);
        await s.move("hour", 0.215, { over: 5, ease: "out" });
        s.tell("grey_dawn:light");
        await s.wait(0.8);
        assol.look(KAPERNA);
        await s.wait(0.4);
        await assol.turn(300);
        assol.on(null);
        await assol.do("hop_down");
        s.move("camera_yaw", -4, { over: 5, ease: "inOut" });
        await assol.walk([[-4.2, 6.6], [-9.0, 10.4], [-16, 17.5], [-19.5, 20]]);
        assol.here(false);
        s.tell("grey_dawn:home");
      },
    },
    // dawn_two — where she waited (the ending `waited`), that morning (`morning`: its hour): Longren and Assol stand
    // together at the very edge, seen from behind; on the horizon by the cape the scarlet point kindles and rises; she
    // turns to her father (the game's lines on them)
    dawn_two: {
      from: DAWN_TWO,
      run: async (s) => {
        const assol = s.person("assol"), longren = s.person("longren");
        await s.wait(2);
        await s.move("ship", 0.12, { over: 2.5, ease: "out" });
        s.tell("dawn_two:spark");
        const rises = s.move("ship", 0.32, { over: 9, ease: "inOut" });
        assol.look("ship");
        await s.wait(0.6);
        longren.look("ship");
        await s.wait(1.6);
        assol.look("longren");
        await assol.turn(300);
        s.tell("dawn_two:turns");
        await s.wait(0.5);
        longren.look("assol");
        await s.wait(4);
        assol.look("ship");
        await rises;
      },
    },
    // sails_far — the morning (`morning`: its hour): round the cape comes the white ship under scarlet sails. Where
    // all Kaperna knows (`ending` kaperna), it already stands on the shore in two groups, looking
    sails_far: {
      from: SAILS_SEEN,
      run: async (s) => {
        await s.move("ship", 0.62, { over: 10, ease: "inOut" });
        s.tell("sails_far:seen");
      },
    },
    // run — Assol comes down to the water and stops at its very edge, looking at the ship as she comes on; the camera
    // turns to her way, then goes with her. Kaperna along her way stands and looks (`ending` grin: two whisper); or
    // (cry) the fishermen and the women wave, the three children run with her, before them the little girl with the
    // yacht held high (`girl_toy`); or (kaperna) she walks down between the two groups
    run: {
      after: "sails_far",
      from: COMES_DOWN,
      run: async (s) => {
        const assol = s.person("assol"), cry = ending() === "cry";
        const there = ["fisher1", "fisher2", "mother", "woman2", "woman3", "filipp", "kid_boy", "kid_girl", "kid_small", "longren"].filter((id) => s.get(`${id}_here`));
        // a child running down after her (or before her), to stop at the edge and look at the ship
        const runs = (id, first, gait, to) => s.sequence(async (q) => {
          const child = q.person(id);
          await q.wait(first);
          child.here(true);
          child.gait(gait);
          await child.walk([...DOWN, to]);
          child.gait(null);
          await child.turn(TO_SHIP);
        });
        const come = s.move("ship", 0.8, { over: 10, ease: "inOut" });
        s.move("camera_yaw", WAY_CAM[2], { over: 2.2, ease: "inOut" });
        const children = cry ? [
          ...(s.get("girl_toy") === 1 ? [runs("girl", 0, "run_high", GIRL_EDGE)] : []),
          ...["kid_girl", "kid_boy", "kid_small"].map((id, i) => runs(id, 1.2 + 0.5 * i, "run", KIDS_EDGE[i])),
        ] : [];
        await s.wait(0.6);
        assol.here(true);
        assol.gait(ending() === "kaperna" ? null : "run");
        const down = assol.walk([...DOWN, AT_EDGE]);
        for (const id of there) {
          await s.wait(0.3);
          s.person(id).look("assol");
          if (cry && id !== "filipp" && id !== "longren") s.person(id).do("wave");
        }
        await down.ending(4.5);
        s.path(["camera_x", "camera_z", "camera_yaw"], [WAY_CAM, EDGE_CAM], { over: 4, ease: "inOut" });
        await down.ending(1.5);
        assol.look("ship");
        await down;
        assol.gait(null);
        await assol.turn(60);
        s.tell("run:at-the-edge");
        for (const id of there) s.person(id).look("ship");
        await come;
        await s.all(children);
        await s.wait(1);
      },
    },
    // shore — the ship comes to her anchor; the skiff sets out from her — far off, one sitting at the oars, one
    // standing; Assol walks into the water to her knees, the camera going with her. Longren, if he was at home, comes
    // down and stops by the boats; where she waited with him — two or three far off on the slope
    shore: {
      after: "run",
      from: AT_THE_EDGE,
      run: async (s) => {
        const assol = s.person("assol");
        put(s, CREW());
        if (ending() === "waited") put(s, kaperna("edge"));
        s.move("hour", scene.get("morning"), { over: 6 });
        const home = father() === "home" ? s.sequence(async (q) => {
          const longren = q.person("longren");
          longren.here(true);
          await longren.walk([DOWN[0], DOWN[1], LONGREN_BOATS]);
          await longren.turn(TO_SHIP);
          longren.look("skiff");
        }) : null;
        assol.look("ship");
        await s.move("ship", 1, { over: 4.5, ease: "out" });
        s.tell("shore:anchor");
        await s.wait(0.8);
        const pull = s.move("boat", 0.8, { over: 8, ease: "inOut" });
        s.tell("shore:boat");
        await s.wait(1.5);
        s.path(["camera_x", "camera_z", "camera_yaw"], [[s.get("camera_x"), s.get("camera_z"), s.get("camera_yaw")], WADE_CAM], { over: 5, ease: "inOut" });
        await assol.walk([IN_WATER]);
        await assol.turn(WAY);
        assol.look("grey");
        s.tell("shore:water");
        await pull;
        await home;
        await s.wait(0.5);
      },
    },
    // hands — the skiff comes up to her; Gray in its stern holds out his hand; a cut into the insert `hands` (the
    // world's closeups, the shot "boat": his hand out of the skiff, hers on its way to it — the game's «Hand» moves
    // `reach`)
    hands: {
      after: "shore",
      from: WADED,
      run: async (s) => {
        const assol = s.person("assol"), grey = s.person("grey");
        const close = s.shot({ hands: 1, reach: 0 });
        const up = s.move("boat", 1, { over: 2.4, ease: "out" });
        await up.ending(1.2);
        assol.turn(WAY + 270);
        grey.turn(90);
        grey.reach({ r: OFFERED });
        assol.look("grey#hand_r");
        await up;
        await s.wait(0.5);
        await s.until(() => close.ready);
        close.cut();
        s.tell("hands:close");
        await s.wait(1);
      },
    },
    // hands_reach — the showcase's only (in a game it is «Hand»): her hand goes to his
    hands_reach: {
      after: "hands",
      run: async (s) => {
        await s.move("reach", 1, { over: 4, ease: "inOut" });
        await s.wait(1);
      },
    },
    // meet — a cut (it makes its own: it follows hands in the game): she is in the skiff already, in the stern before
    // him. From the side, a middle shot: two profiles against the bright water, the scarlet sails over them (the game's
    // lines); their hands meet; she looks back at Kaperna, then at him
    meet: {
      after: "hands",
      run: async (s) => {
        s.cut(TWO());
        const assol = s.person("assol"), grey = s.person("grey");
        await s.wait(1.5);
        s.tell("meet:boat");
        await s.wait(1);
        grey.reach({ r: "assol#hand_l" });
        assol.reach({ l: "grey#hand_r" });
        await s.wait(5.5);
        assol.look(KAPERNA);
        await s.wait(2.5);
        assol.look("grey");
        await s.wait(3);
      },
    },
    // away — a cut to the shore (its own: it follows meet in the game), the wide shot: the skiff already far, going
    // back to the ship; who is left stands looking after it — one lifts a hand (Longren if he is here; where Kaperna
    // wept without him, Philip; where it grinned, no one); the little girl holds the yacht up over her head
    away: {
      after: "meet",
      run: async (s) => {
        s.cut(LEFT());
        const off = s.move("boat", 0.3, { over: 13, ease: "inOut" });
        await s.wait(3.5);
        s.tell("away:wave");
        if (waver()) await s.person(waver()).do("wave");
        await off;
      },
    },
  };
}
const SHOWCASE = ["spark", "prologue", "kids", "kids_hold", "alone", "tavern", "past_mary", "past_storm", "tavern_back", "passing", "grey_close",
  "grey_shore", "longren_boat", "girl", "give", "longren_goes", "wait", "wait_lights", "grey_dawn", "dawn_two", "sails_far", "run", "shore", "hands",
  "hands_reach", "meet", "away"];

return {
  HORIZON, SEA, SKY, shipAt, sea, seaMotion, mist, mistMotion, HILL, TERRACES, WALL, faceAt, ground, D, RISE, houses, WINDOW_NAMES, sand, hillside, boat,
  snowMotion, WALLS, TAVERN_WINDOWS, TAVERN_DOOR, TAVERN_LAMP, tavernFront, tavernEnd, tavernRoof, boards, rail, verandaFront, steps, trestle, tavernShore,
  cart, nets, coil, doorFacing, mennersAt, skiffAt, lightAt, lightMotion, steamOf, lampLit, capeMist, capeBank, capeMistMotion,
  film, SHOWCASE,
};
