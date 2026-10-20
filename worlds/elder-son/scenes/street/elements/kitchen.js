// The kitchen window from the street, lit from within: the frost on the glass (`frost`, a party key) grows from the
// corners toward the middle — see-through, warm with the lamp behind it; the glazing bars. The room itself stands
// behind it (k_*, the table, the lamp, the people). Its glow on the snow — `glow` (e.light): 0.55 + 0.45·warm.
const w = 1.2, h = 1.0, f = e.state.frost, warm = e.state.warm;
// the faint warm wash of the lamp in the glass
g.fillStyle = 'rgba(255,190,120,0.10)';
g.fillRect(-w / 2, -h, w, h);
// frost from each corner: feathered fans of pale crystals, reaching in by `frost`
const reach = 0.12 + 0.55 * f;
for (const [cx, cy] of [[-w / 2, 0], [w / 2, 0], [-w / 2, -h], [w / 2, -h]]) {
  const sx = cx < 0 ? 1 : -1, sy = cy < -h / 2 ? 1 : -1;
  for (let i = 0; i < 26; i++) {
    const a = e.rnd() * Math.PI * 0.5;
    const dx = sx * Math.cos(a), dy = sy * Math.sin(a);
    const len = reach * (0.5 + e.rnd() * 0.6) * (cy === 0 ? 1.15 : 0.85);
    g.strokeStyle = `rgba(255,236,214,${0.25 + 0.3 * f})`;
    g.lineWidth = 0.008 + e.rnd() * 0.01;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + dx * len, cy + dy * len);
    for (let b = 1; b < 4; b++) {
      const bx = cx + dx * len * (b / 4), by = cy + dy * len * (b / 4), k = 1 - b / 5;
      g.moveTo(bx, by);
      g.lineTo(bx + (dy * 0.06 + dx * 0.03) * k, by + (-dx * 0.06 + dy * 0.03) * k);
      g.moveTo(bx, by);
      g.lineTo(bx + (-dy * 0.06 + dx * 0.03) * k, by + (dx * 0.06 + dy * 0.03) * k);
    }
    g.stroke();
  }
  const c = g.createRadialGradient(cx, cy, 0, cx, cy, reach * 1.1);
  c.addColorStop(0, `rgba(255,232,206,${0.35 + 0.35 * f})`);
  c.addColorStop(1, 'rgba(255,232,206,0)');
  g.fillStyle = c;
  g.fillRect(-w / 2, -h, w, h);
}
// the glazing bars and the window's inner frame
g.fillStyle = '#e9e2d4';
g.fillRect(-0.025, -h, 0.05, h);
g.fillRect(-w / 2, -h * 0.66, w, 0.04);
g.strokeStyle = '#e9e2d4';
g.lineWidth = 0.05;
g.strokeRect(-w / 2 + 0.025, -h + 0.025, w - 0.05, h - 0.05);
// (the glow at the sill, small: a bloom over the glass would hide the room behind it)
e.light(0, 0.02, 0.3, '#e8963a', 0.55 + 0.45 * warm, 'glow');
e.at(0, -h * 0.5);
