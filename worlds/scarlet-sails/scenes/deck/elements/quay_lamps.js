// The lamps along the quay's edge (x along it, + back toward the ship's stern): iron posts, a lantern on each — its
// glass dark, and lit (a layer, as the night comes: its animate); each flame a light of the scene (`quay_light_0…3`)
// — pools on the paving, paths in the water
const N = e.kit.sky;
const X = i => -36 + i * 24;
for (let i = 0; i < 4; i++) {
  g.fillStyle = "#2f2d2a";
  g.fillRect(X(i) - 0.06, -3.2, 0.12, 3.2);
  g.fillRect(X(i) - 0.2, -3.6, 0.4, 0.06);
  g.fillStyle = N.rgba("#8d8a84", 0.9);
  g.fillRect(X(i) - 0.15, -3.55, 0.3, 0.35);
}
e.layer("lit", {}, g => {
  g.fillStyle = "#ffe2b0";
  for (let i = 0; i < 4; i++) {
    g.fillRect(X(i) - 0.15, -3.55, 0.3, 0.35);
    e.light(X(i), -3.38, 0.5, N.WARM, 1, `lamp${i}`);
  }
});
