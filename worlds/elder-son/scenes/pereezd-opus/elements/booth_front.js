// The crossing keeper's hut, its front: boards painted a faded green, a gable under snow, the door, the window
// frame (its lit pane is booth_window, just before it), a brick chimney. Metres; 2.7 wide.
const w = 1.35;
const eave = -2.75;
const ridge = -3.85;
// boards
g.fillStyle = '#6c7c70';
g.fillRect(-w, eave, 2 * w, -eave + 0.05);
g.strokeStyle = '#5a685d';
g.lineWidth = 0.025;
for (let y = eave + 0.18; y < 0; y += 0.18) {
  g.beginPath();
  g.moveTo(-w, y);
  g.lineTo(w, y);
  g.stroke();
}
// the plinth, snow banked against it
g.fillStyle = '#4f554f';
g.fillRect(-w, -0.35, 2 * w, 0.4);
g.fillStyle = '#e3e9f1';
g.beginPath();
g.moveTo(-w - 0.2, 0.05);
g.quadraticCurveTo(-0.6, -0.42, 0.2, -0.18);
g.quadraticCurveTo(0.9, -0.05, w + 0.2, -0.3);
g.lineTo(w + 0.2, 0.05);
g.closePath();
g.fill();
// the door
g.fillStyle = '#3f4a43';
g.fillRect(-1.12, -2.05, 0.8, 1.95);
g.strokeStyle = '#2f3732';
g.lineWidth = 0.04;
g.strokeRect(-1.12, -2.05, 0.8, 1.95);
g.fillStyle = '#b8b2a3';
g.fillRect(-0.45, -1.1, 0.06, 0.12);
// the window's frame (white), the opening behind the pane
g.fillStyle = '#d6d2c6';
g.fillRect(0.0, -2.05, 0.9, 1.1);
g.fillStyle = '#2a2621';
g.fillRect(0.06, -1.99, 0.78, 0.98);
// the gable
g.fillStyle = '#5b4f48';
g.beginPath();
g.moveTo(-w - 0.25, eave + 0.02);
g.lineTo(0, ridge);
g.lineTo(w + 0.25, eave + 0.02);
g.closePath();
g.fill();
// the chimney
g.fillStyle = '#6a4a3f';
g.fillRect(0.55, -4.2, 0.36, 1.0);
g.fillStyle = '#e3e9f1';
g.fillRect(0.5, -4.27, 0.46, 0.1);
// snow thick along the roof
g.fillStyle = '#e8eef5';
g.beginPath();
g.moveTo(-w - 0.32, eave + 0.04);
g.lineTo(0, ridge - 0.14);
g.lineTo(w + 0.32, eave + 0.04);
g.lineTo(w + 0.1, eave + 0.1);
g.lineTo(0, ridge + 0.14);
g.lineTo(-w - 0.1, eave + 0.1);
g.closePath();
g.fill();
// an icicle or two
g.fillStyle = '#cfd9e6';
for (const x of [-1.2, -0.9, 0.7, 1.05]) {
  g.beginPath();
  g.moveTo(x - 0.03, eave + 0.08);
  g.lineTo(x, eave + 0.32);
  g.lineTo(x + 0.03, eave + 0.08);
  g.fill();
}
