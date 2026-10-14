e.layer('m', { box: [-800, -50, 800, 0], drift: [3, 0] }, g => {
  for (let i = 0; i < 9; i++) {
    const x = -800 + i * 180 + e.rnd() * 60;
    const w = 130 + e.rnd() * 100;
    const h = 12 + e.rnd() * 18;
    for (const o of [-1600, 0, 1600]) {
      g.save();
      g.translate(x + o, -16);
      g.scale(1, h / w);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, w);
      gr.addColorStop(0, 'rgba(236,224,230,0.5)');
      gr.addColorStop(1, 'rgba(236,224,230,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(0, 0, w, 0, 6.283);
      g.fill();
      g.restore();
    }
  }
});
