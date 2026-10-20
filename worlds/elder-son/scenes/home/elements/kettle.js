// The kettle on the table: by Sarafanov (`kettle_at` table, x −0.15) or pushed over to Busygin (pushed, x 0.15);
// on the stove it is the stove's, in a hand the person's. Blue enamel, its spout toward Busygin. Metres.
const k = e.state.kettle_at;
if (k === 'table' || k === 'pushed') {
  const x = k === 'table' ? -0.15 : 0.15;
  g.fillStyle = '#3e5a73';
  g.beginPath();
  g.moveTo(x - 0.11, 0);
  g.quadraticCurveTo(x - 0.15, -0.14, x - 0.07, -0.17);
  g.lineTo(x + 0.07, -0.17);
  g.quadraticCurveTo(x + 0.15, -0.14, x + 0.11, 0);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(x + 0.1, -0.06);
  g.quadraticCurveTo(x + 0.18, -0.09, x + 0.22, -0.16);
  g.lineTo(x + 0.2, -0.17);
  g.quadraticCurveTo(x + 0.16, -0.11, x + 0.11, -0.1);
  g.closePath();
  g.fill();
  g.strokeStyle = '#2e3e4c';
  g.lineWidth = 0.014;
  g.beginPath();
  g.moveTo(x - 0.07, -0.17);
  g.quadraticCurveTo(x, -0.26, x + 0.07, -0.17);
  g.stroke();
  g.fillStyle = '#e8e4da';
  g.fillRect(x - 0.1, -0.03, 0.2, 0.012);
  g.beginPath();
  g.arc(x, -0.18, 0.018, 0, Math.PI * 2);
  g.fill();
}
