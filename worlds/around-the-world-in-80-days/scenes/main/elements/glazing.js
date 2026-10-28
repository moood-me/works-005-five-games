// The glazing at the back of each window's reveal: its frame, one slender mullion, two transoms — the fog
// seen between them. It marks the windows for the game and the camera.
const P = e.lib.plan;
const W = P.win;
const bw = 0.07;
g.fillStyle = '#1f1c22';
g.strokeStyle = '#1f1c22';
g.lineWidth = 0.08;
P.windows.forEach((c, i) => {
  const x0 = c - W.w / 2;
  const h = W.top - W.sill;
  g.fillRect(c - bw / 2, -W.top, bw, h);
  for (const f of [0.34, 0.67]) g.fillRect(x0, -W.top + h * f - bw / 2, W.w, bw);
  g.strokeRect(x0, -W.top, W.w, h);
  if (c > -20) e.at(c, -(W.top + W.sill) / 2, `window${i + 1}`);
});
