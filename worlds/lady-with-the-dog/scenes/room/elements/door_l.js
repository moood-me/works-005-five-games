// A leaf of the balcony door, open into the room (metres from its hinge): a white frame, six panes of glass.
const W = 0.6, s = 1;
g.fillStyle = '#e2ddd2';
g.fillRect(Math.min(0, s * W), -2.5, W, 2.5);
g.fillStyle = '#5c6684';
for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
  const x = Math.min(0, s * W) + 0.07 + c * 0.25, y = -2.42 + r * 0.6;
  g.fillRect(x, y, 0.21, 0.52);
}
g.fillStyle = 'rgba(200,210,240,0.25)';
for (let r = 0; r < 3; r++) g.fillRect(Math.min(0, s * W) + 0.07, -2.42 + r * 0.6, 0.06, 0.52);
g.fillStyle = '#e2ddd2'; g.fillRect(Math.min(0, s * W), -0.6, W, 0.6);
g.fillStyle = '#b8b2a5'; g.fillRect(Math.min(0, s * W) + 0.06, -0.52, W - 0.12, 0.44);
