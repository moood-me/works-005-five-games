// The steps up to every door of the row, a plane along their slope (seen from above, y toward the viewer):
// four steps of stone from the pavement to the ground floor, painted only where each house has its door.
const L = e.lib;
const S = L.plan.steps;
const half = 0.694; // half the slope's length
for (const h of L.houses) {
  const x = h.door - L.plan.row;
  g.fillStyle = h.fogg ? '#c9c5ba' : '#a8a498';
  g.fillRect(x - S.w / 2, -half, S.w, 2 * half);
  g.fillStyle = 'rgba(30,28,24,0.35)';
  for (let k = 0; k < 4; k++) g.fillRect(x - S.w / 2, -half + k * (half / 2) + 0.22, S.w, 0.125);
}
