const L = e.lib;

// Kaperna: houses made for the slope, standing on the hill (the relief) where they are — each block
// a part of this element at its own place (e.part), on the ground there: blocks step down toward
// the sea, each on its own floor, on a stone plinth down to the ground where it falls away. The side
// to the sea is seen obliquely (D deep, rising RISE). Roofs: a gable, a shed rising to the sea, or
// flat with a terrace rail. The anchor: 40 m left, 200 m ahead.
const AX = L.HILL.across;
const AZ = 200;
const D = L.D;
const RISE = L.RISE;
const WALL = "#e2e5e5";
const SEA_SIDE = "#f1f2f0";
const ROOF = "#6c7782";
const STONE = "#8b9297";
const GLASS = "#47525d";

// a block as two clean faces and its roof, in the part's metres (from its foot — the ground at its
// left front corner)
function block(g, b, floor) {
  const w = b.w;
  const top = floor + b.h;
  const rise = b.roof === "shed" ? 1.3 : 0;
  g.fillStyle = WALL;
  g.beginPath();
  g.moveTo(0, -floor);
  g.lineTo(0, -top);
  g.lineTo(w, -top - rise);
  g.lineTo(w, -floor);
  g.fill();
  g.fillStyle = SEA_SIDE;
  g.beginPath();
  g.moveTo(w, -floor);
  g.lineTo(w, -top - rise);
  g.lineTo(w + D, -top - rise - RISE);
  g.lineTo(w + D, -floor - RISE);
  g.fill();
  g.fillStyle = ROOF;
  if (b.roof === "gable") {
    const r = w * 0.42;
    g.beginPath();
    g.moveTo(w / 2, -top - r);
    g.lineTo(w / 2 + D, -top - r - RISE);
    g.lineTo(w + D + 0.25, -top - RISE + 0.2);
    g.lineTo(w + 0.25, -top + 0.2);
    g.fill();
    g.fillStyle = WALL;
    g.beginPath();
    g.moveTo(0, -top);
    g.lineTo(w / 2, -top - r);
    g.lineTo(w, -top);
    g.fill();
    g.strokeStyle = ROOF;
    g.lineWidth = 0.3;
    g.beginPath();
    g.moveTo(-0.25, -top + 0.2);
    g.lineTo(w / 2, -top - r);
    g.lineTo(w + 0.25, -top + 0.2);
    g.stroke();
  } else {
    g.beginPath();
    g.moveTo(-0.2, -top);
    g.lineTo(w, -top - rise);
    g.lineTo(w + D + 0.2, -top - rise - RISE);
    g.lineTo(w + D + 0.2, -top - rise - RISE + 0.3);
    g.lineTo(w, -top - rise + 0.3);
    g.lineTo(-0.2, -top + 0.3);
    g.fill();
  }
  if (b.roof === "flat") {
    g.fillStyle = "rgba(108,119,130,0.8)";
    g.fillRect(0.3, -top - 1, w + D * 0.6, 0.08);
    for (let x = 0.3; x <= w + D * 0.6; x += 1.5) g.fillRect(x, -top - 1, 0.07, 1);
  }
}

// each block on its plinth, its windows dark — the lit ones are the `lit_windows` element's
for (const p of L.houses(e)) {
  e.part(p.X - AX, p.Z - AZ, (g) => {
    g.fillStyle = STONE;
    g.beginPath();
    g.moveTo(0, -p.floor);
    for (let x = 0; x <= p.b.w + L.D; x += 0.5) g.lineTo(x, -(e.ground(p.X + x, p.Z) - p.g0) + 0.3);
    g.lineTo(p.b.w + L.D, -p.floor - L.RISE);
    g.closePath();
    g.fill();
    block(g, p.b, p.floor);
    g.fillStyle = GLASS;
    for (const [x, y, w, h] of p.windows) g.fillRect(x - w / 2, y - h / 2, w, h);
    if (p.longren) e.at(p.b.w / 2, -p.floor - p.b.h, "longren_house");
  }, p.box);
}

// the terraces' walls: stone faces under each shelf's edge, from the face below it up to the shelf
for (const [x0, x1, level] of L.TERRACES) {
  const X0 = AX + x0;
  const Z = L.faceAt((x0 + x1) / 2, level - L.WALL) - 0.2;
  const g0 = e.ground(X0, Z);
  const top = -(L.SEA + level - g0);
  e.part(X0 - AX, Z - AZ, (g) => {
    g.fillStyle = STONE;
    g.beginPath();
    g.moveTo(0, top);
    g.lineTo(x1 - x0, top);
    for (let x = x1 - x0; x >= 0; x -= 1) g.lineTo(x, -(e.ground(X0 + x, Z) - g0));
    g.closePath();
    g.fill();
    g.fillStyle = "#c4c8c8";
    g.fillRect(0, top - 0.1, x1 - x0, 0.2);
  }, [-0.5, top - 1, x1 - x0 + 0.5, 4]);
}
