e.layer('halo', { box: [-14, -14, 14, 14] }, g2 => {
  const gr = g2.createRadialGradient(0, 0, 0, 0, 0, 14);
  gr.addColorStop(0, 'rgba(255,248,225,1)'); gr.addColorStop(0.08, 'rgba(255,244,210,0.8)'); gr.addColorStop(0.3, 'rgba(210,225,255,0.25)'); gr.addColorStop(1, 'rgba(160,190,255,0)');
  g2.fillStyle = gr; g2.fillRect(-14, -14, 28, 28);
});
