// The projector's lamp low on the right of the middle 4:3: the dark lamp house, its round lens glowing warm — the
// thing the player touches to go on (it marks its point `lamp` itself). Painted once; its glow breathes by `lamp`.
const A = e.aspect, L = e.lib.lampAt(A), R = 0.05;
// the lamp house: a dark box with vents, the lens's barrel toward us
e.layer('house', {}, c => {
  c.fillStyle = '#1b1714';
  c.fillRect(L.x - 0.11, L.y - 0.09, 0.22, 0.2);
  c.fillStyle = '#0d0b0a';
  for (let k = 0; k < 4; k++) c.fillRect(L.x - 0.09, L.y - 0.075 + k * 0.022, 0.05, 0.008);
  c.fillStyle = '#2a2420';
  c.beginPath(); c.arc(L.x + 0.02, L.y + 0.01, R * 1.25, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#0c0a09';
  c.fillRect(L.x - 0.05, L.y + 0.11, 0.1, 0.2);
});
// the glow round the lens
e.layer('halo', { blend: 'add' }, c => {
  const gr = c.createRadialGradient(L.x + 0.02, L.y + 0.01, 0, L.x + 0.02, L.y + 0.01, 0.2);
  gr.addColorStop(0, 'rgba(255,214,150,0.55)');
  gr.addColorStop(0.35, 'rgba(255,170,90,0.18)');
  gr.addColorStop(1, 'rgba(255,150,70,0)');
  c.fillStyle = gr;
  c.fillRect(L.x - 0.2, L.y - 0.2, 0.44, 0.42);
});
// the lens itself
e.layer('lens', {}, c => {
  const gr = c.createRadialGradient(L.x + 0.012, L.y, 0, L.x + 0.02, L.y + 0.01, R);
  gr.addColorStop(0, '#fff6dc');
  gr.addColorStop(0.5, '#ffd28a');
  gr.addColorStop(1, '#c47a34');
  c.fillStyle = gr;
  c.beginPath(); c.arc(L.x + 0.02, L.y + 0.01, R, 0, Math.PI * 2); c.fill();
});
e.light(L.x + 0.02, L.y + 0.01, 0.02, '#ffd9a0', 0.8, 'lens');
// the point the player touches: the glowing lens itself (marked by the painting, not inside a layer)
e.at(L.x + 0.02, L.y + 0.01, 'lamp');
