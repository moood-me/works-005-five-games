// The kitchen window from inside: its white frame and sill, glazing bars, the frost on the glass from the corners in
// by `frost` (a party key) — see-through: the night and the gardens show through. Metres; 1.2 × 1.1, the sill at 0.
const w = 1.2, h = 1.1, f = e.state.frost;
const reach = 0.12 + 0.55 * f;
for (const [cx, cy] of [[-w / 2, 0], [w / 2, 0], [-w / 2, -h], [w / 2, -h]]) {
  const sx = cx < 0 ? 1 : -1, sy = cy < -h / 2 ? 1 : -1;
  for (let i = 0; i < 26; i++) {
    const a = e.rnd() * Math.PI * 0.5, dx = sx * Math.cos(a), dy = sy * Math.sin(a);
    const len = reach * (0.5 + e.rnd() * 0.6) * (cy === 0 ? 1.15 : 0.85);
    g.strokeStyle = `rgba(226,236,250,${0.3 + 0.3 * f})`;
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
  c.addColorStop(0, `rgba(222,232,246,${0.4 + 0.35 * f})`);
  c.addColorStop(1, 'rgba(222,232,246,0)');
  g.fillStyle = c;
  g.fillRect(-w / 2, -h, w, h);
}
// the frame, the bars, the sill board
g.fillStyle = '#e4ddd0';
g.fillRect(-w / 2 - 0.1, -h - 0.1, 0.1, h + 0.1);
g.fillRect(w / 2, -h - 0.1, 0.1, h + 0.1);
g.fillRect(-w / 2 - 0.1, -h - 0.1, w + 0.2, 0.1);
g.fillRect(-0.03, -h, 0.06, h);
g.fillRect(-w / 2, -h * 0.66, w, 0.05);
g.fillRect(-w / 2 - 0.16, -0.02, w + 0.32, 0.1);
// a short curtain on a string across the bottom
g.fillStyle = 'rgba(214,200,170,0.85)';
g.fillRect(-w / 2, -h * 0.34, w, h * 0.34);
g.strokeStyle = 'rgba(150,130,100,0.6)';
g.lineWidth = 0.01;
for (let x = -w / 2 + 0.05; x < w / 2; x += 0.08) {
  g.beginPath();
  g.moveTo(x, -h * 0.34);
  g.lineTo(x, 0);
  g.stroke();
}
e.at(0, -h * 0.6, 'pane');
e.at(0, -h * 0.5);
