const L = 12.9;
e.layer('cone', { blend: 'add', flicker: 0.1, box: [-0.2, -3.4, L + 0.2, 0.4] }, g => {
  const gr = g.createLinearGradient(0, 0, L, 0);
  gr.addColorStop(0, 'rgba(255,238,190,0.75)'); gr.addColorStop(0.5, 'rgba(255,232,170,0.30)'); gr.addColorStop(1, 'rgba(255,230,170,0.22)');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(0, -0.05); g.lineTo(L, -2.95); g.lineTo(L, -0.1); g.lineTo(0, 0.05); g.closePath(); g.fill();
});
e.light(L, -1.5, 1.6, '#ffe4b0', 0.5, 'tip');
e.at(L * 0.5, -0.75, 'beam');
