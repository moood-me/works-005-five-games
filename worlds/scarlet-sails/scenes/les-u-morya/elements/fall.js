// The stream's falls between its pools and down to the beach: at each step the water bends over a lip — a pale crest
// across the stream, a part at each (lib.js SPRAY; the anchor at the first); the white water breaking over it is
// particles (spray_<i>)
const L = e.lib;
const A = e.anim;
const [X0, Z0] = L.SPRAY[0];
L.SPRAY.forEach(([X, Z, w, over], i) => {
  e.part(X - X0, Z - Z0, (g) => {
    g.fillStyle = "rgba(226,233,236,0.9)";
    g.beginPath();
    g.moveTo(-w, -over + 0.02);
    for (let x = -w; x <= w + 1e-6; x += w / 8) g.lineTo(x, -over - 0.03 - 0.04 * A.hash(i * 17 + Math.round(x * 40), 9));
    g.lineTo(w, -over + 0.02);
    g.closePath();
    g.fill();
  }, [-w - 0.2, -over - 0.3, w + 0.2, -over + 0.1]);
});
