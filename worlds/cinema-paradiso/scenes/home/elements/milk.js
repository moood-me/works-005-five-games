// The boy's glass on the table: plain glass (layer `glass`), the milk in it a layer that rises by `milk` (animate).
// (only at the 1949 supper and the photo: in 1958 and 1988 the table is cleared)
if (e.state.era === 'now' || !e.state.table_set) return;
e.layer('milk', { pivot: [0, 0] }, l => {
  l.fillStyle = '#f2eee4'; l.fillRect(-0.032, -0.1, 0.064, 0.1);
});
e.layer('glass', {}, l => {
  l.strokeStyle = 'rgba(220,230,235,0.55)'; l.lineWidth = 0.006;
  l.beginPath(); l.moveTo(-0.036, -0.12); l.lineTo(-0.032, 0); l.lineTo(0.032, 0); l.lineTo(0.036, -0.12); l.stroke();
  l.fillStyle = 'rgba(220,230,235,0.12)'; l.fillRect(-0.034, -0.12, 0.068, 0.12);
});
e.at(0, -0.08);
