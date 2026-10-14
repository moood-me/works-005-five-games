// The projector on its table at the warehouse, in profile (x runs north, toward the screen; the lens at +x).
// A forties projector: the lamp house with its chimney, the body, the lens; two reels on their arms (layers that
// turn while it runs); the tarp folded at the back of the table, drawn over it by `cover` (a layer).
g.fillStyle = '#6a5038';                                        // the table
g.fillRect(-0.6, -0.95, 1.2, 0.06);
g.fillStyle = '#56402c'; for (const x of [-0.55, 0.5]) g.fillRect(x, -0.9, 0.05, 0.9);
g.fillRect(-0.55, -0.35, 1.1, 0.03);
g.fillStyle = '#2c2d30';                                        // the body
g.fillRect(-0.32, -1.25, 0.62, 0.3);
g.fillStyle = '#3a3b3f'; g.fillRect(-0.3, -1.58, 0.26, 0.34);   // the lamp house
g.fillStyle = '#26272a'; g.fillRect(-0.24, -1.72, 0.13, 0.15);  // its chimney
g.fillStyle = '#1e1f22'; g.fillRect(0.28, -1.38, 0.24, 0.11);   // the lens
g.fillStyle = '#c8c4b8'; g.fillRect(0.5, -1.37, 0.03, 0.09);
g.fillStyle = '#18191b'; g.fillRect(0.02, -1.5, 0.2, 0.26);     // the gate
g.strokeStyle = '#2a2b2e'; g.lineWidth = 0.03;                  // the reels' arms
g.beginPath(); g.moveTo(0.06, -1.25); g.lineTo(0.15, -1.85); g.moveTo(-0.08, -1.28); g.lineTo(-0.32, -1.8); g.stroke();
const reel = (name, x, y) => e.layer(name, { pivot: [x, y] }, r => {
  r.fillStyle = '#3c3e43'; r.beginPath(); r.arc(x, y, 0.24, 0, Math.PI * 2); r.fill();
  r.fillStyle = '#17181b'; r.beginPath(); r.arc(x, y, 0.17, 0, Math.PI * 2); r.fill();
  r.fillStyle = '#6d6f75'; for (let k = 0; k < 3; k++) { const a = k * 2.094; r.beginPath(); r.ellipse(x + Math.cos(a) * 0.12, y + Math.sin(a) * 0.12, 0.045, 0.045, 0, 0, Math.PI * 2); r.fill(); }
  r.fillStyle = '#9a9ca2'; r.beginPath(); r.arc(x, y, 0.03, 0, Math.PI * 2); r.fill();
});
reel('reel_f', 0.15, -1.86); reel('reel_b', -0.32, -1.81);
e.layer('tarp', { pivot: [-0.6, -0.95] }, t => {                // canvas draped over everything, from the back end
  t.fillStyle = '#5d6253';
  t.beginPath(); t.moveTo(-0.62, -0.7); t.lineTo(-0.6, -1.95); t.quadraticCurveTo(-0.3, -2.18, 0.15, -2.14);
  t.quadraticCurveTo(0.5, -2.0, 0.58, -1.45); t.lineTo(0.66, -0.7); t.closePath(); t.fill();
  t.strokeStyle = '#4a4f42'; t.lineWidth = 0.025;
  for (const x of [-0.35, -0.05, 0.3]) { t.beginPath(); t.moveTo(x, -2.05); t.quadraticCurveTo(x + 0.05, -1.4, x - 0.02, -0.72); t.stroke(); }
});
e.at(0, -1.35);
e.at(0.53, -1.33, 'lens');
