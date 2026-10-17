// The ground, seen from above and draped over the land (relief): the forest floor, the trail wandering the
// whole way, the embankment's ballast with its sleepers and rails ending, the stream's muddy channel, the
// beaten earth of the clearing going down sandy to the river.
const L = e.lib;
const P = L.plan;
const ax = 5; // the plane's across
const zc = 43.5; // its distance
const X = across => across - ax;
const Y = d => zc - d;
const h = e.anim.hash;
const n = e.anim.noise;

// the forest floor: earth and old leaves, broad soft patches of moss and of bare earth
g.fillStyle = '#56603e';
g.fillRect(X(-135), Y(86), 280, 85);
for (let i = 0; i < 90; i++) {
  const r = 4 + 9 * h(i, 4);
  L.glow(g, X(-135 + 280 * h(i, 1)), Y(85 * h(i, 2)), r, h(i, 3) < 0.5 ? '#3c4a2c' : '#6e6446', 0.5, 0.7);
}

// the clearing: short grass and beaten earth, its near edge before the viewer, curving off into the forest
// on its left
const C = P.clearing;
g.fillStyle = '#7e7a56';
g.beginPath();
for (let a = C.from - 4; a <= C.to + 12; a += 2) g.lineTo(X(a), Y(7 + 2 * n(a / 9, 3) + Math.max(0, C.from + 4 - a) * 0.8));
for (let a = C.to + 12; a >= C.from - 4; a -= 2) g.lineTo(X(a), Y(L.bank(a) + 1));
g.closePath();
g.fill();
// the shore: sand going down to the water
g.fillStyle = '#a89c84';
g.beginPath();
for (let a = 10; a <= 145; a += 1) g.lineTo(X(a), Y(L.bank(a) - 3.6 - 0.6 * n(a / 5, 9)));
for (let a = 145; a >= 10; a -= 1) g.lineTo(X(a), Y(L.bank(a) + 1));
g.closePath();
g.fill();

// the trail: packed earth wandering along, its edges ragged with grass
const T = P.trail;
const edge = (a, side) => L.trail(a) + side * (T.w / 2 + 0.25 * n(a / 1.7, side + 7));
g.fillStyle = '#8e7a58';
g.beginPath();
for (let a = -135; a <= 145; a += 0.5) g.lineTo(X(a), Y(edge(a, 1)));
for (let a = 145; a >= -135; a -= 0.5) g.lineTo(X(a), Y(edge(a, -1)));
g.closePath();
g.fill();
g.fillStyle = 'rgba(150,130,96,0.6)';
g.beginPath();
for (let a = -135; a <= 145; a += 0.5) g.lineTo(X(a), Y(L.trail(a) + 0.35));
for (let a = 145; a >= -135; a -= 0.5) g.lineTo(X(a), Y(L.trail(a) - 0.35));
g.closePath();
g.fill();

// the embankment: ballast, sleepers, and the two rails stopping short where the work stopped
const R = P.rails;
g.fillStyle = '#7e7466';
g.fillRect(X(-135), Y(R.d + 3), R.end + 135 + 3, 6);
g.fillStyle = '#4e4034';
for (let a = -135; a < R.end; a += 0.7) g.fillRect(X(a), Y(R.d + 1.3), 0.22, 2.6);
g.fillStyle = '#34343a';
for (const off of [-0.72, 0.72]) g.fillRect(X(-135), Y(R.d + off) - 0.04, R.end + 135 - 0.5, 0.08);
// sleepers lying ready beyond the end
for (let k = 0; k < 6; k++) g.fillRect(X(R.end + 2 + k * 0.5), Y(R.d + 3.5 + h(k, 21)), 2.6, 0.22);

// the stream's channel, its banks and bed muddy, along its way
const S = P.stream;
g.fillStyle = '#4a4434';
g.beginPath();
for (let d = 1.5; d <= S.to; d += 0.5) g.lineTo(X(L.stream(d) - S.w * 0.8), Y(d));
for (let d = S.to; d >= 1.5; d -= 0.5) g.lineTo(X(L.stream(d) + S.w * 0.8), Y(d));
g.closePath();
g.fill();

