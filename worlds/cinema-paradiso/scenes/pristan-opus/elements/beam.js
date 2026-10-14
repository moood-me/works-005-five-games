// The projector's beam over the chairs to the screen: a wedge of light in the vertical plane from the lens (the
// anchor) to the screen 24.4 m away, rising to the screen's span. Layer 1 — the cone, warm, brighter at the mouth;
// layer 2 — motes of dust, drifting toward the screen (the shader keeps them inside the wedge and adds the smoke).
// It glows: the night does not darken it; it lights nothing itself (the screen's light and the lamp's are the
// scene's lights).
const len = 24.4, top = -4.05, bot = -0.05;
e.layer('cone', {}, c => {
  const gr = c.createLinearGradient(0, 0, len, 0);
  gr.addColorStop(0, 'rgba(255,228,176,0.95)'); gr.addColorStop(0.06, 'rgba(255,220,160,0.5)');
  gr.addColorStop(0.4, 'rgba(255,210,150,0.22)'); gr.addColorStop(1, 'rgba(255,205,145,0.13)');
  c.fillStyle = gr; c.filter = 'blur(0.12px)';
  c.beginPath(); c.moveTo(0, -0.05); c.lineTo(len, top); c.lineTo(len, bot); c.lineTo(0, 0.05); c.closePath(); c.fill();
  c.filter = 'none';
  const core = c.createLinearGradient(0, 0, len, 0);
  core.addColorStop(0, 'rgba(255,240,205,0.6)'); core.addColorStop(0.5, 'rgba(255,230,190,0.08)'); core.addColorStop(1, 'rgba(255,230,190,0.04)');
  c.fillStyle = core;
  c.beginPath(); c.moveTo(0, -0.02); c.lineTo(len, top * 0.62 + bot * 0.38); c.lineTo(len, top * 0.38 + bot * 0.62); c.lineTo(0, 0.02); c.closePath(); c.fill();
});
e.layer('dust', { drift: [1.1, 0], box: [0, -4.4, len, 0.4] }, d => {
  const an = e.anim;
  for (let i = 0; i < 420; i++) {
    const x = an.hash(i, 81) * len, y = -4.3 + an.hash(i, 82) * 4.6, r = 0.012 + an.hash(i, 83) * 0.03;
    d.fillStyle = 'rgba(255,236,200,' + (0.35 + an.hash(i, 84) * 0.5) + ')';
    d.beginPath(); d.arc(x, y, r, 0, Math.PI * 2); d.fill();
  }
});
e.light(0.05, 0, 0.12, '#ffe6b8', 1, 'mouth');
e.at(len / 2, (top + bot) / 4, 'beam');
