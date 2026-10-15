
// the bench's top from above: the rewinder's base, the paper bookmarks; after the cutting, the snipped frames
const clips = e.state.clips;
g.fillStyle = '#5a4430'; g.fillRect(-0.25, -0.55, 0.5, 1.1);
g.fillStyle = '#e8e0c8'; for (let k = 0; k < 4; k++) g.fillRect(-0.15 + k * 0.05, -0.4, 0.03, 0.09);
if (clips) for (let k = 0; k < 6; k++) {
  g.save(); g.translate(-0.05 + (k % 3) * 0.06, 0.2 + Math.floor(k / 3) * 0.08); g.rotate(k * 0.7);
  g.fillStyle = '#2a2826'; g.fillRect(-0.035, -0.015, 0.07, 0.03); g.fillStyle = '#b8b4a8'; g.fillRect(-0.025, -0.01, 0.05, 0.02); g.restore();
}
