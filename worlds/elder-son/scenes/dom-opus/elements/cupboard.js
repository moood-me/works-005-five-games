// The cupboard in the room: dark varnished wood, glass doors above with the crockery, the shelf where the
// snuffbox stands (`box_at` shelf). Its points: shelf, box. Metres; 1.1 wide, 1.95 high.
const w = 1.1, h = 1.95, shelf = 1.32;
g.fillStyle = '#4a3020';
g.fillRect(-w / 2, -h, w, h);
g.fillStyle = '#3a2418';
g.fillRect(-w / 2 + 0.05, -0.8, w - 0.1, 0.75);
g.fillStyle = 'rgba(150,170,180,0.35)';
g.fillRect(-w / 2 + 0.06, -h + 0.1, w / 2 - 0.09, h - 1.05);
g.fillRect(0.03, -h + 0.1, w / 2 - 0.09, h - 1.05);
g.fillStyle = '#6a4a34';
g.fillRect(-w / 2, -shelf, w, 0.03);
g.fillStyle = '#e6e0d2';
for (const x of [-0.4, -0.25, 0.2, 0.35]) g.fillRect(x, -shelf - 0.16, 0.1, 0.16);
g.fillRect(-0.4, -1.72, 0.8, 0.04);
if (e.state.box_at === 'shelf') {
  g.fillStyle = '#c4c7cb';
  g.fillRect(-0.06, -shelf - 0.05, 0.12, 0.05);
}
e.at(0, -shelf - 0.03, 'box');
e.at(0, -shelf, 'shelf');
