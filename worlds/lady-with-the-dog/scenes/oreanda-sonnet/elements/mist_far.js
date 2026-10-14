e.layer('m', { box: [-800, -90, 800, 0], drift: [2, 0] }, g => {
  for (let i = 0; i < 9; i++) {
    const x = -800 + i * 180 + e.rnd() * 60;
    const w = 150 + e.rnd() * 120;
    const h = 20 + e.rnd() * 30;
    for (const o of [-1600, 0, 1600]) {
      g.save();
      g.translate(x + o, -30);
      g.scale(1, h / w);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, w);
      gr.addColorStop(0, 'rgba(236,224,230,0.55)');
      gr.addColorStop(1, 'rgba(236,224,230,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(0, 0, w, 0, 6.283);
      g.fill();
      g.restore();
    }
  }
});
