// The projector low on the right of the middle 4:3: its beam thrown up to the left across the whole booth, through the
// strip's band (dust hanging in it); the dark lamp house, its round lens glowing warm. Painted once; the beam and the
// glow breathe (lamp.animate.js).
const A = e.aspect, L = e.lib.lampAt(A), R = 0.05, O = { x: L.x + 0.02, y: L.y + 0.01 };
// the beam: a cone from the lens up to the left, past the stage's edge — a clear shaft, soft at its sides (cones
// within cones), dust hanging in it
e.layer('beam', { blend: 'add' }, c => {
  const far = { x: -0.4, y: 0.3 }, half = 0.2; // where it goes, and its half-width there
  const dx = far.x - O.x, dy = far.y - O.y, n = Math.hypot(dx, dy), px = -dy / n, py = dx / n;
  const cone = (spread, alpha) => {
    const gr = c.createLinearGradient(O.x, O.y, far.x, far.y);
    gr.addColorStop(0, `rgba(255,214,150,${alpha})`);
    gr.addColorStop(0.5, `rgba(255,196,124,${alpha * 0.5})`);
    gr.addColorStop(1, `rgba(255,180,110,${alpha * 0.2})`);
    c.fillStyle = gr;
    c.beginPath();
    c.moveTo(O.x + px * R * 0.7 * spread, O.y + py * R * 0.7 * spread);
    c.lineTo(far.x + px * half * spread, far.y + py * half * spread);
    c.lineTo(far.x - px * half * spread, far.y - py * half * spread);
    c.lineTo(O.x - px * R * 0.7 * spread, O.y - py * R * 0.7 * spread);
    c.closePath();
    c.fill();
  };
  cone(1.5, 0.04);
  cone(1.25, 0.05);
  cone(1, 0.07);
  cone(0.7, 0.07);
  // dust in the light
  for (let k = 0; k < 260; k++) {
    const t = e.rnd(), s = (e.rnd() * 2 - 1) * 0.9;
    const w = R * 0.7 + (half - R * 0.7) * t;
    const x = O.x + dx * t + px * w * s, y = O.y + dy * t + py * w * s;
    c.fillStyle = `rgba(255,220,170,${0.06 + 0.14 * e.rnd() * (1 - t * 0.6)})`;
    c.beginPath(); c.arc(x, y, 0.0012 + 0.0022 * e.rnd(), 0, Math.PI * 2); c.fill();
  }
});
// the lamp house: a dark box with vents, the lens's barrel toward the beam
e.layer('house', {}, c => {
  c.fillStyle = '#1e1915';
  c.fillRect(L.x - 0.11, L.y - 0.09, 0.22, 0.2);
  c.fillStyle = 'rgba(255,214,160,0.08)';
  c.fillRect(L.x - 0.11, L.y - 0.09, 0.22, 0.004);
  c.fillStyle = '#0d0b0a';
  for (let k = 0; k < 4; k++) c.fillRect(L.x - 0.09, L.y - 0.075 + k * 0.022, 0.05, 0.008);
  c.fillStyle = '#2a2420';
  c.beginPath(); c.arc(O.x, O.y, R * 1.25, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#0c0a09';
  c.fillRect(L.x - 0.05, L.y + 0.11, 0.1, 0.2);
});
// the glow round the lens
e.layer('halo', { blend: 'add' }, c => {
  const gr = c.createRadialGradient(O.x, O.y, 0, O.x, O.y, 0.2);
  gr.addColorStop(0, 'rgba(255,214,150,0.55)');
  gr.addColorStop(0.35, 'rgba(255,170,90,0.18)');
  gr.addColorStop(1, 'rgba(255,150,70,0)');
  c.fillStyle = gr;
  c.fillRect(L.x - 0.2, L.y - 0.2, 0.44, 0.42);
});
// the lens itself
e.layer('lens', {}, c => {
  const gr = c.createRadialGradient(O.x - 0.008, O.y - 0.01, 0, O.x, O.y, R);
  gr.addColorStop(0, '#fff6dc');
  gr.addColorStop(0.5, '#ffd28a');
  gr.addColorStop(1, '#c47a34');
  c.fillStyle = gr;
  c.beginPath(); c.arc(O.x, O.y, R, 0, Math.PI * 2); c.fill();
});
e.light(O.x, O.y, 0.02, '#ffd9a0', 0.8, 'lens');
