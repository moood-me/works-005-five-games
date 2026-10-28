// The «General Grant»'s paddle-boxes, one either side (copies), seen from inboard over the rail: the half-round housing
// of the wheel, its radiating slats, the line's name in gold along its rim. Nothing on the other ships.
const L = e.lib, c = L.colours(e.state);
if (L.shipOf(e.state) === 'general_grant') {
  g.fillStyle = c.house;
  g.beginPath();
  g.moveTo(-5.4, 0);
  g.lineTo(-5.4, -1.2);
  g.arc(0, -1.2, 5.4, Math.PI, 0);
  g.lineTo(5.4, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = L.shade(c.house, 0.2);
  g.lineWidth = 0.08;
  for (let k = 1; k < 12; k++) { const a = Math.PI + (k * Math.PI) / 12; g.beginPath(); g.moveTo(0, -1.2); g.lineTo(Math.cos(a) * 5.2, -1.2 + Math.sin(a) * 5.2); g.stroke(); }
  g.fillStyle = c.trim;
  g.beginPath();
  g.arc(0, -1.2, 1.2, Math.PI, 0);
  g.fill();
  g.lineWidth = 0.22;
  g.strokeStyle = c.trim;
  g.beginPath();
  g.arc(0, -1.2, 5.3, Math.PI, 0);
  g.stroke();
}
