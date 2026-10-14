// The headlights' beam ahead of the car (x runs forward from its nose; the anchor on the road under the lamps): a wedge of light falling to the road 9 m
// ahead and spreading; it glows, and shows most in the rain (the shader). A small glow on the road where it falls,
// whose light (`car_pool`) lights what stands there.
const t = e.state.car; if (t !== 'old' && t !== 'new') return;
const len = 16;
e.layer('cone', {}, c => {
  const gr = c.createLinearGradient(0, 0, len, 0);
  gr.addColorStop(0, 'rgba(255,240,205,0.9)'); gr.addColorStop(0.1, 'rgba(255,236,200,0.38)'); gr.addColorStop(1, 'rgba(255,232,195,0.0)');
  c.fillStyle = gr; c.filter = 'blur(0.15px)';
  c.beginPath(); c.moveTo(0, -0.72); c.lineTo(len, -2.0); c.lineTo(len, -0.02); c.lineTo(9, -0.02); c.lineTo(0, -0.52); c.closePath(); c.fill();
});
e.light(9.5, -0.08, 0.35, '#ffe9c4', 0.35, 'pool');
