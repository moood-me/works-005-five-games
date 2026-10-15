
// The beam from the lion's mouth over the rows to the screen: a wedge of light in its vertical plane, from the port
// (the anchor) 20.44 m to the screen, spreading to the screen's height. Layer 1 the cone, brighter at the mouth;
// layer 2 dust motes drifting toward the screen; the shader breathes tobacco smoke through it. It glows, lights
// nothing itself (the screen's light is the scene's).
const len = 20.44, top = -1.6, bot = 2.4;                       // at the screen: from 6.2 to 2.2 m (the mouth is at 4.6)
e.layer('cone', {}, c => {
  const gr = c.createLinearGradient(0, 0, len, 0);
  gr.addColorStop(0, 'rgba(255,228,176,0.95)'); gr.addColorStop(0.07, 'rgba(255,220,160,0.5)');
  gr.addColorStop(0.45, 'rgba(255,210,150,0.2)'); gr.addColorStop(1, 'rgba(255,205,145,0.12)');
  c.fillStyle = gr;
  c.beginPath(); c.moveTo(0, -0.05); c.lineTo(len, top); c.lineTo(len, bot); c.lineTo(0, 0.05); c.closePath(); c.fill();
  const core = c.createLinearGradient(0, 0, len, 0);
  core.addColorStop(0, 'rgba(255,240,205,0.6)'); core.addColorStop(0.5, 'rgba(255,230,190,0.07)'); core.addColorStop(1, 'rgba(255,230,190,0.03)');
  c.fillStyle = core;
  c.beginPath(); c.moveTo(0, -0.02); c.lineTo(len, top * 0.62 + bot * 0.38); c.lineTo(len, top * 0.38 + bot * 0.62); c.lineTo(0, 0.02); c.closePath(); c.fill();
});
e.layer('dust', { drift: [1.0, 0], box: [0, -1.8, len, 2.6] }, d => {
  const an = e.anim;
  for (let i = 0; i < 380; i++) {
    const x = an.hash(i, 81) * len, y = -1.75 + an.hash(i, 82) * 4.3, r = 0.012 + an.hash(i, 83) * 0.028;
    d.fillStyle = 'rgba(255,236,200,' + (0.35 + an.hash(i, 84) * 0.5) + ')';
    d.beginPath(); d.arc(x, y, r, 0, Math.PI * 2); d.fill();
  }
});
e.at(len * 0.45, -0.05, 'beam');
