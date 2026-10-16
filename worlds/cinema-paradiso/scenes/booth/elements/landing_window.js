// the stair's small window, seen through the door: the same sky as the booth's window; rain runs down it (a layer by
// rain_window — autumn)
const S = e.state;
e.kit.sky.pane(g, -0.3, -1.95, 0.3, -1.2, S.hour, S.era === 'ruin' ? 'now' : S.era, e.anim);
e.layer('rain', { drift: [0, 0.9], box: [-0.3, -1.95, 0.3, -1.2] }, l => {
  l.strokeStyle = 'rgba(210,220,235,0.55)'; l.lineWidth = 0.004;
  for (let i = 0; i < 70; i++) { const x = -0.3 + e.anim.hash(i, 7) * 0.6, y = -1.95 + e.anim.hash(i, 8) * 0.75; l.beginPath(); l.moveTo(x, y); l.lineTo(x - 0.008, y + 0.06 + e.anim.hash(i, 9) * 0.05); l.stroke(); }
});
e.layer('frame', {}, l => { l.strokeStyle = '#3a3128'; l.lineWidth = 0.04; l.strokeRect(-0.3, -1.95, 0.6, 0.75); l.fillStyle = '#3a3128'; l.fillRect(-0.015, -1.95, 0.03, 0.75); });
