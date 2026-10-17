// The snowfield seen from above: the road from the lower left to the crossing and on to the village, the track
// aslant before the people and away in a curve to the forest, the planks of the crossing. Metres; y toward the viewer.
const L = e.lib;
const CX = 50;
const CD = 680;
const W = 1900;
const D = 1440;
const X = a => a - CX;
const Y = d => CD - d;

// snow
g.fillStyle = '#e7edf5';
g.fillRect(-W / 2, -D / 2, W, D);
// drifts and wind-combed patches, a little bluer or whiter
for (let i = 0; i < 90; i++) {
  const a = -70 + e.rnd() * 190;
  const d = 1 + e.rnd() * e.rnd() * 170;
  g.fillStyle = i % 3 === 0 ? 'rgba(206,216,232,0.55)' : 'rgba(252,253,255,0.6)';
  g.beginPath();
  g.ellipse(X(a), Y(d), 1.5 + e.rnd() * (3 + d * 0.08), 0.4 + e.rnd() * (0.8 + d * 0.02), (e.rnd() - 0.5) * 0.5, 0, Math.PI * 2);
  g.fill();
}

const line = pts => {
  g.beginPath();
  pts.forEach(([a, d], i) => (i ? g.lineTo(X(a), Y(d)) : g.moveTo(X(a), Y(d))));
};

// the road: packed snow, two ruts
g.lineJoin = 'round';
g.lineCap = 'round';
line(L.ROAD);
g.strokeStyle = '#d4d4d2';
g.lineWidth = L.ROAD_W;
g.stroke();
g.strokeStyle = '#bdbbb5';
g.lineWidth = 2.3;
g.stroke();
g.strokeStyle = '#d0d0cd';
g.lineWidth = 1.2;
g.stroke();

// the track: the snowy ballast, the sleepers near, the two rails
const P = L.PATH.pts;
const S = L.PATH.S;
line(P);
g.strokeStyle = '#a7a9ae';
g.lineWidth = 4.4;
g.stroke();
g.strokeStyle = '#8e9095';
g.lineWidth = 2.9;
g.stroke();

const near0 = L.S_CROSS - 120;
const near1 = L.PATH.length;
g.beginPath();
for (let s = near0; s < near1; s += 0.55) {
  const p = L.at(s);
  const nx = -p.dd * 1.35;
  const nd = p.da * 1.35;
  g.moveTo(X(p.a + nx), Y(p.d + nd));
  g.lineTo(X(p.a - nx), Y(p.d - nd));
}
g.strokeStyle = '#4c443d';
g.lineWidth = 0.2;
g.lineCap = 'butt';
g.stroke();

// the crossing's planks between and beside the rails, where the road goes over
const c = L.at(L.S_CROSS);
g.save();
g.translate(X(c.a), Y(c.d));
g.rotate(Math.atan2(-c.dd, c.da));
g.fillStyle = '#6d6356';
g.fillRect(-2.8, -1.05, 5.6, 0.62);
g.fillRect(-2.8, -0.28, 5.6, 0.56);
g.fillRect(-2.8, 0.43, 5.6, 0.62);
g.fillStyle = 'rgba(236,240,246,0.7)';
g.fillRect(-2.8, -1.05, 1.6, 2.1);
g.fillRect(1.4, -0.5, 1.4, 1.2);
g.restore();

const rail = side => {
  g.beginPath();
  for (let i = 0; i < P.length - 1; i++) {
    const p = L.at(S[i]);
    const a = p.a - p.dd * side;
    const d = p.d + p.da * side;
    if (i) g.lineTo(X(a), Y(d));
    else g.moveTo(X(a), Y(d));
  }
  g.strokeStyle = '#646971';
  g.lineWidth = 0.08;
  g.stroke();
};
rail(0.76);
rail(-0.76);
