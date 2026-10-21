// The sideboard in the room against its near wall: dark varnished wood, two doors below, the counter, the glazed
// upper part with the crockery on its shelves; the snuffbox on the lower glazed shelf when `box_at` is shelf. Its
// points: shelf, box. Metres; 1.1 wide, 1.95 high.
const w = 1.1, h = 1.95, shelf = e.lib.CUPBOARD.shelf;
g.fillStyle = '#4a3020';
g.fillRect(-w / 2, -h, w, h);
g.fillStyle = '#3a2418';
g.fillRect(-w / 2 + 0.05, -0.82, w / 2 - 0.07, 0.74);
g.fillRect(0.02, -0.82, w / 2 - 0.07, 0.74);
g.fillStyle = '#5e3e2a';
g.fillRect(-w / 2 - 0.03, -0.9, w + 0.06, 0.05);
g.fillRect(-w / 2 - 0.03, -h - 0.04, w + 0.06, 0.07);
g.fillStyle = '#b08a3a';
g.fillRect(-0.07, -0.5, 0.025, 0.06);
g.fillRect(0.045, -0.5, 0.025, 0.06);
// the glazed part: its back, the shelves, the crockery
g.fillStyle = '#2e1e14';
g.fillRect(-w / 2 + 0.06, -h + 0.08, w - 0.12, h - 1.06);
g.fillStyle = '#6a4a34';
g.fillRect(-w / 2 + 0.06, -shelf, w - 0.12, 0.025);
g.fillRect(-w / 2 + 0.06, -1.62, w - 0.12, 0.025);
g.fillStyle = '#e6e0d2';
for (const x of [-0.42, -0.28, 0.24, 0.38]) g.fillRect(x, -shelf - 0.16, 0.09, 0.16);
for (const x of [-0.38, -0.12, 0.14, 0.36]) {
  g.beginPath();
  g.ellipse(x, -1.72, 0.1, 0.09, 0, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#4d6a86';
g.fillRect(-0.24, -shelf - 0.1, 0.07, 0.1);
if (e.state.box_at === 'shelf') {
  g.fillStyle = '#c4c7cb';
  g.fillRect(-0.06, -shelf - 0.04, 0.12, 0.04);
  g.fillStyle = '#9a9ea4';
  g.fillRect(-0.06, -shelf - 0.045, 0.12, 0.008);
}
// the glass doors over it all: a faint sheen, the frames
g.fillStyle = 'rgba(170,190,200,0.16)';
g.fillRect(-w / 2 + 0.06, -h + 0.08, w - 0.12, h - 1.06);
g.strokeStyle = '#5e3e2a';
g.lineWidth = 0.035;
g.strokeRect(-w / 2 + 0.06, -h + 0.08, w / 2 - 0.08, h - 1.06);
g.strokeRect(0.02, -h + 0.08, w / 2 - 0.08, h - 1.06);
e.at(0, -shelf - 0.02, 'box');
e.at(0, -shelf, 'shelf');
