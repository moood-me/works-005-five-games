// The whist table under its lamp: legs, apron, and a chair drawn up to three of its sides — plain silhouettes, each part
// at its own depth (Fogg's, behind it, is fogg_chair: it is pushed back). Anchored where its near legs stand; the seats
// are lib.plan.seats (where the players sit).
const dark = '#2c211b';
const [ta, td] = [e.lib.plan.table.across, e.lib.plan.table.d];
const at = name => e.lib.plan.seats[name];
// a side chair in profile, on the table's left (side −1, facing right) or right (1, facing left): its back away from
// the table, at the seat's depth
const side = (s, [a, d]) =>
  e.part(a - ta + s * 0.06, d - td, g => {
    g.scale(s, 1);
    g.fillStyle = dark;
    g.beginPath();
    for (const [x, y] of [[0.17, 0], [0.2, -0.46], [0.26, -1.0], [0.21, -1.0], [0.15, -0.46], [0.13, 0]]) g.lineTo(x, y);
    g.closePath();
    g.fill();
    g.fillRect(-0.24, -0.48, 0.47, 0.05);
    g.fillRect(-0.22, -0.46, 0.035, 0.46);
  }, [-0.35, -1.05, 0.35, 0.02]);
side(-1, at('left'));
side(1, at('right'));
// a chair seen from before (behind the table, facing us) or from behind (before it, its back to us): lib.js chair
e.lib.chair(e, at('near').map((v, i) => v - [ta, td][i]), -1);
// Stuart's chair, apart, turned three quarters to us: from before, its back behind him
e.lib.chair(e, e.lib.plan.reader.map((v, i) => v - [ta, td][i]), 1);
// the table: four straight legs, the apron under the baize
for (const d of [0.9, 0]) {
  for (const a of [-0.45, 0.45]) {
    e.part(a, d, g => {
      g.fillStyle = dark;
      g.fillRect(-0.025, -0.64, 0.05, 0.64);
    }, [-0.05, -0.66, 0.05, 0.02]);
  }
}
e.part(0, -0.05, g => {
  g.fillStyle = dark;
  g.fillRect(-0.5, -0.76, 1, 0.14);
  e.at(0, -0.76, 'table');
}, [-0.55, -0.8, 0.55, 0]);
