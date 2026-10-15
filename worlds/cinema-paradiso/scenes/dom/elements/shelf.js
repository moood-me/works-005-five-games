// The shelf over Toto's bed (its x runs south): the board on two brackets; on it the little 8 mm camera, film tins
// stacked, a few books — and, if he kept the reel of the girl (`reel8`), a tin marked «Е.» by the home projector
// (home_projector). Painted once (reel8 is the play's: it does not move).
const B = e.lib.G.SHELF, L = (B.z1 - B.z0) / 2;
g.fillStyle = '#4e3a29'; g.fillRect(-L, -0.03, 2 * L, 0.035);
g.fillStyle = '#3a2b1f';
for (const x of [-L + 0.12, L - 0.16]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 0.04, 0); g.lineTo(x + 0.04, 0.16); g.closePath(); g.fill(); }
// books at the north end
const cols = ['#6a3a2c', '#3c4a5a', '#7a6a42', '#4a3a30', '#5a5040'];
let x = -L + 0.04;
for (let i = 0; i < 5; i++) { g.fillStyle = cols[i]; const bw = 0.035 + 0.01 * (i % 2); g.fillRect(x, -0.22 - 0.03 * (i % 3), bw, 0.22 + 0.03 * (i % 3)); x += bw + 0.004; }
// the camera
g.fillStyle = '#2a2a2c'; g.fillRect(-L + 0.32, -0.12, 0.12, 0.1);
g.fillStyle = '#3e3e42'; g.fillRect(-L + 0.29, -0.09, 0.04, 0.04);
// film tins, stacked
for (let k = 0; k < 3; k++) { g.fillStyle = k % 2 ? '#77786f' : '#8a8b82'; g.fillRect(L - 0.36, -0.03 - 0.03 * (k + 1), 0.26, 0.026); }
if (e.state.reel8) {
  g.fillStyle = '#9a9b90'; g.fillRect(L - 0.34, -0.15, 0.22, 0.03);
  g.fillStyle = '#e8e2cf'; g.fillRect(L - 0.25, -0.147, 0.05, 0.024);
  g.strokeStyle = '#2a2018'; g.lineWidth = 0.003;
  g.beginPath(); g.moveTo(L - 0.205, -0.142); g.lineTo(L - 0.222, -0.142); g.lineTo(L - 0.222, -0.127); g.lineTo(L - 0.205, -0.127);
  g.moveTo(L - 0.222, -0.135); g.lineTo(L - 0.21, -0.135); g.stroke();
}
e.at(0, -0.15, 'middle');
