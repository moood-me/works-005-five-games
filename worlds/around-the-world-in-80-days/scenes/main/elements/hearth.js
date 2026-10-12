// The fireplace's recess behind the opening in the partition: its sooted back, half a metre in (wider than the opening — the eye sees in
// aslant), and the fire's glow on it — a layer the shader lets shine as much as the fire is now (hearth.glsl): the red
// over the back, the bed of embers low, its white heart.
const H = e.lib.plan.hearth, svet = e.kit.svet;
g.fillStyle = '#070505';
g.fillRect(-H.w / 2 - 0.35, -H.h - 0.2, H.w + 0.7, H.h + 0.2);
e.layer('glow', {}, w => {
  const ig = w.createRadialGradient(0, -0.1, 0, 0, -0.1, 0.8);
  ig.addColorStop(0, 'rgba(170,60,20,0.85)');
  ig.addColorStop(1, 'rgba(60,18,8,0)');
  w.fillStyle = ig;
  w.fillRect(-H.w / 2 - 0.35, -H.h - 0.2, H.w + 0.7, H.h + 0.2);
  w.globalCompositeOperation = 'lighter';
  svet.glow(w, 0, -0.06, 0.6, '#ff7a2e', 0.6, 0.22);
  svet.glow(w, 0, -0.08, 0.28, '#fff0cc', 0.6, 0.35);
});
