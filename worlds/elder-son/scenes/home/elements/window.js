// The kitchen window's glass from inside: the frost (a play key, `frost`) grown from each pane's corners in toward its
// middle — see-through: the night, the gardens and their lights show through it; the hole the game rubs (`hole`) is
// cut by the shader (window.wgsl) in the lower right pane, round the point `pane`. The frame and its bars are
// `window_frame`, in front. Metres; 1.2 × 1.0, the sill at 0, x = across − the window's middle.
const L = e.lib, W = L.WINDOW, f = e.state.frost, P = L.PANE;
const w = W.w, h = W.h, bar = -h + L.TRANSOM;
// the panes: the two lower leaves and the two upper lights over the transom
const panes = [[-w / 2, bar, 0, 0], [0, bar, w / 2, 0], [-w / 2, -h, 0, bar], [0, -h, w / 2, bar]];
const reachOf = (x0, y0, x1, y1) => Math.min(x1 - x0, y1 - y0) * (0.25 + 0.55 * f);
for (const [x0, y0, x1, y1] of panes) {
  const reach = reachOf(x0, y0, x1, y1);
  for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) {
    const sx = cx === x0 ? 1 : -1, sy = cy === y0 ? 1 : -1;
    // a frosted bloom in the corner, then the ferns growing out of it
    const c = g.createRadialGradient(cx, cy, 0, cx, cy, reach * 1.15);
    c.addColorStop(0, `rgba(226,234,246,${0.45 + 0.35 * f})`);
    c.addColorStop(0.6, `rgba(220,230,244,${0.15 + 0.2 * f})`);
    c.addColorStop(1, 'rgba(220,230,244,0)');
    g.fillStyle = c;
    g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.strokeStyle = `rgba(236,242,252,${0.35 + 0.35 * f})`;
    for (let i = 0; i < 14; i++) {
      const a = (0.08 + e.rnd() * 0.84) * Math.PI / 2, dx = sx * Math.cos(a), dy = sy * Math.sin(a);
      const len = reach * (0.55 + e.rnd() * 0.6);
      g.lineWidth = 0.004 + e.rnd() * 0.006;
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + dx * len, cy + dy * len);
      for (let b = 1; b < 5; b++) {
        const bx = cx + dx * len * (b / 5), by = cy + dy * len * (b / 5), k = (1 - b / 6) * len * 0.22;
        g.moveTo(bx, by);
        g.lineTo(bx + (dy * 0.8 + dx * 0.5) * k, by + (-dx * 0.8 + dy * 0.5) * k);
        g.moveTo(bx, by);
        g.lineTo(bx + (-dy * 0.8 + dx * 0.5) * k, by + (dx * 0.8 + dy * 0.5) * k);
      }
      g.stroke();
    }
  }
  // a thin veil over the whole pane, thicker as the frost grows
  g.fillStyle = `rgba(214,224,240,${0.05 + 0.22 * f})`;
  g.fillRect(x0, y0, x1 - x0, y1 - y0);
}
e.at(P[0], P[1], 'pane');
e.at(0, -h / 2);
