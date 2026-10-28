// The hut's side wall toward us: boards, a small dark window, the roof's edge heavy with snow. Metres; 2.3 deep.
const w = 1.15;
const eave = -2.75;
g.fillStyle = '#65756a';
g.fillRect(-w, eave, 2 * w, -eave + 0.05);
g.strokeStyle = '#55635a';
g.lineWidth = 0.025;
for (let y = eave + 0.18; y < 0; y += 0.18) {
  g.beginPath();
  g.moveTo(-w, y);
  g.lineTo(w, y);
  g.stroke();
}
g.fillStyle = '#4f554f';
g.fillRect(-w, -0.35, 2 * w, 0.4);
g.fillStyle = '#d6d2c6';
g.fillRect(-0.3, -1.95, 0.6, 0.7);
g.fillStyle = '#1e2124';
g.fillRect(-0.25, -1.9, 0.5, 0.6);
// the roof's edge: its slope seen end-on, snow on it
g.fillStyle = '#5b4f48';
g.fillRect(-w - 0.25, eave - 0.18, 2 * w + 0.5, 0.2);
g.fillStyle = '#e8eef5';
g.beginPath();
g.moveTo(-w - 0.3, eave - 0.16);
g.quadraticCurveTo(0, eave - 0.48, w + 0.3, eave - 0.16);
g.closePath();
g.fill();
g.fillStyle = '#e3e9f1';
g.beginPath();
g.moveTo(-w - 0.2, 0.05);
g.quadraticCurveTo(0, -0.5, w + 0.2, 0.05);
g.closePath();
g.fill();
