// The orange silk lampshade over the table: a dome turned on a lathe (a form — seen from below and from every side), its
// pleats, a band of braid at the top, the fringe's band round its rim. It glows (its silk lit through by the bulb under
// it, the scene's light `lamp`) — dull brown silk when the lamp is out. The painting is the way round (1.6) by the
// profile's length (0.46), its top at y −0.46.
const lit = e.state.lamp > 0.05;
g.fillStyle = lit ? '#ef8d36' : '#6e4a32';
g.fillRect(-0.8, -0.46, 1.6, 0.46);
const glow = g.createLinearGradient(0, -0.46, 0, 0);
glow.addColorStop(0, 'rgba(255,214,140,0.0)');
glow.addColorStop(0.7, 'rgba(255,214,140,0.25)');
glow.addColorStop(1, 'rgba(255,214,140,0.1)');
if (lit) {
  g.fillStyle = glow;
  g.fillRect(-0.8, -0.46, 1.6, 0.46);
}
g.strokeStyle = 'rgba(176,82,24,0.45)';
g.lineWidth = 0.008;
for (let x = -0.8; x < 0.8; x += 0.05) {
  g.beginPath();
  g.moveTo(x, -0.44);
  g.lineTo(x, -0.06);
  g.stroke();
}
g.fillStyle = lit ? '#c4621e' : '#5a3a26';
g.fillRect(-0.8, -0.46, 1.6, 0.035);
g.fillStyle = lit ? '#b8571a' : '#4e3222';
g.fillRect(-0.8, -0.06, 1.6, 0.06);
g.fillStyle = lit ? '#f2b05e' : '#7a5a40';
for (let x = -0.8; x < 0.8; x += 0.025) g.fillRect(x, -0.055, 0.01, 0.055);
e.form(e.kit.revolve([[0.05, 0.32], [0.1, 0.3], [0.2, 0.23], [0.29, 0.12], [0.34, 0.04], [0.36, 0]]), { closed: 'u', ground: lit ? '#e27c2c' : '#6e4a32' });
