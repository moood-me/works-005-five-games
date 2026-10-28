// The calendar on the deckhouse: a board with its pad of leaves — the day's leaf on top (layer `leaf`, its back
// `leaf_back`), turned up over the top by `leaf` (the animate); under it the next leaf: the same day again —
// Wednesday, the twentieth of November (the «General Grant» has crossed the hundred-and-eightieth meridian). Its point
// calendar#leaf.
const L = e.lib;
const sheet = (g, back) => {
  L.rect(g, -0.25, -0.38, 0.5, 0.36, back ? '#e2dccc' : '#f4efe2');
  if (back) return;
  L.rect(g, -0.25, -0.38, 0.5, 0.08, '#a8302a');
  g.textAlign = 'center';
  g.fillStyle = '#f4efe2';
  g.font = 'bold 0.05px serif';
  g.fillText(tr('NOVEMBER'), 0, -0.32);
  g.fillStyle = '#1e1e20';
  g.font = 'bold 0.17px serif';
  g.fillText('20', 0, -0.13);
  g.font = 'bold 0.055px serif';
  g.fillText(tr('WEDNESDAY'), 0, -0.05);
};
e.layer('board', {}, g => {
  L.rect(g, -0.3, -0.44, 0.6, 0.46, '#6a4a30');
  L.rect(g, -0.27, -0.4, 0.54, 0.4, '#d8d0bc');
});
e.layer('under', {}, g => sheet(g, false));
e.layer('leaf', { pivot: [0, -0.38] }, g => sheet(g, false));
e.layer('leaf_back', { pivot: [0, -0.38] }, g => sheet(g, true));
e.at(0, -0.2, 'leaf');
