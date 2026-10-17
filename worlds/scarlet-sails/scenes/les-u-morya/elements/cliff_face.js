const L = e.lib;
const A = e.anim;
const H = L.HEAD;

// The headland's cliff: its face of pale stone over the cove and the sea, standing on the land's edge
// (its anchor at the headland's top; x — `a`, along the edge, from its end in the sea to where its
// side becomes a slope; y — down from the top). Its top edge is the relief's height on the edge; it
// goes down below the water. Blocks of stone parted by joints, each a little its own tone, layers
// across them, ledges, rain streaks from the top, the turf's lip, the sea's damp at its foot.
const top = (x) => L.TOP - L.headTop(x);
const x0 = H.end;
const x1 = H.rise + 17;
const y1 = L.TOP - H.foot;
const face = () => {
  g.beginPath();
  g.moveTo(x0, y1);
  for (let x = x0; x <= x1; x += 0.25) g.lineTo(x, top(x));
  g.lineTo(x1, y1);
  g.closePath();
};
face();
g.fillStyle = "#dad8d0";
g.fill();
g.save();
face();
g.clip();
// blocks: columns of stone between joints
let x = x0;
for (let i = 0; x < x1; i++) {
  const w = 1.4 + 2.8 * A.hash(i, 1);
  const tone = A.hash(i, 2);
  g.fillStyle = tone < 0.5 ? `rgba(160,158,150,${0.05 + 0.12 * tone})` : `rgba(246,245,240,${0.1 + 0.3 * (tone - 0.5)})`;
  g.fillRect(x, 0, Math.min(w, x1 - x), y1);
  g.fillStyle = `rgba(150,148,140,${0.06 * A.hash(i, 9)})`;
  const band = Math.min(top(x) + 2 + 4 * A.hash(i, 10), y1 - 1);
  g.fillRect(x, band, Math.min(w, x1 - x), Math.min(1 + 3 * A.hash(i, 11), y1 - band));
  // the joint at its right: a thin dark crack wandering down, broken, not always to the foot
  const from = top(x + w) + 0.2 + 2 * A.hash(i, 3);
  const to = Math.min(from + 2 + (y1 - from) * A.hash(i, 4), y1);
  g.strokeStyle = `rgba(120,118,112,${0.2 + 0.25 * A.hash(i, 5)})`;
  g.lineWidth = 0.03 + 0.05 * A.hash(i, 5);
  g.beginPath();
  let cx = Math.min(x + w, x1);
  g.moveTo(cx, from);
  for (let y = from, k = 0; y < to; y += 0.5 + 0.7 * A.hash(i * 31 + k, 6), k++) {
    cx += (A.hash(i * 31 + k, 7) - 0.5) * 0.5;
    if (A.hash(i * 31 + k, 8) < 0.15) g.moveTo(cx, y);
    else g.lineTo(cx, y);
  }
  g.stroke();
  x += w;
}
// layers across the face, gently wavy; two ledges with their shade under them
for (let j = 0; j < 9; j++) {
  const y = 1.2 + j * 1.35 + 0.5 * A.hash(j, 7);
  g.strokeStyle = `rgba(150,148,140,${0.12 + 0.12 * A.hash(j, 8)})`;
  g.lineWidth = 0.04 + 0.08 * A.hash(j, 9);
  g.beginPath();
  for (let xx = x0; xx <= x1; xx += 1) g.lineTo(xx, y + 0.25 * Math.sin(xx * 0.17 + j) + 0.2 * A.noise(xx * 0.3, j));
  g.stroke();
}
for (const [y, k] of [[3.4, 0], [7.9, 1]]) {
  g.fillStyle = "rgba(248,247,242,0.45)";
  g.fillRect(x0, y - 0.08, x1 - x0, 0.08);
  const sh = g.createLinearGradient(0, y, 0, y + 0.6);
  sh.addColorStop(0, "rgba(120,118,112,0.28)");
  sh.addColorStop(1, "rgba(120,118,112,0)");
  g.fillStyle = sh;
  g.fillRect(x0, y, x1 - x0, 0.6 + 0.1 * k);
}
// rain streaks down from the top
for (let i = 0; i < 40; i++) {
  const sx = x0 + A.hash(i, 10) * (x1 - x0);
  const len = Math.min(1 + 4 * A.hash(i, 11), y1 - top(sx));
  const st = g.createLinearGradient(0, top(sx), 0, top(sx) + len);
  st.addColorStop(0, "rgba(150,150,144,0.22)");
  st.addColorStop(1, "rgba(150,150,144,0)");
  g.fillStyle = st;
  g.fillRect(sx, top(sx), 0.12 + 0.25 * A.hash(i, 12), len);
}
// the sea's damp at its foot
const damp = g.createLinearGradient(0, y1 - 1.6, 0, y1);
damp.addColorStop(0, "rgba(130,140,146,0)");
damp.addColorStop(1, "rgba(130,140,146,0.5)");
g.fillStyle = damp;
g.fillRect(x0, y1 - 1.6, x1 - x0, 1.6);
// the turf's lip along the top, and the crumbling earth under it
g.fillStyle = "rgba(170,166,154,0.5)";
g.beginPath();
for (let xx = x0; xx <= x1; xx += 0.25) g.lineTo(xx, top(xx) + 0.3 + 0.15 * A.hash(Math.round(xx * 4), 13));
for (let xx = x1; xx >= x0; xx -= 0.25) g.lineTo(xx, top(xx));
g.closePath();
g.fill();
g.fillStyle = "#b9bfaa";
g.beginPath();
for (let xx = x0; xx <= x1; xx += 0.25) g.lineTo(xx, top(xx) + 0.12 + 0.1 * A.hash(Math.round(xx * 4), 14));
for (let xx = x1; xx >= x0; xx -= 0.25) g.lineTo(xx, top(xx));
g.closePath();
g.fill();
g.restore();
