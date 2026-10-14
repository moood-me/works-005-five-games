e.layer('hl', { blend: 'add', flicker: 0.05, box: [-2.5, -6.2, 2.5, 6.2] }, g => {
  const gr = g.createLinearGradient(0, 6, 0, -6);
  gr.addColorStop(0, 'rgba(255,240,200,0.42)'); gr.addColorStop(1, 'rgba(255,236,190,0.1)');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(-0.7, 6); g.lineTo(0.7, 6); g.lineTo(2.3, -6); g.lineTo(-2.3, -6); g.closePath(); g.fill();
});
e.light(0, -4, 3, '#ffeac0', 1.0, 'tip');
