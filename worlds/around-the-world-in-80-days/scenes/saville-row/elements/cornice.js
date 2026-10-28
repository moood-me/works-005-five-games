// The cornice along the row at the parapet's foot, a stone ledge seen from below.
for (const h of e.lib.houses) {
  g.fillStyle = '#bdb8ac';
  g.fillRect(h.x0 - e.lib.plan.row, -0.2, h.x1 - h.x0, 0.4);
  g.fillStyle = 'rgba(0,0,0,0.18)';
  g.fillRect(h.x0 - e.lib.plan.row, -0.2, h.x1 - h.x0, 0.06);
}
