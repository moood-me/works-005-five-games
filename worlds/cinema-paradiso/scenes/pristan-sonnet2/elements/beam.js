// projector beam: a wedge from the lens to the screen
const L = 15.3, y1 = -2.05, hs = 1.95;
e.layer('wedge', { blend: 'add', box: [-0.1, -6, L + 0.1, 1] }, w => {
  const gr = w.createLinearGradient(0, 0, L, 0);
  gr.addColorStop(0, 'rgba(255,225,170,0.8)'); gr.addColorStop(1, 'rgba(255,225,170,0.35)');
  w.fillStyle = gr;
  w.beginPath(); w.moveTo(0, -0.03); w.lineTo(L, y1 - hs); w.lineTo(L, y1 + hs); w.lineTo(0, 0.03); w.closePath(); w.fill();
});
e.light(0.2, 0, 1.6, '#ffe0a8', 0.8, 'mouth');
