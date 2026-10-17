// on the bench: the splicing press, the rewinder with a reel full of film and paper bookmarks, a pot of cement
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5a4436' : '#3a3a3e'; g.fillRect(-0.28, -0.08, 0.2, 0.08); g.fillRect(-0.24, -0.16, 0.12, 0.08);
g.fillStyle = ruin ? '#6a5040' : '#6a6a70'; g.fillRect(-0.3, -0.18, 0.24, 0.025);
g.fillStyle = '#2e2e32'; g.fillRect(0.12, -0.06, 0.03, 0.06);
if (!ruin) {
  g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(0.135, -0.24, 0.17, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#26272b'; g.beginPath(); g.arc(0.135, -0.24, 0.13, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e8e0c8'; for (const a of [-1.2, -0.6, 0.2]) { g.save(); g.translate(0.135 + Math.cos(a) * 0.13, -0.24 + Math.sin(a) * 0.13); g.rotate(a); g.fillRect(0, -0.008, 0.06, 0.016); g.restore(); }
}
g.fillStyle = '#6a5a40'; g.fillRect(-0.02, -0.07, 0.06, 0.07);
e.at(-0.18, -0.12, 'press');
