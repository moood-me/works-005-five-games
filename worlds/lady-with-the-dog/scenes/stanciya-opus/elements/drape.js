// The curtain inside her window: cream cloth lit from the compartment's lamp behind it (it glows), hung from the
// window's top left, drawn across by `curtain` (animate scales it from its left edge).
const L = e.lib, w = L.WIN.w, y0 = L.WIN.y0, y1 = L.WIN.y1;
e.layer('cloth', { pivot: [-w / 2, y0] }, gc => {
  gc.fillStyle = '#f0d3a2';
  gc.fillRect(-w / 2, y0, w, y1 - y0);
  gc.fillStyle = 'rgba(190,140,80,0.35)';
  for (let x = -w / 2 + 0.05; x < w / 2; x += 0.09) gc.fillRect(x, y0, 0.03, y1 - y0);
  gc.fillStyle = '#d9b47c'; gc.fillRect(-w / 2, y0, w, 0.05);
});
