// The sky all round (the camera turns, e.aspect = 2π, straight ahead at its middle; bearing b → x = π + b in radians):
// the snowy night — low, overcast, lighter toward the horizon where the snow and the far lights glow; the dusk (`dusk`:
// a cold lilac light low in the west, beyond the tracks on the left), the late night (`late`: darker), the grey dawn
// (`dawn`: pale low over the wood beyond the tracks, a pink streak) — layers over it, their weights by the hour
// (sky.animate.js). Below the horizon, the dark of far land.
const A = e.aspect, x0 = -0.4, w = A + 0.8;
const X = deg => A / 2 + (deg * Math.PI) / 180;
const band = (c, stops) => {
  const gr = c.createLinearGradient(0, -0.35, 0, 1.25);
  for (const [at, col] of stops) gr.addColorStop(at, col);
  c.fillStyle = gr;
  c.fillRect(x0, -0.35, w, 1.6);
};
band(g, [[0, '#090d1a'], [0.35, '#141b31'], [0.5, '#262f4e'], [0.53, '#3a4062'], [0.56, '#1d2033'], [1, '#101219']]);
// low cloud, faintly lit from below (each drawn on either side of the seam too: the ends meet)
for (let i = 0; i < 14; i++) {
  const x = e.rnd() * A, cy = 0.14 + e.rnd() * 0.3, rx = 0.3 + e.rnd() * 0.5, k = 0.12 + e.rnd() * 0.1;
  for (const cx of [x - A, x, x + A]) {
    const c = g.createRadialGradient(cx, cy / k, 0, cx, cy / k, rx);
    c.addColorStop(0, 'rgba(70,78,108,0.42)');
    c.addColorStop(1, 'rgba(70,78,108,0)');
    g.save();
    g.scale(1, k);
    g.fillStyle = c;
    g.fillRect(cx - rx, cy / k - rx, rx * 2, rx * 2);
    g.restore();
  }
}
// the glow of a town far off behind the settlement (bearing ~ 150, low)
const town = g.createRadialGradient(X(150), 0.52, 0, X(150), 0.52, 0.9);
town.addColorStop(0, 'rgba(120,96,92,0.35)');
town.addColorStop(1, 'rgba(120,96,92,0)');
g.fillStyle = town;
g.fillRect(x0, 0.1, w, 0.6);
e.layer('dusk', {}, c => {
  band(c, [[0, '#18203c'], [0.3, '#2c3558'], [0.47, '#5a5a80'], [0.52, '#8a7c96'], [0.56, '#2a2c42'], [1, '#14161e']]);
  const west = c.createRadialGradient(X(-75), 0.5, 0, X(-75), 0.5, 1.1);
  west.addColorStop(0, 'rgba(196,160,170,0.55)');
  west.addColorStop(1, 'rgba(196,160,170,0)');
  c.fillStyle = west;
  c.fillRect(x0, 0, w, 0.6);
});
e.layer('late', {}, c => {
  band(c, [[0, '#04060d'], [0.4, '#0b1022'], [0.53, '#1e2338'], [0.56, '#121420'], [1, '#0b0c11']]);
});
e.layer('dawn', {}, c => {
  band(c, [[0, '#4a5268'], [0.3, '#7a8296'], [0.47, '#a7aab6'], [0.52, '#c2b8b8'], [0.56, '#5c6070'], [1, '#3a3d48']]);
  const east = c.createRadialGradient(X(-28), 0.5, 0, X(-28), 0.5, 0.9);
  east.addColorStop(0, 'rgba(232,190,176,0.6)');
  east.addColorStop(1, 'rgba(232,190,176,0)');
  c.fillStyle = east;
  c.fillRect(x0, 0.1, w, 0.5);
});
