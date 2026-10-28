// The projector on its table at the warehouse, in profile (x runs north, toward the screen; the lens at +x).
// A forties projector: the lamp house with its chimney, the body, the lens; two reels on their arms (layers that
// turn while it runs); the tarp folded at the back of the table, drawn over it by `cover` (a layer).
if (!e.state.screen_up) return;                                  // only with the summer cinema
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
e.layer('tarp', { pivot: [-0.6, -0.95] }, t => {                // an old oilcloth drawn over it from the back end: it hugs the shape under it
  t.fillStyle = '#3b3a33';
  t.beginPath(); t.moveTo(-0.64, -0.8); t.quadraticCurveTo(-0.66, -1.62, -0.48, -1.86); t.quadraticCurveTo(-0.3, -2.0, -0.05, -1.95);
  t.quadraticCurveTo(0.2, -1.98, 0.32, -1.62); t.quadraticCurveTo(0.58, -1.5, 0.6, -1.28); t.quadraticCurveTo(0.64, -1.0, 0.66, -0.8);
  t.quadraticCurveTo(0.3, -0.76, 0.0, -0.82); t.quadraticCurveTo(-0.32, -0.76, -0.64, -0.8); t.closePath(); t.fill();
  t.strokeStyle = '#2c2b26'; t.lineWidth = 0.025;
  for (const [x, b] of [[-0.4, 0.05], [-0.12, -0.03], [0.18, 0.04], [0.42, -0.02]]) { t.beginPath(); t.moveTo(x, -1.85); t.quadraticCurveTo(x + b, -1.3, x - b, -0.84); t.stroke(); }
  t.fillStyle = '#4a4940'; t.beginPath(); t.ellipse(-0.15, -1.78, 0.28, 0.07, -0.2, 0, Math.PI * 2); t.fill();   // the wet shine on its top
});
e.at(0, -1.35);
e.at(0.53, -1.33, 'lens');
