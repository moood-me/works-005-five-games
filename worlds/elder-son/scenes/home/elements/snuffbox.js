// The silver snuffbox standing on the oilcloth, seen from the side (its top is the table's painting): between them
// (`box_at` table, x 0) or before Busygin (near, x 0.22). Metres.
const at = e.state.box_at;
if (at === 'table' || at === 'near') {
  const x = at === 'near' ? (e.lib.ON.near[0] - e.lib.ON.box[0]) : 0;
  g.fillStyle = '#c3c6ca';
  g.fillRect(x - 0.045, -0.028, 0.09, 0.028);
  g.fillStyle = '#9a9ea4';
  g.fillRect(x - 0.046, -0.03, 0.092, 0.006);
  g.fillStyle = '#e6e8ea';
  g.fillRect(x - 0.03, -0.018, 0.02, 0.008);
}
