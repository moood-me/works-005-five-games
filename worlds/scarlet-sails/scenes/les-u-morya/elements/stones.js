const L = e.lib;
const A = e.anim;

// Stones in the stream and on its banks, more on the fall: each a part where it lies — a rounded,
// uneven boulder, only what is above the water (the water's mirror shows it again); the anchor
// 15 m ahead. `stream` — the stone by the near bank where a small boat is put on the water.
const AZ = 15;
for (const [X, Z, r, n] of L.STONES) {
  const g0 = e.ground(X, Z);
  const top = r * (0.6 + 0.4 * A.hash(n, 1));
  const wet = Math.max(0, L.water(Z) - g0);
  if (wet >= top * 0.9) continue;
  const wide = r * (1.1 + 0.4 * A.hash(n, 2));
  e.part(X, Z - AZ, (g) => {
    g.save();
    g.beginPath();
    g.rect(-wide * 1.2, -top - 0.1, wide * 2.4, top + 0.1 - wet);
    g.clip();
    g.fillStyle = "#a8aaa5";
    g.beginPath();
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      const k = 0.85 + 0.25 * A.hash(n * 9 + i, 3);
      g.lineTo(Math.cos(a) * wide * k, Math.sin(a) * top * k);
    }
    g.closePath();
    g.fill();
    g.fillStyle = "#bdbfba";
    g.beginPath();
    g.ellipse(-wide * 0.25, -top * 0.62, wide * 0.45, top * 0.28, -0.15, 0, 7);
    g.fill();
    g.restore();
  }, [-wide * 1.3, -top * 1.3 - 0.1, wide * 1.3, 0.05]);
}
const [sx, sz] = [L.streamX(4) - L.halfWidth(4) - 0.2, 4];
e.part(sx, sz - AZ, () => e.at(0, -0.1, "stream"), [-0.3, -0.3, 0.3, 0.1]);
