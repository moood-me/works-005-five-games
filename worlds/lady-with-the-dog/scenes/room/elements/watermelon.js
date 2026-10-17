// The plate with the watermelon (metres, origin under the plate's middle): whole, with the knife beside it — or, once
// the slice has fallen (`slice`), the cut melon and the red slice; on the bed (`plate` 'bed') only the slice he
// brought her. In the hands (`plate` 'held') it is the cast's part: animate hides this one.
const s = e.state, cut = Number(s.slice) > 0.5, onBed = s.plate === 'bed';
e.layer('all', {}, gp => {
  gp.fillStyle = '#efe9dc';
  gp.beginPath(); gp.ellipse(0, -0.012, 0.15, 0.022, 0, 0, Math.PI * 2); gp.fill();
  if (!onBed) {
    // the melon: a striped green ball, cut open on the side toward the candle once the slice has fallen
    gp.fillStyle = '#2f5a35';
    gp.beginPath(); gp.ellipse(-0.01, -0.12, 0.12, 0.1, 0, 0, Math.PI * 2); gp.fill();
    gp.strokeStyle = '#6f9a5c'; gp.lineWidth = 0.012;
    for (const k of [-2, -1, 0, 1, 2]) { gp.beginPath(); gp.ellipse(-0.01 + k * 0.035, -0.12, 0.02, 0.095, 0, 0, Math.PI * 2); gp.stroke(); }
    if (cut) {
      gp.fillStyle = '#c4383a';
      gp.beginPath(); gp.ellipse(0.06, -0.12, 0.045, 0.085, 0, -Math.PI / 2, Math.PI / 2); gp.fill();
    }
    gp.fillStyle = '#c9ccd2'; gp.fillRect(-0.16, -0.03, 0.12, 0.012);   // the knife
    gp.fillStyle = '#4a3222'; gp.fillRect(-0.2, -0.032, 0.05, 0.016);
  }
  if (cut || onBed) {
    gp.fillStyle = '#2f5a35';
    gp.beginPath(); gp.moveTo(0.02, -0.03); gp.quadraticCurveTo(0.12, -0.02, 0.15, -0.045); gp.lineTo(0.13, -0.05); gp.closePath(); gp.fill();
    gp.fillStyle = '#c4383a';
    gp.beginPath(); gp.moveTo(0.02, -0.035); gp.quadraticCurveTo(0.08, -0.13, 0.14, -0.05); gp.closePath(); gp.fill();
    gp.fillStyle = '#1d1512';
    for (const [x, y] of [[0.06, -0.06], [0.08, -0.08], [0.1, -0.06]]) { gp.beginPath(); gp.arc(x, y, 0.005, 0, Math.PI * 2); gp.fill(); }
  }
});
e.at(0.02, -0.1);
